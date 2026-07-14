"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";

type CompanionType = "DRAGON" | "GRIFFIN" | "PHOENIX";

const COMPANION_COLORS: Record<CompanionType, string> = {
  DRAGON: "#ff3300",
  GRIFFIN: "#00eeff",
  PHOENIX: "#ffaa00",
};

function CoreMesh({ type }: { type: CompanionType }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create a material with glassmorphic properties
  const material = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: COMPANION_COLORS[type] || COMPANION_COLORS.DRAGON,
    transmission: 0.9,
    opacity: 1,
    metalness: 0.2,
    roughness: 0.1,
    ior: 1.5,
    thickness: 2,
    specularIntensity: 1,
    emissive: COMPANION_COLORS[type] || COMPANION_COLORS.DRAGON,
    emissiveIntensity: 0.2,
  }), [type]);

  // Subtle rotation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
      meshRef.current.rotation.x += delta * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} material={material} castShadow receiveShadow>
        <icosahedronGeometry args={[1.5, 0]} />
        
        {/* Inner core to give depth */}
        <mesh>
          <icosahedronGeometry args={[0.8, 1]} />
          <meshBasicMaterial color={COMPANION_COLORS[type]} wireframe opacity={0.5} transparent />
        </mesh>
      </mesh>
      
      {/* Dynamic light inside the core */}
      <pointLight color={COMPANION_COLORS[type]} intensity={50} distance={10} />
    </Float>
  );
}

export function Companion3D({ type }: { type: CompanionType }) {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          
          <CoreMesh type={type} />
          
          <Environment preset="city" />
          
          <ContactShadows 
            position={[0, -2, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2} 
            far={4} 
            color={COMPANION_COLORS[type] || COMPANION_COLORS.DRAGON}
          />
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
