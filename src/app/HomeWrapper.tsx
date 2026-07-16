"use client";

import { useState, useEffect } from "react";
import HomeClient from "./HomeClient";
import MobileHomeClient from "./MobileHomeClient";

export default function HomeWrapper({ userProfile, urgentTask }: { userProfile: any; urgentTask: any }) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024 || window.innerHeight > window.innerWidth);
    };
    
    // Initial check
    checkMobile();
    
    // Listen for resizes
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // During SSR, we render null to prevent hydration mismatches
  if (isMobile === null) {
    return <div className="w-full h-[100dvh] bg-black"></div>; // Simple fallback while measuring
  }

  if (isMobile) {
    return <MobileHomeClient userProfile={userProfile} urgentTask={urgentTask} />;
  }

  return <HomeClient userProfile={userProfile} urgentTask={urgentTask} />;
}
