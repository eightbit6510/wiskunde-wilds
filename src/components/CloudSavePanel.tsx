import { useEffect, useState } from 'react';
import type { ProgressApi } from '../hooks/useProgress';
import type { SettingsApi } from '../hooks/useSettings';
import type { PlayerAuthApi } from '../hooks/usePlayerAuth';
import type { AuthWizardMode } from './auth/authWizardCopy';
import { PlayerAuthWizard } from './auth/PlayerAuthWizard';

export function CloudSavePanel({
  authApi,
  progressApi,
  settingsApi,
  forceWizardOpen = false,
  onWizardClose,
  classOnly = false,
}: {
  authApi: PlayerAuthApi;
  progressApi: ProgressApi;
  settingsApi: SettingsApi;
  forceWizardOpen?: boolean;
  onWizardClose?: () => void;
  /** Alleen jaargroep kiezen, zonder cloud account */
  classOnly?: boolean;
}) {
  const { session, isLoggedIn, logout } = authApi;
  const { progress } = progressApi;

  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardMode, setWizardMode] = useState<AuthWizardMode | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (forceWizardOpen) {
      setWizardMode(classOnly ? null : 'register');
      setWizardOpen(true);
    }
  }, [forceWizardOpen, classOnly]);

  const closeWizard = () => {
    setWizardOpen(false);
    onWizardClose?.();
  };

  const openWizard = (mode: AuthWizardMode | null) => {
    setWizardMode(mode);
    setWizardOpen(true);
  };

  const handleLogout = async () => {
    setBusy(true);
    await logout();
    setBusy(false);
  };

  const wizard = (
    <PlayerAuthWizard
      open={wizardOpen}
      onClose={closeWizard}
      initialMode={wizardMode}
      classOnly={classOnly}
      authApi={authApi}
      progressApi={progressApi}
      settingsApi={settingsApi}
      progress={progress}
    />
  );

  if (isLoggedIn && session) {
    return (
      <>
        <div className="settings-row cloud-save-panel" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <strong>Profiel</strong>
          <p className="muted" style={{ margin: '0.35rem 0 0.75rem', fontSize: '0.9rem' }}>
            Ingelogd als <strong>{session.player.displayName}</strong>.
          </p>
          <button type="button" className="btn btn-secondary" disabled={busy} onClick={handleLogout}>
            Afmelden
          </button>
        </div>
        {wizard}
      </>
    );
  }

  return (
    <>
      <div className="settings-row cloud-save-panel" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
        <strong>Profiel</strong>
        <button type="button" className="btn" style={{ marginTop: '0.35rem' }} onClick={() => openWizard(null)}>
          Aanmelden
        </button>
      </div>
      {wizard}
    </>
  );
}
