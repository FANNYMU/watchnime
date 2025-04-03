import React from "react";
import { Link } from "react-router-dom";

const AnimeCard = ({ anime }) => {
  return (
    <div className="relative group overflow-hidden rounded-lg transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-[#7738DF]/20">
      <div className="relative h-64 overflow-hidden">
        <img
          src={
            anime.images?.jpg?.large_image_url ||
            anime.images?.webp?.large_image_url ||
            anime.image_url ||
            "/images/placeholder.jpg"
          }
          alt={anime.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>

        {/* Episode Badge */}
        <div className="absolute top-2 left-2 bg-[#1c9c44] text-white text-xs px-2 py-1 rounded-md">
          Ep {anime.episodes || "??"}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-[#121212]/80 text-white text-xs px-2 py-1 rounded-md flex items-center">
          <span className="text-yellow-400 mr-1">★</span>
          <span>{anime.score || "?"}</span>
        </div>

        {/* Info yang muncul saat hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <h3 className="text-white font-semibold line-clamp-2 text-sm md:text-base mb-1">
            {anime.title}
          </h3>
          {anime.genres && anime.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {anime.genres.slice(0, 2).map((genre) => (
                <span
                  key={genre.mal_id || genre.id}
                  className="text-xs text-gray-300 bg-black/40 px-1.5 py-0.5 rounded"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-4 group-hover:opacity-0 transition-opacity">
          <h3 className="text-white font-semibold line-clamp-2 text-sm md:text-base">
            {anime.title}
          </h3>
        </div>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="rounded-lg overflow-hidden animate-pulse">
    <div className="h-64 bg-gray-800"></div>
  </div>
);

const SeasonalAnime = ({
  seasonalAnime,
  isLoading,
  season,
  year,
  viewMoreLink,
}) => {
  const currentYear = new Date().getFullYear();
  const defaultSeason = "Spring";
  const defaultYear = currentYear;

  // Memastikan ada minimal 4 dan maksimal 8 anime untuk ditampilkan
  const displayCount = Math.min(8, Math.max(4, seasonalAnime?.length || 0));
  const displayAnime = seasonalAnime?.slice(0, displayCount) || [];

  // Ekstrak season dan year untuk membuat link ke page seasonal
  const seasonLower = (season || defaultSeason).toLowerCase();
  const yearValue = year || defaultYear;
  const seasonalPageLink = `/seasonal?tab=${seasonLower}${yearValue}`;

  return (
    <section className="py-12 bg-[#121212]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-8 bg-[#7738DF]"></div>
            <h2 className="text-white text-2xl font-bold">Seasonal Anime</h2>
          </div>
          <div className="flex items-center">
            <p className="text-gray-300 mr-4">
              {season || defaultSeason} {year || defaultYear}
            </p>
            <Link
              to={viewMoreLink || seasonalPageLink}
              className="text-[#7738DF] hover:text-[#8a52e8] transition-colors flex items-center"
            >
              <span>View More</span>
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 relative">
            {isLoading ? (
              Array(6)
                .fill(0)
                .map((_, i) => <SkeletonCard key={i} />)
            ) : displayAnime.length > 0 ? (
              displayAnime.map((anime) => (
                <Link
                  to={`/anime/${anime.mal_id}`}
                  key={anime.mal_id || `anime-${Math.random()}`}
                >
                  <AnimeCard anime={anime} />
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-400">
                  Tidak ada anime musiman yang tersedia saat ini.
                </p>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          {displayAnime.length > 4 && (
            <>
              <button
                className="hidden md:flex absolute -left-5 top-1/2 transform -translate-y-1/2 bg-[#1E1E1E] hover:bg-[#7738DF] text-white w-10 h-10 rounded-full items-center justify-center transition-colors z-10"
                aria-label="Previous anime"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  ></path>
                </svg>
              </button>
              <button
                className="hidden md:flex absolute -right-5 top-1/2 transform -translate-y-1/2 bg-[#1E1E1E] hover:bg-[#7738DF] text-white w-10 h-10 rounded-full items-center justify-center transition-colors z-10"
                aria-label="Next anime"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default SeasonalAnime;
