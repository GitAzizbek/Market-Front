import React, { useState } from "react";
import { data } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function PaymentDetailPage() {
  const [cardNumber, setCardNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [file, setFile] = useState(null);
  const sellerCardNumber = "9860 3566 2068 7729";
  const sellerName = "Azizbek Aliyev";
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedCart);
  }, []);
  console.log(token);

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const success = () =>
    toast.success("Buyurtma muvaffaqqiyatli ro'yhatdan o'tkazildi");
  const error = () => toast.success("Nimadir xatolik yuz berdi");

  const handleCardInputChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Faqat raqamlarni qabul qilish
    value = value.replace(/(\d{4})/g, "$1 ").trim(); // Har 4 xonadan keyin bo'sh joy qo'shish
    setCardNumber(value);
  };

  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Nusxalandi: " + text);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const adrees = localStorage.getItem("deliveryAddress");

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
      payment_method: localStorage.getItem("payment_method"),
      delivery_method: localStorage.getItem("delivery_method"),
      delivery_address: adrees,
      total_amount: totalAmount,
      items: items,
    };

    try {
      // 1️⃣ Buyurtmani yaratish
      const response = await fetch(
        "https://admin.azizbekaliyev.uz/api/orders/orders/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
      // 2️⃣ Buyurtma ID ni olish
      const orderId = result.id;

      // 3️⃣ Agar fayl yuklangan bo'lsa, uni yuklash
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await fetch(
          `https://admin.azizbekaliyev.uz/api/orders/upload/${orderId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          const uploadError = await uploadResponse.json();
          console.error("Fayl yuklashda xatolik:", uploadError);
          alert(
            `Fayl yuklash xatosi: ${uploadError.message || "Noma’lum xatolik"}`
          );
          return;
        }

        console.log("Fayl muvaffaqiyatli yuklandi!");

        success();
        setTimeout(navigate("/success"), 1000);
        localStorage.removeItem("cartItems");
      }
    } catch (error) {
      console.error("Xatolik:", error);
      alert("Xatolik yuz berdi: " + error.message);
    }
  };

  return (
    <div className="PaymentDetailPage">
      <ToastContainer />
      <div className="seller_card_info">
        <p>Ushbu kartaga to'lov qiling</p>
        <br />
        <h6 className="full_payment" style={{ color: "red" }}>
          Jami: {parseInt(calculateTotal()).toLocaleString()} UZS
        </h6>
        <div className="copy-container">
          <h3>{sellerCardNumber}</h3>
          <i
            className="bx bx-copy"
            onClick={() => copyToClipboard(sellerCardNumber)}
          ></i>
        </div>
        <div className="copy-container">
          <h6>{sellerName}</h6>
          <i
            className="bx bx-copy"
            onClick={() => copyToClipboard(sellerName)}
          ></i>
        </div>
      </div>
      <h4>Karta ma'lumotlaringiz</h4>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          placeholder="Karta raqami"
          value={cardNumber}
          onChange={handleCardInputChange}
          maxLength="19"
          required
        />
        <input
          type="text"
          placeholder="Ism Familiya"
          value={fullName}
          onChange={handleFullNameChange}
          required
        />
        <label htmlFor="avatar">Check faylini yuklang</label>
        <input
          type="file"
          id="avatar"
          name="avatar"
          onChange={handleFileChange}
          required
        />
        <input type="submit" value="Pulni to'ladim" />
      </form>
    </div>
  );
}

export default PaymentDetailPage;
