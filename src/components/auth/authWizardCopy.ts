import type { ProgressState } from '../../types';
import type { ClassLevel, HelpPersona } from '../../types/content';
import { getHelpPersona } from '../../content/personas';

export type AuthWizardMode = 'register' | 'login';

export type AuthWizardStep =
  | 'choose-mode'
  | 'name'
  | 'pin'
  | 'pin-confirm'
  | 'class'
  | 'success';

export function getGuidePersona(progress: ProgressState): HelpPersona {
  return getHelpPersona(progress.part2Unlocked ? 'detective' : 'uil');
}

export function getGuideName(persona: HelpPersona): string {
  switch (persona.id) {
    case 'detective':
      return 'de Detective';
    case 'pitstop':
      return 'de Pitstop-mechanic';
    default:
      return 'de Uil';
  }
}

export function getWizardSpeech(input: {
  step: AuthWizardStep;
  mode: AuthWizardMode | null;
  persona: HelpPersona;
  displayName: string;
  nameHint?: string | null;
}): string {
  const { step, mode, persona, displayName, nameHint } = input;
  const guide = getGuideName(persona);
  const name = displayName.trim();

  switch (step) {
    case 'choose-mode':
      return `Hoi! Ik ben ${guide}. Wil je je avontuur bewaren zodat je het later verder kunt spelen?`;
    case 'name':
      if (mode === 'login') {
        return `Welkom terug! Ik ben ${guide}. Typ hieronder je avonturennaam.`;
      }
      return `Leuk dat je meedoet! Hoe mag ik je noemen?`;
    case 'pin':
      if (mode === 'login' && name) {
        return `Fijn je weer te zien, ${name}! Typ je geheime code.`;
      }
      if (name) {
        return `${name}, verzin een geheime code van 4 cijfers. Onthoud hem goed!`;
      }
      return 'Verzin een geheime code van 4 cijfers.';
    case 'pin-confirm':
      return name
        ? `${name}, typ je code nog één keer zodat we zeker weten dat je hem onthoudt.`
        : 'Typ je code nog één keer.';
    case 'class':
      return name
        ? `${name}, in welke groep zit je? Dat mag je ook overslaan.`
        : 'In welke groep zit je? Dat mag je overslaan.';
    case 'success':
      if (mode === 'login' && name) {
        return `Top ${name}! Je avontuur staat klaar. Veel plezier in Wiskunde Wilds!`;
      }
      if (name) {
        return `Super ${name}! Vanaf nu bewaren we je sterren en voortgang veilig.`;
      }
      return 'Je avontuur wordt bewaard. Veel plezier!';
    default:
      if (nameHint) return nameHint;
      return persona.helpModalSubtitle;
  }
}

export const CLASS_OPTIONS: { value: ClassLevel; label: string }[] = [
  { value: 'groep-7', label: 'Groep 7' },
  { value: 'groep-8', label: 'Groep 8' },
  { value: 'vwo2', label: 'VWO 2' },
  { value: 'vwo3', label: 'VWO 3' },
];

export function getRegisterSteps(): AuthWizardStep[] {
  return ['choose-mode', 'name', 'pin', 'pin-confirm', 'class', 'success'];
}

export function getLoginSteps(): AuthWizardStep[] {
  return ['choose-mode', 'name', 'pin', 'success'];
}

export function getStepIndex(steps: AuthWizardStep[], step: AuthWizardStep): number {
  return Math.max(0, steps.indexOf(step));
}
