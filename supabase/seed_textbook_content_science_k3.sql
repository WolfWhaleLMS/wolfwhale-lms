-- ============================================================================
-- WolfWhale Textbook Content Seed: Science Grades K-3
-- Saskatchewan WNCP Science
--
-- Populates: textbook_units, textbook_chapters, textbook_flashcards,
--            chapter_outcome_map
--
-- Each grade is wrapped in its own DO $$ block.
-- Depends on: seed_textbooks.sql, seed_curriculum_outcomes.sql
-- ============================================================================


-- ============================================================================
-- GRADE K — WolfWhale Science K
-- Outcomes: LTK.1, MOK.1, FEK.1, NSK.1
-- ============================================================================
DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_oc     UUID;
BEGIN
  SELECT id INTO v_book FROM textbooks
    WHERE tenant_id = v_tenant AND slug = 'wolfwhale-science-k';

  -- ========================================================================
  -- UNIT 1: Life Science — Living Things (LTK.1)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Living Things Around Us',
    'Examine observable characteristics of plants, animals, and people in the local environment.',
    'Living things have observable features that help us identify and describe them.',
    'What makes something a living thing?')
  RETURNING id INTO v_unit;

  -- Chapter 1 — What Is Alive?
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 1, 'What Is Alive?', 'what-is-alive',
    'Learn to tell the difference between living and non-living things.',
    '[
      {"type": "heading", "content": "What Is Alive?", "level": 1},
      {"type": "text", "content": "Look around you. Some things are alive and some things are not. A dog is alive. A rock is not alive. How can we tell the difference?"},
      {"type": "callout", "content": "Living things grow, need food and water, and can move on their own or respond to their surroundings.", "style": "info"},
      {"type": "heading", "content": "Signs of Life", "level": 2},
      {"type": "text", "content": "Living things share special features:\n- They grow and change over time\n- They need food, water, and air\n- They can make more of their own kind (reproduce)\n- They respond to the world around them"},
      {"type": "heading", "content": "Living or Non-Living?", "level": 2},
      {"type": "text", "content": "A plant is alive. It grows toward the sunlight. It needs water from the soil.\n\nA toy car is not alive. It does not grow. It does not need food or water. Someone has to push it to make it move."},
      {"type": "callout", "content": "Some things were once living but are no longer alive, like a fallen leaf or a piece of wood.", "style": "tip"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Which of these is a living thing?", "options": ["A chair", "A butterfly", "A pencil", "A rock"], "correct": 1, "explanation": "A butterfly is alive. It grows, eats, and moves on its own."},
      {"type": "quiz", "question": "What do all living things need?", "options": ["Batteries", "Food and water", "Wheels", "Paint"], "correct": 1, "explanation": "All living things need food and water to survive."}
    ]'::jsonb,
    '[{"term": "Living", "definition": "Something that grows, needs food and water, and responds to its surroundings"},
      {"term": "Non-living", "definition": "Something that does not grow, eat, or breathe on its own"},
      {"term": "Grow", "definition": "To get bigger or change over time"},
      {"term": "Respond", "definition": "To react to something in the environment"}]'::jsonb,
    'Indigenous Elders teach that all parts of nature are connected. In many First Nations worldviews, even rocks and water are considered to have spirit and purpose, reminding us to treat all of nature with respect.',
    12, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'LTK.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What makes something alive?', 'It grows, needs food and water, and responds to its surroundings.', 'Think about what a plant or animal does.', 1, 0),
    (v_tenant, v_ch, 'Is a rock alive?', 'No. A rock does not grow, eat, or breathe.', 'Does it need food or water?', 1, 1),
    (v_tenant, v_ch, 'Name three things all living things need.', 'Food, water, and air.', 'Think about what you need every day.', 1, 2),
    (v_tenant, v_ch, 'Is a fallen leaf living or non-living?', 'It was once living but is no longer alive.', 'It came from a living tree.', 1, 3);


  -- Chapter 2 — Plants in Our World
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 2, 'Plants in Our World', 'plants-in-our-world',
    'Observe and describe characteristics of plants in the local environment.',
    '[
      {"type": "heading", "content": "Plants in Our World", "level": 1},
      {"type": "text", "content": "Plants are living things. They grow in gardens, forests, fields, and even in cracks in the sidewalk! Plants come in many shapes and sizes."},
      {"type": "heading", "content": "Parts of a Plant", "level": 2},
      {"type": "text", "content": "Most plants have these parts:\n- Roots: hold the plant in the ground and soak up water\n- Stem: holds the plant up and carries water to the leaves\n- Leaves: catch sunlight to make food for the plant\n- Flowers: help the plant make seeds for new plants"},
      {"type": "callout", "content": "Plants make their own food using sunlight, water, and air. This is different from animals, which must find food to eat.", "style": "info"},
      {"type": "heading", "content": "Observing Plants", "level": 2},
      {"type": "text", "content": "When we observe plants, we can look at:\n- The colour of the leaves and flowers\n- The shape of the leaves (round, pointy, long)\n- How tall or short the plant is\n- Whether it has a thick or thin stem"},
      {"type": "divider"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Which part of a plant soaks up water from the ground?", "options": ["Leaves", "Flowers", "Roots", "Stem"], "correct": 2, "explanation": "Roots grow underground and soak up water for the plant."},
      {"type": "quiz", "question": "How do plants get their food?", "options": ["They eat insects", "They make it using sunlight", "Someone feeds them", "They find it underground"], "correct": 1, "explanation": "Plants make their own food using sunlight, water, and air."}
    ]'::jsonb,
    '[{"term": "Roots", "definition": "The part of a plant that grows underground and soaks up water"},
      {"term": "Stem", "definition": "The part that holds a plant upright and carries water to the leaves"},
      {"term": "Leaves", "definition": "The flat green parts of a plant that catch sunlight to make food"},
      {"term": "Observe", "definition": "To look carefully at something and notice details"}]'::jsonb,
    'First Nations peoples have deep knowledge of local plants. Sweetgrass, sage, cedar, and tobacco are sacred medicines used in ceremony. Elders teach that we should only take what we need from the land and always give thanks.',
    12, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'LTK.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What do roots do?', 'They hold the plant in the ground and soak up water.', 'They grow underground.', 1, 0),
    (v_tenant, v_ch, 'What do leaves do for a plant?', 'They catch sunlight to make food.', 'Think about why leaves face the sun.', 1, 1),
    (v_tenant, v_ch, 'Name the four sacred medicines in First Nations culture.', 'Sweetgrass, sage, cedar, and tobacco.', 'They are used in ceremony.', 1, 2);


  -- Chapter 3 — Animals Around Us
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 3, 'Animals Around Us', 'animals-around-us',
    'Observe and describe characteristics of animals in the local environment.',
    '[
      {"type": "heading", "content": "Animals Around Us", "level": 1},
      {"type": "text", "content": "Animals are living things too. In Saskatchewan, we can see many kinds of animals: birds in the sky, squirrels in the trees, fish in the lakes, and insects in the grass."},
      {"type": "heading", "content": "How Animals Are Different", "level": 2},
      {"type": "text", "content": "Animals come in many shapes and sizes. Some have fur, some have feathers, and some have scales. We can sort animals by what we observe:\n- How they move (walk, fly, swim, crawl)\n- What covers their body (fur, feathers, scales, skin)\n- How many legs they have\n- Where they live (land, water, or both)"},
      {"type": "callout", "content": "Observing means looking carefully. Use your eyes, ears, and even your nose to learn about animals!", "style": "tip"},
      {"type": "heading", "content": "Animals and Their Homes", "level": 2},
      {"type": "text", "content": "Animals live in places that give them what they need. A bird builds a nest in a tree. A fish lives in water. A gopher digs a burrow underground. The place where an animal lives is called its habitat."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Which animal has feathers?", "options": ["A fish", "A robin", "A dog", "A frog"], "correct": 1, "explanation": "Birds like robins have feathers. Fish have scales, dogs have fur, and frogs have smooth skin."},
      {"type": "quiz", "question": "What is a habitat?", "options": ["An animal toy", "The place where an animal lives", "A kind of food", "An animal sound"], "correct": 1, "explanation": "A habitat is the place where an animal lives that gives it food, water, and shelter."}
    ]'::jsonb,
    '[{"term": "Habitat", "definition": "The place where an animal lives that gives it what it needs"},
      {"term": "Feathers", "definition": "The light covering on a bird''s body that helps it fly and stay warm"},
      {"term": "Scales", "definition": "Small, flat pieces that cover the skin of fish and reptiles"},
      {"term": "Burrow", "definition": "A hole or tunnel dug by an animal for a home"}]'::jsonb,
    'First Nations peoples have always observed animals closely. Traditional knowledge about animal behaviour helps predict weather changes and understand the health of the land. The relationship between people and animals is one of respect and balance.',
    12, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'LTK.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a habitat?', 'The place where an animal lives that gives it what it needs.', 'Think about where a bird or fish lives.', 1, 0),
    (v_tenant, v_ch, 'Name two body coverings animals can have.', 'Fur and feathers (also scales or skin).', 'Think about a dog and a bird.', 1, 1),
    (v_tenant, v_ch, 'What is a burrow?', 'A hole or tunnel dug by an animal for a home.', 'Gophers make these underground.', 1, 2);


  -- ========================================================================
  -- UNIT 2: Physical Science — Materials and Objects (MOK.1)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Exploring Materials',
    'Investigate observable characteristics of familiar objects and materials in the environment.',
    'Objects and materials have properties we can observe and describe.',
    'How can we describe the things around us?')
  RETURNING id INTO v_unit;

  -- Chapter 4 — Describing Materials
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 4, 'Describing Materials', 'describing-materials',
    'Observe and describe properties of different materials.',
    '[
      {"type": "heading", "content": "Describing Materials", "level": 1},
      {"type": "text", "content": "Everything around us is made of materials. Your shirt is made of fabric. A window is made of glass. A spoon might be made of metal or wood. Each material feels and looks different."},
      {"type": "heading", "content": "Properties of Materials", "level": 2},
      {"type": "text", "content": "We can describe materials by their properties:\n- Colour: What colour is it?\n- Texture: Is it smooth, rough, bumpy, or soft?\n- Hardness: Is it hard like a rock or soft like a pillow?\n- Flexibility: Can it bend, or does it stay stiff?\n- Weight: Is it heavy or light?"},
      {"type": "callout", "content": "A property is something you can observe about a material using your senses.", "style": "info"},
      {"type": "heading", "content": "Sorting by Properties", "level": 2},
      {"type": "text", "content": "We can sort objects into groups based on their properties. All the smooth things in one group. All the rough things in another. This helps us organize and understand the world."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Which word describes how something feels?", "options": ["Colour", "Texture", "Size", "Shape"], "correct": 1, "explanation": "Texture describes how something feels, such as smooth, rough, or bumpy."},
      {"type": "quiz", "question": "A feather is:", "options": ["Heavy and hard", "Light and soft", "Heavy and soft", "Light and hard"], "correct": 1, "explanation": "A feather is light (not heavy) and soft (not hard)."}
    ]'::jsonb,
    '[{"term": "Material", "definition": "What an object is made of, like wood, metal, or fabric"},
      {"term": "Property", "definition": "Something you can observe about a material, like colour or texture"},
      {"term": "Texture", "definition": "How something feels when you touch it"},
      {"term": "Flexible", "definition": "Able to bend without breaking"}]'::jsonb,
    'Indigenous peoples in Saskatchewan have long selected materials for specific purposes. Birch bark was chosen for canoes because it is light and waterproof. Animal hides were tanned for clothing because they are warm and flexible.',
    12, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'MOK.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a material?', 'What an object is made of, like wood, metal, or fabric.', 'Think about what your desk is made of.', 1, 0),
    (v_tenant, v_ch, 'What is texture?', 'How something feels when you touch it.', 'Smooth, rough, bumpy, soft.', 1, 1),
    (v_tenant, v_ch, 'What does flexible mean?', 'Able to bend without breaking.', 'Think of a rubber band.', 1, 2);


  -- Chapter 5 — Comparing Objects
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 5, 'Comparing Objects', 'comparing-objects',
    'Compare familiar objects based on observable properties.',
    '[
      {"type": "heading", "content": "Comparing Objects", "level": 1},
      {"type": "text", "content": "When we compare, we look at how things are the same and how they are different. A wooden block and a plastic block are both blocks, but they are made of different materials."},
      {"type": "heading", "content": "Same and Different", "level": 2},
      {"type": "text", "content": "Two objects can be:\n- The same colour but different sizes\n- The same shape but different textures\n- Made of the same material but used for different things\n\nComparing helps us learn more about the objects around us."},
      {"type": "callout", "content": "When you compare, ask: What is the same? What is different?", "style": "tip"},
      {"type": "heading", "content": "Using Our Senses to Compare", "level": 2},
      {"type": "text", "content": "We use our senses to compare objects:\n- Eyes: compare colour, shape, and size\n- Hands: compare texture, weight, and temperature\n- Ears: compare the sounds objects make when tapped or shaken"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "A wooden spoon and a metal spoon are both spoons. How are they different?", "options": ["They are the same size", "They are made of different materials", "They are the same colour", "They weigh the same"], "correct": 1, "explanation": "One is made of wood and one is made of metal. They are made of different materials."},
      {"type": "quiz", "question": "Which sense helps you compare how heavy two things are?", "options": ["Sight", "Hearing", "Touch", "Smell"], "correct": 2, "explanation": "You use your sense of touch (holding things in your hands) to compare weight."}
    ]'::jsonb,
    '[{"term": "Compare", "definition": "To look at how things are the same and how they are different"},
      {"term": "Similar", "definition": "Almost the same but not exactly alike"},
      {"term": "Different", "definition": "Not the same; having unlike features"},
      {"term": "Senses", "definition": "The ways our body takes in information: sight, hearing, touch, smell, taste"}]'::jsonb,
    'Comparing and sorting materials is part of traditional knowledge. Indigenous peoples sorted plants into groups based on their uses: some for food, some for medicine, some for building. This careful observation is a form of science.',
    12, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'MOK.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does it mean to compare?', 'To look at how things are the same and how they are different.', 'Same and different.', 1, 0),
    (v_tenant, v_ch, 'Which sense helps you tell if something is heavy?', 'Touch (holding it in your hands).', 'Pick it up!', 1, 1),
    (v_tenant, v_ch, 'Name three senses you can use to compare objects.', 'Sight, touch, and hearing.', 'Eyes, hands, ears.', 1, 2);


  -- ========================================================================
  -- UNIT 3: Physical Science — Forces and Energy (FEK.1)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Forces and Energy',
    'Examine the effects of physical forces, magnetic forces, light energy, sound energy, and heat energy on objects.',
    'Forces and energy cause things to move and change.',
    'What makes things move and change?')
  RETURNING id INTO v_unit;

  -- Chapter 6 — Pushes and Pulls
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 6, 'Pushes and Pulls', 'pushes-and-pulls',
    'Explore how pushes and pulls make things move.',
    '[
      {"type": "heading", "content": "Pushes and Pulls", "level": 1},
      {"type": "text", "content": "Things move when a force acts on them. A force is a push or a pull. When you push a ball, it rolls away. When you pull a wagon, it comes toward you."},
      {"type": "callout", "content": "A force is a push or a pull that makes something move, stop, or change direction.", "style": "info"},
      {"type": "heading", "content": "Pushes", "level": 2},
      {"type": "text", "content": "A push moves something away from you:\n- Pushing a door open\n- Kicking a soccer ball\n- Pressing a button on a toy"},
      {"type": "heading", "content": "Pulls", "level": 2},
      {"type": "text", "content": "A pull moves something toward you:\n- Pulling open a drawer\n- Dragging a sled\n- Reeling in a fishing line"},
      {"type": "heading", "content": "Bigger and Smaller Forces", "level": 2},
      {"type": "text", "content": "A big push makes a ball go far. A small push makes a ball go a short distance. The harder you push or pull, the more something moves."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Which is an example of a pull?", "options": ["Kicking a ball", "Opening a drawer", "Pressing a button", "Throwing a rock"], "correct": 1, "explanation": "Opening a drawer is a pull because you move it toward you."},
      {"type": "quiz", "question": "What happens when you use a bigger push on a toy car?", "options": ["It stops", "It goes farther", "It shrinks", "Nothing happens"], "correct": 1, "explanation": "A bigger push gives the car more force, so it goes farther."}
    ]'::jsonb,
    '[{"term": "Force", "definition": "A push or a pull that makes something move, stop, or change direction"},
      {"term": "Push", "definition": "A force that moves something away from you"},
      {"term": "Pull", "definition": "A force that moves something toward you"}]'::jsonb,
    'Traditional activities like pulling a travois, paddling a canoe, and throwing a spear all involve understanding forces. Indigenous peoples used their knowledge of pushes and pulls to travel, hunt, and build.',
    12, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'FEK.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a force?', 'A push or a pull that makes something move, stop, or change direction.', 'Think about pushing a door.', 1, 0),
    (v_tenant, v_ch, 'What is the difference between a push and a pull?', 'A push moves something away from you. A pull moves something toward you.', 'Push = away, Pull = toward.', 1, 1),
    (v_tenant, v_ch, 'Does a bigger push make a ball go farther or shorter?', 'Farther.', 'More force = more movement.', 1, 2);


  -- Chapter 7 — Light, Sound, and Heat
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 7, 'Light, Sound, and Heat', 'light-sound-heat',
    'Explore different forms of energy including light, sound, and heat.',
    '[
      {"type": "heading", "content": "Light, Sound, and Heat", "level": 1},
      {"type": "text", "content": "Energy is all around us. We can see light energy, hear sound energy, and feel heat energy. These are all forms of energy that affect the things in our world."},
      {"type": "heading", "content": "Light Energy", "level": 2},
      {"type": "text", "content": "Light helps us see. The sun gives us natural light. Light bulbs and flashlights give us artificial (human-made) light. Without light, everything would be dark."},
      {"type": "heading", "content": "Sound Energy", "level": 2},
      {"type": "text", "content": "Sound is made when something vibrates (shakes very fast). Clap your hands and you hear a sound. Pluck a guitar string and it vibrates to make music. Sounds can be loud or quiet, high or low."},
      {"type": "heading", "content": "Heat Energy", "level": 2},
      {"type": "text", "content": "Heat makes things warm. The sun warms the Earth. A fire warms a room. When you rub your hands together quickly, you feel heat from the rubbing."},
      {"type": "callout", "content": "The sun gives us three kinds of energy: light, heat, and the energy plants use to grow!", "style": "tip"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What kind of energy helps us see?", "options": ["Sound energy", "Heat energy", "Light energy", "Wind energy"], "correct": 2, "explanation": "Light energy helps us see things around us."},
      {"type": "quiz", "question": "How is sound made?", "options": ["By painting", "By sleeping", "By vibrating", "By freezing"], "correct": 2, "explanation": "Sound is made when something vibrates or shakes very fast."}
    ]'::jsonb,
    '[{"term": "Energy", "definition": "The ability to do work or cause change, like making light, sound, or heat"},
      {"term": "Vibrate", "definition": "To shake back and forth very quickly"},
      {"term": "Natural light", "definition": "Light that comes from nature, like the sun"},
      {"term": "Artificial light", "definition": "Light made by people, like from a lamp or flashlight"}]'::jsonb,
    'Fire has been central to Indigenous life for thousands of years. Fire provides light, heat, and a place for community gathering and storytelling. The ability to make and manage fire represents deep scientific knowledge of heat energy.',
    12, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'FEK.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Name three forms of energy.', 'Light, sound, and heat.', 'You can see one, hear one, and feel one.', 1, 0),
    (v_tenant, v_ch, 'What does vibrate mean?', 'To shake back and forth very quickly.', 'A guitar string does this.', 1, 1),
    (v_tenant, v_ch, 'What is the biggest source of light and heat for Earth?', 'The sun.', 'Look up at the sky on a clear day.', 1, 2);


  -- ========================================================================
  -- UNIT 4: Earth and Space Science — Natural Surroundings (NSK.1)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Our Natural Surroundings',
    'Explore features of natural surroundings including soil, water, landforms, and weather conditions.',
    'Our natural surroundings include soil, water, landforms, and weather that change over time.',
    'What can we discover about the natural world around us?')
  RETURNING id INTO v_unit;

  -- Chapter 8 — Soil and Water
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 8, 'Soil and Water', 'soil-and-water-k',
    'Observe features of soil and water in the local environment.',
    '[
      {"type": "heading", "content": "Soil and Water", "level": 1},
      {"type": "text", "content": "When you go outside, you can see soil on the ground and water in puddles, ponds, and rivers. Soil and water are important parts of the natural world."},
      {"type": "heading", "content": "What Is Soil?", "level": 2},
      {"type": "text", "content": "Soil is the loose material on top of the ground. It is made of tiny bits of rock, dead plants, and other materials. Soil can be dark or light, dry or wet, sandy or sticky."},
      {"type": "heading", "content": "Why Soil Matters", "level": 2},
      {"type": "text", "content": "Plants grow in soil. Worms and bugs live in soil. Soil holds water for plants to drink. Without healthy soil, many living things could not survive."},
      {"type": "heading", "content": "Water in Our World", "level": 2},
      {"type": "text", "content": "Water is found in lakes, rivers, puddles, and rain. Living things need water to survive. Water can be a liquid (like in a glass), solid (like ice), or a gas (like steam)."},
      {"type": "callout", "content": "Saskatchewan has thousands of lakes and rivers. Water is one of our most important resources.", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is soil made of?", "options": ["Only rocks", "Tiny bits of rock and dead plants", "Only sand", "Only water"], "correct": 1, "explanation": "Soil is a mixture of tiny bits of rock, dead plants, and other materials."},
      {"type": "quiz", "question": "What are the three forms water can take?", "options": ["Hot, cold, warm", "Liquid, solid, gas", "Big, medium, small", "Clean, dirty, muddy"], "correct": 1, "explanation": "Water can be liquid (flowing), solid (ice), or gas (steam or vapour)."}
    ]'::jsonb,
    '[{"term": "Soil", "definition": "The loose material on top of the ground, made of bits of rock and dead plants"},
      {"term": "Liquid", "definition": "A form of matter that flows and takes the shape of its container"},
      {"term": "Solid", "definition": "A form of matter that holds its own shape"},
      {"term": "Gas", "definition": "A form of matter that spreads out to fill any space, like steam"}]'::jsonb,
    'Water is sacred in many Indigenous cultures. The Cree word for water is "nipiy." Water ceremonies honour the importance of clean water for all living things. Elders teach that we must protect water for future generations.',
    12, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'NSK.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is soil made of?', 'Tiny bits of rock, dead plants, and other materials.', 'Dig in a garden and look closely.', 1, 0),
    (v_tenant, v_ch, 'Name three forms of water.', 'Liquid, solid (ice), and gas (steam).', 'Think about water in a glass, in a freezer, and in a kettle.', 1, 1),
    (v_tenant, v_ch, 'What is the Cree word for water?', 'Nipiy.', 'It is sacred in Cree culture.', 1, 2);


  -- Chapter 9 — Weather Around Us
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 9, 'Weather Around Us', 'weather-around-us-k',
    'Observe and describe weather conditions and how they change.',
    '[
      {"type": "heading", "content": "Weather Around Us", "level": 1},
      {"type": "text", "content": "Every day the weather can be different. Some days are sunny and warm. Some days are cloudy and cold. Some days it rains or snows. Weather describes what it is like outside."},
      {"type": "heading", "content": "Types of Weather", "level": 2},
      {"type": "text", "content": "Common types of weather:\n- Sunny: the sun is shining, few clouds\n- Cloudy: clouds cover the sky\n- Rainy: water falls from the clouds\n- Snowy: frozen water falls as snowflakes\n- Windy: air moves fast around us"},
      {"type": "callout", "content": "In Saskatchewan, we experience all four seasons: spring, summer, fall, and winter. Each season has different weather.", "style": "info"},
      {"type": "heading", "content": "How Weather Changes", "level": 2},
      {"type": "text", "content": "Weather changes from day to day and from season to season. In winter it is cold and snowy. In summer it is warm and sunny. In spring and fall, the weather is in between."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Which season is usually the coldest in Saskatchewan?", "options": ["Summer", "Spring", "Winter", "Fall"], "correct": 2, "explanation": "Winter is the coldest season with snow and freezing temperatures."},
      {"type": "quiz", "question": "What causes rain?", "options": ["The sun melts", "Water falls from clouds", "Wind blows water", "Trees make rain"], "correct": 1, "explanation": "Rain happens when water falls from clouds in the sky."}
    ]'::jsonb,
    '[{"term": "Weather", "definition": "What it is like outside, including temperature, clouds, wind, and rain or snow"},
      {"term": "Season", "definition": "A time of year with its own kind of weather: spring, summer, fall, or winter"},
      {"term": "Temperature", "definition": "How hot or cold something is"}]'::jsonb,
    'Indigenous peoples have always observed weather patterns closely. Traditional knowledge about cloud formations, animal behaviour, and plant changes helped predict coming weather. This knowledge was passed down through generations of careful observation.',
    12, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'NSK.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is weather?', 'What it is like outside, including temperature, clouds, wind, and rain or snow.', 'Look out the window!', 1, 0),
    (v_tenant, v_ch, 'Name the four seasons.', 'Spring, summer, fall, and winter.', 'They repeat every year.', 1, 1),
    (v_tenant, v_ch, 'Which season is warmest in Saskatchewan?', 'Summer.', 'Think about when you go swimming.', 1, 2);

  RAISE NOTICE 'Grade K Science content seeded successfully.';
