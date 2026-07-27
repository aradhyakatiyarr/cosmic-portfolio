import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HobbiesPlanetProps {
  isActive: boolean;
  scrollProgress: number;
}

export const HobbiesPlanet: React.FC<HobbiesPlanetProps> = ({ isActive: _isActive, scrollProgress }) => {
  const planetRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (planetRef.current) {
      planetRef.current.rotation.y = time * 0.08;
    }

    if (cloudsRef.current) {
      // Clouds rotate slightly faster than the planet surface for weather drift
      cloudsRef.current.rotation.y = time * 0.12;
      cloudsRef.current.rotation.x = time * 0.02;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = time * 0.03;
    }
  });

  // Shader for ocean + vegetation landmasses (Earth/Neptune hybrid voyager planet)
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
      // Generative green/blue landscape noise
      float noise = sin(vUv.x * 12.0) * cos(vUv.y * 12.0) + sin(vUv.y * 30.0) * 0.2;
      float landMask = step(0.0, noise);

      vec3 oceanColor = vec3(0.02, 0.2, 0.6);   // Cobalt blue
      vec3 landColor = vec3(0.05, 0.45, 0.25);  // Emerald green
      vec3 baseColor = mix(oceanColor, landColor, landMask);

      // Sphere shading
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
      
      // Indigo atmospheric boundary glow
      vec3 finalColor = mix(baseColor, vec3(0.2, 0.6, 1.0), fresnel * 0.6);

      float diffuse = max(dot(normal, vec3(0.5, 0.5, 0.5)), 0.15);
      gl_FragColor = vec4(finalColor * diffuse, 1.0);
    }
  `;

  return (
    <group position={[-8.0, 3.0 + (scrollProgress - 5) * 2.2, -32.0]}>
      {/* Surface Terrain Mesh */}
      <mesh ref={planetRef} castShadow receiveShadow>
        <sphereGeometry args={[1.0, 32, 32]} />
        <shaderMaterial
          vertexShader={planetVertexShader}
          fragmentShader={planetFragmentShader}
        />
      </mesh>

      {/* Cloud Deck Mesh (floating just above surface) */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.03, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.35}
          blending={THREE.NormalBlending}
          roughness={0.9}
        />
      </mesh>

      {/* Atmospheric Glow boundary */}
      <mesh>
        <sphereGeometry args={[1.07, 32, 32]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Ambient lighting focused around Hobbies planet */}
      <pointLight color="#3b82f6" intensity={1.5} distance={12} decay={1.4} />
    </group>
  );
};
