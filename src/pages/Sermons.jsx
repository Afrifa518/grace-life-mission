
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Play, Download, Calendar, Clock, User, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

const Sermons = () => {
  const { toast } = useToast();
  const { images } = useSiteConfigContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSermons = async () => {
      if (!supabase) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('sermons')
          .select('*')
          .eq('status', 'published')
          .order('date', { ascending: false });
        if (error) throw error;
        setSermons(data || []);
      } catch (err) {
        toast({ title: 'Error loading sermons', description: err.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchSermons();
  }, [toast]);

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtu.be')) {
        const id = u.pathname.replace('/', '');
        return `https://www.youtube.com/embed/${id}`;
      }
      if (u.hostname.includes('youtube.com')) {
        const id = u.searchParams.get('v');
        if (id) return `https://www.youtube.com/embed/${id}`;
        // handle /embed/{id} already
        if (u.pathname.startsWith('/embed/')) return url;
      }
    } catch {}
    return '';
  };

  const filteredSermons = sermons.filter(sermon => {
    const title = (sermon.title || '').toLowerCase();
    const speaker = (sermon.speaker || '').toLowerCase();
    const matchesSearch = title.includes(searchTerm.toLowerCase()) || speaker.includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>Sermons - GraceLife Mission International</title>
        <meta name="description" content="Listen to inspiring sermons from GraceLife Mission International. Stream or download audio and video teachings on faith, hope, love, and Christian living." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-32 hero-gradient text-white overflow-hidden">
        <div className="absolute inset-0">
          <img  
            className="w-full h-full object-cover opacity-20" 
            alt="Pastor delivering sermon from pulpit"
            src={images?.sermonsHeroUrl || '/sunday.jpeg'} />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Sermons & Teachings
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Declaring the whole counsel of God and training disciples to live holy and godly in this present age.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-12 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row gap-4 items-center justify-between"
          >
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search sermons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-border bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Sermon */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-card/90 backdrop-blur-sm rounded-3xl border border-border p-8 md:p-12 shadow-sm"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-4 border border-border">
                  Latest Sermon
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                  {(filteredSermons[0]?.title) || 'No sermons available yet'}
                </h2>
                {filteredSermons[0] ? (
                  <div className="flex items-center space-x-6 text-muted-foreground mb-6">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{filteredSermons[0].speaker || '—'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{filteredSermons[0].date ? new Date(filteredSermons[0].date).toLocaleDateString() : '—'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{filteredSermons[0].duration || '—'}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground mb-6">Check back soon for our latest message.</p>
                )}
                {filteredSermons[0]?.youtubeUrl && (
                  <a href={filteredSermons[0].youtubeUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="rounded-full px-6">
                      Watch on YouTube
                    </Button>
                  </a>
                )}
              </div>
              <div className="relative">
                {filteredSermons[0]?.youtubeUrl ? (
                  <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg">
                    <iframe
                      className="w-full h-full"
                      src={getYouTubeEmbedUrl(filteredSermons[0].youtubeUrl)}
                      title={filteredSermons[0].title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <img  
                    className="w-full h-80 object-cover rounded-xl shadow-lg" 
                    alt={filteredSermons[0]?.title || 'Sermon placeholder'}
                    src={filteredSermons[0]?.imageUrl || '/sunday.jpeg'} />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sermon Library */}
      <section className="py-20 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading */}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-muted-foreground">Loading sermons...</p>
            </motion.div>
          )}

          {!loading && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
                  Sermon <span className="gradient-text">Library</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Explore our collection of inspiring messages that will strengthen your faith and deepen your relationship with God.
                </p>
              </motion.div>

              {filteredSermons.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No sermons found.</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredSermons.slice(1).map((sermon, index) => (
                    <motion.div
                      key={sermon.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-all duration-300 card-hover"
                    >
                      <div className="relative h-48">
                        <img  
                          className="w-full h-full object-cover" 
                          alt={sermon.title}
                          src={sermon.imageUrl || '/sunday.jpeg'} />
                        {sermon.youtubeUrl && (
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                            <a 
                              href={sermon.youtubeUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-300 group"
                            >
                              <Play className="w-6 h-6 text-primary ml-1 group-hover:scale-110 transition-transform" />
                            </a>
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                            {sermon.category || 'Sermon'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-foreground mb-3 line-clamp-2">
                          {sermon.title}
                        </h3>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{sermon.speaker || '—'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{sermon.duration || '—'}</span>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
                          {sermon.description || ''}
                        </p>
                        
                        <div className="flex items-center space-x-3">
                          {sermon.youtubeUrl && (
                            <a href={sermon.youtubeUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                              <Button size="sm" className="w-full rounded-full">
                                <Play className="w-4 h-4 mr-2" />
                                Watch on YouTube
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Sermons;
