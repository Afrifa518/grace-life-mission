
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Play, Download, Calendar, Clock, User, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const Sermons = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
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

  const handlePlay = (title) => {
    toast({
      title: "�� Audio/Video Player Coming Soon!",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleDownload = (title) => {
    toast({
      title: "🚧 Download Feature Coming Soon!",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const categories = ['All', 'Faith', 'Hope', 'Love', 'Discipleship', 'Prayer', 'Worship'];

  const filteredSermons = sermons.filter(sermon => {
    const title = (sermon.title || '').toLowerCase();
    const speaker = (sermon.speaker || '').toLowerCase();
    const matchesSearch = title.includes(searchTerm.toLowerCase()) || speaker.includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || sermon.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Helmet>
        <title>Sermons - GraceLife Mission International</title>
        <meta name="description" content="Listen to inspiring sermons from GraceLife Mission International. Stream or download audio and video teachings on faith, hope, love, and Christian living." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img  
            className="w-full h-full object-cover opacity-20" 
            alt="Pastor delivering sermon from pulpit"
           src="https://images.unsplash.com/photo-1551677629-c3e314ecf29c" />
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
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row gap-4 items-center justify-between"
          >
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search sermons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Sermon */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                  Latest Sermon
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
                  {(filteredSermons[0]?.title) || 'No sermons available yet'}
                </h2>
                {filteredSermons[0] ? (
                  <div className="flex items-center space-x-6 text-gray-600 mb-6">
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
                  <p className="text-gray-600 mb-6">Check back soon for our latest message.</p>
                )}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={() => filteredSermons[0] && handlePlay(filteredSermons[0].title)}
                    disabled={!filteredSermons[0]}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Play Now
                  </Button>
                  <Button 
                    onClick={() => filteredSermons[0] && handleDownload(filteredSermons[0].title)}
                    disabled={!filteredSermons[0]}
                    variant="outline" 
                    className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
              <div className="relative">
                <img  
                  className="w-full h-80 object-cover rounded-xl shadow-lg" 
                  alt={filteredSermons[0]?.title || 'Sermon placeholder'}
                  src={filteredSermons[0]?.imageUrl || 'https://images.unsplash.com/photo-1573604253901-67bdb250d078'} />
                <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
                  <button 
                    onClick={() => filteredSermons[0] && handlePlay(filteredSermons[0].title)}
                    disabled={!filteredSermons[0]}
                    className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-300 group disabled:opacity-50"
                  >
                    <Play className="w-8 h-8 text-blue-600 ml-1 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sermon Library */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading */}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-gray-500">Loading sermons...</p>
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
                <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
                  Sermon <span className="gradient-text">Library</span>
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Explore our collection of inspiring messages that will strengthen your faith and deepen your relationship with God.
                </p>
              </motion.div>

              {filteredSermons.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                  <p className="text-gray-500 text-lg">No sermons found.</p>
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
                      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 card-hover"
                    >
                      <div className="relative h-48">
                        <img  
                          className="w-full h-full object-cover" 
                          alt={sermon.title}
                          src={sermon.imageUrl || 'https://images.unsplash.com/photo-1607354365933-44c35c62aeab'} />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <button 
                            onClick={() => handlePlay(sermon.title)}
                            className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-300 group"
                          >
                            <Play className="w-6 h-6 text-blue-600 ml-1 group-hover:scale-110 transition-transform" />
                          </button>
                        </div>
                        <div className="absolute top-4 left-4">
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                            {sermon.category || 'Sermon'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                          {sermon.title}
                        </h3>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{sermon.speaker || '—'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{sermon.duration || '—'}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                          {sermon.description || ''}
                        </p>
                        
                        <div className="flex items-center space-x-3">
                          <Button 
                            onClick={() => handlePlay(sermon.title)}
                            size="sm" 
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Play
                          </Button>
                          <Button 
                            onClick={() => handleDownload(sermon.title)}
                            size="sm" 
                            variant="outline" 
                            className="border-gray-300 text-gray-600 hover:bg-gray-50"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
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

      {/* Call to Action */}
      {/* <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Never Miss a Message
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Subscribe to our podcast or visit us in person to experience the power of God's Word in your life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300">
                Subscribe to Podcast
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm bg-white/10 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Visit This Sunday
              </Button>
            </div>
          </motion.div>
        </div>
      </section> */}
    </>
  );
};

export default Sermons;
