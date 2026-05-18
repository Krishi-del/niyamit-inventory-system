import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Niyamit Admin</h2>
      <Link to="/">Dashboard</Link>
      <Link to="/products">Products</Link>
      <Link to="/categories">Categories</Link>
      <Link to="/analytics">Analytics</Link>
    </div>
  );
}

export default Sidebar;