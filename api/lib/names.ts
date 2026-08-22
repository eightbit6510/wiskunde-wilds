export function normalizeDisplayName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function validateDisplayName(name: string): string | null {
  const trimmed = name.trim();
  if (trimmed.length < 2) return 'Naam moet minstens 2 tekens zijn.';
  if (trimmed.length > 20) return 'Naam mag maximaal 20 tekens zijn.';
  if (!/^[\p{L}\p{N} _-]+$/u.test(trimmed)) {
    return 'Alleen letters, cijfers, spaties, - en _ zijn toegestaan.';
  }
  return null;
}

export function validatePin(pin: string): string | null {
  if (pin.length < 4) return 'Geheime code moet minstens 4 tekens zijn.';
  if (pin.length > 6) return 'Geheime code mag maximaal 6 tekens zijn.';
  if (!/^\d+$/.test(pin)) return 'Gebruik alleen cijfers in je geheime code.';
  return null;
}

export function suggestName(baseName: string, takenSuffixes: number[]): string {
  let n = 2;
  while (takenSuffixes.includes(n)) n += 1;
  return `${baseName}${n}`;
}
