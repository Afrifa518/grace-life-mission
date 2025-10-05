
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Users, Heart, BookOpen, Star, Baby, Music, HeartHandshake as Handshake, Globe, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

const iconMap = { Users, Heart, BookOpen, Star, Baby, Music, Handshake, Globe };

const Ministries = () => {
  const { toast } = useToast();
  const { images } = useSiteConfigContext();
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [leaders, setLeaders] = useState([]);
  const [leadersLoading, setLeadersLoading] = useState(false);

  const handleJoinMinistry = (ministryName) => {
    toast({
      title: "🚧 Ministry Registration Coming Soon!",
      description: "Still working on Feature",
    });
  };

  useEffect(() => {
    const fetchMinistries = async () => {
      if (!supabase) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('ministries')
          .select('*')
          .eq('status', 'published')
          .order('order', { ascending: true })
          .order('title', { ascending: true });
        if (error) throw error;
        setMinistries(data || []);
      } catch (err) {
        toast({ title: 'Error loading ministries', description: err.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    const fetchLeaders = async () => {
      if (!supabase) return;
      setLeadersLoading(true);
      try {
        const { data, error } = await supabase
          .from('leaders')
          .select('*')
          .eq('status', 'published')
          .order('order', { ascending: true })
          .order('name', { ascending: true });
        if (error) throw error;
        setLeaders(data || []);
      } catch (err) {
        toast({ title: 'Error loading leaders', description: err.message, variant: 'destructive' });
      } finally {
        setLeadersLoading(false);
      }
    };
    fetchMinistries();
    fetchLeaders();
  }, [toast]);

  return (
    <>
      <Helmet>
        <title>Ministries - GraceLife Mission International</title>
        <meta name="description" content="Discover ministry opportunities at GraceLife Mission International. Join our youth, women's, men's, children's, worship, outreach, and missions ministries." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img  
            className="w-full h-full object-cover opacity-20" 
            alt="Diverse group of people serving in various church ministries"
           src={images?.ministriesHeroUrl || 'https://images.unsplash.com/photo-1647456614166-40dedca18fca'} />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Our Ministries
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Discover your place to serve, grow, and make a difference in our church family and community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Ministry Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              Find Your <span className="gradient-text">Calling</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our ministries are the hands and feet of GraceLife—equipping disciples through contact group systems, practical helps, outreach, and Spirit-led service.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Ministry Cards */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-gray-500">Loading ministries...</p>
            </motion.div>
          ) : ministries.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-gray-500">No ministries published yet.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {ministries.map((ministry, index) => (
                <motion.div
                  key={ministry.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: (index % 2) * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 card-hover"
                >
                  <div className="relative h-64">
                    <img  
                      className="w-full h-full object-cover" 
                      alt={ministry.title}
                     src={ministry.imageUrl || 'https://images.unsplash.com/photo-1564921074016-dc83ab4ac783'} />
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-6 left-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${ministry.color || 'from-blue-600 to-purple-600'} rounded-xl flex items-center justify-center shadow-lg`}>
                        <Users className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-2xl font-bold mb-1">{ministry.title}</h3>
                      <p className="text-white/90">{ministry.subtitle}</p>
                    </div>
                  </div>

                  <div className="p-8">
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {ministry.description}
                    </p>

                    <div className="space-y-4 mb-6">
                      {Array.isArray(ministry.features) && ministry.features.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">What We Do:</h4>
                          <ul className="space-y-1">
                            {ministry.features.slice(0, 3).map((feature, idx) => (
                              <li key={idx} className="text-sm text-gray-600 flex items-center">
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-900">Leader:</span>
                        <p className="text-gray-600">{ministry.leader || '—'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Meets:</span>
                        <p className="text-gray-600">{ministry.meetingTime || '—'}</p>
                      </div>
                    </div>

                    <Button 
                      onClick={() => handleJoinMinistry(ministry.title)}
                      className={`mt-6 w-full bg-gradient-to-r ${ministry.color || 'from-blue-600 to-purple-600'} hover:opacity-90 text-white py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 group`}
                    >
                      Join This Ministry
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Ministry Leaders - keep static for now */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              Ministry <span className="gradient-text">Leadership</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our dedicated ministry leaders are here to guide, support, and help you discover your place in God's kingdom.
            </p>
          </motion.div>

          {leadersLoading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-gray-500">Loading leadership...</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {leaders.map((leader, index) => (
                <motion.div
                  key={leader.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="relative mb-6">
                    <img  
                      className="w-32 h-32 object-cover rounded-full mx-auto shadow-lg group-hover:shadow-xl transition-shadow duration-300" 
                      alt={leader.name}
                      src={leader.imageUrl || 'https://images.unsplash.com/photo-1595956553066-fe24a8c33395'} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{leader.name}</h3>
                  <p className="text-blue-600 font-medium">{leader.role}</p>
                </motion.div>
              ))}
              {leaders.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center col-span-full py-6">
                  <p className="text-gray-500">No leaders published yet.</p>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Ready to Get Involved?
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Don't wait to start making a difference. Join a ministry today and discover how God wants to use your unique gifts and talents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300">
                Contact Ministry Leaders
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
      </section>
    </>
  );
};

export default Ministries;
