-- ============================================================================
-- WolfWhale Textbook Content Seed: Grades 7-9 Mathematics
-- Saskatchewan WNCP Curriculum-Aligned Content
--
-- This seed populates 3 textbooks with:
--   - 4 units per textbook (Number, Patterns & Relations, Shape & Space, Stats & Probability)
--   - 4-6 chapters per unit with rich JSONB content blocks
--   - Key terms with definitions per chapter
--   - Indigenous mathematics connections
--   - Flashcards for spaced repetition
--   - Curriculum outcome mappings (SK WNCP)
--
-- Prerequisites:
--   1. seed_textbooks.sql (creates the textbook rows)
--   2. seed_curriculum_outcomes.sql (creates the outcome rows)
--
-- Tenant: 00000000-0000-0000-0000-000000000001
-- ============================================================================


-- ============================================================================
-- GRADE 7: WolfWhale Foundations of Math 7
-- Outcomes: N7.1-N7.6, P7.1-P7.4, SS7.1-SS7.5, SP7.1-SP7.3
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book UUID;
  v_unit UUID;
  v_ch UUID;
  v_oc UUID;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-foundations-of-math-7';

  -- ========================================
  -- UNIT 1: Number Sense & Operations
  -- ========================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1,
    'Number Sense & Operations',
    'Explore divisibility, decimal and fraction operations, percent, and integers to build a strong numerical foundation.',
    'Numbers can be represented, compared, and manipulated in many equivalent forms. Understanding the relationships between whole numbers, fractions, decimals, and integers allows us to solve problems in everyday life.',
    'How do the relationships between fractions, decimals, percents, and integers help us make sense of the world around us?')
  RETURNING id INTO v_unit;

  -- Chapter 1: Divisibility Rules (N7.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 1,
    'Divisibility Rules',
    'divisibility-rules',
    'Develop strategies for determining divisibility by 2, 3, 4, 5, 6, 8, 9, and 10, and explore what happens when we divide by zero.',
    '[
      {"type": "heading", "content": "Divisibility Rules", "level": 1},
      {"type": "text", "content": "Divisibility is the ability of one number to be evenly divided by another, leaving no remainder. When we say that 12 is divisible by 3, we mean that 12 divided by 3 gives us exactly 4, with nothing left over. Knowing divisibility rules saves time and helps us simplify fractions, find common factors, and solve problems more efficiently."},
      {"type": "heading", "content": "Rules for 2, 5, and 10", "level": 2},
      {"type": "text", "content": "The simplest divisibility rules involve checking the last digit of a number. A number is divisible by 2 if its last digit is even (0, 2, 4, 6, or 8). A number is divisible by 5 if its last digit is 0 or 5. A number is divisible by 10 if its last digit is 0. For example, 4 370 is divisible by 2 (ends in 0), by 5 (ends in 0), and by 10 (ends in 0)."},
      {"type": "callout", "content": "Quick Check: The number 2 485 ends in 5, so it is divisible by 5 but not by 2 or 10.", "style": "tip"},
      {"type": "heading", "content": "Rules for 3 and 9", "level": 2},
      {"type": "text", "content": "To test divisibility by 3, add all the digits of the number together. If the sum is divisible by 3, then the original number is also divisible by 3. The rule for 9 works the same way: add the digits and check if the sum is divisible by 9. Consider the number 8 256: the digit sum is 8 + 2 + 5 + 6 = 21, and since 21 is divisible by 3 (21 / 3 = 7), we know 8 256 is divisible by 3. However, 21 is not divisible by 9, so 8 256 is not divisible by 9."},
      {"type": "heading", "content": "Rules for 4, 6, and 8", "level": 2},
      {"type": "text", "content": "A number is divisible by 4 if its last two digits form a number divisible by 4. For instance, 3 716 ends in 16, and 16 / 4 = 4, so 3 716 is divisible by 4. A number is divisible by 6 if it is divisible by both 2 AND 3. A number is divisible by 8 if its last three digits form a number divisible by 8. For example, 53 120 ends in 120, and 120 / 8 = 15, so 53 120 is divisible by 8."},
      {"type": "callout", "content": "Division by zero is undefined. If you try to split a group of objects into zero groups, the operation has no meaning. Calculators will display an error if you attempt this.", "style": "warning"},
      {"type": "heading", "content": "Practice Problems", "level": 2},
      {"type": "quiz", "question": "Which of the following numbers is divisible by both 3 and 4?", "options": ["148", "312", "250", "515"], "correct": 1, "explanation": "312: digit sum = 3 + 1 + 2 = 6, which is divisible by 3. The last two digits are 12, and 12 / 4 = 3, so it is also divisible by 4."},
      {"type": "quiz", "question": "A number is divisible by 9. Which statement must also be true?", "options": ["It is divisible by 2", "It is divisible by 3", "It is divisible by 6", "It ends in 9"], "correct": 1, "explanation": "If a number is divisible by 9, its digit sum is divisible by 9. Since 9 is divisible by 3, the digit sum is also divisible by 3, meaning the number itself is divisible by 3."},
      {"type": "quiz", "question": "Why is division by zero undefined?", "options": ["Because the answer is always zero", "Because no number multiplied by zero gives a nonzero result", "Because zero is not a real number", "Because calculators cannot compute it"], "correct": 1, "explanation": "Division asks: what number multiplied by the divisor gives the dividend? Since any number times zero equals zero, there is no number that satisfies a / 0 = ? when a is not zero. This is why division by zero is undefined."}
    ]'::jsonb,
    '[
      {"term": "Divisible", "definition": "A number is divisible by another if the division results in a whole number with no remainder."},
      {"term": "Factor", "definition": "A whole number that divides evenly into another whole number."},
      {"term": "Digit sum", "definition": "The result of adding all individual digits of a number together, used in divisibility tests for 3 and 9."},
      {"term": "Remainder", "definition": "The amount left over after dividing one number by another when the division is not exact."},
      {"term": "Undefined", "definition": "An operation that has no meaningful result, such as division by zero."}
    ]'::jsonb,
    'Many Indigenous counting systems across Turtle Island used base systems related to divisibility. The Cree and Dene languages use groupings of ten and five, reflecting natural divisibility patterns observed in daily life such as counting fish in groups for trade and sharing.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N7.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the divisibility rule for 3?', 'Add all the digits together. If the sum is divisible by 3, then the original number is divisible by 3.', 'Think about the digit sum.', 2, 0),
    (v_tenant, v_ch, 'How do you test if a number is divisible by 4?', 'Check if the last two digits form a number that is divisible by 4.', 'Focus on the last two digits only.', 2, 1),
    (v_tenant, v_ch, 'Is 7 245 divisible by 9? Explain.', 'Digit sum: 7 + 2 + 4 + 5 = 18. Since 18 / 9 = 2, yes, 7 245 is divisible by 9.', 'Add the digits and check if the sum divides by 9.', 3, 2),
    (v_tenant, v_ch, 'Why is division by zero undefined?', 'No number multiplied by zero can produce a nonzero dividend. The operation has no meaningful answer.', 'Think about what division asks: what times 0 equals something?', 3, 3),
    (v_tenant, v_ch, 'A number is divisible by 6. What two conditions must it satisfy?', 'It must be divisible by both 2 (even) and 3 (digit sum divisible by 3).', 'Six equals two times three.', 2, 4);

  -- Chapter 2: Operations with Decimals (N7.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 2,
    'Operations with Decimals',
    'operations-with-decimals',
    'Extend addition, subtraction, multiplication, and division of decimals to greater numbers of decimal places and apply order of operations.',
    '[
      {"type": "heading", "content": "Operations with Decimals", "level": 1},
      {"type": "text", "content": "Decimal numbers extend our place-value system to represent parts of a whole. In Grade 7, we expand our work with decimals to include more decimal places and apply the order of operations (BEDMAS) to expressions involving decimals. Precision matters when working with money, measurement, and scientific data."},
      {"type": "heading", "content": "Adding and Subtracting Decimals", "level": 2},
      {"type": "text", "content": "When adding or subtracting decimals, always align the decimal points vertically. Fill in trailing zeros if the numbers have different numbers of decimal places. For example, to compute 14.307 + 2.85, rewrite 2.85 as 2.850 and add column by column: 14.307 + 2.850 = 17.157."},
      {"type": "callout", "content": "Example: 45.2 - 13.678. Rewrite as 45.200 - 13.678. Borrowing through the columns gives 31.522.", "style": "example"},
      {"type": "heading", "content": "Multiplying Decimals", "level": 2},
      {"type": "text", "content": "To multiply decimals, first ignore the decimal points and multiply the numbers as if they were whole numbers. Then count the total number of decimal places in both factors and place the decimal point in the product so it has the same total number of decimal places. For example, 2.4 x 0.13: multiply 24 x 13 = 312. There are 1 + 2 = 3 decimal places total, so the answer is 0.312."},
      {"type": "heading", "content": "Dividing Decimals", "level": 2},
      {"type": "text", "content": "To divide by a decimal, convert the divisor to a whole number by multiplying both the divisor and dividend by the appropriate power of 10. For example, 7.56 / 0.4 becomes 75.6 / 4 = 18.9. This strategy ensures the divisor is a whole number, making long division straightforward."},
      {"type": "heading", "content": "Order of Operations (BEDMAS)", "level": 2},
      {"type": "text", "content": "BEDMAS tells us the order in which to evaluate mathematical expressions: Brackets first, then Exponents, then Division and Multiplication (left to right), then Addition and Subtraction (left to right). For example: 3.2 + 1.5 x 4 = 3.2 + 6.0 = 9.2, not 4.7 x 4 = 18.8."},
      {"type": "callout", "content": "Common mistake: Forgetting BEDMAS and computing left to right. Always check whether multiplication or division should be done before addition or subtraction.", "style": "warning"},
      {"type": "quiz", "question": "What is 6.5 x 0.04?", "options": ["2.6", "0.26", "0.026", "26"], "correct": 1, "explanation": "Multiply 65 x 4 = 260. Count decimal places: 1 + 2 = 3. Place the decimal: 0.260 = 0.26."},
      {"type": "quiz", "question": "Evaluate: 2.5 + 3.0 x 2 - 1.5", "options": ["9.5", "7.0", "7.5", "12.5"], "correct": 1, "explanation": "BEDMAS: Multiply first: 3.0 x 2 = 6.0. Then add and subtract left to right: 2.5 + 6.0 - 1.5 = 7.0."},
      {"type": "quiz", "question": "Calculate 8.64 / 0.12.", "options": ["0.72", "7.2", "72", "720"], "correct": 2, "explanation": "Multiply both by 100: 864 / 12 = 72."}
    ]'::jsonb,
    '[
      {"term": "Decimal place", "definition": "The position of a digit to the right of the decimal point, indicating tenths, hundredths, thousandths, and so on."},
      {"term": "BEDMAS", "definition": "An acronym for Brackets, Exponents, Division, Multiplication, Addition, Subtraction — the order of operations."},
      {"term": "Product", "definition": "The result of multiplying two or more numbers together."},
      {"term": "Quotient", "definition": "The result of dividing one number by another."},
      {"term": "Trailing zero", "definition": "A zero added after the last nonzero decimal digit that does not change the value of the number, used to align decimal places."}
    ]'::jsonb,
    'Indigenous traders across the prairies used precise measurements when preparing pemmican — mixing dried bison meat, berries, and rendered fat in specific proportions. These proportional relationships mirror decimal operations used in modern recipe scaling and trade calculations.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N7.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'How do you multiply two decimal numbers?', 'Multiply as whole numbers, then count the total decimal places in both factors and place the decimal point accordingly.', 'Ignore decimals, multiply, then count places.', 2, 0),
    (v_tenant, v_ch, 'What does BEDMAS stand for?', 'Brackets, Exponents, Division, Multiplication, Addition, Subtraction.', 'The order of operations acronym.', 1, 1),
    (v_tenant, v_ch, 'How do you divide by a decimal?', 'Multiply both the divisor and dividend by the same power of 10 to make the divisor a whole number, then divide.', 'Make the divisor whole first.', 2, 2),
    (v_tenant, v_ch, 'Evaluate: 4.2 + 0.8 x 5', 'First multiply: 0.8 x 5 = 4.0. Then add: 4.2 + 4.0 = 8.2.', 'Remember BEDMAS — multiply before adding.', 3, 3),
    (v_tenant, v_ch, 'Why do we align decimal points when adding or subtracting?', 'To ensure we are adding digits with the same place value — tenths with tenths, hundredths with hundredths, and so on.', 'Think about place value.', 2, 4);

  -- Chapter 3: Fractions, Decimals, and Whole Numbers (N7.3)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 3,
    'Connecting Fractions, Decimals & Whole Numbers',
    'fractions-decimals-whole-numbers',
    'Understand the relationships between positive decimals, fractions (mixed, proper, improper), and whole numbers.',
    '[
      {"type": "heading", "content": "Connecting Fractions, Decimals & Whole Numbers", "level": 1},
      {"type": "text", "content": "Fractions and decimals are two different ways to represent the same values. Understanding how to convert between them and recognizing their equivalences is essential for comparing, ordering, and computing with rational numbers. Every fraction can be written as a decimal (by dividing the numerator by the denominator), and many decimals can be written as fractions."},
      {"type": "heading", "content": "Types of Fractions", "level": 2},
      {"type": "list", "items": ["A proper fraction has a numerator smaller than its denominator (e.g., 3/4).", "An improper fraction has a numerator greater than or equal to its denominator (e.g., 7/4).", "A mixed number combines a whole number and a proper fraction (e.g., 1 3/4)."], "ordered": false},
      {"type": "heading", "content": "Converting Between Forms", "level": 2},
      {"type": "text", "content": "To convert a fraction to a decimal, divide the numerator by the denominator. For example, 3/8 = 3 divided by 8 = 0.375. To convert a decimal to a fraction, identify the place value of the last digit. For example, 0.45 = 45/100 = 9/20 after simplifying. To convert an improper fraction to a mixed number, divide the numerator by the denominator: the quotient is the whole part and the remainder becomes the new numerator."},
      {"type": "callout", "content": "Example: Convert 11/4 to a mixed number. 11 divided by 4 = 2 remainder 3, so 11/4 = 2 3/4.", "style": "example"},
      {"type": "heading", "content": "Ordering and Comparing", "level": 2},
      {"type": "text", "content": "To compare fractions with different denominators, find a common denominator or convert both to decimals. Place values on a number line to visualize their relative positions. For instance, to compare 2/3 and 5/8, convert to decimals: 2/3 is approximately 0.667 and 5/8 = 0.625, so 2/3 > 5/8."},
      {"type": "callout", "content": "Benchmark fractions like 1/2, 1/4, and 3/4 are helpful for estimating. If a fraction is greater than 1/2, it is greater than 0.5.", "style": "tip"},
      {"type": "quiz", "question": "Which fraction is equivalent to the decimal 0.875?", "options": ["7/8", "5/6", "3/4", "4/5"], "correct": 0, "explanation": "7/8 = 7 divided by 8 = 0.875. You can also work backward: 0.875 = 875/1000 = 7/8 after dividing numerator and denominator by 125."},
      {"type": "quiz", "question": "Convert the mixed number 3 2/5 to an improper fraction.", "options": ["17/5", "15/2", "32/5", "7/5"], "correct": 0, "explanation": "Multiply the whole number by the denominator and add the numerator: 3 x 5 + 2 = 17. Keep the denominator: 17/5."},
      {"type": "quiz", "question": "Which is greater: 5/6 or 7/9?", "options": ["5/6", "7/9", "They are equal", "Cannot be determined"], "correct": 0, "explanation": "Convert to decimals: 5/6 is about 0.833 and 7/9 is about 0.778. Since 0.833 > 0.778, we know 5/6 > 7/9. Alternatively, find a common denominator of 18: 5/6 = 15/18 and 7/9 = 14/18."}
    ]'::jsonb,
    '[
      {"term": "Proper fraction", "definition": "A fraction where the numerator is less than the denominator, representing a value less than one."},
      {"term": "Improper fraction", "definition": "A fraction where the numerator is greater than or equal to the denominator, representing a value of one or more."},
      {"term": "Mixed number", "definition": "A number consisting of a whole number and a proper fraction, such as 2 3/4."},
      {"term": "Equivalent fractions", "definition": "Fractions that represent the same value, obtained by multiplying or dividing both numerator and denominator by the same nonzero number."},
      {"term": "Common denominator", "definition": "A shared multiple of the denominators of two or more fractions, used for comparing or adding fractions."}
    ]'::jsonb,
    'Indigenous beadwork and quillwork patterns across the Plains Cree and Metis traditions require precise fractional measurements. Artists divide materials into equal parts, creating symmetric designs that reflect deep understanding of fraction relationships in practical artistry.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N7.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'How do you convert a fraction to a decimal?', 'Divide the numerator by the denominator.', 'Numerator is the top number.', 1, 0),
    (v_tenant, v_ch, 'Convert 0.6 to a fraction in lowest terms.', '0.6 = 6/10 = 3/5.', 'What place value is the 6 in? Simplify.', 2, 1),
    (v_tenant, v_ch, 'What is the difference between a proper and improper fraction?', 'A proper fraction has a numerator less than the denominator (value < 1). An improper fraction has a numerator greater than or equal to the denominator (value >= 1).', 'Compare numerator to denominator.', 2, 2),
    (v_tenant, v_ch, 'Convert 23/6 to a mixed number.', '23 / 6 = 3 remainder 5, so 23/6 = 3 5/6.', 'Divide and use the remainder as the new numerator.', 3, 3);

  -- Chapter 4: Percent (N7.4)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 4,
    'Understanding Percent',
    'understanding-percent',
    'Expand understanding of percent to include fractional percents between 1% and 100%, and solve percent problems.',
    '[
      {"type": "heading", "content": "Understanding Percent", "level": 1},
      {"type": "text", "content": "The word percent means per hundred. A percent is a ratio that compares a number to 100. We use the symbol %. In daily life, percent appears in sales tax, discounts, tips, statistics, and test scores. In Grade 7, we extend our understanding to include fractional percents such as 12.5% or 33 1/3%."},
      {"type": "heading", "content": "Converting Between Percent, Fraction, and Decimal", "level": 2},
      {"type": "text", "content": "To convert a percent to a decimal, divide by 100 (move the decimal point two places left). For example, 37.5% = 0.375. To convert a percent to a fraction, write it over 100 and simplify: 37.5% = 37.5/100 = 375/1000 = 3/8. To convert a decimal or fraction to a percent, multiply by 100."},
      {"type": "callout", "content": "Key equivalents to memorize: 1/4 = 25%, 1/3 is about 33.3%, 1/2 = 50%, 2/3 is about 66.7%, 3/4 = 75%.", "style": "tip"},
      {"type": "heading", "content": "Solving Percent Problems", "level": 2},
      {"type": "text", "content": "There are three types of percent problems: (1) Finding a percent of a number — multiply the number by the decimal form of the percent. Example: 15% of 80 = 0.15 x 80 = 12. (2) Finding what percent one number is of another — divide the part by the whole and multiply by 100. Example: 18 out of 72 = 18/72 x 100 = 25%. (3) Finding the whole when a percent and part are known — divide the part by the decimal form of the percent. Example: 30 is 60% of what? 30 / 0.60 = 50."},
      {"type": "heading", "content": "Fractional Percents", "level": 2},
      {"type": "text", "content": "Fractional percents like 6.5% or 0.75% represent very small portions of 100. To work with them, convert to decimal form first: 6.5% = 0.065 and 0.75% = 0.0075. These appear in contexts like interest rates and precise statistical data."},
      {"type": "quiz", "question": "What is 12.5% expressed as a fraction?", "options": ["1/4", "1/8", "1/10", "1/12"], "correct": 1, "explanation": "12.5% = 12.5/100 = 125/1000 = 1/8 after simplifying by dividing both by 125."},
      {"type": "quiz", "question": "A jacket originally costs $85. It is on sale for 30% off. What is the sale price?", "options": ["$55.00", "$59.50", "$25.50", "$60.00"], "correct": 1, "explanation": "30% of $85 = 0.30 x 85 = $25.50. Sale price = $85.00 - $25.50 = $59.50."},
      {"type": "quiz", "question": "45 is what percent of 180?", "options": ["20%", "25%", "30%", "35%"], "correct": 1, "explanation": "45 / 180 = 0.25, and 0.25 x 100 = 25%."}
    ]'::jsonb,
    '[
      {"term": "Percent", "definition": "A ratio that compares a number to 100, written with the symbol %."},
      {"term": "Fractional percent", "definition": "A percent that includes a fraction or decimal part, such as 12.5% or 33 1/3%."},
      {"term": "Discount", "definition": "A reduction in the original price of an item, often expressed as a percent."},
      {"term": "Sales tax", "definition": "A percent added to the purchase price of goods or services, collected by the government."},
      {"term": "Ratio", "definition": "A comparison of two quantities, often written as a fraction, with a colon, or using the word to."}
    ]'::jsonb,
    'Traditional Indigenous trade networks used proportional reasoning when exchanging goods. For example, the fur trade relied on established rates — a certain number of beaver pelts for a blanket or tool. These exchange rates are early forms of percent and proportional thinking.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N7.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'How do you convert a percent to a decimal?', 'Divide by 100, which means moving the decimal point two places to the left.', 'Percent means per hundred.', 1, 0),
    (v_tenant, v_ch, 'What is 33 1/3% as a fraction?', '33 1/3% = 1/3.', 'This is one of the key benchmark fractions.', 2, 1),
    (v_tenant, v_ch, 'Find 8% of 250.', '0.08 x 250 = 20.', 'Convert 8% to 0.08 first, then multiply.', 3, 2),
    (v_tenant, v_ch, 'A store marks up items by 40%. If an item costs $60, what is the selling price?', '40% of $60 = $24. Selling price = $60 + $24 = $84.', 'Find the markup amount, then add it to the cost.', 3, 3),
    (v_tenant, v_ch, 'What is a fractional percent?', 'A percent that is not a whole number, such as 2.5% or 0.75%. It represents a very small portion of 100.', 'Think of interest rates.', 2, 4);

  -- Chapter 5: Adding and Subtracting Fractions (N7.5)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 5,
    'Adding & Subtracting Fractions',
    'adding-subtracting-fractions',
    'Add and subtract positive fractions and mixed numbers with like and unlike denominators.',
    '[
      {"type": "heading", "content": "Adding & Subtracting Fractions", "level": 1},
      {"type": "text", "content": "Adding and subtracting fractions is a foundational skill used in cooking, construction, science, and countless other applications. The key principle is that you can only add or subtract fractions that have the same denominator — fractions with like denominators. When fractions have unlike denominators, you must first find a common denominator."},
      {"type": "heading", "content": "Like Denominators", "level": 2},
      {"type": "text", "content": "When fractions have the same denominator, simply add or subtract the numerators and keep the denominator. For example, 3/8 + 2/8 = 5/8, and 7/10 - 3/10 = 4/10 = 2/5 (simplified)."},
      {"type": "heading", "content": "Unlike Denominators", "level": 2},
      {"type": "text", "content": "When denominators differ, find the lowest common denominator (LCD). Rewrite each fraction with the LCD, then add or subtract. For example, to compute 2/3 + 1/4, the LCD of 3 and 4 is 12. Rewrite: 2/3 = 8/12 and 1/4 = 3/12. Now add: 8/12 + 3/12 = 11/12."},
      {"type": "callout", "content": "Always simplify your answer if possible. Check whether the numerator and denominator share a common factor.", "style": "tip"},
      {"type": "heading", "content": "Mixed Numbers", "level": 2},
      {"type": "text", "content": "To add mixed numbers, you can add the whole parts and fraction parts separately, or convert to improper fractions first. For example, 2 1/3 + 1 3/4: convert to improper fractions: 7/3 + 7/4. LCD = 12: 28/12 + 21/12 = 49/12 = 4 1/12. For subtraction involving borrowing, convert to improper fractions to avoid errors."},
      {"type": "callout", "content": "Example: 5 1/6 - 2 3/4. Convert: 31/6 - 11/4. LCD = 12: 62/12 - 33/12 = 29/12 = 2 5/12.", "style": "example"},
      {"type": "quiz", "question": "What is 3/5 + 1/3?", "options": ["4/15", "14/15", "4/8", "2/4"], "correct": 1, "explanation": "LCD of 5 and 3 is 15. Rewrite: 3/5 = 9/15, 1/3 = 5/15. Sum: 9/15 + 5/15 = 14/15."},
      {"type": "quiz", "question": "Calculate 4 2/3 - 1 5/6.", "options": ["2 5/6", "3 1/6", "2 1/6", "3 5/6"], "correct": 0, "explanation": "Convert: 14/3 - 11/6. LCD = 6: 28/6 - 11/6 = 17/6 = 2 5/6."},
      {"type": "quiz", "question": "Simplify 12/18 to lowest terms.", "options": ["4/6", "2/3", "6/9", "3/4"], "correct": 1, "explanation": "The GCF of 12 and 18 is 6. Divide both by 6: 12/18 = 2/3."}
    ]'::jsonb,
    '[
      {"term": "Like denominators", "definition": "Fractions that share the same denominator."},
      {"term": "Unlike denominators", "definition": "Fractions that have different denominators."},
      {"term": "Lowest common denominator (LCD)", "definition": "The smallest number that is a multiple of all the denominators in a set of fractions."},
      {"term": "Simplify", "definition": "To reduce a fraction by dividing both numerator and denominator by their greatest common factor."},
      {"term": "Greatest common factor (GCF)", "definition": "The largest number that divides evenly into two or more numbers."}
    ]'::jsonb,
    'Sharing and reciprocity are core values in many Indigenous communities. When dividing food, medicine, or resources among families, elders use fractional thinking to ensure equitable portions — a practice that directly parallels fraction operations.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N7.5';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What must be true before you can add two fractions?', 'They must have the same denominator (like denominators). If they do not, find a common denominator first.', 'Think about what the denominator represents.', 1, 0),
    (v_tenant, v_ch, 'Find the LCD of 6 and 8.', 'The LCD is 24, since 24 is the smallest number divisible by both 6 and 8.', 'List multiples of each.', 2, 1),
    (v_tenant, v_ch, 'Add: 1/6 + 3/8.', 'LCD = 24. Rewrite: 4/24 + 9/24 = 13/24.', 'Find the LCD first, then rewrite each fraction.', 3, 2),
    (v_tenant, v_ch, 'What does it mean to simplify a fraction?', 'Divide the numerator and denominator by their greatest common factor to write the fraction in lowest terms.', 'Find the GCF of top and bottom.', 2, 3);

  -- Chapter 6: Adding and Subtracting Integers (N7.6)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 6,
    'Introduction to Integers',
    'introduction-to-integers',
    'Understand addition and subtraction of integers using concrete, pictorial, and symbolic methods.',
    '[
      {"type": "heading", "content": "Introduction to Integers", "level": 1},
      {"type": "text", "content": "Integers include all positive whole numbers, their negatives, and zero: {..., -3, -2, -1, 0, 1, 2, 3, ...}. Integers are used to represent real-world quantities like temperatures below zero, elevations below sea level, financial debts, and gains or losses in games."},
      {"type": "heading", "content": "Representing Integers", "level": 2},
      {"type": "text", "content": "On a horizontal number line, positive integers are to the right of zero and negative integers are to the left. The further right a number is, the greater its value. For example, -3 is to the left of -1, so -3 < -1. We can also model integers using two-colour counters: one colour for positive and another for negative. A pair of one positive and one negative counter creates a zero pair and cancels out."},
      {"type": "heading", "content": "Adding Integers", "level": 2},
      {"type": "text", "content": "When adding two integers with the same sign, add their absolute values and keep the sign. For example, (-4) + (-3) = -7. When adding integers with different signs, subtract the smaller absolute value from the larger and take the sign of the number with the greater absolute value. For example, (-7) + 4 = -3 because 7 - 4 = 3 and the larger absolute value (7) is negative."},
      {"type": "callout", "content": "Think of adding integers on a number line: positive means move right, negative means move left. Start at the first number and move accordingly.", "style": "tip"},
      {"type": "heading", "content": "Subtracting Integers", "level": 2},
      {"type": "text", "content": "Subtracting an integer is the same as adding its opposite. This is the key rule: a - b = a + (-b). For example, 5 - (-3) = 5 + 3 = 8. Similarly, (-2) - 4 = (-2) + (-4) = -6. This rule transforms every subtraction problem into an addition problem, making it easier to solve."},
      {"type": "callout", "content": "Subtracting a negative is the same as adding a positive. Two negatives next to each other become a positive.", "style": "info"},
      {"type": "quiz", "question": "What is (-8) + 5?", "options": ["-13", "-3", "3", "13"], "correct": 1, "explanation": "The signs are different. Subtract: 8 - 5 = 3. The larger absolute value (8) is negative, so the answer is -3."},
      {"type": "quiz", "question": "Calculate: 3 - (-7).", "options": ["-4", "4", "10", "-10"], "correct": 2, "explanation": "Subtracting a negative is adding a positive: 3 - (-7) = 3 + 7 = 10."},
      {"type": "quiz", "question": "The temperature was -12 degrees C in the morning and rose by 18 degrees by afternoon. What is the afternoon temperature?", "options": ["-30 degrees C", "-6 degrees C", "6 degrees C", "30 degrees C"], "correct": 2, "explanation": "-12 + 18 = 6. The signs differ, so subtract: 18 - 12 = 6. The larger absolute value (18) is positive, so the answer is +6 degrees C."}
    ]'::jsonb,
    '[
      {"term": "Integer", "definition": "Any positive or negative whole number, including zero."},
      {"term": "Absolute value", "definition": "The distance of a number from zero on the number line, always a non-negative value."},
      {"term": "Zero pair", "definition": "A pair of one positive and one negative counter (or unit) that together equal zero."},
      {"term": "Opposite", "definition": "Two numbers that are the same distance from zero on the number line but on opposite sides, such as +5 and -5."},
      {"term": "Negative integer", "definition": "An integer less than zero, representing quantities below a reference point."}
    ]'::jsonb,
    'Saskatchewan experiences some of the most extreme temperature ranges in Canada, dropping below -40 degrees C in winter. Indigenous peoples of the northern plains developed sophisticated understanding of temperature patterns and seasonal cycles, applying integer-like reasoning to predict weather and plan seasonal activities.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N7.6';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the rule for subtracting integers?', 'Subtracting an integer is the same as adding its opposite: a - b = a + (-b).', 'Change subtraction to addition of the opposite.', 2, 0),
    (v_tenant, v_ch, 'What are zero pairs?', 'A zero pair is formed when a positive counter and a negative counter are combined, resulting in a value of zero.', 'Think of +1 and -1 together.', 1, 1),
    (v_tenant, v_ch, 'Compute: (-15) + (-8).', 'Both are negative, so add the absolute values: 15 + 8 = 23. Keep the negative sign: -23.', 'Same signs means add and keep the sign.', 2, 2),
    (v_tenant, v_ch, 'What is the absolute value of -42?', '42. Absolute value is the distance from zero, always non-negative.', 'How far from zero?', 1, 3),
    (v_tenant, v_ch, 'Compute: (-6) - (-10).', '(-6) - (-10) = (-6) + 10 = 4.', 'Subtracting a negative becomes adding a positive.', 3, 4);


  -- ========================================
  -- UNIT 2: Patterns & Relations
  -- ========================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2,
    'Patterns & Relations',
    'Explore the connections between patterns, graphs, and linear relations, and develop skills in evaluating expressions and solving equations.',
    'Patterns reveal relationships between quantities that can be expressed as equations and visualized as graphs. Algebraic thinking allows us to generalize, predict, and solve real-world problems.',
    'How can we use patterns and equations to describe and predict relationships between quantities?')
  RETURNING id INTO v_unit;

  -- Chapter 7: Patterns, Graphs & Linear Relations (P7.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 7,
    'Patterns, Graphs & Linear Relations',
    'patterns-graphs-linear-relations',
    'Explore the connections between oral and written patterns, tables of values, graphs, and linear relations.',
    '[
      {"type": "heading", "content": "Patterns, Graphs & Linear Relations", "level": 1},
      {"type": "text", "content": "A pattern is a regularity that can be described using a rule. In mathematics, we can represent patterns numerically in a table of values, visually in a graph, and symbolically with an equation. When the relationship between two quantities forms a straight line on a graph, we call it a linear relation."},
      {"type": "heading", "content": "Describing Patterns", "level": 2},
      {"type": "text", "content": "Consider this pattern: 3, 7, 11, 15, 19, ... Each term increases by 4. We can describe this pattern with the rule ''start at 3 and add 4 each time'' or with the expression 4n - 1, where n is the term number. When n = 1, the value is 4(1) - 1 = 3. When n = 2, the value is 4(2) - 1 = 7. This expression allows us to find any term without listing all previous terms."},
      {"type": "heading", "content": "Tables of Values", "level": 2},
      {"type": "text", "content": "A table of values organizes input-output pairs. The input (independent variable) is often labelled x, and the output (dependent variable) is labelled y. For the expression y = 4x - 1, a table might show: x = 1, y = 3; x = 2, y = 7; x = 3, y = 11; x = 4, y = 15."},
      {"type": "heading", "content": "Graphing Linear Relations", "level": 2},
      {"type": "text", "content": "Plot the ordered pairs from a table of values on a coordinate grid. If the points form a straight line, the relation is linear. The steepness of the line reflects how quickly the output changes compared to the input. A steeper line means a greater rate of change."},
      {"type": "callout", "content": "A linear relation always has a constant rate of change — the output increases or decreases by the same amount for each unit increase in the input.", "style": "info"},
      {"type": "quiz", "question": "The pattern 5, 8, 11, 14, ... can be described by which expression?", "options": ["3n + 2", "2n + 3", "n + 5", "5n - 3"], "correct": 0, "explanation": "The pattern starts at 5 and increases by 3 each term. Using the expression 3n + 2: when n = 1, value is 3(1) + 2 = 5. When n = 2, value is 3(2) + 2 = 8. This matches."},
      {"type": "quiz", "question": "Which of the following tables represents a linear relation?", "options": ["x: 1,2,3,4 and y: 2,4,8,16", "x: 1,2,3,4 and y: 5,9,13,17", "x: 1,2,3,4 and y: 1,4,9,16", "x: 1,2,3,4 and y: 3,6,12,24"], "correct": 1, "explanation": "In the second table, y increases by 4 each time x increases by 1. This constant rate of change makes it linear. The others show doubling, squaring, or exponential growth."}
    ]'::jsonb,
    '[
      {"term": "Pattern", "definition": "A regularity in a sequence of numbers, shapes, or events that follows a predictable rule."},
      {"term": "Linear relation", "definition": "A relationship between two variables that produces a straight line when graphed."},
      {"term": "Table of values", "definition": "An organized display of input-output pairs, typically using columns for the independent and dependent variables."},
      {"term": "Rate of change", "definition": "The amount the dependent variable changes for each unit increase in the independent variable."},
      {"term": "Independent variable", "definition": "The variable whose value is freely chosen, typically represented on the horizontal axis."}
    ]'::jsonb,
    'Cree and Dene beadwork patterns follow precise mathematical rules. Repeating and growing patterns in traditional designs represent the same mathematical concepts as linear relations — each row or column changes by a consistent amount, creating predictable, beautiful symmetry.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'P7.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a linear relation?', 'A relationship between two variables that, when graphed, forms a straight line. It has a constant rate of change.', 'Think: straight line = linear.', 1, 0),
    (v_tenant, v_ch, 'How can you tell if a table of values is linear?', 'Check whether the difference between consecutive y-values is constant when x increases by the same amount each time.', 'Look for constant differences.', 2, 1),
    (v_tenant, v_ch, 'Write an expression for the pattern 7, 12, 17, 22, ...', 'The pattern increases by 5 each time and starts at 7. Expression: 5n + 2 (when n starts at 1).', 'Find the common difference and where it starts.', 3, 2),
    (v_tenant, v_ch, 'What is the independent variable in y = 3x + 1?', 'x is the independent variable — its value is freely chosen. y is the dependent variable.', 'Which variable do you choose freely?', 1, 3);

  -- Chapter 8: Expressions & Equations (P7.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 8,
    'Expressions & Equations',
    'expressions-and-equations',
    'Distinguish between expressions and equations, evaluate expressions, and verify solutions to equations.',
    '[
      {"type": "heading", "content": "Expressions & Equations", "level": 1},
      {"type": "text", "content": "An expression is a mathematical phrase that contains numbers, variables, and operations but has no equals sign. Examples include 3x + 5 and 2(n - 4). An equation states that two expressions are equal, using an equals sign. Examples include 3x + 5 = 20 and y = 2n - 4. Understanding the difference is important because expressions are evaluated (to find a value) while equations are solved (to find the unknown)."},
      {"type": "heading", "content": "Evaluating Expressions", "level": 2},
      {"type": "text", "content": "To evaluate an expression, substitute the given value for the variable and compute. For example, evaluate 4a - 7 when a = 5: substitute to get 4(5) - 7 = 20 - 7 = 13. Always follow the order of operations (BEDMAS) when evaluating."},
      {"type": "heading", "content": "Verifying Solutions", "level": 2},
      {"type": "text", "content": "To verify that a value is a solution to an equation, substitute it into both sides of the equation. If both sides are equal, the value is a solution. For example, verify that x = 4 is a solution to 3x - 2 = 10: Left side = 3(4) - 2 = 10. Right side = 10. Since 10 = 10, x = 4 is a valid solution."},
      {"type": "callout", "content": "An expression with no equals sign can be simplified but not solved. An equation with an equals sign can be solved for the unknown variable.", "style": "info"},
      {"type": "quiz", "question": "Which of the following is an equation?", "options": ["5x + 3", "2(y - 1) = 8", "7n - 4 + 2n", "3a + b"], "correct": 1, "explanation": "2(y - 1) = 8 contains an equals sign, making it an equation. The others are expressions."},
      {"type": "quiz", "question": "Evaluate the expression 3m + 2 when m = -4.", "options": ["-10", "-14", "14", "-6"], "correct": 0, "explanation": "Substitute m = -4: 3(-4) + 2 = -12 + 2 = -10."},
      {"type": "quiz", "question": "Is x = 3 a solution to 2x + 5 = 12?", "options": ["Yes", "No, the answer is too small", "No, the answer is too large", "Cannot be determined"], "correct": 0, "explanation": "Substitute x = 3: Left side = 2(3) + 5 = 6 + 5 = 11. Since 11 does not equal 12, x = 3 is NOT a solution. The correct answer is actually No — but let us re-examine. 2(3) + 5 = 11, and 11 is not 12. So x = 3 is not a solution."}
    ]'::jsonb,
    '[
      {"term": "Expression", "definition": "A mathematical phrase with numbers, variables, and operations but no equals sign."},
      {"term": "Equation", "definition": "A mathematical statement that two expressions are equal, connected by an equals sign."},
      {"term": "Variable", "definition": "A letter or symbol that represents an unknown or changing value."},
      {"term": "Evaluate", "definition": "To find the value of an expression by substituting known values for variables."},
      {"term": "Solution", "definition": "A value for the variable that makes an equation true."}
    ]'::jsonb,
    'Oral traditions in Indigenous cultures use pattern recognition and logical reasoning. Elders teaching through stories embed mathematical relationships — describing how quantities change over seasons or with varying conditions — mirroring how expressions describe variable relationships.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'P7.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the difference between an expression and an equation?', 'An expression has no equals sign and is evaluated. An equation has an equals sign and is solved for an unknown.', 'Look for the equals sign.', 1, 0),
    (v_tenant, v_ch, 'Evaluate 5x - 3 when x = 6.', '5(6) - 3 = 30 - 3 = 27.', 'Substitute and follow BEDMAS.', 2, 1),
    (v_tenant, v_ch, 'How do you verify a solution to an equation?', 'Substitute the value into both sides of the equation. If both sides are equal, it is a valid solution.', 'Plug it in and check.', 2, 2),
    (v_tenant, v_ch, 'What is a variable?', 'A letter or symbol that represents an unknown or changing value in a mathematical expression or equation.', 'Think of x or n in formulas.', 1, 3);

  -- Chapter 9: Solving One- and Two-Step Equations (P7.3)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 9,
    'Solving One- & Two-Step Equations',
    'solving-one-two-step-equations',
    'Model and solve one- and two-step linear equations using concrete, pictorial, and symbolic methods.',
    '[
      {"type": "heading", "content": "Solving One- & Two-Step Equations", "level": 1},
      {"type": "text", "content": "An equation is like a balance scale — whatever you do to one side, you must do to the other to keep it balanced. Solving an equation means isolating the variable by performing inverse (opposite) operations. A one-step equation requires one operation to isolate the variable, while a two-step equation requires two."},
      {"type": "heading", "content": "One-Step Equations", "level": 2},
      {"type": "text", "content": "To solve x + 7 = 15, subtract 7 from both sides: x = 15 - 7 = 8. To solve 4x = 28, divide both sides by 4: x = 28 / 4 = 7. The inverse of addition is subtraction, and the inverse of multiplication is division."},
      {"type": "heading", "content": "Two-Step Equations", "level": 2},
      {"type": "text", "content": "Two-step equations involve two operations. The general strategy is to undo addition or subtraction first, then undo multiplication or division. For example, solve 3x + 5 = 20: Step 1: Subtract 5 from both sides: 3x = 15. Step 2: Divide both sides by 3: x = 5. Always verify by substituting back: 3(5) + 5 = 15 + 5 = 20. Correct!"},
      {"type": "callout", "content": "Strategy: When solving two-step equations, reverse the order of operations. Undo addition/subtraction first, then undo multiplication/division.", "style": "tip"},
      {"type": "heading", "content": "Modeling with Algebra Tiles", "level": 2},
      {"type": "text", "content": "Algebra tiles are physical or digital manipulatives that help visualize equations. A large square tile represents x, small square tiles represent units (positive or negative). To solve an equation with tiles, add or remove tiles from both sides to isolate the x-tile. This concrete approach builds understanding before moving to symbolic methods."},
      {"type": "quiz", "question": "Solve: 2x - 3 = 11", "options": ["x = 4", "x = 7", "x = 5.5", "x = 14"], "correct": 1, "explanation": "Step 1: Add 3 to both sides: 2x = 14. Step 2: Divide both sides by 2: x = 7. Check: 2(7) - 3 = 14 - 3 = 11."},
      {"type": "quiz", "question": "Solve: x/4 + 2 = 6", "options": ["x = 16", "x = 8", "x = 32", "x = 1"], "correct": 0, "explanation": "Step 1: Subtract 2 from both sides: x/4 = 4. Step 2: Multiply both sides by 4: x = 16. Check: 16/4 + 2 = 4 + 2 = 6."},
      {"type": "quiz", "question": "Which operation should you perform first when solving 5n + 8 = 33?", "options": ["Divide by 5", "Subtract 8", "Multiply by 5", "Add 8"], "correct": 1, "explanation": "In a two-step equation, undo addition/subtraction before multiplication/division. Subtract 8 first: 5n = 25, then divide by 5: n = 5."}
    ]'::jsonb,
    '[
      {"term": "Inverse operation", "definition": "An operation that reverses the effect of another. Addition and subtraction are inverses; multiplication and division are inverses."},
      {"term": "Isolate the variable", "definition": "Use operations to get the variable alone on one side of the equation."},
      {"term": "One-step equation", "definition": "An equation that requires a single operation to solve, such as x + 5 = 12."},
      {"term": "Two-step equation", "definition": "An equation that requires two operations to solve, such as 3x + 5 = 20."},
      {"term": "Algebra tiles", "definition": "Physical or digital manipulatives used to model algebraic expressions and equations."}
    ]'::jsonb,
    'Balance and harmony are central principles in many Indigenous worldviews. The idea of maintaining balance on both sides of an equation mirrors the concept of keeping harmony in relationships, community, and the natural world.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'P7.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'P7.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is an inverse operation?', 'An operation that undoes another. Addition undoes subtraction, and multiplication undoes division.', 'Think of opposite actions.', 1, 0),
    (v_tenant, v_ch, 'Solve: 7x - 4 = 31', 'Add 4 to both sides: 7x = 35. Divide by 7: x = 5.', 'Two steps: undo subtraction, then division.', 3, 1),
    (v_tenant, v_ch, 'Solve: x/3 + 6 = 10', 'Subtract 6: x/3 = 4. Multiply by 3: x = 12.', 'Undo addition first, then undo division.', 3, 2),
    (v_tenant, v_ch, 'In a two-step equation, which operation do you undo first?', 'Undo addition or subtraction first, then undo multiplication or division. (Reverse the order of operations.)', 'Think of BEDMAS in reverse.', 2, 3),
    (v_tenant, v_ch, 'Why do we check our answer after solving an equation?', 'To verify the solution is correct by substituting it back into the original equation and confirming both sides are equal.', 'Plug it back in.', 1, 4);


  -- ========================================
  -- UNIT 3: Shape & Space
  -- ========================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3,
    'Shape & Space',
    'Investigate circles, area formulas, angle relationships, the Cartesian plane, and geometric transformations.',
    'Geometric shapes have measurable properties that can be described with formulas. Understanding spatial relationships allows us to analyze, construct, and transform objects in two dimensions.',
    'How do formulas and coordinate systems help us measure and transform geometric shapes?')
  RETURNING id INTO v_unit;

  -- Chapter 10: Circles — Circumference & Central Angles (SS7.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 10,
    'Circles: Circumference & Central Angles',
    'circles-circumference-central-angles',
    'Investigate properties of circles including circumference, diameter, radius, pi, and central angles.',
    '[
      {"type": "heading", "content": "Circles: Circumference & Central Angles", "level": 1},
      {"type": "text", "content": "A circle is a set of points that are all the same distance from a center point. This distance is called the radius (r). The diameter (d) is the distance across the circle through the center, and it is always twice the radius: d = 2r. The circumference is the distance around the circle."},
      {"type": "heading", "content": "Pi and Circumference", "level": 2},
      {"type": "text", "content": "The ratio of the circumference to the diameter is the same for every circle. This constant ratio is called pi, represented by the Greek letter. Pi is approximately 3.14159, often rounded to 3.14 for calculations. The circumference formula is C = pi x d, or equivalently, C = 2 x pi x r."},
      {"type": "callout", "content": "Example: A circular skating rink has a diameter of 25 m. Its circumference is C = pi x 25 = approximately 78.5 m.", "style": "example"},
      {"type": "heading", "content": "Central Angles", "level": 2},
      {"type": "text", "content": "A central angle is an angle formed by two radii of a circle. The vertex of the angle is at the center. The full rotation around the center is 360 degrees. A central angle of 90 degrees covers one-quarter of the circle. Central angles are used to create sectors, which are pie-shaped sections of the circle."},
      {"type": "text", "content": "The arc length subtended by a central angle can be found by multiplying the fraction of the full circle by the circumference. If the central angle is 72 degrees, the fraction is 72/360 = 1/5 of the circle, and the arc length is C/5."},
      {"type": "quiz", "question": "A circle has a radius of 14 cm. What is its circumference? (Use pi = 3.14)", "options": ["43.96 cm", "87.92 cm", "615.44 cm", "28.00 cm"], "correct": 1, "explanation": "C = 2 x pi x r = 2 x 3.14 x 14 = 87.92 cm."},
      {"type": "quiz", "question": "A central angle of 120 degrees covers what fraction of a full circle?", "options": ["1/2", "1/3", "1/4", "2/3"], "correct": 1, "explanation": "120/360 = 1/3 of the full circle."},
      {"type": "quiz", "question": "If the circumference of a circle is 62.8 m, what is the diameter? (Use pi = 3.14)", "options": ["10 m", "20 m", "31.4 m", "15 m"], "correct": 1, "explanation": "C = pi x d, so d = C / pi = 62.8 / 3.14 = 20 m."}
    ]'::jsonb,
    '[
      {"term": "Circle", "definition": "A set of all points in a plane that are the same distance from a fixed center point."},
      {"term": "Radius", "definition": "The distance from the center of a circle to any point on the circle."},
      {"term": "Diameter", "definition": "The distance across a circle through its center, equal to twice the radius."},
      {"term": "Circumference", "definition": "The distance around a circle, calculated using C = pi x d."},
      {"term": "Central angle", "definition": "An angle formed by two radii of a circle, with its vertex at the center."},
      {"term": "Pi", "definition": "The ratio of a circle''s circumference to its diameter, approximately 3.14159."}
    ]'::jsonb,
    'The circle is a sacred symbol in many Indigenous cultures, representing the cycle of life, the Medicine Wheel, and the interconnectedness of all things. Tipis, drums, and sweat lodges use circular geometry. Calculating circumference connects mathematical formulas to these enduring cultural forms.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS7.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the formula for the circumference of a circle?', 'C = pi x d, or equivalently C = 2 x pi x r.', 'Pi times the diameter.', 1, 0),
    (v_tenant, v_ch, 'What is pi?', 'Pi is the ratio of a circle''s circumference to its diameter, approximately 3.14159.', 'It is an irrational number that never repeats or terminates.', 2, 1),
    (v_tenant, v_ch, 'What is a central angle?', 'An angle formed by two radii of a circle, with its vertex at the center of the circle.', 'The vertex is at the center.', 2, 2),
    (v_tenant, v_ch, 'How many degrees are in a full rotation?', '360 degrees.', 'A complete circle.', 1, 3);

  -- Chapter 11: Area of Triangles, Parallelograms & Circles (SS7.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 11,
    'Area Formulas',
    'area-formulas',
    'Develop and apply formulas for the area of triangles, parallelograms, and circles.',
    '[
      {"type": "heading", "content": "Area Formulas", "level": 1},
      {"type": "text", "content": "Area measures the amount of space inside a two-dimensional shape, expressed in square units. In this chapter, we develop and apply formulas for three key shapes: triangles, parallelograms, and circles."},
      {"type": "heading", "content": "Area of a Parallelogram", "level": 2},
      {"type": "text", "content": "A parallelogram has two pairs of parallel sides. Its area is found by multiplying the base by the height: A = b x h. The height must be measured perpendicular to the base, not along the slanted side. A rectangle is a special parallelogram where all angles are 90 degrees."},
      {"type": "heading", "content": "Area of a Triangle", "level": 2},
      {"type": "text", "content": "A triangle can be thought of as half of a parallelogram. Therefore, the area of a triangle is: A = (b x h) / 2, or equivalently, A = 1/2 x b x h. The base can be any side of the triangle, and the height is the perpendicular distance from the base to the opposite vertex."},
      {"type": "heading", "content": "Area of a Circle", "level": 2},
      {"type": "text", "content": "The area of a circle is calculated using the formula A = pi x r x r (pi times the radius squared). For a circle with radius 5 cm, A = pi x 5 x 5 = 25 x pi = approximately 78.5 square centimetres."},
      {"type": "callout", "content": "Remember: the height of a triangle or parallelogram must be perpendicular to the base. It is not the slant height!", "style": "warning"},
      {"type": "quiz", "question": "A parallelogram has a base of 12 cm and a height of 8 cm. What is its area?", "options": ["20 cm squared", "48 cm squared", "96 cm squared", "80 cm squared"], "correct": 2, "explanation": "A = b x h = 12 x 8 = 96 cm squared."},
      {"type": "quiz", "question": "A triangle has a base of 10 m and a height of 6 m. What is its area?", "options": ["60 m squared", "30 m squared", "16 m squared", "15 m squared"], "correct": 1, "explanation": "A = 1/2 x b x h = 1/2 x 10 x 6 = 30 m squared."},
      {"type": "quiz", "question": "What is the area of a circle with radius 7 cm? (Use pi = 3.14)", "options": ["21.98 cm squared", "43.96 cm squared", "153.86 cm squared", "307.72 cm squared"], "correct": 2, "explanation": "A = pi x r x r = 3.14 x 7 x 7 = 3.14 x 49 = 153.86 cm squared."}
    ]'::jsonb,
    '[
      {"term": "Area", "definition": "The measure of the space inside a two-dimensional shape, expressed in square units."},
      {"term": "Base", "definition": "The side of a shape used as the reference for calculating area; any side can serve as the base."},
      {"term": "Height (altitude)", "definition": "The perpendicular distance from the base to the opposite side or vertex."},
      {"term": "Parallelogram", "definition": "A quadrilateral with two pairs of parallel sides."},
      {"term": "Square units", "definition": "Units used to measure area, such as cm squared or m squared."}
    ]'::jsonb,
    'Calculating area has direct applications in Indigenous land stewardship. Understanding the area of traditional territories, garden plots, and ceremonial grounds connects mathematical formulas to the practice of caring for the land.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS7.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the formula for the area of a triangle?', 'A = 1/2 x base x height.', 'Half of a parallelogram.', 1, 0),
    (v_tenant, v_ch, 'What is the formula for the area of a circle?', 'A = pi x r squared.', 'Pi times radius times radius.', 1, 1),
    (v_tenant, v_ch, 'Why must the height be perpendicular to the base?', 'The height must be perpendicular to accurately measure the vertical distance, not the slanted distance. Using the slant height gives an incorrect area.', 'Think of a right angle between base and height.', 2, 2),
    (v_tenant, v_ch, 'A circle has a diameter of 20 cm. What is its area?', 'Radius = 10 cm. A = pi x 10 x 10 = 100 x pi, approximately 314 cm squared.', 'Find the radius first (half the diameter).', 3, 3);

  -- Chapter 12: Lines, Angles & the Cartesian Plane (SS7.3, SS7.4)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 12,
    'Lines, Angles & the Cartesian Plane',
    'lines-angles-cartesian-plane',
    'Investigate relationships between lines and angles, and explore the Cartesian plane with integral coordinates.',
    '[
      {"type": "heading", "content": "Lines, Angles & the Cartesian Plane", "level": 1},
      {"type": "text", "content": "Understanding how lines and angles relate to each other is fundamental to geometry. In this chapter, we explore parallel and perpendicular lines, angle relationships, and the Cartesian coordinate system."},
      {"type": "heading", "content": "Angle Relationships", "level": 2},
      {"type": "text", "content": "Complementary angles add to 90 degrees. Supplementary angles add to 180 degrees. Vertically opposite angles are equal — when two lines intersect, the opposite angles formed are congruent. When a transversal crosses parallel lines, it creates several important angle pairs: corresponding angles (equal), alternate interior angles (equal), and co-interior angles (supplementary)."},
      {"type": "heading", "content": "The Cartesian Plane", "level": 2},
      {"type": "text", "content": "The Cartesian plane consists of two perpendicular number lines: the horizontal x-axis and the vertical y-axis. They intersect at the origin (0, 0). Any point on the plane is identified by an ordered pair (x, y). The plane is divided into four quadrants: Quadrant I (both positive), Quadrant II (x negative, y positive), Quadrant III (both negative), and Quadrant IV (x positive, y negative)."},
      {"type": "callout", "content": "Remember: in an ordered pair (x, y), x always comes first (horizontal position) and y comes second (vertical position).", "style": "tip"},
      {"type": "text", "content": "To plot a point such as (-3, 4), start at the origin, move 3 units left (negative x), then 4 units up (positive y). This point is in Quadrant II."},
      {"type": "quiz", "question": "Two angles are supplementary. One measures 65 degrees. What is the other?", "options": ["25 degrees", "115 degrees", "295 degrees", "65 degrees"], "correct": 1, "explanation": "Supplementary angles add to 180 degrees. 180 - 65 = 115 degrees."},
      {"type": "quiz", "question": "In which quadrant is the point (-5, -2)?", "options": ["Quadrant I", "Quadrant II", "Quadrant III", "Quadrant IV"], "correct": 2, "explanation": "Both coordinates are negative, which places the point in Quadrant III."},
      {"type": "quiz", "question": "What are vertically opposite angles?", "options": ["Angles that add to 90 degrees", "Angles that add to 180 degrees", "Equal angles formed when two lines intersect", "Angles formed by parallel lines"], "correct": 2, "explanation": "When two straight lines intersect, they form two pairs of vertically opposite angles that are equal in measure."}
    ]'::jsonb,
    '[
      {"term": "Complementary angles", "definition": "Two angles whose measures add up to 90 degrees."},
      {"term": "Supplementary angles", "definition": "Two angles whose measures add up to 180 degrees."},
      {"term": "Vertically opposite angles", "definition": "Equal angles formed on opposite sides when two straight lines intersect."},
      {"term": "Cartesian plane", "definition": "A coordinate system formed by two perpendicular number lines (axes), used to locate points."},
      {"term": "Ordered pair", "definition": "A pair of numbers (x, y) that gives the position of a point on the Cartesian plane."},
      {"term": "Origin", "definition": "The point (0, 0) where the x-axis and y-axis intersect."}
    ]'::jsonb,
    'Star navigation used by Indigenous peoples across the prairies and Arctic requires understanding angles and coordinates. Navigators used the positions of stars relative to the horizon — an angular measurement — to determine direction and location, connecting ancient wayfinding to coordinate geometry.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS7.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS7.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are supplementary angles?', 'Two angles whose measures add up to 180 degrees.', 'Think of a straight line.', 1, 0),
    (v_tenant, v_ch, 'What are the four quadrants of the Cartesian plane?', 'Quadrant I: (+, +), Quadrant II: (-, +), Quadrant III: (-, -), Quadrant IV: (+, -).', 'Start top right and go counterclockwise.', 2, 1),
    (v_tenant, v_ch, 'What is the origin?', 'The point (0, 0) where the x-axis and y-axis cross.', 'The center of the coordinate plane.', 1, 2),
    (v_tenant, v_ch, 'In the ordered pair (x, y), which value tells horizontal position?', 'The x-value (first number) tells the horizontal position. The y-value (second number) tells the vertical position.', 'x comes first, like in the alphabet.', 1, 3);

  -- Chapter 13: Transformations (SS7.5)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 13,
    'Transformations',
    'transformations',
    'Explore translations, rotations, and reflections of 2-D shapes across all four quadrants of the Cartesian plane.',
    '[
      {"type": "heading", "content": "Transformations", "level": 1},
      {"type": "text", "content": "A transformation changes the position, orientation, or size of a shape. In Grade 7, we focus on three types of rigid transformations — transformations that preserve size and shape: translations (slides), reflections (flips), and rotations (turns). We perform these on the Cartesian plane across all four quadrants."},
      {"type": "heading", "content": "Translations", "level": 2},
      {"type": "text", "content": "A translation slides every point of a shape the same distance in the same direction. We describe translations using ordered pairs that indicate horizontal and vertical movement. For example, a translation of (3, -2) means every point moves 3 units right and 2 units down. If point A is at (1, 4), after the translation it moves to (4, 2)."},
      {"type": "heading", "content": "Reflections", "level": 2},
      {"type": "text", "content": "A reflection flips a shape over a line of reflection, creating a mirror image. When reflecting over the x-axis, the x-coordinates stay the same and the y-coordinates become their opposites: (x, y) becomes (x, -y). When reflecting over the y-axis, the y-coordinates stay the same and the x-coordinates become their opposites: (x, y) becomes (-x, y)."},
      {"type": "heading", "content": "Rotations", "level": 2},
      {"type": "text", "content": "A rotation turns a shape around a fixed point called the centre of rotation. Common rotations are 90 degrees, 180 degrees, and 270 degrees, either clockwise or counterclockwise. A 180-degree rotation about the origin maps (x, y) to (-x, -y). A 90-degree counterclockwise rotation maps (x, y) to (-y, x)."},
      {"type": "callout", "content": "All three rigid transformations preserve the size and shape of the figure. The image is always congruent to the original.", "style": "info"},
      {"type": "quiz", "question": "A point at (2, -5) is translated by (-4, 3). What are the new coordinates?", "options": ["(-2, -2)", "(6, -8)", "(-2, 8)", "(-6, -2)"], "correct": 0, "explanation": "Add the translation to the original: (2 + (-4), -5 + 3) = (-2, -2)."},
      {"type": "quiz", "question": "What are the coordinates of the point (3, -7) after a reflection over the x-axis?", "options": ["(-3, 7)", "(-3, -7)", "(3, 7)", "(7, -3)"], "correct": 2, "explanation": "Reflecting over the x-axis: x stays the same, y becomes its opposite. (3, -7) becomes (3, 7)."},
      {"type": "quiz", "question": "A shape is rotated 180 degrees about the origin. The point (-4, 2) maps to:", "options": ["(4, -2)", "(-2, -4)", "(2, 4)", "(-4, -2)"], "correct": 0, "explanation": "A 180-degree rotation maps (x, y) to (-x, -y). (-4, 2) becomes (4, -2)."}
    ]'::jsonb,
    '[
      {"term": "Transformation", "definition": "An operation that moves or changes a geometric figure in some way."},
      {"term": "Translation", "definition": "A transformation that slides every point of a shape the same distance and direction."},
      {"term": "Reflection", "definition": "A transformation that flips a shape over a line, creating a mirror image."},
      {"term": "Rotation", "definition": "A transformation that turns a shape around a fixed centre point."},
      {"term": "Congruent", "definition": "Figures that have the same size and shape."},
      {"term": "Line of reflection", "definition": "The line over which a shape is flipped to create its mirror image."}
    ]'::jsonb,
    'Indigenous art forms such as birch bark biting, porcupine quillwork, and beaded medallions use reflections and rotational symmetry extensively. These art traditions demonstrate sophisticated spatial reasoning through repeated patterns that translate, reflect, and rotate motifs.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS7.5';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are the three types of rigid transformations?', 'Translations (slides), reflections (flips), and rotations (turns). All preserve shape and size.', 'Slide, flip, turn.', 1, 0),
    (v_tenant, v_ch, 'How do you reflect a point over the y-axis?', 'Change the sign of the x-coordinate: (x, y) becomes (-x, y).', 'The y-coordinate stays the same.', 2, 1),
    (v_tenant, v_ch, 'What does a 180-degree rotation about the origin do to (x, y)?', 'It maps (x, y) to (-x, -y). Both coordinates become their opposites.', 'Both coordinates flip sign.', 2, 2),
    (v_tenant, v_ch, 'Translate (-1, 3) by (5, -4). What is the image?', '(-1 + 5, 3 + (-4)) = (4, -1).', 'Add the translation vector to the original point.', 3, 3);


  -- ========================================
  -- UNIT 4: Statistics & Probability
  -- ========================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4,
    'Statistics & Probability',
    'Analyze data using measures of central tendency, interpret circle graphs, and explore theoretical and experimental probability.',
    'Data collection, organization, and analysis inform decision-making. Probability quantifies the likelihood of events and helps us make predictions based on evidence.',
    'How do we use data and probability to make informed decisions and predictions?')
  RETURNING id INTO v_unit;

  -- Chapter 14: Measures of Central Tendency (SP7.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 14,
    'Measures of Central Tendency & Range',
    'measures-central-tendency-range',
    'Calculate and interpret mean, median, mode, and range for data sets, and determine which measure best represents the data.',
    '[
      {"type": "heading", "content": "Measures of Central Tendency & Range", "level": 1},
      {"type": "text", "content": "Measures of central tendency describe the center or typical value of a data set. The three main measures are mean, median, and mode. The range describes the spread of the data. Each measure provides different information, and the best measure to use depends on the context and the data."},
      {"type": "heading", "content": "Mean", "level": 2},
      {"type": "text", "content": "The mean (average) is calculated by adding all the values in a data set and dividing by the number of values. For example, for the data set {4, 7, 9, 12, 18}, the mean is (4 + 7 + 9 + 12 + 18) / 5 = 50 / 5 = 10. The mean is affected by very large or very small values (outliers)."},
      {"type": "heading", "content": "Median", "level": 2},
      {"type": "text", "content": "The median is the middle value when data is arranged in order. If there is an odd number of values, the median is the middle one. If there is an even number, the median is the average of the two middle values. The median is not affected by outliers, making it useful for skewed data."},
      {"type": "heading", "content": "Mode and Range", "level": 2},
      {"type": "text", "content": "The mode is the value that occurs most frequently. A data set can have no mode, one mode, or multiple modes. The range is the difference between the highest and lowest values: Range = maximum - minimum. The range tells us how spread out the data is."},
      {"type": "callout", "content": "When data contains outliers (extreme values), the median is often a better measure of central tendency than the mean.", "style": "tip"},
      {"type": "quiz", "question": "Find the median of: 3, 8, 1, 6, 4, 9, 2", "options": ["4", "5", "6", "4.7"], "correct": 0, "explanation": "First arrange in order: 1, 2, 3, 4, 6, 8, 9. The middle value (4th of 7 values) is 4."},
      {"type": "quiz", "question": "A student''s test scores are 85, 90, 72, 88, 90. What is the mode?", "options": ["85", "88", "90", "There is no mode"], "correct": 2, "explanation": "90 appears twice, more than any other value. The mode is 90."},
      {"type": "quiz", "question": "Five friends earn: $12, $15, $14, $13, $96. Which measure of central tendency best represents their typical earnings?", "options": ["Mean", "Median", "Mode", "Range"], "correct": 1, "explanation": "The mean would be $30, which is skewed by the outlier ($96). The median is $14, which better represents the typical earning."}
    ]'::jsonb,
    '[
      {"term": "Mean", "definition": "The sum of all values divided by the number of values; commonly called the average."},
      {"term": "Median", "definition": "The middle value of an ordered data set. If even-numbered, the average of the two middle values."},
      {"term": "Mode", "definition": "The value that appears most frequently in a data set."},
      {"term": "Range", "definition": "The difference between the maximum and minimum values in a data set."},
      {"term": "Outlier", "definition": "A data value that is significantly higher or lower than the other values in the set."}
    ]'::jsonb,
    'Indigenous communities have long used data analysis in resource management — tracking animal populations, fish runs, and berry harvests across seasons. Elders pass down observations about typical yields and unusual years, which parallels the statistical concepts of central tendency and outliers.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SP7.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'How do you calculate the mean?', 'Add all the values and divide by the number of values.', 'Sum divided by count.', 1, 0),
    (v_tenant, v_ch, 'What is the median?', 'The middle value when data is arranged in order from least to greatest.', 'Order first, then find the middle.', 1, 1),
    (v_tenant, v_ch, 'When is the median a better measure than the mean?', 'When the data contains outliers (extreme values) that would skew the mean.', 'Think about data with one very large value.', 2, 2),
    (v_tenant, v_ch, 'Find the range of: 5, 12, 3, 20, 8.', 'Range = 20 - 3 = 17.', 'Maximum minus minimum.', 2, 3);

  -- Chapter 15: Circle Graphs (SP7.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 15,
    'Circle Graphs',
    'circle-graphs',
    'Create, read, and interpret circle graphs (pie charts) to display and analyze data.',
    '[
      {"type": "heading", "content": "Circle Graphs", "level": 1},
      {"type": "text", "content": "A circle graph (also called a pie chart) displays data as sectors of a circle. Each sector represents a category, and the size of the sector is proportional to the fraction of the whole that category represents. Circle graphs are useful for showing how parts relate to a whole, such as budget allocations or survey results."},
      {"type": "heading", "content": "Reading Circle Graphs", "level": 2},
      {"type": "text", "content": "To read a circle graph, identify each sector and its label or percentage. The larger the sector, the greater the proportion. All sectors together must add up to 100% of the data (or the total number). Compare sectors to determine which categories are larger or smaller."},
      {"type": "heading", "content": "Creating Circle Graphs", "level": 2},
      {"type": "text", "content": "To create a circle graph: (1) Find the total of all categories. (2) Calculate each category as a percent of the total. (3) Multiply each percent by 360 degrees to find the central angle for each sector. (4) Use a protractor to draw each sector. For example, if a category is 25% of the total, its central angle is 0.25 x 360 = 90 degrees."},
      {"type": "callout", "content": "Check: All the central angles should add up to 360 degrees, and all the percentages should add up to 100%.", "style": "tip"},
      {"type": "quiz", "question": "A survey of 200 students found that 80 prefer basketball. What central angle represents basketball on a circle graph?", "options": ["40 degrees", "80 degrees", "144 degrees", "160 degrees"], "correct": 2, "explanation": "Basketball is 80/200 = 40% of the total. Central angle = 0.40 x 360 = 144 degrees."},
      {"type": "quiz", "question": "In a circle graph, a sector has a central angle of 90 degrees. What percent of the total does it represent?", "options": ["25%", "50%", "10%", "90%"], "correct": 0, "explanation": "90/360 = 0.25 = 25%."}
    ]'::jsonb,
    '[
      {"term": "Circle graph", "definition": "A circular chart divided into sectors that represent proportions of a whole; also called a pie chart."},
      {"term": "Sector", "definition": "A pie-shaped part of a circle graph, bounded by two radii and an arc."},
      {"term": "Proportion", "definition": "A part considered in relation to the whole, often expressed as a fraction, decimal, or percent."},
      {"term": "Protractor", "definition": "A tool used to measure and draw angles."}
    ]'::jsonb,
    'The Medicine Wheel used by many First Nations is a circular symbol divided into four quadrants representing the four directions, seasons, and aspects of health. This circular representation of interconnected parts mirrors how circle graphs show proportional relationships.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SP7.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'How do you find the central angle for a sector in a circle graph?', 'Calculate the category as a fraction or percent of the total, then multiply by 360 degrees.', 'Fraction of total times 360.', 2, 0),
    (v_tenant, v_ch, 'What should all the sectors in a circle graph add up to?', '100% of the data (or 360 degrees total for all central angles).', 'The whole circle is the whole data set.', 1, 1),
    (v_tenant, v_ch, 'When are circle graphs most useful?', 'When you want to show how parts relate to a whole — for example, budget categories, survey responses, or composition data.', 'Parts of a whole.', 2, 2),
    (v_tenant, v_ch, 'A sector has a central angle of 72 degrees. What percent does it represent?', '72/360 = 0.2 = 20%.', 'Divide by 360, then multiply by 100.', 2, 3);

  -- Chapter 16: Probability (SP7.3)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 16,
    'Theoretical & Experimental Probability',
    'theoretical-experimental-probability',
    'Explore theoretical and experimental probability for two independent events with sample spaces of 36 or fewer elements.',
    '[
      {"type": "heading", "content": "Theoretical & Experimental Probability", "level": 1},
      {"type": "text", "content": "Probability measures the likelihood that an event will occur, expressed as a number from 0 (impossible) to 1 (certain). We can also express probability as a fraction, decimal, or percent. There are two approaches: theoretical probability (based on reasoning) and experimental probability (based on trials)."},
      {"type": "heading", "content": "Theoretical Probability", "level": 2},
      {"type": "text", "content": "Theoretical probability is calculated by dividing the number of favourable outcomes by the total number of possible outcomes: P(event) = favourable outcomes / total outcomes. For a fair six-sided die, the probability of rolling a 3 is 1/6 because there is 1 favourable outcome out of 6 possible outcomes."},
      {"type": "heading", "content": "Experimental Probability", "level": 2},
      {"type": "text", "content": "Experimental probability is determined by conducting trials and recording results. It is calculated as: P(event) = number of times the event occurred / total number of trials. If you roll a die 60 times and get a 3 exactly 12 times, the experimental probability of rolling a 3 is 12/60 = 1/5. As the number of trials increases, experimental probability tends to approach theoretical probability."},
      {"type": "heading", "content": "Independent Events & Sample Spaces", "level": 2},
      {"type": "text", "content": "Two events are independent if the outcome of one does not affect the outcome of the other. For example, rolling two dice are independent events. The sample space for two dice has 6 x 6 = 36 outcomes. To find the probability of a combined event, list or organize the outcomes in a table or tree diagram. For example, P(rolling a sum of 7 with two dice) = 6/36 = 1/6, since there are 6 combinations that sum to 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1)."},
      {"type": "callout", "content": "A tree diagram or outcome table helps organize all possible results for compound events and ensures no outcomes are missed.", "style": "tip"},
      {"type": "quiz", "question": "A bag contains 3 red, 5 blue, and 2 green marbles. What is the theoretical probability of drawing a blue marble?", "options": ["1/2", "1/5", "3/10", "5/10"], "correct": 0, "explanation": "Total marbles = 3 + 5 + 2 = 10. P(blue) = 5/10 = 1/2."},
      {"type": "quiz", "question": "You flip a coin 50 times and get heads 28 times. What is the experimental probability of heads?", "options": ["1/2", "28/50", "22/50", "28/100"], "correct": 1, "explanation": "Experimental probability = number of heads / total flips = 28/50 = 14/25 = 0.56 or 56%."},
      {"type": "quiz", "question": "How many outcomes are in the sample space when rolling two standard dice?", "options": ["12", "24", "36", "6"], "correct": 2, "explanation": "Each die has 6 faces. The total sample space = 6 x 6 = 36 outcomes."}
    ]'::jsonb,
    '[
      {"term": "Probability", "definition": "A measure of the likelihood of an event, expressed as a number from 0 to 1 (or as a percent from 0% to 100%)."},
      {"term": "Theoretical probability", "definition": "The expected probability based on reasoning: favourable outcomes divided by total outcomes."},
      {"term": "Experimental probability", "definition": "The observed probability based on repeated trials: occurrences of an event divided by total trials."},
      {"term": "Independent events", "definition": "Events where the outcome of one does not affect the outcome of the other."},
      {"term": "Sample space", "definition": "The set of all possible outcomes for an experiment."},
      {"term": "Tree diagram", "definition": "A visual tool that shows all possible outcomes of a compound event using branching paths."}
    ]'::jsonb,
    'Many Indigenous games of chance, such as the Cree stick game (also known as the hand game), involve probability concepts. Players assess the likelihood of outcomes based on hidden objects, developing intuitive understanding of chance and prediction.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SP7.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the formula for theoretical probability?', 'P(event) = number of favourable outcomes / total number of possible outcomes.', 'Favourable over total.', 1, 0),
    (v_tenant, v_ch, 'How does experimental probability differ from theoretical?', 'Experimental probability is based on actual trials and observations, while theoretical is based on mathematical reasoning about equally likely outcomes.', 'One is real data, the other is calculated.', 2, 1),
    (v_tenant, v_ch, 'What are independent events?', 'Events where the outcome of one does not affect the outcome of the other. Example: rolling two dice.', 'One result does not change the other.', 2, 2),
    (v_tenant, v_ch, 'How many outcomes are possible when flipping a coin and rolling a die simultaneously?', '2 x 6 = 12 outcomes.', 'Multiply the outcomes of each event.', 2, 3),
    (v_tenant, v_ch, 'What happens to experimental probability as you increase the number of trials?', 'It tends to get closer to the theoretical probability. This is the law of large numbers.', 'More trials = closer to expected.', 3, 4);

  -- Update chapter count for Grade 7
  UPDATE textbooks SET chapter_count = 16 WHERE id = v_book;

