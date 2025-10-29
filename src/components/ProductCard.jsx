import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlistLocal, removeFromWishlistLocal } from '../store/slices/wishlistSlice';
import { useAuth } from '../context/AuthContext';
import { formatPrice, calculateDiscount } from '../utils/formatPrice';
import toast from 'react-hot-toast';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Get Redux state at component level (hooks must be at top level)
  const wishlist = useSelector(state => state.wishlist.items);
  const user = useSelector(state => state.user.user);
  const cart = useSelector(state => state.cart.items);
  
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || 'black');

  // Check if product is in wishlist
  useEffect(() => {
    const inWishlist = wishlist.some(item => item.id === product.id);
    setIsWishlisted(inWishlist);
  }, [wishlist, product.id]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check authentication FIRST - redirect to login if not authenticated
    if (!isAuthenticated) {
      // Store redirect path for after login
      const currentPath = window.location.pathname;
      localStorage.setItem('redirectAfterLogin', currentPath);
      
      // Store product in sessionStorage for pending action with selected color
      const pendingItem = {
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          brand: product.brand
        },
        color: selectedColor, // Save the selected color
        size: null,
        quantity: 1
      };
      sessionStorage.setItem('pendingCartItem', JSON.stringify(pendingItem));
      
      toast.info('Please login to add items to your cart', {
        icon: '🔐',
        duration: 2500,
      });
      
      // Navigate to login immediately
      navigate('/login');
      return;
    }
    
    try {
      // Check if item already exists in cart
      const existingItem = cart.find(
        item => item.id === product.id && item.color === selectedColor && (item.size === null || item.size === undefined)
      );
      
      // Use local Redux store with fallback
    dispatch(addToCart({
        product: {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
          brand: product.brand
        },
        size: null,
        color: selectedColor,
      quantity: 1
    }));
      
      // Show toast
      if (existingItem) {
        toast.success(`${product.name} (${selectedColor}) - quantity updated! (${existingItem.quantity + 1})`, {
          icon: '🛒',
        });
      } else {
        toast.success(`${product.name} (${selectedColor}) added to cart!`, {
          icon: '🛒',
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart. Please try again.');
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check authentication FIRST - redirect to login if not authenticated
    if (!isAuthenticated) {
      // Store redirect path for after login
      const currentPath = window.location.pathname;
      localStorage.setItem('redirectAfterLogin', currentPath);
      
      // Store product in sessionStorage for pending action
      sessionStorage.setItem('pendingWishlistItem', JSON.stringify(product));
      
      toast.info('Please login to add items to your wishlist', {
        icon: '🔐',
        duration: 2500,
      });
      
      // Navigate to login immediately
      navigate('/login');
      return;
    }
    
    try {
      if (isWishlisted) {
        // Remove from wishlist (instant local Redux with fallback)
        dispatch(removeFromWishlistLocal({ productId: product.id }));
        setIsWishlisted(false);
        toast.success(`${product.name} removed from wishlist!`, {
          icon: '💔',
        });
      } else {
        // Add to wishlist (instant local Redux with fallback)
        dispatch(addToWishlistLocal({ product }));
        setIsWishlisted(true);
        toast.success(`${product.name} added to wishlist!`, {
          icon: '❤️',
        });
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add item to wishlist. Please try again.');
    }
  };

  const handleColorSelect = (e, color) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedColor(color);
  };

  // Get color hue for CSS filter
  const getColorHue = (color) => {
    const hueMap = {
      'black': 0,
      'white': 0,
      'red': 0,
      'blue': 220,
      'gray': 0,
      'grey': 0,
      'brown': 30,
      'green': 120,
      'yellow': 60,
      'orange': 30,
      'purple': 270,
      'pink': 330,
      'navy': 220,
      'maroon': 0,
      'teal': 180,
      'cyan': 180,
      'gold': 45,
      'silver': 0,
      'charcoal': 0
    };
    return hueMap[color.toLowerCase()] || 0;
  };

  // Enhanced color mapping with variety
  const getColorValue = (color) => {
    const colorMap = {
      // Basic Colors
      'black': '#000000',
      'white': '#ffffff',
      'red': '#ef4444',
      'blue': '#3b82f6',
      'gray': '#6b7280',
      'grey': '#6b7280',
      'brown': '#8b4513',
      'green': '#22c55e',
      'yellow': '#eab308',
      'orange': '#f97316',
      'purple': '#a855f7',
      'pink': '#ec4899',
      
      // Extended Colors
      'navy': '#1e3a8a',
      'beige': '#f5f5dc',
      'cream': '#fdf6e3',
      'maroon': '#800000',
      'burgundy': '#800020',
      'olive': '#808000',
      'teal': '#14b8a6',
      'cyan': '#06b6d4',
      'lime': '#84cc16',
      'indigo': '#6366f1',
      'violet': '#8b5cf6',
      'coral': '#ff7f50',
      'salmon': '#fa8072',
      'gold': '#ffd700',
      'silver': '#c0c0c0',
      'copper': '#b87333',
      'bronze': '#cd7f32',
      'rose': '#f43f5e',
      'mint': '#10b981',
      'lavender': '#a78bfa',
      'peach': '#ffb07a',
      'turquoise': '#40e0d0',
      'magenta': '#d946ef',
      'tan': '#d2b48c',
      'khaki': '#f0e68c',
      'charcoal': '#36454f',
      'midnight': '#191970',
      'forest': '#228b22',
      'royal': '#4169e1',
      'sky': '#87ceeb',
      'denim': '#1560bd',
      'camel': '#c19a6b',
      'wine': '#722f37',
      'emerald': '#50c878',
      'ruby': '#e0115f',
      'sapphire': '#0f52ba',
      'amber': '#ffbf00',
      'jade': '#00a86b',
      'ivory': '#fffff0',
      'pearl': '#f8f6f0',
      'platinum': '#e5e4e2',
      'titanium': '#878681',
      'gunmetal': '#2a3439',
      'ash': '#b2beb5',
      'slate': '#708090',
      'stone': '#8a9a5b',
      'sand': '#c2b280',
      'earth': '#8b4513',
      'rust': '#b7410e',
      'brass': '#b5a642',
      'steel': '#71797e',
      'iron': '#48494b',
      'chrome': '#e8e8e8',
      'nickel': '#727472',
      'zinc': '#7d8471',
      'lead': '#212121',
      'tin': '#c0c0c0',
      'aluminum': '#848482',
      'cobalt': '#0047ab',
      'manganese': '#8b4513',
      'vanadium': '#367588',
      'chromium': '#7b9c98',
      'mercury': '#c0c0c0',
      'thallium': '#ff6347',
      'bismuth': '#c0c0c0',
      'polonium': '#ffd700',
      'astatine': '#ff6347',
      'radon': '#87ceeb',
      'francium': '#ffd700',
      'radium': '#ff6347',
      'actinium': '#c0c0c0',
      'thorium': '#ffd700',
      'protactinium': '#ff6347',
      'uranium': '#c0c0c0',
      'neptunium': '#ffd700',
      'plutonium': '#ff6347',
      'americium': '#c0c0c0',
      'curium': '#ffd700',
      'berkelium': '#ff6347',
      'californium': '#c0c0c0',
      'einsteinium': '#ffd700',
      'fermium': '#ff6347',
      'mendelevium': '#c0c0c0',
      'nobelium': '#ffd700',
      'lawrencium': '#ff6347',
      'rutherfordium': '#c0c0c0',
      'dubnium': '#ffd700',
      'seaborgium': '#ff6347',
      'bohrium': '#c0c0c0',
      'hassium': '#ffd700',
      'meitnerium': '#ff6347',
      'darmstadtium': '#c0c0c0',
      'roentgenium': '#ffd700',
      'copernicium': '#ff6347',
      'nihonium': '#c0c0c0',
      'flerovium': '#ffd700',
      'moscovium': '#ff6347',
      'livermorium': '#c0c0c0',
      'tennessine': '#ffd700',
      'oganesson': '#ff6347'
    };

    // Try exact match first
    if (colorMap[color.toLowerCase()]) {
      return colorMap[color.toLowerCase()];
    }

    // Try partial matches
    for (const [key, value] of Object.entries(colorMap)) {
      if (color.toLowerCase().includes(key)) {
        return value;
      }
    }

    // Default fallback
    return '#000000';
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
      >
          <div className="flex">
            {/* Image */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-1 left-1 sm:top-2 sm:left-2 flex flex-col space-y-1">
                {product.discount > 0 && (
                  <span className="bg-seekon-electricRed text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium">
                    -{product.discount}%
                  </span>
                )}
                {product.isNew && (
                  <span className="bg-seekon-neonCyan text-seekon-midnight text-xs px-2 py-1 rounded-full font-medium">
                    NEW
                  </span>
                )}
              </div>

              {/* Quick Actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                <div className="flex space-x-2">
                  <button
                    onClick={handleQuickView}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-seekon-electricRed transition-colors duration-200"
                  >
                    <FiEye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleAddToWishlist}
                    className={`w-8 h-8 bg-white rounded-full flex items-center justify-center transition-colors duration-200 ${
                      isWishlisted 
                        ? 'text-red-500' 
                        : 'text-gray-700 hover:text-red-500'
                    }`}
                  >
                    <FiHeart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between">
              {/* Top Row - Brand and Name */}
              <div>
                <p className="text-xs text-seekon-electricRed font-semibold uppercase tracking-wide mb-1">
                  {product.brand}
                </p>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base mb-2 line-clamp-2">
                  {product.name}
                </h3>
              </div>

              {/* Bottom Row - Colors and Add to Cart */}
              <div className="flex items-center justify-between mt-2">
                {/* Colors Preview */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Colors:</span>
                  <div className="flex space-x-1">
                  {product.colors.slice(0, 3).map((color) => (
                    <button
                      key={color}
                      onClick={(e) => handleColorSelect(e, color)}
                      className={`rounded-full border-2 transition-all duration-200 cursor-pointer hover:scale-110 ${
                        selectedColor === color
                          ? 'w-5 h-5 border-gray-900 dark:border-white shadow-md' 
                          : 'w-3 h-3 border-gray-300 dark:border-gray-600'
                      }`}
                        style={{
                          backgroundColor: getColorValue(color)
                        }}
                      aria-label={`Select ${color} color`}
                      />
                    ))}
                    {product.colors.length > 3 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{product.colors.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="bg-[#00A676] hover:bg-[#008A5E] text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 shadow-md"
                >
                  Add to Cart
                </button>
              </div>

              {/* Price */}
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-[#00A676] text-sm sm:text-base">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      <Link to={`/product/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            style={{
              filter: selectedColor !== product.colors[0] ? `brightness(0.7) sepia(100%) hue-rotate(${getColorHue(selectedColor)}deg) saturate(200%)` : 'none'
            }}
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col space-y-1 sm:space-y-2">
            {product.discount > 0 && (
              <span className="bg-seekon-electricRed text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium shadow-lg">
                -{product.discount}%
              </span>
            )}
            {product.isNew && (
              <span className="bg-seekon-neonCyan text-seekon-midnight text-xs px-2 py-1 rounded-full font-medium shadow-lg">
                NEW
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex space-x-2 sm:space-x-3">
              <button
                onClick={handleQuickView}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-seekon-electricRed transition-colors duration-200 shadow-lg"
              >
                <FiEye className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={handleAddToWishlist}
                className={`w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg ${
                  isWishlisted 
                    ? 'text-red-500' 
                    : 'text-gray-700 hover:text-red-500'
                }`}
              >
                <FiHeart className={`w-4 h-4 sm:w-5 sm:h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Add to Cart Button Overlay */}
          <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button
              onClick={handleAddToCart}
              className="w-full bg-[#00A676] hover:bg-[#008A5E] text-white py-2 sm:py-2.5 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 shadow-lg"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Brand */}
          <p className="text-xs text-seekon-electricRed font-semibold uppercase tracking-wide mb-1">
            {product.brand}
          </p>
          
          {/* Name */}
          <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          {/* Price */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="font-bold text-[#00A676] text-lg">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Colors Preview */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Colors:</span>
            <div className="flex space-x-2">
              {product.colors.slice(0, 3).map((color) => (
                <button
                  key={color}
                  onClick={(e) => handleColorSelect(e, color)}
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-200 cursor-pointer hover:scale-125 ${
                    selectedColor === color
                      ? 'border-gray-600 dark:border-gray-300 scale-125' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  style={{
                    backgroundColor: getColorValue(color)
                  }}
                  aria-label={`Select ${color} color`}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{product.colors.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;