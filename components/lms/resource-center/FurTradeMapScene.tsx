'use client'

import { Line, OrbitControls, useTexture } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Color, DoubleSide, Group, PlaneGeometry, Shape, SRGBColorSpace, Vector3 } from 'three'

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
  const reliefTexture = useTexture('/fur-trade/canada-relief-texture.png')
  const terrainGeometry = useMemo(() => createTerrainGeometry(terrainMode), [terrainMode])
  reliefTexture.colorSpace = SRGBColorSpace
  reliefTexture.anisotropy = 8

  return (
    <mesh geometry={terrainGeometry} position={[0, 0, -0.18]} receiveShadow>
      <meshStandardMaterial map={reliefTexture} color="#ffffff" roughness={0.82} metalness={0.01} side={DoubleSide} />
    </mesh>
  )
}

function LandMass({ coordinates, index }: { coordinates: Array<{ latitude: number; longitude: number }>; index: number }) {
  const shape = useMemo(() => shapeFromCoordinates(coordinates), [coordinates])

  return (
    <mesh receiveShadow position={[0, 0, 0.06]}>
      <shapeGeometry args={[shape]} />
      <meshStandardMaterial
        color={index === 0 ? '#d3e29a' : '#e4ebba'}
        roughness={0.78}
        metalness={0.01}
        transparent
        opacity={index === 0 ? 0.18 : 0.24}
        side={DoubleSide}
      />
    </mesh>
  )
}

function BoundaryLines() {
  return (
    <>
      {furTradeCanadaOutlines.map((outline, index) => (
        <Line
          key={index}
          points={outline.map((coordinate) => {
            const point = projectFurTradeCoordinate(coordinate)
            return new Vector3(point.sceneX, point.sceneY, 0.2)
          })}
          color={index === 0 ? '#f8f1c8' : '#e6edbf'}
          lineWidth={index === 0 ? 1.65 : 1.05}
          transparent
          opacity={index === 0 ? 0.9 : 0.58}
        />
      ))}
    </>
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
        <LandMass key={index} coordinates={outline} index={index} />
      ))}
      {furTradeWaterBodies.map((water, index) => (
        <WaterMass key={index} coordinates={water} />
      ))}
      <BoundaryLines />
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
