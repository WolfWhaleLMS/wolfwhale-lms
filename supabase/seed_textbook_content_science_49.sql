-- ============================================================================
-- WolfWhale Textbook Content Seed: Science Grades 4-9
-- Saskatchewan WNCP Science
--
-- Populates: textbook_units, textbook_chapters, textbook_flashcards,
--            chapter_outcome_map
--
-- Each grade is wrapped in its own DO $$ block.
-- Depends on: seed_textbooks.sql, seed_curriculum_outcomes.sql
-- ============================================================================


-- ============================================================================
-- GRADE 4 — WolfWhale Science 4
-- Outcomes: HC4.1-HC4.3, LI4.1-LI4.3, SO4.1-SO4.3, RM4.1-RM4.3
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
    WHERE tenant_id = v_tenant AND slug = 'wolfwhale-science-4';

  -- ========================================================================
  -- UNIT 1: Life Science — Habitats and Communities (HC4.1-HC4.3)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Habitats and Communities',
    'Investigate the interdependence of plants and animals within habitats and communities, and assess effects of natural and human activities.',
    'Living things within a habitat form communities where they depend on each other to survive.',
    'How do living things in a habitat depend on each other?')
  RETURNING id INTO v_unit;

  -- Chapter 1 — Habitats
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 1, 'Habitats', 'habitats-4',
    'Investigate the interdependence of plants and animals within habitats.',
    '[
      {"type": "heading", "content": "Habitats", "level": 1},
      {"type": "text", "content": "A habitat is the natural home of a plant or animal. It provides everything a living thing needs: food, water, shelter, and space. Saskatchewan has many types of habitats, including grasslands, boreal forests, wetlands, and freshwater lakes."},
      {"type": "heading", "content": "Parts of a Habitat", "level": 2},
      {"type": "text", "content": "Every habitat has two types of parts:\n- Biotic factors: the living things (plants, animals, fungi, bacteria)\n- Abiotic factors: the non-living things (water, soil, sunlight, temperature, air)"},
      {"type": "heading", "content": "Saskatchewan Habitats", "level": 2},
      {"type": "text", "content": "Saskatchewan has distinct habitat regions:\n- Grasslands in the south: home to pronghorn, prairie dogs, and native grasses\n- Parkland in the central region: a mix of grassland and forest\n- Boreal forest in the north: dense spruce and pine, home to moose, bears, and wolves\n- Wetlands and lakes: found throughout, supporting fish, waterfowl, and aquatic plants"},
      {"type": "callout", "content": "A community is all the living things that share a habitat. In a pond community, you might find fish, frogs, insects, algae, and cattails.", "style": "info"},
      {"type": "heading", "content": "Food Chains and Food Webs", "level": 2},
      {"type": "text", "content": "Living things in a community are connected through food chains. Energy flows from the sun to producers (plants), then to consumers (animals).\n\nA simple food chain: Sun → Grass → Rabbit → Hawk\n\nWhen many food chains connect, they form a food web. Food webs show how energy flows through an entire community."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is a biotic factor?", "options": ["Water", "Sunlight", "A living thing like a plant or animal", "Temperature"], "correct": 2, "explanation": "Biotic means living. Biotic factors include plants, animals, fungi, and bacteria."},
      {"type": "quiz", "question": "In a food chain, what is a producer?", "options": ["An animal that eats plants", "A plant that makes its own food", "An animal that eats other animals", "A decomposer"], "correct": 1, "explanation": "Producers are plants that make their own food using sunlight through photosynthesis."}
    ]'::jsonb,
    '[{"term": "Habitat", "definition": "The natural home of a living thing that provides food, water, shelter, and space"},
      {"term": "Community", "definition": "All the living things that share a habitat"},
      {"term": "Biotic", "definition": "Living parts of an environment"},
      {"term": "Abiotic", "definition": "Non-living parts of an environment like water, soil, and sunlight"},
      {"term": "Food chain", "definition": "A sequence showing how energy passes from one living thing to another"},
      {"term": "Food web", "definition": "Many connected food chains showing energy flow in a community"}]'::jsonb,
    'Indigenous peoples understand habitats through generations of observation. Traditional Ecological Knowledge (TEK) recognizes that all living things are interconnected, and that healthy habitats require balance among all their members.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'HC4.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the difference between biotic and abiotic?', 'Biotic means living (plants, animals). Abiotic means non-living (water, sunlight, soil).', 'Bio = life.', 1, 0),
    (v_tenant, v_ch, 'What is a food chain?', 'A sequence showing how energy passes from one living thing to another.', 'Sun → plant → animal → predator.', 1, 1),
    (v_tenant, v_ch, 'Name two Saskatchewan habitats.', 'Grasslands and boreal forest (also parkland and wetlands).', 'South = grassland, north = boreal.', 1, 2),
    (v_tenant, v_ch, 'What is a producer?', 'A plant that makes its own food using sunlight.', 'The first living link in a food chain.', 1, 3);


  -- Chapter 2 — Adaptations
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 2, 'Adaptations', 'adaptations-4',
    'Analyze structures and behaviours that enable plants and animals to exist in various habitats.',
    '[
      {"type": "heading", "content": "Adaptations", "level": 1},
      {"type": "text", "content": "An adaptation is a special feature or behaviour that helps a living thing survive in its habitat. Over many generations, plants and animals develop adaptations that match their environment."},
      {"type": "heading", "content": "Structural Adaptations", "level": 2},
      {"type": "text", "content": "Structural adaptations are physical features:\n- Thick fur on Arctic foxes keeps them warm in winter\n- Cactus plants have thick stems that store water in dry deserts\n- Snowshoe hares have large feet to walk on top of snow\n- Fish have gills to breathe underwater\n- Birds of prey have sharp talons to catch food"},
      {"type": "heading", "content": "Behavioural Adaptations", "level": 2},
      {"type": "text", "content": "Behavioural adaptations are things animals do to survive:\n- Migration: Canada geese fly south for warmer winters\n- Hibernation: black bears sleep through cold winters\n- Camouflage: snowshoe hares turn white in winter to hide in snow\n- Burrowing: gophers dig underground homes for shelter"},
      {"type": "callout", "content": "Camouflage is when an animal blends in with its surroundings. This helps it hide from predators or sneak up on prey.", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is a structural adaptation?", "options": ["A behaviour an animal learns", "A physical feature that helps survival", "A type of food chain", "A habitat type"], "correct": 1, "explanation": "Structural adaptations are physical body features, like thick fur or sharp claws."},
      {"type": "quiz", "question": "Why do snowshoe hares turn white in winter?", "options": ["To stay cool", "To find food", "To blend in with the snow (camouflage)", "To attract a mate"], "correct": 2, "explanation": "Turning white is camouflage. It helps hares hide from predators in the snow."}
    ]'::jsonb,
    '[{"term": "Adaptation", "definition": "A feature or behaviour that helps a living thing survive in its habitat"},
      {"term": "Structural adaptation", "definition": "A physical body feature that helps survival"},
      {"term": "Behavioural adaptation", "definition": "An action or behaviour that helps an animal survive"},
      {"term": "Camouflage", "definition": "Colours or patterns that help an animal blend in with its surroundings"}]'::jsonb,
    'Indigenous hunters understood animal adaptations intimately. Knowing when and why animals migrated, hibernated, or changed appearance was essential knowledge for hunting, fishing, and predicting seasonal changes.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'HC4.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is an adaptation?', 'A feature or behaviour that helps a living thing survive.', 'Special abilities for survival.', 1, 0),
    (v_tenant, v_ch, 'What is camouflage?', 'Colours or patterns that help an animal blend in with its surroundings.', 'Hiding in plain sight.', 1, 1),
    (v_tenant, v_ch, 'Name two behavioural adaptations.', 'Migration and hibernation.', 'Moving or sleeping to survive winter.', 1, 2);


  -- Chapter 3 — Human Impact on Habitats
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 3, 'Human Impact on Habitats', 'human-impact-habitats',
    'Assess the effects of natural and human activities on habitats and propose actions to maintain or restore them.',
    '[
      {"type": "heading", "content": "Human Impact on Habitats", "level": 1},
      {"type": "text", "content": "Human activities can change habitats in ways that help or harm the living things there. Understanding our impact helps us make better choices to protect the natural world."},
      {"type": "heading", "content": "Harmful Human Activities", "level": 2},
      {"type": "text", "content": "Activities that harm habitats:\n- Deforestation: cutting down forests removes homes and food for many species\n- Pollution: chemicals in water and air poison living things\n- Urban development: building cities and roads destroys natural areas\n- Overuse of resources: overfishing, overhunting, and overfarming"},
      {"type": "heading", "content": "Helpful Human Activities", "level": 2},
      {"type": "text", "content": "Actions that protect habitats:\n- Creating nature reserves and parks\n- Planting trees and restoring wetlands\n- Reducing pollution and recycling\n- Following hunting and fishing regulations\n- Supporting endangered species programs"},
      {"type": "callout", "content": "Everyone can help protect habitats. Even small actions like picking up litter, planting trees, and saving water make a difference.", "style": "tip"},
      {"type": "heading", "content": "Natural Changes to Habitats", "level": 2},
      {"type": "text", "content": "Nature also changes habitats through:\n- Forest fires (which can actually help some ecosystems renew)\n- Floods and droughts\n- Severe storms\n- Volcanic eruptions and earthquakes"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Which human activity harms habitats?", "options": ["Planting trees", "Creating parks", "Deforestation", "Recycling"], "correct": 2, "explanation": "Deforestation destroys forest habitats and the communities of living things that depend on them."},
      {"type": "quiz", "question": "How can forest fires sometimes help ecosystems?", "options": ["They destroy all life", "They help ecosystems renew and regrow", "They create pollution", "They melt glaciers"], "correct": 1, "explanation": "Some ecosystems depend on periodic fires to clear old growth and allow new plants to sprout."}
    ]'::jsonb,
    '[{"term": "Deforestation", "definition": "Cutting down large areas of forest"},
      {"term": "Pollution", "definition": "Harmful substances released into the environment"},
      {"term": "Conservation", "definition": "The protection and careful management of natural resources"},
      {"term": "Endangered species", "definition": "A species at risk of disappearing forever (extinction)"},
      {"term": "Ecosystem", "definition": "A community of living things and their physical environment working together"}]'::jsonb,
    'Indigenous land stewardship practices maintain habitat health. Controlled prairie burns encouraged new grass growth, attracting bison herds. This practice maintained the grassland ecosystem while providing food. Today, many conservation projects partner with Indigenous knowledge keepers.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'HC4.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is conservation?', 'The protection and careful management of natural resources.', 'Taking care of nature.', 1, 0),
    (v_tenant, v_ch, 'Name two human activities that harm habitats.', 'Deforestation and pollution.', 'Cutting trees and releasing chemicals.', 1, 1),
    (v_tenant, v_ch, 'What is an endangered species?', 'A species at risk of disappearing forever.', 'There are very few left.', 1, 2);


  -- ========================================================================
  -- UNIT 2: Physical Science — Light (LI4.1-LI4.3)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Light',
    'Investigate characteristics of light sources and how light interacts with objects to create phenomena.',
    'Light has properties that we can observe and use, and it interacts with materials in different ways.',
    'How does light behave when it meets different materials?')
  RETURNING id INTO v_unit;

  -- Chapter 4 — Sources of Light
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 4, 'Sources of Light', 'sources-of-light',
    'Investigate characteristics of natural and artificial light sources.',
    '[
      {"type": "heading", "content": "Sources of Light", "level": 1},
      {"type": "text", "content": "Light is a form of energy that allows us to see. Objects that produce their own light are called luminous. Objects that do not produce their own light are called non-luminous."},
      {"type": "heading", "content": "Natural Light Sources", "level": 2},
      {"type": "text", "content": "Natural sources of light come from nature:\n- The sun is our most important natural light source\n- Stars produce light like the sun\n- Lightning produces bright flashes of light\n- Some animals produce light (bioluminescence), like fireflies and deep-sea fish\n- Fire produces light from burning materials"},
      {"type": "heading", "content": "Artificial Light Sources", "level": 2},
      {"type": "text", "content": "Artificial light is made by people:\n- Light bulbs (incandescent, LED, fluorescent)\n- Flashlights\n- Computer and phone screens\n- Candles\n- Neon signs"},
      {"type": "callout", "content": "The moon is NOT a source of light. It reflects light from the sun, making it look bright in the night sky.", "style": "info"},
      {"type": "heading", "content": "Light Travels in Straight Lines", "level": 2},
      {"type": "text", "content": "Light always travels in straight lines. This is why shadows form. When light hits an opaque object, the object blocks the light and creates a shadow behind it."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Is the moon a source of light?", "options": ["Yes, it makes its own light", "No, it reflects light from the sun", "Yes, it is luminous", "No, it is invisible"], "correct": 1, "explanation": "The moon does not make its own light. It reflects sunlight, which is why we can see it."},
      {"type": "quiz", "question": "Why do shadows form?", "options": ["Light bends around objects", "Objects absorb all light", "Light travels in straight lines and gets blocked", "Shadows are painted on the ground"], "correct": 2, "explanation": "Light travels in straight lines. When an opaque object blocks the light, a shadow forms."}
    ]'::jsonb,
    '[{"term": "Luminous", "definition": "An object that produces its own light"},
      {"term": "Non-luminous", "definition": "An object that does not produce its own light"},
      {"term": "Bioluminescence", "definition": "Light produced by living organisms"},
      {"term": "Opaque", "definition": "Does not let light pass through; creates shadows"},
      {"term": "Shadow", "definition": "A dark area formed when an object blocks light"}]'::jsonb,
    'Fire was a crucial light source for Indigenous peoples, used for warmth, cooking, and ceremony. The Northern Lights (Aurora Borealis) hold deep spiritual meaning in many Indigenous cultures, often seen as spirits dancing in the sky.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'LI4.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does luminous mean?', 'An object that produces its own light.', 'The sun, a light bulb, a firefly.', 1, 0),
    (v_tenant, v_ch, 'Does the moon produce its own light?', 'No. It reflects light from the sun.', 'It is non-luminous.', 1, 1),
    (v_tenant, v_ch, 'Why do shadows form?', 'Light travels in straight lines and gets blocked by opaque objects.', 'The object blocks the light path.', 1, 2);


  -- Chapter 5 — Reflection and Refraction
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 5, 'Reflection and Refraction', 'reflection-refraction',
    'Analyze how light interacts with objects to create reflection, refraction, and dispersion.',
    '[
      {"type": "heading", "content": "Reflection and Refraction", "level": 1},
      {"type": "text", "content": "When light hits an object, it can be reflected (bounced back), absorbed (taken in), or transmitted (passed through). The way light interacts with materials creates interesting effects."},
      {"type": "heading", "content": "Reflection", "level": 2},
      {"type": "text", "content": "Reflection happens when light bounces off a surface. A mirror reflects almost all light that hits it, which is why you can see your image. Smooth, shiny surfaces reflect light well. Rough surfaces scatter the light."},
      {"type": "heading", "content": "Refraction", "level": 2},
      {"type": "text", "content": "Refraction happens when light bends as it passes from one material to another. This is why a straw in a glass of water looks bent or broken. The light bends when it moves from air to water."},
      {"type": "heading", "content": "Transparent, Translucent, and Opaque", "level": 2},
      {"type": "text", "content": "Materials interact with light differently:\n- Transparent: light passes through clearly (glass, clear water)\n- Translucent: some light passes through, but things look blurry (frosted glass, wax paper)\n- Opaque: no light passes through (wood, metal, cardboard)"},
      {"type": "callout", "content": "A rainbow is created by refraction! Sunlight enters raindrops, bends, and splits into all its colours.", "style": "tip"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is refraction?", "options": ["Light bouncing off a surface", "Light bending as it passes from one material to another", "Light being absorbed", "Light disappearing"], "correct": 1, "explanation": "Refraction is the bending of light as it passes from one material to another, like from air to water."},
      {"type": "quiz", "question": "Frosted glass is an example of a material that is:", "options": ["Transparent", "Translucent", "Opaque", "Luminous"], "correct": 1, "explanation": "Translucent materials let some light through, but you cannot see clearly through them."}
    ]'::jsonb,
    '[{"term": "Reflection", "definition": "When light bounces off a surface"},
      {"term": "Refraction", "definition": "When light bends as it passes from one material to another"},
      {"term": "Transparent", "definition": "A material that lets light pass through clearly"},
      {"term": "Translucent", "definition": "A material that lets some light through but things appear blurry"},
      {"term": "Dispersion", "definition": "When white light separates into its component colours, as in a rainbow"}]'::jsonb,
    'Rainbows appear in many Indigenous stories as bridges between the physical and spiritual worlds. The ability to observe and understand light phenomena in nature represents scientific thinking that has existed for thousands of years.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'LI4.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is reflection?', 'When light bounces off a surface.', 'Mirrors do this.', 1, 0),
    (v_tenant, v_ch, 'What is refraction?', 'When light bends as it passes from one material to another.', 'A straw looks bent in water.', 1, 1),
    (v_tenant, v_ch, 'What is the difference between transparent and translucent?', 'Transparent lets light through clearly. Translucent lets some light through but looks blurry.', 'Clear glass vs. frosted glass.', 1, 2);


  -- ========================================================================
  -- UNIT 3: Earth and Space Science — Rocks and Minerals (RM4.1-RM4.3)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Rocks and Minerals',
    'Investigate physical properties of rocks and minerals and assess how human uses impact self, society, and the environment.',
    'Rocks and minerals have physical properties that determine their uses, and human use of these resources has environmental impacts.',
    'How do rocks and minerals shape our world?')
  RETURNING id INTO v_unit;

  -- Chapter 6 — Properties of Rocks and Minerals
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 6, 'Properties of Rocks and Minerals', 'properties-rocks-minerals',
    'Investigate physical properties of rocks and minerals.',
    '[
      {"type": "heading", "content": "Properties of Rocks and Minerals", "level": 1},
      {"type": "text", "content": "The Earth is made of rocks, and rocks are made of minerals. A mineral is a naturally occurring solid substance with a specific chemical composition. A rock is made of one or more minerals."},
      {"type": "heading", "content": "Identifying Minerals", "level": 2},
      {"type": "text", "content": "We identify minerals by testing their properties:\n- Colour: what colour is the mineral?\n- Lustre: is it shiny (metallic) or dull (non-metallic)?\n- Hardness: how easily can it be scratched? (Mohs scale 1-10)\n- Streak: what colour powder does it leave on a streak plate?\n- Crystal shape: what shape are its crystals?"},
      {"type": "heading", "content": "Three Types of Rocks", "level": 2},
      {"type": "text", "content": "There are three main types of rocks:\n- Igneous: formed from cooled magma or lava (e.g., granite, basalt)\n- Sedimentary: formed from layers of sediment pressed together (e.g., sandstone, limestone)\n- Metamorphic: formed when existing rocks are changed by heat and pressure (e.g., marble, slate)"},
      {"type": "callout", "content": "The rock cycle shows how rocks change from one type to another over millions of years. Igneous rocks can become sedimentary, then metamorphic, and eventually melt back into magma.", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is a mineral?", "options": ["A type of plant", "A naturally occurring solid with a specific chemical composition", "A kind of soil", "A liquid found underground"], "correct": 1, "explanation": "Minerals are naturally occurring solids with specific chemical compositions and crystal structures."},
      {"type": "quiz", "question": "Which type of rock forms from cooled magma?", "options": ["Sedimentary", "Metamorphic", "Igneous", "Mineral"], "correct": 2, "explanation": "Igneous rocks form when hot magma or lava cools and hardens."}
    ]'::jsonb,
    '[{"term": "Mineral", "definition": "A naturally occurring solid substance with a specific chemical composition"},
      {"term": "Rock", "definition": "A solid material made of one or more minerals"},
      {"term": "Igneous rock", "definition": "Rock formed from cooled magma or lava"},
      {"term": "Sedimentary rock", "definition": "Rock formed from layers of sediment pressed together over time"},
      {"term": "Metamorphic rock", "definition": "Rock changed by heat and pressure"},
      {"term": "Rock cycle", "definition": "The process by which rocks change from one type to another over time"}]'::jsonb,
    'Indigenous peoples have used rocks and minerals for thousands of years. Flint and obsidian were shaped into tools and arrowheads. Pipestone (catlinite) from southern Saskatchewan is sacred and used for ceremonial pipes.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'RM4.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Name the three types of rocks.', 'Igneous, sedimentary, and metamorphic.', 'Fire, layers, changed.', 1, 0),
    (v_tenant, v_ch, 'What is a mineral?', 'A naturally occurring solid with a specific chemical composition.', 'The building blocks of rocks.', 1, 1),
    (v_tenant, v_ch, 'How do igneous rocks form?', 'From cooled magma or lava.', 'Volcanic activity.', 1, 2),
    (v_tenant, v_ch, 'What is pipestone?', 'A sacred stone from southern Saskatchewan used for ceremonial pipes.', 'Also called catlinite.', 1, 3);


  -- Chapter 7 — Weathering, Erosion, and Fossils
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 7, 'Weathering, Erosion, and Fossils', 'weathering-erosion-fossils',
    'Analyze how weathering, erosion, and fossils provide evidence for understanding Earth''s formation.',
    '[
      {"type": "heading", "content": "Weathering, Erosion, and Fossils", "level": 1},
      {"type": "text", "content": "The surface of the Earth is always changing. Rocks break down, soil moves, and traces of ancient life are preserved in stone. These processes help us understand Earth''s history."},
      {"type": "heading", "content": "Weathering", "level": 2},
      {"type": "text", "content": "Weathering is the breaking down of rocks into smaller pieces. It can happen in several ways:\n- Physical weathering: ice freezes in cracks and expands, breaking rock apart\n- Chemical weathering: rain water (slightly acidic) dissolves minerals in rock\n- Biological weathering: plant roots grow into cracks and push rock apart"},
      {"type": "heading", "content": "Erosion and Deposition", "level": 2},
      {"type": "text", "content": "Erosion moves weathered rock and soil from one place to another. Wind, water, ice (glaciers), and gravity cause erosion. When the eroded material settles in a new place, it is called deposition."},
      {"type": "heading", "content": "Fossils", "level": 2},
      {"type": "text", "content": "Fossils are preserved remains or traces of ancient living things found in rock. Fossils form when an organism is buried in sediment that hardens into rock over millions of years. Saskatchewan has many fossil sites, including dinosaur bones and ancient sea creatures."},
      {"type": "callout", "content": "Saskatchewan was once covered by a shallow sea! Fossils of ancient marine animals are found across the province.", "style": "tip"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is weathering?", "options": ["When it rains", "The breaking down of rocks into smaller pieces", "When rocks melt", "When fossils form"], "correct": 1, "explanation": "Weathering is the process of breaking rocks into smaller pieces through physical, chemical, or biological means."},
      {"type": "quiz", "question": "What is a fossil?", "options": ["A type of rock", "A living animal", "Preserved remains of ancient living things", "A mineral crystal"], "correct": 2, "explanation": "Fossils are preserved remains or traces of organisms that lived long ago."}
    ]'::jsonb,
    '[{"term": "Weathering", "definition": "The breaking down of rocks into smaller pieces"},
      {"term": "Erosion", "definition": "The movement of weathered rock and soil by wind, water, ice, or gravity"},
      {"term": "Deposition", "definition": "When eroded material settles in a new location"},
      {"term": "Fossil", "definition": "Preserved remains or traces of ancient living things found in rock"},
      {"term": "Glacier", "definition": "A large mass of ice that moves slowly over land"}]'::jsonb,
    'Many Indigenous creation stories describe how the land was shaped by powerful forces. Glacial landforms across Saskatchewan, like the Qu''Appelle Valley, are explained through both scientific and Indigenous perspectives, providing complementary understandings of landscape formation.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'RM4.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is weathering?', 'The breaking down of rocks into smaller pieces.', 'Ice, water, and roots can do this.', 1, 0),
    (v_tenant, v_ch, 'What is a fossil?', 'Preserved remains or traces of ancient living things in rock.', 'Dinosaur bones are fossils.', 1, 1),
    (v_tenant, v_ch, 'What is the difference between erosion and deposition?', 'Erosion moves material away. Deposition is when it settles in a new place.', 'Pick up and drop off.', 1, 2);

  RAISE NOTICE 'Grade 4 Science content seeded successfully.';
