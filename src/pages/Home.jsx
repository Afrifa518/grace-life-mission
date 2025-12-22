import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  ArrowRight, 
  Play, 
  Calendar, 
  Users, 
  Heart, 
  BookOpen,
  Clock,
  MapPin,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

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
    const fetchPreview = async () => {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from('gallery')
          .select('id,imageUrl')
          .eq('status', 'published')
          .order('date', { ascending: false })
          .limit(8);
        if (error) throw error;
        setGalleryPreview(data || []);
      } catch (err) {
        // no toast on home to keep quiet
        console.error(err);
      }
    };
    fetchPreview();
  }, []);

  React.useEffect(() => {
    const fetchLatestSermon = async () => {
      if (!supabase) return;
      setLatestSermonLoading(true);
      try {
        const { data, error } = await supabase
          .from('sermons')
          .select('*')
          .eq('status', 'published')
          .order('date', { ascending: false })
          .limit(1);
        if (error) throw error;
        setLatestSermon((data && data[0]) || null);
      } catch (err) {
        // no toast on home to keep quiet
        console.error(err);
        setLatestSermon(null);
      } finally {
        setLatestSermonLoading(false);
      }
    };
    fetchLatestSermon();
  }, []);

  React.useEffect(() => {
    const fetchUpcomingEvents = async () => {
      if (!supabase) return;
      setUpcomingEventsLoading(true);
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('status', 'published')
          .order('date', { ascending: true })
          .limit(8);
        if (error) throw error;

        const now = new Date();
        const upcoming = (data || [])
          .filter((e) => {
            const d = (Array.isArray(e.schedule) && e.schedule[0]?.date) ? e.schedule[0].date : e.date;
            if (!d) return false;
            return new Date(d) >= now;
          })
          .sort((a, b) => {
            const ad = (Array.isArray(a.schedule) && a.schedule[0]?.date) ? a.schedule[0].date : a.date;
            const bd = (Array.isArray(b.schedule) && b.schedule[0]?.date) ? b.schedule[0].date : b.date;
            return new Date(ad) - new Date(bd);
          })
          .slice(0, 4);

        setUpcomingEvents(upcoming);
      } catch (err) {
        // no toast on home to keep quiet
        console.error(err);
        setUpcomingEvents([]);
      } finally {
        setUpcomingEventsLoading(false);
      }
    };
    fetchUpcomingEvents();
  }, []);

  React.useEffect(() => {
    const fetchHomeMinistries = async () => {
      if (!supabase) return;
      setHomeMinistriesLoading(true);
      try {
        const { data, error } = await supabase
          .from('ministries')
          .select('*')
          .eq('status', 'published')
          .order('order', { ascending: true })
          .order('title', { ascending: true })
          .limit(4);
        if (error) throw error;
        setHomeMinistries(data || []);
      } catch (err) {
        // no toast on home to keep quiet
        console.error(err);
        setHomeMinistries([]);
      } finally {
        setHomeMinistriesLoading(false);
      }
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
    if (t.includes('outreach') || t.includes('mission')) return Star;
    return BookOpen;
  };

  const formatEventDate = (event) => {
    const d = (Array.isArray(event?.schedule) && event.schedule[0]?.date) ? event.schedule[0].date : event?.date;
    if (!d) return '';
    try {
      return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <>
      <Helmet>
        <title>Home - GraceLife Mission International</title>
        <meta name="description" content="Welcome to GraceLife Mission International. Join our Christ-centered community for worship, fellowship, and spiritual growth. Experience God's love and grace with us." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-black overflow-hidden">
        {/* Background Image */}
        <img src={images?.homeHeroUrl || '/sunday.jpeg'} alt="Home hero" className="absolute inset-0 w-full h-full object-cover object-center z-0" />
        {/* Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-foreground/90 via-primary/35 to-transparent" />
        <div className="relative z-20 max-w-3xl pl-8 pr-4 py-32 flex flex-col items-start">
          <div className="mb-6 text-white/80 font-medium text-lg flex items-center gap-3">
            <span className="inline-block w-10 h-0.5 bg-white/40 rounded-full mr-2" />
            Making Disciples of Christ through a life of Grace
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg leading-tight mb-6">
            Welcome to<br />GraceLife Mission International
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-xl drop-shadow">
            Called to proclaim the grace of God, raise disciples, and prepare the Church for the return of Christ.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-start mb-10">
            <Button asChild size="lg" className="rounded-full px-8">
              <a href="#about">
                Join Our Family
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
            <Button
              onClick={handleWatchLive}
              variant="outline"
              size="lg"
              className="rounded-full border-white/35 bg-white/10 text-white hover:bg-white/15 hover:text-white"
            >
              Watch Live
              <Play className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              A Place to <span className="gradient-text">Belong</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Warm worship, clear teaching, and a community that feels like home.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-border bg-background/70 backdrop-blur-sm p-6 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-amber-700 flex items-center justify-center shadow-sm shadow-black/10 mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Bible-Centered Teaching</h3>
              <p className="text-muted-foreground">Practical, Spirit-led messages that build faith and maturity.</p>
            </div>
            <div className="rounded-2xl border border-border bg-background/70 backdrop-blur-sm p-6 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-700 to-primary flex items-center justify-center shadow-sm shadow-black/10 mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Family & Fellowship</h3>
              <p className="text-muted-foreground">You’ll find people who care, serve, and walk with you.</p>
            </div>
            <div className="rounded-2xl border border-border bg-background/70 backdrop-blur-sm p-6 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-sm shadow-black/10 mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Grace in Action</h3>
              <p className="text-muted-foreground">We’re committed to discipleship, outreach, and real transformation.</p>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link to="/contact">
              <Button className="rounded-full px-8">Plan a Visit</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section id="about" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
                Experience God's <span className="gradient-text">Amazing Grace</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our vision is to make disciples of Christ through a life of grace (Titus 2:11–14). We do this through missionary work, discipleship training, the teaching ministry, and strong contact group systems—preparing the Church for the return of Jesus.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center p-4 bg-secondary/60 rounded-xl border border-border">
                  <div className="text-3xl font-bold text-primary mb-2">100+</div>
                  <div className="text-muted-foreground">Active Members</div>
                </div>
                <div className="text-center p-4 bg-accent/50 rounded-xl border border-border">
                  <div className="text-3xl font-bold text-amber-700 mb-2">10+</div>
                  <div className="text-muted-foreground">Years Serving</div>
                </div>
              </div>
              <Link to="/about">
                <Button className="rounded-full px-8">
                  Learn More About Us
                </Button>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img  
                  className="w-full h-96 object-cover" 
                  alt="Church Service"
                 src={images?.homeWelcomeUrl || '/sunday.jpeg'} /> 
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl font-semibold mb-2">Sunday Worship</h3>
                  <p className="text-white/90">Join us every Sunday at 8:00 AM & 11:00 AM</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Upcoming <span className="gradient-text">Events</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join us for these special gatherings as we worship, learn, and grow together in faith.
            </p>
          </motion.div>

          {upcomingEventsLoading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
              <p className="text-muted-foreground">Loading upcoming events...</p>
            </motion.div>
          ) : upcomingEvents.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
              <p className="text-muted-foreground">No upcoming events scheduled yet.</p>
            </motion.div>
          ) : (
            <div className={
              upcomingEvents.length <= 4
                ? "flex justify-center flex-wrap gap-6"
                : "grid grid-cols-1 md:grid-cols-3 gap-8"
            }>
              {upcomingEvents.map((event, index) => {
                const time = (Array.isArray(event.schedule) && event.schedule[0]?.time) ? event.schedule[0].time : event.time;
                return (
                  <motion.div
                    key={event.id || index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-all duration-300 card-hover w-full max-w-sm"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-amber-700 rounded-xl flex items-center justify-center mr-4 shadow-sm shadow-black/10">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{formatEventDate(event)}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {time && (
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {time}
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/events">
              <Button className="rounded-full px-8">
                View All Events
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Latest Sermon */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
                Latest <span className="gradient-text">Sermon</span>
              </h2>
              {latestSermonLoading ? (
                <p className="text-muted-foreground mb-8">Loading latest sermon...</p>
              ) : latestSermon ? (
                <>
                  <p className="text-lg text-foreground font-semibold mb-4">
                    {latestSermon.title}
                  </p>
                  {latestSermon.description ? (
                    <p className="text-muted-foreground mb-8">
                      {latestSermon.description}
                    </p>
                  ) : (
                    <p className="text-muted-foreground mb-8">
                      Listen to our latest message and be encouraged in your faith.
                    </p>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground mb-8">No sermons available yet. Please check back soon.</p>
              )}
              <div className="flex gap-4">
                <Link to="/sermons">
                  <Button className="rounded-full px-6">
                    Watch Sermons
                  </Button>
                </Link>
                {latestSermon?.youtubeUrl && (
                  <a href={latestSermon.youtubeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary font-semibold">
                    Watch Latest <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                )}
              </div>
            </div>
            <div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={latestSermon?.imageUrl || images?.homeWelcomeUrl || '/sunday.jpeg'}
                  alt={latestSermon?.title || 'Latest sermon'}
                  className="w-full h-80 object-cover"
                />
                {!latestSermonLoading && latestSermon && (
                  <div className="absolute bottom-4 left-4 bg-black/60 text-white rounded-full px-4 py-2 text-sm">
                    {[latestSermon.speaker, latestSermon.duration].filter(Boolean).join(' · ') || (latestSermon.date ? new Date(latestSermon.date).toLocaleDateString() : '')}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Plan Your Visit */}
      <section className="py-20 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Plan Your <span className="gradient-text">Visit</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We can’t wait to meet you. Here’s what you can expect when you visit us.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
              <h3 className="font-semibold text-foreground mb-2">Service Times</h3>
              <p className="text-muted-foreground">Sundays: 8:00 AM & 11:00 AM</p>
              <p className="text-muted-foreground">Wednesdays: 6:30 PM (Prayer)</p>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
              <h3 className="font-semibold text-foreground mb-2">Location</h3>
              <p className="text-muted-foreground">Pomakrom, Oppsite VRA Quaters</p>
              <p className="text-muted-foreground">Techiman BE, Ghana</p>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
              <h3 className="font-semibold text-foreground mb-2">Families & Kids</h3>
              <p className="text-muted-foreground">Safe, fun environments for kids of all ages every service.</p>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link to="/contact">
              <Button className="rounded-full px-8">
                Get Directions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-20 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              From Our <span className="gradient-text">Gallery</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">A glimpse into worship, community, and outreach moments.</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(galleryPreview || []).map((g, i) => (
              <div key={g.id || i} className="relative rounded-xl overflow-hidden shadow-md">
                <img
                  src={g.imageUrl || '/sunday.jpeg'}
                  alt="Gallery placeholder"
                  className="w-full h-40 md:h-44 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
          {(galleryPreview || []).length > 0 && (
            <div className="text-center mt-10">
              <Link to="/gallery">
                <Button className="rounded-full px-8">
                  View Full Gallery
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Ministries Section */}
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
              Our <span className="gradient-text">Ministries</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover ways to grow in faith and serve others through our diverse ministry programs.
            </p>
          </motion.div>

          {homeMinistriesLoading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
              <p className="text-muted-foreground">Loading ministries...</p>
            </motion.div>
          ) : homeMinistries.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
              <p className="text-muted-foreground">No ministries published yet.</p>
            </motion.div>
          ) : (
            <div className={
              homeMinistries.length <= 4
                ? "flex justify-center flex-wrap gap-8"
                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            }>
              {homeMinistries.map((ministry, index) => {
                const Icon = getMinistryIcon(ministry.title);
                const color = ministry.color || 'from-primary to-amber-700';
                return (
                  <motion.div
                    key={ministry.id || index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center group"
                  >
                    <div className={`w-20 h-20 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{ministry.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{ministry.subtitle || ministry.description || ''}</p>
                  </motion.div>
                );
              })}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/ministries">
              <Button className="rounded-full px-8">
                Explore All Ministries
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
                Partner With <span className="gradient-text">The Mission</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Your giving helps us preach the Gospel, disciple believers, and reach our community with practical love.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* <Link to="/donations">
                  <Button className="rounded-full px-8">Give Today</Button>
                </Link> */}
                <Link to="/contact">
                  <Button variant="outline" className="rounded-full px-8">
                    Talk to Us
                  </Button>
                </Link>
              </div>
            </div>
            <div className="rounded-3xl border border-border bg-background/70 backdrop-blur-sm p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-amber-700 flex items-center justify-center shadow-sm shadow-black/10">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Ways to Support</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Giving</li>
                    <li>Volunteering & Service</li>
                    <li>Outreach & Community Care</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 hero-gradient text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Ready to Begin Your Faith Journey?
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Take the next step and become part of our loving church family. We're here to support you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button className="rounded-full px-8 py-4 text-lg font-semibold bg-background text-foreground hover:bg-background/95 shadow-xl hover:shadow-2xl transition-all duration-300">
                  Visit Us This Sunday
                </Button>
              </Link>
              {/* <Link to="/donations">
                <Button 
                  variant="outline" 
                  className="border-white/40 text-white hover:bg-white/10 hover:text-white px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm bg-white/10 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Support Our Mission
                </Button>
              </Link> */}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
