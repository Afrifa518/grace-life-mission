import { MapPin, Phone, Mail, MessageSquare } from 'lucide-react';

export const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["123 Faith Street", "Grace City, GC 12345"],
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+1 (555) 123-4567", "Emergency: +1 (555) 123-4568"],
    color: "from-green-500 to-green-600"
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["info@gracelifemission.org", "pastor@gracelifemission.org"],
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: MessageSquare,
    title: "WhatsApp",
    details: ["+1 (555) 123-4567", "Quick responses available"],
    color: "from-green-400 to-green-500"
  }
];

export const serviceHours = [
  { day: "Sunday", times: "9:00 AM - 12:00 PM", special: "Worship Services" },
  { day: "Monday", times: "9:00 AM - 5:00 PM", special: "Office Hours" },
  { day: "Tuesday", times: "9:00 AM - 5:00 PM", special: "Office Hours" },
  { day: "Wednesday", times: "9:00 AM - 9:00 PM", special: "Bible Study 7:00 PM" },
  { day: "Thursday", times: "9:00 AM - 5:00 PM", special: "Office Hours" },
  { day: "Friday", times: "9:00 AM - 5:00 PM", special: "Youth Night 7:00 PM" },
  { day: "Saturday", times: "Closed", special: "Special Events Only" }
];

export const visitReasons = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'visit', label: 'Planning to Visit' },
  { value: 'prayer', label: 'Prayer Request' },
  { value: 'ministry', label: 'Ministry Information' },
  { value: 'counseling', label: 'Pastoral Counseling' },
  { value: 'event', label: 'Event Information' }
];

export const staffDirectory = [
  {
    name: "Pastor John Smith",
    role: "Senior Pastor",
    email: "pastor@gracelifemission.org",
    phone: "(555) 123-4567 ext. 101",
    specialties: ["Pastoral Care", "Counseling", "General Inquiries"],
    image: "Senior pastor in formal attire smiling warmly"
  },
  {
    name: "Pastor Sarah Johnson",
    role: "Associate Pastor",
    email: "sarah@gracelifemission.org",
    phone: "(555) 123-4567 ext. 102",
    specialties: ["Youth Ministry", "Women's Ministry", "Events"],
    image: "Female associate pastor in professional attire"
  },
  {
    name: "Mary Williams",
    role: "Church Administrator",
    email: "admin@gracelifemission.org",
    phone: "(555) 123-4567 ext. 100",
    specialties: ["General Info", "Facility Rentals", "Donations"],
    image: "Church administrator at her desk"
  }
];