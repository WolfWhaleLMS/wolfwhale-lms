-- ============================================================================
-- WolfWhale Textbook Content Seed: ELA Grades 4-9
-- Saskatchewan WNCP English Language Arts
--
-- Populates: textbook_units, textbook_chapters, textbook_flashcards,
--            chapter_outcome_map
--
-- Each grade is wrapped in its own DO $$ block.
-- Depends on: seed_textbooks.sql, seed_curriculum_outcomes.sql
-- ============================================================================


-- ============================================================================
-- GRADE 4 — WolfWhale English Language Arts 4
-- Outcomes: CR4.1-CR4.4, CC4.1-CC4.4, AR4.1-AR4.2
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
    WHERE tenant_id = v_tenant AND slug = 'wolfwhale-ela-4';

  -- ========================================================================
  -- UNIT 1: Comprehend and Respond (CR4.1 – CR4.4)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Reading for Understanding',
    'Reading various texts for different purposes, listening to summarize and evaluate, and responding to visual texts with evidence.',
    'Critical readers support their responses with evidence from the text and their own experiences.',
    'How do we use evidence to support our understanding of what we read?')
  RETURNING id INTO v_unit;

  -- Chapter 1 — Reading for Various Purposes (CR4.4)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 1, 'Reading for Various Purposes', 'ela-4-reading-purposes',
    'Read for various purposes and demonstrate comprehension of grade-appropriate fiction, scripts, poetry, and non-fiction.',
    '[
      {"type": "heading", "content": "Reading for Various Purposes", "level": 1},
      {"type": "text", "content": "We do not read everything the same way. The way you read depends on your purpose — why you are reading. Reading a story for fun is different from reading instructions for a science experiment."},
      {"type": "heading", "content": "Purposes for Reading", "level": 2},
      {"type": "text", "content": "Common purposes for reading include:\n- For enjoyment: reading stories, novels, and poems for pleasure\n- For information: reading textbooks, articles, and reports to learn\n- To follow directions: reading recipes, instructions, or rules\n- To be persuaded: reading advertisements, editorials, or speeches\n- To interpret: reading poetry or scripts to understand deeper meaning"},
      {"type": "callout", "content": "Before you start reading, ask yourself: Why am I reading this? Your purpose will guide how carefully and quickly you read.", "style": "tip"},
      {"type": "heading", "content": "Reading Fluency", "level": 2},
      {"type": "text", "content": "Fluency means reading smoothly, with good speed, accuracy, and expression. Fluent readers:\n- Read at an appropriate speed (not too fast, not too slow)\n- Pronounce words correctly\n- Use expression to show the meaning and mood of the text\n- Pause at periods and commas\n- Group words into meaningful phrases"},
      {"type": "heading", "content": "Poetry", "level": 2},
      {"type": "text", "content": "Poetry is a special type of writing that uses rhythm, rhyme, imagery, and carefully chosen words to express ideas and feelings. When reading poetry:\n- Read it slowly and carefully\n- Pay attention to the images the words create\n- Listen for rhythm and rhyme\n- Think about what the poet is trying to say"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What does your reading purpose affect?", "options": ["The colour of the book", "How carefully and quickly you read", "The number of pages", "The author''s name"], "correct": 1, "explanation": "Your purpose guides how you approach the text — whether you skim for information or read closely for meaning."},
      {"type": "quiz", "question": "What is reading fluency?", "options": ["Reading as fast as possible", "Reading smoothly with good speed, accuracy, and expression", "Only reading silently", "Memorizing every word"], "correct": 1, "explanation": "Fluency means reading smoothly with appropriate speed, accuracy, and expression."}
    ]'::jsonb,
    '[{"term": "Purpose", "definition": "The reason you are reading a text"},
      {"term": "Fluency", "definition": "Reading smoothly with good speed, accuracy, and expression"},
      {"term": "Poetry", "definition": "A type of writing that uses rhythm, rhyme, and imagery to express ideas"},
      {"term": "Imagery", "definition": "Words that create pictures in the reader''s mind"}]'::jsonb,
    'Indigenous poetry and oral literature use rich imagery drawn from the natural world. Poets like Louise Bernice Halfe (Sky Dancer) and Lorne Simon weave traditional knowledge into their verse, connecting readers to the land and its teachings.',
    18, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CR4.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a purpose for reading?', 'The reason you are reading a text.', 'Why are you reading this?', 2, 0),
    (v_tenant, v_ch, 'What is reading fluency?', 'Reading smoothly with good speed, accuracy, and expression.', 'Smooth, clear, and with feeling.', 2, 1),
    (v_tenant, v_ch, 'What is imagery?', 'Words that create pictures in the reader''s mind.', 'You can see it in your imagination.', 2, 2),
    (v_tenant, v_ch, 'Name three purposes for reading.', 'For enjoyment, for information, and to follow directions.', 'Think about different types of texts.', 2, 3);


  -- Chapter 2 — Supporting Responses with Evidence (CR4.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 2, 'Supporting Responses with Evidence', 'ela-4-evidence-response',
    'Comprehend and respond to grade-level texts and support response with evidence from the text and own experiences.',
    '[
      {"type": "heading", "content": "Supporting Responses with Evidence", "level": 1},
      {"type": "text", "content": "When you share your thoughts about a text, it is important to support your ideas with evidence. Evidence is proof that backs up what you are saying. It shows that your response is based on the text, not just a guess."},
      {"type": "heading", "content": "Types of Evidence", "level": 2},
      {"type": "text", "content": "There are two main types of evidence you can use:\n- Text evidence: Words, phrases, or details directly from the text. You might say: In the story, the author writes that the character felt a cold shiver.\n- Personal experience: Connections to your own life. You might say: This reminds me of a time when I was nervous before a test."},
      {"type": "callout", "content": "Use sentence starters like: According to the text... The author states... Based on the story... This reminds me of...", "style": "tip"},
      {"type": "heading", "content": "How to Find Evidence", "level": 2},
      {"type": "text", "content": "To find evidence in a text:\n1. Reread the section related to the question.\n2. Look for key words and phrases.\n3. Underline or highlight important details.\n4. Ask: What does the author actually say about this?"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is text evidence?", "options": ["Your opinion about the text", "Words or details directly from the text that support your idea", "A summary of the whole book", "The author''s biography"], "correct": 1, "explanation": "Text evidence is specific words, phrases, or details from the text that prove or support your response."},
      {"type": "quiz", "question": "Which sentence starter helps you cite evidence?", "options": ["I think maybe...", "According to the text...", "I am not sure but...", "My friend said..."], "correct": 1, "explanation": "According to the text... is a strong way to introduce text evidence."}
    ]'::jsonb,
    '[{"term": "Evidence", "definition": "Proof from the text or personal experience that supports your response"},
      {"term": "Text evidence", "definition": "Words, phrases, or details directly from the text"},
      {"term": "Cite", "definition": "To refer to a specific part of the text as proof"},
      {"term": "Response", "definition": "Your reaction or answer to what you have read or heard"}]'::jsonb,
    'In Indigenous knowledge systems, evidence comes from observation of the natural world and from teachings passed down by Elders. Just as students learn to cite text evidence, Indigenous learners cite their Elders'' teachings and land-based observations as evidence.',
    18, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CR4.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is evidence?', 'Proof from the text or personal experience that supports your response.', 'It backs up what you are saying.', 2, 0),
    (v_tenant, v_ch, 'What does cite mean?', 'To refer to a specific part of the text as proof.', 'Point to where you found the information.', 2, 1),
    (v_tenant, v_ch, 'Name one sentence starter for citing evidence.', 'According to the text... or The author states...', 'It shows you are using the text to support your idea.', 2, 2);


  -- Chapter 3 — Listening to Summarize and Evaluate (CR4.3)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 3, 'Listening to Summarize and Evaluate', 'ela-4-listening-summarize',
    'Listen, summarize, paraphrase, and evaluate what was listened to and draw conclusions.',
    '[
      {"type": "heading", "content": "Listening to Summarize and Evaluate", "level": 1},
      {"type": "text", "content": "Active listening goes beyond just hearing words. It means thinking about what you hear, summarizing the key ideas, and forming your own opinion about the message."},
      {"type": "heading", "content": "Summarizing", "level": 2},
      {"type": "text", "content": "A summary tells the most important ideas in your own words, leaving out small details. A good summary is:\n- Short (much shorter than the original)\n- In your own words\n- Focused on the main ideas\n- In the correct order"},
      {"type": "heading", "content": "Paraphrasing", "level": 2},
      {"type": "text", "content": "Paraphrasing means restating someone else''s idea in your own words. It is similar to summarizing, but you focus on one specific idea rather than the whole text.\n\nOriginal: The polar bear''s white fur helps it blend into the snowy landscape.\nParaphrase: Polar bears have white fur so they can hide in the snow."},
      {"type": "callout", "content": "When paraphrasing, change the words but keep the meaning the same. Do not just rearrange the same words.", "style": "info"},
      {"type": "heading", "content": "Evaluating and Drawing Conclusions", "level": 2},
      {"type": "text", "content": "After listening, think critically:\n- Do I agree with what was said? Why or why not?\n- Is the information accurate and fair?\n- What conclusion can I draw from this information?\n\nA conclusion is a decision or judgment you make based on the information you have."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is a summary?", "options": ["A copy of the whole text", "A short retelling of the main ideas in your own words", "Only the first sentence", "A list of every detail"], "correct": 1, "explanation": "A summary is a short retelling of the most important ideas in your own words."},
      {"type": "quiz", "question": "What is a conclusion?", "options": ["The first sentence of a paragraph", "A decision or judgment based on information", "A type of punctuation", "A summary of every word"], "correct": 1, "explanation": "A conclusion is a decision or judgment you make after thinking about all the information."}
    ]'::jsonb,
    '[{"term": "Summary", "definition": "A short retelling of the main ideas in your own words"},
      {"term": "Paraphrase", "definition": "To restate someone else''s idea in your own words"},
      {"term": "Evaluate", "definition": "To think critically about information and form a judgment"},
      {"term": "Conclusion", "definition": "A decision or judgment based on the information available"}]'::jsonb,
    'In Indigenous oral traditions, listeners are expected to summarize and paraphrase teachings to show they have understood. This active listening practice is deeply valued as a sign of respect and learning.',
    18, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CR4.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a summary?', 'A short retelling of the main ideas in your own words.', 'Keep it short, keep it in order, use your own words.', 2, 0),
    (v_tenant, v_ch, 'What does paraphrase mean?', 'To restate someone else''s idea in your own words.', 'Same meaning, different words.', 2, 1),
    (v_tenant, v_ch, 'What is a conclusion?', 'A decision or judgment based on the information available.', 'What do you think after considering all the facts?', 2, 2);


  -- ========================================================================
  -- UNIT 2: Compose and Create (CC4.1 – CC4.4)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'The Writing Process and Presentation',
    'Using the writing process to produce descriptive, narrative, and expository texts, and presenting ideas in formal and informal situations.',
    'Effective writers use a process to plan, draft, revise, and share their work.',
    'How does the writing process help me communicate my ideas clearly?')
  RETURNING id INTO v_unit;

  -- Chapter 4 — The Writing Process (CC4.4)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 4, 'The Writing Process', 'ela-4-writing-process',
    'Use a writing process to produce descriptive, narrative, and expository compositions.',
    '[
      {"type": "heading", "content": "The Writing Process", "level": 1},
      {"type": "text", "content": "Good writing does not happen all at once. Writers follow a process with several steps. Each step helps make the writing clearer and stronger."},
      {"type": "heading", "content": "Steps in the Writing Process", "level": 2},
      {"type": "list", "items": ["Prewriting: Brainstorm and plan your ideas. Use graphic organizers, lists, or webs.", "Drafting: Write your first version. Focus on getting your ideas down without worrying about perfection.", "Revising: Reread and improve your writing. Add details, reorganize ideas, and strengthen your word choices.", "Editing: Fix spelling, grammar, punctuation, and capitalization errors.", "Publishing: Share your final version with your audience. This could be reading aloud, displaying, or printing."]},
      {"type": "callout", "content": "Revising is about making your ideas better. Editing is about fixing mistakes. They are two different steps!", "style": "info"},
      {"type": "heading", "content": "Types of Writing in Grade 4", "level": 2},
      {"type": "text", "content": "- Descriptive: Uses sensory details to paint a picture with words (what you see, hear, feel, smell, taste).\n- Narrative: Tells a story with characters, setting, problem, and solution.\n- Expository: Explains or informs about a topic using facts and details."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is the difference between revising and editing?", "options": ["They are the same thing", "Revising improves ideas; editing fixes mistakes", "Revising fixes spelling; editing adds details", "There is no difference"], "correct": 1, "explanation": "Revising focuses on improving ideas, organization, and word choice. Editing focuses on fixing grammar, spelling, and punctuation errors."},
      {"type": "quiz", "question": "What does descriptive writing use?", "options": ["Only facts", "Sensory details to paint a picture with words", "Only dialogue", "Only numbers and data"], "correct": 1, "explanation": "Descriptive writing uses sensory details — what you can see, hear, feel, smell, and taste — to create vivid images."}
    ]'::jsonb,
    '[{"term": "Prewriting", "definition": "The planning stage of writing where you brainstorm and organize ideas"},
      {"term": "Drafting", "definition": "Writing the first version of a text"},
      {"term": "Revising", "definition": "Improving writing by adding details, reorganizing, and strengthening word choices"},
      {"term": "Editing", "definition": "Fixing errors in spelling, grammar, punctuation, and capitalization"},
      {"term": "Expository", "definition": "Writing that explains or informs about a topic using facts"}]'::jsonb,
    'The process of creating, refining, and sharing resonates with Indigenous artistic traditions. A beadwork artist plans the design, creates a draft layout, adjusts the pattern, and then completes the final piece — a process similar to the writing process.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CC4.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Name the five steps of the writing process.', 'Prewriting, drafting, revising, editing, and publishing.', 'Plan, write, improve, fix, share.', 2, 0),
    (v_tenant, v_ch, 'What is revising?', 'Improving writing by adding details, reorganizing, and strengthening word choices.', 'Making your ideas better.', 2, 1),
    (v_tenant, v_ch, 'What is expository writing?', 'Writing that explains or informs about a topic using facts.', 'It teaches the reader about something real.', 2, 2);


  -- Chapter 5 — Presenting Ideas (CC4.3)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 5, 'Presenting Ideas', 'ela-4-presenting-ideas',
    'Speak to present and express ideas and information in formal and informal situations for differing audiences.',
    '[
      {"type": "heading", "content": "Presenting Ideas", "level": 1},
      {"type": "text", "content": "Being able to present your ideas clearly is an important skill. Whether you are sharing a book report, explaining a project, or participating in a class discussion, you need to communicate effectively."},
      {"type": "heading", "content": "Formal Presentations", "level": 2},
      {"type": "text", "content": "In a formal presentation, you are speaking to a group with a planned message. Tips for formal presentations:\n- Know your topic well\n- Organize your ideas (introduction, body, conclusion)\n- Use note cards if needed, but do not read every word\n- Make eye contact with your audience\n- Speak at a steady pace with clear pronunciation\n- Use visual aids to support your message"},
      {"type": "heading", "content": "Informal Discussions", "level": 2},
      {"type": "text", "content": "In informal discussions, you share ideas and respond to others in a more relaxed setting. Good discussion skills include:\n- Wait for your turn to speak\n- Build on what others have said\n- Ask questions to clarify or learn more\n- Respectfully disagree by saying something like: I see your point, but I think..."},
      {"type": "callout", "content": "The best presenters practise their speeches at least three times before the real presentation.", "style": "tip"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What are the three parts of a formal presentation?", "options": ["Title, body, pictures", "Introduction, body, conclusion", "Beginning, middle, end credits", "Question, answer, question"], "correct": 1, "explanation": "A formal presentation has an introduction, a body (main content), and a conclusion."},
      {"type": "quiz", "question": "How should you respectfully disagree in a discussion?", "options": ["Say you are wrong", "Say I see your point, but I think...", "Stay silent", "Interrupt them"], "correct": 1, "explanation": "You can respectfully disagree by acknowledging the other person''s point before sharing your own view."}
    ]'::jsonb,
    '[{"term": "Formal presentation", "definition": "A planned speech to a group, organized with an introduction, body, and conclusion"},
      {"term": "Informal discussion", "definition": "A relaxed conversation where people share and respond to ideas"},
      {"term": "Pronunciation", "definition": "The way you say or sound out words"}]'::jsonb,
    'Oral presentations are a respected tradition in Indigenous cultures. Chiefs and leaders deliver speeches at gatherings and ceremonies, using clear, purposeful language. The skill of public speaking connects students to this long tradition of oration.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CC4.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are the three parts of a formal presentation?', 'Introduction, body, and conclusion.', 'Start, middle, end.', 2, 0),
    (v_tenant, v_ch, 'What is pronunciation?', 'The way you say or sound out words.', 'Speaking clearly so others understand.', 2, 1),
    (v_tenant, v_ch, 'How do you respectfully disagree?', 'Acknowledge the other person''s point, then share your own view.', 'I see your point, but I think...', 2, 2);


  -- ========================================================================
  -- UNIT 3: Assess and Reflect (AR4.1 – AR4.2)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Self-Assessment and Improvement',
    'Reflecting on language strategies, exploring ways to improve, and setting goals for growth.',
    'Self-aware learners evaluate their strategies and make plans to improve.',
    'How do I evaluate my own learning and set meaningful goals?')
  RETURNING id INTO v_unit;

  -- Chapter 6 — Evaluating Strategies and Setting Goals (AR4.1, AR4.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 6, 'Evaluating Strategies and Setting Goals', 'ela-4-evaluating-goals',
    'Reflect on language experiences and strategies, explore ways to improve, and set personal goals.',
    '[
      {"type": "heading", "content": "Evaluating Strategies and Setting Goals", "level": 1},
      {"type": "text", "content": "By Grade 4, you have a growing toolkit of reading, writing, speaking, and listening strategies. Evaluating which strategies work best for you and setting goals for improvement is an important part of becoming a stronger learner."},
      {"type": "heading", "content": "Self-Evaluation Questions", "level": 2},
      {"type": "text", "content": "Ask yourself:\n- Which reading strategies do I use most? Which should I try more?\n- Is my writing clear and organized? Where can I improve?\n- Do I speak confidently? What could I work on?\n- Am I a good listener? Do I summarize and evaluate what I hear?\n- What are my strengths? What are my challenges?"},
      {"type": "callout", "content": "Be honest with yourself during self-evaluation. Recognizing challenges is the first step to overcoming them.", "style": "info"},
      {"type": "heading", "content": "Setting Effective Goals", "level": 2},
      {"type": "text", "content": "Effective goals are:\n- Specific: clearly state what you will do\n- Measurable: you can track your progress\n- Achievable: challenging but realistic\n- Time-bound: have a deadline\n\nExample: By the end of this month, I will use at least two text evidence sentence starters in every reading response."},
      {"type": "heading", "content": "Monitoring Progress", "level": 2},
      {"type": "text", "content": "Check in on your goals regularly:\n- Use a self-assessment checklist\n- Meet with your teacher to discuss progress\n- Adjust your goals if they are too easy or too hard\n- Celebrate your growth!"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Why is self-evaluation important?", "options": ["It is not important", "It helps you know your strengths and what to improve", "It replaces teacher feedback", "It only matters for tests"], "correct": 1, "explanation": "Self-evaluation helps you understand what you do well and where you can grow."},
      {"type": "quiz", "question": "What makes a goal effective?", "options": ["Being vague and having no deadline", "Being specific, measurable, achievable, and time-bound", "Being impossible to reach", "Being the same as last year''s goal"], "correct": 1, "explanation": "Effective goals are specific, measurable, achievable, and have a deadline."}
    ]'::jsonb,
    '[{"term": "Self-evaluation", "definition": "Judging your own work and skills honestly"},
      {"term": "Toolkit", "definition": "The collection of strategies and skills you have learned"},
      {"term": "Monitor", "definition": "To check on something regularly to track progress"}]'::jsonb,
    'In Indigenous communities, self-reflection is supported by mentors and Elders. The practice of sitting quietly after an experience to reflect on lessons learned mirrors the self-evaluation process students use to grow their language skills.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'AR4.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'AR4.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is self-evaluation?', 'Judging your own work and skills honestly.', 'Being honest about what you do well and what needs work.', 2, 0),
    (v_tenant, v_ch, 'What does monitor mean?', 'To check on something regularly to track progress.', 'Keep an eye on how things are going.', 2, 1),
    (v_tenant, v_ch, 'Name four qualities of an effective goal.', 'Specific, measurable, achievable, and time-bound.', 'Clear, trackable, realistic, and with a deadline.', 2, 2);

