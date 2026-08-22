import { useEffect, useRef } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { usePlayerAuth } from './hooks/usePlayerAuth';
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
  const authApi = usePlayerAuth();
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!authApi.isLoggedIn) return;

    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      void authApi.syncToCloud({
        progress: progressApi.progress,
        settings: settingsApi.settings,
      });
    }, 2500);

    return () => {
      if (syncTimer.current) clearTimeout(syncTimer.current);
    };
  }, [authApi, progressApi.progress, settingsApi.settings]);

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
            element={
              <SettingsPage
                progressApi={progressApi}
                settingsApi={settingsApi}
                authApi={authApi}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
