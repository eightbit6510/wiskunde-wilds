import { useEffect, useMemo, useState } from 'react';
import { HelpMascot } from '../guided-help/HelpMascot';
import type { ProgressApi } from '../../hooks/useProgress';
import type { SettingsApi } from '../../hooks/useSettings';
import type { PlayerAuthApi } from '../../hooks/usePlayerAuth';
import type { ProgressState } from '../../types';
import type { ClassLevel } from '../../types/content';
import { validateDisplayName, validatePin } from '../../utils/playerValidation';
import { PinCodeInput } from './PinCodeInput';
import {
  type AuthWizardMode,
  type AuthWizardStep,
  CLASS_LEVEL_GROUPS,
  getClassOnlySteps,
  getGuidePersona,
  getLoginSteps,
  getRegisterSteps,
  getStepIndex,
  getWizardSpeech,
} from './authWizardCopy';

interface PlayerAuthWizardProps {
  open: boolean;
  onClose: () => void;
  initialMode?: AuthWizardMode | null;
  /** Alleen jaargroep kiezen (geen cloud account) */
  classOnly?: boolean;
  authApi: PlayerAuthApi;
  progressApi: ProgressApi;
  settingsApi: SettingsApi;
  progress: ProgressState;
}

function stepsForMode(mode: AuthWizardMode | null, classOnly: boolean): AuthWizardStep[] {
  if (classOnly) return getClassOnlySteps();
  if (mode === 'login') return getLoginSteps();
  if (mode === 'register') return getRegisterSteps();
  return ['choose-mode'];
}

