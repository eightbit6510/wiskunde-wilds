import { PIN_RULES } from '../types/player';

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
  if (pin.length < PIN_RULES.minLength) {
    return `Geheime code moet minstens ${PIN_RULES.minLength} tekens zijn.`;
  }
  if (pin.length > PIN_RULES.maxLength) {
    return `Geheime code mag maximaal ${PIN_RULES.maxLength} tekens zijn.`;
  }
  if (PIN_RULES.numericOnly && !/^\d+$/.test(pin)) {
    return 'Gebruik alleen cijfers in je geheime code.';
  }
  return null;
}
