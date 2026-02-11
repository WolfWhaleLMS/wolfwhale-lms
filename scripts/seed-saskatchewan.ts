/**
 * seed-saskatchewan.ts
 *
 * Populates the Wolf Whale LMS with real Saskatchewan Grade 7 curriculum data
 * for testing purposes. Creates one school, five user accounts, four courses
 * with full lessons, assignments, grades, attendance, gamification, and more.
 *
 * Run: npx tsx scripts/seed-saskatchewan.ts
 *
 * This script is idempotent - safe to run multiple times.
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
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function log(msg: string) {
  console.log(`[seed] ${msg}`);
}

function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function dateOnly(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split("T")[0];
}

// ---------------------------------------------------------------------------
// User creation helper
// ---------------------------------------------------------------------------
async function ensureUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<string> {
  // Check if user exists already
  const { data: existing } = await supabase.auth.admin.listUsers();
  const found = existing?.users?.find((u) => u.email === email);
  if (found) {
    log(`  User already exists: ${email} (${found.id})`);
    // Make sure profile exists
    await supabase.from("profiles").upsert(
      {
        id: found.id,
        first_name: firstName,
        last_name: lastName,
        timezone: "America/Regina",
      },
      { onConflict: "id" }
    );
    return found.id;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { first_name: firstName, last_name: lastName },
  });

  if (error) {
    // If error is "already registered" try to find user
    if (error.message?.includes("already been registered")) {
      const { data: list } = await supabase.auth.admin.listUsers();
      const u = list?.users?.find((u) => u.email === email);
      if (u) {
        log(`  User already registered: ${email} (${u.id})`);
        return u.id;
      }
    }
    throw new Error(`Failed to create user ${email}: ${error.message}`);
  }

  log(`  Created user: ${email} (${data.user.id})`);

  // Update profile (trigger may have created it, but upsert to be safe)
  await supabase.from("profiles").upsert(
    {
      id: data.user.id,
      first_name: firstName,
      last_name: lastName,
      timezone: "America/Regina",
    },
    { onConflict: "id" }
  );

  return data.user.id;
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------
async function main() {
  log("=== Saskatchewan Curriculum Seed Script ===");
  log(`Target: ${SUPABASE_URL}`);
  log("");

  // =========================================================================
  // 1. TENANT (School)
  // =========================================================================
  log("1. Creating tenant (Prairie View Elementary School)...");

  const { data: tenantData, error: tenantErr } = await supabase
    .from("tenants")
    .upsert(
      {
        slug: "prairie-view",
        name: "Prairie View Elementary School",
        description:
          "A welcoming K-8 school in Saskatoon, Saskatchewan, committed to nurturing every learner through culturally responsive education rooted in Treaty 6 Territory.",
        address: "1450 Cumberland Avenue South",
        city: "Saskatoon",
        state: "Saskatchewan",
        postal_code: "S7H 2L1",
        country: "CA",
        phone: "(306) 555-0147",
        subscription_plan: "growth",
        status: "active",
        settings: {
          max_users: 100,
          gamification_enabled: true,
          province: "SK",
          curriculum: "Saskatchewan Curriculum",
          school_year: "2025-2026",
          timezone: "America/Regina",
        },
        branding: {
          primary_color: "#003C99",
          secondary_color: "#812BFF",
          school_mascot: "Prairie Falcon",
        },
      },
      { onConflict: "slug" }
    )
    .select()
    .single();

  if (tenantErr) throw new Error(`Tenant creation failed: ${tenantErr.message}`);
  const tenantId = tenantData.id;
  log(`  Tenant ID: ${tenantId}`);

  // =========================================================================
  // 2. USER ACCOUNTS
  // =========================================================================
  log("");
  log("2. Creating user accounts...");

  const teacherId = await ensureUser(
    "teacher@wolfwhale.com",
    "Test1234!",
    "Sarah",
    "Mitchell"
  );

  const studentId = await ensureUser(
    "student@wolfwhale.com",
    "Test1234!",
    "Aiden",
    "Blackfoot"
  );

  // Set student grade level
  await supabase
    .from("profiles")
    .update({ grade_level: "7" })
    .eq("id", studentId);

  const parentId = await ensureUser(
    "parent@wolfwhale.com",
    "Test1234!",
    "Jessica",
    "Blackfoot"
  );

  const adminId = await ensureUser(
    "admin@wolfwhale.com",
    "Test1234!",
    "David",
    "Chen"
  );

  const superAdminId = await ensureUser(
    "superadmin@wolfwhale.com",
    "Test1234!",
    "Ryland",
    "Dupres"
  );

  // =========================================================================
  // 3. TENANT MEMBERSHIPS
  // =========================================================================
  log("");
  log("3. Creating tenant memberships...");

  const memberships = [
    { tenant_id: tenantId, user_id: teacherId, role: "teacher" },
    { tenant_id: tenantId, user_id: studentId, role: "student" },
    { tenant_id: tenantId, user_id: parentId, role: "parent" },
    { tenant_id: tenantId, user_id: adminId, role: "admin" },
    { tenant_id: tenantId, user_id: superAdminId, role: "super_admin" },
  ];

  for (const m of memberships) {
    const { error } = await supabase
      .from("tenant_memberships")
      .upsert(
        {
          ...m,
          status: "active",
          joined_at: new Date().toISOString(),
        },
        { onConflict: "tenant_id,user_id" }
      );
    if (error) {
      log(`  Warning: membership for ${m.role}: ${error.message}`);
    } else {
      log(`  Membership created/updated: ${m.role}`);
    }
  }

  // =========================================================================
  // 4. PARENT-STUDENT LINK
  // =========================================================================
  log("");
  log("4. Linking parent to student...");

  const { error: spErr } = await supabase.from("student_parents").upsert(
    {
      tenant_id: tenantId,
      student_id: studentId,
      parent_id: parentId,
      relationship: "mother",
      is_primary_contact: true,
      status: "active",
    },
    { onConflict: "tenant_id,student_id,parent_id" }
  );
  if (spErr) log(`  Warning: student_parents: ${spErr.message}`);
  else log("  Linked Jessica Blackfoot (parent) -> Aiden Blackfoot (student)");

  // =========================================================================
  // 5. COURSES
  // =========================================================================
  log("");
  log("5. Creating courses...");

  const courseDefinitions = [
    {
      name: "Mathematics 7",
      subject: "Mathematics",
      description:
        "Saskatchewan Grade 7 Mathematics covers number sense, patterns and relations, shape and space, and statistics and probability. Students develop mathematical thinking through problem-solving, reasoning, and communication, aligned with the Western and Northern Canadian Protocol (WNCP) curriculum framework.",
    },
    {
      name: "Science 7",
      subject: "Science",
      description:
        "Saskatchewan Grade 7 Science explores life science through interactions within ecosystems, physical science through mixtures and solutions and heat and temperature, and earth science through understanding Earth's crust and its processes. Students develop scientific literacy through inquiry-based learning.",
    },
    {
      name: "English Language Arts 7",
      subject: "English Language Arts",
      description:
        "Saskatchewan Grade 7 ELA develops students' abilities to comprehend, respond to, compose, and present texts across genres. Students engage with diverse Canadian and Indigenous literature, refine their writing craft, and strengthen critical thinking and media literacy skills.",
    },
    {
      name: "Social Studies 7",
      subject: "Social Studies",
      description:
        "Saskatchewan Grade 7 Social Studies examines the diverse perspectives and experiences of peoples in Pacific and Atlantic Canada. Students explore themes of identity, governance, economics, and the relationships between peoples and their environments, with emphasis on Indigenous perspectives.",
    },
  ];

  const courseIds: Record<string, string> = {};

  for (const def of courseDefinitions) {
    // Check if course exists
    const { data: existing } = await supabase
      .from("courses")
      .select("id")
      .eq("tenant_id", tenantId)
      .eq("name", def.name)
      .single();

    if (existing) {
      courseIds[def.subject] = existing.id;
      log(`  Course already exists: ${def.name} (${existing.id})`);
      continue;
    }

    const { data: c, error: cErr } = await supabase
      .from("courses")
      .insert({
        tenant_id: tenantId,
        name: def.name,
        description: def.description,
        subject: def.subject,
        grade_level: "7",
        created_by: teacherId,
        semester: "2025-2026 Full Year",
        start_date: "2025-09-02",
        end_date: "2026-06-26",
        credits: 1.0,
        max_students: 30,
        status: "active",
        grading_policy: {
          categories: [
            { name: "Homework", weight: 25 },
            { name: "Quizzes", weight: 20 },
            { name: "Projects", weight: 25 },
            { name: "Tests", weight: 20 },
            { name: "Participation", weight: 10 },
          ],
        },
        settings: {
          gamification_enabled: true,
          xp_multiplier: 1.0,
          curriculum_province: "SK",
        },
      })
      .select()
      .single();

    if (cErr) throw new Error(`Course creation failed (${def.name}): ${cErr.message}`);
    courseIds[def.subject] = c.id;
    log(`  Created course: ${def.name} (${c.id})`);
  }

  // =========================================================================
  // 6. LESSONS - Real Saskatchewan Grade 7 content
  // =========================================================================
  log("");
  log("6. Creating lessons...");

  const lessonDefinitions: Record<
    string,
    Array<{
      title: string;
      description: string;
      duration: number;
      objectives: string[];
      content: object[];
    }>
  > = {
    Mathematics: [
      {
        title: "Number Sense: Integers and Operations",
        description:
          "Explore integer operations including addition, subtraction, multiplication, and division. Understand how positive and negative numbers interact on a number line and apply integer rules to real-world contexts such as temperature changes on the Canadian prairies.",
        duration: 60,
        objectives: [
          "Represent and compare integers on a number line",
          "Perform operations with integers using concrete and pictorial models",
          "Apply integer operations to solve contextual problems",
        ],
        content: [
          {
            type: "text",
            body: "Integers include all whole numbers and their opposites. In Saskatchewan, winter temperatures often dip to -30 C or colder, giving us real-world context for integer operations. When the temperature drops from -12 C to -28 C, the change is -28 - (-12) = -16 C.",
          },
          {
            type: "text",
            body: "Rules for integer multiplication: positive x positive = positive, negative x negative = positive, positive x negative = negative. These rules extend to division as well.",
          },
        ],
      },
      {
        title: "Number Sense: Fractions, Decimals, and Percents",
        description:
          "Develop fluency converting between fractions, decimals, and percents. Apply proportional reasoning to solve problems involving ratios, rates, and percent calculations in everyday Saskatchewan contexts.",
        duration: 60,
        objectives: [
          "Convert fluently between fractions, decimals, and percents",
          "Solve problems involving ratios and rates",
          "Calculate percent of a number and apply to real-world scenarios",
        ],
        content: [
          {
            type: "text",
            body: "Every fraction can be expressed as a decimal and a percent. For example, 3/4 = 0.75 = 75%. In Saskatchewan agriculture, understanding percentages is essential - if a canola field yields 85% of its projected harvest, farmers use these calculations to plan storage and sales.",
          },
        ],
      },
      {
        title: "Patterns and Relations: Linear Equations",
        description:
          "Introduce variables and algebraic expressions. Model and solve one-step and two-step linear equations using manipulatives, diagrams, and algebraic methods. Connect patterns to equations.",
        duration: 55,
        objectives: [
          "Translate word problems into algebraic expressions and equations",
          "Solve one-step and two-step linear equations",
          "Verify solutions by substitution",
        ],
        content: [
          {
            type: "text",
            body: "A linear equation is a mathematical sentence where two expressions are equal and the variable has an exponent of 1. For example: 2x + 5 = 13. To solve, isolate the variable by performing inverse operations on both sides. Subtract 5 from both sides: 2x = 8. Divide both sides by 2: x = 4.",
          },
        ],
      },
      {
        title: "Patterns and Relations: Graphing and Table of Values",
        description:
          "Create tables of values from linear relations and plot ordered pairs on a Cartesian plane. Interpret graphs to describe real-world situations and identify patterns in data sets.",
        duration: 55,
        objectives: [
          "Create a table of values for a given linear relation",
          "Plot ordered pairs on a Cartesian plane",
          "Describe patterns and relationships from graphs",
        ],
        content: [
          {
            type: "text",
            body: "The Cartesian plane has a horizontal x-axis and a vertical y-axis that intersect at the origin (0,0). Each point on the plane is identified by an ordered pair (x, y). When we graph a linear relation like y = 2x + 1, the points form a straight line.",
          },
        ],
      },
      {
        title: "Shape and Space: Area, Perimeter, and Circumference",
        description:
          "Calculate the area and perimeter of composite shapes. Derive and apply the formulas for the circumference and area of circles. Solve practical problems involving measurement.",
        duration: 60,
        objectives: [
          "Calculate area and perimeter of composite 2-D shapes",
          "Derive and apply pi to calculate circumference and area of circles",
          "Solve contextual measurement problems",
        ],
        content: [
          {
            type: "text",
            body: "The circumference of a circle is C = pi x d (or C = 2 x pi x r). The area of a circle is A = pi x r^2. Pi is approximately 3.14159. When calculating the area of a circular grain bin base with diameter 10 m, the area is pi x 5^2 = approximately 78.54 m^2.",
          },
        ],
      },
      {
        title: "Shape and Space: Transformations and Geometry",
        description:
          "Perform and describe translations, reflections, and rotations on the Cartesian plane. Identify lines of symmetry and explore tessellations in Indigenous art patterns from Plains Cree and Metis traditions.",
        duration: 55,
        objectives: [
          "Perform translations, reflections, and rotations on a coordinate plane",
          "Identify and describe lines of symmetry",
          "Recognize transformations in Indigenous art and beadwork patterns",
        ],
        content: [
          {
            type: "text",
            body: "A translation slides a shape without changing its size or orientation. A reflection flips a shape over a line of symmetry. A rotation turns a shape around a fixed point. Plains Cree and Metis beadwork designs often feature symmetrical patterns that demonstrate all three types of transformations.",
          },
        ],
      },
      {
        title: "Statistics: Data Collection and Analysis",
        description:
          "Design and conduct surveys and experiments. Organize data using frequency tables, stem-and-leaf plots, and histograms. Calculate and interpret measures of central tendency.",
        duration: 55,
        objectives: [
          "Design and conduct data collection activities",
          "Organize data using appropriate graphical representations",
          "Calculate mean, median, and mode and interpret their significance",
        ],
        content: [
          {
            type: "text",
            body: "The three measures of central tendency are mean (average), median (middle value when ordered), and mode (most frequent value). For example, if students' test scores are 72, 85, 85, 90, 93, the mean is 85, the median is 85, and the mode is 85. Different data sets can show how these measures tell different stories about the data.",
          },
        ],
      },
      {
        title: "Probability: Theoretical and Experimental",
        description:
          "Express probability as a fraction, decimal, and percent. Compare theoretical and experimental probability through hands-on experiments. Apply probability concepts to make predictions.",
        duration: 50,
        objectives: [
          "Express probability as a fraction, decimal, and percent",
          "Compare theoretical and experimental probability",
          "Use probability to make predictions about real-world events",
        ],
        content: [
          {
            type: "text",
            body: "Probability measures how likely an event is to occur, expressed as a value from 0 (impossible) to 1 (certain). Theoretical probability is calculated using P(event) = favourable outcomes / total possible outcomes. Experimental probability is determined by performing trials and recording results. As the number of trials increases, experimental probability tends to approach theoretical probability.",
          },
        ],
      },
    ],
    Science: [
      {
        title: "Interactions within Ecosystems: Living Things and Their Environment",
        description:
          "Examine how organisms interact with each other and their environment in Saskatchewan ecosystems such as the northern boreal forest, aspen parkland, and grasslands. Identify producers, consumers, and decomposers.",
        duration: 60,
        objectives: [
          "Identify biotic and abiotic components of an ecosystem",
          "Classify organisms as producers, consumers, or decomposers",
          "Describe Saskatchewan's major ecosystems and ecozones",
        ],
        content: [
          {
            type: "text",
            body: "An ecosystem includes all the living (biotic) and non-living (abiotic) things in an area that interact with each other. Saskatchewan has diverse ecosystems: the boreal forest in the north with spruce, pine, and woodland caribou; the aspen parkland in the central region; and the mixed-grass prairie in the south with species like pronghorn antelope and burrowing owls.",
          },
        ],
      },
      {
        title: "Ecosystems: Food Webs and Energy Flow",
        description:
          "Trace the flow of energy through food chains and food webs. Construct food webs for Saskatchewan ecosystems and analyze the effects of changes to populations within the web.",
        duration: 55,
        objectives: [
          "Construct food chains and food webs for Saskatchewan ecosystems",
          "Trace energy flow through trophic levels",
          "Predict the impact of population changes on a food web",
        ],
        content: [
          {
            type: "text",
            body: "Energy flows through an ecosystem from producers to primary consumers to secondary consumers and beyond. In a Saskatchewan grassland food web: grasses and wildflowers (producers) are eaten by grasshoppers and prairie voles (primary consumers), which are eaten by northern harriers and bull snakes (secondary consumers). If the grasshopper population declines due to drought, both the voles (less competition) and the harriers (less food) are affected.",
          },
        ],
      },
      {
        title: "Mixtures and Solutions: Pure Substances and Mixtures",
        description:
          "Distinguish between pure substances and mixtures. Classify mixtures as homogeneous (solutions) or heterogeneous. Explore the particle model of matter to explain dissolving.",
        duration: 55,
        objectives: [
          "Distinguish between pure substances and mixtures",
          "Classify mixtures as solutions (homogeneous) or mechanical mixtures (heterogeneous)",
          "Use the particle model of matter to explain dissolving",
        ],
        content: [
          {
            type: "text",
            body: "A pure substance has only one type of particle (element or compound). A mixture contains two or more pure substances. Solutions are homogeneous mixtures where the solute is evenly distributed in the solvent - like salt dissolved in water from Saskatchewan's many saline lakes. Mechanical mixtures are heterogeneous - like the mixed gravel and sand found in glacial deposits across the prairies.",
          },
        ],
      },
      {
        title: "Mixtures and Solutions: Concentration and Separation",
        description:
          "Investigate concentration of solutions using qualitative and quantitative methods. Explore separation techniques including filtration, evaporation, and distillation. Connect to water treatment in Saskatchewan communities.",
        duration: 60,
        objectives: [
          "Describe concentration qualitatively (dilute vs. concentrated) and quantitatively",
          "Perform separation techniques: filtration, evaporation, distillation",
          "Explain how water treatment plants in Saskatchewan communities purify water",
        ],
        content: [
          {
            type: "text",
            body: "Concentration describes how much solute is dissolved in a given amount of solvent. A saturated solution cannot dissolve any more solute at a given temperature. In Saskatchewan, potash mining involves dissolving underground potash deposits with water, then evaporating the solution to recover the potash crystals - a real-world separation technique that Saskatchewan leads the world in.",
          },
        ],
      },
      {
        title: "Heat and Temperature: Particle Model and Thermal Energy",
        description:
          "Differentiate between heat and temperature. Use the particle model of matter to explain thermal expansion, states of matter, and heat transfer through conduction, convection, and radiation.",
        duration: 55,
        objectives: [
          "Differentiate between heat (energy) and temperature (measure of kinetic energy)",
          "Explain thermal expansion using the particle model",
          "Describe conduction, convection, and radiation with examples",
        ],
        content: [
          {
            type: "text",
            body: "Temperature measures the average kinetic energy of particles in a substance, while heat is the total thermal energy transferred from a warmer object to a cooler one. In Saskatchewan, where temperatures range from +40 C in summer to -40 C in winter, understanding thermal energy is practical: bridges have expansion joints because materials expand when heated, and homes are insulated to reduce heat transfer through conduction.",
          },
        ],
      },
      {
        title: "Heat and Temperature: Sources of Thermal Energy",
        description:
          "Investigate natural and technological sources of thermal energy. Explore how heating and cooling systems work, and examine energy efficiency in Saskatchewan homes and buildings.",
        duration: 55,
        objectives: [
          "Identify natural and technological sources of thermal energy",
          "Explain how heating systems (furnaces, geothermal) work",
          "Analyze energy efficiency strategies for Saskatchewan climates",
        ],
        content: [
          {
            type: "text",
            body: "Sources of thermal energy include the sun (solar radiation), combustion of fuels (natural gas, common in Saskatchewan homes), electricity, geothermal energy, and friction. Saskatchewan's extreme cold makes home heating essential. A high-efficiency furnace converts over 95% of natural gas energy into heat. Geothermal heat pumps, which use the stable underground temperature of about 10 C, are growing in popularity across the province.",
          },
        ],
      },
      {
        title: "Earth's Crust: Minerals and Rocks",
        description:
          "Identify and classify minerals and rocks. Describe the rock cycle and explain how Saskatchewan's geological history has shaped its landscape, resources, and soil composition.",
        duration: 60,
        objectives: [
          "Identify common minerals using physical properties",
          "Classify rocks as igneous, sedimentary, or metamorphic",
          "Describe the rock cycle and relate it to Saskatchewan's geology",
        ],
        content: [
          {
            type: "text",
            body: "Saskatchewan's geology tells the story of ancient seas, volcanic activity, and glaciation. The province sits on the Western Canadian Sedimentary Basin, which holds vast deposits of potash (the mineral sylvite), uranium (found in the Athabasca Basin in northern SK), and oil. The prairies' flat landscape was shaped by retreating glaciers roughly 10,000 years ago, which deposited the rich sediment that forms Saskatchewan's famous agricultural soils.",
          },
        ],
      },
      {
        title: "Earth's Crust: Geological Processes and Resources",
        description:
          "Examine geological processes including weathering, erosion, and plate tectonics. Investigate Saskatchewan's natural resources and the environmental impact of resource extraction.",
        duration: 55,
        objectives: [
          "Describe weathering and erosion processes",
          "Explain the theory of plate tectonics at an introductory level",
          "Analyze the environmental impact of mining and resource extraction in Saskatchewan",
        ],
        content: [
          {
            type: "text",
            body: "Weathering breaks rocks into smaller pieces through physical processes (frost wedging, common in Saskatchewan's freeze-thaw cycles) and chemical processes (acid rain dissolving limestone). Erosion transports weathered material by wind, water, or ice. Saskatchewan's landscape shows dramatic evidence of erosion - the South Saskatchewan River valley near Saskatoon was carved by glacial meltwater. The province's mining industry (potash, uranium, gold) must manage environmental impacts including tailings management and land reclamation.",
          },
        ],
      },
    ],
    "English Language Arts": [
      {
        title: "Narrative Writing: Crafting Stories with Voice",
        description:
          "Develop narrative writing skills by studying story structure, character development, and voice. Read and analyze narratives by Saskatchewan and Indigenous authors. Compose original short stories set in familiar contexts.",
        duration: 55,
        objectives: [
          "Identify elements of narrative structure (exposition, rising action, climax, falling action, resolution)",
          "Develop characters using dialogue, action, and description",
          "Write an original narrative with a clear voice and sense of place",
        ],
        content: [
          {
            type: "text",
            body: "A strong narrative has compelling characters, a clear setting, and a well-paced plot. Voice - the unique style and personality of the writer - is what makes a story memorable. Saskatchewan authors like Joseph Boyden and Connie Baird demonstrate how setting can become a character itself. When writing about places you know - a hockey rink in January, a lake in summer, a prairie thunderstorm - your authentic voice emerges naturally.",
          },
        ],
      },
      {
        title: "Poetry Analysis: Sound, Image, and Meaning",
        description:
          "Explore poetry through the study of poetic devices including metaphor, simile, imagery, alliteration, and rhythm. Analyze poems by Canadian and Indigenous poets. Compose original poems using studied techniques.",
        duration: 50,
        objectives: [
          "Identify and explain poetic devices in published poems",
          "Analyze how poetic devices contribute to meaning and effect",
          "Compose original poems using at least three poetic devices",
        ],
        content: [
          {
            type: "text",
            body: "Poetry uses condensed language to create vivid images and emotions. Key devices include: metaphor (a direct comparison - 'the prairie is a golden ocean'), simile (comparison using like or as - 'the snow fell like feathers'), imagery (sensory language that helps readers see, hear, feel, taste, or smell), and alliteration (repetition of consonant sounds - 'silent snow softly settling'). Indigenous oral traditions are rich in poetic expression, often connecting language to the land.",
          },
        ],
      },
      {
        title: "Persuasive Essay: Building Arguments",
        description:
          "Learn to construct persuasive arguments using claims, evidence, and reasoning. Study rhetorical appeals (ethos, pathos, logos). Draft and revise a persuasive essay on a relevant community issue.",
        duration: 60,
        objectives: [
          "Construct a thesis statement and supporting arguments",
          "Use evidence (facts, statistics, expert opinions) to support claims",
          "Identify and apply rhetorical appeals: ethos, pathos, logos",
        ],
        content: [
          {
            type: "text",
            body: "A persuasive essay aims to convince the reader to accept a particular position. The structure includes: introduction with a hook and clear thesis statement, body paragraphs each presenting one argument with evidence, acknowledgment and rebuttal of counterarguments, and a conclusion that reinforces the thesis. Strong persuasive writing uses logos (logical reasoning), pathos (emotional appeal), and ethos (establishing credibility).",
          },
        ],
      },
      {
        title: "Research Skills: Inquiry and Information Literacy",
        description:
          "Develop research skills including formulating inquiry questions, evaluating sources for credibility, taking notes, avoiding plagiarism, and citing sources. Apply the Saskatchewan inquiry process to a research topic.",
        duration: 55,
        objectives: [
          "Formulate focused inquiry questions on a research topic",
          "Evaluate sources for credibility, relevance, and bias",
          "Take notes, paraphrase, and cite sources properly to avoid plagiarism",
        ],
        content: [
          {
            type: "text",
            body: "Good research begins with a strong inquiry question - one that cannot be answered with a simple yes or no. The CRAAP test helps evaluate sources: Currency (when was it published?), Relevance (does it relate to your topic?), Authority (who wrote it and what are their credentials?), Accuracy (is it supported by evidence?), Purpose (why was it written - to inform, persuade, sell?). Always distinguish between primary sources (original documents, interviews) and secondary sources (textbooks, articles about events).",
          },
        ],
      },
      {
        title: "Novel Study: Character, Theme, and Context",
        description:
          "Engage in a deep study of a novel appropriate for Grade 7, exploring character development, themes, literary devices, and historical or cultural context. Participate in literature circle discussions.",
        duration: 60,
        objectives: [
          "Analyze character development across a novel",
          "Identify and explain central themes with textual evidence",
          "Connect the novel's themes to personal experience and broader contexts",
        ],
        content: [
          {
            type: "text",
            body: "A novel study goes beyond plot summary to explore how characters change, what themes the author develops, and how the story connects to the world. Character analysis examines motivations, conflicts, relationships, and growth. Themes are the big ideas or messages (e.g., identity, belonging, justice, resilience). When discussing novels, use the PEE structure: make a Point, provide Evidence from the text, and Explain how the evidence supports your point.",
          },
        ],
      },
      {
        title: "Grammar and Mechanics: Sentence Craft",
        description:
          "Strengthen grammar and writing mechanics including sentence variety, punctuation, subject-verb agreement, pronoun usage, and paragraph structure. Apply conventions in context through editing and revision activities.",
        duration: 50,
        objectives: [
          "Write varied sentences (simple, compound, complex)",
          "Apply punctuation rules including commas, semicolons, and apostrophes correctly",
          "Edit and revise writing for grammatical accuracy",
        ],
        content: [
          {
            type: "text",
            body: "Effective writing uses a mix of sentence types: simple sentences (one independent clause) for emphasis, compound sentences (two independent clauses joined by a conjunction or semicolon) for balance, and complex sentences (one independent and one or more dependent clauses) for showing relationships between ideas. Example: 'The wind howled.' (simple) 'The wind howled, and the snow piled up against the door.' (compound) 'Although the wind howled all night, the students arrived at school on time.' (complex)",
          },
        ],
      },
      {
        title: "Oral Presentation: Speaking with Confidence",
        description:
          "Develop oral communication skills including organizing presentations, using visual aids, adjusting tone and pace, and engaging an audience. Practice and deliver a formal presentation to the class.",
        duration: 55,
        objectives: [
          "Organize a presentation with a clear introduction, body, and conclusion",
          "Use appropriate verbal and non-verbal communication techniques",
          "Deliver a presentation with confidence and audience awareness",
        ],
        content: [
          {
            type: "text",
            body: "Effective oral presentations require preparation, practice, and presence. Structure your talk with a strong opening (a question, a surprising fact, a brief story), organized main points, and a memorable conclusion. Verbal techniques include varying your pace, volume, and tone. Non-verbal techniques include eye contact, purposeful gestures, and confident posture. Visual aids should support your message, not replace it - use images and keywords rather than walls of text.",
          },
        ],
      },
      {
        title: "Media Literacy: Analyzing Digital Texts",
        description:
          "Develop critical media literacy skills by analyzing how media texts (advertisements, social media, news) are constructed to influence audiences. Examine bias, perspective, and purpose in digital media.",
        duration: 50,
        objectives: [
          "Analyze how media texts are constructed using text, image, sound, and layout",
          "Identify bias and perspective in news and social media",
          "Create a media text that demonstrates understanding of media conventions",
        ],
        content: [
          {
            type: "text",
            body: "Media literacy is the ability to access, analyze, evaluate, and create media in various forms. Key questions for analyzing any media text: Who created this message and why? What techniques are used to attract and hold attention? What values and points of view are represented - or missing? How might different people interpret this message? In the age of social media, understanding algorithms, echo chambers, and the difference between news and opinion is an essential skill.",
          },
        ],
      },
    ],
    "Social Studies": [
      {
        title: "Pacific Canada: Geography, Peoples, and Cultures",
        description:
          "Explore the geography, Indigenous peoples, and cultural diversity of British Columbia and the Pacific region. Examine the impact of geography on settlement patterns and the experiences of First Nations, Metis, and immigrant communities.",
        duration: 55,
        objectives: [
          "Describe the physical geography of Pacific Canada and its influence on human activity",
          "Explain the historical and contemporary experiences of Pacific First Nations",
          "Analyze the contributions of diverse cultural communities to Pacific Canada",
        ],
        content: [
          {
            type: "text",
            body: "Pacific Canada's geography - from coastal rainforests to mountain ranges to interior plateaus - has profoundly shaped human settlement. Indigenous peoples of the Pacific coast, including the Haida, Kwakwaka'wakw, and Coast Salish, developed rich cultures adapted to the marine environment. The potlatch ceremony, totem poles, and cedar longhouses reflect deep connections to the land and sea. Successive waves of immigration - Chinese railway workers in the 1880s, Japanese Canadians (who faced internment during WWII), South Asian communities, and more recent arrivals - have made BC one of Canada's most culturally diverse regions.",
          },
        ],
      },
      {
        title: "Atlantic Canada: Geography, Peoples, and Heritage",
        description:
          "Study the geography, history, and cultural heritage of Atlantic Canada. Examine the experiences of the Mi'kmaq, Acadians, and other communities. Explore the impact of the cod fishery and resource-based economies.",
        duration: 55,
        objectives: [
          "Describe the physical geography and natural resources of Atlantic Canada",
          "Explain the historical significance of the Mi'kmaq, Acadian, and settler communities",
          "Analyze the impact of the cod moratorium on Atlantic Canadian communities",
        ],
        content: [
          {
            type: "text",
            body: "Atlantic Canada - New Brunswick, Nova Scotia, Prince Edward Island, and Newfoundland and Labrador - has a geography shaped by the ocean. The Mi'kmaq are the Indigenous people of this region, with a history spanning over 10,000 years. The Acadians, descendants of French settlers, developed a distinct culture before many were forcibly deported in 1755 (the Great Expulsion). The cod fishery sustained communities for centuries until overfishing led to the 1992 moratorium, devastating coastal communities and forcing thousands to relocate or retrain.",
          },
        ],
      },
      {
        title: "Diverse Perspectives: Identity and Belonging in Canada",
        description:
          "Examine how identity is shaped by culture, language, history, and place. Study diverse perspectives including Indigenous worldviews, Francophone identity, and the experiences of immigrant and refugee communities across Canada.",
        duration: 60,
        objectives: [
          "Explain how factors such as culture, language, and history shape personal and collective identity",
          "Compare diverse perspectives on belonging and citizenship in Canada",
          "Demonstrate respect for diverse worldviews, particularly Indigenous perspectives",
        ],
        content: [
          {
            type: "text",
            body: "Identity is complex and layered - shaped by family, culture, language, religion, gender, geography, and personal experiences. In Canada, the concept of identity is enriched by the diversity of Indigenous nations (First Nations, Metis, and Inuit peoples each with distinct cultures), the two official languages (English and French), and the many cultures brought by immigrants from around the world. The Truth and Reconciliation Commission's Calls to Action remind all Canadians of the importance of understanding the history and ongoing impacts of residential schools on Indigenous identity and communities.",
          },
        ],
      },
      {
        title: "Diverse Perspectives: Treaties and Reconciliation",
        description:
          "Study the significance of treaties in Saskatchewan and across Canada. Examine the Treaty relationship, the impact of residential schools, and the ongoing journey of truth and reconciliation.",
        duration: 60,
        objectives: [
          "Explain the purpose and significance of the Numbered Treaties in Saskatchewan",
          "Describe the impact of residential schools on Indigenous communities",
          "Identify current reconciliation efforts and the responsibilities of all Treaty people",
        ],
        content: [
          {
            type: "text",
            body: "Saskatchewan is covered by Treaties 2, 4, 5, 6, 8, and 10. These treaties were agreements between the Crown and First Nations that were meant to establish mutual obligations - Indigenous peoples agreed to share the land, while the Crown promised support for education, health care, and economic development. However, the treaty promises were not fully honoured. Residential schools, which operated from the 1880s to the 1990s, forcibly removed Indigenous children from their families in an attempt to eliminate Indigenous languages and cultures. The Truth and Reconciliation Commission documented these experiences and issued 94 Calls to Action. As Treaty people, all Saskatchewan residents share responsibility for reconciliation.",
          },
        ],
      },
      {
        title: "Government and Democracy: How Canada is Governed",
        description:
          "Explore Canada's system of government including the three levels of government, the parliamentary system, the Charter of Rights and Freedoms, and the role of citizens in a democracy.",
        duration: 55,
        objectives: [
          "Describe the three levels of Canadian government and their responsibilities",
          "Explain how laws are made in a parliamentary democracy",
          "Analyze the rights and responsibilities outlined in the Canadian Charter of Rights and Freedoms",
        ],
        content: [
          {
            type: "text",
            body: "Canada is a constitutional monarchy and parliamentary democracy with three levels of government: federal (Ottawa - national defense, immigration, banking), provincial/territorial (e.g., Regina for Saskatchewan - education, health care, highways), and municipal (cities, towns, rural municipalities - local roads, water, recreation). Laws are proposed as bills, debated in the House of Commons and Senate, and require Royal Assent to become law. The Canadian Charter of Rights and Freedoms (1982) guarantees fundamental freedoms, democratic rights, mobility rights, legal rights, equality rights, and language rights.",
          },
        ],
      },
      {
        title: "Government and Democracy: Citizen Participation and Justice",
        description:
          "Examine how citizens participate in democracy beyond voting. Study civic engagement, advocacy, and the justice system. Explore historical and contemporary examples of citizens working for change in Saskatchewan and Canada.",
        duration: 55,
        objectives: [
          "Identify ways citizens can participate in the democratic process",
          "Describe the Canadian justice system and the rights of the accused",
          "Analyze examples of citizen advocacy and social change movements in Saskatchewan",
        ],
        content: [
          {
            type: "text",
            body: "Democracy depends on active citizen participation. Beyond voting (available to Canadian citizens aged 18+), citizens can write to elected officials, attend town halls, join political parties, organize petitions, participate in protests, volunteer for community organizations, and serve on school community councils. Saskatchewan has a proud history of citizen-led change: Tommy Douglas and the CCF pioneered universal health care (Medicare) starting in 1962, and Indigenous activists have led movements for treaty rights and land claims. Young people can engage through student councils, community service, and youth advisory committees.",
          },
        ],
      },
      {
        title: "Economics and Resources: How Economies Work",
        description:
          "Introduce basic economic concepts including needs vs. wants, supply and demand, types of economic systems, and the role of natural resources in Saskatchewan's economy.",
        duration: 55,
        objectives: [
          "Distinguish between needs and wants; goods and services",
          "Explain the concepts of supply, demand, and market price",
          "Describe how natural resources drive Saskatchewan's economy",
        ],
        content: [
          {
            type: "text",
            body: "An economy is the system by which a society produces, distributes, and consumes goods and services. Saskatchewan's economy is driven by its natural resources: agriculture (the province produces about 40% of Canada's wheat and is a major canola producer), mining (world's largest potash producer, significant uranium production), oil and gas, and forestry. Understanding supply and demand helps explain why commodity prices fluctuate - when global demand for potash increases (as countries need more fertilizer), Saskatchewan potash mines expand production and the province benefits economically.",
          },
        ],
      },
      {
        title: "Economics and Resources: Sustainability and Stewardship",
        description:
          "Examine the environmental impact of resource extraction and economic activity. Explore concepts of sustainability, stewardship, and the responsibility to balance economic development with environmental protection.",
        duration: 55,
        objectives: [
          "Define sustainability and explain its importance for future generations",
          "Analyze the environmental impact of resource extraction in Saskatchewan",
          "Evaluate strategies for balancing economic development with environmental stewardship",
        ],
        content: [
          {
            type: "text",
            body: "Sustainability means meeting present needs without compromising the ability of future generations to meet their own needs. Saskatchewan faces sustainability challenges: agricultural practices must balance productivity with soil health and water protection; mining operations must manage waste and reclaim land; and the province's reliance on fossil fuels must be balanced with transitions to renewable energy sources like wind and solar. Indigenous perspectives on stewardship emphasize the interconnectedness of all living things and the responsibility to care for the land for seven generations into the future.",
          },
        ],
      },
    ],
  };

  const lessonIds: Record<string, string[]> = {};

  for (const [subject, lessons] of Object.entries(lessonDefinitions)) {
    const courseId = courseIds[subject];
    if (!courseId) {
      log(`  Warning: no course ID for subject ${subject}, skipping lessons`);
      continue;
    }

    lessonIds[subject] = [];

    for (let i = 0; i < lessons.length; i++) {
      const lesson = lessons[i];

      // Check if lesson already exists
      const { data: existingLesson } = await supabase
        .from("lessons")
        .select("id")
        .eq("course_id", courseId)
        .eq("title", lesson.title)
        .single();

      if (existingLesson) {
        lessonIds[subject].push(existingLesson.id);
        continue;
      }

      const { data: l, error: lErr } = await supabase
        .from("lessons")
        .insert({
          tenant_id: tenantId,
          course_id: courseId,
          title: lesson.title,
          description: lesson.description,
          content: lesson.content,
          order_index: i + 1,
          duration_minutes: lesson.duration,
          learning_objectives: lesson.objectives,
          created_by: teacherId,
          status: "published",
          published_at: daysAgo(30),
        })
        .select()
        .single();

      if (lErr) {
        log(`  Warning: lesson "${lesson.title}": ${lErr.message}`);
        continue;
      }
      lessonIds[subject].push(l.id);
    }
    log(`  Created/verified ${lessons.length} lessons for ${subject}`);
  }

  // =========================================================================
  // 7. COURSE ENROLLMENTS
  // =========================================================================
  log("");
  log("7. Enrolling student in all courses...");

  for (const [subject, courseId] of Object.entries(courseIds)) {
    const { error: enErr } = await supabase.from("course_enrollments").upsert(
      {
        tenant_id: tenantId,
        course_id: courseId,
        student_id: studentId,
        teacher_id: teacherId,
        status: "active",
        enrolled_at: daysAgo(60),
      },
      { onConflict: "course_id,student_id" }
    );
    if (enErr) log(`  Warning: enrollment for ${subject}: ${enErr.message}`);
    else log(`  Enrolled in ${subject}`);
  }

  // =========================================================================
  // 8. ASSIGNMENTS
  // =========================================================================
  log("");
  log("8. Creating assignments...");

  const assignmentDefinitions: Array<{
    courseSubject: string;
    title: string;
    description: string;
    instructions: string;
    type: string;
    category: string;
    maxPoints: number;
    dueInDays: number;
    status: string;
  }> = [
    // Math
    {
      courseSubject: "Mathematics",
      title: "Number Operations Quiz",
      description:
        "Complete a quiz covering integer operations, order of operations, and problem solving with positive and negative numbers.",
      instructions:
        "Answer all 20 questions. Show your work for full marks. You may use a calculator for questions 15-20 only. Time limit: 45 minutes.",
      type: "quiz",
      category: "Quizzes",
      maxPoints: 100,
      dueInDays: -5,
      status: "assigned",
    },
    {
      courseSubject: "Mathematics",
      title: "Geometry Project: Design a Community Space",
      description:
        "Apply your knowledge of area, perimeter, and circumference to design a community park or garden for a Saskatchewan town. Include calculations for all shapes used in your design.",
      instructions:
        "1. Design a park layout using at least 5 different shapes (include at least one circle and one composite shape).\n2. Draw your design on graph paper or use a digital tool.\n3. Calculate the area and perimeter of each shape.\n4. Write a 200-word explanation of your design choices.\n5. Present your total area and cost estimate (assume $15/m^2 for grass, $25/m^2 for garden beds).",
      type: "project",
      category: "Projects",
      maxPoints: 100,
      dueInDays: 12,
      status: "assigned",
    },
    // Science
    {
      courseSubject: "Science",
      title: "Ecosystem Lab Report",
      description:
        "Complete a lab report analyzing a local Saskatchewan ecosystem. Document your observations of biotic and abiotic factors and construct a food web.",
      instructions:
        "Using the data collected during our field observation at the school grounds:\n1. Title and Hypothesis\n2. Materials and Procedure (already provided - rewrite in your own words)\n3. Observations: list at least 8 biotic and 5 abiotic factors observed\n4. Construct a food web with at least 10 organisms\n5. Analysis: answer the 5 discussion questions\n6. Conclusion: Was your hypothesis supported? What would you investigate next?\n\nFormat: typed, double-spaced, 12pt font. Include labeled diagrams.",
      type: "homework",
      category: "Homework",
      maxPoints: 100,
      dueInDays: -3,
      status: "assigned",
    },
    {
      courseSubject: "Science",
      title: "Mixtures Experiment Write-up",
      description:
        "Document the separation techniques experiment. Explain which technique is most effective for each type of mixture and relate your findings to water treatment in Saskatchewan.",
      instructions:
        "Write up your experiment results from the mixtures separation lab:\n1. Create a data table showing each mixture, the separation technique used, and the results\n2. Explain why each technique works based on the particle model of matter\n3. Rank the techniques from most to least effective for water purification\n4. Research and describe one step in the Saskatoon water treatment process\n5. Include a labeled diagram of one separation technique",
      type: "homework",
      category: "Homework",
      maxPoints: 80,
      dueInDays: 8,
      status: "assigned",
    },
    // ELA
    {
      courseSubject: "English Language Arts",
      title: "Persuasive Essay Draft",
      description:
        "Write a persuasive essay on a community issue relevant to Saskatchewan youth. Take a clear position and support it with evidence and reasoning.",
      instructions:
        "Write a 500-700 word persuasive essay on ONE of these topics:\n- Should Saskatchewan schools have a later start time?\n- Should students be required to learn an Indigenous language?\n- Should single-use plastics be banned in Saskatchewan?\n\nRequirements:\n- Clear thesis statement in the introduction\n- At least 3 body paragraphs, each with a claim, evidence, and reasoning\n- Address and rebut at least one counterargument\n- Use at least 2 credible sources (cited)\n- Strong concluding paragraph\n- Proper grammar, spelling, and MLA formatting",
      type: "homework",
      category: "Homework",
      maxPoints: 100,
      dueInDays: -7,
      status: "assigned",
    },
    {
      courseSubject: "English Language Arts",
      title: "Novel Study Response Journal",
      description:
        "Complete a response journal for our class novel study. Include personal connections, character analysis, and thematic reflections for each section of the novel.",
      instructions:
        "For each of the 4 sections of the novel, write a 150-200 word response that includes:\n- A brief summary (2-3 sentences)\n- A personal connection or reaction\n- Analysis of one character's development in that section\n- One significant quote with your explanation of its importance\n- A prediction or question for the next section\n\nTotal: 4 entries, approximately 600-800 words total.\nDue with your literature circle discussion notes.",
      type: "homework",
      category: "Homework",
      maxPoints: 80,
      dueInDays: 10,
      status: "assigned",
    },
    {
      courseSubject: "English Language Arts",
      title: "Poetry Portfolio",
      description:
        "Create a portfolio of 5 original poems demonstrating your use of poetic devices. Include a reflection on your creative process.",
      instructions:
        "Create a poetry portfolio containing:\n1. Five original poems, each demonstrating at least 2 different poetic devices\n2. Required poem types: one free verse, one haiku (or tanka), one poem inspired by a Saskatchewan landscape, and two of your choice\n3. For each poem, annotate the poetic devices you used (underline and label)\n4. Write a 200-word reflection on your creative process: What inspired you? What was challenging? What are you most proud of?\n5. Include a title page with an original illustration or design\n\nAssessment based on: creativity, use of poetic devices, quality of reflection, and presentation.",
      type: "project",
      category: "Projects",
      maxPoints: 100,
      dueInDays: 18,
      status: "assigned",
    },
    // Social Studies
    {
      courseSubject: "Social Studies",
      title: "Government Research Project",
      description:
        "Research one of the three levels of Canadian government and present how it impacts daily life in Saskatchewan. Include an interview with a local government representative or analysis of a recent policy decision.",
      instructions:
        "Choose ONE level of government (federal, provincial, or municipal) and research:\n1. Structure: How is this level of government organized? (diagram required)\n2. Responsibilities: What services does this level provide that affect your daily life in Saskatchewan?\n3. Decision-Making: How are decisions made? Trace the path of a recent bill or bylaw.\n4. Case Study: Choose a recent decision or policy and explain its impact on Saskatchewan communities.\n5. Citizen Voice: How can citizens influence decisions at this level?\n\nFormat: Written report (800-1000 words) OR a 5-minute presentation with visual aids.\nInclude a bibliography with at least 4 sources.",
      type: "project",
      category: "Projects",
      maxPoints: 100,
      dueInDays: -2,
      status: "assigned",
    },
    {
      courseSubject: "Social Studies",
      title: "Cultural Perspectives Reflection",
      description:
        "Write a reflective essay examining how diverse perspectives contribute to Canadian identity. Include consideration of Indigenous worldviews, Francophone identity, and immigrant experiences.",
      instructions:
        "Write a 400-600 word reflective essay responding to this question:\n'How do diverse perspectives strengthen Canadian identity and community?'\n\nYour essay should:\n- Reference at least 2 different cultural perspectives studied in class\n- Include specific examples from our Treaty education discussions\n- Make a personal connection to your own identity and community\n- Demonstrate respectful and thoughtful engagement with diverse worldviews\n- Use the PEE (Point, Evidence, Explain) structure for your main paragraphs\n\nThis is a personal reflection - there is no single correct answer. You will be assessed on depth of thought, use of course concepts, and quality of writing.",
      type: "homework",
      category: "Homework",
      maxPoints: 60,
      dueInDays: 5,
      status: "assigned",
    },
  ];

  const assignmentIds: Record<string, string[]> = {};

  for (const asgn of assignmentDefinitions) {
    const courseId = courseIds[asgn.courseSubject];
    if (!courseId) continue;

    if (!assignmentIds[asgn.courseSubject])
      assignmentIds[asgn.courseSubject] = [];

    // Check if assignment already exists
    const { data: existing } = await supabase
      .from("assignments")
      .select("id")
      .eq("course_id", courseId)
      .eq("title", asgn.title)
      .single();

    if (existing) {
      assignmentIds[asgn.courseSubject].push(existing.id);
      continue;
    }

    const { data: a, error: aErr } = await supabase
      .from("assignments")
      .insert({
        tenant_id: tenantId,
        course_id: courseId,
        title: asgn.title,
        description: asgn.description,
        instructions: asgn.instructions,
        type: asgn.type,
        category: asgn.category,
        created_by: teacherId,
        due_date: daysFromNow(asgn.dueInDays),
        available_date: daysAgo(30),
        max_points: asgn.maxPoints,
        submission_type: "text",
        allow_late_submission: true,
        late_penalty_per_day: 5,
        late_submission_days: 5,
        max_attempts: 1,
        status: asgn.status,
      })
      .select()
      .single();

    if (aErr) {
      log(`  Warning: assignment "${asgn.title}": ${aErr.message}`);
      continue;
    }
    assignmentIds[asgn.courseSubject].push(a.id);
    log(`  Created assignment: ${asgn.title}`);
  }

  // =========================================================================
  // 9. SUBMISSIONS & GRADES for completed assignments
  // =========================================================================
  log("");
  log("9. Creating submissions and grades...");

  // Grade data for past-due assignments (indices into assignmentIds arrays)
  const gradeData = [
    {
      subject: "Mathematics",
      index: 0, // Number Operations Quiz
      points: 78,
      percentage: 78,
      letter: "B+",
      feedback:
        "Good work on integer operations, Aiden. You showed strong understanding of addition and subtraction with integers. Watch your signs when multiplying negatives - you lost marks on questions 8 and 12. Review the rules for order of operations with integers. Overall a solid effort!",
      submissionText:
        "Completed quiz - all work shown on attached pages. I found the word problems involving temperature changes the easiest because we can relate them to real Saskatchewan weather.",
    },
    {
      subject: "Science",
      index: 0, // Ecosystem Lab Report
      points: 85,
      percentage: 85,
      letter: "A-",
      feedback:
        "Excellent observation skills, Aiden! Your food web was detailed and accurate with 12 organisms properly connected. Your analysis of the abiotic factors was thorough. To improve: your conclusion could have been more specific about what you would investigate next - try to connect it to a testable hypothesis. The diagram of the food web was well-labeled.",
      submissionText:
        "Lab Report: Schoolyard Ecosystem Analysis\n\nHypothesis: The school grounds contain a diverse ecosystem with multiple trophic levels.\n\nBiotic factors observed: trembling aspen trees, Kentucky bluegrass, dandelions, white clover, Richardson's ground squirrels, American robins, house sparrows, cabbage white butterflies, ants, earthworms, mushrooms, lichens on rocks.\n\nAbiotic factors: soil (clay-rich), sunlight, wind, temperature (12 C), moisture in soil, rocks.\n\nFood web constructed with 12 organisms showing producers, primary consumers, secondary consumers, and decomposers.",
    },
    {
      subject: "English Language Arts",
      index: 0, // Persuasive Essay Draft
      points: 92,
      percentage: 92,
      letter: "A",
      feedback:
        "Outstanding essay, Aiden! Your thesis was clear and compelling, and you supported your arguments with strong evidence from credible sources. I was particularly impressed by your counterargument paragraph - you acknowledged the opposing view fairly before rebutting it effectively. Your voice is strong and confident. Minor suggestions: vary your sentence openings more in paragraph 3, and double-check your MLA citation format for the online sources. This is some of your best writing this year!",
      submissionText:
        "Should Saskatchewan Schools Start Later?\n\nEvery morning, thousands of Saskatchewan students drag themselves out of bed before dawn, struggling to stay awake in first-period classes. Research consistently shows that adolescents need 8-10 hours of sleep, yet early school start times make this nearly impossible. Saskatchewan schools should adopt a later start time of 9:00 AM to improve student health, academic performance, and well-being.\n\n[Full 650-word essay with three body paragraphs, counterargument, and conclusion. Two sources cited from Canadian Paediatric Society and University of Saskatchewan sleep research.]",
    },
    {
      subject: "Social Studies",
      index: 0, // Government Research Project
      points: 88,
      percentage: 88,
      letter: "A-",
      feedback:
        "Well-researched project, Aiden. Your diagram of the municipal government structure was clear and accurate. The case study of the Saskatoon city council's decision on the new bus rapid transit route was an excellent choice - you showed how it affects different communities. Good use of the city council meeting minutes as a primary source. To strengthen your work: the section on citizen participation could have included more specific examples of how youth can get involved at the municipal level.",
      submissionText:
        "Municipal Government Research Project: City of Saskatoon\n\nI chose to research municipal government because it is the level of government closest to our daily lives. The City of Saskatoon is governed by a mayor and ten city councillors, each representing a ward.\n\n[Full 900-word report with government structure diagram, responsibilities analysis, Bus Rapid Transit case study, and bibliography with 5 sources.]",
    },
  ];

  for (const gd of gradeData) {
    const courseId = courseIds[gd.subject];
    const assignIds = assignmentIds[gd.subject];
    if (!courseId || !assignIds || !assignIds[gd.index]) continue;

    const assignmentId = assignIds[gd.index];

    // Check if submission already exists
    const { data: existingSub } = await supabase
      .from("submissions")
      .select("id")
      .eq("assignment_id", assignmentId)
      .eq("student_id", studentId)
      .single();

    let submissionId: string;

    if (existingSub) {
      submissionId = existingSub.id;
    } else {
      const { data: sub, error: subErr } = await supabase
        .from("submissions")
        .insert({
          tenant_id: tenantId,
          assignment_id: assignmentId,
          student_id: studentId,
          submission_text: gd.submissionText,
          attempt_number: 1,
          status: "graded",
          submitted_at: daysAgo(Math.abs(gd.index) + 3),
          submitted_late: false,
          graded_at: daysAgo(1),
          graded_by: teacherId,
        })
        .select()
        .single();

      if (subErr) {
        log(`  Warning: submission for ${gd.subject}: ${subErr.message}`);
        continue;
      }
      submissionId = sub.id;
    }

    // Check if grade already exists
    const { data: existingGrade } = await supabase
      .from("grades")
      .select("id")
      .eq("assignment_id", assignmentId)
      .eq("student_id", studentId)
      .single();

    if (!existingGrade) {
      const { error: grErr } = await supabase.from("grades").insert({
        tenant_id: tenantId,
        submission_id: submissionId,
        assignment_id: assignmentId,
        student_id: studentId,
        course_id: courseId,
        points_earned: gd.points,
        percentage: gd.percentage,
        letter_grade: gd.letter,
        feedback: gd.feedback,
        graded_by: teacherId,
        graded_at: daysAgo(1),
      });

      if (grErr) {
        log(`  Warning: grade for ${gd.subject}: ${grErr.message}`);
      } else {
        log(
          `  Graded: ${gd.subject} assignment - ${gd.percentage}% (${gd.letter})`
        );
      }
    } else {
      log(`  Grade already exists for ${gd.subject} assignment`);
    }
  }

  // =========================================================================
  // 10. ATTENDANCE RECORDS (past 2 weeks, all 4 courses)
  // =========================================================================
  log("");
  log("10. Creating attendance records...");

  // Generate weekdays for the past 14 days
  const attendanceDates: string[] = [];
  for (let i = 1; i <= 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayOfWeek = d.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Weekdays only
      attendanceDates.push(d.toISOString().split("T")[0]);
    }
  }

  // Attendance patterns: mostly present, a few tardies
  const attendancePatterns: Record<string, string> = {};
  attendanceDates.forEach((date, idx) => {
    if (idx === 2) attendancePatterns[date] = "tardy"; // One tardy
    else if (idx === 7) attendancePatterns[date] = "tardy"; // Another tardy
    else if (idx === 5) attendancePatterns[date] = "excused"; // One excused absence
    else attendancePatterns[date] = "present";
  });

  let attendanceCount = 0;
  for (const [subject, courseId] of Object.entries(courseIds)) {
    for (const date of attendanceDates) {
      const status = attendancePatterns[date];
      const notes =
        status === "tardy"
          ? "Arrived 8 minutes late - bus delay"
          : status === "excused"
          ? "Dental appointment"
          : null;

      const { error: attErr } = await supabase
        .from("attendance_records")
        .upsert(
          {
            tenant_id: tenantId,
            course_id: courseId,
            student_id: studentId,
            attendance_date: date,
            status,
            notes,
            marked_by: teacherId,
          },
          { onConflict: "course_id,student_id,attendance_date" }
        );
      if (!attErr) attendanceCount++;
    }
  }
  log(
    `  Created/updated ${attendanceCount} attendance records across ${Object.keys(courseIds).length} courses`
  );
  log(
    `  Pattern: ${attendanceDates.length - 3} present, 2 tardy, 1 excused per course`
  );

  // =========================================================================
  // 11. LESSON PROGRESS (~60% completion)
  // =========================================================================
  log("");
  log("11. Creating lesson progress (approx 60% complete)...");

  let progressCount = 0;
  for (const [subject, ids] of Object.entries(lessonIds)) {
    const totalLessons = ids.length;
    const completedCount = Math.round(totalLessons * 0.6);

    for (let i = 0; i < totalLessons; i++) {
      const lessonId = ids[i];
      let status: string;
      let progressPercentage: number;
      let completedAt: string | null = null;
      let timeSpent: number;

      if (i < completedCount) {
        // Completed
        status = "completed";
        progressPercentage = 100;
        completedAt = daysAgo(totalLessons - i);
        timeSpent = Math.floor(Math.random() * 1800) + 1200; // 20-50 mins
      } else if (i === completedCount) {
        // In progress
        status = "in_progress";
        progressPercentage = Math.floor(Math.random() * 40) + 30; // 30-70%
        timeSpent = Math.floor(Math.random() * 900) + 300; // 5-20 mins
      } else {
        // Not started
        status = "not_started";
        progressPercentage = 0;
        timeSpent = 0;
      }

      const { error: lpErr } = await supabase.from("lesson_progress").upsert(
        {
          tenant_id: tenantId,
          lesson_id: lessonId,
          user_id: studentId,
          status,
          progress_percentage: progressPercentage,
          time_spent_seconds: timeSpent,
          started_at: i <= completedCount ? daysAgo(totalLessons - i + 5) : null,
          completed_at: completedAt,
          last_accessed_at:
            i <= completedCount ? daysAgo(Math.max(0, totalLessons - i - 2)) : null,
        },
        { onConflict: "lesson_id,user_id" }
      );
      if (!lpErr) progressCount++;
    }
  }
  log(`  Created/updated ${progressCount} lesson progress records`);

  // =========================================================================
  // 12. XP / LEVEL DATA
  // =========================================================================
  log("");
  log("12. Creating XP and level data...");

  // User level
  const { error: ulErr } = await supabase.from("user_levels").upsert(
    {
      tenant_id: tenantId,
      user_id: studentId,
      current_level: 3,
      total_xp: 520,
      current_tier: "growth",
      coins: 45,
      streak_days: 6,
      longest_streak: 12,
      last_active_date: dateOnly(0),
    },
    { onConflict: "tenant_id,user_id" }
  );
  if (ulErr) log(`  Warning: user_levels: ${ulErr.message}`);
  else log("  User level: 3 (520 XP, Growth tier, 6-day streak)");

  // XP events
  const xpEvents = [
    {
      event_type: "lesson_completed",
      xp_amount: 50,
      source_type: "lesson",
      course_id: courseIds["Mathematics"],
      metadata: { lesson_title: "Number Sense: Integers and Operations" },
      created_at: daysAgo(10),
    },
    {
      event_type: "lesson_completed",
      xp_amount: 50,
      source_type: "lesson",
      course_id: courseIds["Science"],
      metadata: {
        lesson_title:
          "Interactions within Ecosystems: Living Things and Their Environment",
      },
      created_at: daysAgo(9),
    },
    {
      event_type: "assignment_submitted",
      xp_amount: 75,
      source_type: "assignment",
      course_id: courseIds["English Language Arts"],
      metadata: { assignment_title: "Persuasive Essay Draft" },
      created_at: daysAgo(8),
    },
    {
      event_type: "grade_received",
      xp_amount: 100,
      source_type: "grade",
      course_id: courseIds["English Language Arts"],
      metadata: {
        assignment_title: "Persuasive Essay Draft",
        grade: "A",
        bonus: "high_score",
      },
      created_at: daysAgo(7),
    },
    {
      event_type: "lesson_completed",
      xp_amount: 50,
      source_type: "lesson",
      course_id: courseIds["Social Studies"],
      metadata: {
        lesson_title: "Pacific Canada: Geography, Peoples, and Cultures",
      },
      created_at: daysAgo(6),
    },
    {
      event_type: "streak_bonus",
      xp_amount: 25,
      source_type: "system",
      course_id: null,
      metadata: { streak_days: 5, bonus_type: "5_day_streak" },
      created_at: daysAgo(5),
    },
    {
      event_type: "study_session",
      xp_amount: 30,
      source_type: "study_session",
      course_id: courseIds["Mathematics"],
      metadata: { duration_minutes: 25, music_type: "lo-fi" },
      created_at: daysAgo(4),
    },
    {
      event_type: "assignment_submitted",
      xp_amount: 75,
      source_type: "assignment",
      course_id: courseIds["Social Studies"],
      metadata: { assignment_title: "Government Research Project" },
      created_at: daysAgo(3),
    },
    {
      event_type: "lesson_completed",
      xp_amount: 50,
      source_type: "lesson",
      course_id: courseIds["Mathematics"],
      metadata: {
        lesson_title: "Number Sense: Fractions, Decimals, and Percents",
      },
      created_at: daysAgo(2),
    },
    {
      event_type: "daily_login",
      xp_amount: 15,
      source_type: "system",
      course_id: null,
      metadata: { consecutive_day: 6 },
      created_at: daysAgo(0),
    },
  ];

  // Check if XP events already exist (check by count)
  const { count: existingXp } = await supabase
    .from("xp_events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", studentId)
    .eq("tenant_id", tenantId);

  if (!existingXp || existingXp < 5) {
    for (const xp of xpEvents) {
      await supabase.from("xp_events").insert({
        tenant_id: tenantId,
        user_id: studentId,
        ...xp,
      });
    }
    log(`  Created ${xpEvents.length} XP events (total: 520 XP)`);
  } else {
    log(`  XP events already exist (${existingXp} records)`);
  }

  // =========================================================================
  // 13. ACHIEVEMENTS
  // =========================================================================
  log("");
  log("13. Creating achievements...");

  const achievementDefs = [
    {
      name: "First Steps",
      description: "Complete your first lesson",
      icon: "footprints",
      category: "academic",
      tier: "bronze",
      criteria: { type: "lessons_completed", count: 1 },
      xp_reward: 25,
      coin_reward: 5,
    },
    {
      name: "Knowledge Seeker",
      description: "Complete 10 lessons",
      icon: "book-open",
      category: "academic",
      tier: "silver",
      criteria: { type: "lessons_completed", count: 10 },
      xp_reward: 100,
      coin_reward: 15,
    },
    {
      name: "Streak Starter",
      description: "Maintain a 5-day login streak",
      icon: "flame",
      category: "consistency",
      tier: "bronze",
      criteria: { type: "login_streak", days: 5 },
      xp_reward: 50,
      coin_reward: 10,
    },
    {
      name: "Honour Roll",
      description: "Score 90% or above on any assignment",
      icon: "award",
      category: "academic",
      tier: "gold",
      criteria: { type: "grade_above", percentage: 90 },
      xp_reward: 75,
      coin_reward: 20,
    },
  ];

  const achievementIds: string[] = [];

  for (const ach of achievementDefs) {
    const { data: existing } = await supabase
      .from("achievements")
      .select("id")
      .eq("tenant_id", tenantId)
      .eq("name", ach.name)
      .single();

    if (existing) {
      achievementIds.push(existing.id);
      continue;
    }

    const { data: a, error: aErr } = await supabase
      .from("achievements")
      .insert({
        tenant_id: tenantId,
        ...ach,
        is_global: false,
        created_by: teacherId,
      })
      .select()
      .single();

    if (aErr) {
      log(`  Warning: achievement "${ach.name}": ${aErr.message}`);
      continue;
    }
    achievementIds.push(a.id);
    log(`  Created achievement: ${ach.name} (${ach.tier})`);
  }

  // Award first two achievements to student (First Steps + Streak Starter)
  if (achievementIds.length >= 3) {
    for (const achId of [achievementIds[0], achievementIds[2]]) {
      const { error: uaErr } = await supabase.from("user_achievements").upsert(
        {
          tenant_id: tenantId,
          user_id: studentId,
          achievement_id: achId,
          earned_at: daysAgo(5),
          notified: true,
        },
        { onConflict: "user_id,achievement_id" }
      );
      if (uaErr) log(`  Warning: user_achievement: ${uaErr.message}`);
    }
    // Award Honour Roll for the 92% ELA grade
    if (achievementIds[3]) {
      await supabase.from("user_achievements").upsert(
        {
          tenant_id: tenantId,
          user_id: studentId,
          achievement_id: achievementIds[3],
          earned_at: daysAgo(1),
          notified: true,
        },
        { onConflict: "user_id,achievement_id" }
      );
    }
    log("  Awarded achievements: First Steps, Streak Starter, Honour Roll");
  }

  // =========================================================================
  // 14. ANNOUNCEMENTS
  // =========================================================================
  log("");
  log("14. Creating announcements...");

  const announcementDefs = [
    {
      title: "Welcome Back to Semester 2!",
      content:
        "Welcome back, Prairie View students! I hope everyone had a restful winter break. This semester we will be diving into some exciting new topics in all our Grade 7 subjects. A few reminders:\n\n- Please check your course pages for updated schedules and assignment due dates\n- Our school-wide Treaty Education Day is coming up on February 20th\n- Science fair projects are due March 14th - start thinking about your topics!\n- Parent-teacher conferences are scheduled for February 27th\n\nRemember, you can always reach me through the messaging system if you have questions. Let's make this a great semester!\n\n- Mrs. Mitchell",
      created_by: teacherId,
      is_pinned: true,
      notify_parents: true,
      course_id: null,
    },
    {
      title: "Mathematics 7 - Upcoming Geometry Project",
      content:
        "Grade 7 Math students: your Geometry Project (Design a Community Space) has been posted. This is a major project worth 100 points that combines your knowledge of area, perimeter, and circumference.\n\nKey dates:\n- Project posted: Today\n- Check-in with draft sketch: Next Wednesday\n- Final submission: " +
        dateOnly(12) +
        "\n\nYou may work individually or in pairs. If working in pairs, both partners must submit their own calculations and written explanation. Graph paper is available in the classroom.\n\nTip: Start by sketching your park design and identifying the shapes before doing calculations!",
      created_by: teacherId,
      is_pinned: false,
      notify_parents: false,
      course_id: courseIds["Mathematics"],
    },
  ];

  for (const ann of announcementDefs) {
    const { data: existing } = await supabase
      .from("announcements")
      .select("id")
      .eq("tenant_id", tenantId)
      .eq("title", ann.title)
      .single();

    if (existing) {
      log(`  Announcement already exists: "${ann.title}"`);
      continue;
    }

    const { error: annErr } = await supabase.from("announcements").insert({
      tenant_id: tenantId,
      course_id: ann.course_id,
      title: ann.title,
      content: ann.content,
      created_by: ann.created_by,
      is_pinned: ann.is_pinned,
      notify_parents: ann.notify_parents,
      status: "published",
      published_at: daysAgo(ann.is_pinned ? 7 : 2),
    });

    if (annErr) log(`  Warning: announcement: ${annErr.message}`);
    else log(`  Created announcement: "${ann.title}"`);
  }

  // =========================================================================
  // 15. STUDY SESSION
  // =========================================================================
  log("");
  log("15. Creating study session...");

  const { count: existingSessions } = await supabase
    .from("study_sessions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", studentId)
    .eq("tenant_id", tenantId);

  if (!existingSessions || existingSessions < 1) {
    const sessionStart = daysAgo(4);
    const sessionEnd = new Date(sessionStart);
    sessionEnd.setMinutes(sessionEnd.getMinutes() + 25);

    const { error: ssErr } = await supabase.from("study_sessions").insert({
      tenant_id: tenantId,
      user_id: studentId,
      duration_minutes: 25,
      actual_minutes: 25,
      music_type: "lo-fi",
      assignment_id: assignmentIds["Mathematics"]?.[1] || null,
      completed: true,
      xp_awarded: 30,
      started_at: sessionStart,
      ended_at: sessionEnd.toISOString(),
    });

    if (ssErr) log(`  Warning: study session: ${ssErr.message}`);
    else log("  Created study session: 25min lo-fi session (Math - Geometry)");
  } else {
    log("  Study session already exists");
  }

  // =========================================================================
  // 16. LEADERBOARD ENTRY
  // =========================================================================
  log("");
  log("16. Creating leaderboard entry...");

  const { error: lbErr } = await supabase.from("leaderboard_entries").upsert(
    {
      tenant_id: tenantId,
      user_id: studentId,
      scope: "school",
      scope_id: tenantId,
      period: "weekly",
      period_start: dateOnly(-7),
      xp_total: 520,
      rank: 3,
    },
    {
      onConflict:
        "tenant_id,user_id,scope,scope_id,period,period_start",
    }
  );
  if (lbErr) log(`  Warning: leaderboard: ${lbErr.message}`);
  else log("  Leaderboard: Rank 3, 520 XP (weekly, school-wide)");

  // =========================================================================
  // DONE
  // =========================================================================
  log("");
  log("==============================================");
  log("Saskatchewan seed data complete!");
  log("==============================================");
  log("");
  log("Summary:");
  log(`  Tenant:       Prairie View Elementary School (${tenantId})`);
  log(`  Teacher:      teacher@wolfwhale.com (Sarah Mitchell)`);
  log(`  Student:      student@wolfwhale.com (Aiden Blackfoot, Grade 7)`);
  log(`  Parent:       parent@wolfwhale.com (Jessica Blackfoot)`);
  log(`  Admin:        admin@wolfwhale.com (David Chen)`);
  log(`  Super Admin:  superadmin@wolfwhale.com (Ryland Dupres)`);
  log(`  Password:     Test1234! (all accounts)`);
  log("");
  log(`  Courses:      4 (Math, Science, ELA, Social Studies)`);
  log(`  Lessons:      32 total (8 per course)`);
  log(`  Assignments:  9 total (2-3 per course)`);
  log(`  Grades:       4 (78%, 85%, 92%, 88%)`);
  log(`  Attendance:   ${attendanceCount} records (past 2 weeks)`);
  log(`  XP:           520 total, Level 3 (Growth tier)`);
  log(`  Achievements: 3 earned (First Steps, Streak Starter, Honour Roll)`);
  log(`  Announcements: 2`);
  log(`  Study Session: 1 (25min lo-fi)`);
  log("");
  log("All passwords: Test1234!");
  log("Login at: http://localhost:3000/login");
}

// ---------------------------------------------------------------------------
// RUN
// ---------------------------------------------------------------------------
main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("[seed] FATAL ERROR:", err);
    process.exit(1);
  });
