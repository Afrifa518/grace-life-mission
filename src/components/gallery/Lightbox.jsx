import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Lightbox = ({ selectedImage, onClose, onNavigate }) => {
  return (
    <AnimatePresence>
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <button
              onClick={() => onNavigate('prev')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={() => onNavigate('next')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-96 lg:h-auto">
                <img  
                  className="w-full h-full object-cover" 
                  alt={selectedImage.title}
                 src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
              </div>
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {selectedImage.category}
                  </span>
                  <span className="text-gray-500 text-sm">{selectedImage.date}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedImage.title}</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{selectedImage.description}</p>
                {selectedImage.type === 'story' && selectedImage.testimony && (
                  <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600">
                    <h3 className="font-semibold text-blue-900 mb-3">Testimony</h3>
                    <p className="text-blue-800 leading-relaxed italic">"{selectedImage.testimony}"</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Lightbox;