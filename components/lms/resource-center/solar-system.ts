export type SolarBodyId =
  | 'sun'
  | 'mercury'
  | 'venus'
  | 'earth'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'

export type SolarViewMode = 'orbit' | 'focus'

export type SolarTopic = {
  id: string
  name: string
  subtitle: string
  color: string
  attributes: Array<{
    label: string
    value: string
  }>
  note: string
  fact: string
}

export type SolarModelAsset = {
  url: string
  previewUrl: string
  sourceLabel: string
  sourceUrl: string
  scale: number
  rotation?: [number, number, number]
  position?: [number, number, number]
  exposure?: number
  materialMode?: 'studio' | 'native'
}

export type SolarTextureAtlasTile = {
  url: string
  column: 0 | 1 | 2
  row: 0 | 1 | 2
}

export type SolarBody = {
  id: SolarBodyId
  name: string
  type: string
  order: number
  accent: string
  accentSoft: string
  color: string
  radiusScale: number
  orbitRadius: number
  orbitPeriod: string
  dayLength: string
  moons: string
  distanceFromSun: string
  temperature: string
  gravity: string
  defaultTopic: string
  comparison: SolarBodyId
  textureAtlas: SolarTextureAtlasTile
  modelAsset?: SolarModelAsset
  overview: {
    title: string
    body: string
    motif: string
  }
  topics: SolarTopic[]
}

const textureAtlasUrl = '/solar-system/textures/planet-texture-atlas-v001.png'

