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
  const [errors, setErrors] = useState({});
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
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

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
      setErrors({});
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

  const inputClass = (field) =>
    `w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-colors ${
      errors[field] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'
    }`;

  const inputClassPlain = (field) =>
    `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-colors ${
      errors[field] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'
    }`;

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
        <h3 className="text-2xl font-bold text-foreground mb-6">Send Us a Message</h3>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium text-foreground/80 mb-2">Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" aria-hidden="true" />
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={inputClass('name')}
                  placeholder="Your full name"
                  aria-required="true"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'contact-name-error' : undefined}
                />
              </div>
              {errors.name && <p id="contact-name-error" className="text-destructive text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium text-foreground/80 mb-2">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" aria-hidden="true" />
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={inputClass('email')}
                  placeholder="your.email@example.com"
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'contact-email-error' : undefined}
                />
              </div>
              {errors.email && <p id="contact-email-error" className="text-destructive text-sm mt-1">{errors.email}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact-phone" className="block text-sm font-medium text-foreground/80 mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" aria-hidden="true" />
                <input
                  id="contact-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={inputClass('phone')}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
            <div>
              <label htmlFor="contact-reason" className="block text-sm font-medium text-foreground/80 mb-2">Reason for Contact</label>
              <select
                id="contact-reason"
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
            <label htmlFor="contact-subject" className="block text-sm font-medium text-foreground/80 mb-2">Subject</label>
            <input
              id="contact-subject"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className={inputClassPlain('subject')}
              placeholder="Brief subject line"
            />
          </div>
          <div>
            <label htmlFor="contact-message" className="block text-sm font-medium text-foreground/80 mb-2">Message *</label>
            <textarea
              id="contact-message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={6}
              className={inputClassPlain('message')}
              placeholder="Tell us how we can help you..."
              aria-required="true"
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'contact-message-error' : undefined}
            ></textarea>
            {errors.message && <p id="contact-message-error" className="text-destructive text-sm mt-1">{errors.message}</p>}
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
