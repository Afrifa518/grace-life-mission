import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Users, Heart, BookOpen, Star, Baby, Music, HeartHandshake as Handshake, Globe, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useSiteConfigContext } from '@/contexts/SiteConfigContext';
import Modal from '@/components/dashboard/Modal';
import MinistryRegistrationForm from '@/components/registrations/MinistryRegistrationForm';

const iconMap = { Users, Heart, BookOpen, Star, Baby, Music, Handshake, Globe };

const Ministries = () => {
  const { toast } = useToast();
  const { images } = useSiteConfigContext();
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [leaders, setLeaders] = useState([]);
  const [leadersLoading, setLeadersLoading] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [selectedMinistry, setSelectedMinistry] = useState(null);

  const closeRegistration = () => {
    setRegistrationOpen(false);
    setSelectedMinistry(null);
  };

  const handleJoinMinistry = (ministry) => {
    if (!ministry) return;
    setSelectedMinistry(ministry);
    setRegistrationOpen(true);
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
      <section className="relative py-32 bg-primary text-white overflow-hidden">
        <div className="absolute inset-0">
          <img  
            className="w-full h-full object-cover opacity-20" 
            alt="Diverse group of people serving in various church ministries"
           src={images?.ministriesHeroUrl || '/sunday.jpeg'} />
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
              Find Your <span className="text-gold">Calling</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Our ministries are the hands and feet of GraceLife—equipping disciples through contact group systems, practical helps, outreach, and Spirit-led service.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Ministry Cards */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-muted-foreground">Loading ministries...</p>
            </motion.div>
          ) : ministries.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-muted-foreground">No ministries published yet.</p>
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
                  className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-all duration-300 card-3d"
                >
                  <div className="relative h-64">
                    <img  
                      className="w-full h-full object-cover" 
                      alt={ministry.title}
                     src={ministry.imageUrl || '/sunday.jpeg'} />
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-6 left-6">
                      <div className={`w-16 h-16 ${ministry.color || 'bg-primary'} rounded-2xl flex items-center justify-center shadow-sm shadow-black/15`}>
                        <Users className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-2xl font-bold mb-1">{ministry.title}</h3>
                      <p className="text-white/90">{ministry.subtitle}</p>
                    </div>
                  </div>

                  <div className="p-8">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {ministry.description}
                    </p>

                    <div className="space-y-4 mb-6">
                      {Array.isArray(ministry.features) && ministry.features.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">What We Do:</h4>
                          <ul className="space-y-1">
                            {ministry.features.slice(0, 3).map((feature, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-center">
                                <div className="w-1.5 h-1.5 bg-gold rounded-full mr-3"></div>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-foreground">Leader:</span>
                        <p className="text-muted-foreground">{ministry.leader || '—'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Meets:</span>
                        <p className="text-muted-foreground">{ministry.meetingTime || '—'}</p>
                      </div>
                    </div>

                    <Button 
                      onClick={() => handleJoinMinistry(ministry)}
                      className="mt-6 w-full rounded-full group"
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
              Ministry <span className="text-gold">Leadership</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our dedicated ministry leaders are here to guide, support, and help you discover your place in God's kingdom.
            </p>
          </motion.div>

          {leadersLoading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-muted-foreground">Loading leadership...</p>
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
                      src={leader.imageUrl || '/sunday.jpeg'} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{leader.name}</h3>
                  <p className="text-primary font-medium">{leader.role}</p>
                </motion.div>
              ))}
              {leaders.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center col-span-full py-6">
                  <p className="text-muted-foreground">No leaders published yet.</p>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-white">
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
              <Button className="bg-background text-foreground hover:bg-background/95 px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300">
                Contact Ministry Leaders
              </Button>
              <Button 
                variant="outline" 
                className="border-white/40 text-white hover:bg-white/10 hover:text-white px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm bg-white/10 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Visit This Sunday
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Modal
        open={registrationOpen}
        title={`Join: ${selectedMinistry?.title || ''}`}
        onClose={closeRegistration}
      >
        <MinistryRegistrationForm
          ministry={selectedMinistry}
          onCancel={closeRegistration}
          onSaved={closeRegistration}
        />
      </Modal>
    </>
  );
};

export default Ministries;
