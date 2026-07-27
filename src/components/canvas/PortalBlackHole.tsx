import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PortalBlackHoleProps {
  isActive: boolean;
  scrollProgress: number;
}

export const PortalBlackHole: React.FC<PortalBlackHoleProps> = ({ isActive: _isActive, scrollProgress }) => {
  const portalRef = useRef<THREE.Mesh>(null);
  const dustRef = useRef<THREE.Points>(null);

  // Generate space dust particles being sucked into the singularity
  const dustCount = 400;
  const [positions, speeds, initialRadii, angles] = React.useMemo(() => {
    const pos = new Float32Array(dustCount * 3);
    const sp = new Float32Array(dustCount);
    const ir = new Float32Array(dustCount);
    const ang = new Float32Array(dustCount);
    for (let i = 0; i < dustCount; i++) {
      const radius = 2.0 + Math.random() * 5.0; // Outer start
      const angle = Math.random() * Math.PI * 2;
      pos[i * 3] = radius * Math.cos(angle);
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
      pos[i * 3 + 2] = radius * Math.sin(angle);
      sp[i] = 0.01 + Math.random() * 0.03; // pull speed
      ir[i] = radius;
      ang[i] = angle;
    }
    return [pos, sp, ir, ang];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (portalRef.current) {
      const mat = portalRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms && mat.uniforms.uTime) {
        mat.uniforms.uTime.value = time;
      }
    }

    // Pull dust particles toward singularity
    if (dustRef.current) {
      const posAttr = dustRef.current.geometry.attributes.position;
      for (let i = 0; i < dustCount; i++) {
        // Pull inwards
        initialRadii[i] -= speeds[i];
        
        // Spin as we get closer (conservation of angular momentum)
        angles[i] += (0.05 / (initialRadii[i] + 0.1));

        // Reset particle if it falls inside singularity event horizon (radius < 0.3)
        if (initialRadii[i] < 0.3) {
          initialRadii[i] = 5.0 + Math.random() * 2.0; // Respawn outer
          angles[i] = Math.random() * Math.PI * 2;
        }

        posAttr.setX(i, initialRadii[i] * Math.cos(angles[i]));
        posAttr.setZ(i, initialRadii[i] * Math.sin(angles[i]));
        posAttr.setY(i, Math.sin(time + i) * 0.05); // slight waviness
      }
      posAttr.needsUpdate = true;
      dustRef.current.rotation.y = time * 0.02;
    }
  });

  // Spiral event horizon shader
  const portalVertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const portalFragmentShader = `
    uniform float uTime;
    varying vec2 vUv;

    void main() {
      // Calculate coordinates relative to center
      vec2 centerUv = vUv - vec2(0.5);
      float dist = length(centerUv);

      if (dist > 0.5) discard;

      // Spiral swirl calculations
      float angle = atan(centerUv.y, centerUv.x);
      
      // Outer border fade
      float borderFade = smoothstep(0.5, 0.4, dist);
      // Singularity core threshold
      float singularity = smoothstep(0.08, 0.12, dist);

      // Spiral wave math
      float spiral = sin(dist * 60.0 - uTime * 12.0 + angle * 4.0) * 0.5 + 0.5;
      
      // Blend colors (Neon blue, indigo purple, and absolute dark center)
      vec3 coreColor = vec3(0.03, 0.0, 0.07); // dark purple horizon
      vec3 ringColor = mix(vec3(0.55, 0.36, 0.96), vec3(0.02, 0.71, 0.83), spiral);
      
      vec3 finalColor = mix(coreColor, ringColor, borderFade);
      
      // Absolute black hole singularity center
      vec3 singularityColor = mix(vec3(0.0, 0.0, 0.0), finalColor, singularity);

      gl_FragColor = vec4(singularityColor, borderFade);
    }
  `;

  return (
    <group position={[18.0, 5.0 + (scrollProgress - 6) * 2.2, -38.0]}>
      {/* Singular Event Horizon Disc */}
      <mesh ref={portalRef} rotation={[Math.PI / 2.3, 0, 0]}>
        <planeGeometry args={[4.5, 4.5]} />
        <shaderMaterial
          vertexShader={portalVertexShader}
          fragmentShader={portalFragmentShader}
          uniforms={{
            uTime: { value: 0 }
          }}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Singularity Outer Aura Core */}
      <mesh rotation={[Math.PI / 2.3, 0, 0]}>
        <ringGeometry args={[2.2, 2.3, 64]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Sucked-In Dust Particles */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color="#06b6d4"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Volumetric ambient light pulling attention */}
      <pointLight color="#06b6d4" intensity={2.0} distance={18} decay={1.3} />


    </group>
  );
};
