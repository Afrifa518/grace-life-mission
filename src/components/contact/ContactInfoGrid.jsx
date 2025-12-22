import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, MessageSquare, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const FALLBACK_CHURCH_INFO = {
  email: null,
  phone_primary: null,
  phone_secondary: null,
  whatsapp: null,
  address_line1: 'Pomakrom, Oppsite VRA Quaters',
  address_line2: 'Techiman BE, Ghana',
  city: null,
  region: null,
  country: null,
};

const ContactInfoGrid = () => {
  const [churchInfo, setChurchInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChurchInfo = async () => {
      if (!supabase) {
        setChurchInfo(FALLBACK_CHURCH_INFO);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('church_info')
          .select('*')
          .eq('slug', 'default')
          .limit(1);

        if (error) throw error;
        setChurchInfo((data && data[0]) || FALLBACK_CHURCH_INFO);
      } catch {
        setChurchInfo(FALLBACK_CHURCH_INFO);
      } finally {
        setLoading(false);
      }
    };

    fetchChurchInfo();
  }, []);

  const contactInfo = useMemo(() => {
    const info = churchInfo || FALLBACK_CHURCH_INFO;
    const extraAddress = [info.city, info.region, info.country].filter(Boolean).join(', ');
    const hasExtraAlready =
      !!extraAddress &&
      typeof info.address_line2 === 'string' &&
      info.address_line2.toLowerCase().includes(extraAddress.toLowerCase());

    const addressDetails = [
      info.address_line1,
      info.address_line2,
      extraAddress && !hasExtraAlready ? extraAddress : null,
    ].filter(Boolean);

    const phoneDetails = [info.phone_primary, info.phone_secondary].filter(Boolean);
    const emailDetails = [info.email].filter(Boolean);
    const whatsappNumber = info.whatsapp || info.phone_primary;
    const whatsappDetails = whatsappNumber
      ? [whatsappNumber, 'Quick responses available']
      : ['—'];

    return [
      {
        icon: MapPin,
        title: 'Visit Us',
        details: addressDetails,
        color: 'from-primary to-amber-700',
      },
      {
        icon: Phone,
        title: 'Call Us',
        details: phoneDetails.length ? phoneDetails : ['—'],
        color: 'from-emerald-700 to-emerald-500',
      },
      {
        icon: Mail,
        title: 'Email Us',
        details: emailDetails.length ? emailDetails : ['—'],
        color: 'from-amber-700 to-amber-500',
      },
      {
        icon: MessageSquare,
        title: 'WhatsApp',
        details: whatsappDetails,
        color: 'from-primary to-emerald-600',
      },
    ];
  }, [churchInfo]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center col-span-full py-6">
          <p className="text-muted-foreground">Loading contact info...</p>
        </motion.div>
      )}
      {contactInfo.map((info, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="text-center group"
        >
          <div className={`w-20 h-20 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
            <info.icon className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">{info.title}</h3>
          <div className="space-y-1">
            {info.details.map((detail, idx) => (
              <p key={idx} className="text-muted-foreground">{detail}</p>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ContactInfoGrid;