import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { MapPin, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const FALLBACK_CHURCH_INFO = {
  address_line1: 'Pomakrom, Oppsite VRA Quaters',
  address_line2: 'Techiman BE, Ghana',
  map_url: null,
};

const MapAndHours = () => {
  const { toast } = useToast();
  const [churchInfo, setChurchInfo] = useState(null);
  const [serviceTimes, setServiceTimes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!supabase) {
        setChurchInfo(FALLBACK_CHURCH_INFO);
        setServiceTimes([]);
        return;
      }

      setLoading(true);
      try {
        const [infoRes, timesRes] = await Promise.all([
          supabase
            .from('church_info')
            .select('*')
            .eq('slug', 'default')
            .limit(1),
          supabase
            .from('service_times')
            .select('*')
            .eq('status', 'published')
            .order('order', { ascending: true })
            .order('day', { ascending: true }),
        ]);

        if (infoRes.error) throw infoRes.error;
        if (timesRes.error) throw timesRes.error;

        setChurchInfo((infoRes.data && infoRes.data[0]) || FALLBACK_CHURCH_INFO);
        setServiceTimes(timesRes.data || []);
      } catch {
        setChurchInfo(FALLBACK_CHURCH_INFO);
        setServiceTimes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addressText = useMemo(() => {
    const info = churchInfo || FALLBACK_CHURCH_INFO;
    return [info.address_line1, info.address_line2].filter(Boolean).join(', ');
  }, [churchInfo]);

  const mapUrl = (churchInfo?.map_url || FALLBACK_CHURCH_INFO.map_url) || '';

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="space-y-8"
    >
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="h-64 bg-secondary/60 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-foreground mb-2">Interactive Map</h4>
            <p className="text-muted-foreground">{addressText}</p>
            <Button 
              onClick={() => {
                if (mapUrl) {
                  window.open(mapUrl, '_blank', 'noopener,noreferrer');
                  return;
                }
                toast({
                  title: "🚧 Interactive Map Coming Soon!",
                  description: "Still working on Feature",
                });
              }}
              className="mt-4 rounded-full px-6"
            >
              View on Map
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
        <div className="flex items-center mb-6">
          <Clock className="w-6 h-6 text-gold mr-3" />
          <h3 className="text-xl font-bold text-foreground">Service Times & Hours</h3>
        </div>
        <div className="space-y-4">
          {loading && (
            <p className="text-muted-foreground">Loading service times...</p>
          )}
          {!loading && serviceTimes.length === 0 && (
            <p className="text-muted-foreground">No service times published yet.</p>
          )}
          {!loading && serviceTimes.map((schedule, index) => (
            <div key={schedule.id || index} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
              <div>
                <div className="font-medium text-foreground">{schedule.day}</div>
                <div className="text-sm text-primary">{schedule.special}</div>
              </div>
              <div className="text-muted-foreground text-right">{schedule.times}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-accent/60 rounded-xl border border-border">
          <h4 className="font-semibold text-foreground mb-2">First Time Visitors</h4>
          <p className="text-muted-foreground text-sm">
            We'd love to meet you! Arrive 15 minutes early for a warm welcome and to help you find your way around.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default MapAndHours;