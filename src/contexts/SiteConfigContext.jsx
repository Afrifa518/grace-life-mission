import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadToStorage } from '@/lib/utils';

const DEFAULT_IMAGES = {
  homeHeroUrl: '/sunday.jpeg',
  homeWelcomeUrl: '/sunday.jpeg',
  aboutHeroUrl: 'https://images.unsplash.com/photo-1487956382158-bb926046304a',
  sermonsHeroUrl: 'https://images.unsplash.com/photo-1551677629-c3e314ecf29c',
  eventsHeroUrl: 'https://images.unsplash.com/photo-1563902244988-42d466e79b25',
  ministriesHeroUrl: 'https://images.unsplash.com/photo-1647456614166-40dedca18fca',
  donationsHeroUrl: 'https://images.unsplash.com/photo-1662045468936-47364448771e',
  contactHeroUrl: 'https://images.unsplash.com/photo-1573179329155-e1d8b290cf79',
  galleryHeroUrl: 'https://images.unsplash.com/photo-1681056836865-6bcffdb50da6',
  footerBackgroundUrl: '/sunday.jpeg',
};

const KNOWN_KEYS = Object.keys(DEFAULT_IMAGES);

const SiteConfigContext = createContext({
  images: DEFAULT_IMAGES,
  loading: false,
  refresh: async () => {},
  setImageUrl: async (_key, _url) => {},
  uploadAndSet: async (_key, _file) => {},
});

export const SiteConfigProvider = ({ children }) => {
  const [images, setImages] = useState(DEFAULT_IMAGES);
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    if (!supabase) {
      setImages(DEFAULT_IMAGES);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('key, value')
        .in('key', KNOWN_KEYS);

      if (error) throw error;

      const next = { ...DEFAULT_IMAGES };
      (data || []).forEach((row) => {
        const k = row?.key;
        const v = row?.value;
        if (k && typeof v === 'string' && KNOWN_KEYS.includes(k)) {
          next[k] = v;
        }
      });
      setImages(next);
    } catch (_err) {
      // fallback to defaults on error
      setImages(DEFAULT_IMAGES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const setImageUrl = async (key, url) => {
    if (!KNOWN_KEYS.includes(key)) return;
    setImages((prev) => ({ ...prev, [key]: url || DEFAULT_IMAGES[key] }));

    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('site_config')
        .upsert({ key, value: url || '' }, { onConflict: 'key' });
      if (error) throw error;
    } catch (_err) {
      // silently ignore, UI already updated; next refresh will correct if needed
    }
  };

  const uploadAndSet = async (key, file) => {
    if (!file) throw new Error('No file selected');
    // Use a dedicated bucket for site assets
    const { publicUrl } = await uploadToStorage({ bucket: 'site', file, folder: 'images' });
    await setImageUrl(key, publicUrl);
    return publicUrl;
  };

  const value = useMemo(() => ({
    images,
    loading,
    refresh: fetchConfig,
    setImageUrl,
    uploadAndSet,
  }), [images, loading]);

  return (
    <SiteConfigContext.Provider value={value}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfigContext = () => useContext(SiteConfigContext);

export default SiteConfigContext;
