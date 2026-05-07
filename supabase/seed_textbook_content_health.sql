-- ============================================================================
-- WolfWhale Health Education Textbook Content Seed Data
-- Grades K-9 (Saskatchewan Curriculum)
--
-- 10 Textbooks:
--   wolfwhale-health-k through wolfwhale-health-9
--
-- Each textbook contains 4 chapters with:
--   - Rich JSONB content blocks (heading, text, callout, quiz, list)
--   - Key terms with definitions
--   - Indigenous connections / Medicine Wheel callouts
--   - Flashcards for spaced repetition
--
-- All content is 100% original. No copied material from any publisher.
-- tenant_id uses placeholder UUID: 00000000-0000-0000-0000-000000000001
-- ============================================================================


-- ============================================================================
-- TEXTBOOK 1: WolfWhale Health K
-- Slug: wolfwhale-health-k
-- Chapters: Personal Safety, Healthy Eating, Understanding Feelings,
--           Positive Relationships
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-health-k';

  -- Single unit wraps all 4 chapters for K
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Being Healthy and Safe',
    'Kindergarten students explore what it means to be safe, to eat well, to recognize feelings, and to build positive relationships.',
    'Taking care of our bodies and feelings helps us grow and live well.',
    'What does it mean to be healthy and safe every day?')
  RETURNING id INTO v_unit;

  -- -----------------------------------------------------------------------
  -- Chapter 1: Personal Safety
  -- -----------------------------------------------------------------------
  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Personal Safety', 'health-k-personal-safety',
    'Learn the basics of keeping your body safe, recognising trusted adults, and what to do in an emergency.',
    '[
      {"type":"heading","level":1,"text":"Personal Safety"},
      {"type":"text","content":"Every day you make choices that help keep you safe. Safety means protecting your body from harm. When you hold a hand while crossing the street, wear a helmet on your bike, or tell a grown-up when something feels wrong, you are making safe choices."},
      {"type":"callout","style":"info","title":"What Is Safety?","content":"Safety means taking care of your body so that you stay healthy and free from harm. Safe choices help you and the people around you."},
      {"type":"text","content":"There are special grown-ups called trusted adults who help keep you safe. A trusted adult is someone you know very well, like a parent, grandparent, teacher, or school helper. If you ever feel scared, hurt, or unsure about something, you can always go to a trusted adult for help."},
      {"type":"list","style":"unordered","items":["Parents and caregivers","Grandparents","Teachers and school helpers","Police officers and firefighters"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"In many Indigenous teachings, the Medicine Wheel reminds us that wellness comes in four parts: our body, our mind, our feelings, and our spirit. Keeping our body safe is an important part of being well in all four ways."},
      {"type":"text","content":"Your body belongs to you. No one should touch your body in a way that makes you feel uncomfortable or scared. If someone touches you in a way that feels wrong, it is never your fault. You can always say no and then tell a trusted adult."},
      {"type":"quiz","question":"Who is a trusted adult?","options":["A stranger you just met","A grown-up you know well and can count on for help","Anyone who is taller than you","Only a doctor"],"correctIndex":1,"explanation":"A trusted adult is someone you know well, like a parent, teacher, or grandparent, who will listen and help keep you safe."}
    ]'::jsonb,
    '[
      {"term":"Safety","definition":"Protecting your body and staying free from harm by making good choices."},
      {"term":"Trusted Adult","definition":"A grown-up you know well who you can go to for help when you feel scared or unsure."},
      {"term":"Emergency","definition":"A sudden situation where you need help right away, like calling 9-1-1."},
      {"term":"Boundary","definition":"A personal rule about what is okay and not okay for your body."}
    ]'::jsonb,
    'Many Indigenous communities in Saskatchewan teach children about safety through the idea of community responsibility. Elders share stories that help young people understand that everyone in the community watches over one another, and that asking for help is a sign of strength and trust.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a trusted adult?', 'A grown-up you know well, like a parent, teacher, or grandparent, who helps keep you safe.', 'Think of someone at home or school.', 1, 0),
    (v_tenant, v_ch, 'What should you do if something feels wrong or scary?', 'Tell a trusted adult right away.', 'You never have to handle it alone.', 1, 1),
    (v_tenant, v_ch, 'What number do you call in an emergency?', '9-1-1', 'Three digits for help right away.', 1, 2);

  -- -----------------------------------------------------------------------
  -- Chapter 2: Healthy Eating
  -- -----------------------------------------------------------------------
  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Healthy Eating', 'health-k-healthy-eating',
    'Discover why food gives us energy and how eating a variety of foods helps our bodies grow.',
    '[
      {"type":"heading","level":1,"text":"Healthy Eating"},
      {"type":"text","content":"Food is fuel for your body. Just like a car needs gas to run, your body needs food to give you the energy to play, learn, and grow. Eating different kinds of food every day helps keep your body strong and your brain sharp."},
      {"type":"callout","style":"info","title":"Why Do We Eat?","content":"Food gives our bodies energy and the building blocks they need to grow, heal, and work properly. Eating a variety of foods each day is one of the best things you can do for your health."},
      {"type":"text","content":"Vegetables and fruits are full of vitamins that help your body fight illness. Grain foods like bread and rice give you long-lasting energy. Foods like beans, meat, eggs, and milk help build strong muscles and bones. Drinking water throughout the day keeps every part of your body working well."},
      {"type":"list","style":"unordered","items":["Fruits and vegetables: vitamins and fibre","Grains: long-lasting energy","Protein foods: strong muscles and bones","Water: keeps your body working"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"Traditional Indigenous foods from the land, like berries, fish, bison, and wild plants, have nourished communities on the prairies for thousands of years. These foods are part of a whole way of living that connects physical health with respect for the land and all living things."},
      {"type":"text","content":"Snacks can be healthy too! Fresh fruit, cut vegetables, or a small handful of nuts give your body good energy between meals. It is also important to eat when you are hungry and to slow down and enjoy your food."},
      {"type":"quiz","question":"Which of the following is a healthy snack choice?","options":["A bag of chips","An apple with peanut butter","A glass of soda","A large candy bar"],"correctIndex":1,"explanation":"An apple with peanut butter gives your body vitamins, fibre, and protein. It is a healthy snack that gives you steady energy."}
    ]'::jsonb,
    '[
      {"term":"Nutrition","definition":"The way your body uses food to grow, have energy, and stay healthy."},
      {"term":"Vegetable","definition":"A plant food that provides vitamins, minerals, and fibre to keep your body healthy."},
      {"term":"Protein","definition":"A nutrient found in foods like meat, eggs, and beans that helps build strong muscles and bones."},
      {"term":"Energy","definition":"The power your body gets from food that lets you move, think, and play."},
      {"term":"Vitamin","definition":"A natural substance found in food that your body needs in small amounts to work properly."}
    ]'::jsonb,
    'Saskatchewan Indigenous communities have long harvested traditional foods including saskatoon berries, wild game, and fish. These foods carry deep cultural meaning and nourish both body and spirit. Reconnecting with traditional foods is an important part of wellness for many First Nations and Metis families today.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Why does your body need food?', 'For energy to move, learn, and grow, and for nutrients to stay healthy.', 'Think about what fuel does for a car.', 1, 0),
    (v_tenant, v_ch, 'Name two foods that give your body protein.', 'Eggs, meat, beans, fish, or dairy (any two are correct).', 'These foods help build muscles.', 1, 1),
    (v_tenant, v_ch, 'What is the best drink for your body throughout the day?', 'Water', 'No sugar, no calories, just pure goodness.', 1, 2);

  -- -----------------------------------------------------------------------
  -- Chapter 3: Understanding Feelings
  -- -----------------------------------------------------------------------
  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Understanding Feelings', 'health-k-understanding-feelings',
    'Identify common emotions, understand that all feelings are normal, and learn simple ways to calm down.',
    '[
      {"type":"heading","level":1,"text":"Understanding Feelings"},
      {"type":"text","content":"Every person has feelings. Feelings are the emotions you experience inside, like happiness, sadness, anger, fear, or excitement. All feelings are normal and okay to have. What matters is what we do with our feelings."},
      {"type":"callout","style":"info","title":"What Are Feelings?","content":"Feelings are emotions that live inside you. They can change throughout the day. Every feeling, even the hard ones like sadness or anger, is a normal part of being human."},
      {"type":"text","content":"Happy feelings can make you want to smile, laugh, or hug someone. Sad feelings might make you want to cry or be quiet. Angry feelings can make your body feel hot and tight. Scared feelings can make your heart beat fast. All of these are ways your body and mind communicate with you."},
      {"type":"list","style":"unordered","items":["Happy: smiling, laughing, feeling warm inside","Sad: crying, wanting to be quiet","Angry: feeling hot, wanting to stomp or yell","Scared: heart beating fast, wanting to hide","Excited: butterflies in your tummy, wanting to jump"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"Indigenous wellness teachings remind us that our emotional health is just as important as our physical health. The emotional part of the Medicine Wheel teaches us to recognize our feelings, express them in healthy ways, and take care of our hearts."},
      {"type":"text","content":"When a feeling gets very big, it helps to take slow, deep breaths. Breathing in slowly through your nose and out through your mouth can help calm your body. You can also talk to a trusted adult, draw a picture, or go outside and move your body."},
      {"type":"quiz","question":"What is a healthy way to calm down when you feel very angry?","options":["Hit someone","Take deep breaths and talk to a trusted adult","Run away and hide forever","Yell as loudly as you can"],"correctIndex":1,"explanation":"Taking deep breaths slows your heart rate and helps your body relax. Talking to a trusted adult helps you work through big feelings safely."}
    ]'::jsonb,
    '[
      {"term":"Feelings","definition":"Emotions you experience inside, such as happiness, sadness, anger, or fear."},
      {"term":"Emotion","definition":"A strong feeling that affects how you think and act."},
      {"term":"Calm","definition":"A quiet, relaxed state where your body and mind feel settled."},
      {"term":"Deep Breathing","definition":"Breathing slowly and fully to help your body relax when feelings get very big."}
    ]'::jsonb,
    'Many Cree and Nakoda teachings emphasise that emotional wellbeing is central to overall health. Storytelling, ceremony, and time spent in nature are traditional tools for processing emotions and finding balance. Elders teach that naming and honouring our feelings is a sign of wisdom.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Name three different feelings.', 'Happy, sad, angry, scared, or excited (any three are correct).', 'Think about how you felt today.', 1, 0),
    (v_tenant, v_ch, 'What can you do when a feeling gets very big?', 'Take deep breaths, talk to a trusted adult, draw, or move your body.', 'Your body needs a calm-down tool.', 1, 1),
    (v_tenant, v_ch, 'Are all feelings okay to have?', 'Yes, all feelings are normal. What matters is what we do with them.', 'Even hard feelings are part of being human.', 1, 2);

  -- -----------------------------------------------------------------------
  -- Chapter 4: Positive Relationships
  -- -----------------------------------------------------------------------
  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Positive Relationships', 'health-k-positive-relationships',
    'Explore what makes a good friend, how to be kind, and ways to solve small disagreements peacefully.',
    '[
      {"type":"heading","level":1,"text":"Positive Relationships"},
      {"type":"text","content":"People need each other. Relationships are the connections we have with family, friends, teachers, and neighbours. Positive relationships are built on kindness, respect, and care. They help us feel happy, safe, and loved."},
      {"type":"callout","style":"info","title":"What Is a Positive Relationship?","content":"A positive relationship is one where both people treat each other with kindness and respect, listen to each other, and help each other feel safe and valued."},
      {"type":"text","content":"Good friends share, take turns, and include others in their play. They say kind words and listen when someone is talking. They help each other when things are hard and celebrate when things go well. Being a good friend also means saying sorry when you make a mistake and forgiving others when they say sorry to you."},
      {"type":"list","style":"unordered","items":["Share and take turns","Use kind words","Listen when others speak","Include everyone in play","Say sorry when you make a mistake","Help others when they are sad or hurt"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"Many Indigenous cultures teach the value of community and interconnectedness. In these teachings, we are all part of one great circle. When we treat others with kindness and respect, we strengthen the whole community and honour the spirit of the circle."},
      {"type":"text","content":"Sometimes friends disagree. That is normal. When you have a disagreement, use words to explain how you feel. Say, I feel sad when... or I do not like it when... Then listen to how the other person feels. Together you can find a solution that works for both of you."},
      {"type":"quiz","question":"Which of the following shows a positive relationship?","options":["Taking someone else''s toy without asking","Calling someone a mean name","Helping a friend who fell down","Leaving someone out of a game on purpose"],"correctIndex":2,"explanation":"Helping someone who is hurt shows kindness and care. These are important parts of a positive relationship."}
    ]'::jsonb,
    '[
      {"term":"Relationship","definition":"A connection between people, such as family, friendship, or community."},
      {"term":"Kindness","definition":"Treating others with care, warmth, and consideration."},
      {"term":"Respect","definition":"Treating others the way you would like to be treated, valuing their feelings and boundaries."},
      {"term":"Friendship","definition":"A relationship between two or more people who care about each other and enjoy spending time together."},
      {"term":"Disagreement","definition":"When two people have different opinions or wants and need to find a solution together."}
    ]'::jsonb,
    'In many Saskatchewan First Nations traditions, the concept of miyo-wicehtowin, meaning good relations, is a core value. Building positive relationships with family, community, and the natural world is considered essential for living a healthy and meaningful life. These teachings remind us that no one thrives alone.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Name two qualities of a good friend.', 'Kind, respectful, a good listener, sharing, inclusive, helpful (any two).', 'How do good friends make you feel?', 1, 0),
    (v_tenant, v_ch, 'What should you do when you disagree with a friend?', 'Use words to explain your feelings, listen to their feelings, and find a solution together.', 'Words work better than shouting.', 1, 1),
    (v_tenant, v_ch, 'What does respect mean?', 'Treating others the way you would like to be treated and valuing their feelings.', 'The golden rule.', 1, 2);

END;
$$;


