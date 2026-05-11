'use client'

import { Line, OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { CanvasTexture, Color, DoubleSide, Group, PlaneGeometry, Shape, SRGBColorSpace, Vector3 } from 'three'

import {
  furTradeCanadaOutlines,
  furTradeLocations,
  furTradeWaterBodies,
  getFurTradeLocationById,
  getFurTradeLocationMapPoint,
  getFurTradeLocationsForRoute,
  projectFurTradeCoordinate,
  type FurTradeEra,
  type FurTradeLocation,
  type FurTradeNetworkId,
  type FurTradeRoute,
} from './fur-trade'

type FurTradeTerrainMode = 'terrain' | 'atlas'

type FurTradeMapSceneProps = {
  selectedEra: FurTradeEra
  selectedNetwork: 'all' | FurTradeNetworkId
  selectedLocation: FurTradeLocation
  visibleRoutes: FurTradeRoute[]
  terrainMode: FurTradeTerrainMode
}

function createReliefTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1280
  const context = canvas.getContext('2d')

  if (!context) {
    return null
  }

  const water = context.createLinearGradient(0, 0, canvas.width, canvas.height)
  water.addColorStop(0, '#0a3742')
  water.addColorStop(0.42, '#0e5260')
  water.addColorStop(1, '#082a34')
  context.fillStyle = water
  context.fillRect(0, 0, canvas.width, canvas.height)

  for (let y = 0; y < canvas.height; y += 8) {
    for (let x = 0; x < canvas.width; x += 8) {
      const noise = Math.sin(x * 0.018) + Math.cos(y * 0.014) + Math.sin((x + y) * 0.011)
      const alpha = Math.max(0, Math.min(0.14, (noise + 2.2) * 0.025))
      context.fillStyle = `rgba(255, 255, 255, ${alpha})`
      context.fillRect(x, y, 8, 8)
    }
  }

  const glow = context.createRadialGradient(canvas.width * 0.48, canvas.height * 0.54, 40, canvas.width * 0.48, canvas.height * 0.54, canvas.width * 0.48)
  glow.addColorStop(0, 'rgba(241, 210, 138, 0.18)')
  glow.addColorStop(0.45, 'rgba(105, 165, 119, 0.11)')
  glow.addColorStop(1, 'rgba(0, 0, 0, 0.2)')
  context.fillStyle = glow
  context.fillRect(0, 0, canvas.width, canvas.height)

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace

  return texture
}

function createTerrainGeometry(terrainMode: FurTradeTerrainMode) {
  const geometry = new PlaneGeometry(10.4, 6.7, 128, 80)
  const position = geometry.attributes.position
  const strength = terrainMode === 'terrain' ? 0.18 : 0.025

  for (let index = 0; index < position.count; index += 1) {
    const x = position.getX(index)
    const y = position.getY(index)
    const ridges = Math.sin(x * 2.2 + y * 0.7) * 0.46 + Math.cos(y * 2.8 - x * 0.35) * 0.34 + Math.sin((x + y) * 4.4) * 0.18
    const westernLift = Math.max(0, (-x - 1.15) / 4.6)
    const height = (ridges * 0.35 + westernLift * 0.9) * strength

    position.setZ(index, height)
  }

  geometry.computeVertexNormals()

  return geometry
}

function shapeFromCoordinates(coordinates: Array<{ latitude: number; longitude: number }>) {
  const shape = new Shape()

  coordinates.forEach((coordinate, index) => {
    const point = projectFurTradeCoordinate(coordinate)

    if (index === 0) {
      shape.moveTo(point.sceneX, point.sceneY)
    } else {
      shape.lineTo(point.sceneX, point.sceneY)
    }
  })

  return shape
}

function ReliefBase({ terrainMode }: { terrainMode: FurTradeTerrainMode }) {
  const reliefTexture = useMemo(() => createReliefTexture(), [])
  const terrainGeometry = useMemo(() => createTerrainGeometry(terrainMode), [terrainMode])

  return (
    <mesh geometry={terrainGeometry} position={[0, 0, -0.18]} receiveShadow>
      <meshStandardMaterial map={reliefTexture ?? undefined} color="#244d4a" roughness={0.92} metalness={0.02} side={DoubleSide} />
    </mesh>
  )
}

function LandMass({ coordinates, color, depth = 0.08 }: { coordinates: Array<{ latitude: number; longitude: number }>; color: string; depth?: number }) {
  const shape = useMemo(() => shapeFromCoordinates(coordinates), [coordinates])

  return (
    <mesh castShadow receiveShadow position={[0, 0, -0.02]}>
      <extrudeGeometry args={[shape, { depth, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.018, bevelThickness: 0.018 }]} />
      <meshStandardMaterial color={color} roughness={0.84} metalness={0.03} />
    </mesh>
  )
}

function WaterMass({ coordinates }: { coordinates: Array<{ latitude: number; longitude: number }> }) {
  const shape = useMemo(() => shapeFromCoordinates(coordinates), [coordinates])

  return (
    <mesh position={[0, 0, 0.09]}>
      <shapeGeometry args={[shape]} />
      <meshStandardMaterial color="#0b3f4d" emissive="#0a2731" emissiveIntensity={0.34} roughness={0.58} transparent opacity={0.92} side={DoubleSide} />
    </mesh>
  )
}

