
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Instagram, 
  Youtube, 
  Twitter,
  Heart,
  Clock,
  Calendar
} from 'lucide-react';
import { useSiteConfigContext } from '@/contexts/SiteConfigContext';
import logo from '../../GMI-LOGOpp.png'

const Footer = () => {
  const { images } = useSiteConfigContext();
  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Sermons', path: '/sermons' },
    { name: 'Events', path: '/events' },
    { name: 'Ministries', path: '/ministries' },
    { name: 'Contact', path: '/contact' },
  ];

  const ministries = [
    { name: 'Youth Ministry', path: '/ministries' },
    { name: 'Women Ministry', path: '/ministries' },
    { name: 'Children Ministry', path: '/ministries' }
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/share/r/1AdLwMALT6/', label: 'Facebook' },
    { icon: Instagram, href: 'https://www.instagram.com/gracelife_mission_int/', label: 'Instagram' },
    { icon: Youtube, href: 'https://youtube.com/@gracelifemission_int?si=qnnkPuKD3J6w1_0c', label: 'YouTube' },
  ];

  return (
    <footer className="relative overflow-hidden bg-foreground text-background">
      {/* Background image */}
      <div className="absolute inset-0 pointer-events-none opacity-15">
        <img src={images?.footerBackgroundUrl || '/sunday.jpeg'} alt="" aria-hidden="true" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-foreground/30 via-foreground/70 to-foreground" />
      <div className="relative z-10">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Church Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-amber-700 rounded-xl flex items-center justify-center shadow-sm shadow-black/20">
                {/* <span className="text-white font-bold text-xl">G</span> */}
                <img src={logo} alt="GraceLife Mission Logo" className="h-10 w-auto object-contain" />
              </div>
              <div>
                <span className="font-display font-bold text-xl">GraceLife Mission</span>
                <p className="text-sm text-background/70">International</p>
              </div>
            </div>
            <p className="text-background/80 leading-relaxed">
              A Christ-centered church focused on spreading the Gospel and building a strong faith community through worship, fellowship, and service.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <span className="font-semibold text-lg mb-6 block">Quick Links</span>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-background/80 hover:text-background transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ministries */}
          <div>
            <span className="font-semibold text-lg mb-6 block">Ministries</span>
            <ul className="space-y-3">
              {ministries.map((ministry) => (
                <li key={ministry.name}>
                  <Link
                    to={ministry.path}
                    className="text-background/80 hover:text-background transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    {ministry.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <span className="font-semibold text-lg mb-6 block">Contact Info</span>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-background/80">Pomakrom, Oppsite VRA Quaters</p>
                  <p className="text-background/80">Techiman BE, Ghana</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <p className="text-background/80">+233505983499</p>
                <p className="text-background/80">+233244892719</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <p className="text-background/80">info@gracelifemission.org</p>
              </div>
              <div className="mt-6 p-4 bg-white/10 rounded-xl border border-white/10">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="font-medium text-sm">Service Times</span>
                </div>
                <p className="text-sm text-background/80">Sunday: 8:00 AM & 11:00 AM</p>
                <p className="text-sm text-background/80">Friday: 7:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-background/60 text-sm text-center md:text-left">
              © 2025 GraceLife Mission International. All rights reserved.
            </p>
            <div className="flex items-center space-x-1 text-sm text-background/60">
              <span>Built By</span>
              <span>GraceLife Media Team</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
