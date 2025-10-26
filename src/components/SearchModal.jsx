import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Mock suggestions data
  const mockSuggestions = [
    'Nike Air Force 1',
    'Adidas Ultraboost',
    'Jordan 1 Retro',
    'Puma Suede Classic',
    'Converse Chuck Taylor',
    'New Balance 990',
    'Vans Old Skool',
    'Nike Dunk Low',
    'Adidas Stan Smith',
    'Puma CA Pro'
  ];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setIsLoading(true);
      // Simulate API call delay
      const timer = setTimeout(() => {
        const filtered = mockSuggestions.filter(item =>
          item.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSuggestions(filtered);
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleSearch = (query = searchQuery) => {
    if (query.trim()) {
      // Add to recent searches
      const newRecent = [query, ...recentSearches.filter(item => item !== query)].slice(0, 5);
      setRecentSearches(newRecent);
      localStorage.setItem('recentSearches', JSON.stringify(newRecent));
      
      // Navigate to collection with search
      navigate(`/collection?search=${encodeURIComponent(query)}`);
      onClose();
      setSearchQuery('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleRecentClick = (recent) => {
    setSearchQuery(recent);
    handleSearch(recent);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-seekon-midnight/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 sm:top-20 left-1/2 transform -translate-x-1/2 w-full max-w-sm sm:max-w-xl md:max-w-2xl mx-3 sm:mx-4 bg-seekon-pureWhite rounded-xl shadow-2xl z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="p-4 sm:p-6 border-b border-seekon-platinumSilver">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-seekon-charcoalGray w-5 h-5" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search for products, brands, or styles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="w-full pl-12 pr-4 py-4 text-lg border border-seekon-platinumSilver rounded-lg focus:outline-none focus:ring-2 focus:ring-seekon-electricRed focus:border-transparent bg-seekon-pureWhite text-seekon-midnight placeholder-seekon-charcoalGray"
                  />
                </div>
                <button
                  onClick={() => handleSearch()}
                  className="bg-seekon-electricRed hover:bg-seekon-electricRed/90 text-seekon-pureWhite px-6 py-4 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  <span>Search</span>
                  <FiArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-seekon-platinumSilver rounded-lg transition-colors duration-200"
                >
                  <FiX className="w-5 h-5 text-seekon-charcoalGray" />
                </button>
              </div>
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {/* Recent Searches */}
              {searchQuery.length === 0 && recentSearches.length > 0 && (
                <div className="p-6 border-b border-seekon-platinumSilver">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-seekon-midnight">Recent Searches</h3>
                    <button
                      onClick={clearRecentSearches}
                      className="text-sm text-seekon-electricRed hover:text-seekon-electricRed/80 transition-colors duration-200"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="space-y-2">
                    {recentSearches.map((recent, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentClick(recent)}
                        className="w-full text-left px-4 py-3 hover:bg-seekon-platinumSilver rounded-lg transition-colors duration-200 flex items-center justify-between group"
                      >
                        <span className="text-seekon-midnight">{recent}</span>
                        <FiArrowRight className="w-4 h-4 text-seekon-charcoalGray group-hover:text-seekon-electricRed transition-colors duration-200" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Suggestions */}
              {searchQuery.length > 0 && (
                <div className="p-6">
                  <h3 className="font-semibold text-seekon-midnight mb-4">
                    {isLoading ? 'Searching...' : 'Suggestions'}
                  </h3>
                  
                  {isLoading ? (
                    <div className="space-y-2">
                      {[...Array(3)].map((_, index) => (
                        <div key={index} className="animate-pulse">
                          <div className="h-4 bg-seekon-platinumSilver rounded w-3/4"></div>
                        </div>
                      ))}
                    </div>
                  ) : suggestions.length > 0 ? (
                    <div className="space-y-2">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-4 py-3 hover:bg-seekon-platinumSilver rounded-lg transition-colors duration-200 flex items-center justify-between group"
                        >
                          <span className="text-seekon-midnight">{suggestion}</span>
                          <FiArrowRight className="w-4 h-4 text-seekon-charcoalGray group-hover:text-seekon-electricRed transition-colors duration-200" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FiSearch className="w-12 h-12 text-seekon-charcoalGray mx-auto mb-4" />
                      <p className="text-seekon-charcoalGray">No suggestions found for "{searchQuery}"</p>
                      <p className="text-sm text-seekon-charcoalGray mt-2">Try searching for brands like Nike, Adidas, or Puma</p>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Search Categories */}
              {searchQuery.length === 0 && recentSearches.length === 0 && (
                <div className="p-6">
                  <h3 className="font-semibold text-seekon-midnight mb-4">Popular Searches</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['Nike Sneakers', 'Adidas Running', 'Jordan Retro', 'Puma Classics'].map((category, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(category)}
                        className="p-3 text-left bg-seekon-platinumSilver hover:bg-seekon-charcoalGray hover:text-seekon-pureWhite rounded-lg transition-colors duration-200"
                      >
                        <span className="text-seekon-midnight hover:text-seekon-pureWhite">{category}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-seekon-platinumSilver rounded-b-xl">
              <p className="text-xs text-seekon-charcoalGray text-center">
                Press <kbd className="px-2 py-1 bg-seekon-charcoalGray text-seekon-pureWhite rounded text-xs">Enter</kbd> to search or <kbd className="px-2 py-1 bg-seekon-charcoalGray text-seekon-pureWhite rounded text-xs">Esc</kbd> to close
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
