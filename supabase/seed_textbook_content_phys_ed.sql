-- ============================================================================
-- WolfWhale Physical Education Textbook Content Seed Data
-- Grades K through 9 (Saskatchewan Curriculum)
--
-- 10 Textbooks:
--   wolfwhale-phys-ed-k through wolfwhale-phys-ed-9
--
-- Each textbook contains 4 chapters with:
--   - Rich JSONB content blocks (heading, text, callout, list, quiz)
--   - Key terms with definitions
--   - Indigenous connections (games, traditions, outdoor knowledge)
--   - Flashcards for spaced repetition
--
-- All content is 100% original. No copied material from any publisher.
-- tenant_id uses placeholder UUID: 00000000-0000-0000-0000-000000000001
-- Saskatchewan context: prairies, winter sports, community recreation
-- ============================================================================


-- ============================================================================
-- TEXTBOOK 1: WolfWhale Phys Ed K
-- Slug: wolfwhale-phys-ed-k
-- Chapters: Fundamental Movement, Body Awareness, Active Play, Outdoor Learning
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-phys-ed-k';

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Moving and Growing',
    'Kindergarten students explore how their bodies move, build fundamental movement skills, and discover the joy of active outdoor play on the Saskatchewan prairies.',
    'Moving our bodies every day keeps us healthy, happy, and connected to the world around us.',
    'What can my body do, and how does moving make me feel?')
  RETURNING id INTO v_unit;

  -- Chapter 1: Fundamental Movement
  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Fundamental Movement', 'fundamental-movement-k',
    'Discover the basic ways our bodies move: walking, running, jumping, hopping, and more.',
    '[
      {"type": "heading", "content": "Fundamental Movement", "level": 1},
      {"type": "text", "content": "Your body is an amazing machine that can move in many different ways. Walking to school, jumping over a puddle, spinning around with your arms out wide — all of these are types of movement. In physical education we practice the basic building blocks of movement so that every activity you try in life becomes easier and more fun."},
      {"type": "text", "content": "There are three big groups of fundamental movement skills. Locomotor skills move your whole body from one place to another — think of running, skipping, hopping, leaping, and galloping. Stability skills help you balance and control your body in one spot — think of spinning, stretching, and twisting. Manipulative skills involve moving an object with your hands, feet, or another body part — think of throwing, catching, and kicking a ball."},
      {"type": "callout", "style": "info", "title": "What Are Fundamental Movement Skills?", "content": "Fundamental movement skills are the basic patterns of movement that form the building blocks for all sports and physical activities. Mastering these early makes learning any game or sport much easier."},
      {"type": "list", "style": "unordered", "items": ["Locomotor: walking, running, jumping, hopping, skipping, galloping, sliding", "Stability: balancing, twisting, stretching, spinning, landing", "Manipulative: throwing, catching, kicking, striking, bouncing"]},
      {"type": "text", "content": "On the Saskatchewan prairies, children have always played outdoors through long summers and snowy winters. Running across an open field, leaping over a frozen creek, and sliding on an icy hill are all ways prairie kids have practiced fundamental movement for generations. Every game you play outside is really just a combination of these basic skills put together in creative ways."},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "Many First Nations communities across the prairies played a game called Blanket Toss, where a group of people work together to toss one person high into the air using a large piece of hide or blanket. This activity builds trust, cooperation, and balance — all important movement qualities."},
      {"type": "quiz", "question": "Which of the following is a locomotor skill?", "options": ["Balancing on one foot", "Skipping across the gym", "Catching a ball", "Stretching your arms"], "correctIndex": 1, "explanation": "Skipping moves your whole body from one place to another, which makes it a locomotor skill. Balancing is a stability skill, catching is a manipulative skill, and stretching is also a stability skill."}
    ]'::jsonb,
    '[
      {"term": "Locomotor Skill", "definition": "A movement that travels your whole body from one place to another, like running or jumping."},
      {"term": "Stability Skill", "definition": "A movement that keeps your body balanced and controlled in one spot, like balancing or stretching."},
      {"term": "Manipulative Skill", "definition": "A movement that involves controlling an object with your hands or feet, like throwing or kicking."},
      {"term": "Fundamental Movement", "definition": "The basic patterns of movement that are the building blocks for all sports and games."},
      {"term": "Gallop", "definition": "A locomotor skill where one foot leads and the other follows in a step-together pattern."}
    ]'::jsonb,
    'Many First Nations communities across the prairies have long used cooperative physical games to build community strength, trust, and body awareness. The Blanket Toss is one example where group coordination and individual balance come together in a joyful activity passed down through generations.',
    15, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Name two locomotor skills.', 'Any two of: walking, running, jumping, hopping, skipping, galloping, sliding, leaping.', 'These skills move your whole body from place to place.', 1, 0),
    (v_tenant, v_ch, 'What is a manipulative skill?', 'A movement that involves controlling an object with your hands or feet, like throwing, catching, or kicking.', 'Think about using a ball.', 1, 1),
    (v_tenant, v_ch, 'What are the three groups of fundamental movement skills?', 'Locomotor, stability, and manipulative skills.', 'L-S-M', 1, 2);

  -- Chapter 2: Body Awareness
  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Body Awareness', 'body-awareness-k',
    'Learn about the different parts of your body, personal space, and how to control your movements safely.',
    '[
      {"type": "heading", "content": "Body Awareness", "level": 1},
      {"type": "text", "content": "Body awareness means knowing where your body is in space and how to control it. When you walk between desks without bumping into them, or when you catch a ball without looking at your hands, you are using body awareness. This skill helps you move safely and confidently in any environment — a school gym, a snowy park, or a crowded hallway."},
      {"type": "callout", "style": "info", "title": "Personal Space", "content": "Personal space is the area around your body that belongs to you. Imagine a hula hoop around you at all times. Staying in your own personal space while moving means you will not bump into others and everyone stays safe."},
      {"type": "text", "content": "In physical education, we talk about levels of movement: high (reaching up toward the ceiling), medium (at waist height), and low (close to the ground). We also talk about directions: forward, backward, sideways, and diagonal. Practising moves at different levels and in different directions builds a full range of body control."},
      {"type": "text", "content": "Body parts have important jobs during movement. Your core — the muscles around your stomach and lower back — helps you balance and stay upright. Your arms help you balance when you jump and land. Bending your knees when you land from a jump absorbs the force and protects your joints, a skill called a soft landing."},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "The Hand Game, played by many First Nations peoples on the prairies, requires players to use body awareness and concentration to hide a small object in one hand while opponents try to guess which hand holds it. Players use controlled, deliberate movements and awareness of their own body signals to trick or read their opponents."},
      {"type": "list", "style": "unordered", "items": ["High level: movements near the ceiling or overhead", "Medium level: movements at waist or shoulder height", "Low level: movements close to the floor", "Directions: forward, backward, sideways, diagonal"]},
      {"type": "quiz", "question": "What is personal space in physical education?", "options": ["The locker room", "The area immediately around your body", "The space between two cones", "A quiet corner of the gym"], "correctIndex": 1, "explanation": "Personal space is the area immediately surrounding your body. Respecting personal space means not bumping into others while moving."}
    ]'::jsonb,
    '[
      {"term": "Body Awareness", "definition": "Knowing where your body is in space and being able to control your movements."},
      {"term": "Personal Space", "definition": "The area directly around your body that you keep clear of others while moving."},
      {"term": "Levels", "definition": "High, medium, and low positions used to describe where a movement takes place."},
      {"term": "Soft Landing", "definition": "Bending the knees when landing from a jump to absorb force and protect the joints."},
      {"term": "Core", "definition": "The group of muscles around your stomach and lower back that helps you balance and move with control."}
    ]'::jsonb,
    'The Hand Game, played by many First Nations peoples across the prairies and boreal regions, combines deep body awareness with strategy. Players control subtle movements of their hands and body to conceal information, while observers develop acute awareness of other people's body language — a skill deeply connected to reading one's own physical state.',
    15, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is personal space?', 'The area around your own body that you keep clear of others when moving.', 'Imagine a hula hoop around you.', 1, 0),
    (v_tenant, v_ch, 'Name the three levels of movement.', 'High, medium, and low.', 'Think top, middle, bottom.', 1, 1),
    (v_tenant, v_ch, 'What is a soft landing?', 'Bending your knees when you land from a jump to absorb the force safely.', 'Knees absorb the shock.', 1, 2);

  -- Chapter 3: Active Play
  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Active Play', 'active-play-k',
    'Explore the importance of daily active play, simple games, and how movement helps our brains and bodies.',
    '[
      {"type": "heading", "content": "Active Play", "level": 1},
      {"type": "text", "content": "Play is not just fun — it is one of the best things you can do for your body and your brain. When you run around at recess, chase your friends, climb a structure, or make up a game with a ball, your heart pumps faster, your muscles get stronger, and your brain becomes better at learning and paying attention. Active play is any movement that gets your body going and your heart beating a little faster."},
      {"type": "callout", "style": "info", "title": "Why Active Play Matters", "content": "Children need at least 60 minutes of active movement every day. This does not have to happen all at once. Short bursts of running, jumping, and playing throughout the day add up and make a big difference for your health and mood."},
      {"type": "text", "content": "Simple games like tag, duck-duck-goose, and freeze are perfect examples of active play. In tag, one player is 'it' and chases the others. This game uses running, dodging, and quick direction changes — all great movement skills. Freeze tag adds a twist: when tagged, you freeze until a teammate unfreezes you, which builds cooperation and spatial awareness at the same time."},
      {"type": "text", "content": "On the Saskatchewan prairies, winter does not have to stop active play. Building snow forts, pulling a friend on a toboggan, making snow angels, and playing keep-away with a snowball are all forms of active winter play. Moving in winter clothes also challenges your body in new ways, helping you develop strength and coordination in different conditions."},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "Snow Snake is a traditional winter game played by many First Nations peoples across Canada. Players slide a long, smooth stick — the snow snake — along a grooved track in the snow and see whose snake travels the farthest. The game builds arm strength, coordination, and understanding of how the angle and force of a throw affect distance."},
      {"type": "quiz", "question": "How much active movement do children need every day?", "options": ["15 minutes", "30 minutes", "60 minutes", "2 hours"], "correctIndex": 2, "explanation": "Children need at least 60 minutes of active movement every day to support healthy growth, brain development, and mood. This can happen in short bursts across the day."}
    ]'::jsonb,
    '[
      {"term": "Active Play", "definition": "Any physical activity done playfully that raises your heart rate and gets your body moving."},
      {"term": "Tag", "definition": "A running game where one player chases and touches others to make them 'it'."},
      {"term": "Cooperation", "definition": "Working together with others to achieve a shared goal."},
      {"term": "Dodging", "definition": "Quickly moving your body to avoid being touched or hit by something."},
      {"term": "Snow Snake", "definition": "A traditional Indigenous winter game where players slide a long stick along a snowy groove to see how far it travels."}
    ]'::jsonb,
    'Snow Snake is a traditional Indigenous winter game with deep roots across many First Nations cultures. Played on a track carved into the snow, it develops throwing mechanics, observation skills, and gentle competition. On the Saskatchewan prairies, winter play traditions like Snow Snake show how movement and community celebration are woven together across seasons.',
    15, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'How much active movement do children need daily?', 'At least 60 minutes of active movement every day.', 'It can be broken into shorter bursts.', 1, 0),
    (v_tenant, v_ch, 'What movement skills does a game of tag practice?', 'Running, dodging, and quick direction changes.', 'Think about how you move to avoid being caught.', 1, 1),
    (v_tenant, v_ch, 'What is Snow Snake?', 'A traditional Indigenous winter game where players slide a long stick along a snowy groove to see whose travels farthest.', 'Think about winter, sticks, and distance.', 1, 2);

  -- Chapter 4: Outdoor Learning
  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Outdoor Learning', 'outdoor-learning-k',
    'Discover how the outdoors is a classroom for movement, nature connection, and seasonal physical activities on the prairies.',
    '[
      {"type": "heading", "content": "Outdoor Learning", "level": 1},
      {"type": "text", "content": "The great outdoors of Saskatchewan is one of the best places to be physically active and learn at the same time. Open fields, schoolyards, parks, and trails offer space to run, jump, balance, and explore in ways that are hard to do inside a gym. Moving outside also helps you notice the seasons, the weather, and the living things around you."},
      {"type": "text", "content": "Each season on the prairies offers different opportunities for outdoor movement. In fall, you can rake and jump in leaf piles, play soccer on grassy fields, and run through crunching leaves. In winter, you can build snow sculptures, slide down hills, and snowshoe across a schoolyard. In spring, puddles become an obstacle course, and in summer, open fields invite sprinting, rolling, and exploring."},
      {"type": "callout", "style": "info", "title": "Dress for Success Outdoors", "content": "On the Saskatchewan prairies, temperatures can change quickly. Always dress in layers for outdoor activity in cold weather: a moisture-wicking base layer, an insulating middle layer, and a wind- and water-resistant outer layer. Warm boots, mitts, and a hat protect you so you can keep moving safely."},
      {"type": "list", "style": "unordered", "items": ["Fall activities: leaf jumping, soccer, nature scavenger hunts", "Winter activities: tobogganing, snowshoeing, building snow forts", "Spring activities: puddle jumping, skipping, outdoor obstacle courses", "Summer activities: sprinting, rolling down hills, nature hikes"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "Many Cree, Nakoda, and Anishinaabe children across the prairies played a game called Stick Pull (also known as Moccasin Game preparation). Two players sit facing each other and grip the same stick, then each tries to pull it toward themselves. This simple outdoor game builds grip strength, upper body power, and friendly competition using only a stick found outdoors."},
      {"type": "quiz", "question": "Which layer of clothing helps keep wind and rain out during outdoor winter activity?", "options": ["Base layer", "Middle layer", "Outer layer", "Sock layer"], "correctIndex": 2, "explanation": "The outer layer is a wind- and water-resistant shell that protects you from the elements while allowing the inner layers to keep you warm. On Saskatchewan winters, this layer is essential for safe outdoor movement."}
    ]'::jsonb,
    '[
      {"term": "Outdoor Learning", "definition": "Using outdoor spaces like fields, trails, and schoolyards as places to move, play, and discover."},
      {"term": "Layering", "definition": "Wearing multiple layers of clothing to stay warm and dry during outdoor physical activity."},
      {"term": "Snowshoeing", "definition": "Walking across snow using wide frames strapped to your feet to prevent sinking."},
      {"term": "Season", "definition": "One of the four periods of the year — fall, winter, spring, summer — each offering different outdoor movement opportunities."},
      {"term": "Obstacle Course", "definition": "A path with challenges like hurdles, tunnels, and balance beams that you move through as fast as you can."}
    ]'::jsonb,
    'Indigenous peoples of the prairies have always used the land as a place for both learning and movement across all four seasons. Games, hunts, and travel in every season required understanding weather, terrain, and clothing — a holistic outdoor education passed through generations of lived experience on the land.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Name one outdoor movement activity for winter on the prairies.', 'Any of: tobogganing, snowshoeing, building snow forts, Snow Snake, sliding.', 'Think about snowy activities.', 1, 0),
    (v_tenant, v_ch, 'What are the three layers of clothing for cold outdoor activity?', 'Base layer (moisture-wicking), middle layer (insulating), and outer layer (wind/water resistant).', 'Think: inner warmth, outer protection.', 1, 1),
    (v_tenant, v_ch, 'What is an obstacle course?', 'A path with challenges like hurdles, tunnels, and balance beams that you move through as quickly as you can.', 'It has different physical challenges along the way.', 1, 2);

END;
$$;