-- ============================================================================
-- TEXTBOOK 2: WolfWhale Health 1
-- Slug: wolfwhale-health-1
-- Chapters: My Body, Hygiene & Nutrition, Emotions & Feelings,
--           Personal Space & Boundaries
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-health-1';

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'My Health, My Body',
    'Grade 1 students learn about their bodies, hygiene, emotions, and personal boundaries.',
    'Understanding our bodies and feelings helps us make healthy choices and build safe relationships.',
    'How can I take care of my body and feelings every day?')
  RETURNING id INTO v_unit;

  -- -----------------------------------------------------------------------
  -- Chapter 1: My Body
  -- -----------------------------------------------------------------------
  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'My Body', 'health-1-my-body',
    'Learn the names of body parts, understand how the body grows, and explore what bodies can do.',
    '[
      {"type":"heading","level":1,"text":"My Body"},
      {"type":"text","content":"Your body is an amazing living machine. It lets you run, jump, think, feel, breathe, and grow. Every part of your body has a special job. When all the parts work together, you can do incredible things."},
      {"type":"callout","style":"info","title":"Your Body Is Unique","content":"No two bodies are exactly the same. Bodies come in all shapes, sizes, and abilities. Every body is worthy of care and respect."},
      {"type":"text","content":"Your skeleton is made of bones that give your body its shape and protect important organs inside. Your muscles work with your bones so you can move. Your heart pumps blood all around your body. Your lungs bring in the air your body needs. Your brain is the control centre that thinks, remembers, and tells the rest of your body what to do."},
      {"type":"list","style":"unordered","items":["Bones: give your body shape and protect organs","Muscles: help you move","Heart: pumps blood through your body","Lungs: bring in air you need to breathe","Brain: controls everything your body does"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"Traditional Indigenous teachings recognise that our physical body is one of four parts of our whole self, alongside our mind, emotions, and spirit. Caring for your body through movement, rest, and nourishing food honours all four parts of the Medicine Wheel."},
      {"type":"text","content":"Bodies grow and change over time. As a baby you could not walk or talk, but now you can. You will keep growing and changing as you get older. Growth happens gradually, and every person grows at their own pace. It is important to be patient with your body and celebrate what it can do right now."},
      {"type":"quiz","question":"What does your heart do?","options":["Helps you breathe in air","Pumps blood through your body","Controls your thoughts","Moves your arms and legs"],"correctIndex":1,"explanation":"Your heart is a muscle that pumps blood throughout your entire body, delivering oxygen and nutrients to every cell."}
    ]'::jsonb,
    '[
      {"term":"Skeleton","definition":"The framework of bones inside your body that gives it shape and protects your organs."},
      {"term":"Muscle","definition":"Body tissue that contracts and relaxes to create movement."},
      {"term":"Heart","definition":"A muscular organ that pumps blood through the body."},
      {"term":"Lungs","definition":"Two organs in your chest that take in oxygen and release carbon dioxide when you breathe."},
      {"term":"Brain","definition":"The organ inside your skull that controls all your body functions, thoughts, and feelings."},
      {"term":"Growth","definition":"The gradual process of your body becoming bigger and developing new abilities over time."}
    ]'::jsonb,
    'Cree teachings describe the human body as a sacred gift. Stories passed down through generations remind young people to treat their bodies with respect, to stay active through traditional games and movement, and to understand that physical health is connected to emotional, mental, and spiritual wellbeing.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does your brain do?', 'It controls all your body functions, thoughts, and feelings.', 'The command centre.', 1, 0),
    (v_tenant, v_ch, 'What are bones part of?', 'The skeleton, which gives your body its shape and protects your organs.', 'The framework inside you.', 1, 1),
    (v_tenant, v_ch, 'Do all bodies grow at the same speed?', 'No, every person grows at their own pace.', 'Everyone is different.', 1, 2);

  -- -----------------------------------------------------------------------
  -- Chapter 2: Hygiene & Nutrition
  -- -----------------------------------------------------------------------
  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Hygiene & Nutrition', 'health-1-hygiene-nutrition',
    'Practise daily hygiene habits and explore how a variety of nutritious foods support growth.',
    '[
      {"type":"heading","level":1,"text":"Hygiene & Nutrition"},
      {"type":"text","content":"Taking care of your body each day is called hygiene. Good hygiene habits keep you healthy, help you feel good, and are respectful to the people around you. The most powerful hygiene habit of all is washing your hands with soap and water."},
      {"type":"callout","style":"info","title":"Why Wash Your Hands?","content":"Your hands touch hundreds of surfaces every day. Germs, tiny living things too small to see, can travel from surfaces to your hands and then into your body when you touch your face. Washing your hands with soap for at least 20 seconds removes most germs and helps prevent illness."},
      {"type":"text","content":"Other important daily hygiene habits include brushing your teeth twice a day to prevent cavities, bathing or showering regularly to clean your skin, and changing into clean clothes. These habits help your body stay healthy and comfortable."},
      {"type":"list","style":"unordered","items":["Wash hands before eating and after using the washroom","Brush teeth morning and night","Bathe or shower regularly","Change into clean clothes","Cover your mouth when you cough or sneeze"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"Many Indigenous traditions include cleansing practices that honour both the body and the spirit. Smudging with sacred plants like sage and sweetgrass, bathing in natural waters, and sweat lodge ceremonies are examples of holistic practices that care for the whole self, recognising that physical cleanliness and spiritual wellbeing are connected."},
      {"type":"text","content":"Just as hygiene keeps the outside of your body clean, good nutrition keeps the inside of your body healthy. Your body needs a mix of foods every day. Eating colourful fruits and vegetables gives you vitamins. Whole-grain foods give you steady energy. Protein foods help you grow. Dairy or fortified plant beverages help build strong bones. Drinking water all day long keeps every system in your body working."},
      {"type":"quiz","question":"How long should you wash your hands with soap to remove most germs?","options":["3 seconds","20 seconds","2 minutes","5 minutes"],"correctIndex":1,"explanation":"Scrubbing your hands with soap for at least 20 seconds is enough time to loosen and remove most harmful germs. Singing the alphabet song twice is about 20 seconds!"}
    ]'::jsonb,
    '[
      {"term":"Hygiene","definition":"Practices that keep your body clean and healthy, such as washing hands and brushing teeth."},
      {"term":"Germ","definition":"A tiny living thing, like bacteria or a virus, that can cause illness if it enters your body."},
      {"term":"Nutrition","definition":"Getting the right mix of foods your body needs to grow and stay healthy."},
      {"term":"Cavity","definition":"A small hole in a tooth caused by acid from bacteria that eat leftover food in your mouth."},
      {"term":"Vitamin","definition":"A natural chemical in food that your body needs in small amounts to function properly."}
    ]'::jsonb,
    'Traditional Metis and First Nations communities in Saskatchewan maintained cleanliness through practices suited to their environment, including bathing in rivers and lakes, using plant-based cleansing agents, and regular ceremonies that promoted physical and spiritual purification. These traditions reflect a deep understanding that cleanliness and wellness are inseparable.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Name two daily hygiene habits.', 'Washing hands, brushing teeth, bathing, changing clothes (any two).', 'What do you do each day to stay clean?', 1, 0),
    (v_tenant, v_ch, 'What do vitamins in food do for your body?', 'They help your body function properly and stay healthy.', 'Found in fruits and vegetables.', 1, 1),
    (v_tenant, v_ch, 'When should you always wash your hands?', 'Before eating and after using the washroom.', 'Two key moments every day.', 1, 2);

  -- -----------------------------------------------------------------------
  -- Chapter 3: Emotions & Feelings
  -- -----------------------------------------------------------------------
  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Emotions & Feelings', 'health-1-emotions-feelings',
    'Name and describe a range of emotions, explore why we feel them, and practise healthy ways to express them.',
    '[
      {"type":"heading","level":1,"text":"Emotions & Feelings"},
      {"type":"text","content":"Emotions are messages from inside your body and mind. They tell you something important about what is happening around you and how you feel about it. Learning to name your emotions is the first step to managing them well."},
      {"type":"callout","style":"info","title":"Naming Your Emotions","content":"Scientists have found that when you can name how you feel, the big, overwhelming part of the emotion becomes smaller. Saying I feel frustrated or I feel nervous gives you a way to understand and work with your feelings."},
      {"type":"text","content":"There are many emotions. Joy is the bubbly, light feeling you get when something wonderful happens. Frustration is the tight feeling when something is not going the way you want. Nervousness is the fluttery feeling before something new or uncertain. Loneliness is the ache you feel when you want connection with others. Compassion is the warm feeling you get when you want to help someone who is hurting."},
      {"type":"list","style":"unordered","items":["Joy: light and bubbly, something wonderful happened","Frustration: tight feeling, things are not going your way","Nervousness: fluttery feeling, something new or uncertain is coming","Loneliness: aching feeling, wanting connection","Compassion: warm feeling, wanting to help someone who is hurting"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"The emotional dimension of the Medicine Wheel teaches that feelings need to be acknowledged and expressed in healthy ways. Traditional stories, songs, and time with Elders help young people understand their inner world. Emotions are seen as sacred information, not problems to be hidden."},
      {"type":"text","content":"All emotions are okay to feel. What matters is how you express them. It is okay to cry when you are sad. It is okay to say, I feel angry, but it is not okay to hurt someone because you feel angry. You can draw your feelings, write about them, talk to someone you trust, or use your body to let them move through you by walking, dancing, or playing outside."},
      {"type":"quiz","question":"What is a healthy way to express the feeling of frustration?","options":["Throw something across the room","Hit the person nearest to you","Take deep breaths and say how you feel using words","Pretend you do not feel anything"],"correctIndex":2,"explanation":"Using words to express how you feel is a healthy and effective way to manage frustration. Deep breathing first helps calm your body so you can think clearly."}
    ]'::jsonb,
    '[
      {"term":"Emotion","definition":"A strong feeling, such as joy, fear, or frustration, that is a response to what is happening around or inside you."},
      {"term":"Joy","definition":"A feeling of great happiness or delight."},
      {"term":"Frustration","definition":"A feeling of being upset or annoyed because something is not going the way you want."},
      {"term":"Compassion","definition":"A warm feeling of caring about someone who is struggling and wanting to help them."},
      {"term":"Express","definition":"To share or show your feelings in a way others can understand."}
    ]'::jsonb,
    'Across Saskatchewan Indigenous cultures, emotions are understood as part of the whole self. Drumming, singing, and ceremonial dances have long served as ways to process and express deep emotions within community. Young people are taught that showing vulnerability and seeking support are acts of courage, not weakness.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Why is it helpful to name your emotions?', 'Naming emotions makes them feel smaller and easier to manage.', 'Words give power to understanding.', 1, 0),
    (v_tenant, v_ch, 'Name a healthy way to express a big feeling.', 'Talk to someone, draw, write, cry, move your body, deep breathe (any valid answer).', 'What helps you feel better?', 1, 1),
    (v_tenant, v_ch, 'Is it okay to feel sad?', 'Yes, all emotions are okay to feel. What matters is expressing them safely.', 'Feelings are messages, not problems.', 1, 2);

  -- -----------------------------------------------------------------------
  -- Chapter 4: Personal Space & Boundaries
  -- -----------------------------------------------------------------------
  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Personal Space & Boundaries', 'health-1-personal-space-boundaries',
    'Understand personal space, learn to set and respect body boundaries, and practise consent.',
    '[
      {"type":"heading","level":1,"text":"Personal Space & Boundaries"},
      {"type":"text","content":"Everyone has an invisible bubble of space around their body called personal space. When someone stands too close or touches you without asking, it can feel uncomfortable. Respecting personal space means staying out of someone else''s bubble unless they invite you in."},
      {"type":"callout","style":"info","title":"What Is Personal Space?","content":"Personal space is the area around your body that feels comfortable and safe. Different people like different amounts of space. Respecting someone''s personal space shows that you care about how they feel."},
      {"type":"text","content":"Your body belongs to you and only you. A body boundary is a rule about how others may touch your body. Some touches feel safe and good, like a hug from a parent you love or a high five from a friend. Some touches feel unsafe or uncomfortable. You always have the right to say no to any touch that feels wrong, even from someone you know."},
      {"type":"list","style":"unordered","items":["Safe touches: hugs from family you love, high fives, handshakes","Unsafe touches: any touch that hurts, scares, or makes you feel uncomfortable","You can always say no to unsafe touches","If something feels wrong, tell a trusted adult right away"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"Indigenous teachings honour the sacred nature of each person''s body. Teachings about respect and consent have always been part of how communities raise children to understand boundaries. Elders teach that treating another person''s body with respect is a form of honouring the Creator''s gift of life."},
      {"type":"text","content":"Asking before touching shows respect. Before hugging someone, you can ask, Can I give you a hug? If they say yes, great! If they say no, that is okay too. Everyone gets to decide who touches their body. If someone asks to touch you and you do not want it, you can simply say, No thank you. You do not need a reason."},
      {"type":"quiz","question":"What should you do if someone touches you in a way that feels wrong?","options":["Keep it a secret","Say no and then tell a trusted adult","Just ignore it and walk away","Think it is your fault"],"correctIndex":1,"explanation":"You always have the right to say no to uncomfortable touches, and you should always tell a trusted adult. It is never your fault, and you will not get in trouble for telling."}
    ]'::jsonb,
    '[
      {"term":"Personal Space","definition":"The invisible area around your body where you feel comfortable and safe."},
      {"term":"Boundary","definition":"A personal rule about what is okay and not okay regarding your body or feelings."},
      {"term":"Consent","definition":"Freely agreeing to something because you want to, not because you feel pressured."},
      {"term":"Safe Touch","definition":"A touch that feels comfortable, respectful, and wanted, like a hug from someone you love."},
      {"term":"Unsafe Touch","definition":"A touch that hurts, scares, or makes you feel uncomfortable in any way."}
    ]'::jsonb,
    'Many First Nations communities teach the concept of self-determination from an early age, which includes the right to decide what happens to your own body. Traditional parenting practices in many Saskatchewan cultures emphasise teaching children that their bodies are sacred and that they have the authority to protect them.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is personal space?', 'The invisible area around your body where you feel comfortable and safe.', 'Imagine a bubble around you.', 1, 0),
    (v_tenant, v_ch, 'What should you do before touching or hugging someone?', 'Ask for their permission first.', 'Always check before you touch.', 1, 1),
    (v_tenant, v_ch, 'Whose body boundaries are the most important?', 'Every person''s boundaries are equally important, including your own.', 'Respect goes both ways.', 1, 2);

END;
$$;


-- ============================================================================
-- TEXTBOOK 3: WolfWhale Health 2
-- Slug: wolfwhale-health-2
-- Chapters: Growing & Changing, Food Groups & Active Living,
--           Managing Emotions, Friendships & Community Safety
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-health-2';

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Growing, Feeling, and Belonging',
    'Grade 2 students explore physical growth, balanced nutrition, emotional regulation, and community safety.',
    'Healthy choices and positive connections help us grow and thrive in our communities.',
    'How do healthy habits and caring relationships help me grow?')
  RETURNING id INTO v_unit;

  -- -----------------------------------------------------------------------
  -- Chapter 1: Growing & Changing
  -- -----------------------------------------------------------------------
  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Growing & Changing', 'health-2-growing-changing',
    'Explore how bodies grow over a lifetime, celebrate diversity in development, and understand the basics of life cycles.',
    '[
      {"type":"heading","level":1,"text":"Growing & Changing"},
      {"type":"text","content":"From the moment you were born, your body has been growing and changing. You started as a tiny baby who needed help with everything. Now you can read, run, make friends, and solve problems. The changes in your body and abilities are part of a natural process called development."},
      {"type":"callout","style":"info","title":"What Is Development?","content":"Development is the process of growing physically, intellectually, and emotionally over your lifetime. Everyone develops at their own unique pace, and that is completely normal."},
      {"type":"text","content":"Physical growth means your body gets bigger and stronger. You grow taller as new bone tissue is added. Your muscles become more powerful as you use them. Your brain continues to develop new connections every time you learn something new. Growth is not always visible. You might notice your clothes get tight, or that things you found difficult last year are now easy."},
      {"type":"list","style":"unordered","items":["Body grows taller and heavier","Muscles become stronger with use","Brain builds new connections through learning","Coordination improves through practice","Teeth change from baby teeth to adult teeth"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"In Cree and Anishinaabe teachings, the seasons of a person''s life, like the seasons of the year, each carry their own gifts and lessons. Childhood is the spring, a time of curiosity, growth, and learning. Elders teach that each stage of life deserves to be celebrated and lived fully."},
      {"type":"text","content":"All living things grow and change. Plants start as seeds and grow into tall trees. Butterflies begin as eggs, become caterpillars, then transform completely. Humans grow and change too, but our journey is much longer. The changes you experience as you grow are natural and something to look forward to, not be afraid of."},
      {"type":"quiz","question":"Which of the following is an example of development?","options":["A rock getting wet in the rain","A child learning to ride a bicycle","A rock breaking into pieces","A shadow moving across the floor"],"correctIndex":1,"explanation":"Learning a new skill like riding a bicycle is development because it involves your brain and body growing in new ways through practice and experience."}
    ]'::jsonb,
    '[
      {"term":"Development","definition":"The process of growing physically, intellectually, and emotionally over your lifetime."},
      {"term":"Growth","definition":"An increase in the size, strength, or capability of your body or mind."},
      {"term":"Life Cycle","definition":"The series of stages a living thing goes through from birth to death."},
      {"term":"Coordination","definition":"The ability to move different parts of your body together smoothly and effectively."},
      {"term":"Milestone","definition":"An important achievement or stage in development, such as taking a first step or losing a first tooth."}
    ]'::jsonb,
    'For generations, Saskatchewan Indigenous communities have marked important stages of a child''s growth with ceremonies and celebrations. The naming ceremony, the first steps celebration, and the coming-of-age ceremonies all honour the natural unfolding of a young person''s life. These traditions affirm that every stage of growth is sacred.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is development?', 'The process of growing physically, intellectually, and emotionally over time.', 'More than just getting taller.', 1, 0),
    (v_tenant, v_ch, 'Do all children grow at exactly the same pace?', 'No, everyone develops at their own unique pace.', 'Everyone is different.', 1, 1),
    (v_tenant, v_ch, 'Name one way your brain grows.', 'By building new connections every time you learn something new.', 'Learning changes your brain.', 1, 2);

  -- -----------------------------------------------------------------------
  -- Chapter 2: Food Groups & Active Living
  -- -----------------------------------------------------------------------
  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Food Groups & Active Living', 'health-2-food-groups-active-living',
    'Identify major food groups, explore why physical activity is essential, and set simple wellness goals.',
    '[
      {"type":"heading","level":1,"text":"Food Groups & Active Living"},
      {"type":"text","content":"Your body is like a high-performance machine. It needs the right fuel and regular movement to work at its best. Eating from a variety of food groups and being active every day are two of the most powerful things you can do for your health."},
      {"type":"callout","style":"info","title":"Why Do Food Groups Matter?","content":"Different foods contain different nutrients. By eating a variety of foods from several groups, you make sure your body gets everything it needs, including carbohydrates for energy, protein for building, fats for brain health, and vitamins and minerals for all the tiny processes that keep you alive and well."},
      {"type":"text","content":"Vegetables and fruits provide fibre, which keeps your digestive system moving, plus vitamins and antioxidants that protect your cells. Protein foods like chicken, fish, eggs, lentils, and tofu build and repair your muscles and organs. Whole grain foods like oats, brown rice, and whole-wheat bread give you steady, long-lasting energy. Dairy and fortified plant beverages provide calcium and vitamin D for strong bones and teeth."},
      {"type":"list","style":"unordered","items":["Vegetables and fruits: vitamins, minerals, fibre","Protein foods: meat, fish, eggs, beans, tofu","Whole grains: bread, rice, oats, pasta","Dairy and alternatives: milk, yogurt, fortified plant beverages","Water: the most important thing to drink every day"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"Traditional Indigenous diets from the prairies, woodlands, and parklands of Saskatchewan were naturally balanced across food groups. Bison provided protein and essential fats. Berries and roots offered vitamins and carbohydrates. Fish supplied omega-3 fatty acids. This balance of land foods reflects a deep understanding of what bodies need to thrive."},
      {"type":"text","content":"Physical activity is just as important as food. When you move your body, your heart gets stronger, your muscles grow, your brain releases chemicals that improve your mood, and your sleep improves. Children your age need at least 60 minutes of active play every day. This can include running at recess, riding a bike, swimming, dancing, or playing sports. Even short bursts of activity count!"},
      {"type":"quiz","question":"Which food group provides the best source of long-lasting energy?","options":["Candy and sugary drinks","Whole grain foods","Fried snack foods","Sports energy drinks"],"correctIndex":1,"explanation":"Whole grain foods are digested slowly, releasing energy steadily over time. This helps you stay focused and energetic for longer than sugary foods, which cause a quick spike and then a crash."}
    ]'::jsonb,
    '[
      {"term":"Nutrient","definition":"A substance in food that your body uses for energy, growth, or to keep systems working properly."},
      {"term":"Carbohydrate","definition":"A nutrient found in grains, fruits, and vegetables that is your body''s main source of energy."},
      {"term":"Protein","definition":"A nutrient in meat, fish, eggs, and legumes that builds and repairs muscles and organs."},
      {"term":"Calcium","definition":"A mineral found in dairy and some plant foods that builds strong bones and teeth."},
      {"term":"Physical Activity","definition":"Any movement that gets your body working, from walking to swimming to playing sports."},
      {"term":"Fibre","definition":"A type of carbohydrate found in plant foods that keeps your digestive system healthy."}
    ]'::jsonb,
    'Physical activity has always been central to Indigenous wellbeing in Saskatchewan. Traditional games such as lacrosse, hand games, and relay races were not only fun but built strength, strategy, and community bonds. Many schools in Saskatchewan are now incorporating Indigenous games into physical education to honour this heritage.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Name two food groups and what they provide.', 'Vegetables/fruits (vitamins, fibre), protein foods (muscles), grains (energy), dairy (calcium) - any two.', 'Think about what each food does.', 1, 0),
    (v_tenant, v_ch, 'How many minutes of physical activity do children need each day?', 'At least 60 minutes of active play.', 'About one hour.', 1, 1),
    (v_tenant, v_ch, 'What does physical activity do for your brain?', 'It releases chemicals that improve mood and supports better sleep and focus.', 'Movement helps your mind too.', 1, 2);

  -- -----------------------------------------------------------------------
  -- Chapter 3: Managing Emotions
  -- -----------------------------------------------------------------------
  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Managing Emotions', 'health-2-managing-emotions',
    'Build a toolkit of strategies for identifying triggers, calming big feelings, and recovering from emotional upsets.',
    '[
      {"type":"heading","level":1,"text":"Managing Emotions"},
      {"type":"text","content":"Everyone has moments when emotions feel very big, almost too big to handle. That moment when your face gets hot, your thoughts race, and you want to react right now is completely normal. The good news is that you can learn to notice those moments and choose what to do next."},
      {"type":"callout","style":"info","title":"What Is Emotional Regulation?","content":"Emotional regulation means being able to notice your feelings, understand what caused them, and choose how to respond in a way that is healthy for you and the people around you. It is a skill that takes practice, and everyone is still learning it, even grown-ups."},
      {"type":"text","content":"A trigger is something that causes a big emotional reaction. Common triggers include feeling left out, being told no, making a mistake, or feeling like something is unfair. Knowing your triggers can help you prepare. If you know that losing at games is hard for you, you can plan ahead by reminding yourself that losing is part of playing, and that everyone loses sometimes."},
      {"type":"list","style":"unordered","items":["Notice: What am I feeling right now?","Name: I feel angry, sad, scared, overwhelmed...","Pause: Take 3 deep breaths before reacting","Plan: What can I do that will help, not hurt?","Act: Choose a healthy response"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"In the Medicine Wheel framework, the emotional dimension asks us to stay in balance. When emotions tip us off balance, traditional practices like sitting with an Elder, being in nature, or joining in prayer and song help restore equilibrium. These practices teach that managing emotions is a lifelong, community-supported journey."},
      {"type":"text","content":"Your calm-down toolkit might include slow breathing, counting to ten, squeezing a stress ball, going for a walk, drawing your feelings, listening to music, or asking someone you trust for a hug. Not every tool works for every person or every situation. Try different things to find what works best for you."},
      {"type":"quiz","question":"What is a trigger?","options":["A type of gun","Something that causes a big emotional reaction","A button on a game controller","A type of food that makes you feel sick"],"correctIndex":1,"explanation":"In emotional health, a trigger is an event or situation that sets off a strong emotional response. Identifying your triggers helps you prepare for and manage your reactions."}
    ]'::jsonb,
    '[
      {"term":"Emotional Regulation","definition":"The ability to notice, understand, and manage your feelings in healthy ways."},
      {"term":"Trigger","definition":"A situation or event that causes a strong emotional reaction."},
      {"term":"Calm-Down Strategy","definition":"A tool or action that helps your body and mind return to a comfortable, settled state."},
      {"term":"Self-Awareness","definition":"The ability to notice and understand your own feelings, thoughts, and behaviours."},
      {"term":"Pause","definition":"A deliberate moment of stopping before reacting, giving yourself time to choose your response."}
    ]'::jsonb,
    'Traditional Indigenous child-rearing practices in Saskatchewan cultures often involved teaching children to observe before acting. Spending time in nature, listening to Elders, and participating in ceremony all cultivate patience, self-awareness, and emotional balance. These are lifelong gifts that strengthen the emotional dimension of the Medicine Wheel.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is emotional regulation?', 'The ability to notice, understand, and manage feelings in healthy ways.', 'A skill everyone is learning.', 1, 0),
    (v_tenant, v_ch, 'What is a trigger?', 'Something that causes a strong emotional reaction.', 'It sets off a big feeling.', 1, 1),
    (v_tenant, v_ch, 'Name two calm-down strategies.', 'Deep breathing, counting to ten, walking, drawing, listening to music (any two).', 'What helps you settle?', 1, 2);

  -- -----------------------------------------------------------------------
  -- Chapter 4: Friendships & Community Safety
  -- -----------------------------------------------------------------------
  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Friendships & Community Safety', 'health-2-friendships-community-safety',
    'Strengthen friendship skills, understand community helpers, and practise safety in different environments.',
    '[
      {"type":"heading","level":1,"text":"Friendships & Community Safety"},
      {"type":"text","content":"You are part of many communities: your family, your class, your school, your neighbourhood, and your town or city. Each community is made up of people who look out for each other. Learning how to be a good community member and how to stay safe in different places helps everyone thrive."},
      {"type":"callout","style":"info","title":"What Is a Community?","content":"A community is a group of people who live in the same area or share common interests and look out for one another. Communities are healthiest when members feel welcome, respected, and safe."},
      {"type":"text","content":"Friendships are one of the most important connections within any community. Strong friendships are built on honesty, loyalty, and mutual respect. A good friend tells the truth even when it is hard, keeps your secrets safe, includes you even when others do not, and celebrates your successes as if they were their own."},
      {"type":"list","style":"unordered","items":["Honesty: telling the truth even when it is difficult","Loyalty: standing by your friend when things get tough","Inclusion: making room for everyone","Celebration: being happy about a friend''s success","Support: being there when a friend is struggling"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"The circle in the Medicine Wheel represents community. No one stands alone in the circle. Traditional teachings about community responsibility remind us that we are all part of something larger than ourselves. Caring for our community, including the land and all living things, is part of healthy living."},
      {"type":"text","content":"Community safety means knowing who the helpers are and what to do in different situations. Police officers, firefighters, paramedics, school helpers, and neighbours all play a role in keeping communities safe. If you are ever lost, hurt, or scared in public, find a community helper or another trusted adult, like a parent with children, and ask for help."},
      {"type":"quiz","question":"Which of the following is an example of being a good friend?","options":["Sharing a secret your friend told you in private","Leaving a friend out of a game because others told you to","Helping your friend when they fall down and hurt themselves","Laughing at your friend when they make a mistake"],"correctIndex":2,"explanation":"Helping a friend who is hurt shows loyalty, compassion, and care, all key qualities of a good friendship."}
    ]'::jsonb,
    '[
      {"term":"Community","definition":"A group of people who live in the same area or share common interests and look out for one another."},
      {"term":"Honesty","definition":"Telling the truth and being real with others, even when it is difficult."},
      {"term":"Loyalty","definition":"Being faithful and supportive to a friend or community, especially during hard times."},
      {"term":"Inclusion","definition":"Making sure everyone feels welcome and has a place to belong."},
      {"term":"Community Helper","definition":"A person in the community whose job is to keep people safe and well, such as a firefighter, police officer, or paramedic."}
    ]'::jsonb,
    'Many Indigenous communities in Saskatchewan operate on principles of collective responsibility. Cree concepts like wahkotowin, which describes the sacred law of kinship and relationships, emphasise that individual health cannot be separated from the health of the community. Looking after one another is not just kind, it is a sacred obligation.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a community?', 'A group of people who share an area or interests and look out for one another.', 'You belong to several communities.', 1, 0),
    (v_tenant, v_ch, 'Name two qualities of a good friend.', 'Honesty, loyalty, inclusion, support, celebration (any two).', 'How do good friends treat each other?', 1, 1),
    (v_tenant, v_ch, 'Who can you go to for help if you are lost in public?', 'A community helper (police, firefighter) or a trusted adult like a parent with children.', 'Look for helpers in uniforms.', 1, 2);

