import { useState, useEffect } from 'react';
import classes from './CustomerManagement.module.css';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('https://food-3dc6b-default-rtdb.firebaseio.com/customers.json');
      const data = await response.json();
      
      const loadedCustomers = [];
      for (const key in data) {
        loadedCustomers.push({
          id: key,
          ...data[key]
        });
      }
      
      setCustomers(loadedCustomers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className={classes.loading}>Đang tải...</div>;
  }

  return (
    <div className={classes.customerManagement}>
      <h1>Quản lý khách hàng</h1>
      
      <div className={classes.searchBar}>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={classes.searchInput}
        />
      </div>

      <div className={classes.customersList}>
        {filteredCustomers.length === 0 ? (
          <p className={classes.noCustomers}>Không tìm thấy khách hàng nào</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Tên khách hàng</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Địa chỉ</th>
                <th>Số đơn hàng</th>
                <th>Tổng chi tiêu</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(customer => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone || 'N/A'}</td>
                  <td>{customer.address || 'N/A'}</td>
                  <td>{customer.orderCount || 0}</td>
                  <td>{customer.totalSpent ? `${customer.totalSpent.toLocaleString('vi-VN')}đ` : '0đ'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CustomerManagement; 