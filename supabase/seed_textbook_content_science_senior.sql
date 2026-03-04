-- ============================================================================
-- WolfWhale Science Textbook Content Seed Data
-- Grades 9-10 (Saskatchewan Curriculum)
--
-- 2 Textbooks:
--   1. WolfWhale Science 9
--   2. WolfWhale Science 10
--
-- Each textbook contains 4 units, 2 chapters per unit (8 total), with:
--   - Rich JSONB content blocks (heading, text, callout, quiz, list)
--   - Key terms with definitions
--   - Indigenous connections
--   - Flashcards for spaced repetition
--
-- All content is 100% original. No copied material from any publisher.
-- tenant_id uses placeholder UUID: 00000000-0000-0000-0000-000000000001
-- ============================================================================


-- ============================================================================
-- TEXTBOOK 1: WolfWhale Science 9
-- Slug: wolfwhale-science-9
-- Saskatchewan Curriculum: Atoms & Elements, Characteristics of Electricity,
--   Reproduction & Human Development, Exploring the Universe
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book UUID;
  v_unit UUID;
  v_ch UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-science-9';

  -- ==============================
  -- UNIT 1: Atoms & Elements
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Atoms & Elements',
    'Investigate the building blocks of matter: atomic structure, elements, and the periodic table.',
    'All matter in the universe is composed of a limited number of elements, each defined by its unique atomic structure.',
    'How does the arrangement of subatomic particles determine the identity and behaviour of an element?')
  RETURNING id INTO v_unit;

  -- Chapter 1: The Atomic Model
  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'The Atomic Model', 'the-atomic-model',
    'Explore the structure of atoms, the history of atomic theory, elements, and the periodic table.',
    '[
      {"type": "heading", "content": "The Atomic Model", "level": 1},
      {"type": "text", "content": "Everything around you, from the air you breathe on a cold Saskatchewan morning to the granite beneath the prairies, is made of matter. Matter is anything that has mass and takes up space. But what is matter made of at its smallest scale? The answer lies in atoms, the fundamental building blocks of all substances in the universe."},
      {"type": "text", "content": "An atom is incredibly small. If you lined up ten million atoms side by side, they would span roughly the width of a single millimetre. Despite their tiny size, atoms have an internal structure that determines the properties of every element and compound we encounter."},
      {"type": "callout", "content": "An atom is the smallest particle of an element that still retains the chemical properties of that element. You cannot break an atom into smaller pieces by ordinary chemical means.", "style": "info"},
      {"type": "heading", "content": "A Brief History of Atomic Theory", "level": 2},
      {"type": "text", "content": "Our understanding of atoms has evolved over centuries. Around 400 BCE, the Greek philosopher Democritus proposed that matter could be divided only so far before reaching an indivisible particle he called atomos. For over two thousand years, this idea remained philosophical rather than scientific."},
      {"type": "text", "content": "In 1803, John Dalton proposed the first scientific atomic theory. He suggested that each element is made of identical atoms, that atoms of different elements differ in mass, and that atoms combine in fixed ratios to form compounds. Dalton imagined atoms as solid, featureless spheres, much like billiard balls."},
      {"type": "text", "content": "J.J. Thomson discovered the electron in 1897 and proposed the plum pudding model, where negative electrons were embedded in a positive mass like raisins in a pudding. Ernest Rutherford overturned this in 1911 with his gold foil experiment, which revealed that atoms have a dense, positively charged nucleus surrounded by mostly empty space. Niels Bohr later refined this model by proposing that electrons orbit the nucleus in specific energy levels, similar to planets orbiting a star."},
      {"type": "callout", "content": "Rutherford''s gold foil experiment showed that most alpha particles passed straight through the foil, but a few bounced back sharply. This proved the atom is mostly empty space with a tiny, dense nucleus at its centre.", "style": "example"},
      {"type": "heading", "content": "Parts of the Atom", "level": 2},
      {"type": "text", "content": "Modern atomic theory describes three main subatomic particles. Protons carry a positive charge and are found in the nucleus. Neutrons carry no charge and also reside in the nucleus. Electrons carry a negative charge and move rapidly around the nucleus in regions called electron shells or energy levels."},
      {"type": "text", "content": "The number of protons in an atom defines which element it is. This number is called the atomic number. For example, every carbon atom has exactly 6 protons. If an atom has 6 protons, it is carbon, regardless of how many neutrons or electrons it may have. The mass number equals the total count of protons plus neutrons in the nucleus."},
      {"type": "list", "items": ["Protons: positive charge, found in the nucleus, determine the element", "Neutrons: no charge, found in the nucleus, contribute to mass", "Electrons: negative charge, orbit the nucleus in energy levels"], "ordered": false},
      {"type": "heading", "content": "The Periodic Table", "level": 2},
      {"type": "text", "content": "The periodic table organizes all known elements by increasing atomic number. Elements in the same column, called a group or family, share similar chemical properties. Elements in the same row, called a period, have the same number of electron shells. Saskatchewan''s potash mining industry depends on potassium (K, atomic number 19), an alkali metal found in Group 1. The province is one of the world''s largest producers of this essential fertilizer mineral."},
      {"type": "callout", "content": "Saskatchewan sits atop some of the richest potash deposits on Earth. Potassium, the element at the heart of potash (KCl), is vital for plant growth and is mined extensively near Saskatoon, Esterhazy, and Rocanville.", "style": "tip"},
      {"type": "callout", "content": "Many First Nations and Metis communities in Saskatchewan have long understood that certain minerals and clays possess healing or practical properties. Traditional knowledge of ochre pigments,ite calcium-rich shells, and mineral-laden spring waters reflects a deep, observation-based understanding of the materials found in the land.", "style": "tip"},
      {"type": "heading", "content": "Check Your Understanding", "level": 2},
      {"type": "quiz", "question": "What subatomic particle determines the identity of an element?", "options": ["Electron", "Proton", "Neutron", "Photon"], "correct": 1, "explanation": "The number of protons (the atomic number) uniquely identifies each element. Change the proton count and you change the element."},
      {"type": "quiz", "question": "In Rutherford''s gold foil experiment, what did the deflection of some alpha particles demonstrate?", "options": ["Atoms are solid spheres", "Atoms contain a small, dense, positively charged nucleus", "Electrons orbit in fixed paths", "Neutrons have no charge"], "correct": 1, "explanation": "The sharp deflection of a small number of alpha particles showed that atoms have a concentrated positive core, the nucleus, rather than being uniformly dense."}
    ]'::jsonb,
    '[
      {"term": "Atom", "definition": "The smallest particle of an element that retains the chemical identity of that element."},
      {"term": "Proton", "definition": "A positively charged subatomic particle found in the nucleus of an atom."},
      {"term": "Neutron", "definition": "A subatomic particle with no electric charge, found in the nucleus alongside protons."},
      {"term": "Electron", "definition": "A negatively charged subatomic particle that occupies energy levels around the nucleus."},
      {"term": "Atomic Number", "definition": "The number of protons in the nucleus of an atom, which defines the element."},
      {"term": "Mass Number", "definition": "The total number of protons and neutrons in the nucleus of an atom."},
      {"term": "Periodic Table", "definition": "A chart that organizes all known elements by increasing atomic number and groups them by similar properties."},
      {"term": "Nucleus", "definition": "The dense, central region of an atom that contains protons and neutrons."}
    ]'::jsonb,
    'Many First Nations and Metis communities in Saskatchewan have long understood that certain minerals and clays possess healing or practical properties. Traditional knowledge of ochre pigments, calcium-rich shells, and mineral-laden spring waters reflects a deep, observation-based understanding of the materials of the land.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are the three main subatomic particles?', 'Protons (positive, in nucleus), neutrons (neutral, in nucleus), and electrons (negative, orbiting the nucleus).', 'Think about charge and location.', 2, 0),
    (v_tenant, v_ch, 'What does the atomic number tell you?', 'The number of protons in an atom, which identifies the element.', 'Every element has a unique count of this particle.', 2, 1),
    (v_tenant, v_ch, 'Who proposed the nuclear model of the atom?', 'Ernest Rutherford, based on his gold foil experiment in 1911.', 'He shot alpha particles at thin metal foil.', 2, 2),
    (v_tenant, v_ch, 'What is the mass number?', 'The total number of protons plus neutrons in the nucleus.', 'It does not include electrons.', 2, 3);


  -- Chapter 2: Chemical Bonding & Compounds
  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Chemical Bonding & Compounds', 'chemical-bonding-compounds',
    'Understand how atoms combine through ionic and covalent bonds to form compounds, and learn to name simple compounds.',
    '[
      {"type": "heading", "content": "Chemical Bonding & Compounds", "level": 1},
      {"type": "text", "content": "Atoms rarely exist alone in nature. Instead, they join together by forming chemical bonds to create compounds and molecules. The sodium and chlorine atoms in table salt, the hydrogen and oxygen atoms in water, and the carbon and oxygen atoms in the carbon dioxide you exhale are all held together by chemical bonds. Understanding why and how atoms bond is central to chemistry."},
      {"type": "text", "content": "Atoms bond because doing so lowers their overall energy, making them more stable. Most atoms achieve stability when their outermost electron shell is full. For many elements, a full outer shell means having eight electrons, a pattern known as the octet rule. Noble gases like neon and argon already have full outer shells, which is why they are so chemically unreactive."},
      {"type": "callout", "content": "The octet rule states that atoms tend to gain, lose, or share electrons until they have eight electrons in their outermost energy level (with the exception of hydrogen and helium, which are stable with two).", "style": "info"},
      {"type": "heading", "content": "Ionic Bonds", "level": 2},
      {"type": "text", "content": "An ionic bond forms when one atom transfers one or more electrons to another atom. The atom that loses electrons becomes a positively charged ion (cation), and the atom that gains electrons becomes a negatively charged ion (anion). The opposite charges attract each other, holding the ions together in a crystal lattice structure."},
      {"type": "text", "content": "Potash mining in Saskatchewan provides a perfect example. Potassium chloride (KCl) is an ionic compound. Potassium (K) from Group 1 readily gives up one electron to chlorine (Cl) from Group 17. The resulting K+ and Cl- ions arrange themselves in a regular repeating pattern, forming the cubic crystals found deep beneath the prairies."},
      {"type": "callout", "content": "Saskatchewan''s potash deposits formed roughly 400 million years ago when ancient inland seas evaporated, leaving behind thick layers of potassium chloride crystals deep underground.", "style": "example"},
      {"type": "heading", "content": "Covalent Bonds", "level": 2},
      {"type": "text", "content": "A covalent bond forms when two atoms share one or more pairs of electrons. This type of bonding is common between non-metal elements. Water (H2O) is a familiar covalent compound: each hydrogen atom shares one electron with the oxygen atom, giving oxygen a complete outer shell and each hydrogen a complete first shell."},
      {"type": "text", "content": "Covalent compounds often exist as individual molecules rather than crystal lattices. They typically have lower melting and boiling points than ionic compounds and do not conduct electricity in their pure form because they lack free-moving charged particles."},
      {"type": "heading", "content": "Naming Compounds", "level": 2},
      {"type": "text", "content": "Ionic compounds are named by stating the metal first, followed by the non-metal with its ending changed to -ide. For example, NaCl is sodium chloride and MgO is magnesium oxide. For covalent compounds between two non-metals, prefixes indicate the number of each atom: CO2 is carbon dioxide (one carbon, two oxygen), and N2O4 is dinitrogen tetroxide."},
      {"type": "list", "items": ["mono- = 1", "di- = 2", "tri- = 3", "tetra- = 4", "penta- = 5", "hexa- = 6"], "ordered": false},
      {"type": "callout", "content": "Indigenous peoples across the prairies developed sophisticated knowledge of natural compounds long before western chemistry. Plant-based dyes, mineral pigments for ceremonial paints, and the use of lye from wood ash for processing hides all demonstrate applied understanding of how substances combine and transform.", "style": "tip"},
      {"type": "heading", "content": "Check Your Understanding", "level": 2},
      {"type": "quiz", "question": "What type of bond forms when electrons are transferred from one atom to another?", "options": ["Covalent bond", "Ionic bond", "Metallic bond", "Hydrogen bond"], "correct": 1, "explanation": "Ionic bonds form through the transfer of electrons, creating oppositely charged ions that attract each other."},
      {"type": "quiz", "question": "What is the correct name for the compound MgBr2?", "options": ["Magnesium bromide", "Magnesium dibromide", "Dimagnesium bromide", "Manganese bromide"], "correct": 0, "explanation": "MgBr2 is an ionic compound (metal + non-metal). Name the metal (magnesium) then change the non-metal ending to -ide (bromide). No prefixes are used for ionic compounds."}
    ]'::jsonb,
    '[
      {"term": "Chemical Bond", "definition": "An attractive force that holds atoms together in a compound or molecule."},
      {"term": "Ionic Bond", "definition": "A bond formed by the transfer of electrons from one atom to another, creating oppositely charged ions."},
      {"term": "Covalent Bond", "definition": "A bond formed when two atoms share one or more pairs of electrons."},
      {"term": "Ion", "definition": "An atom that has gained or lost electrons, giving it a net positive or negative charge."},
      {"term": "Octet Rule", "definition": "The tendency of atoms to gain, lose, or share electrons to achieve eight electrons in their outer shell."},
      {"term": "Compound", "definition": "A pure substance made of two or more different elements chemically bonded in a fixed ratio."},
      {"term": "Crystal Lattice", "definition": "A regular, repeating three-dimensional arrangement of ions in an ionic compound."}
    ]'::jsonb,
    'Indigenous peoples across the prairies developed sophisticated knowledge of natural compounds long before western chemistry emerged. Plant-based dyes, mineral pigments for ceremonial paints, and the use of lye from wood ash for processing hides all demonstrate an applied understanding of how substances combine and transform.',
    35, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the difference between ionic and covalent bonds?', 'Ionic bonds involve the transfer of electrons; covalent bonds involve the sharing of electrons.', 'Transfer vs. sharing', 2, 0),
    (v_tenant, v_ch, 'What is the octet rule?', 'Atoms tend to gain, lose, or share electrons until they have 8 electrons in their outermost energy level.', 'Think of 8 as the stable number for most elements.', 2, 1),
    (v_tenant, v_ch, 'What is an ion?', 'An atom that has gained or lost electrons, giving it a net electric charge.', 'Positive ions lost electrons; negative ions gained them.', 2, 2),
    (v_tenant, v_ch, 'How do you name an ionic compound?', 'State the metal name first, then change the non-metal ending to -ide. Example: NaCl = sodium chloride.', 'Metal first, non-metal with -ide ending.', 2, 3);


  -- ==============================
  -- UNIT 2: Characteristics of Electricity
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Characteristics of Electricity',
    'Investigate static and current electricity, circuit design, and the safe use of electrical energy.',
    'Electrical energy results from the movement of charged particles and can be harnessed, measured, and controlled through circuits.',
    'How do we harness and control the flow of electrical energy safely and efficiently?')
  RETURNING id INTO v_unit;

  -- Chapter 3: Static & Current Electricity
  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Static & Current Electricity', 'static-current-electricity',
    'Explore electric charge, static electricity, current flow, circuits, and Ohm''s law.',
    '[
      {"type": "heading", "content": "Static & Current Electricity", "level": 1},
      {"type": "text", "content": "On a dry Saskatchewan winter day, you might notice a sharp snap when you touch a metal doorknob after walking across a carpet. That brief spark is static electricity discharging. Electricity is one of the most important forms of energy in our lives, powering everything from the lights in your school to the devices in your pocket. Understanding how electric charge behaves is the first step toward understanding electrical energy."},
      {"type": "heading", "content": "Electric Charge", "level": 2},
      {"type": "text", "content": "All matter contains electric charges. Protons carry positive charge and electrons carry negative charge. In most objects, the number of protons equals the number of electrons, so the object is electrically neutral. When electrons are transferred from one object to another through friction, contact, or induction, one object gains a net negative charge while the other gains a net positive charge."},
      {"type": "callout", "content": "Like charges repel each other and opposite charges attract. This fundamental principle governs all electrical interactions.", "style": "info"},
      {"type": "text", "content": "Static electricity occurs when charges accumulate on the surface of an object rather than flowing continuously. The shock you feel at a doorknob happens because electrons jump from your charged body to the neutral metal, equalizing the charge difference. Lightning is the most dramatic example of static discharge: enormous charge differences between clouds and the ground create a massive spark that heats the surrounding air to temperatures hotter than the surface of the sun."},
      {"type": "callout", "content": "Saskatchewan''s wide-open prairies make it one of the most active regions for thunderstorms in Canada. The flat terrain allows warm, moist air from the south to collide with cooler northern air masses, creating the conditions for dramatic lightning displays.", "style": "example"},
      {"type": "heading", "content": "Current Electricity", "level": 2},
      {"type": "text", "content": "While static electricity involves stationary charges, current electricity involves the continuous flow of electrons through a conductor. Electric current (I) is measured in amperes (A) and represents the rate at which charge flows past a point in a circuit. For current to flow, there must be a complete, unbroken path called a circuit and an energy source such as a battery or generator to push the electrons along."},
      {"type": "text", "content": "Voltage (V) is the electrical pressure that pushes electrons through a circuit, measured in volts. Resistance (R) opposes the flow of current and is measured in ohms. These three quantities are related by Ohm''s law: V = I x R. If you know any two of these values, you can calculate the third."},
      {"type": "callout", "content": "Ohm''s Law: V = I x R, where V is voltage in volts, I is current in amperes, and R is resistance in ohms. This relationship is the foundation of circuit analysis.", "style": "tip"},
      {"type": "heading", "content": "Series and Parallel Circuits", "level": 2},
      {"type": "text", "content": "In a series circuit, components are connected end to end in a single loop. The same current flows through every component, but the voltage is divided among them. If one component fails, the entire circuit breaks. In a parallel circuit, components are connected in separate branches. Each branch receives the full voltage of the source, and the total current is divided among the branches. If one branch fails, the others continue to operate."},
      {"type": "list", "items": ["Series circuit: one path for current, same current everywhere, voltage is shared", "Parallel circuit: multiple paths for current, same voltage across each branch, current is shared"], "ordered": false},
      {"type": "callout", "content": "Cree and Dene Elders have long observed the power of lightning on the prairies and in the boreal forest. Stories about Thunderbird, a powerful spirit being associated with storms and lightning, reflect generations of careful observation of electrical phenomena in nature. These narratives carry ecological knowledge about weather patterns and seasonal changes.", "style": "tip"},
      {"type": "heading", "content": "Check Your Understanding", "level": 2},
      {"type": "quiz", "question": "A circuit has a voltage of 12 V and a resistance of 4 ohms. Using Ohm''s law, what is the current?", "options": ["48 A", "3 A", "8 A", "0.33 A"], "correct": 1, "explanation": "Using V = I x R, we get I = V / R = 12 V / 4 ohms = 3 A."},
      {"type": "quiz", "question": "In which type of circuit does the failure of one component cause all other components to stop working?", "options": ["Parallel circuit", "Series circuit", "Open circuit", "Short circuit"], "correct": 1, "explanation": "In a series circuit there is only one path for current. If any component fails, the path is broken and no current flows to any other component."}
    ]'::jsonb,
    '[
      {"term": "Static Electricity", "definition": "The accumulation of electric charge on the surface of an object, rather than flowing as a current."},
      {"term": "Current Electricity", "definition": "The continuous flow of electrons through a conductor in a closed circuit."},
      {"term": "Voltage", "definition": "The electrical pressure that pushes electrons through a circuit, measured in volts (V)."},
      {"term": "Current", "definition": "The rate of flow of electric charge through a conductor, measured in amperes (A)."},
      {"term": "Resistance", "definition": "The opposition to the flow of electric current, measured in ohms."},
      {"term": "Ohm''s Law", "definition": "The relationship V = I x R, connecting voltage, current, and resistance."},
      {"term": "Series Circuit", "definition": "A circuit in which components are connected in a single loop so the same current flows through each."},
      {"term": "Parallel Circuit", "definition": "A circuit in which components are connected in separate branches, each receiving the full source voltage."}
    ]'::jsonb,
    'Cree and Dene Elders have long observed the power of lightning on the prairies and in the boreal forest. Stories about Thunderbird, a powerful spirit being associated with storms and lightning, reflect generations of careful observation of electrical phenomena in nature and carry ecological knowledge about weather patterns and seasonal changes.',
    35, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is Ohm''s law?', 'V = I x R, where V is voltage (volts), I is current (amperes), and R is resistance (ohms).', 'Voltage equals current times resistance.', 2, 0),
    (v_tenant, v_ch, 'What causes static electricity?', 'The transfer of electrons between objects, causing one to become negatively charged and the other positively charged.', 'Think about rubbing your feet on carpet.', 2, 1),
    (v_tenant, v_ch, 'What is the difference between series and parallel circuits?', 'Series: one path, same current, shared voltage. Parallel: multiple paths, same voltage, shared current.', 'Series = single loop. Parallel = branching paths.', 2, 2),
    (v_tenant, v_ch, 'What are the units for voltage, current, and resistance?', 'Voltage: volts (V). Current: amperes (A). Resistance: ohms (Ω).', 'V-A-Ω', 2, 3);


  -- Chapter 4: Electrical Applications
  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Electrical Applications', 'electrical-applications',
    'Learn about household circuits, electrical safety, energy consumption, and efficiency in Saskatchewan communities.',
    '[
      {"type": "heading", "content": "Electrical Applications", "level": 1},
      {"type": "text", "content": "Understanding the principles of electricity becomes especially meaningful when we examine how electrical energy is generated, distributed, and used in Saskatchewan communities. From the hydroelectric dams on the Saskatchewan River to the wind turbines near Swift Current, our province generates electricity from diverse sources. Once generated, this energy travels through transmission lines to power homes, schools, farms, and industries across the province."},
      {"type": "heading", "content": "Household Circuits", "level": 2},
      {"type": "text", "content": "The electrical system in a typical Saskatchewan home uses alternating current (AC) at 120 volts for most outlets and 240 volts for large appliances such as electric stoves and clothes dryers. Household circuits are wired in parallel so that each outlet and light fixture operates independently. This means you can turn off a lamp in one room without affecting the television in another."},
      {"type": "text", "content": "Each branch circuit in a home is protected by a circuit breaker or fuse. If too much current flows through a wire, the circuit breaker trips or the fuse blows, cutting off current before the wiring overheats. This is a critical safety feature that prevents electrical fires."},
      {"type": "callout", "content": "Never overload a household circuit by plugging too many high-power devices into a single outlet or power bar. Overloaded circuits can overheat and create fire hazards.", "style": "warning"},
      {"type": "heading", "content": "Electrical Safety", "level": 2},
      {"type": "text", "content": "Electricity can be extremely dangerous. Even household voltage (120 V) can deliver a lethal shock under the right conditions. Water greatly reduces the resistance of human skin, which is why using electrical devices near water is particularly hazardous. Ground fault circuit interrupters (GFCIs) are special outlets designed for kitchens, bathrooms, and outdoor areas that shut off power within milliseconds if they detect current leaking through an unintended path."},
      {"type": "list", "items": ["Never use damaged cords or plugs", "Keep electrical devices away from water", "Do not remove the grounding prong from a three-prong plug", "Use GFCI outlets in wet areas", "Stay well away from downed power lines and report them immediately"], "ordered": false},
      {"type": "heading", "content": "Energy Consumption and Efficiency", "level": 2},
      {"type": "text", "content": "Electrical energy is measured in kilowatt-hours (kWh). One kilowatt-hour equals the energy used by a 1000-watt appliance running for one hour. Your family''s electricity bill from SaskPower reflects the total kWh consumed during a billing period. By choosing energy-efficient appliances, using LED lighting, and being mindful of consumption, households can significantly reduce both their energy bills and their environmental footprint."},
      {"type": "callout", "content": "Energy Cost = Power (kW) x Time (h) x Rate ($/kWh). A 100 W light bulb running for 10 hours uses 1 kWh of energy. At a rate of $0.15/kWh, that costs about 15 cents.", "style": "example"},
      {"type": "text", "content": "Saskatchewan is investing in renewable energy sources including wind, solar, and geothermal. The province''s first utility-scale wind farm opened near Gull Lake in 2001, and capacity has grown substantially since then. Understanding electricity helps citizens participate meaningfully in discussions about energy policy, climate action, and the transition to cleaner power generation."},
      {"type": "callout", "content": "In many remote and northern Saskatchewan communities, reliable electricity has historically been generated by diesel fuel shipped in at great expense. First Nations and Metis communities are increasingly leading initiatives to develop local renewable energy projects, including solar microgrids and small-scale wind installations, that reduce dependence on fossil fuels and support energy sovereignty.", "style": "tip"},
      {"type": "heading", "content": "Check Your Understanding", "level": 2},
      {"type": "quiz", "question": "Why are household circuits wired in parallel rather than in series?", "options": ["Parallel circuits use less wire", "Each device can operate independently and receives the full voltage", "Parallel circuits are cheaper to install", "Series circuits require more circuit breakers"], "correct": 1, "explanation": "Parallel wiring allows each device to receive the full 120 V and operate independently. If one device is switched off or fails, the others are unaffected."}
    ]'::jsonb,
    '[
      {"term": "Alternating Current (AC)", "definition": "Electric current that periodically reverses direction, used in household electrical systems."},
      {"term": "Circuit Breaker", "definition": "A safety device that automatically stops current flow when it exceeds a safe level."},
      {"term": "GFCI", "definition": "Ground fault circuit interrupter; a device that quickly shuts off power when it detects current leaking through an unintended path."},
      {"term": "Kilowatt-hour (kWh)", "definition": "A unit of energy equal to one kilowatt of power used for one hour."},
      {"term": "Electrical Efficiency", "definition": "The ratio of useful energy output to total energy input, often expressed as a percentage."},
      {"term": "Renewable Energy", "definition": "Energy from sources that are naturally replenished, such as wind, solar, and hydroelectric."}
    ]'::jsonb,
    'In many remote and northern Saskatchewan communities, reliable electricity has historically depended on diesel fuel shipped in at great expense. First Nations and Metis communities are increasingly leading initiatives to develop local renewable energy projects, including solar microgrids and small-scale wind installations, that reduce dependence on fossil fuels and support energy sovereignty.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Why are household circuits wired in parallel?', 'So each device operates independently and receives the full source voltage. If one device fails, others continue to work.', 'Think about what happens when one light bulb burns out at home.', 2, 0),
    (v_tenant, v_ch, 'What is a kilowatt-hour (kWh)?', 'A unit of energy equal to one kilowatt of power used for one hour. It is the standard unit on electricity bills.', '1 kW running for 1 hour.', 2, 1),
    (v_tenant, v_ch, 'What does a GFCI do?', 'It detects current leaking through an unintended path and shuts off power within milliseconds to prevent electric shock.', 'Used near water in kitchens and bathrooms.', 2, 2),
    (v_tenant, v_ch, 'What is the standard household voltage in Canada?', '120 V for most outlets, 240 V for large appliances like stoves and dryers.', 'Think about what your wall outlets provide.', 2, 3);


  -- ==============================
  -- UNIT 3: Reproduction & Human Development
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Reproduction & Human Development',
    'Examine cell division, sexual and asexual reproduction, human reproductive systems, and the stages of human development.',
    'Life perpetuates itself through reproduction, which transmits genetic information across generations and drives biological diversity.',
    'How does reproduction at the cellular level connect to growth, variation, and the continuity of life?')
  RETURNING id INTO v_unit;

  -- Chapter 5: Cell Division & Reproduction
  v_ch_num := 5;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Cell Division & Reproduction', 'cell-division-reproduction',
    'Investigate mitosis, meiosis, and the role of cell division in growth, repair, and genetic variation.',
    '[
      {"type": "heading", "content": "Cell Division & Reproduction", "level": 1},
      {"type": "text", "content": "Every living organism on Earth, from a single bacterium to the tallest white spruce in the boreal forest north of Prince Albert, depends on cell division. Cell division allows organisms to grow, repair damaged tissues, and reproduce. The two primary types of cell division, mitosis and meiosis, serve very different purposes and produce very different outcomes."},
      {"type": "text", "content": "Before a cell divides, it must first duplicate all of its genetic material. This genetic information is stored in long molecules of DNA wound tightly into structures called chromosomes. In a typical human body cell, there are 46 chromosomes arranged in 23 pairs. Each pair contains one chromosome inherited from the mother and one from the father. This paired arrangement is referred to as diploid (2n)."},
      {"type": "callout", "content": "DNA (deoxyribonucleic acid) is the molecule that carries the genetic instructions for building, operating, and reproducing all known living organisms. It is organized into segments called genes, which code for specific proteins.", "style": "info"},
      {"type": "heading", "content": "Mitosis: Growth and Repair", "level": 2},
      {"type": "text", "content": "Mitosis is the process by which a single parent cell divides to produce two genetically identical daughter cells, each with the same chromosome number as the parent. This is the type of cell division responsible for growth and tissue repair. When you heal a cut on your hand, mitosis produces new skin cells to replace the damaged ones. When a seedling sprouts from a prairie grass seed, mitosis drives the rapid cell multiplication needed for growth."},
      {"type": "text", "content": "Mitosis proceeds through four main stages: prophase, metaphase, anaphase, and telophase. During prophase, duplicated chromosomes condense and become visible. In metaphase, chromosomes line up along the centre of the cell. During anaphase, identical sets of chromosomes are pulled to opposite ends of the cell. Finally, in telophase, the cell pinches in two, producing two daughter cells each containing a complete set of chromosomes."},
      {"type": "callout", "content": "A helpful way to remember the stages of mitosis: PMAT. Prophase, Metaphase, Anaphase, Telophase.", "style": "tip"},
      {"type": "heading", "content": "Meiosis: Sexual Reproduction and Variation", "level": 2},
      {"type": "text", "content": "Meiosis is a specialized form of cell division that produces reproductive cells called gametes (sperm and eggs). Unlike mitosis, meiosis involves two sequential rounds of division and produces four daughter cells, each with only half the original chromosome number (haploid, or n). In humans this means each gamete contains 23 chromosomes. When a sperm (n) fertilizes an egg (n), the resulting zygote has the full diploid number of 46 chromosomes."},
      {"type": "text", "content": "Meiosis is the engine of genetic variation. During a process called crossing over, homologous chromosomes exchange segments of DNA, creating new combinations of traits. Additionally, chromosomes assort independently during division, meaning the arrangement of maternal and paternal chromosomes is randomized. These two mechanisms together ensure that no two offspring, even from the same parents, are genetically identical (with the exception of identical twins)."},
      {"type": "callout", "content": "Genetic variation produced by meiosis is the raw material for natural selection. Without variation in a population, a species cannot adapt to changing conditions over time.", "style": "info"},
      {"type": "heading", "content": "Asexual vs. Sexual Reproduction", "level": 2},
      {"type": "text", "content": "Some organisms reproduce asexually, producing offspring that are genetically identical to the parent. Examples include bacteria dividing by binary fission, strawberry plants sending out runners, and aspen trees producing root sprouts. Asexual reproduction is fast and efficient but produces little genetic variation. Sexual reproduction, which combines genetic material from two parents, generates variation but requires more time and energy."},
      {"type": "list", "items": ["Asexual reproduction: fast, no partner needed, offspring identical to parent (e.g., bacteria, aspen groves)", "Sexual reproduction: slower, requires two parents, offspring genetically unique, creates variation"], "ordered": false},
      {"type": "callout", "content": "The vast aspen groves found across the parkland belt of Saskatchewan, including stands near Duck Mountain and Riding Mountain, are among the largest living organisms on Earth by mass. Each grove may consist of thousands of genetically identical trees connected by a single root system, all produced by asexual reproduction.", "style": "tip"},
      {"type": "heading", "content": "Check Your Understanding", "level": 2},
      {"type": "quiz", "question": "What is the main purpose of mitosis?", "options": ["To produce gametes with half the chromosome number", "To generate genetic variation in a population", "To produce identical daughter cells for growth and repair", "To combine genetic material from two parents"], "correct": 2, "explanation": "Mitosis produces two genetically identical daughter cells from one parent cell, enabling growth and tissue repair."},
      {"type": "quiz", "question": "Which process introduces genetic variation by exchanging DNA segments between homologous chromosomes during meiosis?", "options": ["Binary fission", "Crossing over", "Mitosis", "Cloning"], "correct": 1, "explanation": "Crossing over occurs during meiosis when homologous chromosomes exchange segments of DNA, creating new combinations of alleles and increasing genetic diversity."}
    ]'::jsonb,
    '[
      {"term": "Mitosis", "definition": "Cell division that produces two genetically identical daughter cells, used for growth and repair."},
      {"term": "Meiosis", "definition": "Cell division that produces four haploid gametes with half the chromosome number of the parent cell."},
      {"term": "Chromosome", "definition": "A tightly coiled structure of DNA found in the nucleus of a cell, carrying genetic information."},
      {"term": "Diploid (2n)", "definition": "A cell that contains two complete sets of chromosomes, one from each parent."},
      {"term": "Haploid (n)", "definition": "A cell that contains only one set of chromosomes, as found in gametes."},
      {"term": "Gamete", "definition": "A reproductive cell (sperm or egg) that contains half the normal chromosome number."},
      {"term": "Crossing Over", "definition": "The exchange of DNA segments between homologous chromosomes during meiosis, creating new gene combinations."},
      {"term": "Genetic Variation", "definition": "Differences in DNA sequences among individuals of the same species, arising from meiosis and mutation."}
    ]'::jsonb,
    'The vast aspen groves of the Saskatchewan parkland, including stands near Duck Mountain, are understood by Cree and Nakoda peoples to be deeply interconnected living communities rather than individual trees. This perspective, that a grove shares one life, aligns closely with modern science showing that aspen clones are single organisms connected by shared root systems. Indigenous ecological knowledge has long recognized the relational nature of life that biology now confirms.',
    35, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are the four stages of mitosis?', 'Prophase, Metaphase, Anaphase, Telophase (PMAT).', 'Use the acronym PMAT.', 2, 0),
    (v_tenant, v_ch, 'How does meiosis differ from mitosis?', 'Meiosis produces 4 haploid daughter cells; mitosis produces 2 diploid identical daughter cells.', 'Think about the number and chromosome count of the resulting cells.', 3, 1),
    (v_tenant, v_ch, 'What is crossing over and why is it important?', 'The exchange of DNA between homologous chromosomes during meiosis, which creates new gene combinations and increases genetic variation.', 'It happens during meiosis, not mitosis.', 3, 2),
    (v_tenant, v_ch, 'What is the difference between diploid and haploid?', 'Diploid (2n) cells have two sets of chromosomes; haploid (n) cells have one set.', 'Body cells are diploid; gametes are haploid.', 2, 3),
    (v_tenant, v_ch, 'Give an example of asexual reproduction in Saskatchewan plants.', 'Aspen trees reproducing by sending up root sprouts to form genetically identical groves.', 'Think about the large connected aspen stands in the parkland.', 2, 4);


  -- Chapter 6: Human Development & Health
  v_ch_num := 6;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Human Development & Health', 'human-development-health',
    'Explore human reproductive systems, the stages of development from fertilization to birth, puberty, and health decision-making.',
    '[
      {"type": "heading", "content": "Human Development & Health", "level": 1},
      {"type": "text", "content": "Human reproduction is a remarkable process that begins at the cellular level and results in the development of a completely new person. Understanding the structures and functions of human reproductive systems, the stages of prenatal development, and the physical changes of puberty equips you to make informed decisions about your own health and well-being throughout life."},
      {"type": "heading", "content": "The Human Reproductive Systems", "level": 2},
      {"type": "text", "content": "The male reproductive system produces sperm cells and delivers them to the female reproductive tract. The testes, located outside the body in the scrotum, produce sperm through meiosis. Sperm cells travel through a series of tubes and are mixed with fluids from accessory glands to form semen. Millions of sperm are released during ejaculation, but typically only one will fertilize an egg."},
      {"type": "text", "content": "The female reproductive system produces egg cells (ova), provides the site for fertilization, and supports the development of the embryo and fetus. The ovaries release one mature egg approximately once every 28 days during a process called ovulation. The egg travels through the fallopian tube toward the uterus. If a sperm cell encounters and fertilizes the egg in the fallopian tube, the resulting zygote travels to the uterus and implants in the thickened uterine lining, beginning pregnancy."},
      {"type": "callout", "content": "Fertilization usually occurs in the fallopian tube when a sperm cell penetrates an egg cell. The fertilized egg is called a zygote and contains 46 chromosomes, 23 from each parent.", "style": "info"},
      {"type": "heading", "content": "Prenatal Development", "level": 2},
      {"type": "text", "content": "After fertilization, the zygote undergoes rapid mitotic division as it travels to the uterus. By about day five it has become a blastocyst, a hollow ball of cells, which implants in the uterine wall. The embryonic stage spans weeks 2 through 8, during which major organ systems begin to form through a process called organogenesis. By eight weeks, all major organs are present in rudimentary form, the embryo is about 2.5 cm long, and it is now referred to as a fetus."},
      {"type": "text", "content": "The fetal stage continues from week 9 until birth, typically around 40 weeks after the last menstrual period. During this time the fetus grows rapidly, organ systems mature, and movement becomes noticeable to the mother. The placenta, a specialized organ that forms from both maternal and fetal tissue, transfers oxygen and nutrients from the mother to the fetus and removes waste products."},
      {"type": "callout", "content": "The placenta acts as the lifeline between mother and fetus. Harmful substances such as alcohol, tobacco smoke, and certain medications can cross the placenta and affect fetal development, which is why avoiding these substances during pregnancy is critical.", "style": "warning"},
      {"type": "heading", "content": "Puberty and Adolescent Development", "level": 2},
      {"type": "text", "content": "Puberty is the period during which adolescents develop secondary sex characteristics and become capable of reproduction. It is triggered by the release of hormones from the pituitary gland. In people assigned female at birth, estrogen drives breast development, widening of the hips, and the onset of menstruation. In people assigned male at birth, testosterone drives growth of the testes, deepening of the voice, facial hair, and increased muscle mass. Puberty typically begins between ages 8 and 13 in females and 9 and 14 in males, though timing varies widely."},
      {"type": "list", "items": ["Puberty involves physical, emotional, and social changes", "Hormones (estrogen and testosterone) drive the changes", "Timing varies considerably from person to person and is influenced by genetics and nutrition", "Adolescence is also a period of significant brain development, particularly in areas related to decision-making"], "ordered": false},
      {"type": "callout", "content": "Many Indigenous communities across Saskatchewan mark the transition from childhood to adulthood with ceremonies that honour both the physical changes of puberty and the social responsibilities that come with growing up. These traditions recognize adolescence as a significant and respected life stage that involves the whole community.", "style": "tip"},
      {"type": "heading", "content": "Making Healthy Decisions", "level": 2},
      {"type": "text", "content": "Understanding reproductive biology supports informed decision-making about sexual health. Sexually transmitted infections (STIs) are passed from person to person through sexual contact and include infections caused by bacteria (such as chlamydia and gonorrhea) and viruses (such as HIV and herpes). Many STIs can be prevented by using barrier protection, and bacterial STIs are treatable with antibiotics when detected early. Regular health screenings and open communication with healthcare providers are essential components of reproductive health."},
      {"type": "quiz", "question": "Where does fertilization of the egg typically occur?", "options": ["In the uterus", "In the ovary", "In the fallopian tube", "In the cervix"], "correct": 2, "explanation": "Fertilization usually takes place in the fallopian tube, where a sperm cell can meet the egg shortly after ovulation. The resulting zygote then travels to the uterus for implantation."},
      {"type": "quiz", "question": "What is the primary function of the placenta during pregnancy?", "options": ["To produce estrogen and progesterone only", "To transfer oxygen and nutrients from mother to fetus and remove waste", "To house the developing egg before fertilization", "To trigger the onset of labour"], "correct": 1, "explanation": "The placenta transfers oxygen and nutrients from the mother''s blood to the fetal blood and removes waste products, acting as the fetus''s lifeline throughout pregnancy."}
    ]'::jsonb,
    '[
      {"term": "Ovulation", "definition": "The release of a mature egg from the ovary, which occurs approximately once every 28 days."},
      {"term": "Fertilization", "definition": "The fusion of a sperm cell and an egg cell to form a zygote."},
      {"term": "Zygote", "definition": "The diploid cell formed when a sperm fertilizes an egg; the earliest stage of a new organism."},
      {"term": "Embryo", "definition": "The developing organism from fertilization through week 8, when major organ systems are forming."},
      {"term": "Fetus", "definition": "The developing organism from week 9 of pregnancy until birth, as organ systems grow and mature."},
      {"term": "Placenta", "definition": "An organ formed from maternal and fetal tissue that transfers nutrients and oxygen to the fetus and removes waste."},
      {"term": "Puberty", "definition": "The period of physical development during which secondary sex characteristics appear and reproductive maturity is reached."},
      {"term": "Hormone", "definition": "A chemical messenger produced by a gland and transported in the blood to target organs, regulating body functions."}
    ]'::jsonb,
    'Many Indigenous communities across Saskatchewan mark the transition from childhood to adulthood with ceremonies that honour both the physical changes of puberty and the expanded social responsibilities of growing up. Traditions such as coming-of-age ceremonies among Cree, Nakoda, and Dene peoples recognize adolescence as a significant life stage involving the whole community, embedding health knowledge within cultural and spiritual frameworks.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is ovulation?', 'The release of a mature egg from the ovary, occurring approximately once every 28 days.', 'It is the event that makes fertilization possible.', 2, 0),
    (v_tenant, v_ch, 'What is the difference between an embryo and a fetus?', 'An embryo is the developing organism from fertilization to week 8; a fetus is from week 9 until birth.', 'The embryonic stage is when organs first form.', 2, 1),
    (v_tenant, v_ch, 'What does the placenta do?', 'It transfers oxygen and nutrients from the mother to the fetus and removes fetal waste products.', 'Think of it as the fetus''s supply line.', 2, 2),
    (v_tenant, v_ch, 'What hormones drive puberty in males and females?', 'Testosterone drives male puberty; estrogen drives female puberty. Both are triggered by hormones from the pituitary gland.', 'Think about which gland signals the start of puberty.', 2, 3);


  -- ==============================
  -- UNIT 4: Exploring the Universe
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Exploring the Universe',
    'Study the origin and life cycle of stars, the structure of galaxies, and the technologies humans have developed to explore space.',
    'The universe is vast, ancient, and dynamic; the light reaching us from stars and galaxies tells the story of cosmic history.',
    'How do we learn about objects billions of light-years away, and what does our exploration of space reveal about our place in the universe?')
  RETURNING id INTO v_unit;

  -- Chapter 7: The Universe & Stars
  v_ch_num := 7;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'The Universe & Stars', 'universe-and-stars',
    'Explore the formation and life cycle of stars, types of galaxies, and the scale of the universe measured in light-years.',
    '[
      {"type": "heading", "content": "The Universe & Stars", "level": 1},
      {"type": "text", "content": "On a clear night far from the lights of Regina or Saskatoon, the sky above the Saskatchewan prairies reveals a breathtaking canopy of stars. The Milky Way arches overhead, a river of light made up of hundreds of billions of stars. But the universe extends far beyond what we can see with the naked eye. Understanding the scale, structure, and history of the universe is one of humanity''s greatest scientific endeavours."},
      {"type": "text", "content": "The universe is estimated to be approximately 13.8 billion years old and began with an event known as the Big Bang, a rapid expansion from an extremely hot, dense state. In the first moments, matter and energy were inseparable. As the universe expanded and cooled over millions of years, gravity caused clouds of hydrogen and helium gas to collapse, forming the first stars and galaxies."},
      {"type": "callout", "content": "The Big Bang Theory is the leading scientific model for the origin of the universe. Evidence includes the observed expansion of the universe, the cosmic microwave background radiation, and the relative abundance of light elements such as hydrogen and helium.", "style": "info"},
      {"type": "heading", "content": "Measuring the Universe: Light-Years", "level": 2},
      {"type": "text", "content": "The distances in space are so enormous that using kilometres would produce unmanageably large numbers. Instead, astronomers use the light-year, the distance that light travels in one year. Since light travels at approximately 300,000 km per second, one light-year equals about 9.46 trillion kilometres. The nearest star to our Sun, Proxima Centauri, is about 4.24 light-years away. The Andromeda Galaxy, the nearest large galaxy to the Milky Way, is about 2.5 million light-years distant."},
      {"type": "callout", "content": "When you look at a star 100 light-years away, you are seeing light that left that star 100 years ago. Telescopes are, in a very real sense, time machines that let us observe the ancient past of the universe.", "style": "example"},
      {"type": "heading", "content": "The Life Cycle of Stars", "level": 2},
      {"type": "text", "content": "Stars are born in vast clouds of gas and dust called nebulae. Gravity pulls the material together, and as the cloud collapses, it heats up. When the core temperature reaches about 10 million degrees Celsius, nuclear fusion ignites: hydrogen nuclei fuse together to form helium, releasing tremendous energy as light and heat. This fusion is what makes stars shine. Our Sun is a medium-sized star currently in the middle of its approximately 10-billion-year main sequence lifetime."},
      {"type": "text", "content": "What happens at the end of a star''s life depends on its mass. A star like the Sun will eventually expand into a red giant as it exhausts its hydrogen fuel. The outer layers will then drift away as a glowing planetary nebula, leaving behind a small, dense core called a white dwarf. More massive stars end their lives much more dramatically: they explode as supernovae, briefly outshining entire galaxies. The remnant core may become a neutron star or, if massive enough, a black hole."},
      {"type": "list", "items": ["Nebula: cloud of gas and dust, birthplace of stars", "Main sequence star: stable phase powered by hydrogen fusion (e.g., our Sun)", "Red giant: expanded star nearing end of hydrogen fuel", "White dwarf: remnant core of a low-mass star after shedding outer layers", "Supernova: explosive death of a massive star", "Neutron star or black hole: remnants of a supernova"], "ordered": false},
      {"type": "heading", "content": "Galaxies", "level": 2},
      {"type": "text", "content": "Galaxies are vast collections of stars, gas, dust, and dark matter held together by gravity. Our home galaxy, the Milky Way, is a barred spiral galaxy estimated to contain 100 to 400 billion stars. Galaxies come in several shapes: spiral galaxies have curved arms of stars wrapping around a central bulge; elliptical galaxies are roughly oval-shaped and contain older stars; irregular galaxies have no defined shape and are often the result of galactic collisions."},
      {"type": "callout", "content": "Cree star knowledge, preserved in oral traditions shared by Elders across Saskatchewan and northern Canada, includes detailed observations of star patterns, their seasonal movements, and their connections to animals, ceremonies, and land use. The Cree constellation Ochiichagos (the Fisher, similar to the Western Big Dipper) was used for navigation and marking the seasons long before European contact.", "style": "tip"},
      {"type": "heading", "content": "Check Your Understanding", "level": 2},
      {"type": "quiz", "question": "What is a light-year?", "options": ["The time it takes light to travel from the Sun to Earth", "The distance light travels in one year, about 9.46 trillion km", "One billion kilometres", "The age of the universe divided by the speed of light"], "correct": 1, "explanation": "A light-year is a unit of distance, not time. It equals the distance light travels in one year, approximately 9.46 trillion kilometres."},
      {"type": "quiz", "question": "What will eventually happen to a medium-mass star like our Sun at the end of its life?", "options": ["It will explode as a supernova and become a black hole", "It will collapse directly into a neutron star", "It will expand into a red giant, shed its outer layers, and leave a white dwarf", "It will simply stop shining and become a cold rock"], "correct": 2, "explanation": "Medium-mass stars like the Sun expand into red giants and then shed their outer layers as a planetary nebula, leaving a white dwarf core behind."}
    ]'::jsonb,
    '[
      {"term": "Big Bang Theory", "definition": "The scientific model proposing that the universe began from an extremely hot, dense state and has been expanding ever since."},
      {"term": "Light-Year", "definition": "The distance light travels in one year, approximately 9.46 trillion kilometres; used to measure distances in space."},
      {"term": "Nuclear Fusion", "definition": "The process by which atomic nuclei combine to form a heavier nucleus, releasing large amounts of energy; powers stars."},
      {"term": "Nebula", "definition": "A large cloud of gas and dust in space; the birthplace of stars."},
      {"term": "Main Sequence Star", "definition": "A star in the stable phase of its life that generates energy by fusing hydrogen into helium in its core."},
      {"term": "Red Giant", "definition": "An aging star that has expanded greatly after exhausting the hydrogen in its core."},
      {"term": "White Dwarf", "definition": "The dense, Earth-sized remnant core left after a low-to-medium mass star sheds its outer layers."},
      {"term": "Supernova", "definition": "A massive explosion that occurs at the end of a high-mass star''s life, briefly outshining entire galaxies."},
      {"term": "Galaxy", "definition": "A large system of stars, gas, dust, and dark matter held together by gravity."}
    ]'::jsonb,
    'Cree star knowledge, preserved in oral traditions shared by Elders across Saskatchewan and northern Canada, includes detailed observations of star patterns, their seasonal movements, and their relationships to land use and ceremony. The Cree constellation Ochiichagos was used for navigation and seasonal timekeeping long before European contact, demonstrating that Indigenous peoples developed sophisticated astronomical systems independent of Western science.',
    35, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a light-year?', 'The distance light travels in one year, approximately 9.46 trillion km. It is a unit of distance, not time.', 'Light travels at 300,000 km per second.', 2, 0),
    (v_tenant, v_ch, 'What process powers stars?', 'Nuclear fusion: hydrogen nuclei fuse to form helium, releasing enormous amounts of energy as light and heat.', 'It happens in the star''s core under extreme temperature and pressure.', 2, 1),
    (v_tenant, v_ch, 'What is the life cycle of a sun-like star?', 'Nebula → main sequence star → red giant → planetary nebula → white dwarf.', 'Think about what happens when hydrogen fuel runs out.', 3, 2),
    (v_tenant, v_ch, 'What is the difference between a supernova and a white dwarf?', 'A supernova is the explosive death of a massive star; a white dwarf is the quiet remnant core of a low-to-medium mass star.', 'Mass determines the ending.', 3, 3),
    (v_tenant, v_ch, 'What type of galaxy is the Milky Way?', 'A barred spiral galaxy, estimated to contain 100 to 400 billion stars.', 'Think about its shape when viewed from above.', 2, 4);


  -- Chapter 8: Space Exploration & Technology
  v_ch_num := 8;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Space Exploration & Technology', 'space-exploration-technology',
    'Examine telescopes, satellites, robotic probes, and Canada''s landmark contributions to space exploration including the Canadarm and astronaut Chris Hadfield.',
    '[
      {"type": "heading", "content": "Space Exploration & Technology", "level": 1},
      {"type": "text", "content": "Since the launch of the Soviet satellite Sputnik in 1957, humanity has sent thousands of spacecraft beyond Earth''s atmosphere. These missions have transformed our understanding of the solar system, revealed the surfaces of distant worlds, and produced technologies that improve everyday life on Earth. Canada has played a meaningful role in this exploration, contributing engineering innovation and outstanding astronauts to the international effort."},
      {"type": "heading", "content": "Telescopes: Windows on the Universe", "level": 2},
      {"type": "text", "content": "A telescope is an instrument that collects and focuses light (or other forms of electromagnetic radiation) from distant objects, making them appear larger and brighter. Optical telescopes use lenses or mirrors to gather visible light. Radio telescopes collect radio waves emitted by distant gas clouds, pulsars, and galaxies. Space-based telescopes such as the Hubble Space Telescope and the James Webb Space Telescope observe from above Earth''s atmosphere, eliminating distortion caused by air and capturing wavelengths of light that are blocked by the atmosphere."},
      {"type": "callout", "content": "The James Webb Space Telescope, launched in 2021, can observe objects over 13 billion light-years away, allowing scientists to study some of the earliest galaxies formed after the Big Bang. Its mirror is over six metres in diameter and operates at temperatures near absolute zero.", "style": "info"},
      {"type": "heading", "content": "Satellites and Their Uses", "level": 2},
      {"type": "text", "content": "Artificial satellites orbit Earth at various altitudes and serve a wide range of purposes. Weather satellites monitor cloud patterns and atmospheric conditions, providing the data behind the forecasts that Saskatchewan farmers and emergency managers rely on. Communications satellites relay telephone, television, and internet signals across vast distances, enabling communities in remote northern Saskatchewan to stay connected. GPS (Global Positioning System) satellites allow precise location finding anywhere on Earth."},
      {"type": "text", "content": "Earth observation satellites track changes in land use, ice coverage, and vegetation health. Scientists use satellite imagery to monitor the retreat of glaciers in the Rockies, the spread of wildfires through the boreal forest, and the health of prairie crops. This data is critical for managing natural resources and responding to environmental change."},
      {"type": "callout", "content": "Saskatchewan''s vast, flat landscape and relatively dark skies make it an excellent location for astronomical observation. The Sleaford area south of Swift Current and the grasslands near Val Marie host some of Canada''s darkest skies, free from urban light pollution.", "style": "example"},
      {"type": "heading", "content": "Canada''s Contributions: Canadarm and Beyond", "level": 2},
      {"type": "text", "content": "Canada has made landmark contributions to space exploration despite not operating its own launch vehicles. The most iconic of these is the Canadarm, a robotic manipulator arm developed by Canadian engineers. The original Shuttle Remote Manipulator System (SRMS), called Canadarm, flew aboard NASA Space Shuttles from 1981 until the Shuttle program ended in 2011. It was used to deploy and retrieve satellites, assist spacewalking astronauts, and handle large structures in orbit."},
      {"type": "text", "content": "Canadarm2, a more advanced and capable successor, was installed on the International Space Station (ISS) in 2001. It is a key component of the station''s assembly and maintenance, able to move along the exterior of the station and handle massive payloads. A third system, Dextre, is a two-armed robotic handyman that performs delicate maintenance tasks outside the ISS. Together, these systems represent Canada''s primary contribution to the ISS partnership and have earned Canada a permanent seat at the table of human spaceflight."},
      {"type": "callout", "content": "The Canadarm family of robotic systems is Canada''s most significant contribution to space exploration. Canadarm2 on the ISS can lift objects with a mass of over 116,000 kg in the microgravity of space and is controlled by Canadian astronauts and ground operators.", "style": "tip"},
      {"type": "heading", "content": "Chris Hadfield: Canada''s Most Famous Astronaut", "level": 2},
      {"type": "text", "content": "Chris Hadfield, born in Sarnia, Ontario and raised partly on a corn farm, became Canada''s most celebrated astronaut. He flew three missions to space, and in 2013 became the first Canadian to command the International Space Station. During his five-month mission, Hadfield communicated with millions of people on Earth through social media, sharing stunning photographs of Canada and the world from orbit. His recording of a song while floating in the ISS''s cupola module brought space science to a global audience and inspired a generation of young Canadians to consider careers in science and engineering."},
      {"type": "list", "items": ["Canada''s space agency is the Canadian Space Agency (CSA), headquartered in Longueuil, Quebec", "Canada has contributed 14 astronauts to date", "The Canadarm (1981), Canadarm2 (2001), and Dextre (2008) are Canada''s three major robotics contributions to the Space Shuttle and ISS programs", "Chris Hadfield commanded the ISS in 2013 and was the first Canadian to walk in space (2001)"], "ordered": false},
      {"type": "callout", "content": "For many Indigenous peoples, the relationship to the sky is deeply spiritual and scientific. Nakoda (Stoney Sioux) traditions include detailed star teachings passed from generation to generation, used for ceremony, direction, and seasonal knowledge. As Canada sends more people and technologies into space, conversations about whose knowledge systems guide exploration and whose stories are carried into orbit are becoming increasingly important.", "style": "tip"},
      {"type": "heading", "content": "Check Your Understanding", "level": 2},
      {"type": "quiz", "question": "What is the primary advantage of a space-based telescope like the Hubble over a ground-based telescope?", "options": ["It is cheaper to build and maintain", "It avoids atmospheric distortion and can detect wavelengths blocked by the atmosphere", "It can be pointed in any direction faster", "It uses a larger mirror than any ground telescope"], "correct": 1, "explanation": "Space-based telescopes operate above Earth''s atmosphere, which distorts visible light and blocks ultraviolet, X-ray, and other wavelengths. This gives space telescopes much clearer and more complete views of the universe."},
      {"type": "quiz", "question": "What is Canada''s most significant hardware contribution to the International Space Station?", "options": ["The Hubble Space Telescope", "The solar panels", "Canadarm2 and the Dextre robotic system", "The life support system"], "correct": 2, "explanation": "Canada contributed Canadarm2, a large robotic manipulator arm, and Dextre, a two-armed robotic maintenance system, which together form Canada''s primary hardware contribution to the ISS."}
    ]'::jsonb,
    '[
      {"term": "Telescope", "definition": "An instrument that collects and focuses electromagnetic radiation from distant objects to make them appear brighter or larger."},
      {"term": "Artificial Satellite", "definition": "A human-made object placed in orbit around Earth or another body to perform functions such as communication, navigation, or observation."},
      {"term": "Canadarm", "definition": "A robotic manipulator arm developed by Canada that was used on NASA Space Shuttles from 1981 to 2011."},
      {"term": "Canadarm2", "definition": "An advanced robotic arm installed on the International Space Station in 2001, capable of moving along the station exterior and handling large payloads."},
      {"term": "International Space Station (ISS)", "definition": "A habitable space station in low Earth orbit, jointly operated by space agencies from the US, Russia, Canada, Europe, and Japan."},
      {"term": "Space Probe", "definition": "An uncrewed spacecraft sent to explore planets, moons, or other bodies in the solar system and beyond."},
      {"term": "Electromagnetic Spectrum", "definition": "The range of all types of electromagnetic radiation, from radio waves through visible light to gamma rays."}
    ]'::jsonb,
    'For many Indigenous peoples across Canada, the relationship to the night sky is deeply spiritual and practical. Nakoda star teachings, passed across generations, encode knowledge of direction, seasons, and ceremony. As Canadian astronauts and technology venture further into space, conversations about whose knowledge systems inform exploration and whose stories are honoured in the cosmos are growing in importance within both Indigenous communities and the broader scientific community.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the advantage of the Hubble Space Telescope over ground-based telescopes?', 'It orbits above the atmosphere, avoiding atmospheric distortion and being able to detect wavelengths blocked at ground level.', 'Think about what Earth''s atmosphere does to light.', 2, 0),
    (v_tenant, v_ch, 'What is Canadarm2?', 'A large robotic manipulator arm attached to the International Space Station, used to move equipment and assist spacewalks. It was installed in 2001.', 'It is Canada''s main contribution to the ISS.', 2, 1),
    (v_tenant, v_ch, 'Name three types of satellites and their uses.', 'Weather satellites (atmospheric monitoring), communications satellites (relaying signals), GPS satellites (navigation and location).', 'Think about satellites you benefit from in daily life.', 2, 2),
    (v_tenant, v_ch, 'What did Chris Hadfield accomplish in 2013?', 'He became the first Canadian to command the International Space Station during a five-month mission.', 'He also became famous for communicating with the public from space.', 2, 3),
    (v_tenant, v_ch, 'What is Dextre?', 'A two-armed robotic system on the ISS, also developed by Canada, used to perform delicate exterior maintenance tasks.', 'It is part of the Canadian robotics family alongside Canadarm2.', 2, 4);

