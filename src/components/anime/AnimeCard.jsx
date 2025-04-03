import React from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const AnimeCard = ({ anime }) => {
  // Pastikan anime memiliki data yang valid
  if (!anime) return null;

  // Ambil data yang dibutuhkan
  const id = anime.mal_id || anime.id || 0;
  const title = anime.title || "Judul Tidak Tersedia";
  const imageUrl =
    anime.images?.jpg?.image_url ||
    anime.image_url ||
    "/images/placeholder.jpg";
  const score = anime.score || 0;
  const type = anime.type || "Unknown";
  const episodes = anime.episodes || "?";
  const status = anime.status || "Unknown";

  return (
    <Link
      to={`/anime/${id}`}
      className="bg-dark-surface rounded-lg overflow-hidden shadow-card hover-scale transition-all group"
    >
      <div className="relative aspect-[3/4]">
        {/* Image */}
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Overlay pada hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
          <div className="text-sm text-white">
            <div className="flex justify-between items-center mb-1">
              <span className="bg-primary/90 text-white text-xs px-2 py-0.5 rounded">
                {type}
              </span>
              {score > 0 && (
                <span className="flex items-center bg-black/60 text-xs px-2 py-0.5 rounded">
                  <FaStar className="text-yellow-400 mr-1" />
                  {score.toFixed(1)}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-300">
              {episodes !== "?" ? `${episodes} episode` : "? episode"} •{" "}
              {status}
            </p>
          </div>
        </div>
      </div>

      {/* Judul */}
      <div className="p-2">
        <h3 className="font-medium text-sm line-clamp-2 h-10">{title}</h3>
      </div>
    </Link>
  );
};

export default AnimeCard;
