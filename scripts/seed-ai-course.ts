/**
 * seed-ai-course.ts
 *
 * Seeds the "AI for Educators: Mastering Claude Code" course into every
 * active tenant in the WolfWhale LMS. Creates modules, lessons with rich
 * content blocks, enrolls all students, and generates a class code.
 *
 * Run: npx tsx scripts/seed-ai-course.ts
 *
 * Idempotent — safe to run multiple times. Skips tenants that already
 * have this course.
 */

import * as dotenv from "dotenv";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// ENV
// ---------------------------------------------------------------------------
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function log(msg: string) {
  console.log(`[seed-ai] ${msg}`);
}

function generateClassCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// ---------------------------------------------------------------------------
// Course metadata
// ---------------------------------------------------------------------------
const COURSE_NAME = "AI for Educators: Mastering Claude Code";
const COURSE_SLUG = "ai-for-educators";

const COURSE_DESCRIPTION =
  "A comprehensive beginner course designed for educators who want to harness AI in their teaching practice. Learn to use Claude Code for curriculum design, lesson planning, assessment creation, workflow automation, and more — all while maintaining ethical standards and protecting student privacy.";

// ---------------------------------------------------------------------------
// Module & Lesson definitions
// ---------------------------------------------------------------------------
interface LessonDef {
  title: string;
  description: string;
  duration: number;
  objectives: string[];
  content: object[];
}

interface ModuleDef {
  title: string;
  description: string;
  lessons: LessonDef[];
}

