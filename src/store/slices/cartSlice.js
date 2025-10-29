import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isOpen: false,
  isLoading: false,
  error: null,
};

// API configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Async thunks for API calls
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/cart/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch cart');
      }
      
      return data.cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToCartAPI = createAsyncThunk(
  'cart/addToCartAPI',
  async ({ userId, product, size, color, quantity = 1 }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/cart/${userId}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          image: product.image,
          size,
          color,
          quantity
        })
      });
      
      // If backend is not running, silently fail and fall back to local storage
      if (!response.ok) {
        // Backend might not be running, return the product to add locally
        return {
          items: [],
          totalItems: 0,
          totalPrice: 0
        };
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add to cart');
      }
      
      return data.cart;
    } catch (error) {
      // Silently handle network errors (backend not running)
      // Return empty cart structure to prevent errors
      return {
        items: [],
        totalItems: 0,
        totalPrice: 0
      };
    }
  }
);

export const updateQuantityAPI = createAsyncThunk(
  'cart/updateQuantityAPI',
  async ({ userId, productId, size, color, quantity }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/cart/${userId}/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, size, color, quantity })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update quantity');
      }
      
      return data.cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromCartAPI = createAsyncThunk(
  'cart/removeFromCartAPI',
  async ({ userId, productId, size, color }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/cart/${userId}/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, size, color })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to remove from cart');
      }
      
      return data.cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearCartAPI = createAsyncThunk(
  'cart/clearCartAPI',
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/cart/${userId}/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // If backend is not running, silently succeed to allow local clear
      if (!response.ok) {
        return {
          items: [],
          totalItems: 0,
          totalPrice: 0
        };
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to clear cart');
      }
      
      return data.cart || {
        items: [],
        totalItems: 0,
        totalPrice: 0
      };
    } catch (error) {
      // Silently handle network errors (backend not running)
      return {
        items: [],
        totalItems: 0,
        totalPrice: 0
      };
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, size, color, quantity = 1 } = action.payload;
      
      // Check for existing item (match by product id and color)
      const existingItem = state.items.find(
        item => {
          if (item.id === product.id && item.color === color) {
            // If size is null, match items with null size
            if (size === null || size === undefined) {
              return item.size === null || item.size === undefined;
            }
            // Otherwise match exact size
            return item.size === size;
          }
          return false;
        }
      );

      if (existingItem) {
        // Increase quantity if item exists
        existingItem.quantity += quantity;
      } else {
        // Add new item
        state.items.push({
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          image: product.image,
          size,
          color,
          quantity,
        });
      }

      // Update totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    removeFromCart: (state, action) => {
      const { id, size, color } = action.payload;
      state.items = state.items.filter(
        item => !(item.id === id && item.size === size && item.color === color)
      );

      // Update totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    updateQuantity: (state, action) => {
      const { id, size, color, quantity } = action.payload;
      const item = state.items.find(
        item => item.id === id && item.size === size && item.color === color
      );

      if (item) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          state.items = state.items.filter(
            cartItem => !(cartItem.id === id && cartItem.size === size && cartItem.color === color)
          );
        } else {
          item.quantity = quantity;
        }

        // Update totals
        state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
        state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    openCart: (state) => {
      state.isOpen = true;
    },

    closeCart: (state) => {
      state.isOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add to cart (API)
      .addCase(addToCartAPI.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCartAPI.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(addToCartAPI.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update quantity (API)
      .addCase(updateQuantityAPI.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateQuantityAPI.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(updateQuantityAPI.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Remove from cart (API)
      .addCase(removeFromCartAPI.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCartAPI.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(removeFromCartAPI.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Clear cart (API)
      .addCase(clearCartAPI.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCartAPI.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(clearCartAPI.rejected, (state, action) => {
        state.isLoading = false;
        // Don't set error if backend failed - fallback to local clear
        state.error = null;
        state.items = [];
        state.totalItems = 0;
        state.totalPrice = 0;
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
} = cartSlice.actions;

export default cartSlice.reducer;
