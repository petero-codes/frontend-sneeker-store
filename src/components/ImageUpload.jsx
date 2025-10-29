import React, { useState } from 'react';
import { FiUpload, FiX, FiImage, FiLoader } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const ImageUpload = ({ 
  onImageUpload, 
  onImageRemove, 
  initialImage = null,
  label = 'Product Image'
}) => {
  const [preview, setPreview] = useState(initialImage);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, WebP, or GIF)');
      return false;
    }

    const maxSize = 5; // MB
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      setError(`File size must be less than ${maxSize}MB`);
      return false;
    }

    setError('');
    return true;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!validateFile(file)) {
      return;
    }

    setIsUploading(true);

    try {
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // For now, just store the base64 data
      const imageData = {
        url: reader.result,
        publicId: `temp-${Date.now()}`
      };

      if (onImageUpload) {
        onImageUpload(imageData);
      }

      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Please try again.');
      setError('Upload failed');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (onImageRemove) {
      onImageRemove();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!validateFile(file)) {
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      await new Promise(resolve => setTimeout(resolve, 500));

      const imageData = {
        url: reader.result,
        publicId: `temp-${Date.now()}`
      };

      if (onImageUpload) {
        onImageUpload(imageData);
      }

      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Please try again.');
      setError('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label} <span className="text-red-500">*</span>
        </label>
      )}

      {/* Upload Area */}
      <div
        className="relative border-2 border-dashed border-white/20 rounded-xl p-4 sm:p-6 hover:border-[#00A676] transition-colors cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
          id="image-upload-input"
          disabled={isUploading}
        />

        {!preview && !isUploading && (
          <label
            htmlFor="image-upload-input"
            className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 cursor-pointer"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#00A676]/20 flex items-center justify-center">
              <FiImage className="w-6 h-6 sm:w-8 sm:h-8 text-[#00A676]" />
            </div>
            <div className="text-center">
              <p className="text-white font-medium text-sm sm:text-base mb-1">Click to upload</p>
              <p className="text-gray-400 text-xs sm:text-sm">or drag and drop</p>
              <p className="text-gray-500 text-xs mt-2">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </label>
        )}

        {isUploading && (
          <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 py-6 sm:py-8">
            <FiLoader className="w-10 h-10 sm:w-12 sm:h-12 text-[#00A676] animate-spin" />
            <p className="text-white font-medium text-sm sm:text-base">Uploading image...</p>
            <p className="text-gray-400 text-xs sm:text-sm">Please wait</p>
          </div>
        )}

        <AnimatePresence>
          {preview && !isUploading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative"
            >
              <img
                src={preview}
                alt="Preview"
                className="w-full h-40 sm:h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
              >
                <FiX className="w-4 h-4 text-white" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-400 text-xs sm:text-sm">{error}</p>
      )}

      {/* Info Text */}
      <p className="text-gray-500 text-xs">
        Supported formats: JPEG, PNG, WebP, GIF • Max size: 5MB
      </p>
    </div>
  );
};

export default ImageUpload;
