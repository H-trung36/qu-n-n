import React, { useState, useContext } from 'react';
import classes from './Cart.module.css';
import CartItem from './CartItem';
import Checkout from './Checkout';
import CartContext from '../../store/cart-context';
import { database } from '../../firebase/config';
import { ref, push } from 'firebase/database';

const Cart = ({ onClose }) => {
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);
  const cartCtx = useContext(CartContext);

  const totalAmount = cartCtx.items.reduce((sum, item) => sum + item.price * item.amount, 0);

  const handleOrder = () => {
    setIsCheckout(true);
  };

  const handleSubmitOrder = async (userData) => {
    setIsSubmitted(true);
    try {
      // Tạo tham chiếu đến node orders trong Firebase
      const ordersRef = ref(database, 'orders');
      
      // Thêm đơn hàng mới vào Firebase
      await push(ordersRef, {
        user: userData,
        orderedItems: cartCtx.items,
        totalAmount: totalAmount,
        status: 'pending', // Trạng thái đơn hàng: pending, processing, completed, cancelled
        createdAt: new Date().toISOString()
      });

      setIsSuccess(true);
      cartCtx.resetCart();
    } catch (error) {
      console.error('Lỗi:', error);
      setIsSuccess(false);
    }
  };

  const cartItems = (
    <ul className={classes['cart-items']}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onAdd={() => cartCtx.addItem({ ...item, amount: 1 })}
          onRemove={() => cartCtx.removeItem(item.id)}
        />
      ))}
    </ul>
  );

  return (
    <>
      <div className={classes.backdrop} onClick={onClose} />
      <div className={classes.cart}>
        {!isSubmitted ? (
          <>
            {cartItems}
            <div className={classes.total}>
              <span>Tổng tiền</span>
              <span>{totalAmount.toLocaleString('vi-VN')} VND</span>
            </div>
            {isCheckout ? (
              <Checkout onConfirm={handleSubmitOrder} onCancel={() => setIsCheckout(false)} />
            ) : (
              <div className={classes.actions}>
                <button className={classes['button--alt']} onClick={onClose}>
                  Đóng
                </button>
                <button className={classes.button} onClick={handleOrder}>
                  Đặt hàng
                </button>
              </div>
            )}
          </>
        ) : (
          <div className={classes.submitted}>
            {isSuccess ? (
              <>
                <h2>Đặt hàng thành công!</h2>
                <p>Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất.</p>
              </>
            ) : (
              <>
                <h2>Đặt hàng thất bại!</h2>
                <p>Đã có lỗi xảy ra. Vui lòng thử lại sau.</p>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
