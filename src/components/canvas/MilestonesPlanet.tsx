import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MilestonesPlanetProps {
  isActive: boolean;
  scrollProgress: number;
}

export const MilestonesPlanet: React.FC<MilestonesPlanetProps> = ({ isActive: _isActive, scrollProgress }) => {
  const crystalPlanetRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Points>(null);

  // Generate helical comet trail particles around the crystalline planet
  const trailParticleCount = 600;
  const positions = React.useMemo(() => {
    const pos = new Float32Array(trailParticleCount * 3);
    for (let i = 0; i < trailParticleCount; i++) {
      // Helix math
      const t = (i / trailParticleCount);
      const angle = t * Math.PI * 8; // 4 loops
      const radius = 1.4 + t * 2.2;
      const y = -1.5 + t * 3.0; // rises vertically
      
      pos[i * 3] = radius * Math.cos(angle);
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = radius * Math.sin(angle);
    }
    return pos;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (crystalPlanetRef.current) {
      // Slow faceted tumble
      crystalPlanetRef.current.rotation.x = time * 0.05;
      crystalPlanetRef.current.rotation.y = time * 0.08;
      crystalPlanetRef.current.rotation.z = time * 0.03;
      
      // Floating breath effect
      crystalPlanetRef.current.position.y = Math.sin(time) * 0.1;
    }

    if (trailRef.current) {
      // Rotate trail slowly
      trailRef.current.rotation.y = time * 0.1;
    }
  });

  return (
    <group position={[-6.0, 6.0 + (scrollProgress - 3) * 2.2, -22.0]}>
      {/* Central Crystalline Planet (Icosahedron flat shading) */}
      <mesh ref={crystalPlanetRef} castShadow>
        <icosahedronGeometry args={[1.0, 1]} />
        <meshStandardMaterial
          color="#ea580c" // Mars orange/red crystal
          wireframe={false}
          flatShading={true}
          roughness={0.2}
          metalness={0.8}
          emissive="#7f1d1d" // deep red emissive glow
          emissiveIntensity={0.6}
        />
        {/* Glowing crystal wireframe overlay */}
        <mesh>
          <icosahedronGeometry args={[1.02, 1]} />
          <meshBasicMaterial
            color="#fca5a5"
            wireframe
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </mesh>

      {/* Crystalline Core Glow */}
      <mesh>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial
          color="#ef4444"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Helical Comet Trail Particles */}
      <points ref={trailRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#fca5a5"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Crystalline Light */}
      <pointLight color="#ef4444" intensity={2.0} distance={15} decay={1.5} />


    </group>
  );
};
