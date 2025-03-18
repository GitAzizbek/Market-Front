import React from "react";
import { useNavigate } from "react-router-dom";
import success from "../images/success.gif";

function SuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="success-page">
      <img src={success} alt="" />
      <h6>Buyurtma muvaffaqiyatli yaratildi! 🎉</h6>
      <p>Buyurtmangiz qabul qilindi va tez orada qayta ishlanadi.</p>
      <button onClick={() => navigate("/")}>Bosh sahifaga qaytish</button>
    </div>
  );
}

export default SuccessPage;
