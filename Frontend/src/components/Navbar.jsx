import React, { useState } from "react";
import { Menu, X, Search, Sun, Moon } from "lucide-react";

export default function Navbar({
  isSidebarOpen,
  toggleSidebar,
  onSearch,
  theme,
  toggleTheme,
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) onSearch(value);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50 shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section */}
        <div className="flex items-center space-x-3">
          {/* Sidebar toggle (mobile only) */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* App Logo */}
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ChatApp
          </h1>
        </div>

        {/* Center Section (Desktop Search) */}
        <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 w-72 transition-all">
          <Search size={18} className="text-gray-500 dark:text-gray-300 mr-2" />
          <input
            type="text"
            value={query}
            onChange={handleSearchChange}
            placeholder="Search chats..."
            className="bg-transparent outline-none flex-1 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:scale-105 transition-all"
            title="Toggle theme"
          >
            {theme === "light" ? (
              <Moon size={18} className="text-gray-700 dark:text-gray-300" />
            ) : (
              <Sun size={18} className="text-yellow-400" />
            )}
          </button>

          {/* Search (mobile) */}
          <button
            className="md:hidden p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search size={20} />
          </button>

          {/* Profile Avatar */}
          <div
            className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold flex items-center justify-center hover:scale-105 cursor-pointer transition-transform"
            title="Your Profile"
          >
            SC
          </div>
        </div>
      </div>

      {/* Mobile Search Input */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-all">
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-2">
            <Search
              size={18}
              className="text-gray-500 dark:text-gray-300 mr-2"
            />
            <input
              type="text"
              value={query}
              onChange={handleSearchChange}
              placeholder="Search chats..."
              className="bg-transparent outline-none flex-1 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>
      )}
    </nav>
  );
}
