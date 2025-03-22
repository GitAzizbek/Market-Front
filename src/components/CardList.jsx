import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/scrollbar";
import { Scrollbar } from "swiper/modules";
import { useState } from "react";

function CardList({ products }) {
  const apiUrl = "https://admin.azizbekaliyev.uz";
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
  }, 1000);

  if (!products || products.length === 0) {
    return (
      <p>
        <i style={{ fontSize: "30px" }} className="bx bxl-dropbox"></i>
        <br />
        Hech qanday mahsulot topilmadi
      </p>
    );
  }

  return (
    <div className="products_bottom">
      <div
        className={
          loading == true ? "loading_container" : "loading_container active"
        }
      >
        <div class="post">
          <div class="avatar"></div>
          <div class="line"></div>
          <div class="line"></div>
        </div>

        <div class="post">
          <div class="avatar"></div>
          <div class="line"></div>
          <div class="line"></div>
        </div>

        <div class="post">
          <div class="avatar"></div>
          <div class="line"></div>
          <div class="line"></div>
        </div>

        <div class="post">
          <div class="avatar"></div>
          <div class="line"></div>
          <div class="line"></div>
        </div>
      </div>
      {products.map((item) => (
        <Link to={`/product/${item.id}`} key={item.id} className="card">
          <div className="card_top">
            <Swiper
              scrollbar={{ hide: false }}
              modules={[Scrollbar]}
              className="mySwiper"
            >
              {item.images && item.images.length > 0 ? (
                item.images.map((image) => (
                  <SwiperSlide key={image.id}>
                    <div className="img_box">
                      <img src={`${apiUrl}/${image.image}`} alt={item.name} />
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <div className="img_box">
                    <p>Rasm mavjud emas</p>
                  </div>
                </SwiperSlide>
              )}
            </Swiper>
          </div>
          <div className="card_bottom">
            <h6 className="card_title">{item.name}</h6>
            <p className="card_description">
              {item.description.slice(0, 30)}...
            </p>
            <p className="card_price">
              {parseInt(item.price).toLocaleString("en-US")} UZS
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default CardList;
