"use client";

import Image from "next/image";
import styles from "./social_links.module.css";

const LINKS = [
  { href: "https://github.com/VerrillAng", label: "GitHub profile", icon: "/images/windows/home/gitHub-icon.svg", size: 24 },
  { href: "https://www.linkedin.com/in/verrillangelo/", label: "LinkedIn profile", icon: "/images/windows/home/linkedIn-icon.svg", size: 24 },
  { href: "mailto:verrill.ang@gmail.com", label: "Email me", icon: "/images/windows/home/mail-icon.svg", size: 30 },
];

function SocialLinks() {
  return (
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
  );
}

export default SocialLinks;
