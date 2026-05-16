import { canadaBoundaryRings, canadaBoundarySource } from './canada-boundary'

export type FurTradeEraId = '1600-1670' | '1670-1774' | '1774-1821' | '1821-1870'

export type FurTradeNetworkId = 'indigenous' | 'french' | 'hbc' | 'nwc' | 'merged-hbc' | 'pacific'

export type FurTradeLocationId =
  | 'montreal'
  | 'tadoussac'
  | 'sault-ste-marie'
  | 'fort-william'
  | 'moose-factory'
  | 'york-factory'
  | 'norway-house'
  | 'cumberland-house'
  | 'fort-garry'
  | 'fort-edmonton'
  | 'fort-chipewyan'
  | 'portage-la-loche'
  | 'rocky-mountain-house'
  | 'fort-kamloops'
  | 'fort-langley'

export type FurTradeEra = {
  id: FurTradeEraId
  label: string
  title: string
  summary: string
  focus: string
}

export type FurTradeLocation = {
  id: FurTradeLocationId
  name: string
  region: string
  latitude: number
  longitude: number
  x: number
  y: number
  founded: string
  networkIds: FurTradeNetworkId[]
  activeEraIds: FurTradeEraId[]
  goods: string[]
  communityNote: string
  story: string
}

export type FurTradeRoute = {
  id: string
  name: string
  networkId: FurTradeNetworkId
  color: string
  activeEraIds: FurTradeEraId[]
  locationIds: FurTradeLocationId[]
  goods: string[]
  note: string
}

export type FurTradeSource = {
  label: string
  url: string
}

export type FurTradeProjectedPoint = {
  x: number
  y: number
  percentX: number
  percentY: number
  sceneX: number
  sceneY: number
}

type FurTradeCoordinate = {
  latitude: number
  longitude: number
}

export const furTradeEras: FurTradeEra[] = [
  {
    id: '1600-1670',
    label: '1600-1670',
    title: 'River alliances and early exchange',
    summary:
      'French traders entered existing Indigenous trade corridors along the St. Lawrence, Great Lakes, and northern waterways.',
    focus: 'Students should look for how water routes and diplomacy shaped exchange before inland companies built large post networks.',
  },
  {
    id: '1670-1774',
    label: '1670-1774',
    title: 'Hudson Bay charter and coastal depots',
    summary:
      'The Hudson Bay Company used bay-side posts such as Moose Factory and York Factory while Indigenous traders carried knowledge, furs, and goods across inland networks.',
    focus: 'Students should compare the bay-side depot model with the Montreal canoe system.',
  },
  {
    id: '1774-1821',
    label: '1774-1821',
    title: 'Inland competition',
    summary:
      'The North West Company pushed canoe brigades west from Montreal and Fort William while the Hudson Bay Company built inland posts to compete.',
    focus: 'Students should trace why Cumberland House, Fort Chipewyan, and Fort Edmonton mattered during the most competitive period.',
  },
  {
    id: '1821-1870',
    label: '1821-1870',
    title: 'Merged company and transition',
    summary:
      'After the 1821 merger, the Hudson Bay Company reorganized routes toward Hudson Bay and the Pacific, while many Metis workers became freighters, boatmen, hunters, and independent traders.',
    focus: 'Students should connect route changes with Red River, the Pacific coast, and the 1870 transfer of Rupert Land to Canada.',
  },
]

