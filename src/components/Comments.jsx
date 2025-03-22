import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function ProductComments() {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); // State to control form visibility

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `https://admin.azizbekaliyev.uz/api/orders/product-comment/${id}`
        );
        if (response.data.data) {
          setReviews(response.data.data);
        }
      } catch (error) {
        toast.error("Sharhlarni yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await axios.post(
        "https://admin.azizbekaliyev.uz/api/orders/comments",
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setReviews((prev) => [
        ...prev,
        { ...values, user: { first_name: "Siz" } },
      ]);
      resetForm();
      setShowForm(false); // Hide the form after submission
    } catch (error) {
      toast.error("Sharh qo'shishda xatolik yuz berdi");
    }
  };

  return (
    <div className="comments-container">
      <div className="comment_box">
        <h4>Mahsulot Sharhlari</h4>
        <button onClick={() => setShowForm(true)}>Sharh qo'shish</button>
      </div>
      {loading ? (
        <p>Sharhlar yuklanmoqda...</p>
      ) : reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <div className="review-rating">
                {Array.from({ length: 5 }, (_, index) => (
                  <FaStar
                    key={index}
                    className={
                      index < review.rate ? "star filled" : "star empty"
                    }
                  />
                ))}
              </div>
            </div>
            <p className="review-text">{review.text}</p>
            <p className="review-author">
              Muallif: {review.user?.first_name || "Noma'lum"}
            </p>
          </div>
        ))
      ) : (
        <p>Hozircha hech qanday sharh yo'q.</p>
      )}

      {/* Popup Form */}
      {showForm && (
        <div className="popup-overlay">
          <div className="comment-form">
            <h4>Sharh qo'shish</h4>
            <Formik
              initialValues={{ rate: 5, text: "", id: id }}
              validationSchema={Yup.object({
                rate: Yup.number()
                  .min(1)
                  .max(5)
                  .required("Reyting talab qilinadi"),
                text: Yup.string().required("Sharh matni kerak"),
              })}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, values }) => (
                <Form>
                  <div className="rating-input">
                    {Array.from({ length: 5 }, (_, index) => (
                      <FaStar
                        key={index}
                        className={
                          index < values.rate ? "star filled" : "star empty"
                        }
                        onClick={() => setFieldValue("rate", index + 1)}
                      />
                    ))}
                  </div>
                  <Field
                    as="textarea"
                    name="text"
                    placeholder="Sharhingiz..."
                  />
                  <ErrorMessage name="text" component="div" className="error" />
                  <button type="submit">Jo'natish</button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="cancel-button"
                  >
                    Bekor qilish
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductComments;
