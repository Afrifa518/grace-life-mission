import React from 'react';
import { motion } from 'framer-motion';
import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

const EventsHero = () => {
  const { images } = useSiteConfigContext();
  return (
    <section className="relative py-32 bg-primary text-white overflow-hidden">
      <div className="absolute inset-0">
        <img  
          className="w-full h-full object-cover opacity-20" 
          alt="Church community gathering for special event"
         src={images?.eventsHeroUrl || '/sunday.jpeg'} />
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