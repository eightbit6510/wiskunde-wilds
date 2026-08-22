import type { BadgeDefinition } from '../types';

export const badges: BadgeDefinition[] = [
  {
    id: 'algebra-fox',
    name: 'Algebra Fox',
    description: 'Voltooi Het Vossenpad met minstens 10 sterren.',
    emoji: '🦊',
    check: (p) => {
      const stars = Object.entries(p.challengeStars)
        .filter(([id]) => id.startsWith('l1-'))
        .reduce((s, [, v]) => s + v, 0);
      return p.completedLessons.includes('vossenpad') && stars >= 10;
    },
  },
  {
    id: 'equation-tamer',
    name: 'Equation Tamer',
    description: 'Los 5 vergelijkingschallenges op.',
    emoji: '🐺',
    check: (p) =>
      p.attempts.filter((a) => a.correct && a.topic === 'vergelijkingen').length >= 5,
  },
  {
    id: 'graph-tracker',
    name: 'Graph Tracker',
    description: 'Voltooi De Lynx-uitkijk.',
    emoji: '🐈',
    check: (p) => p.completedLessons.includes('lynx'),
  },
  {
    id: 'pattern-hunter',
    name: 'Pattern Hunter',
    description: 'Voltooi Het Uilenlab.',
    emoji: '🦉',
    check: (p) => p.completedLessons.includes('uilenlab'),
  },
  {
    id: 'fraction-hopper',
    name: 'Fraction Hopper',
    description: 'Verdien 8 sterren in Konijnenhol.',
    emoji: '🐇',
    check: (p) => {
      const stars = Object.entries(p.challengeStars)
        .filter(([id]) => id.startsWith('l4-'))
        .reduce((s, [, v]) => s + v, 0);
      return stars >= 8;
    },
  },
  {
    id: 'mountain-runner',
    name: 'Mountain Runner',
    description: 'Open de bergpoort in De Bergmissie.',
    emoji: '⛰️',
    check: (p) => p.completedLessons.includes('bergmissie'),
  },
  {
    id: 'moon-scout',
    name: 'Moon Scout',
    description: 'Ontdek de parabool in Maanlichtvallei.',
    emoji: '🌙',
    check: (p) => p.completedLessons.includes('maanlicht'),
  },
  {
    id: 'star-temple',
    name: 'Temple Champion',
    description: 'Voltooi de Final Challenge.',
    emoji: '⭐',
    check: (p) => p.completedLessons.includes('sterrentempel'),
  },
  {
    id: 'streak-3',
    name: 'Lynx Streak',
    description: 'Haal een sessie-streak van 5.',
    emoji: '🔥',
    check: (p) => p.bestSessionStreak >= 5,
  },
  {
    id: 'star-collector',
    name: 'Star Collector',
    description: 'Verdien 40 sterren in totaal.',
    emoji: '✨',
    check: (p) => p.totalStars >= 40,
  },
  {
    id: 'uilenleerling',
    name: 'Uilenleerling',
    description: 'Je vroeg hulp, begreep de uitleg en deed het daarna zelf.',
    emoji: '🦉',
    check: (p) => p.owlBonusSolved >= 1,
  },
  {
    id: 'schaduwloper',
    name: 'Schaduwloper',
    description: 'Voltooi De Schaduwgrot.',
    emoji: '🌑',
    check: (p) => p.completedLessons.includes('schaduwgrot'),
  },
  {
    id: 'ravenbrein',
    name: 'Ravenbrein',
    description: 'Voltooi Het Ravenpad.',
    emoji: '🪶',
    check: (p) => p.completedLessons.includes('ravenpad'),
  },
  {
    id: 'rivierspeurder',
    name: 'Rivierspeurder',
    description: 'Voltooi De Rivier van Verhoudingen.',
    emoji: '🌊',
    check: (p) => p.completedLessons.includes('rivier'),
  },
  {
    id: 'paraboolspotter',
    name: 'Paraboolspotter',
    description: 'Herken een kwadratisch verband in De Paraboolvallei.',
    emoji: '🌙',
    check: (p) => p.completedLessons.includes('paraboolvallei'),
  },
  {
    id: 'sterrenlezer',
    name: 'Sterrenlezer',
    description: 'Voltooi Het Wolvenobservatorium.',
    emoji: '🐺',
    check: (p) => p.completedLessons.includes('observatorium'),
  },
  {
    id: 'runenkraker',
    name: 'Runenkraker',
    description: 'Ontdek machtsregels in De Runenruïnes.',
    emoji: '🔮',
    check: (p) => p.completedLessons.includes('runenruines'),
  },
  {
    id: 'oude-poot',
    name: 'Oude Poot',
    description: 'Los 10 herhalingsvragen uit Deel 1 goed op.',
    emoji: '🐾',
    check: (p) => p.reviewSolvedCount >= 10,
  },
  {
    id: 'uilenleerling-ii',
    name: 'Uilenleerling II',
    description: 'Los na Uilenhulp meerdere bonusvarianten zelfstandig op.',
    emoji: '🦉',
    check: (p) => p.owlBonusSolved >= 3,
  },
  {
    id: 'nachtwoud-verkenner',
    name: 'Nachtwoud-verkenner',
    description: 'Voltooi De Nachtelijke Eindmissie.',
    emoji: '🌙',
    check: (p) => p.completedLessons.includes('nachtmissie'),
  },
  {
    id: 'wilds-pathfinder',
    name: 'Wilds Pathfinder',
    description: 'Voltooi alle acht gebieden van Het Verborgen Gebied.',
    emoji: '🐾',
    check: (p) =>
      [
        'schaduwgrot',
        'ravenpad',
        'rivier',
        'paraboolvallei',
        'observatorium',
        'runenruines',
        'doolhof',
        'nachtmissie',
      ].every((id) => p.completedLessons.includes(id)),
  },
];