END;
$$;


-- ============================================================================
-- TEXTBOOK 4: WolfWhale Health 3
-- Slug: wolfwhale-health-3
-- Chapters: Body Systems Basics, Healthy Choices, Conflict Resolution,
--           Family Diversity & Safety
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-health-3';

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Body, Mind, and Community',
    'Grade 3 students explore how body systems work, make healthy choices, resolve conflicts, and celebrate family diversity.',
    'Understanding our bodies and building positive relationships creates the foundation for lifelong wellness.',
    'How do healthy habits and respectful relationships help my body and community flourish?')
  RETURNING id INTO v_unit;

  -- -----------------------------------------------------------------------
  -- Chapter 1: Body Systems Basics
  -- -----------------------------------------------------------------------
  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Body Systems Basics', 'health-3-body-systems-basics',
    'Explore the major body systems and understand how they work together to keep you healthy.',
    '[
      {"type":"heading","level":1,"text":"Body Systems Basics"},
      {"type":"text","content":"Your body is made up of trillions of tiny cells, and cells that do similar jobs group together to form tissues. Tissues group together to form organs. Organs that work together make up a body system. Your body has many systems, and they all work together to keep you alive and healthy."},
      {"type":"callout","style":"info","title":"What Is a Body System?","content":"A body system is a group of organs that work together to perform a specific function for the body. For example, the digestive system breaks down food, and the respiratory system manages breathing."},
      {"type":"text","content":"The digestive system breaks down the food you eat into nutrients your body can absorb. It starts in your mouth, where chewing and saliva begin breaking food apart, continues through your stomach where acids further break it down, and finishes in your intestines where nutrients are absorbed into your blood. The circulatory system, made up of your heart, blood vessels, and blood, delivers those nutrients and oxygen to every cell in your body."},
      {"type":"list","style":"unordered","items":["Digestive system: breaks food into nutrients","Circulatory system: moves blood, oxygen, and nutrients","Respiratory system: brings in oxygen, removes carbon dioxide","Muscular system: moves bones and organs","Skeletal system: provides structure and protects organs","Nervous system: sends messages throughout the body"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"Traditional Indigenous healers have long understood that the body works as a connected whole. Illness in one part affects the entire system. Healing practices, including herbal remedies, ceremony, and rest, address the whole person rather than just one symptom. This holistic view of the body aligns remarkably well with modern systems-based medicine."},
      {"type":"text","content":"Your nervous system is like a communication superhighway. Your brain is the command centre, and nerves extend from it throughout your body like cables. When you touch something hot, your nerves instantly send a message to your brain, which sends a message back to your muscles to pull your hand away. This happens so fast you move before you even think about it."},
      {"type":"quiz","question":"Which body system is responsible for delivering oxygen and nutrients to all cells in the body?","options":["Digestive system","Respiratory system","Circulatory system","Nervous system"],"correctIndex":2,"explanation":"The circulatory system, made up of the heart, blood, and blood vessels, pumps blood throughout the body, delivering oxygen from the lungs and nutrients from digestion to every cell."}
    ]'::jsonb,
    '[
      {"term":"Body System","definition":"A group of organs that work together to carry out a specific function."},
      {"term":"Digestive System","definition":"The system that breaks food into nutrients the body can absorb and use."},
      {"term":"Circulatory System","definition":"The system made up of the heart, blood, and blood vessels that moves nutrients and oxygen throughout the body."},
      {"term":"Respiratory System","definition":"The system that brings oxygen into the body and removes carbon dioxide, centred on the lungs."},
      {"term":"Nervous System","definition":"The system of the brain, spinal cord, and nerves that sends messages throughout the body."},
      {"term":"Organ","definition":"A body part made of different tissues that works together to carry out a specific job."}
    ]'::jsonb,
    'Indigenous healers and knowledge keepers in Saskatchewan have maintained sophisticated understandings of the human body for generations. Plant medicines were used to support digestion, circulation, and the immune system. This knowledge, often passed from healer to apprentice over many years, reflects a nuanced, system-based understanding of health that is increasingly recognised by modern medicine.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a body system?', 'A group of organs working together to perform a specific function.', 'Like a team of organs.', 2, 0),
    (v_tenant, v_ch, 'What does the circulatory system do?', 'Moves blood, oxygen, and nutrients to every cell in the body.', 'Think of roads carrying supplies.', 2, 1),
    (v_tenant, v_ch, 'What body system sends messages through your body?', 'The nervous system (brain, spinal cord, and nerves).', 'The communication superhighway.', 2, 2);

  -- -----------------------------------------------------------------------
  -- Chapter 2: Healthy Choices
  -- -----------------------------------------------------------------------
  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Healthy Choices', 'health-3-healthy-choices',
    'Understand what makes a healthy choice, explore sleep and screen time, and set personal health goals.',
    '[
      {"type":"heading","level":1,"text":"Healthy Choices"},
      {"type":"text","content":"Every day you make dozens of choices that affect your health. Some choices have a big impact, like what you eat or how much you sleep. Other choices have a smaller impact. The good news is that healthy choices get easier with practice, and even small changes can add up to make a big difference."},
      {"type":"callout","style":"info","title":"What Makes a Choice Healthy?","content":"A healthy choice is one that supports your physical, mental, or emotional wellbeing without causing harm to yourself or others. Healthy choices often involve balance: not too much of anything and enough of what your body truly needs."},
      {"type":"text","content":"Sleep is one of the most important healthy choices you can make. While you sleep, your brain organises new information, your body repairs tissues, and your immune system gets stronger. Children in Grade 3 need about 9 to 11 hours of sleep each night. Going to bed and waking up at the same time every day helps your body establish a natural sleep rhythm."},
      {"type":"list","style":"unordered","items":["Sleep 9 to 11 hours each night","Eat a variety of foods from all food groups","Be physically active for at least 60 minutes daily","Drink water as your main beverage","Limit screen time to no more than 2 hours of recreational screen use per day","Spend time outdoors every day when possible"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"The Medicine Wheel teaches balance in all four dimensions of health. Just as we need rest and activity, we also need time for learning and time for play, time alone and time with community. Choices that honour all four dimensions of the Medicine Wheel create true wellness."},
      {"type":"text","content":"Screen time is a newer challenge for healthy living. Screens, including phones, tablets, and televisions, can be wonderful tools for learning and connection. However, too much passive screen time can interfere with sleep, physical activity, and face-to-face relationships. Being intentional about how you use screens, choosing active, creative, or educational content, helps you get the benefits without the downsides."},
      {"type":"quiz","question":"How many hours of sleep do children in Grade 3 need each night?","options":["5 to 6 hours","7 to 8 hours","9 to 11 hours","12 to 14 hours"],"correctIndex":2,"explanation":"Children aged 6 to 12 generally need 9 to 11 hours of sleep each night for their brains and bodies to grow, repair, and function at their best."}
    ]'::jsonb,
    '[
      {"term":"Healthy Choice","definition":"A decision that supports your physical, mental, or emotional wellbeing without causing harm."},
      {"term":"Sleep","definition":"A natural period of rest during which the brain consolidates memories and the body repairs and restores itself."},
      {"term":"Balance","definition":"Having the right amount of different things so that no single area of health is neglected."},
      {"term":"Screen Time","definition":"The amount of time spent looking at digital screens such as phones, tablets, computers, and televisions."},
      {"term":"Immune System","definition":"The body''s natural defence system that fights off illness-causing germs."}
    ]'::jsonb,
    'Saskatchewan Indigenous communities have always understood the importance of rhythm and balance in daily living. Traditional life followed the seasons, with patterns of activity, rest, ceremony, and community gathering built into the year. These rhythms ensured that physical, mental, emotional, and spiritual needs were all attended to across the cycle of the year.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'How many hours of sleep do Grade 3 students need?', '9 to 11 hours each night.', 'More than most adults.', 2, 0),
    (v_tenant, v_ch, 'What happens to your brain while you sleep?', 'It organises new information and consolidates memories.', 'Sleep is not wasted time.', 2, 1),
    (v_tenant, v_ch, 'What is the recommended limit for recreational screen time per day?', 'No more than 2 hours.', 'Outside that, screens should be purposeful.', 2, 2);

  -- -----------------------------------------------------------------------
  -- Chapter 3: Conflict Resolution
  -- -----------------------------------------------------------------------
  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Conflict Resolution', 'health-3-conflict-resolution',
    'Understand that conflict is normal, and practise step-by-step strategies for peaceful problem solving.',
    '[
      {"type":"heading","level":1,"text":"Conflict Resolution"},
      {"type":"text","content":"Conflict is a normal part of life. Whenever two or more people have different needs, wants, or opinions, conflict can arise. Having a conflict with someone does not mean the relationship is broken. It means two people need to find a way to understand each other and work things out."},
      {"type":"callout","style":"info","title":"What Is Conflict Resolution?","content":"Conflict resolution is the process of finding a peaceful, fair solution when two or more people disagree. Good conflict resolution involves listening, using calm voices, understanding the other person''s perspective, and working toward a solution where both people feel heard."},
      {"type":"text","content":"When you feel a conflict rising, the first step is to pause and breathe. Reacting while you are still very upset usually makes things worse. Once you feel calmer, use an I statement to explain your feelings without blaming the other person. Instead of saying You always take my things without asking, try saying I feel frustrated when my things are used without my permission."},
      {"type":"list","style":"unordered","items":["Step 1: Pause and take a breath","Step 2: Say how you feel using I statements","Step 3: Listen to the other person''s side","Step 4: Look for a solution that works for both of you","Step 5: Agree and follow through"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"Many Indigenous governance traditions used talking circles to resolve conflicts within communities. In a talking circle, each person speaks in turn while others listen without interrupting. A sacred object, such as a feather or a talking stick, is held by the person who is speaking to show that their voice is respected. This practice ensures that every person feels heard and valued."},
      {"type":"text","content":"Sometimes you cannot resolve a conflict on your own, and that is okay. Asking a teacher, parent, or other trusted adult to help mediate is not giving up; it is a smart and mature choice. A mediator is a neutral person who helps both sides communicate and find a fair solution without taking sides."},
      {"type":"quiz","question":"What is an I statement?","options":["A statement that starts with the word I and blames someone else","A statement that describes your own feelings without accusing the other person","A list of instructions you give to someone in a conflict","A statement that avoids talking about the problem"],"correctIndex":1,"explanation":"An I statement, such as I feel hurt when my work is criticised in front of others, expresses your feelings from your own perspective without attacking or blaming the other person. This makes the other person less defensive and more open to solving the problem together."}
    ]'::jsonb,
    '[
      {"term":"Conflict","definition":"A disagreement or clash between two or more people with different needs, wants, or opinions."},
      {"term":"Conflict Resolution","definition":"The process of finding a peaceful, fair solution to a disagreement."},
      {"term":"I Statement","definition":"A way of expressing your feelings that starts with I feel... instead of You always..."},
      {"term":"Mediator","definition":"A neutral person who helps two sides in a conflict communicate and find a solution."},
      {"term":"Perspective","definition":"A person''s point of view, shaped by their unique experiences and feelings."},
      {"term":"Empathy","definition":"The ability to understand and share the feelings of another person."}
    ]'::jsonb,
    'The talking circle, a practice used by many First Nations across Saskatchewan, is one of the most effective conflict resolution tools ever developed. Rooted in the belief that every voice is sacred and every perspective has value, the talking circle creates a space where truth can be spoken and heard with respect. Many Saskatchewan schools have begun incorporating this practice into their conflict resolution programs.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Is conflict always a sign that a relationship is broken?', 'No, conflict is a normal part of any relationship.', 'It is how you handle it that matters.', 2, 0),
    (v_tenant, v_ch, 'What is an I statement?', 'A way of expressing feelings that says I feel... instead of You always...', 'Takes blame out of the conversation.', 2, 1),
    (v_tenant, v_ch, 'What is a mediator?', 'A neutral person who helps both sides in a conflict communicate and find a fair solution.', 'They do not take sides.', 2, 2);

  -- -----------------------------------------------------------------------
  -- Chapter 4: Family Diversity & Safety
  -- -----------------------------------------------------------------------
  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Family Diversity & Safety', 'health-3-family-diversity-safety',
    'Celebrate the many forms families take, recognise healthy family interactions, and learn about home and community safety.',
    '[
      {"type":"heading","level":1,"text":"Family Diversity & Safety"},
      {"type":"text","content":"Families come in many wonderful forms. Some families have two parents, some have one. Some children live with grandparents, aunts, uncles, or foster caregivers. Some families include step-parents or blended siblings. Some families have same-sex parents. What makes a family is not its structure but the love, care, and commitment the members have for one another."},
      {"type":"callout","style":"info","title":"All Families Are Valid","content":"There is no single correct way for a family to look. Every family structure, when built on love and respect, provides the foundation children need to grow, learn, and feel safe."},
      {"type":"text","content":"Healthy families share some important qualities regardless of their structure. Members in healthy families communicate openly, show care and affection, support each other through difficulties, resolve conflicts respectfully, and celebrate each other''s achievements. In a healthy family, you feel safe to be yourself."},
      {"type":"list","style":"unordered","items":["Open and honest communication","Affection and emotional support","Shared responsibilities","Respectful conflict resolution","Celebration of individual differences","A sense of belonging and safety"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"In many Saskatchewan First Nations traditions, family extends well beyond the immediate household. Extended family networks including grandparents, aunts, uncles, and community Elders are all considered part of a child''s family. The concept of the extended family as a protective circle reflects the Indigenous value of collective responsibility for the wellbeing of all children."},
      {"type":"text","content":"Home and community safety is something families work on together. Important safety practices include knowing your home address and phone number by heart, having a family emergency plan, knowing what to do if there is a fire, and understanding internet safety rules. Safety plans work best when everyone in the family practises them together."},
      {"type":"quiz","question":"What is the most important quality that all healthy families share, regardless of their structure?","options":["Having two parents","Having a lot of money","Love, care, and commitment among members","Living in a large house"],"correctIndex":2,"explanation":"What makes a family healthy is not its size, structure, or income, but the presence of love, care, and commitment among its members. These qualities create the safety and belonging every child needs."}
    ]'::jsonb,
    '[
      {"term":"Family","definition":"A group of people connected by love, care, and commitment, regardless of biological or legal ties."},
      {"term":"Extended Family","definition":"Family members beyond parents and siblings, including grandparents, aunts, uncles, and cousins."},
      {"term":"Blended Family","definition":"A family formed when two adults with children from previous relationships join together."},
      {"term":"Emergency Plan","definition":"A family''s prepared set of actions to follow in a dangerous or unexpected situation."},
      {"term":"Belonging","definition":"The feeling of being welcomed, valued, and accepted as a member of a group or community."}
    ]'::jsonb,
    'In Cree culture, the concept of all our relations, or kakisitotamawaw, reflects the understanding that kinship extends beyond the immediate family to encompass community, nation, and all living beings. Children raised with this worldview grow up feeling supported by a vast network of relationships, which provides profound emotional security and a strong sense of identity.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What makes a family healthy?', 'Love, care, respect, open communication, and a sense of belonging and safety.', 'Not the structure, the relationships.', 2, 0),
    (v_tenant, v_ch, 'Name two different types of family structures.', 'Two-parent, single-parent, blended, grandparent-led, same-sex parent, foster (any two).', 'Families look many ways.', 2, 1),
    (v_tenant, v_ch, 'What information should you know by heart for home safety?', 'Your home address and phone number.', 'Important in an emergency.', 2, 2);

END;
$$;


