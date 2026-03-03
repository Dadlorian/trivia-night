import { HashRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from '@/context/GameContext';
import { AppShell } from '@/components/AppShell';
import { HomePage } from '@/pages/HomePage';
import { PlayPage } from '@/pages/PlayPage';
import { ResultsPage } from '@/pages/ResultsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { AboutPage } from '@/pages/AboutPage';

function App() {
  return (
    <GameProvider>
      <HashRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/play" element={<PlayPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </GameProvider>
  );
}

export default App;
