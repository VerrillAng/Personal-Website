"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Window from "./window";
import styles from "./home.module.css";

type Props = {
  isMaximized: boolean;
  onMaximize: () => void;
  onRestore: () => void;
  onMinimize: () => void;
  onClose: () => void;
};

const LINKS = [
  { href: "https://github.com/VerrillAng", label: "GitHub profile", icon: "/images/windows/home/gitHub-icon.svg", size: 24 },
  { href: "https://www.linkedin.com/in/verrillangelo/", label: "LinkedIn profile", icon: "/images/windows/home/linkedIn-icon.svg", size: 24 },
  { href: "mailto:verrill.ang@gmail.com", label: "Email me", icon: "/images/windows/home/mail-icon.svg", size: 35 },
];

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

          <div className="flex items-center gap-5">
            {LINKS.map(({ href, label, icon, size }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                aria-label={label}
                className={styles.iconButton}
              >
                <Image src={icon} alt="" width={size} height={size} />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </Window>
  );
}

export default Home;
