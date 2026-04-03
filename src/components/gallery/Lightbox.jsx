import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const getYouTubeId = (url) => {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.replace('/', '');
    if (u.hostname.includes('youtube.com')) {
      if (u.pathname.startsWith('/embed/')) return u.pathname.split('/').pop();
      const id = u.searchParams.get('v');
      if (id) return id;
    }
  } catch {}
  return '';
};

const Lightbox = ({ selectedImage, onClose, onNavigate }) => {
  const isVideo = selectedImage?.type === 'video' && selectedImage?.youtubeUrl;
  const ytId = isVideo ? getYouTubeId(selectedImage.youtubeUrl) : '';
  const embed = isVideo && ytId ? `https://www.youtube.com/embed/${ytId}` : '';

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        onNavigate('prev');
        break;
      case 'ArrowRight':
        onNavigate('next');
        break;
      default:
        break;
    }
  }, [onClose, onNavigate]);

  useEffect(() => {
    if (!selectedImage) return;
    document.addEventListener('keydown', handleKeyDown);
    // Lock scroll while lightbox is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedImage, handleKeyDown]);

  return (
    <AnimatePresence>
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Gallery viewer: ${selectedImage.title}`}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative max-w-4xl w-full bg-background rounded-2xl overflow-hidden border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              aria-label="Close gallery viewer"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={() => onNavigate('prev')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() => onNavigate('next')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-96 lg:h-auto">
                {isVideo && embed ? (
                  <iframe
                    className="w-full h-full"
                    src={embed}
                    title={selectedImage.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <img
                    className="w-full h-full object-cover"
                    alt={selectedImage.title}
                    src={selectedImage.imageUrl || '/sunday.jpeg'}
                  />
                )}
              </div>
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-muted-foreground text-sm">{selectedImage.date}</span>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">{selectedImage.title}</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">{selectedImage.description}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Lightbox;
