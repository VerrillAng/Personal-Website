"use client";

import { useEffect, useRef, useState } from "react";

import { Rnd } from "react-rnd";
import { ReactLenis, useLenis } from "lenis/react";
import { useWindowSize } from "../hooks/useWindowSize";
import Laptop from "../components/laptop";
import Home from "../components/home";
import AboutMe from "../components/about_me";

import { useScroll, useTransform, motion, useMotionValueEvent, animate as animateValue, useMotionValue } from "framer-motion";

import Image from "next/image";

import Picture1 from "../public/images/akaza.jpg";

import styles from "./page.module.css";

function Page() {
  const lenis = useLenis((lenis) => {
    // called every scroll
    // console.log(lenis);
  });

  // Get Window Size
  const { width, height } = useWindowSize();

  // Window state
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeWindow, setActiveWindow] = useState<string>("home");
  const [isWindowOpen, setIsWindowOpen] = useState(true);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [windowState, setWindowState] = useState({ x: 100, y: 100, width: 600, height: 400 });
  const [savedState, setSavedState] = useState({ x: 100, y: 100, width: 600, height: 400 });

  const animate = (fn: () => void) => {
    setIsAnimating(true);
    fn();
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleMaximize = () => {
    if (!containerRef.current) return;
    setSavedState(windowState);
    animate(() => {
      setWindowState({ x: 0, y: 0, width: containerRef.current!.clientWidth, height: containerRef.current!.clientHeight });
      setIsMaximized(true);
    });
  };

  const handleRestore = () => {
    animate(() => {
      setWindowState(savedState);
      setIsMaximized(false);
    });
  };

  const handleClose = () => {
    setIsWindowOpen(false);
    setIsMaximized(false);
    setActiveWindow("");
  };

  // Framer Motion
  const container = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  // const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);

  const [scanStarted, setScanStarted] = useState(false);
  const scanProgress = useMotionValue(0);

  // Phase 1–2: line grows from center outward horizontally
  const lineScaleX   = useTransform(scanProgress, [0.05, 0.42], [0, 1]);
  const lineOpacity  = useTransform(scanProgress, [0, 0.05, 0.42, 0.68], [0, 1, 1, 0]);
  // Phase 3: once line is full-width, the reveal opens vertically from center
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
                {isWindowOpen && (
                  <Rnd
                    size={{ width: windowState.width, height: windowState.height }}
                    position={{ x: windowState.x, y: windowState.y }}
                    onDragStop={(_, d) => setWindowState(s => ({ ...s, x: d.x, y: d.y }))}
                    onResizeStop={(_, __, ref, ___, pos) => setWindowState({ x: pos.x, y: pos.y, width: ref.offsetWidth, height: ref.offsetHeight })}
                    className={isAnimating ? styles.animating : ""}
                    bounds="parent"
                    dragHandleClassName="drag-handle"
                    minWidth={300}
                    minHeight={200}
                    disableDragging={isMaximized}
                    enableResizing={!isMaximized}
                  >
                    {activeWindow === "home" && (
                      <Home isMaximized={isMaximized} onMaximize={handleMaximize} onRestore={handleRestore} onClose={handleClose} />
                    )}
                    {activeWindow === "about_me" && (
                      <AboutMe isMaximized={isMaximized} onMaximize={handleMaximize} onRestore={handleRestore} onClose={handleClose} />
                    )}
                  </Rnd>
                )}
              </div>
            </div>
            <div className="h-14 flex items-center">
              {/* Logo */}
              <div className="flex-1 flex items-center pl-3">
                <Image src="/images/Logo_Brown.svg" alt="Logo" width={40} height={40} />
              </div>
              {/* Dock Options */}
              <div className="flex items-center gap-8 mt-1">
                <div className="relative flex items-center justify-center w-6 h-6">
                  <Image src="/images/dock_icons/home.svg" alt="Home" width={20} height={20} />
                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#76594D] ${activeWindow === "home" ? "opacity-100" : "opacity-0"}`} />
                </div>
                <div className="relative flex items-center justify-center w-6 h-6">
                  <Image src="/images/dock_icons/about_me.svg" alt="About Me" width={18} height={18} />
                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#76594D] ${activeWindow === "about_me" ? "opacity-100" : "opacity-0"}`} />
                </div>
                <div className="relative flex items-center justify-center w-6 h-6">
                  <Image src="/images/dock_icons/projects.svg" alt="Projects" width={25} height={25} />
                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#76594D] ${activeWindow === "projects" ? "opacity-100" : "opacity-0"}`} />
                </div>
                <div className="relative flex items-center justify-center w-6 h-6">
                  <Image src="/images/dock_icons/skills.svg" alt="Skills" width={15} height={15} />
                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#76594D] ${activeWindow === "skills" ? "opacity-100" : "opacity-0"}`} />
                </div>
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
