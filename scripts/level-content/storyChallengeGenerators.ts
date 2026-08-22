/**
 * Verhaal-afgestemde sommen — Deel I & II hard slots.
 * Templates gebaseerd op legacy bos-avontuur (lesson1–8, part2 chapters).
 */
import type { ClassLevel, ChallengeDefinition, GuidedHelpPack } from '../../src/types/content';
import type { HelpDifficulty } from './guidedHelpBuilder';
import { helpFromChallenge } from './challengeHelpFromFacts';
import { bandFor } from './specialChallengeUtils';
import type { StoryChallengeKind } from './storySlots';

function pack(
  id: string,
  difficulty: HelpDifficulty,
  challenge: ChallengeDefinition,
  helpIntro: string,
  taskLabel?: string,
  wrongTaskLabel?: string,
): { challenge: ChallengeDefinition; help: GuidedHelpPack } {
  const full: ChallengeDefinition = {
    ...challenge,
    id,
    difficulty,
    starsAvailable: 3,
    classLevels: [challenge.classLevels![0]],
  };
  return {
    challenge: full,
    help: helpFromChallenge(full, difficulty, helpIntro, taskLabel, wrongTaskLabel),
  };
}

// —— Deel I: Wolvenkluis (formules) ——
function formulaArea(id: string, level: ClassLevel, d: HelpDifficulty) {
  const band = bandFor(level);
  const [A, l, b] = band === 'basis' ? [42, 7, 6] : [56, 8, 7];
  return pack(id, d, {
    id,
    type: 'number-input',
    topic: 'formules',
    difficulty: d,
    starsAvailable: 3,
    question: `A = ℓ × b. Als A = ${A} en ℓ = ${l}, wat is b?`,
    answer: b,
    hint1: 'Deel beide kanten door ℓ: b = A ÷ ℓ.',
    hint2: `b = ${A} ÷ ${l} = ${b}.`,
    explanation: `b = A ÷ ℓ = ${A} ÷ ${l} = ${b}.`,
    classLevels: [level],
  }, 'Oppervlakte = lengte × breedte. Zoek de ontbrekende zijde.');
}

function formulaSpeed(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'multiple-choice',
    topic: 'formules',
    difficulty: d,
    starsAvailable: 3,
    question: 'v = s / t. Welke formule geeft s (afstand)?',
    answer: 'b',
    answerOptions: [
      { id: 'a', label: 's = v / t' },
      { id: 'b', label: 's = v × t' },
      { id: 'c', label: 's = t / v' },
      { id: 'd', label: 's = v + t' },
    ],
    hint1: 'Vermenigvuldig beide kanten van v = s/t met t.',
    hint2: 'v · t = s.',
    explanation: 's = v × t.',
    classLevels: [level],
  }, 'Snelheid × tijd = afstand.');
}

function formulaCost(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'multiple-choice',
    topic: 'formules',
    difficulty: d,
    starsAvailable: 3,
    question: '€12 vaste kosten plus €4 per zak voer. Welke formule voor totale kosten K bij z zakken?',
    answer: 'b',
    answerOptions: [
      { id: 'a', label: 'K = 12z + 4' },
      { id: 'b', label: 'K = 4z + 12' },
      { id: 'c', label: 'K = 12 × 4 × z' },
      { id: 'd', label: 'K = 4 + 12 + z' },
    ],
    hint1: 'Startbedrag 12, daarna +4 per zak.',
    hint2: 'K = 4z + 12.',
    explanation: 'K = 4z + 12.',
    classLevels: [level],
  }, 'Vaste kosten + prijs per stuk.');
}

function formulaRearrangeT(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'text-input',
    topic: 'formules',
    difficulty: d,
    starsAvailable: 3,
    question: 'T = 5n + 20. Geef n in termen van T. (bijv. n = ...)',
    answer: 'n=(T-20)/5',
    acceptedAnswers: ['n=(T-20)/5', 'n=(t-20)/5', 'n=T/5-4'],
    hint1: 'Trek 20 af van beide kanten, deel daarna door 5.',
    hint2: 'n = (T − 20) / 5.',
    explanation: 'n = (T − 20) / 5.',
    classLevels: [level],
  }, 'Maak n vrij in de formule.');
}

function formulaPerimeter(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'number-input',
    topic: 'formules',
    difficulty: d,
    starsAvailable: 3,
    question: 'P = 2ℓ + 2b. P = 30, ℓ = 8. Wat is b?',
    answer: 7,
    hint1: '2ℓ = 16, dus 2b = P − 16.',
    hint2: '2b = 14 → b = 7.',
    explanation: '2·8 + 2b = 30 → 2b = 14 → b = 7.',
    classLevels: [level],
  }, 'Omtrek van een rechthoek.');
}

