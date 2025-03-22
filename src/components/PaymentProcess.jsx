import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentProcessing = () => {
  const navigate = useNavigate();
  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [useAutomaticAddress, setUseAutomaticAddress] = useState(false);

  useEffect(() => {
    // Fetch delivery methods
    fetch("https://admin.azizbekaliyev.uz/api/orders/delivery-method")
      .then((res) => res.json())
      .then((data) => {
        const activeMethods = data.data.filter(
          (method) => method.status === "active"
        );
        setDeliveryMethods(activeMethods);
        if (activeMethods.length > 0) {
          setSelectedDelivery(activeMethods[0]);
        }
      })
      .catch((err) =>
        console.error("Yetkazib berish usullarini olishda xatolik:", err)
      );

    // Fetch payment methods
    fetch("https://admin.azizbekaliyev.uz/api/orders/payment-method")
      .then((res) => res.json())
      .then((data) => {
        const activePayments = data.data.filter(
          (method) => method.status === "active"
        );
        setPaymentMethods(activePayments);
        const metod = paymentMethods.filter(
          (method) => method.method_name == "Karta"
        );
        localStorage.setItem("card_holder", metod[0].card_holder);
        localStorage.setItem("card", metod[0].card);
        if (activePayments.length > 0) {
          setSelectedPayment(activePayments[0]);
        }
      })
      .catch((err) => console.error("To'lov usullarini olishda xatolik:", err));
  }, []);

  useEffect(() => {
    if (selectedDelivery?.address) {
      setDeliveryAddress(selectedDelivery.address);
    }
  }, [selectedDelivery]);

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
      setDeliveryAddress(selectedDelivery?.address || "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedPayment?.method_name == "Karta") {
      localStorage.setItem("deliveryAddress", deliveryAddress);
      localStorage.setItem("delivery_method", selectedDelivery?.method_name);
      localStorage.setItem("payment_method", "Karta");
      navigate("/payment");
      return;
    }

    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const totalAmount = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const items = cartItems.map((item) => ({
      variant: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const bodydata = {
      payment_method: selectedPayment?.method_name,
      delivery_method: selectedDelivery?.method_name,
      delivery_address: deliveryAddress,
      total_amount: totalAmount,
      items: items,
    };

    try {
      const response = await fetch(
        "https://admin.azizbekaliyev.uz/api/orders/orders/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(bodydata),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend xatolik qaytardi:", errorData);
        alert(`Xatolik: ${errorData.message || "Noma’lum xatolik"}`);
        return;
      }

      const result = await response.json();
      console.log("Buyurtma muvaffaqiyatli yaratildi:", result);

      if (selectedPayment?.method_name.toLowerCase() === "karta") {
        navigate("/payment-detail", { state: { orderId: result.id } });
      } else {
        navigate("/success");
        localStorage.removeItem("cartItems");
      }
    } catch (error) {
      console.error("Xatolik:", error);
      alert("Xatolik yuz berdi: " + error.message);
    }
  };

  return (
    <div className="payment-container">
      {/* Yetkazib berish usuli */}
      <div className="form-section">
        <label>Yetkazib berish turi:</label>
        <div className="option-cards">
          {deliveryMethods.map((method) => (
            <div
              key={method.id}
              className={`option-card ${
                selectedDelivery?.id === method.id ? "option-card-selected" : ""
              }`}
              onClick={() => setSelectedDelivery(method)}
            >
              <img
                src={`https://admin.azizbekaliyev.uz${method.img}`}
                alt={method.method_name}
                className="option-card-icon"
              />
              <span>{method.method_name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Yetkazib berish manzili */}
      <div className="form-group">
        <label>Yetkazib Berish Manzili:</label>
        {selectedDelivery?.method_name === "Yetkazib berish" ? (
          <input
            type="text"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            disabled={useAutomaticAddress}
          />
        ) : (
          <p className="pickup_address">{deliveryAddress}</p>
        )}
        {selectedDelivery?.method_name === "Yetkazib berish" ? (
          <button onClick={handleUseAutomaticAddress} type="button">
            {useAutomaticAddress
              ? "Manzilni qo'lda kiritish"
              : "Manzilni avtomatik olish"}
          </button>
        ) : (
          ""
        )}
      </div>

      {/* To'lov usuli */}
      <div className="form-section">
        <label>To'lov turi:</label>
        <div className="option-cards">
          {(selectedDelivery?.method_name === "Yetkazib berish"
            ? paymentMethods.filter((method) => method.method_name !== "Naqd")
            : paymentMethods
          ).map((method) => (
            <div
              key={method.id}
              className={`option-card ${
                selectedPayment?.id === method.id ? "option-card-selected" : ""
              }`}
              onClick={() => setSelectedPayment(method)}
            >
              <img
                src={`https://admin.azizbekaliyev.uz${method.img}`}
                alt={method.method_name}
                className="option-card-icon"
              />
              <span>{method.method_name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Buyurtmani rasmiylashtirish tugmasi */}
      <div className="form-section">
        <button className="submit-button" onClick={handleSubmit}>
          Buyurtmani Rasmiylashtirish
        </button>
      </div>
    </div>
  );
};

export default PaymentProcessing;
