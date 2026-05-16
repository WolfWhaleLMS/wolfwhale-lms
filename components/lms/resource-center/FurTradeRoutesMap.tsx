'use client'

import dynamic from 'next/dynamic'
import {
  ArrowRight,
  BookOpen,
  CircleDot,
  Clock3,
  Compass,
  Filter,
  Landmark,
  Layers,
  Map,
  MapPin,
  Navigation,
  Package,
  Route,
  Sparkles,
  Target,
  Users,
  Waves,
  type LucideIcon,
} from 'lucide-react'
import { useMemo, useState, type CSSProperties } from 'react'

import {
  furTradeEras,
  furTradeLocations,
  furTradeRoutes,
  furTradeSources,
  getFurTradeEraById,
  getFurTradeLocationById,
  getFurTradeLocationMapPoint,
  getFurTradeLocationsForRoute,
  getFurTradeRoutesForLocation,
  type FurTradeEra,
  type FurTradeEraId,
  type FurTradeLocation,
  type FurTradeLocationId,
  type FurTradeNetworkId,
  type FurTradeRoute,
} from './fur-trade'

type NetworkFilterId = 'all' | FurTradeNetworkId
type FurTradeTerrainMode = 'terrain' | 'atlas'

const FurTradeMapScene = dynamic(
  () => import('./FurTradeMapScene').then((module) => module.FurTradeMapScene),
  {
    ssr: false,
    loading: () => (
      <div
        role="img"
        aria-label="Accurate 3D fur trade map preview"
        className="grid h-full min-h-[460px] place-items-center bg-[#082832]"
      >
        <div className="grid w-72 gap-3 rounded-lg border border-white/15 bg-[#071b20]/88 p-4 text-white shadow-[0_18px_50px_rgba(2,8,23,0.36)]">
          <span className="text-xs font-black uppercase text-[#f1d28a]">Loading 3D terrain</span>
          <span className="font-serif text-xl text-white">Fur trade map</span>
          <span className="h-2 overflow-hidden rounded-full bg-white/15">
            <span className="block h-full w-2/3 rounded-full bg-[#7cbe63]" />
          </span>
        </div>
      </div>
    ),
  },
)

type NetworkFilter = {
  id: NetworkFilterId
  label: string
  Icon: LucideIcon
  color: string
}

const networkFilters: NetworkFilter[] = [
  { id: 'all', label: 'All routes', Icon: Layers, color: '#f1d28a' },
  { id: 'indigenous', label: 'Indigenous', Icon: Users, color: '#7cbe63' },
  { id: 'french', label: 'French', Icon: Navigation, color: '#2f9fd6' },
  { id: 'hbc', label: 'HBC', Icon: Landmark, color: '#cf3f36' },
  { id: 'nwc', label: 'NWC', Icon: Route, color: '#d98b2b' },
  { id: 'pacific', label: 'Pacific', Icon: Waves, color: '#b454c7' },
]

function networkLabel(id: FurTradeNetworkId) {
  switch (id) {
    case 'indigenous':
      return 'Indigenous networks'
    case 'french':
      return 'French and St. Lawrence trade'
    case 'hbc':
      return 'Hudson Bay Company'
    case 'nwc':
      return 'North West Company'
    case 'merged-hbc':
      return 'Merged HBC after 1821'
    case 'pacific':
      return 'Pacific brigade'
  }
}

