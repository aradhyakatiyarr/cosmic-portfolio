import React, { Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Stars } from './Stars';
import { LatentCloud } from './LatentCloud';
import { NeuralNetwork } from './NeuralNetwork';
import { AttentionGrid } from './AttentionGrid';
import { LossLandscape } from './LossLandscape';
import { DecisionTree } from './DecisionTree';
import { LorenzAttractor } from './LorenzAttractor';
import { AutoencoderBottleneck } from './AutoencoderBottleneck';
import type { Project } from '../../data/resume';

interface CameraControllerProps {
  scrollProgress: number;
}

const CameraController: React.FC<CameraControllerProps> = ({ scrollProgress }) => {
  const { camera, size } = useThree();
  
  const targetPos = React.useMemo(() => new THREE.Vector3(0, 0, 8.5), []);
  const targetLook = React.useMemo(() => new THREE.Vector3(0, 0, 0), []);

  const isMobile = size.width < 1024;

  // Spatial keyframes corresponding to 7 scroll percentages (0.0 to 6.0)
  // Shifting the planet to the right only on desktop views (width >= 1024)
  const keyframes = React.useMemo(() => {
    const shift = isMobile ? 0 : 1.8;
    const yShift = isMobile ? -0.8 : 0.0;
    return [
      { pos: new THREE.Vector3(0, 0, 8.5), look: new THREE.Vector3(-shift, yShift, 0) }, // 0: Hero
      { pos: new THREE.Vector3(-12.5, 2.0, -3.5), look: new THREE.Vector3(-12.5 - shift, 2.0 + yShift, -8.0) }, // 1: Skills
      { pos: new THREE.Vector3(14.0, -3.0, -7.0), look: new THREE.Vector3(14.0 - shift, -3.0 + yShift, -12.0) }, // 2: Projects
      { pos: new THREE.Vector3(-6.0, 6.0, -17.5), look: new THREE.Vector3(-6.0 - shift, 6.0 + yShift, -22.0) }, // 3: Experience (Mars)
      { pos: new THREE.Vector3(12.0, -2.0, -20.5), look: new THREE.Vector3(12.0 - shift, -2.0 + yShift, -25.0) }, // 4: Education (Venus)
      { pos: new THREE.Vector3(-8.0, 3.0, -27.5), look: new THREE.Vector3(-8.0 - shift, 3.0 + yShift, -32.0) }, // 5: Hobbies (Voyager)
      { pos: new THREE.Vector3(18.0, 5.0, -33.0), look: new THREE.Vector3(18.0 - shift, 5.0 + yShift, -38.0) } // 6: Contact (Black Hole)
    ];
  }, [isMobile]);

  useFrame((state) => {
    const mouse = state.pointer;

    const p = Math.max(0, Math.min(keyframes.length - 1, scrollProgress));
    const index = Math.floor(p);
    const fract = p - index;

    if (index >= keyframes.length - 1) {
      targetPos.copy(keyframes[keyframes.length - 1].pos);
      targetLook.copy(keyframes[keyframes.length - 1].look);
    } else {
      targetPos.lerpVectors(keyframes[index].pos, keyframes[index + 1].pos, fract);
      targetLook.lerpVectors(keyframes[index].look, keyframes[index + 1].look, fract);
    }

    const parallaxPos = targetPos.clone().add(
      new THREE.Vector3(mouse.x * 0.6, mouse.y * 0.4, 0)
    );
    const parallaxLook = targetLook.clone().add(
      new THREE.Vector3(mouse.x * 0.3, mouse.y * 0.2, 0)
    );

    camera.position.lerp(parallaxPos, 0.08);

    if (!camera.userData.currentLook) {
      camera.userData.currentLook = new THREE.Vector3(0, 0, 0);
    }
    const currentLook = camera.userData.currentLook as THREE.Vector3;
    currentLook.lerp(parallaxLook, 0.08);
    camera.lookAt(currentLook);
  });

  return null;
};

interface SceneProps {
  scrollProgress: number;
  onSelectProject: (project: Project) => void;
  fxEnabled: boolean;
}

export const Scene: React.FC<SceneProps> = ({ scrollProgress, onSelectProject, fxEnabled }) => {
  const activeIndex = Math.round(scrollProgress);

  return (
    <div id="canvas-container">
      <Canvas
        gl={{ 
          antialias: false, 
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping
        }}
        camera={{ fov: 60, near: 0.1, far: 1000 }}
      >
        <color attach="background" args={['#030308']} />

        <ambientLight intensity={0.15} />
        
        <directionalLight 
          position={[5, 15, 10]} 
          intensity={0.6} 
          color="#06b6d4" 
        />
        <directionalLight 
          position={[-10, -5, -5]} 
          intensity={0.4} 
          color="#8b5cf6" 
        />

        <Suspense fallback={null}>
          <Stars />

          <LatentCloud scrollProgress={scrollProgress} />
          <NeuralNetwork isActive={activeIndex === 1} scrollProgress={scrollProgress} />
          <AttentionGrid 
            isActive={activeIndex === 2} 
            onSelectProject={onSelectProject} 
            scrollProgress={scrollProgress}
          />
          <LossLandscape isActive={activeIndex === 3} scrollProgress={scrollProgress} />
          <DecisionTree isActive={activeIndex === 4} scrollProgress={scrollProgress} />
          <LorenzAttractor isActive={activeIndex === 5} scrollProgress={scrollProgress} />
          <AutoencoderBottleneck isActive={activeIndex === 6} scrollProgress={scrollProgress} />

          <CameraController scrollProgress={scrollProgress} />

          {fxEnabled && (
            <EffectComposer>
              <Bloom 
                mipmapBlur 
                intensity={1.1} 
                luminanceThreshold={0.15} 
                luminanceSmoothing={0.9} 
              />
              <ChromaticAberration 
                offset={new THREE.Vector2(0.0006, 0.0006)} 
              />
              <Vignette 
                offset={0.2} 
                darkness={1.05} 
                eskil={false} 
              />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};
