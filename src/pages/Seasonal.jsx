import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Layout from "../components/layout/Layout";
import * as animeService from "../services/animeService";
import { FaCalendarAlt } from "react-icons/fa";

// Komponen AnimeCard yang sama dengan di SeasonalAnime
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

const SeasonalPage = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [seasonalAnime, setSeasonalAnime] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);

  // Ekstrak tab dari query parameter URL (tab=spring2025)
  const query = new URLSearchParams(location.search);
  const tabParam = query.get("tab");

  // Gunakan parameter tab dari URL jika ada, jika tidak, gunakan default "spring2025"
  const [activeTab, setActiveTab] = useState(tabParam || "spring2025");

  // Tab untuk season dan tahun
  const seasons = [
    { id: "winter2025", name: "Winter 2025" },
    { id: "spring2025", name: "Spring 2025" },
    { id: "summer2025", name: "Summer 2025" },
    { id: "fall2025", name: "Fall 2025" },
    { id: "winter2024", name: "Winter 2024" },
    { id: "spring2024", name: "Spring 2024" },
    { id: "summer2024", name: "Summer 2024" },
    { id: "fall2024", name: "Fall 2024" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await animeService.getAnimeData();

        if (data) {
          const animeList = data.anime || [];

          // Atur ulang hitungan yang terlihat saat mengganti tab
          setVisibleCount(8);

          // Pilih season dan tahun berdasarkan tab yang aktif
          const [season, year] = parseSeason(activeTab);

          // Dapatkan anime musiman berdasarkan season dan tahun
          const seasonalAnimeData = animeService.getSeasonalAnime(
            animeList,
            season,
            parseInt(year),
            100 // Ambil lebih banyak data untuk ditampilkan saat "View More" ditekan
          );

          setSeasonalAnime(seasonalAnimeData);
        } else {
          console.error("Failed to fetch anime data");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  // Fungsi untuk memparser tab ID menjadi season dan tahun
  const parseSeason = (tabId) => {
    const seasonMap = {
      winter: "Winter",
      spring: "Spring",
      summer: "Summer",
      fall: "Fall",
    };

    const matches = tabId.match(/([a-z]+)(\d+)/);
    if (matches && matches.length === 3) {
      const season = seasonMap[matches[1]];
      const year = matches[2];
      return [season, year];
    }

    return ["Spring", "2025"]; // Default
  };

  // Fungsi untuk menangani perubahan tab
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Update URL dengan tab yang dipilih, tanpa me-refresh halaman
    const newUrl = `${window.location.pathname}?tab=${tabId}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
  };

  // Fungsi untuk menambah jumlah anime yang ditampilkan
  const handleViewMore = () => {
    // Tambahkan 8 lebih banyak atau semua yang tersisa
    setVisibleCount((prev) => Math.min(prev + 8, seasonalAnime.length));
  };

  // Anime yang akan ditampilkan berdasarkan visibleCount
  const displayAnime = seasonalAnime.slice(0, visibleCount);

  // Cek apakah masih ada lebih banyak anime untuk ditampilkan
  const hasMoreToShow = visibleCount < seasonalAnime.length;

  // Dapatkan informasi season dan tahun untuk tampilan
  const [currentSeason, yearValue] = parseSeason(activeTab);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center mb-8">
          <FaCalendarAlt className="text-[#7738DF] text-xl mr-3" />
          <h1 className="text-3xl font-bold text-white">Anime Musiman</h1>
        </div>

        {/* Season Tabs */}
        <div className="flex overflow-x-auto no-scrollbar space-x-2 mb-8 pb-2">
          {seasons.map((season) => (
            <button
              key={season.id}
              onClick={() => handleTabChange(season.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === season.id
                  ? "bg-[#7738DF] text-white"
                  : "bg-[#1E1E1E] text-gray-300 hover:bg-[#1E1E1E]/80"
              }`}
            >
              {season.name}
            </button>
          ))}
        </div>

        {/* Header dengan info musim */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-8 bg-[#7738DF]"></div>
            <h2 className="text-white text-2xl font-bold">
              {currentSeason} {yearValue}
            </h2>
          </div>
          <div>
            <p className="text-gray-300">
              Menampilkan {displayAnime.length} dari {seasonalAnime.length}{" "}
              anime
            </p>
          </div>
        </div>

        {/* Grid tampilan anime */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-10">
          {isLoading ? (
            Array(8)
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
                Tidak ada anime musiman yang tersedia untuk {currentSeason}{" "}
                {yearValue}.
              </p>
            </div>
          )}
        </div>

        {/* View More Button */}
        {!isLoading && hasMoreToShow && (
          <div className="flex justify-center mb-12">
            <button
              onClick={handleViewMore}
              className="px-6 py-3 bg-[#1E1E1E] hover:bg-[#7738DF] text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <span>Tampilkan Lebih Banyak</span>
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
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SeasonalPage;
