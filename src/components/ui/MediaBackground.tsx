import React from 'react';

export function MediaBackground({ src = "/99836.jpg" }: { src?: string }) {
  const isVideo = src.endsWith('.mp4') || src.endsWith('.webm');

  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden bg-[#09090b]">
      {/* Media Layer */}
      {isVideo ? (
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          src={src}
        />
      ) : (
        <img 
          src={src} 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
      )}
      
      {/* Semi-transparent dark overlay for text legibility (No blur to save GPU) */}
      <div className="absolute inset-0 w-full h-full bg-black/30" />
      
      {/* Vignette / Gradient overlay for depth */}
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
    </div>
  );
}
