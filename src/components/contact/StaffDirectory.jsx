import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const StaffDirectory = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      if (!supabase) {
        setStaff([]);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('staff_members')
          .select('*')
          .eq('status', 'published')
          .order('order', { ascending: true })
          .order('name', { ascending: true });

        if (error) throw error;
        setStaff(data || []);
      } catch {
        setStaff([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center col-span-full py-6">
          <p className="text-muted-foreground">Loading staff...</p>
        </motion.div>
      )}

      {!loading && staff.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center col-span-full py-6">
          <p className="text-muted-foreground">No staff published yet.</p>
        </motion.div>
      )}

      {staff.map((person, index) => (
        <motion.div
          key={person.id || index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="bg-card rounded-2xl p-6 text-center border border-border shadow-sm"
        >
          <img  
            className="w-24 h-24 object-cover rounded-full mx-auto mb-4" 
            alt={`${person.name} - ${person.role || 'Staff'}`}
            src={person.image_url || '/sunday.jpeg'} />
          <h3 className="text-xl font-semibold text-foreground mb-1">{person.name}</h3>
          <p className="text-primary font-medium mb-4">{person.role || '—'}</p>
          <div className="space-y-2 text-sm text-muted-foreground mb-4">
            {person.email && (
              <div className="flex items-center justify-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{person.email}</span>
              </div>
            )}
            {person.phone && (
              <div className="flex items-center justify-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>{person.phone}</span>
              </div>
            )}
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-2">Contact for:</h4>
            <div className="flex flex-wrap gap-1 justify-center">
              {(Array.isArray(person.specialties) ? person.specialties : []).map((specialty, idx) => (
                <span key={idx} className="px-2 py-1 bg-accent/70 text-accent-foreground rounded-full text-xs border border-border">
                  {specialty}
                </span>
              ))}
              {(Array.isArray(person.specialties) ? person.specialties : []).length === 0 && (
                <span className="px-2 py-1 bg-accent/70 text-accent-foreground rounded-full text-xs border border-border">General</span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StaffDirectory;