-- ============================================================================
-- TEXTBOOK 2: WolfWhale Phys Ed 1
-- Slug: wolfwhale-phys-ed-1
-- Chapters: Running & Jumping, Throwing & Catching, Low-Organized Games, Fitness Awareness
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-phys-ed-1';

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Moving with Skill and Energy',
    'Grade 1 students refine locomotor and manipulative skills, explore simple games, and begin to understand why physical activity matters for their health.',
    'Practising movement skills every day builds the confidence and ability to enjoy any physical activity.',
    'How do I get better at moving my body, and why does it matter?')
  RETURNING id INTO v_unit;

  -- Chapter 1: Running & Jumping
  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Running & Jumping', 'running-jumping-gr1',
    'Develop proper running form and jumping technique through practice and fun activities.',
    '[
      {"type": "heading", "content": "Running & Jumping", "level": 1},
      {"type": "text", "content": "Running and jumping are two of the most important locomotor skills you will ever learn. Whether you are racing a friend across a field in Regina, playing flag football at recess, or leaping over a puddle on a rainy spring morning, these skills are at the heart of nearly every sport and game you will play throughout your life."},
      {"type": "text", "content": "Good running form makes you faster and reduces the chance of getting hurt. When you run, pump your arms forward and back (not side to side), lean slightly forward from your ankles, and lift your knees with each stride. Land on the middle of your foot rather than your heel, and push off with your toes. Look ahead, not down at the ground, so you can see where you are going."},
      {"type": "callout", "style": "info", "title": "Running Form Tips", "content": "Great runners pump their arms forward and back, lean slightly forward, lift their knees, and land on the middle of the foot. Practise these points one at a time until they feel natural."},
      {"type": "text", "content": "Jumping requires both power and control. There are many types of jumps: a two-foot takeoff and two-foot landing (used in the broad jump), a one-foot takeoff and two-foot landing (used when leaping for a high catch), and a one-foot takeoff and one-foot landing (the hop). To jump higher and farther, bend your knees and swing your arms back before you spring forward. Always land with bent knees and feet shoulder-width apart for a safe, balanced landing."},
      {"type": "list", "style": "unordered", "items": ["Two-foot jump: takeoff and land on both feet — used in broad jump", "Leap: push off one foot, land on the other — covers the most distance", "Hop: push off and land on the same foot — builds balance", "Vertical jump: jump straight up, reach as high as possible"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "The One-Foot High Kick is a traditional Inuit sport also practised at Arctic Winter Games, which include First Nations and Metis athletes from across Canada. A player kicks a hanging target with one foot and must land back on the same foot. This game builds powerful jumping, body control, and concentration — skills that originated in celebrations and competitions across northern Indigenous communities."},
      {"type": "quiz", "question": "When landing from a jump, what should you do with your knees?", "options": ["Keep them straight and stiff", "Bend them to absorb the landing", "Lock them together", "Point them outward"], "correctIndex": 1, "explanation": "Bending your knees when you land absorbs the force of the landing and protects your joints from injury. Straight, stiff legs during landing can hurt your knees and ankles."}
    ]'::jsonb,
    '[
      {"term": "Running Form", "definition": "The proper body position for efficient and safe running: arms pumping, slight forward lean, knees lifting, midfoot landing."},
      {"term": "Broad Jump", "definition": "A jump for distance using a two-foot takeoff and two-foot landing."},
      {"term": "Leap", "definition": "A locomotor skill where you push off one foot and land on the opposite foot, covering maximum distance."},
      {"term": "Hop", "definition": "A locomotor skill where you push off one foot and land on the same foot."},
      {"term": "Vertical Jump", "definition": "Jumping straight upward to reach maximum height."},
      {"term": "Soft Landing", "definition": "Landing from a jump with bent knees and feet shoulder-width apart to absorb force safely."}
    ]'::jsonb,
    'The One-Foot High Kick is a celebrated traditional sport rooted in Inuit communities and showcased at the Arctic Winter Games, which welcome Indigenous athletes from across northern Canada. The skill required — explosive jumping, precise body control, and a one-foot landing — reflects the athletic traditions developed by northern peoples through generations of celebration and community gathering.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Name two tips for good running form.', 'Any two of: pump arms forward/back, lean slightly forward, lift knees, land on midfoot, look ahead.', 'Think about arms, lean, knees, and feet.', 1, 0),
    (v_tenant, v_ch, 'What is a leap?', 'A locomotor skill where you push off one foot and land on the opposite foot.', 'It covers more distance than a hop.', 1, 1),
    (v_tenant, v_ch, 'What is a hop?', 'Pushing off one foot and landing back on the same foot.', 'Same foot leaves and lands.', 1, 2);

  -- Chapter 2: Throwing & Catching
  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Throwing & Catching', 'throwing-catching-gr1',
    'Learn the basic mechanics of overhand throwing and two-hand catching to build manipulative skill.',
    '[
      {"type": "heading", "content": "Throwing & Catching", "level": 1},
      {"type": "text", "content": "Throwing and catching are manipulative skills that appear in dozens of sports: basketball, baseball, football, lacrosse, and Ultimate Frisbee, to name just a few. Learning good mechanics early means that every time you pick up a ball later in life, your body already has the foundation to succeed."},
      {"type": "text", "content": "An overhand throw uses the whole body, not just the arm. Start by standing sideways to your target, with your throwing-side foot back. Bring the ball back near your ear, step forward with your opposite foot, rotate your hips and shoulders toward the target, snap your wrist, and follow through. This sequence generates power from your legs and core, not just your shoulder."},
      {"type": "callout", "style": "info", "title": "Steps for an Overhand Throw", "content": "1. Stand sideways to target. 2. Ball back near your ear. 3. Step forward with opposite foot. 4. Rotate hips and shoulder. 5. Release and follow through toward target."},
      {"type": "text", "content": "Catching requires you to watch the ball all the way into your hands — do not close your eyes or turn your head away. For a ball coming at chest height or above, point your fingers up and make a diamond shape with your thumbs and forefingers. For a ball below the waist, point your fingers down and cup your hands. Give slightly as you catch to absorb the ball's momentum, called cushioning."},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "Lacrosse is one of the oldest team sports in North America, originally played by many First Nations peoples including the Haudenosaunee (Iroquois), Ojibwe, and Mi'kmaq. The game involves throwing and catching a small ball using a stick with a mesh pocket. Traditional lacrosse was played across large open fields and held deep spiritual and social importance — it was sometimes called 'the Creator's game.'"},
      {"type": "quiz", "question": "When catching a ball that is coming at waist height or below, where should your fingers point?", "options": ["Upward", "Sideways", "Downward", "Backward"], "correctIndex": 2, "explanation": "When a ball is below the waist, your fingers should point downward and your palms face up to form a scoop. For a ball above the waist, fingers point upward."}
    ]'::jsonb,
    '[
      {"term": "Manipulative Skill", "definition": "A movement skill that involves controlling an object with the hands, feet, or body, such as throwing or catching."},
      {"term": "Overhand Throw", "definition": "A throwing motion where the ball is brought back near the ear and released over the shoulder with a wrist snap."},
      {"term": "Follow-Through", "definition": "The continuation of a throwing or striking motion after the ball is released, helping accuracy and power."},
      {"term": "Cushioning", "definition": "Giving slightly with the arms and hands as you catch to absorb the ball's momentum."},
      {"term": "Lacrosse", "definition": "A team sport of First Nations origin played with a long-handled stick and mesh pocket, involving throwing and catching a rubber ball."}
    ]'::jsonb,
    'Lacrosse is one of North America's oldest sports, originating with First Nations peoples including the Haudenosaunee, Ojibwe, and others. Known as the Creator's Game, it was played over vast areas with deep ceremonial and community significance. Throwing and catching with a stick and ball remain the heart of the game, which continues to be embraced by Indigenous communities across Saskatchewan and beyond.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does follow-through mean in throwing?', 'Continuing the arm motion toward the target after releasing the ball, which improves accuracy and power.', 'Your hand should point at the target after you release.', 1, 0),
    (v_tenant, v_ch, 'For a ball arriving above the waist, where do your fingers point when catching?', 'Upward, with thumbs and forefingers forming a diamond shape.', 'Fingers up for high balls, fingers down for low balls.', 1, 1),
    (v_tenant, v_ch, 'What is cushioning in catching?', 'Giving slightly with your arms as you receive the ball to absorb its momentum.', 'You soften the catch rather than letting the ball bounce out.', 1, 2);

  -- Chapter 3: Low-Organized Games
  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Low-Organized Games', 'low-organized-games-gr1',
    'Explore simple, flexible games that build movement skills, social skills, and love of physical activity.',
    '[
      {"type": "heading", "content": "Low-Organized Games", "level": 1},
      {"type": "text", "content": "Low-organized games are simple games with few rules that a small or large group can play with very little equipment. Games like tag, freeze, red light green light, and Simon Says are low-organized games. Because the rules are simple, everyone can quickly understand how to play and spend most of their time actually moving rather than listening to instructions."},
      {"type": "callout", "style": "info", "title": "What Makes a Game Low-Organized?", "content": "A low-organized game has simple rules, needs little or no equipment, can be played by mixed ages and abilities, and focuses on fun movement rather than competition. These games are perfect for parks, schoolyards, and gymnasiums."},
      {"type": "text", "content": "Low-organized games teach important social skills alongside physical ones. When you play tag, you practise taking turns being 'it,' which builds fairness. When someone gets tagged and they did not realize it, you learn to handle disagreements calmly. When the game has a rule like 'everyone holds hands in a circle,' you practise cooperation. These skills come from the structure of the game itself, not from a lesson about behaviour."},
      {"type": "list", "style": "unordered", "items": ["Tag and its variations: builds running, dodging, and spatial awareness", "Red Light Green Light: builds listening, quick stopping, and self-control", "Hopscotch: builds balance, hopping, and number recognition", "Duck Duck Goose: builds anticipation, running, and social turn-taking"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "Many Plains First Nations communities played a game called Hoop and Pole, in which players roll a hoop along the ground and try to throw a pole or dart through it while it is moving. This game develops throwing accuracy, tracking a moving target, and quick decision-making — skills that translated directly to hunting and daily life on the prairies."},
      {"type": "quiz", "question": "Which of the following best describes a low-organized game?", "options": ["A sport with a referee, fixed team sizes, and complex rules", "A simple game with few rules that anyone can join and play quickly", "A game that requires expensive equipment and a large gym", "A computer-based fitness game"], "correctIndex": 1, "explanation": "Low-organized games have simple rules, need little equipment, and are easy to start. They maximize participation and movement time, making them ideal for physical education with younger students."}
    ]'::jsonb,
    '[
      {"term": "Low-Organized Game", "definition": "A simple game with few rules and minimal equipment that maximizes participation and movement."},
      {"term": "Tag", "definition": "A chasing game in which one player ('it') tries to touch another player, who then becomes 'it'."},
      {"term": "Fairness", "definition": "Playing according to the rules and treating all players equally."},
      {"term": "Cooperation", "definition": "Working together with others toward a shared goal or activity."},
      {"term": "Hoop and Pole", "definition": "A traditional Plains First Nations game involving rolling a hoop and throwing a pole through it to build accuracy."}
    ]'::jsonb,
    'Hoop and Pole was played by many Plains First Nations peoples as a game that developed throwing precision and target tracking while also being a joyful community activity. The hoop represents a moving target, and success requires patience, coordination, and practice — values embedded in traditional Indigenous physical education on the prairies.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a low-organized game?', 'A simple game with few rules and little equipment where everyone can participate and spend most of the time moving.', 'Think: easy rules, lots of action.', 1, 0),
    (v_tenant, v_ch, 'Name two movement skills practised in a game of tag.', 'Running and dodging (also spatial awareness).', 'What do you do to avoid being caught?', 1, 1),
    (v_tenant, v_ch, 'What is Hoop and Pole?', 'A traditional Plains First Nations game where players roll a hoop and throw a pole through it while it is moving.', 'A moving target game from the prairies.', 1, 2);

  -- Chapter 4: Fitness Awareness
  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Fitness Awareness', 'fitness-awareness-gr1',
    'Learn what fitness means, how your body responds to exercise, and why being active every day matters.',
    '[
      {"type": "heading", "content": "Fitness Awareness", "level": 1},
      {"type": "text", "content": "Have you ever noticed how your heart beats faster when you run, how your face gets warm after a game of tag, or how your muscles feel tired after climbing? These are signs that your body is working hard to support your movement. Physical fitness means having a body that is strong, energetic, and healthy enough to do the things you want to do every day."},
      {"type": "text", "content": "There are a few simple things your body needs to stay fit. First, it needs regular movement. Second, it needs healthy food for energy. Third, it needs enough sleep to repair and recharge. When all three work together, you feel energetic, focused, and ready to play. When one piece is missing — like too little sleep or no movement — your body does not work as well."},
      {"type": "callout", "style": "info", "title": "Your Heart Is a Muscle", "content": "Your heart is a muscle that pumps blood carrying oxygen to every part of your body. When you exercise, your muscles need more oxygen, so your heart beats faster to deliver it. Over time, regular exercise makes your heart stronger and more efficient — a benefit called cardiovascular fitness."},
      {"type": "list", "style": "unordered", "items": ["Heart beats faster during exercise to deliver more oxygen", "Muscles feel warm or burn slightly when they are working hard", "You breathe faster during exercise because your body needs more oxygen", "After exercise, your heart rate and breathing gradually slow back to normal — this is called recovery"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "The traditional Metis Red River Jig is a vigorous dance form rooted in Metis culture across the prairies of Saskatchewan and Manitoba. The jig involves rapid, rhythmic footwork that elevates the heart rate, builds leg strength and coordination, and requires significant cardiovascular endurance. Metis jigging is both a cultural celebration and a genuine cardiovascular workout."},
      {"type": "quiz", "question": "Why does your heart beat faster when you exercise?", "options": ["Because you are scared", "To deliver more oxygen-rich blood to your working muscles", "Because exercise makes your heart shrink", "To cool down your body temperature"], "correctIndex": 1, "explanation": "During exercise, your muscles need more oxygen to produce energy. Your heart beats faster to pump oxygen-carrying blood to your muscles more quickly. This is a normal and healthy response."}
    ]'::jsonb,
    '[
      {"term": "Physical Fitness", "definition": "Having a body that is healthy, strong, and energetic enough to perform daily activities and movement with ease."},
      {"term": "Heart Rate", "definition": "The number of times your heart beats per minute; increases during exercise."},
      {"term": "Cardiovascular Fitness", "definition": "The ability of the heart and lungs to deliver oxygen to the muscles during sustained physical activity."},
      {"term": "Recovery", "definition": "The period after exercise when your heart rate and breathing gradually return to their resting levels."},
      {"term": "Metis Red River Jig", "definition": "A vigorous traditional Metis dance from the prairies that builds cardiovascular endurance and leg strength through rapid rhythmic footwork."}
    ]'::jsonb,
    'The Metis Red River Jig is a vibrant cultural tradition of Metis peoples across Saskatchewan and Manitoba. Beyond its cultural importance, the jig is a demanding physical activity that builds cardiovascular fitness, rhythmic coordination, and leg strength. Metis communities have long recognized dance as a powerful form of physical and spiritual wellbeing, a tradition that continues today at community gatherings and celebrations.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Why does your heart beat faster when you exercise?', 'Your muscles need more oxygen, so your heart pumps faster to deliver more oxygen-rich blood.', 'Muscles need oxygen to work.', 1, 0),
    (v_tenant, v_ch, 'Name three things your body needs to stay fit.', 'Regular movement, healthy food for energy, and enough sleep to recover.', 'Think: move, eat, sleep.', 1, 1),
    (v_tenant, v_ch, 'What is cardiovascular fitness?', 'The ability of your heart and lungs to deliver oxygen to your muscles during sustained physical activity.', 'Your heart and lungs working together during exercise.', 1, 2);

END;
$$;


-- ============================================================================
-- TEXTBOOK 3: WolfWhale Phys Ed 2
-- Slug: wolfwhale-phys-ed-2
-- Chapters: Locomotor Skills, Cooperative Games, Rhythm & Dance, Health-Related Fitness
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-phys-ed-2';

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Skills, Cooperation, and Health',
    'Grade 2 students refine locomotor skills, explore cooperative activities, discover rhythm and dance, and build awareness of health-related fitness.',
    'Moving skillfully and working with others builds both physical health and strong relationships.',
    'How do movement and cooperation help me grow as a person?')
  RETURNING id INTO v_unit;

  -- Chapter 1: Locomotor Skills
  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Locomotor Skills', 'locomotor-skills-gr2',
    'Refine and combine locomotor skills including skipping, galloping, and sliding to build movement fluency.',
    '[
      {"type": "heading", "content": "Locomotor Skills", "level": 1},
      {"type": "text", "content": "In Grade 1 you learned the basic locomotor skills. In Grade 2, it is time to put them together more smoothly and try some that are trickier to master. Skipping, galloping, and sliding are three locomotor skills that require you to combine a step with a hop or a leap in a rhythmic pattern. They look simple, but they take practice to do well."},
      {"type": "text", "content": "Skipping is an alternating step-hop done on each foot in a rhythmic pattern: step-hop-step-hop. Many children find it challenging at first because the brain must coordinate two separate movements at the same time. Start slowly: take a step, then hop on the same foot, then step with the other foot and hop. Once the rhythm clicks, skipping becomes almost automatic and is a joyful, energetic way to travel across a field."},
      {"type": "callout", "style": "info", "title": "Combining Locomotor Skills", "content": "Once you can do each locomotor skill on its own, try combining them into sequences. For example: run three steps, then leap, then gallop four counts, then freeze. Combining skills builds movement creativity and prepares you for dance, gymnastics, and sport."},
      {"type": "text", "content": "Sliding is a lateral (sideways) locomotor skill: step to the side with one foot, then bring the other foot to meet it before the first foot moves again. Unlike running, which is linear (forward and back), sliding lets you move quickly sideways, which is very useful in sports like basketball and soccer where you need to guard an opponent. Galloping is like a fast, exaggerated walk where one foot always leads: step-close, step-close."},
      {"type": "list", "style": "unordered", "items": ["Skip: step-hop alternating on each foot in rhythm", "Gallop: one foot leads, step-close pattern, can be done forward", "Slide: sideways movement, step-close pattern", "Combinations: link locomotor skills for movement sequences"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "The traditional Cree game of Kick the Stick involves players galloping and sliding laterally to chase after a small stick that has been kicked across the prairie grass. Players must shift direction quickly, combining several locomotor skills in rapid succession. This game was played by children across the parkland and prairie regions of what is now Saskatchewan."},
      {"type": "quiz", "question": "What movement pattern is used in skipping?", "options": ["Step-leap alternating", "Step-hop alternating on each foot", "Slide-jump-freeze", "Run-stop-turn"], "correctIndex": 1, "explanation": "Skipping uses a step-hop pattern alternating on each foot in a rhythmic sequence: right step, right hop, left step, left hop, and so on."}
    ]'::jsonb,
    '[
      {"term": "Skip", "definition": "A locomotor skill using a step-hop pattern alternating on each foot in a rhythmic sequence."},
      {"term": "Gallop", "definition": "A locomotor skill where one foot leads and the other follows in a step-close pattern, moving forward."},
      {"term": "Slide", "definition": "A lateral locomotor skill using a sideways step-close pattern."},
      {"term": "Lateral Movement", "definition": "Movement to the side rather than forward or backward."},
      {"term": "Movement Sequence", "definition": "A series of different movement skills linked together in a planned order."}
    ]'::jsonb,
    'Cree children across the parkland and prairie regions of Saskatchewan played games combining lateral movement, quick direction changes, and cooperative chasing. These games built the same movement patterns used in adult activities like hunting, herding bison, and navigating the open landscape — embedding physical education naturally into play and daily life.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Describe the movement pattern for skipping.', 'Step on one foot, hop on that same foot, then step on the other foot and hop — alternating in rhythm.', 'Step-hop, step-hop.', 1, 0),
    (v_tenant, v_ch, 'What is lateral movement?', 'Movement to the side rather than forward or backward.', 'Think sideways.', 1, 1),
    (v_tenant, v_ch, 'What locomotor skill uses a step-close sideways pattern?', 'The slide.', 'It keeps you facing the same direction while moving sideways.', 1, 2);

  -- Chapter 2: Cooperative Games
  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Cooperative Games', 'cooperative-games-gr2',
    'Explore games where the goal is for the whole group to succeed together rather than one player winning.',
    '[
      {"type": "heading", "content": "Cooperative Games", "level": 1},
      {"type": "text", "content": "In most sports and games, there is a winner and a loser. But cooperative games work differently: the goal is for the whole group to succeed together, or to beat a shared challenge rather than each other. Cooperative games teach communication, trust, problem-solving, and inclusivity — and they can be just as exciting and physically demanding as competitive ones."},
      {"type": "callout", "style": "info", "title": "Cooperative vs. Competitive Games", "content": "Competitive games have individual or team winners. Cooperative games challenge the whole group to achieve a shared goal together — no one wins unless everyone succeeds. Both types are valuable in physical education."},
      {"type": "text", "content": "Parachute games are a classic example of cooperative physical activity. When a class holds the edges of a large colourful parachute, everyone must work together to billow it up, keep it floating, or pop a ball into the air. If one side pulls too hard, the parachute tips. If everyone acts at exactly the right moment, it rises into a beautiful dome. The activity is impossible without genuine cooperation."},
      {"type": "text", "content": "Blob Tag is another cooperative game: when you are tagged, you must join hands with the tagger to form a growing 'blob' that moves and chases together. The blob can only tag other players using the free outer hands, so it must communicate and coordinate its movement. By the end, the entire class is moving as one connected unit — a powerful experience of group cooperation."},
      {"type": "list", "style": "unordered", "items": ["Parachute games: whole group must act together in perfect timing", "Blob Tag: tagged players join the chaser, growing a cooperative unit", "Human Knot: group must untangle a human knot without releasing hands", "Team Juggling: group keeps multiple balls in the air using a shared pattern"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "Tug of War has been played in various forms by First Nations peoples across North America, including communities in Saskatchewan, as a test of collective strength and strategy. In some traditions, teams use a central rope woven from natural fibres, and the game emphasizes reading your teammates' strength, coordinating effort simultaneously, and supporting the weakest member — all deeply cooperative qualities."},
      {"type": "quiz", "question": "What is the main difference between a competitive game and a cooperative game?", "options": ["Competitive games use more equipment", "Cooperative games challenge the whole group to succeed together rather than against each other", "Cooperative games have no rules", "Competitive games are always more fun"], "correctIndex": 1, "explanation": "The key difference is the goal. In a competitive game, individuals or teams try to beat each other. In a cooperative game, the whole group works together to achieve a shared challenge, with everyone succeeding or failing as a unit."}
    ]'::jsonb,
    '[
      {"term": "Cooperative Game", "definition": "A game where the goal is for all players to succeed together by working as a team against a shared challenge."},
      {"term": "Competitive Game", "definition": "A game where individuals or teams try to win by outperforming each other."},
      {"term": "Communication", "definition": "Sharing information clearly with teammates to coordinate actions."},
      {"term": "Blob Tag", "definition": "A cooperative tag game where tagged players join the tagger, forming a growing connected group."},
      {"term": "Inclusion", "definition": "Making sure every person has a place and a role in the activity, regardless of skill level."}
    ]'::jsonb,
    'Many traditional First Nations games across Saskatchewan emphasize collective strength and community coordination over individual achievement. Activities like communal Tug of War reflect values of mutual support, shared effort, and reading others' needs — values that remain central to Indigenous community life on the prairies today.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a cooperative game?', 'A game where all players work together to achieve a shared goal, with no individual winners or losers.', 'Everyone wins or no one wins.', 1, 0),
    (v_tenant, v_ch, 'How does Blob Tag work?', 'When tagged, you join hands with the tagger and continue chasing together as a growing group.', 'The chaser grows with every tag.', 1, 1),
    (v_tenant, v_ch, 'Name two skills that cooperative games build.', 'Any two of: communication, trust, problem-solving, inclusion, teamwork.', 'Think about what you need when everyone must work together.', 1, 2);

  -- Chapter 3: Rhythm & Dance
  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Rhythm & Dance', 'rhythm-dance-gr2',
    'Explore how rhythm connects to movement, and experience creative and cultural dance forms as physical activity.',
    '[
      {"type": "heading", "content": "Rhythm & Dance", "level": 1},
      {"type": "text", "content": "Rhythm is the regular beat or pulse in music and movement. When you clap along to a song, tap your foot, or march in time, you are responding to rhythm. Movement and rhythm are deeply connected — almost every sport has a rhythm to it. A basketball dribble has a rhythm. A long jump run-up has a rhythm. A rowing stroke has a rhythm. Learning to feel and move with rhythm improves all kinds of physical performance."},
      {"type": "callout", "style": "info", "title": "What Is Rhythm?", "content": "Rhythm is a regular, repeated pattern of sound or movement. In dance and physical activity, finding the beat means matching your movements to the regular pulse of the music. This coordination of movement and timing is called rhythmic competence."},
      {"type": "text", "content": "Creative dance allows you to express feelings and ideas through movement without rigid rules. In creative dance, you might explore moving like water flowing down a prairie river, like wind blowing across a wheat field, or like an eagle soaring above the plains. These movement explorations build body awareness, creativity, and physical expression all at once."},
      {"type": "text", "content": "Simple folk dances and circle dances are an accessible introduction to structured dance. In a circle dance, everyone holds hands or shoulders in a circle and moves together in the same direction and pattern. The shared movement creates a sense of unity and community. Many cultures across the world, including Indigenous cultures in Saskatchewan, use circle dances for celebration, ceremony, and social gathering."},
      {"type": "list", "style": "unordered", "items": ["Beat: the regular pulse in music that guides movement timing", "Tempo: how fast or slow the beat moves", "Creative dance: exploring expressive movement with no set steps", "Folk dance: structured dance steps rooted in cultural tradition", "Circle dance: a group dance where all participants move together in a circle"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "The Round Dance is a traditional social dance practised by many First Nations peoples including Cree, Nakoda, and Saulteaux communities across Saskatchewan. Participants form a large circle, hold hands, and move together in a sideways step pattern to the beat of a drum. Round Dances are held at powwows and community gatherings and are open to everyone — they are a powerful expression of welcome, unity, and shared rhythm."},
      {"type": "quiz", "question": "What is tempo in music and movement?", "options": ["The volume of the music", "How fast or slow the beat moves", "The style of the dance steps", "The number of dancers in a group"], "correctIndex": 1, "explanation": "Tempo describes the speed of the beat — how fast or slow the rhythm moves. A fast tempo means the beat comes quickly; a slow tempo means the beat is spread out. Matching your movement to the tempo is a key rhythmic skill."}
    ]'::jsonb,
    '[
      {"term": "Rhythm", "definition": "A regular, repeated pattern of sound or movement that guides the timing of actions."},
      {"term": "Beat", "definition": "The regular pulse in music or movement that you can clap, tap, or march along to."},
      {"term": "Tempo", "definition": "The speed of the beat — how fast or slow the rhythm moves."},
      {"term": "Creative Dance", "definition": "Movement exploration that uses the body to express ideas, feelings, or images without set choreography."},
      {"term": "Round Dance", "definition": "A traditional First Nations social dance where participants hold hands in a circle and move together to drumbeat."},
      {"term": "Circle Dance", "definition": "A group dance where all participants form a circle and move together in the same direction and pattern."}
    ]'::jsonb,
    'The Round Dance is a cherished tradition among Cree, Nakoda, Saulteaux, and many other First Nations peoples across Saskatchewan. Open to all participants, the Round Dance embodies welcome, unity, and communal joy. Moving together in a circle to the heartbeat of a drum connects participants to shared rhythm, community belonging, and the living traditions of prairie Indigenous culture.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the difference between beat and tempo?', 'The beat is the regular pulse of music; tempo is how fast or slow that beat moves.', 'Beat is the pulse; tempo is its speed.', 1, 0),
    (v_tenant, v_ch, 'What is creative dance?', 'A form of movement that uses the body to express ideas or feelings without set steps or choreography.', 'Expression through movement.', 1, 1),
    (v_tenant, v_ch, 'What is the Round Dance?', 'A traditional First Nations social dance where participants hold hands in a circle and move together to the beat of a drum.', 'A circle, hands held, to a drum.', 1, 2);

  -- Chapter 4: Health-Related Fitness
  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Health-Related Fitness', 'health-related-fitness-gr2',
    'Understand the five components of health-related fitness and how everyday activities build each one.',
    '[
      {"type": "heading", "content": "Health-Related Fitness", "level": 1},
      {"type": "text", "content": "Being fit is not just about being able to run fast. Physical fitness has several different parts, each important for a healthy and active life. Health-related fitness includes five components: cardiovascular endurance, muscular strength, muscular endurance, flexibility, and body composition. Each component can be improved with the right kinds of movement and physical activity."},
      {"type": "callout", "style": "info", "title": "Five Components of Health-Related Fitness", "content": "1. Cardiovascular Endurance: keeping active for a long time without getting too tired. 2. Muscular Strength: how much force your muscles can produce. 3. Muscular Endurance: how long your muscles can keep working. 4. Flexibility: the range of motion in your joints. 5. Body Composition: the ratio of muscle to fat in your body."},
      {"type": "text", "content": "Cardiovascular endurance is built by activities that keep your heart beating faster for several minutes: running, swimming, cycling, and dancing are all great examples. On the Saskatchewan prairies, cross-country skiing, snowshoeing, and long walks on nature trails in provincial parks like Waskesiu are excellent ways to build cardiovascular endurance in every season."},
      {"type": "text", "content": "Flexibility is the range of motion available at a joint. Good flexibility helps you move freely, prevents injuries, and makes many physical tasks easier. Flexibility is improved by regular stretching, especially after you are already warm from exercise. Yoga, dance, and gymnastics are great for building flexibility. Always stretch slowly and hold each stretch for at least 15 to 30 seconds — do not bounce."},
      {"type": "list", "style": "unordered", "items": ["Cardiovascular endurance: running, swimming, cross-country skiing, dancing", "Muscular strength: climbing, carrying, pushing, pulling", "Muscular endurance: repeated sit-ups, long bike rides, paddling", "Flexibility: yoga, stretching after warm-up, dance", "Body composition: improved by regular activity and nutritious food"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "Traditional portaging — carrying a canoe or heavy pack overland between waterways — has been practised by Cree, Dene, and Metis peoples across northern Saskatchewan for generations. Portaging demands muscular strength (to lift and carry), muscular endurance (to sustain the load over distance), and cardiovascular endurance (to keep moving on uneven terrain). It is a complete full-body fitness activity embedded in traditional travel and trade."},
      {"type": "quiz", "question": "Which component of health-related fitness is most improved by stretching exercises?", "options": ["Cardiovascular endurance", "Muscular strength", "Flexibility", "Body composition"], "correctIndex": 2, "explanation": "Flexibility — the range of motion in your joints — is specifically improved by regular stretching. The other fitness components require different types of exercise such as sustained activity (cardiovascular), resistance work (strength), and repeated effort (muscular endurance)."}
    ]'::jsonb,
    '[
      {"term": "Cardiovascular Endurance", "definition": "The ability of the heart and lungs to sustain physical activity for an extended period."},
      {"term": "Muscular Strength", "definition": "The maximum force your muscles can produce in a single effort."},
      {"term": "Muscular Endurance", "definition": "The ability of muscles to keep working repeatedly over time without fatiguing."},
      {"term": "Flexibility", "definition": "The range of motion available at a joint; improved through regular stretching."},
      {"term": "Body Composition", "definition": "The proportion of muscle, fat, bone, and other tissues that make up the body."},
      {"term": "Portaging", "definition": "Carrying a canoe or heavy gear overland between waterways; a traditional practice requiring full-body fitness."}
    ]'::jsonb,
    'Traditional portaging across Saskatchewan's northern waterways and parklands has been central to Cree, Dene, and Metis travel and trade for generations. The physical demands of portaging — strength, endurance, and cardiovascular fitness — reflect how Indigenous peoples developed and maintained exceptional fitness through meaningful work and purposeful movement embedded in daily life on the land.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Name the five components of health-related fitness.', 'Cardiovascular endurance, muscular strength, muscular endurance, flexibility, and body composition.', 'Think: heart, strength, endurance, stretch, composition.', 2, 0),
    (v_tenant, v_ch, 'How is flexibility improved?', 'Through regular stretching, especially after a warm-up. Hold each stretch for 15–30 seconds without bouncing.', 'Slow, held stretches after you are warm.', 1, 1),
    (v_tenant, v_ch, 'What is cardiovascular endurance?', 'The ability of the heart and lungs to sustain physical activity for an extended time without becoming too tired.', 'Heart and lungs working together over time.', 1, 2);

