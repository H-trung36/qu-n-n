import { useState, useEffect } from 'react';
import classes from './UserManagement.module.css';
import { ref, get, set } from 'firebase/database';
import { database } from '../../firebase';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://food-3dc6b-default-rtdb.firebaseio.com/users.json');
      const data = await response.json();
      
      const loadedUsers = [];
      for (const key in data) {
        loadedUsers.push({
          id: key,
          ...data[key]
        });
      }
      
      setUsers(loadedUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Đầu tiên, kiểm tra xem người dùng đã tồn tại chưa
      const userRef = ref(database, `users/${formData.email}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        setError('Email này đã được sử dụng');
        return;
      }

      // Nếu tạo người dùng thành công, thêm vào database
      await set(userRef, {
        ...formData,
        createdAt: new Date().toISOString()
      });

      setSuccess('Tạo người dùng thành công');
      fetchUsers();
    } catch (error) {
      console.error('Lỗi khi tạo người dùng:', error);
      setError('Không thể tạo người dùng');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await fetch(`https://food-3dc6b-default-rtdb.firebaseio.com/users/${userId}.json`, {
          method: 'DELETE'
        });
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  if (loading) {
    return <div className={classes.loading}>Đang tải...</div>;
  }

  return (
    <div className={classes.userManagement}>
      <h1>Quản lý người dùng</h1>

      <div className={classes.formContainer}>
        <h2>Thêm người dùng mới</h2>
        <form onSubmit={handleSubmit} className={classes.form}>
          {error && <div className={classes.error}>{error}</div>}
          {success && <div className={classes.success}>{success}</div>}
          
          <div className={classes.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
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
              minLength="6"
            />
          </div>

          <div className={classes.formGroup}>
            <label htmlFor="role">Vai trò</label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
            >
              <option value="admin">Admin</option>
              <option value="manager">Quản lý</option>
              <option value="staff">Nhân viên</option>
            </select>
          </div>

          <button type="submit" className={classes.submitBtn}>
            Thêm người dùng
          </button>
        </form>
      </div>

      <div className={classes.usersList}>
        <h2>Danh sách người dùng</h2>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>
                  <span className={`${classes.role} ${classes[user.role]}`}>
                    {user.role}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                <td>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className={classes.deleteBtn}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement; 