import { describe, expect, it } from 'vitest';
import { answersMatch } from './answers';
import {
  extractExpression,
  mathAnswerMatches,
  mathAnswersEqual,
  normalizeMathInput,
  parseExpression,
  evaluateAst,
} from './mathAnswerValidation';

describe('normalizeMathInput', () => {
  it('treats Dutch colon as division', () => {
    expect(normalizeMathInput('(T-20):5')).toBe('(t-20)/5');
    expect(normalizeMathInput('n=(T-20):5')).toBe('n=(t-20)/5');
  });

  it('strips spaces and lowercases', () => {
    expect(normalizeMathInput(' N = ( T - 20 ) / 5 ')).toBe('n=(t-20)/5');
  });

  it('inserts implicit multiplication', () => {
    expect(normalizeMathInput('5n+20')).toBe('5*n+20');
    expect(normalizeMathInput('2(x+1)')).toBe('2*(x+1)');
  });
});

describe('extractExpression', () => {
  it('strips leading assignment', () => {
    expect(extractExpression('n=(t-20)/5')).toBe('(t-20)/5');
  });

  it('strips trailing assignment', () => {
    expect(extractExpression('(t-20)/5=n')).toBe('(t-20)/5');
  });
});

describe('mathAnswersEqual — formula for n in terms of T', () => {
  const expected = 'n=(T-20)/5';

  it.each([
    'n=(T-20)/5',
    'n=(T-20):5',
    '(T-20)/5',
    '(T-20):5',
    'n=T/5-4',
    'T/5-4',
    'n = (T - 20) : 5',
    'N=(t-20)/5',
  ])('accepts equivalent form %s', (user) => {
    expect(mathAnswersEqual(user, expected)).toBe(true);
  });

  it.each(['n=(T-20)/4', 'n=(T+20)/5', 'n=T/5+4', 'n=5/(T-20)', 'hello'])(
    'rejects incorrect form %s',
    (user) => {
      expect(mathAnswersEqual(user, expected)).toBe(false);
    },
  );
});

describe('mathAnswersEqual — perimeter formula', () => {
  const expected = 'l=(P-2b)/2';

  it.each(['l=(P-2b)/2', 'ℓ=(P-2b)/2', 'l=P/2-b', 'l=(P-2*b)/2', '(P-2b):2'])(
    'accepts %s',
    (user) => {
      expect(mathAnswersEqual(user, expected)).toBe(true);
    },
  );
});

describe('fractions and numbers', () => {
  it('accepts colon fractions', () => {
    expect(mathAnswersEqual('5:6', '5/6')).toBe(true);
    expect(mathAnswersEqual('2:3', '2/3')).toBe(true);
  });

  it('matches numeric answers', () => {
    expect(mathAnswerMatches('6', 6)).toBe(true);
    expect(mathAnswerMatches('12/2', 6)).toBe(true);
    expect(mathAnswerMatches('7', 6)).toBe(false);
  });
});

describe('answersMatch integration', () => {
  it('accepts Dutch colon for lesson-style formula', () => {
    expect(answersMatch('n=(T-20):5', 'n=(T-20)/5')).toBe(true);
  });

  it('still matches option ids via math path when identical', () => {
    // option ids are not valid math exprs alone in some cases — 'bij4' has digit after letters
    expect(answersMatch('c', 'c')).toBe(true);
  });

  it('matches boolean and number paths', () => {
    expect(answersMatch('waar', true)).toBe(true);
    expect(answersMatch('6', 6)).toBe(true);
  });

  it('matches acceptedAnswers arrays', () => {
    expect(answersMatch('(T-20):5', ['n=(T-20)/5', 'n=T/5-4'])).toBe(true);
  });
});

describe('existing lesson answers still work', () => {
  it('accepts fraction answers from Konijnenhol / Bergmissie', () => {
    expect(answersMatch('5/6', '5/6')).toBe(true);
    expect(answersMatch('5:6', '5/6')).toBe(true);
    expect(answersMatch('2/3', '2/3')).toBe(true);
    expect(answersMatch('2:3', '2/3')).toBe(true);
  });

  it('accepts lesson 2 formula variants', () => {
    expect(answersMatch('n=(T-20):5', 'n=(T-20)/5')).toBe(true);
    expect(answersMatch('T/5-4', 'n=(T-20)/5')).toBe(true);
  });

  it('accepts lesson 8 perimeter variants', () => {
    expect(answersMatch('l=P/2-b', 'l=(P-2b)/2')).toBe(true);
    expect(answersMatch('(P-2b):2', 'l=(P-2b)/2')).toBe(true);
  });
});

describe('parser sanity', () => {
  it('evaluates a simple expression', () => {
    const ast = parseExpression(normalizeMathInput('(T-20)/5'));
    expect(ast).not.toBeNull();
    expect(evaluateAst(ast!, { t: 30 })).toBe(2);
  });
});
