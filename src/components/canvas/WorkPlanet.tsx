import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { resumeData } from '../../data/resume';
import type { Project } from '../../data/resume';

interface WorkPlanetProps {
  isActive: boolean;
  onSelectProject: (project: Project) => void;
  scrollProgress: number;
}

export const WorkPlanet: React.FC<WorkPlanetProps> = ({ isActive: _isActive, onSelectProject, scrollProgress }) => {
  const planetRef = useRef<THREE.Mesh>(null);
  const moonsGroupRef = useRef<THREE.Group>(null);
  const [hoveredMoon, setHoveredMoon] = useState<string | null>(null);

  // Set up orbits for the projects (represented as moon satellites)
  const projectsData = React.useMemo(() => {
    return resumeData.projects.map((project, idx) => {
      // Distribute orbits at different radii and phase shifts
      const angle = (idx / resumeData.projects.length) * Math.PI * 2;
      const radius = 2.2 + idx * 0.45; // Orbit layers
      const speed = 0.12 - idx * 0.015; // Speed decreases with distance
      const yOffset = (idx % 2 === 0 ? 1 : -1) * 0.25; // alternating heights
      const size = 0.09 + (idx % 2) * 0.02; // varying moon sizes
      
      // Select different cyber colours for the moons
      const colors = ['#8b5cf6', '#06b6d4', '#fbbf24', '#ec4899', '#10b981'];
      const color = colors[idx % colors.length];

      return {
        ...project,
        orbitRadius: radius,
        orbitSpeed: speed,
        orbitAngle: angle,
        yOffset,
        size,
        color
      };
    });
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (planetRef.current) {
      planetRef.current.rotation.y = time * 0.08;
      // High-tech pulse
      const mat = planetRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms && mat.uniforms.uTime) {
        mat.uniforms.uTime.value = time;
      }
    }

    // Move moons in orbit
    if (moonsGroupRef.current) {
      const children = moonsGroupRef.current.children;
      projectsData.forEach((moon, idx) => {
        const child = children[idx] as THREE.Group;
        if (child) {
          const currentAngle = moon.orbitAngle + time * moon.orbitSpeed * 0.5;
          child.position.x = moon.orbitRadius * Math.cos(currentAngle);
          child.position.z = moon.orbitRadius * Math.sin(currentAngle);
          child.position.y = moon.yOffset + Math.sin(time * 1.5 + idx) * 0.08;
          
          // Slowly spin the moon mesh itself
          const moonMesh = child.children[0] as THREE.Mesh;
          if (moonMesh) {
            moonMesh.rotation.y = time * 0.3;
          }
        }
      });
    }
  });

  // Shader for the High-Tech Terrestrial Planet with glowing data pathways
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
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      // Generative continent shapes using sin/cos waves
      float noiseVal = sin(vUv.x * 14.0) * cos(vUv.y * 10.0) + sin(vUv.y * 24.0) * 0.3 + cos(vUv.x * 6.0) * 0.2;
      float landMask = step(0.05, noiseVal); // 1.0 = Land, 0.0 = Ocean

      vec3 oceanColor = vec3(0.02, 0.15, 0.45); // Deep Earth blue
      vec3 landColor = vec3(0.12, 0.38, 0.18);  // Vegetation green
      vec3 baseColor = mix(oceanColor, landColor, landMask);

      // Tech-grid patterns on planet overlay
      float gridX = step(0.98, fract(vUv.x * 32.0));
      float gridY = step(0.98, fract(vUv.y * 16.0));
      float grid = max(gridX, gridY);

      vec3 circuitColor = vec3(0.02, 0.71, 0.83); // Cyber cyan
      float signal = sin(vUv.x * 18.0 - uTime * 2.0) * cos(vUv.y * 12.0 + uTime * 0.5) * 0.5 + 0.5;

      // Overlay cyber network grids on Earth base
      vec3 finalColor = mix(baseColor, circuitColor, grid * (0.35 + signal * 0.65));

      // Sphere shading
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
      
      // Atmospheric cyan envelope
      finalColor = mix(finalColor, circuitColor, fresnel * 0.5);

      float diffuse = max(dot(normal, vec3(0.6, 0.4, 0.5)), 0.2);
      gl_FragColor = vec4(finalColor * diffuse, 1.0);
    }
  `;

  return (
    <group position={[14.0, -3.0 + (scrollProgress - 2) * 2.2, -12.0]}>
      {/* High-Tech Terrestrial Planet */}
      <mesh ref={planetRef} castShadow receiveShadow>
        <sphereGeometry args={[1.1, 32, 32]} />
        <shaderMaterial
          vertexShader={planetVertexShader}
          fragmentShader={planetFragmentShader}
          uniforms={{
            uTime: { value: 0 }
          }}
        />
      </mesh>

      {/* Atmospheric Shell */}
      <mesh>
        <sphereGeometry args={[1.15, 32, 32]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Orbiting Moon Satellites Group */}
      <group ref={moonsGroupRef}>
        {projectsData.map((project) => (
          <group 
            key={project.id}
            onClick={(e) => {
              e.stopPropagation();
              onSelectProject(project as unknown as Project);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredMoon(project.id);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              setHoveredMoon(null);
              document.body.style.cursor = 'default';
            }}
          >
            {/* The project moon mesh */}
            <mesh>
              <sphereGeometry args={[project.size, 16, 16]} />
              <meshBasicMaterial 
                color={project.color} 
                toneMapped={false}
              />
            </mesh>

            {/* Orbit path ring for this specific moon */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -project.yOffset, 0]}>
              <ringGeometry args={[project.orbitRadius - 0.005, project.orbitRadius + 0.005, 64]} />
              <meshBasicMaterial 
                color={project.color} 
                transparent 
                opacity={0.08}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* HTML label that glows on hover */}
            <Html distanceFactor={8} center position={[0, project.size + 0.2, 0]}>
              <div 
                className={`px-2 py-1 rounded border transition-all duration-300 pointer-events-auto whitespace-nowrap text-[9px] font-mono cursor-pointer select-none ${
                  hoveredMoon === project.id 
                    ? 'bg-space-deep/95 border-space-cyan text-space-cyan shadow-[0_0_12px_rgba(6,182,212,0.4)] scale-110'
                    : 'bg-black/70 border-white/10 text-gray-300'
                }`}
              >
                🚀 {project.title}
              </div>
            </Html>
          </group>
        ))}
      </group>


    </group>
  );
};
