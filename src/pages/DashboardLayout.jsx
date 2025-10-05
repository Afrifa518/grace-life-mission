import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardOverview from '@/pages/dashboard/DashboardOverview';
import SermonsManagement from '@/pages/dashboard/SermonsManagement';
import EventsManagement from '@/pages/dashboard/EventsManagement';
import GalleryManagement from '@/pages/dashboard/GalleryManagement';
import MinistriesManagement from '@/pages/dashboard/MinistriesManagement';
import LeadersManagement from '@/pages/dashboard/LeadersManagement';
import SiteImages from '@/pages/dashboard/SiteImages';

const DashboardLayouts = () => {
  return (
    <>
      <Helmet>
        <title>Media Dashboard - GraceLife Mission International</title>
        <meta name="description" content="Media team dashboard for managing sermons, events, and gallery content at GraceLife Mission International." />
      </Helmet>

      <DashboardLayout>
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/sermons" element={<SermonsManagement />} />
          <Route path="/events" element={<EventsManagement />} />
          <Route path="/gallery" element={<GalleryManagement />} />
          <Route path="/ministries" element={<MinistriesManagement />} />
          <Route path="/leaders" element={<LeadersManagement />} />
          <Route path="/site-images" element={<SiteImages />} />
        </Routes>
      </DashboardLayout>
    </>
  );
};

export default DashboardLayouts;