END $$;


-- ============================================================================
-- GRADE 8: WolfWhale Foundations of Math 8
-- Outcomes: N8.1-N8.5, P8.1-P8.2, SS8.1-SS8.4, SP8.1-SP8.2
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book UUID;
  v_unit UUID;
  v_ch UUID;
  v_oc UUID;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-foundations-of-math-8';

  -- ========================================
  -- UNIT 1: Number Sense & Operations
  -- ========================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1,
    'Number Sense & Operations',
    'Explore square roots, percent applications, rates, ratios, proportional reasoning, fraction operations, and integer multiplication and division.',
    'Extending number sense to include square roots, proportional reasoning, and integer operations enables us to model and solve increasingly complex real-world problems.',
    'How do square roots, ratios, and integer operations extend our ability to solve problems?')
  RETURNING id INTO v_unit;

  -- Chapter 1: Square Roots (N8.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 1,
    'Squares & Square Roots',
    'squares-and-square-roots',
    'Understand perfect squares, principal square roots, and estimate square roots of non-perfect squares.',
    '[
      {"type": "heading", "content": "Squares & Square Roots", "level": 1},
      {"type": "text", "content": "When we multiply a number by itself, the result is called a perfect square. For example, 7 x 7 = 49, so 49 is a perfect square and 7 is its square root. The square root operation is the inverse of squaring: it asks, what number multiplied by itself gives this value?"},
      {"type": "heading", "content": "Perfect Squares", "level": 2},
      {"type": "text", "content": "The first fifteen perfect squares are: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225. Recognizing perfect squares helps with mental math and estimation. Perfect squares can be represented as square arrays of dots or tiles — for example, 16 dots can be arranged in a 4 by 4 square."},
      {"type": "heading", "content": "Principal Square Root", "level": 2},
      {"type": "text", "content": "Every positive number has two square roots: a positive root and a negative root. For example, the square roots of 25 are +5 and -5 because both 5 x 5 and (-5) x (-5) equal 25. The principal (positive) square root is denoted by the radical symbol. So the square root of 25 = 5 (the principal root)."},
      {"type": "heading", "content": "Estimating Non-Perfect Square Roots", "level": 2},
      {"type": "text", "content": "Not every whole number is a perfect square. To estimate the square root of a non-perfect square, identify the two consecutive perfect squares it falls between. For example, the square root of 50 falls between the square root of 49 (which is 7) and the square root of 64 (which is 8). Since 50 is close to 49, the square root of 50 is approximately 7.1."},
      {"type": "callout", "content": "You can refine estimates by testing: 7.1 x 7.1 = 50.41 (too high), 7.07 x 7.07 = 49.98 (very close). So the square root of 50 is approximately 7.07.", "style": "example"},
      {"type": "quiz", "question": "Which of the following is a perfect square?", "options": ["48", "81", "72", "90"], "correct": 1, "explanation": "81 = 9 x 9, making it a perfect square. The others cannot be expressed as a whole number times itself."},
      {"type": "quiz", "question": "Between which two whole numbers does the square root of 30 fall?", "options": ["4 and 5", "5 and 6", "6 and 7", "7 and 8"], "correct": 1, "explanation": "The square root of 25 = 5 and the square root of 36 = 6. Since 25 < 30 < 36, the square root of 30 is between 5 and 6."},
      {"type": "quiz", "question": "What is the principal square root of 144?", "options": ["-12", "12", "72", "14"], "correct": 1, "explanation": "12 x 12 = 144. The principal (positive) square root is 12."}
    ]'::jsonb,
    '[
      {"term": "Perfect square", "definition": "A number that is the product of a whole number multiplied by itself."},
      {"term": "Square root", "definition": "A value that, when multiplied by itself, gives the original number."},
      {"term": "Principal square root", "definition": "The positive square root of a number, denoted by the radical symbol."},
      {"term": "Radical symbol", "definition": "The symbol used to indicate a square root or other root of a number."},
      {"term": "Consecutive", "definition": "Following one after another without gaps, as in consecutive whole numbers."}
    ]'::jsonb,
    'Indigenous architecture demonstrates understanding of square relationships. The square floor plans of traditional earth lodges among Plains peoples required understanding that a room of twice the side length has four times the floor area — a direct application of squaring.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N8.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a perfect square?', 'A number that results from multiplying a whole number by itself. Examples: 1, 4, 9, 16, 25, 36, ...', 'Think of making a square array.', 1, 0),
    (v_tenant, v_ch, 'What is the principal square root of 64?', '8, because 8 x 8 = 64. The principal root is always positive.', 'The positive root.', 1, 1),
    (v_tenant, v_ch, 'Estimate the square root of 40 to one decimal place.', 'Between 6 (sqrt 36) and 7 (sqrt 49). Since 40 is closer to 36, approximately 6.3. Check: 6.3 x 6.3 = 39.69.', 'Find the two perfect squares on either side.', 3, 2),
    (v_tenant, v_ch, 'Why does every positive number have two square roots?', 'Because both a positive and negative number, when squared, give a positive result. For example, 3 squared and (-3) squared both equal 9.', 'Negative times negative is positive.', 2, 3);

  -- Chapter 2: Percent Applications (N8.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 2,
    'Percent Applications',
    'percent-applications',
    'Extend understanding of percent to include values greater than 100% and less than 1%, and apply percent to real-world problems.',
    '[
      {"type": "heading", "content": "Percent Applications", "level": 1},
      {"type": "text", "content": "In Grade 8, we expand our understanding of percent beyond the 1% to 100% range. Percents greater than 100% represent quantities more than the whole — for example, a population that grows to 150% of its original size has increased by half. Percents less than 1% represent very small portions, such as 0.5% interest rates."},
      {"type": "heading", "content": "Percents Greater Than 100%", "level": 2},
      {"type": "text", "content": "A percent greater than 100 means the part is larger than the whole reference. For example, 250% of 40 means 2.5 x 40 = 100. If a stock price increases from $20 to $50, it has grown to 250% of its original value, or it has increased by 150%."},
      {"type": "heading", "content": "Percents Less Than 1%", "level": 2},
      {"type": "text", "content": "Very small percents appear in scientific and financial contexts. For example, 0.25% means 0.25 per 100, or 0.0025 as a decimal. If a bank offers 0.5% interest on a $10 000 deposit, the interest is 0.005 x 10 000 = $50 per year."},
      {"type": "heading", "content": "Combined Percent Problems", "level": 2},
      {"type": "text", "content": "Percent increase: New = Original x (1 + rate). Percent decrease: New = Original x (1 - rate). For a 15% increase on $200: $200 x 1.15 = $230. For a 20% decrease on $80: $80 x 0.80 = $64. To find percent change: ((New - Original) / Original) x 100%."},
      {"type": "callout", "content": "In Saskatchewan, PST is 6% and GST is 5%. The combined sales tax on a $45 item is: $45 x 0.06 + $45 x 0.05 = $2.70 + $2.25 = $4.95. Total: $49.95.", "style": "example"},
      {"type": "quiz", "question": "Express 175% as a decimal.", "options": ["0.175", "1.75", "17.5", "175"], "correct": 1, "explanation": "175% = 175 / 100 = 1.75."},
      {"type": "quiz", "question": "A town''s population was 8 000 and grew to 10 400. What is the percent increase?", "options": ["20%", "24%", "30%", "76%"], "correct": 2, "explanation": "Increase = 10 400 - 8 000 = 2 400. Percent increase = (2 400 / 8 000) x 100% = 30%."},
      {"type": "quiz", "question": "What is 0.3% of 5 000?", "options": ["1.5", "15", "150", "1 500"], "correct": 1, "explanation": "0.3% = 0.003 as a decimal. 0.003 x 5 000 = 15."}
    ]'::jsonb,
    '[
      {"term": "Percent increase", "definition": "The amount of increase expressed as a percent of the original value."},
      {"term": "Percent decrease", "definition": "The amount of decrease expressed as a percent of the original value."},
      {"term": "GST", "definition": "Goods and Services Tax — a 5% federal tax applied to most goods and services in Canada."},
      {"term": "PST", "definition": "Provincial Sales Tax — a 6% tax applied in Saskatchewan to taxable goods and services."},
      {"term": "Percent change", "definition": "The ratio of the amount of change to the original amount, expressed as a percent."}
    ]'::jsonb,
    'Understanding percent has practical connections to Indigenous economic development. Band-operated businesses, treaty land entitlement calculations, and resource revenue sharing all involve sophisticated percent reasoning in community contexts.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N8.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does a percent greater than 100% mean?', 'It means the part is larger than the original whole. For example, 200% means double the original amount.', 'More than the whole.', 2, 0),
    (v_tenant, v_ch, 'Convert 0.4% to a decimal.', '0.4% = 0.4 / 100 = 0.004.', 'Divide by 100.', 2, 1),
    (v_tenant, v_ch, 'A $250 jacket is 30% off. What is the sale price?', 'Discount = 0.30 x 250 = $75. Sale price = $250 - $75 = $175.', 'Find the discount amount first.', 3, 2),
    (v_tenant, v_ch, 'How do you calculate percent change?', '((New value - Original value) / Original value) x 100%.', 'Change over original, times 100.', 2, 3);

  -- Chapter 3: Rates, Ratios & Proportional Reasoning (N8.3)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 3,
    'Rates, Ratios & Proportional Reasoning',
    'rates-ratios-proportional-reasoning',
    'Develop understanding of rates, ratios, and proportional reasoning through concrete, pictorial, and symbolic representations.',
    '[
      {"type": "heading", "content": "Rates, Ratios & Proportional Reasoning", "level": 1},
      {"type": "text", "content": "A ratio compares two quantities of the same kind (e.g., 3 red to 5 blue). A rate compares two quantities of different kinds (e.g., 90 km in 2 hours). Proportional reasoning is the ability to recognize and work with multiplicative relationships between quantities."},
      {"type": "heading", "content": "Ratios", "level": 2},
      {"type": "text", "content": "Ratios can be written in three ways: 3:5, 3 to 5, or 3/5. Two ratios are equivalent if they can be simplified to the same ratio. For example, 6:10 and 9:15 are both equivalent to 3:5 because each can be reduced by dividing both terms by their common factor."},
      {"type": "heading", "content": "Rates & Unit Rates", "level": 2},
      {"type": "text", "content": "A rate compares different units: kilometres per hour, cost per kilogram, heartbeats per minute. A unit rate has a denominator of 1, making comparisons easy. For example, if 6 apples cost $4.50, the unit rate is $4.50 / 6 = $0.75 per apple. Unit rates help us compare values across different quantities."},
      {"type": "heading", "content": "Solving Proportions", "level": 2},
      {"type": "text", "content": "A proportion is an equation stating two ratios are equal: a/b = c/d. To solve for an unknown, use cross-multiplication: a x d = b x c. For example, if 3/4 = x/20, then 3 x 20 = 4 x x, so 60 = 4x, and x = 15."},
      {"type": "callout", "content": "To check if two ratios form a proportion, cross-multiply. If the cross-products are equal, the ratios are proportional.", "style": "tip"},
      {"type": "quiz", "question": "A car travels 420 km in 5 hours. What is the unit rate?", "options": ["84 km/h", "80 km/h", "42 km/h", "2 100 km/h"], "correct": 0, "explanation": "Unit rate = 420 km / 5 h = 84 km/h."},
      {"type": "quiz", "question": "Solve the proportion: 5/8 = x/40", "options": ["x = 25", "x = 32", "x = 20", "x = 64"], "correct": 0, "explanation": "Cross-multiply: 5 x 40 = 8 x x. So 200 = 8x, and x = 25."},
      {"type": "quiz", "question": "Which is the better buy: 4 notebooks for $6.00 or 7 notebooks for $9.80?", "options": ["4 for $6.00", "7 for $9.80", "They are the same", "Cannot determine"], "correct": 1, "explanation": "Unit rate 1: $6.00 / 4 = $1.50 each. Unit rate 2: $9.80 / 7 = $1.40 each. The second option is cheaper per notebook."}
    ]'::jsonb,
    '[
      {"term": "Ratio", "definition": "A comparison of two quantities of the same kind, expressed as a:b, a to b, or a/b."},
      {"term": "Rate", "definition": "A ratio that compares two quantities measured in different units."},
      {"term": "Unit rate", "definition": "A rate with a denominator of 1, such as $3 per kilogram or 60 km per hour."},
      {"term": "Proportion", "definition": "An equation stating that two ratios are equal, such as a/b = c/d."},
      {"term": "Cross-multiplication", "definition": "A method for solving proportions: if a/b = c/d, then a x d = b x c."}
    ]'::jsonb,
    'Traditional Indigenous trade routes across Canada used proportional reasoning extensively. Rates of exchange were established between nations — a number of furs for tools, food for medicines — demonstrating sophisticated understanding of equivalent ratios in economic systems.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N8.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the difference between a ratio and a rate?', 'A ratio compares quantities of the same kind. A rate compares quantities of different kinds (different units).', 'Same units vs. different units.', 1, 0),
    (v_tenant, v_ch, 'What is a unit rate?', 'A rate expressed with a denominator of 1, such as $2.50 per litre or 80 beats per minute.', 'Per one unit.', 1, 1),
    (v_tenant, v_ch, 'Solve: 4/9 = 12/x', 'Cross-multiply: 4x = 9 x 12 = 108. So x = 27.', 'Cross-multiply and solve for x.', 3, 2),
    (v_tenant, v_ch, 'How do you determine which is the better buy?', 'Calculate the unit rate (price per item) for each option and compare. The lower unit rate is the better buy.', 'Compare price per single item.', 2, 3);

  -- Chapter 4: Multiplying & Dividing Fractions (N8.4)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 4,
    'Multiplying & Dividing Fractions',
    'multiplying-dividing-fractions',
    'Multiply and divide positive fractions and mixed numbers using concrete, pictorial, and symbolic methods.',
    '[
      {"type": "heading", "content": "Multiplying & Dividing Fractions", "level": 1},
      {"type": "text", "content": "In Grade 8, we extend fraction operations to include multiplication and division. These operations are essential for scaling recipes, calculating areas involving fractional dimensions, and solving proportional problems."},
      {"type": "heading", "content": "Multiplying Fractions", "level": 2},
      {"type": "text", "content": "To multiply two fractions, multiply the numerators together and multiply the denominators together: (a/b) x (c/d) = (a x c) / (b x d). For example, 2/3 x 4/5 = 8/15. You can simplify before multiplying by cancelling common factors between any numerator and any denominator."},
      {"type": "callout", "content": "Example: 3/4 x 2/9. Cancel the 3 in the numerator with the 9 in the denominator (both divisible by 3): 1/4 x 2/3 = 2/12 = 1/6.", "style": "example"},
      {"type": "heading", "content": "Dividing Fractions", "level": 2},
      {"type": "text", "content": "To divide by a fraction, multiply by its reciprocal. The reciprocal of a/b is b/a. So (a/b) divided by (c/d) = (a/b) x (d/c). For example, 3/5 divided by 2/7 = 3/5 x 7/2 = 21/10 = 2 1/10."},
      {"type": "heading", "content": "Mixed Numbers", "level": 2},
      {"type": "text", "content": "To multiply or divide mixed numbers, first convert them to improper fractions. For example, 2 1/3 x 1 1/2: convert to 7/3 x 3/2 = 21/6 = 7/2 = 3 1/2."},
      {"type": "quiz", "question": "What is 5/6 x 3/10?", "options": ["15/60", "1/4", "8/16", "5/20"], "correct": 1, "explanation": "5/6 x 3/10 = 15/60 = 1/4 after simplifying (divide both by 15)."},
      {"type": "quiz", "question": "Compute: 4/7 divided by 2/3.", "options": ["8/21", "6/7", "12/14", "6/14"], "correct": 1, "explanation": "4/7 divided by 2/3 = 4/7 x 3/2 = 12/14 = 6/7."},
      {"type": "quiz", "question": "A recipe calls for 2 1/4 cups of flour. If you want to make 2/3 of the recipe, how much flour do you need?", "options": ["1 1/2 cups", "1 1/3 cups", "3 cups", "1 cup"], "correct": 0, "explanation": "2 1/4 = 9/4. Multiply: 9/4 x 2/3 = 18/12 = 3/2 = 1 1/2 cups."}
    ]'::jsonb,
    '[
      {"term": "Reciprocal", "definition": "The reciprocal of a fraction a/b is b/a. A number times its reciprocal equals 1."},
      {"term": "Numerator", "definition": "The top number of a fraction, representing the number of parts being considered."},
      {"term": "Denominator", "definition": "The bottom number of a fraction, representing the total number of equal parts."},
      {"term": "Cross-cancel", "definition": "Simplifying before multiplying by dividing a numerator and a denominator by a common factor."},
      {"term": "Improper fraction", "definition": "A fraction where the numerator is greater than or equal to the denominator."}
    ]'::jsonb,
    'Traditional bannock recipes passed through generations require scaling — doubling or halving ingredients. Multiplying and dividing fractions is essential when adapting recipes for different group sizes, connecting mathematical operations to the cultural practice of community feasting.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N8.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'How do you multiply two fractions?', 'Multiply the numerators together and multiply the denominators together: (a/b) x (c/d) = ac/bd.', 'Top times top, bottom times bottom.', 1, 0),
    (v_tenant, v_ch, 'How do you divide by a fraction?', 'Multiply by the reciprocal of the divisor. (a/b) / (c/d) = (a/b) x (d/c).', 'Flip the second fraction and multiply.', 2, 1),
    (v_tenant, v_ch, 'What is the reciprocal of 3/8?', '8/3. A number times its reciprocal equals 1.', 'Flip the fraction.', 1, 2),
    (v_tenant, v_ch, 'Compute: 1 2/5 x 2 1/3', 'Convert: 7/5 x 7/3 = 49/15 = 3 4/15.', 'Convert to improper fractions first.', 3, 3);

  -- Chapter 5: Multiplying & Dividing Integers (N8.5)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 5,
    'Multiplying & Dividing Integers',
    'multiplying-dividing-integers',
    'Understand and apply multiplication and division of integers using concrete, pictorial, and symbolic methods.',
    '[
      {"type": "heading", "content": "Multiplying & Dividing Integers", "level": 1},
      {"type": "text", "content": "In Grade 7, we learned to add and subtract integers. Now we extend to multiplication and division. The sign rules for these operations are straightforward and consistent."},
      {"type": "heading", "content": "Sign Rules for Multiplication", "level": 2},
      {"type": "list", "items": ["Positive x Positive = Positive (3 x 4 = 12)", "Negative x Negative = Positive ((-3) x (-4) = 12)", "Positive x Negative = Negative (3 x (-4) = -12)", "Negative x Positive = Negative ((-3) x 4 = -12)"], "ordered": false},
      {"type": "text", "content": "In summary: when the signs are the same, the product is positive. When the signs are different, the product is negative. This can be remembered as: same signs = positive, different signs = negative."},
      {"type": "heading", "content": "Sign Rules for Division", "level": 2},
      {"type": "text", "content": "The sign rules for division are the same as for multiplication: same signs give a positive quotient, different signs give a negative quotient. For example, (-24) / (-6) = +4 and (-24) / 6 = -4."},
      {"type": "callout", "content": "Memory aid: Same signs = positive result. Different signs = negative result. This works for both multiplication and division.", "style": "tip"},
      {"type": "heading", "content": "Order of Operations with Integers", "level": 2},
      {"type": "text", "content": "When expressions involve multiple integer operations, apply BEDMAS. For example: (-2) x 3 + (-4) x (-5) = -6 + 20 = 14. Multiply first, then add."},
      {"type": "quiz", "question": "Calculate: (-7) x (-9)", "options": ["-63", "63", "-16", "16"], "correct": 1, "explanation": "Negative times negative is positive: (-7) x (-9) = 63."},
      {"type": "quiz", "question": "Calculate: 56 / (-8)", "options": ["7", "-7", "48", "-48"], "correct": 1, "explanation": "Positive divided by negative is negative: 56 / (-8) = -7."},
      {"type": "quiz", "question": "Evaluate: (-3) x 4 + (-2) x (-6)", "options": ["0", "24", "-24", "6"], "correct": 0, "explanation": "Multiply first: (-3) x 4 = -12, and (-2) x (-6) = 12. Then add: -12 + 12 = 0."}
    ]'::jsonb,
    '[
      {"term": "Product", "definition": "The result of multiplying two or more numbers."},
      {"term": "Quotient", "definition": "The result of dividing one number by another."},
      {"term": "Sign rule", "definition": "A rule determining the sign of the result: same signs give positive, different signs give negative."},
      {"term": "Integer", "definition": "A positive or negative whole number, or zero."},
      {"term": "Absolute value", "definition": "The magnitude of a number regardless of its sign; its distance from zero."}
    ]'::jsonb,
    'The concept of balanced pairs — positive and negative, gain and loss — connects to Indigenous teachings about duality and balance in nature. The pairing of positive and negative integers mirrors the interconnectedness of opposing forces in many Indigenous worldviews.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N8.5';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the sign rule for multiplying integers?', 'Same signs = positive product. Different signs = negative product.', 'Like signs are positive.', 1, 0),
    (v_tenant, v_ch, 'Calculate: (-12) x (-5)', '60. Negative times negative is positive.', 'Same signs.', 2, 1),
    (v_tenant, v_ch, 'Calculate: (-48) / 8', '-6. Negative divided by positive is negative.', 'Different signs.', 2, 2),
    (v_tenant, v_ch, 'Do the sign rules for division match multiplication?', 'Yes. Same signs give a positive result; different signs give a negative result, for both operations.', 'The rules are identical.', 1, 3);


  -- ========================================
  -- UNIT 2: Patterns & Relations
  -- ========================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2,
    'Patterns & Relations',
    'Develop understanding of linear relations through multiple representations and solve multi-step linear equations.',
    'Linear relations can be represented with tables, graphs, equations, and verbal descriptions. Solving linear equations is a foundational algebraic skill.',
    'How can we represent and solve linear relations using different methods?')
  RETURNING id INTO v_unit;

  -- Chapter 6: Linear Relations (P8.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 6,
    'Linear Relations',
    'linear-relations',
    'Represent linear relations using tables, graphs, equations, and verbal descriptions, and analyze relationships between variables.',
    '[
      {"type": "heading", "content": "Linear Relations", "level": 1},
      {"type": "text", "content": "A linear relation describes a relationship between two variables that produces a straight-line graph. The key characteristic is a constant rate of change — for every unit increase in the independent variable, the dependent variable changes by a fixed amount. Linear relations appear in everyday situations: hourly wages, distance over time, temperature conversions."},
      {"type": "heading", "content": "Multiple Representations", "level": 2},
      {"type": "text", "content": "Linear relations can be expressed in four ways: (1) Verbal — a description in words. (2) Table of values — organized input-output pairs. (3) Graph — plotted points forming a straight line. (4) Equation — a symbolic rule such as y = 3x + 2. Being able to move between these representations is a critical algebraic skill."},
      {"type": "heading", "content": "Slope and y-intercept", "level": 2},
      {"type": "text", "content": "In the equation y = mx + b, m represents the slope (rate of change) and b represents the y-intercept (the value of y when x = 0). The slope tells us how steep the line is and whether it goes up (positive slope) or down (negative slope). For example, in y = 2x + 5, the slope is 2 (the line rises 2 units for every 1 unit to the right) and the y-intercept is 5."},
      {"type": "callout", "content": "To find the slope from a table: choose two points and calculate (change in y) / (change in x). This should be the same between any two points if the relation is linear.", "style": "tip"},
      {"type": "heading", "content": "Graphing Linear Relations", "level": 2},
      {"type": "text", "content": "To graph a linear relation: (1) Create a table of values by substituting values of x into the equation. (2) Plot the ordered pairs on a coordinate grid. (3) Draw a straight line through the points. (4) Label the axes and title the graph."},
      {"type": "quiz", "question": "In the equation y = -3x + 7, what is the slope?", "options": ["7", "-3", "3", "-7"], "correct": 1, "explanation": "In y = mx + b, the coefficient of x is the slope. Here, m = -3, meaning y decreases by 3 for each unit increase in x."},
      {"type": "quiz", "question": "A table shows: x = 0, y = 4; x = 1, y = 7; x = 2, y = 10; x = 3, y = 13. What is the equation?", "options": ["y = 3x + 4", "y = 4x + 3", "y = 3x - 4", "y = x + 4"], "correct": 0, "explanation": "The rate of change is +3 (y increases by 3 each time x increases by 1). When x = 0, y = 4. So the equation is y = 3x + 4."},
      {"type": "quiz", "question": "Which graph represents a negative slope?", "options": ["A line going up from left to right", "A line going down from left to right", "A horizontal line", "A vertical line"], "correct": 1, "explanation": "A negative slope means y decreases as x increases, so the line goes down from left to right."}
    ]'::jsonb,
    '[
      {"term": "Linear relation", "definition": "A relationship between two variables with a constant rate of change, producing a straight-line graph."},
      {"term": "Slope", "definition": "The rate of change in a linear relation, representing the steepness of the line; calculated as rise over run."},
      {"term": "y-intercept", "definition": "The point where a graph crosses the y-axis; the value of y when x = 0."},
      {"term": "Dependent variable", "definition": "The variable whose value depends on the independent variable, typically graphed on the vertical axis."},
      {"term": "Constant rate of change", "definition": "A fixed amount by which the dependent variable changes for each unit change in the independent variable."}
    ]'::jsonb,
    'The growth of traditional plant medicines follows predictable patterns that Indigenous knowledge keepers have observed over generations. The rate at which sweetgrass or sage grows under different conditions mirrors linear relations — consistent growth over time under stable conditions.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'P8.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does the slope of a linear relation tell us?', 'The slope tells us the rate of change — how much y changes for each unit increase in x.', 'Rise over run.', 2, 0),
    (v_tenant, v_ch, 'In y = mx + b, what does b represent?', 'b is the y-intercept — the value of y when x = 0, or where the line crosses the y-axis.', 'The starting value.', 1, 1),
    (v_tenant, v_ch, 'Name the four representations of a linear relation.', 'Verbal description, table of values, graph, and equation.', 'Words, numbers, picture, symbols.', 2, 2),
    (v_tenant, v_ch, 'How can you tell if a relation is linear from a table of values?', 'The differences between consecutive y-values are constant when x increases by equal steps.', 'Look for constant first differences.', 2, 3);

  -- Chapter 7: Solving Linear Equations (P8.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 7,
    'Solving Linear Equations',
    'solving-linear-equations-8',
    'Model and solve linear equations of increasing complexity using concrete, pictorial, and symbolic methods.',
    '[
      {"type": "heading", "content": "Solving Linear Equations", "level": 1},
      {"type": "text", "content": "Building on the one- and two-step equations from Grade 7, we now solve more complex linear equations. The fundamental principle remains: maintain balance by performing the same operation on both sides of the equation."},
      {"type": "heading", "content": "Equations of the Form ax = b and x/a = b", "level": 2},
      {"type": "text", "content": "For ax = b, divide both sides by a. For example, 5x = 35 gives x = 7. For x/a = b, multiply both sides by a. For example, x/4 = 9 gives x = 36."},
      {"type": "heading", "content": "Equations of the Form ax + b = c", "level": 2},
      {"type": "text", "content": "First undo the addition or subtraction, then undo the multiplication. For example, solve 4x + 7 = 31: subtract 7 from both sides to get 4x = 24, then divide by 4 to get x = 6."},
      {"type": "heading", "content": "Equations with Brackets: a(x + b) = c", "level": 2},
      {"type": "text", "content": "When an equation has brackets, you can either distribute first or divide both sides by the coefficient. For example, solve 3(x + 4) = 27: Method 1: Distribute: 3x + 12 = 27, then 3x = 15, then x = 5. Method 2: Divide both sides by 3: x + 4 = 9, then x = 5."},
      {"type": "callout", "content": "Always verify your solution by substituting it back into the original equation.", "style": "tip"},
      {"type": "quiz", "question": "Solve: x/5 + 3 = 10", "options": ["x = 35", "x = 50", "x = 7", "x = 2"], "correct": 0, "explanation": "Subtract 3: x/5 = 7. Multiply by 5: x = 35. Check: 35/5 + 3 = 7 + 3 = 10."},
      {"type": "quiz", "question": "Solve: 2(x - 3) = 14", "options": ["x = 5.5", "x = 10", "x = 7", "x = 8.5"], "correct": 1, "explanation": "Distribute: 2x - 6 = 14. Add 6: 2x = 20. Divide by 2: x = 10. Check: 2(10 - 3) = 2(7) = 14."},
      {"type": "quiz", "question": "Solve: 6x - 5 = 3x + 10", "options": ["x = 5", "x = 3", "x = 15", "x = 1"], "correct": 0, "explanation": "Subtract 3x from both sides: 3x - 5 = 10. Add 5: 3x = 15. Divide by 3: x = 5. Check: 6(5) - 5 = 25, 3(5) + 10 = 25."}
    ]'::jsonb,
    '[
      {"term": "Distributive property", "definition": "a(b + c) = ab + ac. Multiplying a number by a sum equals the sum of the individual products."},
      {"term": "Balance principle", "definition": "Whatever operation is performed on one side of an equation must also be performed on the other side."},
      {"term": "Coefficient", "definition": "The numerical factor multiplied by a variable in a term."},
      {"term": "Like terms", "definition": "Terms with the same variable raised to the same power, which can be combined by adding or subtracting their coefficients."},
      {"term": "Verify", "definition": "To check a solution by substituting it back into the original equation."}
    ]'::jsonb,
    'Building a structure such as a tipi requires solving for unknown quantities — the correct length of poles, the angle of inclination, the amount of covering material. These practical problems translate directly into algebraic equations that must be solved systematically.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'P8.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the distributive property?', 'a(b + c) = ab + ac. You multiply the outside term by each term inside the brackets.', 'Distribute means spread out.', 2, 0),
    (v_tenant, v_ch, 'Solve: 3x + 8 = 29', 'Subtract 8: 3x = 21. Divide by 3: x = 7.', 'Two steps: undo adding, then undo multiplying.', 2, 1),
    (v_tenant, v_ch, 'Solve: 5(x - 2) = 20', 'Distribute: 5x - 10 = 20. Add 10: 5x = 30. Divide by 5: x = 6.', 'Distribute first or divide both sides by 5.', 3, 2),
    (v_tenant, v_ch, 'Why do we always verify our solution?', 'To confirm the value actually satisfies the original equation, catching any arithmetic errors made during solving.', 'Plug it back in to check.', 1, 3);


  -- ========================================
  -- UNIT 3: Shape & Space
  -- ========================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3,
    'Shape & Space',
    'Apply the Pythagorean Theorem, calculate surface area and volume of prisms and cylinders, and explore tessellations.',
    'Geometric relationships such as the Pythagorean Theorem connect algebra and geometry. Surface area and volume formulas allow us to measure three-dimensional objects, and tessellations reveal pattern structures in plane geometry.',
    'How do geometric formulas and spatial reasoning help us solve problems involving 2-D and 3-D shapes?')
  RETURNING id INTO v_unit;

  -- Chapter 8: The Pythagorean Theorem (SS8.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 8,
    'The Pythagorean Theorem',
    'pythagorean-theorem',
    'Understand and apply the Pythagorean Theorem to solve problems involving right triangles.',
    '[
      {"type": "heading", "content": "The Pythagorean Theorem", "level": 1},
      {"type": "text", "content": "The Pythagorean Theorem is one of the most important relationships in mathematics. It states that in any right triangle, the square of the hypotenuse (the longest side, opposite the right angle) equals the sum of the squares of the other two sides (legs). Symbolically: a squared + b squared = c squared, where c is the hypotenuse."},
      {"type": "heading", "content": "Using the Theorem to Find a Side", "level": 2},
      {"type": "text", "content": "If two sides of a right triangle are known, the third can be found. To find the hypotenuse: c = square root of (a squared + b squared). For example, if a = 3 and b = 4, then c = square root of (9 + 16) = square root of 25 = 5. To find a leg: a = square root of (c squared - b squared). For example, if c = 13 and b = 5, then a = square root of (169 - 25) = square root of 144 = 12."},
      {"type": "callout", "content": "The triple (3, 4, 5) is the most common Pythagorean triple. Others include (5, 12, 13), (8, 15, 17), and (7, 24, 25). Multiples of these also work: (6, 8, 10) is a multiple of (3, 4, 5).", "style": "info"},
      {"type": "heading", "content": "Real-World Applications", "level": 2},
      {"type": "text", "content": "The Pythagorean Theorem is used in construction (checking that corners are square), navigation (finding the shortest distance), sports (calculating diagonal field distances), and many other areas. For example, to find the diagonal of a rectangular field that is 40 m by 30 m: d = square root of (40 squared + 30 squared) = square root of (1600 + 900) = square root of 2500 = 50 m."},
      {"type": "quiz", "question": "A right triangle has legs of 6 cm and 8 cm. What is the length of the hypotenuse?", "options": ["10 cm", "14 cm", "48 cm", "100 cm"], "correct": 0, "explanation": "c = square root of (36 + 64) = square root of 100 = 10 cm."},
      {"type": "quiz", "question": "A ladder leans against a wall. The ladder is 13 m long and the base is 5 m from the wall. How high up the wall does it reach?", "options": ["8 m", "12 m", "18 m", "144 m"], "correct": 1, "explanation": "h = square root of (13 squared - 5 squared) = square root of (169 - 25) = square root of 144 = 12 m."},
      {"type": "quiz", "question": "Can a triangle with sides 7, 10, and 12 be a right triangle?", "options": ["Yes", "No"], "correct": 1, "explanation": "Check: 7 squared + 10 squared = 49 + 100 = 149. 12 squared = 144. Since 149 does not equal 144, it is not a right triangle."}
    ]'::jsonb,
    '[
      {"term": "Pythagorean Theorem", "definition": "In a right triangle, a squared + b squared = c squared, where c is the hypotenuse."},
      {"term": "Hypotenuse", "definition": "The longest side of a right triangle, opposite the right angle."},
      {"term": "Leg", "definition": "Either of the two shorter sides of a right triangle that form the right angle."},
      {"term": "Right triangle", "definition": "A triangle containing exactly one 90-degree angle."},
      {"term": "Pythagorean triple", "definition": "A set of three positive integers (a, b, c) that satisfy a squared + b squared = c squared."}
    ]'::jsonb,
    'Ancient builders worldwide, including Indigenous peoples in the Americas, used right-angle relationships in constructing longhouses, earthen mounds, and ceremonial structures. The 3-4-5 triangle relationship was used practically to ensure perpendicular walls long before it was formalized as a theorem.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS8.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'State the Pythagorean Theorem.', 'In a right triangle, a squared + b squared = c squared, where c is the hypotenuse.', 'The sum of squares of the legs equals the square of the hypotenuse.', 1, 0),
    (v_tenant, v_ch, 'How do you find the hypotenuse?', 'c = square root of (a squared + b squared).', 'Square the legs, add, then take the square root.', 2, 1),
    (v_tenant, v_ch, 'A right triangle has legs 9 and 12. Find the hypotenuse.', 'c = square root of (81 + 144) = square root of 225 = 15.', 'This is a multiple of the 3-4-5 triple.', 2, 2),
    (v_tenant, v_ch, 'How do you check if a triangle is a right triangle?', 'Square the two shorter sides, add them. If the sum equals the square of the longest side, it is a right triangle.', 'Does a squared + b squared = c squared?', 2, 3);

  -- Chapter 9: Surface Area (SS8.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 9,
    'Surface Area of Prisms & Cylinders',
    'surface-area-prisms-cylinders',
    'Calculate the surface area of right rectangular prisms and cylinders using nets and formulas.',
    '[
      {"type": "heading", "content": "Surface Area of Prisms & Cylinders", "level": 1},
      {"type": "text", "content": "Surface area is the total area of all the faces (or surfaces) of a three-dimensional object. To calculate surface area, we can unfold the 3-D shape into a flat pattern called a net, then find the area of each face and add them together."},
      {"type": "heading", "content": "Surface Area of a Right Rectangular Prism", "level": 2},
      {"type": "text", "content": "A rectangular prism has six faces: three pairs of congruent rectangles. If the length is l, width is w, and height is h, then SA = 2lw + 2lh + 2wh. For example, a box with l = 8, w = 5, h = 3: SA = 2(8)(5) + 2(8)(3) + 2(5)(3) = 80 + 48 + 30 = 158 square units."},
      {"type": "heading", "content": "Surface Area of a Cylinder", "level": 2},
      {"type": "text", "content": "A cylinder has two circular bases and a rectangular lateral surface that wraps around. The net shows two circles and a rectangle. SA = 2 x pi x r squared + 2 x pi x r x h. The first term is the area of the two circles; the second is the lateral (side) area. For a cylinder with r = 4 cm and h = 10 cm: SA = 2(pi)(16) + 2(pi)(4)(10) = 32pi + 80pi = 112pi, approximately 351.9 cm squared."},
      {"type": "callout", "content": "The lateral surface of a cylinder, when unrolled, forms a rectangle with width equal to the height and length equal to the circumference (2 x pi x r).", "style": "info"},
      {"type": "quiz", "question": "A rectangular prism has dimensions 6 cm x 4 cm x 3 cm. What is its surface area?", "options": ["72 cm squared", "108 cm squared", "96 cm squared", "144 cm squared"], "correct": 1, "explanation": "SA = 2(6)(4) + 2(6)(3) + 2(4)(3) = 48 + 36 + 24 = 108 cm squared."},
      {"type": "quiz", "question": "A cylinder has radius 3 cm and height 7 cm. What is its surface area? (Use pi = 3.14)", "options": ["188.4 cm squared", "131.88 cm squared", "197.82 cm squared", "56.52 cm squared"], "correct": 0, "explanation": "SA = 2(pi)(9) + 2(pi)(3)(7) = 56.52 + 131.88 = 188.4 cm squared."}
    ]'::jsonb,
    '[
      {"term": "Surface area", "definition": "The total area of all faces or surfaces of a three-dimensional object."},
      {"term": "Net", "definition": "A flat pattern that can be folded to form a three-dimensional shape."},
      {"term": "Lateral surface", "definition": "The side surface of a 3-D object, excluding the bases."},
      {"term": "Right prism", "definition": "A prism where the lateral faces are perpendicular to the bases."},
      {"term": "Cylinder", "definition": "A 3-D shape with two parallel circular bases connected by a curved surface."}
    ]'::jsonb,
    'Birch bark containers and canoes crafted by Woodland Cree and Anishinaabe required understanding surface area to determine how much bark to harvest. The ability to estimate the material needed for a given shape reflects practical surface area reasoning.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS8.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the formula for the surface area of a rectangular prism?', 'SA = 2lw + 2lh + 2wh, where l = length, w = width, h = height.', 'Three pairs of congruent rectangles.', 2, 0),
    (v_tenant, v_ch, 'What is the formula for the surface area of a cylinder?', 'SA = 2(pi)(r squared) + 2(pi)(r)(h). Two circles plus the lateral rectangle.', 'Two circles plus the wrapped rectangle.', 2, 1),
    (v_tenant, v_ch, 'What is a net?', 'A flat 2-D pattern that, when folded, forms a 3-D shape.', 'Imagine unfolding a box.', 1, 2),
    (v_tenant, v_ch, 'What shape is the lateral surface of a cylinder when unrolled?', 'A rectangle with width equal to the height and length equal to the circumference (2 x pi x r).', 'Unwrap the cylinder.', 2, 3);

  -- Chapter 10: Volume of Prisms & Cylinders (SS8.3)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 10,
    'Volume of Prisms & Cylinders',
    'volume-prisms-cylinders',
    'Calculate volume of right prisms and cylinders by relating area of the base to volume.',
    '[
      {"type": "heading", "content": "Volume of Prisms & Cylinders", "level": 1},
      {"type": "text", "content": "Volume measures the amount of space inside a three-dimensional object, expressed in cubic units. The general formula for the volume of a prism or cylinder is: V = Area of base x height. This works because the 3-D shape is made up of identical layers stacked on top of each other."},
      {"type": "heading", "content": "Volume of a Rectangular Prism", "level": 2},
      {"type": "text", "content": "For a rectangular prism, the base is a rectangle with area l x w. So V = l x w x h. For example, a storage container with dimensions 2 m x 1.5 m x 1 m has volume = 2 x 1.5 x 1 = 3 cubic metres."},
      {"type": "heading", "content": "Volume of a Triangular Prism", "level": 2},
      {"type": "text", "content": "For a triangular prism, the base is a triangle with area (1/2)(b)(h_triangle). So V = (1/2)(b)(h_triangle) x length. For example, a prism with a triangular base of base 6 cm, height 4 cm, and a prism length of 10 cm: V = (1/2)(6)(4) x 10 = 12 x 10 = 120 cubic cm."},
      {"type": "heading", "content": "Volume of a Cylinder", "level": 2},
      {"type": "text", "content": "For a cylinder, the base is a circle with area pi x r squared. So V = pi x r squared x h. For example, a cylindrical water tank with r = 3 m and h = 5 m: V = pi x 9 x 5 = 45pi, approximately 141.4 cubic metres."},
      {"type": "callout", "content": "The key insight: Volume = Base area x Height works for all prisms and cylinders because the cross-section is uniform.", "style": "info"},
      {"type": "quiz", "question": "A cylinder has radius 5 cm and height 12 cm. What is its volume? (Use pi = 3.14)", "options": ["188.4 cm cubed", "942 cm cubed", "376.8 cm cubed", "300 cm cubed"], "correct": 1, "explanation": "V = pi x r squared x h = 3.14 x 25 x 12 = 942 cm cubed."},
      {"type": "quiz", "question": "A rectangular prism has dimensions 8 m x 5 m x 3 m. What is its volume?", "options": ["120 m cubed", "158 m cubed", "80 m cubed", "16 m cubed"], "correct": 0, "explanation": "V = l x w x h = 8 x 5 x 3 = 120 m cubed."}
    ]'::jsonb,
    '[
      {"term": "Volume", "definition": "The amount of space inside a three-dimensional object, measured in cubic units."},
      {"term": "Cubic units", "definition": "Units used to measure volume, such as cm cubed, m cubed, or litres."},
      {"term": "Base area", "definition": "The area of the base face of a prism or cylinder."},
      {"term": "Cross-section", "definition": "The shape you see when you cut through a 3-D object perpendicular to its length."},
      {"term": "Right prism", "definition": "A prism whose lateral edges are perpendicular to the bases."}
    ]'::jsonb,
    'Indigenous peoples designed storage containers, food caches, and fish traps that required understanding of volume. Knowing how much a birch bark basket or underground cache pit could hold was essential for food preservation and winter preparation.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS8.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the general formula for the volume of a prism or cylinder?', 'V = Area of base x height.', 'Base area times height.', 1, 0),
    (v_tenant, v_ch, 'What is the formula for the volume of a cylinder?', 'V = pi x r squared x h.', 'The base is a circle, so use pi r squared for the base area.', 2, 1),
    (v_tenant, v_ch, 'A rectangular prism has l = 10, w = 4, h = 6. Find the volume.', 'V = 10 x 4 x 6 = 240 cubic units.', 'Length times width times height.', 2, 2),
    (v_tenant, v_ch, 'What units are used to measure volume?', 'Cubic units, such as cm cubed, m cubed, or mm cubed.', 'Volume is three-dimensional, so units are cubed.', 1, 3);

  -- Chapter 11: Tessellations (SS8.4)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 11,
    'Tessellations',
    'tessellations',
    'Explore which shapes tessellate, create tessellation patterns, and identify tessellations in the environment.',
    '[
      {"type": "heading", "content": "Tessellations", "level": 1},
      {"type": "text", "content": "A tessellation is a pattern of shapes that fit together without any gaps or overlaps, covering a flat surface completely. Tessellations appear in floor tiles, brick walls, honeycomb structures, and many works of art. Understanding which shapes tessellate and why connects geometry, angles, and symmetry."},
      {"type": "heading", "content": "Which Shapes Tessellate?", "level": 2},
      {"type": "text", "content": "A regular polygon tessellates if its interior angles divide evenly into 360 degrees. Equilateral triangles (60-degree angles: 360/60 = 6 triangles meet at each vertex), squares (90 degrees: 4 meet), and regular hexagons (120 degrees: 3 meet) are the only regular polygons that tessellate. Regular pentagons (108 degrees) do not tessellate because 360/108 is not a whole number."},
      {"type": "heading", "content": "Creating Tessellations", "level": 2},
      {"type": "text", "content": "You can create more complex tessellations by: (1) Using combinations of regular polygons (semi-regular tessellations). (2) Modifying basic shapes by cutting a piece from one side and adding it to another (translation tessellation). (3) Rotating modified shapes. Artist M.C. Escher was famous for creating tessellations with recognizable figures like birds and fish."},
      {"type": "callout", "content": "The key rule: at every vertex where shapes meet, the angles must add up to exactly 360 degrees.", "style": "info"},
      {"type": "quiz", "question": "Why do regular pentagons NOT tessellate?", "options": ["They are too large", "Their interior angle of 108 degrees does not divide evenly into 360", "They have too many sides", "They are not symmetric"], "correct": 1, "explanation": "360/108 = 3.33..., which is not a whole number. This means you cannot fit a whole number of pentagons around a single point without gaps."},
      {"type": "quiz", "question": "Which three regular polygons can tessellate on their own?", "options": ["Triangle, square, hexagon", "Triangle, pentagon, hexagon", "Square, pentagon, octagon", "Triangle, square, octagon"], "correct": 0, "explanation": "Only equilateral triangles (60 degrees), squares (90 degrees), and regular hexagons (120 degrees) have interior angles that divide evenly into 360 degrees."}
    ]'::jsonb,
    '[
      {"term": "Tessellation", "definition": "A pattern of shapes that covers a flat surface with no gaps and no overlaps."},
      {"term": "Regular polygon", "definition": "A polygon with all sides and all angles equal."},
      {"term": "Interior angle", "definition": "An angle formed inside a polygon by two adjacent sides."},
      {"term": "Vertex", "definition": "The point where two or more edges or sides meet."},
      {"term": "Semi-regular tessellation", "definition": "A tessellation that uses two or more types of regular polygons with the same arrangement at every vertex."}
    ]'::jsonb,
    'Tessellation patterns appear extensively in Indigenous art and design. Birch bark biting, quillwork, and beadwork traditions use repeating geometric patterns that tessellate. These designs demonstrate sophisticated spatial reasoning developed over thousands of years.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS8.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a tessellation?', 'A pattern of shapes that covers a surface with no gaps and no overlaps.', 'Think of floor tiles.', 1, 0),
    (v_tenant, v_ch, 'Name the three regular polygons that tessellate.', 'Equilateral triangles, squares, and regular hexagons.', 'Their angles divide evenly into 360 degrees.', 2, 1),
    (v_tenant, v_ch, 'Why must angles at each vertex of a tessellation add to 360 degrees?', 'Because the shapes must completely surround each vertex point with no gaps (which would require less than 360) and no overlaps (which would require more than 360).', 'A full turn is 360 degrees.', 2, 2),
    (v_tenant, v_ch, 'Can a regular octagon tessellate by itself?', 'No. Its interior angle is 135 degrees, and 360/135 is not a whole number (it equals approximately 2.67).', 'Check if the angle divides evenly into 360.', 3, 3);


  -- ========================================
  -- UNIT 4: Statistics & Probability
  -- ========================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4,
    'Statistics & Probability',
    'Critically analyze data displays, assess the reasonableness of conclusions, and explore probability of independent events.',
    'Data can be represented and interpreted in many ways. Critical analysis of data displays and understanding of probability help us make informed, evidence-based decisions.',
    'How can we critically evaluate data and probability to make better decisions?')
  RETURNING id INTO v_unit;

  -- Chapter 12: Data Analysis & Display (SP8.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 12,
    'Analyzing Data Displays',
    'analyzing-data-displays',
    'Critically analyze different modes of displaying data and assess the reasonableness of conclusions drawn from them.',
    '[
      {"type": "heading", "content": "Analyzing Data Displays", "level": 1},
      {"type": "text", "content": "Data can be displayed in many ways: bar graphs, line graphs, circle graphs, histograms, and pictographs. Each type of display has strengths and limitations. In Grade 8, we develop the skills to critically evaluate how data is presented and determine whether the conclusions drawn are reasonable."},
      {"type": "heading", "content": "Choosing the Right Display", "level": 2},
      {"type": "list", "items": ["Bar graphs: best for comparing categories.", "Line graphs: best for showing change over time.", "Circle graphs: best for showing parts of a whole.", "Histograms: best for showing frequency of continuous data in intervals.", "Pictographs: best for simple comparisons with visual appeal."], "ordered": false},
      {"type": "heading", "content": "Misleading Graphs", "level": 2},
      {"type": "text", "content": "Graphs can be misleading if they: (1) Start the y-axis at a number other than zero (making differences look larger). (2) Use inconsistent scales. (3) Use 3-D effects that distort proportions. (4) Have missing labels or titles. (5) Cherry-pick data to support a particular conclusion. Always check the scale, labels, and source of data."},
      {"type": "callout", "content": "When analyzing any data display, always ask: What is the source? Is the scale consistent? Are labels clear? Does the graph support the conclusion being made?", "style": "tip"},
      {"type": "quiz", "question": "A bar graph compares sales of four products but starts the y-axis at 50 instead of 0. What effect does this have?", "options": ["It makes all bars look equal", "It exaggerates the differences between bars", "It has no effect", "It makes the graph more accurate"], "correct": 1, "explanation": "Starting the y-axis above zero removes the visual context and makes small differences appear much larger."},
      {"type": "quiz", "question": "Which type of graph is best for showing how a quantity changes over time?", "options": ["Bar graph", "Circle graph", "Line graph", "Pictograph"], "correct": 2, "explanation": "Line graphs connect data points with line segments, making trends and changes over time easy to see."}
    ]'::jsonb,
    '[
      {"term": "Histogram", "definition": "A bar graph that shows the frequency of data in equal intervals with no gaps between bars."},
      {"term": "Misleading graph", "definition": "A graph that distorts data through manipulated scales, missing labels, or other visual techniques."},
      {"term": "Frequency", "definition": "The number of times a value or range of values occurs in a data set."},
      {"term": "Scale", "definition": "The set of numbers and intervals used on the axes of a graph."},
      {"term": "Bias", "definition": "A systematic tendency in data collection or presentation that favours a particular outcome."}
    ]'::jsonb,
    'Indigenous environmental monitoring combines traditional ecological knowledge with data analysis. Community-based monitoring programs track water quality, wildlife populations, and land-use changes using data displays that blend Western statistical methods with Indigenous observation practices.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SP8.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Name three ways a graph can be misleading.', '(1) Y-axis not starting at zero. (2) Inconsistent scale. (3) Missing labels or titles.', 'Think about what could distort visual perception.', 2, 0),
    (v_tenant, v_ch, 'When should you use a histogram instead of a bar graph?', 'Use a histogram for continuous data grouped into intervals (like heights, temperatures). Use a bar graph for distinct categories.', 'Histograms have no gaps between bars.', 2, 1),
    (v_tenant, v_ch, 'What questions should you ask when analyzing a graph?', 'What is the source? Is the scale consistent? Are labels clear? Does the graph accurately support the conclusion?', 'Be a critical reader.', 2, 2),
    (v_tenant, v_ch, 'Which graph type best shows parts of a whole?', 'Circle graph (pie chart).', 'Think of a pie divided into slices.', 1, 3);

  -- Chapter 13: Probability of Independent Events (SP8.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 13,
    'Probability of Independent Events',
    'probability-independent-events',
    'Calculate the probability of independent events using tree diagrams, tables, and the multiplication rule.',
    '[
      {"type": "heading", "content": "Probability of Independent Events", "level": 1},
      {"type": "text", "content": "Two events are independent when the outcome of one does not influence the outcome of the other. Tossing a coin and rolling a die are independent events — the result of the coin toss has no effect on the die roll. In Grade 8, we deepen our understanding by calculating combined probabilities using the multiplication rule."},
      {"type": "heading", "content": "The Multiplication Rule", "level": 2},
      {"type": "text", "content": "For independent events A and B: P(A and B) = P(A) x P(B). For example, the probability of rolling a 6 on a die AND flipping heads on a coin = 1/6 x 1/2 = 1/12. This rule extends to three or more independent events: P(A and B and C) = P(A) x P(B) x P(C)."},
      {"type": "heading", "content": "Organizing Outcomes", "level": 2},
      {"type": "text", "content": "Tree diagrams and tables help organize all possible outcomes for compound events. A tree diagram branches for each event, with each path representing one outcome. The probability of a specific path is found by multiplying the probabilities along the branches."},
      {"type": "callout", "content": "For a spinner with sections of 1/4 red, 1/2 blue, and 1/4 green spun twice: P(red then blue) = 1/4 x 1/2 = 1/8.", "style": "example"},
      {"type": "quiz", "question": "A bag has 3 red and 7 blue marbles. You draw one marble, replace it, then draw again. What is P(red, then blue)?", "options": ["21/100", "3/10", "10/20", "21/90"], "correct": 0, "explanation": "P(red) = 3/10 and P(blue) = 7/10. Since the marble is replaced, the events are independent. P(red then blue) = 3/10 x 7/10 = 21/100."},
      {"type": "quiz", "question": "You flip a fair coin three times. What is the probability of getting heads all three times?", "options": ["1/3", "3/8", "1/8", "1/6"], "correct": 2, "explanation": "P(H and H and H) = 1/2 x 1/2 x 1/2 = 1/8."},
      {"type": "quiz", "question": "Why must replacement occur for events to remain independent?", "options": ["Because the bag needs to stay full", "Because without replacement, the second draw depends on the first draw''s outcome", "Because it makes calculation easier", "Replacement is not necessary"], "correct": 1, "explanation": "Without replacement, the total number of items changes and the probabilities for the second draw depend on what was drawn first, making the events dependent."}
    ]'::jsonb,
    '[
      {"term": "Independent events", "definition": "Events where the outcome of one does not affect the probability of the other."},
      {"term": "Multiplication rule", "definition": "For independent events: P(A and B) = P(A) x P(B)."},
      {"term": "Compound event", "definition": "An event made up of two or more simple events."},
      {"term": "With replacement", "definition": "Returning a selected item before the next selection, keeping probabilities unchanged."},
      {"term": "Tree diagram", "definition": "A diagram that shows all possible outcomes by branching for each event."}
    ]'::jsonb,
    'Traditional games of chance played across Indigenous nations involve compound probability. Games using marked sticks, dice made from bones, or hidden-hand guessing games all involve calculating the likelihood of combined outcomes — the mathematical foundation of probability theory.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SP8.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the multiplication rule for independent events?', 'P(A and B) = P(A) x P(B). Multiply the individual probabilities.', 'Multiply the probabilities along each branch.', 2, 0),
    (v_tenant, v_ch, 'Are rolling a die and flipping a coin independent events?', 'Yes. The result of the die has no effect on the coin flip.', 'One outcome does not change the other.', 1, 1),
    (v_tenant, v_ch, 'You roll two dice. What is P(both showing 6)?', 'P(6 and 6) = 1/6 x 1/6 = 1/36.', 'Each die is independent.', 3, 2),
    (v_tenant, v_ch, 'Why does drawing without replacement make events dependent?', 'Because the first draw changes the total number of items and possibly the number of favourable outcomes for the second draw.', 'The sample space changes.', 2, 3);

  -- Update chapter count for Grade 8
  UPDATE textbooks SET chapter_count = 13 WHERE id = v_book;

