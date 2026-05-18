// frontend/src/context/ProductContext.js
import { createContext, useState, useEffect } from "react";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:5001/products"; // your backend endpoint

  // Get JWT token from localStorage
  const token = localStorage.getItem("token"); // after login, store token here

  // Fetch products from backend
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(API, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // important!
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []); // ensure it's an array
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]); // prevent dashboard crash
    } finally {
      setLoading(false);
    }
  };

  // Add a product
  const addProduct = async (product) => {
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setProducts((prev) => [...prev, data]);
    } catch (err) {
      console.error("Failed to add product:", err);
    }
  };

  // Delete a product
  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  useEffect(() => {
    if (token) fetchProducts();
    else {
      console.warn("No token found. Please login first.");
      setLoading(false);
    }
  }, [token]);

  return (
    <ProductContext.Provider
      value={{ products, addProduct, deleteProduct, loading }}
    >
      {children}
    </ProductContext.Provider>
  );
};