-- ============================================================================
-- TEXTBOOK 5: WolfWhale Health 4
-- Slug: wolfwhale-health-4
-- Chapters: Puberty Awareness, Nutrition & Fitness, Bullying Prevention,
--           Substance Awareness
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-health-4';

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Growing Up Healthy',
    'Grade 4 students begin exploring puberty, strengthen nutrition and fitness knowledge, address bullying, and develop awareness of substances.',
    'Understanding the changes ahead and making informed choices prepares us for healthy adolescence.',
    'How can I prepare for the changes of growing up and make choices that protect my health?')
  RETURNING id INTO v_unit;

  -- -----------------------------------------------------------------------
  -- Chapter 1: Puberty Awareness
  -- -----------------------------------------------------------------------
  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Puberty Awareness', 'health-4-puberty-awareness',
    'Introduce puberty as a natural stage of development, describe common physical and emotional changes, and normalise diversity in timing.',
    '[
      {"type":"heading","level":1,"text":"Puberty Awareness"},
      {"type":"text","content":"At some point in the next few years, your body will begin a remarkable journey called puberty. Puberty is the natural process through which a child''s body develops into an adult body. It is driven by hormones, chemical messengers produced by glands in your body, that trigger growth and change throughout your whole system."},
      {"type":"callout","style":"info","title":"What Is Puberty?","content":"Puberty is a natural, healthy phase of human development during which the body grows rapidly, hormones change, and the reproductive system matures. It typically begins between ages 8 and 13 for those assigned female at birth and between ages 9 and 14 for those assigned male at birth, though timing varies widely."},
      {"type":"text","content":"Bodies assigned female at birth typically experience breast development, widening of the hips, the beginning of menstruation, and growth in height. Bodies assigned male at birth typically experience growth in the testicles and penis, voice deepening, increased muscle mass, and growth in height. All bodies may experience increased body hair, oilier skin and hair, and the development of body odour during puberty."},
      {"type":"list","style":"unordered","items":["Rapid growth in height","Changes in body shape","Development of body hair","Oilier skin that may lead to pimples","Development of body odour","Emotional changes and mood shifts","Increased interest in identity and independence"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"In many First Nations traditions, the transition from childhood to adolescence is marked with ceremony. Coming-of-age ceremonies celebrate this passage as sacred and joyful, not something to be embarrassed about. Young people are honoured and supported by their community as they move into a new phase of life. These traditions help youth embrace change with confidence and pride."},
      {"type":"text","content":"Puberty happens at different times for different people, and both early and late development are completely normal. Comparing yourself to classmates is natural but can lead to unnecessary worry. Everyone will go through puberty in their own time and sequence. If you have questions or concerns about the changes you are experiencing, speaking with a trusted adult, a parent, a doctor, or a school counsellor, is always a good idea."},
      {"type":"quiz","question":"What causes the physical changes of puberty?","options":["Eating more food","Hormones produced by glands in your body","Getting more exercise","Spending time with older teenagers"],"correctIndex":1,"explanation":"Puberty is triggered by hormones, which are chemical messengers produced by glands such as the pituitary gland. These hormones travel through the bloodstream and signal the body to begin developing."}
    ]'::jsonb,
    '[
      {"term":"Puberty","definition":"The natural process during which a child''s body develops into an adult body, driven by hormones."},
      {"term":"Hormone","definition":"A chemical messenger produced by glands in the body that triggers growth and change in various body systems."},
      {"term":"Menstruation","definition":"A monthly process in which the lining of the uterus sheds, typically starting during puberty."},
      {"term":"Gland","definition":"An organ in the body that produces and releases hormones or other substances."},
      {"term":"Adolescence","definition":"The period of development between childhood and adulthood, encompassing puberty and the teenage years."},
      {"term":"Development","definition":"The process of growing and maturing physically, emotionally, and cognitively over time."}
    ]'::jsonb,
    'Many Saskatchewan First Nations traditions mark the beginning of puberty, particularly for girls, with ceremony. The Berry Fast, practised by some Cree communities, is a coming-of-age ceremony that helps young women develop a relationship with the land and understand their role in the community. These ceremonies provide cultural grounding and community support during a vulnerable time of change.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is puberty?', 'A natural process where a child''s body develops into an adult body, triggered by hormones.', 'Every person goes through it.', 2, 0),
    (v_tenant, v_ch, 'What causes puberty to begin?', 'Hormones produced by glands in the body.', 'Chemical messengers in the bloodstream.', 2, 1),
    (v_tenant, v_ch, 'Is it normal for puberty to start at different ages for different people?', 'Yes, timing varies widely and both early and late development are completely normal.', 'Everyone has their own timeline.', 2, 2);

  -- -----------------------------------------------------------------------
  -- Chapter 2: Nutrition & Fitness
  -- -----------------------------------------------------------------------
  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Nutrition & Fitness', 'health-4-nutrition-fitness',
    'Deepen understanding of macronutrients, explore the relationship between nutrition and physical performance, and design a personal fitness plan.',
    '[
      {"type":"heading","level":1,"text":"Nutrition & Fitness"},
      {"type":"text","content":"As your body prepares for the growth of puberty, nutrition and fitness become even more important. Your body is building bones, muscles, and a more powerful brain. Giving it the right fuel and regular physical challenges helps you grow into the strongest version of yourself."},
      {"type":"callout","style":"info","title":"Macronutrients","content":"Macronutrients are the three main types of nutrients your body needs in large amounts: carbohydrates for energy, proteins for building and repairing tissue, and fats for brain health and hormone production. Every meal that includes a balance of all three helps your body thrive."},
      {"type":"text","content":"During puberty, your body needs extra calcium and vitamin D for the rapid bone growth that is taking place. It also needs more iron, especially for those who menstruate, to replace iron lost each month. Eating a variety of colourful vegetables, lean proteins, whole grains, and dairy or fortified alternatives covers most of these increased needs."},
      {"type":"list","style":"unordered","items":["Carbohydrates: primary energy source (grains, fruits, vegetables)","Proteins: build and repair tissue (meat, fish, eggs, legumes)","Fats: brain health and hormones (nuts, seeds, avocado, fish)","Calcium: bone strength (dairy, fortified plant beverages, leafy greens)","Iron: oxygen transport (red meat, spinach, lentils, fortified cereals)"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"Physical wellness, the physical dimension of the Medicine Wheel, is strengthened by activities that connect us to the land. Indigenous sports and games such as lacrosse, hand games, and foot races have always been ways to build physical fitness while also nurturing community bonds and cultural identity. Movement is medicine."},
      {"type":"text","content":"Fitness is not just about being fast or strong. Physical fitness includes cardiovascular endurance, muscular strength, flexibility, and balance. Cardiovascular activities like running, swimming, or cycling make your heart and lungs stronger. Strength activities like climbing, gymnastics, or resistance exercises build muscle. Stretching and activities like yoga improve flexibility and reduce injury risk."},
      {"type":"quiz","question":"Which nutrient is especially important during puberty for building strong bones?","options":["Iron","Carbohydrates","Calcium","Vitamin C"],"correctIndex":2,"explanation":"Calcium is critical during puberty because bones are growing rapidly. The calcium deposited in bones during adolescence largely determines bone density for life. Good sources include dairy, fortified plant beverages, and leafy greens."}
    ]'::jsonb,
    '[
      {"term":"Macronutrient","definition":"One of the three main nutrients needed in large amounts: carbohydrates, proteins, and fats."},
      {"term":"Carbohydrate","definition":"A macronutrient found in grains, fruits, and vegetables that provides the body''s primary energy source."},
      {"term":"Fat","definition":"A macronutrient found in nuts, fish, and oils that supports brain health, hormone production, and energy storage."},
      {"term":"Calcium","definition":"A mineral essential for building and maintaining strong bones and teeth."},
      {"term":"Cardiovascular Endurance","definition":"The ability of the heart and lungs to supply oxygen to the body during sustained physical activity."},
      {"term":"Flexibility","definition":"The range of motion available at a joint, improved through regular stretching."}
    ]'::jsonb,
    'Traditional Indigenous physical practices on the prairies, including horse riding, long-distance running, and competitive games at gatherings, developed extraordinary cardiovascular fitness, strength, and agility. Powwow dancing is another example of physical activity deeply embedded in cultural practice, combining aerobic exercise with artistic expression and spiritual connection.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are the three macronutrients?', 'Carbohydrates, proteins, and fats.', 'The big three nutrients.', 2, 0),
    (v_tenant, v_ch, 'Why is calcium especially important during puberty?', 'Bones are growing rapidly and calcium builds bone density that lasts a lifetime.', 'Peak bone building time.', 2, 1),
    (v_tenant, v_ch, 'Name the four components of physical fitness.', 'Cardiovascular endurance, muscular strength, flexibility, and balance.', 'Fitness is more than just strength.', 2, 2);

  -- -----------------------------------------------------------------------
  -- Chapter 3: Bullying Prevention
  -- -----------------------------------------------------------------------
  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Bullying Prevention', 'health-4-bullying-prevention',
    'Define bullying, distinguish it from conflict, explore bystander power, and develop strategies for responding safely.',
    '[
      {"type":"heading","level":1,"text":"Bullying Prevention"},
      {"type":"text","content":"Bullying is a serious issue that affects many schools and communities. Understanding what bullying is, why it happens, and what everyone can do about it is an important part of creating a safe and respectful environment for all students."},
      {"type":"callout","style":"info","title":"What Is Bullying?","content":"Bullying is repeated, intentional behaviour meant to harm or control another person, where there is an imbalance of power. It can be physical, verbal, social, or online. The key factors are: it is repeated, it is intentional, and there is a power difference."},
      {"type":"text","content":"Bullying is different from a conflict between friends. A conflict is a disagreement between people with equal power who both want to resolve the problem. Bullying involves one person or group using their power to deliberately hurt or exclude another person repeatedly over time. Teasing that both people find funny is not bullying. Teasing that one person consistently finds hurtful and that keeps happening despite that person saying stop is bullying."},
      {"type":"list","style":"unordered","items":["Physical bullying: hitting, kicking, damaging belongings","Verbal bullying: name-calling, threats, hurtful teasing","Social bullying: excluding someone, spreading rumours, damaging friendships","Cyberbullying: using technology to harass, threaten, or humiliate"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"Treating all people with respect and dignity is a fundamental teaching across Saskatchewan Indigenous cultures. The teaching that we are all related and that harming another person harms the whole community creates a powerful cultural basis for anti-bullying values. In healthy communities, everyone looks out for one another."},
      {"type":"text","content":"Bystanders are people who see bullying happening. Research shows that most incidents of bullying stop quickly when a bystander steps in to help. Safe ways to be an upstander rather than a bystander include standing with the person being bullied, refusing to laugh or go along with the bully, reporting what you saw to a trusted adult, and checking in with the person afterward to see if they are okay."},
      {"type":"quiz","question":"What is the difference between bullying and a conflict?","options":["There is no difference; they are the same thing","Bullying involves repeated harm with a power imbalance; conflict is a disagreement between equals","Bullying is only physical; conflict is only verbal","Conflict is worse than bullying"],"correctIndex":1,"explanation":"Bullying is defined by three key elements: it is repeated, intentional, and involves an imbalance of power. A regular conflict is a disagreement between people with roughly equal power who both want to resolve the issue."}
    ]'::jsonb,
    '[
      {"term":"Bullying","definition":"Repeated, intentional behaviour meant to harm or control another person where there is an imbalance of power."},
      {"term":"Cyberbullying","definition":"Using digital technology, such as social media or text messages, to harass, threaten, or humiliate someone."},
      {"term":"Bystander","definition":"A person who witnesses bullying but does not get involved."},
      {"term":"Upstander","definition":"A person who witnesses bullying and chooses to take positive action to help the person being bullied."},
      {"term":"Power Imbalance","definition":"A situation where one person or group has significantly more social, physical, or other power than another."}
    ]'::jsonb,
    'The value of collective responsibility in Indigenous cultures creates a natural foundation for anti-bullying values. When community members understand themselves as interconnected, harming a member of the community is understood as harming oneself. Restorative justice practices, which have roots in Indigenous peacemaking traditions, focus on repairing harm and restoring relationships rather than simply punishing the person who caused harm.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What three things make something bullying?', 'It is repeated, intentional, and involves a power imbalance.', 'All three must be present.', 2, 0),
    (v_tenant, v_ch, 'What is cyberbullying?', 'Using technology to harass, threaten, or humiliate someone.', 'Bullying through screens.', 2, 1),
    (v_tenant, v_ch, 'What is the difference between a bystander and an upstander?', 'A bystander watches bullying without acting; an upstander takes positive action to help.', 'Which one will you be?', 2, 2);

  -- -----------------------------------------------------------------------
  -- Chapter 4: Substance Awareness
  -- -----------------------------------------------------------------------
  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Substance Awareness', 'health-4-substance-awareness',
    'Introduce common substances, distinguish between medicines and drugs of misuse, understand basic health risks, and practise refusal skills.',
    '[
      {"type":"heading","level":1,"text":"Substance Awareness"},
      {"type":"text","content":"A substance is anything that changes the way your body or brain works when you take it. Some substances, like the medicine your doctor prescribes when you are sick, are safe and helpful when used correctly. Other substances can be harmful, especially to growing bodies and brains."},
      {"type":"callout","style":"info","title":"Medicines vs. Drugs of Misuse","content":"Medicines are substances approved by health authorities to treat illness or manage symptoms when used as directed by a healthcare provider. Drugs of misuse are substances taken to alter how someone feels, often outside of medical guidance. Both can be harmful if misused, but drugs of misuse carry significantly greater risks, especially for children and teenagers."},
      {"type":"text","content":"Tobacco, alcohol, and cannabis are substances that are legal for adults in Canada but are harmful to young people whose brains and bodies are still developing. The brain continues developing until around age 25. Exposure to these substances during development can cause lasting harm to memory, decision-making, and emotional regulation."},
      {"type":"list","style":"unordered","items":["Tobacco: contains nicotine, which is highly addictive; damages the lungs and heart","Alcohol: slows brain function; impairs judgment; highly addictive","Cannabis: affects memory and learning; particularly harmful to the developing brain","Prescription drug misuse: taking medication not prescribed to you is dangerous","Inhalants: household chemicals used to get high; immediately life-threatening"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"Traditional Indigenous plant medicines, used carefully and with deep knowledge by healers, are an important part of Indigenous health traditions. These medicines were never used recreationally and were always administered with ceremony, intention, and expertise. The contrast between sacred plant medicine and substance misuse reflects the broader Indigenous teaching that all things in nature must be used with respect and wisdom."},
      {"type":"text","content":"If someone ever offers you a substance, you have the right to say no clearly and confidently. You do not need to explain yourself. Simple refusal phrases include: No thanks, that is not for me or I am good, I do not want any. If the person keeps pressing, leave the situation and tell a trusted adult. Real friends respect your right to say no."},
      {"type":"quiz","question":"Why are substances like alcohol and cannabis especially harmful to children and teenagers?","options":["Because they taste bad","Because their brains and bodies are still developing and substance exposure can cause lasting harm","Because they are illegal for everyone","Because adults have told them not to use them"],"correctIndex":1,"explanation":"The brain continues to develop until around age 25. Exposure to substances like alcohol and cannabis during this critical period can permanently affect memory, decision-making, and emotional health, which is why these substances are particularly dangerous for young people."}
    ]'::jsonb,
    '[
      {"term":"Substance","definition":"Any material that changes the way the body or brain works when taken in."},
      {"term":"Medicine","definition":"A substance approved to treat illness or symptoms when used correctly under medical guidance."},
      {"term":"Addiction","definition":"A condition in which a person compulsively seeks and uses a substance despite harmful consequences."},
      {"term":"Nicotine","definition":"An addictive chemical found in tobacco products that affects the heart and brain."},
      {"term":"Refusal Skill","definition":"A strategy for saying no clearly and confidently when pressured to do something harmful."},
      {"term":"Peer Pressure","definition":"The influence from people your own age to do something, which can be positive or negative."}
    ]'::jsonb,
    'Substance misuse has had devastating impacts on many Indigenous communities in Canada, largely as a result of the trauma caused by colonisation, residential schools, and the disruption of cultural identity. Healing-centred approaches that incorporate traditional practices, cultural reconnection, and community support are proving more effective than punitive approaches. Understanding the root causes of substance misuse builds compassion and reduces stigma.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is addiction?', 'A condition where someone compulsively uses a substance despite harmful consequences.', 'The brain gets rewired.', 2, 0),
    (v_tenant, v_ch, 'Why is alcohol especially harmful to young people?', 'Because the brain is still developing until age 25 and alcohol can cause lasting damage.', 'Critical development period.', 2, 1),
    (v_tenant, v_ch, 'What is a refusal skill?', 'A strategy for saying no clearly and confidently when pressured to do something harmful.', 'Practice makes it easier.', 2, 2);

END;
$$;


