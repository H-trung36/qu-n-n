import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import classes from './Login.module.css';
import { database } from '../../firebase/config'; // Import instance database
import { ref, get } from 'firebase/database'; // Import các hàm database

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Lấy thông tin admin từ Realtime Database
      const adminRef = ref(database, 'admin');
      const snapshot = await get(adminRef);
      const adminData = snapshot.val();

      // So sánh thông tin nhập vào với thông tin trong database
      if (adminData && adminData.email === formData.email && adminData.password === formData.password) {
        localStorage.setItem('isAdminAuthenticated', 'true'); // Lưu trạng thái đăng nhập
        
        // Chuyển hướng đến trang trước đó hoặc dashboard
        const from = location.state?.from?.pathname || '/admin/dashboard';
        navigate(from, { replace: true });
      } else {
        // Sai email hoặc mật khẩu
        setError('Email hoặc mật khẩu không đúng');
      }
      
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      setError('Không thể xác thực. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className={classes.loginContainer}>
      <div className={classes.loginBox}>
        <h1>Đăng nhập</h1>
        {error && <div className={classes.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className={classes.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              placeholder="Nhập email của bạn"
            />
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
              placeholder="Nhập mật khẩu của bạn"
            />
          </div>
          <button type="submit" className={classes.loginButton}>
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; 