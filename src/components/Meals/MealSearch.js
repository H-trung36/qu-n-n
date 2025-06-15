import { useState } from 'react';
import classes from './MealSearch.module.css';

const MealSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [category, setCategory] = useState('all');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({
      searchTerm,
      priceRange,
      category
    });
  };

  return (
    <div className={classes.search}>
      <form onSubmit={handleSearch}>
        <div className={classes.searchInput}>
          <input
            type="text"
            placeholder="Tìm kiếm món ăn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className={classes.filters}>
          <div className={classes.priceRange}>
            <input
              type="number"
              placeholder="Giá từ"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
            />
            <input
              type="number"
              placeholder="Giá đến"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
            />
          </div>

          <div className={classes.category}>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">Tất cả danh mục</option>
              <option value="main">Món chính</option>
              <option value="appetizer">Khai vị</option>
              <option value="dessert">Tráng miệng</option>
              <option value="drink">Đồ uống</option>
            </select>
          </div>
        </div>

        <button type="submit" className={classes.searchButton}>
          Tìm kiếm
        </button>
      </form>
    </div>
  );
};

export default MealSearch; 