-- ============================================================================
-- TEXTBOOK 6: WolfWhale Health 5
-- Slug: wolfwhale-health-5
-- Chapters: Puberty & Body Changes, Mental Health Awareness,
--           Media & Body Image, Peer Pressure & Wellness
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-health-5';

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Navigating Change',
    'Grade 5 students explore puberty in greater depth, develop mental health literacy, critically examine media, and build resistance to peer pressure.',
    'Understanding the changes in our bodies and minds, and the influences around us, helps us make healthy and authentic choices.',
    'How do I stay true to myself and make healthy choices as I grow and change?')
  RETURNING id INTO v_unit;

  -- Chapter 1: Puberty & Body Changes
  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Puberty & Body Changes', 'health-5-puberty-body-changes',
    'Deepen understanding of puberty, menstruation, personal hygiene during puberty, and emotional changes.',
    '[
      {"type":"heading","level":1,"text":"Puberty & Body Changes"},
      {"type":"text","content":"By now you may have already noticed some changes in your body, or you may be on the verge of those changes beginning. Puberty is the bridge between childhood and adulthood, and while the journey can feel confusing or overwhelming at times, it is a completely natural and remarkable process."},
      {"type":"callout","style":"info","title":"Hormones and the Endocrine System","content":"Puberty is controlled by the endocrine system, a network of glands that produce and release hormones. The pituitary gland in the brain sends signals to the reproductive glands, which begin producing estrogen or testosterone. These hormones travel through the bloodstream and trigger the changes of puberty throughout the body."},
      {"type":"text","content":"For those assigned female at birth, estrogen causes breast development, widening of the hips, and eventually the start of menstruation. Menstruation is a monthly cycle in which the lining of the uterus, built up in preparation for a possible pregnancy, sheds through the vagina over three to seven days. This process is completely normal and healthy. Period products including pads, tampons, and menstrual cups are available to manage menstrual flow."},
      {"type":"text","content":"For those assigned male at birth, testosterone causes the testes and penis to grow, the voice to deepen, and muscle mass to increase. Both sexes experience growth in body hair, oilier skin that may lead to acne, increased sweating, and the development of body odour. Daily bathing and using deodorant or antiperspirant are important hygiene practices during this time."},
      {"type":"list","style":"unordered","items":["Shower or bathe daily","Apply deodorant or antiperspirant","Wash hair regularly as it may become oilier","Wash your face twice daily to manage acne","Change and wash clothing regularly","Use period products as needed and change them regularly"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"In Cree, Nakoda, and other Saskatchewan Indigenous traditions, a girl''s first menstruation was historically celebrated as a sacred transition. Ceremonies honoured the young woman''s entry into a new phase of life and her connection to the moon and the cycles of the natural world. These teachings helped young women embrace their changing bodies with pride rather than shame."},
      {"type":"quiz","question":"What hormone is primarily responsible for the changes of puberty in people assigned female at birth?","options":["Testosterone","Melatonin","Estrogen","Adrenaline"],"correctIndex":2,"explanation":"Estrogen, produced primarily by the ovaries, drives most of the physical changes of female puberty including breast development, changes in body shape, and the start of menstruation."}
    ]'::jsonb,
    '[
      {"term":"Endocrine System","definition":"The network of glands in the body that produce and release hormones into the bloodstream."},
      {"term":"Estrogen","definition":"The primary hormone driving female puberty, produced by the ovaries."},
      {"term":"Testosterone","definition":"The primary hormone driving male puberty, produced by the testes."},
      {"term":"Menstruation","definition":"The monthly shedding of the uterine lining, which begins during female puberty."},
      {"term":"Acne","definition":"A skin condition in which pores become clogged with oil and dead skin cells, causing pimples."},
      {"term":"Pituitary Gland","definition":"A small gland in the brain that directs the endocrine system and triggers puberty by signalling the reproductive glands."}
    ]'::jsonb,
    'Many Saskatchewan Indigenous traditions hold menstruation as sacred, a sign of a young woman''s connection to the cycles of the moon and the earth. First moon ceremonies in Cree, Anishinaabe, and other cultures welcome young women into adulthood with community celebration, teaching, and gifts. Reclaiming these ceremonies is an important part of healing from the shame that was imposed on Indigenous women through colonisation.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What system controls puberty?', 'The endocrine system, through glands that produce and release hormones.', 'Glands and hormones.', 2, 0),
    (v_tenant, v_ch, 'What is menstruation?', 'The monthly shedding of the uterine lining, which begins during female puberty.', 'A normal monthly cycle.', 2, 1),
    (v_tenant, v_ch, 'Name two hygiene practices that become especially important during puberty.', 'Daily bathing, using deodorant, washing face, washing hair, changing clothes regularly (any two).', 'Body changes, hygiene changes.', 2, 2);

  -- Chapter 2: Mental Health Awareness
  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Mental Health Awareness', 'health-5-mental-health-awareness',
    'Define mental health, identify common mental health challenges, reduce stigma, and explore help-seeking strategies.',
    '[
      {"type":"heading","level":1,"text":"Mental Health Awareness"},
      {"type":"text","content":"Mental health is just as real and important as physical health. It refers to your emotional, psychological, and social wellbeing. Good mental health allows you to think clearly, manage stress, build relationships, and cope with the normal challenges of life. Just as anyone can break a bone, anyone can experience a mental health challenge."},
      {"type":"callout","style":"info","title":"What Is Mental Health?","content":"Mental health describes how we think, feel, and act. It also determines how we handle stress, relate to others, and make choices. Mental health exists on a spectrum: at times we feel mentally well and at other times we struggle. Both are normal parts of the human experience."},
      {"type":"text","content":"Anxiety is one of the most common mental health challenges. It is a feeling of worry, nervousness, or fear that is so intense or persistent that it interferes with daily life. Some anxiety is normal and even helpful, like the nervousness before a test that makes you study. Anxiety becomes a concern when it is overwhelming and constant, prevents you from doing things you want to do, or seems to have no clear cause."},
      {"type":"text","content":"Depression is more than feeling sad for a day or two. It is a persistent low mood that lasts for weeks, makes it hard to enjoy things that used to bring pleasure, affects sleep and appetite, and can make you feel hopeless or worthless. Depression is not a choice or a weakness; it is a medical condition that responds well to treatment."},
      {"type":"list","style":"unordered","items":["Signs of poor mental health: persistent sadness, constant worry, withdrawing from friends and activities, changes in sleep or appetite, difficulty concentrating","Ways to support mental health: regular physical activity, adequate sleep, time in nature, connecting with people you trust, limiting social media, creative expression","When to seek help: when symptoms are intense, persistent, or interfering with daily life"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"Indigenous wellness models have always understood that mental and emotional health cannot be separated from physical and spiritual health. Traditional practices like sharing circles, land-based healing, ceremony, and the guidance of Elders address mental health within a whole-person framework. These practices are increasingly recognised as effective components of culturally safe mental health care."},
      {"type":"quiz","question":"What is the key difference between everyday sadness and depression?","options":["Depression is caused by bad grades","Depression is a persistent condition lasting weeks that interferes with daily functioning, not just a temporary low mood","Depression only affects adults","You can easily snap out of depression by thinking positive thoughts"],"correctIndex":1,"explanation":"Depression is a medical condition involving persistent low mood that interferes with daily life, not simply feeling sad for a day or two. It requires proper support and often professional treatment."}
    ]'::jsonb,
    '[
      {"term":"Mental Health","definition":"A person''s emotional, psychological, and social wellbeing, affecting how they think, feel, and act."},
      {"term":"Anxiety","definition":"A mental health condition characterised by intense, persistent worry or fear that interferes with daily life."},
      {"term":"Depression","definition":"A medical condition involving persistent low mood, loss of interest, and feelings of hopelessness lasting weeks or more."},
      {"term":"Stigma","definition":"Negative attitudes and beliefs about a person based on a characteristic, such as having a mental health condition."},
      {"term":"Help-Seeking","definition":"The act of reaching out to a trusted person or professional when you are struggling with your mental health."},
      {"term":"Resilience","definition":"The ability to recover and bounce back from difficult experiences."}
    ]'::jsonb,
    'Mental health challenges in Indigenous communities across Saskatchewan are often rooted in the intergenerational trauma of colonisation, forced relocation, and the residential school system. Healing approaches that centre Indigenous culture, language, and connection to the land are showing powerful results. Learning about the connections between historical trauma and mental health builds empathy and dismantles harmful stereotypes.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is mental health?', 'Your emotional, psychological, and social wellbeing; how you think, feel, and act.', 'As real as physical health.', 2, 0),
    (v_tenant, v_ch, 'What is the difference between normal anxiety and an anxiety disorder?', 'An anxiety disorder involves intense, persistent worry that interferes with daily life.', 'When it gets in the way.', 2, 1),
    (v_tenant, v_ch, 'Name two things that support good mental health.', 'Physical activity, sleep, time in nature, social connection, limiting social media, creative expression (any two).', 'Think about what restores you.', 2, 2);

  -- Chapter 3: Media & Body Image
  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Media & Body Image', 'health-5-media-body-image',
    'Critically examine media messages about body image, develop media literacy skills, and build a positive relationship with your own body.',
    '[
      {"type":"heading","level":1,"text":"Media & Body Image"},
      {"type":"text","content":"Every day you encounter hundreds of images and messages about what bodies are supposed to look like. These messages come from television, movies, social media, advertisements, and magazines. Many of these images are carefully constructed, edited, and filtered to present an unrealistic standard of appearance that almost no real person naturally has."},
      {"type":"callout","style":"info","title":"What Is Media Literacy?","content":"Media literacy is the ability to access, analyse, and evaluate media messages critically. A media literate person asks: Who created this message? What techniques are being used? Who benefits from me believing this? What is left out? These questions help you think clearly about the information you consume."},
      {"type":"text","content":"Body image is how you see and feel about your own body. Positive body image means appreciating your body for what it can do, not just what it looks like. Negative body image, often fuelled by comparing yourself to unrealistic media images, can lead to unhealthy dieting, disordered eating, and poor mental health. Research shows that heavy social media use, particularly platforms focused on appearance, is linked to lower body satisfaction, especially among girls."},
      {"type":"text","content":"Advertising uses specific techniques to make you feel that you are not good enough without their product. These techniques include using digitally altered images, featuring only certain body types, using lighting and angles to enhance appearance, and using aspirational language like perfect, flawless, or ideal. Recognising these techniques helps you see advertisements as selling tools, not reflections of reality."},
      {"type":"list","style":"unordered","items":["Most images in media are edited and filtered","Advertising is designed to create dissatisfaction so you buy products","Social media algorithms show you more content that generates strong emotional reactions","Diverse body types, skin tones, and abilities are underrepresented in mainstream media","Your worth is not determined by your appearance"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"Indigenous teachings about the body emphasise its sacred nature and its role as a vessel for the spirit. The emphasis on function, strength, and spiritual connectedness rather than appearance stands in sharp contrast to media messages about body perfection. Reconnecting with cultural teachings about body respect can be a powerful antidote to the harmful effects of mainstream media on body image."},
      {"type":"quiz","question":"What is media literacy?","options":["The ability to read books and newspapers","The ability to critically analyse and evaluate media messages","The ability to create your own social media posts","The ability to use computers and smartphones"],"correctIndex":1,"explanation":"Media literacy involves the skills needed to critically access, analyse, and evaluate media messages, including understanding who created them, what techniques they use, and what their purpose is."}
    ]'::jsonb,
    '[
      {"term":"Media Literacy","definition":"The ability to critically access, analyse, and evaluate media messages."},
      {"term":"Body Image","definition":"How a person perceives, thinks about, and feels about their own body."},
      {"term":"Positive Body Image","definition":"Appreciating and respecting your body for what it can do rather than focusing on how it looks."},
      {"term":"Disordered Eating","definition":"A range of irregular eating behaviours that can be harmful, often triggered by poor body image."},
      {"term":"Advertising","definition":"A form of media designed to persuade people to buy a product or adopt an attitude."},
      {"term":"Algorithm","definition":"A computer program that determines which content appears in your social media feed based on your past behaviour."}
    ]'::jsonb,
    'Indigenous cultures across Saskatchewan have historically valued bodies for their strength, endurance, and spiritual significance rather than their appearance. Traditional clothing, art, and ceremony celebrated the full range of human forms. Reconnecting with these values, through cultural education and community connection, provides young Indigenous people with an alternative to harmful media messages about body ideals.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is body image?', 'How you perceive, think about, and feel about your own body.', 'Your inner picture of yourself.', 2, 0),
    (v_tenant, v_ch, 'Name one technique advertisers use to make people feel dissatisfied.', 'Digital alteration, featuring only certain body types, aspirational language, or strategic lighting (any one).', 'They want you to feel not enough.', 2, 1),
    (v_tenant, v_ch, 'What does positive body image mean?', 'Appreciating your body for what it can do rather than only how it looks.', 'Function over appearance.', 2, 2);

  -- Chapter 4: Peer Pressure & Wellness
  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Peer Pressure & Wellness', 'health-5-peer-pressure-wellness',
    'Understand positive and negative peer pressure, develop assertiveness, and connect wellness choices to personal values.',
    '[
      {"type":"heading","level":1,"text":"Peer Pressure & Wellness"},
      {"type":"text","content":"As you move through adolescence, the opinions and behaviours of your peers become increasingly important to you. This is completely normal. Humans are social creatures, and belonging matters. However, the desire to belong can sometimes lead us to make choices that conflict with our values or compromise our health."},
      {"type":"callout","style":"info","title":"Positive vs. Negative Peer Pressure","content":"Not all peer pressure is negative. Positive peer pressure happens when friends encourage each other to try new things, study harder, make healthier choices, or stand up for what is right. Negative peer pressure happens when friends pressure each other to do something risky, hurtful, or against their values."},
      {"type":"text","content":"Assertiveness is the ability to express your needs, boundaries, and opinions clearly and respectfully without being aggressive or allowing yourself to be pushed around. An assertive person can say no to something they do not want to do without needing to over-explain or apologise. Assertiveness is a skill that can be learned and practised, and it becomes easier over time."},
      {"type":"text","content":"Your values are the principles and beliefs that are most important to you, the things that guide your decisions about what is right and wrong. When you are clear about your values, making decisions under pressure becomes easier because you have an internal compass to refer to. Common values include honesty, kindness, fairness, family, health, and creativity."},
      {"type":"list","style":"unordered","items":["Identify your personal values","Practise saying no clearly without over-explaining","Use humour to deflect pressure without creating conflict","Have a code word with a trusted adult to signal you need help","Surround yourself with friends who respect your choices","Remember that people who truly care about you will respect your no"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"The spiritual dimension of the Medicine Wheel asks us to live in alignment with our values and our deepest sense of who we are. Indigenous teachings about walking in a good way mean making choices that honour your responsibilities to yourself, your family, your community, and the natural world. When faced with peer pressure, asking what a good way forward looks like can be a powerful guide."},
      {"type":"quiz","question":"What is assertiveness?","options":["Being aggressive and forcing your opinion on others","Quietly going along with whatever others want","Expressing your needs and limits clearly and respectfully without being pushed around","Avoiding all situations where you might feel pressured"],"correctIndex":2,"explanation":"Assertiveness means expressing your needs, boundaries, and opinions in a way that is clear and respectful, neither aggressive nor passive. It allows you to hold your ground without harming your relationships."}
    ]'::jsonb,
    '[
      {"term":"Peer Pressure","definition":"The influence from people your own age to behave, think, or feel a certain way."},
      {"term":"Assertiveness","definition":"The ability to express your needs, limits, and opinions clearly and respectfully."},
      {"term":"Values","definition":"The core principles and beliefs that guide your decisions about what is right and important."},
      {"term":"Positive Peer Pressure","definition":"Encouragement from peers to make healthy, positive, or ambitious choices."},
      {"term":"Negative Peer Pressure","definition":"Pressure from peers to do something risky, harmful, or against one''s values."},
      {"term":"Refusal Skill","definition":"A learned strategy for saying no clearly and confidently in high-pressure situations."}
    ]'::jsonb,
    'Indigenous teachings often encourage young people to seek guidance from Elders and community leaders when facing difficult decisions. Rather than relying solely on peer opinion, these traditions emphasise the wisdom of those who have lived longer and faced similar challenges. This intergenerational guidance system provides a powerful counterbalance to negative peer influence.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is assertiveness?', 'The ability to express your needs and limits clearly and respectfully without being pushed around.', 'Not aggressive, not passive.', 2, 0),
    (v_tenant, v_ch, 'What is the difference between positive and negative peer pressure?', 'Positive encourages healthy choices; negative pressures you toward risky or value-conflicting behaviour.', 'Not all peer influence is bad.', 2, 1),
    (v_tenant, v_ch, 'How do personal values help when facing peer pressure?', 'They act as an internal compass to guide decisions when you feel pressured.', 'Know what matters to you.', 2, 2);

END;
$$;


-- ============================================================================
-- TEXTBOOK 7: WolfWhale Health 6
-- Slug: wolfwhale-health-6
-- Chapters: Human Development, Nutrition for Active Lives,
--           Mental Wellness, Digital Health & Decision-Making
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-health-6';

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Health in a Changing World',
    'Grade 6 students examine human development across the lifespan, deepen nutrition knowledge, develop mental wellness strategies, and navigate digital health.',
    'Understanding our development and the influences around us empowers us to make intentional health choices.',
    'How do I make healthy choices for my body and mind in an increasingly complex world?')
  RETURNING id INTO v_unit;

  -- Chapter 1: Human Development
  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Human Development', 'health-6-human-development',
    'Trace human development from conception through old age, explore reproductive anatomy, and understand fertilisation and pregnancy.',
    '[
      {"type":"heading","level":1,"text":"Human Development"},
      {"type":"text","content":"Human life follows a remarkable journey from a single fertilised cell to a fully developed adult and eventually into the wisdom of old age. Understanding this journey helps us appreciate the complexity of our bodies and the experiences of people at every stage of life."},
      {"type":"callout","style":"info","title":"Stages of Human Development","content":"Human development is typically described in stages: prenatal (before birth), infancy, childhood, adolescence, adulthood, and older adulthood. Each stage has its own physical, cognitive, and emotional characteristics. No stage is more valuable than another; each brings its own gifts."},
      {"type":"text","content":"Reproduction begins when a sperm cell from a male fertilises an egg cell from a female, creating a single cell called a zygote. The zygote contains 23 chromosomes from each parent, giving it a unique set of 46 chromosomes, which carry the genetic blueprint for the new person. The zygote divides rapidly and implants in the wall of the uterus, where it develops over approximately 40 weeks into a fully formed baby."},
      {"type":"text","content":"During the prenatal period, the developing organism passes through three stages. The embryonic stage, from about week 2 to week 8, is when all major organ systems begin to form. The fetal stage, from week 9 until birth, is characterised by growth and the refinement of organ systems. Birth typically occurs around 40 weeks after fertilisation, though babies born between 37 and 42 weeks are considered full-term."},
      {"type":"list","style":"unordered","items":["Prenatal: fertilisation through birth (approximately 40 weeks)","Infancy: birth to age 2 (rapid physical and cognitive growth)","Childhood: ages 2 to 12 (language, social, and academic development)","Adolescence: ages 10 to 20 (puberty, identity, independence)","Adulthood: ages 20 to 65 (work, relationships, parenthood)","Older adulthood: 65 and beyond (wisdom, reflection, slower physical change)"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"Indigenous teachings across Saskatchewan describe human life as a sacred circle with no beginning or end. The journey from birth to Elder is honoured at every stage, and each stage is seen as carrying responsibilities to the community. Elders are particularly revered as carriers of wisdom, history, and cultural knowledge. This cyclical view of life stands in contrast to linear Western models of development."},
      {"type":"quiz","question":"What is a zygote?","options":["A fully developed fetus","A sperm cell that has entered the ovary","A fertilised egg cell containing 46 chromosomes","A type of hormone produced during pregnancy"],"correctIndex":2,"explanation":"A zygote is the single cell formed when a sperm fertilises an egg. It contains 23 chromosomes from the father and 23 from the mother, for a total of 46, which carry the complete genetic information for the new person."}
    ]'::jsonb,
    '[
      {"term":"Fertilisation","definition":"The union of a sperm cell and an egg cell to form a zygote."},
      {"term":"Zygote","definition":"The single cell formed at fertilisation, containing 46 chromosomes with the complete genetic blueprint."},
      {"term":"Embryo","definition":"The developing organism from about week 2 to week 8 after fertilisation, when organ systems form."},
      {"term":"Fetus","definition":"The developing organism from week 9 until birth, as organs mature and the body grows."},
      {"term":"Chromosome","definition":"A thread-like structure in the cell nucleus that carries genetic information in the form of genes."},
      {"term":"Prenatal","definition":"The period of development occurring before birth, from fertilisation to delivery."}
    ]'::jsonb,
    'Many Saskatchewan Indigenous cultures mark the beginning of life as occurring before birth, with the unborn child considered a full member of the community. Ceremonial songs, prayers, and stories were shared with the developing baby to welcome them into the community and begin their cultural education. These practices reflect a profound respect for the sacredness of new life.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a zygote?', 'The single cell formed when a sperm fertilises an egg, containing 46 chromosomes.', 'The very beginning of life.', 3, 0),
    (v_tenant, v_ch, 'Name the three prenatal stages.', 'Zygote (fertilisation to implantation), embryo (weeks 2-8), and fetus (week 9 to birth).', 'Three phases before birth.', 3, 1),
    (v_tenant, v_ch, 'How many chromosomes does a human cell normally contain?', '46 chromosomes (23 from each parent).', 'Half from mom, half from dad.', 3, 2);

  -- Chapter 2: Nutrition for Active Lives
  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Nutrition for Active Lives', 'health-6-nutrition-active-lives',
    'Connect nutrition science to athletic performance, understand food labels, and develop strategies for fuelling an active lifestyle.',
    '[
      {"type":"heading","level":1,"text":"Nutrition for Active Lives"},
      {"type":"text","content":"Whether you play on a sports team, dance, cycle, or simply walk to school, your body needs proper nutrition to support physical activity. The nutrients you eat before, during, and after exercise affect your energy levels, your performance, and how quickly your body recovers."},
      {"type":"callout","style":"info","title":"Fuelling Exercise","content":"For most activities lasting less than an hour, a balanced meal eaten two to three hours before exercise provides sufficient fuel. For longer activities, small carbohydrate-rich snacks during exercise help maintain energy. After exercise, a combination of carbohydrates and protein within 30 minutes helps replenish energy stores and repair muscle tissue."},
      {"type":"text","content":"Reading food labels is an important skill for making informed choices. The nutrition facts table on packaged foods tells you the serving size, calories, and the amount of key nutrients per serving. Pay particular attention to sodium, added sugar, and saturated fat, which Canadians tend to consume in excess. Look for foods where the % daily value for fibre, vitamins, and minerals is 15% or higher."},
      {"type":"text","content":"Hydration is critical for physical performance. Even mild dehydration of just two percent of body weight can impair focus, endurance, and coordination. Water is the best hydration choice for most activities. Sports drinks are only necessary during intense activity lasting more than 60 minutes because they contain electrolytes that replace what is lost in sweat. Sugary beverages like juice and soda are poor hydration choices."},
      {"type":"list","style":"unordered","items":["Before exercise: balanced meal 2-3 hours ahead, or light snack 30-60 minutes before","During exercise: water every 15-20 minutes; snack for activities over 60 minutes","After exercise: protein and carbohydrates within 30 minutes","Daily hydration: aim for about 6-8 cups of water; more on active days","Limit: added sugars, sodium, and ultra-processed foods"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"Traditional Indigenous athletes, including long-distance runners, hunters, and paddlers, developed extraordinary physical capacity through a combination of land-based food and daily movement. Eating close to the source, consuming whole, minimally processed foods from the land and water, provided exactly the nutrient density needed for sustained physical performance. This is consistent with what modern nutrition science now confirms about whole food diets."},
      {"type":"quiz","question":"What is the best beverage for hydration during most physical activities?","options":["Energy drinks","Fruit juice","Water","Sports drinks"],"correctIndex":2,"explanation":"Water is the best hydration choice for most activities. Sports drinks are only beneficial during intense exercise lasting more than 60 minutes. Energy drinks are not appropriate for hydration at any time."}
    ]'::jsonb,
    '[
      {"term":"Hydration","definition":"Maintaining adequate fluid levels in the body through regular water intake."},
      {"term":"Electrolyte","definition":"A mineral in the blood and body fluids (such as sodium, potassium) that carries electrical charges essential for cell function."},
      {"term":"Nutrition Facts Table","definition":"A standardised label on packaged foods that shows the serving size and key nutrient content."},
      {"term":"% Daily Value","definition":"A percentage on a nutrition label showing how much of a nutrient one serving provides relative to the daily recommended amount."},
      {"term":"Dehydration","definition":"A condition in which the body does not have enough water to carry out normal functions."},
      {"term":"Recovery","definition":"The process after exercise during which the body repairs muscle tissue and replenishes energy stores."}
    ]'::jsonb,
    'The diets of traditional Saskatchewan Indigenous peoples were naturally optimised for active lives. Bison meat provided high-quality protein and iron. Berries supplied antioxidants and carbohydrates for energy. Fish from Saskatchewan''s many lakes offered essential omega-3 fatty acids. This whole-food diet, consumed close to the source, supported the extraordinary physical demands of prairie life.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What should you eat within 30 minutes after exercise?', 'A combination of protein and carbohydrates to repair muscle and replenish energy.', 'Recovery window.', 2, 0),
    (v_tenant, v_ch, 'When are sports drinks actually useful?', 'During intense exercise lasting more than 60 minutes, to replace electrolytes lost in sweat.', 'Not for most activities.', 2, 1),
    (v_tenant, v_ch, 'What does % Daily Value on a food label tell you?', 'How much of a nutrient one serving provides compared to the recommended daily amount.', '15% or more is a lot; 5% or less is a little.', 2, 2);

  -- Chapter 3: Mental Wellness
  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Mental Wellness', 'health-6-mental-wellness',
    'Build a comprehensive mental wellness toolkit, explore the stress response, and develop long-term habits that protect mental health.',
    '[
      {"type":"heading","level":1,"text":"Mental Wellness"},
      {"type":"text","content":"Mental wellness is not simply the absence of mental illness. It is an active, ongoing state of thriving that involves positive emotions, meaningful connections, a sense of purpose, and the ability to manage life''s inevitable difficulties. Building mental wellness is something everyone can work on every day."},
      {"type":"callout","style":"info","title":"The Stress Response","content":"When you face a threatening or challenging situation, your brain triggers the stress response, sometimes called fight-or-flight. Stress hormones like cortisol and adrenaline are released, making your heart beat faster, your breathing quicken, and your muscles tense. This response is designed for short-term threats. Chronic stress, the kind that does not turn off, can seriously damage physical and mental health over time."},
      {"type":"text","content":"Stress management involves two types of strategies. Problem-focused strategies address the source of the stress, such as studying before an exam or asking for help with a difficult assignment. Emotion-focused strategies help you manage your emotional response when the stressor cannot be changed, such as deep breathing, mindfulness, or talking to a trusted person. Using both types together is most effective."},
      {"type":"text","content":"Protective factors are things in your life that buffer you against mental health challenges. Strong protective factors include at least one caring adult relationship, a sense of belonging at school or in the community, positive coping skills, and a sense of meaning or purpose. Building protective factors is one of the most powerful things you can do for your long-term mental health."},
      {"type":"list","style":"unordered","items":["At least one caring, trusted adult relationship","A sense of belonging at school or in the community","Regular physical activity and adequate sleep","Positive coping strategies for stress","A sense of meaning, purpose, or contribution","Cultural identity and connection to community"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"The Medicine Wheel model of wellness naturally builds mental health protective factors. Cultural identity, community belonging, spiritual practices, and physical connection to the land are all protective factors that Indigenous wellness teachings have emphasised for generations. Research now confirms that cultural connectedness is one of the strongest protective factors against mental health challenges for Indigenous youth."},
      {"type":"quiz","question":"What is the difference between a problem-focused and an emotion-focused coping strategy?","options":["Problem-focused strategies are always better","Problem-focused strategies address the source of stress; emotion-focused strategies manage the emotional reaction to stress","Emotion-focused strategies solve the problem; problem-focused strategies manage feelings","There is no difference between them"],"correctIndex":1,"explanation":"Problem-focused coping targets the source of the stress (e.g., studying for an exam). Emotion-focused coping manages your emotional response when the stressor cannot be changed (e.g., deep breathing when anxious about something outside your control). Using both is most effective."}
    ]'::jsonb,
    '[
      {"term":"Mental Wellness","definition":"An active state of thriving that includes positive emotions, meaningful connections, purpose, and effective coping."},
      {"term":"Stress Response","definition":"The body''s automatic reaction to perceived threat, involving the release of hormones that increase heart rate and alertness."},
      {"term":"Cortisol","definition":"A hormone released during stress that helps the body respond to threats but is harmful in chronic excess."},
      {"term":"Protective Factor","definition":"A condition or quality in a person, relationship, or environment that buffers against mental health challenges."},
      {"term":"Mindfulness","definition":"The practice of paying full attention to the present moment without judgment."},
      {"term":"Coping Strategy","definition":"A thought or action used to manage the demands of a stressful situation."}
    ]'::jsonb,
    'Indigenous healing traditions in Saskatchewan have long recognised the connection between land, community, and mental wellness. Land-based healing programs, which take participants out of urban and institutional settings into natural environments for cultural learning and ceremony, are showing strong results in improving mental health outcomes for Indigenous youth. Connection to the land is itself a protective factor.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the stress response?', 'The body''s automatic reaction to perceived threat, involving hormones that increase heart rate and alertness.', 'Fight-or-flight.', 2, 0),
    (v_tenant, v_ch, 'Name two protective factors for mental health.', 'Caring adult relationships, belonging, physical activity, coping skills, sense of purpose, cultural identity (any two).', 'Things that shield you.', 2, 1),
    (v_tenant, v_ch, 'What is mindfulness?', 'Paying full attention to the present moment without judgment.', 'Being fully here, right now.', 2, 2);

  -- Chapter 4: Digital Health & Decision-Making
  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Digital Health & Decision-Making', 'health-6-digital-health-decision-making',
    'Examine the health effects of technology use, develop a decision-making framework, and practise applying it to real health scenarios.',
    '[
      {"type":"heading","level":1,"text":"Digital Health & Decision-Making"},
      {"type":"text","content":"Technology is woven into almost every part of modern life. Digital devices can help us learn, connect, create, and access important information. However, unexamined technology use can also harm our sleep, attention, relationships, and mental health. Being intentional about how and when you use technology is a key health skill for the 21st century."},
      {"type":"callout","style":"info","title":"How Technology Affects Sleep","content":"The blue light emitted by screens suppresses melatonin, a hormone that signals your body it is time to sleep. Using screens within an hour of bedtime can delay sleep onset, reduce sleep quality, and shorten total sleep time. Setting a digital curfew, putting devices away at least an hour before bed, is one of the most effective sleep hygiene strategies."},
      {"type":"text","content":"Social media platforms are designed by engineers to be as engaging as possible. Features like notifications, likes, and infinite scroll trigger the brain''s reward system, releasing small amounts of dopamine that make you want to keep scrolling. This design can create compulsive use patterns that are difficult to break. Understanding that these features are intentional design choices, not accidents, helps you use social media more deliberately."},
      {"type":"text","content":"A structured decision-making process helps when facing health choices that feel confusing or pressured. The DECIDE model is one useful framework: Define the problem, Explore your options, Consider consequences for each option, Identify your values and what matters most, Decide and act, and Evaluate the outcome afterward. Practising this model on small decisions builds the skill for larger ones."},
      {"type":"list","style":"unordered","items":["Define: What exactly is the decision I need to make?","Explore: What are all my possible options?","Consider: What are the likely consequences of each option?","Identify: What do my values tell me is most important here?","Decide: Which option best aligns with my values and goals?","Evaluate: How did it go? What would I do differently?"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"Traditional Indigenous decision-making often involved sitting with a question for a period of time, consulting Elders, and observing natural patterns before acting. This deliberate, reflective approach to decisions is in sharp contrast to the instant-reaction culture encouraged by social media. Incorporating elements of this reflective wisdom into digital life, including pausing before posting, and choosing thoughtfully rather than reacting impulsively, supports healthier online behaviour."},
      {"type":"quiz","question":"Why is using screens before bedtime harmful to sleep?","options":["Screens are too loud","Blue light from screens suppresses melatonin, making it harder to fall asleep","Screens make you too excited about playing games","Charging devices near your bed creates electromagnetic radiation"],"correctIndex":1,"explanation":"Blue light from screens interferes with the production of melatonin, the hormone that tells your brain it is time to sleep. This delays sleep onset and reduces sleep quality, which affects mood, attention, and health the next day."}
    ]'::jsonb,
    '[
      {"term":"Digital Health","definition":"The impact of technology and digital device use on physical, mental, and social wellbeing."},
      {"term":"Melatonin","definition":"A hormone produced by the brain that regulates sleep by signalling that it is time to rest."},
      {"term":"Blue Light","definition":"A type of light emitted by digital screens that suppresses melatonin and disrupts sleep."},
      {"term":"Dopamine","definition":"A brain chemical associated with pleasure and reward that can be triggered by social media notifications."},
      {"term":"DECIDE Model","definition":"A six-step decision-making framework: Define, Explore, Consider, Identify, Decide, Evaluate."},
      {"term":"Digital Curfew","definition":"A personal rule to put away digital devices at a set time before bed to protect sleep quality."}
    ]'::jsonb,
    'Many Indigenous communities across Saskatchewan are working to balance technological tools with cultural practices that ground young people in their identities and traditions. Digital storytelling projects that preserve Indigenous languages and oral histories show how technology can serve cultural wellness when used intentionally. The key is conscious choice, not rejection or uncritical acceptance.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a digital curfew?', 'A personal rule to put away devices at a set time before bed to protect sleep quality.', 'Screens off before sleep time.', 2, 0),
    (v_tenant, v_ch, 'What does the D in the DECIDE model stand for?', 'Define the problem or decision to be made.', 'First step in the framework.', 2, 1),
    (v_tenant, v_ch, 'Why are social media platforms designed to be addictive?', 'Features like notifications and likes trigger dopamine release, making users want to keep engaging.', 'Intentional design for engagement.', 2, 2);

