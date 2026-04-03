import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import GalleryGrid from '@/components/gallery/GalleryGrid';
import Lightbox from '@/components/gallery/Lightbox';
import { supabase } from '@/lib/supabase';
import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

const Gallery = () => {
  const { images } = useSiteConfigContext();
  const [selectedImage, setSelectedImage] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGallery = async () => {
      if (!supabase) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('gallery')
          .select('id,title,date,description,type,status,imageUrl,youtubeUrl,created_at')
          .eq('status', 'published')
          .order('date', { ascending: false });
        if (error) throw error;
        setItems(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const openLightbox = (item) => setSelectedImage(item);
  const closeLightbox = () => setSelectedImage(null);

  const navigateImage = (direction) => {
    const currentIndex = items.findIndex(item => item.id === selectedImage.id);
    let newIndex;
    if (direction === 'next') {
      newIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    }
    setSelectedImage(items[newIndex]);
  };

  return (
    <>
      <Helmet>
        <title>Gallery - GraceLife Mission International</title>
        <meta name="description" content="Explore photos and stories from GraceLife Mission International. See our worship services, community events, outreach programs, and inspiring testimonies." />
      </Helmet>

      <section className="relative py-32 bg-primary text-white overflow-hidden">
        <div className="absolute inset-0">
          <img  
            className="w-full h-full object-cover opacity-20" 
            alt="Church community celebrating together"
           src={images?.galleryHeroUrl || '/sunday.jpeg'} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">Our Story in Pictures</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Witness the amazing work God is doing through our church family. See moments of worship, fellowship, service, and transformation.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Moments of <span className="text-gold">Grace</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every picture tells a story of God's faithfulness and the love shared within our church community.
            </p>
          </motion.div>

          {loading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-muted-foreground">Loading gallery...</p>
            </motion.div>
          ) : (
            <>
              <GalleryGrid items={items} onImageClick={openLightbox} />
              {items.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-muted-foreground text-lg">No items found.</p>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
      
      <Lightbox selectedImage={selectedImage} onClose={closeLightbox} onNavigate={navigateImage} />

      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold">Be Part of Our Story</h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Every photo represents real lives touched by God's love. Come and add your story to our growing family album.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-background text-foreground hover:bg-background/95 px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300">
                Visit This Sunday
              </Button>
              <Button 
                variant="outline" 
                className="border-white/40 text-white hover:bg-white/10 hover:text-white px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm bg-white/10 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Share Your Story
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Gallery;