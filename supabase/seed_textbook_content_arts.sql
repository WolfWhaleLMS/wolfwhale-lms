-- ============================================================================
-- WolfWhale Arts Education Textbook Content Seed Data
-- Grades K through 9 (Saskatchewan Curriculum)
--
-- 10 Textbooks:
--   wolfwhale-arts-k through wolfwhale-arts-9
--
-- Each textbook contains 4 chapters covering:
--   Visual Art, Music, Drama, Dance
--
-- All content is 100% original. No copied material from any publisher.
-- tenant_id uses placeholder UUID: 00000000-0000-0000-0000-000000000001
-- ============================================================================


-- ============================================================================
-- TEXTBOOK: WolfWhale Arts K
-- Slug: wolfwhale-arts-k
-- Chapters: Drawing & Painting | Singing & Rhythm | Dramatic Play | Creative Movement
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-arts-k';

  -- ==============================
  -- UNIT 1: Visual Art
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Visual Art',
    'Explore drawing and painting as ways to express ideas, feelings, and observations about the world.',
    'Making marks and mixing colours is a way to share what we see, feel, and imagine.',
    'How can I use lines and colours to show something about my world?')
  RETURNING id INTO v_unit;

  -- Chapter 1: Drawing & Painting
  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Drawing & Painting', 'drawing-and-painting-k',
    'Discover how lines, shapes, and colours help us create pictures that tell stories and share feelings.',
    '[
      {"type": "heading", "level": 1, "text": "Drawing & Painting"},
      {"type": "text", "content": "When you pick up a crayon or a paintbrush, you are an artist. Artists use lines, shapes, and colours to make pictures. A line can be straight, curvy, zigzag, or wiggly. You can draw a thin line or a thick line. Lines can go up, down, or sideways. When lines close up and make an enclosed space, they form a shape."},
      {"type": "text", "content": "Colours are everywhere. The sky is blue. Grass is green. Sunflowers are yellow. Artists call red, yellow, and blue the primary colours. When you mix two primary colours together, you get a new colour called a secondary colour. Mixing red and yellow makes orange. Mixing blue and yellow makes green. Mixing red and blue makes purple."},
      {"type": "callout", "style": "info", "title": "Primary Colours", "content": "The three primary colours are red, yellow, and blue. You cannot make these colours by mixing other colours together. All other colours are made from these three."},
      {"type": "text", "content": "When you paint, you can use a wide brush to fill big spaces and a thin brush for tiny details. Pressing hard with a crayon makes a dark, bold line. Pressing lightly makes a pale, soft line. Try both and see which one you like best. There is no wrong way to make a picture that is yours."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Earth Pigments", "content": "First Nations artists in Saskatchewan have used natural earth pigments for thousands of years. Red and yellow ochre, ground from soft iron-rich rock, were mixed with animal fat or water to create paints used on rock faces, hides, and ceremonial objects. These natural paints connected art-making to the land itself."},
      {"type": "list", "style": "unordered", "items": ["Lines can be straight, curvy, zigzag, or wiggly", "Shapes are made when lines close up", "Primary colours are red, yellow, and blue", "Mixing primary colours creates secondary colours"]},
      {"type": "quiz", "question": "What do you get when you mix blue and yellow paint together?", "options": ["Orange", "Purple", "Green", "Brown"], "correctIndex": 2, "explanation": "Blue and yellow are both primary colours. When you mix them together they make green, which is a secondary colour."}
    ]'::jsonb,
    '[
      {"term": "Line", "definition": "A mark made by moving a pencil, crayon, or brush from one point to another."},
      {"term": "Shape", "definition": "A closed area made when a line meets itself, such as a circle, square, or triangle."},
      {"term": "Primary Colours", "definition": "The three colours red, yellow, and blue, from which all other colours can be mixed."},
      {"term": "Secondary Colours", "definition": "Colours made by mixing two primary colours: orange, green, and purple."},
      {"term": "Brushstroke", "definition": "A single movement of a paintbrush that leaves paint on the surface."}
    ]'::jsonb,
    'First Nations artists across Saskatchewan have long used natural earth pigments — including red and yellow ochre ground from iron-rich rock — to create paints applied to rock, hide, and ceremonial objects. This tradition connects art-making directly to careful observation of the land.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are the three primary colours?', 'Red, yellow, and blue.', 'You cannot make these by mixing other colours.', 1, 0),
    (v_tenant, v_ch, 'What secondary colour does mixing red and yellow make?', 'Orange.', 'Think of the colour of a ripe pumpkin.', 1, 1),
    (v_tenant, v_ch, 'What is a shape?', 'A closed area formed when a line meets itself.', 'Think of a circle or a square.', 1, 2);

  -- ==============================
  -- UNIT 2: Music
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Music',
    'Explore singing and rhythm as natural ways to communicate, celebrate, and connect with others.',
    'Our voices and bodies are musical instruments we carry with us everywhere.',
    'How can singing and clapping help me share feelings and connect with others?')
  RETURNING id INTO v_unit;

  -- Chapter 2: Singing & Rhythm
  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Singing & Rhythm', 'singing-and-rhythm-k',
    'Discover how your voice makes sound and how steady beats and patterns make music feel alive.',
    '[
      {"type": "heading", "level": 1, "text": "Singing & Rhythm"},
      {"type": "text", "content": "Your voice is a musical instrument. When you hum, sing, or speak, air moves through your throat and makes it vibrate. That vibration creates sound. A high sound is called a high pitch, like a bird singing. A low sound is called a low pitch, like a big drum. You can make your voice go high and low when you sing."},
      {"type": "text", "content": "Music also has a beat. The beat is a steady pulse, like a clock ticking or your heart beating. You can feel the beat by clapping your hands or tapping your foot. When you clap along to a song, you are keeping the beat. Some beats feel slow and calm. Others feel fast and exciting."},
      {"type": "callout", "style": "info", "title": "Beat and Rhythm", "content": "The beat is the steady, even pulse underneath music. Rhythm is the pattern of short and long sounds that moves on top of the beat. Think of the beat as footsteps walking and the rhythm as the words you say while walking."},
      {"type": "text", "content": "A song also has a melody. The melody is the tune you sing, the part you remember and hum later. Songs can be happy, sad, silly, or peaceful. The words of a song are called lyrics. When you sing a song with your class, everyone''s voices work together to make one big sound."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Drum Circles", "content": "The hand drum holds a central place in many First Nations and Metis communities across Saskatchewan. Drummers keep a steady heartbeat rhythm while singers raise their voices together. The drum is considered a living instrument, and drum songs carry teachings, prayers, and community memory. Many nations, including the Cree and Nakoda, have specific drum songs for ceremonies, celebrations, and seasons."},
      {"type": "list", "style": "unordered", "items": ["Your voice makes sound when air vibrates in your throat", "Pitch describes how high or low a sound is", "The beat is the steady pulse in music", "The melody is the tune of a song", "Lyrics are the words of a song"]},
      {"type": "quiz", "question": "What is the steady pulse in music called?", "options": ["Melody", "Lyrics", "Beat", "Pitch"], "correctIndex": 2, "explanation": "The beat is the steady, even pulse that keeps music moving forward, like a heartbeat or a clock ticking."}
    ]'::jsonb,
    '[
      {"term": "Pitch", "definition": "How high or low a sound is."},
      {"term": "Beat", "definition": "The steady, even pulse that runs through a piece of music."},
      {"term": "Rhythm", "definition": "A pattern of long and short sounds that moves on top of the beat."},
      {"term": "Melody", "definition": "The tune of a song — the sequence of pitches you sing or play."},
      {"term": "Lyrics", "definition": "The words of a song."}
    ]'::jsonb,
    'The hand drum is central to many First Nations and Metis musical traditions in Saskatchewan. Drummers keep a steady heartbeat rhythm while singers join their voices together. Drum songs carry teachings, prayers, and community memory, and are performed for ceremonies, celebrations, and seasonal gatherings by nations including the Cree and Nakoda.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is pitch?', 'How high or low a sound is.', 'A bird has a high pitch; a big drum has a low pitch.', 1, 0),
    (v_tenant, v_ch, 'What is the difference between beat and rhythm?', 'The beat is the steady pulse; rhythm is the pattern of long and short sounds on top of the beat.', 'Beat = steady footsteps; rhythm = the words you say.', 1, 1),
    (v_tenant, v_ch, 'What are the words of a song called?', 'Lyrics.', 'You read them when following along with a song.', 1, 2);

  -- ==============================
  -- UNIT 3: Drama
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Drama',
    'Use dramatic play to explore characters, stories, and emotions through imagination and role-playing.',
    'Pretending to be someone else helps us understand different feelings and points of view.',
    'How can I use my voice, face, and body to become a character in a story?')
  RETURNING id INTO v_unit;

  -- Chapter 3: Dramatic Play
  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Dramatic Play', 'dramatic-play-k',
    'Explore imagination and storytelling by becoming characters and acting out simple stories.',
    '[
      {"type": "heading", "level": 1, "text": "Dramatic Play"},
      {"type": "text", "content": "Have you ever pretended to be a superhero, an animal, or a chef in your kitchen? That is dramatic play! When you use your imagination to become someone or something else, you are acting. Actors use their face, voice, and body to tell stories and show feelings."},
      {"type": "text", "content": "Your face can show many feelings without saying a single word. Try smiling wide to show happiness. Try lowering your eyebrows and frowning to show sadness or worry. Try opening your eyes really wide to show surprise. These facial expressions are called emotions. In drama, showing your emotions clearly helps the audience understand the story."},
      {"type": "callout", "style": "info", "title": "Character", "content": "A character is a person, animal, or creature in a story. When you play a character, you think about how that character moves, speaks, and feels. A tiny mouse moves differently from a giant bear."},
      {"type": "text", "content": "Your voice is also a drama tool. You can speak loudly or softly, quickly or slowly, in a high voice or a deep voice. You can pause to make a moment feel important. When you play a character, try changing your voice to match who that character is."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Oral Storytelling", "content": "Storytelling is one of the oldest and most important art forms in First Nations cultures across Saskatchewan. Elders share stories that teach about the natural world, community values, and the history of their people. These stories come alive through voice, gesture, and expression — the same tools young drama students use. Nations such as the Cree use storytelling during winter months when stories of Wisahkecahk and other sacred figures carry important teachings."},
      {"type": "list", "style": "unordered", "items": ["Actors use face, voice, and body to tell stories", "Facial expressions show emotions", "Changing your voice helps bring a character to life", "A character is a person, animal, or creature in a story"]},
      {"type": "quiz", "question": "In drama, what are facial expressions that show feelings called?", "options": ["Characters", "Emotions", "Lyrics", "Beats"], "correctIndex": 1, "explanation": "Emotions are the feelings we show on our faces and in our bodies. In drama, showing emotions clearly helps the audience follow the story."}
    ]'::jsonb,
    '[
      {"term": "Character", "definition": "A person, animal, or creature that appears in a story or play."},
      {"term": "Emotion", "definition": "A feeling such as happiness, sadness, surprise, or fear, shown through facial expression and body language."},
      {"term": "Actor", "definition": "A person who performs a role in a play, film, or story."},
      {"term": "Audience", "definition": "The people who watch or listen to a performance."},
      {"term": "Dramatic Play", "definition": "Imaginative play in which children take on roles and act out stories or scenarios."}
    ]'::jsonb,
    'Oral storytelling is one of the oldest and most vital art forms in First Nations cultures across Saskatchewan. Elders share stories using voice, gesture, and expression to teach about the natural world, community values, and history. Cree storytelling traditions, including tales of the trickster figure Wisahkecahk, use the same dramatic tools — voice, body, and emotion — that young drama students practice.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What three tools do actors use to bring a character to life?', 'Their face, voice, and body.', 'Think about what you can control when performing.', 1, 0),
    (v_tenant, v_ch, 'What is a character?', 'A person, animal, or creature in a story or play.', 'Think of your favourite storybook.', 1, 1),
    (v_tenant, v_ch, 'What is an audience?', 'The people who watch or listen to a performance.', 'They sit and observe the actors.', 1, 2);

  -- ==============================
  -- UNIT 4: Dance
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Dance',
    'Explore creative movement as a way to express ideas, emotions, and stories through the body.',
    'Our bodies can communicate and create art through movement and space.',
    'How can I use my body to show how music makes me feel?')
  RETURNING id INTO v_unit;

  -- Chapter 4: Creative Movement
  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Creative Movement', 'creative-movement-k',
    'Use the body to explore space, direction, speed, and levels through playful movement activities.',
    '[
      {"type": "heading", "level": 1, "text": "Creative Movement"},
      {"type": "text", "content": "Your body is an amazing instrument for making art. When you move your body to music or to tell a story, that is creative movement. You do not need special shoes or costumes to do creative movement — all you need is your imagination and some space to move."},
      {"type": "text", "content": "When you move, you can think about four things: space, time, energy, and body. Space means where you move. You can move high up on your tiptoes or low down close to the ground. You can move in a big circle or stay in your own small space. Time means how fast or slow you move. Energy means how strongly or gently you move. Body means which parts of your body you are moving."},
      {"type": "callout", "style": "info", "title": "Levels in Dance", "content": "Dancers work at three levels. The low level is close to the ground — crawling, rolling, or crouching. The middle level is standing normally with bent knees. The high level is stretching tall, jumping, or reaching up. Moving between levels makes dancing interesting and varied."},
      {"type": "text", "content": "You can move in different directions too. Forward, backward, sideways, and turning around are all directions a dancer can travel. Moving in a straight path feels very different from moving in a curvy, winding path. Try both and notice how each one makes you feel."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Round Dance", "content": "The Round Dance is a celebratory social dance found in many First Nations communities across the prairies, including Cree and Saulteaux nations in Saskatchewan. Dancers hold hands in a large circle and move together clockwise in a steady, walking step. The circle represents unity and the connection between all living things. Round Dances are joyful gatherings that welcome everyone to participate."},
      {"type": "list", "style": "unordered", "items": ["Space: where and at what level you move", "Time: how fast or slow you move", "Energy: how strongly or gently you move", "Body: which body parts you use", "Direction: forward, backward, sideways, or turning"]},
      {"type": "quiz", "question": "In dance, what word describes moving high on your tiptoes versus low on the ground?", "options": ["Direction", "Rhythm", "Level", "Energy"], "correctIndex": 2, "explanation": "Level describes how high or low in space a dancer moves. Low level is near the ground, middle level is normal standing height, and high level involves reaching, rising, or jumping."}
    ]'::jsonb,
    '[
      {"term": "Creative Movement", "definition": "Using the body to express ideas, emotions, and stories through movement."},
      {"term": "Level", "definition": "How high or low in space a dancer moves — low, middle, or high."},
      {"term": "Direction", "definition": "The path a dancer travels: forward, backward, sideways, or turning."},
      {"term": "Space", "definition": "The area a dancer moves in, including direction and level."},
      {"term": "Energy", "definition": "The quality of movement — strong and sharp, or soft and gentle."}
    ]'::jsonb,
    'The Round Dance is a celebratory social dance practiced by many First Nations communities across the prairies, including Cree and Saulteaux nations in Saskatchewan. Dancers hold hands in a large circle and move together clockwise, the circle representing unity and interconnection. Round Dances are joyful, inclusive community events that welcome all participants.',
    20, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are the three levels in dance?', 'Low (near the ground), middle (normal standing height), and high (reaching or jumping).', 'Think floor to ceiling.', 1, 0),
    (v_tenant, v_ch, 'Name four directions a dancer can travel.', 'Forward, backward, sideways, and turning.', 'Think of a compass rose.', 1, 1),
    (v_tenant, v_ch, 'What is creative movement?', 'Using the body to express ideas, emotions, and stories through movement.', 'No special training required — just imagination and space.', 1, 2);

END $$;


-- ============================================================================
-- TEXTBOOK: WolfWhale Arts 1
-- Slug: wolfwhale-arts-1
-- Chapters: Line Shape & Colour | Beat & Melody | Storytelling Through Drama | Creative Dance
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-arts-1';

  -- ==============================
  -- UNIT 1: Visual Art
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Visual Art',
    'Investigate how artists use line, shape, and colour to compose pictures that communicate meaning.',
    'Every mark an artist makes is a choice that communicates something to a viewer.',
    'How do line, shape, and colour work together to create a picture that tells a story?')
  RETURNING id INTO v_unit;

  -- Chapter 1: Line, Shape & Colour
  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Line, Shape & Colour', 'line-shape-colour-1',
    'Learn how artists use different kinds of lines, geometric and organic shapes, and warm and cool colours to build a composition.',
    '[
      {"type": "heading", "level": 1, "text": "Line, Shape & Colour"},
      {"type": "text", "content": "Artists make choices every time they pick up a pencil or brush. One of their most important tools is the line. Lines can be thick or thin, long or short, straight or curved. A horizontal line feels calm and still, like the flat Saskatchewan horizon. A diagonal line feels active and exciting, like a person running or a tree bending in the wind. Zigzag lines feel sharp and energetic."},
      {"type": "text", "content": "When lines close up, they make shapes. Geometric shapes have straight edges and regular angles: squares, rectangles, triangles, and circles. Organic shapes are more free-form and irregular, like the outline of a leaf, a cloud, or a puddle. Artists combine geometric and organic shapes to build interesting compositions."},
      {"type": "callout", "style": "info", "title": "Warm and Cool Colours", "content": "Colours can be sorted into two families. Warm colours — red, orange, and yellow — remind us of fire, sunlight, and heat. Cool colours — blue, green, and purple — remind us of water, sky, and shadow. Warm colours seem to jump forward in a picture. Cool colours seem to move back."},
      {"type": "text", "content": "Artists also think about colour intensity. A very bright, vivid colour is called intense. A dull, muted colour has low intensity. You can make a colour less intense by mixing a small amount of its opposite colour into it. Opposite colours on the colour wheel are called complementary colours: red and green, blue and orange, yellow and purple are complementary pairs."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Beadwork Geometry", "content": "Metis and First Nations beadwork artists in Saskatchewan use geometric shapes with great precision to create intricate patterns on moccasins, jackets, bags, and regalia. Floral beadwork is especially celebrated in Metis culture, where curved organic petal shapes are combined with the geometric discipline of evenly spaced bead rows. Every design carries cultural meaning passed from one generation to the next."},
      {"type": "list", "style": "unordered", "items": ["Horizontal lines feel calm; diagonal lines feel active", "Geometric shapes have regular edges; organic shapes are free-form", "Warm colours advance; cool colours recede", "Complementary colours sit opposite each other on the colour wheel"]},
      {"type": "quiz", "question": "Which group of colours is considered warm?", "options": ["Blue, green, purple", "Red, orange, yellow", "Blue, purple, red", "Green, yellow, blue"], "correctIndex": 1, "explanation": "Red, orange, and yellow are warm colours because they remind us of fire and sunlight. They tend to appear to advance toward the viewer in a picture."}
    ]'::jsonb,
    '[
      {"term": "Geometric Shape", "definition": "A shape with straight edges and regular angles, such as a square, triangle, or rectangle."},
      {"term": "Organic Shape", "definition": "A free-form, irregular shape found in nature, such as the outline of a leaf or a puddle."},
      {"term": "Warm Colours", "definition": "Red, orange, and yellow — colours associated with fire and sunlight that appear to advance in a picture."},
      {"term": "Cool Colours", "definition": "Blue, green, and purple — colours associated with water and sky that appear to recede in a picture."},
      {"term": "Complementary Colours", "definition": "Two colours that sit directly opposite each other on the colour wheel, such as red and green."},
      {"term": "Composition", "definition": "The arrangement of elements — line, shape, colour — within a work of art."}
    ]'::jsonb,
    'Metis and First Nations beadwork in Saskatchewan is a precise geometric art form. Artists combine carefully spaced bead rows with organic floral shapes to create designs on moccasins, regalia, and everyday objects. Metis floral beadwork in particular is celebrated as a living art tradition passed between generations, with each design carrying family and cultural identity.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the difference between geometric and organic shapes?', 'Geometric shapes have straight edges and regular angles. Organic shapes are irregular and free-form, like shapes found in nature.', 'Think ruler vs. leaf.', 1, 0),
    (v_tenant, v_ch, 'Name the three warm colours.', 'Red, orange, and yellow.', 'Think of fire.', 1, 1),
    (v_tenant, v_ch, 'What are complementary colours?', 'Two colours that sit directly opposite each other on the colour wheel, such as red and green or blue and orange.', 'Opposite on the wheel.', 2, 2);

  -- ==============================
  -- UNIT 2: Music
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Music',
    'Explore beat, melody, and simple musical patterns through singing, clapping, and listening activities.',
    'Music is organized sound, and understanding its building blocks helps us listen more deeply and sing more confidently.',
    'How do beat and melody work together to make a song?')
  RETURNING id INTO v_unit;

  -- Chapter 2: Beat & Melody
  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Beat & Melody', 'beat-and-melody-1',
    'Understand the difference between beat and melody, explore simple rhythmic patterns, and practise singing in tune.',
    '[
      {"type": "heading", "level": 1, "text": "Beat & Melody"},
      {"type": "text", "content": "Every piece of music has two important layers: the beat and the melody. The beat is the steady, even pulse that never changes. You can always tap your foot to the beat. The melody is the tune — the sequence of pitches that goes up and down and makes a song recognizable. You hum the melody when a song is stuck in your head."},
      {"type": "text", "content": "Rhythm is the pattern of long and short sounds that the words or instruments make on top of the beat. Clap the words of your name: if your name is Sam-an-tha, you clap three times: short-short-long. If your name is Ben, you clap once. The pattern of your claps is a rhythm. Every song has its own unique rhythmic pattern in its lyrics and melody."},
      {"type": "callout", "style": "info", "title": "Pitch and Melody", "content": "Pitch is how high or low a sound is. When pitches are arranged in a specific order from lowest to highest, they form a scale. A major scale sounds bright and happy. A melody is a sequence of pitches from the scale arranged into a musical idea."},
      {"type": "text", "content": "When a group of people sing together and stay on the same pitch at the same time, they are singing in unison. When different people sing different pitches that sound beautiful together, that is called harmony. Even Grade 1 singers can begin to explore simple two-note harmonies by holding a low note while a partner sings the melody above it."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Hand Drum Songs", "content": "In many Cree and Dene communities in northern Saskatchewan, hand drum songs are composed and owned by individuals or families. A songwriter may receive a song in a dream or create it to mark an important event. The song''s melody rises and falls in ways that reflect the emotion of the occasion — joyful songs have an energetic lift while honour songs move slowly and deliberately. Drum songs demonstrate that melody and rhythm are universal human experiences expressed uniquely in every culture."},
      {"type": "list", "style": "unordered", "items": ["Beat: the steady, unchanging pulse of music", "Melody: the sequence of pitches that makes a tune", "Rhythm: the pattern of long and short sounds", "Pitch: how high or low a sound is", "Unison: singing the same pitch at the same time", "Harmony: singing different pitches that sound good together"]},
      {"type": "quiz", "question": "What is the name for the tune of a song — the part you hum when a song is stuck in your head?", "options": ["Beat", "Rhythm", "Melody", "Harmony"], "correctIndex": 2, "explanation": "The melody is the sequence of pitches that makes a song recognizable. It is the part you sing or hum, made up of notes that go up and down."}
    ]'::jsonb,
    '[
      {"term": "Beat", "definition": "The steady, even pulse that runs through a piece of music."},
      {"term": "Melody", "definition": "A sequence of pitches arranged into a recognizable tune."},
      {"term": "Rhythm", "definition": "The pattern of long and short sounds in a piece of music."},
      {"term": "Pitch", "definition": "How high or low a musical sound is."},
      {"term": "Unison", "definition": "Singing or playing the same pitch at the same time."},
      {"term": "Harmony", "definition": "Two or more different pitches sounding together in a pleasing way."}
    ]'::jsonb,
    'In many Cree and Dene communities in northern Saskatchewan, hand drum songs are individually composed and often received in dreams or created to mark meaningful events. A song''s melody reflects the emotion of the occasion — joyful songs have an upward, energetic lift, while honour songs move slowly and deliberately. This tradition shows that melody and rhythm are universal human experiences expressed uniquely in each culture.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the difference between beat and rhythm?', 'The beat is a steady, even pulse. Rhythm is the pattern of long and short sounds layered on top of the beat.', 'Beat = steady tick; rhythm = the words of a song.', 1, 0),
    (v_tenant, v_ch, 'What is melody?', 'A sequence of pitches arranged into a recognizable tune — the part of a song you hum.', 'Think of the tune you remember after hearing a song.', 1, 1),
    (v_tenant, v_ch, 'What does it mean to sing in unison?', 'To sing the same pitch at the same time as others.', 'Uni = one. Everyone on one pitch together.', 1, 2);

  -- ==============================
  -- UNIT 3: Drama
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Drama',
    'Use drama to retell and create simple stories, exploring character voice and plot structure.',
    'Stories have a beginning, middle, and end, and drama brings those stories to life through performance.',
    'How can acting out a story help me understand it better?')
  RETURNING id INTO v_unit;

  -- Chapter 3: Storytelling Through Drama
  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Storytelling Through Drama', 'storytelling-through-drama-1',
    'Explore how drama retells and creates stories through character, setting, plot, and simple dialogue.',
    '[
      {"type": "heading", "level": 1, "text": "Storytelling Through Drama"},
      {"type": "text", "content": "Every story has three parts: a beginning, a middle, and an end. In the beginning, we meet the characters and learn about the setting — where and when the story takes place. In the middle, something happens that creates a problem or challenge. At the end, the problem is solved or the story finds its conclusion. This shape is called a plot."},
      {"type": "text", "content": "When you act out a story, you become the characters. A character is not just a name — it is a whole person with feelings, a way of talking, and a way of moving. A giant stomps heavily and speaks in a deep rumble. A nervous mouse scurries quickly and speaks in a tiny squeak. These choices help your audience understand who each character is without anyone explaining it."},
      {"type": "callout", "style": "info", "title": "Dialogue", "content": "Dialogue is the conversation between characters in a story. Good dialogue sounds like real speech and tells us about who the characters are. When you speak dialogue as a character, use the voice and personality of that character, not your own everyday voice."},
      {"type": "text", "content": "The setting of a story is where and when it takes place. Even without a stage or costumes, an actor can create a setting through mime — pretending to push open a heavy door, shivering in cold wind, or climbing a steep hill. This is called creating a fictional world with your body and imagination."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Teaching Stories", "content": "Many First Nations nations in Saskatchewan use traditional teaching stories to pass on values and knowledge about the natural world. These stories often feature animal characters — Raven, Coyote, Frog, or Buffalo — who face challenges and learn lessons. Actors in these stories must embody the personality and movement of each animal character. Metis storytellers also use humour and vivid characters to bring their family and community histories to life."},
      {"type": "list", "style": "unordered", "items": ["Plot: beginning (characters and setting), middle (problem), end (solution)", "Character: a person, animal, or creature in a story", "Setting: where and when a story takes place", "Dialogue: the words characters speak to each other", "Mime: acting without words using body and gesture"]},
      {"type": "quiz", "question": "In a story''s plot, what typically happens in the middle?", "options": ["The characters are introduced", "A problem or challenge arises", "The story ends happily", "The setting is described"], "correctIndex": 1, "explanation": "The middle of a plot is where the main problem or challenge occurs. This is what drives the story forward and keeps the audience interested."}
    ]'::jsonb,
    '[
      {"term": "Plot", "definition": "The sequence of events in a story: beginning, middle, and end."},
      {"term": "Setting", "definition": "Where and when a story takes place."},
      {"term": "Dialogue", "definition": "The words that characters speak to each other in a story or play."},
      {"term": "Mime", "definition": "Acting without words, using only body movement and gesture to communicate."},
      {"term": "Character", "definition": "A person, animal, or creature that appears in a story or play."}
    ]'::jsonb,
    'Many First Nations in Saskatchewan use traditional teaching stories featuring animal characters — Raven, Coyote, Frog, Buffalo — who face challenges and learn important lessons. Actors must physically embody each animal''s personality and movement. Metis storytelling traditions also use vivid character voices and humour to bring family and community histories to life, demonstrating that drama and narrative are deeply rooted in Indigenous culture.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are the three parts of a plot?', 'Beginning (characters and setting), middle (problem or challenge), and end (resolution).', 'Every story has this shape.', 1, 0),
    (v_tenant, v_ch, 'What is dialogue?', 'The words that characters speak to each other in a story or play.', 'It appears in quotation marks in a book.', 1, 1),
    (v_tenant, v_ch, 'What is mime?', 'Acting without words, using only body movement and gesture to communicate.', 'No speaking allowed.', 1, 2);

  -- ==============================
  -- UNIT 4: Dance
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Dance',
    'Explore how dancers use movement, space, and music to create and communicate through creative dance.',
    'Dance is a language the body speaks — one that communicates without words.',
    'How can I move my body in different ways to respond to different kinds of music?')
  RETURNING id INTO v_unit;

  -- Chapter 4: Creative Dance
  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Creative Dance', 'creative-dance-1',
    'Develop movement vocabulary and learn to respond to music with intentional, expressive movement.',
    '[
      {"type": "heading", "level": 1, "text": "Creative Dance"},
      {"type": "text", "content": "Creative dance is about finding your own way to move — not copying someone else''s steps, but discovering what your body can do. Dancers think about their movement vocabulary: all the different ways they can move their body. You can stretch, curl, twist, swing, shake, slide, jump, and freeze. Each action creates a different shape and feeling."},
      {"type": "text", "content": "When you dance, you are always making choices about space. Personal space is the area directly around your body — imagine a bubble surrounding you. General space is the whole room. Dancers move through general space and return to their personal space. Learning to share space safely and respectfully with other dancers is an important part of dance class."},
      {"type": "callout", "style": "info", "title": "Movement Qualities", "content": "Movement can have different qualities depending on how much energy you use and how you use it. Sustained movement is smooth and continuous, like water flowing. Percussive movement is sharp and sudden, like a drum beat. Suspended movement pauses at the top of a leap or a reach before continuing. These qualities change how a dance feels to a performer and to an audience."},
      {"type": "text", "content": "Music gives dancers ideas about how to move. Fast music invites quick, light steps. Slow music invites large, sweeping movements. Music that has a strong beat invites sharp, energetic moves. When a dancer listens carefully to the music and lets it inspire their movement, the dance and the music become one connected experience."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Grass Dance", "content": "The Grass Dance is one of the oldest traditional dances of the Plains First Nations, including the Lakota and Nakoda peoples with communities in Saskatchewan. Grass Dancers wear colourful regalia with flowing fringe that mimics the movement of prairie grasses in the wind. Dancers bend, sway, and twist in fluid, sustained movements that celebrate the grasslands and honour the Earth. The Grass Dance is performed at powwows and is one of the most recognizable and graceful styles of competitive First Nations dance."},
      {"type": "list", "style": "unordered", "items": ["Movement vocabulary: all the ways your body can move", "Personal space: the bubble of space around your body", "General space: the whole room shared by all dancers", "Sustained: smooth and continuous movement", "Percussive: sharp and sudden movement", "Suspended: pausing at the high point of a movement"]},
      {"type": "quiz", "question": "What term describes smooth, continuous movement that flows without stopping?", "options": ["Percussive", "Suspended", "Sustained", "Frozen"], "correctIndex": 2, "explanation": "Sustained movement is smooth and continuous, like water flowing. It contrasts with percussive movement, which is sharp and sudden."}
    ]'::jsonb,
    '[
      {"term": "Movement Vocabulary", "definition": "All the different ways a dancer can move their body — stretching, curling, twisting, jumping, and more."},
      {"term": "Personal Space", "definition": "The area immediately surrounding a dancer''s body, like an invisible bubble."},
      {"term": "General Space", "definition": "The entire shared space that all dancers move through together."},
      {"term": "Sustained Movement", "definition": "Smooth, continuous movement that flows without stopping."},
      {"term": "Percussive Movement", "definition": "Sharp, sudden movement with a strong, defined beat."},
      {"term": "Suspended Movement", "definition": "A pause or held position at the high point of a jump or reach before continuing."}
    ]'::jsonb,
    'The Grass Dance is one of the oldest Plains First Nations dance traditions, practiced by Lakota and Nakoda peoples with communities in Saskatchewan. Grass Dancers wear flowing fringe regalia that mimics prairie grasses in the wind. Their fluid, sustained movements — bending, swaying, and twisting — celebrate the grasslands and honour the Earth. The Grass Dance is performed at powwows and represents some of the most technically refined traditional dance on the prairies.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is personal space in dance?', 'The bubble of space immediately surrounding a dancer''s own body.', 'Your own invisible bubble.', 1, 0),
    (v_tenant, v_ch, 'What is the difference between sustained and percussive movement?', 'Sustained is smooth and continuous; percussive is sharp and sudden.', 'Water flowing vs. a drum beat.', 1, 1),
    (v_tenant, v_ch, 'What is movement vocabulary?', 'All the different ways a dancer can move their body.', 'Think of it as a list of possible movements.', 1, 2);

END $$;


-- ============================================================================
-- TEXTBOOK: WolfWhale Arts 2
-- Slug: wolfwhale-arts-2
-- Chapters: Printmaking & Texture | Musical Notation | Character & Drama | Folk Dance Traditions
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-arts-2';

  -- ==============================
  -- UNIT 1: Visual Art
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Visual Art',
    'Explore printmaking and the element of texture as ways to create art that communicates touch and pattern.',
    'Artists use texture to make flat surfaces feel alive and dimensional.',
    'How can I use printmaking to create repeated patterns and explore the element of texture?')
  RETURNING id INTO v_unit;

  -- Chapter 1: Printmaking & Texture
  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Printmaking & Texture', 'printmaking-texture-2',
    'Discover printmaking techniques and learn how texture — both actual and implied — adds richness to visual art.',
    '[
      {"type": "heading", "level": 1, "text": "Printmaking & Texture"},
      {"type": "text", "content": "Printmaking is the art of creating an image by pressing an inked surface onto paper or another material. The inked surface is called the printing plate or block. You have probably made prints before — pressing a leaf covered in paint onto paper creates a leaf print. Pressing your hand into paint and onto paper is a hand print. Printmaking is special because you can use one block to make many identical prints, called a print run."},
      {"type": "text", "content": "One of the most important ideas in printmaking is texture. Texture is how a surface feels, or how it looks like it would feel. There are two kinds of texture: actual texture and implied texture. Actual texture is what you can touch — the roughness of tree bark, the smoothness of glass, the bumpiness of a brick wall. Implied texture is what a picture makes you imagine you would feel, even though the surface of the artwork is flat."},
      {"type": "callout", "style": "info", "title": "Relief Printing", "content": "In relief printing, the artist carves away the parts they do not want to print. The raised parts that remain are rolled with ink and pressed onto paper. The carved-away areas stay white. Rubber erasers, foam sheets, and even carved potatoes can serve as simple relief printing blocks."},
      {"type": "text", "content": "You can create implied texture in a print by using patterns of lines, dots, or shapes. Close parallel lines look like smooth fur or fine fabric. Rough, jagged marks look like bark or cracked earth. Tiny dots packed together create the look of a grainy surface. Artists choose the texture of their marks to match the feeling they want to create."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Ribbon Work and Patterned Textiles", "content": "Metis women in Saskatchewan have a long tradition of creating intricate patterned textiles using ribbon work — layering and folding brightly coloured ribbons into geometric and floral patterns on clothing and regalia. These layered ribbons create actual texture through their raised edges and overlapping layers. The patterns carry family identity and are passed down through generations, each variation reflecting the maker''s own artistic voice within a shared tradition."},
      {"type": "list", "style": "unordered", "items": ["Printmaking creates images by pressing an inked surface onto another material", "Actual texture: texture you can physically feel by touching", "Implied texture: texture suggested visually in a flat image", "Relief printing: ink on raised surfaces; carved areas stay white", "Repeating a print creates a pattern"]},
      {"type": "quiz", "question": "In relief printing, which part of the block transfers ink to the paper?", "options": ["The carved-away areas", "The raised areas", "The edges of the block", "The entire flat surface"], "correctIndex": 1, "explanation": "In relief printing, ink is applied to the raised surfaces of the block. When pressed onto paper, those raised areas transfer the ink to create the image. Carved-away areas receive no ink and appear white."}
    ]'::jsonb,
    '[
      {"term": "Printmaking", "definition": "The art of creating images by pressing an inked surface onto paper or another material."},
      {"term": "Actual Texture", "definition": "Texture that can be physically felt by touching a surface."},
      {"term": "Implied Texture", "definition": "Texture that appears to exist in a flat image based on the visual pattern of marks."},
      {"term": "Relief Printing", "definition": "A printmaking method where ink is applied to raised surfaces; carved-away areas do not print."},
      {"term": "Print Run", "definition": "A set of identical prints made from the same printing block or plate."},
      {"term": "Pattern", "definition": "A repeating arrangement of lines, shapes, or colours."}
    ]'::jsonb,
    'Metis women in Saskatchewan have a celebrated tradition of ribbon work — layering brightly coloured ribbons into geometric and floral patterns on clothing and regalia. These layered ribbons create actual texture through raised edges and overlapping layers. Each variation in the pattern reflects the maker''s individual artistic voice within a shared intergenerational tradition of design.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the difference between actual and implied texture?', 'Actual texture can be physically felt. Implied texture is suggested visually in a flat image.', 'One you touch, one you see.', 2, 0),
    (v_tenant, v_ch, 'What is relief printing?', 'A printmaking method where ink is applied to raised surfaces and pressed onto paper; carved areas do not print.', 'The raised parts print; the carved parts stay white.', 2, 1),
    (v_tenant, v_ch, 'What is a print run?', 'A set of identical prints made from the same block or plate.', 'The advantage of printmaking over painting.', 2, 2);

  -- ==============================
  -- UNIT 2: Music
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Music',
    'Begin reading basic musical notation, including note values, rests, and the staff.',
    'Written music is a system of symbols that allows musicians to share and preserve their ideas across time and distance.',
    'How does written notation allow musicians to read and perform music they have never heard before?')
  RETURNING id INTO v_unit;

  -- Chapter 2: Musical Notation
  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Musical Notation', 'musical-notation-2',
    'Learn to read basic musical notation including the staff, note values, bar lines, and simple time signatures.',
    '[
      {"type": "heading", "level": 1, "text": "Musical Notation"},
      {"type": "text", "content": "Music can be written down using a system of symbols called musical notation. Just as letters and words allow us to write and read language, notes and symbols allow us to write and read music. Learning to read music opens up an enormous library of songs and allows musicians to share their compositions with others anywhere in the world."},
      {"type": "text", "content": "Music is written on a staff, which is a set of five horizontal lines and four spaces. Each line and space represents a different pitch. Notes are placed on the lines and spaces to show which pitch to play or sing. A treble clef at the beginning of the staff signals that the note on the bottom line is E, and notes go up alphabetically through E-G-B-D-F on the lines and F-A-C-E in the spaces."},
      {"type": "callout", "style": "info", "title": "Note Values", "content": "Notes have different shapes to show how long to hold them. A whole note (an open oval) lasts four beats. A half note (an open oval with a stem) lasts two beats. A quarter note (a filled oval with a stem) lasts one beat. An eighth note (a filled oval with a stem and a flag) lasts half a beat. A rest symbol tells the musician to be silent for that duration."},
      {"type": "text", "content": "A time signature appears at the beginning of a piece of music after the clef. It looks like a fraction. The top number tells you how many beats are in each bar, and the bottom number tells you what kind of note gets one beat. In 4/4 time, there are four beats per bar and a quarter note gets one beat. This is the most common time signature in popular music and many school songs."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Oral Music Transmission", "content": "While western music uses written notation, many First Nations musical traditions in Saskatchewan are transmitted entirely through listening, memory, and participation. Young singers learn songs by sitting with elders and experienced singers, absorbing the melody, rhythm, and spirit of a song through direct experience over many repetitions. This oral tradition is incredibly powerful — songs are preserved with great accuracy across hundreds of years without a single written symbol. Both approaches to music transmission have their own strengths and value."},
      {"type": "list", "style": "unordered", "items": ["Staff: five lines and four spaces that show pitch", "Treble clef: the symbol that marks the staff for higher pitches", "Whole note: 4 beats | Half note: 2 beats | Quarter note: 1 beat | Eighth note: half a beat", "Time signature: shows how many beats per bar and what note gets one beat", "Bar line: a vertical line that divides music into equal measures"]},
      {"type": "quiz", "question": "In 4/4 time, how many beats does a half note receive?", "options": ["1 beat", "2 beats", "4 beats", "Half a beat"], "correctIndex": 1, "explanation": "A half note always lasts two beats. In 4/4 time (four beats per bar), a half note fills exactly half of one bar."}
    ]'::jsonb,
    '[
      {"term": "Staff", "definition": "Five horizontal lines and four spaces on which music is written."},
      {"term": "Treble Clef", "definition": "A symbol at the start of a staff that assigns specific pitches to each line and space."},
      {"term": "Whole Note", "definition": "A note that lasts four beats, written as an open oval."},
      {"term": "Half Note", "definition": "A note that lasts two beats, written as an open oval with a stem."},
      {"term": "Quarter Note", "definition": "A note that lasts one beat, written as a filled oval with a stem."},
      {"term": "Time Signature", "definition": "A symbol at the start of a piece showing how many beats are in each bar and what note gets one beat."},
      {"term": "Bar Line", "definition": "A vertical line drawn across the staff to divide music into equal measures."}
    ]'::jsonb,
    'Many First Nations musical traditions in Saskatchewan are transmitted entirely through listening, memory, and participation rather than written notation. Young singers learn songs by sitting with elders over many sessions, absorbing melody, rhythm, and spirit through direct experience. This oral tradition preserves songs with remarkable accuracy across generations without a single written symbol, demonstrating an equally powerful approach to musical literacy.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'How many beats does a whole note last?', 'Four beats.', 'It is the longest common note value.', 1, 0),
    (v_tenant, v_ch, 'What does the top number of a time signature tell you?', 'How many beats are in each bar (measure).', 'The top number counts the beats.', 2, 1),
    (v_tenant, v_ch, 'What is a staff in music?', 'Five horizontal lines and four spaces on which musical notes are written.', 'Notes sit on the lines and in the spaces.', 1, 2);

  -- ==============================
  -- UNIT 3: Drama
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Drama',
    'Develop character through physical and vocal choices, exploring how drama creates empathy and understanding.',
    'When we step into someone else''s shoes on stage, we build our capacity for empathy in real life.',
    'How do physical and vocal choices help an actor create a believable character?')
  RETURNING id INTO v_unit;

  -- Chapter 3: Character & Drama
  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Character & Drama', 'character-and-drama-2',
    'Build believable characters by making specific physical and vocal choices and exploring the concept of conflict in drama.',
    '[
      {"type": "heading", "level": 1, "text": "Character & Drama"},
      {"type": "text", "content": "A great character in drama is more than just a name. A fully developed character has a personality, feelings, a history, and a way of moving through the world. When an actor creates a character, they make specific choices about how that character stands, walks, speaks, and reacts to what happens around them."},
      {"type": "text", "content": "Physicality is the way a character uses their body. A proud character stands tall with shoulders back. A scared character might hunch their shoulders and look around nervously. A tired character slouches and moves slowly. Even the way a character sits tells us something about who they are. Try sitting like a king on a throne versus sitting like a small child waiting anxiously for news."},
      {"type": "callout", "style": "info", "title": "Conflict in Drama", "content": "Conflict is the challenge or problem that a character faces in a story. Without conflict, there is no drama — nothing to solve, nothing at stake. A character can face conflict with another character (person vs. person), with the environment (person vs. nature), or within themselves (person vs. self). The way a character responds to conflict reveals who they truly are."},
      {"type": "text", "content": "Vocal choices are just as important as physical ones. Rate of speech, volume, pitch, and the pauses between words all shape how an audience perceives a character. Speaking very slowly with long pauses suggests thought and weight. Speaking quickly in a high pitch suggests nervousness or excitement. Try saying the words ''I''m not afraid'' three different ways — as if you mean it, as if you are trying to convince yourself, and as if you are completely terrified. Notice how the meaning changes completely each time."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Masked Performance", "content": "Many Northwest Coast and Plateau First Nations peoples use elaborately carved and painted masks in ceremonial performances. The mask transforms the performer, allowing them to embody a spirit, ancestor, or animal character for the duration of the ceremony. The physical and vocal transformation that comes with wearing a mask is one of drama''s oldest techniques. While Saskatchewan Prairie nations use different ceremonial forms, the principle of transformation through costume and character is universal in Indigenous performance traditions."},
      {"type": "list", "style": "unordered", "items": ["Physicality: how a character uses their body to reveal personality", "Vocal choices: rate, volume, pitch, and pause shape character", "Conflict: the challenge a character must face — person vs. person, nature, or self", "Empathy: understanding and sharing another''s feelings, developed through character work"]},
      {"type": "quiz", "question": "What term describes the challenge or problem a character must face in a drama?", "options": ["Setting", "Dialogue", "Conflict", "Physicality"], "correctIndex": 2, "explanation": "Conflict is the central challenge or problem in a drama. Without conflict there is nothing at stake and no story to tell. How a character responds to conflict reveals their true nature."}
    ]'::jsonb,
    '[
      {"term": "Physicality", "definition": "The way a character uses their body — posture, movement, gesture — to communicate personality."},
      {"term": "Conflict", "definition": "The challenge or problem a character faces in a story: person vs. person, nature, or self."},
      {"term": "Empathy", "definition": "The ability to understand and share the feelings of another person or character."},
      {"term": "Rate of Speech", "definition": "How fast or slow an actor speaks."},
      {"term": "Volume", "definition": "How loud or quiet an actor''s voice is during performance."}
    ]'::jsonb,
    'Many Northwest Coast and Plateau First Nations peoples use elaborately carved and painted masks in ceremonial performances, physically transforming the performer into a spirit, ancestor, or animal character. While Prairie First Nations in Saskatchewan use different ceremonial forms, the principle of transformation through physical and vocal character work is universal in Indigenous performance traditions, and connects directly to the drama skills students practise in class.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is physicality in drama?', 'The way a character uses their body — posture, movement, and gesture — to communicate personality.', 'How do they stand? How do they walk?', 2, 0),
    (v_tenant, v_ch, 'Name three types of conflict in drama.', 'Person vs. person, person vs. nature, and person vs. self.', 'Think about the source of the problem.', 2, 1),
    (v_tenant, v_ch, 'What is empathy?', 'The ability to understand and share the feelings of another person or character.', 'Drama builds this skill through character work.', 2, 2);

  -- ==============================
  -- UNIT 4: Dance
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Dance',
    'Explore folk dance traditions as an expression of cultural identity and community celebration.',
    'Folk dances carry the history, values, and joy of a community, passed from one generation to the next.',
    'How do folk dances reflect the community and culture they come from?')
  RETURNING id INTO v_unit;

  -- Chapter 4: Folk Dance Traditions
  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Folk Dance Traditions', 'folk-dance-traditions-2',
    'Explore folk dances from various cultural traditions, including footwork patterns, partner work, and formation dancing.',
    '[
      {"type": "heading", "level": 1, "text": "Folk Dance Traditions"},
      {"type": "text", "content": "Folk dances are dances that developed within a particular community or culture and were passed from one generation to the next. They are danced at celebrations, festivals, and gatherings. Saskatchewan is home to people from many different cultural backgrounds — Ukrainian, Polish, Scandinavian, Scottish, Filipino, and many others — and each culture has brought its own folk dance traditions to the province."},
      {"type": "text", "content": "Most folk dances have specific footwork patterns that are repeated. Footwork describes what the feet do: stepping, hopping, stamping, shuffling, or gliding. In many European folk dances, a common step pattern is step-together-step or step-hop-step. Repeating this pattern in time with the music is the foundation of the dance."},
      {"type": "callout", "style": "info", "title": "Formation Dancing", "content": "Formation dancing means dancing in an organized group shape such as a circle, line, square, or two facing lines. Circle dances are among the most universal in human history. Dancers in a circle are all equal — there is no front or back — and the shape itself often carries symbolic meaning related to unity and community."},
      {"type": "text", "content": "Partner work is another common feature of folk dance. Partners face each other, side by side, or in a handhold and move through a sequence of steps together. Connecting with a partner through dance requires listening with your whole body — matching their energy, timing, and direction. This physical communication is a fundamental skill in collaborative dancing."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Metis Jigging", "content": "Metis jigging is one of the most vibrant and joyful dance traditions on the Canadian prairies. Rooted in the blending of First Nations footwork and French-Canadian and Scottish step dancing brought by fur trade voyageurs, Metis jigging is a percussive, foot-based dance performed to fiddle music. The Red River Jig is the most famous Metis jig, featuring rapid footwork patterns that create a rhythmic sound against the floor. Jigging competitions are a beloved part of Metis celebrations and cultural gatherings across Saskatchewan."},
      {"type": "list", "style": "unordered", "items": ["Folk dances are community dances passed down through generations", "Footwork patterns are repeating sequences of steps", "Formation dancing organizes dancers into circles, lines, or squares", "Partner work requires physical listening and matching energy", "Saskatchewan''s multicultural heritage includes many folk dance traditions"]},
      {"type": "quiz", "question": "What does the term ''formation'' refer to in folk dance?", "options": ["A type of footwork pattern", "The organized shape dancers make, such as a circle or line", "The speed of the music", "The partner handhold position"], "correctIndex": 1, "explanation": "A formation is the organized group shape that dancers create and move within — such as a circle, line, square, or two facing rows. Different formations create different social and visual effects."}
    ]'::jsonb,
    '[
      {"term": "Folk Dance", "definition": "A dance developed within a specific cultural community, passed down through generations."},
      {"term": "Footwork", "definition": "The specific pattern of steps, hops, stamps, or glides that the feet perform in a dance."},
      {"term": "Formation", "definition": "An organized group shape such as a circle, line, or square that dancers move within."},
      {"term": "Partner Work", "definition": "Dancing with another person in a coordinated, collaborative way."},
      {"term": "Step Pattern", "definition": "A repeated sequence of foot movements that forms the basic unit of a dance style."}
    ]'::jsonb,
    'Metis jigging is one of the most vibrant dance traditions on the Canadian prairies. It blends First Nations footwork with French-Canadian and Scottish step dancing traditions brought by fur trade voyageurs. The Red River Jig, performed to fiddle music, features rapid percussive footwork that creates rhythmic sound against the floor. Jigging competitions are a celebrated part of Metis cultural gatherings across Saskatchewan.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a folk dance?', 'A dance developed within a specific cultural community and passed down through generations.', 'Think of dances at cultural festivals and celebrations.', 1, 0),
    (v_tenant, v_ch, 'What is footwork in dance?', 'The specific pattern of steps, hops, stamps, or glides performed by the feet.', 'What do the feet do in the dance?', 1, 1),
    (v_tenant, v_ch, 'What is Metis jigging?', 'A percussive, foot-based dance performed to fiddle music that blends First Nations and European step dancing traditions.', 'Think Red River Jig and the sound of feet on the floor.', 2, 2);

