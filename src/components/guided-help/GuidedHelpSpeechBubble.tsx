import type { ReactNode } from 'react';

interface GuidedHelpSpeechBubbleProps {
  children: ReactNode;
}

export function GuidedHelpSpeechBubble({ children }: GuidedHelpSpeechBubbleProps) {
  return <div className="guided-help-speech">{children}</div>;
}
