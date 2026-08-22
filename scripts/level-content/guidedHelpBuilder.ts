import type { ChallengeDefinition, GuidedHelpPack } from '../../src/types/content';
import type { BonusVariant } from '../../src/types';

export type HelpDifficulty = 1 | 2 | 3;
export type HelpStep = NonNullable<GuidedHelpPack['guidedHelp']['steps']>[number];

export function owlStep(
  explanation: string,
  question: string,
  options: { id: string; label: string }[],
  correctAnswer: string,
  successFeedback: string,
  retryFeedback: string,
): HelpStep {
  return { explanation, question, options, correctAnswer, successFeedback, retryFeedback };
}

/** Stap 1 bij elke som: wat moet je doen? */
export function readQuestionStep(task: string, wrongTask: string): HelpStep {
  return owlStep(
    'Begin altijd zo: lees rustig wat er precies gevraagd wordt.\n\nGeen haast — eerst snappen, dan rekenen.',
    'Wat moet je in deze som doen?',
    [
      { id: 'task', label: task },
      { id: 'wrong', label: wrongTask },
    ],
    'task',
    'Goed! Nu weten we het doel.',
    'Lees de vraag nog eens. Wat wordt er echt gevraagd?',
  );
}

/** Laatste stap ★3: stappenplan + antwoord */
export function recipeStep(
  recipe: string,
  question: string,
  options: { id: string; label: string }[],
  correctAnswer: string,
  successFeedback: string,
): HelpStep {
  return owlStep(
    `Stappenplan voor dit type som:\n${recipe}`,
    question,
    options,
    correctAnswer,
    successFeedback,
    'Volg het stappenplan stap voor stap.',
  );
}

export function buildGuidedHelpPack(
  challengeId: string,
  intro: string,
  steps: HelpStep[],
  conclusion: string,
  bonusVariants: BonusVariant[],
  difficulty: HelpDifficulty,
): GuidedHelpPack {
  const minSteps = difficulty >= 3 ? 4 : 3;
  if (steps.length < minSteps) {
    throw new Error(
      `Guided help for ${challengeId} (★${difficulty}) needs ≥${minSteps} steps, got ${steps.length}`,
    );
  }
  return {
    challengeId,
    personaId: 'uil',
    guidedHelp: { intro, steps, conclusion },
    bonusVariants,
  };
}

export function mcBonus(
  id: string,
  question: string,
  answer: string,
  options: { id: string; label: string }[],
  explanation: string,
): BonusVariant {
  return {
    id,
    type: 'multiple-choice',
    question,
    answer,
    answerOptions: options,
    hint1: 'Lees de vraag rustig. Wat wordt er precies gevraagd?',
    hint2: explanation.split('\n')[0] ?? explanation,
    explanation,
  };
}

export function numBonus(id: string, question: string, answer: number, explanation: string): BonusVariant {
  return {
    id,
    type: 'number-input',
    question,
    answer,
    hint1: 'Schrijf je tussenstappen op.',
    hint2: explanation.split('\n')[0] ?? explanation,
    explanation,
  };
}

function standardBonuses(
  id: string,
  b1: BonusVariant,
  b2: BonusVariant,
): BonusVariant[] {
  return [
    { ...b1, id: `${id}-b1` },
    { ...b2, id: `${id}-b2` },
  ];
}

/** Breuken optellen → decimaal */
export function helpForBreuken(
  id: string,
  difficulty: HelpDifficulty,
  f1: string,
  f2: string,
  commonDen: number,
  simpNum: number,
  simpDen: number,
  fracSum: string,
  answer: number,
): GuidedHelpPack {
  const steps: HelpStep[] = [
    readQuestionStep(
      `${f1} en ${f2} optellen (als kommagetal)`,
      'Tellers en noemers direct bij elkaar optellen',
    ),
    owlStep(
      `Stap 2: maak de noemers gelijk.\n\n${f1} en ${f2} hebben verschillende noemers.`,
      `Welke gemeenschappelijke noemer gebruiken we?`,
      [
        { id: 'yes', label: String(commonDen) },
        { id: 'no', label: String(commonDen + 1) },
      ],
      'yes',
      `Goed. Beide breuken krijgen noemer ${commonDen}.`,
      'Vermenigvuldig beide noemers — dat geeft een gemeenschappelijke noemer.',
    ),
    owlStep(
      `Stap 3: tel de tellers op.\n\nNoemers zijn gelijk → alleen tellers optellen.`,
      `Wat is ${f1} + ${f2} als breuk?`,
      [
        { id: 'right', label: fracSum },
        { id: 'wrong', label: `${simpNum}/${simpDen + 1}` },
      ],
      'right',
      `Precies: ${fracSum}.`,
      'Tel alleen tellers op als de noemers al gelijk zijn.',
    ),
  ];

  if (difficulty >= 3) {
    steps.push(
      recipeStep(
        `1. Gelijknamig maken (noemer ${commonDen})\n2. Tellers optellen → ${fracSum}\n3. Teller ÷ noemer = kommagetal (${simpNum} ÷ ${simpDen})`,
        `Wat is ${f1} + ${f2} als kommagetal? (${simpNum} ÷ ${simpDen})`,
        [
          { id: 'a', label: String(answer) },
          { id: 'b', label: String(Math.round((answer + 0.5) * 100) / 100) },
        ],
        'a',
        `Super! ${f1} + ${f2} = ${answer}.`,
      ),
    );
  } else {
    steps.push(
      owlStep(
        `Stap 4: schrijf ${fracSum} als kommagetal.\n\nDeel teller door noemer (${simpNum} ÷ ${simpDen}).`,
        `Wat is ${simpNum} ÷ ${simpDen}?`,
        [
          { id: 'a', label: String(answer) },
          { id: 'b', label: String(Math.round((answer + 0.5) * 100) / 100) },
        ],
        'a',
        `Klopt! Het antwoord is ${answer}.`,
        `Reken: ${simpNum} ÷ ${simpDen}.`,
      ),
    );
  }

  return buildGuidedHelpPack(
    id,
    `We gaan ${f1} + ${f2} uitrekenen. Ik leg elke stap uit — jij hoeft alleen mee te denken.`,
    steps,
    `Pootafdruk! 🐾 ${f1} + ${f2} = ${answer}`,
    standardBonuses(
      id,
      numBonus('b1', `Wat is ${f1} + ${f2}? (kommagetal)`, answer, 'Gelijknamig → optellen → delen.'),
      mcBonus('b2', 'Welke breuk is het grootst?', 'b', [
        { id: 'a', label: '1/4' },
        { id: 'b', label: '3/4' },
        { id: 'c', label: '1/3' },
      ], '3/4 is het grootst.'),
    ),
    difficulty,
  );
}

/** Lineaire vergelijking x + a = b */
export function helpForVergelijkingen(
  id: string,
  difficulty: HelpDifficulty,
  a: number,
  b: number,
  x: number,
): GuidedHelpPack {
  const steps: HelpStep[] = [
    readQuestionStep(
      `x zoeken in x + ${a} = ${b}`,
      'x berekenen door alles op te tellen',
    ),
    owlStep(
      `Stap 2: x staat alleen links als +${a} weg is.\n\nWat doe je met +${a}?`,
      `Hoe haal je +${a} weg?`,
      [
        { id: 'sub', label: `${a} aftrekken aan beide kanten` },
        { id: 'add', label: `${a} optellen` },
      ],
      'sub',
      'Juist. Min aan beide kanten houdt de balans.',
      'Om + weg te halen, trek je af — links én rechts.',
    ),
    owlStep(
      `Stap 3: reken uit.\n\nJe weet: x + ${a} = ${b}. Haal +${a} weg → x = ${b} − ${a}.`,
      `Wat is ${b} − ${a}?`,
      [
        { id: 'x', label: String(x) },
        { id: 'wrong', label: String(x + 2) },
      ],
      'x',
      `Goed: x = ${x}.`,
      `Reken uit: ${b} − ${a}.`,
    ),
  ];

  if (difficulty >= 3) {
    steps.push(
      recipeStep(
        `1. Constante (+${a}) naar de andere kant\n2. x = ${b} − ${a} = ${x}\n3. Controle: ${x} + ${a} = ${b}`,
        `Controle: klopt x = ${x}?`,
        [
          { id: 'yes', label: `Ja, ${x} + ${a} = ${b}` },
          { id: 'no', label: 'Nee' },
        ],
        'yes',
        `Perfect! x = ${x} is het antwoord.`,
      ),
    );
  } else {
    steps.push(
      owlStep(
        `Stap 4: controleer je antwoord.`,
        `Past je x-waarde in x + ${a} = ${b}?`,
        [
          { id: 'yes', label: 'Ja, dat klopt' },
          { id: 'no', label: 'Nee' },
        ],
        'yes',
        `Perfect. x = ${x}!`,
        `Reken na: x + ${a} moet ${b} zijn.`,
      ),
    );
  }

  return buildGuidedHelpPack(
    id,
    'Een vergelijking is een weegschaal. Wat je links doet, doe je rechts ook.',
    steps,
    `Pootafdruk! 🐾 x = ${x}`,
    standardBonuses(
      id,
      numBonus('b1', `Los op: x + ${a + 2} = ${b + 2}.`, x, `x = ${b + 2} − ${a + 2} = ${x}.`),
      numBonus('b2', `Los op: x + ${a} = ${b + 5}.`, x + 5, `x = ${b + 5} − ${a}.`),
    ),
    difficulty,
  );
}

