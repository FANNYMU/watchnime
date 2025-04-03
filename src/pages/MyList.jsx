import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import AnimeCard from "../components/anime/AnimeCard";
import { FaPlus, FaTrash, FaBookmark, FaEye, FaList } from "react-icons/fa";

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <FaBookmark className="text-gray-600 text-6xl mb-4" />
    <h3 className="text-xl font-semibold text-white mb-2">
      Daftar Anda kosong
    </h3>
    <p className="text-gray-400 text-center max-w-md mb-6">
      Tambahkan anime ke daftar untuk melacak apa yang sudah Anda tonton dan apa
      yang ingin Anda tonton
    </p>
    <button className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary-darker rounded-full font-medium transition shadow-purple">
      <FaPlus />
      Jelajahi Anime
    </button>
  </div>
);

const MyList = () => {
  const [myAnimeList, setMyAnimeList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const tabs = [
    { id: "all", name: "Semua", icon: FaList },
    { id: "watching", name: "Sedang Ditonton", icon: FaEye },
    { id: "completed", name: "Selesai", icon: FaBookmark },
    { id: "planning", name: "Rencana", icon: FaPlus },
  ];

  // Simulasi pengambilan daftar anime pengguna
  useEffect(() => {
    const fetchMyList = async () => {
      try {
        setIsLoading(true);

        // Dalam aplikasi nyata, ini akan berisi panggilan API untuk mendapatkan daftar pengguna
        // Misalnya: const response = await api.get('/user/anime-list');

        // Untuk demonstrasi, kita menggunakan localStorage
        const savedList = localStorage.getItem("myAnimeList");

        if (savedList) {
          const parsedList = JSON.parse(savedList);
          setMyAnimeList(parsedList);
        } else {
          // Jika tidak ada data tersimpan, inisialisasi dengan array kosong
          setMyAnimeList([]);
          localStorage.setItem("myAnimeList", JSON.stringify([]));
        }
      } catch (error) {
        console.error("Error fetching my anime list:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyList();
  }, []);

  // Filter daftar berdasarkan tab aktif
  useEffect(() => {
    if (activeTab === "all") {
      setFilteredList(myAnimeList);
    } else {
      setFilteredList(myAnimeList.filter((item) => item.status === activeTab));
    }
  }, [activeTab, myAnimeList]);

  // Fungsi untuk mengubah status anime
  const updateAnimeStatus = (animeId, newStatus) => {
    const updatedList = myAnimeList.map((item) => {
      if (item.anime.mal_id === animeId) {
        return { ...item, status: newStatus };
      }
      return item;
    });

    setMyAnimeList(updatedList);
    localStorage.setItem("myAnimeList", JSON.stringify(updatedList));
  };

  // Fungsi untuk menghapus anime dari daftar
  const removeFromList = (animeId) => {
    const updatedList = myAnimeList.filter(
      (item) => item.anime.mal_id !== animeId
    );
    setMyAnimeList(updatedList);
    localStorage.setItem("myAnimeList", JSON.stringify(updatedList));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold text-white mb-8">
          Daftar Anime Saya
        </h1>

        {/* Tab navigation */}
        <div className="flex overflow-x-auto no-scrollbar space-x-2 mb-8 pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-white"
                    : "bg-dark-surface text-gray-300 hover:bg-dark-surface/80"
                }`}
              >
                <Icon />
                {tab.name}
                {tab.id !== "all" && (
                  <span className="bg-black/30 px-2 py-0.5 rounded-full text-xs">
                    {
                      myAnimeList.filter((item) => item.status === tab.id)
                        .length
                    }
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-dark-surface rounded-lg h-32"
              ></div>
            ))}
          </div>
        ) : (
          <>
            {filteredList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredList.map((item) => (
                  <div
                    key={item.anime.mal_id}
                    className="flex bg-dark-surface rounded-lg overflow-hidden shadow-md"
                  >
                    <div className="w-1/3 h-40">
                      <img
                        src={
                          item.anime.images?.jpg?.image_url ||
                          "/images/placeholder.jpg"
                        }
                        alt={item.anime.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-2/3 p-4 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-white line-clamp-1 mb-1">
                          {item.anime.title}
                        </h3>
                        <div className="flex items-center mb-2">
                          <span className="text-xs text-gray-400 mr-2">
                            {item.anime.episodes
                              ? `${item.anime.episodes} eps`
                              : "Unknown eps"}
                          </span>
                          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                            {item.anime.type || "TV"}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <select
                          value={item.status}
                          onChange={(e) =>
                            updateAnimeStatus(item.anime.mal_id, e.target.value)
                          }
                          className="bg-black/40 text-white text-xs px-2 py-1 rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="watching">Sedang Ditonton</option>
                          <option value="completed">Selesai</option>
                          <option value="planning">Rencana</option>
                        </select>

                        <button
                          onClick={() => removeFromList(item.anime.mal_id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Remove from list"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default MyList;
