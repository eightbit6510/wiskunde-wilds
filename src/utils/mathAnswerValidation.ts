/**
 * Safe algebraic answer validation (no eval).
 * Supports Dutch `:` as division and numeric equivalence of expressions.
 */

const ABS_TOL = 1e-9;
const REL_TOL = 1e-9;
const TEST_VALUES = [-5, -3, -2, -1, -0.5, 0.5, 1, 2, 3, 4, 7, 10] as const;

type Op = '+' | '-' | '*' | '/' | '^' | '(' | ')';

export type Token =
  | { type: 'number'; value: number }
  | { type: 'ident'; name: string }
  | { type: 'op'; value: Op };

type Ast =
  | { type: 'num'; value: number }
  | { type: 'var'; name: string }
  | { type: 'unary'; op: '-'; expr: Ast }
  | { type: 'binary'; op: '+' | '-' | '*' | '/' | '^'; left: Ast; right: Ast };

/** Normalize student/math notation into a parse-friendly string. */
export function normalizeMathInput(raw: string): string {
  let s = raw.trim().toLowerCase();
  s = s.replace(/\s+/g, '');
  s = s.replace(/,/g, '.');
  s = s.replace(/ℓ/g, 'l');
  s = s.replace(/×/g, '*').replace(/·/g, '*').replace(/÷/g, '/');
  // Dutch school notation: colon means division
  s = s.replace(/:/g, '/');
  s = s.replace(/²/g, '^2').replace(/³/g, '^3');
  s = insertImplicitMultiplication(s);
  return s;
}

/** Insert * for forms like 2x, 5(, )(, x(, 2(x+1) */
function insertImplicitMultiplication(s: string): string {
  return s
    .replace(/(\d)([a-z(])/g, '$1*$2')
    .replace(/([a-z)])(\d)/g, '$1*$2')
    .replace(/([a-z)])([a-z(])/g, '$1*$2');
}

/**
 * If the answer is `n=...`, return the RHS.
 * Also accepts `(T-20)/5=n`.
 */
export function extractExpression(normalized: string): string {
  const lead = normalized.match(/^([a-z])=(.+)$/);
  if (lead) return lead[2];

  const trail = normalized.match(/^(.+)=([a-z])$/);
  if (trail) return trail[1];

  return normalized;
}

export function tokenize(input: string): Token[] | null {
  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    const c = input[i];
    if (c === '+' || c === '-' || c === '*' || c === '/' || c === '^' || c === '(' || c === ')') {
      tokens.push({ type: 'op', value: c });
      i++;
      continue;
    }
    if (/[0-9.]/.test(c)) {
      let j = i + 1;
      while (j < input.length && /[0-9.]/.test(input[j])) j++;
      const num = Number(input.slice(i, j));
      if (!Number.isFinite(num)) return null;
      tokens.push({ type: 'number', value: num });
      i = j;
      continue;
    }
    if (/[a-z]/.test(c)) {
      tokens.push({ type: 'ident', name: c });
      i++;
      continue;
    }
    return null;
  }
  return tokens;
}

class Parser {
  private pos = 0;
  private tokens: Token[];

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): Ast | null {
    const expr = this.parseExpr();
    if (expr === null || this.pos !== this.tokens.length) return null;
    return expr;
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private consume(): Token {
    return this.tokens[this.pos++];
  }

  private matchOp(...ops: Op[]): Op | null {
    const t = this.peek();
    if (t?.type === 'op' && ops.includes(t.value)) {
      this.consume();
      return t.value;
    }
    return null;
  }

  private parseExpr(): Ast | null {
    let left = this.parseTerm();
    if (!left) return null;
    for (;;) {
      const op = this.matchOp('+', '-');
      if (!op || (op !== '+' && op !== '-')) break;
      const right = this.parseTerm();
      if (!right) return null;
      left = { type: 'binary', op, left, right };
    }
    return left;
  }

  private parseTerm(): Ast | null {
    let left = this.parsePower();
    if (!left) return null;
    for (;;) {
      const op = this.matchOp('*', '/');
      if (!op || (op !== '*' && op !== '/')) break;
      const right = this.parsePower();
      if (!right) return null;
      left = { type: 'binary', op, left, right };
    }
    return left;
  }

  private parsePower(): Ast | null {
    const base = this.parseUnary();
    if (!base) return null;
    if (this.matchOp('^')) {
      const exp = this.parseUnary();
      if (!exp) return null;
      return { type: 'binary', op: '^', left: base, right: exp };
    }
    return base;
  }

  private parseUnary(): Ast | null {
    if (this.matchOp('-')) {
      const expr = this.parseUnary();
      if (!expr) return null;
      return { type: 'unary', op: '-', expr };
    }
    if (this.matchOp('+')) {
      return this.parseUnary();
    }
    return this.parsePrimary();
  }

  private parsePrimary(): Ast | null {
    const t = this.peek();
    if (!t) return null;
    if (t.type === 'number') {
      this.consume();
      return { type: 'num', value: t.value };
    }
    if (t.type === 'ident') {
      this.consume();
      return { type: 'var', name: t.name };
    }
    if (t.type === 'op' && t.value === '(') {
      this.consume();
      const inner = this.parseExpr();
      if (!inner) return null;
      if (!this.matchOp(')')) return null;
      return inner;
    }
    return null;
  }
}

