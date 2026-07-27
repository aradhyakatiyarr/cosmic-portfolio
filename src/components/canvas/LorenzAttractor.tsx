import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LorenzAttractorProps {
  isActive: boolean;
  scrollProgress: number;
}

export const LorenzAttractor: React.FC<LorenzAttractorProps> = ({ isActive: _isActive, scrollProgress }) => {
  const lineRef = useRef<THREE.Line>(null);
  const particleRef = useRef<THREE.Mesh>(null);

  // Pre-calculate Lorenz Attractor points array
  const [attractorLine, path] = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    
    // Lorenz differential parameters
    const sigma = 10.0;
    const rho = 28.0;
    const beta = 8.0 / 3.0;

    let x = 0.1;
    let y = 0.0;
    let z = 0.0;
    const dt = 0.008;

    const iterations = 800;
    for (let i = 0; i < iterations; i++) {
      const dx = sigma * (y - x) * dt;
      const dy = (x * (rho - z) - y) * dt;
      const dz = (x * y - beta * z) * dt;

      x += dx;
      y += dy;
      z += dz;

      // Scale and offset coordinates to center around origin
      pts.push(new THREE.Vector3(x * 0.05, (y - 15) * 0.05, (z - 25) * 0.05));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color('#3b82f6'),
      transparent: true,
      opacity: 0.4
    });
    const lineObj = new THREE.Line(geometry, mat);
    return [lineObj, pts];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (lineRef.current) {
      lineRef.current.rotation.y = time * 0.1;
      lineRef.current.rotation.x = time * 0.05;
    }

    // Move a tracer particle along the Lorenz Attractor trail loop
    if (particleRef.current) {
      const index = Math.floor((time * 45) % path.length);
      const nextIdx = (index + 1) % path.length;
      const fract = (time * 45) % 1.0;
      
      particleRef.current.position.lerpVectors(path[index], path[nextIdx], fract);
      
      // Sync rotation with lines
      particleRef.current.parent?.rotation.set(time * 0.05, time * 0.1, 0);
    }
  });

  return (
    <group position={[-8.0, 3.0 + (scrollProgress - 5) * 2.2, -32.0]}>
      {/* 3D Attractor Ribbon */}
      <group>
        <primitive ref={lineRef} object={attractorLine} />

        {/* Orbit Tracer Point */}
        <mesh ref={particleRef}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshBasicMaterial color="#60a5fa" />
        </mesh>
      </group>

      <pointLight color="#3b82f6" intensity={1.5} distance={12} decay={1.4} />
    </group>
  );
};
