-- ============================================================================
-- WolfWhale Social Studies Textbook Content Seed Data
-- Grades K-9 (Saskatchewan Curriculum)
--
-- 10 Textbooks:
--   wolfwhale-social-studies-k through wolfwhale-social-studies-9
--
-- Each textbook contains 4 chapters with:
--   - Rich JSONB content blocks (heading, text, callout, quiz, list)
--   - Key terms with definitions
--   - Indigenous connections (Treaty education throughout)
--   - Flashcards for spaced repetition
--
-- All content is 100% original. No copied material from any publisher.
-- tenant_id uses placeholder UUID: 00000000-0000-0000-0000-000000000001
-- ============================================================================


-- ============================================================================
-- TEXTBOOK: WolfWhale Social Studies K
-- Slug: wolfwhale-social-studies-k
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-social-studies-k';

  -- ==============================
  -- UNIT 1: My Family & Me
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'My Family & Me',
    'Explore family roles, relationships, and what makes every family unique and special.',
    'Families come in many shapes and sizes, and every family is a place of belonging.',
    'What makes my family special, and how do families care for one another?')
  RETURNING id INTO v_unit;

  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'My Family & Me', 'my-family-and-me',
    'Learn about different kinds of families, the roles people play, and how families share love and care.',
    '[
      {"type": "heading", "level": 1, "text": "My Family & Me"},
      {"type": "text", "content": "A family is a group of people who love and care for each other. Families can be big or small. Some families have a mom and a dad. Some have two moms or two dads. Some children live with grandparents, aunts, uncles, or other caring adults. Every family is different, and every family is special."},
      {"type": "text", "content": "In Saskatchewan, families come from many different backgrounds. Some families have lived on the prairies for many generations. Others moved here from faraway places. No matter where a family comes from, the most important thing is that the people in it look after each other."},
      {"type": "callout", "style": "info", "title": "What Is a Family?", "content": "A family is a group of people who care for one another. Families can look many different ways, and all of them are valued."},
      {"type": "text", "content": "People in families have different jobs, called roles. A parent might make meals and help with homework. An older brother or sister might help tie shoelaces. Grandparents share stories and wisdom. Even young children have roles, like helping to set the table or taking care of a pet."},
      {"type": "list", "style": "unordered", "items": ["Parents and caregivers keep children safe and healthy", "Grandparents share stories and traditions", "Siblings play together and help each other", "Everyone in a family can show kindness"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Families", "content": "Many First Nations families in Saskatchewan include grandparents, aunts, uncles, and cousins as everyday caregivers. Elders hold a special place of honour, sharing traditional knowledge, language, and stories that connect children to their culture and to the land."},
      {"type": "quiz", "question": "Which word best describes what a family is?", "options": ["A group of strangers", "People who live far apart", "People who love and care for each other", "Only a mom and a dad"], "correctIndex": 2, "explanation": "A family is defined by the caring relationships between people, not by a single shape or size."}
    ]'::jsonb,
    '[
      {"term": "Family", "definition": "A group of people who love and care for each other."},
      {"term": "Role", "definition": "A job or responsibility that someone has in the family or community."},
      {"term": "Caregiver", "definition": "A person who looks after and protects another person."},
      {"term": "Elder", "definition": "An older, respected person in a community who shares wisdom and knowledge."}
    ]'::jsonb,
    'Many First Nations families in Saskatchewan include grandparents, aunts, uncles, and cousins as everyday caregivers. Elders hold a special place of honour, sharing traditional knowledge, language, and stories that connect children to their culture and to the land.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a family?', 'A group of people who love and care for each other.', 'Think about who cares for you.', 1, 0),
    (v_tenant, v_ch, 'What is a role?', 'A job or responsibility a person has in the family or community.', 'What jobs do people in your family do?', 1, 1),
    (v_tenant, v_ch, 'What is an Elder?', 'An older, respected person who shares wisdom and traditional knowledge.', 'Think about someone who shares stories.', 1, 2);

  -- ==============================
  -- UNIT 2: My Community
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'My Community',
    'Discover the people, places, and helpers that make up a community.',
    'Communities are built when people work together and look after one another.',
    'Who are the helpers in my community, and how do they make life better for everyone?')
  RETURNING id INTO v_unit;

  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'My Community', 'my-community',
    'Explore community helpers, neighbourhood places, and the ways people work together.',
    '[
      {"type": "heading", "level": 1, "text": "My Community"},
      {"type": "text", "content": "A community is a place where people live, work, and play together. Your neighbourhood, your school, and your town are all parts of your community. Communities can be as small as a few houses on a country road or as large as a whole city like Saskatoon or Regina."},
      {"type": "text", "content": "Many people in a community have special jobs that help everyone. Firefighters keep people safe from fires. Teachers help children learn. Nurses and doctors keep people healthy. Bus drivers take people where they need to go. These people are called community helpers."},
      {"type": "callout", "style": "info", "title": "Community Helpers", "content": "Community helpers are people who do jobs that keep everyone in the community safe, healthy, and happy. Can you name three community helpers you have seen in your town or city?"},
      {"type": "list", "style": "unordered", "items": ["Firefighters protect people and property", "Teachers help children learn new things", "Farmers grow food for everyone to eat", "Librarians help people find books and information"]},
      {"type": "text", "content": "Communities also have special places. Parks are places to play and enjoy nature. Libraries are places to read and discover. Grocery stores are places to get food. Hospitals are places to get better when you are sick. Every place in a community has a purpose."},
      {"type": "callout", "style": "tip", "title": "Treaty Land", "content": "Every community in Saskatchewan sits on Treaty land. This means the land was shared through agreements called Treaties between First Nations peoples and the Crown. When we say we are on Treaty land, we remember that everyone in Saskatchewan is connected to this history, and we all have responsibilities to honour these agreements."},
      {"type": "quiz", "question": "What do we call people who have special jobs that help everyone in the community?", "options": ["Strangers", "Community helpers", "Travellers", "Visitors"], "correctIndex": 1, "explanation": "Community helpers are people whose jobs help keep the whole community safe, healthy, and running smoothly."}
    ]'::jsonb,
    '[
      {"term": "Community", "definition": "A place where people live, work, and play together."},
      {"term": "Community Helper", "definition": "A person who does a job that helps keep everyone in the community safe, healthy, or happy."},
      {"term": "Neighbourhood", "definition": "The area around where you live, including nearby homes, streets, and places."},
      {"term": "Treaty Land", "definition": "Land that First Nations peoples agreed to share with newcomers through formal agreements called Treaties."}
    ]'::jsonb,
    'Every community in Saskatchewan sits on Treaty land. First Nations communities have their own systems of helpers and leadership that have existed for thousands of years, including Knowledge Keepers, healers, hunters, and councils who work together for the good of the whole community.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a community?', 'A place where people live, work, and play together.', 'Think about your neighbourhood.', 1, 0),
    (v_tenant, v_ch, 'Name two community helpers.', 'Examples: firefighter, teacher, nurse, farmer, librarian, police officer.', 'Who helps keep your community safe and healthy?', 1, 1),
    (v_tenant, v_ch, 'What is Treaty land?', 'Land that First Nations peoples agreed to share with newcomers through formal agreements called Treaties.', 'All of Saskatchewan is Treaty land.', 1, 2);

  -- ==============================
  -- UNIT 3: Special Days & Celebrations
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Special Days & Celebrations',
    'Discover how families and communities celebrate special days and why traditions matter.',
    'Celebrations connect us to our families, communities, and cultures.',
    'Why do we celebrate special days, and what do our celebrations tell us about who we are?')
  RETURNING id INTO v_unit;

  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Special Days & Celebrations', 'special-days-celebrations',
    'Learn about different celebrations, traditions, and why special days bring people together.',
    '[
      {"type": "heading", "level": 1, "text": "Special Days & Celebrations"},
      {"type": "text", "content": "Every family and community has special days that they celebrate. A celebration is a way of marking something important with joy and togetherness. Birthdays celebrate the day a person was born. Holidays celebrate important events or ideas. Festivals celebrate culture, harvest, or seasons. All of these celebrations help people feel connected."},
      {"type": "text", "content": "In Saskatchewan, people celebrate many different special days throughout the year. Families gather for Thanksgiving in autumn when the harvest is in. Children look forward to winter holidays. Farmers celebrate a good growing season. These celebrations reflect the rhythms of life on the prairies."},
      {"type": "callout", "style": "info", "title": "What Is a Tradition?", "content": "A tradition is something that people do the same way year after year because it is meaningful to them. Traditions can be part of a celebration or just a regular part of family life."},
      {"type": "text", "content": "Different families and cultures celebrate in different ways. Some celebrations involve special foods. Others involve music, dancing, or storytelling. Some have special clothing or decorations. Learning about how other people celebrate helps us understand and respect each other."},
      {"type": "list", "style": "unordered", "items": ["Birthdays celebrate a person and their life", "Thanksgiving gives thanks for food and good fortune", "Cultural festivals celebrate heritage and identity", "National holidays mark important moments in history"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Celebrations", "content": "First Nations and Metis peoples in Saskatchewan hold Powwows as celebrations of culture, community, and identity. Powwows feature drumming, singing, and dancing in regalia that carries deep meaning. They are joyful gatherings that welcome all people to learn and share in the celebration of Indigenous culture."},
      {"type": "quiz", "question": "What is a tradition?", "options": ["Something done only once", "Something done the same way year after year because it is meaningful", "A kind of food eaten at celebrations", "A type of holiday game"], "correctIndex": 1, "explanation": "A tradition is a practice repeated over time because it holds special meaning for a family, community, or culture."}
    ]'::jsonb,
    '[
      {"term": "Celebration", "definition": "A special event that marks something important with joy and togetherness."},
      {"term": "Tradition", "definition": "A practice or custom passed down and repeated because it holds special meaning."},
      {"term": "Festival", "definition": "A community celebration of culture, harvest, or a special time of year."},
      {"term": "Powwow", "definition": "A First Nations and Metis cultural gathering featuring drumming, singing, dancing, and community."}
    ]'::jsonb,
    'First Nations and Metis peoples in Saskatchewan celebrate through Powwows, which feature drumming, singing, and traditional dancing. These gatherings are expressions of cultural identity and community strength. Seasonal ceremonies connected to the land, such as berry-picking gatherings and harvest celebrations, have been practised for thousands of years.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a celebration?', 'A special event that marks something important with joy and togetherness.', 'Think about birthdays and holidays.', 1, 0),
    (v_tenant, v_ch, 'What is a Powwow?', 'A First Nations and Metis cultural gathering featuring drumming, singing, and dancing.', 'Think about Indigenous cultural celebrations.', 1, 1),
    (v_tenant, v_ch, 'What is a tradition?', 'A practice repeated over time because it holds special meaning.', 'Something done the same way each year.', 1, 2);

  -- ==============================
  -- UNIT 4: Caring for Our World
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Caring for Our World',
    'Understand how people and living things depend on the natural world and how we can care for it.',
    'Every living thing depends on the natural world, and we all share the responsibility of caring for it.',
    'How can I help take care of the world around me?')
  RETURNING id INTO v_unit;

  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Caring for Our World', 'caring-for-our-world',
    'Explore how all living things are connected to nature and what children can do to be Earth stewards.',
    '[
      {"type": "heading", "level": 1, "text": "Caring for Our World"},
      {"type": "text", "content": "The world around us is full of living things. Animals, plants, insects, birds, and fish all share our planet. People need clean water, clean air, healthy soil, and green spaces to live well. Everything in nature is connected. When we take care of the land, we take care of ourselves and all living things."},
      {"type": "text", "content": "Saskatchewan has beautiful natural places. The prairies stretch for hundreds of kilometres, full of grasses and wildflowers. Rivers like the South Saskatchewan carry clean water across the province. Forests in the north are home to moose, bears, and hundreds of bird species. These natural places are worth protecting."},
      {"type": "callout", "style": "info", "title": "What Is Stewardship?", "content": "Stewardship means taking care of something valuable. An Earth steward is a person who helps protect and care for the natural world."},
      {"type": "text", "content": "Even young children can be Earth stewards. Picking up litter keeps parks clean. Turning off the tap while brushing teeth saves water. Planting a seed in a garden creates food and habitat. Turning off lights when you leave a room saves energy. Small actions add up to make a big difference."},
      {"type": "list", "style": "unordered", "items": ["Pick up litter in parks and on paths", "Save water by turning off taps", "Plant flowers or vegetables in a garden", "Feed and watch birds through winter", "Learn the names of plants and animals near your home"]},
      {"type": "callout", "style": "tip", "title": "Indigenous Teachings on the Land", "content": "First Nations peoples in Saskatchewan have cared for this land for thousands of years. Many Indigenous teachings describe the land as a living relative, not a resource to be used up. The idea that humans are caretakers of the Earth, not its owners, is central to many Indigenous worldviews. This teaching invites all of us to treat the natural world with respect and gratitude."},
      {"type": "quiz", "question": "What does stewardship mean?", "options": ["Owning land", "Taking care of something valuable", "Building houses", "Planting big trees"], "correctIndex": 1, "explanation": "Stewardship means responsibly caring for something important, like the natural environment, so it remains healthy for future generations."}
    ]'::jsonb,
    '[
      {"term": "Stewardship", "definition": "Taking responsible care of something valuable, especially the natural world."},
      {"term": "Nature", "definition": "The living and non-living parts of the world, including animals, plants, water, air, and soil."},
      {"term": "Habitat", "definition": "The natural place where a plant or animal lives and finds what it needs to survive."},
      {"term": "Environment", "definition": "Everything that surrounds and affects a living thing, including air, water, land, and other organisms."}
    ]'::jsonb,
    'First Nations peoples in Saskatchewan have cared for this land for thousands of years. Many Indigenous teachings describe the land as a living relative, not a resource to be consumed. The principle that humans are caretakers rather than owners of the Earth is central to many Indigenous worldviews, and it offers guidance for all people who call this land home.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is stewardship?', 'Taking responsible care of something valuable, especially the natural world.', 'How do we care for the Earth?', 1, 0),
    (v_tenant, v_ch, 'Name two things a child can do to care for the Earth.', 'Examples: pick up litter, save water, plant a garden, turn off lights.', 'Think about small actions at home or school.', 1, 1),
    (v_tenant, v_ch, 'What is a habitat?', 'The natural place where a plant or animal lives and finds what it needs to survive.', 'Where does a beaver live?', 1, 2);

END;
$$;


-- ============================================================================
-- TEXTBOOK: WolfWhale Social Studies 1
-- Slug: wolfwhale-social-studies-1
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-social-studies-1';

  -- ==============================
  -- UNIT 1: Our Community
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Our Community',
    'Explore what makes a community, the people who live and work in it, and how communities meet needs.',
    'Strong communities are built when people work together, contribute their skills, and look after one another.',
    'What does every community need, and how do people work together to meet those needs?')
  RETURNING id INTO v_unit;

  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Our Community', 'our-community',
    'Discover the features of communities, community roles, and what makes communities work well.',
    '[
      {"type": "heading", "level": 1, "text": "Our Community"},
      {"type": "text", "content": "A community is a group of people who live and work near each other. Communities can be rural, meaning they are in the countryside with farms and open land, or urban, meaning they are in cities and towns with many buildings and businesses. Saskatchewan has both kinds of communities. Small farming villages like Outlook or Kerrobert are rural communities. Saskatoon and Regina are urban communities."},
      {"type": "text", "content": "Every community has places where people gather. Schools, parks, libraries, community centres, and places of worship all bring people together. Communities also have services, which are things done by people or organizations to help everyone. Garbage collection, road maintenance, and public transit are all services."},
      {"type": "callout", "style": "info", "title": "Rural and Urban Communities", "content": "Rural communities are located in the countryside and often depend on farming or natural resources. Urban communities are cities and towns with dense populations and many services within walking distance."},
      {"type": "list", "style": "unordered", "items": ["Communities have places for people to gather, like schools and parks", "Communities provide services like clean water and road maintenance", "People in communities have different jobs that contribute to everyone", "Communities celebrate shared history and traditions"]},
      {"type": "text", "content": "People in a community depend on each other. A farmer grows wheat that a baker turns into bread. A truck driver carries the bread to a grocery store. A store worker sells it to families. This chain of cooperation shows how connected community members are, even when they do not know each other personally."},
      {"type": "callout", "style": "tip", "title": "Indigenous Communities in Saskatchewan", "content": "Saskatchewan is home to First Nations and Metis communities that have existed on this land for thousands of years. Many First Nations communities are located on reserve lands set aside through Treaties. Metis communities like those along the South Saskatchewan River developed their own unique culture blending Indigenous and European traditions. These communities are an important part of Saskatchewan''s story."},
      {"type": "quiz", "question": "What is the difference between a rural and an urban community?", "options": ["Rural communities are bigger than urban ones", "Urban communities are in the countryside and rural ones are in cities", "Rural communities are in the countryside and urban communities are in cities and towns", "There is no difference"], "correctIndex": 2, "explanation": "Rural communities are found in the countryside, often based around farming, while urban communities are cities and towns with higher populations and more services nearby."}
    ]'::jsonb,
    '[
      {"term": "Community", "definition": "A group of people who live and work near each other."},
      {"term": "Rural", "definition": "Located in the countryside, away from cities, often with farms and open land."},
      {"term": "Urban", "definition": "Located in a city or town with many people, buildings, and services."},
      {"term": "Service", "definition": "Something done by people or organizations to help everyone in the community."},
      {"term": "Reserve", "definition": "Land set aside for First Nations communities through Treaties with the Canadian government."}
    ]'::jsonb,
    'Saskatchewan is home to First Nations and Metis communities that have existed on this land for thousands of years. Many First Nations communities are located on reserve lands established through Treaties. These communities have their own governance, language, and cultural practices that enrich the province.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a rural community?', 'A community located in the countryside, often based around farming or natural resources.', 'Think about farms and open land.', 1, 0),
    (v_tenant, v_ch, 'What is an urban community?', 'A community in a city or town with many people and services.', 'Think about Saskatoon or Regina.', 1, 1),
    (v_tenant, v_ch, 'What is a service?', 'Something done by people or organizations to help everyone in the community.', 'Think about garbage collection or road repair.', 1, 2);

  -- ==============================
  -- UNIT 2: Needs & Wants
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Needs & Wants',
    'Understand the difference between needs and wants and how communities help people meet their needs.',
    'Meeting basic needs is the foundation of a healthy community, and understanding the difference between needs and wants helps people make good choices.',
    'How do people and communities make sure that everyone''s needs are met?')
  RETURNING id INTO v_unit;

  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Needs & Wants', 'needs-and-wants',
    'Learn the difference between needs and wants and how communities ensure everyone has what they need.',
    '[
      {"type": "heading", "level": 1, "text": "Needs & Wants"},
      {"type": "text", "content": "Every person has needs. A need is something a person must have to stay alive and healthy. Food, water, shelter, clothing, and love are all needs. Without these things, a person cannot survive or grow. Wants are different. A want is something a person would like to have but does not need to survive. A new video game, a special toy, or a treat from the bakery are all wants."},
      {"type": "callout", "style": "info", "title": "Needs vs. Wants", "content": "A need is something required to stay alive and healthy. A want is something you would enjoy but can survive without. Understanding this difference helps people and communities make smart choices."},
      {"type": "text", "content": "Communities are organized in part to help people meet their needs. Grocery stores and food banks make sure people have food. Public water systems provide clean water. Schools and hospitals are built so that children can learn and people can get healthy. Governments collect taxes and use that money to pay for community services."},
      {"type": "list", "style": "unordered", "items": ["Food is a need — grocery stores, farms, and food banks help provide it", "Shelter is a need — houses, apartments, and community housing provide it", "Education is a need — schools and libraries help provide it", "Health care is a need — hospitals and clinics help provide it"]},
      {"type": "text", "content": "Sometimes people in a community cannot meet all their needs on their own. A family might not have enough money for food or rent. Communities help through food banks, shelters, and social services. When community members look out for each other, everyone is stronger."},
      {"type": "callout", "style": "tip", "title": "Indigenous Ways of Meeting Needs", "content": "First Nations peoples in Saskatchewan developed highly effective ways of meeting community needs long before European settlement. Bison hunting was organized cooperatively so that large groups could hunt together safely and share the meat. Gathering plants for food and medicine was knowledge passed carefully between generations. These systems ensured that community needs were met through cooperation and shared responsibility."},
      {"type": "quiz", "question": "Which of the following is a NEED rather than a want?", "options": ["A new bicycle", "A video game", "Clean drinking water", "A birthday cake"], "correctIndex": 2, "explanation": "Clean drinking water is essential for survival. A bicycle, video game, and birthday cake are enjoyable but not required to stay alive and healthy."}
    ]'::jsonb,
    '[
      {"term": "Need", "definition": "Something a person must have to survive and stay healthy, such as food, water, and shelter."},
      {"term": "Want", "definition": "Something a person would like to have but can survive without."},
      {"term": "Shelter", "definition": "A place that protects people from the weather, such as a house or apartment."},
      {"term": "Food Bank", "definition": "A community organization that collects and distributes food to people who need it."},
      {"term": "Tax", "definition": "Money collected by the government from people and businesses to pay for shared services."}
    ]'::jsonb,
    'First Nations peoples in Saskatchewan developed highly effective cooperative systems for meeting community needs, including organized bison hunts, shared gathering of plants, and community-wide food distribution. These practices reflect values of generosity and collective responsibility that remain central to many Indigenous communities today.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a need?', 'Something a person must have to survive and stay healthy.', 'Could you live without it?', 1, 0),
    (v_tenant, v_ch, 'What is a want?', 'Something a person would like to have but does not need to survive.', 'Fun but not essential.', 1, 1),
    (v_tenant, v_ch, 'Give two examples of community services that help meet needs.', 'Examples: food banks, hospitals, schools, public water systems, shelters.', 'Think about where people go for help.', 1, 2);

  -- ==============================
  -- UNIT 3: Responsible Citizens
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Responsible Citizens',
    'Explore what it means to be a responsible citizen in the classroom, the school, and the community.',
    'Responsible citizens contribute to their communities by following rules, helping others, and making good choices.',
    'What are my responsibilities as a citizen, and how do I contribute to my community?')
  RETURNING id INTO v_unit;

  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Responsible Citizens', 'responsible-citizens',
    'Learn about citizenship, rules, rights, responsibilities, and how to contribute positively to community life.',
    '[
      {"type": "heading", "level": 1, "text": "Responsible Citizens"},
      {"type": "text", "content": "A citizen is a person who belongs to a community. Citizens have rights, which are things they are entitled to, and responsibilities, which are things they are expected to do. In a classroom, you have the right to learn in a safe and respectful environment. You also have the responsibility to listen, take turns, and treat your classmates with kindness."},
      {"type": "callout", "style": "info", "title": "Rights and Responsibilities", "content": "A right is something you are entitled to as a member of a community. A responsibility is something you are expected to do for the good of the community. Rights and responsibilities go together."},
      {"type": "text", "content": "Communities have rules that help everyone get along and stay safe. Traffic lights help prevent accidents. School rules make sure everyone can learn. Laws about littering keep communities clean. Rules are made by leaders who are chosen to represent the community. When everyone follows the rules, the community runs more smoothly."},
      {"type": "list", "style": "unordered", "items": ["Listen when others are speaking", "Take care of shared spaces like parks and classrooms", "Help people who need assistance", "Follow rules at school, home, and in the community", "Be honest and kind in your words and actions"]},
      {"type": "text", "content": "Being a good citizen does not require grand actions. Helping a classmate who has dropped their books, picking up litter on the playground, or welcoming a new student are all acts of citizenship. When people look out for each other in small ways every day, the whole community becomes stronger."},
      {"type": "callout", "style": "tip", "title": "Indigenous Citizenship Traditions", "content": "First Nations communities in Saskatchewan have long-standing traditions of collective responsibility. The concept of working for the good of the whole community — not just oneself — is central to many Indigenous cultures. Sharing resources, honouring Elders, and caring for children are responsibilities that all community members are expected to uphold. These values reflect a deep understanding of what it means to be a good community citizen."},
      {"type": "quiz", "question": "What is a responsibility?", "options": ["Something you are allowed to do", "Something you are entitled to as a citizen", "Something you are expected to do for the good of the community", "Something only leaders have to worry about"], "correctIndex": 2, "explanation": "A responsibility is something you are expected to do to contribute positively to your community. Everyone, including children, has responsibilities."}
    ]'::jsonb,
    '[
      {"term": "Citizen", "definition": "A person who belongs to a community and has both rights and responsibilities."},
      {"term": "Right", "definition": "Something a person is entitled to as a member of a community."},
      {"term": "Responsibility", "definition": "Something a person is expected to do for the good of the community."},
      {"term": "Rule", "definition": "A guideline that members of a community agree to follow to keep everyone safe and treated fairly."},
      {"term": "Law", "definition": "An official rule made by a government that everyone in the community must follow."}
    ]'::jsonb,
    'First Nations communities in Saskatchewan have long-standing traditions of collective responsibility. Values such as generosity, sharing, honouring Elders, and protecting children are responsibilities all community members are expected to uphold. These traditions reflect a deep understanding of citizenship rooted in relationship and mutual care.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a citizen?', 'A person who belongs to a community and has both rights and responsibilities.', 'Think about being a member of your school community.', 1, 0),
    (v_tenant, v_ch, 'What is the difference between a right and a responsibility?', 'A right is something you are entitled to; a responsibility is something you are expected to do for the community.', 'One you receive, one you give.', 1, 1),
    (v_tenant, v_ch, 'Name two ways to be a responsible citizen at school.', 'Examples: listen when others speak, pick up litter, help classmates, follow rules, be kind.', 'What does a good community member do?', 1, 2);

  -- ==============================
  -- UNIT 4: Treaty Territory Awareness
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Treaty Territory Awareness',
    'Begin to understand what Treaties are and why they matter to everyone who lives in Saskatchewan.',
    'We are all Treaty people, and understanding Treaties is part of being a responsible citizen in Saskatchewan.',
    'What is a Treaty, and why does it matter that I live on Treaty land?')
  RETURNING id INTO v_unit;

  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Treaty Territory Awareness', 'treaty-territory-awareness',
    'Introduce the concept of Treaties and what it means to live on Treaty land in Saskatchewan.',
    '[
      {"type": "heading", "level": 1, "text": "Treaty Territory Awareness"},
      {"type": "text", "content": "If you live in Saskatchewan, you live on Treaty land. A Treaty is a formal agreement made between First Nations peoples and the Canadian government. These agreements were made more than a hundred years ago and are still in effect today. They set out the rights and responsibilities of both First Nations peoples and all who came to settle on the land."},
      {"type": "text", "content": "Most of Saskatchewan is covered by numbered Treaties: Treaties 2, 4, 5, 6, 8, and 10. Each Treaty covers a different area of the province. The city of Saskatoon sits within Treaty 6 territory. Regina is in Treaty 4 territory. When we acknowledge the Treaty territory we are on, we are recognizing the history of the land and the peoples who have been here since time immemorial."},
      {"type": "callout", "style": "info", "title": "What Is a Treaty?", "content": "A Treaty is a formal agreement between First Nations peoples and the Crown. In Saskatchewan, Treaties defined how land would be shared and set out promises that both sides agreed to keep. These are living documents that still apply today."},
      {"type": "text", "content": "When First Nations leaders signed the Treaties, they understood they were agreeing to share the land with newcomers, not give it away forever. In exchange for sharing the land, the Crown promised things like annual payments, education, health care, and the right to continue traditional ways of life such as hunting and fishing. These promises are called Treaty rights."},
      {"type": "list", "style": "unordered", "items": ["Saskatchewan is covered by Treaties 2, 4, 5, 6, 8, and 10", "Treaties are agreements between First Nations and the Crown", "Both First Nations and all Canadians have Treaty responsibilities", "Treaty rights include education, health, and the right to hunt and fish"]},
      {"type": "callout", "style": "tip", "title": "We Are All Treaty People", "content": "The phrase ''We are all Treaty people'' means that the Treaties are not just the concern of First Nations peoples. Everyone who lives in Saskatchewan benefits from the land that was shared through Treaties. This means everyone has a responsibility to honour the promises made in those agreements. Learning about Treaties is part of being a good citizen in Saskatchewan."},
      {"type": "quiz", "question": "What is a Treaty?", "options": ["A type of map showing roads", "A formal agreement between First Nations peoples and the Crown about land and rights", "A school rule about sharing", "A kind of certificate given to new citizens"], "correctIndex": 1, "explanation": "A Treaty is a formal agreement between First Nations peoples and the Canadian government. These agreements covered how land would be shared and outlined rights and responsibilities for both parties."}
    ]'::jsonb,
    '[
      {"term": "Treaty", "definition": "A formal agreement between First Nations peoples and the Crown that set out rights and responsibilities regarding land and way of life."},
      {"term": "Treaty Rights", "definition": "Specific rights guaranteed to First Nations peoples through Treaties, such as the right to hunt, fish, and receive education and health care."},
      {"term": "Crown", "definition": "The government of Canada, acting on behalf of the British monarchy, which signed Treaties with First Nations peoples."},
      {"term": "Treaty Territory", "definition": "The area of land covered by a specific Treaty agreement."},
      {"term": "Acknowledgement", "definition": "A statement that recognizes and respects the history and presence of Indigenous peoples on their traditional lands."}
    ]'::jsonb,
    'All of Saskatchewan is Treaty land. First Nations peoples who signed the Treaties understood they were agreeing to share the land, not surrender it entirely. The numbered Treaties covering Saskatchewan established legally binding promises that remain in effect today. Honouring these promises is a responsibility shared by all who live on this land.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a Treaty?', 'A formal agreement between First Nations peoples and the Crown about how land would be shared and what rights both sides have.', 'Think about an agreement or promise.', 1, 0),
    (v_tenant, v_ch, 'What does "We are all Treaty people" mean?', 'Everyone who lives in Saskatchewan benefits from Treaties and has a responsibility to honour them.', 'Who does the Treaty apply to?', 1, 1),
    (v_tenant, v_ch, 'Name two Treaty rights.', 'Examples: the right to hunt and fish, the right to education, the right to health care, annual payments.', 'What did the Crown promise First Nations?', 1, 2);

