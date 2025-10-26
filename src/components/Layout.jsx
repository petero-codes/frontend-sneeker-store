import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Logo3D from "./Logo3D";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Full-page background 3D Logo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 dark:opacity-30 pointer-events-none z-0">
        <div className="w-full h-full max-w-4xl max-h-96">
          <Logo3D width="100%" height="100%" />
        </div>
      </div>

      {/* Content Wrapper to ensure it's above the background */}
      <div className="relative z-10 flex flex-col flex-grow">
      {/* 🔹 Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
        <Link to="/" className="flex items-center space-x-3 group">
          <img 
            src="/seekon bg.png" 
            alt="Seekon Apparel Logo" 
            className="h-10 w-auto opacity-100 group-hover:opacity-100 transition-opacity duration-200"
          />
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl text-gray-800 dark:text-gray-100 group-hover:text-seekon-electricRed transition-colors duration-200">
              Seekon
            </span>
            <span className="font-bold text-xl text-gray-800 dark:text-gray-100 group-hover:text-seekon-electricRed transition-colors duration-200">
              Apparel
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-6 text-gray-600 dark:text-gray-300 font-medium">
          <Link to="/about" className="hover:text-seekon-electricRed transition-colors duration-200">
            About
          </Link>
          <Link to="/careers" className="hover:text-seekon-electricRed transition-colors duration-200">
            Careers
          </Link>
          <Link to="/press" className="hover:text-seekon-electricRed transition-colors duration-200">
            Press
          </Link>
          <Link to="/sustainability" className="hover:text-seekon-electricRed transition-colors duration-200">
            Sustainability
          </Link>
          <Link to="/investors" className="hover:text-seekon-electricRed transition-colors duration-200">
            Investors
          </Link>
        </nav>
      </header>

      {/* 🔹 Page Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* 🔹 Footer */}
      <footer className="py-8 bg-gray-100 dark:bg-gray-800 text-center border-t border-gray-200 dark:border-gray-700">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col items-center space-y-4"
        >
          <img 
            src="/seekon bg.png" 
            alt="Seekon Logo" 
            className="h-8 w-auto opacity-80"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 Seekon Apparel. All rights reserved.
          </p>
        </motion.div>
      </footer>
      </div>
    </div>
  );
};

export default Layout;
