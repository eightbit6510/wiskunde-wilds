interface OwlHelpButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function OwlHelpButton({ onClick, disabled }: OwlHelpButtonProps) {
  return (
    <button
      type="button"
      className="btn btn-secondary owl-help-btn"
      onClick={onClick}
      disabled={disabled}
      aria-label="Vraag de Uil om hulp"
    >
      🦉 Vraag de Uil
    </button>
  );
}
