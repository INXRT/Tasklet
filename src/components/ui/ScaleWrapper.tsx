"use client";

import React, { useEffect, useState, useRef } from "react";

interface ScaleWrapperProps {
  children: React.ReactNode;
  targetWidth?: number;
  targetHeight?: number;
  padding?: number;
}

export function ScaleWrapper({ 
  children, 
  targetWidth = 1280, 
  targetHeight = 800,
  padding = 32 // Margin in pixels around the box
}: ScaleWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;
      
      const availableWidth = window.innerWidth - (padding * 2);
      const availableHeight = window.innerHeight - (padding * 2);
      
      // Calculate how much we need to scale to fit both width and height
      const scaleX = availableWidth / targetWidth;
      const scaleY = availableHeight / targetHeight;
      
      // Use the smaller scale to ensure it fits entirely on screen without cutting edges
      const finalScale = Math.min(scaleX, scaleY, 1); // Don't scale up past 1x if on a huge monitor
      
      setScale(finalScale);
    };

    // Initial calculation
    handleResize();
    
    // Listen for resizes
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [targetWidth, targetHeight, padding]);

  return (
    <div className="flex w-full h-full items-center justify-center overflow-hidden relative">
      <div 
        ref={containerRef}
        style={{ 
          width: targetWidth, 
          height: targetHeight,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          transition: "transform 0.1s ease-out"
        }}
        className="flex flex-col relative z-10 shrink-0"
      >
        {children}
      </div>
    </div>
  );
}
