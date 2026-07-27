import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LossLandscapeProps {
  isActive: boolean;
  scrollProgress: number;
}

export const LossLandscape: React.FC<LossLandscapeProps> = ({ isActive: _isActive, scrollProgress }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ballRef = useRef<THREE.Mesh>(null);

  // Generate dynamic elevations on a 3D grid surface
  const geometry = useMemo(() => {
    const size = 3.0; // width/height size of landscape
    const segments = 24;
    const geom = new THREE.PlaneGeometry(size, size, segments, segments);
    
    // Rotate geometry to make z vertical
    geom.rotateX(-Math.PI / 2);

    const positions = geom.attributes.position;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i); // Plane layout has X and Z coordinates, elevation is mapped to Y
      
      // Loss equation z = sin(x*2) * cos(y*2) + local saddle point perturbations
      const y = Math.sin(x * 2.2) * Math.cos(z * 2.2) * 0.4 + Math.sin(z * 4.0) * 0.12;
      positions.setY(i, y);
    }

    geom.computeVertexNormals();
    return geom;
  }, []);

  // Track gradient descent path coordinates
  const descentPath = useMemo(() => {
    const steps = 60;
    const path: THREE.Vector3[] = [];

    for (let i = 0; i < steps; i++) {
      const ratio = i / steps;
      // Spiral descent pattern down valley
      const angle = ratio * Math.PI * 4;
      const radius = 1.2 * (1.0 - ratio);
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      const y = Math.sin(x * 2.2) * Math.cos(z * 2.2) * 0.4 + Math.sin(z * 4.0) * 0.12 + 0.05; // slightly above surface
      
      path.push(new THREE.Vector3(x, y, z));
    }
    return path;
  }, []);

  // Draw descent path trail line
  const pathLine = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints(descentPath);
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color('#fbbf24'),
      transparent: true,
      opacity: 0.6
    });
    return new THREE.Line(geom, mat);
  }, [descentPath]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.04;
    }

    // Move optimization parameter ball along descent path
    if (ballRef.current) {
      const stepIdx = Math.floor((time * 8.0) % descentPath.length);
      const nextIdx = (stepIdx + 1) % descentPath.length;
      const fract = (time * 8.0) % 1.0;

      const p1 = descentPath[stepIdx];
      const p2 = descentPath[nextIdx];

      ballRef.current.position.lerpVectors(p1, p2, fract);

      // Rotate group inside mesh frame
      ballRef.current.parent?.rotation.set(0, time * 0.04, 0);
    }
  });

  return (
    <group position={[-6.0, 6.0 + (scrollProgress - 3) * 2.2, -22.0]}>
      {/* Dynamic 3D Loss Landscape Manifold Mesh */}
      <group>
        <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
          <meshStandardMaterial
            color="#ef4444" // Crimson landscape
            wireframe
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Gradient Descent Path Line */}
        <primitive object={pathLine} />

        {/* Rolling Parameter Optimizer Ball */}
        <mesh ref={ballRef}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial color="#fbbf24" />
        </mesh>
        
        {/* Halo core around optimizer ball */}
        <pointLight color="#fbbf24" intensity={1.5} distance={6} decay={1.5} />
      </group>

      <pointLight color="#ef4444" intensity={2.0} distance={15} decay={1.5} />
    </group>
  );
};
