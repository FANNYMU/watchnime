import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import * as animeService from "../services/animeService";
import {
  FaStar,
  FaHeart,
  FaBookmark,
  FaPlay,
  FaPlus,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const AnimeDetail = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchAnimeDetail = async () => {
      try {
        setIsLoading(true);
        const data = await animeService.getAnimeData();

        if (data && data.anime) {
          const animeDetail = data.anime.find(
            (a) => a.mal_id.toString() === id || a.id.toString() === id
          );
          if (animeDetail) {
            setAnime(animeDetail);
          } else {
            console.error("Anime not found with ID:", id);
          }
        }
      } catch (error) {
        console.error("Error fetching anime detail:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchAnimeDetail();
    }
  }, [id]);

  // Cek apakah anime sudah ditambahkan ke daftar
  const [inList, setInList] = useState(false);
  const [listStatus, setListStatus] = useState("");

  useEffect(() => {
    if (anime) {
      // Cek localStorage untuk status anime
      const savedList = localStorage.getItem("myAnimeList");
      if (savedList) {
        const parsedList = JSON.parse(savedList);
        const animeInList = parsedList.find(
          (item) => item.anime.mal_id === anime.mal_id
        );

        if (animeInList) {
          setInList(true);
          setListStatus(animeInList.status);
        } else {
          setInList(false);
          setListStatus("");
        }
      }
    }
  }, [anime]);

  // Tambahkan anime ke daftar
  const addToList = (status) => {
    const savedList = localStorage.getItem("myAnimeList");
    let myList = savedList ? JSON.parse(savedList) : [];

    // Cek apakah anime sudah ada di daftar
    const existingIndex = myList.findIndex(
      (item) => item.anime.mal_id === anime.mal_id
    );

    if (existingIndex !== -1) {
      // Update status jika sudah ada
      myList[existingIndex].status = status;
    } else {
      // Tambahkan baru jika belum ada
      myList.push({
        anime: anime,
        status: status,
        addedAt: new Date().toISOString(),
      });
    }

    localStorage.setItem("myAnimeList", JSON.stringify(myList));
    setInList(true);
    setListStatus(status);
  };

  // Hapus anime dari daftar
  const removeFromList = () => {
    const savedList = localStorage.getItem("myAnimeList");
    if (savedList) {
      let myList = JSON.parse(savedList);
      myList = myList.filter((item) => item.anime.mal_id !== anime.mal_id);
      localStorage.setItem("myAnimeList", JSON.stringify(myList));
      setInList(false);
      setListStatus("");
    }
  };

  const tabs = [
    { id: "overview", label: "Ikhtisar" },
    { id: "episodes", label: "Episode" },
    { id: "characters", label: "Karakter" },
    { id: "reviews", label: "Ulasan" },
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="animate-pulse">
            <div className="w-full h-64 md:h-96 bg-dark-surface rounded-lg mb-8"></div>
            <div className="w-1/3 h-8 bg-dark-surface rounded mb-4"></div>
            <div className="w-full h-4 bg-dark-surface rounded mb-2"></div>
            <div className="w-full h-4 bg-dark-surface rounded mb-2"></div>
            <div className="w-2/3 h-4 bg-dark-surface rounded mb-8"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-dark-surface rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!anime) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="flex flex-col items-center justify-center py-16">
            <h2 className="text-2xl font-bold text-white mb-4">
              Anime tidak ditemukan
            </h2>
            <p className="text-gray-400 mb-6">
              Kami tidak dapat menemukan anime dengan ID: {id}
            </p>
            <Link
              to="/"
              className="bg-primary hover:bg-primary-darker text-white px-6 py-2 rounded-md font-medium transition"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header/Banner */}
      <div
        className="relative w-full h-80 md:h-96"
        style={{
          backgroundImage: `url(${
            anime.images?.jpg?.large_image_url ||
            anime.images?.webp?.large_image_url
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay gradasi untuk keterbacaan teks */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-dark-bg/70 to-transparent"></div>

        {/* Hero content container */}
        <div className="container mx-auto px-4 h-full relative z-10">
          <div className="flex flex-col md:flex-row items-end h-full pb-6">
            <div className="hidden md:block w-48 h-64 rounded-lg overflow-hidden shadow-lg shadow-black/50 mr-6 -mb-20 z-20">
              <img
                src={
                  anime.images?.jpg?.image_url || anime.images?.webp?.image_url
                }
                alt={anime.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white text-shadow-lg">
                {anime.title}
              </h1>
              {anime.title_japanese && (
                <p className="text-gray-300 text-lg mb-2">
                  {anime.title_japanese}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-primary/90 rounded text-xs font-medium">
                  {anime.type || "TV"}
                </span>
                <span className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded text-xs">
                  {anime.episodes
                    ? `${anime.episodes} Episode`
                    : "Unknown Episodes"}
                </span>
                {anime.status && (
                  <span className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded text-xs">
                    {anime.status}
                  </span>
                )}
                {anime.rating && (
                  <span className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded text-xs">
                    {anime.rating}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="font-bold text-white">
                    {anime.score || "-"}
                  </span>
                  <span className="text-gray-400 text-sm ml-1">
                    (
                    {anime.scored_by
                      ? `${(anime.scored_by / 1000).toFixed(1)}K`
                      : "0"}
                    )
                  </span>
                </div>
                <div className="flex items-center">
                  <FaHeart className="text-red-500 mr-1" />
                  <span className="text-white">
                    {anime.favorites
                      ? `${(anime.favorites / 1000).toFixed(1)}K`
                      : "0"}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary-darker rounded-full font-medium transition shadow-purple hover:shadow-md">
                  <FaPlay />
                  Watch Now
                </button>

                {inList ? (
                  <div className="relative group">
                    <button className="flex items-center gap-2 px-5 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full font-medium transition shadow-md">
                      <FaBookmark className="text-primary" />
                      {listStatus === "watching" && "Sedang Ditonton"}
                      {listStatus === "completed" && "Selesai"}
                      {listStatus === "planning" && "Direncanakan"}
                    </button>

                    <div className="absolute right-0 mt-2 w-40 bg-dark-surface/90 backdrop-blur-md rounded-md shadow-lg shadow-black/50 py-1 z-10 invisible group-hover:visible">
                      <button
                        onClick={() => addToList("watching")}
                        className={`block w-full text-left px-4 py-2 text-sm text-white hover:bg-primary/20 transition-colors ${
                          listStatus === "watching" ? "text-primary" : ""
                        }`}
                      >
                        Sedang Ditonton
                      </button>
                      <button
                        onClick={() => addToList("completed")}
                        className={`block w-full text-left px-4 py-2 text-sm text-white hover:bg-primary/20 transition-colors ${
                          listStatus === "completed" ? "text-primary" : ""
                        }`}
                      >
                        Selesai
                      </button>
                      <button
                        onClick={() => addToList("planning")}
                        className={`block w-full text-left px-4 py-2 text-sm text-white hover:bg-primary/20 transition-colors ${
                          listStatus === "planning" ? "text-primary" : ""
                        }`}
                      >
                        Direncanakan
                      </button>
                      <hr className="my-1 border-white/10" />
                      <button
                        onClick={removeFromList}
                        className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        Hapus dari daftar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => addToList("planning")}
                    className="flex items-center gap-2 px-5 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full font-medium transition shadow-md"
                  >
                    <FaPlus />
                    Tambahkan ke Daftar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar dengan info */}
          <div className="md:w-48 mb-6">
            <div className="md:hidden w-32 h-44 rounded-lg overflow-hidden shadow-lg shadow-black/50 mb-4 mx-auto">
              <img
                src={
                  anime.images?.jpg?.image_url || anime.images?.webp?.image_url
                }
                alt={anime.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-dark-surface rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-white mb-2">Informasi</h3>
              <div className="space-y-2 text-sm">
                {anime.type && (
                  <div>
                    <span className="text-gray-400">Tipe:</span>
                    <span className="text-white ml-2">{anime.type}</span>
                  </div>
                )}
                {anime.episodes && (
                  <div>
                    <span className="text-gray-400">Episode:</span>
                    <span className="text-white ml-2">{anime.episodes}</span>
                  </div>
                )}
                {anime.duration && (
                  <div>
                    <span className="text-gray-400">Durasi:</span>
                    <span className="text-white ml-2">{anime.duration}</span>
                  </div>
                )}
                {anime.status && (
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <span className="text-white ml-2">{anime.status}</span>
                  </div>
                )}
                {anime.aired?.string && (
                  <div>
                    <span className="text-gray-400">Tayang:</span>
                    <span className="text-white ml-2">
                      {anime.aired.string}
                    </span>
                  </div>
                )}
                {anime.season && anime.year && (
                  <div>
                    <span className="text-gray-400">Musim:</span>
                    <span className="text-white ml-2">
                      {anime.season} {anime.year}
                    </span>
                  </div>
                )}
                {anime.studios && anime.studios.length > 0 && (
                  <div>
                    <span className="text-gray-400">Studio:</span>
                    <span className="text-white ml-2">
                      {anime.studios.map((studio) => studio.name).join(", ")}
                    </span>
                  </div>
                )}
                {anime.source && (
                  <div>
                    <span className="text-gray-400">Sumber:</span>
                    <span className="text-white ml-2">{anime.source}</span>
                  </div>
                )}
                {anime.rating && (
                  <div>
                    <span className="text-gray-400">Rating:</span>
                    <span className="text-white ml-2">{anime.rating}</span>
                  </div>
                )}
              </div>
            </div>

            {anime.genres && anime.genres.length > 0 && (
              <div className="bg-dark-surface rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-white mb-2">Genre</h3>
                <div className="flex flex-wrap gap-2">
                  {anime.genres.map((genre) => (
                    <Link
                      key={genre.mal_id}
                      to={`/browse?genre=${genre.name}`}
                      className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-md hover:bg-primary/30 transition"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Content tabs */}
          <div className="flex-1">
            <div className="border-b border-gray-700 mb-6">
              <div className="flex overflow-x-auto no-scrollbar space-x-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 font-medium border-b-2 whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="mb-8">
              {activeTab === "overview" && (
                <div>
                  {/* Synopsis */}
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-3">
                      Sinopsis
                    </h2>
                    <div className="bg-dark-surface rounded-lg p-4">
                      <p
                        className={`text-gray-300 ${
                          !showFullSynopsis && "line-clamp-4"
                        }`}
                      >
                        {anime.synopsis || "Tidak ada sinopsis tersedia."}
                      </p>
                      {anime.synopsis && anime.synopsis.length > 300 && (
                        <button
                          onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                          className="flex items-center gap-1 text-primary hover:text-primary-darker mt-2 text-sm font-medium"
                        >
                          {showFullSynopsis ? (
                            <>
                              Lebih sedikit <FaChevronUp className="text-xs" />
                            </>
                          ) : (
                            <>
                              Baca selengkapnya{" "}
                              <FaChevronDown className="text-xs" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Trailer */}
                  {anime.trailer?.embed_url && (
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-white mb-3">
                        Trailer
                      </h2>
                      <div className="aspect-video overflow-hidden rounded-lg">
                        <iframe
                          src={anime.trailer.embed_url}
                          title={`${anime.title} trailer`}
                          className="w-full h-full"
                          allowFullScreen
                          frameBorder="0"
                        ></iframe>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "episodes" && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-3">
                    Daftar Episode
                  </h2>
                  <div className="bg-dark-surface rounded-lg p-4">
                    {anime.episodes ? (
                      <ul className="divide-y divide-gray-700">
                        {[...Array(anime.episodes)].map((_, index) => {
                          // Membuat URL streaming untuk episode
                          const streamingUrl =
                            anime.streaming_urls?.[index] ||
                            `https://watchnime.com/watch/${anime.mal_id}/${
                              index + 1
                            }`;

                          return (
                            <li key={index} className="py-3">
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="text-lg font-medium text-white">
                                    Episode {index + 1}
                                  </span>
                                  <p className="text-sm text-gray-400">
                                    {anime.title} - Episode {index + 1}
                                  </p>
                                </div>
                                <a
                                  href={streamingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 px-3 py-1 bg-white/10 hover:bg-primary/80 rounded-full text-sm transition-colors"
                                >
                                  <FaPlay className="text-xs" />
                                  Watch
                                </a>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="text-gray-400">
                        Tidak ada informasi episode tersedia.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "characters" && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-3">
                    Karakter
                  </h2>
                  {anime.characters && anime.characters.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {anime.characters.map((character) => (
                        <Link
                          key={character.mal_id}
                          to={`/character/${character.mal_id}`}
                          className="bg-dark-surface rounded-lg overflow-hidden flex flex-col transition-transform hover:scale-105"
                        >
                          <div className="h-40">
                            <img
                              src={
                                character.images?.jpg?.image_url ||
                                "/images/placeholder.jpg"
                              }
                              alt={character.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-3">
                            <h3 className="font-medium text-white line-clamp-1">
                              {character.name}
                            </h3>
                            <p className="text-xs text-gray-400">
                              {character.role || "Unknown role"}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-dark-surface rounded-lg p-4">
                      <p className="text-gray-400">
                        Tidak ada informasi karakter tersedia.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-3">Ulasan</h2>
                  <div className="bg-dark-surface rounded-lg p-4">
                    <p className="text-gray-400">
                      Tidak ada ulasan tersedia saat ini.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnimeDetail;
