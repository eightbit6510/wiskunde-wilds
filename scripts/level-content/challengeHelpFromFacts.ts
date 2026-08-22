/**
 * Bouwt echte Uil-hulp uit challenge-hints i.p.v. generieke “lees nog eens”-stappen.
 */
import type { ChallengeDefinition, GuidedHelpPack } from '../../src/types/content';
import type { BonusVariant } from '../../src/types';
import {
  buildGuidedHelpPack,
  readQuestionStep,
  owlStep,
  recipeStep,
  mcBonus,
  numBonus,
  type HelpDifficulty,
  type HelpStep,
} from './guidedHelpBuilder';

function answerLabel(challenge: ChallengeDefinition): string {
  if (challenge.type === 'true-false') {
    return challenge.answer === true || challenge.answer === 'true' ? 'Waar' : 'Onwaar';
  }
  if (Array.isArray(challenge.answer)) {
    return challenge.answer.join(', ');
  }
  if (challenge.answerOptions?.length) {
    const opt = challenge.answerOptions.find((o) => o.id === String(challenge.answer));
    if (opt) return opt.label;
  }
  return String(challenge.answer ?? '');
}

function wrongAnswerLabel(challenge: ChallengeDefinition, correct: string): string {
  if (challenge.type === 'true-false') {
    return correct === 'Waar' ? 'Onwaar' : 'Waar';
  }
  if (challenge.answerOptions?.length) {
    const other = challenge.answerOptions.find((o) => o.id !== String(challenge.answer));
    if (other) return other.label;
  }
  if (typeof challenge.answer === 'number') {
    return String(challenge.answer + (challenge.answer === 0 ? 1 : 1));
  }
  return 'Iets anders';
}

function shortTask(question: string): string {
  const cleaned = question.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= 72) return cleaned;
  return `${cleaned.slice(0, 69)}…`;
}

function bonusForChallenge(challenge: ChallengeDefinition): BonusVariant[] {
  const id = challenge.id;
  const label = answerLabel(challenge);

  if (typeof challenge.answer === 'number') {
    const a = challenge.answer;
    return [
      numBonus(
        `${id}-b1`,
        `Zelfde soort som: wat is het antwoord? (hint: ${challenge.hint1 ?? 'denk stap voor stap'})`,
        a,
        challenge.explanation ?? `Het antwoord is ${a}.`,
      ),
      numBonus(
        `${id}-b2`,
        `Controle: klopt ${a}? Reken na — wat krijg je?`,
        a,
        challenge.hint2 ?? challenge.explanation ?? `Ja: ${a}.`,
      ),
    ];
  }

  if (challenge.answerOptions?.length) {
    const correctId = String(challenge.answer);
    return [
      mcBonus(
        `${id}-b1`,
        'Welke uitwerking past bij deze som?',
        correctId,
        challenge.answerOptions.slice(0, 4),
        challenge.explanation ?? `Juist: ${label}.`,
      ),
      mcBonus(
        `${id}-b2`,
        'Wat was het antwoord?',
        'yes',
        [
          { id: 'yes', label },
          { id: 'no', label: wrongAnswerLabel(challenge, label) },
        ],
        challenge.explanation ?? `Het antwoord is ${label}.`,
      ),
    ];
  }

  return [
    mcBonus(
      `${id}-b1`,
      'Welke tip helpt het meest?',
      'a',
      [
        { id: 'a', label: challenge.hint1?.slice(0, 60) || 'Werk stap voor stap' },
        { id: 'b', label: 'Raad zonder te rekenen' },
      ],
      challenge.hint1 ?? 'Stap voor stap.',
    ),
    mcBonus(
      `${id}-b2`,
      'Wat is het antwoord?',
      'a',
      [
        { id: 'a', label },
        { id: 'b', label: wrongAnswerLabel(challenge, label) },
      ],
      challenge.explanation ?? `Antwoord: ${label}.`,
    ),
  ];
}

/**
 * Echte hulp: doel → strategie (hint1) → tussenstap (hint2) → antwoord.
 */
export function helpFromChallenge(
  challenge: ChallengeDefinition,
  difficulty: HelpDifficulty,
  intro: string,
  taskLabel?: string,
  wrongTaskLabel = 'Iets willekeurigs raden',
): GuidedHelpPack {
  const task = taskLabel ?? shortTask(challenge.question);
  const hint1 = challenge.hint1?.trim() || 'Kijk wat gegeven is en wat je zoekt.';
  const hint2 = challenge.hint2?.trim() || 'Werk de som stap voor stap uit.';
  const explanation =
    challenge.explanation?.trim() || `${hint1}\n\n${hint2}\n\nAntwoord: ${answerLabel(challenge)}.`;
  const correct = answerLabel(challenge);
  const wrong = wrongAnswerLabel(challenge, correct);

  const steps: HelpStep[] = [
    readQuestionStep(task, wrongTaskLabel),
    owlStep(
      `Stap 2: strategie.\n\n${hint1}`,
      'Welke aanpak past hier?',
      [
        { id: 'good', label: hint1.length > 70 ? `${hint1.slice(0, 67)}…` : hint1 },
        { id: 'bad', label: 'Meteen een getal invullen zonder uitwerken' },
      ],
      'good',
      'Goed — zo pakken we het aan.',
      'Lees de tip nog eens. Wat is de eerste echte rekenstap?',
    ),
    owlStep(
      `Stap 3: uitwerken.\n\n${hint2}`,
      'Klopt deze tussenstap / tip?',
      [
        { id: 'yes', label: hint2.length > 70 ? `${hint2.slice(0, 67)}…` : hint2 },
        { id: 'no', label: 'Nee, ik sla de tussenstap over' },
      ],
      'yes',
      'Precies. Nu kun je het antwoord afronden.',
      'Gebruik de tip: werk eerst deze tussenstap af.',
    ),
  ];

  if (difficulty >= 3) {
    steps.push(
      recipeStep(
        explanation,
        `Wat is het antwoord?`,
        [
          { id: 'a', label: correct },
          { id: 'b', label: wrong },
        ],
        'a',
        `Super! Antwoord: ${correct}.`,
      ),
    );
  } else {
    steps.push(
      owlStep(
        `Stap 4: het antwoord.\n\n${explanation}`,
        'Wat is het juiste antwoord?',
        [
          { id: 'a', label: correct },
          { id: 'b', label: wrong },
        ],
        'a',
        `Klopt! Antwoord: ${correct}.`,
        `Denk terug aan de tips. Het antwoord is ${correct}.`,
      ),
    );
  }

  return buildGuidedHelpPack(
    challenge.id,
    intro,
    steps,
    `Pootafdruk! 🐾 ${correct}`,
    bonusForChallenge(challenge),
    difficulty,
  );
}
