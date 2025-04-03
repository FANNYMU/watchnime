import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlay, FaPlus, FaHeart } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const HeroSlider = ({ animeList = [] }) => {
  const navigate = useNavigate();
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Pastikan ada data untuk ditampilkan
  if (!animeList || animeList.length === 0) {
    return <div>Loading...</div>;
  }

  // Pilih hanya 5 anime teratas untuk slider
  const featuredAnime = animeList.slice(0, 5);

  // Hitung tinggi hero (100vh dikurangi tinggi navbar)
  const heroHeight = Math.max(600, windowHeight); // 64px adalah tinggi navbar perkiraan

  return (
    <div
      className="hero-slider relative overflow-hidden"
      style={{ height: `${heroHeight}px` }}
    >
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        effect={"fade"}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Pagination, EffectFade]}
        className="w-full h-full"
      >
        {featuredAnime.map((anime) => (
          <SwiperSlide key={anime.mal_id || anime.id}>
            <div className="relative w-full h-full">
              {/* Image */}
              <img
                src={
                  anime.images?.jpg?.large_image_url ||
                  anime.image_url ||
                  "/images/placeholder.jpg"
                }
                alt={anime.title}
                className="w-full h-full object-cover object-center"
              />

              {/* Gradients and overlay - Opacity dikurangi agar gambar tidak terlalu samar */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-24 pt-16 z-10">
                <div className="w-full md:w-2/3 lg:w-1/2 animate-fadeIn">
                  <h3 className="text-xs sm:text-sm text-primary font-semibold uppercase tracking-wider mb-1 text-shadow">
                    {anime.type || "TV"} • {anime.episodes || "?"} Episodes
                  </h3>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 text-shadow-lg line-clamp-2">
                    {anime.title}
                  </h1>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {anime.genres?.slice(0, 3).map((genre) => (
                      <span
                        key={genre.mal_id || genre.id}
                        className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-xs"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>

                  <p className="text-sm sm:text-base text-white mb-6 line-clamp-3 text-shadow-lg max-w-xl">
                    {anime.synopsis || "No synopsis available"}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() =>
                        navigate(`/anime/${anime.mal_id || anime.id}`)
                      }
                      className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary-darker rounded-full font-medium transition shadow-purple hover:shadow-md"
                    >
                      <FaPlay /> Watch Now
                    </button>

                    <button className="flex items-center gap-2 px-5 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full font-medium transition shadow-md">
                      <FaPlus /> Add to List
                    </button>

                    <button className="hidden sm:flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition shadow-md">
                      <FaHeart className="text-rose-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSlider;