/** y = kx tabel herkennen */
export function helpForGrafieken(id: string, difficulty: HelpDifficulty, k: number): GuidedHelpPack {
  const steps: HelpStep[] = [
    readQuestionStep(
      `De juiste tabel bij y = ${k}x kiezen`,
      'Bij elke x steeds 1 optellen bij y',
    ),
    owlStep(
      `Stap 2: y = ${k}x betekent y = ${k} × x.\n\nProbeer x = 1.`,
      `Wat is y als x = 1?`,
      [
        { id: 'k', label: String(k) },
        { id: 'k1', label: String(k + 1) },
      ],
      'k',
      `Goed: y = ${k} × 1 = ${k}.`,
      `Vermenigvuldig: ${k} × 1.`,
    ),
    owlStep(
      `Stap 3: vul nog een paar waarden in.\n\nBereken y voor x = 2 en x = 3.`,
      `Welk patroon past bij y = ${k}x?`,
      [
        { id: 'a', label: `y: ${k}, ${k * 2}, ${k * 3}…` },
        { id: 'b', label: 'y stijgt steeds +1' },
      ],
      'a',
      'Precies — elke y is k keer x.',
      `Tel niet +1, maar ×${k}.`,
    ),
  ];

  if (difficulty >= 3) {
    steps.push(
      recipeStep(
        `1. Formule: y = ${k} × x\n2. Vul x in (1, 2, 3…)\n3. Kies tabel waar y steeds ×${k} is`,
        `Welke tabel hoort bij y = ${k}x?`,
        [
          { id: 'a', label: `x: 1→${k}, 2→${k * 2}, 3→${k * 3}` },
          { id: 'b', label: `x: 1→${k + 1}, 2→${k + 2}…` },
        ],
        'a',
        `Klopt! Antwoord A.`,
      ),
    );
  } else {
    steps.push(
      owlStep(
        `Stap 4: kies de tabel die klopt.`,
        `Welke beschrijving past?`,
        [
          { id: 'a', label: `Elke y is ${k}× de x-waarde` },
          { id: 'b', label: 'Elke y is x + 1' },
        ],
        'a',
        `Goed! y = ${k}x → tabel A.`,
        `Check: bij x=2 moet y=${k * 2}.`,
      ),
    );
  }

  return buildGuidedHelpPack(
    id,
    `Bij y = ${k}x vermenigvuldig je x steeds met ${k}. Zo herken je de juiste tabel.`,
    steps,
    `Pootafdruk! 🐾 y = ${k}x → tabel A klopt.`,
    standardBonuses(
      id,
      mcBonus('b1', 'Welke formule hoort bij y = 3, 6, 9?', 'a', [
        { id: 'a', label: 'y = 3x' },
        { id: 'b', label: 'y = x + 3' },
      ], 'y = 3x: elke y is 3× de x.'),
      mcBonus('b2', `Bij y = ${k}x, wat is y als x = 4?`, 'a', [
        { id: 'a', label: String(k * 4) },
        { id: 'b', label: String(k + 4) },
      ], `y = ${k} × 4 = ${k * 4}.`),
    ),
    difficulty,
  );
}

/** Verhouding p1:p2 */
export function helpForVerbanden(
  id: string,
  difficulty: HelpDifficulty,
  p1: number,
  p2: number,
  given: number,
  factor: number,
  other: number,
): GuidedHelpPack {
  const steps: HelpStep[] = [
    readQuestionStep(
      `Tweede deel vinden bij verhouding ${p1}:${p2}`,
      `De getallen ${p1} en ${p2} direct optellen`,
    ),
    owlStep(
      `Stap 2: verhouding ${p1}:${p2} betekent steeds dezelfde factor.\n\nEerste deel = ${given}.`,
      `Hoeveel keer past ${p1} in ${given}? (schaalfactor)`,
      [
        { id: 'f', label: String(factor) },
        { id: 'w', label: String(factor + 1) },
      ],
      'f',
      `Goed — schaalfactor = ${factor}.`,
      `Deel ${given} door ${p1}.`,
    ),
    owlStep(
      `Stap 3: vermenigvuldig de factor met het tweede deel.`,
      `Tweede deel = ${factor} × ${p2} = ?`,
      [
        { id: 'o', label: String(other) },
        { id: 'w', label: String(other + p2) },
      ],
      'o',
      `Klopt: ${other}.`,
      `Vermenigvuldig je schaalfactor met ${p2}.`,
    ),
  ];

  if (difficulty >= 3) {
    steps.push(
      recipeStep(
        `1. Deel gegeven deel door verhoudingsdeel (${given} ÷ ${p1} = ${factor})\n2. Vermenigvuldig met ander deel (${factor} × ${p2})\n3. Controle: ${given}:${other} = ${p1}:${p2}`,
        `Is het antwoord ${other}?`,
        [
          { id: 'yes', label: `Ja, verhouding klopt` },
          { id: 'no', label: 'Nee' },
        ],
        'yes',
        `Super! De tweede groep is ${other}.`,
      ),
    );
  } else {
    steps.push(
      owlStep(
        `Stap 4: controleer de verhouding.`,
        `Klopt ${given}:${other} = ${p1}:${p2}?`,
        [
          { id: 'yes', label: 'Ja' },
          { id: 'no', label: 'Nee' },
        ],
        'yes',
        `Perfect. Antwoord = ${other}.`,
        `Deel ${given} door ${p1}, vermenigvuldig met ${p2}.`,
      ),
    );
  }

  return buildGuidedHelpPack(
    id,
    'Bij een verhouding vergroten of verklein je beide delen met dezelfde factor.',
    steps,
    `Pootafdruk! 🐾 De tweede deelgroep is ${other}.`,
    standardBonuses(
      id,
      numBonus('b1', `Verhouding ${p1}:${p2}, eerste = ${given + p1}. Tweede?`, other + p2, 'Zelfde schaalfactor.'),
      numBonus('b2', `Verhouding ${p1}:${p2}, eerste = ${given}. Tweede?`, other, `${given} ÷ ${p1} × ${p2}.`),
    ),
    difficulty,
  );
}

/** Algebra: gelijksoortige termen */
export function helpForAlgebra(
  id: string,
  difficulty: HelpDifficulty,
  c1: number,
  c2: number,
  sum: number,
): GuidedHelpPack {
  const steps: HelpStep[] = [
    readQuestionStep(
      `${c1}x + ${c2}x vereenvoudigen`,
      `De getallen ${c1} en ${c2} vermenigvuldigen`,
    ),
    owlStep(
      `Stap 2: beide termen hebben de letter x.\n\nGelijksoortige termen kun je combineren.`,
      `Kun je ${c1}x en ${c2}x optellen?`,
      [
        { id: 'yes', label: 'Ja, beide hebben x' },
        { id: 'no', label: 'Nee' },
      ],
      'yes',
      'Goed — tel de getallen vóór x op.',
      'Kijk naar de letter: beide hebben x.',
    ),
    owlStep(
      `Stap 3: tel coëfficiënten op.\n\nTel de getallen vóór x: ${c1} + ${c2}.`,
      `Wat is ${c1}x + ${c2}x?`,
      [
        { id: 'a', label: `${sum}x` },
        { id: 'b', label: `${c1 * c2}x` },
      ],
      'a',
      `Juist: ${sum}x.`,
      `Tel ${c1} en ${c2} op; x blijft staan.`,
    ),
  ];

  if (difficulty >= 3) {
    steps.push(
      recipeStep(
        `1. Check: zelfde letter? (x)\n2. Tel getallen ervoor op: ${c1}+${c2}=${sum}\n3. Antwoord: ${sum}x`,
        `Welk antwoord hoort bij de som?`,
        [
          { id: 'a', label: `${sum}x` },
          { id: 'c', label: `${sum}` },
        ],
        'a',
        `Top! ${c1}x + ${c2}x = ${sum}x.`,
      ),
    );
  } else {
    steps.push(
      owlStep(
        `Stap 4: kies het juiste antwoord in de som.`,
        `Welke optie klopt?`,
        [
          { id: 'a', label: `${sum}x` },
          { id: 'c', label: `${sum}` },
        ],
        'a',
        `Precies — antwoord A: ${sum}x.`,
        `${c1}x + ${c2}x = (${c1}+${c2})x.`,
      ),
    );
  }

  return buildGuidedHelpPack(
    id,
    'Bij gelijke letters tel je alleen de getallen ervoor op.',
    steps,
    `Pootafdruk! 🐾 ${c1}x + ${c2}x = ${sum}x`,
    standardBonuses(
      id,
      mcBonus('b1', `Vereenvoudig: ${c1 + 1}x + ${c2}x`, 'a', [
        { id: 'a', label: `${sum + 1}x` },
        { id: 'b', label: `${sum + 1}` },
      ], `Tel ${c1 + 1} + ${c2}.`),
      mcBonus('b2', `Vereenvoudig: ${c1}x + ${c2 + 1}x`, 'a', [
        { id: 'a', label: `${sum + 1}x` },
        { id: 'b', label: `${c1 + c2 + 1}x` },
      ], `Tel ${c1} + ${c2 + 1}.`),
    ),
    difficulty,
  );
}

