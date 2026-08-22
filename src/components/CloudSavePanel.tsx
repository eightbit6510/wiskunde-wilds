import { useEffect, useState } from 'react';
import type { ProgressApi } from '../hooks/useProgress';
import type { SettingsApi } from '../hooks/useSettings';
import type { PlayerAuthApi } from '../hooks/usePlayerAuth';
import type { ClassLevel } from '../types/content';
import { PIN_RULES } from '../types/player';
import { validateDisplayName, validatePin } from '../utils/playerValidation';

const CLASS_OPTIONS: { value: ClassLevel; label: string }[] = [
  { value: 'groep-7', label: 'Groep 7' },
  { value: 'groep-8', label: 'Groep 8' },
  { value: 'vwo2', label: 'VWO 2' },
  { value: 'vwo3', label: 'VWO 3' },
];

export function CloudSavePanel({
  authApi,
  progressApi,
  settingsApi,
}: {
  authApi: PlayerAuthApi;
  progressApi: ProgressApi;
  settingsApi: SettingsApi;
}) {
  const { session, isLoggedIn, syncStatus, syncError, register, login, logout, checkName } =
    authApi;
  const { progress, applyProgress } = progressApi;

  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [displayName, setDisplayName] = useState('');
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [classLevel, setClassLevel] = useState<ClassLevel | ''>('');
  const [nameHint, setNameHint] = useState<string | null>(null);
  const [nameSuggestion, setNameSuggestion] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!displayName.trim() || displayName.trim().length < 2) {
      setNameHint(null);
      setNameSuggestion(null);
      return;
    }

    const timer = setTimeout(async () => {
      const nameError = validateDisplayName(displayName);
      if (nameError) {
        setNameHint(nameError);
        setNameSuggestion(null);
        return;
      }

      try {
        const result = await checkName(displayName);
        if (result.configured === false) {
          setNameHint('Cloud save is nog niet actief op deze server.');
          setNameSuggestion(null);
          return;
        }
        if (result.available) {
          setNameHint('Deze naam is vrij!');
          setNameSuggestion(null);
        } else {
          setNameHint('Deze naam is al bezet.');
          setNameSuggestion(result.suggestion ?? null);
        }
      } catch {
        setNameHint(null);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [displayName, checkName]);

  const applySuggestion = () => {
    if (nameSuggestion) setDisplayName(nameSuggestion);
  };

  const handleRegister = async () => {
    setFormError(null);
    const nameError = validateDisplayName(displayName);
    if (nameError) return setFormError(nameError);
    const pinError = validatePin(pin);
    if (pinError) return setFormError(pinError);
    if (pin !== pinConfirm) return setFormError('Geheime codes komen niet overeen.');

    setBusy(true);
    try {
      await register({
        displayName: displayName.trim(),
        pin,
        classLevel: classLevel || null,
        localProgress: progress,
      });
      setPin('');
      setPinConfirm('');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Registreren mislukt.');
    } finally {
      setBusy(false);
    }
  };

  const handleLogin = async () => {
    setFormError(null);
    const nameError = validateDisplayName(displayName);
    if (nameError) return setFormError(nameError);
    const pinError = validatePin(pin);
    if (pinError) return setFormError(pinError);

    setBusy(true);
    try {
      const result = await login({
        displayName: displayName.trim(),
        pin,
        localProgress: progress,
      });
      applyProgress(result.mergedProgress);
      if (result.prefs.settings) {
        settingsApi.update(result.prefs.settings);
      }
      setPin('');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Inloggen mislukt.');
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    setBusy(true);
    await logout();
    setBusy(false);
  };

  if (isLoggedIn && session) {
    return (
      <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
        <strong>Cloud save</strong>
        <p className="muted" style={{ margin: '0.35rem 0 0.75rem', fontSize: '0.9rem' }}>
          Ingelogd als <strong>{session.player.displayName}</strong>. Je voortgang wordt automatisch
          opgeslagen in de cloud.
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
        <button type="button" className="btn btn-secondary" disabled={busy} onClick={handleLogout}>
          Uitloggen
        </button>
        <p className="muted" style={{ margin: '0.75rem 0 0', fontSize: '0.82rem' }}>
          Geheime code kwijt? Begin een nieuw avontuur met een andere naam — we slaan geen e-mail op
          om je te helpen herstellen.
        </p>
      </div>
    );
  }

  return (
    <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
      <strong>Cloud save</strong>
      <p className="muted" style={{ margin: '0.35rem 0 0.75rem', fontSize: '0.9rem' }}>
        Sla je voortgang op met een naam en geheime code — geen e-mail nodig.
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <button
          type="button"
          className={`btn btn-ghost${mode === 'register' ? ' selected' : ''}`}
          onClick={() => setMode('register')}
        >
          Nieuw account
        </button>
        <button
          type="button"
          className={`btn btn-ghost${mode === 'login' ? ' selected' : ''}`}
          onClick={() => setMode('login')}
        >
          Inloggen
        </button>
      </div>

      <div className="field">
        <label htmlFor="cloud-name">Hoe wil je dat we je noemen?</label>
        <input
          id="cloud-name"
          type="text"
          autoComplete="off"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Bijv. Dennis"
        />
        {nameHint && (
          <span className="muted" style={{ fontSize: '0.85rem' }}>
            {nameHint}{' '}
            {nameSuggestion && (
              <button type="button" className="btn btn-ghost" style={{ padding: '0.1rem 0.4rem' }} onClick={applySuggestion}>
                Gebruik {nameSuggestion}
              </button>
            )}
          </span>
        )}
      </div>

      <div className="field">
        <label htmlFor="cloud-pin">Geheime code ({PIN_RULES.minLength}-{PIN_RULES.maxLength} cijfers)</label>
        <input
          id="cloud-pin"
          type="password"
          inputMode="numeric"
          autoComplete="new-password"
          maxLength={PIN_RULES.maxLength}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
        />
      </div>

      {mode === 'register' && (
        <>
          <div className="field">
            <label htmlFor="cloud-pin-confirm">Herhaal geheime code</label>
            <input
              id="cloud-pin-confirm"
              type="password"
              inputMode="numeric"
              autoComplete="new-password"
              maxLength={PIN_RULES.maxLength}
              value={pinConfirm}
              onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, ''))}
            />
          </div>

          <div className="field">
            <label htmlFor="cloud-class">In welke groep zit je? (optioneel)</label>
            <select
              id="cloud-class"
              value={classLevel}
              onChange={(e) => setClassLevel(e.target.value as ClassLevel | '')}
            >
              <option value="">Overslaan</option>
              {CLASS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {formError && (
        <p style={{ color: 'var(--berry)', fontSize: '0.9rem', margin: '0.5rem 0' }}>{formError}</p>
      )}

      <button
        type="button"
        className="btn"
        disabled={busy}
        onClick={mode === 'register' ? handleRegister : handleLogin}
        style={{ marginTop: '0.5rem' }}
      >
        {mode === 'register' ? 'Account aanmaken' : 'Inloggen'}
      </button>
    </div>
  );
}