END $$;


-- ============================================================================
-- TEXTBOOK: WolfWhale Arts 3
-- Slug: wolfwhale-arts-3
-- Chapters: Perspective & Sculpture | Ensemble Playing | Readers Theatre | Choreography Basics
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-arts-3';

  -- UNIT 1: Visual Art
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Visual Art',
    'Explore perspective and three-dimensional art through drawing and sculpture techniques.',
    'Artists create the illusion of space and depth to make flat pictures feel like real worlds.',
    'How do artists make a flat picture look three-dimensional?')
  RETURNING id INTO v_unit;

  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Perspective & Sculpture', 'perspective-sculpture-3',
    'Learn how artists create the illusion of depth using overlap, size, placement, and line, and explore three-dimensional art through simple sculpture.',
    '[
      {"type": "heading", "level": 1, "text": "Perspective & Sculpture"},
      {"type": "text", "content": "When you look out across a Saskatchewan prairie, you see things near and far. Objects close to you appear large and detailed. Objects far away look small and less distinct. Artists use several techniques to recreate this sense of depth and distance on a flat surface. Together, these techniques are called perspective."},
      {"type": "text", "content": "Overlap is one of the simplest depth techniques. When one object covers part of another, the object in front appears closer. Size change also shows depth: objects drawn larger seem nearer, while the same object drawn smaller seems farther away. Placement on the page also matters — objects near the bottom of the picture plane appear closer, while objects near the top appear more distant. These three tricks — overlap, size, and placement — can create convincing depth without any complex geometry."},
      {"type": "callout", "style": "info", "title": "Foreground, Middle Ground, Background", "content": "Artists divide the space in a picture into three zones. The foreground is the nearest zone, where objects are largest and most detailed. The middle ground is in between. The background is the farthest zone, where objects are smallest and least detailed. Organizing a picture into these three zones creates a strong sense of depth."},
      {"type": "text", "content": "Sculpture is the art of creating three-dimensional works that you can walk around and view from multiple sides. Unlike a drawing, a sculpture actually occupies real space. Sculptors work with materials such as clay, wire, wood, stone, papier-mache, and found objects. The three-dimensionality of sculpture means it has form — an actual volume in space, not just the illusion of one."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Stone Effigies and Land Art", "content": "The Wanuskewin Heritage Park north of Saskatoon is the site of a stone medicine wheel and tipi ring formations left by ancestors of the Plains Cree and other Blackfoot Confederacy peoples thousands of years ago. These stone arrangements on the landscape are a form of monumental art and ceremony — large-scale works that organize space, mark astronomical events, and connect the community to the land. They represent some of the oldest sculpture-like art in Saskatchewan."},
      {"type": "list", "style": "unordered", "items": ["Overlap: objects in front cover objects behind — shows depth", "Size change: larger = closer, smaller = farther", "Placement: lower on page = closer, higher = farther", "Foreground / middle ground / background organize depth", "Sculpture: three-dimensional art with actual form in space"]},
      {"type": "quiz", "question": "Which technique for showing depth involves drawing objects so that one partially covers another?", "options": ["Size change", "Placement", "Overlap", "Background shading"], "correctIndex": 2, "explanation": "Overlap shows depth by placing one object in front of another so it partially obscures it. The object in front appears closer to the viewer."}
    ]'::jsonb,
    '[
      {"term": "Perspective", "definition": "Techniques used to create the illusion of depth and three-dimensional space on a flat surface."},
      {"term": "Overlap", "definition": "Placing one object in front of another so it partially covers it, creating the impression of depth."},
      {"term": "Foreground", "definition": "The nearest zone in a picture, where objects appear largest and most detailed."},
      {"term": "Background", "definition": "The farthest zone in a picture, where objects appear smallest and least detailed."},
      {"term": "Form", "definition": "A three-dimensional element of art that has height, width, and depth."},
      {"term": "Sculpture", "definition": "A three-dimensional work of art that exists in real space and can be viewed from multiple sides."}
    ]'::jsonb,
    'The Wanuskewin Heritage Park north of Saskatoon contains stone medicine wheels and tipi ring formations created by ancestors of the Plains Cree and Blackfoot Confederacy peoples thousands of years ago. These large-scale stone arrangements on the prairie landscape function as monumental art and ceremony, organizing space, marking astronomical events, and connecting communities to the land — representing some of the oldest sculptural art in Saskatchewan.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Name three techniques for showing depth in a drawing.', 'Overlap, size change (larger = closer), and placement (lower on page = closer).', 'How do artists trick the eye?', 2, 0),
    (v_tenant, v_ch, 'What is the foreground of a picture?', 'The nearest zone, where objects appear largest and most detailed.', 'It is in front of everything else.', 1, 1),
    (v_tenant, v_ch, 'What makes sculpture different from drawing?', 'Sculpture is three-dimensional and exists in real space; drawing is two-dimensional and creates only the illusion of depth.', 'You can walk around a sculpture.', 2, 2);

  -- UNIT 2: Music
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Music',
    'Explore ensemble playing, listening skills, and musical roles within a group performance.',
    'Music made together is greater than the sum of its parts — ensemble playing teaches cooperation and deep listening.',
    'How do musicians in a group listen to and support each other while performing?')
  RETURNING id INTO v_unit;

  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Ensemble Playing', 'ensemble-playing-3',
    'Learn about musical roles in an ensemble, cooperative listening, and how different instruments and voices work together.',
    '[
      {"type": "heading", "level": 1, "text": "Ensemble Playing"},
      {"type": "text", "content": "An ensemble is any group of musicians who perform together. A duo is two musicians. A trio is three. A quartet is four. A larger group of mixed instruments is called a chamber ensemble or an orchestra. A group of singers is called a choir or chorus. Each musician in an ensemble has a specific role, and listening carefully to everyone else is just as important as playing your own part correctly."},
      {"type": "text", "content": "In most ensembles, some musicians play the melody — the main tune. Others play an accompaniment, which supports and surrounds the melody without overshadowing it. Still others provide a bass line, a low-pitched pattern that gives the music its harmonic foundation. These three layers — melody, accompaniment, and bass — work together to create a full, rich sound."},
      {"type": "callout", "style": "info", "title": "Dynamics in Ensemble Playing", "content": "Dynamics describe how loud or soft music is played. The word forte (f) means loud. Piano (p) means soft. Mezzo-forte (mf) means moderately loud. Mezzo-piano (mp) means moderately soft. Crescendo means gradually getting louder. Decrescendo means gradually getting softer. In an ensemble, all musicians must follow the same dynamic markings to create a balanced, unified sound."},
      {"type": "text", "content": "Tempo is how fast or slow music is played. In an ensemble, all musicians must stay at the same tempo. A conductor uses a baton or hand gestures to lead an ensemble, setting the tempo and cueing dynamic changes. Without a conductor, ensemble musicians watch and listen closely to a designated leader or simply to each other, adjusting in real time to stay together."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Drum Groups", "content": "In Plains First Nations drum groups, musicians sit in a circle around a large central drum and play together using padded drumsticks. Each drummer contributes to a shared, synchronized beat. There is no conductor — the group listens carefully to each other and enters songs together on a single agreed cue. Lead singers begin the melody and others join in, creating a layered, powerful sound. This form of ensemble performance requires the same deep listening and cooperative skills as any western music ensemble."},
      {"type": "list", "style": "unordered", "items": ["Ensemble: any group of musicians performing together", "Melody: the main tune carried by one or more performers", "Accompaniment: the supporting musical layer surrounding the melody", "Dynamics: how loud or soft music is played (forte, piano, crescendo)", "Tempo: how fast or slow music is played", "Conductor: a leader who guides the ensemble''s tempo and dynamics"]},
      {"type": "quiz", "question": "What Italian music term means to play gradually getting louder?", "options": ["Forte", "Piano", "Crescendo", "Decrescendo"], "correctIndex": 2, "explanation": "Crescendo means gradually getting louder. It comes from the Italian word for growing. Its symbol is a hairpin opening to the right: <."}
    ]'::jsonb,
    '[
      {"term": "Ensemble", "definition": "A group of musicians who perform together."},
      {"term": "Accompaniment", "definition": "The musical layer that supports the melody without overshadowing it."},
      {"term": "Dynamics", "definition": "The variation of loudness and softness in music."},
      {"term": "Forte", "definition": "An Italian music term meaning loud, marked with the letter f."},
      {"term": "Piano", "definition": "An Italian music term meaning soft, marked with the letter p."},
      {"term": "Crescendo", "definition": "A gradual increase in loudness."},
      {"term": "Tempo", "definition": "The speed of music — how fast or slow it is played."}
    ]'::jsonb,
    'Plains First Nations drum groups sit in a circle around a large shared drum and play together without a conductor. Each drummer listens carefully to the others, entering songs on a single agreed cue. Lead singers begin the melody and others layer in, creating a powerful, unified sound. This form of cooperative ensemble performance requires the same deep listening and collective attention as any orchestral performance.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does forte mean in music?', 'Loud. It is marked with the letter f.', 'The opposite of piano (p).', 1, 0),
    (v_tenant, v_ch, 'What is a crescendo?', 'A gradual increase in loudness.', 'Think of the sound getting bigger and bigger.', 1, 1),
    (v_tenant, v_ch, 'What is an ensemble?', 'A group of musicians who perform together.', 'From duo (2) to full orchestra.', 1, 2);

  -- UNIT 3: Drama
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Drama',
    'Explore Readers Theatre as a bridge between literacy and performance, using voice and expression to bring text to life.',
    'Reading aloud with expression is a performance that makes stories vivid and accessible for an audience.',
    'How does reading with expression and intention change the way a story sounds and feels?')
  RETURNING id INTO v_unit;

  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Readers Theatre', 'readers-theatre-3',
    'Learn the conventions of Readers Theatre, including expressive reading, vocal characterization, and simple staging without full memorization.',
    '[
      {"type": "heading", "level": 1, "text": "Readers Theatre"},
      {"type": "text", "content": "Readers Theatre is a form of drama in which performers read from scripts rather than memorizing lines. The focus is entirely on the voice — how you read tells the audience everything about your character, the setting, and the emotion of the story. Because there is no need to memorize, Readers Theatre allows even beginning drama students to perform complex, interesting stories."},
      {"type": "text", "content": "In Readers Theatre, performers usually sit or stand in a line or semicircle facing the audience, holding their scripts. When it is their character''s turn to speak, a performer looks up from the script and delivers their lines with full expression. When another character speaks, they look down or away to signal they are not currently in the scene. This simple on/off convention makes it easy for the audience to follow the action."},
      {"type": "callout", "style": "info", "title": "Expressive Reading", "content": "Expressive reading means using your voice to bring words to life. Change your pitch to show emotion — higher for excitement, lower for sadness or authority. Change your rate — speed up for action scenes, slow down for important moments. Add pauses to create suspense. Project your voice so the back row can hear you clearly without shouting."},
      {"type": "text", "content": "A narrator is a performer who describes the setting and action that is not shown through the characters'' dialogue. The narrator''s voice is usually calm and clear — they speak directly to the audience, setting the scene and bridging the action between characters. A skilled narrator can make an audience feel that they are right in the middle of the story''s world."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Storytelling Performance", "content": "Traditional Cree and Nakoda storytellers in Saskatchewan use techniques very similar to Readers Theatre. The storyteller''s voice is the primary instrument — changing pitch and tone to voice different characters, slowing down for important moments, and using pauses to build tension. The audience is an active participant, responding to the story with laughter, sounds of surprise, or words of affirmation. This call-and-response relationship between storyteller and audience is a sophisticated and ancient form of live performance."},
      {"type": "list", "style": "unordered", "items": ["Readers Theatre uses scripts — no memorization required", "Voice is the primary performance tool: pitch, rate, pause, volume", "Narrator bridges the action and sets the scene", "Looking up = in the scene; looking down = out of the scene", "Expressive reading makes stories vivid for an audience"]},
      {"type": "quiz", "question": "In Readers Theatre, what does a performer do to signal they are not currently in the scene?", "options": ["They leave the stage", "They look down at their script or away from the audience", "They close their eyes", "They take three steps back"], "correctIndex": 1, "explanation": "In Readers Theatre, looking down or away from the audience signals that a performer''s character is not currently in the scene. Looking up and toward the audience signals that they are actively performing."}
    ]'::jsonb,
    '[
      {"term": "Readers Theatre", "definition": "A drama form where performers read from scripts, using voice to characterize and tell a story."},
      {"term": "Expressive Reading", "definition": "Reading aloud with vocal variation in pitch, rate, volume, and pause to bring text to life."},
      {"term": "Narrator", "definition": "A performer who describes the setting and action, bridging scenes for the audience."},
      {"term": "Script", "definition": "The written text of a play or Readers Theatre piece, including dialogue and stage directions."},
      {"term": "Projection", "definition": "Using sufficient breath and vocal effort to be heard clearly at the back of the room."}
    ]'::jsonb,
    'Traditional Cree and Nakoda storytellers in Saskatchewan use techniques that parallel Readers Theatre. The storyteller''s voice is the primary instrument, changing pitch and tone to voice different characters, slowing for important moments, and using silence to build tension. The audience participates actively with laughter, sounds of surprise, and affirmations — a call-and-response relationship that is one of humanity''s oldest live performance traditions.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is Readers Theatre?', 'A drama form where performers read from scripts, using voice to characterize and tell a story — no memorization required.', 'Scripts in hand, voice as the main tool.', 1, 0),
    (v_tenant, v_ch, 'What is the role of the narrator in Readers Theatre?', 'To describe the setting and action, bridging scenes for the audience.', 'They speak directly to the audience.', 2, 1),
    (v_tenant, v_ch, 'What does expressive reading involve?', 'Using vocal variation in pitch, rate, volume, and pause to bring text to life.', 'Do not read in a flat, monotone voice.', 2, 2);

  -- UNIT 4: Dance
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Dance',
    'Begin organizing movement into structured sequences and explore the basics of choreography.',
    'Choreography is the intentional organization of movement — turning improvisation into repeatable, communicable art.',
    'How do choreographers make decisions about what movements to use and in what order?')
  RETURNING id INTO v_unit;

  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Choreography Basics', 'choreography-basics-3',
    'Learn the basic tools of choreography including motif, repetition, variation, and simple phrase building.',
    '[
      {"type": "heading", "level": 1, "text": "Choreography Basics"},
      {"type": "text", "content": "Choreography is the art of designing and arranging movements to create a dance. A choreographer is the artist who makes those decisions. You do not need to be an expert dancer to be a choreographer — you need to be a creative thinker who can imagine movements, try them out, and organize them into a sequence that makes sense."},
      {"type": "text", "content": "The basic building block of choreography is a motif. A motif is a short movement idea — it might be a specific gesture, a jump, a turn, or a way of traveling across the floor. Once a choreographer establishes a motif, they can repeat it, vary it, or build on it to develop the rest of the dance. Repetition creates familiarity for the audience. Variation keeps the dance interesting."},
      {"type": "callout", "style": "info", "title": "Dance Phrase", "content": "A dance phrase is a sequence of movements that forms a complete idea, similar to a sentence in writing. A phrase has a beginning, development, and a sense of ending. Choreographers link phrases together to build a complete dance, just as a writer links sentences into paragraphs and paragraphs into a story."},
      {"type": "text", "content": "Choreographers also think about transitions — how they move from one phrase to the next. A sudden, sharp transition creates contrast and surprise. A smooth, flowing transition creates continuity. The choice of transition affects the overall mood and flow of the dance. When planning a dance, it helps to sketch out a simple plan: which movements come first, which come in the middle, and how the dance will end."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Fancy Shawl Dance", "content": "The Fancy Shawl Dance is a competitive powwow dance style popular among young Indigenous women. The choreography combines spinning, intricate footwork, and dramatic use of a large, brightly coloured shawl that becomes wings in flight. Each dancer develops her own choreographic style within the tradition''s conventions — a personal motif vocabulary that she repeats and varies throughout her performance. Saskatchewan powwows at Wanuskewin and other venues feature stunning Fancy Shawl performances that demonstrate sophisticated personal choreography."},
      {"type": "list", "style": "unordered", "items": ["Choreography: the design and arrangement of dance movements", "Motif: a short movement idea used as a building block", "Repetition: repeating a motif creates familiarity", "Variation: changing a motif keeps the dance interesting", "Dance phrase: a sequence of movements forming a complete idea", "Transition: how movement moves from one phrase to the next"]},
      {"type": "quiz", "question": "What is a motif in choreography?", "options": ["A full dance performance", "A short movement idea used as a building block", "A type of formation", "The ending pose of a dance"], "correctIndex": 1, "explanation": "A motif is a short, specific movement idea that a choreographer establishes and then repeats or varies throughout a dance. It is the basic building block of choreography."}
    ]'::jsonb,
    '[
      {"term": "Choreography", "definition": "The art of designing and arranging dance movements to create a complete performance."},
      {"term": "Choreographer", "definition": "The artist who designs and arranges the movements in a dance."},
      {"term": "Motif", "definition": "A short, recurring movement idea that serves as the building block of a choreographed dance."},
      {"term": "Dance Phrase", "definition": "A sequence of movements that forms a complete idea with a sense of beginning and end."},
      {"term": "Transition", "definition": "The movement that connects one dance phrase to the next."},
      {"term": "Variation", "definition": "A change or development of a motif that keeps a dance interesting while maintaining continuity."}
    ]'::jsonb,
    'The Fancy Shawl Dance is a competitive powwow dance style celebrated among young Indigenous women across the prairies. Each dancer develops a personal choreographic style within the tradition''s conventions — a motif vocabulary she repeats and varies throughout her performance. Spinning, intricate footwork, and dramatic shawl work combine to create a uniquely personal yet culturally grounded choreography. Saskatchewan powwows at Wanuskewin and other venues feature outstanding Fancy Shawl performances.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is choreography?', 'The art of designing and arranging dance movements to create a complete performance.', 'The choreographer is the architect of a dance.', 2, 0),
    (v_tenant, v_ch, 'What is a dance motif?', 'A short movement idea used as the building block of a dance.', 'It can be repeated and varied throughout.', 2, 1),
    (v_tenant, v_ch, 'What is a dance phrase?', 'A sequence of movements that forms a complete idea with a sense of beginning and end.', 'Like a sentence in writing.', 2, 2);

END $$;


