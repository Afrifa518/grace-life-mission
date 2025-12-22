import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FeaturedEvent = ({ event, onRSVP }) => {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-card/90 backdrop-blur-sm rounded-3xl border border-border p-8 md:p-12 shadow-sm"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-4 border border-border">
                Featured Event
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                {event.title}
              </h2>
              <div className="space-y-3 text-muted-foreground mb-6">
                {Array.isArray(event.schedule) && event.schedule.length > 0 ? (
                  <div className="space-y-2">
                    {event.schedule.map((s, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-amber-700" />
                        <span>{s.date ? new Date(s.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '—'}{s.time ? ` · ${s.time}` : ''}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-amber-700" />
                      <span>{new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-amber-700" />
                      <span>{event.time}</span>
                    </div>
                  </>
                )}
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-amber-700" />
                  <span>{event.location}</span>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {event.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => onRSVP(event)}
                  className="rounded-full px-8"
                >
                  RSVP Now
                </Button>
                <Button 
                  variant="outline" 
                  className="rounded-full px-8"
                >
                  Add to Calendar
                </Button>
              </div>
            </div>
            <div className="relative">
              <img  
                className="w-full h-80 object-cover rounded-2xl shadow-lg" 
                alt={event.title}
                src={event.imageUrl || '/sunday.jpeg'} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedEvent;