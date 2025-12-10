import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  // Registro
  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }

    try {
      const res = await axios.post("/auth/signup", { name, email, password });
      // Salva token no localStorage, se seu backend retornar token
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      set({ user: res.data.user || res.data, loading: false });
      toast.success("Signup successful");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Signup failed");
    }
  },

  // Login
  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await axios.post("/auth/login", { email, password });

      // Salva token no localStorage
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      set({ user: res.data.user || null, loading: false });
      toast.success("Login successful");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Login failed");
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const res = await axios.get("/auth/profile");
      set({ user: res.data, checkingAuth: false });
    } catch (error) {
      set({ checkingAuth: false, user: null });
    }
  },

  // Logout
  logout: async () => {
    try {
      await axios.post("/auth/logout");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    } finally {
      localStorage.removeItem("token"); // remove token
      set({ user: null });
      toast.success("Logged out successfully");
    }
  },
}));

// implement the axios interceptor to for token
let refreshPromise = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If a refresh is already in progress, wait for it to complete
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        // Start a new refresh process
        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login or handle as needed
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