-- ============================================================================
-- TEXTBOOK: WolfWhale Arts 4
-- Slug: wolfwhale-arts-4
-- Chapters: Design Principles | Musical Composition | Improvisation | Structured Dance
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-arts-4';

  -- UNIT 1: Visual Art
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Visual Art',
    'Apply the principles of design — balance, contrast, emphasis, pattern, rhythm, and unity — to create more intentional artwork.',
    'Design principles are the guidelines artists use to arrange elements into a composition that works as a whole.',
    'How do design principles help an artist make decisions about arranging the elements of an artwork?')
  RETURNING id INTO v_unit;

  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Design Principles', 'design-principles-4',
    'Understand and apply the principles of design: balance, contrast, emphasis, pattern, rhythm, and unity in creating visual art.',
    '[
      {"type": "heading", "level": 1, "text": "Design Principles"},
      {"type": "text", "content": "Artists use the elements of art — line, shape, colour, texture, form, space, and value — as their raw materials. But they organize these elements using the principles of design. Design principles are like the grammar of visual art: the guidelines that help artists arrange elements into compositions that are unified, interesting, and effective."},
      {"type": "text", "content": "Balance refers to how visual weight is distributed in a composition. Symmetrical balance occurs when both halves of a composition mirror each other. Asymmetrical balance uses different elements of different sizes on each side but still feels visually equal. Radial balance radiates from a central point, like the petals of a flower or the spokes of a wheel."},
      {"type": "callout", "style": "info", "title": "Emphasis and Contrast", "content": "Emphasis is the principle of making one area of an artwork stand out as the focal point — the first place a viewer''s eye goes. Artists create emphasis through contrast. Contrast means placing strongly different elements next to each other: light next to dark, bright colour next to dull colour, large shape next to small shape. High contrast draws the eye immediately."},
      {"type": "text", "content": "Pattern is the repetition of any art element in a regular arrangement. Rhythm in design is similar to rhythm in music — it is created by repeating elements at regular intervals, creating a sense of movement through the composition. Unity is the feeling that all elements in an artwork belong together and work as a whole. When a composition has unity, nothing feels out of place."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Porcupine Quillwork", "content": "Porcupine quillwork is one of the oldest Indigenous art forms on the prairies, practised by Cree, Anishinaabe, and Nakoda artists in Saskatchewan. Quills are softened, dyed in plant-based colours, and woven or stitched into intricate geometric patterns on birchbark, leather, and fabric. The designs demonstrate all six design principles: balance in their symmetrical layouts, contrast in their colour combinations, emphasis in their central motifs, pattern in their repeating geometric units, rhythm in their repetition, and unity in their overall coherence."},
      {"type": "list", "style": "unordered", "items": ["Balance: equal visual weight — symmetrical, asymmetrical, or radial", "Contrast: strong differences that create visual interest and emphasis", "Emphasis: the focal point — where the eye looks first", "Pattern: repetition of elements in a regular arrangement", "Rhythm: a sense of movement created by repeating elements at intervals", "Unity: the feeling that all elements belong together"]},
      {"type": "quiz", "question": "What principle of design describes the feeling that all elements in an artwork belong together and work as a whole?", "options": ["Contrast", "Emphasis", "Pattern", "Unity"], "correctIndex": 3, "explanation": "Unity is the feeling of wholeness in a composition — when all the elements seem to belong together and nothing feels out of place or arbitrary. Artists achieve unity through consistent use of colour, repeated shapes, or a dominant theme."}
    ]'::jsonb,
    '[
      {"term": "Balance", "definition": "The distribution of visual weight in a composition — symmetrical, asymmetrical, or radial."},
      {"term": "Contrast", "definition": "Placing strongly different elements next to each other to create visual interest."},
      {"term": "Emphasis", "definition": "The focal point of an artwork — the area that draws the viewer''s eye first."},
      {"term": "Pattern", "definition": "The repetition of any element in a regular arrangement."},
      {"term": "Rhythm", "definition": "A sense of visual movement created by repeating elements at regular intervals."},
      {"term": "Unity", "definition": "The feeling that all elements in an artwork belong together as a coherent whole."}
    ]'::jsonb,
    'Porcupine quillwork is one of the oldest Indigenous art forms on the Canadian prairies, practised by Cree, Anishinaabe, and Nakoda artists in Saskatchewan. Quills are softened and dyed with plant-based pigments, then woven or stitched into intricate geometric designs on birchbark, leather, and fabric. These designs demonstrate all six design principles in sophisticated combination — symmetrical balance, high colour contrast, strong central emphasis, repeating geometric patterns, visual rhythm, and overall compositional unity.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the difference between symmetrical and asymmetrical balance?', 'Symmetrical balance: both halves mirror each other. Asymmetrical balance: different elements that still feel visually equal.', 'Think of a butterfly vs. a landscape painting.', 2, 0),
    (v_tenant, v_ch, 'What creates emphasis in an artwork?', 'Contrast — placing strongly different elements together so one area draws the eye first.', 'Emphasis = focal point. Contrast creates it.', 2, 1),
    (v_tenant, v_ch, 'What is unity in design?', 'The feeling that all elements in a composition belong together as a coherent whole.', 'Nothing feels out of place.', 2, 2);

  -- UNIT 2: Music
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Music',
    'Explore the basics of musical composition by learning about form, melody writing, and simple harmonic accompaniment.',
    'Composing music is a creative act guided by structure — knowing the rules of form helps composers make expressive choices.',
    'How do composers organize musical ideas into a complete and satisfying piece?')
  RETURNING id INTO v_unit;

  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Musical Composition', 'musical-composition-4',
    'Learn about musical form, melodic contour, simple chord accompaniment, and the process of composing an original melody.',
    '[
      {"type": "heading", "level": 1, "text": "Musical Composition"},
      {"type": "text", "content": "Composition is the art of creating an original piece of music. Composers make decisions about melody, rhythm, harmony, dynamics, and form. Anyone can compose — it starts with a simple musical idea and grows from there. Many famous composers began their careers as children writing short tunes, and students in Grade 4 can do the same."},
      {"type": "text", "content": "Musical form describes the structure or shape of a piece. One of the most common forms is ABA form. Section A is the main musical idea. Section B is a contrasting idea — different in melody, rhythm, or mood. Section A then returns, giving the piece a satisfying sense of coming home. Many songs, from folk tunes to pop music, use this simple but powerful structure."},
      {"type": "callout", "style": "info", "title": "Melodic Contour", "content": "Melodic contour is the shape of a melody as it moves up and down. A melody that climbs steadily upward creates tension and excitement. A melody that steps downward feels resolved and calm. Arching melodies — rising and then falling — create a sense of completeness. When composing a melody, think of its contour the way an artist thinks of a line in a drawing."},
      {"type": "text", "content": "A chord is a group of three or more notes played together. Chords create harmony — the vertical dimension of music that surrounds and supports the melody. Simple compositions often use just three chords: the I chord (built on the first note of the scale), the IV chord (built on the fourth note), and the V chord (built on the fifth note). These three chords can accompany hundreds of folk, pop, and country songs."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Song Composition and Ownership", "content": "In many First Nations traditions in Saskatchewan, songs are considered personal property. A person may compose a song to commemorate a significant event, receive one as a spiritual gift, or inherit one from family. These songs belong to their composer or family and cannot be sung by others without permission. Nakoda (Stoney) honour songs, for example, are composed for specific individuals and sung only with that person''s or their family''s blessing. This concept of musical ownership reflects a sophisticated understanding of intellectual and spiritual property long before western copyright law existed."},
      {"type": "list", "style": "unordered", "items": ["Composition: creating an original piece of music", "ABA form: main idea (A), contrasting idea (B), return to main idea (A)", "Melodic contour: the rising and falling shape of a melody", "Chord: three or more notes played together", "I-IV-V chords: the three foundational chords in many musical styles"]},
      {"type": "quiz", "question": "In ABA musical form, what happens in the B section?", "options": ["It repeats the A section exactly", "It introduces a contrasting musical idea", "It is always played louder than A", "It introduces a new time signature"], "correctIndex": 1, "explanation": "In ABA form, the B section provides contrast to the A section. It may use a different melody, different rhythm, different key, or a different mood. The return of A after B gives the piece a sense of resolution."}
    ]'::jsonb,
    '[
      {"term": "Composition", "definition": "The art of creating an original piece of music."},
      {"term": "Musical Form", "definition": "The structure or shape of a piece of music, such as ABA form."},
      {"term": "ABA Form", "definition": "A common musical structure with a main section (A), a contrasting section (B), and a return to the main section (A)."},
      {"term": "Melodic Contour", "definition": "The rising and falling shape of a melody as it moves through its pitches."},
      {"term": "Chord", "definition": "Three or more musical pitches sounded together to create harmony."},
      {"term": "Harmony", "definition": "The vertical dimension of music — pitches sounding simultaneously to support a melody."}
    ]'::jsonb,
    'In many First Nations traditions in Saskatchewan, songs are considered personal property — composed to commemorate events, received as spiritual gifts, or inherited through family. They cannot be sung by others without permission. Nakoda honour songs, for example, are composed for specific individuals and performed only with family consent. This tradition of musical ownership reflects a sophisticated understanding of intellectual and spiritual property that predates western copyright law by centuries.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is ABA musical form?', 'A structure with a main section (A), a contrasting section (B), and a return to the main section (A).', 'Common in folk songs, pop music, and classical pieces.', 2, 0),
    (v_tenant, v_ch, 'What is melodic contour?', 'The rising and falling shape of a melody as it moves through its pitches.', 'Picture the melody as a drawn line going up and down.', 2, 1),
    (v_tenant, v_ch, 'What is a chord?', 'Three or more musical pitches sounded together to create harmony.', 'Multiple notes at once.', 1, 2);

  -- UNIT 3: Drama
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Drama',
    'Explore theatrical improvisation as a creative and collaborative tool for building scenes and developing characters spontaneously.',
    'Improvisation teaches us to listen, accept, and build — skills that are essential both on stage and in life.',
    'How does accepting what your partner offers make a scene stronger than planning every moment in advance?')
  RETURNING id INTO v_unit;

  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Improvisation', 'improvisation-4',
    'Learn the core principles of theatrical improvisation: yes-and, active listening, status, and building believable scenes spontaneously.',
    '[
      {"type": "heading", "level": 1, "text": "Improvisation"},
      {"type": "text", "content": "Improvisation, or improv, is the art of creating drama spontaneously, without a script. In improv, there are no lines to memorize and no plan to follow — you and your partner create the scene together in the moment, responding to each other''s choices. Improv is unpredictable, exciting, and often funny, but it requires serious skill and discipline."},
      {"type": "text", "content": "The most important rule in improv is called yes-and. When your partner makes a choice — says something, does something, becomes something — you accept it completely (that is the yes) and then add something new to build on it (that is the and). If your partner says ''I can''t believe this boat is sinking!'' and you say ''What boat? We''re in a desert,'' you have blocked their offer. Blocking kills scenes. Yes-and builds them."},
      {"type": "callout", "style": "info", "title": "CROW: Character, Relationship, Objective, Where", "content": "Strong improv scenes are built on four elements: Character (who are you?), Relationship (how do you know each other?), Objective (what does your character want?), and Where (where are you?). Establishing these four elements quickly in the first minute of a scene gives both performers and the audience a clear, grounded reality to work within."},
      {"type": "text", "content": "Status is an important dramatic tool in improv. High-status characters take up space, speak with authority, and are rarely surprised. Low-status characters make themselves smaller, apologize frequently, and are easily flustered. Playing with status differences between characters creates natural drama and comedy. Notice that status can shift during a scene — a character who begins high-status might end up low-status, and that shift tells a story."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Traditional Games and Improvised Storytelling", "content": "Many First Nations and Metis communities in Saskatchewan have traditions of improvised storytelling during community gatherings. A storyteller may begin a familiar story and then improvise new details, characters, or twists to suit the occasion and the audience present. Children''s games in these communities also involve improvisational call-and-response patterns where players must react spontaneously to unexpected challenges. These traditions reinforce the same core skills as theatrical improv: listening, reacting, and building on what others offer."},
      {"type": "list", "style": "unordered", "items": ["Improv: creating drama spontaneously without a script", "Yes-and: accept your partner''s offer and add to it — never block", "CROW: Character, Relationship, Objective, Where", "Status: the relative power position of a character in a scene", "Blocking: refusing or denying a partner''s offer — undermines scenes"]},
      {"type": "quiz", "question": "What does the yes-and principle in improvisation require a performer to do?", "options": ["Agree with everything and end the scene", "Accept a partner''s offer and add something new to build on it", "Take control of the scene by planning ahead", "Wait for the other performer to finish before speaking"], "correctIndex": 1, "explanation": "Yes-and means first accepting (yes) whatever your partner offers — their character, their location, their situation — and then adding something new (and) that builds on that offer. This keeps scenes moving forward and keeps both performers equally invested."}
    ]'::jsonb,
    '[
      {"term": "Improvisation", "definition": "Creating drama spontaneously without a script, responding in the moment to a partner."},
      {"term": "Yes-And", "definition": "The core improv principle of accepting a partner''s offer and adding to it."},
      {"term": "Blocking", "definition": "Refusing or denying a partner''s offer in improvisation, which stops scenes from developing."},
      {"term": "Status", "definition": "The relative power position of a character — high-status characters command space; low-status characters make themselves smaller."},
      {"term": "CROW", "definition": "An improv framework: Character, Relationship, Objective, Where — the four elements of a grounded scene."}
    ]'::jsonb,
    'Many First Nations and Metis communities in Saskatchewan have traditions of improvised storytelling at gatherings, where a storyteller begins a familiar tale and improvises new details or characters to suit the occasion. Children''s games in these communities also use call-and-response patterns requiring spontaneous reaction to unexpected challenges. These traditions reinforce the same core skills as theatrical improvisation: deep listening, genuine reaction, and building generously on what others offer.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does yes-and mean in improvisation?', 'Accept your partner''s offer completely (yes) and add something new to build on it (and).', 'Never block. Always build.', 2, 0),
    (v_tenant, v_ch, 'What does CROW stand for?', 'Character, Relationship, Objective, Where — the four elements of a grounded improv scene.', 'Establish all four early in a scene.', 2, 1),
    (v_tenant, v_ch, 'What is status in drama?', 'The relative power position of a character — high-status or low-status — revealed through how they use space, voice, and body.', 'High status takes up space; low status shrinks.', 2, 2);

  -- UNIT 4: Dance
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Dance',
    'Learn structured dance forms with specific steps, patterns, and formations, developing technical skill alongside artistic expression.',
    'Structure in dance creates a shared language that allows many people to move together in coordination.',
    'How does learning a structured dance with specific steps develop both technical skill and artistic understanding?')
  RETURNING id INTO v_unit;

  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Structured Dance', 'structured-dance-4',
    'Explore structured dance forms including set patterns, technical footwork skills, and the role of musicality in executing choreography.',
    '[
      {"type": "heading", "level": 1, "text": "Structured Dance"},
      {"type": "text", "content": "A structured dance is a dance with a set sequence of movements that every performer learns and executes in the same way. Unlike creative movement or improvisation, structured dance requires you to recall and reproduce specific steps, timing, and formations precisely. Learning a structured dance builds technical skill, coordination, spatial awareness, and musicality."},
      {"type": "text", "content": "Footwork is the foundation of most structured dances. A step is simply transferring weight from one foot to the other. A hop is leaving the ground on one foot and landing on the same foot. A leap is leaving the ground on one foot and landing on the other. A jump leaves the ground on both feet and lands on both feet. A turn rotates the body around a vertical axis. Combining these basic actions creates the vocabulary for most dance styles."},
      {"type": "callout", "style": "info", "title": "Musicality", "content": "Musicality is a dancer''s ability to listen to and interpret music through movement. A highly musical dancer does not just move on the beat — they respond to changes in tempo, dynamics, and mood. When the music swells, they expand their movement. When the music becomes delicate, they soften their touch. Musicality transforms technically correct steps into genuinely expressive performance."},
      {"type": "text", "content": "Formations in structured dance position the group in organized shapes. A line formation has all dancers side by side. A column has dancers one behind the other. A V-shape points toward the audience. A scattered formation uses the whole stage space. Changing formations during a performance creates visual variety and tells the audience something about the relationships between dancers."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Jingle Dress Dance", "content": "The Jingle Dress Dance is a healing dance tradition that originated with the Ojibwe people and spread across many First Nations communities, including those in Saskatchewan. The dress is decorated with rows of metal cones — traditionally made from tobacco tin lids — that create a distinctive jingling sound with every step. The footwork is precise and structured, with specific steps and a defined bouncing quality. The sound of the jingles is believed to carry prayers and healing. Jingle Dress Dancers perform at powwows across Saskatchewan, and the dance has deep spiritual and community significance."},
      {"type": "list", "style": "unordered", "items": ["Structured dance: a set sequence of movements learned and performed consistently", "Step: transferring weight from one foot to the other", "Hop: one foot takes off and lands on the same foot", "Leap: one foot takes off and the other foot lands", "Jump: both feet take off and both feet land", "Musicality: responding expressively to the music''s changes in tempo, dynamics, and mood"]},
      {"type": "quiz", "question": "What is the difference between a hop and a leap?", "options": ["A hop uses both feet; a leap uses one", "A hop takes off and lands on the same foot; a leap takes off on one foot and lands on the other", "A leap is lower; a hop is higher", "There is no difference — they are the same action"], "correctIndex": 1, "explanation": "A hop takes off from one foot and lands on that same foot. A leap takes off from one foot and lands on the opposite foot. A jump takes off from two feet and lands on two feet."}
    ]'::jsonb,
    '[
      {"term": "Structured Dance", "definition": "A dance with a set sequence of steps and movements that performers learn and execute consistently."},
      {"term": "Footwork", "definition": "The specific pattern of steps, hops, leaps, and jumps that the feet perform in a dance."},
      {"term": "Musicality", "definition": "A dancer''s ability to listen to and interpret music expressively through movement."},
      {"term": "Leap", "definition": "A jump that takes off from one foot and lands on the other foot."},
      {"term": "Formation", "definition": "The organized group shape that dancers create and move within during a performance."}
    ]'::jsonb,
    'The Jingle Dress Dance is a healing tradition that originated with the Ojibwe people and spread to many First Nations communities in Saskatchewan. The dress is adorned with rows of metal cones — traditionally made from tobacco tin lids — that jingle with each structured, precise footwork step. The sound carries prayers and healing. Jingle Dress Dancers perform at powwows across Saskatchewan, and the dance holds deep spiritual, communal, and artistic significance.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is musicality in dance?', 'A dancer''s ability to listen to and interpret music expressively through movement — responding to changes in tempo, dynamics, and mood.', 'More than just moving on the beat.', 2, 0),
    (v_tenant, v_ch, 'What is the difference between a hop, leap, and jump?', 'Hop: same foot takes off and lands. Leap: one foot takes off, other lands. Jump: both feet take off and land.', 'Think about which feet are involved.', 2, 1),
    (v_tenant, v_ch, 'What is a formation in dance?', 'An organized group shape — such as a line, circle, or V — that dancers create and move within.', 'How the group is arranged on the stage or floor.', 1, 2);

END $$;