END;
$$;


-- ============================================================================
-- TEXTBOOK 8: WolfWhale Health 7
-- Slug: wolfwhale-health-7
-- Chapters: Adolescent Development, Mental Health & Resilience,
--           Healthy Relationships, Substance Use & Misuse
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-health-7';

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Adolescent Health and Relationships',
    'Grade 7 students examine adolescent development, build mental health resilience, explore healthy relationships, and critically examine substance use.',
    'Healthy development during adolescence requires self-awareness, strong relationships, and informed choices.',
    'How do I develop a strong, healthy sense of self and build relationships that bring out the best in me?')
  RETURNING id INTO v_unit;

  -- Chapter 1: Adolescent Development
  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Adolescent Development', 'health-7-adolescent-development',
    'Examine the physical, cognitive, emotional, and social dimensions of adolescent development and understand the role of identity formation.',
    '[
      {"type":"heading","level":1,"text":"Adolescent Development"},
      {"type":"text","content":"Adolescence is one of the most dynamic periods of human development. Between roughly the ages of 10 and 20, your brain undergoes more change than at any other time since infancy. Your body, your thinking capacity, your emotional depth, and your understanding of who you are all transform profoundly. This transformation can feel exhilarating, confusing, and everything in between."},
      {"type":"callout","style":"info","title":"The Adolescent Brain","content":"The prefrontal cortex, the part of the brain responsible for planning, impulse control, and weighing consequences, is one of the last regions to fully mature, completing development around age 25. During adolescence, the brain''s reward centre is highly active, making exciting or risky experiences feel especially compelling. This is why adolescents sometimes take risks that seem obviously unwise to adults."},
      {"type":"text","content":"Erik Erikson, a developmental psychologist, described adolescence as the stage of identity versus role confusion. The central task is to answer the question: Who am I? This involves experimenting with different roles, values, beliefs, and social groups. This experimentation is healthy and necessary. Trying out different friend groups, interests, and ways of presenting yourself is how you build a coherent identity."},
      {"type":"text","content":"Cognitive development during adolescence brings the capacity for abstract thinking. Where younger children think concretely about what is, adolescents can think about what could be, hypothetical situations, and complex moral questions. This new capacity fuels the idealism that characterises adolescence, the sense that the world could and should be better, and the passion to make it so."},
      {"type":"list","style":"unordered","items":["Physical: puberty complete, brain still maturing until age 25","Cognitive: abstract thinking, hypothetical reasoning, moral complexity","Emotional: intense feelings, identity exploration, increased self-consciousness","Social: peer relationships become primary; family relationships renegotiated","Identity: experimenting with roles, values, and beliefs to build a sense of self"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"In Indigenous traditions across Saskatchewan, adolescence is recognised as a time of vision and becoming. Young people were historically given opportunities for solitary reflection, such as the vision quest, to seek guidance from the spirit world about their purpose and gifts. Community ceremonies celebrated their emerging identity and responsibilities. These practices affirmed that adolescent questioning and searching is sacred, not a problem to be managed."},
      {"type":"quiz","question":"Which part of the brain, responsible for impulse control and planning, is the last to fully mature during adolescence?","options":["Amygdala","Cerebellum","Prefrontal cortex","Brain stem"],"correctIndex":2,"explanation":"The prefrontal cortex controls planning, impulse regulation, and weighing consequences. It does not fully mature until around age 25, which partly explains why adolescents sometimes engage in riskier behaviour than adults."}
    ]'::jsonb,
    '[
      {"term":"Adolescence","definition":"The developmental stage between childhood and adulthood, roughly ages 10 to 20, characterised by puberty and identity formation."},
      {"term":"Prefrontal Cortex","definition":"The brain region responsible for planning, impulse control, and weighing consequences, which matures around age 25."},
      {"term":"Identity","definition":"A person''s sense of who they are, including their values, beliefs, roles, and how they relate to others."},
      {"term":"Abstract Thinking","definition":"The ability to reason about concepts and hypothetical situations that are not concrete or immediately present."},
      {"term":"Identity Formation","definition":"The process of developing a stable, coherent sense of self through experimentation with roles and values."},
      {"term":"Impulse Control","definition":"The ability to pause and think before acting on an immediate desire or emotion."}
    ]'::jsonb,
    'The vision quest, practised in various forms across many Saskatchewan First Nations, is an ancient coming-of-age practice that recognises adolescence as a time for spiritual seeking and identity discovery. Young people spent time alone on the land, fasting and praying, to receive guidance about their unique gifts and purpose in the community. This practice honoured adolescent searching as sacred rather than problematic.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the central developmental task of adolescence according to Erikson?', 'Identity formation: answering the question Who am I?', 'Experimenting to find yourself.', 3, 0),
    (v_tenant, v_ch, 'Why does the adolescent brain take more risks?', 'The reward centre is highly active while the prefrontal cortex (impulse control) is still maturing.', 'Reward system outpaces control system.', 3, 1),
    (v_tenant, v_ch, 'What is abstract thinking?', 'The ability to reason about hypothetical situations and complex concepts not immediately present.', 'Thinking about what could be.', 3, 2);

  -- Chapter 2: Mental Health & Resilience
  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Mental Health & Resilience', 'health-7-mental-health-resilience',
    'Deepen mental health literacy, understand common adolescent mental health conditions, build personal resilience, and reduce stigma.',
    '[
      {"type":"heading","level":1,"text":"Mental Health & Resilience"},
      {"type":"text","content":"Approximately one in five young people in Canada will experience a mental health condition before the age of 25. Mental health conditions are not character flaws or signs of weakness; they are medical conditions that arise from a complex interaction of genetic, biological, environmental, and social factors. Understanding this is the foundation of reducing stigma."},
      {"type":"callout","style":"info","title":"Common Adolescent Mental Health Conditions","content":"The most common mental health conditions affecting adolescents include anxiety disorders (affecting about 15% of youth), depressive disorders (affecting about 10%), attention deficit hyperactivity disorder (ADHD), eating disorders, and for older teens, early signs of more complex conditions. All of these conditions are treatable, and early intervention significantly improves outcomes."},
      {"type":"text","content":"Resilience is not a fixed trait you either have or do not have. It is a dynamic capacity built through experience, relationships, and deliberate practice. Research on resilience identifies several key contributors: at least one consistently supportive relationship with an adult, belief in your own ability to manage challenges (called self-efficacy), positive coping skills, a sense of belonging and meaning, and the ability to regulate emotions."},
      {"type":"text","content":"When a friend is struggling with their mental health, knowing how to respond matters. You do not need to be a therapist. Simply listening without judgment, expressing genuine concern, and gently encouraging them to talk to a trusted adult or professional are among the most helpful things you can do. Avoid minimising their experience with phrases like just cheer up or others have it worse."},
      {"type":"list","style":"unordered","items":["Listen without judgment or advice-giving","Express genuine concern: I care about you and I am worried","Avoid minimising: do not say just snap out of it","Encourage professional help without pressure","Check in again afterward","Know when to involve an adult: if your friend mentions self-harm or suicide, tell a trusted adult immediately"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"The talking circle, used in many Saskatchewan Indigenous communities for healing, creates a space where mental health struggles can be shared without shame. In the circle, everyone''s experience is held with equal respect. This communal approach to emotional health, where the community bears witness to individual struggle, is a powerful form of support that reduces the isolation that makes mental health conditions worse."},
      {"type":"quiz","question":"What is resilience?","options":["The ability to never experience hardship or stress","A fixed personality trait you are born with","A dynamic capacity built through supportive relationships, coping skills, and experience","The ability to feel no emotions when difficult things happen"],"correctIndex":2,"explanation":"Resilience is not about never struggling. It is a learnable capacity built through experience, relationships, and practice. Key ingredients include supportive relationships, self-efficacy, coping skills, and a sense of meaning and belonging."}
    ]'::jsonb,
    '[
      {"term":"Resilience","definition":"The dynamic capacity to adapt, recover, and even grow from adversity, built through relationships, skills, and experience."},
      {"term":"Stigma","definition":"Negative attitudes and discrimination directed at people with mental health conditions."},
      {"term":"Self-Efficacy","definition":"Belief in your own ability to manage challenges and achieve goals."},
      {"term":"Anxiety Disorder","definition":"A mental health condition characterised by persistent, intense anxiety that interferes with daily life."},
      {"term":"Depressive Disorder","definition":"A mental health condition characterised by persistent low mood, loss of interest, and related symptoms lasting more than two weeks."},
      {"term":"ADHD","definition":"Attention deficit hyperactivity disorder: a condition characterised by difficulty with attention, impulsivity, and (in some cases) hyperactivity."}
    ]'::jsonb,
    'Indigenous youth in Saskatchewan face disproportionate mental health challenges rooted in the ongoing impacts of colonisation, cultural disconnection, and systemic inequity. Culturally grounded resilience programs that incorporate traditional knowledge, Elders, ceremony, and land-based healing are among the most effective interventions. Cultural identity itself is a powerful protective factor against mental health challenges.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What fraction of Canadian youth experience a mental health condition before age 25?', 'Approximately one in five.', 'More common than many realise.', 3, 0),
    (v_tenant, v_ch, 'What is self-efficacy?', 'Belief in your own ability to manage challenges and achieve goals.', 'Confidence in your capacity.', 3, 1),
    (v_tenant, v_ch, 'What should you do if a friend mentions self-harm or suicide?', 'Tell a trusted adult immediately.', 'This requires adult involvement.', 3, 2);

  -- Chapter 3: Healthy Relationships
  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Healthy Relationships', 'health-7-healthy-relationships',
    'Distinguish healthy from unhealthy relationships, understand the spectrum of relationship abuse, develop communication skills, and explore consent.',
    '[
      {"type":"heading","level":1,"text":"Healthy Relationships"},
      {"type":"text","content":"Relationships are one of the most significant sources of both joy and pain in human life. Learning to recognise the qualities of healthy relationships, and the warning signs of unhealthy ones, is one of the most important health skills you will ever develop."},
      {"type":"callout","style":"info","title":"Qualities of a Healthy Relationship","content":"Healthy relationships, whether friendships or romantic relationships, are characterised by mutual respect, trust, open communication, support for each other''s independence, equality in decision-making, and the ability to resolve conflict respectfully. Both people feel safe to be themselves."},
      {"type":"text","content":"Unhealthy relationships exist on a spectrum. At one end are patterns like jealousy, possessiveness, or disrespect that erode wellbeing over time. At the more serious end are emotional abuse, controlling behaviour, and physical or sexual violence. Controlling behaviour can be subtle at first: a partner who wants to know where you are at all times, who isolates you from friends, or who makes you feel guilty for spending time with others."},
      {"type":"text","content":"Consent is a foundational concept in all healthy relationships. Consent means freely and enthusiastically agreeing to something. For any physical contact, consent must be: freely given (not coerced or pressured), reversible (you can change your mind at any time), informed (you know what you are agreeing to), enthusiastic (you want to do it), and specific (agreeing to one thing does not mean agreeing to everything)."},
      {"type":"list","style":"unordered","items":["Healthy: mutual respect, trust, open communication, equality, support for independence","Unhealthy warning signs: jealousy, possessiveness, isolation, disrespect, control","Abusive: emotional manipulation, threats, physical or sexual violence","Consent: freely given, reversible, informed, enthusiastic, and specific"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"Indigenous teachings about relationships are grounded in the concept of mutual respect and reciprocity. In healthy relationships, as in healthy ecosystems, each being contributes and receives in balance. The concept of wahkotowin in Cree culture, meaning the sacred law of relations, teaches that all relationships carry responsibilities. Relationships built on control and harm violate these sacred responsibilities."},
      {"type":"quiz","question":"Which of the following is a warning sign of an unhealthy relationship?","options":["Disagreeing about a movie choice","One person discouraging the other from spending time with their friends","Spending time with different friend groups","Expressing different opinions about school subjects"],"correctIndex":1,"explanation":"Isolation from friends and family is a recognised warning sign of a controlling relationship. Healthy relationships support each person''s connections and independence; unhealthy relationships seek to limit them."}
    ]'::jsonb,
    '[
      {"term":"Consent","definition":"Freely, enthusiastically, and specifically agreeing to something, with the ongoing ability to change your mind."},
      {"term":"Mutual Respect","definition":"Each person in a relationship valuing and honouring the other''s feelings, boundaries, and autonomy."},
      {"term":"Controlling Behaviour","definition":"Actions designed to limit another person''s freedom, independence, or relationships in order to maintain power over them."},
      {"term":"Emotional Abuse","definition":"A pattern of behaviour that uses emotional manipulation, criticism, or intimidation to control or demean another person."},
      {"term":"Reciprocity","definition":"A mutual exchange in which both parties contribute and receive in balance."},
      {"term":"Autonomy","definition":"The right and ability to make your own choices about your own life and body."}
    ]'::jsonb,
    'Many Indigenous communities in Saskatchewan are integrating traditional teachings about respectful relationships into contemporary relationship violence prevention programs. Concepts such as wahkotowin (sacred kinship) and the principle that harming another person harms the whole community create a powerful cultural foundation for healthy relationship education.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Name three qualities of a healthy relationship.', 'Mutual respect, trust, open communication, equality, support for independence (any three).', 'What makes you feel safe and valued.', 3, 0),
    (v_tenant, v_ch, 'What does the acronym FRIES stand for in consent?', 'Freely given, Reversible, Informed, Enthusiastic, Specific.', 'Five elements of real consent.', 3, 1),
    (v_tenant, v_ch, 'Name one warning sign of a controlling relationship.', 'Isolation from friends, jealousy, checking phone, making you feel guilty for time with others (any one).', 'Control hides as care.', 3, 2);

  -- Chapter 4: Substance Use & Misuse
  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Substance Use & Misuse', 'health-7-substance-use-misuse',
    'Examine the neurological basis of addiction, analyse short- and long-term effects of common substances, and develop personal harm-reduction strategies.',
    '[
      {"type":"heading","level":1,"text":"Substance Use & Misuse"},
      {"type":"text","content":"Substance use is a complex topic that requires honest, evidence-based information. Nearly every society in human history has used psychoactive substances, and completely avoiding any discussion of them does not keep young people safer. Understanding how substances work in the brain and body, and what the real short- and long-term risks are, supports genuinely informed decision-making."},
      {"type":"callout","style":"info","title":"How Addiction Works in the Brain","content":"Most drugs of misuse act on the brain''s reward system by flooding it with dopamine, a neurotransmitter associated with pleasure. This creates an intense feeling of pleasure far beyond anything natural rewards provide. With repeated use, the brain adapts by reducing its own dopamine sensitivity. This means the person needs more of the substance to feel the same effect (tolerance) and feels terrible without it (withdrawal), which is the neurological basis of addiction."},
      {"type":"text","content":"Alcohol is one of the most widely used and misused substances in Canada. It is a depressant, meaning it slows the central nervous system. At low doses, alcohol lowers inhibitions and creates a relaxed feeling. At higher doses, it impairs judgment, coordination, and speech. At very high doses, it can cause unconsciousness, alcohol poisoning, and death. Long-term heavy use damages the liver, brain, heart, and increases cancer risk."},
      {"type":"text","content":"Cannabis affects the brain through compounds called cannabinoids, which bind to receptors throughout the brain and body. For the developing adolescent brain, regular cannabis use is associated with impaired memory, reduced motivation, increased risk of anxiety and psychosis, and lower academic achievement. The younger a person begins using cannabis, the greater the risk of long-term harm."},
      {"type":"list","style":"unordered","items":["Alcohol: depressant; impairs judgment; liver damage with long-term use","Cannabis: impairs memory and motivation; psychosis risk; especially harmful to developing brains","Tobacco and nicotine: highly addictive; lung and heart disease","Opioids: powerful pain relief; high addiction potential; overdose risk","Stimulants (cocaine, crystal meth): intense highs followed by crashes; severe addiction","Fentanyl: extremely potent opioid found in the illicit drug supply; tiny amounts can be lethal"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"The distinction between sacred plant medicines and substances of misuse is important in Indigenous traditions. Ceremonial plant use was always conducted within strict protocols, under Elder guidance, with spiritual intention. The contrast between this reverent, bounded use and recreational substance misuse reflects the broader Indigenous teaching that all gifts from the earth must be used with respect, knowledge, and proper ceremony."},
      {"type":"quiz","question":"What happens to the brain''s dopamine system with repeated use of drugs of misuse?","options":["It becomes more sensitive to dopamine over time","It produces more dopamine than usual","It becomes less sensitive to dopamine, requiring more substance to achieve the same effect (tolerance)","It permanently increases pleasure from all activities"],"correctIndex":2,"explanation":"With repeated substance exposure, the brain adapts by reducing its dopamine sensitivity. This creates tolerance, meaning more of the substance is needed for the same effect, and withdrawal symptoms when the substance is not present. This neurological adaptation is the basis of physical addiction."}
    ]'::jsonb,
    '[
      {"term":"Addiction","definition":"A chronic condition characterised by compulsive substance use despite harmful consequences, driven by neurological changes in the brain''s reward system."},
      {"term":"Tolerance","definition":"The need for increasing amounts of a substance to achieve the same effect, resulting from the brain''s adaptation to repeated exposure."},
      {"term":"Withdrawal","definition":"The unpleasant physical and psychological symptoms that occur when someone dependent on a substance stops using it."},
      {"term":"Dopamine","definition":"A neurotransmitter associated with pleasure and reward that is manipulated by most drugs of misuse."},
      {"term":"Depressant","definition":"A substance that slows the activity of the central nervous system."},
      {"term":"Harm Reduction","definition":"A public health approach that seeks to minimise the negative consequences of substance use without requiring abstinence."}
    ]'::jsonb,
    'Substance misuse in many Indigenous communities in Saskatchewan is understood as a symptom of unhealed historical trauma rather than a moral failing. Healing-centred approaches that honour cultural identity, restore connection to community and land, and address the root causes of trauma are showing stronger outcomes than punitive or abstinence-only approaches. Understanding this context builds compassion and dismantles harmful stereotypes.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is tolerance in the context of substance use?', 'The need for increasing amounts of a substance to achieve the same effect, as the brain adapts.', 'More needed for same effect.', 3, 0),
    (v_tenant, v_ch, 'Why is cannabis particularly harmful to adolescent brains?', 'The brain is still developing until age 25 and cannabis impairs memory, motivation, and increases psychosis risk.', 'Critical development window.', 3, 1),
    (v_tenant, v_ch, 'What neurotransmitter do most drugs of misuse target?', 'Dopamine, the brain''s reward chemical.', 'Pleasure and reward system.', 3, 2);

