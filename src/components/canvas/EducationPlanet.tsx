import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EducationPlanetProps {
  isActive: boolean;
  scrollProgress: number;
}

export const EducationPlanet: React.FC<EducationPlanetProps> = ({ isActive: _isActive, scrollProgress }) => {
  const planetRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (planetRef.current) {
      planetRef.current.rotation.y = time * 0.06;
    }
  });

  // Venus-like bronze/gold band shader
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
      // Horizontal bands of bronze, copper, and golden sand
      float bands = sin(vUv.y * 50.0) * 0.5 + 0.5;
      float microBands = sin(vUv.y * 150.0) * 0.5 + 0.5;
      
      vec3 col1 = vec3(0.65, 0.45, 0.25); // Copper bronze
      vec3 col2 = vec3(0.85, 0.65, 0.35); // Golden sand
      vec3 col3 = vec3(0.45, 0.25, 0.15); // Dark copper
      
      vec3 color = mix(col1, col2, bands);
      color = mix(color, col3, microBands * 0.4);

      // Add simple sphere shading (diffuse + fresnel edge glow)
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
      
      // Golden atmospheric glow boundary
      vec3 finalColor = mix(color, vec3(0.95, 0.75, 0.45), fresnel * 0.6);

      // Light direction calculation
      float diffuse = max(dot(normal, vec3(0.6, 0.4, 0.5)), 0.25);
      gl_FragColor = vec4(finalColor * diffuse, 1.0);
    }
  `;

  return (
    <group position={[12.0, -2.0 + (scrollProgress - 4) * 2.2, -25.0]}>
      {/* Central Venusian Gas Giant Planet */}
      <mesh ref={planetRef} castShadow receiveShadow>
        <sphereGeometry args={[1.05, 32, 32]} />
        <shaderMaterial
          vertexShader={planetVertexShader}
          fragmentShader={planetFragmentShader}
        />
      </mesh>

      {/* Atmospheric Glow boundary */}
      <mesh>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Volumetric Point Light centered at planet */}
      <pointLight color="#fbbf24" intensity={1.5} distance={15} decay={1.4} />
    </group>
  );
};
