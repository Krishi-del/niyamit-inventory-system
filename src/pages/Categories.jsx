import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";

function Categories() {
  const { products } = useContext(ProductContext);

  const fruitCount = products.filter(
    (item) => item.category === "Fruit"
  ).length;

  const vegetableCount = products.filter(
    (item) => item.category === "Vegetable"
  ).length;

  return (
    <div>
      <h2>Categories Overview</h2>

      <div className="grid" style={{ marginTop: "20px" }}>
        <div className="card">
          <h3>Fruits</h3>
          <p>Total Items: {fruitCount}</p>
        </div>

        <div className="card">
          <h3>Vegetables</h3>
          <p>Total Items: {vegetableCount}</p>
        </div>
      </div>
    </div>
  );
}

export default Categories;