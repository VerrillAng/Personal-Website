"use client";

import { motion, useMotionValue, useTransform, useSpring, type MotionValue } from "framer-motion";
import Window from "./window";
import SocialLinks from "./social_links";
import styles from "./about_me.module.css";

type Props = {
  isMaximized: boolean;
  onMaximize: () => void;
  onRestore: () => void;
  onMinimize: () => void;
  onClose: () => void;
};

const SKILLS: Record<string, string[]> = {
  Languages: ["Kotlin", "Python", "Java", "TypeScript", "JavaScript", "Swift", "C", "C++", "SQL", "HTML", "CSS"],
  "Front-end": ["React Native", "React", "Next.js", "Tailwind", "Bootstrap"],
  "Back-end": ["Flask", "FastAPI", "REST APIs", "PostgreSQL", "MySQL", "MongoDB", "Docker", "AWS"],
  "Data Science & ML": ["Apache Spark", "TensorFlow", "Pandas", "NumPy", "Matplotlib", "Scikit-learn", "OpenCV"],
  Tools: ["Jenkins", "GitLab CI/CD", "Selenium", "Pytest", "Postman", "LambdaTest", "TestRail", "Sentry", "Charles"],
};

const SPRING = { stiffness: 120, damping: 18, mass: 0.8 };

function useLayer(springX: MotionValue<number>, springY: MotionValue<number>, depth: number) {
  const x = useTransform(springX, (v) => -v * depth);
  const y = useTransform(springY, (v) => -v * depth);
  return { x, y };
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] as const },
});

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
      <div className={styles.scrollArea}>
        <div className="flex flex-col gap-6">

          {/* Top row: portrait left, greeting center */}
          <motion.div className={styles.heroRow} {...fadeUp(0)}>
            {/* Parallax portrait */}
            <div
              className={styles.parallaxPortrait}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
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

            {/* Greeting */}
            <div className={styles.greetingBlock}>
              <h2 className={styles.greeting}>Hey, I&apos;m Verrill 👋</h2>
              <p className={styles.introText}>
                I&apos;m a Computer Science student at Simon Fraser University who enjoys
                building things — from full-stack web apps to hardware projects on my desk.
                Always curious, always tinkering.
              </p>
            </div>
          </motion.div>

          {/* Currently */}
          <motion.div className={styles.card} {...fadeUp(0.06)}>
            <h3 className={styles.sectionHeading}>Currently</h3>
            <ul className={styles.bulletList}>
              <li>Studying CS @ SFU</li>
              <li>Building side projects with React &amp; Next.js</li>
              <li>Exploring embedded systems and IoT</li>
            </ul>
          </motion.div>

          {/* Toolbox */}
          <motion.div className={styles.card} {...fadeUp(0.12)}>
            <h3 className={styles.sectionHeading}>Toolbox</h3>
            <div className="flex flex-col gap-3">
              {Object.entries(SKILLS).map(([category, items]) => (
                <div key={category}>
                  <p className={styles.pillLabel}>{category}</p>
                  <div className={styles.pillGroup}>
                    {items.map((t) => <span key={t} className={styles.pill}>{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* When I'm not at a terminal */}
          <motion.div className={styles.card} {...fadeUp(0.18)}>
            <h3 className={styles.sectionHeading}>When I&apos;m not at a terminal</h3>
            <p className={styles.bodyText}>
              You&apos;ll probably find me experimenting with new recipes, going on hikes
              around Vancouver, or diving into a rabbit hole about some niche hardware topic.
              I also enjoy photography and collecting mechanical keyboards.
            </p>
          </motion.div>

          {/* Say hi */}
          <motion.div className={styles.sayHiSection} {...fadeUp(0.24)}>
            <h3 className={styles.sectionHeading}>Say hi</h3>
            <SocialLinks />
          </motion.div>

        </div>
      </div>
    </Window>
  );
}

export default AboutMe;
