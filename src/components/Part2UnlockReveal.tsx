import { OwlMascot } from './owl/OwlMascot';

interface Props {
  open: boolean;
  animationsEnabled: boolean;
  onDiscover: () => void;
}

export function Part2UnlockReveal({ open, animationsEnabled, onDiscover }: Props) {
  if (!open) return null;
  return (
    <div className="completion-modal part2-reveal-backdrop" role="dialog" aria-modal="true" aria-labelledby="p2-reveal-title">
      <div className={`completion-card night-card${animationsEnabled ? ' owl-enter' : ''}`}>
        <OwlMascot size={88} mood="thinking" className={animationsEnabled ? 'float' : ''} />
        <p className="muted">🦉 Hoorde je dat?</p>
        <p>Volgens mij eindigt het pad hier helemaal niet.</p>
        <hr className="owl-divider" />
        <p>Er is een nieuw gebied ontdekt.</p>
        <h2 id="p2-reveal-title">🌙 Wiskunde Wilds II</h2>
        <p className="lead" style={{ marginTop: 0 }}>
          Het Verborgen Gebied
        </p>
        <button type="button" className="btn btn-large" onClick={onDiscover}>
          Ontdek het nieuwe pad
        </button>
      </div>
    </div>
  );
}
