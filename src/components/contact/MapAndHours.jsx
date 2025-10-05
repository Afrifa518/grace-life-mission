import React from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { MapPin, Clock } from 'lucide-react';
import { serviceHours } from '@/data/contactData';

const MapAndHours = () => {
  const { toast } = useToast();

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="space-y-8"
    >
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="h-64 bg-gray-200 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-700 mb-2">Interactive Map</h4>
            <p className="text-gray-500">Pomakrom, Oppsite VRA Quaters, Techiman BE, Ghana</p>
            <Button 
              onClick={() => toast({
                title: "🚧 Interactive Map Coming Soon!",
                description: "Still working on Feature",
              })}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              View on Map
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center mb-6">
          <Clock className="w-6 h-6 text-blue-600 mr-3" />
          <h3 className="text-xl font-bold text-gray-900">Service Times & Hours</h3>
        </div>
        <div className="space-y-4">
          {serviceHours.map((schedule, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
              <div>
                <div className="font-medium text-gray-900">{schedule.day}</div>
                <div className="text-sm text-blue-600">{schedule.special}</div>
              </div>
              <div className="text-gray-600 text-right">{schedule.times}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">First Time Visitors</h4>
          <p className="text-blue-700 text-sm">
            We'd love to meet you! Arrive 15 minutes early for a warm welcome and to help you find your way around.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default MapAndHours;