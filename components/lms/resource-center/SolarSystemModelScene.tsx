'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Center, ContactShadows, Float, Html, OrbitControls, Stars, useGLTF, useProgress, useTexture } from '@react-three/drei'
import { Suspense, useMemo, useRef } from 'react'
import { Color, DoubleSide, Group, Mesh, MeshStandardMaterial, SRGBColorSpace, Texture, type Material } from 'three'

import { getSolarBodyById, planetBodies, type SolarBody, type SolarModelAsset, type SolarViewMode } from './solar-system'

export type SolarSystemSceneProps = {
  body: SolarBody
  viewMode: SolarViewMode
  showOrbits: boolean
  autoRotate: boolean
  resetKey: number
}

const planetAngles: Record<string, number> = {
  mercury: 0.2,
  venus: 1.0,
  earth: 1.82,
  mars: 2.54,
  jupiter: 3.35,
  saturn: 4.08,
  uranus: 4.82,
  neptune: 5.48,
}

function orbitPosition(radius: number, id: string): [number, number, number] {
  const angle = planetAngles[id] ?? 0
  return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius]
}

function cloneAssetMaterial(source: Material, asset: SolarModelAsset) {
  const material = source.clone()
  material.side = DoubleSide

  if (material instanceof MeshStandardMaterial) {
    material.roughness = Math.max(0.32, Math.min(material.roughness, 0.64))
    material.metalness = Math.min(material.metalness, 0.08)
    material.envMapIntensity = 0.72 * (asset.exposure ?? 1)
  }

  material.needsUpdate = true
  return material
}

function AssetSolarBodyModel({ body, asset }: { body: SolarBody; asset: SolarModelAsset }) {
  const { scene } = useGLTF(asset.url)
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true)

    clone.traverse((node) => {
      const mesh = node as Mesh
      if (!mesh.isMesh) {
        return
      }

      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map((material) => cloneAssetMaterial(material, asset))
        : cloneAssetMaterial(mesh.material, asset)
    })

    return clone
  }, [asset, scene])

  return (
    <group
      position={asset.position ?? [0, 0, 0]}
      rotation={asset.rotation ?? [0, 0, 0]}
      scale={[asset.scale, asset.scale, asset.scale]}
    >
      <Center>
        <primitive object={clonedScene} />
      </Center>
    </group>
  )
}

function PlanetBands({ body }: { body: SolarBody }) {
  if (body.id !== 'jupiter' && body.id !== 'saturn') {
    return null
  }

  const bands = body.id === 'jupiter'
    ? ['#f0d2a4', '#b86f45', '#fff1d6', '#8d4b36', '#ead2b0']
    : ['#ead49b', '#caa661', '#f1dfb2', '#b99555']

  return (
    <>
      {bands.map((color, index) => (
        <mesh key={`${body.id}-band-${color}-${index}`} rotation={[Math.PI / 2, 0, 0]} scale={[1.006, 1.006, 1.006]}>
          <torusGeometry args={[0.45 + index * 0.12, 0.012, 8, 96]} />
          <meshStandardMaterial color={color} roughness={0.56} transparent opacity={0.62} />
        </mesh>
      ))}
    </>
  )
}

function PlanetRings({ body }: { body: SolarBody }) {
  if (body.id !== 'saturn' && body.id !== 'uranus') {
    return null
  }

  const opacity = body.id === 'saturn' ? 0.72 : 0.34
  const color = body.id === 'saturn' ? '#ead8a8' : '#b8eef2'

  return (
    <group rotation={[0.18, 0, -0.36]}>
      {[1.32, 1.58, 1.85].map((radius, index) => (
        <mesh key={`${body.id}-ring-${index}`} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
          <torusGeometry args={[radius, 0.028 - index * 0.005, 10, 160]} />
          <meshStandardMaterial color={color} roughness={0.48} transparent opacity={opacity - index * 0.14} />
        </mesh>
      ))}
    </group>
  )
}

