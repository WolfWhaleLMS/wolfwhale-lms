-- ============================================================================
-- WolfWhale Textbook Content Seed: ELA Grades K-3
-- Saskatchewan WNCP English Language Arts
--
-- Populates: textbook_units, textbook_chapters, textbook_flashcards,
--            chapter_outcome_map
--
-- Each grade is wrapped in its own DO $$ block.
-- Depends on: seed_textbooks.sql, seed_curriculum_outcomes.sql
-- ============================================================================


-- ============================================================================
-- GRADE K — WolfWhale English Language Arts K
-- Outcomes: CRK.1-CRK.4, CCK.1-CCK.4, ARK.1-ARK.2
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
    WHERE tenant_id = v_tenant AND slug = 'wolfwhale-ela-k';

  -- ========================================================================
  -- UNIT 1: Comprehend and Respond (CRK.1 – CRK.4)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Listening, Viewing, and Emerging Reading',
    'Developing foundational skills in listening, viewing images and media, and beginning to engage with stories and print.',
    'We make sense of our world by listening carefully, looking closely, and exploring stories.',
    'How do we understand the stories and messages around us?')
  RETURNING id INTO v_unit;

  -- Chapter 1 — Listening to Stories (CRK.3)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 1, 'Listening to Stories', 'ela-k-listening-to-stories',
    'Listen carefully to stories, songs, and oral texts to understand their meaning.',
    '[
      {"type": "heading", "content": "Listening to Stories", "level": 1},
      {"type": "text", "content": "When someone reads a story to you or tells you a tale, you are listening. Listening is one of the most important ways we learn. Good listeners hear the words, think about what they mean, and picture the story in their minds."},
      {"type": "callout", "content": "A good listener sits quietly, looks at the speaker, and thinks about what they hear.", "style": "tip"},
      {"type": "heading", "content": "What Do We Listen For?", "level": 2},
      {"type": "text", "content": "When we listen to a story, we pay attention to:\n- Who is in the story (the characters)\n- Where the story happens (the setting)\n- What happens in the story (the events)\n\nWe can also listen for feelings. Does the character sound happy, sad, scared, or excited?"},
      {"type": "heading", "content": "Listening to Songs and Poems", "level": 2},
      {"type": "text", "content": "Songs and poems have rhythm and rhyme. When you listen to a song, you might hear words that sound alike at the end, like cat and hat, or moon and soon. Clapping along can help you hear the beat."},
      {"type": "callout", "content": "Rhyming words sound the same at the end. Can you think of a word that rhymes with dog?", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What should a good listener do?", "options": ["Talk to a friend", "Sit quietly and look at the speaker", "Play with a toy", "Close their eyes and sleep"], "correct": 1, "explanation": "A good listener sits quietly, looks at the speaker, and thinks about the words."},
      {"type": "quiz", "question": "Which pair of words rhyme?", "options": ["Sun and moon", "Cat and hat", "Book and tree", "Dog and bird"], "correct": 1, "explanation": "Cat and hat both end with the same sound: -at. That makes them rhyming words."}
    ]'::jsonb,
    '[{"term": "Listen", "definition": "To pay attention to sounds and words with your ears"},
      {"term": "Character", "definition": "A person or animal in a story"},
      {"term": "Setting", "definition": "Where and when a story takes place"},
      {"term": "Rhyme", "definition": "Words that sound the same at the end, like cat and hat"}]'::jsonb,
    'Oral storytelling is a cornerstone of Indigenous cultures in Saskatchewan. Cree, Dene, Saulteaux, and Metis Elders share stories that teach values, history, and lessons about living with the land. Listening respectfully is a key part of this tradition.',
    12, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CRK.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does it mean to listen?', 'To pay attention to sounds and words with your ears.', 'Think about what your ears do when someone speaks.', 1, 0),
    (v_tenant, v_ch, 'What is a character?', 'A person or animal in a story.', 'Think about who the story is about.', 1, 1),
    (v_tenant, v_ch, 'What are rhyming words?', 'Words that sound the same at the end, like cat and hat.', 'They share the same ending sound.', 1, 2),
    (v_tenant, v_ch, 'What is the setting of a story?', 'Where and when the story takes place.', 'Think about the place and time in the story.', 1, 3);


  -- Chapter 2 — Looking at Pictures and Videos (CRK.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 2, 'Looking at Pictures and Videos', 'ela-k-looking-at-pictures',
    'View and interpret images, photographs, videos, and other visual texts.',
    '[
      {"type": "heading", "content": "Looking at Pictures and Videos", "level": 1},
      {"type": "text", "content": "Pictures, photographs, and videos all tell us something. When we look carefully at a picture, we can figure out what is happening, who is there, and how the people or characters might feel."},
      {"type": "callout", "content": "Looking carefully at a picture is called viewing. Good viewers look at every part of the picture.", "style": "info"},
      {"type": "heading", "content": "What Can Pictures Tell Us?", "level": 2},
      {"type": "text", "content": "A picture can show us:\n- People or animals doing something\n- A place like a park, a school, or a forest\n- Feelings like happiness, surprise, or worry\n- A season like winter snow or summer sunshine"},
      {"type": "heading", "content": "Looking at a Video", "level": 2},
      {"type": "text", "content": "Videos are moving pictures with sounds. When you watch a video, notice what you see and what you hear. The pictures and sounds work together to tell you the message."},
      {"type": "callout", "content": "After you look at a picture or video, try to tell someone what you saw. This helps you understand it better!", "style": "tip"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "When we look carefully at a picture to understand it, we are:", "options": ["Writing", "Viewing", "Running", "Sleeping"], "correct": 1, "explanation": "Viewing means looking at something carefully to understand what it shows."},
      {"type": "quiz", "question": "A photo shows children wearing coats and playing in snow. What season is it?", "options": ["Summer", "Spring", "Winter", "Fall"], "correct": 2, "explanation": "Coats and snow tell us it is winter."}
    ]'::jsonb,
    '[{"term": "Viewing", "definition": "Looking at pictures, photos, or videos carefully to understand them"},
      {"term": "Visual text", "definition": "Something we look at to get a message, like a picture, poster, or video"},
      {"term": "Message", "definition": "The idea or information that a picture or video is trying to share"}]'::jsonb,
    'Indigenous art such as beadwork, birchbark biting, and pictographs are visual texts that carry meaning. Looking at these artworks teaches us about stories, traditions, and the natural world.',
    12, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CRK.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does viewing mean?', 'Looking at pictures, photos, or videos carefully to understand them.', 'Think about using your eyes to learn.', 1, 0),
    (v_tenant, v_ch, 'What is a visual text?', 'Something we look at to get a message, like a picture, poster, or video.', 'It uses images instead of just words.', 1, 1),
    (v_tenant, v_ch, 'Name two things a picture can show us.', 'People or animals doing something, a place, feelings, or a season.', 'Think about what you notice when you look at a photo.', 1, 2);


  -- Chapter 3 — Retelling Stories (CRK.4)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 3, 'Retelling Stories', 'ela-k-retelling-stories',
    'Retell and respond to stories, poems, and songs that have been read aloud.',
    '[
      {"type": "heading", "content": "Retelling Stories", "level": 1},
      {"type": "text", "content": "After you hear a story, you can tell it again in your own words. This is called retelling. When you retell a story, you share what happened at the beginning, the middle, and the end."},
      {"type": "heading", "content": "Beginning, Middle, and End", "level": 2},
      {"type": "text", "content": "Every story has three parts:\n- The beginning tells us who is in the story and where it happens.\n- The middle tells us the problem or what happens.\n- The end tells us how things work out."},
      {"type": "callout", "content": "Use the words first, then, and last to help you retell a story in order.", "style": "tip"},
      {"type": "heading", "content": "Responding to Stories", "level": 2},
      {"type": "text", "content": "After hearing a story, you can share your thoughts:\n- What was your favourite part?\n- How did the story make you feel?\n- Does the story remind you of something in your own life?\n\nSharing your thoughts about a story is called responding."},
      {"type": "callout", "content": "There is no wrong answer when you share what you think about a story. Your ideas matter!", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What does retelling a story mean?", "options": ["Reading it for the first time", "Telling the story again in your own words", "Drawing a picture", "Writing the story in a book"], "correct": 1, "explanation": "Retelling means telling the story again using your own words, sharing what happened."},
      {"type": "quiz", "question": "What are the three parts of a story?", "options": ["Top, middle, bottom", "Beginning, middle, end", "First chapter, second chapter, third chapter", "Morning, noon, night"], "correct": 1, "explanation": "Stories have a beginning, a middle, and an end."}
    ]'::jsonb,
    '[{"term": "Retell", "definition": "To tell a story again in your own words"},
      {"term": "Beginning", "definition": "The first part of a story that introduces the characters and setting"},
      {"term": "Middle", "definition": "The part of a story where the main events or problem happen"},
      {"term": "End", "definition": "The last part of a story where things are resolved"},
      {"term": "Respond", "definition": "To share your thoughts and feelings about something you heard or read"}]'::jsonb,
    'In Indigenous oral traditions, stories are retold from generation to generation. Each retelling keeps the story alive. Elders often ask listeners to retell what they heard to make sure the teachings are remembered.',
    12, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CRK.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does retell mean?', 'To tell a story again in your own words.', 'You heard the story. Now you share it.', 1, 0),
    (v_tenant, v_ch, 'What are the three parts of a story?', 'Beginning, middle, and end.', 'Think: first, then, last.', 1, 1),
    (v_tenant, v_ch, 'What does it mean to respond to a story?', 'To share your thoughts and feelings about what you heard.', 'What did you think? How did it make you feel?', 1, 2);


  -- Chapter 4 — Understanding the World Through Stories (CRK.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 4, 'Understanding the World Through Stories', 'ela-k-understanding-world',
    'Comprehend and respond to texts about identity, community, and social responsibility.',
    '[
      {"type": "heading", "content": "Understanding the World Through Stories", "level": 1},
      {"type": "text", "content": "Stories teach us about who we are, the people around us, and how to treat each other. When we listen to or look at stories, we learn about different families, communities, and ways of life."},
      {"type": "heading", "content": "Stories About Identity", "level": 2},
      {"type": "text", "content": "Identity means who you are. Stories about identity help us think about:\n- What makes me special?\n- What do I like to do?\n- What is important to my family?\n\nEvery person has their own story."},
      {"type": "heading", "content": "Stories About Community", "level": 2},
      {"type": "text", "content": "A community is a group of people who live or work together. Stories about community show us how people help each other, share, and take care of the places where they live."},
      {"type": "callout", "content": "Your classroom is a community! You help each other learn and grow every day.", "style": "info"},
      {"type": "heading", "content": "Being Responsible", "level": 2},
      {"type": "text", "content": "Some stories teach us about being responsible. Being responsible means doing the right thing, even when no one is watching. It means taking care of our belongings, being kind, and helping others."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What does identity mean?", "options": ["A type of book", "Who you are", "A place you visit", "A kind of animal"], "correct": 1, "explanation": "Identity means who you are — the things that make you special and unique."},
      {"type": "quiz", "question": "What is a community?", "options": ["A single person", "A group of people who live or work together", "A kind of food", "A type of weather"], "correct": 1, "explanation": "A community is a group of people who share a place and help each other."}
    ]'::jsonb,
    '[{"term": "Identity", "definition": "Who you are and what makes you special"},
      {"term": "Community", "definition": "A group of people who live or work together and help each other"},
      {"term": "Responsible", "definition": "Doing the right thing and taking care of yourself and others"}]'::jsonb,
    'Indigenous communities in Saskatchewan teach identity through clan systems, family stories, and cultural practices. Learning about who you are and where you come from is an important part of growing up in every culture.',
    12, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CRK.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does identity mean?', 'Who you are and what makes you special.', 'Think about what you like and what your family is like.', 1, 0),
    (v_tenant, v_ch, 'What is a community?', 'A group of people who live or work together and help each other.', 'Your school and neighbourhood are examples.', 1, 1),
    (v_tenant, v_ch, 'What does responsible mean?', 'Doing the right thing and taking care of yourself and others.', 'Think about cleaning up after yourself.', 1, 2);


  -- ========================================================================
  -- UNIT 2: Compose and Create (CCK.1 – CCK.4)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Speaking, Drawing, and Emerging Writing',
    'Using oral language, pictures, symbols, and letters to share ideas, feelings, and experiences.',
    'We express our thoughts and feelings through speaking, drawing, and writing.',
    'How can we share our ideas with others?')
  RETURNING id INTO v_unit;

  -- Chapter 5 — Talking and Sharing Ideas (CCK.3)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 5, 'Talking and Sharing Ideas', 'ela-k-talking-sharing',
    'Use oral language to converse, engage in play, and share personal experiences.',
    '[
      {"type": "heading", "content": "Talking and Sharing Ideas", "level": 1},
      {"type": "text", "content": "Talking is one of the first ways we share our thoughts. When you tell a friend about your weekend, describe your favourite toy, or ask a question, you are using oral language."},
      {"type": "heading", "content": "Conversations", "level": 2},
      {"type": "text", "content": "A conversation happens when two or more people talk and listen to each other. Good conversations have rules:\n- Take turns speaking\n- Listen when someone else is talking\n- Stay on the topic\n- Use kind words"},
      {"type": "callout", "content": "A conversation is like playing catch. One person throws (talks), and the other person catches (listens). Then they switch!", "style": "tip"},
      {"type": "heading", "content": "Sharing Experiences", "level": 2},
      {"type": "text", "content": "You can share stories about things that have happened to you. Think about:\n- What happened?\n- Where did it happen?\n- Who was there?\n- How did you feel?\n\nTelling your own stories helps others learn about you."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is a conversation?", "options": ["One person talking alone", "Two or more people talking and listening to each other", "Writing a letter", "Drawing a picture"], "correct": 1, "explanation": "A conversation is when people talk and listen to each other, taking turns."},
      {"type": "quiz", "question": "What should you do when someone else is talking?", "options": ["Talk at the same time", "Listen carefully", "Walk away", "Cover your ears"], "correct": 1, "explanation": "Good listeners pay attention when someone else is speaking."}
    ]'::jsonb,
    '[{"term": "Oral language", "definition": "The words we speak out loud to share our ideas"},
      {"term": "Conversation", "definition": "When two or more people talk and listen to each other"},
      {"term": "Experience", "definition": "Something that happened to you"}]'::jsonb,
    'In Indigenous cultures, oral language is how knowledge is passed from one generation to the next. Sharing stories around a campfire or during a gathering is an ancient and respected practice.',
    12, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CCK.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is oral language?', 'The words we speak out loud to share our ideas.', 'Think about talking with your voice.', 1, 0),
    (v_tenant, v_ch, 'What is a conversation?', 'When two or more people talk and listen to each other.', 'It is like playing catch with words.', 1, 1),
    (v_tenant, v_ch, 'Name one rule of a good conversation.', 'Take turns speaking, or listen when someone else is talking.', 'Think about being polite.', 1, 2);


  -- Chapter 6 — Drawing to Communicate (CCK.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 6, 'Drawing to Communicate', 'ela-k-drawing-communicate',
    'Use pictures, symbols, and dramatizations to communicate feelings and ideas.',
    '[
      {"type": "heading", "content": "Drawing to Communicate", "level": 1},
      {"type": "text", "content": "Before you learn to write words, you can share your ideas by drawing pictures. A picture of your family, your pet, or your favourite place tells a story without using words."},
      {"type": "heading", "content": "Pictures Tell Stories", "level": 2},
      {"type": "text", "content": "When you draw a picture, think about:\n- What do I want to show?\n- Who or what should be in my picture?\n- What colours will I use?\n- Can I add details like a sun, trees, or a house?\n\nThe more details you add, the more your picture says."},
      {"type": "callout", "content": "You can use symbols too! A heart means love. A smiley face means happy. A star means something special.", "style": "info"},
      {"type": "heading", "content": "Acting It Out", "level": 2},
      {"type": "text", "content": "Another way to share ideas is through acting, or dramatization. You can pretend to be a character from a story, act out something that happened, or show how someone feels using your face and body."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Why do we draw pictures?", "options": ["Only for fun", "To share our ideas and stories", "Because we have to", "To waste paper"], "correct": 1, "explanation": "Drawing is a way to share our ideas, stories, and feelings with others."},
      {"type": "quiz", "question": "What does a heart symbol usually mean?", "options": ["Sadness", "Love", "Rain", "A number"], "correct": 1, "explanation": "A heart is a symbol that usually means love or care."}
    ]'::jsonb,
    '[{"term": "Symbol", "definition": "A picture or shape that stands for an idea, like a heart for love"},
      {"term": "Dramatization", "definition": "Acting something out using your body, face, and voice"},
      {"term": "Detail", "definition": "A small piece of information that makes a picture or story more interesting"}]'::jsonb,
    'Indigenous rock paintings and pictographs found across Saskatchewan are among the earliest forms of visual communication. These drawings recorded stories, events, and spiritual experiences on rock faces for future generations.',
    12, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CCK.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a symbol?', 'A picture or shape that stands for an idea, like a heart for love.', 'Think about shapes you see that mean something.', 1, 0),
    (v_tenant, v_ch, 'What is dramatization?', 'Acting something out using your body, face, and voice.', 'Think about pretending to be a character.', 1, 1),
    (v_tenant, v_ch, 'Why do we add details to our drawings?', 'Details make our pictures more interesting and help others understand our ideas.', 'Small things like colour and objects help tell the story.', 1, 2);


  -- Chapter 7 — Letters and Early Writing (CCK.4)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 7, 'Letters and Early Writing', 'ela-k-letters-early-writing',
    'Create messages using a combination of pictures, symbols, and letters.',
    '[
      {"type": "heading", "content": "Letters and Early Writing", "level": 1},
      {"type": "text", "content": "Letters are the building blocks of words. The alphabet has 26 letters, and each letter has a special shape and sound. When you put letters together, they make words. Words help us share our ideas."},
      {"type": "heading", "content": "The Alphabet", "level": 2},
      {"type": "text", "content": "There are uppercase letters (A, B, C) and lowercase letters (a, b, c). Both are important. Your name starts with an uppercase letter. Most other letters in a sentence are lowercase."},
      {"type": "callout", "content": "Practice writing your name every day! It is the most important word you will ever learn to write.", "style": "tip"},
      {"type": "heading", "content": "Mixing Pictures and Letters", "level": 2},
      {"type": "text", "content": "You can create messages that use both pictures and letters together. For example:\n- Draw a picture of your family and write the first letter of each person''s name\n- Draw a sun and write the letter S\n- Draw your favourite animal and try to write its name"},
      {"type": "callout", "content": "It is okay if your letters are not perfect yet. Every writer starts by practising!", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "How many letters are in the English alphabet?", "options": ["10", "20", "26", "52"], "correct": 2, "explanation": "The English alphabet has 26 letters: A through Z."},
      {"type": "quiz", "question": "Which letter should your name start with?", "options": ["A lowercase letter", "An uppercase letter", "A number", "A symbol"], "correct": 1, "explanation": "Names always start with an uppercase (capital) letter."}
    ]'::jsonb,
    '[{"term": "Letter", "definition": "A symbol from the alphabet that represents a sound"},
      {"term": "Alphabet", "definition": "The set of 26 letters used in English: A to Z"},
      {"term": "Uppercase", "definition": "The big form of a letter, like A, B, C"},
      {"term": "Lowercase", "definition": "The small form of a letter, like a, b, c"}]'::jsonb,
    'Many Indigenous languages in Saskatchewan, including Cree and Dene, have their own writing systems. Cree syllabics use special symbols where each symbol represents a whole syllable, not just one sound.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CCK.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'How many letters are in the English alphabet?', '26', 'A through Z.', 1, 0),
    (v_tenant, v_ch, 'What is the difference between uppercase and lowercase?', 'Uppercase letters are big (A, B, C) and lowercase letters are small (a, b, c).', 'Names start with the big kind.', 1, 1),
    (v_tenant, v_ch, 'What is one way to create a message?', 'Use pictures and letters together.', 'Draw and write at the same time.', 1, 2);


  -- Chapter 8 — Creating and Sharing (CCK.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 8, 'Creating and Sharing', 'ela-k-creating-sharing',
    'Compose and create various texts that explore thoughts, ideas, and experiences.',
    '[
      {"type": "heading", "content": "Creating and Sharing", "level": 1},
      {"type": "text", "content": "You are a creator! Every time you draw a picture, tell a story, sing a song, or make something, you are creating a text. A text is anything that carries a message."},
      {"type": "heading", "content": "Many Ways to Create", "level": 2},
      {"type": "text", "content": "You can create texts in many ways:\n- Draw or paint a picture\n- Tell a story out loud\n- Act out a scene with friends\n- Build something with blocks or clay\n- Sing a song or make up a rhyme\n\nAll of these are ways of sharing your ideas."},
      {"type": "callout", "content": "A text is not just words on paper. A drawing, a video, a sculpture, or even a dance can be a text because they all carry a message.", "style": "info"},
      {"type": "heading", "content": "Sharing Your Creations", "level": 2},
      {"type": "text", "content": "After you create something, share it! You can:\n- Show your drawing to the class\n- Tell your story to a partner\n- Display your work on the wall\n\nSharing helps others learn about your ideas and makes you feel proud of your work."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Which of these is a text?", "options": ["Only a book", "A drawing, a song, or a story", "Only something typed on a computer", "Only a letter"], "correct": 1, "explanation": "A text is anything that carries a message. Drawings, songs, and stories are all texts."},
      {"type": "quiz", "question": "Why is sharing your creation important?", "options": ["It is not important", "It helps others learn about your ideas", "So you can get a treat", "Because the teacher said so"], "correct": 1, "explanation": "Sharing helps others understand your ideas and lets you feel proud."}
    ]'::jsonb,
    '[{"term": "Create", "definition": "To make something new, like a story, picture, or song"},
      {"term": "Text", "definition": "Anything that carries a message, including pictures, words, videos, and songs"},
      {"term": "Share", "definition": "To show or tell others about something you made or know"}]'::jsonb,
    'Creating and sharing is central to Indigenous community life. From making dreamcatchers to painting drums, Indigenous peoples create objects that carry deep meaning and share them during ceremonies and gatherings.',
    12, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CCK.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does create mean?', 'To make something new, like a story, picture, or song.', 'Think about making something from your imagination.', 1, 0),
    (v_tenant, v_ch, 'What is a text?', 'Anything that carries a message, including pictures, words, videos, and songs.', 'It is not just a book!', 1, 1),
    (v_tenant, v_ch, 'Name two ways you can create a text.', 'Draw a picture, tell a story, sing a song, or act out a scene.', 'Think about all the ways you share ideas.', 1, 2);


  -- ========================================================================
  -- UNIT 3: Assess and Reflect (ARK.1 – ARK.2)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Thinking About Our Learning',
    'Reflecting on what we have learned and talking about new experiences in listening, viewing, speaking, and creating.',
    'When we think about what we have learned, we understand ourselves better as learners.',
    'How do I know what I have learned?')
  RETURNING id INTO v_unit;

  -- Chapter 9 — Reflecting on What We Do (ARK.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 9, 'Reflecting on What We Do', 'ela-k-reflecting',
    'Reflect on viewing, listening, reading, speaking, and writing experiences in teacher-led discussions.',
    '[
      {"type": "heading", "content": "Reflecting on What We Do", "level": 1},
      {"type": "text", "content": "Reflecting means thinking carefully about something you have done. After you listen to a story, draw a picture, or talk to a friend, you can stop and think: What did I do? What did I learn?"},
      {"type": "heading", "content": "Why Do We Reflect?", "level": 2},
      {"type": "text", "content": "Reflecting helps us:\n- Remember what we learned\n- Think about what we did well\n- Figure out what we could do better next time\n- Feel proud of our efforts"},
      {"type": "callout", "content": "Your teacher will help you reflect by asking questions like: What did you enjoy? What was tricky? What would you change?", "style": "info"},
      {"type": "heading", "content": "Talking About Learning", "level": 2},
      {"type": "text", "content": "In class, you will talk about your learning with your teacher and classmates. This is called a discussion. During a discussion, everyone shares their thoughts and listens to others."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What does reflecting mean?", "options": ["Forgetting everything", "Thinking carefully about something you did", "Playing outside", "Drawing a picture"], "correct": 1, "explanation": "Reflecting means thinking carefully about what you did and what you learned."},
      {"type": "quiz", "question": "Why is reflecting helpful?", "options": ["It wastes time", "It helps us remember what we learned and do better next time", "It makes us tired", "It is only for adults"], "correct": 1, "explanation": "Reflecting helps us remember, feel proud, and improve."}
    ]'::jsonb,
    '[{"term": "Reflect", "definition": "To think carefully about something you have done or learned"},
      {"term": "Discussion", "definition": "A group conversation where everyone shares ideas and listens"},
      {"term": "Improve", "definition": "To get better at something"}]'::jsonb,
    'In many Indigenous teachings, reflection is part of the learning circle. After an experience, learners sit together and share what they noticed, felt, and learned. This process is valued as a way of growing.',
    10, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'ARK.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does reflect mean?', 'To think carefully about something you have done or learned.', 'Look back at what happened and think about it.', 1, 0),
    (v_tenant, v_ch, 'What is a discussion?', 'A group conversation where everyone shares ideas and listens.', 'Everyone gets a turn to talk and listen.', 1, 1),
    (v_tenant, v_ch, 'Name one reason reflecting is helpful.', 'It helps us remember what we learned and do better next time.', 'Think about what went well and what was tricky.', 1, 2);


  -- Chapter 10 — Talking About New Learning (ARK.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 10, 'Talking About New Learning', 'ela-k-new-learning',
    'Reflect and talk about new things we have learned.',
    '[
      {"type": "heading", "content": "Talking About New Learning", "level": 1},
      {"type": "text", "content": "Every day you learn something new. Maybe you learned a new word, heard a new story, or tried something for the first time. Talking about what you learned helps the ideas stick in your mind."},
      {"type": "heading", "content": "What Did I Learn Today?", "level": 2},
      {"type": "text", "content": "At the end of a lesson or at the end of the day, ask yourself:\n- What is something new I learned?\n- What was interesting or surprising?\n- What do I want to learn more about?\n\nYou can share your answers with a partner, your teacher, or your family."},
      {"type": "callout", "content": "Try telling someone at home one thing you learned at school each day. It is a great way to remember!", "style": "tip"},
      {"type": "heading", "content": "Growing as a Learner", "level": 2},
      {"type": "text", "content": "Learning is like growing a plant. Each new thing you learn is like adding water and sunshine. The more you learn and practise, the stronger you grow as a learner."},
      {"type": "callout", "content": "It is okay not to know everything! Asking questions is one of the best ways to learn.", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What should you do after learning something new?", "options": ["Forget about it", "Talk about it with someone", "Keep it a secret", "Throw it away"], "correct": 1, "explanation": "Talking about new learning helps you remember and understand it better."},
      {"type": "quiz", "question": "Why is asking questions a good thing?", "options": ["It means you are not smart", "It helps you learn more", "It wastes time", "It bothers others"], "correct": 1, "explanation": "Asking questions shows curiosity and helps you learn more."}
    ]'::jsonb,
    '[{"term": "Learning", "definition": "Finding out or understanding something new"},
      {"term": "Curious", "definition": "Wanting to know more about something"},
      {"term": "Question", "definition": "Something you ask because you want to find out the answer"}]'::jsonb,
    'In Indigenous ways of knowing, learning is a lifelong journey. The Medicine Wheel teaches that learning involves the mind, body, heart, and spirit, and that every experience offers something new to discover.',
    10, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'ARK.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Why should you talk about new learning?', 'Talking about what you learned helps the ideas stick in your mind.', 'Saying it out loud helps you remember.', 1, 0),
    (v_tenant, v_ch, 'What does curious mean?', 'Wanting to know more about something.', 'Think about the feeling you get when you see something interesting.', 1, 1),
    (v_tenant, v_ch, 'What is one question you can ask yourself after a lesson?', 'What is something new I learned?', 'Think about what was different from before.', 1, 2);