END;
$$;


-- ============================================================================
-- TEXTBOOK: WolfWhale Social Studies 2
-- Slug: wolfwhale-social-studies-2
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-social-studies-2';

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Saskatchewan Communities',
    'Explore the diverse communities that make up Saskatchewan, from small villages to large cities.',
    'Saskatchewan''s communities reflect diverse histories, environments, and ways of life.',
    'How do geography and history shape the communities of Saskatchewan?')
  RETURNING id INTO v_unit;

  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Saskatchewan Communities', 'saskatchewan-communities',
    'Discover the variety of communities across Saskatchewan and how geography shapes where and how people live.',
    '[
      {"type": "heading", "level": 1, "text": "Saskatchewan Communities"},
      {"type": "text", "content": "Saskatchewan is a large province in the middle of Canada, covering more than 650,000 square kilometres. The southern part of the province is covered by wide-open prairies, where wheat fields stretch as far as the eye can see. The northern part is covered by boreal forest, dotted with thousands of lakes and rivers. These different landscapes have shaped the kinds of communities that developed there."},
      {"type": "text", "content": "Prairie communities in the south grew up around farming. Towns like Moose Jaw, Swift Current, and Weyburn developed as places where farmers could sell grain, buy supplies, and connect with neighbours. Northern communities like La Ronge and Prince Albert developed around forestry, fishing, and trapping. Each type of community reflects the natural resources and geography of its region."},
      {"type": "callout", "style": "info", "title": "Geography Shapes Communities", "content": "Geography means the physical features of a place, like landforms, waterways, and climate. The geography of where people settle shapes how communities develop, what jobs people do, and what resources are available."},
      {"type": "list", "style": "unordered", "items": ["Prairie communities developed around grain farming and railways", "Northern communities developed around forestry, fishing, and trapping", "River communities developed along waterways used for transportation", "Reserve communities are home to First Nations peoples across the province"]},
      {"type": "text", "content": "Saskatchewan also has two major cities. Saskatoon, located on the South Saskatchewan River in Treaty 6 territory, is the largest city by population. Regina, the provincial capital, sits in Treaty 4 territory in the south. Both cities began as small settlements and grew as people came to farm, work in government, and build businesses."},
      {"type": "callout", "style": "tip", "title": "First Nations Communities", "content": "Long before European settlers arrived, the plains and parklands of what is now Saskatchewan were home to First Nations peoples including the Cree, Assiniboine, Nakoda, Saulteaux, and others. These communities followed the bison herds across the prairies and established deep relationships with the land. Many First Nations communities today continue to thrive on reserve lands throughout the province."},
      {"type": "quiz", "question": "What major natural feature runs through Saskatoon?", "options": ["The Qu''Appelle River", "The North Saskatchewan River", "The South Saskatchewan River", "Waskesiu Lake"], "correctIndex": 2, "explanation": "Saskatoon is built along the South Saskatchewan River, which was a key reason for the location of the settlement. It is located in Treaty 6 territory."}
    ]'::jsonb,
    '[
      {"term": "Geography", "definition": "The physical features of a place, including landforms, water, and climate."},
      {"term": "Prairie", "definition": "A large area of flat or gently rolling grassland, like the southern part of Saskatchewan."},
      {"term": "Boreal Forest", "definition": "A large northern forest of spruce, pine, and fir trees, like the northern part of Saskatchewan."},
      {"term": "Province", "definition": "A large region of Canada with its own government, like Saskatchewan."},
      {"term": "Capital", "definition": "The city where a government is located. Regina is the capital of Saskatchewan."}
    ]'::jsonb,
    'Long before European settlers arrived, the prairies and parklands of what is now Saskatchewan were home to many First Nations peoples. The Cree, Assiniboine, Nakoda, Saulteaux, and Dene peoples built their communities in relationship with the land, following seasonal patterns shaped by the bison, the seasons, and the waterways.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are the two main landscapes of Saskatchewan?', 'The prairies in the south and the boreal forest in the north.', 'Think about farming land and forest land.', 1, 0),
    (v_tenant, v_ch, 'What is the capital city of Saskatchewan?', 'Regina, located in Treaty 4 territory in southern Saskatchewan.', 'Where does the provincial government meet?', 1, 1),
    (v_tenant, v_ch, 'What does geography mean?', 'The physical features of a place, including landforms, water, and climate.', 'Think about what the land looks like.', 1, 2);

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Canadian Symbols',
    'Explore the symbols that represent Canada and what they mean to people across the country.',
    'National symbols represent shared values, history, and identity for all Canadians.',
    'What symbols represent Canada and why do they matter?')
  RETURNING id INTO v_unit;

  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Canadian Symbols', 'canadian-symbols',
    'Learn about Canada''s national symbols, their origins, and what they represent.',
    '[
      {"type": "heading", "level": 1, "text": "Canadian Symbols"},
      {"type": "text", "content": "Every country has symbols that represent its identity, history, and values. Canada has many national symbols that Canadians recognize and share. The Canadian flag with its red maple leaf was officially adopted in 1965. Before that, Canada used a flag with the British Union Jack. The maple leaf has long been associated with Canada because maple trees grow across much of the country and their sap is used to make maple syrup."},
      {"type": "text", "content": "The beaver is Canada''s national animal. Beavers were central to the fur trade, which was one of the earliest industries in Canada. The RCMP, or Royal Canadian Mounted Police, is another famous Canadian symbol, known for their distinctive red uniforms. The national anthem, ''O Canada,'' was officially adopted in 1980 and is sung at many public events."},
      {"type": "callout", "style": "info", "title": "National Symbols", "content": "A national symbol is an object, animal, plant, or idea that represents a country. Canada''s national symbols include the maple leaf, the beaver, the Canadian flag, the RCMP, and ''O Canada.''"},
      {"type": "list", "style": "unordered", "items": ["The maple leaf represents Canada on the national flag", "The beaver is Canada''s national animal and a symbol of the fur trade", "The RCMP is recognized around the world in their red serge uniforms", "''O Canada'' is the national anthem, sung at public and sporting events"]},
      {"type": "text", "content": "Saskatchewan also has its own provincial symbols. The western red lily is the provincial flower. The sharp-tailed grouse is the provincial bird. The white birch is the provincial tree. These symbols reflect the natural beauty and wildlife of the Saskatchewan prairies and parklands."},
      {"type": "callout", "style": "tip", "title": "Indigenous Symbols and Identity", "content": "First Nations and Metis peoples have their own symbols, flags, and emblems that represent their nations and identities. The Metis flag, one of the oldest flags in North America, features a white infinity symbol on a blue or red background. The infinity symbol represents the mixing of two cultures and the eternal nature of the Metis people. Many First Nations nations have their own flags, clan symbols, and sacred emblems that carry deep spiritual and cultural meaning."},
      {"type": "quiz", "question": "What is Saskatchewan''s provincial flower?", "options": ["The prairie crocus", "The western red lily", "The sunflower", "The wild rose"], "correctIndex": 1, "explanation": "The western red lily is Saskatchewan''s provincial flower. It grows in meadows and prairie grasslands across the province."}
    ]'::jsonb,
    '[
      {"term": "Symbol", "definition": "An object, animal, plant, or idea that represents something larger, like a country or value."},
      {"term": "National Anthem", "definition": "An official song that represents a country, sung at public and patriotic events."},
      {"term": "Beaver", "definition": "Canada''s national animal, significant because of its role in the early fur trade."},
      {"term": "RCMP", "definition": "Royal Canadian Mounted Police, Canada''s national police force, recognized by their red uniforms."},
      {"term": "Provincial Flower", "definition": "A plant officially chosen to represent a province. Saskatchewan''s is the western red lily."}
    ]'::jsonb,
    'First Nations and Metis peoples have their own symbols and emblems that represent their nations. The Metis flag, one of the oldest flags in North America, features the infinity symbol. Many First Nations nations carry sacred symbols, clan crests, and emblems that reflect their spiritual beliefs and cultural identity.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does the maple leaf represent?', 'Canada — it appears on the Canadian flag and is associated with maple trees found across the country.', 'Think about the red and white flag.', 1, 0),
    (v_tenant, v_ch, 'What is Canada''s national animal?', 'The beaver, which was important in the early fur trade.', 'It builds dams in rivers.', 1, 1),
    (v_tenant, v_ch, 'What is Saskatchewan''s provincial flower?', 'The western red lily, which grows in prairie meadows.', 'It is a bright orange-red flower.', 1, 2);

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Cultural Diversity',
    'Explore the many cultures that make up Saskatchewan and Canada, and why diversity makes communities stronger.',
    'Diversity of culture, language, and background enriches communities and makes them more creative and resilient.',
    'How does cultural diversity make Saskatchewan and Canada stronger?')
  RETURNING id INTO v_unit;

  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Cultural Diversity', 'cultural-diversity',
    'Celebrate the many cultures in Saskatchewan and learn how diversity strengthens communities.',
    '[
      {"type": "heading", "level": 1, "text": "Cultural Diversity"},
      {"type": "text", "content": "Saskatchewan is home to people from many different cultural backgrounds. The word ''culture'' refers to the beliefs, customs, language, food, art, and traditions that a group of people share. Culture is passed down from parents to children and shapes how people see the world. Saskatchewan''s culture has been shaped by First Nations and Metis peoples, European settlers, and immigrants from around the world."},
      {"type": "text", "content": "In the late 1800s and early 1900s, thousands of immigrants came to Saskatchewan to farm the prairies. They came from Ukraine, Germany, Russia, Britain, Scandinavia, and many other countries. They brought with them their languages, foods, music, and religious traditions. You can still see this diversity today in Saskatchewan''s place names, cultural events, and community celebrations."},
      {"type": "callout", "style": "info", "title": "What Is Culture?", "content": "Culture is the shared beliefs, customs, language, food, art, and traditions of a group of people. Every person belongs to at least one culture, and many people belong to several cultures at once."},
      {"type": "list", "style": "unordered", "items": ["Culture includes food, music, language, clothing, and celebrations", "Saskatchewan has been shaped by Indigenous, European, and global cultures", "Many languages are spoken across Saskatchewan communities", "Cultural diversity makes communities more creative and interesting"]},
      {"type": "text", "content": "Respecting other cultures means learning about them with curiosity and an open mind. It means recognizing that no culture is better than another, and that everyone''s background has value. When we learn from each other, our communities become richer and more welcoming for everyone."},
      {"type": "callout", "style": "tip", "title": "Indigenous Cultural Diversity", "content": "Even within Indigenous communities, there is tremendous cultural diversity. The Cree, Dene, Nakoda, Saulteaux, Assiniboine, and Metis peoples of Saskatchewan each have distinct languages, ceremonies, artwork, and traditions. Treating Indigenous cultures as a single group misses this rich variety. Each nation has its own identity, history, and cultural expression that deserves recognition and respect."},
      {"type": "quiz", "question": "What does the word ''culture'' mean?", "options": ["Only the food that people eat", "The shared beliefs, customs, language, and traditions of a group of people", "The country where a person was born", "Only the language a person speaks"], "correctIndex": 1, "explanation": "Culture encompasses a wide range of shared elements including beliefs, customs, language, food, art, and traditions. It is much more than any single element."}
    ]'::jsonb,
    '[
      {"term": "Culture", "definition": "The shared beliefs, customs, language, food, art, and traditions of a group of people."},
      {"term": "Diversity", "definition": "The presence of many different kinds of people, ideas, cultures, and backgrounds in a community."},
      {"term": "Immigrant", "definition": "A person who moves from one country to another to live permanently."},
      {"term": "Tradition", "definition": "A custom or practice passed down from generation to generation within a culture."},
      {"term": "Respect", "definition": "Treating others and their cultures with consideration, dignity, and openness."}
    ]'::jsonb,
    'The Indigenous peoples of Saskatchewan represent remarkable cultural diversity. The Cree, Dene, Nakoda, Saulteaux, Assiniboine, and Metis peoples each have distinct languages, ceremonies, artwork, and traditions. Understanding this diversity is essential to understanding the full cultural richness of Saskatchewan.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is culture?', 'The shared beliefs, customs, language, food, art, and traditions of a group of people.', 'What makes a group of people unique?', 1, 0),
    (v_tenant, v_ch, 'What is diversity?', 'The presence of many different kinds of people, cultures, and backgrounds in a community.', 'Think about all the different cultures in your school.', 1, 1),
    (v_tenant, v_ch, 'Why is cultural diversity valuable?', 'It makes communities more creative, interesting, and resilient by bringing many perspectives together.', 'What do we gain from learning about other cultures?', 1, 2);

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Metis & First Nations Contributions',
    'Explore the many contributions that Metis and First Nations peoples have made to Saskatchewan and Canada.',
    'Metis and First Nations peoples have shaped every aspect of Saskatchewan''s culture, economy, and identity.',
    'How have Metis and First Nations peoples contributed to the development of Saskatchewan?')
  RETURNING id INTO v_unit;

  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Metis & First Nations Contributions', 'metis-first-nations-contributions',
    'Celebrate the contributions of Metis and First Nations peoples to Saskatchewan''s history, culture, and society.',
    '[
      {"type": "heading", "level": 1, "text": "Metis & First Nations Contributions"},
      {"type": "text", "content": "The Metis and First Nations peoples of Saskatchewan have contributed enormously to the province''s identity, economy, and culture. Long before European settlement, First Nations peoples developed sophisticated knowledge systems, trade networks, and governance structures that allowed them to thrive on these lands for thousands of years. This knowledge did not disappear — it continues to shape life in Saskatchewan today."},
      {"type": "text", "content": "The Metis people emerged in the eighteenth and nineteenth centuries as a distinct culture born from the mixing of First Nations and European — primarily French — heritage. Metis people played a crucial role in the fur trade as guides, interpreters, and traders. They developed the Red River Cart, a sturdy wooden vehicle that could be pulled by oxen or horses to carry heavy loads across the prairies. Metis communities established settlements along major river routes across the west."},
      {"type": "callout", "style": "info", "title": "Who Are the Metis?", "content": "The Metis are a distinct Indigenous people who emerged from the blending of First Nations and European heritage, primarily in the 18th and 19th centuries. They have their own language (Michif), culture, flag, and political organizations. The Metis Nation of Saskatchewan represents Metis citizens across the province."},
      {"type": "list", "style": "unordered", "items": ["First Nations peoples developed trade networks, governance, and ecological knowledge over thousands of years", "Metis people were essential guides and traders in the fur trade era", "The Red River Cart was a Metis invention that transformed prairie transportation", "Louis Riel, a Metis leader, fought for Metis land rights in the Northwest Resistance of 1885", "Indigenous knowledge of plants, medicine, and land management continues to benefit all people"]},
      {"type": "text", "content": "First Nations peoples contributed critical knowledge to early European explorers and settlers. They taught newcomers which plants were edible and which were medicinal, how to travel and survive in the Canadian winter, and how to navigate the waterways of the prairies and boreal forest. Without this knowledge sharing, early European settlement would have been far more difficult."},
      {"type": "callout", "style": "tip", "title": "Living Contributions", "content": "The contributions of Metis and First Nations peoples are not just historical — they are ongoing. Indigenous artists, writers, musicians, scientists, educators, politicians, and entrepreneurs are active contributors to Saskatchewan''s contemporary culture and economy. Figures like Cree artist Allen Sapp, Metis author Maria Campbell, and many others have shaped Canadian culture. Indigenous-led businesses and organizations continue to grow across the province."},
      {"type": "quiz", "question": "What was the Red River Cart?", "options": ["A type of boat used on the Red River", "A Metis-invented wooden vehicle for transporting goods across the prairies", "A railway car used to carry settlers west", "A type of sled used for winter travel"], "correctIndex": 1, "explanation": "The Red River Cart was a sturdy wooden vehicle invented by the Metis people for transporting heavy loads across the prairies. It was built entirely without metal, making it easy to repair on long journeys."}
    ]'::jsonb,
    '[
      {"term": "Metis", "definition": "A distinct Indigenous people with heritage from both First Nations and European (primarily French) ancestry, with their own culture, language, and identity."},
      {"term": "Michif", "definition": "The language of the Metis people, blending Cree and French elements."},
      {"term": "Red River Cart", "definition": "A sturdy wooden cart invented by the Metis for hauling goods across the prairies, built without metal."},
      {"term": "Fur Trade", "definition": "The historical exchange of animal furs for European goods, which shaped early Canadian history."},
      {"term": "Louis Riel", "definition": "A Metis political leader who fought for Metis rights and led the Northwest Resistance of 1885."}
    ]'::jsonb,
    'Metis and First Nations peoples built the foundations of what became Saskatchewan. Their governance systems, ecological knowledge, trade networks, and cultural traditions shaped the land and its communities long before European arrival, and their contributions continue to enrich the province today.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Who are the Metis people?', 'A distinct Indigenous people with both First Nations and European heritage, with their own culture and language called Michif.', 'Think about a blending of two cultures.', 1, 0),
    (v_tenant, v_ch, 'What was the Red River Cart used for?', 'Transporting heavy loads across the prairies — a Metis invention made entirely of wood.', 'Think about prairie transportation before railways.', 1, 1),
    (v_tenant, v_ch, 'Who was Louis Riel?', 'A Metis leader who fought for Metis rights and led the Northwest Resistance of 1885.', 'He is an important figure in Metis history.', 2, 2);

