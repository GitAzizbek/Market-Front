import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import empty from "../images/empty.gif";
import axios from "axios";

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [stockInfo, setStockInfo] = useState({}); // State to store stock information

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedCart);
    fetchStockInfo(storedCart); // Fetch stock information for items in the cart
  }, []);

  // Fetch stock information for each item in the cart
  const fetchStockInfo = async (cartItems) => {
    const stockData = {};
    for (const item of cartItems) {
      try {
        const response = await axios.get(
          `https://admin.azizbekaliyev.uz/api/main/products/${item.productId}/`
        );
        const product = response.data.data;
        const variant = product.colors.find(
          (color) =>
            color.color.name === item.color && color.size.size === item.size
        );
        if (variant) {
          stockData[item.id] = variant.quantity; // Store stock quantity by item ID
        }
      } catch (error) {
        console.error("Mahsulot ma'lumotlarini yuklashda xatolik:", error);
      }
    }
    setStockInfo(stockData);
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const increaseQuantity = (id) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id && item.quantity < (stockInfo[item.id] || Infinity)
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const clearCart = () => {
    localStorage.removeItem("cartItems");
    setCartItems([]);
    console.log("Savat tozalandi!");
  };

  return (
    <div className="cart-container">
      <div className="cart_box">
        <h1>Savat</h1>
        <div className="clear">
          <button onClick={clearCart}>Savatni tozalash</button>
        </div>
      </div>
      {cartItems.length === 0 ? (
        <div className="empty">
          <img src={empty} alt="" />
          <p>Afsuski savatingiz bo'sh</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart_item_left">
                  <img
                    src={`https://admin.azizbekaliyev.uz/${item.image}`}
                    alt={item.name}
                    className="cart-item-image"
                  />
                </div>
                <div className="cart_item_right">
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p>Rang: {item.color}</p>
                    <p>O'lcham: {item.size}</p>
                    <p>Narxi: {parseInt(item.price).toLocaleString()} UZS</p>
                    <div className="quantity-control">
                      <button
                        className="quantity-button"
                        onClick={() => decreaseQuantity(item.id)}
                      >
                        -
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button
                        className="quantity-button"
                        onClick={() => increaseQuantity(item.id)}
                        disabled={
                          item.quantity >= (stockInfo[item.id] || Infinity)
                        } // Disable if quantity exceeds stock
                      >
                        +
                      </button>
                      <button
                        className="remove-button"
                        onClick={() => removeItem(item.id)}
                      >
                        <i className="bx bx-trash"></i> O'chirish
                      </button>
                    </div>
                    {/* Display stock information */}
                    {stockInfo[item.id] !== undefined && (
                      <p className="stock-info">
                        Qolgan miqdor: {stockInfo[item.id]} ta
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h2>{parseInt(calculateTotal()).toLocaleString()} UZS</h2>
            <button
              className="checkout-button"
              onClick={() => navigate("/payment-processing")}
            >
              Buyurtmani rasmiylashtirish
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