END $$;


-- ============================================================================
-- GRADE 1 — WolfWhale English Language Arts 1
-- Outcomes: CR1.1-CR1.4, CC1.1-CC1.4, AR1.1-AR1.2
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
    WHERE tenant_id = v_tenant AND slug = 'wolfwhale-ela-1';

  -- ========================================================================
  -- UNIT 1: Comprehend and Respond (CR1.1 – CR1.4)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Reading, Listening, and Viewing',
    'Developing reading comprehension, listening skills, and the ability to respond to a variety of grade-level texts.',
    'Readers and listeners use strategies to understand stories and information.',
    'How do we make sense of what we read, hear, and see?')
  RETURNING id INTO v_unit;

  -- Chapter 1 — Phonics and Letter Sounds (CR1.4)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 1, 'Phonics and Letter Sounds', 'ela-1-phonics-letter-sounds',
    'Recognize letter-sound relationships and use them to read simple words.',
    '[
      {"type": "heading", "content": "Phonics and Letter Sounds", "level": 1},
      {"type": "text", "content": "Every letter in the alphabet makes a sound. When you know the sounds that letters make, you can put them together to read words. This is called phonics."},
      {"type": "heading", "content": "Consonant Sounds", "level": 2},
      {"type": "text", "content": "Consonants are all the letters that are not vowels. Most consonants make one sound:\n- B says /b/ as in ball\n- D says /d/ as in dog\n- M says /m/ as in moon\n- S says /s/ as in sun\n- T says /t/ as in top"},
      {"type": "heading", "content": "Vowel Sounds", "level": 2},
      {"type": "text", "content": "The vowels are A, E, I, O, and U. Each vowel can make a short sound or a long sound:\n- Short A as in cat\n- Long A as in cake\n- Short I as in sit\n- Long I as in kite"},
      {"type": "callout", "content": "Remember the vowels: A, E, I, O, U. Every word needs at least one vowel!", "style": "tip"},
      {"type": "heading", "content": "Blending Sounds", "level": 2},
      {"type": "text", "content": "To read a word, say each sound and then blend them together smoothly:\n- c-a-t becomes cat\n- d-o-g becomes dog\n- s-u-n becomes sun\n\nThe faster you blend, the more it sounds like a real word!"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What are the five vowels?", "options": ["A, B, C, D, E", "A, E, I, O, U", "B, D, F, G, H", "V, W, X, Y, Z"], "correct": 1, "explanation": "The five vowels are A, E, I, O, and U."},
      {"type": "quiz", "question": "If you blend the sounds /s/ /i/ /t/, what word do you get?", "options": ["Set", "Sat", "Sit", "Sot"], "correct": 2, "explanation": "The sounds /s/ /i/ /t/ blend together to make the word sit."}
    ]'::jsonb,
    '[{"term": "Phonics", "definition": "The study of how letters and sounds work together to make words"},
      {"term": "Consonant", "definition": "Any letter that is not a vowel"},
      {"term": "Vowel", "definition": "The letters A, E, I, O, and U"},
      {"term": "Blend", "definition": "To put sounds together smoothly to say a word"}]'::jsonb,
    'Many Indigenous languages have unique sounds not found in English. Learning about sounds in different languages helps us appreciate the diversity of human communication across Saskatchewan.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CR1.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is phonics?', 'The study of how letters and sounds work together to make words.', 'Think about sounding out a word.', 1, 0),
    (v_tenant, v_ch, 'What are the five vowels?', 'A, E, I, O, U', 'They are special letters every word needs.', 1, 1),
    (v_tenant, v_ch, 'What does blend mean in reading?', 'To put sounds together smoothly to say a word.', 'Say each sound, then say them faster.', 1, 2),
    (v_tenant, v_ch, 'What is a consonant?', 'Any letter that is not a vowel.', 'All the letters except A, E, I, O, U.', 1, 3);


  -- Chapter 2 — Sight Words and Simple Reading (CR1.4)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 2, 'Sight Words and Simple Reading', 'ela-1-sight-words',
    'Recognize common sight words and read simple sentences fluently.',
    '[
      {"type": "heading", "content": "Sight Words and Simple Reading", "level": 1},
      {"type": "text", "content": "Some words appear again and again in books. These are called sight words. You should learn to recognize them quickly, without sounding them out each time."},
      {"type": "heading", "content": "Common Sight Words", "level": 2},
      {"type": "text", "content": "Here are some important sight words to know:\n- the, a, an, is, it\n- I, you, we, he, she\n- and, but, or, not\n- can, will, do, go, see\n- this, that, my, your\n\nThe more sight words you know, the faster you can read!"},
      {"type": "callout", "content": "Practise reading sight words on flashcards every day. Try to read them faster each time!", "style": "tip"},
      {"type": "heading", "content": "Reading Simple Sentences", "level": 2},
      {"type": "text", "content": "A sentence is a group of words that tells a complete thought. Every sentence starts with a capital letter and ends with a period, question mark, or exclamation mark.\n\nExamples:\n- The cat is big.\n- I can see the sun.\n- Do you like dogs?"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What are sight words?", "options": ["Words you can only see", "Words that appear often and should be recognized quickly", "Very long words", "Words with no vowels"], "correct": 1, "explanation": "Sight words are common words you should recognize quickly without sounding them out."},
      {"type": "quiz", "question": "What does every sentence start with?", "options": ["A period", "A lowercase letter", "A capital letter", "A number"], "correct": 2, "explanation": "Every sentence begins with a capital (uppercase) letter."}
    ]'::jsonb,
    '[{"term": "Sight word", "definition": "A common word you learn to recognize quickly without sounding it out"},
      {"term": "Sentence", "definition": "A group of words that tells a complete thought"},
      {"term": "Capital letter", "definition": "An uppercase letter used at the start of sentences and names"},
      {"term": "Period", "definition": "A dot at the end of a sentence that shows it is finished"}]'::jsonb,
    'Indigenous languages also have frequently used words and phrases. Learning key words in Cree, such as "tansi" (hello) or "miigwech" in Saulteaux (thank you), builds bridges between languages and cultures.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CR1.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a sight word?', 'A common word you learn to recognize quickly without sounding it out.', 'Words like the, is, and, can.', 1, 0),
    (v_tenant, v_ch, 'What is a sentence?', 'A group of words that tells a complete thought.', 'It starts with a capital and ends with a period.', 1, 1),
    (v_tenant, v_ch, 'What goes at the end of a sentence?', 'A period, question mark, or exclamation mark.', 'It is a punctuation mark.', 1, 2);


  -- Chapter 3 — Listening and Retelling (CR1.3)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 3, 'Listening and Retelling', 'ela-1-listening-retelling',
    'Listen to a variety of texts and retell the sequence and key points.',
    '[
      {"type": "heading", "content": "Listening and Retelling", "level": 1},
      {"type": "text", "content": "When someone reads a story to you or gives you directions, it is important to listen carefully so you can remember and share what you heard."},
      {"type": "heading", "content": "Listening for Key Points", "level": 2},
      {"type": "text", "content": "Key points are the most important parts of what you hear. When listening to a story, the key points are:\n- Who the story is about\n- What happens (the main events)\n- How the story ends\n\nWhen listening to directions, the key points are the steps you need to follow."},
      {"type": "callout", "content": "Use the words first, next, then, and finally to put events in order when you retell.", "style": "tip"},
      {"type": "heading", "content": "Sequence", "level": 2},
      {"type": "text", "content": "Sequence means the order in which things happen. In a story, events happen in a sequence:\n- First, the character wakes up.\n- Next, the character eats breakfast.\n- Then, the character goes to school.\n- Finally, the character comes home.\n\nRetelling events in order helps your listener understand the story."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What are key points?", "options": ["Points you get in a game", "The most important parts of what you hear", "The last words in a sentence", "The title of a book"], "correct": 1, "explanation": "Key points are the most important ideas or events in what you hear."},
      {"type": "quiz", "question": "What does sequence mean?", "options": ["The title of a story", "The characters in a story", "The order in which things happen", "The colour of a book"], "correct": 2, "explanation": "Sequence is the order in which events happen: first, next, then, finally."}
    ]'::jsonb,
    '[{"term": "Key points", "definition": "The most important parts of what you hear or read"},
      {"term": "Sequence", "definition": "The order in which events happen"},
      {"term": "Directions", "definition": "Steps that tell you how to do something"}]'::jsonb,
    'Following directions and remembering sequences are skills used in traditional activities like setting a snare, building a fire, or making bannock. Elders teach these skills through careful oral instruction passed from one generation to the next.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CR1.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are key points?', 'The most important parts of what you hear or read.', 'The big ideas, not every little detail.', 1, 0),
    (v_tenant, v_ch, 'What does sequence mean?', 'The order in which events happen.', 'First, next, then, finally.', 1, 1),
    (v_tenant, v_ch, 'What words help you retell in order?', 'First, next, then, and finally.', 'These are called sequence words.', 1, 2);


  -- Chapter 4 — Viewing and Understanding (CR1.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 4, 'Viewing and Understanding', 'ela-1-viewing-understanding',
    'View and comprehend explicit messages and feelings in visual and multimedia texts.',
    '[
      {"type": "heading", "content": "Viewing and Understanding", "level": 1},
      {"type": "text", "content": "Pictures, posters, and videos share messages with us. When we look at them carefully, we can understand what they are trying to say and how they make us feel."},
      {"type": "heading", "content": "Reading Pictures", "level": 2},
      {"type": "text", "content": "Pictures in books help tell the story. A good reader looks at both the words and the pictures. The pictures can show:\n- What a character looks like\n- Where the story takes place\n- How a character is feeling\n- What is happening in the scene"},
      {"type": "callout", "content": "If you are stuck on a word, look at the picture. It might give you a clue!", "style": "tip"},
      {"type": "heading", "content": "Features of Visual Texts", "level": 2},
      {"type": "text", "content": "Visual texts have special features:\n- Colour: Bright colours can show happiness; dark colours can show sadness or fear.\n- Size: Big things in a picture are usually important.\n- Facial expressions: A smile means happy; a frown means sad or upset."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "How can pictures in a book help you?", "options": ["They cannot help", "They show what is happening and give clues about the story", "They are only for decoration", "They make the book heavier"], "correct": 1, "explanation": "Pictures help by showing characters, settings, feelings, and events."},
      {"type": "quiz", "question": "What does a character''s frown usually show?", "options": ["Happiness", "Sadness or being upset", "Excitement", "Sleepiness"], "correct": 1, "explanation": "A frown usually shows that a character is sad, angry, or upset."}
    ]'::jsonb,
    '[{"term": "Visual text", "definition": "A picture, poster, video, or other image that shares a message"},
      {"term": "Facial expression", "definition": "The look on someone''s face that shows how they feel"},
      {"term": "Feature", "definition": "A part of something that you can notice, like colour, size, or shape"}]'::jsonb,
    'Cree syllabic charts are visual texts that combine symbols with sounds. Looking at a syllabic chart, learners see patterns in how symbols change based on the vowel sound, much like reading a picture for clues.',
    12, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CR1.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a visual text?', 'A picture, poster, video, or other image that shares a message.', 'Something you look at to understand.', 1, 0),
    (v_tenant, v_ch, 'What is a facial expression?', 'The look on someone''s face that shows how they feel.', 'A smile or a frown.', 1, 1),
    (v_tenant, v_ch, 'How can pictures in a book help a reader?', 'They show what is happening and give clues about the story.', 'Look at the pictures when you are stuck.', 1, 2);


  -- ========================================================================
  -- UNIT 2: Compose and Create (CC1.1 – CC1.4)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Writing, Speaking, and Representing',
    'Creating stories, sharing experiences orally, and representing ideas through pictures and writing.',
    'Writers and speakers share their ideas clearly so others can understand.',
    'How can I share my ideas clearly through speaking and writing?')
  RETURNING id INTO v_unit;

  -- Chapter 5 — Writing Sentences (CC1.4)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 5, 'Writing Sentences', 'ela-1-writing-sentences',
    'Write and share stories and informational texts in a minimum of five sentences.',
    '[
      {"type": "heading", "content": "Writing Sentences", "level": 1},
      {"type": "text", "content": "A sentence is a group of words that tells a complete thought. Good sentences start with a capital letter and end with punctuation (a period, question mark, or exclamation mark)."},
      {"type": "heading", "content": "Parts of a Sentence", "level": 2},
      {"type": "text", "content": "Every sentence needs two things:\n- A subject: who or what the sentence is about\n- A predicate: what the subject does or is\n\nExample: The dog (subject) runs fast (predicate)."},
      {"type": "callout", "content": "Check every sentence: Does it start with a capital letter? Does it end with the right punctuation? Does it make sense?", "style": "tip"},
      {"type": "heading", "content": "Writing a Short Story", "level": 2},
      {"type": "text", "content": "You can write a short story about something that happened to you or something you made up. A short story for Grade 1 should have at least five sentences:\n\n1. Tell who and where.\n2. Tell what happened first.\n3. Tell what happened next.\n4. Tell what happened after that.\n5. Tell how it ended."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What two parts does every sentence need?", "options": ["A title and a picture", "A subject and a predicate", "A capital letter and a period only", "A question and an answer"], "correct": 1, "explanation": "Every sentence needs a subject (who or what) and a predicate (what the subject does)."},
      {"type": "quiz", "question": "How many sentences should a Grade 1 short story have?", "options": ["At least 2", "At least 5", "At least 10", "Exactly 1"], "correct": 1, "explanation": "A Grade 1 short story should have at least five sentences."}
    ]'::jsonb,
    '[{"term": "Subject", "definition": "The part of a sentence that tells who or what the sentence is about"},
      {"term": "Predicate", "definition": "The part of a sentence that tells what the subject does or is"},
      {"term": "Punctuation", "definition": "Marks like periods, question marks, and exclamation marks that end sentences"}]'::jsonb,
    'Storytelling through writing connects to the rich oral storytelling traditions of Indigenous communities. When students write their own stories, they are continuing the ancient tradition of sharing experiences and passing on knowledge.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CC1.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a subject in a sentence?', 'The part that tells who or what the sentence is about.', 'It is the person, animal, or thing doing something.', 1, 0),
    (v_tenant, v_ch, 'What is a predicate?', 'The part that tells what the subject does or is.', 'It is the action part of the sentence.', 1, 1),
    (v_tenant, v_ch, 'What are three kinds of punctuation at the end of a sentence?', 'A period, a question mark, and an exclamation mark.', 'They show the sentence is done.', 1, 2);


  -- Chapter 6 — Speaking Clearly (CC1.3)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 6, 'Speaking Clearly', 'ela-1-speaking-clearly',
    'Speak clearly and audibly about ideas, experiences, and questions in logical sequence.',
    '[
      {"type": "heading", "content": "Speaking Clearly", "level": 1},
      {"type": "text", "content": "When you speak, you want others to understand you. Speaking clearly means saying your words so everyone can hear and understand them."},
      {"type": "heading", "content": "Tips for Clear Speaking", "level": 2},
      {"type": "text", "content": "To be a clear speaker:\n- Speak loudly enough for everyone to hear\n- Say each word carefully\n- Look at your audience\n- Use expression in your voice to show feelings\n- Put your ideas in a logical order"},
      {"type": "callout", "content": "Logical order means telling things in a way that makes sense, like beginning, middle, and end.", "style": "info"},
      {"type": "heading", "content": "Sharing Your Ideas", "level": 2},
      {"type": "text", "content": "You can share many kinds of ideas by speaking:\n- Tell about something that happened to you\n- Describe your favourite book, food, or place\n- Ask a question about something you wonder\n- Share your opinion about a topic"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What does it mean to speak clearly?", "options": ["To whisper very quietly", "To say words so everyone can hear and understand", "To speak in another language", "To talk as fast as possible"], "correct": 1, "explanation": "Speaking clearly means saying your words so others can hear and understand you."},
      {"type": "quiz", "question": "What does logical order mean?", "options": ["Random order", "Telling things in a way that makes sense", "Alphabetical order", "Backwards order"], "correct": 1, "explanation": "Logical order means putting ideas in an order that makes sense to the listener."}
    ]'::jsonb,
    '[{"term": "Audience", "definition": "The people who are listening to you speak"},
      {"term": "Expression", "definition": "Using your voice to show feelings like excitement, sadness, or surprise"},
      {"term": "Logical order", "definition": "Putting ideas in an order that makes sense"}]'::jsonb,
    'Public speaking and oration are highly valued in many Indigenous cultures. Leaders and Elders speak at ceremonies, treaty events, and community gatherings, where clear and respectful communication is essential.',
    12, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CC1.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does audience mean?', 'The people who are listening to you speak.', 'The people watching and hearing you.', 1, 0),
    (v_tenant, v_ch, 'What does expression mean in speaking?', 'Using your voice to show feelings like excitement, sadness, or surprise.', 'It makes your speaking more interesting.', 1, 1),
    (v_tenant, v_ch, 'Name two tips for clear speaking.', 'Speak loudly enough and say each word carefully.', 'Think about how to help your listeners understand.', 1, 2);


  -- Chapter 7 — Representing Ideas (CC1.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 7, 'Representing Ideas', 'ela-1-representing-ideas',
    'Represent key ideas and events in logical sequence through pictures, drawings, and dramatization.',
    '[
      {"type": "heading", "content": "Representing Ideas", "level": 1},
      {"type": "text", "content": "Representing means showing your ideas in a way others can understand. You can represent ideas through drawings, diagrams, posters, and even acting."},
      {"type": "heading", "content": "Drawing a Sequence of Events", "level": 2},
      {"type": "text", "content": "After reading a story or having an experience, you can draw what happened in order:\n- Draw what happened first\n- Draw what happened next\n- Draw what happened last\n\nAdd details to help someone looking at your drawings understand the story."},
      {"type": "callout", "content": "Add labels or simple words to your drawings. Even one word can help explain what is happening!", "style": "tip"},
      {"type": "heading", "content": "Acting Out Stories", "level": 2},
      {"type": "text", "content": "You can also represent a story by acting it out. Choose a character and show what they do and say. Use your face and body to show their feelings. This is called dramatization."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What does representing mean?", "options": ["Forgetting an idea", "Showing your ideas in a way others can understand", "Hiding your ideas", "Only using words"], "correct": 1, "explanation": "Representing means showing your ideas so others can understand, using pictures, drawings, or acting."},
      {"type": "quiz", "question": "What should you add to drawings to help explain them?", "options": ["Nothing", "Details and labels", "Lots of empty space", "Only your name"], "correct": 1, "explanation": "Adding details and labels helps others understand what your drawings show."}
    ]'::jsonb,
    '[{"term": "Represent", "definition": "To show ideas in a way others can see and understand"},
      {"term": "Label", "definition": "A word or short phrase that names something in a picture or diagram"},
      {"term": "Dramatization", "definition": "Acting out a story or event using your body, face, and voice"}]'::jsonb,
    'Indigenous peoples use many forms of representation to share knowledge. Winter counts on buffalo hides recorded important events through drawings, and today Indigenous artists continue to represent stories through visual and performing arts.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CC1.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does represent mean?', 'To show ideas in a way others can see and understand.', 'Drawing, acting, or making a poster.', 1, 0),
    (v_tenant, v_ch, 'What is a label?', 'A word or short phrase that names something in a picture or diagram.', 'It helps explain your drawing.', 1, 1),
    (v_tenant, v_ch, 'What is dramatization?', 'Acting out a story or event using your body, face, and voice.', 'Pretending to be a character.', 1, 2);


  -- ========================================================================
  -- UNIT 3: Assess and Reflect (AR1.1 – AR1.2)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Reflecting on Our Language Skills',
    'Identifying what good readers, writers, and speakers do, and setting goals for improvement.',
    'Knowing what we do well and what we can improve helps us grow as learners.',
    'What does a good reader, writer, and speaker do?')
  RETURNING id INTO v_unit;

  -- Chapter 8 — What Good Readers and Writers Do (AR1.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 8, 'What Good Readers and Writers Do', 'ela-1-good-readers-writers',
    'Identify, with teacher guidance, what good viewers, listeners, readers, speakers, and writers do.',
    '[
      {"type": "heading", "content": "What Good Readers and Writers Do", "level": 1},
      {"type": "text", "content": "Good readers and writers use strategies to help them learn. A strategy is a plan or method that helps you do something well."},
      {"type": "heading", "content": "What Good Readers Do", "level": 2},
      {"type": "text", "content": "Good readers:\n- Look at pictures for clues\n- Sound out words they do not know\n- Stop and think about what they read\n- Reread parts that are confusing\n- Make predictions about what will happen next"},
      {"type": "heading", "content": "What Good Writers Do", "level": 2},
      {"type": "text", "content": "Good writers:\n- Think about what they want to say before writing\n- Use capital letters and periods\n- Try to spell words carefully\n- Add details to make their writing interesting\n- Read their writing to check if it makes sense"},
      {"type": "callout", "content": "Nobody is perfect at reading and writing right away. We all get better with practice!", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is a strategy?", "options": ["A type of game", "A plan or method that helps you do something well", "A kind of book", "A spelling word"], "correct": 1, "explanation": "A strategy is a plan or method that helps you do something well."},
      {"type": "quiz", "question": "What should a good reader do when they come to a word they do not know?", "options": ["Skip the whole page", "Sound out the word and look at picture clues", "Close the book", "Ask someone else to read the whole book"], "correct": 1, "explanation": "Good readers try sounding out the word and looking at pictures for clues."}
    ]'::jsonb,
    '[{"term": "Strategy", "definition": "A plan or method that helps you do something well"},
      {"term": "Predict", "definition": "To guess what will happen next based on clues"},
      {"term": "Reread", "definition": "To read something again to understand it better"}]'::jsonb,
    'In Indigenous learning traditions, reflection is guided by mentors and Elders who help learners identify what they have done well and where they can grow. This guided reflection mirrors the teacher-supported self-assessment in this outcome.',
    12, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'AR1.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a reading strategy?', 'A plan or method that helps you read well.', 'Think about what you do when you are stuck on a word.', 1, 0),
    (v_tenant, v_ch, 'What does predict mean?', 'To guess what will happen next based on clues.', 'Use what you already know to make a guess.', 1, 1),
    (v_tenant, v_ch, 'Name one thing good writers do.', 'They think about what they want to say before writing, or they use capital letters and periods.', 'Think about the habits of a good writer.', 1, 2);


  -- Chapter 9 — Setting Goals (AR1.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 9, 'Setting Goals for Learning', 'ela-1-setting-goals',
    'Set and monitor goals for more effective reading, writing, and speaking with teacher consultation.',
    '[
      {"type": "heading", "content": "Setting Goals for Learning", "level": 1},
      {"type": "text", "content": "A goal is something you want to achieve. Setting a learning goal means deciding what you want to get better at and making a plan to practise."},
      {"type": "heading", "content": "Examples of Learning Goals", "level": 2},
      {"type": "text", "content": "Here are some goals you might set:\n- I will learn 5 new sight words this week.\n- I will write my letters more neatly.\n- I will listen without interrupting.\n- I will sound out new words before asking for help.\n- I will add more details to my drawings."},
      {"type": "callout", "content": "A good goal is specific. Instead of saying I want to be a better reader, say I will read one book every day this week.", "style": "tip"},
      {"type": "heading", "content": "Checking Your Progress", "level": 2},
      {"type": "text", "content": "After setting a goal, check in with yourself and your teacher:\n- Am I working on my goal?\n- Is it getting easier?\n- Do I need to change my plan?\n\nCelebrate when you reach your goal, and then set a new one!"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is a goal?", "options": ["Something you want to forget", "Something you want to achieve", "Something you already know", "A type of game"], "correct": 1, "explanation": "A goal is something you want to achieve or get better at."},
      {"type": "quiz", "question": "What makes a good learning goal?", "options": ["Being vague", "Being specific about what you will practise", "Having no plan", "Choosing something too easy"], "correct": 1, "explanation": "A good goal is specific: it tells exactly what you will do and when."}
    ]'::jsonb,
    '[{"term": "Goal", "definition": "Something you want to achieve or get better at"},
      {"term": "Specific", "definition": "Clear and exact, not vague"},
      {"term": "Progress", "definition": "Moving forward toward reaching a goal"}]'::jsonb,
    'In many Indigenous communities, vision quests and coming-of-age ceremonies involve setting personal goals for growth. The idea of reflecting on where you are and deciding where you want to go is a shared value across cultures.',
    10, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'AR1.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a goal?', 'Something you want to achieve or get better at.', 'What do you want to accomplish?', 1, 0),
    (v_tenant, v_ch, 'What makes a goal specific?', 'It is clear and exact, not vague.', 'Instead of "read more," say "read one book a day."', 1, 1),
    (v_tenant, v_ch, 'What should you do after reaching a goal?', 'Celebrate and set a new goal!', 'Keep growing as a learner.', 1, 2);