export const furTradeLocations: FurTradeLocation[] = [
  {
    id: 'montreal',
    name: 'Montreal',
    region: 'St. Lawrence River',
    latitude: 45.5017,
    longitude: -73.5673,
    x: 795,
    y: 410,
    founded: 'Major fur-trade entrepot by the 1600s',
    networkIds: ['french', 'nwc'],
    activeEraIds: ['1600-1670', '1670-1774', '1774-1821'],
    goods: ['Trade goods', 'beaver pelts', 'canoe supplies'],
    communityNote:
      'Montreal-based merchants depended on Indigenous geographic knowledge, kinship diplomacy, and voyageurs to move goods inland.',
    story:
      'Montreal linked European markets to the Ottawa River, the Great Lakes, Lake Superior, and the western interior. The North West Company later made this east-west canoe system its commercial backbone.',
  },
  {
    id: 'tadoussac',
    name: 'Tadoussac',
    region: 'St. Lawrence and Saguenay',
    latitude: 48.1421,
    longitude: -69.7164,
    x: 835,
    y: 370,
    founded: 'Early 1600s trading place',
    networkIds: ['indigenous', 'french'],
    activeEraIds: ['1600-1670', '1670-1774'],
    goods: ['Furs', 'copper goods', 'cloth', 'fish'],
    communityNote:
      'The location sat within longstanding Innu and other Indigenous travel and exchange networks before permanent French colonial settlement.',
    story:
      'Tadoussac shows that the fur trade did not begin from a blank map. Europeans entered meeting places and river routes that Indigenous nations already used.',
  },
  {
    id: 'sault-ste-marie',
    name: 'Sault Ste. Marie',
    region: 'Great Lakes passage',
    latitude: 46.5219,
    longitude: -84.3461,
    x: 690,
    y: 405,
    founded: 'Strategic Great Lakes crossing',
    networkIds: ['indigenous', 'french', 'nwc'],
    activeEraIds: ['1600-1670', '1670-1774', '1774-1821'],
    goods: ['Furs', 'fish', 'metal tools', 'canoe cargo'],
    communityNote:
      'Anishinaabe communities controlled knowledge of local waters, portages, fishing places, and diplomacy around the Great Lakes.',
    story:
      'Canoes moving west from Montreal had to pass through the Great Lakes. The rapids and portages made this a practical and diplomatic checkpoint.',
  },
  {
    id: 'fort-william',
    name: 'Fort William',
    region: 'Lake Superior',
    latitude: 48.3809,
    longitude: -89.2477,
    x: 610,
    y: 397,
    founded: '1803 North West Company depot',
    networkIds: ['nwc'],
    activeEraIds: ['1774-1821'],
    goods: ['Pemmican', 'beaver pelts', 'trade bundles', 'canoes'],
    communityNote:
      'Voyageurs, many French-Canadian, Haudenosaunee, Anishinaabeg, and later Metis, moved freight through the depot system.',
    story:
      'Fort William replaced Grand Portage as the North West Company rendezvous on British territory. It connected Montreal supply canoes with interior wintering partners.',
  },
  {
    id: 'moose-factory',
    name: 'Moose Factory',
    region: 'James Bay',
    latitude: 51.2625,
    longitude: -80.6094,
    x: 675,
    y: 315,
    founded: '1673 Hudson Bay Company post',
    networkIds: ['hbc', 'indigenous'],
    activeEraIds: ['1670-1774', '1774-1821', '1821-1870'],
    goods: ['Beaver pelts', 'blankets', 'guns', 'copper kettles'],
    communityNote:
      'Cree trading families and coastal communities shaped the flow of furs and goods into James Bay posts.',
    story:
      'Moose Factory was one of the Hudson Bay Company coastal gateways where ships, warehouses, and Indigenous inland networks met.',
  },
  {
    id: 'york-factory',
    name: 'York Factory',
    region: 'Hayes River, Hudson Bay',
    latitude: 57.0108,
    longitude: -92.3058,
    x: 560,
    y: 245,
    founded: '1684 Hudson Bay Company post',
    networkIds: ['hbc', 'merged-hbc', 'indigenous'],
    activeEraIds: ['1670-1774', '1774-1821', '1821-1870'],
    goods: ['Beaver pelts', 'York boats', 'trade cloth', 'metal tools'],
    communityNote:
      'York Factory stands on Treaty 5 territory and lands traditionally used by Cree, Dene, Inuit, and Red River Metis peoples.',
    story:
      'York Factory became the Hudson Bay Company principal northern depot. From here, goods moved inland by river and furs moved outward to ships on Hudson Bay.',
  },
  {
    id: 'norway-house',
    name: 'Norway House',
    region: 'Lake Winnipeg outlet',
    latitude: 53.9876,
    longitude: -97.8274,
    x: 515,
    y: 325,
    founded: '1810s-1820s HBC transport hub',
    networkIds: ['hbc', 'merged-hbc'],
    activeEraIds: ['1774-1821', '1821-1870'],
    goods: ['York boat cargo', 'provisions', 'furs'],
    communityNote:
      'Cree, Metis, and other local families made the transport economy possible through labour, food supply, and regional knowledge.',
    story:
      'Norway House sat where routes from York Factory, Lake Winnipeg, and the western interior converged. After 1821 it became a major HBC transport hub.',
  },
  {
    id: 'cumberland-house',
    name: 'Cumberland House',
    region: 'Saskatchewan River delta',
    latitude: 53.9583,
    longitude: -102.2672,
    x: 470,
    y: 360,
    founded: '1774 first HBC inland post',
    networkIds: ['hbc', 'indigenous'],
    activeEraIds: ['1774-1821', '1821-1870'],
    goods: ['Furs', 'pemmican', 'trade goods'],
    communityNote:
      'The post was built inside Indigenous homelands and existing travel corridors rather than outside them.',
    story:
      'Cumberland House marked the Hudson Bay Company turn inland. Competition with Montreal traders pushed HBC beyond the bay-side depot model.',
  },
  {
    id: 'fort-garry',
    name: 'Fort Garry',
    region: 'Red River',
    latitude: 49.8954,
    longitude: -97.1385,
    x: 500,
    y: 414,
    founded: '1822 rebuilt as Upper Fort Garry',
    networkIds: ['merged-hbc', 'indigenous'],
    activeEraIds: ['1821-1870'],
    goods: ['Pemmican', 'cart freight', 'bison robes', 'trade goods'],
    communityNote:
      'Red River became a Metis homeland and transport centre tied to pemmican, cart brigades, river lots, and political resistance.',
    story:
      'Fort Garry connected river transport, plains provisioning, and the Red River settlement. It also sits near the political centre of the 1869-70 Red River Resistance.',
  },
  {
    id: 'fort-edmonton',
    name: 'Fort Edmonton',
    region: 'North Saskatchewan River',
    latitude: 53.5461,
    longitude: -113.4938,
    x: 350,
    y: 382,
    founded: '1795 HBC post',
    networkIds: ['hbc', 'nwc', 'merged-hbc', 'indigenous'],
    activeEraIds: ['1774-1821', '1821-1870'],
    goods: ['Furs', 'pemmican', 'horses', 'trade goods'],
    communityNote:
      'Cree, Blackfoot, Nakoda, Dene, Metis, and other peoples shaped the trade, diplomacy, and conflict of the northern plains.',
    story:
      'Fort Edmonton grew on a river route that linked the plains, parkland, and mountain passes. It became a major western post after the companies merged.',
  },
  {
    id: 'fort-chipewyan',
    name: 'Fort Chipewyan',
    region: 'Lake Athabasca',
    latitude: 58.7186,
    longitude: -111.1505,
    x: 325,
    y: 270,
    founded: '1788 North West Company post',
    networkIds: ['nwc', 'merged-hbc', 'indigenous'],
    activeEraIds: ['1774-1821', '1821-1870'],
    goods: ['Prime furs', 'pemmican', 'trade metal', 'canoe cargo'],
    communityNote:
      'Dene, Cree, and Metis families were central to travel, food supply, translation, and regional exchange in the Athabasca country.',
    story:
      'Fort Chipewyan opened the Athabasca region to Montreal-based traders and later became one of the most important northern interior posts.',
  },
  {
    id: 'portage-la-loche',
    name: 'Portage La Loche',
    region: 'Methye Portage',
    latitude: 56.4826,
    longitude: -109.4359,
    x: 430,
    y: 326,
    founded: 'Historic portage route',
    networkIds: ['indigenous', 'nwc', 'merged-hbc'],
    activeEraIds: ['1774-1821', '1821-1870'],
    goods: ['Fur packs', 'pemmican', 'canoes', 'York boat freight'],
    communityNote:
      'The portage was sustained by Indigenous and Metis labour, navigation, and knowledge of seasonal travel conditions.',
    story:
      'Methye Portage was one of the hardest overland links between the Churchill River system and the Athabasca region.',
  },
  {
    id: 'rocky-mountain-house',
    name: 'Rocky Mountain House',
    region: 'Upper North Saskatchewan',
    latitude: 52.377,
    longitude: -114.9189,
    x: 315,
    y: 392,
    founded: '1799 competing posts',
    networkIds: ['hbc', 'nwc', 'merged-hbc', 'indigenous'],
    activeEraIds: ['1774-1821', '1821-1870'],
    goods: ['Furs', 'horses', 'dried meat', 'trade goods'],
    communityNote:
      'The post sat within the homelands and diplomatic world of Plains and foothills peoples, including Blackfoot, Cree, Nakoda, and Metis communities.',
    story:
      'This was a foothills gateway where traders looked toward mountain passes while relying on plains food systems and local diplomacy.',
  },
  {
    id: 'fort-kamloops',
    name: 'Fort Kamloops',
    region: 'Interior Plateau',
    latitude: 50.6745,
    longitude: -120.3273,
    x: 235,
    y: 420,
    founded: '1812 Pacific and NWC posts nearby',
    networkIds: ['nwc', 'merged-hbc', 'pacific', 'indigenous'],
    activeEraIds: ['1774-1821', '1821-1870'],
    goods: ['Furs', 'salmon', 'horses', 'trade cloth'],
    communityNote:
      'Secwepemc and other Interior peoples controlled key travel corridors, food systems, and exchange relationships.',
    story:
      'Kamloops linked the plateau to New Caledonia, the Columbia district, and later HBC Pacific routes.',
  },
  {
    id: 'fort-langley',
    name: 'Fort Langley',
    region: 'Lower Fraser River',
    latitude: 49.1688,
    longitude: -122.579,
    x: 205,
    y: 455,
    founded: '1827 Hudson Bay Company post',
    networkIds: ['merged-hbc', 'pacific', 'indigenous'],
    activeEraIds: ['1821-1870'],
    goods: ['Furs', 'salmon', 'cranberries', 'farm produce'],
    communityNote:
      'Fort Langley was built beside existing Indigenous settlements and trading places; Kwantlen people were central partners in trade and regional life.',
    story:
      'Fort Langley became a Pacific transshipment depot after the Columbia River route moved outside British territory. It also became part of the story of British Columbia becoming a colony.',
  },
]

