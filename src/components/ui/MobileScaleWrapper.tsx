"use client";

import React, { useEffect, useState, useRef } from "react";

interface MobileScaleWrapperProps {
  children: React.ReactNode;
  targetHeight?: number;
}

export function MobileScaleWrapper({ 
  children, 
  targetHeight = 844 // Standard modern mobile height
}: MobileScaleWrapperProps) {
  const [scale, setScale] = useState(1);
  const [logicalWidth, setLogicalWidth] = useState(390); // Default logical width
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;
      
      // We want to lock the height to targetHeight, and scale it to fit the physical screen height
      const newScale = window.innerHeight / targetHeight;
      
      // Calculate what the logical (unscaled) width must be so that when scaled, 
      // it exactly perfectly matches the physical screen width.
      const newLogicalWidth = window.innerWidth / newScale;
      
      setScale(newScale);
      setLogicalWidth(newLogicalWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [targetHeight]);

  return (
    <div className="flex w-full items-center justify-center relative h-[100dvh] overflow-hidden">
      <div 
        ref={containerRef}
        style={{ 
          width: logicalWidth,
          height: targetHeight,
          minHeight: targetHeight,
          transform: `scale(${scale})`,
          transformOrigin: 'center center'
        }}
        className="relative origin-center overflow-hidden"
      >
        {children}
      </div>
    </div>
  );
}
