import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';
import { staffDirectory } from '@/data/contactData';

const StaffDirectory = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {staffDirectory.map((staff, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="bg-gray-50 rounded-2xl p-6 text-center"
        >
          <img  
            className="w-24 h-24 object-cover rounded-full mx-auto mb-4" 
            alt={`${staff.name} - ${staff.role}`}
            src="https://images.unsplash.com/photo-1638772463603-3d0f3147f199" />
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{staff.name}</h3>
          <p className="text-blue-600 font-medium mb-4">{staff.role}</p>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center justify-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>{staff.email}</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>{staff.phone}</span>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Contact for:</h4>
            <div className="flex flex-wrap gap-1 justify-center">
              {staff.specialties.map((specialty, idx) => (
                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StaffDirectory;