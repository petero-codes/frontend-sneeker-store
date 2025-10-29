import React from 'react';
import { motion } from 'framer-motion';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Edit Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Profile editing coming soon...
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;




