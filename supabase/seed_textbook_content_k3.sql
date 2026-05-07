-- ============================================================================
-- WolfWhale Textbook Content Seed: Grades K-3
-- Saskatchewan WNCP Mathematics
--
-- Populates: textbook_units, textbook_chapters, textbook_flashcards,
--            chapter_outcome_map
--
-- Each grade is wrapped in its own DO $$ block.
-- Depends on: seed_textbooks.sql, seed_curriculum_outcomes.sql
-- ============================================================================


-- ============================================================================
-- GRADE K — WolfWhale Foundations of Math K
-- Outcomes: NK.1-NK.5, PK.1, SSK.1-SSK.3
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
    WHERE tenant_id = v_tenant AND slug = 'wolfwhale-foundations-of-math-k';

  -- ========================================================================
  -- UNIT 1: Number Sense (NK.1 – NK.5)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Number Sense',
    'Exploring numbers from 0 to 10: counting, recognizing, comparing, and partitioning quantities.',
    'Numbers represent quantities in our world and help us describe how many.',
    'How do we use numbers to describe the world around us?')
  RETURNING id INTO v_unit;

  -- Chapter 1 — Counting to 10 (NK.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 1, 'Counting to 10', 'counting-to-10',
    'Learn to count forward from 0 to 10 and backward from 10 to 0.',
    '[
      {"type": "heading", "content": "Counting to 10", "level": 1},
      {"type": "text", "content": "Numbers are everywhere! When we count, we say number names in order: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10. Each number tells us how many things there are."},
      {"type": "callout", "content": "When counting objects, touch each one as you say the number. The last number you say tells how many there are in all.", "style": "tip"},
      {"type": "heading", "content": "Counting Forward", "level": 2},
      {"type": "text", "content": "To count forward means to start at a small number and go up.\n\nStart at 0 and count up: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10.\n\nYou can also start from any number. If you start at 4, you say: 4, 5, 6, 7, 8, 9, 10."},
      {"type": "heading", "content": "Counting Backward", "level": 2},
      {"type": "text", "content": "To count backward means to start at a big number and go down.\n\nStart at 10 and count down: 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0.\n\nThink of a rocket ship counting down to blast off!"},
      {"type": "callout", "content": "The number 0 means there are none. If you have an empty basket, you have 0 apples!", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What number comes right after 7?", "options": ["6", "8", "9", "10"], "correct": 1, "explanation": "After 7 comes 8. The counting order goes 6, 7, 8, 9, 10."},
      {"type": "quiz", "question": "When counting backward, what number comes after 5?", "options": ["6", "3", "4", "7"], "correct": 2, "explanation": "When counting backward, after 5 comes 4. We go 5, 4, 3, 2, 1, 0."}
    ]'::jsonb,
    '[{"term": "Count", "definition": "To say numbers in order while matching each number to one object"},
      {"term": "Forward", "definition": "Going from a smaller number to a bigger number"},
      {"term": "Backward", "definition": "Going from a bigger number to a smaller number"},
      {"term": "Zero", "definition": "The number that means none or nothing"}]'::jsonb,
    'In many Indigenous cultures across Saskatchewan, counting is connected to storytelling and traditional games. Cree and Dene peoples use counting in hand games and songs passed down through generations.',
    12, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'NK.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does it mean to count?', 'To say numbers in order while matching each number to one object.', 'Think about touching each object as you say a number.', 1, 0),
    (v_tenant, v_ch, 'What number means none?', '0 (zero)', 'Think of an empty box — nothing is inside.', 1, 1),
    (v_tenant, v_ch, 'What number comes after 5?', '6', 'Count: 1, 2, 3, 4, 5, ...', 1, 2),
    (v_tenant, v_ch, 'Count backward from 5.', '5, 4, 3, 2, 1, 0', 'Start at 5 and go down one at a time.', 1, 3);


  -- Chapter 2 — Recognizing Quantities (NK.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 2, 'Recognizing Quantities at a Glance', 'recognizing-quantities',
    'Recognize familiar arrangements of 1 to 5 objects without counting (subitizing).',
    '[
      {"type": "heading", "content": "Recognizing Quantities at a Glance", "level": 1},
      {"type": "text", "content": "Sometimes you can tell how many things there are just by looking — without counting one by one! This is called subitizing."},
      {"type": "callout", "content": "Subitizing means seeing a small group of objects and knowing right away how many there are.", "style": "info"},
      {"type": "heading", "content": "How Does It Work?", "level": 2},
      {"type": "text", "content": "Think about a pair of shoes. You do not need to count them — you just know there are 2.\n\nThink about the dots on a die (a dice cube). When you see three dots in a row, you know it is 3 without counting."},
      {"type": "heading", "content": "Familiar Arrangements", "level": 2},
      {"type": "text", "content": "Some arrangements are easy to recognize:\n- One dot by itself = 1\n- Two dots side by side = 2\n- Three dots in a triangle or row = 3\n- Four dots in a square shape = 4\n- Five dots like the face of a die = 5"},
      {"type": "callout", "content": "Practice looking at small groups and saying the number quickly. The more you practice, the faster you get!", "style": "tip"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "You see two birds sitting on a branch. Without counting, how many are there?", "options": ["1", "2", "3", "4"], "correct": 1, "explanation": "A pair is always 2. You can see it right away!"},
      {"type": "quiz", "question": "You roll a die and see dots arranged like the corners of a square. How many dots?", "options": ["2", "3", "4", "5"], "correct": 2, "explanation": "Four dots in a square pattern is 4. You can recognize this without counting!"}
    ]'::jsonb,
    '[{"term": "Subitize", "definition": "To see how many there are without counting"},
      {"term": "Arrangement", "definition": "The way objects are placed or set out"},
      {"term": "Pair", "definition": "A group of exactly 2 things"}]'::jsonb,
    'Indigenous peoples have long used pattern recognition in daily life, such as recognizing animal tracks and reading arrangements of stars for navigation and storytelling.',
    12, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'NK.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does subitize mean?', 'To see how many there are without counting.', 'Think about looking at a group and just knowing the number.', 1, 0),
    (v_tenant, v_ch, 'How many dots are on a die face that looks like a square?', '4', 'Dots at the four corners of a square.', 1, 1),
    (v_tenant, v_ch, 'What is a pair?', 'A group of exactly 2 things.', 'Think of a pair of mittens.', 1, 2);


  -- Chapter 3 — Numerals and Quantities (NK.3)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 3, 'Numerals and Quantities', 'numerals-and-quantities',
    'Match numerals 0 to 10 with their quantities.',
    '[
      {"type": "heading", "content": "Numerals and Quantities", "level": 1},
      {"type": "text", "content": "A numeral is the symbol we write to show a number. The numeral 3 stands for three objects. The numeral 7 stands for seven objects."},
      {"type": "heading", "content": "Matching Numerals to Groups", "level": 2},
      {"type": "text", "content": "Every numeral from 0 to 10 stands for a certain amount:\n- 0 means no objects\n- 1 means one object\n- 2 means two objects\n- 3 means three objects\n- 4 means four objects\n- 5 means five objects\n- 6 means six objects\n- 7 means seven objects\n- 8 means eight objects\n- 9 means nine objects\n- 10 means ten objects"},
      {"type": "callout", "content": "The numeral is just a way to write the number. 5 apples and the numeral 5 go together!", "style": "info"},
      {"type": "heading", "content": "Writing Numerals", "level": 2},
      {"type": "text", "content": "Practice writing each numeral. Start from the top of the number and follow the path down. Use your finger to trace each number in the air before writing it on paper."},
      {"type": "callout", "content": "The number 10 uses two digits — a 1 and a 0 — put together!", "style": "tip"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "You have a group of 6 blocks. Which numeral matches this group?", "options": ["5", "6", "7", "8"], "correct": 1, "explanation": "The numeral 6 matches a group of six blocks."},
      {"type": "quiz", "question": "The numeral 0 means:", "options": ["One object", "No objects", "Ten objects", "Two objects"], "correct": 1, "explanation": "The numeral 0 means no objects — none at all."}
    ]'::jsonb,
    '[{"term": "Numeral", "definition": "A written symbol that stands for a number, like 1, 2, or 3"},
      {"term": "Quantity", "definition": "How many objects there are in a group"},
      {"term": "Digit", "definition": "A single number symbol: 0, 1, 2, 3, 4, 5, 6, 7, 8, or 9"}]'::jsonb,
    'Many Indigenous languages in Saskatchewan have unique number words. In Cree, the word for one is "peyak" and the word for two is "niso." Learning number words in different languages helps us understand how people describe quantities.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'NK.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a numeral?', 'A written symbol that stands for a number.', 'Think about the symbols you see on a number line.', 1, 0),
    (v_tenant, v_ch, 'What does the numeral 0 stand for?', 'No objects — none at all.', 'An empty plate has this many cookies.', 1, 1),
    (v_tenant, v_ch, 'How many digits are used to write the number 10?', 'Two digits: 1 and 0.', '10 is special because it is the first number that uses two digits.', 1, 2),
    (v_tenant, v_ch, 'What is the Cree word for one?', 'Peyak', 'It is the first counting word in Cree.', 1, 3);


  -- Chapter 4 — Taking Numbers Apart (NK.4)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 4, 'Taking Numbers Apart', 'taking-numbers-apart',
    'Partition whole numbers from 1 to 10 using concrete and pictorial representations.',
    '[
      {"type": "heading", "content": "Taking Numbers Apart", "level": 1},
      {"type": "text", "content": "Numbers can be broken into smaller parts. This is called partitioning. For example, the number 5 can be broken into 2 and 3, or into 4 and 1, or into 5 and 0."},
      {"type": "callout", "content": "Partitioning means splitting a number into two or more smaller parts that add up to the original number.", "style": "info"},
      {"type": "heading", "content": "Ways to Make 5", "level": 2},
      {"type": "text", "content": "Let us look at all the ways to make the number 5:\n- 5 and 0\n- 4 and 1\n- 3 and 2\n- 2 and 3\n- 1 and 4\n- 0 and 5\n\nNotice that 3 and 2 is the same total as 2 and 3. The parts can switch places!"},
      {"type": "heading", "content": "Using Counters", "level": 2},
      {"type": "text", "content": "Try this with real objects. Take 7 blocks. Put some in your left hand and the rest in your right hand. How many are in each hand? That is one way to partition 7!\n\nExample: 7 can be 4 and 3, or 6 and 1, or 5 and 2."},
      {"type": "callout", "content": "Use two-colour counters! Shake and spill them. Count the reds and the yellows. Together they make the total.", "style": "tip"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Which shows a way to partition the number 4?", "options": ["3 and 3", "2 and 2", "5 and 1", "4 and 4"], "correct": 1, "explanation": "2 and 2 makes 4. That is one way to partition 4."},
      {"type": "quiz", "question": "You have 6 berries. 4 are red and the rest are blue. How many are blue?", "options": ["1", "2", "3", "4"], "correct": 1, "explanation": "6 can be partitioned into 4 and 2. So there are 2 blue berries."}
    ]'::jsonb,
    '[{"term": "Partition", "definition": "To break a number into two or more smaller parts"},
      {"term": "Part", "definition": "One of the smaller amounts when a number is split up"},
      {"term": "Whole", "definition": "The total number before it is split into parts"}]'::jsonb,
    'Sharing and dividing items fairly is an important value in many Indigenous communities. When food is gathered, it is partitioned among families, reflecting respect and community care.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'NK.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does partition mean?', 'To break a number into two or more smaller parts.', 'Think about splitting a group of objects into two groups.', 1, 0),
    (v_tenant, v_ch, 'Name two parts that make 5.', '3 and 2 (or 4 and 1, or 5 and 0)', 'How can you split 5 blocks into two piles?', 1, 1),
    (v_tenant, v_ch, 'If you have 6 and one part is 4, what is the other part?', '2', 'Take 4 away from 6 in your mind.', 1, 2);


  -- Chapter 5 — Comparing Quantities (NK.5)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 5, 'Comparing Quantities', 'comparing-quantities',
    'Compare groups of 0 to 10 objects using one-to-one correspondence.',
    '[
      {"type": "heading", "content": "Comparing Quantities", "level": 1},
      {"type": "text", "content": "When we compare two groups of objects, we find out which group has more, which has fewer, or if they have the same amount."},
      {"type": "heading", "content": "One-to-One Correspondence", "level": 2},
      {"type": "text", "content": "To compare two groups, we can line up objects side by side. Match one object from the first group with one object from the second group. This is called one-to-one correspondence.\n\nIf one group has objects left over with no match, that group has more."},
      {"type": "callout", "content": "Line up the objects in neat rows. Then you can easily see which row is longer!", "style": "tip"},
      {"type": "heading", "content": "More, Fewer, and the Same", "level": 2},
      {"type": "text", "content": "- MORE means a group has a bigger number of objects.\n- FEWER means a group has a smaller number of objects.\n- THE SAME means both groups have an equal number of objects.\n\nExample: A group of 7 crayons has more than a group of 4 crayons. A group of 3 stickers has fewer than a group of 6 stickers."},
      {"type": "callout", "content": "The word fewer is used for things we can count. We say fewer apples, not less apples.", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Group A has 5 blocks. Group B has 3 blocks. Which group has more?", "options": ["Group A", "Group B", "They are the same"], "correct": 0, "explanation": "Group A has more because 5 is greater than 3."},
      {"type": "quiz", "question": "There are 4 cups and 4 spoons. What can we say?", "options": ["There are more cups", "There are fewer cups", "There is the same number of cups and spoons"], "correct": 2, "explanation": "Both groups have 4, so they are the same."}
    ]'::jsonb,
    '[{"term": "Compare", "definition": "To look at two groups to find out which has more, fewer, or the same amount"},
      {"term": "More", "definition": "A greater number of objects"},
      {"term": "Fewer", "definition": "A smaller number of objects"},
      {"term": "One-to-one correspondence", "definition": "Matching one object from one group with one object from another group"}]'::jsonb,
    'Matching and comparing are skills used in traditional beadwork. When creating patterns, beaders compare quantities of different coloured beads to make sure they have enough for each part of the design.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'NK.5';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does one-to-one correspondence mean?', 'Matching one object from one group with one object from another group.', 'Think about lining up shoes in pairs.', 1, 0),
    (v_tenant, v_ch, 'Which word means a smaller number: more or fewer?', 'Fewer', 'It is the opposite of more.', 1, 1),
    (v_tenant, v_ch, 'If Group A has 6 and Group B has 6, what do we say?', 'They are the same (equal).', 'Compare the two numbers — are they different?', 1, 2);


  -- ========================================================================
  -- UNIT 2: Patterns (PK.1)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Patterns',
    'Identifying, reproducing, extending, and creating repeating patterns with two or three elements.',
    'Patterns help us predict what comes next and bring order to the world around us.',
    'How can we find and create patterns?')
  RETURNING id INTO v_unit;

  -- Chapter 6 — Finding Patterns (PK.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 6, 'Finding Patterns', 'finding-patterns',
    'Identify repeating patterns with two or three elements in the world around us.',
    '[
      {"type": "heading", "content": "Finding Patterns", "level": 1},
      {"type": "text", "content": "A pattern is something that repeats over and over in the same order. Patterns are everywhere — in clothing, in nature, in music, and in art."},
      {"type": "heading", "content": "What Is a Repeating Pattern?", "level": 2},
      {"type": "text", "content": "A repeating pattern has a core that repeats. The core is the smallest part of the pattern that keeps going.\n\nExample: red, blue, red, blue, red, blue\nThe core is: red, blue\n\nExample: clap, clap, stomp, clap, clap, stomp\nThe core is: clap, clap, stomp"},
      {"type": "callout", "content": "To find the core, look for the part that repeats. Cover up groups until you find the smallest group that keeps showing up.", "style": "tip"},
      {"type": "heading", "content": "Patterns With Two Elements", "level": 2},
      {"type": "text", "content": "Two-element patterns use two different items:\n- circle, square, circle, square, circle, square\n- loud, soft, loud, soft, loud, soft\n- big, small, big, small, big, small"},
      {"type": "heading", "content": "Patterns With Three Elements", "level": 2},
      {"type": "text", "content": "Three-element patterns use three different items:\n- red, yellow, blue, red, yellow, blue\n- hop, hop, jump, hop, hop, jump\n- star, moon, sun, star, moon, sun"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What comes next? circle, triangle, circle, triangle, circle, ...", "options": ["circle", "triangle", "square", "star"], "correct": 1, "explanation": "The pattern is circle, triangle repeating. After circle comes triangle."},
      {"type": "quiz", "question": "What is the core of this pattern? A, B, C, A, B, C, A, B, C", "options": ["A, B", "A, B, C", "A, C", "B, C"], "correct": 1, "explanation": "The core is A, B, C because this is the part that keeps repeating."}
    ]'::jsonb,
    '[{"term": "Pattern", "definition": "Something that repeats over and over in the same order"},
      {"term": "Core", "definition": "The smallest part of a pattern that repeats"},
      {"term": "Repeating pattern", "definition": "A pattern where the same core happens again and again"},
      {"term": "Element", "definition": "One item or piece in a pattern"}]'::jsonb,
    'Patterns are central to Indigenous art in Saskatchewan. Beadwork, quillwork, and birchbark biting all use repeating patterns. These designs carry cultural meaning and are passed on through generations.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'PK.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a pattern?', 'Something that repeats over and over in the same order.', 'Think about stripes on a shirt.', 1, 0),
    (v_tenant, v_ch, 'What is the core of a pattern?', 'The smallest part that keeps repeating.', 'It is the building block of the pattern.', 1, 1),
    (v_tenant, v_ch, 'Give an example of a two-element pattern.', 'Red, blue, red, blue, red, blue.', 'Two different things take turns.', 1, 2),
    (v_tenant, v_ch, 'What comes next? A, B, C, A, B, C, A, ...', 'B', 'The core is A, B, C. After A comes...', 1, 3);


  -- Chapter 7 — Making and Extending Patterns (PK.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 7, 'Making and Extending Patterns', 'making-and-extending-patterns',
    'Reproduce, extend, and create repeating patterns using objects, sounds, and actions.',
    '[
      {"type": "heading", "content": "Making and Extending Patterns", "level": 1},
      {"type": "text", "content": "Now that you can find patterns, you can copy them, make them longer, and create your own!"},
      {"type": "heading", "content": "Reproducing a Pattern", "level": 2},
      {"type": "text", "content": "Reproducing a pattern means copying it exactly.\n\nIf you see: red bead, blue bead, red bead, blue bead\nYou make: red bead, blue bead, red bead, blue bead\n\nYou copied the same core in the same order."},
      {"type": "heading", "content": "Extending a Pattern", "level": 2},
      {"type": "text", "content": "Extending a pattern means making it longer by adding more of the core.\n\nIf the pattern is: clap, snap, clap, snap\nYou extend it to: clap, snap, clap, snap, clap, snap\n\nYou kept the core going!"},
      {"type": "callout", "content": "To extend a pattern, figure out the core first. Then keep repeating the core to make the pattern longer.", "style": "tip"},
      {"type": "heading", "content": "Creating Your Own Patterns", "level": 2},
      {"type": "text", "content": "You can make your own patterns using anything:\n- Blocks of different colours\n- Sounds like clapping and tapping\n- Actions like jumping and sitting\n- Drawings of shapes\n\nChoose 2 or 3 things and repeat them in the same order at least 3 times."},
      {"type": "callout", "content": "A good pattern repeats the core at least 3 times so others can see what is repeating.", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "You want to extend this pattern: star, heart, star, heart. What do you add next?", "options": ["heart, star", "star, heart", "star, star", "heart, heart"], "correct": 1, "explanation": "The core is star, heart. To extend it, add star, heart again."},
      {"type": "quiz", "question": "Which is a repeating pattern?", "options": ["red, blue, green, yellow, purple", "big, big, big, big, big", "snap, clap, snap, clap, snap, clap", "circle, square, triangle, star, diamond"], "correct": 2, "explanation": "Snap, clap repeats over and over. The others do not have a repeating core."}
    ]'::jsonb,
    '[{"term": "Reproduce", "definition": "To copy a pattern exactly"},
      {"term": "Extend", "definition": "To make a pattern longer by adding more of the core"},
      {"term": "Create", "definition": "To make something new, like your own pattern"}]'::jsonb,
    'Creating and extending patterns is a daily practice in Indigenous arts. In making a star blanket, an artist reproduces and extends the same pattern of colours outward from the centre, representing the morning star.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'PK.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does reproduce a pattern mean?', 'To copy a pattern exactly.', 'You make the same pattern again.', 1, 0),
    (v_tenant, v_ch, 'What does extend a pattern mean?', 'To make a pattern longer by repeating the core.', 'Keep the core going!', 1, 1),
    (v_tenant, v_ch, 'How many times should a core repeat to clearly show a pattern?', 'At least 3 times.', 'Once or twice might be a coincidence.', 1, 2);


  -- ========================================================================
  -- UNIT 3: Shape and Space (SSK.1 – SSK.3)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Shape and Space',
    'Comparing objects by attributes, sorting 3-D objects, and building shapes.',
    'Objects have attributes like size, shape, and weight that we can compare and describe.',
    'How can we describe and sort the objects around us?')
  RETURNING id INTO v_unit;

  -- Chapter 8 — Comparing Objects (SSK.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 8, 'Comparing Objects', 'comparing-objects',
    'Use direct comparison to compare two objects by length, mass, volume, or capacity.',
    '[
      {"type": "heading", "content": "Comparing Objects", "level": 1},
      {"type": "text", "content": "We can compare objects by looking at one thing about them, like how long, how heavy, or how much they hold. This one thing is called an attribute."},
      {"type": "heading", "content": "Comparing Length", "level": 2},
      {"type": "text", "content": "Length is how long something is. To compare the length of two objects, line them up at one end.\n\nThe object that sticks out farther is longer. The other one is shorter.\n\nExample: A pencil and a crayon — line them up at the bottom. The pencil sticks out more, so it is longer."},
      {"type": "heading", "content": "Comparing Mass", "level": 2},
      {"type": "text", "content": "Mass is how heavy something feels. To compare mass, hold one object in each hand.\n\nThe one that feels heavier has more mass. The one that feels lighter has less mass.\n\nExample: A book and a feather — the book feels heavier."},
      {"type": "heading", "content": "Comparing Capacity", "level": 2},
      {"type": "text", "content": "Capacity is how much a container can hold. To compare capacity, fill one container and pour it into another.\n\nIf it overflows, the first container holds more. If there is room left, the first container holds less."},
      {"type": "callout", "content": "Always compare one attribute at a time. Do not mix up length and mass!", "style": "tip"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "You line up a marker and a paperclip at one end. The marker sticks out farther. What can you say?", "options": ["The marker is shorter", "The marker is longer", "They are the same length", "The paperclip is heavier"], "correct": 1, "explanation": "The marker sticks out farther, so it is longer."},
      {"type": "quiz", "question": "You hold a rock in one hand and a cotton ball in the other. The rock feels much heavier. What attribute are you comparing?", "options": ["Length", "Capacity", "Mass", "Colour"], "correct": 2, "explanation": "How heavy something feels is its mass."}
    ]'::jsonb,
    '[{"term": "Attribute", "definition": "One thing about an object, like its length, mass, or capacity"},
      {"term": "Length", "definition": "How long or tall something is"},
      {"term": "Mass", "definition": "How heavy something is"},
      {"term": "Capacity", "definition": "How much a container can hold"}]'::jsonb,
    'Indigenous peoples used direct comparison for measurement long before rulers existed. For example, lengths were compared to hand spans, arm lengths, or paces when building shelters and canoes.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SSK.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is an attribute?', 'One thing about an object, like its length, mass, or capacity.', 'It is a feature you can compare.', 1, 0),
    (v_tenant, v_ch, 'How do you compare the length of two objects?', 'Line them up at one end and see which sticks out farther.', 'Make sure the bottoms are even.', 1, 1),
    (v_tenant, v_ch, 'What is capacity?', 'How much a container can hold.', 'Think about filling a cup with water.', 1, 2);


  -- Chapter 9 — Sorting 3-D Objects (SSK.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 9, 'Sorting 3-D Objects', 'sorting-3d-objects',
    'Sort three-dimensional objects using a single attribute such as shape, size, or ability to roll.',
    '[
      {"type": "heading", "content": "Sorting 3-D Objects", "level": 1},
      {"type": "text", "content": "3-D objects are things you can hold in your hands. They are not flat — they take up space. Balls, boxes, cans, and cones are all 3-D objects."},
      {"type": "heading", "content": "What Does Sorting Mean?", "level": 2},
      {"type": "text", "content": "Sorting means putting things into groups based on how they are alike. When you sort, you choose one attribute (one rule) and put all the objects that match together."},
      {"type": "callout", "content": "A sorting rule tells you how you are grouping objects. For example: objects that roll vs. objects that do not roll.", "style": "info"},
      {"type": "heading", "content": "Ways to Sort", "level": 2},
      {"type": "list", "items": ["By shape: all the round objects together, all the box-shaped objects together", "By size: big objects in one group, small objects in another", "By what they can do: objects that roll vs. objects that stack", "By colour: all the red objects together, all the blue objects together"], "ordered": false},
      {"type": "heading", "content": "Examples of 3-D Objects", "level": 2},
      {"type": "text", "content": "- A ball is a sphere\n- A box is a rectangular solid\n- A can is a cylinder\n- An ice cream cone shape is a cone\n\nLook around your classroom. What 3-D objects can you find?"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "You sort objects into two groups: objects that roll and objects that do not roll. Where does a ball go?", "options": ["Objects that do not roll", "Objects that roll"], "correct": 1, "explanation": "A ball can roll because it is round. It goes in the rolls group."},
      {"type": "quiz", "question": "What is a sorting rule?", "options": ["A number that tells how many", "The way you decide to group objects", "A pattern that repeats", "The name of a shape"], "correct": 1, "explanation": "A sorting rule is the way you decide to group objects — it tells what goes in each group."}
    ]'::jsonb,
    '[{"term": "3-D object", "definition": "A solid shape that takes up space and is not flat"},
      {"term": "Sort", "definition": "To put objects into groups based on one attribute"},
      {"term": "Sorting rule", "definition": "The attribute you choose to make your groups"},
      {"term": "Sphere", "definition": "A round 3-D shape like a ball"},
      {"term": "Cylinder", "definition": "A 3-D shape like a can with two flat circles on the ends"}]'::jsonb,
    'Sorting is a skill used in traditional food gathering. Indigenous peoples sort berries, roots, and herbs by type and size. For example, saskatoon berries are sorted from leaves and stems after picking.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SSK.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a 3-D object?', 'A solid shape that takes up space and is not flat.', 'You can hold it in your hands.', 1, 0),
    (v_tenant, v_ch, 'What does sorting mean?', 'Putting objects into groups based on one attribute.', 'Think about separating objects by a rule.', 1, 1),
    (v_tenant, v_ch, 'Name a 3-D object that can roll.', 'A sphere (ball) or a cylinder (can).', 'Round shapes roll!', 1, 2);


  -- Chapter 10 — Building 3-D Objects (SSK.3)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 10, 'Building 3-D Objects', 'building-3d-objects',
    'Build and describe 3-D objects using various materials.',
    '[
      {"type": "heading", "content": "Building 3-D Objects", "level": 1},
      {"type": "text", "content": "You can build 3-D objects using blocks, clay, boxes, and other materials. When you build, you learn about what makes each shape special."},
      {"type": "heading", "content": "Describing 3-D Objects", "level": 2},
      {"type": "text", "content": "When you describe a 3-D object, you can talk about:\n- Is it round or does it have flat sides?\n- Can it roll?\n- Can it stack?\n- Is it big or small?\n- How many flat surfaces does it have?"},
      {"type": "heading", "content": "Building Activities", "level": 2},
      {"type": "text", "content": "Try these activities:\n1. Use blocks to build a tower. Notice how flat sides help blocks stack.\n2. Roll clay into a ball to make a sphere.\n3. Use a cardboard box and describe its shape — it has flat sides and corners.\n4. Stack cans to see how cylinders work."},
      {"type": "callout", "content": "Some 3-D objects stack well because they have flat surfaces. Spheres do not stack because they are round all over!", "style": "tip"},
      {"type": "callout", "content": "When you describe an object, use words like round, flat, pointy, big, small, tall, and short.", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Why can you stack boxes easily?", "options": ["Because they are round", "Because they have flat sides", "Because they are small", "Because they can roll"], "correct": 1, "explanation": "Boxes have flat sides, which makes them easy to stack on top of each other."},
      {"type": "quiz", "question": "You build a 3-D object with clay. It is round all over. What shape is it?", "options": ["Cube", "Cylinder", "Sphere", "Cone"], "correct": 2, "explanation": "A sphere is round all over — like a ball."}
    ]'::jsonb,
    '[{"term": "Build", "definition": "To make or put together a 3-D shape using materials"},
      {"term": "Flat surface", "definition": "A side of a 3-D object that is smooth and not curved"},
      {"term": "Stack", "definition": "To place objects on top of each other"},
      {"term": "Cube", "definition": "A 3-D shape with 6 equal square faces, like a dice"}]'::jsonb,
    'Indigenous peoples are skilled builders. Tipis are 3-D structures made from poles (cylinders) and hides, carefully designed with an understanding of shapes, balance, and space.',
    12, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SSK.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Why can you stack cubes but not spheres?', 'Cubes have flat sides. Spheres are round all over and roll away.', 'Think about what happens when you put a ball on top of a ball.', 1, 0),
    (v_tenant, v_ch, 'What is a flat surface?', 'A side of a 3-D object that is smooth and not curved.', 'The top of a table is flat.', 1, 1),
    (v_tenant, v_ch, 'What shape is a dice?', 'A cube.', 'It has 6 square faces.', 1, 2);

  RAISE NOTICE 'Grade K content seeded successfully.';