END;
$$;


-- ============================================================================
-- TEXTBOOK 4: WolfWhale Phys Ed 3
-- Slug: wolfwhale-phys-ed-3
-- Chapters: Sport Skills, Lead-Up Games, Fitness Goals, Water Safety & Winter Activities
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-phys-ed-3';

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Building Sport and Safety Skills',
    'Grade 3 students develop fundamental sport skills, explore lead-up games that bridge to full sport, set personal fitness goals, and learn essential water safety and winter activity knowledge.',
    'Skilled, safe movement in a variety of environments opens the door to a lifetime of active participation.',
    'How do I develop skills and stay safe while being active in all environments?')
  RETURNING id INTO v_unit;

  -- Chapter 1: Sport Skills
  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Sport Skills', 'sport-skills-gr3',
    'Develop key sport skills including dribbling, kicking, and striking that form the foundation for many games and sports.',
    '[
      {"type": "heading", "content": "Sport Skills", "level": 1},
      {"type": "text", "content": "Many of the sports and games you will play in your life — soccer, basketball, hockey, tennis, baseball — share a set of core sport skills. Dribbling, kicking, striking, and footwork patterns appear again and again across different sports. By practising these skills in a variety of contexts, your brain and body learn them deeply enough to use them automatically during a game."},
      {"type": "text", "content": "Dribbling in basketball means bouncing the ball with one hand while moving. The keys are to push the ball down firmly, keep it below waist height, use your fingertips (not your palm), and look up at the court rather than at the ball. Dribbling in soccer means controlling the ball with your feet while moving, using the inside, outside, and top of your foot in short, controlled touches. Both types of dribbling require practice to become fluid and automatic."},
      {"type": "callout", "style": "info", "title": "Closed vs. Open Skills", "content": "A closed skill is practised in a stable, predictable environment — like shooting free throws alone in a gym. An open skill is performed in a changing environment with other players — like dribbling past a defender in a game. Sport skills should be practised as both closed and open skills to develop full game readiness."},
      {"type": "text", "content": "Striking is hitting an object with a body part or implement. In t-ball or baseball, a batter strikes a ball with a bat. In volleyball, a server strikes the ball with an open hand. In tennis, a player strikes the ball with a racket. All striking skills share common principles: watch the ball all the way to contact, step into the strike, rotate the hips, follow through toward the target."},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "Shinny is a traditional stick-and-ball game played by many First Nations peoples across the prairies and northern regions of Canada, and is considered one of the ancestors of modern ice hockey. Played on frozen lakes and ponds in winter using curved sticks and a frozen piece of hide or wood, Shinny builds dribbling, striking, and footwork skills in an outdoor winter setting that is deeply familiar to Saskatchewan communities."},
      {"type": "quiz", "question": "What is the main difference between a closed skill and an open skill in sport?", "options": ["Closed skills use a ball; open skills use a racket", "Closed skills are practised in a stable environment; open skills are performed in a changing environment with other players", "Closed skills are harder to learn", "Open skills are only used in team sports"], "correctIndex": 1, "explanation": "A closed skill is practised in a controlled, predictable setting. An open skill must be performed in a dynamic environment where conditions change, such as during a live game. Both types of practice are important for full sport development."}
    ]'::jsonb,
    '[
      {"term": "Dribbling", "definition": "Controlling a ball while moving — with the hands in basketball or with the feet in soccer."},
      {"term": "Striking", "definition": "Using a body part or implement to hit an object, such as batting a ball or spiking in volleyball."},
      {"term": "Closed Skill", "definition": "A sport skill practised in a stable, predictable environment without defenders or changing conditions."},
      {"term": "Open Skill", "definition": "A sport skill performed in a dynamic, changing environment such as a live game with other players."},
      {"term": "Follow-Through", "definition": "Continuing a striking or throwing motion after contact to improve power and accuracy."},
      {"term": "Shinny", "definition": "A traditional First Nations stick-and-ball winter game considered an ancestor of ice hockey."}
    ]'::jsonb,
    'Shinny is a traditional winter game with roots in many First Nations communities across Canada's prairies and northern regions. Played on frozen water using carved sticks and a makeshift puck, it developed the same striking, dribbling, and skating skills that underpin modern hockey. Shinny remains a living tradition in many Saskatchewan communities, connecting contemporary sport to Indigenous heritage.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a closed skill?', 'A sport skill practised in a stable, predictable environment without defenders or changing conditions.', 'Think: free throw practice with no one guarding.', 2, 0),
    (v_tenant, v_ch, 'Name two principles shared by all striking skills.', 'Any two of: watch the ball to contact, step into the strike, rotate hips, follow through toward target.', 'Think about what you do with your eyes, body, and arms.', 1, 1),
    (v_tenant, v_ch, 'What is Shinny?', 'A traditional First Nations winter stick-and-ball game played on frozen water, considered an ancestor of ice hockey.', 'Think: Indigenous hockey on a frozen pond.', 1, 2);

  -- Chapter 2: Lead-Up Games
  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Lead-Up Games', 'lead-up-games-gr3',
    'Explore lead-up games that teach the rules, strategies, and skills of full sports in a simplified format.',
    '[
      {"type": "heading", "content": "Lead-Up Games", "level": 1},
      {"type": "text", "content": "A lead-up game is a simplified version of a full sport designed to teach specific skills or rules without the complexity of the complete game. Lead-up games reduce the number of players, shrink the playing area, simplify the scoring, and focus on one or two key skills at a time. They are the bridge between practising skills in isolation and playing full games."},
      {"type": "callout", "style": "info", "title": "Why Use Lead-Up Games?", "content": "Lead-up games let everyone practice the most important skills of a sport without being overwhelmed by complex rules. They increase touches on the ball, reduce standing around, and allow players of all skill levels to experience success early in the learning process."},
      {"type": "text", "content": "Keep Away is a classic lead-up game for soccer, basketball, and ultimate frisbee. In Keep Away, a small group tries to maintain possession of a ball or disc while a defender tries to take it. The offensive players practise passing, receiving, and movement off the ball; the defender practises positioning and reading the play. Keep Away isolates the key skill of maintaining possession without the complexity of goals, lines, or scoring."},
      {"type": "text", "content": "Four-Corner Basketball is a lead-up game where four teams occupy corners and try to score in baskets at their corner. Teams pass the ball to teammates, dribble into position, and take short shots. With smaller teams, every player touches the ball more often than in a full game, which speeds up skill development. All lead-up games share this quality: more practice repetitions in less time."},
      {"type": "list", "style": "unordered", "items": ["Keep Away: practice passing and possession without goals or scoring", "Three-on-Three Basketball: full game rules but smaller court and teams", "Kickball: lead-up to baseball, uses kicking instead of batting", "Two-on-Two Volleyball: full net game with fewer players and smaller court"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "Double Ball is a traditional game played by many First Nations women across the plains and prairies. Two small balls or weighted pouches are connected by a short cord, and players use a stick to toss and catch the double ball and carry it down a field to score. Double Ball is a lead-up concept in itself — it teaches stick skill, throwing, catching, and field positioning in a game unique to Indigenous traditions."},
      {"type": "quiz", "question": "What is the main purpose of a lead-up game?", "options": ["To replace full sport competition at all ages", "To teach specific skills and rules of a sport in a simplified format", "To make physical education easier for teachers", "To reduce the number of players needed for any sport"], "correctIndex": 1, "explanation": "Lead-up games are specifically designed to teach the key skills and rules of a sport in a simplified version that is less complex and more accessible. They bridge the gap between skill drills and full game play."}
    ]'::jsonb,
    '[
      {"term": "Lead-Up Game", "definition": "A simplified version of a full sport that teaches specific skills and rules in a more accessible format."},
      {"term": "Keep Away", "definition": "A lead-up game where a small group tries to maintain possession of a ball while a defender tries to intercept it."},
      {"term": "Possession", "definition": "Having control of the ball or object in a game."},
      {"term": "Double Ball", "definition": "A traditional First Nations game where two connected balls or pouches are tossed and carried using a stick to score in a goal."},
      {"term": "Practice Repetitions", "definition": "The number of times a player actually performs a skill during a practice or game; more repetitions lead to faster skill development."}
    ]'::jsonb,
    'Double Ball is a traditional game with deep roots among plains and parkland First Nations women. It combines stick skill, accuracy, field strategy, and teamwork in a unique format that predates modern field sports. Double Ball demonstrates that Indigenous peoples developed sophisticated lead-up style games that isolated and developed specific movement competencies long before the concept was formalized in physical education.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a lead-up game?', 'A simplified version of a full sport that teaches specific skills and rules in a smaller, more accessible format.', 'Think: a stepping stone between skill practice and a full game.', 1, 0),
    (v_tenant, v_ch, 'What skills does Keep Away develop?', 'Passing, receiving, movement off the ball (offense), and positioning and reading the play (defense).', 'Think about what the ball-carrier and the defender each must do.', 1, 1),
    (v_tenant, v_ch, 'What is Double Ball?', 'A traditional First Nations game where two connected balls or pouches are carried with a stick and launched into a goal.', 'Two balls, one stick, First Nations game.', 1, 2);

  -- Chapter 3: Fitness Goals
  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Fitness Goals', 'fitness-goals-gr3',
    'Learn how to set simple personal fitness goals, track progress, and celebrate improvement over time.',
    '[
      {"type": "heading", "content": "Fitness Goals", "level": 1},
      {"type": "text", "content": "A goal is something you decide you want to achieve. A fitness goal is a specific target related to your physical health and activity. For example, a goal might be to run around the school track without stopping, do ten proper push-ups, or hold a balance pose for twenty seconds. Goals give your physical education practice direction and motivation — they turn random activity into purposeful training."},
      {"type": "callout", "style": "info", "title": "SMART Goals", "content": "A SMART goal is Specific, Measurable, Achievable, Relevant, and Time-bound. Instead of 'I want to get faster,' a SMART goal says 'I will improve my 100-metre run time by two seconds over the next four weeks by practising sprint starts three times per week.' SMART goals help you track progress and celebrate success."},
      {"type": "text", "content": "After setting a goal, the next step is tracking your progress. You can use a simple chart, a journal, or a class tracking board to record your starting point (called a baseline), your targets along the way, and your final result. Seeing improvement over time — even small improvements — is a powerful motivator. It shows you that practice works and that effort produces results."},
      {"type": "text", "content": "Not every goal is met the first time. Sometimes you set a goal that is too ambitious, or something gets in the way of your practice. When this happens, it is important to adjust the goal rather than give up entirely. Change the timeline, reduce the target slightly, or find a new strategy. Flexibility in goal-setting is just as important as perseverance in pursuing the goal."},
      {"type": "list", "style": "unordered", "items": ["Specific: define exactly what you want to achieve", "Measurable: state a number or standard you can test", "Achievable: make sure the goal is challenging but possible", "Relevant: connect the goal to something that matters to you", "Time-bound: set a deadline to check your progress"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "Traditional Indigenous endurance practices across the prairies — like long-distance running used by Cree and Nakoda messengers and hunters — required exactly the kind of goal-setting and persistent training that we describe as SMART goal principles today. Runners built endurance gradually, tracked their improvement through repeated practice over seasons, and adapted their training to weather and terrain. These were purposeful, self-directed fitness programs embedded in community life."},
      {"type": "quiz", "question": "What does the 'M' in SMART goals stand for?", "options": ["Meaningful", "Motivated", "Measurable", "Maximum"], "correctIndex": 2, "explanation": "The M in SMART stands for Measurable — the goal must include a number, standard, or observable result that you can actually test and track. Without a measurable component, you cannot know whether you achieved your goal."}
    ]'::jsonb,
    '[
      {"term": "Fitness Goal", "definition": "A specific target related to physical health and activity that you work toward over time."},
      {"term": "SMART Goal", "definition": "A goal that is Specific, Measurable, Achievable, Relevant, and Time-bound."},
      {"term": "Baseline", "definition": "Your starting measurement before you begin working toward a goal, used to track improvement."},
      {"term": "Tracking", "definition": "Recording your results over time to see whether you are making progress toward your goal."},
      {"term": "Perseverance", "definition": "Continuing to work toward a goal even when it is difficult or progress is slow."}
    ]'::jsonb,
    'Long-distance running was a vital skill for Cree and Nakoda messengers, hunters, and travellers across the prairies. Developing this endurance required gradual, purposeful training over weeks and seasons — a practice that mirrors modern goal-setting principles precisely. Traditional Indigenous physical training was goal-oriented and systematic, rooted in the practical needs and seasonal rhythms of life on the land.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does SMART stand for in goal-setting?', 'Specific, Measurable, Achievable, Relevant, Time-bound.', 'Each letter is a quality a good goal should have.', 2, 0),
    (v_tenant, v_ch, 'What is a baseline in fitness goal-setting?', 'Your starting measurement before you begin working toward a goal, used to compare against later results.', 'It is your starting point.', 1, 1),
    (v_tenant, v_ch, 'What should you do if you do not meet a fitness goal?', 'Adjust the goal — change the timeline, reduce the target slightly, or try a different strategy — rather than giving up.', 'Adapt, do not quit.', 1, 2);

  -- Chapter 4: Water Safety & Winter Activities
  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Water Safety & Winter Activities', 'water-safety-winter-gr3',
    'Learn essential water safety rules and explore the wide variety of winter physical activities available on the Saskatchewan prairies.',
    '[
      {"type": "heading", "content": "Water Safety & Winter Activities", "level": 1},
      {"type": "text", "content": "Saskatchewan is home to thousands of lakes, rivers, and reservoirs — from Waskesiu Lake in Prince Albert National Park to the South Saskatchewan River flowing through Saskatoon. Water is a central part of prairie life, and knowing how to stay safe near and in water is a vital life skill. Every year in Canada, preventable drownings occur because people did not follow basic water safety rules."},
      {"type": "callout", "style": "info", "title": "Five Rules of Water Safety", "content": "1. Always swim with a buddy — never alone. 2. Swim only in supervised areas with a lifeguard. 3. Wear a properly fitted personal flotation device (PFD) when boating or near deep water. 4. Walk (do not run) on pool decks and boat docks. 5. Enter the water feet first when in an unfamiliar area to check depth."},
      {"type": "text", "content": "A personal flotation device (PFD), sometimes called a life jacket, keeps you afloat in water even if you are unconscious or exhausted. Not all PFDs are equal — a proper PFD must fit snugly, be Coast Guard approved, and be worn correctly. A PFD sitting in a boat does not help someone who has fallen into the water; it must be worn at all times when on or near open water."},
      {"type": "text", "content": "Saskatchewan winters provide incredible opportunities for physical activity. Cross-country skiing across the rolling terrain of Waskesiu or Greenwater Provincial Park develops cardiovascular endurance and full-body muscular strength. Tobogganing and snowshoeing require balance and lower body strength. Skating on outdoor rinks found in nearly every Saskatchewan community is an excellent cardiovascular workout. Cold-weather outdoor activity is safe and enjoyable with proper clothing and preparation."},
      {"type": "list", "style": "unordered", "items": ["Cross-country skiing: full-body cardiovascular endurance activity", "Snowshoeing: builds balance and lower body strength on snow", "Skating: excellent cardiovascular activity on outdoor rinks", "Tobogganing: builds core strength and provides cardiovascular exercise on hills", "Ice fishing: patience, outdoor skills, and cold-weather recreation"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "Dene and Cree peoples of northern Saskatchewan have long used snowshoes for winter travel, hunting, and community movement across deep snow. Snowshoe racing and snowshoe games are traditional competitive and recreational activities that developed naturally from this practical skill. Modern snowshoe races are held at winter festivals across Saskatchewan, continuing this living tradition of purposeful winter movement."},
      {"type": "quiz", "question": "When should you wear a personal flotation device (PFD)?", "options": ["Only when swimming in a pool", "Only when in rough water", "Whenever you are on or near open water, including boating", "Only during organized races"], "correctIndex": 2, "explanation": "A PFD must be worn at all times when on or near open water. A PFD stored in a boat cannot help someone who has fallen overboard. Proper fit and consistent use are the most important factors in water safety."}
    ]'::jsonb,
    '[
      {"term": "Water Safety", "definition": "Rules and practices that protect people from injury or drowning when near or in water."},
      {"term": "Personal Flotation Device (PFD)", "definition": "A wearable device that keeps a person afloat in water; also called a life jacket."},
      {"term": "Supervised Swimming Area", "definition": "A designated swimming zone monitored by a trained lifeguard."},
      {"term": "Cross-Country Skiing", "definition": "A winter activity involving skiing across varied terrain using poles, developing cardiovascular and full-body fitness."},
      {"term": "Snowshoeing", "definition": "Walking across snow using wide frames strapped to the feet, preventing sinking; builds lower body strength and balance."},
      {"term": "Hypothermia", "definition": "A dangerous drop in body temperature caused by exposure to cold, which can occur rapidly when wet in cold weather."}
    ]'::jsonb,
    'Snowshoe travel is a foundational skill of Cree and Dene peoples across northern Saskatchewan, essential for winter hunting, community movement, and survival on the land. Snowshoe races and games have long been embedded in winter gatherings and celebrations, celebrating physical prowess and the deep connection between Indigenous peoples and the winter landscape of the prairies and boreal forest.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Name two rules of water safety.', 'Any two of: always swim with a buddy, swim in supervised areas, wear a PFD, walk on pool decks, enter feet first.', 'Think about what keeps you safe near water.', 1, 0),
    (v_tenant, v_ch, 'What is a PFD and when should you wear it?', 'A personal flotation device (life jacket). Wear it at all times when on or near open water.', 'It keeps you afloat even if you cannot swim.', 1, 1),
    (v_tenant, v_ch, 'Name two winter physical activities available in Saskatchewan.', 'Any two of: cross-country skiing, snowshoeing, skating, tobogganing, ice fishing, snowshoe racing.', 'Think about what people do in a Saskatchewan winter.', 1, 2);

END;
$$;


