import React from "react";
import { useNavigate } from "react-router-dom";
const BackNavbar = () => {
  const navigate = useNavigate();

  return (
    <div className="back-navbar">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <i class="bx bx-arrow-back"></i>
      </button>
    </div>
  );
};

export default BackNavbar;
