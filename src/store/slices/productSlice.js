import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock API call for fetching products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters = {}, { rejectWithValue }) => {
    console.log('🔄 fetchProducts thunk called with filters:', filters);
    
    try {
      // Simulate API call
      console.log('⏳ Simulating API call...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('📦 Generating mock products...');
      // Mock product data
      const mockProducts = [
        {
          id: 1,
          name: 'Air Jordan 1 Retro High OG',
          brand: 'Nike',
          price: 22100,
          originalPrice: 26000,
          discount: 15,
          image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop',
          images: [
            'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop'
          ],
          category: 'sneakers',
          sizes: ['7', '8', '9', '10', '11', '12'],
          colors: ['Black', 'White', 'Red', 'Navy', 'Gray'],
          description: 'The Air Jordan 1 Retro High OG brings back the classic silhouette with premium materials and authentic details.',
          rating: 4.8,
          reviews: 1247,
          inStock: true,
          isNew: true,
          isTrending: true,
          tags: ['basketball', 'retro', 'og']
        },
        {
          id: 2,
          name: 'Ultraboost 22',
          brand: 'Adidas',
          price: 23400,
          originalPrice: 23400,
          discount: 0,
          image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop',
          images: [
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop'
          ],
          category: 'sneakers',
          sizes: ['7', '8', '9', '10', '11', '12'],
          colors: ['White', 'Black', 'Blue', 'Gray', 'Green'],
          description: 'The Ultraboost 22 delivers responsive energy return with every step, featuring our most advanced Boost technology.',
          rating: 4.6,
          reviews: 892,
          inStock: true,
          isNew: false,
          isTrending: true,
          tags: ['running', 'boost', 'energy']
        },
        {
          id: 3,
          name: 'Chuck Taylor All Star',
          brand: 'Converse',
          price: 8450,
          originalPrice: 9100,
          discount: 7,
          image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop',
          images: [
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop'
          ],
          category: 'sneakers',
          sizes: ['6', '7', '8', '9', '10', '11'],
          colors: ['White', 'Black', 'Red', 'Navy', 'Brown'],
          description: 'The classic Chuck Taylor All Star canvas sneaker that never goes out of style.',
          rating: 4.4,
          reviews: 2156,
          inStock: true,
          isNew: false,
          isTrending: false,
          tags: ['canvas', 'classic', 'casual']
        },
        {
          id: 4,
          name: 'RS-X Reinvention',
          brand: 'Puma',
          price: 15600,
          originalPrice: 18200,
          discount: 14,
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
          images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop'
          ],
          category: 'sneakers',
          sizes: ['7', '8', '9', '10', '11', '12'],
          colors: ['White', 'Black', 'Red', 'Gray', 'Navy'],
          description: 'The RS-X Reinvention combines retro styling with modern comfort and performance.',
          rating: 4.3,
          reviews: 543,
          inStock: true,
          isNew: true,
          isTrending: false,
          tags: ['retro', 'comfort', 'style']
        },
        {
          id: 5,
          name: 'Nike Dri-FIT T-Shirt',
          brand: 'Nike',
          price: 4550,
          originalPrice: 5200,
          discount: 12,
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
          images: [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500&h=500&fit=crop'
          ],
          category: 'apparel',
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          colors: ['Black', 'White', 'Navy', 'Red', 'Gray'],
          description: 'Lightweight, breathable Dri-FIT technology keeps you cool and dry during workouts.',
          rating: 4.5,
          reviews: 678,
          inStock: true,
          isNew: false,
          isTrending: true,
          tags: ['athletic', 'moisture-wicking', 'comfort']
        },
        {
          id: 6,
          name: 'Adidas Originals Hoodie',
          brand: 'Adidas',
          price: 11050,
          originalPrice: 13000,
          discount: 15,
          image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop',
          images: [
            'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop'
          ],
          category: 'apparel',
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Black', 'White', 'Gray', 'Navy', 'Charcoal'],
          description: 'Classic three-stripe design with premium cotton blend for ultimate comfort.',
          rating: 4.7,
          reviews: 432,
          inStock: true,
          isNew: true,
          isTrending: false,
          tags: ['casual', 'comfort', 'classic']
        },
        {
          id: 7,
          name: 'Nike Air Max 270',
          brand: 'Nike',
          price: 19500,
          originalPrice: 19500,
          discount: 0,
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop',
          images: [
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop'
          ],
          category: 'sneakers',
          sizes: ['7', '8', '9', '10', '11', '12'],
          colors: ['White', 'Black', 'Blue', 'Gray', 'Red'],
          description: 'The Air Max 270 delivers all-day comfort with the largest Air Max unit ever.',
          rating: 4.6,
          reviews: 1567,
          inStock: false,
          isNew: false,
          isTrending: true,
          tags: ['air-max', 'comfort', 'lifestyle']
        },
        {
          id: 8,
          name: 'Nike Backpack',
          brand: 'Nike',
          price: 5850,
          originalPrice: 7150,
          discount: 18,
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
          images: [
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop'
          ],
          category: 'accessories',
          sizes: ['One Size'],
          colors: ['Black', 'Navy', 'Gray', 'Charcoal', 'Brown'],
          description: 'Durable backpack with multiple compartments for all your essentials.',
          rating: 4.4,
          reviews: 234,
          inStock: true,
          isNew: false,
          isTrending: false,
          tags: ['durable', 'storage', 'travel']
        }
      ];

      // Apply filters
      let filteredProducts = mockProducts;
      
      if (filters.category) {
        filteredProducts = filteredProducts.filter(p => p.category === filters.category);
      }
      
      if (filters.brand) {
        filteredProducts = filteredProducts.filter(p => p.brand.toLowerCase() === filters.brand.toLowerCase());
      }
      
      if (filters.minPrice || filters.maxPrice) {
        filteredProducts = filteredProducts.filter(p => {
          if (filters.minPrice && p.price < filters.minPrice) return false;
          if (filters.maxPrice && p.price > filters.maxPrice) return false;
          return true;
        });
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchTerm) ||
          p.brand.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm)
        );
      }

      console.log('✅ Products fetched successfully:', filteredProducts.length);
      return filteredProducts;
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  products: [],
  filteredProducts: [],
  isLoading: false,
  error: null,
  filters: {
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    search: '',
  },
  sortBy: 'featured', // 'featured', 'price-low', 'price-high', 'newest', 'rating'
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        brand: '',
        minPrice: '',
        maxPrice: '',
        search: '',
      };
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    applyFilters: (state) => {
      let filtered = [...state.products];
      
      // Apply filters
      if (state.filters.category) {
        filtered = filtered.filter(p => p.category === state.filters.category);
      }
      
      if (state.filters.brand) {
        filtered = filtered.filter(p => p.brand.toLowerCase() === state.filters.brand.toLowerCase());
      }
      
      if (state.filters.minPrice) {
        filtered = filtered.filter(p => p.price >= state.filters.minPrice);
      }
      
      if (state.filters.maxPrice) {
        filtered = filtered.filter(p => p.price <= state.filters.maxPrice);
      }
      
      if (state.filters.search) {
        const searchTerm = state.filters.search.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(searchTerm) ||
          p.brand.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm)
        );
      }
      
      // Apply sorting
      switch (state.sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          filtered.sort((a, b) => b.isNew - a.isNew);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        default: // 'featured'
          filtered.sort((a, b) => b.isTrending - a.isTrending);
      }
      
      state.filteredProducts = filtered;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        console.log('⏳ fetchProducts pending...');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        console.log('✅ fetchProducts fulfilled with:', action.payload?.length, 'products');
        state.isLoading = false;
        state.products = action.payload;
        state.filteredProducts = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        console.error('❌ fetchProducts rejected:', action.payload);
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, setSortBy, applyFilters } = productSlice.actions;
export default productSlice.reducer;

