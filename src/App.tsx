import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { useProgress } from './hooks/useProgress';
import { useSettings } from './hooks/useSettings';
import { BadgesPage } from './pages/BadgesPage';
import { Dashboard } from './pages/Dashboard';
import { LessonPage } from './pages/LessonPage';
import { SettingsPage } from './pages/SettingsPage';
import { SkillsPage } from './pages/SkillsPage';
import { TrainPage } from './pages/TrainPage';

export default function App() {
  const progressApi = useProgress();
  const settingsApi = useSettings();

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={<Dashboard progressApi={progressApi} settingsApi={settingsApi} />}
          />
          <Route
            path="/les/:lessonId"
            element={<LessonPage progressApi={progressApi} settingsApi={settingsApi} />}
          />
          <Route
            path="/train"
            element={<TrainPage progressApi={progressApi} settingsApi={settingsApi} />}
          />
          <Route path="/skills" element={<SkillsPage progressApi={progressApi} />} />
          <Route path="/badges" element={<BadgesPage progressApi={progressApi} />} />
          <Route
            path="/settings"
            element={<SettingsPage progressApi={progressApi} settingsApi={settingsApi} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