/** Formule A = l × b, zoek b */
export function helpForFormules(
  id: string,
  difficulty: HelpDifficulty,
  area: number,
  length: number,
  width: number,
): GuidedHelpPack {
  const steps: HelpStep[] = [
    readQuestionStep(
      `Breedte vinden (A=${area}, lengte=${length})`,
      'Lengte en breedte optellen',
    ),
    owlStep(
      `Stap 2: formule A = lengte × breedte.\n\nGegeven: A=${area}, lengte=${length}.`,
      `Welke grootte zoek je?`,
      [
        { id: 'b', label: 'Breedte' },
        { id: 'a', label: 'Oppervlakte' },
      ],
      'b',
      'Goed — breedte is onbekend.',
      'Oppervlakte en lengte zijn gegeven.',
    ),
    owlStep(
      `Stap 3: draai de formule om.\n\nBreedte = oppervlakte ÷ lengte.`,
      `${area} ÷ ${length} = ?`,
      [
        { id: 'b', label: String(width) },
        { id: 'w', label: String(width + 1) },
      ],
      'b',
      `Breedte = ${width}.`,
      `Deel ${area} door ${length}.`,
    ),
  ];

  if (difficulty >= 3) {
    steps.push(
      recipeStep(
        `1. Formule: A = l × b\n2. Omdraaien: b = A ÷ l\n3. Controle: ${length} × ${width} = ${area}`,
        `Klopt breedte = ${width}?`,
        [
          { id: 'yes', label: `Ja, ${length}×${width}=${area}` },
          { id: 'no', label: 'Nee' },
        ],
        'yes',
        `Perfect! b = ${width}.`,
      ),
    );
  } else {
    steps.push(
      owlStep(
        `Stap 4: controleer.`,
        `Vermenigvuldig lengte ${length} met je breedte-antwoord. Is het ${area}?`,
        [
          { id: 'yes', label: 'Ja' },
          { id: 'no', label: 'Nee' },
        ],
        'yes',
        `Goed! Breedte = ${width}.`,
        `${length} × ${width} moet ${area} zijn.`,
      ),
    );
  }

  return buildGuidedHelpPack(
    id,
    'Zoek wat onbekend is — draai de formule om.',
    steps,
    `Pootafdruk! 🐾 b = ${width}`,
    standardBonuses(
      id,
      numBonus('b1', `A = ${area + length}, l = ${length}. b = ?`, width + 1, 'Deel oppervlakte door lengte.'),
      numBonus('b2', `A = ${area}, l = ${length}. b = ?`, width, `b = ${area} ÷ ${length}.`),
    ),
    difficulty,
  );
}

/** Machten */
export function helpForMachten(
  id: string,
  difficulty: HelpDifficulty,
  baseNum: number,
  exp: number,
  answer: number,
): GuidedHelpPack {
  const repeated =
    exp === 2
      ? `${baseNum} × ${baseNum}`
      : exp === 3
        ? `${baseNum} × ${baseNum} × ${baseNum}`
        : `${baseNum} vermenigvuldigd ${exp} keer`;

  const steps: HelpStep[] = [
    readQuestionStep(
      `${baseNum}^${exp} uitrekenen`,
      `${baseNum} × ${exp} uitrekenen (dat is fout!)`,
    ),
    owlStep(
      `Stap 2: ${baseNum}^${exp} = ${repeated}.\n\nDe exponent ${exp} telt hoe vaak je vermenigvuldigt.`,
      `Wat betekent de exponent?`,
      [
        { id: 'repeat', label: `${baseNum} ${exp} keer vermenigvuldigen` },
        { id: 'times', label: `${baseNum} × ${exp}` },
      ],
      'repeat',
      'Juist — herhalen, niet × de exponent.',
      'Exponent = aantal keer vermenigvuldigen.',
    ),
    owlStep(
      exp >= 3
        ? `Stap 3: reken stap voor stap.\n\nBegin met ${baseNum} × ${baseNum}, vermenigvuldig daarna verder tot je ${exp} keer hebt.`
        : `Stap 3: reken ${baseNum} × ${baseNum}.`,
      `Wat is ${baseNum}^${exp}?`,
      [
        { id: 'a', label: String(answer) },
        { id: 'b', label: String(baseNum * exp) },
      ],
      'a',
      `Goed: ${baseNum}^${exp} = ${answer}.`,
      `Niet ${baseNum}×${exp}, maar herhaald vermenigvuldigen.`,
    ),
  ];

  if (difficulty >= 3) {
    steps.push(
      recipeStep(
        `1. ${baseNum}^${exp} = ${repeated}\n2. Niet ${baseNum}×${exp}\n3. Antwoord: ${answer}`,
        `Bevestig: ${baseNum}^${exp} = ?`,
        [
          { id: 'a', label: String(answer) },
          { id: 'b', label: String(answer + baseNum) },
        ],
        'a',
        `Klopt! ${baseNum}^${exp} = ${answer}.`,
      ),
    );
  } else {
    steps.push(
      owlStep(
        `Stap 4: antwoord invullen.`,
        `${baseNum}^${exp} = ?`,
        [
          { id: 'a', label: String(answer) },
          { id: 'b', label: String(answer + baseNum) },
        ],
        'a',
        `Super! Antwoord = ${answer}.`,
        `Reken ${repeated} uit.`,
      ),
    );
  }

  return buildGuidedHelpPack(
    id,
    'Macht = hetzelfde getal steeds opnieuw vermenigvuldigen.',
    steps,
    `Pootafdruk! 🐾 ${baseNum}^${exp} = ${answer}`,
    standardBonuses(
      id,
      numBonus('b1', `Bereken: ${baseNum}^${exp + 1}`, answer * baseNum, `Nog ×${baseNum}.`),
      numBonus('b2', `Bereken: ${baseNum}^${exp}`, answer, `${baseNum}^${exp} = ${answer}.`),
    ),
    difficulty,
  );
}

/** Kwadratisch x² = k */
export function helpForKwadratisch(
  id: string,
  difficulty: HelpDifficulty,
  root: number,
  sq: number,
): GuidedHelpPack {
  const steps: HelpStep[] = [
    readQuestionStep(
      `x vinden in x² = ${sq} (x positief)`,
      `x = ${sq} ÷ 2`,
    ),
    owlStep(
      `Stap 2: x² betekent x × x.\n\nWe zoeken: welk getal × zichzelf = ${sq}?`,
      `x² = x × x. Klopt dat?`,
      [
        { id: 'yes', label: 'Ja' },
        { id: 'no', label: 'Nee' },
      ],
      'yes',
      'Goed — kwadraat = keer zichzelf.',
      'x² is niet x×2.',
    ),
    owlStep(
      `Stap 3: welk getal keer zichzelf geeft ${sq}?\n\nReken een paar getallen keer zichzelf.`,
      `${root} × ${root} = ?`,
      [
        { id: 'sq', label: String(sq) },
        { id: 'wrong', label: String(sq + 1) },
      ],
      'sq',
      `Juist: x = ${root}.`,
      `Probeer ${root} × ${root}.`,
    ),
  ];

  if (difficulty >= 3) {
    steps.push(
      recipeStep(
        `1. x² = x × x\n2. Zoek positief getal dat × zichzelf ${sq} geeft\n3. Controleer door te vermenigvuldigen`,
        `Is x = ${root} het antwoord?`,
        [
          { id: 'yes', label: `Ja, positief en klopt` },
          { id: 'no', label: 'Nee' },
        ],
        'yes',
        `Perfect! x = ${root}.`,
      ),
    );
  } else {
    steps.push(
      owlStep(
        `Stap 4: controle.`,
        `x = ${root} positief en ${root}²=${sq}?`,
        [
          { id: 'yes', label: 'Ja' },
          { id: 'no', label: 'Nee' },
        ],
        'yes',
        `Goed! x = ${root}.`,
        `${root} is positief en ${root}²=${sq}.`,
      ),
    );
  }

  return buildGuidedHelpPack(
    id,
    'Bij x² = getal zoek je welk positief getal keer zichzelf dat getal geeft.',
    steps,
    `Pootafdruk! 🐾 x = ${root}`,
    standardBonuses(
      id,
      numBonus('b1', `x² = ${(root + 1) ** 2} (x positief)`, root + 1, 'Zelfde methode.'),
      numBonus('b2', `x² = ${sq} (x positief)`, root, `${root}² = ${sq}.`),
    ),
    difficulty,
  );
}