END;
$$;


-- ============================================================================
-- TEXTBOOK: WolfWhale Social Studies 3
-- Slug: wolfwhale-social-studies-3
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-social-studies-3';

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Communities Around the World',
    'Compare communities from different parts of the world and discover what makes each unique.',
    'Communities around the world share basic needs but meet them in remarkably different ways shaped by geography, culture, and history.',
    'How are communities around the world both similar and different?')
  RETURNING id INTO v_unit;

  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Communities Around the World', 'communities-around-the-world',
    'Compare how communities in different parts of the world meet needs, celebrate culture, and organize themselves.',
    '[
      {"type": "heading", "level": 1, "text": "Communities Around the World"},
      {"type": "text", "content": "People live in communities on every continent on Earth. Whether in the crowded streets of Tokyo, the fishing villages of West Africa, the rainforest communities of Brazil, or the prairie towns of Saskatchewan, all communities share some basic features. They all have places to live, ways to get food, systems for looking after one another, and traditions that bring people together."},
      {"type": "text", "content": "However, communities around the world look very different from each other. A community in the Sahara Desert has adapted to extreme heat and scarce water. A community in the Arctic has learned to build warm shelters and hunt in icy conditions. A community in the monsoon regions of South Asia has built its rhythms around heavy seasonal rains. Geography — the physical environment — shapes almost every aspect of community life."},
      {"type": "callout", "style": "info", "title": "Comparing Communities", "content": "When we compare communities, we look at how they meet common needs differently. We also look for things they share: family, celebration, work, leadership, and connection to the land."},
      {"type": "list", "style": "unordered", "items": ["All communities have systems for getting food, whether farming, fishing, herding, or hunting", "All communities have some form of leadership or governance", "All communities have ways of celebrating and passing on traditions", "Geography shapes what communities look like, eat, and how they shelter"]},
      {"type": "text", "content": "Comparing communities helps us understand that there is no single right way to organize human life. Each community''s approach to meeting needs is shaped by its environment, history, and values. Learning about other communities expands our understanding of what is possible and builds respect for different ways of living."},
      {"type": "callout", "style": "tip", "title": "Indigenous Communities and Land Relationships", "content": "Indigenous communities around the world share a deep relationship with their specific lands and ecosystems. First Nations communities in Saskatchewan organized their lives around the prairies and parklands — following bison, harvesting wild plants, and fishing the rivers. Communities in the Pacific Northwest organized around salmon. Communities in the Arctic organized around caribou and sea mammals. Each relationship with the land produced a unique and sophisticated way of life."},
      {"type": "quiz", "question": "What is the main factor that shapes how a community meets its needs?", "options": ["The number of people living there", "The geography and physical environment of the area", "How many schools the community has", "The language people speak"], "correctIndex": 1, "explanation": "Geography — the physical environment — is the primary factor shaping what resources are available and how communities develop systems to meet their needs."}
    ]'::jsonb,
    '[
      {"term": "Continent", "definition": "One of the seven major land masses on Earth: Africa, Antarctica, Asia, Australia, Europe, North America, and South America."},
      {"term": "Geography", "definition": "The physical features of a place, including landforms, climate, and water."},
      {"term": "Adapt", "definition": "To change or adjust to suit a new or different environment or situation."},
      {"term": "Ecosystem", "definition": "A community of living things interacting with each other and their physical environment."},
      {"term": "Comparison", "definition": "Looking at two or more things to find what they have in common and how they differ."}
    ]'::jsonb,
    'Indigenous communities around the world share a fundamental characteristic: a deep, specific relationship with their land. First Nations peoples in Saskatchewan organized entire ways of life around the prairies, parklands, rivers, and boreal forest. This relationship was not just practical but spiritual, reflecting values of reciprocity and respect for the natural world.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What do all communities around the world have in common?', 'All communities have systems for food, shelter, leadership, celebration, and caring for one another.', 'Think about basic human needs.', 1, 0),
    (v_tenant, v_ch, 'What is the main factor that shapes how communities develop?', 'Geography — the physical environment, including landforms, climate, and available resources.', 'Think about where a community is located.', 2, 1),
    (v_tenant, v_ch, 'What does "adapt" mean?', 'To change or adjust to suit a different environment or situation.', 'How do communities survive in different climates?', 1, 2);

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Cultural Diversity & Respect',
    'Deepen understanding of cultural diversity and develop skills for respectful cross-cultural interaction.',
    'Respecting cultural diversity requires curiosity, humility, and the willingness to listen and learn.',
    'How can we show respect for cultures different from our own?')
  RETURNING id INTO v_unit;

  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Cultural Diversity & Respect', 'cultural-diversity-respect',
    'Learn how to approach cultural differences with curiosity and respect, and understand the harm caused by stereotypes.',
    '[
      {"type": "heading", "level": 1, "text": "Cultural Diversity & Respect"},
      {"type": "text", "content": "Cultural diversity means the presence of many different cultures within a community or country. Canada is one of the most culturally diverse countries in the world. People from more than 200 countries have made Canada their home. This diversity brings richness to Canadian life through food, art, music, language, and ideas. But diversity also brings challenges — it requires people to learn how to understand and respect each other."},
      {"type": "text", "content": "A stereotype is a fixed, oversimplified belief about a group of people. Stereotypes are harmful because they reduce complex, diverse groups of people to a single image that is rarely accurate. Assuming that everyone from a particular country eats the same food or shares the same views is a stereotype. Learning to question stereotypes and seek out real information is an important skill for citizens in a diverse society."},
      {"type": "callout", "style": "info", "title": "What Is a Stereotype?", "content": "A stereotype is a generalization about a group of people that treats all members of the group as identical. Stereotypes ignore the enormous diversity within any group and can lead to unfair treatment and misunderstanding."},
      {"type": "list", "style": "unordered", "items": ["Approach other cultures with curiosity and openness", "Ask questions respectfully rather than making assumptions", "Recognize that your own culture is just one of many equally valid ways of life", "Challenge stereotypes when you encounter them", "Listen to people''s own descriptions of their cultural identity"]},
      {"type": "text", "content": "Cultural respect does not mean treating all cultures as if they are the same. It means recognizing that each culture has its own logic, values, and beauty, and that understanding those things requires effort, listening, and humility. Respectful curiosity — asking honest questions and listening carefully to the answers — is one of the most powerful tools for building cross-cultural understanding."},
      {"type": "callout", "style": "tip", "title": "Respecting Indigenous Cultures", "content": "Indigenous peoples in Canada have often experienced harmful stereotypes in media, education, and everyday life. Showing genuine respect for First Nations, Metis, and Inuit cultures means learning from Indigenous people themselves — reading books by Indigenous authors, attending cultural events when invited, and listening to Elders'' teachings. It also means understanding the historical harm caused by stereotyping and working to challenge those representations when we see them."},
      {"type": "quiz", "question": "What is a stereotype?", "options": ["An accurate summary of a culture", "A fixed, oversimplified belief about a group of people", "A type of cultural celebration", "A way of learning about other cultures"], "correctIndex": 1, "explanation": "A stereotype is a generalization that treats all members of a group as the same, ignoring the real diversity within the group. Stereotypes are often inaccurate and can cause harm."}
    ]'::jsonb,
    '[
      {"term": "Stereotype", "definition": "A fixed, oversimplified belief about a group of people that ignores individual differences."},
      {"term": "Prejudice", "definition": "An unfair negative opinion about a person or group based on limited information or stereotypes."},
      {"term": "Humility", "definition": "The quality of being open to learning from others and recognizing the limits of your own knowledge."},
      {"term": "Cross-cultural", "definition": "Involving or comparing two or more different cultures."},
      {"term": "Identity", "definition": "The characteristics, beliefs, and experiences that make a person or group who they are."}
    ]'::jsonb,
    'Indigenous peoples in Canada have long experienced harmful stereotypes in media and public discourse. Genuine respect for First Nations, Metis, and Inuit cultures requires learning from Indigenous people themselves, listening to their teachings, and actively challenging misrepresentations when encountered.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a stereotype?', 'A fixed, oversimplified belief about a group of people that ignores individual differences.', 'Think about unfair generalizations.', 2, 0),
    (v_tenant, v_ch, 'How can you show respect for another culture?', 'By approaching it with curiosity, asking respectful questions, listening, and challenging stereotypes.', 'Think about humility and openness.', 2, 1),
    (v_tenant, v_ch, 'What does cultural diversity mean?', 'The presence of many different cultures within a community or country.', 'Think about the many backgrounds of Canadians.', 1, 2);

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Global Citizenship',
    'Explore what it means to be a responsible citizen in a globally connected world.',
    'Global citizens recognize that their actions affect people and environments beyond their immediate community.',
    'What responsibilities do I have as a citizen of both a local community and the wider world?')
  RETURNING id INTO v_unit;

  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Global Citizenship', 'global-citizenship',
    'Understand global connections and develop a sense of responsibility toward communities beyond your own.',
    '[
      {"type": "heading", "level": 1, "text": "Global Citizenship"},
      {"type": "text", "content": "We live in a connected world. The clothes you wear may have been made in Vietnam or Bangladesh. The bananas in your kitchen likely came from Ecuador or the Philippines. The phone or tablet you use was assembled from parts made in many different countries. Our daily lives are connected to people and places around the globe, even when we are not aware of it."},
      {"type": "text", "content": "A global citizen is someone who understands these connections and feels a sense of responsibility toward people and environments beyond their own community. Global citizens recognize that poverty, environmental damage, and injustice in one part of the world can affect everyone. They are curious about other cultures and committed to treating all people with dignity and fairness."},
      {"type": "callout", "style": "info", "title": "What Is a Global Citizen?", "content": "A global citizen is a person who understands that their actions and choices connect them to people and environments around the world, and who takes responsibility for those connections by acting with fairness and care."},
      {"type": "list", "style": "unordered", "items": ["Learn about issues that affect communities in other parts of the world", "Consider how your purchases and consumption affect people elsewhere", "Treat people from all backgrounds with dignity and respect", "Support organizations that help people in need around the world", "Reduce your environmental footprint to protect the global environment"]},
      {"type": "text", "content": "Global citizenship starts small. Choosing fair trade products, learning about another country''s culture, reducing waste, and welcoming newcomers to your community are all acts of global citizenship. When people in communities across the world make these kinds of choices, the cumulative effect can be enormous."},
      {"type": "callout", "style": "tip", "title": "Indigenous Global Citizenship", "content": "Many Indigenous peoples in Canada have long understood themselves as citizens of the land — responsible not just to their human community but to all living things. The concept of being a responsible steward of the Earth for seven generations into the future is found in many Indigenous governance traditions. This long-term, interconnected view of responsibility offers powerful guidance for all global citizens today."},
      {"type": "quiz", "question": "What is a global citizen?", "options": ["Someone who has travelled to many countries", "Someone who understands global connections and takes responsibility for their impact on others", "Someone who speaks many languages", "Someone who works for an international organization"], "correctIndex": 1, "explanation": "A global citizen is defined by awareness and responsibility, not by travel or language. It means understanding how our choices affect people and environments around the world and acting accordingly."}
    ]'::jsonb,
    '[
      {"term": "Global Citizen", "definition": "A person who understands global connections and takes responsibility for their impact on people and environments around the world."},
      {"term": "Interconnected", "definition": "Linked or connected so that each part affects the others."},
      {"term": "Fair Trade", "definition": "A system of buying and selling that ensures producers in developing countries receive fair payment for their work."},
      {"term": "Dignity", "definition": "The right of every person to be treated with respect and as having inherent worth."},
      {"term": "Stewardship", "definition": "Responsible care and management of something entrusted to one''s keeping, especially the natural environment."}
    ]'::jsonb,
    'Many Indigenous governance traditions include the concept of responsibility to all living things and to future generations. The principle of making decisions with seven generations in the future in mind is found across many First Nations traditions and reflects a profound understanding of global and intergenerational citizenship.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a global citizen?', 'A person who understands global connections and takes responsibility for their impact on people and environments worldwide.', 'Think about how your choices affect others far away.', 2, 0),
    (v_tenant, v_ch, 'Name two actions of a global citizen.', 'Examples: buying fair trade, reducing waste, welcoming newcomers, learning about other cultures, supporting international aid.', 'Think about small actions with big impacts.', 1, 1),
    (v_tenant, v_ch, 'How are we connected to people in other countries?', 'Through trade — the food we eat, clothing we wear, and technology we use often comes from many different countries.', 'Think about where everyday items come from.', 2, 2);

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Indigenous Governance Systems',
    'Explore the governance traditions of First Nations peoples and how they organized community decision-making.',
    'Indigenous peoples developed sophisticated governance systems long before European contact, reflecting values of consensus, responsibility, and relationship.',
    'How did First Nations peoples govern their communities, and what can these traditions teach us today?')
  RETURNING id INTO v_unit;

  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Indigenous Governance Systems', 'indigenous-governance-systems',
    'Explore how First Nations communities organized leadership, decision-making, and community life.',
    '[
      {"type": "heading", "level": 1, "text": "Indigenous Governance Systems"},
      {"type": "text", "content": "Long before Europeans arrived in North America, First Nations peoples had developed sophisticated systems for governing their communities. These systems varied greatly from nation to nation but shared some common principles: decisions were made for the good of the whole community, the voices of Elders were respected, leaders earned their authority through wisdom and service, and the land and all living things were considered in decision-making."},
      {"type": "text", "content": "Among the Cree and Assiniboine peoples of the prairies, chiefs were community leaders chosen for their skill, wisdom, and ability to reach consensus — agreement among all members of the group. Leadership was not about power over others but about responsibility for others. A chief who made poor decisions or acted selfishly could lose the community''s confidence and their position."},
      {"type": "callout", "style": "info", "title": "Consensus Decision-Making", "content": "Consensus means that a decision is made only when everyone, or nearly everyone, agrees. Rather than voting where the majority wins and the minority loses, consensus seeks a solution that works for all. Many First Nations governance traditions relied on this approach."},
      {"type": "list", "style": "unordered", "items": ["First Nations leaders earned authority through wisdom, generosity, and service", "Elders held special roles as advisors and knowledge keepers", "Decisions were made by consensus — seeking agreement from all", "Women often held important roles in governance and decision-making", "The welfare of future generations was considered in every major decision"]},
      {"type": "text", "content": "The Haudenosaunee (Iroquois) Confederacy, located in what is now Ontario and New York State, developed one of the most sophisticated democratic systems in the world. Historians have argued that it influenced the founders of the United States government. The Confederacy united six nations under a Great Law of Peace that outlined the rights and responsibilities of member nations and their leaders."},
      {"type": "callout", "style": "tip", "title": "Governance on the Prairies", "content": "On the Saskatchewan prairies, Cree, Assiniboine, and Saulteaux bands held councils where leaders gathered to make decisions about seasonal movements, trade, conflict resolution, and ceremonies. Band councils were guided by principles of generosity, consensus, and responsibility to the community. These traditions were deliberately suppressed during the colonial period but have been revitalized by many First Nations communities in Saskatchewan today."},
      {"type": "quiz", "question": "What does consensus mean in governance?", "options": ["The leader makes all the decisions alone", "A vote where the majority wins", "A decision reached when all or nearly all members agree", "A rule that only Elders can vote"], "correctIndex": 2, "explanation": "Consensus means reaching a decision that everyone, or nearly everyone, agrees with. It differs from majority voting because it seeks agreement from all rather than allowing a minority to be overruled."}
    ]'::jsonb,
    '[
      {"term": "Governance", "definition": "The system by which a community or organization makes decisions and manages its affairs."},
      {"term": "Consensus", "definition": "A decision-making process that seeks agreement from all or nearly all members of a group."},
      {"term": "Elder", "definition": "A respected older member of an Indigenous community who holds traditional knowledge and wisdom."},
      {"term": "Chief", "definition": "In many First Nations traditions, a community leader chosen for wisdom and the ability to serve the community well."},
      {"term": "Band Council", "definition": "A governing body of a First Nations community, consisting of a chief and councillors."}
    ]'::jsonb,
    'First Nations peoples across what is now Saskatchewan developed sophisticated governance systems rooted in consensus, respect for Elders, and responsibility to the land and future generations. These systems were deliberately undermined during the colonial period. Today, many First Nations communities are actively revitalizing their governance traditions.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is consensus?', 'A decision reached when all or nearly all members of a group agree.', 'Think about everyone having a voice.', 2, 0),
    (v_tenant, v_ch, 'How did First Nations chiefs earn their authority?', 'Through wisdom, generosity, and service to the community — not through inherited power.', 'Think about how leadership was earned.', 2, 1),
    (v_tenant, v_ch, 'What role did Elders play in First Nations governance?', 'Elders served as advisors and knowledge keepers, guiding decisions with traditional wisdom.', 'Think about the respected role of older community members.', 2, 2);

END;
$$;


