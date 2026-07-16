"use client";

import React, { useEffect, useState, useRef } from "react";

interface DesktopScaleWrapperProps {
  children: React.ReactNode;
  targetWidth?: number;
  targetHeight?: number;
  padding?: number;
}

export function DesktopScaleWrapper({ 
  children, 
  targetWidth = 1280, 
  targetHeight = 800,
  padding = 32
}: DesktopScaleWrapperProps) {
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;
      
      const availableWidth = window.innerWidth - (padding * 2);
      const availableHeight = window.innerHeight - (padding * 2);
      
      const scaleX = availableWidth / targetWidth;
      const scaleY = availableHeight / targetHeight;
      
      // Use the smaller scale to ensure it fits entirely on screen without cutting edges
      const finalScale = Math.min(scaleX, scaleY, 1); 
      
      setScale(finalScale);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [targetWidth, targetHeight, padding]);

  return (
    <div className="flex w-full items-center justify-center relative h-full overflow-hidden">
      <div 
        ref={containerRef}
        style={{ 
          width: targetWidth,
          height: targetHeight,
          minHeight: targetHeight,
          transform: `scale(${scale})`,
          transformOrigin: 'center center'
        }}
        className="relative origin-center overflow-hidden max-w-[100vw] overflow-x-hidden"
      >
        {children}
      </div>
    </div>
  );
}
