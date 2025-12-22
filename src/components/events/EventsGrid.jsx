import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EventsGrid = ({ events, onRSVP, getCategoryColor }) => {
  return (
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
            Upcoming <span className="gradient-text">Events</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mark your calendar and join us for these exciting upcoming events and gatherings.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-all duration-300 card-hover"
            >
              <div className="relative h-48">
                <img  
                  className="w-full h-full object-cover" 
                  alt={event.title}
                  src={event.imageUrl || '/sunday.jpeg'} />
                <div className="absolute top-4 left-4">
                  <span className={`bg-gradient-to-r ${getCategoryColor(event.category)} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                    {event.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-xl p-2 text-center border border-border shadow-sm">
                  {(() => {
                    const dateValue = (event.schedule && event.schedule[0]?.date) || event.date;
                    const d = dateValue ? new Date(dateValue) : null;
                    return (
                      <>
                        <div className="text-lg font-bold text-foreground">
                          {d ? d.getDate() : '—'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {d ? d.toLocaleDateString('en-US', { month: 'short' }) : '—'}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3 line-clamp-2">
                  {event.title}
                </h3>
                
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  {Array.isArray(event.schedule) && event.schedule.length > 0 ? (
                    <div className="space-y-1">
                      {event.schedule.map((s, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{s.date ? new Date(s.date).toLocaleDateString() : '—'}{s.time ? ` · ${s.time}` : ''}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                    </>
                  )}
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  {event.recurring && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{event.recurring}</span>
                    </div>
                  )}
                </div>
                
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
                  {event.description}
                </p>
                
                <Button 
                  onClick={() => onRSVP(event)}
                  className="w-full rounded-full"
                >
                  RSVP
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {events.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground text-lg">No upcoming events in this category.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default EventsGrid;