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
  // On mobile devices, we do not want to force a scaled bounding box.
  // Mobile browsers and CSS are natively responsive, and applying a transform scale
  // breaks dvh units, scrolling, and flex layouts resulting in a tiny, squished UI.
  // Therefore, the MobileScaleWrapper acts purely as a passthrough, 
  // letting native responsive design handle the rendering.

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
      <div className="min-h-full">
        {children}
      </div>
    </div>
  );
}
