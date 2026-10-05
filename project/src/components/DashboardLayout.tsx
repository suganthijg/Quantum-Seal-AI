import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Sun, Moon, LogOut, Bell, ChevronDown, Search } from 'lucide-react';
import { Logo } from './Logo';
import { useTheme } from '@/lib/useTheme';

export interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

export function DashboardLayout({
  role,
  nav,
  userName,
  children,
}: {
  role: string;
  nav: NavItem[];
  userName: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const roleAccent: Record<string, string> = {
    manufacturer: 'from-cyber-500 to-quantum-500',
    retailer: 'from-emerald-500 to-cyber-500',
    customer: 'from-quantum-500 to-purple-500',
    admin: 'from-rose-500 to-quantum-600',
  };

  return (
    <div className="min-h-screen bg-grid-light dark:bg-grid-dark bg-[size:32px_32px] relative">
      {/* ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-quantum-500/20 blur-[120px]"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-cyber-500/20 blur-[120px]"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-aqua-500/10 blur-[120px]"
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative flex">
        {/* Sidebar */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
            />
          )}
        </AnimatePresence>

        <aside
          className={`fixed lg:sticky top-0 z-40 h-screen w-72 shrink-0 glass-strong border-r border-white/40 dark:border-white/10 p-5 flex flex-col transition-transform duration-300 ${
            open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="flex items-center justify-between mb-8">
            <Logo />
            <button onClick={() => setOpen(false)} className="lg:hidden text-slate-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 rounded-2xl bg-gradient-to-r ${roleAccent[role]} p-3.5 text-white relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
            <div className="relative">
              <p className="text-xs uppercase tracking-wider opacity-80">{role} Portal</p>
              <p className="font-semibold text-sm truncate mt-0.5">{userName}</p>
            </div>
          </motion.div>

          <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-thin">
            {nav.map((item, i) => {
              const active = location.pathname === item.path;
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link to={item.path} onClick={() => setOpen(false)} className={`sidebar-link relative ${active ? 'sidebar-link-active' : ''}`}>
                    {active && (
                      <motion.div layoutId="sidebar-active" className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-gradient-to-b from-cyber-400 to-quantum-400" />
                    )}
                    <item.icon className="h-4.5 w-4.5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          <button
            onClick={() => navigate('/login')}
            className="sidebar-link mt-4 text-rose-500 hover:bg-rose-500/10"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Sign Out</span>
          </button>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          <header className="sticky top-0 z-20 glass-strong border-b border-white/40 dark:border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between">
            <button onClick={() => setOpen(true)} className="lg:hidden text-slate-600 dark:text-slate-300">
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button className="relative p-2 rounded-xl glass hover:bg-white/80 dark:hover:bg-white/10 transition group">
                <Search className="h-4 w-4 text-slate-500 dark:text-slate-300 group-hover:text-quantum-500 transition" />
              </button>
              <button className="relative p-2 rounded-xl glass hover:bg-white/80 dark:hover:bg-white/10 transition">
                <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                <motion.span
                  className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </button>
              <button
                onClick={toggle}
                className="p-2 rounded-xl glass hover:bg-white/80 dark:hover:bg-white/10 transition"
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  {theme === 'dark' ? (
                    <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                      <Sun className="h-5 w-5 text-amber-400" />
                    </motion.span>
                  ) : (
                    <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                      <Moon className="h-5 w-5 text-quantum-500" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <div className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl glass">
                <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${roleAccent[role]} flex items-center justify-center text-white text-sm font-bold shadow-glow`}>
                  {userName.charAt(0)}
                </div>
                <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-200">{userName.split(' ')[0]}</span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
