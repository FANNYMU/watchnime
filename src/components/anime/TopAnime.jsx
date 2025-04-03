import React, { useState } from "react";
import { Link } from "react-router-dom";

const AnimeCard = ({ anime, rank }) => {
  return (
    <div className="relative group overflow-hidden rounded-lg transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-[#7738DF]/20">
      <div className="relative h-64 overflow-hidden">
        <img
          src={
            anime.images?.jpg?.large_image_url ||
            anime.images?.webp?.large_image_url
          }
          alt={anime.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>

        {/* Rank Badge */}
        <div className="absolute top-2 left-2 bg-[#7738DF] text-white text-xs px-2 py-1 rounded-md">
          #{rank}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-[#121212]/80 text-white text-xs px-2 py-1 rounded-md flex items-center">
          <span className="text-yellow-400 mr-1">★</span>
          <span>{anime.score || "?"}</span>
        </div>

        {/* Bookmark Button - Hidden until hover */}
        <button className="absolute top-2 right-2 bg-[#121212]/80 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center transform translate-y-2 group-hover:translate-y-0">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            ></path>
          </svg>
        </button>

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
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

const TopAnime = ({
  allAnime,
  topAiring,
  topUpcoming,
  topMovies,
  mostPopular,
  mostFavorited,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "All Anime", data: allAnime },
    { id: "airing", label: "Top Airing", data: topAiring },
    { id: "upcoming", label: "Top Upcoming", data: topUpcoming },
    { id: "movies", label: "Top Movies", data: topMovies },
    { id: "popular", label: "Most Popular", data: mostPopular },
    { id: "favorited", label: "Most Favorited", data: mostFavorited },
  ];

  const activeData = tabs.find((tab) => tab.id === activeTab)?.data || [];

  return (
    <section className="py-12 bg-[#121212]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-8 bg-[#7738DF]"></div>
            <h2 className="text-white text-2xl font-bold">Top Anime</h2>
          </div>
          <Link
            to="/top-anime"
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

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto no-scrollbar space-x-1 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 whitespace-nowrap font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Indicator Line */}
        <div className="relative h-[2px] bg-gray-700 mb-8">
          <div
            className="absolute h-[2px] bg-[#7738DF] transition-all duration-300 ease-in-out"
            style={{
              width: `${100 / tabs.length}%`,
              left: `${
                tabs.findIndex((tab) => tab.id === activeTab) *
                (100 / tabs.length)
              }%`,
            }}
          ></div>
        </div>

        {/* Anime Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {isLoading
            ? Array(10)
                .fill(0)
                .map((_, i) => <SkeletonCard key={i} />)
            : (activeData || []).slice(0, 10).map((anime, index) => (
                <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id}>
                  <AnimeCard anime={anime} rank={index + 1} />
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
};

export default TopAnime;
