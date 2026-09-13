import React from 'react';
import { motion } from 'motion/react';
import { CheckoutOverview } from './CheckoutOverview';
import { SdkCodeViewer } from './SdkCodeViewer';

interface DocsTabProps {
  isDark: boolean;
}

export function DocsTab({ isDark }: DocsTabProps) {
  return (
    <motion.div
      key="docs"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-6"
    >
      <CheckoutOverview isDark={isDark} />
      <SdkCodeViewer isDark={isDark} />
    </motion.div>
  );
}
