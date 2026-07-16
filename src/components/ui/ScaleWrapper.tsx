"use client";

import React, { useEffect, useState } from "react";
import { DesktopScaleWrapper } from "./DesktopScaleWrapper";
import { MobileScaleWrapper } from "./MobileScaleWrapper";

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
  padding = 32
}: ScaleWrapperProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;
      
      const isMobileScreen = window.innerWidth < 1024 || window.innerHeight > window.innerWidth;
      setIsMobile(isMobileScreen);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Avoid hydration mismatch by rendering nothing or a simple wrapper until we know
  if (isMobile === null) {
    return <div className="flex w-full items-center justify-center relative min-h-[100dvh] bg-black/90"></div>;
  }

  if (isMobile) {
    return (
      <MobileScaleWrapper targetHeight={targetHeight === 800 ? 844 : targetHeight}>
        {children}
      </MobileScaleWrapper>
    );
  }

  return (
    <DesktopScaleWrapper 
      targetWidth={targetWidth} 
      targetHeight={targetHeight} 
      padding={padding}
    >
      {children}
    </DesktopScaleWrapper>
  );
}