END $$;


-- ============================================================================
-- GRADE 1 — WolfWhale Foundations of Math 1
-- Outcomes: N1.1-N1.10, P1.1-P1.4, SS1.1-SS1.4
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
    WHERE tenant_id = v_tenant AND slug = 'wolfwhale-foundations-of-math-1';

  -- ========================================================================
  -- UNIT 1: Number Sense (N1.1 – N1.10)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Number Sense',
    'Understanding numbers to 100: counting sequences, subitizing to 10, representing numbers to 20, comparing, estimating, grouping, addition, and subtraction.',
    'Numbers help us count, compare, and solve problems in everyday life.',
    'How do numbers help us understand and describe quantities?')
  RETURNING id INTO v_unit;

  -- Chapter 1 — Counting Sequences (N1.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 1, 'Counting Sequences to 100', 'counting-sequences-to-100',
    'Count by 1s (forward and backward) between any two numbers to 100, by 2s to 20, and by 5s and 10s to 100.',
    '[
      {"type": "heading", "content": "Counting Sequences to 100", "level": 1},
      {"type": "text", "content": "In Grade 1, we learn to count much higher — all the way to 100! We can count by 1s, by 2s, by 5s, and by 10s."},
      {"type": "heading", "content": "Counting by 1s", "level": 2},
      {"type": "text", "content": "You already know how to count by 1s to 10. Now keep going!\n\n11, 12, 13, 14, 15, 16, 17, 18, 19, 20 ...\n\nThe pattern keeps going all the way to 100. After each group of ten, a new set of ten begins."},
      {"type": "callout", "content": "You can start counting from any number! If someone says start at 37, you say: 37, 38, 39, 40, 41, 42...", "style": "tip"},
      {"type": "heading", "content": "Counting by 2s", "level": 2},
      {"type": "text", "content": "Counting by 2s means you skip one number each time:\n2, 4, 6, 8, 10, 12, 14, 16, 18, 20\n\nThink of counting pairs of socks or shoes!"},
      {"type": "heading", "content": "Counting by 5s and 10s", "level": 2},
      {"type": "text", "content": "Counting by 5s: 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100\n\nCounting by 10s: 10, 20, 30, 40, 50, 60, 70, 80, 90, 100\n\nNotice that counting by 10s is like counting by 5s but skipping every other number!"},
      {"type": "callout", "content": "Look at a hundreds chart. Counting by 10s goes straight down in a column!", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "When counting by 2s, what comes after 14?", "options": ["15", "16", "17", "18"], "correct": 1, "explanation": "Counting by 2s: 10, 12, 14, 16. After 14 comes 16."},
      {"type": "quiz", "question": "When counting by 5s, what comes after 45?", "options": ["46", "50", "55", "40"], "correct": 1, "explanation": "Counting by 5s: 40, 45, 50. After 45 comes 50."},
      {"type": "quiz", "question": "Count backward from 20. What comes after 17?", "options": ["18", "15", "16", "19"], "correct": 2, "explanation": "Counting backward: 20, 19, 18, 17, 16. After 17 comes 16 when going backward."}
    ]'::jsonb,
    '[{"term": "Sequence", "definition": "Numbers listed in a particular order following a rule"},
      {"term": "Skip count", "definition": "Counting forward by a number other than 1, like by 2s, 5s, or 10s"},
      {"term": "Forward", "definition": "Counting from a smaller number to a bigger number"},
      {"term": "Backward", "definition": "Counting from a bigger number to a smaller number"}]'::jsonb,
    'Skip counting appears in many traditional Indigenous activities. Counting by 2s is natural when counting pairs of moccasins, while counting by 5s and 10s connects to traditional hand-counting systems used by Plains peoples.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N1.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does skip count mean?', 'Counting forward by a number other than 1, like by 2s, 5s, or 10s.', 'You skip over some numbers.', 1, 0),
    (v_tenant, v_ch, 'Count by 10s to 50.', '10, 20, 30, 40, 50', 'Add 10 each time.', 1, 1),
    (v_tenant, v_ch, 'Count by 2s from 2 to 12.', '2, 4, 6, 8, 10, 12', 'Skip one number each time.', 1, 2),
    (v_tenant, v_ch, 'What comes after 49 when counting by 1s?', '50', '49 plus 1 more.', 1, 3);


  -- Chapter 2 — Subitizing to 10 (N1.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 2, 'Subitizing to 10', 'subitizing-to-10',
    'Recognize, at a glance, familiar arrangements of 1 to 10 objects.',
    '[
      {"type": "heading", "content": "Subitizing to 10", "level": 1},
      {"type": "text", "content": "In Kindergarten, you learned to subitize groups of 1 to 5. Now we will practise recognizing groups up to 10!"},
      {"type": "heading", "content": "Seeing Groups Inside Bigger Groups", "level": 2},
      {"type": "text", "content": "For numbers bigger than 5, we can use groups we already know.\n\nFor example, to see 7 quickly:\n- See a group of 5 and a group of 2\n- 5 and 2 makes 7!\n\nTo see 8 quickly:\n- See a group of 5 and a group of 3\n- Or see two groups of 4"},
      {"type": "callout", "content": "Ten frames are great tools for subitizing! A full row of 5 plus some more helps you see the total quickly.", "style": "tip"},
      {"type": "heading", "content": "Using Ten Frames", "level": 2},
      {"type": "text", "content": "A ten frame has two rows with 5 spaces each. When you see dots in a ten frame:\n- A full top row = 5\n- Count the extra dots on the bottom row\n- Add them together\n\nA completely full ten frame = 10!"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "A ten frame shows a full top row (5 dots) and 3 dots on the bottom. How many dots altogether?", "options": ["5", "7", "8", "10"], "correct": 2, "explanation": "5 dots on top plus 3 on the bottom equals 8 dots altogether."},
      {"type": "quiz", "question": "You see a group of 4 and a group of 4. How many altogether?", "options": ["6", "7", "8", "9"], "correct": 2, "explanation": "4 and 4 makes 8 altogether."}
    ]'::jsonb,
    '[{"term": "Subitize", "definition": "To know how many objects there are by looking, without counting one by one"},
      {"term": "Ten frame", "definition": "A rectangle with 10 spaces arranged in two rows of 5, used to show numbers"},
      {"term": "Arrangement", "definition": "The way objects are placed or organized"}]'::jsonb,
    'Quick recognition of quantities has always been important for Indigenous peoples when assessing resources — knowing at a glance whether there are enough fish, berries, or materials for a task.',
    12, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N1.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a ten frame?', 'A rectangle with 10 spaces in two rows of 5, used to show numbers.', 'It looks like an egg carton cut in half.', 1, 0),
    (v_tenant, v_ch, 'A ten frame has 5 on top and 4 on the bottom. How many?', '9', '5 + 4 = ?', 1, 1),
    (v_tenant, v_ch, 'What does it mean to subitize?', 'To know how many without counting one by one.', 'You see the number right away.', 1, 2);


  -- Chapter 3 — Representing Numbers to 20 (N1.3, N1.4)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 3, 'Representing Numbers to 20', 'representing-numbers-to-20',
    'Demonstrate counting principles and represent whole numbers to 20 concretely, pictorially, and symbolically.',
    '[
      {"type": "heading", "content": "Representing Numbers to 20", "level": 1},
      {"type": "text", "content": "There are many ways to show a number. You can use objects, draw pictures, or write the numeral. Each way helps us understand the number."},
      {"type": "heading", "content": "Counting Principles", "level": 2},
      {"type": "text", "content": "When you count, remember these important ideas:\n1. The last number you say tells the total (this is called cardinality).\n2. You can start counting from where you left off instead of starting at 1 (counting on).\n3. A group of objects can be counted in different orders and the total stays the same."},
      {"type": "callout", "content": "The last number you say when counting is always the total. If you count 1, 2, 3, 4, 5, 6, 7 — there are 7 objects.", "style": "tip"},
      {"type": "heading", "content": "Three Ways to Show Numbers", "level": 2},
      {"type": "text", "content": "Concretely: Use real objects like blocks, buttons, or counters.\nPictorially: Draw pictures or dots to show the number.\nSymbolically: Write the numeral, like 14 or 20.\n\nAll three ways show the same number!"},
      {"type": "heading", "content": "Numbers 11 to 20", "level": 2},
      {"type": "text", "content": "Numbers from 11 to 20 are made of a group of ten and some more:\n- 11 = ten and 1 more\n- 12 = ten and 2 more\n- 15 = ten and 5 more\n- 20 = two groups of ten\n\nUse two ten frames to show these numbers!"},
      {"type": "callout", "content": "The number 20 fills two complete ten frames — 10 + 10 = 20.", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "You count a group of buttons and say 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12. How many buttons are there?", "options": ["10", "11", "12", "13"], "correct": 2, "explanation": "The last number you say is the total. You said 12, so there are 12 buttons."},
      {"type": "quiz", "question": "The number 15 is made of:", "options": ["Five and five", "Ten and five", "Ten and ten", "Fifteen ones only"], "correct": 1, "explanation": "15 is one group of ten and 5 more. 10 + 5 = 15."}
    ]'::jsonb,
    '[{"term": "Cardinality", "definition": "The idea that the last number you say when counting tells the total"},
      {"term": "Counting on", "definition": "Starting to count from a number other than 1"},
      {"term": "Concretely", "definition": "Showing a number using real objects you can touch"},
      {"term": "Pictorially", "definition": "Showing a number using drawings or pictures"},
      {"term": "Symbolically", "definition": "Showing a number by writing the numeral"}]'::jsonb,
    'In Cree culture, numbers are connected to storytelling and oral tradition. Elders teach children to count using natural objects like stones and sticks, showing numbers concretely before introducing written numerals.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N1.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N1.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is cardinality?', 'The idea that the last number you say when counting tells the total.', 'The final count number = the total.', 1, 0),
    (v_tenant, v_ch, 'Name three ways to show a number.', 'Concretely (objects), pictorially (pictures), and symbolically (numerals).', 'Objects, drawings, and written numbers.', 1, 1),
    (v_tenant, v_ch, 'How is the number 14 made?', '14 = one group of ten and 4 more.', '10 + 4 = 14.', 1, 2),
    (v_tenant, v_ch, 'What does counting on mean?', 'Starting to count from a number other than 1.', 'Instead of starting at 1, you start where you left off.', 1, 3);


  -- Chapter 4 — Comparing and Ordering Numbers (N1.5, N1.6, N1.8)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 4, 'Comparing and Ordering Numbers', 'comparing-and-ordering-numbers',
    'Compare sets up to 20, estimate using referents, and find numbers that are one or two more or less.',
    '[
      {"type": "heading", "content": "Comparing and Ordering Numbers", "level": 1},
      {"type": "text", "content": "Now that we know numbers to 20, we can compare them. We can say which is bigger, which is smaller, and put numbers in order."},
      {"type": "heading", "content": "Comparing Sets", "level": 2},
      {"type": "text", "content": "To compare two groups, you can:\n- Count each group and compare the numbers\n- Match objects one-to-one and see which group has leftovers\n- Use a referent (a known amount) to help estimate\n\nThe group with the bigger number has more. The group with the smaller number has fewer."},
      {"type": "heading", "content": "Estimating with Referents", "level": 2},
      {"type": "text", "content": "A referent is a group you already know. If you know what 10 looks like, you can use that to estimate other amounts.\n\nExample: You see a jar of marbles. You know 10 marbles fills about one layer. The jar looks like it has about 2 layers. Your estimate is about 20 marbles."},
      {"type": "callout", "content": "An estimate does not need to be exact. It is your best guess using what you know.", "style": "info"},
      {"type": "heading", "content": "One More, Two More, One Less, Two Less", "level": 2},
      {"type": "text", "content": "For any number up to 20:\n- One more than 8 is 9\n- Two more than 8 is 10\n- One less than 8 is 7\n- Two less than 8 is 6\n\nYou can use a number line to help you see this. Move right for more, move left for less."},
      {"type": "callout", "content": "A number line is a great tool! Point to your number, then hop forward for more or backward for less.", "style": "tip"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is two more than 13?", "options": ["11", "14", "15", "16"], "correct": 2, "explanation": "Two more than 13 is 15. Count: 13, 14, 15."},
      {"type": "quiz", "question": "What is one less than 20?", "options": ["21", "18", "19", "17"], "correct": 2, "explanation": "One less than 20 is 19."},
      {"type": "quiz", "question": "Which group has more: 12 apples or 9 apples?", "options": ["12 apples", "9 apples", "They are the same"], "correct": 0, "explanation": "12 is greater than 9, so 12 apples is more."}
    ]'::jsonb,
    '[{"term": "Compare", "definition": "To find out which number or group is bigger, smaller, or the same"},
      {"term": "Estimate", "definition": "A thoughtful guess about how many, based on what you know"},
      {"term": "Referent", "definition": "A known amount you use to help estimate other amounts"},
      {"term": "Number line", "definition": "A line with numbers on it in order, used to count and compare"}]'::jsonb,
    'Estimation is a valuable skill used by Indigenous peoples in Saskatchewan for planning hunting trips, determining how many fish are in a catch, and estimating distances for travel across the prairies.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N1.5';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N1.6';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N1.8';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is an estimate?', 'A thoughtful guess about how many, based on what you know.', 'It is not exact, but it is close.', 1, 0),
    (v_tenant, v_ch, 'What is one less than 15?', '14', 'Go back one step on a number line.', 1, 1),
    (v_tenant, v_ch, 'What is two more than 11?', '13', 'Hop forward two from 11.', 1, 2),
    (v_tenant, v_ch, 'What is a referent?', 'A known amount you use to help estimate.', 'If you know what 10 looks like, use it!', 1, 3);


  -- Chapter 5 — Grouping and Place Value (N1.7)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 5, 'Grouping and Place Value', 'grouping-and-place-value',
    'Show how numbers can be represented by equal groups with and without singles.',
    '[
      {"type": "heading", "content": "Grouping and Place Value", "level": 1},
      {"type": "text", "content": "When we have a lot of objects, it helps to put them into groups. Grouping makes big numbers easier to count and understand."},
      {"type": "heading", "content": "Making Groups", "level": 2},
      {"type": "text", "content": "You can group objects in many ways:\n- Groups of 2: pair up objects\n- Groups of 5: make piles of 5\n- Groups of 10: make piles of 10\n\nAfter making groups, count the leftover singles — the ones that do not fit into a full group."},
      {"type": "heading", "content": "Groups of 10 and Singles", "level": 2},
      {"type": "text", "content": "Grouping by 10 is very important!\n\n13 = 1 group of ten and 3 singles\n17 = 1 group of ten and 7 singles\n20 = 2 groups of ten and 0 singles\n\nThe group of ten is called the tens. The singles are called the ones."},
      {"type": "callout", "content": "In the number 16, the 1 stands for 1 group of ten and the 6 stands for 6 ones. 10 + 6 = 16.", "style": "info"},
      {"type": "callout", "content": "Use craft sticks! Bundle 10 sticks together with an elastic. Each bundle is 1 ten.", "style": "tip"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "You have 18 blocks. How many groups of 10 can you make?", "options": ["0", "1", "2", "8"], "correct": 1, "explanation": "18 blocks makes 1 group of ten with 8 left over. 18 = 1 ten and 8 ones."},
      {"type": "quiz", "question": "A number has 1 ten and 5 ones. What is the number?", "options": ["51", "15", "10", "5"], "correct": 1, "explanation": "1 ten and 5 ones = 10 + 5 = 15."}
    ]'::jsonb,
    '[{"term": "Group", "definition": "A set of objects put together, like a bundle of 10"},
      {"term": "Tens", "definition": "Groups of 10 objects"},
      {"term": "Ones", "definition": "Single objects that are not part of a group of 10"},
      {"term": "Place value", "definition": "The value of a digit based on its position in a number"}]'::jsonb,
    'Grouping objects is a natural part of traditional Indigenous food preparation. Drying fish or berries often involves organizing items into bundles or groups for storage and sharing.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N1.7';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are tens and ones?', 'Tens are groups of 10 objects. Ones are single objects left over.', 'Think of bundles and loose sticks.', 1, 0),
    (v_tenant, v_ch, 'What number is 1 ten and 9 ones?', '19', '10 + 9 = ?', 1, 1),
    (v_tenant, v_ch, 'How many tens are in the number 20?', '2 tens (and 0 ones)', '20 = 10 + 10.', 1, 2);


  -- Chapter 6 — Addition and Subtraction to 20 (N1.9, N1.10)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 6, 'Addition and Subtraction to 20', 'addition-subtraction-to-20',
    'Understand addition with sums to 20 and corresponding subtraction using concrete, pictorial, and symbolic representations, and mental math strategies for facts to 18.',
    '[
      {"type": "heading", "content": "Addition and Subtraction to 20", "level": 1},
      {"type": "text", "content": "Addition means putting groups together to find the total. Subtraction means taking away from a group to find how many are left."},
      {"type": "heading", "content": "Addition: Putting Together", "level": 2},
      {"type": "text", "content": "When we add, we combine two groups.\n\nExample: You have 8 apples and get 5 more.\n8 + 5 = 13\n\nWe use the + symbol for addition and the = symbol to show the answer."},
      {"type": "heading", "content": "Subtraction: Taking Away", "level": 2},
      {"type": "text", "content": "When we subtract, we take away from a group.\n\nExample: You have 14 crayons and give away 6.\n14 - 6 = 8\n\nWe use the - symbol for subtraction."},
      {"type": "callout", "content": "Addition and subtraction are related! If 7 + 5 = 12, then 12 - 5 = 7 and 12 - 7 = 5.", "style": "info"},
      {"type": "heading", "content": "Mental Math Strategies", "level": 2},
      {"type": "text", "content": "Here are some strategies to add and subtract in your head:\n\n1. Counting on: Start at the bigger number and count up. For 9 + 3, start at 9 and count: 10, 11, 12.\n\n2. Doubles: Know your doubles. 6 + 6 = 12, 7 + 7 = 14, 8 + 8 = 16.\n\n3. Making 10: Break a number apart to make 10 first. For 8 + 5: take 2 from the 5 to make 10, then add the 3 left over. 10 + 3 = 13."},
      {"type": "callout", "content": "Making 10 is a powerful strategy! If one number is close to 10, fill it up to 10, then add the rest.", "style": "tip"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "7 + 8 = ?", "options": ["13", "14", "15", "16"], "correct": 2, "explanation": "7 + 8 = 15. You can think: 7 + 7 = 14, and 1 more makes 15."},
      {"type": "quiz", "question": "16 - 9 = ?", "options": ["5", "6", "7", "8"], "correct": 2, "explanation": "16 - 9 = 7. You can count up from 9: 10, 11, 12, 13, 14, 15, 16 — that is 7 counts."},
      {"type": "quiz", "question": "If 6 + 8 = 14, what is 14 - 8?", "options": ["4", "5", "6", "7"], "correct": 2, "explanation": "Since 6 + 8 = 14, we know 14 - 8 = 6. They are related facts!"}
    ]'::jsonb,
    '[{"term": "Addition", "definition": "Putting two or more groups together to find the total"},
      {"term": "Subtraction", "definition": "Taking away from a group to find how many are left"},
      {"term": "Sum", "definition": "The answer to an addition problem"},
      {"term": "Difference", "definition": "The answer to a subtraction problem"},
      {"term": "Mental math", "definition": "Solving math problems in your head without writing"}]'::jsonb,
    'Addition and subtraction are part of daily life in Indigenous communities. When sharing food or trading goods, people naturally add and subtract to make sure everyone gets a fair portion.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N1.9';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N1.10';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does addition mean?', 'Putting two or more groups together to find the total.', 'You are combining.', 1, 0),
    (v_tenant, v_ch, 'What is 9 + 6?', '15', 'Make 10 first: 9 + 1 = 10, then add 5 more.', 2, 1),
    (v_tenant, v_ch, 'What is the related subtraction fact for 8 + 7 = 15?', '15 - 7 = 8 (or 15 - 8 = 7)', 'Turn the addition around.', 2, 2),
    (v_tenant, v_ch, 'What does the = sign mean?', 'The same as; the amount on both sides is equal.', 'Both sides balance.', 1, 3);


  -- ========================================================================
  -- UNIT 2: Patterns and Relations (P1.1 – P1.4)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Patterns and Relations',
    'Repeating patterns with up to four elements, translating patterns, and understanding equality.',
    'Patterns and equality are the building blocks of algebra and help us see structure in mathematics.',
    'How do patterns and equality help us understand math?')
  RETURNING id INTO v_unit;

  -- Chapter 7 — Repeating Patterns (P1.1, P1.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 7, 'Repeating Patterns', 'repeating-patterns',
    'Describe, reproduce, extend, and create repeating patterns with two to four elements, and translate patterns between representations.',
    '[
      {"type": "heading", "content": "Repeating Patterns", "level": 1},
      {"type": "text", "content": "You learned about patterns in Kindergarten. Now we will work with more complex patterns that use up to four different elements."},
      {"type": "heading", "content": "Patterns With More Elements", "level": 2},
      {"type": "text", "content": "Two elements: AB pattern — red, blue, red, blue\nThree elements: ABC pattern — red, blue, green, red, blue, green\nFour elements: ABCD pattern — circle, square, triangle, star, circle, square, triangle, star\n\nThe more elements in the core, the longer it takes before the pattern repeats."},
      {"type": "heading", "content": "Translating Patterns", "level": 2},
      {"type": "text", "content": "Translating a pattern means showing the same pattern in a different way.\n\nExample: The pattern red, blue, red, blue can also be shown as:\n- clap, snap, clap, snap (using actions)\n- A, B, A, B (using letters)\n- circle, square, circle, square (using shapes)\n\nAll of these are the same AB pattern — just in different forms!"},
      {"type": "callout", "content": "Using letters like A, B, C to describe a pattern makes it easier to see the structure. A stands for the first element, B for the second, and so on.", "style": "tip"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What type of pattern is this: hop, jump, clap, hop, jump, clap?", "options": ["AB pattern", "ABC pattern", "ABCD pattern", "AAB pattern"], "correct": 1, "explanation": "The core has three elements (hop, jump, clap), so it is an ABC pattern."},
      {"type": "quiz", "question": "The pattern big, small, big, small is translated into shapes. Which could it be?", "options": ["circle, square, circle, square", "circle, circle, square, square", "circle, square, triangle, circle", "circle, square, square, circle"], "correct": 0, "explanation": "Big = circle, small = square. The AB pattern stays the same, just with different elements."}
    ]'::jsonb,
    '[{"term": "Translate", "definition": "To show the same pattern using different materials or forms"},
      {"term": "Core", "definition": "The part of the pattern that repeats"},
      {"term": "AB pattern", "definition": "A pattern with two elements that repeat"},
      {"term": "ABC pattern", "definition": "A pattern with three elements that repeat"}]'::jsonb,
    'Pattern translation is visible in Indigenous beadwork, where the same design pattern is expressed through different colour combinations and materials across different items like moccasins, bags, and clothing.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'P1.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'P1.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does translate a pattern mean?', 'To show the same pattern using different materials or forms.', 'Same structure, different look.', 1, 0),
    (v_tenant, v_ch, 'How many elements are in an ABC pattern?', '3', 'A = first, B = second, C = third.', 1, 1),
    (v_tenant, v_ch, 'Give an example of an ABCD pattern.', 'Red, blue, green, yellow, red, blue, green, yellow.', 'Four different things repeat.', 2, 2);


  -- Chapter 8 — Equality and the Equal Sign (P1.3, P1.4)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 8, 'Equality and the Equal Sign', 'equality-and-equal-sign',
    'Describe equality as a balance and inequality as an imbalance, and record equalities using the equal symbol.',
    '[
      {"type": "heading", "content": "Equality and the Equal Sign", "level": 1},
      {"type": "text", "content": "Equality means two amounts are the same. The equal sign (=) tells us that what is on the left side has the same value as what is on the right side."},
      {"type": "heading", "content": "Balance and Equality", "level": 2},
      {"type": "text", "content": "Think of a balance scale. When both sides hold the same amount, the scale is level — it balances.\n\n5 + 3 = 8 means the left side (5 + 3) balances with the right side (8).\n\nWe can also write: 8 = 5 + 3. The equal sign works both ways!"},
      {"type": "callout", "content": "The equal sign does not mean the answer is coming. It means both sides are the same!", "style": "info"},
      {"type": "heading", "content": "Inequality", "level": 2},
      {"type": "text", "content": "When the two sides are NOT the same, we have inequality. The scale tips to one side — it does not balance.\n\n5 + 3 does NOT equal 9. One side is 8, the other is 9. They are different."},
      {"type": "heading", "content": "Writing Equalities", "level": 2},
      {"type": "text", "content": "You can write equalities in many ways:\n- 3 + 4 = 7\n- 7 = 3 + 4\n- 2 + 5 = 3 + 4\n- 10 = 10\n\nAll of these are true because both sides have the same value."},
      {"type": "callout", "content": "Try this: Is 6 + 2 = 4 + 4 true? Left side = 8. Right side = 8. Yes! Both sides are equal.", "style": "tip"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Is 5 + 4 = 9 true or false?", "options": ["True", "False"], "correct": 0, "explanation": "5 + 4 = 9 is true because both sides equal 9."},
      {"type": "quiz", "question": "Is 3 + 5 = 2 + 7 true or false?", "options": ["True", "False"], "correct": 1, "explanation": "3 + 5 = 8 and 2 + 7 = 9. Since 8 does not equal 9, this is false."}
    ]'::jsonb,
    '[{"term": "Equality", "definition": "When two amounts have the same value"},
      {"term": "Equal sign (=)", "definition": "A symbol that means both sides are the same"},
      {"term": "Inequality", "definition": "When two amounts do NOT have the same value"},
      {"term": "Balance", "definition": "When both sides of a scale are level because they hold the same amount"}]'::jsonb,
    'The concept of balance and equality is deeply valued in Indigenous cultures. The Medicine Wheel teaches about balance between physical, mental, emotional, and spiritual well-being — all four parts must be in balance.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'P1.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'P1.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does the equal sign mean?', 'Both sides have the same value.', 'Think of a balanced scale.', 1, 0),
    (v_tenant, v_ch, 'What is equality?', 'When two amounts have the same value.', '5 + 3 and 8 are equal.', 1, 1),
    (v_tenant, v_ch, 'Is 4 + 3 = 3 + 4 true?', 'Yes! Both sides equal 7.', 'The order does not change the sum.', 1, 2);


  -- ========================================================================
  -- UNIT 3: Shape and Space (SS1.1 – SS1.4)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Shape and Space',
    'Measurement by comparing, sorting 2-D shapes and 3-D objects, composing shapes, and relating 2-D shapes to 3-D objects.',
    'Shapes and measurement help us describe, organize, and understand the physical world.',
    'How do shapes and measurement help us describe our world?')
  RETURNING id INTO v_unit;

  -- Chapter 9 — Measurement by Comparing (SS1.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 9, 'Measurement by Comparing', 'measurement-by-comparing',
    'Understand measurement as comparing by identifying attributes, ordering objects, and making comparison statements.',
    '[
      {"type": "heading", "content": "Measurement by Comparing", "level": 1},
      {"type": "text", "content": "Measurement starts with comparing. Before we use rulers or scales, we can compare objects by looking at their attributes — like length, height, mass, and capacity."},
      {"type": "heading", "content": "Identifying Attributes to Measure", "level": 2},
      {"type": "text", "content": "Some attributes we can measure:\n- Length: how long something is\n- Height: how tall something is\n- Mass: how heavy something is\n- Capacity: how much a container holds\n- Area: how much surface something covers"},
      {"type": "heading", "content": "Ordering Objects", "level": 2},
      {"type": "text", "content": "You can put three or more objects in order by an attribute.\n\nExample: Order three pencils from shortest to longest.\n1. Compare them two at a time.\n2. Find the shortest, the middle, and the longest.\n3. Line them up in order.\n\nYou can also order from lightest to heaviest or smallest to largest."},
      {"type": "callout", "content": "When ordering objects by length, make sure they all start at the same point!", "style": "tip"},
      {"type": "heading", "content": "Comparison Statements", "level": 2},
      {"type": "text", "content": "Use comparison words to describe what you find:\n- The book is longer than the eraser.\n- The feather is lighter than the rock.\n- The bucket holds more than the cup.\n- The desk is taller than the chair."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "You have three sticks. Stick A is 5 cubes long, Stick B is 8 cubes long, and Stick C is 3 cubes long. Which order is shortest to longest?", "options": ["A, B, C", "C, A, B", "B, A, C", "C, B, A"], "correct": 1, "explanation": "C (3) is shortest, A (5) is in the middle, and B (8) is longest."},
      {"type": "quiz", "question": "Which comparison statement is correct? A watermelon and a grape:", "options": ["The grape is heavier", "The watermelon is heavier", "They weigh the same"], "correct": 1, "explanation": "A watermelon is much heavier than a grape."}
    ]'::jsonb,
    '[{"term": "Measurement", "definition": "Finding the size, length, weight, or capacity of something"},
      {"term": "Attribute", "definition": "A feature of an object that can be measured, like length or mass"},
      {"term": "Order", "definition": "To arrange objects from least to greatest or greatest to least"},
      {"term": "Compare", "definition": "To find out how objects are different in size, length, or weight"}]'::jsonb,
    'Traditional Indigenous measurement used body parts as units — a hand span, an arm length, a pace. These methods show that measurement begins with comparing using familiar referents.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS1.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does measurement mean?', 'Finding the size, length, weight, or capacity of something.', 'You are finding out about an attribute.', 1, 0),
    (v_tenant, v_ch, 'Name three attributes you can measure.', 'Length, mass, and capacity.', 'How long, how heavy, and how much it holds.', 1, 1),
    (v_tenant, v_ch, 'What does ordering objects mean?', 'Arranging them from least to greatest (or greatest to least) by an attribute.', 'Shortest to longest, lightest to heaviest.', 1, 2);


  -- Chapter 10 — Sorting and Comparing Shapes (SS1.2, SS1.3, SS1.4)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 10, 'Sorting and Comparing Shapes', 'sorting-and-comparing-shapes',
    'Sort 2-D shapes and 3-D objects, compose shapes, and compare 2-D shapes to parts of 3-D objects.',
    '[
      {"type": "heading", "content": "Sorting and Comparing Shapes", "level": 1},
      {"type": "text", "content": "In the world around us, we see both flat shapes and solid objects. Flat shapes are called 2-D shapes. Solid shapes you can hold are called 3-D objects."},
      {"type": "heading", "content": "2-D Shapes", "level": 2},
      {"type": "text", "content": "2-D shapes are flat. They have length and width but no thickness.\n\nCommon 2-D shapes:\n- Circle: round with no straight sides\n- Triangle: 3 straight sides and 3 corners\n- Square: 4 equal straight sides and 4 corners\n- Rectangle: 4 straight sides (opposite sides are equal) and 4 corners"},
      {"type": "heading", "content": "3-D Objects", "level": 2},
      {"type": "text", "content": "3-D objects take up space. They have length, width, and height.\n\nCommon 3-D objects:\n- Sphere: shaped like a ball\n- Cube: shaped like a dice (6 square faces)\n- Cylinder: shaped like a can\n- Cone: shaped like an ice cream cone"},
      {"type": "heading", "content": "Sorting Shapes", "level": 2},
      {"type": "text", "content": "You can sort shapes by:\n- Number of sides: shapes with 3 sides vs. 4 sides\n- Curved vs. straight sides\n- Can roll vs. cannot roll\n- Has flat faces vs. all curved"},
      {"type": "heading", "content": "Shapes on 3-D Objects", "level": 2},
      {"type": "text", "content": "2-D shapes are found on 3-D objects! A cube has square faces. A cylinder has circle faces on each end. A cone has a circle face on the bottom.\n\nLook around your classroom — trace the flat face of a 3-D object to find the 2-D shape hiding on it!"},
      {"type": "callout", "content": "A face is the flat surface on a 3-D object. A cube has 6 faces. Each face is a square!", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "How many sides does a triangle have?", "options": ["2", "3", "4", "5"], "correct": 1, "explanation": "A triangle has 3 sides. The word tri means three!"},
      {"type": "quiz", "question": "If you trace the flat end of a cylinder, what 2-D shape do you get?", "options": ["Square", "Triangle", "Circle", "Rectangle"], "correct": 2, "explanation": "A cylinder has circle faces on each end. Tracing it gives you a circle."}
    ]'::jsonb,
    '[{"term": "2-D shape", "definition": "A flat shape with length and width, like a circle or square"},
      {"term": "3-D object", "definition": "A solid shape with length, width, and height, like a cube or sphere"},
      {"term": "Face", "definition": "A flat surface on a 3-D object"},
      {"term": "Triangle", "definition": "A 2-D shape with 3 straight sides"},
      {"term": "Square", "definition": "A 2-D shape with 4 equal sides and 4 square corners"}]'::jsonb,
    'Indigenous architecture uses both 2-D and 3-D shapes. The circle of a tipi base, the cone of its structure, and the rectangular shapes of travois demonstrate deep geometric understanding.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS1.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS1.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS1.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the difference between 2-D and 3-D?', '2-D shapes are flat. 3-D objects take up space and have depth.', 'A drawing vs. something you can hold.', 1, 0),
    (v_tenant, v_ch, 'What is a face?', 'A flat surface on a 3-D object.', 'Think about the sides of a box.', 1, 1),
    (v_tenant, v_ch, 'How many faces does a cube have?', '6', 'Think of a dice — count each side.', 1, 2),
    (v_tenant, v_ch, 'What 2-D shape is the face of a cube?', 'A square.', 'All six faces of a cube are the same shape.', 1, 3);

  RAISE NOTICE 'Grade 1 content seeded successfully.';