export const furTradeRoutes: FurTradeRoute[] = [
  {
    id: 'st-lawrence-great-lakes',
    name: 'St. Lawrence to Great Lakes canoe road',
    networkId: 'french',
    color: '#2f9fd6',
    activeEraIds: ['1600-1670', '1670-1774', '1774-1821'],
    locationIds: ['tadoussac', 'montreal', 'sault-ste-marie', 'fort-william'],
    goods: ['Trade goods westbound', 'furs eastbound'],
    note:
      'This route shows why rivers and lakes were the first national-scale transport system for the fur trade.',
  },
  {
    id: 'hudson-bay-hayes',
    name: 'Hudson Bay and Hayes River supply line',
    networkId: 'hbc',
    color: '#cf3f36',
    activeEraIds: ['1670-1774', '1774-1821', '1821-1870'],
    locationIds: ['moose-factory', 'york-factory', 'norway-house', 'cumberland-house', 'fort-edmonton'],
    goods: ['European trade goods inland', 'furs to Hudson Bay ships'],
    note:
      'HBC coastal posts used ocean access, warehouses, and inland Indigenous routes to move goods through Rupert Land.',
  },
  {
    id: 'north-west-athabasca',
    name: 'North West Company Athabasca push',
    networkId: 'nwc',
    color: '#d98b2b',
    activeEraIds: ['1774-1821'],
    locationIds: ['montreal', 'fort-william', 'cumberland-house', 'portage-la-loche', 'fort-chipewyan'],
    goods: ['High-value northern furs', 'pemmican', 'canoe freight'],
    note:
      'Montreal traders used long canoe brigades and difficult portages to reach the Athabasca country.',
  },
  {
    id: 'red-river-plains',
    name: 'Red River and plains provisioning network',
    networkId: 'indigenous',
    color: '#7cbe63',
    activeEraIds: ['1774-1821', '1821-1870'],
    locationIds: ['fort-garry', 'cumberland-house', 'fort-edmonton', 'rocky-mountain-house'],
    goods: ['Pemmican', 'bison robes', 'horses', 'cart freight'],
    note:
      'The fur trade relied on food supply and labour from Indigenous and Metis communities, not only on beaver pelts.',
  },
  {
    id: 'pacific-brigade',
    name: 'Pacific brigade and Fraser route',
    networkId: 'pacific',
    color: '#b454c7',
    activeEraIds: ['1821-1870'],
    locationIds: ['fort-edmonton', 'rocky-mountain-house', 'fort-kamloops', 'fort-langley'],
    goods: ['Furs outward', 'salmon', 'cranberries', 'coastal trade goods'],
    note:
      'After the international boundary shifted HBC strategy, Fort Langley became a key Pacific outlet north of the border.',
  },
]

