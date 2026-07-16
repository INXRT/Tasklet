"use client";

import { useState, useEffect } from "react";
import { DashboardClient } from "./DashboardClient";
import { MobileDashboardClient } from "./MobileDashboardClient";

export function DashboardWrapper({ user, activePokemon }: { user: any; activePokemon: any }) {
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
    return <div className="w-full h-full bg-black"></div>; // Simple fallback while measuring
  }

  if (isMobile) {
    return <MobileDashboardClient user={user} activePokemon={activePokemon} />;
  }

  return <DashboardClient user={user} activePokemon={activePokemon} />;
}


