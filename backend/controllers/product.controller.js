import Product from "../models/product.model.js";
import cloudinary from "../lib/cloudinary.js";
import { redis } from "../lib/redis.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featuredProducts");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }

    // if not in cache, fetch from database
    // .lean() to get plain JS objects instead of Mongoose documents
    // which improves performance
    featuredProducts = await Product.find({ isFeatured: true }).lean();

    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }

    // store in cache for future requests
    await redis.set("featuredProducts", JSON.stringify(featuredProducts));
    return res.json(featuredProducts);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({ message: "Failed to fetch featured products" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, stock, image, isFeatured } =
      req.body;

    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const product = new Product({
      name,
      price,
      description,
      category,
      stock,
      image: cloudinaryResponse?.secure_url || "",
      isFeatured: isFeatured || false,
    });

    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      product: savedProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Failed to create product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0]; // this assumes the image URL ends with the public ID and extension
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("Image deleted from Cloudinary");
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
      }
    }
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $sample: { size: 3 } },
      { $project: { _id: 1, name: 1, price: 1, image: 1, description: 1 } },
    ]);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching recommended products:", error);
    res.status(500).json({ message: "Failed to fetch recommended products" });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Failed to fetch products by category" });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      await updateFeaturedProductCache();
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error toggling featured status:", error);
    res.status(500).json({ message: "Failed to toggle featured status" });
  }
};

async function updateFeaturedProductCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.error("Error updating featured products cache:", error);
  }
}