// —— Deel I: Konijnenhol ——
function fractionCompare(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'multiple-choice',
    topic: 'breuken',
    difficulty: d,
    starsAvailable: 3,
    question: 'Welke breuk is groter: 3/4 of 5/8?',
    answer: 'a',
    answerOptions: [
      { id: 'a', label: '3/4' },
      { id: 'b', label: '5/8' },
      { id: 'gelijk', label: 'Even groot' },
    ],
    hint1: 'Maak gelijke noemers of vergelijk met decimalen.',
    hint2: '3/4 = 6/8 > 5/8.',
    explanation: '3/4 is groter dan 5/8.',
    classLevels: [level],
  }, 'Vergelijk de breuken in het hol.');
}

function fractionAddText(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'text-input',
    topic: 'breuken',
    difficulty: d,
    starsAvailable: 3,
    question: 'Bereken 1/2 + 1/3. Geef als breuk (bijv. 5/6).',
    answer: '5/6',
    hint1: 'Kleinste gemeenschappelijke noemer is 6.',
    hint2: '3/6 + 2/6 = 5/6.',
    explanation: '1/2 + 1/3 = 5/6.',
    classLevels: [level],
  }, 'Tel de breuken op.');
}

function powersCompare(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'multiple-choice',
    topic: 'machten',
    difficulty: d,
    starsAvailable: 3,
    question: 'Wat is groter: 2⁵ of 5²?',
    answer: 'a',
    answerOptions: [
      { id: 'a', label: '2⁵ (= 32)' },
      { id: 'b', label: '5² (= 25)' },
      { id: 'gelijk', label: 'Even groot' },
    ],
    hint1: 'Reken beide uit.',
    hint2: '2⁵ = 32 en 5² = 25.',
    explanation: '2⁵ = 32 > 5² = 25.',
    classLevels: [level],
  }, 'De gemene valkuil: exponent vs grondtal.');
}

function sqrtInput(id: string, level: ClassLevel, d: HelpDifficulty) {
  const n = bandFor(level) === 'basis' ? 49 : 64;
  const ans = bandFor(level) === 'basis' ? 7 : 8;
  return pack(id, d, {
    id,
    type: 'number-input',
    topic: 'machten',
    difficulty: d,
    starsAvailable: 3,
    question: `√${n} = ?`,
    answer: ans,
    hint1: 'Welk getal keer zichzelf geeft ' + n + '?',
    hint2: `${ans} × ${ans} = ${n}.`,
    explanation: `√${n} = ${ans}.`,
    classLevels: [level],
  }, 'Wortel in het konijnenhol.');
}

// —— Deel I: Uilenlab ——
function verbandenTable(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'multiple-choice',
    topic: 'verbanden',
    difficulty: d,
    starsAvailable: 3,
    question: 'Welke formule past bij de tabel (week 0→4, 1→6, 2→8, 3→10)?',
    tableData: { headers: ['week', 'gewicht'], rows: [[0, 4], [1, 6], [2, 8], [3, 10]] },
    answer: 'a',
    answerOptions: [
      { id: 'a', label: 'g = 2w + 4' },
      { id: 'b', label: 'g = 4w + 2' },
      { id: 'c', label: 'g = w + 4' },
      { id: 'd', label: 'g = 2w' },
    ],
    hint1: 'Start bij week 0: g = 4. Elke week +2.',
    hint2: 'g = 2w + 4.',
    explanation: 'g = 2w + 4.',
    classLevels: [level],
  }, 'Patroon in de tabel onder maanlicht.');
}

function verbandenNonlinearTf(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'true-false',
    topic: 'verbanden',
    difficulty: d,
    starsAvailable: 3,
    question: 'Is dit een lineair verband? week: 0,1,2,3 — hoogte: 1,2,4,8',
    answer: false,
    hint1: 'Bij lineair is de toename steeds gelijk.',
    hint2: 'Verschillen: +1, +2, +4 — verdubbelt.',
    explanation: 'Nee — de waarden verdubbelen, dat is niet lineair.',
    classLevels: [level],
  }, 'Niet alles in het lab is lineair…');
}

