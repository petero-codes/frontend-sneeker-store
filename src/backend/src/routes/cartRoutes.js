import express from 'express';
import {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart
} from '../controllers/cartController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All cart routes require authentication
router.use(authMiddleware);

// Get user's cart
router.get('/:userId', getCart);

// Add item to cart
router.post('/:userId/add', addToCart);

// Update item quantity
router.patch('/:userId/update', updateQuantity);

// Remove item from cart
router.delete('/:userId/remove', removeFromCart);

// Clear cart
router.delete('/:userId/clear', clearCart);

export default router;




