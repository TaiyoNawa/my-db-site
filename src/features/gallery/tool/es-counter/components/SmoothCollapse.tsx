// src/features/gallery/tool/es-counter/components/SmoothCollapse.tsx
import { AnimatePresence, motion } from 'framer-motion';
import { FC, ReactNode } from 'react';

type Props = {
  isOpen: boolean;
  children: ReactNode;
};

/**
 * Chakra UIのCollapseの代替。
 * display:noneの遅延によるキュッとした終端を回避するため、
 * framer-motionのAnimatePresenceでDOMごと削除する方式にしている。
 */
export const SmoothCollapse: FC<Props> = ({ isOpen, children }) => {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          style={{ overflow: 'hidden' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
