export function StarCounter({ stars, label = 'sterren' }: { stars: number; label?: string }) {
  return (
    <span className="star-counter" aria-label={`${stars} ${label}`}>
      <span aria-hidden="true">⭐</span>
      <span>{stars}</span>
    </span>
  );
}
