import { Link, useLocation } from 'react-router-dom';
import { Home, Play, Trophy, SlidersHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/play', icon: Play, label: 'Play' },
  { path: '/results', icon: Trophy, label: 'Results' },
  { path: '/settings', icon: SlidersHorizontal, label: 'Settings' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-t">
      <div className="flex items-stretch justify-around max-w-lg mx-auto px-1">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                'relative flex flex-col items-center justify-center gap-0.5',
                'flex-1 min-h-[52px] py-2 rounded-xl transition-colors',
                'active:bg-secondary/40',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-1 bg-primary/[0.06] rounded-xl"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <Icon className="h-5 w-5 relative z-10" strokeWidth={isActive ? 2.5 : 1.75} />
              <span className={cn(
                'text-[10px] relative z-10',
                isActive ? 'font-semibold' : 'font-medium'
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
      {/* Safe area for phones with home indicators */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
