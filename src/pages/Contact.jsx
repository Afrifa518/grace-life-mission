import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import ContactInfoGrid from '@/components/contact/ContactInfoGrid';
import ContactForm from '@/components/contact/ContactForm';
import MapAndHours from '@/components/contact/MapAndHours';
import StaffDirectory from '@/components/contact/StaffDirectory';
import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

const Contact = () => {
  const { images } = useSiteConfigContext();
  return (
    <>
      <Helmet>
        <title>Contact Us - GraceLife Mission International</title>
        <meta name="description" content="Get in touch with GraceLife Mission International. Find our location, contact information, service times, and send us a message. We'd love to hear from you!" />
      </Helmet>

      <section className="relative py-32 hero-gradient text-white overflow-hidden">
        <div className="absolute inset-0">
          <img 
            className="w-full h-full object-cover opacity-20" 
            alt="Church building exterior with welcoming entrance"
            src={images?.contactHeroUrl || '/sunday.jpeg'} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">Get in Touch</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              We'd love to hear from you! Reach out with questions, prayer requests, or to plan your visit to our church family.
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
              Contact <span className="gradient-text">Information</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Multiple ways to connect with our church family and get the information you need.
            </p>
          </motion.div>
          <ContactInfoGrid />
        </div>
      </section>

      <section className="py-20 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <ContactForm />
            <MapAndHours />
          </div>
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
              Who to <span className="gradient-text">Contact</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with the right person for your specific needs and questions.
            </p>
          </motion.div>
          <StaffDirectory />
        </div>
      </section>

      <section className="py-20 hero-gradient text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold">We Can't Wait to Meet You!</h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Whether you're planning your first visit or have been part of our family for years, we're here to support you on your faith journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-background text-foreground hover:bg-background/95 px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300">
                Plan Your Visit
              </Button>
              <Button 
                variant="outline" 
                className="border-white/40 text-white hover:bg-white/10 hover:text-white px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm bg-white/10 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Call Us Today
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Contact;