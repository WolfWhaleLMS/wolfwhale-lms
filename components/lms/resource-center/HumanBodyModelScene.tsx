'use client'

import { Float, Html, OrbitControls, useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import type { Group } from 'three'
import { MeshStandardMaterial } from 'three'

import type { BodyModelAsset, BodySystem, BodyViewMode } from './human-body'

export type HumanBodySceneProps = {
  system: BodySystem
  viewMode: BodyViewMode
  autoRotate: boolean
  resetKey: number
}

function AssetBodyModel({ asset }: { asset: BodyModelAsset }) {
  const gltf = useGLTF(asset.url)

  return (
    <primitive
      object={gltf.scene.clone()}
      scale={asset.scale}
      position={asset.position ?? [0, 0, 0]}
      rotation={asset.rotation ?? [0, 0, 0]}
    />
  )
}

function material(color: string, opacity = 1) {
  return new MeshStandardMaterial({
    color,
    roughness: 0.45,
    metalness: 0.02,
    transparent: opacity < 1,
    opacity,
  })
}

function HeartModel({ system }: { system: BodySystem }) {
  return (
    <group>
      <mesh position={[-0.18, 0.12, 0]} material={material(system.color)}>
        <sphereGeometry args={[0.42, 48, 32]} />
      </mesh>
      <mesh position={[0.22, 0.08, 0]} material={material('#b83247')}>
        <sphereGeometry args={[0.38, 48, 32]} />
      </mesh>
      <mesh position={[0, -0.34, 0]} scale={[0.86, 1.08, 0.82]} rotation={[0, 0, 0.12]} material={material('#c63f55')}>
        <sphereGeometry args={[0.5, 48, 32]} />
      </mesh>
      <mesh position={[-0.36, 0.62, 0]} rotation={[0.18, 0, 0.2]} material={material('#2f80c9')}>
        <cylinderGeometry args={[0.09, 0.11, 0.86, 24]} />
      </mesh>
      <mesh position={[0.36, 0.65, 0.03]} rotation={[0.2, 0, -0.24]} material={material('#d94f65')}>
        <cylinderGeometry args={[0.1, 0.13, 0.95, 24]} />
      </mesh>
      <mesh position={[0, -0.02, 0.48]} material={material('#f6b2bd', 0.34)}>
        <torusGeometry args={[0.72, 0.018, 16, 96]} />
      </mesh>
    </group>
  )
}

function LungModel({ system }: { system: BodySystem }) {
  return (
    <group>
      <mesh position={[0, 0.72, 0]} material={material('#dfe8f2')}>
        <cylinderGeometry args={[0.09, 0.11, 1.0, 24]} />
      </mesh>
      <mesh position={[-0.36, 0.05, 0]} scale={[0.62, 1.15, 0.35]} rotation={[0, 0, -0.12]} material={material(system.color, 0.82)}>
        <sphereGeometry args={[0.7, 48, 32]} />
      </mesh>
      <mesh position={[0.36, 0.05, 0]} scale={[0.62, 1.15, 0.35]} rotation={[0, 0, 0.12]} material={material(system.color, 0.82)}>
        <sphereGeometry args={[0.7, 48, 32]} />
      </mesh>
      {[-0.48, -0.28, 0.28, 0.48].map((x) => (
        <mesh key={x} position={[x, -0.3, 0.33]} material={material('#f4c99f')}>
          <sphereGeometry args={[0.08, 24, 16]} />
        </mesh>
      ))}
      <mesh position={[0, -0.75, 0]} scale={[1.4, 0.12, 0.22]} material={material('#5f8dd8')}>
        <sphereGeometry args={[0.5, 48, 16]} />
      </mesh>
    </group>
  )
}

function BrainModel({ system }: { system: BodySystem }) {
  return (
    <group>
      <mesh position={[0, 0.3, 0]} scale={[1.12, 0.7, 0.78]} material={material(system.color)}>
        <sphereGeometry args={[0.72, 64, 40]} />
      </mesh>
      {[-0.56, -0.28, 0, 0.28, 0.56].map((x, index) => (
        <mesh key={x} position={[x, 0.55 - Math.abs(x) * 0.16, 0.34]} scale={[0.16, 0.08, 0.08]} material={material('#d8c8ff')}>
          <sphereGeometry args={[1, 24, 12]} />
        </mesh>
      ))}
      <mesh position={[0, -0.64, 0]} material={material('#f1bf4e')}>
        <cylinderGeometry args={[0.07, 0.1, 1.15, 20]} />
      </mesh>
      {[-0.45, -0.22, 0.22, 0.45].map((x) => (
        <mesh key={x} position={[x, -1.08, 0]} rotation={[0.3, 0, x > 0 ? -0.45 : 0.45]} material={material('#f1bf4e')}>
          <cylinderGeometry args={[0.025, 0.035, 0.9, 14]} />
        </mesh>
      ))}
    </group>
  )
}

function SkeletonModel({ system }: { system: BodySystem }) {
  return (
    <group>
      <mesh position={[0, 0.98, 0]} material={material(system.color)}>
        <sphereGeometry args={[0.24, 32, 20]} />
      </mesh>
      <mesh position={[0, 0.28, 0]} material={material(system.color)}>
        <cylinderGeometry args={[0.06, 0.08, 1.0, 16]} />
      </mesh>
      {[0.1, -0.05, -0.2].map((y) => (
        <mesh key={y} position={[0, y, 0]} scale={[1.1, 0.58, 0.32]} material={material(system.color)}>
          <torusGeometry args={[0.38, 0.025, 12, 72]} />
        </mesh>
      ))}
      {[
        [-0.55, 0.05, 0.32],
        [0.55, 0.05, -0.32],
        [-0.25, -0.88, 0.05],
        [0.25, -0.88, -0.05],
      ].map(([x, y, z]) => (
        <mesh key={`${x}-${y}`} position={[x, y, 0]} rotation={[0, 0, z]} material={material(system.color)}>
          <cylinderGeometry args={[0.04, 0.05, 1.0, 16]} />
        </mesh>
      ))}
    </group>
  )
}

function DigestiveModel({ system }: { system: BodySystem }) {
  return (
    <group>
      <mesh position={[0, 0.58, 0]} material={material('#d46f4e')}>
        <sphereGeometry args={[0.34, 40, 24]} />
      </mesh>
      <mesh position={[0.44, 0.72, 0]} scale={[0.8, 0.38, 0.34]} material={material('#b06e42')}>
        <sphereGeometry args={[0.42, 40, 20]} />
      </mesh>
      <mesh position={[0, -0.24, 0]} material={material(system.color)}>
        <torusKnotGeometry args={[0.42, 0.05, 140, 12, 2, 5]} />
      </mesh>
      <mesh position={[0, -0.74, 0]} scale={[1.02, 0.72, 0.5]} material={material('#c77c42')}>
        <torusGeometry args={[0.48, 0.055, 16, 90]} />
      </mesh>
    </group>
  )
}

function ProceduralBodyModel({ system }: { system: BodySystem }) {
  switch (system.id) {
    case 'respiratory':
      return <LungModel system={system} />
    case 'nervous':
      return <BrainModel system={system} />
    case 'skeletal':
      return <SkeletonModel system={system} />
    case 'digestive':
      return <DigestiveModel system={system} />
    case 'circulatory':
    default:
      return <HeartModel system={system} />
  }
}

function BodyModel({ system, viewMode, autoRotate }: Omit<HumanBodySceneProps, 'resetKey'>) {
  const group = useRef<Group>(null)

  useFrame((_, delta) => {
    if (!group.current || !autoRotate) {
      return
    }

    group.current.rotation.y += delta * 0.24
  })

  return (
    <Float speed={1.4} rotationIntensity={viewMode === 'compare' ? 0.24 : 0.12} floatIntensity={0.18}>
      <group ref={group} scale={viewMode === 'compare' ? 0.88 : 1.08}>
        {system.modelAsset ? <AssetBodyModel asset={system.modelAsset} /> : <ProceduralBodyModel system={system} />}
      </group>
    </Float>
  )
}

function LoadingOverlay({ system }: { system: BodySystem }) {
  return (
    <Html center>
      <div className="grid w-64 gap-3 rounded-lg border border-white/15 bg-[#102b2f]/90 p-4 text-white shadow-[0_18px_50px_rgba(4,24,26,0.3)]">
        <span className="text-xs font-black uppercase text-[#9be3d7]">Loading biology model</span>
        <span className="font-serif text-xl">{system.name}</span>
        <span className="h-2 overflow-hidden rounded-full bg-white/15">
          <span className="block h-full w-2/3 rounded-full" style={{ background: system.accent }} />
        </span>
      </div>
    </Html>
  )
}

export function HumanBodyModelScene({ system, viewMode, autoRotate, resetKey }: HumanBodySceneProps) {
  return (
    <Canvas
      key={resetKey}
      camera={{ position: [0, 0.55, 4.5], fov: 42 }}
      className="human-body-canvas"
      dpr={[1, 2]}
      shadows
    >
      <color attach="background" args={['#0c2528']} />
      <ambientLight intensity={0.8} />
      <hemisphereLight args={['#d4fff8', '#12333a', 1.15]} />
      <directionalLight position={[4, 5, 6]} intensity={2.1} castShadow />
      <directionalLight position={[-4, 1.5, -2]} intensity={0.75} color="#c5f4ff" />
      <pointLight position={[-3, 2, 3]} intensity={1.1} color={system.accent} />
      <Suspense fallback={<LoadingOverlay system={system} />}>
        <BodyModel system={system} viewMode={viewMode} autoRotate={autoRotate} />
      </Suspense>
      <OrbitControls enablePan={false} minDistance={2.7} maxDistance={7} autoRotate={false} />
    </Canvas>
  )
}
