import { useEffect, useState } from 'react';
import { getClassLevelLabel } from '../content/classLevels';
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
  const { session, isLoggedIn, syncStatus, syncError, logout } = authApi;
  const { progress } = progressApi;
  const { settings } = settingsApi;

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
          <strong>Cloud save</strong>
          <p className="muted" style={{ margin: '0.35rem 0 0.75rem', fontSize: '0.9rem' }}>
            Ingelogd als <strong>{session.player.displayName}</strong>. Je voortgang wordt opgeslagen
            wanneer je iets wijzigt.
          </p>
          {syncStatus === 'syncing' && (
            <p className="muted" style={{ margin: '0 0 0.5rem', fontSize: '0.85rem' }}>
              Bezig met opslaan…
            </p>
          )}
          {syncStatus === 'saved' && (
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: 'var(--moss)' }}>
              Opgeslagen in de cloud.
            </p>
          )}
          {syncError && (
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: 'var(--berry)' }}>
              {syncError}
            </p>
          )}
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => openWizard('login')}>
              Opnieuw inloggen
            </button>
            <button type="button" className="btn btn-ghost" disabled={busy} onClick={handleLogout}>
              Uitloggen
            </button>
          </div>
          {settings.classLevel && (
            <p className="muted" style={{ marginTop: '0.75rem' }}>
              Jaargroep: <strong>{getClassLevelLabel(settings.classLevel)}</strong>
            </p>
          )}
          <button type="button" className="btn btn-ghost" style={{ marginTop: '0.5rem' }} onClick={() => openWizard(null)}>
            Jaargroep wijzigen
          </button>
          <p className="muted" style={{ margin: '0.75rem 0 0', fontSize: '0.82rem' }}>
            Geheime code kwijt? Begin een nieuw avontuur met een andere naam — we slaan geen e-mail op
            om je te helpen herstellen.
          </p>
        </div>
        {wizard}
      </>
    );
  }

  return (
    <>
      <div className="settings-row cloud-save-panel" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
        <strong>Cloud save</strong>
        <p className="muted" style={{ margin: '0.35rem 0 0.75rem', fontSize: '0.9rem' }}>
          Bewaar je sterren en voortgang met een naam en geheime code — geen e-mail nodig.
        </p>
        <div className="auth-wizard-launch-grid">
          <button type="button" className="btn" onClick={() => openWizard('register')}>
            Nieuw avontuur bewaren
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => openWizard('login')}>
            Ik kom terug
          </button>
        </div>
      </div>
      {wizard}
    </>
  );
}