-- ============================================================================
-- TEXTBOOK 5: WolfWhale Phys Ed 4
-- Slug: wolfwhale-phys-ed-4
-- Chapters: Team Sports Intro, Fitness Testing, Gymnastics, Indigenous Games (lacrosse, hand games)
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-phys-ed-4';

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Sport, Fitness, and Indigenous Physical Culture',
    'Grade 4 students enter the world of team sports, measure their fitness, explore gymnastics, and deepen their knowledge of Indigenous physical games and traditions.',
    'Understanding both modern sport and traditional physical games enriches our appreciation of movement as a universal human experience.',
    'How does sport connect me to my community and to the traditions of the people who have lived on this land before me?')
  RETURNING id INTO v_unit;

  -- Chapter 1: Team Sports Intro
  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Team Sports Introduction', 'team-sports-intro-gr4',
    'Discover the structure of team sports, key positions, basic tactics, and what makes a good teammate.',
    '[
      {"type": "heading", "content": "Team Sports Introduction", "level": 1},
      {"type": "text", "content": "Team sports bring together everything you have learned about movement — locomotor skills, manipulative skills, fitness, and tactics — and combine them with the social challenge of working with a group of teammates toward a shared goal. Soccer, basketball, volleyball, floor hockey, and ultimate frisbee are team sports played widely in Saskatchewan schools and communities. Each has its own rules, but they share fundamental structures."},
      {"type": "callout", "style": "info", "title": "Anatomy of a Team Sport", "content": "Every team sport has: players with specific roles (positions), a playing area with boundaries, an object to control (ball, puck, disc), a scoring system, a set of rules, and officials or referees. Understanding this structure helps you learn any new team sport more quickly."},
      {"type": "text", "content": "Positions in team sports divide the responsibilities of a team. In soccer, forwards try to score, midfielders link defence and attack, defenders protect the goal, and a goalkeeper guards the net. In basketball, guards handle the ball and create plays, and forwards and centres work near the basket. Understanding your position means knowing both your primary responsibilities and when to help your teammates in other areas of the court or field."},
      {"type": "text", "content": "The most important tactic in team sports is creating and using space. Offensive teams try to spread out to create passing lanes and openings. Defensive teams try to close down space and force the offensive team away from the goal. A player who moves to an open space gives a teammate a passing option, which is the foundation of all team sport offense."},
      {"type": "list", "style": "unordered", "items": ["Offense: score points by controlling, passing, and shooting the ball", "Defence: prevent the opposing team from scoring by guarding players and blocking passing lanes", "Transition: moving quickly from offense to defence or vice versa when possession changes", "Support: moving to give a teammate a passing option at all times"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "Traditional lacrosse, known in Haudenosaunee tradition as Tewaarathon, was played across large fields sometimes kilometres wide with teams of hundreds of players. The game had complex team structures, positions, and tactics not unlike modern team sports. In Saskatchewan, box lacrosse and field lacrosse are growing sports with strong participation by First Nations youth through organizations like the Saskatchewan First Nations Summer Games."},
      {"type": "quiz", "question": "What is the most fundamental tactic in team sport offense?", "options": ["Always pass backward to avoid losing possession", "Creating and using space to give teammates passing options", "Keeping all players near the goal at all times", "Never passing and always shooting"], "correctIndex": 1, "explanation": "Creating space — spreading out to open passing lanes and drawing defenders away from teammates — is the foundation of all team sport offense. A player in open space gives their teammate an option, which is the basis for movement-based attacking play."}
    ]'::jsonb,
    '[
      {"term": "Position", "definition": "A specific role assigned to a player within a team, with defined responsibilities on offense and defence."},
      {"term": "Offense", "definition": "The team or players who have possession of the ball and are trying to score."},
      {"term": "Defence", "definition": "The team or players trying to prevent the opposing team from scoring."},
      {"term": "Transition", "definition": "The rapid shift from offense to defence (or vice versa) when possession of the ball changes."},
      {"term": "Space", "definition": "Open areas of the playing field or court that a team tries to create and exploit on offense, or close down on defence."},
      {"term": "Lacrosse", "definition": "A First Nations team sport played with a long-handled stick and mesh pocket, now one of Canada's national sports."}
    ]'::jsonb,
    'Traditional lacrosse (Tewaarathon) was one of the most sophisticated team sports developed by any culture in the ancient world, involving hundreds of players, complex field tactics, and deep spiritual meaning for Haudenosaunee and other First Nations peoples. The sport's modern forms continue to thrive in Saskatchewan's Indigenous communities, and First Nations athletes are represented at every level from community leagues to the World Lacrosse Championship.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the most fundamental offensive tactic in team sports?', 'Creating and using space — spreading out to open passing lanes and give teammates options.', 'Space = opportunity.', 2, 0),
    (v_tenant, v_ch, 'What is transition in a team sport?', 'The rapid shift from offense to defence (or vice versa) when possession of the ball changes.', 'Think about what happens the moment the other team gets the ball.', 2, 1),
    (v_tenant, v_ch, 'What is the Haudenosaunee name for lacrosse?', 'Tewaarathon.', 'The name given to the game by the people who created it.', 2, 2);

  -- Chapter 2: Fitness Testing
  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Fitness Testing', 'fitness-testing-gr4',
    'Learn how fitness tests measure the five components of health-related fitness and how to use results to set meaningful goals.',
    '[
      {"type": "heading", "content": "Fitness Testing", "level": 1},
      {"type": "text", "content": "Fitness testing is a way of measuring where you are right now in each of the five components of health-related fitness: cardiovascular endurance, muscular strength, muscular endurance, flexibility, and body composition. A fitness test does not judge you as a person — it gives you a snapshot of your current physical starting point, just like a height measurement shows how tall you are today. What matters is not where you start, but how much you improve."},
      {"type": "callout", "style": "info", "title": "Why We Test Fitness", "content": "Fitness tests create a baseline so you can measure improvement over time. They reveal which components are already strong and which need more attention. They are not competitions — your results are personal and private, used only to guide your own goal-setting and training plan."},
      {"type": "text", "content": "Common fitness tests in Canadian schools include the Pacer test (or 20-metre shuttle run) for cardiovascular endurance, the push-up test for upper body muscular endurance, the grip strength dynamometer for muscular strength, and the sit-and-reach test for lower back and hamstring flexibility. Each test is standardized, meaning everyone does it the same way so results can be compared across time and between populations."},
      {"type": "list", "style": "unordered", "items": ["Pacer / 20m shuttle run: measures cardiovascular endurance", "Push-up test: measures upper body muscular endurance", "Curl-up / sit-up test: measures core muscular endurance", "Sit-and-reach test: measures lower back and hamstring flexibility", "Grip strength: measures hand and forearm muscular strength"]},
      {"type": "text", "content": "After completing fitness tests, you review your results and set SMART goals for improvement in the areas you want to focus on. For example, if your sit-and-reach score showed limited flexibility, you might set a goal of stretching for five minutes every day for six weeks and then re-test. Re-testing after a training period is called post-testing, and comparing your pre-test to your post-test shows the effect of your training."},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "The traditional Arctic Games event of Arm Pull (also called the One-Arm Pull or Nalukataq Arm Pull) tests grip and upper body strength in a format similar to a modern grip dynamometer test. Two competitors sit facing each other, link one arm, and try to pull the other forward. This test of strength appears in competitions at the Arctic Winter Games, which celebrate Indigenous athletics from across Canada's north and have significant participation from Saskatchewan."},
      {"type": "quiz", "question": "What is the purpose of a baseline fitness test?", "options": ["To rank students from best to worst in fitness", "To give students a starting measurement so they can track improvement over time", "To determine which students should play on sport teams", "To replace physical education class for the week"], "correctIndex": 1, "explanation": "A baseline fitness test gives each student a personal starting point. The purpose is to measure how much each individual improves with training — not to compare students to each other or make judgments about worth or ability."}
    ]'::jsonb,
    '[
      {"term": "Fitness Test", "definition": "A standardized measurement of one or more components of physical fitness."},
      {"term": "Baseline", "definition": "An initial measurement taken before training begins, used to compare against later results."},
      {"term": "Post-Test", "definition": "A fitness test taken after a period of training to measure improvement from the baseline."},
      {"term": "Pacer Test", "definition": "A progressive 20-metre shuttle run test used to measure cardiovascular endurance."},
      {"term": "Sit-and-Reach Test", "definition": "A test of lower back and hamstring flexibility where you reach forward as far as possible while seated."},
      {"term": "Standardized Test", "definition": "A test administered the same way to all participants so results can be compared across time and groups."}
    ]'::jsonb,
    'Strength competitions have long been a feature of Arctic Winter Games events celebrated by Indigenous athletes from across northern Canada including Saskatchewan. Events like the Arm Pull and the Kneel Jump test functional fitness qualities — grip, pulling strength, jumping power — that reflect the physical demands of traditional northern life. These competitions connect modern fitness assessment to living Indigenous athletic traditions.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What fitness component does the Pacer test measure?', 'Cardiovascular endurance — the ability to sustain aerobic activity over time.', 'It is a running test that gets progressively harder.', 2, 0),
    (v_tenant, v_ch, 'What is the difference between a baseline test and a post-test?', 'A baseline is taken before training; a post-test is taken after training to measure improvement.', 'Before and after.', 1, 1),
    (v_tenant, v_ch, 'Why are fitness tests not competitions?', 'Because their purpose is to give each individual a personal starting point for improvement, not to rank or compare students.', 'Your results are personal, not competitive.', 1, 2);

  -- Chapter 3: Gymnastics
  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Gymnastics', 'gymnastics-gr4',
    'Explore fundamental gymnastics skills including rolls, balances, and weight transfer, with emphasis on safety and body control.',
    '[
      {"type": "heading", "content": "Gymnastics", "level": 1},
      {"type": "text", "content": "Gymnastics is a movement discipline that develops body control, strength, flexibility, balance, and spatial awareness to a very high degree. Educational gymnastics in physical education focuses not on competitive performance but on exploring what your body can do through rolling, balancing, jumping, and weight transfer. The skills you build in gymnastics transfer to every other sport and physical activity you will ever do."},
      {"type": "callout", "style": "info", "title": "Safety First in Gymnastics", "content": "Always practise gymnastics on proper matting. Spot a partner during new skills. Never attempt a skill before being taught the proper technique. Keep your movements under control — gymnastics is about precision, not speed. Remove jewellery and tie back loose hair before any gymnastics session."},
      {"type": "text", "content": "The forward roll is the foundation of gymnastics floor skills. Start in a squat, place both hands flat on the mat, tuck your chin to your chest, push with your feet, and roll smoothly over your upper back, keeping your body in a tight tuck throughout. Land back in a squat or stand. The tuck chin rule is critical — looking up while rolling can strain the neck. Practise slowly on a well-padded mat before adding speed."},
      {"type": "text", "content": "Balances challenge your body to hold a still, controlled shape against gravity. Balances can be done on different body parts: a headstand uses the head and two hands as a triangle base; a shoulder stand uses the shoulders; a one-foot balance (arabesque) uses a single foot. The key to a good balance is a tight, engaged core, focused eyes on a fixed spot, and slow, deliberate movements to find the balance point."},
      {"type": "list", "style": "unordered", "items": ["Forward roll: foundational floor skill using tuck, chin to chest, smooth upper-back roll", "Backward roll: reverse of the forward roll, requires pushing through hands at the top", "Cartwheel: lateral rotation over extended arms, requires weight transfer hand-to-hand", "Arabesque: one-foot balance with opposite arm and leg extended", "Partner balance: two people supporting each other's weight in a shared balance shape"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "The Alaskan High Kick, celebrated at Arctic Winter Games and practised in Inuit and northern First Nations communities, is a gymnastics-like movement skill requiring extraordinary body control, power, and balance. A suspended target is set at height; the athlete jumps, kicks it with one foot, and lands on that same foot. This movement shares the same underlying body control, timing, and strength demands as advanced gymnastics skills."},
      {"type": "quiz", "question": "What is the most important safety rule during a forward roll?", "options": ["Keep your eyes on the ceiling", "Tuck your chin to your chest", "Extend your legs straight", "Roll as fast as possible"], "correctIndex": 1, "explanation": "Tucking your chin to your chest during a forward roll ensures you roll over the rounded upper back rather than the top of the head or neck. Looking up during a roll risks straining or injuring the cervical spine."}
    ]'::jsonb,
    '[
      {"term": "Forward Roll", "definition": "A gymnastics floor skill where you tuck your chin to your chest and roll over your upper back from a squat."},
      {"term": "Balance", "definition": "Holding a still, controlled body shape using a specific base of support against the force of gravity."},
      {"term": "Weight Transfer", "definition": "Moving your body weight smoothly from one body part to another, as in a cartwheel or roll."},
      {"term": "Tuck Position", "definition": "A compact body shape with knees drawn to the chest and chin tucked, used in rolls and jumps."},
      {"term": "Core Engagement", "definition": "Actively tightening the muscles of the abdomen and lower back to stabilize the spine during movement."},
      {"term": "Spotting", "definition": "A partner supporting or guiding another person during a gymnastics skill to ensure safety."}
    ]'::jsonb,
    'The Alaskan High Kick practised at the Arctic Winter Games by Inuit and northern First Nations athletes shares deep parallels with gymnastics in its demands for body control, explosive power, and precise landing technique. Northern Indigenous communities developed these movement arts through generations of celebration, where physical skill was honoured as a reflection of the strength and discipline needed to thrive in demanding environments.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Why must you tuck your chin during a forward roll?', 'To ensure you roll over your rounded upper back rather than your head or neck, preventing injury.', 'Chin to chest keeps the neck safe.', 1, 0),
    (v_tenant, v_ch, 'What is a tuck position?', 'A compact body shape with knees drawn to the chest and chin tucked; used in rolls and jumps.', 'Make yourself as small and round as possible.', 1, 1),
    (v_tenant, v_ch, 'What is spotting in gymnastics?', 'A partner providing physical support or guidance during a gymnastics skill to keep the performer safe.', 'A helper who prevents injury during a new skill.', 1, 2);

  -- Chapter 4: Indigenous Games
  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Indigenous Games: Lacrosse and Hand Games', 'indigenous-games-gr4',
    'Explore the origins, rules, and physical skills of traditional Indigenous games including lacrosse and hand games.',
    '[
      {"type": "heading", "content": "Indigenous Games: Lacrosse and Hand Games", "level": 1},
      {"type": "text", "content": "Indigenous peoples across North America developed hundreds of physical games long before European contact. These games were not separate from life — they were woven into ceremony, community, diplomacy, and physical training. Many of the sports played in Canadian schools today, including lacrosse, are directly descended from these traditions. Learning about Indigenous games is part of understanding the full history of sport and physical culture in Canada."},
      {"type": "text", "content": "Lacrosse originated among eastern First Nations peoples, particularly the Haudenosaunee, and spread westward across the continent. In its traditional form, the game was played over vast distances with teams numbering in the hundreds. Players used wooden sticks with a netted pocket to run, pass, and shoot a deerskin ball toward a goal. The game required extraordinary endurance, strength, stick-skill, and team communication. Modern box lacrosse and field lacrosse are both played by Indigenous athletes across Saskatchewan."},
      {"type": "callout", "style": "info", "title": "Lacrosse as Canada's National Sport", "content": "Lacrosse is one of Canada's two official national sports (along with ice hockey). It was officially recognized in 1994. The sport has Indigenous origins spanning thousands of years and holds deep cultural and spiritual significance for many First Nations peoples across North America."},
      {"type": "text", "content": "Hand Games are a family of Indigenous guessing and concentration games played by many First Nations communities including Cree, Nakoda, Blackfoot, and Dene peoples in Saskatchewan. In the most common form, two teams face each other. One team hides a small object (traditionally a bone or stone) in the fist of one of their players, while opponents try to guess which hand holds it. The game is accompanied by drumming and singing, and requires deep concentration, body reading, and psychological strategy."},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "The Hand Game (also called Bones Game or Stick Game) is played at many First Nations cultural events and powwows across Saskatchewan today. It develops acute body awareness, concentration, strategic thinking, and social bonding. Players must control their own body language to prevent opponents from reading their cues — a sophisticated physical and mental discipline."},
      {"type": "list", "style": "unordered", "items": ["Lacrosse: North American First Nations team sport using sticks and a ball; one of Canada's national sports", "Hand Game (Bones Game): two-team guessing game using hidden objects, drumming, and body reading", "Snow Snake: winter game of stick-throwing distance on a snow track", "Double Ball: plains game using two connected balls carried and thrown with a stick"]},
      {"type": "quiz", "question": "Which of the following is one of Canada's two official national sports?", "options": ["Basketball", "Baseball", "Lacrosse", "Curling"], "correctIndex": 2, "explanation": "Lacrosse and ice hockey are Canada's two official national sports. Lacrosse was officially recognized in 1994 and has Indigenous origins spanning thousands of years, making it one of the oldest team sports in North America."}
    ]'::jsonb,
    '[
      {"term": "Lacrosse", "definition": "A First Nations team sport using long-handled sticks with mesh pockets to throw and catch a ball, played over a field or in a box; one of Canada's national sports."},
      {"term": "Tewaarathon", "definition": "The Haudenosaunee name for the traditional form of lacrosse, meaning roughly 'little brother of war'."},
      {"term": "Hand Game", "definition": "A traditional Indigenous guessing game where players hide an object in their hands while opponents try to determine which hand holds it, accompanied by drumming."},
      {"term": "Body Reading", "definition": "The ability to interpret subtle physical cues from another person's posture, expression, and movement."},
      {"term": "Cultural Game", "definition": "A game rooted in the traditions, values, and history of a specific cultural group."}
    ]'::jsonb,
    'Indigenous physical games including lacrosse and Hand Games are living cultural practices deeply connected to First Nations identity, community, and ceremony across Saskatchewan. These games embody values of respect, strategy, community, and physical excellence. Engaging with these traditions in physical education is an act of cultural recognition and an acknowledgment of the Indigenous foundations of sport in Canada.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are Canada's two official national sports?', 'Lacrosse and ice hockey.', 'Both are deeply connected to Canadian identity and winter/outdoor culture.', 1, 0),
    (v_tenant, v_ch, 'What is the Haudenosaunee name for lacrosse?', 'Tewaarathon.', 'The original name from the people who created the game.', 2, 1),
    (v_tenant, v_ch, 'What skills does the Hand Game develop?', 'Concentration, body awareness, body reading, strategic thinking, and self-control.', 'Think: hide your tells, read your opponent.', 2, 2);

END;
$$;