END $$;


-- ============================================================================
-- GRADE 5 — WolfWhale Science 5
-- Outcomes: HB5.1-HB5.3, MC5.1-MC5.3, FM5.1-FM5.3, WE5.1-WE5.3
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
    WHERE tenant_id = v_tenant AND slug = 'wolfwhale-science-5';

  -- ========================================================================
  -- UNIT 1: Life Science — Human Body (HB5.1-HB5.3)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Human Body Systems',
    'Investigate the structure and function of human body systems and how they work together.',
    'The human body is made up of systems that work together to keep us alive and healthy.',
    'How do our body systems work together to keep us healthy?')
  RETURNING id INTO v_unit;

  -- Chapter 1 — Body Systems Overview
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 1, 'Body Systems Overview', 'body-systems-overview',
    'Explore the major systems of the human body and how they work together.',
    '[
      {"type": "heading", "content": "Body Systems Overview", "level": 1},
      {"type": "text", "content": "Your body is an amazing machine made up of many systems working together. Each system has a specific job, but no system works alone."},
      {"type": "heading", "content": "Major Body Systems", "level": 2},
      {"type": "text", "content": "The main body systems include:\n- Digestive system: breaks down food into nutrients\n- Respiratory system: brings oxygen into the body and removes carbon dioxide\n- Circulatory system: moves blood, nutrients, and oxygen throughout the body\n- Skeletal system: provides structure and protects organs\n- Muscular system: allows movement\n- Nervous system: controls the body and processes information"},
      {"type": "callout", "content": "Your body systems work together like a team. The respiratory system gets oxygen, the circulatory system delivers it, and the muscular system uses it to move.", "style": "info"},
      {"type": "heading", "content": "Organs", "level": 2},
      {"type": "text", "content": "Each system contains organs — body parts with specific jobs:\n- Heart: pumps blood (circulatory system)\n- Lungs: exchange oxygen and carbon dioxide (respiratory system)\n- Stomach: breaks down food (digestive system)\n- Brain: controls the entire body (nervous system)\n- Bones: support and protect (skeletal system)"},
      {"type": "heading", "content": "Keeping Healthy", "level": 2},
      {"type": "text", "content": "To keep your body systems healthy:\n- Eat nutritious foods\n- Exercise regularly\n- Get enough sleep\n- Drink plenty of water\n- Avoid harmful substances"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Which system breaks down food?", "options": ["Respiratory", "Circulatory", "Digestive", "Nervous"], "correct": 2, "explanation": "The digestive system breaks down food into nutrients the body can use."},
      {"type": "quiz", "question": "Which organ pumps blood throughout the body?", "options": ["Brain", "Lungs", "Stomach", "Heart"], "correct": 3, "explanation": "The heart is the organ that pumps blood through the circulatory system."}
    ]'::jsonb,
    '[{"term": "Body system", "definition": "A group of organs that work together to perform a major function"},
      {"term": "Organ", "definition": "A body part with a specific job, like the heart or lungs"},
      {"term": "Digestive system", "definition": "The system that breaks down food into nutrients"},
      {"term": "Circulatory system", "definition": "The system that moves blood throughout the body"},
      {"term": "Respiratory system", "definition": "The system that brings oxygen in and removes carbon dioxide"}]'::jsonb,
    'Indigenous approaches to health consider the whole person: physical, mental, emotional, and spiritual. The Medicine Wheel represents this holistic view of health, where balance in all four areas leads to overall wellness.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'HB5.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'HB5.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Name four major body systems.', 'Digestive, respiratory, circulatory, and nervous.', 'Food, breathing, blood, brain.', 1, 0),
    (v_tenant, v_ch, 'What is an organ?', 'A body part with a specific job, like the heart or lungs.', 'Part of a body system.', 1, 1),
    (v_tenant, v_ch, 'Which system delivers oxygen to body cells?', 'The circulatory system.', 'Blood carries oxygen.', 1, 2);


  -- Chapter 2 — Staying Healthy
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 2, 'Staying Healthy', 'staying-healthy',
    'Analyze personal and societal requirements for maintaining a healthy body.',
    '[
      {"type": "heading", "content": "Staying Healthy", "level": 1},
      {"type": "text", "content": "Taking care of your body is one of the most important things you can do. What you eat, how you move, and the choices you make all affect how well your body systems work."},
      {"type": "heading", "content": "Nutrition", "level": 2},
      {"type": "text", "content": "Your body needs different types of nutrients:\n- Carbohydrates: provide energy (whole grains, fruits)\n- Proteins: build and repair muscles (meat, beans, eggs)\n- Fats: provide energy and protect organs (nuts, oils)\n- Vitamins and minerals: keep body systems working properly\n- Water: essential for every body function"},
      {"type": "heading", "content": "Exercise and Rest", "level": 2},
      {"type": "text", "content": "Regular physical activity strengthens your heart, lungs, muscles, and bones. Children need at least 60 minutes of physical activity every day. Sleep is equally important — your body repairs itself during sleep, and your brain processes what you learned during the day."},
      {"type": "callout", "content": "Children ages 5-13 need 9 to 11 hours of sleep each night for healthy growth and development.", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Which nutrient provides energy?", "options": ["Vitamins", "Minerals", "Carbohydrates", "Water"], "correct": 2, "explanation": "Carbohydrates are the body''s main source of energy."},
      {"type": "quiz", "question": "How many minutes of physical activity should children get daily?", "options": ["15 minutes", "30 minutes", "60 minutes", "120 minutes"], "correct": 2, "explanation": "Children should get at least 60 minutes of physical activity every day."}
    ]'::jsonb,
    '[{"term": "Nutrition", "definition": "The process of taking in food and using it for growth and health"},
      {"term": "Carbohydrate", "definition": "A nutrient that provides energy, found in grains, fruits, and vegetables"},
      {"term": "Protein", "definition": "A nutrient that builds and repairs body tissues, found in meat, beans, and eggs"},
      {"term": "Nutrient", "definition": "A substance the body needs for energy, growth, and repair"}]'::jsonb,
    'Traditional Indigenous diets included nutrient-rich foods like bison, wild rice, berries, and fish. These foods provided balanced nutrition without processed ingredients. Many communities are reviving traditional food systems for better health.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'HB5.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'HB5.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are carbohydrates?', 'Nutrients that provide energy, found in grains, fruits, and vegetables.', 'Your body''s fuel.', 1, 0),
    (v_tenant, v_ch, 'What does protein do?', 'Builds and repairs body tissues.', 'Found in meat, beans, and eggs.', 1, 1),
    (v_tenant, v_ch, 'How much sleep do children ages 5-13 need?', '9 to 11 hours each night.', 'More than most adults need.', 1, 2);


  -- ========================================================================
  -- UNIT 2: Physical Science — Properties of Matter (MC5.1-MC5.3)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Properties and Changes of Matter',
    'Investigate properties of matter in different states and how reversible and non-reversible changes alter materials.',
    'Matter exists in three states and can undergo changes that are either reversible or non-reversible.',
    'How does matter change, and can those changes be reversed?')
  RETURNING id INTO v_unit;

  -- Chapter 3 — States of Matter
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 3, 'States of Matter', 'states-of-matter-5',
    'Investigate the properties of materials in solid, liquid, and gaseous states.',
    '[
      {"type": "heading", "content": "States of Matter", "level": 1},
      {"type": "text", "content": "All matter exists in one of three states: solid, liquid, or gas. The state of matter depends on how its particles are arranged and how much energy they have."},
      {"type": "heading", "content": "The Particle Model of Matter", "level": 2},
      {"type": "text", "content": "All matter is made of tiny particles that are always moving:\n- In solids, particles are packed tightly together and vibrate in place. Solids have a fixed shape and volume.\n- In liquids, particles are close but can slide past each other. Liquids have a fixed volume but take the shape of their container.\n- In gases, particles are far apart and move freely. Gases have no fixed shape or volume and spread to fill any container."},
      {"type": "callout", "content": "Adding heat energy makes particles move faster. That is why heating a solid can melt it into a liquid, and heating a liquid can turn it into a gas.", "style": "info"},
      {"type": "heading", "content": "Changes of State", "level": 2},
      {"type": "text", "content": "Matter can change from one state to another:\n- Melting: solid → liquid (ice melts to water)\n- Freezing: liquid → solid (water freezes to ice)\n- Evaporation: liquid → gas (water becomes steam)\n- Condensation: gas → liquid (steam becomes water droplets)\n- Sublimation: solid → gas (dry ice becomes carbon dioxide gas)"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "In which state of matter are particles packed most tightly?", "options": ["Solid", "Liquid", "Gas", "All the same"], "correct": 0, "explanation": "In solids, particles are packed tightly together and vibrate in place."},
      {"type": "quiz", "question": "What is the change from liquid to gas called?", "options": ["Melting", "Freezing", "Condensation", "Evaporation"], "correct": 3, "explanation": "Evaporation is when a liquid changes to a gas, usually by adding heat energy."}
    ]'::jsonb,
    '[{"term": "Particle", "definition": "A tiny piece of matter that makes up all substances"},
      {"term": "Melting", "definition": "The change from solid to liquid state"},
      {"term": "Evaporation", "definition": "The change from liquid to gas state"},
      {"term": "Condensation", "definition": "The change from gas to liquid state"},
      {"term": "Sublimation", "definition": "The change from solid directly to gas state"}]'::jsonb,
    'Indigenous peoples observed state changes in daily life. Knowing when lakes would freeze and thaw guided travel and fishing schedules. The process of smoking and drying meat (evaporation) preserved food for winter months.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'MC5.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Name the three states of matter.', 'Solid, liquid, and gas.', 'Think about ice, water, and steam.', 1, 0),
    (v_tenant, v_ch, 'What is melting?', 'The change from solid to liquid.', 'Ice turns into water.', 1, 1),
    (v_tenant, v_ch, 'What happens to particles when you add heat?', 'They move faster and spread apart.', 'More energy = more movement.', 1, 2);


  -- Chapter 4 — Reversible and Non-Reversible Changes
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 4, 'Reversible and Non-Reversible Changes', 'reversible-non-reversible',
    'Investigate how reversible and non-reversible changes alter materials.',
    '[
      {"type": "heading", "content": "Reversible and Non-Reversible Changes", "level": 1},
      {"type": "text", "content": "When materials change, the change can sometimes be undone (reversible) or it cannot be undone (non-reversible). Understanding these differences helps us use materials wisely."},
      {"type": "heading", "content": "Reversible Changes", "level": 2},
      {"type": "text", "content": "A reversible change can be undone:\n- Melting ice can be refrozen\n- Dissolving sugar in water can be reversed by evaporating the water\n- Bending a paper clip — you can bend it back\n- Stretching a rubber band — it returns to shape"},
      {"type": "heading", "content": "Non-Reversible Changes", "level": 2},
      {"type": "text", "content": "A non-reversible change cannot be undone:\n- Burning wood turns it into ash and smoke\n- Cooking an egg changes it permanently\n- Rusting iron — the iron combines with oxygen\n- Mixing cement with water — it hardens permanently"},
      {"type": "callout", "content": "Non-reversible changes often involve a chemical reaction where new substances are formed.", "style": "info"},
      {"type": "heading", "content": "Physical vs Chemical Changes", "level": 2},
      {"type": "text", "content": "Physical changes alter the form of a substance but not what it is made of (usually reversible). Chemical changes create entirely new substances (usually non-reversible). Signs of a chemical change include colour change, gas production, temperature change, or a new smell."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Which is a reversible change?", "options": ["Burning paper", "Cooking an egg", "Melting ice", "Rusting a nail"], "correct": 2, "explanation": "Melting ice is reversible — you can refreeze the water back into ice."},
      {"type": "quiz", "question": "Which is a sign of a chemical change?", "options": ["Changing shape", "Changing size", "A new colour or smell", "Changing position"], "correct": 2, "explanation": "Chemical changes often produce new colours, smells, gases, or temperature changes."}
    ]'::jsonb,
    '[{"term": "Reversible change", "definition": "A change that can be undone, returning to the original state"},
      {"term": "Non-reversible change", "definition": "A change that cannot be undone; new substances are formed"},
      {"term": "Physical change", "definition": "A change in the form of a substance without changing what it is made of"},
      {"term": "Chemical change", "definition": "A change that creates a new substance with different properties"}]'::jsonb,
    'Traditional food preservation demonstrates understanding of reversible and non-reversible changes. Drying berries (reversible — they can be rehydrated) versus smoking fish (non-reversible — the proteins change permanently) are examples of applied chemistry in Indigenous practice.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'MC5.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a reversible change?', 'A change that can be undone.', 'Melting ice can be refrozen.', 1, 0),
    (v_tenant, v_ch, 'What is a chemical change?', 'A change that creates a new substance with different properties.', 'Burning, rusting, cooking.', 1, 1),
    (v_tenant, v_ch, 'Name two signs of a chemical change.', 'Colour change and gas production (also temperature change and new smell).', 'Something new is being formed.', 1, 2);


  -- ========================================================================
  -- UNIT 3: Earth and Space Science — Weather (WE5.1-WE5.3)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Weather',
    'Measure and represent local weather conditions and analyze the impact of weather on society.',
    'Weather is driven by the movement of air and solar energy, and it significantly impacts society and the environment.',
    'What causes weather, and how does it affect our lives?')
  RETURNING id INTO v_unit;

  -- Chapter 5 — Measuring Weather
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 5, 'Measuring Weather', 'measuring-weather',
    'Measure and represent local weather conditions including temperature, wind, and precipitation.',
    '[
      {"type": "heading", "content": "Measuring Weather", "level": 1},
      {"type": "text", "content": "Meteorologists (weather scientists) use tools and measurements to describe and predict weather. You can measure weather too using simple instruments."},
      {"type": "heading", "content": "Weather Instruments", "level": 2},
      {"type": "text", "content": "Common weather instruments:\n- Thermometer: measures temperature in degrees Celsius (°C)\n- Anemometer: measures wind speed\n- Wind vane: shows wind direction\n- Rain gauge: measures precipitation (rainfall)\n- Barometer: measures air pressure\n- Hygrometer: measures humidity (moisture in the air)"},
      {"type": "heading", "content": "Recording Weather Data", "level": 2},
      {"type": "text", "content": "Scientists record weather data daily using tables and graphs. Over time, weather data reveals patterns. For example, Saskatchewan summers average 25-30°C while winters can drop to -30°C or colder."},
      {"type": "callout", "content": "Weather is what is happening in the atmosphere right now. Climate is the average weather over many years.", "style": "info"},
      {"type": "heading", "content": "What Drives Weather?", "level": 2},
      {"type": "text", "content": "Weather is driven by:\n- Solar energy: the sun heats the Earth unevenly\n- Air movement: warm air rises and cool air sinks, creating wind\n- Water cycle: evaporation, condensation, and precipitation produce clouds and rain"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What does a thermometer measure?", "options": ["Wind speed", "Temperature", "Rainfall", "Humidity"], "correct": 1, "explanation": "A thermometer measures temperature, usually in degrees Celsius (°C) in Canada."},
      {"type": "quiz", "question": "What is the difference between weather and climate?", "options": ["They are the same", "Weather is daily conditions; climate is the average over many years", "Climate is daily; weather is over years", "Weather is only temperature"], "correct": 1, "explanation": "Weather describes current atmospheric conditions. Climate is the average weather over many years."}
    ]'::jsonb,
    '[{"term": "Meteorologist", "definition": "A scientist who studies and predicts weather"},
      {"term": "Thermometer", "definition": "An instrument that measures temperature"},
      {"term": "Anemometer", "definition": "An instrument that measures wind speed"},
      {"term": "Climate", "definition": "The average weather conditions in an area over many years"},
      {"term": "Air pressure", "definition": "The weight of the atmosphere pressing down on the Earth''s surface"}]'::jsonb,
    'Indigenous peoples developed sophisticated weather prediction methods through careful observation of natural signs: animal behaviour changes, cloud patterns, wind shifts, and plant responses. This traditional weather knowledge has been validated by modern science.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'WE5.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'WE5.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does an anemometer measure?', 'Wind speed.', 'It spins in the wind.', 1, 0),
    (v_tenant, v_ch, 'What is the difference between weather and climate?', 'Weather is daily conditions. Climate is the average over many years.', 'Short-term vs. long-term.', 1, 1),
    (v_tenant, v_ch, 'What drives weather on Earth?', 'Solar energy, air movement, and the water cycle.', 'The sun is the main energy source.', 1, 2);

  RAISE NOTICE 'Grade 5 Science content seeded successfully.';