END $$;


-- ============================================================================
-- GRADE 5 — WolfWhale English Language Arts 5
-- Outcomes: CR5.1-CR5.4, CC5.1-CC5.4, AR5.1-AR5.2
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
    WHERE tenant_id = v_tenant AND slug = 'wolfwhale-ela-5';

  -- ========================================================================
  -- UNIT 1: Comprehend and Respond (CR5.1 – CR5.4)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Critical Reading and Analysis',
    'Analyzing texts for identity and social responsibility, evaluating persuasive techniques, and comprehending a range of fiction and non-fiction.',
    'Critical readers analyze texts to understand the author''s purpose, techniques, and underlying messages.',
    'How do we read critically to find meaning beyond the words?')
  RETURNING id INTO v_unit;

  -- Chapter 1 — Analyzing Texts (CR5.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 1, 'Analyzing Texts', 'ela-5-analyzing-texts',
    'Analyze and respond to grade-level texts that address identity, community, and social responsibility.',
    '[
      {"type": "heading", "content": "Analyzing Texts", "level": 1},
      {"type": "text", "content": "Analyzing a text means looking closely at what the author wrote and thinking about why they wrote it. Good readers go beyond just understanding the story — they think about the deeper messages and themes."},
      {"type": "heading", "content": "Themes in Literature", "level": 2},
      {"type": "text", "content": "A theme is the big idea or lesson in a text. Common themes include:\n- Identity: Who am I? What makes me unique?\n- Community: How do people work together?\n- Social responsibility: What are our duties to each other and the world?\n- Courage: What does it mean to be brave?\n- Fairness: Is everyone treated equally?"},
      {"type": "callout", "content": "The theme is not the same as the topic. The topic might be friendship, but the theme could be true friends support each other even when it is hard.", "style": "info"},
      {"type": "heading", "content": "Author''s Purpose", "level": 2},
      {"type": "text", "content": "Authors write for different purposes:\n- To entertain: stories, poems, and plays that are enjoyable\n- To inform: articles and reports that teach facts\n- To persuade: texts that try to change your mind\n- To express: personal essays and journals that share feelings\n\nUnderstanding the author''s purpose helps you know how to read and respond to the text."},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is the difference between a topic and a theme?", "options": ["They are the same", "A topic is the subject; a theme is the deeper message or lesson", "A theme is shorter than a topic", "A topic is only in non-fiction"], "correct": 1, "explanation": "A topic is what the text is about; a theme is the deeper message or lesson the author wants to share."},
      {"type": "quiz", "question": "If an author writes to change your mind about recycling, their purpose is to:", "options": ["Entertain", "Inform", "Persuade", "Express feelings"], "correct": 2, "explanation": "If the author is trying to change your opinion, their purpose is to persuade."}
    ]'::jsonb,
    '[{"term": "Analyze", "definition": "To look closely at something to understand its parts and meaning"},
      {"term": "Theme", "definition": "The big idea, lesson, or message in a text"},
      {"term": "Author''s purpose", "definition": "The reason an author wrote a text: to entertain, inform, persuade, or express"}]'::jsonb,
    'Indigenous literature explores themes of identity, belonging, and responsibility to the land and community. Reading works by Saskatchewan Indigenous authors helps students understand these themes from First Nations and Metis perspectives.',
    18, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CR5.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does analyze mean?', 'To look closely at something to understand its parts and meaning.', 'Go deeper than just reading the words.', 2, 0),
    (v_tenant, v_ch, 'What is a theme?', 'The big idea, lesson, or message in a text.', 'It is the deeper meaning, not just the topic.', 2, 1),
    (v_tenant, v_ch, 'Name the four main author purposes.', 'To entertain, inform, persuade, and express.', 'Why did the author write this?', 2, 2);


  -- Chapter 2 — Evaluating Persuasive Techniques (CR5.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 2, 'Evaluating Persuasive Techniques', 'ela-5-persuasive-techniques',
    'View and evaluate visual and multimedia texts, identifying persuasive techniques including promises, flattery, and comparisons.',
    '[
      {"type": "heading", "content": "Evaluating Persuasive Techniques", "level": 1},
      {"type": "text", "content": "Advertisements, commercials, posters, and even some speeches try to persuade you — to get you to think, feel, or do something. Critical viewers and readers can identify the techniques being used."},
      {"type": "heading", "content": "Common Persuasive Techniques", "level": 2},
      {"type": "text", "content": "Persuaders use many techniques:\n- Promises: Buy this and you will be happy!\n- Flattery: Smart people choose this product.\n- Comparisons: This is better than the other brand.\n- Bandwagon: Everyone is doing it! Join in!\n- Emotional appeal: Sad images or music to make you feel something.\n- Expert opinion: A doctor recommends this product."},
      {"type": "callout", "content": "Just because something uses a persuasive technique does not mean it is true. Always think critically about the claims being made.", "style": "tip"},
      {"type": "heading", "content": "Evaluating the Message", "level": 2},
      {"type": "text", "content": "When you encounter a persuasive text, ask:\n- What is the message trying to get me to do or believe?\n- What techniques are being used?\n- Is the information true and supported by facts?\n- Who created this message and why?\n- What information might be left out?"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is the bandwagon technique?", "options": ["Using expert opinions", "Saying everyone is doing it, so you should too", "Making a promise about a product", "Using sad music"], "correct": 1, "explanation": "The bandwagon technique tries to convince you by saying everyone else is already doing it."},
      {"type": "quiz", "question": "What should you ask when you see a persuasive message?", "options": ["Nothing — just believe it", "What is this trying to get me to do, and is it supported by facts?", "How much does it cost?", "Who made the biggest advertisement?"], "correct": 1, "explanation": "Critical thinkers ask what the message wants them to do and whether the claims are supported by evidence."}
    ]'::jsonb,
    '[{"term": "Persuade", "definition": "To try to get someone to think, feel, or do something"},
      {"term": "Bandwagon", "definition": "A technique that says everyone is doing it, so you should too"},
      {"term": "Flattery", "definition": "Praising someone to influence them"},
      {"term": "Emotional appeal", "definition": "Using feelings like sadness or fear to persuade someone"}]'::jsonb,
    'Critical evaluation of messages is important in all cultures. Indigenous communities teach young people to think carefully about information and to consider the source. This skill helps navigate media messages in today''s world.',
    18, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CR5.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does persuade mean?', 'To try to get someone to think, feel, or do something.', 'Changing someone''s mind.', 2, 0),
    (v_tenant, v_ch, 'What is the bandwagon technique?', 'Saying everyone is doing it, so you should too.', 'Join the crowd!', 2, 1),
    (v_tenant, v_ch, 'What is an emotional appeal?', 'Using feelings like sadness or fear to persuade someone.', 'Making you feel something to influence your decision.', 2, 2);


  -- ========================================================================
  -- UNIT 2: Compose and Create (CC5.1 – CC5.4)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Persuasive Writing and Research',
    'Writing multi-paragraph persuasive and expository compositions, creating multimedia presentations, and speaking formally.',
    'Writers develop their voice and craft through practice with different genres and purposes.',
    'How do I write to persuade, inform, and express myself effectively?')
  RETURNING id INTO v_unit;

  -- Chapter 3 — Persuasive Writing (CC5.4)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 3, 'Persuasive Writing', 'ela-5-persuasive-writing',
    'Use a writing process to produce multi-paragraph persuasive compositions that clearly develop a topic and provide transitions.',
    '[
      {"type": "heading", "content": "Persuasive Writing", "level": 1},
      {"type": "text", "content": "Persuasive writing tries to convince the reader to agree with your opinion or take a specific action. It uses logical reasons, facts, and emotional appeals to support the writer''s position."},
      {"type": "heading", "content": "Structure of a Persuasive Essay", "level": 2},
      {"type": "text", "content": "A persuasive essay has:\n- An introduction that states your opinion clearly (your thesis)\n- Body paragraphs with reasons and evidence to support your opinion\n- A counterargument paragraph that addresses the other side\n- A conclusion that restates your opinion and makes a final appeal"},
      {"type": "callout", "content": "A strong persuasive essay addresses the opposing view and explains why your position is still stronger. This is called a counterargument.", "style": "info"},
      {"type": "heading", "content": "Persuasive Language", "level": 2},
      {"type": "text", "content": "Use strong language in persuasive writing:\n- Strong verbs: must, should, need to\n- Transition words: furthermore, additionally, most importantly, in conclusion\n- Emotional language: imagine, consider, we cannot ignore\n- Facts and statistics to back up your claims"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is a thesis in a persuasive essay?", "options": ["A summary of the whole essay", "A clear statement of your opinion", "The title of your essay", "The last sentence"], "correct": 1, "explanation": "A thesis is a clear statement of your opinion, usually in the introduction."},
      {"type": "quiz", "question": "What is a counterargument?", "options": ["Repeating your opinion", "Addressing the opposing view and explaining why your position is stronger", "Giving up on your argument", "Writing a second essay"], "correct": 1, "explanation": "A counterargument acknowledges the other side and explains why your position is still stronger."}
    ]'::jsonb,
    '[{"term": "Persuasive writing", "definition": "Writing that tries to convince the reader to agree with an opinion or take action"},
      {"term": "Thesis", "definition": "A clear statement of your opinion or argument"},
      {"term": "Counterargument", "definition": "Addressing the opposing view and explaining why your position is stronger"},
      {"term": "Evidence", "definition": "Facts, examples, or details that support your argument"}]'::jsonb,
    'Persuasive speaking has long been part of Indigenous governance. Leaders at treaty negotiations used careful reasoning, evidence from experience, and emotional appeals to advocate for their communities. Students can learn from this tradition of purposeful persuasion.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CC5.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a thesis?', 'A clear statement of your opinion or argument.', 'What do you believe and want others to believe?', 2, 0),
    (v_tenant, v_ch, 'What is a counterargument?', 'Addressing the opposing view and explaining why your position is still stronger.', 'Show you understand the other side, then explain why you disagree.', 2, 1),
    (v_tenant, v_ch, 'Name two types of persuasive language.', 'Strong verbs (must, should) and transition words (furthermore, most importantly).', 'Words that make your argument powerful.', 2, 2);


  -- Chapter 4 — Multimedia Presentations (CC5.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 4, 'Multimedia Presentations', 'ela-5-multimedia-presentations',
    'Demonstrate understanding through illustrated reports, dramatizations, posters, timelines, and multimedia presentations.',
    '[
      {"type": "heading", "content": "Multimedia Presentations", "level": 1},
      {"type": "text", "content": "A multimedia presentation combines different types of media — text, images, sound, and video — to share information. Using multiple media helps you reach your audience in more than one way."},
      {"type": "heading", "content": "Types of Multimedia Presentations", "level": 2},
      {"type": "text", "content": "You can create multimedia presentations in many forms:\n- Slide presentations (with text, images, and transitions)\n- Video reports with narration\n- Illustrated posters with captions\n- Timelines with images and descriptions\n- Interactive displays with physical and digital elements"},
      {"type": "heading", "content": "Design Principles", "level": 2},
      {"type": "text", "content": "Good presentations follow design principles:\n- Keep text short and clear — do not crowd slides with too many words\n- Use images that support your message\n- Choose readable fonts and high-contrast colours\n- Organize information logically with headings\n- Practise your delivery so you know when to advance slides"},
      {"type": "callout", "content": "The slides should support your words, not replace them. You are the presenter — the slides are your visual aid.", "style": "tip"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "What is a multimedia presentation?", "options": ["A handwritten report", "A presentation that combines text, images, sound, and/or video", "A verbal-only speech", "A single-page essay"], "correct": 1, "explanation": "A multimedia presentation uses multiple types of media to share information."},
      {"type": "quiz", "question": "What is one design principle for good presentations?", "options": ["Put as many words as possible on each slide", "Keep text short and clear", "Use only one colour", "Never use images"], "correct": 1, "explanation": "Good presentations keep text short and clear so the audience can focus on your message."}
    ]'::jsonb,
    '[{"term": "Multimedia", "definition": "Using more than one type of media, such as text, images, sound, and video"},
      {"term": "Design principles", "definition": "Guidelines for creating clear, effective visual presentations"},
      {"term": "Narration", "definition": "Spoken words that explain or tell a story alongside visuals"}]'::jsonb,
    'Indigenous knowledge has always been shared through multiple media: stories told around a fire combine spoken word, gesture, facial expression, and sometimes song or drumming. Modern multimedia presentations continue this tradition of using multiple channels to communicate.',
    18, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CC5.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is multimedia?', 'Using more than one type of media, such as text, images, sound, and video.', 'Multi means many, media means ways of communicating.', 2, 0),
    (v_tenant, v_ch, 'What are design principles?', 'Guidelines for creating clear, effective visual presentations.', 'Rules that make your presentation look professional.', 2, 1),
    (v_tenant, v_ch, 'What role do slides play in a presentation?', 'They support the speaker''s words as a visual aid.', 'You are the presenter — the slides help you.', 2, 2);


  -- ========================================================================
  -- UNIT 3: Assess and Reflect (AR5.1 – AR5.2)
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Identifying Strengths and Setting Goals',
    'Identifying strengths across language skills and setting goals with steps to achieve them.',
    'Self-aware learners identify their strengths and take purposeful steps to grow.',
    'How do I build on my strengths and address my challenges?')
  RETURNING id INTO v_unit;

  -- Chapter 5 — Building on Strengths (AR5.1, AR5.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 5, 'Building on Strengths', 'ela-5-building-strengths',
    'Identify strengths in all language skills and set goals with steps to achieve them.',
    '[
      {"type": "heading", "content": "Building on Strengths", "level": 1},
      {"type": "text", "content": "Everyone has strengths. Maybe you are a strong reader but need to work on your speaking skills. Or maybe you are great at presenting but need to improve your written arguments. Knowing your strengths helps you feel confident, and knowing your challenges helps you grow."},
      {"type": "heading", "content": "Identifying Your Strengths", "level": 2},
      {"type": "text", "content": "To find your strengths, reflect on:\n- What do others compliment me on?\n- What feels easy or natural to me?\n- Where do I get the best results?\n- What do I enjoy doing in language arts?\n\nYour strengths are the foundation you build on."},
      {"type": "heading", "content": "Taking Steps to Achieve Goals", "level": 2},
      {"type": "text", "content": "Once you set a goal, break it into small steps:\n1. Define your goal clearly.\n2. Identify specific actions you will take.\n3. Set a timeline for each action.\n4. Find resources or people who can help.\n5. Review your progress regularly.\n6. Celebrate milestones and adjust as needed."},
      {"type": "callout", "content": "Small consistent steps lead to big improvements. Do a little bit every day rather than trying to do everything at once.", "style": "tip"},
      {"type": "heading", "content": "Practice", "level": 2},
      {"type": "quiz", "question": "Why is it important to know your strengths?", "options": ["So you can brag", "It builds confidence and gives you a foundation to grow from", "Strengths do not matter", "Only challenges matter"], "correct": 1, "explanation": "Knowing your strengths builds confidence and provides a strong foundation for further growth."},
      {"type": "quiz", "question": "What is the first step in achieving a goal?", "options": ["Tell everyone about it", "Define your goal clearly", "Give up if it is hard", "Wait for someone to help"], "correct": 1, "explanation": "The first step is defining your goal clearly so you know exactly what you are working toward."}
    ]'::jsonb,
    '[{"term": "Strengths", "definition": "Skills or qualities you do well"},
      {"term": "Challenges", "definition": "Areas where you need more practice or development"},
      {"term": "Milestone", "definition": "A significant point of progress toward a goal"}]'::jsonb,
    'In the Medicine Wheel tradition, balance between the four directions represents balance in learning. Identifying strengths and challenges is part of seeking balance — building on what you know while growing in areas that need development.',
    15, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'AR5.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'AR5.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are strengths?', 'Skills or qualities you do well.', 'What comes naturally to you?', 2, 0),
    (v_tenant, v_ch, 'What is a milestone?', 'A significant point of progress toward a goal.', 'A checkpoint on the way to your destination.', 2, 1),
    (v_tenant, v_ch, 'What is the best way to achieve a big goal?', 'Break it into small, consistent steps.', 'A little bit every day adds up.', 2, 2);