function verbandenSituatie(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'multiple-choice',
    topic: 'verbanden',
    difficulty: d,
    starsAvailable: 3,
    question: 'Welke situatie past bij y = −2x + 10?',
    answer: 'a',
    answerOptions: [
      { id: 'a', label: 'Start met 10, elke stap −2' },
      { id: 'b', label: 'Start met 10, elke stap +2' },
      { id: 'c', label: 'Altijd y = 10' },
      { id: 'd', label: 'Elke stap verdubbelen' },
    ],
    hint1: 'Het minteken: y daalt als x stijgt.',
    hint2: 'Bij x=0 is y=10, daarna −2 per stap.',
    explanation: 'y = −2x + 10: start 10, daarna steeds 2 minder.',
    classLevels: [level],
  }, 'Koppel formule aan verhaal.');
}

function verbandenTable2(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'multiple-choice',
    topic: 'verbanden',
    difficulty: d,
    starsAvailable: 3,
    question: 'Tabel x: 1,2,3,4 en y: 5,8,11,14. Welke formule?',
    answer: 'a',
    answerOptions: [
      { id: 'a', label: 'y = 3x + 2' },
      { id: 'b', label: 'y = 3x + 1' },
      { id: 'c', label: 'y = 2x + 3' },
      { id: 'd', label: 'y = 4x + 1' },
    ],
    hint1: 'Verschil in y is steeds +3.',
    hint2: 'y = 3x + 2.',
    explanation: 'y = 3x + 2.',
    classLevels: [level],
  }, 'Nog een patroon in het lab.');
}

// —— Deel I: Bergmissie (runestenen) ——
function runestoneAlgebra(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'number-input',
    topic: 'algebra',
    difficulty: d,
    starsAvailable: 3,
    question: 'Runesteen Algebra: Los op 3(x − 2) = 15. Wat is x?',
    answer: 7,
    hint1: 'Deel beide kanten door 3, of werk haakjes uit.',
    hint2: 'x − 2 = 5 → x = 7.',
    explanation: '3(x − 2) = 15 → x − 2 = 5 → x = 7.',
    classLevels: [level],
  }, 'De eerste runesteen gloeit zwak…');
}

function runestoneGraph(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'multiple-choice',
    topic: 'grafieken',
    difficulty: d,
    starsAvailable: 3,
    question: 'Runesteen Grafieken: welke beschrijving past bij y = −x + 4?',
    answer: 'b',
    answerOptions: [
      { id: 'a', label: 'Stijgend, snijpunt y-as bij 4' },
      { id: 'b', label: 'Dalend, snijpunt y-as bij 4' },
      { id: 'c', label: 'Horizontaal op y = 4' },
      { id: 'd', label: 'Door oorsprong, steil omhoog' },
    ],
    hint1: 'Hellingsgetal −1 → dalend.',
    hint2: '+4 is het snijpunt met de y-as.',
    explanation: 'Dalend met y-as snijpunt 4.',
    classLevels: [level],
  }, 'Tweede runesteen: grafiekspoor.');
}

function runestoneBreuk(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'text-input',
    topic: 'breuken',
    difficulty: d,
    starsAvailable: 3,
    question: 'Runesteen Breuken: vereenvoudig 8/12.',
    answer: '2/3',
    hint1: 'Deel teller en noemer door hun GGD.',
    hint2: 'GGD is 4 → 2/3.',
    explanation: '8/12 = 2/3.',
    classLevels: [level],
  }, 'Derde runesteen: breuken.');
}

function runestoneVerbanden(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'multiple-choice',
    topic: 'verbanden',
    difficulty: d,
    starsAvailable: 3,
    question: 'Runesteen Verbanden: tabel x: 0,1,2,3 en y: 2,5,8,11. Welke formule?',
    answer: 'a',
    answerOptions: [
      { id: 'a', label: 'y = 3x + 2' },
      { id: 'b', label: 'y = 3x + 1' },
      { id: 'c', label: 'y = 2x + 3' },
      { id: 'd', label: 'y = 4x + 1' },
    ],
    hint1: 'Verschil in y is steeds +3.',
    hint2: 'y = 3x + 2.',
    explanation: 'y = 3x + 2.',
    classLevels: [level],
  }, 'Vierde runesteen: verbanden.');
}

function runestoneMixed(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'number-input',
    topic: 'vergelijkingen',
    difficulty: d,
    starsAvailable: 3,
    question: 'Laatste runesteen: Los op 2x + 5 = 17. Wat is x?',
    answer: 6,
    hint1: 'Trek 5 af van beide kanten.',
    hint2: '2x = 12 → x = 6.',
    explanation: 'x = 6.',
    classLevels: [level],
  }, 'Alle runestenen samen — bijna op de top!');
}

