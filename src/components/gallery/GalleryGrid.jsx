import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Heart, Star, Play } from 'lucide-react';

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

const GalleryGrid = ({ items, onImageClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item, index) => {
        const isVideo = item.type === 'video' && item.youtubeUrl;
        const ytId = isVideo ? getYouTubeId(item.youtubeUrl) : '';
        const thumb = isVideo && ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : (item.imageUrl || '/sunday.jpeg');
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group cursor-pointer"
            onClick={() => onImageClick(item)}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-sm border border-border hover:shadow-md transition-all duration-300 card-hover">
              <div className="relative h-64">
                <img  
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  alt={item.title}
                  src={thumb} />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>

                <div className="absolute top-4 right-4">
                  {isVideo ? (
                    <div className="w-8 h-8 bg-amber-700 rounded-full flex items-center justify-center">
                      <Play className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-amber-200 transition-colors">
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
        );
      })}
    </div>
  );
};

export default GalleryGrid;