-- ============================================================================
-- TEXTBOOK: WolfWhale Social Studies 4
-- Slug: wolfwhale-social-studies-4
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-social-studies-4';

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'First Nations Before Contact',
    'Explore the cultures, economies, and governance of the First Nations peoples who inhabited the prairies before European arrival.',
    'First Nations peoples developed rich, complex civilizations perfectly adapted to the prairies long before European contact.',
    'How did First Nations peoples live on the prairies before European contact, and what can we learn from their ways of life?')
  RETURNING id INTO v_unit;

  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'First Nations Before Contact', 'first-nations-before-contact',
    'Examine the sophisticated cultures, knowledge systems, and ways of life of the First Nations peoples of the prairies before European arrival.',
    '[
      {"type": "heading", "level": 1, "text": "First Nations Before Contact"},
      {"type": "text", "content": "For thousands of years before any European set foot on the prairies, the lands of what is now Saskatchewan were home to thriving First Nations civilizations. The Cree, Assiniboine, Nakoda (Stoney), Saulteaux (Plains Ojibwe), Blackfoot, and Dene peoples each developed sophisticated cultures, economies, and governance systems perfectly suited to the environments in which they lived. Calling these societies ''primitive'' — as early European accounts often did — completely misunderstands the remarkable complexity of pre-contact Indigenous life."},
      {"type": "text", "content": "The bison was the cornerstone of life for many prairie First Nations. A single bison provided meat for food, hide for clothing and shelter, bones for tools, fat for waterproofing, and sinew for thread. Hunters developed ingenious methods for harvesting bison, including the buffalo jump — driving herds off cliffsides — and the surroundand, where hunters on foot or horseback encircled a herd. The entire community participated in the hunt and in processing the animals afterward, and nothing was wasted."},
      {"type": "callout", "style": "info", "title": "The Importance of the Bison", "content": "Bison (often called buffalo) were central to the lives of many prairie First Nations peoples. Every part of the animal was used: meat for food, hide for tipi coverings and clothing, bones for tools, and dung for fuel. The bison was not just an economic resource but a sacred relative in many cultural and spiritual traditions."},
      {"type": "list", "style": "unordered", "items": ["Bison provided food, shelter, clothing, tools, and fuel", "First Nations peoples had extensive trade networks across the prairies", "Seasonal movements followed resources — bison in summer, sheltered valleys in winter", "Oral traditions preserved history, science, law, and spirituality across generations", "Women held important roles in processing resources and in community governance"]},
      {"type": "text", "content": "Pre-contact First Nations peoples also maintained extensive trade networks. Items such as copper from the Great Lakes, obsidian from the Rocky Mountains, and shells from the Pacific Coast were traded across thousands of kilometres. Trade was not just economic — it was also diplomatic, creating alliances and relationships between nations."},
      {"type": "callout", "style": "tip", "title": "Knowledge Systems Before Contact", "content": "First Nations peoples developed deep knowledge of astronomy, botany, medicine, engineering, and ecology over thousands of years. Cree and Nakoda peoples used star patterns to navigate and to mark the seasons. Plains peoples engineered sophisticated fish weirs and game drives. Healers identified hundreds of medicinal plants, knowledge that has contributed to modern pharmacology. This was not folk wisdom but a systematic, empirically developed body of knowledge."},
      {"type": "quiz", "question": "What was the most important animal in the economy and culture of many prairie First Nations before European contact?", "options": ["The wolf", "The elk", "The bison", "The beaver"], "correctIndex": 2, "explanation": "The bison was central to the lives of prairie First Nations peoples, providing food, shelter, clothing, tools, and fuel. Every part of the animal was used, and the bison held deep cultural and spiritual significance."}
    ]'::jsonb,
    '[
      {"term": "Pre-contact", "definition": "The period before European explorers and settlers arrived in North America."},
      {"term": "Bison", "definition": "A large mammal native to the North American plains, central to the culture and economy of many prairie First Nations peoples."},
      {"term": "Buffalo Jump", "definition": "A hunting method used by prairie peoples in which bison were driven off a cliff, allowing a large harvest."},
      {"term": "Trade Network", "definition": "A system of routes and relationships through which goods are exchanged between different groups or communities."},
      {"term": "Oral Tradition", "definition": "The passing of knowledge, history, law, and stories from generation to generation through spoken word rather than writing."}
    ]'::jsonb,
    'First Nations peoples of the prairies developed civilizations of extraordinary depth and sophistication over thousands of years. Their knowledge of astronomy, botany, medicine, and ecology, their trade networks, governance systems, and spiritual traditions represent a profound human achievement that deserves full recognition.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Why was the bison so important to prairie First Nations peoples?', 'It provided food, clothing, shelter, tools, and fuel — every part was used. It also held deep spiritual significance.', 'Think about all the different uses of one animal.', 2, 0),
    (v_tenant, v_ch, 'What is a buffalo jump?', 'A hunting method where bison were driven off a cliff to allow a large harvest.', 'Think about geography used as a hunting tool.', 2, 1),
    (v_tenant, v_ch, 'What is oral tradition?', 'The passing of knowledge, history, and stories from generation to generation through spoken word.', 'Think about how knowledge was preserved without writing.', 2, 2);

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'The Fur Trade',
    'Explore the fur trade era, its impact on Indigenous peoples, and the relationships it created between First Nations and European traders.',
    'The fur trade created new partnerships and dependencies between Indigenous peoples and Europeans, reshaping both ways of life.',
    'How did the fur trade change life for Indigenous peoples and European traders on the prairies?')
  RETURNING id INTO v_unit;

  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'The Fur Trade', 'the-fur-trade',
    'Examine the fur trade as an economic, cultural, and social force that reshaped the lives of Indigenous peoples and European traders.',
    '[
      {"type": "heading", "level": 1, "text": "The Fur Trade"},
      {"type": "text", "content": "The fur trade was one of the earliest and most significant forms of commerce between Indigenous peoples and European newcomers in North America. Beginning in the 1500s along the Atlantic coast and spreading westward over the next two centuries, the trade in beaver pelts and other animal furs connected Indigenous hunters and traders to markets in Europe, where fur hats and coats were enormously fashionable."},
      {"type": "text", "content": "The Hudson''s Bay Company, chartered in 1670, established trading posts called forts across what is now Canada. In Saskatchewan, forts like Cumberland House (established 1774) and Fort Carlton were important nodes in the trading network. First Nations peoples traded furs for European goods including metal tools, cooking pots, blankets, glass beads, and guns. Initially this trade appeared mutually beneficial, but over time it created serious problems for Indigenous communities."},
      {"type": "callout", "style": "info", "title": "The Hudson''s Bay Company", "content": "The Hudson''s Bay Company (HBC) was chartered by the British Crown in 1670, granting it exclusive trading rights over a vast territory called Rupert''s Land, which included most of what is now western Canada. The HBC operated trading posts where Indigenous peoples exchanged furs for European goods."},
      {"type": "list", "style": "unordered", "items": ["The fur trade linked prairie peoples to global markets for the first time", "First Nations knowledge and skills were essential to the trade''s success", "Metis people emerged as a distinct people from fur trade partnerships", "European diseases devastated Indigenous communities with no prior immunity", "Dependence on European goods began to reshape traditional economies"]},
      {"type": "text", "content": "The fur trade could not have functioned without Indigenous knowledge and participation. First Nations peoples knew the land, knew how to trap and prepare furs, and could navigate the rivers and lakes that served as the highways of the trade. Cree and Assiniboine traders acted as middlemen, connecting more distant nations to trading posts. The North West Company employed Indigenous guides and interpreters extensively."},
      {"type": "callout", "style": "tip", "title": "The Fur Trade and Indigenous Peoples", "content": "While the fur trade brought new materials and economic opportunities, it also brought devastating consequences for many First Nations communities. European diseases like smallpox and measles, to which Indigenous peoples had no immunity, swept through communities with catastrophic mortality. As the trade expanded, traditional economies were reshaped and dependence on European goods grew. Understanding both the partnerships and the harms of the fur trade is essential to understanding this period honestly."},
      {"type": "quiz", "question": "Why were First Nations peoples essential to the success of the fur trade?", "options": ["They provided the ships to carry furs to Europe", "They supplied the capital to finance trading posts", "They had the knowledge, skills, and geographic expertise that made the trade possible", "They manufactured the European goods traded for furs"], "correctIndex": 2, "explanation": "First Nations peoples were essential because they knew the land, had the trapping expertise, understood the river routes, and often served as middlemen connecting distant communities to trading posts. The trade simply could not have functioned without them."}
    ]'::jsonb,
    '[
      {"term": "Fur Trade", "definition": "The historical trade of animal furs between Indigenous peoples and European companies, especially beaver pelts for European goods."},
      {"term": "Hudson''s Bay Company", "definition": "A British trading company established in 1670 that dominated the fur trade in western Canada."},
      {"term": "Fort", "definition": "A fortified trading post where Indigenous peoples and European traders exchanged goods."},
      {"term": "Rupert''s Land", "definition": "The vast territory claimed by the Hudson''s Bay Company, covering most of what is now western and central Canada."},
      {"term": "Middleman", "definition": "A trader who connects producers with buyers, exchanging goods between different groups."}
    ]'::jsonb,
    'First Nations peoples were not passive participants in the fur trade — they were active agents who negotiated terms, provided essential expertise, and shaped the trade to serve their own interests. However, the trade also brought devastating consequences including epidemic disease, economic disruption, and eventual loss of land. A full understanding of the fur trade requires recognizing both dimensions.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What was traded in the fur trade?', 'Indigenous peoples traded animal furs (especially beaver pelts) for European goods like metal tools, blankets, and guns.', 'Think about what both sides wanted.', 2, 0),
    (v_tenant, v_ch, 'What is the Hudson''s Bay Company?', 'A British trading company chartered in 1670 that dominated the fur trade across western Canada.', 'Think about the initials HBC and the old forts.', 2, 1),
    (v_tenant, v_ch, 'Name one negative effect of the fur trade on Indigenous peoples.', 'Examples: epidemic diseases, growing dependence on European goods, disruption of traditional economies.', 'Think about unintended consequences.', 2, 2);

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Confederation & Saskatchewan',
    'Trace the path from Confederation in 1867 to Saskatchewan becoming a province in 1905.',
    'Saskatchewan''s creation as a province was the result of political decisions that profoundly affected the Indigenous and Metis peoples already living there.',
    'How did Saskatchewan become a province, and what did this process mean for the people already living here?')
  RETURNING id INTO v_unit;

  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Confederation & Saskatchewan', 'confederation-saskatchewan',
    'Explore the creation of Canada in 1867 and Saskatchewan''s path to becoming the ninth province in 1905.',
    '[
      {"type": "heading", "level": 1, "text": "Confederation & Saskatchewan"},
      {"type": "text", "content": "Canada became a country on July 1, 1867, when the British North America Act united the provinces of Ontario, Quebec, New Brunswick, and Nova Scotia into a new federation called the Dominion of Canada. The architects of Confederation, including Sir John A. Macdonald and George-Etienne Cartier, envisioned a country stretching from the Atlantic to the Pacific. To achieve this, they would need to acquire the vast western lands held by the Hudson''s Bay Company."},
      {"type": "text", "content": "In 1869-70, Canada purchased Rupert''s Land from the Hudson''s Bay Company for 300,000 pounds. However, nobody consulted the 10,000 to 12,000 people already living there — mostly Metis communities centred around the Red River settlement in what is now Winnipeg. The Metis, led by Louis Riel, resisted this unilateral takeover. Their resistance led to the Manitoba Act of 1870, which created the province of Manitoba and promised Metis land rights. However, those promises were largely broken over the following decades."},
      {"type": "callout", "style": "info", "title": "What Is Confederation?", "content": "Confederation is the process by which Canada was formed. In 1867, four provinces united into a new country. Over the following decades, more provinces and territories joined. Saskatchewan became the ninth province on September 1, 1905."},
      {"type": "list", "style": "unordered", "items": ["Canada was created in 1867 by uniting four British North American colonies", "Canada purchased Rupert''s Land in 1869 without consulting the Metis people living there", "Louis Riel led the Red River Resistance to protect Metis rights", "Saskatchewan became a province on September 1, 1905", "The creation of Saskatchewan brought waves of European settlers who dramatically changed the land"]},
      {"type": "text", "content": "After Manitoba joined Confederation, the remaining western lands became the Northwest Territories. Settlement accelerated dramatically after the Canadian Pacific Railway was completed in 1885, bringing tens of thousands of settlers to the prairies. By 1905, the population of the territories had grown enough that two new provinces — Alberta and Saskatchewan — were created. Saskatchewan''s first provincial capital was Regina."},
      {"type": "callout", "style": "tip", "title": "Impact on Indigenous and Metis Peoples", "content": "The creation of Canada and the opening of the west to settlement had catastrophic consequences for Indigenous and Metis peoples. The bison, central to prairie life, were hunted nearly to extinction by the 1880s. First Nations peoples were moved onto reserves far smaller than their traditional territories. The Northwest Resistance of 1885, in which Metis and some First Nations communities fought to protect their land and rights, ended in defeat and the hanging of Louis Riel. These events transformed the prairies forever."},
      {"type": "quiz", "question": "When did Saskatchewan become a province?", "options": ["July 1, 1867", "November 5, 1873", "September 1, 1905", "January 1, 1920"], "correctIndex": 2, "explanation": "Saskatchewan became Canada''s ninth province on September 1, 1905, along with Alberta, which became the eighth province on the same day."}
    ]'::jsonb,
    '[
      {"term": "Confederation", "definition": "The process by which Canada was formed, beginning in 1867 when four provinces united into the Dominion of Canada."},
      {"term": "Dominion of Canada", "definition": "The name given to Canada when it became a self-governing nation in 1867."},
      {"term": "Rupert''s Land", "definition": "The vast territory sold to Canada by the Hudson''s Bay Company in 1869, covering most of western and central Canada."},
      {"term": "Northwest Resistance", "definition": "The 1885 armed conflict in which Metis and some First Nations peoples fought against the Canadian government to protect their land and rights."},
      {"term": "Province", "definition": "A self-governing region within Canada. Saskatchewan became a province in 1905."}
    ]'::jsonb,
    'The creation of Saskatchewan as a province came at enormous cost to Indigenous and Metis peoples already living there. The destruction of the bison, the breaking of Metis land promises, forced relocation to reserves, and the defeat of the 1885 Northwest Resistance all transformed Indigenous life on the prairies. These events must be understood as part of Saskatchewan''s founding story.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'When did Canada become a country?', 'July 1, 1867, when four British North American provinces united into the Dominion of Canada.', 'This date is now Canada Day.', 2, 0),
    (v_tenant, v_ch, 'When did Saskatchewan become a province?', 'September 1, 1905.', 'It was the ninth province to join Canada.', 2, 1),
    (v_tenant, v_ch, 'Who was Louis Riel?', 'A Metis leader who led resistance against the Canadian government to protect Metis land rights.', 'He is a central figure in Metis history and Canadian history.', 2, 2);

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Treaty-Making Process',
    'Examine the numbered Treaties of Saskatchewan, why they were made, and what both parties understood them to mean.',
    'Treaties were solemn agreements made between sovereign nations, and understanding them from both perspectives is essential to reconciliation.',
    'What were the Treaties, why were they made, and what do they mean for people living in Saskatchewan today?')
  RETURNING id INTO v_unit;

  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Treaty-Making Process', 'treaty-making-process',
    'Examine the numbered Treaties of Saskatchewan from both First Nations and Canadian government perspectives.',
    '[
      {"type": "heading", "level": 1, "text": "Treaty-Making Process"},
      {"type": "text", "content": "Between 1871 and 1906, the Canadian government negotiated a series of numbered Treaties with First Nations peoples across western Canada. Saskatchewan is covered by Treaties 2, 4, 5, 6, 8, and 10. These Treaties were not gifts from Canada to First Nations peoples — they were formal agreements between sovereign nations, negotiated by leaders on both sides who had specific and sometimes very different understandings of what was being agreed to."},
      {"type": "text", "content": "From the Canadian government''s perspective, the Treaties were about acquiring land for settlement. The government needed peaceful access to the prairies to build the railway and bring in settlers. In exchange for what the government called a ''surrender'' of land, it promised annual payments, reserve lands, education, health care, and the right to continue traditional activities like hunting and fishing on unoccupied land."},
      {"type": "callout", "style": "info", "title": "The Numbered Treaties", "content": "The numbered Treaties (1 through 11) were signed between 1871 and 1921. Saskatchewan is covered by Treaties 2, 4, 5, 6, 8, and 10. Each Treaty covers a specific geographic area and involves specific First Nations. All of these Treaties are still legally in effect today."},
      {"type": "list", "style": "unordered", "items": ["Treaties 4 and 6 cover most of southern and central Saskatchewan", "Treaty 6 was signed in 1876 and covers the area including Saskatoon and Prince Albert", "Treaty 4 was signed in 1874 and covers the area including Regina and Moose Jaw", "First Nations negotiators understood they were sharing the land, not surrendering it", "The Crown promised health, education, annual payments, and the right to hunt and fish"]},
      {"type": "text", "content": "From the First Nations perspective, the Treaties were about sharing the land with newcomers while retaining the right to continue their way of life. Many First Nations Elders and negotiators understood the Treaties as agreements about co-existence, not about giving up their identity, sovereignty, or connection to the land. The concept of permanently selling land was foreign to many Indigenous legal traditions. This fundamental difference in understanding has been the source of ongoing legal and political conflict ever since."},
      {"type": "callout", "style": "tip", "title": "Treaties as Living Documents", "content": "First Nations peoples in Saskatchewan consistently describe the Treaties as living agreements that continue to create obligations today. The promise of health, education, and economic support was understood to last as long as the sun shines, the grass grows, and the rivers flow — phrases used in many Treaty negotiations. These are not historical curiosities but legally binding commitments that the Canadian government and all Canadians have a responsibility to uphold."},
      {"type": "quiz", "question": "What Treaty covers the area of Saskatoon, Saskatchewan?", "options": ["Treaty 4", "Treaty 6", "Treaty 8", "Treaty 10"], "correctIndex": 1, "explanation": "Saskatoon is located within Treaty 6 territory. Treaty 6 was signed in 1876 and covers a large area of central Saskatchewan and Alberta."}
    ]'::jsonb,
    '[
      {"term": "Numbered Treaties", "definition": "A series of eleven Treaties signed between 1871 and 1921 between the Canadian government and First Nations peoples across western and northern Canada."},
      {"term": "Sovereign", "definition": "Having independent authority and the right to govern oneself."},
      {"term": "Reserve", "definition": "Land set aside under Treaty for the exclusive use of a First Nations community."},
      {"term": "Treaty Commissioner", "definition": "A representative of the Canadian government sent to negotiate Treaty agreements with First Nations."},
      {"term": "Living Treaty", "definition": "The understanding that Treaty agreements are ongoing commitments, not historical documents, with obligations that continue today."}
    ]'::jsonb,
    'First Nations peoples understood the Treaties as agreements about sharing land and co-existing with newcomers, not about surrendering sovereignty or identity. This understanding differs significantly from the Canadian government''s interpretation, and this gap has been the source of ongoing legal and political conflict. Reconciliation requires engaging honestly with both perspectives.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What Treaty covers Saskatoon?', 'Treaty 6 territory, signed in 1876.', 'Think about central Saskatchewan.', 2, 0),
    (v_tenant, v_ch, 'What did the Canadian government promise in the Treaties?', 'Annual payments, reserve lands, education, health care, and the right to hunt and fish on unoccupied land.', 'What did the Crown offer in exchange?', 2, 1),
    (v_tenant, v_ch, 'How did First Nations peoples understand the Treaties?', 'As agreements to share the land with newcomers while retaining their way of life, sovereignty, and rights — not as a surrender of land.', 'Think about different perspectives on the same agreement.', 3, 2);

END;
$$;