-- ============================================================================
-- TEXTBOOK: WolfWhale Arts 5
-- Slug: wolfwhale-arts-5
-- Chapters: Mixed Media Art | Music History & Genres | Scriptwriting | Cultural Dance
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-arts-5';

  -- UNIT 1: Visual Art
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Visual Art',
    'Explore mixed media art as a practice of combining multiple materials and processes within a single artwork.',
    'Combining different materials in one artwork creates layered meaning and texture impossible to achieve with a single medium.',
    'How does combining different materials and processes in one artwork expand creative possibilities?')
  RETURNING id INTO v_unit;

  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Mixed Media Art', 'mixed-media-art-5',
    'Learn to create artwork using two or more materials or techniques, exploring collage, assemblage, and combined drawing and painting.',
    '[
      {"type": "heading", "level": 1, "text": "Mixed Media Art"},
      {"type": "text", "content": "Mixed media art is artwork that combines two or more materials or artistic processes. A drawing with painted highlights is mixed media. A collage with photographs, paint, and fabric is mixed media. A sculpture made of found objects attached to a painted canvas is mixed media. There are no strict rules — the artist decides which materials to combine and why, always in service of the artwork''s idea or message."},
      {"type": "text", "content": "Collage is one of the most accessible mixed media techniques. The word collage comes from the French word coller, meaning to glue. In a collage, the artist cuts or tears pieces of paper, photographs, fabric, or other flat materials and arranges them on a surface to create a new image or composition. The original contexts of those materials — a newspaper headline, a map fragment, a page of music — bring additional layers of meaning to the artwork."},
      {"type": "callout", "style": "info", "title": "Assemblage", "content": "Assemblage is three-dimensional mixed media — artwork built by combining found objects, recycled materials, and sculptural elements. An assemblage might incorporate pieces of wood, wire, cloth, buttons, shells, and paint. The process of selecting found objects invites the artist to see ordinary objects in new ways, recognizing their shape, texture, colour, and symbolic potential."},
      {"type": "text", "content": "When planning a mixed media artwork, artists consider how the different materials will interact. Collaged paper might wrinkle when wet paint is applied over it, creating unexpected texture. A photograph embedded in a painted background creates a tension between reality and imagination. These unexpected results are part of what makes mixed media exciting — the materials themselves have agency and push back against the artist''s original plan."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Birchbark Biting and Mixed Materials", "content": "Anishinaabe and Cree artists in Saskatchewan have long practised birchbark biting — an intricate art form in which folded layers of thin birchbark are bitten with the teeth to create complex, symmetrical floral and geometric designs. The resulting perforated sheet is both a visual and a tactile artwork. Contemporary Indigenous artists in Saskatchewan such as Michelle Brass and Lori Blondeau combine traditional materials — beads, hide, birchbark — with photography, digital media, and installation to create mixed media works that speak to both cultural continuity and contemporary Indigenous identity."},
      {"type": "list", "style": "unordered", "items": ["Mixed media: combining two or more materials or processes in one artwork", "Collage: gluing cut or torn flat materials onto a surface", "Assemblage: three-dimensional artwork built from found and combined objects", "Found object: an everyday object repurposed as an art material", "The materials'' original contexts add layers of meaning to mixed media"]},
      {"type": "quiz", "question": "What is the difference between collage and assemblage?", "options": ["Collage uses paint; assemblage does not", "Collage is two-dimensional using flat materials; assemblage is three-dimensional using found objects", "Assemblage uses photographs; collage uses paint", "They are the same technique with different names"], "correctIndex": 1, "explanation": "Collage is a flat, two-dimensional technique that glues cut or torn materials onto a surface. Assemblage is three-dimensional, combining found objects and sculptural elements to build a work that exists in real space."}
    ]'::jsonb,
    '[
      {"term": "Mixed Media", "definition": "Art that combines two or more materials or artistic processes within a single work."},
      {"term": "Collage", "definition": "A two-dimensional artwork made by gluing cut or torn materials — paper, fabric, photographs — onto a surface."},
      {"term": "Assemblage", "definition": "A three-dimensional artwork built by combining found objects and sculptural materials."},
      {"term": "Found Object", "definition": "An everyday object repurposed as a material in an artwork."},
      {"term": "Medium", "definition": "The material or technique an artist uses to create a work of art (plural: media)."}
    ]'::jsonb,
    'Anishinaabe and Cree artists in Saskatchewan have practised birchbark biting for generations — folding thin birchbark layers and biting through them with the teeth to create intricate symmetrical floral and geometric designs. The result is simultaneously visual and tactile. Contemporary Indigenous artists in Saskatchewan combine traditional materials such as beads, hide, and birchbark with photography, digital media, and installation to create mixed media works addressing both cultural continuity and contemporary Indigenous experience.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is mixed media art?', 'Art that combines two or more materials or artistic processes within a single work.', 'More than one material working together.', 1, 0),
    (v_tenant, v_ch, 'What is collage?', 'A two-dimensional artwork made by gluing cut or torn materials — paper, fabric, photographs — onto a surface.', 'Coller means "to glue" in French.', 1, 1),
    (v_tenant, v_ch, 'What is assemblage?', 'A three-dimensional artwork built by combining found objects and sculptural materials.', 'Three-dimensional collage using real objects.', 2, 2);

  -- UNIT 2: Music
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Music',
    'Survey the history of western music and explore the defining characteristics of major musical genres.',
    'Music reflects the time and culture in which it was created — listening to music from different periods is a way of listening to history.',
    'How does the historical and cultural context of a piece of music shape the way it sounds and what it means?')
  RETURNING id INTO v_unit;

  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Music History & Genres', 'music-history-genres-5',
    'Survey the major periods of western music history and explore distinct musical genres including folk, blues, jazz, and contemporary pop.',
    '[
      {"type": "heading", "level": 1, "text": "Music History & Genres"},
      {"type": "text", "content": "Music has existed in every human culture throughout history. Western music history is often organized into broad periods. The Medieval period (approximately 500–1400 CE) produced Gregorian chant — unaccompanied vocal music sung in monasteries. The Renaissance (1400–1600) introduced harmony and polyphony — multiple independent melodic lines sung simultaneously. The Baroque period (1600–1750) brought ornate, complex compositions by composers such as Johann Sebastian Bach. The Classical period (1750–1820) valued clarity and balance, with composers like Wolfgang Amadeus Mozart and Joseph Haydn. The Romantic period (1820–1900) emphasized emotional expression and programmatic music — compositions that tell a story."},
      {"type": "text", "content": "The twentieth century saw an explosion of new musical genres. The blues originated in the African American communities of the American South and built on a repeating twelve-bar chord structure with expressive, often improvised vocals. Jazz grew from the blues and became one of the most sophisticated and influential art forms in history, characterized by improvisation, swing rhythm, and complex harmony. Rock emerged in the 1950s from a fusion of blues, country, and gospel. Pop music has evolved continuously to include reggae, hip hop, electronic dance music, and countless other styles."},
      {"type": "callout", "style": "info", "title": "Genre", "content": "A musical genre is a category of music defined by shared characteristics of style, rhythm, instrumentation, and cultural context. Genres are not rigid boxes — most music blends elements from multiple genres, and new genres constantly emerge from the intersection of existing ones."},
      {"type": "text", "content": "Saskatchewan has its own musical landscape. Country music has deep roots in the province, with the fiddle tradition brought by early European settlers blending with Indigenous musical practices. The Saskatoon-born band The Sheepdogs brought blues-influenced rock to international audiences. Regina has a vibrant independent music scene. Understanding the history and genres of music helps listeners place what they hear in a larger context."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Metis Fiddle Tradition", "content": "The Metis fiddle tradition is one of the most distinctive musical genres on the Canadian prairies. Metis fiddlers developed a high-energy, ornamented style that blends French-Canadian, Scottish, and Irish fiddle styles with First Nations melodic sensibilities. The music is inseparable from Metis jigging and social dance. Prominent Saskatchewan Metis fiddlers have kept this tradition alive and evolving, and Metis fiddle is now recognized as a distinct and celebrated Canadian musical genre with deep historical roots."},
      {"type": "list", "style": "unordered", "items": ["Medieval: chant | Renaissance: polyphony | Baroque: ornamentation | Classical: clarity | Romantic: emotion", "Blues: 12-bar structure, expressive vocals, improvisation", "Jazz: improvisation, swing rhythm, complex harmony", "Genre: music defined by shared style, rhythm, and cultural context", "Saskatchewan''s musical culture blends European, Indigenous, and contemporary influences"]},
      {"type": "quiz", "question": "What musical period is associated with Johann Sebastian Bach and is characterized by ornate, complex compositions?", "options": ["Medieval", "Renaissance", "Baroque", "Romantic"], "correctIndex": 2, "explanation": "The Baroque period (approximately 1600–1750) is associated with elaborate, ornate compositions featuring complex counterpoint and ornamentation. Johann Sebastian Bach is one of its most celebrated composers."}
    ]'::jsonb,
    '[
      {"term": "Genre", "definition": "A category of music defined by shared characteristics of style, rhythm, instrumentation, and cultural context."},
      {"term": "Polyphony", "definition": "Music that features two or more independent melodic lines performed simultaneously."},
      {"term": "Blues", "definition": "A genre originating in African American communities built on a repeating twelve-bar chord structure and expressive improvised vocals."},
      {"term": "Jazz", "definition": "A genre characterized by improvisation, swing rhythm, and complex harmony, developed in early twentieth-century America."},
      {"term": "Baroque Period", "definition": "A period of western music history (approximately 1600–1750) known for ornate, complex compositions."}
    ]'::jsonb,
    'The Metis fiddle tradition is one of the most distinctive musical genres on the Canadian prairies. Metis fiddlers developed a high-energy, ornamented style blending French-Canadian, Scottish, and Irish fiddle techniques with First Nations melodic sensibilities. This music is inseparable from Metis jigging and social dance. Saskatchewan Metis fiddlers have kept the tradition alive and evolving, and it is now recognized as a distinct and celebrated Canadian musical genre.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What defines a musical genre?', 'Shared characteristics of style, rhythm, instrumentation, and cultural context.', 'Think of blues vs. classical vs. hip hop.', 2, 0),
    (v_tenant, v_ch, 'What are the defining features of jazz?', 'Improvisation, swing rhythm, and complex harmony.', 'Born from the blues, one of the most influential art forms of the 20th century.', 2, 1),
    (v_tenant, v_ch, 'What period of music history is associated with J.S. Bach?', 'The Baroque period (approximately 1600–1750).', 'Think ornate, complex, contrapuntal.', 2, 2);

  -- UNIT 3: Drama
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Drama',
    'Learn the craft of scriptwriting — how playwrights create dialogue, stage directions, and dramatic structure on the page.',
    'A script is the blueprint of a play — the writer''s invisible hand guides every moment a performer experiences on stage.',
    'How do playwrights use dialogue and stage directions to create a world that performers can bring to life?')
  RETURNING id INTO v_unit;

  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Scriptwriting', 'scriptwriting-5',
    'Understand the conventions of script format and learn to write short scenes with believable dialogue, stage directions, and dramatic structure.',
    '[
      {"type": "heading", "level": 1, "text": "Scriptwriting"},
      {"type": "text", "content": "A script is the written text of a play. It contains two main elements: dialogue and stage directions. Dialogue is the speech of the characters — what they actually say to each other. Stage directions describe everything else: where characters enter and exit, how they move, what emotions they display, and details about the setting. A playwright is the writer who creates a script."},
      {"type": "text", "content": "Script format is different from story format. In a script, each character''s name is written in capital letters before their dialogue, so performers can quickly find their lines on the page. Stage directions are usually written in italics and parentheses. The setting is described at the start of each scene in a section called the scene heading or slug line. These conventions make scripts easy to read and perform."},
      {"type": "callout", "style": "info", "title": "Writing Believable Dialogue", "content": "Good dialogue sounds like something a real person in that character''s situation would actually say. Each character should have a distinct voice — their vocabulary, sentence length, and topics reflect their age, background, and personality. Avoid dialogue that exists only to give the audience information (called an expository dump). Instead, let characters reveal information naturally through conflict, need, and desire."},
      {"type": "text", "content": "Every scene needs a dramatic question — something at stake that the audience wants to know the answer to. Will the character get what they want? Will they be caught? Will they find what they are looking for? This question keeps the scene in motion. A scene ends when the dramatic question is answered — even if the answer is ''not yet.'' Good scenes end differently than they begin: something has changed, even if it is small."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Written and Oral Drama Traditions", "content": "The history of Indigenous playwriting in Saskatchewan is relatively recent but growing rapidly. Playwrights such as Floyd Favel from the Poundmaker Cree Nation have created works that blend traditional Cree oral storytelling structures with western theatrical conventions, developing a form of drama that does not separate performance from ceremony, community, and land. These plays challenge the conventions of European script format while honouring the power of the spoken word and communal storytelling."},
      {"type": "list", "style": "unordered", "items": ["Script: the written text of a play containing dialogue and stage directions", "Playwright: the writer who creates a script", "Dialogue: what characters say to each other", "Stage directions: instructions for movement, emotion, and setting in italics", "Dramatic question: the central question that keeps a scene in motion", "Each character should have a distinct, believable voice"]},
      {"type": "quiz", "question": "In script format, how are stage directions typically formatted to distinguish them from dialogue?", "options": ["Bold and underlined", "In italics and parentheses", "In ALL CAPITAL LETTERS", "In a different font size"], "correctIndex": 1, "explanation": "Stage directions in a script are written in italics and enclosed in parentheses to visually distinguish them from spoken dialogue. Character names before dialogue are written in capital letters."}
    ]'::jsonb,
    '[
      {"term": "Script", "definition": "The written text of a play, containing dialogue and stage directions."},
      {"term": "Playwright", "definition": "The writer who creates a script for stage performance."},
      {"term": "Dialogue", "definition": "The words characters speak to each other in a script."},
      {"term": "Stage Directions", "definition": "Written instructions in a script describing movement, emotion, setting, and action — not spoken aloud."},
      {"term": "Dramatic Question", "definition": "The central question at stake in a scene that keeps the audience engaged."},
      {"term": "Scene Heading", "definition": "The opening description of a scene that establishes the setting and context."}
    ]'::jsonb,
    'Floyd Favel from the Poundmaker Cree Nation is among the Indigenous playwrights from Saskatchewan who have created works blending traditional Cree oral storytelling structures with western theatrical conventions. These plays challenge European script format conventions while honouring the spoken word, communal storytelling, and the inseparability of performance from ceremony, community, and land — expanding what a script can be.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the difference between dialogue and stage directions?', 'Dialogue is what characters say. Stage directions describe movement, emotion, and setting — written in italics and parentheses.', 'One is spoken; the other guides the performer.', 2, 0),
    (v_tenant, v_ch, 'What is a dramatic question?', 'The central question at stake in a scene that keeps the audience engaged and wanting to know what happens next.', 'Something must be at stake.', 2, 1),
    (v_tenant, v_ch, 'What is a playwright?', 'The writer who creates a script for stage performance.', 'They write the blueprint every production is built on.', 1, 2);

  -- UNIT 4: Dance
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Dance',
    'Explore cultural dances from around the world, examining how each reflects the values, history, and aesthetics of its community of origin.',
    'Every culture dances — and the way a culture dances reveals what it values and how it understands the body, community, and celebration.',
    'What can a dance tell us about the culture and community it comes from?')
  RETURNING id INTO v_unit;

  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Cultural Dance', 'cultural-dance-5',
    'Study selected cultural dance traditions from around the world, analyzing how dance reflects cultural values, history, and community identity.',
    '[
      {"type": "heading", "level": 1, "text": "Cultural Dance"},
      {"type": "text", "content": "Every culture in the world has its own dance traditions. Dance is one of the most fundamental human art forms — it requires no tools, no materials, and no language to communicate. Cultural dances are dances that have developed within a specific community and carry that community''s history, values, beliefs, and identity. When we study cultural dances respectfully, we gain insight into the people who created them."},
      {"type": "text", "content": "Bharatanatyam is a classical Indian dance form from the state of Tamil Nadu. It is one of the oldest surviving classical dance traditions in the world. Bharatanatyam uses precise hand gestures called mudras, each with a specific meaning, to tell stories from Hindu mythology. Every position of the hands, eyes, and feet is codified — the result of thousands of years of refinement. Facial expression is central to the art form, conveying specific emotions called bhava."},
      {"type": "callout", "style": "info", "title": "Dance as Cultural Preservation", "content": "Cultural dances often carry stories, history, and knowledge that might otherwise be lost. When a dance tradition disappears, that knowledge disappears with it. When communities teach their dances to the next generation, they are not just sharing an art form — they are transmitting their history, worldview, and identity. This is why cultural dance education is an act of preservation as much as an act of art."},
      {"type": "text", "content": "Saman is a group dance from the Gayo people of Aceh, Indonesia. It is performed by a large group of male performers who sit in tight rows and execute synchronized clapping, chest-patting, and swaying movements with remarkable speed and precision. The dance has been recognized by UNESCO as an Intangible Cultural Heritage. It is performed at celebrations and demonstrates the values of unity, discipline, and community cooperation."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Prairie Chicken Dance", "content": "The Prairie Chicken Dance is a traditional dance of the Blackfoot Confederacy peoples, including the Siksika, Piikani, and Kainai nations, some of whom have communities in southern Saskatchewan. The dance imitates the courtship display of the sharp-tailed grouse — a prairie bird that bobs its head, stomps its feet, and fans its tail feathers in a remarkable display. The dance honours the relationship between the Plains peoples and the prairie animals they depended upon, and reflects a worldview in which humans and animals are part of one interconnected community."},
      {"type": "list", "style": "unordered", "items": ["Cultural dance carries the history, values, and identity of its community", "Bharatanatyam: classical Indian dance using mudras (hand gestures) and bhava (emotion)", "Saman: synchronized Acehnese group dance emphasizing unity and precision", "Dance as preservation: teaching cultural dance transmits history and worldview", "Saskatchewan''s multicultural population brings diverse dance traditions to the province"]},
      {"type": "quiz", "question": "In Bharatanatyam, what are the specific hand gestures with coded meanings called?", "options": ["Bhava", "Mudras", "Formations", "Motifs"], "correctIndex": 1, "explanation": "Mudras are the precise hand gestures in Bharatanatyam, each with a specific meaning used to tell stories and convey ideas. Bhava refers to the facial expressions that convey emotion in the same tradition."}
    ]'::jsonb,
    '[
      {"term": "Cultural Dance", "definition": "A dance developed within a specific community that carries its history, values, and identity."},
      {"term": "Mudra", "definition": "A codified hand gesture in Indian classical dance traditions such as Bharatanatyam, each with a specific meaning."},
      {"term": "Bhava", "definition": "The facial expression of emotion in Bharatanatyam dance."},
      {"term": "Intangible Cultural Heritage", "definition": "A UNESCO designation for living cultural practices — including dance and music — that communities recognize as part of their identity."},
      {"term": "Cultural Preservation", "definition": "The act of maintaining and transmitting cultural practices, knowledge, and identity to future generations."}
    ]'::jsonb,
    'The Prairie Chicken Dance is a traditional dance of the Blackfoot Confederacy peoples, including the Siksika, Piikani, and Kainai nations with communities near Saskatchewan. The dance imitates the courtship display of the sharp-tailed grouse — a prairie bird that bobs, stomps, and fans its tail feathers. It honours the deep relationship between Plains peoples and the prairie animals they lived alongside, reflecting a worldview in which humans and animals belong to one interconnected community.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are mudras?', 'Codified hand gestures in Indian classical dance such as Bharatanatyam, each with a specific meaning.', 'Every gesture tells part of a story.', 2, 0),
    (v_tenant, v_ch, 'Why is teaching cultural dance considered an act of preservation?', 'Because cultural dances carry history, worldview, and identity — when a tradition disappears, that knowledge disappears too.', 'Dance transmits more than steps.', 2, 1),
    (v_tenant, v_ch, 'What does Saman demonstrate as a cultural value?', 'Unity, discipline, and community cooperation — the dance requires perfectly synchronized movement from a large group.', 'Think about what it takes to move as one.', 2, 2);

END $$;


-- ============================================================================
-- TEXTBOOK: WolfWhale Arts 6
-- Slug: wolfwhale-arts-6
-- Chapters: Art Criticism | Band & Choral Music | Theatre Production | Contemporary Dance
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-arts-6';

  -- UNIT 1: Visual Art
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Visual Art',
    'Develop art criticism skills by learning to describe, analyze, interpret, and evaluate works of visual art.',
    'Art criticism is not about liking or disliking — it is a disciplined process of careful looking and thoughtful response.',
    'How do we move beyond personal taste to make a thoughtful, evidence-based response to a work of art?')
  RETURNING id INTO v_unit;

  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Art Criticism', 'art-criticism-6',
    'Learn and apply the four steps of art criticism — describe, analyze, interpret, evaluate — to works of art from diverse traditions.',
    '[
      {"type": "heading", "level": 1, "text": "Art Criticism"},
      {"type": "text", "content": "Art criticism is the practice of looking carefully at a work of art and forming a thoughtful, evidence-based response. It is not about saying whether you like or dislike a piece — it is about understanding what is in the artwork, how it is constructed, what it might mean, and how effectively it achieves its purpose. Art criticism gives us a shared vocabulary and process for discussing art seriously."},
      {"type": "text", "content": "One widely used framework for art criticism involves four steps: describe, analyze, interpret, and evaluate. In the describe step, you note everything you can observe without making judgments — subject matter, colours, materials, size, shapes, and any other observable fact. You are being a careful witness. In the analyze step, you examine how the elements of art and principles of design are used. How does the composition create balance? Where is the emphasis? How does colour create mood?"},
      {"type": "callout", "style": "info", "title": "Interpret and Evaluate", "content": "In the interpret step, you develop a thoughtful idea about what the artwork means or communicates. Your interpretation should be grounded in evidence from the artwork itself — not arbitrary. In the evaluate step, you make a judgment about how successfully the artwork achieves its purpose. Evaluation is not the same as personal preference: you are asking whether the artwork works, not whether you would hang it in your bedroom."},
      {"type": "text", "content": "Context is essential to good art criticism. Knowing when, where, and why an artwork was made changes what we see in it. A painting of the Saskatchewan landscape means something different knowing it was made by a Cree artist reclaiming visual sovereignty over Treaty territory than knowing it was made by an early European settler documenting what they saw. Context does not determine meaning, but it deepens and complicates it."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Alex Janvier", "content": "Alex Janvier, a member of the Cold Lake First Nations in Alberta and a graduate of the Alberta College of Art, is one of Canada''s most celebrated Indigenous painters. His abstract, lyrical works use curving lines and bold colour combinations that draw on his Dene Suline heritage while engaging with the traditions of western abstract art. Janvier signed the Declaration of Indian Rights for Indian Artists in 1973, asserting Indigenous artists'' right to be recognized and compensated as professional artists. His work demands exactly the kind of careful, context-aware art criticism described in this chapter."},
      {"type": "list", "style": "unordered", "items": ["Art criticism: a disciplined process of careful looking and evidence-based response", "Describe: observe and note without judgment", "Analyze: examine the use of art elements and design principles", "Interpret: develop a grounded, evidence-based idea of meaning", "Evaluate: assess how successfully the artwork achieves its purpose", "Context: historical, cultural, and personal background that deepens understanding"]},
      {"type": "quiz", "question": "In the four-step art criticism process, what happens in the analyze step?", "options": ["You form a personal opinion about whether you like the artwork", "You describe the subject matter and colours", "You examine how the elements of art and design principles are used in the composition", "You research the artist''s biography"], "correctIndex": 2, "explanation": "The analyze step involves examining how the artwork is constructed — how the artist used line, colour, balance, emphasis, contrast, and other art elements and design principles to build the composition. It comes after description and before interpretation."}
    ]'::jsonb,
    '[
      {"term": "Art Criticism", "definition": "A disciplined process of carefully examining and forming an evidence-based response to a work of art."},
      {"term": "Describe", "definition": "The first step of art criticism: observing and noting everything in the artwork without making judgments."},
      {"term": "Analyze", "definition": "The second step: examining how the elements of art and design principles are used in the artwork."},
      {"term": "Interpret", "definition": "The third step: developing a grounded, evidence-based idea about what the artwork means."},
      {"term": "Evaluate", "definition": "The fourth step: assessing how successfully the artwork achieves its purpose."},
      {"term": "Context", "definition": "The historical, cultural, and personal circumstances in which an artwork was created."}
    ]'::jsonb,
    'Alex Janvier, a Dene Suline artist from Cold Lake First Nations, is one of Canada''s most celebrated Indigenous painters. His abstract, lyrical works use curving lines and bold colour to engage both his cultural heritage and western abstract traditions. Janvier co-signed the 1973 Declaration of Indian Rights for Indian Artists, asserting that Indigenous artists deserve professional recognition and compensation. His work invites careful, context-aware art criticism that attends to both formal qualities and cultural significance.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are the four steps of art criticism?', 'Describe, Analyze, Interpret, Evaluate.', 'DAIE — in that order.', 2, 0),
    (v_tenant, v_ch, 'What is the difference between interpret and evaluate in art criticism?', 'Interpret: what does the artwork mean? Evaluate: how successfully does it achieve its purpose?', 'Meaning vs. effectiveness.', 2, 1),
    (v_tenant, v_ch, 'Why is context important in art criticism?', 'Context — when, where, and why an artwork was made — deepens and complicates what we see in it.', 'The same image can mean different things in different contexts.', 3, 2);

  -- UNIT 2: Music
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Music',
    'Develop skills in band and choral performance, including technique, blend, balance, and musical expression in an ensemble context.',
    'Playing or singing in a band or choir transforms individual musicians into a single, unified voice.',
    'What does it take for individual musicians to become a unified ensemble?')
  RETURNING id INTO v_unit;

  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Band & Choral Music', 'band-choral-music-6',
    'Explore the organization of band and choral ensembles, instrumental and vocal technique, blend, balance, and the conductor''s role.',
    '[
      {"type": "heading", "level": 1, "text": "Band & Choral Music"},
      {"type": "text", "content": "A concert band is an ensemble of wind and percussion instruments. It typically includes woodwinds (flute, clarinet, saxophone, oboe, bassoon), brass (trumpet, trombone, French horn, tuba, euphonium), and percussion (snare drum, bass drum, xylophone, timpani, cymbals). Each instrument family has its own characteristic sound, and the conductor''s job includes balancing those families so that no single section overpowers the others."},
      {"type": "text", "content": "In a choral ensemble, singers are organized into voice parts. In a standard SATB choir, the four parts are soprano (high female voices), alto (lower female voices), tenor (high male voices), and bass (lower male voices). Each part carries a different melodic line that combines with the others to create four-part harmony. The result — when blended well — is a rich, resonant sound that no single voice could achieve alone."},
      {"type": "callout", "style": "info", "title": "Blend and Balance", "content": "Blend means each performer adjusting their tone quality and volume so that no individual voice or instrument sticks out from the group. Balance means the overall volume relationship between sections is appropriate — typically, the melody should be heard slightly above the accompaniment. Achieving blend and balance requires constant, active listening from every performer."},
      {"type": "text", "content": "Intonation is the accuracy of pitch in a performance. When a group plays or sings in tune, all the pitches align and the sound is clear and resonant. When intonation is poor, the sound is murky and uncomfortable. Improving intonation requires singers and players to listen extremely carefully to the people around them and adjust their own pitch in real time. This is one of the most demanding skills in ensemble performance."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Northern Cree Singing Tradition", "content": "Northern Cree singers in communities across northern Saskatchewan maintain a powerful tradition of ceremonial and social singing that involves multiple vocal parts layering together with drum accompaniment. In many drum songs, a lead singer carries the primary melody while support singers join in at specific points, creating a form of choral harmony unique to this tradition. The precision of the singers'' entrances and the balance between the lead and support voices mirrors the demands of blend and balance in any choral ensemble."},
      {"type": "list", "style": "unordered", "items": ["Concert band: woodwinds, brass, and percussion performing together", "SATB choir: soprano, alto, tenor, bass — four-part harmony", "Blend: adjusting tone so no individual stands out from the group", "Balance: appropriate volume relationship between sections", "Intonation: the accuracy of pitch in an ensemble performance"]},
      {"type": "quiz", "question": "In a standard SATB choir, what voice part is sung by lower female voices?", "options": ["Soprano", "Alto", "Tenor", "Bass"], "correctIndex": 1, "explanation": "Alto is the lower female voice part in SATB choral music. Soprano is the higher female part. Tenor is the higher male part and bass is the lower male part."}
    ]'::jsonb,
    '[
      {"term": "Concert Band", "definition": "An ensemble of wind and percussion instruments, including woodwinds, brass, and percussion."},
      {"term": "SATB", "definition": "The four voice parts in a standard choir: soprano (high female), alto (low female), tenor (high male), bass (low male)."},
      {"term": "Blend", "definition": "Each performer adjusting their tone and volume so no individual sound stands out from the group."},
      {"term": "Balance", "definition": "The appropriate volume relationship between sections of an ensemble."},
      {"term": "Intonation", "definition": "The accuracy of pitch in a musical performance."},
      {"term": "Four-Part Harmony", "definition": "A choral texture where four different voice parts each sing a different melodic line simultaneously."}
    ]'::jsonb,
    'Northern Cree singers across communities in northern Saskatchewan maintain a powerful tradition of ceremonial and social singing with multiple vocal layers over drum accompaniment. Lead singers carry the primary melody while support singers join at specific cue points, creating a tradition-specific form of choral harmony. The precision of entrances and the balance between lead and support voices directly mirrors the demands of blend, balance, and intonation that any choral ensemble must master.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are the four voice parts in an SATB choir?', 'Soprano (high female), alto (low female), tenor (high male), bass (low male).', 'SATB — from highest to lowest.', 1, 0),
    (v_tenant, v_ch, 'What is the difference between blend and balance in an ensemble?', 'Blend: no individual stands out from the group. Balance: appropriate volume relationship between sections.', 'Blend = tone; balance = volume proportion.', 2, 1),
    (v_tenant, v_ch, 'What is intonation?', 'The accuracy of pitch in a musical performance.', 'When singers are sharp or flat, intonation is poor.', 2, 2);

  -- UNIT 3: Drama
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Drama',
    'Explore the full process of theatre production — from script analysis through design, rehearsal, and performance.',
    'Theatre production is a collaborative art form in which every role — onstage and off — is essential to the whole.',
    'What are the responsibilities of each collaborator in a theatre production, and how do they work together?')
  RETURNING id INTO v_unit;

  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Theatre Production', 'theatre-production-6',
    'Survey the roles in a theatre production including director, designer, stage manager, and performer, and understand the rehearsal-to-performance process.',
    '[
      {"type": "heading", "level": 1, "text": "Theatre Production"},
      {"type": "text", "content": "A theatrical production involves many people working together toward a single shared performance. The playwright creates the script. The director interprets the script and guides the performers and design team toward a unified artistic vision. Performers bring characters to life through voice, body, and imagination. Designers — set, costume, lighting, and sound — create the visual and sonic world of the production. The stage manager coordinates all these elements so that everything runs smoothly."},
      {"type": "text", "content": "The rehearsal process moves through several phases. During table work, the director and cast sit together and read and discuss the script — analyzing characters, identifying themes, and clarifying the story. Blocking rehearsals establish where performers move on stage. During scene work, performers develop the emotional truth of each scene. Technical rehearsals integrate lights, sound, costumes, and set. The dress rehearsal runs the whole production exactly as it will be performed for an audience."},
      {"type": "callout", "style": "info", "title": "Theatrical Design Elements", "content": "Set design creates the physical environment of the story — the furniture, architecture, and spatial relationships on stage. Costume design uses clothing and accessories to reveal character, period, and status. Lighting design shapes what the audience sees and can create mood, time of day, and focus. Sound design adds music and sound effects that support the emotional world of the play."},
      {"type": "text", "content": "The stage has its own geographic vocabulary. Centre stage is the middle of the performance area. Stage left and stage right are from the performer''s perspective — the opposite of the audience''s. Upstage is the area away from the audience; downstage is closest to the audience. This shared vocabulary allows directors and performers to communicate precisely about positioning."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Theatrical Traditions and Contemporary Indigenous Theatre", "content": "Indigenous theatre in Saskatchewan has grown significantly in recent decades. Companies such as the Gabriel Dumont Institute have supported the production of plays exploring Metis history and identity. Ceremonies, potlatches, and seasonal gatherings among Plains and northern First Nations have always incorporated elements of theatrical performance — costuming, choreography, narrative, and audience participation — long before the European theatrical tradition arrived in Canada. Contemporary Indigenous theatre artists in Saskatchewan draw from both these deep ceremonial performance roots and formal theatrical training."},
      {"type": "list", "style": "unordered", "items": ["Director: interprets the script and guides the entire production toward a unified vision", "Stage manager: coordinates all production elements to ensure smooth operation", "Blocking: the planned movement of performers on stage", "Set, costume, lighting, sound: the four main theatrical design elements", "Upstage: away from audience | Downstage: closest to audience | Stage left/right: from performer''s view"]},
      {"type": "quiz", "question": "From the performer''s perspective standing on stage facing the audience, which direction is stage left?", "options": ["To the performer''s right", "To the performer''s left", "Toward the audience", "Away from the audience"], "correctIndex": 1, "explanation": "Stage left and stage right are always described from the performer''s perspective while standing on stage facing the audience. Stage left is to the performer''s left, which is the audience''s right."}
    ]'::jsonb,
    '[
      {"term": "Director", "definition": "The artist who interprets a script and guides performers and designers toward a unified theatrical vision."},
      {"term": "Stage Manager", "definition": "The production coordinator who ensures all elements of a production run smoothly before, during, and after performances."},
      {"term": "Blocking", "definition": "The planned movement of performers on stage, established during rehearsal."},
      {"term": "Set Design", "definition": "The creation of the physical environment of a play — the scenic space performers inhabit."},
      {"term": "Upstage", "definition": "The area of the stage farthest from the audience."},
      {"term": "Downstage", "definition": "The area of the stage closest to the audience."}
    ]'::jsonb,
    'Indigenous theatre in Saskatchewan has grown substantially in recent decades. The Gabriel Dumont Institute has supported productions exploring Metis history and identity. Plains and northern First Nations ceremonial gatherings have always incorporated theatrical elements — elaborate costuming, choreography, narrative, and communal participation — long predating European theatrical traditions. Contemporary Indigenous theatre artists in Saskatchewan draw from both these deep ceremonial performance roots and formal theatrical training to create work rooted in place and community.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the director''s role in theatre production?', 'To interpret the script and guide performers and designers toward a unified artistic vision.', 'The creative leader of the whole production.', 2, 0),
    (v_tenant, v_ch, 'What is blocking?', 'The planned movement of performers on stage, established during rehearsal.', 'Where does each character stand and move?', 1, 1),
    (v_tenant, v_ch, 'What does downstage mean?', 'The area of the stage closest to the audience.', 'Moving downstage brings a performer toward the front.', 1, 2);

  -- UNIT 4: Dance
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Dance',
    'Explore contemporary dance as a form that breaks from classical traditions, emphasizing personal expression and conceptual ideas.',
    'Contemporary dance is a conversation between the dancer''s body, the music or silence, and the world they inhabit.',
    'How does contemporary dance differ from classical dance forms, and what new freedoms and responsibilities does that difference create?')
  RETURNING id INTO v_unit;

  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Contemporary Dance', 'contemporary-dance-6',
    'Explore the history, aesthetics, and movement vocabulary of contemporary dance, including release technique, contact improvisation, and site-specific work.',
    '[
      {"type": "heading", "level": 1, "text": "Contemporary Dance"},
      {"type": "text", "content": "Contemporary dance is a broad, evolving field that emerged in the twentieth century as choreographers and performers began questioning the conventions of classical ballet and modern dance. Rather than adhering to a single codified technique, contemporary dance draws from multiple movement traditions — ballet, modern, hip hop, martial arts, everyday gesture — and applies them to the exploration of personal, social, or conceptual ideas."},
      {"type": "text", "content": "One important technique in contemporary dance is release technique. Release technique uses the natural weight of the body and the force of gravity rather than muscular tension. A released dancer moves with a sense of ease and flow, allowing momentum and gravity to carry the body through space rather than forcing every movement with effort. This creates a distinctly different quality from the held, controlled postures of classical ballet."},
      {"type": "callout", "style": "info", "title": "Contact Improvisation", "content": "Contact improvisation is a duet improvisation form in which two dancers make and maintain physical contact — usually through shared weight — while moving together. The point of contact — a shoulder, a hip, a hand — becomes the shared center of the movement, and both dancers listen through their bodies to where that contact leads. Contact improvisation requires trust, sensitivity, and a willingness to give and take weight."},
      {"type": "text", "content": "Site-specific dance is choreography created for and performed in a particular non-theatre location — a riverbank, a parking lot, a grain elevator, a staircase. The site itself becomes a collaborator, with its architecture, textures, sounds, and history shaping the movement. Saskatchewan''s landscapes — prairie, boreal forest, river valleys, urban centres — offer rich sites for this kind of work."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Contemporary Indigenous Dance", "content": "Contemporary Indigenous dance artists in Saskatchewan and across Canada have created powerful new work that blends traditional movement and ceremony with contemporary choreographic practices. Artists such as Santee Smith (Haudenosaunee) and others trained in contemporary technique use movement to explore decolonization, land connection, and Indigenous identity in dialogue with tradition. Their work challenges the separation between ''traditional'' and ''contemporary,'' insisting that Indigenous dance has always evolved and will continue to do so on its own terms."},
      {"type": "list", "style": "unordered", "items": ["Contemporary dance draws from multiple traditions and applies them to personal or conceptual ideas", "Release technique: using weight, gravity, and momentum rather than muscular tension", "Contact improvisation: two dancers sharing weight and listening through touch", "Site-specific dance: choreography created for a particular non-theatre location", "Contemporary dance questions conventions rather than following them"]},
      {"type": "quiz", "question": "What is release technique in contemporary dance?", "options": ["A method of memorizing choreography quickly", "A technique that uses the body''s natural weight and gravity rather than muscular tension", "A way of releasing a partner in contact improvisation", "A technique for fast, sharp movements"], "correctIndex": 1, "explanation": "Release technique uses the natural weight of the body and the force of gravity to generate movement, creating a sense of ease and flow. It contrasts with the held, controlled muscular effort of classical ballet."}
    ]'::jsonb,
    '[
      {"term": "Contemporary Dance", "definition": "A broad, evolving dance field that draws from multiple traditions and explores personal, social, or conceptual ideas."},
      {"term": "Release Technique", "definition": "A contemporary dance approach using the body''s natural weight and gravity rather than muscular tension."},
      {"term": "Contact Improvisation", "definition": "A duet improvisation form in which two dancers maintain physical contact and share weight while moving together."},
      {"term": "Site-Specific Dance", "definition": "Choreography created for and performed in a particular non-theatre location, with the site as a collaborator."},
      {"term": "Momentum", "definition": "The force of a body in motion that can be used to carry movement forward in release technique."}
    ]'::jsonb,
    'Contemporary Indigenous dance artists in Saskatchewan and across Canada create work that blends traditional movement practices and ceremonial knowledge with contemporary choreographic approaches. This work explores decolonization, land connection, and Indigenous identity in dialogue with tradition. These artists challenge the notion that ''traditional'' and ''contemporary'' are opposites, asserting that Indigenous dance has always evolved and will continue to do so on its own terms.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What distinguishes release technique from classical ballet technique?', 'Release technique uses natural body weight and gravity. Ballet uses held, controlled muscular effort to maintain upright postures.', 'Ease vs. control.', 2, 0),
    (v_tenant, v_ch, 'What is site-specific dance?', 'Choreography created for and performed in a particular non-theatre location, with the site shaping the movement.', 'The location is a collaborator.', 2, 1),
    (v_tenant, v_ch, 'What is contact improvisation?', 'A duet improvisation form where two dancers maintain physical contact and share weight, listening through touch to guide movement.', 'Trust and physical listening.', 2, 2);

