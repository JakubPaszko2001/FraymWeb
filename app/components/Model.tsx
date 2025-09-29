import React, { useRef } from 'react'
import { MeshTransmissionMaterial, useGLTF, Text, OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import * as THREE from 'three'

export default function Model() {
    const { nodes } = useGLTF("/medias/lavalampMesh.glb");
    // const { nodes } = useGLTF("/medias/skull.glb");
    const { viewport } = useThree()
    const torus = useRef<THREE.Mesh | null>(null);
    
    useFrame(() => {
      if (torus.current) {
        torus.current.rotation.y += 0.005
      }
    })

    const materialProps = useControls({
        thickness: { value: 0.2, min: 0, max: 3, step: 0.05 },
        roughness: { value: 0, min: 0, max: 1, step: 0.1 },
        transmission: {value: 1, min: 0, max: 1, step: 0.1},
        ior: { value: 1.2, min: 0, max: 3, step: 0.1 },
        chromaticAberration: { value: 0.02, min: 0, max: 1},
        backside: { value: true},
        attenuationDistance: { value: 2.5, min: 0, max: 10, step: 0.1 },
        // attenuationColor: '#a400ff', // delikatne zabarwienie zamiast ColorRamp
        color: '#a400ff',
    })
    
    return (
        <group scale={viewport.width / 3.75} >
        <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={1.2}
        maxDistance={7}
        // ograniczenia góra/dół (opcjonalnie)
        // minPolarAngle={0.2}
        // maxPolarAngle={Math.PI - 0.2}
      />
            <Text font={'/fonts/PPNeueMontreal-Bold.otf'} position={[0, 0, -1]} fontSize={0.5} color="white" anchorX="center" anchorY="middle">
                hello world!
            </Text>
            <mesh ref={torus} {...nodes.Mball}>
            {/* <mesh ref={torus} {...nodes.Skull}> */}
                <MeshTransmissionMaterial {...materialProps} />
            </mesh>
        </group>
    )
}