-- ============================================================================
-- TEXTBOOK: WolfWhale Social Studies 5
-- Slug: wolfwhale-social-studies-5
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-social-studies-5';

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Canadian Government',
    'Understand how Canada is governed at the federal, provincial, and municipal levels.',
    'Canada''s democratic system distributes power across multiple levels of government, each with distinct responsibilities.',
    'How is Canada governed, and what is the role of each level of government in people''s daily lives?')
  RETURNING id INTO v_unit;

  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Canadian Government', 'canadian-government',
    'Learn about Canada''s three levels of government and the responsibilities of each.',
    '[
      {"type": "heading", "level": 1, "text": "Canadian Government"},
      {"type": "text", "content": "Canada is a constitutional monarchy and a parliamentary democracy. This means the country has a monarch (the King of Canada, represented in Canada by the Governor General) as the symbolic head of state, while real governing power rests with elected representatives in Parliament. The system of government is defined by the Constitution, which outlines the powers and responsibilities of different levels of government and protects the rights of all Canadians."},
      {"type": "text", "content": "Canada has three levels of government: federal, provincial or territorial, and municipal. Each level is responsible for different areas of public life. Understanding which level is responsible for which services helps citizens know where to turn when they need something or want to make their voice heard."},
      {"type": "callout", "style": "info", "title": "Three Levels of Government", "content": "Canada has three levels of government: (1) Federal — governs all of Canada from Ottawa; (2) Provincial/Territorial — governs individual provinces and territories; (3) Municipal — governs cities, towns, and rural municipalities. Each level handles different responsibilities."},
      {"type": "list", "style": "unordered", "items": ["Federal government: national defence, foreign affairs, immigration, criminal law, and money", "Provincial government: health care, education, highways, and natural resources", "Municipal government: local roads, water, garbage collection, parks, and local policing", "Citizens can vote and engage at all three levels"]},
      {"type": "text", "content": "The federal Parliament consists of two chambers: the elected House of Commons and the appointed Senate. The Prime Minister leads the party with the most seats in the House of Commons and forms the Cabinet, a group of ministers responsible for running federal departments. In Saskatchewan, the provincial legislature is the Saskatchewan Legislative Assembly, located in Regina. The Premier leads the provincial government."},
      {"type": "callout", "style": "tip", "title": "First Nations Governments", "content": "First Nations in Canada have their own governments, recognized under the Constitution. Band councils, tribal councils, and national organizations like the Federation of Sovereign Indigenous Nations (FSIN) in Saskatchewan represent First Nations peoples in political and legal matters. Treaty rights, including rights to self-governance, are protected by Section 35 of the Constitution Act of 1982. First Nations governments are a fourth level of government in Canada, with jurisdiction over their reserve lands and communities."},
      {"type": "quiz", "question": "Which level of government in Canada is responsible for health care?", "options": ["Federal", "Municipal", "Provincial", "The Crown"], "correctIndex": 2, "explanation": "Health care is a provincial responsibility in Canada. Each province operates its own health system, funded partly by provincial taxes and partly by federal transfers."}
    ]'::jsonb,
    '[
      {"term": "Constitutional Monarchy", "definition": "A system of government where a monarch is the symbolic head of state and real governing power belongs to elected representatives."},
      {"term": "Parliament", "definition": "Canada''s federal lawmaking body, consisting of the House of Commons, the Senate, and the Crown."},
      {"term": "Prime Minister", "definition": "The leader of the Canadian federal government, who is the head of the party with the most seats in the House of Commons."},
      {"term": "Premier", "definition": "The leader of a provincial government in Canada."},
      {"term": "Municipality", "definition": "A city, town, village, or rural area with its own local government."}
    ]'::jsonb,
    'First Nations governments are recognized under the Canadian Constitution as a distinct level of government. Band councils and tribal councils govern First Nations communities, and organizations like the Federation of Sovereign Indigenous Nations represent First Nations political interests in Saskatchewan. Treaty rights to self-governance are protected by Section 35 of the Constitution Act of 1982.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are Canada''s three levels of government?', 'Federal (national), provincial/territorial, and municipal (local).', 'Think from biggest to smallest geographic area.', 2, 0),
    (v_tenant, v_ch, 'What is the Premier?', 'The leader of a provincial government in Canada.', 'Think about who leads Saskatchewan''s government.', 2, 1),
    (v_tenant, v_ch, 'Which level of government is responsible for education in Saskatchewan?', 'The provincial government.', 'Think about which level handles schools.', 2, 2);

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Democracy & Voting',
    'Understand how democratic elections work in Canada and why civic participation matters.',
    'Democracy depends on the informed and active participation of all citizens.',
    'How do elections work in Canada, and why does voting matter?')
  RETURNING id INTO v_unit;

  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Democracy & Voting', 'democracy-and-voting',
    'Explore how Canadian democracy functions, how elections work, and the importance of civic participation.',
    '[
      {"type": "heading", "level": 1, "text": "Democracy & Voting"},
      {"type": "text", "content": "Democracy is a system of government in which citizens hold the power to choose their leaders and influence public decisions. The word democracy comes from the Greek words for people (demos) and rule (kratos). In a democracy, the government derives its authority from the consent of the governed — the people. Canada is a representative democracy, meaning citizens elect representatives to make decisions on their behalf."},
      {"type": "text", "content": "In Canadian federal and provincial elections, eligible voters go to polling stations to cast a ballot. Each riding or constituency elects one representative — called a Member of Parliament (MP) at the federal level or a Member of the Legislative Assembly (MLA) at the provincial level. The candidate who receives the most votes in a riding wins the seat. This system is called first-past-the-post."},
      {"type": "callout", "style": "info", "title": "How Elections Work", "content": "In a Canadian election, the country is divided into ridings (also called constituencies or electoral districts). Each riding elects one representative. The political party that wins the most ridings forms the government. The leader of that party becomes the Prime Minister or Premier."},
      {"type": "list", "style": "unordered", "items": ["Citizens 18 and older can vote in federal and provincial elections", "Ridings elect one representative each", "The party winning the most ridings forms the government", "Elections must be held at least every five years", "Secret ballots protect voters from pressure or retaliation"]},
      {"type": "text", "content": "Voting is both a right and a responsibility. People who do not vote have less influence over the decisions that affect their lives. In Canadian history, not everyone always had the right to vote. Women gained the right to vote federally in 1918. Indigenous peoples did not have full, unconditional voting rights until 1960. Understanding this history reminds us not to take democratic rights for granted."},
      {"type": "callout", "style": "tip", "title": "Indigenous Voting Rights", "content": "Indigenous peoples in Canada were denied the right to vote federally until 1960, when Prime Minister John Diefenbaker extended full voting rights without requiring Indigenous people to give up their Treaty status. Before 1960, Indigenous peoples could only vote if they abandoned their status — an unacceptable condition for most. This history of exclusion from Canadian democracy is part of why many First Nations communities continue to work for political recognition and self-determination."},
      {"type": "quiz", "question": "When did Indigenous peoples in Canada gain full, unconditional federal voting rights?", "options": ["1867", "1918", "1960", "1982"], "correctIndex": 2, "explanation": "Indigenous peoples gained full, unconditional federal voting rights in 1960 under Prime Minister Diefenbaker. Before this, they could only vote if they gave up their Treaty status, which most were unwilling to do."}
    ]'::jsonb,
    '[
      {"term": "Democracy", "definition": "A system of government in which citizens choose their leaders and have a say in public decisions."},
      {"term": "Riding", "definition": "A geographic area that elects one representative to Parliament or a provincial legislature."},
      {"term": "Ballot", "definition": "The official form used by voters to record their choice in an election."},
      {"term": "First-Past-the-Post", "definition": "An electoral system in which the candidate with the most votes in a riding wins, regardless of whether they have a majority."},
      {"term": "Member of Parliament (MP)", "definition": "An elected representative who serves in Canada''s federal House of Commons."}
    ]'::jsonb,
    'Indigenous peoples in Canada were denied the right to vote federally until 1960. Before that, voting rights required giving up Treaty status — an unacceptable condition for most First Nations people. This history of political exclusion is part of why First Nations communities continue to advocate for genuine recognition of their sovereignty and self-determination.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is democracy?', 'A system of government where citizens choose their leaders and influence public decisions.', 'Think about "people power."', 2, 0),
    (v_tenant, v_ch, 'When did Indigenous peoples gain full federal voting rights in Canada?', '1960, under Prime Minister Diefenbaker.', 'Think about a relatively recent date in Canadian history.', 2, 1),
    (v_tenant, v_ch, 'What is a riding?', 'A geographic area that elects one representative to Parliament or a provincial legislature.', 'Think about electoral districts.', 2, 2);

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Rights & Freedoms',
    'Explore the rights and freedoms guaranteed to Canadians in the Charter of Rights and Freedoms.',
    'The Canadian Charter of Rights and Freedoms protects the fundamental rights of all people in Canada.',
    'What rights and freedoms do Canadians have, and what responsibilities come with those rights?')
  RETURNING id INTO v_unit;

  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Rights & Freedoms', 'rights-and-freedoms',
    'Understand the rights and freedoms guaranteed by the Canadian Charter of Rights and Freedoms.',
    '[
      {"type": "heading", "level": 1, "text": "Rights & Freedoms"},
      {"type": "text", "content": "In 1982, Canada added the Canadian Charter of Rights and Freedoms to its Constitution. The Charter guarantees a set of basic rights and freedoms to everyone in Canada — not just Canadian citizens, but all people living under Canadian law. The Charter is a powerful legal document because any law that violates Charter rights can be struck down by the courts."},
      {"type": "text", "content": "The Charter protects fundamental freedoms such as freedom of expression, freedom of religion, freedom of peaceful assembly, and freedom of the press. It guarantees democratic rights, including the right to vote and to run for office. It protects legal rights, including the right to a fair trial and the right not to be subject to unreasonable search or detention. It also protects equality rights, guaranteeing that no person shall be discriminated against based on race, gender, religion, disability, or sexual orientation."},
      {"type": "callout", "style": "info", "title": "The Canadian Charter of Rights and Freedoms", "content": "The Charter, adopted in 1982 as part of the Constitution Act, guarantees fundamental rights to all people in Canada. It is divided into sections covering fundamental freedoms, democratic rights, mobility rights, legal rights, equality rights, and language rights."},
      {"type": "list", "style": "unordered", "items": ["Freedom of thought, belief, expression, and peaceful assembly", "The right to vote and participate in democracy", "The right to a fair trial and protection from unreasonable search", "The right to equal treatment without discrimination", "Rights in both official languages — English and French"]},
      {"type": "text", "content": "Rights come with responsibilities. Freedom of expression does not mean the freedom to harm others through hate speech. The right to peaceful assembly does not include the right to riot. The legal system must balance individual rights with the rights of the broader community. The Charter includes a limitation clause acknowledging that rights can be limited when the limitation is justified in a free and democratic society."},
      {"type": "callout", "style": "tip", "title": "Section 35: Indigenous Rights", "content": "Section 35 of the Constitution Act of 1982 recognizes and affirms existing Aboriginal and Treaty rights in Canada. This section protects the rights that First Nations, Metis, and Inuit peoples hold under Treaties and under Aboriginal law. Section 35 has been the basis of many successful court cases in which Indigenous peoples have won recognition of fishing rights, land rights, and the right to be consulted before governments make decisions affecting their territories."},
      {"type": "quiz", "question": "What does the Canadian Charter of Rights and Freedoms guarantee?", "options": ["The right to own property regardless of cost", "Basic rights and freedoms to all people living in Canada", "The right to free housing and food", "Only the rights of Canadian citizens"], "correctIndex": 1, "explanation": "The Charter guarantees basic rights and freedoms to all people in Canada — not just citizens. This includes fundamental freedoms, democratic rights, legal rights, and equality rights."}
    ]'::jsonb,
    '[
      {"term": "Charter of Rights and Freedoms", "definition": "A part of Canada''s Constitution that guarantees basic rights and freedoms to all people in Canada."},
      {"term": "Fundamental Freedoms", "definition": "Basic freedoms protected by the Charter, including freedom of expression, religion, and peaceful assembly."},
      {"term": "Equality Rights", "definition": "The Charter right to be free from discrimination based on race, gender, religion, disability, or sexual orientation."},
      {"term": "Section 35", "definition": "The section of the Constitution Act of 1982 that recognizes and protects Aboriginal and Treaty rights in Canada."},
      {"term": "Constitution", "definition": "The supreme law of Canada, which outlines the powers of government and the rights of people."}
    ]'::jsonb,
    'Section 35 of the Constitution Act of 1982 recognizes and affirms existing Aboriginal and Treaty rights. This constitutional protection has been used by First Nations, Metis, and Inuit peoples to successfully defend fishing rights, land rights, and the right to be consulted before government decisions affect their territories.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the Canadian Charter of Rights and Freedoms?', 'A part of Canada''s Constitution that guarantees basic rights and freedoms to all people in Canada.', 'Think about the document adopted in 1982.', 2, 0),
    (v_tenant, v_ch, 'Name two freedoms protected by the Charter.', 'Examples: freedom of expression, freedom of religion, freedom of assembly, freedom of the press.', 'Think about basic freedoms Canadians enjoy.', 2, 1),
    (v_tenant, v_ch, 'What does Section 35 of the Constitution protect?', 'Aboriginal and Treaty rights of First Nations, Metis, and Inuit peoples.', 'Think about Indigenous rights in the Constitution.', 2, 2);

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Treaty Rights & Self-Governance',
    'Examine Treaty rights as legally protected rights and explore the concept of First Nations self-governance.',
    'Treaty rights are constitutionally protected, and the right of First Nations peoples to govern themselves is recognized in Canadian law.',
    'What are Treaty rights, and what does First Nations self-governance mean in Canada today?')
  RETURNING id INTO v_unit;

  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Treaty Rights & Self-Governance', 'treaty-rights-self-governance',
    'Understand Treaty rights as legal rights and explore what self-governance means for First Nations communities.',
    '[
      {"type": "heading", "level": 1, "text": "Treaty Rights & Self-Governance"},
      {"type": "text", "content": "Treaty rights are rights specifically guaranteed to First Nations peoples through the Treaties they signed with the Canadian government. These rights are not privileges that the government can take away — they are constitutionally protected under Section 35 of the Constitution Act of 1982. Treaty rights typically include the right to hunt and fish on unoccupied Crown land, the right to education, the right to health support, and annual payment amounts per person."},
      {"type": "text", "content": "Over the past century, Treaty rights have often been ignored, underfunded, or violated by governments. First Nations communities have fought in court and through political advocacy to have their rights recognized and fulfilled. Important court decisions like Calder v. British Columbia (1973) and R. v. Sparrow (1990) established legal precedents recognizing that Aboriginal rights pre-date Confederation and cannot simply be extinguished."},
      {"type": "callout", "style": "info", "title": "Treaty Rights Are Legal Rights", "content": "Treaty rights are not special privileges — they are legally binding rights that First Nations peoples negotiated in exchange for agreeing to share their lands. These rights are protected by Section 35 of the Constitution Act of 1982, making them among the most secure rights in Canadian law."},
      {"type": "list", "style": "unordered", "items": ["Treaty rights include hunting, fishing, education, health support, and annual payments", "Section 35 of the Constitution protects Treaty and Aboriginal rights", "Court decisions have strengthened legal recognition of Treaty rights", "Self-governance means First Nations have authority to make laws for their communities", "The Federation of Sovereign Indigenous Nations (FSIN) represents Saskatchewan First Nations politically"]},
      {"type": "text", "content": "Self-governance refers to the right of First Nations peoples to govern themselves according to their own laws, traditions, and priorities. Many First Nations communities in Saskatchewan have their own child and family services, education systems, police services, and social programs. Self-governance allows communities to design programs that reflect their culture and values, rather than relying on systems designed by non-Indigenous governments."},
      {"type": "callout", "style": "tip", "title": "Self-Governance in Saskatchewan", "content": "First Nations in Saskatchewan have made significant strides in self-governance. Several First Nations operate their own schools, where children learn in their own language and according to curriculum that reflects Indigenous ways of knowing. The Federation of Sovereign Indigenous Nations (FSIN), headquartered in Saskatoon, advocates for Treaty rights and self-determination on behalf of 74 First Nations in Saskatchewan. Self-governance is not about separation from Canada — it is about First Nations having the authority to make decisions that affect their own people and territories."},
      {"type": "quiz", "question": "What does self-governance mean for First Nations communities?", "options": ["The right to have no laws at all", "The right to govern themselves according to their own laws and priorities", "The right to ignore Canadian courts", "Only the right to run elections"], "correctIndex": 1, "explanation": "Self-governance means that First Nations peoples have the authority to make decisions and laws for their own communities, reflecting their own values and traditions, rather than being governed entirely by external governments."}
    ]'::jsonb,
    '[
      {"term": "Treaty Rights", "definition": "Rights specifically guaranteed to First Nations peoples through Treaties, protected by Section 35 of the Constitution."},
      {"term": "Self-Governance", "definition": "The right of First Nations peoples to govern their own communities according to their own laws and priorities."},
      {"term": "Aboriginal Rights", "definition": "Rights that First Nations peoples hold based on their prior occupation and use of the land, pre-dating European contact."},
      {"term": "FSIN", "definition": "Federation of Sovereign Indigenous Nations, the organization that represents 74 First Nations in Saskatchewan."},
      {"term": "Sovereignty", "definition": "The authority of a people or government to govern itself independently."}
    ]'::jsonb,
    'Treaty rights are constitutionally protected rights negotiated by First Nations leaders in exchange for sharing their lands. Self-governance is the expression of First Nations sovereignty — the right of Indigenous peoples to make decisions for their own communities. Both are recognized in Canadian law and continue to be advanced through political advocacy and court decisions.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are Treaty rights?', 'Rights specifically guaranteed to First Nations peoples through Treaties, protected by Canada''s Constitution.', 'Think about promises made in Treaty agreements.', 2, 0),
    (v_tenant, v_ch, 'What is self-governance?', 'The right of First Nations peoples to govern their own communities according to their own laws and values.', 'Think about who makes the decisions for a community.', 2, 1),
    (v_tenant, v_ch, 'What is the FSIN?', 'The Federation of Sovereign Indigenous Nations, representing 74 First Nations in Saskatchewan.', 'Think about who advocates for Saskatchewan First Nations politically.', 2, 2);

END;
$$;


-- ============================================================================
-- TEXTBOOK: WolfWhale Social Studies 6
-- Slug: wolfwhale-social-studies-6
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-social-studies-6';

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Canada & Pacific Neighbours',
    'Explore Canada''s geographic, economic, and cultural relationships with countries of the Pacific Rim.',
    'Canada''s Pacific relationships shape its economy, culture, and immigration patterns in profound ways.',
    'How do Canada''s relationships with Pacific Rim countries shape everyday life in Canada?')
  RETURNING id INTO v_unit;

  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Canada & Pacific Neighbours', 'canada-pacific-neighbours',
    'Examine Canada''s geographic, economic, and cultural connections with countries of the Pacific Rim.',
    '[
      {"type": "heading", "level": 1, "text": "Canada & Pacific Neighbours"},
      {"type": "text", "content": "Canada is a Pacific nation as well as an Atlantic one. British Columbia''s coastline stretches for thousands of kilometres along the Pacific Ocean, and the port of Vancouver is one of North America''s busiest. Canada''s Pacific relationships — particularly with China, Japan, South Korea, Australia, and the nations of Southeast Asia — are economically vital and culturally rich. These connections are not recent: they stretch back centuries."},
      {"type": "text", "content": "Trade is the foundation of Canada''s Pacific relationships. Canada exports natural resources like lumber, potash, canola, and wheat to Pacific nations. In return, Canada imports manufactured goods, electronics, vehicles, and consumer products. The Port of Vancouver processes billions of dollars of trade annually. Saskatchewan''s potash exports reach farmers in China and Southeast Asia, connecting prairie mines directly to Asian agriculture."},
      {"type": "callout", "style": "info", "title": "The Pacific Rim", "content": "The Pacific Rim refers to the countries and regions bordering the Pacific Ocean. This includes the west coasts of North and South America, East and Southeast Asia, and Australia and New Zealand. Pacific Rim nations are home to roughly half the world''s population."},
      {"type": "list", "style": "unordered", "items": ["Canada exports potash, lumber, canola, and wheat to Pacific countries", "The Port of Vancouver is Canada''s largest port by cargo volume", "Millions of Canadians trace their ancestry to Pacific Rim countries", "Canada and China are major trading partners despite diplomatic tensions", "Japanese Canadians have been in British Columbia since the late 1800s"]},
      {"type": "text", "content": "Immigration from Pacific countries has deeply shaped Canadian identity, particularly in British Columbia. People from China, India, the Philippines, Japan, South Korea, and Vietnam have built communities, contributed to Canadian culture, and changed the cuisine, arts, and demographics of Canadian cities. Vancouver is one of the most culturally diverse cities in North America, with a large proportion of residents whose heritage traces to East and South Asia."},
      {"type": "callout", "style": "tip", "title": "Indigenous Pacific Connections", "content": "The First Nations peoples of British Columbia''s coast have maintained trade and cultural connections across the Pacific long before European contact. Linguistic and cultural evidence suggests connections between the Indigenous peoples of the Northwest Coast and those of northeast Asia dating back thousands of years. Today, First Nations in BC are active participants in Pacific trade discussions and environmental agreements, particularly concerning the health of Pacific salmon — a fish of central cultural and economic importance to coastal First Nations."},
      {"type": "quiz", "question": "Which Saskatchewan export is especially important for farmers in Pacific Rim countries?", "options": ["Lumber", "Oil", "Potash", "Gold"], "correctIndex": 2, "explanation": "Potash, a potassium-based fertilizer mined extensively in Saskatchewan, is exported to countries like China where it is used in agricultural fertilizers to grow food. Saskatchewan has some of the world''s largest potash reserves."}
    ]'::jsonb,
    '[
      {"term": "Pacific Rim", "definition": "The countries and regions bordering the Pacific Ocean."},
      {"term": "Trade", "definition": "The exchange of goods and services between countries or communities."},
      {"term": "Export", "definition": "A good or service sold to another country."},
      {"term": "Import", "definition": "A good or service bought from another country."},
      {"term": "Port", "definition": "A place where ships load and unload cargo, facilitating international trade."}
    ]'::jsonb,
    'First Nations peoples of the Pacific coast have maintained cultural and trading connections across the Pacific for thousands of years, predating European contact. Coast Salish, Haida, and other nations were sophisticated maritime traders. Today, First Nations are active participants in Pacific fisheries management and environmental agreements, particularly around the protection of wild Pacific salmon.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the Pacific Rim?', 'The countries and regions bordering the Pacific Ocean.', 'Think about the ring of nations around the Pacific.', 2, 0),
    (v_tenant, v_ch, 'What Saskatchewan resource is exported to Pacific Rim countries?', 'Potash, a fertilizer mineral mined near Saskatoon and Esterhazy.', 'Think about what helps Asian farmers grow food.', 2, 1),
    (v_tenant, v_ch, 'What is Canada''s largest port?', 'The Port of Vancouver, which handles billions of dollars of trade annually.', 'Think about British Columbia''s coast.', 2, 2);

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Canada & Atlantic Neighbours',
    'Explore Canada''s geographic, economic, and cultural relationships with countries of the Atlantic world.',
    'Canada''s Atlantic connections — to Europe, Africa, and the Caribbean — reflect centuries of trade, immigration, and cultural exchange.',
    'How have Canada''s Atlantic relationships shaped its history and identity?')
  RETURNING id INTO v_unit;

  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Canada & Atlantic Neighbours', 'canada-atlantic-neighbours',
    'Examine Canada''s historical and contemporary connections with countries across the Atlantic Ocean.',
    '[
      {"type": "heading", "level": 1, "text": "Canada & Atlantic Neighbours"},
      {"type": "text", "content": "Canada''s Atlantic connections are the oldest of its international relationships. Indigenous peoples on the East Coast made contact with Norse explorers around 1000 CE and with European fishermen in the 1400s. The British and French colonization of Canada came from across the Atlantic, bringing the languages, laws, religions, and cultures that shaped much of modern Canada. Today, Canada maintains deep relationships with the countries of Europe, the Caribbean, and West Africa."},
      {"type": "text", "content": "The United Kingdom is Canada''s oldest international partner. Canada is a member of the Commonwealth, an association of countries with historical ties to Britain. France is also a crucial relationship — Quebec''s French language and culture trace directly to French colonization, and Canada is a member of La Francophonie, the international organization of French-speaking nations. The United States, while on the western side of the Atlantic, is Canada''s most important trading partner by far."},
      {"type": "callout", "style": "info", "title": "The Commonwealth", "content": "The Commonwealth is an association of 56 countries, most of which were once part of the British Empire. Canada is a founding member. Commonwealth countries share common traditions in law, governance, and culture and cooperate on issues of development, democracy, and human rights."},
      {"type": "list", "style": "unordered", "items": ["The UK is Canada''s oldest international partner", "France''s language and culture shaped Quebec and French communities across Canada", "The Caribbean is home to many immigrants who have enriched Canadian culture", "Canada''s Atlantic provinces have deep economic ties to European fishing grounds", "African nations are growing trade and development partners for Canada"]},
      {"type": "text", "content": "The Caribbean is another important part of Canada''s Atlantic world. Thousands of Caribbean Canadians have immigrated to Canada, particularly to Toronto and Montreal, enriching those cities with Caribbean music, cuisine, festivals like Caribana, and cultural traditions. Canada also has a history of involvement in Haiti and other Caribbean nations through development assistance."},
      {"type": "callout", "style": "tip", "title": "Indigenous Atlantic Connections", "content": "The Mi''kmaq, Maliseet, and other Atlantic First Nations peoples had already established extensive trade networks across the Atlantic coastal region long before European contact. When European fishermen began arriving on the Grand Banks in the 1400s, they encountered well-organized Indigenous trading peoples. Mi''kmaq oral history records some of the earliest Indigenous-European contact in North America. These nations continue to be active participants in Atlantic coastal management, particularly around fisheries rights established through their own Treaties."},
      {"type": "quiz", "question": "What is the Commonwealth?", "options": ["A trade organization for Pacific countries", "An alliance of military powers", "An association of countries with historical ties to Britain", "A United Nations committee"], "correctIndex": 2, "explanation": "The Commonwealth is an association of 56 countries, most of which have historical ties to Britain through the former British Empire. Canada is a founding member."}
    ]'::jsonb,
    '[
      {"term": "Commonwealth", "definition": "An association of 56 countries with historical ties to Britain, cooperating on development, democracy, and human rights."},
      {"term": "La Francophonie", "definition": "An international organization of French-speaking nations and regions, of which Canada is a member."},
      {"term": "Colony", "definition": "A territory controlled and settled by a foreign power."},
      {"term": "Immigration", "definition": "The process of moving to a new country to live permanently."},
      {"term": "Development Assistance", "definition": "Financial and technical support given by wealthier countries to help poorer countries improve living standards."}
    ]'::jsonb,
    'The Mi''kmaq, Maliseet, and other Atlantic First Nations had sophisticated trading networks and cultural connections along the Atlantic coast before European contact. Their encounter with European fishermen represents some of the earliest Indigenous-European contact in North America. Their Treaty rights, including fisheries rights, continue to be the subject of legal cases today.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the Commonwealth?', 'An association of 56 countries with historical ties to Britain, cooperating on development and democracy.', 'Think about Britain''s former empire.', 2, 0),
    (v_tenant, v_ch, 'How has the Caribbean influenced Canada?', 'Through immigration, bringing Caribbean music, cuisine, festivals, and cultural traditions to Canadian cities like Toronto.', 'Think about Caribbean-Canadian communities.', 2, 1),
    (v_tenant, v_ch, 'Why are Canada''s Atlantic connections historically important?', 'Because British and French colonization came from Europe, shaping Canada''s languages, laws, and culture.', 'Think about where the colonizers came from.', 2, 2);

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Trade & Interdependence',
    'Understand how global trade creates interdependence between nations and examine its benefits and challenges.',
    'Global trade connects nations in webs of mutual dependence that create both benefits and responsibilities.',
    'How does international trade make nations interdependent, and what are the consequences of that interdependence?')
  RETURNING id INTO v_unit;

  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Trade & Interdependence', 'trade-and-interdependence',
    'Explore how global trade creates mutual dependence between nations and the advantages and disadvantages that follow.',
    '[
      {"type": "heading", "level": 1, "text": "Trade & Interdependence"},
      {"type": "text", "content": "No country in the world is entirely self-sufficient. Every nation depends on others for some of the goods, services, or resources it needs. This mutual dependence between nations is called interdependence. Trade is the primary mechanism through which interdependence is created and maintained. When Canada exports wheat to Egypt and imports electronics from South Korea, both nations become partly dependent on each other for economic wellbeing."},
      {"type": "text", "content": "Countries trade because of comparative advantage — the idea that nations should specialize in producing what they can make most efficiently and trade for what others can produce more efficiently. Canada has vast agricultural land and produces far more wheat, canola, and beef than its population consumes. Countries with large manufacturing sectors can produce electronics and machinery more cheaply. By trading, both benefit."},
      {"type": "callout", "style": "info", "title": "What Is Interdependence?", "content": "Interdependence means that countries rely on one another for goods, services, or resources. Global trade creates interdependence. When supply chains are disrupted — as happened during the COVID-19 pandemic — the effects of interdependence become very visible."},
      {"type": "list", "style": "unordered", "items": ["Canada''s top exports include oil, natural gas, vehicles, machinery, and agricultural products", "Canada''s top imports include vehicles, machinery, electronics, and pharmaceuticals", "The USA is Canada''s most important trading partner, buying about 75% of Canadian exports", "Trade agreements like CUSMA (Canada-US-Mexico Agreement) regulate trade between partners", "Global supply chains mean most products contain components from many different countries"]},
      {"type": "text", "content": "Interdependence has both benefits and risks. When trade flows freely, consumers get more variety at lower prices, and producers reach larger markets. But when a trading relationship breaks down due to conflict, tariffs, or natural disaster, the effects can be severe. The COVID-19 pandemic revealed how vulnerable global supply chains are: shortages of medical equipment, computer chips, and consumer goods occurred worldwide."},
      {"type": "callout", "style": "tip", "title": "Indigenous Trade Networks", "content": "Long before European traders arrived, First Nations peoples across North America maintained sophisticated trade networks spanning thousands of kilometres. Goods like copper from the Great Lakes, obsidian from the Rocky Mountains, and shells from the Pacific Coast were traded across the continent through interconnected Indigenous trade routes. These networks created interdependence between nations and were accompanied by diplomatic protocols, ceremonies, and alliance-building. Modern global trade has Indigenous predecessors that deserve recognition."},
      {"type": "quiz", "question": "What does interdependence mean in the context of global trade?", "options": ["Each country produces everything it needs independently", "Countries rely on one another for goods, services, or resources", "Only wealthy countries trade with each other", "Trade only benefits the country doing the exporting"], "correctIndex": 1, "explanation": "Interdependence means that countries rely on one another through trade. No country is fully self-sufficient, and all economies depend on trading relationships with other nations."}
    ]'::jsonb,
    '[
      {"term": "Interdependence", "definition": "The mutual reliance of nations or groups on one another for goods, services, or resources."},
      {"term": "Comparative Advantage", "definition": "The ability of a country to produce a good or service at a lower opportunity cost than another country."},
      {"term": "Supply Chain", "definition": "The sequence of steps, organizations, and countries involved in producing and delivering a product."},
      {"term": "Tariff", "definition": "A tax placed on imported goods to make them more expensive and protect domestic producers."},
      {"term": "Trade Agreement", "definition": "A formal arrangement between countries that sets the rules for trade between them."}
    ]'::jsonb,
    'Indigenous peoples across North America maintained sophisticated trade networks spanning thousands of kilometres long before European contact. Copper, obsidian, shells, and other valuable materials moved along these routes, accompanied by diplomatic protocols and ceremony. These networks represent the original forms of continental interdependence on this land.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is interdependence?', 'The mutual reliance of nations on one another for goods, services, or resources.', 'Think about countries needing each other.', 2, 0),
    (v_tenant, v_ch, 'Why do countries trade with each other?', 'Because no country can produce everything it needs efficiently — trade allows specialization and access to goods from elsewhere.', 'Think about comparative advantage.', 2, 1),
    (v_tenant, v_ch, 'What is a tariff?', 'A tax on imported goods that makes them more expensive and protects domestic producers.', 'Think about trade barriers.', 2, 2);

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Indigenous International Relations',
    'Explore how Indigenous peoples maintained international relationships before and after European contact.',
    'Indigenous peoples were and continue to be participants in international relationships, with their own diplomacy, trade, and alliances.',
    'How have Indigenous peoples engaged in international relationships, and how do they do so today?')
  RETURNING id INTO v_unit;

  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Indigenous International Relations', 'indigenous-international-relations',
    'Examine how Indigenous peoples conducted diplomacy, trade, and alliances historically and how they engage internationally today.',
    '[
      {"type": "heading", "level": 1, "text": "Indigenous International Relations"},
      {"type": "text", "content": "Before European contact, the Indigenous peoples of North America were active participants in international relations. They maintained trade networks, diplomatic alliances, peace agreements, and occasionally military conflicts with neighbouring and distant nations. The protocols, ceremonies, and languages of Indigenous diplomacy were sophisticated systems for managing inter-nation relationships that evolved over thousands of years."},
      {"type": "text", "content": "The Haudenosaunee Confederacy (Iroquois), for example, maintained formal diplomatic relationships with dozens of nations through the Two Row Wampum Treaty, which represented a commitment to peaceful coexistence and mutual non-interference. The Blackfoot Confederacy united four related nations — the Siksika, Kainai, Piikani, and Amskapi Piikani — into a powerful political and military alliance that controlled territory across what is now southern Alberta and Montana."},
      {"type": "callout", "style": "info", "title": "The Two Row Wampum", "content": "The Two Row Wampum Treaty, signed between the Haudenosaunee and Dutch traders in 1613, used a beaded belt to symbolize two peoples travelling side by side in their own vessels — neither steering the other''s canoe. This principle of peaceful coexistence and non-interference influenced Haudenosaunee international relations for centuries."},
      {"type": "list", "style": "unordered", "items": ["Indigenous nations had formal trade, diplomatic, and military relationships before contact", "The Haudenosaunee Confederacy was a model of federal governance and diplomacy", "First Nations peoples participated in treaty negotiations with the Crown as sovereign nations", "Today, Indigenous peoples engage with the United Nations on rights and environmental issues", "The UN Declaration on the Rights of Indigenous Peoples (UNDRIP) is a key international document"]},
      {"type": "text", "content": "Today, Indigenous peoples around the world engage in international relations through organizations like the Permanent Forum on Indigenous Issues at the United Nations. In 2007, the UN General Assembly adopted the UN Declaration on the Rights of Indigenous Peoples (UNDRIP), which affirms the rights of Indigenous peoples to self-determination, cultural expression, and free, prior, and informed consent before governments make decisions affecting their lands. Canada endorsed UNDRIP in 2016."},
      {"type": "callout", "style": "tip", "title": "UNDRIP and Saskatchewan First Nations", "content": "The UN Declaration on the Rights of Indigenous Peoples has significant implications for Saskatchewan. It affirms that governments must obtain free, prior, and informed consent from First Nations before making decisions that affect their territories — including resource extraction, pipeline development, and land management. Saskatchewan First Nations actively use UNDRIP as a framework for asserting their rights and holding governments accountable to their international commitments."},
      {"type": "quiz", "question": "What does the UN Declaration on the Rights of Indigenous Peoples (UNDRIP) affirm?", "options": ["That Indigenous peoples must follow all national laws without exception", "The rights of Indigenous peoples to self-determination, cultural expression, and free, prior, and informed consent", "That Indigenous peoples have no special international rights", "That Canada must pay annual reparations to all Indigenous peoples"], "correctIndex": 1, "explanation": "UNDRIP affirms the rights of Indigenous peoples worldwide to self-determination, cultural expression, and the right to free, prior, and informed consent before governments make decisions affecting their lands and communities."}
    ]'::jsonb,
    '[
      {"term": "Diplomacy", "definition": "The management of relationships between nations or groups, typically through negotiation and agreement."},
      {"term": "Two Row Wampum", "definition": "A treaty between the Haudenosaunee and Dutch traders symbolizing peaceful coexistence through parallel but non-interfering paths."},
      {"term": "UNDRIP", "definition": "The United Nations Declaration on the Rights of Indigenous Peoples, adopted in 2007, affirming Indigenous rights to self-determination and consent."},
      {"term": "Sovereignty", "definition": "The authority of a people or government to govern itself independently."},
      {"term": "Free, Prior, and Informed Consent", "definition": "The right of Indigenous peoples to be consulted and to give or withhold agreement before decisions are made that affect their lands."}
    ]'::jsonb,
    'Indigenous peoples were sophisticated international actors before European contact and continue to engage in international relations today through the United Nations and other bodies. The UN Declaration on the Rights of Indigenous Peoples (UNDRIP) represents a major international affirmation of Indigenous rights. Saskatchewan First Nations actively use UNDRIP as a framework for rights advocacy.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is UNDRIP?', 'The UN Declaration on the Rights of Indigenous Peoples, adopted in 2007, affirming Indigenous rights to self-determination and consent.', 'Think about an important international document.', 2, 0),
    (v_tenant, v_ch, 'What does the Two Row Wampum represent?', 'Peaceful coexistence between two peoples travelling side by side without interfering in each other''s affairs.', 'Think about a beaded belt as a treaty symbol.', 2, 1),
    (v_tenant, v_ch, 'What is free, prior, and informed consent?', 'The right of Indigenous peoples to be consulted and to agree or disagree before decisions affecting their lands are made.', 'Think about the right to say yes or no to development on your land.', 3, 2);