// —— Deel I: Maanlicht (parabolen / patronen) ——
function parabolaIntro(id: string, level: ClassLevel, d: HelpDifficulty) {
  const band = bandFor(level);
  if (band === 'basis') {
    return pack(id, d, {
      id,
      type: 'multiple-choice',
      topic: 'verbanden',
      difficulty: d,
      starsAvailable: 3,
      question: 'Bij y = x²: wat is y als x = 3 en als x = −3?',
      answer: 'a',
      answerOptions: [
        { id: 'a', label: 'Beide keren 9' },
        { id: 'b', label: '3 en −3' },
        { id: 'c', label: '0 en 9' },
      ],
      hint1: '(−3)² = 9 en 3² = 9.',
      hint2: 'Positief en negatief x kunnen dezelfde y geven.',
      explanation: 'Beide geven y = 9 — symmetrie in maanlicht.',
      classLevels: [level],
    }, 'Patronen in maanlicht.');
  }
  return pack(id, d, {
    id,
    type: 'multiple-choice',
    topic: 'kwadratisch',
    difficulty: d,
    starsAvailable: 3,
    question: 'Bij y = x²: wat valt op voor x = −3 en x = 3?',
    answer: 'a',
    answerOptions: [
      { id: 'a', label: 'Dezelfde y-waarde (symmetrie)' },
      { id: 'b', label: 'De grafiek is een rechte lijn' },
      { id: 'c', label: 'Alleen positieve x telt' },
      { id: 'd', label: 'y is altijd negatief' },
    ],
    hint1: '(−3)² = 3² = 9.',
    hint2: 'Spiegelbeeld in de y-as.',
    explanation: 'Positieve en negatieve x kunnen dezelfde y geven.',
    classLevels: [level],
  }, 'Patronen in maanlicht.');
}

function parabolaShift(id: string, level: ClassLevel, d: HelpDifficulty) {
  const band = bandFor(level);
  const topic = band === 'basis' ? 'verbanden' : 'kwadratisch';
  return pack(id, d, {
    id,
    type: 'multiple-choice',
    topic: topic as 'kwadratisch',
    difficulty: d,
    starsAvailable: 3,
    question: 'Vergelijk y = x² met y = x² + 2. Wat gebeurt er met de grafiek?',
    answer: 'a',
    answerOptions: [
      { id: 'a', label: 'De grafiek schuift 2 omhoog' },
      { id: 'b', label: 'De grafiek schuift 2 naar rechts' },
      { id: 'c', label: 'Wordt een rechte lijn' },
      { id: 'd', label: 'Alle y worden 2 kleiner' },
    ],
    hint1: 'Bij x = 0: y = 2 in plaats van 0.',
    hint2: 'Elke y krijgt +2.',
    explanation: 'De parabool schuift 2 omhoog.',
    classLevels: [level],
  }, 'De vallei spiegelt zich in maanlicht.');
}

function parabolaSquare(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'number-input',
    topic: bandFor(level) === 'basis' ? 'algebra' : 'kwadratisch',
    difficulty: d,
    starsAvailable: 3,
    question: 'Wat is (−4)²?',
    answer: 16,
    hint1: 'Negatief × negatief = positief.',
    hint2: '(−4) × (−4) = 16.',
    explanation: '(−4)² = 16.',
    classLevels: [level],
  }, 'Kwadraten in het maanlicht.');
}

function parabolaSymmetryTf(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'true-false',
    topic: bandFor(level) === 'basis' ? 'redeneren' : 'kwadratisch',
    difficulty: d,
    starsAvailable: 3,
    question: 'Klopt dit? “De grafiek van y = x² is symmetrisch in de y-as.”',
    answer: true,
    hint1: '(−x)² = x².',
    hint2: 'Links en rechts spiegelbeeld.',
    explanation: 'Ja — de parabool is symmetrisch.',
    classLevels: [level],
  }, 'Symmetrie in maanlicht.');
}

