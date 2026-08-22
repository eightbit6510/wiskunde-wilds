import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ActiveClassLevelProvider } from './context/ActiveClassLevelContext';
import { useCloudSync } from './hooks/useCloudSync';
import { usePlayerAuth } from './hooks/usePlayerAuth';
import { useProgress } from './hooks/useProgress';
import { useSettings } from './hooks/useSettings';
import { BadgesPage } from './pages/BadgesPage';
import { Dashboard } from './pages/Dashboard';
import { LessonPage } from './pages/LessonPage';
import { SettingsPage } from './pages/SettingsPage';
import { SkillsPage } from './pages/SkillsPage';
import { TrainPage } from './pages/TrainPage';
import { getActiveClassLevel } from './utils/activeClassLevel';

export default function App() {
  const settingsApi = useSettings();
  const authApi = usePlayerAuth();
  const classLevel = getActiveClassLevel(authApi, settingsApi);
  const progressApi = useProgress(classLevel);

  useCloudSync({
    enabled: authApi.isLoggedIn,
    progress: progressApi.progress,
    settings: settingsApi.settings,
    syncToCloud: authApi.syncToCloud,
  });

  return (
    <ActiveClassLevelProvider classLevel={classLevel}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  progressApi={progressApi}
                  settingsApi={settingsApi}
                  authApi={authApi}
                />
              }
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
    </ActiveClassLevelProvider>
  );
}
