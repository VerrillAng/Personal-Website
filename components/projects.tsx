"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Window from "./window";
import styles from "./projects.module.css";

type Props = {
  isMaximized: boolean;
  onMaximize: () => void;
  onRestore: () => void;
  onMinimize: () => void;
  onClose: () => void;
};

type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  url?: string;
  details: string;
  image?: string;
  imagePosition?: string;
  gallery?: { src: string; alt?: string }[];
};

const PROJECTS: Project[] = [
  {
    id: "expense-tracker",
    title: "AI Automated Expense and Debt Tracker",
    description: "Automated expense entry and bill-splitting with Plaid, Splitwise, and a Telegram bot powered by Ollama.",
    tags: ["React", "Python", "Flask", "Ollama", "LangChain", "Plaid"],
    image: "/images/windows/projects/ai_automated_expense/main.png",
    gallery: [{ src: "/images/windows/projects/ai_automated_expense/main.png", alt: "Expense Tracker overview" }],
    details: "Eliminated manual expense entry and bill-splitting by integrating Plaid transaction syncing with Splitwise API, automating the end-to-end shared payment workflow. Engineered a Telegram bot powered by a local Ollama LLM and LangChain that categorized transactions and answered natural-language user queries, keeping sensitive bank data off external APIs. Automated expense entry by syncing Plaid transactions with Splitwise API bill-splitting.",
  },
  {
    id: "ai-call-facilitator",
    title: "AI Call Facilitator",
    description: "End-to-end AI phone support with real-time transcription, async WebSockets, and conversation logging.",
    tags: ["Python", "FastAPI", "Twilio", "Deepgram", "OpenAI API"],
    image: "/images/windows/projects/ai_call_facilitator/main.png",
    gallery: [{ src: "/images/windows/projects/ai_call_facilitator/main.png", alt: "AI Call Facilitator overview" }],
    details: "Automated end-to-end phone support by building an AI call facilitator with Twilio, Deepgram, and OpenAI API, reducing manual call handling. Designed an async FastAPI backend with WebSockets supporting concurrent AI calls with real-time, low-latency interaction. Implemented automated call transcription and conversation logging with Deepgram, improving support handoff documentation and debugging visibility.",
  },
  {
    id: "credify",
    title: "Credify – AI Credit Insights Platform",
    description: "Mobile credit insights app with a Fetch.ai agent, Ollama LLM, and Plaid + Firestore integration.",
    tags: ["React Native", "TypeScript", "Flask", "Firebase", "Fetch.ai"],
    image: "/images/windows/projects/credify/main.jpg",
    gallery: [{ src: "/images/windows/projects/credify/main.jpg", alt: "Credify overview" }],
    url: "https://github.com/kathryntanardy/Credify",
    details: "Built a mobile credit insights app with React, TypeScript, and Flask, providing feedback on spending behavior and credit utilization. Automated credit health monitoring with a Fetch.ai agent and local Ollama LLM, analyzing utilization and payment patterns to generate improvement suggestions. Connected Plaid with Firestore to process transactions and credit score history, replacing manual financial tracking.",
  },
  {
    id: "rps-shock",
    title: "Rock, Paper, Scissors, Shock",
    description: "1st place hardware game at SillyHacks — multiplayer ESP32 glove controllers with wireless gesture recognition.",
    tags: ["ESP32", "Arduino C++", "WebSockets"],
    image: "/images/windows/projects/rock_paper_scissors_shock/main.jpeg",
    gallery: [{ src: "/images/windows/projects/rock_paper_scissors_shock/main.jpeg", alt: "Rock Paper Scissors Shock" }],
    details: "Won 1st Overall at SillyHacks (109 participants) by engineering a real-time multiplayer hardware game across 3 ESP32 microcontrollers with wireless gesture recognition via flex sensors. Built a central ESP32-hosted web interface with WebSockets for live game state, connectivity monitoring, and move display across two wireless glove controllers.",
  },
  {
    id: "lidar-fusion",
    title: "3D LiDAR + RGB Camera Fusion",
    description: "End-to-end sensor fusion pipeline on a Jetson Orin Nano with ROS 2, MATLAB calibration, and RViz overlays.",
    tags: ["Python", "ROS 2", "OpenCV", "MATLAB", "Jetson Nano"],
    image: "/images/windows/projects/lidar_camera/main.png.png",
    imagePosition: "center 20%",
    gallery: [{ src: "/images/windows/projects/lidar_camera/main.png.png", alt: "LiDAR + RGB fusion pipeline" }],
    details: "Developed a time-synced data acquisition node using ROS 2 and ApproximateTimeSynchronizer to capture paired RGB images and 3D LiDAR point clouds from a ZED stereo camera and Robosense AIRY LiDAR on a mobile robot. Performed 6DoF LiDAR–camera extrinsic calibration using MATLAB Lidar Camera Calibrator with ROI filtering and initial transforms, achieving translation errors below 3cm and reprojection errors under 15px. Built an end-to-end sensor fusion pipeline on an NVIDIA Jetson Orin Nano, publishing calibrated transforms via tf2 and visualizing aligned LiDAR-camera overlays in RViz2.",
  },
  {
    id: "piano-tiles-bot",
    title: "Piano Tiles Bot",
    description: "A bot that plays Piano Tiles autonomously using computer vision.",
    tags: ["Python", "Computer Vision"],
    url: "https://github.com/VerrillAng/Piano_Tiles_Bot",
    details: "An automated bot that plays the Piano Tiles mobile game using computer vision and screen capture. Detects tile positions in real-time and simulates taps with precise timing.",
  },
  {
    id: "bargai",
    title: "BargAI",
    description: "An AI-powered bargaining assistant.",
    tags: ["Python", "AI"],
    url: "https://github.com/Bandoozle/BargAI",
    details: "An AI-powered tool that assists with price negotiation and bargaining strategies. Uses natural language processing to analyze and suggest optimal bargaining approaches.",
  },
];

