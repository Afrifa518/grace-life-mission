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
import { useToast } from '@/components/ui/use-toast';
import hero_img from '../images/hero.jpg'
import { supabase } from '@/lib/supabase';

const Home = () => {
  const { toast } = useToast();
  const [galleryPreview, setGalleryPreview] = React.useState([]);
  React.useEffect(() => {
    const fetchPreview = async () => {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from('gallery')
          .select('id,imageUrl')
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

  const handleWatchLive = () => {
    window.open('https://meet.google.com/sxs-scqm-twk', '_blank');
  };

  const upcomingEvents = [
    {
      title: "3 Days Fasting & Prayer(All Night Service)",
      date: "25th - 27th June 2025",
      time: "10:00 PM - 04:00 AM",
      location: "Church Premises"
    }
  ];

  const ministries = [
    {
      title: "Youth Ministry",
      description: "Empowering the next generation with faith and purpose",
      icon: Users,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Women's Ministry",
      description: "Building sisterhood and spiritual growth together",
      icon: Heart,
      color: "from-pink-500 to-rose-500"
    },
    // {
    //   title: "Men's Ministry",
    //   description: "Strengthening men to lead with godly character",
    //   icon: BookOpen,
    //   color: "from-green-500 to-emerald-500"
    // },
    {
      title: "Outreach",
      description: "Spreading God's love throughout our community",
      icon: Star,
      color: "from-purple-500 to-violet-500"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Home - GraceLife Mission International</title>
        <meta name="description" content="Welcome to GraceLife Mission International. Join our Christ-centered community for worship, fellowship, and spiritual growth. Experience God's love and grace with us." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-black overflow-hidden">
        {/* Background Image */}
        <img src={hero_img} className="absolute inset-0 w-full h-full object-cover object-center z-0" />
        {/* Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-green-900/90 via-green-700/40 to-transparent" />
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
            <a href="#about" className="inline-flex items-center bg-white text-black font-semibold text-lg px-8 py-4 rounded-full shadow-lg hover:bg-gray-100 transition-all">
              Join Our Family
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
                Experience God's <span className="gradient-text">Amazing Grace</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our vision is to make disciples of Christ through a life of grace (Titus 2:11–14). We do this through missionary work, discipleship training, the teaching ministry, and strong contact group systems—preparing the Church for the return of Jesus.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">100+</div>
                  <div className="text-gray-600">Active Members</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">10+</div>
                  <div className="text-gray-600">Years Serving</div>
                </div>
              </div>
              <Link to="/about">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
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
                 src="/sunday.jpeg" /> 
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
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              Upcoming <span className="gradient-text">Events</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join us for these special gatherings as we worship, learn, and grow together in faith.
            </p>
          </motion.div>

          <div className={
            upcomingEvents.length <= 4
              ? "flex justify-center"
              : "grid grid-cols-1 md:grid-cols-3 gap-8"
          }>
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 card-hover"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-600">{event.date}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {event.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/events">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                View All Events
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Latest Sermon */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
                Latest <span className="gradient-text">Sermon</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Walking in Faith: Trusting God's Plan
              </p>
              <p className="text-gray-600 mb-8">
                Discover how to trust God's plan even when the path seems unclear. Learn practical steps to strengthen your faith journey.
              </p>
              <div className="flex gap-4">
                <Link to="/sermons">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6">
                    Watch Sermons
                  </Button>
                </Link>
                <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center text-blue-600 font-semibold">
                  Read Notes <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>
            <div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=1600&auto=format&fit=crop"
                  alt="Latest sermon placeholder"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black/60 text-white rounded-full px-4 py-2 text-sm">
                  Pastor John Smith · 45 min
                </div>
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
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              Plan Your <span className="gradient-text">Visit</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We can’t wait to meet you. Here’s what you can expect when you visit us.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Service Times</h3>
              <p className="text-gray-600">Sundays: 8:00 AM & 11:00 AM</p>
              <p className="text-gray-600">Wednesdays: 6:30 PM (Prayer)</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">GraceLife Mission International</p>
              <p className="text-gray-600">123 Faith Avenue, Accra</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Families & Kids</h3>
              <p className="text-gray-600">Safe, fun environments for kids of all ages every service.</p>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link to="/contact">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Get Directions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonies */}
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
              Powerful <span className="gradient-text">Testimonies</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stories of lives transformed by the love and power of Jesus.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1,2,3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
              >
                <img
                  src={`https://images.unsplash.com/photo-15${i}682933812-871e81e33e60?q=80&w=1600&auto=format&fit=crop`}
                  alt="Testimony placeholder"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <p className="text-gray-700 italic mb-4">“God has completely transformed my life through this church. I found hope, healing, and a family.”</p>
                  <p className="text-sm font-semibold text-gray-900">Member Name</p>
                </div>
              </motion.div>
            ))}
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
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              From Our <span className="gradient-text">Gallery</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">A glimpse into worship, community, and outreach moments.</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(galleryPreview || []).map((g, i) => (
              <div key={g.id || i} className="relative rounded-xl overflow-hidden shadow-md">
                <img
                  src={g.imageUrl || `https://picsum.photos/seed/glmi-${i}/600/400`}
                  alt="Gallery placeholder"
                  className="w-full h-40 md:h-44 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
          {(galleryPreview || []).length > 0 && (
            <div className="text-center mt-10">
              <Link to="/gallery">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  View Full Gallery
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Ministries Section */}
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
              Our <span className="gradient-text">Ministries</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover ways to grow in faith and serve others through our diverse ministry programs.
            </p>
          </motion.div>

          <div className={
            ministries.length <= 4
              ? "flex justify-center flex-wrap gap-8"
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          }>
            {ministries.map((ministry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group cursor-pointer"
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${ministry.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <ministry.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{ministry.title}</h3>
                <p className="text-gray-600 leading-relaxed">{ministry.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/ministries">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Explore All Ministries
              </Button>
            </Link>
          </motion.div>
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
              Ready to Begin Your Faith Journey?
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Take the next step and become part of our loving church family. We're here to support you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300">
                  Visit Us This Sunday
                </Button>
              </Link>
              <Link to="/donations">
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm bg-white/10 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Support Our Mission
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
