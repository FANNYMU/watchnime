import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import AnimeCard from "../components/anime/AnimeCard";
import SkeletonCard from "../components/ui/SkeletonCard";
import { searchAnime } from "../services/animeService";
import { FaSearch } from "react-icons/fa";

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [allAnimeData, setAllAnimeData] = useState([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Extract search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q");
    if (query) {
      setSearchQuery(query);
    } else {
      setSearchResults([]);
      setIsLoading(false);
    }
  }, [location.search]);

  // Debounce search term to avoid excessive searches while typing
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchQuery);
      
      // Update URL with search query if it's not empty
      if (searchQuery.trim()) {
        const searchParams = new URLSearchParams();
        searchParams.set("q", searchQuery);
        navigate(`/search?${searchParams.toString()}`, { replace: true });
      }
    }, 300); // 300ms delay

    return () => {
      clearTimeout(timerId);
    };
  }, [searchQuery, navigate]);

  // Perform search when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm && allAnimeData.length > 0) {
      setIsLoading(true);
      // Use the searchAnime function from animeService
      const results = searchAnime(allAnimeData, debouncedSearchTerm);
      setSearchResults(results);
      setIsLoading(false);
    } else if (debouncedSearchTerm === "") {
      setSearchResults([]);
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, allAnimeData]);

  // Load all anime data from both sources
  useEffect(() => {
    const fetchAllAnimeData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch from anime-list.json
        const animeListResponse = await fetch('/api/anime-list.json');
        const animeListData = await animeListResponse.json();
        
        // Fetch from new-seasons.json
        const newSeasonsResponse = await fetch('/api/new-seasons.json');
        const newSeasonsData = await newSeasonsResponse.json();
        
        // Combine both data sources
        const combinedData = [
          ...(animeListData?.data || []),
          ...(newSeasonsData?.data || [])
        ];
        
        // Remove duplicates by mal_id
        const uniqueAnimeMap = new Map();
        combinedData.forEach(anime => {
          if (!uniqueAnimeMap.has(anime.mal_id)) {
            uniqueAnimeMap.set(anime.mal_id, anime);
          }
        });
        
        const uniqueAnimeData = Array.from(uniqueAnimeMap.values());
        setAllAnimeData(uniqueAnimeData);
        
        // If there's an active search query, perform search with the new data
        if (searchQuery) {
          const results = searchAnime(uniqueAnimeData, searchQuery);
          setSearchResults(results);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching anime data:", error);
        setIsLoading(false);
      }
    };
    
    fetchAllAnimeData();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Clear results immediately if search is empty
    if (!value.trim()) {
      setSearchResults([]);
      // Remove query from URL
      navigate("/search", { replace: true });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // This is now handled by the debounced effect
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Search Anime"}
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="mb-8">
            <div className="relative max-w-2xl">
              <input
                type="text"
                className="w-full bg-dark-surface text-white border border-gray-700 rounded-lg py-3 px-4 pl-12 focus:outline-none focus:border-primary"
                placeholder="Search for anime by title..."
                value={searchQuery}
                onChange={handleSearchChange}
                autoFocus
              />
              <FaSearch className="absolute left-4 top-4 text-gray-400" />
            </div>
          </form>

          {/* Results */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array(12)
                .fill(0)
                .map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {searchResults.map((anime) => (
                <Link
                  to={`/anime/${anime.mal_id}`}
                  key={anime.mal_id || `anime-${Math.random()}`}
                >
                  <AnimeCard anime={anime} />
                </Link>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-xl text-white mb-2">No results found</h2>
              <p className="text-gray-400">
                We couldn't find any anime matching "{searchQuery}"
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-xl text-white mb-2">Search for your favorite anime</h2>
              <p className="text-gray-400">
                Start typing to see results
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
