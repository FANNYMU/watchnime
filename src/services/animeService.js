// Fungsi untuk mendapatkan data anime dari API Jikan
export const getAnimeData = async () => {
  try {
    // Siapkan struktur data yang akan dikembalikan
    const processedData = {
      anime: [],
      characters: [],
    };

    // Coba ambil data dari API Jikan
    try {
      console.log("Mencoba mengambil data dari API Jikan...");
      const topAnimeResponse = await fetch(
        "https://api.jikan.moe/v4/top/anime?limit=25"
      );
      const seasonalAnimeResponse = await fetch(
        "https://api.jikan.moe/v4/seasons/now?limit=12"
      );
      const topCharactersResponse = await fetch(
        "https://api.jikan.moe/v4/top/characters?limit=15"
      );

      if (
        !topAnimeResponse.ok ||
        !seasonalAnimeResponse.ok ||
        !topCharactersResponse.ok
      ) {
        // Cek apakah rate limit
        if (
          topAnimeResponse.status === 429 ||
          seasonalAnimeResponse.status === 429 ||
          topCharactersResponse.status === 429
        ) {
          throw new Error("Rate limit dari Jikan API");
        } else {
          throw new Error("Failed to fetch data from Jikan API");
        }
      }

      const topAnimeData = await topAnimeResponse.json();
      const seasonalAnimeData = await seasonalAnimeResponse.json();
      const topCharactersData = await topCharactersResponse.json();

      // Gabungkan data anime dari top dan seasonal untuk variasi
      const animeList = [...topAnimeData.data, ...seasonalAnimeData.data];

      // Tambahkan streaming_urls ke setiap anime
      const processedAnimeList = animeList.map((anime) => {
        // Jika anime tidak memiliki streaming_urls, buat
        if (!anime.streaming_urls) {
          anime.streaming_urls = [];
          // Buat URL streaming untuk setiap episode
          if (anime.episodes) {
            for (let i = 0; i < anime.episodes; i++) {
              anime.streaming_urls.push(
                `https://watchnime.com/watch/${anime.mal_id}/${i + 1}`
              );
            }
          }
        }
        return anime;
      });

      // Set data anime dan karakter
      processedData.anime = processedAnimeList;
      processedData.characters = topCharactersData.data;

      return processedData;
    } catch (apiError) {
      console.error(`Error fetching data from Jikan API: ${apiError.message}`);

      // Fallback to local JSON files in case of API errors
      console.info("Switching to local JSON data as fallback...");

      // Ambil data dari file JSON lokal
      const [animeListResponse, charactersListResponse, newSeasonsResponse] =
        await Promise.all([
          fetch("/api/anime-list.json"),
          fetch("/api/characters-list.json"),
          fetch("/api/new-seasons.json"),
        ]);

      if (
        !animeListResponse.ok ||
        !charactersListResponse.ok ||
        !newSeasonsResponse.ok
      ) {
        throw new Error("Failed to fetch local JSON files");
      }

      const animeListData = await animeListResponse.json();
      const charactersListData = await charactersListResponse.json();
      const newSeasonsData = await newSeasonsResponse.json();

      // Gabungkan data anime dan tambahkan streaming_urls
      const combinedAnimeData = [];

      // Ambil data dari anime-list.json
      if (animeListData.data && Array.isArray(animeListData.data)) {
        combinedAnimeData.push(...animeListData.data);
      }

      // Tambahkan data dari new-seasons.json jika belum ada
      if (newSeasonsData.data && Array.isArray(newSeasonsData.data)) {
        newSeasonsData.data.forEach((anime) => {
          // Cek apakah anime sudah ada dalam data yang digabungkan (berdasarkan mal_id)
          const exists = combinedAnimeData.some(
            (item) => item.mal_id === anime.mal_id
          );
          if (!exists) {
            combinedAnimeData.push(anime);
          }
        });
      }

      // Tambahkan streaming_urls ke setiap anime
      const processedAnimeList = combinedAnimeData.map((anime) => {
        if (!anime.streaming_urls) {
          anime.streaming_urls = [];
          if (anime.episodes) {
            for (let i = 0; i < anime.episodes; i++) {
              anime.streaming_urls.push(
                `https://watchnime.com/watch/${anime.mal_id}/${i + 1}`
              );
            }
          }
        }
        return anime;
      });

      // Set data anime dan karakter dari file JSON lokal
      processedData.anime = processedAnimeList;
      processedData.characters = charactersListData.data || [];

      return processedData;
    }
  } catch (error) {
    console.error(
      `[AnimeService] Gagal mengambil data anime: ${error.message || error}`
    );

    // Logging informasi untuk debugging
    console.info(
      "[AnimeService] Mengembalikan data kosong sebagai fallback karena terjadi error"
    );
    return {
      anime: [],
      characters: [],
    };
  }
};

