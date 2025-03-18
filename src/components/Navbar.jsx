import React from "react";
import { Link } from "react-router-dom";

const BottomNavbar = () => {
  return (
    <nav className="bottom-navbar">
      <Link to={"/"}>
        <div className="nav-item">
          <span className="nav-icon">
            <i class="bx bx-home-alt"></i>
          </span>
          <span className="nav-text">Asosiy</span>
        </div>
      </Link>
      <div className="nav-item">
        <span className="nav-icon">
          <i class="bx bx-search-alt"></i>
        </span>
        <span className="nav-text">Katalog</span>
      </div>
      <Link to={"/cart"}>
        <div className="nav-item">
          <span className="nav-icon">
            <i class="bx bx-shopping-bag"></i>
          </span>
          <span className="nav-text">Savat</span>
        </div>
      </Link>
      <Link to={"/profile"}>
        <div className="nav-item">
          <span className="nav-icon">
            <i class="bx bx-user"></i>
          </span>
          <span className="nav-text">Profil</span>
        </div>
      </Link>
    </nav>
  );
};

export default BottomNavbar;
