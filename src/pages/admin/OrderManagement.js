import React, { useState, useEffect } from "react";
import classes from "./OrderManagement.module.css";
import { database } from "../../firebase/config";
import { ref, onValue, remove, update } from "firebase/database";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0); // Biến lưu tổng doanh thu
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ordersRef = ref(database, "orders"); // Tham chiếu đến node orders
    const unsubscribe = onValue(
      ordersRef,
      (snapshot) => {
        setLoading(true); // Bắt đầu loading khi có dữ liệu mới
        setError(null); // Xóa lỗi cũ
        const data = snapshot.val();
        const loadedOrders = [];
        let calculatedRevenue = 0; // Biến tính tổng doanh thu

        if (data) {
          for (const key in data) {
            const order = {
              id: key,
              ...data[key],
            };

            // Tính toán tổng tiền cho mỗi đơn hàng từ orderedItems, sử dụng 'amount'
            const itemsTotal =
              (order.orderedItems &&
                Array.isArray(order.orderedItems) &&
                order.orderedItems.reduce(
                  (sum, item) => sum + (item.price || 0) * (item.amount || 0),
                  0
                )) ||
              0;

            // Ưu tiên tổng từ orderedItems, sau đó đến totalAmount, rồi total
            const orderTotal =
              itemsTotal > 0
                ? itemsTotal
                : order.totalAmount || order.total || 0;

            // Thêm trường totalAmount đã tính vào order object
            order.totalAmount = orderTotal;

            loadedOrders.push(order);
            // Cộng tổng tiền đơn hàng vào doanh thu, đảm bảo là số
            calculatedRevenue += parseFloat(orderTotal) || 0; // Sử dụng orderTotal đã tính
          }
        }

        // Đảo ngược thứ tự đơn hàng để hiển thị mới nhất trước
        loadedOrders.reverse();
        setOrders(loadedOrders);
        setTotalRevenue(calculatedRevenue); // Cập nhật tổng doanh thu đã tính
        setLoading(false);
      },
      (error) => {
        console.error("Lỗi khi lấy đơn hàng:", error);
        setError("Không thể tải đơn hàng.");
        setLoading(false);
      }
    );

    // Dọn dẹp subscription
    return () => {
      unsubscribe();
    };
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setLoading(true); // Hiển thị loading khi đang cập nhật
      const orderRef = ref(database, `orders/${orderId}`);
      await update(orderRef, { status: newStatus });
      // Không cần fetch lại thủ công, onValue listener sẽ xử lý
      setLoading(false); // Ẩn loading
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      setLoading(false); // Ẩn loading
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
      try {
        setLoading(true); // Hiển thị loading khi đang xóa
        const orderRef = ref(database, `orders/${orderId}`);
        await remove(orderRef);
        // Không cần fetch lại thủ công, onValue listener sẽ xử lý
        setLoading(false); // Ẩn loading
      } catch (error) {
        console.error("Lỗi khi xóa đơn hàng:", error);
        setError("Không thể xóa đơn hàng.");
        setLoading(false); // Ẩn loading
      }
    }
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "N/A";
    try {
      return `${parseFloat(amount).toLocaleString("vi-VN")} VND`;
    } catch (error) {
      console.error("Lỗi khi định dạng tiền tệ:", error);
      return "N/A";
    }
  };

  if (loading) {
    return <div className={classes.loading}>Đang tải đơn hàng...</div>;
  }

  if (error) {
    return <div className={classes.error}>Lỗi: {error}</div>;
  }

  return (
    <div className={classes.orderManagement}>
      <h1>Quản lý đơn hàng</h1>

      {/* Hiển thị tổng doanh thu */}
      <div className={classes.totalRevenue}>
        <h3>Tổng doanh thu: {formatCurrency(totalRevenue)}</h3>
      </div>

      {orders.length === 0 ? (
        <p>Chưa có đơn hàng nào.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID Đơn hàng</th>
              <th>Tên khách hàng</th>
              <th>Số điện thoại</th>
              <th>Địa chỉ</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user?.name || "N/A"}</td>
                <td>{order.user?.postalCode || "N/A"}</td>
                <td>
                  {`${order.user?.street || ""}, ${
                    order.user?.city || ""
                  }`.trim()}
                </td>
                <td>{formatCurrency(order.totalAmount)}</td>
                <td>
                  <select
                    value={order.status || "pending"}
                    onChange={(e) =>
                      handleUpdateStatus(order.id, e.target.value)
                    }
                    className={classes.statusSelect}
                  >
                    <option value="Chờ nhé ">Chờ xử lý</option>
                    <option value="Đang làm đây">Đang xử lý</option>
                    <option value="okok">Hoàn thành</option>
                    <option value="bom">Đã hủy</option>
                  </select>
                </td>
                <td>
                  <button
                    className={classes.actionBtn}
                    onClick={() => console.log("View details for", order.id)}
                    disabled={loading}
                  >
                    Xem chi tiết
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className={classes.deleteBtn}
                    disabled={loading}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderManagement;