END $$;


-- ============================================================================
-- GRADE 2 — WolfWhale Foundations of Math 2
-- Outcomes: N2.1, N2.2, P2.1-P2.3, SS2.1-SS2.5, SP2.1
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
    WHERE tenant_id = v_tenant AND slug = 'wolfwhale-foundations-of-math-2';

  -- ========================================================================
  -- UNIT 1: Number Sense (N2.1, N2.2)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Number Sense',
    'Understanding whole numbers to 100: place value, skip counting, odd and even, estimating, comparing, ordering, addition, and subtraction.',
    'Our number system is built on groups of ten, which makes counting and computing efficient.',
    'How does place value help us work with numbers to 100?')
  RETURNING id INTO v_unit;

  -- Chapter 1 — Whole Numbers to 100 (N2.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 1, 'Whole Numbers to 100', 'whole-numbers-to-100',
    'Represent, describe, and order whole numbers to 100 using place value, skip counting, and estimation.',
    '[
      {"type": "heading", "content": "Whole Numbers to 100", "level": 1},
      {"type": "text", "content": "In Grade 2, you will work with all the numbers from 0 to 100. Understanding place value helps us read, write, compare, and order these numbers."},
      {"type": "heading", "content": "Place Value: Tens and Ones", "level": 2},
      {"type": "text", "content": "Every two-digit number is made of tens and ones.\n\nThe digit on the left tells how many tens. The digit on the right tells how many ones.\n\nExamples:\n- 34 = 3 tens and 4 ones = 30 + 4\n- 67 = 6 tens and 7 ones = 60 + 7\n- 80 = 8 tens and 0 ones = 80 + 0"},
      {"type": "callout", "content": "Use base-ten blocks! A rod stands for 10. A small cube stands for 1. Build numbers with rods and cubes.", "style": "tip"},
      {"type": "heading", "content": "Skip Counting", "level": 2},
      {"type": "text", "content": "Skip counting helps us count faster:\n- By 2s: 2, 4, 6, 8, 10, 12, 14, ...\n- By 5s: 5, 10, 15, 20, 25, 30, ...\n- By 10s: 10, 20, 30, 40, 50, ...\n\nYou can also skip count starting from any number. Count by 5s starting at 3: 3, 8, 13, 18, 23, ..."},
      {"type": "heading", "content": "Odd and Even Numbers", "level": 2},
      {"type": "text", "content": "Even numbers can be split into two equal groups with nothing left over: 2, 4, 6, 8, 10, 12, ...\n\nOdd numbers have one left over when split into two groups: 1, 3, 5, 7, 9, 11, 13, ...\n\nTip: Look at the ones digit. If it is 0, 2, 4, 6, or 8, the number is even. Otherwise it is odd."},
      {"type": "heading", "content": "Comparing and Ordering", "level": 2},
      {"type": "text", "content": "To compare two numbers:\n1. First compare the tens digit. More tens = bigger number.\n2. If the tens are the same, compare the ones digit.\n\nExamples:\n- 47 and 52: 4 tens < 5 tens, so 47 < 52\n- 63 and 68: both have 6 tens, 3 ones < 8 ones, so 63 < 68"},
      {"type": "callout", "content": "The symbols < (less than) and > (greater than) point to the smaller number. Think of the open end as a hungry mouth eating the bigger number!", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is the place value of the 5 in the number 53?", "options": ["5 ones", "5 tens", "5 hundreds", "50 ones"], "correct": 1, "explanation": "The 5 is in the tens place, so it means 5 tens or 50."},
      {"type": "quiz", "question": "Is the number 37 odd or even?", "options": ["Odd", "Even"], "correct": 0, "explanation": "The ones digit is 7, which is odd. So 37 is odd."},
      {"type": "quiz", "question": "Which is greater: 74 or 69?", "options": ["74", "69", "They are equal"], "correct": 0, "explanation": "74 has 7 tens and 69 has 6 tens. 7 tens > 6 tens, so 74 is greater."}
    ]'::jsonb,
    '[{"term": "Place value", "definition": "The value of a digit based on its position in a number"},
      {"term": "Tens", "definition": "The digit in a two-digit number that tells how many groups of 10"},
      {"term": "Ones", "definition": "The digit that tells how many single units"},
      {"term": "Even number", "definition": "A number that can be split into two equal groups"},
      {"term": "Odd number", "definition": "A number that has one left over when split into two equal groups"}]'::jsonb,
    'The base-ten system we use today was developed over centuries by many cultures. Indigenous counting systems often connected to natural groupings, such as counting by fives (fingers on one hand) and twenties (fingers and toes).',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N2.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'In the number 48, what does the 4 stand for?', '4 tens, or 40.', 'Look at which place the 4 is in.', 1, 0),
    (v_tenant, v_ch, 'Is the number 56 odd or even?', 'Even, because the ones digit is 6.', 'Check the ones digit: 0, 2, 4, 6, 8 are even.', 1, 1),
    (v_tenant, v_ch, 'Put these numbers in order from least to greatest: 82, 28, 55.', '28, 55, 82', 'Compare the tens digit first.', 2, 2),
    (v_tenant, v_ch, 'What is skip counting by 5s from 10 to 35?', '10, 15, 20, 25, 30, 35', 'Add 5 each time.', 1, 3);


  -- Chapter 2 — Addition and Subtraction to 100 (N2.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 2, 'Addition and Subtraction to 100', 'addition-subtraction-to-100',
    'Add 1- and 2-digit numbers with sums to 100, and use corresponding subtraction, using concrete, pictorial, and symbolic strategies.',
    '[
      {"type": "heading", "content": "Addition and Subtraction to 100", "level": 1},
      {"type": "text", "content": "Now that you understand place value, you can add and subtract bigger numbers! We will work with sums up to 100."},
      {"type": "heading", "content": "Adding Two-Digit Numbers", "level": 2},
      {"type": "text", "content": "To add two-digit numbers, add the tens, then add the ones.\n\nExample: 34 + 25\n- Add the tens: 30 + 20 = 50\n- Add the ones: 4 + 5 = 9\n- Put it together: 50 + 9 = 59\n\nSo 34 + 25 = 59."},
      {"type": "heading", "content": "Regrouping (Trading)", "level": 2},
      {"type": "text", "content": "Sometimes the ones add up to more than 9. When that happens, we regroup.\n\nExample: 47 + 36\n- Add the ones: 7 + 6 = 13 (that is 1 ten and 3 ones)\n- Add the tens: 40 + 30 = 70, plus the extra 10 = 80\n- Put it together: 80 + 3 = 83\n\nSo 47 + 36 = 83."},
      {"type": "callout", "content": "Regrouping means trading 10 ones for 1 ten. When you get 10 or more ones, make a new ten!", "style": "tip"},
      {"type": "heading", "content": "Subtraction Strategies", "level": 2},
      {"type": "text", "content": "To subtract, you can:\n1. Count up from the smaller number to the bigger number.\n2. Use place value: subtract tens, then subtract ones.\n3. Use a number line and hop backward.\n\nExample: 72 - 35\n- Subtract tens: 70 - 30 = 40\n- Subtract ones: but 2 - 5 does not work easily, so regroup: take 1 ten from 40 to make 30, and add 10 to the ones: 12 - 5 = 7\n- Answer: 30 + 7 = 37"},
      {"type": "callout", "content": "Addition and subtraction are still related! If 45 + 28 = 73, then 73 - 28 = 45.", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "26 + 43 = ?", "options": ["59", "69", "79", "63"], "correct": 1, "explanation": "Add tens: 20 + 40 = 60. Add ones: 6 + 3 = 9. Total: 69."},
      {"type": "quiz", "question": "58 + 27 = ?", "options": ["75", "85", "81", "95"], "correct": 1, "explanation": "Ones: 8 + 7 = 15 (regroup: 1 ten and 5 ones). Tens: 50 + 20 + 10 = 80. Total: 85."},
      {"type": "quiz", "question": "64 - 29 = ?", "options": ["45", "35", "25", "55"], "correct": 1, "explanation": "Regroup: 64 becomes 50 + 14. Then 14 - 9 = 5 and 50 - 20 = 30. Total: 35."}
    ]'::jsonb,
    '[{"term": "Regroup", "definition": "To trade 10 ones for 1 ten or 1 ten for 10 ones"},
      {"term": "Sum", "definition": "The answer to an addition problem"},
      {"term": "Difference", "definition": "The answer to a subtraction problem"},
      {"term": "Strategy", "definition": "A plan or method for solving a problem"}]'::jsonb,
    'Trading and exchanging goods has been a part of Indigenous culture for thousands of years. The concept of regrouping connects to trading practices where items of different values were exchanged fairly.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N2.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does regroup mean?', 'To trade 10 ones for 1 ten, or 1 ten for 10 ones.', 'When ones reach 10 or more, make a new ten.', 1, 0),
    (v_tenant, v_ch, '35 + 48 = ?', '83', 'Ones: 5 + 8 = 13 (regroup). Tens: 30 + 40 + 10 = 80. Answer: 83.', 2, 1),
    (v_tenant, v_ch, '91 - 56 = ?', '35', 'Regroup: 91 = 80 + 11. Then 11 - 6 = 5, 80 - 50 = 30. Answer: 35.', 2, 2),
    (v_tenant, v_ch, 'If 37 + 45 = 82, what is 82 - 45?', '37', 'Related facts!', 1, 3);


  -- ========================================================================
  -- UNIT 2: Patterns and Relations (P2.1, P2.2, P2.3)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Patterns and Relations',
    'Repeating patterns with three to five elements, increasing patterns, and understanding equality and inequality to 100.',
    'Patterns grow and change in predictable ways that help us make sense of numbers.',
    'How do patterns help us predict and understand numbers?')
  RETURNING id INTO v_unit;

  -- Chapter 3 — Repeating Patterns (P2.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 3, 'Repeating Patterns with Many Elements', 'repeating-patterns-many-elements',
    'Describe, represent, extend, compare, and create repeating patterns with three to five elements.',
    '[
      {"type": "heading", "content": "Repeating Patterns with Many Elements", "level": 1},
      {"type": "text", "content": "You have worked with AB and ABC patterns. Now we will explore patterns with even more elements — up to five!"},
      {"type": "heading", "content": "Patterns with Four and Five Elements", "level": 2},
      {"type": "text", "content": "ABCD pattern (4 elements):\nred, blue, green, yellow, red, blue, green, yellow\n\nABCDE pattern (5 elements):\ncircle, square, triangle, star, heart, circle, square, triangle, star, heart\n\nThe more elements in the core, the harder it is to spot the pattern. Look carefully for where the pattern starts to repeat."},
      {"type": "heading", "content": "Comparing Patterns", "level": 2},
      {"type": "text", "content": "Two patterns can look different but have the same structure.\n\nPattern 1: red, blue, blue, red, blue, blue (ABB)\nPattern 2: clap, snap, snap, clap, snap, snap (ABB)\n\nBoth are ABB patterns even though they use different things."},
      {"type": "callout", "content": "To compare patterns, first write each pattern using letters. If the letters match, the patterns have the same structure.", "style": "tip"},
      {"type": "heading", "content": "Representing Patterns in Different Modes", "level": 2},
      {"type": "text", "content": "You can show the same pattern using:\n- Colours: red, blue, green\n- Shapes: circle, square, triangle\n- Sounds: clap, snap, tap\n- Actions: jump, sit, spin\n- Numbers: 1, 2, 3\n- Letters: A, B, C"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What type of pattern is: A, B, C, D, A, B, C, D?", "options": ["ABC pattern", "AB pattern", "ABCD pattern", "ABCDE pattern"], "correct": 2, "explanation": "The core has 4 elements (A, B, C, D), so it is an ABCD pattern."},
      {"type": "quiz", "question": "Which pattern has the same structure as: big, small, small, big, small, small?", "options": ["clap, tap, clap, tap", "hop, skip, skip, hop, skip, skip", "jump, jump, sit, jump, jump, sit", "red, blue, green, red, blue, green"], "correct": 1, "explanation": "The pattern is ABB. Hop, skip, skip follows the same ABB structure."}
    ]'::jsonb,
    '[{"term": "Core", "definition": "The part of a repeating pattern that keeps happening over and over"},
      {"term": "Structure", "definition": "The arrangement or type of pattern (like AB, ABC, ABB)"},
      {"term": "Mode", "definition": "The form used to show a pattern, such as colours, shapes, or sounds"}]'::jsonb,
    'Complex repeating patterns are a hallmark of Indigenous art across Saskatchewan. Quillwork often uses patterns with four or five colours, each colour carrying specific cultural significance.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'P2.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'How many elements are in the core of an ABCDE pattern?', '5', 'Count: A, B, C, D, E.', 1, 0),
    (v_tenant, v_ch, 'What is pattern structure?', 'The arrangement or type of pattern, like AB, ABC, or ABB.', 'It describes the pattern rule.', 1, 1),
    (v_tenant, v_ch, 'Do clap-tap-clap-tap and red-blue-red-blue have the same structure?', 'Yes! Both are AB patterns.', 'Write them with letters and compare.', 1, 2);


  -- Chapter 4 — Increasing Patterns (P2.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 4, 'Increasing Patterns', 'increasing-patterns',
    'Describe, reproduce, extend, and create increasing patterns using objects, pictures, sounds, and numbers to 100.',
    '[
      {"type": "heading", "content": "Increasing Patterns", "level": 1},
      {"type": "text", "content": "An increasing pattern is different from a repeating pattern. In an increasing pattern, the numbers or quantities get bigger each time following a rule."},
      {"type": "heading", "content": "What Makes a Pattern Increasing?", "level": 2},
      {"type": "text", "content": "In a repeating pattern, the same core happens over and over.\nIn an increasing pattern, each step grows by the same amount.\n\nExample: 2, 4, 6, 8, 10, ...\nThis pattern increases by 2 each time.\n\nExample: 5, 10, 15, 20, 25, ...\nThis pattern increases by 5 each time."},
      {"type": "callout", "content": "To find the rule, look at how much is added each time. Subtract any two neighbours to find the amount of growth.", "style": "tip"},
      {"type": "heading", "content": "Increasing Patterns with Objects", "level": 2},
      {"type": "text", "content": "You can build increasing patterns with blocks:\n- Step 1: 1 block\n- Step 2: 3 blocks\n- Step 3: 5 blocks\n- Step 4: 7 blocks\n\nThe pattern grows by 2 blocks each time. What would Step 5 look like? (9 blocks!)"},
      {"type": "heading", "content": "Increasing Patterns with Numbers", "level": 2},
      {"type": "text", "content": "Number patterns to 100:\n- Start at 3, add 10 each time: 3, 13, 23, 33, 43, 53, ...\n- Start at 1, add 4 each time: 1, 5, 9, 13, 17, 21, ..."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is the rule for this pattern: 10, 20, 30, 40, 50?", "options": ["Add 5", "Add 10", "Add 20", "Multiply by 2"], "correct": 1, "explanation": "Each number increases by 10. The rule is add 10."},
      {"type": "quiz", "question": "What comes next: 4, 7, 10, 13, ___?", "options": ["14", "15", "16", "17"], "correct": 2, "explanation": "The pattern increases by 3 each time. 13 + 3 = 16."}
    ]'::jsonb,
    '[{"term": "Increasing pattern", "definition": "A pattern where each number or quantity gets bigger by the same amount"},
      {"term": "Rule", "definition": "The instruction that tells how the pattern grows, like add 3"},
      {"term": "Growing", "definition": "Getting bigger or larger"}]'::jsonb,
    'Increasing patterns appear in nature, which Indigenous peoples have long observed. The spiral pattern of a snail shell, the branching of trees, and the widening rings of a tree trunk all show increasing growth.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'P2.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is an increasing pattern?', 'A pattern where each number or quantity gets bigger by the same amount.', 'The numbers go up!', 1, 0),
    (v_tenant, v_ch, 'What is the rule for: 5, 10, 15, 20, 25?', 'Add 5 each time.', 'How much bigger is each number?', 1, 1),
    (v_tenant, v_ch, 'What comes next: 2, 5, 8, 11, ?', '14', 'The rule is add 3.', 2, 2);


  -- Chapter 5 — Equality and Inequality (P2.3)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 5, 'Equality and Inequality to 100', 'equality-inequality-to-100',
    'Demonstrate understanding of equality and inequality concretely and pictorially (0 to 100).',
    '[
      {"type": "heading", "content": "Equality and Inequality to 100", "level": 1},
      {"type": "text", "content": "In Grade 1, you learned that the equal sign means both sides have the same value. Now we will work with bigger numbers and learn about inequality symbols too."},
      {"type": "heading", "content": "Equality with Bigger Numbers", "level": 2},
      {"type": "text", "content": "Equality still means balance.\n\n35 + 15 = 50 is true because both sides equal 50.\n42 + 28 = 70 is true because both sides equal 70.\n\nYou can check by computing each side."},
      {"type": "heading", "content": "Inequality Symbols", "level": 2},
      {"type": "text", "content": "When two sides are NOT equal, we use inequality symbols:\n\n> means greater than: 50 > 35 (50 is greater than 35)\n< means less than: 23 < 47 (23 is less than 47)\n\nThe open end of the symbol always faces the bigger number."},
      {"type": "callout", "content": "Think of < and > as a hungry alligator mouth. It always opens toward the bigger number because it wants to eat the bigger one!", "style": "tip"},
      {"type": "heading", "content": "Comparing Sets and Expressions", "level": 2},
      {"type": "text", "content": "You can compare not just single numbers but also expressions:\n\n25 + 10 ? 30 + 8\n25 + 10 = 35 and 30 + 8 = 38\n35 < 38, so 25 + 10 < 30 + 8"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Which symbol goes in the blank: 45 ___ 62?", "options": [">", "<", "="], "correct": 1, "explanation": "45 is less than 62, so 45 < 62."},
      {"type": "quiz", "question": "Is 30 + 20 = 25 + 25 true or false?", "options": ["True", "False"], "correct": 0, "explanation": "30 + 20 = 50 and 25 + 25 = 50. Both sides equal 50, so it is true!"},
      {"type": "quiz", "question": "Which symbol goes in the blank: 78 ___ 61?", "options": [">", "<", "="], "correct": 0, "explanation": "78 is greater than 61, so 78 > 61."}
    ]'::jsonb,
    '[{"term": "Equality", "definition": "When both sides of the equal sign have the same value"},
      {"term": "Inequality", "definition": "When two sides do NOT have the same value"},
      {"term": "Greater than (>)", "definition": "A symbol meaning the number on the left is bigger"},
      {"term": "Less than (<)", "definition": "A symbol meaning the number on the left is smaller"}]'::jsonb,
    'The concept of balance and fairness is deeply important in Indigenous cultures. Traditional sharing circles ensure that everyone receives an equal portion, reflecting the mathematical idea of equality.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'P2.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does > mean?', 'Greater than. The number on the left is bigger.', 'The open end faces the bigger number.', 1, 0),
    (v_tenant, v_ch, 'What does < mean?', 'Less than. The number on the left is smaller.', 'The pointy end points to the smaller number.', 1, 1),
    (v_tenant, v_ch, 'Is 40 + 30 = 35 + 35 true?', 'Yes! Both sides equal 70.', 'Compute each side.', 2, 2);


  -- ========================================================================
  -- UNIT 3: Shape and Space (SS2.1 – SS2.5)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Shape and Space',
    'Non-standard measurement of length and mass, describing and constructing 2-D shapes and 3-D objects, and relating 2-D shapes to 3-D objects.',
    'We measure and describe the world around us using attributes of length, mass, and shape.',
    'How do we measure and describe the shapes and objects in our world?')
  RETURNING id INTO v_unit;

  -- Chapter 6 — Measuring Length (SS2.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 6, 'Measuring Length', 'measuring-length',
    'Use non-standard units to measure, estimate, and compare length.',
    '[
      {"type": "heading", "content": "Measuring Length", "level": 1},
      {"type": "text", "content": "Before we use rulers, we can measure length using non-standard units — everyday objects like paperclips, blocks, or hand spans."},
      {"type": "heading", "content": "What Are Non-Standard Units?", "level": 2},
      {"type": "text", "content": "A non-standard unit is any object you use to measure. It is not a standard tool like a ruler or metre stick.\n\nExamples:\n- Paperclips: Your book is 8 paperclips long.\n- Cubes: The desk is 24 cubes long.\n- Hand spans: The table is 6 hand spans wide."},
      {"type": "callout", "content": "When measuring, make sure there are no gaps between your units and that they are in a straight line!", "style": "tip"},
      {"type": "heading", "content": "Estimating Before Measuring", "level": 2},
      {"type": "text", "content": "Before you measure, estimate how many units you think it will take. Then measure and compare your estimate to the actual measurement.\n\nExample:\n- Estimate: The pencil is about 5 cubes long.\n- Actual: The pencil is 6 cubes long.\n- Your estimate was close!"},
      {"type": "heading", "content": "Why Different Units Give Different Numbers", "level": 2},
      {"type": "text", "content": "Bigger units give smaller numbers. Smaller units give bigger numbers.\n\nA desk might be:\n- 3 hand spans long (big unit)\n- 12 paperclips long (small unit)\n\nThe desk did not change. The size of the unit changed!"},
      {"type": "callout", "content": "If you use a big unit, you need fewer of them. If you use a small unit, you need more of them.", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "You measure a book using paperclips. It is 7 paperclips long. If you used bigger blocks instead, would you need more or fewer?", "options": ["More blocks", "Fewer blocks", "The same number"], "correct": 1, "explanation": "Bigger units means fewer are needed to cover the same length."},
      {"type": "quiz", "question": "Why is it important to leave no gaps when measuring?", "options": ["It looks nicer", "Gaps make the measurement too small", "Gaps make the measurement too big", "It does not matter"], "correct": 1, "explanation": "Gaps mean you skip over some length, so your measurement will be less than the actual length."}
    ]'::jsonb,
    '[{"term": "Non-standard unit", "definition": "An everyday object used to measure, like a paperclip or hand span"},
      {"term": "Estimate", "definition": "A thoughtful guess about a measurement before measuring"},
      {"term": "Length", "definition": "How long something is from one end to the other"},
      {"term": "Gap", "definition": "An empty space between measurement units"}]'::jsonb,
    'Indigenous peoples have always measured using non-standard units from the body and natural world. A pace, an arm span, or the width of a hand are traditional units still used today in many practical tasks.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS2.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a non-standard unit?', 'An everyday object used to measure, like a paperclip or cube.', 'Not a ruler!', 1, 0),
    (v_tenant, v_ch, 'Why do bigger units give smaller numbers?', 'Because each unit covers more length, so fewer are needed.', 'Fewer big steps to cross the same distance.', 2, 1),
    (v_tenant, v_ch, 'What should you do before measuring?', 'Estimate how many units you think it will take.', 'Make a thoughtful guess first.', 1, 2);


  -- Chapter 7 — Measuring Mass (SS2.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 7, 'Measuring Mass', 'measuring-mass',
    'Use non-standard units to measure, estimate, and compare mass.',
    '[
      {"type": "heading", "content": "Measuring Mass", "level": 1},
      {"type": "text", "content": "Mass tells us how heavy something is. We can measure mass using non-standard units like wooden cubes, marbles, or counting bears on a balance scale."},
      {"type": "heading", "content": "Using a Balance Scale", "level": 2},
      {"type": "text", "content": "A balance scale has two pans. You put the object you want to measure on one side and your non-standard units on the other.\n\n1. Place the object on the left pan.\n2. Add units to the right pan one at a time.\n3. When the pans are level (balanced), count the units.\n\nThat number is the mass of the object in those units."},
      {"type": "callout", "content": "If the left pan is lower, the object is heavier than the units on the right. Add more units until they balance!", "style": "tip"},
      {"type": "heading", "content": "Estimating Mass", "level": 2},
      {"type": "text", "content": "Before measuring, hold the object and the unit in your hands. Estimate how many units would balance the object.\n\nExample: A stapler feels like about 20 cubes. After measuring, you find it is 18 cubes. Your estimate was close!"},
      {"type": "heading", "content": "Comparing Mass", "level": 2},
      {"type": "text", "content": "You can compare the mass of two objects by:\n- Holding one in each hand\n- Measuring both with the same unit and comparing the numbers\n\nThe object with more units is heavier."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "An eraser balances with 6 cubes. A pencil balances with 4 cubes. Which is heavier?", "options": ["The eraser", "The pencil", "They are the same"], "correct": 0, "explanation": "The eraser (6 cubes) is heavier than the pencil (4 cubes)."},
      {"type": "quiz", "question": "Why must you use the same unit when comparing mass?", "options": ["Because different units look nicer", "So the numbers can be compared fairly", "Because you can only use one type of unit", "It does not matter"], "correct": 1, "explanation": "Using the same unit ensures a fair comparison. Different units would give numbers that cannot be compared directly."}
    ]'::jsonb,
    '[{"term": "Mass", "definition": "How heavy an object is"},
      {"term": "Balance scale", "definition": "A tool with two pans used to compare or measure mass"},
      {"term": "Balanced", "definition": "When both sides of a scale are level, meaning equal mass"}]'::jsonb,
    'Balance and weighing have been used by Indigenous peoples in trade and food preparation. Knowing how much dried meat or pemmican to prepare required an understanding of mass and fair distribution.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS2.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is mass?', 'How heavy an object is.', 'You feel it when you hold something.', 1, 0),
    (v_tenant, v_ch, 'What tool do we use to measure mass with non-standard units?', 'A balance scale.', 'It has two pans.', 1, 1),
    (v_tenant, v_ch, 'When is a balance scale balanced?', 'When both pans are level, meaning equal mass on each side.', 'Neither side is higher or lower.', 1, 2);


  -- Chapter 8 — 3-D Objects and 2-D Shapes (SS2.3, SS2.4, SS2.5)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 8, '3-D Objects and 2-D Shapes', '3d-objects-and-2d-shapes',
    'Describe, compare, and construct 3-D objects and 2-D shapes, and understand how they are related.',
    '[
      {"type": "heading", "content": "3-D Objects and 2-D Shapes", "level": 1},
      {"type": "text", "content": "This chapter is all about geometry — the study of shapes and objects. We will describe, compare, and build 3-D objects and 2-D shapes."},
      {"type": "heading", "content": "3-D Objects", "level": 2},
      {"type": "text", "content": "Key 3-D objects to know:\n- Cube: 6 square faces, 12 edges, 8 vertices (corners)\n- Sphere: completely round, no faces, edges, or vertices\n- Cone: 1 curved surface, 1 circular face, 1 vertex\n- Cylinder: 2 circular faces, 1 curved surface, no vertices\n- Pyramid: triangular faces meeting at a point, 1 base"},
      {"type": "heading", "content": "2-D Shapes", "level": 2},
      {"type": "text", "content": "Key 2-D shapes to know:\n- Circle: 0 straight sides, perfectly round\n- Triangle: 3 sides and 3 vertices\n- Square: 4 equal sides and 4 right angles\n- Rectangle: 4 sides (opposite sides equal) and 4 right angles\n\nA square is a special type of rectangle!"},
      {"type": "heading", "content": "How 2-D and 3-D Are Related", "level": 2},
      {"type": "text", "content": "The faces of 3-D objects are 2-D shapes!\n\n- A cube has square faces.\n- A cylinder has circle faces.\n- A pyramid has triangle faces and a square or rectangle base.\n\nIf you trace around the face of a 3-D object, you draw a 2-D shape."},
      {"type": "callout", "content": "Faces are flat. Edges are where two faces meet. Vertices are the corners where edges come together.", "style": "info"},
      {"type": "heading", "content": "Constructing Shapes", "level": 2},
      {"type": "text", "content": "You can build 3-D objects using:\n- Clay or playdough\n- Toothpicks and marshmallows (edges and vertices)\n- Folding paper nets\n\nYou can draw 2-D shapes using a ruler and pencil."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "How many faces does a cube have?", "options": ["4", "5", "6", "8"], "correct": 2, "explanation": "A cube has 6 square faces — top, bottom, front, back, left, right."},
      {"type": "quiz", "question": "What 2-D shape is the face of a cylinder?", "options": ["Square", "Triangle", "Rectangle", "Circle"], "correct": 3, "explanation": "A cylinder has two circular faces on its top and bottom."},
      {"type": "quiz", "question": "What is a vertex?", "options": ["A flat surface", "A corner where edges meet", "A curved line", "The middle of a shape"], "correct": 1, "explanation": "A vertex is a corner — the point where two or more edges meet."}
    ]'::jsonb,
    '[{"term": "Face", "definition": "A flat surface on a 3-D object"},
      {"term": "Edge", "definition": "A line where two faces of a 3-D object meet"},
      {"term": "Vertex (vertices)", "definition": "A corner point where edges meet"},
      {"term": "Cube", "definition": "A 3-D object with 6 equal square faces"},
      {"term": "Pyramid", "definition": "A 3-D object with triangle faces meeting at a top vertex"}]'::jsonb,
    'Geometry is found throughout Indigenous design. The triangle shapes in tipi construction, the circle of a drum, and the rectangular shapes of a drying rack all demonstrate practical geometric knowledge.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS2.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS2.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS2.5';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is an edge?', 'A line where two faces of a 3-D object meet.', 'Feel along the side of a box.', 1, 0),
    (v_tenant, v_ch, 'How many vertices does a cube have?', '8', 'Count the corners of a box.', 2, 1),
    (v_tenant, v_ch, 'Name a 3-D object with no flat faces.', 'A sphere.', 'It is round all over.', 1, 2),
    (v_tenant, v_ch, 'Is a square a special type of rectangle?', 'Yes! A square is a rectangle with all sides equal.', 'Both have 4 right angles.', 2, 3);


  -- ========================================================================
  -- UNIT 4: Statistics and Probability (SP2.1)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Statistics and Probability',
    'Collecting, organizing, and displaying data using concrete graphs and pictographs.',
    'Data helps us answer questions about the world by collecting and organizing information.',
    'How can we collect and show information to answer questions?')
  RETURNING id INTO v_unit;

  -- Chapter 9 — Graphs and Data (SP2.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 9, 'Graphs and Data', 'graphs-and-data',
    'Collect data, organize it, and represent it using concrete graphs and pictographs.',
    '[
      {"type": "heading", "content": "Graphs and Data", "level": 1},
      {"type": "text", "content": "Data is information we collect. A graph is a picture that shows data in a way that is easy to understand and compare."},
      {"type": "heading", "content": "Collecting Data", "level": 2},
      {"type": "text", "content": "To collect data, you can:\n- Ask a question: What is your favourite fruit?\n- Survey your classmates and record their answers\n- Use tally marks to keep count\n\nExample question: What is your favourite colour?\nRed: |||| (4)\nBlue: |||||| (6)\nGreen: ||| (3)"},
      {"type": "callout", "content": "Use tally marks to count. Every fifth mark goes across the first four: ||||. This makes groups of 5 that are easy to count.", "style": "tip"},
      {"type": "heading", "content": "Concrete Graphs", "level": 2},
      {"type": "text", "content": "A concrete graph uses real objects. Stack cubes or place objects in columns to show data.\n\nEach column shows a category (like a colour). The height of the column shows how many chose that answer.\n\nThe tallest column shows the most popular answer."},
      {"type": "heading", "content": "Pictographs", "level": 2},
      {"type": "text", "content": "A pictograph uses pictures to show data. Each picture stands for one item (or sometimes more).\n\nA pictograph needs:\n- A title\n- Labels for each category\n- Pictures lined up neatly\n- A key that tells what each picture stands for"},
      {"type": "heading", "content": "Reading a Graph", "level": 2},
      {"type": "text", "content": "When you read a graph, you can answer questions like:\n- Which has the most?\n- Which has the fewest?\n- How many more does one have than another?\n- How many altogether?"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "In a graph, blue has 7, red has 4, and green has 5. Which colour is the most popular?", "options": ["Red", "Green", "Blue"], "correct": 2, "explanation": "Blue has 7, which is more than red (4) and green (5)."},
      {"type": "quiz", "question": "In the same graph, how many more chose blue than red?", "options": ["2", "3", "4", "5"], "correct": 1, "explanation": "Blue has 7 and red has 4. 7 - 4 = 3 more chose blue."}
    ]'::jsonb,
    '[{"term": "Data", "definition": "Information collected by asking questions or observing"},
      {"term": "Graph", "definition": "A picture that displays data so it is easy to read"},
      {"term": "Pictograph", "definition": "A graph that uses pictures to show data"},
      {"term": "Tally mark", "definition": "A mark used to keep count, grouped in fives"},
      {"term": "Survey", "definition": "Asking a group of people a question to collect data"}]'::jsonb,
    'Indigenous peoples have always gathered and organized information — from recording seasonal changes to tracking animal migration patterns. Winter counts, pictographic records on hide, are a form of data representation.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SP2.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is data?', 'Information collected by asking questions or observing.', 'Facts and numbers about something.', 1, 0),
    (v_tenant, v_ch, 'What is a pictograph?', 'A graph that uses pictures to show data.', 'Each picture stands for one or more items.', 1, 1),
    (v_tenant, v_ch, 'How do tally marks work?', 'You make one mark for each count. Every fifth mark crosses the others to make a group of 5.', 'It helps you count by 5s.', 1, 2),
    (v_tenant, v_ch, 'How do you find how many more one category has than another?', 'Subtract the smaller number from the bigger number.', 'Find the difference.', 2, 3);

  RAISE NOTICE 'Grade 2 content seeded successfully.';
