import Sidebar from "../layout/Sidebar";

function Layout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ padding: "20px", flex: 1 }}>
        {children}
      </div>
    </div>
  );
}

export default Layout;