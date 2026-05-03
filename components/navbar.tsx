"use client";

import { useState } from "react";
import styles from "./navbar.module.css";

function Navbar() {
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      <div
        onClick={() => {
          setIsActive(!isActive);
        }}
        className={styles.button}
      >
        <div></div>
      </div>
    </>
  );
}

export default Navbar;
