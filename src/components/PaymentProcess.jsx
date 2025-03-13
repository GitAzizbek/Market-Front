import React, { useState } from "react";

const PaymentProcessing = () => {
  const [deliveryType, setDeliveryType] = useState("delivery");
  const [paymentType, setPaymentType] = useState("cash");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
  });
  const [file, setFile] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [useAutomaticAddress, setUseAutomaticAddress] = useState(false);

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
    setDeliveryAddress(e.target.value);
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
              setDeliveryAddress(data.display_name || "Manzil topilmadi");
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
      <h1>To'lovni Amalga Oshirish</h1>

      <div className="card">
        <div className="card-header">
          <h3>Karta Ma'lumotlari</h3>
        </div>
        <div className="card-body">
          <p>1234 1234 1234 1234</p>
          <p>Aliyev Azizbek</p>
        </div>
      </div>

      <div className="form-group">
        <label>
          Yetkazib Berish Turi:
          <select value={deliveryType} onChange={handleDeliveryChange}>
            <option value="delivery">Yetkazib Berish</option>
          </select>
        </label>
      </div>
      <div className="form-group">
        <label>
          Yetkazib Berish Manzili:
          <input
            type="text"
            value={deliveryAddress}
            onChange={handleAddressChange}
            placeholder="Manzilingizni kiriting"
            disabled={useAutomaticAddress}
          />
        </label>
        <button onClick={handleUseAutomaticAddress} type="button">
          {useAutomaticAddress
            ? "Manzilni qo'lda kiritish"
            : "Manzilni avtomatik olish"}
        </button>
      </div>
      <div className="form-group">
        <label>
          To'lov Turi:
          <select value={paymentType} onChange={handlePaymentChange}>
            <option value="card">Karta</option>
          </select>
        </label>
      </div>

      <div className="card-form">
        <h3>To'lov qilgan karta ma'lumotlaringizni Kiriting</h3>
        <form className="payment_form">
          <div className="form-group">
            <label>
              Karta Raqami:
              <input
                type="text"
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleCardDetailsChange}
                placeholder="1234 5678 9012 3456"
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Amal Qilish Muddat:
              <input
                type="text"
                name="expiryDate"
                value={cardDetails.expiryDate}
                onChange={handleCardDetailsChange}
                placeholder="MM/YY"
              />
            </label>
          </div>
        </form>
      </div>

      <div className="form-group">
        <label>
          Check Faylini Yuklash:
          <input type="file" onChange={handleFileChange} />
        </label>
      </div>

      <button className="confirm-button" onClick={handleSubmit}>
        Tasdiqlash
      </button>
    </div>
  );
};

export default PaymentProcessing;