END $$;


-- ============================================================================
-- GRADE 6 — WolfWhale English Language Arts 6
-- Outcomes: CR6.1-CR6.4, CC6.1-CC6.4, AR6.1-AR6.2
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
    WHERE tenant_id = v_tenant AND slug = 'wolfwhale-ela-6';

  -- ========================================================================
  -- UNIT 1: Critical Reading and Analysis
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Critical Reading and Analysis',
    'Evaluating purpose, audience, bias, and multiple viewpoints across a range of texts.',
    'Critical readers examine who created a text, for whom, and why — and they compare perspectives to build deeper understanding.',
    'How do purpose, audience, and bias shape the meaning of a text?')
  RETURNING id INTO v_unit;

  -- Chapter 1 — Purpose, Audience, and Bias (CR6.1, CR6.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 1, 'Purpose, Audience, and Bias', 'ela-6-purpose-audience-bias',
    'Evaluate texts by identifying purpose, intended audience, and bias, and compare multiple viewpoints on the same topic.',
    '[
      {"type": "heading", "level": 1, "text": "Purpose, Audience, and Bias"},
      {"type": "text", "content": "Every text is created by someone with a reason in mind. Skilled readers ask three questions before and during reading: Why was this written? Who is it written for? Does it present a fair, complete picture? These three questions unlock the critical reading mindset."},
      {"type": "heading", "level": 2, "text": "Author Purpose"},
      {"type": "text", "content": "Purpose is the reason a text exists. An editorial wants to change your opinion. A government pamphlet informs citizens about a program. A product review persuades shoppers. A travel journal entertains readers. The same topic — prairie weather, for example — could be written to inform (a science article), to persuade (a tourism ad), or to entertain (a personal essay). Identifying purpose helps you know how to read critically."},
      {"type": "heading", "level": 2, "text": "Intended Audience"},
      {"type": "text", "content": "Audience is who the author is writing for. Authors make vocabulary, tone, and content choices based on their intended readers. A brochure about Treaty rights written for elementary students uses simple language and illustrations. The same topic written for legal scholars uses technical language and footnotes. Ask: What age group, background, or interest does this text assume? What does the author expect the reader to already know?"},
      {"type": "callout", "style": "info", "title": "Reading Tip", "content": "Look at word choice, examples, and visuals. They reveal who the author imagined as their reader."},
      {"type": "heading", "level": 2, "text": "Bias and Viewpoint"},
      {"type": "text", "content": "Bias is a lean toward one side of an issue. All writers have a perspective shaped by their experiences, values, and goals. Signs of bias include: loaded language (words with strong positive or negative emotion), presenting only one side of an argument, leaving out important facts, and using sweeping generalizations. Comparing two or more texts on the same topic helps reveal each author''s perspective and what they choose to include or leave out."},
      {"type": "callout", "style": "tip", "title": "Strategy", "content": "When you find two articles on the same topic, list what each includes and what each leaves out. The gaps are often where bias hides."},
      {"type": "callout", "style": "info", "title": "Indigenous Perspective", "content": "Historical texts about the prairies were often written from a settler perspective, leaving out First Nations and Metis viewpoints. Comparing these texts with accounts by Indigenous authors reveals how bias shapes the historical record. Treaty education asks students to consider whose voices have been centred and whose have been pushed to the margins."},
      {"type": "quiz", "question": "A magazine article uses exciting language and presents only positive statistics about a new product. What type of bias is most present?", "options": ["No bias — all facts are true", "Omission bias — leaving out negative information", "Cultural bias — targeting one ethnic group", "Recency bias — only using new data"], "correctIndex": 1, "explanation": "Presenting only positive information and leaving out negatives is omission bias. A balanced article would include both benefits and risks."},
      {"type": "quiz", "question": "How does comparing multiple viewpoints help a reader?", "options": ["It makes reading take longer", "It reveals what each author includes, omits, and emphasizes", "It proves one source is always right", "It removes the need to think critically"], "correctIndex": 1, "explanation": "Comparing sources exposes each author''s choices — showing what is emphasized, omitted, or distorted — which deepens critical understanding."}
    ]'::jsonb,
    '[{"term": "Purpose", "definition": "The reason an author created a text"},
      {"term": "Audience", "definition": "The intended reader or viewer a text is created for"},
      {"term": "Bias", "definition": "A lean toward one perspective, often shown through word choice or omission of information"},
      {"term": "Viewpoint", "definition": "The position or perspective from which an author presents a topic"},
      {"term": "Loaded language", "definition": "Words chosen for their strong emotional impact rather than neutral description"},
      {"term": "Omission", "definition": "Leaving out information that might change a reader''s interpretation"}]'::jsonb,
    'Historical accounts of the Canadian prairies were largely written by settlers and government officials, omitting Indigenous perspectives. Reading Treaty texts alongside First Nations oral histories demonstrates how purpose and audience shape what gets recorded and what gets erased.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CR6.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CR6.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is author purpose?', 'The reason an author created a text — to inform, persuade, entertain, or express.', 'Why did the author write this?', 3, 0),
    (v_tenant, v_ch, 'What is bias in a text?', 'A lean toward one perspective, often shown through word choice or leaving out information.', 'One-sided presentation.', 3, 1),
    (v_tenant, v_ch, 'What is loaded language?', 'Words chosen for strong emotional impact rather than neutral description.', 'Words that make you feel a certain way.', 3, 2),
    (v_tenant, v_ch, 'How do you identify intended audience?', 'Look at vocabulary level, examples used, tone, and what the author assumes the reader already knows.', 'Who is the author picturing as they write?', 3, 3);


  -- ========================================================================
  -- UNIT 2: Essay Writing
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Essay Writing',
    'Planning and writing five-paragraph essays with strong thesis statements, transitions, and textual evidence.',
    'Organized, evidence-based writing communicates ideas clearly and persuasively.',
    'How do I structure an essay that clearly presents and supports my ideas?')
  RETURNING id INTO v_unit;

  -- Chapter 2 — The Five-Paragraph Essay (CC6.4)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 2, 'The Five-Paragraph Essay', 'ela-6-five-paragraph-essay',
    'Plan and write a five-paragraph essay with a clear thesis, body paragraphs with evidence, and a conclusion.',
    '[
      {"type": "heading", "level": 1, "text": "The Five-Paragraph Essay"},
      {"type": "text", "content": "The five-paragraph essay is a foundational writing structure. It trains writers to introduce an idea, support it with evidence, and wrap up with a conclusion. Once you master this structure, you can expand it for longer, more complex writing."},
      {"type": "heading", "level": 2, "text": "Essay Structure"},
      {"type": "text", "content": "Paragraph 1 — Introduction: Opens with a hook (an interesting question, fact, or statement), provides background context, and ends with a thesis statement that clearly states your main argument. Paragraphs 2, 3, 4 — Body: Each body paragraph focuses on one supporting reason. It begins with a topic sentence, provides evidence, explains the connection to the thesis, and closes with a transition. Paragraph 5 — Conclusion: Restates the thesis in new words, summarizes the main points, and ends with a closing thought."},
      {"type": "callout", "style": "tip", "title": "Writing Tip", "content": "Your topic sentences are like mini-thesis statements — each one should clearly state what that paragraph will prove."},
      {"type": "heading", "level": 2, "text": "Writing a Strong Thesis"},
      {"type": "text", "content": "A thesis is not a fact and not a question. It is a debatable claim that your essay will prove. A weak thesis states an obvious fact. A strong thesis makes a specific claim and signals the three supporting reasons the essay will develop. Every sentence in your essay should connect back to your thesis."},
      {"type": "heading", "level": 2, "text": "Transitions"},
      {"type": "text", "content": "Transitions are the glue that holds your essay together. Use them between paragraphs and within paragraphs. Useful transitions include: First, additionally, furthermore, on the other hand, as a result, in conclusion, and ultimately. Vary your transitions to keep your writing flowing naturally."},
      {"type": "callout", "style": "info", "title": "Common Mistake", "content": "Never start a body paragraph with ''In this paragraph I will talk about...'' Instead, begin with a strong topic sentence that directly states your argument."},
      {"type": "quiz", "question": "What is the purpose of a thesis statement?", "options": ["To summarize the whole essay in one word", "To state a debatable claim that the essay will prove", "To list all the facts in the essay", "To introduce the author"], "correctIndex": 1, "explanation": "A thesis states a specific, debatable claim — not a fact — that the rest of the essay will support with evidence."},
      {"type": "quiz", "question": "What should each body paragraph begin with?", "options": ["A transition word only", "A topic sentence that states the paragraph''s main argument", "A quotation from the text", "A question"], "correctIndex": 1, "explanation": "A topic sentence clearly states what the paragraph will prove, acting as a mini-thesis for that section."}
    ]'::jsonb,
    '[{"term": "Thesis statement", "definition": "A specific, debatable claim that an essay will prove"},
      {"term": "Topic sentence", "definition": "The opening sentence of a body paragraph that states its main argument"},
      {"term": "Transition", "definition": "A word or phrase that connects ideas between sentences or paragraphs"},
      {"term": "Hook", "definition": "An opening sentence designed to capture the reader''s interest"},
      {"term": "Evidence", "definition": "Facts, statistics, or examples used to support a claim"}]'::jsonb,
    'Indigenous storytelling uses structured form just as essays do — an opening that establishes context, a body that develops the teaching through narrative, and a closing that returns to the central lesson. The five-paragraph essay mirrors this purposeful, circular structure of oral tradition.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CC6.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a thesis statement?', 'A specific, debatable claim that an essay will prove.', 'Not a fact, not a question — a claim you will defend.', 3, 0),
    (v_tenant, v_ch, 'What is a topic sentence?', 'The opening sentence of a body paragraph that states its main argument.', 'Mini-thesis for one paragraph.', 3, 1),
    (v_tenant, v_ch, 'What is a transition?', 'A word or phrase that connects ideas between sentences or paragraphs.', 'The glue that holds writing together.', 3, 2),
    (v_tenant, v_ch, 'What is a hook?', 'An opening sentence designed to capture the reader''s interest.', 'What grabs you at the beginning?', 3, 3);


  -- ========================================================================
  -- UNIT 3: Media Literacy
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Media Literacy',
    'Analyzing advertising techniques, evaluating news sources, and practicing responsible digital citizenship.',
    'Media-literate citizens think critically about the messages they consume and create online and offline.',
    'How do I navigate media messages responsibly and think critically about what I see, hear, and read?')
  RETURNING id INTO v_unit;

  -- Chapter 3 — Media Literacy and Digital Citizenship (CR6.3, CC6.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 3, 'Media Literacy and Digital Citizenship', 'ela-6-media-literacy',
    'Analyze advertising techniques, evaluate news sources for credibility, and apply principles of responsible digital citizenship.',
    '[
      {"type": "heading", "level": 1, "text": "Media Literacy and Digital Citizenship"},
      {"type": "text", "content": "Media literacy is the ability to access, analyze, evaluate, and create media in all its forms. In a world where information flows constantly from screens, speakers, and print, this skill is as essential as reading itself. Digital citizenship means using technology and online spaces responsibly, ethically, and safely."},
      {"type": "heading", "level": 2, "text": "Advertising Techniques"},
      {"type": "text", "content": "Advertisers use specific techniques to influence your choices. Celebrity endorsement transfers a famous person''s positive image onto a product. Fear of missing out (FOMO) suggests you will be left behind if you do not buy or join. False scarcity creates urgency: only 3 left! Testimonials use ordinary people''s positive experiences to make products seem relatable. Repetition builds familiarity and trust by showing you the same message many times. Recognizing these techniques makes you a more intentional consumer."},
      {"type": "callout", "style": "tip", "title": "Critical Viewing Tip", "content": "When you see an ad, ask: Who paid for this? Who benefits if I believe this message? What am I not being told?"},
      {"type": "heading", "level": 2, "text": "Evaluating News Sources"},
      {"type": "text", "content": "Not all information online is accurate. Use the SIFT method to evaluate sources: Stop before you share or believe. Investigate the source — who created it and do they have expertise? Find better coverage — look for the same story from multiple credible outlets. Trace claims to the original source. Credible sources cite their evidence, name their authors, and distinguish clearly between news reporting and opinion."},
      {"type": "heading", "level": 2, "text": "Digital Citizenship"},
      {"type": "text", "content": "Responsible digital citizens protect their own privacy and the privacy of others, think before posting since online content can be permanent, treat others with the same respect online as in person, understand that digital footprints can affect future opportunities, report harmful content rather than sharing it, and give credit when using others'' work or ideas."},
      {"type": "callout", "style": "info", "title": "Indigenous Perspective", "content": "Indigenous communities across Saskatchewan have developed their own media outlets, radio stations, and social media channels to share their stories and counter misrepresentation. Organizations like Aboriginal Peoples Television Network demonstrate how communities can control their own media narrative. Students learning media literacy can consider whose voices dominate mainstream media and why."},
      {"type": "quiz", "question": "What does the S in the SIFT method stand for?", "options": ["Share immediately", "Stop before you share or believe", "Search for the author", "Summarize the article"], "correctIndex": 1, "explanation": "S stands for Stop — pausing to check before sharing or believing a claim is the first and most important step in media evaluation."},
      {"type": "quiz", "question": "What is a digital footprint?", "options": ["A photo of your foot online", "The trail of data and content you leave behind online", "A type of digital art", "A cookie on your browser"], "correctIndex": 1, "explanation": "A digital footprint is the record of your online activity — posts, searches, accounts — that can be seen by others and may be permanent."}
    ]'::jsonb,
    '[{"term": "Media literacy", "definition": "The ability to access, analyze, evaluate, and create media in all forms"},
      {"term": "Digital citizenship", "definition": "Using technology and online spaces responsibly, ethically, and safely"},
      {"term": "SIFT", "definition": "A method for evaluating online information: Stop, Investigate, Find better coverage, Trace claims"},
      {"term": "Testimonial", "definition": "An advertising technique using a real person''s positive experience to promote a product"},
      {"term": "Digital footprint", "definition": "The trail of data and content a person leaves behind through online activity"},
      {"term": "Credibility", "definition": "The quality of being trusted and believed based on evidence and expertise"}]'::jsonb,
    'Indigenous media organizations demonstrate that communities can reclaim their own narrative in the media landscape. Understanding media literacy helps students recognize historical misrepresentation of Indigenous peoples and appreciate why community-controlled media is a form of self-determination.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CR6.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CC6.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is media literacy?', 'The ability to access, analyze, evaluate, and create media in all forms.', 'Reading between the lines of any media.', 3, 0),
    (v_tenant, v_ch, 'What does SIFT stand for?', 'Stop, Investigate, Find better coverage, Trace claims.', 'A method for checking online information.', 3, 1),
    (v_tenant, v_ch, 'What is a digital footprint?', 'The trail of data and content a person leaves behind through online activity.', 'What you leave behind on the internet.', 3, 2),
    (v_tenant, v_ch, 'What is the testimonial advertising technique?', 'Using a real person''s positive experience to promote a product.', 'Someone just like you loves this product!', 3, 3);


  -- ========================================================================
  -- UNIT 4: Debate and Oral Communication
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Debate and Oral Communication',
    'Constructing arguments, delivering rebuttals, and practicing active listening in structured debate contexts.',
    'Effective speakers build logical arguments, respond respectfully to opposing views, and listen to understand rather than just to reply.',
    'How do I construct and defend an argument while remaining open to other perspectives?')
  RETURNING id INTO v_unit;

  -- Chapter 4 — Debate and Argument Construction (CC6.1, CC6.3)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 4, 'Debate and Argument Construction', 'ela-6-debate-argument',
    'Construct logical arguments, deliver rebuttals, and demonstrate active listening in debate and oral communication contexts.',
    '[
      {"type": "heading", "level": 1, "text": "Debate and Argument Construction"},
      {"type": "text", "content": "A debate is a structured conversation in which two sides argue opposing positions on an issue. Participating in debate builds critical thinking, public speaking, respectful disagreement, and the ability to see multiple sides of an issue. These skills are valuable in classrooms, workplaces, and communities."},
      {"type": "heading", "level": 2, "text": "Building an Argument"},
      {"type": "text", "content": "A strong argument has three parts. Claim: your clear position on the issue — Schools should provide free breakfast programs to all students. Reasoning: the logic that connects your claim to evidence — Students who eat breakfast concentrate better and miss fewer days. Evidence: facts, statistics, or examples that prove your reasoning — Research shows attendance increases in districts with free breakfast programs. Practice building arguments using this claim-reasoning-evidence structure for any issue."},
      {"type": "callout", "style": "tip", "title": "Debate Tip", "content": "Know the opposing argument as well as your own. The best debaters can argue both sides — it sharpens their thinking and prepares them for rebuttals."},
      {"type": "heading", "level": 2, "text": "Rebuttals"},
      {"type": "text", "content": "A rebuttal responds directly to the opposing team''s argument. An effective rebuttal acknowledges what the other side said, identifies a flaw in their logic or evidence, presents counter-evidence, and reinforces your own position. Avoid personal attacks — rebuttals should target arguments, not people. Start with phrases like: While my opponent argues... the evidence actually shows... or That point overlooks the fact that..."},
      {"type": "heading", "level": 2, "text": "Active Listening in Debate"},
      {"type": "text", "content": "Active listening means giving full attention to the speaker, taking notes on their key points, and resisting the urge to plan your response while they are still speaking. You cannot construct an effective rebuttal without first genuinely understanding the opposing argument. Listeners who truly hear the other side often discover valid points that improve their own thinking."},
      {"type": "callout", "style": "info", "title": "Indigenous Perspective", "content": "Talking circles — used in many First Nations communities across Saskatchewan — are a form of structured oral communication in which every voice is heard before responses are given. This practice emphasizes listening fully before speaking, which is the foundation of respectful debate and oral communication."},
      {"type": "quiz", "question": "What are the three parts of a strong argument?", "options": ["Introduction, body, conclusion", "Claim, reasoning, evidence", "Opinion, example, opinion again", "Question, answer, question"], "correctIndex": 1, "explanation": "A strong argument begins with a clear claim, connects it through reasoning, and supports it with evidence."},
      {"type": "quiz", "question": "What should a rebuttal do first?", "options": ["Ignore what the opponent said", "Attack the speaker personally", "Acknowledge what the other side said before identifying flaws", "Repeat your original argument exactly"], "correctIndex": 2, "explanation": "Acknowledging the opposing argument shows you listened — then you can identify flaws and present counter-evidence."}
    ]'::jsonb,
    '[{"term": "Debate", "definition": "A structured conversation in which two sides argue opposing positions on an issue"},
      {"term": "Claim", "definition": "A clear statement of your position on an issue"},
      {"term": "Reasoning", "definition": "The logic that connects a claim to evidence"},
      {"term": "Rebuttal", "definition": "A response that directly addresses and counters the opposing argument"},
      {"term": "Active listening", "definition": "Giving full, focused attention to a speaker in order to genuinely understand their message"}]'::jsonb,
    'The talking circle tradition in many Saskatchewan First Nations communities models respectful, structured oral communication where listening is valued as much as speaking. This tradition informs modern debate practices by emphasizing that understanding others'' perspectives is the foundation of meaningful dialogue.',
    28, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CC6.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CC6.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are the three parts of a strong argument?', 'Claim, reasoning, and evidence.', 'Position + logic + proof.', 3, 0),
    (v_tenant, v_ch, 'What is a rebuttal?', 'A response that directly addresses and counters the opposing argument.', 'You heard them — now respond.', 3, 1),
    (v_tenant, v_ch, 'What is active listening?', 'Giving full, focused attention to a speaker to genuinely understand their message.', 'Listen to understand, not just to reply.', 3, 2),
    (v_tenant, v_ch, 'What should a rebuttal avoid?', 'Personal attacks — rebuttals should target arguments, not people.', 'Keep it respectful and logical.', 3, 3);


  -- ========================================================================
  -- UNIT 5: Inquiry and Research Reports
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 5, 'Inquiry and Research Reports',
    'Developing research questions, evaluating sources, synthesizing information, and citing sources correctly.',
    'Effective researchers ask focused questions, evaluate sources critically, and synthesize information into original, well-cited reports.',
    'How do I find, evaluate, and responsibly use information to answer my research questions?')
  RETURNING id INTO v_unit;

  -- Chapter 5 — Research Reports and Source Evaluation (CR6.4, CC6.4)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 5, 'Inquiry and Research Reports', 'ela-6-research-reports',
    'Develop research questions, evaluate sources for credibility, synthesize information, and cite sources in a research report.',
    '[
      {"type": "heading", "level": 1, "text": "Inquiry and Research Reports"},
      {"type": "text", "content": "A research report is an organized piece of writing that answers a focused question using information gathered from multiple credible sources. You are not just restating what you read — you are synthesizing, combining information from multiple sources to build your own understanding and present original conclusions."},
      {"type": "heading", "level": 2, "text": "Developing a Research Question"},
      {"type": "text", "content": "A research question focuses your inquiry. It should be specific enough to research but broad enough to find information on. Too broad: What is climate change? Too narrow: How many millimetres of rain fell in one city in one week? Just right: How have changing precipitation patterns in Saskatchewan affected traditional food harvesting practices over the past two decades? A strong research question often asks how, why, or to what extent — not just what."},
      {"type": "callout", "style": "tip", "title": "Research Tip", "content": "Once you have a draft question, ask: Can I actually find information about this? Is it specific enough to answer fully? If yes to both, you have a strong research question."},
      {"type": "heading", "level": 2, "text": "Evaluating Sources"},
      {"type": "text", "content": "Use the CRAAP test to evaluate sources. Currency: how recently was this published? Relevance: does it answer your research question? Authority: who wrote it and what are their credentials? Accuracy: is the information supported by evidence and citations? Purpose: is it trying to inform, persuade, or sell something? Government websites, peer-reviewed journals, and established news organizations are generally more reliable than personal blogs or anonymous wikis."},
      {"type": "heading", "level": 2, "text": "Synthesis and Citation"},
      {"type": "text", "content": "Synthesis means combining information from multiple sources to form your own understanding. When you write, you must paraphrase (restate in your own words), cite (tell readers where the information came from), and avoid plagiarism (using someone else''s words or ideas without credit). A basic citation includes author name, title, publication or website name, and date."},
      {"type": "callout", "style": "info", "title": "Indigenous Perspective", "content": "Indigenous research methodologies emphasize that knowledge belongs to communities, not just individuals. When researching topics that involve First Nations or Metis communities in Saskatchewan, seek out sources created by those communities — band websites, Indigenous news organizations — rather than relying solely on outside academic perspectives."},
      {"type": "quiz", "question": "What makes a research question strong?", "options": ["It is extremely broad and covers everything", "It is specific enough to research but broad enough to find information on", "It can be answered with yes or no", "It has already been answered online"], "correctIndex": 1, "explanation": "A strong research question is focused enough to research deeply but open enough to explore multiple sources and perspectives."},
      {"type": "quiz", "question": "What is synthesis in research writing?", "options": ["Copying information from one great source", "Combining information from multiple sources to form your own understanding", "Summarizing only the introduction of each source", "Adding your opinion at the end of a summary"], "correctIndex": 1, "explanation": "Synthesis combines information from multiple sources — not just one — to build original understanding and conclusions."}
    ]'::jsonb,
    '[{"term": "Research question", "definition": "A focused question that guides an inquiry and can be answered through research"},
      {"term": "Synthesis", "definition": "Combining information from multiple sources to form original understanding"},
      {"term": "CRAAP test", "definition": "A method for evaluating sources: Currency, Relevance, Authority, Accuracy, Purpose"},
      {"term": "Citation", "definition": "Information that tells the reader where a fact or idea came from"},
      {"term": "Plagiarism", "definition": "Using someone else''s words or ideas without giving them credit"},
      {"term": "Paraphrase", "definition": "Restating information from a source in your own words"}]'::jsonb,
    'Indigenous research methodologies recognize that knowledge is relational and community-owned. When Grade 6 students research topics connected to First Nations and Metis peoples, they are encouraged to prioritize sources created by those communities and to understand that not all knowledge is meant to be extracted and shared publicly.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CR6.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is synthesis?', 'Combining information from multiple sources to form your own understanding.', 'More than one source, your own conclusions.', 3, 0),
    (v_tenant, v_ch, 'What does the A in CRAAP stand for?', 'Authority — who wrote it and what are their credentials?', 'Can you trust the author?', 3, 1),
    (v_tenant, v_ch, 'What is plagiarism?', 'Using someone else''s words or ideas without giving them credit.', 'Taking credit for work that is not yours.', 3, 2),
    (v_tenant, v_ch, 'What is a strong research question?', 'One that is specific enough to research but broad enough to find information on, often asking how or why.', 'Focused but open — not yes/no.', 3, 3);

