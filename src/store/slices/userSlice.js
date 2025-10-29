import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Real login with backend API
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Login failed');
      }

      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('adminToken', data.token); // For admin compatibility
        
        return {
          id: data.user.id,
          _id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role || 'user',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
        };
      } else {
        return rejectWithValue(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return rejectWithValue(error.message || 'Network error. Please try again.');
    }
  }
);

// Validate token and get current user
export const validateToken = createAsyncThunk(
  'user/validateToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // Token is invalid, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('adminToken');
        return rejectWithValue(data.message || 'Invalid token');
      }

      if (data.success) {
        return {
          id: data.user.id || data.user._id,
          _id: data.user.id || data.user._id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role || 'user',
          avatar: data.user.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
        };
      } else {
        return rejectWithValue(data.message || 'Token validation failed');
      }
    } catch (error) {
      console.error('Token validation error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Real register with backend API
export const registerUser = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Registration failed');
      }

      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('adminToken', data.token);
        
        return {
          id: data.user.id,
          _id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role || 'user',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
        };
      } else {
        return rejectWithValue(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      return rejectWithValue(error.message || 'Network error. Please try again.');
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  theme: 'light', // 'light' or 'dark'
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      // Clear tokens from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
    },
    clearError: (state) => {
      state.error = null;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    updateAvatar: (state, action) => {
      if (state.user) {
        state.user.avatar = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Validate Token
      .addCase(validateToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(validateToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(validateToken.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        // Don't show error for missing token (user just not logged in)
        if (action.payload !== 'No token found') {
          state.error = action.payload;
        }
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, toggleTheme, setTheme } = userSlice.actions;
// validateToken is already exported above as export const validateToken
export default userSlice.reducer;

