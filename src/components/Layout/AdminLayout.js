import React from "react";
import { useNavigate, Link } from "react-router-dom";
import classes from "./AdminLayout.module.css";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated"); // Xóa token và chuyển về trang login
    navigate("/admin/login");
  };

  return (
    <div className={classes.adminLayout}>
      <nav className={classes.sidebar}>
        <div className={classes.logo}>
          <h2>Quản trị viên</h2>
        </div>
        <ul className={classes.navLinks}>
          <li>
            <Link to="/admin/dashboard" className={classes.navItem}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/orders" className={classes.navItem}>
              Đơn hàng
            </Link>
          </li>
          <li>
            <Link to="/admin/products" className={classes.navItem}>
              Sản phẩm
            </Link>
          </li>
          {/* <li>
            <Link to="/admin/users" className={classes.navItem}>Người dùng</Link>
          </li>
          <li>
            <Link to="/admin/statistics" className={classes.navItem}>Thống kê</Link>
          </li> */}
        </ul>
        <button className={classes.logoutButton} onClick={handleLogout}>
          Đăng xuất
        </button>
      </nav>
      <main className={classes.content}>{children}</main>
    </div>
  );
};

export default AdminLayout;