export interface RedenerenSpec {
  question: string;
  options: { id: string; label: string }[];
  answers: string[];
  explanation: string;
  /** Labels for step-by-step checks, e.g. ['A', 'B'] then final picks from answers */
  checkLabels: string[];
  checkSteps: HelpStep[];
  finalStep: HelpStep;
  bonus: BonusVariant;
  bonus2: BonusVariant;
}

export const REDENEREN_VARIANTS: RedenerenSpec[] = [
  {
    question: 'Welke uitspraken zijn waar? Kies alle juiste.',
    options: [
      { id: 'a', label: 'Een vierkant heeft vier gelijke zijden' },
      { id: 'b', label: 'Elke rechthoek is een vierkant' },
      { id: 'c', label: 'De som van hoeken in een driehoek is 180°' },
      { id: 'd', label: 'Een cirkel heeft vier hoeken' },
    ],
    answers: ['a', 'c'],
    explanation: 'A en C kloppen.\nB: niet elke rechthoek is vierkant.\nD: cirkel heeft geen hoeken.',
    checkLabels: ['A', 'C'],
    checkSteps: [
      owlStep('Uitspraak A: vierkant.', 'Heeft een vierkant vier gelijke zijden?', [{ id: 'yes', label: 'Ja' }, { id: 'no', label: 'Nee' }], 'yes', 'A is waar.', 'Alle zijden even lang.'),
      owlStep('Uitspraak B: elke rechthoek is vierkant.', 'Klopt B?', [{ id: 'yes', label: 'Ja' }, { id: 'no', label: 'Nee' }], 'no', 'B is onwaar.', 'Rechthoek hoeft geen vierkant.'),
      owlStep('Uitspraak C: hoekensom driehoek.', 'Is de som van hoeken in een driehoek 180°?', [{ id: 'yes', label: 'Ja' }, { id: 'no', label: 'Nee' }], 'yes', 'C is waar.', 'Driehoek = altijd 180°.'),
    ],
    finalStep: owlStep('Welke uitspraken zijn waar?', 'Kies alles wat klopt.', [{ id: 'ac', label: 'A en C' }, { id: 'ab', label: 'A en B' }, { id: 'all', label: 'Allemaal' }], 'ac', 'Precies: A en C.', 'B en D kloppen niet.'),
    bonus: mcBonus('b1', 'Welke uitspraak is waar?', 'b', [{ id: 'a', label: 'Alle driehoeken zijn gelijk' }, { id: 'b', label: 'Een driehoek heeft drie hoeken' }, { id: 'c', label: 'Een cirkel is een veelhoek' }], 'Driehoek heeft drie hoeken.'),
    bonus2: mcBonus('b2', 'Is een vierkant een rechthoek?', 'a', [{ id: 'a', label: 'Ja' }, { id: 'b', label: 'Nee' }], 'Vierkant is een rechthoek met 4 gelijke zijden.'),
  },
  {
    question: 'Welke uitspraken zijn waar? Kies alle juiste.',
    options: [
      { id: 'a', label: '12 is deelbaar door 3' },
      { id: 'b', label: '12 is deelbaar door 5' },
      { id: 'c', label: '15 is deelbaar door 3' },
      { id: 'd', label: '10 is deelbaar door 4' },
    ],
    answers: ['a', 'c'],
    explanation: 'A: 12÷3=4. C: 15÷3=5. B en D kloppen niet.',
    checkLabels: ['A', 'C'],
    checkSteps: [
      owlStep('Deelbaar = exact delen zonder rest.', 'Is 12 deelbaar door 3?', [{ id: 'yes', label: 'Ja, 12÷3=4' }, { id: 'no', label: 'Nee' }], 'yes', 'A is waar.', '12÷3=4.'),
      owlStep('Check B: 12÷5.', '12÷5 = 2 rest 2. Klopt B?', [{ id: 'yes', label: 'Ja' }, { id: 'no', label: 'Nee' }], 'no', 'B is onwaar.', 'Geen rest = deelbaar.'),
      owlStep('Check C: 15÷3.', 'Is 15 deelbaar door 3?', [{ id: 'yes', label: 'Ja, 15÷3=5' }, { id: 'no', label: 'Nee' }], 'yes', 'C is waar.', '15÷3=5.'),
    ],
    finalStep: owlStep('Welke zijn waar?', 'Kies alles wat klopt.', [{ id: 'ac', label: 'A en C' }, { id: 'ab', label: 'A en B' }, { id: 'bd', label: 'B en D' }], 'ac', 'A en C kloppen.', 'Alleen A en C.'),
    bonus: mcBonus('b1', 'Is 18 deelbaar door 3?', 'a', [{ id: 'a', label: 'Ja' }, { id: 'b', label: 'Nee' }], '18÷3=6.'),
    bonus2: mcBonus('b2', 'Is 14 deelbaar door 4?', 'b', [{ id: 'a', label: 'Ja' }, { id: 'b', label: 'Nee' }], '14÷4=3 rest 2.'),
  },
  {
    question: 'Welke uitspraken zijn waar? Kies alle juiste.',
    options: [
      { id: 'a', label: 'De omtrek van een vierkant met zijde 3 is 12' },
      { id: 'b', label: 'De omtrek van een vierkant met zijde 3 is 9' },
      { id: 'c', label: 'De oppervlakte van een rechthoek 4×5 is 20' },
      { id: 'd', label: 'De oppervlakte van 4×5 is 9' },
    ],
    answers: ['a', 'c'],
    explanation: 'A: omtrek 4×3=12. C: oppervlakte 4×5=20.',
    checkLabels: ['A', 'C'],
    checkSteps: [
      owlStep('Omtrek = som zijden. Oppervlakte = l×b.', 'Vierkant zijde 3: omtrek=4×3. Klopt A?', [{ id: 'yes', label: 'Ja, 12' }, { id: 'no', label: 'Nee' }], 'yes', 'A klopt.', '4×3=12.'),
      owlStep('B zegt omtrek=9. Dat is 3×3 = oppervlakte.', 'Klopt B?', [{ id: 'yes', label: 'Ja' }, { id: 'no', label: 'Nee' }], 'no', 'B is onwaar.', '9 is oppervlakte, geen omtrek.'),
      owlStep('C: oppervlakte 4×5.', 'Is oppervlakte 4×5 = 20?', [{ id: 'yes', label: 'Ja' }, { id: 'no', label: 'Nee' }], 'yes', 'C klopt.', '4×5=20.'),
    ],
    finalStep: owlStep('Welke uitspraken zijn waar?', 'Kies de juiste.', [{ id: 'ac', label: 'A en C' }, { id: 'ab', label: 'A en B' }, { id: 'bc', label: 'B en C' }], 'ac', 'A en C kloppen.', 'B verwart omtrek/oppervlakte.'),
    bonus: mcBonus('b1', 'Oppervlakte 6×4?', 'a', [{ id: 'a', label: '24' }, { id: 'b', label: '20' }], '6×4=24.'),
    bonus2: mcBonus('b2', 'Omtrek vierkant zijde 5?', 'a', [{ id: 'a', label: '20' }, { id: 'b', label: '25' }], '4×5=20.'),
  },
  {
    question: 'Welke uitspraken zijn waar? Kies alle juiste.',
    options: [
      { id: 'a', label: '1/2 is groter dan 1/4' },
      { id: 'b', label: '1/4 is groter dan 1/2' },
      { id: 'c', label: '2/3 is kleiner dan 1/2' },
      { id: 'd', label: '3/4 is groter dan 1/2' },
    ],
    answers: ['a', 'd'],
    explanation: 'A en D kloppen. 1/2>1/4 en 3/4>1/2.',
    checkLabels: ['A', 'D'],
    checkSteps: [
      owlStep('Vergelijk breuken.', 'Is 1/2 groter dan 1/4?', [{ id: 'yes', label: 'Ja' }, { id: 'no', label: 'Nee' }], 'yes', 'A is waar.', 'Half > kwart.'),
      owlStep('B zegt 1/4 > 1/2.', 'Klopt B?', [{ id: 'yes', label: 'Ja' }, { id: 'no', label: 'Nee' }], 'no', 'B is onwaar.', 'Kwart < half.'),
      owlStep('D: is 3/4 > 1/2?', 'Is 3/4 groter dan 1/2?', [{ id: 'yes', label: 'Ja' }, { id: 'no', label: 'Nee' }], 'yes', 'D is waar.', '3/4 = 0,75 > 0,5.'),
    ],
    finalStep: owlStep('Welke zijn waar?', 'Kies alles.', [{ id: 'ad', label: 'A en D' }, { id: 'ab', label: 'A en B' }, { id: 'cd', label: 'C en D' }], 'ad', 'A en D kloppen.', 'B en C zijn omgekeerd.'),
    bonus: mcBonus('b1', 'Groter: 2/3 of 1/2?', 'a', [{ id: 'a', label: '2/3' }, { id: 'b', label: '1/2' }], '2/3 > 1/2.'),
    bonus2: mcBonus('b2', 'Groter: 1/3 of 1/4?', 'a', [{ id: 'a', label: '1/3' }, { id: 'b', label: '1/4' }], '1/3 > 1/4.'),
  },
  {
    question: 'Welke uitspraken zijn waar? Kies alle juiste.',
    options: [
      { id: 'a', label: '0 is een even getal' },
      { id: 'b', label: '0 is een oneven getal' },
      { id: 'c', label: 'De som van twee oneven getallen is even' },
      { id: 'd', label: 'De som van twee even getallen is oneven' },
    ],
    answers: ['a', 'c'],
    explanation: 'A en C kloppen. 0 is even. Oneven+oneven=even.',
    checkLabels: ['A', 'C'],
    checkSteps: [
      owlStep('Even = deelbaar door 2.', 'Is 0 deelbaar door 2?', [{ id: 'yes', label: 'Ja, 0÷2=0' }, { id: 'no', label: 'Nee' }], 'yes', 'A is waar.', '0 is even.'),
      owlStep('B: 0 oneven?', 'Klopt B?', [{ id: 'yes', label: 'Ja' }, { id: 'no', label: 'Nee' }], 'no', 'B is onwaar.', '0 is even, niet oneven.'),
      owlStep('C: oneven+oneven. Bijv. 3+5=8.', 'Is som van twee oneven getallen even?', [{ id: 'yes', label: 'Ja' }, { id: 'no', label: 'Nee' }], 'yes', 'C is waar.', 'Oneven+oneven=even.'),
    ],
    finalStep: owlStep('Welke zijn waar?', 'Kies de juiste.', [{ id: 'ac', label: 'A en C' }, { id: 'bd', label: 'B en D' }, { id: 'ad', label: 'A en D' }], 'ac', 'A en C kloppen.', 'B en D niet.'),
    bonus: mcBonus('b1', 'Is 7 oneven?', 'a', [{ id: 'a', label: 'Ja' }, { id: 'b', label: 'Nee' }], '7 niet deelbaar door 2.'),
    bonus2: mcBonus('b2', 'Is 4+6 even of oneven?', 'a', [{ id: 'a', label: 'Even' }, { id: 'b', label: 'Oneven' }], '4+6=10, even.'),
  },
  {
    question: 'Welke uitspraken zijn waar? Kies alle juiste.',
    options: [
      { id: 'a', label: 'Een rechte hoek is 90°' },
      { id: 'b', label: 'Een rechte hoek is 180°' },
      { id: 'c', label: 'Een gestrekte hoek is 180°' },
      { id: 'd', label: 'Drie rechte hoeken passen in een driehoek' },
    ],
    answers: ['a', 'c'],
    explanation: 'A: 90°. C: 180°. D klopt niet.',
    checkLabels: ['A', 'C'],
    checkSteps: [
      owlStep('Rechte hoek = hoek van een vierkant.', 'Hoeveel graden?', [{ id: '90', label: '90°' }, { id: '180', label: '180°' }], '90', 'A is waar.', 'Rechte hoek = 90°.'),
      owlStep('B zegt rechte hoek = 180°.', 'Klopt B?', [{ id: 'yes', label: 'Ja' }, { id: 'no', label: 'Nee' }], 'no', 'B is onwaar.', '180° = gestrekte hoek.'),
      owlStep('C: gestrekte hoek.', 'Hoeveel graden?', [{ id: '90', label: '90°' }, { id: '180', label: '180°' }], '180', 'C is waar.', 'Gestrekte hoek = 180°.'),
    ],
    finalStep: owlStep('Welke zijn waar?', 'Kies alles.', [{ id: 'ac', label: 'A en C' }, { id: 'ab', label: 'A en B' }, { id: 'bd', label: 'B en D' }], 'ac', 'A en C kloppen.', 'B verwart hoeken.'),
    bonus: mcBonus('b1', 'Rechte hoek in graden?', 'a', [{ id: 'a', label: '90°' }, { id: 'b', label: '45°' }], '90°.'),
    bonus2: mcBonus('b2', 'Gestrekte hoek?', 'b', [{ id: 'a', label: '90°' }, { id: 'b', label: '180°' }], '180°.'),
  },
  {
    question: 'Welke uitspraken zijn waar? Kies alle juiste.',
    options: [
      { id: 'a', label: '50% van 20 is 10' },
      { id: 'b', label: '50% van 20 is 5' },
      { id: 'c', label: '25% van 20 is 5' },
      { id: 'd', label: '10% van 100 is 10' },
    ],
    answers: ['a', 'c', 'd'],
    explanation: 'A: 50% van 20=10. C: 25% van 20=5. D: 10% van 100=10.',
    checkLabels: ['A', 'C', 'D'],
    checkSteps: [
      owlStep('50% = de helft.', 'Is 50% van 20 gelijk aan 10?', [{ id: 'yes', label: 'Ja, 20÷2=10' }, { id: 'no', label: 'Nee' }], 'yes', 'A is waar.', '50% = halveren.'),
      owlStep('B: 50% van 20 = 5?', 'Klopt B?', [{ id: 'yes', label: 'Ja' }, { id: 'no', label: 'Nee' }], 'no', 'B is onwaar.', '50% van 20 is 10.'),
      owlStep('C: 25% van 20. 25% = 1/4.', 'Is 25% van 20 = 5?', [{ id: 'yes', label: 'Ja' }, { id: 'no', label: 'Nee' }], 'yes', 'C is waar.', '20÷4=5.'),
    ],
    finalStep: owlStep('Welke zijn waar?', 'Kies alles.', [{ id: 'acd', label: 'A, C en D' }, { id: 'ac', label: 'Alleen A en C' }, { id: 'ab', label: 'A en B' }], 'acd', 'A, C en D kloppen.', 'B klopt niet.'),
    bonus: mcBonus('b1', '50% van 30?', 'a', [{ id: 'a', label: '15' }, { id: 'b', label: '10' }], '30÷2=15.'),
    bonus2: mcBonus('b2', '10% van 50?', 'a', [{ id: 'a', label: '5' }, { id: 'b', label: '10' }], '50÷10=5.'),
  },
  {
    question: 'Welke uitspraken zijn waar? Kies alle juiste.',
    options: [
      { id: 'a', label: '−3 + 5 = 2' },
      { id: 'b', label: '−3 + 5 = −8' },
      { id: 'c', label: '4 − 7 = −3' },
      { id: 'd', label: '4 − 7 = 3' },
    ],
    answers: ['a', 'c'],
    explanation: 'A: −3+5=2. C: 4−7=−3.',
    checkLabels: ['A', 'C'],
    checkSteps: [
      owlStep('Bij optellen: van −3 naar rechts.', 'Wat is −3 + 5?', [{ id: '2', label: '2' }, { id: 'm8', label: '−8' }], '2', 'A is waar.', '−3+5=2.'),
      owlStep('B zegt −3+5=−8.', 'Klopt B?', [{ id: 'yes', label: 'Ja' }, { id: 'no', label: 'Nee' }], 'no', 'B is onwaar.', 'Je gaat omhoog, niet verder omlaag.'),
      owlStep('C: 4 − 7. Onder nul.', 'Wat is 4 − 7?', [{ id: 'm3', label: '−3' }, { id: '3', label: '3' }], 'm3', 'C is waar.', '4−7=−3.'),
    ],
    finalStep: owlStep('Welke zijn waar?', 'Kies alles.', [{ id: 'ac', label: 'A en C' }, { id: 'ab', label: 'A en B' }, { id: 'cd', label: 'C en D' }], 'ac', 'A en C kloppen.', 'B en D niet.'),
    bonus: mcBonus('b1', '−5 + 8 = ?', 'a', [{ id: 'a', label: '3' }, { id: 'b', label: '−3' }], '−5+8=3.'),
    bonus2: mcBonus('b2', '2 − 6 = ?', 'b', [{ id: 'a', label: '4' }, { id: 'b', label: '−4' }], '2−6=−4.'),
  },
  {
    question: 'Welke uitspraken zijn waar? Kies alle juiste.',
    options: [
      { id: 'a', label: 'Het gemiddelde van 2, 4 en 6 is 4' },
      { id: 'b', label: 'Het gemiddelde van 2, 4 en 6 is 6' },
      { id: 'c', label: 'De mediaan van 1, 3, 9 is 3' },
      { id: 'd', label: 'De mediaan van 1, 3, 9 is 9' },
    ],
    answers: ['a', 'c'],
    explanation: 'A: (2+4+6)÷3=4. C: middelste waarde=3.',
    checkLabels: ['A', 'C'],
    checkSteps: [
      owlStep('Gemiddelde = som ÷ aantal.', '(2+4+6)÷3 = ?', [{ id: '4', label: '4' }, { id: '6', label: '6' }], '4', 'A is waar.', '12÷3=4.'),
      owlStep('B zegt gemiddelde=6.', 'Klopt B?', [{ id: 'yes', label: 'Ja' }, { id: 'no', label: 'Nee' }], 'no', 'B is onwaar.', 'Gemiddelde is 4.'),
      owlStep('Mediaan = middelste getal (gesorteerd).', 'Mediaan van 1,3,9?', [{ id: '3', label: '3' }, { id: '9', label: '9' }], '3', 'C is waar.', 'Middelste = 3.'),
    ],
    finalStep: owlStep('Welke zijn waar?', 'Kies alles.', [{ id: 'ac', label: 'A en C' }, { id: 'ab', label: 'A en B' }, { id: 'bd', label: 'B en D' }], 'ac', 'A en C kloppen.', 'B en D niet.'),
    bonus: mcBonus('b1', 'Gemiddelde van 5 en 15?', 'a', [{ id: 'a', label: '10' }, { id: 'b', label: '20' }], '(5+15)÷2=10.'),
    bonus2: mcBonus('b2', 'Mediaan van 2, 5, 8?', 'b', [{ id: 'a', label: '2' }, { id: 'b', label: '5' }], 'Middelste = 5.'),
  },
  {
    question: 'Welke uitspraken zijn waar? Kies alle juiste.',
    options: [
      { id: 'a', label: '6 is een veelvoud van 3' },
      { id: 'b', label: '6 is een veelvoud van 4' },
      { id: 'c', label: '15 is een veelvoud van 5' },
      { id: 'd', label: '15 is een veelvoud van 6' },
    ],
    answers: ['a', 'c'],
    explanation: 'A: 6=2×3. C: 15=3×5.',
    checkLabels: ['A', 'C'],
    checkSteps: [
      owlStep('Veelvoud = keer tafel.', 'Is 6 = 2 × 3?', [{ id: 'yes', label: 'Ja' }, { id: 'no', label: 'Nee' }], 'yes', 'A is waar.', '6 is veelvoud van 3.'),
      owlStep('B: 6 veelvoud van 4?', '6÷4 exact?', [{ id: 'yes', label: 'Ja' }, { id: 'no', label: 'Nee' }], 'no', 'B is onwaar.', '6÷4 gaat niet exact.'),
      owlStep('C: 15 veelvoud van 5?', '15÷5 = 3?', [{ id: 'yes', label: 'Ja' }, { id: 'no', label: 'Nee' }], 'yes', 'C is waar.', '15=3×5.'),
    ],
    finalStep: owlStep('Welke zijn waar?', 'Kies alles.', [{ id: 'ac', label: 'A en C' }, { id: 'ab', label: 'A en B' }, { id: 'cd', label: 'C en D' }], 'ac', 'A en C kloppen.', 'B en D niet.'),
    bonus: mcBonus('b1', '8 veelvoud van 2?', 'a', [{ id: 'a', label: 'Ja' }, { id: 'b', label: 'Nee' }], '8=4×2.'),
    bonus2: mcBonus('b2', '10 veelvoud van 3?', 'b', [{ id: 'a', label: 'Ja' }, { id: 'b', label: 'Nee' }], '10÷3 niet exact.'),
  },
  {
    question: 'Welke uitspraken zijn waar? Kies alle juiste.',
    options: [
      { id: 'a', label: '1 km = 1000 m' },
      { id: 'b', label: '1 km = 100 m' },
      { id: 'c', label: '1 uur = 60 minuten' },
      { id: 'd', label: '1 uur = 100 minuten' },
    ],
    answers: ['a', 'c'],
    explanation: 'A en C zijn standaard eenheden.',
    checkLabels: ['A', 'C'],
    checkSteps: [
      owlStep('Kilometer en meter.', '1 km = 1000 m?', [{ id: 'yes', label: 'Ja' }, { id: 'no', label: 'Nee' }], 'yes', 'A is waar.', 'kilo = duizend.'),
      owlStep('B: 1 km = 100 m?', 'Klopt B?', [{ id: 'yes', label: 'Ja' }, { id: 'no', label: 'Nee' }], 'no', 'B is onwaar.', '1 km = 1000 m.'),
      owlStep('Tijd: uur en minuten.', '1 uur = 60 min?', [{ id: 'yes', label: 'Ja' }, { id: 'no', label: 'Nee' }], 'yes', 'C is waar.', '1 uur = 60 minuten.'),
    ],
    finalStep: owlStep('Welke zijn waar?', 'Kies alles.', [{ id: 'ac', label: 'A en C' }, { id: 'ab', label: 'A en B' }, { id: 'cd', label: 'C en D' }], 'ac', 'A en C kloppen.', 'B en D niet.'),
    bonus: mcBonus('b1', '2 km = ? meter', 'a', [{ id: 'a', label: '2000' }, { id: 'b', label: '200' }], '2×1000=2000.'),
    bonus2: mcBonus('b2', '30 min = ? uur', 'b', [{ id: 'a', label: '1 uur' }, { id: 'b', label: '0,5 uur' }], '30 min = halve uur.'),
  },
  {
    question: 'Welke uitspraken zijn waar? Kies alle juiste.',
    options: [
      { id: 'a', label: 'In een parallellogram zijn tegenoverliggende zijden even lang' },
      { id: 'b', label: 'In een parallellogram zijn alle zijden even lang' },
      { id: 'c', label: 'Een ruit heeft vier gelijke zijden' },
      { id: 'd', label: 'Een ruit heeft altijd rechte hoeken' },
    ],
    answers: ['a', 'c'],
    explanation: 'A en C kloppen. B geldt alleen voor ruit/vierkant. D: ruit hoeft geen rechte hoeken.',
    checkLabels: ['A', 'C'],
    checkSteps: [
      owlStep('Parallellogram: tegenover elkaar.', 'Tegenoverliggende zijden even lang?', [{ id: 'yes', label: 'Ja' }, { id: 'no', label: 'Nee' }], 'yes', 'A is waar.', 'Eigenschap parallellogram.'),
      owlStep('B: alle zijden even lang?', 'Geldt dat voor elk parallellogram?', [{ id: 'yes', label: 'Ja' }, { id: 'no', label: 'Nee' }], 'no', 'B is onwaar.', 'Alleen ruit/vierkant.'),
      owlStep('C: ruit.', 'Heeft een ruit vier gelijke zijden?', [{ id: 'yes', label: 'Ja' }, { id: 'no', label: 'Nee' }], 'yes', 'C is waar.', 'Ruit = 4 gelijke zijden.'),
    ],
    finalStep: owlStep('Welke zijn waar?', 'Kies alles.', [{ id: 'ac', label: 'A en C' }, { id: 'ab', label: 'A en B' }, { id: 'cd', label: 'C en D' }], 'ac', 'A en C kloppen.', 'B en D niet.'),
    bonus: mcBonus('b1', 'Vierkant is een ruit?', 'a', [{ id: 'a', label: 'Ja' }, { id: 'b', label: 'Nee' }], 'Vierkant is speciale ruit.'),
    bonus2: mcBonus('b2', 'Ruit altijd rechte hoeken?', 'b', [{ id: 'a', label: 'Ja' }, { id: 'b', label: 'Nee' }], 'Alleen vierkant heeft rechte hoeken.'),
  },
];