END;
$$;


-- ============================================================================
-- TEXTBOOK: WolfWhale Social Studies 7
-- Slug: wolfwhale-social-studies-7
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-social-studies-7';

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Ancient Civilizations',
    'Explore the characteristics, contributions, and legacies of ancient civilizations.',
    'Ancient civilizations developed sophisticated systems of governance, culture, and knowledge that continue to influence the world today.',
    'What can ancient civilizations teach us about how human societies organize themselves and solve problems?')
  RETURNING id INTO v_unit;

  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Ancient Civilizations', 'ancient-civilizations',
    'Survey major ancient civilizations and analyze what made them successful and what caused their decline.',
    '[
      {"type": "heading", "level": 1, "text": "Ancient Civilizations"},
      {"type": "text", "content": "A civilization is a complex human society with advanced systems of government, culture, economy, and technology. Historians identify several key features that mark the development of civilizations: cities with dense populations, organized governments with laws, specialization of labour (people doing different jobs), systems of writing, monumental architecture, and long-distance trade. The first civilizations emerged around 5,000 years ago in river valleys where agriculture could support large populations."},
      {"type": "text", "content": "Among the earliest civilizations were Mesopotamia in the Tigris and Euphrates valleys (present-day Iraq), ancient Egypt along the Nile River, the Indus Valley civilization in present-day Pakistan and northwest India, and ancient China along the Yellow River. Each of these civilizations developed independently and created innovations that influenced all later human societies — writing, mathematics, law codes, irrigation systems, and architectural techniques."},
      {"type": "callout", "style": "info", "title": "What Makes a Civilization?", "content": "Historians typically identify six features of civilization: cities, organized government, specialized labour, a writing system, social classes, and long-distance trade. The presence of these features distinguishes civilizations from simpler societies."},
      {"type": "list", "style": "unordered", "items": ["Mesopotamia developed the first writing system (cuneiform) around 3500 BCE", "Ancient Egypt built the pyramids as monuments to pharaohs around 2500 BCE", "The Indus Valley civilization had planned cities with advanced sewage systems", "Ancient China developed bronze metallurgy, silk production, and early writing", "All early civilizations developed along rivers that supported agriculture"]},
      {"type": "text", "content": "Ancient civilizations also developed art, religion, philosophy, and systems of ethics. Mesopotamia produced the Code of Hammurabi, one of the oldest written law codes. Ancient Greece developed the foundations of Western philosophy, mathematics, and democratic thought. Ancient Rome spread its legal traditions, engineering, and governance systems across Europe, North Africa, and the Middle East. Many of these legacies are still evident in contemporary life."},
      {"type": "callout", "style": "tip", "title": "Indigenous Civilizations in the Americas", "content": "The Americas were home to sophisticated ancient civilizations long before European contact. The Maya of Central America developed an advanced writing system, precise astronomical calendar, and complex city-states. The Aztec (Mexica) built Tenochtitlan, one of the largest cities in the world in the 1400s. The Mississippian culture in North America built the great earthwork city of Cahokia near present-day St. Louis around 1000 CE. In the Pacific Northwest and on the prairies, Indigenous peoples built complex societies whose achievements are only beginning to be fully recognized by archaeologists."},
      {"type": "quiz", "question": "What is one key feature that historians use to identify an ancient civilization?", "options": ["The use of metal weapons", "A system of writing", "A population of at least one million people", "The existence of universities"], "correctIndex": 1, "explanation": "A writing system is one of the key features historians use to identify civilizations. Writing allowed for the recording of laws, trade, history, and knowledge — enabling more complex social organization."}
    ]'::jsonb,
    '[
      {"term": "Civilization", "definition": "A complex human society with advanced systems of government, culture, economy, and technology."},
      {"term": "Mesopotamia", "definition": "The ancient civilization that developed in the Tigris and Euphrates valleys in present-day Iraq, home to the world''s first writing system."},
      {"term": "Cuneiform", "definition": "The earliest known writing system, developed by the Sumerians of Mesopotamia around 3500 BCE."},
      {"term": "Pharaoh", "definition": "The title for the rulers of ancient Egypt, who held both political and religious authority."},
      {"term": "Archaeology", "definition": "The scientific study of human history through the excavation and analysis of physical remains and artifacts."}
    ]'::jsonb,
    'The Americas were home to sophisticated ancient civilizations including the Maya, Aztec, and Mississippian cultures. Indigenous peoples across North America built complex societies with their own writing systems, astronomical knowledge, agricultural technologies, and governance structures. These achievements are part of the full story of human civilization and deserve equal recognition alongside Old World civilizations.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a civilization?', 'A complex human society with advanced systems of government, culture, economy, and technology.', 'Think about what distinguishes complex societies from simpler ones.', 2, 0),
    (v_tenant, v_ch, 'What is cuneiform?', 'The earliest known writing system, developed in Mesopotamia around 3500 BCE.', 'Think about wedge-shaped marks in clay tablets.', 2, 1),
    (v_tenant, v_ch, 'Name two ancient civilizations from outside the Americas.', 'Examples: Mesopotamia, ancient Egypt, Indus Valley, ancient China, ancient Greece, ancient Rome.', 'Think about early river civilizations.', 2, 2);

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Power & Authority',
    'Examine how power and authority have been organized in different societies throughout history.',
    'All societies must decide how to organize power and authority, and the choices they make reflect their values and circumstances.',
    'How have different societies organized power and authority, and what are the consequences of those choices?')
  RETURNING id INTO v_unit;

  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Power & Authority', 'power-and-authority',
    'Analyze different systems of power and authority in historical and contemporary societies.',
    '[
      {"type": "heading", "level": 1, "text": "Power & Authority"},
      {"type": "text", "content": "Every human society must answer a fundamental question: who has the right to make decisions that affect everyone? The answer to this question defines the political system of a society. Power refers to the ability to make things happen or to influence others. Authority refers to the legitimacy of that power — the right to exercise it, accepted by those governed. A ruler might have power without authority (a tyrant), or authority without power (a figurehead), or ideally both."},
      {"type": "text", "content": "Throughout history, societies have organized power in many different ways. In monarchies, power is concentrated in a single ruler, often by hereditary succession. In oligarchies, power is held by a small group, often wealthy or militarily powerful. In theocracies, religious leaders hold political power, claiming divine authority. In democracies, power is distributed among citizens, who exercise it through elections and civic participation. Many historical and contemporary societies combine elements of these systems."},
      {"type": "callout", "style": "info", "title": "Types of Political Systems", "content": "Monarchy: power held by a single hereditary ruler. Oligarchy: power held by a small elite group. Theocracy: power held by religious leaders claiming divine authority. Democracy: power distributed among citizens who elect representatives. Dictatorship: power held by a single person or party by force."},
      {"type": "list", "style": "unordered", "items": ["Legitimate authority is power that the governed accept as rightful", "Power can be based on tradition, law, religion, or force", "Checks and balances limit the abuse of power in democratic systems", "Social contract theory argues that citizens give up some freedom to gain protection and order", "Revolutions occur when the legitimacy of authority collapses"]},
      {"type": "text", "content": "The concept of the social contract, developed by philosophers like Hobbes, Locke, and Rousseau in the 17th and 18th centuries, argued that government derives its authority from the consent of the governed. Locke argued that if a government violated the natural rights of its citizens, those citizens had the right to replace it. These ideas directly influenced the American Declaration of Independence and the French Declaration of the Rights of Man."},
      {"type": "callout", "style": "tip", "title": "Indigenous Concepts of Power and Authority", "content": "Many Indigenous governance systems in North America rested on fundamentally different understandings of power and authority than European systems. Rather than concentrating power in a single leader who ruled over others, many First Nations systems distributed authority across families, clans, councils, and Elders. Leadership was earned through wisdom and service, not inherited. Power was exercised through persuasion and consensus, not command. These are not inferior systems — they are sophisticated approaches to governance that prioritized community wellbeing over individual authority."},
      {"type": "quiz", "question": "What is the difference between power and authority?", "options": ["They mean exactly the same thing", "Power is the ability to make things happen; authority is the recognized right to exercise power", "Authority is held only by rulers; power is held by everyone", "Power comes from elections; authority comes from military force"], "correctIndex": 1, "explanation": "Power is the ability to influence or control others. Authority is the legitimacy or recognized right to exercise power. A government has both when citizens accept its right to make and enforce rules."}
    ]'::jsonb,
    '[
      {"term": "Power", "definition": "The ability to make things happen or to influence others."},
      {"term": "Authority", "definition": "The recognized right to exercise power, accepted by those being governed."},
      {"term": "Monarchy", "definition": "A system of government in which power is held by a single hereditary ruler."},
      {"term": "Democracy", "definition": "A system of government in which citizens hold and exercise political power through elections and participation."},
      {"term": "Social Contract", "definition": "The philosophical idea that government derives its authority from the consent of the governed."}
    ]'::jsonb,
    'Many Indigenous governance systems distributed authority across families, clans, councils, and Elders rather than concentrating it in a single ruler. Leadership was earned through wisdom and service. Power was exercised through persuasion and consensus. These approaches to governance reflect sophisticated political philosophy developed independently of European traditions.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is authority?', 'The recognized right to exercise power, accepted by those being governed.', 'Think about the legitimacy of a leader''s power.', 2, 0),
    (v_tenant, v_ch, 'What is the social contract?', 'The idea that government derives its authority from the consent of the governed.', 'Think about philosophers like Locke and Rousseau.', 3, 1),
    (v_tenant, v_ch, 'Name three types of political systems.', 'Examples: monarchy, oligarchy, theocracy, democracy, dictatorship.', 'Think about different ways power can be organized.', 2, 2);

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Diverse Worldviews',
    'Explore how different worldviews shape the way societies organize themselves and understand the world.',
    'Worldviews are the foundational lenses through which societies interpret reality, and understanding diverse worldviews is essential to understanding human history.',
    'How do different worldviews shape the values and actions of societies, and why does understanding them matter?')
  RETURNING id INTO v_unit;

  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Diverse Worldviews', 'diverse-worldviews',
    'Examine how worldviews shape societies and learn to analyze historical events through multiple worldview lenses.',
    '[
      {"type": "heading", "level": 1, "text": "Diverse Worldviews"},
      {"type": "text", "content": "A worldview is the framework of beliefs, values, and assumptions through which a person or society interprets the world. Worldviews are like lenses — they shape what we notice, what we value, and how we make sense of events. Every society has a dominant worldview that influences its laws, art, science, spirituality, and social relationships. Recognizing that different worldviews exist — and that each has its own logic and validity — is a fundamental skill for understanding history and building respectful relationships."},
      {"type": "text", "content": "Western European worldviews, which dominated global culture during the colonial era, tended to emphasize individual rights, linear time, the separation of the natural from the spiritual, and the desirability of material progress. These values shaped the expansion of European empires and the development of capitalism, science, and secular governance. They also shaped how European settlers perceived Indigenous peoples and lands."},
      {"type": "callout", "style": "info", "title": "What Is a Worldview?", "content": "A worldview is the framework of beliefs, values, and assumptions that shapes how a person or society interprets reality. Worldviews influence everything from religious practice to economic systems to attitudes toward the natural world. No single worldview is universally correct."},
      {"type": "list", "style": "unordered", "items": ["Worldviews shape values, laws, art, science, and social relationships", "All worldviews contain internal logic and validity", "Conflicts often arise when different worldviews clash without mutual understanding", "Examining your own worldview requires critical self-reflection", "History is better understood when multiple worldviews are considered simultaneously"]},
      {"type": "text", "content": "Understanding diverse worldviews does not mean accepting all practices uncritically — some practices cause harm and deserve criticism. But it does mean approaching unfamiliar worldviews with curiosity and humility before judgment. Many of the most serious misunderstandings in history arose when one group assumed its worldview was the only rational one and dismissed others as primitive or wrong without genuine engagement."},
      {"type": "callout", "style": "tip", "title": "Indigenous Worldviews", "content": "Many Indigenous worldviews share certain foundational principles: the interconnectedness of all living things, the spiritual dimension of the natural world, the importance of maintaining reciprocal relationships with the land and other beings, and the centrality of community and relationship over individual accumulation. These are not naïve beliefs — they are sophisticated, empirically grounded understandings developed through thousands of years of careful observation and lived experience. Indigenous worldviews offer powerful insights for contemporary challenges like climate change and social justice."},
      {"type": "quiz", "question": "What is a worldview?", "options": ["A type of map showing the whole world", "The framework of beliefs, values, and assumptions through which a person or society interprets reality", "The official position of a country''s government", "The dominant religion of a civilization"], "correctIndex": 1, "explanation": "A worldview is the framework of beliefs, values, and assumptions that shapes how individuals or societies interpret the world and make decisions. All people and societies operate from worldviews, often without being aware of them."}
    ]'::jsonb,
    '[
      {"term": "Worldview", "definition": "The framework of beliefs, values, and assumptions through which a person or society interprets reality."},
      {"term": "Perspective", "definition": "A particular way of regarding something, shaped by one''s background, experiences, and beliefs."},
      {"term": "Colonialism", "definition": "The policy and practice of a country acquiring and maintaining control over other territories and peoples."},
      {"term": "Reciprocity", "definition": "The practice of giving and receiving in mutually beneficial ways; a foundational value in many Indigenous worldviews."},
      {"term": "Ethnocentrism", "definition": "The belief that one''s own culture or worldview is superior to others and is the standard by which all others should be judged."}
    ]'::jsonb,
    'Many Indigenous worldviews share foundational principles: the interconnectedness of all living things, the spiritual dimension of the natural world, and the centrality of reciprocal relationships. These worldviews offer sophisticated and empirically grounded understandings of the world that complement and often challenge Western frameworks. Understanding them is essential to decolonizing education and building genuine respect.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a worldview?', 'The framework of beliefs, values, and assumptions through which a person or society interprets reality.', 'Think about the lens through which we see the world.', 2, 0),
    (v_tenant, v_ch, 'What is ethnocentrism?', 'The belief that one''s own culture is superior to others and is the standard by which all others should be judged.', 'Think about judging other cultures by your own standards.', 3, 1),
    (v_tenant, v_ch, 'What is reciprocity?', 'The practice of mutual giving and receiving; a core value in many Indigenous worldviews.', 'Think about balanced relationships of give and take.', 2, 2);

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Indigenous Governance vs European Systems',
    'Compare Indigenous governance traditions with European systems brought to North America and analyze how colonialism disrupted Indigenous governance.',
    'Indigenous governance systems were sophisticated, diverse, and effective, and their suppression by colonialism caused lasting harm that reconciliation must address.',
    'How did Indigenous governance systems compare to European ones, and what was lost when colonialism suppressed them?')
  RETURNING id INTO v_unit;

  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Indigenous Governance vs European Systems', 'indigenous-governance-vs-european-systems',
    'Compare Indigenous and European governance traditions and examine how colonial policies undermined Indigenous self-governance.',
    '[
      {"type": "heading", "level": 1, "text": "Indigenous Governance vs European Systems"},
      {"type": "text", "content": "When European colonizers arrived in North America, they encountered peoples with established governance systems that were, in many ways, as sophisticated as or more sophisticated than European systems of the time. Yet colonial ideology held that Indigenous peoples had no legitimate governance and needed to be civilized under European rule. This assumption was false, harmful, and convenient — it justified the seizure of land and the suppression of Indigenous political authority."},
      {"type": "text", "content": "European governance systems in the colonial era were typically based on hierarchical authority: monarchs at the top, supported by nobles, clergy, and merchants, with common people at the bottom. Power was usually inherited, religiously sanctioned, and enforced through law and military force. While European political philosophy was developing democratic ideas (particularly in Britain and later France), actual European governance remained highly unequal and undemocratic for most people."},
      {"type": "callout", "style": "info", "title": "Colonial Doctrine of Discovery", "content": "The Doctrine of Discovery was a legal principle developed in Europe and used to justify colonial land claims. It asserted that land could be claimed by European nations simply by ''discovering'' it, regardless of the fact that Indigenous peoples already lived there. This doctrine has been rejected by modern international law but remains embedded in some Canadian and American legal precedents."},
      {"type": "list", "style": "unordered", "items": ["European systems were typically monarchical, hierarchical, and relied on inherited authority", "Many Indigenous systems relied on consensus, earned authority, and collective responsibility", "The Indian Act (1876) deliberately undermined First Nations governance in Canada", "The Indian Act banned traditional ceremonies, governance structures, and land use", "Self-governance restoration is a key goal of reconciliation today"]},
      {"type": "text", "content": "The Indian Act of 1876 was the primary tool of colonial governance over First Nations in Canada. It gave the federal government enormous control over First Nations communities, defining who was legally ''Indian,'' controlling reserve lands, restricting movement, banning traditional ceremonies and languages, and imposing elected band councils as replacements for traditional governance. The Act continues to govern many aspects of First Nations life today, though First Nations have successfully challenged and changed many of its provisions over the decades."},
      {"type": "callout", "style": "tip", "title": "Revitalizing Indigenous Governance", "content": "Many First Nations communities in Saskatchewan are actively working to revitalize their traditional governance systems. Some have developed their own constitutions. Others have restored traditional decision-making processes alongside elected band councils. The Blood Tribe and several Cree nations have developed innovative governance models that blend traditional principles with contemporary legal realities. Reconciliation in governance means creating space for Indigenous peoples to govern themselves according to their own traditions and values."},
      {"type": "quiz", "question": "What was the Indian Act?", "options": ["A Treaty document signed between First Nations and the Crown", "A document affirming Indigenous rights", "A federal law that gave the government extensive control over First Nations people and their lands", "A provincial law governing immigration from India"], "correctIndex": 2, "explanation": "The Indian Act (1876) gave the Canadian federal government extensive control over First Nations communities, defining legal status, controlling lands, banning ceremonies, and imposing governance structures. It is a central instrument of colonial policy in Canada."}
    ]'::jsonb,
    '[
      {"term": "Indian Act", "definition": "A Canadian federal law passed in 1876 that gave the government extensive control over First Nations peoples, their lands, and their governance."},
      {"term": "Doctrine of Discovery", "definition": "A colonial legal principle claiming that Europeans could claim lands simply by ''discovering'' them, ignoring Indigenous occupation."},
      {"term": "Decolonization", "definition": "The process of undoing the political, cultural, and social effects of colonialism."},
      {"term": "Reconciliation", "definition": "The ongoing process of healing and rebuilding relationships between Indigenous and non-Indigenous peoples in Canada."},
      {"term": "Band Council", "definition": "A governing body imposed on First Nations communities by the Indian Act, consisting of a chief and councillors elected under federal rules."}
    ]'::jsonb,
    'The Indian Act of 1876 deliberately undermined First Nations governance in Canada, replacing traditional decision-making with government-imposed band councils and banning ceremonies and cultural practices. The restoration of Indigenous self-governance is a central goal of reconciliation. Many Saskatchewan First Nations are actively rebuilding governance systems rooted in their own traditions and laws.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What was the Indian Act?', 'A federal law (1876) giving the Canadian government extensive control over First Nations peoples, their lands, and governance.', 'Think about a colonial law that is still partly in effect.', 2, 0),
    (v_tenant, v_ch, 'What is the Doctrine of Discovery?', 'A colonial legal principle claiming Europeans could claim Indigenous lands simply by ''discovering'' them.', 'Think about how colonizers justified land seizure.', 3, 1),
    (v_tenant, v_ch, 'What is reconciliation?', 'The ongoing process of healing and rebuilding relationships between Indigenous and non-Indigenous peoples in Canada.', 'Think about repairing historical wrongs.', 2, 2);