END $$;


-- ============================================================================
-- TEXTBOOK: WolfWhale Arts 7
-- Slug: wolfwhale-arts-7
-- Chapters: Digital Art | Music Technology | Devised Theatre | World Dance
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-arts-7';

  -- UNIT 1: Visual Art
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Visual Art',
    'Explore digital tools as a medium for visual art, examining how technology shapes and expands artistic possibilities.',
    'Digital art is not less creative than traditional art — the tools change, but the artistic principles remain the same.',
    'How do digital tools both enable new possibilities and introduce new constraints for the visual artist?')
  RETURNING id INTO v_unit;

  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Digital Art', 'digital-art-7',
    'Examine digital art as a legitimate fine art medium, exploring digital drawing, photo manipulation, and generative art within an art history context.',
    '[
      {"type": "heading", "level": 1, "text": "Digital Art"},
      {"type": "text", "content": "Digital art is art created using digital technology — computers, tablets, drawing software, and other electronic tools — as the primary medium. The earliest computer-generated artworks appeared in the 1960s, when mathematicians and engineers began using code to create visual patterns. Today, digital art encompasses digital painting, photo manipulation, motion graphics, 3D modelling, interactive installation, and AI-assisted image generation."},
      {"type": "text", "content": "Digital painting software such as Procreate, Adobe Photoshop, and Krita give artists an enormous range of virtual brushes, textures, and colours. Unlike physical paint, digital media allow for infinite undoing and redoing, working in layers, and making perfect copies. However, many artists note that digital tools can feel less tactile and embodied than physical materials — the resistance of paper, the smell of oil paint, and the chance of a happy accident with wet watercolour are all absent."},
      {"type": "callout", "style": "info", "title": "Raster vs. Vector Graphics", "content": "Digital images exist in two fundamental formats. Raster images are made of a grid of coloured pixels — zoom in enough and you see the individual squares. Photographs and digital paintings are raster images. Vector graphics are made of mathematical lines and curves and can be scaled to any size without losing quality. Logos and illustrations are often vector. Understanding this difference is practical knowledge for any digital artist."},
      {"type": "text", "content": "Photo manipulation combines photography with digital editing to create images that would be impossible or impractical to photograph. Artists can combine multiple photographs, alter colours and textures, remove or add elements, and blend the real with the impossible. Like all artistic choices, photo manipulation raises ethical questions: when does altering a photograph cross from art into deception? This is a question that every photographer and photo artist must consider."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Digital Storytelling and Media Arts", "content": "Indigenous artists and communities in Saskatchewan have embraced digital media as a tool for cultural preservation and expression. Digital storytelling projects capture Elders'' stories in video and audio, creating permanent records of oral traditions. Indigenous media artists use animation, video, and social media platforms to share traditional knowledge, language revitalization, and contemporary Indigenous perspectives with broad audiences. These digital works honor traditional knowledge while engaging the tools of the present."},
      {"type": "list", "style": "unordered", "items": ["Digital art uses technology as the primary creative medium", "Digital painting: virtual brushes, layers, and unlimited undo", "Raster: pixel-based images (photos, digital paintings)", "Vector: mathematically defined images that scale without quality loss", "Photo manipulation raises ethical questions about truth and representation", "Digital tools do not eliminate the need for artistic skill and intention"]},
      {"type": "quiz", "question": "What is the main difference between raster and vector digital images?", "options": ["Raster images are black and white; vector images are colour", "Raster images are made of pixels; vector images are made of mathematical lines and curves", "Vector images are always photographs; raster images are always drawings", "Raster images can be scaled without quality loss; vector images cannot"], "correctIndex": 1, "explanation": "Raster images are made of a grid of coloured pixels — they lose quality when scaled up. Vector images are defined by mathematical lines and curves and can be scaled to any size without losing sharpness."}
    ]'::jsonb,
    '[
      {"term": "Digital Art", "definition": "Art created using digital technology — software, computers, or tablets — as the primary medium."},
      {"term": "Raster Image", "definition": "A digital image made of a grid of coloured pixels, such as a photograph or digital painting."},
      {"term": "Vector Graphic", "definition": "A digital image defined by mathematical lines and curves that can be scaled without losing quality."},
      {"term": "Layer", "definition": "A separate, stackable level in digital image-editing software that allows independent editing of different parts of an image."},
      {"term": "Photo Manipulation", "definition": "Using digital editing software to alter or combine photographs to create a new image."}
    ]'::jsonb,
    'Indigenous artists and communities in Saskatchewan have embraced digital media for both cultural preservation and contemporary expression. Digital storytelling projects capture Elders'' stories in video and audio, creating permanent records of oral traditions. Indigenous media artists use animation, video, and social media to share traditional knowledge, language revitalization, and contemporary perspectives — honouring traditional knowledge while engaging the expressive tools of the present.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a raster image?', 'A digital image made of a grid of coloured pixels, such as a photograph or digital painting.', 'Zoom in far enough and you see the pixels.', 2, 0),
    (v_tenant, v_ch, 'What advantage do digital layers give an artist?', 'The ability to edit different parts of an image independently without affecting other parts.', 'Change one layer without touching the others.', 2, 1),
    (v_tenant, v_ch, 'What ethical questions does photo manipulation raise?', 'Questions about truth, deception, and the difference between artistic transformation and misleading viewers.', 'When does altering reality cross a line?', 3, 2);

  -- UNIT 2: Music
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Music',
    'Explore how technology has transformed music creation, production, and distribution over the past century.',
    'Every new music technology has changed not just how music is made, but what music sounds like and who makes it.',
    'How has recording and production technology changed what we consider possible in music?')
  RETURNING id INTO v_unit;

  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Music Technology', 'music-technology-7',
    'Survey the history and impact of music technology from early recording through digital audio workstations and electronic music production.',
    '[
      {"type": "heading", "level": 1, "text": "Music Technology"},
      {"type": "text", "content": "Music has always been shaped by the technology available to make and share it. The invention of the piano in the early 1700s expanded what keyboard music could express. The development of brass instrument valves in the 1800s gave orchestras new harmonic possibilities. But perhaps the most transformative shift in the history of music came with the invention of sound recording in the late 1800s. For the first time, a performance could be captured and reproduced — heard by people who were not in the room when it was made."},
      {"type": "text", "content": "Early recordings were made on cylinders, then shellac discs, then vinyl records, then magnetic tape. Each new format brought improvements in audio quality and longevity. Magnetic tape, developed in the mid-twentieth century, allowed recordings to be edited — cut and spliced together — for the first time. This made the recording studio a creative space, not just a documentation room. Producers like George Martin and artists like the Beatles used studio editing as a compositional tool."},
      {"type": "callout", "style": "info", "title": "Digital Audio Workstations", "content": "A Digital Audio Workstation (DAW) is software that allows musicians to record, edit, arrange, and produce music on a computer. Programs such as GarageBand, Logic Pro, Ableton Live, and FL Studio are widely used DAWs. A DAW can host virtual instruments, audio recordings, and effects processors on separate tracks, giving a single artist the power that once required a full recording studio and engineering team."},
      {"type": "text", "content": "Electronic music uses electrically generated and processed sounds as its raw material. Synthesizers generate sound electronically, allowing composers to create timbres that no acoustic instrument can produce. Drum machines generate rhythmic patterns without a drummer. Samplers record and play back any sound — a spoken word, a thunder crack, a violin note — as a playable instrument. From techno and house music to film scores and pop production, electronic instruments have reshaped the sonic landscape of the last fifty years."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Using Technology for Language and Song Preservation", "content": "First Nations and Metis communities across Saskatchewan have used recording technology as a tool for cultural and linguistic survival. Organizations such as the Gabriel Dumont Institute have recorded Elders singing traditional songs, telling stories, and speaking their languages — creating archives that can be shared with younger generations even after those Elders have passed. These recordings are powerful acts of resistance against cultural erasure and demonstrate how music technology serves community rather than commerce."},
      {"type": "list", "style": "unordered", "items": ["Sound recording transformed music by making performances reproducible", "Magnetic tape made editing and studio composition possible", "DAW: software allowing recording, editing, and production on a computer", "Synthesizer: generates electronic sounds with timbres no acoustic instrument can create", "Sampler: records any sound and makes it playable as an instrument"]},
      {"type": "quiz", "question": "What does the abbreviation DAW stand for in music production?", "options": ["Digital Audio Workstation", "Dynamic Audio Wave", "Direct Audio Writing", "Digital Artist Workspace"], "correctIndex": 0, "explanation": "DAW stands for Digital Audio Workstation — software that allows musicians to record, edit, arrange, and produce music on a computer. Popular DAWs include GarageBand, Ableton Live, and Logic Pro."}
    ]'::jsonb,
    '[
      {"term": "Sound Recording", "definition": "The technology of capturing a musical performance so it can be reproduced later."},
      {"term": "Magnetic Tape", "definition": "A recording medium that allowed audio to be edited by physically cutting and splicing the tape."},
      {"term": "DAW", "definition": "Digital Audio Workstation — software used to record, edit, arrange, and produce music on a computer."},
      {"term": "Synthesizer", "definition": "An electronic instrument that generates sound by creating and shaping electrical signals."},
      {"term": "Sampler", "definition": "A device or software that records any sound and allows it to be played back as a pitched instrument."},
      {"term": "Timbre", "definition": "The characteristic tone colour or quality of a sound that distinguishes one instrument or voice from another."}
    ]'::jsonb,
    'First Nations and Metis communities across Saskatchewan have used recording technology as a tool for cultural and linguistic survival. Organizations such as the Gabriel Dumont Institute have recorded Elders singing traditional songs, telling stories, and speaking Cree, Michif, and other languages — creating archives shared with younger generations and preserving what might otherwise be lost. These recordings are acts of resistance against cultural erasure and demonstrate music technology serving community need.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a DAW?', 'Digital Audio Workstation — software for recording, editing, arranging, and producing music on a computer.', 'GarageBand and Ableton are popular examples.', 1, 0),
    (v_tenant, v_ch, 'What made magnetic tape recording significant?', 'It allowed audio recordings to be edited — cut and spliced — for the first time, making the studio a creative compositional space.', 'Editing = creative control over time.', 2, 1),
    (v_tenant, v_ch, 'What is timbre?', 'The characteristic tone colour or quality of a sound that distinguishes one instrument or voice from another.', 'Why a flute sounds different from a violin on the same note.', 2, 2);

  -- UNIT 3: Drama
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Drama',
    'Explore devised theatre — the creation of original performance work through collaborative group process without a pre-existing script.',
    'Devised theatre puts the creative responsibility in the hands of the performers, making every collaborator a co-author.',
    'How do a group of performers collectively create an original performance from shared ideas, images, and stories?')
  RETURNING id INTO v_unit;

  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Devised Theatre', 'devised-theatre-7',
    'Learn the devised theatre process: generating material from personal and collective sources, refining through workshopping, and shaping into a cohesive performance.',
    '[
      {"type": "heading", "level": 1, "text": "Devised Theatre"},
      {"type": "text", "content": "Devised theatre is theatre created by a group of performers without starting from a finished script. Instead of a playwright handing over a text for others to interpret, the entire company generates the content together — through improvisation, movement, personal storytelling, research, and play. The result is a performance that is uniquely owned by the group that made it."},
      {"type": "text", "content": "The devising process typically begins with a stimulus — something that sparks the group''s imagination. A stimulus can be an image, a piece of music, a question, a news story, a poem, or a personal memory. The company explores the stimulus through multiple creative exercises: writing, movement, drawing, improvisation. These explorations generate raw material — fragments of text, images, characters, movement sequences — that can be selected, combined, and shaped into performance."},
      {"type": "callout", "style": "info", "title": "Workshopping", "content": "Workshopping is the process of trying out material in front of the group, receiving feedback, and refining. A workshop is not a performance — it is a safe space for experimentation. Material that does not work is discarded without judgment. Material that resonates is kept and developed. Over many workshop sessions, a devised piece gradually emerges from the chaos of possibilities."},
      {"type": "text", "content": "Dramaturgy is the practice of analyzing and shaping dramatic material — asking questions like: what is this piece about at its deepest level? Who is it for? What journey does the audience take? A dramaturg works with devising companies to help them see their work clearly and make choices that serve the piece''s emerging meaning. In a student devised piece, the teacher or the group itself can play the dramaturgical role."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Collective Creation and Community Theatre", "content": "Many Indigenous theatre and storytelling traditions in Saskatchewan are inherently collective. Stories belong to communities, not individuals, and are shaped and reshaped through communal telling. Contemporary Indigenous theatre companies across Canada — including those led by Cree, Metis, and Anishinaabe artists — often use devised and collaborative creation processes that reflect traditional community ownership of stories. This approach aligns closely with the western devised theatre process while rooting it in Indigenous values of collective responsibility and shared narrative."},
      {"type": "list", "style": "unordered", "items": ["Devised theatre: original performance created collaboratively without a pre-existing script", "Stimulus: the starting image, idea, or question that sparks the devising process", "Workshopping: trying out material, receiving feedback, and refining without judgment", "Dramaturgy: the practice of analyzing and shaping the dramatic meaning of a work", "The group is co-author — every member contributes to the creative process"]},
      {"type": "quiz", "question": "In devised theatre, what is a stimulus?", "options": ["The final script produced by the devising process", "The starting image, idea, or question that sparks the company''s creative exploration", "A note from the director about performance quality", "A technical cue in the rehearsal process"], "correctIndex": 1, "explanation": "A stimulus is the initial spark that begins a devising process — it could be an image, a piece of music, a personal story, a news item, or any other source of inspiration that the company then explores and develops into performance material."}
    ]'::jsonb,
    '[
      {"term": "Devised Theatre", "definition": "Original theatre created collaboratively by a company without starting from a finished script."},
      {"term": "Stimulus", "definition": "The starting image, idea, question, or source that sparks a devising company''s creative exploration."},
      {"term": "Workshopping", "definition": "The process of trying out material, receiving group feedback, and refining without judgment."},
      {"term": "Dramaturgy", "definition": "The practice of analyzing and shaping dramatic material to serve a work''s deeper meaning."},
      {"term": "Dramaturg", "definition": "A collaborator who helps a theatre company see their work clearly and make choices that serve its meaning."}
    ]'::jsonb,
    'Many Indigenous theatre and storytelling traditions in Saskatchewan are inherently collective — stories belong to communities, not individuals, and are shaped through communal telling. Contemporary Indigenous theatre companies led by Cree, Metis, and Anishinaabe artists often use devised and collaborative creation processes that reflect traditional community ownership of narratives. This approach connects the western devised theatre model to Indigenous values of collective responsibility and shared story.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is devised theatre?', 'Original theatre created collaboratively by a company without starting from a finished script.', 'The performers are also the writers.', 2, 0),
    (v_tenant, v_ch, 'What is a stimulus in devised theatre?', 'The starting image, idea, or question that sparks the company''s creative exploration.', 'Could be a photo, a song, a memory.', 1, 1),
    (v_tenant, v_ch, 'What is dramaturgy?', 'The practice of analyzing and shaping dramatic material to serve a work''s deeper meaning.', 'The dramaturg asks: what is this really about?', 3, 2);

  -- UNIT 4: Dance
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Dance',
    'Survey world dance traditions, examining how each form reflects the culture, history, and values of its community of origin.',
    'Studying dance from around the world expands our understanding of what the human body can do and what it can mean.',
    'What can we learn about a culture by studying its dance traditions?')
  RETURNING id INTO v_unit;

  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'World Dance', 'world-dance-7',
    'Examine selected world dance traditions including West African dance, Kathak, flamenco, and Indigenous powwow styles, analyzing each as a cultural expression.',
    '[
      {"type": "heading", "level": 1, "text": "World Dance"},
      {"type": "text", "content": "Dance takes infinitely different forms around the world, yet every tradition shares certain fundamentals: the use of the body in space and time, a relationship to music or rhythm, and a connection to the community that created it. Studying world dance builds respect for diverse cultures, deepens our understanding of the body as an expressive instrument, and reveals how universal impulses — to celebrate, mourn, pray, and communicate — take radically different forms across human cultures."},
      {"type": "text", "content": "West African dance traditions form the root of many contemporary dance and music forms around the world, including hip hop, jazz dance, tap dance, and Afro-Brazilian capoeira. West African dance is characterized by a grounded, weighted quality — the body bends toward the earth rather than striving upward as in ballet. Polyrhythm — multiple simultaneous rhythms — is central to the music that accompanies West African dance, and dancers respond to several rhythmic layers at once."},
      {"type": "callout", "style": "info", "title": "Kathak: North Indian Classical Dance", "content": "Kathak is one of the major classical dance forms of India, developed in the temples and courts of northern India. Kathak is known for rapid, precise footwork — dancers wear anklets of small bells that amplify every step — combined with graceful, expressive upper body movement and spinning turns called chakkar. Kathak tells stories through gesture, expression, and rhythmic footwork, and can be performed to both Hindu devotional music and the Hindustani classical tradition."},
      {"type": "text", "content": "Flamenco is a deeply expressive art form from the Andalusian region of southern Spain, associated with the Romani, Moorish, and Spanish cultures of that region. Flamenco is characterized by intensely rhythmic footwork, dramatic hand and arm movements, and a piercing, soulful vocal style. The emotional content of flamenco — called duende — is a kind of dark, raw emotion that defies easy description. Flamenco performers, including both dancers (bailaores and bailaoras) and singers (cantaores), engage in a real-time creative conversation."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Powwow Dance Styles", "content": "Powwow culture in Saskatchewan encompasses numerous distinct dance styles, each with its own regalia, movement vocabulary, and ceremonial history. Traditional dance styles honour ancestral movement forms. Grass Dance, Fancy Dance, Fancy Shawl, Jingle Dress, and Chicken Dance each have specific step requirements, timing, and regalia conventions. Intertribal dances welcome everyone regardless of nation or background. Powwows held across Saskatchewan — at Wanuskewin, Federation of Sovereign Indigenous Nations gatherings, and community events — are opportunities to witness some of North America''s most sophisticated and beautiful dance traditions."},
      {"type": "list", "style": "unordered", "items": ["West African dance: grounded, earth-oriented quality; polyrhythmic musical accompaniment", "Kathak: rapid footwork with bell anklets, expressive upper body, spinning chakkar turns", "Flamenco: rhythmic footwork, dramatic arm movement, duende — raw emotional intensity", "Powwow dance: multiple distinct styles, each with specific regalia and movement vocabulary", "World dance study builds cultural respect and expands movement understanding"]},
      {"type": "quiz", "question": "What term in flamenco describes the raw, dark emotional intensity that defines the art form at its deepest level?", "options": ["Chakkar", "Polyrhythm", "Duende", "Bhava"], "correctIndex": 2, "explanation": "Duende is the concept in flamenco of a piercing, raw, dark emotional quality — almost a trance state — that the best flamenco performers and audiences experience. It is central to what makes flamenco distinct from merely technical dance performance."}
    ]'::jsonb,
    '[
      {"term": "Polyrhythm", "definition": "Two or more different rhythmic patterns occurring simultaneously in a piece of music."},
      {"term": "Kathak", "definition": "A North Indian classical dance form known for rapid bell-anklet footwork, expressive gestures, and spinning turns."},
      {"term": "Flamenco", "definition": "A Spanish dance and music tradition from Andalusia characterized by rhythmic footwork, dramatic arm movement, and emotional intensity."},
      {"term": "Duende", "definition": "The raw, dark emotional intensity that defines the most powerful flamenco performances."},
      {"term": "Powwow", "definition": "A social and ceremonial gathering of First Nations and Indigenous peoples featuring dance, drumming, and community celebration."}
    ]'::jsonb,
    'Powwow culture in Saskatchewan encompasses numerous distinct dance styles, each with its own regalia, movement vocabulary, and ceremonial history. Grass Dance, Fancy Dance, Fancy Shawl, Jingle Dress, and Chicken Dance each carry specific traditions and conventions. Intertribal dances welcome all participants. Powwows at Wanuskewin and Federation of Sovereign Indigenous Nations gatherings are opportunities to witness some of North America''s most sophisticated and beautiful dance traditions alive and evolving.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is polyrhythm?', 'Two or more different rhythmic patterns occurring simultaneously.', 'Central to West African music and dance.', 2, 0),
    (v_tenant, v_ch, 'What is Kathak known for?', 'Rapid, precise footwork with bell anklets, expressive upper body movement, and spinning chakkar turns.', 'The bells amplify every step.', 2, 1),
    (v_tenant, v_ch, 'What is duende in flamenco?', 'The raw, dark emotional intensity that defines the most powerful flamenco performances.', 'Almost untranslatable — a deep emotional truth.', 3, 2);

