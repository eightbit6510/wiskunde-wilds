import vosNeutraal from '../assets/mascots/vos-neutraal.png';
import vosBlij from '../assets/mascots/vos-blij.png';
import vosNadenken from '../assets/mascots/vos-nadenken.png';
import vosFeest from '../assets/mascots/vos-feest.png';

export type MascotMood = 'normal' | 'happy' | 'thinking' | 'celebrating';

interface ForestMascotProps {
  mood?: MascotMood;
  size?: number;
  className?: string;
}

const VOS_BY_MOOD: Record<MascotMood, string> = {
  normal: vosNeutraal,
  happy: vosBlij,
  thinking: vosNadenken,
  celebrating: vosFeest,
};

export function ForestMascot({ mood = 'normal', size = 140, className = '' }: ForestMascotProps) {
  return (
    <div className={`mascot-wrap ${className}`} aria-hidden="true">
      <img
        className="mascot-img"
        src={VOS_BY_MOOD[mood]}
        width={size}
        height={size}
        alt=""
        draggable={false}
      />
    </div>
  );
}
