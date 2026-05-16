export type BodySystemId = 'circulatory' | 'respiratory' | 'nervous' | 'skeletal' | 'digestive'

export type BodyViewMode = 'inspect' | 'compare'

export type BodyPipelineStep = {
  id: string
  label: string
  status: 'ready' | 'queued' | 'blocked'
  detail: string
}

export type BodyModelAsset = {
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

export type BodyFocusTopic = {
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

export type BodySystem = {
  id: BodySystemId
  name: string
  type: string
  accent: string
  accentSoft: string
  color: string
  defaultTopic: string
  comparison: BodySystemId
  modelAsset?: BodyModelAsset
  imagePrompt: string
  overview: {
    title: string
    body: string
    motif: string
  }
  pipeline: BodyPipelineStep[]
  topics: BodyFocusTopic[]
}

function pipelineSteps(assetStem: string): BodyPipelineStep[] {
  return [
    {
      id: 'image',
      label: 'gpt-image-2 reference',
      status: 'queued',
      detail: `Generate ${assetStem}.png as a 3D-style biology reference on a solid color background.`,
    },
    {
      id: 'tripo',
      label: 'Tripo3D candidate',
      status: 'blocked',
      detail: `Create public/human-body/models/${assetStem}-tripo.glb after Tripo3D credentials are available.`,
    },
    {
      id: 'hunyuan',
      label: 'Hunyuan3D candidate',
      status: 'blocked',
      detail: `Create public/human-body/models/${assetStem}-hunyuan.glb after Hunyuan3D credentials are available.`,
    },
    {
      id: 'codex',
      label: 'Codex Three.js loader',
      status: 'ready',
      detail: 'This studio already loads a procedural fallback and can swap to modelAsset GLB metadata.',
    },
  ]
}

export const bodySystems: BodySystem[] = [
  {
    id: 'circulatory',
    name: 'Heart and Circulation',
    type: 'Transport System',
    accent: '#c63f55',
    accentSoft: '#fde8ed',
    color: '#d94f65',
    defaultTopic: 'heart',
    comparison: 'respiratory',
    imagePrompt:
      'Create a high-resolution 3D-style educational render of the human heart with major blood vessels, clean anatomical forms, no labels, no text, centered subject, solid deep teal background, studio lighting, suitable for image-to-3D model generation.',
    overview: {
      title: 'Moving oxygen, nutrients, and waste',
      body: 'The circulatory system moves blood through the heart, arteries, capillaries, and veins so cells can exchange materials.',
      motif: 'pulse loop',
    },
    pipeline: pipelineSteps('heart-circulation'),
    topics: [
      {
        id: 'heart',
        name: 'Heart',
        subtitle: 'The pressure pump',
        color: '#d94f65',
        attributes: [
          { label: 'Chambers', value: '4' },
          { label: 'Main role', value: 'Pump blood' },
          { label: 'Cycle', value: 'Heartbeat' },
        ],
        note: 'The heart uses coordinated muscle contractions to push blood through two connected loops: one to the lungs and one to the body.',
        fact: 'The heart beats about 100,000 times in a typical day.',
      },
      {
        id: 'vessels',
        name: 'Blood Vessels',
        subtitle: 'The transport network',
        color: '#2f80c9',
        attributes: [
          { label: 'Arteries', value: 'Away from heart' },
          { label: 'Veins', value: 'Toward heart' },
          { label: 'Capillaries', value: 'Exchange sites' },
        ],
        note: 'Blood vessels form a branching network that moves blood quickly, then slows flow through capillaries for exchange.',
        fact: 'Capillary walls are thin enough for many substances to diffuse across.',
      },
    ],
  },
  {
    id: 'respiratory',
    name: 'Lungs and Breathing',
    type: 'Gas Exchange System',
    accent: '#2f9fd6',
    accentSoft: '#ddf3fb',
    color: '#7cc7e7',
    defaultTopic: 'alveoli',
    comparison: 'circulatory',
    imagePrompt:
      'Create a high-resolution 3D-style educational render of human lungs, trachea, branching bronchi, and alveoli clusters, no labels, no text, centered subject, solid deep teal background, studio lighting, suitable for image-to-3D model generation.',
    overview: {
      title: 'Bringing air to blood',
      body: 'The respiratory system moves air into the lungs and creates large exchange surfaces where oxygen enters blood and carbon dioxide leaves.',
      motif: 'branching airway',
    },
    pipeline: pipelineSteps('lungs-breathing'),
    topics: [
      {
        id: 'alveoli',
        name: 'Alveoli',
        subtitle: 'The exchange surface',
        color: '#7cc7e7',
        attributes: [
          { label: 'Shape', value: 'Tiny sacs' },
          { label: 'Role', value: 'Gas exchange' },
          { label: 'Partner', value: 'Capillaries' },
        ],
        note: 'Alveoli increase lung surface area so oxygen and carbon dioxide can diffuse between air and blood.',
        fact: 'Healthy lungs contain hundreds of millions of alveoli.',
      },
      {
        id: 'diaphragm',
        name: 'Diaphragm',
        subtitle: 'The breathing muscle',
        color: '#5f8dd8',
        attributes: [
          { label: 'Action', value: 'Contracts downward' },
          { label: 'Effect', value: 'Air moves in' },
          { label: 'Type', value: 'Skeletal muscle' },
        ],
        note: 'The diaphragm changes chest volume. That pressure change moves air in and out of the lungs.',
        fact: 'Breathing is controlled automatically but can also be adjusted consciously.',
      },
    ],
  },
  {
    id: 'nervous',
    name: 'Brain and Nerves',
    type: 'Control System',
    accent: '#7d5bd6',
    accentSoft: '#eee8fb',
    color: '#9b83df',
    defaultTopic: 'brain',
    comparison: 'skeletal',
    imagePrompt:
      'Create a high-resolution 3D-style educational render of a human brain with spinal cord and branching nerves, no labels, no text, centered subject, solid deep teal background, studio lighting, suitable for image-to-3D model generation.',
    overview: {
      title: 'Sensing, signaling, and coordinating',
      body: 'The nervous system collects information, processes it, and sends electrical and chemical signals that coordinate body responses.',
      motif: 'signal network',
    },
    pipeline: pipelineSteps('brain-nerves'),
    topics: [
      {
        id: 'brain',
        name: 'Brain',
        subtitle: 'The processing center',
        color: '#9b83df',
        attributes: [
          { label: 'Role', value: 'Process signals' },
          { label: 'Protection', value: 'Skull' },
          { label: 'Partner', value: 'Spinal cord' },
        ],
        note: 'The brain integrates sensory input, memory, movement planning, emotion, and automatic body regulation.',
        fact: 'Different brain regions specialize, but most tasks involve many regions working together.',
      },
      {
        id: 'nerves',
        name: 'Nerves',
        subtitle: 'The signal cables',
        color: '#f1bf4e',
        attributes: [
          { label: 'Signal type', value: 'Electrical impulses' },
          { label: 'Direction', value: 'To and from CNS' },
          { label: 'Speed', value: 'Varies by neuron' },
        ],
        note: 'Nerves carry sensory information toward the central nervous system and motor commands back to muscles and glands.',
        fact: 'Some reflexes route through the spinal cord before the brain is fully aware.',
      },
    ],
  },
  {
    id: 'skeletal',
    name: 'Skeleton and Support',
    type: 'Support System',
    accent: '#8e8d86',
    accentSoft: '#efeee9',
    color: '#d7d0c3',
    defaultTopic: 'bones',
    comparison: 'nervous',
    imagePrompt:
      'Create a high-resolution 3D-style educational render of a simplified human skeleton with skull, ribs, spine, pelvis, and limb bones, no labels, no text, centered subject, solid deep teal background, studio lighting, suitable for image-to-3D model generation.',
    overview: {
      title: 'Protection, leverage, and mineral storage',
      body: 'The skeletal system supports body shape, protects organs, stores minerals, and works with muscles to create movement.',
      motif: 'bone frame',
    },
    pipeline: pipelineSteps('skeleton-support'),
    topics: [
      {
        id: 'bones',
        name: 'Bones',
        subtitle: 'The living frame',
        color: '#d7d0c3',
        attributes: [
          { label: 'Role', value: 'Support and protect' },
          { label: 'Material', value: 'Living tissue' },
          { label: 'Stores', value: 'Calcium minerals' },
        ],
        note: 'Bones are living structures that remodel over time and respond to stress, nutrition, hormones, and activity.',
        fact: 'Bone marrow inside some bones makes blood cells.',
      },
      {
        id: 'joints',
        name: 'Joints',
        subtitle: 'The movement points',
        color: '#a9a39a',
        attributes: [
          { label: 'Role', value: 'Allow movement' },
          { label: 'Examples', value: 'Hinge, ball-and-socket' },
          { label: 'Support', value: 'Ligaments' },
        ],
        note: 'Joints connect bones and constrain movement so the body can move with both flexibility and control.',
        fact: 'Different joints trade mobility for stability.',
      },
    ],
  },
  {
    id: 'digestive',
    name: 'Digestion and Absorption',
    type: 'Nutrient Processing System',
    accent: '#d88a3d',
    accentSoft: '#faecd9',
    color: '#e7a65c',
    defaultTopic: 'intestine',
    comparison: 'circulatory',
    imagePrompt:
      'Create a high-resolution 3D-style educational render of the human digestive tract with stomach, small intestine, large intestine, liver, and pancreas, no labels, no text, centered subject, solid deep teal background, studio lighting, suitable for image-to-3D model generation.',
    overview: {
      title: 'Breaking food into usable molecules',
      body: 'The digestive system breaks food down, absorbs nutrients and water, and prepares waste for removal.',
      motif: 'nutrient path',
    },
    pipeline: pipelineSteps('digestion-absorption'),
    topics: [
      {
        id: 'intestine',
        name: 'Small Intestine',
        subtitle: 'The absorption surface',
        color: '#e7a65c',
        attributes: [
          { label: 'Role', value: 'Absorb nutrients' },
          { label: 'Surface', value: 'Folded lining' },
          { label: 'Partner', value: 'Blood vessels' },
        ],
        note: 'The small intestine has folds and villi that increase surface area for nutrient absorption.',
        fact: 'Most chemical digestion and nutrient absorption happen in the small intestine.',
      },
      {
        id: 'stomach',
        name: 'Stomach',
        subtitle: 'The mixing chamber',
        color: '#d46f4e',
        attributes: [
          { label: 'Action', value: 'Churns food' },
          { label: 'Chemical', value: 'Acid and enzymes' },
          { label: 'Output', value: 'Chyme' },
        ],
        note: 'The stomach stores, mixes, and starts protein digestion before food moves into the small intestine.',
        fact: 'The stomach lining protects itself from its own acidic contents.',
      },
    ],
  },
]

export function getBodySystemById(id: string): BodySystem {
  return bodySystems.find((system) => system.id === id) ?? bodySystems[0]
}