END $$;


-- ============================================================================
-- TEXTBOOK: WolfWhale Arts 8
-- Slug: wolfwhale-arts-8
-- Chapters: Photography & Film | Songwriting | Directing & Design | Dance Composition
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-arts-8';

  -- UNIT 1: Visual Art
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Visual Art',
    'Explore photography and film as visual art forms, analyzing composition, light, narrative, and the ethics of the image.',
    'Every photograph is a choice — of subject, angle, light, and moment — that constructs rather than simply records reality.',
    'In what ways is photography an art form rather than simply a recording device?')
  RETURNING id INTO v_unit;

  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Photography & Film', 'photography-film-8',
    'Examine photographic composition, the role of light, film language (shots, angles, editing), and the ethical responsibilities of the image-maker.',
    '[
      {"type": "heading", "level": 1, "text": "Photography & Film"},
      {"type": "text", "content": "Photography was invented in the 1830s and immediately transformed how humans understood images, time, and representation. A photograph captures a specific instant — one 500th of a second on a winter morning in Regina, the moment before a child laughs on the banks of the Qu''Appelle River. The camera freezes what the eye cannot hold still. But photography is far more than mechanical recording — every photograph involves dozens of creative decisions that determine what the image means."},
      {"type": "text", "content": "Composition in photography follows many of the same principles as visual art. The rule of thirds suggests dividing the frame into a 3x3 grid and placing the main subject at one of the four intersection points rather than dead centre. Leading lines are lines within the photograph — a fence, a road, a river — that draw the eye toward the main subject. Framing uses elements within the scene — a doorway, branches, an archway — to frame the main subject and focus attention."},
      {"type": "callout", "style": "info", "title": "Film Language", "content": "Film tells stories through a specific visual language. A wide shot establishes location and context. A medium shot shows characters from the waist up. A close-up fills the frame with a face or object, creating emotional intimacy. A point-of-view shot shows what a character sees. Editing — cutting between shots — creates rhythm, emphasis, and narrative. Every cut is a choice about what the audience sees and when."},
      {"type": "text", "content": "Light is the fundamental material of both photography and film. Natural light — the golden warmth of a prairie sunset, the harsh midday shadow on a grain elevator — shapes the mood of every outdoor image. Artificial lighting in film production can be controlled precisely, using three-point lighting: a key light (the main source), a fill light (softening shadows), and a back light (separating the subject from the background). The quality of light — hard or soft, warm or cool, directional or diffuse — transforms how a subject appears."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Photography, Sovereignty, and the Gaze", "content": "The history of photography in Indigenous communities is complicated. Early photographers — often government agents or missionaries — used cameras to document Indigenous peoples according to their own categories and assumptions, creating images that stripped subjects of agency and humanity. Contemporary Indigenous photographers such as Greg Staats and Nadya Kwandibens have reclaimed the camera as a tool of self-representation, creating portraits that insist on the full humanity, dignity, and contemporary presence of their subjects. In Saskatchewan, many Indigenous communities have developed protocols about who may photograph ceremonies and sacred activities, asserting control over their own visual representation."},
      {"type": "list", "style": "unordered", "items": ["Photography: creative decisions about subject, light, angle, and moment construct meaning", "Rule of thirds: place subjects at grid intersections rather than dead centre", "Leading lines: direct the eye toward the subject", "Wide / medium / close-up shots: establish context, show characters, create intimacy", "Three-point lighting: key, fill, and back light", "Indigenous communities hold the right to control their own visual representation"]},
      {"type": "quiz", "question": "In three-point lighting for film and photography, what is the purpose of the fill light?", "options": ["To create the main light source on the subject", "To separate the subject from the background", "To soften and reduce harsh shadows created by the key light", "To create a rim of light around the subject''s edges"], "correctIndex": 2, "explanation": "The fill light in three-point lighting softens and reduces the harsh shadows created by the key light (the main source). The back light separates the subject from the background by creating a rim of light on the edges."}
    ]'::jsonb,
    '[
      {"term": "Composition", "definition": "The arrangement of visual elements within a photographic or film frame."},
      {"term": "Rule of Thirds", "definition": "A composition guideline suggesting placing the main subject at one of four grid intersection points rather than the centre."},
      {"term": "Leading Lines", "definition": "Lines within a photograph that direct the viewer''s eye toward the main subject."},
      {"term": "Close-Up", "definition": "A film shot that fills the frame with a face or object, creating emotional intimacy."},
      {"term": "Three-Point Lighting", "definition": "A standard film lighting setup using a key light (main source), fill light (shadow softener), and back light (subject separator)."},
      {"term": "Visual Sovereignty", "definition": "The right of a community or individual to control how they are photographed and represented in images."}
    ]'::jsonb,
    'The history of photography in Indigenous communities is fraught — early photographers often documented Indigenous peoples according to colonial assumptions, stripping subjects of agency. Contemporary Indigenous photographers have reclaimed the camera as a tool of self-representation. Many Saskatchewan Indigenous communities have established protocols about ceremony and sacred activity photography, asserting visual sovereignty — the right to control their own representation.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the rule of thirds in photography?', 'A composition guideline suggesting placing the main subject at one of four grid intersection points rather than the centre of the frame.', 'Divide the frame into a 3x3 grid.', 2, 0),
    (v_tenant, v_ch, 'What does a close-up shot do in film?', 'Fills the frame with a face or object, creating emotional intimacy and drawing viewer attention to specific detail.', 'The most emotionally intense standard shot.', 2, 1),
    (v_tenant, v_ch, 'What is visual sovereignty?', 'The right of a community or individual to control how they are photographed and represented in images.', 'Who gets to decide how you appear?', 3, 2);

  -- UNIT 2: Music
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Music',
    'Explore songwriting as a craft that combines melody, harmony, rhythm, lyrics, and structure into a complete musical statement.',
    'A great song is both a technical achievement and a personal act of expression — the best songs do both at once.',
    'What makes a song memorable, and how do songwriters make the craft choices that produce that effect?')
  RETURNING id INTO v_unit;

  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Songwriting', 'songwriting-8',
    'Study the craft elements of songwriting: lyric writing, verse-chorus-bridge structure, melodic hook, harmonic progression, and the creative process.',
    '[
      {"type": "heading", "level": 1, "text": "Songwriting"},
      {"type": "text", "content": "A song is one of the most concentrated art forms humans have created — in three to four minutes, a song can tell a story, articulate an emotion, or create a world. The best songs feel inevitable: like they could not have been written any other way. But behind that apparent simplicity is a craft built on hundreds of micro-decisions about melody, harmony, rhythm, and lyrics that all work together to create a unified emotional experience."},
      {"type": "text", "content": "Most popular songs use a verse-chorus-bridge structure. Verses advance the story or develop the song''s ideas — they often change lyrics between repetitions. The chorus is the emotional and melodic high point — it contains the hook and is repeated multiple times. The bridge provides contrast and arrives late in the song, often offering a new perspective before returning to the chorus for a final time. This structure creates a satisfying arc for the listener."},
      {"type": "callout", "style": "info", "title": "The Hook", "content": "A hook is a short, memorable musical idea — usually in the melody or the lyric — that captures the listener''s attention and makes a song unforgettable. A hook might be a single repeated phrase (''Let it go, let it go''), a melodic pattern over two bars, or a rhythmic riff in the introduction. The best hooks feel simple and inevitable but are actually the product of significant creative effort."},
      {"type": "text", "content": "Lyric writing is a specialized form of creative writing with specific constraints: lyrics must scan (fit the rhythm of the melody), rhyme (often, though not always), and say something meaningful or interesting in very few words. Strong lyrics use specific, concrete imagery rather than vague abstractions. ''A red canoe pulled up on sand'' is stronger than ''a boat by the water.'' The specific detail makes the listener feel they are there."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Contemporary Indigenous Songwriting", "content": "Contemporary Indigenous songwriters in Saskatchewan and across Canada have created powerful bodies of work that address Indigenous identity, resilience, history, and joy. Artists such as Buffy Sainte-Marie (Piapot Cree), who has been writing songs since the 1960s, have used the popular song form to carry messages about Indigenous rights and sovereignty to international audiences. Younger Saskatchewan-connected Indigenous artists continue this tradition, blending Cree language phrases, traditional melodic sensibilities, and contemporary production. These songs demonstrate that songwriting is a living art form inseparable from its cultural context."},
      {"type": "list", "style": "unordered", "items": ["Verse-chorus-bridge: the foundational structure of most popular songs", "Hook: the short, memorable musical idea that makes a song stick", "Lyrics must scan (fit the melody), often rhyme, and use specific imagery", "Chord progression: the repeating sequence of chords that provides harmonic foundation", "The best songs create a complete emotional arc from beginning to end"]},
      {"type": "quiz", "question": "In a verse-chorus-bridge song structure, what is the primary purpose of the bridge?", "options": ["To repeat the chorus with new instruments", "To introduce the song''s main hook for the first time", "To provide contrast and a new perspective before the final chorus", "To slow the song down before the final verse"], "correctIndex": 2, "explanation": "The bridge in a verse-chorus-bridge structure provides contrast — it arrives late in the song with a different melody, harmony, or lyrical perspective, creating a moment of change before the final return to the chorus."}
    ]'::jsonb,
    '[
      {"term": "Verse", "definition": "A section of a song that advances the story or develops ideas, often with changing lyrics between repetitions."},
      {"term": "Chorus", "definition": "The repeated section of a song containing the hook and the emotional high point."},
      {"term": "Bridge", "definition": "A contrasting section in a song that arrives late and offers a new perspective before the final chorus."},
      {"term": "Hook", "definition": "A short, memorable musical idea — in melody or lyric — that makes a song unforgettable."},
      {"term": "Chord Progression", "definition": "A repeating sequence of chords that provides the harmonic foundation of a song."},
      {"term": "Scan", "definition": "The fit of lyrics to the rhythm of a melody — lyrics that scan feel natural and effortless in the song."}
    ]'::jsonb,
    'Contemporary Indigenous songwriters in Saskatchewan and across Canada have created significant bodies of work addressing Indigenous identity, resilience, history, and joy. Buffy Sainte-Marie (Piapot Cree) has used the popular song form to carry messages about Indigenous rights to international audiences since the 1960s. Younger Saskatchewan-connected Indigenous artists continue this tradition, blending Cree language phrases, traditional melodic sensibilities, and contemporary production — demonstrating that songwriting is a living art form inseparable from cultural context.',
    25, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a hook in songwriting?', 'A short, memorable musical idea — in melody or lyric — that makes a song unforgettable.', 'The part stuck in your head after one listen.', 2, 0),
    (v_tenant, v_ch, 'What is the purpose of the bridge in a song?', 'To provide contrast and a new perspective, arriving late in the song before the final chorus.', 'Something different before the end.', 2, 1),
    (v_tenant, v_ch, 'What does it mean for lyrics to scan?', 'The lyrics fit the rhythm of the melody naturally — the syllables align with the musical beat without forcing or awkwardness.', 'They flow without strain.', 2, 2);

  -- UNIT 3: Drama
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Drama',
    'Explore directing and theatrical design as interpretive and creative arts that translate a script into a live performance experience.',
    'A director and design team do not decorate a script — they re-imagine it as a three-dimensional, time-based experience.',
    'How do directorial and design choices shape an audience''s experience of a play?')
  RETURNING id INTO v_unit;

  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Directing & Design', 'directing-design-8',
    'Examine the director''s interpretive process and the creative roles of set, costume, lighting, and sound designers in theatrical production.',
    '[
      {"type": "heading", "level": 1, "text": "Directing & Design"},
      {"type": "text", "content": "The director is the artistic interpreter of a script — the person who decides what the play means and how that meaning will be communicated through every element of production. A director reads a script many times, identifying its themes, its world, its emotional arc, and the questions it raises. From these readings emerges a concept — a unifying idea that guides every design and performance decision."},
      {"type": "text", "content": "The directorial concept shapes the world of the production. A director might decide to set a Shakespeare play in 1920s Chicago, or to set a contemporary Canadian play in the abstract space of memory rather than a realistic location. The concept is not a gimmick — it is a lens that allows the director and design team to make consistent, meaningful choices that deepen the audience''s experience of the play''s themes."},
      {"type": "callout", "style": "info", "title": "The Design Process", "content": "Designers work closely with the director to translate the concept into physical and sonic reality. Set designers create scale models of the stage space. Costume designers sketch and research the clothing that will reveal character, period, and status. Lighting designers plot the placement and colour of every lighting instrument. Sound designers select or create music and sound effects that support the emotional world. All these elements are integrated through regular production meetings."},
      {"type": "text", "content": "One of the director''s most important tools is composition — the visual arrangement of performers on stage at any given moment. A tableau is a frozen stage picture. Directors think about every important moment as a potential tableau: where does each character stand? What do the spatial relationships between bodies say about power, connection, and isolation? Upstage characters command attention by pulling other characters'' focus away from the audience."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Land-Based Performance and Environmental Theatre", "content": "Some of the most innovative theatrical work connected to Saskatchewan''s Indigenous communities happens outside conventional theatre buildings. Land-based performances — held on riverbanks, in boreal forest clearings, at sacred prairie sites — take the concept of site-specific theatre into dialogue with the land itself. These performances draw on the ceremonial relationship between Indigenous communities and specific places on the land, creating theatrical experiences that are inseparable from the environmental and spiritual significance of their location."},
      {"type": "list", "style": "unordered", "items": ["Director: the artistic interpreter who develops a unifying concept for the production", "Concept: the guiding idea that shapes every design and performance decision", "Design team: set, costume, lighting, sound — each translating the concept into sensory reality", "Tableau: a frozen stage picture that communicates through the composition of bodies in space", "Production meetings: where director and designers integrate their contributions into a unified whole"]},
      {"type": "quiz", "question": "In theatrical directing, what is a concept?", "options": ["The director''s preferred acting style", "A unifying idea that guides every design and performance decision in a production", "A summary of the plot for the audience program", "The physical layout of the stage space"], "correctIndex": 1, "explanation": "A directorial concept is the guiding interpretive idea that shapes all aspects of a production — it might be a metaphor, a setting shift, a thematic emphasis, or a visual aesthetic. All design and performance decisions are filtered through this concept to create a unified experience."}
    ]'::jsonb,
    '[
      {"term": "Concept", "definition": "The director''s unifying interpretive idea that guides all design and performance decisions in a production."},
      {"term": "Tableau", "definition": "A frozen stage picture that communicates through the spatial arrangement of performers."},
      {"term": "Production Meeting", "definition": "A regular gathering of the director and design team to integrate and align all production elements."},
      {"term": "Scale Model", "definition": "A miniature three-dimensional representation of the stage set, built by the set designer for planning."},
      {"term": "Composition", "definition": "The visual arrangement of performers in the stage space at any given moment."}
    ]'::jsonb,
    'Some of the most innovative theatre connected to Saskatchewan''s Indigenous communities happens outside conventional buildings. Land-based performances — held on riverbanks, in boreal clearings, or at sacred prairie sites — take site-specific theatre into dialogue with the land itself. These performances draw on ceremonial relationships between Indigenous communities and specific places, creating theatrical experiences inseparable from the environmental and spiritual significance of their location.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a directorial concept?', 'The director''s unifying interpretive idea that guides all design and performance decisions in a production.', 'It answers: what is this production really about?', 3, 0),
    (v_tenant, v_ch, 'What is a tableau in theatre?', 'A frozen stage picture that communicates through the spatial arrangement of performers.', 'A still image made of bodies.', 2, 1),
    (v_tenant, v_ch, 'What do set designers use to plan the stage space?', 'Scale models — miniature three-dimensional representations of the set.', 'A small model to plan the full-size space.', 2, 2);

  -- UNIT 4: Dance
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Dance',
    'Apply advanced choreographic principles to compose a complete dance work, considering structure, theme, and the relationship between movement and music.',
    'A composed dance is a complete artistic statement — every movement choice serves the whole and nothing is arbitrary.',
    'How do choreographers make principled decisions that serve the unified artistic vision of a complete dance work?')
  RETURNING id INTO v_unit;

  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Dance Composition', 'dance-composition-8',
    'Study advanced choreographic tools including theme and variation, spatial design, dynamic contrast, and the relationship between dance and its accompanying sound.',
    '[
      {"type": "heading", "level": 1, "text": "Dance Composition"},
      {"type": "text", "content": "Dance composition at the advanced level is the art of making principled choreographic decisions that serve a unified artistic vision. Every movement choice — a direction, a level change, a moment of stillness — should serve the piece''s theme and contribute to the audience''s experience. A composed dance is not a collection of steps: it is a complete artistic statement with a beginning, development, and conclusion."},
      {"type": "text", "content": "Theme and variation is a fundamental compositional technique. The choreographer establishes a clear movement theme — a specific gesture, dynamic quality, or spatial pattern — and then develops the piece by varying that theme: changing its speed, size, level, direction, or dynamic quality while maintaining its essential identity. This creates both coherence (the audience recognizes the theme) and interest (each variation surprises them)."},
      {"type": "callout", "style": "info", "title": "Spatial Design in Choreography", "content": "Spatial design refers to the deliberate use of stage space as a compositional element. A choreographer thinks about the pathways dancers travel — straight lines, spirals, diagonals, circles. They think about the relationship between dancers in space: far apart or close together, facing each other or away, touching or isolated. The geometry of the space at every moment is as expressive as the movements themselves."},
      {"type": "text", "content": "Dynamic contrast is one of the most powerful tools in a choreographer''s vocabulary. A moment of stillness after intense movement is more powerful than either would be alone. A sudden shift from flowing, sustained movement to sharp, percussive movement creates surprise and focus. Managing the dynamic arc of a full piece — knowing when to build tension, when to release it, when to rest, and when to demand maximum energy — is the mark of an experienced choreographer."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Sacred and Seasonal Choreography", "content": "Many First Nations ceremonial dances in Saskatchewan are carefully choreographed with specific movement sequences, spatial formations, and relational structures that have been maintained for generations. The Sun Dance of the Plains Cree involves specific directional orientations, spatial relationships between participants, and movement sequences tied to the ceremony''s spiritual meaning. While these sacred dances are not public performances, they demonstrate that sophisticated choreographic thinking — spatial design, thematic development, dynamic arc — is not exclusive to the western concert dance tradition."},
      {"type": "list", "style": "unordered", "items": ["Theme and variation: establish a movement theme, then develop it through changes in speed, size, level, or direction", "Spatial design: deliberate use of pathways, formations, and relationships between dancers in space", "Dynamic contrast: alternating qualities of movement create surprise, focus, and emotional arc", "Stillness: a choreographic tool as powerful as any movement", "A complete dance work has beginning, development, and conclusion — a full artistic arc"]},
      {"type": "quiz", "question": "In choreography, what is spatial design?", "options": ["The lighting design for a dance performance", "The deliberate use of stage space — pathways, formations, and dancer relationships — as a compositional element", "The physical size of the stage", "The music chosen to accompany the dance"], "correctIndex": 1, "explanation": "Spatial design in choreography is the intentional use of the performance space as an expressive element — the paths dancers travel, their proximity to each other, and the geometric shapes they form with their bodies and pathways all contribute to meaning."}
    ]'::jsonb,
    '[
      {"term": "Theme and Variation", "definition": "A compositional technique of establishing a movement idea and then developing it through systematic changes."},
      {"term": "Spatial Design", "definition": "The deliberate use of stage space — pathways, formations, and spatial relationships between dancers — as a choreographic element."},
      {"term": "Dynamic Contrast", "definition": "Alternating between different movement qualities — such as sustained and percussive, or fast and slow — to create emotional impact."},
      {"term": "Dynamic Arc", "definition": "The overall shape of a dance''s energy level and intensity from beginning to end."},
      {"term": "Stillness", "definition": "A moment of no movement used as a deliberate choreographic choice to create emphasis or contrast."}
    ]'::jsonb,
    'Many First Nations ceremonial dances in Saskatchewan involve carefully maintained choreographic structures — specific movement sequences, spatial formations, and directional orientations tied to spiritual meaning that have been passed down for generations. The Sun Dance of the Plains Cree, for example, uses specific spatial relationships and movement sequences as integral parts of ceremony. These traditions demonstrate that sophisticated choreographic thinking is not exclusive to western concert dance.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is theme and variation in dance composition?', 'Establishing a movement idea and then developing it through changes in speed, size, level, direction, or dynamic quality.', 'Same idea, different expression each time.', 3, 0),
    (v_tenant, v_ch, 'What is dynamic contrast in choreography?', 'Alternating between different movement qualities — such as sustained and sharp — to create surprise, focus, and emotional impact.', 'Stillness after intensity is a classic example.', 3, 1),
    (v_tenant, v_ch, 'What is spatial design in choreography?', 'The deliberate use of stage space — pathways, formations, and spatial relationships — as a choreographic element.', 'The geometry of the space expresses meaning.', 3, 2);