END $$;


-- ============================================================================
-- GRADE 1 — WolfWhale Science 1
-- Outcomes: SE1.1, SE1.2, LT1.1, LT1.2, OM1.1, OM1.2, DS1.1, DS1.2
-- ============================================================================
DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_oc     UUID;
BEGIN
  SELECT id INTO v_book FROM textbooks
    WHERE tenant_id = v_tenant AND slug = 'wolfwhale-science-1';

  -- ========================================================================
  -- UNIT 1: Physical Science — Using Our Senses (SE1.1, SE1.2)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Using Our Senses',
    'Investigate characteristics of the five senses and how humans and animals use them to interact with the environment.',
    'Our five senses help us learn about and interact with the world around us.',
    'How do our senses help us understand the world?')
  RETURNING id INTO v_unit;

  -- Chapter 1 — The Five Senses
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 1, 'The Five Senses', 'the-five-senses',
    'Learn about the five senses: sight, hearing, smell, touch, and taste.',
    '[
      {"type": "heading", "content": "The Five Senses", "level": 1},
      {"type": "text", "content": "Your body has five ways to take in information about the world. These are called your five senses. Each sense uses a different body part."},
      {"type": "heading", "content": "Our Five Senses", "level": 2},
      {"type": "list", "style": "unordered", "items": ["Sight — we use our eyes to see colours, shapes, and movement", "Hearing — we use our ears to hear sounds", "Smell — we use our nose to smell odours and scents", "Touch — we use our skin (especially our hands) to feel texture, temperature, and pressure", "Taste — we use our tongue to taste flavours like sweet, salty, sour, and bitter"]},
      {"type": "callout", "content": "Your brain puts together information from all five senses to help you understand what is happening around you.", "style": "info"},
      {"type": "heading", "content": "Senses Keep Us Safe", "level": 2},
      {"type": "text", "content": "Our senses also keep us safe. We can smell smoke from a fire. We can hear a car honking. We can feel that a stove is hot. Our senses warn us about danger."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Which body part do you use to hear?", "options": ["Eyes", "Nose", "Ears", "Tongue"], "correct": 2, "explanation": "We use our ears to hear sounds around us."},
      {"type": "quiz", "question": "Which sense helps you know that a cookie is sweet?", "options": ["Sight", "Touch", "Smell", "Taste"], "correct": 3, "explanation": "Taste helps us know flavours like sweet, salty, sour, and bitter."}
    ]'::jsonb,
    '[{"term": "Senses", "definition": "The five ways our body takes in information: sight, hearing, smell, touch, taste"},
      {"term": "Sight", "definition": "The sense that uses our eyes to see"},
      {"term": "Hearing", "definition": "The sense that uses our ears to detect sounds"},
      {"term": "Touch", "definition": "The sense that uses our skin to feel texture, temperature, and pressure"}]'::jsonb,
    'Indigenous hunters and gatherers rely on all five senses when on the land. Listening for animal sounds, watching for tracks, smelling changes in weather, and feeling the wind direction are all skills passed down through generations.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SE1.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Name the five senses.', 'Sight, hearing, smell, touch, and taste.', 'Think about your eyes, ears, nose, hands, and tongue.', 1, 0),
    (v_tenant, v_ch, 'Which body part is used for the sense of smell?', 'The nose.', 'You breathe through it.', 1, 1),
    (v_tenant, v_ch, 'How do senses keep us safe?', 'They warn us about danger, like smelling smoke or feeling heat.', 'Think about hearing a car horn.', 1, 2),
    (v_tenant, v_ch, 'Name four flavours your tongue can taste.', 'Sweet, salty, sour, and bitter.', 'Think about sugar, chips, lemons, and dark chocolate.', 1, 3);


  -- Chapter 2 — How Animals Use Their Senses
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 2, 'How Animals Use Their Senses', 'animals-use-senses',
    'Explore how animals use their senses to survive and interact with their environment.',
    '[
      {"type": "heading", "content": "How Animals Use Their Senses", "level": 1},
      {"type": "text", "content": "Animals use their senses to find food, avoid danger, and communicate with each other. Some animals have senses that are much stronger than ours!"},
      {"type": "heading", "content": "Amazing Animal Senses", "level": 2},
      {"type": "text", "content": "Different animals have different sense abilities:\n- Dogs have an incredible sense of smell — about 40 times better than humans\n- Eagles can see small animals from very far away\n- Bats use hearing to find their way in the dark\n- Cats have sensitive whiskers that help them feel in tight spaces\n- Bears can smell food from kilometres away"},
      {"type": "callout", "content": "Some animals have senses that humans do not have. Sharks can sense electricity from other animals, and some snakes can sense heat!", "style": "tip"},
      {"type": "heading", "content": "Senses for Survival", "level": 2},
      {"type": "text", "content": "Animals use their senses to:\n- Find food and water\n- Detect predators and escape danger\n- Find mates and care for their young\n- Navigate and find their way home"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Which animal has an amazing sense of smell?", "options": ["Eagle", "Dog", "Fish", "Frog"], "correct": 1, "explanation": "Dogs have an incredible sense of smell, about 40 times better than humans."},
      {"type": "quiz", "question": "How do bats find their way in the dark?", "options": ["Sight", "Smell", "Hearing", "Taste"], "correct": 2, "explanation": "Bats use hearing (echolocation) to find their way and catch insects in the dark."}
    ]'::jsonb,
    '[{"term": "Predator", "definition": "An animal that hunts other animals for food"},
      {"term": "Navigate", "definition": "To find your way from one place to another"},
      {"term": "Echolocation", "definition": "Using sound echoes to find objects in the dark, like bats do"},
      {"term": "Communicate", "definition": "To share information with others"}]'::jsonb,
    'Indigenous peoples have always observed animal behaviour closely. Traditional knowledge about how animals use their senses informed hunting practices and weather prediction. For example, observing how animals behave before a storm helped communities prepare.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SE1.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Which animal has amazing eyesight?', 'Eagles can see small animals from very far away.', 'Think of a bird of prey.', 1, 0),
    (v_tenant, v_ch, 'What is echolocation?', 'Using sound echoes to find objects in the dark.', 'Bats use this.', 1, 1),
    (v_tenant, v_ch, 'Name two ways animals use their senses.', 'To find food and to detect danger.', 'Survival needs.', 1, 2);


  -- ========================================================================
  -- UNIT 2: Life Science — Needs of Living Things (LT1.1, LT1.2)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Needs of Living Things',
    'Differentiate between living things and analyze how they interact with environments to meet their basic needs.',
    'All living things have basic needs that must be met for survival.',
    'What do living things need to survive?')
  RETURNING id INTO v_unit;

  -- Chapter 3 — Needs of Plants and Animals
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 3, 'Needs of Plants and Animals', 'needs-plants-animals',
    'Explore the basic needs of plants and animals for survival.',
    '[
      {"type": "heading", "content": "Needs of Plants and Animals", "level": 1},
      {"type": "text", "content": "All living things have basic needs. If these needs are not met, a living thing cannot survive. Plants and animals have some needs that are the same and some that are different."},
      {"type": "heading", "content": "What Plants Need", "level": 2},
      {"type": "text", "content": "Plants need:\n- Water from rain or the soil\n- Sunlight to make food\n- Air (carbon dioxide) to make food\n- Nutrients from the soil\n- Space to grow"},
      {"type": "heading", "content": "What Animals Need", "level": 2},
      {"type": "text", "content": "Animals need:\n- Food (they cannot make their own like plants)\n- Water to drink\n- Air to breathe (oxygen)\n- Shelter to stay safe and comfortable\n- Space to move and find food"},
      {"type": "callout", "content": "Plants make their own food using sunlight. Animals must find or catch their food. This is a big difference!", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What do plants need that animals do not?", "options": ["Water", "Sunlight to make food", "Air", "Space"], "correct": 1, "explanation": "Plants need sunlight to make their own food. Animals find or catch food instead."},
      {"type": "quiz", "question": "Which is NOT a basic need of animals?", "options": ["Food", "Water", "Sunlight to make food", "Shelter"], "correct": 2, "explanation": "Animals do not use sunlight to make food. That is something only plants do."}
    ]'::jsonb,
    '[{"term": "Basic needs", "definition": "The things a living thing must have to survive"},
      {"term": "Shelter", "definition": "A safe place that protects from weather and predators"},
      {"term": "Nutrients", "definition": "Substances in soil and food that help living things grow"},
      {"term": "Survive", "definition": "To stay alive"}]'::jsonb,
    'Indigenous teachings about the interconnection of all living things emphasize that plants and animals depend on each other. The Medicine Wheel teaches balance in nature: when one part is out of balance, all parts are affected.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'LT1.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'LT1.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Name four basic needs of animals.', 'Food, water, air, and shelter.', 'Think about what your pet needs.', 1, 0),
    (v_tenant, v_ch, 'How do plants get food?', 'They make their own food using sunlight, water, and air.', 'They do not eat like animals do.', 1, 1),
    (v_tenant, v_ch, 'What is shelter?', 'A safe place that protects from weather and predators.', 'A bird''s nest or a rabbit''s burrow.', 1, 2);


  -- Chapter 4 — Living Things and Their Environments
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 4, 'Living Things and Their Environments', 'living-things-environments',
    'Analyze how plants, animals, and humans interact with natural and constructed environments.',
    '[
      {"type": "heading", "content": "Living Things and Their Environments", "level": 1},
      {"type": "text", "content": "Every living thing lives in an environment that provides what it needs. Some environments are natural, like forests and lakes. Some are constructed (built by people), like farms and gardens."},
      {"type": "heading", "content": "Natural Environments", "level": 2},
      {"type": "text", "content": "Natural environments in Saskatchewan include:\n- Grasslands (prairies) where grasses and wildflowers grow\n- Forests with many kinds of trees and animals\n- Wetlands (marshes) with lots of water plants and birds\n- Lakes and rivers where fish and other water animals live"},
      {"type": "heading", "content": "Constructed Environments", "level": 2},
      {"type": "text", "content": "People build environments for living things:\n- Farms provide food crops and shelter for farm animals\n- Gardens give plants the soil, water, and sunlight they need\n- Aquariums create a water environment for fish\n- Zoos and sanctuaries protect animals"},
      {"type": "callout", "content": "Humans change the environment when they build roads, houses, and farms. This can affect the plants and animals that live there.", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Which is a natural environment?", "options": ["A farm", "A forest", "A garden", "A zoo"], "correct": 1, "explanation": "A forest is a natural environment. Farms, gardens, and zoos are built by people."},
      {"type": "quiz", "question": "What happens when people build roads and houses?", "options": ["Nothing changes", "The natural environment may be affected", "Animals get bigger", "Plants grow faster"], "correct": 1, "explanation": "Building changes the environment, which can affect the plants and animals living there."}
    ]'::jsonb,
    '[{"term": "Environment", "definition": "The surroundings where a living thing lives, including air, water, soil, and other living things"},
      {"term": "Natural environment", "definition": "An environment not made by people, like a forest or lake"},
      {"term": "Constructed environment", "definition": "An environment built or changed by people, like a farm or garden"},
      {"term": "Grassland", "definition": "A flat area covered mainly with grasses, like the Saskatchewan prairies"}]'::jsonb,
    'First Nations peoples view themselves as part of the environment, not separate from it. Traditional land management practices, such as controlled burns on the prairies, helped maintain healthy grassland ecosystems for thousands of years.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'LT1.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a natural environment?', 'An environment not made by people, like a forest or lake.', 'Think about places in nature.', 1, 0),
    (v_tenant, v_ch, 'What is a constructed environment?', 'An environment built or changed by people, like a farm or garden.', 'People built it.', 1, 1),
    (v_tenant, v_ch, 'Name two natural environments in Saskatchewan.', 'Grasslands and forests (also wetlands and lakes).', 'Think about the prairies.', 1, 2);


  -- ========================================================================
  -- UNIT 3: Physical Science — Objects and Materials (OM1.1, OM1.2)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Objects and Materials',
    'Investigate observable characteristics of objects and materials and explore methods of altering and combining materials.',
    'Materials have properties that determine how they can be used and combined.',
    'How do we choose and use materials to make things?')
  RETURNING id INTO v_unit;

  -- Chapter 5 — Natural and Constructed Objects
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 5, 'Natural and Constructed Objects', 'natural-constructed-objects',
    'Compare characteristics and uses of natural and constructed objects and materials.',
    '[
      {"type": "heading", "content": "Natural and Constructed Objects", "level": 1},
      {"type": "text", "content": "Some objects come from nature. Others are made by people. A stick is natural. A pencil is constructed (made by people from wood and graphite). Both can be used for writing!"},
      {"type": "heading", "content": "Natural Materials", "level": 2},
      {"type": "text", "content": "Natural materials come from the Earth, plants, or animals:\n- Wood comes from trees\n- Cotton comes from plants\n- Wool comes from sheep\n- Stone comes from the ground\n- Water comes from rain, rivers, and lakes"},
      {"type": "heading", "content": "Constructed (Human-Made) Materials", "level": 2},
      {"type": "text", "content": "Some materials are made by people:\n- Plastic is made in factories\n- Glass is made from sand heated to a very high temperature\n- Brick is made from clay that is shaped and baked\n- Paper is made from wood pulp"},
      {"type": "callout", "content": "Many constructed materials start as natural materials! Paper starts as wood. Glass starts as sand.", "style": "tip"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Which is a natural material?", "options": ["Plastic", "Glass", "Wool", "Brick"], "correct": 2, "explanation": "Wool is a natural material that comes from sheep."},
      {"type": "quiz", "question": "What natural material is paper made from?", "options": ["Sand", "Cotton", "Wood", "Stone"], "correct": 2, "explanation": "Paper is made from wood pulp, which comes from trees."}
    ]'::jsonb,
    '[{"term": "Natural material", "definition": "A material that comes from nature, like wood, stone, or cotton"},
      {"term": "Constructed material", "definition": "A material made by people, like plastic or glass"},
      {"term": "Wood pulp", "definition": "Wood that has been broken down into tiny fibres, used to make paper"}]'::jsonb,
    'Indigenous peoples used natural materials for everything: birch bark for canoes, animal hides for tipis and clothing, stone for tools, and plant fibres for rope and baskets. Understanding material properties was essential knowledge.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'OM1.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a natural material?', 'A material that comes from nature, like wood, stone, or cotton.', 'Not made in a factory.', 1, 0),
    (v_tenant, v_ch, 'Name a material made by people.', 'Plastic (also glass, brick, or paper).', 'Made in a factory.', 1, 1),
    (v_tenant, v_ch, 'What is glass made from?', 'Sand heated to a very high temperature.', 'It starts as a natural material.', 1, 2);


  -- Chapter 6 — Combining and Changing Materials
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 6, 'Combining and Changing Materials', 'combining-changing-materials',
    'Explore methods of altering and combining materials to create objects.',
    '[
      {"type": "heading", "content": "Combining and Changing Materials", "level": 1},
      {"type": "text", "content": "We can change materials and put them together to make new things. When you mix flour, water, and eggs, you get dough for bread. When you stack blocks, you build a tower."},
      {"type": "heading", "content": "Ways to Change Materials", "level": 2},
      {"type": "text", "content": "Materials can be changed by:\n- Cutting: using scissors to cut paper into a new shape\n- Folding: bending paper to make an airplane\n- Heating: cooking dough to make bread\n- Cooling: freezing water to make ice\n- Mixing: stirring paint colours together"},
      {"type": "heading", "content": "Combining Materials", "level": 2},
      {"type": "text", "content": "We combine materials to build things:\n- Glue holds paper and craft materials together\n- Nails hold pieces of wood together\n- Thread and needles sew fabric pieces together\n- Tape sticks things in place"},
      {"type": "callout", "content": "Some changes can be undone (like melting ice back to water). Other changes cannot be undone (like baking a cake).", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Which is a way to change a material?", "options": ["Looking at it", "Cutting it", "Counting it", "Naming it"], "correct": 1, "explanation": "Cutting changes the shape and size of a material."},
      {"type": "quiz", "question": "Which change CANNOT be undone?", "options": ["Freezing water", "Melting ice", "Baking a cake", "Folding paper"], "correct": 2, "explanation": "Once a cake is baked, you cannot turn it back into flour, eggs, and sugar."}
    ]'::jsonb,
    '[{"term": "Combine", "definition": "To put two or more materials together to make something new"},
      {"term": "Alter", "definition": "To change something"},
      {"term": "Reversible", "definition": "A change that can be undone, like melting ice"},
      {"term": "Irreversible", "definition": "A change that cannot be undone, like baking bread"}]'::jsonb,
    'Indigenous peoples combined natural materials in skillful ways. Pemmican was made by combining dried bison meat, berries, and melted fat — a method of preserving food that shows deep understanding of how materials change.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'OM1.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Name three ways to change a material.', 'Cutting, folding, and heating.', 'Think about what you do in art class.', 1, 0),
    (v_tenant, v_ch, 'What is a reversible change?', 'A change that can be undone, like melting ice back to water.', 'Can you put it back the way it was?', 1, 1),
    (v_tenant, v_ch, 'What is pemmican?', 'A food made by combining dried bison meat, berries, and melted fat.', 'An Indigenous food preservation method.', 1, 2);


  -- ========================================================================
  -- UNIT 4: Earth and Space Science — Daily and Seasonal Changes (DS1.1, DS1.2)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Daily and Seasonal Changes',
    'Compare daily and seasonal changes and how living things adapt to them.',
    'Nature follows patterns of daily and seasonal change that affect all living things.',
    'How do living things change with the seasons?')
  RETURNING id INTO v_unit;

  -- Chapter 7 — Day and Night
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 7, 'Day and Night', 'day-and-night',
    'Observe and describe the daily pattern of day and night.',
    '[
      {"type": "heading", "content": "Day and Night", "level": 1},
      {"type": "text", "content": "Every day follows a pattern: the sun rises in the morning, shines during the day, and sets in the evening. Then it is night and the sky is dark. This pattern repeats every day."},
      {"type": "heading", "content": "What Happens During the Day?", "level": 2},
      {"type": "text", "content": "During the day:\n- The sun provides light and warmth\n- Many animals are active (looking for food, playing)\n- Plants open their leaves toward the sun\n- People go to school and work"},
      {"type": "heading", "content": "What Happens at Night?", "level": 2},
      {"type": "text", "content": "At night:\n- The sky is dark and we can see the moon and stars\n- Many animals sleep\n- Some animals (like owls) are active at night\n- The air usually gets cooler\n- People and many animals rest"},
      {"type": "callout", "content": "Animals that are active during the day are called diurnal. Animals that are active at night are called nocturnal.", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What provides light and warmth during the day?", "options": ["The moon", "The stars", "The sun", "Clouds"], "correct": 2, "explanation": "The sun provides light and heat during the day."},
      {"type": "quiz", "question": "An owl is active at night. This makes the owl:", "options": ["Diurnal", "Nocturnal", "Asleep", "Hungry"], "correct": 1, "explanation": "Nocturnal animals are active at night and sleep during the day."}
    ]'::jsonb,
    '[{"term": "Diurnal", "definition": "Active during the day and sleeping at night"},
      {"term": "Nocturnal", "definition": "Active at night and sleeping during the day"},
      {"term": "Sunrise", "definition": "When the sun appears above the horizon in the morning"},
      {"term": "Sunset", "definition": "When the sun disappears below the horizon in the evening"}]'::jsonb,
    'Many Indigenous stories explain the cycle of day and night. The sun and moon are often seen as relatives who take turns watching over the Earth. These stories teach children about daily patterns in nature.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'DS1.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a nocturnal animal?', 'An animal that is active at night and sleeps during the day.', 'Owls are an example.', 1, 0),
    (v_tenant, v_ch, 'What is a diurnal animal?', 'An animal that is active during the day and sleeps at night.', 'Humans are diurnal.', 1, 1),
    (v_tenant, v_ch, 'What provides light during the day?', 'The sun.', 'Look at the sky on a clear day.', 1, 2);


  -- Chapter 8 — Seasonal Changes
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 8, 'Seasonal Changes', 'seasonal-changes',
    'Observe and describe how nature changes through the four seasons.',
    '[
      {"type": "heading", "content": "Seasonal Changes", "level": 1},
      {"type": "text", "content": "Saskatchewan has four seasons: spring, summer, fall, and winter. Each season brings changes to the weather, the land, and the living things around us."},
      {"type": "heading", "content": "Spring", "level": 2},
      {"type": "text", "content": "In spring, the weather gets warmer. Snow melts. Plants begin to grow new leaves and flowers. Birds return from their winter migration. Baby animals are born."},
      {"type": "heading", "content": "Summer", "level": 2},
      {"type": "text", "content": "In summer, days are long and warm. Plants are green and growing. Animals are busy raising their young. Insects are active. There is lots of sunlight."},
      {"type": "heading", "content": "Fall", "level": 2},
      {"type": "text", "content": "In fall, days get shorter and cooler. Leaves change colour and fall from trees. Animals prepare for winter by storing food or growing thicker fur. Some birds fly south (migrate)."},
      {"type": "heading", "content": "Winter", "level": 2},
      {"type": "text", "content": "In winter, it is very cold. Snow covers the ground. Many trees have no leaves. Some animals hibernate (sleep through winter). Days are short and nights are long."},
      {"type": "callout", "content": "Animals adapt to seasons in different ways: migration (moving), hibernation (sleeping), or growing thicker fur and feathers.", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "In which season do leaves change colour?", "options": ["Spring", "Summer", "Fall", "Winter"], "correct": 2, "explanation": "In fall, leaves change colour from green to yellow, orange, and red before falling."},
      {"type": "quiz", "question": "What does hibernate mean?", "options": ["To fly south", "To sleep through winter", "To grow fur", "To build a nest"], "correct": 1, "explanation": "Hibernation is when an animal sleeps through the cold winter months."}
    ]'::jsonb,
    '[{"term": "Season", "definition": "A time of year with typical weather patterns: spring, summer, fall, winter"},
      {"term": "Migration", "definition": "When animals travel from one area to another, usually to find food or warmer weather"},
      {"term": "Hibernation", "definition": "When an animal sleeps deeply through winter to save energy"},
      {"term": "Adapt", "definition": "To change in ways that help a living thing survive in its environment"}]'::jsonb,
    'Many Indigenous nations mark seasonal changes with ceremonies and gatherings. The Cree calendar uses 13 moons, each named for natural events: the Moon When the Frogs Begin to Sing marks spring. This demonstrates deep observation of seasonal patterns.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'DS1.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'DS1.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is migration?', 'When animals travel from one area to another to find food or warmer weather.', 'Birds fly south for winter.', 1, 0),
    (v_tenant, v_ch, 'What is hibernation?', 'When an animal sleeps deeply through winter to save energy.', 'Bears do this.', 1, 1),
    (v_tenant, v_ch, 'In which season do baby animals often arrive?', 'Spring.', 'The weather is getting warmer.', 1, 2),
    (v_tenant, v_ch, 'How many moons are in the traditional Cree calendar?', '13 moons.', 'More than the 12 months we usually use.', 1, 3);

  RAISE NOTICE 'Grade 1 Science content seeded successfully.';
