import { useLocation, Link } from 'react-router-dom';
import { Settings, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case '/play':
        return 'Trivia Night';
      case '/results':
        return 'Results';
      case '/settings':
        return 'Settings';
      case '/about':
        return 'About';
      default:
        return 'Trivia Night';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-md">
      <div className="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
        <Link to="/" className="text-lg font-bold tracking-tight">
          {getTitle()}
        </Link>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80" asChild>
            <Link to="/settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80" asChild>
            <Link to="/about">
              <Info className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