export const solarBodies: SolarBody[] = [
  {
    id: 'sun',
    name: 'Sun',
    type: 'G-type Main-Sequence Star',
    order: 0,
    accent: '#f6b23a',
    accentSoft: '#fff1c7',
    color: '#ffca58',
    radiusScale: 2.45,
    orbitRadius: 0,
    orbitPeriod: 'Center of the system',
    dayLength: 'About 27 Earth days at the equator',
    moons: '0',
    distanceFromSun: '0 AU',
    temperature: 'About 5,500 C at the surface',
    gravity: '27.9 x Earth',
    defaultTopic: 'fusion',
    comparison: 'earth',
    textureAtlas: { url: textureAtlasUrl, column: 0, row: 0 },
    overview: {
      title: 'The system anchor',
      body: 'The Sun holds the solar system together with gravity and powers planetary climates with light.',
      motif: 'stellar core',
    },
    topics: [
      {
        id: 'fusion',
        name: 'Fusion Core',
        subtitle: 'Where sunlight begins',
        color: '#ffd95d',
        attributes: [
          { label: 'Fuel', value: 'Hydrogen' },
          { label: 'Output', value: 'Light and heat' },
          { label: 'Location', value: 'Central core' },
        ],
        note:
          'The Sun converts hydrogen into helium in its core. That fusion releases energy that travels outward and eventually reaches Earth as sunlight.',
        fact: 'Sunlight takes about 8 minutes to reach Earth.',
      },
      {
        id: 'photosphere',
        name: 'Photosphere',
        subtitle: 'The visible surface',
        color: '#ffb347',
        attributes: [
          { label: 'Layer', value: 'Visible light source' },
          { label: 'Pattern', value: 'Granulation' },
          { label: 'Activity', value: 'Sunspots' },
        ],
        note:
          'The photosphere is the layer we see from Earth. Darker sunspots mark cooler magnetic regions on this visible surface.',
        fact: 'Sunspots can be larger than Earth.',
      },
    ],
  },
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'Rocky Planet',
    order: 1,
    accent: '#8d8f93',
    accentSoft: '#ecebea',
    color: '#a7a39a',
    radiusScale: 0.42,
    orbitRadius: 1.45,
    orbitPeriod: '88 Earth days',
    dayLength: '59 Earth days',
    moons: '0',
    distanceFromSun: '0.39 AU',
    temperature: '-180 C to 430 C',
    gravity: '0.38 x Earth',
    defaultTopic: 'craters',
    comparison: 'mars',
    textureAtlas: { url: textureAtlasUrl, column: 1, row: 0 },
    overview: {
      title: 'Small, fast, cratered',
      body: 'Mercury races around the Sun and preserves impact scars because it has almost no atmosphere.',
      motif: 'impact basin',
    },
    topics: [
      {
        id: 'craters',
        name: 'Impact Craters',
        subtitle: 'A preserved record',
        color: '#b8b1a5',
        attributes: [
          { label: 'Cause', value: 'Asteroid impacts' },
          { label: 'Atmosphere', value: 'Extremely thin' },
          { label: 'Surface age', value: 'Ancient' },
        ],
        note:
          'Mercury has very little atmosphere to burn up incoming debris or weather away craters, so impacts remain visible for long periods.',
        fact: "The Caloris Basin is one of Mercury's largest impact features.",
      },
      {
        id: 'orbit',
        name: 'Fast Orbit',
        subtitle: 'Closest path to the Sun',
        color: '#d2b16f',
        attributes: [
          { label: 'Year', value: '88 Earth days' },
          { label: 'Orbit shape', value: 'Eccentric' },
          { label: 'Position', value: 'Innermost planet' },
        ],
        note:
          'Mercury completes a year faster than any other planet because it travels close to the Sun where orbital speeds are high.',
        fact: 'A Mercury year is shorter than a Mercury day-night cycle.',
      },
    ],
  },
  {
    id: 'venus',
    name: 'Venus',
    type: 'Rocky Planet',
    order: 2,
    accent: '#c98f42',
    accentSoft: '#f7ead8',
    color: '#d8a65e',
    radiusScale: 0.78,
    orbitRadius: 2.05,
    orbitPeriod: '225 Earth days',
    dayLength: '243 Earth days',
    moons: '0',
    distanceFromSun: '0.72 AU',
    temperature: 'About 465 C',
    gravity: '0.90 x Earth',
    defaultTopic: 'greenhouse',
    comparison: 'earth',
    textureAtlas: { url: textureAtlasUrl, column: 2, row: 0 },
    overview: {
      title: 'Clouded and superheated',
      body: 'Venus is Earth-sized, but its dense carbon dioxide atmosphere traps heat intensely.',
      motif: 'sulfur cloud deck',
    },
    topics: [
      {
        id: 'greenhouse',
        name: 'Greenhouse Atmosphere',
        subtitle: 'Heat trapped by thick air',
        color: '#e3b45f',
        attributes: [
          { label: 'Main gas', value: 'Carbon dioxide' },
          { label: 'Pressure', value: 'About 92 x Earth' },
          { label: 'Clouds', value: 'Sulfuric acid' },
        ],
        note:
          'Venus shows how atmospheric composition can dominate climate. Its thick air traps infrared radiation and makes the surface hotter than Mercury.',
        fact: 'Venus rotates backward compared with most planets.',
      },
      {
        id: 'volcanism',
        name: 'Volcanic Plains',
        subtitle: 'A resurfaced world',
        color: '#b96f38',
        attributes: [
          { label: 'Terrain', value: 'Lava plains' },
          { label: 'Craters', value: 'Fewer than expected' },
          { label: 'Activity', value: 'Likely ongoing' },
        ],
        note:
          "Large volcanic plains suggest that lava flows have renewed much of Venus's surface during its history.",
        fact: 'Venus has more volcano-like structures than any other planet.',
      },
    ],
  },
  {
    id: 'earth',
    name: 'Earth',
    type: 'Rocky Planet',
    order: 3,
    accent: '#2d8bc8',
    accentSoft: '#dceefa',
    color: '#4fa2d5',
    radiusScale: 0.82,
    orbitRadius: 2.7,
    orbitPeriod: '365.25 days',
    dayLength: '24 hours',
    moons: '1',
    distanceFromSun: '1 AU',
    temperature: 'Average about 15 C',
    gravity: '1 x Earth',
    defaultTopic: 'biosphere',
    comparison: 'venus',
    textureAtlas: { url: textureAtlasUrl, column: 0, row: 1 },
    overview: {
      title: 'Water world with life',
      body: 'Earth combines liquid water, a protective atmosphere, plate tectonics, and a stable orbit.',
      motif: 'ocean atmosphere',
    },
    topics: [
      {
        id: 'biosphere',
        name: 'Biosphere',
        subtitle: 'The living layer',
        color: '#4fb66d',
        attributes: [
          { label: 'Water', value: 'Liquid surface oceans' },
          { label: 'Atmosphere', value: 'Nitrogen and oxygen' },
          { label: 'Life', value: 'Confirmed' },
        ],
        note:
          "Earth's biosphere interacts with the atmosphere, oceans, land, and energy from the Sun to sustain complex ecosystems.",
        fact: "Most of Earth's surface is covered by ocean.",
      },
      {
        id: 'magnetosphere',
        name: 'Magnetosphere',
        subtitle: 'A protective field',
        color: '#6fb6ff',
        attributes: [
          { label: 'Source', value: 'Liquid outer core' },
          { label: 'Role', value: 'Deflects solar wind' },
          { label: 'Visible effect', value: 'Auroras' },
        ],
        note:
          "Earth's magnetic field helps shield the atmosphere from charged particles streaming from the Sun.",
        fact: 'Auroras trace charged particles guided by magnetic field lines.',
      },
    ],
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'Rocky Planet',
    order: 4,
    accent: '#b44b32',
    accentSoft: '#f3dfd7',
    color: '#c86145',
    radiusScale: 0.58,
    orbitRadius: 3.35,
    orbitPeriod: '687 Earth days',
    dayLength: '24.6 hours',
    moons: '2',
    distanceFromSun: '1.52 AU',
    temperature: 'Average about -60 C',
    gravity: '0.38 x Earth',
    defaultTopic: 'water',
    comparison: 'earth',
    textureAtlas: { url: textureAtlasUrl, column: 1, row: 1 },
    overview: {
      title: 'Cold desert with water clues',
      body: 'Mars has polar ice, giant volcanoes, dust storms, and landforms shaped by ancient water.',
      motif: 'red dust and ice',
    },
    topics: [
      {
        id: 'water',
        name: 'Ancient Water',
        subtitle: 'Valleys and minerals',
        color: '#7cb7d8',
        attributes: [
          { label: 'Evidence', value: 'River valleys' },
          { label: 'Current water', value: 'Ice and vapor' },
          { label: 'Climate', value: 'Thin, cold air' },
        ],
        note:
          'Mars has channels, deltas, and minerals that point to wetter conditions in the past, even though liquid surface water is unstable today.',
        fact: 'Mars has water ice at both poles.',
      },
      {
        id: 'volcanoes',
        name: 'Giant Volcanoes',
        subtitle: 'Olympus Mons scale',
        color: '#a63f2d',
        attributes: [
          { label: 'Largest feature', value: 'Olympus Mons' },
          { label: 'Type', value: 'Shield volcano' },
          { label: 'Tectonics', value: 'No active plates' },
        ],
        note:
          'Without Earth-like plate tectonics moving the crust over hot spots, Martian volcanoes could grow enormous.',
        fact: 'Olympus Mons is far taller than Mount Everest.',
      },
    ],
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'Gas Giant',
    order: 5,
    accent: '#c27c42',
    accentSoft: '#f7e9d7',
    color: '#d19b67',
    radiusScale: 1.86,
    orbitRadius: 4.25,
    orbitPeriod: '11.9 Earth years',
    dayLength: '9.9 hours',
    moons: '95+',
    distanceFromSun: '5.20 AU',
    temperature: 'Cloud tops about -145 C',
    gravity: '2.53 x Earth',
    defaultTopic: 'storm',
    comparison: 'saturn',
    textureAtlas: { url: textureAtlasUrl, column: 2, row: 1 },
    overview: {
      title: 'Largest planet',
      body: 'Jupiter is a massive gas giant with banded clouds, powerful storms, and many moons.',
      motif: 'storm bands',
    },
    topics: [
      {
        id: 'storm',
        name: 'Great Red Spot',
        subtitle: 'A long-lived storm',
        color: '#b84e35',
        attributes: [
          { label: 'Feature', value: 'Anticyclonic storm' },
          { label: 'Scale', value: 'Planet-sized' },
          { label: 'Layer', value: 'Cloud tops' },
        ],
        note:
          "The Great Red Spot is a persistent storm system in Jupiter's atmosphere, shaped by fast winds and rotating bands.",
        fact: "Jupiter's day is shorter than 10 Earth hours.",
      },
      {
        id: 'moons',
        name: 'Galilean Moons',
        subtitle: 'Four large worlds',
        color: '#d7c59a',
        attributes: [
          { label: 'Names', value: 'Io, Europa, Ganymede, Callisto' },
          { label: 'Discovered', value: '1610' },
          { label: 'Interest', value: 'Oceans and geology' },
        ],
        note:
          "Jupiter's largest moons are worlds of their own, including volcanic Io and icy Europa, where a subsurface ocean may exist.",
        fact: 'Ganymede is larger than Mercury.',
      },
    ],
  },
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'Gas Giant',
    order: 6,
    accent: '#c8a35a',
    accentSoft: '#f7edd6',
    color: '#d8bd79',
    radiusScale: 1.55,
    orbitRadius: 5.2,
    orbitPeriod: '29.5 Earth years',
    dayLength: '10.7 hours',
    moons: '140+',
    distanceFromSun: '9.58 AU',
    temperature: 'Cloud tops about -178 C',
    gravity: '1.07 x Earth',
    defaultTopic: 'rings',
    comparison: 'jupiter',
    textureAtlas: { url: textureAtlasUrl, column: 0, row: 2 },
    overview: {
      title: 'Ringed gas giant',
      body: "Saturn's icy rings make it visually distinct, while its low density and moon system reveal complex formation history.",
      motif: 'ring plane',
    },
    topics: [
      {
        id: 'rings',
        name: 'Ring System',
        subtitle: 'Ice and rock fragments',
        color: '#e9d6a3',
        attributes: [
          { label: 'Material', value: 'Mostly water ice' },
          { label: 'Structure', value: 'Many ringlets' },
          { label: 'Thickness', value: 'Very thin' },
        ],
        note:
          "Saturn's rings are made of countless small particles orbiting in a flat disk, with gaps shaped by gravity and moons.",
        fact: 'The rings are broad but extremely thin compared with their width.',
      },
      {
        id: 'titan',
        name: 'Titan',
        subtitle: 'A moon with weather',
        color: '#d99655',
        attributes: [
          { label: 'Atmosphere', value: 'Thick nitrogen' },
          { label: 'Surface liquid', value: 'Methane and ethane' },
          { label: 'Type', value: 'Large moon' },
        ],
        note:
          'Titan has a thick atmosphere and surface lakes of hydrocarbons, making it one of the most Earth-like places in surface processes.',
        fact: 'Titan is larger than Mercury.',
      },
    ],
  },
  {
    id: 'uranus',
    name: 'Uranus',
    type: 'Ice Giant',
    order: 7,
    accent: '#6bbbc4',
    accentSoft: '#dff3f5',
    color: '#8fd1d7',
    radiusScale: 1.12,
    orbitRadius: 6.05,
    orbitPeriod: '84 Earth years',
    dayLength: '17.2 hours',
    moons: '27',
    distanceFromSun: '19.2 AU',
    temperature: 'Cloud tops about -224 C',
    gravity: '0.89 x Earth',
    defaultTopic: 'tilt',
    comparison: 'neptune',
    textureAtlas: { url: textureAtlasUrl, column: 1, row: 2 },
    overview: {
      title: 'Tilted ice giant',
      body: 'Uranus rotates on its side, giving it extreme seasons and a pale blue-green methane atmosphere.',
      motif: 'sideways axis',
    },
    topics: [
      {
        id: 'tilt',
        name: 'Sideways Tilt',
        subtitle: 'Extreme axial angle',
        color: '#7ed5df',
        attributes: [
          { label: 'Tilt', value: 'About 98 degrees' },
          { label: 'Season length', value: 'Decades' },
          { label: 'Likely cause', value: 'Ancient collision' },
        ],
        note:
          "Uranus's rotation axis lies almost in its orbital plane, so its poles can face the Sun for long stretches of its year.",
        fact: 'A Uranus season can last about 21 Earth years.',
      },
      {
        id: 'methane',
        name: 'Methane Color',
        subtitle: 'Blue-green atmosphere',
        color: '#5faeb8',
        attributes: [
          { label: 'Gas', value: 'Methane' },
          { label: 'Effect', value: 'Absorbs red light' },
          { label: 'Class', value: 'Ice giant' },
        ],
        note:
          "Methane in Uranus's atmosphere absorbs red wavelengths and helps produce the planet's blue-green appearance.",
        fact: 'Uranus also has faint rings.',
      },
    ],
  },
  {
    id: 'neptune',
    name: 'Neptune',
    type: 'Ice Giant',
    order: 8,
    accent: '#355fb6',
    accentSoft: '#dee8fb',
    color: '#496ed0',
    radiusScale: 1.08,
    orbitRadius: 6.85,
    orbitPeriod: '164.8 Earth years',
    dayLength: '16.1 hours',
    moons: '14',
    distanceFromSun: '30.1 AU',
    temperature: 'Cloud tops about -214 C',
    gravity: '1.14 x Earth',
    defaultTopic: 'winds',
    comparison: 'uranus',
    textureAtlas: { url: textureAtlasUrl, column: 2, row: 2 },
    overview: {
      title: 'Windy outer ice giant',
      body: 'Neptune is the farthest official planet, with fast winds, dark storm systems, and a deep blue atmosphere.',
      motif: 'supersonic winds',
    },
    topics: [
      {
        id: 'winds',
        name: 'Fast Winds',
        subtitle: 'Storms in deep blue air',
        color: '#638dff',
        attributes: [
          { label: 'Speeds', value: 'Over 1,500 km/h' },
          { label: 'Storms', value: 'Dark vortices' },
          { label: 'Energy', value: 'Internal heat plus sunlight' },
        ],
        note:
          'Neptune receives little sunlight, but internal heat and atmospheric dynamics still drive some of the fastest winds in the solar system.',
        fact: 'Neptune was predicted mathematically before it was observed.',
      },
      {
        id: 'triton',
        name: 'Triton',
        subtitle: 'A captured moon',
        color: '#b7c7df',
        attributes: [
          { label: 'Orbit', value: 'Retrograde' },
          { label: 'Surface', value: 'Icy' },
          { label: 'Activity', value: 'Geysers' },
        ],
        note:
          "Triton orbits Neptune backward compared with the planet's rotation, suggesting it may have been captured from the outer solar system.",
        fact: 'Triton is one of the coldest known large solar-system bodies.',
      },
    ],
  },
]

export const planetBodies = solarBodies.filter((body) => body.id !== 'sun')

export function getSolarBodyById(id: string): SolarBody {
  return solarBodies.find((body) => body.id === id) ?? solarBodies.find((body) => body.id === 'earth') ?? solarBodies[0]
}