-- ============================================================================
-- TEXTBOOK 6: WolfWhale Phys Ed 5
-- Slug: wolfwhale-phys-ed-5
-- Chapters: Team Tactics, Fitness Planning, Orienteering, Social Responsibility in Sport
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-phys-ed-5';

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Tactics, Planning, and Responsibility',
    'Grade 5 students develop tactical thinking in team sports, create personal fitness plans, navigate using maps and compasses, and examine their responsibilities as athletes and community members.',
    'Physical activity builds not only a healthy body but also the character, thinking, and responsibility needed to lead in sport and life.',
    'How do I think and act like a responsible, skilled athlete and community member?')
  RETURNING id INTO v_unit;

  -- Chapter 1: Team Tactics
  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Team Tactics', 'team-tactics-gr5',
    'Understand offensive and defensive tactics used in invasion and target sports, and how to read the game.',
    '[
      {"type": "heading", "content": "Team Tactics", "level": 1},
      {"type": "text", "content": "Tactics are the decisions a team makes about how to play together to gain an advantage over the opposition. While skills are about what your body can do, tactics are about where to go, when to move, and how to use your teammates. A highly skilled player who ignores tactics is far less effective than a moderately skilled player who understands and applies tactical thinking."},
      {"type": "callout", "style": "info", "title": "Skills vs. Tactics", "content": "A skill is a physical ability (e.g., a accurate pass). A tactic is a decision about when and how to use that skill in the context of a game (e.g., pass to the open player on the weak side when the defence overloads the strong side). Great players develop both."},
      {"type": "text", "content": "The four key offensive tactics used in most invasion sports are: create width (spread out sideways to stretch the defence), create depth (position players ahead and behind the ball to give passing options in all directions), switch the point of attack (pass across the field to the opposite side when one side is blocked), and overload (put more attackers in one zone than defenders can cover). These principles apply to soccer, basketball, flag football, floor hockey, and ultimate frisbee."},
      {"type": "text", "content": "On defence, the key tactical principles are: pressure the ball carrier (close the space so they cannot easily pass or shoot), cover (position a second defender to support the pressuring defender), and balance (keep defenders positioned to prevent the team from being exposed on the weak side or in transition). Man-to-man defence assigns each defender one attacker to guard; zone defence assigns each defender an area of the field or court."},
      {"type": "list", "style": "unordered", "items": ["Offensive: create width, depth, switch point of attack, overload", "Defensive: pressure the ball, cover the pressuring defender, balance across the field", "Man-to-man: each defender guards one attacker", "Zone: each defender guards an area rather than a specific player"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "Traditional lacrosse required sophisticated team tactics over large fields with hundreds of players. Haudenosaunee and other First Nations teams used spatial spreading, overload attacks on one flank, and defensive rotation strategies long before these concepts appeared in European team sports. The tactical intelligence embedded in traditional lacrosse continues to influence modern field lacrosse strategy."},
      {"type": "quiz", "question": "What does it mean to ''switch the point of attack'' in a team sport?", "options": ["Shoot instead of pass", "Move the ball quickly to the opposite side of the field when your current side is defended", "Replace your striker with a defender", "Stop playing offense and switch to defence"], "correctIndex": 1, "explanation": "Switching the point of attack means moving the ball rapidly from one side of the field to the other when the current side is heavily defended. This forces defenders to sprint across the field, often creating a numerical advantage on the newly attacked side."}
    ]'::jsonb,
    '[
      {"term": "Tactic", "definition": "A planned decision about where to move and how to use skills within the context of a game situation."},
      {"term": "Width", "definition": "Spreading players sideways across the field to stretch the defence and create space."},
      {"term": "Depth", "definition": "Having players positioned ahead of and behind the ball to provide passing options in multiple directions."},
      {"term": "Overload", "definition": "Creating a situation where attackers outnumber defenders in one zone of the field."},
      {"term": "Man-to-Man Defence", "definition": "A defensive system where each defender is assigned a specific opponent to guard."},
      {"term": "Zone Defence", "definition": "A defensive system where each defender guards a specific area rather than a specific player."}
    ]'::jsonb,
    'Traditional lacrosse as played by the Haudenosaunee and other First Nations peoples involved sophisticated field tactics that predate modern sport science. Teams used spatial strategies, overload attacks, and coordinated defensive rotations across vast playing areas. The tactical wisdom embedded in the Creator''s Game reflects a deep Indigenous understanding of space, teamwork, and strategic thinking in athletic competition.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the difference between a skill and a tactic?', 'A skill is a physical ability; a tactic is a decision about when and how to use that skill in a game situation.', 'Skills are what you can do; tactics are what you decide to do.', 2, 0),
    (v_tenant, v_ch, 'What does ''creating width'' mean in offense?', 'Spreading players sideways across the field to stretch the defence and open space.', 'Wide spacing forces defenders to spread thin.', 2, 1),
    (v_tenant, v_ch, 'What is the difference between man-to-man and zone defence?', 'Man-to-man assigns each defender one opponent; zone assigns each defender an area of the field.', 'Person vs. space.', 2, 2);

  -- Chapter 2: Fitness Planning
  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Fitness Planning', 'fitness-planning-gr5',
    'Learn how to design a simple personal fitness plan using the principles of frequency, intensity, time, and type.',
    '[
      {"type": "heading", "content": "Fitness Planning", "level": 1},
      {"type": "text", "content": "A fitness plan is a personal schedule of physical activity designed to improve one or more components of health-related fitness. Having a plan turns random movement into purposeful training. A good fitness plan tells you what activity to do, how often to do it, how hard to push, and how long each session should last. These four variables are captured in the acronym FITT: Frequency, Intensity, Time, and Type."},
      {"type": "callout", "style": "info", "title": "The FITT Principle", "content": "Frequency: how many days per week you train. Intensity: how hard you work (easy, moderate, vigorous). Time: how long each session lasts. Type: what kind of activity you do (running, swimming, strength training, stretching). Adjusting any of these variables changes the effect of your training."},
      {"type": "text", "content": "When designing your plan, match the type of activity to the fitness component you want to improve. For cardiovascular endurance, choose aerobic activities like running, cycling, or cross-country skiing that keep your heart rate elevated for at least 20 continuous minutes. For muscular strength, choose resistance activities like push-ups, pull-ups, or resistance band exercises. For flexibility, include stretching sessions with holds of 15 to 30 seconds per stretch."},
      {"type": "text", "content": "Every well-designed fitness session has three parts: a warm-up, the main activity, and a cool-down. The warm-up (5 to 10 minutes of light movement and gentle stretching) prepares your muscles and joints for harder work and reduces injury risk. The main activity is the core of your session. The cool-down (5 to 10 minutes of light movement and stretching) helps your heart rate return to normal and reduces next-day muscle soreness."},
      {"type": "list", "style": "unordered", "items": ["Warm-up: 5–10 min of light movement and dynamic stretching", "Main activity: the core workout targeting your fitness goal", "Cool-down: 5–10 min of light movement and static stretching"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "Traditional Metis voyageur paddling required one of the most systematically demanding fitness regimens in early Canadian history. Paddling canoes for 16 or more hours per day across Saskatchewan''s waterways required extraordinary cardiovascular endurance and upper body muscular endurance — the product of daily training that built fitness progressively over a full paddling season. This mirrors modern FITT principles exactly."},
      {"type": "quiz", "question": "What does the ''I'' in FITT stand for?", "options": ["Intervals", "Intensity", "Improvement", "Interval Training"], "correctIndex": 1, "explanation": "The I in FITT stands for Intensity — how hard you work during a training session. Intensity can be measured by heart rate, perceived effort, or pace. Adjusting intensity is one of the main ways to progress a fitness plan over time."}
    ]'::jsonb,
    '[
      {"term": "Fitness Plan", "definition": "A personal schedule of physical activity designed to progressively improve specific components of fitness."},
      {"term": "FITT Principle", "definition": "A framework for designing exercise: Frequency (how often), Intensity (how hard), Time (how long), Type (what activity)."},
      {"term": "Warm-Up", "definition": "5 to 10 minutes of light movement before the main workout to prepare muscles and reduce injury risk."},
      {"term": "Cool-Down", "definition": "5 to 10 minutes of light movement and stretching after a workout to lower heart rate and reduce soreness."},
      {"term": "Aerobic Activity", "definition": "Sustained physical activity that keeps the heart rate elevated for an extended period, improving cardiovascular endurance."},
      {"term": "Progressive Overload", "definition": "Gradually increasing the frequency, intensity, or duration of training to continue improving fitness over time."}
    ]'::jsonb,
    'Metis voyageurs who paddled Saskatchewan''s rivers and portaged between waterways embodied the FITT principle through the practical demands of their work. Building paddling fitness across a full season through daily high-volume effort represents a historical model of progressive fitness planning rooted in the lived experience of Metis communities on the land.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does FITT stand for?', 'Frequency, Intensity, Time, and Type.', 'Four variables of a training plan.', 2, 0),
    (v_tenant, v_ch, 'What is the purpose of a warm-up?', 'To prepare muscles and joints for harder work and reduce the risk of injury.', 'It gets blood flowing before the main effort.', 1, 1),
    (v_tenant, v_ch, 'What is progressive overload?', 'Gradually increasing training frequency, intensity, or duration over time to keep improving fitness.', 'You must increase the challenge to keep getting better.', 2, 2);

  -- Chapter 3: Orienteering
  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Orienteering', 'orienteering-gr5',
    'Learn how to navigate using a map and compass through outdoor orienteering challenges on the prairies.',
    '[
      {"type": "heading", "content": "Orienteering", "level": 1},
      {"type": "text", "content": "Orienteering is a navigation sport where participants use a detailed map and, often, a compass to find a series of checkpoints called control points, placed across a course in a park, forest, or schoolyard. The sport combines running or hiking with map-reading and decision-making, creating a challenge that is both physical and mental. Saskatchewan''s provincial parks, river valleys, and open prairie landscapes are excellent environments for orienteering."},
      {"type": "callout", "style": "info", "title": "How to Read a Map", "content": "An orienteering map uses colours and symbols to represent the landscape: brown for contour lines (elevation changes), blue for water, green for vegetation, yellow for open areas, and white for runnable forest. A scale bar shows the relationship between map distance and real distance. The legend explains every symbol."},
      {"type": "text", "content": "A compass has a magnetized needle that always points toward magnetic north. The base plate has a direction of travel arrow, and the rotating bezel is marked in degrees from 0 to 360. To take a bearing, point the direction of travel arrow at your destination on the map, rotate the bezel to align with the map''s north lines, then rotate your whole body until the needle aligns with the bezel — your direction of travel arrow now points toward your destination."},
      {"type": "text", "content": "In school orienteering, courses are often simplified into a schoolyard or local park with flagged control points on a simple sketch map. The goal is to visit all control points in the correct order as quickly as possible. Even without a compass, map-reading skills — identifying landmarks, measuring distances on the map, and planning the most efficient route — are fully exercised. Good route choice (selecting the fastest path between controls) is a key strategic skill in orienteering."},
      {"type": "list", "style": "unordered", "items": ["Control point: a flagged marker on the course that participants must find and punch or scan", "Bearing: a direction measured in degrees from north (0°–360°)", "Contour lines: map lines connecting points of equal elevation; closely spaced lines mean steep terrain", "Legend: the key explaining all map symbols", "Route choice: deciding the fastest or easiest path between two control points"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "Traditional wayfinding and land navigation were essential skills for Cree, Dene, Nakoda, and Metis peoples travelling across the prairies and boreal forest of Saskatchewan. Navigators read the landscape using the position of the sun and stars, wind direction, animal tracks, watercourse flow, and the growth patterns of trees and moss. This deep ecological navigation knowledge is the Indigenous ancestor of modern orienteering."},
      {"type": "quiz", "question": "On an orienteering map, what do closely spaced contour lines indicate?", "options": ["Dense forest", "Steep terrain with rapid elevation change", "A flat, open area", "A water crossing"], "correctIndex": 1, "explanation": "Contour lines connect points of equal elevation. When lines are closely spaced, elevation changes rapidly over a short horizontal distance — meaning the terrain is steep. Widely spaced contours indicate gentle or flat terrain."}
    ]'::jsonb,
    '[
      {"term": "Orienteering", "definition": "A navigation sport using a detailed map and compass to find control points across a course as quickly as possible."},
      {"term": "Control Point", "definition": "A flagged checkpoint that must be found and punched or scanned during an orienteering course."},
      {"term": "Bearing", "definition": "A direction measured in degrees from north (0 to 360) used for navigating with a compass."},
      {"term": "Contour Lines", "definition": "Lines on a map connecting points of equal elevation; closely spaced lines mean steep terrain."},
      {"term": "Route Choice", "definition": "The strategic decision about which path to take between control points in an orienteering course."},
      {"term": "Wayfinding", "definition": "The traditional practice of navigating across a landscape using natural environmental cues such as stars, sun, wind, and landforms."}
    ]'::jsonb,
    'Traditional wayfinding by Cree, Dene, Nakoda, and Metis peoples across Saskatchewan''s vast prairie and boreal landscapes required sophisticated ecological navigation knowledge. Reading sun angle, star positions, wind patterns, watercourse flow, and plant growth to navigate hundreds of kilometres represents a profound intellectual and physical achievement — the living foundation upon which modern orienteering was built.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a bearing in orienteering?', 'A direction measured in degrees from north (0 to 360) used for navigating with a compass.', 'North = 0° or 360°; East = 90°; South = 180°; West = 270°.', 2, 0),
    (v_tenant, v_ch, 'What do closely spaced contour lines on a map indicate?', 'Steep terrain — elevation changes rapidly over a short horizontal distance.', 'Think: many lines close together = sharp hillside.', 2, 1),
    (v_tenant, v_ch, 'What is route choice in orienteering?', 'The strategic decision about which path to take between control points to reach them most efficiently.', 'The fastest path is not always the most direct one.', 2, 2);

  -- Chapter 4: Social Responsibility in Sport
  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Social Responsibility in Sport', 'social-responsibility-sport-gr5',
    'Explore what it means to be a responsible athlete: respecting opponents, honouring officials, including everyone, and being a positive community member.',
    '[
      {"type": "heading", "content": "Social Responsibility in Sport", "level": 1},
      {"type": "text", "content": "Sport is one of the most powerful social environments in human life. It brings together people of different backgrounds, abilities, and perspectives in a shared challenge. But sport can also exclude, harm, and divide when participants lack social responsibility. A socially responsible athlete competes hard, respects opponents and officials, includes everyone, and reflects positively on their team and community."},
      {"type": "callout", "style": "info", "title": "What Is Social Responsibility in Sport?", "content": "Social responsibility in sport means: respecting the rules and the officials who enforce them; treating opponents with dignity regardless of the score; including participants of all abilities; standing up against bullying and exclusion; and representing your team and community with integrity."},
      {"type": "text", "content": "Sportsmanship describes the qualities of a fair, generous, and gracious competitor. Good sportsmanship includes congratulating opponents after a game whether you win or lose, acknowledging a good play by the other team, accepting a referee''s call without argument, and never mocking or belittling another player for mistakes. Poor sportsmanship — arguing with officials, trash-talking opponents, or quitting when a team is losing — damages the experience for everyone and undermines the purpose of sport."},
      {"type": "text", "content": "Inclusion means making sure every participant has a meaningful place in the activity. In physical education, this means modifying games so students of all abilities can participate fully, choosing teams in ways that do not embarrass anyone, and actively encouraging quieter or less skilled participants. A class that excludes anyone from the game has failed one of its primary goals, because the benefits of physical activity belong to everyone."},
      {"type": "list", "style": "unordered", "items": ["Sportsmanship: fair, generous, gracious competition win or lose", "Respect for officials: accept calls without argument, even when you disagree", "Inclusion: modify activities so everyone can participate meaningfully", "Bystander responsibility: speak up when someone is being excluded or bullied", "Integrity: do the right thing even when no one is watching"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "Many traditional Indigenous games across the prairies were designed with social responsibility built into their structure. In community lacrosse and foot races among Cree and Nakoda peoples, the emphasis was often on participation and community bonding rather than competitive ranking. Elders guided game conduct, disputes were resolved through community discussion, and the physical activity was understood as a gift shared among all participants — not a prize claimed by one winner."},
      {"type": "quiz", "question": "Which of the following is an example of good sportsmanship?", "options": ["Arguing loudly with the referee after a call you disagree with", "Refusing to shake hands with the opposing team after a loss", "Congratulating your opponents on a good game regardless of the result", "Only encouraging teammates who are skilled players"], "correctIndex": 2, "explanation": "Congratulating opponents after a game — whether you win or lose — is a hallmark of good sportsmanship. It acknowledges that the competition itself has value beyond the result, and that opponents deserve respect for their effort."}
    ]'::jsonb,
    '[
      {"term": "Social Responsibility", "definition": "Acting in ways that are fair, respectful, and beneficial to all participants and the broader community."},
      {"term": "Sportsmanship", "definition": "The qualities of a fair, gracious, and respectful competitor — in victory and in defeat."},
      {"term": "Inclusion", "definition": "Ensuring that all individuals have a meaningful opportunity to participate, regardless of ability, background, or identity."},
      {"term": "Integrity", "definition": "Doing the right thing even when no one is watching; honesty and strong ethical principles."},
      {"term": "Bystander", "definition": "A person who witnesses a situation; a responsible bystander speaks up or acts when they see exclusion or bullying."}
    ]'::jsonb,
    'Traditional Indigenous games in Saskatchewan communities were structured around values of participation, community, and shared benefit rather than individual victory. Elders guided conduct, disputes were resolved collectively, and every participant''s contribution was valued. These values are consistent with modern physical education goals of inclusive, responsible sport participation.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Name two qualities of good sportsmanship.', 'Any two of: congratulating opponents, respecting officials'' calls, acknowledging good plays by opponents, not quitting when losing, never mocking others.', 'Think about how a gracious competitor acts.', 1, 0),
    (v_tenant, v_ch, 'What does inclusion mean in physical education?', 'Making sure every student has a meaningful opportunity to participate fully, regardless of ability or background.', 'No one sits on the sidelines by default.', 1, 1),
    (v_tenant, v_ch, 'What is integrity in sport?', 'Doing the right thing — playing honestly and fairly — even when no one is watching.', 'You act the same whether the referee sees you or not.', 2, 2);

END;
$$;


-- ============================================================================
-- TEXTBOOK 7: WolfWhale Phys Ed 6
-- Slug: wolfwhale-phys-ed-6
-- Chapters: Invasion & Net Sports, Fitness Components, Adventure Activities, Sport Leadership
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-phys-ed-6';

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Sport Categories, Fitness, and Leadership',
    'Grade 6 students explore sport categories, deepen their understanding of fitness components, engage in adventure activities, and begin developing sport leadership skills.',
    'Understanding sport structures and taking responsibility for others'' experiences transforms a participant into a leader.',
    'How can I move from participant to leader in physical activity and sport?')
  RETURNING id INTO v_unit;

  -- Chapter 1: Invasion & Net Sports
  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Invasion & Net Sports', 'invasion-net-sports-gr6',
    'Compare invasion sports (soccer, basketball, lacrosse) and net/wall sports (volleyball, badminton, tennis) in terms of tactics and skills.',
    '[
      {"type": "heading", "content": "Invasion & Net Sports", "level": 1},
      {"type": "text", "content": "Physical educators classify games into categories based on shared tactical problems. Two of the most common categories are invasion sports and net/wall sports. Understanding a game''s category helps you transfer knowledge between sports — if you understand how to attack space in soccer, you already understand the core offensive principle of basketball, floor hockey, and lacrosse."},
      {"type": "callout", "style": "info", "title": "Sport Categories", "content": "Invasion sports: teams invade the opponent''s territory to score (soccer, basketball, hockey, lacrosse, flag football). Net/wall sports: players or teams send an object over a net or against a wall to score points (volleyball, badminton, tennis, squash). Target sports: players aim at a target with accuracy (curling, archery, golf, bocce)."},
      {"type": "text", "content": "In invasion sports, the central tactical problem on offense is: how do we move the ball past defenders to score? Solutions include creating and using space, passing around defenders, and exploiting numerical advantages. On defence, the central problem is: how do we stop the ball carrier from advancing? Solutions include pressuring the ball, marking opponents tightly, and denying passing lanes. Every invasion sport shares these tactical problems, even though the specific skills differ."},
      {"type": "text", "content": "In net sports like volleyball and badminton, the central tactical problem is: how do we place the object in a space our opponent cannot reach? Solutions include directing shots to corners, varying pace and height, and reading the opponent''s court position. Defence requires reading the flight of the object and positioning to cover the most likely landing zones. Net sports also require the tactical use of deception — disguising where a shot is going until the last moment."},
      {"type": "list", "style": "unordered", "items": ["Invasion sports: attack space, maintain possession, exploit numerical advantage", "Net sports: direct to open space, vary pace and height, deceive the opponent", "Both categories: reading the game, communicating with teammates, transitioning quickly"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "Traditional Inuit blanket toss games and plains First Nations target-throwing games both reflect the principles of target sport categories — accuracy, control of trajectory, and reading environmental conditions. These games developed the same spatial reasoning, body control, and strategic thinking required in modern archery, curling, and golf, connecting Indigenous physical traditions to contemporary sport science."},
      {"type": "quiz", "question": "What is the central tactical problem in invasion sports?", "options": ["How to aim accurately at a fixed target", "How to move the ball past defenders into scoring territory", "How to serve the ball over a net consistently", "How to improve cardiovascular endurance"], "correctIndex": 1, "explanation": "In invasion sports, the core offensive tactical problem is moving the ball or puck past defenders to reach the scoring zone. This drives all offensive decision-making: passing, dribbling, creating space, and exploiting numerical advantages."}
    ]'::jsonb,
    '[
      {"term": "Invasion Sport", "definition": "A game category where teams invade the opponent''s territory with the goal of scoring, such as soccer, basketball, or hockey."},
      {"term": "Net/Wall Sport", "definition": "A game category where players send an object over a net or against a wall to win points, such as volleyball or tennis."},
      {"term": "Target Sport", "definition": "A game category where players aim at a fixed target with accuracy, such as curling, archery, or golf."},
      {"term": "Tactical Transfer", "definition": "Using knowledge of tactics from one sport to understand and play a related sport in the same category."},
      {"term": "Deception", "definition": "Disguising the direction or pace of a shot until the last moment to mislead an opponent."},
      {"term": "Marking", "definition": "Staying close to an opponent in a defensive role to limit their options for receiving a pass or shot."}
    ]'::jsonb,
    'Traditional target-throwing and accuracy games among plains and northern First Nations peoples developed spatial reasoning, body control, and strategic reading of environmental conditions — the same core competencies that underpin modern target sports. Connecting these traditions to sport category theory recognizes Indigenous physical culture as a sophisticated and systematic form of athletic development.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Name two examples of invasion sports.', 'Any two of: soccer, basketball, hockey, lacrosse, flag football, ultimate frisbee.', 'Teams invade each other''s territory.', 1, 0),
    (v_tenant, v_ch, 'What is tactical transfer?', 'Using tactical knowledge from one sport to understand a related sport in the same category.', 'If you understand soccer offense, basketball offense follows the same principles.', 2, 1),
    (v_tenant, v_ch, 'What is deception in net sports?', 'Disguising where a shot is going until the last moment to mislead the opponent.', 'Make them move the wrong way.', 2, 2);

  -- Chapter 2: Fitness Components
  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Fitness Components', 'fitness-components-gr6',
    'Explore skill-related fitness components (speed, power, agility, balance, coordination, reaction time) alongside health-related fitness.',
    '[
      {"type": "heading", "content": "Fitness Components", "level": 1},
      {"type": "text", "content": "In previous grades, you learned about the five health-related fitness components: cardiovascular endurance, muscular strength, muscular endurance, flexibility, and body composition. These components determine your overall health and wellbeing. In Grade 6, you will also explore the six skill-related fitness components, which determine how well you perform specific sport and movement skills."},
      {"type": "callout", "style": "info", "title": "Skill-Related vs. Health-Related Fitness", "content": "Health-related fitness components (cardiovascular endurance, muscular strength, muscular endurance, flexibility, body composition) are important for everyone''s health. Skill-related fitness components (speed, power, agility, balance, coordination, reaction time) are especially important for athletic performance. Both can be improved through training."},
      {"type": "text", "content": "Speed is how fast you can move from point A to point B. Power is speed combined with strength — a jumping athlete uses power to explode off the ground. Agility is the ability to change direction quickly and accurately under control. Balance, as discussed in earlier grades, is maintaining stability. Coordination is using multiple body parts smoothly together, as in dribbling a ball while running. Reaction time is how quickly your body responds to a signal — crucial in catching a ball or defending in hockey."},
      {"type": "text", "content": "Agility is arguably the most important skill-related component for team sports because games require constant, rapid direction changes. Agility can be improved through cone drills, ladder drills, and agility-based games. Saskatchewan rugby, soccer, and hockey players develop agility through the quick directional demands of their sports. On ice, agility is particularly challenging because the reduced friction of skating requires different movement mechanics than running."},
      {"type": "list", "style": "unordered", "items": ["Speed: rate of movement from A to B", "Power: force x velocity; explosive strength (jumping, sprinting)", "Agility: ability to change direction quickly and accurately", "Balance: maintaining stability against gravity", "Coordination: integrating multiple body parts smoothly", "Reaction time: speed of response to a sensory stimulus"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "Arctic Winter Games events such as the Two-Foot High Kick and the Kneel Jump directly test power and balance — two skill-related fitness components. The Ear Pull tests pain tolerance and muscular endurance simultaneously. These traditional events were designed to test and celebrate the specific physical capacities needed for northern Indigenous life, aligning closely with modern skill-related fitness science."},
      {"type": "quiz", "question": "Which skill-related fitness component combines speed and strength into an explosive movement?", "options": ["Agility", "Coordination", "Power", "Reaction time"], "correctIndex": 2, "explanation": "Power = force × velocity. It is the combination of strength and speed, producing explosive movements such as jumping, sprinting, and throwing. A powerful athlete can generate force very quickly, which is distinct from either pure speed or pure strength alone."}
    ]'::jsonb,
    '[
      {"term": "Speed", "definition": "The rate at which a person can move from one point to another."},
      {"term": "Power", "definition": "The combination of strength and speed, enabling explosive movements such as jumping and sprinting."},
      {"term": "Agility", "definition": "The ability to change direction quickly and accurately while maintaining control."},
      {"term": "Coordination", "definition": "The ability to use multiple body parts together smoothly and efficiently to perform a movement."},
      {"term": "Reaction Time", "definition": "The time it takes the body to respond to a sensory stimulus, such as a starting signal or an incoming ball."},
      {"term": "Skill-Related Fitness", "definition": "Fitness components that influence athletic performance: speed, power, agility, balance, coordination, and reaction time."}
    ]'::jsonb,
    'The Arctic Winter Games, which include Indigenous athletes from Saskatchewan, showcase events directly measuring skill-related fitness components including power (Two-Foot High Kick), balance (One-Foot High Kick), and strength endurance (Ear Pull). These traditional events celebrate the specific physical capacities developed through life in demanding northern environments — a living Indigenous fitness science.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Name the six skill-related fitness components.', 'Speed, power, agility, balance, coordination, and reaction time.', 'SA-BACR', 2, 0),
    (v_tenant, v_ch, 'What is the difference between power and strength?', 'Strength is maximum force; power is strength combined with speed — producing explosive movement.', 'Power = force × velocity.', 2, 1),
    (v_tenant, v_ch, 'Why is agility especially important in team sports?', 'Team sports require constant, rapid direction changes to avoid defenders and create space.', 'Think about how often you change direction in soccer or basketball.', 2, 2);

  -- Chapter 3: Adventure Activities
  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Adventure Activities', 'adventure-activities-gr6',
    'Explore challenge-based physical activities that build teamwork, risk management, and resilience in outdoor and gym settings.',
    '[
      {"type": "heading", "content": "Adventure Activities", "level": 1},
      {"type": "text", "content": "Adventure activities are physical challenges that place students slightly outside their comfort zone in a safe, structured environment. They build the same qualities that outdoor explorers, athletes, and community leaders need: risk management, trust in teammates, resilience when things go wrong, problem-solving under pressure, and communication. Common adventure activities in physical education include low ropes courses, trust exercises, problem-solving challenges, and outdoor pursuits."},
      {"type": "callout", "style": "info", "title": "The Challenge by Choice Principle", "content": "All adventure activities operate by the challenge by choice principle: every participant chooses their own level of challenge. No one is forced to attempt something they are uncomfortable with. However, students are encouraged to push their comfort zone gradually, because growth happens just beyond where we feel safe. Observers who watch while others participate are still part of the group and contributing."},
      {"type": "text", "content": "Low ropes activities are conducted close to the ground (usually 30–60 centimetres) so that falls are harmless, yet the activities still feel challenging and require trust. A classic low ropes activity is the Trolleys challenge: a group stands on two long wooden planks with rope handles, and must walk the planks across a set distance without anyone stepping off. Every step requires group coordination, communication, and mutual support — if one person steps off, the whole group must restart."},
      {"type": "text", "content": "Problem-solving activities like the Human Knot, Traffic Jam, or Pipeline challenge groups to solve a physical puzzle together. These activities have no physical fitness requirement — they are purely cooperative problem-solving. The debrief after the activity is as important as the activity itself: groups discuss what communication strategies worked, who emerged as a leader, and how they could solve the problem more efficiently next time."},
      {"type": "list", "style": "unordered", "items": ["Low ropes: ground-level challenges requiring trust and group coordination", "Trust fall: a partner catches you as you fall back with eyes closed", "Problem-solving challenges: Human Knot, Traffic Jam, Pipeline", "Debrief: group discussion after the activity to reflect on process and learning"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "Traditional bush survival challenges among Cree and Dene youth in northern Saskatchewan required exactly the problem-solving, trust, and risk-management skills developed in modern adventure education. Learning to build shelter, navigate home in poor visibility, and manage cold-weather emergencies in small groups built the same group reliance, calm decision-making, and resilience that adventure activities target today."},
      {"type": "quiz", "question": "What is the challenge by choice principle in adventure activities?", "options": ["Everyone must complete every activity or the group fails", "Only the strongest students attempt the most difficult challenges", "Each participant chooses their own level of challenge without being forced to exceed their comfort", "The teacher chooses the difficulty level for each student"], "correctIndex": 2, "explanation": "Challenge by choice means every participant decides how far to push themselves. No one is forced to attempt something uncomfortable. The principle respects individual readiness while encouraging gradual growth beyond the current comfort zone."}
    ]'::jsonb,
    '[
      {"term": "Adventure Activity", "definition": "A structured physical challenge designed to develop teamwork, resilience, risk management, and communication just outside the comfort zone."},
      {"term": "Challenge by Choice", "definition": "The principle that each participant chooses their own level of challenge in an adventure activity without being coerced."},
      {"term": "Low Ropes Course", "definition": "A series of ground-level challenges using ropes and wooden elements that require group cooperation and trust."},
      {"term": "Debrief", "definition": "A structured group discussion after an activity to reflect on what happened, what worked, and what to do differently."},
      {"term": "Resilience", "definition": "The ability to recover from setbacks and keep trying when a challenge is difficult."},
      {"term": "Risk Management", "definition": "Identifying potential hazards and taking steps to minimize them while still engaging in the activity."}
    ]'::jsonb,
    'Traditional Cree and Dene youth in northern Saskatchewan learned bush survival and navigation through guided group challenges that built exactly the resilience, risk-management, and cooperative problem-solving skills developed in modern adventure education. These learning traditions embedded physical and mental challenge into community life and the seasonal rhythms of living on the land.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the challenge by choice principle?', 'Each participant chooses their own level of challenge without being forced to exceed their comfort zone.', 'Participation is encouraged but never coerced.', 1, 0),
    (v_tenant, v_ch, 'Why is the debrief after an adventure activity important?', 'It gives the group time to reflect on communication, leadership, and problem-solving strategies — turning experience into learning.', 'The reflection is where the real learning happens.', 2, 1),
    (v_tenant, v_ch, 'What is resilience?', 'The ability to recover from setbacks and keep trying when a challenge is difficult.', 'Bouncing back after a failure.', 1, 2);

  -- Chapter 4: Sport Leadership
  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Sport Leadership', 'sport-leadership-gr6',
    'Explore what it means to lead in a sport context: organizing activities, encouraging teammates, and modelling positive behaviour.',
    '[
      {"type": "heading", "content": "Sport Leadership", "level": 1},
      {"type": "text", "content": "A sport leader is someone who makes a positive difference in the physical activity experience of others. Leadership in sport is not only about being the best player or the team captain. It includes setting up equipment, explaining rules to a new player, encouraging a teammate who is struggling, managing fair team selection, and modelling respectful behaviour on and off the field. Sport leadership is a skill that anyone can develop with practice."},
      {"type": "callout", "style": "info", "title": "Types of Sport Leaders", "content": "Formal leaders have official roles: team captain, referee, coach. Informal leaders emerge through their actions and positive influence without being appointed. Peer leaders are students who lead other students in physical activities. The most effective leaders combine a strong understanding of the activity with genuine care for other participants."},
      {"type": "text", "content": "Planning and leading an activity requires several steps. First, understand the activity thoroughly yourself — you cannot teach what you do not know. Second, prepare the space and equipment before participants arrive. Third, explain rules clearly using simple language and a brief demonstration. Fourth, start the activity and observe, intervening only when necessary for safety or when participation has broken down. Fifth, debrief afterward to give constructive feedback."},
      {"type": "text", "content": "Giving constructive feedback is one of the most important and challenging leadership skills. Constructive feedback is specific, immediate, and helpful: instead of ''good job,'' say ''great pass — you stepped toward your target before releasing, which made it accurate.'' Instead of ''that was wrong,'' say ''try keeping your elbow under the ball when you shoot — it will give you more control.'' Effective feedback builds skill, confidence, and trust."},
      {"type": "list", "style": "unordered", "items": ["Know the activity thoroughly before leading it", "Prepare the space and equipment in advance", "Explain rules with simple language and demonstration", "Give specific, constructive feedback during the activity", "Debrief after the activity to consolidate learning"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "Elder-led physical games in many First Nations communities across Saskatchewan model a form of sport leadership rooted in respect, knowledge transmission, and community building. Elders who teach traditional games like Snow Snake or Hand Games do not just teach rules — they transmit values, cultural knowledge, and community identity. This Elder-youth leadership model is a profound and enduring form of sport leadership."},
      {"type": "quiz", "question": "What makes feedback ''constructive'' rather than simply critical?", "options": ["Constructive feedback focuses on what the person did wrong only", "Constructive feedback is specific, immediate, and provides a helpful suggestion for improvement", "Constructive feedback is only given to the best players", "Constructive feedback must always be positive and never mention errors"], "correctIndex": 1, "explanation": "Constructive feedback is specific (names exactly what happened), immediate (given soon after the action), and helpful (gives a clear suggestion for how to improve). It builds skill and confidence rather than simply evaluating performance."}
    ]'::jsonb,
    '[
      {"term": "Sport Leader", "definition": "A person who positively influences the physical activity experience of others through action, knowledge, and care."},
      {"term": "Formal Leader", "definition": "A person with an official leadership role such as captain, coach, or referee."},
      {"term": "Informal Leader", "definition": "A person who leads through their actions and positive influence without being formally appointed."},
      {"term": "Constructive Feedback", "definition": "Specific, immediate, and helpful comments that identify what happened and offer a clear suggestion for improvement."},
      {"term": "Peer Leader", "definition": "A student who leads other students in physical activities, developing leadership skills through practice."}
    ]'::jsonb,
    'Elder-led physical education in First Nations communities across Saskatchewan embodies a leadership model of profound depth. Elders who teach traditional games transmit not just rules but values, cultural knowledge, and identity — a holistic leadership practice that connects physical activity to community wellbeing and intergenerational responsibility.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the difference between a formal and an informal sport leader?', 'A formal leader has an official role (captain, coach, referee); an informal leader emerges through positive actions and influence.', 'One is appointed; one earns it through behaviour.', 2, 0),
    (v_tenant, v_ch, 'What are three qualities of constructive feedback?', 'Specific, immediate, and helpful (includes a suggestion for improvement).', 'It names what happened and shows what to do next.', 2, 1),
    (v_tenant, v_ch, 'Name two tasks a peer leader does before starting an activity.', 'Any two of: learn the activity thoroughly, prepare equipment and space, plan the explanation and demonstration.', 'Think about what needs to happen before anyone starts moving.', 1, 2);

