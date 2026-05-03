"use client";

import { useEffect, useRef } from "react";

import { ReactLenis, useLenis } from "lenis/react";
import { useWindowSize } from "../hooks/useWindowSize";
import Laptop from "../components/laptop";
import HomeAboutMe from "../components/home_about_me";

import Spline, { type SPEObject } from "@splinetool/react-spline";
import { type Application } from "@splinetool/runtime";
import { useScroll, useTransform, motion } from "framer-motion";

import Image from "next/image";

import Picture1 from "../public/images/akaza.jpg";

function Page() {
  const lenis = useLenis((lenis) => {
    // called every scroll
    // console.log(lenis);
  });

  // Get Window Size
  const { width, height } = useWindowSize();

  // Framer Motion
  const container = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  // const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);

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
      {/* <div ref={container} className="relative h-[calc(100vh+700px)]"> */}
      <div ref={container} className="relative h-[calc(100vh+600px)]">
        <div className="sticky top-0 h-[100vh]">
          <Laptop width={width} height={height}></Laptop>
        </div>
      </div>

      <div>
        <HomeAboutMe></HomeAboutMe>
      </div>
    </>
  );
}

export default Page;
