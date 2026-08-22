import type { HelpPersona, HelpPersonaId } from '../../types/content';
import detectiveJson from './detective.json';
import pitstopJson from './pitstop.json';
import uilJson from './uil.json';
import { unwrapJsonModule } from '../jsonModule';

const PERSONAS: Record<HelpPersonaId, HelpPersona> = {
  uil: unwrapJsonModule(uilJson) as HelpPersona,
  detective: unwrapJsonModule(detectiveJson) as HelpPersona,
  pitstop: unwrapJsonModule(pitstopJson) as HelpPersona,
};

export function getHelpPersona(id: HelpPersonaId): HelpPersona {
  return PERSONAS[id];
}

export function getHelpPersonaOrDefault(id: string): HelpPersona {
  if (id in PERSONAS) return PERSONAS[id as HelpPersonaId];
  return PERSONAS.uil;
}

export { PERSONAS as HELP_PERSONAS };