END $$;


-- ============================================================================
-- GRADE 2 — WolfWhale Science 2
-- Outcomes: AN2.1, AN2.2, AN2.3, AW2.1, AW2.2, LS2.1, LS2.2, MP2.1, MP2.2
-- ============================================================================
DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_oc     UUID;
BEGIN
  SELECT id INTO v_book FROM textbooks
    WHERE tenant_id = v_tenant AND slug = 'wolfwhale-science-2';

  -- ========================================================================
  -- UNIT 1: Life Science — Animal Growth and Changes (AN2.1, AN2.2, AN2.3)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Animal Growth and Changes',
    'Analyze the growth and development of familiar animals during their life cycles and the interdependence of humans and animals.',
    'Animals grow and change throughout their life cycles, and humans and animals depend on each other.',
    'How do animals grow and change during their lives?')
  RETURNING id INTO v_unit;

  -- Chapter 1 — Animal Life Cycles
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 1, 'Animal Life Cycles', 'animal-life-cycles',
    'Explore how different animals grow and develop through stages of life.',
    '[
      {"type": "heading", "content": "Animal Life Cycles", "level": 1},
      {"type": "text", "content": "Every animal goes through stages of growth and change called a life cycle. All animals are born, grow, and eventually have young of their own. But different kinds of animals go through different stages."},
      {"type": "heading", "content": "Mammal Life Cycle", "level": 2},
      {"type": "text", "content": "Mammals (like dogs, cats, and humans) are born alive from their mother. Baby mammals drink milk from their mother. They grow bigger and learn skills from their parents until they are adults."},
      {"type": "heading", "content": "Bird Life Cycle", "level": 2},
      {"type": "text", "content": "Birds hatch from eggs. A baby bird (chick) is often helpless and depends on its parents for food and warmth. As it grows, it develops feathers and learns to fly."},
      {"type": "heading", "content": "Insect Life Cycle", "level": 2},
      {"type": "text", "content": "Many insects go through a big change called metamorphosis:\n1. Egg — the insect starts as a tiny egg\n2. Larva — it hatches as a caterpillar or grub\n3. Pupa — it wraps itself in a cocoon or chrysalis\n4. Adult — it comes out as a butterfly, moth, or beetle"},
      {"type": "callout", "content": "A butterfly goes through complete metamorphosis: egg, caterpillar, chrysalis, butterfly. What an amazing change!", "style": "tip"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is a life cycle?", "options": ["A kind of bicycle", "The stages of growth an animal goes through", "A type of food", "A game animals play"], "correct": 1, "explanation": "A life cycle is the series of stages an animal goes through from birth to having its own young."},
      {"type": "quiz", "question": "What is metamorphosis?", "options": ["When animals sleep", "A big change in body form during growth", "When birds fly south", "When fish swim upstream"], "correct": 1, "explanation": "Metamorphosis is a dramatic change in body form, like a caterpillar becoming a butterfly."}
    ]'::jsonb,
    '[{"term": "Life cycle", "definition": "The stages of growth and change a living thing goes through from birth to death"},
      {"term": "Metamorphosis", "definition": "A big change in body form as an animal grows, like a caterpillar becoming a butterfly"},
      {"term": "Larva", "definition": "The young form of an insect that looks very different from the adult, like a caterpillar"},
      {"term": "Mammal", "definition": "An animal that has fur or hair and feeds milk to its young"}]'::jsonb,
    'Indigenous peoples have observed animal life cycles for generations. Understanding when salmon spawn, when birds nest, and when caribou calve guided hunting, fishing, and land stewardship practices.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'AN2.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a life cycle?', 'The stages of growth and change a living thing goes through.', 'Born, grow, reproduce.', 1, 0),
    (v_tenant, v_ch, 'What is metamorphosis?', 'A big change in body form as an animal grows.', 'Caterpillar to butterfly.', 1, 1),
    (v_tenant, v_ch, 'Name the four stages of a butterfly''s life cycle.', 'Egg, larva (caterpillar), pupa (chrysalis), adult (butterfly).', 'Four stages of complete metamorphosis.', 1, 2),
    (v_tenant, v_ch, 'How are mammals born?', 'They are born alive from their mother and drink milk.', 'Dogs, cats, and humans are mammals.', 1, 3);


  -- Chapter 2 — Comparing Animal and Human Growth
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 2, 'Comparing Animal and Human Growth', 'comparing-animal-human-growth',
    'Compare how humans grow and develop with the growth of familiar animals.',
    '[
      {"type": "heading", "content": "Comparing Animal and Human Growth", "level": 1},
      {"type": "text", "content": "Humans are animals too! Like other mammals, we are born, we grow, and we change. But our growth is different from many other animals."},
      {"type": "heading", "content": "How Humans Grow", "level": 2},
      {"type": "text", "content": "Human growth stages:\n- Baby: cannot walk or feed itself, needs lots of care\n- Toddler: learns to walk and talk\n- Child: grows taller, learns many skills at school\n- Teenager: body changes and grows quickly\n- Adult: fully grown, can care for young"},
      {"type": "heading", "content": "How Other Animals Grow", "level": 2},
      {"type": "text", "content": "Many animals grow up much faster than humans:\n- A puppy can walk within days of being born\n- A horse can stand and run within hours of birth\n- A butterfly takes only a few weeks to go from egg to adult\n- Humans take about 18 years to become fully grown adults!"},
      {"type": "callout", "content": "Humans take longer to grow up than almost any other animal. This is because our brains need extra time to develop and learn.", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Which animal can stand and run within hours of being born?", "options": ["A puppy", "A kitten", "A horse", "A human baby"], "correct": 2, "explanation": "Horses (foals) can stand and run within hours of being born."},
      {"type": "quiz", "question": "Why do humans take so long to grow up?", "options": ["We eat too slowly", "Our brains need extra time to develop", "We sleep too much", "We do not exercise enough"], "correct": 1, "explanation": "Humans have complex brains that need many years to fully develop."}
    ]'::jsonb,
    '[{"term": "Growth", "definition": "The process of getting bigger and developing over time"},
      {"term": "Development", "definition": "The changes a living thing goes through as it grows and matures"},
      {"term": "Stage", "definition": "A step or phase in a process of growth or change"}]'::jsonb,
    'In many Indigenous cultures, life stages are honoured with ceremonies. Naming ceremonies welcome babies. Coming-of-age ceremonies mark the transition to adulthood. Each stage of life is valued and respected.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'AN2.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'How long does it take a human to become fully grown?', 'About 18 years.', 'Much longer than most animals!', 1, 0),
    (v_tenant, v_ch, 'Name the stages of human growth.', 'Baby, toddler, child, teenager, adult.', 'Think about how you have grown.', 1, 1),
    (v_tenant, v_ch, 'Which animal can walk within days of being born?', 'A puppy.', 'A common pet.', 1, 2);


  -- Chapter 3 — Humans and Animals Together
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 3, 'Humans and Animals Together', 'humans-animals-together',
    'Assess how humans and animals depend on each other.',
    '[
      {"type": "heading", "content": "Humans and Animals Together", "level": 1},
      {"type": "text", "content": "Humans and animals need each other. We depend on animals in many ways, and animals sometimes depend on us. This connection is called interdependence."},
      {"type": "heading", "content": "How Humans Depend on Animals", "level": 2},
      {"type": "text", "content": "People depend on animals for:\n- Food (milk, eggs, meat, honey)\n- Clothing (wool, leather)\n- Companionship (pets like dogs and cats)\n- Help with work (horses, service dogs)\n- Pollination (bees help plants grow food)"},
      {"type": "heading", "content": "How Animals Depend on Humans", "level": 2},
      {"type": "text", "content": "Some animals depend on humans for:\n- Food and water (pets, farm animals)\n- Shelter (barns, doghouses)\n- Protection (wildlife conservation, sanctuaries)\n- Habitat preservation (protecting forests and wetlands)"},
      {"type": "callout", "content": "We have a responsibility to take care of animals and the environments they live in.", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What does interdependence mean?", "options": ["Living alone", "Depending on each other", "Being scared of each other", "Fighting each other"], "correct": 1, "explanation": "Interdependence means that living things depend on each other to survive."},
      {"type": "quiz", "question": "How do bees help humans?", "options": ["They give us wool", "They carry our mail", "They pollinate plants so food can grow", "They protect our houses"], "correct": 2, "explanation": "Bees pollinate flowers, which helps fruits and vegetables grow."}
    ]'::jsonb,
    '[{"term": "Interdependence", "definition": "When living things depend on each other to survive"},
      {"term": "Pollination", "definition": "When insects or wind carry pollen from flower to flower so plants can make seeds"},
      {"term": "Conservation", "definition": "Protecting and caring for nature and wildlife"},
      {"term": "Responsibility", "definition": "A duty to take care of something"}]'::jsonb,
    'The relationship between Indigenous peoples and animals is built on deep respect. Bison provided food, clothing, shelter, and tools for Plains peoples. Every part of the animal was used, nothing was wasted. Gratitude was expressed through ceremony.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'AN2.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is interdependence?', 'When living things depend on each other to survive.', 'Both sides need each other.', 1, 0),
    (v_tenant, v_ch, 'Name two ways humans depend on animals.', 'Food and companionship (also clothing, work, pollination).', 'Think about what we get from animals.', 1, 1),
    (v_tenant, v_ch, 'What is conservation?', 'Protecting and caring for nature and wildlife.', 'Keeping nature healthy for the future.', 1, 2);


  -- ========================================================================
  -- UNIT 2: Earth and Space Science — Air and Water (AW2.1, AW2.2)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Air and Water in the Environment',
    'Investigate properties of air and water and their importance for living things.',
    'Air and water are essential resources with properties we can observe and investigate.',
    'Why are air and water so important?')
  RETURNING id INTO v_unit;

  -- Chapter 4 — Properties of Air
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 4, 'Properties of Air', 'properties-of-air',
    'Investigate what air is and explore its properties.',
    '[
      {"type": "heading", "content": "Properties of Air", "level": 1},
      {"type": "text", "content": "Air is all around us, but we cannot see it. Even though air is invisible, it is real. Air takes up space, has weight, and can push on things."},
      {"type": "heading", "content": "Air Takes Up Space", "level": 2},
      {"type": "text", "content": "Blow up a balloon and you can see that air takes up space inside it. A tire is full of air. A beach ball is full of air. Air fills up any space it can."},
      {"type": "heading", "content": "Air Can Push", "level": 2},
      {"type": "text", "content": "Moving air is called wind. Wind can push leaves, fly kites, and even move sailboats. Strong wind can blow down trees and damage buildings."},
      {"type": "callout", "content": "Air is a gas. You cannot see it, but you can feel it when the wind blows!", "style": "info"},
      {"type": "heading", "content": "Air Is Needed for Life", "level": 2},
      {"type": "text", "content": "All animals (including humans) need air to breathe. We breathe in oxygen from the air. Plants need a gas in the air called carbon dioxide to make food."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What proves that air takes up space?", "options": ["You can see air", "A balloon gets bigger when you blow it up", "Air has a colour", "You can taste air"], "correct": 1, "explanation": "When you blow up a balloon, the air inside pushes the balloon outward, showing that air takes up space."},
      {"type": "quiz", "question": "What gas do animals breathe in?", "options": ["Carbon dioxide", "Nitrogen", "Oxygen", "Helium"], "correct": 2, "explanation": "Animals breathe in oxygen from the air."}
    ]'::jsonb,
    '[{"term": "Air", "definition": "The invisible mixture of gases that surrounds Earth"},
      {"term": "Wind", "definition": "Moving air"},
      {"term": "Oxygen", "definition": "The gas in air that animals need to breathe"},
      {"term": "Carbon dioxide", "definition": "The gas in air that plants use to make food"}]'::jsonb,
    'Wind is an important force in Indigenous culture and knowledge. Wind direction and strength helped predict weather and guided travel. The wind is respected as a powerful part of the natural world.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'AW2.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is air?', 'An invisible mixture of gases that surrounds Earth.', 'You cannot see it but you can feel it.', 1, 0),
    (v_tenant, v_ch, 'What is wind?', 'Moving air.', 'It blows leaves and flies kites.', 1, 1),
    (v_tenant, v_ch, 'What gas do plants need from the air?', 'Carbon dioxide.', 'Plants use it to make food.', 1, 2);


  -- Chapter 5 — Properties of Water
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 5, 'Properties of Water', 'properties-of-water',
    'Investigate the properties of water in its three states of matter.',
    '[
      {"type": "heading", "content": "Properties of Water", "level": 1},
      {"type": "text", "content": "Water is one of the most important substances on Earth. It exists in three forms called states of matter: liquid, solid, and gas."},
      {"type": "heading", "content": "Three States of Water", "level": 2},
      {"type": "text", "content": "Liquid water: flows and takes the shape of its container. This is what comes out of your tap.\n\nSolid water: frozen water is called ice. It holds its own shape and is cold and hard.\n\nGas water: when water is heated, it turns into water vapour (steam). This is an invisible gas in the air."},
      {"type": "callout", "content": "The same water can change states. Ice melts into liquid water. Liquid water can evaporate into water vapour. Water vapour can condense back into liquid.", "style": "info"},
      {"type": "heading", "content": "The Water Cycle", "level": 2},
      {"type": "text", "content": "Water moves through a cycle:\n1. The sun heats water in lakes and oceans (evaporation)\n2. Water vapour rises into the sky and cools into clouds (condensation)\n3. Water falls back to Earth as rain or snow (precipitation)\n4. Water flows into rivers and lakes, and the cycle starts again"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is ice?", "options": ["Liquid water", "Water as a gas", "Solid water", "Warm water"], "correct": 2, "explanation": "Ice is water in its solid state. It is frozen and hard."},
      {"type": "quiz", "question": "What is evaporation?", "options": ["Water freezing into ice", "Water turning into vapour from heat", "Rain falling from clouds", "Water flowing in a river"], "correct": 1, "explanation": "Evaporation happens when heat turns liquid water into water vapour (gas)."}
    ]'::jsonb,
    '[{"term": "State of matter", "definition": "The form a substance takes: solid, liquid, or gas"},
      {"term": "Evaporation", "definition": "When liquid water turns into water vapour (gas) from heat"},
      {"term": "Condensation", "definition": "When water vapour cools and turns back into liquid water"},
      {"term": "Precipitation", "definition": "Water that falls from clouds as rain, snow, sleet, or hail"},
      {"term": "Water cycle", "definition": "The continuous movement of water through evaporation, condensation, and precipitation"}]'::jsonb,
    'Water holds deep spiritual significance for Indigenous peoples. Water is seen as a living entity that sustains all life. Water ceremonies led by Water Walkers and Water Keepers raise awareness about protecting clean water sources.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'AW2.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'AW2.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Name the three states of water.', 'Liquid, solid (ice), and gas (water vapour).', 'Think: flowing, frozen, invisible.', 1, 0),
    (v_tenant, v_ch, 'What is evaporation?', 'When liquid water turns into water vapour from heat.', 'The sun heats a puddle and it disappears.', 1, 1),
    (v_tenant, v_ch, 'What is the water cycle?', 'The continuous movement of water through evaporation, condensation, and precipitation.', 'Water goes up, forms clouds, and falls back down.', 1, 2);


  -- ========================================================================
  -- UNIT 3: Physical Science — Liquids and Solids (LS2.1, LS2.2)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Liquids and Solids',
    'Investigate properties of familiar liquids and solids and how they interact.',
    'Liquids and solids have different properties and interact in useful ways.',
    'How are liquids and solids different, and how do they work together?')
  RETURNING id INTO v_unit;

  -- Chapter 6 — Exploring Solids and Liquids
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 6, 'Exploring Solids and Liquids', 'exploring-solids-liquids',
    'Investigate properties of familiar solids and liquids.',
    '[
      {"type": "heading", "content": "Exploring Solids and Liquids", "level": 1},
      {"type": "text", "content": "Everything around us is either a solid, a liquid, or a gas. In this chapter, we will look closely at solids and liquids and how they are different."},
      {"type": "heading", "content": "Properties of Solids", "level": 2},
      {"type": "text", "content": "Solids keep their own shape. A block stays a block no matter what container you put it in. Solids can be:\n- Hard (like a rock) or soft (like a pillow)\n- Rough (like sandpaper) or smooth (like glass)\n- Heavy (like a brick) or light (like a feather)"},
      {"type": "heading", "content": "Properties of Liquids", "level": 2},
      {"type": "text", "content": "Liquids flow and take the shape of their container. Pour water into a cup and it becomes cup-shaped. Liquids can be:\n- Thick (like syrup) or thin (like water)\n- Clear (like water) or coloured (like juice)\n- Sticky (like honey) or slippery (like oil)"},
      {"type": "callout", "content": "The thickness of a liquid is called viscosity. Honey has high viscosity (thick). Water has low viscosity (thin).", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What happens when you pour water into a bowl?", "options": ["It stays in a ball shape", "It takes the shape of the bowl", "It becomes a solid", "It disappears"], "correct": 1, "explanation": "Liquids flow and take the shape of whatever container they are in."},
      {"type": "quiz", "question": "Which liquid has high viscosity?", "options": ["Water", "Juice", "Honey", "Milk"], "correct": 2, "explanation": "Honey is thick and flows slowly, so it has high viscosity."}
    ]'::jsonb,
    '[{"term": "Solid", "definition": "A state of matter that keeps its own shape"},
      {"term": "Liquid", "definition": "A state of matter that flows and takes the shape of its container"},
      {"term": "Viscosity", "definition": "How thick or thin a liquid is; how easily it flows"},
      {"term": "Flow", "definition": "To move smoothly like a liquid"}]'::jsonb,
    'Indigenous peoples worked with both solids and liquids in daily life. Maple sap (a thin liquid) was boiled down into thick syrup and sugar. Understanding how liquids change when heated was important traditional knowledge.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'LS2.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a solid?', 'A state of matter that keeps its own shape.', 'A rock, a chair, a book.', 1, 0),
    (v_tenant, v_ch, 'What is a liquid?', 'A state of matter that flows and takes the shape of its container.', 'Water, juice, milk.', 1, 1),
    (v_tenant, v_ch, 'What is viscosity?', 'How thick or thin a liquid is.', 'Honey is thick, water is thin.', 1, 2);


  -- Chapter 7 — How Liquids and Solids Interact
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 7, 'How Liquids and Solids Interact', 'liquids-solids-interact',
    'Investigate what happens when liquids and solids are combined.',
    '[
      {"type": "heading", "content": "How Liquids and Solids Interact", "level": 1},
      {"type": "text", "content": "When we put liquids and solids together, interesting things can happen. Some solids dissolve in liquids. Some float. Some absorb the liquid. Some do not change at all."},
      {"type": "heading", "content": "Dissolving", "level": 2},
      {"type": "text", "content": "When a solid dissolves, it seems to disappear into the liquid. Stir sugar into water and the sugar dissolves — you cannot see it anymore, but you can taste the sweetness! Salt also dissolves in water."},
      {"type": "heading", "content": "Floating and Sinking", "level": 2},
      {"type": "text", "content": "Some solids float on liquids and some sink:\n- A piece of wood floats on water\n- A rock sinks in water\n- An ice cube floats on water\n- A coin sinks in water"},
      {"type": "heading", "content": "Absorbing", "level": 2},
      {"type": "text", "content": "Some solids soak up liquids. A sponge absorbs water. A paper towel absorbs a spill. This is called absorption."},
      {"type": "callout", "content": "Whether something floats or sinks depends on its density compared to the liquid.", "style": "tip"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What happens when you stir sugar into water?", "options": ["It floats", "It sinks and stays", "It dissolves", "It gets bigger"], "correct": 2, "explanation": "Sugar dissolves in water. It mixes in so you cannot see it."},
      {"type": "quiz", "question": "Which object would float on water?", "options": ["A rock", "A coin", "A piece of wood", "A marble"], "correct": 2, "explanation": "Wood is less dense than water, so it floats."}
    ]'::jsonb,
    '[{"term": "Dissolve", "definition": "When a solid mixes completely into a liquid so you cannot see it anymore"},
      {"term": "Absorb", "definition": "To soak up a liquid, like a sponge soaking up water"},
      {"term": "Float", "definition": "To stay on top of a liquid instead of sinking"},
      {"term": "Sink", "definition": "To go down to the bottom of a liquid"},
      {"term": "Density", "definition": "How heavy something is for its size"}]'::jsonb,
    'Understanding how solids and liquids interact was essential for Indigenous survival. Knowing which materials absorb water helped in building shelters. Understanding how to extract plant medicines by dissolving them in water or fat was important healing knowledge.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'LS2.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does dissolve mean?', 'When a solid mixes completely into a liquid so you cannot see it.', 'Sugar in water.', 1, 0),
    (v_tenant, v_ch, 'What does absorb mean?', 'To soak up a liquid.', 'A sponge does this.', 1, 1),
    (v_tenant, v_ch, 'Does wood float or sink?', 'Float.', 'It is less dense than water.', 1, 2);


  -- ========================================================================
  -- UNIT 4: Physical Science — Motion and Position (MP2.1, MP2.2)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Motion and Position',
    'Analyze methods of determining position and investigate factors that affect the motion of objects.',
    'We can describe the position and motion of objects and understand what affects how they move.',
    'How do we describe where things are and what makes them move?')
  RETURNING id INTO v_unit;

  -- Chapter 8 — Position and Direction
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 8, 'Position and Direction', 'position-and-direction',
    'Describe the position of objects relative to other objects.',
    '[
      {"type": "heading", "content": "Position and Direction", "level": 1},
      {"type": "text", "content": "To describe where something is, we compare it to other objects. We use position words like above, below, beside, between, in front of, and behind."},
      {"type": "heading", "content": "Position Words", "level": 2},
      {"type": "text", "content": "Common position words:\n- Above / Below: The bird is above the dog. The cat is below the table.\n- In front of / Behind: The car is in front of the house. The tree is behind the fence.\n- Beside / Between: The cup is beside the plate. The chair is between the desk and the wall.\n- Near / Far: The school is near the park. The mountains are far away."},
      {"type": "heading", "content": "Direction Words", "level": 2},
      {"type": "text", "content": "We use direction words to describe how things move:\n- Up and down\n- Left and right\n- Forward and backward\n- Toward and away from"},
      {"type": "callout", "content": "An object''s position always depends on what you compare it to. The book is on top of the desk, but below the shelf!", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "The ball is under the chair. Which position word describes where it is?", "options": ["Above", "Below", "Beside", "In front of"], "correct": 1, "explanation": "Under and below mean the same thing. The ball is below (under) the chair."},
      {"type": "quiz", "question": "If you walk toward the school, you are moving:", "options": ["Away from the school", "Closer to the school", "Below the school", "Above the school"], "correct": 1, "explanation": "Toward means moving closer to something."}
    ]'::jsonb,
    '[{"term": "Position", "definition": "Where an object is located compared to other objects"},
      {"term": "Direction", "definition": "The way something is moving or facing"},
      {"term": "Relative", "definition": "Compared to something else"}]'::jsonb,
    'Indigenous wayfinding uses natural landmarks (hills, rivers, stars) to describe position and give directions. Rather than using maps, traditional navigation relies on knowledge of the land and sky passed down through oral tradition.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'MP2.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is position?', 'Where an object is located compared to other objects.', 'Above, below, beside.', 1, 0),
    (v_tenant, v_ch, 'Name four position words.', 'Above, below, beside, between (also near, far, in front, behind).', 'Words that describe where something is.', 1, 1),
    (v_tenant, v_ch, 'What is direction?', 'The way something is moving or facing.', 'Up, down, left, right.', 1, 2);


  -- Chapter 9 — Forces and Motion
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 9, 'Forces and Motion', 'forces-and-motion-2',
    'Investigate factors including friction that affect how objects move.',
    '[
      {"type": "heading", "content": "Forces and Motion", "level": 1},
      {"type": "text", "content": "Motion is when something changes its position. A ball rolling across the floor is in motion. Things start moving when a force (push or pull) acts on them. Things stop moving because of forces too."},
      {"type": "heading", "content": "What Affects Motion?", "level": 2},
      {"type": "text", "content": "Several things affect how an object moves:\n- Size of the force: A harder push makes a ball go faster and farther\n- Surface: A ball rolls easily on a smooth floor but slowly on carpet\n- Weight: A heavier object is harder to push than a lighter one\n- Shape: Round objects roll more easily than flat ones"},
      {"type": "heading", "content": "Friction", "level": 2},
      {"type": "text", "content": "Friction is a force that slows things down. When two surfaces rub together, friction occurs. Rough surfaces have more friction. Smooth surfaces have less friction.\n\nFriction examples:\n- Your shoes grip the floor so you do not slip\n- Brakes on a bicycle use friction to slow down\n- Rubbing your hands together makes heat from friction"},
      {"type": "callout", "content": "Friction can be helpful (shoes gripping) or unhelpful (making it hard to push something). It depends on the situation!", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is friction?", "options": ["A push forward", "A force that slows things down when surfaces rub", "A pull upward", "A kind of liquid"], "correct": 1, "explanation": "Friction is a force created when surfaces rub together that slows motion."},
      {"type": "quiz", "question": "On which surface would a ball roll the farthest?", "options": ["Carpet", "Sand", "Smooth tile", "Grass"], "correct": 2, "explanation": "Smooth tile has the least friction, so the ball can roll the farthest."}
    ]'::jsonb,
    '[{"term": "Motion", "definition": "When something changes its position or location"},
      {"term": "Friction", "definition": "A force that slows things down when two surfaces rub together"},
      {"term": "Surface", "definition": "The outside or top layer of something"},
      {"term": "Speed", "definition": "How fast something is moving"}]'::jsonb,
    'Toboggan design by Indigenous peoples shows understanding of friction. The smooth, curved bottom of a toboggan reduces friction on snow, allowing fast travel over winter landscapes. This is applied physics knowledge developed over thousands of years.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'MP2.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is friction?', 'A force that slows things down when two surfaces rub together.', 'Rub your hands together and feel it.', 1, 0),
    (v_tenant, v_ch, 'Does a rough surface have more or less friction?', 'More friction.', 'Carpet vs. smooth tile.', 1, 1),
    (v_tenant, v_ch, 'What happens when you push something harder?', 'It moves faster and farther.', 'More force = more motion.', 1, 2);

  RAISE NOTICE 'Grade 2 Science content seeded successfully.';
