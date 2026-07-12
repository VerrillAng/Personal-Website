"use client";

import { motion, useMotionValue, useTransform, useSpring, type MotionValue } from "framer-motion";
import Window from "./window";
import styles from "./about_me.module.css";

type Props = {
  isMaximized: boolean;
  onMaximize: () => void;
  onRestore: () => void;
  onMinimize: () => void;
  onClose: () => void;
};

const SPRING = { stiffness: 120, damping: 18, mass: 0.8 };

function useLayer(springX: MotionValue<number>, springY: MotionValue<number>, depth: number) {
  const x = useTransform(springX, (v) => -v * depth);
  const y = useTransform(springY, (v) => -v * depth);
  return { x, y };
}

function AboutMe({ isMaximized, onMaximize, onRestore, onMinimize, onClose }: Props) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, SPRING);
  const springY = useSpring(rawY, SPRING);

  const grid     = useLayer(springX, springY, 4);
  const backing  = useLayer(springX, springY, 10);
  const portrait = useLayer(springX, springY, 18);
  const sticky   = useLayer(springX, springY, 28);
  const tag      = useLayer(springX, springY, 34);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set(((e.clientX - r.left) / r.width) * 2 - 1);
    rawY.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <Window title="About Me" isMaximized={isMaximized} onMaximize={onMaximize} onRestore={onRestore} onMinimize={onMinimize} onClose={onClose}>
      <div className="h-full flex items-center justify-center">
        <div
          className={styles.parallaxPortrait}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div className={styles.ppGrid}    style={grid} />
          <motion.div className={styles.ppBacking} style={{ ...backing, rotate: -3.5 }} />
          <motion.div className={styles.ppPortrait} style={portrait} />
          <motion.div className={styles.ppSticky}   style={{ ...sticky, rotate: -7 }}>
            <div className={styles.ppStickyDoodle} />
            <div className={styles.ppStickyLine} />
            <div className={`${styles.ppStickyLine} ${styles.short}`} />
          </motion.div>
          <motion.div className={styles.ppTag} style={{ ...tag, rotate: 8 }}>
            <span className={styles.ppTagHole} />
            <span>SFU</span>
          </motion.div>
        </div>
      </div>
    </Window>
  );
}

export default AboutMe;