function MiniRoute({ route }: { route: FurTradeRoute }) {
  return (
    <span className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/12 bg-[#182f33]">
      <span className="absolute h-[3px] w-12 -rotate-12 rounded-full" style={{ background: route.color }} />
      <span className="absolute h-[3px] w-9 rotate-12 rounded-full opacity-70" style={{ background: route.color }} />
      <MapPin className="relative h-5 w-5 text-white" />
    </span>
  )
}

function EraSelector({
  selectedEra,
  onSelectEra,
}: {
  selectedEra: FurTradeEra
  onSelectEra: (id: FurTradeEraId) => void
}) {
  return (
    <section className="rounded-lg border border-white/12 bg-[#102629]/92 p-5 text-white shadow-[0_14px_36px_rgba(4,24,26,0.24)]">
      <div className="mb-4 flex items-center justify-between border-b border-dashed border-white/18 pb-3 text-sm font-black uppercase text-[#f5d28d]">
        <span className="inline-flex items-center gap-2">
          <Clock3 className="h-4 w-4" />
          Era
        </span>
        <Compass className="h-4 w-4" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {furTradeEras.map((era) => (
          <button
            key={era.id}
            type="button"
            onClick={() => onSelectEra(era.id)}
            className="min-h-11 rounded-lg border border-white/12 bg-white/8 px-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/12 data-[selected=true]:border-[#f1d28a] data-[selected=true]:bg-[#f1d28a] data-[selected=true]:text-[#1c241d]"
            data-selected={selectedEra.id === era.id}
            aria-pressed={selectedEra.id === era.id}
          >
            {era.label}
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-lg border border-white/10 bg-white/8 p-3">
        <h3 className="font-serif text-2xl leading-none text-white">{selectedEra.title}</h3>
        <p className="mt-2 text-sm font-semibold leading-6 text-[#d7e7dc]">{selectedEra.summary}</p>
      </div>
    </section>
  )
}

function NetworkFilters({
  selectedNetwork,
  onSelectNetwork,
}: {
  selectedNetwork: NetworkFilterId
  onSelectNetwork: (id: NetworkFilterId) => void
}) {
  return (
    <section className="rounded-lg border border-white/12 bg-[#102629]/92 p-5 text-white shadow-[0_14px_36px_rgba(4,24,26,0.24)]">
      <div className="mb-4 flex items-center justify-between border-b border-dashed border-white/18 pb-3 text-sm font-black uppercase text-[#f5d28d]">
        <span className="inline-flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Networks
        </span>
        <Route className="h-4 w-4" />
      </div>
      <div className="grid gap-2">
        {networkFilters.map(({ id, label, Icon, color }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelectNetwork(id)}
            className="flex min-h-11 items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-left text-sm font-semibold text-[#eef8f1] transition hover:translate-x-0.5 hover:bg-white/8 data-[selected=true]:border-white/16 data-[selected=true]:bg-white/12"
            data-selected={selectedNetwork === id}
            aria-pressed={selectedNetwork === id}
          >
            <span className="grid h-7 w-7 place-items-center rounded-full" style={{ background: `${color}30`, color }}>
              <Icon className="h-4 w-4" />
            </span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

function RoutesPanel({
  routes,
  onSelectLocation,
}: {
  routes: FurTradeRoute[]
  onSelectLocation: (id: FurTradeLocationId) => void
}) {
  return (
    <section className="rounded-lg border border-white/12 bg-[#102629]/92 p-5 text-white shadow-[0_14px_36px_rgba(4,24,26,0.24)]">
      <div className="mb-4 flex items-center justify-between border-b border-dashed border-white/18 pb-3 text-sm font-black uppercase text-[#f5d28d]">
        <span className="inline-flex items-center gap-2">
          <Route className="h-4 w-4" />
          Active Routes
        </span>
        <span>{routes.length}</span>
      </div>
      <div className="grid gap-3">
        {routes.map((route) => {
          const firstLocation = getFurTradeLocationsForRoute(route)[0]

          return (
            <button
              key={route.id}
              type="button"
              onClick={() => onSelectLocation(firstLocation.id)}
              className="grid min-h-[88px] grid-cols-[52px_minmax(0,1fr)] items-center gap-3 rounded-lg border border-white/10 bg-white/8 p-3 text-left transition hover:-translate-y-0.5 hover:bg-white/12"
            >
              <MiniRoute route={route} />
              <span className="grid min-w-0 gap-1">
                <span className="font-serif text-[1.05rem] leading-tight text-white">{route.name}</span>
                <span className="text-xs font-black uppercase text-[#f5d28d]">{networkLabel(route.networkId)}</span>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function CanadaBaseMap({
  selectedEra,
  selectedNetwork,
  selectedLocation,
  visibleRoutes,
  terrainMode,
  onSelectTerrainMode,
  onSelectLocation,
}: {
  selectedEra: FurTradeEra
  selectedNetwork: NetworkFilterId
  selectedLocation: FurTradeLocation
  visibleRoutes: FurTradeRoute[]
  terrainMode: FurTradeTerrainMode
  onSelectTerrainMode: (mode: FurTradeTerrainMode) => void
  onSelectLocation: (id: FurTradeLocationId) => void
}) {
  return (
    <section className="relative min-h-[720px] overflow-hidden rounded-lg border border-white/12 bg-[#071f28] p-4 text-white shadow-[0_18px_50px_rgba(4,20,26,0.34)] lg:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_20%,rgba(82,160,186,0.22),transparent_24%),radial-gradient(circle_at_74%_34%,rgba(241,210,138,0.16),transparent_28%),linear-gradient(180deg,rgba(5,32,39,0.3),rgba(4,16,20,0.82))]" />

      <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="font-serif text-5xl font-medium leading-[0.96] tracking-normal text-white lg:text-6xl">
            Accurate 3D Route Terrain
          </h3>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-[#d6e6dc]">
            Trace Canada through projected posts, canoe routes, portages, and trade networks from the St. Lawrence to Hudson Bay and the Pacific.
          </p>
        </div>
        <div className="grid w-full gap-3 rounded-lg border border-white/12 bg-[#08181d]/78 p-4 shadow-[0_14px_36px_rgba(4,20,26,0.28)] sm:w-[340px]">
          <span className="text-sm font-black uppercase text-[#f5d28d]">Current frame</span>
          <strong className="font-serif text-2xl leading-none text-white">{selectedEra.label}</strong>
          <p className="text-sm font-semibold leading-6 text-[#d6e6dc]">{selectedEra.focus}</p>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label="Fur trade map mode">
            <button
              type="button"
              onClick={() => onSelectTerrainMode('terrain')}
              className="min-h-10 rounded-lg border border-white/12 bg-white/8 px-3 text-sm font-black text-white transition hover:bg-white/12 data-[selected=true]:border-[#f1d28a] data-[selected=true]:bg-[#f1d28a] data-[selected=true]:text-[#1c241d]"
              data-selected={terrainMode === 'terrain'}
              aria-pressed={terrainMode === 'terrain'}
            >
              3D terrain
            </button>
            <button
              type="button"
              onClick={() => onSelectTerrainMode('atlas')}
              className="min-h-10 rounded-lg border border-white/12 bg-white/8 px-3 text-sm font-black text-white transition hover:bg-white/12 data-[selected=true]:border-[#f1d28a] data-[selected=true]:bg-[#f1d28a] data-[selected=true]:text-[#1c241d]"
              data-selected={terrainMode === 'atlas'}
              aria-pressed={terrainMode === 'atlas'}
            >
              Flat atlas
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-6 overflow-hidden rounded-lg border border-white/12 bg-[#0b2c35]">
        <div className="relative h-[500px] lg:h-[636px]">
          <FurTradeMapScene
            selectedEra={selectedEra}
            selectedNetwork={selectedNetwork}
            selectedLocation={selectedLocation}
            visibleRoutes={visibleRoutes}
            terrainMode={terrainMode}
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_45%,rgba(3,17,22,0.54)_100%)]" />

          {furTradeLocations.map((location) => {
            const activeInEra = location.activeEraIds.includes(selectedEra.id)
            const activeInNetwork = selectedNetwork === 'all' || location.networkIds.includes(selectedNetwork)
            const selected = selectedLocation.id === location.id
            const muted = !activeInEra || !activeInNetwork
            const point = getFurTradeLocationMapPoint(location)

            return (
              <button
                key={location.id}
                type="button"
                onClick={() => onSelectLocation(location.id)}
                aria-label={location.name}
                aria-pressed={selected}
                className="group absolute z-20 grid h-8 w-8 min-w-0 -translate-x-1/2 -translate-y-1/2 place-items-center gap-1 rounded-lg border border-white/14 bg-[#071b20]/86 px-0 py-0 text-center text-[11px] font-black text-white shadow-[0_10px_24px_rgba(2,8,23,0.28)] backdrop-blur transition-colors hover:z-30 hover:h-auto hover:w-auto hover:min-w-[92px] hover:bg-[#f1d28a] hover:px-2 hover:py-1.5 hover:text-[#1f281f] data-[muted=true]:opacity-42 data-[selected=true]:h-auto data-[selected=true]:w-auto data-[selected=true]:min-w-[96px] data-[selected=true]:border-[#f1d28a] data-[selected=true]:bg-[#f1d28a] data-[selected=true]:px-2 data-[selected=true]:py-1.5 data-[selected=true]:text-[#1f281f] sm:h-9 sm:w-9 sm:min-w-0 sm:px-0 sm:py-0 sm:text-xs"
                data-selected={selected}
                data-muted={muted}
                style={{
                  left: `clamp(58px, ${point.percentX}%, calc(100% - 58px))`,
                  top: `clamp(18px, ${point.percentY}%, calc(100% - 18px))`,
                }}
              >
                <span className="h-2.5 w-2.5 rounded-full bg-current shadow-[0_0_0_5px_rgba(255,255,255,0.16)]" />
                <span className="hidden max-w-[120px] leading-tight group-hover:block group-data-[selected=true]:block">{location.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="relative z-10 mt-4 grid gap-3 rounded-lg border border-white/12 bg-white/8 p-4 text-sm font-semibold text-[#d6e6dc] sm:grid-cols-2 xl:grid-cols-5">
        <span className="inline-flex items-center gap-2">
          <Layers className="h-4 w-4 text-[#f1d28a]" />
          geoBoundaries Canada outline
        </span>
        <span className="inline-flex items-center gap-2">
          <Compass className="h-4 w-4 text-[#f1d28a]" />
          HD image-generated relief texture
        </span>
        <span className="inline-flex items-center gap-2">
          <Map className="h-4 w-4 text-[#f1d28a]" />
          Real longitude and latitude projection
        </span>
        <span className="inline-flex items-center gap-2">
          <Package className="h-4 w-4 text-[#f1d28a]" />
          Goods, posts, and labour systems
        </span>
        <span className="inline-flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#f1d28a]" />
          {visibleRoutes.length} route overlays active
        </span>
      </div>
    </section>
  )
}

function LocationDetails({
  location,
  selectedEra,
  mastery,
  onSelectLocation,
}: {
  location: FurTradeLocation
  selectedEra: FurTradeEra
  mastery: number
  onSelectLocation: (id: FurTradeLocationId) => void
}) {
  const routes = getFurTradeRoutesForLocation(location.id)
  const connectedLocations = routes
    .flatMap((route) => getFurTradeLocationsForRoute(route))
    .filter((candidate, index, all) => candidate.id !== location.id && all.findIndex((item) => item.id === candidate.id) === index)
    .slice(0, 4)

  return (
    <aside className="grid gap-4">
      <section className="rounded-lg border border-white/12 bg-[#102629]/92 p-5 text-white shadow-[0_14px_36px_rgba(4,24,26,0.24)]">
        <div className="mb-4 flex items-center justify-between border-b border-dashed border-white/18 pb-3 text-sm font-black uppercase text-[#f5d28d]">
          <span>Location Details</span>
          <MapPin className="h-4 w-4" />
        </div>
        <h3 className="font-serif text-4xl leading-none text-white">{location.name}</h3>
        <p className="mt-2 font-serif text-lg italic text-[#d6e6dc]/82">{location.region}</p>
        <dl className="mt-5 grid gap-3">
          <div className="grid grid-cols-[0.85fr_1.15fr] items-center gap-3">
            <dt className="font-serif text-[#d6e6dc]/70">Founded</dt>
            <dd className="font-serif text-white">{location.founded}</dd>
          </div>
          <div className="grid grid-cols-[0.85fr_1.15fr] items-center gap-3">
            <dt className="font-serif text-[#d6e6dc]/70">Networks</dt>
            <dd className="font-serif text-white">{location.networkIds.map(networkLabel).join(', ')}</dd>
          </div>
          <div className="grid grid-cols-[0.85fr_1.15fr] items-center gap-3">
            <dt className="font-serif text-[#d6e6dc]/70">Goods</dt>
            <dd className="font-serif text-white">{location.goods.join(', ')}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-lg border border-white/12 bg-[#102629]/92 p-5 text-white shadow-[0_14px_36px_rgba(4,24,26,0.24)]">
        <div className="mb-4 border-b border-dashed border-white/18 pb-3 text-sm font-black uppercase text-[#f5d28d]">Map Notes</div>
        <p className="font-serif leading-7 text-[#eef8f1]">{location.story}</p>
        <p className="mt-4 rounded-lg border border-white/10 bg-white/8 p-3 text-sm font-semibold leading-6 text-[#d6e6dc]">
          {location.communityNote}
        </p>
      </section>

      <section className="grid gap-4 rounded-lg border border-white/12 bg-[#102629]/92 p-5 text-white shadow-[0_14px_36px_rgba(4,24,26,0.24)]">
        <div className="border-b border-dashed border-white/18 pb-3 text-sm font-black uppercase text-[#f5d28d]">
          <span className="inline-flex items-center gap-2">
            <Target className="h-4 w-4" />
            Inquiry
          </span>
        </div>
        <div className="grid gap-2">
          <div className="flex items-center gap-2 font-semibold text-[#eef8f1]">
            <CircleDot className="h-4 w-4" />
            <span>Map coverage</span>
            <strong className="ml-auto font-serif text-xl">{mastery}%</strong>
          </div>
          <span className="h-2.5 overflow-hidden rounded-full bg-white/15">
            <span className="block h-full rounded-full bg-[linear-gradient(90deg,#f1d28a,#7cbe63,#2f9fd6)]" style={{ width: `${mastery}%` }} />
          </span>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/8 p-3">
          <span className="inline-flex items-center gap-2 text-sm font-black text-[#f5d28d]">
            <BookOpen className="h-4 w-4" />
            Current lesson focus
          </span>
          <p className="mt-2 font-serif leading-6 text-[#eef8f1]">
            Explain how <strong className="text-[#f1d28a]">{location.name}</strong> fits the {selectedEra.label} trade system, then compare it with another connected place.
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-white/12 bg-[#102629]/92 p-5 text-white shadow-[0_14px_36px_rgba(4,24,26,0.24)]">
        <div className="mb-4 flex items-center gap-2 border-b border-dashed border-white/18 pb-3 text-sm font-black uppercase text-[#f5d28d]">
          Connected Posts
          <ArrowRight className="h-4 w-4" />
        </div>
        <div className="grid gap-2">
          {connectedLocations.map((connected) => (
            <button
              key={connected.id}
              type="button"
              onClick={() => onSelectLocation(connected.id)}
              className="flex min-h-10 items-center justify-between gap-3 rounded-lg bg-white/8 px-3 text-left text-sm font-semibold text-[#eef8f1] transition hover:bg-white/12"
            >
              <span>{connected.name}</span>
              <ArrowRight className="h-4 w-4 text-[#f1d28a]" />
            </button>
          ))}
        </div>
      </section>
    </aside>
  )
}

function BottomPanels({ selectedEra, visibleRoutes }: { selectedEra: FurTradeEra; visibleRoutes: FurTradeRoute[] }) {
  const routeGoods = Array.from(new Set(visibleRoutes.flatMap((route) => route.goods))).slice(0, 6)

  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
      <div className="rounded-lg border border-white/12 bg-[#102629]/92 p-5 text-white shadow-[0_14px_36px_rgba(4,24,26,0.24)]">
        <div className="mb-4 flex items-center gap-2 border-b border-dashed border-white/18 pb-3 text-sm font-black uppercase text-[#f5d28d]">
          Indigenous Trade Networks
          <Users className="h-4 w-4" />
        </div>
        <p className="font-serif leading-7 text-[#eef8f1]">
          This map treats Indigenous nations as active economic and diplomatic powers. Posts were often placed near existing settlements, portages, food systems, and meeting places; traders depended on Indigenous knowledge, labour, languages, and kinship relationships.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {['River knowledge', 'Food supply', 'Diplomacy'].map((item) => (
            <span key={item} className="rounded-lg border border-white/10 bg-white/8 p-3 text-sm font-black text-[#d6e6dc]">
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-white/12 bg-[#102629]/92 p-5 text-white shadow-[0_14px_36px_rgba(4,24,26,0.24)]">
        <div className="mb-4 flex items-center gap-2 border-b border-dashed border-white/18 pb-3 text-sm font-black uppercase text-[#f5d28d]">
          Goods In Motion
          <Package className="h-4 w-4" />
        </div>
        <div className="grid gap-2">
          {routeGoods.map((item) => (
            <span key={item} className="rounded-lg border border-white/10 bg-white/8 px-3 py-2 text-sm font-semibold text-[#eef8f1]">
              {item}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm font-semibold leading-6 text-[#d6e6dc]">{selectedEra.focus}</p>
      </div>
    </section>
  )
}

export function FurTradeRoutesMap() {
  const [selectedEraId, setSelectedEraId] = useState<FurTradeEraId>('1670-1774')
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkFilterId>('all')
  const [selectedLocationId, setSelectedLocationId] = useState<FurTradeLocationId>('york-factory')
  const [terrainMode, setTerrainMode] = useState<FurTradeTerrainMode>('terrain')
  const [viewedLocations, setViewedLocations] = useState<Set<FurTradeLocationId>>(() => new Set(['york-factory']))

  const selectedEra = useMemo(() => getFurTradeEraById(selectedEraId), [selectedEraId])
  const selectedLocation = useMemo(() => getFurTradeLocationById(selectedLocationId), [selectedLocationId])
  const visibleRoutes = useMemo(
    () =>
      furTradeRoutes.filter((route) => {
        const eraMatch = route.activeEraIds.includes(selectedEra.id)
        const networkMatch = selectedNetwork === 'all' || route.networkId === selectedNetwork || (selectedNetwork === 'hbc' && route.networkId === 'merged-hbc')

        return eraMatch && networkMatch
      }),
    [selectedEra.id, selectedNetwork],
  )
  const mastery = Math.round((viewedLocations.size / furTradeLocations.length) * 100)

  function handleSelectEra(id: FurTradeEraId) {
    const era = getFurTradeEraById(id)
    const nextLocation = selectedLocation.activeEraIds.includes(era.id)
      ? selectedLocation
      : furTradeLocations.find((location) => location.activeEraIds.includes(era.id)) ?? selectedLocation

    setSelectedEraId(id)
    handleSelectLocation(nextLocation.id)
  }

  function handleSelectLocation(id: FurTradeLocationId) {
    setSelectedLocationId(id)
    setViewedLocations((current) => new Set(current).add(id))
  }

  const shellStyle = {
    '--fur-trade-gold': '#f1d28a',
    '--fur-trade-green': '#7cbe63',
  } as CSSProperties

  return (
    <section
      className="overflow-hidden rounded-lg border border-white/12 bg-[#0a2023] p-3 text-white shadow-[0_18px_50px_rgba(4,24,26,0.34)] sm:p-4"
      style={shellStyle}
      aria-label="Fur Trade Routes Map resource"
    >
      <div className="mb-4 flex flex-col gap-3 border-b border-white/12 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[#f1d28a]/18 text-[#f1d28a] shadow-[0_10px_28px_rgba(4,24,26,0.24)]">
            <Map className="h-7 w-7" />
          </span>
          <div className="min-w-0">
            <h2 className="font-serif text-4xl font-medium leading-none text-white">Fur Trade Routes Map</h2>
            <p className="mt-2 text-sm font-semibold text-[#d6e6dc]">Explore Canada through posts, canoe routes, portages, and trade networks</p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-2" aria-label="Fur Trade resource links">
          <a href="#fur-trade-routes-map" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#f1d28a] px-4 text-sm font-black text-[#1c241d]">
            <Map className="h-4 w-4" />
            Trade map
          </a>
          <a href="#course-files" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/12 bg-white/8 px-4 text-sm font-bold text-white">
            <BookOpen className="h-4 w-4" />
            Course files
          </a>
        </nav>
      </div>

      <div id="fur-trade-routes-map" className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="grid gap-4">
          <EraSelector selectedEra={selectedEra} onSelectEra={handleSelectEra} />
          <NetworkFilters selectedNetwork={selectedNetwork} onSelectNetwork={setSelectedNetwork} />
          <RoutesPanel routes={visibleRoutes} onSelectLocation={handleSelectLocation} />
        </aside>
        <div className="grid gap-4">
          <CanadaBaseMap
            selectedEra={selectedEra}
            selectedNetwork={selectedNetwork}
            selectedLocation={selectedLocation}
            visibleRoutes={visibleRoutes}
            terrainMode={terrainMode}
            onSelectTerrainMode={setTerrainMode}
            onSelectLocation={handleSelectLocation}
          />
          <BottomPanels selectedEra={selectedEra} visibleRoutes={visibleRoutes} />
          <LocationDetails
            location={selectedLocation}
            selectedEra={selectedEra}
            mastery={mastery}
            onSelectLocation={handleSelectLocation}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-3 rounded-lg border border-white/12 bg-white/8 p-4 text-sm font-semibold text-[#d6e6dc] lg:grid-cols-[1fr_auto]">
        <span className="inline-flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-[#f1d28a]" />
          Boundary data from geoBoundaries, with teaching notes from Parks Canada, Library and Archives Canada, and Indigenous Peoples Atlas of Canada.
        </span>
        <div className="flex flex-wrap gap-2">
          {furTradeSources.map((source) => (
            <a key={source.url} href={source.url} className="rounded-lg border border-white/12 bg-[#071b20]/68 px-3 py-2 text-xs font-black text-white hover:bg-white/10">
              {source.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
