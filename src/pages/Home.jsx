import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import FilterBar from '../components/FilterBar';
import PromotionalBanner from '../components/PromotionalBanner';
import { SectionFallback, ProductCardSkeleton, EmptyState } from '../components/Fallbacks';

const Home = () => {
  console.log('🏠 Home component rendering...');
  
  const dispatch = useDispatch();
  const { products, isLoading, error } = useSelector(state => state.products);

  console.log('📦 Products state:', { products: products?.length, isLoading, error });

  useEffect(() => {
    console.log('🔄 Dispatching fetchProducts...');
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleRetry = () => {
    console.log('🔄 Retrying product fetch...');
    dispatch(fetchProducts());
  };

  // Simple test render first
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Loading Seekon Apparel...</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Please wait while we load the latest products</p>
        </div>
      </div>
    );
  }

  // Get different product categories for sections
  const trendingProducts = products.filter(product => product.isTrending).slice(0, 8);
  const newProducts = products.filter(product => product.isNew).slice(0, 6);
  const saleProducts = products.filter(product => product.discount > 0).slice(0, 6);
  const sneakers = products.filter(product => product.category === 'sneakers').slice(0, 4);
  const apparel = products.filter(product => product.category === 'apparel').slice(0, 4);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-seekon-platinumSilver">
      {/* Promotional Banner */}
      <PromotionalBanner 
        message="Seekon Apparel — Live bold. Dress sharper. Walk your story. • NEW ARRIVALS: LIMITED TIME OFFER - UPTO 30% OFF ON SELECTED ITEMS!"
        backgroundColor="bg-gradient-primary"
        textColor="text-seekon-pureWhite"
        showIcons={true}
        animated={true}
        scrollSpeed="fast"
      />
      
      {/* Hero Banner */}
      <HeroBanner />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-seekon-platinumSilver">
        {/* Trending Now Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4"
            >
              Trending Now
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            >
              Discover the most popular sneakers and apparel that everyone's talking about
            </motion.p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-300 dark:bg-gray-700 rounded-xl h-64 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {trendingProducts.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.section>

        {/* Categories Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4"
            >
              Shop by Category
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-600 dark:text-gray-400"
            >
              Find exactly what you're looking for
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sneakers */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Sneakers
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {sneakers.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </motion.div>

            {/* Apparel */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Apparel
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {apparel.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* New Arrivals Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4"
            >
              New Arrivals
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-600 dark:text-gray-400"
            >
              Be the first to get your hands on the latest drops
            </motion.p>
          </div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {newProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Sale Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4"
            >
              Limited Time Offers
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-600 dark:text-gray-400"
            >
              Don't miss out on these amazing deals
            </motion.p>
          </div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {saleProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Newsletter Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 md:p-12 text-center text-white"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay in the Loop
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Get exclusive access to new drops, special offers, and style tips delivered straight to your inbox.
            </p>
            <div className="max-w-md mx-auto flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
};

export default Home;

