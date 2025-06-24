import React from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { categories } from '@/data/galleryData';

const CategoryFilter = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-wrap gap-3 justify-center"
    >
      <div className="flex items-center space-x-2 mr-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <span className="text-gray-700 font-medium">Filter by:</span>
      </div>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
            selectedCategory === category
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 shadow-md'
          }`}
        >
          {category}
        </button>
      ))}
    </motion.div>
  );
};

export default CategoryFilter;