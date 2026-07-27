import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AutoencoderBottleneckProps {
  isActive: boolean;
  scrollProgress: number;
}

export const AutoencoderBottleneck: React.FC<AutoencoderBottleneckProps> = ({ isActive: _isActive, scrollProgress }) => {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const particleCount = 600;
  
  // Set up autoencoder flow: encoder funnel (z = -2 to 0) and decoder funnel (z = 0 to 2)
  const [positions, originalParams] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const params = new Float32Array(particleCount * 3); // store [angle, radius, speed]

    for (let i = 0; i < particleCount; i++) {
      const isEncoder = Math.random() > 0.5;
      
      const angle = Math.random() * Math.PI * 2.0;
      const speed = 0.5 + Math.random() * 0.8;
      
      // Let coordinates flow from z = -1.5 to z = +1.5
      const z = (Math.random() - 0.5) * 3.0; // from -1.5 to +1.5
      
      // Bottleneck core radius is near-zero at z = 0, and wider at edges
      const maxRadius = 0.8;
      const radius = Math.abs(z) * maxRadius + 0.05; // hourglass shape

      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      params[i * 3] = angle;
      params[i * 3 + 1] = speed;
      params[i * 3 + 2] = isEncoder ? -1 : 1; // initial flow vector
    }

    return [pos, params];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.04;
    }

    // Move data points through autoencoder bottleneck flow
    if (particlesRef.current) {
      const positionsAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      
      for (let i = 0; i < particleCount; i++) {
        let z = positionsAttr.getZ(i);
        const angle = originalParams[i * 3];
        const speed = originalParams[i * 3 + 1];

        // Move along z axis from -1.5 to 1.5
        z += 0.015 * speed;
        if (z > 1.5) z = -1.5;

        // Hourglass radius logic (narrow compression bottleneck at z = 0)
        const radius = Math.abs(z) * 0.8 + 0.06;
        const x = radius * Math.cos(angle + time * 0.4);
        const y = radius * Math.sin(angle + time * 0.4);

        positionsAttr.setXYZ(i, x, y, z);
      }
      positionsAttr.needsUpdate = true;
    }
  });

  return (
    <group 
      ref={groupRef}
      position={[18.0, 5.0 + (scrollProgress - 6) * 2.2, -38.0]}
    >
      {/* Bottleneck Hourglass Mesh Structure */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.85, 0.06, 3.0, 32, 2, true]} />
        <meshStandardMaterial
          color="#06b6d4"
          wireframe
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Latent Bottleneck Compression Ring */}
      <mesh position={[0, 0, 0]}>
        <ringGeometry args={[0.07, 0.09, 32]} />
        <meshBasicMaterial 
          color="#fbbf24" 
          transparent 
          opacity={0.8} 
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* Flowing Data Stream Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color="#06b6d4"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Point light concentrated inside bottleneck core */}
      <pointLight color="#06b6d4" intensity={2.0} distance={15} decay={1.3} />
    </group>
  );
};