END;
$$;


-- ============================================================================
-- TEXTBOOK 9: WolfWhale Health 8
-- Slug: wolfwhale-health-8
-- Chapters: Identity & Self-Concept, Sexual Health & Consent,
--           Stress & Addictions, Health Equity & Justice
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-health-8';

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Identity, Sexuality, and Health Justice',
    'Grade 8 students explore identity and self-concept, sexual health and consent, addictions and stress, and the social determinants of health.',
    'Health is shaped by who we are, how we are treated, and the conditions in which we live.',
    'How do identity, relationships, and social conditions shape our health, and what can I do about it?')
  RETURNING id INTO v_unit;

  -- Chapter 1: Identity & Self-Concept
  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Identity & Self-Concept', 'health-8-identity-self-concept',
    'Examine the multiple dimensions of identity, explore gender and sexual orientation, and build a positive and resilient self-concept.',
    '[
      {"type":"heading","level":1,"text":"Identity & Self-Concept"},
      {"type":"text","content":"Identity is not a single thing. It is a complex mosaic of many dimensions, including your cultural background, family, gender, sexual orientation, values, interests, abilities, religion or spirituality, and the roles you play in different relationships. All of these dimensions interact and evolve throughout your life."},
      {"type":"callout","style":"info","title":"Dimensions of Identity","content":"Identity includes both personal identity, the unique individual you are, and social identity, the groups you belong to. Social identities such as ethnicity, gender, and class can be sources of both pride and discrimination. Understanding your multiple identities helps you understand your own experience and empathise with others whose identities differ from yours."},
      {"type":"text","content":"Gender identity refers to a person''s internal sense of their own gender. For most people, gender identity aligns with the sex they were assigned at birth (cisgender). For some people, it does not (transgender). Gender is distinct from biological sex and from gender expression, which is how a person outwardly presents through clothing, behaviour, and appearance. All of these can exist independently of each other."},
      {"type":"text","content":"Sexual orientation describes the pattern of emotional, romantic, or sexual attraction a person experiences. Most people are primarily attracted to people of a different gender (heterosexual). Some are primarily attracted to people of the same gender (gay or lesbian). Some are attracted to people of more than one gender (bisexual or pansexual). Some experience little to no sexual attraction (asexual). All sexual orientations are natural variations of human experience."},
      {"type":"list","style":"unordered","items":["Gender identity: your internal sense of your own gender","Biological sex: physical characteristics assigned at birth","Gender expression: how you outwardly present through clothing and behaviour","Sexual orientation: the pattern of who you are emotionally and romantically attracted to","All of these dimensions can exist independently of each other"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"Many Indigenous cultures across North America have long recognised more than two genders. Two-Spirit people, who embody both masculine and feminine spiritual gifts, held honoured roles in many communities as healers, mediators, and ceremony keepers. Colonisation suppressed these traditions and imposed binary gender norms. The resurgence of Two-Spirit identity is part of a broader Indigenous cultural reclamation."},
      {"type":"quiz","question":"What is the difference between gender identity, gender expression, and sexual orientation?","options":["They all mean the same thing","Gender identity is your internal sense of your gender; gender expression is how you outwardly present; sexual orientation is who you are attracted to","Sexual orientation determines your gender identity","Gender expression determines your sexual orientation"],"correctIndex":1,"explanation":"These three aspects of identity are distinct and independent. Your internal sense of your gender (identity), how you choose to express it outwardly (expression), and who you feel attraction toward (orientation) do not necessarily predict or determine each other."}
    ]'::jsonb,
    '[
      {"term":"Identity","definition":"The multidimensional sense of who a person is, including personal, cultural, gender, and other social dimensions."},
      {"term":"Gender Identity","definition":"A person''s internal, deeply felt sense of their own gender."},
      {"term":"Sexual Orientation","definition":"The pattern of a person''s emotional, romantic, and sexual attraction to others."},
      {"term":"Cisgender","definition":"A person whose gender identity aligns with the sex they were assigned at birth."},
      {"term":"Transgender","definition":"A person whose gender identity differs from the sex they were assigned at birth."},
      {"term":"Two-Spirit","definition":"An Indigenous term for people who fulfil a traditional third-gender or other gender-variant role, embodying both masculine and feminine spiritual gifts."}
    ]'::jsonb,
    'Two-Spirit identities are an important and historically honoured aspect of many Indigenous cultures in Saskatchewan. Individuals who embodied both masculine and feminine qualities were often seen as spiritually gifted and held special roles in community life. The colonial suppression of Two-Spirit identities caused significant harm. Reclaiming and celebrating these identities is an act of healing and cultural sovereignty.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is gender identity?', 'A person''s internal, deeply felt sense of their own gender.', 'Internal, not external.', 3, 0),
    (v_tenant, v_ch, 'What does Two-Spirit mean?', 'An Indigenous term for people who embody both masculine and feminine spiritual gifts and traditionally held honoured roles in their communities.', 'Rooted in Indigenous tradition.', 3, 1),
    (v_tenant, v_ch, 'Are gender identity, gender expression, and sexual orientation the same thing?', 'No, they are three distinct and independent dimensions of identity.', 'They can each be different.', 3, 2);

  -- Chapter 2: Sexual Health & Consent
  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Sexual Health & Consent', 'health-8-sexual-health-consent',
    'Understand sexual health as a dimension of overall wellness, examine consent and healthy sexual relationships, and explore STI prevention and pregnancy.',
    '[
      {"type":"heading","level":1,"text":"Sexual Health & Consent"},
      {"type":"text","content":"Sexual health is a positive and integral part of overall human health. The World Health Organization defines sexual health as a state of physical, emotional, mental, and social wellbeing in relation to sexuality, not merely the absence of disease or dysfunction. A sexually healthy person makes informed choices, communicates openly with partners, and maintains relationships free of coercion and harm."},
      {"type":"callout","style":"info","title":"What Is Sexual Health?","content":"Sexual health includes understanding your body and its changes, developing a positive relationship with your sexuality, making informed decisions about sexual activity, preventing unwanted pregnancy and sexually transmitted infections (STIs), and building sexual relationships based on respect, communication, and consent."},
      {"type":"text","content":"Consent in sexual activity must be enthusiastic, ongoing, and freely given by all people involved. Consent cannot be given by someone who is drunk or high, asleep, or under the legal age of consent. In Canada, the age of consent for sexual activity is generally 16, with close-in-age provisions that allow consensual activity between peers close in age. A person can withdraw consent at any time, and this must be respected immediately and without pressure."},
      {"type":"text","content":"Sexually transmitted infections (STIs) are infections passed from person to person through sexual contact. Common STIs include chlamydia, gonorrhea, herpes, and HIV. Many STIs have no obvious symptoms, which is why regular testing is important for sexually active people. Most STIs are treatable, and some are curable. Using barrier methods such as condoms consistently and correctly significantly reduces the risk of transmission."},
      {"type":"list","style":"unordered","items":["Consent must be: freely given, reversible, informed, enthusiastic, and specific (FRIES)","Age of consent in Canada is generally 16 (close-in-age exceptions exist)","Condoms reduce risk of both STIs and unintended pregnancy when used correctly and consistently","Many STIs show no symptoms; regular testing is important for sexually active people","Pregnancy can result from unprotected vaginal intercourse; multiple prevention methods exist"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"Traditional Indigenous teachings about sexuality were grounded in respect for the body as sacred, the importance of relationships built on mutual responsibility, and the understanding that sexuality is connected to the continuation of the community and the honouring of life. These teachings were disrupted by colonisation and the residential school system. Restoring Indigenous sexual health education means recovering these teachings alongside providing medically accurate information."},
      {"type":"quiz","question":"Under Canadian law, what is the general age of consent for sexual activity?","options":["14","16","18","21"],"correctIndex":1,"explanation":"The general age of consent for sexual activity in Canada is 16. However, close-in-age provisions allow consensual sexual activity between teens who are 14-15 and partners who are less than 5 years older, and between teens 12-13 and partners less than 2 years older."}
    ]'::jsonb,
    '[
      {"term":"Sexual Health","definition":"A state of physical, emotional, mental, and social wellbeing in relation to sexuality."},
      {"term":"Consent","definition":"Freely, enthusiastically, and specifically agreeing to sexual activity, with the ongoing ability to change your mind."},
      {"term":"STI","definition":"Sexually transmitted infection: an infection passed from person to person through sexual contact."},
      {"term":"Age of Consent","definition":"The minimum age at which a person is considered legally able to consent to sexual activity."},
      {"term":"Condom","definition":"A barrier contraceptive device that reduces the risk of STI transmission and unintended pregnancy when used correctly."},
      {"term":"Abstinence","definition":"Choosing not to engage in sexual activity."}
    ]'::jsonb,
    'Sexual health education within Indigenous communities in Saskatchewan must address the legacy of sexual violence perpetrated through the residential school system and other colonial institutions. Trauma-informed, culturally grounded sexual health education is essential for healing and for restoring the traditional understanding of sexuality as sacred, relational, and life-affirming.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does FRIES stand for in consent?', 'Freely given, Reversible, Informed, Enthusiastic, Specific.', 'Five elements of real consent.', 3, 0),
    (v_tenant, v_ch, 'What is the general age of consent in Canada?', '16 years old (with close-in-age provisions for younger teens).', 'Legal protection for young people.', 3, 1),
    (v_tenant, v_ch, 'Why is regular STI testing important for sexually active people?', 'Many STIs have no obvious symptoms, so testing is the only way to know your status.', 'No symptoms does not mean no infection.', 3, 2);

  -- Chapter 3: Stress & Addictions
  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Stress & Addictions', 'health-8-stress-addictions',
    'Examine chronic stress and its health impacts, understand the addiction cycle, explore behavioural addictions, and develop a personal stress management plan.',
    '[
      {"type":"heading","level":1,"text":"Stress & Addictions"},
      {"type":"text","content":"Stress and addiction are two of the most significant health challenges facing young people today. They are also deeply connected. Unmanaged chronic stress is one of the strongest risk factors for developing an addiction, because substances and addictive behaviours can temporarily relieve stress while ultimately making it worse."},
      {"type":"callout","style":"info","title":"Chronic Stress and the Body","content":"When stress becomes chronic, the constant presence of cortisol and other stress hormones damages the body. Chronic stress is linked to cardiovascular disease, immune suppression, digestive problems, insomnia, depression, anxiety, and accelerated ageing. Managing stress effectively is not just good for your mental health; it is essential for physical health."},
      {"type":"text","content":"Addiction exists on a spectrum. At one end is experimentation or recreational use. Moving along the spectrum is problematic use, where the substance or behaviour begins to negatively affect daily life. Further along is dependence, where the brain has adapted and the person needs the substance to feel normal. At the far end is severe addiction, a chronic, relapsing condition that requires professional treatment."},
      {"type":"text","content":"Behavioural addictions involve compulsive engagement with a behaviour, not a substance, despite negative consequences. Gaming disorder, gambling disorder, and compulsive social media use are recognised behavioural addictions. The neurological mechanism is similar to substance addiction: the reward system becomes sensitised to the intense stimulation of the addictive behaviour and increasingly disinterested in ordinary pleasures."},
      {"type":"list","style":"unordered","items":["Chronic stress: constant cortisol; damages cardiovascular, immune, and digestive systems","The addiction cycle: reward, craving, use, temporary relief, withdrawal, craving again","Risk factors: genetics, early trauma, untreated mental health conditions, social environment","Protective factors: strong relationships, coping skills, sense of purpose, cultural connection","Behavioural addictions: gaming, gambling, social media can all become addictive","Recovery: is possible with the right support; relapse is part of, not the end of, recovery"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"In Indigenous healing traditions, addiction is understood not as a moral failure but as a spiritual, emotional, physical, and mental wound requiring healing in all four dimensions. Healing practices that incorporate ceremony, Elder guidance, community support, and reconnection with cultural identity address addiction at its roots rather than simply addressing symptoms. The Medicine Wheel itself serves as a framework for comprehensive recovery."},
      {"type":"quiz","question":"What is the relationship between chronic stress and addiction?","options":["They are completely unrelated","Chronic stress is a strong risk factor for addiction because substances and addictive behaviours can temporarily relieve stress","Addiction always causes chronic stress but not the other way around","Stress only matters after addiction has already developed"],"correctIndex":1,"explanation":"Unmanaged chronic stress significantly increases the risk of developing an addiction. People often turn to substances or addictive behaviours for temporary stress relief, which can escalate into dependence if the underlying stress is not addressed."}
    ]'::jsonb,
    '[
      {"term":"Chronic Stress","definition":"Persistent, long-term stress that continues over weeks or months and causes physical and mental health damage."},
      {"term":"Cortisol","definition":"The body''s primary stress hormone, released in response to perceived threat; harmful in chronic excess."},
      {"term":"Addiction Cycle","definition":"The repeating pattern of craving, use, temporary relief, and withdrawal that characterises addiction."},
      {"term":"Dependence","definition":"A state in which the brain has adapted to a substance or behaviour and requires it to function normally."},
      {"term":"Behavioural Addiction","definition":"Compulsive engagement with a behaviour (such as gaming or gambling) despite negative consequences."},
      {"term":"Recovery","definition":"The ongoing process of managing addiction, building healthier habits, and rebuilding a fulfilling life."}
    ]'::jsonb,
    'The connection between historical trauma, chronic stress, and substance misuse in many Indigenous communities is well-documented. Residential school survivors and their descendants often carry intergenerational trauma that manifests as chronic stress, which increases vulnerability to addiction. Healing-centred, trauma-informed, and culturally grounded approaches are essential for effective support.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Name two physical health effects of chronic stress.', 'Cardiovascular disease, immune suppression, digestive problems, insomnia (any two).', 'Stress harms the whole body.', 3, 0),
    (v_tenant, v_ch, 'What is a behavioural addiction?', 'Compulsive engagement with a behaviour, not a substance, despite negative consequences.', 'Actions can be addictive too.', 3, 1),
    (v_tenant, v_ch, 'Is relapse a sign that recovery has failed?', 'No, relapse is often part of the recovery process, not the end of it.', 'Recovery is rarely a straight line.', 3, 2);

  -- Chapter 4: Health Equity & Justice
  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Health Equity & Justice', 'health-8-health-equity-justice',
    'Examine the social determinants of health, understand how inequity affects health outcomes, and explore actions individuals and communities can take toward health justice.',
    '[
      {"type":"heading","level":1,"text":"Health Equity & Justice"},
      {"type":"text","content":"Not everyone has an equal opportunity to be healthy. The conditions in which people are born, grow, live, work, and age, known as the social determinants of health, profoundly shape health outcomes. These conditions are largely shaped by the distribution of power, money, and resources in society."},
      {"type":"callout","style":"info","title":"Social Determinants of Health","content":"The social determinants of health include income and economic stability, education, employment, housing, food security, access to healthcare, social support networks, neighbourhood safety, discrimination, and early childhood development. People living in disadvantaged conditions across multiple determinants face dramatically higher rates of physical and mental illness, regardless of individual lifestyle choices."},
      {"type":"text","content":"Health equity means that everyone has a fair and just opportunity to be as healthy as possible. This requires removing obstacles that arise from social conditions, not from individual behaviour. Health equity is not the same as health equality. Equality means giving everyone the same thing; equity means giving people what they specifically need to achieve the same outcome."},
      {"type":"text","content":"Health inequities are not accidental. They result from historical and ongoing policies, systems, and structures that advantage some groups while disadvantaging others. In Canada, Indigenous peoples experience some of the largest health gaps of any group, directly resulting from colonisation, residential schools, the Sixties Scoop, and ongoing systemic discrimination in healthcare, housing, and employment."},
      {"type":"list","style":"unordered","items":["Social determinants: income, education, housing, food security, healthcare access, discrimination","Health equity: the fair opportunity for everyone to be as healthy as possible","Health inequality vs. health inequity: one is a difference; the other is an unjust difference","Systemic racism: when institutions and policies produce discriminatory outcomes regardless of individual intent","Advocacy: speaking up for policies and changes that address the root causes of health inequity"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"The concept of health justice aligns deeply with Indigenous values of balance, reciprocity, and community responsibility. In a healthy community, no member is left without what they need to flourish. When community members advocate for housing, clean water, food security, and equitable healthcare, they are enacting the Medicine Wheel teaching that the whole circle must be in balance for any part of it to be well."},
      {"type":"quiz","question":"What is the difference between health equality and health equity?","options":["They mean exactly the same thing","Equality means giving everyone the same thing; equity means giving each person what they need to achieve the same outcome","Equity means everyone gets exactly the same resources","Equality is better than equity in all situations"],"correctIndex":1,"explanation":"Equality gives everyone the same resources regardless of need, which often maintains inequity. Equity recognises that people have different starting points and needs, and provides differentiated support to enable comparable outcomes. Health equity requires addressing the conditions that create health disadvantage."}
    ]'::jsonb,
    '[
      {"term":"Social Determinants of Health","definition":"The conditions in which people are born, grow, live, work, and age that profoundly shape health outcomes."},
      {"term":"Health Equity","definition":"The fair and just opportunity for everyone to achieve their full health potential."},
      {"term":"Health Inequity","definition":"An unjust and avoidable difference in health outcomes between groups, arising from social conditions."},
      {"term":"Systemic Racism","definition":"Policies and institutional practices that produce discriminatory outcomes for racialised groups, regardless of individual intent."},
      {"term":"Food Security","definition":"Having reliable access to enough affordable, nutritious food."},
      {"term":"Advocacy","definition":"Taking action to support or argue for a cause, policy, or group of people."}
    ]'::jsonb,
    'Indigenous communities in Saskatchewan continue to face serious health inequities rooted in colonisation. Many First Nations communities lack access to clean drinking water, adequate housing, and culturally safe healthcare. Life expectancy gaps between Indigenous and non-Indigenous Canadians are significant and are the direct result of policy choices, not individual behaviour. Understanding this history is the foundation of health justice.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Name four social determinants of health.', 'Income, education, housing, food security, healthcare access, employment, discrimination (any four).', 'Conditions, not choices.', 3, 0),
    (v_tenant, v_ch, 'What is the difference between health equality and health equity?', 'Equality: same for everyone. Equity: what each person needs to achieve the same outcome.', 'Same ≠ fair.', 3, 1),
    (v_tenant, v_ch, 'What is systemic racism?', 'Policies and institutional practices that produce discriminatory outcomes, regardless of individual intent.', 'Embedded in systems, not just people.', 3, 2);