function parabolaShape(id: string, level: ClassLevel, d: HelpDifficulty) {
  const band = bandFor(level);
  const topic = band === 'basis' ? 'verbanden' : 'kwadratisch';
  if (band === 'basis') {
    return pack(id, d, {
      id,
      type: 'multiple-choice',
      topic,
      difficulty: d,
      starsAvailable: 3,
      question: 'Welke beschrijving past bij y = x²?',
      answer: 'b',
      answerOptions: [
        { id: 'a', label: 'Een rechte lijn' },
        { id: 'b', label: 'Een boog (parabool)' },
        { id: 'c', label: 'Een horizontale lijn' },
      ],
      hint1: 'Kwadratisch → boog, geen rechte lijn.',
      hint2: 'y = x² buigt omhoog als een U.',
      explanation: 'y = x² is een parabool — een boog.',
      classLevels: [level],
    }, 'Vorm herkennen in maanlicht.');
  }
  return pack(id, d, {
    id,
    type: 'multiple-choice',
    topic: 'kwadratisch',
    difficulty: d,
    starsAvailable: 3,
    question: 'Welke grafiek hoort bij y = x²?',
    answer: 'b',
    answerOptions: [
      { id: 'a', label: 'Rechte lijn door de oorsprong' },
      { id: 'b', label: 'U-vormige parabool' },
      { id: 'c', label: 'Horizontale lijn' },
      { id: 'd', label: 'Dalende rechte lijn' },
    ],
    hint1: 'Kwadratisch → boog, geen rechte lijn.',
    hint2: 'y = x² is een parabool.',
    explanation: 'y = x² is een U-vormige parabool.',
    classLevels: [level],
  }, 'Vorm herkennen in maanlicht.');
}

// —— Deel I: Sterrentempel ——
function templeOrderOps(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'number-input',
    topic: 'algebra',
    difficulty: d,
    starsAvailable: 3,
    question: 'Stersteen 1: Bereken −6 + (−3) × 2',
    answer: -12,
    hint1: 'Eerst vermenigvuldigen.',
    hint2: '(−3)×2 = −6, daarna −6 + (−6) = −12.',
    explanation: '−6 + (−6) = −12.',
    classLevels: [level],
  }, 'Let op de volgorde van bewerkingen.');
}

function templeExpand(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'multiple-choice',
    topic: 'algebra',
    difficulty: d,
    starsAvailable: 3,
    question: 'Stersteen 2: Wat is 2(3x − 1) uitgewerkt?',
    answer: 'b',
    answerOptions: [
      { id: 'a', label: '6x − 1' },
      { id: 'b', label: '6x − 2' },
      { id: 'c', label: '5x − 2' },
      { id: 'd', label: '6x + 2' },
    ],
    hint1: 'Vermenigvuldig 2 met beide termen.',
    hint2: '6x − 2.',
    explanation: '2(3x − 1) = 6x − 2.',
    classLevels: [level],
  }, 'Haakjes uitwerken op de tempelmuur.');
}

function templeEquation(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'number-input',
    topic: 'vergelijkingen',
    difficulty: d,
    starsAvailable: 3,
    question: 'Stersteen 3: Los op 4x − 7 = 9. Wat is x?',
    answer: 4,
    hint1: '+7 aan beide kanten.',
    hint2: '4x = 16 → x = 4.',
    explanation: 'x = 4.',
    classLevels: [level],
  }, 'Vergelijking op de tempelsteen.');
}

function templeFormulaL(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'text-input',
    topic: 'formules',
    difficulty: d,
    starsAvailable: 3,
    question: 'Stersteen 4: P = 2ℓ + 2b. Geef ℓ in termen van P en b.',
    answer: 'l=(P-2b)/2',
    acceptedAnswers: ['l=(P-2b)/2', 'ℓ=(P-2b)/2', 'l=P/2-b', 'ℓ=P/2-b'],
    hint1: 'Trek 2b af, deel door 2.',
    hint2: 'ℓ = (P − 2b) / 2.',
    explanation: 'ℓ = (P − 2b) / 2.',
    classLevels: [level],
  }, 'Formule omdraaien bij de tempel.');
}

// —— Deel II hard slots ——
function p2EquationFamiliar(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'equation-steps',
    topic: 'vergelijkingen',
    difficulty: d,
    starsAvailable: 3,
    question: 'Los op: 2x + 6 = 16',
    equationSteps: [
      {
        prompt: 'Wat doe je eerst om dichter bij x te komen?',
        options: [
          { id: 'plus6', label: 'Beide kanten +6' },
          { id: 'min6', label: 'Beide kanten −6' },
          { id: 'deel2', label: 'Beide kanten ÷ 2' },
          { id: 'keer2', label: 'Beide kanten × 2' },
        ],
        correctId: 'min6',
        resultDisplay: '2x = 10',
      },
      {
        prompt: 'Nu staat er 2x = 10. Wat is de volgende stap?',
        options: [
          { id: 'deel2', label: 'Beide kanten ÷ 2' },
          { id: 'min2', label: 'Beide kanten − 2' },
          { id: 'plus2', label: 'Beide kanten + 2' },
          { id: 'keer2', label: 'Beide kanten × 2' },
        ],
        correctId: 'deel2',
        resultDisplay: 'x = 5',
      },
    ],
    answer: 5,
    hint1: 'Haal de +6 weg met −6 aan beide kanten.',
    hint2: '2x = 10 → x = 5.',
    explanation: '2x + 6 = 16 → 2x = 10 → x = 5.',
    classLevels: [level],
  }, 'Vertrouwd pootafdruk uit het Vossenwoud.');
}

