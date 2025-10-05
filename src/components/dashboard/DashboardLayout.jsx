import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuth from '@/hooks/useAuth';
import { 
  LayoutDashboard, 
  Mic, 
  Calendar, 
  Image, 
  Users, 
  Settings,
  BarChart3,
  FileText,
  LogOut
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: Mic, label: 'Sermons', path: '/dashboard/sermons' },
    { icon: Calendar, label: 'Events', path: '/dashboard/events' },
    { icon: Image, label: 'Gallery', path: '/dashboard/gallery' },
    { icon: Users, label: 'Ministries', path: '/dashboard/ministries' },
    { icon: Users, label: 'Leadership', path: '/dashboard/leaders' },
    { icon: Settings, label: 'Site Images', path: '/dashboard/site-images' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-gray-900">Media Dashboard</h2>
              <p className="text-xs text-gray-600">GraceLife Mission International</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-red-600 transition-colors duration-200 w-full">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900"></h1>
            {user && (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email}</p>
                  <p className="text-xs text-black font-bold text-center mt-4 mb-4">{user?.email}</p>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;