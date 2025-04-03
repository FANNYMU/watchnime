import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import HeroSlider from "../components/anime/HeroSlider";
import SeasonalAnime from "../components/anime/SeasonalAnime";
import TopAnime from "../components/anime/TopAnime";
import TopCharacter from "../components/anime/TopCharacter";
import * as animeService from "../services/animeService";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  // Data yang telah diproses
  const [topAnime, setTopAnime] = useState([]);
  const [topAiringAnime, setTopAiringAnime] = useState([]);
  const [topUpcomingAnime, setTopUpcomingAnime] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [mostPopularAnime, setMostPopularAnime] = useState([]);
  const [mostFavoritedAnime, setMostFavoritedAnime] = useState([]);
  const [seasonalAnime, setSeasonalAnime] = useState([]);
  const [topCharacters, setTopCharacters] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await animeService.getAnimeData();

        if (data) {
          // Anggap struktur data dari API memiliki properti data.anime dan data.characters
          const animeList = data.anime || [];
          const characterList = data.characters || [];

          // Process data for different sections
          setTopAnime(animeService.getTopAnime(animeList, 15));
          setTopAiringAnime(animeService.getTopAiringAnime(animeList, 15));
          setTopUpcomingAnime(animeService.getTopUpcomingAnime(animeList, 15));
          setTopMovies(animeService.getTopMovies(animeList, 15));
          setMostPopularAnime(animeService.getMostPopularAnime(animeList, 15));
          setMostFavoritedAnime(
            animeService.getMostFavoritedAnime(animeList, 15)
          );
          setSeasonalAnime(
            animeService.getSeasonalAnime(animeList, "Spring", 2025, 12)
          );
          setTopCharacters(animeService.getTopCharacters(characterList, 15));
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
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSlider animeList={mostFavoritedAnime} />

      {/* Seasonal Anime Section */}
      <SeasonalAnime
        seasonalAnime={seasonalAnime}
        isLoading={isLoading}
        season="Spring"
        year={2025}
      />

      {/* Top Anime Section with Tabs */}
      <TopAnime
        allAnime={topAnime}
        topAiring={topAiringAnime}
        topUpcoming={topUpcomingAnime}
        topMovies={topMovies}
        mostPopular={mostPopularAnime}
        mostFavorited={mostFavoritedAnime}
        isLoading={isLoading}
      />

      {/* Top Characters Section */}
      <TopCharacter characters={topCharacters} isLoading={isLoading} />
    </Layout>
  );
}
