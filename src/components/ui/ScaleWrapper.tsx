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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;
      
      const isMobileScreen = window.innerWidth < 1024 || window.innerHeight > window.innerWidth;
      setIsMobile(isMobileScreen);

      if (isMobileScreen) {
        setScale(1);
        return;
      }

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
    <div className={`flex w-full items-center justify-center relative ${isMobile ? 'min-h-[100dvh]' : 'h-full overflow-hidden'}`}>
      <div 
        ref={containerRef}
        style={{ 
          width: isMobile ? '100%' : targetWidth,
          height: isMobile ? 'auto' : targetHeight,
          minHeight: isMobile ? '100dvh' : targetHeight,
          transform: isMobile ? 'none' : `scale(${scale})`,
          transformOrigin: 'center center'
        }}
        className={`relative transition-transform duration-100 ease-out ${isMobile ? '' : 'origin-center overflow-hidden'} max-w-[100vw] overflow-x-hidden`}
      >
        {children}
      </div>
    </div>
  );
}