END $$;


-- ============================================================================
-- GRADE 3 — WolfWhale Foundations of Math 3
-- Outcomes: N3.1-N3.4, P3.1-P3.2, SS3.1-SS3.5, SP3.1
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
    WHERE tenant_id = v_tenant AND slug = 'wolfwhale-foundations-of-math-3';

  -- ========================================================================
  -- UNIT 1: Number Sense (N3.1 – N3.4)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Number Sense',
    'Whole numbers to 1000: place value, addition and subtraction to 1000, multiplication and division to 5x5, and introduction to fractions.',
    'Place value extends to hundreds, and we begin to understand multiplication, division, and fractions as new ways to work with numbers.',
    'How do larger numbers and new operations help us solve bigger problems?')
  RETURNING id INTO v_unit;

  -- Chapter 1 — Whole Numbers to 1000 (N3.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 1, 'Whole Numbers to 1000', 'whole-numbers-to-1000',
    'Represent, describe, estimate, compare, and order whole numbers to 1000 using place value.',
    '[
      {"type": "heading", "content": "Whole Numbers to 1000", "level": 1},
      {"type": "text", "content": "In Grade 3, our numbers grow to 1000! We add a new place value — the hundreds place. Understanding hundreds, tens, and ones helps us work with these bigger numbers."},
      {"type": "heading", "content": "Hundreds, Tens, and Ones", "level": 2},
      {"type": "text", "content": "Every three-digit number has:\n- Hundreds: the first digit tells how many groups of 100\n- Tens: the second digit tells how many groups of 10\n- Ones: the third digit tells how many singles\n\nExamples:\n- 347 = 3 hundreds + 4 tens + 7 ones = 300 + 40 + 7\n- 805 = 8 hundreds + 0 tens + 5 ones = 800 + 0 + 5\n- 1000 = 10 hundreds = one thousand"},
      {"type": "callout", "content": "Use base-ten blocks: a flat square = 100, a rod = 10, a small cube = 1. Ten flats make 1000!", "style": "tip"},
      {"type": "heading", "content": "Reading and Writing Numbers", "level": 2},
      {"type": "text", "content": "You can write numbers in different ways:\n- Standard form: 528\n- Expanded form: 500 + 20 + 8\n- Words: five hundred twenty-eight\n\nAll three forms represent the same number."},
      {"type": "heading", "content": "Comparing and Ordering", "level": 2},
      {"type": "text", "content": "To compare three-digit numbers:\n1. Compare hundreds first.\n2. If hundreds are the same, compare tens.\n3. If tens are the same, compare ones.\n\nExample: 467 vs. 492\nBoth have 4 hundreds. Compare tens: 6 < 9. So 467 < 492."},
      {"type": "heading", "content": "Estimating with Referents", "level": 2},
      {"type": "text", "content": "If you know what 100 looks like, use it to estimate larger quantities. A jar with about 2 layers of 100 marbles holds about 200 marbles."},
      {"type": "callout", "content": "When ordering three or more numbers, line them up by place value. Start comparing from the left (hundreds first).", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is the expanded form of 639?", "options": ["63 + 9", "600 + 30 + 9", "6 + 3 + 9", "639 + 0"], "correct": 1, "explanation": "639 = 600 + 30 + 9. Each digit is written with its place value."},
      {"type": "quiz", "question": "Which is greater: 385 or 358?", "options": ["385", "358", "They are equal"], "correct": 0, "explanation": "Both have 3 hundreds. Compare tens: 8 > 5. So 385 > 358."},
      {"type": "quiz", "question": "How many hundreds are in 1000?", "options": ["1", "10", "100", "1000"], "correct": 1, "explanation": "1000 is made of 10 groups of 100."}
    ]'::jsonb,
    '[{"term": "Hundreds", "definition": "The digit that tells how many groups of 100 are in a number"},
      {"term": "Expanded form", "definition": "Writing a number as the sum of its place values, like 500 + 30 + 2"},
      {"term": "Standard form", "definition": "The usual way of writing a number, like 532"},
      {"term": "Thousand", "definition": "The number 1000, which is 10 groups of 100"}]'::jsonb,
    'Large numbers connect to the vastness of the Saskatchewan landscape. Indigenous peoples have long understood large quantities — the number of buffalo in a herd, stars in the sky, or steps in a journey — using estimation and comparison.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N3.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What three places make up a three-digit number?', 'Hundreds, tens, and ones.', 'From left to right.', 1, 0),
    (v_tenant, v_ch, 'Write 746 in expanded form.', '700 + 40 + 6', 'Break apart each digit by its place value.', 1, 1),
    (v_tenant, v_ch, 'How many hundreds are in 1000?', '10', '10 groups of 100 make 1000.', 2, 2),
    (v_tenant, v_ch, 'Compare: 529 ___ 592. Which symbol goes in the blank?', '< (less than)', 'Both have 5 hundreds. Compare tens: 2 < 9.', 2, 3);


  -- Chapter 2 — Addition and Subtraction to 1000 (N3.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 2, 'Addition and Subtraction to 1000', 'addition-subtraction-to-1000',
    'Add and subtract whole numbers with answers to 1000 using 1-, 2-, and 3-digit numerals.',
    '[
      {"type": "heading", "content": "Addition and Subtraction to 1000", "level": 1},
      {"type": "text", "content": "With three-digit numbers, we use the same strategies you learned in Grade 2 — but now with hundreds, tens, and ones."},
      {"type": "heading", "content": "Adding Three-Digit Numbers", "level": 2},
      {"type": "text", "content": "Add each place value from right to left:\n\nExample: 345 + 237\n- Ones: 5 + 7 = 12 (write 2, carry 1)\n- Tens: 4 + 3 + 1 = 8\n- Hundreds: 3 + 2 = 5\n- Answer: 582"},
      {"type": "callout", "content": "Always start adding from the ones place. If a column adds to 10 or more, regroup by carrying to the next place.", "style": "tip"},
      {"type": "heading", "content": "Subtracting Three-Digit Numbers", "level": 2},
      {"type": "text", "content": "Subtract each place value from right to left. If the top digit is smaller, regroup.\n\nExample: 523 - 178\n- Ones: 3 - 8 (cannot do, regroup: borrow 1 ten) 13 - 8 = 5\n- Tens: 1 - 7 (cannot do, regroup: borrow 1 hundred) 11 - 7 = 4\n- Hundreds: 4 - 1 = 3\n- Answer: 345"},
      {"type": "heading", "content": "Checking Your Work", "level": 2},
      {"type": "text", "content": "You can check subtraction by adding:\nIf 523 - 178 = 345, then 345 + 178 should equal 523.\n\nLet us check: 345 + 178 = 523. Correct!"},
      {"type": "callout", "content": "Estimation helps you check your answer. Round each number to the nearest hundred first.\n523 - 178 is about 500 - 200 = 300. Our answer of 345 is close to 300, so it makes sense.", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "456 + 328 = ?", "options": ["774", "784", "684", "884"], "correct": 1, "explanation": "Ones: 6 + 8 = 14 (write 4, carry 1). Tens: 5 + 2 + 1 = 8. Hundreds: 4 + 3 = 7. Answer: 784."},
      {"type": "quiz", "question": "700 - 263 = ?", "options": ["537", "447", "437", "463"], "correct": 2, "explanation": "Regroup: 700 = 6 hundreds + 9 tens + 10 ones. 10 - 3 = 7, 9 - 6 = 3, 6 - 2 = 4. Answer: 437."},
      {"type": "quiz", "question": "Estimate 389 + 214 by rounding to the nearest hundred.", "options": ["About 400", "About 500", "About 600", "About 700"], "correct": 2, "explanation": "389 rounds to 400 and 214 rounds to 200. 400 + 200 = about 600."}
    ]'::jsonb,
    '[{"term": "Regroup", "definition": "To exchange 10 in one place value for 1 in the next higher place value"},
      {"term": "Carry", "definition": "To move a regrouped amount to the next column in addition"},
      {"term": "Borrow", "definition": "To take 1 from the next column and add 10 to the current column in subtraction"},
      {"term": "Estimate", "definition": "To find an approximate answer, often by rounding"}]'::jsonb,
    'Large-number calculation connects to community planning. When preparing for gatherings and powwows, organizers add and subtract to plan for hundreds of participants — food, seating, and supplies.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N3.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'When adding, which place do you start with?', 'The ones place (right side).', 'Start small and go left.', 1, 0),
    (v_tenant, v_ch, '256 + 387 = ?', '643', 'Ones: 6+7=13, carry 1. Tens: 5+8+1=14, carry 1. Hundreds: 2+3+1=6.', 2, 1),
    (v_tenant, v_ch, '812 - 475 = ?', '337', 'Regroup as needed in ones and tens.', 2, 2),
    (v_tenant, v_ch, 'How can you check a subtraction answer?', 'Add the answer to the number you subtracted. You should get the original number.', 'Subtraction and addition are related.', 1, 3);


  -- Chapter 3 — Multiplication and Division (N3.3)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 3, 'Multiplication and Division', 'multiplication-and-division',
    'Understand multiplication to 5x5 and corresponding division using repeated addition, equal grouping, and arrays.',
    '[
      {"type": "heading", "content": "Multiplication and Division", "level": 1},
      {"type": "text", "content": "Multiplication is a fast way to add equal groups. Division is sharing a total into equal groups. These are two new operations that are related to each other — just like addition and subtraction!"},
      {"type": "heading", "content": "What Is Multiplication?", "level": 2},
      {"type": "text", "content": "Multiplication means adding equal groups.\n\n3 x 4 means 3 groups of 4.\n3 x 4 = 4 + 4 + 4 = 12\n\nThe x symbol means groups of or times."},
      {"type": "heading", "content": "Arrays", "level": 2},
      {"type": "text", "content": "An array is a rectangular arrangement of objects in rows and columns.\n\nA 3 x 4 array has 3 rows and 4 columns:\n* * * *\n* * * *\n* * * *\n\nCount all the objects: 12. So 3 x 4 = 12.\n\nYou can also see this as 4 x 3 (4 rows of 3). The total is still 12!"},
      {"type": "callout", "content": "Multiplication facts can be turned around! 3 x 5 = 5 x 3 = 15. This is called the commutative property.", "style": "info"},
      {"type": "heading", "content": "What Is Division?", "level": 2},
      {"type": "text", "content": "Division means splitting a total into equal groups.\n\n12 divided by 3 means: 12 objects shared into 3 equal groups.\n12 / 3 = 4 (each group gets 4)\n\nDivision is the opposite of multiplication. If 3 x 4 = 12, then 12 / 3 = 4 and 12 / 4 = 3."},
      {"type": "heading", "content": "Multiplication Facts to 5 x 5", "level": 2},
      {"type": "text", "content": "Key facts to learn:\n1 x 1 = 1    2 x 1 = 2    3 x 1 = 3    4 x 1 = 4    5 x 1 = 5\n1 x 2 = 2    2 x 2 = 4    3 x 2 = 6    4 x 2 = 8    5 x 2 = 10\n1 x 3 = 3    2 x 3 = 6    3 x 3 = 9    4 x 3 = 12   5 x 3 = 15\n1 x 4 = 4    2 x 4 = 8    3 x 4 = 12   4 x 4 = 16   5 x 4 = 20\n1 x 5 = 5    2 x 5 = 10   3 x 5 = 15   4 x 5 = 20   5 x 5 = 25"},
      {"type": "callout", "content": "Skip counting helps with multiplication! 5 x 3 is the same as counting by 5s three times: 5, 10, 15.", "style": "tip"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "4 x 5 = ?", "options": ["15", "20", "25", "9"], "correct": 1, "explanation": "4 groups of 5 = 5 + 5 + 5 + 5 = 20."},
      {"type": "quiz", "question": "15 / 3 = ?", "options": ["3", "4", "5", "6"], "correct": 2, "explanation": "15 divided into 3 groups gives 5 in each group. 3 x 5 = 15."},
      {"type": "quiz", "question": "You arrange 12 chairs into 4 equal rows. How many chairs in each row?", "options": ["2", "3", "4", "6"], "correct": 1, "explanation": "12 / 4 = 3. Each row has 3 chairs."}
    ]'::jsonb,
    '[{"term": "Multiplication", "definition": "Adding equal groups together; a fast way to add the same number many times"},
      {"term": "Division", "definition": "Splitting a total into equal groups to find how many in each group"},
      {"term": "Array", "definition": "Objects arranged in equal rows and columns"},
      {"term": "Product", "definition": "The answer to a multiplication problem"},
      {"term": "Quotient", "definition": "The answer to a division problem"}]'::jsonb,
    'Equal sharing is a core principle in many Indigenous communities. At feasts and gatherings, food is divided equally among families. This practice connects directly to the mathematical concept of division.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N3.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is multiplication?', 'Adding equal groups together; a fast way to add the same number many times.', '3 x 4 means three groups of four.', 1, 0),
    (v_tenant, v_ch, 'What is an array?', 'Objects arranged in equal rows and columns.', 'Think of chairs set up in rows for an assembly.', 1, 1),
    (v_tenant, v_ch, '3 x 5 = ?', '15', 'Count by 5s three times: 5, 10, 15.', 1, 2),
    (v_tenant, v_ch, 'If 4 x 5 = 20, what is 20 / 4?', '5', 'Division is the opposite of multiplication.', 2, 3),
    (v_tenant, v_ch, 'What is the product of 5 x 5?', '25', '5 groups of 5: count by fives.', 1, 4);


  -- Chapter 4 — Introduction to Fractions (N3.4)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 4, 'Introduction to Fractions', 'introduction-to-fractions',
    'Understand fractions concretely and pictorially: representing, comparing, and relating to quantity.',
    '[
      {"type": "heading", "content": "Introduction to Fractions", "level": 1},
      {"type": "text", "content": "A fraction describes a part of a whole. When we cut something into equal parts and take some of those parts, we use a fraction to describe how much we have."},
      {"type": "heading", "content": "Parts of a Whole", "level": 2},
      {"type": "text", "content": "Imagine a pizza cut into 4 equal slices. If you eat 1 slice, you have eaten 1 out of 4 equal parts.\n\nWe write this as: 1/4 (one-fourth or one-quarter)\n\nThe bottom number (denominator) tells how many equal parts the whole is divided into.\nThe top number (numerator) tells how many parts you have."},
      {"type": "callout", "content": "The denominator is the total number of equal parts. The numerator is the number of parts you are talking about.", "style": "info"},
      {"type": "heading", "content": "Common Fractions", "level": 2},
      {"type": "text", "content": "1/2 — one-half: the whole is split into 2 equal parts, and you have 1.\n1/3 — one-third: the whole is split into 3 equal parts, and you have 1.\n1/4 — one-quarter: the whole is split into 4 equal parts, and you have 1.\n2/4 — two-quarters: the whole is split into 4 equal parts, and you have 2.\n3/4 — three-quarters: you have 3 out of 4 equal parts."},
      {"type": "heading", "content": "Fractions of a Set", "level": 2},
      {"type": "text", "content": "Fractions can also describe parts of a group.\n\nYou have 6 marbles. 2 are red, 4 are blue.\nFraction that is red: 2/6\nFraction that is blue: 4/6"},
      {"type": "heading", "content": "Comparing Fractions", "level": 2},
      {"type": "text", "content": "When comparing fractions with the same denominator:\n- The fraction with the bigger numerator is larger.\n- 3/4 > 1/4 because 3 parts is more than 1 part.\n\nWhen comparing fractions with the same numerator:\n- The fraction with the smaller denominator is larger.\n- 1/2 > 1/4 because halves are bigger pieces than quarters."},
      {"type": "callout", "content": "A bigger denominator means more pieces, which means each piece is smaller. Half a pizza is bigger than a quarter of the same pizza!", "style": "tip"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "A cake is cut into 3 equal pieces. You eat 1 piece. What fraction did you eat?", "options": ["1/2", "1/3", "1/4", "2/3"], "correct": 1, "explanation": "The cake is in 3 equal parts and you ate 1 part. That is 1/3."},
      {"type": "quiz", "question": "Which is larger: 1/2 or 1/4?", "options": ["1/2", "1/4", "They are the same"], "correct": 0, "explanation": "1/2 is larger because halves are bigger pieces than quarters."},
      {"type": "quiz", "question": "You have 8 stickers. 3 are stars. What fraction are stars?", "options": ["3/5", "5/8", "3/8", "8/3"], "correct": 2, "explanation": "3 out of 8 stickers are stars. The fraction is 3/8."}
    ]'::jsonb,
    '[{"term": "Fraction", "definition": "A number that describes a part of a whole or a part of a set"},
      {"term": "Numerator", "definition": "The top number in a fraction — tells how many parts you have"},
      {"term": "Denominator", "definition": "The bottom number in a fraction — tells how many equal parts the whole is divided into"},
      {"term": "Half", "definition": "One of two equal parts (1/2)"},
      {"term": "Quarter", "definition": "One of four equal parts (1/4)"}]'::jsonb,
    'Fractions are used in traditional food sharing. When a bannock is divided into equal pieces for a family, each person receives a fraction of the whole. Elders teach that fair sharing means equal parts for everyone.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N3.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a fraction?', 'A number that describes a part of a whole or a part of a set.', 'It uses a top number and a bottom number.', 1, 0),
    (v_tenant, v_ch, 'What does the denominator tell you?', 'How many equal parts the whole is divided into.', 'It is the bottom number.', 1, 1),
    (v_tenant, v_ch, 'What does the numerator tell you?', 'How many parts you have.', 'It is the top number.', 1, 2),
    (v_tenant, v_ch, 'Which is bigger: 1/3 or 1/2?', '1/2', 'Fewer pieces means each piece is bigger.', 2, 3),
    (v_tenant, v_ch, 'You eat 2 slices of a pizza cut into 8 slices. What fraction did you eat?', '2/8', '2 out of 8 equal slices.', 1, 4);


  -- ========================================================================
  -- UNIT 2: Patterns and Relations (P3.1, P3.2)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Patterns and Relations',
    'Increasing and decreasing patterns, and solving one-step equations involving an unknown.',
    'Patterns can grow or shrink, and we can use equations to find unknown values.',
    'How do patterns and equations help us solve problems with unknowns?')
  RETURNING id INTO v_unit;

  -- Chapter 5 — Increasing and Decreasing Patterns (P3.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 5, 'Increasing and Decreasing Patterns', 'increasing-and-decreasing-patterns',
    'Observe, describe, extend, compare, and create increasing and decreasing patterns.',
    '[
      {"type": "heading", "content": "Increasing and Decreasing Patterns", "level": 1},
      {"type": "text", "content": "You learned about increasing patterns in Grade 2. Now we add decreasing patterns — patterns where the numbers get smaller!"},
      {"type": "heading", "content": "Increasing Patterns Review", "level": 2},
      {"type": "text", "content": "An increasing pattern grows by the same amount each time.\n\nExample: 3, 6, 9, 12, 15, ... (increasing by 3)\nExample: 10, 20, 30, 40, 50, ... (increasing by 10)\nExample: 100, 200, 300, 400, ... (increasing by 100)"},
      {"type": "heading", "content": "Decreasing Patterns", "level": 2},
      {"type": "text", "content": "A decreasing pattern shrinks by the same amount each time.\n\nExample: 50, 45, 40, 35, 30, ... (decreasing by 5)\nExample: 100, 90, 80, 70, 60, ... (decreasing by 10)\nExample: 1000, 900, 800, 700, ... (decreasing by 100)"},
      {"type": "callout", "content": "To find the rule, look at the difference between two neighbours. In a decreasing pattern, each number is smaller than the one before it.", "style": "tip"},
      {"type": "heading", "content": "Comparing Patterns", "level": 2},
      {"type": "text", "content": "You can compare two patterns:\nPattern A: 5, 10, 15, 20, 25 (increases by 5)\nPattern B: 2, 4, 6, 8, 10 (increases by 2)\n\nPattern A grows faster because it adds 5 each time, while Pattern B only adds 2."},
      {"type": "heading", "content": "Creating Your Own Patterns", "level": 2},
      {"type": "text", "content": "To create a pattern:\n1. Choose a starting number.\n2. Choose a rule (add or subtract a number).\n3. Apply the rule at least 5 times.\n\nExample: Start at 80, subtract 7 each time.\n80, 73, 66, 59, 52, 45, ..."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is the rule for this pattern: 64, 56, 48, 40, 32?", "options": ["Add 8", "Subtract 8", "Add 4", "Subtract 4"], "correct": 1, "explanation": "Each number is 8 less than the one before it. The rule is subtract 8."},
      {"type": "quiz", "question": "What comes next: 25, 50, 75, 100, ___?", "options": ["110", "115", "120", "125"], "correct": 3, "explanation": "The pattern increases by 25 each time. 100 + 25 = 125."},
      {"type": "quiz", "question": "Which pattern is decreasing?", "options": ["5, 10, 15, 20", "100, 80, 60, 40", "3, 6, 9, 12", "1, 2, 4, 8"], "correct": 1, "explanation": "100, 80, 60, 40 decreases by 20 each time."}
    ]'::jsonb,
    '[{"term": "Increasing pattern", "definition": "A pattern where each number gets bigger by the same amount"},
      {"term": "Decreasing pattern", "definition": "A pattern where each number gets smaller by the same amount"},
      {"term": "Rule", "definition": "The operation that tells how the pattern changes each step"}]'::jsonb,
    'Seasonal changes observed by Indigenous peoples follow increasing and decreasing patterns — daylight hours increase toward summer and decrease toward winter. These observations were crucial for planning migrations, hunting, and planting.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'P3.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a decreasing pattern?', 'A pattern where each number gets smaller by the same amount.', 'The opposite of an increasing pattern.', 1, 0),
    (v_tenant, v_ch, 'What is the rule for: 90, 80, 70, 60?', 'Subtract 10', 'Each number is 10 less.', 1, 1),
    (v_tenant, v_ch, 'What comes next: 4, 8, 12, 16, ?', '20', 'Add 4 each time.', 1, 2),
    (v_tenant, v_ch, 'Create a decreasing pattern starting at 50, subtract 7.', '50, 43, 36, 29, 22, 15', 'Keep subtracting 7.', 2, 3);


  -- Chapter 6 — Solving Equations (P3.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 6, 'Solving Equations', 'solving-equations',
    'Solve one-step addition and subtraction equations using symbols to represent an unknown quantity.',
    '[
      {"type": "heading", "content": "Solving Equations", "level": 1},
      {"type": "text", "content": "An equation is a math sentence with an equal sign. Sometimes one of the numbers is missing! We use a symbol like a box (□), a question mark (?), or a letter to stand for the unknown number."},
      {"type": "heading", "content": "What Is an Unknown?", "level": 2},
      {"type": "text", "content": "An unknown is a number we need to find.\n\nExamples:\n- 5 + □ = 12 (What number plus 5 makes 12?)\n- □ - 7 = 8 (What number minus 7 gives 8?)\n- 14 = 6 + □ (6 plus what number makes 14?)"},
      {"type": "heading", "content": "Strategies to Solve", "level": 2},
      {"type": "text", "content": "Strategy 1: Think of the related fact.\n5 + □ = 12 → Think: 12 - 5 = 7, so □ = 7.\n\nStrategy 2: Count on.\n8 + □ = 15 → Start at 8, count up to 15: 9, 10, 11, 12, 13, 14, 15. That is 7 counts. So □ = 7.\n\nStrategy 3: Use objects or drawings.\nDraw 12 circles. Cross out 5. Count what is left: 7."},
      {"type": "callout", "content": "Always check your answer by putting the number back in. If 5 + 7 = 12, then □ = 7 is correct!", "style": "tip"},
      {"type": "heading", "content": "Equations with Subtraction", "level": 2},
      {"type": "text", "content": "□ - 9 = 6\nThink: What number minus 9 gives 6?\nRelated addition: 6 + 9 = 15\nSo □ = 15.\n\nCheck: 15 - 9 = 6. Correct!"},
      {"type": "callout", "content": "The symbol for the unknown can go anywhere in the equation — at the beginning, middle, or end. The strategy is always to find what number makes both sides equal.", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Solve: 7 + □ = 13", "options": ["4", "5", "6", "7"], "correct": 2, "explanation": "Think: 13 - 7 = 6. So □ = 6. Check: 7 + 6 = 13."},
      {"type": "quiz", "question": "Solve: □ - 8 = 12", "options": ["4", "16", "20", "24"], "correct": 2, "explanation": "Think: 12 + 8 = 20. So □ = 20. Check: 20 - 8 = 12."},
      {"type": "quiz", "question": "Solve: 25 = □ + 9", "options": ["14", "15", "16", "34"], "correct": 2, "explanation": "Think: 25 - 9 = 16. So □ = 16. Check: 16 + 9 = 25."}
    ]'::jsonb,
    '[{"term": "Equation", "definition": "A math sentence that shows two things are equal, using an equal sign"},
      {"term": "Unknown", "definition": "A number we do not know yet, shown by a symbol like □ or ?"},
      {"term": "Solve", "definition": "To find the value of the unknown that makes the equation true"},
      {"term": "Symbol", "definition": "A mark or shape used to stand for something, like □ for an unknown number"}]'::jsonb,
    'Problem-solving with unknowns mirrors how Indigenous peoples approach practical challenges. When planning a hunt, one might ask: we need 20 fish and have caught 12 — how many more do we need? This is an equation in action.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'P3.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is an equation?', 'A math sentence that uses an equal sign to show two things are equal.', '5 + 3 = 8 is an equation.', 1, 0),
    (v_tenant, v_ch, 'What is an unknown?', 'A number we need to find, shown by a symbol like □.', 'The mystery number!', 1, 1),
    (v_tenant, v_ch, 'Solve: 9 + □ = 17', '□ = 8', 'Think: 17 - 9 = ?', 2, 2),
    (v_tenant, v_ch, 'Solve: □ - 5 = 11', '□ = 16', 'Think: 11 + 5 = ?', 2, 3);


  -- ========================================================================
  -- UNIT 3: Shape and Space (SS3.1 – SS3.5)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Shape and Space',
    'Time, mass in grams and kilograms, linear measurement in centimetres and metres, perimeter, and properties of 2-D and 3-D shapes.',
    'Standard units of measurement allow us to communicate precisely, and geometric properties help us classify shapes.',
    'How do standard measurements and geometric properties help us describe our world precisely?')
  RETURNING id INTO v_unit;

  -- Chapter 7 — Telling Time (SS3.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 7, 'Telling Time', 'telling-time',
    'Understand the passage of time using standard and non-standard units, and solve problems involving time.',
    '[
      {"type": "heading", "content": "Telling Time", "level": 1},
      {"type": "text", "content": "Time helps us plan our day and know when things happen. We measure time using units like seconds, minutes, hours, days, weeks, months, and years."},
      {"type": "heading", "content": "Units of Time", "level": 2},
      {"type": "text", "content": "Relationships between time units:\n- 60 seconds = 1 minute\n- 60 minutes = 1 hour\n- 24 hours = 1 day\n- 7 days = 1 week\n- 12 months = 1 year\n- 365 days = 1 year (usually)"},
      {"type": "heading", "content": "How Long Does It Take?", "level": 2},
      {"type": "text", "content": "Relating activities to time units:\n- Clapping your hands once: about 1 second\n- Brushing your teeth: about 2 minutes\n- Eating lunch: about 20-30 minutes\n- A school day: about 6 hours\n- A weekend: 2 days"},
      {"type": "callout", "content": "Choose the right unit of time for what you are measuring. Use seconds for very short events, minutes for activities, and hours for longer periods.", "style": "tip"},
      {"type": "heading", "content": "Reading a Clock", "level": 2},
      {"type": "text", "content": "An analog clock has:\n- A short hand that points to the hour\n- A long hand that points to the minutes\n\nWhen the long hand is on 12, it is exactly on the hour (like 3:00).\nWhen the long hand is on 6, it is half past the hour (like 3:30).\nWhen the long hand is on 3, it is quarter past (like 3:15).\nWhen the long hand is on 9, it is quarter to the next hour (like 3:45 or quarter to 4)."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "How many minutes are in 1 hour?", "options": ["30", "60", "100", "24"], "correct": 1, "explanation": "There are 60 minutes in 1 hour."},
      {"type": "quiz", "question": "Which unit of time would you use to measure how long it takes to sing a song?", "options": ["Seconds", "Minutes", "Hours", "Days"], "correct": 1, "explanation": "A song takes a few minutes, so minutes is the best unit."},
      {"type": "quiz", "question": "How many days are in 2 weeks?", "options": ["7", "12", "14", "21"], "correct": 2, "explanation": "1 week = 7 days, so 2 weeks = 14 days."}
    ]'::jsonb,
    '[{"term": "Second", "definition": "A very short unit of time; 60 seconds make 1 minute"},
      {"term": "Minute", "definition": "A unit of time; 60 minutes make 1 hour"},
      {"term": "Hour", "definition": "A unit of time; 24 hours make 1 day"},
      {"term": "Analog clock", "definition": "A clock with a face, numbers, and two hands that point to the time"}]'::jsonb,
    'Indigenous peoples have long measured time by observing natural cycles — the rising and setting of the sun, the phases of the moon, and the changing of seasons. The Cree calendar is based on the 13 moons of the year.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS3.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'How many minutes are in 1 hour?', '60 minutes.', 'The long hand goes all the way around the clock.', 1, 0),
    (v_tenant, v_ch, 'How many days are in 1 week?', '7 days.', 'Sunday through Saturday.', 1, 1),
    (v_tenant, v_ch, 'How many hours are in 1 day?', '24 hours.', 'Day and night together.', 1, 2);


  -- Chapter 8 — Measuring Mass in Grams and Kilograms (SS3.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 8, 'Measuring Mass: Grams and Kilograms', 'measuring-mass-grams-kilograms',
    'Measure mass using standard units (g and kg), select referents, and estimate.',
    '[
      {"type": "heading", "content": "Measuring Mass: Grams and Kilograms", "level": 1},
      {"type": "text", "content": "In Grade 2, you measured mass with non-standard units. Now we use standard units: grams (g) and kilograms (kg). These units are the same everywhere in the world!"},
      {"type": "heading", "content": "Grams and Kilograms", "level": 2},
      {"type": "text", "content": "A gram (g) is a small unit of mass. A paperclip has a mass of about 1 gram.\n\nA kilogram (kg) is a bigger unit. A litre bottle of water has a mass of about 1 kilogram.\n\n1 kilogram = 1000 grams\n\nUse grams for light objects and kilograms for heavy objects."},
      {"type": "callout", "content": "Referents help you estimate! A paperclip is about 1 g. A textbook is about 1 kg. Hold a referent, then hold the object to estimate its mass.", "style": "tip"},
      {"type": "heading", "content": "Choosing the Right Unit", "level": 2},
      {"type": "text", "content": "Use grams (g) for:\n- A pencil (about 10 g)\n- An apple (about 200 g)\n- A slice of bread (about 30 g)\n\nUse kilograms (kg) for:\n- A bag of flour (about 2 kg)\n- A cat (about 4 kg)\n- A suitcase (about 15 kg)"},
      {"type": "heading", "content": "Measuring with a Scale", "level": 2},
      {"type": "text", "content": "To measure mass accurately, we use a scale (not a balance — a scale gives a number). Place the object on the scale and read the number.\n\nRemember to check whether the scale shows grams or kilograms!"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "How many grams are in 1 kilogram?", "options": ["10", "100", "1000", "10000"], "correct": 2, "explanation": "1 kilogram = 1000 grams. Kilo means thousand!"},
      {"type": "quiz", "question": "Would you measure the mass of a feather in grams or kilograms?", "options": ["Grams", "Kilograms"], "correct": 0, "explanation": "A feather is very light, so grams is the right unit."},
      {"type": "quiz", "question": "About how much does a large watermelon weigh?", "options": ["5 grams", "50 grams", "5 kilograms", "50 kilograms"], "correct": 2, "explanation": "A large watermelon has a mass of about 5 kilograms."}
    ]'::jsonb,
    '[{"term": "Gram (g)", "definition": "A small standard unit of mass; a paperclip is about 1 gram"},
      {"term": "Kilogram (kg)", "definition": "A larger standard unit of mass; 1 kg = 1000 g"},
      {"term": "Scale", "definition": "A tool that measures mass and shows a number"},
      {"term": "Referent", "definition": "A familiar object used to help estimate a measurement"}]'::jsonb,
    'Understanding mass is important in traditional food preparation. Making bannock or pemmican requires knowing the right amounts of ingredients, connecting measurement to cultural food practices.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS3.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'How many grams are in 1 kilogram?', '1000 grams.', 'Kilo means thousand.', 1, 0),
    (v_tenant, v_ch, 'What is a good referent for 1 gram?', 'A paperclip.', 'Something very light.', 1, 1),
    (v_tenant, v_ch, 'Would you measure a dog in grams or kilograms?', 'Kilograms.', 'A dog is heavy.', 1, 2);


  -- Chapter 9 — Measuring Length and Perimeter (SS3.3)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 9, 'Measuring Length and Perimeter', 'measuring-length-and-perimeter',
    'Measure length in centimetres and metres, and calculate perimeter.',
    '[
      {"type": "heading", "content": "Measuring Length and Perimeter", "level": 1},
      {"type": "text", "content": "Standard units for length are centimetres (cm) and metres (m). Using standard units means everyone gets the same measurement!"},
      {"type": "heading", "content": "Centimetres and Metres", "level": 2},
      {"type": "text", "content": "A centimetre (cm) is a small unit. Your fingernail is about 1 cm wide.\n\nA metre (m) is a bigger unit. A doorway is about 1 metre wide.\n\n1 metre = 100 centimetres\n\nUse centimetres for small objects and metres for large distances."},
      {"type": "heading", "content": "Using a Ruler", "level": 2},
      {"type": "text", "content": "To measure with a ruler:\n1. Line up the object with the 0 mark.\n2. Read the number at the other end of the object.\n3. That number is the length in centimetres.\n\nFor larger objects, use a metre stick or measuring tape."},
      {"type": "callout", "content": "Always start at 0! If you start at 1, your measurement will be 1 cm too short.", "style": "tip"},
      {"type": "heading", "content": "Perimeter", "level": 2},
      {"type": "text", "content": "Perimeter is the total distance around a shape. To find the perimeter, add up all the side lengths.\n\nExample: A rectangle with sides 5 cm, 3 cm, 5 cm, and 3 cm.\nPerimeter = 5 + 3 + 5 + 3 = 16 cm\n\nFor a square with sides of 4 cm:\nPerimeter = 4 + 4 + 4 + 4 = 16 cm"},
      {"type": "callout", "content": "Perimeter is like walking all the way around the edge of a shape and measuring how far you walked.", "style": "info"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "How many centimetres are in 1 metre?", "options": ["10", "50", "100", "1000"], "correct": 2, "explanation": "1 metre = 100 centimetres."},
      {"type": "quiz", "question": "A triangle has sides of 6 cm, 8 cm, and 10 cm. What is its perimeter?", "options": ["14 cm", "18 cm", "24 cm", "48 cm"], "correct": 2, "explanation": "Perimeter = 6 + 8 + 10 = 24 cm. Add all the sides!"},
      {"type": "quiz", "question": "Would you measure the length of a gymnasium in centimetres or metres?", "options": ["Centimetres", "Metres"], "correct": 1, "explanation": "A gymnasium is large, so metres is the better unit."}
    ]'::jsonb,
    '[{"term": "Centimetre (cm)", "definition": "A small standard unit of length; a fingernail is about 1 cm wide"},
      {"term": "Metre (m)", "definition": "A standard unit of length; 1 m = 100 cm"},
      {"term": "Perimeter", "definition": "The total distance around the outside of a shape"},
      {"term": "Ruler", "definition": "A straight measuring tool marked in centimetres"}]'::jsonb,
    'Linear measurement has practical uses in Indigenous building. Constructing a tipi requires precise lengths of poles and hide, and traditional foot races are measured over known distances across the prairie.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS3.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'How many centimetres are in 1 metre?', '100', 'Centi means hundredth.', 1, 0),
    (v_tenant, v_ch, 'What is perimeter?', 'The total distance around the outside of a shape.', 'Walk around the shape and add up all the sides.', 1, 1),
    (v_tenant, v_ch, 'A square has sides of 7 cm. What is its perimeter?', '28 cm', '4 sides of 7 cm: 7 + 7 + 7 + 7 = 28.', 2, 2),
    (v_tenant, v_ch, 'What is a good referent for 1 centimetre?', 'The width of your fingernail.', 'Something very small.', 1, 3);


  -- Chapter 10 — 3-D Objects: Faces, Edges, and Vertices (SS3.4)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 10, '3-D Objects: Faces, Edges, and Vertices', '3d-objects-faces-edges-vertices',
    'Analyze 3-D objects by identifying and counting faces, edges, and vertices.',
    '[
      {"type": "heading", "content": "3-D Objects: Faces, Edges, and Vertices", "level": 1},
      {"type": "text", "content": "In Grade 3, we take a closer look at 3-D objects. We will count and describe their faces, edges, and vertices to understand what makes each shape unique."},
      {"type": "heading", "content": "Reviewing Key Terms", "level": 2},
      {"type": "text", "content": "Face: A flat surface on a 3-D object.\nEdge: A line where two faces meet.\nVertex (plural: vertices): A corner point where edges come together."},
      {"type": "heading", "content": "Analyzing Common 3-D Objects", "level": 2},
      {"type": "text", "content": "Cube:\n- 6 faces (all squares)\n- 12 edges\n- 8 vertices\n\nRectangular prism (like a cereal box):\n- 6 faces (rectangles)\n- 12 edges\n- 8 vertices\n\nTriangular prism (like a tent shape):\n- 5 faces (2 triangles + 3 rectangles)\n- 9 edges\n- 6 vertices\n\nSquare pyramid:\n- 5 faces (1 square + 4 triangles)\n- 8 edges\n- 5 vertices\n\nCylinder:\n- 2 flat faces (circles) + 1 curved surface\n- 0 straight edges (2 curved edges)\n- 0 vertices\n\nSphere:\n- 0 faces, 0 edges, 0 vertices (all curved)"},
      {"type": "callout", "content": "A quick way to check: for many prisms and pyramids, Euler's observation is that faces + vertices = edges + 2.", "style": "info"},
      {"type": "heading", "content": "Skeleton Models", "level": 2},
      {"type": "text", "content": "You can build skeleton models using toothpicks (for edges) and small balls of clay (for vertices). This helps you count edges and vertices easily.\n\nA cube skeleton has 12 toothpicks and 8 clay balls."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "How many edges does a cube have?", "options": ["6", "8", "10", "12"], "correct": 3, "explanation": "A cube has 12 edges — 4 on the top, 4 on the bottom, and 4 connecting top to bottom."},
      {"type": "quiz", "question": "How many faces does a triangular prism have?", "options": ["3", "4", "5", "6"], "correct": 2, "explanation": "A triangular prism has 5 faces: 2 triangle faces and 3 rectangle faces."},
      {"type": "quiz", "question": "A sphere has how many vertices?", "options": ["0", "1", "2", "Infinite"], "correct": 0, "explanation": "A sphere is completely curved. It has 0 vertices, 0 edges, and 0 flat faces."}
    ]'::jsonb,
    '[{"term": "Face", "definition": "A flat surface on a 3-D object"},
      {"term": "Edge", "definition": "The line where two faces of a 3-D object meet"},
      {"term": "Vertex", "definition": "A corner point where two or more edges meet"},
      {"term": "Prism", "definition": "A 3-D object with two identical parallel faces connected by rectangles"},
      {"term": "Pyramid", "definition": "A 3-D object with a base and triangle faces meeting at a single top vertex"}]'::jsonb,
    'Traditional Indigenous structures demonstrate knowledge of 3-D geometry. Sweat lodges are dome-shaped, tipis are cone-shaped, and storage caches use rectangular prism forms — each designed for a specific purpose.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS3.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'How many faces does a cube have?', '6', 'Top, bottom, front, back, left, right.', 1, 0),
    (v_tenant, v_ch, 'How many edges does a rectangular prism have?', '12', 'Same as a cube!', 2, 1),
    (v_tenant, v_ch, 'What is a prism?', 'A 3-D object with two identical parallel faces connected by rectangles.', 'Think of a toblerone box or a tent.', 2, 2),
    (v_tenant, v_ch, 'How many vertices does a square pyramid have?', '5', '4 corners on the base plus 1 at the top.', 2, 3);


  -- Chapter 11 — 2-D Shapes: Regular and Irregular (SS3.5)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 11, '2-D Shapes: Regular and Irregular', '2d-shapes-regular-irregular',
    'Describe, compare, and sort 2-D shapes including triangles, quadrilaterals, pentagons, hexagons, and octagons.',
    '[
      {"type": "heading", "content": "2-D Shapes: Regular and Irregular", "level": 1},
      {"type": "text", "content": "In Grade 3, we learn about more 2-D shapes and discover the difference between regular and irregular shapes."},
      {"type": "heading", "content": "Shapes by Number of Sides", "level": 2},
      {"type": "text", "content": "Shapes are named by the number of sides they have:\n- Triangle: 3 sides\n- Quadrilateral: 4 sides (includes squares, rectangles, and other 4-sided shapes)\n- Pentagon: 5 sides\n- Hexagon: 6 sides\n- Octagon: 8 sides"},
      {"type": "heading", "content": "Regular vs. Irregular", "level": 2},
      {"type": "text", "content": "A regular shape has all sides equal and all angles equal.\nAn irregular shape has sides or angles that are not all equal.\n\nExamples:\n- A square is a regular quadrilateral (all sides equal, all angles equal).\n- A rectangle with two long and two short sides is an irregular quadrilateral (sides not all equal).\n- A stop sign is a regular octagon (all 8 sides are equal)."},
      {"type": "callout", "content": "The prefix tells you the number of sides: tri = 3, quad = 4, penta = 5, hexa = 6, octa = 8.", "style": "info"},
      {"type": "heading", "content": "Sorting Shapes", "level": 2},
      {"type": "text", "content": "You can sort shapes by:\n- Number of sides\n- Regular vs. irregular\n- Size of the shape\n- Whether it has right angles"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "How many sides does a hexagon have?", "options": ["5", "6", "7", "8"], "correct": 1, "explanation": "A hexagon has 6 sides. Hexa means six."},
      {"type": "quiz", "question": "A stop sign is what shape?", "options": ["Pentagon", "Hexagon", "Heptagon", "Octagon"], "correct": 3, "explanation": "A stop sign is an octagon — it has 8 sides."},
      {"type": "quiz", "question": "A triangle has all three sides the same length. Is it regular or irregular?", "options": ["Regular", "Irregular"], "correct": 0, "explanation": "All sides are equal and all angles are equal, so it is a regular triangle (also called equilateral)."}
    ]'::jsonb,
    '[{"term": "Quadrilateral", "definition": "Any shape with 4 sides"},
      {"term": "Pentagon", "definition": "A shape with 5 sides"},
      {"term": "Hexagon", "definition": "A shape with 6 sides"},
      {"term": "Octagon", "definition": "A shape with 8 sides"},
      {"term": "Regular shape", "definition": "A shape where all sides are equal and all angles are equal"},
      {"term": "Irregular shape", "definition": "A shape where sides or angles are not all equal"}]'::jsonb,
    'Geometric shapes appear throughout Indigenous art and architecture. The hexagonal patterns in turtle shells hold cultural significance for many First Nations. The octagonal shape of certain drum frames reflects geometric knowledge.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS3.5';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'How many sides does a pentagon have?', '5', 'Penta means five.', 1, 0),
    (v_tenant, v_ch, 'What is the difference between regular and irregular shapes?', 'Regular shapes have all sides and angles equal. Irregular shapes do not.', 'A square is regular. A rectangle is irregular.', 2, 1),
    (v_tenant, v_ch, 'What is a quadrilateral?', 'Any shape with 4 sides.', 'Quad means four.', 1, 2),
    (v_tenant, v_ch, 'How many sides does an octagon have?', '8', 'Think of a stop sign.', 1, 3);


  -- ========================================================================
  -- UNIT 4: Statistics and Probability (SP3.1)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Statistics and Probability',
    'Collecting, organizing, and representing first-hand data using tally marks, charts, bar graphs, and line plots.',
    'Organizing and displaying data helps us answer questions and see patterns in information.',
    'How can we collect, organize, and display data to answer questions?')
  RETURNING id INTO v_unit;

  -- Chapter 12 — Collecting and Displaying Data (SP3.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 12, 'Collecting and Displaying Data', 'collecting-and-displaying-data',
    'Collect first-hand data and represent it using tally marks, charts, lists, bar graphs, and line plots.',
    '[
      {"type": "heading", "content": "Collecting and Displaying Data", "level": 1},
      {"type": "text", "content": "Data helps us answer questions. In Grade 3, we learn to collect data ourselves and show it using several types of graphs and charts."},
      {"type": "heading", "content": "First-Hand Data", "level": 2},
      {"type": "text", "content": "First-hand data is information you collect yourself by:\n- Asking people questions (surveys)\n- Measuring or counting things\n- Observing and recording what you see\n\nExample: Survey your class about favourite sports. Record the answers."},
      {"type": "heading", "content": "Tally Charts", "level": 2},
      {"type": "text", "content": "A tally chart organizes data using tally marks.\n\nSport      Tally        Count\nHockey    |||| |||      8\nSoccer    |||| ||       7\nBaseball  ||||          5\nSkating   |||           3\n\nRemember: every 5th tally mark crosses the other four."},
      {"type": "heading", "content": "Bar Graphs", "level": 2},
      {"type": "text", "content": "A bar graph uses bars to show data. Each bar represents a category.\n\nEvery bar graph needs:\n- A title\n- Labels for each axis (categories and numbers)\n- A scale (the numbers go up by a consistent amount)\n- Bars of equal width\n\nThe taller the bar, the bigger the number."},
      {"type": "callout", "content": "The scale on a bar graph does not always go by 1s. It might go by 2s, 5s, or 10s. Read the scale carefully!", "style": "tip"},
      {"type": "heading", "content": "Line Plots", "level": 2},
      {"type": "text", "content": "A line plot uses Xs (or dots) above a number line to show data.\n\nExample: Lengths of pencils in cm\n    X\n    X   X\nX   X   X   X\n12  13  14  15  16\n\nEach X represents one pencil. You can quickly see which length is most common."},
      {"type": "heading", "content": "Answering Questions from Data", "level": 2},
      {"type": "text", "content": "When you look at data in a graph, you can answer:\n- Which category has the most? (tallest bar)\n- Which has the least? (shortest bar)\n- How many in total? (add all bars)\n- How many more does one have than another? (subtract)"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "In a bar graph, hockey has 8, soccer has 7, baseball has 5. How many students were surveyed for these three sports?", "options": ["15", "18", "20", "22"], "correct": 2, "explanation": "Add all three: 8 + 7 + 5 = 20 students."},
      {"type": "quiz", "question": "What kind of graph uses Xs above a number line?", "options": ["Bar graph", "Pictograph", "Line plot", "Pie chart"], "correct": 2, "explanation": "A line plot uses Xs or dots above a number line to show data."},
      {"type": "quiz", "question": "Why is first-hand data important?", "options": ["It comes from a book", "You collect it yourself so you can trust it", "Someone else gives it to you", "It is always about numbers"], "correct": 1, "explanation": "First-hand data is data you collect yourself, so you know exactly how it was gathered."}
    ]'::jsonb,
    '[{"term": "First-hand data", "definition": "Data you collect yourself through surveys, observations, or measurements"},
      {"term": "Tally chart", "definition": "A chart that uses tally marks to organize and count data"},
      {"term": "Bar graph", "definition": "A graph that uses bars of different heights to compare data"},
      {"term": "Line plot", "definition": "A graph that uses Xs or dots above a number line to show data"},
      {"term": "Scale", "definition": "The set of numbers on a graph axis that tells the value of each mark"}]'::jsonb,
    'Recording and organizing information has a long history in Indigenous cultures. Winter counts — pictographic calendars painted on buffalo hide — record important events year by year, representing data visually.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SP3.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is first-hand data?', 'Data you collect yourself through surveys, observations, or measurements.', 'You gather it, not someone else.', 1, 0),
    (v_tenant, v_ch, 'What does a bar graph use to show data?', 'Bars of different heights.', 'Taller bar = bigger number.', 1, 1),
    (v_tenant, v_ch, 'What is a line plot?', 'A graph that uses Xs or dots above a number line.', 'Each X stands for one piece of data.', 1, 2),
    (v_tenant, v_ch, 'What is the scale on a graph?', 'The set of numbers on the axis that tells the value of each mark.', 'It might count by 1s, 2s, 5s, or 10s.', 2, 3),
    (v_tenant, v_ch, 'How do you find the total from a bar graph?', 'Add together all the bar values.', 'Read each bar and add them up.', 1, 4);

  RAISE NOTICE 'Grade 3 content seeded successfully.';
END $$;
