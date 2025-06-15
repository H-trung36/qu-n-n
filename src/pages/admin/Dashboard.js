import React, { useState, useEffect } from "react";
import classes from "./Dashboard.module.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching dashboard data...");

        // Sử dụng REST API của Firebase
        const [ordersResponse, mealsResponse, usersResponse] =
          await Promise.all([
            fetch("https://food-3dc6b-default-rtdb.firebaseio.com/orders.json"),
            fetch("https://food-3dc6b-default-rtdb.firebaseio.com/meals.json"),
            fetch("https://food-3dc6b-default-rtdb.firebaseio.com/users.json"),
          ]);

        const orders = (await ordersResponse.json()) || {};
        const meals = (await mealsResponse.json()) || {};
        const users = (await usersResponse.json()) || {};

        console.log("Data fetched successfully");

        // Tính tổng doanh thu
        let totalRevenue = 0;
        Object.values(orders).forEach((order) => {
          const orderTotal =
            order.orderedItems?.reduce(
              (sum, item) => sum + (item.price || 0) * (item.amount || 0),
              0
            ) || 0;
          totalRevenue += orderTotal;
        });

        setStats({
          totalOrders: Object.keys(orders).length,
          totalRevenue,
          totalProducts: Object.keys(meals).length,
          totalUsers: Object.keys(users).length,
        });

        // Lấy đơn hàng gần đây
        const loadedOrders = [];
        for (const key in orders) {
          const order = {
            id: key,
            ...orders[key],
          };

          const orderTotal =
            order.orderedItems?.reduce(
              (sum, item) => sum + (item.price || 0) * (item.amount || 0),
              0
            ) || 0;

          loadedOrders.push({
            ...order,
            totalAmount: orderTotal,
          });
        }

        const sortedOrders = loadedOrders
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setRecentOrders(sortedOrders);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(error.message || "Không thể tải dữ liệu dashboard.");
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (amount) => {
    return `${parseFloat(amount).toLocaleString("vi-VN")} VND`;
  };

  if (loading) {
    return <div className={classes.loading}>Đang tải...</div>;
  }

  if (error) {
    return <div className={classes.error}>{error}</div>;
  }

  return (
    <div className={classes.dashboard}>
      <h1>Dashboard</h1>

      <div className={classes.statsGrid}>
        <div className={classes.statCard}>
          <h3>Tổng đơn hàng</h3>
          <p>{stats.totalOrders}</p>
        </div>
        <div className={classes.statCard}>
          <h3>Tổng doanh thu</h3>
          <p>{formatCurrency(stats.totalRevenue)}</p>
        </div>
        <div className={classes.statCard}>
          <h3>Tổng sản phẩm</h3>
          <p>{stats.totalProducts}</p>
        </div>
        <div className={classes.statCard}>
          <h3>Tổng người dùng</h3>
          <p>{stats.totalUsers}</p>
        </div>
      </div>

      <div className={classes.recentOrders}>
        <h2>Đơn hàng gần đây</h2>
        {recentOrders.length === 0 ? (
          <p>Chưa có đơn hàng nào.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Khách hàng</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.user?.name || "N/A"}</td>
                  <td>{formatCurrency(order.totalAmount)}</td>
                  <td>{order.status || "Chờ xử lý"}</td>
                  <td>{new Date(order.createdAt).toLocaleString("vi-VN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
