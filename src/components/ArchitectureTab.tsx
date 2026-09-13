import React from 'react';
import { motion } from 'motion/react';
import { ArchitectureNotes } from './ArchitectureNotes';

interface ArchitectureTabProps {
  isDark: boolean;
}

export function ArchitectureTab({ isDark }: ArchitectureTabProps) {
  return (
    <motion.div
      key="architecture"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <ArchitectureNotes isDark={isDark} />
    </motion.div>
  );
}
