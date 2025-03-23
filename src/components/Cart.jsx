import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import empty from "../images/empty.gif";
import axios from "axios";

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [stockInfo, setStockInfo] = useState({}); // State to store stock information
  const [total, setTotal] = useState(0); // State to store the total price

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    fetchStockInfo(storedCart); // Fetch stock info and update cart
  }, []);

  // Re-calculate total whenever cartItems changes
  useEffect(() => {
    const newTotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    setTotal(newTotal);
  }, [cartItems]);

  // Fetch stock information and update cart
  const fetchStockInfo = async (cartItems) => {
    const stockData = {};
    const updatedCart = [];

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

        if (variant && variant.quantity > 0) {
          stockData[item.id] = variant.quantity;
          updatedCart.push(item); // Keep the item in the cart if it's still in stock
        }
      } catch (error) {
        console.error("Mahsulot ma'lumotlarini yuklashda xatolik:", error);
      }
    }

    // Update cart and stock info
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
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
                      <span className="quantity-value">{item.quantity}</span>{" "}
                      {/* Display item.quantity */}
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
            <h2>{parseInt(total).toLocaleString()} UZS</h2>{" "}
            {/* Display dynamic total */}
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