END $$;


-- ============================================================================
-- GRADE 6 — WolfWhale Science 6
-- Outcomes: DL6.1-DL6.5, EL6.1-EL6.3, FL6.1-FL6.3, SS6.1-SS6.3
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
    WHERE tenant_id = v_tenant AND slug = 'wolfwhale-science-6';

  -- ========================================================================
  -- UNIT 1: Life Science — Diversity of Living Things (DL6.1-DL6.5)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Diversity of Living Things',
    'Recognize and appreciate the diversity of life, examine classification systems, and analyze characteristics of vertebrates, invertebrates, and micro-organisms.',
    'Life on Earth is incredibly diverse, and scientists organize this diversity through classification systems.',
    'How do scientists organize and understand the diversity of life?')
  RETURNING id INTO v_unit;

  -- Chapter 1 — Classifying Living Things
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 1, 'Classifying Living Things', 'classifying-living-things',
    'Examine how humans organize understanding of the diversity of living things.',
    '[
      {"type": "heading", "content": "Classifying Living Things", "level": 1},
      {"type": "text", "content": "Scientists estimate there are over 8 million species on Earth. To make sense of this incredible diversity, scientists use classification — organizing living things into groups based on shared characteristics."},
      {"type": "heading", "content": "The Classification System", "level": 2},
      {"type": "text", "content": "Scientists use a hierarchy of groups:\n- Kingdom: the largest group (e.g., Animal Kingdom, Plant Kingdom)\n- Phylum: a major division within a kingdom\n- Class: a group within a phylum (e.g., Mammalia, Reptilia)\n- Order: a group within a class\n- Family: a group within an order\n- Genus: a group of closely related species\n- Species: the most specific group — organisms that can breed together"},
      {"type": "heading", "content": "Vertebrates and Invertebrates", "level": 2},
      {"type": "text", "content": "Animals are divided into two main groups:\n- Vertebrates: animals with a backbone (fish, amphibians, reptiles, birds, mammals)\n- Invertebrates: animals without a backbone (insects, spiders, worms, jellyfish, snails)\n\nAbout 97% of all animal species are invertebrates!"},
      {"type": "callout", "content": "You can remember the classification levels with: King Philip Came Over For Good Spaghetti (Kingdom, Phylum, Class, Order, Family, Genus, Species).", "style": "tip"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is the most specific level of classification?", "options": ["Kingdom", "Phylum", "Genus", "Species"], "correct": 3, "explanation": "Species is the most specific level. It refers to a group of organisms that can breed together."},
      {"type": "quiz", "question": "What percentage of animal species are invertebrates?", "options": ["3%", "50%", "75%", "97%"], "correct": 3, "explanation": "About 97% of all known animal species are invertebrates — animals without backbones."}
    ]'::jsonb,
    '[{"term": "Classification", "definition": "Organizing living things into groups based on shared characteristics"},
      {"term": "Species", "definition": "A group of organisms that can breed together and produce fertile offspring"},
      {"term": "Vertebrate", "definition": "An animal with a backbone"},
      {"term": "Invertebrate", "definition": "An animal without a backbone"},
      {"term": "Kingdom", "definition": "The largest group in classification"}]'::jsonb,
    'Indigenous classification systems organize living things differently from Western science. For example, Cree language groups animals by their relationship to people, their habitat, and their spiritual significance rather than by physical features alone.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'DL6.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'DL6.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is classification?', 'Organizing living things into groups based on shared characteristics.', 'Sorting life into categories.', 1, 0),
    (v_tenant, v_ch, 'What is the difference between vertebrates and invertebrates?', 'Vertebrates have a backbone; invertebrates do not.', 'Do they have a spine?', 1, 1),
    (v_tenant, v_ch, 'Name the classification levels in order.', 'Kingdom, Phylum, Class, Order, Family, Genus, Species.', 'King Philip Came Over For Good Spaghetti.', 2, 2);


  -- Chapter 2 — Adaptations and Survival
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 2, 'Adaptations and Survival', 'adaptations-survival-6',
    'Examine structures and behaviours that help organisms survive.',
    '[
      {"type": "heading", "content": "Adaptations and Survival", "level": 1},
      {"type": "text", "content": "Every species has adaptations — features that help it survive in its environment. Over long periods, species that are well-adapted survive and reproduce, while those that are not may become extinct."},
      {"type": "heading", "content": "Structural Adaptations", "level": 2},
      {"type": "text", "content": "Physical features for survival:\n- Thick blubber on whales for insulation in cold water\n- Thorns on roses to deter herbivores\n- Long necks on giraffes to reach tall trees\n- Webbed feet on ducks for efficient swimming\n- Deep root systems on prairie plants to find water"},
      {"type": "heading", "content": "Behavioural Adaptations", "level": 2},
      {"type": "text", "content": "Actions that aid survival:\n- Wolves hunt in packs to take down large prey\n- Some insects play dead to avoid predators\n- Birds build nests to protect eggs and young\n- Salmon migrate upstream to spawn in their birth rivers"},
      {"type": "heading", "content": "Micro-organisms", "level": 2},
      {"type": "text", "content": "Micro-organisms are living things too small to see without a microscope. They include bacteria, viruses, fungi, and protists. Some are helpful (bacteria in yogurt, fungi that decompose dead matter). Some can cause disease (certain bacteria and viruses)."},
      {"type": "callout", "content": "Not all micro-organisms are harmful. Many are essential for life — they decompose waste, help us digest food, and enrich soil.", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is a micro-organism?", "options": ["A tiny plant", "A living thing too small to see without a microscope", "A type of mineral", "A baby animal"], "correct": 1, "explanation": "Micro-organisms are living things so small they can only be seen with a microscope."},
      {"type": "quiz", "question": "Which is a behavioural adaptation?", "options": ["Thick fur", "Sharp claws", "Hunting in packs", "Bright colours"], "correct": 2, "explanation": "Hunting in packs is a behaviour that helps wolves survive. It is not a physical feature."}
    ]'::jsonb,
    '[{"term": "Adaptation", "definition": "A feature or behaviour that helps an organism survive in its environment"},
      {"term": "Extinct", "definition": "When no more individuals of a species are alive anywhere on Earth"},
      {"term": "Micro-organism", "definition": "A living thing too small to see without a microscope"},
      {"term": "Bacteria", "definition": "Single-celled micro-organisms found almost everywhere"},
      {"term": "Decomposer", "definition": "An organism that breaks down dead material and returns nutrients to the environment"}]'::jsonb,
    'Indigenous knowledge of plant and animal adaptations guided sustainable harvesting. Understanding seasonal animal behaviours, plant growth cycles, and ecosystem relationships allowed Indigenous peoples to live sustainably within their environments for thousands of years.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'DL6.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'DL6.5';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does extinct mean?', 'No individuals of a species are alive anywhere on Earth.', 'Dinosaurs are extinct.', 1, 0),
    (v_tenant, v_ch, 'What is a micro-organism?', 'A living thing too small to see without a microscope.', 'Bacteria, viruses, fungi.', 1, 1),
    (v_tenant, v_ch, 'Are all micro-organisms harmful?', 'No. Many are helpful — they decompose waste, help digestion, and enrich soil.', 'Yogurt contains helpful bacteria.', 1, 2);


  -- ========================================================================
  -- UNIT 2: Earth and Space Science — Space (SS6.1-SS6.3)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'The Solar System and Space',
    'Research the physical characteristics of solar system components and evaluate space exploration contributions.',
    'Our solar system contains diverse astronomical bodies, and space exploration expands our understanding of the universe.',
    'What is in our solar system, and why do we explore space?')
  RETURNING id INTO v_unit;

  -- Chapter 3 — Our Solar System
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 3, 'Our Solar System', 'our-solar-system',
    'Research the physical characteristics of major components of the solar system.',
    '[
      {"type": "heading", "content": "Our Solar System", "level": 1},
      {"type": "text", "content": "Our solar system is made up of the sun at the centre and everything that orbits around it: eight planets, dwarf planets, moons, asteroids, comets, and dust."},
      {"type": "heading", "content": "The Sun", "level": 2},
      {"type": "text", "content": "The sun is a star — a massive ball of hot gas that produces light and heat through nuclear fusion. It contains 99.8% of all the mass in our solar system. Without the sun, life on Earth would not exist."},
      {"type": "heading", "content": "The Planets", "level": 2},
      {"type": "text", "content": "The eight planets in order from the sun:\n1. Mercury — smallest, closest to the sun, very hot and very cold\n2. Venus — hottest planet, thick toxic atmosphere\n3. Earth — the only known planet with liquid water and life\n4. Mars — the red planet, has the largest volcano (Olympus Mons)\n5. Jupiter — largest planet, Great Red Spot storm\n6. Saturn — famous for its beautiful rings\n7. Uranus — tilted on its side, ice giant\n8. Neptune — farthest planet, strong winds, ice giant"},
      {"type": "callout", "content": "Remember the planets with: My Very Educated Mother Just Served Us Nachos (Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune).", "style": "tip"},
      {"type": "heading", "content": "Seasons, Phases, and Eclipses", "level": 2},
      {"type": "text", "content": "Earth''s tilt causes seasons as it orbits the sun. The moon''s orbit around Earth creates moon phases (new moon, quarter, full moon). When the Earth, moon, and sun align, we get eclipses."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Which planet is largest?", "options": ["Saturn", "Earth", "Jupiter", "Neptune"], "correct": 2, "explanation": "Jupiter is the largest planet in our solar system."},
      {"type": "quiz", "question": "What causes the seasons on Earth?", "options": ["Distance from the sun", "Earth''s tilt", "The moon''s pull", "Solar flares"], "correct": 1, "explanation": "Earth''s axial tilt causes different parts of Earth to receive more direct sunlight at different times of year, creating seasons."}
    ]'::jsonb,
    '[{"term": "Solar system", "definition": "The sun and everything that orbits around it"},
      {"term": "Orbit", "definition": "The curved path an object takes around another object in space"},
      {"term": "Planet", "definition": "A large body that orbits a star, has enough gravity to be round, and has cleared its orbital path"},
      {"term": "Eclipse", "definition": "When one celestial body blocks light from reaching another"},
      {"term": "Moon phases", "definition": "The changing shapes of the moon as seen from Earth during its orbit"}]'::jsonb,
    'Many Indigenous cultures have sophisticated knowledge of astronomy. The Lakota and Cree peoples named star constellations and used them for navigation and seasonal timing. Star knowledge is connected to ceremonies, planting cycles, and stories that teach moral lessons.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS6.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS6.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Name the eight planets in order from the sun.', 'Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.', 'My Very Educated Mother Just Served Us Nachos.', 1, 0),
    (v_tenant, v_ch, 'What is the largest planet?', 'Jupiter.', 'The fifth planet from the sun.', 1, 1),
    (v_tenant, v_ch, 'What causes seasons on Earth?', 'Earth''s axial tilt as it orbits the sun.', 'Not distance from the sun!', 1, 2),
    (v_tenant, v_ch, 'What is an orbit?', 'The curved path an object takes around another object in space.', 'Earth orbits the sun.', 1, 3);

  RAISE NOTICE 'Grade 6 Science content seeded successfully.';
