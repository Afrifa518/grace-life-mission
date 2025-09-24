import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Heart, Star } from 'lucide-react';

const GalleryGrid = ({ items, onImageClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="group cursor-pointer"
          onClick={() => onImageClick(item)}
        >
          <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 card-hover">
            <div className="relative h-64">
              <img  
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                alt={item.title}
                src={item.imageUrl || 'https://images.unsplash.com/photo-1595872018818-97555653a011'} />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
              
              <div className="absolute top-4 left-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {item.category}
                </span>
              </div>

              <div className="absolute top-4 right-4">
                {item.type === 'story' ? (
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-200 transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-white/80">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default GalleryGrid;