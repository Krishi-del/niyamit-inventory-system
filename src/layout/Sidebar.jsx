import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div style={{
      width: "220px",
      height: "100vh",
      background: "#1e293b",
      color: "white",
      padding: "20px"
    }}>
      <h2>Niyamit Admin</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li><Link to="/" style={{ color: "white", textDecoration: "none" }}>Dashboard</Link></li>
        <li><Link to="/products" style={{ color: "white", textDecoration: "none" }}>Products</Link></li>
        <li><Link to="/categories" style={{ color: "white", textDecoration: "none" }}>Categories</Link></li>
        <li><Link to="/analytics" style={{ color: "white", textDecoration: "none" }}>Analytics</Link></li>
      </ul>
    </div>
  );
}
const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

<button onClick={handleLogout}>Logout</button>
export default Sidebar;