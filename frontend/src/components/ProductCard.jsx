import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const ProductCard = ({ product }) => {
  const { user } = useUserStore();
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add products to cart", { id: "login" });
      return;
    } else {
      // add to cart
      addToCart(product);
    }
  };

  return (
    <div className="flex flex-col w-full overflow-hidden rounded-lg border border-gray-700 shadow-lg bg-gray-800">
      {/* Image */}
      <div className="relative mx-4 mt-4 flex h-60 overflow-hidden rounded-xl">
        <img
          className="object-cover w-full h-full"
          src={product.image}
          alt="product image"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20" />
      </div>

      {/* Content */}
      <div className="flex flex-col px-6 pt-6 pb-6 gap-4">
        {/* Nome */}
        <h5 className="text-xl font-semibold tracking-tight text-white">
          {product.name}
        </h5>

        {/* Preço */}
        <p className="text-3xl font-bold text-emerald-400">${product.price}</p>

        {/* Botão */}
        <button
          className="flex items-center justify-center rounded-lg bg-emerald-600 py-3 px-5 text-sm font-medium
            text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
          onClick={handleAddToCart}
        >
          <ShoppingCart size={22} className="mr-2" />
          Adicionar ao carrinho
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
