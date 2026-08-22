/** Vite import.meta.glob / JSON imports leveren soms { default: T } */
export function unwrapJsonModule<T>(mod: T | { default: T }): T {
  if (
    mod &&
    typeof mod === 'object' &&
    'default' in mod &&
    (mod as { default: T }).default != null
  ) {
    return (mod as { default: T }).default;
  }
  return mod as T;
}
