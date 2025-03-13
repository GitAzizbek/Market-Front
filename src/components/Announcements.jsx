import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import axios from "axios";
import { Autoplay, Navigation } from "swiper/modules";

function Announcements() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [data, setData] = useState([]);

  const getAnnounce = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/main/announce`);
      console.log("API Response:", response.data);
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  useEffect(() => {
    getAnnounce();
  }, []);

  return (
    <div className="Announce">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {data.map((item) => (
          <SwiperSlide key={item.id}>
            <div
              className="swiper-slide-background"
              style={{
                backgroundImage: `url(${apiUrl}${item.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "100%",
                height: "200px",
                borderRadius: "8px",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Announcements;
