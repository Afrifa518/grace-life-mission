
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Heart,
  CreditCard,
  Shield,
  Users,
  Church,
  Globe,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

const Donations = () => {
  const { toast } = useToast();
  const { images } = useSiteConfigContext();
  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState('tithe');
  const [frequency, setFrequency] = useState('one-time');

  const handleDonate = () => {
    const amount = selectedAmount || customAmount;
    if (!amount) {
      toast({
        title: "Please select or enter an amount",
        description: "Choose a preset amount or enter a custom amount to continue.",
      });
      return;
    }

    toast({
      title: "🚧 Payment Processing Coming Soon!",
      description: "Still working on Feature",
    });
  };

  const presetAmounts = ['25', '50', '100', '250', '500'];

  const donationTypes = [
    {
      id: 'tithe',
      title: 'Tithe',
      description: 'Regular giving to support church operations and ministry',
      icon: Church
    },
    {
      id: 'offering',
      title: 'Offering',
      description: 'Special gifts for specific needs and projects',
      icon: Heart
    },
    {
      id: 'missions',
      title: 'Missions',
      description: 'Support our global mission work and outreach',
      icon: Globe
    },
    {
      id: 'building',
      title: 'Building Fund',
      description: 'Help us expand and improve our facilities',
      icon: Users
    }
  ];

  const impactAreas = [
    {
      title: "Worship & Teaching",
      description: "Supporting our pastoral staff, worship team, and educational programs",
      percentage: "40%"
    },
    {
      title: "Community Outreach",
      description: "Food banks, homeless ministry, and local community support",
      percentage: "25%"
    },
    {
      title: "Missions & Evangelism",
      description: "Supporting missionaries and spreading the Gospel worldwide",
      percentage: "20%"
    },
    {
      title: "Facilities & Operations",
      description: "Maintaining our building and essential church operations",
      percentage: "15%"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Donations - GraceLife Mission International</title>
        <meta name="description" content="Support GraceLife Mission International through secure online donations. Give tithes, offerings, and support our missions and building fund." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-32 bg-primary text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-20"
            alt="Hands giving offering in church service"
           src={images?.donationsHeroUrl || '/sunday.jpeg'} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Give with Joy
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Your generous giving helps us spread God's love, support our community, and advance His kingdom around the world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Giving Philosophy */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 perspective-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Why We <span className="text-gold">Give</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion,
              for God loves a cheerful giver." - 2 Corinthians 9:7
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-accent rounded-2xl card-3d"
            >
              <div className="w-16 h-16 icon-box rounded-xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Worship Through Giving</h3>
              <p className="text-muted-foreground">Giving is an act of worship that acknowledges God as the source of all our blessings.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-accent rounded-2xl card-3d"
            >
              <div className="w-16 h-16 icon-box rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Building Community</h3>
              <p className="text-muted-foreground">Your gifts help create a strong church family and support those in need.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-accent rounded-2xl card-3d"
            >
              <div className="w-16 h-16 icon-box-gold rounded-xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Advancing the Gospel</h3>
              <p className="text-muted-foreground">Together we can reach more people with the life-changing message of Jesus Christ.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-20 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 perspective-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl shadow-xl p-8 md:p-12 card-3d"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Make a Donation
              </h2>
              <p className="text-lg text-muted-foreground">
                Choose your giving amount and type to support our ministry.
              </p>
            </div>

            {/* Donation Type Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Donation Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {donationTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setDonationType(type.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                      donationType === type.id
                        ? 'border-primary bg-accent'
                        : 'border-border hover:border-ring'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <type.icon className={`w-6 h-6 mt-1 ${
                        donationType === type.id ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                      <div>
                        <h4 className="font-semibold text-foreground">{type.title}</h4>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Frequency Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Frequency</h3>
              <div className="flex space-x-4">
                {[
                  { id: 'one-time', label: 'One Time' },
                  { id: 'weekly', label: 'Weekly' },
                  { id: 'monthly', label: 'Monthly' }
                ].map((freq) => (
                  <button
                    key={freq.id}
                    onClick={() => setFrequency(freq.id)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                      frequency === freq.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Amount</h3>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
                {presetAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount('');
                    }}
                    className={`p-4 rounded-lg border-2 font-semibold transition-all duration-300 ${
                      selectedAmount === amount
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border text-muted-foreground hover:border-ring'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="number"
                  placeholder="Enter custom amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount('');
                  }}
                  className="w-full pl-10 pr-4 py-4 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-lg"
                />
              </div>
            </div>

            {/* Security Notice */}
            <div className="mb-8 p-4 bg-accent rounded-lg border border-border">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-primary" />
                <div>
                  <h4 className="font-semibold text-foreground">Secure & Safe</h4>
                  <p className="text-sm text-muted-foreground">Your donation is processed securely with bank-level encryption.</p>
                </div>
              </div>
            </div>

            {/* Donate Button */}
            <Button
              onClick={handleDonate}
              className="w-full text-white py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Donate {selectedAmount || customAmount ? `$${selectedAmount || customAmount}` : ''} Now
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              You will receive a receipt for tax purposes after your donation is processed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Impact Areas */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 perspective-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Your Impact <span className="text-gold">Matters</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how your generous giving is making a difference in our church and community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {impactAreas.map((area, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-muted rounded-2xl p-6 card-3d"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-foreground">{area.title}</h3>
                  <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                    {area.percentage}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">{area.description}</p>
                <div className="mt-4 bg-accent rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-1000"
                    style={{ width: area.percentage }}
                  ></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Other Ways to Give */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 perspective-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Other Ways to <span className="text-gold">Give</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We offer multiple convenient ways for you to support our ministry.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 shadow-lg text-center card-3d"
            >
              <div className="w-16 h-16 icon-box rounded-xl flex items-center justify-center mx-auto mb-6">
                <Church className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">In-Person Giving</h3>
              <p className="text-muted-foreground mb-6">
                Bring your tithes and offerings during our Sunday worship services or drop them off at the church office.
              </p>
              <div className="text-sm text-muted-foreground">
                <p>Sunday Services: 9:00 AM & 11:00 AM</p>
                <p>Office Hours: Mon-Fri 9:00 AM - 5:00 PM</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 shadow-lg text-center card-3d"
            >
              <div className="w-16 h-16 icon-box-gold rounded-xl flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Bank Transfer</h3>
              <p className="text-muted-foreground mb-6">
                Set up automatic recurring donations through your bank's bill pay service for convenient regular giving.
              </p>
              <div className="text-sm text-muted-foreground">
                <p>Account Name: GraceLife Mission International</p>
                <p>Contact office for banking details</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 shadow-lg text-center card-3d"
            >
              <div className="w-16 h-16 icon-box rounded-xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Special Gifts</h3>
              <p className="text-muted-foreground mb-6">
                Consider memorial gifts, planned giving, or donating stocks and other assets to support our long-term ministry.
              </p>
              <div className="text-sm text-muted-foreground">
                <p>Contact our office for more information</p>
                <p>Phone: (555) 123-4567</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 perspective-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Stories of <span className="text-gold">Generosity</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from our church family about the joy and blessing of giving.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-accent rounded-2xl p-8 card-3d"
            >
              <div className="flex items-center mb-6">
                <img
                  className="w-16 h-16 object-cover rounded-full mr-4"
                  alt="Church member testimonial"
                 src="/sunday.jpeg" />
                <div>
                  <h4 className="font-semibold text-foreground">Sarah & Mike Johnson</h4>
                  <p className="text-muted-foreground">Church Members since 2018</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed italic">
                "Giving has become one of our greatest joys. Seeing how our contributions help feed families,
                support missionaries, and grow our church family fills our hearts with purpose. God has blessed
                us abundantly through our faithful giving."
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-accent rounded-2xl p-8 card-3d"
            >
              <div className="flex items-center mb-6">
                <img
                  className="w-16 h-16 object-cover rounded-full mr-4"
                  alt="Church member testimonial"
                 src="/sunday.jpeg" />
                <div>
                  <h4 className="font-semibold text-foreground">Robert Williams</h4>
                  <p className="text-muted-foreground">Faithful Tither for 25+ years</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed italic">
                "I've been tithing for over 25 years, and I can honestly say that God has never failed to
                provide for my family. The peace and blessing that comes from faithful giving is beyond
                anything money can buy. It's truly more blessed to give than to receive."
              </p>
            </motion.div>
          </div>
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
              Start Your Giving Journey Today
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Experience the joy and blessing of generous giving. Every gift, no matter the size, makes a difference in advancing God's kingdom.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleDonate}
                className="bg-white text-primary hover:bg-accent px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Give Now
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm bg-white/10 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Learn More About Giving
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Donations;
