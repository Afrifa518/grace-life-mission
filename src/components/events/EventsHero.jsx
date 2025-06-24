import React from 'react';
import { motion } from 'framer-motion';

const EventsHero = () => {
  return (
    <section className="relative py-32 bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
      <div className="absolute inset-0">
        <img  
          className="w-full h-full object-cover opacity-20" 
          alt="Church community gathering for special event"
         src="https://images.unsplash.com/photo-1563902244988-42d466e79b25" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Church Events
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Join us for meaningful gatherings, worship services, and community events that strengthen our faith and fellowship.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default EventsHero;