function p2EquationTwoX(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'number-input',
    topic: 'vergelijkingen',
    difficulty: d,
    starsAvailable: 3,
    question: 'Los op: 3x + 7 = x + 17. Wat is x?',
    answer: 5,
    hint1: 'Haal x-termen naar links, getallen naar rechts.',
    hint2: '2x = 10 → x = 5.',
    explanation: '3x + 7 = x + 17 → 2x = 10 → x = 5.',
    classLevels: [level],
  }, 'Twee x-termen in één vergelijking.');
}

function p2FormulaAreaRaven(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'number-input',
    topic: 'formules',
    difficulty: d,
    starsAvailable: 3,
    question: 'A = b × h. A = 48 m² en b = 6 m. Wat is h? (in meters)',
    answer: 8,
    hint1: 'h = A ÷ b.',
    hint2: '48 ÷ 6 = 8.',
    explanation: 'h = 8 m.',
    classLevels: [level],
  }, 'Ravennest op een rechthoekig platform.');
}

function p2FormulaPerimeter(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'number-input',
    topic: 'formules',
    difficulty: d,
    starsAvailable: 3,
    question: 'P = 2ℓ + 2b. P = 30 cm en b = 5 cm. Wat is ℓ? (in cm)',
    answer: 10,
    hint1: '30 = 2ℓ + 10.',
    hint2: '2ℓ = 20 → ℓ = 10.',
    explanation: 'ℓ = 10 cm.',
    classLevels: [level],
  }, 'Om het ravennest heen loopt een touw.');
}

function p2ParabolaIntro(id: string, level: ClassLevel, d: HelpDifficulty) {
  const base = parabolaIntro(id, level, d);
  return {
    ...base,
    challenge: {
      ...base.challenge,
      question: `Paraboolvallei — ${base.challenge.question}`,
    },
  };
}

function p2ParabolaShift(id: string, level: ClassLevel, d: HelpDifficulty) {
  const base = parabolaShift(id, level, d);
  return {
    ...base,
    challenge: {
      ...base.challenge,
      question: `Paraboolvallei — ${base.challenge.question}`,
    },
  };
}

function p2RatioScaleRiver(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'number-input',
    topic: 'verbanden',
    difficulty: d,
    starsAvailable: 3,
    question:
      'Op een kaart met schaal 1 : 25 000 staat een brug 4 cm lang. Hoe lang is de brug in werkelijkheid? (antwoord in meters)',
    answer: 1000,
    hint1: 'Werkelijke lengte = 4 × 25 000 cm.',
    hint2: '100 000 cm = 1000 m.',
    explanation: '4 cm × 25 000 = 100 000 cm = 1000 m.',
    classLevels: [level],
  }, 'De rivierkaart schaalt de werkelijkheid.');
}

function p2RatioMixtureRiver(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'number-input',
    topic: 'verbanden',
    difficulty: d,
    starsAvailable: 3,
    question:
      'Je mengt sap en water in de verhouding 2 : 3. In totaal gebruik je 25 liter. Hoeveel liter sap?',
    answer: 10,
    hint1: '2 + 3 = 5 delen. 25 ÷ 5 = 5 liter per deel.',
    hint2: 'Sap = 2 × 5 = 10 liter.',
    explanation: '10 liter sap (2 delen van 5).',
    classLevels: [level],
  }, 'Twee delen sap, drie delen water — de riviercocktail.');
}

function p2GraphIntersect(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'number-input',
    topic: 'grafieken',
    difficulty: d,
    starsAvailable: 3,
    question: 'Waar snijden y = 2x + 3 en y = x + 7 elkaar? Los x op. Wat is x?',
    answer: 4,
    hint1: 'Stel 2x + 3 gelijk aan x + 7.',
    hint2: 'x = 4.',
    explanation: '2x + 3 = x + 7 → x = 4. Snijpunt (4, 11).',
    classLevels: [level],
  }, 'Twee lichtlijnen kruisen boven het dak.');
}