END $$;


-- ============================================================================
-- GRADE 2 — WolfWhale English Language Arts 2
-- Outcomes: CR2.1-CR2.4, CC2.1-CC2.4, AR2.1-AR2.2
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
    WHERE tenant_id = v_tenant AND slug = 'wolfwhale-ela-2';

  -- ========================================================================
  -- UNIT 1: Comprehend and Respond (CR2.1 – CR2.4)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Reading Comprehension and Responding',
    'Reading grade-appropriate texts, listening for key ideas, viewing visual texts, and connecting to prior knowledge.',
    'Good readers connect what they read to what they already know to build deeper understanding.',
    'How do we connect new ideas to what we already know?')
  RETURNING id INTO v_unit;

  -- Chapter 1 — Connecting to What We Know (CR2.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 1, 'Connecting to What We Know', 'ela-2-connecting-prior-knowledge',
    'Comprehend and respond to grade-level texts by connecting to prior knowledge.',
    '[
      {"type": "heading", "content": "Connecting to What We Know", "level": 1},
      {"type": "text", "content": "When you read or listen to a story, you bring your own experiences and knowledge with you. Connecting what you already know to what you are reading helps you understand the text better."},
      {"type": "heading", "content": "Three Types of Connections", "level": 2},
      {"type": "text", "content": "Readers make three kinds of connections:\n- Text to Self: This reminds me of something in my own life.\n- Text to Text: This reminds me of another story I read.\n- Text to World: This reminds me of something happening in the world around me."},
      {"type": "callout", "content": "When you read, stop and think: Does this remind me of anything? That is a connection!", "style": "tip"},
      {"type": "heading", "content": "Why Connections Matter", "level": 2},
      {"type": "text", "content": "Making connections helps you:\n- Understand the characters'' feelings\n- Predict what might happen next\n- Remember what you read\n- Think more deeply about the story"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is a text-to-self connection?", "options": ["Connecting a story to another story", "Connecting a story to your own life", "Connecting a story to the news", "Connecting two words together"], "correct": 1, "explanation": "A text-to-self connection is when a story reminds you of something in your own life."},
      {"type": "quiz", "question": "Why are connections helpful when reading?", "options": ["They make reading take longer", "They help you understand and remember the story better", "They are not helpful", "They replace reading"], "correct": 1, "explanation": "Making connections helps you understand characters, predict events, and remember the story."}
    ]'::jsonb,
    '[{"term": "Connection", "definition": "A link between what you are reading and something you already know"},
      {"term": "Prior knowledge", "definition": "What you already know from your own experiences and learning"},
      {"term": "Text-to-self", "definition": "A connection between a story and your own life"},
      {"term": "Text-to-text", "definition": "A connection between one story and another story you have read"}]'::jsonb,
    'Indigenous ways of knowing emphasize that all learning is connected. The Medicine Wheel teaches interconnection between all things. When students connect prior knowledge to new learning, they practise this same principle of interconnection.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CR2.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a text-to-self connection?', 'When a story reminds you of something in your own life.', 'Think: this is like something that happened to me.', 1, 0),
    (v_tenant, v_ch, 'What is prior knowledge?', 'What you already know from your own experiences and learning.', 'What you bring to the reading.', 1, 1),
    (v_tenant, v_ch, 'Name the three types of connections.', 'Text-to-self, text-to-text, and text-to-world.', 'Self, another story, and the world around you.', 1, 2);


  -- Chapter 2 — Reading and Retelling Key Events (CR2.4)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 2, 'Reading and Retelling Key Events', 'ela-2-reading-retelling',
    'Read and demonstrate comprehension of grade-appropriate texts by retelling key events in sequence.',
    '[
      {"type": "heading", "content": "Reading and Retelling Key Events", "level": 1},
      {"type": "text", "content": "After reading a story, you should be able to retell the important events in the order they happened. This shows that you understood the story."},
      {"type": "heading", "content": "Finding Key Events", "level": 2},
      {"type": "text", "content": "Not every detail is a key event. Key events are the big, important things that happen in the story. Ask yourself:\n- What started the story?\n- What was the problem?\n- What happened because of the problem?\n- How was it solved?"},
      {"type": "callout", "content": "A story map can help you organize key events. Draw boxes for beginning, middle, and end, and write what happened in each.", "style": "tip"},
      {"type": "heading", "content": "Fiction vs. Non-Fiction", "level": 2},
      {"type": "text", "content": "Fiction stories are made up from imagination. They have characters, settings, and a plot. Non-fiction texts give real information about the world. Both can be retold by sharing the key ideas in order."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What are key events in a story?", "options": ["Every single detail", "The big, important things that happen", "Only the last sentence", "The title and author"], "correct": 1, "explanation": "Key events are the most important things that happen in the story."},
      {"type": "quiz", "question": "What is the difference between fiction and non-fiction?", "options": ["Fiction is real, non-fiction is made up", "Fiction is made up, non-fiction gives real information", "They are the same", "Fiction has pictures, non-fiction does not"], "correct": 1, "explanation": "Fiction is imagined or made up, while non-fiction gives real, true information."}
    ]'::jsonb,
    '[{"term": "Key events", "definition": "The most important things that happen in a story"},
      {"term": "Fiction", "definition": "A story that is made up from imagination"},
      {"term": "Non-fiction", "definition": "A text that gives real, true information"},
      {"term": "Plot", "definition": "The sequence of events that make up a story"}]'::jsonb,
    'Both fiction and non-fiction exist in Indigenous oral traditions. Legends and teaching stories (fiction) sit alongside historical accounts and ecological knowledge (non-fiction), all passed down through oral retelling.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CR2.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are key events?', 'The most important things that happen in a story.', 'The big moments, not every detail.', 1, 0),
    (v_tenant, v_ch, 'What is fiction?', 'A story that is made up from imagination.', 'It comes from the author''s mind.', 1, 1),
    (v_tenant, v_ch, 'What is non-fiction?', 'A text that gives real, true information.', 'It is about facts and the real world.', 1, 2);


  -- Chapter 3 — Listening for Ideas (CR2.3)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 3, 'Listening for Ideas', 'ela-2-listening-ideas',
    'Listen and retell key literal and inferential ideas and follow oral directions.',
    '[
      {"type": "heading", "content": "Listening for Ideas", "level": 1},
      {"type": "text", "content": "Good listeners do more than just hear words. They think about what the words mean and try to understand the ideas behind them."},
      {"type": "heading", "content": "Literal and Inferential Ideas", "level": 2},
      {"type": "text", "content": "Some ideas are stated right out loud. These are literal ideas — you hear them directly.\n\nOther ideas are not said out loud. You have to figure them out from clues. These are inferential ideas.\n\nExample: If a speaker says the character put on boots and grabbed an umbrella, you can infer it is raining, even if they did not say it."},
      {"type": "callout", "content": "To infer means to figure out something that is not directly said, using clues.", "style": "info"},
      {"type": "heading", "content": "Following Directions", "level": 2},
      {"type": "text", "content": "Listening is also important for following directions. When your teacher gives steps to follow:\n- Listen to all the steps first\n- Picture each step in your mind\n- Ask questions if you are unsure\n- Do the steps in order"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is a literal idea?", "options": ["An idea you have to guess", "An idea that is stated directly", "An idea that is hidden", "An idea from a different story"], "correct": 1, "explanation": "A literal idea is one that is stated directly — you hear or read it clearly."},
      {"type": "quiz", "question": "What does infer mean?", "options": ["To guess randomly", "To figure out something not directly said, using clues", "To forget something", "To read very fast"], "correct": 1, "explanation": "To infer means to use clues to figure out something that was not stated directly."}
    ]'::jsonb,
    '[{"term": "Literal", "definition": "Stated directly and clearly"},
      {"term": "Inferential", "definition": "Not directly stated; figured out from clues"},
      {"term": "Infer", "definition": "To figure out something using clues, even when it is not said directly"}]'::jsonb,
    'Inferring meaning from context is a skill highly developed in Indigenous storytelling. Traditional stories often carry layers of meaning, and listeners are expected to think beyond the surface to find deeper teachings.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CR2.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a literal idea?', 'An idea that is stated directly and clearly.', 'You hear it or read it word for word.', 1, 0),
    (v_tenant, v_ch, 'What does infer mean?', 'To figure out something using clues, even when it is not said directly.', 'You are a detective using clues.', 1, 1),
    (v_tenant, v_ch, 'What is the first step for following directions?', 'Listen to all the steps first.', 'Hear everything before you start doing.', 1, 2);


  -- Chapter 4 — Viewing Visual Texts (CR2.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 4, 'Viewing Visual Texts', 'ela-2-viewing-visual',
    'View and explain key literal and inferential ideas in visual and multimedia texts.',
    '[
      {"type": "heading", "content": "Viewing Visual Texts", "level": 1},
      {"type": "text", "content": "Visual texts include photographs, illustrations, posters, diagrams, and videos. Good viewers look carefully at visual texts to find both the obvious messages and the hidden ones."},
      {"type": "heading", "content": "Obvious and Hidden Messages", "level": 2},
      {"type": "text", "content": "The obvious message is what you can see right away. If a poster shows a child brushing their teeth, the obvious message is about brushing teeth.\n\nThe hidden message might be that taking care of your health is important. You have to think deeper to find it."},
      {"type": "callout", "content": "Ask yourself: What do I see? What does this make me think? What feeling does it give me?", "style": "tip"},
      {"type": "heading", "content": "Features of Visual Texts", "level": 2},
      {"type": "text", "content": "Visual texts use features like:\n- Colour to create a mood (bright = cheerful, dark = serious)\n- Size to show what is important (bigger = more important)\n- Facial expressions to show feelings\n- Arrows or labels to guide your eyes"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is the hidden message in a poster showing a family planting a tree?", "options": ["Trees are tall", "Taking care of nature is important", "The family is lost", "Posters are colourful"], "correct": 1, "explanation": "The hidden message is that taking care of nature is important, beyond just showing someone planting."},
      {"type": "quiz", "question": "What does it mean when something is drawn very large in a picture?", "options": ["It is far away", "It is not important", "It is important or the focus of the picture", "It is a mistake"], "correct": 2, "explanation": "In visual texts, larger objects or characters are usually the most important or the focus."}
    ]'::jsonb,
    '[{"term": "Obvious message", "definition": "A message you can see or understand right away"},
      {"term": "Hidden message", "definition": "A deeper meaning you have to think about to find"},
      {"term": "Mood", "definition": "The feeling that a picture, story, or video creates"},
      {"term": "Diagram", "definition": "A drawing that shows how something works or is organized"}]'::jsonb,
    'Metis beadwork and quillwork carry both obvious and hidden messages. The flower pattern is visually beautiful (obvious) but also represents the connection between the Metis people and the prairie landscape (hidden).',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CR2.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a hidden message?', 'A deeper meaning you have to think about to find.', 'It is not said directly — you figure it out.', 1, 0),
    (v_tenant, v_ch, 'What is mood in a visual text?', 'The feeling that the picture or video creates.', 'Is it happy, sad, scary, or calm?', 1, 1),
    (v_tenant, v_ch, 'Name one feature visual texts use.', 'Colour, size, facial expressions, or arrows and labels.', 'Think about what catches your eye.', 1, 2);


  -- ========================================================================
  -- UNIT 2: Compose and Create (CC2.1 – CC2.4)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Writing, Speaking, and Creating',
    'Writing stories, poems, and reports; speaking to an audience; and representing understanding through various forms.',
    'Clear communication means choosing the right words and organizing ideas so others can understand.',
    'How do I organize and share my ideas clearly?')
  RETURNING id INTO v_unit;

  -- Chapter 5 — Writing Paragraphs (CC2.4)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 5, 'Writing Paragraphs', 'ela-2-writing-paragraphs',
    'Write stories, poems, letters, and reports using complete sentences and paragraphs of at least six sentences.',
    '[
      {"type": "heading", "content": "Writing Paragraphs", "level": 1},
      {"type": "text", "content": "A paragraph is a group of sentences about one topic. All the sentences in a paragraph work together to share one main idea."},
      {"type": "heading", "content": "Parts of a Paragraph", "level": 2},
      {"type": "text", "content": "A paragraph has:\n- A topic sentence that tells the main idea\n- Detail sentences that give more information\n- A closing sentence that wraps up the idea\n\nIn Grade 2, aim for at least six sentences in each paragraph."},
      {"type": "callout", "content": "Indent the first word of each paragraph. This means leaving a small space before the first word to show a new paragraph is starting.", "style": "tip"},
      {"type": "heading", "content": "Types of Writing", "level": 2},
      {"type": "text", "content": "You can write many kinds of texts:\n- Stories about things that happened to you or from your imagination\n- Poems with rhyme and rhythm\n- Friendly letters to family or friends\n- Reports that share information about a topic"},
      {"type": "divider"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is a topic sentence?", "options": ["The last sentence in a paragraph", "The sentence that tells the main idea", "Any sentence about anything", "A sentence with no punctuation"], "correct": 1, "explanation": "The topic sentence tells the reader what the paragraph is about."},
      {"type": "quiz", "question": "How many sentences should a Grade 2 paragraph have?", "options": ["At least 2", "At least 4", "At least 6", "Exactly 10"], "correct": 2, "explanation": "A Grade 2 paragraph should have at least six sentences."}
    ]'::jsonb,
    '[{"term": "Paragraph", "definition": "A group of sentences about one topic or main idea"},
      {"term": "Topic sentence", "definition": "The sentence that tells the main idea of a paragraph"},
      {"term": "Detail sentence", "definition": "A sentence that gives more information about the main idea"},
      {"term": "Indent", "definition": "To leave a small space before the first word of a new paragraph"}]'::jsonb,
    'Written communication in many forms connects to Indigenous record-keeping traditions. Metis families kept journals and letters in French and Michif, preserving stories and knowledge through writing.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CC2.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a paragraph?', 'A group of sentences about one topic or main idea.', 'All the sentences are about the same thing.', 1, 0),
    (v_tenant, v_ch, 'What is a topic sentence?', 'The sentence that tells the main idea of a paragraph.', 'It is usually the first sentence.', 1, 1),
    (v_tenant, v_ch, 'What does indent mean?', 'To leave a small space before the first word of a new paragraph.', 'It shows a new paragraph is starting.', 1, 2);


  -- Chapter 6 — Speaking to an Audience (CC2.3)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 6, 'Speaking to an Audience', 'ela-2-speaking-audience',
    'Speak clearly and audibly for a familiar audience when recounting stories, giving directions, and explaining information.',
    '[
      {"type": "heading", "content": "Speaking to an Audience", "level": 1},
      {"type": "text", "content": "Sometimes you need to speak in front of a group. This could be your class, a small group, or even your family. When you speak to an audience, you are sharing your ideas so everyone can hear and understand."},
      {"type": "heading", "content": "Speaking Skills", "level": 2},
      {"type": "text", "content": "To be a good speaker:\n- Stand tall and face your audience\n- Speak loudly enough for everyone to hear\n- Use a steady pace — not too fast, not too slow\n- Make eye contact with different people\n- Use your voice to show feelings and emphasis"},
      {"type": "heading", "content": "What Can You Share?", "level": 2},
      {"type": "text", "content": "You can speak to share:\n- A story about something that happened to you\n- Directions for how to do something\n- Information about a topic you have learned about\n- Your opinion about a book or topic"},
      {"type": "callout", "content": "Practise in front of a mirror or a family member before speaking in front of your class.", "style": "tip"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What does pace mean in speaking?", "options": ["How far you walk", "How fast or slow you talk", "How quietly you whisper", "The topic you choose"], "correct": 1, "explanation": "Pace is how fast or slow you speak. A steady pace helps your audience understand."},
      {"type": "quiz", "question": "What should you do when speaking to an audience?", "options": ["Look at the floor", "Stand tall and face the audience", "Speak very quietly", "Turn your back to the group"], "correct": 1, "explanation": "Good speakers stand tall, face the audience, and speak clearly."}
    ]'::jsonb,
    '[{"term": "Pace", "definition": "How fast or slow you speak"},
      {"term": "Eye contact", "definition": "Looking at the people you are speaking to"},
      {"term": "Emphasis", "definition": "Saying a word with extra force to show it is important"}]'::jsonb,
    'Oral presentations are deeply rooted in Indigenous culture. Speeches at powwows, Treaty Days, and community gatherings require the same skills: clear voice, respectful eye contact, and appropriate pace.',
    12, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CC2.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is pace?', 'How fast or slow you speak.', 'Not too fast, not too slow.', 1, 0),
    (v_tenant, v_ch, 'What is eye contact?', 'Looking at the people you are speaking to.', 'It shows you are speaking to them, not the wall.', 1, 1),
    (v_tenant, v_ch, 'What is emphasis?', 'Saying a word with extra force to show it is important.', 'Making one word stand out.', 1, 2);


  -- Chapter 7 — Representing Understanding (CC2.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 7, 'Representing Understanding', 'ela-2-representing-understanding',
    'Use a variety of ways to represent understanding and communicate ideas clearly with essential details.',
    '[
      {"type": "heading", "content": "Representing Understanding", "level": 1},
      {"type": "text", "content": "There are many ways to show what you know and understand. You do not always have to write a paragraph. You can represent your understanding through drawings, diagrams, posters, role plays, and models."},
      {"type": "heading", "content": "Choosing How to Represent", "level": 2},
      {"type": "text", "content": "Think about what you want to share and choose the best way:\n- A poster is great for sharing key facts with pictures and words.\n- A drawing or diagram can show how something works.\n- A role play or skit can show a scene from a story.\n- A timeline can show events in order."},
      {"type": "callout", "content": "Always include essential details. These are the most important pieces of information that help someone understand your message.", "style": "info"},
      {"type": "heading", "content": "Adding Details", "level": 2},
      {"type": "text", "content": "Essential details answer important questions:\n- Who?\n- What?\n- Where?\n- When?\n- Why?\n\nWithout these details, your audience might not understand your message."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What does it mean to represent understanding?", "options": ["To forget what you learned", "To show what you know through drawings, posters, writing, or acting", "To copy someone else''s work", "To only use spoken words"], "correct": 1, "explanation": "Representing understanding means showing what you know through various forms."},
      {"type": "quiz", "question": "What are essential details?", "options": ["Unimportant information", "The most important pieces of information", "Only names", "Only dates"], "correct": 1, "explanation": "Essential details are the most important pieces of information needed to understand the message."}
    ]'::jsonb,
    '[{"term": "Represent", "definition": "To show understanding using different forms like drawings, posters, or acting"},
      {"term": "Essential details", "definition": "The most important pieces of information needed to understand a message"},
      {"term": "Timeline", "definition": "A line showing events in the order they happened"}]'::jsonb,
    'Indigenous peoples represent knowledge in many ways: through carvings, quillwork, hide paintings, and dance. Each art form carries teachings and history that go beyond what words alone can express.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CC2.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does represent mean?', 'To show understanding using different forms like drawings, posters, or acting.', 'There are many ways to show what you know.', 1, 0),
    (v_tenant, v_ch, 'What are essential details?', 'The most important pieces of information needed to understand a message.', 'Who, what, where, when, why.', 1, 1),
    (v_tenant, v_ch, 'Name two ways to represent your understanding.', 'Posters, drawings, diagrams, role plays, models, or timelines.', 'Think beyond just writing.', 1, 2);


  -- ========================================================================
  -- UNIT 3: Assess and Reflect (AR2.1 – AR2.2)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Assessing and Improving',
    'Reflecting on literacy experiences and establishing personal learning goals.',
    'Reflecting on our strengths and challenges helps us become stronger readers, writers, and speakers.',
    'How can I improve as a reader, writer, and speaker?')
  RETURNING id INTO v_unit;

  -- Chapter 8 — Reflecting on Our Skills (AR2.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 8, 'Reflecting on Our Skills', 'ela-2-reflecting-skills',
    'Reflect on and assess viewing, listening, reading, speaking, writing, and representing experiences.',
    '[
      {"type": "heading", "content": "Reflecting on Our Skills", "level": 1},
      {"type": "text", "content": "Reflecting means looking back at what you have done and thinking about how it went. Good learners reflect on their work regularly to understand their strengths and find areas for growth."},
      {"type": "heading", "content": "What to Reflect On", "level": 2},
      {"type": "text", "content": "You can reflect on many different skills:\n- Reading: Am I understanding what I read? Am I using reading strategies?\n- Writing: Are my sentences clear? Am I using details?\n- Speaking: Am I speaking clearly and loudly enough?\n- Listening: Am I paying attention and remembering key ideas?\n- Viewing: Am I looking carefully and thinking about what I see?"},
      {"type": "callout", "content": "During class discussions, share what worked well and what was challenging. Hearing from classmates can give you new ideas.", "style": "tip"},
      {"type": "heading", "content": "Strengths and Challenges", "level": 2},
      {"type": "text", "content": "A strength is something you do well. A challenge is something you find difficult but can improve with practice. Everyone has both strengths and challenges — that is normal!"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What does reflecting mean?", "options": ["Looking in a mirror", "Thinking carefully about what you did and how it went", "Copying someone else", "Starting over completely"], "correct": 1, "explanation": "Reflecting means thinking carefully about your work to understand what went well and what to improve."},
      {"type": "quiz", "question": "What is a strength?", "options": ["Something you find very difficult", "Something you do well", "Something you have never tried", "Something only adults have"], "correct": 1, "explanation": "A strength is something you are good at or do well."}
    ]'::jsonb,
    '[{"term": "Strength", "definition": "Something you do well"},
      {"term": "Challenge", "definition": "Something you find difficult but can improve with practice"},
      {"term": "Assess", "definition": "To evaluate or judge how well something went"}]'::jsonb,
    'The concept of self-reflection is present in the talking circle, a practice in many Indigenous communities. In a talking circle, each person has a chance to speak honestly about their experiences while others listen respectfully.',
    12, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'AR2.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a strength?', 'Something you do well.', 'Think about what you are good at.', 1, 0),
    (v_tenant, v_ch, 'What is a challenge?', 'Something you find difficult but can improve with practice.', 'Everyone has them — they help us grow.', 1, 1),
    (v_tenant, v_ch, 'What does assess mean?', 'To evaluate or judge how well something went.', 'Think: how did I do?', 1, 2);


  -- Chapter 9 — Setting Personal Learning Goals (AR2.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 9, 'Setting Personal Learning Goals', 'ela-2-setting-goals',
    'Establish personal learning goals through group discussion about progress across literacy skills.',
    '[
      {"type": "heading", "content": "Setting Personal Learning Goals", "level": 1},
      {"type": "text", "content": "After reflecting on your skills, the next step is to set goals. A learning goal tells you what you want to improve and gives you a plan for getting there."},
      {"type": "heading", "content": "Making SMART Goals", "level": 2},
      {"type": "text", "content": "Good goals are:\n- Specific: What exactly will you work on?\n- Measurable: How will you know you reached it?\n- Achievable: Can you really do it?\n- Relevant: Does it matter for your learning?\n- Time-bound: When will you achieve it?"},
      {"type": "callout", "content": "Instead of saying I want to be a better writer, try I will use at least three detail words in every paragraph this week.", "style": "tip"},
      {"type": "heading", "content": "Talking About Goals", "level": 2},
      {"type": "text", "content": "Share your goals with classmates and your teacher. Talking about goals helps because:\n- Others can give you ideas\n- You feel accountable when others know your goal\n- You can encourage each other\n- Hearing others'' goals can inspire you"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What does it mean for a goal to be specific?", "options": ["It is about everything at once", "It tells exactly what you will work on", "It is a secret", "It is for a whole year"], "correct": 1, "explanation": "A specific goal tells exactly what you will work on, not just a general wish."},
      {"type": "quiz", "question": "Why should you share your goals with others?", "options": ["So they can do it for you", "Because it helps you feel accountable and get support", "You should keep goals secret", "Only teachers need to know"], "correct": 1, "explanation": "Sharing goals helps you feel accountable and lets others support and encourage you."}
    ]'::jsonb,
    '[{"term": "Specific", "definition": "Clear and exact, telling exactly what you will do"},
      {"term": "Measurable", "definition": "Able to be checked or measured to see if you reached it"},
      {"term": "Accountable", "definition": "Being responsible for following through on a promise or goal"}]'::jsonb,
    'Goal-setting is practised in many Indigenous cultures through seasonal planning and ceremonial preparation. Families and communities set goals together for hunting, harvesting, and celebrations, reflecting a collective approach to growth.',
    12, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'AR2.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does specific mean for a goal?', 'It tells exactly what you will work on.', 'Not vague — clear and exact.', 1, 0),
    (v_tenant, v_ch, 'What does measurable mean?', 'Able to be checked or measured to see if you reached it.', 'Can you count it or see it?', 1, 1),
    (v_tenant, v_ch, 'What does accountable mean?', 'Being responsible for following through on a promise or goal.', 'Others know your goal and expect you to work on it.', 1, 2);

