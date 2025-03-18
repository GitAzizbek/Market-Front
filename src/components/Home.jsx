import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Announcements from "./Announcements";
import Categories from "./Categories";
import Products from "./Products";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  if (token) {
    localStorage.setItem("token", token);
  }

  const handleSearchClick = () => {
    navigate(`/catalog`);
  };

  return (
    <div className="home">
      <div className="search-container">
        <div className="search_box">
          <i className="bx bx-search search"></i>
          <input
            type="text"
            placeholder="Mahsulotlarni qidirish..."
            className="search-input"
            value={searchQuery}
            onClick={handleSearchClick} // Redirect on click
            readOnly // Prevents typing in Home page
          />
        </div>
        {/* <i className="bx bx-heart heart"></i> */}
      </div>
      <Announcements />
      <Categories onCategorySelect={setSelectedCategory} />
      <Products selectedCategory={selectedCategory} searchQuery={searchQuery} />
    </div>
  );
};

export default Home;
