import type { GuidedHelpPack, HelpPersonaId } from '../../types/content';
import { unwrapJsonModule } from '../jsonModule';

function loadPacksForFolder(
  modules: Record<string, { default: GuidedHelpPack } | GuidedHelpPack>,
): Map<string, GuidedHelpPack> {
  const packs = new Map<string, GuidedHelpPack>();
  for (const mod of Object.values(modules)) {
    const pack = unwrapJsonModule(mod);
    packs.set(pack.challengeId, pack);
  }
  return packs;
}

const uilModules = import.meta.glob<{ default: GuidedHelpPack } | GuidedHelpPack>(
  './uil/*.json',
  { eager: true },
);

const detectiveModules = import.meta.glob<{ default: GuidedHelpPack } | GuidedHelpPack>(
  './detective/*.json',
  { eager: true },
);

const PACKS_BY_PERSONA: Record<HelpPersonaId, Map<string, GuidedHelpPack>> = {
  uil: loadPacksForFolder(uilModules),
  detective: loadPacksForFolder(detectiveModules),
  pitstop: new Map(),
};

export const GUIDED_HELP_UIL = PACKS_BY_PERSONA.uil;

/** Pack voor persona; valt terug op uil als persona-pack ontbreekt. */
export function getGuidedHelpPack(
  challengeId: string,
  personaId: HelpPersonaId = 'uil',
): GuidedHelpPack | undefined {
  const primary = PACKS_BY_PERSONA[personaId]?.get(challengeId);
  if (primary) return primary;
  if (personaId !== 'uil') {
    return PACKS_BY_PERSONA.uil.get(challengeId);
  }
  return undefined;
}

export function getGuidedHelpPacksForPersona(
  personaId: HelpPersonaId,
): ReadonlyMap<string, GuidedHelpPack> {
  return PACKS_BY_PERSONA[personaId] ?? PACKS_BY_PERSONA.uil;
}