/** Redeneren-varianten passend per basisschooljaar */
export const REDENEREN_GROEP6 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
export const REDENEREN_GROEP7 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

/** Groep 6: breuken met gelijke noemer → antwoord als breuk */
export function helpForBreukenGelijknamig(
  id: string,
  difficulty: HelpDifficulty,
  f1: string,
  f2: string,
  den: number,
  n1: number,
  n2: number,
  fracSum: string,
  wrongFrac: string,
): GuidedHelpPack {
  const steps: HelpStep[] = [
    readQuestionStep(
      `${f1} + ${f2} uitrekenen`,
      'Teller en noemer van beide breuken bij elkaar optellen',
    ),
    owlStep(
      `Stap 2: kijk naar de noemer (onderste getal).\n\nBij ${f1} en ${f2} is die overal ${den}.`,
      'Hebben beide breuken dezelfde noemer?',
      [
        { id: 'yes', label: `Ja, beide hebben noemer ${den}` },
        { id: 'no', label: 'Nee, de noemers zijn verschillend' },
      ],
      'yes',
      'Goed! Dan hoef je de noemer niet te veranderen.',
      'Kijk onderaan de breuk: het getal onder de streep.',
    ),
    owlStep(
      `Stap 3: tel alleen de tellers op.\n\nTel ${n1} + ${n2}. De noemer ${den} blijft staan.`,
      `Wat is ${f1} + ${f2}?`,
      [
        { id: 'right', label: fracSum },
        { id: 'wrong', label: wrongFrac },
      ],
      'right',
      `Precies! Het antwoord is ${fracSum}.`,
      `Tel ${n1} + ${n2} = ${n1 + n2}. Noemer blijft ${den}.`,
    ),
    owlStep(
      `Stap 4: kies je antwoord in de som.`,
      `Welke breuk is ${f1} + ${f2}?`,
      [
        { id: 'right', label: fracSum },
        { id: 'wrong', label: wrongFrac },
      ],
      'right',
      `Super! ${f1} + ${f2} = ${fracSum}.`,
      `Tel de bovenste getallen: ${n1} + ${n2}.`,
    ),
  ];

  return buildGuidedHelpPack(
    id,
    `We tellen ${f1} en ${f2} op. Beide stukken hebben dezelfde noemer — dat maakt het makkelijker.`,
    steps,
    `Pootafdruk! 🐾 ${f1} + ${f2} = ${fracSum}`,
    standardBonuses(
      id,
      mcBonus('b1', `Wat is 1/${den} + 2/${den}?`, 'a', [
        { id: 'a', label: `3/${den}` },
        { id: 'b', label: `3/${den * 2}` },
      ], `Tel tellers: 1+2=3, noemer blijft ${den}.`),
      mcBonus('b2', 'Welke is groter: 1/2 of 1/4?', 'a', [
        { id: 'a', label: '1/2' },
        { id: 'b', label: '1/4' },
      ], 'Half is groter dan kwart.'),
    ),
    difficulty,
  );
}

