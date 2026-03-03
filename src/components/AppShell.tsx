import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

export function AppShell() {
  const location = useLocation();

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col overflow-x-hidden">
      <Header />
      {/* pb accounts for: nav 52px + safe-area-bottom + breathing room */}
      <main className="flex-1 w-full max-w-lg mx-auto px-4 pt-5 pb-[calc(68px+env(safe-area-inset-bottom))]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav />
    </div>
  );
}
