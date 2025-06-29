import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [isOnWhiteBackground, setIsOnWhiteBackground] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Adjust 80 to the scroll position where your background becomes white
      setIsOnWhiteBackground(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Sermons', path: '/sermons' },
    { name: 'Events', path: '/events' },
    { name: 'Ministries', path: '/ministries' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed left-0 right-0 mx-[130px] mt-[15px] z-50 bg-white/30 backdrop-blur-lg border border-white/30 shadow-lg rounded-full px-4 py-1 transition-all duration-300"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <div className="flex items-center w-full">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center" style={{ minWidth: 80 }}>
          <Link to="/" className="flex items-center space-x-2">
            <span className={`text-2xl font-extrabold ${isOnWhiteBackground ? 'text-black' : 'text-white'} tracking-tight`}>GMI</span>
          </Link>
        </div>
        {/* Nav links */}
        <div className="hidden md:flex flex-1 items-center justify-center space-x-8">
          {navItems.map(item => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-base font-semibold transition-colors duration-200 px-2 py-1 rounded-full ${
                isOnWhiteBackground
                  ? (location.pathname === item.path ? 'text-black underline underline-offset-8' : 'text-black/80 hover:text-black')
                  : (location.pathname === item.path ? 'text-white/90 underline underline-offset-8' : 'text-white/80 hover:text-white')
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        {/* CTA Button */}
        <div className="hidden md:flex flex-shrink-0 items-center" style={{ minWidth: 120 }}>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <Button className={`bg-white/20 px-6 py-2 rounded-full font-semibold shadow-md border border-white/30 hover:bg-white/30 transition-all duration-200 backdrop-blur-md ${isOnWhiteBackground ? 'text-black' : 'text-white'}`}>
              Visit Us
            </Button>
          </a>
        </div>
        {/* Mobile menu button */}
        <div className="md:hidden flex-shrink-0 ml-auto">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className={isOnWhiteBackground ? 'text-black' : 'text-white'}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>
      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`absolute top-full left-0 w-full bg-black/90 backdrop-blur-xl rounded-b-2xl shadow-lg mt-2 py-6 px-6 flex flex-col space-y-4 z-40`}
          >
            {navItems.map(item => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-semibold transition-colors duration-200 px-2 py-2 rounded-full ${isOnWhiteBackground ? 'text-black' : 'text-white'}`}
              >
                {item.name}
              </Link>
            ))}
            <a href="#" target="_blank" rel="noopener noreferrer">
              <Button className={`w-full bg-white/20 py-3 rounded-full font-semibold shadow-md border border-white/30 hover:bg-white/30 transition-all duration-200 backdrop-blur-md ${isOnWhiteBackground ? 'text-black' : 'text-white'}`}>
                Visit Us
              </Button>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;