import React, { useState } from 'react';
import classes from './Checkout.module.css';

const Checkout = ({ onConfirm, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    city: '',
    postalCode: ''
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    onConfirm(formData);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <div className={classes.control}>
        <label htmlFor="name">Tên</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className={classes.control}>
        <label htmlFor="street">Địa chỉ</label>
        <input
          type="text"
          id="street"
          name="street"
          value={formData.street}
          onChange={handleChange}
          required
        />
      </div>
      <div className={classes.control}>
        <label htmlFor="city">Thành phố</label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        />
      </div>
      <div className={classes.control}>
        <label htmlFor="postalCode">Số điện thoại</label>
        <input
          type="text"
          id="postalCode"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
          required
        />
      </div>
      <div className={classes.actions}>
        <button type="button" onClick={onCancel} className={classes['button--alt']}>
          Hủy
        </button>
        <button className={classes.button}>Xác nhận</button>
      </div>
    </form>
  );
};

export default Checkout; 