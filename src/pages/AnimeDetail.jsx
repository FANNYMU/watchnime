import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
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
  const [inList, setInList] = useState(false);
  const [listStatus, setListStatus] = useState("");

  useEffect(() => {
    const fetchAnimeDetail = async () => {
      try {
        setIsLoading(true);
        
        // Try to find anime in both data sources
        let animeDetail = null;
        
        // First check anime-list.json
        const animeListResponse = await fetch('/api/anime-list.json');
        const animeListData = await animeListResponse.json();
        
        if (animeListData && animeListData.data) {
          animeDetail = animeListData.data.find(
            (a) => a.mal_id.toString() === id
          );
        }
        
        // If not found, check new-seasons.json
        if (!animeDetail) {
          const newSeasonsResponse = await fetch('/api/new-seasons.json');
          const newSeasonsData = await newSeasonsResponse.json();
          
          if (newSeasonsData && newSeasonsData.data) {
            animeDetail = newSeasonsData.data.find(
              (a) => a.mal_id.toString() === id
            );
          }
        }
        
        if (animeDetail) {
          setAnime(animeDetail);
          console.log("Found anime:", animeDetail);
          
          // Check if anime is in user's list
          const savedList = localStorage.getItem("myAnimeList");
          if (savedList) {
            const myList = JSON.parse(savedList);
            const inListItem = myList.find(
              (item) => item.anime.mal_id === animeDetail.mal_id
            );
            if (inListItem) {
              setInList(true);
              setListStatus(inListItem.status);
            }
          }
        } else {
          console.error("Anime not found with ID:", id);
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

  // Tambahkan anime ke daftar
  const addToList = (status) => {
    const savedList = localStorage.getItem("myAnimeList");
    let myList = savedList ? JSON.parse(savedList) : [];
    
    // Hapus jika sudah ada
    myList = myList.filter((item) => item.anime.mal_id !== anime.mal_id);
    
    // Tambahkan ke daftar dengan status baru
    myList.push({
      anime: {
        mal_id: anime.mal_id,
        title: anime.title,
        image: anime.images?.jpg?.image_url || anime.images?.webp?.image_url,
        episodes: anime.episodes,
        type: anime.type,
      },
      status,
      addedAt: new Date().toISOString(),
    });
    
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

  // Debugging - log the image URL
  console.log("Background image URL:", anime.images?.jpg?.large_image_url || anime.images?.webp?.large_image_url);

  return (
    <Layout>
      {/* Header/Banner */}
      <div className="relative w-full h-80 md:h-96 bg-dark-surface">
        {anime.images?.jpg?.large_image_url && (
          <div 
            className="absolute inset-0 bg-center bg-cover"
            style={{
              backgroundImage: `url(${anime.images.jpg.large_image_url})`,
            }}
          >
            {/* Overlay gradasi untuk keterbacaan teks */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/70 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-dark-bg/70 to-transparent"></div>
          </div>
        )}

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

              {/* Rating dan Status */}
              <div className="flex flex-wrap items-center gap-3 mt-2 mb-4">
                {anime.score && (
                  <div className="flex items-center bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded">
                    <FaStar className="mr-1" />
                    <span>{anime.score}</span>
                  </div>
                )}
                {anime.status && (
                  <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm">
                    {anime.status}
                  </div>
                )}
                {anime.rating && (
                  <div className="bg-gray-500/20 text-gray-300 px-2 py-1 rounded text-sm">
                    {anime.rating}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mt-4">
                {inList ? (
                  <div className="relative group">
                    <button className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary-darker rounded-full font-medium transition shadow-md">
                      <FaBookmark className="text-white" />
                      {listStatus === "watching" && "Sedang Ditonton"}
                      {listStatus === "completed" && "Selesai"}
                      {listStatus === "planning" && "Rencana"}
                      {listStatus === "dropped" && "Berhenti"}
                    </button>
                    <div className="absolute left-0 mt-2 w-48 bg-dark-surface rounded-lg shadow-lg overflow-hidden z-30 hidden group-hover:block">
                      <button
                        onClick={() => addToList("watching")}
                        className="w-full text-left px-4 py-2 hover:bg-dark-bg/80 transition"
                      >
                        Sedang Ditonton
                      </button>
                      <button
                        onClick={() => addToList("completed")}
                        className="w-full text-left px-4 py-2 hover:bg-dark-bg/80 transition"
                      >
                        Selesai
                      </button>
                      <button
                        onClick={() => addToList("planning")}
                        className="w-full text-left px-4 py-2 hover:bg-dark-bg/80 transition"
                      >
                        Rencana
                      </button>
                      <button
                        onClick={() => addToList("dropped")}
                        className="w-full text-left px-4 py-2 hover:bg-dark-bg/80 transition"
                      >
                        Berhenti
                      </button>
                      <div className="border-t border-dark-bg">
                        <button
                          onClick={removeFromList}
                          className="w-full text-left px-4 py-2 text-red-500 hover:bg-dark-bg/80 transition"
                        >
                          Hapus dari daftar
                        </button>
                      </div>
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
                      {anime.season.charAt(0).toUpperCase() +
                        anime.season.slice(1)}{" "}
                      {anime.year}
                    </span>
                  </div>
                )}
                {anime.studios && anime.studios.length > 0 && (
                  <div>
                    <span className="text-gray-400">Studio:</span>
                    <span className="text-white ml-2">
                      {anime.studios.map((s) => s.name).join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Genres */}
            {anime.genres && anime.genres.length > 0 && (
              <div className="bg-dark-surface rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-white mb-2">Genre</h3>
                <div className="flex flex-wrap gap-1">
                  {anime.genres.map((genre) => (
                    <span
                      key={genre.mal_id}
                      className="bg-primary/20 text-primary px-2 py-1 rounded text-xs"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Score */}
            {anime.score && (
              <div className="bg-dark-surface rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-white mb-2">Skor</h3>
                <div className="flex items-center">
                  <div className="text-3xl font-bold text-white mr-2">
                    {anime.score}
                  </div>
                  <div className="text-yellow-400">
                    <FaStar />
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {anime.scored_by
                    ? `${anime.scored_by.toLocaleString()} pengguna`
                    : ""}
                </div>
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="mb-6 border-b border-dark-surface">
              <div className="flex overflow-x-auto">
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

                  {/* Background */}
                  {anime.background && (
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-white mb-3">
                        Latar Belakang
                      </h2>
                      <div className="bg-dark-surface rounded-lg p-4">
                        <p className="text-gray-300">{anime.background}</p>
                      </div>
                    </div>
                  )}

                  {/* Related Anime */}
                  {anime.relations && anime.relations.length > 0 && (
                    <div>
                      <h2 className="text-xl font-bold text-white mb-3">
                        Anime Terkait
                      </h2>
                      <div className="bg-dark-surface rounded-lg p-4">
                        <ul className="space-y-2">
                          {anime.relations.map((relation, idx) => (
                            <li key={idx}>
                              <span className="text-gray-400">
                                {relation.relation}:{" "}
                              </span>
                              <span className="text-white">
                                {relation.entry
                                  .map((entry) => entry.name)
                                  .join(", ")}
                              </span>
                            </li>
                          ))}
                        </ul>
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
                  <div className="space-y-4">
                    {anime.episodes && anime.episodes > 0 ? (
                      [...Array(parseInt(anime.episodes))].map((_, index) => (
                        <div 
                          key={index} 
                          className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-dark-surface rounded-lg hover:bg-dark-bg/80 transition"
                        >
                          <div className="flex items-center mb-2 md:mb-0">
                            <div className="w-12 h-12 flex items-center justify-center bg-primary rounded-lg mr-4">
                              <FaPlay className="text-white" />
                            </div>
                            <div>
                              <h4 className="text-white font-medium">Episode {index + 1}</h4>
                              <p className="text-gray-400 text-sm">
                                {anime.duration || "24 min per ep"}
                              </p>
                            </div>
                          </div>
                          <button className="bg-primary hover:bg-primary-darker text-white px-4 py-2 rounded-md font-medium transition mt-2 md:mt-0">
                            Tonton
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="bg-dark-surface rounded-lg p-4">
                        <p className="text-gray-400">
                          Tidak ada episode tersedia.
                        </p>
                      </div>
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
