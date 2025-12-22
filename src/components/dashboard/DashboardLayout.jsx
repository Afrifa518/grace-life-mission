import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  LogOut,
  Menu,
  X
} from 'lucide-react';
import logo from '../../../GMI-LOGOpp.png'

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: Mic, label: 'Sermons', path: '/dashboard/sermons' },
    { icon: Calendar, label: 'Events', path: '/dashboard/events' },
    { icon: BarChart3, label: 'Event RSVPs', path: '/dashboard/rsvps' },
    { icon: Image, label: 'Gallery', path: '/dashboard/gallery' },
    { icon: Users, label: 'Ministries', path: '/dashboard/ministries' },
    { icon: Users, label: 'Ministry Signups', path: '/dashboard/ministry-registrations' },
    { icon: FileText, label: 'Contact Messages', path: '/dashboard/contact-messages' },
    { icon: Settings, label: 'Contact Settings', path: '/dashboard/contact-settings' },
    { icon: Users, label: 'Staff', path: '/dashboard/staff' },
    { icon: Users, label: 'Leadership', path: '/dashboard/leaders' },
    { icon: Settings, label: 'Site Images', path: '/dashboard/site-images' },
  ];

  const pageTitle = useMemo(() => {
    const match = sidebarItems.find((i) => i.path === location.pathname);
    if (match) return match.label;
    if (location.pathname === '/dashboard/') return 'Overview';
    if (location.pathname.startsWith('/dashboard')) return 'Dashboard';
    return '';
  }, [location.pathname, sidebarItems]);

  const SidebarContent = (
    <>
      <div className="p-6 border-b border-border/60">
        <div className="flex items-center gap-3">
          {/* <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-black/30"> */}
            <img src={logo} alt="GraceLife Mission Logo" className="h-10 w-auto object-contain" />
          {/* </div> */}
          <div className="min-w-0">
            <h2 className="font-display font-bold text-lg text-foreground leading-tight">Media Dashboard</h2>
            <p className="text-xs text-muted-foreground truncate">GraceLife Mission International</p>
          </div>
        </div>
      </div>

      <nav className="p-3 flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 border ${
                    isActive
                      ? 'bg-primary/15 text-foreground border-primary/20'
                      : 'text-muted-foreground border-transparent hover:bg-accent/40 hover:text-foreground'
                  }`}
                >
                  <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-3 border-t border-border/60">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-destructive transition-colors duration-200 w-full hover:bg-destructive/10"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="dark min-h-screen bg-background text-foreground flex">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden animate-in fade-in duration-200"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 md:w-72 bg-card/70 backdrop-blur-xl border-r border-border/60 shadow-2xl shadow-black/30 flex flex-col transform transition-transform duration-300 ease-out will-change-transform md:translate-x-0 md:static ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {SidebarContent}
      </aside>

      <main className="flex-1 min-w-0 overflow-auto">
        <header className="sticky top-0 z-30 bg-background/70 backdrop-blur-xl border-b border-border/60 px-4 md:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-border/60 bg-card/60 hover:bg-card transition-colors"
                aria-label="Toggle sidebar"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div className="min-w-0">
                <h1 className="text-xl md:text-2xl font-bold text-foreground truncate">{pageTitle}</h1>
                <p className="text-xs md:text-sm text-muted-foreground truncate">
                  Manage sermons, events, and media content
                </p>
              </div>
            </div>

            {user && (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-foreground">
                    {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500/40 to-indigo-500/30 border border-border/60 flex items-center justify-center">
                  <span className="text-sm font-semibold text-foreground">
                    {(user?.email || 'U').slice(0, 1).toUpperCase()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </header>

        <div key={location.pathname} className="p-4 md:p-6 animate-in fade-in-0 slide-in-from-bottom-1 duration-300">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;