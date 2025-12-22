import React from 'react';
import { motion } from 'framer-motion';

const EventsFilter = ({ categories, selectedCategory, setSelectedCategory }) => {
  return (
    <section className="py-12 section-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          {categories.map((category) => (
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
      </div>
    </section>
  );
};

export default EventsFilter;