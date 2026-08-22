import uilNeutraal from '../../assets/mascots/uil-neutraal.png';
import uilBlij from '../../assets/mascots/uil-blij.png';
import uilNadenken from '../../assets/mascots/uil-nadenken.png';

interface OwlMascotProps {
  size?: number;
  className?: string;
  mood?: 'calm' | 'happy' | 'thinking';
}

const UIL_BY_MOOD: Record<NonNullable<OwlMascotProps['mood']>, string> = {
  calm: uilNeutraal,
  happy: uilBlij,
  thinking: uilNadenken,
};

/** Pencil-style owl companion — PNG moods from the forest theme. */
export function OwlMascot({ size = 72, className = '', mood = 'calm' }: OwlMascotProps) {
  return (
    <div className={`mascot-wrap ${className}`} aria-hidden="true">
      <img
        className="mascot-img"
        src={UIL_BY_MOOD[mood]}
        width={size}
        height={size}
        alt=""
        draggable={false}
      />
    </div>
  );
}
