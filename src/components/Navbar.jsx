import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiShoppingCart,
  FiUser,
  FiSearch,
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
  FiLogOut,
  FiHeart,
  FiChevronDown,
  FiHome,
  FiCamera,
  FiEdit3
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { toggleCart, openCart } from '../store/slices/cartSlice';
import { toggleTheme } from '../store/slices/userSlice';
import SearchModal from './SearchModal';
import toast from 'react-hot-toast';

const Navbar = () => {
  console.log('🧭 Navbar component rendering...');
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, isAuthenticated, theme, logout } = useAuth();
  const { totalItems } = useSelector(state => state.cart);

  console.log('🧭 Navbar state:', { user, isAuthenticated, theme, totalItems });

  // Track scroll position for floating navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100); // Trigger after 100px scroll
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close user dropdown when clicking outside
      if (isDropdownOpen && !event.target.closest('.user-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Handle ESC key to close dropdowns
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleProfilePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target.result;
        
        // Store in localStorage
        localStorage.setItem('userAvatar', imageDataUrl);
        
        // Update Redux state (we'll need to update the user slice)
        dispatch({
          type: 'user/updateAvatar',
          payload: imageDataUrl
        });
        
        toast.success('Profile photo updated successfully!');
      };
      reader.onerror = () => {
        toast.error('Failed to upload image. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearch = () => {
    setIsSearchOpen(true);
  };

  const handleCartClick = () => {
    dispatch(openCart());
  };

  const handleLogout = () => {
    toast.success('Logged out successfully!');
    logout();
    navigate('/');
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const handleEditProfile = () => {
    navigate('/profile');
    setIsDropdownOpen(false);
  };

  const handleWishlist = () => {
    navigate('/wishlist');
    setIsDropdownOpen(false);
  };

  const handleOrderHistory = () => {
    navigate('/orders');
    setIsDropdownOpen(false);
  };

  // Navigation items matching Kicks Kenya structure
  const navItems = [
    { 
      name: 'Footwear', 
      path: '/collection?category=sneakers',
      dropdown: [
        { 
          name: 'Shop All Footwear', 
          path: '/collection?category=sneakers',
          subItems: [
            { name: 'All Sneakers', path: '/collection?category=sneakers' },
            { name: 'Running Shoes', path: '/collection?category=running' },
            { name: 'Basketball', path: '/collection?category=basketball' },
            { name: 'Lifestyle', path: '/collection?category=lifestyle' }
          ]
        },
        { 
          name: 'Brand', 
          path: '/collection',
          subItems: [
            { name: 'Nike', path: '/collection?brand=nike' },
            { name: 'Adidas', path: '/collection?brand=adidas' },
            { name: 'Jordan', path: '/collection?brand=jordan' },
            { name: 'Puma', path: '/collection?brand=puma' }
          ]
        },
        { 
          name: 'Gender', 
          path: '/collection',
          subItems: [
            { name: 'Mens', path: '/collection?gender=mens' },
            { name: 'Womens', path: '/collection?gender=womens' },
            { name: 'Kids', path: '/collection?gender=kids' },
            { name: 'Unisex', path: '/collection?gender=unisex' }
          ]
        },
        { 
          name: 'Bestsellers', 
          path: '/collection',
          subItems: [
            { name: 'Air Force 1', path: '/collection?product=air-force-1' },
            { name: 'Jordan 1 Travis', path: '/collection?product=jordan-1-travis' },
            { name: 'Puma CA Pro', path: '/collection?product=puma-ca-pro' },
            { name: 'Ultraboost 22', path: '/collection?product=ultraboost-22' }
          ]
        }
      ]
    },
    { 
      name: 'Apparel', 
      path: '/collection?category=apparel',
      dropdown: [
        { 
          name: 'Shop All Apparel', 
          path: '/collection?category=apparel',
          subItems: [
            { name: 'All Clothing', path: '/collection?category=apparel' },
            { name: 'T-Shirts', path: '/collection?category=tshirts' },
            { name: 'Hoodies', path: '/collection?category=hoodies' },
            { name: 'Jackets', path: '/collection?category=jackets' }
          ]
        },
        { 
          name: 'Brand', 
          path: '/collection',
          subItems: [
            { name: 'Nike', path: '/collection?brand=nike&category=apparel' },
            { name: 'Adidas', path: '/collection?brand=adidas&category=apparel' },
            { name: 'Puma', path: '/collection?brand=puma&category=apparel' },
            { name: 'Jordan', path: '/collection?brand=jordan&category=apparel' }
          ]
        },
        { 
          name: 'Gender', 
          path: '/collection',
          subItems: [
            { name: 'Mens', path: '/collection?gender=mens&category=apparel' },
            { name: 'Womens', path: '/collection?gender=womens&category=apparel' },
            { name: 'Kids', path: '/collection?gender=kids&category=apparel' },
            { name: 'Unisex', path: '/collection?gender=unisex&category=apparel' }
          ]
        },
        { 
          name: 'Bestsellers', 
          path: '/collection',
          subItems: [
            { name: 'Nike Tech Fleece', path: '/collection?product=nike-tech-fleece' },
            { name: 'Adidas Originals', path: '/collection?product=adidas-originals' },
            { name: 'Puma Essentials', path: '/collection?product=puma-essentials' },
            { name: 'Jordan Brand', path: '/collection?product=jordan-brand' }
          ]
        }
      ]
    },
    { 
      name: 'Accessories', 
      path: '/collection?category=accessories',
      dropdown: [
        { 
          name: 'Shop All Accessories', 
          path: '/collection?category=accessories',
          subItems: [
            { name: 'All Accessories', path: '/collection?category=accessories' },
            { name: 'Bags', path: '/collection?category=bags' },
            { name: 'Hats', path: '/collection?category=hats' },
            { name: 'Socks', path: '/collection?category=socks' }
          ]
        },
        { 
          name: 'Brand', 
          path: '/collection',
          subItems: [
            { name: 'Nike', path: '/collection?brand=nike&category=accessories' },
            { name: 'Adidas', path: '/collection?brand=adidas&category=accessories' },
            { name: 'Puma', path: '/collection?brand=puma&category=accessories' },
            { name: 'Jordan', path: '/collection?brand=jordan&category=accessories' }
          ]
        },
        { 
          name: 'Categories', 
          path: '/collection',
          subItems: [
            { name: 'Bags & Backpacks', path: '/collection?category=bags' },
            { name: 'Hats & Caps', path: '/collection?category=hats' },
            { name: 'Socks', path: '/collection?category=socks' },
            { name: 'Watches', path: '/collection?category=watches' }
          ]
        },
        { 
          name: 'Bestsellers', 
          path: '/collection',
          subItems: [
            { name: 'Nike Dri-FIT', path: '/collection?product=nike-dri-fit' },
            { name: 'Adidas Originals', path: '/collection?product=adidas-originals-accessories' },
            { name: 'Puma Essentials', path: '/collection?product=puma-essentials-accessories' },
            { name: 'Jordan Brand', path: '/collection?product=jordan-brand-accessories' }
          ]
        }
      ]
    },
    { 
      name: 'Editorial', 
      path: '/editorial',
      dropdown: [
        { 
          name: 'About Us', 
          path: '/about',
          subItems: [
            { name: 'Our Story', path: '/about' },
            { name: 'Mission', path: '/mission' },
            { name: 'Values', path: '/values' },
            { name: 'Team', path: '/team' }
          ]
        },
        { 
          name: 'News', 
          path: '/news',
          subItems: [
            { name: 'Latest News', path: '/news' },
            { name: 'Press Releases', path: '/press' },
            { name: 'Media Kit', path: '/media-kit' },
            { name: 'Contact', path: '/contact' }
          ]
        },
        { 
          name: 'Community', 
          path: '/community',
          subItems: [
            { name: 'Blog', path: '/blog' },
            { name: 'Reviews', path: '/reviews' },
            { name: 'Events', path: '/events' },
            { name: 'Partnerships', path: '/partnerships' }
          ]
        },
        { 
          name: 'Support', 
          path: '/support',
          subItems: [
            { name: 'Help Center', path: '/help' },
            { name: 'Size Guide', path: '/size-guide' },
            { name: 'Shipping', path: '/shipping' },
            { name: 'Returns', path: '/returns' }
          ]
        }
      ]
    }
  ];

  return (
    <>
      {/* Main Navigation */}
      <nav className={`sticky top-0 bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl shadow-2xl z-[9999] border-b border-white/20 dark:border-gray-700/30 transition-all duration-500 ease-in-out ${
        isScrolled 
          ? 'my-2 mx-auto w-full md:w-4/5 lg:w-3/4 xl:w-1/2 rounded-2xl' 
          : 'w-full rounded-none'
      }`}>
        {/* Glassmorphism Background Effect */}
        <div className={`absolute inset-0 bg-gradient-to-r from-seekon-midnight/40 via-seekon-deepNavy/30 to-seekon-midnight/40 backdrop-blur-2xl ${
          isScrolled ? 'rounded-2xl' : ''
        }`}></div>
        <div className={`absolute inset-0 bg-gradient-to-b from-white/10 to-transparent ${
          isScrolled ? 'rounded-2xl' : ''
        }`}></div>
        
        <div className="relative max-w-7xl mx-auto px-2 sm:px-3 md:px-4 lg:px-6">
          <div className="flex justify-between items-center h-12 sm:h-14 md:h-16">

            {/* Left Side - Home Icon */}
            <div className="flex items-center">
              <Link
                to="/"
                className="relative p-2 sm:p-3 hover:bg-white/10 hover:backdrop-blur-sm rounded-xl transition-all duration-300 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-seekon-electricRed/20 to-seekon-neonCyan/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <FiHome className="relative w-4 h-4 sm:w-5 sm:h-5 text-seekon-softWhite group-hover:text-seekon-pureWhite transition-colors duration-300" />
              </Link>
            </div>

            {/* Center - Navigation (Visible on All Screens) */}
            <div className="flex items-center space-x-0.5 sm:space-x-1 md:space-x-2 overflow-x-auto scrollbar-hide">
              {navItems.map((item) => (
                <div key={item.name} className="relative group z-[100000]">
                  <Link
                    to={item.path}
                    className="flex items-center space-x-0.5 sm:space-x-1 px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 text-seekon-softWhite hover:text-seekon-pureWhite font-medium transition-all duration-300 rounded-lg hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-lg hover:shadow-seekon-electricRed/20 text-[10px] sm:text-xs md:text-sm lg:text-base whitespace-nowrap"
                  >
                    <span className="relative z-10">{item.name}</span>
                    {item.isNew && (
                      <span className="bg-gradient-to-r from-seekon-electricRed to-seekon-electricRed/80 text-seekon-pureWhite text-xs px-2 py-0.5 rounded-full ml-1 animate-pulse shadow-lg shadow-seekon-electricRed/50">
                        NEW
                      </span>
                    )}
                    {item.isSale && (
                      <span className="bg-gradient-to-r from-seekon-goldMetallic to-seekon-goldMetallic/80 text-seekon-midnight text-xs px-2 py-0.5 rounded-full ml-1 font-bold shadow-lg shadow-seekon-goldMetallic/50">
                        SALE
                      </span>
                    )}
                    {item.dropdown && <FiChevronDown className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" />}
                  </Link>

                  {/* Dropdown Menu */}
                  {item.dropdown && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 md:-translate-x-[45%] mt-2 w-[98vw] sm:w-[95vw] md:w-[90vw] max-w-[800px] bg-seekon-midnight/95 backdrop-blur-xl shadow-2xl border border-seekon-charcoalGray/30 rounded-xl sm:rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[99999] overflow-hidden">
                      {/* Clear glassmorphism background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-white/5"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-seekon-midnight/20 to-transparent"></div>
                      
                      <div className="relative p-4 sm:p-6">
                        {/* Header */}
                        <div className="mb-3 sm:mb-4">
                          <h3 className="text-base sm:text-lg font-bold text-seekon-pureWhite mb-2">{item.name}</h3>
                          <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-r from-seekon-electricRed to-seekon-neonCyan rounded-full"></div>
                        </div>

                        {/* Compact Horizontal Layout */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                          {item.dropdown.map((dropdownItem, index) => (
                            <div key={index} className="space-y-2">
                              {/* Group Header */}
                              <div className="flex items-center mb-1 sm:mb-2">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-seekon-electricRed to-seekon-neonCyan rounded-full mr-1.5 sm:mr-2 flex-shrink-0"></div>
                                <h4 className="text-xs sm:text-sm font-semibold text-seekon-pureWhite truncate">{dropdownItem.name}</h4>
                              </div>
                              
                              {/* Group Content */}
                              <div className="space-y-0.5 sm:space-y-1">
                                {dropdownItem.subItems ? (
                                  dropdownItem.subItems.map((subItem, subIndex) => (
                                    <Link
                                      key={subIndex}
                                      to={subItem.path}
                                      onClick={() => {
                                        // Close dropdown on mobile
                                        setIsMenuOpen(false);
                                        // Scroll to products section
                                        setTimeout(() => {
                                          const productSection = document.getElementById('products-section');
                                          if (productSection) {
                                            productSection.scrollIntoView({ behavior: 'smooth' });
                                          }
                                        }, 100);
                                      }}
                                      className="block px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs text-seekon-softWhite hover:text-seekon-pureWhite hover:bg-white/10 hover:backdrop-blur-sm rounded transition-all duration-200 group/item truncate"
                                    >
                                      <span className="flex items-center justify-between">
                                        <span>{subItem.name}</span>
                                        <div className="w-1 h-1 bg-seekon-electricRed/50 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity duration-200"></div>
                                      </span>
                                    </Link>
                                  ))
                                ) : (
                                  <Link
                                    to={dropdownItem.path}
                                    onClick={() => {
                                      // Close dropdown on mobile
                                      setIsMenuOpen(false);
                                      // Scroll to products section
                                      setTimeout(() => {
                                        const productSection = document.getElementById('products-section');
                                        if (productSection) {
                                          productSection.scrollIntoView({ behavior: 'smooth' });
                                        }
                                      }, 100);
                                    }}
                                    className="block px-2 py-1 text-xs text-seekon-softWhite hover:text-seekon-pureWhite hover:bg-white/10 hover:backdrop-blur-sm rounded transition-all duration-200 group/item"
                                  >
                                    <span className="flex items-center justify-between">
                                      <span className="font-medium">{dropdownItem.name}</span>
                                      <div className="w-1 h-1 bg-seekon-electricRed/50 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity duration-200"></div>
                                    </span>
                                  </Link>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Compact Footer */}
                        <div className="mt-4 pt-3 border-t border-white/10">
                          <div className="flex items-center justify-between">
                            <Link
                              to={item.path}
                              className="flex items-center px-3 py-1.5 bg-gradient-to-r from-seekon-electricRed/20 to-seekon-neonCyan/20 hover:from-seekon-electricRed/30 hover:to-seekon-neonCyan/30 backdrop-blur-sm rounded-lg transition-all duration-200 text-seekon-pureWhite text-sm font-medium"
                            >
                              <span>View All {item.name}</span>
                              <div className="w-3 h-3 ml-1.5 bg-gradient-to-r from-seekon-electricRed to-seekon-neonCyan rounded-full"></div>
                            </Link>
                            
                            {/* Quick Stats */}
                            <div className="flex items-center space-x-4 text-xs text-seekon-softWhite">
                              <span>500+ Products</span>
                              <span>•</span>
                              <span>Free Shipping</span>
                              <span>•</span>
                              <span>30-Day Returns</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-0.5 sm:space-x-1 md:space-x-2">
              {/* Search Icon */}
              <button
                onClick={handleSearch}
                className="relative p-1.5 sm:p-2 md:p-2.5 hover:bg-white/10 hover:backdrop-blur-sm rounded-xl transition-all duration-300 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-seekon-electricRed/20 to-seekon-neonCyan/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <FiSearch className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-seekon-softWhite group-hover:text-seekon-pureWhite transition-colors duration-300" />
              </button>

              {/* Cart */}
              <button
                onClick={handleCartClick}
                className="relative p-1.5 sm:p-2 md:p-2.5 hover:bg-white/10 hover:backdrop-blur-sm rounded-xl transition-all duration-300 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-seekon-electricRed/20 to-seekon-neonCyan/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <FiShoppingCart className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-seekon-softWhite group-hover:text-seekon-pureWhite transition-colors duration-300" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-seekon-electricRed to-seekon-electricRed/80 text-seekon-pureWhite text-[8px] rounded-full w-4 h-4 flex items-center justify-center animate-pulse shadow-lg shadow-seekon-electricRed/50">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="relative">
                {isAuthenticated ? (
                  <div className="relative group user-dropdown">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center space-x-1.5 px-1.5 py-1 hover:bg-white/10 hover:backdrop-blur-sm rounded-xl transition-all duration-300"
                    >
                    <div className="relative">
                      <img
                        src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                        alt={user?.name}
                          className="w-6 h-6 rounded-full ring-2 ring-seekon-electricRed/30 group-hover:ring-seekon-electricRed/60 transition-all duration-300"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-gradient-to-r from-seekon-electricRed to-seekon-neonCyan rounded-full border-2 border-seekon-midnight"></div>
                      </div>
                      <span className="text-xs sm:text-sm md:text-base font-medium text-seekon-softWhite group-hover:text-seekon-pureWhite transition-colors duration-300 hidden sm:inline truncate max-w-[80px] md:max-w-[120px]">
                        {user?.name || user?.email?.split('@')[0] || 'User'}
                      </span>
                    </button>

                    {/* User Dropdown */}
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-72 sm:w-80 md:w-96 bg-seekon-midnight/95 backdrop-blur-xl border border-seekon-charcoalGray/30 rounded-xl sm:rounded-2xl shadow-2xl z-[99999] overflow-hidden"
                        >
                          {/* User Profile Header */}
                          <div className="p-4 sm:p-6 border-b border-seekon-charcoalGray/30">
                            <div className="flex items-center space-x-3 sm:space-x-4">
                              <div className="relative flex-shrink-0 group">
                                <img
                                  src={user?.avatar || localStorage.getItem('userAvatar') || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                                  alt={user?.name}
                                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full ring-2 ring-seekon-electricRed/30 object-cover"
                                />
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-seekon-electricRed to-seekon-neonCyan rounded-full border-2 border-seekon-midnight"></div>
                                
                                {/* Photo Upload Overlay */}
                                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProfilePhotoUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                  />
                                  <FiCamera className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-seekon-pureWhite truncate">
                                  {user?.name || user?.email?.split('@')[0] || 'User'}
                                </h3>
                                <p className="text-xs sm:text-sm text-seekon-platinumSilver truncate">
                                  {user?.email || 'No email'}
                                </p>
                                {user?.role === 'admin' || user?.role === 'superadmin' ? (
                                  <p className="text-[10px] sm:text-xs text-seekon-neonCyan mt-1 capitalize">
                                    {user?.role || 'Member'}
                                  </p>
                                ) : (
                                  <p className="text-[10px] sm:text-xs text-seekon-neonCyan mt-1">Premium Member</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Menu Options */}
                          <div className="py-1 sm:py-2">
                            <button 
                              onClick={handleEditProfile}
                              className="w-full px-4 sm:px-6 py-2.5 sm:py-3 text-left text-seekon-softWhite hover:text-seekon-pureWhite hover:bg-white/10 transition-colors duration-200 flex items-center space-x-2 sm:space-x-3"
                            >
                              <FiEdit3 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                              <span className="text-sm sm:text-base">Edit Profile</span>
                            </button>
                            
                            <button 
                              onClick={handleWishlist}
                              className="w-full px-4 sm:px-6 py-2.5 sm:py-3 text-left text-seekon-softWhite hover:text-seekon-pureWhite hover:bg-white/10 transition-colors duration-200 flex items-center space-x-2 sm:space-x-3"
                            >
                              <FiHeart className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                              <span className="text-sm sm:text-base">Wishlist</span>
                            </button>
                            
                            <button 
                              onClick={handleOrderHistory}
                              className="w-full px-4 sm:px-6 py-2.5 sm:py-3 text-left text-seekon-softWhite hover:text-seekon-pureWhite hover:bg-white/10 transition-colors duration-200 flex items-center space-x-2 sm:space-x-3"
                            >
                              <FiShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                              <span className="text-sm sm:text-base">Order History</span>
                            </button>
                            
                            <div className="border-t border-seekon-charcoalGray/30 my-1 sm:my-2"></div>
                            
                            <button
                              onClick={handleLogout}
                              className="w-full px-4 sm:px-6 py-2.5 sm:py-3 text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-200 flex items-center space-x-2 sm:space-x-3"
                            >
                              <FiLogOut className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                              <span className="text-sm sm:text-base">Logout</span>
                            </button>
                    </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="px-2 py-1 text-xs sm:text-sm text-seekon-softWhite hover:text-seekon-pureWhite font-medium transition-all duration-300 rounded-lg hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-lg hover:shadow-seekon-electricRed/20"
                  >
                    Login
                  </Link>
                )}
              </div>

            </div>
          </div>

          {/* Additional Menu (Optional - can be removed) */}
          <AnimatePresence>
            {isMenuOpen && false && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="hidden border-t border-seekon-charcoalGray/30 bg-seekon-midnight/95 backdrop-blur-md"
              >
                <div className="py-3 sm:py-4 space-y-3 sm:space-y-4">
                  {/* Mobile User Profile */}
                  {isAuthenticated && (
                    <div className="px-3 sm:px-4 border-b border-seekon-charcoalGray/30 pb-4">
                      <div className="flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3">
                        <div className="relative">
                          <img
                            src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                            alt={user?.name}
                            className="w-12 h-12 rounded-full ring-2 ring-seekon-electricRed/30"
                          />
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-r from-seekon-electricRed to-seekon-neonCyan rounded-full border-2 border-seekon-midnight"></div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-seekon-pureWhite">
                            {user?.name || user?.email?.split('@')[0] || 'User'}
                          </h3>
                          <p className="text-sm text-seekon-platinumSilver">
                            {user?.email || 'No email'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mobile Home Icon */}
                  <div className="px-3 sm:px-4">
                    <Link
                      to="/"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 text-seekon-softWhite hover:text-seekon-pureWhite hover:bg-white/10 hover:backdrop-blur-sm rounded-xl transition-all duration-300 w-full"
                    >
                      <FiHome className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">Home</span>
                    </Link>
                  </div>

                  {/* Mobile Search Icon */}
                  <div className="px-4">
                    <button
                      onClick={() => {
                        setIsSearchOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-3 text-seekon-softWhite hover:text-seekon-pureWhite hover:bg-white/10 hover:backdrop-blur-sm rounded-xl transition-all duration-300 w-full"
                    >
                      <FiSearch className="w-5 h-5" />
                      <span>Search Products</span>
                    </button>
                  </div>

                  {/* About, Careers, Press Links */}
                  <div className="px-4 space-y-2">
                    <Link
                      to="/about"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full px-4 py-2.5 bg-white/5 backdrop-blur-md hover:bg-white/10 border border-white/10 hover:border-white/20 text-white transition-all duration-200 rounded-lg font-medium text-sm"
                    >
                      About
                    </Link>
                    <Link
                      to="/careers"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full px-4 py-2.5 bg-white/5 backdrop-blur-md hover:bg-white/10 border border-white/10 hover:border-white/20 text-white transition-all duration-200 rounded-lg font-medium text-sm"
                    >
                      Careers
                    </Link>
                    <Link
                      to="/press"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full px-4 py-2.5 bg-white/5 backdrop-blur-md hover:bg-white/10 border border-white/10 hover:border-white/20 text-white transition-all duration-200 rounded-lg font-medium text-sm"
                    >
                      Press
                    </Link>
                  </div>

                  {/* Mobile Navigation Links */}
                  {navItems.map((item) => (
                    <div key={item.name}>
                      <Link
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-3 text-seekon-softWhite hover:text-seekon-pureWhite hover:bg-white/10 hover:backdrop-blur-sm rounded-xl transition-all duration-300 mx-4"
                      >
                        <span className="flex items-center space-x-2">
                          <span>{item.name}</span>
                          {item.isNew && (
                            <span className="bg-gradient-to-r from-seekon-electricRed to-seekon-electricRed/80 text-seekon-pureWhite text-xs px-2 py-0.5 rounded-full shadow-lg shadow-seekon-electricRed/50">
                              NEW
                            </span>
                          )}
                          {item.isSale && (
                            <span className="bg-gradient-to-r from-seekon-goldMetallic to-seekon-goldMetallic/80 text-seekon-midnight text-xs px-2 py-0.5 rounded-full shadow-lg shadow-seekon-goldMetallic/50">
                              SALE
                            </span>
                          )}
                        </span>
                        {item.dropdown && <FiChevronDown className="w-4 h-4" />}
                      </Link>
                    </div>
                  ))}

                  {/* Mobile User Actions */}
                  <div className="px-4 pt-4 border-t border-seekon-charcoalGray/30">
                    {isAuthenticated ? (
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-seekon-softWhite hover:text-seekon-pureWhite hover:bg-white/10 hover:backdrop-blur-sm rounded-xl transition-all duration-300 mx-4"
                      >
                        <FiLogOut className="inline w-4 h-4 mr-3" />
                        Logout
                      </button>
                    ) : (
                      <div className="space-y-3 px-4">
                        <Link
                          to="/login"
                          onClick={() => setIsMenuOpen(false)}
                          className="block w-full text-center px-4 py-3 bg-gradient-to-r from-seekon-electricRed to-seekon-electricRed/80 text-seekon-pureWhite rounded-xl hover:bg-gradient-to-r hover:from-seekon-electricRed/90 hover:to-seekon-electricRed/70 transition-all duration-300 shadow-lg shadow-seekon-electricRed/50"
                        >
                          Login
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setIsMenuOpen(false)}
                          className="block w-full text-center px-4 py-3 border border-seekon-electricRed/50 text-seekon-electricRed rounded-xl hover:bg-seekon-electricRed/10 hover:backdrop-blur-sm transition-all duration-300"
                        >
                          Register
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
};

export default Navbar;