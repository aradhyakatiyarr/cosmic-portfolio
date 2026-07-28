import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface NeuralNetworkProps {
  isActive: boolean;
  scrollProgress: number;
}

export const NeuralNetwork: React.FC<NeuralNetworkProps> = ({ isActive: _isActive, scrollProgress }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Nodes layers setup: Input (4 nodes), Hidden (6 nodes), Output (3 nodes)
  const [nodes, connections] = useMemo(() => {
    const inputLayer = 4;
    const hiddenLayer = 6;
    const outputLayer = 3;

    const layerSpacing = 1.6;
    const nodeSpacing = 0.6;

    const tempNodes: { id: string; pos: [number, number, number]; layer: number }[] = [];
    
    // Create inputs (left layer)
    for (let i = 0; i < inputLayer; i++) {
      const y = (i - (inputLayer - 1) / 2) * nodeSpacing;
      tempNodes.push({ id: `in-${i}`, pos: [-layerSpacing, y, 0], layer: 0 });
    }

    // Create hidden (middle layer)
    for (let i = 0; i < hiddenLayer; i++) {
      const y = (i - (hiddenLayer - 1) / 2) * nodeSpacing;
      tempNodes.push({ id: `hid-${i}`, pos: [0, y, 0], layer: 1 });
    }

    // Create outputs (right layer)
    for (let i = 0; i < outputLayer; i++) {
      const y = (i - (outputLayer - 1) / 2) * nodeSpacing;
      tempNodes.push({ id: `out-${i}`, pos: [layerSpacing, y, 0], layer: 2 });
    }

    // Create synapses connections list
    const tempConnections: { from: [number, number, number]; to: [number, number, number] }[] = [];
    const inputs = tempNodes.filter(n => n.layer === 0);
    const hiddens = tempNodes.filter(n => n.layer === 1);
    const outputs = tempNodes.filter(n => n.layer === 2);

    inputs.forEach(inp => {
      hiddens.forEach(hid => {
        tempConnections.push({ from: inp.pos, to: hid.pos });
      });
    });

    hiddens.forEach(hid => {
      outputs.forEach(out => {
        tempConnections.push({ from: hid.pos, to: out.pos });
      });
    });

    return [tempNodes, tempConnections];
  }, []);

  // Create synapses lines geometries
  const connectionLines = useMemo(() => {
    return connections.map((conn, idx) => {
      const points = [
        new THREE.Vector3(...conn.from),
        new THREE.Vector3(...conn.to)
      ];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: new THREE.Color('#06b6d4'),
        transparent: true,
        opacity: 0.18
      });
      const line = new THREE.Line(geometry, mat);
      return {
        id: idx,
        line
      };
    });
  }, [connections]);

  // Pulse signals traversing along synapses
  const pulseCount = 15;
  const pulses = useMemo(() => {
    return Array.from({ length: pulseCount }).map((_, idx) => {
      const randomConnIndex = Math.floor(Math.random() * connections.length);
      const conn = connections[randomConnIndex];
      return {
        id: idx,
        from: new THREE.Vector3(...conn.from),
        to: new THREE.Vector3(...conn.to),
        speed: 0.8 + Math.random() * 0.7,
        progress: Math.random()
      };
    });
  }, [connections]);

  const pulseMeshesRef = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.2) * 0.15;
      groupRef.current.rotation.x = Math.cos(time * 0.15) * 0.1;
    }

    // Traverse pulses along synapses
    pulses.forEach((pulse, idx) => {
      const mesh = pulseMeshesRef.current[idx];
      if (mesh) {
        pulse.progress += 0.015 * pulse.speed;
        if (pulse.progress > 1.0) {
          pulse.progress = 0.0;
          // Randomize next synapse traversal
          const randomConnIndex = Math.floor(Math.random() * connections.length);
          const conn = connections[randomConnIndex];
          pulse.from.set(...conn.from);
          pulse.to.set(...conn.to);
        }
        // Interpolate signal coordinates
        mesh.position.lerpVectors(pulse.from, pulse.to, pulse.progress);
      }
    });
  });

  return (
    <group 
      ref={groupRef}
      position={[-12.5, 2.0 + (scrollProgress - 1) * 2.2, -8.0]}
    >
      {/* Dense Weight Synapses Grid */}
      {connectionLines.map(conn => (
        <primitive key={`line-${conn.id}`} object={conn.line} />
      ))}

      {/* Dynamic Weight Signal Pulses */}
      {pulses.map((pulse, idx) => (
        <mesh 
          key={`pulse-${pulse.id}`}
          ref={el => { if (el) pulseMeshesRef.current[idx] = el; }}
        >
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.8} />
        </mesh>
      ))}

      {/* Neuron Node Spheres */}
      {nodes.map((node) => (
        <mesh key={node.id} position={node.pos}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color={node.layer === 0 ? '#06b6d4' : node.layer === 1 ? '#8b5cf6' : '#fbbf24'}
            roughness={0.2}
            metalness={0.8}
            emissive={node.layer === 0 ? '#083344' : node.layer === 1 ? '#2e1065' : '#451a03'}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      <pointLight color="#8b5cf6" intensity={1.5} distance={10} decay={1.4} />

      {/* Floating diagnostic label - Desktop only */}
      <Html
        position={[0, -2.0, 0]}
        center
        distanceFactor={6}
        className="pointer-events-none"
      >
        <div className="hidden lg:block px-3 py-1 rounded bg-space-deep/90 border border-purple-500/30 backdrop-blur-md text-[9px] font-mono text-purple-400 tracking-wider uppercase shadow-[0_0_10px_rgba(139,92,246,0.15)] whitespace-nowrap animate-pulse">
          FEEDFORWARD NEURAL NETWORK
        </div>
      </Html>
    </group>
  );
};