END;
$$;


-- ============================================================================
-- TEXTBOOK: WolfWhale Social Studies 8
-- Slug: wolfwhale-social-studies-8
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-social-studies-8';

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Renaissance to Revolution',
    'Trace the intellectual and political transformations of Europe from the Renaissance through the Age of Revolution.',
    'The Renaissance, Reformation, and Enlightenment created new ideas about human dignity, reason, and freedom that eventually led to democratic revolutions.',
    'How did new ideas about the individual, reason, and freedom transform European societies from the Renaissance through the Age of Revolution?')
  RETURNING id INTO v_unit;

  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Renaissance to Revolution', 'renaissance-to-revolution',
    'Survey the intellectual and political transformations from the Renaissance to the democratic revolutions of the 18th century.',
    '[
      {"type": "heading", "level": 1, "text": "Renaissance to Revolution"},
      {"type": "text", "content": "The Renaissance, which began in Italy around the 14th century and spread across Europe over the next two centuries, marked a profound shift in European thought. Renaissance thinkers turned away from the purely religious focus of medieval scholarship and rediscovered the classical learning of ancient Greece and Rome. This produced an explosion of art, literature, science, and philosophy centred on human potential and the observable world. Figures like Leonardo da Vinci, Michelangelo, and Galileo exemplified this new humanistic spirit."},
      {"type": "text", "content": "The Protestant Reformation, launched when Martin Luther challenged the Catholic Church in 1517, fragmented the religious unity of Europe and ultimately contributed to ideas of individual conscience and freedom of belief. The Scientific Revolution of the 16th and 17th centuries, associated with figures like Copernicus, Newton, and Bacon, established the principles of empirical observation and rational analysis that became the foundation of modern science and, eventually, Enlightenment philosophy."},
      {"type": "callout", "style": "info", "title": "The Enlightenment", "content": "The Enlightenment (roughly 1685-1815) was an intellectual movement that applied rational analysis to human society, politics, and governance. Enlightenment thinkers challenged traditional authority and argued that society could be organized on rational, humane principles. Key figures include Voltaire, Rousseau, Locke, and Montesquieu."},
      {"type": "list", "style": "unordered", "items": ["The Renaissance celebrated human potential and rediscovered classical learning", "The Reformation challenged religious authority and promoted individual conscience", "The Scientific Revolution established empirical methods for understanding the world", "The Enlightenment applied reason to politics and governance", "The American (1776) and French (1789) Revolutions put Enlightenment ideas into practice"]},
      {"type": "text", "content": "Enlightenment ideas about natural rights, popular sovereignty, and the social contract directly inspired the American Revolution of 1776 and the French Revolution of 1789. The American Declaration of Independence declared that all men are created equal and endowed with inalienable rights to life, liberty, and the pursuit of happiness. The French Declaration of the Rights of Man proclaimed liberty, equality, and fraternity as universal principles. These documents reshaped world politics."},
      {"type": "callout", "style": "tip", "title": "Indigenous Influence on Democratic Thought", "content": "Some historians argue that contact with the governance traditions of the Haudenosaunee (Iroquois) Confederacy influenced the Enlightenment thinkers and framers of American democracy. The Haudenosaunee model of a confederacy of sovereign nations with a shared governing council, operating by consensus and protecting individual liberties, was observed by European colonists for decades before the American Revolution. While the extent of this influence is debated, it is worth recognizing that democratic ideas were not exclusively European in origin."},
      {"type": "quiz", "question": "What was the Enlightenment?", "options": ["A medieval religious revival", "A 16th-century artistic movement in Italy", "An 18th-century intellectual movement that applied reason to politics and governance", "A scientific discovery about the nature of light"], "correctIndex": 2, "explanation": "The Enlightenment was an intellectual movement from roughly 1685 to 1815 that applied rational analysis to human society and politics, challenging traditional authority and inspiring democratic revolutions."}
    ]'::jsonb,
    '[
      {"term": "Renaissance", "definition": "A cultural and intellectual movement beginning in 14th-century Italy that rediscovered classical learning and celebrated human potential."},
      {"term": "Reformation", "definition": "The 16th-century religious movement that challenged the Catholic Church and produced Protestantism."},
      {"term": "Enlightenment", "definition": "An 18th-century intellectual movement that applied reason to politics and society, inspiring democratic revolutions."},
      {"term": "Empiricism", "definition": "The philosophical principle that knowledge comes from observation and experience rather than tradition or authority."},
      {"term": "Natural Rights", "definition": "Rights believed to belong to all people by nature, not granted by governments — such as life, liberty, and property."}
    ]'::jsonb,
    'The Haudenosaunee Confederacy''s governance model — a federation of sovereign nations operating by consensus, protecting individual liberties, with women holding significant political power — is believed by some historians to have influenced Enlightenment thinkers and framers of American democracy. Democratic ideas were not exclusively European in origin, and this connection deserves acknowledgement.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What was the Renaissance?', 'A cultural and intellectual movement beginning in 14th-century Italy that rediscovered classical learning and celebrated human potential.', 'Think about rebirth of art and learning.', 2, 0),
    (v_tenant, v_ch, 'What was the Enlightenment?', 'An 18th-century intellectual movement that applied reason to politics and governance, inspiring democratic revolutions.', 'Think about reason challenging tradition.', 2, 1),
    (v_tenant, v_ch, 'Name two democratic revolutions inspired by Enlightenment ideas.', 'The American Revolution (1776) and the French Revolution (1789).', 'Think about late 18th-century political upheavals.', 2, 2);

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Colonialism & Its Impact',
    'Examine European colonialism, its global reach, and its devastating impacts on Indigenous peoples worldwide.',
    'European colonialism reshaped the entire world, creating systems of exploitation and inequality whose effects persist today.',
    'How did European colonialism reshape the world, and what are its lasting consequences for colonized peoples?')
  RETURNING id INTO v_unit;

  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Colonialism & Its Impact', 'colonialism-and-its-impact',
    'Analyze European colonialism''s global reach and its enduring consequences for colonized peoples, particularly in Canada.',
    '[
      {"type": "heading", "level": 1, "text": "Colonialism & Its Impact"},
      {"type": "text", "content": "Colonialism is the practice of one country establishing political and economic control over another territory and its people. European colonial expansion, which began in earnest in the 15th century with Portuguese and Spanish exploration, eventually spread European control over much of Africa, Asia, the Americas, and the Pacific. By the early 20th century, European powers controlled roughly 84% of the Earth''s land surface. This expansion was driven by the desire for resources, markets, and strategic power — and it was justified by ideologies of racial and cultural superiority that are now widely recognized as false and harmful."},
      {"type": "text", "content": "In the Americas, colonialism had catastrophic consequences. European diseases killed an estimated 50 to 90 percent of the Indigenous population within a century of contact. Colonial governments seized Indigenous lands, disrupted traditional economies, imposed European laws and religion, and systematically attempted to destroy Indigenous cultures and governance systems. This was not a natural or inevitable process — it was deliberate policy, justified by racist ideology and driven by economic greed."},
      {"type": "callout", "style": "info", "title": "What Is Colonialism?", "content": "Colonialism is the establishment of political and economic control over another territory and its people by a foreign power. It typically involves the seizure of land and resources, the imposition of the colonizing culture, and the suppression of Indigenous governance and identity."},
      {"type": "list", "style": "unordered", "items": ["European colonialism affected most of the world between the 15th and 20th centuries", "Disease, warfare, and deliberate policy destroyed the majority of Indigenous populations", "Colonialism created systems of racial hierarchy that persist in contemporary inequalities", "Colonized peoples resisted colonialism through many strategies across generations", "Post-colonial independence movements in the 20th century partially dismantled formal colonial empires"]},
      {"type": "text", "content": "The legacies of colonialism are visible in contemporary patterns of global inequality. Many of the world''s wealthiest countries are former colonial powers. Many of the world''s poorest countries are former colonies whose resources were extracted for European benefit. In Canada, the gap in wealth, health, education, and political power between Indigenous and non-Indigenous people is a direct legacy of colonial policies that systematically stripped Indigenous peoples of land, resources, and self-determination."},
      {"type": "callout", "style": "tip", "title": "Colonial Policies in Canada", "content": "In Canada, colonial policies targeting First Nations, Metis, and Inuit peoples included: forced relocation onto reserves; the Indian Act of 1876; the residential school system; banning of traditional ceremonies and languages; the ''Sixties Scoop'' in which thousands of Indigenous children were removed from their families by child welfare agencies; and ongoing underfunding of services on reserve. Understanding these policies is essential to understanding contemporary Indigenous experiences and the urgent need for reconciliation."},
      {"type": "quiz", "question": "What is colonialism?", "options": ["A system of free trade between equal partners", "The establishment of political and economic control over another territory and its people", "A system of cultural exchange between equal societies", "The voluntary settlement of uninhabited lands"], "correctIndex": 1, "explanation": "Colonialism involves one power establishing political and economic control over another territory and its people — typically including seizure of land, exploitation of resources, and suppression of Indigenous identity and governance."}
    ]'::jsonb,
    '[
      {"term": "Colonialism", "definition": "The establishment of political and economic control over another territory and its people by a foreign power."},
      {"term": "Settler Colonialism", "definition": "A form of colonialism where settlers permanently displace Indigenous populations and claim their lands."},
      {"term": "Residential School", "definition": "A government-mandated, church-run school in Canada where Indigenous children were forcibly removed from their families and forbidden from speaking their languages or practising their cultures."},
      {"term": "Sixties Scoop", "definition": "A period from the 1960s through the 1980s when thousands of Indigenous children were removed from their families by Canadian child welfare agencies and placed in non-Indigenous homes."},
      {"term": "Decolonization", "definition": "The process of dismantling colonial systems and restoring Indigenous rights, lands, and self-determination."}
    ]'::jsonb,
    'Colonial policies in Canada systematically targeted First Nations, Metis, and Inuit peoples through the Indian Act, residential schools, the Sixties Scoop, forced relocation, and cultural suppression. These are not historical events — their consequences shape Indigenous communities in Saskatchewan and across Canada today. Understanding colonialism honestly is a prerequisite for meaningful reconciliation.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is colonialism?', 'The establishment of political and economic control over another territory and its people by a foreign power.', 'Think about European empires controlling other lands.', 2, 0),
    (v_tenant, v_ch, 'What was the Sixties Scoop?', 'A period from the 1960s-1980s when thousands of Indigenous children were removed from families by Canadian child welfare agencies.', 'Think about forced family separation.', 2, 1),
    (v_tenant, v_ch, 'Name two lasting consequences of colonialism in Canada.', 'Examples: poverty on reserves, loss of language and culture, gaps in health and education, political marginalization.', 'Think about inequalities that persist today.', 3, 2);

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Residential Schools & Reconciliation',
    'Examine the residential school system in Canada, its devastating impacts, and the ongoing journey of reconciliation.',
    'The residential school system was a policy of cultural genocide whose impacts are intergenerational and whose legacy requires active reconciliation.',
    'What was the residential school system, what were its impacts, and what does genuine reconciliation require of all Canadians?')
  RETURNING id INTO v_unit;

  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Residential Schools & Reconciliation', 'residential-schools-reconciliation',
    'Examine the residential school system, its impacts on Indigenous communities, and what genuine reconciliation means.',
    '[
      {"type": "heading", "level": 1, "text": "Residential Schools & Reconciliation"},
      {"type": "text", "content": "From the 1870s to the 1990s, the Canadian government, in partnership with several Christian churches, operated a system of residential schools designed to assimilate Indigenous children into Euro-Canadian culture. Children — sometimes as young as four or five years old — were forcibly removed from their families and communities, transported to schools often hundreds of kilometres away, forbidden from speaking their languages or practising their cultures, and subjected to harsh discipline. The explicit goal of the system was, in the words of Canada''s first Prime Minister, to ''kill the Indian in the child.''"},
      {"type": "text", "content": "The residential school system operated approximately 139 schools across Canada, attended by over 150,000 First Nations, Metis, and Inuit children. Conditions in many schools were harsh and abusive. Children suffered physical, emotional, sexual, and spiritual abuse. Malnutrition and disease were widespread. Thousands of children died at the schools and were buried in unmarked graves. In 2021, the discovery of hundreds of unmarked graves at former school sites in British Columbia, Saskatchewan, and Manitoba drew widespread national attention to this history."},
      {"type": "callout", "style": "info", "title": "The Residential School System", "content": "The residential school system was a network of approximately 139 government-funded, church-run schools where Indigenous children were forcibly placed from the 1870s through the 1990s. The last school closed in 1997. The system was designed to assimilate Indigenous children by stripping away their language, culture, and family connections."},
      {"type": "list", "style": "unordered", "items": ["Over 150,000 First Nations, Metis, and Inuit children attended residential schools", "Children were forbidden from speaking their languages and practising their cultures", "Thousands of children died at the schools", "The Truth and Reconciliation Commission (2008-2015) documented the school system''s history", "The TRC identified 94 Calls to Action to advance reconciliation"]},
      {"type": "text", "content": "In 2008, the Canadian government issued a formal apology to residential school Survivors. From 2008 to 2015, the Truth and Reconciliation Commission of Canada (TRC) gathered testimony from thousands of Survivors and documented the history and impacts of the residential school system. The TRC concluded that the system amounted to cultural genocide and issued 94 Calls to Action — recommendations for governments, institutions, and all Canadians to advance reconciliation."},
      {"type": "callout", "style": "tip", "title": "Intergenerational Trauma", "content": "The impacts of residential schools did not end when the schools closed. Survivors who were denied the experience of a loving, culturally connected family life often struggled to parent their own children. This has created cycles of trauma, substance abuse, family breakdown, and poverty that researchers call intergenerational trauma. Understanding that many of the challenges facing Indigenous communities today are rooted in the deliberate destruction of families and culture — not in any inherent deficiency — is essential to approaching reconciliation with accuracy and compassion."},
      {"type": "quiz", "question": "What was the Truth and Reconciliation Commission?", "options": ["A court that tried residential school administrators", "A commission that gathered Survivor testimony and documented the history of residential schools, issuing 94 Calls to Action", "A government department that ran residential schools", "A church organization that apologized for the schools"], "correctIndex": 1, "explanation": "The Truth and Reconciliation Commission (2008-2015) gathered testimony from thousands of Survivors of the residential school system, documented its history and impacts, and issued 94 Calls to Action recommending steps toward reconciliation."}
    ]'::jsonb,
    '[
      {"term": "Residential School", "definition": "A government-mandated, church-run school designed to assimilate Indigenous children by removing them from their families and forbidding their languages and cultures."},
      {"term": "Cultural Genocide", "definition": "The deliberate destruction of a group''s culture, language, and identity, even when the group itself is not physically eliminated."},
      {"term": "Truth and Reconciliation Commission (TRC)", "definition": "A commission (2008-2015) that documented the residential school system''s history, gathered Survivor testimony, and issued 94 Calls to Action."},
      {"term": "Intergenerational Trauma", "definition": "Psychological and social harm that is transmitted from one generation to the next as a result of historical trauma."},
      {"term": "Survivor", "definition": "A person who attended residential school and lived through the experience; a term used by and for Indigenous people who endured the system."}
    ]'::jsonb,
    'The residential school system was one of the most devastating colonial policies inflicted on Indigenous peoples in Canada. Over 150,000 children attended these schools; thousands died. The system''s impacts — loss of language, family disruption, and intergenerational trauma — continue to shape Indigenous communities in Saskatchewan today. Genuine reconciliation requires learning this history and taking meaningful action.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What was the residential school system?', 'A network of ~139 government-funded, church-run schools where Indigenous children were forcibly placed to assimilate them into Euro-Canadian culture.', 'Think about forced removal and cultural stripping.', 2, 0),
    (v_tenant, v_ch, 'What is intergenerational trauma?', 'Psychological and social harm transmitted from one generation to the next as a result of historical trauma.', 'Think about how trauma in parents can affect children and grandchildren.', 3, 1),
    (v_tenant, v_ch, 'What is the TRC?', 'The Truth and Reconciliation Commission (2008-2015), which documented residential school history and issued 94 Calls to Action.', 'Think about the commission that gathered Survivor stories.', 2, 2);

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'TRC Calls to Action',
    'Examine the TRC''s 94 Calls to Action and explore what concrete steps toward reconciliation look like in Saskatchewan.',
    'Reconciliation requires concrete action from governments, institutions, and individual citizens — not just acknowledgement.',
    'What does genuine reconciliation require of governments, institutions, and individual Canadians?')
  RETURNING id INTO v_unit;

  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'TRC Calls to Action', 'trc-calls-to-action',
    'Explore the TRC''s 94 Calls to Action and analyze what meaningful reconciliation looks like in practice.',
    '[
      {"type": "heading", "level": 1, "text": "TRC Calls to Action"},
      {"type": "text", "content": "The Truth and Reconciliation Commission''s 94 Calls to Action were issued in 2015 as a blueprint for reconciliation in Canada. They are directed at all levels of government, the church, the education system, the justice system, the health system, and individual Canadians. The Calls to Action are organized into categories including Child Welfare, Education, Language and Culture, Health, Justice, and Reconciliation. Together, they represent a comprehensive program for transforming Canadian society''s relationship with Indigenous peoples."},
      {"type": "text", "content": "Among the most discussed Calls to Action in education are Call 62, which calls on governments to make age-appropriate Indigenous curriculum, including residential school history and Treaty education, mandatory in all schools from kindergarten to Grade 12, and Call 63, which calls on the Council of Ministers of Education to maintain an annual commitment to Indigenous education issues. These calls directly affect Saskatchewan students and teachers."},
      {"type": "callout", "style": "info", "title": "The 94 Calls to Action", "content": "The TRC''s 94 Calls to Action cover: Child Welfare (1-5), Education (6-12), Language and Culture (13-17), Health (18-24), Justice (25-42), and Reconciliation (43-94). They address systemic issues in Canadian society that continue to cause harm to Indigenous peoples."},
      {"type": "list", "style": "unordered", "items": ["Call 62: Mandatory Indigenous curriculum including residential school history in all K-12 schools", "Call 43: Adopt and implement the UN Declaration on the Rights of Indigenous Peoples (UNDRIP)", "Call 73: Fund and support Indigenous language revitalization programs", "Call 22: Health system reform to address Indigenous health disparities", "Call 94: Replace the Oath of Citizenship with one acknowledging Treaties"]},
      {"type": "text", "content": "Progress on the Calls to Action has been uneven. Some calls — particularly those requiring legislative changes or significant funding — have moved slowly. Others have been adopted more quickly, particularly by schools, municipalities, and community organizations. The National Day for Truth and Reconciliation (September 30), made a federal statutory holiday in 2021, was a response to TRC calls. The day, also known as Orange Shirt Day, honours residential school Survivors and all who were affected."},
      {"type": "callout", "style": "tip", "title": "Reconciliation in Saskatchewan", "content": "In Saskatchewan, reconciliation efforts include: Treaty education as a mandatory part of the K-12 curriculum; land acknowledgements at the start of public events; municipal, provincial, and educational institution commitments to UNDRIP; the growth of Indigenous languages programs in schools; partnerships between school divisions and First Nations communities; and Indigenous-led organizations working on healing and cultural revitalization. These efforts are meaningful, but Survivors and Indigenous leaders consistently emphasize that reconciliation must also address systemic inequalities in funding, housing, health care, and justice."},
      {"type": "quiz", "question": "What is Call to Action 62 about?", "options": ["Building new residential schools", "Making age-appropriate Indigenous curriculum, including residential school history, mandatory in all K-12 schools", "Paying financial compensation to Survivors", "Establishing a new national holiday"], "correctIndex": 1, "explanation": "Call to Action 62 calls on governments to ensure that age-appropriate Indigenous curriculum, including the history and impacts of residential schools and Treaty education, is mandatory in all schools from kindergarten to Grade 12."}
    ]'::jsonb,
    '[
      {"term": "Calls to Action", "definition": "The 94 recommendations issued by the Truth and Reconciliation Commission in 2015 to advance reconciliation in Canada."},
      {"term": "Orange Shirt Day", "definition": "September 30, a day to honour residential school Survivors, symbolized by the orange shirt of a girl whose shirt was taken from her on her first day at school."},
      {"term": "National Day for Truth and Reconciliation", "definition": "A federal statutory holiday on September 30, created in 2021 to honour residential school Survivors and advance reconciliation."},
      {"term": "Language Revitalization", "definition": "Efforts to preserve, teach, and increase the use of an endangered language."},
      {"term": "Land Acknowledgement", "definition": "A formal statement recognizing the traditional Indigenous territory on which an event or institution is located."}
    ]'::jsonb,
    'The TRC''s 94 Calls to Action provide a comprehensive blueprint for reconciliation in Canada. Several calls directly affect Saskatchewan''s education system, including mandatory Treaty education and residential school curriculum. Orange Shirt Day (September 30) is a nationally observed day of reflection and action. Genuine reconciliation requires more than symbolic gestures — it requires addressing systemic inequalities in funding, health, housing, and justice.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are the TRC''s Calls to Action?', '94 recommendations issued in 2015 as a blueprint for reconciliation across Canadian governments, institutions, and society.', 'Think about concrete steps toward healing.', 2, 0),
    (v_tenant, v_ch, 'What is Orange Shirt Day?', 'September 30 — a day to honour residential school Survivors, named for the orange shirt taken from a girl on her first day at school.', 'Think about what the orange shirt represents.', 2, 1),
    (v_tenant, v_ch, 'What does Call to Action 62 require?', 'That age-appropriate Indigenous curriculum, including residential school history and Treaty education, be mandatory in all K-12 schools.', 'Think about education and Indigenous history.', 2, 2);