/** Groep 7: breuken met verschillende noemers → antwoord als breuk */
export function helpForBreukenAlsBreuk(
  id: string,
  difficulty: HelpDifficulty,
  f1: string,
  f2: string,
  commonDen: number,
  fracSum: string,
  wrongFrac: string,
): GuidedHelpPack {
  const steps: HelpStep[] = [
    readQuestionStep(
      `${f1} + ${f2} uitrekenen (antwoord als breuk)`,
      'Tellers en noemers direct optellen zonder gelijknamig maken',
    ),
    owlStep(
      `Stap 2: eerst gelijknamig maken.\n\nZoek een noemer die bij beide breuken past. Hier: ${commonDen}.`,
      `Welke noemer gebruiken we?`,
      [
        { id: 'yes', label: String(commonDen) },
        { id: 'no', label: String(commonDen + 1) },
      ],
      'yes',
      `Goed — beide breuken krijgen noemer ${commonDen}.`,
      'Vermenigvuldig boven en onder zodat de noemers gelijk worden.',
    ),
    owlStep(
      `Stap 3: tel de tellers op.\n\nNoemers zijn gelijk → alleen bovenste getallen optellen.`,
      `Wat is ${f1} + ${f2} als breuk?`,
      [
        { id: 'right', label: fracSum },
        { id: 'wrong', label: wrongFrac },
      ],
      'right',
      `Klopt: ${fracSum}.`,
      'Tel alleen de tellers op als de noemers al gelijk zijn.',
    ),
    owlStep(
      `Stap 4: kies het goede antwoord.`,
      `Welke breuk hoort bij de som?`,
      [
        { id: 'right', label: fracSum },
        { id: 'wrong', label: wrongFrac },
      ],
      'right',
      `Helemaal goed! Antwoord = ${fracSum}.`,
      'Eerst gelijknamig, dan tellers optellen.',
    ),
  ];

  return buildGuidedHelpPack(
    id,
    `Bij ${f1} + ${f2} maken we eerst de noemers gelijk. Daarna tel je de tellers op.`,
    steps,
    `Pootafdruk! 🐾 ${f1} + ${f2} = ${fracSum}`,
    standardBonuses(
      id,
      mcBonus('b1', `Wat is 1/2 + 1/4?`, 'a', [
        { id: 'a', label: '3/4' },
        { id: 'b', label: '2/6' },
      ], 'Gelijknamig: 2/4 + 1/4 = 3/4.'),
      mcBonus('b2', 'Welke breuk is het grootst?', 'b', [
        { id: 'a', label: '1/4' },
        { id: 'b', label: '3/4' },
      ], '3/4 is het grootst.'),
    ),
    difficulty,
  );
}

