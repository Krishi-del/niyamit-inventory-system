// frontend/src/pages/Products.jsx
import { useContext, useState } from "react";
import { ProductContext } from "../context/ProductContext";

function Products() {
  const { products, addProduct, deleteProduct, loading } = useContext(ProductContext);

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Vegetable",
    price: "",
    stock: "",
  });

  const handleChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      alert("Please fill all fields");
      return;
    }

    await addProduct({
      name: newProduct.name,
      category: newProduct.category,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
    });

    setNewProduct({
      name: "",
      category: "Vegetable",
      price: "",
      stock: "",
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
    }
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>Products</h2>

      <div style={{ margin: "20px 0" }}>
        <h3>Add New Product</h3>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={handleChange}
        />
        <select name="category" value={newProduct.category} onChange={handleChange}>
          <option value="Vegetable">Vegetable</option>
          <option value="Fruit">Fruit</option>
        </select>
        <input
          type="number"
          name="price"
          placeholder="Price per kg"
          value={newProduct.price}
          onChange={handleChange}
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock (kg)"
          value={newProduct.stock}
          onChange={handleChange}
        />
        <button onClick={handleAddProduct}>Add</button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price (₹/kg)</th>
            <th>Stock (kg)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>{p.price}</td>
              <td
                style={{
                  fontWeight: "bold",
                  color:
                    p.stock === 0 ? "red" : p.stock < 10 ? "orange" : "green",
                }}
              >
                {p.stock}
              </td>
              <td>
                <button
                  onClick={() => handleDelete(p._id)}
                  style={{
                    background: "red",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Products;