import React, { use, useState } from "react";
import Announcements from "./Announcements";
import Categories from "./Categories";
import Products from "./Products";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="home">
      {/* <div className={loading == true ? "loading active" : "loading"}>
      <div className="loading_box">
      <div className="loader">      
      </div>
      </div>
      </div> */}
      <div className="search-container">
        <div className="search_box">
          <i className="bx bx-search search"></i>
          <input
            type="text"
            placeholder="Mahsulotlarni qidirish..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <i className="bx bx-heart heart"></i>
      </div>
      <Announcements />
      <Categories onCategorySelect={setSelectedCategory} />
      <Products selectedCategory={selectedCategory} searchQuery={searchQuery} />
    </div>
  );
};

export default Home;