END $$;


-- ============================================================================
-- TEXTBOOK 2: WolfWhale Science 10
-- Slug: wolfwhale-science-10
-- Saskatchewan Curriculum: Earth''s Climate & Atmosphere, Chemical Reactions,
--   Weather Systems, Motion & Forces
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book UUID;
  v_unit UUID;
  v_ch UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-science-10';

  -- ==============================
  -- UNIT 1: Earth''s Climate System
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Earth''s Climate System',
    'Investigate the structure of Earth''s atmosphere, the greenhouse effect, the carbon cycle, and the evidence and impacts of climate change.',
    'Earth''s climate is regulated by interconnected systems involving the atmosphere, oceans, land, and living things; human activities are altering these systems at an unprecedented rate.',
    'How do the atmosphere and carbon cycle regulate Earth''s temperature, and how are human actions changing this balance?')
  RETURNING id INTO v_unit;

  -- Chapter 1: Earth''s Climate System
  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Earth''s Climate System', 'earths-climate-system',
    'Explore the layers of Earth''s atmosphere, the greenhouse effect, and the carbon cycle that regulates global temperatures.',
    '[
      {"type": "heading", "content": "Earth''s Climate System", "level": 1},
      {"type": "text", "content": "Saskatchewan''s climate is extreme by almost any standard: summer temperatures on the prairies can reach 40°C, while winter lows can plunge below -50°C in the far north. This dramatic range is partly the result of the province''s continental location, far from the moderating influence of oceans. But underlying all of Saskatchewan''s local weather patterns is a global climate system shaped by the atmosphere, the oceans, the land surface, and the living organisms that inhabit them."},
      {"type": "text", "content": "Climate is not the same as weather. Weather refers to short-term atmospheric conditions at a specific place and time, such as a blizzard moving through Moose Jaw on a January afternoon. Climate describes the long-term average patterns of temperature, precipitation, and wind in a region, typically measured over 30 or more years. Saskatchewan''s climate is classified as semi-arid continental, characterized by low precipitation, wide temperature swings, and abundant sunshine."},
      {"type": "callout", "content": "Weather is what you get; climate is what you expect. Weather can change in hours; climate shifts over decades and centuries.", "style": "info"},
      {"type": "heading", "content": "Layers of the Atmosphere", "level": 2},
      {"type": "text", "content": "Earth''s atmosphere is a thin layer of gases held to the planet by gravity. It is divided into several distinct layers based on temperature changes with altitude. The troposphere is the lowest layer, extending from the surface to about 12 km altitude, and contains about 75% of the atmosphere''s mass. It is where all weather occurs. Above it lies the stratosphere (12–50 km), which contains the ozone layer that absorbs harmful ultraviolet radiation from the Sun."},
      {"type": "text", "content": "Above the stratosphere, the mesosphere (50–85 km) is where meteors typically burn up. The thermosphere (85–600 km) is where the aurora borealis (northern lights) occurs as charged solar particles collide with atmospheric gases. Saskatchewan is well-positioned to observe the northern lights on clear nights, particularly during periods of high solar activity. The outermost layer, the exosphere, gradually merges with the vacuum of space."},
      {"type": "list", "items": ["Troposphere (0–12 km): weather occurs here, densest layer", "Stratosphere (12–50 km): contains the ozone layer, absorbs UV radiation", "Mesosphere (50–85 km): meteors burn up here", "Thermosphere (85–600 km): aurora borealis occurs here", "Exosphere (600+ km): gradually fades into space"], "ordered": false},
      {"type": "callout", "content": "The aurora borealis, or northern lights, occurs when charged particles from the Sun are guided by Earth''s magnetic field into the thermosphere near the poles. Saskatchewan''s northern communities offer spectacular views of this phenomenon on dark, clear nights.", "style": "example"},
      {"type": "heading", "content": "The Greenhouse Effect", "level": 2},
      {"type": "text", "content": "The greenhouse effect is the process by which certain gases in the atmosphere trap heat from the Sun, warming Earth''s surface to a temperature that supports life. Without any greenhouse effect, Earth''s average surface temperature would be about -18°C, far too cold for most life as we know it. The natural greenhouse effect maintains an average temperature of about +15°C."},
      {"type": "text", "content": "Greenhouse gases (GHGs) include water vapour, carbon dioxide (CO2), methane (CH4), nitrous oxide (N2O), and ozone. These gases are largely transparent to incoming solar radiation (mostly visible light) but absorb outgoing infrared radiation (heat) emitted by Earth''s surface and re-radiate it in all directions, including back toward the surface. The more greenhouse gas in the atmosphere, the more heat is trapped."},
      {"type": "callout", "content": "The greenhouse effect is not inherently harmful. It is a natural process that makes Earth habitable. The concern is the enhanced greenhouse effect: the amplification of this natural warming caused by human-produced GHG emissions.", "style": "info"},
      {"type": "heading", "content": "The Carbon Cycle", "level": 2},
      {"type": "text", "content": "Carbon is continuously cycled through the atmosphere, oceans, living organisms, and rocks. In the atmosphere, carbon exists mainly as CO2. Plants absorb CO2 during photosynthesis, converting it into glucose and storing carbon in their tissues. When plants, animals, and decomposers respire, carbon is released back into the atmosphere as CO2. When organisms die, their carbon-containing remains may be slowly converted over millions of years into fossil fuels such as coal, oil, and natural gas."},
      {"type": "text", "content": "Saskatchewan''s boreal forest and prairie grasslands are significant carbon stores. The organic-rich soils of the prairie, built up over thousands of years by decomposing grasses, hold vast quantities of carbon. When these soils are ploughed, burned, or degraded, stored carbon is released as CO2. Conversely, sustainable agricultural practices and the restoration of native grasslands can help lock carbon back into the soil."},
      {"type": "callout", "content": "The boreal forest that stretches across northern Saskatchewan is one of the largest terrestrial carbon sinks on Earth. It absorbs more CO2 from the atmosphere each year than it releases, playing a critical role in moderating global climate.", "style": "tip"},
      {"type": "quiz", "question": "In which layer of the atmosphere does all of Earth''s weather occur?", "options": ["Stratosphere", "Mesosphere", "Troposphere", "Thermosphere"], "correct": 2, "explanation": "The troposphere is the lowest atmospheric layer, extending from the surface to about 12 km. It contains most of the atmosphere''s mass and is where temperature, pressure, and humidity variations drive all weather phenomena."},
      {"type": "quiz", "question": "What is the greenhouse effect?", "options": ["The warming of Earth caused by the hole in the ozone layer", "The process by which greenhouse gases trap outgoing heat radiation, warming Earth''s surface", "The cooling of Earth''s surface when clouds reflect sunlight", "The absorption of sunlight by Earth''s oceans"], "correct": 1, "explanation": "The greenhouse effect occurs when greenhouse gases absorb infrared radiation emitted by Earth''s surface and re-radiate it back, preventing heat from escaping to space and warming the surface."}
    ]'::jsonb,
    '[
      {"term": "Climate", "definition": "The long-term average patterns of temperature, precipitation, and wind in a region, typically assessed over 30 or more years."},
      {"term": "Weather", "definition": "Short-term atmospheric conditions at a specific location and time."},
      {"term": "Troposphere", "definition": "The lowest layer of the atmosphere, extending to about 12 km, where weather occurs."},
      {"term": "Stratosphere", "definition": "The atmospheric layer above the troposphere, containing the ozone layer that absorbs ultraviolet radiation."},
      {"term": "Greenhouse Effect", "definition": "The warming of Earth''s surface caused by atmospheric gases that trap outgoing heat radiation."},
      {"term": "Greenhouse Gas (GHG)", "definition": "A gas such as CO2, methane, or water vapour that absorbs infrared radiation and contributes to the greenhouse effect."},
      {"term": "Carbon Cycle", "definition": "The continuous movement of carbon through the atmosphere, living organisms, oceans, soil, and rocks."},
      {"term": "Carbon Sink", "definition": "A natural system that absorbs and stores more carbon from the atmosphere than it releases, such as forests and oceans."}
    ]'::jsonb,
    'Indigenous peoples of the northern boreal forest, including Cree, Dene, and Metis communities, have observed and adapted to climate variability for thousands of years. Traditional ecological knowledge (TEK) includes detailed observations of seasonal patterns, animal migration shifts, ice thickness changes, and vegetation responses that now serve as important long-term data for climate scientists. This knowledge, accumulated over generations of careful observation on the land, complements instrumental climate records and enriches our understanding of environmental change.',
    35, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the difference between weather and climate?', 'Weather is short-term atmospheric conditions at one place and time; climate is the long-term average pattern over 30+ years.', 'Weather is what you wear a coat for; climate is why you own a coat.', 1, 0),
    (v_tenant, v_ch, 'Name the five layers of the atmosphere in order from lowest to highest.', 'Troposphere, Stratosphere, Mesosphere, Thermosphere, Exosphere.', 'The acronym TSMT-E can help.', 2, 1),
    (v_tenant, v_ch, 'What is the greenhouse effect?', 'Greenhouse gases trap outgoing infrared radiation from Earth''s surface and re-radiate it back, warming the surface.', 'Think about how a greenhouse keeps plants warm.', 2, 2),
    (v_tenant, v_ch, 'What role does Saskatchewan''s boreal forest play in the carbon cycle?', 'It acts as a carbon sink, absorbing more CO2 from the atmosphere than it releases each year.', 'More absorption than release means it stores carbon.', 2, 3);


  -- Chapter 2: Climate Change & Action
  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Climate Change & Action', 'climate-change-action',
    'Examine the scientific evidence for climate change, its impacts on prairie ecosystems and communities, mitigation strategies, and Indigenous land knowledge.',
    '[
      {"type": "heading", "content": "Climate Change & Action", "level": 1},
      {"type": "text", "content": "The term climate change refers to long-term shifts in global temperatures and precipitation patterns. While Earth''s climate has always varied naturally, the rate and direction of change observed since the mid-20th century is extraordinary. The scientific consensus, supported by data from thousands of independent research groups worldwide, is that the primary driver of current climate change is the increase in atmospheric greenhouse gas concentrations caused by human activities, particularly the burning of fossil fuels and deforestation."},
      {"type": "callout", "content": "Since pre-industrial times (before about 1850), the concentration of CO2 in Earth''s atmosphere has risen from approximately 280 parts per million (ppm) to over 420 ppm. This is the highest CO2 level in at least 800,000 years, as determined from ice core records.", "style": "info"},
      {"type": "heading", "content": "Evidence for Climate Change", "level": 2},
      {"type": "text", "content": "Scientists draw on multiple independent lines of evidence to document climate change. Global average surface temperatures have risen by approximately 1.1°C since the pre-industrial period. Sea levels are rising as glaciers and polar ice sheets melt and as warming oceans expand. Arctic sea ice extent and thickness have declined significantly. The timing of seasonal events such as bird migrations, plant flowering, and ice breakup on rivers has shifted detectably over decades of observations."},
      {"type": "text", "content": "Closer to home, Saskatchewan has warmed by about 2–3°C over the past century, roughly double the global average. The ice-free season on northern lakes has lengthened. Permafrost is thawing in the far north, which releases methane and destabilizes buildings and infrastructure. Droughts have become more frequent and intense on the prairies, threatening agricultural productivity and water supplies."},
      {"type": "callout", "content": "Ice cores drilled from glaciers in the Canadian Rockies and Antarctica contain trapped air bubbles that preserve ancient atmospheric samples. By analyzing these bubbles, scientists can determine CO2 and temperature levels going back hundreds of thousands of years, providing a long-term record of natural climate variation and confirming the current unprecedented rate of change.", "style": "example"},
      {"type": "heading", "content": "Impacts on Saskatchewan and the Prairies", "level": 2},
      {"type": "text", "content": "Saskatchewan''s agricultural sector, which produces much of Canada''s wheat, canola, and pulse crops, is highly sensitive to climate variability. More frequent droughts reduce crop yields and deplete the dugouts and reservoirs that provide water for livestock. Conversely, heavier rainfall events when they do occur can cause flooding and soil erosion. The timing of the growing season is shifting, with earlier springs and later frosts in some areas, which can benefit some crops but also bring new pest and disease pressures."},
      {"type": "text", "content": "Prairie wetlands, which are critical habitat for migratory birds and serve as natural water storage, are shrinking as temperatures rise and evaporation increases. The boreal forest in northern Saskatchewan faces increased wildfire risk. Communities in the far north, including many First Nations reserves, face threats to traditional food systems as fish, game, and plant populations shift or decline in response to warming."},
      {"type": "callout", "content": "Grasslands National Park in southern Saskatchewan protects one of the last large areas of mixed-grass prairie in Canada. This ecosystem, home to bison, black-footed ferrets, and prairie dogs, is particularly vulnerable to drought intensification and invasive species spread driven by climate change.", "style": "example"},
      {"type": "heading", "content": "Mitigation and Adaptation", "level": 2},
      {"type": "text", "content": "Responses to climate change fall into two categories. Mitigation involves reducing greenhouse gas emissions to slow the rate of change, through measures such as shifting to renewable energy, improving energy efficiency, protecting forests, and developing carbon capture technology. Adaptation involves adjusting to the changes that are already occurring or are inevitable, such as developing drought-resistant crops, updating flood infrastructure, and planning for changed fire seasons."},
      {"type": "list", "items": ["Mitigation: switching to solar and wind energy, electrifying transportation, reducing deforestation, improving agricultural soil carbon storage", "Adaptation: drought-resistant crop varieties, updated building codes for extreme weather, early wildfire detection systems, community climate plans"], "ordered": false},
      {"type": "callout", "content": "First Nations and Metis communities across Saskatchewan hold generations of ecological knowledge about sustainable land management, seasonal resource use, and relationship-based stewardship. This traditional land knowledge is increasingly recognized as valuable for designing effective climate adaptation strategies, particularly for managing ecosystems, wetlands, and fire. Several Saskatchewan First Nations are leading collaborative projects that integrate Indigenous knowledge with scientific monitoring.", "style": "tip"},
      {"type": "quiz", "question": "What is the primary human cause of the current increase in atmospheric CO2 concentrations?", "options": ["Increased volcanic eruptions", "Burning of fossil fuels and deforestation", "Changes in Earth''s orbit around the Sun", "Increased solar radiation output"], "correct": 1, "explanation": "The burning of fossil fuels (coal, oil, natural gas) releases CO2 stored underground over millions of years. Deforestation reduces the number of trees available to absorb CO2. Together these are the dominant human causes of rising atmospheric CO2."},
      {"type": "quiz", "question": "What is the difference between climate change mitigation and adaptation?", "options": ["Mitigation speeds up change; adaptation slows it down", "Mitigation reduces emissions to slow climate change; adaptation adjusts to changes that are occurring", "Mitigation is international; adaptation is local", "They are the same thing described differently"], "correct": 1, "explanation": "Mitigation targets the cause by reducing GHG emissions. Adaptation targets the effects by adjusting systems and practices to cope with climate changes already underway or committed to."}
    ]'::jsonb,
    '[
      {"term": "Climate Change", "definition": "Long-term shifts in global temperatures and precipitation patterns, primarily driven today by human greenhouse gas emissions."},
      {"term": "Fossil Fuels", "definition": "Carbon-rich fuels, including coal, oil, and natural gas, formed from ancient organic matter over millions of years."},
      {"term": "Mitigation", "definition": "Actions that reduce greenhouse gas emissions to slow the rate of climate change."},
      {"term": "Adaptation", "definition": "Adjusting human systems or natural resource management to reduce harm from climate changes already underway."},
      {"term": "Permafrost", "definition": "Ground that remains frozen for two or more consecutive years; widespread in northern Saskatchewan and threatened by warming."},
      {"term": "Carbon Capture", "definition": "Technology or natural processes that remove CO2 from the atmosphere and store it in long-term reservoirs."},
      {"term": "Traditional Ecological Knowledge (TEK)", "definition": "The accumulated knowledge about local ecosystems, species, and environmental change held by Indigenous peoples over generations."}
    ]'::jsonb,
    'First Nations and Metis communities across Saskatchewan hold generations of detailed knowledge about local ecosystems, seasonal patterns, and sustainable land management. This traditional ecological knowledge is increasingly recognized by climate scientists as a valuable long-term dataset for understanding environmental change. Several Saskatchewan First Nations are leading collaborative monitoring projects that integrate Indigenous land knowledge with scientific instruments, creating richer and more complete pictures of how the prairies and boreal forest are responding to a changing climate.',
    35, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'By approximately how much has Saskatchewan warmed over the past century?', 'About 2–3°C, roughly double the global average warming.', 'Continental interiors warm faster than coastal areas.', 2, 0),
    (v_tenant, v_ch, 'What is the difference between mitigation and adaptation in the context of climate change?', 'Mitigation reduces GHG emissions to slow climate change; adaptation adjusts practices and infrastructure to cope with changes already occurring.', 'Mitigation = address the cause; adaptation = address the effects.', 2, 1),
    (v_tenant, v_ch, 'What is permafrost and why is its thaw concerning?', 'Permanently frozen ground in the north. When it thaws due to warming, it releases stored methane (a potent GHG) and destabilizes infrastructure.', 'Think about what is stored in frozen ground.', 3, 2),
    (v_tenant, v_ch, 'What is traditional ecological knowledge (TEK)?', 'The accumulated knowledge about local ecosystems and environmental change held by Indigenous peoples, developed through generations of careful observation on the land.', 'It is a long-term record that complements scientific data.', 2, 3);


  -- ==============================
  -- UNIT 2: Chemical Reactions
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Chemical Reactions',
    'Investigate types of chemical reactions, how to balance chemical equations, the law of conservation of mass, and the principles of solutions and stoichiometry.',
    'Chemical reactions rearrange atoms to form new substances; matter is conserved in every reaction, and the relationships between quantities of reactants and products can be precisely calculated.',
    'How do chemists describe, predict, and quantify the transformations that occur when substances react?')
  RETURNING id INTO v_unit;

  -- Chapter 3: Chemical Reactions
  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Chemical Reactions', 'chemical-reactions',
    'Identify and classify types of chemical reactions, write and balance chemical equations, and apply the law of conservation of mass.',
    '[
      {"type": "heading", "content": "Chemical Reactions", "level": 1},
      {"type": "text", "content": "A chemical reaction occurs when substances, called reactants, are transformed into new substances called products. During a chemical reaction, the chemical bonds in the reactants are broken, and new bonds form to produce the products. The atoms themselves are not created or destroyed; they are rearranged. This fundamental principle, the law of conservation of mass, means that the total mass of reactants always equals the total mass of products in a closed system."},
      {"type": "text", "content": "Chemical reactions are happening all around us in Saskatchewan. The combustion of natural gas in a furnace on a cold January night, the rusting of farm equipment left in a field, the fermentation of grain in a brewery, the digestion of a meal, and the photosynthesis occurring in a wheat field on a July afternoon are all chemical reactions. Recognizing the signs of a chemical reaction helps us distinguish it from physical changes such as melting or dissolving."},
      {"type": "callout", "content": "Signs that a chemical reaction has occurred include: a colour change, formation of a gas (bubbling), formation of a precipitate (solid appearing in a liquid), release or absorption of heat, and production of light. These signs indicate that new substances with new properties have formed.", "style": "info"},
      {"type": "heading", "content": "Chemical Equations", "level": 2},
      {"type": "text", "content": "A chemical equation is a shorthand representation of a chemical reaction using chemical formulas. The reactants are written on the left side of an arrow, and the products are written on the right. Coefficients (numbers placed in front of formulas) indicate the relative number of each molecule involved. For example, the combustion of methane (natural gas) is written as: CH4 + 2O2 → CO2 + 2H2O. This reads as one molecule of methane reacts with two molecules of oxygen to produce one molecule of carbon dioxide and two molecules of water."},
      {"type": "callout", "content": "A balanced chemical equation has the same number of each type of atom on both the reactant and product sides. This satisfies the law of conservation of mass: atoms are rearranged, not created or destroyed.", "style": "info"},
      {"type": "heading", "content": "Balancing Chemical Equations", "level": 2},
      {"type": "text", "content": "To balance a chemical equation, adjust the coefficients in front of each formula until the number of atoms of each element is equal on both sides. Never change the subscripts within a formula, as this would change the identity of the substance. Start by balancing the element that appears in the fewest formulas, and save hydrogen and oxygen for last, as they often appear in multiple compounds."},
      {"type": "text", "content": "Example: Balance the equation for the formation of water from hydrogen and oxygen gas. Unbalanced: H2 + O2 → H2O. Check atoms: left has 2 H and 2 O; right has 2 H and 1 O. Oxygen is unbalanced. Place a coefficient of 2 in front of H2O: H2 + O2 → 2 H2O. Now left has 2 H and 2 O; right has 4 H and 2 O. Hydrogen is now unbalanced. Place a 2 in front of H2: 2 H2 + O2 → 2 H2O. Check: left has 4 H and 2 O; right has 4 H and 2 O. Balanced."},
      {"type": "heading", "content": "Types of Chemical Reactions", "level": 2},
      {"type": "text", "content": "Chemists classify reactions into several types based on the pattern of reactant and product arrangement. In a synthesis (combination) reaction, two or more substances combine to form a single product: A + B → AB. In a decomposition reaction, a single compound breaks down into two or more simpler substances: AB → A + B. In a single displacement reaction, a more reactive element displaces a less reactive element from a compound: A + BC → AC + B. In a double displacement reaction, the cations of two ionic compounds exchange partners: AB + CD → AD + CB. Combustion reactions involve a fuel reacting rapidly with oxygen, releasing heat and light, with carbon dioxide and water as products."},
      {"type": "list", "items": ["Synthesis: A + B → AB (two substances combine into one)", "Decomposition: AB → A + B (one substance breaks into simpler ones)", "Single displacement: A + BC → AC + B (one element replaces another)", "Double displacement: AB + CD → AD + CB (ions swap partners)", "Combustion: fuel + O2 → CO2 + H2O + energy"], "ordered": false},
      {"type": "callout", "content": "Many Indigenous knowledge traditions across the prairies include a sophisticated understanding of transformation through fire. Controlled burning of grasslands, practiced by Cree and Blackfoot peoples for centuries before European settlement, is a form of applied combustion chemistry: it releases nutrients locked in dead plant matter, stimulates new growth, and manages habitat for bison and other animals. Modern prairie restoration science has confirmed the ecological wisdom of this practice.", "style": "tip"},
      {"type": "quiz", "question": "What does the law of conservation of mass state?", "options": ["Energy is always released in a chemical reaction", "The total mass of reactants equals the total mass of products in a closed system", "Atoms are destroyed when bonds are broken", "Products always have less mass than reactants"], "correct": 1, "explanation": "The law of conservation of mass states that matter is neither created nor destroyed in a chemical reaction. Atoms are rearranged into new substances, so the total mass of reactants always equals the total mass of products."},
      {"type": "quiz", "question": "Which type of chemical reaction is represented by: 2 H2O2 → 2 H2O + O2?", "options": ["Synthesis", "Single displacement", "Combustion", "Decomposition"], "correct": 3, "explanation": "In this reaction, one compound (hydrogen peroxide, H2O2) breaks down into two simpler substances (water and oxygen gas). This matches the pattern AB → A + B, which is a decomposition reaction."}
    ]'::jsonb,
    '[
      {"term": "Chemical Reaction", "definition": "A process in which the atoms of reactants are rearranged to form new substances called products."},
      {"term": "Reactant", "definition": "A starting substance that undergoes change in a chemical reaction."},
      {"term": "Product", "definition": "A new substance formed as the result of a chemical reaction."},
      {"term": "Law of Conservation of Mass", "definition": "The principle that the total mass of reactants equals the total mass of products in any chemical reaction."},
      {"term": "Chemical Equation", "definition": "A symbolic representation of a chemical reaction using chemical formulas and coefficients."},
      {"term": "Coefficient", "definition": "A number placed in front of a chemical formula in an equation to indicate the number of units of that substance involved."},
      {"term": "Synthesis Reaction", "definition": "A reaction in which two or more substances combine to form a single product."},
      {"term": "Decomposition Reaction", "definition": "A reaction in which a single compound breaks down into two or more simpler substances."},
      {"term": "Combustion Reaction", "definition": "A rapid reaction of a fuel with oxygen that releases heat and light, producing CO2 and H2O."}
    ]'::jsonb,
    'Controlled burning of grasslands, practiced by Cree and Blackfoot peoples across the prairies for centuries before European settlement, represents sophisticated applied knowledge of combustion and ecosystem chemistry. Fire was used to stimulate new grass growth, manage bison habitat, clear travel routes, and communicate across distances. Modern prairie ecology and restoration science has confirmed the ecological soundness of these practices, and some Saskatchewan conservation areas now partner with Indigenous communities to reintroduce cultural burning.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the law of conservation of mass?', 'The total mass of reactants always equals the total mass of products in a chemical reaction. Atoms are rearranged, not created or destroyed.', 'Mass is conserved because atoms are just rearranged.', 2, 0),
    (v_tenant, v_ch, 'What are the five main types of chemical reactions?', 'Synthesis, decomposition, single displacement, double displacement, and combustion.', 'Think about how reactants and products are arranged in each.', 2, 1),
    (v_tenant, v_ch, 'What does a coefficient in a chemical equation represent?', 'The number of units (molecules or formula units) of that substance involved in the reaction.', 'It is the number in front of the formula, not the subscript.', 2, 2),
    (v_tenant, v_ch, 'What are the products of a complete combustion reaction?', 'Carbon dioxide (CO2) and water (H2O), plus the release of heat and light.', 'Complete combustion requires sufficient oxygen.', 2, 3);


  -- Chapter 4: Solutions & Stoichiometry
  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Solutions & Stoichiometry', 'solutions-stoichiometry',
    'Investigate the properties of solutions, how to calculate concentration and dilution, and an introduction to the mole concept.',
    '[
      {"type": "heading", "content": "Solutions & Stoichiometry", "level": 1},
      {"type": "text", "content": "Many of the most important chemical systems in nature and industry exist as solutions. The water in Saskatchewan''s lakes and rivers is a dilute solution of dissolved minerals and gases. The blood in your body is a complex aqueous solution carrying oxygen, nutrients, hormones, and waste. The liquid fertilizers used on Saskatchewan farms are solutions of dissolved nutrients in water. Understanding how solutions behave and how to calculate the quantities involved in chemical reactions is central to chemistry."},
      {"type": "heading", "content": "What Is a Solution?", "level": 2},
      {"type": "text", "content": "A solution is a homogeneous mixture in which one substance (the solute) is dissolved uniformly throughout another (the solvent). In most familiar solutions, the solvent is water, making them aqueous solutions. Salt water is a solution of sodium chloride (solute) in water (solvent). The process of dissolving occurs when attractive forces between solute particles and water molecules are stronger than the forces holding the solute particles together, causing the solute to disperse uniformly throughout the solvent."},
      {"type": "callout", "content": "A solution is homogeneous, meaning its composition is uniform throughout. If you take a sample from the top or the bottom of a well-mixed salt water solution, both samples will have the same salt concentration.", "style": "info"},
      {"type": "heading", "content": "Concentration", "level": 2},
      {"type": "text", "content": "Concentration describes how much solute is dissolved in a given volume of solution. A concentrated solution has a large amount of solute per unit volume; a dilute solution has a small amount. Concentration can be expressed in several ways, but in chemistry, molar concentration (molarity, M) is most common. Molarity is defined as the number of moles of solute per litre of solution: M = moles of solute / litres of solution."},
      {"type": "text", "content": "For example, if 0.5 mol of sodium chloride is dissolved in enough water to make 1.0 L of solution, the concentration is 0.5 mol/L (or 0.5 M). If you dissolve the same 0.5 mol of NaCl in 2.0 L of solution, the concentration falls to 0.25 M. Doubling the volume while keeping the amount of solute constant halves the concentration. This is the principle of dilution."},
      {"type": "callout", "content": "Dilution Formula: C1V1 = C2V2, where C1 and C2 are the initial and final concentrations, and V1 and V2 are the initial and final volumes. When you dilute a solution, the number of moles of solute stays constant.", "style": "tip"},
      {"type": "heading", "content": "Introduction to the Mole Concept", "level": 2},
      {"type": "text", "content": "A mole is the chemist''s counting unit. Just as a dozen always means 12 items, a mole always means 6.022 x 10^23 particles (Avogadro''s number). This particular number was chosen because it makes the mass of one mole of any element numerically equal to its atomic mass in grams. One mole of carbon-12 atoms has a mass of exactly 12 grams. One mole of water (H2O, molar mass 18 g/mol) has a mass of 18 grams. Using moles allows chemists to count atoms and molecules by weighing them."},
      {"type": "text", "content": "Stoichiometry is the study of the quantitative relationships between reactants and products in a chemical reaction. The coefficients in a balanced equation give the mole ratios of all substances involved. For example, in the reaction 2 H2 + O2 → 2 H2O, two moles of hydrogen react with one mole of oxygen to produce two moles of water. If you start with 4 mol of H2, you need 2 mol of O2 and will produce 4 mol of H2O."},
      {"type": "callout", "content": "Mole ratios from balanced equations are the heart of stoichiometry. They allow chemists to calculate exactly how much of each reactant is needed and how much product will be formed, which is essential for industrial chemistry, pharmaceutical manufacturing, and environmental analysis.", "style": "info"},
      {"type": "callout", "content": "Indigenous peoples of the northern prairies and boreal forest have long worked with natural solutions, using boiled plant extracts, mineral-rich spring water, and fermented foods as medicines, dyes, and preservatives. The selective use of specific plants and minerals reflects an empirical understanding of solubility and concentration developed through centuries of careful trial and application.", "style": "tip"},
      {"type": "quiz", "question": "A student dissolves 2.0 mol of KCl in enough water to make 4.0 L of solution. What is the molar concentration?", "options": ["8.0 M", "0.5 M", "2.0 M", "0.25 M"], "correct": 1, "explanation": "Molar concentration M = moles of solute / litres of solution = 2.0 mol / 4.0 L = 0.5 M."},
      {"type": "quiz", "question": "What does Avogadro''s number (6.022 x 10^23) represent?", "options": ["The number of protons in one gram of hydrogen", "The number of particles in one mole of any substance", "The mass in grams of one molecule", "The number of electrons in one mole of electrons only"], "correct": 1, "explanation": "Avogadro''s number defines the mole: one mole of any substance contains 6.022 x 10^23 representative particles (atoms, molecules, or formula units)."}
    ]'::jsonb,
    '[
      {"term": "Solution", "definition": "A homogeneous mixture in which a solute is dissolved uniformly throughout a solvent."},
      {"term": "Solute", "definition": "The substance that is dissolved in a solution."},
      {"term": "Solvent", "definition": "The substance that dissolves the solute, present in larger amount in the solution."},
      {"term": "Concentration", "definition": "The amount of solute dissolved per unit volume of solution."},
      {"term": "Molarity (M)", "definition": "Molar concentration: the number of moles of solute per litre of solution."},
      {"term": "Dilution", "definition": "The process of reducing the concentration of a solution by adding more solvent."},
      {"term": "Mole", "definition": "A unit representing 6.022 x 10^23 particles of a substance; the amount whose mass in grams equals the substance''s molar mass."},
      {"term": "Stoichiometry", "definition": "The quantitative study of the relationships between amounts of reactants and products in chemical reactions."},
      {"term": "Mole Ratio", "definition": "The ratio of moles of one substance to moles of another substance in a balanced chemical equation."}
    ]'::jsonb,
    'Indigenous peoples across the prairies and boreal forest have worked with natural solutions for centuries, using plant extracts, mineral spring water, and fermented foods as medicines, dyes, and preservatives. The selective choice of plants, preparation methods, and applications reflects an empirical understanding of solubility, concentration, and chemical transformation developed through generations of careful observation. This traditional knowledge of chemistry is increasingly studied by researchers in pharmacology and natural product chemistry.',
    35, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is molarity and how is it calculated?', 'Molarity (M) is the concentration of a solution in moles of solute per litre of solution. M = moles of solute / litres of solution.', 'Units are mol/L.', 2, 0),
    (v_tenant, v_ch, 'What is Avogadro''s number?', '6.022 x 10^23 — the number of particles (atoms, molecules, or formula units) in one mole of any substance.', 'It is the definition of a mole.', 2, 1),
    (v_tenant, v_ch, 'State the dilution formula.', 'C1V1 = C2V2: initial concentration times initial volume equals final concentration times final volume. The amount of solute is constant.', 'Diluting keeps moles constant but changes concentration.', 2, 2),
    (v_tenant, v_ch, 'What is stoichiometry?', 'The calculation of quantities of reactants and products in a chemical reaction using mole ratios from the balanced equation.', 'Coefficients in a balanced equation give the mole ratios.', 3, 3);


  -- ==============================
  -- UNIT 3: Weather & Water Systems
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Weather & Water Systems',
    'Investigate the factors that create weather systems, the role of water in climate regulation, and the significance of these systems for Saskatchewan.',
    'Weather and water systems are driven by energy from the Sun and shaped by Earth''s geography; understanding them is essential for life in Saskatchewan''s dynamic environment.',
    'How do air masses, ocean currents, and the water cycle interact to shape the weather and climate of Saskatchewan and the broader world?')
  RETURNING id INTO v_unit;

  -- Chapter 5: Weather Systems
  v_ch_num := 5;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Weather Systems', 'weather-systems',
    'Examine air masses, fronts, severe weather on the prairies, and the science of weather forecasting.',
    '[
      {"type": "heading", "content": "Weather Systems", "level": 1},
      {"type": "text", "content": "Saskatchewan sits at a meteorological crossroads. The flat, open prairies with no significant mountain barriers to the north or south allow cold Arctic air masses to sweep down from the north and warm, moist air masses to push up from the Gulf of Mexico. When these contrasting air masses collide, the results can be spectacular and dangerous: blizzards, thunderstorms, hail, and tornadoes are all part of life in Saskatchewan. Understanding how weather systems form and move is both a scientific and a practical necessity for everyone living in the province."},
      {"type": "heading", "content": "Air Masses", "level": 2},
      {"type": "text", "content": "An air mass is a large body of air that has relatively uniform temperature and humidity characteristics throughout. Air masses develop their properties from the surface over which they form. Continental polar (cP) air masses form over cold, dry land surfaces in northern Canada and deliver the extreme cold of a Saskatchewan winter. Maritime tropical (mT) air masses form over warm ocean water and bring warm, humid air northward in summer. Continental tropical (cT) air masses, though rare in Saskatchewan, form over hot, dry land and can bring intense heat waves in summer."},
      {"type": "callout", "content": "Air mass classification uses two descriptors: the moisture source (maritime = over ocean, continental = over land) and the temperature of the source region (tropical = warm, polar = cold, arctic = very cold). Continental polar (cP) air masses are responsible for the most extreme cold snaps in Saskatchewan.", "style": "info"},
      {"type": "heading", "content": "Fronts", "level": 2},
      {"type": "text", "content": "A front is the boundary between two air masses with different properties. When a cold air mass pushes into a region occupied by a warmer air mass, the leading edge is called a cold front. Cold fronts tend to move quickly and produce brief but intense precipitation, often followed by rapidly clearing skies and dropping temperatures. When a warm air mass advances into colder air, the boundary is a warm front. Warm fronts move more slowly and typically produce a long period of light to moderate precipitation ahead of the front."},
      {"type": "text", "content": "An occluded front forms when a faster-moving cold front catches up to a warm front, lifting the warm air mass completely off the ground. A stationary front occurs when neither air mass is strong enough to advance, leading to persistent precipitation over one region. The passage of fronts through Saskatchewan is the primary driver of day-to-day weather changes across the province."},
      {"type": "callout", "content": "Saskatchewan averages about 20 tornadoes per year, making it one of the most tornado-prone regions of Canada. Most occur in the southern prairie triangle between Regina, Estevan, and Swift Current during the summer months when warm, moist air from the south collides with dry, cold air aloft.", "style": "example"},
      {"type": "heading", "content": "Severe Weather on the Prairies", "level": 2},
      {"type": "text", "content": "The collision of contrasting air masses over the flat prairies creates ideal conditions for severe weather. Supercell thunderstorms develop when wind speeds and directions change with height (wind shear), causing rising air to rotate. These rotating updrafts, called mesocyclones, can spawn tornadoes. Hailstorms are another significant hazard: updrafts in powerful thunderstorms carry ice pellets aloft repeatedly, allowing them to grow to destructive sizes before falling. Saskatchewan hail events regularly cause millions of dollars in crop damage."},
      {"type": "text", "content": "In winter, blizzards form when strong winds combine with heavy snowfall or blowing existing snow to reduce visibility to near zero. The combination of low temperatures and wind produces dangerous wind chill values. Saskatchewan communities have well-developed protocols for school and road closures during extreme winter weather."},
      {"type": "heading", "content": "Weather Forecasting", "level": 2},
      {"type": "text", "content": "Modern weather forecasting uses data collected from thousands of surface stations, weather balloons, satellites, and radar networks. Numerical weather prediction (NWP) models run on powerful computers, solving mathematical equations that describe atmospheric motion to project how weather systems will evolve. For Saskatchewan''s agricultural and aviation sectors, accurate forecasts are enormously valuable. Environment and Climate Change Canada maintains forecast offices in Winnipeg and Edmonton that produce the forecasts used across the province."},
      {"type": "callout", "content": "Cree and Nakoda weather knowledge, developed over thousands of years of living on the prairies and in the boreal forest, includes detailed observations of cloud patterns, wind shifts, animal behaviour, and seasonal signs that indicate changing weather. Elders'' ability to read the sky and land represents a sophisticated system of environmental observation that complements modern meteorological instruments.", "style": "tip"},
      {"type": "quiz", "question": "What type of front forms when a cold air mass rapidly advances and pushes under a warmer air mass?", "options": ["Warm front", "Stationary front", "Occluded front", "Cold front"], "correct": 3, "explanation": "A cold front is the leading edge of an advancing cold air mass pushing into warmer air. Cold fronts typically produce brief, intense precipitation and rapid temperature drops."},
      {"type": "quiz", "question": "Which air mass type is primarily responsible for extreme winter cold in Saskatchewan?", "options": ["Maritime tropical (mT)", "Continental tropical (cT)", "Continental polar (cP)", "Maritime polar (mP)"], "correct": 2, "explanation": "Continental polar (cP) air masses form over cold, dry land in northern Canada. When they push southward over Saskatchewan, they bring the extreme cold temperatures characteristic of prairie winters."}
    ]'::jsonb,
    '[
      {"term": "Air Mass", "definition": "A large body of air with relatively uniform temperature and humidity throughout, classified by the surface over which it formed."},
      {"term": "Front", "definition": "The boundary between two air masses with different temperatures and humidity levels."},
      {"term": "Cold Front", "definition": "The leading edge of a cold air mass advancing into a warmer region, typically producing brief intense precipitation."},
      {"term": "Warm Front", "definition": "The leading edge of a warm air mass advancing over a colder region, producing prolonged light precipitation."},
      {"term": "Occluded Front", "definition": "A front formed when a fast-moving cold front overtakes a warm front, lifting warm air off the surface."},
      {"term": "Wind Shear", "definition": "A change in wind speed or direction with height, which can cause rising air to rotate and form severe thunderstorms."},
      {"term": "Supercell", "definition": "A large, rotating thunderstorm with a persistent mesocyclone, capable of producing tornadoes and large hail."},
      {"term": "Numerical Weather Prediction (NWP)", "definition": "Weather forecasting using computer models that solve mathematical equations describing atmospheric motion."}
    ]'::jsonb,
    'Cree and Nakoda weather knowledge, developed over thousands of years of living on the prairies and in the boreal forest, includes systematic observation of cloud patterns, wind direction changes, animal behaviour, and plant indicators that signal shifting weather. This traditional forecasting knowledge represents a sophisticated environmental monitoring system. Modern researchers working with Indigenous communities in Saskatchewan are documenting these observations as complementary long-term climate datasets.',
    35, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is an air mass?', 'A large body of air with relatively uniform temperature and humidity throughout, classified by its source region.', 'Continental = over land; maritime = over ocean. Polar = cold; tropical = warm.', 2, 0),
    (v_tenant, v_ch, 'What is the difference between a cold front and a warm front?', 'A cold front is advancing cold air pushing under warm air (brief intense storms). A warm front is warm air gliding over cold air (prolonged light rain).', 'Cold fronts move faster and bring sharper weather changes.', 2, 1),
    (v_tenant, v_ch, 'What conditions favour tornado formation?', 'Colliding warm and cold air masses plus wind shear (change in wind speed/direction with height) that causes rising air to rotate in supercell thunderstorms.', 'Saskatchewan''s flat terrain and air mass collisions make it tornado-prone.', 3, 2),
    (v_tenant, v_ch, 'What type of air mass brings the coldest winter weather to Saskatchewan?', 'Continental polar (cP) air masses, which form over the cold, dry land surface of northern Canada.', 'Continental = dry land source; polar = cold temperature.', 2, 3);


  -- Chapter 6: Water & Climate
  v_ch_num := 6;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Water & Climate', 'water-and-climate',
    'Explore the water cycle, ocean currents, El Nino and La Nina events, and the significance of drought and water management for Saskatchewan.',
    '[
      {"type": "heading", "content": "Water & Climate", "level": 1},
      {"type": "text", "content": "Water is the most important substance on Earth for regulating climate and sustaining life. Saskatchewan, despite being a landlocked province far from any ocean, is profoundly influenced by water: the snowmelt from the Rocky Mountains fills the South Saskatchewan River each spring; summer thunderstorms replenish shallow prairie lakes and dugouts; and shifts in global ocean circulation patterns thousands of kilometres away determine whether Saskatchewan will experience drought or above-normal precipitation in any given year."},
      {"type": "heading", "content": "The Water Cycle", "level": 2},
      {"type": "text", "content": "The water cycle, also called the hydrological cycle, describes the continuous movement of water through the environment. Solar energy drives evaporation from the surface of oceans, lakes, rivers, and land. Water vapour rises into the atmosphere, cools, and condenses around tiny particles to form clouds through a process called condensation. When water droplets in clouds grow large enough, they fall as precipitation (rain, snow, sleet, or hail). On the ground, water follows several pathways: it may flow overland as runoff into streams and rivers, infiltrate into the soil to become groundwater, or be taken up by plants and released back into the atmosphere through transpiration."},
      {"type": "text", "content": "In Saskatchewan, the water cycle has a strong seasonal character. Winter precipitation accumulates as snowpack on the prairies and in the mountains to the west. Spring melt releases this stored water, recharging rivers, sloughs, and groundwater. Summer convective storms provide critical mid-season moisture. In drier years, shallow prairie wetlands called sloughs may dry up entirely. The health of these wetlands matters enormously for biodiversity: over half the waterfowl produced in North America nest in Saskatchewan''s prairie potholes."},
      {"type": "callout", "content": "Saskatchewan''s prairie potholes, thousands of shallow wetlands left by retreating glaciers at the end of the last ice age, are sometimes called the duck factory of North America. They provide nesting habitat for an estimated 50–80% of North American ducks in good water years.", "style": "example"},
      {"type": "heading", "content": "Ocean Currents and Climate", "level": 2},
      {"type": "text", "content": "Oceans cover over 70% of Earth''s surface and act as enormous heat reservoirs. Ocean currents redistribute heat around the planet, profoundly affecting the climates of nearby landmasses. The thermohaline circulation, sometimes called the ocean conveyor belt, is a global pattern of ocean currents driven by differences in water temperature and salinity. Warm surface water flows from the tropics toward the poles, releases heat to the atmosphere, becomes denser and saltier as it cools, sinks, and returns as deep cold water. This circulation moderates climates globally and is sensitive to changes in freshwater input from melting ice."},
      {"type": "heading", "content": "El Nino and La Nina", "level": 2},
      {"type": "text", "content": "El Nino and La Nina are opposite phases of a natural climate pattern called the El Nino-Southern Oscillation (ENSO), driven by changes in Pacific Ocean surface temperatures and atmospheric pressure. During an El Nino event, surface waters in the central and eastern Pacific warm above normal. This shifts atmospheric circulation patterns globally, and for Saskatchewan it typically means drier and warmer conditions, particularly in winter and spring. El Nino years are often associated with increased drought risk on the prairies."},
      {"type": "text", "content": "La Nina, the opposite phase, involves cooler-than-normal Pacific surface temperatures. For Saskatchewan, La Nina years tend to bring cooler and wetter conditions, particularly in winter. Understanding which phase of ENSO is active helps seasonal forecasters at Environment Canada provide better agricultural outlooks months in advance, giving Saskatchewan farmers more time to plan."},
      {"type": "callout", "content": "The droughts of the 1930s that created the Dust Bowl in the prairies were among the most severe in the historical record. They resulted from a combination of natural climate variability (similar to La Nina drought patterns), unsustainable farming practices, and a period of below-normal precipitation. Modern soil conservation practices, shelter belts, and water storage infrastructure have reduced but not eliminated drought risk.", "style": "example"},
      {"type": "callout", "content": "Water holds a central place in the spiritual and practical life of Indigenous peoples across Saskatchewan. Cree, Saulteaux, and Dene communities have long understood rivers, lakes, and wetlands as living relationships rather than resources. The concept of water as a relative and a teacher, rather than a commodity, informs Indigenous-led water governance movements that are increasingly influencing provincial and national water policy.", "style": "tip"},
      {"type": "quiz", "question": "What drives the water cycle?", "options": ["Gravity alone", "The rotation of the Earth", "Solar energy (causing evaporation) and gravity (causing precipitation and runoff)", "Ocean currents only"], "correct": 2, "explanation": "Solar energy provides the heat that evaporates water from Earth''s surface, driving the water cycle. Gravity then pulls precipitation and runoff back to lower elevations. Both forces are essential."},
      {"type": "quiz", "question": "How does an El Nino event typically affect Saskatchewan''s weather?", "options": ["Cooler and wetter conditions, especially in winter", "Warmer and drier conditions, with increased drought risk", "More frequent blizzards and record cold", "No measurable effect on Saskatchewan weather"], "correct": 1, "explanation": "El Nino events warm the central Pacific, shifting atmospheric circulation in ways that typically bring warmer and drier conditions to the Saskatchewan prairies, particularly in winter and spring, increasing drought risk."}
    ]'::jsonb,
    '[
      {"term": "Water Cycle (Hydrological Cycle)", "definition": "The continuous movement of water through the environment via evaporation, condensation, precipitation, runoff, infiltration, and transpiration."},
      {"term": "Evaporation", "definition": "The process by which liquid water gains enough energy to become water vapour and enter the atmosphere."},
      {"term": "Condensation", "definition": "The process by which water vapour cools and changes into liquid water droplets, forming clouds and fog."},
      {"term": "Precipitation", "definition": "Water falling from the atmosphere in any form: rain, snow, sleet, or hail."},
      {"term": "Thermohaline Circulation", "definition": "The global ocean current system driven by differences in water temperature and salinity; sometimes called the ocean conveyor belt."},
      {"term": "El Nino", "definition": "A phase of the ENSO climate pattern characterized by warmer-than-normal Pacific surface temperatures, often bringing drier conditions to Saskatchewan."},
      {"term": "La Nina", "definition": "The opposite ENSO phase to El Nino, with cooler Pacific surface temperatures, often associated with wetter and cooler prairie winters."},
      {"term": "Prairie Pothole", "definition": "A shallow prairie wetland formed by glacial activity at the end of the last ice age; critical habitat for migratory birds."}
    ]'::jsonb,
    'Water holds a central place in the spiritual and practical lives of Cree, Saulteaux, Dene, and Nakoda peoples across Saskatchewan. The understanding of rivers, lakes, and wetlands as living relationships and responsibilities, rather than as resources to be extracted, informs Indigenous-led water governance movements and legal challenges in Saskatchewan and across Canada. Traditional knowledge of water systems, seasonal ice, and the ecological signs of water quality represents a sophisticated long-term observation record that is increasingly valued by water scientists and policy makers.',
    35, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'List the main steps of the water cycle.', 'Evaporation → condensation (cloud formation) → precipitation → runoff/infiltration/transpiration → back to evaporation.', 'Solar energy drives evaporation; gravity drives precipitation and runoff.', 2, 0),
    (v_tenant, v_ch, 'What is thermohaline circulation?', 'A global ocean current system driven by differences in water temperature and salinity, which redistributes heat around the planet.', 'Also called the ocean conveyor belt.', 3, 1),
    (v_tenant, v_ch, 'What is El Nino and how does it affect Saskatchewan?', 'El Nino is a warming of central Pacific Ocean surface waters that typically brings drier, warmer conditions and increased drought risk to Saskatchewan.', 'Warmer Pacific = drier prairies during El Nino.', 2, 2),
    (v_tenant, v_ch, 'Why are prairie potholes ecologically important?', 'They provide critical nesting habitat for 50–80% of North American ducks in good water years, making Saskatchewan''s prairies the continent''s primary waterfowl breeding ground.', 'Sometimes called the duck factory of North America.', 2, 3);


  -- ==============================
  -- UNIT 4: Motion & Forces
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Motion & Forces',
    'Investigate the description and measurement of motion and the forces that cause changes in motion, applying Newton''s laws to real-world situations.',
    'The motion of all objects can be described, measured, and predicted using the principles of kinematics and Newton''s laws of motion.',
    'How do scientists describe and predict the motion of objects, and what forces are responsible for changes in that motion?')
  RETURNING id INTO v_unit;

  -- Chapter 7: Motion & Kinematics
  v_ch_num := 7;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Motion & Kinematics', 'motion-kinematics',
    'Describe and calculate displacement, velocity, acceleration, and graphing of motion using position-time and velocity-time graphs.',
    '[
      {"type": "heading", "content": "Motion & Kinematics", "level": 1},
      {"type": "text", "content": "Motion is one of the most fundamental aspects of the physical world. A northern hawk owl launching from a spruce tree in Prince Albert National Park, a combine harvester rolling through a canola field near Weyburn, and a curling stone sliding across the ice in a Regina arena are all in motion. Kinematics is the branch of physics that describes motion without asking what causes it. To describe motion precisely, physicists use carefully defined quantities: position, displacement, velocity, and acceleration."},
      {"type": "heading", "content": "Position, Distance, and Displacement", "level": 2},
      {"type": "text", "content": "Position is the location of an object relative to a chosen reference point, called the origin. Distance is the total length of the path travelled by an object, regardless of direction. Displacement is the change in position from start to finish, including direction. Displacement is a vector quantity: it has both magnitude and direction. For example, if you drive 30 km east from Saskatoon and then 20 km west, your total distance travelled is 50 km, but your displacement is only 10 km east of your starting point."},
      {"type": "callout", "content": "Scalar quantities have magnitude only (e.g., distance, speed, time, mass). Vector quantities have both magnitude and direction (e.g., displacement, velocity, acceleration, force). In kinematics, paying attention to direction is critical.", "style": "info"},
      {"type": "heading", "content": "Speed and Velocity", "level": 2},
      {"type": "text", "content": "Speed is the rate at which an object covers distance, calculated as speed = distance / time. Average speed does not account for direction. Velocity is the rate of change of displacement: velocity = displacement / time. Because displacement is a vector, velocity is also a vector. An object moving at 100 km/h due north has a different velocity than one moving at 100 km/h due south, even though their speeds are identical."},
      {"type": "text", "content": "Saskatchewan''s Highway 1, the Trans-Canada, runs east-west across the province for hundreds of kilometres. A truck driving from Regina to Swift Current is travelling west at approximately 110 km/h. Its speed is 110 km/h, and its velocity is 110 km/h west. If the driver returns to Regina, covering the same distance in the same time, the average velocity for the whole round trip is zero (displacement = 0), even though the average speed is 110 km/h."},
      {"type": "callout", "content": "Average velocity = total displacement / total time. For a round trip back to the starting point, displacement is zero, so average velocity is zero, regardless of how fast the object was moving.", "style": "tip"},
      {"type": "heading", "content": "Acceleration", "level": 2},
      {"type": "text", "content": "Acceleration is the rate of change of velocity: acceleration = change in velocity / time. Like velocity, it is a vector. An object accelerates when it speeds up, slows down, or changes direction. A curling stone released by a player is decelerating (negative acceleration) as friction from the ice gradually reduces its speed. A car accelerating from a stop sign is experiencing positive acceleration. Even an object moving in a circle at constant speed is accelerating because its direction is continuously changing."},
      {"type": "heading", "content": "Graphing Motion", "level": 2},
      {"type": "text", "content": "Motion can be analysed using graphs. On a position-time (d-t) graph, the slope of the line equals the velocity. A horizontal line means the object is stationary; a straight diagonal line means constant velocity; a curved line means changing velocity (acceleration). On a velocity-time (v-t) graph, the slope of the line equals the acceleration. The area under the line equals the displacement. These graphical tools are powerful because they allow us to extract quantitative information about motion from a visual representation."},
      {"type": "list", "items": ["d-t graph: slope = velocity. Horizontal = stopped. Straight diagonal = constant velocity. Curve = acceleration.", "v-t graph: slope = acceleration. Area under the line = displacement. Horizontal = constant velocity."], "ordered": false},
      {"type": "callout", "content": "The knowledge of tracking animals, developed by Cree, Dene, and Metis hunters over generations, is deeply connected to understanding motion. A skilled tracker interprets the direction, spacing, depth, and pattern of tracks to determine an animal''s speed, whether it was walking or running, its direction of travel, and how long ago it passed. This is applied kinematics, reading the motion of animals from the physical evidence left on the land.", "style": "tip"},
      {"type": "quiz", "question": "A car travels 240 km in 3 hours. What is its average speed?", "options": ["720 km/h", "80 km/h", "60 km/h", "800 km/h"], "correct": 1, "explanation": "Average speed = distance / time = 240 km / 3 h = 80 km/h."},
      {"type": "quiz", "question": "What does the slope of a velocity-time graph represent?", "options": ["Speed", "Distance", "Displacement", "Acceleration"], "correct": 3, "explanation": "On a velocity-time graph, slope = change in velocity / change in time = acceleration. The area under the graph equals displacement."}
    ]'::jsonb,
    '[
      {"term": "Kinematics", "definition": "The branch of physics that describes the motion of objects without analysing the forces that cause the motion."},
      {"term": "Position", "definition": "The location of an object relative to a reference point."},
      {"term": "Displacement", "definition": "The change in position of an object, including both magnitude and direction; a vector quantity."},
      {"term": "Distance", "definition": "The total length of the path travelled by an object, regardless of direction; a scalar quantity."},
      {"term": "Speed", "definition": "The rate at which an object covers distance; a scalar quantity equal to distance divided by time."},
      {"term": "Velocity", "definition": "The rate of change of displacement; a vector quantity equal to displacement divided by time."},
      {"term": "Acceleration", "definition": "The rate of change of velocity; a vector quantity measured in m/s^2."},
      {"term": "Scalar", "definition": "A quantity that has magnitude only, such as distance, speed, or temperature."},
      {"term": "Vector", "definition": "A quantity that has both magnitude and direction, such as displacement, velocity, or force."}
    ]'::jsonb,
    'The knowledge of animal tracking developed by Cree, Dene, Nakoda, and Metis hunters over generations represents sophisticated applied kinematics. A skilled tracker reads the direction, spacing, depth, and pattern of tracks to determine an animal''s speed, gait, direction of travel, and how long ago it passed. This practical understanding of motion and its physical evidence on the landscape is a form of scientific reasoning honed over thousands of years of careful observation, and it remains a living practice among many Indigenous hunters and trappers in Saskatchewan today.',
    30, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the difference between distance and displacement?', 'Distance is the total path length (scalar); displacement is the net change in position including direction (vector).', 'A round trip has distance but zero displacement.', 2, 0),
    (v_tenant, v_ch, 'What is the difference between speed and velocity?', 'Speed is the rate of covering distance (scalar); velocity is the rate of change of displacement (vector, includes direction).', 'Velocity requires specifying a direction.', 2, 1),
    (v_tenant, v_ch, 'What does the slope of a d-t (position-time) graph represent?', 'Velocity. A steeper slope means higher speed; a horizontal line means the object is stationary.', 'Slope = rise/run = displacement/time = velocity.', 2, 2),
    (v_tenant, v_ch, 'What does the area under a v-t (velocity-time) graph represent?', 'Displacement. The area enclosed between the line and the time axis equals the total displacement during that time interval.', 'Area under v-t graph = displacement.', 3, 3);


  -- Chapter 8: Forces & Newton''s Laws
  v_ch_num := 8;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Forces & Newton''s Laws', 'forces-newtons-laws',
    'Investigate net force, types of friction, the force of gravity, and Newton''s three laws of motion with real-world Saskatchewan applications.',
    '[
      {"type": "heading", "content": "Forces & Newton''s Laws", "level": 1},
      {"type": "text", "content": "Kinematics describes how things move; dynamics explains why they move the way they do. The key concept in dynamics is force: a push or a pull that can change the state of motion of an object. Forces are vector quantities with both magnitude and direction. Isaac Newton, building on the work of Galileo, formulated three laws that describe the relationship between forces and motion. These laws, published in 1687, remain the foundation of classical mechanics and explain phenomena from a grain of wheat falling in a combine bin to a satellite orbiting Earth."},
      {"type": "heading", "content": "Newton''s First Law: Inertia", "level": 2},
      {"type": "text", "content": "Newton''s first law states that an object at rest remains at rest, and an object in motion continues in motion at constant velocity, unless acted upon by a net external force. This property of resisting changes in motion is called inertia. The more mass an object has, the greater its inertia. A heavily loaded grain truck on a Saskatchewan highway has enormous inertia and requires a much greater braking force to stop than an empty passenger car travelling at the same speed."},
      {"type": "callout", "content": "Newton''s First Law (Law of Inertia): An object will remain at rest or in uniform motion in a straight line unless acted upon by an unbalanced (net) external force.", "style": "info"},
      {"type": "heading", "content": "Net Force and Newton''s Second Law", "level": 2},
      {"type": "text", "content": "When more than one force acts on an object, the net force is the vector sum of all the forces. If the net force is zero, the object is in a state of equilibrium and there is no acceleration. Newton''s second law states that the net force on an object equals the object''s mass times its acceleration: F_net = m x a. This law allows us to predict exactly how an object will accelerate given its mass and the forces acting on it."},
      {"type": "text", "content": "For example, a 1,500 kg car experiencing a net forward force of 3,000 N will accelerate at 3,000 N / 1,500 kg = 2 m/s^2. If the driver applies the brakes and the net force becomes 6,000 N backward, the deceleration is 6,000 / 1,500 = 4 m/s^2. Understanding Newton''s second law is essential for designing safe vehicles and road systems."},
      {"type": "callout", "content": "Newton''s Second Law: F_net = m x a. Force is measured in newtons (N), where 1 N = 1 kg·m/s^2. A larger net force produces greater acceleration; a larger mass produces less acceleration for the same force.", "style": "tip"},
      {"type": "heading", "content": "Friction and Gravity", "level": 2},
      {"type": "text", "content": "Friction is a contact force that opposes the relative motion between two surfaces. Static friction prevents an object from starting to move; kinetic friction acts on an object already in motion. Friction depends on the types of surfaces in contact and the normal force pressing them together. In Saskatchewan, friction is a constant concern: icy roads in winter dramatically reduce friction between tires and road, increasing stopping distances and the risk of collisions. Sand and salt are applied to roads to increase friction."},
      {"type": "text", "content": "Gravity is the attractive force between any two objects with mass. On Earth''s surface, gravity pulls objects downward with an acceleration of approximately 9.8 m/s^2, called g. The gravitational force on an object (its weight) is calculated as F_g = m x g. Weight and mass are different: mass is the amount of matter in an object (measured in kg) and does not change with location; weight is the gravitational force on that mass (measured in N) and depends on local gravity."},
      {"type": "callout", "content": "Weight and mass are not the same. Mass is measured in kilograms and stays constant wherever you go. Weight is measured in newtons and changes with local gravitational acceleration. On the Moon, where g is about 1.6 m/s^2, you would weigh roughly one-sixth of your Earth weight, but your mass would be unchanged.", "style": "info"},
      {"type": "heading", "content": "Newton''s Third Law: Action-Reaction", "level": 2},
      {"type": "text", "content": "Newton''s third law states that for every action force, there is an equal and opposite reaction force. These forces always act on different objects. When a Saskatchewan farmer drives a tractor forward, the tires push backward on the ground (action); the ground pushes the tractor forward (reaction). When a snowmobiler''s machine accelerates through a northern trail, the drive track pushes backward on the snow and the snow pushes the snowmobile forward. Action-reaction pairs are always equal in magnitude and opposite in direction."},
      {"type": "list", "items": ["First Law: objects resist changes in motion (inertia). No net force = no acceleration.", "Second Law: F_net = m x a. Larger force or smaller mass = greater acceleration.", "Third Law: every action has an equal and opposite reaction on a different object."], "ordered": false},
      {"type": "callout", "content": "Cree and Metis hunters developed detailed practical knowledge of forces, motion, and materials through the design and use of tools such as the travois, the birchbark canoe, and the Red River cart. Each of these technologies reflects an applied understanding of friction, balance, load distribution, and the efficient transfer of force. The Red River cart, developed by Metis people in the 18th century, was a masterpiece of engineering that used no metal parts and was entirely repairable from local materials.", "style": "tip"},
      {"type": "quiz", "question": "A 2,000 kg truck accelerates at 3 m/s^2. What is the net force acting on it?", "options": ["667 N", "6,000 N", "2,003 N", "600 N"], "correct": 1, "explanation": "Using Newton''s second law: F_net = m x a = 2,000 kg x 3 m/s^2 = 6,000 N."},
      {"type": "quiz", "question": "Newton''s third law states that action-reaction forces are equal and opposite. On which objects do these paired forces act?", "options": ["On the same object in the same direction", "On the same object in opposite directions", "On two different objects", "Only on objects that are stationary"], "correct": 2, "explanation": "Action-reaction force pairs always act on two different objects. The action force acts on one object and the equal, opposite reaction force acts on the other object involved in the interaction."}
    ]'::jsonb,
    '[
      {"term": "Force", "definition": "A push or pull that can change the state of motion of an object; measured in newtons (N)."},
      {"term": "Inertia", "definition": "The tendency of an object to resist changes in its state of motion; proportional to the object''s mass."},
      {"term": "Net Force", "definition": "The vector sum of all forces acting on an object."},
      {"term": "Newton''s First Law", "definition": "An object remains at rest or in uniform motion unless acted on by a net external force."},
      {"term": "Newton''s Second Law", "definition": "The net force on an object equals its mass times its acceleration: F_net = m x a."},
      {"term": "Newton''s Third Law", "definition": "For every action force, there is an equal and opposite reaction force acting on a different object."},
      {"term": "Friction", "definition": "A contact force that opposes the relative motion between two surfaces."},
      {"term": "Weight", "definition": "The gravitational force on an object, calculated as F_g = m x g; measured in newtons."},
      {"term": "Mass", "definition": "The amount of matter in an object, measured in kilograms; constant regardless of location."},
      {"term": "Gravity", "definition": "The attractive force between objects with mass; on Earth''s surface, g = 9.8 m/s^2."}
    ]'::jsonb,
    'Cree and Metis peoples developed and refined a range of technologies that demonstrate sophisticated applied understanding of forces and motion. The birchbark canoe, optimized for low friction against water and portaging over land, the travois for distributing load during travel, and the all-wooden Red River cart developed by the Metis nation are all engineering achievements that reflect deep knowledge of friction, balance, materials, and force transfer. These technologies emerged from observation, experimentation, and generational refinement, parallel to but independent of the formal physics developed in Europe.',
    35, false)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'State Newton''s three laws of motion.', '1st: objects resist changes in motion (inertia). 2nd: F_net = m x a. 3rd: every action has an equal and opposite reaction on a different object.', 'Inertia, F=ma, action-reaction.', 2, 0),
    (v_tenant, v_ch, 'What is the difference between mass and weight?', 'Mass is the amount of matter in an object (kg), constant everywhere. Weight is the gravitational force on that mass (N), which varies with location.', 'On the Moon you weigh less but have the same mass.', 2, 1),
    (v_tenant, v_ch, 'A 500 kg object accelerates at 4 m/s^2. What is the net force?', 'F_net = m x a = 500 kg x 4 m/s^2 = 2,000 N.', 'Use Newton''s second law: F = ma.', 2, 2),
    (v_tenant, v_ch, 'What is friction and how does it affect driving on icy Saskatchewan roads?', 'Friction is a contact force opposing relative motion between surfaces. Ice greatly reduces friction between tires and road, increasing stopping distances and skid risk.', 'Less friction = longer stopping distance.', 2, 3),
    (v_tenant, v_ch, 'Give an example of Newton''s third law from everyday Saskatchewan life.', 'A tractor''s tires push backward on the ground (action); the ground pushes the tractor forward (reaction). Or: a snowmobile''s track pushes back on snow; snow pushes the snowmobile forward.', 'Action and reaction always act on different objects.', 2, 4);

END $$;
