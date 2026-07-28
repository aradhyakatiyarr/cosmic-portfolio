import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { resumeData } from '../../data/resume';
import type { Project } from '../../data/resume';

interface AttentionGridProps {
  isActive: boolean;
  onSelectProject: (project: Project) => void;
  scrollProgress: number;
}

export const AttentionGrid: React.FC<AttentionGridProps> = ({ 
  isActive: _isActive, 
  onSelectProject, 
  scrollProgress 
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredToken, setHoveredToken] = useState<string | null>(null);

  // Position 5 project tokens along a horizontal arc
  const tokens = useMemo(() => {
    const spacing = 1.0;
    return resumeData.projects.map((project, idx) => {
      const x = (idx - 2) * spacing;
      const y = -0.5 + Math.sin(idx * 0.8) * 0.2; // slight arch
      const z = -Math.cos(idx * 0.8) * 0.5;
      return {
        ...project,
        pos: [x, y, z] as [number, number, number]
      };
    });
  }, []);

  // Generate self-attention weights connections between project tokens
  const attentionWeights = useMemo(() => {
    const weights: { from: [number, number, number]; to: [number, number, number]; weight: number }[] = [];
    for (let i = 0; i < tokens.length; i++) {
      for (let j = i + 1; j < tokens.length; j++) {
        // Mock weight value
        const weight = 0.25 + Math.sin((i + j) * 1.5) * 0.25;
        weights.push({
          from: tokens[i].pos,
          to: tokens[j].pos,
          weight
        });
      }
    }
    return weights;
  }, [tokens]);

  // Generate Bezier curves for attention bridges
  const weightArcs = useMemo(() => {
    return attentionWeights.map((w, idx) => {
      const start = new THREE.Vector3(...w.from);
      const end = new THREE.Vector3(...w.to);
      const middle = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      middle.y += Math.abs(start.x - end.x) * 0.4; // arch height

      const curve = new THREE.QuadraticBezierCurve3(start, middle, end);
      const points = curve.getPoints(24);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      const mat = new THREE.LineBasicMaterial({
        color: new THREE.Color('#06b6d4'),
        transparent: true,
        opacity: 0.12 + w.weight * 0.3
      });

      const line = new THREE.Line(geometry, mat);

      return {
        id: idx,
        line
      };
    });
  }, [attentionWeights]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.05;
    }
  });

  return (
    <group 
      ref={groupRef}
      position={[14.0, -3.0 + (scrollProgress - 2) * 2.2, -12.0]}
    >
      {/* Flat Matrix Grid Plane */}
      <gridHelper args={[8, 8, '#06b6d4', '#1e293b']} position={[0, -0.8, 0]} rotation={[0, 0, 0]} />

      {/* Attention Arc Weight Bridges */}
      {weightArcs.map((arc) => (
        <primitive key={`arc-${arc.id}`} object={arc.line} />
      ))}

      {/* Project Token Embedding Cylinders */}
      {tokens.map((token) => {
        const isHovered = hoveredToken === token.id;
        
        return (
          <group 
            key={token.id} 
            position={token.pos}
            onClick={(e) => {
              e.stopPropagation();
              onSelectProject(token as unknown as Project);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredToken(token.id);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setHoveredToken(null);
              document.body.style.cursor = 'default';
            }}
          >
            {/* Base Embedding Rod */}
            <mesh castShadow>
              <cylinderGeometry args={[0.08, 0.08, 0.7, 16]} />
              <meshStandardMaterial
                color={isHovered ? '#fbbf24' : '#8b5cf6'}
                roughness={0.2}
                metalness={0.8}
                emissive={isHovered ? '#78350f' : '#2e1065'}
                emissiveIntensity={0.5}
              />
            </mesh>

            {/* Glowing Embedding Token Cap */}
            <mesh position={[0, 0.35, 0]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshBasicMaterial 
                color={isHovered ? '#fbbf24' : '#06b6d4'} 
                transparent 
                opacity={0.85} 
              />
            </mesh>

            {/* Glowing aura around token cap */}
            <mesh position={[0, 0.35, 0]}>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshBasicMaterial 
                color={isHovered ? '#fbbf24' : '#06b6d4'} 
                transparent 
                opacity={0.15} 
                blending={THREE.AdditiveBlending}
              />
            </mesh>

            {/* Embedded 3D CSS tag names overlay */}
            <Html
              position={[0, 0.65, 0]}
              center
              distanceFactor={8}
              className={`pointer-events-none transition-all duration-300 ${
                isHovered ? 'scale-110 opacity-100' : 'scale-90 opacity-75'
              }`}
            >
              <div className="px-2 py-0.5 rounded bg-space-deep/90 border border-white/10 backdrop-blur-sm text-[8px] font-mono text-glow-cyan text-white whitespace-nowrap">
                {token.title}
              </div>
            </Html>
          </group>
        );
      })}

      <pointLight color="#06b6d4" intensity={1.5} distance={10} decay={1.4} />

      {/* Floating diagnostic label - Desktop only */}
      <Html
        position={[0, -1.2, 0]}
        center
        distanceFactor={6}
        className="pointer-events-none"
      >
        <div className="hidden lg:block px-3 py-1 rounded bg-space-deep/90 border border-cyan-500/30 backdrop-blur-md text-[9px] font-mono text-cyan-400 tracking-wider uppercase shadow-[0_0_10px_rgba(6,182,212,0.15)] whitespace-nowrap animate-pulse">
          SELF-ATTENTION EMBEDDING GRID
        </div>
      </Html>
    </group>
  );
};
