import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import EventsHero from '@/components/events/EventsHero';
import EventsFilter from '@/components/events/EventsFilter';
import FeaturedEvent from '@/components/events/FeaturedEvent';
import EventsGrid from '@/components/events/EventsGrid';
import { supabase } from '@/lib/supabase';

const Events = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleRSVP = (eventTitle) => {
    toast({
      title: "🚧 RSVP Feature Coming Soon!",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  useEffect(() => {
    const fetchEvents = async () => {
      if (!supabase) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true });
        if (error) throw error;
        setEvents(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set((events || []).map(e => e.category).filter(Boolean)));
    return ['All', ...unique];
  }, [events]);

  const filteredEvents = (events || []).filter(event => 
    (selectedCategory === 'All' || event.category === selectedCategory)
    && event.status === 'published'
    && new Date((event.schedule && event.schedule[0]?.date) || event.date) >= new Date()
  ).sort((a, b) => new Date((a.schedule && a.schedule[0]?.date) || a.date) - new Date((b.schedule && b.schedule[0]?.date) || b.date));

  const featuredEvent = filteredEvents.find(event => event.category === 'Special') || filteredEvents[0];

  const getCategoryColor = (category) => {
    const colors = {
      'Worship': 'from-blue-500 to-blue-600',
      'Youth': 'from-green-500 to-green-600',
      'Bible Study': 'from-purple-500 to-purple-600',
      'Fellowship': 'from-orange-500 to-orange-600',
      'Outreach': 'from-red-500 to-red-600',
      'Special': 'from-pink-500 to-pink-600',
      'Prayer': 'from-indigo-500 to-indigo-600',
      'Seminar': 'from-teal-500 to-teal-600'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  return (
    <>
      <Helmet>
        <title>Events - GraceLife Mission International</title>
        <meta name="description" content="Join us for upcoming events at GraceLife Mission International. View our calendar, RSVP for events, and be part of our vibrant church community." />
      </Helmet>

      <EventsHero />
      <EventsFilter 
        categories={categories} 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
      />
      
      {featuredEvent && (
        <FeaturedEvent event={featuredEvent} onRSVP={handleRSVP} />
      )}
      
      {!loading && (
        <EventsGrid 
          events={filteredEvents.filter(event => event.id !== featuredEvent?.id)} 
          onRSVP={handleRSVP} 
          getCategoryColor={getCategoryColor} 
        />
      )}
    </>
  );
};

export default Events;