// Mendapatkan anime terpopuler berdasarkan skor
export const getTopAnime = (animeList, limit = 10) => {
  if (!animeList || !Array.isArray(animeList)) return [];

  return [...animeList].sort((a, b) => b.score - a.score).slice(0, limit);
};

// Mendapatkan anime yang sedang tayang
export const getTopAiringAnime = (animeList, limit = 10) => {
  if (!animeList || !Array.isArray(animeList)) return [];

  return [...animeList]
    .filter((anime) => anime.airing)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

// Mendapatkan anime yang akan datang
export const getTopUpcomingAnime = (animeList, limit = 10) => {
  if (!animeList || !Array.isArray(animeList)) return [];

  const currentDate = new Date();

  return [...animeList]
    .filter((anime) => {
      if (!anime.aired?.from) return false;
      const airDate = new Date(anime.aired.from);
      return airDate > currentDate;
    })
    .sort((a, b) => new Date(a.aired.from) - new Date(b.aired.from))
    .slice(0, limit);
};

// Mendapatkan film anime terbaik
export const getTopMovies = (animeList, limit = 10) => {
  if (!animeList || !Array.isArray(animeList)) return [];

  return [...animeList]
    .filter((anime) => anime.type === "Movie")
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

// Mendapatkan anime paling populer berdasarkan jumlah member
export const getMostPopularAnime = (animeList, limit = 10) => {
  if (!animeList || !Array.isArray(animeList)) return [];

  return [...animeList].sort((a, b) => b.members - a.members).slice(0, limit);
};

// Mendapatkan anime paling difavoritkan
export const getMostFavoritedAnime = (animeList, limit = 10) => {
  if (!animeList || !Array.isArray(animeList)) return [];

  return [...animeList]
    .sort((a, b) => b.favorites - a.favorites)
    .slice(0, limit);
};

// Mendapatkan anime berdasarkan musim
export const getSeasonalAnime = (animeList, season, year, limit = 10) => {
  if (!animeList || !Array.isArray(animeList)) return [];

  const currentYear = new Date().getFullYear();
  const targetYear = year || currentYear;

  return [...animeList]
    .filter((anime) => {
      if (!anime.aired?.from) return false;
      const airDate = new Date(anime.aired.from);
      const animeYear = airDate.getFullYear();

      if (animeYear !== targetYear) return false;

      if (season) {
        const month = airDate.getMonth();

        // Spring: 3-5, Summer: 6-8, Fall: 9-11, Winter: 0-2 & 12
        if (season === "Spring" && (month < 3 || month > 5)) return false;
        if (season === "Summer" && (month < 6 || month > 8)) return false;
        if (season === "Fall" && (month < 9 || month > 11)) return false;
        if (season === "Winter" && month > 2 && month < 12) return false;
      }

      return true;
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

// Mendapatkan karakter terpopuler
export const getTopCharacters = (characterList, limit = 10) => {
  if (!characterList || !Array.isArray(characterList)) return [];

  return [...characterList]
    .sort((a, b) => b.favorites - a.favorites)
    .slice(0, limit);
};

// Fungsi untuk mencari anime berdasarkan judul
export const searchAnime = (animeList, query) => {
  if (!animeList || !Array.isArray(animeList) || !query) return [];

  const searchTerm = query.toLowerCase().trim();

  return animeList.filter((anime) => {
    const title = anime.title?.toLowerCase() || "";
    const titleEnglish = anime.title_english?.toLowerCase() || "";
    const titleJapanese = anime.title_japanese?.toLowerCase() || "";

    return (
      title.includes(searchTerm) ||
      titleEnglish.includes(searchTerm) ||
      titleJapanese.includes(searchTerm)
    );
  });
};
