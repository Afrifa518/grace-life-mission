import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight,
  Play,
  Calendar,
  Users,
  Heart,
  BookOpen,
  Clock,
  MapPin,
  Star,
  ChevronRight,
  Church,
  Globe,
  Music,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

/* ── animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 40, rotateX: -8 },
  visible: (i = 0) => ({
    opacity: 1, y: 0, rotateX: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.23, 1, 0.32, 1] }
  })
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }
  })
};

const Home = () => {
  const { images } = useSiteConfigContext();
  const [galleryPreview, setGalleryPreview] = React.useState([]);
  const [latestSermon, setLatestSermon] = React.useState(null);
  const [latestSermonLoading, setLatestSermonLoading] = React.useState(false);
  const [upcomingEvents, setUpcomingEvents] = React.useState([]);
  const [upcomingEventsLoading, setUpcomingEventsLoading] = React.useState(false);
  const [homeMinistries, setHomeMinistries] = React.useState([]);
  const [homeMinistriesLoading, setHomeMinistriesLoading] = React.useState(false);

  React.useEffect(() => {
    if (!supabase) return;
    const fetchPreview = async () => {
      try {
        const { data, error } = await supabase
          .from('gallery').select('id,imageUrl')
          .eq('status', 'published').order('date', { ascending: false }).limit(8);
        if (error) throw error;
        setGalleryPreview(data || []);
      } catch (err) { console.error(err); }
    };
    fetchPreview();
  }, []);

  React.useEffect(() => {
    if (!supabase) return;
    const fetchLatestSermon = async () => {
      setLatestSermonLoading(true);
      try {
        const { data, error } = await supabase
          .from('sermons').select('*')
          .eq('status', 'published').order('date', { ascending: false }).limit(1);
        if (error) throw error;
        setLatestSermon((data && data[0]) || null);
      } catch (err) { console.error(err); setLatestSermon(null); }
      finally { setLatestSermonLoading(false); }
    };
    fetchLatestSermon();
  }, []);

  React.useEffect(() => {
    if (!supabase) return;
    const fetchUpcomingEvents = async () => {
      setUpcomingEventsLoading(true);
      try {
        const { data, error } = await supabase
          .from('events').select('*')
          .eq('status', 'published').order('date', { ascending: true }).limit(8);
        if (error) throw error;
        const now = new Date();
        const upcoming = (data || [])
          .filter((e) => {
            const d = (Array.isArray(e.schedule) && e.schedule[0]?.date) ? e.schedule[0].date : e.date;
            return d && new Date(d) >= now;
          })
          .sort((a, b) => {
            const ad = (Array.isArray(a.schedule) && a.schedule[0]?.date) ? a.schedule[0].date : a.date;
            const bd = (Array.isArray(b.schedule) && b.schedule[0]?.date) ? b.schedule[0].date : b.date;
            return new Date(ad) - new Date(bd);
          })
          .slice(0, 4);
        setUpcomingEvents(upcoming);
      } catch (err) { console.error(err); setUpcomingEvents([]); }
      finally { setUpcomingEventsLoading(false); }
    };
    fetchUpcomingEvents();
  }, []);

  React.useEffect(() => {
    if (!supabase) return;
    const fetchHomeMinistries = async () => {
      setHomeMinistriesLoading(true);
      try {
        const { data, error } = await supabase
          .from('ministries').select('*')
          .eq('status', 'published').order('order', { ascending: true })
          .order('title', { ascending: true }).limit(4);
        if (error) throw error;
        setHomeMinistries(data || []);
      } catch (err) { console.error(err); setHomeMinistries([]); }
      finally { setHomeMinistriesLoading(false); }
    };
    fetchHomeMinistries();
  }, []);

  const handleWatchLive = () => {
    window.open('https://meet.google.com/sxs-scqm-twk', '_blank');
  };

  const getMinistryIcon = (title) => {
    const t = (title || '').toLowerCase();
    if (t.includes('women')) return Heart;
    if (t.includes('youth')) return Users;
    if (t.includes('worship') || t.includes('music')) return Music;
    if (t.includes('outreach') || t.includes('mission')) return Globe;
    return BookOpen;
  };

  const formatEventDate = (event) => {
    const d = (Array.isArray(event?.schedule) && event.schedule[0]?.date) ? event.schedule[0].date : event?.date;
    if (!d) return '';
    try { return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
    catch { return ''; }
  };

  return (
    <>
      <Helmet>
        <title>Home - GraceLife Mission International</title>
        <meta name="description" content="Welcome to GraceLife Mission International. Join our Christ-centered community for worship, fellowship, and spiritual growth." />
      </Helmet>

      {/* ━━━ HERO ━━━ Full-viewport immersive 3D hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
        {/* Background image */}
        <img
          src={images?.homeHeroUrl || '/sunday.jpeg'}
          alt="Home hero"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />

        {/* Layered dark overlay with depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent z-[2]" />

        {/* 3D floating decorative elements */}
        <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
          {/* Glowing gold orb */}
          <div className="absolute top-[15%] right-[10%] w-72 h-72 rounded-full bg-[hsl(38,80%,48%)] opacity-[0.07] blur-3xl animate-float-3d" />
          {/* Morphing blob */}
          <div className="absolute bottom-[20%] right-[15%] w-96 h-96 bg-[hsl(38,80%,48%)] opacity-[0.04] shape-blob animate-float-3d" style={{ animationDelay: '2s' }} />
          {/* Orbiting ring */}
          <div className="absolute top-[40%] right-[25%] w-32 h-32 shape-ring border-[hsl(38,80%,48%)] opacity-[0.12] animate-orbit" />
          {/* Subtle cross */}
          <div className="absolute top-[20%] right-[35%] shape-cross text-white/[0.06] animate-float-3d" style={{ animationDelay: '4s' }} />
          {/* Floating dots */}
          <div className="absolute top-[60%] left-[5%] w-2 h-2 rounded-full bg-gold opacity-40 animate-float-3d" style={{ animationDelay: '1s' }} />
          <div className="absolute top-[30%] left-[15%] w-3 h-3 rounded-full bg-white opacity-20 animate-float-3d" style={{ animationDelay: '3s' }} />
          <div className="absolute bottom-[30%] right-[40%] w-2 h-2 rounded-full bg-gold opacity-30 animate-float-3d" style={{ animationDelay: '5s' }} />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full py-32">
          <div className="max-w-3xl scene-3d">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 mb-8 px-5 py-2.5 rounded-full glass border border-white/10"
            >
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-gold font-medium text-sm tracking-wider uppercase">Making Disciples of Christ</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold text-white leading-[1.05] mb-8"
            >
              Welcome to{' '}
              <span className="text-gold text-glow-gold">GraceLife</span>
              <br />
              Mission
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-lg md:text-xl text-white/75 mb-12 max-w-xl leading-relaxed"
            >
              Called to proclaim the grace of God, raise disciples, and prepare the Church for the return of Christ.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button asChild size="lg" className="rounded-full px-10 py-6 bg-gold text-foreground hover:bg-gold/90 font-semibold text-base shadow-lg shadow-gold/20 glow-gold">
                <a href="#about">
                  Join Our Family
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button
                onClick={handleWatchLive}
                size="lg"
                className="rounded-full px-10 py-6 glass text-white hover:bg-white/15 font-semibold text-base border-white/20"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Live
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[hsl(var(--background))] to-transparent z-[5]" />
      </section>

      {/* ━━━ WELCOME STRIP ━━━ Stats bar with 3D depth */}
      <section className="relative z-10 -mt-16 pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { value: '100+', label: 'Active Members', icon: Users },
              { value: '10+', label: 'Years Serving', icon: Church },
              { value: '5+', label: 'Ministries', icon: Heart },
              { value: '2', label: 'Sunday Services', icon: Clock },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                custom={i}
                className="depth-card bg-card rounded-2xl p-5 shadow-lg border border-border text-center"
              >
                <stat.icon className="w-6 h-6 text-gold mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ━━━ ABOUT / WELCOME ━━━ Asymmetric split with 3D image */}
      <section id="about" className="py-28 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left - 3D image composition */}
            <motion.div
              initial={{ opacity: 0, x: -60, rotateY: 15 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              viewport={{ once: true }}
              className="lg:col-span-5 relative scene-3d"
            >
              <div className="relative">
                {/* Main image */}
                <div className="depth-card rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    className="w-full h-[450px] object-cover"
                    alt="Church Service"
                    src={images?.homeWelcomeUrl || '/sunday.jpeg'}
                    loading="lazy"
                  />
                </div>
                {/* Floating badge - overlaps the image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="absolute -bottom-6 -right-4 md:-right-8 glass-light rounded-2xl p-5 shadow-xl border border-white/60"
                >
                  <div className="flex items-center gap-3">
                    <div className="icon-box-gold w-12 h-12">
                      <Church className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-foreground text-lg">Sunday Worship</div>
                      <div className="text-muted-foreground text-sm">8:00 AM &amp; 11:00 AM</div>
                    </div>
                  </div>
                </motion.div>
                {/* Decorative glow behind image */}
                <div className="absolute -inset-6 -z-10 bg-gold/10 rounded-3xl blur-2xl" />
              </div>
            </motion.div>

            {/* Right - Text content */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-7 scene-3d"
            >
              <motion.span variants={fadeUp} custom={0} className="inline-block text-gold font-semibold text-sm tracking-wider uppercase mb-4">About Us</motion.span>
              <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6 leading-tight">
                Experience God's <span className="text-gold">Amazing Grace</span>
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our vision is to make disciples of Christ through a life of grace (Titus 2:11-14). We do this through missionary work, discipleship training, the teaching ministry, and strong contact group systems — preparing the Church for the return of Jesus.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4">
                <Link to="/about">
                  <Button size="lg" className="rounded-full px-8 group">
                    Learn More About Us
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ━━━ FEATURES BENTO ━━━ Creative grid with 3D cards */}
      <section className="py-28 bg-muted relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/[0.05] rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span variants={fadeUp} custom={0} className="inline-block text-gold font-semibold text-sm tracking-wider uppercase mb-4">What We Offer</motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              A Place to <span className="text-gold">Belong</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Warm worship, clear teaching, and a community that feels like home.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BookOpen, title: 'Bible-Centered Teaching', desc: 'Practical, Spirit-led messages grounded in Scripture that build faith and maturity in every season of life.', accent: true },
              { icon: Users, title: 'Family & Fellowship', desc: "You'll find people who truly care, serve alongside you, and walk with you through every season." },
              { icon: Heart, title: 'Grace in Action', desc: "We're committed to discipleship, outreach, and real transformation in our community and beyond." },
              { icon: Music, title: 'Spirit-Led Worship', desc: 'Worship that touches the heart and lifts the spirit, creating space for encounters with God.' },
              { icon: Globe, title: 'Missions & Outreach', desc: 'Taking the Gospel beyond our walls through missions, community service, and practical love.' },
              { icon: Star, title: 'Discipleship Training', desc: 'Structured programs to help you grow deeper in faith and discover your God-given purpose.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40, rotateX: -10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.23, 1, 0.32, 1] }}
                viewport={{ once: true }}
                className={`depth-card rounded-2xl p-8 border border-border shadow-sm ${
                  item.accent
                    ? 'bg-primary text-primary-foreground md:row-span-1'
                    : 'bg-card'
                }`}
              >
                <div className={`icon-3d w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${
                  item.accent
                    ? 'bg-gold text-foreground'
                    : 'icon-box'
                }`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className={`font-semibold text-xl mb-3 ${item.accent ? '' : 'text-foreground'}`}>{item.title}</h3>
                <p className={`leading-relaxed ${item.accent ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/contact">
              <Button size="lg" className="rounded-full px-10">Plan a Visit</Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ━━━ UPCOMING EVENTS ━━━ Timeline-style layout */}
      <section className="py-28 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.span variants={fadeUp} custom={0} className="inline-block text-gold font-semibold text-sm tracking-wider uppercase mb-4">Don't Miss Out</motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Upcoming <span className="text-gold">Events</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join us for these special gatherings as we worship, learn, and grow together in faith.
            </motion.p>
          </motion.div>

          {upcomingEventsLoading ? (
            <div className="text-center py-10"><p className="text-muted-foreground">Loading upcoming events...</p></div>
          ) : upcomingEvents.length === 0 ? (
            <div className="text-center py-10"><p className="text-muted-foreground">No upcoming events scheduled yet.</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingEvents.map((event, index) => {
                const time = (Array.isArray(event.schedule) && event.schedule[0]?.time) ? event.schedule[0].time : event.time;
                return (
                  <motion.div
                    key={event.id || index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="tilt-card group bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Date badge */}
                      <div className="sm:w-28 flex-shrink-0 bg-primary p-5 flex flex-col items-center justify-center text-primary-foreground">
                        {(() => {
                          const dateStr = (Array.isArray(event.schedule) && event.schedule[0]?.date) ? event.schedule[0].date : event.date;
                          const d = dateStr ? new Date(dateStr) : null;
                          return d ? (
                            <>
                              <span className="text-3xl font-bold">{d.getDate()}</span>
                              <span className="text-sm uppercase tracking-wide">{d.toLocaleDateString('en-US', { month: 'short' })}</span>
                            </>
                          ) : <span className="text-sm">TBD</span>;
                        })()}
                      </div>
                      <div className="p-6 flex-1">
                        <h3 className="font-semibold text-foreground text-lg mb-2 group-hover:text-gold transition-colors">{event.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          {time && (
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-gold" />{time}
                            </span>
                          )}
                          {event.location && (
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-gold" />{event.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/events">
              <Button size="lg" className="rounded-full px-10 group">
                View All Events
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ━━━ LATEST SERMON ━━━ Immersive full-bleed with glass overlay */}
      <section className="relative py-32 overflow-hidden">
        {/* Background image */}
        <img
          src={latestSermon?.imageUrl || images?.homeWelcomeUrl || '/sunday.jpeg'}
          alt={latestSermon?.title || 'Latest sermon'}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.span variants={fadeUp} custom={0} className="inline-block text-gold font-semibold text-sm tracking-wider uppercase mb-4">Latest Message</motion.span>
              <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                Latest <span className="text-gold text-glow-gold">Sermon</span>
              </motion.h2>
              {latestSermonLoading ? (
                <p className="text-white/70 mb-8">Loading latest sermon...</p>
              ) : latestSermon ? (
                <>
                  <motion.p variants={fadeUp} custom={2} className="text-xl text-white font-semibold mb-3">{latestSermon.title}</motion.p>
                  <motion.p variants={fadeUp} custom={3} className="text-white/70 mb-8 leading-relaxed">
                    {latestSermon.description || 'Listen to our latest message and be encouraged in your faith.'}
                  </motion.p>
                </>
              ) : (
                <motion.p variants={fadeUp} custom={2} className="text-white/70 mb-8">No sermons available yet. Please check back soon.</motion.p>
              )}
              <motion.div variants={fadeUp} custom={4} className="flex flex-wrap gap-4">
                <Link to="/sermons">
                  <Button size="lg" className="rounded-full px-8 bg-gold text-foreground hover:bg-gold/90 font-semibold shadow-lg">
                    Watch Sermons
                  </Button>
                </Link>
                {latestSermon?.youtubeUrl && (
                  <a href={latestSermon.youtubeUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="rounded-full px-8 glass text-white border-white/20 hover:bg-white/15 hover:text-white">
                      <Play className="w-4 h-4 mr-2" />Watch Latest
                    </Button>
                  </a>
                )}
              </motion.div>
            </motion.div>

            {/* 3D floating play button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative">
                <div className="w-32 h-32 rounded-full glass flex items-center justify-center animate-glow-pulse cursor-pointer group" onClick={latestSermon?.youtubeUrl ? () => window.open(latestSermon.youtubeUrl, '_blank') : undefined}>
                  <Play className="w-12 h-12 text-gold group-hover:scale-110 transition-transform" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-gold/20 animate-pulse-ring" />
                <div className="absolute -inset-6 rounded-full border border-gold/10 animate-pulse-ring" style={{ animationDelay: '1s' }} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ━━━ PLAN YOUR VISIT ━━━ Cards with 3D depth */}
      <section className="py-28 bg-muted relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.span variants={fadeUp} custom={0} className="inline-block text-gold font-semibold text-sm tracking-wider uppercase mb-4">First Time?</motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Plan Your <span className="text-gold">Visit</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We can't wait to meet you. Here's what you can expect.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: 'Service Times', lines: ['Sundays: 8:00 AM & 11:00 AM', 'Wednesdays: 6:30 PM (Prayer)'], num: '01' },
              { icon: MapPin, title: 'Location', lines: ['Pomakrom, Opposite VRA Quarters', 'Techiman BE, Ghana'], num: '02' },
              { icon: Users, title: 'Families & Kids', lines: ['Safe, fun environments for kids', 'of all ages every service.'], num: '03' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50, rotateX: -12 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.23, 1, 0.32, 1] }}
                viewport={{ once: true }}
                className="depth-card bg-card rounded-2xl p-8 shadow-sm border border-border relative group"
              >
                {/* Large faded number */}
                <span className="absolute top-4 right-6 text-6xl font-bold text-foreground/[0.04] font-display">{item.num}</span>
                <div className="icon-3d icon-box-gold w-14 h-14 mb-5">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-foreground text-xl mb-3">{item.title}</h3>
                {item.lines.map((line, j) => (
                  <p key={j} className="text-muted-foreground leading-relaxed">{line}</p>
                ))}
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} viewport={{ once: true }} className="text-center mt-12">
            <Link to="/contact">
              <Button size="lg" className="rounded-full px-10">Get Directions</Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ━━━ GALLERY PREVIEW ━━━ Masonry-style grid with hover 3D */}
      <section className="py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.span variants={fadeUp} custom={0} className="inline-block text-gold font-semibold text-sm tracking-wider uppercase mb-4">Gallery</motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              From Our <span className="text-gold">Gallery</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-muted-foreground max-w-2xl mx-auto">A glimpse into worship, community, and outreach moments.</motion.p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {(galleryPreview || []).map((g, i) => {
              const tall = i === 0 || i === 3;
              return (
                <motion.div
                  key={g.id || i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  viewport={{ once: true }}
                  className={`tilt-card relative rounded-2xl overflow-hidden group cursor-pointer ${tall ? 'row-span-2' : ''}`}
                >
                  <img
                    src={g.imageUrl || '/sunday.jpeg'}
                    alt="Gallery moment"
                    className={`w-full object-cover group-hover:scale-110 transition-transform duration-700 ${tall ? 'h-full min-h-[320px]' : 'h-44 md:h-52'}`}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-500" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {(galleryPreview || []).length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }} className="text-center mt-12">
              <Link to="/gallery">
                <Button size="lg" className="rounded-full px-10 group">
                  View Full Gallery
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* ━━━ MINISTRIES ━━━ 3D flip cards */}
      <section className="py-28 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Background shapes */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gold/[0.05] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/[0.03] rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.span variants={fadeUp} custom={0} className="inline-block text-gold font-semibold text-sm tracking-wider uppercase mb-4">Get Involved</motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-display font-bold mb-4">
              Our <span className="text-gold text-glow-gold">Ministries</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">
              Discover ways to grow in faith and serve others through our diverse ministry programs.
            </motion.p>
          </motion.div>

          {homeMinistriesLoading ? (
            <div className="text-center py-10"><p className="text-primary-foreground/60">Loading ministries...</p></div>
          ) : homeMinistries.length === 0 ? (
            <div className="text-center py-10"><p className="text-primary-foreground/60">No ministries published yet.</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {homeMinistries.map((ministry, index) => {
                const Icon = getMinistryIcon(ministry.title);
                return (
                  <motion.div
                    key={ministry.id || index}
                    initial={{ opacity: 0, y: 40, rotateX: -10 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="lift-card group text-center rounded-2xl glass p-8"
                  >
                    <div className="icon-box-gold w-16 h-16 mx-auto mb-5 group-hover:animate-glow-pulse transition-all">
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{ministry.title}</h3>
                    <p className="text-primary-foreground/60 text-sm leading-relaxed">{ministry.subtitle || ministry.description || ''}</p>
                  </motion.div>
                );
              })}
            </div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} viewport={{ once: true }} className="text-center mt-12">
            <Link to="/ministries">
              <Button size="lg" className="rounded-full px-10 bg-gold text-foreground hover:bg-gold/90 font-semibold glow-gold group">
                Explore All Ministries
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ━━━ PARTNER / GIVING ━━━ Split design with animated border */}
      <section className="py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.span variants={fadeUp} custom={0} className="inline-block text-gold font-semibold text-sm tracking-wider uppercase mb-4">Support The Mission</motion.span>
              <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
                Partner With <span className="text-gold">The Mission</span>
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-lg text-muted-foreground leading-relaxed mb-8">
                Your giving helps us preach the Gospel, disciple believers, and reach our community with practical love.
              </motion.p>
              <motion.div variants={fadeUp} custom={3}>
                <Link to="/donations">
                  <Button size="lg" className="rounded-full px-10 group">
                    Learn About Giving
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40, rotateY: -8 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="scene-3d"
            >
              <div className="animated-border rounded-2xl p-8">
                <div className="flex items-start gap-5 mb-6">
                  <div className="icon-box-gold w-14 h-14 flex-shrink-0 glow-gold">
                    <Heart className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-1">Ways to Support</h3>
                    <p className="text-muted-foreground text-sm">Every contribution makes a difference</p>
                  </div>
                </div>
                <ul className="space-y-4">
                  {['Tithes & Offerings', 'Volunteering & Service', 'Outreach & Community Care'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-foreground">
                      <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                        <ChevronRight className="w-4 h-4 text-gold" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ━━━ CTA ━━━ Immersive final call to action */}
      <section className="relative py-32 overflow-hidden">
        <img
          src={images?.homeHeroUrl || '/sunday.jpeg'}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-primary/90" />

        {/* 3D floating shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 right-[20%] w-40 h-40 rounded-full border-2 border-gold/15 animate-pulse-ring" />
          <div className="absolute bottom-10 left-[15%] w-24 h-24 rounded-full border border-white/10 animate-pulse-ring" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 right-[10%] w-3 h-3 rounded-full bg-gold/40 animate-float-3d" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-8">
            <motion.h2 variants={fadeUp} custom={0} className="text-4xl md:text-6xl font-display font-bold text-white">
              Ready to Begin Your{' '}
              <span className="text-gold text-glow-gold">Faith Journey?</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
              Take the next step and become part of our loving church family. We're here to support you every step of the way.
            </motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <Link to="/contact">
                <Button size="lg" className="rounded-full px-12 py-6 text-lg font-semibold bg-gold text-foreground hover:bg-gold/90 shadow-2xl glow-gold-lg group">
                  Visit Us This Sunday
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