export function PlayerAuthWizard({
  open,
  onClose,
  initialMode = null,
  classOnly = false,
  authApi,
  progressApi,
  settingsApi,
  progress,
}: PlayerAuthWizardProps) {
  const { register, login, checkName, session, updatePrefs, syncToCloud } = authApi;
  const { applyProgress } = progressApi;
  const { settings, update: updateSettings } = settingsApi;

  const persona = useMemo(() => getGuidePersona(progress), [progress.part2Unlocked]);

  const [mode, setMode] = useState<AuthWizardMode | null>(initialMode);
  const [step, setStep] = useState<AuthWizardStep>(
    classOnly ? 'class' : initialMode ? 'name' : 'choose-mode',
  );
  const [displayName, setDisplayName] = useState('');
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [classLevel, setClassLevel] = useState<ClassLevel | ''>('');
  const [nameHint, setNameHint] = useState<string | null>(null);
  const [nameSuggestion, setNameSuggestion] = useState<string | null>(null);
  const [nameAvailable, setNameAvailable] = useState<boolean | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const steps = stepsForMode(mode, classOnly);
  const stepIndex = getStepIndex(steps, step);
  const trimmedName = displayName.trim();
  const speech = getWizardSpeech({ step, mode, persona, displayName, nameHint, classOnly });

  useEffect(() => {
    if (!open) return;
    setMode(initialMode);
    setStep(classOnly ? 'class' : initialMode ? 'name' : 'choose-mode');
    setDisplayName('');
    setPin('');
    setPinConfirm('');
    setClassLevel('');
    setNameHint(null);
    setNameSuggestion(null);
    setNameAvailable(null);
    setFormError(null);
    setBusy(false);
  }, [open, initialMode, classOnly]);

  useEffect(() => {
    if (!open || step !== 'name' || mode !== 'register' || trimmedName.length < 2) {
      setNameHint(null);
      setNameSuggestion(null);
      setNameAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      const nameError = validateDisplayName(trimmedName);
      if (nameError) {
        setNameHint(nameError);
        setNameSuggestion(null);
        setNameAvailable(null);
        return;
      }

      try {
        const result = await checkName(trimmedName);
        if (result.configured === false) {
          setNameHint('Cloud save is nog niet actief op de server.');
          setNameAvailable(null);
          return;
        }
        if (result.available) {
          setNameHint('Mooie naam — die is nog vrij!');
          setNameSuggestion(null);
          setNameAvailable(true);
        } else {
          setNameHint('Hmm, die naam is al bezet.');
          setNameSuggestion(result.suggestion ?? null);
          setNameAvailable(false);
        }
      } catch {
        setNameHint(null);
        setNameAvailable(null);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [open, step, mode, trimmedName, checkName]);

  if (!open) return null;

  const goNext = async () => {
    setFormError(null);

    if (step === 'choose-mode') return;
    if (step === 'name') {
      const nameError = validateDisplayName(trimmedName);
      if (nameError) return setFormError(nameError);
      if (mode === 'register' && nameAvailable === false) {
        return setFormError('Kies een andere naam of gebruik het voorstel.');
      }
      setStep('pin');
      return;
    }
    if (step === 'pin') {
      const pinError = validatePin(pin);
      if (pinError) return setFormError(pinError);
      if (mode === 'login') {
        await submitLogin();
        return;
      }
      setStep('pin-confirm');
      return;
    }
    if (step === 'pin-confirm') {
      const pinError = validatePin(pinConfirm);
      if (pinError) return setFormError(pinError);
      if (pin !== pinConfirm) return setFormError('De codes komen niet overeen. Probeer het nog eens.');
      setStep('class');
      return;
    }
    if (step === 'class') {
      if (!classLevel) return setFormError('Kies je jaargroep — dat bepaalt welke sommen je krijgt.');
      if (classOnly) {
        const next = classLevel as ClassLevel;
        updateSettings({ classLevel: next });
        // Speelpad gebruikt cloud-prefs boven lokale settings — sync beide.
        if (session) {
          updatePrefs({ classLevel: next });
          void syncToCloud({
            progress,
            settings: { ...settings, classLevel: next },
            classLevel: next,
          });
        }
        setStep('success');
        return;
      }
      await submitRegister();
    }
  };

  const goBack = () => {
    setFormError(null);
    if (classOnly) {
      onClose();
      return;
    }
    if (step === 'name') {
      setStep('choose-mode');
      setMode(null);
      return;
    }
    if (step === 'pin') setStep('name');
    if (step === 'pin-confirm') setStep('pin');
    if (step === 'class') setStep('pin-confirm');
  };

  const submitRegister = async () => {
    setBusy(true);
    try {
      await register({
        displayName: trimmedName,
        pin,
        classLevel: classLevel as ClassLevel,
        localProgress: progress,
      });
      updateSettings({ classLevel: classLevel as ClassLevel });
      setStep('success');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Registreren mislukt.');
    } finally {
      setBusy(false);
    }
  };

  const submitLogin = async () => {
    setBusy(true);
    try {
      const result = await login({
        displayName: trimmedName,
        pin,
        localProgress: progress,
      });
      applyProgress(result.mergedProgress);
      if (result.prefs.settings) {
        settingsApi.update(result.prefs.settings);
      }
      // Houd lokale jaargroep gelijk aan cloud (speelpad leest prefs eerst).
      updateSettings({ classLevel: result.prefs.classLevel ?? null });
      setStep('success');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Inloggen mislukt. Kloppen je naam en code?');
    } finally {
      setBusy(false);
    }
  };

  const chooseMode = (nextMode: AuthWizardMode) => {
    setMode(nextMode);
    setStep('name');
    setFormError(null);
  };

  const finish = () => {
    onClose();
  };

  return (
    <div
      className={`completion-modal auth-wizard-backdrop ${persona.themeClass ?? ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-wizard-title"
      onClick={(event) => {
        if (event.target === event.currentTarget && step !== 'success') onClose();
      }}
    >
      <div className="auth-wizard-card">
        <div className="auth-wizard-header">
          <HelpMascot persona={persona} size={88} mood="happy" className="float" />
          <div className="auth-wizard-speech">
            <p>{speech}</p>
          </div>
        </div>

        {step !== 'choose-mode' && step !== 'success' && (
          <div className="auth-wizard-progress" aria-hidden="true">
            {steps
              .filter((item) => item !== 'choose-mode' && item !== 'success')
              .map((item, index) => (
                <span
                  key={item}
                  className={`auth-wizard-dot${index <= stepIndex - 1 ? ' active' : ''}${
                    index === stepIndex - 1 ? ' current' : ''
                  }`}
                />
              ))}
          </div>
        )}

        <div className="auth-wizard-body">
          {step === 'choose-mode' && (
            <>
              <h2 id="auth-wizard-title">Bewaar je avontuur</h2>
              <p className="muted">Zo kun je later verder spelen — op dit apparaat of een andere.</p>
              <div className="auth-wizard-choice-grid">
                <button type="button" className="auth-wizard-choice" onClick={() => chooseMode('register')}>
                  <span className="auth-wizard-choice-emoji">🌱</span>
                  <strong>Ik begin nieuw</strong>
                  <span className="muted">Kies een naam en geheime code</span>
                </button>
                <button type="button" className="auth-wizard-choice" onClick={() => chooseMode('login')}>
                  <span className="auth-wizard-choice-emoji">🗺️</span>
                  <strong>Ik kom terug</strong>
                  <span className="muted">Log in met je naam en code</span>
                </button>
              </div>
            </>
          )}

          {step === 'name' && (
            <>
              <h2 id="auth-wizard-title">
                {mode === 'login' ? 'Welkom terug!' : 'Hoe heet je?'}
              </h2>
              <label className="auth-wizard-field" htmlFor="auth-wizard-name">
                <span>Jouw avonturennaam</span>
                <input
                  id="auth-wizard-name"
                  className="auth-wizard-input"
                  type="text"
                  autoComplete="off"
                  autoFocus
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Bijv. Sam"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') void goNext();
                  }}
                />
              </label>
              {nameHint && (
                <p className={`auth-wizard-hint${nameAvailable === false ? ' warn' : ' ok'}`}>
                  {nameHint}{' '}
                  {nameSuggestion && (
                    <button
                      type="button"
                      className="btn btn-ghost auth-wizard-inline-btn"
                      onClick={() => setDisplayName(nameSuggestion)}
                    >
                      Probeer {nameSuggestion}
                    </button>
                  )}
                </p>
              )}
            </>
          )}

          {step === 'pin' && (
            <>
              <h2 id="auth-wizard-title">
                {mode === 'login' ? `Hoi ${trimmedName}!` : 'Je geheime code'}
              </h2>
              <PinCodeInput
                idPrefix="auth-pin"
                value={pin}
                onChange={setPin}
                autoFocus
                disabled={busy}
                label={mode === 'login' ? 'Typ je geheime code' : 'Kies 4 cijfers'}
              />
            </>
          )}

          {step === 'pin-confirm' && (
            <>
              <h2 id="auth-wizard-title">Nog één keer, {trimmedName}</h2>
              <PinCodeInput
                idPrefix="auth-pin-confirm"
                value={pinConfirm}
                onChange={setPinConfirm}
                autoFocus
                disabled={busy}
                label="Herhaal je geheime code"
              />
            </>
          )}

          {step === 'class' && (
            <>
              <h2 id="auth-wizard-title">In welke jaargroep zit je?</h2>
              <p className="muted">Kies wat het best past — je sommen en uil-hulp sluiten daarop aan.</p>
              {CLASS_LEVEL_GROUPS.map((group) => (
                <div key={group.label} className="auth-wizard-class-section">
                  <p className="auth-wizard-class-group-label">{group.label}</p>
                  <div className="auth-wizard-class-grid">
                    {group.levels.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        className={`auth-wizard-class${classLevel === opt.value ? ' selected' : ''}`}
                        onClick={() => setClassLevel(opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

          {step === 'success' && (
            <>
              <h2 id="auth-wizard-title">Gelukt!</h2>
              <p className="lead">{speech}</p>
              <button type="button" className="btn btn-large" onClick={finish}>
                Naar mijn avontuur
              </button>
            </>
          )}

          {formError && <p className="auth-wizard-error">{formError}</p>}
        </div>

        {step !== 'choose-mode' && step !== 'success' && (
          <div className="auth-wizard-actions">
            <button type="button" className="btn btn-ghost" disabled={busy} onClick={goBack}>
              Terug
            </button>
            <button type="button" className="btn btn-large" disabled={busy} onClick={() => void goNext()}>
              {busy ? 'Even geduld…' : step === 'class' ? (classOnly ? 'Start avontuur' : 'Opslaan') : step === 'pin' && mode === 'login' ? 'Inloggen' : 'Verder'}
            </button>
          </div>
        )}

        {step === 'choose-mode' && (
          <div className="auth-wizard-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Later
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
