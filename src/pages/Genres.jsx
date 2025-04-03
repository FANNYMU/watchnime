import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import * as animeService from "../services/animeService";

const genreColors = {
  Action: "bg-red-500",
  Adventure: "bg-blue-500",
  Comedy: "bg-yellow-500",
  Drama: "bg-purple-500",
  Fantasy: "bg-indigo-500",
  Horror: "bg-red-800",
  Mystery: "bg-emerald-600",
  Romance: "bg-pink-500",
  "Sci-Fi": "bg-cyan-500",
  "Slice of Life": "bg-green-500",
  Sports: "bg-orange-500",
  Supernatural: "bg-violet-500",
  Thriller: "bg-gray-700",
};

const GenreCard = ({ genre, count, color }) => {
  return (
    <Link
      to={`/browse?genre=${genre}`}
      className={`${
        color || "bg-primary"
      } hover:opacity-90 transition rounded-lg overflow-hidden shadow-md hover:shadow-lg flex flex-col justify-between h-full`}
    >
      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-2">{genre}</h3>
        <p className="text-white/90 text-sm mb-4">{count} anime</p>
        <div className="flex justify-end">
          <span className="bg-white/30 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
            Lihat
          </span>
        </div>
      </div>
    </Link>
  );
};

const Genres = () => {
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setIsLoading(true);
        const data = await animeService.getAnimeData();

        if (data && data.anime) {
          // Ekstrak semua genre dari data anime
          const genreMap = new Map();

          data.anime.forEach((anime) => {
            if (anime.genres && anime.genres.length > 0) {
              anime.genres.forEach((genre) => {
                const genreName = genre.name;
                if (genreMap.has(genreName)) {
                  genreMap.set(genreName, genreMap.get(genreName) + 1);
                } else {
                  genreMap.set(genreName, 1);
                }
              });
            }
          });

          // Konversi map ke array untuk ditampilkan
          const genreArray = Array.from(genreMap, ([name, count]) => ({
            name,
            count,
            color: genreColors[name] || "bg-primary",
          })).sort((a, b) => b.count - a.count);

          setGenres(genreArray);
        }
      } catch (error) {
        console.error("Error fetching genre data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenres();
  }, []);

  // Filter genre berdasarkan pencarian
  const filteredGenres = genres.filter((genre) =>
    genre.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white">Genre Anime</h1>

          {/* Search Bar */}
          <div className="w-full md:w-1/3">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari genre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-4 pr-10 bg-dark-surface text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <svg
                className="absolute right-3 top-3 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, index) => (
              <div
                key={index}
                className="bg-dark-surface rounded-lg overflow-hidden h-32 animate-pulse"
              >
                <div className="h-full bg-gray-800"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {filteredGenres.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredGenres.map((genre) => (
                  <GenreCard
                    key={genre.name}
                    genre={genre.name}
                    count={genre.count}
                    color={genre.color}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-xl text-gray-400 mb-4">
                  Tidak ada genre yang ditemukan
                </p>
                <p className="text-gray-500">Coba kata kunci pencarian lain</p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Genres;
