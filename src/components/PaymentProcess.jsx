import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentProcessing = () => {
  const navigate = useNavigate();
  const [deliveryType, setDeliveryType] = useState("delivery");
  const [paymentType, setPaymentType] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
  });
  const [file, setFile] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [useAutomaticAddress, setUseAutomaticAddress] = useState(false);

  // localStorage'dan saqlangan manzilni olish
  useEffect(() => {
    const savedAddress = localStorage.getItem("deliveryAddress");
    if (savedAddress) {
      setDeliveryAddress(savedAddress);
    }
  }, []);

  const handleDeliveryChange = (e) => {
    setDeliveryType(e.target.value);
  };

  const handlePaymentChange = (e) => {
    setPaymentType(e.target.value);
  };

  const handleCardDetailsChange = (e) => {
    let { name, value } = e.target;

    if (name === "cardNumber") {
      value = value
        .replace(/\D/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
      if (value.length > 19) value = value.slice(0, 19);
    }

    if (name === "expiryDate") {
      value = value.replace(/\D/g, "");
      if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2, 4);
      if (value.length > 5) value = value.slice(0, 5);
    }

    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAddressChange = (e) => {
    const newAddress = e.target.value;
    setDeliveryAddress(newAddress);
    localStorage.setItem("deliveryAddress", newAddress); // Manzilni localStorage'ga saqlash
  };

  const handleUseAutomaticAddress = () => {
    setUseAutomaticAddress(!useAutomaticAddress);

    if (!useAutomaticAddress) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const data = await response.json();
              const address = data.display_name || "Manzil topilmadi";
              setDeliveryAddress(address);
              localStorage.setItem("deliveryAddress", address); // Avtomatik manzilni saqlash
            } catch (error) {
              console.error("Manzilni olishda xatolik:", error);
              setDeliveryAddress("Manzilni olishda xatolik yuz berdi");
            }
          },
          () => {
            setDeliveryAddress("GPS yoqilmagan yoki ruxsat berilmadi");
          }
        );
      } else {
        setDeliveryAddress("Geolokatsiya qo‘llab-quvvatlanmaydi");
      }
    } else {
      setDeliveryAddress("");
      localStorage.removeItem("deliveryAddress"); // Manzilni tozalash
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      deliveryType,
      paymentType,
      cardDetails,
      file,
      deliveryAddress,
    });
  };

  return (
    <div className="payment-container">
      <div className="form-group">
        <label className="form-label">Yetkazib Berish Manzili:</label>
        <div className="input-container">
          <i className="bx bx-map input-icon"></i>
          <input
            type="text"
            value={deliveryAddress}
            onChange={handleAddressChange}
            placeholder="Manzilingizni kiriting"
            disabled={useAutomaticAddress}
            className="input-field"
          />
        </div>
        <button
          onClick={handleUseAutomaticAddress}
          type="button"
          className="address-toggle-button"
        >
          {useAutomaticAddress
            ? "Manzilni qo'lda kiritish"
            : "Manzilni avtomatik olish"}
        </button>
      </div>

      <div className="form-section">
        <label className="form-section-label">Yetkazib Berish Turi:</label>
        <div className="option-cards">
          <div
            className={`option-card ${
              deliveryType === "delivery" ? "option-card-selected" : ""
            }`}
            onClick={() => handleDeliveryChange("delivery")}
          >
            <i className="bx bxs-truck option-card-icon"></i>
            <span className="option-card-title">Yetkazib Berish</span>
          </div>
          <div
            className={`option-card disabled`}
            onClick={() => handleDeliveryChange("pickup")}
          >
            <i className="bx bx-store option-card-icon"></i>
            <span className="option-card-title">Olib Ketish</span>
          </div>
        </div>
      </div>

      <div className="form-section">
        <label className="form-section-label">To'lov Turi:</label>
        <div className="option-cards">
          <div
            className={`option-card ${
              paymentType === "card" ? "option-card-selected" : ""
            }`}
            onClick={() => handlePaymentChange("card")}
          >
            <i className="bx bx-credit-card option-card-icon"></i>
            <span className="option-card-title">Karta</span>
          </div>
          <div
            className={`option-card disabled`}
            onClick={() => handlePaymentChange("cash")}
          >
            <i className="bx bx-money option-card-icon"></i>
            <span className="option-card-title">Naqd</span>
          </div>
        </div>
      </div>

      <div className="form-section">
        <button className="submit-button" onClick={() => navigate("/payment")}>
          Buyurtmani Rasmiylashtirish
        </button>
      </div>
    </div>
  );
};

export default PaymentProcessing;
