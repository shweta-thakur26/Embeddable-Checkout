import React, { useMemo } from 'react';

interface AmbientBackgroundProps {
  isDark: boolean;
  activeProductLoading: string | null;
  activeInteraction: string | null;
  checkoutMode: 'modal' | 'inline';
}

export function AmbientBackground({
  isDark,
  activeProductLoading,
  activeInteraction,
  checkoutMode,
}: AmbientBackgroundProps) {
  const ambientBackground = useMemo(() => {
    if (isDark) {
      if (activeProductLoading) {
        return 'radial-gradient(1200px circle at 50% 30%, rgba(16, 185, 129, 0.22) 0%, transparent 65%), radial-gradient(800px circle at 80% 20%, rgba(99, 102, 241, 0.16) 0%, transparent 50%)';
      }
      if (activeInteraction === 'prod_pro') {
        return 'radial-gradient(1100px circle at 50% 20%, rgba(99, 102, 241, 0.20) 0%, transparent 60%), radial-gradient(900px circle at 80% 40%, rgba(16, 185, 129, 0.14) 0%, transparent 50%), radial-gradient(800px circle at 20% 60%, rgba(245, 158, 11, 0.08) 0%, transparent 50%)';
      }
      if (activeInteraction === 'prod_enterprise') {
        return 'radial-gradient(1100px circle at 75% 25%, rgba(147, 51, 234, 0.22) 0%, transparent 60%), radial-gradient(800px circle at 25% 45%, rgba(59, 130, 246, 0.14) 0%, transparent 50%)';
      }
      if (activeInteraction === 'prod_starter') {
        return 'radial-gradient(1000px circle at 25% 25%, rgba(16, 185, 129, 0.20) 0%, transparent 60%), radial-gradient(800px circle at 75% 35%, rgba(14, 165, 233, 0.12) 0%, transparent 50%)';
      }
      if (activeInteraction === 'prod_credits_pack') {
        return 'radial-gradient(1000px circle at 85% 30%, rgba(245, 158, 11, 0.20) 0%, transparent 60%), radial-gradient(800px circle at 20% 30%, rgba(16, 185, 129, 0.12) 0%, transparent 50%)';
      }
      if (checkoutMode === 'inline') {
        return 'radial-gradient(1200px circle at 50% 50%, rgba(16, 185, 129, 0.18) 0%, transparent 65%), radial-gradient(800px circle at 50% 10%, rgba(99, 102, 241, 0.10) 0%, transparent 50%)';
      }
      return 'radial-gradient(1200px circle at 50% -10%, rgba(16, 185, 129, 0.12) 0%, transparent 65%), radial-gradient(900px circle at 90% 25%, rgba(99, 102, 241, 0.09) 0%, transparent 55%), radial-gradient(800px circle at 10% 45%, rgba(56, 189, 248, 0.06) 0%, transparent 50%)';
    } else {
      if (activeProductLoading) {
        return 'radial-gradient(1200px circle at 50% 30%, rgba(16, 185, 129, 0.15) 0%, transparent 65%), radial-gradient(800px circle at 80% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)';
      }
      if (activeInteraction === 'prod_pro') {
        return 'radial-gradient(1100px circle at 50% 20%, rgba(99, 102, 241, 0.12) 0%, transparent 60%), radial-gradient(900px circle at 80% 40%, rgba(16, 185, 129, 0.09) 0%, transparent 50%), radial-gradient(800px circle at 20% 60%, rgba(245, 158, 11, 0.05) 0%, transparent 50%)';
      }
      if (activeInteraction === 'prod_enterprise') {
        return 'radial-gradient(1100px circle at 75% 25%, rgba(147, 51, 234, 0.12) 0%, transparent 60%), radial-gradient(800px circle at 25% 45%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)';
      }
      if (activeInteraction === 'prod_starter') {
        return 'radial-gradient(1000px circle at 25% 25%, rgba(16, 185, 129, 0.12) 0%, transparent 60%), radial-gradient(800px circle at 75% 35%, rgba(14, 165, 233, 0.08) 0%, transparent 50%)';
      }
      if (activeInteraction === 'prod_credits_pack') {
        return 'radial-gradient(1000px circle at 85% 30%, rgba(245, 158, 11, 0.12) 0%, transparent 60%), radial-gradient(800px circle at 20% 30%, rgba(16, 185, 129, 0.08) 0%, transparent 50%)';
      }
      if (checkoutMode === 'inline') {
        return 'radial-gradient(1200px circle at 50% 50%, rgba(16, 185, 129, 0.11) 0%, transparent 65%), radial-gradient(800px circle at 50% 10%, rgba(59, 130, 246, 0.06) 0%, transparent 50%)';
      }
      return 'radial-gradient(1200px circle at 50% -10%, rgba(16, 185, 129, 0.07) 0%, transparent 60%), radial-gradient(900px circle at 90% 25%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(800px circle at 10% 45%, rgba(245, 158, 11, 0.03) 0%, transparent 50%)';
    }
  }, [isDark, activeInteraction, activeProductLoading, checkoutMode]);

  return (
    <div
      className="ambient-glow-layer fixed inset-0 pointer-events-none -z-10"
      style={{ background: ambientBackground }}
    />
  );
}
