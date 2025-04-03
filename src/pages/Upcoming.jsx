import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import * as animeService from "../services/animeService";
import AnimeCard from "../components/anime/AnimeCard";
import { FaCalendarAlt } from "react-icons/fa";

const Upcoming = () => {
  const [upcomingAnime, setUpcomingAnime] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  // Tanggal untuk filter dalam bentuk timestamp, contoh: Summer 2024, Fall 2024, Winter 2025, Spring 2025
  const seasons = [
    { id: "all", name: "Semua" },
    { id: "summer2024", name: "Summer 2024" },
    { id: "fall2024", name: "Fall 2024" },
    { id: "winter2025", name: "Winter 2025" },
    { id: "spring2025", name: "Spring 2025" },
  ];

  useEffect(() => {
    const fetchUpcomingAnime = async () => {
      try {
        setIsLoading(true);
        const data = await animeService.getAnimeData();

        if (data && data.anime) {
          // Filter anime dengan status 'Not yet aired'
          const upcoming = data.anime.filter(
            (anime) =>
              anime.status === "Not yet aired" ||
              anime.status === "Upcoming" ||
              (anime.aired &&
                anime.aired.from &&
                new Date(anime.aired.from) > new Date())
          );

          // Urutkan berdasarkan tanggal rilis
          const sortedUpcoming = upcoming.sort((a, b) => {
            const dateA = a.aired?.from
              ? new Date(a.aired.from)
              : new Date(9999, 0);
            const dateB = b.aired?.from
              ? new Date(b.aired.from)
              : new Date(9999, 0);
            return dateA - dateB;
          });

          setUpcomingAnime(sortedUpcoming);
        }
      } catch (error) {
        console.error("Error fetching upcoming anime:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpcomingAnime();
  }, []);

  // Filter berdasarkan season
  const filteredAnime = upcomingAnime.filter((anime) => {
    if (activeTab === "all") return true;

    const airedDate = anime.aired?.from ? new Date(anime.aired.from) : null;
    if (!airedDate) return false;

    const year = airedDate.getFullYear();
    const month = airedDate.getMonth() + 1;

    switch (activeTab) {
      case "summer2024":
        return year === 2024 && month >= 6 && month <= 8;
      case "fall2024":
        return year === 2024 && month >= 9 && month <= 11;
      case "winter2025":
        return (
          (year === 2024 && month === 12) ||
          (year === 2025 && month >= 1 && month <= 2)
        );
      case "spring2025":
        return year === 2025 && month >= 3 && month <= 5;
      default:
        return true;
    }
  });

  // Kelompokkan anime berdasarkan bulan
  const groupByMonth = () => {
    const grouped = {};

    filteredAnime.forEach((anime) => {
      if (!anime.aired?.from) {
        if (!grouped["Tanggal Tidak Diketahui"]) {
          grouped["Tanggal Tidak Diketahui"] = [];
        }
        grouped["Tanggal Tidak Diketahui"].push(anime);
        return;
      }

      const date = new Date(anime.aired.from);
      const monthYear = `${date.toLocaleString("id-ID", {
        month: "long",
      })} ${date.getFullYear()}`;

      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }

      grouped[monthYear].push(anime);
    });

    return Object.entries(grouped).sort((a, b) => {
      if (a[0] === "Tanggal Tidak Diketahui") return 1;
      if (b[0] === "Tanggal Tidak Diketahui") return -1;

      const dateA = new Date(a[0].split(" ")[0] + " 1, " + a[0].split(" ")[1]);
      const dateB = new Date(b[0].split(" ")[0] + " 1, " + b[0].split(" ")[1]);

      return dateA - dateB;
    });
  };

  const groupedAnime = groupByMonth();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center mb-8">
          <FaCalendarAlt className="text-primary text-xl mr-3" />
          <h1 className="text-3xl font-bold text-white">Anime Mendatang</h1>
        </div>

        {/* Season Tabs */}
        <div className="flex overflow-x-auto no-scrollbar space-x-2 mb-8 pb-2">
          {seasons.map((season) => (
            <button
              key={season.id}
              onClick={() => setActiveTab(season.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === season.id
                  ? "bg-primary text-white"
                  : "bg-dark-surface text-gray-300 hover:bg-dark-surface/80"
              }`}
            >
              {season.name}
            </button>
          ))}
        </div>

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
            {filteredAnime.length > 0 ? (
              <div className="space-y-10">
                {groupedAnime.map(([month, animeList]) => (
                  <div key={month}>
                    <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-primary pl-3">
                      {month}
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                      {animeList.map((anime) => (
                        <AnimeCard
                          key={anime.mal_id || anime.id}
                          anime={anime}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-xl text-gray-400 mb-4">
                  Tidak ada anime mendatang untuk ditampilkan
                </p>
                <p className="text-gray-500">Coba pilih season yang berbeda</p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Upcoming;
