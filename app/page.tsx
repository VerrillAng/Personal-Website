"use client";

import { useCallback, useRef, useState } from "react";

import { Rnd } from "react-rnd";
import { ReactLenis, useLenis } from "lenis/react";
import { useWindowSize } from "../hooks/useWindowSize";
import Laptop from "../components/laptop";
import Home from "../components/home";
import AboutMe from "../components/about_me";
import Projects from "../components/projects";
import StartMenu from "../components/start_menu";

import { useScroll, useTransform, motion, useMotionValueEvent, animate as animateValue, useMotionValue } from "framer-motion";

import Image from "next/image";

import Picture1 from "../public/images/akaza.jpg";

import styles from "./page.module.css";

type WindowId = "home" | "about_me" | "projects" | "skills";

type WindowState = {
  x: number;
  y: number;
  width: number;
  height: number;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  savedPos: { x: number; y: number; width: number; height: number };
  zIndex: number;
};

const DEFAULT_SIZES: Record<WindowId, { width: number; height: number }> = {
  home:     { width: 600, height: 400 },
  about_me: { width: 600, height: 500 },
  projects: { width: 700, height: 450 },
  skills:   { width: 600, height: 400 },
};

const OFFSET_STEP = 30;

function makeWindow(id: WindowId, index: number, zIndex: number): WindowState {
  const size = DEFAULT_SIZES[id];
  return {
    x: 80 + index * OFFSET_STEP,
    y: 60 + index * OFFSET_STEP,
    width: size.width,
    height: size.height,
    isOpen: id === "home",
    isMinimized: false,
    isMaximized: false,
    savedPos: { x: 80 + index * OFFSET_STEP, y: 60 + index * OFFSET_STEP, ...size },
    zIndex,
  };
}

const WINDOW_IDS: WindowId[] = ["home", "about_me", "projects", "skills"];

function initialWindows(): Record<WindowId, WindowState> {
  const result = {} as Record<WindowId, WindowState>;
  WINDOW_IDS.forEach((id, i) => {
    result[id] = makeWindow(id, i, id === "home" ? 1 : 0);
  });
  return result;
}