END $$;


-- ============================================================================
-- GRADE 7 — WolfWhale Science 7
-- Outcomes: IE7.1-IE7.4, MS7.1-MS7.3, HT7.1-HT7.3, EC7.1-EC7.3
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
    WHERE tenant_id = v_tenant AND slug = 'wolfwhale-science-7';

  -- ========================================================================
  -- UNIT 1: Life Science — Interactions Within Ecosystems (IE7.1-IE7.4)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Interactions Within Ecosystems',
    'Relate Indigenous knowledge to ecosystems, observe food webs, evaluate biogeochemical cycles, and analyze ecosystem changes.',
    'Ecosystems are complex networks of interactions where energy flows and matter cycles through living and non-living components.',
    'How are all parts of an ecosystem connected?')
  RETURNING id INTO v_unit;

  -- Chapter 1 — Ecosystems and Food Webs
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 1, 'Ecosystems and Food Webs', 'ecosystems-food-webs-7',
    'Observe and illustrate living organisms within local ecosystems as part of interconnected food webs.',
    '[
      {"type": "heading", "content": "Ecosystems and Food Webs", "level": 1},
      {"type": "text", "content": "An ecosystem includes all the living (biotic) and non-living (abiotic) things in an area and how they interact. Within every ecosystem, energy flows from producers through consumers in interconnected food webs."},
      {"type": "heading", "content": "Ecological Roles", "level": 2},
      {"type": "text", "content": "Organisms play different roles in an ecosystem:\n- Producers: organisms that make their own food (plants, algae)\n- Primary consumers: herbivores that eat producers (rabbits, deer)\n- Secondary consumers: carnivores that eat herbivores (foxes, hawks)\n- Tertiary consumers: top predators (wolves, eagles)\n- Decomposers: organisms that break down dead matter (fungi, bacteria)"},
      {"type": "heading", "content": "Food Webs", "level": 2},
      {"type": "text", "content": "A food web shows the many interconnected food chains in an ecosystem. Most organisms eat more than one type of food and are eaten by more than one predator. If one species is removed, the entire web can be affected."},
      {"type": "heading", "content": "Energy Pyramids", "level": 2},
      {"type": "text", "content": "Energy decreases as it moves up a food chain. Only about 10% of energy is passed from one level to the next. That is why there are many plants, fewer herbivores, and even fewer top predators."},
      {"type": "callout", "content": "If wolves are removed from an ecosystem, deer populations explode, overgraze vegetation, and the entire ecosystem suffers. Every species plays an important role.", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What role do decomposers play?", "options": ["They make food from sunlight", "They eat herbivores", "They break down dead matter and recycle nutrients", "They are top predators"], "correct": 2, "explanation": "Decomposers break down dead organisms and waste, recycling nutrients back into the ecosystem."},
      {"type": "quiz", "question": "About how much energy is passed from one level to the next?", "options": ["100%", "50%", "10%", "1%"], "correct": 2, "explanation": "Only about 10% of energy transfers to the next level. The rest is used or lost as heat."}
    ]'::jsonb,
    '[{"term": "Ecosystem", "definition": "All living and non-living things in an area and their interactions"},
      {"term": "Producer", "definition": "An organism that makes its own food, usually through photosynthesis"},
      {"term": "Consumer", "definition": "An organism that eats other organisms for energy"},
      {"term": "Decomposer", "definition": "An organism that breaks down dead material and returns nutrients to the ecosystem"},
      {"term": "Food web", "definition": "A network of interconnected food chains in an ecosystem"},
      {"term": "Energy pyramid", "definition": "A diagram showing the decrease of energy at each level of a food chain"}]'::jsonb,
    'Indigenous knowledge systems have always recognized the interconnectedness of ecosystems. The Cree concept of "wahkotowin" (kinship with all creation) reflects the understanding that removing any part of an ecosystem affects the whole. Traditional Ecological Knowledge (TEK) contributes valuable insights to modern conservation.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'IE7.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'IE7.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a food web?', 'A network of interconnected food chains in an ecosystem.', 'Many chains linked together.', 1, 0),
    (v_tenant, v_ch, 'How much energy transfers between trophic levels?', 'About 10%.', 'Most energy is lost as heat.', 2, 1),
    (v_tenant, v_ch, 'What is wahkotowin?', 'A Cree concept meaning kinship with all creation.', 'Everything is connected.', 1, 2);


  -- Chapter 2 — Biogeochemical Cycles and Ecosystem Changes
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 2, 'Biogeochemical Cycles and Ecosystem Changes', 'biogeochemical-cycles',
    'Evaluate biogeochemical cycles and analyze how ecosystems change due to natural and human influences.',
    '[
      {"type": "heading", "content": "Biogeochemical Cycles", "level": 1},
      {"type": "text", "content": "Matter does not disappear from ecosystems — it cycles through them. The water, carbon, and nitrogen that living things use are constantly being recycled between living organisms and the environment."},
      {"type": "heading", "content": "The Water Cycle", "level": 2},
      {"type": "text", "content": "Water cycles through evaporation, condensation, precipitation, and collection. Living things contribute through transpiration (water released from plant leaves) and respiration."},
      {"type": "heading", "content": "The Carbon Cycle", "level": 2},
      {"type": "text", "content": "Carbon moves through ecosystems:\n- Plants absorb CO2 from air during photosynthesis\n- Animals eat plants and release CO2 through respiration\n- Decomposers release CO2 when they break down dead organisms\n- Burning fossil fuels releases stored carbon into the atmosphere\n- Oceans absorb and release CO2"},
      {"type": "heading", "content": "Ecosystem Changes", "level": 2},
      {"type": "text", "content": "Ecosystems change over time through succession:\n- Primary succession: life colonizes bare rock (after a volcanic eruption)\n- Secondary succession: life regrows after a disturbance (after a forest fire)\n\nHuman activities accelerate ecosystem change through habitat destruction, pollution, introduction of invasive species, and climate change."},
      {"type": "callout", "content": "Burning fossil fuels adds carbon to the atmosphere faster than natural processes can remove it, contributing to climate change.", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "How do plants remove carbon from the atmosphere?", "options": ["Respiration", "Photosynthesis", "Decomposition", "Combustion"], "correct": 1, "explanation": "Plants absorb CO2 from the atmosphere during photosynthesis and use it to make food."},
      {"type": "quiz", "question": "What is ecological succession?", "options": ["Animals migrating", "The gradual process of change in an ecosystem over time", "Pollution", "The water cycle"], "correct": 1, "explanation": "Succession is the gradual process by which ecosystems change and develop over time."}
    ]'::jsonb,
    '[{"term": "Biogeochemical cycle", "definition": "The cycling of matter (water, carbon, nitrogen) through living and non-living parts of an ecosystem"},
      {"term": "Carbon cycle", "definition": "The movement of carbon through the atmosphere, living things, oceans, and Earth''s crust"},
      {"term": "Succession", "definition": "The gradual process of change in an ecosystem over time"},
      {"term": "Invasive species", "definition": "A non-native species that spreads and causes harm to an ecosystem"},
      {"term": "Climate change", "definition": "Long-term shifts in temperatures and weather patterns, largely driven by human activities"}]'::jsonb,
    'Indigenous land management practices demonstrate understanding of ecological cycles. Controlled burns returned carbon and nutrients to the soil, promoting new growth. Sustainable harvesting practices ensured resources would be available for future generations.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'IE7.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'IE7.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the carbon cycle?', 'The movement of carbon through the atmosphere, living things, oceans, and Earth''s crust.', 'Photosynthesis, respiration, decomposition, combustion.', 2, 0),
    (v_tenant, v_ch, 'What is succession?', 'The gradual process of change in an ecosystem over time.', 'Life slowly returns after a disturbance.', 1, 1),
    (v_tenant, v_ch, 'What is an invasive species?', 'A non-native species that spreads and causes harm to an ecosystem.', 'It does not belong there.', 1, 2);


  -- ========================================================================
  -- UNIT 2: Physical Science — Mixtures and Solutions (MS7.1-MS7.3)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Mixtures and Solutions',
    'Distinguish between pure substances and mixtures using the particle model, investigate separation methods, and explore solution properties.',
    'Matter can be classified as pure substances or mixtures, and understanding their properties allows us to separate and use them.',
    'How can we classify, separate, and use different types of matter?')
  RETURNING id INTO v_unit;

  -- Chapter 3 — Pure Substances and Mixtures
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 3, 'Pure Substances and Mixtures', 'pure-substances-mixtures',
    'Distinguish between pure substances and mixtures using the particle model of matter.',
    '[
      {"type": "heading", "content": "Pure Substances and Mixtures", "level": 1},
      {"type": "text", "content": "All matter can be classified as either a pure substance or a mixture. Understanding the difference helps us work with materials in science, industry, and daily life."},
      {"type": "heading", "content": "Pure Substances", "level": 2},
      {"type": "text", "content": "A pure substance is made of only one type of particle:\n- Elements: cannot be broken down further (gold, oxygen, iron)\n- Compounds: two or more elements chemically combined (water = H2O, salt = NaCl)\n\nPure substances have consistent properties throughout."},
      {"type": "heading", "content": "Mixtures", "level": 2},
      {"type": "text", "content": "A mixture contains two or more substances not chemically combined:\n- Mechanical mixture: you can see the different parts (trail mix, salad, gravel)\n- Solution: one substance dissolves completely in another, looks uniform (salt water, pop, air)\n\nIn a solution, the substance that dissolves is the solute. The substance it dissolves in is the solvent."},
      {"type": "heading", "content": "Separating Mixtures", "level": 2},
      {"type": "text", "content": "Methods for separating mixtures:\n- Filtration: using a filter to separate solids from liquids\n- Evaporation: heating to remove the liquid, leaving the solid behind\n- Magnetism: using a magnet to pull out magnetic materials\n- Distillation: heating to evaporate and then cooling to condense a liquid"},
      {"type": "callout", "content": "A solution looks like a pure substance because you cannot see the parts separately. But it is still a mixture!", "style": "info"},
      {"type": "heading", "content": "Solubility and Concentration", "level": 2},
      {"type": "text", "content": "Solubility is how much solute can dissolve in a solvent at a given temperature. A concentrated solution has a lot of solute. A dilute solution has a little solute. Temperature often affects solubility — most solids dissolve better in warmer solvents."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Which is a solution?", "options": ["Trail mix", "Salt water", "Gravel", "Oil and water"], "correct": 1, "explanation": "Salt water is a solution — the salt (solute) dissolves completely in water (solvent) and looks uniform."},
      {"type": "quiz", "question": "What separation method uses a filter?", "options": ["Evaporation", "Distillation", "Filtration", "Magnetism"], "correct": 2, "explanation": "Filtration uses a filter to separate solid particles from a liquid."}
    ]'::jsonb,
    '[{"term": "Pure substance", "definition": "Matter made of only one type of particle (element or compound)"},
      {"term": "Mixture", "definition": "Two or more substances combined but not chemically joined"},
      {"term": "Solution", "definition": "A mixture where one substance dissolves completely in another"},
      {"term": "Solute", "definition": "The substance that dissolves in a solution"},
      {"term": "Solvent", "definition": "The substance that does the dissolving in a solution"},
      {"term": "Solubility", "definition": "The amount of solute that can dissolve in a solvent at a given temperature"},
      {"term": "Concentration", "definition": "The amount of solute dissolved in a given amount of solvent"}]'::jsonb,
    'Indigenous peoples separated and purified materials using many of the same principles scientists use today. Extracting dyes from plants, purifying water through sand and charcoal filters, and separating animal fats are all examples of applied separation techniques.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'MS7.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'MS7.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'MS7.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the difference between a mechanical mixture and a solution?', 'In a mechanical mixture you can see the parts. In a solution, one substance dissolves completely and looks uniform.', 'Trail mix vs. salt water.', 1, 0),
    (v_tenant, v_ch, 'What is a solute?', 'The substance that dissolves in a solution.', 'Salt in salt water.', 1, 1),
    (v_tenant, v_ch, 'Name two methods of separating mixtures.', 'Filtration and evaporation (also distillation and magnetism).', 'How do you get the parts apart?', 1, 2);


  -- ========================================================================
  -- UNIT 3: Physical Science — Heat and Temperature (HT7.1-HT7.3)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Heat and Temperature',
    'Investigate the particle theory, states of matter, and heat transfer via conduction, convection, and radiation.',
    'Heat is a form of energy that transfers from warmer to cooler objects through conduction, convection, and radiation.',
    'How does heat move, and how do we use it in daily life?')
  RETURNING id INTO v_unit;

  -- Chapter 4 — Heat Transfer
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 4, 'Heat Transfer', 'heat-transfer-7',
    'Investigate principles of heat transfer via conduction, convection, and radiation.',
    '[
      {"type": "heading", "content": "Heat Transfer", "level": 1},
      {"type": "text", "content": "Heat is thermal energy that flows from warmer objects to cooler ones. Temperature measures the average kinetic energy of particles. Heat always transfers from hot to cold until equilibrium is reached."},
      {"type": "heading", "content": "Three Methods of Heat Transfer", "level": 2},
      {"type": "text", "content": "Conduction: heat transfers through direct contact between particles. Metals are good conductors. Touch a metal spoon in hot soup and the handle gets warm.\n\nConvection: heat transfers through the movement of fluids (liquids and gases). Warm fluid rises, cool fluid sinks, creating convection currents. This is how a room heater warms a whole room.\n\nRadiation: heat transfers as electromagnetic waves without needing matter. The sun warms Earth through radiation across the vacuum of space."},
      {"type": "heading", "content": "Conductors and Insulators", "level": 2},
      {"type": "text", "content": "Conductors allow heat to flow easily (metals like copper and aluminum). Insulators slow or block heat flow (wood, plastic, wool, air). We use insulators to keep things warm (winter jackets) or cool (coolers for food)."},
      {"type": "callout", "content": "The particle theory explains heat transfer: when heated, particles move faster and bump into neighbouring particles, passing along the energy.", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "How does the sun warm the Earth?", "options": ["Conduction", "Convection", "Radiation", "Insulation"], "correct": 2, "explanation": "The sun warms Earth through radiation — electromagnetic waves that travel through the vacuum of space."},
      {"type": "quiz", "question": "Which is a good insulator?", "options": ["Copper", "Aluminum", "Wool", "Iron"], "correct": 2, "explanation": "Wool is a good insulator — it traps air and slows heat flow, keeping you warm."}
    ]'::jsonb,
    '[{"term": "Conduction", "definition": "Heat transfer through direct contact between particles"},
      {"term": "Convection", "definition": "Heat transfer through the movement of fluids (liquids and gases)"},
      {"term": "Radiation", "definition": "Heat transfer through electromagnetic waves without needing matter"},
      {"term": "Conductor", "definition": "A material that allows heat to flow easily"},
      {"term": "Insulator", "definition": "A material that slows or blocks heat flow"},
      {"term": "Thermal equilibrium", "definition": "When two objects reach the same temperature and heat stops flowing"}]'::jsonb,
    'Indigenous shelter design demonstrates mastery of heat transfer principles. Tipis used convection currents — smoke from the central fire rose and exited through the top opening while cool air entered through flaps at the base. Animal furs served as excellent insulators.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'HT7.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'HT7.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Name the three methods of heat transfer.', 'Conduction, convection, and radiation.', 'Contact, fluid movement, electromagnetic waves.', 1, 0),
    (v_tenant, v_ch, 'What is convection?', 'Heat transfer through the movement of fluids.', 'Warm air rises, cool air sinks.', 1, 1),
    (v_tenant, v_ch, 'What is the difference between a conductor and an insulator?', 'A conductor allows heat to flow easily. An insulator slows or blocks heat flow.', 'Metal vs. wool.', 1, 2);


  -- ========================================================================
  -- UNIT 4: Earth and Space Science — Earth''s Crust (EC7.1-EC7.3)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Earth''s Crust',
    'Analyze geological events, resource extraction impacts, and Saskatchewan''s surface geology.',
    'Earth''s crust is dynamic — shaped by internal forces and external processes — and provides resources that impact society and the environment.',
    'How do forces within and on Earth''s crust shape our province and our lives?')
  RETURNING id INTO v_unit;

  -- Chapter 5 — Plate Tectonics and Geological Events
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 5, 'Plate Tectonics and Geological Events', 'plate-tectonics',
    'Analyze societal and environmental impacts of geological events and forces within Earth''s crust.',
    '[
      {"type": "heading", "content": "Plate Tectonics and Geological Events", "level": 1},
      {"type": "text", "content": "Earth''s outer layer (the crust) is broken into large pieces called tectonic plates. These plates float on the semi-liquid mantle below and are constantly moving, though very slowly."},
      {"type": "heading", "content": "Plate Boundaries", "level": 2},
      {"type": "text", "content": "Where plates meet, geological activity occurs:\n- Convergent boundaries: plates push together (can form mountains, cause earthquakes)\n- Divergent boundaries: plates pull apart (magma rises to fill the gap, creating new crust)\n- Transform boundaries: plates slide past each other (causes earthquakes, like the San Andreas Fault)"},
      {"type": "heading", "content": "Geological Events", "level": 2},
      {"type": "text", "content": "Earthquakes occur when plates shift suddenly. Volcanoes form where magma reaches the surface. Tsunamis are giant waves caused by underwater earthquakes. These events have shaped Earth for billions of years."},
      {"type": "heading", "content": "Saskatchewan''s Geology", "level": 2},
      {"type": "text", "content": "Saskatchewan''s landscape was shaped by glaciers during the last major glacial period. As glaciers retreated about 10,000 years ago, they left behind moraines (hills of glacial deposits), pothole lakes, the Qu''Appelle Valley, and thick layers of fertile soil."},
      {"type": "callout", "content": "Saskatchewan sits on ancient bedrock that is over a billion years old, but the surface landscape is relatively young — shaped primarily by glacial activity.", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What happens at convergent plate boundaries?", "options": ["Plates pull apart", "Plates slide past each other", "Plates push together", "Nothing happens"], "correct": 2, "explanation": "At convergent boundaries, plates push together, which can create mountains and cause earthquakes."},
      {"type": "quiz", "question": "What shaped Saskatchewan''s landscape?", "options": ["Volcanoes", "Glaciers", "Earthquakes", "Tsunamis"], "correct": 1, "explanation": "Glaciers during the last major glacial period carved valleys, deposited moraines, and left fertile soil across Saskatchewan."}
    ]'::jsonb,
    '[{"term": "Tectonic plate", "definition": "A large piece of Earth''s crust that floats on the mantle"},
      {"term": "Earthquake", "definition": "A sudden shaking of the ground caused by movement of tectonic plates"},
      {"term": "Volcano", "definition": "An opening in Earth''s crust where magma reaches the surface"},
      {"term": "Glacier", "definition": "A large mass of ice that moves slowly over land"},
      {"term": "Moraine", "definition": "A hill or ridge of material deposited by a glacier"}]'::jsonb,
    'Indigenous oral histories often include accounts of major geological events that correspond to scientific records. Stories about great floods, land movements, and volcanic events have been preserved for thousands of years, providing historical records that complement geological evidence.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'EC7.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'EC7.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a tectonic plate?', 'A large piece of Earth''s crust that floats on the mantle.', 'Earth''s surface is like a cracked eggshell.', 1, 0),
    (v_tenant, v_ch, 'Name the three types of plate boundaries.', 'Convergent, divergent, and transform.', 'Push together, pull apart, slide past.', 2, 1),
    (v_tenant, v_ch, 'What shaped Saskatchewan''s landscape?', 'Glaciers during the last major glacial period.', 'They retreated about 10,000 years ago.', 1, 2);

  RAISE NOTICE 'Grade 7 Science content seeded successfully.';
