import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Send } from 'lucide-react';
import { visitReasons } from '@/data/contactData';
import { supabase } from '@/lib/supabase';

const ContactForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    visitReason: 'general'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Please fill in required fields",
        description: "Name, email, and message are required to send your message.",
        variant: "destructive"
      });
      return;
    }

    if (!supabase) {
      toast({
        title: 'Supabase not configured',
        description: 'Contact submissions are currently unavailable.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject || null,
        message: formData.message,
        visit_reason: formData.visitReason || null,
        status: 'new',
      };

      const { error } = await supabase.from('contact_messages').insert([payload]);
      if (error) throw error;

      toast({
        title: 'Message sent',
        description: "Thanks for reaching out. We'll get back to you soon.",
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        visitReason: 'general'
      });
    } catch (err) {
      toast({
        title: 'Send failed',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
        <h3 className="text-2xl font-bold text-foreground mb-6">Send Us a Message</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-border bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-border bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-border bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">Reason for Contact</label>
              <select
                name="visitReason"
                value={formData.visitReason}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-border bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                {visitReasons.map((reason) => (
                  <option key={reason.value} value={reason.value}>{reason.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-border bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
              placeholder="Brief subject line"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">Message *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-4 py-3 border border-border bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
              placeholder="Tell us how we can help you..."
              required
            ></textarea>
          </div>
          <Button 
            type="submit"
            disabled={loading}
            className="w-full rounded-full py-3"
          >
            <Send className="w-5 h-5 mr-2" />
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default ContactForm;