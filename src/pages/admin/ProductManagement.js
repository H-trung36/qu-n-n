import { useState, useEffect } from 'react';
import classes from './ProductManagement.module.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'main',
    image: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://food-3dc6b-default-rtdb.firebaseio.com/meals.json');
      const data = await response.json();
      
      const loadedProducts = [];
      for (const key in data) {
        loadedProducts.push({
          id: key,
          ...data[key]
        });
      }
      
      setProducts(loadedProducts);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sản phẩm:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        // Cập nhật sản phẩm
        await fetch(`https://food-3dc6b-default-rtdb.firebaseio.com/meals/${selectedProduct.id}.json`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        // Thêm sản phẩm mới
        await fetch('https://food-3dc6b-default-rtdb.firebaseio.com/meals.json', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      
      // Đặt lại form và tải lại danh sách
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'main',
        image: ''
      });
      setSelectedProduct(null);
      setIsEditing(false);
      fetchProducts();
    } catch (error) {
      console.error('Lỗi khi lưu sản phẩm:', error);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category || 'main',
      image: product.image || ''
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await fetch(`https://food-3dc6b-default-rtdb.firebaseio.com/meals/${id}.json`, {
          method: 'DELETE'
        });
        fetchProducts();
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'main',
      image: ''
    });
    setSelectedProduct(null);
    setIsEditing(false);
  };

  return (
    <div className={classes.productManagement}>
      <h1>Quản lý sản phẩm</h1>
      
      <div className={classes.formContainer}>
        <h2>{isEditing ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
        <form onSubmit={handleSubmit} className={classes.form}>
          <div className={classes.formGroup}>
            <label htmlFor="name">Tên sản phẩm</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={classes.formGroup}>
            <label htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={classes.formGroup}>
            <label htmlFor="price">Giá</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={classes.formGroup}>
            <label htmlFor="category">Danh mục</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            >
              <option value="main">Món chính</option>
              <option value="appetizer">Khai vị</option>
              <option value="dessert">Tráng miệng</option>
              <option value="drink">Đồ uống</option>
            </select>
          </div>

          <div className={classes.formGroup}>
            <label htmlFor="image">URL hình ảnh</label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
            />
          </div>

          <div className={classes.formActions}>
            <button type="submit" className={classes.submitBtn}>
              {isEditing ? 'Cập nhật' : 'Thêm mới'}
            </button>
            {isEditing && (
              <button type="button" onClick={handleCancel} className={classes.cancelBtn}>
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      <div className={classes.productsList}>
        <h2>Danh sách sản phẩm</h2>
        <table>
          <thead>
            <tr>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.price} VND</td>
                <td>
                  <button
                    onClick={() => handleEdit(product)}
                    className={classes.editBtn}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
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

export default ProductManagement; 