END;
$$;


-- ============================================================================
-- TEXTBOOK 8: WolfWhale Phys Ed 7
-- Slug: wolfwhale-phys-ed-7
-- Chapters: Sport Strategy, Training Principles (FITT), Body Mechanics, Outdoor & Winter Education
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-phys-ed-7';

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Strategy, Training Science, and Outdoor Excellence',
    'Grade 7 students analyze sport strategy at a deeper level, apply training science through FITT, understand body mechanics and injury prevention, and engage in structured outdoor and winter education.',
    'Understanding how the body moves and adapts to training unlocks the ability to improve performance intentionally and safely.',
    'How do I train smarter, move more efficiently, and thrive in all four Saskatchewan seasons?')
  RETURNING id INTO v_unit;

  -- Chapter 1: Sport Strategy
  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Sport Strategy', 'sport-strategy-gr7',
    'Analyze offensive and defensive systems in team sports and develop the ability to read the game and make effective in-game decisions.',
    '[
      {"type": "heading", "content": "Sport Strategy", "level": 1},
      {"type": "text", "content": "Strategy in sport refers to the overall game plan a team uses before and during competition. While tactics describe individual decisions made in the moment (where to pass, when to shoot), strategy describes the broader system a team plays: how it defends as a unit, how it attacks as a structured group, and how it responds to the opponent''s tendencies. Elite coaches and experienced players think strategically — they see the whole game, not just the next play."},
      {"type": "text", "content": "Game reading is the ability to quickly process what is happening on the field or court and predict what will happen next. A skilled game reader in soccer recognizes when a defender is out of position and immediately moves into that space to receive a pass. A skilled game reader in basketball sees that the opposition is sagging into the paint and calls for a pick-and-roll to exploit the gap at the three-point line. Game reading is developed through experience and deliberate observation — watching high-level games with a strategic eye."},
      {"type": "callout", "style": "info", "title": "Reading the Game", "content": "To read a game: scan the whole field or court, not just the ball; identify the numerical balance (more attackers than defenders?); look for open space before you receive the ball; anticipate your next action before you have the ball. The best players see two or three moves ahead."},
      {"type": "text", "content": "Set plays are pre-planned movement patterns used in specific game situations: a corner kick in soccer, a face-off in hockey, an inbounds play in basketball. Set plays give a team a prepared response to predictable situations, increasing the chance of a successful outcome. Designing and learning a set play requires understanding roles, movement patterns, and how opponents typically defend that situation."},
      {"type": "list", "style": "unordered", "items": ["Strategy: the overall game plan and system a team uses", "Tactic: an in-the-moment decision about how to respond to a game situation", "Game reading: scanning the field to predict and respond to what will happen next", "Set play: a pre-planned movement pattern used in a specific game situation", "Transition defence: the system used to reorganize defensively when possession is lost"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "Traditional lacrosse among Haudenosaunee and other First Nations peoples used sophisticated pre-planned strategic elements: designated attackers and defenders, coordinated movements, and set formations at face-offs. The game was understood as a form of community and sometimes political negotiation — every aspect of strategic play carried social meaning beyond the score. Modern lacrosse strategy is directly descended from these complex traditional systems."},
      {"type": "quiz", "question": "What is the difference between a strategy and a tactic in sport?", "options": ["Strategy is physical; tactics are mental", "Strategy is the overall game plan; a tactic is an in-the-moment decision responding to a specific situation", "Strategy is used only by coaches; tactics are for players", "They are synonyms and mean the same thing"], "correctIndex": 1, "explanation": "Strategy is the big-picture game plan — the system a team plays. A tactic is a specific, real-time decision made within that system, such as passing left when a defender commits right. Both are essential for effective team performance."}
    ]'::jsonb,
    '[
      {"term": "Strategy", "definition": "The overall game plan and system a team uses, designed before and adjusted during competition."},
      {"term": "Tactic", "definition": "A specific in-the-moment decision made during a game in response to what the opponent is doing."},
      {"term": "Game Reading", "definition": "The ability to quickly process game situations and predict what will happen next to make better decisions."},
      {"term": "Set Play", "definition": "A pre-planned movement pattern used in a specific, predictable game situation such as a corner kick or face-off."},
      {"term": "Transition Defence", "definition": "The organized defensive response when a team loses possession and must quickly move from attack to defence."},
      {"term": "Numerical Advantage", "definition": "Having more players in a zone than the opponent, creating a higher probability of scoring."}
    ]'::jsonb,
    'Traditional lacrosse employed sophisticated pre-designed strategic elements including positional roles, coordinated attacking sequences, and defensive formations — a strategic complexity that rivals modern team sport. The game''s development as a community and diplomatic practice among Haudenosaunee and other First Nations peoples reflects a profound understanding of strategy, teamwork, and collective performance.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is game reading?', 'The ability to scan the field, process what is happening, and predict what will occur next to make better decisions.', 'Great players see two or three moves ahead.', 2, 0),
    (v_tenant, v_ch, 'What is a set play?', 'A pre-planned movement pattern designed for a specific, predictable game situation.', 'Think: corner kick or basketball inbounds play.', 2, 1),
    (v_tenant, v_ch, 'What is a numerical advantage?', 'Having more players in a zone than the opponent, creating a higher scoring probability.', '3-on-2 or 2-on-1 are examples.', 2, 2);

  -- Chapter 2: Training Principles (FITT)
  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Training Principles and FITT', 'training-principles-fitt-gr7',
    'Apply the FITT principle and training science concepts — overload, progression, specificity, and recovery — to personal fitness planning.',
    '[
      {"type": "heading", "content": "Training Principles and FITT", "level": 1},
      {"type": "text", "content": "Building fitness is not random. The human body adapts to the specific demands placed upon it — if you train correctly, your body becomes fitter; if you train incorrectly or not at all, your fitness stays the same or declines. Sports scientists have identified a set of training principles that guide effective fitness development. Understanding these principles transforms you from someone who just exercises into someone who trains with purpose and intelligence."},
      {"type": "callout", "style": "info", "title": "The Core Training Principles", "content": "Overload: to improve, you must demand more of your body than it is currently accustomed to. Progression: increase the overload gradually over time to continue improving. Specificity: train for the specific fitness component and sport you want to improve. Recovery: the body improves during rest, not during exercise — adequate recovery is essential. Reversibility: fitness is lost if training stops (use it or lose it)."},
      {"type": "text", "content": "The FITT principle provides the specific levers you can adjust to apply overload and progression: Frequency (train more days per week), Intensity (work harder each session), Time (train for longer), or Type (change the activity to target a different component or muscle group). A common beginner error is increasing all four variables at once, which leads to overtraining and injury. The standard recommendation is to increase only one FITT variable at a time, by no more than 10% per week."},
      {"type": "text", "content": "Recovery is often the most undervalued training principle. Muscle fibres actually break down slightly during hard exercise; the repair process during recovery is what builds strength and endurance. Sleep is the most powerful recovery tool — growth hormone, which stimulates muscle repair, is released primarily during deep sleep. Nutrition, hydration, and active recovery (light movement like walking or stretching) also support the recovery process."},
      {"type": "list", "style": "unordered", "items": ["Overload: demand more than your current capacity to trigger adaptation", "Progression: gradually increase overload — no more than 10% per week", "Specificity: train the exact component and movement pattern you want to improve", "Recovery: rest is when adaptation occurs; prioritize sleep and nutrition", "Reversibility: fitness gains are lost within 2–4 weeks of inactivity — maintenance requires ongoing training"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "Cree and Nakoda hunters on the Saskatchewan prairies applied training principles without formal fitness science. They built endurance gradually through seasonal travel, increased intensity through the demands of the hunt, practised specific movement patterns (running, throwing, carrying) relevant to their activity, and understood the importance of rest and nutrition between demanding journeys. This is applied training science embedded in traditional life."},
      {"type": "quiz", "question": "According to the 10% rule of progression, if you currently run 20 km per week, what is the maximum safe increase for next week?", "options": ["10 km", "5 km", "2 km", "20 km"], "correctIndex": 2, "explanation": "The 10% rule states that you should increase training volume by no more than 10% per week to minimize injury risk. 10% of 20 km = 2 km. Increasing by more than this gives the body insufficient time to adapt to the new load."}
    ]'::jsonb,
    '[
      {"term": "Overload", "definition": "Training at a level of demand greater than your current capacity, which triggers physiological adaptation."},
      {"term": "Progression", "definition": "Gradually increasing overload over time — recommended at no more than 10% per week — to continue improving."},
      {"term": "Specificity", "definition": "The principle that training adaptations are specific to the type, muscle groups, and movement patterns trained."},
      {"term": "Recovery", "definition": "The rest period after exercise during which the body repairs and adapts, resulting in improved fitness."},
      {"term": "Reversibility", "definition": "The loss of fitness gains that occurs when training stops; also called the ''use it or lose it'' principle."},
      {"term": "Overtraining", "definition": "A state of excessive fatigue and performance decline caused by training too hard without adequate recovery."}
    ]'::jsonb,
    'Traditional Cree and Nakoda hunters applied every major training principle through the practical demands of life on the prairies: building endurance gradually, increasing load with longer journeys, practising specific movements relevant to the hunt, and resting between demanding periods. This embodied training science, developed over generations through lived experience, mirrors the principles articulated by modern exercise physiology.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the principle of overload?', 'Training at a demand greater than your current capacity in order to trigger physiological adaptation.', 'You must challenge your body beyond its comfort zone to improve.', 2, 0),
    (v_tenant, v_ch, 'What is reversibility in fitness training?', 'The loss of fitness gains that occurs when training stops — you lose fitness within 2–4 weeks of inactivity.', 'Use it or lose it.', 2, 1),
    (v_tenant, v_ch, 'Why does recovery matter as much as exercise?', 'Adaptation (muscle repair and fitness improvement) happens during recovery, not during the exercise itself.', 'The body rebuilds stronger during rest.', 2, 2);

  -- Chapter 3: Body Mechanics
  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Body Mechanics', 'body-mechanics-gr7',
    'Understand how the musculoskeletal system works, how levers and forces apply to movement, and how to apply biomechanical principles to improve sport performance.',
    '[
      {"type": "heading", "content": "Body Mechanics", "level": 1},
      {"type": "text", "content": "Body mechanics — also called biomechanics — is the science of how forces act on the human body during movement. Understanding biomechanics helps athletes move more efficiently, generate more power, and reduce injury risk. Every sport skill you have learned has a biomechanical explanation for why the correct technique works better than an incorrect one."},
      {"type": "text", "content": "Bones act as levers, joints act as fulcrums, and muscles act as the forces that move the levers. A lever system amplifies force or distance depending on where the fulcrum is positioned. In the human arm, the elbow acts as a fulcrum, the bicep muscle applies force, and the hand holds the load. This arrangement allows the bicep to move the hand through a large arc with a relatively small muscle contraction — an example of a third-class lever."},
      {"type": "callout", "style": "info", "title": "Newton''s Laws Applied to Sport", "content": "First Law (Inertia): a moving object keeps moving until a force stops it — a rolling ball keeps rolling. Second Law (Acceleration): force = mass × acceleration — a heavier ball needs more force to throw the same distance. Third Law (Action-Reaction): every action has an equal and opposite reaction — pushing off the ground propels you forward."},
      {"type": "text", "content": "Centre of gravity is the point in the body where weight is evenly balanced in all directions. For most standing humans, the centre of gravity is near the navel. Stability increases when the centre of gravity is lowered (bend your knees) and when the base of support is widened (feet shoulder-width apart). A defensive stance in basketball — knees bent, feet wide, weight low — follows this biomechanical principle precisely."},
      {"type": "list", "style": "unordered", "items": ["Lever: a rigid structure (bone) that rotates around a fulcrum (joint) under force (muscle)", "Centre of gravity: the balance point of the body; lowering it increases stability", "Base of support: the area enclosed by the body''s contact points with the ground", "Ground reaction force: the upward force the ground exerts when you push down on it", "Follow-through: continuing a movement after contact to maximize velocity transfer"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "Traditional bow-and-arrow techniques developed by Plains First Nations peoples on the Saskatchewan prairies applied intuitive biomechanics. Archers learned optimal draw length, anchor points, release mechanics, and follow-through through observation and practice — building a biomechanically optimal technique without formal science. Modern archery technique closely matches these traditional mechanics."},
      {"type": "quiz", "question": "How does lowering your centre of gravity improve stability?", "options": ["It makes you lighter and easier to move", "It shifts the balance point closer to the ground, reducing the chance of tipping over", "It makes the base of support smaller", "It increases your speed of movement"], "correctIndex": 1, "explanation": "Lowering the centre of gravity (by bending the knees) moves the body''s balance point closer to the ground, making it harder for an external force to tip you over. This is why defensive stances in sport use bent knees and a wide base."}
    ]'::jsonb,
    '[
      {"term": "Biomechanics", "definition": "The science of how forces act on the human body during movement."},
      {"term": "Lever", "definition": "A rigid structure (bone) that rotates around a fulcrum (joint) under the application of force (muscle contraction)."},
      {"term": "Centre of Gravity", "definition": "The point in the body where weight is evenly balanced; lowering it increases stability."},
      {"term": "Base of Support", "definition": "The area enclosed by the contact points between the body and the ground; widening it increases stability."},
      {"term": "Ground Reaction Force", "definition": "The upward force the ground exerts on the body in reaction to the downward force of the body pressing on it."},
      {"term": "Newton''s Third Law", "definition": "For every action there is an equal and opposite reaction — pushing down on the ground propels you upward or forward."}
    ]'::jsonb,
    'Plains First Nations archers on the Saskatchewan prairies developed biomechanically optimal shooting techniques through generations of observation and refinement — building draw length, anchor points, and release mechanics that align with modern archery biomechanics. Traditional Indigenous movement arts embody applied biomechanical knowledge developed without formal scientific language but with precise practical wisdom.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is biomechanics?', 'The science of how forces act on the human body during movement.', 'Bio = body; mechanics = forces and motion.', 2, 0),
    (v_tenant, v_ch, 'How do you increase body stability during a defensive stance?', 'Lower your centre of gravity (bend knees) and widen your base of support (feet shoulder-width or wider).', 'Low and wide = stable.', 2, 1),
    (v_tenant, v_ch, 'State Newton''s Third Law of Motion and give a sport example.', 'Every action has an equal and opposite reaction. Example: pushing off the ground propels you forward when sprinting.', 'Push down to go up or forward.', 2, 2);

  -- Chapter 4: Outdoor & Winter Education
  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Outdoor & Winter Education', 'outdoor-winter-education-gr7',
    'Develop skills for safe and responsible participation in Saskatchewan''s outdoor and winter environments: hiking, cross-country skiing, and cold-weather risk management.',
    '[
      {"type": "heading", "content": "Outdoor & Winter Education", "level": 1},
      {"type": "text", "content": "Saskatchewan''s landscape — the rolling Qu''Appelle Valley, the parkland north of Saskatoon, Prince Albert National Park, and the Cypress Hills — offers world-class outdoor recreation in all four seasons. Outdoor education develops physical fitness alongside environmental literacy: the ability to read weather, understand terrain, manage risk, and travel responsibly in natural settings. These are life skills that enhance safety and deepen your relationship with the land."},
      {"type": "callout", "style": "info", "title": "Leave No Trace Principles", "content": "Leave No Trace is an outdoor ethics framework with seven principles: plan ahead and prepare; travel and camp on durable surfaces; dispose of waste properly; leave what you find; minimize campfire impact; respect wildlife; and be considerate of other visitors. Following these principles ensures outdoor spaces remain healthy for future generations."},
      {"type": "text", "content": "Cross-country skiing is one of the most complete cardiovascular and muscular workouts available in a Saskatchewan winter. The classic technique uses a kick-and-glide motion: plant the pole, kick back with one ski, and glide forward on the other. The skating technique uses a lateral push similar to ice skating and is faster but more technically demanding. Both techniques use the upper and lower body simultaneously, making cross-country skiing an outstanding full-body aerobic activity."},
      {"type": "text", "content": "Cold-weather risk management requires understanding windchill, frostbite, and hypothermia. Windchill combines temperature and wind speed to express how cold the air feels on exposed skin. Frostbite occurs when skin and underlying tissue freeze; early signs include numbness and pale or waxy skin on exposed areas like nose, cheeks, and ears. Hypothermia is a dangerous drop in core body temperature; early signs include uncontrollable shivering and confusion. Both conditions are prevented by layered dressing, limiting exposure time, and monitoring teammates."},
      {"type": "list", "style": "unordered", "items": ["Classic cross-country ski technique: kick-and-glide using poles for propulsion", "Skate ski technique: lateral V-push for greater speed, requires groomed trails", "Windchill: effective temperature felt on exposed skin combining air temperature and wind speed", "Frostbite: freezing of skin and tissue; prevent with covered skin and regular checks", "Hypothermia: dangerous drop in core body temperature; prevent with layers, dry clothing, and movement"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "Dene and Cree peoples of northern Saskatchewan developed and refined snowshoe travel across centuries of winter living. Traditional snowshoes were crafted from white birch frames and rawhide webbing, perfectly engineered for the deep, soft snow of the boreal forest and parkland. Snowshoe racing and long-distance snowshoe travel remain celebrated physical traditions at First Nations winter festivals and community gatherings across Saskatchewan."},
      {"type": "quiz", "question": "What are the early warning signs of frostbite on exposed skin?", "options": ["Red, warm skin with a burning sensation", "Sweating and elevated heart rate", "Numbness and pale or waxy skin on exposed areas such as nose, cheeks, and ears", "Mild shivering and thirst"], "correctIndex": 2, "explanation": "Early frostbite presents as numbness (loss of sensation) and pale, waxy skin on exposed extremities. These are signals to immediately cover the affected area and warm it gradually. Ignoring early signs can lead to tissue damage and more severe frostbite."}
    ]'::jsonb,
    '[
      {"term": "Leave No Trace", "definition": "A framework of seven outdoor ethics principles designed to minimize human impact on natural environments."},
      {"term": "Cross-Country Skiing", "definition": "A winter locomotion sport using long skis and poles to travel across snow, providing a full-body cardiovascular workout."},
      {"term": "Windchill", "definition": "The effective temperature felt on exposed skin, combining actual air temperature and wind speed."},
      {"term": "Frostbite", "definition": "The freezing of skin and underlying tissue caused by exposure to extreme cold; early signs include numbness and pale skin."},
      {"term": "Hypothermia", "definition": "A dangerous drop in core body temperature caused by cold exposure; early signs include uncontrolled shivering and confusion."},
      {"term": "Environmental Literacy", "definition": "The ability to read and interpret natural environmental conditions such as weather, terrain, and wildlife to make safe decisions outdoors."}
    ]'::jsonb,
    'Traditional Dene and Cree snowshoe craftsmanship and travel represent millennia of environmental literacy applied to winter movement. Birch-frame snowshoes were precisely engineered for the boreal landscape, and the knowledge of cold-weather risk — how to dress, when to rest, how to read weather — was transmitted through generations as essential survival and physical education on the land.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is windchill?', 'The effective temperature felt on exposed skin, combining actual air temperature and wind speed.', 'Wind makes cold feel colder.', 1, 0),
    (v_tenant, v_ch, 'What are early signs of frostbite?', 'Numbness and pale or waxy skin on exposed areas such as the nose, cheeks, and ears.', 'Loss of feeling is the first warning.', 2, 1),
    (v_tenant, v_ch, 'Name two Leave No Trace principles.', 'Any two of: plan ahead, travel on durable surfaces, dispose of waste properly, leave what you find, minimize campfire impact, respect wildlife, be considerate of others.', 'The seven principles protect outdoor spaces.', 1, 2);

