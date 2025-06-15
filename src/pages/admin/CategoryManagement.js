import { useState, useEffect } from 'react';
import classes from './CategoryManagement.module.css';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://food-3dc6b-default-rtdb.firebaseio.com/categories.json');
      const data = await response.json();
      
      const loadedCategories = [];
      for (const key in data) {
        loadedCategories.push({
          id: key,
          ...data[key]
        });
      }
      
      setCategories(loadedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await fetch('https://food-3dc6b-default-rtdb.firebaseio.com/categories.json', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      
      setFormData({
        name: '',
        description: ''
      });
      
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      try {
        await fetch(`https://food-3dc6b-default-rtdb.firebaseio.com/categories/${id}.json`, {
          method: 'DELETE'
        });
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  return (
    <div className={classes.categoryManagement}>
      <h1>Quản lý danh mục</h1>
      
      <div className={classes.formContainer}>
        <h2>Thêm danh mục mới</h2>
        <form onSubmit={handleSubmit} className={classes.form}>
          <div className={classes.formGroup}>
            <label htmlFor="name">Tên danh mục</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className={classes.formGroup}>
            <label htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <button type="submit" className={classes.submitBtn}>
            Thêm mới
          </button>
        </form>
      </div>

      <div className={classes.categoriesList}>
        <h2>Danh sách danh mục</h2>
        <table>
          <thead>
            <tr>
              <th>Tên danh mục</th>
              <th>Mô tả</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>
                  <button
                    onClick={() => handleDelete(category.id)}
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

export default CategoryManagement; 