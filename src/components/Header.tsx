import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b">
      {/* Safe area spacer for notched phones */}
      <div className="h-[env(safe-area-inset-top)]" />
      <div className="flex items-center justify-between px-4 h-12 max-w-lg mx-auto">
        <Link to="/" className="flex items-center gap-2.5 min-h-[44px] -ml-1 pl-1">
          <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground text-xs font-bold tracking-tight">TN</span>
          </div>
          <span className="text-[15px] font-semibold tracking-[-0.01em] text-foreground">
            Trivia Night
          </span>
        </Link>
        <Link
          to="/about"
          className="flex items-center justify-center h-11 w-11 -mr-1.5 rounded-xl text-muted-foreground hover:text-foreground active:bg-secondary/60 transition-colors"
        >
          <Info className="h-[18px] w-[18px]" />
        </Link>
      </div>
    </header>
  );
}
