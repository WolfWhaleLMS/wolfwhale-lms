-- ============================================================================
-- WolfWhale Language & Writing 20/30 — Chapter Content Seed Data
-- Saskatchewan ELA Curriculum (Senior Level)
--
-- Slug: wolfwhale-language-writing-20-30
-- Replaces: Nelson Language and Writing 11
--
-- 12 Chapters covering:
--   1.  The Writing Process
--   2.  Narrative Writing
--   3.  Expository Writing
--   4.  Persuasive & Argumentative Writing
--   5.  Research Methodology
--   6.  Rhetorical Analysis
--   7.  Poetry & Creative Expression
--   8.  Indigenous Voices & Oral Tradition
--   9.  Media Literacy & Digital Writing
--  10.  Academic Writing & Critical Thinking
--  11.  Presentation & Communication
--  12.  Portfolio Development & Reflection
--
-- All content is 100% original. No copyrighted text is reproduced.
-- Indigenous authors are referenced by name and tradition only.
-- Saskatchewan context: Treaty territories, prairie landscapes, local culture.
--
-- tenant_id uses placeholder UUID: 00000000-0000-0000-0000-000000000001
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book UUID;
BEGIN
  SELECT id INTO v_book
  FROM textbooks
  WHERE tenant_id = v_tenant
    AND slug = 'wolfwhale-language-writing-20-30';

  IF v_book IS NULL THEN
    RAISE NOTICE 'Textbook wolfwhale-language-writing-20-30 not found. Skipping chapter seed.';
    RETURN;
  END IF;

  -- ========================================================================
  -- CHAPTER 1: The Writing Process
  -- ========================================================================
  INSERT INTO textbook_chapters (
    tenant_id, textbook_id, unit_id, chapter_number, title, slug,
    description, content, key_terms, indigenous_connection,
    estimated_minutes, is_published
  ) VALUES (
    v_tenant, v_book, NULL, 1,
    'The Writing Process',
    'the-writing-process',
    'Explore the recursive stages of writing — prewriting, drafting, revising, editing, and publishing — and discover how writing serves as a tool for thinking.',
    '[
      {"type": "heading", "level": 1,
        "content": "The Writing Process"},
      {"type": "text",
        "content": "Writing is not a single act but a series of interconnected stages that loop back on themselves. Experienced writers do not move in a straight line from idea to finished product. They circle through prewriting, drafting, revising, and editing many times before a piece of writing reaches its final shape. Understanding this recursive process is the foundation of strong composition at the senior level. Whether you are crafting a personal narrative, a research essay, or a persuasive editorial for your school newspaper, the process remains essentially the same \u2014 though the emphasis on each stage may shift depending on the genre and purpose."},
      {"type": "callout", "style": "info",
        "content": "Writing is thinking made visible. When you put words on a page, you are not simply recording ideas that already exist \u2014 you are generating, testing, and refining those ideas in real time. Many writers report that they do not fully understand what they think about a topic until they have written about it."},
      {"type": "heading", "level": 2,
        "content": "Prewriting: Generating Ideas"},
      {"type": "text",
        "content": "Prewriting is everything you do before you begin a formal draft. It includes brainstorming, freewriting, mind mapping, asking questions, conducting preliminary research, and having conversations with peers. The goal of prewriting is not to produce polished sentences \u2014 it is to explore possibilities. A student writing about food sovereignty in Saskatchewan, for example, might begin by listing everything they know about local agriculture, sketching connections between farming communities and Indigenous land stewardship, or freewriting for ten minutes about a visit to a farmers market in Saskatoon or Regina."},
      {"type": "text",
        "content": "Different prewriting strategies work for different writers and different tasks. Visual thinkers may prefer mind maps that show relationships between ideas. Writers who think by talking may benefit from recording a conversation with a peer and then transcribing key ideas. Analytical thinkers may prefer structured questioning \u2014 systematically working through who, what, where, when, why, and how. There is no single correct way to prewrite; the important thing is to spend enough time in this stage to generate rich material before moving to a draft."},
      {"type": "list", "ordered": false,
        "items": ["Brainstorming: listing ideas without judgment or editing", "Freewriting: writing continuously for a set time without stopping to correct or evaluate", "Mind mapping: drawing visual webs of connected concepts", "Questioning: using who, what, where, when, why, and how prompts", "Discussing: talking through ideas with a partner or small group", "Researching: gathering preliminary sources to spark thinking", "Journaling: using a writer''s notebook to capture observations, questions, and reflections over time"]},
      {"type": "callout", "style": "tip",
        "content": "Try this prewriting exercise: Set a timer for ten minutes and freewrite about a place in Saskatchewan that matters to you. Do not stop writing, do not cross anything out, and do not worry about grammar or spelling. When the timer goes off, read what you wrote and circle three ideas that surprise you. Those surprises are often the seeds of your best writing."},
      {"type": "heading", "level": 2,
        "content": "Drafting: Getting Words on the Page"},
      {"type": "text",
        "content": "A first draft is sometimes called a discovery draft because you are discovering what you want to say as you write. The most important rule of drafting is to keep moving forward. Resist the urge to perfect every sentence before moving to the next one. Many professional writers describe their first drafts as messy, incomplete, and full of gaps \u2014 and that is exactly as it should be. The purpose of a draft is to create raw material that you can shape during revision."},
      {"type": "text",
        "content": "Some writers draft quickly, pouring words onto the page in a rush of energy. Others draft slowly, pausing to think between paragraphs. Both approaches are valid. What matters is that you produce a complete draft \u2014 even if it is rough \u2014 before you begin revising. Trying to draft and revise simultaneously often leads to frustration and paralysis. Give yourself permission to write badly in the first draft. You can always make it better later."},
      {"type": "callout", "style": "tip",
        "content": "Drafting strategy: Try writing your body paragraphs first, then your introduction and conclusion. Many writers find that they cannot write an effective introduction until they know what the essay actually says \u2014 which they only discover through drafting the body."},
      {"type": "heading", "level": 2,
        "content": "Revising: Rethinking the Big Picture"},
      {"type": "text",
        "content": "Revision means literally to see again. It is the stage where you step back from your draft and evaluate its overall structure, argument, and clarity. Revision is not about fixing commas \u2014 it is about asking fundamental questions. Is my thesis clear? Does each paragraph advance my argument? Are my ideas presented in the most effective order? Have I considered my audience? Have I provided enough evidence and analysis? Revision often involves adding new material, cutting sections that do not serve the purpose, and reorganizing paragraphs entirely."},
      {"type": "text",
        "content": "Peer feedback is especially valuable during revision because another reader can identify confusion or gaps that the writer may not see. When giving feedback, focus on content and structure rather than grammar: tell the writer where you were confused, where you wanted more detail, and where the argument was most convincing. When receiving feedback, listen without defending your work \u2014 the goal is to understand how a reader experiences your writing, not to explain what you meant to say."},
      {"type": "heading", "level": 2,
        "content": "Editing and Proofreading"},
      {"type": "text",
        "content": "Editing focuses on sentence-level concerns: grammar, punctuation, spelling, word choice, and sentence variety. Proofreading is the final check for surface errors before a piece is shared or submitted. It helps to edit with a specific focus in each pass \u2014 one reading for comma usage, another for verb tense consistency, another for word repetition. Reading your work aloud is one of the most effective editing strategies because your ear will catch awkward phrasing that your eye might skip over."},
      {"type": "callout", "style": "tip",
        "content": "Editing checklist: (1) Read aloud for flow and awkward phrasing. (2) Check that every paragraph has a clear topic sentence. (3) Eliminate unnecessary words and redundant phrases. (4) Verify subject-verb agreement. (5) Confirm consistent verb tense throughout. (6) Check for commonly confused words (their/there/they''re, affect/effect, its/it''s). (7) Verify all citations are properly formatted."},
      {"type": "heading", "level": 2,
        "content": "Publishing: Sharing Your Work"},
      {"type": "text",
        "content": "Publishing is the stage where your writing reaches its intended audience. In a classroom setting, publishing might mean reading your essay aloud, submitting it to a class anthology, posting it to a digital platform, or presenting it at a school event. Publishing gives writing purpose and accountability \u2014 when you know someone will read your work, you are motivated to make it your best. In Saskatchewan schools, student literary magazines, Treaty education presentations, and community storytelling events offer meaningful publishing opportunities that connect student writing to real audiences."},
      {"type": "callout", "style": "info",
        "content": "In many First Nations and M\u00e9tis oral traditions, stories are living things \u2014 they grow and change each time they are told. This understanding mirrors the recursive writing process: a text is never truly finished but is continually shaped by new perspectives and audiences. The Western concept of a final draft exists in tension with the Indigenous understanding that knowledge and expression are always evolving."},
      {"type": "quiz",
        "question": "Which stage of the writing process involves evaluating the overall structure, argument, and organization of a draft?",
        "options": ["Prewriting", "Drafting", "Revising", "Editing"],
        "correct": 2,
        "explanation": "Revising is the stage where writers step back and rethink the big picture \u2014 structure, argument, organization, and clarity. Editing, by contrast, focuses on sentence-level concerns like grammar and punctuation."},
      {"type": "quiz",
        "question": "Why is the writing process described as recursive rather than linear?",
        "options": ["Because writers always start with an outline", "Because each stage must be completed before moving to the next", "Because writers move back and forth between stages as their thinking develops", "Because the final draft is always identical to the first draft"],
        "correct": 2,
        "explanation": "The writing process is recursive because writers frequently return to earlier stages \u2014 for example, discovering during revision that they need more prewriting research, or realizing during editing that a paragraph needs to be restructured."}
    ]'::jsonb,
    '[
      {"term": "Recursive Process",
        "definition": "A process in which the stages loop back on themselves, allowing the writer to return to earlier stages as needed."},
      {"term": "Prewriting",
        "definition": "The stage of generating ideas, gathering information, and planning before drafting."},
      {"term": "Drafting",
        "definition": "The stage of writing a preliminary version of a text, focused on getting ideas down rather than perfecting language."},
      {"term": "Revision",
        "definition": "The stage of rethinking and restructuring a draft to improve its overall effectiveness, clarity, and argument."},
      {"term": "Editing",
        "definition": "The stage of refining sentence-level elements such as grammar, punctuation, word choice, and mechanics."},
      {"term": "Proofreading",
        "definition": "The final stage of checking a text for surface errors before publication or submission."},
      {"term": "Freewriting",
        "definition": "A prewriting technique in which the writer writes continuously for a set period without stopping to correct or evaluate."},
      {"term": "Discovery Draft",
        "definition": "A first draft written with the goal of exploring and discovering ideas rather than producing a polished product."}
    ]'::jsonb,
    'Many First Nations and Métis oral traditions emphasize that stories are living things — they grow and change each time they are told. This understanding mirrors the recursive writing process: a text is never truly finished, but is continually shaped by new perspectives and audiences.',
    30, false
  ) ON CONFLICT (textbook_id, chapter_number) DO NOTHING;


  -- ========================================================================
  -- CHAPTER 2: Narrative Writing
  -- ========================================================================
  INSERT INTO textbook_chapters (
    tenant_id, textbook_id, unit_id, chapter_number, title, slug,
    description, content, key_terms, indigenous_connection,
    estimated_minutes, is_published
  ) VALUES (
    v_tenant, v_book, NULL, 2,
    'Narrative Writing',
    'narrative-writing',
    'Develop skills in crafting original stories through story structure, characterization, point of view, setting, dialogue, and creative fiction techniques.',
    '[
      {"type": "heading", "level": 1,
        "content": "Narrative Writing"},
      {"type": "text",
        "content": "Narrative writing tells a story. Whether you are composing a short fiction piece, a personal memoir, or a creative nonfiction essay, narrative writing uses the elements of storytelling \u2014 character, setting, conflict, and resolution \u2014 to engage readers and communicate meaning. At the senior level, narrative writing is not simply about recounting events; it is about making deliberate craft choices that shape how a reader experiences the story."},
      {"type": "callout", "style": "info",
        "content": "Every narrative is built on a question that matters to the characters. Before you begin writing, ask yourself: what does my main character want, and what stands in their way? The tension between desire and obstacle is the engine that drives every story forward."},
      {"type": "heading", "level": 2,
        "content": "Story Structure"},
      {"type": "text",
        "content": "Most narratives follow a recognizable arc. The exposition introduces the characters, setting, and situation. The rising action presents a series of complications that build tension. The climax is the moment of greatest intensity or turning point. The falling action shows the consequences of the climax, and the resolution brings the story to a close. While many effective stories follow this traditional arc, skilled writers sometimes experiment with structure \u2014 beginning at the climax and working backward, using a circular structure that ends where it began, or telling a story through fragmented vignettes that the reader assembles into a whole."},
      {"type": "list", "ordered": true,
        "items": ["Exposition: introduce characters, setting, and initial situation", "Rising action: build tension through complications and obstacles", "Climax: the turning point or moment of highest tension", "Falling action: show consequences and wind down tension", "Resolution: bring the story to a satisfying close"]},
      {"type": "text",
        "content": "Consider how you might structure a story set in a small Saskatchewan town during a blizzard. A traditional arc might begin with the protagonist driving home from work, build tension as the storm worsens and the car stalls, reach a climax when the protagonist must decide whether to stay in the car or walk to a distant farmhouse, and resolve when they reach safety. An experimental structure might begin with the protagonist already safe in the farmhouse, then move backward through the storm, revealing in reverse the decisions that led to survival."},
      {"type": "heading", "level": 2,
        "content": "Characterization"},
      {"type": "text",
        "content": "Strong characters feel real. Direct characterization tells the reader about a character explicitly \u2014 their age, appearance, or personality traits. Indirect characterization reveals character through actions, dialogue, thoughts, and the reactions of others. At the senior level, the most compelling characters are complex: they have contradictions, make mistakes, and change over the course of the story. Consider a character who is fiercely loyal to family but struggles to trust anyone outside their community, or a teenager who excels academically but feels disconnected from the land their grandparents farmed. That kind of internal tension makes a character feel human and gives the reader something to care about."},
      {"type": "callout", "style": "tip",
        "content": "Character development exercise: Write a one-page scene in which your character must make a difficult choice. Do not tell the reader what kind of person the character is \u2014 show it through what they do and say. After writing the scene, list three things a reader would learn about your character from actions and dialogue alone."},
      {"type": "heading", "level": 2,
        "content": "Point of View"},
      {"type": "text",
        "content": "Point of view determines who tells the story and how much the reader can know. First-person narration uses I and gives the reader intimate access to one character''s thoughts, but limits what can be revealed about other characters. Third-person limited follows one character closely but uses he, she, or they. Third-person omniscient allows the narrator to move between characters and reveal anyone''s thoughts. Second-person narration, which uses you, is less common but can create an immersive, direct connection with the reader. Each point of view creates a different relationship between the reader and the story, and choosing the right one is a critical craft decision."},
      {"type": "heading", "level": 2,
        "content": "Setting and Sensory Detail"},
      {"type": "text",
        "content": "Setting is more than a backdrop \u2014 it shapes mood, reflects character, and can even function as a force in the story. A narrative set on the Saskatchewan prairie in January carries a different emotional weight than one set in a busy city in summer. Effective writers use sensory detail to bring settings to life. Rather than writing it was cold, a skilled writer might describe the way frost formed crystalline patterns on the inside of the kitchen window, or how the air burned sharp in the nostrils with each breath. Engage all five senses: sight, sound, smell, taste, and touch."},
      {"type": "text",
        "content": "Saskatchewan offers extraordinary settings for narrative writing. The endless geometry of canola fields in August, gold stretching to every horizon. The eerie silence of a frozen lake at dawn, broken only by the distant crack of expanding ice. The glow of grain elevators at dusk along a railway line. The hum of a powwow drum circle on a summer evening. These are settings that carry deep emotional and cultural resonance, and using them in your fiction connects your stories to the place where you live and learn."},
      {"type": "heading", "level": 2,
        "content": "Dialogue"},
      {"type": "text",
        "content": "Dialogue serves multiple purposes in narrative writing: it reveals character, advances the plot, and creates a sense of immediacy. Effective dialogue sounds natural without being a transcript of real speech \u2014 real conversation is full of interruptions, false starts, and filler words that would slow down a story. Each character should have a distinct voice that reflects their personality, background, and emotional state. Use dialogue tags sparingly (said is almost always sufficient) and let the dialogue itself carry the emotional weight."},
      {"type": "callout", "style": "tip",
        "content": "Dialogue tip: Read your dialogue aloud. If it sounds stiff or unnatural, revise it. Cut any dialogue that does not reveal character or move the story forward. Remember that what characters choose NOT to say can be just as powerful as what they do say."},
      {"type": "callout", "style": "info",
        "content": "Indigenous storytelling traditions across the prairies often use circular narrative structures, where a story ends by returning to its beginning with new understanding. Writers such as Thomas King (Cherokee/Greek descent, based in Canada) have explored how circular storytelling challenges Western linear plot conventions and invites readers to see connections rather than conclusions."},
      {"type": "quiz",
        "question": "What is the difference between direct and indirect characterization?",
        "options": ["Direct characterization uses dialogue; indirect uses narration", "Direct characterization tells the reader about a character; indirect shows character through actions, dialogue, and thoughts", "Direct characterization is used in first person; indirect is used in third person", "There is no meaningful difference between the two techniques"],
        "correct": 1,
        "explanation": "Direct characterization explicitly tells the reader about a character (e.g., stating that a character is generous). Indirect characterization shows character through actions, dialogue, thoughts, and the reactions of others, allowing the reader to draw their own conclusions."},
      {"type": "quiz",
        "question": "Which point of view allows the narrator to reveal the thoughts and feelings of multiple characters?",
        "options": ["First person", "Second person", "Third-person limited", "Third-person omniscient"],
        "correct": 3,
        "explanation": "Third-person omniscient narration allows the narrator to move between characters and reveal anyone''s inner thoughts and feelings, providing the broadest perspective on events."}
    ]'::jsonb,
    '[
      {"term": "Narrative Arc",
        "definition": "The structure of a story, typically including exposition, rising action, climax, falling action, and resolution."},
      {"term": "Direct Characterization",
        "definition": "A technique in which the writer tells the reader directly about a character''s traits."},
      {"term": "Indirect Characterization",
        "definition": "A technique in which character is revealed through actions, dialogue, thoughts, and others'' reactions."},
      {"term": "Point of View",
        "definition": "The perspective from which a story is told, such as first person, second person, or third person."},
      {"term": "Sensory Detail",
        "definition": "Descriptive language that appeals to the five senses \u2014 sight, sound, smell, taste, and touch."},
      {"term": "Dialogue",
        "definition": "The spoken words of characters in a narrative, set off by quotation marks."},
      {"term": "Vignette",
        "definition": "A short, evocative scene or sketch that captures a moment or impression."},
      {"term": "Climax",
        "definition": "The point of greatest tension or the turning point in a narrative."}
    ]'::jsonb,
    'Indigenous storytelling traditions across the prairies often use circular narrative structures, where a story ends by returning to its beginning with new understanding. Writers such as Thomas King (Cherokee/Greek descent, based in Canada) have explored how circular storytelling challenges Western linear plot conventions and invites readers to see connections rather than conclusions.',
    30, false
  ) ON CONFLICT (textbook_id, chapter_number) DO NOTHING;


  -- ========================================================================
  -- CHAPTER 3: Expository Writing
  -- ========================================================================
  INSERT INTO textbook_chapters (
    tenant_id, textbook_id, unit_id, chapter_number, title, slug,
    description, content, key_terms, indigenous_connection,
    estimated_minutes, is_published
  ) VALUES (
    v_tenant, v_book, NULL, 3,
    'Expository Writing',
    'expository-writing',
    'Learn to craft clear informational texts including process essays, cause-and-effect analyses, comparison papers, and synthesis writing.',
    '[
      {"type": "heading", "level": 1,
        "content": "Expository Writing"},
      {"type": "text",
        "content": "Expository writing explains, informs, or clarifies. Unlike narrative writing, which tells a story, or persuasive writing, which argues a position, expository writing presents information as objectively and clearly as possible. News articles, textbook chapters, how-to guides, scientific reports, and encyclopedia entries are all forms of expository writing. At the senior level, you are expected to organize complex information logically, support your explanations with evidence, and write with precision and clarity."},
      {"type": "callout", "style": "info",
        "content": "The hallmark of strong expository writing is clarity. Every sentence should advance the reader''s understanding. If a sentence does not inform or explain, cut it. Your job as an expository writer is to make complex ideas accessible without oversimplifying them."},
      {"type": "heading", "level": 2,
        "content": "Process Writing"},
      {"type": "text",
        "content": "A process essay explains how something works or how to do something. The key to effective process writing is sequencing: present the steps in a logical, chronological order, and anticipate places where the reader might become confused. Use transition words like first, next, then, after, and finally to guide the reader through each step. A process essay about harvesting wild rice in northern Saskatchewan, for example, would need to explain the timing of the harvest, the tools used, the technique of knocking rice into the canoe, and the steps of drying and parching the grain. Each step must be clear enough that someone unfamiliar with the process could follow along."},
      {"type": "text",
        "content": "Process writing also includes explaining how systems work \u2014 how a municipal water treatment plant purifies drinking water, how provincial legislation moves from proposal to law, or how photosynthesis converts sunlight into energy. In these explanatory process essays, you are not providing instructions but rather helping the reader understand a system or mechanism. Clarity and logical sequencing remain essential."},
      {"type": "heading", "level": 2,
        "content": "Cause and Effect"},
      {"type": "text",
        "content": "Cause-and-effect writing examines why something happens (the cause) and what results from it (the effect). This organizational pattern is common in science, history, and social studies writing. A cause-and-effect essay might explore how the construction of a dam on a Saskatchewan river altered downstream ecosystems, or how changes in agricultural policy affected rural communities on the prairies. Strong cause-and-effect writing avoids oversimplification \u2014 most events have multiple causes and multiple effects, and responsible writers acknowledge this complexity."},
      {"type": "list", "ordered": false,
        "items": ["Identify the central cause or event clearly", "Trace multiple effects, acknowledging complexity rather than reducing to a single outcome", "Use evidence (data, expert analysis, historical examples) to support causal claims", "Distinguish between correlation (things that happen together) and causation (one thing causing another)", "Organize by either presenting all causes then all effects, or by pairing each cause with its corresponding effect"]},
      {"type": "callout", "style": "tip",
        "content": "Writing tip: When writing a cause-and-effect essay, be careful with causal language. Phrases like caused, led to, and resulted in assert a direct causal relationship. Phrases like contributed to, may have influenced, and is associated with signal a more cautious, nuanced claim. Choose your language based on the strength of the evidence."},
      {"type": "heading", "level": 2,
        "content": "Comparison and Contrast"},
      {"type": "text",
        "content": "Comparison writing examines similarities and differences between two or more subjects. There are two common organizational approaches. Block organization discusses all aspects of one subject first, then all aspects of the second subject. Point-by-point organization alternates between the two subjects for each point of comparison. Point-by-point organization tends to create stronger analysis because it forces the writer to make direct connections between the subjects rather than leaving the comparison for the reader to infer."},
      {"type": "text",
        "content": "For example, a comparison essay about two approaches to managing grassland ecosystems in Saskatchewan \u2014 conventional agriculture and Indigenous land stewardship \u2014 could be organized by discussing each approach in a separate block, or by comparing the two approaches point by point on topics like biodiversity, soil health, water management, and cultural significance. The point-by-point structure would create a more integrated, analytical essay."},
      {"type": "callout", "style": "tip",
        "content": "When writing a comparison essay, choose subjects that share enough common ground to be meaningfully compared. The purpose of comparison is to illuminate something new about both subjects \u2014 not simply to list similarities and differences."},
      {"type": "heading", "level": 2,
        "content": "Synthesis Writing"},
      {"type": "text",
        "content": "Synthesis writing combines information from multiple sources to create a new, unified understanding of a topic. Unlike a summary, which simply restates what a source says, synthesis requires the writer to identify connections, patterns, and tensions across sources. A synthesis essay on prairie land use might draw on agricultural science journals, historical records of Treaty negotiations, and contemporary interviews with farmers and First Nations land managers to construct a multifaceted picture of how the land has been used and understood over time."},
      {"type": "callout", "style": "tip",
        "content": "Synthesis framework: (1) Read all sources and take notes on key ideas. (2) Identify themes or patterns that appear across sources. (3) Organize your essay around those themes, drawing on multiple sources in each paragraph. (4) Use your own analysis to connect the sources \u2014 do not simply list summaries one after another."},
      {"type": "callout", "style": "info",
        "content": "Indigenous knowledge systems have long practised synthesis \u2014 weaving together observations of weather, animal behaviour, plant cycles, and oral history to form holistic understandings of ecosystems. Elders across Treaty 4 and Treaty 6 territories have described this integrated approach to knowledge as seeing the whole circle rather than isolated parts."},
      {"type": "quiz",
        "question": "What distinguishes synthesis writing from summary writing?",
        "options": ["Synthesis is longer than summary", "Synthesis combines multiple sources to create new understanding; summary restates a single source", "Summary uses evidence; synthesis does not", "There is no difference between the two"],
        "correct": 1,
        "explanation": "Summary restates the key ideas of a single source, while synthesis draws on multiple sources to identify patterns, connections, and tensions, creating a new, integrated understanding of the topic."},
      {"type": "quiz",
        "question": "In a cause-and-effect essay, why is it important to distinguish between correlation and causation?",
        "options": ["Because correlation is always more important than causation", "Because they are the same thing and should be used interchangeably", "Because two events happening together does not prove that one caused the other", "Because causation cannot be supported with evidence"],
        "correct": 2,
        "explanation": "Correlation means two things happen together, but causation means one thing directly causes the other. Responsible writers distinguish between the two to avoid making unsupported claims."}
    ]'::jsonb,
    '[
      {"term": "Expository Writing",
        "definition": "Writing that explains, informs, or clarifies a topic in an objective and organized manner."},
      {"term": "Process Essay",
        "definition": "An essay that explains how something works or provides step-by-step instructions for completing a task."},
      {"term": "Cause and Effect",
        "definition": "An organizational pattern that examines the reasons something happens and the results that follow."},
      {"term": "Correlation",
        "definition": "A relationship in which two variables occur together, without necessarily implying that one causes the other."},
      {"term": "Causation",
        "definition": "A relationship in which one event directly produces or influences another event."},
      {"term": "Synthesis",
        "definition": "The act of combining information from multiple sources to develop a new, unified understanding."},
      {"term": "Block Organization",
        "definition": "A comparison structure that discusses all aspects of one subject before discussing the other."},
      {"term": "Point-by-Point Organization",
        "definition": "A comparison structure that alternates between subjects for each point of comparison."}
    ]'::jsonb,
    'Indigenous knowledge systems have long practised synthesis — weaving together observations of weather, animal behaviour, plant cycles, and oral history to form holistic understandings of ecosystems. Elders across Treaty 4 and Treaty 6 territories have described this integrated approach to knowledge as seeing the whole circle rather than isolated parts.',
    30, false
  ) ON CONFLICT (textbook_id, chapter_number) DO NOTHING;


  -- ========================================================================
  -- CHAPTER 4: Persuasive & Argumentative Writing
  -- ========================================================================
  INSERT INTO textbook_chapters (
    tenant_id, textbook_id, unit_id, chapter_number, title, slug,
    description, content, key_terms, indigenous_connection,
    estimated_minutes, is_published
  ) VALUES (
    v_tenant, v_book, NULL, 4,
    'Persuasive & Argumentative Writing',
    'persuasive-argumentative-writing',
    'Construct compelling arguments using thesis statements, evidence, counterarguments, and rhetorical appeals including ethos, pathos, and logos.',
    '[
      {"type": "heading", "level": 1,
        "content": "Persuasive & Argumentative Writing"},
      {"type": "text",
        "content": "Persuasive and argumentative writing aims to convince the reader to accept a particular position, take a specific action, or consider an issue from a new angle. While the terms persuasion and argument are sometimes used interchangeably, there is an important distinction: persuasion can appeal to emotions, values, and personal experience, while formal argumentation relies primarily on logic and evidence. At the senior level, you will learn to combine these approaches strategically, adapting your rhetorical strategy to your audience and purpose."},
      {"type": "heading", "level": 2,
        "content": "Crafting a Thesis Statement"},
      {"type": "text",
        "content": "A thesis statement is the central claim of your argument \u2014 the position you will defend throughout the essay. An effective thesis is specific, debatable, and significant. A statement like pollution is bad is too vague and too obvious to serve as a thesis. A stronger thesis might argue that Saskatchewan municipalities should invest in constructed wetlands as a cost-effective strategy for filtering agricultural runoff before it reaches major waterways. This thesis is specific (constructed wetlands in Saskatchewan), debatable (not everyone would agree), and significant (it addresses a real environmental challenge)."},
      {"type": "callout", "style": "tip",
        "content": "Test your thesis: Can a reasonable person disagree with it? If not, it is a statement of fact rather than an argument. A thesis must take a position that requires evidence and reasoning to defend. Revise until your thesis makes a clear, defensible claim."},
      {"type": "heading", "level": 2,
        "content": "Evidence and Support"},
      {"type": "text",
        "content": "An argument without evidence is merely an opinion. Strong arguments are built on a foundation of relevant, credible evidence. Evidence can take many forms: statistics and data, expert testimony, historical examples, case studies, logical reasoning, and personal observation (when appropriate). When selecting evidence, consider its source, its relevance to your specific claim, and whether your audience will find it credible. A scientific study published in a peer-reviewed journal carries more weight in an academic argument than an anonymous online comment."},
      {"type": "text",
        "content": "The way you integrate evidence matters as much as the evidence itself. Simply dropping a statistic or a reference into your essay without explanation or analysis is not effective. For each piece of evidence, you should introduce it (explain what it is and where it comes from), present it (state the fact, finding, or observation), and analyze it (explain how it supports your specific claim). This introduce-present-analyze pattern ensures that evidence works in service of your argument rather than standing alone."},
      {"type": "list", "ordered": false,
        "items": ["Statistics and data from credible, identifiable sources", "Expert testimony from recognized authorities in the relevant field", "Historical examples and precedents that parallel your argument", "Case studies and real-world applications that demonstrate your point", "Logical reasoning and analysis connecting evidence to claims", "Personal observation and experience (used sparingly in formal argument)"]},
      {"type": "heading", "level": 2,
        "content": "Counterarguments and Rebuttals"},
      {"type": "text",
        "content": "Acknowledging and responding to counterarguments strengthens your position rather than weakening it. When you address opposing views, you demonstrate that you have considered the issue from multiple perspectives and that your position holds up under scrutiny. A counterargument section typically follows a pattern: acknowledge the opposing view fairly, concede any valid points, then explain why your position is ultimately stronger. Avoid creating straw man arguments \u2014 weak or distorted versions of the opposing view that are easy to dismiss. Engage honestly with the strongest version of the opposition."},
      {"type": "callout", "style": "tip",
        "content": "Counterargument framework: (1) Acknowledge: Some critics argue that... (2) Concede what is valid: While it is true that... (3) Rebut: However, this view overlooks... (4) Reinforce: Therefore, the evidence more strongly supports the conclusion that..."},
      {"type": "heading", "level": 2,
        "content": "Rhetorical Appeals: Ethos, Pathos, and Logos"},
      {"type": "text",
        "content": "The ancient Greek philosopher Aristotle identified three primary modes of persuasion. Ethos is an appeal to the credibility and character of the speaker or writer \u2014 readers are more likely to be persuaded by someone they trust and respect. Pathos is an appeal to the audience''s emotions \u2014 values, fears, hopes, and sense of justice. Logos is an appeal to logic and reason \u2014 the use of evidence, data, and rational argument to support a claim. Effective persuasive writing weaves all three appeals together, adjusting the balance depending on the audience and purpose."},
      {"type": "text",
        "content": "Consider a student writing an op-ed for a school newspaper arguing that the cafeteria should source ingredients from local Saskatchewan farms. They might establish ethos by mentioning their volunteer work at a community garden. They might use pathos by describing how local food connects students to the land and to the farmers who grow it. They might use logos by presenting data showing that local sourcing reduces transportation costs and supports the regional economy. Together, these appeals create a persuasive case that engages the reader on multiple levels."},
      {"type": "callout", "style": "info",
        "content": "In Saskatchewan Treaty education, understanding rhetorical appeals is essential. Historical Treaty documents, speeches by Indigenous leaders, and government communications all employed ethos, pathos, and logos \u2014 analyzing how these appeals were used and sometimes manipulated deepens understanding of both the Treaties and the power of language."},
      {"type": "heading", "level": 2,
        "content": "Logical Fallacies"},
      {"type": "text",
        "content": "A logical fallacy is an error in reasoning that undermines the logic of an argument. Being able to identify fallacies \u2014 both in your own writing and in the arguments of others \u2014 is a critical thinking skill. Common fallacies include: ad hominem (attacking the person rather than the argument), false dilemma (presenting only two options when more exist), slippery slope (claiming that one action will inevitably lead to an extreme consequence without evidence), appeal to popularity (arguing that something is true because many people believe it), and hasty generalization (drawing a broad conclusion from insufficient evidence). Strong argumentative writing avoids these errors and addresses them when they appear in opposing arguments."},
      {"type": "quiz",
        "question": "What is a straw man argument?",
        "options": ["An argument built entirely on emotional appeals", "A weak or distorted version of an opposing view, created to be easily dismissed", "An argument that uses only statistical evidence", "A thesis statement that is too vague to be debatable"],
        "correct": 1,
        "explanation": "A straw man argument misrepresents or oversimplifies an opposing view to make it easier to attack. Strong argumentative writing engages with the strongest version of the counterargument."},
      {"type": "quiz",
        "question": "Which rhetorical appeal relies primarily on logic, evidence, and rational argument?",
        "options": ["Ethos", "Pathos", "Logos", "Kairos"],
        "correct": 2,
        "explanation": "Logos is the appeal to logic and reason. It involves using evidence, data, statistics, and rational argument to support a claim. Ethos appeals to credibility, and pathos appeals to emotion."}
    ]'::jsonb,
    '[
      {"term": "Thesis Statement",
        "definition": "The central claim of an argumentative essay \u2014 a specific, debatable position that the writer will defend."},
      {"term": "Ethos",
        "definition": "A rhetorical appeal based on the credibility, character, and trustworthiness of the speaker or writer."},
      {"term": "Pathos",
        "definition": "A rhetorical appeal to the audience''s emotions, values, and sense of identity."},
      {"term": "Logos",
        "definition": "A rhetorical appeal to logic, reason, and evidence."},
      {"term": "Counterargument",
        "definition": "An opposing viewpoint that a writer acknowledges and responds to in order to strengthen their own position."},
      {"term": "Rebuttal",
        "definition": "A response to a counterargument that explains why the writer''s original position is stronger."},
      {"term": "Straw Man",
        "definition": "A logical fallacy in which an opponent''s argument is misrepresented or oversimplified in order to be more easily attacked."},
      {"term": "Logical Fallacy",
        "definition": "An error in reasoning that undermines the logic and validity of an argument."}
    ]'::jsonb,
    'Indigenous leaders during Treaty negotiations demonstrated powerful rhetorical skill. Speeches by leaders such as Chief Mistawasis and Chief Ahtahkakoop during the Treaty 6 negotiations at Fort Carlton in 1876 employed ethos (their authority as leaders), pathos (concern for future generations), and logos (pragmatic reasoning about survival and adaptation). Studying these speeches honours the intellectual traditions of First Nations diplomacy.',
    35, false
  ) ON CONFLICT (textbook_id, chapter_number) DO NOTHING;


  -- ========================================================================
  -- CHAPTER 5: Research Methodology
  -- ========================================================================
  INSERT INTO textbook_chapters (
    tenant_id, textbook_id, unit_id, chapter_number, title, slug,
    description, content, key_terms, indigenous_connection,
    estimated_minutes, is_published
  ) VALUES (
    v_tenant, v_book, NULL, 5,
    'Research Methodology',
    'research-methodology',
    'Develop skills in finding and evaluating primary and secondary sources, using MLA and APA citation formats, and maintaining academic integrity.',
    '[
      {"type": "heading", "level": 1,
        "content": "Research Methodology"},
      {"type": "text",
        "content": "Research is the systematic process of investigating a question, gathering evidence, and constructing an informed response. At the senior level, research goes beyond simply finding information \u2014 it requires you to evaluate sources critically, synthesize multiple perspectives, and present your findings with proper attribution. Whether you are writing a literary analysis, a social studies report, or a science review, strong research skills are essential to producing credible, well-supported work."},
      {"type": "heading", "level": 2,
        "content": "Primary and Secondary Sources"},
      {"type": "text",
        "content": "A primary source is an original, firsthand account or artifact: a diary entry, a government document, a photograph, an interview transcript, raw data from an experiment, or a speech. A secondary source analyzes, interprets, or comments on primary sources: textbooks, scholarly articles, documentaries, and critical essays are all secondary sources. Strong research draws on both types. For a project on the history of residential schools in Saskatchewan, primary sources might include survivor testimonies from the Truth and Reconciliation Commission, government correspondence, and photographs from the era. Secondary sources might include scholarly analyses by historians and education researchers."},
      {"type": "text",
        "content": "Tertiary sources \u2014 encyclopedias, databases, indexes, and textbooks \u2014 provide useful background information and can help you identify key concepts and terminology, but they are rarely cited in formal academic work. Use tertiary sources to orient yourself at the beginning of a research project, then move to primary and secondary sources for the substance of your argument."},
      {"type": "list", "ordered": false,
        "items": ["Primary sources: original documents, interviews, photographs, speeches, data sets, letters, artifacts", "Secondary sources: scholarly articles, textbooks, documentaries, reviews, critical essays, biographies", "Tertiary sources: encyclopedias, databases, indexes \u2014 useful for background but rarely cited in academic work"]},
      {"type": "heading", "level": 2,
        "content": "Evaluating Source Credibility"},
      {"type": "text",
        "content": "Not all sources are equally reliable. Evaluating credibility requires asking several questions: Who is the author, and what are their qualifications? Where was the source published \u2014 in a peer-reviewed journal, a reputable news outlet, or an anonymous blog? When was it published \u2014 is the information current or outdated? Why was it written \u2014 to inform, to persuade, to sell a product? Does the source provide evidence for its claims, or does it rely on unsupported assertions? The CRAAP test (Currency, Relevance, Authority, Accuracy, Purpose) provides a useful framework for evaluating sources systematically."},
      {"type": "callout", "style": "info",
        "content": "The CRAAP test: Currency \u2014 Is the information recent enough for your topic? Relevance \u2014 Does it directly address your research question? Authority \u2014 Is the author qualified in this field? Accuracy \u2014 Is the information supported by evidence and verifiable? Purpose \u2014 What is the author''s intent (inform, persuade, sell, entertain)?"},
      {"type": "text",
        "content": "In the digital age, evaluating source credibility is more important than ever. Websites, social media posts, and online articles can be published by anyone, regardless of their expertise or intentions. Be especially cautious of sources that lack clear authorship, that use emotional language rather than evidence, that fail to cite their own sources, or that appear on websites with a clear commercial or political agenda. Cross-reference claims across multiple credible sources before accepting them as reliable."},
      {"type": "heading", "level": 2,
        "content": "MLA and APA Citation"},
      {"type": "text",
        "content": "Citation is the practice of giving credit to the sources you use in your writing. It serves three purposes: it acknowledges the intellectual work of others, it allows your reader to locate and verify your sources, and it protects you from plagiarism. The two most common citation formats in Canadian secondary schools are MLA (Modern Language Association), typically used in English and humanities courses, and APA (American Psychological Association), typically used in social sciences and education. Both formats require in-text citations and a works cited or references page at the end of the paper."},
      {"type": "callout", "style": "tip",
        "content": "MLA in-text citation format: (Author Last Name page number) \u2014 for example: (Campbell 42). APA in-text citation format: (Author Last Name, year) \u2014 for example: (Campbell, 2019). Always include a full entry in your Works Cited (MLA) or References (APA) list at the end of your paper."},
      {"type": "heading", "level": 2,
        "content": "Avoiding Plagiarism"},
      {"type": "text",
        "content": "Plagiarism is the act of presenting someone else''s words, ideas, or work as your own. It is a serious breach of academic integrity that can result in a failing grade, suspension, or other consequences. Plagiarism can be intentional \u2014 copying text from a source without attribution \u2014 or unintentional \u2014 failing to cite a source because you did not realize it was necessary. To avoid plagiarism: always cite your sources, use quotation marks when using an author''s exact words, paraphrase by expressing ideas in your own words and sentence structure (not just swapping out a few words), and keep careful notes during research so you always know where an idea originated."},
      {"type": "text",
        "content": "Paraphrasing is one of the most challenging research skills to develop. An effective paraphrase captures the meaning of the original source in your own words and sentence structure. Simply replacing a few words with synonyms while keeping the same sentence structure is still a form of plagiarism. To paraphrase effectively: read the original passage, close the source, write the idea in your own words from memory, then check against the original to ensure accuracy. Always cite the source, even when paraphrasing."},
      {"type": "callout", "style": "info",
        "content": "When researching Indigenous topics, it is essential to prioritize Indigenous voices and perspectives. Seek out sources created by Indigenous authors, communities, and organizations. The Truth and Reconciliation Commission''s Calls to Action and the National Centre for Truth and Reconciliation provide invaluable primary source materials. Oral histories shared by Elders are primary sources that deserve the same scholarly respect as written documents."},
      {"type": "quiz",
        "question": "What is the difference between a primary source and a secondary source?",
        "options": ["Primary sources are more reliable than secondary sources", "Primary sources are original firsthand accounts; secondary sources analyze or interpret primary sources", "Secondary sources are written by experts; primary sources are not", "There is no meaningful difference between primary and secondary sources"],
        "correct": 1,
        "explanation": "A primary source is an original, firsthand account or artifact (interview, diary, photograph, raw data). A secondary source analyzes, interprets, or comments on primary sources (scholarly articles, textbooks, documentaries)."},
      {"type": "quiz",
        "question": "Which element is NOT part of the CRAAP test for evaluating source credibility?",
        "options": ["Currency", "Relevance", "Authenticity", "Purpose"],
        "correct": 2,
        "explanation": "The CRAAP test evaluates Currency, Relevance, Authority, Accuracy, and Purpose. Authenticity is not one of the five criteria, though it is a valuable consideration in source evaluation."}
    ]'::jsonb,
    '[
      {"term": "Primary Source",
        "definition": "An original, firsthand account or artifact such as a diary, interview, photograph, speech, or data set."},
      {"term": "Secondary Source",
        "definition": "A source that analyzes, interprets, or comments on primary sources, such as a scholarly article or textbook."},
      {"term": "CRAAP Test",
        "definition": "A framework for evaluating source credibility based on Currency, Relevance, Authority, Accuracy, and Purpose."},
      {"term": "MLA",
        "definition": "Modern Language Association \u2014 a citation style commonly used in English and humanities courses."},
      {"term": "APA",
        "definition": "American Psychological Association \u2014 a citation style commonly used in social sciences and education."},
      {"term": "Plagiarism",
        "definition": "The act of presenting someone else''s words, ideas, or work as your own without proper attribution."},
      {"term": "Paraphrase",
        "definition": "Expressing an author''s ideas in your own words and sentence structure while retaining the original meaning and citing the source."},
      {"term": "Works Cited",
        "definition": "The list of all sources referenced in an MLA-formatted paper, appearing at the end of the document."}
    ]'::jsonb,
    'When researching Indigenous topics, it is essential to prioritize Indigenous voices and perspectives. Seek out sources created by Indigenous authors, communities, and organizations. The Truth and Reconciliation Commission''s Calls to Action and the National Centre for Truth and Reconciliation provide invaluable primary source materials. Oral histories shared by Elders are primary sources that deserve the same scholarly respect as written documents.',
    30, false
  ) ON CONFLICT (textbook_id, chapter_number) DO NOTHING;


  -- ========================================================================
  -- CHAPTER 6: Rhetorical Analysis
  -- ========================================================================
  INSERT INTO textbook_chapters (
    tenant_id, textbook_id, unit_id, chapter_number, title, slug,
    description, content, key_terms, indigenous_connection,
    estimated_minutes, is_published
  ) VALUES (
    v_tenant, v_book, NULL, 6,
    'Rhetorical Analysis',
    'rhetorical-analysis',
    'Analyze how writers and speakers use purpose, audience, tone, and rhetorical devices to achieve their goals. Develop media literacy and critical reading skills.',
    '[
      {"type": "heading", "level": 1,
        "content": "Rhetorical Analysis"},
      {"type": "text",
        "content": "Rhetorical analysis is the practice of examining how a text works \u2014 not what it says, but how it says it. When you perform a rhetorical analysis, you investigate the choices a writer or speaker makes and evaluate how effectively those choices communicate a message to a specific audience. This skill is essential not only in English class but in everyday life: understanding how language persuades, informs, and manipulates helps you become a more critical reader, listener, and citizen."},
      {"type": "callout", "style": "info",
        "content": "Rhetorical analysis asks four fundamental questions: What is the author trying to achieve? Who is the intended audience? What strategies does the author use? How effective are those strategies? Every rhetorical analysis you write should address these questions."},
      {"type": "heading", "level": 2,
        "content": "The Rhetorical Situation"},
      {"type": "text",
        "content": "Every act of communication occurs within a rhetorical situation \u2014 the combination of purpose, audience, context, and constraints that shapes a text. Purpose is the reason the text was created: to inform, to persuade, to entertain, to express, or to call to action. Audience is the intended reader or listener: their background knowledge, values, expectations, and relationship to the topic all influence how the text is crafted. Context includes the historical moment, the cultural setting, and the medium through which the text is delivered. Understanding the rhetorical situation is the first step in any analysis."},
      {"type": "text",
        "content": "Consider a public health notice posted in a Saskatchewan community about water safety. The purpose is to inform and protect. The audience is residents who may or may not have scientific background. The context is a specific community with its own history, demographics, and relationship to water. These elements of the rhetorical situation determine every choice the writer makes \u2014 from the vocabulary used to the tone adopted to the medium chosen for distribution."},
      {"type": "heading", "level": 2,
        "content": "Tone and Diction"},
      {"type": "text",
        "content": "Tone is the attitude a writer conveys toward the subject and the audience. It is created primarily through diction \u2014 the writer''s choice of words. Formal diction (one might consider, it is imperative that) creates a tone of authority and seriousness. Informal diction (let''s think about this, the thing is) creates a tone of approachability and conversation. A writer covering water quality issues in rural Saskatchewan might adopt a formal, measured tone when writing for a government report and a passionate, urgent tone when writing a community newsletter. The choice of tone depends on the rhetorical situation."},
      {"type": "heading", "level": 2,
        "content": "Rhetorical Devices"},
      {"type": "text",
        "content": "Rhetorical devices are specific techniques writers and speakers use to strengthen their message. These include repetition (repeating a word or phrase for emphasis), parallelism (using similar grammatical structures in a series), rhetorical questions (asking questions to make a point rather than to elicit an answer), antithesis (placing contrasting ideas side by side), anecdote (using a brief personal story to illustrate a point), and analogy (comparing an unfamiliar concept to a familiar one to aid understanding). Skilled communicators deploy these devices deliberately, choosing the right tool for the right moment."},
      {"type": "list", "ordered": false,
        "items": ["Repetition: reinforces key ideas through deliberate restatement", "Parallelism: creates rhythm and balance through matching grammatical structures", "Rhetorical question: engages the audience by prompting reflection without expecting an answer", "Antithesis: highlights contrast by placing opposing ideas in close proximity", "Anecdote: personalizes abstract arguments through brief, illustrative stories", "Analogy: clarifies complex ideas by comparing them to familiar concepts", "Irony: creates meaning through the gap between what is said and what is meant"]},
      {"type": "callout", "style": "tip",
        "content": "When writing a rhetorical analysis, avoid simply listing the devices you find. Instead, analyze their effect: explain why the writer chose a particular device and how it serves the overall purpose. A device only matters if you can explain what it does for the argument."},
      {"type": "heading", "level": 2,
        "content": "Analyzing Visual and Multimedia Rhetoric"},
      {"type": "text",
        "content": "Rhetorical analysis is not limited to essays and speeches \u2014 it applies to every form of media. Advertisements, social media posts, news broadcasts, political campaigns, and even memes all employ rhetorical strategies. A billboard for a Saskatchewan tourism campaign uses visual imagery (pathos), a logo suggesting official authority (ethos), and a statistic about visitor spending (logos) simultaneously. Learning to analyze visual and multimedia texts with the same rigor you apply to written texts is an essential component of modern critical literacy."},
      {"type": "text",
        "content": "When analyzing visual rhetoric, consider composition (what is placed in the centre versus the margins), colour (warm versus cool tones, high versus low contrast), framing (close-up versus wide shot), and text-image relationships (does the text anchor the meaning of the image, or does the image illustrate the text?). Every visual choice is a rhetorical choice, made to create a specific effect on the viewer."},
      {"type": "callout", "style": "info",
        "content": "Indigenous oratory traditions are rich in rhetorical devices. Speeches by leaders during Treaty negotiations and community gatherings often employed repetition, parallelism, and vivid analogy \u2014 comparing the relationship between peoples to the relationship between the earth and the sky, or between a river and its banks. Analyzing these rhetorical traditions with the same rigor applied to Western texts honours the intellectual depth of Indigenous communication."},
      {"type": "quiz",
        "question": "What is the primary focus of rhetorical analysis?",
        "options": ["Evaluating whether a text is factually correct", "Examining how a text uses language and strategy to achieve its purpose", "Identifying grammatical errors in a text", "Summarizing the main argument of a text"],
        "correct": 1,
        "explanation": "Rhetorical analysis focuses on how a text works \u2014 the strategies, devices, and choices a writer makes to communicate a message to a specific audience. It examines technique, not factual accuracy or grammar."},
      {"type": "quiz",
        "question": "Which rhetorical device involves placing contrasting ideas side by side for emphasis?",
        "options": ["Parallelism", "Anecdote", "Antithesis", "Analogy"],
        "correct": 2,
        "explanation": "Antithesis places contrasting or opposing ideas in close proximity to highlight the difference between them and create a memorable, balanced statement."}
    ]'::jsonb,
    '[
      {"term": "Rhetorical Analysis",
        "definition": "The practice of examining how a text uses language, structure, and strategy to communicate a message to a specific audience."},
      {"term": "Rhetorical Situation",
        "definition": "The combination of purpose, audience, context, and constraints that shapes any act of communication."},
      {"term": "Tone",
        "definition": "The attitude a writer conveys toward the subject and audience, created primarily through word choice."},
      {"term": "Diction",
        "definition": "A writer''s choice of words, which contributes to tone, formality, and overall effect."},
      {"term": "Parallelism",
        "definition": "The use of similar grammatical structures in a series or list to create rhythm and emphasis."},
      {"term": "Antithesis",
        "definition": "A rhetorical device that places contrasting ideas side by side for emphasis."},
      {"term": "Analogy",
        "definition": "A comparison between an unfamiliar concept and a familiar one, used to clarify or explain."},
      {"term": "Media Literacy",
        "definition": "The ability to critically analyze and evaluate messages across all forms of media."}
    ]'::jsonb,
    'Indigenous oratory traditions are rich in rhetorical devices. Speeches by leaders during Treaty negotiations and community gatherings often employed repetition, parallelism, and vivid analogy — comparing the relationship between peoples to the relationship between the earth and the sky, or between a river and its banks. Analyzing these rhetorical traditions with the same rigor applied to Western texts honours the intellectual depth of Indigenous communication.',
    30, false
  ) ON CONFLICT (textbook_id, chapter_number) DO NOTHING;


  -- ========================================================================
  -- CHAPTER 7: Poetry & Creative Expression
  -- ========================================================================
  INSERT INTO textbook_chapters (
    tenant_id, textbook_id, unit_id, chapter_number, title, slug,
    description, content, key_terms, indigenous_connection,
    estimated_minutes, is_published
  ) VALUES (
    v_tenant, v_book, NULL, 7,
    'Poetry & Creative Expression',
    'poetry-creative-expression',
    'Explore poetic forms, imagery, figurative language, spoken word traditions, and the craft of writing original poetry.',
    '[
      {"type": "heading", "level": 1,
        "content": "Poetry & Creative Expression"},
      {"type": "text",
        "content": "Poetry is language at its most compressed and deliberate. In poetry, every word, every pause, every line break carries weight. A poet makes choices that a prose writer might not need to consider: the rhythm of syllables, the sound of vowels and consonants, the visual shape of the poem on the page. At the senior level, studying poetry means both reading poetry with close attention to craft and writing original poems that demonstrate your understanding of poetic techniques."},
      {"type": "callout", "style": "info",
        "content": "Poetry is not about using fancy words or rhyming perfectly. It is about choosing the most precise, most vivid, most honest language to express something that matters to you. The best poems make the reader see the world in a new way."},
      {"type": "heading", "level": 2,
        "content": "Poetic Forms"},
      {"type": "text",
        "content": "Poetic forms provide structures that shape the experience of reading and writing a poem. A sonnet''s fourteen lines and specific rhyme scheme create a sense of containment and resolution. A villanelle''s repeating refrains create a circular, obsessive quality. Free verse, which does not follow a fixed metre or rhyme scheme, allows the poet maximum flexibility but requires careful attention to line breaks, rhythm, and pacing to create structure through other means. Prose poetry blurs the boundary between poetry and prose, using poetic language and imagery within the format of a paragraph. Each form offers different possibilities and constraints, and experimenting with multiple forms is the best way to discover which ones suit your voice and subject matter."},
      {"type": "list", "ordered": false,
        "items": ["Sonnet: 14 lines, typically iambic pentameter, with a turn or shift in thought (the volta)", "Haiku: 3 lines (traditionally 5-7-5 syllables), often capturing a moment in nature with precision", "Villanelle: 19 lines with two repeating refrains, creating a circular, sometimes obsessive pattern", "Free verse: no fixed metre or rhyme scheme, structured by line breaks, rhythm, and internal patterns", "Prose poetry: poetic language, imagery, and compression within the format of a paragraph", "Spoken word: poetry composed for live performance, emphasizing voice, rhythm, and audience connection", "Found poetry: poetry created by rearranging words from existing non-poetic texts such as newspapers or signs"]},
      {"type": "heading", "level": 2,
        "content": "Imagery and Figurative Language"},
      {"type": "text",
        "content": "Imagery is language that appeals to the senses \u2014 sight, sound, touch, taste, and smell. A poem about a Saskatchewan winter might describe the way snow squeaked underfoot in the minus-thirty air, or how the horizon dissolved into a white absence where land and sky became indistinguishable. Strong imagery does not simply describe \u2014 it recreates an experience in the reader''s mind, making them see, hear, and feel what the poet describes."},
      {"type": "text",
        "content": "Figurative language extends meaning beyond the literal. A simile compares two unlike things using like or as. A metaphor makes a direct comparison without like or as. Personification attributes human qualities to non-human things \u2014 the wind whispered, the river argued with its banks. Hyperbole uses deliberate exaggeration for emphasis or effect. Synecdoche uses a part to represent the whole, or vice versa. Each of these devices creates a connection between the familiar and the unfamiliar, helping the reader understand abstract or complex experiences through concrete images."},
      {"type": "callout", "style": "tip",
        "content": "Writing exercise: Describe a familiar place (your kitchen, your schoolyard, a stretch of highway outside town) using only sensory details \u2014 no abstract words like beautiful, nice, boring, or interesting. Let the images do the emotional work. Then review what you wrote and identify which senses you relied on most and which you neglected."},
      {"type": "heading", "level": 2,
        "content": "Sound Devices"},
      {"type": "text",
        "content": "Poetry is as much about sound as it is about meaning. Alliteration is the repetition of consonant sounds at the beginning of words. Assonance is the repetition of vowel sounds within words. Consonance is the repetition of consonant sounds within or at the end of words. Onomatopoeia is the use of words that imitate sounds. These devices create music in language, reinforcing mood and meaning. A poem about a quiet prairie evening might use soft consonants and long vowel sounds to slow the reader down, while a poem about a thunderstorm might use hard consonants and short, punchy words to create urgency and impact."},
      {"type": "heading", "level": 2,
        "content": "Spoken Word and Performance Poetry"},
      {"type": "text",
        "content": "Spoken word poetry is composed for live performance. It emphasizes voice, rhythm, repetition, and direct emotional connection with an audience. Spoken word has roots in many traditions \u2014 including hip-hop, jazz poetry, and Indigenous oral storytelling \u2014 and has become a powerful form of expression for young people across Canada. In Saskatchewan, spoken word events and poetry slams provide platforms for youth to share their voices on issues ranging from identity and belonging to social justice and land stewardship."},
      {"type": "text",
        "content": "When writing spoken word, consider how the poem sounds aloud: where will you pause, where will you raise your voice, where will you slow down or speed up for emphasis? Repetition is a particularly effective tool in spoken word \u2014 a repeated phrase can build momentum, create emotional intensity, and drive home a key message. Practice performing your poem for a trusted friend or in front of a mirror, experimenting with volume, pace, and gesture."},
      {"type": "callout", "style": "info",
        "content": "Saskatchewan has a vibrant spoken word community. Poets such as Zoey Roy (Cree/Dene/M\u00e9tis) have used spoken word to explore identity, resilience, and the intersection of Indigenous and urban experience. Look for local poetry slams and open mic events as opportunities to share your own work and to hear the diverse voices of your community."},
      {"type": "heading", "level": 2,
        "content": "Writing Original Poetry"},
      {"type": "text",
        "content": "Writing original poetry begins with paying attention \u2014 to the world around you, to your own experiences and emotions, and to language itself. Start by observing closely: what do you see, hear, feel, smell, and taste right now? Write those observations down without worrying about form or perfection. Then begin to shape the language: experiment with line breaks, try a specific form, play with sound and rhythm. Revision is essential in poetry \u2014 a single word can change the entire effect of a poem. Read your drafts aloud, share them with trusted peers, and be willing to rewrite many times until the poem says exactly what you mean."},
      {"type": "callout", "style": "info",
        "content": "Many Indigenous poetic traditions are rooted in the oral \u2014 songs, chants, prayers, and stories shared aloud for generations. Contemporary Indigenous poets such as Louise Bernice Halfe (Cree, from Saddle Lake, Alberta, with deep connections to Saskatchewan), Gregory Scofield (M\u00e9tis), and Tenille Campbell (Dene/M\u00e9tis, from northern Saskatchewan) draw on these oral traditions while innovating within contemporary poetic forms."},
      {"type": "quiz",
        "question": "What is the difference between a simile and a metaphor?",
        "options": ["A simile is a type of metaphor", "A simile uses like or as to make a comparison; a metaphor makes a direct comparison without like or as", "A metaphor is longer than a simile", "Similes are used in prose; metaphors are used in poetry"],
        "correct": 1,
        "explanation": "A simile compares two unlike things using like or as (e.g., the river moved like a ribbon of silver). A metaphor makes a direct comparison without using like or as (e.g., the river was a ribbon of silver)."},
      {"type": "quiz",
        "question": "Which poetic form consists of 19 lines with two repeating refrains?",
        "options": ["Sonnet", "Haiku", "Villanelle", "Free verse"],
        "correct": 2,
        "explanation": "A villanelle is a 19-line poem with two repeating refrains and a specific pattern of repetition. The form creates a circular, often obsessive quality."}
    ]'::jsonb,
    '[
      {"term": "Imagery",
        "definition": "Language that appeals to the senses \u2014 sight, sound, touch, taste, and smell \u2014 to create vivid pictures in the reader''s mind."},
      {"term": "Simile",
        "definition": "A figure of speech that compares two unlike things using like or as."},
      {"term": "Metaphor",
        "definition": "A figure of speech that makes a direct comparison between two unlike things without using like or as."},
      {"term": "Personification",
        "definition": "A figure of speech that attributes human qualities or actions to non-human things."},
      {"term": "Alliteration",
        "definition": "The repetition of consonant sounds at the beginning of words in close proximity."},
      {"term": "Spoken Word",
        "definition": "Poetry composed for live performance, emphasizing voice, rhythm, repetition, and audience connection."},
      {"term": "Free Verse",
        "definition": "Poetry that does not follow a fixed metre or rhyme scheme, relying on line breaks and rhythm for structure."},
      {"term": "Onomatopoeia",
        "definition": "The use of words that imitate the sounds they describe (e.g., buzz, hiss, crack)."}
    ]'::jsonb,
    'Many Indigenous poetic traditions are rooted in the oral — songs, chants, prayers, and stories that have been shared aloud for generations. Contemporary Indigenous poets such as Louise Bernice Halfe (Cree), Gregory Scofield (Métis), and Tenille Campbell (Dene/Métis, from northern Saskatchewan) draw on these oral traditions while also innovating within contemporary poetic forms. Their work demonstrates that poetry is a living tradition, always evolving.',
    30, false
  ) ON CONFLICT (textbook_id, chapter_number) DO NOTHING;


  -- ========================================================================
  -- CHAPTER 8: Indigenous Voices & Oral Tradition
  -- ========================================================================
  INSERT INTO textbook_chapters (
    tenant_id, textbook_id, unit_id, chapter_number, title, slug,
    description, content, key_terms, indigenous_connection,
    estimated_minutes, is_published
  ) VALUES (
    v_tenant, v_book, NULL, 8,
    'Indigenous Voices & Oral Tradition',
    'indigenous-voices-oral-tradition',
    'Engage with oral storytelling traditions, Treaty education through literature, Indigenous literary perspectives, and land-based narrative in the Saskatchewan context.',
    '[
      {"type": "heading", "level": 1,
        "content": "Indigenous Voices & Oral Tradition"},
      {"type": "text",
        "content": "The literary traditions of the Indigenous peoples of this land \u2014 the nehiyawak (Cree), Anih\u0161in\u0101p\u0113k (Saulteaux), Nakoda, Dakota, Lakota, Dene, and M\u00e9tis peoples of the prairies \u2014 are among the oldest and richest in the world. Long before European contact, complex systems of knowledge were preserved and transmitted through oral tradition: stories, songs, ceremonies, and teachings passed from generation to generation through the spoken word. Understanding and respecting these traditions is essential to a complete understanding of literature and language in Saskatchewan."},
      {"type": "callout", "style": "info",
        "content": "Oral tradition is not a lesser form of literature \u2014 it is a different and equally sophisticated form. Oral stories carry law, history, science, philosophy, and spiritual teaching. They are intellectual achievements of the highest order and deserve the same scholarly respect as any written canon."},
      {"type": "heading", "level": 2,
        "content": "The Power of Oral Storytelling"},
      {"type": "text",
        "content": "Oral storytelling is a relational practice. Unlike a written text, which exists independently of its author, an oral story is shaped by the relationship between the storyteller and the listeners, by the place where the story is told, and by the occasion. Many Indigenous stories are connected to specific seasons \u2014 some stories are traditionally told only in winter, when the ground is covered with snow. The storyteller is not simply reciting a fixed text; they are performing, adapting, and interpreting the story in response to the audience and the moment. This makes oral tradition a living, dynamic literary form that cannot be fully captured on a printed page."},
      {"type": "text",
        "content": "In many First Nations and M\u00e9tis traditions, stories serve specific purposes. Teaching stories transmit knowledge about the natural world, social behaviour, and spiritual responsibility. Trickster stories \u2014 featuring figures such as Wisahkecahk in Cree tradition \u2014 use humour, paradox, and unexpected outcomes to challenge assumptions and encourage critical thinking. Origin stories explain how the world came to be and establish the relationships between humans, animals, plants, and the land. Each type of story has protocols about when, where, and how it should be shared, and these protocols are as important as the stories themselves."},
      {"type": "callout", "style": "info",
        "content": "When engaging with Indigenous oral traditions in an academic setting, approach them with respect. Not all stories are meant to be shared publicly. Protocols vary by nation and community. When in doubt, consult with Elders, Knowledge Keepers, or Indigenous educators in your school or community. The Saskatchewan curriculum emphasizes learning with Indigenous communities, not just about them."},
      {"type": "heading", "level": 2,
        "content": "Treaty Education Through Literature"},
      {"type": "text",
        "content": "Saskatchewan is Treaty territory. Treaties 2, 4, 5, 6, 8, and 10 cover the entire province, along with the homeland of the M\u00e9tis Nation. Treaty education is a mandatory component of the Saskatchewan curriculum because Treaties are foundational to the relationship between Indigenous peoples and the Crown \u2014 a relationship that shapes the social, political, and economic reality of the province to this day. Literature is one of the most powerful ways to engage with Treaty education because stories make history personal. Novels, poetry, personal essays, and oral accounts by Indigenous writers illuminate the lived experience of Treaty relationships \u2014 the promises made, the promises broken, and the ongoing work of reconciliation."},
      {"type": "text",
        "content": "Writers such as Maria Campbell (M\u00e9tis, from northern Saskatchewan) have documented the experience of M\u00e9tis communities through personal narrative. Tomson Highway (Cree, from northern Manitoba, with extensive work across the prairies) has brought Cree storytelling traditions and language to the stage. Contemporary Indigenous authors continue to explore themes of identity, land, language loss, intergenerational resilience, and the reclamation of cultural practices. Reading these authors in the context of Treaty education deepens understanding of both the literature and the historical relationships that shaped Saskatchewan."},
      {"type": "heading", "level": 2,
        "content": "Land-Based Narrative"},
      {"type": "text",
        "content": "In many Indigenous literary traditions, land is not merely a setting \u2014 it is a character, a teacher, and a relative. Land-based narrative understands the prairies, forests, rivers, and lakes of Saskatchewan not as backdrop but as participants in the story. The South Saskatchewan River is not just a geographic feature; it is a being with history, personality, and relationships to the people who have lived along its banks for millennia. This understanding of land challenges Western literary conventions that tend to treat setting as separate from character and plot."},
      {"type": "text",
        "content": "When you read or write land-based narrative, consider how the land shapes the characters, how the characters relate to the land, and what the land itself might be communicating. A story set along the banks of the North Saskatchewan River in winter tells a different story than one set along the same river in summer \u2014 not just because the weather changes, but because the river itself is different: its flow, its sounds, its relationship to the animals and plants along its banks, and the activities of the people who depend on it."},
      {"type": "callout", "style": "tip",
        "content": "Writing prompt: Choose a place in Saskatchewan that is meaningful to you \u2014 a river, a field, a street, a park, a farmyard. Write about that place as though it were a character in a story. What has it witnessed? What does it remember? What is its relationship to you? How has it changed over time?"},
      {"type": "heading", "level": 2,
        "content": "Contemporary Indigenous Literature"},
      {"type": "text",
        "content": "The landscape of Indigenous literature in Canada is vibrant and growing. Indigenous authors are writing in every genre \u2014 fiction, poetry, creative nonfiction, graphic novels, screenwriting, and journalism. Their work is not defined solely by historical trauma, though it often engages with that history honestly and powerfully. Contemporary Indigenous literature also celebrates joy, humour, love, community, cultural continuity, and the persistence of languages and traditions. Engaging with this literature requires the same close reading skills you apply to any text \u2014 attention to craft, structure, voice, and meaning \u2014 combined with an awareness of the cultural and historical context from which the work emerges."},
      {"type": "text",
        "content": "As a reader, approach Indigenous literature with curiosity and humility. Resist the urge to reduce complex works to simple themes or messages. Recognize that you may not understand every cultural reference or protocol, and that this is acceptable \u2014 not every aspect of a story is meant for every audience. What matters is that you engage respectfully, read attentively, and allow the work to expand your understanding of the world."},
      {"type": "quiz",
        "question": "Why are some Indigenous stories traditionally told only during certain seasons?",
        "options": ["Because the stories are not interesting at other times of year", "Because oral storytelling follows cultural protocols that connect stories to specific times, places, and occasions", "Because Indigenous communities do not have access to books", "Because the stories are fictional and therefore unimportant"],
        "correct": 1,
        "explanation": "Many Indigenous oral traditions have protocols governing when and how stories should be shared. Some stories are connected to specific seasons \u2014 for example, certain stories are told only in winter. These protocols reflect the deep cultural and spiritual significance of the stories."},
      {"type": "quiz",
        "question": "What does the term land-based narrative mean in the context of Indigenous literature?",
        "options": ["Stories that are set outdoors", "Narratives that treat the land as a participant, character, or relative rather than merely a backdrop", "Any story written in a rural setting", "Fiction that describes farming practices"],
        "correct": 1,
        "explanation": "Land-based narrative treats the land not as mere setting but as a participant in the story \u2014 a character, teacher, and relative with its own history and relationships. This approach reflects Indigenous understandings of the interconnectedness of all living things."}
    ]'::jsonb,
    '[
      {"term": "Oral Tradition",
        "definition": "The practice of preserving and transmitting knowledge, stories, history, and cultural teachings through the spoken word across generations."},
      {"term": "Trickster Figure",
        "definition": "A character in many Indigenous storytelling traditions who uses humour, deception, and paradox to challenge assumptions and teach lessons."},
      {"term": "Treaty Education",
        "definition": "The study of the historical Treaties between Indigenous peoples and the Crown, their ongoing significance, and the responsibilities they create for all people living on Treaty territory."},
      {"term": "Land-Based Narrative",
        "definition": "A storytelling approach that treats the land as a participant, character, or relative rather than merely a backdrop or setting."},
      {"term": "Knowledge Keeper",
        "definition": "An Elder or community member who holds and shares traditional knowledge, cultural practices, and oral teachings."},
      {"term": "Reconciliation",
        "definition": "The ongoing process of establishing and maintaining respectful relationships between Indigenous and non-Indigenous peoples, rooted in truth, justice, and mutual understanding."},
      {"term": "Protocol",
        "definition": "The cultural guidelines governing how ceremonies, stories, and teachings should be conducted and shared within a specific nation or community."},
      {"term": "Wisahkecahk",
        "definition": "A trickster figure in Cree storytelling tradition, known for humour, curiosity, and the unintended consequences of impulsive actions."}
    ]'::jsonb,
    'This entire chapter centres Indigenous voices and perspectives. It is grounded in the understanding that Saskatchewan is Treaty territory and that the literary traditions of the nehiyawak, Anihšināpēk, Nakoda, Dakota, Lakota, Dene, and Métis peoples are foundational to the cultural and intellectual life of this province. Students are encouraged to seek out Indigenous authors, attend community storytelling events, and approach all oral and literary traditions with respect and humility.',
    35, false
  ) ON CONFLICT (textbook_id, chapter_number) DO NOTHING;


  -- ========================================================================
  -- CHAPTER 9: Media Literacy & Digital Writing
  -- ========================================================================
  INSERT INTO textbook_chapters (
    tenant_id, textbook_id, unit_id, chapter_number, title, slug,
    description, content, key_terms, indigenous_connection,
    estimated_minutes, is_published
  ) VALUES (
    v_tenant, v_book, NULL, 9,
    'Media Literacy & Digital Writing',
    'media-literacy-digital-writing',
    'Develop critical skills for analyzing media messages, composing for digital platforms, understanding social media rhetoric, and interpreting visual texts.',
    '[
      {"type": "heading", "level": 1,
        "content": "Media Literacy & Digital Writing"},
      {"type": "text",
        "content": "We live in an age of information abundance. Every day, you encounter hundreds of media messages \u2014 news articles, social media posts, advertisements, videos, podcasts, memes, and more. Media literacy is the ability to access, analyze, evaluate, and create media in a variety of forms. It requires the same critical thinking skills you use when analyzing a poem or an essay, applied to the full range of media that shapes our understanding of the world. In Saskatchewan, where rural and urban communities may experience media very differently, media literacy is essential for informed citizenship and responsible participation in public life."},
      {"type": "callout", "style": "info",
        "content": "Media literacy is not about rejecting all media \u2014 it is about engaging with media thoughtfully and critically. The goal is not suspicion but discernment: understanding how messages are constructed, who benefits from them, and what they are designed to achieve."},
      {"type": "heading", "level": 2,
        "content": "Analyzing Media Messages"},
      {"type": "text",
        "content": "Every media message is constructed by someone with a purpose. When analyzing a media text \u2014 whether it is a news article, an advertisement, a social media post, or a documentary \u2014 consider these questions: Who created this message? What techniques are used to attract and hold attention? What values, lifestyles, or points of view are represented? What is omitted from this message? How might different people interpret this message differently? These questions form the foundation of critical media analysis and help you move beyond passive consumption to active engagement."},
      {"type": "list", "ordered": false,
        "items": ["Authorship: Who created this message, and what is their motivation?", "Format: What techniques (visual, audio, textual) are used to attract and hold attention?", "Audience: Who is the intended audience, and how can you tell?", "Content: What values, lifestyles, or viewpoints are represented \u2014 and what is left out?", "Purpose: What does the creator want you to think, feel, or do as a result of encountering this message?", "Context: When and where was this message created, and how does that historical or cultural context shape its meaning?"]},
      {"type": "heading", "level": 2,
        "content": "Digital Composition"},
      {"type": "text",
        "content": "Digital writing extends the possibilities of traditional composition. Blogs, podcasts, video essays, infographics, and multimedia presentations allow writers to combine text with images, audio, video, and interactive elements. When composing for digital platforms, consider the affordances of the medium \u2014 what can digital tools do that print cannot? Hyperlinks allow readers to explore related sources. Embedded video can demonstrate processes that are difficult to describe in words alone. Interactive charts can let readers explore data at their own pace. However, digital writing also requires the same foundational skills as print writing: clear thinking, strong organization, precise language, and awareness of audience."},
      {"type": "callout", "style": "tip",
        "content": "Digital writing tip: Every element in a digital composition should serve a purpose. Do not add images, videos, or animations simply because you can. Ask yourself: does this element help my audience understand my message, or does it distract from it?"},
      {"type": "heading", "level": 2,
        "content": "Social Media Rhetoric"},
      {"type": "text",
        "content": "Social media platforms are rhetorical spaces. Every post, tweet, story, and comment is a deliberate (or sometimes careless) act of communication. Social media rhetoric operates differently from traditional rhetoric because of the speed of communication, the size of potential audiences, the blurring of public and private expression, and the algorithmic curation of content. Understanding how algorithms shape what you see \u2014 promoting engagement over accuracy, emotion over nuance \u2014 is a critical media literacy skill. When you write for social media, you are participating in a public discourse that has real consequences for yourself and others."},
      {"type": "text",
        "content": "Consider the rhetorical differences between a carefully crafted essay and a spontaneous social media post. The essay goes through multiple drafts, has a defined audience, and is evaluated by specific criteria. A social media post is immediate, public, and judged by engagement metrics rather than analytical depth. Understanding these differences helps you navigate digital spaces with greater intention and awareness. It also helps you recognize when social media rhetoric is being used to manipulate your emotions or distort your understanding of an issue."},
      {"type": "heading", "level": 2,
        "content": "Visual Literacy"},
      {"type": "text",
        "content": "Visual literacy is the ability to read, interpret, and create visual texts. Photographs, infographics, charts, film sequences, and graphic designs all communicate meaning through visual elements such as colour, composition, framing, and symbolism. A photograph of the Saskatchewan prairie taken from ground level, looking up at an enormous sky, communicates something very different from the same landscape photographed from directly above, showing geometric patterns of farmland stretching to the horizon. Learning to analyze visual texts with the same rigor you apply to written texts is an essential component of modern literacy."},
      {"type": "callout", "style": "info",
        "content": "Indigenous communities in Saskatchewan have embraced digital media as a tool for language revitalization, cultural preservation, and community connection. Apps for learning Cree, Saulteaux, and other languages, online archives of Elder teachings, and social media campaigns celebrating Indigenous identity demonstrate that digital literacy and cultural literacy can work together in powerful and innovative ways."},
      {"type": "heading", "level": 2,
        "content": "Misinformation and Disinformation"},
      {"type": "text",
        "content": "Media literacy also requires understanding the difference between misinformation (false information spread without intent to deceive, often through carelessness or misunderstanding) and disinformation (false information deliberately created and spread to mislead). Both are serious challenges in the digital age. To guard against misinformation, verify claims across multiple credible sources, check the original source of viral content, be skeptical of emotional appeals that discourage critical thinking, and be willing to change your mind when presented with credible evidence. Media literate citizens do not share content without first evaluating its accuracy and potential impact."},
      {"type": "quiz",
        "question": "What is the primary goal of media literacy?",
        "options": ["To reject all forms of media", "To engage with media thoughtfully and critically, understanding how messages are constructed", "To create viral social media content", "To memorize the names of media companies"],
        "correct": 1,
        "explanation": "Media literacy is about engaging with media thoughtfully and critically \u2014 understanding who creates messages, what techniques they use, what values they promote, and what they leave out. It is about discernment, not rejection."},
      {"type": "quiz",
        "question": "How do social media algorithms affect the information you see?",
        "options": ["They show content in strictly chronological order", "They prioritize content that generates engagement, which may favour emotional or sensational material over nuanced information", "They have no effect on what content is displayed", "They only show content from verified, credible sources"],
        "correct": 1,
        "explanation": "Social media algorithms prioritize content that generates engagement \u2014 likes, shares, comments. This can favour emotional, sensational, or controversial material over nuanced, accurate information, creating a distorted picture of events and issues."}
    ]'::jsonb,
    '[
      {"term": "Media Literacy",
        "definition": "The ability to access, analyze, evaluate, and create media in a variety of forms."},
      {"term": "Digital Composition",
        "definition": "Writing that uses digital tools and platforms to combine text with images, audio, video, and interactive elements."},
      {"term": "Algorithm",
        "definition": "A set of rules or calculations used by social media platforms to determine what content is displayed to users."},
      {"term": "Visual Literacy",
        "definition": "The ability to read, interpret, and create meaning from visual texts such as photographs, films, and infographics."},
      {"term": "Affordance",
        "definition": "The possibilities for action that a particular tool, medium, or platform offers to a user or creator."},
      {"term": "Misinformation",
        "definition": "False or inaccurate information spread without intent to deceive, often through carelessness or misunderstanding."},
      {"term": "Disinformation",
        "definition": "False information deliberately created and spread with the intent to mislead or manipulate."},
      {"term": "Infographic",
        "definition": "A visual representation of information or data, designed to communicate complex ideas quickly and clearly."}
    ]'::jsonb,
    'Indigenous communities in Saskatchewan have embraced digital media as a tool for language revitalization, cultural preservation, and community connection. Apps for learning Cree, Saulteaux, and other languages, online archives of Elder teachings, and social media campaigns celebrating Indigenous identity demonstrate that digital literacy and cultural literacy can work together in powerful ways.',
    30, false
  ) ON CONFLICT (textbook_id, chapter_number) DO NOTHING;


  -- ========================================================================
  -- CHAPTER 10: Academic Writing & Critical Thinking
  -- ========================================================================
  INSERT INTO textbook_chapters (
    tenant_id, textbook_id, unit_id, chapter_number, title, slug,
    description, content, key_terms, indigenous_connection,
    estimated_minutes, is_published
  ) VALUES (
    v_tenant, v_book, NULL, 10,
    'Academic Writing & Critical Thinking',
    'academic-writing-critical-thinking',
    'Master essay structure, literary analysis, synthesis papers, and academic voice for post-secondary readiness.',
    '[
      {"type": "heading", "level": 1,
        "content": "Academic Writing & Critical Thinking"},
      {"type": "text",
        "content": "Academic writing is formal, evidence-based writing produced for scholarly and educational contexts. It demands clarity, precision, logical reasoning, and proper attribution of sources. Whether you are writing a literary analysis, a research essay, or a synthesis paper, academic writing requires you to engage critically with ideas \u2014 not simply to summarize what others have said, but to develop and defend your own informed position. Mastering academic writing in high school prepares you for success in post-secondary education and in any career that requires clear, analytical communication."},
      {"type": "callout", "style": "info",
        "content": "Academic voice is not about using complicated words or long sentences. It is about being precise, objective, and well-supported. Write to be understood, not to impress. The clearest writing is usually the most effective."},
      {"type": "heading", "level": 2,
        "content": "Essay Structure"},
      {"type": "text",
        "content": "A well-structured academic essay follows a clear pattern: an introduction that establishes context and presents a thesis, body paragraphs that develop and support the thesis with evidence and analysis, and a conclusion that synthesizes the argument and considers its broader implications. Each body paragraph should focus on one main idea, stated in a topic sentence, and should include evidence, analysis, and a transition to the next paragraph. The five-paragraph essay is a useful starting framework, but senior-level writing often requires more flexibility \u2014 you may need four body paragraphs, or seven, depending on the complexity of your argument."},
      {"type": "list", "ordered": true,
        "items": ["Introduction: hook the reader, establish context, and present your thesis statement", "Body paragraphs: topic sentence, evidence, analysis, and transition to the next paragraph", "Conclusion: synthesize (do not just restate) the argument, consider broader implications, and leave the reader with a final thought", "Each paragraph should develop one main idea fully with specific evidence and analysis", "Transitions between paragraphs should show the logical connection between ideas"]},
      {"type": "heading", "level": 2,
        "content": "Literary Analysis"},
      {"type": "text",
        "content": "Literary analysis is the close examination of a literary work \u2014 its themes, characters, structure, language, and techniques \u2014 in order to develop an interpretive argument about what the work means and how it achieves its effects. A literary analysis is not a book report or a summary; it is an argument. Your thesis should make a specific, debatable claim about the text \u2014 for example, arguing that a particular narrative technique creates a specific effect on the reader, or that a recurring image illuminates the central theme."},
      {"type": "text",
        "content": "Every claim in a literary analysis must be supported with specific evidence from the text itself. Evidence in literary analysis takes the form of brief references to specific moments, details, or patterns in the work. After presenting evidence, you must analyze it \u2014 explain how it supports your claim. The claim-evidence-analysis structure is the building block of strong literary analysis. Avoid plot summary; assume your reader has read the text and focus on interpretation rather than recounting events."},
      {"type": "callout", "style": "tip",
        "content": "Literary analysis framework: (1) Make a claim about the text. (2) Provide specific evidence \u2014 a brief reference to a particular detail, image, or moment. (3) Analyze: explain how the evidence supports your claim and why it matters. Repeat this pattern in every body paragraph."},
      {"type": "heading", "level": 2,
        "content": "Synthesis Papers"},
      {"type": "text",
        "content": "A synthesis paper combines ideas from multiple sources to build a unified argument or analysis. Unlike a research paper that might focus on a single question, a synthesis paper asks you to find connections, tensions, and patterns across sources. For example, you might synthesize three different critical perspectives on a novel to argue that the text resists simple interpretation, or you might combine historical, scientific, and literary sources to build a multifaceted analysis of an environmental issue in Saskatchewan. The key skill is integration \u2014 weaving sources together rather than presenting them one at a time in a series of summaries."},
      {"type": "heading", "level": 2,
        "content": "Academic Voice and Conventions"},
      {"type": "text",
        "content": "Academic voice is characterized by objectivity, precision, and formality. Avoid first-person declarations of opinion (I think, I believe) in favour of evidence-based claims (the evidence suggests, the data demonstrates). Use discipline-specific vocabulary accurately. Avoid contractions, slang, and colloquial language. Write in complete, well-constructed sentences. However, academic voice does not mean lifeless writing \u2014 the best academic writing is engaging, well-crafted, and even elegant. The goal is not to remove your voice but to channel it through the conventions of scholarly communication."},
      {"type": "text",
        "content": "Common pitfalls in academic writing include: relying on plot summary instead of analysis, making claims without supporting evidence, using vague language (things, stuff, a lot, very), failing to address counterarguments, beginning body paragraphs without clear topic sentences, and concluding by simply restating the introduction rather than synthesizing the argument. Be aware of these tendencies and revise specifically to address them."},
      {"type": "callout", "style": "tip",
        "content": "Revision checklist for academic essays: (1) Does every paragraph have a clear topic sentence? (2) Is every claim supported by specific evidence? (3) Does the analysis explain how the evidence supports the claim? (4) Are all sources properly cited? (5) Does the conclusion go beyond restating the thesis to offer synthesis or broader implications?"},
      {"type": "callout", "style": "info",
        "content": "Academic writing about Indigenous topics requires particular care and humility. Centre Indigenous voices and scholarship. Avoid treating Indigenous peoples as subjects to be studied from the outside \u2014 seek out scholarship by Indigenous academics and critics. Writers such as Dr. Winona Wheeler (Cree, from George Gordon First Nation in Saskatchewan) have contributed important scholarship on Indigenous history and knowledge systems that should be prioritized."},
      {"type": "quiz",
        "question": "What is the key difference between a literary analysis and a book summary?",
        "options": ["A literary analysis is longer than a summary", "A literary analysis makes a specific, debatable interpretive argument about a text; a summary simply recounts what happens", "A summary uses evidence from the text; a literary analysis does not", "There is no difference between the two forms of writing"],
        "correct": 1,
        "explanation": "A literary analysis makes a specific, debatable claim about a text \u2014 its themes, techniques, or effects \u2014 and supports that claim with evidence and analysis. A summary simply recounts the events or content of the text without interpretation."},
      {"type": "quiz",
        "question": "Which of the following best describes academic voice?",
        "options": ["Writing that uses the most complex vocabulary possible", "Writing that is objective, precise, formal, and supported by evidence", "Writing that avoids making any claims or arguments", "Writing that relies primarily on personal opinion and experience"],
        "correct": 1,
        "explanation": "Academic voice is characterized by objectivity, precision, formality, and evidence-based reasoning. It channels the writer''s ideas through the conventions of scholarly communication without sacrificing clarity or engagement."}
    ]'::jsonb,
    '[
      {"term": "Academic Writing",
        "definition": "Formal, evidence-based writing produced for scholarly and educational contexts, characterized by precision, objectivity, and proper attribution."},
      {"term": "Literary Analysis",
        "definition": "The close examination of a literary work to develop an interpretive argument about its meaning, techniques, and effects."},
      {"term": "Synthesis Paper",
        "definition": "A paper that combines ideas from multiple sources to build a unified argument, identifying connections and patterns across sources."},
      {"term": "Topic Sentence",
        "definition": "The sentence in a paragraph that states the paragraph''s main idea, typically appearing near the beginning."},
      {"term": "Academic Voice",
        "definition": "A writing style characterized by objectivity, precision, formality, and reliance on evidence rather than personal opinion."},
      {"term": "Thesis Statement",
        "definition": "The central claim of an essay \u2014 a specific, debatable position that the writer will defend with evidence and analysis."},
      {"term": "Textual Evidence",
        "definition": "Specific details, references, or brief passages from a text used to support an analytical claim."},
      {"term": "Critical Thinking",
        "definition": "The process of analyzing, evaluating, and synthesizing information to form well-reasoned judgments and interpretations."}
    ]'::jsonb,
    'Academic writing about Indigenous topics requires particular care and humility. Centre Indigenous voices and scholarship. Avoid treating Indigenous peoples as subjects to be studied from the outside — seek out scholarship by Indigenous academics and critics. Writers such as Dr. Winona Wheeler (Cree, from George Gordon First Nation in Saskatchewan) have contributed important scholarship on Indigenous history and knowledge systems that should be prioritized in academic research.',
    30, false
  ) ON CONFLICT (textbook_id, chapter_number) DO NOTHING;


  -- ========================================================================
  -- CHAPTER 11: Presentation & Communication
  -- ========================================================================
  INSERT INTO textbook_chapters (
    tenant_id, textbook_id, unit_id, chapter_number, title, slug,
    description, content, key_terms, indigenous_connection,
    estimated_minutes, is_published
  ) VALUES (
    v_tenant, v_book, NULL, 11,
    'Presentation & Communication',
    'presentation-communication',
    'Develop skills in public speaking, debate, multimedia presentations, and active listening for academic and professional contexts.',
    '[
      {"type": "heading", "level": 1,
        "content": "Presentation & Communication"},
      {"type": "text",
        "content": "Communication is not only about writing \u2014 it is also about speaking, listening, and presenting ideas effectively to a live audience. Public speaking, debate, and multimedia presentation are skills that serve you in school, in the workplace, and in civic life. Whether you are delivering a formal speech, defending a position in a debate, presenting research findings to your class, or facilitating a community discussion, the principles of effective communication remain the same: know your audience, organize your ideas clearly, support your claims with evidence, and deliver your message with confidence and authenticity."},
      {"type": "heading", "level": 2,
        "content": "Public Speaking Fundamentals"},
      {"type": "text",
        "content": "Effective public speaking begins long before you step in front of an audience. Preparation includes researching your topic thoroughly, organizing your ideas into a clear structure (introduction, body, and conclusion, just like an essay), and practising your delivery multiple times. When speaking, make eye contact with your audience \u2014 not with your notes or your slides. Vary your pace, volume, and pitch to maintain interest and emphasize key points. Use pauses strategically: a moment of silence before or after an important point gives the audience time to absorb what you have said."},
      {"type": "callout", "style": "tip",
        "content": "Stage fright is normal and even experienced speakers feel nervous before a presentation. Channel that nervous energy into enthusiasm for your topic. The more thoroughly you prepare and practise, the more confident you will feel. Remember that your audience wants you to succeed \u2014 they are there to learn from you, not to judge you."},
      {"type": "list", "ordered": true,
        "items": ["Research your topic thoroughly before preparing your speech", "Organize ideas with a clear introduction, body, and conclusion", "Practise aloud multiple times, ideally in front of a test audience or while recording yourself", "Make eye contact with different sections of your audience", "Vary pace, volume, and pitch to maintain engagement and emphasize key ideas", "Use strategic pauses for emphasis and to allow audience processing time", "Keep visual aids simple and supportive \u2014 they should enhance your speech, not replace it", "Anticipate questions and prepare thoughtful responses"]},
      {"type": "heading", "level": 2,
        "content": "Debate and Argumentation"},
      {"type": "text",
        "content": "Debate is structured argumentation. In a formal debate, two sides take opposing positions on a resolution and present their arguments to an audience or panel of judges. Debate develops critical thinking, quick reasoning, and the ability to construct and deconstruct arguments under pressure. When preparing for a debate, research both sides of the issue \u2014 you need to understand the strongest arguments for the opposing position in order to refute them effectively. During a debate, listen carefully to your opponents and respond to their specific arguments rather than delivering a prepared speech that ignores what has been said."},
      {"type": "text",
        "content": "In Saskatchewan classrooms, debates on local and national issues \u2014 water rights, agricultural policy, Treaty implementation, language revitalization, rural healthcare access \u2014 give students the opportunity to engage with real questions that affect their communities. Debating these issues develops not only speaking skills but also empathy, research ability, and the capacity to hold multiple perspectives simultaneously."},
      {"type": "heading", "level": 2,
        "content": "Multimedia Presentations"},
      {"type": "text",
        "content": "A multimedia presentation combines spoken delivery with visual, audio, or interactive elements. Slide decks, video clips, audio recordings, live demonstrations, and digital tools can all enhance a presentation \u2014 but only if used purposefully. The most common mistake in multimedia presentations is putting too much text on slides. Your slides should support your speech, not replace it. Use images, charts, and key phrases rather than full paragraphs. The audience should be listening to you, not reading your slides. Design slides with high contrast, readable fonts, and minimal visual clutter."},
      {"type": "callout", "style": "tip",
        "content": "Slide design principles: (1) One main idea per slide. (2) Use images and charts instead of text blocks. (3) Limit text to key phrases or short bullet points. (4) Choose readable fonts at a large size (minimum 24pt). (5) Maintain consistent design throughout. (6) Test your presentation on the actual screen or projector you will use."},
      {"type": "heading", "level": 2,
        "content": "Active Listening"},
      {"type": "text",
        "content": "Communication is not only about speaking \u2014 it is equally about listening. Active listening means giving your full attention to the speaker, processing what they are saying, and responding thoughtfully. In academic discussions, active listening involves taking notes on key points, asking clarifying questions, building on others'' ideas, connecting what is being said to what you already know, and waiting for the speaker to finish before formulating your response."},
      {"type": "text",
        "content": "Active listening is a skill that can be practised and improved. In your next class discussion, challenge yourself to take notes on three key points made by classmates before offering your own perspective. When you do respond, begin by acknowledging what the previous speaker said before adding your own ideas. This practice builds a collaborative conversation rather than a series of unconnected statements."},
      {"type": "callout", "style": "info",
        "content": "In many First Nations traditions, listening is considered a sacred responsibility. The practice of sitting in circle and allowing each person to speak without interruption reflects a deep respect for the voice and perspective of every community member. Elders often teach that you have two ears and one mouth because you should listen twice as much as you speak. This protocol offers a powerful model for classroom discussions and presentations."},
      {"type": "quiz",
        "question": "What is the most common mistake in multimedia presentations?",
        "options": ["Using too many images", "Speaking too quietly", "Putting too much text on slides so the audience reads instead of listens", "Making the presentation too short"],
        "correct": 2,
        "explanation": "The most common mistake is overloading slides with text. Slides should support the speaker''s delivery with key phrases, images, and charts \u2014 not replace the spoken presentation with walls of text."},
      {"type": "quiz",
        "question": "What does active listening involve?",
        "options": ["Waiting for your turn to speak while mentally preparing your response", "Giving full attention to the speaker, processing their ideas, and responding thoughtfully", "Interrupting the speaker to show engagement", "Taking notes without paying attention to the speaker''s words"],
        "correct": 1,
        "explanation": "Active listening means giving your full attention to the speaker, processing what they are saying, and responding thoughtfully \u2014 including asking clarifying questions, taking notes, and building on their ideas."}
    ]'::jsonb,
    '[
      {"term": "Public Speaking",
        "definition": "The act of delivering a speech or presentation to a live audience."},
      {"term": "Debate",
        "definition": "A structured form of argumentation in which opposing sides present and defend their positions on a specific resolution."},
      {"term": "Resolution",
        "definition": "In debate, the specific statement or proposition that the teams argue for or against."},
      {"term": "Rebuttal",
        "definition": "A response to an opponent''s argument that challenges or disproves their claims with evidence and reasoning."},
      {"term": "Multimedia Presentation",
        "definition": "A presentation that combines spoken delivery with visual, audio, or interactive elements to communicate a message."},
      {"term": "Active Listening",
        "definition": "The practice of giving full attention to a speaker, processing their ideas, and responding thoughtfully and constructively."},
      {"term": "Nonverbal Communication",
        "definition": "Communication through body language, facial expressions, gestures, eye contact, and posture rather than words."},
      {"term": "Talking Circle",
        "definition": "A practice in many First Nations communities in which a group sits in a circle and each person speaks in turn, without interruption."}
    ]'::jsonb,
    'Indigenous communication traditions emphasize the importance of listening as a form of respect and learning. In many First Nations communities, the talking circle is a practice in which a group sits in a circle and each person speaks in turn, holding a sacred object that signifies the right to speak. Others listen without interruption. This practice cultivates deep listening, patience, and respect for diverse perspectives — values that strengthen any form of communication.',
    25, false
  ) ON CONFLICT (textbook_id, chapter_number) DO NOTHING;


  -- ========================================================================
  -- CHAPTER 12: Portfolio Development & Reflection
  -- ========================================================================
  INSERT INTO textbook_chapters (
    tenant_id, textbook_id, unit_id, chapter_number, title, slug,
    description, content, key_terms, indigenous_connection,
    estimated_minutes, is_published
  ) VALUES (
    v_tenant, v_book, NULL, 12,
    'Portfolio Development & Reflection',
    'portfolio-development-reflection',
    'Learn self-assessment, revision strategies, growth mindset, and capstone project development to showcase your growth as a writer and thinker.',
    '[
      {"type": "heading", "level": 1,
        "content": "Portfolio Development & Reflection"},
      {"type": "text",
        "content": "A writing portfolio is a curated collection of your best work, accompanied by reflective commentary that demonstrates your growth as a writer and thinker. Unlike a folder of completed assignments, a portfolio is intentional \u2014 you select pieces that represent your strongest writing, your most significant growth, and your deepest engagement with ideas. Portfolio development is the capstone of a senior language arts course because it requires you to look back on everything you have learned and articulate how you have changed as a communicator."},
      {"type": "callout", "style": "info",
        "content": "A portfolio tells the story of your development as a writer. The reflective commentary is just as important as the writing samples \u2014 it shows that you can evaluate your own work with honesty, specificity, and insight."},
      {"type": "heading", "level": 2,
        "content": "Selecting Portfolio Pieces"},
      {"type": "text",
        "content": "Choosing which pieces to include in your portfolio is itself an act of critical thinking. Consider including a range of genres and purposes \u2014 a narrative, an analytical essay, a persuasive piece, a research project, and a creative or spoken word work. Select pieces that demonstrate different skills and strengths. You might also choose to include a piece that was particularly challenging \u2014 even if it is not your best polished work, it may represent significant growth or risk-taking. Accompany each selection with a brief explanation of why you chose it and what it demonstrates about your abilities."},
      {"type": "heading", "level": 2,
        "content": "Self-Assessment"},
      {"type": "text",
        "content": "Self-assessment is the ability to evaluate your own work honestly and constructively. It requires stepping outside your perspective as the writer and reading your work as a critical reader would. When assessing your own writing, consider: What was I trying to achieve in this piece? Did I succeed? What are its strongest elements? Where does it fall short? What would I do differently if I revised it today? Self-assessment is not about being harsh or self-critical \u2014 it is about being honest and specific. The ability to identify your own strengths and weaknesses is one of the most important skills you can develop, both as a writer and as a lifelong learner."},
      {"type": "list", "ordered": true,
        "items": ["Identify your purpose and evaluate whether the piece achieves it", "Recognize the strongest elements of your writing (voice, structure, evidence, imagery, argumentation)", "Identify areas for improvement with specific, constructive observations \u2014 not just it could be better", "Compare earlier and later drafts to see how revision improved the work", "Set specific, actionable goals for your future writing based on patterns you notice across your work"]},
      {"type": "heading", "level": 2,
        "content": "Revision Strategies for Portfolio Preparation"},
      {"type": "text",
        "content": "At the portfolio stage, revision is not just about fixing individual pieces \u2014 it is about looking across your body of work and identifying patterns. Do you tend to write strong introductions but weak conclusions? Do you struggle with integrating evidence smoothly? Do your essays lack variety in sentence structure? Identifying these patterns allows you to revise strategically, focusing your energy where it will have the greatest impact. Revision strategies include reading aloud (to catch awkward phrasing), peer review (to get an outside perspective), reverse outlining (to check structure), and targeted editing passes focused on specific elements like transitions or evidence integration."},
      {"type": "callout", "style": "tip",
        "content": "Revision strategy \u2014 reverse outlining: After completing a draft, create an outline by writing down the main idea of each paragraph. Then examine the outline: Is the logic clear? Are there gaps in the argument? Do any paragraphs wander from the main idea? Are paragraphs in the most effective order? This technique reveals structural problems that are hard to see when reading the full text."},
      {"type": "text",
        "content": "Another powerful revision strategy is to read your work from the perspective of a specific audience member. If you are writing a persuasive essay about rural internet access in Saskatchewan, imagine reading it as a government policy analyst, then as a farmer in a remote community, then as a teenager in Saskatoon. Each perspective reveals different strengths and gaps in your argument. This empathetic revision helps you anticipate objections, fill in missing context, and sharpen your rhetoric."},
      {"type": "heading", "level": 2,
        "content": "Growth Mindset and Writing"},
      {"type": "text",
        "content": "A growth mindset is the belief that abilities can be developed through effort, practice, and learning from mistakes. In writing, a growth mindset means understanding that struggle is a normal part of the process \u2014 every professional writer has experienced frustration, self-doubt, and the challenge of making an idea work on the page. What distinguishes effective writers is not the absence of difficulty but the willingness to persist, to revise, and to seek feedback. Your portfolio should reflect this journey. Including an earlier draft alongside a revised version, with reflective commentary about what changed and why, demonstrates growth more powerfully than a polished final product alone."},
      {"type": "heading", "level": 2,
        "content": "The Capstone Project"},
      {"type": "text",
        "content": "A capstone project is a culminating piece of work that demonstrates the full range of skills you have developed throughout the course. It might take the form of an extended research essay, a collection of original creative writing, a multimedia presentation on a topic of personal significance, or a community-engaged project that applies your writing and communication skills to a real-world context. The capstone project should reflect your interests, your growth, and your voice. It should be ambitious \u2014 pushing you beyond what you have done before \u2014 and it should be accompanied by a reflective essay that explains your process, your choices, and your learning."},
      {"type": "callout", "style": "tip",
        "content": "Capstone project ideas for Saskatchewan students: (1) A researched essay on the history and future of a local community, river, or landmark. (2) A collection of original poetry exploring place and identity on the prairies. (3) A multimedia documentary about a Treaty education topic. (4) A community newsletter or magazine featuring original journalism and creative writing. (5) A spoken word performance with written reflection on the creative process. (6) A comparative analysis of how a Saskatchewan issue is represented across different media."},
      {"type": "heading", "level": 2,
        "content": "Reflective Writing"},
      {"type": "text",
        "content": "Reflective writing is a genre of its own. It asks you to examine your own learning process with honesty and specificity. A strong reflection does not simply say I learned a lot in this course or I became a better writer. It identifies specific moments of growth, specific challenges overcome, and specific skills developed. It uses concrete examples from your own work. A strong portfolio reflection might describe how you struggled to write a thesis statement for your persuasive essay, how peer feedback helped you identify that your thesis was a statement of fact rather than a debatable claim, and how the revision process taught you to think about thesis development differently."},
      {"type": "text",
        "content": "Reflective writing also asks you to look forward. Based on what you have learned about yourself as a writer, what goals do you want to set for the future? What skills do you want to continue developing? What genres or forms do you want to explore? A portfolio that ends with specific, honest goals demonstrates the kind of self-awareness and commitment to growth that marks a mature, thoughtful learner."},
      {"type": "callout", "style": "info",
        "content": "In many Indigenous traditions, knowledge is understood as a journey rather than a destination. The concept of lifelong learning \u2014 always growing, always seeking understanding \u2014 aligns powerfully with the portfolio approach to education. A portfolio, like a journey, is not about arriving at a final answer but about reflecting on where you have been and where you are going. This understanding invites students to approach their own learning with humility, curiosity, and gratitude."},
      {"type": "quiz",
        "question": "What is the purpose of reflective commentary in a writing portfolio?",
        "options": ["To summarize the content of each writing sample", "To demonstrate awareness of your own growth, strengths, and areas for improvement as a writer", "To explain what grade you think you deserve", "To list the assignments you completed during the course"],
        "correct": 1,
        "explanation": "Reflective commentary demonstrates self-awareness about your development as a writer. It identifies specific moments of growth, challenges overcome, and skills developed, using concrete examples from your own work."},
      {"type": "quiz",
        "question": "What is a reverse outline, and how does it help with revision?",
        "options": ["An outline written before drafting to plan the essay", "An outline created from a finished draft by identifying the main idea of each paragraph, used to check the logical structure", "A list of sources used in the essay", "A summary of the essay written by a peer reviewer"],
        "correct": 1,
        "explanation": "A reverse outline is created from a finished draft by writing down the main idea of each paragraph. It reveals the actual structure of the essay, making it easy to identify gaps, redundancies, or logical problems that are hard to see when reading paragraph by paragraph."}
    ]'::jsonb,
    '[
      {"term": "Portfolio",
        "definition": "A curated collection of a writer''s best work, accompanied by reflective commentary that demonstrates growth and self-awareness."},
      {"term": "Self-Assessment",
        "definition": "The process of evaluating your own work honestly and constructively, identifying strengths and areas for improvement."},
      {"term": "Growth Mindset",
        "definition": "The belief that abilities can be developed through effort, practice, and learning from mistakes."},
      {"term": "Capstone Project",
        "definition": "A culminating piece of work that demonstrates the full range of skills developed throughout a course."},
      {"term": "Reflective Writing",
        "definition": "A genre of writing that examines the writer''s own learning process, choices, and development with honesty and specificity."},
      {"term": "Reverse Outline",
        "definition": "An outline created from a finished draft by identifying the main idea of each paragraph, used to evaluate logical structure."},
      {"term": "Peer Review",
        "definition": "The process of having a classmate or colleague read and provide constructive feedback on your writing."},
      {"term": "Revision",
        "definition": "The process of rethinking and restructuring a draft to improve its overall effectiveness, distinct from editing for surface errors."}
    ]'::jsonb,
    'In many Indigenous traditions, knowledge is understood as a journey rather than a destination. The concept of lifelong learning — always growing, always seeking understanding — aligns powerfully with the portfolio approach to education. A portfolio, like a journey, is not about arriving at a final answer but about reflecting on where you have been and where you are going. This understanding invites students to approach their own learning with humility, curiosity, and gratitude.',
    25, false
  ) ON CONFLICT (textbook_id, chapter_number) DO NOTHING;

  RAISE NOTICE 'WolfWhale Language & Writing 20/30 — all 12 chapters seeded successfully.';
END $$;
