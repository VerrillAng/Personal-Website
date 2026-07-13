"use client";

import { motion } from "framer-motion";
import Window from "./window";
import SocialLinks from "./social_links";
import styles from "./home.module.css";

type Props = {
  isMaximized: boolean;
  onMaximize: () => void;
  onRestore: () => void;
  onMinimize: () => void;
  onClose: () => void;
};

function Home({ isMaximized, onMaximize, onRestore, onMinimize, onClose }: Props) {
  return (
    <Window title="Home" isMaximized={isMaximized} onMaximize={onMaximize} onRestore={onRestore} onMinimize={onMinimize} onClose={onClose}>
      <div className="h-full flex items-center justify-center px-6">
        <motion.div
          className="flex flex-col items-center text-center gap-10"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-col items-center gap-2">
            <h1 className={styles.name}>Verrill Angelo</h1>
            <p className={styles.subtitle}>CS Student @ SFU</p>
            <p className={styles.tagline}>Software by day, hardware by... also day.</p>
          </div>

          <SocialLinks />
        </motion.div>
      </div>
    </Window>
  );
}

export default Home;