END $$;


-- ============================================================================
-- GRADE 8 — WolfWhale Science 8
-- Outcomes: CS8.1-CS8.4, FD8.1-FD8.4, OP8.1-OP8.4, WS8.1-WS8.3
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
    WHERE tenant_id = v_tenant AND slug = 'wolfwhale-science-8';

  -- ========================================================================
  -- UNIT 1: Life Science — Cells and Systems (CS8.1-CS8.4)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Cells and Body Systems',
    'Analyze cell characteristics, compare plant and animal cells, use microscopes, and understand how cells form tissues, organs, and organ systems.',
    'Cells are the basic units of life, organized into tissues, organs, and systems that work together.',
    'How do cells work together to keep the human body functioning?')
  RETURNING id INTO v_unit;

  -- Chapter 1 — Cell Structure
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 1, 'Cell Structure', 'cell-structure-8',
    'Analyze characteristics of cells and compare plant and animal cells.',
    '[
      {"type": "heading", "content": "Cell Structure", "level": 1},
      {"type": "text", "content": "Cells are the basic building blocks of all living things. Some organisms are made of a single cell (unicellular) while others, like humans, are made of trillions of cells (multicellular)."},
      {"type": "heading", "content": "Parts of a Cell", "level": 2},
      {"type": "text", "content": "All cells share some basic structures:\n- Cell membrane: controls what enters and leaves the cell\n- Cytoplasm: gel-like fluid that fills the cell\n- Nucleus: the control centre containing DNA\n- Mitochondria: produce energy for the cell (cellular respiration)\n- Ribosomes: make proteins"},
      {"type": "heading", "content": "Plant vs Animal Cells", "level": 2},
      {"type": "text", "content": "Plant cells have additional structures:\n- Cell wall: a rigid outer layer that provides support\n- Chloroplasts: contain chlorophyll for photosynthesis\n- Large central vacuole: stores water and nutrients\n\nAnimal cells lack a cell wall, chloroplasts, and a large central vacuole but may have small vacuoles."},
      {"type": "heading", "content": "Levels of Organization", "level": 2},
      {"type": "text", "content": "Cells → Tissues → Organs → Organ Systems → Organism\n\nCells with similar jobs group together to form tissues. Tissues form organs. Organs work together as organ systems. All systems together make up the organism."},
      {"type": "callout", "content": "You need a microscope to see most cells. A compound light microscope can magnify up to 1000x, making cells visible.", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Which structure is found in plant cells but NOT in animal cells?", "options": ["Cell membrane", "Nucleus", "Cell wall", "Mitochondria"], "correct": 2, "explanation": "Plant cells have a cell wall for support. Animal cells have only a cell membrane."},
      {"type": "quiz", "question": "What is the correct order of organization?", "options": ["Organ → Tissue → Cell", "Cell → Tissue → Organ", "Tissue → Cell → Organ", "Organ → Cell → Tissue"], "correct": 1, "explanation": "Cells form tissues, tissues form organs, organs form organ systems."}
    ]'::jsonb,
    '[{"term": "Cell", "definition": "The basic unit of structure and function in all living things"},
      {"term": "Cell membrane", "definition": "The thin outer covering that controls what enters and leaves the cell"},
      {"term": "Nucleus", "definition": "The control centre of the cell containing DNA"},
      {"term": "Mitochondria", "definition": "Cell structures that produce energy through cellular respiration"},
      {"term": "Chloroplast", "definition": "Cell structure in plants that contains chlorophyll for photosynthesis"},
      {"term": "Tissue", "definition": "A group of similar cells working together to perform a function"}]'::jsonb,
    'Indigenous healing practices recognized the importance of cellular health long before microscopes existed. Traditional medicines target specific body functions at a fundamental level, reflecting deep empirical understanding of how the body works.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CS8.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CS8.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CS8.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the basic unit of life?', 'The cell.', 'All living things are made of them.', 1, 0),
    (v_tenant, v_ch, 'Name two structures in plant cells but not animal cells.', 'Cell wall and chloroplasts.', 'Support and photosynthesis.', 1, 1),
    (v_tenant, v_ch, 'What do mitochondria do?', 'Produce energy for the cell through cellular respiration.', 'The powerhouse of the cell.', 1, 2),
    (v_tenant, v_ch, 'What is the order of biological organization?', 'Cell → Tissue → Organ → Organ System → Organism.', 'Small to large.', 2, 3);


  -- ========================================================================
  -- UNIT 2: Physical Science — Optics (OP8.1-OP8.4)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Optics',
    'Investigate sources and properties of visible light, explore optical technologies, and evaluate impacts of electromagnetic radiation.',
    'Light has measurable properties and interacts with mirrors and lenses to create technologies that extend human vision.',
    'How do we use the properties of light to see and understand the world?')
  RETURNING id INTO v_unit;

  -- Chapter 2 — Light and Optical Devices
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 2, 'Light and Optical Devices', 'light-optical-devices',
    'Investigate properties of light including reflection and refraction, and explore mirrors and lenses.',
    '[
      {"type": "heading", "content": "Light and Optical Devices", "level": 1},
      {"type": "text", "content": "Light travels in straight lines (rectilinear propagation). When light meets a surface, it can be reflected, refracted, or absorbed. Understanding these properties has led to many optical technologies."},
      {"type": "heading", "content": "Laws of Reflection", "level": 2},
      {"type": "text", "content": "When light reflects off a smooth surface, the angle of incidence equals the angle of reflection. This principle governs how mirrors work.\n\nConcave mirrors (curved inward) can focus light and magnify images. They are used in telescopes and satellite dishes.\nConvex mirrors (curved outward) spread light and show a wider view. They are used as car side mirrors and security mirrors."},
      {"type": "heading", "content": "Refraction and Lenses", "level": 2},
      {"type": "text", "content": "Lenses use refraction to bend light:\n- Convex lenses (thicker in the middle) converge light and magnify images. Used in magnifying glasses and cameras.\n- Concave lenses (thinner in the middle) diverge light and make images smaller. Used to correct nearsightedness."},
      {"type": "heading", "content": "The Electromagnetic Spectrum", "level": 2},
      {"type": "text", "content": "Visible light is just a small part of the electromagnetic spectrum, which also includes radio waves, microwaves, infrared, ultraviolet, X-rays, and gamma rays. Different types of electromagnetic radiation have different wavelengths and uses."},
      {"type": "callout", "content": "Your eyes are natural optical devices! The cornea and lens refract light to focus images on the retina.", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What type of mirror is used in a car side mirror?", "options": ["Concave", "Convex", "Flat", "None"], "correct": 1, "explanation": "Convex mirrors are used as side mirrors because they show a wider field of view."},
      {"type": "quiz", "question": "What does a convex lens do to light?", "options": ["Spreads it out", "Blocks it", "Converges (focuses) it", "Absorbs it"], "correct": 2, "explanation": "Convex lenses converge light rays to a focal point, which is how magnifying glasses work."}
    ]'::jsonb,
    '[{"term": "Reflection", "definition": "When light bounces off a surface"},
      {"term": "Refraction", "definition": "When light bends as it passes from one material to another"},
      {"term": "Concave mirror", "definition": "A mirror that curves inward, focusing light to a point"},
      {"term": "Convex lens", "definition": "A lens thicker in the middle that converges light and magnifies"},
      {"term": "Electromagnetic spectrum", "definition": "The full range of electromagnetic radiation from radio waves to gamma rays"}]'::jsonb,
    'Indigenous peoples used reflective surfaces of still water and polished stones to observe and signal. Understanding of light properties is evident in traditional practices like using ice as a magnifying lens to start fires in winter.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'OP8.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'OP8.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the law of reflection?', 'The angle of incidence equals the angle of reflection.', 'Light bounces at the same angle.', 2, 0),
    (v_tenant, v_ch, 'What does a concave mirror do?', 'It curves inward and focuses light to a point.', 'Used in telescopes.', 1, 1),
    (v_tenant, v_ch, 'What is the electromagnetic spectrum?', 'The full range of electromagnetic radiation from radio waves to gamma rays.', 'Visible light is just a small part.', 2, 2);


  -- ========================================================================
  -- UNIT 3: Earth and Space Science — Water Systems (WS8.1-WS8.3)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Water Systems',
    'Analyze impacts on water distribution, examine how wind, water, and ice shape the landscape, and analyze factors affecting marine and freshwater environments.',
    'Water systems shape landscapes and support life, and human activities significantly affect water quality and distribution.',
    'How do water systems shape our world, and how can we protect them?')
  RETURNING id INTO v_unit;

  -- Chapter 3 — Water and the Canadian Landscape
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 3, 'Water and the Canadian Landscape', 'water-canadian-landscape',
    'Examine how wind, water, and ice shape the Canadian landscape and analyze impacts on water distribution.',
    '[
      {"type": "heading", "content": "Water and the Canadian Landscape", "level": 1},
      {"type": "text", "content": "Water is one of the most powerful forces shaping Earth''s surface. Rivers carve valleys, glaciers sculpt mountains, and waves reshape coastlines. Canada has more freshwater lakes than any other country."},
      {"type": "heading", "content": "Shaping the Land", "level": 2},
      {"type": "text", "content": "Water shapes the landscape through:\n- River erosion: rivers cut channels, create valleys, and deposit sediment in deltas\n- Glacial erosion: glaciers carved out the Great Lakes, U-shaped valleys, and deposited moraines across the prairies\n- Wave action: ocean waves erode coastlines and deposit sand beaches\n- Groundwater: dissolves underground rock to form caves and sinkholes"},
      {"type": "heading", "content": "Canada''s Watersheds", "level": 2},
      {"type": "text", "content": "A watershed is an area of land where all water drains to a common point. Canada has five major ocean drainage basins: Arctic, Atlantic, Pacific, Hudson Bay, and Gulf of Mexico. Saskatchewan''s rivers drain mainly to Hudson Bay."},
      {"type": "heading", "content": "Threats to Water Systems", "level": 2},
      {"type": "text", "content": "Human activities threaten water systems:\n- Agricultural runoff (fertilizers, pesticides)\n- Industrial pollution and mining waste\n- Urban development near waterways\n- Climate change affecting glaciers and precipitation patterns\n- Overuse of groundwater"},
      {"type": "callout", "content": "Fresh water makes up only about 2.5% of all water on Earth, and most of it is frozen in glaciers and ice caps. Clean, accessible fresh water is precious.", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is a watershed?", "options": ["A shed near a lake", "An area of land where all water drains to a common point", "A type of dam", "A water treatment plant"], "correct": 1, "explanation": "A watershed is an area of land where all water flows downhill to the same river, lake, or ocean."},
      {"type": "quiz", "question": "What percentage of Earth''s water is fresh water?", "options": ["25%", "10%", "2.5%", "50%"], "correct": 2, "explanation": "Only about 2.5% of Earth''s water is fresh water, and most of that is locked in glaciers."}
    ]'::jsonb,
    '[{"term": "Watershed", "definition": "An area of land where all water drains to a common point"},
      {"term": "Erosion", "definition": "The wearing away and movement of rock and soil by water, wind, or ice"},
      {"term": "Delta", "definition": "A fan-shaped deposit of sediment where a river meets a lake or ocean"},
      {"term": "Groundwater", "definition": "Water stored in underground rock and soil"},
      {"term": "Drainage basin", "definition": "The entire area drained by a river and its tributaries"}]'::jsonb,
    'Water is sacred to Indigenous peoples and is often referred to as the lifeblood of Mother Earth. Water Walks led by Indigenous women raise awareness about water protection. Treaty rights include protection of water sources, recognizing water''s fundamental importance.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'WS8.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'WS8.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a watershed?', 'An area of land where all water drains to a common point.', 'All water flows downhill to the same place.', 1, 0),
    (v_tenant, v_ch, 'What percentage of Earth''s water is fresh water?', 'About 2.5%.', 'Most water is salty ocean water.', 1, 1),
    (v_tenant, v_ch, 'Where do most of Saskatchewan''s rivers drain to?', 'Hudson Bay.', 'Through northern rivers.', 1, 2);

  RAISE NOTICE 'Grade 8 Science content seeded successfully.';
