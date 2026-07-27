import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DecisionTreeProps {
  isActive: boolean;
  scrollProgress: number;
}

export const DecisionTree: React.FC<DecisionTreeProps> = ({ isActive: _isActive, scrollProgress }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Set up decision node hierarchy coords: Depth 0 (Root), Depth 1 (Splits), Depth 2 (Leaves)
  const [nodes, connections] = useMemo(() => {
    const tempNodes: { id: string; pos: [number, number, number]; level: number; active: boolean }[] = [
      // Root Node (level 0)
      { id: 'root', pos: [0, 1.0, 0], level: 0, active: true },
      
      // Level 1 Nodes
      { id: 'split-l', pos: [-0.8, 0.2, 0], level: 1, active: true },
      { id: 'split-r', pos: [0.8, 0.2, 0], level: 1, active: false },

      // Level 2 Leaves
      { id: 'leaf-ll', pos: [-1.3, -0.6, 0], level: 2, active: true },
      { id: 'leaf-lr', pos: [-0.4, -0.6, 0], level: 2, active: false },
      { id: 'leaf-rl', pos: [0.4, -0.6, 0], level: 2, active: false },
      { id: 'leaf-rr', pos: [1.3, -0.6, 0], level: 2, active: false }
    ];

    // Branching links
    const tempConnections: { from: [number, number, number]; to: [number, number, number]; active: boolean }[] = [
      { from: [0, 1.0, 0], to: [-0.8, 0.2, 0], active: true },
      { from: [0, 1.0, 0], to: [0.8, 0.2, 0], active: false },

      { from: [-0.8, 0.2, 0], to: [-1.3, -0.6, 0], active: true },
      { from: [-0.8, 0.2, 0], to: [-0.4, -0.6, 0], active: false },
      { from: [0.8, 0.2, 0], to: [0.4, -0.6, 0], active: false },
      { from: [0.8, 0.2, 0], to: [1.3, -0.6, 0], active: false }
    ];

    return [tempNodes, tempConnections];
  }, []);

  // Synapse branching lines geometries
  const branchingLines = useMemo(() => {
    return connections.map((conn, idx) => {
      const points = [
        new THREE.Vector3(...conn.from),
        new THREE.Vector3(...conn.to)
      ];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: new THREE.Color(conn.active ? '#fbbf24' : '#06b6d4'),
        transparent: true,
        opacity: conn.active ? 0.6 : 0.15
      });
      const line = new THREE.Line(geometry, mat);
      return {
        id: idx,
        line
      };
    });
  }, [connections]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.15) * 0.2;
    }
  });

  return (
    <group 
      ref={groupRef}
      position={[12.0, -2.0 + (scrollProgress - 4) * 2.2, -25.0]}
    >
      {/* Branch Links */}
      {branchingLines.map((branch) => (
        <primitive key={`branch-${branch.id}`} object={branch.line} />
      ))}

      {/* Decision Node Spheres */}
      {nodes.map((node) => (
        <mesh key={node.id} position={node.pos}>
          <sphereGeometry args={[node.level === 0 ? 0.15 : node.level === 1 ? 0.11 : 0.08, 16, 16]} />
          <meshStandardMaterial
            color={node.active ? '#fbbf24' : '#06b6d4'}
            roughness={0.2}
            metalness={0.8}
            emissive={node.active ? '#78350f' : '#083344'}
            emissiveIntensity={node.active ? 0.6 : 0.3}
          />
        </mesh>
      ))}

      {/* Ambient background lighting focused at tree */}
      <pointLight color="#fbbf24" intensity={1.5} distance={12} decay={1.4} />
    </group>
  );
};