END $$;


-- ============================================================================
-- TEXTBOOK: WolfWhale Arts 9
-- Slug: wolfwhale-arts-9
-- Chapters: Portfolio Development | Music Performance & Theory | Advanced Theatre | Dance Critique
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book   UUID;
  v_unit   UUID;
  v_ch     UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-arts-9';

  -- UNIT 1: Visual Art
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Visual Art',
    'Develop a professional artist portfolio that represents growth, artistic identity, and the ability to reflect on creative process.',
    'A portfolio is not just a collection of finished work — it is an argument about who you are as an artist and where you are going.',
    'What does a portfolio reveal about an artist, and how do you make intentional choices about what to include and why?')
  RETURNING id INTO v_unit;

  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Portfolio Development', 'portfolio-development-9',
    'Learn to curate, present, and write reflectively about an artist portfolio that demonstrates growth, artistic voice, and intentional creative process.',
    '[
      {"type": "heading", "level": 1, "text": "Portfolio Development"},
      {"type": "text", "content": "A portfolio is a curated collection of an artist''s work, selected and organized to communicate something about that artist''s abilities, development, and identity. The word curated is key — a portfolio is not a dump of everything you have made. It is a deliberate selection of pieces that together tell a story: this is who I am as an artist, these are the questions I explore, this is the range of my abilities, and this is where I am going."},
      {"type": "text", "content": "Selecting work for a portfolio requires honest self-assessment. You must be able to evaluate your own work critically — not harshly, but honestly. What are the strongest pieces in your body of work? Strength does not always mean technical perfection: a piece that took creative risks and partly succeeded may be more interesting to include than a technically flawless piece that plays it safe. Ask: does this piece show something important about my artistic thinking?"},
      {"type": "callout", "style": "info", "title": "Artist Statement", "content": "An artist statement is a short written piece — typically one to three paragraphs — in which an artist describes their work, their themes, their process, and their identity as an artist. It is written in first person and in plain language. An artist statement is not a list of techniques used — it is an articulation of why you make what you make. Writing one forces you to clarify your own thinking about your art."},
      {"type": "text", "content": "Process documentation is increasingly valued in arts education and in professional art practice. A sketchbook, a series of photographs of a work in progress, written notes from the creation process — these document not just what you made but how you thought through the problem of making it. Including process documentation in a portfolio shows that your artistic decisions are intentional rather than accidental, and it gives viewers insight into your creative mind."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Living and Evolving Artistic Traditions", "content": "Contemporary Indigenous artists from Saskatchewan — painters, sculptors, digital artists, fibre artists — are building portfolios that navigate a complex dual identity: deeply rooted in their Nations'' artistic traditions while also fully engaged with the western art world''s institutions and markets. Artists such as Edward Poitras (Metis and Gordon First Nation), whose installations explore Indigenous identity, history, and landscape, demonstrate that an Indigenous artist''s portfolio can carry the full weight of cultural complexity without being reduced to either ''traditional'' or ''contemporary.'' A portfolio is a living document of a living artistic identity."},
      {"type": "list", "style": "unordered", "items": ["Portfolio: a curated selection of work that tells a story about your artistic identity and development", "Curation: intentional selection — not everything you''ve made, but the right pieces", "Artist statement: a first-person explanation of why you make what you make", "Process documentation: sketchbooks, in-progress photos, notes that show your creative thinking", "Self-assessment: the honest critical evaluation of your own work''s strengths and weaknesses"]},
      {"type": "quiz", "question": "What is the primary purpose of an artist statement in a portfolio?", "options": ["To list the techniques and materials used in each piece", "To describe the artist''s biography and education", "To articulate why the artist makes what they make — their themes, process, and artistic identity", "To explain the monetary value of the work"], "correctIndex": 2, "explanation": "An artist statement explains why an artist makes what they make — it articulates themes, process, and artistic identity in plain, first-person language. It is not a technical list or a biography, but a personal and reflective piece of writing."}
    ]'::jsonb,
    '[
      {"term": "Portfolio", "definition": "A curated collection of an artist''s work selected to communicate their abilities, development, and artistic identity."},
      {"term": "Curation", "definition": "The intentional selection and organization of work to communicate a specific story or argument."},
      {"term": "Artist Statement", "definition": "A short first-person piece in which an artist articulates why they make what they make — their themes, process, and identity."},
      {"term": "Process Documentation", "definition": "Records of the creative process — sketchbooks, drafts, in-progress photographs — that reveal how a work was made."},
      {"term": "Self-Assessment", "definition": "The honest critical evaluation of one''s own work to identify strengths, weaknesses, and areas for growth."}
    ]'::jsonb,
    'Contemporary Indigenous artists from Saskatchewan are building portfolios that navigate a dual artistic identity — deeply rooted in their Nations'' traditions while engaged with western art institutions and markets. Edward Poitras, a Metis and Gordon First Nation installation artist, creates work exploring Indigenous identity, history, and landscape that demonstrates how an Indigenous artist''s portfolio can carry the full weight of cultural complexity. A portfolio is a living document of a living artistic identity.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the difference between a portfolio and a collection of all your work?', 'A portfolio is curated — intentionally selected pieces that together communicate your artistic identity and development. A collection is everything.', 'Portfolio = curated; collection = everything.', 2, 0),
    (v_tenant, v_ch, 'What is an artist statement?', 'A short first-person piece articulating why the artist makes what they make — their themes, process, and artistic identity.', 'Not a list of techniques — a personal explanation of artistic purpose.', 2, 1),
    (v_tenant, v_ch, 'Why is process documentation valuable in a portfolio?', 'It shows that artistic decisions are intentional, giving viewers insight into the creator''s thinking process, not just the finished result.', 'The journey matters as much as the destination.', 3, 2);

  -- UNIT 2: Music
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Music',
    'Integrate performance skills and music theory knowledge in preparation for senior-level music performance and study.',
    'Advanced musical performance is the intersection of deep theoretical understanding and expressive personal interpretation.',
    'How does theoretical knowledge deepen and expand expressive musical performance?')
  RETURNING id INTO v_unit;

  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Music Performance & Theory', 'music-performance-theory-9',
    'Integrate intermediate music theory — scales, modes, intervals, chord functions — with performance practice and musical interpretation.',
    '[
      {"type": "heading", "level": 1, "text": "Music Performance & Theory"},
      {"type": "text", "content": "Advanced music performance is inseparable from theoretical understanding. A musician who understands why a piece is structured the way it is — what key it is in, how the harmony functions, what form it uses, what style period it belongs to — can make more informed and more expressive interpretive decisions. Theory is not a cage that restricts musical freedom; it is a map that helps musicians navigate the landscape of sound with greater clarity and intention."},
      {"type": "text", "content": "A scale is an ordered sequence of pitches within a specific pattern of intervals. The major scale uses the pattern whole-whole-half-whole-whole-whole-half (W-W-H-W-W-W-H). The natural minor scale uses whole-half-whole-whole-half-whole-whole (W-H-W-W-H-W-W). Different scale patterns create different emotional colours: major scales feel bright and resolved, minor scales feel darker and more complex. Modes are scale patterns derived from the major scale starting on different degrees."},
      {"type": "callout", "style": "info", "title": "Chord Functions", "content": "In tonal music, chords have specific functions based on their relationship to the tonic (home chord). The I chord (tonic) is home — stable and resolved. The V chord (dominant) creates tension that urgently wants to resolve back to I. The IV chord (subdominant) provides a gentler, less urgent tension. Understanding these functions allows performers to shape phrases expressively — leaning into the tension of a V chord, relaxing into the resolution of the I."},
      {"type": "text", "content": "Musical interpretation is the performer''s personal expression of a piece. Two pianists playing the same Chopin nocturne will produce quite different performances: their choices about tempo, rubato (slight flexibility of rhythm for expression), dynamic shaping, articulation, and touch are unique to their musical personalities. There is no single correct interpretation, but interpretations must be grounded in the score and in an understanding of the style period. A jazz standard performed with baroque ornaments would be a misinterpretation."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Music as Ceremony, Healing, and Resistance", "content": "In many First Nations and Metis communities in Saskatchewan, music is inseparable from healing, ceremony, and political resistance. The resurgence of Indigenous languages has been tied to music — new songs composed in Cree, Nakoda, Dene, Michif, and other languages revitalize language use among young people. Round Dance songs have been used at rallies and gatherings as expressions of cultural pride and political solidarity. Understanding that music is never purely aesthetic — it always carries social, political, and spiritual dimensions — is a form of advanced musical understanding available to any thoughtful musician."},
      {"type": "list", "style": "unordered", "items": ["Major scale: W-W-H-W-W-W-H interval pattern | Minor scale: W-H-W-W-H-W-W", "Chord functions: I (tonic/home), IV (subdominant), V (dominant/tension)", "Rubato: flexible timing used expressively in performance", "Musical interpretation: the performer''s personal, grounded expression of a score", "Theory and performance are not opposites — theory deepens expressive possibility"]},
      {"type": "quiz", "question": "In tonal music, what is the function of the V (dominant) chord?", "options": ["To provide a stable resting point for the melody", "To create tension that urgently wants to resolve back to the I chord", "To modulate the piece to a new key", "To establish the opening theme of a piece"], "correctIndex": 1, "explanation": "The V chord (dominant) creates harmonic tension — it contains pitches that are dissonant with the home key and pull strongly toward resolution on the I chord (tonic). Skilled performers lean into this tension and release it expressively."}
    ]'::jsonb,
    '[
      {"term": "Scale", "definition": "An ordered sequence of pitches following a specific interval pattern, such as the major or minor scale."},
      {"term": "Mode", "definition": "A scale pattern derived from the major scale by starting on a different scale degree."},
      {"term": "Chord Function", "definition": "The role a chord plays in relation to the tonic — tonic (I), subdominant (IV), or dominant (V)."},
      {"term": "Tonic", "definition": "The first and most stable chord of a key — the home chord that provides resolution."},
      {"term": "Dominant", "definition": "The fifth chord of a key that creates tension and pulls strongly toward resolution on the tonic."},
      {"term": "Rubato", "definition": "Slight, expressive flexibility of rhythm in performance — slowing or speeding slightly to shape a phrase."},
      {"term": "Musical Interpretation", "definition": "The performer''s personal, grounded expression of a piece through tempo, dynamics, articulation, and touch choices."}
    ]'::jsonb,
    'In many First Nations and Metis communities in Saskatchewan, music is inseparable from healing, ceremony, and political resistance. The resurgence of Indigenous languages has been tied to music — new songs in Cree, Nakoda, Dene, and Michif revitalize language use among young people. Round Dance songs have been used at rallies as expressions of cultural solidarity. Understanding that music always carries social, political, and spiritual dimensions alongside aesthetic ones is a sophisticated form of musical understanding.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the interval pattern of the major scale?', 'Whole-Whole-Half-Whole-Whole-Whole-Half (W-W-H-W-W-W-H).', 'Think of the white keys on a piano from C to C.', 3, 0),
    (v_tenant, v_ch, 'What is rubato?', 'Slight, expressive flexibility of rhythm — slowing or speeding slightly to shape a phrase with feeling.', 'From Italian: "stolen time."', 3, 1),
    (v_tenant, v_ch, 'What is the function of the dominant (V) chord?', 'To create harmonic tension that pulls strongly toward resolution on the tonic (I) chord.', 'Tension seeking home.', 3, 2);

  -- UNIT 3: Drama
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Drama',
    'Engage with advanced theatre practice including Stanislavski technique, subtext, and the actor''s preparation process for complex roles.',
    'Advanced acting technique gives performers the tools to create truthful, psychologically complex performances that resonate with an audience.',
    'How does an actor build a truthful, psychologically grounded portrayal of a complex character?')
  RETURNING id INTO v_unit;

  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Advanced Theatre', 'advanced-theatre-9',
    'Study Stanislavski-based acting method including given circumstances, objective, super-objective, and subtext, and apply them to complex character work.',
    '[
      {"type": "heading", "level": 1, "text": "Advanced Theatre"},
      {"type": "text", "content": "Konstantin Stanislavski was a Russian actor and director who developed a systematic approach to acting in the late nineteenth and early twentieth centuries. His approach — often called the Stanislavski System or, in its American adaptations, Method acting — emphasized psychological truth: the actor must genuinely feel and believe the circumstances of the character rather than merely imitating surface emotions. Stanislavski''s principles remain the foundation of most serious acting training in the western world."},
      {"type": "text", "content": "Given circumstances are all the facts of a character''s situation as established by the script. They include the time and place of the action, the character''s relationships, their history, their physical condition, and everything else that defines who this person is and what situation they are in at this moment. An actor''s first task is to identify all the given circumstances and make them deeply real in their imagination."},
      {"type": "callout", "style": "info", "title": "Objective and Super-Objective", "content": "In Stanislavski''s system, every character has an objective in each scene — what they want right now, in this moment. They also have a super-objective — the overarching goal that drives everything they do throughout the entire play. An actor who knows what their character wants at every moment will always have something to play, and their performance will have direction and intention rather than being a sequence of unconnected emotional moments."},
      {"type": "text", "content": "Subtext is what a character is thinking and feeling beneath and behind what they actually say. In great drama, what characters say is rarely exactly what they mean. An actor''s job is to play the subtext — the hidden thought, the suppressed emotion, the unspoken desire — while delivering the text. When the gap between text and subtext is large, the performance becomes dramatically rich. The audience senses what is not being said, and that tension is where great acting lives."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Indigenous Acting and Representation on Stage", "content": "Indigenous actors and theatre-makers in Saskatchewan have increasingly asserted the importance of authentic representation in performance. The practice of non-Indigenous actors playing Indigenous characters — a long-standing problem in Canadian theatre — is being actively challenged by Indigenous-led theatre companies and casting advocates. Indigenous actors bring irreplaceable lived experience, cultural knowledge, and embodied understanding to roles that require those qualities. Organizations such as the Association for Native Development in the Performing and Visual Arts have supported Indigenous artists in developing performance careers that do not require the erasure of their identity."},
      {"type": "list", "style": "unordered", "items": ["Stanislavski System: an approach to acting emphasizing psychological truth and genuine emotional belief", "Given circumstances: all the facts of a character''s situation as established by the script", "Objective: what the character wants right now in this scene", "Super-objective: the character''s overarching goal throughout the entire play", "Subtext: the hidden thoughts, feelings, and desires beneath the spoken text"]},
      {"type": "quiz", "question": "In Stanislavski''s system, what is a character''s super-objective?", "options": ["The character''s goal in the opening scene", "The overarching desire that drives the character throughout the entire play", "The director''s interpretation of the character''s motivation", "The character''s relationship to the other characters on stage"], "correctIndex": 1, "explanation": "The super-objective is the character''s deepest, most fundamental want — the overarching goal that drives everything they do across the entire play, not just in a single scene. Knowing the super-objective gives the actor a through-line for the entire performance."}
    ]'::jsonb,
    '[
      {"term": "Stanislavski System", "definition": "An approach to acting developed by Konstantin Stanislavski emphasizing psychological truth and genuine emotional belief."},
      {"term": "Given Circumstances", "definition": "All the facts of a character''s situation as established by the script — time, place, relationships, history."},
      {"term": "Objective", "definition": "What a character wants in a specific scene — their immediate goal."},
      {"term": "Super-Objective", "definition": "The overarching desire that drives a character throughout the entire play."},
      {"term": "Subtext", "definition": "The hidden thoughts, feelings, and desires beneath a character''s spoken words."},
      {"term": "Through-Line", "definition": "The continuous thread of a character''s objectives that connects every scene into a unified performance."}
    ]'::jsonb,
    'Indigenous actors in Saskatchewan have increasingly asserted the importance of authentic representation on stage. The practice of non-Indigenous actors playing Indigenous roles is being actively challenged by Indigenous-led theatre companies and casting advocates. Indigenous performers bring irreplaceable lived experience and cultural knowledge to these roles. Organizations supporting Indigenous artists in the performing arts have helped build careers that do not require the erasure of cultural identity — a form of artistic sovereignty parallel to visual sovereignty in photography.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are given circumstances in acting?', 'All the facts of a character''s situation as established by the script — time, place, relationships, history, and physical condition.', 'Everything the script tells you about the character''s world.', 2, 0),
    (v_tenant, v_ch, 'What is subtext?', 'The hidden thoughts, feelings, and desires beneath a character''s spoken words — what they mean but do not say directly.', 'The gap between what is said and what is meant.', 3, 1),
    (v_tenant, v_ch, 'What is the difference between objective and super-objective?', 'Objective: what the character wants in this scene. Super-objective: the overarching desire driving the character throughout the entire play.', 'Scene-level vs. play-level want.', 3, 2);

  -- UNIT 4: Dance
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Dance',
    'Develop advanced skills in dance critique — analyzing and writing about dance performances using aesthetic frameworks and evidence-based reasoning.',
    'Writing about dance is a way of seeing more clearly — the discipline of articulation sharpens perception.',
    'How do you write a rigorous, evidence-based critique of a dance performance that goes beyond personal preference?')
  RETURNING id INTO v_unit;

  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Dance Critique', 'dance-critique-9',
    'Learn to write rigorous, evidence-based dance criticism using aesthetic frameworks, movement analysis vocabulary, and contextual understanding.',
    '[
      {"type": "heading", "level": 1, "text": "Dance Critique"},
      {"type": "text", "content": "Dance criticism is the practice of watching, analyzing, and writing about dance performances in a rigorous, evidence-based way. A dance critic is not simply reporting whether they enjoyed a show — they are making an argument about what the choreographer intended, how successfully the performance achieved that intention, what choices were made and what effects those choices produced, and what the work means in its cultural and artistic context."},
      {"type": "text", "content": "The Laban Movement Analysis (LMA) system provides one of the most useful frameworks for describing dance movement. LMA organizes movement observation into four broad categories: Body (which body parts move and how they are connected), Effort (the quality of movement — time, weight, space, flow), Shape (how the body changes its form in space), and Space (where the body moves in the performance area). Using LMA vocabulary allows a critic to describe movement precisely rather than vaguely."},
      {"type": "callout", "style": "info", "title": "Evidence-Based Critique", "content": "A strong dance critique is evidence-based: every claim is supported by specific observations from the performance. Rather than saying ''the dancer was powerful,'' a critic writes: ''the dancer''s grounded, weighted step-stamps and the sudden freeze at full extension created an effect of controlled power.'' The specificity of the observation supports the interpretation and gives readers who were not present a sense of what they missed."},
      {"type": "text", "content": "Context enriches dance critique just as it enriches art criticism. Knowing a work''s choreographer, their influences, the cultural tradition it draws from, and the social moment in which it was created all deepen a critic''s analysis. A piece of contemporary Indigenous dance viewed without knowledge of its cultural context will be misread. A piece created in response to a specific political moment will mean more to a reader who understands that moment. Research is part of the critic''s responsibility."},
      {"type": "callout", "style": "tip", "title": "Indigenous Art: Critiquing Indigenous Performance Responsibly", "content": "Writing about Indigenous dance performance requires particular care and humility. A non-Indigenous critic approaching a work rooted in sacred tradition must be aware of what they do and do not have the cultural knowledge to evaluate. This does not mean that non-Indigenous people cannot write about Indigenous dance — but it means they must write from a position of informed respect, acknowledging the limits of their understanding, centering Indigenous voices and perspectives, and never reducing a complex cultural practice to a single aesthetic judgment. Saskatchewan critics and arts journalists have an opportunity to model this kind of responsible, culturally informed arts writing."},
      {"type": "list", "style": "unordered", "items": ["Dance critique: rigorous, evidence-based analysis and writing about dance performance", "LMA: Body, Effort, Shape, Space — a framework for describing movement precisely", "Evidence-based critique: every claim supported by specific observations from the performance", "Context: cultural, historical, and artistic background deepens analysis", "Responsible critique of Indigenous performance requires cultural humility and informed respect"]},
      {"type": "quiz", "question": "In Laban Movement Analysis, what does the Effort category describe?", "options": ["Which body parts are moving", "Where the body moves in the performance space", "The quality of movement — time, weight, space, and flow", "How the body''s shape changes over time"], "correctIndex": 2, "explanation": "The Effort category in Laban Movement Analysis describes the quality or dynamic of movement along four dimensions: time (sudden vs. sustained), weight (strong vs. light), space (direct vs. indirect), and flow (bound vs. free). It answers the question of how movement is done, not what moves or where."}
    ]'::jsonb,
    '[
      {"term": "Dance Critique", "definition": "Rigorous, evidence-based analysis and writing about dance performance using aesthetic frameworks and contextual knowledge."},
      {"term": "Laban Movement Analysis", "definition": "A framework for describing and analyzing movement organized into Body, Effort, Shape, and Space categories."},
      {"term": "Effort", "definition": "The LMA category describing the quality of movement along dimensions of time, weight, space, and flow."},
      {"term": "Evidence-Based Critique", "definition": "Criticism where every interpretive claim is supported by specific, concrete observations from the work."},
      {"term": "Cultural Humility", "definition": "The ongoing practice of recognizing the limits of one''s own cultural knowledge and approaching other cultures with respectful openness."}
    ]'::jsonb,
    'Critiquing Indigenous dance performance in Saskatchewan requires cultural humility — awareness of the limits of one''s own cultural knowledge when approaching work rooted in sacred or ceremonial tradition. Non-Indigenous critics can write thoughtfully about Indigenous performance by centering Indigenous voices and perspectives, researching the cultural context carefully, and acknowledging the boundaries of their understanding. Saskatchewan arts journalists have an opportunity to model this kind of responsible, culturally informed writing about the rich Indigenous performing arts traditions of the province.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is Laban Movement Analysis?', 'A framework for describing and analyzing movement organized into four categories: Body, Effort, Shape, and Space.', 'A vocabulary for precise movement description.', 3, 0),
    (v_tenant, v_ch, 'What makes a dance critique evidence-based?', 'Every interpretive claim is supported by specific, concrete observations from the performance rather than vague generalities.', 'Don''t say "powerful" — describe what created that effect.', 3, 1),
    (v_tenant, v_ch, 'What is cultural humility in the context of dance criticism?', 'The ongoing practice of recognizing the limits of one''s own cultural knowledge and approaching other cultures with respectful openness — especially important when writing about Indigenous performance.', 'Know what you do not know.', 3, 2);

END $$;
