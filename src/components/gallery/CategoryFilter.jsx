import React from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { categories as staticCategories } from '@/data/galleryData';

const CategoryFilter = ({ categories, selectedCategory, setSelectedCategory }) => {
  const list = Array.isArray(categories) && categories.length > 0 ? categories : staticCategories;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-wrap gap-3 justify-center"
    >
      <div className="flex items-center space-x-2 mr-4">
        <Filter className="w-5 h-5 text-muted-foreground" />
        <span className="text-foreground/80 font-medium">Filter by:</span>
      </div>
      {list.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`px-6 py-3 rounded-full font-medium transition-all duration-300 border ${
            selectedCategory === category
              ? 'bg-primary text-primary-foreground border-primary/30 shadow-sm shadow-black/10'
              : 'bg-background/80 text-foreground/70 border-border hover:bg-accent/60 hover:text-foreground shadow-sm'
          }`}
        >
          {category}
        </button>
      ))}
    </motion.div>
  );
};

export default CategoryFilter;