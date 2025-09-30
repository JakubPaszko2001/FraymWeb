'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useControls } from 'leva'

const vertexShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uStrength;
  uniform float uSpeed;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // falowanie powierzchni
    pos.z += sin((pos.x * 2.0 + uTime * uSpeed) * 2.0) * 0.4 * uStrength;
    pos.z += cos((pos.y * 2.0 + uTime * uSpeed) * 2.5) * 0.4 * uStrength;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;

  // hash do ziarnistości
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void main() {
    // przesuwający się gradient
    float shift = sin(uTime * 0.25) * 0.3;
    float mixFactor = smoothstep(0.0, 1.0, vUv.y + shift);

    vec3 gradient = mix(uColor1, uColor2, mixFactor);

    // dodanie grain (szum filmowy)
    float grain = (random(vUv * uTime * 60.0) - 0.5) * 0.12;
    gradient += grain;

    gl_FragColor = vec4(gradient, 1.0);
  }
`

export default function UniverseBackground() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const { uStrength, uSpeed, uColor1, uColor2 } = useControls('Universe Shader', {
    uStrength: { value: 1.2, min: 0, max: 5, step: 0.1 },
    uSpeed: { value: 0.5, min: 0, max: 2, step: 0.05 },
    uColor1: '#0d0b48', // ciemny niebieski
    uColor2: '#5a0b0b', // ciemna czerwień
  })

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime
      materialRef.current.uniforms.uStrength.value = uStrength
      materialRef.current.uniforms.uSpeed.value = uSpeed
      materialRef.current.uniforms.uColor1.value = new THREE.Color(uColor1)
      materialRef.current.uniforms.uColor2.value = new THREE.Color(uColor2)
    }
  })

  return (
    <mesh scale={[7, 7, 1]} position={[0, 0, -8]}>
      <planeGeometry args={[6, 6, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={{
          uTime: { value: 0 },
          uStrength: { value: uStrength },
          uSpeed: { value: uSpeed },
          uColor1: { value: new THREE.Color(uColor1) },
          uColor2: { value: new THREE.Color(uColor2) },
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