END $$;


-- ============================================================================
-- GRADE 7 — WolfWhale English Language Arts 7
-- Outcomes: CR7.1-CR7.4, CC7.1-CC7.4, AR7.1-AR7.2
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
    WHERE tenant_id = v_tenant AND slug = 'wolfwhale-ela-7';

  -- ========================================================================
  -- UNIT 1: Novel Study and Literary Analysis
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Novel Study and Literary Analysis',
    'Analyzing character development, theme, symbolism, and personal connections in fiction.',
    'Literary analysis reveals how authors use craft to communicate meaning beyond the literal story.',
    'How do authors use character, theme, and symbolism to create meaning?')
  RETURNING id INTO v_unit;

  -- Chapter 1 — Novel Study and Literary Analysis (CR7.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 1, 'Novel Study and Literary Analysis', 'ela-7-novel-study',
    'Analyze character development, theme, symbolism, and personal connections in a novel or extended literary text.',
    '[
      {"type": "heading", "level": 1, "text": "Novel Study and Literary Analysis"},
      {"type": "text", "content": "Literary analysis means looking carefully at a text to understand not just what happens, but how and why the author made specific choices. When you study a novel closely, you examine the building blocks of storytelling: character, theme, symbolism, and the connections the story draws to the real world."},
      {"type": "heading", "level": 2, "text": "Character Development"},
      {"type": "text", "content": "Characters in fiction rarely stay the same — they grow, change, and respond to the events around them. A dynamic character changes significantly over the course of a story. A static character stays essentially the same. When analyzing character, examine what a character says and does, what others say about them, how they respond to conflict, and how they change from beginning to end. Their internal conflicts — struggles within themselves — are often more revealing than their external conflicts with others."},
      {"type": "callout", "style": "tip", "title": "Analysis Tip", "content": "Use textual evidence to support your character analysis. Never claim a character is brave or selfish without pointing to a specific scene or passage that proves it."},
      {"type": "heading", "level": 2, "text": "Theme"},
      {"type": "text", "content": "A theme is the author''s central insight about human experience — what the story is really saying beneath the surface. Themes are expressed as complete statements, not single words. Identity is a topic, not a theme. A theme based on identity might state: When people are forced to abandon their language and culture, they lose a part of themselves that cannot be fully recovered. The same story can carry multiple themes. Strong readers identify themes and support them with evidence from the text."},
      {"type": "heading", "level": 2, "text": "Symbolism"},
      {"type": "text", "content": "A symbol is an object, place, or event that represents something beyond its literal meaning. A river might symbolize change, freedom, or the passage of time. A locked door might symbolize secrets or barriers. Authors choose symbols deliberately. When you find a recurring image in a text, ask: why does the author keep returning to this? Look for symbols in repeated images, meaningful objects, settings with emotional weight, and actions with ritualistic significance."},
      {"type": "heading", "level": 2, "text": "Making Connections"},
      {"type": "text", "content": "Skilled readers make three types of connections: text-to-self (this reminds me of my own experience), text-to-text (this is similar to another book or story I know), and text-to-world (this connects to something happening in society, history, or current events). Meaningful connections go beyond surface similarity — they deepen your understanding of the text''s themes and characters."},
      {"type": "callout", "style": "info", "title": "Indigenous Perspective", "content": "Many Saskatchewan First Nations and Metis authors write novels and stories exploring themes of identity, loss, belonging, and resilience. Works that centre Indigenous experiences on the prairies offer students the opportunity to make text-to-world connections with Treaty relationships, residential school history, and land-based identity. Reading these works alongside other texts broadens the literary landscape."},
      {"type": "quiz", "question": "What is the difference between a dynamic and a static character?", "options": ["Dynamic characters are more exciting", "Dynamic characters change significantly; static characters remain essentially the same", "Static characters are always villains", "Dynamic characters only appear in action stories"], "correctIndex": 1, "explanation": "A dynamic character undergoes meaningful change over the course of the story; a static character''s core traits remain unchanged."},
      {"type": "quiz", "question": "How should a theme be expressed?", "options": ["As a single word like courage or friendship", "As a complete statement about human experience", "As a question the author asks", "As a summary of the plot"], "correctIndex": 1, "explanation": "Themes are complete statements that express the author''s insight about human experience — not just topic words."}
    ]'::jsonb,
    '[{"term": "Dynamic character", "definition": "A character who changes significantly over the course of a story"},
      {"term": "Static character", "definition": "A character whose core traits remain unchanged throughout the story"},
      {"term": "Theme", "definition": "A complete statement expressing the author''s central insight about human experience"},
      {"term": "Symbol", "definition": "An object, place, or event that represents something beyond its literal meaning"},
      {"term": "Internal conflict", "definition": "A struggle within a character, such as between competing desires or values"},
      {"term": "Text-to-world connection", "definition": "A link between a text''s ideas and events in history, society, or current events"}]'::jsonb,
    'First Nations and Metis literature from Saskatchewan frequently uses symbolism drawn from the land — the river, the eagle, the buffalo — to communicate teachings about identity and relationship. Reading Indigenous authors alongside literary analysis frameworks helps students see that symbol systems are culturally rooted, not universal.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CR7.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a dynamic character?', 'A character who changes significantly over the course of a story.', 'Different at the end than at the beginning.', 3, 0),
    (v_tenant, v_ch, 'How should a theme be stated?', 'As a complete statement about human experience, not just a single topic word.', 'Not just courage — but what the story says about courage.', 3, 1),
    (v_tenant, v_ch, 'What is a symbol?', 'An object, place, or event that represents something beyond its literal meaning.', 'It stands for something deeper.', 3, 2),
    (v_tenant, v_ch, 'What are the three types of reading connections?', 'Text-to-self, text-to-text, and text-to-world.', 'Connect to yourself, another text, or the wider world.', 3, 3);


  -- ========================================================================
  -- UNIT 2: Creative Writing — Craft and Voice
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Creative Writing: Craft and Voice',
    'Developing writer''s voice through dialogue, figurative language, and genre exploration.',
    'A writer''s voice emerges through deliberate craft choices — word selection, sentence rhythm, and the authentic expression of perspective.',
    'How do writers develop a distinctive voice and use craft to bring stories to life?')
  RETURNING id INTO v_unit;

  -- Chapter 2 — Creative Writing: Craft and Voice (CC7.4)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 2, 'Creative Writing: Craft and Voice', 'ela-7-creative-writing-voice',
    'Develop a distinctive writer''s voice using dialogue, figurative language, and genre conventions.',
    '[
      {"type": "heading", "level": 1, "text": "Creative Writing: Craft and Voice"},
      {"type": "text", "content": "Voice is what makes your writing sound like you and no one else. It is the combination of word choices, sentence rhythms, attitude, and perspective that gives your writing personality. Developing your voice means practising craft intentionally — not just writing whatever comes first, but choosing words, structures, and images that express your unique way of seeing the world."},
      {"type": "heading", "level": 2, "text": "Writing Authentic Dialogue"},
      {"type": "text", "content": "Dialogue brings characters to life and moves stories forward. Tips for authentic dialogue: read your dialogue aloud to hear whether it sounds like real speech; give each character a distinct way of speaking based on their personality; use dialogue tags sparingly — said is almost always better than exclaimed or bellowed; reveal character through what people choose to say and, more importantly, what they choose not to say; use beats (small actions between dialogue lines) instead of tags to break up conversation."},
      {"type": "callout", "style": "tip", "title": "Dialogue Tip", "content": "Avoid having characters explain things to each other that they would already know. Dialogue should reveal character and advance the story — not just deliver information."},
      {"type": "heading", "level": 2, "text": "Figurative Language"},
      {"type": "text", "content": "Figurative language makes writing vivid and resonant. Simile compares two unlike things using like or as. Metaphor makes a direct comparison without like or as. Personification gives human qualities to non-human things. Imagery uses sensory detail to create experience. Hyperbole exaggerates for effect. Use figurative language purposefully — a single strong metaphor outperforms a paragraph crammed with similes."},
      {"type": "heading", "level": 2, "text": "Genre Exploration"},
      {"type": "text", "content": "Genre is a category of writing with specific conventions that readers recognize. Science fiction imagines future technology or alternate worlds. Mystery builds suspense around an unknown. Historical fiction blends factual settings with invented characters. Realistic fiction mirrors everyday life. Genre exploration means trying different forms and understanding how each one shapes what you write and how readers experience it."},
      {"type": "callout", "style": "info", "title": "Indigenous Perspective", "content": "Many First Nations and Metis writers draw on both traditional oral storytelling conventions and contemporary literary genres. Authors blend the trickster narrative tradition with modern fiction techniques, creating a distinct literary voice that is neither purely traditional nor purely Western. Exploring this blend in your own writing can be a powerful way to experiment with genre and voice."},
      {"type": "quiz", "question": "What is a metaphor?", "options": ["A comparison using like or as", "A direct comparison without like or as", "An exaggeration for effect", "Giving human qualities to objects"], "correctIndex": 1, "explanation": "A metaphor makes a direct comparison — the river was a silver thread — without using like or as."},
      {"type": "quiz", "question": "What makes dialogue authentic in fiction?", "options": ["Using lots of exclamation marks", "Making characters explain everything to each other", "Having characters reveal personality through what they say and do not say", "Using a different dialogue tag for every line"], "correctIndex": 2, "explanation": "Authentic dialogue reveals character through choices — what a character says and what they leave unsaid is more powerful than excessive explanation."}
    ]'::jsonb,
    '[{"term": "Voice", "definition": "The unique combination of word choices, rhythm, attitude, and perspective that makes writing sound like a specific author"},
      {"term": "Dialogue", "definition": "The words spoken by characters in a story, written in quotation marks"},
      {"term": "Simile", "definition": "A comparison between two unlike things using like or as"},
      {"term": "Metaphor", "definition": "A direct comparison between two unlike things without using like or as"},
      {"term": "Personification", "definition": "Giving human qualities or actions to non-human things"},
      {"term": "Genre", "definition": "A category of writing with recognizable conventions, such as mystery, science fiction, or realistic fiction"}]'::jsonb,
    'The trickster figure — Wisahkecahk and others — appears across many First Nations oral traditions in Saskatchewan, using paradox, humour, and unexpected perspectives to convey deep truths. These oral story conventions are a form of literary voice that contemporary Indigenous authors carry into written fiction, demonstrating that voice is always rooted in cultural tradition.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CC7.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is writer''s voice?', 'The unique combination of word choice, rhythm, attitude, and perspective that makes writing sound like a specific author.', 'What makes your writing sound like you.', 3, 0),
    (v_tenant, v_ch, 'What is personification?', 'Giving human qualities or actions to non-human things.', 'The wind whispered...', 3, 1),
    (v_tenant, v_ch, 'What is a genre?', 'A category of writing with recognizable conventions, such as mystery or science fiction.', 'The type or kind of story.', 3, 2),
    (v_tenant, v_ch, 'What is a simile?', 'A comparison between two unlike things using like or as.', 'The river ran like...', 3, 3);


  -- ========================================================================
  -- UNIT 3: Oral Presentations and Performance
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Oral Presentations and Performance',
    'Developing public speaking skills through prepared presentations, storytelling, and spoken word performance.',
    'Effective oral communication combines prepared content with confident, engaging delivery tailored to the audience.',
    'How do I present ideas confidently and connect with an audience through spoken performance?')
  RETURNING id INTO v_unit;

  -- Chapter 3 — Oral Presentations and Performance (CC7.1, CC7.3)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 3, 'Oral Presentations and Performance', 'ela-7-oral-presentations',
    'Plan and deliver oral presentations, storytelling performances, and spoken word pieces for various audiences.',
    '[
      {"type": "heading", "level": 1, "text": "Oral Presentations and Performance"},
      {"type": "text", "content": "Speaking in front of others is one of the most universally useful skills you can develop. Whether you are delivering a formal report, telling a personal story, or performing a spoken word piece, the core skills are the same: preparation, practice, audience awareness, and the courage to be present in the moment."},
      {"type": "heading", "level": 2, "text": "Planning an Oral Presentation"},
      {"type": "text", "content": "A strong oral presentation is planned in three stages. First, clarify your purpose and audience — who are you speaking to and what do you want them to understand, feel, or do? Second, organize your content with a clear structure: opening hook, organized body, memorable closing. Third, choose your delivery tools — will you use visuals, props, or movement? Planning on paper before speaking prevents rambling and builds confidence."},
      {"type": "callout", "style": "tip", "title": "Presentation Tip", "content": "Practise out loud at least three times, including once in front of a mirror or phone camera. Hearing your own voice builds comfort and reveals filler words like um and uh."},
      {"type": "heading", "level": 2, "text": "Storytelling"},
      {"type": "text", "content": "A compelling oral story has a clear narrative arc: a gripping opening that establishes characters and setting, rising tension through a central problem, a climax where the tension peaks, and a resolution that leaves the audience with something to think about. Oral storytellers use pacing, volume variation, pause, and physical gesture to bring stories alive for listeners."},
      {"type": "heading", "level": 2, "text": "Spoken Word"},
      {"type": "text", "content": "Spoken word is a performance poetry form that blends the craftsmanship of written poetry with the power of live vocal delivery. It often addresses social issues, personal identity, or community experience. In spoken word, rhythm and repetition create momentum, personal truth connects with audiences, strong imagery makes abstract ideas concrete, and delivery is as important as content."},
      {"type": "callout", "style": "info", "title": "Indigenous Perspective", "content": "Oral tradition in First Nations and Metis communities of Saskatchewan is a living practice. Storytelling gatherings, powwow emcees, and Elder teachings demonstrate that oral performance is a sophisticated art form with its own conventions, protocols, and power. Students exploring spoken word can draw on oral tradition principles: purposeful repetition, connection to land, and the responsibility that comes with speaking in front of a community."},
      {"type": "quiz", "question": "What are the three planning stages for an oral presentation?", "options": ["Write, memorize, perform", "Clarify purpose and audience, organize content, choose delivery tools", "Choose a topic, read about it, present it", "Introduction, body, conclusion"], "correctIndex": 1, "explanation": "Effective oral presentations are planned by first clarifying purpose and audience, then organizing content, then selecting appropriate delivery tools."},
      {"type": "quiz", "question": "What makes spoken word different from a standard oral report?", "options": ["It uses no preparation", "It blends poetic craft with live vocal performance and often addresses personal or social themes", "It is always memorized word for word", "It requires musical accompaniment"], "correctIndex": 1, "explanation": "Spoken word combines the craft of poetry with live performance delivery, and often explores personal identity or social issues in a distinctive voice."}
    ]'::jsonb,
    '[{"term": "Oral presentation", "definition": "A planned speech or performance delivered to an audience"},
      {"term": "Narrative arc", "definition": "The structure of a story: opening, rising action, climax, and resolution"},
      {"term": "Pacing", "definition": "The speed at which a speaker delivers their words to create effect"},
      {"term": "Spoken word", "definition": "A performance poetry form that combines written craft with live vocal delivery"},
      {"term": "Pause", "definition": "A deliberate moment of silence used for effect in oral performance"}]'::jsonb,
    'Oral tradition in Saskatchewan First Nations and Metis communities has always been a sophisticated performance art, with skilled storytellers using deliberate pacing, repetition, and imagery to transmit cultural knowledge. The spoken word tradition students explore in Grade 7 connects directly to these living oral traditions.',
    28, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CC7.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CC7.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is narrative arc?', 'The structure of a story: opening, rising action, climax, and resolution.', 'The shape of a story from beginning to end.', 3, 0),
    (v_tenant, v_ch, 'What is pacing in oral storytelling?', 'The speed at which a speaker delivers words to create effect — slowing for suspense, speeding for action.', 'Fast or slow — it is a choice.', 3, 1),
    (v_tenant, v_ch, 'What is spoken word?', 'A performance poetry form combining written craft with live vocal delivery.', 'Poetry that lives when performed.', 3, 2),
    (v_tenant, v_ch, 'Why is pause powerful in oral performance?', 'Silence creates suspense, gives audiences time to absorb meaning, and adds emphasis.', 'What you don''t say can matter as much as what you do.', 3, 3);


  -- ========================================================================
  -- UNIT 4: Research and Citation Skills
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Research and Citation Skills',
    'Applying MLA citation basics, taking organized notes, and distinguishing between paraphrasing and quoting.',
    'Responsible researchers give credit to sources and distinguish clearly between their own thinking and the ideas they have borrowed.',
    'How do I use sources ethically and give proper credit through citation?')
  RETURNING id INTO v_unit;

  -- Chapter 4 — Research and Citation Skills (CC7.2, CR7.4)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 4, 'Research and Citation Skills', 'ela-7-research-citation',
    'Apply MLA citation format, take organized research notes, and distinguish between paraphrasing and direct quotation.',
    '[
      {"type": "heading", "level": 1, "text": "Research and Citation Skills"},
      {"type": "text", "content": "Research writing requires two parallel skills: finding and understanding information, and giving proper credit to the sources of that information. Citation is not just a technical requirement — it is an ethical practice that respects the intellectual work of others and allows readers to verify your sources."},
      {"type": "heading", "level": 2, "text": "MLA Citation Basics"},
      {"type": "text", "content": "MLA (Modern Language Association) format is commonly used in English Language Arts. For a book: Author Last, First. Title of Book. Publisher, Year. For a website: Author Last, First (if known). Page Title. Website Name, Date Published, URL. In-text citations give the author''s last name and page number in brackets after a quote or paraphrase: (Smith 42). If there is no author, use a short version of the title. The important thing is consistency — always ask your teacher which citation format your class is using."},
      {"type": "callout", "style": "tip", "title": "Citation Tip", "content": "Keep a running list of your sources as you research — do not wait until the end. Recording source details while you have the source open saves significant time and prevents missing information."},
      {"type": "heading", "level": 2, "text": "Note-Taking Strategies"},
      {"type": "text", "content": "Effective note-taking captures key information without copying entire sentences. Record the source information at the top of each notes page before taking any notes. Write keywords and phrases, not full sentences — this forces you to process the information. Mark direct quotations clearly with quotation marks and page numbers. Organize notes by subtopic rather than by source so related information is already grouped together when you write."},
      {"type": "heading", "level": 2, "text": "Paraphrasing vs. Quoting"},
      {"type": "text", "content": "Paraphrasing means restating an idea from a source entirely in your own words and sentence structure — not just swapping a few words. Paraphrase when the idea matters but the exact wording does not. Quoting means reproducing the exact words of a source inside quotation marks. Quote when the original wording is distinctive or would lose meaning if paraphrased. Both paraphrasing and quoting require citation. The most common student error is paraphrasing poorly by changing only a word or two, which is still plagiarism."},
      {"type": "callout", "style": "info", "title": "Indigenous Perspective", "content": "In many First Nations knowledge traditions, oral teachings carry the authority of the Elder who shared them. When students research topics involving Indigenous knowledge, they are encouraged to record not just what was said but who said it and in what context — because the source''s identity and relationship to the knowledge is part of the knowledge itself. This relational approach to citation parallels the academic practice of acknowledging authority."},
      {"type": "quiz", "question": "What information does an in-text MLA citation typically include?", "options": ["The full title and date", "The author''s last name and page number", "The URL of the website", "The publisher and year"], "correctIndex": 1, "explanation": "MLA in-text citations typically include the author''s last name and the page number in brackets after the borrowed information."},
      {"type": "quiz", "question": "What is the most common paraphrasing error students make?", "options": ["Writing too many words", "Only changing a word or two from the original, which is still plagiarism", "Using their own ideas too much", "Forgetting to include the page number"], "correctIndex": 1, "explanation": "Replacing only a few words from the original sentence is not a true paraphrase — it is still plagiarism. Genuine paraphrasing rewrites the idea completely in your own sentence structure."}
    ]'::jsonb,
    '[{"term": "MLA", "definition": "Modern Language Association — a standard format for academic citations in English"},
      {"term": "In-text citation", "definition": "A brief reference inside the body of a paper pointing to the full source in the works cited list"},
      {"term": "Paraphrase", "definition": "Restating a source''s idea completely in your own words and sentence structure"},
      {"term": "Direct quotation", "definition": "Reproducing the exact words of a source inside quotation marks"},
      {"term": "Works cited", "definition": "A list at the end of a paper of all sources referenced, formatted according to a citation style"}]'::jsonb,
    'In First Nations knowledge traditions, the source of information — the Elder, the ceremony, the land — is considered part of the knowledge itself. This relational approach to attribution mirrors academic citation practices and helps students understand that giving credit is not just a rule but an act of respect.',
    28, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CC7.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CR7.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does MLA stand for?', 'Modern Language Association — a standard format for academic citations in English.', 'The citation style used in ELA classes.', 3, 0),
    (v_tenant, v_ch, 'What is a paraphrase?', 'Restating a source''s idea completely in your own words and sentence structure.', 'Not a word swap — a complete rewrite of the idea.', 3, 1),
    (v_tenant, v_ch, 'When should you use a direct quotation?', 'When the original wording is distinctive, important, or would lose meaning if paraphrased.', 'The exact words matter.', 3, 2),
    (v_tenant, v_ch, 'What is a works cited list?', 'A list at the end of a paper of all sources referenced, formatted in a citation style.', 'Every source you used, listed at the end.', 3, 3);


  -- ========================================================================
  -- UNIT 5: Critical Comprehension
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 5, 'Critical Comprehension',
    'Identifying author''s purpose, making inferences, and evaluating the reliability of texts.',
    'Critical readers go beyond literal comprehension to question what they read and assess whether sources are trustworthy.',
    'How do I read between the lines and evaluate whether a text is reliable?')
  RETURNING id INTO v_unit;

  -- Chapter 5 — Critical Comprehension (CR7.2, CR7.3)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 5, 'Critical Comprehension', 'ela-7-critical-comprehension',
    'Identify author''s purpose, make and support inferences, and evaluate the reliability of texts.',
    '[
      {"type": "heading", "level": 1, "text": "Critical Comprehension"},
      {"type": "text", "content": "Reading comprehension is not a single skill — it is a layered process. Literal comprehension means understanding what the text says directly. Inferential comprehension means reading between the lines. Critical comprehension means evaluating the text: questioning its reliability, examining its purpose, and deciding how much trust it deserves. Grade 7 readers move confidently between all three levels."},
      {"type": "heading", "level": 2, "text": "Author''s Purpose and Implicit Message"},
      {"type": "text", "content": "Every text has an explicit purpose (stated) and an implicit message (suggested but not stated). A travel article explicitly informs readers about a destination. Implicitly, it may be encouraging tourism spending or promoting a particular lifestyle. A news article explicitly reports facts. Implicitly, its word choices and emphasis may frame events in a particular way. Skilled readers identify both and ask: What is this text doing beyond what it says it is doing?"},
      {"type": "callout", "style": "tip", "title": "Reading Strategy", "content": "After reading, write one sentence stating the explicit purpose and one sentence stating what you think the implicit message is. Comparing your interpretations with classmates reveals how much implicit meaning varies by reader."},
      {"type": "heading", "level": 2, "text": "Making Inferences"},
      {"type": "text", "content": "An inference is a conclusion you draw from evidence in the text plus your own knowledge. The text gives you clues; your background knowledge fills in the gaps. Strong inferences are grounded in specific textual evidence, connected to relevant prior knowledge, and expressed as a logical conclusion, not a guess. When making an inference, ask: What does the text actually say? What do I already know that connects to this? What is the most logical conclusion?"},
      {"type": "heading", "level": 2, "text": "Evaluating Text Reliability"},
      {"type": "text", "content": "Not all texts are equally reliable. To evaluate reliability, examine: the author''s credentials and expertise; the date of publication; the presence of citations and references; whether claims are stated as facts or opinions; whether the source has a financial, political, or personal interest in the topic; and whether the information can be confirmed by other credible sources. Reliability is not about agreeing with the text — a reliable text can still present a view you disagree with."},
      {"type": "callout", "style": "info", "title": "Indigenous Perspective", "content": "The concept of reliability takes on additional meaning when studying the historical record of settler-Indigenous relations in Saskatchewan. Government documents from the Treaty era were written from a position of power and interest. Evaluating these documents critically — asking who wrote them, for what purpose, and what perspectives are absent — is a practical application of critical comprehension and an important part of Treaty education."},
      {"type": "quiz", "question": "What is the difference between explicit and implicit meaning?", "options": ["Explicit is more interesting than implicit", "Explicit is directly stated; implicit is suggested but not stated", "Implicit means the author made a mistake", "Explicit meaning is only found in fiction"], "correctIndex": 1, "explanation": "Explicit meaning is stated directly in the text; implicit meaning is suggested through word choice, emphasis, and what is left unsaid."},
      {"type": "quiz", "question": "What makes an inference strong rather than weak?", "options": ["It is based entirely on personal opinion", "It is grounded in specific textual evidence combined with relevant prior knowledge", "It agrees with the author''s stated purpose", "It uses the longest words"], "correctIndex": 1, "explanation": "A strong inference combines specific textual evidence with relevant prior knowledge to reach a logical conclusion — it is not just a guess."}
    ]'::jsonb,
    '[{"term": "Literal comprehension", "definition": "Understanding what a text states directly and explicitly"},
      {"term": "Inferential comprehension", "definition": "Drawing conclusions from clues in the text and prior knowledge"},
      {"term": "Critical comprehension", "definition": "Evaluating a text''s purpose, reliability, and implicit messages"},
      {"term": "Inference", "definition": "A logical conclusion drawn from textual evidence and prior knowledge"},
      {"term": "Implicit message", "definition": "A meaning or message suggested by a text but not directly stated"},
      {"term": "Reliability", "definition": "The degree to which a source can be trusted based on evidence, expertise, and transparency"}]'::jsonb,
    'Critical comprehension of historical documents about Treaty negotiations and the Indian Act reveals how implicit messages and author purpose shaped Canada''s relationship with First Nations peoples. Reading these texts critically — examining who wrote them, for whom, and with what interest — is both a literacy skill and an act of Treaty education.',
    28, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CR7.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CR7.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is an inference?', 'A logical conclusion drawn from textual evidence combined with prior knowledge.', 'Evidence + what you already know = logical conclusion.', 3, 0),
    (v_tenant, v_ch, 'What is implicit meaning?', 'A meaning or message suggested by a text but not directly stated.', 'Reading between the lines.', 3, 1),
    (v_tenant, v_ch, 'Name two ways to evaluate text reliability.', 'Check the author''s credentials and whether claims can be confirmed by other credible sources.', 'Who wrote it? Can you verify it elsewhere?', 3, 2),
    (v_tenant, v_ch, 'What are the three levels of comprehension?', 'Literal, inferential, and critical comprehension.', 'What it says, what it suggests, and whether it can be trusted.', 3, 3);

