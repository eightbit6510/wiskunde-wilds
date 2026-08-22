import { useState } from 'react';
import { CloudSavePanel } from '../components/CloudSavePanel';
import { PlayerAuthWizard } from '../components/auth/PlayerAuthWizard';
import { getClassLevelLabel } from '../content/classLevels';
import type { PlayerAuthApi } from '../hooks/usePlayerAuth';
import type { ProgressApi } from '../hooks/useProgress';
import type { SettingsApi } from '../hooks/useSettings';

export function SettingsPage({
  progressApi,
  settingsApi,
  authApi,
}: {
  progressApi: ProgressApi;
  settingsApi: SettingsApi;
  authApi: PlayerAuthApi;
}) {
  const { settings, update } = settingsApi;
  const { resetProgress, progress } = progressApi;
  const [confirmReset, setConfirmReset] = useState(false);
  const [classWizardOpen, setClassWizardOpen] = useState(false);

  return (
    <div>
      <h1>Instellingen</h1>
      <p className="muted">Maak het bos rustiger of frisser — jij bepaalt.</p>

      <div className="settings-list" style={{ marginTop: '1rem' }}>
        <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <strong>Jaargroep</strong>
          <p className="muted" style={{ margin: '0.35rem 0 0.75rem', fontSize: '0.9rem' }}>
            {settings.classLevel
              ? <>Je speelt nu met sommen voor <strong>{getClassLevelLabel(settings.classLevel)}</strong>.</>
              : 'Kies je jaargroep om hoofdstukken en sommen op jouw niveau te zien.'}
          </p>
          <button type="button" className="btn btn-secondary" onClick={() => setClassWizardOpen(true)}>
            {settings.classLevel ? 'Jaargroep wijzigen' : 'Jaargroep kiezen'}
          </button>
        </div>

        <CloudSavePanel authApi={authApi} progressApi={progressApi} settingsApi={settingsApi} />

        <div className="settings-row">
          <div>
            <strong>Geluid</strong>
            <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>
              Voor later — nu vooral een voorkeur die bewaard wordt.
            </p>
          </div>
          <button
            type="button"
            className={`toggle${settings.soundEnabled ? ' on' : ''}`}
            aria-pressed={settings.soundEnabled}
            aria-label="Geluid aan of uit"
            onClick={() => update({ soundEnabled: !settings.soundEnabled })}
          />
        </div>

        <div className="settings-row">
          <div>
            <strong>Animaties</strong>
            <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>
              Ster-pops en mascotte-beweging.
            </p>
          </div>
          <button
            type="button"
            className={`toggle${settings.animationsEnabled ? ' on' : ''}`}
            aria-pressed={settings.animationsEnabled}
            aria-label="Animaties aan of uit"
            onClick={() => update({ animationsEnabled: !settings.animationsEnabled })}
          />
        </div>

        <div className="settings-row">
          <div>
            <strong>Rustige modus</strong>
            <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>
              Minder beweging en decoratie.
            </p>
          </div>
          <button
            type="button"
            className={`toggle${settings.calmMode ? ' on' : ''}`}
            aria-pressed={settings.calmMode}
            aria-label="Rustige modus aan of uit"
            onClick={() => update({ calmMode: !settings.calmMode })}
          />
        </div>

        <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <strong>Voortgang resetten</strong>
          <p className="muted" style={{ margin: '0.35rem 0 0.75rem', fontSize: '0.9rem' }}>
            Wis sterren, badges en voltooide lessen van dit apparaat.
          </p>
          {!confirmReset ? (
            <button type="button" className="btn btn-secondary" onClick={() => setConfirmReset(true)}>
              Voortgang resetten…
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  resetProgress();
                  setConfirmReset(false);
                }}
              >
                Ja, alles wissen
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setConfirmReset(false)}
              >
                Annuleren
              </button>
            </div>
          )}
        </div>
      </div>

      <PlayerAuthWizard
        open={classWizardOpen}
        onClose={() => setClassWizardOpen(false)}
        classOnly
        authApi={authApi}
        progressApi={progressApi}
        settingsApi={settingsApi}
        progress={progress}
      />
    </div>
  );
}
