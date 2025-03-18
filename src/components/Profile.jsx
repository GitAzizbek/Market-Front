import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import avatar from "../images/default-avatar.png";
import { FaUser, FaShoppingCart, FaStar } from "react-icons/fa";

const Profile = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]); // State for reviews
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");

  const api_url = "https://dev.api.gosslujba.dynamicsoft.uz/api/users/profile";
  const orders_url =
    "https://dev.api.gosslujba.dynamicsoft.uz/api/orders/orders";
  const reviews_url =
    "https://dev.api.gosslujba.dynamicsoft.uz/api/orders/comments"; // API for reviews

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setError("Token not found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(api_url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (response.ok) {
          setProfile(data.data);
        } else {
          setError(data.message || "Failed to fetch profile");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;

      try {
        const response = await fetch(orders_url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (response.ok) {
          setOrders(data);
          console.log(data);
        } else {
          console.error("Failed to fetch orders", data);
        }
      } catch (err) {
        console.error("Network error while fetching orders");
      }
    };

    fetchOrders();
  }, [token]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!token) return;

      try {
        const response = await fetch(reviews_url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (response.ok) {
          setReviews(data.data); // Set reviews data
        } else {
          console.error("Failed to fetch reviews", data);
        }
      } catch (err) {
        console.error("Network error while fetching reviews");
      }
    };

    fetchReviews();
  }, [token]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("uz-UZ", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const tabs = [
    { id: "personal", label: "Shaxsiy Ma'lumotlar", icon: <FaUser /> },
    { id: "orders", label: "Buyurtmalarim", icon: <FaShoppingCart /> },
    { id: "reviews", label: "Sharhlarim", icon: <FaStar /> },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="profile-container">
      <h2 className="profile-title">Profil</h2>

      <div className="profile-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="profile-content">
        {activeTab === "personal" && profile && (
          <div className="personal-info">
            <div className="profile-header">
              <img className="info-avatar" src={avatar} alt="User Avatar" />
              <h3>
                {profile.first_name} {profile.last_name || ""}
              </h3>
            </div>
            <div className="info-list">
              <div className="info-item">
                <FaUser className="icon" />
                <span>
                  <strong>Ism:</strong> {profile.first_name}
                </span>
              </div>
              <div className="info-item">
                <FaShoppingCart className="icon" />
                <span>
                  <strong>Telefon:</strong> {profile.phone}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="orders-list">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <span className={`status-badge ${order.payment_status}`}>
                      {order.payment_status === "canceled" && "Bekor qilingan"}
                      {order.payment_status === "delivered" &&
                        "Yetkazib berilgan"}
                      {order.payment_status === "confirmed" && "Tayyorlanmoqda"}
                      {order.payment_status === "pending" && "Kutilmoqda"}
                    </span>
                  </div>
                  <div className="order-details">
                    <p>
                      <strong>To'lov usuli:</strong> Karta orqali
                    </p>
                    <p>
                      <strong>Yetkazib berish:</strong> Yetkazib berish
                    </p>
                    <p>
                      <strong>Manzil:</strong> {order.delivery_address}
                    </p>
                    <p>
                      <strong>Jami summa:</strong>{" "}
                      {formatCurrency(order.total_amount)} so'm
                    </p>
                  </div>
                  {order.payment_check && (
                    <div className="payment-check-container">
                      <img
                        src={order.payment_check}
                        alt="To'lov cheki"
                        className="payment-check"
                      />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="no-orders">
                Hozircha hech qanday buyurtmangiz yo'q.
              </p>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="reviews-list">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="review-rating">
                      {Array.from({ length: 5 }, (_, index) => (
                        <FaStar
                          key={index}
                          className={`w-4 h-4 star ${
                            index < review.rate ? "filled" : "empty"
                          }`}
                          style={{ width: "1rem", height: "1rem" }} // Explicitly set width and height
                        />
                      ))}
                    </div>
                  </div>
                  <p className="review-text">{review.text}</p>
                  <p className="review-text-2">
                    Maxsulot: {review.product.name}
                  </p>
                </div>
              ))
            ) : (
              <p className="no-reviews">
                Hozircha hech qanday sharhingiz yo'q.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
