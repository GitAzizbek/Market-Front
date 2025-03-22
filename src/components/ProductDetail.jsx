import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";
import { ToastContainer, toast } from "react-toastify";
import { FaStar } from "react-icons/fa";

function ProductDetail() {
  const notify = () => toast.warning("Iltimos rang va o'lcham tanlang");
  const success = () =>
    toast.success("Maxsulot muvaffaqqiyatli savatga qo'shildi");

  const { id } = useParams();
  const navigate = useNavigate();
  const apiUrl = "https://admin.azizbekaliyev.uz";
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [reviews, setReviews] = useState([]); // State for reviews
  const [loadingReviews, setLoadingReviews] = useState(true); // Loading state for reviews

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/main/products/${id}/`);
        setProduct(response.data.data);
        if (response.data.data.colors.length > 0) {
          setSelectedColor(response.data.data.colors[0].color.name);
        }
      } catch (error) {
        console.error("Mahsulot yuklashda xatolik:", error);
      }
    };

    fetchProduct();
  }, [id]);

  // Reset selected size when color changes
  useEffect(() => {
    setSelectedSize(null);
  }, [selectedColor]);

  // Fetch reviews for the product
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
        console.error("Sharhlarni yuklashda xatolik:", error);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [id]);

  // Update selected variant when color or size changes
  useEffect(() => {
    const variant = getSelectedVariant();
    setSelectedVariant(variant);
  }, [selectedColor, selectedSize]);

  // Get selected variant based on color and size
  const getSelectedVariant = () => {
    if (!selectedColor || !selectedSize || !product) return null;
    return product.colors.find(
      (color) =>
        color.color.name === selectedColor && color.size.size === selectedSize
    );
  };

  // Add product to cart
  const handleAddToCart = () => {
    const selectedVariant = getSelectedVariant();
    if (!selectedVariant) {
      notify();
      return;
    }

    const newItem = {
      id: selectedVariant.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.image || "",
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
    };

    const existingCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const updatedCart = existingCart.some((item) => item.id === newItem.id)
      ? existingCart.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      : [...existingCart, newItem];

    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    success();
  };

  // Navigate to cart
  const goToCart = () => {
    navigate("/cart", { state: { cartItems } });
  };

  if (!product) {
    return <p className="detail-loading">Yuklanmoqda...</p>;
  }

  // Get unique colors
  const uniqueColors = Array.from(
    new Set(product.colors.map((color) => color.color.name))
  ).map((colorName) =>
    product.colors.find((color) => color.color.name === colorName)
  );

  // Get filtered sizes based on selected color
  const filteredSizes = product.colors
    .filter((color) => color.color.name === selectedColor)
    .map((color) => color.size.size);

  // Get unique sizes
  const uniqueSizes = Array.from(new Set(filteredSizes));

  return (
    <div className="detail-container">
      <ToastContainer />
      {/* Product Images */}
      <div className="detail-images-container">
        <Swiper
          scrollbar={{ hide: false }}
          modules={[Scrollbar]}
          className="mySwipper"
        >
          {product.images.map((image) => (
            <SwiperSlide key={image.id}>
              <img
                src={`${apiUrl}/${image.image}`}
                alt={product.name}
                className="detail-thumbnail"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <Swiper
        scrollbar={{ hide: false }}
        modules={[Scrollbar]}
        className="mySwipper"
        autoHeight={true} // Enable autoHeight to adjust slide height dynamically
        style={{ maxHeight: "130px" }} // Set a maximum height for the Swiper container
      >
        <div className="reviews-section">
          <h2>Sharhlar</h2>
          {loadingReviews ? (
            <p>Sharhlar yuklanmoqda...</p>
          ) : reviews.length > 0 ? (
            reviews.slice(0, 5).map((review) => (
              <SwiperSlide key={review.id}>
                {" "}
                {/* Add key here */}
                <div className="review-card">
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
                  <div className="review_box">
                    <p className="review-text-2">
                      Muallif: {review.user?.first_name || "Noma'lum"}
                    </p>
                    <a
                      className="comments_link"
                      href={`/comments/${product.id}`}
                    >
                      Barcha sharhlar
                    </a>
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <a className="comments_link" href={`/comments/${product.id}`}>
              Sharx berish
            </a>
          )}
        </div>
      </Swiper>
      {/* Product Details */}
      <div className="detail-info-container">
        <h2 className="detail-title">{product.name}</h2>
        <p className="detail-description">{product.description}</p>
        <p className="detail-price">
          {parseInt(product.price).toLocaleString()} UZS
        </p>
        <p className="detail-category">
          Kategoriya:{" "}
          <strong>{product.category?.[0]?.name || "Noma'lum"}</strong>
        </p>

        {/* Color Selection */}
        <div className="detail-options">
          <h3>Rangni tanlang:</h3>
          <div className="color-options">
            {uniqueColors.map((color) => (
              <button
                key={color.id}
                className={`color-button ${
                  selectedColor === color.color.name ? "active" : ""
                }`}
                onClick={() => setSelectedColor(color.color.name)}
              >
                {color.color.name}
              </button>
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div className="detail-options">
          <h3>O'lchamni tanlang:</h3>
          <div className="size-options">
            {uniqueSizes.map((size) => (
              <button
                key={size}
                className={`size-button ${
                  selectedSize === size ? "active" : ""
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity Selection */}
        <div className="detail-options">
          <h3>Miqdor:</h3>
          <div className="quantity-control">
            <button
              className="quantity-button"
              onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
            >
              -
            </button>
            <span className="quantity-value">{quantity}</span>
            <button
              className="quantity-button"
              onClick={() =>
                setQuantity((prev) =>
                  selectedVariant && prev < selectedVariant.quantity
                    ? prev + 1
                    : prev
                )
              }
              disabled={selectedVariant && quantity >= selectedVariant.quantity}
            >
              +
            </button>
            {/* Display stock information */}
            {selectedVariant && (
              <p className="stock-info">
                Mavjud: {selectedVariant.quantity} ta
              </p>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button className="detail-buy-button" onClick={handleAddToCart}>
          Savatga qo'shish
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