export function parseExpression(normalizedExpr: string): Ast | null {
  const tokens = tokenize(normalizedExpr);
  if (!tokens || tokens.length === 0) return null;
  return new Parser(tokens).parse();
}

export function collectVariables(ast: Ast, into = new Set<string>()): Set<string> {
  switch (ast.type) {
    case 'num':
      break;
    case 'var':
      into.add(ast.name);
      break;
    case 'unary':
      collectVariables(ast.expr, into);
      break;
    case 'binary':
      collectVariables(ast.left, into);
      collectVariables(ast.right, into);
      break;
  }
  return into;
}

export function evaluateAst(ast: Ast, env: Record<string, number>): number | null {
  switch (ast.type) {
    case 'num':
      return ast.value;
    case 'var':
      if (!(ast.name in env)) return null;
      return env[ast.name];
    case 'unary': {
      const v = evaluateAst(ast.expr, env);
      return v === null ? null : -v;
    }
    case 'binary': {
      const l = evaluateAst(ast.left, env);
      const r = evaluateAst(ast.right, env);
      if (l === null || r === null) return null;
      switch (ast.op) {
        case '+':
          return l + r;
        case '-':
          return l - r;
        case '*':
          return l * r;
        case '/':
          if (Math.abs(r) < 1e-12) return null;
          return l / r;
        case '^':
          return l ** r;
      }
    }
  }
}

function nearlyEqual(a: number, b: number): boolean {
  const diff = Math.abs(a - b);
  if (diff <= ABS_TOL) return true;
  const scale = Math.max(Math.abs(a), Math.abs(b), 1);
  return diff <= REL_TOL * scale;
}

function sampleAssignments(varCount: number): number[][] {
  if (varCount === 0) return [[]];
  if (varCount === 1) return TEST_VALUES.map((v) => [v]);

  const picks = [-3, -1, 0.5, 2, 7];
  if (varCount === 2) {
    const out: number[][] = [];
    for (const a of picks) {
      for (const b of picks) out.push([a, b]);
    }
    return out;
  }

  const out: number[][] = [];
  for (const v of picks) {
    out.push(Array.from({ length: varCount }, () => v));
  }
  for (let i = 0; i < varCount; i++) {
    const row = Array.from({ length: varCount }, () => 2);
    row[i] = -2;
    out.push(row);
  }
  return out;
}

/**
 * Compare two math answers for equivalence.
 * Handles Dutch `:`, optional `n=`, and algebraically equivalent forms via numeric checks.
 */
export function mathAnswersEqual(userRaw: string, expectedRaw: string): boolean {
  const userNorm = normalizeMathInput(userRaw);
  const expectedNorm = normalizeMathInput(expectedRaw);
  if (!userNorm || !expectedNorm) return false;

  const userExpr = extractExpression(userNorm);
  const expectedExpr = extractExpression(expectedNorm);

  if (userExpr === expectedExpr || userNorm === expectedNorm) return true;

  const userAst = parseExpression(userExpr);
  const expectedAst = parseExpression(expectedExpr);
  if (!userAst || !expectedAst) return false;

  const vars = [
    ...new Set([...collectVariables(userAst), ...collectVariables(expectedAst)]),
  ].sort();

  const assignments = sampleAssignments(vars.length);
  let compared = 0;

  for (const values of assignments) {
    const env: Record<string, number> = {};
    vars.forEach((name, i) => {
      env[name] = values[i] ?? 0;
    });
    const u = evaluateAst(userAst, env);
    const e = evaluateAst(expectedAst, env);
    if (u === null || e === null) continue;
    if (!Number.isFinite(u) || !Number.isFinite(e)) continue;
    if (!nearlyEqual(u, e)) return false;
    compared++;
  }

  const needed = vars.length === 0 ? 1 : 3;
  return compared >= needed;
}

/** True if user matches any expected variant (string or number). */
export function mathAnswerMatches(
  userRaw: string,
  expected: string | number | (string | number)[],
): boolean {
  const list = Array.isArray(expected) ? expected : [expected];
  return list.some((item) => {
    if (typeof item === 'number') {
      const expr = extractExpression(normalizeMathInput(userRaw));
      const ast = parseExpression(expr);
      if (!ast) {
        const n = Number(userRaw.replace(',', '.').trim());
        return Number.isFinite(n) && nearlyEqual(n, item);
      }
      // Only accept if it's a constant expression
      if (collectVariables(ast).size > 0) return false;
      const v = evaluateAst(ast, {});
      return v !== null && nearlyEqual(v, item);
    }
    return mathAnswersEqual(userRaw, String(item));
  });
}
