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
  padding = 32
}: ScaleWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileHeight, setMobileHeight] = useState('auto');
  
  const targetMobileWidth = 390;

  useEffect(() => {
    let currentScale = 1;
    let currentIsMobile = false;
    
    const handleResize = () => {
      if (typeof window === "undefined") return;
      
      const isMobileScreen = window.innerWidth < 1024 || window.innerHeight > window.innerWidth;
      setIsMobile(isMobileScreen);
      currentIsMobile = isMobileScreen;

      if (isMobileScreen) {
        // Calculate smart scaling for mobile based on standard 390px width
        const scaleX = window.innerWidth / targetMobileWidth;
        // Don't scale up too massively on tablets that pass as mobile, cap it reasonably
        currentScale = Math.min(scaleX, 1.5);
        setScale(currentScale);
      } else {
        const availableWidth = window.innerWidth - (padding * 2);
        const availableHeight = window.innerHeight - (padding * 2);
        
        const scaleX = availableWidth / targetWidth;
        const scaleY = availableHeight / targetHeight;
        
        currentScale = Math.min(scaleX, scaleY, 1); 
        setScale(currentScale);
      }
      
      updateMobileHeight();
    };

    const updateMobileHeight = () => {
      if (currentIsMobile && containerRef.current) {
        // Multiply actual DOM height by scale to get visual height, so scrolling works perfectly
        const rect = containerRef.current.getBoundingClientRect();
        // getBoundingClientRect().height already returns the scaled height if transform is applied!
        // Wait, if transform is applied, rect.height IS the scaled height.
        // We can just set the parent div's minHeight to rect.height.
        // But since we use React state, it might loop if we're not careful.
        // Actually, scrollHeight gives the unscaled height.
        const unscaledHeight = containerRef.current.scrollHeight;
        setMobileHeight(`${unscaledHeight * currentScale}px`);
      }
    };

    handleResize();
    
    window.addEventListener("resize", handleResize);
    
    // Use ResizeObserver to detect content changes (like opening accordions) that change height
    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      observer = new ResizeObserver(() => {
        updateMobileHeight();
      });
      observer.observe(containerRef.current);
    }
    
    return () => {
      window.removeEventListener("resize", handleResize);
      if (observer) observer.disconnect();
    };
  }, [targetWidth, targetHeight, padding]);

  return (
    <div 
      className={`flex w-full relative ${isMobile ? 'h-[100dvh] overflow-y-auto overflow-x-hidden justify-center items-start' : 'h-full overflow-hidden items-center justify-center'}`}
    >
      <div style={{ height: isMobile ? mobileHeight : '100%', width: '100%', display: 'flex', justifyContent: 'center', minHeight: isMobile ? 'auto' : '100dvh' }}>
        <div 
          ref={containerRef}
          style={{ 
            width: isMobile ? targetMobileWidth : targetWidth,
            height: isMobile ? 'auto' : targetHeight,
            minHeight: isMobile ? '100dvh' : targetHeight,
            transform: `scale(${scale})`,
            transformOrigin: isMobile ? 'top center' : 'center center'
          }}
          className={`relative ${isMobile ? 'origin-top' : 'origin-center overflow-hidden max-w-[100vw]'} overflow-x-hidden`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
