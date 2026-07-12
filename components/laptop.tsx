"use client";

import { useEffect, useRef } from "react";
import Spline, { type SPEObject } from "@splinetool/react-spline";
import { type Application } from "@splinetool/runtime";

type Props = {
  width: number;
  height: number;
};

function Laptop({ width, height }: Props) {
  const laptopRef = useRef<SPEObject | null>(null);
  const baseScaleRef = useRef<{ x: number; y: number; z: number } | null>(null);

  function onLoad(app: Application) {
    const laptop = app.findObjectByName("Laptop") as SPEObject | null;
    laptopRef.current = laptop;

    if (laptop && !baseScaleRef.current) {
      baseScaleRef.current = {
        x: laptop.scale.x,
        y: laptop.scale.y,
        z: laptop.scale.z,
      };
    }
    if (!laptop || !baseScaleRef.current) return;
    laptop.scale.x = (baseScaleRef.current.x / 1802) * window.innerWidth;
    laptop.scale.y = (baseScaleRef.current.y / 967) * window.innerHeight;
    // console.log("Hello", width, height);
  }

  useEffect(() => {
    if (!laptopRef.current || !baseScaleRef.current) return;
    console.log(laptopRef.current);

    console.log("change", width, height);

    laptopRef.current.scale.x = (baseScaleRef.current.x / 1802) * (width + 2);
    laptopRef.current.scale.y = (baseScaleRef.current.y / 967) * (height + 2);
  }, [width, height]);

  return (
    // <div className="fixed inset-0">
    <Spline
      // scene="https://prod.spline.design/rMI-jQtPNugVMEdx/scene.splinecode"
      scene="https://prod.spline.design/KfRT2LvczyPXYDkH/scene.splinecode"
      onLoad={onLoad}
      // style={{ width: "100%", height: "100%" }}
    />
    // </div>
  );
}

export default Laptop;