function Page() {
  const lenis = useLenis(() => {});

  const { width, height } = useWindowSize();
  const containerRef = useRef<HTMLDivElement>(null);
  const [windows, setWindows] = useState<Record<WindowId, WindowState>>(initialWindows);
  const [isAnimating, setIsAnimating] = useState(false);
  const topZRef = useRef(1);

  const animate = (fn: () => void) => {
    setIsAnimating(true);
    fn();
    setTimeout(() => setIsAnimating(false), 300);
  };

  const bringToFront = useCallback((id: WindowId) => {
    topZRef.current += 1;
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], zIndex: topZRef.current },
    }));
  }, []);

  const openWindow = useCallback((id: WindowId) => {
    setWindows(prev => {
      if (prev[id].isOpen) {
        topZRef.current += 1;
        return { ...prev, [id]: { ...prev[id], isMinimized: false, zIndex: topZRef.current } };
      }
      topZRef.current += 1;
      const size = DEFAULT_SIZES[id];
      const openCount = Object.values(prev).filter(w => w.isOpen).length;
      const x = 80 + openCount * OFFSET_STEP;
      const y = 60 + openCount * OFFSET_STEP;
      return {
        ...prev,
        [id]: {
          ...prev[id],
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          x, y,
          width: size.width,
          height: size.height,
          savedPos: { x, y, ...size },
          zIndex: topZRef.current,
        },
      };
    });
  }, []);

  const minimizeWindow = useCallback((id: WindowId) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true },
    }));
  }, []);

  const closeWindow = useCallback((id: WindowId) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false, isMinimized: false, isMaximized: false },
    }));
  }, []);

  const maximizeWindow = useCallback((id: WindowId) => {
    if (!containerRef.current) return;
    const cw = containerRef.current.clientWidth;
    const ch = containerRef.current.clientHeight;
    animate(() => {
      setWindows(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          savedPos: { x: prev[id].x, y: prev[id].y, width: prev[id].width, height: prev[id].height },
          x: 0, y: 0, width: cw, height: ch,
          isMaximized: true,
        },
      }));
    });
  }, []);

  const restoreWindow = useCallback((id: WindowId) => {
    animate(() => {
      setWindows(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          ...prev[id].savedPos,
          isMaximized: false,
        },
      }));
    });
  }, []);

  const closeAllWindows = useCallback(() => {
    setWindows(prev => {
      const next = { ...prev };
      for (const id of WINDOW_IDS) {
        next[id] = { ...next[id], isOpen: false, isMinimized: false, isMaximized: false };
      }
      return next;
    });
  }, []);

  const updatePosition = useCallback((id: WindowId, x: number, y: number) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], x, y } }));
  }, []);

  const updateSize = useCallback((id: WindowId, x: number, y: number, w: number, h: number) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], x, y, width: w, height: h } }));
  }, []);

  // Framer Motion
  const container = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const [scanStarted, setScanStarted] = useState(false);
  const scanProgress = useMotionValue(0);

  const lineScaleX  = useTransform(scanProgress, [0.05, 0.42], [0, 1]);
  const lineOpacity = useTransform(scanProgress, [0, 0.05, 0.42, 0.68], [0, 1, 1, 0]);
  const clipPath = useTransform(
    scanProgress,
    [0.42, 1],
    ["inset(50% 0% 50% 0%)", "inset(0% 0% 0% 0%)"]
  );

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v >= 0.98 && !scanStarted) {
      setScanStarted(true);
      animateValue(scanProgress, 1, { duration: 1.0, ease: [0.16, 1, 0.3, 1] });
    } else if (v < 0.9) {
      setScanStarted(false);
      scanProgress.set(0);
    }
  });

  type WindowProps = { isMaximized: boolean; onMaximize: () => void; onRestore: () => void; onMinimize: () => void; onClose: () => void };
  const CONTENT: Record<WindowId, (props: WindowProps) => React.ReactNode> = {
    home:     (p) => <Home {...p} />,
    about_me: (p) => <AboutMe {...p} />,
    projects: (p) => <Projects {...p} />,
    skills:   (p) => <div className="h-full flex items-center justify-center"><span className="text-[#76594D] text-lg font-medium">Skills</span></div>,
  };

  return (
    <>
      <ReactLenis root />
      {/* <div ref={container} className="relative h-[300vh]">
        <div className="sticky top-0 h-[100vh] bg-orange-500">
          <div className="el">
            <motion.div style={{ scale: scale4 }} className="imageContainer">
              <Image src={Picture1} fill alt="image" placeholder="blur" />
            </motion.div>
          </div>
        </div>
      </div> */}
      <div ref={container} className="relative h-[calc(100vh+600px)]">
        <div className="sticky top-0 h-[100vh] relative">
          <Laptop width={width} height={height}></Laptop>
          {/* Portfolio — revealed by scanline clip-path */}
          <motion.div
            style={{ clipPath }}
            className="absolute inset-0 z-10 flex flex-col bg-[#F9EFDD] px-4 pt-4"
          >
            <div className={`flex-1 w-full rounded-2xl ${styles.window}`}>
              <div ref={containerRef} className="relative h-full w-full rounded-2xl bg-[#FBF0D9] overflow-hidden">
                {WINDOW_IDS.map((id) => {
                  const w = windows[id];
                  if (!w.isOpen || w.isMinimized) return null;

                  const content = CONTENT[id];

                  return (
                    <Rnd
                      key={id}
                      size={{ width: w.width, height: w.height }}
                      position={{ x: w.x, y: w.y }}
                      onDragStart={() => bringToFront(id)}
                      onDragStop={(_, d) => updatePosition(id, d.x, d.y)}
                      onResizeStop={(_, __, ref, ___, pos) => updateSize(id, pos.x, pos.y, ref.offsetWidth, ref.offsetHeight)}
                      className={isAnimating ? styles.animating : ""}
                      style={{ zIndex: w.zIndex }}
                      bounds="parent"
                      dragHandleClassName="drag-handle"
                      minWidth={300}
                      minHeight={200}
                      disableDragging={w.isMaximized}
                      enableResizing={!w.isMaximized}
                      onMouseDown={() => bringToFront(id)}
                    >
                      {content({
                        isMaximized: w.isMaximized,
                        onMaximize: () => maximizeWindow(id),
                        onRestore: () => restoreWindow(id),
                        onMinimize: () => minimizeWindow(id),
                        onClose: () => closeWindow(id),
                      })}
                    </Rnd>
                  );
                })}
              </div>
            </div>
            <div className="h-14 flex items-center">
              {/* Start Menu */}
              <div className="flex-1 flex items-center pl-3">
                <StartMenu onShutDown={closeAllWindows} />
              </div>
              {/* Dock Options */}
              <div className="flex items-center gap-8 mt-1">
                <button onClick={() => openWindow("home")} className={`relative flex items-center justify-center w-6 h-6 cursor-pointer ${styles.dockButton}`}>
                  <span className={styles.dockTooltip}>Home</span>
                  <Image src="/images/dock_icons/home.svg" alt="Home" width={20} height={20} />
                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#76594D] ${windows.home.isOpen ? "opacity-100" : "opacity-0"}`} />
                </button>
                <button onClick={() => openWindow("about_me")} className={`relative flex items-center justify-center w-6 h-6 cursor-pointer ${styles.dockButton}`}>
                  <span className={styles.dockTooltip}>About Me</span>
                  <Image src="/images/dock_icons/about_me.svg" alt="About Me" width={18} height={18} />
                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#76594D] ${windows.about_me.isOpen ? "opacity-100" : "opacity-0"}`} />
                </button>
                <button onClick={() => openWindow("projects")} className={`relative flex items-center justify-center w-6 h-6 cursor-pointer ${styles.dockButton}`}>
                  <span className={styles.dockTooltip}>Projects</span>
                  <Image src="/images/dock_icons/projects.svg" alt="Projects" width={25} height={25} />
                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#76594D] ${windows.projects.isOpen ? "opacity-100" : "opacity-0"}`} />
                </button>
                <button onClick={() => openWindow("skills")} className={`relative flex items-center justify-center w-6 h-6 cursor-pointer ${styles.dockButton}`}>
                  <span className={styles.dockTooltip}>Skills</span>
                  <Image src="/images/dock_icons/skills.svg" alt="Skills" width={15} height={15} />
                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#76594D] ${windows.skills.isOpen ? "opacity-100" : "opacity-0"}`} />
                </button>
              </div>
              <div className="flex-1" />
            </div>
          </motion.div>
          {/* Line: appears at center, expands horizontally, then fades as portfolio opens */}
          <motion.div
            style={{
              scaleX: lineScaleX,
              opacity: lineOpacity,
              background: "rgba(255, 255, 255, 0.9)",
              boxShadow: "0 0 16px 6px rgba(255, 220, 150, 0.75)",
            }}
            className="absolute left-0 right-0 top-1/2 h-[2px] z-20 pointer-events-none origin-center -translate-y-px"
          />
        </div>
      </div>
    </>
  );
}

export default Page;
