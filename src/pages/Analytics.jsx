import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";

function Analytics() {
  const { products } = useContext(ProductContext);

  const totalStock = products.reduce(
    (total, item) => total + item.stock,
    0
  );

  const totalValue = products.reduce(
    (total, item) => total + item.stock * item.price,
    0
  );

  const lowStock = products.filter(
    (item) => item.stock > 0 && item.stock < 10
  ).length;

  return (
    <div>
      <h2>Inventory Analytics</h2>

      <div className="grid" style={{ marginTop: "20px" }}>
        <div className="card">
          <h3>Total Stock Units</h3>
          <h2>{totalStock}</h2>
        </div>

        <div className="card">
          <h3>Total Inventory Value</h3>
          <h2>₹{totalValue}</h2>
        </div>

        <div className="card">
          <h3>Low Stock Items</h3>
          <h2>{lowStock}</h2>
        </div>
      </div>
    </div>
  );
}

export default Analytics;