/** Groep 6: ontbrekend getal i.p.v. x */
export function helpForOntbrekendGetal(
  id: string,
  difficulty: HelpDifficulty,
  left: number,
  right: number,
  missing: number,
  missingFirst: boolean,
): GuidedHelpPack {
  const sumText = missingFirst
    ? `? + ${left} = ${right}`
    : `${left} + ? = ${right}`;
  const steps: HelpStep[] = [
    readQuestionStep(
      `Het ontbrekende getal zoeken in ${sumText}`,
      'Alle getallen bij elkaar optellen',
    ),
    owlStep(
      `Stap 2: wat weten we?\n\n${missingFirst ? `? + ${left}` : `${left} + ?`} moet samen ${right} worden.`,
      `Moet het ontbrekende getal kleiner zijn dan ${right}?`,
      [
        { id: 'yes', label: 'Ja, het is een stukje van ' + right },
        { id: 'no', label: 'Nee, groter dan ' + right },
      ],
      'yes',
      'Goed — je zoekt een deel dat nog ontbreekt.',
      `Samen moet het ${right} worden.`,
    ),
    owlStep(
      `Stap 3: reken terug.\n\nTrek ${left} af van ${right}.`,
      `Wat is ${right} − ${left}?`,
      [
        { id: 'm', label: String(missing) },
        { id: 'w', label: String(missing + 2) },
      ],
      'm',
      `Juist! Het ontbrekende getal is ${missing}.`,
      `Trek ${left} af van ${right}.`,
    ),
    owlStep(
      `Stap 4: controleer.`,
      `Tel je antwoord op bij ${left}. Kom je op ${right}?`,
      [
        { id: 'yes', label: 'Ja, dat klopt' },
        { id: 'no', label: 'Nee' },
      ],
      'yes',
      `Perfect! Het ontbrekende getal is ${missing}.`,
      `Reken na: antwoord + ${left} = ${right}.`,
    ),
  ];

  return buildGuidedHelpPack(
    id,
    'Er ontbreekt een getal. Tel terug: van het totaal haal je het bekende deel af.',
    steps,
    `Pootafdruk! 🐾 Het ontbrekende getal is ${missing}.`,
    standardBonuses(
      id,
      numBonus('b1', `${missing + 1} + ${left} = ?`, right + 1, `${missing + 1} + ${left} = ${right + 1}.`),
      numBonus('b2', `? + ${left} = ${right}`, missing, `${right} − ${left} = ${missing}.`),
    ),
    difficulty,
  );
}

/** Groep 6/7: tabel / verdubbelen zonder formule y=kx */
export function helpForTabelGroep(
  id: string,
  difficulty: HelpDifficulty,
  unitLabel: string,
  unitPrice: number,
  count: number,
  total: number,
): GuidedHelpPack {
  const steps: HelpStep[] = [
    readQuestionStep(
      `Uitrekenen wat ${count} ${unitLabel} kosten`,
      'Het aantal en de prijs bij elkaar optellen',
    ),
    owlStep(
      `Stap 2: 1 ${unitLabel.slice(0, -1) || unitLabel} kost ${unitPrice} euro.\n\nElke extra ${unitLabel.slice(0, -1) || unitLabel} kost weer ${unitPrice} euro.`,
      `Kost elke ${unitLabel.slice(0, -1) || unitLabel} evenveel?`,
      [
        { id: 'yes', label: `Ja, steeds ${unitPrice} euro` },
        { id: 'no', label: 'Nee, elke keer anders' },
      ],
      'yes',
      'Goed — je mag vermenigvuldigen.',
      `1 stuk = ${unitPrice} euro.`,
    ),
    owlStep(
      `Stap 3: vermenigvuldig.\n\n${count} keer ${unitPrice} euro.`,
      `Wat kosten ${count} ${unitLabel}?`,
      [
        { id: 't', label: `${total} euro` },
        { id: 'w', label: `${total + unitPrice} euro` },
      ],
      't',
      `Klopt: ${total} euro.`,
      `Reken: ${count} keer ${unitPrice}.`,
    ),
    owlStep(
      `Stap 4: welke tabel klopt?`,
      `Bij ${count} ${unitLabel} betaal je…`,
      [
        { id: 'a', label: `${total} euro` },
        { id: 'b', label: `${total + 2} euro` },
      ],
      'a',
      `Precies — ${count} × ${unitPrice} = ${total} euro.`,
      `${count} keer ${unitPrice} euro.`,
    ),
  ];

  return buildGuidedHelpPack(
    id,
    `We lezen een tabel: 1 ${unitLabel.slice(0, -1) || unitLabel} = ${unitPrice} euro. Hoeveel kosten ${count}?`,
    steps,
    `Pootafdruk! 🐾 ${count} ${unitLabel} = ${total} euro`,
    standardBonuses(
      id,
      numBonus('b1', `1 ${unitLabel.slice(0, -1) || unitLabel} = ${unitPrice} euro. ${count + 1} stuks?`, total + unitPrice, `Nog ${unitPrice} euro erbij.`),
      numBonus('b2', `${count} × ${unitPrice} = ?`, total, `${count} keer ${unitPrice}.`),
    ),
    difficulty,
  );
}