END $$;


-- ============================================================================
-- GRADE 9 — WolfWhale Science 9
-- Outcomes: AE9.1-AE9.3, CE9.1-CE9.4, EU9.1-EU9.4, RE9.1-RE9.4
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
    WHERE tenant_id = v_tenant AND slug = 'wolfwhale-science-9';

  -- ========================================================================
  -- UNIT 1: Physical Science — Atoms and Elements (AE9.1-AE9.3)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Atoms and Elements',
    'Distinguish between physical and chemical properties, analyze atomic models, and understand the Periodic Table.',
    'All matter is made of atoms, and the arrangement of atoms determines the properties of substances.',
    'How does the structure of atoms explain the properties of matter?')
  RETURNING id INTO v_unit;

  -- Chapter 1 — Atomic Structure and the Periodic Table
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 1, 'Atomic Structure and the Periodic Table', 'atomic-structure-periodic-table',
    'Analyze historical atomic models and understand the Periodic Table.',
    '[
      {"type": "heading", "content": "Atomic Structure and the Periodic Table", "level": 1},
      {"type": "text", "content": "All matter is made of atoms — tiny particles far too small to see. The idea of atoms has evolved over centuries, with each model building on previous understanding."},
      {"type": "heading", "content": "Evolution of Atomic Models", "level": 2},
      {"type": "text", "content": "Atomic models through history:\n- Dalton (1803): atoms are tiny, indivisible spheres\n- Thomson (1897): atoms contain negative charges (electrons) in a positive sphere (plum pudding model)\n- Rutherford (1911): atoms have a dense positive nucleus with electrons orbiting around it\n- Bohr (1913): electrons orbit the nucleus in specific energy levels (shells)"},
      {"type": "heading", "content": "Parts of an Atom", "level": 2},
      {"type": "text", "content": "An atom contains:\n- Protons: positive charge, found in the nucleus\n- Neutrons: no charge, found in the nucleus\n- Electrons: negative charge, orbit the nucleus in energy levels\n\nThe atomic number is the number of protons and defines the element. The mass number is the total of protons and neutrons."},
      {"type": "heading", "content": "The Periodic Table", "level": 2},
      {"type": "text", "content": "The Periodic Table organizes all known elements by atomic number. Elements in the same column (group) have similar chemical properties. Rows are called periods. The table classifies elements as metals, non-metals, and metalloids."},
      {"type": "callout", "content": "There are 118 known elements. The first 92 occur naturally. Elements like gold (Au), silver (Ag), copper (Cu), and iron (Fe) have been known for thousands of years.", "style": "info"},
      {"type": "heading", "content": "Physical and Chemical Properties", "level": 2},
      {"type": "text", "content": "Physical properties can be observed without changing the substance (colour, density, melting point). Chemical properties describe how a substance reacts with other substances (flammability, reactivity with acids, ability to rust)."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What defines which element an atom is?", "options": ["Number of neutrons", "Number of electrons", "Number of protons (atomic number)", "Mass number"], "correct": 2, "explanation": "The number of protons (atomic number) determines which element an atom is."},
      {"type": "quiz", "question": "In the Bohr model, where are electrons found?", "options": ["Inside the nucleus", "Scattered randomly", "In specific energy levels", "Outside the atom"], "correct": 2, "explanation": "The Bohr model places electrons in specific energy levels (shells) orbiting the nucleus."}
    ]'::jsonb,
    '[{"term": "Atom", "definition": "The smallest particle of an element that still has the properties of that element"},
      {"term": "Proton", "definition": "A positively charged particle found in the nucleus of an atom"},
      {"term": "Neutron", "definition": "A particle with no charge found in the nucleus of an atom"},
      {"term": "Electron", "definition": "A negatively charged particle that orbits the nucleus"},
      {"term": "Atomic number", "definition": "The number of protons in an atom, which determines the element"},
      {"term": "Periodic Table", "definition": "A chart organizing all known elements by atomic number and properties"}]'::jsonb,
    'Indigenous metallurgy, including the use of native copper by various First Nations, represents early applied chemistry. Understanding the properties of metals and minerals for tools, weapons, and ceremonial objects demonstrates empirical knowledge of elemental properties.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'AE9.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'AE9.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'AE9.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are the three particles in an atom?', 'Protons (positive), neutrons (neutral), electrons (negative).', 'Two in the nucleus, one orbiting.', 1, 0),
    (v_tenant, v_ch, 'What determines which element an atom is?', 'The number of protons (atomic number).', 'Protons define the element.', 1, 1),
    (v_tenant, v_ch, 'Name the four historical atomic models in order.', 'Dalton, Thomson, Rutherford, Bohr.', '1803, 1897, 1911, 1913.', 2, 2),
    (v_tenant, v_ch, 'What is the difference between physical and chemical properties?', 'Physical: observed without changing the substance. Chemical: describe how it reacts.', 'Colour vs. flammability.', 2, 3);


  -- ========================================================================
  -- UNIT 2: Physical Science — Electricity (CE9.1-CE9.4)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Characteristics of Electricity',
    'Analyze static and current electricity, explore voltage/current/resistance relationships, and critique electrical energy production methods.',
    'Electricity is a fundamental force that follows predictable rules and powers modern society, requiring sustainable production methods.',
    'How does electricity work, and how can we produce it sustainably?')
  RETURNING id INTO v_unit;

  -- Chapter 2 — Circuits and Ohm''s Law
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 2, 'Circuits and Ohm''s Law', 'circuits-ohms-law',
    'Analyze relationships among voltage, current, and resistance in series and parallel circuits.',
    '[
      {"type": "heading", "content": "Circuits and Ohm''s Law", "level": 1},
      {"type": "text", "content": "Electric current is the flow of electrons through a conductor. For current to flow, there must be a complete circuit — an unbroken path from the power source through the load and back."},
      {"type": "heading", "content": "Voltage, Current, and Resistance", "level": 2},
      {"type": "text", "content": "Three key electrical quantities:\n- Voltage (V): the force that pushes electrons through a circuit, measured in volts (V)\n- Current (I): the rate of electron flow, measured in amperes (A)\n- Resistance (R): opposition to current flow, measured in ohms (Ω)\n\nOhm''s Law: V = I × R"},
      {"type": "heading", "content": "Series and Parallel Circuits", "level": 2},
      {"type": "text", "content": "Series circuits: components connected in a single path. If one component fails, the entire circuit stops. Current is the same everywhere.\n\nParallel circuits: components connected in separate branches. If one branch fails, others keep working. Voltage is the same across each branch. Your home uses parallel circuits."},
      {"type": "callout", "content": "Ohm''s Law (V = IR) lets you calculate any one quantity if you know the other two. Double the resistance with the same voltage? Current is halved.", "style": "info"},
      {"type": "heading", "content": "Electrical Energy Production", "level": 2},
      {"type": "text", "content": "Saskatchewan produces electricity through:\n- Natural gas and coal power plants (fossil fuels)\n- Hydroelectric dams (water power)\n- Wind farms (wind energy)\n- Solar installations (solar energy)\n\nSaskatchewan is working to reduce fossil fuel use and increase renewable energy sources."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is Ohm''s Law?", "options": ["V = I + R", "V = I × R", "V = I / R", "V = I - R"], "correct": 1, "explanation": "Ohm''s Law states that Voltage = Current × Resistance (V = IR)."},
      {"type": "quiz", "question": "In a parallel circuit, what happens if one branch fails?", "options": ["The whole circuit stops", "Other branches keep working", "Voltage increases", "Current reverses"], "correct": 1, "explanation": "In parallel circuits, each branch is independent. If one fails, the others continue to work."}
    ]'::jsonb,
    '[{"term": "Voltage", "definition": "The force that pushes electrons through a circuit, measured in volts (V)"},
      {"term": "Current", "definition": "The rate of electron flow through a circuit, measured in amperes (A)"},
      {"term": "Resistance", "definition": "Opposition to current flow, measured in ohms (Ω)"},
      {"term": "Ohm''s Law", "definition": "V = IR; the relationship between voltage, current, and resistance"},
      {"term": "Series circuit", "definition": "A circuit where components are connected in a single path"},
      {"term": "Parallel circuit", "definition": "A circuit where components are connected in separate branches"}]'::jsonb,
    'Before European contact, Indigenous peoples observed and understood natural electrical phenomena. Lightning was understood as a powerful force of nature, and static electricity was observed during dry winter conditions. Today, many First Nations communities are investing in renewable energy projects on their territories.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CE9.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CE9.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CE9.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'State Ohm''s Law.', 'V = I × R (Voltage = Current × Resistance).', 'V = IR.', 2, 0),
    (v_tenant, v_ch, 'What is the difference between series and parallel circuits?', 'Series: one path. Parallel: multiple branches.', 'Series: all-or-nothing. Parallel: independent.', 1, 1),
    (v_tenant, v_ch, 'What unit is resistance measured in?', 'Ohms (Ω).', 'Named after Georg Ohm.', 1, 2);


  -- ========================================================================
  -- UNIT 3: Life Science — Reproduction (RE9.1-RE9.4)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Reproduction and Human Development',
    'Examine genetic information transfer, cellular reproduction (mitosis and meiosis), and processes of sexual and asexual reproduction.',
    'Reproduction ensures the continuation of species, involving the transfer of genetic information through cellular processes.',
    'How do living things reproduce and pass on genetic information?')
  RETURNING id INTO v_unit;

  -- Chapter 3 — Genetics and Cell Division
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 3, 'Genetics and Cell Division', 'genetics-cell-division',
    'Examine the transfer of genetic information and observe cellular reproductive processes including mitosis and meiosis.',
    '[
      {"type": "heading", "content": "Genetics and Cell Division", "level": 1},
      {"type": "text", "content": "DNA (deoxyribonucleic acid) is the molecule that carries genetic information in all living things. It is found in the nucleus of cells, organized into structures called chromosomes. Human cells have 46 chromosomes (23 pairs)."},
      {"type": "heading", "content": "DNA and Genes", "level": 2},
      {"type": "text", "content": "DNA is shaped like a twisted ladder (double helix). Sections of DNA that code for specific traits are called genes. Genes determine characteristics like eye colour, hair colour, and blood type. You inherit half your genes from each parent."},
      {"type": "heading", "content": "Mitosis", "level": 2},
      {"type": "text", "content": "Mitosis is cell division for growth and repair. One cell divides to produce two identical daughter cells, each with 46 chromosomes. Stages: Prophase → Metaphase → Anaphase → Telophase.\n\nMitosis is responsible for growing taller, healing cuts, and replacing worn-out cells."},
      {"type": "heading", "content": "Meiosis", "level": 2},
      {"type": "text", "content": "Meiosis is cell division that produces sex cells (gametes — sperm and eggs). One cell divides twice to produce four cells, each with only 23 chromosomes (half the normal number). When a sperm and egg unite, the full 46 chromosomes are restored."},
      {"type": "heading", "content": "Sexual vs Asexual Reproduction", "level": 2},
      {"type": "text", "content": "Sexual reproduction involves two parents and creates genetically unique offspring. Asexual reproduction involves one parent and creates genetically identical offspring (clones). Many plants can reproduce both ways."},
      {"type": "callout", "content": "Genetic diversity from sexual reproduction helps species survive changing environments. If all organisms were identical, a single disease could wipe out the entire population.", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "How many chromosomes are in a human body cell?", "options": ["23", "46", "92", "12"], "correct": 1, "explanation": "Human body cells contain 46 chromosomes (23 pairs)."},
      {"type": "quiz", "question": "What is the purpose of meiosis?", "options": ["Growth", "Repair", "Producing sex cells with half the chromosomes", "Digestion"], "correct": 2, "explanation": "Meiosis produces sex cells (gametes) with 23 chromosomes — half the normal number."}
    ]'::jsonb,
    '[{"term": "DNA", "definition": "Deoxyribonucleic acid — the molecule carrying genetic information in all living things"},
      {"term": "Gene", "definition": "A section of DNA that codes for a specific trait"},
      {"term": "Chromosome", "definition": "A structure in the cell nucleus made of DNA and protein"},
      {"term": "Mitosis", "definition": "Cell division producing two identical cells for growth and repair"},
      {"term": "Meiosis", "definition": "Cell division producing four cells with half the chromosomes for reproduction"},
      {"term": "Gamete", "definition": "A sex cell (sperm or egg) with half the normal number of chromosomes"}]'::jsonb,
    'Indigenous peoples have practiced selective plant cultivation for thousands of years, demonstrating practical understanding of genetics and heredity. Selecting seeds from the best-performing plants each year gradually improved crop varieties — the same principle behind modern genetics.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'RE9.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'RE9.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'RE9.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is DNA?', 'The molecule that carries genetic information in all living things.', 'Shaped like a double helix.', 1, 0),
    (v_tenant, v_ch, 'What is the difference between mitosis and meiosis?', 'Mitosis: 1 cell → 2 identical cells (growth). Meiosis: 1 cell → 4 cells with half the chromosomes (reproduction).', 'Growth vs. sex cells.', 2, 1),
    (v_tenant, v_ch, 'How many chromosomes are in a human sex cell?', '23 (half of 46).', 'Sperm and eggs have half.', 2, 2);


  -- ========================================================================
  -- UNIT 4: Earth and Space Science — Exploring the Universe (EU9.1-EU9.4)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Exploring the Universe',
    'Inquire into astronomical bodies, analyze formation of the solar system and universe, examine cultural perspectives on astronomy, and evaluate space exploration.',
    'The universe is vast and ancient, and understanding it requires multiple perspectives including scientific and Indigenous knowledge.',
    'What is our place in the universe, and how do different cultures understand the cosmos?')
  RETURNING id INTO v_unit;

  -- Chapter 4 — The Universe and Space Exploration
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 4, 'The Universe and Space Exploration', 'universe-space-exploration',
    'Explore the formation of the universe and solar system, and evaluate space exploration technologies.',
    '[
      {"type": "heading", "content": "The Universe and Space Exploration", "level": 1},
      {"type": "text", "content": "The universe is everything that exists — all matter, energy, space, and time. It is approximately 13.8 billion years old and contains billions of galaxies, each with billions of stars."},
      {"type": "heading", "content": "The Big Bang Theory", "level": 2},
      {"type": "text", "content": "Scientists believe the universe began with the Big Bang approximately 13.8 billion years ago. A single point of infinite density and temperature rapidly expanded, creating space, time, and all matter. The universe is still expanding today."},
      {"type": "heading", "content": "Stars and Galaxies", "level": 2},
      {"type": "text", "content": "Stars form from collapsing clouds of gas and dust. They go through life stages:\n- Nebula → protostar → main sequence star → red giant → white dwarf (for smaller stars)\n- Massive stars end as supernovae and can become neutron stars or black holes\n\nOur sun is a medium-sized star. Our galaxy, the Milky Way, contains about 100-400 billion stars."},
      {"type": "heading", "content": "Space Exploration", "level": 2},
      {"type": "text", "content": "Humans explore space using:\n- Telescopes (ground-based and space-based like Hubble and James Webb)\n- Satellites for communication, weather, and GPS\n- Rovers (like those exploring Mars)\n- Crewed missions (International Space Station)\n- Canadian contributions: Canadarm, Chris Hadfield''s ISS command"},
      {"type": "callout", "content": "The James Webb Space Telescope can see galaxies that formed over 13 billion years ago, near the beginning of the universe.", "style": "tip"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "How old is the universe?", "options": ["4.5 billion years", "13.8 billion years", "1 million years", "100 billion years"], "correct": 1, "explanation": "The universe is approximately 13.8 billion years old, according to the Big Bang theory."},
      {"type": "quiz", "question": "What is Canada''s most famous contribution to space technology?", "options": ["A space shuttle", "The Canadarm", "A Mars rover", "A space telescope"], "correct": 1, "explanation": "The Canadarm is a robotic arm used on the Space Shuttle and International Space Station, designed and built in Canada."}
    ]'::jsonb,
    '[{"term": "Universe", "definition": "Everything that exists — all matter, energy, space, and time"},
      {"term": "Big Bang", "definition": "The theory that the universe began from a single point approximately 13.8 billion years ago"},
      {"term": "Galaxy", "definition": "A massive collection of stars, gas, and dust held together by gravity"},
      {"term": "Light year", "definition": "The distance light travels in one year (about 9.5 trillion kilometres)"},
      {"term": "Nebula", "definition": "A cloud of gas and dust in space where stars form"},
      {"term": "Supernova", "definition": "The explosive death of a massive star"}]'::jsonb,
    'Indigenous star knowledge represents thousands of years of astronomical observation. The Cree, Lakota, and other nations identified constellations, tracked celestial movements, and used star positions for navigation and seasonal timing. These knowledge systems offer complementary perspectives to Western astronomy and are now being formally recognized by astronomers.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'EU9.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'EU9.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'EU9.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'EU9.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the Big Bang theory?', 'The theory that the universe began from a single point approximately 13.8 billion years ago and has been expanding ever since.', 'Everything started from one point.', 2, 0),
    (v_tenant, v_ch, 'What is a galaxy?', 'A massive collection of stars, gas, and dust held together by gravity.', 'The Milky Way is ours.', 1, 1),
    (v_tenant, v_ch, 'What is a light year?', 'The distance light travels in one year (about 9.5 trillion kilometres).', 'A unit of distance, not time.', 2, 2),
    (v_tenant, v_ch, 'What is Canada''s Canadarm?', 'A robotic arm used on the Space Shuttle and ISS, designed and built in Canada.', 'Canadian space technology.', 1, 3);

  RAISE NOTICE 'Grade 9 Science content seeded successfully.';
END $$;