function p2YInterceptObservatory(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'number-input',
    topic: 'grafieken',
    difficulty: d,
    starsAvailable: 3,
    question: 'y = −x + 8. Wat is de startwaarde (snijpunt met de y-as)?',
    answer: 8,
    hint1: 'Op de y-as is x = 0.',
    hint2: 'y = −0 + 8 = 8.',
    explanation: 'Startwaarde = 8.',
    classLevels: [level],
  }, 'Waar begint het spoor als x nog 0 is?');
}

function p2PowerProduct(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'multiple-choice',
    topic: 'machten',
    difficulty: d,
    starsAvailable: 3,
    question: 'Wat is 2³ × 2²? (zelfde grondtal)',
    answer: 'a',
    answerOptions: [
      { id: 'a', label: '2⁵' },
      { id: 'b', label: '2⁶' },
      { id: 'c', label: '4⁵' },
      { id: 'd', label: '2¹' },
    ],
    hint1: 'Exponenten optellen bij dezelfde grondtal.',
    hint2: '3 + 2 = 5 → 2⁵.',
    explanation: '2³ × 2² = 2⁵.',
    classLevels: [level],
  }, 'Runen: exponenten stapelen.');
}

function p2Sqrt81(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'number-input',
    topic: 'machten',
    difficulty: d,
    starsAvailable: 3,
    question: '√81 = ?',
    answer: 9,
    hint1: 'Welk getal keer zichzelf geeft 81?',
    hint2: '9 × 9 = 81.',
    explanation: '√81 = 9.',
    classLevels: [level],
  }, 'Een rune vraagt om de wortel van 81.');
}

function p2Square12(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'number-input',
    topic: 'machten',
    difficulty: d,
    starsAvailable: 3,
    question: '12² = ?',
    answer: 144,
    hint1: '12 × 12.',
    hint2: '12² = 144.',
    explanation: '12² = 144.',
    classLevels: [level],
  }, 'De runen vragen om het kwadraat van 12.');
}

function p2Sequence(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'number-input',
    topic: 'redeneren',
    difficulty: d,
    starsAvailable: 3,
    question: 'Reeks: 3, 7, 11, 15, … Wat is het volgende getal?',
    answer: 19,
    hint1: 'Elke stap +4.',
    hint2: '15 + 4 = 19.',
    explanation: 'Het patroon is +4 → 19.',
    classLevels: [level],
  }, 'Stenen in het doolhof vormen een rij.');
}

function p2FigureStones(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'number-input',
    topic: 'verbanden',
    difficulty: d,
    starsAvailable: 3,
    question:
      'Figuurstenen: figuur 1 = 4 stenen, figuur 2 = 7, figuur 3 = 10. Hoeveel stenen heeft figuur 10?',
    answer: 31,
    hint1: 'Verschil +3 per figuur. Formule: 3n + 1.',
    hint2: '3·10 + 1 = 31.',
    explanation: 'Figuur 10 heeft 31 stenen.',
    classLevels: [level],
  }, 'Elke figuur groeit met een laag stenen.');
}

function p2NachtAlgebra(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'number-input',
    topic: 'vergelijkingen',
    difficulty: d,
    starsAvailable: 3,
    question: 'Kamer I — Los op: 5x + 2 = 2x + 14. Wat is x?',
    answer: 4,
    hint1: 'Haal 2x naar links.',
    hint2: '3x = 12 → x = 4.',
    explanation: '5x + 2 = 2x + 14 → x = 4.',
    classLevels: [level],
  }, 'Algebra-slot in de nachttempel.');
}

function p2NachtRatio(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'number-input',
    topic: 'verbanden',
    difficulty: d,
    starsAvailable: 3,
    question: 'Sap en water in verhouding 3 : 5. Totaal 32 liter. Hoeveel liter sap?',
    answer: 12,
    hint1: '3 + 5 = 8 delen. 32 ÷ 8 = 4 liter per deel.',
    hint2: 'Sap = 3 × 4 = 12 liter.',
    explanation: '12 liter sap.',
    classLevels: [level],
  }, 'Een nachtelijke rivier stroomt door kamer II.');
}