export const furTradeSources: FurTradeSource[] = [
  canadaBoundarySource,
  {
    label: 'Parks Canada: York Factory National Historic Site',
    url: 'https://parks.canada.ca/lhn-nhs/mb/yorkfactory',
  },
  {
    label: 'Parks Canada: Fort Langley history',
    url: 'https://parks.canada.ca/lhn-nhs/bc/langley/culture/histoire-history',
  },
  {
    label: 'Indigenous Peoples Atlas of Canada: Fur Trade',
    url: 'https://indigenouspeoplesatlasofcanada.ca/article/fur-trade/',
  },
  {
    label: 'Library and Archives Canada: Fur trade records',
    url: 'https://www.canada.ca/en/library-archives/collection/research-help/genealogy-family-history/employment/fur-trade.html',
  },
]

export const furTradeProjection = {
  name: 'Lambert conformal conic',
  centralMeridian: -95,
  latitudeOfOrigin: 49,
  standardParallelOne: 49,
  standardParallelTwo: 77,
  sceneWidth: 9.6,
  sceneHeight: 6.1,
}

export const furTradeCanadaOutlines: FurTradeCoordinate[][] = [
  ...canadaBoundaryRings.map((ring) => ring.map(([longitude, latitude]) => ({ latitude, longitude }))),
]

