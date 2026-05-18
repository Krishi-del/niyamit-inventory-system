// frontend/src/components/Dashboard.jsx
import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { products, loading } = useContext(ProductContext);
  const navigate = useNavigate();

  // Logout with confirmation
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const productList = Array.isArray(products) ? products : [];

  const totalProducts = productList.length;
  const lowStockItems = productList.filter((product) => product.stock > 0 && product.stock < 10);
  const outOfStock = productList.filter((product) => product.stock === 0).length;
  const totalInventoryValue = productList.reduce((total, product) => total + product.price * product.stock, 0);
  const highestValueProduct =
    productList.length > 0
      ? productList.reduce((max, item) => (item.price * item.stock > max.price * max.stock ? item : max))
      : null;

  const chartData = productList.map((p) => ({
    name: p.name,
    stock: p.stock,
  }));

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      {/* Header with Logout */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Dashboard</h2>
        <button
          onClick={handleLogout}
          style={{
            background: "#764ba2",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid" style={{ marginTop: "20px" }}>
        <div className="card">
          <h4>Total Products</h4>
          <h2>{totalProducts}</h2>
        </div>

        <div className="card">
          <h4>Low Stock Items</h4>
          <h2>{lowStockItems.length}</h2>
        </div>

        <div className="card">
          <h4>Out of Stock</h4>
          <h2>{outOfStock}</h2>
        </div>

        <div className="card">
          <h4>Total Inventory Value</h4>
          <h2>₹{totalInventoryValue}</h2>
        </div>
      </div>

      {/* Highest Value Product */}
      {highestValueProduct && (
        <div className="card" style={{ marginTop: "30px" }}>
          <h3>Top Inventory Item</h3>
          <p>
            <strong>{highestValueProduct.name}</strong> ({highestValueProduct.category})
          </p>
          <p>Total Value: ₹{highestValueProduct.price * highestValueProduct.stock}</p>
        </div>
      )}

      {/* Low Stock List */}
      {lowStockItems.length > 0 && (
        <div className="card" style={{ marginTop: "30px" }}>
          <h3>⚠ Low Stock Alert</h3>
          <ul>
            {lowStockItems.map((item) => (
              <li key={item._id || item.id}>
                {item.name} – {item.stock} kg remaining
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Stock Levels Bar Chart */}
      <div className="card" style={{ marginTop: "40px", padding: "20px" }}>
        <h3>Stock Levels</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="stock">
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.stock < 10 ? "#ff4d4f" : "#8884d8"} // red if low-stock
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;