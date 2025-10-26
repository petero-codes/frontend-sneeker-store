import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiHeart, FiShare2, FiMinus, FiPlus, FiShoppingCart, FiArrowLeft } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';
import { formatPrice, calculateDiscount, getRatingStars } from '../utils/formatPrice';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { products, isLoading } = useSelector(state => state.products);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product = products.find(p => p.id === parseInt(id));

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || '');
      setSelectedColor(product.colors[0] || '');
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Product not found
          </h2>
          <button
            onClick={() => navigate('/collection')}
            className="btn-primary"
          >
            Back to Collection
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error('Please select size and color');
      return;
    }

    dispatch(addToCart({
      product,
      size: selectedSize,
      color: selectedColor,
      quantity
    }));

    toast.success(`${product.name} added to cart!`);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const discountPercentage = calculateDiscount(product.originalPrice, product.price);
  const stars = getRatingStars(product.rating);
  const relatedProducts = products.filter(p => 
    p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 mb-4 sm:mb-6 md:mb-8"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="aspect-square bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors duration-200 ${
                    selectedImage === index
                      ? 'border-primary-600'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Brand & Name */}
            <div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium mb-1 sm:mb-2">
                {product.brand}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <div className="flex items-center">
                  {stars.map((star, index) => (
                    <FiStar
                      key={index}
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        star === 'full' 
                          ? 'text-yellow-400 fill-current' 
                          : star === 'half'
                          ? 'text-yellow-400 fill-current opacity-50'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 px-2 py-1 rounded-full text-xs sm:text-sm font-medium">
                    Save {discountPercentage}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Description
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">
                Size
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg border text-sm transition-colors duration-200 ${
                      selectedSize === size
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">
                Color
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-colors duration-200 ${
                      selectedColor === color
                        ? 'border-primary-600'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                    style={{
                      backgroundColor: color.toLowerCase().includes('black') ? '#000' :
                                     color.toLowerCase().includes('white') ? '#fff' :
                                     color.toLowerCase().includes('red') ? '#ef4444' :
                                     color.toLowerCase().includes('blue') ? '#3b82f6' :
                                     color.toLowerCase().includes('gray') ? '#6b7280' : '#000'
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">
                Quantity
              </h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#00A676] bg-[#FAFAFA] text-[#1F1F1F] flex items-center justify-center hover:bg-[#00A676] hover:text-[#FAFAFA] transition-all duration-200"
                >
                  <FiMinus className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <span className="w-12 sm:w-16 text-center font-medium text-[#1F1F1F] text-lg sm:text-xl">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#00A676] bg-[#FAFAFA] text-[#1F1F1F] flex items-center justify-center hover:bg-[#00A676] hover:text-[#FAFAFA] transition-all duration-200"
                >
                  <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-[#00A676] text-[#FAFAFA] hover:bg-[#008A5E] font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base shadow-lg"
                >
                  <FiShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-2.5 sm:p-3 rounded-lg border transition-colors duration-200 ${
                    isWishlisted
                      ? 'border-[#00A676] bg-[#00A676]/10 text-[#00A676]'
                      : 'border-[#00A676]/30 hover:border-[#00A676] text-[#1F1F1F] hover:bg-[#00A676]/5'
                  }`}
                >
                  <FiHeart className={`w-4 h-4 sm:w-5 sm:h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: product.name,
                        text: product.description,
                        url: window.location.href,
                      });
                    } else {
                      toast.success('Link copied to clipboard!');
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                  className="p-2.5 sm:p-3 rounded-lg border border-[#00A676]/30 text-[#1F1F1F] hover:border-[#00A676] hover:bg-[#00A676]/5 transition-colors duration-200"
                >
                  <FiShare2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              </div>

              {/* Stock Status */}
              <div className="text-sm">
                {product.inStock ? (
                  <span className="text-green-600 dark:text-green-400">
                    ✓ In stock and ready to ship
                  </span>
                ) : (
                  <span className="text-red-600 dark:text-red-400">
                    ✗ Currently out of stock
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">
              You might also like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

