import { useMemo, useState } from 'react';
import type { BonusVariant, Challenge } from '../../types';
import type { HelpPersona } from '../../types/content';
import {
  OWL_HELP_STARS_EARNED,
  computeChallengeXp,
} from '../../utils/owlEconomy';
import { GuidedHelpBonusChallenge } from './GuidedHelpBonusChallenge';
import { GuidedHelpBonusOffer } from './GuidedHelpBonusOffer';
import { GuidedHelpButton } from './GuidedHelpButton';
import { GuidedHelpConfirmModal } from './GuidedHelpConfirmModal';
import { GuidedHelpModal } from './GuidedHelpModal';

type HelpPhase = 'idle' | 'confirm' | 'helping' | 'reward' | 'bonus' | 'done';

interface GuidedHelpControllerProps {
  persona: HelpPersona;
  challenge: Challenge;
  totalStars: number;
  alreadySolved: boolean;
  animationsEnabled: boolean;
  onConfirmSpend: (challengeId: string) => boolean;
  onHelpSolved: () => void;
  onBonusStart: () => void;
  onBonusSolved: () => number;
  onRequestHint: () => void;
  onBonusVisibilityChange?: (active: boolean) => void;
}

function pickVariant(variants: BonusVariant[]): BonusVariant | null {
  if (!variants.length) return null;
  return variants[Math.floor(Math.random() * variants.length)] ?? null;
}

export function GuidedHelpController({
  persona,
  challenge,
  totalStars,
  alreadySolved,
  animationsEnabled,
  onConfirmSpend,
  onHelpSolved,
  onBonusStart,
  onBonusSolved,
  onRequestHint,
  onBonusVisibilityChange,
}: GuidedHelpControllerProps) {
  const [phase, setPhase] = useState<HelpPhase>('idle');
  const [starsAfterSpend, setStarsAfterSpend] = useState(totalStars);
  const [xpEarned, setXpEarned] = useState(0);
  const [activeVariant, setActiveVariant] = useState<BonusVariant | null>(null);

  const help = challenge.owlHelp;
  const variants = challenge.bonusVariants ?? [];
  const hasVariants = useMemo(() => variants.length > 0, [variants.length]);

  if (!help) return null;

  return (
    <div className={persona.themeClass}>
      {phase === 'idle' && !alreadySolved && (
        <div className="guided-help-row">
          <GuidedHelpButton persona={persona} onClick={() => setPhase('confirm')} />
        </div>
      )}

      <GuidedHelpConfirmModal
        persona={persona}
        open={phase === 'confirm'}
        totalStars={totalStars}
        animationsEnabled={animationsEnabled}
        onCancel={() => setPhase('idle')}
        onTryHint={() => {
          setPhase('idle');
          onRequestHint();
        }}
        onConfirm={() => {
          const ok = onConfirmSpend(challenge.id);
          if (!ok) return;
          setStarsAfterSpend(Math.max(0, totalStars - 1));
          setPhase('helping');
        }}
      />

      {phase === 'helping' && (
        <GuidedHelpModal
          key={`help-${challenge.id}`}
          persona={persona}
          open
          help={help}
          animationsEnabled={animationsEnabled}
          starsAfterSpend={starsAfterSpend}
          onClose={() => setPhase('idle')}
          onFinished={() => {
            onHelpSolved();
            setXpEarned(computeChallengeXp(OWL_HELP_STARS_EARNED, !alreadySolved, true));
            setPhase('reward');
          }}
        />
      )}

      <GuidedHelpBonusOffer
        persona={persona}
        open={phase === 'reward'}
        xpEarned={xpEarned}
        onDecline={() => {
          onBonusVisibilityChange?.(false);
          setPhase('done');
        }}
        onAccept={() => {
          if (!hasVariants) {
            onBonusVisibilityChange?.(false);
            setPhase('done');
            return;
          }
          onBonusStart();
          setActiveVariant(pickVariant(variants));
          onBonusVisibilityChange?.(true);
          setPhase('bonus');
        }}
      />

      {phase === 'bonus' && activeVariant && (
        <GuidedHelpBonusChallenge
          persona={persona}
          variant={activeVariant}
          animationsEnabled={animationsEnabled}
          onSolved={() => {
            onBonusSolved();
          }}
          onSkip={() => {
            onBonusVisibilityChange?.(false);
            setPhase('done');
          }}
        />
      )}
    </div>
  );
}

/** @deprecated Use GuidedHelpController */
export const OwlHelpController = GuidedHelpController;
