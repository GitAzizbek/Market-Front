import React, { useState, useEffect } from "react";
import axios from "axios";

function Categories({ onCategorySelect }) {
  const apiUrl = "https://admin.azizbekaliyev.uz";
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const getCategories = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/main/category`);
      console.log("API Response:", response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    onCategorySelect(categoryId); // Filterni chaqirish uchun
  };

  return (
    <div className="Categories">
      <button
        className={selectedCategory === null ? "active" : ""}
        onClick={() => handleCategoryClick(null)}
      >
        Barchasi
      </button>
      {data.map((item) => (
        <button
          key={item.id}
          className={selectedCategory === item.id ? "active" : ""}
          onClick={() => handleCategoryClick(item.id)}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default Categories;
