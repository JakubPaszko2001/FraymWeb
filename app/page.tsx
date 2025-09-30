'use client';

import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import Model from './components/Model';

export default function Page() {
  const fixedRef = useRef<HTMLDivElement | null>(null);

  return (
    <main style={{ margin: 0, background: '#000', color: '#fff' }}>
      {/* FIXED CANVAS – zawsze na ekranie */}
      <div
        id="fixed-canvas"
        ref={fixedRef}
        style={{
          position: 'fixed',
          inset: 0,                  // top:0; right:0; bottom:0; left:0
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'auto',     // jeśli chcesz interakcje; daj 'none', gdy ma być tylko tłem
          background: '#000'
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 0.8] }}
          style={{ width: '100%', height: '100%', display: 'block' }}
          onCreated={({ gl }) => { gl.domElement.style.touchAction = 'auto'; }}
        >
          <Model />
          <directionalLight intensity={2} position={[0, 2, 3]} />
          <Environment preset="city" />
        </Canvas>
      </div>

      {/* Treść strony – tylko po to, żeby był scroll */}
      <section style={{ height: '120vh', display: 'grid', placeItems: 'center', position: 'relative', zIndex: 1 }}>
        <h1 style={{ opacity: 0.85, textAlign: 'center' }}>Przewiń w dół – tekst w Canvasie wjedzie</h1>
      </section>

      {/* Ten segment steruje animacją ScrollTrigger (start->end) */}
      <section
        id="scroll-driver"
        style={{ height: '160vh', position: 'relative', zIndex: 1, display: 'grid', placeItems: 'center' }}
      >
        <p style={{ opacity: 0.7 }}>Scrolluj ten blok – w jego trakcie tekst dojeżdża do środka.</p>
      </section>

      <section style={{ height: '120vh', position: 'relative', zIndex: 1 }} />
    </main>
  );
}