END $$;


-- ============================================================================
-- GRADE 3 — WolfWhale Science 3
-- Outcomes: PL3.1, PL3.2, SM3.1, SM3.2, ME3.1, ME3.2, ES3.1, ES3.2
-- ============================================================================
DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_oc     UUID;
BEGIN
  SELECT id INTO v_book FROM textbooks
    WHERE tenant_id = v_tenant AND slug = 'wolfwhale-science-3';

  -- ========================================================================
  -- UNIT 1: Life Science — Plant Growth and Changes (PL3.1, PL3.2)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Plant Growth and Changes',
    'Investigate the growth and development of plants and the interdependence among plants, individuals, society, and the environment.',
    'Plants grow and develop in response to their environment, and all living things depend on plants.',
    'Why are plants so important to life on Earth?')
  RETURNING id INTO v_unit;

  -- Chapter 1 — How Plants Grow
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 1, 'How Plants Grow', 'how-plants-grow',
    'Investigate conditions needed for seed germination and plant growth.',
    '[
      {"type": "heading", "content": "How Plants Grow", "level": 1},
      {"type": "text", "content": "Most plants start their lives as seeds. When a seed has the right conditions, it begins to grow. This process is called germination."},
      {"type": "heading", "content": "What Seeds Need to Germinate", "level": 2},
      {"type": "text", "content": "For a seed to germinate, it needs:\n- Water: to soften the seed coat and start growth\n- Warmth: most seeds need warm temperatures\n- Air: seeds need oxygen to begin growing\n\nSeeds do NOT need light or soil to germinate. But once the plant starts growing, it will need light and nutrients from soil."},
      {"type": "heading", "content": "Parts of a Seed", "level": 2},
      {"type": "text", "content": "Inside every seed is a tiny baby plant (embryo) and stored food to help it start growing. The seed coat protects the seed until conditions are right."},
      {"type": "callout", "content": "You can watch germination happen! Place a bean seed in a wet paper towel inside a plastic bag. In a few days, you will see the root and stem begin to grow.", "style": "tip"},
      {"type": "heading", "content": "Growing Conditions", "level": 2},
      {"type": "text", "content": "Once a plant begins growing, it needs:\n- Sunlight for making food (photosynthesis)\n- Water from the soil\n- Nutrients from the soil\n- Carbon dioxide from the air\n- Space to spread its roots and leaves"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is germination?", "options": ["When a plant dies", "When a seed begins to grow", "When leaves change colour", "When fruit falls from a tree"], "correct": 1, "explanation": "Germination is the process of a seed beginning to grow into a new plant."},
      {"type": "quiz", "question": "Which of these does a seed NOT need to germinate?", "options": ["Water", "Warmth", "Light", "Air"], "correct": 2, "explanation": "Seeds do not need light to germinate. They need water, warmth, and air."}
    ]'::jsonb,
    '[{"term": "Germination", "definition": "The process of a seed beginning to grow into a new plant"},
      {"term": "Seed coat", "definition": "The protective outer covering of a seed"},
      {"term": "Embryo", "definition": "The tiny baby plant inside a seed"},
      {"term": "Photosynthesis", "definition": "The process plants use to make food from sunlight, water, and carbon dioxide"},
      {"term": "Nutrient", "definition": "A substance that living things need to grow and stay healthy"}]'::jsonb,
    'Indigenous peoples have been planting and tending gardens for thousands of years. The Three Sisters method of planting corn, beans, and squash together shows deep understanding of how plants help each other grow.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'PL3.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is germination?', 'The process of a seed beginning to grow into a new plant.', 'The seed sprouts!', 1, 0),
    (v_tenant, v_ch, 'What three things does a seed need to germinate?', 'Water, warmth, and air.', 'Not light or soil yet.', 1, 1),
    (v_tenant, v_ch, 'What is photosynthesis?', 'The process plants use to make food from sunlight, water, and carbon dioxide.', 'How plants feed themselves.', 1, 2),
    (v_tenant, v_ch, 'What are the Three Sisters?', 'Corn, beans, and squash — planted together in Indigenous agriculture.', 'Three plants that help each other grow.', 1, 3);


  -- Chapter 2 — Plants and People
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 2, 'Plants and People', 'plants-and-people',
    'Analyze the interdependence among plants, individuals, society, and the environment.',
    '[
      {"type": "heading", "content": "Plants and People", "level": 1},
      {"type": "text", "content": "People depend on plants in many ways, and our actions affect plants too. Plants are one of the most important groups of living things on Earth."},
      {"type": "heading", "content": "How People Use Plants", "level": 2},
      {"type": "text", "content": "People use plants for:\n- Food: fruits, vegetables, grains, nuts\n- Medicine: many medicines come from plants\n- Building materials: wood for houses and furniture\n- Clothing: cotton for shirts, linen from flax\n- Paper: made from wood pulp\n- Oxygen: plants release the oxygen we breathe"},
      {"type": "heading", "content": "How People Affect Plants", "level": 2},
      {"type": "text", "content": "Human actions can help or harm plants:\n- Helpful: planting gardens, protecting forests, composting\n- Harmful: cutting down forests, polluting water, paving over soil\n\nWhen we damage plant habitats, it affects all living things that depend on those plants."},
      {"type": "callout", "content": "Plants produce the oxygen we breathe. Without plants, animals (including humans) could not survive.", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Which gas do plants release that humans need?", "options": ["Carbon dioxide", "Nitrogen", "Oxygen", "Helium"], "correct": 2, "explanation": "Plants release oxygen during photosynthesis. Humans need oxygen to breathe."},
      {"type": "quiz", "question": "Which human action is harmful to plants?", "options": ["Planting a garden", "Cutting down forests", "Composting", "Watering flowers"], "correct": 1, "explanation": "Cutting down forests destroys plant habitats and affects all living things."}
    ]'::jsonb,
    '[{"term": "Interdependence", "definition": "When living things depend on each other"},
      {"term": "Habitat", "definition": "The natural home of a plant or animal"},
      {"term": "Compost", "definition": "Decaying plant material used to enrich soil"},
      {"term": "Deforestation", "definition": "Cutting down large areas of forest"}]'::jsonb,
    'First Nations and Metis peoples have practiced sustainable plant use for millennia. Protocols around harvesting plants include taking only what is needed, offering tobacco as thanks, and leaving enough for regrowth. These practices maintain ecological balance.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'PL3.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Name three ways people use plants.', 'Food, medicine, and building materials (also clothing, paper, oxygen).', 'Think about what comes from plants.', 1, 0),
    (v_tenant, v_ch, 'What is deforestation?', 'Cutting down large areas of forest.', 'Destroying plant habitats.', 1, 1),
    (v_tenant, v_ch, 'What gas do plants produce that we breathe?', 'Oxygen.', 'We need it to survive!', 1, 2);


  -- ========================================================================
  -- UNIT 2: Physical Science — Materials and Structures (SM3.1, SM3.2)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Materials and Structures',
    'Investigate properties of materials and methods of joinery, and assess the function of strong, stable, and balanced structures.',
    'Strong structures use materials and joining methods that make them stable and balanced.',
    'What makes a structure strong and stable?')
  RETURNING id INTO v_unit;

  -- Chapter 3 — Properties of Building Materials
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 3, 'Properties of Building Materials', 'properties-building-materials',
    'Investigate properties of materials used in structures and methods of joining them.',
    '[
      {"type": "heading", "content": "Properties of Building Materials", "level": 1},
      {"type": "text", "content": "When people build structures, they choose materials with the right properties. A bridge needs strong materials. A tent needs flexible, waterproof materials. Choosing the right material is important!"},
      {"type": "heading", "content": "Material Properties for Building", "level": 2},
      {"type": "text", "content": "Important material properties include:\n- Strength: Can it hold weight without breaking?\n- Flexibility: Can it bend without snapping?\n- Hardness: Can it resist scratching or denting?\n- Waterproof: Does it keep water out?\n- Weight: Is it light enough to use?"},
      {"type": "heading", "content": "Joining Materials Together", "level": 2},
      {"type": "text", "content": "Materials can be joined in different ways:\n- Glue: sticks materials together (paper, wood)\n- Nails and screws: hold wood pieces together\n- Tape: quick way to join light materials\n- Tying: using string, rope, or wire\n- Interlocking: pieces fit together like puzzle pieces or LEGO"},
      {"type": "callout", "content": "The method of joining you choose depends on the materials and how strong the joint needs to be.", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Why would you use a waterproof material for a roof?", "options": ["To make it pretty", "To keep rain out", "To make it heavy", "To make it shine"], "correct": 1, "explanation": "A waterproof roof keeps rain from getting inside the building."},
      {"type": "quiz", "question": "Which joining method would be strongest for building a wooden bookshelf?", "options": ["Tape", "Glue only", "Screws", "String"], "correct": 2, "explanation": "Screws provide a strong connection for wood and can hold the weight of books."}
    ]'::jsonb,
    '[{"term": "Structure", "definition": "Something that is built or constructed to hold weight or serve a purpose"},
      {"term": "Joinery", "definition": "The method of connecting or joining materials together"},
      {"term": "Waterproof", "definition": "Able to keep water from getting through"},
      {"term": "Interlock", "definition": "To fit together by overlapping or connecting like puzzle pieces"}]'::jsonb,
    'The tipi is an excellent example of Indigenous engineering. It uses flexible poles tied together at the top, with strong animal-hide covering. The design is portable, stable in wind, and sheds rain. Every part serves a purpose.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SM3.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a structure?', 'Something built to hold weight or serve a purpose.', 'A bridge, a building, a table.', 1, 0),
    (v_tenant, v_ch, 'Name three ways to join materials.', 'Glue, nails/screws, and tying.', 'How you connect things together.', 1, 1),
    (v_tenant, v_ch, 'Why is the tipi a good structure?', 'It is portable, stable in wind, and sheds rain.', 'Indigenous engineering.', 1, 2);


  -- Chapter 4 — Strong, Stable, and Balanced Structures
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 4, 'Strong, Stable, and Balanced Structures', 'strong-stable-balanced',
    'Assess characteristics that make structures strong, stable, and balanced.',
    '[
      {"type": "heading", "content": "Strong, Stable, and Balanced Structures", "level": 1},
      {"type": "text", "content": "A good structure needs to be strong enough to hold weight, stable enough not to fall over, and balanced so it does not tip. Engineers think about all three when they design buildings, bridges, and other structures."},
      {"type": "heading", "content": "What Makes a Structure Strong?", "level": 2},
      {"type": "text", "content": "Structures are stronger when they:\n- Use strong materials (steel, stone, thick wood)\n- Use triangular shapes (triangles are the strongest shape)\n- Have thick or wide supports\n- Spread weight evenly across the structure"},
      {"type": "heading", "content": "What Makes a Structure Stable?", "level": 2},
      {"type": "text", "content": "A stable structure does not fall over easily. Structures are more stable when they:\n- Have a wide base\n- Are lower to the ground\n- Are heavier at the bottom than the top\n- Are symmetrical (the same on both sides)"},
      {"type": "heading", "content": "Balance", "level": 2},
      {"type": "text", "content": "A balanced structure has its weight spread evenly. If you stack blocks and put too many on one side, the tower tips over. Spreading the weight evenly keeps it balanced."},
      {"type": "callout", "content": "Triangles are the strongest shape in building. That is why you see them in bridges, roof trusses, and towers.", "style": "tip"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is the strongest shape for building?", "options": ["Circle", "Square", "Triangle", "Rectangle"], "correct": 2, "explanation": "Triangles are the strongest shape because they distribute force evenly along their sides."},
      {"type": "quiz", "question": "What makes a structure more stable?", "options": ["A narrow base", "Being tall and thin", "A wide base", "Being lopsided"], "correct": 2, "explanation": "A wide base makes a structure more stable because it resists tipping."}
    ]'::jsonb,
    '[{"term": "Stable", "definition": "Not easily tipped over or knocked down"},
      {"term": "Balanced", "definition": "Having weight spread evenly so it does not tip"},
      {"term": "Base", "definition": "The bottom part of a structure that supports everything above it"},
      {"term": "Symmetrical", "definition": "The same on both sides"},
      {"term": "Truss", "definition": "A framework of triangles used to make structures strong"}]'::jsonb,
    'Natural structures built by animals also show strength and stability. Beaver dams and lodges are engineered with interlocking logs and mud. Indigenous peoples observed these natural structures and applied similar principles in their own building.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SM3.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the strongest shape for building?', 'A triangle.', 'Look at bridges and roof trusses.', 1, 0),
    (v_tenant, v_ch, 'What makes a structure stable?', 'A wide base, being low to the ground, and having weight at the bottom.', 'Think about what prevents tipping.', 1, 1),
    (v_tenant, v_ch, 'What does balanced mean for a structure?', 'Having weight spread evenly so it does not tip.', 'Even on both sides.', 1, 2);


  -- ========================================================================
  -- UNIT 3: Physical Science — Magnetism and Static Electricity (ME3.1, ME3.2)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Magnetism and Static Electricity',
    'Investigate characteristics of contact and non-contact forces including magnetic and static electric forces.',
    'Magnets and static electricity are non-contact forces that can push or pull objects without touching them.',
    'How can magnets and static electricity move things without touching them?')
  RETURNING id INTO v_unit;

  -- Chapter 5 — Exploring Magnets
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 5, 'Exploring Magnets', 'exploring-magnets',
    'Investigate properties of magnets and magnetic forces.',
    '[
      {"type": "heading", "content": "Exploring Magnets", "level": 1},
      {"type": "text", "content": "A magnet is an object that can attract (pull toward) certain metals. Magnets can pull objects without even touching them! This invisible pull is called magnetic force."},
      {"type": "heading", "content": "What Do Magnets Attract?", "level": 2},
      {"type": "text", "content": "Magnets attract objects made of iron, steel, nickel, and cobalt. Magnets do NOT attract wood, plastic, glass, paper, or aluminum.\n\nTry this: Hold a magnet near a paper clip (steel) and it sticks. Hold it near a wooden pencil and nothing happens."},
      {"type": "heading", "content": "Magnetic Poles", "level": 2},
      {"type": "text", "content": "Every magnet has two ends called poles: a north pole (N) and a south pole (S).\n- Opposite poles attract: N and S pull toward each other\n- Like poles repel: N and N push away, S and S push away"},
      {"type": "callout", "content": "Magnets can push AND pull. Opposite poles attract (pull together). Same poles repel (push apart).", "style": "info"},
      {"type": "heading", "content": "Uses of Magnets", "level": 2},
      {"type": "text", "content": "Magnets are used in many everyday objects:\n- Refrigerator magnets hold papers on the fridge\n- Compasses use magnets to find direction\n- Speakers and headphones use magnets to make sound\n- MRI machines in hospitals use powerful magnets"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Which material would a magnet attract?", "options": ["Wood", "Plastic", "Steel paper clip", "Glass"], "correct": 2, "explanation": "Steel is a magnetic material. Magnets attract iron, steel, nickel, and cobalt."},
      {"type": "quiz", "question": "What happens when you put two north poles together?", "options": ["They attract", "They repel (push apart)", "Nothing happens", "They stick together"], "correct": 1, "explanation": "Like poles repel. Two north poles push away from each other."}
    ]'::jsonb,
    '[{"term": "Magnet", "definition": "An object that attracts certain metals like iron and steel"},
      {"term": "Magnetic force", "definition": "The invisible push or pull from a magnet"},
      {"term": "Attract", "definition": "To pull toward"},
      {"term": "Repel", "definition": "To push away"},
      {"term": "Poles", "definition": "The two ends of a magnet: north (N) and south (S)"}]'::jsonb,
    'Lodestone is a naturally magnetic rock that was known to many ancient cultures. Indigenous peoples observed that certain rocks had special pulling power. The discovery of magnetic materials is a shared human story across many cultures.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'ME3.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What materials do magnets attract?', 'Iron, steel, nickel, and cobalt.', 'Not wood, plastic, or glass.', 1, 0),
    (v_tenant, v_ch, 'What are the two poles of a magnet?', 'North (N) and South (S).', 'Every magnet has two ends.', 1, 1),
    (v_tenant, v_ch, 'What happens when opposite poles meet?', 'They attract (pull together).', 'N and S stick together.', 1, 2),
    (v_tenant, v_ch, 'What happens when like poles meet?', 'They repel (push apart).', 'N and N push away.', 1, 3);


  -- Chapter 6 — Static Electricity
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 6, 'Static Electricity', 'static-electricity-3',
    'Investigate static electric forces and their effects on objects.',
    '[
      {"type": "heading", "content": "Static Electricity", "level": 1},
      {"type": "text", "content": "Have you ever rubbed a balloon on your hair and watched your hair stand up? That is static electricity! Static electricity is a force that can attract or repel objects, just like magnetism."},
      {"type": "heading", "content": "How Static Electricity Works", "level": 2},
      {"type": "text", "content": "Everything is made of tiny particles. Some of these particles have an electric charge. When you rub two objects together, charges can move from one object to the other. This creates static electricity.\n\nExamples:\n- Rubbing a balloon on your hair\n- Shuffling your feet on carpet and touching a doorknob (zap!)\n- Pulling clothes from the dryer and they stick together"},
      {"type": "heading", "content": "Contact and Non-Contact Forces", "level": 2},
      {"type": "text", "content": "Forces can be divided into two types:\n- Contact forces: require touching (push, pull, friction)\n- Non-contact forces: work without touching (magnetic force, static electricity, gravity)\n\nStatic electricity and magnetism are both non-contact forces because they can act at a distance."},
      {"type": "callout", "content": "Lightning is a huge spark of static electricity! Electric charges build up in clouds and then release as a bolt of lightning.", "style": "tip"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What creates static electricity?", "options": ["Mixing water and oil", "Rubbing two objects together", "Heating something up", "Freezing water"], "correct": 1, "explanation": "Rubbing two objects together transfers electric charges, creating static electricity."},
      {"type": "quiz", "question": "Is static electricity a contact or non-contact force?", "options": ["Contact", "Non-contact", "Both", "Neither"], "correct": 1, "explanation": "Static electricity is a non-contact force because it can attract or repel objects without touching them."}
    ]'::jsonb,
    '[{"term": "Static electricity", "definition": "A buildup of electric charges on the surface of an object"},
      {"term": "Electric charge", "definition": "A property of tiny particles that causes them to attract or repel each other"},
      {"term": "Contact force", "definition": "A force that requires objects to touch, like pushing or pulling"},
      {"term": "Non-contact force", "definition": "A force that acts without objects touching, like magnetism or gravity"}]'::jsonb,
    'Lightning has significance in many Indigenous cultures. Thunder and lightning are often connected to powerful spiritual beings. The Thunderbird is a figure in many First Nations stories, representing the power of storms and the electricity in nature.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'ME3.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'ME3.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is static electricity?', 'A buildup of electric charges on the surface of an object.', 'Rub a balloon on your hair!', 1, 0),
    (v_tenant, v_ch, 'Is gravity a contact or non-contact force?', 'Non-contact. It pulls objects toward Earth without touching.', 'Things fall without being pushed.', 1, 1),
    (v_tenant, v_ch, 'What is lightning?', 'A huge spark of static electricity released from clouds.', 'A very powerful electrical discharge.', 1, 2);


  -- ========================================================================
  -- UNIT 4: Earth and Space Science — Exploring Soils (ES3.1, ES3.2)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Exploring Soils',
    'Investigate characteristics of different types of soils and analyze the interdependence between soil and living things.',
    'Soil is a vital natural resource with different types and properties, and all living things depend on healthy soil.',
    'Why is soil so important, and how can we take care of it?')
  RETURNING id INTO v_unit;

  -- Chapter 7 — Types of Soil
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 7, 'Types of Soil', 'types-of-soil',
    'Investigate characteristics of different types of soils including composition and water absorption.',
    '[
      {"type": "heading", "content": "Types of Soil", "level": 1},
      {"type": "text", "content": "Not all soil is the same. If you dig in different places, you will find different kinds of soil. Each type has its own colour, texture, and ability to hold water."},
      {"type": "heading", "content": "Three Main Types of Soil", "level": 2},
      {"type": "text", "content": "Sand: Large grains, feels gritty, water drains through it quickly. Plants have a hard time growing in pure sand because water does not stay.\n\nClay: Very tiny grains, feels smooth and sticky when wet. Water does not drain through easily. It can become very hard when dry.\n\nLoam: A mixture of sand, clay, and humus (dead plant material). This is the best soil for growing plants because it holds water but also drains well."},
      {"type": "heading", "content": "What Is in Soil?", "level": 2},
      {"type": "text", "content": "Soil is made of:\n- Tiny pieces of rock (sand, silt, clay)\n- Humus (decayed plants and animals)\n- Air spaces between the particles\n- Water held between particles\n- Living things (worms, insects, bacteria)"},
      {"type": "callout", "content": "Worms are important soil helpers! They tunnel through soil, making air spaces, and their waste (castings) adds nutrients.", "style": "tip"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Which type of soil is best for growing plants?", "options": ["Sand", "Clay", "Loam", "Gravel"], "correct": 2, "explanation": "Loam is a mixture of sand, clay, and humus that holds water well but also drains, making it ideal for plants."},
      {"type": "quiz", "question": "Which soil lets water drain through fastest?", "options": ["Clay", "Loam", "Sand", "Humus"], "correct": 2, "explanation": "Sand has large grains with big spaces between them, so water drains through quickly."}
    ]'::jsonb,
    '[{"term": "Sand", "definition": "Soil with large, gritty grains that drains water quickly"},
      {"term": "Clay", "definition": "Soil with very tiny, smooth grains that holds water tightly"},
      {"term": "Loam", "definition": "A mixture of sand, clay, and humus that is ideal for growing plants"},
      {"term": "Humus", "definition": "Dark, nutrient-rich material in soil made from decayed plants and animals"},
      {"term": "Composition", "definition": "What something is made of"}]'::jsonb,
    'Indigenous peoples have deep knowledge of soil types and which plants grow best in each. This knowledge guided where to set up camps, which areas were best for gathering plants, and how to care for the land to keep soil healthy.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'ES3.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Name the three main types of soil.', 'Sand, clay, and loam.', 'One is gritty, one is sticky, one is a mix.', 1, 0),
    (v_tenant, v_ch, 'What is humus?', 'Dark, nutrient-rich material made from decayed plants and animals.', 'It makes soil good for growing.', 1, 1),
    (v_tenant, v_ch, 'Which soil type is best for growing plants?', 'Loam.', 'A mixture of sand, clay, and humus.', 1, 2),
    (v_tenant, v_ch, 'Why are worms good for soil?', 'They make air spaces and add nutrients with their waste.', 'They tunnel through the soil.', 1, 3);


  -- Chapter 8 — Soil and Living Things
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 8, 'Soil and Living Things', 'soil-and-living-things',
    'Analyze the interdependence between soil and living things.',
    '[
      {"type": "heading", "content": "Soil and Living Things", "level": 1},
      {"type": "text", "content": "Soil is much more than dirt. It is a living system that supports nearly all life on Earth. Plants, animals, fungi, and tiny organisms all depend on soil."},
      {"type": "heading", "content": "How Living Things Depend on Soil", "level": 2},
      {"type": "text", "content": "Plants grow in soil and get water and nutrients from it. Animals eat plants that grow in soil. Many animals (worms, ants, moles, gophers) live in the soil. Even humans depend on soil because we grow our food in it."},
      {"type": "heading", "content": "How Living Things Help Soil", "level": 2},
      {"type": "text", "content": "Living things help soil too:\n- Dead plants and animals decompose and become humus\n- Worms and insects mix and aerate the soil\n- Plant roots hold soil in place and prevent erosion\n- Bacteria and fungi break down dead material into nutrients"},
      {"type": "heading", "content": "Taking Care of Soil", "level": 2},
      {"type": "text", "content": "We can protect soil by:\n- Composting food scraps instead of throwing them away\n- Planting trees and plants to prevent erosion\n- Avoiding chemicals that harm soil organisms\n- Rotating crops so soil does not lose all its nutrients"},
      {"type": "callout", "content": "It can take 500 to 1000 years for nature to create just 2.5 centimetres of topsoil. We must take care of our soil!", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is erosion?", "options": ["Soil getting wetter", "Soil being carried away by wind or water", "Soil getting darker", "Soil freezing"], "correct": 1, "explanation": "Erosion is when wind or water carries soil away from where it belongs."},
      {"type": "quiz", "question": "How long can it take to create 2.5 cm of topsoil?", "options": ["1 year", "10 years", "100 years", "500 to 1000 years"], "correct": 3, "explanation": "It can take 500 to 1000 years for nature to create just 2.5 cm of topsoil."}
    ]'::jsonb,
    '[{"term": "Decompose", "definition": "To break down into simpler materials; to rot"},
      {"term": "Erosion", "definition": "The process of soil being carried away by wind or water"},
      {"term": "Topsoil", "definition": "The top layer of soil, richest in nutrients and humus"},
      {"term": "Aerate", "definition": "To mix air into something, like when worms tunnel through soil"},
      {"term": "Crop rotation", "definition": "Planting different crops each year to keep soil healthy"}]'::jsonb,
    'Indigenous land management practices have protected soil for thousands of years. Controlled burns returned nutrients to the soil and prevented erosion. The concept of caring for the land for seven generations into the future reflects deep environmental responsibility.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'ES3.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is erosion?', 'The process of soil being carried away by wind or water.', 'Soil moves from where it should be.', 1, 0),
    (v_tenant, v_ch, 'What is topsoil?', 'The top layer of soil, richest in nutrients and humus.', 'The most important layer for growing plants.', 1, 1),
    (v_tenant, v_ch, 'How can we protect soil?', 'Composting, planting trees, avoiding harmful chemicals, and rotating crops.', 'Take care of the land.', 1, 2),
    (v_tenant, v_ch, 'What does decompose mean?', 'To break down into simpler materials; to rot.', 'Dead leaves decompose and become humus.', 1, 3);

  RAISE NOTICE 'Grade 3 Science content seeded successfully.';
END $$;