END $$;


-- ============================================================================
-- GRADE 3 — WolfWhale English Language Arts 3
-- Outcomes: CR3.1-CR3.4, CC3.1-CC3.4, AR3.1-AR3.2
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
    WHERE tenant_id = v_tenant AND slug = 'wolfwhale-ela-3';

  -- ========================================================================
  -- UNIT 1: Comprehend and Respond (CR3.1 – CR3.4)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Reading Strategies and Comprehension',
    'Using reading strategies to comprehend fiction, non-fiction, poetry, and scripts from various cultures including First Nations and Metis.',
    'Strategic readers use tools and thinking skills to understand different types of texts.',
    'What strategies help us understand what we read?')
  RETURNING id INTO v_unit;

  -- Chapter 1 — Reading Strategies (CR3.4)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 1, 'Reading Strategies', 'ela-3-reading-strategies',
    'Read fluently and demonstrate comprehension of grade-appropriate fiction, poetry, and non-fiction from various cultures.',
    '[
      {"type": "heading", "content": "Reading Strategies", "level": 1},
      {"type": "text", "content": "Reading strategies are tools you use in your mind to help you understand what you read. Good readers do not just read the words — they think while they read."},
      {"type": "heading", "content": "Before Reading", "level": 2},
      {"type": "text", "content": "Before you start reading, prepare your mind:\n- Look at the title, cover, and pictures to predict what the text is about\n- Think about what you already know about the topic\n- Ask yourself: What do I want to learn from this text?"},
      {"type": "heading", "content": "During Reading", "level": 2},
      {"type": "text", "content": "While you read, stay active:\n- Visualize: Make pictures in your mind\n- Predict: Guess what will happen next\n- Question: Ask yourself questions about the text\n- Connect: Link the text to your own life, other texts, or the world\n- Clarify: Reread parts that are confusing"},
      {"type": "callout", "content": "If you do not understand a word, try these strategies: look at the pictures, reread the sentence, look for word parts you know, or read ahead for more clues.", "style": "tip"},
      {"type": "heading", "content": "After Reading", "level": 2},
      {"type": "text", "content": "After reading, think about what you read:\n- Summarize the main ideas\n- Share your opinion about the text\n- Make connections to your life or other texts"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What does visualize mean?", "options": ["To read faster", "To make pictures in your mind while reading", "To skip hard words", "To close the book"], "correct": 1, "explanation": "Visualizing means creating pictures in your mind to help you understand the text."},
      {"type": "quiz", "question": "What should you do before reading a new text?", "options": ["Start reading right away without looking at anything", "Look at the title and pictures and predict what it might be about", "Read the last page first", "Only read the pictures"], "correct": 1, "explanation": "Before reading, look at the title, cover, and pictures to predict and prepare your mind."}
    ]'::jsonb,
    '[{"term": "Visualize", "definition": "To create pictures in your mind while reading"},
      {"term": "Predict", "definition": "To make a thoughtful guess about what will happen next"},
      {"term": "Clarify", "definition": "To reread or think more carefully to clear up confusion"},
      {"term": "Summarize", "definition": "To tell the most important ideas in a short way"}]'::jsonb,
    'Reading texts from First Nations, Metis, and Inuit authors is an important part of Grade 3 ELA. These stories share perspectives on identity, community, and the natural world from Saskatchewan''s Indigenous peoples.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CR3.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does visualize mean?', 'To create pictures in your mind while reading.', 'Imagine the story like a movie in your head.', 1, 0),
    (v_tenant, v_ch, 'What should you do before reading?', 'Look at the title and pictures to predict what the text is about.', 'Prepare your mind for reading.', 1, 1),
    (v_tenant, v_ch, 'What does clarify mean?', 'To reread or think more carefully to clear up confusion.', 'Go back and try again when something is confusing.', 1, 2),
    (v_tenant, v_ch, 'What does summarize mean?', 'To tell the most important ideas in a short way.', 'The main points, not every detail.', 1, 3);


  -- Chapter 2 — Understanding Different Points of View (CR3.3)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 2, 'Understanding Different Points of View', 'ela-3-points-of-view',
    'Listen to and understand information, identify main ideas and supporting details, compare different ideas and points of view.',
    '[
      {"type": "heading", "content": "Understanding Different Points of View", "level": 1},
      {"type": "text", "content": "Different people can have different ideas about the same topic. A point of view is how someone sees or thinks about something. Understanding different points of view helps us learn more and think more deeply."},
      {"type": "heading", "content": "Main Ideas and Supporting Details", "level": 2},
      {"type": "text", "content": "The main idea is the most important point in a text or speech. Supporting details are pieces of information that explain or prove the main idea.\n\nExample:\n- Main idea: Recycling helps the environment.\n- Supporting details: Recycling saves trees. Recycling reduces waste in landfills. Recycling uses less energy than making new products."},
      {"type": "callout", "content": "To find the main idea, ask: What is this mostly about? Then look for details that support that idea.", "style": "tip"},
      {"type": "heading", "content": "Comparing Points of View", "level": 2},
      {"type": "text", "content": "When two people share their ideas about the same topic, you can compare them:\n- How are their ideas the same?\n- How are their ideas different?\n- Which details does each person use?\n\nBoth points of view can have value, even when they are different."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is a main idea?", "options": ["A small detail", "The most important point in a text", "The title of the book", "The name of the author"], "correct": 1, "explanation": "The main idea is the most important point or message in a text."},
      {"type": "quiz", "question": "What is a point of view?", "options": ["A place where you stand", "How someone sees or thinks about something", "A type of sentence", "The ending of a story"], "correct": 1, "explanation": "A point of view is how someone sees, understands, or thinks about a topic."}
    ]'::jsonb,
    '[{"term": "Main idea", "definition": "The most important point or message in a text"},
      {"term": "Supporting details", "definition": "Pieces of information that explain or prove the main idea"},
      {"term": "Point of view", "definition": "How someone sees, understands, or thinks about something"},
      {"term": "Compare", "definition": "To look at two things to find how they are alike and different"}]'::jsonb,
    'Understanding different points of view is central to Treaty education. Treaties involved two groups with different perspectives — Indigenous peoples and settlers — coming together. Learning to understand and respect different viewpoints supports reconciliation.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CR3.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the main idea?', 'The most important point or message in a text.', 'What is this mostly about?', 1, 0),
    (v_tenant, v_ch, 'What are supporting details?', 'Pieces of information that explain or prove the main idea.', 'They back up the big point.', 1, 1),
    (v_tenant, v_ch, 'What is a point of view?', 'How someone sees or thinks about something.', 'Different people can think differently about the same thing.', 1, 2);


  -- Chapter 3 — Responding to Visual Texts (CR3.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 3, 'Responding to Visual Texts', 'ela-3-responding-visual',
    'View and respond to visual and multimedia texts explaining reactions, connections, and visual features that convey humour, emotion, and mood.',
    '[
      {"type": "heading", "content": "Responding to Visual Texts", "level": 1},
      {"type": "text", "content": "Visual texts like posters, advertisements, book covers, and videos use images, colours, and design to share messages. When you respond to visual texts, you explain what you see, how it makes you feel, and what you think the creator intended."},
      {"type": "heading", "content": "Humour, Emotion, and Mood", "level": 2},
      {"type": "text", "content": "Visual texts can create different feelings:\n- Humour makes you laugh or smile. Funny faces, exaggeration, and silly situations create humour.\n- Emotion is a feeling like joy, sadness, fear, or anger. Close-up faces and dramatic scenes create emotion.\n- Mood is the overall feeling of the whole piece. Dark colours create a serious mood. Bright colours create a cheerful mood."},
      {"type": "callout", "content": "When looking at a visual text, ask: How does this make me feel? Why does it make me feel that way?", "style": "tip"},
      {"type": "heading", "content": "Visual Features", "level": 2},
      {"type": "text", "content": "Creators use visual features on purpose:\n- Bold text draws attention to important words\n- Arrows show direction or sequence\n- Borders separate different parts of a page\n- White space gives the eye a rest and makes things easier to read"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What creates humour in a visual text?", "options": ["Dark colours", "Funny faces, exaggeration, or silly situations", "Small text", "A lot of white space"], "correct": 1, "explanation": "Humour is created through funny faces, exaggeration, and silly or unexpected situations."},
      {"type": "quiz", "question": "What is white space?", "options": ["Space with white paint", "Empty space on a page that gives the eye a rest", "A mistake", "The back of a poster"], "correct": 1, "explanation": "White space is empty space on a page that helps things look clean and easy to read."}
    ]'::jsonb,
    '[{"term": "Humour", "definition": "Something that is funny and makes people laugh or smile"},
      {"term": "Emotion", "definition": "A strong feeling like joy, sadness, fear, or anger"},
      {"term": "Mood", "definition": "The overall feeling created by a visual text"},
      {"term": "White space", "definition": "Empty space on a page that gives the eye a rest"}]'::jsonb,
    'Indigenous visual art uses mood and emotion intentionally. A Dene drum painting might use bold colours and powerful animal images to convey strength and spiritual connection, while soft earth tones in Metis finger weaving create a calm, grounded mood.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CR3.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is mood in a visual text?', 'The overall feeling the visual text creates.', 'Is the piece cheerful, serious, scary, or calm?', 1, 0),
    (v_tenant, v_ch, 'What is humour?', 'Something that is funny and makes people laugh or smile.', 'Think about what makes you giggle.', 1, 1),
    (v_tenant, v_ch, 'What is white space?', 'Empty space on a page that makes things easier to read.', 'Not every part of a page needs to be filled.', 1, 2);


  -- ========================================================================
  -- UNIT 2: Compose and Create (CC3.1 – CC3.4)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Writing Genres and Presentations',
    'Writing narrative and informational texts, speaking for different audiences, and creating clear representations.',
    'Effective communicators choose the right form and style for their purpose and audience.',
    'How do I choose the best way to share my ideas?')
  RETURNING id INTO v_unit;

  -- Chapter 4 — Writing to Communicate (CC3.4)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 4, 'Writing to Communicate', 'ela-3-writing-communicate',
    'Write to communicate ideas, information, and experiences with clear purpose, correct paragraph structure, and interesting detail.',
    '[
      {"type": "heading", "content": "Writing to Communicate", "level": 1},
      {"type": "text", "content": "Good writing has a clear purpose. Before you write, ask yourself: Why am I writing? Am I telling a story, explaining something, or sharing my opinion? Your purpose guides how you organize and write your text."},
      {"type": "heading", "content": "Narrative Writing", "level": 2},
      {"type": "text", "content": "A narrative tells a story. It has:\n- Characters: the people or animals in the story\n- Setting: where and when the story takes place\n- Problem: something that needs to be solved\n- Solution: how the problem gets resolved\n\nUse interesting details to bring your narrative to life. Instead of saying she was scared, write she felt her heart pound and her hands shake."},
      {"type": "heading", "content": "Informational Writing", "level": 2},
      {"type": "text", "content": "Informational writing explains or informs. It has:\n- A topic sentence that states the main idea\n- Facts and details that support the topic\n- An organized structure with a beginning, middle, and end\n- A closing sentence that wraps up the ideas"},
      {"type": "callout", "content": "Use transition words like first, next, then, also, finally, and in conclusion to connect your ideas smoothly.", "style": "tip"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What does narrative writing do?", "options": ["Lists facts about a topic", "Tells a story with characters and a plot", "Gives an opinion", "Writes a recipe"], "correct": 1, "explanation": "Narrative writing tells a story with characters, a setting, a problem, and a solution."},
      {"type": "quiz", "question": "What are transition words?", "options": ["Difficult vocabulary words", "Words that connect ideas smoothly, like first, next, and finally", "The last words in a paragraph", "Words you should never use"], "correct": 1, "explanation": "Transition words connect ideas and help the reader follow the order of your writing."}
    ]'::jsonb,
    '[{"term": "Narrative", "definition": "A text that tells a story with characters, setting, and plot"},
      {"term": "Informational", "definition": "A text that explains or shares facts about a topic"},
      {"term": "Purpose", "definition": "The reason you are writing"},
      {"term": "Transition words", "definition": "Words that connect ideas and help the reader follow the order"}]'::jsonb,
    'Indigenous oral narratives follow a structure of introducing characters and setting, presenting a challenge, and resolving it through wisdom or bravery. Students can see parallels between these traditional stories and their own narrative writing.',
    18, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CC3.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is narrative writing?', 'Writing that tells a story with characters, setting, and plot.', 'Think of your favourite story.', 2, 0),
    (v_tenant, v_ch, 'What is the purpose of informational writing?', 'To explain or share facts about a topic.', 'It teaches the reader something.', 2, 1),
    (v_tenant, v_ch, 'Name three transition words.', 'First, next, then, also, finally, in conclusion.', 'Words that connect your ideas in order.', 2, 2);


  -- Chapter 5 — Speaking for Different Audiences (CC3.3)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 5, 'Speaking for Different Audiences', 'ela-3-speaking-audiences',
    'Speak to present ideas and information in informal and some formal situations for different audiences.',
    '[
      {"type": "heading", "content": "Speaking for Different Audiences", "level": 1},
      {"type": "text", "content": "You do not speak the same way to everyone. How you speak depends on who your audience is and the situation. Speaking to your friends at recess is different from presenting to your whole class."},
      {"type": "heading", "content": "Informal vs. Formal", "level": 2},
      {"type": "text", "content": "Informal speaking is casual and relaxed. You use it with friends and family.\n\nFormal speaking is more careful and polished. You use it in class presentations, when meeting new adults, or during special occasions. You use complete sentences and clear vocabulary."},
      {"type": "callout", "content": "Match your speaking style to the situation. Ask yourself: Who is listening? Is this a casual or formal setting?", "style": "info"},
      {"type": "heading", "content": "Preparing a Presentation", "level": 2},
      {"type": "text", "content": "For a formal presentation:\n- Plan what you want to say\n- Organize your ideas with a beginning, middle, and end\n- Practise out loud at least twice\n- Use visual aids like posters or pictures if helpful\n- Speak clearly, make eye contact, and use an appropriate pace"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "When would you use formal speaking?", "options": ["Playing at recess", "Talking to your pet", "Giving a class presentation", "Chatting with a sibling"], "correct": 2, "explanation": "Formal speaking is used in class presentations, meetings, and special occasions."},
      {"type": "quiz", "question": "What is one way to prepare for a presentation?", "options": ["Do not think about it beforehand", "Plan and organize your ideas, then practise", "Memorize the dictionary", "Only practise once very quickly"], "correct": 1, "explanation": "Planning, organizing, and practising are all key to a strong presentation."}
    ]'::jsonb,
    '[{"term": "Informal", "definition": "Casual and relaxed, used with friends and family"},
      {"term": "Formal", "definition": "More careful and polished, used in presentations and special situations"},
      {"term": "Visual aid", "definition": "Something you show your audience to help explain your ideas"}]'::jsonb,
    'Indigenous Elders adjust their communication style depending on the situation. A teaching story told to children is different in tone from a speech at a formal Treaty gathering, demonstrating the importance of audience awareness.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CC3.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is informal speaking?', 'Casual and relaxed speaking used with friends and family.', 'How you talk on the playground.', 2, 0),
    (v_tenant, v_ch, 'What is formal speaking?', 'Careful and polished speaking for presentations and special situations.', 'How you speak during a class report.', 2, 1),
    (v_tenant, v_ch, 'What is a visual aid?', 'Something you show your audience to help explain your ideas.', 'A poster, picture, or chart.', 2, 2);


  -- Chapter 6 — Creating Clear Representations (CC3.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 6, 'Creating Clear Representations', 'ela-3-clear-representations',
    'Communicate ideas and information by creating easy-to-follow representations with a clear purpose.',
    '[
      {"type": "heading", "content": "Creating Clear Representations", "level": 1},
      {"type": "text", "content": "A representation is any way you show your ideas to others. It could be a poster, a diagram, a model, a chart, or a skit. The key is that your representation is clear and easy to follow."},
      {"type": "heading", "content": "Elements of a Good Representation", "level": 2},
      {"type": "text", "content": "A good representation has:\n- A clear title or heading\n- Organized information (not jumbled or messy)\n- Labels, captions, or explanations\n- Neat and readable content\n- A clear purpose: what it is meant to teach or show"},
      {"type": "callout", "content": "Think about your audience. Will they understand your representation without you there to explain it? If not, add more labels or details.", "style": "tip"},
      {"type": "heading", "content": "Choosing the Right Type", "level": 2},
      {"type": "text", "content": "Choose the right type for your purpose:\n- A poster shares key facts with pictures and words\n- A diagram shows how something works or is put together\n- A chart or table organizes data in rows and columns\n- A skit or role play shows events or conversations\n- A diorama is a small 3-D scene in a box"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What makes a representation easy to follow?", "options": ["No labels and messy layout", "A clear title, organized information, and labels", "Using only one colour", "Making it as small as possible"], "correct": 1, "explanation": "Good representations have clear titles, organized information, and helpful labels."},
      {"type": "quiz", "question": "What is a diorama?", "options": ["A type of chart", "A small 3-D scene built inside a box", "A kind of poem", "A listening activity"], "correct": 1, "explanation": "A diorama is a small three-dimensional scene, usually built inside a box."}
    ]'::jsonb,
    '[{"term": "Representation", "definition": "Any way you show your ideas, like a poster, chart, model, or skit"},
      {"term": "Caption", "definition": "A short explanation under a picture or diagram"},
      {"term": "Diorama", "definition": "A small three-dimensional scene built inside a box"}]'::jsonb,
    'Indigenous communities use many forms of representation to preserve and share knowledge. Star blankets, tipi designs, and wampum belts are all representations that communicate important ideas through visual form.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CC3.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a representation?', 'Any way you show your ideas, like a poster, chart, model, or skit.', 'It helps others see what you know.', 2, 0),
    (v_tenant, v_ch, 'What is a caption?', 'A short explanation under a picture or diagram.', 'It tells what the image shows.', 2, 1),
    (v_tenant, v_ch, 'Name three elements of a good representation.', 'A clear title, organized information, and labels.', 'Think about what makes something easy to understand.', 2, 2);


  -- ========================================================================
  -- UNIT 3: Assess and Reflect (AR3.1 – AR3.2)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Self-Assessment and Goal Setting',
    'Reflecting on strategies used in reading, writing, and speaking, and setting personal goals for improvement.',
    'Learners who reflect on their strategies and set goals grow stronger in all language skills.',
    'How do I know which strategies work best for me?')
  RETURNING id INTO v_unit;

  -- Chapter 7 — Assessing My Strategies (AR3.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 7, 'Assessing My Strategies', 'ela-3-assessing-strategies',
    'Reflect on and assess the strategies employed across viewing, listening, reading, speaking, writing, and representing.',
    '[
      {"type": "heading", "content": "Assessing My Strategies", "level": 1},
      {"type": "text", "content": "You have learned many strategies for reading, writing, speaking, and representing. Now it is important to think about which strategies work best for you and which ones you need to practise more."},
      {"type": "heading", "content": "Which Strategies Help Me?", "level": 2},
      {"type": "text", "content": "Ask yourself these questions:\n- When I read, do I use visualizing, predicting, or connecting?\n- When I write, do I plan my ideas before starting?\n- When I speak, do I organize my ideas in a logical order?\n- When I listen, do I identify main ideas and supporting details?\n\nThink about which strategies you use most and which you could use more."},
      {"type": "callout", "content": "Keep a strategy journal. After reading or writing, write down which strategies you used and whether they helped.", "style": "tip"},
      {"type": "heading", "content": "Evaluating Your Work", "level": 2},
      {"type": "text", "content": "To evaluate your own work:\n- Read your writing out loud. Does it make sense?\n- Ask a classmate to read your work. Can they understand it?\n- Compare your work to criteria your teacher provides.\n- Look for things you did well and areas for improvement."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Why should you assess your strategies?", "options": ["To show off", "To know which ones work best and which need practice", "Because the teacher says so", "It is not important"], "correct": 1, "explanation": "Assessing strategies helps you understand which work best and which need more practice."},
      {"type": "quiz", "question": "What is one way to evaluate your writing?", "options": ["Never look at it again", "Read it out loud to see if it makes sense", "Throw it away", "Only check the spelling"], "correct": 1, "explanation": "Reading your writing out loud helps you hear whether it makes sense and flows well."}
    ]'::jsonb,
    '[{"term": "Evaluate", "definition": "To carefully judge the quality of something"},
      {"term": "Criteria", "definition": "Standards or rules used to judge the quality of work"},
      {"term": "Strategy journal", "definition": "A place to write down which strategies you used and how they helped"}]'::jsonb,
    'Self-assessment in Indigenous learning traditions often takes the form of reflection after ceremony or activity. Learners are encouraged to ask: What did I notice? What did I learn? How can I carry this forward?',
    12, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'AR3.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does evaluate mean?', 'To carefully judge the quality of something.', 'Look at your work honestly.', 2, 0),
    (v_tenant, v_ch, 'What are criteria?', 'Standards or rules used to judge the quality of work.', 'What makes good work good?', 2, 1),
    (v_tenant, v_ch, 'Name one reading strategy you can assess.', 'Visualizing, predicting, connecting, or clarifying.', 'Think about what you do while reading.', 2, 2);


  -- Chapter 8 — Making a Plan to Improve (AR3.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 8, 'Making a Plan to Improve', 'ela-3-plan-improve',
    'Set personal goals and discuss a plan for achieving them across all language skills.',
    '[
      {"type": "heading", "content": "Making a Plan to Improve", "level": 1},
      {"type": "text", "content": "Once you know your strengths and areas for growth, it is time to make a plan. A plan turns your goals into action steps."},
      {"type": "heading", "content": "Steps for Making a Plan", "level": 2},
      {"type": "text", "content": "1. Choose a specific goal. (Example: I will use more descriptive words in my writing.)\n2. Decide what steps you will take. (Example: I will keep a word bank of interesting adjectives.)\n3. Set a timeline. (Example: I will do this for the next two weeks.)\n4. Check your progress along the way.\n5. Adjust your plan if needed."},
      {"type": "callout", "content": "Share your plan with your teacher and a partner. They can help you stay on track and celebrate your progress.", "style": "tip"},
      {"type": "heading", "content": "Tracking Progress", "level": 2},
      {"type": "text", "content": "Keep track of your progress:\n- Use a checklist to mark off completed steps\n- Write in a journal about how your plan is going\n- Talk with your teacher about what is working and what is not\n- Celebrate small wins along the way\n\nIf your plan is not working, change it! Good learners are flexible."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is the first step in making a plan?", "options": ["Tell everyone about your plan", "Choose a specific goal", "Buy new supplies", "Wait until next month"], "correct": 1, "explanation": "The first step is choosing a specific, clear goal to work toward."},
      {"type": "quiz", "question": "What should you do if your plan is not working?", "options": ["Give up", "Keep doing the same thing", "Adjust or change your plan", "Blame someone else"], "correct": 2, "explanation": "Good learners are flexible. If a plan is not working, adjust it and try a new approach."}
    ]'::jsonb,
    '[{"term": "Action steps", "definition": "The specific things you will do to reach your goal"},
      {"term": "Timeline", "definition": "A schedule showing when you will do each step"},
      {"term": "Flexible", "definition": "Willing to change plans when something is not working"}]'::jsonb,
    'In Indigenous communities, plans change with the seasons and with the needs of the community. Flexibility and adaptation are valued qualities. The willingness to adjust a plan shows wisdom, not weakness.',
    12, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'AR3.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are action steps?', 'The specific things you will do to reach your goal.', 'Your plan broken into pieces.', 2, 0),
    (v_tenant, v_ch, 'What is a timeline?', 'A schedule showing when you will do each step.', 'When will you work on each part?', 2, 1),
    (v_tenant, v_ch, 'What does flexible mean?', 'Willing to change plans when something is not working.', 'Adapting is a strength, not a weakness.', 2, 2);

END $$;
