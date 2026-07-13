"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./start_menu.module.css";

type Props = {
  onShutDown: () => void;
};

function StartMenu({ onShutDown }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const open = () => setIsOpen(true);

  const close = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      triggerRef.current?.focus();
    }, 100);
  }, []);

  const toggle = () => {
    if (isOpen) close();
    else open();
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };

    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, close]);

  useEffect(() => {
    if (isOpen && !isClosing && panelRef.current) {
      const focusable = panelRef.current.querySelector<HTMLElement>("button, [href], [tabindex]");
      focusable?.focus();
    }
  }, [isOpen, isClosing]);

  const handleShutDown = () => {
    close();
    // ACTION: close all windows. Swap this for a different action later.
    onShutDown();
  };

  return (
    <div className="relative">
      {/* Logo trigger */}
      <button
        ref={triggerRef}
        onClick={toggle}
        className={styles.logoTrigger}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Start menu"
      >
        <Image src="/images/Logo_Brown.svg" alt="Logo" width={40} height={40} />
      </button>

      {/* Popup */}
      {isOpen && (
        <div
          ref={panelRef}
          className={`${styles.panel} ${isClosing ? styles.panelClose : styles.panelOpen}`}
          role="menu"
        >
          {/* Future content sections go here */}

          <div className={styles.divider} />

          {/* Bottom bar */}
          <div className={styles.bottomBar}>
            <div className={styles.profileRow}>
              <Image
                src="/images/dock_icons/menu/anonymous_profile.svg"
                alt=""
                width={38}
                height={38}
                className={styles.profileAvatar}
              />
              <div>
                <div className={styles.profileName}>Anonymous</div>
                <div className={styles.profileSub}>Hello World!</div>
              </div>
            </div>

            <button
              className={styles.powerButton}
              onClick={handleShutDown}
              aria-label="Close all windows"
              role="menuitem"
            >
              <Image
                src="/images/dock_icons/menu/shut_down.svg"
                alt=""
                width={20}
                height={20}
                className={styles.powerIcon}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StartMenu;
