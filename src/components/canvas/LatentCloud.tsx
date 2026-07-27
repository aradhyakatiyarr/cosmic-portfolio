import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LatentCloudProps {
  scrollProgress: number;
}

export const LatentCloud: React.FC<LatentCloudProps> = ({ scrollProgress }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  const particleCount = 1000;
  const [positions, originalPositions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const orig = new Float32Array(particleCount * 3);
    const cols = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Volumetric sphere distribution
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 2.2; // radius up to 2.2

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      orig[i * 3] = x;
      orig[i * 3 + 1] = y;
      orig[i * 3 + 2] = z;

      // Color spectrum of cyan, gold, violet (high-tech ML look)
      const mixRatio = Math.random();
      const color = mixRatio < 0.33 
        ? new THREE.Color('#06b6d4') // Cyan
        : mixRatio < 0.66 
          ? new THREE.Color('#8b5cf6') // Violet
          : new THREE.Color('#fbbf24'); // Gold

      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }
    return [pos, orig, cols];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.05;
      pointsRef.current.rotation.x = time * 0.02;

      // Volumetric respiration effect (data clusters expanding and contracting)
      const positionsAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const scale = 1.0 + Math.sin(time * 1.5) * 0.12;

      for (let i = 0; i < particleCount; i++) {
        positionsAttr.setXYZ(
          i,
          originalPositions[i * 3] * scale,
          originalPositions[i * 3 + 1] * scale,
          originalPositions[i * 3 + 2] * scale
        );
      }
      positionsAttr.needsUpdate = true;
    }

    if (coreRef.current) {
      coreRef.current.rotation.z = -time * 0.1;
      const pulse = 1.0 + Math.sin(time * 3.0) * 0.08;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group position={[0, (scrollProgress - 0) * 2.2, 0]}>
      {/* Volumetric Latent Space Data Particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          vertexColors
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Central High-Dimensional Feature Core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.6, 2]} />
        <meshStandardMaterial
          color="#8b5cf6"
          wireframe
          flatShading
          roughness={0.1}
          metalness={0.9}
          emissive="#4a044e"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Volumetric light surrounding Latent Space Core */}
      <pointLight color="#8b5cf6" intensity={2.0} distance={10} decay={1.3} />
    </group>
  );
};