END;
$$;


-- ============================================================================
-- TEXTBOOK 10: WolfWhale Health 9
-- Slug: wolfwhale-health-9
-- Chapters: Comprehensive Sexual Health, Mental Illness Awareness,
--           Relationships & Consent, Community Wellness Advocacy
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-health-9';

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Health, Justice, and Advocacy',
    'Grade 9 students engage with comprehensive sexual health, mental illness literacy, relationship ethics, and community wellness advocacy.',
    'Informed, compassionate, and engaged citizens make communities healthier for everyone.',
    'How can my knowledge, values, and actions contribute to the health and wellbeing of my community?')
  RETURNING id INTO v_unit;

  -- Chapter 1: Comprehensive Sexual Health
  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Comprehensive Sexual Health', 'health-9-comprehensive-sexual-health',
    'Integrate all aspects of sexual health including contraception, STI prevention and treatment, healthy sexual decision-making, and affirming diverse sexualities.',
    '[
      {"type":"heading","level":1,"text":"Comprehensive Sexual Health"},
      {"type":"text","content":"Comprehensive sexual health education is grounded in the understanding that sexuality is a normal, positive dimension of being human. It aims to provide young people with accurate, complete, and developmentally appropriate information that enables them to make informed decisions, maintain their health, and build respectful relationships throughout their lives."},
      {"type":"callout","style":"info","title":"The Spectrum of Contraception","content":"Contraception refers to methods used to prevent unintended pregnancy. Methods vary in effectiveness, mechanism, and characteristics. Barrier methods (condoms, diaphragms) physically block sperm. Hormonal methods (pills, patches, injections, implants) prevent ovulation or implantation. Intrauterine devices (IUDs) are placed inside the uterus. Emergency contraception prevents pregnancy after unprotected sex. Only barrier methods also protect against STIs."},
      {"type":"text","content":"Sexually transmitted infections require accurate information for effective prevention. HIV (human immunodeficiency virus) attacks the immune system and, without treatment, can progress to AIDS. Modern antiretroviral therapy allows people with HIV to live long, healthy lives with an undetectable viral load, which also means they cannot transmit HIV to others (U=U: Undetectable = Untransmittable). HPV (human papillomavirus) is the most common STI and can cause genital warts and some cancers; a vaccine provides strong protection. Chlamydia and gonorrhea are bacterial infections that are curable with antibiotics."},
      {"type":"text","content":"Affirming diverse sexual orientations and gender identities in sexual health education means recognising that LGBTQ+ people have the same rights to accurate information, respectful healthcare, and healthy relationships as anyone else. Inclusive sexual health education reduces health disparities experienced by LGBTQ+ youth, including higher rates of depression, anxiety, and substance use linked to discrimination and family rejection, not to their orientation or identity."},
      {"type":"list","style":"unordered","items":["Abstinence: the only 100% effective method for preventing STIs and pregnancy","Condoms: 85-98% effective for pregnancy prevention when used correctly; also reduces STI risk","Combined oral contraceptive pill: up to 99% effective for pregnancy prevention when taken consistently","Long-acting reversible contraceptives (IUDs, implants): over 99% effective","Emergency contraception: reduces pregnancy risk when taken within 72 to 120 hours after unprotected sex","HIV: manageable with treatment; U=U means an undetectable person cannot transmit HIV"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"Traditional Indigenous teachings about sexuality in Saskatchewan included education about the sacred responsibilities of intimate relationships, the connection between sexuality and the continuation of the community, and the spiritual dimensions of physical intimacy. This education was delivered by Elders and knowledge keepers in culturally safe, relationship-based contexts. Restoring these teachings alongside medically accurate information creates the most complete sexual health education."},
      {"type":"quiz","question":"Which contraceptive method is the only one that also provides significant protection against sexually transmitted infections?","options":["The birth control pill","An intrauterine device (IUD)","A condom","The birth control patch"],"correctIndex":2,"explanation":"Condoms (both external and internal) are the only commonly available contraceptive methods that provide significant protection against STI transmission, in addition to reducing the risk of unintended pregnancy. All other hormonal and IUD methods prevent pregnancy but do not protect against STIs."}
    ]'::jsonb,
    '[
      {"term":"Contraception","definition":"Methods used to prevent unintended pregnancy."},
      {"term":"Barrier Method","definition":"A contraceptive that physically blocks sperm from reaching the egg, such as a condom."},
      {"term":"Hormonal Contraception","definition":"Methods that use synthetic hormones to prevent ovulation or implantation."},
      {"term":"HIV","definition":"Human immunodeficiency virus; a virus that attacks the immune system, manageable with modern antiretroviral therapy."},
      {"term":"HPV","definition":"Human papillomavirus; the most common STI, preventable with a vaccine."},
      {"term":"U=U","definition":"Undetectable equals Untransmittable; a person with HIV on effective treatment who has an undetectable viral load cannot sexually transmit HIV."}
    ]'::jsonb,
    'Reclaiming Indigenous sexual health education means restoring teachings that were suppressed by colonisation. Many Saskatchewan First Nations communities are developing culturally grounded sexual health curricula that integrate traditional values about the sacredness of the body and relationships with medically accurate, inclusive information. These programs are led by Indigenous educators and knowledge keepers and are showing strong outcomes.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Which contraceptive method also protects against STIs?', 'Condoms (external and internal).', 'The only barrier that stops both.', 3, 0),
    (v_tenant, v_ch, 'What does U=U mean in the context of HIV?', 'Undetectable = Untransmittable: a person with HIV on effective treatment with undetectable viral load cannot transmit HIV sexually.', 'Modern treatment is transformative.', 3, 1),
    (v_tenant, v_ch, 'What STI does the HPV vaccine protect against?', 'Human papillomavirus (HPV), which can cause genital warts and some cancers.', 'A vaccine for a virus.', 3, 2);

  -- Chapter 2: Mental Illness Awareness
  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Mental Illness Awareness', 'health-9-mental-illness-awareness',
    'Build comprehensive mental illness literacy, understand diagnosis and treatment, confront stigma, and develop skills for supporting others in crisis.',
    '[
      {"type":"heading","level":1,"text":"Mental Illness Awareness"},
      {"type":"text","content":"Mental illnesses are medical conditions that significantly affect how a person thinks, feels, behaves, and relates to others. Like physical illnesses, they have biological, psychological, and social causes. They exist on a spectrum of severity, respond to treatment, and are not the result of personal weakness or poor character. In Canada, mental illness affects one in five people in any given year."},
      {"type":"callout","style":"info","title":"Understanding Diagnosis","content":"Mental health conditions are diagnosed by qualified professionals using criteria from the Diagnostic and Statistical Manual of Mental Disorders (DSM) or the International Classification of Diseases (ICD). A diagnosis provides a framework for understanding symptoms and accessing appropriate treatment. It does not define the whole person or predict their future. Many people with mental illness live full, productive, and meaningful lives with appropriate support."},
      {"type":"text","content":"Treatment for mental illness is most effective when it is individualised and may include a combination of approaches. Psychotherapy, particularly cognitive behavioural therapy (CBT), helps people identify and change unhelpful thought patterns and behaviours. Medication can help manage symptoms for conditions including depression, anxiety, bipolar disorder, and schizophrenia. Lifestyle factors including sleep, exercise, nutrition, and social connection significantly affect mental health and recovery. Peer support and community connection are also powerful elements of recovery."},
      {"type":"text","content":"Suicide is a serious and preventable public health issue. In Canada, suicide is the second leading cause of death among young people aged 15 to 34. Risk factors include untreated mental illness, previous attempts, substance misuse, social isolation, and access to means. Protective factors include strong social support, access to mental health care, reasons for living, and connectedness to community and culture. If you are concerned about someone, asking them directly if they are thinking about suicide does not plant the idea; it opens the door for them to get help."},
      {"type":"list","style":"unordered","items":["Warning signs of mental health crisis: talking about wanting to die, giving away possessions, withdrawing completely, dramatic mood changes, expressing hopelessness","What to do: listen without judgment, express care directly, ask directly about suicidal thoughts, stay with the person if possible, connect them to help immediately","Crisis resources in Saskatchewan: 9-8-8 (Suicide Crisis Helpline, available 24/7); Crisis lines in Saskatoon and Regina are available by phone","Do not promise to keep suicidal thoughts a secret; getting help is more important"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"Suicide prevention in Indigenous communities in Saskatchewan requires addressing the root causes of despair: unresolved trauma, disconnection from culture and community, and the ongoing impacts of colonisation. Cultural continuity, including the presence of a functioning traditional language, ceremonies, land-based practices, and Elder connection, has been identified by researchers as one of the strongest protective factors against youth suicide in Indigenous communities. Culture is medicine."},
      {"type":"quiz","question":"If you are worried that a friend may be thinking about suicide, what is the most important first step?","options":["Avoid the topic so you do not make things worse","Ask them directly if they are thinking about suicide","Tell their parents without talking to your friend first","Distract them with fun activities and hope they feel better"],"correctIndex":1,"explanation":"Asking directly about suicide does not increase risk; research consistently shows it opens a crucial door for help. A direct, caring question such as I''m worried about you. Are you thinking about hurting yourself? shows that you take their pain seriously and creates an opportunity to connect them with support."}
    ]'::jsonb,
    '[
      {"term":"Mental Illness","definition":"A medical condition that significantly affects thinking, feeling, behaviour, and functioning, with biological, psychological, and social contributors."},
      {"term":"Cognitive Behavioural Therapy","definition":"A psychotherapy approach that helps people identify and change unhelpful patterns of thought and behaviour."},
      {"term":"Psychotherapy","definition":"A range of talking therapies that help people understand and change thoughts, feelings, and behaviours."},
      {"term":"Suicide","definition":"The act of intentionally ending one''s own life, often associated with untreated mental illness and extreme psychological pain."},
      {"term":"Risk Factor","definition":"A condition or experience that increases the likelihood of a negative health outcome."},
      {"term":"Protective Factor","definition":"A condition or quality that reduces the likelihood of a negative health outcome."}
    ]'::jsonb,
    'Indigenous youth in Saskatchewan face disproportionately high rates of suicide, a direct consequence of colonisation, intergenerational trauma, and systemic inequity. Research by Dr. Michael Chandler and colleagues found that communities with greater cultural continuity, including self-government, land title, education control, and active cultural facilities, had dramatically lower youth suicide rates. This finding underscores that culture is a critical determinant of mental health.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Name two effective treatments for mental illness.', 'Psychotherapy (e.g., CBT), medication, lifestyle changes, peer support (any two).', 'Often most effective in combination.', 3, 0),
    (v_tenant, v_ch, 'Does asking someone if they are thinking about suicide increase the risk?', 'No, research shows it opens a door for help and does not increase risk.', 'Ask directly; it shows you care.', 3, 1),
    (v_tenant, v_ch, 'What is the 9-8-8 number in Canada?', 'The national Suicide Crisis Helpline, available 24/7.', 'Three digits for immediate help.', 3, 2);

  -- Chapter 3: Relationships & Consent
  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Relationships & Consent', 'health-9-relationships-consent',
    'Examine relationship dynamics with depth and nuance, understand sexual coercion and assault, explore the legal framework around consent, and build skills for healthy sexual communication.',
    '[
      {"type":"heading","level":1,"text":"Relationships & Consent"},
      {"type":"text","content":"As young people move through adolescence and into adulthood, romantic and sexual relationships become increasingly significant. These relationships have the potential to be profound sources of joy, growth, and connection. They can also cause serious harm when they are not grounded in genuine respect, honesty, and consent. Understanding the difference, and having the skills to act on that understanding, is essential."},
      {"type":"callout","style":"info","title":"Sexual Coercion and Assault","content":"Sexual coercion occurs when someone uses pressure, manipulation, alcohol, or other means to obtain sexual activity from someone who has not enthusiastically consented. It is not the same as physical force, but it is still a violation of consent. Sexual assault is any sexual act performed without clear, ongoing, and enthusiastic consent. Both are illegal in Canada regardless of relationship status, and both cause serious harm."},
      {"type":"text","content":"The legal definition of consent in Canada''s Criminal Code requires that consent be given voluntarily, by someone with capacity to consent, and that it be specific to the acts and conditions of the encounter. A person is unable to consent if they are unconscious or intoxicated, if they are below the age of consent, or if they are in a relationship of trust, authority, or dependency with the other person. Consent given under pressure or threat is not valid consent."},
      {"type":"text","content":"Healthy sexual communication involves expressing your desires, limits, and feelings clearly and listening to your partner''s. This communication is ongoing, not a one-time conversation at the beginning of a relationship. Checking in with your partner during sexual activity, expressing care for their comfort, and immediately stopping if they withdraw consent are expressions of genuine respect. A partner who dismisses your limits or pressures you to go further than you want is not respecting you."},
      {"type":"list","style":"unordered","items":["Enthusiastic consent: both people want to engage; absence of no is not a yes","Capacity: consent cannot be given by someone who is intoxicated, asleep, or below age of consent","Relationship status: being in a relationship does not grant ongoing consent to any sexual activity","Withdrawing consent: anyone can withdraw consent at any time, and this must be respected immediately","After an assault: it is not the survivor''s fault; support and confidential resources are available"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"Traditional Indigenous teachings in Saskatchewan emphasised that relationships between people carry sacred responsibilities. Relationships built on honesty, mutual care, and respect for each person''s autonomy were considered healthy expressions of the human connection that sustains community. Teachings that protected community members, especially women and children, from harm and exploitation were central features of many Indigenous governance and social systems before colonisation disrupted them."},
      {"type":"quiz","question":"Under Canadian law, which of the following means that consent has NOT been given?","options":["The person smiled and seemed happy","The person had been drinking heavily and was intoxicated","The person and their partner had been in a relationship for a year","The person did not say no out loud"],"correctIndex":1,"explanation":"A person who is heavily intoxicated does not have the legal capacity to consent under Canadian law, regardless of what they say or do. Consent obtained from an intoxicated person is not valid consent and engaging in sexual activity under those circumstances can constitute sexual assault."}
    ]'::jsonb,
    '[
      {"term":"Sexual Coercion","definition":"Using pressure, manipulation, or substances to obtain sexual activity from someone who has not freely and enthusiastically consented."},
      {"term":"Sexual Assault","definition":"Any sexual act performed without clear, ongoing, and enthusiastic consent, regardless of relationship status."},
      {"term":"Capacity to Consent","definition":"The legal and cognitive ability to make an informed, voluntary decision about sexual activity."},
      {"term":"Enthusiastic Consent","definition":"An active, positive, freely given agreement to engage in sexual activity, not merely the absence of refusal."},
      {"term":"Criminal Code","definition":"Canadian federal legislation that defines criminal offences, including sexual assault, and their penalties."},
      {"term":"Bystander Intervention","definition":"Actions taken by witnesses to a potential harm situation to safely interrupt or prevent the harm."}
    ]'::jsonb,
    'Sexual violence has been used as a tool of colonisation against Indigenous women, girls, and Two-Spirit people in Canada, with devastating and ongoing consequences. The National Inquiry into Missing and Murdered Indigenous Women and Girls documented the links between colonial policies and epidemic levels of violence against Indigenous women. Comprehensive consent education that names and confronts this violence is part of the path toward justice and healing.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is sexual coercion?', 'Using pressure, manipulation, or substances to obtain sexual activity without genuine consent.', 'Pressure is not consent.', 3, 0),
    (v_tenant, v_ch, 'Does being in a relationship automatically give ongoing consent?', 'No, consent must be given for each sexual encounter and can be withdrawn at any time.', 'Relationship ≠ permanent consent.', 3, 1),
    (v_tenant, v_ch, 'Can someone who is heavily intoxicated give legal consent?', 'No, intoxication removes the capacity to give legal consent under Canadian law.', 'Capacity is required.', 3, 2);

  -- Chapter 4: Community Wellness Advocacy
  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description,
    content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Community Wellness Advocacy', 'health-9-community-wellness-advocacy',
    'Connect individual health to community health, explore advocacy tools, design a personal wellness action plan, and celebrate community health champions.',
    '[
      {"type":"heading","level":1,"text":"Community Wellness Advocacy"},
      {"type":"text","content":"Health is not only an individual responsibility. The conditions that shape health, including safe housing, clean water, nutritious food, mental health support, and freedom from discrimination, are created and maintained collectively. Advocacy means using your voice, skills, and actions to work toward conditions that allow everyone in your community to be as healthy as possible."},
      {"type":"callout","style":"info","title":"What Is Community Wellness?","content":"Community wellness refers to the overall health and vitality of a group of people sharing a place or purpose. It is measured not just by the absence of disease among individuals, but by whether community conditions support every member''s ability to thrive. Communities with strong social cohesion, equitable resource distribution, and collective efficacy tend to produce better health outcomes for everyone."},
      {"type":"text","content":"Health advocacy takes many forms. Individual advocacy involves making your own health-promoting choices and supporting those around you. Community advocacy involves identifying a local health issue, researching it, building relationships with others who share your concern, and taking action through petitions, presentations, events, or media engagement. Policy advocacy involves engaging with government and institutions to change laws, regulations, and funding that affect health."},
      {"type":"text","content":"Youth have been powerful advocates for community health throughout history. In Saskatchewan, young Indigenous and non-Indigenous people are leading environmental campaigns to protect clean water, mental health awareness campaigns to reduce stigma, food security projects to address hunger in their communities, and cultural reclamation initiatives that strengthen the protective factors for Indigenous wellness. Your generation has both the energy and the moral clarity to drive meaningful change."},
      {"type":"list","style":"unordered","items":["Step 1: Identify a community health issue that matters to you","Step 2: Research the issue using credible, diverse sources","Step 3: Connect with others who share your concern","Step 4: Identify decision-makers who have power to create change","Step 5: Choose your advocacy tools (petition, presentation, social media, event, letter-writing)","Step 6: Take action and evaluate your impact","Step 7: Celebrate progress and sustain your effort"]},
      {"type":"callout","style":"tip","title":"Medicine Wheel Wisdom","content":"Indigenous traditions of governance were always rooted in collective responsibility for the health and wellbeing of the community. Consensus-based decision-making, respect for the voices of all members including youth, and the understanding that leadership is a responsibility of service rather than a position of power created models of community health advocacy that are increasingly recognised as effective and just. Indigenous youth who are grounded in their cultural identity are among the most powerful advocates for community wellness in Saskatchewan today."},
      {"type":"quiz","question":"What distinguishes policy advocacy from community advocacy?","options":["Policy advocacy is more important than community advocacy","Policy advocacy engages with government and institutions to change laws and funding; community advocacy works at the local level on specific issues","Community advocacy is only done by adults","Policy advocacy only works in large cities"],"correctIndex":1,"explanation":"Both forms of advocacy are important and complementary. Community advocacy addresses specific local health issues through grassroots action. Policy advocacy targets the systemic level, working to change laws, regulations, and institutional practices that shape health conditions for entire populations."}
    ]'::jsonb,
    '[
      {"term":"Community Wellness","definition":"The overall health and vitality of a community, including the conditions that allow all members to thrive."},
      {"term":"Advocacy","definition":"Using your voice, knowledge, and actions to support causes and changes that benefit health and wellbeing."},
      {"term":"Social Cohesion","definition":"The sense of trust, belonging, and solidarity among members of a community."},
      {"term":"Collective Efficacy","definition":"A community''s shared belief in its ability to work together to solve problems and achieve goals."},
      {"term":"Policy Advocacy","definition":"Working to change laws, regulations, or institutional practices that affect health conditions."},
      {"term":"Health Promotion","definition":"The process of enabling people to increase control over and improve their health and its determinants."}
    ]'::jsonb,
    'Indigenous-led community wellness advocacy in Saskatchewan has a long and powerful history. From the efforts of First Nations to reclaim jurisdiction over education and health services, to grassroots movements for clean water and environmental protection on reserve lands, to the leadership of Indigenous youth in mental health and addictions advocacy, Indigenous peoples in Saskatchewan are driving change that benefits all Canadians. Recognising and learning from this advocacy is part of genuine reconciliation.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is community wellness?', 'The overall health and vitality of a community, including conditions that allow all members to thrive.', 'More than just individual health.', 3, 0),
    (v_tenant, v_ch, 'Name three forms of health advocacy.', 'Individual, community, and policy advocacy.', 'Three levels of action.', 3, 1),
    (v_tenant, v_ch, 'What is collective efficacy?', 'A community''s shared belief in its ability to work together to solve problems.', 'We can do this together.', 3, 2);

END;
$$;
