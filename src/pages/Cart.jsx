import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { updateQuantity, removeFromCart, clearCart } from '../store/slices/cartSlice';
import { formatPrice } from '../utils/formatPrice';
import toast from 'react-hot-toast';

const Cart = () => {
  const dispatch = useDispatch();
  const { items, totalItems, totalPrice } = useSelector(state => state.cart);

  const handleQuantityChange = (item, newQuantity) => {
    dispatch(updateQuantity({
      id: item.id,
      size: item.size,
      color: item.color,
      quantity: newQuantity
    }));
  };

  const handleRemoveItem = (item) => {
    dispatch(removeFromCart({
      id: item.id,
      size: item.size,
      color: item.color
    }));
  };

  const handleClearCart = () => {
    if (items.length === 0) {
      toast.error('Your cart is already empty!');
      return;
    }
    
    if (window.confirm(`Are you sure you want to clear all ${items.length} item(s) from your cart?`)) {
      dispatch(clearCart());
      toast.success('Cart cleared successfully!');
    }
  };

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

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <FiShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            to="/collection"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span>Start Shopping</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="space-y-4"
            >
              {items.map((item) => (
                <motion.div
                  key={`${item.id}-${item.size}-${item.color}`}
                  variants={itemVariants}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0 w-full sm:w-auto">
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {item.brand} • Size {item.size} • {item.color}
                      </p>
                      <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Quantity Controls & Actions */}
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 sm:gap-4">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <button
                          onClick={() => handleQuantityChange(item, item.quantity - 1)}
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center transition-colors duration-200"
                        >
                          <FiMinus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <span className="w-8 sm:w-10 text-center text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item, item.quantity + 1)}
                          disabled={item.quantity >= item.maxQuantity}
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200"
                        >
                          <FiPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                      >
                        <FiTrash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>

                    {/* Item Total - Mobile */}
                    <div className="sm:hidden w-full pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Item Total:</span>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Clear Cart Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 sm:mt-6 flex items-center justify-center sm:justify-start"
            >
              <button
                onClick={handleClearCart}
                className="px-4 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg w-full sm:w-auto"
              >
                Clear Cart
              </button>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 sticky top-24"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Order Summary
              </h2>

              {/* Order Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-600 dark:text-green-400">Free</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax</span>
                  <span>{formatPrice(totalPrice * 0.08)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-gray-100">
                    <span>Total</span>
                    <span>{formatPrice(totalPrice * 1.08)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="w-full btn-primary flex items-center justify-center space-x-2 mb-4"
              >
                <span>Proceed to Checkout</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>

              {/* Continue Shopping */}
              <Link
                to="/collection"
                className="w-full btn-secondary text-center block"
              >
                Continue Shopping
              </Link>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-800 dark:text-green-200">
                    Secure checkout with SSL encryption
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