export const furTradeWaterBodies: FurTradeCoordinate[][] = [
  [
    { latitude: 60.4, longitude: -94.8 },
    { latitude: 60.7, longitude: -86.4 },
    { latitude: 58.2, longitude: -79.5 },
    { latitude: 54.2, longitude: -79.2 },
    { latitude: 51.4, longitude: -83.3 },
    { latitude: 52.3, longitude: -90.8 },
    { latitude: 55.7, longitude: -95.3 },
    { latitude: 60.4, longitude: -94.8 },
  ],
  [
    { latitude: 49.4, longitude: -91.8 },
    { latitude: 48.7, longitude: -87.4 },
    { latitude: 47.9, longitude: -84.6 },
    { latitude: 46.8, longitude: -86.8 },
    { latitude: 47.8, longitude: -91.6 },
    { latitude: 49.4, longitude: -91.8 },
  ],
]

const DEG_TO_RAD = Math.PI / 180

function lambertRaw({ latitude, longitude }: FurTradeCoordinate) {
  const phi = latitude * DEG_TO_RAD
  const lambda = longitude * DEG_TO_RAD
  const phi1 = furTradeProjection.standardParallelOne * DEG_TO_RAD
  const phi2 = furTradeProjection.standardParallelTwo * DEG_TO_RAD
  const phi0 = furTradeProjection.latitudeOfOrigin * DEG_TO_RAD
  const lambda0 = furTradeProjection.centralMeridian * DEG_TO_RAD
  const n =
    Math.log(Math.cos(phi1) / Math.cos(phi2)) /
    Math.log(Math.tan(Math.PI / 4 + phi2 / 2) / Math.tan(Math.PI / 4 + phi1 / 2))
  const f = (Math.cos(phi1) * Math.tan(Math.PI / 4 + phi1 / 2) ** n) / n
  const rho = f / Math.tan(Math.PI / 4 + phi / 2) ** n
  const rho0 = f / Math.tan(Math.PI / 4 + phi0 / 2) ** n
  const theta = n * (lambda - lambda0)

  return {
    x: rho * Math.sin(theta),
    y: rho0 - rho * Math.cos(theta),
  }
}

