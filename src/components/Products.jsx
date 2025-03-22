import { useState, useEffect } from "react";
import axios from "axios";
import CardList from "./CardList"; // 🔹 Yangi komponentni chaqiramiz

function Products({ selectedCategory, searchQuery }) {
  const apiUrl = "https://admin.azizbekaliyev.uz";
  const [data, setData] = useState([]);

  const getProducts = async (category, name) => {
    try {
      const response = await axios.get(`${apiUrl}/api/main/products`, {
        params: { category, query: name },
      });
      console.log("API Response:", response.data);
      setData(response.data.data || []); // 🔹 Agar `data` yo‘q bo‘lsa, bo‘sh massiv beramiz
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    getProducts(selectedCategory, searchQuery);
  }, [selectedCategory, searchQuery]);

  return (
    <div className="Products">
      <div className="products_top">
        <h3 className="product_title">Barcha mahsulotlar</h3>
      </div>
      <CardList products={data} />
    </div>
  );
}

export default Products;
