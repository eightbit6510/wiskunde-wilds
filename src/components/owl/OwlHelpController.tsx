import { useMemo, useState } from 'react';
import type { BonusVariant, Challenge } from '../../types';
import {
  OWL_HELP_STARS_EARNED,
  computeChallengeXp,
} from '../../utils/owlEconomy';
import { BonusChallenge } from './BonusChallenge';
import { OwlBonusOffer } from './OwlBonusOffer';
import { OwlConfirmModal } from './OwlConfirmModal';
import { OwlHelpButton } from './OwlHelpButton';
import { OwlHelpModal } from './OwlHelpModal';

type OwlPhase = 'idle' | 'confirm' | 'helping' | 'reward' | 'bonus' | 'done';

interface OwlHelpControllerProps {
  challenge: Challenge;
  totalStars: number;
  alreadySolved: boolean;
  animationsEnabled: boolean;
  onConfirmSpend: (challengeId: string) => boolean;
  onOwlSolved: () => void;
  onBonusStart: () => void;
  onBonusSolved: () => number;
  onRequestHint: () => void;
  onBonusVisibilityChange?: (active: boolean) => void;
}

function pickVariant(variants: BonusVariant[]): BonusVariant | null {
  if (!variants.length) return null;
  return variants[Math.floor(Math.random() * variants.length)] ?? null;
}

export function OwlHelpController({
  challenge,
  totalStars,
  alreadySolved,
  animationsEnabled,
  onConfirmSpend,
  onOwlSolved,
  onBonusStart,
  onBonusSolved,
  onRequestHint,
  onBonusVisibilityChange,
}: OwlHelpControllerProps) {
  const [phase, setPhase] = useState<OwlPhase>('idle');
  const [starsAfterSpend, setStarsAfterSpend] = useState(totalStars);
  const [xpEarned, setXpEarned] = useState(0);
  const [activeVariant, setActiveVariant] = useState<BonusVariant | null>(null);

  const help = challenge.owlHelp;
  const variants = challenge.bonusVariants ?? [];

  const hasVariants = useMemo(() => variants.length > 0, [variants.length]);

  if (!help) return null;

  return (
    <>
      {phase === 'idle' && !alreadySolved && (
        <div className="owl-help-row">
          <OwlHelpButton onClick={() => setPhase('confirm')} />
        </div>
      )}

      <OwlConfirmModal
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
        <OwlHelpModal
          key={`help-${challenge.id}`}
          open
          help={help}
          animationsEnabled={animationsEnabled}
          starsAfterSpend={starsAfterSpend}
          onClose={() => setPhase('idle')}
          onFinished={() => {
            onOwlSolved();
            setXpEarned(computeChallengeXp(OWL_HELP_STARS_EARNED, !alreadySolved, true));
            setPhase('reward');
          }}
        />
      )}

      <OwlBonusOffer
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
        <BonusChallenge
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
    </>
  );
}