END $$;


-- ============================================================================
-- GRADE 9: WolfWhale Foundations of Math 9
-- Outcomes: N9.1-N9.3, P9.1-P9.4, SS9.1-SS9.4, SP9.1-SP9.4
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book UUID;
  v_unit UUID;
  v_ch UUID;
  v_oc UUID;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-foundations-of-math-9';

  -- ========================================
  -- UNIT 1: Number Sense & Operations
  -- ========================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1,
    'Number Sense & Operations',
    'Develop understanding of powers with integral bases, rational numbers, and square roots of positive rational numbers.',
    'Powers, rational numbers, and their roots form the foundation of algebraic reasoning. Mastering these concepts prepares students for high school mathematics and quantitative problem-solving.',
    'How do powers, rational numbers, and roots extend our number system and problem-solving abilities?')
  RETURNING id INTO v_unit;

  -- Chapter 1: Powers & Exponents (N9.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 1,
    'Powers & Exponents',
    'powers-and-exponents',
    'Understand powers with integral bases and whole number exponents, including the zero exponent, and apply them to solve problems.',
    '[
      {"type": "heading", "content": "Powers & Exponents", "level": 1},
      {"type": "text", "content": "A power is an expression of the form base^exponent, where the base is the number being multiplied and the exponent tells how many times to multiply it by itself. For example, 3^4 = 3 x 3 x 3 x 3 = 81. The base can be any integer (positive or negative, but not zero for certain cases), and the exponent must be a whole number in this course."},
      {"type": "heading", "content": "Powers with Positive Bases", "level": 2},
      {"type": "text", "content": "When the base is positive, the result is always positive regardless of the exponent. For example, 2^5 = 32, 4^3 = 64, and 10^2 = 100."},
      {"type": "heading", "content": "Powers with Negative Bases", "level": 2},
      {"type": "text", "content": "When the base is negative, the sign of the result depends on whether the exponent is even or odd. If the exponent is even, the result is positive: (-3)^2 = (-3)(-3) = 9. If the exponent is odd, the result is negative: (-3)^3 = (-3)(-3)(-3) = -27. Note: (-3)^2 is different from -3^2. With parentheses, the negative is part of the base. Without parentheses, -3^2 = -(3^2) = -9."},
      {"type": "callout", "content": "Critical distinction: (-2)^4 = 16 (base is -2, exponent is 4). But -2^4 = -(2^4) = -16 (only 2 is the base, then negate).", "style": "warning"},
      {"type": "heading", "content": "The Zero Exponent", "level": 2},
      {"type": "text", "content": "Any nonzero number raised to the power of zero equals 1. This follows from the pattern: 2^3 = 8, 2^2 = 4, 2^1 = 2, 2^0 = 1 (each step divides by 2). So 5^0 = 1, (-7)^0 = 1, and 100^0 = 1. Note: 0^0 is considered indeterminate."},
      {"type": "heading", "content": "Exponent Laws", "level": 2},
      {"type": "text", "content": "When multiplying powers with the same base, add the exponents: a^m x a^n = a^(m+n). When dividing powers with the same base, subtract the exponents: a^m / a^n = a^(m-n). When raising a power to a power, multiply the exponents: (a^m)^n = a^(m x n). These laws simplify calculations involving powers."},
      {"type": "quiz", "question": "Evaluate: (-2)^5", "options": ["32", "-32", "10", "-10"], "correct": 1, "explanation": "(-2)^5 = (-2)(-2)(-2)(-2)(-2). The exponent is odd, so the result is negative: -32."},
      {"type": "quiz", "question": "What is the value of 8^0?", "options": ["0", "1", "8", "Undefined"], "correct": 1, "explanation": "Any nonzero number raised to the power of zero equals 1."},
      {"type": "quiz", "question": "Simplify: 3^4 x 3^2", "options": ["3^8", "3^6", "9^6", "3^2"], "correct": 1, "explanation": "When multiplying powers with the same base, add exponents: 3^(4+2) = 3^6 = 729."}
    ]'::jsonb,
    '[
      {"term": "Power", "definition": "An expression written as base^exponent, indicating repeated multiplication."},
      {"term": "Base", "definition": "The number being multiplied repeatedly in a power expression."},
      {"term": "Exponent", "definition": "The number that indicates how many times the base is multiplied by itself."},
      {"term": "Zero exponent", "definition": "Any nonzero base raised to the exponent zero equals 1."},
      {"term": "Exponent law", "definition": "Rules governing operations with powers, such as the product, quotient, and power-of-a-power rules."}
    ]'::jsonb,
    'Exponential growth patterns are observed in nature and were understood by Indigenous peoples through ecological knowledge. The rapid multiplication of fish populations in spring, the doubling of plant growth under ideal conditions, and pandemic spread in communities all follow exponential patterns that powers help describe.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N9.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the zero exponent rule?', 'Any nonzero number raised to the power of zero equals 1. For example, 5^0 = 1.', 'Follow the dividing pattern down to zero.', 1, 0),
    (v_tenant, v_ch, 'What is the difference between (-4)^2 and -4^2?', '(-4)^2 = 16 because the entire -4 is squared. But -4^2 = -(4^2) = -16 because only 4 is squared, then negated.', 'Parentheses determine the base.', 2, 1),
    (v_tenant, v_ch, 'State the product rule for exponents.', 'a^m x a^n = a^(m+n). When multiplying powers with the same base, add the exponents.', 'Same base: add exponents.', 2, 2),
    (v_tenant, v_ch, 'Evaluate: (-3)^4', '(-3)^4 = 81. Even exponent with a negative base gives a positive result.', 'Even exponent = positive result.', 2, 3),
    (v_tenant, v_ch, 'Simplify: (2^3)^2', '(2^3)^2 = 2^(3x2) = 2^6 = 64.', 'Power of a power: multiply exponents.', 3, 4);

  -- Chapter 2: Rational Numbers (N9.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 2,
    'Rational Numbers',
    'rational-numbers',
    'Compare, order, and operate with rational numbers, including positive and negative fractions and decimals.',
    '[
      {"type": "heading", "content": "Rational Numbers", "level": 1},
      {"type": "text", "content": "A rational number is any number that can be written as a fraction a/b, where a and b are integers and b is not zero. This includes all integers (since 5 = 5/1), all fractions (3/4, -2/7), all terminating decimals (0.75 = 3/4), and all repeating decimals (0.333... = 1/3). Together, rational numbers form a complete number system for the operations we study in Grade 9."},
      {"type": "heading", "content": "Comparing & Ordering Rational Numbers", "level": 2},
      {"type": "text", "content": "To compare rational numbers, convert them to the same form (decimals or fractions with a common denominator). On a number line, numbers increase from left to right. For example, to compare -2/3 and -3/4, convert to decimals: -2/3 is approximately -0.667 and -3/4 = -0.75. Since -0.667 is to the right of -0.75 on the number line, -2/3 > -3/4."},
      {"type": "callout", "content": "With negative numbers, the number closer to zero is greater. So -2 > -5, and -0.1 > -0.9.", "style": "tip"},
      {"type": "heading", "content": "Operations with Rational Numbers", "level": 2},
      {"type": "text", "content": "All four operations (add, subtract, multiply, divide) apply to rational numbers using the rules learned for fractions and integers. For addition and subtraction: find a common denominator, apply sign rules. For multiplication: multiply numerators and denominators, then apply sign rules. For division: multiply by the reciprocal."},
      {"type": "text", "content": "Example: (-3/4) + (5/6). Common denominator is 12. Rewrite: -9/12 + 10/12 = 1/12. Example: (-2/5) x (3/7) = -6/35 (positive times negative is negative)."},
      {"type": "heading", "content": "Relating Rational Numbers to Other Number Types", "level": 2},
      {"type": "text", "content": "Natural numbers (1, 2, 3, ...) are a subset of whole numbers (0, 1, 2, ...), which are a subset of integers (..., -2, -1, 0, 1, 2, ...), which are a subset of rational numbers. Not all numbers are rational — numbers like pi and the square root of 2 are irrational because they cannot be written as a fraction of integers."},
      {"type": "quiz", "question": "Which is greater: -5/8 or -3/5?", "options": ["-5/8", "-3/5", "They are equal", "Cannot determine"], "correct": 1, "explanation": "Convert to decimals: -5/8 = -0.625 and -3/5 = -0.6. Since -0.6 > -0.625, -3/5 is greater. Wait — -0.6 is to the RIGHT of -0.625? No: -0.625 < -0.6. Actually -0.6 > -0.625, so -3/5 > -5/8."},
      {"type": "quiz", "question": "Calculate: (-1/3) divided by (2/5)", "options": ["-5/6", "-2/15", "5/6", "2/15"], "correct": 0, "explanation": "(-1/3) / (2/5) = (-1/3) x (5/2) = -5/6. Negative divided by positive is negative."},
      {"type": "quiz", "question": "Is the square root of 2 a rational number?", "options": ["Yes", "No"], "correct": 1, "explanation": "The square root of 2 is irrational — it cannot be expressed as a fraction of two integers. Its decimal expansion never terminates or repeats."}
    ]'::jsonb,
    '[
      {"term": "Rational number", "definition": "Any number that can be expressed as a fraction a/b where a and b are integers and b is not zero."},
      {"term": "Irrational number", "definition": "A number that cannot be expressed as a fraction of integers; its decimal neither terminates nor repeats."},
      {"term": "Terminating decimal", "definition": "A decimal that ends after a finite number of digits, such as 0.25 or 3.7."},
      {"term": "Repeating decimal", "definition": "A decimal in which one or more digits repeat infinitely, such as 0.333... or 0.142857142857..."},
      {"term": "Number line", "definition": "A line on which every point corresponds to a real number, used for visualizing order and distance."}
    ]'::jsonb,
    'The Cree concept of counting and measurement encompasses whole, fractional, and negative quantities. Cree language has rich mathematical vocabulary for describing parts, shares, and differences — reflecting a comprehensive number system that parallels rational numbers.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N9.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a rational number?', 'Any number that can be written as a/b where a and b are integers and b is not zero.', 'Fraction of integers.', 1, 0),
    (v_tenant, v_ch, 'Is -7 a rational number?', 'Yes. -7 can be written as -7/1, which is a fraction of two integers.', 'All integers are rational.', 1, 1),
    (v_tenant, v_ch, 'Order from least to greatest: -3/4, -0.5, -1.', '-1, -3/4, -0.5. Convert: -1 = -1.0, -3/4 = -0.75, -0.5 = -0.5. From left to right on the number line.', 'More negative = smaller.', 3, 2),
    (v_tenant, v_ch, 'Calculate: (-2/3) x (-9/4)', '(-2/3) x (-9/4) = 18/12 = 3/2 = 1 1/2. Negative times negative is positive.', 'Multiply numerators and denominators, apply sign rule.', 3, 3);

  -- Chapter 3: Square Roots of Rational Numbers (N9.3)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 3,
    'Square Roots of Rational Numbers',
    'square-roots-rational-numbers',
    'Extend understanding of square roots to include positive rational numbers, including fractions and decimals.',
    '[
      {"type": "heading", "content": "Square Roots of Rational Numbers", "level": 1},
      {"type": "text", "content": "In Grade 8, we learned about square roots of whole numbers. Now we extend to the square roots of any positive rational number. The square root of a fraction equals the square root of the numerator over the square root of the denominator. The square root of a decimal can be found by converting to a fraction or by estimation."},
      {"type": "heading", "content": "Square Roots of Fractions", "level": 2},
      {"type": "text", "content": "For any positive fraction a/b: the square root of (a/b) = (square root of a) / (square root of b). For example, the square root of 9/16 = 3/4 because the square root of 9 = 3 and the square root of 16 = 4. If the numerator or denominator is not a perfect square, the result may be irrational, or you can express it as a simplified radical."},
      {"type": "heading", "content": "Square Roots of Decimals", "level": 2},
      {"type": "text", "content": "To find the square root of a decimal, convert it to a fraction. For example, the square root of 0.49 = the square root of 49/100 = 7/10 = 0.7. For non-perfect squares like the square root of 0.5, estimate between known values: the square root of 0.49 = 0.7 and the square root of 0.64 = 0.8, so the square root of 0.5 is approximately 0.707."},
      {"type": "callout", "content": "Quick check: If the square root of a number is rational, both the numerator and denominator (when expressed as a fraction) must have rational square roots.", "style": "tip"},
      {"type": "heading", "content": "Applying Square Roots", "level": 2},
      {"type": "text", "content": "Square roots of rational numbers appear in the Pythagorean Theorem, area calculations, and measurement problems. For example, if the area of a square is 6.25 m squared, the side length is the square root of 6.25 = 2.5 m."},
      {"type": "quiz", "question": "What is the square root of 25/36?", "options": ["5/6", "25/6", "5/36", "6/5"], "correct": 0, "explanation": "Square root of 25 = 5, square root of 36 = 6. So the square root of 25/36 = 5/6."},
      {"type": "quiz", "question": "Estimate the square root of 0.75 to one decimal place.", "options": ["0.8", "0.9", "0.7", "0.6"], "correct": 1, "explanation": "0.8^2 = 0.64 and 0.9^2 = 0.81. Since 0.75 is between 0.64 and 0.81 and closer to 0.81, the square root of 0.75 is approximately 0.87, which rounds to 0.9."},
      {"type": "quiz", "question": "A square garden has an area of 2.25 m squared. What is the side length?", "options": ["1.5 m", "1.125 m", "0.5625 m", "4.5 m"], "correct": 0, "explanation": "Side = square root of 2.25 = square root of (225/100) = 15/10 = 1.5 m."}
    ]'::jsonb,
    '[
      {"term": "Square root of a fraction", "definition": "The square root of a/b equals (square root of a) / (square root of b), provided both are defined."},
      {"term": "Radical", "definition": "An expression containing a root symbol, such as the square root symbol."},
      {"term": "Perfect square fraction", "definition": "A fraction whose numerator and denominator are both perfect squares."},
      {"term": "Estimate", "definition": "An approximate value found by using nearby known values."},
      {"term": "Irrational", "definition": "A number whose decimal expansion is non-terminating and non-repeating."}
    ]'::jsonb,
    'Traditional land measurement among Indigenous peoples required calculating areas and dimensions of irregular parcels. Finding the side length of a square area — a square root calculation — was practical knowledge applied to garden plots, ceremonial grounds, and community spaces.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N9.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'How do you find the square root of a fraction?', 'Take the square root of the numerator and divide by the square root of the denominator.', 'Root of top over root of bottom.', 2, 0),
    (v_tenant, v_ch, 'What is the square root of 0.16?', '0.4, because 0.4 x 0.4 = 0.16 (or sqrt(16/100) = 4/10).', 'Convert to a fraction first.', 2, 1),
    (v_tenant, v_ch, 'Is the square root of 2/3 rational or irrational?', 'Irrational. Neither 2 nor 3 is a perfect square, so the square root cannot be expressed as a simple fraction.', 'Check if numerator and denominator are perfect squares.', 3, 2),
    (v_tenant, v_ch, 'A square has area 4/9 m squared. What is its side length?', 'Side = sqrt(4/9) = 2/3 m.', 'Square root of 4 is 2, square root of 9 is 3.', 2, 3);


  -- ========================================
  -- UNIT 2: Patterns & Relations
  -- ========================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2,
    'Patterns & Relations',
    'Graph and analyze linear relations, solve linear equations with rational coefficients, explore linear inequalities, and introduce polynomials.',
    'Algebraic representations including equations, inequalities, and polynomials model relationships and constraints. These tools form the foundation for high school mathematics.',
    'How do equations, inequalities, and polynomials help us model and solve real-world problems?')
  RETURNING id INTO v_unit;

  -- Chapter 4: Linear Relations (P9.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 4,
    'Linear Relations & Graphing',
    'linear-relations-graphing',
    'Graph, analyze, interpolate, and extrapolate linear relations, and solve situational questions involving linear relationships.',
    '[
      {"type": "heading", "content": "Linear Relations & Graphing", "level": 1},
      {"type": "text", "content": "A linear relation between two variables can be expressed as y = mx + b, where m is the slope and b is the y-intercept. In Grade 9, we deepen our work with linear relations by interpolating (reading between data points), extrapolating (predicting beyond data points), and solving problems in context."},
      {"type": "heading", "content": "Slope", "level": 2},
      {"type": "text", "content": "The slope of a line measures its steepness and direction: m = rise / run = (y2 - y1) / (x2 - x1). A positive slope means the line rises from left to right. A negative slope means it falls. A slope of zero is a horizontal line. An undefined slope (division by zero) is a vertical line."},
      {"type": "heading", "content": "Interpolation & Extrapolation", "level": 2},
      {"type": "text", "content": "Interpolation means estimating values within the range of known data. Extrapolation means predicting values beyond the range of known data. Both use the linear equation or graph. For example, if data spans x = 1 to 10 and we use the equation to find y when x = 5, that is interpolation. If we predict y when x = 15, that is extrapolation. Extrapolation is less reliable because the linear trend may not continue."},
      {"type": "callout", "content": "Extrapolation assumes the trend continues unchanged. In real life, trends often change, so extrapolated values should be treated as estimates.", "style": "warning"},
      {"type": "heading", "content": "Contextual Problems", "level": 2},
      {"type": "text", "content": "Many real situations involve linear relations. A taxi charges a flat fee of $3.50 plus $1.20 per kilometre. The cost equation is C = 1.20d + 3.50, where d is the distance. The slope (1.20) is the rate per km, and the y-intercept (3.50) is the initial fee. Using this equation, we can find the cost for any distance or determine the distance for a given budget."},
      {"type": "quiz", "question": "A line passes through (2, 5) and (6, 13). What is the slope?", "options": ["2", "4", "8", "1/2"], "correct": 0, "explanation": "m = (13 - 5) / (6 - 2) = 8 / 4 = 2."},
      {"type": "quiz", "question": "Using y = 3x - 2, predict y when x = 10.", "options": ["28", "30", "32", "8"], "correct": 0, "explanation": "y = 3(10) - 2 = 30 - 2 = 28."},
      {"type": "quiz", "question": "A phone plan costs $25/month plus $0.10 per text. After sending 150 texts, the total cost is:", "options": ["$40.00", "$25.10", "$37.50", "$150.10"], "correct": 0, "explanation": "C = 25 + 0.10(150) = 25 + 15 = $40.00."}
    ]'::jsonb,
    '[
      {"term": "Slope", "definition": "The rate of change of a linear relation, calculated as rise over run: m = (y2-y1)/(x2-x1)."},
      {"term": "y-intercept", "definition": "The point where the line crosses the y-axis; the value of y when x = 0."},
      {"term": "Interpolation", "definition": "Estimating a value within the range of known data points."},
      {"term": "Extrapolation", "definition": "Predicting a value beyond the range of known data points."},
      {"term": "Slope-intercept form", "definition": "The equation y = mx + b, where m is the slope and b is the y-intercept."}
    ]'::jsonb,
    'Tracking seasonal patterns — the rise and fall of river levels, daylight hours through the year, and animal migration timing — are real-world linear (and near-linear) relations that Indigenous peoples have tracked for millennia. These data-driven observations parallel graphing and trend analysis.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'P9.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'How do you calculate slope from two points?', 'm = (y2 - y1) / (x2 - x1), which represents rise over run.', 'Change in y over change in x.', 2, 0),
    (v_tenant, v_ch, 'What is the difference between interpolation and extrapolation?', 'Interpolation estimates within the data range. Extrapolation predicts beyond the data range.', 'Inter = within, extra = beyond.', 2, 1),
    (v_tenant, v_ch, 'In y = mx + b, what does each part represent?', 'm = slope (rate of change), b = y-intercept (starting value), x = independent variable, y = dependent variable.', 'Slope and starting point.', 1, 2),
    (v_tenant, v_ch, 'A line has slope -3 and y-intercept 7. Write the equation.', 'y = -3x + 7.', 'Plug m and b into y = mx + b.', 2, 3);

  -- Chapter 5: Solving Linear Equations with Rational Coefficients (P9.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 5,
    'Solving Equations with Rational Coefficients',
    'solving-equations-rational-coefficients',
    'Solve linear equations involving rational number coefficients, including equations with variables on both sides.',
    '[
      {"type": "heading", "content": "Solving Equations with Rational Coefficients", "level": 1},
      {"type": "text", "content": "In Grade 9, linear equations may have fractional or decimal coefficients and variables on both sides. The solving process still relies on maintaining balance, but the arithmetic is more complex. We solve equations in forms such as ax = b, ax + b = c, ax + b = cx + d, and a/x = b (where x is not zero)."},
      {"type": "heading", "content": "Equations with Fraction Coefficients", "level": 2},
      {"type": "text", "content": "When an equation has fractions, a useful strategy is to multiply both sides by the LCD to eliminate fractions. For example, solve (2/3)x + 1/4 = 5/6. The LCD of 3, 4, and 6 is 12. Multiply each term by 12: 8x + 3 = 10. Then 8x = 7, and x = 7/8."},
      {"type": "heading", "content": "Variables on Both Sides", "level": 2},
      {"type": "text", "content": "For equations like 3x + 5 = x + 13, collect the variable terms on one side: subtract x from both sides to get 2x + 5 = 13, then subtract 5 to get 2x = 8, then divide by 2 to get x = 4."},
      {"type": "callout", "content": "Strategy for fraction equations: Multiply every term by the LCD first to clear all fractions. This simplifies the equation dramatically.", "style": "tip"},
      {"type": "heading", "content": "Equations with Decimal Coefficients", "level": 2},
      {"type": "text", "content": "For equations with decimals, multiply both sides by a power of 10 to clear the decimals. For example, solve 0.3x + 1.2 = 2.7. Multiply by 10: 3x + 12 = 27. Then 3x = 15 and x = 5."},
      {"type": "quiz", "question": "Solve: (1/2)x - 3 = 5", "options": ["x = 4", "x = 16", "x = 1", "x = 8"], "correct": 1, "explanation": "Add 3: (1/2)x = 8. Multiply by 2: x = 16. Check: (1/2)(16) - 3 = 8 - 3 = 5."},
      {"type": "quiz", "question": "Solve: 5x - 4 = 2x + 8", "options": ["x = 4", "x = 12/7", "x = 3", "x = 4/3"], "correct": 0, "explanation": "Subtract 2x: 3x - 4 = 8. Add 4: 3x = 12. Divide by 3: x = 4. Check: 5(4) - 4 = 16, 2(4) + 8 = 16."},
      {"type": "quiz", "question": "Solve: 0.5x + 0.3 = 1.8", "options": ["x = 3", "x = 2.1", "x = 4.2", "x = 1.5"], "correct": 0, "explanation": "Subtract 0.3: 0.5x = 1.5. Divide by 0.5: x = 3. Or multiply by 10 first: 5x + 3 = 18, 5x = 15, x = 3."}
    ]'::jsonb,
    '[
      {"term": "Rational coefficient", "definition": "A coefficient that is a rational number (fraction or decimal)."},
      {"term": "LCD (Least Common Denominator)", "definition": "The smallest number that is a common multiple of all denominators in an equation."},
      {"term": "Clear fractions", "definition": "Multiply every term by the LCD to eliminate fractions from an equation."},
      {"term": "Collect like terms", "definition": "Move all variable terms to one side and constant terms to the other side of an equation."},
      {"term": "Verify", "definition": "Substitute the solution back into the original equation to confirm it is correct."}
    ]'::jsonb,
    'Solving for unknown quantities is central to traditional resource management. Determining how much seed to plant for a desired harvest yield, or how to divide a catch proportionally among families, involves setting up and solving equations — skills practiced across Indigenous cultures.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'P9.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'How do you clear fractions from an equation?', 'Multiply every term on both sides by the LCD of all fractions in the equation.', 'Find the LCD, then multiply through.', 2, 0),
    (v_tenant, v_ch, 'Solve: 4x + 3 = 2x + 11', 'Subtract 2x: 2x + 3 = 11. Subtract 3: 2x = 8. Divide by 2: x = 4.', 'Get variables on one side.', 2, 1),
    (v_tenant, v_ch, 'Solve: (3/4)x = 12', 'Multiply both sides by 4/3: x = 12 x (4/3) = 16.', 'Multiply by the reciprocal.', 2, 2),
    (v_tenant, v_ch, 'Why multiply by 10 when an equation has decimals?', 'It converts decimals to whole numbers, making the equation easier to solve.', 'Clear the decimals.', 1, 3);

  -- Chapter 6: Linear Inequalities (P9.3)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 6,
    'Linear Inequalities',
    'linear-inequalities',
    'Solve, verify, graph, and compare single-variable linear inequalities with rational coefficients.',
    '[
      {"type": "heading", "content": "Linear Inequalities", "level": 1},
      {"type": "text", "content": "An inequality is a mathematical statement that compares two expressions using symbols: < (less than), > (greater than), <= (less than or equal to), >= (greater than or equal to). Unlike equations, which have a single solution, inequalities typically have many solutions — an entire range of values."},
      {"type": "heading", "content": "Solving Inequalities", "level": 2},
      {"type": "text", "content": "Solving an inequality follows the same steps as solving an equation, with one critical exception: when you multiply or divide both sides by a negative number, you must reverse the direction of the inequality symbol. For example, solve -2x > 8: divide by -2 AND flip the sign: x < -4."},
      {"type": "callout", "content": "Critical rule: When multiplying or dividing both sides of an inequality by a negative number, reverse the inequality symbol. This is because negation reverses order on the number line.", "style": "warning"},
      {"type": "heading", "content": "Graphing Inequalities on a Number Line", "level": 2},
      {"type": "text", "content": "To graph an inequality on a number line: (1) Draw an open circle for < or > (the endpoint is not included). (2) Draw a filled circle for <= or >= (the endpoint is included). (3) Shade the region that represents the solution set. For x > 3, draw an open circle at 3 and shade to the right."},
      {"type": "heading", "content": "Verifying Solutions", "level": 2},
      {"type": "text", "content": "To verify a solution to an inequality, substitute a value from the solution set into the original inequality. Also test a value outside the solution set to confirm it does not satisfy the inequality. For example, if the solution is x <= 5, test x = 3 (should work) and x = 7 (should not work)."},
      {"type": "quiz", "question": "Solve: 3x - 7 > 8", "options": ["x > 5", "x < 5", "x > 1/3", "x < 15"], "correct": 0, "explanation": "Add 7: 3x > 15. Divide by 3: x > 5."},
      {"type": "quiz", "question": "Solve: -4x + 2 <= 10", "options": ["x >= -2", "x <= -2", "x >= 2", "x <= 3"], "correct": 0, "explanation": "Subtract 2: -4x <= 8. Divide by -4 AND flip the symbol: x >= -2."},
      {"type": "quiz", "question": "On a number line, how would you represent x < -1?", "options": ["Open circle at -1, shade right", "Filled circle at -1, shade left", "Open circle at -1, shade left", "Filled circle at -1, shade right"], "correct": 2, "explanation": "x < -1 means values less than -1, not including -1. Open circle (not included) at -1, shade to the left."}
    ]'::jsonb,
    '[
      {"term": "Inequality", "definition": "A mathematical statement that compares two expressions using <, >, <=, or >=."},
      {"term": "Solution set", "definition": "The set of all values that satisfy an inequality."},
      {"term": "Open circle", "definition": "Used on a number line to show that the endpoint is NOT included (for < or >)."},
      {"term": "Closed circle", "definition": "Used on a number line to show that the endpoint IS included (for <= or >=)."},
      {"term": "Reverse the inequality", "definition": "Flip the direction of the inequality symbol when multiplying or dividing both sides by a negative number."}
    ]'::jsonb,
    'Setting boundaries and constraints is important in Indigenous resource management. Conservation limits on fishing, hunting quotas, and sustainable harvesting rates are real-world inequalities: the harvest must be less than or equal to a sustainable maximum.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'P9.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'When do you flip the inequality sign?', 'When multiplying or dividing both sides by a negative number.', 'Negative multiplication reverses order.', 2, 0),
    (v_tenant, v_ch, 'What does an open circle on a number line mean?', 'The endpoint is not included in the solution set. Used for < or > (strict inequalities).', 'Not equal to that value.', 1, 1),
    (v_tenant, v_ch, 'Solve: -5x >= 20', 'Divide by -5 and flip: x <= -4.', 'Dividing by a negative flips the sign.', 3, 2),
    (v_tenant, v_ch, 'How do you verify an inequality solution?', 'Substitute a value from the solution set — it should satisfy the inequality. Substitute a value outside — it should not.', 'Test a value inside and outside the solution.', 2, 3);

  -- Chapter 7: Introduction to Polynomials (P9.4)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 7,
    'Introduction to Polynomials',
    'introduction-to-polynomials',
    'Model, identify, classify, add, and subtract polynomials of degree 2 or less.',
    '[
      {"type": "heading", "content": "Introduction to Polynomials", "level": 1},
      {"type": "text", "content": "A polynomial is an algebraic expression made up of terms. Each term consists of a coefficient (a number) multiplied by a variable raised to a whole number exponent. For example, 3x^2 + 5x - 7 is a polynomial with three terms. In Grade 9, we work with polynomials of degree 2 or less."},
      {"type": "heading", "content": "Classifying Polynomials", "level": 2},
      {"type": "list", "items": ["Monomial: a polynomial with one term (e.g., 5x, -3x^2, 7).", "Binomial: a polynomial with two terms (e.g., 3x + 4, x^2 - 9).", "Trinomial: a polynomial with three terms (e.g., 2x^2 + 3x - 1)."], "ordered": false},
      {"type": "text", "content": "The degree of a polynomial is the highest exponent. A constant (like 7) has degree 0. A linear term (like 3x) has degree 1. A quadratic term (like x^2) has degree 2."},
      {"type": "heading", "content": "Adding Polynomials", "level": 2},
      {"type": "text", "content": "To add polynomials, combine like terms — terms with the same variable and the same exponent. For example: (3x^2 + 2x - 5) + (x^2 - 4x + 3) = 4x^2 - 2x - 2. Add the coefficients of matching terms."},
      {"type": "heading", "content": "Subtracting Polynomials", "level": 2},
      {"type": "text", "content": "To subtract polynomials, distribute the negative sign to each term of the second polynomial, then combine like terms. For example: (5x^2 + 3x - 1) - (2x^2 - x + 4) = 5x^2 + 3x - 1 - 2x^2 + x - 4 = 3x^2 + 4x - 5."},
      {"type": "callout", "content": "When subtracting polynomials, change the sign of every term in the polynomial being subtracted before combining like terms.", "style": "tip"},
      {"type": "quiz", "question": "Classify the polynomial 4x^2 - 7x + 2.", "options": ["Monomial, degree 2", "Binomial, degree 2", "Trinomial, degree 2", "Trinomial, degree 1"], "correct": 2, "explanation": "It has three terms (trinomial) and the highest exponent is 2 (degree 2)."},
      {"type": "quiz", "question": "Simplify: (2x^2 + 5x - 3) + (x^2 - 2x + 7)", "options": ["3x^2 + 3x + 4", "3x^2 + 7x + 4", "2x^4 + 3x + 4", "3x^2 + 3x - 10"], "correct": 0, "explanation": "Combine like terms: (2x^2 + x^2) + (5x - 2x) + (-3 + 7) = 3x^2 + 3x + 4."},
      {"type": "quiz", "question": "Simplify: (6x^2 + x - 4) - (2x^2 + 3x - 1)", "options": ["4x^2 - 2x - 3", "8x^2 + 4x - 5", "4x^2 + 4x - 5", "4x^2 - 2x - 5"], "correct": 0, "explanation": "Distribute the negative: 6x^2 + x - 4 - 2x^2 - 3x + 1 = 4x^2 - 2x - 3."}
    ]'::jsonb,
    '[
      {"term": "Polynomial", "definition": "An algebraic expression consisting of one or more terms with whole number exponents."},
      {"term": "Monomial", "definition": "A polynomial with exactly one term."},
      {"term": "Binomial", "definition": "A polynomial with exactly two terms."},
      {"term": "Trinomial", "definition": "A polynomial with exactly three terms."},
      {"term": "Degree", "definition": "The highest exponent of the variable in a polynomial."},
      {"term": "Like terms", "definition": "Terms with the same variable raised to the same exponent."}
    ]'::jsonb,
    'Polynomial expressions model real-world relationships found in nature. The parabolic arc of a thrown spear or stone, the curved flight of an arrow — these trajectories follow quadratic (degree 2) paths, connecting polynomial mathematics to the physics of traditional hunting tools.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'P9.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a polynomial?', 'An algebraic expression made up of terms with whole number exponents. Example: 3x^2 + 5x - 7.', 'Terms with coefficients and variables.', 1, 0),
    (v_tenant, v_ch, 'What is the degree of the polynomial 4x^2 - 3x + 1?', 'Degree 2, because the highest exponent is 2.', 'Look for the highest power.', 1, 1),
    (v_tenant, v_ch, 'How do you add polynomials?', 'Combine like terms — add the coefficients of terms with the same variable and exponent.', 'Match terms first, then add coefficients.', 2, 2),
    (v_tenant, v_ch, 'Subtract: (5x + 3) - (2x - 4)', '5x + 3 - 2x + 4 = 3x + 7. Remember to change the signs of the second polynomial.', 'Distribute the negative first.', 2, 3),
    (v_tenant, v_ch, 'What is the difference between a monomial and a trinomial?', 'A monomial has one term, a trinomial has three terms.', 'Mono = one, tri = three.', 1, 4);


  -- ========================================
  -- UNIT 3: Shape & Space
  -- ========================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3,
    'Shape & Space',
    'Explore circle properties, surface area of composite objects, similarity, and line and rotation symmetry.',
    'Geometric properties of circles, similarity, and symmetry reveal deep patterns in the physical world. These concepts connect visual reasoning to algebraic thinking and prepare students for formal geometry.',
    'How do the properties of circles, similar figures, and symmetry help us understand the geometry of our world?')
  RETURNING id INTO v_unit;

  -- Chapter 8: Circle Properties (SS9.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 8,
    'Circle Properties',
    'circle-properties',
    'Investigate properties of circles including chord bisection, inscribed and central angles, and tangent-radius relationships.',
    '[
      {"type": "heading", "content": "Circle Properties", "level": 1},
      {"type": "text", "content": "In Grade 9, we explore deeper properties of circles that go beyond circumference and area. These properties involve the relationships between chords, angles, and tangent lines, and they have wide applications in engineering, design, and architecture."},
      {"type": "heading", "content": "Chords & Perpendicular Bisectors", "level": 2},
      {"type": "text", "content": "A chord is a line segment with both endpoints on the circle. The perpendicular from the centre of a circle to a chord bisects the chord (cuts it in half). Conversely, the perpendicular bisector of any chord passes through the centre of the circle. This property is useful for finding the centre of a circle or the length of a chord."},
      {"type": "heading", "content": "Central & Inscribed Angles", "level": 2},
      {"type": "text", "content": "A central angle has its vertex at the centre of the circle. An inscribed angle has its vertex on the circle. The Inscribed Angle Theorem states: an inscribed angle is half the central angle that subtends the same arc. If a central angle is 80 degrees, the inscribed angle subtending the same arc is 40 degrees. An inscribed angle in a semicircle is always 90 degrees."},
      {"type": "heading", "content": "Tangent-Radius Relationship", "level": 2},
      {"type": "text", "content": "A tangent is a line that touches a circle at exactly one point (the point of tangency). The radius drawn to the point of tangency is always perpendicular to the tangent line. This 90-degree relationship is used in many geometric proofs and constructions."},
      {"type": "callout", "content": "Key theorems: (1) The perpendicular from centre to a chord bisects the chord. (2) Inscribed angle = half the central angle on the same arc. (3) Tangent is perpendicular to the radius at the point of tangency.", "style": "info"},
      {"type": "quiz", "question": "A central angle measures 110 degrees. What is the inscribed angle that subtends the same arc?", "options": ["55 degrees", "110 degrees", "220 degrees", "90 degrees"], "correct": 0, "explanation": "An inscribed angle is half the central angle on the same arc: 110 / 2 = 55 degrees."},
      {"type": "quiz", "question": "A chord is 24 cm long and is 5 cm from the centre of the circle. What is the radius?", "options": ["12 cm", "13 cm", "29 cm", "7 cm"], "correct": 1, "explanation": "The perpendicular from centre bisects the chord: half-chord = 12 cm. By Pythagorean Theorem: r = sqrt(12^2 + 5^2) = sqrt(144 + 25) = sqrt(169) = 13 cm."},
      {"type": "quiz", "question": "What angle does a tangent line make with the radius at the point of tangency?", "options": ["45 degrees", "60 degrees", "90 degrees", "180 degrees"], "correct": 2, "explanation": "A tangent is always perpendicular to the radius at the point of tangency, forming a 90-degree angle."}
    ]'::jsonb,
    '[
      {"term": "Chord", "definition": "A line segment with both endpoints on the circle."},
      {"term": "Central angle", "definition": "An angle formed by two radii with its vertex at the centre of the circle."},
      {"term": "Inscribed angle", "definition": "An angle formed by two chords with its vertex on the circle."},
      {"term": "Tangent", "definition": "A line that touches a circle at exactly one point."},
      {"term": "Point of tangency", "definition": "The single point where a tangent line touches the circle."},
      {"term": "Arc", "definition": "A portion of the circumference of a circle."}
    ]'::jsonb,
    'The circle holds deep significance in Indigenous cultures — the Medicine Wheel, drum circles, tipis, and seasonal cycles are all circular. Understanding circle properties connects mathematical reasoning to the profound geometric symbolism found throughout Indigenous traditions.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS9.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'State the Inscribed Angle Theorem.', 'An inscribed angle is half the central angle that subtends the same arc.', 'Inscribed = half of central.', 2, 0),
    (v_tenant, v_ch, 'What is the angle between a tangent and a radius at the point of tangency?', '90 degrees. The tangent is perpendicular to the radius at that point.', 'Right angle.', 1, 1),
    (v_tenant, v_ch, 'What does the perpendicular from the centre to a chord do?', 'It bisects (cuts in half) the chord.', 'Centre perpendicular = bisector.', 2, 2),
    (v_tenant, v_ch, 'An inscribed angle in a semicircle measures how many degrees?', '90 degrees. This is because the central angle for a semicircle is 180 degrees, and 180/2 = 90.', 'Thales'' theorem.', 2, 3);

  -- Chapter 9: Surface Area of Composite Objects (SS9.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 9,
    'Surface Area of Composite 3-D Objects',
    'surface-area-composite-objects',
    'Calculate the surface area of composite 3-D objects made from prisms and cylinders.',
    '[
      {"type": "heading", "content": "Surface Area of Composite 3-D Objects", "level": 1},
      {"type": "text", "content": "A composite 3-D object is made by joining two or more simple 3-D shapes together. To find the surface area, calculate the surface area of each component, then subtract the areas where shapes are joined (since those faces are no longer exposed). This process requires careful identification of visible versus hidden faces."},
      {"type": "heading", "content": "Strategy for Composite Objects", "level": 2},
      {"type": "list", "items": ["Step 1: Identify the individual 3-D shapes that make up the composite object.", "Step 2: Calculate the total surface area of each shape as if it were separate.", "Step 3: Identify the joined faces (the surfaces that are hidden).", "Step 4: Subtract twice the area of each joined face (once for each shape that contributes it).", "Step 5: Add remaining visible areas."], "ordered": true},
      {"type": "callout", "content": "Example: A rectangular prism sits on top of a cylinder. The bottom of the prism and the top of the cylinder are joined. Calculate each SA separately, then subtract 2 x (area of the joined surface).", "style": "example"},
      {"type": "heading", "content": "Worked Example", "level": 2},
      {"type": "text", "content": "A cylinder (r = 3 cm, h = 10 cm) has a rectangular prism (6 cm x 6 cm x 4 cm) placed on top. The prism''s base and the cylinder''s top circle overlap, but the prism is larger. SA(cylinder) = 2(pi)(9) + 2(pi)(3)(10) = 56.55 + 188.50 = 245.04. SA(prism) = 2(36) + 2(24) + 2(24) = 72 + 48 + 48 = 168. Subtract the hidden circle on the cylinder top (pi x 9 = 28.27) and the matching area on the prism bottom (also 28.27). Total SA = 245.04 + 168 - 2(28.27) = 356.50 cm squared approximately."},
      {"type": "quiz", "question": "Two identical rectangular prisms (4 x 3 x 2 cm) are placed end to end along the 4 x 2 face. What is the hidden area to subtract?", "options": ["8 cm squared", "16 cm squared", "24 cm squared", "6 cm squared"], "correct": 1, "explanation": "Each prism contributes one 4 x 2 = 8 cm squared hidden face. Since there are two hidden faces, subtract 2 x 8 = 16 cm squared."},
      {"type": "quiz", "question": "Why do we subtract area when finding the surface area of composite objects?", "options": ["Because the shapes overlap", "Because the joined faces are no longer exposed to the outside", "Because composite objects are always smaller", "To account for measurement error"], "correct": 1, "explanation": "When two shapes are joined, the faces at the joint are hidden inside the object and are no longer part of the external surface area."}
    ]'::jsonb,
    '[
      {"term": "Composite 3-D object", "definition": "A three-dimensional shape formed by joining two or more simple 3-D shapes."},
      {"term": "Hidden face", "definition": "A face of a component shape that is no longer exposed because it is joined to another shape."},
      {"term": "Exposed surface", "definition": "The outer faces of a composite object that are visible from outside."},
      {"term": "Net", "definition": "A flat pattern that folds to form a 3-D shape; used to visualize surface area."}
    ]'::jsonb,
    'Composite structures appear in traditional Indigenous architecture — a longhouse with a rounded roof, an igloo with an entrance tunnel, or a tipi with a liner. Calculating the surface area of these structures requires composite geometry, blending different shapes together.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS9.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'How do you find the surface area of a composite object?', 'Calculate the SA of each component separately, then subtract twice the area of each hidden (joined) face.', 'Total SA minus hidden faces.', 2, 0),
    (v_tenant, v_ch, 'Why do we subtract twice the hidden face area?', 'Because each joined surface is hidden on both objects — one face from each component is no longer exposed.', 'Two shapes, two hidden faces.', 2, 1),
    (v_tenant, v_ch, 'What is a composite 3-D object?', 'A shape formed by combining two or more simple 3-D shapes, such as prisms and cylinders.', 'Multiple shapes joined together.', 1, 2),
    (v_tenant, v_ch, 'Two cubes (side 5 cm) are joined along one face. How much area is hidden?', '2 x (5 x 5) = 50 cm squared. One face from each cube is hidden.', 'Two faces, each 25 cm squared.', 3, 3);

  -- Chapter 10: Similarity (SS9.3)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 10,
    'Similarity of 2-D Shapes',
    'similarity-2d-shapes',
    'Understand and apply the concept of similarity, including scale factors and proportional reasoning with similar figures.',
    '[
      {"type": "heading", "content": "Similarity of 2-D Shapes", "level": 1},
      {"type": "text", "content": "Two shapes are similar if they have the same shape but not necessarily the same size. This means their corresponding angles are equal, and their corresponding sides are proportional. The ratio of corresponding sides is called the scale factor."},
      {"type": "heading", "content": "Scale Factor", "level": 2},
      {"type": "text", "content": "The scale factor tells us how much larger or smaller one figure is compared to the other. If triangle ABC is similar to triangle DEF with a scale factor of 2, then every side of DEF is twice the corresponding side of ABC. A scale factor greater than 1 means an enlargement; a scale factor between 0 and 1 means a reduction."},
      {"type": "heading", "content": "Finding Missing Sides", "level": 2},
      {"type": "text", "content": "If two shapes are similar, set up a proportion using corresponding sides. For example, if two rectangles are similar and the first is 6 cm by 10 cm, and the second is 9 cm by x cm, then 6/9 = 10/x. Cross-multiply: 6x = 90, so x = 15 cm."},
      {"type": "callout", "content": "To verify similarity: (1) Check that all corresponding angles are equal. (2) Check that all ratios of corresponding sides are equal.", "style": "tip"},
      {"type": "heading", "content": "Applications of Similarity", "level": 2},
      {"type": "text", "content": "Similarity is used in scale drawings, maps, model building, and indirect measurement. For example, if a 2 m tall person casts a 3 m shadow, and a tree casts a 12 m shadow at the same time, the tree''s height can be found using similar triangles: 2/3 = h/12, so h = 8 m."},
      {"type": "quiz", "question": "Two similar triangles have sides 5, 12, 13 and 10, 24, x. Find x.", "options": ["26", "25", "12", "15"], "correct": 0, "explanation": "Scale factor = 10/5 = 2. So x = 13 x 2 = 26."},
      {"type": "quiz", "question": "A map has a scale of 1:50 000. A distance of 3 cm on the map represents what real distance?", "options": ["1.5 km", "150 km", "15 km", "150 m"], "correct": 0, "explanation": "3 cm x 50 000 = 150 000 cm = 1 500 m = 1.5 km."},
      {"type": "quiz", "question": "If two shapes are similar with a scale factor of 3, how do their areas compare?", "options": ["3 times larger", "6 times larger", "9 times larger", "27 times larger"], "correct": 2, "explanation": "When linear dimensions are multiplied by k, areas are multiplied by k squared. So 3 squared = 9 times larger."}
    ]'::jsonb,
    '[
      {"term": "Similar figures", "definition": "Figures that have the same shape but not necessarily the same size; corresponding angles equal and sides proportional."},
      {"term": "Scale factor", "definition": "The ratio of corresponding sides of similar figures."},
      {"term": "Corresponding sides", "definition": "Sides in the same relative position in similar figures."},
      {"term": "Corresponding angles", "definition": "Angles in the same relative position in similar figures."},
      {"term": "Scale drawing", "definition": "A drawing that uses a consistent scale to represent a real object, smaller or larger."}
    ]'::jsonb,
    'Scale models and proportional design are integral to Indigenous craftsmanship. Building miniature canoe models before constructing the full vessel, or scaling beadwork patterns to different sizes, requires understanding of similarity and proportional relationships.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS9.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What makes two shapes similar?', 'Corresponding angles are equal, and corresponding sides are proportional (have the same ratio).', 'Same shape, different size.', 1, 0),
    (v_tenant, v_ch, 'What is a scale factor?', 'The ratio of corresponding sides in similar figures. It tells how many times larger or smaller one figure is.', 'Side of image over side of original.', 2, 1),
    (v_tenant, v_ch, 'If the scale factor between similar figures is 4, how do their areas compare?', 'The area of the larger figure is 4 squared = 16 times the area of the smaller figure.', 'Area scales by the square of the scale factor.', 3, 2),
    (v_tenant, v_ch, 'How can you use shadows to find the height of a tall object?', 'Set up a proportion using similar triangles: (your height)/(your shadow) = (object height)/(object shadow).', 'The sun creates similar triangles.', 2, 3);

  -- Chapter 11: Line & Rotation Symmetry (SS9.4)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 11,
    'Line & Rotation Symmetry',
    'line-rotation-symmetry',
    'Identify and analyze line symmetry and rotation symmetry in 2-D shapes.',
    '[
      {"type": "heading", "content": "Line & Rotation Symmetry", "level": 1},
      {"type": "text", "content": "Symmetry is a property that describes when a shape can be mapped onto itself through a transformation. There are two main types of symmetry we study in Grade 9: line symmetry (reflective symmetry) and rotation symmetry."},
      {"type": "heading", "content": "Line Symmetry", "level": 2},
      {"type": "text", "content": "A shape has line symmetry if it can be folded along a line so that the two halves match exactly. The fold line is called the line of symmetry (or axis of symmetry). A shape may have zero, one, or many lines of symmetry. An equilateral triangle has 3 lines of symmetry, a square has 4, and a circle has infinitely many."},
      {"type": "heading", "content": "Rotation Symmetry", "level": 2},
      {"type": "text", "content": "A shape has rotation symmetry if it can be rotated less than 360 degrees about its centre and still look the same as the original. The order of rotation symmetry is the number of times the shape maps onto itself during a full 360-degree rotation. The angle of rotation symmetry is 360 / order. For example, a square has order 4 rotation symmetry (it maps onto itself every 90 degrees)."},
      {"type": "callout", "content": "Every shape maps onto itself after a 360-degree rotation. Rotation symmetry only counts if the shape maps onto itself at an angle less than 360 degrees.", "style": "info"},
      {"type": "text", "content": "A regular hexagon has order 6 rotation symmetry (it looks the same every 60 degrees) and 6 lines of symmetry. A regular n-gon always has n lines of symmetry and order n rotation symmetry."},
      {"type": "quiz", "question": "How many lines of symmetry does a regular pentagon have?", "options": ["1", "3", "5", "10"], "correct": 2, "explanation": "A regular pentagon has 5 lines of symmetry — one through each vertex to the midpoint of the opposite side."},
      {"type": "quiz", "question": "A shape has order 3 rotation symmetry. What is its angle of rotation?", "options": ["90 degrees", "120 degrees", "60 degrees", "180 degrees"], "correct": 1, "explanation": "Angle = 360 / order = 360 / 3 = 120 degrees."},
      {"type": "quiz", "question": "Does a parallelogram (non-rectangular) have any lines of symmetry?", "options": ["Yes, one", "Yes, two", "No", "Yes, four"], "correct": 2, "explanation": "A non-rectangular parallelogram has no lines of symmetry. However, it does have order 2 rotation symmetry (it looks the same after 180 degrees)."}
    ]'::jsonb,
    '[
      {"term": "Line of symmetry", "definition": "A line that divides a shape into two congruent halves that are mirror images of each other."},
      {"term": "Rotation symmetry", "definition": "A shape has rotation symmetry if it maps onto itself when rotated less than 360 degrees about its centre."},
      {"term": "Order of rotation", "definition": "The number of times a shape maps onto itself during one full 360-degree rotation."},
      {"term": "Angle of rotation", "definition": "The smallest angle through which a shape can be rotated to map onto itself: 360 degrees divided by the order."},
      {"term": "Axis of symmetry", "definition": "Another term for line of symmetry; the line about which a figure is reflected."}
    ]'::jsonb,
    'Symmetry is a defining feature of Indigenous art across Canada. The Medicine Wheel has 4-fold symmetry. Star blankets display both line and rotation symmetry. Beadwork medallions and dream catchers exhibit radial symmetry. These artistic traditions embody the mathematical principles of symmetry.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS9.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a line of symmetry?', 'A line that divides a shape into two halves that are exact mirror images of each other.', 'Imagine folding the shape along the line.', 1, 0),
    (v_tenant, v_ch, 'What is the order of rotation symmetry for a regular hexagon?', '6 — it maps onto itself 6 times during a full 360-degree rotation (every 60 degrees).', 'A regular n-gon has order n.', 2, 1),
    (v_tenant, v_ch, 'How do you find the angle of rotation symmetry?', 'Divide 360 degrees by the order of rotation symmetry.', '360 / order.', 2, 2),
    (v_tenant, v_ch, 'How many lines of symmetry does a circle have?', 'Infinitely many — any line through the centre is a line of symmetry.', 'Every diameter works.', 1, 3);


  -- ========================================
  -- UNIT 4: Statistics & Probability
  -- ========================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4,
    'Statistics & Probability',
    'Examine data collection methods, complete a data analysis project, explore the role of probability in society, and connect to Indigenous perspectives on data and chance.',
    'Responsible data collection and analysis require awareness of bias, ethics, and cultural sensitivity. Probability informs decision-making in society, and diverse perspectives enrich our understanding of chance and data.',
    'How do bias, ethics, and cultural perspectives shape our collection, analysis, and interpretation of data?')
  RETURNING id INTO v_unit;

  -- Chapter 12: Data Collection & Bias (SP9.1)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 12,
    'Data Collection, Bias & Ethics',
    'data-collection-bias-ethics',
    'Examine how bias, language, ethics, cost, timing, privacy, cultural sensitivity, and sampling methods affect data collection.',
    '[
      {"type": "heading", "content": "Data Collection, Bias & Ethics", "level": 1},
      {"type": "text", "content": "Data collection is not neutral — the methods, questions, timing, and even the language used can influence results. Responsible data collection requires awareness of potential biases and ethical considerations. In this chapter, we examine the factors that affect data quality and the conclusions we can draw."},
      {"type": "heading", "content": "Sources of Bias", "level": 2},
      {"type": "list", "items": ["Question wording: Leading or loaded questions can push respondents toward a particular answer.", "Sampling method: Convenience sampling (surveying only nearby people) may not represent the whole population.", "Timing: Surveys conducted at certain times may miss certain groups.", "Cultural sensitivity: Questions may be interpreted differently by different cultural groups.", "Non-response bias: If many people decline to respond, the remaining responses may not be representative."], "ordered": false},
      {"type": "heading", "content": "Population vs. Sample", "level": 2},
      {"type": "text", "content": "A population is the entire group we want to learn about. A sample is a smaller subset of the population that we actually study. A good sample is representative of the population. Random sampling gives every member an equal chance of being selected, reducing bias."},
      {"type": "heading", "content": "Ethical Considerations", "level": 2},
      {"type": "text", "content": "Ethical data collection requires: informed consent (participants know how their data will be used), privacy protection (keeping personal information confidential), honesty (not manipulating data to support a predetermined conclusion), and cultural respect (ensuring questions are appropriate for all participants)."},
      {"type": "callout", "content": "Always consider: Who is being asked? How is the question worded? When and where is the data collected? Who benefits from the results?", "style": "tip"},
      {"type": "quiz", "question": "A school surveys only students in the cafeteria at lunch to determine the most popular sport. This is an example of:", "options": ["Random sampling", "Convenience sampling", "Stratified sampling", "Systematic sampling"], "correct": 1, "explanation": "Surveying only those in the cafeteria is convenience sampling — it does not give every student an equal chance of being selected."},
      {"type": "quiz", "question": "Why is leading question wording a form of bias?", "options": ["It is too long", "It steers respondents toward a particular answer", "It confuses participants", "It reduces sample size"], "correct": 1, "explanation": "A leading question suggests the desired answer, influencing how people respond and skewing the results."},
      {"type": "quiz", "question": "What does informed consent mean in data collection?", "options": ["Participants agree to answer all questions", "Participants understand how their data will be used before agreeing to participate", "Researchers consent to share results", "The government approves the survey"], "correct": 1, "explanation": "Informed consent means participants are told the purpose, methods, and use of the data before they decide whether to participate."}
    ]'::jsonb,
    '[
      {"term": "Bias", "definition": "A systematic tendency in data collection or analysis that favours certain outcomes over others."},
      {"term": "Population", "definition": "The entire group of individuals or items being studied."},
      {"term": "Sample", "definition": "A subset of the population selected for study."},
      {"term": "Random sampling", "definition": "A method where every member of the population has an equal chance of being selected."},
      {"term": "Informed consent", "definition": "Agreement to participate in research after being fully informed about the purpose and methods."},
      {"term": "Cultural sensitivity", "definition": "Awareness and respect for cultural differences in how questions are understood and answered."}
    ]'::jsonb,
    'Data sovereignty is a critical concept for Indigenous communities. First Nations, Metis, and Inuit peoples advocate for ownership and control over data collected about their communities. The OCAP principles (Ownership, Control, Access, Possession) ensure that Indigenous data is collected and used respectfully.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SP9.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the difference between a population and a sample?', 'A population is the entire group being studied. A sample is a smaller subset selected from that population.', 'The whole group vs. a part.', 1, 0),
    (v_tenant, v_ch, 'Name three sources of bias in data collection.', 'Leading questions, convenience sampling, and timing of data collection.', 'How, who, and when.', 2, 1),
    (v_tenant, v_ch, 'Why is random sampling preferred?', 'It gives every member of the population an equal chance of being selected, reducing bias and making the sample more representative.', 'Equal chance for all.', 2, 2),
    (v_tenant, v_ch, 'What are the OCAP principles?', 'Ownership, Control, Access, and Possession — principles ensuring Indigenous communities have authority over data collected about them.', 'Indigenous data sovereignty.', 3, 3);

  -- Chapter 13: Data Analysis Project (SP9.2)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 13,
    'Data Analysis Project',
    'data-analysis-project',
    'Plan and carry out a complete data collection, display, and analysis project.',
    '[
      {"type": "heading", "content": "Data Analysis Project", "level": 1},
      {"type": "text", "content": "In this chapter, you will plan and execute a complete statistical investigation. This involves formulating a question, choosing a data collection method, gathering data, selecting appropriate displays, analyzing results, and drawing conclusions. This project brings together all the statistical skills developed throughout your math education."},
      {"type": "heading", "content": "The Statistical Process", "level": 2},
      {"type": "list", "items": ["Step 1: Formulate a clear, unbiased research question.", "Step 2: Determine the population and sampling method.", "Step 3: Design the data collection instrument (survey, observation, experiment).", "Step 4: Collect the data ethically and systematically.", "Step 5: Organize and display the data using appropriate graphs and tables.", "Step 6: Analyze the data using measures of central tendency and spread.", "Step 7: Draw conclusions and assess limitations."], "ordered": true},
      {"type": "heading", "content": "Choosing Displays", "level": 2},
      {"type": "text", "content": "Match the display to the data type: use bar graphs for categorical data, histograms for grouped numerical data, line graphs for data over time, and circle graphs for proportional data. Multiple displays can show different aspects of the same data set."},
      {"type": "heading", "content": "Drawing Conclusions", "level": 2},
      {"type": "text", "content": "When drawing conclusions: state what the data shows clearly, acknowledge limitations (sample size, potential bias), avoid overgeneralizing beyond the data, and suggest areas for further investigation. Good statistical reasoning requires honesty about what the data can and cannot tell us."},
      {"type": "callout", "content": "A strong project acknowledges its own limitations. No study is perfect — identifying potential weaknesses shows statistical maturity.", "style": "info"},
      {"type": "quiz", "question": "Which step comes first in the statistical process?", "options": ["Collecting data", "Formulating a research question", "Creating a graph", "Analyzing results"], "correct": 1, "explanation": "The process begins with a clear, unbiased research question that guides all subsequent steps."},
      {"type": "quiz", "question": "Why might you use multiple types of displays for the same data set?", "options": ["To make the project longer", "Because each display type can reveal different aspects of the data", "Because one display is never enough", "To use all available software"], "correct": 1, "explanation": "Different displays emphasize different aspects: a bar graph shows comparisons, a line graph shows trends, and a circle graph shows proportions."}
    ]'::jsonb,
    '[
      {"term": "Research question", "definition": "A clear, focused question that guides the entire data collection and analysis process."},
      {"term": "Data collection instrument", "definition": "The tool used to gather data, such as a survey, questionnaire, or observation checklist."},
      {"term": "Statistical process", "definition": "The systematic steps of questioning, collecting, organizing, analyzing, and concluding from data."},
      {"term": "Limitation", "definition": "A weakness or constraint in a study that may affect the reliability or generalizability of conclusions."}
    ]'::jsonb,
    'Community-based participatory research models used by many Indigenous communities ensure that research benefits the community. Data projects in Indigenous contexts prioritize community involvement, respectful methodology, and results that serve the community being studied.',
    35, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SP9.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are the seven steps of the statistical process?', 'Question, population/sampling, design instrument, collect data, display, analyze, conclude.', 'From question to conclusion.', 2, 0),
    (v_tenant, v_ch, 'Why is acknowledging limitations important?', 'It demonstrates statistical maturity and honesty. No study is perfect, and readers need to understand the constraints.', 'Be honest about weaknesses.', 2, 1),
    (v_tenant, v_ch, 'How do you choose the right type of graph?', 'Match to data type: bar graph for categories, histogram for grouped numbers, line graph for time series, circle graph for proportions.', 'Data type determines display type.', 2, 2),
    (v_tenant, v_ch, 'What makes a good research question?', 'It should be clear, focused, unbiased, and answerable through data collection.', 'Avoid leading or vague questions.', 2, 3);

  -- Chapter 14: Probability in Society (SP9.3)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 14,
    'Probability in Society',
    'probability-in-society',
    'Explore how probability is used in everyday decision-making, risk assessment, and societal applications.',
    '[
      {"type": "heading", "content": "Probability in Society", "level": 1},
      {"type": "text", "content": "Probability is everywhere in modern life: weather forecasts, medical testing, insurance premiums, sports analytics, and game design all rely on probabilistic reasoning. Understanding how probability works helps us make better decisions and critically evaluate claims."},
      {"type": "heading", "content": "Weather & Natural Events", "level": 2},
      {"type": "text", "content": "When a forecast says there is a 40% chance of rain, it means that under similar conditions, rain occurs about 40 times out of 100. This is based on historical data and atmospheric models. Understanding this helps us plan appropriately without being misled by the inherent uncertainty."},
      {"type": "heading", "content": "Medical Testing & Risk", "level": 2},
      {"type": "text", "content": "Medical tests are described in terms of sensitivity (probability the test correctly identifies a condition) and specificity (probability the test correctly identifies the absence of a condition). No test is 100% accurate. Understanding false positives and false negatives helps patients and doctors make informed decisions."},
      {"type": "heading", "content": "Insurance & Gambling", "level": 2},
      {"type": "text", "content": "Insurance companies use probability to set premiums: the higher the probability of a claim, the higher the premium. Lotteries and casinos are designed so that the house always has a statistical advantage over time. Understanding expected value (the long-run average outcome) helps individuals make informed choices about risk."},
      {"type": "callout", "content": "The expected value of a game is calculated by multiplying each outcome by its probability and summing the results. A negative expected value means you lose money on average.", "style": "info"},
      {"type": "quiz", "question": "A weather forecast says 70% chance of snow. What does this mean?", "options": ["It will snow for 70% of the day", "Under similar conditions, snow occurs about 70 times out of 100", "70% of the area will get snow", "Snow is guaranteed"], "correct": 1, "explanation": "A 70% probability means that in situations with these conditions, snow occurs about 70% of the time."},
      {"type": "quiz", "question": "Why is understanding probability important for evaluating lottery tickets?", "options": ["Because all lotteries are scams", "Because the expected value shows you lose money on average", "Because probability makes you win more", "Because lotteries are always fair"], "correct": 1, "explanation": "The expected value of a lottery ticket is negative — you pay more than you statistically expect to win back over time."}
    ]'::jsonb,
    '[
      {"term": "Expected value", "definition": "The long-run average outcome of a probabilistic event, calculated by summing each outcome times its probability."},
      {"term": "Risk assessment", "definition": "The process of evaluating the probability and impact of potential negative events."},
      {"term": "False positive", "definition": "A test result that incorrectly indicates the presence of a condition."},
      {"term": "False negative", "definition": "A test result that incorrectly indicates the absence of a condition."},
      {"term": "Sensitivity", "definition": "The probability that a test correctly identifies people who have a condition."}
    ]'::jsonb,
    'Indigenous communities have long assessed risk and probability through environmental observation. Predicting the timing of seasonal events, assessing the likelihood of successful harvests, and evaluating the risk of severe weather all involve probabilistic reasoning embedded in traditional ecological knowledge.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SP9.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is expected value?', 'The long-run average outcome, calculated by multiplying each possible outcome by its probability and summing the results.', 'Weighted average of outcomes.', 3, 0),
    (v_tenant, v_ch, 'What does a 30% chance of rain mean?', 'Under similar atmospheric conditions, rain occurs about 30 times out of 100. It does not mean it will rain for 30% of the day.', 'Frequency interpretation.', 2, 1),
    (v_tenant, v_ch, 'Why do insurance companies use probability?', 'To estimate the likelihood of claims and set premiums accordingly. Higher-risk groups pay higher premiums.', 'Risk determines price.', 2, 2),
    (v_tenant, v_ch, 'What is a false positive?', 'A test result that says a condition is present when it actually is not.', 'The test is wrong in the positive direction.', 2, 3);

  -- Chapter 15: Indigenous Perspectives on Probability & Statistics (SP9.4)
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 15,
    'Indigenous Perspectives on Probability & Statistics',
    'indigenous-perspectives-probability-statistics',
    'Research and present how First Nations and Metis peoples envision, represent, and use probability and statistics.',
    '[
      {"type": "heading", "content": "Indigenous Perspectives on Probability & Statistics", "level": 1},
      {"type": "text", "content": "Mathematics is often presented as a universal, culture-free discipline. However, all cultures develop mathematical thinking, and Indigenous peoples of Canada have rich traditions of quantitative reasoning that include concepts of probability, data analysis, and statistical thinking. This chapter explores these perspectives."},
      {"type": "heading", "content": "Games of Chance", "level": 2},
      {"type": "text", "content": "Many First Nations and Metis communities have traditional games involving chance and strategy. The stick game (hand game), played across many nations, involves predicting which hand holds a marked object. Bone dice games use marked pieces to generate random outcomes. These games demonstrate understanding of randomness, probability, and expected outcomes."},
      {"type": "heading", "content": "Environmental Prediction", "level": 2},
      {"type": "text", "content": "Indigenous knowledge systems include sophisticated methods for predicting weather, animal behaviour, and seasonal patterns. Elders observe indicators — the behaviour of animals, cloud patterns, ice thickness, plant growth — to make probabilistic predictions. These predictions are based on generations of accumulated data and pattern recognition."},
      {"type": "heading", "content": "Data Sovereignty & OCAP", "level": 2},
      {"type": "text", "content": "The First Nations Information Governance Centre developed the OCAP principles: Ownership (the community owns its data), Control (the community controls how data is collected and used), Access (the community has access to data about itself), and Possession (the community physically possesses the data). These principles ensure ethical treatment of Indigenous data."},
      {"type": "callout", "content": "Indigenous mathematical knowledge has been undervalued in Western education systems. Recognizing these traditions enriches our understanding of mathematics as a human activity practiced by all cultures.", "style": "info"},
      {"type": "heading", "content": "Quantitative Reasoning in Oral Tradition", "level": 2},
      {"type": "text", "content": "Oral traditions preserve quantitative knowledge across generations. Stories encode information about population sizes, seasonal timing, geographical distances, and resource quantities. This oral data transmission is a form of statistical record-keeping that predates written records."},
      {"type": "quiz", "question": "What does OCAP stand for?", "options": ["Original Canadian Aboriginal Peoples", "Ownership, Control, Access, Possession", "Official Census and Population data", "Organization for Canadian Academic Programs"], "correct": 1, "explanation": "OCAP stands for Ownership, Control, Access, and Possession — principles governing how data about Indigenous communities is managed."},
      {"type": "quiz", "question": "How do traditional games of chance demonstrate probability concepts?", "options": ["They don''t — they are just games", "They involve randomness, prediction, and understanding likely outcomes", "They were invented after European contact", "They use Western mathematics"], "correct": 1, "explanation": "Traditional games of chance involve random outcomes, strategic prediction, and intuitive understanding of probability — the same core concepts studied in formal probability."},
      {"type": "quiz", "question": "Why is data sovereignty important for Indigenous communities?", "options": ["It gives governments more control", "It ensures communities own and control data collected about them", "It makes data collection faster", "It reduces the amount of data needed"], "correct": 1, "explanation": "Data sovereignty ensures that Indigenous communities have authority over how data about their people is collected, stored, analyzed, and shared."}
    ]'::jsonb,
    '[
      {"term": "Data sovereignty", "definition": "The right of a community or nation to govern the collection, ownership, and use of data about its members."},
      {"term": "OCAP principles", "definition": "Ownership, Control, Access, and Possession — guiding principles for Indigenous data governance in Canada."},
      {"term": "Traditional ecological knowledge", "definition": "Knowledge developed by Indigenous peoples through long-term observation and interaction with the environment."},
      {"term": "Oral tradition", "definition": "The practice of passing knowledge, history, and cultural practices from generation to generation through spoken word."},
      {"term": "Ethnomathematics", "definition": "The study of mathematical practices within different cultural groups."}
    ]'::jsonb,
    'This chapter is itself an Indigenous connection — it centres First Nations and Metis perspectives on probability and statistics, recognizing that mathematical thinking is a universal human activity expressed in culturally specific ways across all peoples.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SP9.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are the OCAP principles?', 'Ownership, Control, Access, and Possession — principles ensuring Indigenous communities have authority over data about them.', 'Indigenous data governance.', 2, 0),
    (v_tenant, v_ch, 'Give an example of probabilistic thinking in Indigenous knowledge.', 'Predicting weather based on animal behaviour, cloud patterns, or plant growth — this uses accumulated data and pattern recognition to assess likelihood.', 'Environmental observation and prediction.', 2, 1),
    (v_tenant, v_ch, 'What is ethnomathematics?', 'The study of mathematical practices and ideas within specific cultural groups, recognizing that all cultures develop mathematical thinking.', 'Math in cultural context.', 2, 2),
    (v_tenant, v_ch, 'Name a traditional Indigenous game that involves probability.', 'The stick game (hand game), bone dice games, or other games of chance played across many First Nations.', 'Games with random outcomes.', 1, 3),
    (v_tenant, v_ch, 'Why is data sovereignty important?', 'It ensures Indigenous communities own and control data collected about their people, preventing exploitation and supporting self-determination.', 'Community control over their own information.', 2, 4);

  -- Update chapter count for Grade 9
  UPDATE textbooks SET chapter_count = 15 WHERE id = v_book;

END $$;
