import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
const logo = '/GMI-LOGOpp.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [isOnWhiteBackground, setIsOnWhiteBackground] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsOnWhiteBackground(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Scroll lock when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
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
      transition={{ type: 'spring', stiffness: 140, damping: 18 }}
      className="fixed left-0 right-0 top-4 z-50 px-4"
      aria-label="Main navigation"
    >
      <div
        className={`relative mx-auto w-full max-w-7xl rounded-full border shadow-lg shadow-black/10 backdrop-blur-xl transition-all duration-300 ${
          isOnWhiteBackground
            ? 'border-white/40 bg-background/85'
            : 'border-white/25 bg-background/55'
        }`}
      >
        <div className="flex items-center w-full px-3 py-2 md:px-5 md:py-3">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center" style={{ minWidth: 80 }}>
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="GraceLife Mission Logo" className="h-10 w-auto object-contain" />
            </Link>
          </div>
          {/* Nav links */}
          <div className="hidden md:flex flex-1 items-center justify-center space-x-8">
            {navItems.map(item => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-semibold transition-colors duration-200 px-2 py-1 rounded-full ${
                  location.pathname === item.path
                    ? 'text-foreground underline underline-offset-8'
                    : 'text-foreground/70 hover:text-foreground'
                }`}
                aria-current={location.pathname === item.path ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
          </div>
          {/* CTA Button */}
          <div className="hidden md:flex flex-shrink-0 items-center" style={{ minWidth: 120 }}>
            <Link to="/contact">
              <Button variant="outline" className="rounded-full border-white/40 bg-white/10 text-foreground hover:bg-white/20">
                Visit Us
              </Button>
            </Link>
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden flex-shrink-0 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="text-foreground"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-navigation"
              role="menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 w-full rounded-2xl border border-white/20 bg-background/80 shadow-xl shadow-black/10 backdrop-blur-xl mt-3 py-5 px-5 flex flex-col space-y-2 z-40"
            >
              {navItems.map(item => (
                <Link
                  key={item.name}
                  to={item.path}
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                  className={`text-base font-semibold transition-colors duration-200 px-3 py-2 rounded-xl ${
                    location.pathname === item.path
                      ? 'bg-accent/50 text-foreground'
                      : 'text-foreground/80 hover:bg-accent/40 hover:text-foreground'
                  }`}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
              <Link to="/contact" onClick={() => setIsOpen(false)}>
                <Button className="w-full rounded-xl">Visit Us</Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