/** Groep 6: herhaalde optelling i.p.v. algebra */
export function helpForHerhaaldeOptelling(
  id: string,
  difficulty: HelpDifficulty,
  groups: number,
  each: number,
  total: number,
): GuidedHelpPack {
  const sumParts = Array.from({ length: groups }, () => String(each)).join(' + ');
  const steps: HelpStep[] = [
    readQuestionStep(
      `${groups} keer ${each} optellen`,
      `${groups} en ${each} vermenigvuldigen zonder reden`,
    ),
    owlStep(
      `Stap 2: ${groups} groepjes van elk ${each}.\n\nDat is: ${sumParts}.`,
      `Is dit hetzelfde als ${groups} × ${each}?`,
      [
        { id: 'yes', label: 'Ja' },
        { id: 'no', label: 'Nee' },
      ],
      'yes',
      'Goed — herhaald optellen = vermenigvuldigen.',
      `${groups} keer hetzelfde getal.`,
    ),
    owlStep(
      `Stap 3: tel op (of gebruik de tafel van ${each}).`,
      `Wat is ${groups} × ${each}?`,
      [
        { id: 't', label: String(total) },
        { id: 'w', label: String(total + each) },
      ],
      't',
      `Juist: ${total}.`,
      `${sumParts} = ${total}.`,
    ),
    owlStep(
      `Stap 4: kies het antwoord.`,
      `${sumParts} = ?`,
      [
        { id: 't', label: String(total) },
        { id: 'w', label: String(total - 1) },
      ],
      't',
      `Top! Antwoord = ${total}.`,
      `Reken ${groups} × ${each}.`,
    ),
  ];

  return buildGuidedHelpPack(
    id,
    `Je telt ${each} een paar keer op. Dat mag ook als vermenigvuldiging: ${groups} × ${each}.`,
    steps,
    `Pootafdruk! 🐾 ${groups} × ${each} = ${total}`,
    standardBonuses(
      id,
      numBonus('b1', `${groups + 1} × ${each} = ?`, total + each, `Nog één groepje van ${each}.`),
      numBonus('b2', `${groups} × ${each} = ?`, total, `${groups} keer ${each}.`),
    ),
    difficulty,
  );
}

/** Groep 6: verhouding in gewone taal */
export function helpForVerbandenBasis(
  id: string,
  difficulty: HelpDifficulty,
  p1: number,
  p2: number,
  given: number,
  factor: number,
  other: number,
  context: string,
): GuidedHelpPack {
  const steps: HelpStep[] = [
    readQuestionStep(
      `Bij ${context}: ${p2} horen bij ${p1}, nu ${given} gegeven`,
      `${p1} en ${p2} gewoon bij elkaar optellen`,
    ),
    owlStep(
      `Stap 2: verhouding ${p1}:${p2} betekent steeds dezelfde verhouding.\n\nEerst deel je ${given} door ${p1}.`,
      `Hoeveel keer past ${p1} in ${given}?`,
      [
        { id: 'f', label: String(factor) },
        { id: 'w', label: String(factor + 1) },
      ],
      'f',
      `Goed — dat is ${factor} keer.`,
      `Deel ${given} door ${p1}.`,
    ),
    owlStep(
      `Stap 3: vermenigvuldig met ${p2}.`,
      `${factor} × ${p2} = ?`,
      [
        { id: 'o', label: String(other) },
        { id: 'w', label: String(other + p2) },
      ],
      'o',
      `Klopt: ${other}.`,
      `Vermenigvuldig je schaalfactor met ${p2}.`,
    ),
    owlStep(
      `Stap 4: controle.`,
      `Klopt ${given}:${other} = ${p1}:${p2}?`,
      [
        { id: 'yes', label: 'Ja' },
        { id: 'no', label: 'Nee' },
      ],
      'yes',
      `Super! Antwoord = ${other}.`,
      `Deel eerst, dan vermenigvuldig.`,
    ),
  ];

  return buildGuidedHelpPack(
    id,
    `Bij ${context} geldt: voor elke ${p1} horen ${p2}. Zoek eerst hoe vaak ${p1} in ${given} past.`,
    steps,
    `Pootafdruk! 🐾 Het antwoord is ${other}.`,
    standardBonuses(
      id,
      numBonus('b1', `${context}: ${p1}:${p2}, eerste = ${given + p1}. Tweede?`, other + p2, 'Zelfde stap: delen en vermenigvuldigen.'),
      numBonus('b2', `${context}: eerste = ${given}. Tweede?`, other, `${given} ÷ ${p1} × ${p2}.`),
    ),
    difficulty,
  );
}

export function helpForRedeneren(
  id: string,
  difficulty: HelpDifficulty,
  variantIndex: number,
  variantPool?: number[],
): {
  challenge: Pick<ChallengeDefinition, 'question' | 'answerOptions' | 'answers' | 'explanation'>;
  help: GuidedHelpPack;
} {
  const pool = variantPool ?? REDENEREN_VARIANTS.map((_, i) => i);
  const spec = REDENEREN_VARIANTS[pool[variantIndex % pool.length] ?? 0];
  const steps: HelpStep[] = [
    readQuestionStep(
      'Alle juiste uitspraken kiezen',
      'Slechts één antwoord kiezen',
    ),
    ...spec.checkSteps,
    spec.finalStep,
  ];

  if (difficulty >= 3) {
    steps.push(
      recipeStep(
        `1. Lees uitspraak A, B, C en D\n2. Zet bij elke: waar of onwaar?\n3. Kies alles wat waar is`,
        `Welke letters kloppen?`,
        [
          {
            id: 'ans',
            label: spec.answers.map((x) => x.toUpperCase()).join(' en '),
          },
          { id: 'wrong', label: 'Alleen de eerste' },
        ],
        'ans',
        `Helemaal goed! ${spec.answers.map((x) => x.toUpperCase()).join(' en ')} zijn waar.`,
      ),
    );
  }

  return {
    challenge: {
      question: spec.question,
      answerOptions: spec.options,
      answers: spec.answers,
      explanation: spec.explanation,
    },
    help: buildGuidedHelpPack(
      id,
      'Lees elke zin apart. Vraag steeds: klopt dit echt? Geen haast.',
      steps,
      `Pootafdruk! 🐾 ${spec.answers.map((x) => x.toUpperCase()).join(', ')} zijn waar.`,
      [
        { ...spec.bonus, id: `${id}-b1` },
        { ...spec.bonus2, id: `${id}-b2` },
      ],
      difficulty,
    ),
  };
}

/** Valideer help-kwaliteit */
export function validateHelpPack(pack: GuidedHelpPack, difficulty: HelpDifficulty): string[] {
  const issues: string[] = [];
  const steps = pack.guidedHelp.steps;
  const minSteps = difficulty >= 3 ? 4 : 3;
  if (steps.length < minSteps) {
    issues.push(`${pack.challengeId}: fewer than ${minSteps} steps (★${difficulty})`);
  }
  for (const step of steps) {
    if (typeof step.question !== 'string' || !step.question.trim()) {
      issues.push(`${pack.challengeId}: step missing question`);
    }
    if (!step.options?.length) issues.push(`${pack.challengeId}: step missing options`);
    if (!step.correctAnswer) issues.push(`${pack.challengeId}: step missing correctAnswer`);
    if (!step.explanation?.trim()) issues.push(`${pack.challengeId}: step missing explanation`);
  }
  if ((pack.bonusVariants?.length ?? 0) < 2) {
    issues.push(`${pack.challengeId}: fewer than 2 bonus variants`);
  }
  return issues;
}