type Tab = {
  id: string;
  label: string;
  projectId: string | null;
};

function Projects({ isMaximized, onMaximize, onRestore, onMinimize, onClose }: Props) {
  const [tabs, setTabs] = useState<Tab[]>([{ id: "home", label: "Projects", projectId: null }]);
  const [activeTabId, setActiveTabId] = useState("home");
  const [search, setSearch] = useState("");

  const activeTab = tabs.find(t => t.id === activeTabId) ?? tabs[0];
  const activeProject = activeTab.projectId ? PROJECTS.find(p => p.id === activeTab.projectId) : null;

  const filtered = useMemo(() => {
    if (!search.trim()) return PROJECTS;
    const q = search.toLowerCase();
    return PROJECTS.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [search]);

  const openProject = (project: Project) => {
    const existing = tabs.find(t => t.projectId === project.id);
    if (existing) {
      setActiveTabId(existing.id);
      return;
    }
    const newTab: Tab = { id: `tab-${project.id}`, label: project.title, projectId: project.id };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const idx = tabs.findIndex(t => t.id === tabId);
    const next = tabs.filter(t => t.id !== tabId);
    setTabs(next);
    if (activeTabId === tabId) {
      setActiveTabId(next[Math.min(idx, next.length - 1)].id);
    }
  };

  const tabsHeader = (
    <div className={styles.headerTabs}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`${styles.headerTab} ${tab.id === activeTabId ? styles.headerTabActive : ""}`}
          onClick={() => setActiveTabId(tab.id)}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {tab.label}
          {tabs.length > 1 && (
            <span className={styles.tabClose} onClick={(e) => closeTab(tab.id, e)}>×</span>
          )}
        </button>
      ))}
    </div>
  );

  return (
    <Window headerLeft={tabsHeader} isMaximized={isMaximized} onMaximize={onMaximize} onRestore={onRestore} onMinimize={onMinimize} onClose={onClose}>
      <div className="h-full flex flex-col">
        {/* Address bar */}
        <div className={styles.addressBar}>
          <input
            className={styles.addressInput}
            value={activeProject ? `projects/${activeProject.id}` : "projects://home"}
            readOnly
            tabIndex={-1}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0">
          {activeProject ? (
            <div className={styles.detailPage} data-lenis-prevent>
              <h2 className={styles.detailTitle}>{activeProject.title}</h2>
              <div className={styles.cardTags} style={{ marginBottom: 16 }}>
                {activeProject.tags.map(t => <span key={t} className={styles.cardTag}>{t}</span>)}
              </div>

              {activeProject.gallery && activeProject.gallery.length > 0 && (
                <div className={styles.gallery}>
                  {activeProject.gallery.map((img, i) => (
                    <div key={i} className={styles.galleryItem}>
                      <Image
                        src={img.src}
                        alt={img.alt ?? activeProject.title}
                        width={600}
                        height={340}
                        className={styles.galleryImage}
                      />
                    </div>
                  ))}
                </div>
              )}

              <p className={styles.detailDesc}>{activeProject.details}</p>
              {activeProject.url && (
                <a
                  href={activeProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.detailLink}
                >
                  View on GitHub →
                </a>
              )}
            </div>
          ) : (
            <div className={styles.homepage} data-lenis-prevent>
              <span className={styles.homeLogo}>Projects</span>
              <input
                className={styles.searchBox}
                placeholder="Search projects..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <div className={styles.cardsGrid}>
                {filtered.map(project => (
                  <button
                    key={project.id}
                    className={styles.projectCard}
                    onClick={() => openProject(project)}
                  >
                    <div className={styles.stickyNote}>
                      {project.image ? (
                        <Image src={project.image} alt={project.title} fill className={styles.stickyImage} style={project.imagePosition ? { objectPosition: project.imagePosition } : undefined} />
                      ) : (
                        <span className={styles.stickyPlaceholder}>📌</span>
                      )}
                    </div>
                    <span className={styles.cardTitle}>{project.title}</span>
                    <span className={styles.cardDesc}>{project.description}</span>
                    <div className={styles.cardTags}>
                      {project.tags.map(t => <span key={t} className={styles.cardTag}>{t}</span>)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Window>
  );
}

export default Projects;
