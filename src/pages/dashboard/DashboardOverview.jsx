import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, Calendar, Image, Eye, Download, Heart } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

const DashboardOverview = () => {
  const [sermons, setSermons] = useState([]);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const { toast } = useToast();
  const navigate = useNavigate();

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
        <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your content.</p>
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
          className="bg-card/60 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 border border-border/60 p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-6">Recent Activity</h3>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity yet.</p>
          ) : (
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-9 h-9 bg-primary/15 rounded-xl flex items-center justify-center border border-primary/20">
                  <activity.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(activity.time).toLocaleString()}</p>
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
          className="bg-card/60 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 border border-border/60 p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-6">Content Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-sky-400" />
                <span className="text-sm font-medium text-foreground">Total Views</span>
              </div>
              <span className="text-sm font-bold text-foreground">{totalViews.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Download className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-medium text-foreground">Total Downloads</span>
              </div>
              <span className="text-sm font-bold text-foreground">{totalDownloads.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Heart className="w-5 h-5 text-rose-400" />
                <span className="text-sm font-medium text-foreground">Engagement Rate</span>
              </div>
              <span className="text-sm font-bold text-foreground">{sermons.length > 0 ? '87%' : '—'}</span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card/60 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 border border-border/60 p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/dashboard/sermons')}
            className="p-5 border border-border/60 rounded-2xl bg-background/40 hover:bg-accent/30 transition-colors duration-200 text-left"
            type="button"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center">
                <Mic className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Add New Sermon</p>
                <p className="text-xs text-muted-foreground">Upload YouTube link and details</p>
              </div>
            </div>
          </button>
          <button
            onClick={() => navigate('/dashboard/events')}
            className="p-5 border border-border/60 rounded-2xl bg-background/40 hover:bg-accent/30 transition-colors duration-200 text-left"
            type="button"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Create Event</p>
                <p className="text-xs text-muted-foreground">Add date, location, and schedule</p>
              </div>
            </div>
          </button>
          <button
            onClick={() => navigate('/dashboard/gallery')}
            className="p-5 border border-border/60 rounded-2xl bg-background/40 hover:bg-accent/30 transition-colors duration-200 text-left"
            type="button"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center">
                <Image className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Upload Media</p>
                <p className="text-xs text-muted-foreground">Photos or YouTube videos</p>
              </div>
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;