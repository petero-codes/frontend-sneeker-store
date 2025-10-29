import express from 'express';
import {
  adminLogin,
  getDashboardStats,
  getAllTransactions,
  getTransaction,
  exportTransactions
} from '../controllers/adminController.js';
import {
  getAllUsers,
  getUser,
  updateUserStatus,
  deleteUser
} from '../controllers/userController.js';
import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import {
  getAllOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder
} from '../controllers/orderController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', adminLogin);

// Protected routes - require authentication
router.get('/stats', authMiddleware, getDashboardStats);
router.get('/transactions', authMiddleware, getAllTransactions);
router.get('/transactions/:id', authMiddleware, getTransaction);
router.get('/transactions/export/csv', authMiddleware, exportTransactions);

// User management
router.get('/users', authMiddleware, getAllUsers);
router.get('/users/:id', authMiddleware, getUser);
router.post('/users', authMiddleware, async (req, res) => {
  try {
    const { name, email, phone, password, role = 'user' } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    const User = await import('../models/User.js');
    const bcrypt = await import('bcryptjs');
    
    // Check if user exists
    const existingUser = await User.default.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.default.hash(password, 10);

    // Create user
    const user = await User.default.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
router.patch('/users/:id/status', authMiddleware, updateUserStatus);
router.delete('/users/:id', authMiddleware, deleteUser);

// Product management
router.get('/products', authMiddleware, getAllProducts);
router.get('/products/:id', authMiddleware, getProduct);
router.post('/products', authMiddleware, createProduct);
router.put('/products/:id', authMiddleware, updateProduct);
router.delete('/products/:id', authMiddleware, deleteProduct);

// Order management
router.get('/orders', authMiddleware, getAllOrders);
router.get('/orders/:id', authMiddleware, getOrder);
router.patch('/orders/:id/status', authMiddleware, updateOrderStatus);
router.patch('/orders/:id/cancel', authMiddleware, cancelOrder);

// Cloudinary management
router.post('/cloudinary/delete', authMiddleware, async (req, res) => {
  try {
    const { publicId } = req.body;
    
    const cloudinary = require('cloudinary').v2;
    const result = await cloudinary.uploader.destroy(publicId);
    
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
