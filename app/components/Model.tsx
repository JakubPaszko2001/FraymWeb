'use client';

import React, { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { MeshTransmissionMaterial, useGLTF, Text, OrbitControls, Stars } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useControls } from 'leva';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Model() {
  const { nodes } = useGLTF('/medias/lavalampMesh6.glb') as any;
  const { viewport } = useThree();

  const torus = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<any>(null);

  // refs do tekstów
  const leftRef = useRef<THREE.Object3D>(null);
  const rightRef = useRef<THREE.Object3D>(null);

  // animacja obiektu (jak u Ciebie)
  useFrame(({ clock }) => {
    if (torus.current) torus.current.rotation.y += 0.005;
    if (materialRef.current) {
      const t = clock.elapsedTime * 0.3;
      materialRef.current.color.setRGB(
        0.5 + 0.5 * Math.sin(t),
        0.5 + 0.5 * Math.sin(t + 2),
        0.5 + 0.5 * Math.sin(t + 4)
      );
    }
  });

  const materialProps = useControls({
    thickness: { value: 0.2, min: 0, max: 3, step: 0.05 },
    roughness: { value: 0, min: 0, max: 1, step: 0.1 },
    transmission: { value: 1, min: 0, max: 1, step: 0.1 },
    ior: { value: 1.2, min: 0, max: 3, step: 0.1 },
    chromaticAberration: { value: 0.02, min: 0, max: 1 },
    backside: { value: true },
    attenuationDistance: { value: 2.5, min: 0, max: 10, step: 0.1 },
  });

  // GSAP – tekst wjeżdża, gdy przewijasz #scroll-driver
  useLayoutEffect(() => {
    const w = viewport.width;
    const L = leftRef.current!;
    const R = rightRef.current!;
    if (!L || !R) return;

    // start poza kadrem, przed meshem (żeby nic go nie zasłaniało)
    L.position.set(-w * 1.6, 0, 0.25);
    R.position.set( w * 1.6, 0, 0.25);
    L.scale.setScalar(0.9);
    R.scale.setScalar(0.9);

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '#scroll-driver', // ten blok poniżej canvasa
        start: 'top bottom',       // gdy jego góra dotknie dołu okna
        end: 'top center',         // do połowy okna
        scrub: true,
      },
    });

    tl.to(L.position, { x: -0.06 }, 0)
      .to(R.position, { x:  0.06 }, 0)
      .to(L.scale,    { x: 1, y: 1, z: 1 }, 0)
      .to(R.scale,    { x: 1, y: 1, z: 1 }, 0);

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(s => s.kill());
    };
  }, [viewport.width]);

  return (
    <group scale={viewport.width / 3.75}>
      <color attach="background" args={['#030314']} />
      <Stars radius={80} depth={50} count={6000} factor={2} saturation={0} fade speed={0.25} />

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={1.2}
        maxDistance={7}
        enableZoom={false}
        enableRotate={false}
      />

      {/* Tekst zawsze nad obiektem */}
      <Text
        ref={leftRef as any}
        font="/fonts/PPNeueMontreal-Bold.otf"
        fontSize={0.5}
        color="white"
        anchorX="right"
        anchorY="middle"
        renderOrder={999}
      >
        hello&nbsp;
      </Text>
      <Text
        ref={rightRef as any}
        font="/fonts/PPNeueMontreal-Bold.otf"
        fontSize={0.5}
        color="white"
        anchorX="left"
        anchorY="middle"
        renderOrder={999}
      >
        world!
      </Text>

      <mesh ref={torus} {...(nodes as any).Mball}>
        <MeshTransmissionMaterial ref={materialRef} {...materialProps} />
      </mesh>
    </group>
  );
}

useGLTF.preload('/medias/lavalampMesh6.glb');