END;
$$;


-- ============================================================================
-- TEXTBOOK 9: WolfWhale Phys Ed 8
-- Slug: wolfwhale-phys-ed-8
-- Chapters: Advanced Sport Skills, Fitness Programming, Injury Prevention, Lifetime Activities
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-phys-ed-8';

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Performance, Health, and Longevity',
    'Grade 8 students refine advanced sport skills, design comprehensive fitness programs, understand injury prevention, and explore lifetime physical activities that support long-term wellbeing.',
    'The habits, knowledge, and skills built in physical education are investments in a healthy, active life that lasts decades.',
    'How do I build the physical literacy and healthy habits that will serve me for a lifetime?')
  RETURNING id INTO v_unit;

  -- Chapter 1: Advanced Sport Skills
  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Advanced Sport Skills', 'advanced-sport-skills-gr8',
    'Develop refined technique in selected sport skills and understand the role of deliberate practice in skill mastery.',
    '[
      {"type": "heading", "content": "Advanced Sport Skills", "level": 1},
      {"type": "text", "content": "By Grade 8, many students have a foundation of sport skills built over eight years of physical education. The focus now shifts to refinement — developing higher-quality technique in selected skills, understanding the concept of deliberate practice, and applying skills effectively under game conditions. The difference between a good player and an excellent one is often not raw ability but the quality and intelligence of their practice over time."},
      {"type": "callout", "style": "info", "title": "Deliberate Practice", "content": "Deliberate practice is focused, structured practice designed to improve specific weaknesses with immediate feedback. It is different from simply playing the game. In deliberate practice, you isolate one element of a skill, repeat it with concentration, receive feedback, and adjust. Research suggests it takes approximately 10,000 hours of deliberate practice to reach elite-level mastery in complex skills."},
      {"type": "text", "content": "Advanced passing technique in basketball illustrates the principle well. A basic chest pass is a Grade 4 skill. An advanced player in Grade 8 learns the bounce pass (angled to arrive at the receiver''s hands after one bounce), the skip pass (across the court, used to quickly move the ball to the weak side), and the no-look pass (misdirecting defenders by looking away from the intended receiver while delivering an accurate pass). Each requires refined hand placement, wrist snap, and release timing practised in isolation before being integrated into game play."},
      {"type": "text", "content": "Skill transfer occurs when technique practised in one context carries over to another. Advanced overhead volleyball setting transfers to the overhead pass in water polo. The footwork in badminton transfers to tennis and squash. Understanding these connections allows athletes to develop skills across multiple sports more efficiently. Physical education students who develop broad physical literacy — competence across many movement contexts — transfer skills faster and enjoy a wider range of activities throughout life."},
      {"type": "list", "style": "unordered", "items": ["Deliberate practice: focused, structured practice targeting specific weaknesses with feedback", "Blocked practice: repeating the same skill many times in a row (good for initial learning)", "Random practice: practising multiple skills in unpredictable order (better for retention and transfer)", "Mental rehearsal: visualizing a skill perfectly before performing it", "Skill transfer: using technique from one sport to improve performance in another"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "Stick-handling skills in traditional Shinny — the First Nations ancestor of hockey — were developed through exactly the kind of repetitive, community-immersed deliberate practice described by modern sport science. Players who grew up playing Shinny on frozen lakes developed puck-handling dexterity and spatial awareness that transferred directly to modern hockey. The informal daily play of Indigenous winter sports represents thousands of hours of deliberate skill development embedded in community life."},
      {"type": "quiz", "question": "What is the key difference between deliberate practice and simply playing the game?", "options": ["Deliberate practice is less physically demanding", "Deliberate practice isolates specific weaknesses and includes immediate feedback to drive improvement", "Deliberate practice only works for individual sports", "Playing the game is always more effective than isolated practice"], "correctIndex": 1, "explanation": "Deliberate practice targets specific skill weaknesses in an isolated, focused format with immediate corrective feedback. Simply playing the game mixes many skills at once in a variable environment, which is valuable for retention but less efficient for correcting specific technical flaws."}
    ]'::jsonb,
    '[
      {"term": "Deliberate Practice", "definition": "Focused, structured practice targeting specific technical weaknesses with immediate feedback to drive improvement."},
      {"term": "Blocked Practice", "definition": "Repeating the same skill in the same conditions many times in a row, effective for initial skill acquisition."},
      {"term": "Random Practice", "definition": "Practising multiple skills in unpredictable sequences, which improves long-term retention and transfer."},
      {"term": "Skill Transfer", "definition": "The carry-over of learned technique from one sport or movement context to another."},
      {"term": "Physical Literacy", "definition": "Competence, confidence, and motivation to be physically active across a wide range of movement environments and activities throughout life."},
      {"term": "Mental Rehearsal", "definition": "Visualizing a skill performance in detail before executing it, which activates similar brain pathways to physical practice."}
    ]'::jsonb,
    'Shinny — the traditional First Nations winter stick game played on frozen Saskatchewan waterways — developed elite stick-handling and spatial game skills through daily community play. The informal yet high-volume deliberate practice embedded in growing up with Shinny mirrors the 10,000-hour principle of mastery described by modern sport scientists, demonstrating that Indigenous physical traditions embodied sophisticated skill development pathways.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is deliberate practice?', 'Focused, structured practice targeting specific technical weaknesses with immediate feedback.', 'Quality focused repetition beats mindless repetition.', 2, 0),
    (v_tenant, v_ch, 'What is the difference between blocked and random practice?', 'Blocked practice repeats one skill in the same way; random practice mixes multiple skills unpredictably. Random is better for long-term retention.', 'Mixed practice improves game-readiness.', 2, 1),
    (v_tenant, v_ch, 'What is physical literacy?', 'Competence, confidence, and motivation to be physically active across a wide range of movement environments throughout life.', 'It is broader than just being good at one sport.', 2, 2);

  -- Chapter 2: Fitness Programming
  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Fitness Programming', 'fitness-programming-gr8',
    'Design a multi-week personal fitness program applying FITT, periodization, and the principles of overload and recovery.',
    '[
      {"type": "heading", "content": "Fitness Programming", "level": 1},
      {"type": "text", "content": "A fitness program is more than a fitness plan — it is a structured, multi-week training block with deliberate phases of building, sharpening, and recovering. Elite athletes follow periodized programs that manage the relationship between training load and recovery across months and years. Grade 8 students can apply the fundamental concepts of periodization to design their own programs that produce real, measurable results."},
      {"type": "callout", "style": "info", "title": "Periodization Basics", "content": "Periodization divides training into phases. The base phase builds a general fitness foundation with moderate volume and low intensity. The build phase increases intensity and introduces sport-specific training. The peak phase has low volume but maximum intensity. The recovery phase allows full regeneration. Cycling through these phases prevents overtraining and produces peak performance at the right time."},
      {"type": "text", "content": "Circuit training is a popular programming method that alternates strength and cardiovascular stations in a single session. A student might do 30 seconds of push-ups, then 30 seconds of jumping jacks, then 30 seconds of squats, rest for one minute, and repeat. Circuits are time-efficient, require minimal equipment, and develop both muscular endurance and cardiovascular fitness simultaneously. Many circuit workouts can be completed in a schoolyard, a park, or a living room."},
      {"type": "text", "content": "Tracking your program is essential for applying progressive overload intelligently. A training log records each session''s date, activity, duration, intensity, and how you felt during and after the session. Reviewing your log over several weeks reveals patterns: days when energy is consistently low may indicate insufficient recovery; steady performance improvements confirm that your overload and progression are well calibrated."},
      {"type": "list", "style": "unordered", "items": ["Periodization: organizing training into structured phases across weeks or months", "Circuit training: alternating exercise stations with brief rest intervals", "Training log: a record of sessions used to monitor progress and adjust the program", "Rest day: a day with no structured training, essential for recovery and adaptation", "Cross-training: using a different activity to maintain fitness while reducing overuse of primary muscles"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "Traditional seasonal hunting and travel cycles of Cree and Nakoda peoples on the Saskatchewan prairies reflect a natural form of periodization. High-intensity hunting seasons were followed by lower-activity winter or summer camp periods, then renewed high-activity travel. Feast periods followed successful hunts, providing nutritional recovery. The seasonal rhythm of traditional life structured fitness load and recovery across the year — mirroring modern periodization exactly."},
      {"type": "quiz", "question": "What is the purpose of a recovery phase in a periodized training program?", "options": ["To decrease motivation so training feels challenging again", "To allow the body to fully regenerate and consolidate the adaptations made during harder training phases", "To practise new sport skills for the first time", "To increase volume and intensity to maximum levels"], "correctIndex": 1, "explanation": "The recovery phase gives the body time to fully repair, consolidate fitness gains made during harder phases, and prevent overtraining. Athletes who skip recovery phases often plateau or regress in performance due to accumulated fatigue."}
    ]'::jsonb,
    '[
      {"term": "Fitness Program", "definition": "A structured multi-week training plan with deliberate phases designed to produce specific performance or health outcomes."},
      {"term": "Periodization", "definition": "The systematic division of training into phases (base, build, peak, recovery) to maximize performance and prevent overtraining."},
      {"term": "Circuit Training", "definition": "A training method alternating exercises at different stations with brief rest periods, developing both strength and endurance."},
      {"term": "Training Log", "definition": "A written or digital record of each training session including activity, duration, intensity, and subjective notes."},
      {"term": "Cross-Training", "definition": "Using a different physical activity from the primary sport to maintain fitness while reducing overuse of specific muscles."},
      {"term": "Rest Day", "definition": "A scheduled day without structured training, essential for physiological recovery and long-term adaptation."}
    ]'::jsonb,
    'The seasonal activity cycles of Cree and Nakoda peoples on the Saskatchewan prairies naturally embodied the periodization principle: high-intensity hunting and travel seasons followed by lower-activity recovery periods, with nutritional feast periods supporting adaptation. These seasonal rhythms structured both physical load and recovery across the year in ways that modern sport science now formally recommends.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is periodization?', 'Dividing training into systematic phases (base, build, peak, recovery) to maximize performance and prevent overtraining.', 'Plan your hard weeks and your easy weeks.', 2, 0),
    (v_tenant, v_ch, 'What is circuit training?', 'Alternating between different exercise stations with brief rest periods, building both strength and cardiovascular fitness.', 'Move from station to station with minimal rest.', 1, 1),
    (v_tenant, v_ch, 'Why should you keep a training log?', 'To track progress, identify patterns (low energy days, performance improvements), and make intelligent adjustments to your program.', 'Data drives better decisions.', 2, 2);

  -- Chapter 3: Injury Prevention
  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Injury Prevention', 'injury-prevention-gr8',
    'Understand common sport injuries, the principles of prevention, RICE treatment, and when to seek medical attention.',
    '[
      {"type": "heading", "content": "Injury Prevention", "level": 1},
      {"type": "text", "content": "Sport injuries are common, but many are preventable. Understanding the causes of injury and applying evidence-based prevention strategies protects athletes at every level — from recreational school sport to high-performance competition. The goal is not to avoid sport but to participate smartly, so that you can continue being active for years and decades rather than being sidelined by a preventable injury."},
      {"type": "callout", "style": "info", "title": "Categories of Sport Injury", "content": "Acute injuries occur suddenly from a specific event: a sprained ankle from a poor landing, a fractured wrist from a fall. Overuse injuries develop gradually from repetitive stress: shin splints from sudden increases in running volume, tendinitis from repeated throwing. Both categories are largely preventable with proper training, technique, equipment, and recovery."},
      {"type": "text", "content": "The most important injury prevention strategy is proper warm-up. A dynamic warm-up that includes jogging, high knees, leg swings, arm circles, and sport-specific movements increases muscle temperature, joint fluid viscosity, and neural readiness, significantly reducing muscle and tendon injury risk. Static stretching (holding stretches) before exercise does not warm muscles effectively and may slightly reduce power — save it for the cool-down."},
      {"type": "text", "content": "When a soft-tissue injury (sprain, strain, bruise) does occur, the RICE protocol guides initial management. Rest: stop the activity and protect the injured area from further stress. Ice: apply ice wrapped in a cloth for 15–20 minutes every 2–3 hours to reduce swelling and pain. Compression: wrap the area with a tensor bandage to limit swelling. Elevation: raise the injured limb above heart level to reduce swelling. Seek medical attention if: bones may be broken, the injury does not improve within 48 hours, or the joint cannot bear weight."},
      {"type": "list", "style": "unordered", "items": ["RICE: Rest, Ice, Compression, Elevation — immediate management of soft-tissue injuries", "Dynamic warm-up: moving warm-up that prepares muscles and joints for activity", "Sprain: stretching or tearing of a ligament at a joint", "Strain: stretching or tearing of a muscle or tendon", "Overuse injury: gradual injury from repetitive stress without adequate recovery", "Concussion: a traumatic brain injury from impact; requires removal from play and medical assessment"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "Traditional plant-based medicines used by First Nations healers across Saskatchewan — including willow bark (containing salicin, related to aspirin) for pain and swelling, and various poultices for soft-tissue injuries — represent an empirically developed injury management system refined over generations. These traditional treatments were applied using the same underlying principles (reduce inflammation, protect the injured area) that guide modern RICE protocol."},
      {"type": "quiz", "question": "What does the ''C'' in RICE stand for, and what does it do?", "options": ["Cooling — applies ice to numb the pain", "Compression — wraps the injury to limit swelling", "Cushioning — pads the injury to prevent further impact", "Circulation — massages the area to improve blood flow"], "correctIndex": 1, "explanation": "In RICE, C stands for Compression — wrapping the injured area with a tensor bandage to limit the accumulation of swelling fluid. Compression works together with Ice and Elevation to manage the inflammatory response after a soft-tissue injury."}
    ]'::jsonb,
    '[
      {"term": "Acute Injury", "definition": "An injury that occurs suddenly from a specific traumatic event, such as a sprained ankle or broken bone."},
      {"term": "Overuse Injury", "definition": "An injury that develops gradually from repetitive stress without adequate recovery, such as shin splints or tendinitis."},
      {"term": "RICE Protocol", "definition": "Rest, Ice, Compression, Elevation — the standard first-aid approach for soft-tissue sport injuries."},
      {"term": "Sprain", "definition": "A stretching or tearing of a ligament, the connective tissue holding bones together at a joint."},
      {"term": "Strain", "definition": "A stretching or tearing of a muscle or tendon caused by overload or sudden force."},
      {"term": "Concussion", "definition": "A traumatic brain injury caused by impact to the head; requires immediate removal from play and medical assessment."}
    ]'::jsonb,
    'First Nations healers across Saskatchewan developed plant-based injury treatments over generations of empirical refinement. Willow bark, used for its anti-inflammatory properties, and poultice applications to soft-tissue injuries followed the same principles — reduce inflammation and protect the injured area — that underlie modern RICE protocol. Traditional Indigenous medicine represents a sophisticated empirical approach to injury management developed through centuries of observation.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does RICE stand for?', 'Rest, Ice, Compression, Elevation — the initial management protocol for soft-tissue sport injuries.', 'The four steps after a sprain or strain.', 1, 0),
    (v_tenant, v_ch, 'What is the difference between a sprain and a strain?', 'A sprain is ligament damage (at a joint); a strain is muscle or tendon damage.', 'Sprain = ligament; Strain = muscle/tendon.', 2, 1),
    (v_tenant, v_ch, 'Why is a dynamic warm-up better than static stretching before exercise?', 'Dynamic warm-up increases muscle temperature and joint readiness; static stretching before exercise may reduce power and does not effectively warm the muscles.', 'Move to warm up; hold stretches after.', 2, 2);

  -- Chapter 4: Lifetime Activities
  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Lifetime Activities', 'lifetime-activities-gr8',
    'Explore physical activities that can be enjoyed across the lifespan, and develop a personal plan for long-term active living.',
    '[
      {"type": "heading", "content": "Lifetime Activities", "level": 1},
      {"type": "text", "content": "A lifetime activity is a physical activity you can participate in from youth through adulthood and into old age without significant physical barriers. Curling, swimming, cycling, hiking, golf, tennis, yoga, and cross-country skiing are all lifetime activities. Team sports like basketball and soccer can also be played into adulthood, but they become less accessible for some people as the demands on time, availability of teammates, and physical wear increase. Building competence in lifetime activities during school years creates a foundation for active living that lasts decades."},
      {"type": "callout", "style": "info", "title": "Why Lifetime Activities Matter", "content": "Research consistently shows that adults who were physically active in childhood are more likely to remain active throughout their lives. Physical activity in middle and older age reduces the risk of heart disease, type 2 diabetes, osteoporosis, depression, and cognitive decline. The activities you learn to love in school can protect your health for 50 or more years."},
      {"type": "text", "content": "Curling is one of Saskatchewan''s signature lifetime activities. The province has more curling clubs per capita than almost anywhere else in the world. Curling requires balance, coordination, strategy, and teamwork, but places relatively low stress on the joints — which is why many players continue well into their 70s and 80s. The sweeping component provides genuine cardiovascular exercise, and the strategic component keeps the mind engaged. Curling clubs are anchors of social life in dozens of small Saskatchewan communities."},
      {"type": "text", "content": "Designing a personal active living plan involves identifying activities you genuinely enjoy, ensuring they collectively address all five health-related fitness components, and scheduling them realistically around your other commitments. The best plan is one you will actually follow. Variety prevents boredom and reduces overuse injury risk. Social activities (team or partner sports) provide accountability and connection. Outdoor activities connect you to Saskatchewan''s natural landscape."},
      {"type": "list", "style": "unordered", "items": ["Curling: strategic team sport with low joint impact played across the lifespan", "Swimming: full-body cardiovascular activity with near-zero impact, accessible at all ages", "Cycling: cardiovascular and muscular activity adaptable from casual to competitive", "Yoga: flexibility, balance, and mental wellness practice accessible at all fitness levels", "Hiking/snowshoeing: cardiovascular outdoor activities compatible with all seasons in Saskatchewan"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "Drum dancing, hand games, and traditional walking and snowshoe journeys practised by Cree, Nakoda, Dene, and Metis communities across Saskatchewan represent lifetime physical activities in their deepest form. Many Elders in their 70s and 80s continue drum dancing, snowshoeing, and berry-picking walks — maintaining cardiovascular health, flexibility, and mental wellness through physical activities embedded in cultural life and seasonal rhythm."},
      {"type": "quiz", "question": "Which of the following best describes a lifetime activity?", "options": ["A sport that requires a large team of players under age 25", "A physical activity requiring expensive equipment and professional coaching", "A physical activity that can be participated in from youth through older adulthood without major physical barriers", "A competitive sport played at the high school level only"], "correctIndex": 2, "explanation": "A lifetime activity is one accessible across the lifespan — from youth through older adulthood. Lifetime activities tend to have low barriers to entry, flexible participation formats, and physical demands that remain manageable as the body ages."}
    ]'::jsonb,
    '[
      {"term": "Lifetime Activity", "definition": "A physical activity accessible from youth through older adulthood with few physical or logistical barriers to participation."},
      {"term": "Active Living", "definition": "A lifestyle that integrates physical activity into daily routines, recreation, and community participation."},
      {"term": "Curling", "definition": "A strategic team sport played on ice where players slide granite stones toward a target; one of Saskatchewan''s signature sports."},
      {"term": "Physical Activity Pyramid", "definition": "A guide illustrating recommended amounts of different types of physical activity from daily movement at the base to moderate and vigorous activity higher up."},
      {"term": "Social Physical Activity", "definition": "Physical activity done with others, which provides accountability, motivation, and social connection alongside health benefits."}
    ]'::jsonb,
    'Drum dancing, traditional snowshoe journeys, berry picking, and ceremonial walking among Cree, Nakoda, Dene, and Metis Elders in Saskatchewan represent lifetime physical activity in its most complete form — activities that sustain cardiovascular health, flexibility, and mental wellness while simultaneously connecting practitioners to cultural identity, community, and the land. These are the deepest models of active living available.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a lifetime activity?', 'A physical activity accessible from youth through older adulthood without major physical or logistical barriers.', 'Think: curling, swimming, hiking — not tackle football.', 1, 0),
    (v_tenant, v_ch, 'Name two health benefits of remaining physically active in adulthood.', 'Any two of: reduced risk of heart disease, type 2 diabetes, osteoporosis, depression, cognitive decline.', 'Regular activity protects the whole body and mind.', 2, 1),
    (v_tenant, v_ch, 'Why does variety in a personal active living plan matter?', 'It prevents boredom, reduces overuse injury risk, and ensures multiple fitness components are developed.', 'No single activity does everything.', 2, 2);

