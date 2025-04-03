import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import * as animeService from "../services/animeService";
import AnimeCard from "../components/anime/AnimeCard";
import { FaFilter } from "react-icons/fa";

const Browse = () => {
  const [animeList, setAnimeList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    genre: "",
    sort: "score",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        setIsLoading(true);
        const data = await animeService.getAnimeData();

        if (data && data.anime) {
          let filteredList = [...data.anime];

          // Terapkan filter
          if (filters.type) {
            filteredList = filteredList.filter(
              (anime) => anime.type === filters.type
            );
          }

          if (filters.status) {
            filteredList = filteredList.filter(
              (anime) => anime.status === filters.status
            );
          }

          if (filters.genre) {
            filteredList = filteredList.filter(
              (anime) =>
                anime.genres &&
                anime.genres.some((genre) => genre.name === filters.genre)
            );
          }

          // Terapkan pengurutan
          if (filters.sort === "score") {
            filteredList.sort((a, b) => (b.score || 0) - (a.score || 0));
          } else if (filters.sort === "popularity") {
            filteredList.sort(
              (a, b) => (b.popularity || 0) - (a.popularity || 0)
            );
          } else if (filters.sort === "favorites") {
            filteredList.sort(
              (a, b) => (b.favorites || 0) - (a.favorites || 0)
            );
          } else if (filters.sort === "newest") {
            filteredList.sort(
              (a, b) =>
                new Date(b.aired?.from || 0) - new Date(a.aired?.from || 0)
            );
          }

          setAnimeList(filteredList);
        }
      } catch (error) {
        console.error("Error fetching anime data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnime();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Opsi untuk filter
  const typeOptions = ["TV", "Movie", "OVA", "Special", "ONA", "Music"];
  const statusOptions = ["Airing", "Complete", "Upcoming"];
  const genreOptions = [
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Fantasy",
    "Horror",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Slice of Life",
    "Sports",
    "Supernatural",
    "Thriller",
  ];
  const sortOptions = [
    { value: "score", label: "Skor Tertinggi" },
    { value: "popularity", label: "Popularitas" },
    { value: "favorites", label: "Favorit" },
    { value: "newest", label: "Terbaru" },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Browse Anime</h1>
          <button
            onClick={toggleFilters}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-darker rounded-md transition"
          >
            <FaFilter />
            Filter
          </button>
        </div>

        {/* Filter Section */}
        {showFilters && (
          <div className="bg-dark-surface/90 backdrop-blur-md p-6 rounded-lg mb-8 shadow-lg animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Tipe</label>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="w-full p-2 bg-black/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Semua Tipe</option>
                  {typeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full p-2 bg-black/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Semua Status</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Genre Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Genre</label>
                <select
                  name="genre"
                  value={filters.genre}
                  onChange={handleFilterChange}
                  className="w-full p-2 bg-black/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Semua Genre</option>
                  {genreOptions.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Urutkan
                </label>
                <select
                  name="sort"
                  value={filters.sort}
                  onChange={handleFilterChange}
                  className="w-full p-2 bg-black/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Anime Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {[...Array(18)].map((_, index) => (
              <div
                key={index}
                className="bg-dark-surface rounded-lg overflow-hidden aspect-[3/4] animate-pulse"
              >
                <div className="h-full bg-gray-800"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-400">
              Menampilkan {animeList.length} hasil
            </div>

            {animeList.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {animeList.map((anime) => (
                  <AnimeCard key={anime.mal_id || anime.id} anime={anime} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-xl text-gray-400 mb-4">
                  Tidak ada hasil yang ditemukan
                </p>
                <p className="text-gray-500">
                  Coba ubah filter untuk melihat lebih banyak anime
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Browse;
