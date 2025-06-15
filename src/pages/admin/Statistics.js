import { useState, useEffect } from 'react';
import classes from './Statistics.module.css';

const Statistics = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    topProducts: [],
    recentOrders: [],
    dailyRevenue: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    fetchStatistics();
  }, [timeRange]);

  const fetchStatistics = async () => {
    try {
      // Lấy dữ liệu đơn hàng
      const ordersResponse = await fetch('https://food-3dc6b-default-rtdb.firebaseio.com/orders.json');
      const ordersData = await ordersResponse.json();
      
      // Lấy dữ liệu sản phẩm
      const productsResponse = await fetch('https://food-3dc6b-default-rtdb.firebaseio.com/meals.json');
      const productsData = await productsResponse.json();

      // Xử lý dữ liệu đơn hàng
      const orders = [];
      for (const key in ordersData) {
        orders.push({
          id: key,
          ...ordersData[key]
        });
      }

      // Lọc đơn hàng theo khoảng thời gian
      const now = new Date();
      const filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.date);
        const diffTime = Math.abs(now - orderDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        switch (timeRange) {
          case 'week':
            return diffDays <= 7;
          case 'month':
            return diffDays <= 30;
          case 'year':
            return diffDays <= 365;
          default:
            return true;
        }
      });

      // Tính toán thống kê
      const totalOrders = filteredOrders.length;
      const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Tính toán sản phẩm bán chạy
      const productSales = {};
      filteredOrders.forEach(order => {
        order.items.forEach(item => {
          if (!productSales[item.id]) {
            productSales[item.id] = {
              id: item.id,
              name: item.name,
              quantity: 0,
              revenue: 0
            };
          }
          productSales[item.id].quantity += item.amount;
          productSales[item.id].revenue += item.price * item.amount;
        });
      });

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Tính toán doanh thu theo ngày
      const dailyRevenue = {};
      filteredOrders.forEach(order => {
        const date = new Date(order.date).toLocaleDateString('vi-VN');
        if (!dailyRevenue[date]) {
          dailyRevenue[date] = 0;
        }
        dailyRevenue[date] += order.totalAmount;
      });

      const dailyRevenueArray = Object.entries(dailyRevenue)
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setStats({
        totalOrders,
        totalRevenue,
        averageOrderValue,
        topProducts,
        recentOrders: filteredOrders.slice(-5).reverse(),
        dailyRevenue: dailyRevenueArray
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi lấy thống kê:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={classes.loading}>Đang tải...</div>;
  }

  return (
    <div className={classes.statistics}>
      <h1>Thống kê</h1>

      <div className={classes.timeRangeSelector}>
        <button
          className={`${classes.timeButton} ${timeRange === 'week' ? classes.active : ''}`}
          onClick={() => setTimeRange('week')}
        >
          Tuần này
        </button>
        <button
          className={`${classes.timeButton} ${timeRange === 'month' ? classes.active : ''}`}
          onClick={() => setTimeRange('month')}
        >
          Tháng này
        </button>
        <button
          className={`${classes.timeButton} ${timeRange === 'year' ? classes.active : ''}`}
          onClick={() => setTimeRange('year')}
        >
          Năm nay
        </button>
      </div>

      <div className={classes.statsGrid}>
        <div className={classes.statCard}>
          <h3>Tổng đơn hàng</h3>
          <p className={classes.statValue}>{stats.totalOrders}</p>
        </div>
        <div className={classes.statCard}>
          <h3>Tổng doanh thu</h3>
          <p className={classes.statValue}>{stats.totalRevenue.toLocaleString('vi-VN')}đ</p>
        </div>
        <div className={classes.statCard}>
          <h3>Giá trị đơn hàng trung bình</h3>
          <p className={classes.statValue}>{stats.averageOrderValue.toLocaleString('vi-VN')}đ</p>
        </div>
      </div>

      <div className={classes.chartsGrid}>
        <div className={classes.chartCard}>
          <h3>Sản phẩm bán chạy</h3>
          <div className={classes.topProducts}>
            {stats.topProducts.map(product => (
              <div key={product.id} className={classes.productItem}>
                <span className={classes.productName}>{product.name}</span>
                <span className={classes.productStats}>
                  {product.quantity} đơn vị - {product.revenue.toLocaleString('vi-VN')} VND
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={classes.chartCard}>
          <h3>Đơn hàng gần đây</h3>
          <div className={classes.recentOrders}>
            {stats.recentOrders.map(order => (
              <div key={order.id} className={classes.orderItem}>
                <div className={classes.orderHeader}>
                  <span className={classes.orderId}>#{order.id.slice(-6)}</span>
                  <span className={classes.orderDate}>
                    {new Date(order.date).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className={classes.orderAmount}>
                  {order.totalAmount.toLocaleString('vi-VN')} VND
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics; 