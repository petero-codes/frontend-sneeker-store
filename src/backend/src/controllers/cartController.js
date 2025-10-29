import Cart from '../models/Cart.js';

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }
    
    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, name, brand, price, image, size, color, quantity } = req.body;
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }
    
    // Check if item already exists
    const existingItem = cart.items.find(
      item => 
        item.productId.toString() === productId.toString() &&
        item.color === color &&
        (size === null || size === undefined ? (item.size === null || item.size === undefined) : item.size === size)
    );
    
    if (existingItem) {
      // Increase quantity
      existingItem.quantity += quantity || 1;
    } else {
      // Add new item
      cart.items.push({
        productId,
        name,
        brand,
        price,
        image,
        size: size || null,
        color,
        quantity: quantity || 1
      });
    }
    
    // Calculate and save
    cart.calculateTotals();
    await cart.save();
    
    res.status(200).json({
      success: true,
      message: existingItem ? 'Quantity updated' : 'Item added to cart',
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update cart item quantity
export const updateQuantity = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, size, color, quantity } = req.body;
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    const item = cart.items.find(
      item => 
        item.productId.toString() === productId.toString() &&
        item.color === color &&
        (size === null || size === undefined ? (item.size === null || item.size === undefined) : item.size === size)
    );
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }
    
    if (quantity <= 0) {
      // Remove item
      cart.items = cart.items.filter(
        i => !(i.productId.toString() === productId.toString() && i.color === color && (size === null || size === undefined ? (i.size === null || i.size === undefined) : i.size === size))
      );
    } else {
      item.quantity = quantity;
    }
    
    cart.calculateTotals();
    await cart.save();
    
    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, size, color } = req.body;
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    cart.items = cart.items.filter(
      item => !(
        item.productId.toString() === productId.toString() &&
        item.color === color &&
        (size === null || size === undefined ? (item.size === null || item.size === undefined) : item.size === size)
      )
    );
    
    cart.calculateTotals();
    await cart.save();
    
    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    cart.items = [];
    cart.calculateTotals();
    await cart.save();
    
    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};




