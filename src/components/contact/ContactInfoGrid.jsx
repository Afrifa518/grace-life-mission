import React from 'react';
import { motion } from 'framer-motion';
import { contactInfo } from '@/data/contactData';

const ContactInfoGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
          <h3 className="text-xl font-semibold text-gray-900 mb-3">{info.title}</h3>
          <div className="space-y-1">
            {info.details.map((detail, idx) => (
              <p key={idx} className="text-gray-600">{detail}</p>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ContactInfoGrid;