END;
$$;


-- ============================================================================
-- TEXTBOOK 10: WolfWhale Phys Ed 9
-- Slug: wolfwhale-phys-ed-9
-- Chapters: Officiating & Coaching, Advanced Fitness, Leadership Through Movement, Active for Life
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-phys-ed-9';

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Leadership, Mastery, and Active for Life',
    'Grade 9 students develop officiating and coaching competencies, pursue advanced fitness, lead through physical activity, and create a personal active living vision for the transition beyond school.',
    'Physical education culminates not in sport mastery but in the capacity to lead, serve, and sustain an active life in every season of adulthood.',
    'How do I leave school as a physically literate leader who can contribute to active living in my community?')
  RETURNING id INTO v_unit;

  -- Chapter 1: Officiating & Coaching
  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Officiating & Coaching', 'officiating-coaching-gr9',
    'Develop the knowledge and skills to officiate sport activities and apply basic coaching principles to lead others effectively.',
    '[
      {"type": "heading", "content": "Officiating & Coaching", "level": 1},
      {"type": "text", "content": "Officiating and coaching are two of the most important service roles in sport. Without officials, games descend into argument; without coaches, athletes develop slowly and inconsistently. Both roles require deep knowledge of the sport, the ability to communicate clearly under pressure, emotional control, and a genuine commitment to fair, safe, and positive competition. Grade 9 students who develop these competencies can serve their communities immediately — as referees for younger leagues, as assistant coaches for school teams, or as activity leaders in community recreation."},
      {"type": "callout", "style": "info", "title": "Qualities of an Effective Official", "content": "An effective official knows the rules thoroughly and applies them consistently; positions themselves to see the play; communicates decisions clearly and calmly; manages conflict without escalating it; and prioritizes player safety above all else. Consistency is the most important quality — players respect an official who calls the same standard throughout the game."},
      {"type": "text", "content": "Officiating requires positioning: the official must be in the right place at the right time to see the relevant action. In basketball, referees use a lead-trail-centre system where three officials rotate around the court in designated zones to ensure every part of the play is covered. In soccer, the referee moves with the play while assistant referees handle the touchlines and offside calls. Learning to move as a group to maintain optimal coverage is a skill practised through experience."},
      {"type": "text", "content": "Coaching at its core is the facilitation of learning and performance improvement in another person. Effective coaches use the GROW model: they help athletes identify their Goal, assess their current Reality, explore Options for improvement, and commit to a Way forward. Effective coaches give specific, timely feedback, build athlete confidence, and create a training environment where mistakes are viewed as learning opportunities rather than failures."},
      {"type": "list", "style": "unordered", "items": ["Officiating: know rules, position well, communicate clearly, manage conflict, prioritize safety", "Coaching: facilitate learning using Goal, Reality, Options, Way forward (GROW)", "Specific feedback: name the skill, describe what happened, offer one improvement cue", "Conflict management: acknowledge the concern, restate the rule, move on — do not escalate", "Athlete-centred coaching: put the athlete''s development ahead of winning"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "Traditional Elder-led physical competitions in First Nations communities across Saskatchewan combined officiating and coaching in a single respected role. Elders who organized and guided games like Foot Races, Hand Games, or Snow Snake competitions set the rules, ensured fairness, managed disputes through community consensus, and transmitted both the physical skills and the cultural values embedded in the activity. This holistic leadership role is a profound model for modern officials and coaches."},
      {"type": "quiz", "question": "According to the GROW coaching model, what does the ''O'' stand for?", "options": ["Outcome", "Overload", "Options", "Observation"], "correctIndex": 2, "explanation": "In the GROW model, O stands for Options — the coach helps the athlete explore different strategies or approaches that could close the gap between their current reality and their goal. Generating multiple options builds the athlete''s problem-solving capacity and ownership of their development."}
    ]'::jsonb,
    '[
      {"term": "Official", "definition": "A trained person who enforces the rules of a sport, ensures fair play, and manages the conduct of competition."},
      {"term": "Positioning (Officiating)", "definition": "Moving to the optimal location to see the relevant action and make accurate calls."},
      {"term": "GROW Model", "definition": "A coaching framework: Goal, Reality, Options, Way forward — used to guide an athlete toward performance improvement."},
      {"term": "Athlete-Centred Coaching", "definition": "A coaching philosophy that prioritizes the athlete''s long-term development and wellbeing over short-term winning."},
      {"term": "Conflict Management", "definition": "The ability to acknowledge a dispute, restate relevant rules, and de-escalate tension without losing authority."},
      {"term": "Consistency", "definition": "Applying the same standard of officiating throughout a game regardless of score, time, or which team commits an infraction."}
    ]'::jsonb,
    'Elder leaders in Saskatchewan''s First Nations communities have long combined the roles of officiant, coach, and cultural teacher in the governance of traditional games. Managing disputes through community consensus, transmitting physical skills alongside cultural values, and modelling the conduct expected of all participants — this holistic leadership model is the Indigenous ancestor of modern officiating and coaching practice.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the GROW coaching model?', 'Goal, Reality, Options, Way forward — a framework for helping athletes identify improvement strategies.', 'Four steps to guide athlete development.', 2, 0),
    (v_tenant, v_ch, 'What is the most important quality of an effective official?', 'Consistency — applying the same standard throughout the entire game regardless of circumstances.', 'Players respect consistent calls more than perfect calls.', 2, 1),
    (v_tenant, v_ch, 'What is athlete-centred coaching?', 'A coaching philosophy that prioritizes the athlete''s long-term development and wellbeing over winning at any cost.', 'Development first, results follow.', 2, 2);

  -- Chapter 2: Advanced Fitness
  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Advanced Fitness', 'advanced-fitness-gr9',
    'Explore advanced training concepts including energy systems, heart rate zones, strength training principles, and mental fitness.',
    '[
      {"type": "heading", "content": "Advanced Fitness", "level": 1},
      {"type": "text", "content": "In Grades 7 and 8 you learned how to design fitness programs using FITT and periodization. In Grade 9, you go deeper into the physiology of training — understanding how the body produces energy, how to train in specific heart rate zones, the principles of safe strength training, and the critical role of mental fitness in physical performance. This knowledge empowers you to train with scientific precision rather than guesswork."},
      {"type": "callout", "style": "info", "title": "The Three Energy Systems", "content": "The ATP-PC system provides explosive energy for 1–10 seconds (sprinting, jumping). The glycolytic system provides energy for intense efforts of 30 seconds to 2 minutes (repeated sprints, 400m run). The oxidative system provides sustained energy for efforts lasting more than 2 minutes (distance running, cycling). All three systems work simultaneously, but their relative contribution depends on the intensity and duration of the effort."},
      {"type": "text", "content": "Heart rate zones allow you to target specific energy systems and training adaptations. Zone 1 (50–60% of maximum heart rate) is recovery activity — very easy walking or cycling. Zone 2 (60–70%) is the aerobic base zone, ideal for long slow distance training. Zone 3 (70–80%) is the aerobic threshold zone, the most common training zone for endurance. Zone 4 (80–90%) is the anaerobic threshold, where lactate begins to accumulate faster than it clears. Zone 5 (90–100%) is maximum effort, sustainable for only short bursts."},
      {"type": "text", "content": "Safe strength training for adolescents focuses on bodyweight exercises and moderate resistance, not maximum lifts. Compound exercises (those using multiple joints simultaneously) are most efficient: push-ups train the chest, shoulders, and triceps together; squats train the quadriceps, hamstrings, and glutes together; pull-ups train the back and biceps together. Proper form must be established before increasing load. Adolescent athletes should avoid maximum single-repetition lifts and explosive Olympic lifts without qualified supervision."},
      {"type": "list", "style": "unordered", "items": ["ATP-PC system: 1–10 seconds, explosive power (sprint starts, jumps)", "Glycolytic system: 30 sec–2 min, high-intensity repeating efforts", "Oxidative system: 2+ minutes, sustained aerobic endurance", "Compound exercise: multi-joint movement training multiple muscles simultaneously", "Mental fitness: managing arousal, focus, and self-talk to optimize performance"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "The training demands of the Arctic Winter Games — including events like the Two-Foot High Kick (ATP-PC power), the Ear Pull (muscular endurance and pain management), and the Kneel Jump (explosive lower body power) — target all three energy systems and multiple strength qualities. These traditional northern Indigenous athletic events represent a sophisticated empirical understanding of performance fitness science expressed through cultural sport."},
      {"type": "quiz", "question": "Which energy system provides energy for a maximum sprint lasting approximately 8 seconds?", "options": ["The oxidative system", "The glycolytic system", "The ATP-PC system", "The respiratory system"], "correctIndex": 2, "explanation": "The ATP-PC (phosphocreatine) system provides immediate, explosive energy for very short maximal efforts of approximately 1 to 10 seconds, such as a sprint start, a vertical jump, or a powerful tackle. It does not require oxygen and depletes rapidly, which is why maximum sprinting speed cannot be sustained beyond about 10 seconds."}
    ]'::jsonb,
    '[
      {"term": "ATP-PC System", "definition": "An energy system providing immediate explosive energy for efforts lasting 1 to 10 seconds; does not require oxygen."},
      {"term": "Glycolytic System", "definition": "An energy system providing energy for intense efforts of 30 seconds to 2 minutes through the breakdown of glucose."},
      {"term": "Oxidative System", "definition": "An energy system using oxygen to sustain lower-intensity efforts lasting more than 2 minutes."},
      {"term": "Heart Rate Zone", "definition": "A percentage range of maximum heart rate used to target specific training adaptations and energy systems."},
      {"term": "Compound Exercise", "definition": "A strength exercise involving multiple joints and muscle groups simultaneously, such as squats or push-ups."},
      {"term": "Mental Fitness", "definition": "The ability to manage arousal, maintain concentration, and use positive self-talk to optimize physical performance under pressure."}
    ]'::jsonb,
    'Traditional Arctic Winter Games events — Two-Foot High Kick, Ear Pull, Kneel Jump, and others — represent an empirically developed performance fitness system targeted at the specific energy systems and strength qualities required for northern Indigenous life and celebration. These events embody a sophisticated understanding of explosive power, muscular endurance, and pain tolerance that aligns precisely with modern exercise physiology.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Which energy system powers a 6-second maximum sprint?', 'The ATP-PC system — it provides immediate explosive energy for efforts of 1 to 10 seconds.', 'Short, explosive, and oxygen-free.', 2, 0),
    (v_tenant, v_ch, 'What is a heart rate zone?', 'A percentage range of maximum heart rate used to target specific training adaptations and energy systems.', 'Zone 2 = aerobic base; Zone 4 = anaerobic threshold.', 2, 1),
    (v_tenant, v_ch, 'What is a compound exercise? Give an example.', 'A strength exercise using multiple joints and muscle groups simultaneously. Examples: squat, push-up, pull-up.', 'Multi-joint = compound.', 2, 2);

  -- Chapter 3: Leadership Through Movement
  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Leadership Through Movement', 'leadership-through-movement-gr9',
    'Synthesize leadership skills developed across Grades K–9 and apply them by planning, leading, and evaluating a full physical activity experience for peers or younger students.',
    '[
      {"type": "heading", "content": "Leadership Through Movement", "level": 1},
      {"type": "text", "content": "Everything you have learned in physical education — skills, tactics, fitness, safety, cooperation, inclusion, and personal responsibility — culminates in leadership. A physically literate leader does not simply perform well; they elevate the experience of everyone around them. In Grade 9, you will plan, lead, and debrief a physical activity experience, applying the full spectrum of your learning in an authentic leadership role."},
      {"type": "callout", "style": "info", "title": "The Leadership Planning Cycle", "content": "Effective physical activity leadership follows a cycle: Assess (who are your participants? what are their needs and abilities?), Plan (select an appropriate activity, prepare space and equipment, design your explanation and progression), Lead (run the activity with energy, adjust in real time, ensure safety and inclusion), Debrief (reflect with participants on what worked, what to improve), and Self-Evaluate (assess your own leadership strengths and areas for growth)."},
      {"type": "text", "content": "Adapting activities for mixed ability groups is one of the most important leadership skills. A great activity leader designs activities where the challenge is adjustable: the goal posts are wider for beginners and narrower for advanced players; the ball is larger and softer for younger children and regulation-sized for older ones; the rules are simplified for new learners and fully applied for experienced participants. This principle — differentiated activity design — ensures that every participant is challenged appropriately without being excluded."},
      {"type": "text", "content": "Leading by example is the most powerful leadership tool. Your participants will behave as you behave. If you celebrate effort over outcome, they will celebrate effort. If you model patience with mistakes, they will be patient. If you demonstrate enthusiasm for the activity, they will match your energy. Leadership through movement is ultimately a form of teaching, and the most powerful teachers model the behaviours they want to see rather than simply describing them."},
      {"type": "list", "style": "unordered", "items": ["Assess: know your participants'' abilities, interests, and needs before planning", "Plan: prepare thoroughly — activity choice, progressions, equipment, safety", "Lead: demonstrate enthusiasm, enforce safety, adapt in real time, include everyone", "Debrief: structured reflection to consolidate learning for participants", "Self-evaluate: honestly assess your leadership strengths and set goals for growth"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "The tradition of youth physical activity leadership in First Nations communities across Saskatchewan — where older youth teach younger children traditional games, dances, and outdoor skills — embodies the leadership through movement model at a community scale. This intergenerational transmission of physical culture is one of the most enduring and effective leadership systems in human history, sustaining physical traditions across hundreds of generations."},
      {"type": "quiz", "question": "What is differentiated activity design in physical education leadership?", "options": ["Designing one activity for the best athletes only", "Creating separate programs for each student individually", "Adjusting the challenge level of an activity so participants of different abilities are all appropriately challenged", "Excluding beginners from competitive activities to protect them from failure"], "correctIndex": 2, "explanation": "Differentiated activity design means building adjustable challenge into an activity — varying rules, equipment, space, or targets so that beginners, intermediate, and advanced participants are all challenged at their appropriate level without exclusion. It is the hallmark of inclusive, expert activity leadership."}
    ]'::jsonb,
    '[
      {"term": "Leadership Planning Cycle", "definition": "A framework for activity leadership: Assess, Plan, Lead, Debrief, Self-Evaluate."},
      {"term": "Differentiated Activity Design", "definition": "Adjusting the challenge level, rules, or equipment of an activity so participants of all abilities are appropriately challenged."},
      {"term": "Leading by Example", "definition": "Modelling the behaviours, attitudes, and effort levels you want to see from participants."},
      {"term": "Self-Evaluation", "definition": "Honestly assessing your own performance as a leader to identify strengths and areas for growth."},
      {"term": "Intergenerational Transmission", "definition": "The process of passing knowledge, skills, and cultural practices from older to younger generations."},
      {"term": "Debrief", "definition": "A structured group reflection after an activity that consolidates learning and identifies areas for improvement."}
    ]'::jsonb,
    'The intergenerational transmission of physical culture — older youth teaching younger children traditional games, dances, and outdoor skills — has been central to First Nations community life across Saskatchewan for generations. This living leadership model, where knowledge flows from experienced to novice participants through practice and example, is both the oldest and most effective form of physical education leadership that exists.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are the five steps of the Leadership Planning Cycle?', 'Assess, Plan, Lead, Debrief, Self-Evaluate.', 'Before, during, and after the activity.', 2, 0),
    (v_tenant, v_ch, 'What is differentiated activity design?', 'Adjusting challenge level, rules, or equipment so participants of all abilities are appropriately challenged without being excluded.', 'One activity, multiple challenge levels.', 2, 1),
    (v_tenant, v_ch, 'Why is leading by example the most powerful leadership tool?', 'Participants model the leader''s behaviour — enthusiasm, patience, and effort are all contagious.', 'They do what they see you do.', 1, 2);

  -- Chapter 4: Active for Life
  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Active for Life', 'active-for-life-gr9',
    'Create a personal active living vision for the transition out of school, identifying activities, motivations, barriers, and strategies for a lifelong active lifestyle.',
    '[
      {"type": "heading", "content": "Active for Life", "level": 1},
      {"type": "text", "content": "Physical education does not end with Grade 9. But the structure that school provided — scheduled classes, organized teams, available facilities and equipment, required participation — does end. Staying active as an adult requires intention, self-motivation, and planning. The transition out of school is when many young people''s activity levels decline sharply. Building a realistic, enjoyable, and sustainable active living plan before you leave Grade 9 dramatically increases the chance that you will remain active for life."},
      {"type": "callout", "style": "info", "title": "The Active Living Continuum", "content": "Active living exists on a continuum from sedentary (little or no movement) through light activity (walking, gentle yoga) to moderate activity (brisk walking, recreational swimming) to vigorous activity (running, competitive sport). Health benefits accumulate at every level — moving from sedentary to light is the most impactful shift of all. The goal is not perfection but consistent, progressive movement that fits your life."},
      {"type": "text", "content": "Common barriers to active living in young adulthood include time constraints (work, school, family), cost (gym fees, equipment), access (distance from facilities), social isolation (no team or activity partner), and motivation decline after leaving school sport. Identifying your personal barriers honestly allows you to design around them: free outdoor activities (running, hiking, snowshoeing) eliminate cost and access barriers; walking or cycling to work eliminates the time barrier; joining a community recreation league eliminates the social isolation barrier."},
      {"type": "text", "content": "Saskatchewan''s community recreation infrastructure is exceptional for a relatively small population. Nearly every town has a curling rink, an outdoor skating surface, a baseball diamond, and a community hall. Many communities have free or low-cost trails, parks, and recreation programs. Saskatchewan''s provincial parks — from Cypress Hills in the southwest to Narrow Hills in the north — offer hiking, paddling, skiing, and camping accessible to everyone. Using this infrastructure intentionally is a strategy for a lifetime of active living."},
      {"type": "list", "style": "unordered", "items": ["Identify your intrinsic motivators: why do YOU want to be active?", "Choose activities you genuinely enjoy — obligation fades, enjoyment sustains", "Plan for all four seasons in Saskatchewan: outdoor activity is possible year-round", "Build a social component: activity partners and community leagues provide accountability", "Use your community''s existing infrastructure: rinks, trails, parks, recreation centres"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Games", "content": "The concept of active living as a community-embedded, year-round, culturally meaningful practice is foundational in First Nations, Metis, and Inuit communities across Saskatchewan. Seasonal harvesting walks, fishing trips, community dances, traditional games at cultural gatherings, and Elder-youth outdoor learning are all forms of active living woven into cultural life rather than separated from it. This integration of movement and meaning is the richest model of active living available."},
      {"type": "quiz", "question": "According to research on lifelong activity, which transition period is associated with the sharpest decline in physical activity for many people?", "options": ["The transition from Grade 3 to Grade 4", "The transition out of secondary school into work or post-secondary life", "The transition from indoor to outdoor seasons", "The transition from recreational to competitive sport"], "correctIndex": 1, "explanation": "Research consistently identifies the transition out of secondary school as the period of sharpest activity decline for many young people. The structured physical activity environment of school is removed, and young adults must develop the self-motivation and planning skills to remain active without it. This is why active living planning in Grade 9 is so important."}
    ]'::jsonb,
    '[
      {"term": "Active Living", "definition": "A lifestyle that integrates physical activity into daily routines, recreation, and community participation across the lifespan."},
      {"term": "Intrinsic Motivation", "definition": "Motivation that comes from within — doing an activity because you find it personally meaningful, enjoyable, or satisfying."},
      {"term": "Barrier to Active Living", "definition": "A factor that makes it harder to participate in physical activity, such as cost, time, access, or social isolation."},
      {"term": "Active Living Continuum", "definition": "A spectrum from sedentary to vigorous activity; every increment of increased activity provides health benefits."},
      {"term": "Community Recreation", "definition": "Physical activity opportunities provided by local governments and organizations such as rinks, parks, leagues, and trails."},
      {"term": "Sustainable Activity", "definition": "Physical activity chosen and scheduled in a way that can realistically be maintained long-term given a person''s life circumstances."}
    ]'::jsonb,
    'For First Nations, Metis, and Inuit peoples across Saskatchewan, active living has never been a separate program or scheduled class — it is woven into cultural life through seasonal harvesting, traditional games, community dances, and Elder-guided outdoor learning. This integration of movement and cultural meaning is the most sustainable and fulfilling model of active living, and it offers a profound framework for all Canadians seeking to remain active across a lifetime.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is intrinsic motivation?', 'Motivation that comes from within — doing something because you personally find it meaningful, enjoyable, or satisfying.', 'Internal drive versus external pressure.', 2, 0),
    (v_tenant, v_ch, 'Name two common barriers to active living in young adulthood.', 'Any two of: time constraints, cost, lack of access to facilities, social isolation, motivation decline after leaving school sport.', 'Think about what stops people from exercising after high school.', 1, 1),
    (v_tenant, v_ch, 'What is sustainable physical activity?', 'Activity chosen and scheduled in a way that can realistically be maintained long-term given a person''s actual life circumstances.', 'The best plan is one you will actually follow.', 2, 2);

END;
$$;
