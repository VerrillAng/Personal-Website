"use client";

import { useEffect, useRef } from "react";

import { ReactLenis, useLenis } from "lenis/react";
import { useWindowSize } from "../hooks/useWindowSize";
import Laptop from "../components/laptop";

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

  // // Framer Motion
  // const container = useRef<HTMLDivElement | null>(null);
  // const { scrollYProgress } = useScroll({
  //   target: container,
  //   offset: ["start start", "end end"],
  // });

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
      {/* <div ref={container} className="relative h-[calc(100vh+700px)]">
        <div className="sticky top-0 h-[100vh] bg-orange-500">
          <Laptop width={width} height={height}></Laptop>
        </div>
      </div> */}

      <div>
        <div className="h-[100vh] w-[100vw] bg-gradient-to-br from-stone-950 via-gray-900 to-stone-950">
          <header className="min-h-screen flex flex-col items-center justify-center ">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Hi, I'm Verrill
            </h1>
            <h2 className="text-lg md:text-xl text-gray-300">
              Passionate about Software Development and Artificial Intelligence.
            </h2>
          </header>
        </div>
      </div>
    </>
  );
}

export default Page;