function routeScenePoints(route: FurTradeRoute) {
  const routeLocations = getFurTradeLocationsForRoute(route)
  const points: Vector3[] = []

  routeLocations.forEach((location, index) => {
    const projected = getFurTradeLocationMapPoint(location)

    if (index === 0) {
      points.push(new Vector3(projected.sceneX, projected.sceneY, 0.34))
      return
    }

    const previous = getFurTradeLocationMapPoint(routeLocations[index - 1])

    for (let step = 1; step <= 16; step += 1) {
      const t = step / 16
      const x = previous.sceneX + (projected.sceneX - previous.sceneX) * t
      const y = previous.sceneY + (projected.sceneY - previous.sceneY) * t
      const z = 0.34 + Math.sin(Math.PI * t) * 0.22

      points.push(new Vector3(x, y, z))
    }
  })

  return points
}

function RouteLines({ routes, selectedLocation }: { routes: FurTradeRoute[]; selectedLocation: FurTradeLocation }) {
  return (
    <>
      {routes.map((route) => {
        const selectedRoute = route.locationIds.includes(selectedLocation.id)
        const points = routeScenePoints(route)

        return (
          <Line
            key={route.id}
            points={points}
            color={route.color}
            lineWidth={selectedRoute ? 4.8 : 3.2}
            transparent
            opacity={selectedRoute ? 0.98 : 0.72}
            dashed={route.networkId === 'indigenous'}
            dashSize={0.18}
            gapSize={0.12}
          />
        )
      })}
    </>
  )
}

function LocationBeacons({
  selectedEra,
  selectedNetwork,
  selectedLocation,
}: {
  selectedEra: FurTradeEra
  selectedNetwork: 'all' | FurTradeNetworkId
  selectedLocation: FurTradeLocation
}) {
  return (
    <>
      {furTradeLocations.map((location) => (
        <LocationBeacon
          key={location.id}
          location={location}
          selected={selectedLocation.id === location.id}
          muted={!location.activeEraIds.includes(selectedEra.id) || (selectedNetwork !== 'all' && !location.networkIds.includes(selectedNetwork))}
        />
      ))}
    </>
  )
}

function LocationBeacon({ location, selected, muted }: { location: FurTradeLocation; selected: boolean; muted: boolean }) {
  const beaconRef = useRef<Group>(null)
  const point = getFurTradeLocationMapPoint(location)
  const color = selected ? '#f1d28a' : muted ? '#7d9187' : '#ffffff'

  useFrame(({ clock }) => {
    if (!beaconRef.current) {
      return
    }

    const pulse = selected ? Math.sin(clock.elapsedTime * 3.2) * 0.09 + 1.12 : 1
    beaconRef.current.scale.setScalar(pulse)
  })

  return (
    <group ref={beaconRef} position={[point.sceneX, point.sceneY, selected ? 0.55 : 0.45]}>
      <mesh>
        <sphereGeometry args={[selected ? 0.09 : 0.055, 18, 18]} />
        <meshStandardMaterial color={color} emissive={new Color(color)} emissiveIntensity={selected ? 0.42 : 0.16} roughness={0.36} />
      </mesh>
      <mesh position={[0, 0, -0.05]}>
        <torusGeometry args={[selected ? 0.19 : 0.12, 0.012, 10, 36]} />
        <meshStandardMaterial color={color} emissive={new Color(color)} emissiveIntensity={selected ? 0.32 : 0.08} transparent opacity={muted ? 0.36 : 0.72} />
      </mesh>
    </group>
  )
}

function FurTradeMapModel({ selectedEra, selectedNetwork, selectedLocation, visibleRoutes, terrainMode }: FurTradeMapSceneProps) {
  const mapRef = useRef<Group>(null)

  useFrame(({ clock }) => {
    if (!mapRef.current || terrainMode !== 'terrain') {
      return
    }

    mapRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.25) * 0.006
  })

  return (
    <group ref={mapRef}>
      <ReliefBase terrainMode={terrainMode} />
      {furTradeCanadaOutlines.map((outline, index) => (
        <LandMass key={index} coordinates={outline} color={index === 0 ? '#476842' : '#5d764f'} depth={index === 0 ? 0.1 : 0.055} />
      ))}
      {furTradeWaterBodies.map((water, index) => (
        <WaterMass key={index} coordinates={water} />
      ))}
      <RouteLines routes={visibleRoutes} selectedLocation={getFurTradeLocationById(selectedLocation.id)} />
      <LocationBeacons selectedEra={selectedEra} selectedNetwork={selectedNetwork} selectedLocation={selectedLocation} />
    </group>
  )
}

export function FurTradeMapScene(props: FurTradeMapSceneProps) {
  return (
    <Canvas
      className="fur-trade-canvas"
      dpr={[1, 2]}
      shadows
      gl={{ antialias: true, alpha: true, premultipliedAlpha: false }}
      camera={{ position: [0, -4.8, props.terrainMode === 'terrain' ? 6.8 : 7.8], fov: props.terrainMode === 'terrain' ? 42 : 36 }}
    >
      <color attach="background" args={['#082832']} />
      <fog attach="fog" args={['#082832', 7, 14]} />
      <ambientLight intensity={0.74} />
      <hemisphereLight args={['#f7e7bd', '#0b3340', 1.18]} />
      <directionalLight position={[-3.4, -2.6, 6.4]} intensity={2.15} castShadow />
      <pointLight position={[3.8, -3.2, 4.8]} intensity={1.24} color="#f1d28a" />
      <FurTradeMapModel {...props} />
      <OrbitControls makeDefault enableDamping dampingFactor={0.08} enablePan minDistance={4.2} maxDistance={10.4} maxPolarAngle={Math.PI * 0.62} />
    </Canvas>
  )
}
