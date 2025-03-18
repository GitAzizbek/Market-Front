import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const BottomNavbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="bottom-navbar">
      <Link to={"/"} className="link-style">
        <div className="nav-item">
          <span className="nav-icon">
            <i class="bx bx-home-alt"></i>
          </span>
          <span className="nav-text">Asosiy</span>
        </div>
      </Link>
      <Link to={"/catalog"} className="link-style">
        <div className="nav-item">
          <span className="nav-icon">
            <i class="bx bx-search-alt"></i>
          </span>
          <span className="nav-text">Qidirish</span>
        </div>
      </Link>
      <Link to={"/cart"} className="link-style">
        <div className="nav-item">
          <span className="nav-icon">
            <i class="bx bx-shopping-bag"></i>
          </span>
          <span className="nav-text">Savat</span>
        </div>
      </Link>
      <Link to={"/profile"} className="link-style">
        <div className="nav-item">
          <span className="nav-icon">
            <i class="bx bx-user"></i>
          </span>
          <span className="nav-text">Profil</span>
        </div>
      </Link>
      <Link onClick={() => navigate(-1)} className="link-style">
        <div className="nav-item">
          <span className="nav-icon">
            <i class="bx bx-arrow-back"></i>
          </span>
          <span className="nav-text">Orqaga</span>
        </div>
      </Link>
    </nav>
  );
};

export default BottomNavbar;
