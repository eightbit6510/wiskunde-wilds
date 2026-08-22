import type { HelpPersona } from '../../types/content';
import { DetectiveMascot } from './DetectiveMascot';
import { MechanicMascot } from './MechanicMascot';
import { OwlMascot } from '../owl/OwlMascot';

interface HelpMascotProps {
  persona: HelpPersona;
  size?: number;
  className?: string;
  mood?: 'calm' | 'happy' | 'thinking';
}

export function HelpMascot({ persona, size = 72, className = '', mood = 'calm' }: HelpMascotProps) {
  switch (persona.mascotKey) {
    case 'detective':
      return <DetectiveMascot size={size} className={className} mood={mood} />;
    case 'mechanic':
      return <MechanicMascot size={size} className={className} mood={mood} />;
    default:
      return <OwlMascot size={size} className={className} mood={mood} />;
  }
}