END;
$$;


-- ============================================================================
-- TEXTBOOK: WolfWhale Social Studies 9
-- Slug: wolfwhale-social-studies-9
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-social-studies-9';

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Globalization',
    'Examine globalization: its drivers, its benefits, its inequalities, and its relationship to cultural identity.',
    'Globalization accelerates the flow of people, goods, ideas, and capital across borders, creating both new opportunities and new inequalities.',
    'How does globalization shape economies, cultures, and inequalities, and what are the responsibilities of citizens in a globalized world?')
  RETURNING id INTO v_unit;

  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Globalization', 'globalization',
    'Analyze globalization''s economic, cultural, and social dimensions and develop informed perspectives on its effects.',
    '[
      {"type": "heading", "level": 1, "text": "Globalization"},
      {"type": "text", "content": "Globalization refers to the increasing interconnection of the world''s economies, cultures, and societies through the flow of goods, services, capital, people, and ideas across national borders. Globalization is not new — trade routes like the Silk Road connected distant civilizations thousands of years ago — but the pace and scale of globalization accelerated enormously in the second half of the 20th century with advances in transportation, communication technology, and the liberalization of trade through agreements like the World Trade Organization (WTO)."},
      {"type": "text", "content": "Economic globalization has produced both gains and losses. Proponents argue that global trade lifts people out of poverty by creating jobs, lowering prices for consumers, and transferring technology and knowledge. Critics argue that globalization often benefits wealthy countries and corporations more than poor ones, drives down wages by allowing companies to relocate to wherever labour is cheapest, and undermines national environmental and labour standards. The evidence supports aspects of both views — globalization is not uniformly good or bad; its effects depend heavily on who makes the rules and who benefits."},
      {"type": "callout", "style": "info", "title": "What Is Globalization?", "content": "Globalization is the increasing interconnection of the world through flows of goods, services, capital, people, and ideas across national borders. It is driven by advances in transportation, communication, and trade liberalization."},
      {"type": "list", "style": "unordered", "items": ["Globalization accelerated dramatically after World War II with new trade agreements and technology", "The internet and digital communication have made cultural globalization near-instantaneous", "Multinational corporations operate across many countries, shaping employment and economies globally", "Globalization can both reduce and increase inequality, depending on policy choices", "Cultural globalization raises concerns about the loss of local cultures and languages"]},
      {"type": "text", "content": "Cultural globalization — the spread of ideas, values, and cultural products across borders — raises complex questions about identity, homogenization, and power. When American films, music, and social media platforms dominate global culture, smaller cultures and languages face pressure to conform or be marginalized. At the same time, global connectivity also allows small cultures to reach global audiences in unprecedented ways, creating new possibilities for Indigenous artists, musicians, and storytellers."},
      {"type": "callout", "style": "tip", "title": "Globalization and Indigenous Peoples", "content": "Globalization has contradictory effects on Indigenous peoples. On one hand, global economic integration has enabled the expansion of resource extraction industries into Indigenous territories, often without adequate consultation or consent. Pipelines, mines, and hydroelectric projects have disrupted Indigenous lands and ways of life across Canada, including in Saskatchewan. On the other hand, global communications technology has allowed Indigenous activists, artists, and communities to connect with each other and with international allies, building networks of solidarity that have strengthened advocacy for Indigenous rights around the world."},
      {"type": "quiz", "question": "What is one criticism of economic globalization?", "options": ["It raises prices for consumers", "It creates too many jobs", "It allows companies to move to wherever labour is cheapest, potentially driving down wages and standards", "It reduces international trade"], "correctIndex": 2, "explanation": "A major criticism of economic globalization is that it allows corporations to relocate production to wherever labour costs and environmental regulations are lowest, potentially driving down wages and undermining standards in wealthier countries."}
    ]'::jsonb,
    '[
      {"term": "Globalization", "definition": "The increasing interconnection of the world through flows of goods, services, capital, people, and ideas across national borders."},
      {"term": "Multinational Corporation", "definition": "A company that operates in multiple countries, with headquarters in one nation and operations in others."},
      {"term": "Cultural Homogenization", "definition": "The process by which cultures become more similar to one another through the spread of dominant cultural products and values."},
      {"term": "World Trade Organization (WTO)", "definition": "An international organization that regulates trade between nations and resolves trade disputes."},
      {"term": "Trade Liberalization", "definition": "The reduction of trade barriers like tariffs and quotas to allow freer movement of goods between countries."}
    ]'::jsonb,
    'Globalization has contradictory effects on Indigenous peoples. Resource extraction industries expand into Indigenous territories, often without genuine consent. At the same time, global communications have enabled Indigenous communities to build international networks of solidarity and to share their cultures and advocacy globally. First Nations in Saskatchewan have used both legal and media channels internationally to assert their rights against resource development on their lands.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is globalization?', 'The increasing interconnection of the world through flows of goods, services, capital, people, and ideas across national borders.', 'Think about the world becoming more connected.', 2, 0),
    (v_tenant, v_ch, 'What is cultural homogenization?', 'The process by which cultures become more similar through the spread of dominant cultural products and values.', 'Think about American culture spreading globally.', 3, 1),
    (v_tenant, v_ch, 'Name one benefit and one risk of economic globalization.', 'Benefit: lower prices, job creation in developing countries. Risk: wage depression, environmental standards being undermined.', 'Think about who gains and who loses.', 3, 2);

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Sustainability & Environment',
    'Analyze the environmental challenges facing humanity and explore frameworks for sustainable development.',
    'Sustainable development requires balancing human needs with the long-term health of ecosystems for current and future generations.',
    'What does sustainability mean, and how can societies pursue development that meets human needs without destroying the natural world?')
  RETURNING id INTO v_unit;

  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Sustainability & Environment', 'sustainability-and-environment',
    'Examine environmental challenges at global and local scales and develop frameworks for thinking about sustainability.',
    '[
      {"type": "heading", "level": 1, "text": "Sustainability & Environment"},
      {"type": "text", "content": "Sustainability refers to the ability to meet the needs of the present without compromising the ability of future generations to meet their own needs. This definition, from the landmark 1987 Brundtland Report, captures the central challenge of our time: how do human societies pursue economic development and wellbeing without degrading the natural systems that all life depends on? Climate change, biodiversity loss, water scarcity, and soil degradation are all symptoms of unsustainable patterns of production and consumption."},
      {"type": "text", "content": "Climate change is the most urgent environmental challenge of the 21st century. The burning of fossil fuels — coal, oil, and natural gas — releases greenhouse gases, primarily carbon dioxide and methane, into the atmosphere. These gases trap heat, causing the global average temperature to rise. The consequences include more frequent and intense wildfires, floods, droughts, and storms; rising sea levels; melting permafrost; and disruption of agricultural systems. Saskatchewan, with its heavy dependence on fossil fuel extraction and long winters, faces specific challenges and opportunities in the transition to a lower-carbon economy."},
      {"type": "callout", "style": "info", "title": "Sustainable Development", "content": "Sustainable development means meeting the needs of the present without compromising the ability of future generations to meet their own needs. It involves balancing economic development, social equity, and environmental protection — sometimes called the three pillars of sustainability."},
      {"type": "list", "style": "unordered", "items": ["Climate change is caused primarily by greenhouse gas emissions from burning fossil fuels", "Saskatchewan''s potash mining and oil extraction make it a significant per-capita emitter", "Renewable energy sources like solar and wind are rapidly becoming cheaper than fossil fuels", "Indigenous land management practices offer models of long-term ecological sustainability", "International agreements like the Paris Accord aim to limit global warming to 1.5°C above pre-industrial levels"]},
      {"type": "text", "content": "Saskatchewan faces unique sustainability challenges. The province''s economy depends heavily on oil, potash, and agriculture — all of which have significant environmental footprints. At the same time, Saskatchewan has vast renewable energy potential: the province receives among the most sunshine hours in Canada, making solar energy particularly promising. The transition to a more sustainable economy will require significant investment in new technologies, worker retraining, and community support."},
      {"type": "callout", "style": "tip", "title": "Indigenous Environmental Knowledge", "content": "Indigenous peoples worldwide have developed sophisticated ecological knowledge through thousands of years of observation and relationship with specific ecosystems. In Saskatchewan, First Nations traditional ecological knowledge (TEK) includes detailed understanding of plant cycles, animal behaviour, water quality, and soil health that western science is increasingly recognizing as invaluable. Indigenous land management practices — from controlled burns to careful harvesting — maintained ecological health for millennia. Reconciliation in the environmental sphere means including Indigenous peoples as genuine partners in environmental decision-making, not just consulting them as an afterthought."},
      {"type": "quiz", "question": "What does sustainable development mean?", "options": ["Economic growth at any environmental cost", "Meeting the needs of the present without compromising the ability of future generations to meet their own needs", "Halting all economic development to protect the environment", "Only using renewable energy sources"], "correctIndex": 1, "explanation": "Sustainable development, as defined by the 1987 Brundtland Report, means meeting current human needs without compromising the ability of future generations to meet their own needs. It involves balancing economic, social, and environmental considerations."}
    ]'::jsonb,
    '[
      {"term": "Sustainability", "definition": "The ability to meet present needs without compromising the ability of future generations to meet their own needs."},
      {"term": "Climate Change", "definition": "The long-term shift in global temperatures and weather patterns, primarily driven by human emissions of greenhouse gases."},
      {"term": "Greenhouse Gas", "definition": "A gas that traps heat in the Earth''s atmosphere, such as carbon dioxide and methane."},
      {"term": "Traditional Ecological Knowledge (TEK)", "definition": "Knowledge about the natural world developed over generations by Indigenous peoples through direct observation and relationship with the land."},
      {"term": "Paris Agreement", "definition": "An international treaty (2015) in which countries committed to limit global warming to well below 2°C above pre-industrial levels."}
    ]'::jsonb,
    'Indigenous peoples worldwide have developed sophisticated traditional ecological knowledge (TEK) through thousands of years of relationship with specific landscapes. In Saskatchewan, First Nations TEK offers invaluable insights into plant cycles, water quality, animal behaviour, and sustainable land management. Genuine environmental reconciliation means incorporating Indigenous knowledge systems as equal partners in environmental governance, not as a token gesture.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is sustainability?', 'Meeting present needs without compromising the ability of future generations to meet their own needs.', 'Think about long-term thinking and balance.', 2, 0),
    (v_tenant, v_ch, 'What causes climate change?', 'Primarily the burning of fossil fuels, which releases greenhouse gases (CO2, methane) that trap heat in the atmosphere.', 'Think about coal, oil, and natural gas.', 2, 1),
    (v_tenant, v_ch, 'What is Traditional Ecological Knowledge (TEK)?', 'Knowledge about the natural world developed by Indigenous peoples over generations through direct observation and relationship with the land.', 'Think about Indigenous land management wisdom.', 2, 2);

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Human Rights',
    'Explore the history and foundations of human rights, international human rights law, and contemporary human rights challenges.',
    'Human rights are universal, inalienable, and indivisible — and their protection requires active engagement from citizens and institutions.',
    'What are human rights, where do they come from, and what does it mean to be a human rights defender?')
  RETURNING id INTO v_unit;

  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Human Rights', 'human-rights',
    'Examine the foundations and history of human rights, international human rights frameworks, and contemporary challenges.',
    '[
      {"type": "heading", "level": 1, "text": "Human Rights"},
      {"type": "text", "content": "Human rights are rights that belong to every person simply by virtue of being human. They do not depend on citizenship, ethnicity, gender, religion, or any other characteristic. The idea that human beings have inherent dignity and deserve fundamental protections has deep roots in many philosophical and religious traditions, but its formalization into international law is relatively recent. The Universal Declaration of Human Rights (UDHR), adopted by the United Nations in 1948 in the aftermath of the Holocaust and World War II, was the first international statement of universal human rights standards."},
      {"type": "text", "content": "The UDHR contains 30 articles covering civil and political rights (like freedom of speech, religion, and fair trial), economic rights (like the right to work and education), and social and cultural rights (like the right to participate in cultural life and the right to adequate living standards). The UDHR is not legally binding, but it has provided the foundation for two binding international treaties: the International Covenant on Civil and Political Rights (ICCPR) and the International Covenant on Economic, Social and Cultural Rights (ICESCR), both adopted in 1966."},
      {"type": "callout", "style": "info", "title": "The Universal Declaration of Human Rights (UDHR)", "content": "Adopted by the United Nations in 1948, the UDHR was the first international statement of universal human rights. Its 30 articles cover civil, political, economic, social, and cultural rights belonging to all people everywhere. Eleanor Roosevelt chaired the drafting committee."},
      {"type": "list", "style": "unordered", "items": ["Human rights are universal: they apply to every person regardless of nationality or identity", "Human rights are inalienable: they cannot be taken away except in specific legal circumstances", "Human rights are indivisible: civil, political, economic, and cultural rights are equally important", "Canada has a strong human rights framework but faces ongoing challenges, particularly regarding Indigenous rights", "Human rights defenders are people who advocate for the rights of individuals and groups facing violations"]},
      {"type": "text", "content": "Canada has a strong international reputation for human rights, but faces significant domestic human rights challenges. The ongoing gap in living standards between Indigenous and non-Indigenous Canadians — reflected in higher rates of poverty, lower life expectancy, inadequate housing, and overrepresentation in the justice system — represents a systemic human rights concern. International bodies have repeatedly called on Canada to address these disparities, including through full implementation of UNDRIP."},
      {"type": "callout", "style": "tip", "title": "Indigenous Rights as Human Rights", "content": "The human rights of Indigenous peoples are recognized in several international instruments, most importantly UNDRIP (2007). UNDRIP affirms Indigenous peoples'' right to self-determination, to maintain their cultures and languages, to control their lands and resources, and to free, prior, and informed consent before governments take actions affecting them. In Canada, the gap between these international commitments and the lived reality of many Indigenous communities is wide — and closing it is a central task of reconciliation. Activists like Cindy Blackstock, a Cree social worker who pursued a landmark human rights case against the federal government over Indigenous child welfare, have used human rights frameworks effectively to advance Indigenous rights."},
      {"type": "quiz", "question": "When was the Universal Declaration of Human Rights adopted?", "options": ["1918", "1945", "1948", "1982"], "correctIndex": 2, "explanation": "The UDHR was adopted by the United Nations General Assembly on December 10, 1948, in the aftermath of World War II and the Holocaust. December 10 is now observed as International Human Rights Day."}
    ]'::jsonb,
    '[
      {"term": "Human Rights", "definition": "Rights that belong to every person simply by virtue of being human, regardless of nationality, ethnicity, or any other characteristic."},
      {"term": "Universal Declaration of Human Rights (UDHR)", "definition": "The 1948 United Nations document declaring universal human rights standards for all people everywhere."},
      {"term": "Inalienable", "definition": "Cannot be taken away or surrendered; a characteristic of fundamental human rights."},
      {"term": "Human Rights Defender", "definition": "A person who advocates for the protection of human rights for individuals or groups facing violations."},
      {"term": "UNDRIP", "definition": "The UN Declaration on the Rights of Indigenous Peoples (2007), affirming Indigenous rights to self-determination, culture, land, and free, prior, and informed consent."}
    ]'::jsonb,
    'Indigenous rights are recognized as human rights under international law, particularly through UNDRIP (2007). Activists like Cindy Blackstock have used human rights frameworks to advance Indigenous rights in Canada. The ongoing gap between Canada''s human rights commitments and the lived reality of many Indigenous communities — in poverty, health, housing, and justice — represents one of the most urgent human rights challenges in the country.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the Universal Declaration of Human Rights?', 'The 1948 United Nations document declaring universal human rights standards for all people.', 'Think about the international document adopted after World War II.', 2, 0),
    (v_tenant, v_ch, 'What does "inalienable" mean in the context of human rights?', 'Rights that cannot be taken away or surrendered — they belong to every person inherently.', 'Think about rights that can''t be removed.', 2, 1),
    (v_tenant, v_ch, 'How does UNDRIP relate to Indigenous rights in Canada?', 'UNDRIP affirms Indigenous rights to self-determination, culture, land, and consent — rights Canada has committed to uphold but often falls short of in practice.', 'Think about the gap between commitment and reality.', 3, 2);

  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Indigenous Sovereignty',
    'Examine Indigenous sovereignty as a political, legal, and cultural concept and explore its contemporary expressions in Canada and globally.',
    'Indigenous sovereignty is an inherent right that pre-dates colonialism and continues to be asserted and recognized in international and Canadian law.',
    'What is Indigenous sovereignty, how has it been suppressed, and how is it being reclaimed today?')
  RETURNING id INTO v_unit;

  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Indigenous Sovereignty', 'indigenous-sovereignty',
    'Analyze Indigenous sovereignty as an inherent right, examine how it was suppressed by colonialism, and explore its contemporary expressions.',
    '[
      {"type": "heading", "level": 1, "text": "Indigenous Sovereignty"},
      {"type": "text", "content": "Indigenous sovereignty is the inherent right of Indigenous peoples to govern themselves, manage their lands, maintain their cultures, and determine their own futures. It is not a right granted by the Canadian government — it pre-dates European contact by thousands of years. The concept of sovereignty in Western law typically refers to the supreme authority of a state over a territory. Indigenous sovereignty is similar but rooted in different foundations: long-standing occupation and use of the land, distinct legal traditions and governance systems, and the spiritual relationship between peoples and their territories."},
      {"type": "text", "content": "Colonialism systematically attacked Indigenous sovereignty through legal doctrines like the Doctrine of Discovery, which denied Indigenous political authority; legislation like the Indian Act, which imposed colonial governance; physical violence, including the RCMP enforcing colonial laws on reserves; and cultural policies like residential schools and bans on traditional ceremonies. The cumulative effect was to dramatically weaken — though never fully eliminate — Indigenous sovereignty across Canada."},
      {"type": "callout", "style": "info", "title": "What Is Indigenous Sovereignty?", "content": "Indigenous sovereignty is the inherent right of Indigenous peoples to govern themselves, manage their territories, and maintain their cultures. It is not granted by colonial governments — it precedes them. In Canada, Indigenous sovereignty is recognized in Section 35 of the Constitution and increasingly in court decisions and international law."},
      {"type": "list", "style": "unordered", "items": ["Indigenous sovereignty is inherent, not granted by colonial governments", "Treaties were agreements between sovereign nations, not surrenders of sovereignty", "The Indian Act systematically undermined First Nations governance", "Section 35 of the Constitution recognizes and affirms Aboriginal and Treaty rights", "First Nations governments are increasingly reclaiming jurisdiction over education, child welfare, and land management"]},
      {"type": "text", "content": "Today, Indigenous sovereignty is being increasingly recognized in Canadian law and politics. Landmark Supreme Court decisions like Haida Nation v. British Columbia (2004) have established that governments have a legal duty to consult Indigenous peoples before making decisions that affect their rights and territories. First Nations communities across Canada, including in Saskatchewan, are reclaiming jurisdiction over child welfare, education, language programs, and resource management. This is not separatism — it is the exercise of rights that were never fully extinguished."},
      {"type": "callout", "style": "tip", "title": "Sovereignty in Saskatchewan Today", "content": "In Saskatchewan, First Nations sovereignty is expressed through many institutions and actions. The Federation of Sovereign Indigenous Nations (FSIN) advocates politically for 74 First Nations. Individual First Nations have negotiated funding agreements to deliver their own child welfare, education, and health services. Some First Nations are negotiating resource revenue-sharing agreements with the province. Treaty Land Entitlement agreements are restoring land that was wrongly withheld from First Nations at the time of Treaty signing. Each of these represents the ongoing assertion of sovereignty in practical and meaningful ways."},
      {"type": "quiz", "question": "What is a key principle of Indigenous sovereignty?", "options": ["It was granted to First Nations by the Canadian government in 1982", "It is an inherent right that pre-dates European contact and colonialism", "It applies only to First Nations living on reserves", "It means complete independence from all Canadian law"], "correctIndex": 1, "explanation": "Indigenous sovereignty is an inherent right — it pre-dates European contact and colonialism. It does not depend on recognition by the Canadian government, though such recognition in law (like Section 35) is important for practical expression of sovereignty."}
    ]'::jsonb,
    '[
      {"term": "Indigenous Sovereignty", "definition": "The inherent right of Indigenous peoples to govern themselves, manage their territories, and maintain their cultures, pre-dating European contact."},
      {"term": "Duty to Consult", "definition": "The legal obligation of Canadian governments to consult with Indigenous peoples before making decisions that may affect their rights or territories."},
      {"term": "Treaty Land Entitlement", "definition": "An agreement process to provide First Nations with land they were owed but did not receive at the time of Treaty signing."},
      {"term": "Jurisdiction", "definition": "The authority of a government or body to make and enforce laws in a particular area or domain."},
      {"term": "Self-Determination", "definition": "The right of a people to choose their own political status and form of governance."}
    ]'::jsonb,
    'Indigenous sovereignty is an inherent right that pre-dates colonialism and has never been fully extinguished. In Saskatchewan, it is expressed through the FSIN, individual First Nations'' self-governance initiatives, Treaty Land Entitlement agreements, and resource revenue sharing. Court decisions like Haida Nation v. British Columbia have strengthened the legal duty to consult Indigenous peoples. Reconciliation requires creating genuine space for Indigenous sovereignty to be practised and respected.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is Indigenous sovereignty?', 'The inherent right of Indigenous peoples to govern themselves, manage their territories, and maintain their cultures — pre-dating European contact.', 'Think about rights that existed before colonialism.', 3, 0),
    (v_tenant, v_ch, 'What is the duty to consult?', 'The legal obligation of Canadian governments to consult with Indigenous peoples before making decisions that may affect their rights or territories.', 'Think about a legal requirement established by the Supreme Court.', 3, 1),
    (v_tenant, v_ch, 'What is self-determination?', 'The right of a people to choose their own political status and form of governance.', 'Think about the right to decide your own future as a people.', 3, 2);

END;
$$;