function SurfaceDetails({ body }: { body: SolarBody }) {
  if (body.id === 'sun') {
    return (
      <mesh scale={[1.015, 1.015, 1.015]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#fff1a8" emissive="#ff9e2b" emissiveIntensity={0.48} transparent opacity={0.32} />
      </mesh>
    )
  }

  return <PlanetBands body={body} />
}

function ProceduralSolarBody({
  body,
  selected,
  textureAtlas,
  scale = 1,
}: {
  body: SolarBody
  selected: boolean
  textureAtlas: Texture
  scale?: number
}) {
  const baseColor = new Color(body.color)
  const emissive = body.id === 'sun' ? new Color('#ff8c24') : baseColor.clone().lerp(new Color('#ffffff'), 0.36)
  const surfaceTexture = useMemo(() => {
    const texture = textureAtlas.clone()
    texture.colorSpace = SRGBColorSpace
    texture.repeat.set(1 / 3, 1 / 3)
    texture.offset.set(body.textureAtlas.column / 3, (2 - body.textureAtlas.row) / 3)
    texture.needsUpdate = true
    return texture
  }, [body.textureAtlas.column, body.textureAtlas.row, textureAtlas])

  return (
    <group scale={[body.radiusScale * scale, body.radiusScale * scale, body.radiusScale * scale]}>
      {body.modelAsset ? (
        <AssetSolarBodyModel body={body} asset={body.modelAsset} />
      ) : (
        <>
          <mesh castShadow={body.id !== 'sun'} receiveShadow={body.id !== 'sun'}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial
              color="#ffffff"
              map={surfaceTexture}
              emissiveMap={body.id === 'sun' ? surfaceTexture : null}
              roughness={body.id === 'sun' ? 0.26 : 0.54}
              metalness={0.02}
              emissive={emissive}
              emissiveIntensity={body.id === 'sun' ? 0.92 : selected ? 0.09 : 0.025}
            />
          </mesh>
          <SurfaceDetails body={body} />
          <PlanetRings body={body} />
        </>
      )}
    </group>
  )
}

function OrbitRing({ radius, color, selected }: { radius: number; color: string; selected: boolean }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, selected ? 0.014 : 0.006, 8, 180]} />
      <meshBasicMaterial color={color} transparent opacity={selected ? 0.72 : 0.2} />
    </mesh>
  )
}

function SolarLabel({ body, selected }: { body: SolarBody; selected: boolean }) {
  return (
    <Html center distanceFactor={selected ? 9 : 14} position={[0, body.radiusScale + 0.34, 0]} className="pointer-events-none">
      <span
        className={`rounded-lg border px-2 py-1 text-[10px] font-black uppercase tracking-normal shadow-[0_8px_22px_rgba(2,8,23,0.22)] ${
          selected ? 'border-white/50 bg-white/88 text-slate-950' : 'border-white/20 bg-slate-950/58 text-white/82'
        }`}
      >
        {body.name}
      </span>
    </Html>
  )
}

function OrbitView({
  body,
  showOrbits,
  textureAtlas,
}: {
  body: SolarBody
  showOrbits: boolean
  textureAtlas: Texture
}) {
  const sun = getSolarBodyById('sun')

  return (
    <group>
      {showOrbits
        ? planetBodies.map((planet) => (
            <OrbitRing key={`${planet.id}-orbit`} radius={planet.orbitRadius} color={planet.id === body.id ? planet.accent : '#9fb6d8'} selected={planet.id === body.id} />
          ))
        : null}

      <group position={[0, 0, 0]}>
        <ProceduralSolarBody body={sun} selected={body.id === 'sun'} textureAtlas={textureAtlas} scale={body.id === 'sun' ? 0.9 : 0.64} />
        <SolarLabel body={sun} selected={body.id === 'sun'} />
      </group>

      {planetBodies.map((planet) => {
        const selected = planet.id === body.id
        return (
          <group key={planet.id} position={orbitPosition(planet.orbitRadius, planet.id)}>
            <ProceduralSolarBody body={planet} selected={selected} textureAtlas={textureAtlas} scale={selected ? 0.72 : 0.34} />
            <SolarLabel body={planet} selected={selected} />
          </group>
        )
      })}
    </group>
  )
}

