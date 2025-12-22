import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useToast } from '@/components/ui/use-toast';
import EventsHero from '@/components/events/EventsHero';
import EventsFilter from '@/components/events/EventsFilter';
import FeaturedEvent from '@/components/events/FeaturedEvent';
import EventsGrid from '@/components/events/EventsGrid';
import Modal from '@/components/dashboard/Modal';
import RSVPForm from '@/components/registrations/RSVPForm';
import { supabase } from '@/lib/supabase';

const Events = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const parseEventDate = (value) => {
    if (!value) return null;
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const d = new Date(`${value}T00:00:00`);
      return Number.isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [rsvpEvent, setRsvpEvent] = useState(null);

  const closeRSVP = () => {
    setRsvpOpen(false);
    setRsvpEvent(null);
  };

  const handleRSVP = (event) => {
    if (!event) return;
    setRsvpEvent(event);
    setRsvpOpen(true);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      if (!supabase) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('status', 'published')
          .order('date', { ascending: true });
        if (error) throw error;
        setEvents(data || []);
      } catch (err) {
        toast({ title: 'Error loading events', description: err.message, variant: 'destructive' });
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
    && (() => {
      const raw = (event.schedule && event.schedule[0]?.date) || event.date;
      const d = parseEventDate(raw);
      if (!d) return false;
      return startOfDay(d) >= startOfDay(new Date());
    })()
  ).sort((a, b) => {
    const ad = parseEventDate((a.schedule && a.schedule[0]?.date) || a.date);
    const bd = parseEventDate((b.schedule && b.schedule[0]?.date) || b.date);
    if (!ad && !bd) return 0;
    if (!ad) return 1;
    if (!bd) return -1;
    return ad - bd;
  });

  const featuredEvent = filteredEvents.find(event => event.category === 'Special') || filteredEvents[0];

  const getCategoryColor = (category) => {
    const colors = {
      'Worship': 'from-primary to-amber-700',
      'Youth': 'from-emerald-700 to-emerald-500',
      'Bible Study': 'from-amber-700 to-amber-500',
      'Fellowship': 'from-amber-600 to-primary',
      'Outreach': 'from-primary to-emerald-600',
      'Special': 'from-emerald-800 to-amber-600',
      'Prayer': 'from-primary to-emerald-700',
      'Seminar': 'from-amber-800 to-primary'
    };
    return colors[category] || 'from-emerald-800 to-amber-700';
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

      <Modal open={rsvpOpen} title={`RSVP: ${rsvpEvent?.title || ''}`} onClose={closeRSVP}>
        <RSVPForm event={rsvpEvent} onCancel={closeRSVP} onSaved={closeRSVP} />
      </Modal>
    </>
  );
};

export default Events;