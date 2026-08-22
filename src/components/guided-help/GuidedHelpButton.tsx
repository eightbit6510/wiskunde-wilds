import type { HelpPersona } from '../../types/content';

interface GuidedHelpButtonProps {
  persona: HelpPersona;
  onClick: () => void;
  disabled?: boolean;
}

export function GuidedHelpButton({ persona, onClick, disabled }: GuidedHelpButtonProps) {
  return (
    <button
      type="button"
      className={`btn btn-secondary guided-help-btn ${persona.themeClass ?? ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={persona.buttonLabel}
    >
      {persona.buttonLabel}
    </button>
  );
}