function FocusView({ body, textureAtlas }: { body: SolarBody; textureAtlas: Texture }) {
  return (
    <group>
      <group position={[0, 0, 0]}>
        <ProceduralSolarBody body={body} selected textureAtlas={textureAtlas} scale={body.id === 'sun' ? 0.72 : 1.0} />
        <SolarLabel body={body} selected />
      </group>
      {body.id !== 'sun' ? (
        <group position={[-3.2, -0.42, -1.2]} scale={[0.42, 0.42, 0.42]}>
          <ProceduralSolarBody body={planetBodies.find((planet) => planet.id === 'earth') ?? body} selected={false} textureAtlas={textureAtlas} scale={0.72} />
        </group>
      ) : null}
    </group>
  )
}

function SolarSystemModel({
  body,
  viewMode,
  showOrbits,
  autoRotate,
}: Omit<SolarSystemSceneProps, 'resetKey'>) {
  const group = useRef<Group>(null)
  const textureAtlas = useTexture(body.textureAtlas.url)

  useFrame((_, delta) => {
    if (group.current && autoRotate) {
      group.current.rotation.y += delta * (viewMode === 'orbit' ? 0.045 : 0.12)
    }
  })

  return (
    <group ref={group} rotation={[0.08, -0.18, 0]}>
      {viewMode === 'orbit' ? <OrbitView body={body} showOrbits={showOrbits} textureAtlas={textureAtlas} /> : <FocusView body={body} textureAtlas={textureAtlas} />}
    </group>
  )
}

function SolarLoadingOverlay({ body }: { body: SolarBody }) {
  const { progress } = useProgress()
  const displayProgress = Math.max(8, Math.min(100, Math.round(progress)))

  return (
    <Html center className="model-loader">
      <div>
        <span>Loading 3D world</span>
        <strong>{body.name}</strong>
        <i>
          <b style={{ width: `${displayProgress}%` }} />
        </i>
        <em>{displayProgress}%</em>
      </div>
    </Html>
  )
}

export function SolarSystemModelScene({
  body,
  viewMode,
  showOrbits,
  autoRotate,
  resetKey,
}: SolarSystemSceneProps) {
  return (
    <Canvas
      key={resetKey}
      className="solar-system-canvas"
      dpr={[1, 2]}
      shadows
      gl={{ antialias: true, alpha: true, premultipliedAlpha: false }}
      camera={{ position: [0, 5.2, viewMode === 'orbit' ? 10.5 : 5.7], fov: viewMode === 'orbit' ? 46 : 38 }}
    >
      <color attach="background" args={['#07111f']} />
      <fog attach="fog" args={['#07111f', 10, 22]} />
      <ambientLight intensity={0.48} />
      <hemisphereLight args={['#dcecff', '#171b2d', 0.82]} />
      <pointLight position={[0, 0, 0]} intensity={3.8} color="#ffd18a" distance={18} />
      <directionalLight position={[4.8, 5.4, 6.2]} intensity={1.62} castShadow />
      <Stars radius={42} depth={18} count={900} factor={2.5} saturation={0} fade speed={0.25} />
      <Suspense fallback={<SolarLoadingOverlay body={body} />}>
        <Float speed={0.88} rotationIntensity={0.025} floatIntensity={0.08}>
          <SolarSystemModel body={body} viewMode={viewMode} showOrbits={showOrbits} autoRotate={autoRotate} />
        </Float>
        <ContactShadows position={[0, -2.35, 0]} opacity={0.22} scale={10} blur={2.8} far={4.2} />
      </Suspense>
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enablePan
        minDistance={viewMode === 'orbit' ? 5.6 : 3.1}
        maxDistance={viewMode === 'orbit' ? 17 : 8.2}
      />
    </Canvas>
  )
}