const modules: ModuleDef[] = [
  // ===== MODULE 1: What is AI? =====
  {
    title: "What is AI?",
    description:
      "Understand the fundamentals of artificial intelligence, how large language models work, and why AI literacy matters for educators.",
    lessons: [
      {
        title: "Introduction to Artificial Intelligence",
        description:
          "Explore the history and fundamentals of AI, from early computing to modern machine learning systems that are transforming education and every industry.",
        duration: 25,
        objectives: [
          "Define artificial intelligence and distinguish it from traditional software",
          "Identify key milestones in AI history",
          "Recognize everyday applications of AI in education",
        ],
        content: [
          {
            type: "heading",
            text: "What Exactly Is Artificial Intelligence?",
            level: 2,
          },
          {
            type: "text",
            body: "Artificial intelligence (AI) refers to computer systems designed to perform tasks that typically require human intelligence — understanding language, recognizing patterns, making decisions, and generating content. Unlike traditional software that follows rigid if-then rules, AI systems learn from vast amounts of data to make predictions and generate responses.",
          },
          {
            type: "text",
            body: "AI is not new. The term was coined in 1956 at Dartmouth College. But recent breakthroughs in computing power, data availability, and a technique called deep learning have made AI dramatically more capable. In 2022-2023, large language models (LLMs) like Claude brought AI into mainstream daily use for the first time.",
          },
          {
            type: "heading",
            text: "AI in Your Daily Life",
            level: 3,
          },
          {
            type: "text",
            body: "You already interact with AI every day, often without realizing it. Spell-check in your documents, email spam filters, voice assistants like Siri, Netflix recommendations, Google search results — all are powered by AI. In education specifically, AI already helps with adaptive learning platforms, automated essay scoring, and language translation tools.",
          },
          {
            type: "callout",
            text: "<strong>Key Insight:</strong> AI is a tool, not a replacement for teachers. The most powerful applications of AI in education amplify what great teachers already do — personalize learning, provide timely feedback, and free up time for the human connections that matter most.",
            variant: "tip",
          },
          {
            type: "heading",
            text: "Types of AI",
            level: 3,
          },
          {
            type: "text",
            body: "<strong>Narrow AI</strong> (what we have today) excels at specific tasks — playing chess, translating languages, generating text. It cannot transfer skills between domains. <strong>General AI</strong> (hypothetical) would match human-level reasoning across all domains. We are firmly in the era of narrow AI, but these narrow systems are extraordinarily capable within their specialties.",
          },
          {
            type: "text",
            body: "For educators, the most relevant AI category is <strong>generative AI</strong> — systems that create new content (text, images, code) based on patterns learned from training data. Claude, the AI assistant you will learn to use in this course, is a generative AI built by Anthropic.",
          },
        ],
      },
      {
        title: "How Large Language Models Work",
        description:
          "Peek under the hood of AI systems like Claude. Understand tokens, training, context windows, and why LLMs sometimes make mistakes.",
        duration: 30,
        objectives: [
          "Explain how large language models process and generate text",
          "Understand the concepts of tokens, training data, and context windows",
          "Identify why LLMs can produce incorrect or biased outputs",
        ],
        content: [
          {
            type: "heading",
            text: "The Engine Behind Claude",
            level: 2,
          },
          {
            type: "text",
            body: "Large language models (LLMs) are AI systems trained on enormous amounts of text data — books, articles, websites, and more. Through this training, they learn patterns in language: grammar, facts, reasoning styles, and even creativity. When you ask Claude a question, it does not look up an answer in a database. Instead, it generates a response word by word, predicting the most likely and helpful next word based on everything it has learned.",
          },
          {
            type: "heading",
            text: "Tokens: The Building Blocks",
            level: 3,
          },
          {
            type: "text",
            body: "LLMs do not read words the way humans do. They break text into <strong>tokens</strong> — chunks that might be whole words, parts of words, or punctuation. For example, the word 'understanding' might be split into 'under' and 'standing'. On average, one token equals roughly three-quarters of a word. This matters because every LLM has a <strong>context window</strong> — the maximum number of tokens it can process at once (your prompt plus its response).",
          },
          {
            type: "heading",
            text: "Training: Learning from Text",
            level: 3,
          },
          {
            type: "text",
            body: "Training an LLM involves two main phases. <strong>Pre-training</strong> exposes the model to trillions of words from the internet and books, teaching it language patterns and general knowledge. <strong>Fine-tuning</strong> then refines the model with human feedback to make it helpful, honest, and harmless. Claude's training by Anthropic places special emphasis on safety and helpfulness.",
          },
          {
            type: "callout",
            text: "<strong>Important:</strong> LLMs do not have access to the internet. Their knowledge comes from training data with a cutoff date. They can also 'hallucinate' — generate plausible-sounding but incorrect information. Always verify critical facts, especially dates, statistics, and citations.",
            variant: "warning",
          },
          {
            type: "text",
            body: "Understanding these limitations is what separates effective AI users from frustrated ones. When you know how the model works, you can craft better prompts, catch errors, and get dramatically better results.",
          },
        ],
      },
      {
        title: "The AI Revolution in Education",
        description:
          "Explore how AI is reshaping education worldwide — from personalized learning to administrative efficiency — and what it means for your role as an educator.",
        duration: 25,
        objectives: [
          "Identify five key areas where AI is transforming education",
          "Evaluate the benefits and risks of AI adoption in schools",
          "Articulate a vision for AI-enhanced teaching in your context",
        ],
        content: [
          {
            type: "heading",
            text: "Five Ways AI Is Changing Education",
            level: 2,
          },
          {
            type: "text",
            body: "AI is not a distant future technology for education — it is here now, and it is reshaping how teachers teach and students learn. Here are the five most significant areas of impact:",
          },
          {
            type: "text",
            body: "<strong>1. Personalized Learning.</strong> AI can help teachers create differentiated materials for students at different levels. Instead of one-size-fits-all worksheets, you can generate reading passages at multiple Lexile levels or math problems at varying difficulty in minutes.",
          },
          {
            type: "text",
            body: "<strong>2. Curriculum Development.</strong> Creating scope and sequence documents, aligning lessons to standards, and designing assessment rubrics — tasks that take hours — can be drafted in minutes with AI assistance.",
          },
          {
            type: "text",
            body: "<strong>3. Administrative Efficiency.</strong> Report card comments, email templates, meeting summaries, and documentation — AI can handle the repetitive writing that consumes teacher time.",
          },
          {
            type: "text",
            body: "<strong>4. Assessment Design.</strong> AI can generate diverse question types (multiple choice, short answer, rubric-scored tasks) aligned to specific learning objectives and Bloom's taxonomy levels.",
          },
          {
            type: "text",
            body: "<strong>5. Inclusive Education.</strong> AI can help translate materials, simplify language for ELL students, generate alternative explanations, and create materials that reflect diverse perspectives and cultures.",
          },
          {
            type: "callout",
            text: "<strong>Your Role Does Not Shrink — It Evolves.</strong> AI handles the production work so you can focus on what only humans can do: building relationships, inspiring curiosity, mentoring students through challenges, and making judgment calls about individual learners.",
            variant: "tip",
          },
        ],
      },
      {
        title: "Your AI Teaching Assistant: Meet Claude",
        description:
          "Get acquainted with Claude, the AI assistant built by Anthropic. Understand what makes Claude different, its strengths, and how to think about it as a teaching tool.",
        duration: 20,
        objectives: [
          "Describe Claude's key characteristics and strengths",
          "Understand the difference between Claude (web) and Claude Code (CLI)",
          "Set realistic expectations for what Claude can and cannot do",
        ],
        content: [
          {
            type: "heading",
            text: "Why Claude?",
            level: 2,
          },
          {
            type: "text",
            body: "Claude is an AI assistant built by Anthropic, a company focused on AI safety. What makes Claude stand out for educators is its emphasis on being <strong>helpful, harmless, and honest</strong>. Claude is designed to be straightforward about its limitations, decline harmful requests, and provide nuanced, thoughtful responses rather than superficial ones.",
          },
          {
            type: "heading",
            text: "Claude vs. Claude Code",
            level: 3,
          },
          {
            type: "text",
            body: "<strong>Claude</strong> (claude.ai) is the web-based chat interface. You type messages and get responses in your browser. Great for quick questions and conversations.",
          },
          {
            type: "text",
            body: "<strong>Claude Code</strong> is a command-line tool that lets you use Claude directly in your terminal. It can read files on your computer, write new files, execute commands, and work with your actual documents and projects. This makes it dramatically more powerful for real work like creating curriculum documents, processing student data, and building templates.",
          },
          {
            type: "callout",
            text: "<strong>Think of it this way:</strong> Claude (web) is like texting a knowledgeable colleague. Claude Code is like having that colleague sit at your desk, look at your actual files, and do the work alongside you.",
            variant: "tip",
          },
          {
            type: "heading",
            text: "What Claude Can Do for Educators",
            level: 3,
          },
          {
            type: "list",
            items: [
              "Draft lesson plans, unit plans, and scope & sequence documents",
              "Generate quizzes, rubrics, and assessment tools",
              "Write report card comments tailored to each student",
              "Create differentiated materials at multiple reading levels",
              "Explain complex concepts in student-friendly language",
              "Proofread and improve your professional writing",
              "Brainstorm creative classroom activities",
              "Help with data analysis and grade calculations",
            ],
          },
          {
            type: "text",
            body: "In the next module, you will install Claude Code and start using it immediately. Everything from here forward is hands-on and practical.",
          },
        ],
      },
    ],
  },

  // ===== MODULE 2: Getting Started with Claude Code =====
  {
    title: "Getting Started with Claude Code",
    description:
      "Install Claude Code, have your first conversation, and learn the fundamentals of writing effective prompts for educational tasks.",
    lessons: [
      {
        title: "Installing Claude Code",
        description:
          "Step-by-step guide to installing Claude Code on your computer. Covers macOS, Windows, and Linux with troubleshooting tips for common issues.",
        duration: 20,
        objectives: [
          "Install Claude Code on your computer",
          "Verify the installation is working correctly",
          "Understand system requirements and prerequisites",
        ],
        content: [
          {
            type: "heading",
            text: "Before You Begin",
            level: 2,
          },
          {
            type: "text",
            body: "Claude Code runs in your computer's terminal (also called command line or command prompt). You do not need to be a programmer to use it — we will walk through every step. You will need: a computer running macOS, Windows 10+, or Linux; an internet connection; and an Anthropic account (free to create).",
          },
          {
            type: "heading",
            text: "Step 1: Open Your Terminal",
            level: 3,
          },
          {
            type: "text",
            body: "<strong>On macOS:</strong> Open Spotlight (Cmd + Space), type 'Terminal', and press Enter. <strong>On Windows:</strong> Search for 'PowerShell' in the Start menu and open it. <strong>On Linux:</strong> Open your terminal application (usually Ctrl + Alt + T).",
          },
          {
            type: "heading",
            text: "Step 2: Install Node.js",
            level: 3,
          },
          {
            type: "text",
            body: "Claude Code requires Node.js (version 18 or later). Check if you have it by typing <code>node --version</code> in your terminal. If you see a version number starting with 18, 20, or 22, you are all set. If not, visit <strong>nodejs.org</strong> and download the LTS (Long Term Support) version. Run the installer and follow the prompts.",
          },
          {
            type: "heading",
            text: "Step 3: Install Claude Code",
            level: 3,
          },
          {
            type: "text",
            body: "In your terminal, type: <code>npm install -g @anthropic-ai/claude-code</code> and press Enter. This downloads and installs Claude Code globally on your computer. When it finishes, type <code>claude</code> to start your first session.",
          },
          {
            type: "callout",
            text: "<strong>Troubleshooting:</strong> If you get a 'permission denied' error on macOS/Linux, try <code>sudo npm install -g @anthropic-ai/claude-code</code> and enter your computer password. On Windows, run PowerShell as Administrator.",
            variant: "warning",
          },
          {
            type: "text",
            body: "Once you type <code>claude</code> and see the Claude Code prompt, you are ready to go. In the next lesson, you will have your first real conversation.",
          },
        ],
      },
      {
        title: "Your First Conversation with Claude",
        description:
          "Start using Claude Code for real educational tasks. Learn the interface, basic commands, and have your first productive conversation.",
        duration: 25,
        objectives: [
          "Navigate the Claude Code interface confidently",
          "Have a productive conversation about an educational topic",
          "Use basic commands like /help and /clear",
        ],
        content: [
          {
            type: "heading",
            text: "Welcome to Claude Code",
            level: 2,
          },
          {
            type: "text",
            body: "When you type <code>claude</code> in your terminal, you enter an interactive session. You will see a prompt where you can type messages, just like texting. But unlike texting, Claude Code can also read and write files on your computer, making it incredibly powerful for real work.",
          },
          {
            type: "heading",
            text: "Your First Prompt",
            level: 3,
          },
          {
            type: "text",
            body: "Let us start with something immediately useful. Type this at the prompt:",
          },
          {
            type: "callout",
            text: "Create a list of 5 engaging warm-up activities for a Grade 7 class that I can use at the start of any lesson. Each activity should take 5 minutes or less and require no materials.",
            variant: "info",
          },
          {
            type: "text",
            body: "Press Enter and watch Claude generate a response. Notice how specific the prompt is — it mentions the grade level, time constraint, and material requirement. Specific prompts get better results. This is the single most important principle of working with AI.",
          },
          {
            type: "heading",
            text: "Essential Commands",
            level: 3,
          },
          {
            type: "text",
            body: "Claude Code has a few built-in commands that are helpful to know. Type <code>/help</code> to see available commands. Type <code>/clear</code> to start a fresh conversation (Claude forgets the previous context). Press <strong>Ctrl+C</strong> to cancel a response that is still generating. Press <strong>Escape</strong> to exit Claude Code entirely.",
          },
          {
            type: "text",
            body: "Try a few more prompts. Ask Claude to explain a concept you teach, draft a parent email, or suggest a classroom management strategy. The more you experiment, the more comfortable you will become.",
          },
        ],
      },
      {
        title: "The Art of Prompt Writing",
        description:
          "Master the skill of writing effective prompts. Learn the frameworks and techniques that turn vague requests into precise, useful AI outputs.",
        duration: 35,
        objectives: [
          "Apply the CRAFT framework to write effective prompts",
          "Transform vague prompts into specific, actionable ones",
          "Use role-setting and context to improve output quality",
        ],
        content: [
          {
            type: "heading",
            text: "Why Prompts Matter",
            level: 2,
          },
          {
            type: "text",
            body: "The quality of what you get from AI is directly proportional to the quality of what you ask. A vague prompt produces a generic response. A specific, well-structured prompt produces targeted, immediately useful output. This is the core skill of this entire course.",
          },
          {
            type: "heading",
            text: "The CRAFT Framework",
            level: 3,
          },
          {
            type: "text",
            body: "Use the <strong>CRAFT</strong> framework for every educational prompt:",
          },
          {
            type: "text",
            body: "<strong>C — Context:</strong> What is the situation? (Grade level, subject, student needs, curriculum) <br><strong>R — Role:</strong> Who should Claude be? (curriculum designer, writing coach, assessment expert) <br><strong>A — Action:</strong> What exactly should Claude do? (create, revise, explain, analyze) <br><strong>F — Format:</strong> How should the output look? (bullet points, table, lesson plan template, rubric) <br><strong>T — Tone:</strong> What voice should it use? (professional, student-friendly, parent-appropriate)",
          },
          {
            type: "heading",
            text: "Before and After Examples",
            level: 3,
          },
          {
            type: "text",
            body: "<strong>Weak prompt:</strong> 'Give me a quiz on fractions.'",
          },
          {
            type: "text",
            body: "<strong>CRAFT prompt:</strong> 'You are a Grade 6 math teacher in Saskatchewan. Create a 10-question quiz on adding and subtracting fractions with unlike denominators. Include: 6 multiple choice questions, 2 short answer, and 2 word problems set in real-world contexts. Format as a clean quiz document with a header, name/date line, and answer key on a separate page. Use encouraging, student-friendly language.'",
          },
          {
            type: "callout",
            text: "<strong>Pro Tip:</strong> Always include the grade level, the specific topic (not just the subject), and the format you want. These three details alone will dramatically improve your results.",
            variant: "tip",
          },
          {
            type: "text",
            body: "Practice rewriting three of your own vague prompts using the CRAFT framework. Notice how much more useful the outputs become.",
          },
        ],
      },
      {
        title: "Understanding Context and Memory",
        description:
          "Learn how Claude Code handles context across a conversation, how to use project files effectively, and strategies for maintaining productive sessions.",
        duration: 25,
        objectives: [
          "Explain how context windows work in Claude Code",
          "Use file reading to give Claude relevant context",
          "Manage long conversations effectively",
        ],
        content: [
          {
            type: "heading",
            text: "How Claude Remembers (and Forgets)",
            level: 2,
          },
          {
            type: "text",
            body: "Within a single conversation session, Claude Code remembers everything you have discussed. You can reference earlier messages, build on previous outputs, and refine results iteratively. However, when you start a new session (close and reopen Claude Code), it starts completely fresh with no memory of previous conversations.",
          },
          {
            type: "heading",
            text: "The Power of File Context",
            level: 3,
          },
          {
            type: "text",
            body: "Claude Code's superpower is its ability to read files on your computer. Instead of pasting long documents into your prompt, you can simply tell Claude to read them. For example: 'Read the file curriculum-standards.pdf and create a lesson plan that aligns to the Grade 8 ELA standards listed in it.'",
          },
          {
            type: "text",
            body: "This is transformative for educators. You can point Claude at your existing curriculum documents, student data exports, previous lesson plans, or assessment frameworks and ask it to work with that real information rather than generating from scratch.",
          },
          {
            type: "heading",
            text: "CLAUDE.md: Persistent Instructions",
            level: 3,
          },
          {
            type: "text",
            body: "If you create a file called <code>CLAUDE.md</code> in your working directory, Claude Code reads it automatically at the start of every session. This is perfect for storing instructions that should always apply — your school name, grade level, curriculum province, preferred lesson plan format, or any other context you find yourself repeating.",
          },
          {
            type: "callout",
            text: "<strong>Example CLAUDE.md for a teacher:</strong><br>I teach Grade 5/6 at Rossignol Elementary in La Ronge, SK. I follow Saskatchewan curriculum. My students are mixed-ability with several ELL learners. I prefer lessons that incorporate Indigenous perspectives and land-based learning when possible. Format all lesson plans using our school template with: outcomes, indicators, activities, assessment, and differentiation sections.",
            variant: "info",
          },
          {
            type: "text",
            body: "Creating a CLAUDE.md file is one of the highest-impact things you can do. It turns Claude from a generic assistant into one that knows your specific teaching context.",
          },
        ],
      },
    ],
  },

  // ===== MODULE 3: AI-Powered Curriculum Design =====
  {
    title: "AI-Powered Curriculum Design",
    description:
      "Use Claude Code to design curriculum documents — learning outcomes, scope and sequence, standards alignment, and differentiated planning.",
    lessons: [
      {
        title: "Defining Learning Outcomes with AI",
        description:
          "Use Claude Code to write clear, measurable learning outcomes aligned to Bloom's taxonomy and curriculum standards.",
        duration: 30,
        objectives: [
          "Write learning outcomes using action verbs from Bloom's taxonomy",
          "Use Claude Code to generate and refine outcome statements",
          "Align outcomes to provincial curriculum standards",
        ],
        content: [
          {
            type: "heading",
            text: "Outcomes That Drive Learning",
            level: 2,
          },
          {
            type: "text",
            body: "Well-written learning outcomes are the foundation of effective teaching. They answer the question: 'What will students know and be able to do by the end of this lesson/unit?' Strong outcomes are specific, measurable, and use action verbs from Bloom's taxonomy.",
          },
          {
            type: "heading",
            text: "Bloom's Taxonomy Action Verbs",
            level: 3,
          },
          {
            type: "text",
            body: "<strong>Remember:</strong> list, define, identify, recall <br><strong>Understand:</strong> explain, describe, summarize, compare <br><strong>Apply:</strong> demonstrate, solve, use, calculate <br><strong>Analyze:</strong> differentiate, examine, categorize, investigate <br><strong>Evaluate:</strong> justify, assess, critique, judge <br><strong>Create:</strong> design, compose, construct, develop",
          },
          {
            type: "heading",
            text: "Using Claude Code for Outcomes",
            level: 3,
          },
          {
            type: "text",
            body: "Here is a powerful prompt pattern for generating outcomes:",
          },
          {
            type: "callout",
            text: "I am teaching a Grade 7 Science unit on ecosystems (Saskatchewan curriculum). Generate 6 learning outcomes that span Bloom's taxonomy from Remember to Create. Each outcome should: start with 'Students will be able to...', use a measurable action verb, be achievable in 1-2 lessons, and connect to a specific Saskatchewan curriculum indicator.",
            variant: "info",
          },
          {
            type: "text",
            body: "Claude will generate a set of outcomes. Your job is to review them, adjust for your specific students, and ensure they match your assessment plan. AI generates the first draft — your professional judgment produces the final version.",
          },
        ],
      },
      {
        title: "Scope and Sequence Generation",
        description:
          "Build comprehensive scope and sequence documents using Claude Code. Map entire courses, units, and year plans with proper pacing.",
        duration: 35,
        objectives: [
          "Generate a scope and sequence document for a full course",
          "Ensure logical progression and prerequisite alignment",
          "Adjust pacing based on student needs and calendar constraints",
        ],
        content: [
          {
            type: "heading",
            text: "Planning the Big Picture",
            level: 2,
          },
          {
            type: "text",
            body: "A scope and sequence document maps out what you will teach and when, across an entire term or school year. It is one of the most time-consuming planning documents to create from scratch. With Claude Code, you can generate a comprehensive first draft in minutes and then refine it with your professional expertise.",
          },
          {
            type: "heading",
            text: "The Prompt That Does It All",
            level: 3,
          },
          {
            type: "text",
            body: "Here is a template for generating a full scope and sequence:",
          },
          {
            type: "callout",
            text: "Create a scope and sequence for Saskatchewan Grade 7 Mathematics covering the full school year (September to June). Include: unit titles, duration (number of weeks), key outcomes for each unit, prerequisite connections between units, suggested assessment types for each unit, and a column for cross-curricular connections. Format as a markdown table. Assume 5 hours of math instruction per week.",
            variant: "info",
          },
          {
            type: "text",
            body: "After Claude generates the document, review it carefully against your provincial curriculum guide. Check that all outcomes are covered, the pacing feels realistic for your students, and there is room for review and assessment periods.",
          },
          {
            type: "callout",
            text: "<strong>Pro Tip:</strong> After generating the initial scope and sequence, follow up with: 'Now read our school calendar (September 2 to June 26, with breaks on...) and adjust the pacing to account for actual instructional days.' Claude Code can read calendar files and do this math for you.",
            variant: "tip",
          },
        ],
      },
      {
        title: "Standards Alignment Made Easy",
        description:
          "Use Claude Code to map lessons and assessments to curriculum standards. Create alignment matrices and verify coverage across a course.",
        duration: 30,
        objectives: [
          "Create a standards alignment matrix using Claude Code",
          "Verify complete curriculum coverage across a unit or course",
          "Identify gaps in standards coverage",
        ],
        content: [
          {
            type: "heading",
            text: "Why Alignment Matters",
            level: 2,
          },
          {
            type: "text",
            body: "Standards alignment ensures every lesson serves a purpose in the larger curriculum. Without it, you risk spending too much time on some outcomes and too little on others. An alignment matrix maps each lesson or assessment to specific curriculum standards, making gaps immediately visible.",
          },
          {
            type: "heading",
            text: "Building an Alignment Matrix",
            level: 3,
          },
          {
            type: "text",
            body: "The most effective approach is to give Claude Code your actual curriculum document and your lesson plans, then ask it to create the matrix:",
          },
          {
            type: "callout",
            text: "Read the Saskatchewan Grade 7 ELA curriculum outcomes document and my unit plan for the poetry unit. Create an alignment matrix showing which curriculum outcomes are addressed by each lesson. Use a table format with outcomes as rows and lessons as columns. Mark each cell with the level of coverage: D (directly taught), R (reinforced), or A (assessed). Highlight any outcomes that have no coverage.",
            variant: "info",
          },
          {
            type: "text",
            body: "This kind of analysis would take hours by hand but takes minutes with Claude Code. The result helps you see immediately which outcomes need more attention and which are well covered.",
          },
          {
            type: "text",
            body: "You can also run this in reverse: give Claude a set of outcomes and ask it to suggest lesson activities that would address any gaps.",
          },
        ],
      },
      {
        title: "Differentiated Curriculum Planning",
        description:
          "Use AI to create differentiated versions of curriculum materials for diverse learners, including ELL students, gifted learners, and students with learning accommodations.",
        duration: 30,
        objectives: [
          "Generate differentiated versions of materials at multiple levels",
          "Create accommodations and modifications for diverse learners",
          "Apply Universal Design for Learning principles with AI support",
        ],
        content: [
          {
            type: "heading",
            text: "One Lesson, Multiple Entry Points",
            level: 2,
          },
          {
            type: "text",
            body: "Differentiated instruction is one of the most important and most challenging aspects of teaching. Every classroom has students working at different levels, with different strengths, and different needs. AI makes differentiation dramatically more practical because it can quickly generate multiple versions of the same material.",
          },
          {
            type: "heading",
            text: "Differentiation Prompts That Work",
            level: 3,
          },
          {
            type: "text",
            body: "Here is a proven prompt pattern for differentiation:",
          },
          {
            type: "callout",
            text: "Take this Grade 7 reading passage about ecosystems and create three versions: (1) Below grade level — simplify vocabulary, shorten sentences, add context clues for key terms, target Grade 4-5 reading level. (2) At grade level — the original passage with key vocabulary bolded and defined in margin notes. (3) Above grade level — add extension questions that require analysis and evaluation, include a primary source excerpt for comparison. Keep the same core content and learning outcomes across all three versions.",
            variant: "info",
          },
          {
            type: "text",
            body: "The key phrase in that prompt is 'keep the same core content and learning outcomes.' Differentiation means different paths to the same destination, not different destinations.",
          },
          {
            type: "callout",
            text: "<strong>For ELL Students:</strong> Ask Claude to 'Add visual vocabulary supports, simplify sentence structures while maintaining academic vocabulary, and include first-language cognates for [Spanish/Cree/other] where possible.' Be specific about the student's first language for the best results.",
            variant: "tip",
          },
        ],
      },
    ],
  },

  // ===== MODULE 4: Building Syllabi with AI =====
  {
    title: "Building Syllabi with AI",
    description:
      "Create professional syllabi, rubrics, and assessment frameworks. Learn to adapt materials across grade levels and subjects.",
    lessons: [
      {
        title: "Anatomy of an Effective Syllabus",
        description:
          "Understand the components of a strong syllabus and how each section serves students, parents, and administrators.",
        duration: 20,
        objectives: [
          "Identify the essential components of an effective syllabus",
          "Explain the purpose of each syllabus section for different audiences",
          "Evaluate sample syllabi for completeness and clarity",
        ],
        content: [
          {
            type: "heading",
            text: "More Than a Course Outline",
            level: 2,
          },
          {
            type: "text",
            body: "A syllabus is often a student's first impression of your course. It should be informative, welcoming, and clear. A great syllabus serves three audiences: <strong>students</strong> (what will I learn and how?), <strong>parents</strong> (how is my child assessed and how can I help?), and <strong>administrators</strong> (does this course meet curriculum requirements?).",
          },
          {
            type: "heading",
            text: "Essential Components",
            level: 3,
          },
          {
            type: "list",
            items: [
              "Course title, teacher name, and contact information",
              "Course description and learning goals (written in student-friendly language)",
              "Materials needed",
              "Unit overview with approximate timeline",
              "Assessment breakdown (categories and weights)",
              "Classroom expectations and policies (attendance, late work, academic honesty)",
              "Support resources (tutoring, office hours, extra help)",
              "Important dates (exams, project deadlines, holidays)",
            ],
          },
          {
            type: "text",
            body: "In the next lesson, you will use Claude Code to generate a complete syllabus using all of these components, customized to your specific course and school context.",
          },
        ],
      },
      {
        title: "Generating Syllabi with Claude Code",
        description:
          "Use Claude Code to generate complete, professional syllabi. Practice iterative refinement to match your school's requirements.",
        duration: 30,
        objectives: [
          "Generate a complete syllabus using Claude Code",
          "Refine AI output through iterative conversation",
          "Save and export syllabi as formatted documents",
        ],
        content: [
          {
            type: "heading",
            text: "From Prompt to Polished Syllabus",
            level: 2,
          },
          {
            type: "text",
            body: "The most effective way to generate a syllabus is to provide Claude Code with as much context as possible in your initial prompt, then refine through follow-up conversation. Here is a comprehensive prompt template:",
          },
          {
            type: "callout",
            text: "Create a syllabus for Grade 7 Science at Prairie View Elementary School, Saskatoon, SK. Teacher: Sarah Mitchell (smitchell@prairieview.ca). The course runs September 2 to June 26, 2025-2026. Saskatchewan curriculum. Assessment: Homework 25%, Quizzes 20%, Projects 25%, Tests 20%, Participation 10%. Include: welcoming course description, 4 major units (Ecosystems, Mixtures & Solutions, Heat & Temperature, Earth's Crust), classroom expectations emphasizing respectful inquiry, late work policy (5% per day, max 5 days), and a section on Treaty Education integration. Tone should be warm and encouraging for 12-13 year olds. Format as a clean document I can print.",
            variant: "info",
          },
          {
            type: "text",
            body: "After Claude generates the syllabus, you can refine it: 'Add a section about our school's values.' 'Make the language more welcoming.' 'Add specific dates for unit tests.' 'Include a note about our field trip to the WDM.' Each follow-up makes the document more specifically yours.",
          },
          {
            type: "callout",
            text: "<strong>File Output:</strong> Ask Claude Code to 'Write this syllabus to a file called science-7-syllabus.md' and it will save it directly to your computer. You can then convert it to PDF or paste it into your school's template.",
            variant: "tip",
          },
        ],
      },
      {
        title: "Creating Rubrics and Assessment Criteria",
        description:
          "Use AI to design clear, consistent rubrics for any assignment type. Learn to create single-point, analytic, and holistic rubrics.",
        duration: 30,
        objectives: [
          "Distinguish between analytic, holistic, and single-point rubrics",
          "Generate rubrics aligned to specific learning outcomes",
          "Modify AI-generated rubrics to match your assessment philosophy",
        ],
        content: [
          {
            type: "heading",
            text: "Rubrics: Your Assessment GPS",
            level: 2,
          },
          {
            type: "text",
            body: "A good rubric does two things: it tells students exactly what success looks like before they start, and it makes your grading faster and more consistent. There are three main types:",
          },
          {
            type: "text",
            body: "<strong>Analytic rubrics</strong> score each criterion separately (e.g., Content: 4/4, Organization: 3/4, Mechanics: 4/4). Best for detailed feedback. <strong>Holistic rubrics</strong> give a single overall score based on general descriptors. Best for quick assessments. <strong>Single-point rubrics</strong> describe only the proficient level, with open columns for 'areas of concern' and 'areas of strength.' Best for formative feedback.",
          },
          {
            type: "heading",
            text: "Generating Rubrics with Claude",
            level: 3,
          },
          {
            type: "callout",
            text: "Create a 4-level analytic rubric for a Grade 7 persuasive essay. Criteria: Thesis & Argument (strength of position and supporting evidence), Organization (introduction, body paragraphs, conclusion, transitions), Use of Evidence (quality, relevance, and proper citation of sources), Conventions (grammar, spelling, punctuation). Levels: Exemplary (4), Proficient (3), Developing (2), Beginning (1). Each cell should describe specific, observable student behaviours. Use student-friendly language.",
            variant: "info",
          },
          {
            type: "text",
            body: "After generating, always check that the descriptors are specific enough to distinguish between levels and fair enough that students understand what they need to do to improve.",
          },
        ],
      },
      {
        title: "Adapting Content Across Grade Levels",
        description:
          "Use Claude Code to adapt existing materials for different grade levels while maintaining alignment to learning outcomes.",
        duration: 25,
        objectives: [
          "Adapt a lesson or resource up or down by 2-3 grade levels",
          "Maintain core learning outcomes while adjusting complexity",
          "Create multi-grade materials for combined classrooms",
        ],
        content: [
          {
            type: "heading",
            text: "One Resource, Multiple Grades",
            level: 2,
          },
          {
            type: "text",
            body: "Whether you teach a combined class, need to support a student working above or below grade level, or want to share resources with colleagues in other grades, adapting materials across grade levels is a constant need. Claude Code makes this fast and effective.",
          },
          {
            type: "heading",
            text: "Effective Adaptation Prompts",
            level: 3,
          },
          {
            type: "text",
            body: "The key is to be explicit about what should change and what should stay the same:",
          },
          {
            type: "callout",
            text: "I have a Grade 7 lesson on the water cycle. Adapt it for Grade 4 students. Keep the same core concepts (evaporation, condensation, precipitation, collection) but: simplify vocabulary, add more visual descriptions, replace abstract explanations with concrete examples students can observe, shorten the reading passages, and add hands-on activity suggestions. The learning outcome should shift from 'analyze the water cycle's role in ecosystems' to 'describe the stages of the water cycle with examples.'",
            variant: "info",
          },
          {
            type: "text",
            body: "You can also go the other direction — take a Grade 5 resource and adapt it up for Grade 8 by adding complexity, requiring analysis rather than recall, and connecting to broader systems thinking.",
          },
          {
            type: "callout",
            text: "<strong>Combined Classrooms:</strong> If you teach a split class (e.g., Grade 5/6), ask Claude to create a single lesson framework with tiered activities: 'Create a math lesson on fractions where the core instruction is shared, but the practice activities are tiered — Grade 5 works on equivalent fractions while Grade 6 works on operations with fractions.'",
            variant: "tip",
          },
        ],
      },
    ],
  },

  // ===== MODULE 5: Course Content Creation =====
  {
    title: "Course Content Creation",
    description:
      "Create lesson plans, quizzes, discussion prompts, and study materials with AI assistance. Build a library of reusable, high-quality content.",
    lessons: [
      {
        title: "AI-Assisted Lesson Planning",
        description:
          "Build complete lesson plans with Claude Code, from bell-ringer to closing activity. Master the iterative process of refining AI-generated plans.",
        duration: 35,
        objectives: [
          "Generate a complete lesson plan using Claude Code",
          "Refine AI output to match your teaching style and student needs",
          "Build a reusable lesson plan template",
        ],
        content: [
          {
            type: "heading",
            text: "The Lesson Plan Workflow",
            level: 2,
          },
          {
            type: "text",
            body: "The most efficient lesson planning workflow with AI is: (1) Provide context and constraints, (2) Generate a first draft, (3) Refine through conversation, (4) Save as a template for future lessons. Let us walk through each step.",
          },
          {
            type: "heading",
            text: "Step 1: The Comprehensive Prompt",
            level: 3,
          },
          {
            type: "callout",
            text: "Create a 60-minute lesson plan for Grade 7 Math on solving two-step linear equations. Saskatchewan curriculum, outcome P7.2. Include: 5-minute warm-up (review of one-step equations), 15-minute direct instruction with 3 worked examples, 20-minute guided practice (problems that progress from concrete to abstract), 15-minute independent practice, 5-minute exit ticket (2 problems). Differentiation: include extension problems for fast finishers and manipulative-based alternatives for struggling learners. Materials needed should be minimal.",
            variant: "info",
          },
          {
            type: "heading",
            text: "Step 2: Refine and Personalize",
            level: 3,
          },
          {
            type: "text",
            body: "After the first draft, use follow-up prompts to refine: 'Make the warm-up more engaging — can it be a puzzle or challenge instead of review problems?' 'Add a real-world context to the guided practice — use a scenario about planning a school event budget.' 'Include the specific questions for the exit ticket with an answer key.'",
          },
          {
            type: "text",
            body: "Each iteration makes the plan more specifically yours. The AI provides the structure and ideas; you provide the professional judgment about what works for your students.",
          },
        ],
      },
      {
        title: "Generating Quizzes and Assessments",
        description:
          "Create diverse assessment items with Claude Code — multiple choice, short answer, performance tasks, and more. Ensure alignment to outcomes and Bloom's taxonomy.",
        duration: 30,
        objectives: [
          "Generate assessment items at specific Bloom's taxonomy levels",
          "Create balanced assessments with diverse question types",
          "Write effective distractors for multiple choice questions",
        ],
        content: [
          {
            type: "heading",
            text: "Assessment Design with AI",
            level: 2,
          },
          {
            type: "text",
            body: "Creating good assessments is one of the most time-consuming tasks in teaching. AI can dramatically speed up this process, but quality control is essential — you must verify that questions are accurate, fair, appropriately difficult, and aligned to what you actually taught.",
          },
          {
            type: "heading",
            text: "Multi-Format Quiz Generation",
            level: 3,
          },
          {
            type: "callout",
            text: "Create a 25-mark quiz on Grade 7 Science: Mixtures and Solutions. Include: 5 multiple choice questions (1 mark each) at the Remember/Understand level; 3 short answer questions (2 marks each) at the Apply/Analyze level; 2 extended response questions (4 marks each) at the Evaluate/Create level. Each question should reference specific concepts from the Saskatchewan curriculum. Include an answer key with full solutions and a marking guide for the extended response questions.",
            variant: "info",
          },
          {
            type: "text",
            body: "Notice the prompt specifies not just the question type but the cognitive level. This ensures your assessment tests a range of thinking skills, not just recall.",
          },
          {
            type: "callout",
            text: "<strong>Quality Check:</strong> Always review AI-generated questions for: factual accuracy, appropriate difficulty, clear wording (no double negatives or ambiguous phrasing), plausible distractors in multiple choice (wrong answers should represent common misconceptions, not obvious nonsense), and alignment to what you actually taught — not just what is in the curriculum.",
            variant: "warning",
          },
        ],
      },
      {
        title: "Creating Discussion Prompts",
        description:
          "Design rich discussion prompts that promote critical thinking, diverse perspectives, and student engagement. Use AI to create Socratic questions and fishbowl discussion guides.",
        duration: 25,
        objectives: [
          "Generate discussion prompts at multiple thinking levels",
          "Design structured discussion activities (Socratic seminar, fishbowl)",
          "Create prompts that invite diverse perspectives and respectful dialogue",
        ],
        content: [
          {
            type: "heading",
            text: "Discussions That Go Deeper",
            level: 2,
          },
          {
            type: "text",
            body: "Great classroom discussions do not happen by accident. They require carefully crafted prompts that are open-ended enough to invite multiple perspectives, specific enough to stay focused, and challenging enough to push thinking beyond surface level.",
          },
          {
            type: "heading",
            text: "Discussion Prompt Types",
            level: 3,
          },
          {
            type: "text",
            body: "<strong>Essential Questions:</strong> Big, enduring questions with no single right answer. 'What makes a society fair?' <strong>Socratic Questions:</strong> Questions that probe assumptions, evidence, and reasoning. 'What evidence supports that claim? What would someone who disagrees say?' <strong>Perspective-Taking:</strong> Questions that require seeing through others' eyes. 'How might this event look different from a Cree Elder's perspective vs. a settler's perspective?'",
          },
          {
            type: "callout",
            text: "Generate a Socratic seminar guide for Grade 7 Social Studies on the topic of Treaty relationships in Saskatchewan. Include: 3 opening questions (accessible to all students), 3 core questions (require evidence from our readings), 3 closing questions (personal reflection and connection). Add teacher notes with follow-up probes for when the discussion stalls.",
            variant: "info",
          },
          {
            type: "text",
            body: "AI-generated discussion prompts are excellent starting points, but always adapt them based on what your students have actually read, discussed, and experienced. The best discussions build on shared classroom experiences.",
          },
        ],
      },
      {
        title: "Study Materials and Review Guides",
        description:
          "Use AI to create study guides, review sheets, vocabulary lists, graphic organizers, and other student-facing learning resources.",
        duration: 25,
        objectives: [
          "Generate comprehensive study guides from course content",
          "Create vocabulary-building resources with context and examples",
          "Design graphic organizers for specific thinking tasks",
        ],
        content: [
          {
            type: "heading",
            text: "Resources Students Actually Use",
            level: 2,
          },
          {
            type: "text",
            body: "The best study materials are structured, visually clear, and connected to what students will actually be assessed on. AI can generate these quickly, but the key is formatting them in ways students find useful — not just walls of text.",
          },
          {
            type: "heading",
            text: "Study Guide Prompt Template",
            level: 3,
          },
          {
            type: "callout",
            text: "Create a study guide for the Grade 7 Science unit test on Heat and Temperature. Format it as a student-friendly document with: a checklist of key concepts students should know, key vocabulary with simple definitions and examples, 3 worked example problems with step-by-step solutions, a 'common mistakes to avoid' section, and 5 practice questions (with answers on a separate section at the bottom). Use headings, bullet points, and bold text to make it scannable. Write in second person ('You should know...').",
            variant: "info",
          },
          {
            type: "text",
            body: "You can also ask Claude to generate different types of graphic organizers: Venn diagrams for comparison, concept maps for showing relationships, timeline templates for historical events, or cause-and-effect charts. Describe what you want and ask Claude to create it in a text-based format students can fill in.",
          },
          {
            type: "callout",
            text: "<strong>Student Ownership:</strong> Consider sharing these AI-generated study guides as starting points, then having students add their own notes, examples, and connections. This combines the efficiency of AI with the learning power of active engagement.",
            variant: "tip",
          },
        ],
      },
    ],
  },

  // ===== MODULE 6: Workflow Automation =====
  {
    title: "Workflow Automation",
    description:
      "Save hours every week by automating repetitive tasks — report card comments, grading assistance, templates, and parent communications.",
    lessons: [
      {
        title: "Automating Report Cards",
        description:
          "Use Claude Code to generate personalized report card comments for every student. Learn to provide student data and get tailored, professional comments.",
        duration: 30,
        objectives: [
          "Generate personalized report card comments from student data",
          "Maintain consistent quality while personalizing for each student",
          "Create comment templates that can be adapted across terms",
        ],
        content: [
          {
            type: "heading",
            text: "Report Card Season Without the Stress",
            level: 2,
          },
          {
            type: "text",
            body: "Report card comments are one of the biggest time sinks in teaching — you need to write meaningful, personalized, professional comments for every student in every subject. Claude Code can transform this from a week-long ordeal into a focused afternoon of review and refinement.",
          },
          {
            type: "heading",
            text: "The Process",
            level: 3,
          },
          {
            type: "text",
            body: "<strong>Step 1:</strong> Prepare a simple data file with each student's name, grade/percentage, strengths, areas for growth, and any specific observations. This can be a simple text file or spreadsheet.",
          },
          {
            type: "text",
            body: "<strong>Step 2:</strong> Ask Claude Code to read the file and generate comments:",
          },
          {
            type: "callout",
            text: "Read the file student-grades.csv and generate report card comments for each student in my Grade 7 Mathematics class. Each comment should be 3-4 sentences. Include: a specific strength with an example, an area for growth with a constructive suggestion, and an encouraging closing statement. Tone should be professional, warm, and parent-appropriate. Avoid generic phrases like 'good job' — be specific about what each student did well.",
            variant: "info",
          },
          {
            type: "text",
            body: "<strong>Step 3:</strong> Review every comment. Edit for accuracy, add personal details that AI cannot know (a moment of pride in class, a breakthrough you witnessed), and ensure the tone is appropriate for each family.",
          },
          {
            type: "callout",
            text: "<strong>Critical:</strong> Always review AI-generated comments carefully. Check for factual accuracy (correct pronouns, correct subject), avoid repetitive phrasing across students, and ensure comments reflect genuine observations, not just grade-based generalizations.",
            variant: "warning",
          },
        ],
      },
      {
        title: "AI-Assisted Grading",
        description:
          "Use Claude Code to assist with grading written work. Learn to create grading rubrics that AI can apply consistently while maintaining your professional judgment.",
        duration: 30,
        objectives: [
          "Use Claude Code to apply rubrics to student writing samples",
          "Provide consistent, detailed feedback at scale",
          "Understand the limits of AI grading and where human judgment is essential",
        ],
        content: [
          {
            type: "heading",
            text: "AI as a Grading Assistant, Not a Grading Replacement",
            level: 2,
          },
          {
            type: "text",
            body: "Let us be clear: AI should assist with grading, not replace your professional judgment. Claude Code is excellent at applying rubrics consistently, generating detailed feedback comments, and flagging specific issues in student writing. The final grade decision should always be yours.",
          },
          {
            type: "heading",
            text: "How to Use Claude for Grading Assistance",
            level: 3,
          },
          {
            type: "text",
            body: "The most effective approach is to give Claude your rubric and a student's work, then ask for a rubric analysis and feedback draft:",
          },
          {
            type: "callout",
            text: "Read the rubric in persuasive-essay-rubric.md and the student essay in student-work/essay-001.txt. Apply the rubric to the essay and provide: a suggested score for each criterion with specific evidence from the text, 2-3 specific strengths with examples quoted from the essay, 2-3 areas for growth with concrete suggestions for improvement, and an overall comment the student would find helpful and encouraging. Do NOT assign a final grade — suggest a rubric level and let me make the final decision.",
            variant: "info",
          },
          {
            type: "text",
            body: "This approach saves time while keeping you in the loop. You read the AI's analysis, check its reasoning against the student's actual work, adjust as needed, and finalize the grade.",
          },
          {
            type: "callout",
            text: "<strong>Ethics Note:</strong> Many schools have policies about AI use in grading. Check with your administration before using AI as a grading tool. Always be transparent with students and parents about how technology supports your assessment process.",
            variant: "warning",
          },
        ],
      },
      {
        title: "Template Generation for Common Tasks",
        description:
          "Build a library of reusable templates — permission forms, parent letters, meeting agendas, IEP notes, and more.",
        duration: 25,
        objectives: [
          "Create a library of reusable document templates",
          "Generate context-specific documents from templates",
          "Build a CLAUDE.md file that makes template generation faster",
        ],
        content: [
          {
            type: "heading",
            text: "Your Personal Template Library",
            level: 2,
          },
          {
            type: "text",
            body: "Teachers write the same types of documents over and over: permission forms, parent newsletters, meeting agendas, field trip organizers, substitute teacher plans. Creating a template library with Claude Code means you never start from scratch again.",
          },
          {
            type: "heading",
            text: "Template Types Every Teacher Needs",
            level: 3,
          },
          {
            type: "list",
            items: [
              "Field trip permission form (with medical/emergency info section)",
              "Weekly parent newsletter template",
              "Student-led conference guide",
              "Substitute teacher plan template",
              "IEP meeting agenda and notes template",
              "Classroom volunteer guidelines",
              "Student behaviour documentation form",
              "Professional development request form",
            ],
          },
          {
            type: "text",
            body: "To generate any of these, provide Claude with your school's name, your contact details, and any specific policies or requirements. For example:",
          },
          {
            type: "callout",
            text: "Create a field trip permission form template for Prairie View Elementary School. Include: school header with address and phone, trip details section (destination, date, departure/return times, transportation method), parent authorization with signature line, emergency contact and medical information section, a note about appropriate clothing/supplies, and a tear-off return portion. Format it to fit on one page.",
            variant: "info",
          },
          {
            type: "text",
            body: "Save these templates in a dedicated folder. Next time you need one, just tell Claude Code to read the template and fill it in with the specific details for your upcoming event.",
          },
        ],
      },
      {
        title: "Parent Communication Templates",
        description:
          "Use AI to draft effective parent communications — emails, newsletters, meeting summaries, and difficult conversation frameworks.",
        duration: 25,
        objectives: [
          "Draft professional parent emails for common situations",
          "Create weekly/monthly newsletter templates",
          "Prepare for difficult conversations with structured communication frameworks",
        ],
        content: [
          {
            type: "heading",
            text: "Clear, Professional Parent Communication",
            level: 2,
          },
          {
            type: "text",
            body: "Effective parent communication builds trust and supports student success. AI can help you craft messages that are clear, professional, warm, and appropriately detailed — saving time while improving quality.",
          },
          {
            type: "heading",
            text: "Common Email Templates",
            level: 3,
          },
          {
            type: "text",
            body: "Here are situations where AI-drafted emails save significant time:",
          },
          {
            type: "text",
            body: "<strong>Positive news:</strong> Sharing student achievements, improvements, or moments of growth. <strong>Concern communication:</strong> Academic struggles, missing work, or behaviour concerns (requires careful tone). <strong>Event announcements:</strong> Field trips, performances, parent nights. <strong>Meeting follow-ups:</strong> Summarizing what was discussed and agreed upon. <strong>General updates:</strong> Weekly or monthly class newsletters.",
          },
          {
            type: "callout",
            text: "Draft an email to a parent about their child's declining math grades. The student (do not use a name - use [Student Name]) went from a B+ to a C- over the past month. The tone should be: concerned but not alarming, collaborative (we are a team), solution-oriented, and include specific next steps (extra help sessions Tuesdays and Thursdays, a parent-teacher check-in in two weeks). Do not blame the student — focus on support.",
            variant: "info",
          },
          {
            type: "callout",
            text: "<strong>Always personalize:</strong> AI drafts are starting points. Add personal details, adjust the tone based on your relationship with the family, and review carefully before sending — especially for sensitive communications.",
            variant: "tip",
          },
        ],
      },
    ],
  },

  // ===== MODULE 7: Advanced Claude Code =====
  {
    title: "Advanced Claude Code",
    description:
      "Take your Claude Code skills to the next level — work with files, build school-wide systems, and create custom workflows.",
    lessons: [
      {
        title: "Working with Files and Documents",
        description:
          "Master Claude Code's file system capabilities — reading, writing, and transforming documents for education workflows.",
        duration: 35,
        objectives: [
          "Use Claude Code to read and analyze existing documents",
          "Generate new files from templates and data",
          "Batch-process multiple files for efficiency",
        ],
        content: [
          {
            type: "heading",
            text: "Claude Code Meets Your File System",
            level: 2,
          },
          {
            type: "text",
            body: "The real power of Claude Code over the web-based Claude is its ability to work directly with files on your computer. This transforms it from a chat tool into a genuine productivity assistant that can process, transform, and create documents.",
          },
          {
            type: "heading",
            text: "Reading Files for Context",
            level: 3,
          },
          {
            type: "text",
            body: "Claude Code can read most text-based files: .txt, .md, .csv, .docx, .pdf, and more. This means you can point it at your existing curriculum documents, student data exports, or previous lesson plans and ask it to work with that real information.",
          },
          {
            type: "callout",
            text: "Read all the files in the folder 'unit-plans/' and create a master document that lists: every learning outcome covered across all units, the assessment strategy for each outcome, and any outcomes from the curriculum that are NOT covered in any unit plan. Format as a gap analysis table.",
            variant: "info",
          },
          {
            type: "heading",
            text: "Writing Files for Output",
            level: 3,
          },
          {
            type: "text",
            body: "You can ask Claude Code to save its output directly to files rather than just displaying it in the terminal. This is essential for longer documents like lesson plans, report card comments, or study guides.",
          },
          {
            type: "text",
            body: "You can also ask Claude to create multiple files at once: 'Generate a study guide for each of the 8 units in my course and save each one as a separate file in the study-guides/ folder.' Claude Code will create all 8 files in sequence.",
          },
        ],
      },
      {
        title: "Building School-Wide Systems",
        description:
          "Design and implement AI-assisted systems for your department or school — shared resource libraries, standardized templates, and collaborative workflows.",
        duration: 30,
        objectives: [
          "Design a shared resource system for a teaching team",
          "Create standardized templates that maintain consistency across teachers",
          "Plan a school-wide AI adoption strategy",
        ],
        content: [
          {
            type: "heading",
            text: "From Individual Use to Institutional Impact",
            level: 2,
          },
          {
            type: "text",
            body: "Once you are comfortable using Claude Code individually, the next step is thinking about how it can benefit your department, grade-level team, or entire school. The key is standardization — creating shared templates, common prompts, and consistent processes that multiply the benefit.",
          },
          {
            type: "heading",
            text: "Shared Resource Library",
            level: 3,
          },
          {
            type: "text",
            body: "Create a shared folder or repository with: <strong>Prompt templates</strong> — proven prompts for common tasks that any teacher can use and adapt. <strong>Output templates</strong> — standardized formats for lesson plans, rubrics, and reports so all department documents look professional and consistent. <strong>CLAUDE.md files</strong> — per-subject or per-grade configuration files that provide context automatically.",
          },
          {
            type: "heading",
            text: "School-Wide AI Strategy",
            level: 3,
          },
          {
            type: "text",
            body: "If your school or district is considering broader AI adoption, consider these steps: (1) Start with a small pilot group of enthusiastic teachers. (2) Document what works and what does not. (3) Create training materials based on real teacher experiences. (4) Develop an acceptable use policy for AI in education. (5) Share wins and lessons learned with the broader staff.",
          },
          {
            type: "callout",
            text: "<strong>Key Principle:</strong> AI adoption works best when it is driven by teachers solving real problems, not by top-down mandates. Start with pain points (report cards, differentiation, lesson planning) and demonstrate time savings with real examples.",
            variant: "tip",
          },
        ],
      },
      {
        title: "Custom Workflows and Automation",
        description:
          "Build multi-step workflows that chain multiple AI tasks together. Learn to create end-to-end processes for complex educational tasks.",
        duration: 30,
        objectives: [
          "Design multi-step workflows for complex tasks",
          "Chain Claude Code commands for end-to-end automation",
          "Create reusable workflow scripts for recurring tasks",
        ],
        content: [
          {
            type: "heading",
            text: "Thinking in Workflows",
            level: 2,
          },
          {
            type: "text",
            body: "The most powerful use of Claude Code is chaining multiple tasks into a workflow. Instead of one prompt, you design a sequence of steps that transforms raw input into polished output. This is where educators who invest in learning AI get massive time returns.",
          },
          {
            type: "heading",
            text: "Example: Unit Plan Workflow",
            level: 3,
          },
          {
            type: "text",
            body: "Here is a multi-step workflow for creating a complete unit plan:",
          },
          {
            type: "text",
            body: "<strong>Step 1:</strong> 'Read the Saskatchewan curriculum document for Grade 7 Social Studies and extract all outcomes for the Pacific Canada unit.' <strong>Step 2:</strong> 'Create a 3-week scope and sequence covering those outcomes with 5 lessons per week.' <strong>Step 3:</strong> 'For each lesson in the scope and sequence, generate a detailed lesson plan.' <strong>Step 4:</strong> 'Create a summative assessment (unit test + project) that covers all outcomes.' <strong>Step 5:</strong> 'Generate a study guide for students based on the full unit.' <strong>Step 6:</strong> 'Save everything to the folder pacific-canada-unit/ with organized subfolders.'",
          },
          {
            type: "text",
            body: "In a single Claude Code session, you can execute all six steps. Each step builds on the previous one because Claude Code maintains context within a session. What might take a week of planning work can be drafted in an hour.",
          },
          {
            type: "callout",
            text: "<strong>Workflow Tip:</strong> Save your best workflows as text files. Next time you need to create a similar unit, copy the workflow, change the subject and grade level, and run it again. Over time, you build a library of proven processes.",
            variant: "tip",
          },
        ],
      },
    ],
  },

  // ===== MODULE 8: Ethics & Privacy =====
  {
    title: "Ethics & Privacy",
    description:
      "Navigate the ethical considerations of AI in education — student data protection, AI bias, and building a responsible AI culture in your school.",
    lessons: [
      {
        title: "Student Data Protection",
        description:
          "Understand the privacy implications of using AI with student data. Learn what data is safe to use, what requires consent, and how to protect student privacy.",
        duration: 30,
        objectives: [
          "Identify what student data is and is not safe to share with AI tools",
          "Apply PIPEDA and FOIP principles to AI use in education",
          "Create a personal data handling protocol for AI-assisted tasks",
        ],
        content: [
          {
            type: "heading",
            text: "Privacy First, Always",
            level: 2,
          },
          {
            type: "text",
            body: "When you use AI tools like Claude Code with student-related work, you have a professional and legal obligation to protect student privacy. In Canada, this is governed by PIPEDA (Personal Information Protection and Electronic Documents Act) and provincial legislation like Saskatchewan's FOIP (Freedom of Information and Protection of Privacy Act).",
          },
          {
            type: "heading",
            text: "The Golden Rules of Student Data and AI",
            level: 3,
          },
          {
            type: "text",
            body: "<strong>Rule 1: Never share identifiable student information with cloud-based AI.</strong> This means no real student names, student numbers, addresses, or other identifying information in your prompts to any AI tool unless your school has a data processing agreement with the provider.",
          },
          {
            type: "text",
            body: "<strong>Rule 2: Anonymize before you analyze.</strong> If you want to use student data for AI-assisted analysis (grade trends, attendance patterns), replace names with pseudonyms or numbers first.",
          },
          {
            type: "text",
            body: "<strong>Rule 3: Local processing is safest.</strong> Claude Code runs on your computer and sends prompts to Anthropic's servers. While Anthropic does not train on user conversations, the data does leave your machine. For sensitive work, consider what can be done with de-identified data.",
          },
          {
            type: "text",
            body: "<strong>Rule 4: Know your school's policy.</strong> Check with your administration about approved AI tools and any restrictions on their use with student data. If no policy exists, advocate for creating one.",
          },
          {
            type: "callout",
            text: "<strong>Safe Uses:</strong> Generating blank templates, creating curriculum materials, drafting generic report card comment structures, building rubrics, planning lessons. <strong>Caution Required:</strong> Working with actual student grades (anonymize first), analyzing student writing samples (get consent), generating personalized comments (review carefully).",
            variant: "warning",
          },
        ],
      },
      {
        title: "Understanding AI Bias",
        description:
          "Explore how bias appears in AI systems, why it matters in education, and practical strategies for identifying and mitigating bias in AI-generated educational materials.",
        duration: 25,
        objectives: [
          "Explain how bias enters AI systems through training data",
          "Identify common forms of bias in educational AI outputs",
          "Apply mitigation strategies when using AI to create educational materials",
        ],
        content: [
          {
            type: "heading",
            text: "AI Reflects the Data It Learned From",
            level: 2,
          },
          {
            type: "text",
            body: "AI models like Claude are trained on vast amounts of text from the internet and books. That text reflects the biases, perspectives, and blind spots of the people who wrote it — which means AI outputs can perpetuate biases related to race, gender, culture, socioeconomic status, and other dimensions of identity.",
          },
          {
            type: "heading",
            text: "Bias in Education AI: Real Examples",
            level: 3,
          },
          {
            type: "text",
            body: "<strong>Representation bias:</strong> AI-generated stories and examples may default to certain demographics if not specifically prompted otherwise. If you ask for 'a story about a scientist,' the AI might default to a male, Western character. <strong>Cultural bias:</strong> AI may reflect dominant cultural perspectives. Content about history might center Western narratives unless you explicitly request Indigenous, Black, or other perspectives. <strong>Language bias:</strong> AI may use language patterns that feel more natural to some cultural groups than others.",
          },
          {
            type: "heading",
            text: "Mitigation Strategies",
            level: 3,
          },
          {
            type: "list",
            items: [
              "Be explicit about representation in your prompts: 'Include diverse characters representing various cultural backgrounds, including Indigenous perspectives'",
              "Review AI outputs for whose stories are told and whose are missing",
              "Cross-reference AI-generated historical or cultural content with authoritative sources",
              "Include instructions in your CLAUDE.md about the perspectives and diversity you want represented",
              "Involve students in critiquing AI outputs — it is a great media literacy exercise",
            ],
          },
          {
            type: "callout",
            text: "<strong>Teachable Moment:</strong> AI bias is itself an excellent topic for classroom discussion. Having students identify bias in AI outputs teaches critical thinking, media literacy, and awareness of systemic issues — all valuable skills.",
            variant: "tip",
          },
        ],
      },
      {
        title: "Building a Responsible AI Culture",
        description:
          "Develop your school's approach to AI — policies, professional development, and a culture of thoughtful, ethical AI use that benefits all learners.",
        duration: 25,
        objectives: [
          "Draft an acceptable use policy for AI in your educational context",
          "Plan a professional development session on AI for colleagues",
          "Articulate a personal philosophy of ethical AI use in education",
        ],
        content: [
          {
            type: "heading",
            text: "Leading by Example",
            level: 2,
          },
          {
            type: "text",
            body: "As an educator who now understands AI capabilities and limitations, you are in a powerful position to help your school navigate AI adoption thoughtfully. This final lesson focuses on how to build a culture of responsible AI use — not just for yourself, but for your colleagues, students, and community.",
          },
          {
            type: "heading",
            text: "Key Elements of an AI Acceptable Use Policy",
            level: 3,
          },
          {
            type: "list",
            items: [
              "Which AI tools are approved for use and for what purposes",
              "Data privacy requirements (what information can and cannot be shared with AI)",
              "Academic integrity guidelines for both teachers and students",
              "Transparency expectations (when should AI use be disclosed?)",
              "Quality assurance requirements (human review of all AI outputs)",
              "Regular review and update schedule for the policy",
            ],
          },
          {
            type: "heading",
            text: "Your AI Philosophy",
            level: 3,
          },
          {
            type: "text",
            body: "As you complete this course, take a moment to articulate your own philosophy of AI in education. Consider these questions: What role should AI play in my teaching practice? What tasks am I comfortable delegating to AI, and what must remain entirely human? How will I ensure AI enhances equity rather than widening gaps? How will I model responsible AI use for my students?",
          },
          {
            type: "callout",
            text: "<strong>Congratulations!</strong> You have completed 'AI for Educators: Mastering Claude Code.' You now have the knowledge and skills to use AI as a powerful teaching tool while maintaining your professional judgment, ethical standards, and commitment to your students. The best way to solidify these skills is to use them — start with one task this week and build from there.",
            variant: "success",
          },
          {
            type: "text",
            body: "Remember: AI is a tool that amplifies your expertise. The heart of great teaching — relationships, inspiration, judgment, and care — remains uniquely and irreplaceably human.",
          },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------
async function main() {
  log("=== AI for Educators: Course Seed Script ===");
  log(`Target: ${SUPABASE_URL}`);
  log("");

  // 1. Get all active tenants
  log("1. Fetching active tenants...");
  const { data: tenants, error: tErr } = await supabase
    .from("tenants")
    .select("id, name, slug")
    .eq("status", "active");

  if (tErr) throw new Error(`Failed to fetch tenants: ${tErr.message}`);
  if (!tenants || tenants.length === 0) {
    log("  No active tenants found. Nothing to do.");
    return;
  }
  log(`  Found ${tenants.length} active tenant(s)`);

  // 2. Process each tenant
  for (const tenant of tenants) {
    log("");
    log(`--- Tenant: ${tenant.name} (${tenant.slug}) ---`);

    // 2a. Check idempotency — skip if course already exists
    const { data: existingCourse } = await supabase
      .from("courses")
      .select("id")
      .eq("tenant_id", tenant.id)
      .eq("name", COURSE_NAME)
      .single();

    if (existingCourse) {
      log(`  Course already exists (${existingCourse.id}). Skipping.`);
      continue;
    }

    // 2b. Find a teacher or admin to use as created_by
    const { data: creator } = await supabase
      .from("tenant_memberships")
      .select("user_id, role")
      .eq("tenant_id", tenant.id)
      .eq("status", "active")
      .in("role", ["teacher", "admin", "super_admin"])
      .order("role", { ascending: true }) // teacher first
      .limit(1)
      .single();

    if (!creator) {
      log("  No teacher/admin found in this tenant. Skipping.");
      continue;
    }
    const createdBy = creator.user_id;
    log(`  Using ${creator.role} (${createdBy}) as creator`);

    // 2c. Create the course
    const { data: course, error: courseErr } = await supabase
      .from("courses")
      .insert({
        tenant_id: tenant.id,
        name: COURSE_NAME,
        description: COURSE_DESCRIPTION,
        subject: "Professional Development",
        grade_level: "PD",
        created_by: createdBy,
        semester: "Self-Paced",
        start_date: "2026-01-01",
        end_date: "2026-12-31",
        credits: 0,
        max_students: 9999,
        status: "active",
        grading_policy: {
          categories: [{ name: "Completion", weight: 100 }],
        },
        settings: {
          gamification_enabled: true,
          xp_multiplier: 1.0,
          self_paced: true,
        },
      })
      .select()
      .single();

    if (courseErr)
      throw new Error(
        `Course creation failed for ${tenant.slug}: ${courseErr.message}`
      );
    log(`  Created course: ${course.id}`);

    // 2d. Create modules and lessons
    let totalLessons = 0;

    for (let mi = 0; mi < modules.length; mi++) {
      const mod = modules[mi];

      // Create module
      const { data: moduleData, error: modErr } = await supabase
        .from("modules")
        .insert({
          tenant_id: tenant.id,
          course_id: course.id,
          created_by: createdBy,
          title: mod.title,
          description: mod.description,
          order_index: mi,
          status: "published",
        })
        .select()
        .single();

      if (modErr) {
        log(`  Warning: module "${mod.title}": ${modErr.message}`);
        continue;
      }

      // Create lessons for this module
      for (let li = 0; li < mod.lessons.length; li++) {
        const lesson = mod.lessons[li];

        const { error: lessonErr } = await supabase.from("lessons").insert({
          tenant_id: tenant.id,
          course_id: course.id,
          module_id: moduleData.id,
          title: lesson.title,
          description: lesson.description,
          content: lesson.content,
          order_index: li,
          duration_minutes: lesson.duration,
          learning_objectives: lesson.objectives,
          created_by: createdBy,
          status: "published",
          published_at: new Date().toISOString(),
        });

        if (lessonErr) {
          log(`  Warning: lesson "${lesson.title}": ${lessonErr.message}`);
        } else {
          totalLessons++;
        }
      }
    }
    log(`  Created ${modules.length} modules, ${totalLessons} lessons`);

    // 2e. Enroll all students in this tenant
    const { data: students } = await supabase
      .from("tenant_memberships")
      .select("user_id")
      .eq("tenant_id", tenant.id)
      .eq("status", "active")
      .eq("role", "student");

    let enrolled = 0;
    if (students) {
      for (const s of students) {
        const { error: enErr } = await supabase
          .from("course_enrollments")
          .upsert(
            {
              tenant_id: tenant.id,
              course_id: course.id,
              student_id: s.user_id,
              teacher_id: createdBy,
              status: "active",
              enrolled_at: new Date().toISOString(),
            },
            { onConflict: "course_id,student_id" }
          );
        if (!enErr) enrolled++;
      }
    }
    log(`  Enrolled ${enrolled} student(s)`);

    // 2f. Generate a class code
    const code = generateClassCode();
    const { error: ccErr } = await supabase.from("class_codes").insert({
      tenant_id: tenant.id,
      course_id: course.id,
      code,
      is_active: true,
      max_uses: 9999,
      use_count: 0,
      created_by: createdBy,
    });

    if (ccErr) {
      log(`  Warning: class code: ${ccErr.message}`);
    } else {
      log(`  Class code: ${code}`);
    }
  }

  // Done
  log("");
  log("==============================================");
  log("AI for Educators course seed complete!");
  log("==============================================");
  log("");
  log("Course: AI for Educators: Mastering Claude Code");
  log(`Modules: ${modules.length}`);
  log(
    `Lessons: ${modules.reduce((sum, m) => sum + m.lessons.length, 0)}`
  );
  log(`Tenants processed: ${tenants.length}`);
}

// ---------------------------------------------------------------------------
// RUN
// ---------------------------------------------------------------------------
main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("[seed-ai] FATAL ERROR:", err);
    process.exit(1);
  });
