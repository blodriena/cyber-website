import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

export function RotatingMesh() {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.0003
      meshRef.current.rotation.y += 0.0005
      meshRef.current.position.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.5
    }
  })

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#6b72ff" />
      <pointLight position={[-10, -10, 10]} intensity={1} color="#65d3ff" />

      {/* Central rotating mesh */}
      <mesh ref={meshRef} scale={2}>
        <icosahedronGeometry args={[1, 4]} />
        <meshPhongMaterial
          color="#6b72ff"
          wireframe={false}
          emissive="#4a5cff"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh scale={2.05}>
        <icosahedronGeometry args={[1, 4]} />
        <meshBasicMaterial
          color="#65d3ff"
          wireframe={true}
          opacity={0.2}
          transparent={true}
        />
      </mesh>

      {/* Rotating ring 1 */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2.5, 0.1, 16, 100]} />
        <meshBasicMaterial
          color="#6b72ff"
          transparent={true}
          opacity={0.3}
        />
      </mesh>

      {/* Rotating ring 2 */}
      <mesh rotation={[0, Math.PI / 3, 0]}>
        <torusGeometry args={[2.8, 0.08, 16, 100]} />
        <meshBasicMaterial
          color="#65d3ff"
          transparent={true}
          opacity={0.25}
        />
      </mesh>

      {/* Rotating ring 3 */}
      <mesh rotation={[0, 0, Math.PI / 5]}>
        <torusGeometry args={[3.1, 0.06, 16, 100]} />
        <meshBasicMaterial
          color="#f566ff"
          transparent={true}
          opacity={0.2}
        />
      </mesh>
    </>
  )
}
