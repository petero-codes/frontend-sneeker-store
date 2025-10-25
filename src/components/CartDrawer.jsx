import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMinus, FiPlus, FiShoppingBag, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { closeCart, updateQuantity, removeFromCart, clearCart } from '../store/slices/cartSlice';
import { formatPrice } from '../utils/formatPrice';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const { items, totalItems, totalPrice, isOpen } = useSelector(state => state.cart);

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
    dispatch(clearCart());
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => dispatch(closeCart())}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Shopping Cart ({totalItems})
              </h2>
              <button
                onClick={() => dispatch(closeCart())}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
              >
                <FiX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <FiShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Looks like you haven't added any items to your cart yet.
                  </p>
                  <Link
                    to="/collection"
                    onClick={() => dispatch(closeCart())}
                    className="btn-primary"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.size}-${item.color}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item.brand} • {item.size} • {item.color}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center transition-colors duration-200"
                        >
                          <FiMinus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <span className="w-8 text-center font-medium text-gray-900 dark:text-gray-100">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item, item.quantity + 1)}
                          disabled={item.quantity >= item.maxQuantity}
                          className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200"
                        >
                          <FiPlus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                      >
                        <FiTrash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-4">
                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Total:
                  </span>
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link
                    to="/checkout"
                    onClick={() => dispatch(closeCart())}
                    className="w-full btn-primary text-center block"
                  >
                    Proceed to Checkout
                  </Link>
                  
                  <button
                    onClick={handleClearCart}
                    className="w-full btn-secondary"
                  >
                    Clear Cart
                  </button>
                  
                  <Link
                    to="/collection"
                    onClick={() => dispatch(closeCart())}
                    className="w-full text-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors duration-200"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;