END $$;


-- ============================================================================
-- GRADE 8 — WolfWhale English Language Arts 8
-- Outcomes: CR8.1-CR8.4, CC8.1-CC8.4, AR8.1-AR8.2
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
    WHERE tenant_id = v_tenant AND slug = 'wolfwhale-ela-8';

  -- ========================================================================
  -- UNIT 1: Literary Criticism and Interpretation
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Literary Criticism and Interpretation',
    'Examining point of view, authorial craft, and the criteria for evaluating literary merit.',
    'Sophisticated readers evaluate not just what a text says but how skillfully and ethically it says it.',
    'How do we judge the quality and craft of a literary text?')
  RETURNING id INTO v_unit;

  -- Chapter 1 — Literary Criticism and Interpretation (CR8.1, CR8.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 1, 'Literary Criticism and Interpretation', 'ela-8-literary-criticism',
    'Examine point of view, authorial craft choices, and criteria for evaluating the literary merit of texts.',
    '[
      {"type": "heading", "level": 1, "text": "Literary Criticism and Interpretation"},
      {"type": "text", "content": "Literary criticism is the discipline of analyzing, interpreting, and evaluating literature. It asks not only what a text means but how effectively the author constructed that meaning, and whether the text achieves its stated or implied purpose. In Grade 8, students move from describing what they notice to judging what it means and how well it works."},
      {"type": "heading", "level": 2, "text": "Point of View"},
      {"type": "text", "content": "Point of view refers to the perspective from which a story is told. First-person narration uses I and places the reader inside the narrator''s consciousness, creating intimacy but limiting what the reader can know. Second-person narration uses you, drawing the reader directly into the story — rare and deliberately disorienting. Third-person limited follows one character''s perspective using he, she, or they. Third-person omniscient knows all characters'' thoughts and can move freely between perspectives. Each choice shapes what information readers receive and how much they trust the narrator."},
      {"type": "callout", "style": "info", "title": "Critical Lens", "content": "An unreliable narrator tells a story in a way that readers come to distrust. Watch for contradictions between what the narrator claims and what other details in the text reveal."},
      {"type": "heading", "level": 2, "text": "Authorial Craft"},
      {"type": "text", "content": "Craft refers to the deliberate choices an author makes in constructing a text. Key craft elements include: diction (word choice — formal vs. colloquial, abstract vs. concrete); syntax (sentence structure — long complex sentences create different effects than short punchy ones); tone (the author''s attitude toward the subject — ironic, reverent, detached, passionate); imagery (patterns of sensory language that create mood and meaning); and structure (how the text is organized — linear, fragmented, circular). A craft analysis asks: what did the author choose, and what effect does that choice create?"},
      {"type": "heading", "level": 2, "text": "Evaluating Literary Merit"},
      {"type": "text", "content": "Literary merit refers to the qualities that make a text worthwhile, enduring, and significant. Criteria for evaluating merit include: originality of vision; complexity of character and theme; control of craft elements; emotional and intellectual resonance with readers; the text''s ability to illuminate aspects of human experience that might otherwise go unexamined; and its ethical stance — does it treat its subjects and readers with honesty and care? Literary merit is not the same as personal enjoyment — a text can be challenging and still be highly valuable."},
      {"type": "callout", "style": "info", "title": "Indigenous Perspective", "content": "Literary merit has historically been evaluated by critics applying Western European standards that excluded oral traditions, Indigenous narrative forms, and non-linear storytelling structures. Contemporary literary criticism increasingly recognizes that First Nations and Metis literary traditions have their own sophisticated criteria for excellence — including accuracy of cultural knowledge, relational ethics of storytelling, and fidelity to community. Expanding the criteria for merit expands whose stories are recognized as literature."},
      {"type": "quiz", "question": "What is an unreliable narrator?", "options": ["A narrator who forgets parts of the story", "A narrator whose account readers come to distrust due to contradictions or bias", "A narrator who speaks in second person", "A narrator who only appears once"], "correctIndex": 1, "explanation": "An unreliable narrator''s account contains contradictions or biases that signal to careful readers that the narrator''s version of events cannot be fully trusted."},
      {"type": "quiz", "question": "What does diction refer to in literary craft?", "options": ["The overall length of a text", "The author''s choice of words and their effect on tone and meaning", "The way dialogue is formatted", "The narrator''s point of view"], "correctIndex": 1, "explanation": "Diction is word choice — whether language is formal or colloquial, concrete or abstract, simple or elevated — and it shapes the tone and meaning of a text."}
    ]'::jsonb,
    '[{"term": "Literary criticism", "definition": "The discipline of analyzing, interpreting, and evaluating literature"},
      {"term": "Point of view", "definition": "The perspective from which a story is narrated"},
      {"term": "Unreliable narrator", "definition": "A narrator whose account readers come to distrust due to bias or contradiction"},
      {"term": "Diction", "definition": "The author''s choice of words and the effect of those choices on tone and meaning"},
      {"term": "Tone", "definition": "The author''s attitude toward the subject, conveyed through word choice and style"},
      {"term": "Literary merit", "definition": "The qualities that make a text significant, enduring, and worthwhile"}]'::jsonb,
    'The canon of texts considered to have literary merit has historically excluded Indigenous voices. Scholars and educators are actively expanding this canon to include First Nations and Metis literary traditions, recognizing that oral tradition, land-based narrative, and relational storytelling have their own sophisticated standards of excellence.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CR8.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CR8.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is point of view in literature?', 'The perspective from which a story is narrated — first, second, or third person.', 'Who is telling the story and what do they know?', 3, 0),
    (v_tenant, v_ch, 'What is an unreliable narrator?', 'A narrator whose account readers come to distrust due to bias or contradiction.', 'What they tell you and what the text shows you do not match.', 3, 1),
    (v_tenant, v_ch, 'What is diction?', 'The author''s choice of words and the effect of those choices on tone and meaning.', 'Every word choice is a craft decision.', 3, 2),
    (v_tenant, v_ch, 'What is literary merit?', 'The qualities that make a text significant, enduring, and worthwhile.', 'Why does this text matter?', 3, 3);


  -- ========================================================================
  -- UNIT 2: Argumentative Writing
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Argumentative Writing',
    'Building arguments with strong claims, varied evidence, counterarguments, and logical fallacy awareness.',
    'Effective argumentative writing anticipates and addresses opposition while maintaining logical integrity throughout.',
    'How do I build an argument that is logically sound, well-evidenced, and honest about complexity?')
  RETURNING id INTO v_unit;

  -- Chapter 2 — Argumentative Writing (CC8.4)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 2, 'Argumentative Writing', 'ela-8-argumentative-writing',
    'Write argumentative essays with strong claims, varied evidence, effective counterarguments, and awareness of logical fallacies.',
    '[
      {"type": "heading", "level": 1, "text": "Argumentative Writing"},
      {"type": "text", "content": "Argumentative writing is the art of making a reasoned case. Unlike persuasion, which may use emotional or rhetorical shortcuts, argument relies on logic, credible evidence, and honest engagement with complexity. A strong argumentative essay treats its readers as intelligent people capable of evaluating evidence — not just targets to be convinced."},
      {"type": "heading", "level": 2, "text": "Building a Strong Claim"},
      {"type": "text", "content": "A claim is the central argument your essay defends. In Grade 8, claims become more nuanced: they acknowledge complexity rather than oversimplifying. A nuanced claim might be: While compulsory standardized testing provides useful data for school boards, its negative effects on teacher creativity, student mental health, and curriculum breadth outweigh those benefits. Notice this claim acknowledges the opposing side before asserting a clear position. Nuanced claims are harder to write but more intellectually honest."},
      {"type": "callout", "style": "tip", "title": "Writing Tip", "content": "Test your claim by asking: Could a reasonable person disagree with this? If the answer is no, it is not a claim — it is a fact. Claims must be debatable."},
      {"type": "heading", "level": 2, "text": "Types of Evidence"},
      {"type": "text", "content": "Strong argumentative writing uses varied evidence. Statistical evidence uses numbers and data from credible studies. Anecdotal evidence uses specific stories or examples that illustrate a point. Expert testimony quotes or paraphrases specialists with relevant expertise. Historical evidence draws on documented past events. Analogical evidence compares the current issue to a similar situation where the outcome is known. Using multiple types of evidence makes your argument more convincing than relying on one kind alone."},
      {"type": "heading", "level": 2, "text": "Logical Fallacies"},
      {"type": "text", "content": "Logical fallacies are errors in reasoning that weaken an argument. Ad hominem attacks the person rather than the argument. Straw man misrepresents the opposing view to make it easier to knock down. False dichotomy presents only two options when more exist. Slippery slope assumes that one step will inevitably lead to extreme consequences without evidence. Appeal to authority uses a famous person''s opinion as proof regardless of their expertise. Recognizing fallacies in your own writing — and in the writing of others — is essential for responsible argumentation."},
      {"type": "callout", "style": "info", "title": "Indigenous Perspective", "content": "Argumentation in the context of Treaty rights and land claims requires students to recognize how logical fallacies have been used historically to dismiss Indigenous legal arguments. Straw man misrepresentations of Indigenous land rights, false dichotomies presented in resource development debates, and appeals to economic authority over Indigenous ecological knowledge are documented patterns. Studying argumentative writing sharpens students'' ability to identify these distortions in public discourse."},
      {"type": "quiz", "question": "What is a logical fallacy?", "options": ["A very strong argument", "An error in reasoning that weakens an argument", "A type of evidence used in debate", "A transition word in essay writing"], "correctIndex": 1, "explanation": "A logical fallacy is an error in reasoning — a flaw in the logic of an argument that makes it invalid, regardless of whether the conclusion seems appealing."},
      {"type": "quiz", "question": "What is the ad hominem fallacy?", "options": ["Assuming one bad thing leads to many worse things", "Attacking the person making an argument rather than the argument itself", "Presenting only two options when more exist", "Using a celebrity''s opinion as proof"], "correctIndex": 1, "explanation": "Ad hominem means attacking the person — their character, background, or motives — rather than addressing the actual argument they are making."}
    ]'::jsonb,
    '[{"term": "Claim", "definition": "The central argument an essay defends, stated as a debatable and nuanced position"},
      {"term": "Logical fallacy", "definition": "An error in reasoning that weakens the validity of an argument"},
      {"term": "Ad hominem", "definition": "A fallacy that attacks the person making an argument rather than the argument itself"},
      {"term": "Straw man", "definition": "A fallacy that misrepresents an opposing view to make it easier to criticize"},
      {"term": "False dichotomy", "definition": "A fallacy that presents only two options when more exist"},
      {"term": "Counterargument", "definition": "An acknowledgment of the opposing position followed by a reasoned response"}]'::jsonb,
    'Treaty negotiations and land rights disputes illustrate how argumentative reasoning can be manipulated through logical fallacies. Students who understand straw man arguments, false dichotomies, and appeals to authority are better equipped to analyze public debates about Indigenous rights and resource development in Saskatchewan.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CC8.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a logical fallacy?', 'An error in reasoning that weakens the validity of an argument.', 'A flaw in the logic, not just the evidence.', 3, 0),
    (v_tenant, v_ch, 'What is ad hominem?', 'Attacking the person making an argument rather than the argument itself.', 'Personal attack instead of logical response.', 3, 1),
    (v_tenant, v_ch, 'What is a false dichotomy?', 'Presenting only two options when more exist.', 'It''s not either/or — there are other choices.', 3, 2),
    (v_tenant, v_ch, 'What is a straw man fallacy?', 'Misrepresenting an opposing view to make it easier to criticize.', 'Knocking down a version of the argument no one actually made.', 3, 3);


  -- ========================================================================
  -- UNIT 3: Public Speaking and Debate
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Public Speaking and Debate',
    'Crafting persuasive speeches and participating in parliamentary debate format.',
    'Skilled speakers adapt their message to context and audience, using rhetorical strategies to persuade while maintaining ethical responsibility.',
    'How do I craft and deliver a persuasive speech that is both effective and ethically responsible?')
  RETURNING id INTO v_unit;

  -- Chapter 3 — Public Speaking and Debate (CC8.1, CC8.3)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 3, 'Public Speaking and Debate', 'ela-8-public-speaking-debate',
    'Craft and deliver persuasive speeches and participate effectively in parliamentary debate format.',
    '[
      {"type": "heading", "level": 1, "text": "Public Speaking and Debate"},
      {"type": "text", "content": "Public speaking is one of the most influential skills in civic life. From school council to community meetings to national stages, the ability to present ideas clearly and persuasively shapes decisions that affect entire communities. Grade 8 students develop this skill through persuasive speeches and parliamentary debate, learning how to construct and deliver arguments under pressure."},
      {"type": "heading", "level": 2, "text": "Persuasive Speeches"},
      {"type": "text", "content": "A persuasive speech uses rhetorical strategies to move an audience toward a position. Ethos builds credibility — the speaker demonstrates expertise and trustworthiness. Pathos engages emotion — stories, vivid language, and relatable examples help the audience feel the importance of the issue. Logos uses logic and evidence — statistics, expert testimony, and reasoned argument. The most powerful speeches weave all three together. Know your audience: the strategies that persuade a group of students differ from those that persuade a panel of judges."},
      {"type": "callout", "style": "tip", "title": "Speech Tip", "content": "Open with a story or striking fact that makes the audience care about your topic before you ask them to agree with your position. Persuasion begins with connection."},
      {"type": "heading", "level": 2, "text": "Parliamentary Debate Format"},
      {"type": "text", "content": "Parliamentary debate is a structured format with two sides: the government (who supports the motion) and the opposition (who opposes it). Each speaker has a set time to speak. Key roles include: Prime Minister or first speaker (opens the government case), Opposition Leader (responds and opens the opposition case), and Member and Opposition Member speakers (add supporting arguments). Points of order allow speakers to challenge procedure. Points of information allow brief interjections during speeches. The format teaches speakers to argue under time pressure, respond to challenges in real time, and maintain composure."},
      {"type": "heading", "level": 2, "text": "Delivery Under Pressure"},
      {"type": "text", "content": "Debate and speeches require composure under pressure. Techniques include: controlled breathing before and during speaking; maintaining deliberate eye contact rather than reading notes; using strategic pause to collect your thoughts; acknowledging a strong opposing point honestly before countering it (this builds credibility); and avoiding filler words by slowing down rather than speeding up when you feel uncertain."},
      {"type": "callout", "style": "info", "title": "Indigenous Perspective", "content": "Many First Nations governance traditions practice forms of formal deliberation where community members speak in turn, with careful attention to protocol, respect, and the weight of words. Treaty negotiations themselves were a form of high-stakes public discourse. Studying rhetorical strategies helps students understand how persuasion has been used to shape policy affecting Indigenous communities — and how communities can reclaim these tools."},
      {"type": "quiz", "question": "What are the three rhetorical strategies used in persuasive speaking?", "options": ["Claim, evidence, conclusion", "Ethos, pathos, logos", "Introduction, body, conclusion", "Hook, argument, rebuttal"], "correctIndex": 1, "explanation": "Ethos (credibility), pathos (emotion), and logos (logic and evidence) are the three classical rhetorical strategies for persuasive communication."},
      {"type": "quiz", "question": "In parliamentary debate, what is the role of the government side?", "options": ["To oppose the motion and disprove it", "To support the motion and build a case in its favour", "To ask questions of the opposition only", "To judge the quality of speeches"], "correctIndex": 1, "explanation": "The government side supports the motion — they open the debate by presenting arguments in favour of the proposition."}
    ]'::jsonb,
    '[{"term": "Ethos", "definition": "A rhetorical strategy that builds the speaker''s credibility and trustworthiness"},
      {"term": "Pathos", "definition": "A rhetorical strategy that appeals to the audience''s emotions"},
      {"term": "Logos", "definition": "A rhetorical strategy that uses logic and evidence to persuade"},
      {"term": "Parliamentary debate", "definition": "A structured debate format with government and opposition sides, timed speeches, and procedural rules"},
      {"term": "Point of information", "definition": "A brief interjection allowed during a parliamentary debate speech"}]'::jsonb,
    'First Nations governance traditions across Saskatchewan have always included formal deliberative processes — speaking protocols, consensus-building, and community decision-making — that parallel parliamentary debate in their structure and seriousness. Studying formal debate connects students to these traditions of civic oratory.',
    28, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CC8.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CC8.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is ethos?', 'A rhetorical strategy that builds the speaker''s credibility and trustworthiness.', 'Why should the audience trust you?', 3, 0),
    (v_tenant, v_ch, 'What is pathos?', 'A rhetorical strategy that appeals to the audience''s emotions.', 'Making the audience feel something.', 3, 1),
    (v_tenant, v_ch, 'What is logos?', 'A rhetorical strategy that uses logic and evidence to persuade.', 'The reasoning and proof behind your argument.', 3, 2),
    (v_tenant, v_ch, 'What are the two sides in parliamentary debate?', 'The government (supporting the motion) and the opposition (opposing it).', 'For and against.', 3, 3);


  -- ========================================================================
  -- UNIT 4: Media Analysis and Production
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Media Analysis and Production',
    'Analyzing film and podcast techniques critically and creating original multimedia content.',
    'Understanding how media producers make meaning through technical and narrative choices empowers students to both analyze and create media responsibly.',
    'How do media producers use technical and narrative choices to shape meaning and audience response?')
  RETURNING id INTO v_unit;

  -- Chapter 4 — Media Analysis and Production (CR8.3, CC8.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 4, 'Media Analysis and Production', 'ela-8-media-analysis-production',
    'Analyze film and podcast techniques for their effect on meaning and audience, and create original multimedia content.',
    '[
      {"type": "heading", "level": 1, "text": "Media Analysis and Production"},
      {"type": "text", "content": "Film and audio media use a sophisticated toolkit of technical and narrative choices to shape how audiences experience stories and information. Analyzing these choices develops critical media literacy. Creating media — whether a podcast, short film, or documentary segment — requires applying the same skills in reverse: making deliberate choices to achieve intended effects."},
      {"type": "heading", "level": 2, "text": "Film Analysis"},
      {"type": "text", "content": "Film communicates through multiple simultaneous channels. Camera angle shapes power dynamics: a low angle looking up makes a character appear powerful; a high angle looking down makes them appear small or vulnerable. Editing pace creates mood: rapid cuts create tension and excitement, slow cuts create contemplation or unease. Sound design includes music (score), ambient sound (background noise that creates atmosphere), and silence (which draws attention to what is missing). Dialogue in film is often indirect — what characters do not say is as significant as what they say."},
      {"type": "callout", "style": "tip", "title": "Film Analysis Tip", "content": "Watch a short scene twice: once for content (what happens) and once for craft (how the director chose to show it). The second viewing reveals the deliberate choices behind the experience."},
      {"type": "heading", "level": 2, "text": "Podcast Analysis"},
      {"type": "text", "content": "Podcasts use audio-only storytelling to inform, persuade, or entertain. Key elements to analyze: host voice and tone (formal vs. conversational, authoritative vs. exploratory); use of interview and guest perspectives; music and sound effects (how they frame segments and create emotional tone); editing and pacing (how much silence is comfortable, how topics transition); and structure (is it linear, narrative-driven, panel discussion, or documentary?). A podcast''s credibility rests heavily on the quality of its sources and the transparency of its perspective."},
      {"type": "heading", "level": 2, "text": "Creating Multimedia"},
      {"type": "text", "content": "When creating multimedia, begin with a clear purpose and audience. Plan with a storyboard (for video) or a script with audio notes (for podcasts). Consider: What story are you telling? Whose voices and perspectives are included — and whose are absent? How does your editing pace, music, and framing guide the audience''s emotional response? Responsible media production acknowledges the power of these choices and uses them ethically."},
      {"type": "callout", "style": "info", "title": "Indigenous Perspective", "content": "Indigenous media production in Saskatchewan — including community radio, documentary film, and social media storytelling — has been a crucial tool for self-representation. When students analyze who controls media narratives and whose stories get told, they engage with questions of cultural power that are directly relevant to Indigenous communities'' ongoing efforts to share their own perspectives on their own terms."},
      {"type": "quiz", "question": "What effect does a low camera angle typically create?", "options": ["It makes the subject appear small and weak", "It makes the subject appear powerful and imposing", "It creates a sense of confusion", "It removes emotional impact"], "correctIndex": 1, "explanation": "A low angle shot looks up at the subject, making them appear larger, more powerful, and more imposing to the viewer."},
      {"type": "quiz", "question": "In podcast analysis, what does editing pace affect?", "options": ["The length of the episode only", "The mood and how comfortable the listener feels with silence and transitions", "The credibility of sources used", "The sound quality of the recording"], "correctIndex": 1, "explanation": "Editing pace — how long pauses last, how abruptly topics transition — shapes the mood and the listener''s sense of comfort, urgency, or contemplation."}
    ]'::jsonb,
    '[{"term": "Camera angle", "definition": "The position of the camera relative to the subject, which shapes the audience''s perception of power and emotion"},
      {"term": "Sound design", "definition": "The deliberate use of music, ambient sound, and silence to create emotional atmosphere"},
      {"term": "Storyboard", "definition": "A visual plan for a film or multimedia project, showing each shot and its content"},
      {"term": "Editing pace", "definition": "The rhythm of cuts in film or transitions in audio, which shapes mood and tension"},
      {"term": "Documentary", "definition": "A non-fiction film or audio piece that presents real events, people, or issues with a particular perspective"}]'::jsonb,
    'Indigenous documentary filmmakers and community radio producers across Saskatchewan use media as a tool of cultural preservation and self-determination. Analyzing how these producers make deliberate craft choices to represent their communities — compared to how mainstream media has historically represented Indigenous peoples — is a powerful media literacy exercise.',
    28, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CR8.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CC8.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does a low camera angle convey?', 'It makes the subject appear powerful and imposing.', 'Looking up at someone makes them seem bigger.', 3, 0),
    (v_tenant, v_ch, 'What is sound design?', 'The deliberate use of music, ambient sound, and silence to create emotional atmosphere.', 'Every sound in a film is a choice.', 3, 1),
    (v_tenant, v_ch, 'What is a storyboard?', 'A visual plan for a film showing each shot and its content.', 'The blueprint before you film.', 3, 2),
    (v_tenant, v_ch, 'What does editing pace affect in film?', 'Mood and tension — rapid cuts create excitement, slow cuts create contemplation.', 'How fast or slow the film feels.', 3, 3);


  -- ========================================================================
  -- UNIT 5: Group Inquiry Projects
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 5, 'Group Inquiry Projects',
    'Conducting collaborative research, synthesizing findings, and presenting group conclusions.',
    'Collaborative inquiry requires clear roles, shared accountability, and the ability to synthesize diverse perspectives into a coherent group product.',
    'How do I contribute effectively to a collaborative inquiry and present our collective findings?')
  RETURNING id INTO v_unit;

  -- Chapter 5 — Group Inquiry Projects (CR8.4, CC8.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 5, 'Group Inquiry Projects', 'ela-8-group-inquiry',
    'Plan and execute collaborative research projects, synthesize group findings, and deliver coordinated presentations.',
    '[
      {"type": "heading", "level": 1, "text": "Group Inquiry Projects"},
      {"type": "text", "content": "Group inquiry combines the strengths of individual research with the power of collaborative thinking. When a group investigates a complex question together, each member brings different knowledge, perspectives, and skills. The challenge is coordinating this diversity into a coherent shared understanding — and presenting it in a way that is greater than the sum of its parts."},
      {"type": "heading", "level": 2, "text": "Roles and Responsibilities"},
      {"type": "text", "content": "Effective group inquiry begins with clear roles. A project manager coordinates timelines and ensures all parts come together. Researchers investigate specific subtopics or source types. A synthesizer integrates findings across the group''s separate investigations. A presenter or presentation coordinator ensures the final product is coherent and well-delivered. Roles can rotate, but accountability must be clear. Each member must be able to speak knowledgeably about the whole project, not just their own section."},
      {"type": "callout", "style": "tip", "title": "Collaboration Tip", "content": "Meet briefly as a group after each research session to share what you found. This prevents the group from working in silos — and often reveals connections between subtopics that no individual researcher would have noticed alone."},
      {"type": "heading", "level": 2, "text": "Synthesis in Group Inquiry"},
      {"type": "text", "content": "Group synthesis is more demanding than individual synthesis. You must integrate your own research findings with your teammates'' findings, identify points of agreement and contradiction, resolve inconsistencies by returning to primary sources, and build a coherent argument that represents the group''s collective understanding — not just a collection of individual summaries. Use a shared organizer or document to track and compare findings before writing the final product."},
      {"type": "heading", "level": 2, "text": "Delivering Group Presentations"},
      {"type": "text", "content": "A strong group presentation feels coordinated, not patchwork. Transitions between speakers should be smooth and purposeful. Each speaker should be introduced with context so the audience knows what is coming. Visual aids should be consistent in style. All group members should be prepared to answer questions — not just about their own section but about the whole inquiry. The Q&A period is often where the real depth of understanding is revealed."},
      {"type": "callout", "style": "info", "title": "Indigenous Perspective", "content": "Collaborative inquiry resonates with Indigenous traditions of collective knowledge-building, where no single person holds all knowledge and wisdom emerges from the community''s shared engagement. In many Saskatchewan First Nations communities, decisions and understandings are developed collectively through deliberation, with each voice contributing to the whole. Group inquiry in the classroom models this relational approach to knowledge."},
      {"type": "quiz", "question": "What is the role of a synthesizer in a group inquiry project?", "options": ["To manage the group''s timeline", "To integrate findings from across the group''s separate research into a coherent whole", "To present the final product to the audience", "To find all the sources independently"], "correctIndex": 1, "explanation": "The synthesizer brings together the group''s separate research findings, identifies connections and contradictions, and builds a coherent shared understanding."},
      {"type": "quiz", "question": "Why should all group members be able to speak to the whole inquiry during Q&A?", "options": ["Because the teacher may call on anyone", "Because depth of understanding across the whole project demonstrates genuine collaborative learning", "Because it saves time in the presentation", "Because individual sections are not important"], "correctIndex": 1, "explanation": "Genuine collaborative inquiry means all members understand the whole, not just their part. The Q&A period reveals whether the group truly synthesized their findings or simply divided the work."}
    ]'::jsonb,
    '[{"term": "Group inquiry", "definition": "A collaborative research process in which team members investigate a shared question and synthesize findings"},
      {"term": "Synthesis", "definition": "Combining multiple sources or perspectives into a coherent, original understanding"},
      {"term": "Project manager", "definition": "A group role responsible for coordinating timelines and ensuring all parts of the project come together"},
      {"term": "Accountability", "definition": "Taking responsibility for one''s role and contribution to the group''s shared goal"},
      {"term": "Coordinated presentation", "definition": "A group presentation that flows cohesively rather than feeling like separate individual sections"}]'::jsonb,
    'Collective knowledge-building is a foundational practice in many Saskatchewan First Nations communities, where wisdom is understood as emerging from shared deliberation rather than individual expertise. Group inquiry projects model this relational approach to knowledge, connecting classroom practice to Indigenous traditions of collaborative understanding.',
    28, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CR8.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is group inquiry?', 'A collaborative research process in which team members investigate a shared question and synthesize findings.', 'Research done together, not just divided up.', 3, 0),
    (v_tenant, v_ch, 'What does a project manager do in a group?', 'Coordinates timelines and ensures all parts of the project come together cohesively.', 'Keeps the team on track.', 3, 1),
    (v_tenant, v_ch, 'Why is synthesis harder in group inquiry than individual research?', 'You must integrate your own findings with teammates'' findings, resolve contradictions, and build a coherent group argument.', 'More people, more perspectives, more to reconcile.', 3, 2),
    (v_tenant, v_ch, 'What makes a group presentation feel coordinated rather than patchwork?', 'Smooth transitions between speakers, consistent visuals, and all members understanding the whole project.', 'It feels like one voice, not many separate pieces.', 3, 3);

