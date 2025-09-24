import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, Calendar, Image, Users, TrendingUp, Eye, Download, Heart } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

const DashboardOverview = () => {
  const [sermons, setSermons] = useState([]);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!supabase) return;

      const [sermonsRes, eventsRes, galleryRes] = await Promise.all([
        supabase.from('sermons').select('*').order('date', { ascending: false }),
        supabase.from('events').select('*').order('date', { ascending: false }),
        supabase.from('gallery').select('*').order('date', { ascending: false })
      ]);

      if (sermonsRes.error) toast({ title: "Error fetching sermons", description: sermonsRes.error.message, variant: 'destructive' });
      else setSermons(sermonsRes.data);

      if (eventsRes.error) toast({ title: "Error fetching events", description: eventsRes.error.message, variant: 'destructive' });
      else setEvents(eventsRes.data);
      
      if (galleryRes.error) toast({ title: "Error fetching gallery", description: galleryRes.error.message, variant: 'destructive' });
      else setGallery(galleryRes.data);
    };

    fetchData();
  }, [toast]);

  const publishedSermons = sermons.filter(sermon => sermon.status === 'published');
  const upcomingEvents = events.filter(event => new Date(event.date) >= new Date());
  const totalViews = sermons.reduce((sum, sermon) => sum + (sermon.views || 0), 0);
  const totalDownloads = sermons.reduce((sum, sermon) => sum + (sermon.downloads || 0), 0);

  const recentActivity = [
    ...sermons.slice(0, 3).map(s => ({ type: 'sermon', title: `Sermon: "${s.title}"`, time: s.date || s.created_at, icon: Mic })),
    ...events.slice(0, 3).map(e => ({ type: 'event', title: `Event: "${e.title}"`, time: e.date || e.created_at, icon: Calendar })),
    ...gallery.slice(0, 3).map(g => ({ type: 'gallery', title: `Gallery: "${g.title}"`, time: g.date || g.created_at, icon: Image })),
  ]
  .sort((a, b) => new Date(b.time) - new Date(a.time))
  .slice(0, 6);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome back! Here's what's happening with your content.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Published Sermons"
          value={publishedSermons.length}
          change={publishedSermons.length > 0 ? '+1 this month' : ''}
          icon={Mic}
          color="blue"
        />
        <StatsCard
          title="Upcoming Events"
          value={upcomingEvents.length}
          change={upcomingEvents.length > 0 ? '+1 this month' : ''}
          icon={Calendar}
          color="green"
        />
        <StatsCard
          title="Gallery Items"
          value={gallery.length}
          change={gallery.length > 0 ? '+1 this month' : ''}
          icon={Image}
          color="purple"
        />
        <StatsCard
          title="Total Views"
          value={totalViews.toLocaleString()}
          change={sermons.length > 0 ? '+15% this month' : ''}
          icon={Eye}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-gray-500">No recent activity yet.</p>
          ) : (
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <activity.icon className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{new Date(activity.time).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Content Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Total Views</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{totalViews.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Download className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-900">Total Downloads</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{totalDownloads.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Heart className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-gray-900">Engagement Rate</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{sermons.length > 0 ? '87%' : '—'}</span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200 text-center">
            <Mic className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Add New Sermon</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors duration-200 text-center">
            <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Create Event</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors duration-200 text-center">
            <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Upload Photos</p>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;