const furTradeProjectionBounds = (() => {
  const projected = [...furTradeCanadaOutlines.flat(), ...furTradeWaterBodies.flat(), ...furTradeLocations].map(lambertRaw)
  const minX = Math.min(...projected.map((point) => point.x))
  const maxX = Math.max(...projected.map((point) => point.x))
  const minY = Math.min(...projected.map((point) => point.y))
  const maxY = Math.max(...projected.map((point) => point.y))
  const paddingX = (maxX - minX) * 0.06
  const paddingY = (maxY - minY) * 0.08

  return {
    minX: minX - paddingX,
    maxX: maxX + paddingX,
    minY: minY - paddingY,
    maxY: maxY + paddingY,
  }
})()

export function projectFurTradeCoordinate(coordinate: FurTradeCoordinate): FurTradeProjectedPoint {
  const projected = lambertRaw(coordinate)
  const normalizedX = (projected.x - furTradeProjectionBounds.minX) / (furTradeProjectionBounds.maxX - furTradeProjectionBounds.minX)
  const normalizedY = (projected.y - furTradeProjectionBounds.minY) / (furTradeProjectionBounds.maxY - furTradeProjectionBounds.minY)
  const clampedX = Math.max(0, Math.min(1, normalizedX))
  const clampedY = Math.max(0, Math.min(1, normalizedY))

  return {
    x: Math.round(clampedX * 1000),
    y: Math.round((1 - clampedY) * 560),
    percentX: clampedX * 100,
    percentY: (1 - clampedY) * 100,
    sceneX: (clampedX - 0.5) * furTradeProjection.sceneWidth,
    sceneY: (clampedY - 0.5) * furTradeProjection.sceneHeight,
  }
}

export function getFurTradeLocationMapPoint(location: FurTradeLocation): FurTradeProjectedPoint {
  return projectFurTradeCoordinate(location)
}

export function getFurTradeEraById(id: string): FurTradeEra {
  return furTradeEras.find((era) => era.id === id) ?? furTradeEras[1]
}

export function getFurTradeLocationById(id: string): FurTradeLocation {
  return furTradeLocations.find((location) => location.id === id) ?? furTradeLocations.find((location) => location.id === 'york-factory') ?? furTradeLocations[0]
}

export function getFurTradeRoutesForLocation(locationId: FurTradeLocationId): FurTradeRoute[] {
  return furTradeRoutes.filter((route) => route.locationIds.includes(locationId))
}

export function getFurTradeLocationsForRoute(route: FurTradeRoute): FurTradeLocation[] {
  return route.locationIds.map((locationId) => getFurTradeLocationById(locationId))
}
