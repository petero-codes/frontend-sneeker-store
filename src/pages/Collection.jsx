import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, setFilters, applyFilters } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';
import FilterBar from '../components/FilterBar';
import ViewToggle from '../components/ViewToggle';

const Collection = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { filteredProducts, isLoading, filters } = useSelector(state => state.products);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [stockFilter, setStockFilter] = useState('all'); // stock status filter

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    // Apply URL parameters to filters
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const filter = searchParams.get('filter');

    const newFilters = { ...filters };

    if (search) newFilters.search = search;
    if (category) newFilters.category = category;
    if (brand) newFilters.brand = brand;
    
    // Handle special filters
    if (filter === 'new') {
      // This would be handled in the product slice
    } else if (filter === 'sale') {
      newFilters.minPrice = '0';
      newFilters.maxPrice = '200';
    }

    dispatch(setFilters(newFilters));
    dispatch(applyFilters());
  }, [searchParams, dispatch]);

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
    <div className="min-h-screen bg-seekon-platinumSilver relative overflow-hidden">
      {/* Seekon Logo Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-50 dark:opacity-60 pointer-events-none z-0">
        <img 
          src="/seekon bg.png" 
          alt="Seekon Background Logo" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10">
      {/* Filter Bar */}
      <FilterBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-seekon-midnight mb-4">
            All Products
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <p className="text-seekon-charcoalGray mb-4 sm:mb-0">
              {isLoading ? 'Loading...' : `${filteredProducts.length} products found`}
            </p>
            
            {/* View Toggle with Stock Filter */}
            <ViewToggle 
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onStockFilterChange={setStockFilter}
            />
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className={`grid gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' 
              : 'grid-cols-1'
          }`}>
            {[...Array(12)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-seekon-charcoalGray rounded-xl h-64 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-seekon-charcoalGray rounded w-3/4"></div>
                  <div className="h-4 bg-seekon-charcoalGray rounded w-1/2"></div>
                  <div className="h-4 bg-seekon-charcoalGray rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-seekon-charcoalGray rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-seekon-softWhite" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-seekon-midnight mb-2">
              No products found
            </h3>
            <p className="text-seekon-charcoalGray mb-6">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={() => {
                dispatch(setFilters({
                  category: '',
                  brand: '',
                  minPrice: '',
                  maxPrice: '',
                  search: '',
                }));
                dispatch(applyFilters());
              }}
              className="bg-seekon-electricRed hover:bg-seekon-electricRed/90 text-seekon-pureWhite px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className={`grid gap-4 ${
              viewMode === 'grid' 
                ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' 
                : 'grid-cols-1'
            }`}
          >
            {filteredProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} viewMode={viewMode} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Load More Button */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-seekon-electricRed hover:bg-seekon-electricRed/90 text-seekon-pureWhite px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Load More Products
            </motion.button>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default Collection;

