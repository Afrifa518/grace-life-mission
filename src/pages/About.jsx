
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Heart, Target, Eye, Users, Award, Globe } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

const About = () => {
  const { images } = useSiteConfigContext();
  const [leaders, setLeaders] = useState([]);
  const [leadersLoading, setLeadersLoading] = useState(false);

  const values = [
    { icon: Heart, title: "Love", description: "We demonstrate Christ's love through our actions and relationships with one another." },
    { icon: Target, title: "Purpose", description: "Every member is equipped and empowered to fulfill their God-given purpose." },
    { icon: Eye, title: "Vision", description: "We see beyond the present to God's greater plan for our community and world." },
    { icon: Users, title: "Unity", description: "Together we are stronger, supporting each other in faith and fellowship." },
  ];

  useEffect(() => {
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
        console.error(err);
      } finally {
        setLeadersLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  return (
    <>
      <Helmet>
        <title>About - GraceLife Mission International</title>
        <meta name="description" content="Learn about GraceLife Mission International—our mission, vision, and values as a Christ-centered community dedicated to worship, discipleship, and outreach." />
      </Helmet>

      <section className="relative py-32 hero-gradient text-white overflow-hidden">
        <div className="absolute inset-0">
          <img  
            className="w-full h-full object-cover opacity-20" 
            alt="Church building and congregation worshipping"
           src={images?.aboutHeroUrl || '/sunday.jpeg'} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">About Our Church</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              We are a Christ-centered community committed to worship, discipleship, and serving our neighbors with the love of Jesus.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">We make disciples of Christ through a life of grace by:</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Missionary Work', desc: 'Training and equipping believers to witness to the grace of God in all nations.' },
              { title: 'Discipleship Training', desc: 'Establishing organized systems to raise disciples of Jesus Christ.' },
              { title: 'Teaching Ministry', desc: 'Declaring the whole counsel of God and teaching holy living in this present age.' },
              { title: 'Kingdom Establishment', desc: 'Taking dominion of our community by advancing the kingdom of God.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.05 }} viewport={{ once: true }} className="bg-card rounded-2xl shadow-sm border border-border p-6">
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">Core Values</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">These biblical convictions shape our life and ministry.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Christlikeness', desc: 'Christ formed in us by grace (Galatians 2:20).' },
              { title: 'Soul Winning', desc: 'Obeying the Great Commission (Matthew 28:18).' },
              { title: 'Discipleship', desc: 'Equipping believers to maturity (Ephesians 4:11–16).' },
              { title: 'Contact Groups', desc: 'Fellowship and outreach in homes (Acts 5:42; Romans 16:3–5).' },
              { title: 'Ministry of the Holy Spirit', desc: 'Walking by the Spirit in calling and gifts (John 16:13).' },
              { title: 'Spiritual Leadership', desc: 'Being salt and light in society (Matthew 5:13–16).' },
              { title: 'Good Conscience', desc: 'A clear conscience in ministry (1 Timothy 1:19).' },
              { title: 'Spiritual Authority', desc: 'Obedience to God’s delegated authority (1 Samuel 15:22).' },
              { title: 'Second Coming of Christ', desc: 'Living in readiness (Revelation 22:12).' },
              { title: 'Ministry of Helps', desc: 'Serving the needy and marginalized (James 1:27).' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.04 }} viewport={{ once: true }} className="bg-card rounded-2xl shadow-sm border border-border p-6">
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">Our <span className="gradient-text">Leadership</span></h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Meet the dedicated leaders who guide our church with wisdom, compassion, and unwavering faith.</p>
          </motion.div>

          {leadersLoading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-muted-foreground">Loading leadership...</p>
            </motion.div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leaders.map((leader, index) => (
              <motion.div key={leader.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} viewport={{ once: true }} className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-all duration-300 card-hover">
              <div className="relative h-64">
                <img className="w-full h-full object-cover" alt={`${leader.name} - ${leader.role}`} src={leader.imageUrl || '/sunday.jpeg'} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-1">{leader.name}</h3>
                <p className="text-primary font-medium mb-3">{leader.role}</p>
                {leader.bio && <p className="text-muted-foreground text-sm leading-relaxed">{leader.bio}</p>}
              </div>
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
    </>
  );
};

export default About;
