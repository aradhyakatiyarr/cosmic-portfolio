import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { resumeData } from '../../data/resume';
import type { SkillGroup } from '../../data/resume';

interface ExpertisePlanetProps {
  isActive: boolean;
  scrollProgress: number;
}

export const ExpertisePlanet: React.FC<ExpertisePlanetProps> = ({ isActive: _isActive, scrollProgress }) => {
  const planetRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const nodesGroupRef = useRef<THREE.Group>(null);
  const [hoveredSkill, setHoveredSkill] = useState<{ name: string; level: number; category: string } | null>(null);

  // Flatten the skills list and allocate orbital positions
  const skillsList = React.useMemo(() => {
    const list: { name: string; level: number; category: string; angle: number; radius: number; speed: number; yOffset: number }[] = [];
    let count = 0;
    
    // Distribute skills along the planetary ring system
    resumeData.skills.forEach((group: SkillGroup) => {
      group.skills.forEach((skill) => {
        const angle = (count / 28) * Math.PI * 2; // Distribute evenly
        const radius = 2.4 + (count % 3) * 0.4; // 3 distinct ring layers
        const speed = 0.05 + (1 / radius) * 0.05; // Keplerian orbit physics (closer is faster)
        const yOffset = (Math.random() - 0.5) * 0.15; // subtle vertical waving
        
        list.push({
          name: skill.name,
          level: skill.level,
          category: group.category,
          angle,
          radius,
          speed,
          yOffset
        });
        count++;
      });
    });
    return list;
  }, []);

  const [nodesState] = useState(skillsList);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (planetRef.current) {
      planetRef.current.rotation.y = time * 0.1; // Slow spin on its axis
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = -time * 0.02; // Ring spin
    }

    // Orbit the skills nodes around the gas giant
    if (nodesGroupRef.current) {
      const children = nodesGroupRef.current.children;
      nodesState.forEach((skill, idx) => {
        const child = children[idx] as THREE.Object3D;
        if (child) {
          // Orbit angle updates over time
          const currentAngle = skill.angle + time * skill.speed * 0.3;
          child.position.x = skill.radius * Math.cos(currentAngle);
          child.position.z = skill.radius * Math.sin(currentAngle);
          child.position.y = skill.yOffset + Math.sin(time + idx) * 0.05; // gentle bobbing
        }
      });
    }
  });

  // Custom shader for Saturn-like gas giant with storm bands
  const planetVertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vNormal = normalize(normalMatrix * normal);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const planetFragmentShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      // Horizontal bands of purple, blue, magenta
      float bands = sin(vUv.y * 35.0) * 0.5 + 0.5;
      float microBands = sin(vUv.y * 120.0) * 0.5 + 0.5;
      
      vec3 col1 = vec3(0.68, 0.58, 0.42); // Saturn light sand
      vec3 col2 = vec3(0.48, 0.38, 0.25); // Saturn dark brown
      vec3 col3 = vec3(0.85, 0.73, 0.52); // Saturn soft gold
      
      vec3 color = mix(col1, col2, bands);
      color = mix(color, col3, microBands * 0.3);

      // Add simple sphere shading (diffuse + fresnel edge glow)
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
      
      // Soft gold atmospheric color highlight
      vec3 finalColor = mix(color, vec3(0.85, 0.73, 0.52), fresnel * 0.7);

      // Shadow overlay from light source
      float diffuse = max(dot(normal, vec3(0.7, 0.3, 0.5)), 0.2);
      gl_FragColor = vec4(finalColor * diffuse, 1.0);
    }
  `;

  // Saturn rings custom shader
  const ringVertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const ringFragmentShader = `
    varying vec2 vUv;
    void main() {
      // Dist distance from ring center
      float d = distance(vUv, vec2(0.5));
      
      // Crop inner and outer bounds to make a flat ring disc
      if (d < 0.22 || d > 0.49) discard;
      
      // Ring transparency and band patterns
      float ringBands = sin(d * 180.0) * 0.5 + 0.5;
      float alpha = mix(0.15, 0.6, ringBands) * (1.0 - smoothstep(0.45, 0.49, d)) * (smoothstep(0.22, 0.26, d));
      
      vec3 ringColor = mix(vec3(0.78, 0.68, 0.52), vec3(0.35, 0.28, 0.18), ringBands);
      gl_FragColor = vec4(ringColor, alpha);
    }
  `;

  return (
    <group position={[-12.5, 2.0 + (scrollProgress - 1) * 2.2, -8.0]}>
      {/* Central Gas Giant Planet */}
      <mesh ref={planetRef} castShadow receiveShadow>
        <sphereGeometry args={[1.2, 32, 32]} />
        <shaderMaterial
          vertexShader={planetVertexShader}
          fragmentShader={planetFragmentShader}
        />
      </mesh>

      {/* Atmospheric Glow Shell */}
      <mesh>
        <sphereGeometry args={[1.25, 32, 32]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Flat Planetary Disc Rings */}
      <mesh ref={ringRef} rotation={[Math.PI / 2.2, 0, 0]} receiveShadow>
        <ringGeometry args={[1.8, 4.0, 64]} />
        <shaderMaterial
          vertexShader={ringVertexShader}
          fragmentShader={ringFragmentShader}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Orbiting Skill Nodes */}
      <group ref={nodesGroupRef}>
        {nodesState.map((skill, idx) => (
          <mesh 
            key={idx} 
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredSkill({ name: skill.name, level: skill.level, category: skill.category });
            }}
            onPointerOut={() => setHoveredSkill(null)}
          >
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial 
              color={hoveredSkill?.name === skill.name ? "#06b6d4" : "#8b5cf6"} 
              transparent
              opacity={0.8}
            />
            
            {/* Ambient skill label floating above individual node */}
            <Html distanceFactor={8} center position={[0, 0.25, 0]}>
              <div className="pointer-events-none select-none text-[8px] font-mono tracking-wider text-gray-400 bg-black/60 px-1 py-0.5 rounded border border-white/5 whitespace-nowrap">
                {skill.name}
              </div>
            </Html>
          </mesh>
        ))}
      </group>


    </group>
  );
};