END $$;


-- ============================================================================
-- GRADE 9 — WolfWhale English Language Arts 9
-- Outcomes: CR9.1-CR9.4, CC9.1-CC9.4, AR9.1-AR9.2
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
    WHERE tenant_id = v_tenant AND slug = 'wolfwhale-ela-9';

  -- ========================================================================
  -- UNIT 1: Literary Movements and Contexts
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Literary Movements and Contexts',
    'Situating literature within historical and cultural contexts, exploring Canadian literature and Indigenous voices.',
    'Literature is always shaped by its historical moment, and reading with contextual awareness reveals dimensions of meaning invisible to the surface reader.',
    'How does historical and cultural context shape what authors write and what texts mean?')
  RETURNING id INTO v_unit;

  -- Chapter 1 — Literary Movements and Contexts (CR9.1, CR9.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 1, 'Literary Movements and Contexts', 'ela-9-literary-movements',
    'Situate literary texts within their historical and cultural contexts, with attention to Canadian literature and Indigenous voices.',
    '[
      {"type": "heading", "level": 1, "text": "Literary Movements and Contexts"},
      {"type": "text", "content": "Literature does not exist outside of history. Every text is produced by a specific person, in a specific place and time, in response to specific social, political, and cultural conditions. Reading with historical and cultural awareness transforms your relationship to texts — you begin to see not just what an author said, but why those particular words, in that particular form, at that particular moment."},
      {"type": "heading", "level": 2, "text": "Literary Movements"},
      {"type": "text", "content": "A literary movement is a group of authors, roughly contemporaneous, who share aesthetic values, thematic preoccupations, or philosophical commitments. Romanticism in the early nineteenth century celebrated individual emotion, imagination, and the natural world as a counterpoint to industrialization. Realism later in the century turned toward everyday life, class, and social conditions. Modernism in the early twentieth century experimented with form, fragmented narrative, and the inner life of consciousness. Postmodernism questioned fixed meanings, blurred fiction and reality, and embraced irony. Knowing a text''s literary moment gives you a context for understanding its formal and thematic choices."},
      {"type": "callout", "style": "info", "title": "Canadian Literature", "content": "Canadian literature has its own distinct tradition shaped by geography, colonial history, bilingualism, and multiculturalism. Prairie literature — writing rooted in Saskatchewan and the surrounding region — often engages with isolation, landscape, settler identity, and the relationship between people and the land. Authors like Sinclair Ross, W.O. Mitchell, and Sharon Butala have explored prairie themes across generations."},
      {"type": "heading", "level": 2, "text": "Reading Contextually"},
      {"type": "text", "content": "Contextual reading means asking: What was happening historically when this was written? What were the dominant social values of the time? What groups were marginalized or silenced? How does the author''s identity and position shape their perspective? What was considered publishable or acceptable at the time, and who was excluded from those standards? Contextual reading does not reduce a text to its historical moment — it enriches your interpretation by revealing the forces the author was working within and against."},
      {"type": "heading", "level": 2, "text": "Indigenous Voices in Canadian Literature"},
      {"type": "text", "content": "For much of Canadian literary history, Indigenous peoples were written about rather than writing. The last several decades have seen a profound flourishing of First Nations, Metis, and Inuit literary voices — novelists, poets, playwrights, and essayists telling their own stories in their own forms. This literature is not merely an addition to the Canadian canon — it challenges and transforms the canon by centering perspectives that reveal the violence, resilience, and complexity of Indigenous experience in Canada."},
      {"type": "callout", "style": "info", "title": "Indigenous Perspective", "content": "Indigenous literature in Saskatchewan includes work by authors, poets, and playwrights who draw on Cree, Nakoda, Lakota, Saulteaux, and Metis traditions alongside contemporary literary forms. This body of work addresses residential school trauma, land and water rights, urban Indigenous experience, cultural resurgence, and the ongoing impact of colonization. Reading this literature is not only a literary experience — it is an act of Treaty education and solidarity."},
      {"type": "quiz", "question": "What is a literary movement?", "options": ["A book series published by the same author", "A group of roughly contemporaneous authors sharing aesthetic values or thematic preoccupations", "A government program to promote reading", "A list of recommended books for schools"], "correctIndex": 1, "explanation": "A literary movement is a grouping of authors who share values, themes, or philosophical commitments, shaped by their shared historical and cultural moment."},
      {"type": "quiz", "question": "What does contextual reading add to literary interpretation?", "options": ["It replaces close reading of the text itself", "It reveals the historical forces the author was working within and against, enriching interpretation", "It makes reading more difficult without adding value", "It only applies to historical fiction"], "correctIndex": 1, "explanation": "Contextual reading enriches interpretation by situating the text in its historical moment — revealing what the author was responding to and what was possible or forbidden at the time."}
    ]'::jsonb,
    '[{"term": "Literary movement", "definition": "A grouping of roughly contemporaneous authors sharing aesthetic values, thematic concerns, or philosophical commitments"},
      {"term": "Romanticism", "definition": "A literary movement emphasizing individual emotion, imagination, and the natural world"},
      {"term": "Realism", "definition": "A literary movement focused on accurate depiction of everyday life and social conditions"},
      {"term": "Modernism", "definition": "A literary movement characterized by formal experimentation, fragmented narrative, and the exploration of inner consciousness"},
      {"term": "Contextual reading", "definition": "Interpreting a text in light of the historical, cultural, and social conditions of its creation"},
      {"term": "Canon", "definition": "The body of texts considered authoritative, significant, or essential in a literary tradition"}]'::jsonb,
    'The flourishing of First Nations and Metis literary voices in recent decades represents a profound shift in Canadian literature. Saskatchewan Indigenous authors write from within living traditions — not as historical subjects but as contemporary literary artists reshaping the canon from within. Their work demands that readers understand Treaty relationships, residential school history, and ongoing land relationships as essential context for interpretation.',
    32, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CR9.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CR9.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a literary movement?', 'A grouping of roughly contemporaneous authors sharing aesthetic values, thematic concerns, or philosophical commitments.', 'Authors of the same era who share ideas about writing.', 4, 0),
    (v_tenant, v_ch, 'What is contextual reading?', 'Interpreting a text in light of the historical, cultural, and social conditions of its creation.', 'What was happening in the world when this was written?', 4, 1),
    (v_tenant, v_ch, 'What is the canon?', 'The body of texts considered authoritative, significant, or essential in a literary tradition.', 'The officially valued texts of a culture.', 4, 2),
    (v_tenant, v_ch, 'What is Modernism?', 'A literary movement characterized by formal experimentation, fragmented narrative, and the exploration of inner consciousness.', 'Early twentieth century — breaking the old rules.', 4, 3);


  -- ========================================================================
  -- UNIT 2: Research Papers and Academic Writing
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Research Papers and Academic Writing',
    'Developing a research thesis, integrating sources skillfully, and writing in an academic voice.',
    'Academic writing is a disciplined practice of making original arguments that are grounded in evidence and transparent about their sources.',
    'How do I write an original, well-sourced academic argument in my own voice?')
  RETURNING id INTO v_unit;

  -- Chapter 2 — Research Papers and Academic Writing (CC9.4, CR9.4)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 2, 'Research Papers and Academic Writing', 'ela-9-research-academic-writing',
    'Develop a research thesis, integrate sources through quotation and paraphrase, and write in a clear academic voice.',
    '[
      {"type": "heading", "level": 1, "text": "Research Papers and Academic Writing"},
      {"type": "text", "content": "A research paper is not a summary of what others have said. It is an original argument, made by you, supported by evidence gathered from research. The research informs and substantiates your argument — it does not replace it. In Grade 9, students develop the discipline of academic writing: precise language, transparent sourcing, logical structure, and a distinctive scholarly voice."},
      {"type": "heading", "level": 2, "text": "Thesis Development"},
      {"type": "text", "content": "A research thesis at the Grade 9 level is specific, arguable, and significant. Specific: it narrows to a precise claim rather than covering everything. Arguable: a reasonable person with access to the same evidence could disagree. Significant: the claim matters — it has implications beyond the obvious. A thesis develops through research, not before it. Begin with a working thesis — a provisional claim — and refine it as your research reveals complexity and nuance. The final thesis often differs substantially from the first draft."},
      {"type": "callout", "style": "tip", "title": "Thesis Tip", "content": "If you can write your thesis before doing any research, it is probably too simple. A strong research thesis emerges from genuine inquiry into a question you do not already know the answer to."},
      {"type": "heading", "level": 2, "text": "Source Integration"},
      {"type": "text", "content": "Sources support your argument — they do not make it for you. Avoid the common error of stringing quotations together with minimal commentary. Instead, introduce each source, quote or paraphrase it, and then explain what it proves in relation to your thesis. This introduce-evidence-explain structure ensures that your voice drives the paper, not the sources''. Signal phrases — according to, as Smith argues, the study demonstrates — help integrate sources smoothly while attributing ideas clearly."},
      {"type": "heading", "level": 2, "text": "Academic Voice"},
      {"type": "text", "content": "Academic voice is not pompous or unnecessarily complex — it is precise and formal without being cold. Characteristics of academic voice: clear and specific word choices over vague or colloquial language; avoidance of first person in most formal academic writing; hedging language when making claims not fully proven (research suggests, evidence indicates, it appears that); passive voice used deliberately to foreground findings rather than the researcher; and consistent formal register maintained throughout."},
      {"type": "callout", "style": "info", "title": "Indigenous Perspective", "content": "Academic writing conventions emerged from specific Western European intellectual traditions and have historically excluded or marginalized Indigenous ways of knowing. Some post-secondary institutions now accept research papers that incorporate Indigenous research methodologies, oral knowledge with proper attribution, and relational frameworks alongside conventional academic sourcing. Understanding both the conventions of academic writing and their cultural limitations is important literacy for Grade 9 students entering senior high school and beyond."},
      {"type": "quiz", "question": "What is the role of sources in a research paper?", "options": ["To replace the student''s own argument", "To support and substantiate the student''s original argument", "To fill space when the student has little to say", "To provide a summary of the topic"], "correctIndex": 1, "explanation": "Sources in a research paper support and substantiate your argument — they do not make the argument for you. Your thesis and your analysis drive the paper."},
      {"type": "quiz", "question": "What is a working thesis?", "options": ["A thesis that is perfect and will not change", "A provisional claim developed early in the research process that is refined as research continues", "A thesis written after all research is complete", "A short version of the thesis for the introduction only"], "correctIndex": 1, "explanation": "A working thesis is a provisional starting point — a claim you begin with that evolves as your research reveals greater complexity and nuance."}
    ]'::jsonb,
    '[{"term": "Research thesis", "definition": "A specific, arguable, and significant claim that a research paper will prove"},
      {"term": "Working thesis", "definition": "A provisional claim developed early in the research process, refined as research continues"},
      {"term": "Source integration", "definition": "The practice of incorporating research sources into writing through introduction, quotation or paraphrase, and explanation"},
      {"term": "Academic voice", "definition": "A formal, precise writing register characterized by specific word choice, appropriate hedging, and consistent formality"},
      {"term": "Signal phrase", "definition": "An introductory phrase that attributes a source before quoting or paraphrasing it"},
      {"term": "Hedging language", "definition": "Language that qualifies a claim to accurately reflect the limits of available evidence"}]'::jsonb,
    'Academic writing conventions have historically excluded Indigenous knowledge systems, oral traditions, and relational epistemologies. Understanding these conventions — and their cultural assumptions — prepares Grade 9 students not only to write academic papers but to think critically about whose knowledge systems are privileged in formal education and why.',
    32, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CC9.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CR9.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a working thesis?', 'A provisional claim developed early in the research process, refined as research continues.', 'Start here — but expect it to change.', 4, 0),
    (v_tenant, v_ch, 'What is source integration?', 'Incorporating research sources through introduction, quotation or paraphrase, and explanation.', 'Introduce it, use it, explain what it proves.', 4, 1),
    (v_tenant, v_ch, 'What is hedging language?', 'Language that qualifies a claim to accurately reflect the limits of available evidence.', 'Research suggests... Evidence indicates...', 4, 2),
    (v_tenant, v_ch, 'What is academic voice?', 'A formal, precise writing register with specific word choice, hedging, and consistent formality.', 'Precise but not pompous.', 4, 3);


  -- ========================================================================
  -- UNIT 3: Formal Presentations and Multimedia
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Formal Presentations and Multimedia',
    'Writing speeches, designing visual aids, and engaging audiences in formal presentation contexts.',
    'Formal presentations in Grade 9 demand the integration of content expertise, rhetorical skill, and deliberate design.',
    'How do I design and deliver a formal presentation that commands attention and communicates complex ideas clearly?')
  RETURNING id INTO v_unit;

  -- Chapter 3 — Formal Presentations and Multimedia (CC9.1, CC9.3)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 3, 'Formal Presentations and Multimedia', 'ela-9-formal-presentations',
    'Write formal speeches, design effective visual aids, and engage audiences in complex formal presentations.',
    '[
      {"type": "heading", "level": 1, "text": "Formal Presentations and Multimedia"},
      {"type": "text", "content": "A Grade 9 formal presentation is not just a report delivered out loud. It is a carefully designed communication event that integrates content expertise with rhetorical skill, visual design, and audience engagement. Every element — the words you say, the visuals you show, the pace you maintain, the questions you anticipate — is a deliberate choice in service of your purpose."},
      {"type": "heading", "level": 2, "text": "Writing a Formal Speech"},
      {"type": "text", "content": "A formal speech is written to be spoken, not read silently. This distinction changes every aspect of its construction. Spoken sentences are typically shorter than written ones. Repetition and parallel structure — which feel redundant in writing — create rhythm and memorability in speech. Signpost language (Today I will argue..., My first point is..., In conclusion...) helps listeners track the structure of a complex argument. Write the full speech first, then reduce it to key-word notes for delivery — this ensures you have thought through every transition and supporting point."},
      {"type": "callout", "style": "tip", "title": "Speech Writing Tip", "content": "Read your speech aloud during drafting. Sentences that feel natural in writing often feel unnatural spoken aloud. Rewrite any sentence you stumble over."},
      {"type": "heading", "level": 2, "text": "Designing Visual Aids"},
      {"type": "text", "content": "Visual aids in a formal presentation must earn their place. Each slide or visual element should add information or emphasis that spoken words alone cannot achieve. Principles for effective visual design: one idea per slide prevents cognitive overload; data visualizations (charts, graphs, infographics) must be accurately labeled and not misleading; images should be high-resolution and relevant, not decorative; text on slides should be minimal — if the audience is reading your slides, they are not listening to you; and the visual design (colour, font, spacing) should be consistent and professional throughout."},
      {"type": "heading", "level": 2, "text": "Audience Engagement"},
      {"type": "text", "content": "Engaging an audience in a formal presentation requires active management of attention. Strategies include: posing a provocative question at the opening to create intellectual investment; using specific, concrete examples that make abstract ideas tangible; varying vocal pace and volume deliberately rather than maintaining a monotone; building in moments of pause after key points so the audience can absorb what they have heard; and anticipating and addressing the most likely objections or questions within the speech itself."},
      {"type": "callout", "style": "info", "title": "Indigenous Perspective", "content": "Formal oratory has been central to First Nations governance and diplomacy throughout Saskatchewan''s history. The speeches delivered by Indigenous leaders at Treaty negotiations — preserved in written records and oral tradition — demonstrate sophisticated rhetorical craft: structured arguments, emotional appeal, respect for the audience, and the deliberate use of metaphor and imagery. Studying formal speech alongside this tradition reveals that the principles of effective oratory cross cultural boundaries."},
      {"type": "quiz", "question": "How does writing a speech differ from writing an essay?", "options": ["Speeches are shorter and require no evidence", "Speeches use shorter sentences, more repetition, and signpost language because they are designed to be heard, not read", "Speeches do not need a clear structure", "Speeches should be read directly from a script"], "correctIndex": 1, "explanation": "Speeches are designed for the ear, not the eye. Shorter sentences, parallel structure, repetition, and signpost language help listeners track complex arguments they cannot re-read."},
      {"type": "quiz", "question": "What is the purpose of signpost language in a formal speech?", "options": ["To fill time when the speaker forgets their notes", "To help listeners track the structure of the argument as it unfolds", "To make the speech longer", "To introduce the speaker''s biography"], "correctIndex": 1, "explanation": "Signpost language — today I will argue, my second point is, in conclusion — helps listeners orient themselves within a complex spoken argument they cannot scroll back through."}
    ]'::jsonb,
    '[{"term": "Formal speech", "definition": "A prepared oral address written and delivered for a specific audience and purpose"},
      {"term": "Signpost language", "definition": "Words and phrases that help listeners track the structure of a speech as it unfolds"},
      {"term": "Parallel structure", "definition": "Repeated grammatical forms used to create rhythm and emphasis in writing and speech"},
      {"term": "Data visualization", "definition": "A graphical representation of information or data, such as a chart, graph, or infographic"},
      {"term": "Cognitive overload", "definition": "The state of receiving more information than can be processed effectively at one time"}]'::jsonb,
    'The formal oratory of First Nations leaders at Treaty negotiations represents some of the most sophisticated rhetorical craft in Saskatchewan''s history. These speeches used structured argument, metaphor, emotional appeal, and deliberate pacing to advocate for communities under enormous pressure. Studying this tradition alongside formal speech writing demonstrates that powerful oratory emerges from deep knowledge, clear purpose, and genuine stakes.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CC9.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CC9.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is signpost language?', 'Words and phrases that help listeners track the structure of a speech as it unfolds.', 'Today I will argue... My second point is...', 4, 0),
    (v_tenant, v_ch, 'What is parallel structure?', 'Repeated grammatical forms used to create rhythm and emphasis in writing and speech.', 'The same grammatical pattern repeated for effect.', 4, 1),
    (v_tenant, v_ch, 'What is cognitive overload?', 'The state of receiving more information than can be processed effectively at one time.', 'Too much at once — the audience stops absorbing.', 4, 2),
    (v_tenant, v_ch, 'Why should slides contain minimal text?', 'If the audience is reading the slides, they are not listening to the speaker — and the speaker becomes unnecessary.', 'The slides support you; they do not replace you.', 4, 3);


  -- ========================================================================
  -- UNIT 4: Advanced Grammar and Style
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Advanced Grammar and Style',
    'Developing sentence variety, parallel structure, and awareness of tone and register.',
    'Grammar and style choices are rhetorical choices — they shape meaning, tone, and reader experience as much as word choice does.',
    'How do grammar and style choices shape the way writing feels and communicates?')
  RETURNING id INTO v_unit;

  -- Chapter 4 — Advanced Grammar and Style (CC9.2, CC9.4)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 4, 'Advanced Grammar and Style', 'ela-9-advanced-grammar-style',
    'Apply sentence variety, parallel structure, and awareness of tone and register to improve writing style.',
    '[
      {"type": "heading", "level": 1, "text": "Advanced Grammar and Style"},
      {"type": "text", "content": "Grammar is not a cage — it is a toolkit. Understanding how grammatical structures create different effects gives you genuine stylistic control. In Grade 9, students move beyond correcting errors to making deliberate choices: varying sentence length for rhythm, using parallel structure for emphasis, and adapting tone and register to match context and audience."},
      {"type": "heading", "level": 2, "text": "Sentence Variety"},
      {"type": "text", "content": "Sentence variety prevents monotony and creates rhythm. Simple sentences (one independent clause) create clarity and impact. Compound sentences (two independent clauses joined by a coordinating conjunction) suggest equal ideas in balance or contrast. Complex sentences (one independent clause and one or more dependent clauses) show hierarchical relationships between ideas — the subordinate clause indicates a less important idea. Vary length strategically: a short punchy sentence after a long complex one creates emphasis. Writers who use only one sentence type — regardless of which type — produce writing that feels mechanical and flat."},
      {"type": "callout", "style": "tip", "title": "Style Tip", "content": "Read a paragraph of your writing aloud and count the words in each sentence. If they are all the same length, rewrite for variety. Mix short declarative sentences with longer, more developed ones."},
      {"type": "heading", "level": 2, "text": "Parallel Structure"},
      {"type": "text", "content": "Parallel structure means using the same grammatical form for ideas that have the same logical function. In a list: we need to gather evidence, evaluate sources, and drawing conclusions is faulty — drawing should be draw. In comparisons: she prefers reading over to watch television is faulty — to watch should be watching. Parallel structure makes writing feel balanced and clear. It also creates rhetorical power: the repetition of form signals that items belong together and should be given equal weight."},
      {"type": "heading", "level": 2, "text": "Tone and Register"},
      {"type": "text", "content": "Tone is the writer''s emotional attitude toward the subject (ironic, reverent, urgent, detached). Register is the level of formality (casual, informal, formal, academic). A personal essay and a lab report on the same topic will have very different tones and registers. Skilled writers shift register deliberately when context demands it — a research paper uses academic register; a personal narrative may use colloquial register. The error is not using informal register — it is using informal register when formal register is expected, or vice versa."},
      {"type": "callout", "style": "info", "title": "Indigenous Perspective", "content": "Many First Nations and Metis writers in Saskatchewan deliberately choose their register — moving between formal English, colloquial Prairie English, Michif, and Cree — as a political and artistic act. Code-switching (moving between languages or registers) is a sophisticated linguistic skill that challenges the assumption that one register or language is inherently superior. Studying register and tone in Indigenous writing illuminates how language itself is a site of cultural identity and resistance."},
      {"type": "quiz", "question": "What is parallel structure?", "options": ["Using the same sentence length throughout a paragraph", "Using the same grammatical form for ideas with the same logical function", "Starting every sentence with a verb", "Using only compound sentences"], "correctIndex": 1, "explanation": "Parallel structure means matching grammatical forms to logical function — all items in a list, all verbs in a sequence, or all nouns in a comparison should be in the same grammatical form."},
      {"type": "quiz", "question": "What is the difference between tone and register?", "options": ["They are the same thing with different names", "Tone is the writer''s emotional attitude; register is the level of formality", "Register is the subject of the writing; tone is the length", "Tone applies to poetry only; register applies to prose"], "correctIndex": 1, "explanation": "Tone is the emotional attitude a writer takes toward the subject (ironic, reverent, urgent). Register is the level of formality (casual, informal, formal, academic). Both are deliberate stylistic choices."}
    ]'::jsonb,
    '[{"term": "Sentence variety", "definition": "The use of different sentence lengths and structures to create rhythm and prevent monotony"},
      {"term": "Parallel structure", "definition": "Using the same grammatical form for ideas that have the same logical function"},
      {"term": "Tone", "definition": "The writer''s emotional attitude toward the subject, conveyed through word choice and style"},
      {"term": "Register", "definition": "The level of formality in language, ranging from casual to highly formal or academic"},
      {"term": "Code-switching", "definition": "Moving between two or more languages or registers, often as a deliberate cultural or communicative act"}]'::jsonb,
    'First Nations and Metis writers in Saskatchewan often move deliberately between English, Michif, Cree, and different registers of each language. This code-switching is both a literary technique and a political act — asserting that Indigenous languages and registers are not inferior alternatives to formal English but full linguistic systems with their own expressive power.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CC9.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is parallel structure?', 'Using the same grammatical form for ideas with the same logical function.', 'Match the form to the function.', 4, 0),
    (v_tenant, v_ch, 'What is register?', 'The level of formality in language, ranging from casual to highly formal or academic.', 'How formal is your language?', 4, 1),
    (v_tenant, v_ch, 'What is code-switching?', 'Moving between two or more languages or registers, often as a deliberate cultural or communicative act.', 'Shifting language based on context or identity.', 4, 2),
    (v_tenant, v_ch, 'Why does sentence variety matter?', 'It prevents monotony and creates rhythm — mixing short and long sentences makes writing feel alive.', 'Same length every time = flat. Vary it.', 4, 3);


  -- ========================================================================
  -- UNIT 5: Identity and Self-Expression Through Text
  -- ========================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 5, 'Identity and Self-Expression Through Text',
    'Writing personal essays, poetry, and exploring identity through deliberate literary choices.',
    'Self-expressive writing requires both honesty and craft — the willingness to explore difficult truths and the skill to shape them into meaningful form.',
    'How do I use writing to explore and express who I am and what I believe?')
  RETURNING id INTO v_unit;

  -- Chapter 5 — Identity and Self-Expression Through Text (CC9.4, CR9.3)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 5, 'Identity and Self-Expression Through Text', 'ela-9-identity-self-expression',
    'Write personal essays and poetry that explore identity, using deliberate craft choices to shape self-expressive writing.',
    '[
      {"type": "heading", "level": 1, "text": "Identity and Self-Expression Through Text"},
      {"type": "text", "content": "The most enduring writing emerges from genuine inquiry — not performance, not imitation, but the authentic exploration of what the writer actually thinks, feels, and wonders about the world. In Grade 9, students bring together everything they have learned about craft and use it in service of their most challenging subject: themselves."},
      {"type": "heading", "level": 2, "text": "The Personal Essay"},
      {"type": "text", "content": "The personal essay is a form of literary non-fiction that uses the writer''s own experience as a lens for examining a broader truth. It is not a journal entry — it is a crafted piece of writing with a thesis (though the thesis may emerge and deepen rather than being stated upfront), narrative movement, and reflective commentary. The personal essayist asks: What happened, and what does it mean? The best personal essays move outward from personal experience to illuminate something about human experience more broadly."},
      {"type": "callout", "style": "tip", "title": "Writing Tip", "content": "The most interesting personal essays are not about extraordinary events — they are about ordinary moments examined with extraordinary attention. The smaller and more specific the experience, the more universally resonant it often becomes."},
      {"type": "heading", "level": 2, "text": "Poetry as Self-Expression"},
      {"type": "text", "content": "Poetry is not just decorated prose — it is a distinct form with its own logic and possibilities. In poetry, white space is meaningful, line breaks are deliberate, sound patterns create emotional resonance, and compression makes every word carry weight. Self-expressive poetry does not require rhyme, though rhyme can be used deliberately for effect. It requires honesty, specificity, and the courage to stay in difficult emotional territory rather than retreating into abstraction. A concrete image — the smell of smoke on a winter evening, the texture of a grandmother''s hand — will do more emotional work than an abstract statement about loss or belonging."},
      {"type": "heading", "level": 2, "text": "Exploring Identity Through Writing"},
      {"type": "text", "content": "Identity is not a fixed thing to be described — it is a complex, shifting, and often contradictory set of belongings, experiences, and questions. Writing about identity means: exploring the tensions between who you are expected to be and who you are; examining how place, family, culture, and language have shaped you; sitting with uncertainty and ambiguity rather than resolving them too quickly; and recognizing that your story is not only yours — it is woven into larger stories of community, history, and relationship. Grade 9 students write from where they are, knowing that identity writing will look very different in five years."},
      {"type": "callout", "style": "info", "title": "Indigenous Perspective", "content": "For many First Nations and Metis students in Saskatchewan, writing about identity means engaging with questions of cultural continuity, intergenerational trauma, and resurgence. Indigenous writers across the province — and across Canada — have modeled how to hold complexity: writing honestly about the harm caused by residential schools and the Indian Act while also celebrating language revitalization, land-based knowledge, and the ongoing strength of their communities. This writing teaches all students that identity includes inherited pain and inherited beauty simultaneously."},
      {"type": "quiz", "question": "What distinguishes a personal essay from a journal entry?", "options": ["Personal essays are shorter", "Personal essays use craft, structure, and reflective commentary to move from personal experience toward broader meaning", "Journal entries are more formal", "There is no meaningful difference"], "correctIndex": 1, "explanation": "A personal essay is crafted literary non-fiction — it uses the writer''s experience as a lens but shapes it deliberately to explore broader truths. A journal entry is typically private and unrevised."},
      {"type": "quiz", "question": "Why do specific concrete images often work better than abstract statements in self-expressive writing?", "options": ["Because abstract statements are too long", "Because concrete images create sensory experience that lets readers feel rather than just understand the emotion", "Because abstract statements are not allowed in personal essays", "Because images are easier to write than ideas"], "correctIndex": 1, "explanation": "Concrete images engage the senses and create direct emotional experience for the reader. Abstract statements tell the reader how to feel; images make the reader feel it."}
    ]'::jsonb,
    '[{"term": "Personal essay", "definition": "A form of literary non-fiction that uses the writer''s own experience as a lens to examine a broader truth"},
      {"term": "Reflective commentary", "definition": "The writer''s interpretive analysis of an experience, explaining its significance beyond the facts"},
      {"term": "Compression", "definition": "The quality of poetry in which every word carries significant weight and nothing is wasted"},
      {"term": "Abstraction", "definition": "Ideas or concepts expressed in general terms rather than specific, concrete images"},
      {"term": "Identity writing", "definition": "Writing that explores who the writer is through the lens of experience, culture, community, and personal reflection"}]'::jsonb,
    'Indigenous writers across Saskatchewan model identity writing that holds complexity — honoring cultural resurgence, land connection, and community strength while also witnessing honestly the ongoing impacts of colonization, residential schools, and systemic inequality. Reading this work alongside their own identity writing invites Grade 9 students to understand that personal writing is never only personal — it is always situated in larger historical and relational contexts.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CC9.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'CR9.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a personal essay?', 'A form of literary non-fiction that uses the writer''s own experience as a lens to examine a broader truth.', 'Your story — crafted to say something larger.', 4, 0),
    (v_tenant, v_ch, 'What is reflective commentary?', 'The writer''s interpretive analysis of an experience, explaining its significance beyond the facts.', 'What happened + what it means.', 4, 1),
    (v_tenant, v_ch, 'What is compression in poetry?', 'The quality of poetry in which every word carries significant weight and nothing is wasted.', 'Every word earns its place.', 4, 2),
    (v_tenant, v_ch, 'Why do concrete images work better than abstraction in personal writing?', 'Concrete images create sensory experience that lets readers feel the emotion; abstraction only tells them about it.', 'Show, don''t tell.', 4, 3);

END $$;