function p2NachtIntersectY(id: string, level: ClassLevel, d: HelpDifficulty) {
  return pack(id, d, {
    id,
    type: 'number-input',
    topic: 'grafieken',
    difficulty: d,
    starsAvailable: 3,
    question:
      'Kamer III — Waar snijden y = 2x + 1 en y = x + 6 elkaar? Geef de y-waarde op het snijpunt.',
    answer: 11,
    hint1: '2x + 1 = x + 6 → x = 5.',
    hint2: 'y = 2·5 + 1 = 11.',
    explanation: 'Snijpunt (5, 11).',
    classLevels: [level],
  }, 'Twee sterrenlijnen kruisen elkaar.');
}

/** Route story kind → generator (Deel I + Deel II). */
export function generateStoryKindChallenge(
  kind: StoryChallengeKind,
  id: string,
  level: ClassLevel,
  lessonIndex: number,
  difficulty: HelpDifficulty,
  seed: number,
): { challenge: ChallengeDefinition; help: GuidedHelpPack } | null {
  void seed;
  void lessonIndex;
  switch (kind) {
    case 'formula-area': return formulaArea(id, level, difficulty);
    case 'formula-speed': return formulaSpeed(id, level, difficulty);
    case 'formula-cost': return formulaCost(id, level, difficulty);
    case 'formula-rearrange-t': return formulaRearrangeT(id, level, difficulty);
    case 'formula-perimeter': return formulaPerimeter(id, level, difficulty);
    case 'fraction-compare': return fractionCompare(id, level, difficulty);
    case 'fraction-add': return fractionAddText(id, level, difficulty);
    case 'powers-compare': return powersCompare(id, level, difficulty);
    case 'sqrt-input': return sqrtInput(id, level, difficulty);
    case 'verbanden-table': return verbandenTable(id, level, difficulty);
    case 'verbanden-nonlinear-tf': return verbandenNonlinearTf(id, level, difficulty);
    case 'verbanden-situatie': return verbandenSituatie(id, level, difficulty);
    case 'verbanden-linear-table': return verbandenTable2(id, level, difficulty);
    case 'runestone-algebra': return runestoneAlgebra(id, level, difficulty);
    case 'runestone-graph': return runestoneGraph(id, level, difficulty);
    case 'runestone-breuk': return runestoneBreuk(id, level, difficulty);
    case 'runestone-verbanden': return runestoneVerbanden(id, level, difficulty);
    case 'runestone-mixed': return runestoneMixed(id, level, difficulty);
    case 'parabola-intro': return parabolaIntro(id, level, difficulty);
    case 'parabola-shift': return parabolaShift(id, level, difficulty);
    case 'parabola-square': return parabolaSquare(id, level, difficulty);
    case 'parabola-symmetry-tf': return parabolaSymmetryTf(id, level, difficulty);
    case 'parabola-shape': return parabolaShape(id, level, difficulty);
    case 'temple-order-ops': return templeOrderOps(id, level, difficulty);
    case 'temple-expand': return templeExpand(id, level, difficulty);
    case 'temple-equation': return templeEquation(id, level, difficulty);
    case 'temple-formula-l': return templeFormulaL(id, level, difficulty);
    case 'p2-equation-familiar': return p2EquationFamiliar(id, level, difficulty);
    case 'p2-equation-two-x': return p2EquationTwoX(id, level, difficulty);
    case 'p2-formula-area-raven': return p2FormulaAreaRaven(id, level, difficulty);
    case 'p2-formula-perimeter': return p2FormulaPerimeter(id, level, difficulty);
    case 'p2-ratio-scale-river': return p2RatioScaleRiver(id, level, difficulty);
    case 'p2-ratio-mixture-river': return p2RatioMixtureRiver(id, level, difficulty);
    case 'p2-graph-intersect': return p2GraphIntersect(id, level, difficulty);
    case 'p2-y-intercept-observatory': return p2YInterceptObservatory(id, level, difficulty);
    case 'p2-power-product': return p2PowerProduct(id, level, difficulty);
    case 'p2-sqrt-81': return p2Sqrt81(id, level, difficulty);
    case 'p2-square-12': return p2Square12(id, level, difficulty);
    case 'p2-sequence': return p2Sequence(id, level, difficulty);
    case 'p2-pattern-formula': return p2Sequence(id, level, difficulty);
    case 'p2-figure-stones': return p2FigureStones(id, level, difficulty);
    case 'p2-nacht-algebra': return p2NachtAlgebra(id, level, difficulty);
    case 'p2-nacht-ratio': return p2NachtRatio(id, level, difficulty);
    case 'p2-parabola-intro': return p2ParabolaIntro(id, level, difficulty);
    case 'p2-parabola-shift': return p2ParabolaShift(id, level, difficulty);
    default:
      return null;
  }
}
