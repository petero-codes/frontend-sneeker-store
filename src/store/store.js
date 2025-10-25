import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';
import productSlice from './slices/productSlice';
import cartSlice from './slices/cartSlice';

console.log('🏪 Initializing Redux store...');
console.log('👤 User slice:', userSlice);
console.log('📦 Product slice:', productSlice);
console.log('🛒 Cart slice:', cartSlice);

export const store = configureStore({
  reducer: {
    user: userSlice,
    products: productSlice,
    cart: cartSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

console.log('✅ Redux store configured successfully');
console.log('🏪 Store state:', store.getState());

