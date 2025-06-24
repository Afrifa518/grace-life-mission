import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import EventsHero from '@/components/events/EventsHero';
import EventsFilter from '@/components/events/EventsFilter';
import FeaturedEvent from '@/components/events/FeaturedEvent';
import EventsGrid from '@/components/events/EventsGrid';
import { eventsData, eventCategories } from '@/data/eventsData';

const Events = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleRSVP = (eventTitle) => {
    toast({
      title: "🚧 RSVP Feature Coming Soon!",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const categories = ['All', ...eventCategories];

  const filteredEvents = eventsData.filter(event => 
    selectedCategory === 'All' || event.category === selectedCategory
  );

  const upcomingEvents = filteredEvents.filter(event => 
    new Date(event.date) >= new Date() && event.status === 'published'
  ).sort((a, b) => new Date(a.date) - new Date(b.date));

  const featuredEvent = upcomingEvents.find(event => event.category === 'Special') || upcomingEvents[0];

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
      
      <EventsGrid 
        events={upcomingEvents.filter(event => event.id !== featuredEvent?.id)} 
        onRSVP={handleRSVP} 
        getCategoryColor={getCategoryColor} 
      />
    </>
  );
};

export default Events;