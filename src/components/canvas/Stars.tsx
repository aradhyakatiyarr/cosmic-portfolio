import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Stars: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 4000;
  const [positions, sizes, twinkleSpeeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const sp = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Distribute stars in a hollow sphere around the central system
      const radius = 25 + Math.random() * 95;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      sz[i] = 0.2 + Math.random() * 1.5;
      sp[i] = 0.5 + Math.random() * 3.5;
    }

    return [pos, sz, sp];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Slow planetary drift
    pointsRef.current.rotation.y = time * 0.003;
    pointsRef.current.rotation.x = time * 0.001;

    const material = pointsRef.current.material as THREE.ShaderMaterial;
    if (material.uniforms && material.uniforms.uTime) {
      material.uniforms.uTime.value = time;
    }
  });

  const vertexShader = `
    uniform float uTime;
    attribute float size;
    attribute float twinkleSpeed;
    varying float vTwinkle;

    void main() {
      // Twinkling pattern using custom speed attributes
      vTwinkle = sin(uTime * twinkleSpeed) * 0.5 + 0.5;
      
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      // Perspective size attenuation
      gl_PointSize = size * (250.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying float vTwinkle;

    void main() {
      // Circular glowing particle styling
      float dist = distance(gl_PointCoord, vec2(0.5));
      if (dist > 0.5) discard;

      // Soft circular gradient falloff
      float alpha = (1.0 - (dist * 2.0)) * (0.2 + 0.8 * vTwinkle);

      // Deep space color blending - Mix bioluminescent purple & high-tech cyan
      vec3 color = mix(vec3(0.55, 0.36, 0.96), vec3(0.02, 0.71, 0.83), vTwinkle);
      gl_FragColor = vec4(color, alpha);
    }
  `;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute 
          attach="attributes-size"
          args={[sizes, 1]}
        />
        <bufferAttribute 
          attach="attributes-twinkleSpeed"
          args={[twinkleSpeeds, 1]}
        />
      </bufferGeometry>
      <shaderMaterial 
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 }
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
