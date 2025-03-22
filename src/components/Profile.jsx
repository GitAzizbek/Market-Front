import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaShoppingCart, FaStar } from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import profile from "../images/default-avatar.webp";
import { ToastContainer, toast } from "react-toastify";

// Tabs ma'lumotlari
const tabs = [
  { id: "personal", label: "Shaxsiy Ma'lumotlar", icon: <FaUser /> },
  { id: "orders", label: "Buyurtmalarim", icon: <FaShoppingCart /> },
  { id: "reviews", label: "Sharhlarim", icon: <FaStar /> },
];

const Profile = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const success = toast.success(
    "Profile malumotlari muvaffaqqiyatli yangilandi"
  );
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [selectedFile, setSelectedFile] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("uz-UZ", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    setSelectedFile(file);
    setFieldValue("avatar", file);
  };
  const apiUrl = "https://admin.azizbekaliyev.uz/api/users/profile";
  const apiUrl2 = "https://admin.azizbekaliyev.uz/api/users/update";
  const orders_url = "https://admin.azizbekaliyev.uz/api/orders/orders";
  const reviews_url = "https://admin.azizbekaliyev.uz/api/orders/comments";

  // Foydalanuvchi ma'lumotlarini yuklash
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setError("Token not found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(apiUrl, {
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

  // Buyurtmalarni yuklash
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
        } else {
          console.error("Failed to fetch orders", data);
        }
      } catch (err) {
        console.error("Network error while fetching orders");
      }
    };

    fetchOrders();
  }, [token]);

  // Sharhlarni yuklash
  useEffect(() => {
    const fetchReviews = async () => {
      if (!token) return;

      try {
        const response = await fetch(reviews_url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (response.ok) {
          setReviews(data.data);
        } else {
          console.error("Failed to fetch reviews", data);
        }
      } catch (err) {
        console.error("Network error while fetching reviews");
      }
    };

    fetchReviews();
  }, [token]);

  // Ma'lumotlarni yangilash funksiyasi
  const handleUpdateProfile = async (values) => {
    const formData = new FormData();
    formData.append("first_name", values.first_name);
    formData.append("address", values.address);
    if (values.avatar) {
      formData.append("avatar", values.avatar);
    }

    try {
      const response = await fetch(apiUrl2, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data.data); // Yangilangan ma'lumotlarni state-ga saqlash
        success();
      } else {
        // alert(data.message || "Ma'lumotlarni yangilashda xatolik yuz berdi");
      }
    } catch (err) {
      // alert("Tarmoq xatosi yuz berdi");
    }
  };

  // Formik validatsiya sxemasi
  const validationSchema = Yup.object({
    first_name: Yup.string().notRequired("Ism kiritilishi shart"),
    address: Yup.string().notRequired("Manzil kiritilishi shart"),
    avatar: Yup.mixed().notRequired("Rasm yuklashingiz shart"), // Fayl uchun validatsiya
  });

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
              <img
                className="info-avatar"
                src={
                  `https://admin.azizbekaliyev.uz${profile.avatar}` || profile
                }
                alt="User Avatar"
              />
              <h3>
                {profile.first_name} {profile.last_name || ""}
              </h3>
            </div>

            {/* Ma'lumotlarni yangilash formasi */}
            <Formik
              initialValues={{
                first_name: profile.first_name || "",
                address: profile.address || "",
                avatar: null,
              }}
              validationSchema={validationSchema}
              onSubmit={handleUpdateProfile}
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form className="profile-form">
                  <div className="form-group">
                    <label>Ism</label>
                    <Field type="text" name="first_name" />
                    <ErrorMessage
                      name="first_name"
                      component="div"
                      className="error"
                    />
                  </div>

                  <div className="form-group">
                    <label>Manzil</label>
                    <Field type="text" name="address" />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="error"
                    />
                  </div>

                  <div className="form-group">
                    <label className="file-upload">
                      <input
                        type="file"
                        onChange={(event) => {
                          setFieldValue("avatar", event.currentTarget.files[0]); // Faylni o'zgartirish
                        }}
                      />
                      <span>
                        {selectedFile ? selectedFile.name : "Rasm yuklash"}
                        <i class="bx bx-cloud-upload"></i>
                      </span>
                    </label>

                    <ErrorMessage
                      name="avatar"
                      component="div"
                      className="error"
                    />
                  </div>

                  <button
                    className="profile_button"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Yuklanmoqda..." : "Yangilash"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        )}

        {/* Buyurtmalar va sharhlar qismlari */}
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
                          style={{ width: "1rem", height: "1rem" }}
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
