import React from "react";
import { Link } from "react-router-dom";

const CharacterCard = ({ character, rank }) => {
  return (
    <div className="relative group overflow-hidden rounded-lg transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-[#7738DF]/20">
      <div className="relative h-64 overflow-hidden">
        <img
          src={
            character.images?.jpg?.image_url ||
            character.images?.webp?.image_url
          }
          alt={character.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>

        {/* Rank Badge */}
        <div className="absolute top-2 left-2 bg-[#7738DF] text-white text-xs px-2 py-1 rounded-md">
          #{rank}
        </div>

        {/* Like Badge */}
        <div className="absolute top-2 right-2 bg-[#121212]/80 text-white text-xs px-2 py-1 rounded-md flex items-center">
          <span className="text-red-500 mr-1">❤</span>
          <span>
            {character.favorites
              ? `${
                  character.favorites >= 1000
                    ? (character.favorites / 1000).toFixed(1) + "K"
                    : character.favorites
                }`
              : "?"}
          </span>
        </div>

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-semibold line-clamp-2 text-sm md:text-base">
            {character.name}
          </h3>
          {character.anime && character.anime[0] && (
            <p className="text-gray-300 text-xs truncate mt-1">
              {character.anime[0].anime?.title}
            </p>
          )}
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

const TopCharacter = ({ characters, isLoading }) => {
  return (
    <section className="py-12 bg-[#121212]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-8 bg-[#7738DF]"></div>
            <h2 className="text-white text-2xl font-bold">Top Character</h2>
          </div>
          <Link
            to="/top-characters"
            className="text-[#7738DF] hover:text-[#8a52e8] transition-colors flex items-center"
          >
            <span>View More</span>
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </Link>
        </div>

        {/* Character Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {isLoading
            ? Array(10)
                .fill(0)
                .map((_, i) => <SkeletonCard key={i} />)
            : (characters || []).slice(0, 10).map((character, index) => (
                <Link
                  to={`/character/${character.mal_id}`}
                  key={character.mal_id}
                >
                  <CharacterCard character={character} rank={index + 1} />
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
};

export default TopCharacter;
