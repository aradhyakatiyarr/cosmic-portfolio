import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SunProps {
  scrollProgress: number;
}

export const Sun: React.FC<SunProps> = ({ scrollProgress }) => {
  const sunRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Generate solar flare particles orbiting the Sun
  const particleCount = 200;
  const [positions, speeds, angles] = React.useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const sp = new Float32Array(particleCount);
    const ang = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      const radius = 2.0 + Math.random() * 0.8;
      const angle = Math.random() * Math.PI * 2;
      pos[i * 3] = radius * Math.cos(angle);
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.6;
      pos[i * 3 + 2] = radius * Math.sin(angle);
      sp[i] = 0.2 + Math.random() * 0.8;
      ang[i] = angle;
    }
    return [pos, sp, ang];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (sunRef.current) {
      sunRef.current.rotation.y = time * 0.15;
      const mat = sunRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms && mat.uniforms.uTime) {
        mat.uniforms.uTime.value = time;
      }
    }

    if (glowRef.current) {
      glowRef.current.rotation.y = -time * 0.08;
      const mat = glowRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms && mat.uniforms.uTime) {
        mat.uniforms.uTime.value = time;
      }
    }

    // Animate solar flare particles orbiting
    if (particlesRef.current) {
      const positionsAttr = particlesRef.current.geometry.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        angles[i] += speeds[i] * 0.01;
        const radius = 2.0 + (Math.sin(time + i) * 0.15); // breathe effect
        positionsAttr.setX(i, radius * Math.cos(angles[i]));
        positionsAttr.setZ(i, radius * Math.sin(angles[i]));
      }
      positionsAttr.needsUpdate = true;
      particlesRef.current.rotation.y = time * 0.05;
    }
  });

  // Hot glowing plasma solar shader
  const sunVertexShader = `
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

  const sunFragmentShader = `
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    // Simple noise generator
    float noise(vec2 p) {
      return sin(p.x * 10.0 + uTime) * sin(p.y * 10.0 - uTime) * 0.5 + 0.5;
    }

    void main() {
      // Cosmic sun color layers
      vec2 tempUv = vUv * 3.0;
      float n1 = noise(tempUv + vec2(uTime * 0.1, uTime * 0.05));
      float n2 = noise(tempUv - vec2(uTime * 0.08, -uTime * 0.12));
      float combinedNoise = (n1 + n2) * 0.5;

      // Deep orange / gold core base
      vec3 coreColor = mix(vec3(0.98, 0.45, 0.05), vec3(0.98, 0.85, 0.1), combinedNoise);
      
      // Fresnel atmospheric edge glow
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.5);
      
      // Combine core and glowing shell
      vec3 finalColor = mix(coreColor, vec3(0.98, 0.9, 0.5), fresnel * 0.8);
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  // Transparent outer atmospheric glow
  const glowVertexShader = `
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vNormal = normalize(normalMatrix * normal);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const glowFragmentShader = `
    uniform float uTime;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      
      // Smooth fresnel edge glow
      float intensity = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
      
      // Additive golden corona loop color
      vec3 color = vec3(0.98, 0.65, 0.1) * intensity * 1.5;
      gl_FragColor = vec4(color, intensity);
    }
  `;

  return (
    <group position={[0, (scrollProgress - 0) * 2.2, 0]}>
      {/* Central Sun Mesh */}
      <mesh ref={sunRef} castShadow>
        <sphereGeometry args={[1.5, 64, 64]} />
        <shaderMaterial
          vertexShader={sunVertexShader}
          fragmentShader={sunFragmentShader}
          uniforms={{
            uTime: { value: 0 },
          }}
        />
      </mesh>

      {/* Atmospheric Glow Mesh (slightly larger) */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.65, 32, 32]} />
        <shaderMaterial
          vertexShader={glowVertexShader}
          fragmentShader={glowFragmentShader}
          uniforms={{
            uTime: { value: 0 },
          }}
          transparent
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Orbiting Solar Flare Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#fbbf24"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Point Light emitted from the Sun center */}
      <pointLight 
        color="#fbbf24" 
        intensity={2.5} 
        distance={40} 
        decay={1.2} 
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />


    </group>
  );
};
