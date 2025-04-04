import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";

// Navigation items
const navItems = [
  { name: "Home", path: "/" },
  { name: "Browse", path: "/browse" },
  { name: "Genres", path: "/genres" },
  { name: "Upcoming", path: "/upcoming" },
  { name: "My List", path: "/my-list" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const searchRef = useRef(null);

  // Handler untuk deteksi scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reset mobile menu on path change
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // Redirect to search page with query
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/70 backdrop-blur-md shadow-lg"
          : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <span className="text-white font-bold text-xl">WatchNime.</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-white hover:text-primary hover:bg-white/5"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center">
            {/* Search Toggle */}
            <button
              className="p-2 text-white rounded-full hover:bg-white/10 transition-colors"
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Search"
            >
              <FaSearch className="w-5 h-5" />
            </button>

            {/* User Menu */}
            <div className="relative ml-4">
              <button
                className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white hover:bg-primary-darker transition-colors"
                onClick={() => setShowDropdown(!showDropdown)}
                aria-label="User menu"
              >
                <span className="font-medium">A</span>
              </button>

              {/* User Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-dark-surface/90 backdrop-blur-md rounded-md shadow-lg shadow-black/50 py-1 z-10">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-white hover:bg-primary/20 transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-white hover:bg-primary/20 transition-colors"
                  >
                    Settings
                  </Link>
                  <hr className="my-1 border-white/10" />
                  <Link
                    to="/logout"
                    className="block px-4 py-2 text-white hover:bg-primary/20 transition-colors"
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="p-2 ml-4 text-white rounded-full hover:bg-white/10 transition-colors md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label={showMobileMenu ? "Close menu" : "Open menu"}
            >
              {showMobileMenu ? (
                <FaTimes className="w-5 h-5" />
              ) : (
                <FaBars className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {showSearch && (
        <div
          ref={searchRef}
          className="absolute top-16 left-0 right-0 bg-dark-surface/80 backdrop-blur-md shadow-lg p-4 z-40"
        >
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for anime, movies, characters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 pl-10 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
              <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-2 bg-primary hover:bg-primary-darker text-white px-3 py-1 rounded-md"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mobile Navigation */}
      {showMobileMenu && (
        <div className="md:hidden bg-dark-surface/95 backdrop-blur-md shadow-lg">
          <nav className="px-4 pt-2 pb-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-3 rounded-md text-base font-medium transition-colors ${
                  location.pathname === item.path
                    ? "bg-primary/20 text-primary"
                    : "text-white hover:bg-white/5 hover:text-primary"
                }`}
                onClick={() => setShowMobileMenu(false)}
              >
                {item.name}
              </Link>
            ))}
            <hr className="my-3 border-white/10" />
            <Link
              to="/profile"
              className="block px-4 py-2 text-white hover:bg-white/5 transition-colors"
            >
              Profile
            </Link>
            <Link
              to="/settings"
              className="block px-4 py-2 text-white hover:bg-white/5 transition-colors"
            >
              Settings
            </Link>
            <Link
              to="/logout"
              className="block px-4 py-2 text-white hover:bg-white/5 transition-colors"
            >
              Logout
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
