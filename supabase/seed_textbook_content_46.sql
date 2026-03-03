-- ============================================================================
-- WolfWhale Textbook Content Seed: Grades 4-6 Mathematics
-- Saskatchewan WNCP Curriculum-Aligned Content
--
-- Populates: textbook_units, textbook_chapters, chapter_outcome_map,
--            textbook_flashcards
--
-- Requires: seed_textbooks.sql and seed_curriculum_outcomes.sql run first
-- ============================================================================

-- ============================================================================
-- GRADE 4: WolfWhale Foundations of Math 4
-- Outcomes: N4.1-N4.8, P4.1-P4.2, SP4.1, SS4.1-SS4.4
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book UUID;
  v_unit UUID;
  v_ch UUID;
  v_oc UUID;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-foundations-of-math-4';

  -- ===================================================================
  -- UNIT 1: Number Sense and Operations
  -- ===================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1,
    'Number Sense and Operations',
    'Whole numbers to 10,000, multiplication and division facts, and introduction to decimals and fractions',
    'Our base-ten number system uses place value to represent and compare quantities of any size, and the four operations are interconnected tools for solving problems.',
    'How does understanding place value and the relationships between operations help us solve real-world problems?')
  RETURNING id INTO v_unit;

  -- ---------------------------------------------------------------
  -- Chapter 1: Place Value to 10,000 (N4.1)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 1,
    'Place Value to 10,000',
    'place-value-to-10000',
    'Understand and represent whole numbers to 10,000 using place value concepts.',
    '[
      {"type": "heading", "content": "Place Value to 10,000", "level": 1},
      {"type": "text", "content": "Every digit in a number has a value based on its position. This is called place value. In our base-ten number system, each place is worth ten times the place to its right."},
      {"type": "callout", "content": "Think of place value like stacking groups of ten. Ten ones make a ten, ten tens make a hundred, and ten hundreds make a thousand.", "style": "tip"},
      {"type": "heading", "content": "Reading and Writing Numbers to 10,000", "level": 2},
      {"type": "text", "content": "The number 4,736 has four digits. The 4 is in the thousands place and is worth 4,000. The 7 is in the hundreds place and is worth 700. The 3 is in the tens place and is worth 30. The 6 is in the ones place and is worth 6. We write this in expanded form as 4,000 + 700 + 30 + 6."},
      {"type": "list", "items": ["Ones place: the digit on the far right", "Tens place: the second digit from the right", "Hundreds place: the third digit from the right", "Thousands place: the fourth digit from the right"], "ordered": false},
      {"type": "callout", "content": "Example: The number 8,205 means 8 thousands, 2 hundreds, 0 tens, and 5 ones. Notice the zero — it is a placeholder that shows there are no tens.", "style": "example"},
      {"type": "heading", "content": "Comparing and Ordering Numbers", "level": 2},
      {"type": "text", "content": "To compare numbers, start from the leftmost digit (the greatest place value) and compare each position. If the digits are the same, move to the next place to the right. Use the symbols > (greater than), < (less than), and = (equal to)."},
      {"type": "callout", "content": "To compare 3,456 and 3,478: The thousands digits are the same (3). The hundreds digits are the same (4). The tens digits are different: 5 < 7, so 3,456 < 3,478.", "style": "example"},
      {"type": "quiz", "question": "What is the value of the digit 6 in the number 6,302?", "options": ["6", "60", "600", "6,000"], "correct": 3, "explanation": "The digit 6 is in the thousands place, so its value is 6,000."},
      {"type": "quiz", "question": "Which number is greater: 4,589 or 4,598?", "options": ["4,589", "4,598", "They are equal"], "correct": 1, "explanation": "Comparing from left to right: thousands are equal (4), hundreds are equal (5), but in the tens place 9 > 8, so 4,598 > 4,589."}
    ]'::jsonb,
    '[
      {"term": "Place value", "definition": "The value of a digit based on its position in a number"},
      {"term": "Expanded form", "definition": "Writing a number as the sum of the values of each digit (e.g., 3,452 = 3,000 + 400 + 50 + 2)"},
      {"term": "Standard form", "definition": "The usual way of writing a number using digits (e.g., 3,452)"},
      {"term": "Word form", "definition": "Writing a number using words (e.g., three thousand four hundred fifty-two)"},
      {"term": "Placeholder", "definition": "A zero used to hold a place in a number when there are none of that value (e.g., the 0 in 4,052)"}
    ]'::jsonb,
    'Indigenous peoples of the northern plains used tally systems and oral counting traditions to track large quantities such as bison herds and harvested foods. Elders would pass knowledge of numbers through stories, connecting quantity to the land and seasons.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N4.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is place value?', 'The value of a digit based on its position in a number. For example, the 5 in 5,300 is worth 5,000.', 'Think about ones, tens, hundreds, thousands', 2, 0),
    (v_tenant, v_ch, 'What is the expanded form of 7,204?', '7,000 + 200 + 0 + 4 (or simply 7,000 + 200 + 4)', 'Break each digit into its place value', 2, 1),
    (v_tenant, v_ch, 'How do you compare two 4-digit numbers?', 'Start from the leftmost digit (thousands place) and compare each place value moving right until you find a difference.', 'Compare from biggest place to smallest', 2, 2),
    (v_tenant, v_ch, 'What does a zero placeholder do?', 'It holds a position in the number to show there are none of that value, like the 0 in 3,042 means zero hundreds.', 'Think about 3,042 versus 342', 1, 3),
    (v_tenant, v_ch, 'Write 2,658 in word form.', 'Two thousand six hundred fifty-eight.', 'Say each place value in words', 2, 4);

  -- ---------------------------------------------------------------
  -- Chapter 2: Addition and Subtraction to 10,000 (N4.2)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 2,
    'Addition and Subtraction to 10,000',
    'addition-subtraction-to-10000',
    'Add and subtract whole numbers with sums and differences up to 10,000 using various strategies.',
    '[
      {"type": "heading", "content": "Addition and Subtraction to 10,000", "level": 1},
      {"type": "text", "content": "Addition and subtraction are inverse operations — they undo each other. When we add, we combine quantities. When we subtract, we find the difference between quantities or take away part of a group. Both operations work the same way whether we are using small or large numbers."},
      {"type": "heading", "content": "Adding Larger Numbers", "level": 2},
      {"type": "text", "content": "When adding numbers with three or four digits, line up the digits by place value. Start adding from the ones place and move left. If a column adds up to 10 or more, regroup (carry) to the next place."},
      {"type": "callout", "content": "Example: 3,468 + 2,375. Ones: 8 + 5 = 13 (write 3, carry 1). Tens: 6 + 7 + 1 = 14 (write 4, carry 1). Hundreds: 4 + 3 + 1 = 8. Thousands: 3 + 2 = 5. Answer: 5,843.", "style": "example"},
      {"type": "heading", "content": "Subtracting Larger Numbers", "level": 2},
      {"type": "text", "content": "When subtracting, line up the digits by place value and start from the ones place. If the top digit is smaller than the bottom digit, you need to regroup (borrow) from the next higher place."},
      {"type": "callout", "content": "Example: 5,203 − 1,847. Ones: 3 − 7 (cannot do, borrow from tens — but tens is 0, so borrow from hundreds). Work through each place carefully. Answer: 3,356.", "style": "example"},
      {"type": "heading", "content": "Estimation Strategies", "level": 2},
      {"type": "text", "content": "Before computing, estimate to check if your answer is reasonable. Round each number to the nearest thousand or hundred, then add or subtract the rounded numbers. For example, 3,468 + 2,375 is approximately 3,500 + 2,400 = 5,900."},
      {"type": "callout", "content": "Always estimate before you calculate. If your exact answer is far from your estimate, check your work!", "style": "tip"},
      {"type": "quiz", "question": "What is 4,567 + 3,285?", "options": ["7,842", "7,852", "7,752", "7,862"], "correct": 1, "explanation": "Ones: 7+5=12, write 2 carry 1. Tens: 6+8+1=15, write 5 carry 1. Hundreds: 5+2+1=8. Thousands: 4+3=7. Answer: 7,852."},
      {"type": "quiz", "question": "What is 8,000 − 2,463?", "options": ["5,537", "5,547", "6,537", "5,437"], "correct": 0, "explanation": "Starting from the ones: 0−3 requires regrouping from the left. Working through carefully: 8,000 − 2,463 = 5,537."}
    ]'::jsonb,
    '[
      {"term": "Regrouping", "definition": "Trading ten of one place value for one of the next higher place value (also called carrying in addition or borrowing in subtraction)"},
      {"term": "Inverse operations", "definition": "Operations that undo each other; addition and subtraction are inverse operations"},
      {"term": "Estimate", "definition": "An approximate answer found by rounding numbers before calculating"},
      {"term": "Sum", "definition": "The result of adding two or more numbers"},
      {"term": "Difference", "definition": "The result of subtracting one number from another"}
    ]'::jsonb,
    'Many Indigenous communities in Saskatchewan practised trade networks spanning thousands of kilometres. Traders needed to add and subtract quantities of goods such as dried bison meat, hides, and tools as they exchanged resources across nations.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N4.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is regrouping in addition?', 'When the sum of digits in one place is 10 or more, you write the ones digit and carry the tens digit to the next place to the left.', 'Also called carrying', 2, 0),
    (v_tenant, v_ch, 'What are inverse operations?', 'Operations that undo each other. Addition and subtraction are inverse operations. For example, 5 + 3 = 8 and 8 − 3 = 5.', 'Think of doing and undoing', 2, 1),
    (v_tenant, v_ch, 'Why should you estimate before calculating?', 'Estimation helps you check if your exact answer is reasonable. If your answer is far from the estimate, you may have made an error.', 'Round first, then compute', 2, 2),
    (v_tenant, v_ch, 'What is the sum of 6,789 + 1,234?', '8,023', 'Add from the ones place, carrying as needed', 3, 3),
    (v_tenant, v_ch, 'What is the difference of 5,000 − 1,876?', '3,124', 'You will need to regroup across zeros', 3, 4);

  -- ---------------------------------------------------------------
  -- Chapter 3: Multiplication Facts and Strategies (N4.3)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 3,
    'Multiplication Facts and Strategies',
    'multiplication-facts-strategies',
    'Understand multiplication of whole numbers up to 10 x 10 using arrays, skip counting, and properties.',
    '[
      {"type": "heading", "content": "Multiplication Facts and Strategies", "level": 1},
      {"type": "text", "content": "Multiplication is repeated addition. When we say 4 x 3, we mean 4 groups of 3, which is 3 + 3 + 3 + 3 = 12. Knowing your multiplication facts up to 10 x 10 will help you solve problems quickly and accurately."},
      {"type": "heading", "content": "Using Arrays", "level": 2},
      {"type": "text", "content": "An array is an arrangement of objects in rows and columns. A 3 x 5 array has 3 rows of 5 objects, totalling 15. Arrays help you see that multiplication is about equal groups arranged in a rectangle."},
      {"type": "heading", "content": "Properties of Multiplication", "level": 2},
      {"type": "list", "items": ["Commutative property: The order does not matter. 4 x 7 = 7 x 4 = 28.", "Associative property: When multiplying three numbers, grouping does not matter. (2 x 3) x 4 = 2 x (3 x 4) = 24.", "Identity property: Any number multiplied by 1 equals itself. 9 x 1 = 9.", "Zero property: Any number multiplied by 0 equals 0. 6 x 0 = 0."], "ordered": false},
      {"type": "heading", "content": "Strategies for Learning Facts", "level": 2},
      {"type": "text", "content": "If you know 5 x 6 = 30, you can find 6 x 6 by adding one more group of 6: 30 + 6 = 36. You can also use doubling: 4 x 7 is the same as 2 x 7 doubled (14 doubled is 28). Breaking facts into smaller pieces you already know is a powerful strategy."},
      {"type": "callout", "content": "The 9s trick: For 9 x any number 1-10, the tens digit is one less than the number, and the digits add up to 9. For example, 9 x 7 = 63 (6 is one less than 7, and 6+3=9).", "style": "tip"},
      {"type": "quiz", "question": "What is 7 x 8?", "options": ["54", "56", "48", "63"], "correct": 1, "explanation": "7 x 8 = 56. You can think of it as 7 x 8 = (5 x 8) + (2 x 8) = 40 + 16 = 56."},
      {"type": "quiz", "question": "Which property says that 3 x 9 = 9 x 3?", "options": ["Associative property", "Identity property", "Commutative property", "Zero property"], "correct": 2, "explanation": "The commutative property states that changing the order of the factors does not change the product."}
    ]'::jsonb,
    '[
      {"term": "Factor", "definition": "A number that is multiplied by another number to get a product"},
      {"term": "Product", "definition": "The result of multiplying two or more numbers together"},
      {"term": "Array", "definition": "An arrangement of objects in equal rows and columns used to model multiplication"},
      {"term": "Commutative property", "definition": "A property stating that changing the order of factors does not change the product (a x b = b x a)"},
      {"term": "Skip counting", "definition": "Counting forward by a number other than one (e.g., 3, 6, 9, 12, 15...)"}
    ]'::jsonb,
    'The Cree and Dene peoples used grouping and repeated counting in practical ways, such as counting fish in bundles or arranging lodges in camps. These grouping patterns mirror the concept of multiplication as equal groups.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N4.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is multiplication?', 'Repeated addition of equal groups. For example, 5 x 4 means 5 groups of 4, or 4 + 4 + 4 + 4 + 4 = 20.', 'Think of equal groups', 1, 0),
    (v_tenant, v_ch, 'What is the commutative property of multiplication?', 'Changing the order of the factors does not change the product. For example, 6 x 4 = 4 x 6 = 24.', 'The order does not matter', 2, 1),
    (v_tenant, v_ch, 'What is 9 x 6?', '54. (Using the 9s trick: tens digit is 5, ones digit is 4, and 5 + 4 = 9.)', 'Use the 9s trick', 2, 2),
    (v_tenant, v_ch, 'What is an array?', 'An arrangement of objects in equal rows and columns. A 4 x 6 array has 4 rows of 6, totalling 24 objects.', 'Think of rows and columns', 1, 3),
    (v_tenant, v_ch, 'What is the zero property of multiplication?', 'Any number multiplied by zero equals zero. For example, 8 x 0 = 0.', 'Anything times zero is...', 1, 4);

  -- ---------------------------------------------------------------
  -- Chapter 4: Multiplying Multi-Digit Numbers (N4.4)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 4,
    'Multiplying Multi-Digit Numbers',
    'multiplying-multi-digit-numbers',
    'Multiply 2-digit and 3-digit numbers by 1-digit numbers using various strategies.',
    '[
      {"type": "heading", "content": "Multiplying Multi-Digit Numbers", "level": 1},
      {"type": "text", "content": "Once you know your basic multiplication facts, you can multiply larger numbers by breaking them apart using place value. This is sometimes called the partial products method or the distributive property."},
      {"type": "heading", "content": "Using Place Value to Multiply", "level": 2},
      {"type": "text", "content": "To multiply 34 x 6, break 34 into 30 + 4. Then multiply each part by 6: 30 x 6 = 180 and 4 x 6 = 24. Finally, add the partial products: 180 + 24 = 204."},
      {"type": "callout", "content": "Example: 253 x 4. Break it apart: 200 x 4 = 800, 50 x 4 = 200, 3 x 4 = 12. Add: 800 + 200 + 12 = 1,012.", "style": "example"},
      {"type": "heading", "content": "The Standard Algorithm", "level": 2},
      {"type": "text", "content": "You can also use the standard algorithm. Write the larger number on top and the single digit below. Multiply each digit of the top number by the bottom number, starting from the ones place. Regroup when the product is 10 or more."},
      {"type": "callout", "content": "When multiplying 347 x 5: Start with 7 x 5 = 35 (write 5, carry 3). Then 4 x 5 = 20, plus the carried 3 = 23 (write 3, carry 2). Then 3 x 5 = 15, plus the carried 2 = 17. Answer: 1,735.", "style": "example"},
      {"type": "heading", "content": "Estimating Products", "level": 2},
      {"type": "text", "content": "Round the larger number to the nearest ten or hundred before multiplying to estimate the product. For 347 x 5, round 347 to 350: 350 x 5 = 1,750. The exact answer of 1,735 is close to this estimate, so it is likely correct."},
      {"type": "quiz", "question": "What is 46 x 7?", "options": ["312", "322", "332", "302"], "correct": 1, "explanation": "46 x 7: 40 x 7 = 280, 6 x 7 = 42, 280 + 42 = 322."},
      {"type": "quiz", "question": "What is 208 x 3?", "options": ["604", "614", "624", "634"], "correct": 2, "explanation": "208 x 3: 200 x 3 = 600, 0 x 3 = 0, 8 x 3 = 24, 600 + 0 + 24 = 624."}
    ]'::jsonb,
    '[
      {"term": "Partial products", "definition": "The results of multiplying each part of a number separately, which are then added together"},
      {"term": "Distributive property", "definition": "Multiplying a sum by a number gives the same result as multiplying each addend by the number and adding the products: a x (b + c) = (a x b) + (a x c)"},
      {"term": "Standard algorithm", "definition": "The traditional step-by-step method for computing multiplication, working right to left with regrouping"},
      {"term": "Regroup", "definition": "In multiplication, when a product is 10 or more, carry the tens digit to the next column"}
    ]'::jsonb,
    'When First Nations communities prepared pemmican, they needed to calculate quantities for large groups. If each family needs 4 bags and there are 56 families in a camp, the total is 56 x 4 = 224 bags — a practical use of multi-digit multiplication.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N4.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the distributive property?', 'Multiplying a sum by a number gives the same result as multiplying each part separately and adding. Example: 6 x 23 = 6 x 20 + 6 x 3 = 120 + 18 = 138.', 'Break the number apart', 3, 0),
    (v_tenant, v_ch, 'What are partial products?', 'The results when you multiply each part of a number separately. For 34 x 5: partial products are 30 x 5 = 150 and 4 x 5 = 20.', 'Each piece of the multiplication', 2, 1),
    (v_tenant, v_ch, 'Multiply 72 x 8.', '576. (70 x 8 = 560, 2 x 8 = 16, 560 + 16 = 576)', 'Break 72 into 70 + 2', 3, 2),
    (v_tenant, v_ch, 'Why is estimating products useful?', 'It helps you check if your answer is reasonable and catch mistakes quickly.', 'Round first, then multiply', 2, 3);

  -- ---------------------------------------------------------------
  -- Chapter 5: Division Concepts (N4.5)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 5,
    'Division Concepts',
    'division-concepts',
    'Understand division with 1-digit divisors and up to 2-digit dividends, including remainders.',
    '[
      {"type": "heading", "content": "Division Concepts", "level": 1},
      {"type": "text", "content": "Division is the process of sharing a quantity equally or finding how many equal groups can be made. It is the inverse of multiplication. If 5 x 8 = 40, then 40 divided by 8 = 5 and 40 divided by 5 = 8."},
      {"type": "heading", "content": "Division as Equal Sharing", "level": 2},
      {"type": "text", "content": "Imagine you have 36 stickers and want to share them equally among 4 friends. Each friend gets 36 ÷ 4 = 9 stickers. Division tells us the size of each group."},
      {"type": "heading", "content": "Division as Equal Grouping", "level": 2},
      {"type": "text", "content": "You can also think of division as making groups. If you have 36 stickers and put them in groups of 4, you can make 36 ÷ 4 = 9 groups."},
      {"type": "heading", "content": "Remainders", "level": 2},
      {"type": "text", "content": "Sometimes a number does not divide evenly. If you have 25 apples and divide them among 4 baskets, each basket gets 6 apples with 1 left over. We write this as 25 ÷ 4 = 6 R1 (6 remainder 1)."},
      {"type": "callout", "content": "The remainder must always be less than the divisor. If the remainder is equal to or greater than the divisor, you can make another group.", "style": "tip"},
      {"type": "heading", "content": "Relating Multiplication and Division", "level": 2},
      {"type": "text", "content": "Knowing multiplication facts helps with division. A fact family connects related multiplication and division facts: 7 x 6 = 42, 6 x 7 = 42, 42 ÷ 7 = 6, 42 ÷ 6 = 7."},
      {"type": "quiz", "question": "What is 56 ÷ 8?", "options": ["6", "7", "8", "9"], "correct": 1, "explanation": "56 ÷ 8 = 7, because 8 x 7 = 56."},
      {"type": "quiz", "question": "What is 47 ÷ 5?", "options": ["9 R1", "9 R2", "8 R7", "10 R2"], "correct": 1, "explanation": "5 x 9 = 45, and 47 − 45 = 2, so 47 ÷ 5 = 9 R2."}
    ]'::jsonb,
    '[
      {"term": "Dividend", "definition": "The number being divided (e.g., in 36 ÷ 4, the dividend is 36)"},
      {"term": "Divisor", "definition": "The number you divide by (e.g., in 36 ÷ 4, the divisor is 4)"},
      {"term": "Quotient", "definition": "The result of division (e.g., in 36 ÷ 4 = 9, the quotient is 9)"},
      {"term": "Remainder", "definition": "The amount left over when a number cannot be divided evenly"},
      {"term": "Fact family", "definition": "A set of related multiplication and division facts using the same three numbers (e.g., 3, 7, 21)"}
    ]'::jsonb,
    'When Indigenous families shared harvested berries, fish, or wild rice among community members, they practised equal sharing — the same concept as division. Ensuring everyone received a fair portion was a core community value.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N4.5';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the relationship between multiplication and division?', 'They are inverse operations. If 6 x 9 = 54, then 54 ÷ 9 = 6 and 54 ÷ 6 = 9.', 'Inverse operations undo each other', 2, 0),
    (v_tenant, v_ch, 'What is a remainder?', 'The amount left over when a number does not divide evenly. In 29 ÷ 4 = 7 R1, the remainder is 1.', 'The leftover amount', 2, 1),
    (v_tenant, v_ch, 'What are the parts of a division equation?', 'Dividend ÷ Divisor = Quotient. For example, 42 ÷ 6 = 7 (42 is the dividend, 6 is the divisor, 7 is the quotient).', 'Dividend, divisor, quotient', 2, 2),
    (v_tenant, v_ch, 'Calculate 63 ÷ 9.', '7. Because 9 x 7 = 63.', 'Think of the related multiplication fact', 2, 3),
    (v_tenant, v_ch, 'Calculate 38 ÷ 6.', '6 R2. Because 6 x 6 = 36, and 38 − 36 = 2.', 'Find the closest multiplication fact', 3, 4);

  -- ---------------------------------------------------------------
  -- Chapter 6: Fractions (N4.6)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 6,
    'Understanding Fractions',
    'understanding-fractions',
    'Name, compare, and order fractions less than or equal to one whole using concrete and pictorial representations.',
    '[
      {"type": "heading", "content": "Understanding Fractions", "level": 1},
      {"type": "text", "content": "A fraction represents a part of a whole or a part of a group. Fractions have two parts: the numerator (top number) tells how many parts we have, and the denominator (bottom number) tells how many equal parts the whole is divided into."},
      {"type": "callout", "content": "In the fraction 3/4, the denominator 4 tells us the whole is divided into 4 equal parts, and the numerator 3 tells us we have 3 of those parts.", "style": "info"},
      {"type": "heading", "content": "Representing Fractions", "level": 2},
      {"type": "text", "content": "Fractions can be shown on a number line, with fraction strips, by shading parts of a shape, or by describing part of a set. For example, if 3 out of 8 marbles are blue, then 3/8 of the marbles are blue."},
      {"type": "heading", "content": "Comparing Fractions", "level": 2},
      {"type": "text", "content": "When fractions have the same denominator, compare the numerators. For example, 3/8 < 5/8 because 3 parts is less than 5 parts of the same size. When fractions have the same numerator, the one with the smaller denominator is greater because its parts are larger. For example, 2/3 > 2/5."},
      {"type": "callout", "content": "You can also use benchmark fractions: Is the fraction more or less than 1/2? Comparing both fractions to 1/2 is a quick way to determine which is larger.", "style": "tip"},
      {"type": "heading", "content": "Fractions Equal to One Whole", "level": 2},
      {"type": "text", "content": "When the numerator equals the denominator, the fraction equals one whole. For example, 4/4 = 1, 8/8 = 1, and 6/6 = 1."},
      {"type": "quiz", "question": "Which fraction is greater: 2/5 or 2/7?", "options": ["2/5", "2/7", "They are equal"], "correct": 0, "explanation": "When numerators are the same, the fraction with the smaller denominator is greater because its parts are larger. Fifths are larger than sevenths, so 2/5 > 2/7."},
      {"type": "quiz", "question": "What fraction of a pizza have you eaten if you ate 3 slices out of 8?", "options": ["3/8", "8/3", "3/5", "5/8"], "correct": 0, "explanation": "You ate 3 parts out of 8 total equal parts, so you ate 3/8 of the pizza."}
    ]'::jsonb,
    '[
      {"term": "Fraction", "definition": "A number that represents part of a whole or part of a set, written as a/b"},
      {"term": "Numerator", "definition": "The top number in a fraction that tells how many equal parts are being considered"},
      {"term": "Denominator", "definition": "The bottom number in a fraction that tells the total number of equal parts in the whole"},
      {"term": "Benchmark fraction", "definition": "A common fraction used for estimating and comparing, such as 1/4, 1/2, and 3/4"},
      {"term": "Unit fraction", "definition": "A fraction with a numerator of 1 (e.g., 1/2, 1/3, 1/4, 1/8)"}
    ]'::jsonb,
    'Many Indigenous craft traditions involve fractions naturally. When creating beadwork or quillwork patterns, artisans divide spaces into equal parts to create symmetrical designs. A medicine wheel divided into four equal sections uses the concept of 1/4.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N4.6';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does the numerator of a fraction tell you?', 'The numerator (top number) tells how many equal parts are being counted or considered.', 'Top number', 1, 0),
    (v_tenant, v_ch, 'What does the denominator of a fraction tell you?', 'The denominator (bottom number) tells how many equal parts the whole is divided into.', 'Bottom number', 1, 1),
    (v_tenant, v_ch, 'How do you compare fractions with the same denominator?', 'Compare the numerators. The fraction with the larger numerator is greater because it has more equal-sized parts.', 'Same-sized parts, different count', 2, 2),
    (v_tenant, v_ch, 'Which is greater: 3/4 or 3/6?', '3/4 is greater. When numerators are equal, the fraction with the smaller denominator has larger parts.', 'Smaller denominator = bigger parts', 2, 3),
    (v_tenant, v_ch, 'What is a unit fraction?', 'A fraction where the numerator is 1, such as 1/2, 1/3, 1/4, or 1/8. It represents one part of the whole.', 'The numerator is always 1', 1, 4);

  -- ---------------------------------------------------------------
  -- Chapter 7: Decimals — Tenths and Hundredths (N4.7)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 7,
    'Decimals: Tenths and Hundredths',
    'decimals-tenths-hundredths',
    'Understand decimal numbers in tenths and hundredths and their connection to fractions.',
    '[
      {"type": "heading", "content": "Decimals: Tenths and Hundredths", "level": 1},
      {"type": "text", "content": "Decimals are another way to write fractions that have denominators of 10, 100, 1000, and so on. The decimal point separates the whole number part from the fractional part."},
      {"type": "heading", "content": "Tenths", "level": 2},
      {"type": "text", "content": "When a whole is divided into 10 equal parts, each part is one tenth. We write one tenth as 0.1 or 1/10. Three tenths is 0.3 or 3/10."},
      {"type": "heading", "content": "Hundredths", "level": 2},
      {"type": "text", "content": "When a whole is divided into 100 equal parts, each part is one hundredth. We write one hundredth as 0.01 or 1/100. Twenty-five hundredths is 0.25 or 25/100."},
      {"type": "callout", "content": "Think of money! One dollar is the whole. A dime is one tenth of a dollar (0.10), and a penny is one hundredth of a dollar (0.01). So $3.47 means 3 dollars, 4 dimes, and 7 pennies.", "style": "tip"},
      {"type": "heading", "content": "Connecting Decimals and Fractions", "level": 2},
      {"type": "text", "content": "Every decimal can be written as a fraction. 0.7 = 7/10, 0.35 = 35/100, and 0.50 = 50/100 = 5/10 = 1/2. Understanding these connections helps build number sense."},
      {"type": "callout", "content": "0.5 and 0.50 are equivalent — they both represent exactly one half. Adding a zero after the last decimal digit does not change the value.", "style": "info"},
      {"type": "quiz", "question": "What decimal represents 3/10?", "options": ["0.03", "0.3", "3.0", "0.30"], "correct": 1, "explanation": "3/10 = 0.3. The digit 3 is in the tenths place, meaning three tenths."},
      {"type": "quiz", "question": "What fraction is equivalent to 0.75?", "options": ["7/5", "75/10", "75/100", "7/50"], "correct": 2, "explanation": "0.75 has two decimal places, so it represents 75 hundredths, which is 75/100 (also equivalent to 3/4)."}
    ]'::jsonb,
    '[
      {"term": "Decimal", "definition": "A number that uses a decimal point to show values less than one (tenths, hundredths, etc.)"},
      {"term": "Tenths", "definition": "The first place to the right of the decimal point, representing parts out of 10"},
      {"term": "Hundredths", "definition": "The second place to the right of the decimal point, representing parts out of 100"},
      {"term": "Decimal point", "definition": "The dot that separates the whole number part from the decimal (fractional) part"},
      {"term": "Equivalent decimals", "definition": "Decimals that represent the same value (e.g., 0.5 and 0.50)"}
    ]'::jsonb,
    'The introduction of the fur trade brought European currency to the prairies. Indigenous traders quickly adapted to using coin values, which are based on decimal relationships — a dime being one tenth of a dollar and a cent being one hundredth.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N4.7';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a decimal?', 'A number that uses a decimal point to show values less than one whole, representing tenths, hundredths, and so on.', 'The dot separates wholes from parts', 1, 0),
    (v_tenant, v_ch, 'What does the tenths place represent?', 'The first digit to the right of the decimal point. It shows how many tenths (parts out of 10) there are.', 'First place after the decimal point', 2, 1),
    (v_tenant, v_ch, 'Write 0.45 as a fraction.', '45/100 (or 9/20 in simplest form)', 'Two decimal places means hundredths', 2, 2),
    (v_tenant, v_ch, 'Are 0.6 and 0.60 equal?', 'Yes. Adding a zero to the end of a decimal does not change its value. Both represent six tenths.', 'Think about equivalent fractions: 6/10 = 60/100', 2, 3);

  -- ---------------------------------------------------------------
  -- Chapter 8: Adding and Subtracting Decimals (N4.8)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 8,
    'Adding and Subtracting Decimals',
    'adding-subtracting-decimals',
    'Add and subtract decimal numbers limited to hundredths.',
    '[
      {"type": "heading", "content": "Adding and Subtracting Decimals", "level": 1},
      {"type": "text", "content": "Adding and subtracting decimals works just like adding and subtracting whole numbers — you line up the digits by place value. The key rule is to line up the decimal points so that tenths are under tenths and hundredths are under hundredths."},
      {"type": "heading", "content": "Adding Decimals", "level": 2},
      {"type": "text", "content": "To add 3.45 + 2.38, line up the decimal points and add from right to left: hundredths: 5 + 8 = 13 (write 3, carry 1), tenths: 4 + 3 + 1 = 8, ones: 3 + 2 = 5. Answer: 5.83."},
      {"type": "callout", "content": "If one number has fewer decimal places, add zeros as placeholders. To add 4.5 + 2.37, rewrite 4.5 as 4.50 before adding.", "style": "tip"},
      {"type": "heading", "content": "Subtracting Decimals", "level": 2},
      {"type": "text", "content": "Subtraction also requires lining up decimal points. To subtract 6.72 − 3.45, work from right to left: hundredths: 2 − 5 (regroup), tenths: 7 − 4 becomes 6 − 4 = 2 after regrouping, ones: 6 − 3 = 3. Answer: 3.27."},
      {"type": "callout", "content": "Use money to practise! If you have $7.50 and spend $3.25, your change is $7.50 − $3.25 = $4.25.", "style": "example"},
      {"type": "heading", "content": "Estimating with Decimals", "level": 2},
      {"type": "text", "content": "Round each decimal to the nearest whole number to estimate. For 3.45 + 2.38, estimate 3 + 2 = 5. The exact answer of 5.83 is close to 5, so the answer is reasonable."},
      {"type": "quiz", "question": "What is 4.56 + 3.27?", "options": ["7.73", "7.83", "7.93", "8.83"], "correct": 1, "explanation": "Hundredths: 6+7=13, write 3 carry 1. Tenths: 5+2+1=8. Ones: 4+3=7. Answer: 7.83."},
      {"type": "quiz", "question": "What is 5.30 − 2.74?", "options": ["2.56", "2.66", "3.56", "2.46"], "correct": 0, "explanation": "Hundredths: 0−4 requires regrouping. Tenths: 3 becomes 2 after lending, then 10−4=6 in hundredths, 2−7 requires regrouping from ones. Working through: 5.30 − 2.74 = 2.56."}
    ]'::jsonb,
    '[
      {"term": "Align decimal points", "definition": "Placing numbers so that their decimal points are directly above or below each other before adding or subtracting"},
      {"term": "Placeholder zero", "definition": "A zero added to the end of a decimal to make both numbers have the same number of decimal places (e.g., 3.5 becomes 3.50)"},
      {"term": "Reasonable answer", "definition": "An answer that makes sense when compared to an estimate"}
    ]'::jsonb,
    'In modern Indigenous communities across Saskatchewan, everyday transactions at local stores, gas stations, and band offices all use decimal currency. Understanding decimal addition and subtraction is essential for managing personal and community finances.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N4.8';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the most important step when adding or subtracting decimals?', 'Line up the decimal points so that digits with the same place value are in the same column.', 'Align the decimal points', 2, 0),
    (v_tenant, v_ch, 'Calculate 2.45 + 1.38.', '3.83', 'Add hundredths first: 5+8=13, carry 1', 2, 1),
    (v_tenant, v_ch, 'Calculate 8.00 − 3.67.', '4.33', 'You will need to regroup across the zeros', 3, 2),
    (v_tenant, v_ch, 'Why do we add placeholder zeros?', 'So both numbers have the same number of decimal places, making it easier to line up and calculate correctly.', 'Think about 3.5 vs 3.50', 1, 3);


  -- ===================================================================
  -- UNIT 2: Patterns and Relations
  -- ===================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2,
    'Patterns and Relations',
    'Identifying and extending patterns, and solving equations with unknowns',
    'Patterns are the foundation of mathematical thinking — recognizing patterns allows us to predict, generalize, and solve problems.',
    'How can patterns help us make predictions and solve equations?')
  RETURNING id INTO v_unit;

  -- ---------------------------------------------------------------
  -- Chapter 9: Patterns in Tables and Charts (P4.1)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 9,
    'Patterns in Tables and Charts',
    'patterns-tables-charts',
    'Recognize, describe, reproduce, and create patterns found in charts and tables.',
    '[
      {"type": "heading", "content": "Patterns in Tables and Charts", "level": 1},
      {"type": "text", "content": "A pattern is a sequence that follows a rule. In mathematics, we look for patterns everywhere — in number sequences, in tables, and in visual arrangements. Once we find the rule, we can extend the pattern and predict what comes next."},
      {"type": "heading", "content": "Number Patterns", "level": 2},
      {"type": "text", "content": "Look at this sequence: 5, 10, 15, 20, 25, ... The rule is to add 5 each time. We call this an increasing pattern. A decreasing pattern might go: 100, 90, 80, 70, ... where the rule is to subtract 10."},
      {"type": "heading", "content": "Input-Output Tables", "level": 2},
      {"type": "text", "content": "An input-output table shows a relationship between two sets of numbers. If the input increases by 1 and the output increases by 3, the rule might be multiply by 3 or add 3. Discovering the rule helps us fill in missing values."},
      {"type": "callout", "content": "Example: Input: 1, 2, 3, 4, 5 | Output: 4, 7, 10, 13, 16. The rule is multiply by 3 and add 1 (or start at 4 and add 3 each time).", "style": "example"},
      {"type": "heading", "content": "Creating and Extending Patterns", "level": 2},
      {"type": "text", "content": "To create your own pattern, choose a starting number and a rule. To extend a pattern, identify the rule and apply it to find the next terms. Always check that your rule works for every term in the pattern."},
      {"type": "callout", "content": "When identifying a pattern rule, check at least three terms to make sure the rule is consistent.", "style": "tip"},
      {"type": "quiz", "question": "What is the next number in the pattern: 3, 7, 11, 15, ?", "options": ["17", "18", "19", "20"], "correct": 2, "explanation": "The rule is add 4 each time. 15 + 4 = 19."},
      {"type": "quiz", "question": "In an input-output table, the inputs are 2, 4, 6, 8 and the outputs are 6, 12, 18, 24. What is the rule?", "options": ["Add 4", "Multiply by 2", "Multiply by 3", "Add 6"], "correct": 2, "explanation": "Each output is 3 times the input: 2x3=6, 4x3=12, 6x3=18, 8x3=24."}
    ]'::jsonb,
    '[
      {"term": "Pattern", "definition": "A sequence of numbers, shapes, or objects that follows a rule"},
      {"term": "Pattern rule", "definition": "The description of how to get from one term to the next in a pattern"},
      {"term": "Input-output table", "definition": "A table that shows the relationship between two sets of numbers using a rule"},
      {"term": "Increasing pattern", "definition": "A pattern where each term is larger than the one before"},
      {"term": "Decreasing pattern", "definition": "A pattern where each term is smaller than the one before"}
    ]'::jsonb,
    'Patterns are central to Indigenous art and culture. Beadwork designs on moccasins and clothing follow precise repeating and growing patterns. Star blankets use symmetrical geometric patterns that reflect deep cultural significance and mathematical thinking.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'P4.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a pattern rule?', 'A description of how to get from one term to the next in a pattern. For example, the rule for 2, 5, 8, 11 is add 3.', 'It tells you what to do each step', 2, 0),
    (v_tenant, v_ch, 'What is an input-output table?', 'A table showing the relationship between two sets of numbers. You apply a rule to the input to get the output.', 'Input goes in, output comes out', 2, 1),
    (v_tenant, v_ch, 'Find the next two terms: 4, 9, 14, 19, ?, ?', '24, 29. The rule is add 5.', 'Find the difference between terms', 2, 2),
    (v_tenant, v_ch, 'What is an increasing pattern?', 'A pattern where each term is larger than the previous one. For example: 10, 20, 30, 40 (add 10).', 'The numbers get bigger', 1, 3);

  -- ---------------------------------------------------------------
  -- Chapter 10: Equations with Unknowns (P4.2)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 10,
    'Equations with Unknowns',
    'equations-with-unknowns',
    'Understand equations using symbols for unknowns and solve one-step equations.',
    '[
      {"type": "heading", "content": "Equations with Unknowns", "level": 1},
      {"type": "text", "content": "An equation is a mathematical statement that two expressions are equal. Sometimes one value in the equation is unknown. We use a symbol like a box, a triangle, or a letter to represent the unknown value."},
      {"type": "heading", "content": "What Is an Unknown?", "level": 2},
      {"type": "text", "content": "In the equation 5 + ? = 12, the question mark represents the unknown. To solve, we need to find the number that makes the equation true. Since 5 + 7 = 12, the unknown is 7."},
      {"type": "heading", "content": "Solving One-Step Equations", "level": 2},
      {"type": "text", "content": "You can use the inverse operation to solve equations. If the equation uses addition, use subtraction to find the unknown. If the equation uses multiplication, use division."},
      {"type": "list", "items": ["n + 8 = 15 → n = 15 − 8 = 7", "n − 4 = 9 → n = 9 + 4 = 13", "3 x n = 21 → n = 21 ÷ 3 = 7", "n ÷ 5 = 6 → n = 6 x 5 = 30"], "ordered": false},
      {"type": "callout", "content": "Always check your answer by substituting it back into the original equation. If both sides are equal, your solution is correct.", "style": "tip"},
      {"type": "heading", "content": "Preserving Equality", "level": 2},
      {"type": "text", "content": "An equation is like a balance scale — both sides must be equal. Whatever you do to one side, you must do to the other side to keep it balanced. This is the principle of equality."},
      {"type": "quiz", "question": "Solve: n + 6 = 14", "options": ["n = 6", "n = 7", "n = 8", "n = 20"], "correct": 2, "explanation": "n = 14 − 6 = 8. Check: 8 + 6 = 14. Correct!"},
      {"type": "quiz", "question": "Solve: 4 x n = 36", "options": ["n = 8", "n = 9", "n = 32", "n = 40"], "correct": 1, "explanation": "n = 36 ÷ 4 = 9. Check: 4 x 9 = 36. Correct!"}
    ]'::jsonb,
    '[
      {"term": "Equation", "definition": "A mathematical statement that shows two expressions are equal, using the = sign"},
      {"term": "Unknown (variable)", "definition": "A symbol or letter representing a number we need to find"},
      {"term": "Solve", "definition": "To find the value of the unknown that makes an equation true"},
      {"term": "Equality", "definition": "The state of being equal; both sides of the equation have the same value"},
      {"term": "Inverse operation", "definition": "The operation that undoes another (addition undoes subtraction, multiplication undoes division)"}
    ]'::jsonb,
    'The concept of balance and equality is deeply embedded in Indigenous worldviews. The Medicine Wheel represents balance among physical, mental, emotional, and spiritual aspects of life — much like an equation represents balance between two sides.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'P4.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is an equation?', 'A mathematical sentence showing that two expressions are equal, using the equals sign (=).', 'It has an equals sign', 1, 0),
    (v_tenant, v_ch, 'How do you solve n + 9 = 22?', 'Use the inverse operation: n = 22 − 9 = 13. Check: 13 + 9 = 22.', 'Subtract to undo addition', 2, 1),
    (v_tenant, v_ch, 'How do you solve 5 x n = 45?', 'Use the inverse: n = 45 ÷ 5 = 9. Check: 5 x 9 = 45.', 'Divide to undo multiplication', 2, 2),
    (v_tenant, v_ch, 'What does it mean to preserve equality?', 'Whatever operation you perform on one side of an equation, you must also perform on the other side to keep it balanced.', 'Think of a balance scale', 2, 3);


  -- ===================================================================
  -- UNIT 3: Statistics and Probability
  -- ===================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3,
    'Statistics and Probability',
    'Collecting, organizing, and interpreting data using graphs; understanding many-to-one correspondence',
    'Data helps us make sense of the world by organizing information into visual displays that reveal patterns and support decision-making.',
    'How can we collect, display, and interpret data to answer questions about our world?')
  RETURNING id INTO v_unit;

  -- ---------------------------------------------------------------
  -- Chapter 11: Graphs and Data (SP4.1)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 11,
    'Graphs and Many-to-One Correspondence',
    'graphs-many-to-one',
    'Understand many-to-one correspondence; compare, interpret, and create bar graphs and pictographs.',
    '[
      {"type": "heading", "content": "Graphs and Many-to-One Correspondence", "level": 1},
      {"type": "text", "content": "Graphs help us organize data so we can see patterns, compare categories, and draw conclusions. In Grade 4, we focus on bar graphs and pictographs, and learn about many-to-one correspondence."},
      {"type": "heading", "content": "Many-to-One Correspondence", "level": 2},
      {"type": "text", "content": "In a pictograph, one symbol can represent more than one item. This is called many-to-one correspondence. For example, if one smiley face represents 5 students, then 3 smiley faces represent 15 students. You must always include a legend (key) to show what each symbol represents."},
      {"type": "callout", "content": "If a pictograph uses a half symbol, it represents half the value. If one star = 10 books, then half a star = 5 books.", "style": "info"},
      {"type": "heading", "content": "Bar Graphs", "level": 2},
      {"type": "text", "content": "A bar graph uses bars of different heights or lengths to represent data. The scale on the axis might count by 1s, 2s, 5s, 10s, or other intervals depending on the size of the data. Always label the axes and give your graph a title."},
      {"type": "heading", "content": "Reading and Interpreting Graphs", "level": 2},
      {"type": "text", "content": "When reading a graph, ask: What does each axis represent? What is the scale? Which category has the most or least? What is the difference between categories? These questions help you interpret the data."},
      {"type": "callout", "content": "When creating your own graph, choose a scale that fits the data. If your largest value is 50, counting by 5s or 10s makes sense. If the largest value is 8, counting by 1s works.", "style": "tip"},
      {"type": "quiz", "question": "In a pictograph, one tree symbol represents 4 trees planted. If a row shows 6 tree symbols, how many trees does that represent?", "options": ["6", "10", "20", "24"], "correct": 3, "explanation": "6 symbols x 4 trees per symbol = 24 trees."},
      {"type": "quiz", "question": "A bar graph shows the following snack votes: Apples = 15, Crackers = 10, Cheese = 20. Which snack received the most votes?", "options": ["Apples", "Crackers", "Cheese"], "correct": 2, "explanation": "Cheese received 20 votes, which is the most."}
    ]'::jsonb,
    '[
      {"term": "Many-to-one correspondence", "definition": "When one symbol or picture on a graph represents more than one item"},
      {"term": "Pictograph", "definition": "A graph that uses pictures or symbols to represent data, with a legend showing what each symbol means"},
      {"term": "Bar graph", "definition": "A graph that uses rectangular bars of different heights or lengths to compare data across categories"},
      {"term": "Scale", "definition": "The set of numbers along an axis that shows the values represented by each interval"},
      {"term": "Legend (key)", "definition": "A guide on a graph that explains what each symbol, colour, or pattern represents"}
    ]'::jsonb,
    'Indigenous communities have always gathered and interpreted data about their environment — tracking animal populations, seasonal changes, and weather patterns. Sharing this data orally through stories and visual records helped communities make important decisions about when to hunt, fish, or move camp.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SP4.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is many-to-one correspondence?', 'When one symbol on a pictograph represents more than one item. For example, one star might represent 5 students.', 'One symbol = many items', 2, 0),
    (v_tenant, v_ch, 'What must every pictograph include?', 'A legend (key) that shows what each symbol represents.', 'Without it, readers cannot interpret the data', 1, 1),
    (v_tenant, v_ch, 'What is a scale on a bar graph?', 'The set of numbers along an axis that shows the values at each interval (e.g., counting by 2s, 5s, or 10s).', 'It shows the number intervals', 2, 2),
    (v_tenant, v_ch, 'If one symbol = 10 items, what do 3.5 symbols represent?', '35 items. (3 symbols = 30, half a symbol = 5, total = 35)', 'Half symbol = half the value', 2, 3);


  -- ===================================================================
  -- UNIT 4: Shape and Space
  -- ===================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4,
    'Shape and Space',
    'Time, area, 3-D shapes, and symmetry',
    'Measurement and geometry help us describe, compare, and understand the physical world around us.',
    'How do measurement and geometry help us describe and make sense of the world around us?')
  RETURNING id INTO v_unit;

  -- ---------------------------------------------------------------
  -- Chapter 12: Time (SS4.1)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 12,
    'Telling Time and Calendar Dates',
    'telling-time-calendar',
    'Read digital and analog clocks and use various calendar date formats.',
    '[
      {"type": "heading", "content": "Telling Time and Calendar Dates", "level": 1},
      {"type": "text", "content": "Being able to read clocks and understand date formats is an important life skill. We use time to plan our day, and we use dates to organize events and record history."},
      {"type": "heading", "content": "Analog Clocks", "level": 2},
      {"type": "text", "content": "An analog clock has a short hand (hour hand) and a long hand (minute hand). The hour hand points to the hour, and the minute hand points to the minutes. There are 60 minutes in one hour. Each number on the clock represents 5 minutes for the minute hand."},
      {"type": "heading", "content": "Digital Clocks", "level": 2},
      {"type": "text", "content": "A digital clock shows time in numbers separated by a colon. For example, 3:45 means 3 hours and 45 minutes. Digital clocks may use a 12-hour format (with AM/PM) or a 24-hour format (where 13:00 is 1:00 PM)."},
      {"type": "heading", "content": "Elapsed Time", "level": 2},
      {"type": "text", "content": "Elapsed time is the amount of time that passes between two events. To find elapsed time, count forward from the start time to the end time. For example, from 2:15 PM to 4:45 PM, the elapsed time is 2 hours and 30 minutes."},
      {"type": "heading", "content": "Calendar Date Formats", "level": 2},
      {"type": "text", "content": "Dates can be written in different formats. In Canada, we commonly write dates as day/month/year (15/03/2025) or month day, year (March 15, 2025). The year-month-day format (2025-03-15) is the international standard. It is important to know which format is being used so you read dates correctly."},
      {"type": "quiz", "question": "If the short hand is pointing between 7 and 8, and the long hand is pointing to 6, what time is it?", "options": ["6:07", "7:30", "7:06", "8:30"], "correct": 1, "explanation": "The short hand between 7 and 8 means the hour is 7. The long hand on 6 means 30 minutes. The time is 7:30."},
      {"type": "quiz", "question": "How much time passes from 9:20 AM to 11:50 AM?", "options": ["2 hours 20 minutes", "2 hours 30 minutes", "3 hours 30 minutes", "2 hours 50 minutes"], "correct": 1, "explanation": "From 9:20 to 11:20 is 2 hours. From 11:20 to 11:50 is 30 minutes. Total: 2 hours 30 minutes."}
    ]'::jsonb,
    '[
      {"term": "Analog clock", "definition": "A clock with hour and minute hands that rotate around a numbered face"},
      {"term": "Digital clock", "definition": "A clock that displays time using numbers and a colon (e.g., 3:45)"},
      {"term": "Elapsed time", "definition": "The amount of time that passes between a start time and an end time"},
      {"term": "AM/PM", "definition": "AM covers midnight to noon; PM covers noon to midnight in the 12-hour time system"},
      {"term": "24-hour clock", "definition": "A time format where hours range from 0 to 23 (e.g., 14:30 means 2:30 PM)"}
    ]'::jsonb,
    'Indigenous peoples of the prairies used the sun, moon, and stars to tell time and track seasons. The position of the sun indicated time of day, while lunar cycles marked months. Seasonal observations guided activities like planting, hunting, and gathering.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS4.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What do the hands on an analog clock show?', 'The short hand shows the hour, and the long hand shows the minutes. Each number represents 5 minutes for the minute hand.', 'Short hand = hours, long hand = minutes', 1, 0),
    (v_tenant, v_ch, 'What is elapsed time?', 'The amount of time that passes between two events. For example, from 1:00 PM to 3:30 PM is 2 hours 30 minutes.', 'Count forward from start to end', 2, 1),
    (v_tenant, v_ch, 'What is 15:00 in 12-hour time?', '3:00 PM. Subtract 12 from hours greater than 12 to convert to 12-hour format.', 'Subtract 12 for PM times', 2, 2),
    (v_tenant, v_ch, 'How many minutes are in 1 hour?', '60 minutes.', 'Think of the clock face', 1, 3);

  -- ---------------------------------------------------------------
  -- Chapter 13: Measuring Area (SS4.2)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 13,
    'Measuring Area',
    'measuring-area',
    'Measure and estimate the area of 2-D shapes using square centimetres and square metres.',
    '[
      {"type": "heading", "content": "Measuring Area", "level": 1},
      {"type": "text", "content": "Area is the amount of surface a shape covers. We measure area in square units. A square centimetre (cm²) is a square that is 1 cm on each side. A square metre (m²) is a square that is 1 m on each side."},
      {"type": "heading", "content": "Counting Square Units", "level": 2},
      {"type": "text", "content": "To find the area of a shape drawn on a grid, count the number of square units inside the shape. For a rectangle, you can also multiply the length by the width. A rectangle that is 5 cm long and 3 cm wide has an area of 5 x 3 = 15 cm²."},
      {"type": "callout", "content": "Area = length x width (for rectangles and squares). This formula saves time compared to counting every square.", "style": "tip"},
      {"type": "heading", "content": "Estimating Area", "level": 2},
      {"type": "text", "content": "For irregular shapes, estimate area by counting full squares and partial squares. Count each full square as 1. If more than half a square is covered, count it. If less than half is covered, do not count it."},
      {"type": "heading", "content": "Choosing the Right Unit", "level": 2},
      {"type": "text", "content": "Use cm² for smaller surfaces like a book cover or a piece of paper. Use m² for larger surfaces like a classroom floor, a garden, or a hockey rink."},
      {"type": "quiz", "question": "What is the area of a rectangle that is 8 cm long and 4 cm wide?", "options": ["12 cm²", "24 cm²", "32 cm²", "36 cm²"], "correct": 2, "explanation": "Area = length x width = 8 x 4 = 32 cm²."},
      {"type": "quiz", "question": "Which unit would you use to measure the area of your classroom floor?", "options": ["cm²", "m²", "cm", "m"], "correct": 1, "explanation": "A classroom floor is a large surface, so square metres (m²) is the appropriate unit."}
    ]'::jsonb,
    '[
      {"term": "Area", "definition": "The amount of surface a 2-D shape covers, measured in square units"},
      {"term": "Square centimetre (cm²)", "definition": "A unit of area equal to a square with sides 1 cm long"},
      {"term": "Square metre (m²)", "definition": "A unit of area equal to a square with sides 1 m long"},
      {"term": "Grid", "definition": "A network of evenly spaced horizontal and vertical lines forming squares"}
    ]'::jsonb,
    'The design of a traditional tipi uses careful estimation of area. Builders needed to prepare hides covering the right amount of surface. Larger tipis required more hides, and understanding area helped determine the materials needed for different sizes of dwellings.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS4.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is area?', 'The amount of surface a 2-D shape covers, measured in square units (cm² or m²).', 'Think about covering a surface', 1, 0),
    (v_tenant, v_ch, 'How do you find the area of a rectangle?', 'Area = length x width. For example, a 6 cm by 4 cm rectangle has an area of 24 cm².', 'Multiply the two side lengths', 2, 1),
    (v_tenant, v_ch, 'When would you use m² instead of cm²?', 'Use m² for large surfaces like rooms, yards, or fields. Use cm² for small surfaces like book covers.', 'Big areas use big units', 1, 2),
    (v_tenant, v_ch, 'What is the area of a square with sides of 7 cm?', '49 cm² (7 x 7 = 49)', 'A square has equal sides', 2, 3);

  -- ---------------------------------------------------------------
  -- Chapter 14: 3-D Shapes — Prisms (SS4.3)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 14,
    'Rectangular and Triangular Prisms',
    'rectangular-triangular-prisms',
    'Identify, compare, and construct rectangular and triangular prisms.',
    '[
      {"type": "heading", "content": "Rectangular and Triangular Prisms", "level": 1},
      {"type": "text", "content": "Three-dimensional (3-D) shapes have length, width, and height. Unlike flat 2-D shapes, they take up space and have faces, edges, and vertices. Two important 3-D shapes are the rectangular prism and the triangular prism."},
      {"type": "heading", "content": "Rectangular Prisms", "level": 2},
      {"type": "text", "content": "A rectangular prism has 6 rectangular faces, 12 edges, and 8 vertices. A box, a brick, and a cereal box are all examples of rectangular prisms. A cube is a special rectangular prism where all faces are squares."},
      {"type": "heading", "content": "Triangular Prisms", "level": 2},
      {"type": "text", "content": "A triangular prism has 5 faces (2 triangular and 3 rectangular), 9 edges, and 6 vertices. A tent shape and a Toblerone box are examples of triangular prisms."},
      {"type": "list", "items": ["Face: a flat surface of a 3-D shape", "Edge: the line segment where two faces meet", "Vertex: a corner point where three or more edges meet (plural: vertices)"], "ordered": false},
      {"type": "heading", "content": "Building and Describing Prisms", "level": 2},
      {"type": "text", "content": "You can build prisms using nets — flat patterns that fold into 3-D shapes. A net for a rectangular prism is made of 6 connected rectangles. A net for a triangular prism includes 2 triangles and 3 rectangles."},
      {"type": "callout", "content": "A prism is named by the shape of its two identical end faces (bases). A triangular prism has triangular bases; a rectangular prism has rectangular bases.", "style": "info"},
      {"type": "quiz", "question": "How many faces does a rectangular prism have?", "options": ["4", "5", "6", "8"], "correct": 2, "explanation": "A rectangular prism has 6 faces — the top, bottom, front, back, left, and right."},
      {"type": "quiz", "question": "How many edges does a triangular prism have?", "options": ["6", "8", "9", "12"], "correct": 2, "explanation": "A triangular prism has 9 edges: 3 on each triangular base (6 total) plus 3 connecting edges between the bases."}
    ]'::jsonb,
    '[
      {"term": "Face", "definition": "A flat surface on a 3-D shape"},
      {"term": "Edge", "definition": "The line segment where two faces of a 3-D shape meet"},
      {"term": "Vertex", "definition": "A point where two or more edges meet on a 3-D shape (plural: vertices)"},
      {"term": "Prism", "definition": "A 3-D shape with two identical parallel bases connected by rectangular faces"},
      {"term": "Net", "definition": "A 2-D pattern that can be folded to form a 3-D shape"}
    ]'::jsonb,
    'Traditional First Nations structures demonstrate understanding of 3-D geometry. Tipis are examples of cones, while some food storage structures and sweat lodges use prism-like shapes. The engineering of these structures required intuitive understanding of faces, edges, and structural strength.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS4.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a rectangular prism?', 'A 3-D shape with 6 rectangular faces, 12 edges, and 8 vertices. Examples include boxes and bricks.', 'Think of a shoebox', 1, 0),
    (v_tenant, v_ch, 'How is a triangular prism different from a rectangular prism?', 'A triangular prism has triangular bases (5 faces, 9 edges, 6 vertices) while a rectangular prism has rectangular bases (6 faces, 12 edges, 8 vertices).', 'Compare the bases', 2, 1),
    (v_tenant, v_ch, 'What is a net?', 'A flat 2-D pattern that can be folded to create a 3-D shape.', 'Unfold a box to see its net', 2, 2),
    (v_tenant, v_ch, 'What is the difference between a face, an edge, and a vertex?', 'A face is a flat surface, an edge is where two faces meet, and a vertex is a corner point where edges meet.', 'Surface, line, point', 2, 3);

  -- ---------------------------------------------------------------
  -- Chapter 15: Line Symmetry (SS4.4)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 15,
    'Line Symmetry',
    'line-symmetry',
    'Identify, create, and draw lines of symmetry in 2-D shapes.',
    '[
      {"type": "heading", "content": "Line Symmetry", "level": 1},
      {"type": "text", "content": "A shape has line symmetry if you can fold it along a line and both halves match exactly. The fold line is called the line of symmetry (also known as the axis of symmetry)."},
      {"type": "heading", "content": "Finding Lines of Symmetry", "level": 2},
      {"type": "text", "content": "Some shapes have one line of symmetry, some have many, and some have none. A square has 4 lines of symmetry. A rectangle has 2. A circle has infinite lines of symmetry. An irregular blob might have none."},
      {"type": "callout", "content": "To test for symmetry, imagine folding the shape along the line. If both sides match perfectly, it is a line of symmetry. You can also use a mirror — place the mirror on the line and see if the reflection completes the shape.", "style": "tip"},
      {"type": "heading", "content": "Symmetry in Letters and Shapes", "level": 2},
      {"type": "text", "content": "Many letters of the alphabet have lines of symmetry. The letter A has a vertical line of symmetry. The letter B has a horizontal line of symmetry. The letter H has both vertical and horizontal lines of symmetry."},
      {"type": "heading", "content": "Creating Symmetrical Designs", "level": 2},
      {"type": "text", "content": "To create a symmetrical design, draw half of the design on one side of the line of symmetry, then mirror it on the other side. Every point on one side should have a matching point on the other side, at the same distance from the line."},
      {"type": "quiz", "question": "How many lines of symmetry does a square have?", "options": ["1", "2", "4", "8"], "correct": 2, "explanation": "A square has 4 lines of symmetry: one vertical, one horizontal, and two diagonal."},
      {"type": "quiz", "question": "Does an equilateral triangle have line symmetry?", "options": ["No, it has no lines of symmetry", "Yes, it has 1 line of symmetry", "Yes, it has 2 lines of symmetry", "Yes, it has 3 lines of symmetry"], "correct": 3, "explanation": "An equilateral triangle has 3 lines of symmetry, each going from one vertex to the midpoint of the opposite side."}
    ]'::jsonb,
    '[
      {"term": "Line of symmetry", "definition": "A line that divides a shape into two identical halves that are mirror images of each other"},
      {"term": "Symmetrical", "definition": "A shape or design that has at least one line of symmetry"},
      {"term": "Mirror image", "definition": "A reflection of a shape that is identical but reversed"},
      {"term": "Axis of symmetry", "definition": "Another name for a line of symmetry"}
    ]'::jsonb,
    'Symmetry is a fundamental element of First Nations and Metis art. Star blankets exhibit four-fold symmetry, beadwork patterns use bilateral symmetry, and traditional designs on clothing, tools, and ceremonial objects all demonstrate a deep aesthetic and mathematical appreciation of balance and mirror images.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS4.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a line of symmetry?', 'A line that divides a shape into two identical halves that are mirror images of each other.', 'Fold test: do both halves match?', 1, 0),
    (v_tenant, v_ch, 'How many lines of symmetry does a rectangle have?', '2 lines of symmetry: one vertical and one horizontal.', 'Not the diagonals — those do not produce matching halves for a non-square rectangle', 2, 1),
    (v_tenant, v_ch, 'Does a scalene triangle have any lines of symmetry?', 'No. A scalene triangle has all different side lengths, so it cannot be folded into two matching halves.', 'All sides are different', 2, 2),
    (v_tenant, v_ch, 'How can you test if a line is a line of symmetry?', 'Fold the shape along the line. If both halves match exactly, it is a line of symmetry. You can also use a mirror.', 'Fold or mirror test', 1, 3);

  -- Update textbook chapter count
  UPDATE textbooks SET chapter_count = 15 WHERE id = v_book;

END $$;


-- ============================================================================
-- GRADE 5: WolfWhale Foundations of Math 5
-- Outcomes: N5.1-N5.7, P5.1-P5.2, SP5.1-SP5.3, SS5.1-SS5.7
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book UUID;
  v_unit UUID;
  v_ch UUID;
  v_oc UUID;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-foundations-of-math-5';

  -- ===================================================================
  -- UNIT 1: Number Sense and Operations
  -- ===================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1,
    'Number Sense and Operations',
    'Whole numbers to 1,000,000; multi-digit multiplication and division; fractions and decimals to thousandths',
    'Our place value system extends to represent very large numbers and very precise decimals. Flexible strategies for computation build mathematical fluency.',
    'How can understanding place value and number relationships help us compute efficiently with large numbers and decimals?')
  RETURNING id INTO v_unit;

  -- ---------------------------------------------------------------
  -- Chapter 1: Place Value to 1,000,000 (N5.1)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 1,
    'Place Value to 1,000,000',
    'place-value-to-1000000',
    'Represent, compare, and describe whole numbers to one million within the base-ten system.',
    '[
      {"type": "heading", "content": "Place Value to 1,000,000", "level": 1},
      {"type": "text", "content": "In Grade 5, we extend our understanding of place value to numbers up to one million. Our base-ten system continues the same pattern: each place is worth ten times the place to its right. After thousands come ten thousands, then hundred thousands, then millions."},
      {"type": "heading", "content": "Place Value Chart", "level": 2},
      {"type": "text", "content": "Consider the number 583,291. The digit 5 is in the hundred thousands place (worth 500,000). The 8 is in the ten thousands place (80,000). The 3 is in the thousands place (3,000). The 2 is in the hundreds place (200). The 9 is in the tens place (90). The 1 is in the ones place (1)."},
      {"type": "callout", "content": "We use spaces or commas to separate groups of three digits, making large numbers easier to read. In Canada, both formats are acceptable: 583,291 or 583 291.", "style": "info"},
      {"type": "heading", "content": "Comparing and Ordering Large Numbers", "level": 2},
      {"type": "text", "content": "To compare large numbers, start with the leftmost digit and compare place by place. If one number has more digits, it is automatically greater (assuming no leading zeros)."},
      {"type": "callout", "content": "Example: Compare 456,789 and 457,123. The hundred thousands (4) are equal. The ten thousands (5) are equal. The thousands: 6 < 7, so 456,789 < 457,123.", "style": "example"},
      {"type": "heading", "content": "Representing Numbers in Different Forms", "level": 2},
      {"type": "text", "content": "Numbers can be written in standard form (725,400), expanded form (700,000 + 25,000 + 400), or word form (seven hundred twenty-five thousand four hundred). Being able to move between these forms builds number sense."},
      {"type": "quiz", "question": "What is the value of the digit 7 in 274,036?", "options": ["7", "700", "7,000", "70,000"], "correct": 3, "explanation": "The digit 7 is in the ten thousands place, so its value is 70,000."},
      {"type": "quiz", "question": "Which number is the greatest: 899,999 or 900,001?", "options": ["899,999", "900,001", "They are equal"], "correct": 1, "explanation": "Compare the hundred thousands: 8 < 9, so 900,001 > 899,999."}
    ]'::jsonb,
    '[
      {"term": "Million", "definition": "The number 1,000,000 — one thousand thousands"},
      {"term": "Hundred thousands", "definition": "The sixth place value from the right, worth 100,000"},
      {"term": "Ten thousands", "definition": "The fifth place value from the right, worth 10,000"},
      {"term": "Period", "definition": "A group of three digits separated by a comma or space (ones period, thousands period, millions period)"},
      {"term": "Base-ten system", "definition": "Our number system where each place value is ten times the place to its right"}
    ]'::jsonb,
    'Before European contact, the plains were home to enormous bison herds estimated at 30 to 60 million animals. Indigenous peoples had ways of describing vast quantities that reflected their deep relationship with these animals and the landscape.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N5.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'How many zeros are in one million?', 'Six zeros: 1,000,000.', 'One million is one thousand thousands', 1, 0),
    (v_tenant, v_ch, 'What is the expanded form of 302,450?', '300,000 + 2,000 + 400 + 50', 'Break each digit into its place value', 2, 1),
    (v_tenant, v_ch, 'What place value is the 6 in 867,321?', 'Ten thousands (60,000)', 'Count positions from the right', 2, 2),
    (v_tenant, v_ch, 'What is a period in place value?', 'A group of three digits separated by commas or spaces. The ones period has ones/tens/hundreds; the thousands period has thousands/ten thousands/hundred thousands.', 'Groups of three', 2, 3),
    (v_tenant, v_ch, 'Order from least to greatest: 500,100; 499,999; 500,010.', '499,999; 500,010; 500,100. Compare from the leftmost digit.', 'Look at the hundred thousands first', 3, 4);

  -- ---------------------------------------------------------------
  -- Chapter 2: Multiplying Whole Numbers (N5.2)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 2,
    'Multiplying Whole Numbers',
    'multiplying-whole-numbers',
    'Develop and apply strategies for multi-digit multiplication.',
    '[
      {"type": "heading", "content": "Multiplying Whole Numbers", "level": 1},
      {"type": "text", "content": "In Grade 5, we extend multiplication to larger numbers, including multiplying 2-digit by 2-digit numbers and 3-digit by 2-digit numbers. We build on the strategies learned in Grade 4 and develop fluency with the standard algorithm."},
      {"type": "heading", "content": "Multiplying 2-Digit by 2-Digit", "level": 2},
      {"type": "text", "content": "To multiply 34 x 26, use partial products. Think of 26 as 20 + 6. Multiply 34 x 20 = 680, then 34 x 6 = 204. Add: 680 + 204 = 884."},
      {"type": "callout", "content": "You can also use an area model: draw a rectangle split into sections representing 30 x 20, 30 x 6, 4 x 20, and 4 x 6. Then add all four products: 600 + 180 + 80 + 24 = 884.", "style": "tip"},
      {"type": "heading", "content": "The Standard Algorithm", "level": 2},
      {"type": "text", "content": "In the standard algorithm, multiply the top number by each digit of the bottom number separately, then add the results. When multiplying by the tens digit, shift the result one place to the left (or add a zero)."},
      {"type": "callout", "content": "Example: 145 x 23. First, 145 x 3 = 435. Then, 145 x 20 = 2,900. Add: 435 + 2,900 = 3,335.", "style": "example"},
      {"type": "heading", "content": "Estimation", "level": 2},
      {"type": "text", "content": "Always estimate first. For 145 x 23, round to 150 x 20 = 3,000. The exact answer of 3,335 is close to this estimate, confirming reasonableness."},
      {"type": "quiz", "question": "What is 45 x 32?", "options": ["1,340", "1,440", "1,540", "1,640"], "correct": 1, "explanation": "45 x 30 = 1,350 and 45 x 2 = 90. Sum: 1,350 + 90 = 1,440."},
      {"type": "quiz", "question": "Estimate 287 x 19 by rounding.", "options": ["About 4,000", "About 5,000", "About 6,000", "About 3,000"], "correct": 2, "explanation": "Round to 300 x 20 = 6,000. The exact answer is 5,453, which is close to this estimate."}
    ]'::jsonb,
    '[
      {"term": "Area model", "definition": "A visual strategy that uses a rectangle divided into sections to organize partial products in multiplication"},
      {"term": "Standard algorithm", "definition": "The traditional step-by-step multiplication method where you multiply by each digit and add the results"},
      {"term": "Partial products", "definition": "The individual products obtained by multiplying parts of numbers, which are then summed"}
    ]'::jsonb,
    'Large-scale community projects in First Nations communities, such as building a longhouse or preparing for a powwow, required calculating quantities of materials. Multiplying the number of families by the resources needed per family is a practical application of multi-digit multiplication.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N5.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Describe the area model for multiplication.', 'A rectangle is divided into sections based on place value. Each section is a partial product. Add them all to get the total product.', 'Think of a rectangle split into parts', 2, 0),
    (v_tenant, v_ch, 'Calculate 56 x 43.', '2,408. (56 x 40 = 2,240 and 56 x 3 = 168; 2,240 + 168 = 2,408)', 'Use partial products', 3, 1),
    (v_tenant, v_ch, 'Why do we shift left when multiplying by the tens digit?', 'Because the tens digit represents groups of ten. Multiplying by 20 is like multiplying by 2 and then by 10, which shifts the result one place left.', 'The digit is really 20, not 2', 3, 2),
    (v_tenant, v_ch, 'Estimate 312 x 48.', 'About 15,000. (300 x 50 = 15,000)', 'Round both numbers first', 2, 3);

  -- ---------------------------------------------------------------
  -- Chapter 3: Dividing with Larger Numbers (N5.3)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 3,
    'Dividing with Larger Numbers',
    'dividing-larger-numbers',
    'Divide 3-digit numbers by 1-digit divisors and interpret remainders in context.',
    '[
      {"type": "heading", "content": "Dividing with Larger Numbers", "level": 1},
      {"type": "text", "content": "In Grade 5, we divide 3-digit numbers by 1-digit divisors. Division can be thought of as sharing equally or making equal groups. When a number does not divide evenly, the remainder must be interpreted based on the context of the problem."},
      {"type": "heading", "content": "Long Division", "level": 2},
      {"type": "text", "content": "Long division breaks a large division problem into smaller, manageable steps. Follow these steps: Divide, Multiply, Subtract, Bring down. Repeat until no digits remain."},
      {"type": "callout", "content": "Example: 846 ÷ 3. Divide: 8 ÷ 3 = 2 R2. Multiply: 2 x 3 = 6. Subtract: 8 − 6 = 2. Bring down the 4 to get 24. Divide: 24 ÷ 3 = 8. Bring down 6. Divide: 6 ÷ 3 = 2. Answer: 282.", "style": "example"},
      {"type": "heading", "content": "Interpreting Remainders", "level": 2},
      {"type": "text", "content": "The meaning of a remainder depends on the situation. Consider 135 students going on a field trip in vans that hold 8 students each. 135 ÷ 8 = 16 R7. The remainder means 7 extra students still need a van, so you need 17 vans total. You round up."},
      {"type": "callout", "content": "Sometimes you ignore the remainder (dividing cookies equally and eating the extras), sometimes you round up (needing enough vans for everyone), and sometimes the remainder IS the answer (how many are left over).", "style": "tip"},
      {"type": "heading", "content": "Estimation in Division", "level": 2},
      {"type": "text", "content": "Use compatible numbers to estimate quotients. For 637 ÷ 7, think of 630 ÷ 7 = 90. So the answer is close to 90 (the exact answer is 91)."},
      {"type": "quiz", "question": "What is 756 ÷ 4?", "options": ["186", "189", "191", "194"], "correct": 1, "explanation": "756 ÷ 4: 7 ÷ 4 = 1 R3, bring down 5 → 35 ÷ 4 = 8 R3, bring down 6 → 36 ÷ 4 = 9. Answer: 189."},
      {"type": "quiz", "question": "A baker has 250 muffins to pack into boxes of 6. How many full boxes can she make?", "options": ["41", "42", "41 R4", "40"], "correct": 0, "explanation": "250 ÷ 6 = 41 R4. She can make 41 full boxes with 4 muffins left over."}
    ]'::jsonb,
    '[
      {"term": "Long division", "definition": "A step-by-step procedure for dividing large numbers: Divide, Multiply, Subtract, Bring down"},
      {"term": "Compatible numbers", "definition": "Numbers that are close to the actual numbers and easy to divide mentally, used for estimation"},
      {"term": "Interpret the remainder", "definition": "Deciding what to do with the remainder based on the context of the problem"},
      {"term": "Quotient", "definition": "The result of a division operation"}
    ]'::jsonb,
    'When sharing a community harvest such as a large catch of fish or a harvest of wild berries, Indigenous families needed to divide resources fairly among many people. Understanding how to divide large quantities and deal with remainders was essential for equitable distribution.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N5.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are the steps of long division?', 'Divide, Multiply, Subtract, Bring down. Repeat until there are no more digits to bring down.', 'DMSB — Does McDonald Sell Burgers?', 2, 0),
    (v_tenant, v_ch, 'Calculate 945 ÷ 5.', '189. (9÷5=1R4, 44÷5=8R4, 45÷5=9)', 'Use long division', 3, 1),
    (v_tenant, v_ch, 'When should you round up a remainder?', 'When the situation requires a complete group for everyone or everything. For example, needing buses for a trip — you need an extra bus for the remaining people.', 'Think about whether partial groups work', 2, 2),
    (v_tenant, v_ch, 'What are compatible numbers?', 'Numbers close to the actual values that are easy to divide mentally, used for estimation. For example, using 630 ÷ 7 = 90 to estimate 637 ÷ 7.', 'Numbers that divide evenly', 2, 3);

  -- ---------------------------------------------------------------
  -- Chapter 4: Estimation Strategies (N5.4)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 4,
    'Estimation Strategies',
    'estimation-strategies',
    'Develop and apply personal strategies for estimation including front-end rounding, compensation, and compatible numbers.',
    '[
      {"type": "heading", "content": "Estimation Strategies", "level": 1},
      {"type": "text", "content": "Estimation is the process of finding an approximate answer. Good estimators use different strategies depending on the situation. Estimation helps us check calculations, make quick decisions, and determine if an exact answer is reasonable."},
      {"type": "heading", "content": "Front-End Estimation", "level": 2},
      {"type": "text", "content": "Look at the leading digits and ignore the rest. For 4,782 + 3,215, use 4,000 + 3,000 = 7,000. This gives a quick, rough estimate. For better accuracy, adjust by looking at the remaining digits."},
      {"type": "heading", "content": "Rounding", "level": 2},
      {"type": "text", "content": "Round each number to the nearest ten, hundred, or thousand before computing. For 387 + 612, round to 400 + 600 = 1,000. The exact answer is 999 — very close!"},
      {"type": "heading", "content": "Compensation", "level": 2},
      {"type": "text", "content": "Adjust one number to make it easier, then compensate. For 298 + 145, think of 298 as 300 (adding 2), then 300 + 145 = 445, then subtract the 2 back: 445 − 2 = 443."},
      {"type": "heading", "content": "Compatible Numbers", "level": 2},
      {"type": "text", "content": "Choose numbers close to the actual values that are easy to compute with. For 347 ÷ 7, think 350 ÷ 7 = 50 (exact answer is about 49.6)."},
      {"type": "callout", "content": "There is no single best estimation strategy. Choose the one that works best for each situation. The goal is to get a reasonable answer quickly.", "style": "tip"},
      {"type": "quiz", "question": "Use front-end estimation for 5,874 + 2,318.", "options": ["About 7,000", "About 8,000", "About 8,200", "About 7,200"], "correct": 0, "explanation": "Using front-end estimation: 5,000 + 2,000 = 7,000. (The exact answer is 8,192, so adjusting with the remaining digits would improve the estimate.)"},
      {"type": "quiz", "question": "Use compensation to calculate 497 + 235.", "options": ["732", "722", "742", "712"], "correct": 0, "explanation": "Think: 500 + 235 = 735, then subtract the 3 you added: 735 − 3 = 732."}
    ]'::jsonb,
    '[
      {"term": "Front-end estimation", "definition": "An estimation method that uses the leading (leftmost) digits and ignores the rest"},
      {"term": "Compensation", "definition": "An estimation strategy where you adjust a number to make it easier, then compensate by adding or subtracting the difference"},
      {"term": "Compatible numbers", "definition": "Numbers close to the actual values that are easy to compute with mentally"},
      {"term": "Rounding", "definition": "Replacing a number with a nearby number that ends in zero to simplify calculation"},
      {"term": "Reasonable", "definition": "An answer that makes sense and is close to what you would expect"}
    ]'::jsonb,
    'Indigenous hunters and gatherers were skilled estimators. Estimating the number of animals in a herd, the distance to a lake, or the amount of food needed for winter required mental mathematics and a strong sense of quantity — skills passed down through generations.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N5.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is front-end estimation?', 'Using the leading digits to estimate, ignoring the rest. For 6,312 + 1,845, estimate 6,000 + 1,000 = 7,000.', 'Look at the first digits only', 2, 0),
    (v_tenant, v_ch, 'What is the compensation strategy?', 'Adjust one number to make it easier, compute, then compensate for the adjustment. For 199 + 48, think 200 + 48 = 248, then subtract 1: 247.', 'Adjust, compute, correct', 2, 1),
    (v_tenant, v_ch, 'Estimate 423 x 8 using rounding.', 'About 3,200 (400 x 8 = 3,200). The exact answer is 3,384.', 'Round to the nearest hundred', 2, 2),
    (v_tenant, v_ch, 'When is estimation most useful?', 'When checking if an exact answer is reasonable, making quick decisions, or when an exact answer is not needed.', 'Think about real-life situations', 1, 3);

  -- ---------------------------------------------------------------
  -- Chapter 5: Equivalent Fractions (N5.5)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 5,
    'Equivalent Fractions',
    'equivalent-fractions',
    'Create sets of equivalent fractions and compare fractions with like and unlike denominators.',
    '[
      {"type": "heading", "content": "Equivalent Fractions", "level": 1},
      {"type": "text", "content": "Equivalent fractions are different fractions that represent the same amount. For example, 1/2, 2/4, 3/6, and 4/8 are all equivalent — they all represent one half."},
      {"type": "heading", "content": "Finding Equivalent Fractions", "level": 2},
      {"type": "text", "content": "Multiply or divide both the numerator and denominator by the same number to find an equivalent fraction. For example, 3/4 = 6/8 (multiply both by 2) = 9/12 (multiply both by 3). Similarly, 8/12 = 4/6 = 2/3 (divide both by 2 each time)."},
      {"type": "callout", "content": "A fraction is in simplest form when the numerator and denominator have no common factor other than 1. For example, 2/3 is in simplest form, but 4/6 is not.", "style": "info"},
      {"type": "heading", "content": "Comparing Fractions with Unlike Denominators", "level": 2},
      {"type": "text", "content": "To compare 2/3 and 3/5, find a common denominator. The least common denominator of 3 and 5 is 15. Rewrite: 2/3 = 10/15 and 3/5 = 9/15. Since 10/15 > 9/15, we know 2/3 > 3/5."},
      {"type": "callout", "content": "You can also use benchmark fractions. Is each fraction more or less than 1/2? 2/3 > 1/2 and 3/5 > 1/2, so both are greater than half. We need the common denominator method for a more precise comparison.", "style": "tip"},
      {"type": "heading", "content": "Ordering Fractions", "level": 2},
      {"type": "text", "content": "To order fractions from least to greatest, convert them all to the same denominator, then compare numerators. You can also place fractions on a number line to visualise their order."},
      {"type": "quiz", "question": "Which fraction is equivalent to 3/5?", "options": ["5/3", "6/10", "3/10", "9/20"], "correct": 1, "explanation": "3/5 = 6/10. Both the numerator and denominator were multiplied by 2."},
      {"type": "quiz", "question": "Which is greater: 4/7 or 3/5?", "options": ["4/7", "3/5", "They are equal"], "correct": 1, "explanation": "Convert to a common denominator of 35: 4/7 = 20/35 and 3/5 = 21/35. Since 21 > 20, 3/5 > 4/7."}
    ]'::jsonb,
    '[
      {"term": "Equivalent fractions", "definition": "Fractions that represent the same value, such as 1/2 and 3/6"},
      {"term": "Simplest form", "definition": "A fraction where the numerator and denominator share no common factor other than 1"},
      {"term": "Common denominator", "definition": "A shared denominator used to compare or add fractions with different denominators"},
      {"term": "Least common denominator", "definition": "The smallest number that is a multiple of both denominators"}
    ]'::jsonb,
    'Sharing food and resources equally is a core value in many Indigenous cultures. When dividing a catch of fish among community members, the concept of equivalence — ensuring that 2 out of 4 is the same share as 1 out of 2 — is practically applied.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N5.5';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are equivalent fractions?', 'Different fractions that represent the same value. For example, 1/2 = 2/4 = 3/6.', 'Same amount, different numbers', 2, 0),
    (v_tenant, v_ch, 'How do you find an equivalent fraction?', 'Multiply or divide both the numerator and denominator by the same non-zero number.', 'What you do to the top, do to the bottom', 2, 1),
    (v_tenant, v_ch, 'What does simplest form mean?', 'A fraction is in simplest form when the numerator and denominator have no common factor other than 1.', '6/8 simplifies to 3/4', 2, 2),
    (v_tenant, v_ch, 'How do you compare fractions with different denominators?', 'Find a common denominator, rewrite both fractions, then compare the numerators.', 'Make the denominators the same first', 3, 3);

  -- ---------------------------------------------------------------
  -- Chapter 6: Decimals to Thousandths (N5.6)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 6,
    'Decimals to Thousandths',
    'decimals-to-thousandths',
    'Describe, represent, relate to fractions, compare, and order decimals to thousandths.',
    '[
      {"type": "heading", "content": "Decimals to Thousandths", "level": 1},
      {"type": "text", "content": "In Grade 5, we extend our understanding of decimals to the thousandths place. The first place after the decimal point is tenths (0.1), the second is hundredths (0.01), and the third is thousandths (0.001)."},
      {"type": "heading", "content": "Reading Thousandths", "level": 2},
      {"type": "text", "content": "The number 4.356 is read as four and three hundred fifty-six thousandths. The 3 is in the tenths place (3/10), the 5 is in the hundredths place (5/100), and the 6 is in the thousandths place (6/1000)."},
      {"type": "heading", "content": "Connecting Decimals and Fractions", "level": 2},
      {"type": "text", "content": "Decimals and fractions are two ways of writing the same values. 0.5 = 5/10 = 1/2. 0.75 = 75/100 = 3/4. 0.125 = 125/1000 = 1/8. Understanding this connection deepens your number sense."},
      {"type": "heading", "content": "Comparing and Ordering Decimals", "level": 2},
      {"type": "text", "content": "Compare decimals by looking at each place from left to right. To compare 0.456 and 0.46, add a zero to make 0.460. Now compare: 0.456 < 0.460. So 0.456 < 0.46."},
      {"type": "callout", "content": "Adding trailing zeros after the last decimal digit does not change the value: 0.4 = 0.40 = 0.400. Use this trick to compare decimals with different numbers of decimal places.", "style": "tip"},
      {"type": "quiz", "question": "What is the value of the 7 in 3.274?", "options": ["7 tenths", "7 hundredths", "7 thousandths", "7 ones"], "correct": 1, "explanation": "In 3.274, the 2 is in the tenths place, the 7 is in the hundredths place (7/100), and the 4 is in the thousandths place."},
      {"type": "quiz", "question": "Order from least to greatest: 0.8, 0.08, 0.800, 0.088.", "options": ["0.08, 0.088, 0.8, 0.800", "0.08, 0.8, 0.088, 0.800", "0.800, 0.8, 0.088, 0.08", "0.08, 0.088, 0.800, 0.8"], "correct": 0, "explanation": "0.08 = 0.080, 0.088, 0.8 = 0.800. In order: 0.08 < 0.088 < 0.8 = 0.800."}
    ]'::jsonb,
    '[
      {"term": "Thousandths", "definition": "The third decimal place, representing parts out of 1,000"},
      {"term": "Trailing zeros", "definition": "Zeros added to the end of a decimal that do not change its value (e.g., 0.5 = 0.500)"},
      {"term": "Decimal fraction", "definition": "A fraction with a denominator that is a power of 10 (10, 100, 1000)"}
    ]'::jsonb,
    'Modern Indigenous communities interact with precise measurements daily, from weather readings tracking temperature to thousandths of a degree in scientific studies, to land survey measurements that affect treaty rights and territorial boundaries.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N5.6';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the thousandths place?', 'The third digit to the right of the decimal point. In 2.345, the 5 is in the thousandths place.', 'Tenths, hundredths, thousandths', 1, 0),
    (v_tenant, v_ch, 'Write 0.625 as a fraction.', '625/1000, which simplifies to 5/8.', 'Three decimal places = thousandths', 3, 1),
    (v_tenant, v_ch, 'Which is greater: 0.09 or 0.1?', '0.1 is greater. 0.1 = 0.10, and 0.10 > 0.09.', 'Add a zero to compare: 0.10 vs 0.09', 2, 2),
    (v_tenant, v_ch, 'Do trailing zeros change a decimal value?', 'No. 0.5, 0.50, and 0.500 all represent the same value (five tenths).', 'Zeros at the end do nothing', 1, 3);

  -- ---------------------------------------------------------------
  -- Chapter 7: Adding and Subtracting Decimals to Thousandths (N5.7)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 7,
    'Adding and Subtracting Decimals to Thousandths',
    'adding-subtracting-decimals-thousandths',
    'Add and subtract decimals to thousandths using place value strategies.',
    '[
      {"type": "heading", "content": "Adding and Subtracting Decimals to Thousandths", "level": 1},
      {"type": "text", "content": "Adding and subtracting decimals to thousandths follows the same rules as simpler decimals: align the decimal points, add placeholder zeros if needed, and compute from right to left."},
      {"type": "heading", "content": "Adding Decimals to Thousandths", "level": 2},
      {"type": "text", "content": "To add 3.456 + 2.178, align the decimal points and add from the thousandths place. Thousandths: 6 + 8 = 14 (write 4, carry 1). Hundredths: 5 + 7 + 1 = 13 (write 3, carry 1). Tenths: 4 + 1 + 1 = 6. Ones: 3 + 2 = 5. Answer: 5.634."},
      {"type": "heading", "content": "Subtracting Decimals to Thousandths", "level": 2},
      {"type": "text", "content": "To subtract 8.500 − 3.247, align decimal points. Thousandths: 0 − 7 (regroup). Hundredths: 10 − 4 becomes 9 − 4 after regrouping. Work through carefully. Answer: 5.253."},
      {"type": "callout", "content": "When one number has fewer decimal places, pad with zeros: 4.5 + 2.178 becomes 4.500 + 2.178 = 6.678.", "style": "tip"},
      {"type": "heading", "content": "Estimating to Check", "level": 2},
      {"type": "text", "content": "Round each decimal to the nearest whole number to estimate. For 3.456 + 2.178, estimate 3 + 2 = 5. The exact answer of 5.634 is close to 5, confirming the answer is reasonable."},
      {"type": "quiz", "question": "What is 5.237 + 1.468?", "options": ["6.605", "6.695", "6.705", "7.705"], "correct": 2, "explanation": "Thousandths: 7+8=15 (write 5, carry 1). Hundredths: 3+6+1=10 (write 0, carry 1). Tenths: 2+4+1=7. Ones: 5+1=6. Answer: 6.705."},
      {"type": "quiz", "question": "What is 7.000 − 2.345?", "options": ["4.655", "4.755", "5.655", "4.665"], "correct": 0, "explanation": "Regroup from left to right. 7.000 − 2.345 = 4.655. Check: 4.655 + 2.345 = 7.000."}
    ]'::jsonb,
    '[
      {"term": "Align decimal points", "definition": "Placing numbers so that the decimal points and place values line up vertically"},
      {"term": "Placeholder zero", "definition": "A zero added to give numbers the same number of decimal places for easier computation"},
      {"term": "Regroup", "definition": "Borrow from the next higher place value when a digit is too small to subtract from"}
    ]'::jsonb,
    'Environmental monitoring on First Nations land often involves precise decimal measurements — water quality readings, temperature data, and soil composition are all recorded to thousandths. These measurements support land stewardship and treaty rights.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N5.7';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the first step when adding or subtracting decimals?', 'Align the decimal points so that each place value is in the correct column.', 'Line up the dots', 1, 0),
    (v_tenant, v_ch, 'Calculate 4.123 + 3.897.', '8.020 (or 8.02)', 'Add from the thousandths place, carrying as needed', 3, 1),
    (v_tenant, v_ch, 'Calculate 6.400 − 2.175.', '4.225', 'Add zeros first: 6.400 − 2.175, then regroup', 3, 2),
    (v_tenant, v_ch, 'Why add placeholder zeros before computing?', 'So both numbers have the same number of decimal places, making it easier to align and compute without errors.', 'Equal number of decimal places', 1, 3);


  -- ===================================================================
  -- UNIT 2: Patterns and Relations
  -- ===================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2,
    'Patterns and Relations',
    'Analyzing, representing, and applying patterns; solving equations with variables',
    'Patterns reveal relationships between quantities that can be expressed using rules, tables, and equations.',
    'How do mathematical patterns and equations help us model and solve real-world situations?')
  RETURNING id INTO v_unit;

  -- ---------------------------------------------------------------
  -- Chapter 8: Patterns and Pattern Rules (P5.1)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 8,
    'Patterns and Pattern Rules',
    'patterns-and-pattern-rules',
    'Represent, analyse, and apply patterns using mathematical language and notation.',
    '[
      {"type": "heading", "content": "Patterns and Pattern Rules", "level": 1},
      {"type": "text", "content": "A pattern rule describes how a pattern works. In Grade 5, we express pattern rules using mathematical language and notation, and we analyse patterns that involve more than simple addition or subtraction."},
      {"type": "heading", "content": "Describing Patterns with Rules", "level": 2},
      {"type": "text", "content": "Consider the pattern 2, 6, 18, 54, ... Each term is multiplied by 3. The pattern rule is: start at 2, multiply by 3 each time. We can also write: term = 2 x 3^(n-1) where n is the term number."},
      {"type": "heading", "content": "Tables of Values", "level": 2},
      {"type": "text", "content": "A table of values organises the relationship between two quantities. The input (independent variable) determines the output (dependent variable). For example, if the rule is multiply by 4 then add 1: input 1 → output 5, input 2 → output 9, input 3 → output 13."},
      {"type": "callout", "content": "When looking for a pattern rule in a table, check the differences between consecutive outputs. If the differences are constant, the rule involves addition or subtraction. If the differences change, the rule may involve multiplication.", "style": "tip"},
      {"type": "heading", "content": "Extending and Creating Patterns", "level": 2},
      {"type": "text", "content": "Once you identify a pattern rule, you can extend the pattern to find any term. You can also create your own patterns by choosing a starting value and a rule."},
      {"type": "quiz", "question": "What is the 6th term in the pattern: 5, 10, 15, 20, 25, ...?", "options": ["25", "30", "35", "40"], "correct": 1, "explanation": "The rule is add 5. The 6th term is 25 + 5 = 30."},
      {"type": "quiz", "question": "In a table, inputs are 1, 2, 3, 4 and outputs are 3, 5, 7, 9. What is the pattern rule?", "options": ["Multiply by 3", "Multiply by 2 then add 1", "Add 3", "Add 2"], "correct": 1, "explanation": "Input 1: 1 x 2 + 1 = 3. Input 2: 2 x 2 + 1 = 5. Input 3: 3 x 2 + 1 = 7. The rule is multiply by 2 then add 1."}
    ]'::jsonb,
    '[
      {"term": "Pattern rule", "definition": "A mathematical description of how a pattern is generated, often expressed as a formula or set of instructions"},
      {"term": "Table of values", "definition": "An organized display showing corresponding input and output values for a pattern or relationship"},
      {"term": "Term", "definition": "Each number or object in a pattern sequence"},
      {"term": "Variable", "definition": "A letter or symbol used to represent an unknown or changing quantity"}
    ]'::jsonb,
    'Patterns in nature were central to Indigenous knowledge systems. Migration patterns of birds and caribou, seasonal changes, and growth patterns of plants were all observed, described, and used to make predictions — a natural form of pattern analysis.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'P5.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a pattern rule?', 'A mathematical description of how to generate the terms in a pattern. Example: Start at 3, add 4 each time (3, 7, 11, 15...).', 'How the pattern works', 2, 0),
    (v_tenant, v_ch, 'What is a table of values?', 'A table showing paired input and output values that follow a pattern rule.', 'Two columns: input and output', 1, 1),
    (v_tenant, v_ch, 'Find the pattern rule for: 4, 12, 36, 108...', 'Start at 4, multiply by 3. Each term is 3 times the previous term.', 'Look at the ratio between terms', 3, 2),
    (v_tenant, v_ch, 'What is a variable?', 'A letter or symbol that represents an unknown or changing quantity, such as n or x.', 'A letter standing for a number', 1, 3);

  -- ---------------------------------------------------------------
  -- Chapter 9: Solving Equations (P5.2)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 9,
    'Solving Equations',
    'solving-equations',
    'Write, solve, and verify solutions of one-step equations with whole number coefficients.',
    '[
      {"type": "heading", "content": "Solving Equations", "level": 1},
      {"type": "text", "content": "An equation states that two expressions are equal. In Grade 5, we solve one-step equations by finding the value of a variable that makes the equation true. We use letters like n, x, or y instead of shapes to represent unknowns."},
      {"type": "heading", "content": "Writing Equations from Word Problems", "level": 2},
      {"type": "text", "content": "A word problem like ''A number plus 8 equals 23'' can be written as n + 8 = 23. The variable n represents the unknown number. To solve, think: what number plus 8 gives 23?"},
      {"type": "heading", "content": "Solving Using Inverse Operations", "level": 2},
      {"type": "text", "content": "Use the inverse operation to isolate the variable. For n + 8 = 23, subtract 8 from both sides: n = 23 − 8 = 15. For 5n = 35 (meaning 5 times n), divide both sides by 5: n = 35 ÷ 5 = 7."},
      {"type": "list", "items": ["Addition equation: n + 12 = 30 → n = 30 − 12 = 18", "Subtraction equation: n − 7 = 15 → n = 15 + 7 = 22", "Multiplication equation: 6n = 42 → n = 42 ÷ 6 = 7", "Division equation: n ÷ 4 = 9 → n = 9 x 4 = 36"], "ordered": false},
      {"type": "heading", "content": "Verifying Solutions", "level": 2},
      {"type": "text", "content": "Always substitute your answer back into the original equation to verify. For n + 8 = 23 with n = 15: check 15 + 8 = 23. Correct!"},
      {"type": "callout", "content": "Writing the check step is just as important as finding the answer. It proves your solution is correct.", "style": "tip"},
      {"type": "quiz", "question": "Solve: n − 14 = 28", "options": ["n = 14", "n = 42", "n = 32", "n = 22"], "correct": 1, "explanation": "n = 28 + 14 = 42. Check: 42 − 14 = 28. Correct!"},
      {"type": "quiz", "question": "Solve: 7n = 63", "options": ["n = 7", "n = 8", "n = 9", "n = 56"], "correct": 2, "explanation": "n = 63 ÷ 7 = 9. Check: 7 x 9 = 63. Correct!"}
    ]'::jsonb,
    '[
      {"term": "Equation", "definition": "A mathematical statement that two expressions are equal, connected by an equals sign"},
      {"term": "Variable", "definition": "A letter representing an unknown number in an equation"},
      {"term": "Coefficient", "definition": "A number multiplied by a variable (in 5n, the coefficient is 5)"},
      {"term": "Isolate the variable", "definition": "Using operations to get the variable alone on one side of the equation"},
      {"term": "Verify", "definition": "Checking your solution by substituting it back into the original equation"}
    ]'::jsonb,
    'The principle of balance reflected in equations connects to the Indigenous concept of reciprocity — maintaining balance in relationships with the land and community. When resources are given, something of equal value is expected in return, mirroring mathematical equality.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'P5.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a coefficient?', 'A number multiplied by a variable. In the expression 5n, 5 is the coefficient.', 'The number in front of the letter', 2, 0),
    (v_tenant, v_ch, 'Solve n + 25 = 40.', 'n = 15. (40 − 25 = 15. Check: 15 + 25 = 40.)', 'Subtract to undo addition', 2, 1),
    (v_tenant, v_ch, 'Why is verifying your solution important?', 'Substituting the solution back into the original equation proves it is correct and catches errors.', 'Plug it back in', 2, 2),
    (v_tenant, v_ch, 'Write an equation for: A number divided by 3 equals 12.', 'n ÷ 3 = 12. Solving: n = 12 x 3 = 36.', 'Translate words to math symbols', 3, 3);


  -- ===================================================================
  -- UNIT 3: Statistics and Probability
  -- ===================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3,
    'Statistics and Probability',
    'First-hand and second-hand data, double bar graphs, and probability',
    'Data can be collected, organized, and displayed in ways that help us compare, interpret, and make informed decisions.',
    'How do we collect, display, and interpret data to compare information and predict outcomes?')
  RETURNING id INTO v_unit;

  -- ---------------------------------------------------------------
  -- Chapter 10: First-Hand and Second-Hand Data (SP5.1)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 10,
    'First-Hand and Second-Hand Data',
    'first-hand-second-hand-data',
    'Differentiate between first-hand and second-hand data and understand when each is appropriate.',
    '[
      {"type": "heading", "content": "First-Hand and Second-Hand Data", "level": 1},
      {"type": "text", "content": "Data is information collected to answer a question. Where the data comes from matters. Understanding the source helps us evaluate how reliable and useful the data is."},
      {"type": "heading", "content": "First-Hand Data", "level": 2},
      {"type": "text", "content": "First-hand data is data you collect yourself through observations, surveys, experiments, or measurements. For example, surveying your classmates about their favourite sport or measuring the height of plants in a school garden."},
      {"type": "heading", "content": "Second-Hand Data", "level": 2},
      {"type": "text", "content": "Second-hand data is data collected by someone else that you access from sources like books, websites, databases, or newspapers. For example, looking up the population of Canadian cities online."},
      {"type": "callout", "content": "First-hand data is best when you need specific, current information for your exact question. Second-hand data is useful when the data already exists or would be too difficult or expensive to collect yourself.", "style": "info"},
      {"type": "heading", "content": "Evaluating Data Sources", "level": 2},
      {"type": "text", "content": "When using second-hand data, consider: Who collected it? When was it collected? Is it reliable? Is the sample size large enough? These questions help you judge the quality of the data."},
      {"type": "quiz", "question": "A student counts the birds she sees in her backyard over one week. Is this first-hand or second-hand data?", "options": ["First-hand", "Second-hand"], "correct": 0, "explanation": "She collected the data herself through her own observations, so it is first-hand data."},
      {"type": "quiz", "question": "Which is an example of second-hand data?", "options": ["Timing how long it takes classmates to run 100 m", "Counting cars in the school parking lot", "Looking up average temperatures in a book", "Surveying students about lunch preferences"], "correct": 2, "explanation": "The temperature data was collected by someone else and published in a book, making it second-hand data."}
    ]'::jsonb,
    '[
      {"term": "Data", "definition": "Facts, numbers, or information collected to answer a question or solve a problem"},
      {"term": "First-hand data", "definition": "Data you collect yourself through observation, surveys, experiments, or measurement"},
      {"term": "Second-hand data", "definition": "Data that was collected by someone else, accessed from published sources"},
      {"term": "Survey", "definition": "A method of collecting first-hand data by asking people questions"},
      {"term": "Reliable", "definition": "Data that can be trusted because it was collected carefully and accurately"}
    ]'::jsonb,
    'Indigenous knowledge keepers have always been careful data collectors, observing wildlife populations, weather patterns, and seasonal changes over many generations. This first-hand knowledge, passed down through oral tradition, represents some of the longest-running environmental datasets on the continent.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SP5.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is first-hand data?', 'Data you collect yourself through observation, surveys, experiments, or measurement.', 'You gather it directly', 1, 0),
    (v_tenant, v_ch, 'What is second-hand data?', 'Data collected by someone else that you access from books, websites, or databases.', 'Someone else collected it', 1, 1),
    (v_tenant, v_ch, 'When is first-hand data better than second-hand data?', 'When you need specific, current data tailored to your exact question.', 'When existing data does not match your needs', 2, 2),
    (v_tenant, v_ch, 'What should you consider when using second-hand data?', 'Who collected it, when it was collected, the sample size, and whether the source is reliable.', 'Evaluate the source', 2, 3);

  -- ---------------------------------------------------------------
  -- Chapter 11: Double Bar Graphs (SP5.2)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 11,
    'Double Bar Graphs',
    'double-bar-graphs',
    'Construct and interpret double bar graphs to draw conclusions.',
    '[
      {"type": "heading", "content": "Double Bar Graphs", "level": 1},
      {"type": "text", "content": "A double bar graph displays two sets of data side by side for comparison. This makes it easy to see similarities and differences between groups."},
      {"type": "heading", "content": "Reading Double Bar Graphs", "level": 2},
      {"type": "text", "content": "A double bar graph has pairs of bars for each category. A legend shows which colour or pattern represents each data set. For example, one colour might represent boys and another girls when comparing favourite sports."},
      {"type": "heading", "content": "Constructing Double Bar Graphs", "level": 2},
      {"type": "list", "items": ["Choose an appropriate title for the graph", "Label the horizontal axis with categories and the vertical axis with a scale", "Choose a scale that fits the data (count by 2s, 5s, or 10s)", "Draw pairs of bars for each category, using different colours or patterns", "Include a legend that explains the colours or patterns"], "ordered": true},
      {"type": "heading", "content": "Drawing Conclusions", "level": 2},
      {"type": "text", "content": "When interpreting a double bar graph, compare the heights of bars within and across categories. Ask: Which category shows the biggest difference between the two groups? Which category is most similar? What trends or patterns can you identify?"},
      {"type": "callout", "content": "A double bar graph is ideal when comparing two related sets of data across the same categories. If you only have one set of data, a single bar graph is sufficient.", "style": "tip"},
      {"type": "quiz", "question": "What makes a double bar graph different from a single bar graph?", "options": ["It uses pictures instead of bars", "It displays two data sets side by side", "It has no scale", "It only compares two categories"], "correct": 1, "explanation": "A double bar graph displays two related data sets using paired bars for easy comparison."},
      {"type": "quiz", "question": "In a double bar graph comparing favourite fruits between Grade 4 and Grade 5, the Grade 5 bar for apples is twice as tall as the Grade 4 bar. What can you conclude?", "options": ["Grade 5 students ate twice as many apples", "Twice as many Grade 5 students chose apples as their favourite", "Apples are more popular overall", "Grade 4 students do not like apples"], "correct": 1, "explanation": "The bar heights represent how many students in each grade chose apples, so twice as many Grade 5 students selected apples as their favourite."}
    ]'::jsonb,
    '[
      {"term": "Double bar graph", "definition": "A graph that uses pairs of bars to compare two related sets of data across the same categories"},
      {"term": "Legend", "definition": "A key on a graph that explains what each colour, pattern, or symbol represents"},
      {"term": "Scale", "definition": "The set of numbers along the axis showing the values each interval represents"},
      {"term": "Category", "definition": "A group or type used to organise and classify data (e.g., sports, colours, months)"}
    ]'::jsonb,
    'Data comparison is vital in modern Indigenous governance. Band councils use comparative data — such as enrolment figures for different years or health outcomes across communities — to advocate for resources and make informed policy decisions.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SP5.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a double bar graph?', 'A graph that uses pairs of bars to compare two related data sets across the same categories.', 'Two bars per category', 1, 0),
    (v_tenant, v_ch, 'What must a double bar graph always include?', 'A title, labelled axes, a scale, paired bars with different colours/patterns, and a legend.', 'Think about what makes it readable', 2, 1),
    (v_tenant, v_ch, 'When should you use a double bar graph?', 'When you want to compare two related sets of data across the same categories.', 'Comparing two groups', 2, 2),
    (v_tenant, v_ch, 'How do you choose a scale for a bar graph?', 'Pick intervals that fit the data range. If the largest value is 50, count by 5s or 10s.', 'Look at the largest data value', 2, 3);

  -- ---------------------------------------------------------------
  -- Chapter 12: Probability (SP5.3)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 12,
    'Probability',
    'probability-grade5',
    'Describe, compare, predict, and test the likelihood of outcomes in probability situations.',
    '[
      {"type": "heading", "content": "Probability", "level": 1},
      {"type": "text", "content": "Probability describes how likely it is that an event will happen. We use words like impossible, unlikely, equally likely, likely, and certain to describe probability."},
      {"type": "heading", "content": "The Probability Line", "level": 2},
      {"type": "text", "content": "Probability can be placed on a line from 0 (impossible) to 1 (certain). An event with a probability of 1/2 is equally likely to happen or not happen, like flipping a fair coin."},
      {"type": "heading", "content": "Describing Probability with Fractions", "level": 2},
      {"type": "text", "content": "Probability = number of favourable outcomes ÷ total number of possible outcomes. If a bag has 3 red marbles and 7 blue marbles (10 total), the probability of drawing red is 3/10."},
      {"type": "callout", "content": "The probability of all possible outcomes always adds up to 1 (or 100%). If the probability of rain is 3/10, the probability of no rain is 7/10.", "style": "info"},
      {"type": "heading", "content": "Predicting and Testing", "level": 2},
      {"type": "text", "content": "You can predict what will happen based on theoretical probability, then test your prediction by conducting experiments. The more trials you do, the closer your experimental results will match the theoretical probability."},
      {"type": "quiz", "question": "A spinner has 4 equal sections: red, blue, green, yellow. What is the probability of landing on blue?", "options": ["1/2", "1/3", "1/4", "1/5"], "correct": 2, "explanation": "There are 4 equal sections, and 1 is blue. Probability = 1/4."},
      {"type": "quiz", "question": "If you flip a coin 100 times, about how many times would you expect heads?", "options": ["Exactly 50", "About 50", "Always more than 50", "25"], "correct": 1, "explanation": "The theoretical probability of heads is 1/2, so you would expect about 50 heads, though the exact number may vary."}
    ]'::jsonb,
    '[
      {"term": "Probability", "definition": "A measure of how likely an event is to occur, expressed as a number from 0 to 1"},
      {"term": "Outcome", "definition": "A possible result of a probability experiment"},
      {"term": "Favourable outcome", "definition": "The specific outcome you are interested in"},
      {"term": "Theoretical probability", "definition": "The expected probability based on mathematical reasoning"},
      {"term": "Experimental probability", "definition": "Probability determined by conducting experiments and observing results"}
    ]'::jsonb,
    'Traditional Indigenous games of chance, such as the stick game (also called the bone game), involve probability concepts. Players predict outcomes based on an understanding of equally likely events, and strategy combines with chance in ways that mirror mathematical probability.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SP5.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is probability?', 'A measure of how likely an event is to happen, expressed as a number from 0 (impossible) to 1 (certain).', '0 to 1 scale', 1, 0),
    (v_tenant, v_ch, 'How do you calculate probability as a fraction?', 'Probability = number of favourable outcomes ÷ total number of possible outcomes.', 'Favourable over total', 2, 1),
    (v_tenant, v_ch, 'What is the difference between theoretical and experimental probability?', 'Theoretical is calculated from reasoning; experimental is determined by doing the experiment and recording results.', 'Predicted vs. observed', 3, 2),
    (v_tenant, v_ch, 'A bag has 5 red and 3 blue marbles. What is the probability of drawing blue?', '3/8. There are 3 blue out of 8 total marbles.', 'Count favourable and total', 2, 3);


  -- ===================================================================
  -- UNIT 4: Shape and Space
  -- ===================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4,
    'Shape and Space',
    'Perimeter and area, length measurement, volume and capacity, geometry, and transformations',
    'Measurement connects number to the physical world, and geometric properties help us classify, describe, and transform shapes.',
    'How do measurement and geometric properties help us understand and interact with the physical world?')
  RETURNING id INTO v_unit;

  -- ---------------------------------------------------------------
  -- Chapter 13: Perimeter and Area of Rectangles (SS5.1)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 13,
    'Perimeter and Area of Rectangles',
    'perimeter-area-rectangles',
    'Design and construct rectangles given perimeter or area, and explore the relationship between perimeter and area.',
    '[
      {"type": "heading", "content": "Perimeter and Area of Rectangles", "level": 1},
      {"type": "text", "content": "Perimeter is the total distance around a shape. Area is the amount of surface inside a shape. For rectangles, there are simple formulas for both, but what is interesting is that shapes with the same perimeter can have different areas, and shapes with the same area can have different perimeters."},
      {"type": "heading", "content": "Perimeter of a Rectangle", "level": 2},
      {"type": "text", "content": "Perimeter = 2 x (length + width). A rectangle that is 8 cm by 3 cm has a perimeter of 2 x (8 + 3) = 2 x 11 = 22 cm."},
      {"type": "heading", "content": "Area of a Rectangle", "level": 2},
      {"type": "text", "content": "Area = length x width. The same 8 cm by 3 cm rectangle has an area of 8 x 3 = 24 cm²."},
      {"type": "heading", "content": "Same Perimeter, Different Area", "level": 2},
      {"type": "text", "content": "Consider all rectangles with a perimeter of 20 cm: 1x9 (area 9), 2x8 (area 16), 3x7 (area 21), 4x6 (area 24), 5x5 (area 25). The square has the greatest area! Rectangles with the same perimeter can have very different areas."},
      {"type": "callout", "content": "For a given perimeter, the shape closest to a square will have the greatest area. For a given area, the shape closest to a square will have the smallest perimeter.", "style": "tip"},
      {"type": "quiz", "question": "A rectangle has a length of 12 cm and a width of 5 cm. What is its area?", "options": ["17 cm²", "34 cm²", "60 cm²", "120 cm²"], "correct": 2, "explanation": "Area = length x width = 12 x 5 = 60 cm²."},
      {"type": "quiz", "question": "Two rectangles both have an area of 36 cm². One is 6 cm by 6 cm and the other is 9 cm by 4 cm. Which has the smaller perimeter?", "options": ["6 cm by 6 cm (perimeter 24 cm)", "9 cm by 4 cm (perimeter 26 cm)", "They have the same perimeter"], "correct": 0, "explanation": "6x6: P = 2(6+6) = 24 cm. 9x4: P = 2(9+4) = 26 cm. The square has the smaller perimeter."}
    ]'::jsonb,
    '[
      {"term": "Perimeter", "definition": "The total distance around the outside of a shape"},
      {"term": "Area", "definition": "The amount of surface inside a shape, measured in square units"},
      {"term": "Formula", "definition": "A mathematical rule expressed using symbols and numbers"}
    ]'::jsonb,
    'When planning a garden or building a structure, Indigenous peoples needed to think about both the distance around an area (perimeter for fencing) and the surface covered (area for planting or flooring). Community gardens and gathering spaces were designed with these practical measurements in mind.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS5.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the formula for the perimeter of a rectangle?', 'P = 2 x (length + width), or P = 2l + 2w.', 'Add the two dimensions, then double', 2, 0),
    (v_tenant, v_ch, 'What is the formula for the area of a rectangle?', 'A = length x width.', 'Multiply the two dimensions', 2, 1),
    (v_tenant, v_ch, 'For a given perimeter, which rectangle has the greatest area?', 'The square. For any perimeter, the square maximizes the area.', 'Equal sides = most area', 3, 2),
    (v_tenant, v_ch, 'A rectangle is 7 cm by 3 cm. What is its perimeter?', '20 cm. P = 2(7 + 3) = 2(10) = 20 cm.', 'Add sides, then double', 2, 3);

  -- ---------------------------------------------------------------
  -- Chapter 14: Measurement and Volume (SS5.2, SS5.3, SS5.4)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 14,
    'Length, Volume, and Capacity',
    'length-volume-capacity',
    'Measure length in millimetres, volume in cubic units, and capacity in millilitres and litres.',
    '[
      {"type": "heading", "content": "Length, Volume, and Capacity", "level": 1},
      {"type": "text", "content": "In Grade 5, we work with millimetres for precise length measurement, cubic centimetres and cubic metres for volume, and millilitres and litres for capacity. These measurements help us describe the physical world accurately."},
      {"type": "heading", "content": "Measuring Length in Millimetres", "level": 2},
      {"type": "text", "content": "A millimetre (mm) is one tenth of a centimetre. There are 10 mm in 1 cm, 100 cm in 1 m, and therefore 1,000 mm in 1 m. Millimetres are used for very precise measurements, such as the thickness of a coin or the width of a pencil lead."},
      {"type": "heading", "content": "Understanding Volume", "level": 2},
      {"type": "text", "content": "Volume is the amount of space a 3-D object takes up. We measure volume in cubic units. A cubic centimetre (cm³) is a cube with 1 cm sides. To find the volume of a rectangular prism, multiply length x width x height."},
      {"type": "callout", "content": "Volume of a rectangular prism = length x width x height. A box that is 5 cm x 3 cm x 2 cm has a volume of 5 x 3 x 2 = 30 cm³.", "style": "example"},
      {"type": "heading", "content": "Understanding Capacity", "level": 2},
      {"type": "text", "content": "Capacity is the amount of liquid a container can hold. We use millilitres (mL) and litres (L). There are 1,000 mL in 1 L. A water bottle holds about 500 mL. A kitchen sink holds about 20 L."},
      {"type": "callout", "content": "Volume and capacity are related: 1 cm³ = 1 mL. So a container with a volume of 500 cm³ holds 500 mL of liquid.", "style": "info"},
      {"type": "quiz", "question": "How many millimetres are in 4.5 cm?", "options": ["4.5 mm", "45 mm", "450 mm", "0.45 mm"], "correct": 1, "explanation": "1 cm = 10 mm, so 4.5 cm = 4.5 x 10 = 45 mm."},
      {"type": "quiz", "question": "What is the volume of a box that is 6 cm long, 4 cm wide, and 3 cm tall?", "options": ["13 cm³", "48 cm³", "72 cm³", "36 cm³"], "correct": 2, "explanation": "Volume = 6 x 4 x 3 = 72 cm³."}
    ]'::jsonb,
    '[
      {"term": "Millimetre (mm)", "definition": "A unit of length equal to one tenth of a centimetre (10 mm = 1 cm)"},
      {"term": "Volume", "definition": "The amount of space a 3-D object occupies, measured in cubic units"},
      {"term": "Cubic centimetre (cm³)", "definition": "A unit of volume equal to a cube with 1 cm sides"},
      {"term": "Capacity", "definition": "The amount of liquid a container can hold, measured in mL or L"},
      {"term": "Litre (L)", "definition": "A unit of capacity equal to 1,000 millilitres"}
    ]'::jsonb,
    'Traditional birch bark containers, clay vessels, and leather bags were designed to hold specific quantities of food, water, and medicines. Indigenous artisans intuitively understood capacity and volume, creating containers of various sizes for different purposes.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS5.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS5.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS5.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'How many mm are in 1 cm?', '10 mm = 1 cm.', 'Milli means thousandth, but 10 mm per cm', 1, 0),
    (v_tenant, v_ch, 'What is the formula for volume of a rectangular prism?', 'Volume = length x width x height.', 'Multiply three dimensions', 2, 1),
    (v_tenant, v_ch, 'How are volume and capacity related?', '1 cm³ = 1 mL. So a 250 cm³ container holds 250 mL of liquid.', 'Cubic cm equals mL', 3, 2),
    (v_tenant, v_ch, 'How many mL are in 2.5 L?', '2,500 mL. (2.5 x 1,000 = 2,500)', '1 L = 1,000 mL', 2, 3);

  -- ---------------------------------------------------------------
  -- Chapter 15: Geometry — Quadrilaterals and Lines (SS5.5, SS5.6)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 15,
    'Lines and Quadrilaterals',
    'lines-and-quadrilaterals',
    'Identify parallel, intersecting, and perpendicular lines; sort and classify quadrilaterals.',
    '[
      {"type": "heading", "content": "Lines and Quadrilaterals", "level": 1},
      {"type": "text", "content": "Understanding the properties of lines and shapes helps us describe and classify geometric figures. In this chapter, we explore types of lines and the family of quadrilaterals."},
      {"type": "heading", "content": "Types of Lines", "level": 2},
      {"type": "list", "items": ["Parallel lines: lines that never meet and are always the same distance apart", "Intersecting lines: lines that cross at a point", "Perpendicular lines: intersecting lines that form right angles (90°)", "Horizontal lines: lines that go left to right (parallel to the ground)", "Vertical lines: lines that go up and down (perpendicular to the ground)"], "ordered": false},
      {"type": "heading", "content": "Quadrilaterals", "level": 2},
      {"type": "text", "content": "A quadrilateral is any polygon with exactly four sides. Quadrilaterals are classified by their side lengths, parallel sides, and angle types."},
      {"type": "list", "items": ["Rectangle: 4 right angles, opposite sides equal and parallel", "Square: 4 right angles, all sides equal — a special rectangle and a special rhombus", "Parallelogram: opposite sides parallel and equal in length", "Rhombus: all four sides equal in length — a parallelogram with equal sides", "Trapezoid: exactly one pair of parallel sides"], "ordered": false},
      {"type": "callout", "content": "All squares are rectangles, and all squares are rhombuses, but not all rectangles are squares. Understanding these relationships helps classify shapes precisely.", "style": "info"},
      {"type": "quiz", "question": "Which quadrilateral has exactly one pair of parallel sides?", "options": ["Rectangle", "Rhombus", "Trapezoid", "Parallelogram"], "correct": 2, "explanation": "A trapezoid has exactly one pair of parallel sides."},
      {"type": "quiz", "question": "A shape has 4 equal sides and no right angles. What is it?", "options": ["Square", "Rectangle", "Rhombus", "Trapezoid"], "correct": 2, "explanation": "A rhombus has four equal sides. If it had right angles, it would be a square."}
    ]'::jsonb,
    '[
      {"term": "Parallel lines", "definition": "Lines in the same plane that never intersect and are always the same distance apart"},
      {"term": "Perpendicular lines", "definition": "Lines that intersect at right angles (90°)"},
      {"term": "Quadrilateral", "definition": "A polygon with exactly four sides and four vertices"},
      {"term": "Parallelogram", "definition": "A quadrilateral with two pairs of parallel sides"},
      {"term": "Trapezoid", "definition": "A quadrilateral with exactly one pair of parallel sides"}
    ]'::jsonb,
    'Traditional beadwork, quillwork, and basket weaving incorporate parallel, intersecting, and perpendicular lines in their geometric designs. Quadrilateral shapes appear frequently in blanket patterns, hide paintings, and architectural elements of traditional Indigenous structures.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS5.5';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS5.6';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are parallel lines?', 'Lines that are always the same distance apart and never intersect. Think of railroad tracks.', 'They never meet', 1, 0),
    (v_tenant, v_ch, 'What are perpendicular lines?', 'Lines that intersect at right angles (90 degrees). Think of the corner of a book.', '90 degree intersection', 2, 1),
    (v_tenant, v_ch, 'Is a square a rectangle?', 'Yes. A square is a special type of rectangle with all four sides equal. It has all the properties of a rectangle plus equal sides.', 'All squares are rectangles, not all rectangles are squares', 2, 2),
    (v_tenant, v_ch, 'What is a trapezoid?', 'A quadrilateral with exactly one pair of parallel sides.', 'Only one pair of parallel sides', 2, 3);

  -- ---------------------------------------------------------------
  -- Chapter 16: Transformations (SS5.7)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 16,
    'Transformations of 2-D Shapes',
    'transformations-2d-shapes',
    'Identify, create, and analyze translations, reflections, and rotations of 2-D shapes.',
    '[
      {"type": "heading", "content": "Transformations of 2-D Shapes", "level": 1},
      {"type": "text", "content": "A transformation changes the position, size, or orientation of a shape. In Grade 5, we study three types of transformations that change position without changing size: translations (slides), reflections (flips), and rotations (turns)."},
      {"type": "heading", "content": "Translations (Slides)", "level": 2},
      {"type": "text", "content": "A translation slides a shape in a straight line from one position to another. Every point moves the same distance in the same direction. The shape does not turn or flip — it stays exactly the same, just in a new location."},
      {"type": "heading", "content": "Reflections (Flips)", "level": 2},
      {"type": "text", "content": "A reflection flips a shape over a line (the line of reflection) to create a mirror image. Each point in the reflected shape is the same distance from the line as the original point, but on the opposite side."},
      {"type": "heading", "content": "Rotations (Turns)", "level": 2},
      {"type": "text", "content": "A rotation turns a shape around a fixed point (the centre of rotation). Common rotations are quarter turns (90°), half turns (180°), and full turns (360°). The shape stays the same size but changes its orientation."},
      {"type": "callout", "content": "In all three transformations, the shape itself does not change — it has the same size and shape before and after the transformation. Only its position or orientation changes.", "style": "info"},
      {"type": "quiz", "question": "Which transformation slides a shape without turning or flipping it?", "options": ["Reflection", "Rotation", "Translation", "Dilation"], "correct": 2, "explanation": "A translation (slide) moves every point of the shape the same distance in the same direction."},
      {"type": "quiz", "question": "If you flip a shape over a vertical line, what type of transformation is this?", "options": ["Translation", "Rotation", "Reflection", "Slide"], "correct": 2, "explanation": "Flipping a shape over a line creates a mirror image, which is a reflection."}
    ]'::jsonb,
    '[
      {"term": "Transformation", "definition": "A change in the position, size, or orientation of a shape"},
      {"term": "Translation", "definition": "A transformation that slides a shape in a straight line without turning or flipping it"},
      {"term": "Reflection", "definition": "A transformation that flips a shape over a line to create a mirror image"},
      {"term": "Rotation", "definition": "A transformation that turns a shape around a fixed point"},
      {"term": "Line of reflection", "definition": "The line over which a shape is flipped in a reflection"}
    ]'::jsonb,
    'Indigenous art uses all three transformations extensively. Beadwork patterns are created through translations (repeating motifs along a strip), reflections (mirror-image symmetry), and rotations (patterns radiating from a centre point, as seen in medicine wheel designs).',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS5.7';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a translation?', 'A slide that moves every point of a shape the same distance in the same direction, without turning or flipping.', 'Straight-line slide', 1, 0),
    (v_tenant, v_ch, 'What is a reflection?', 'A flip that creates a mirror image of a shape across a line of reflection.', 'Like looking in a mirror', 2, 1),
    (v_tenant, v_ch, 'What is a rotation?', 'A turn around a fixed point. Common rotations are 90° (quarter turn), 180° (half turn), and 360° (full turn).', 'Spinning around a point', 2, 2),
    (v_tenant, v_ch, 'Do transformations change the size of a shape?', 'No. Translations, reflections, and rotations change position or orientation but keep the shape the same size.', 'Same shape, different position', 1, 3);

  -- Update textbook chapter count
  UPDATE textbooks SET chapter_count = 16 WHERE id = v_book;

END $$;


-- ============================================================================
-- GRADE 6: WolfWhale Foundations of Math 6
-- Outcomes: N6.1-N6.9, P6.1-P6.3, SP6.1-SP6.2, SS6.1-SS6.5
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book UUID;
  v_unit UUID;
  v_ch UUID;
  v_oc UUID;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-foundations-of-math-6';

  -- ===================================================================
  -- UNIT 1: Number Sense and Operations
  -- ===================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1,
    'Number Sense and Operations',
    'Place value to millions, factors and multiples, order of operations, decimal operations, percent, integers, fractions, and ratio',
    'Our number system encompasses whole numbers, integers, fractions, decimals, ratios, and percents — different representations that are deeply connected and each useful in different contexts.',
    'How are whole numbers, fractions, decimals, percents, and integers connected, and when is each representation most useful?')
  RETURNING id INTO v_unit;

  -- ---------------------------------------------------------------
  -- Chapter 1: Place Value — Millions and Beyond (N6.1)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 1,
    'Place Value: Millions and Beyond',
    'place-value-millions',
    'Understand place value for numbers greater than one million and less than one thousandth.',
    '[
      {"type": "heading", "content": "Place Value: Millions and Beyond", "level": 1},
      {"type": "text", "content": "In Grade 6, we extend place value in both directions — to numbers greater than one million and to decimals smaller than one thousandth. Understanding the structure of our base-ten system helps us work with numbers of any size."},
      {"type": "heading", "content": "Numbers Greater Than One Million", "level": 2},
      {"type": "text", "content": "After the millions place come ten millions, hundred millions, and then billions. The number 45,600,000 is forty-five million six hundred thousand. Each group of three digits (separated by commas) forms a period: ones, thousands, millions, billions."},
      {"type": "heading", "content": "Very Small Decimals", "level": 2},
      {"type": "text", "content": "After thousandths come ten-thousandths (0.0001), hundred-thousandths (0.00001), and millionths (0.000001). These tiny values appear in science, engineering, and technology. A human hair is about 0.07 mm wide, and bacteria can be 0.001 mm."},
      {"type": "callout", "content": "The place value pattern always follows the same rule: each place is 10 times the place to its right and 1/10 of the place to its left. This applies in both directions from the decimal point.", "style": "info"},
      {"type": "heading", "content": "Powers of 10", "level": 2},
      {"type": "text", "content": "Multiplying by 10 shifts digits one place to the left. Dividing by 10 shifts digits one place to the right. Understanding this helps with mental math: 4.5 x 100 = 450, and 3,200 ÷ 10 = 320."},
      {"type": "quiz", "question": "What is the value of the 7 in 72,500,000?", "options": ["7 million", "70 million", "7 hundred thousand", "700 million"], "correct": 1, "explanation": "The 7 is in the ten millions place, so its value is 70,000,000 (70 million)."},
      {"type": "quiz", "question": "What is 3.456 x 1,000?", "options": ["3,456", "345.6", "34.56", "34,560"], "correct": 0, "explanation": "Multiplying by 1,000 shifts each digit three places to the left: 3.456 becomes 3,456."}
    ]'::jsonb,
    '[
      {"term": "Millions", "definition": "The place value representing groups of 1,000,000"},
      {"term": "Period", "definition": "A group of three digits separated by commas (ones, thousands, millions, billions)"},
      {"term": "Powers of 10", "definition": "Numbers obtained by multiplying 10 by itself: 10, 100, 1000, 10000, etc."},
      {"term": "Ten-thousandths", "definition": "The fourth decimal place, representing 1/10,000"},
      {"term": "Millionths", "definition": "The sixth decimal place, representing 1/1,000,000"}
    ]'::jsonb,
    'Canada has vast lands. Saskatchewan alone covers about 651,900 km². Understanding large numbers is essential when discussing territory sizes, population data, and treaty land areas — numbers that are significant to First Nations and Metis peoples.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N6.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What comes after the millions period?', 'The billions period: billions, ten billions, hundred billions.', 'Groups of three digits', 2, 0),
    (v_tenant, v_ch, 'What happens when you multiply a number by 100?', 'Each digit shifts two places to the left. For example, 5.6 x 100 = 560.', 'Two places for two zeros', 2, 1),
    (v_tenant, v_ch, 'What is the place value after thousandths?', 'Ten-thousandths (the fourth decimal place), representing 1/10,000.', 'Keep going right of the decimal', 2, 2),
    (v_tenant, v_ch, 'Write 8,350,000 in word form.', 'Eight million three hundred fifty thousand.', 'Read each period separately', 2, 3);

  -- ---------------------------------------------------------------
  -- Chapter 2: Factors and Multiples (N6.2)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 2,
    'Factors and Multiples',
    'factors-and-multiples',
    'Find factors and multiples of numbers less than 100 and understand their relationships.',
    '[
      {"type": "heading", "content": "Factors and Multiples", "level": 1},
      {"type": "text", "content": "Factors and multiples are two sides of the same coin. Factors are numbers that divide evenly into a given number. Multiples are the products you get when multiplying a number by 1, 2, 3, and so on."},
      {"type": "heading", "content": "Finding Factors", "level": 2},
      {"type": "text", "content": "The factors of 24 are: 1, 2, 3, 4, 6, 8, 12, and 24. To find all factors, start with 1 and the number itself, then check each number in between. Use factor pairs: 1 x 24, 2 x 12, 3 x 8, 4 x 6."},
      {"type": "heading", "content": "Finding Multiples", "level": 2},
      {"type": "text", "content": "The first six multiples of 7 are: 7, 14, 21, 28, 35, 42. Multiples are found by multiplying: 7 x 1, 7 x 2, 7 x 3, and so on. There are infinitely many multiples of any number."},
      {"type": "heading", "content": "Common Factors and Common Multiples", "level": 2},
      {"type": "text", "content": "Common factors are factors shared by two or more numbers. The greatest common factor (GCF) of 12 and 18 is 6. Common multiples are multiples shared by two numbers. The least common multiple (LCM) of 4 and 6 is 12."},
      {"type": "heading", "content": "Prime and Composite Numbers", "level": 2},
      {"type": "text", "content": "A prime number has exactly two factors: 1 and itself (e.g., 2, 3, 5, 7, 11, 13). A composite number has more than two factors (e.g., 4, 6, 8, 9, 10). The number 1 is neither prime nor composite."},
      {"type": "callout", "content": "2 is the only even prime number. Every other even number is divisible by 2, so it has at least three factors.", "style": "info"},
      {"type": "quiz", "question": "What are all the factors of 36?", "options": ["1, 2, 3, 4, 6, 9, 12, 18, 36", "1, 2, 3, 6, 12, 36", "1, 6, 36", "2, 3, 4, 6, 9, 12, 18"], "correct": 0, "explanation": "Factor pairs: 1x36, 2x18, 3x12, 4x9, 6x6. All factors: 1, 2, 3, 4, 6, 9, 12, 18, 36."},
      {"type": "quiz", "question": "What is the least common multiple of 6 and 8?", "options": ["48", "24", "12", "2"], "correct": 1, "explanation": "Multiples of 6: 6, 12, 18, 24... Multiples of 8: 8, 16, 24... The smallest shared multiple is 24."}
    ]'::jsonb,
    '[
      {"term": "Factor", "definition": "A number that divides evenly into another number with no remainder"},
      {"term": "Multiple", "definition": "The product of a number and any whole number (e.g., multiples of 5: 5, 10, 15, 20...)"},
      {"term": "Greatest common factor (GCF)", "definition": "The largest factor shared by two or more numbers"},
      {"term": "Least common multiple (LCM)", "definition": "The smallest multiple shared by two or more numbers"},
      {"term": "Prime number", "definition": "A number greater than 1 with exactly two factors: 1 and itself"},
      {"term": "Composite number", "definition": "A number greater than 1 with more than two factors"}
    ]'::jsonb,
    'Indigenous communities organized many activities around grouping — distributing resources, arranging people for ceremonies, and timing events with lunar cycles (approximately 28 days, with factors 1, 2, 4, 7, 14, 28). Understanding factors helped with practical organization.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N6.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the difference between factors and multiples?', 'Factors divide evenly into a number (factors of 12: 1,2,3,4,6,12). Multiples are products of a number (multiples of 3: 3,6,9,12...).', 'Factors go in, multiples go on', 2, 0),
    (v_tenant, v_ch, 'What is a prime number?', 'A number greater than 1 with exactly two factors: 1 and itself. Examples: 2, 3, 5, 7, 11, 13.', 'Only 1 and the number divide it', 2, 1),
    (v_tenant, v_ch, 'What is the GCF of 18 and 24?', '6. Factors of 18: 1,2,3,6,9,18. Factors of 24: 1,2,3,4,6,8,12,24. Shared: 1,2,3,6. Greatest: 6.', 'Find common factors, pick the biggest', 3, 2),
    (v_tenant, v_ch, 'What is the LCM of 3 and 5?', '15. Multiples of 3: 3,6,9,12,15... Multiples of 5: 5,10,15... First shared multiple: 15.', 'List multiples until one matches', 2, 3);

  -- ---------------------------------------------------------------
  -- Chapter 3: Order of Operations (N6.3)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 3,
    'Order of Operations',
    'order-of-operations',
    'Apply the order of operations to evaluate expressions with whole numbers.',
    '[
      {"type": "heading", "content": "Order of Operations", "level": 1},
      {"type": "text", "content": "When an expression has more than one operation, we need rules to determine which operation to do first. Without agreed-upon rules, the same expression could give different answers. The order of operations ensures everyone gets the same result."},
      {"type": "heading", "content": "The Rules (BEDMAS)", "level": 2},
      {"type": "list", "items": ["B — Brackets first (do what is inside brackets)", "E — Exponents (not covered in Grade 6)", "D/M — Division and Multiplication, from left to right", "A/S — Addition and Subtraction, from left to right"], "ordered": true},
      {"type": "callout", "content": "Division and multiplication have equal priority — do them in order from left to right. Same for addition and subtraction — left to right.", "style": "info"},
      {"type": "heading", "content": "Applying BEDMAS", "level": 2},
      {"type": "text", "content": "Evaluate 3 + 4 x 5. Multiplication first: 4 x 5 = 20. Then addition: 3 + 20 = 23. Without order of operations, you might incorrectly do 3 + 4 = 7, then 7 x 5 = 35."},
      {"type": "callout", "content": "Example with brackets: (3 + 4) x 5 = 7 x 5 = 35. The brackets change the order and therefore the answer!", "style": "example"},
      {"type": "heading", "content": "Multi-Step Examples", "level": 2},
      {"type": "text", "content": "Evaluate 20 − 3 x 4 + 8 ÷ 2. Step 1: Multiply: 3 x 4 = 12. Step 2: Divide: 8 ÷ 2 = 4. Step 3: Now do left to right: 20 − 12 + 4 = 12."},
      {"type": "quiz", "question": "Evaluate: 6 + 2 x 8", "options": ["64", "22", "48", "16"], "correct": 1, "explanation": "Multiplication first: 2 x 8 = 16. Then addition: 6 + 16 = 22."},
      {"type": "quiz", "question": "Evaluate: (10 + 5) x 3 − 9", "options": ["28", "36", "42", "54"], "correct": 1, "explanation": "Brackets: 10 + 5 = 15. Multiply: 15 x 3 = 45. Subtract: 45 − 9 = 36."}
    ]'::jsonb,
    '[
      {"term": "Order of operations", "definition": "The agreed-upon rules for the sequence in which operations are performed in a mathematical expression"},
      {"term": "BEDMAS", "definition": "A memory aid for order of operations: Brackets, Exponents, Division/Multiplication, Addition/Subtraction"},
      {"term": "Expression", "definition": "A mathematical phrase containing numbers and operations but no equals sign"},
      {"term": "Evaluate", "definition": "To calculate the value of an expression by following the order of operations"},
      {"term": "Brackets", "definition": "Symbols ( ) used to group parts of an expression that should be evaluated first"}
    ]'::jsonb,
    'Many Indigenous craft traditions follow a specific order of steps — preparing hides before sewing, soaking birch bark before shaping, or layering medicines in a specific sequence. The concept that order matters is embedded in many traditional practices, just as it matters in mathematical operations.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N6.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does BEDMAS stand for?', 'Brackets, Exponents, Division/Multiplication (left to right), Addition/Subtraction (left to right).', 'The order you follow', 2, 0),
    (v_tenant, v_ch, 'Evaluate: 5 + 3 x 2.', '11. Multiply first: 3 x 2 = 6. Then add: 5 + 6 = 11.', 'Multiplication before addition', 2, 1),
    (v_tenant, v_ch, 'Evaluate: (8 − 3) x (2 + 4).', '30. Brackets: 5 x 6 = 30.', 'Do brackets first, both of them', 2, 2),
    (v_tenant, v_ch, 'Are multiplication and division done at the same time?', 'They have equal priority. Do them from left to right as they appear in the expression.', 'Left to right for equal priority', 2, 3);

  -- ---------------------------------------------------------------
  -- Chapter 4: Multiplying and Dividing Decimals (N6.4)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 4,
    'Multiplying and Dividing Decimals',
    'multiplying-dividing-decimals',
    'Multiply and divide decimals by 1-digit whole numbers.',
    '[
      {"type": "heading", "content": "Multiplying and Dividing Decimals", "level": 1},
      {"type": "text", "content": "In Grade 6, we extend multiplication and division to include decimals. The procedures are similar to whole number operations, with extra attention to the placement of the decimal point."},
      {"type": "heading", "content": "Multiplying Decimals by Whole Numbers", "level": 2},
      {"type": "text", "content": "To multiply a decimal by a whole number, multiply as if both were whole numbers, then place the decimal point in the answer. The answer has the same number of decimal places as the decimal factor."},
      {"type": "callout", "content": "Example: 3.45 x 6. Multiply 345 x 6 = 2,070. Since 3.45 has 2 decimal places, the answer is 20.70 (or 20.7).", "style": "example"},
      {"type": "heading", "content": "Dividing Decimals by Whole Numbers", "level": 2},
      {"type": "text", "content": "To divide a decimal by a whole number, place the decimal point in the quotient directly above the decimal point in the dividend, then divide as usual."},
      {"type": "callout", "content": "Example: 14.4 ÷ 6. Set up long division: 14.4 ÷ 6. 6 goes into 14 twice (12), remainder 2. Bring down 4 to get 24. 6 goes into 24 exactly 4 times. Answer: 2.4.", "style": "example"},
      {"type": "heading", "content": "Estimating to Verify", "level": 2},
      {"type": "text", "content": "Always estimate to check your decimal placement. For 3.45 x 6, estimate 3.5 x 6 = 21. The exact answer of 20.7 is close, confirming the decimal is in the right spot."},
      {"type": "quiz", "question": "What is 4.8 x 5?", "options": ["2.40", "24.0", "240", "2.04"], "correct": 1, "explanation": "48 x 5 = 240. Since 4.8 has 1 decimal place, the answer is 24.0."},
      {"type": "quiz", "question": "What is 15.6 ÷ 3?", "options": ["0.52", "5.2", "52", "5.02"], "correct": 1, "explanation": "15 ÷ 3 = 5. 0.6 ÷ 3 = 0.2. Answer: 5.2. Check: 5.2 x 3 = 15.6."}
    ]'::jsonb,
    '[
      {"term": "Decimal factor", "definition": "A number with a decimal point that is being multiplied"},
      {"term": "Decimal places", "definition": "The number of digits to the right of the decimal point"},
      {"term": "Estimate", "definition": "An approximate answer used to check if the exact answer is reasonable"}
    ]'::jsonb,
    'When purchasing supplies for community events, calculating costs involves multiplying prices (decimals) by quantities. Dividing budgets equally among programs or families also uses decimal division — skills that support community financial management.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N6.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'How do you multiply a decimal by a whole number?', 'Ignore the decimal, multiply as whole numbers, then place the decimal in the answer with the same number of decimal places as the original decimal.', 'Count decimal places', 2, 0),
    (v_tenant, v_ch, 'Calculate 6.25 x 4.', '25.00 (or 25). Multiply 625 x 4 = 2500, then place the decimal 2 places from the right.', 'Two decimal places in 6.25', 3, 1),
    (v_tenant, v_ch, 'Calculate 18.9 ÷ 7.', '2.7. Place the decimal above, then divide as usual.', 'Keep the decimal in line', 3, 2),
    (v_tenant, v_ch, 'Why is estimation important with decimal operations?', 'It helps verify that the decimal point is in the correct position.', 'Catches decimal placement errors', 2, 3);

  -- ---------------------------------------------------------------
  -- Chapter 5: Percent (N6.5)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 5,
    'Understanding Percent',
    'understanding-percent',
    'Understand percent as parts per hundred and connect percent to fractions and decimals.',
    '[
      {"type": "heading", "content": "Understanding Percent", "level": 1},
      {"type": "text", "content": "Percent means per hundred. The symbol % represents a value out of 100. For example, 45% means 45 out of 100. Percent is useful because it gives us a common base (100) for comparing different quantities."},
      {"type": "heading", "content": "Connecting Percent, Fractions, and Decimals", "level": 2},
      {"type": "text", "content": "Percent, fractions, and decimals are three ways of expressing the same value. 50% = 50/100 = 1/2 = 0.50. 25% = 25/100 = 1/4 = 0.25. 75% = 75/100 = 3/4 = 0.75."},
      {"type": "callout", "content": "To convert a percent to a decimal, divide by 100 (move the decimal two places left): 35% = 0.35. To convert a decimal to a percent, multiply by 100: 0.8 = 80%.", "style": "tip"},
      {"type": "heading", "content": "Representing Percent Visually", "level": 2},
      {"type": "text", "content": "A 100-square grid is a helpful tool. Shading 37 out of 100 squares represents 37%. Circle graphs (pie charts) also use percent — the whole circle represents 100%."},
      {"type": "heading", "content": "Common Percent Benchmarks", "level": 2},
      {"type": "list", "items": ["100% = the whole amount", "50% = half", "25% = one quarter", "10% = one tenth", "1% = one hundredth"], "ordered": false},
      {"type": "quiz", "question": "What is 40% as a fraction in simplest form?", "options": ["40/100", "4/10", "2/5", "4/5"], "correct": 2, "explanation": "40% = 40/100 = 4/10 = 2/5 in simplest form."},
      {"type": "quiz", "question": "Convert 0.65 to a percent.", "options": ["6.5%", "65%", "0.65%", "650%"], "correct": 1, "explanation": "0.65 x 100 = 65%."}
    ]'::jsonb,
    '[
      {"term": "Percent", "definition": "A ratio that compares a number to 100, using the symbol %"},
      {"term": "Percent-fraction-decimal equivalence", "definition": "The relationship showing that percent, fractions, and decimals can express the same value (e.g., 50% = 1/2 = 0.5)"},
      {"term": "Benchmark percent", "definition": "Common percent values used for estimation and comparison (10%, 25%, 50%, 75%, 100%)"},
      {"term": "Hundred grid", "definition": "A 10 x 10 grid of 100 squares used to represent percent visually"}
    ]'::jsonb,
    'Understanding percent is important in modern Indigenous governance and treaty discussions. When discussing land allocations, resource sharing agreements, and funding distributions, percentages provide a clear, standardized way to express proportions.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N6.5';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does percent mean?', 'Per hundred. 45% means 45 out of every 100.', 'Per cent = per hundred', 1, 0),
    (v_tenant, v_ch, 'Convert 3/4 to a percent.', '75%. (3 ÷ 4 = 0.75, and 0.75 x 100 = 75%.)', 'Divide, then multiply by 100', 2, 1),
    (v_tenant, v_ch, 'Convert 60% to a decimal.', '0.60 (or 0.6). Divide by 100: move the decimal two places left.', '60 ÷ 100', 2, 2),
    (v_tenant, v_ch, 'What percent is equivalent to 1/2?', '50%. Half of 100 is 50.', 'The most common benchmark', 1, 3);

  -- ---------------------------------------------------------------
  -- Chapter 6: Integers (N6.6)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 6,
    'Understanding Integers',
    'understanding-integers',
    'Represent and describe integers concretely, pictorially, and symbolically.',
    '[
      {"type": "heading", "content": "Understanding Integers", "level": 1},
      {"type": "text", "content": "Integers include all positive whole numbers, their negative counterparts, and zero. The set of integers is: ..., −3, −2, −1, 0, 1, 2, 3, ... Integers extend the number line in both directions from zero."},
      {"type": "heading", "content": "Positive and Negative Numbers", "level": 2},
      {"type": "text", "content": "Positive integers are greater than zero and are written with or without a + sign: +5 or just 5. Negative integers are less than zero and are always written with a − sign: −3. Zero is neither positive nor negative."},
      {"type": "heading", "content": "Real-World Contexts for Integers", "level": 2},
      {"type": "list", "items": ["Temperature: −20°C is 20 degrees below zero", "Altitude: −50 m means 50 metres below sea level", "Money: −$15 means you owe $15 (a debt)", "Football: a loss of 5 yards is −5 yards"], "ordered": false},
      {"type": "heading", "content": "Comparing and Ordering Integers", "level": 2},
      {"type": "text", "content": "On a number line, numbers increase from left to right. So −5 < −3 < 0 < 2 < 7. Any positive integer is greater than any negative integer. Among negative integers, the one closer to zero is greater: −2 > −5."},
      {"type": "callout", "content": "Think of a thermometer as a vertical number line. The higher up you go, the warmer (and greater) the number. Below zero, −10°C is colder (and smaller) than −3°C.", "style": "tip"},
      {"type": "heading", "content": "Opposite Integers", "level": 2},
      {"type": "text", "content": "Every integer has an opposite. The opposite of 4 is −4, and the opposite of −7 is 7. Opposite integers are the same distance from zero on the number line. The sum of any integer and its opposite is always zero."},
      {"type": "quiz", "question": "Which integer is greater: −8 or −3?", "options": ["−8", "−3", "They are equal"], "correct": 1, "explanation": "−3 is closer to zero than −8, so −3 > −8. On the number line, −3 is to the right of −8."},
      {"type": "quiz", "question": "The temperature is −12°C in the morning and rises 18 degrees. What is the new temperature?", "options": ["−30°C", "6°C", "−6°C", "30°C"], "correct": 1, "explanation": "Starting at −12 and rising 18: −12 + 18 = 6°C."}
    ]'::jsonb,
    '[
      {"term": "Integer", "definition": "Any positive or negative whole number, including zero (..., −3, −2, −1, 0, 1, 2, 3, ...)"},
      {"term": "Positive integer", "definition": "A whole number greater than zero"},
      {"term": "Negative integer", "definition": "A whole number less than zero, written with a minus sign"},
      {"term": "Opposite integers", "definition": "Two integers that are the same distance from zero but on opposite sides (e.g., 5 and −5)"},
      {"term": "Zero", "definition": "The integer that separates positive from negative numbers; it is neither positive nor negative"}
    ]'::jsonb,
    'Saskatchewan winters regularly bring temperatures well below zero, sometimes reaching −30°C or colder. Indigenous peoples developed extensive knowledge of winter survival, understanding intuitively that −30°C is much more extreme than −10°C — a practical application of integer comparison.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N6.6';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are integers?', 'The set of positive whole numbers, negative whole numbers, and zero: ..., −3, −2, −1, 0, 1, 2, 3, ...', 'Whole numbers in both directions', 1, 0),
    (v_tenant, v_ch, 'Which is greater: −7 or −2?', '−2 is greater because it is closer to zero on the number line.', 'Closer to zero = greater for negatives', 2, 1),
    (v_tenant, v_ch, 'What is the opposite of −9?', '+9 (or just 9). Opposite integers are the same distance from zero on opposite sides.', 'Same distance, other side of zero', 1, 2),
    (v_tenant, v_ch, 'Give a real-world example of a negative integer.', 'Temperature below zero (−15°C), altitude below sea level (−50 m), or owing money (−$20).', 'Think about below, under, or owing', 1, 3);

  -- ---------------------------------------------------------------
  -- Chapter 7: Improper Fractions and Mixed Numbers (N6.7)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 7,
    'Improper Fractions and Mixed Numbers',
    'improper-fractions-mixed-numbers',
    'Understand and convert between improper fractions and mixed numbers.',
    '[
      {"type": "heading", "content": "Improper Fractions and Mixed Numbers", "level": 1},
      {"type": "text", "content": "In earlier grades, fractions were always less than or equal to one whole. Now we extend fractions beyond one whole using improper fractions and mixed numbers."},
      {"type": "heading", "content": "Improper Fractions", "level": 2},
      {"type": "text", "content": "An improper fraction has a numerator that is greater than or equal to its denominator. Examples: 7/4, 5/3, 9/2. An improper fraction represents a value greater than or equal to 1."},
      {"type": "heading", "content": "Mixed Numbers", "level": 2},
      {"type": "text", "content": "A mixed number combines a whole number and a proper fraction. For example, 2 3/4 means 2 wholes and 3/4. Mixed numbers and improper fractions can represent the same value: 2 3/4 = 11/4."},
      {"type": "heading", "content": "Converting Between Forms", "level": 2},
      {"type": "text", "content": "To convert an improper fraction to a mixed number: divide the numerator by the denominator. The quotient is the whole number, and the remainder becomes the new numerator. Example: 17/5 = 3 2/5 (because 17 ÷ 5 = 3 R2)."},
      {"type": "text", "content": "To convert a mixed number to an improper fraction: multiply the whole number by the denominator, add the numerator, and place over the original denominator. Example: 3 2/5 = (3 x 5 + 2)/5 = 17/5."},
      {"type": "callout", "content": "Both forms are correct — use whichever is more convenient for the situation. Mixed numbers are easier to visualize, while improper fractions are often easier for calculations.", "style": "tip"},
      {"type": "quiz", "question": "Convert 23/6 to a mixed number.", "options": ["3 5/6", "3 4/6", "4 1/6", "2 11/6"], "correct": 0, "explanation": "23 ÷ 6 = 3 R5. So 23/6 = 3 5/6."},
      {"type": "quiz", "question": "Convert 4 2/3 to an improper fraction.", "options": ["10/3", "14/3", "12/3", "8/3"], "correct": 1, "explanation": "4 x 3 + 2 = 14. So 4 2/3 = 14/3."}
    ]'::jsonb,
    '[
      {"term": "Improper fraction", "definition": "A fraction where the numerator is greater than or equal to the denominator (e.g., 7/4)"},
      {"term": "Mixed number", "definition": "A number made up of a whole number and a proper fraction (e.g., 1 3/4)"},
      {"term": "Proper fraction", "definition": "A fraction where the numerator is less than the denominator (e.g., 3/4)"},
      {"term": "Convert", "definition": "To change from one form to another while keeping the value the same"}
    ]'::jsonb,
    'In community feasts and gatherings, food is often available in quantities greater than one whole. Describing 2 and a half bannock loaves as the improper fraction 5/2 or the mixed number 2 1/2 connects this mathematical concept to everyday Indigenous life.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N6.7';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is an improper fraction?', 'A fraction where the numerator is greater than or equal to the denominator, like 9/4. It represents 1 or more wholes.', 'Top number is bigger', 1, 0),
    (v_tenant, v_ch, 'Convert 5 1/3 to an improper fraction.', '16/3. (5 x 3 + 1 = 16, over 3)', 'Multiply whole by denominator, add numerator', 2, 1),
    (v_tenant, v_ch, 'Convert 19/4 to a mixed number.', '4 3/4. (19 ÷ 4 = 4 R3)', 'Divide to get the whole and remainder', 2, 2),
    (v_tenant, v_ch, 'When is an improper fraction more useful than a mixed number?', 'When performing calculations like multiplication or division with fractions — improper fractions are easier to work with.', 'Calculations prefer improper form', 2, 3);

  -- ---------------------------------------------------------------
  -- Chapter 8: Ratio (N6.8) and Indigenous Quantity (N6.9)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 8,
    'Ratio and Proportional Thinking',
    'ratio-proportional-thinking',
    'Understand ratio as a comparison of two quantities and explore Indigenous perspectives on quantity.',
    '[
      {"type": "heading", "content": "Ratio and Proportional Thinking", "level": 1},
      {"type": "text", "content": "A ratio compares two quantities. If a recipe uses 2 cups of flour for every 3 cups of sugar, the ratio of flour to sugar is 2:3 (read as two to three). Ratios can also be written as fractions: 2/3."},
      {"type": "heading", "content": "Types of Ratios", "level": 2},
      {"type": "text", "content": "Part-to-part ratios compare parts of the same group: in a class of 12 boys and 16 girls, the ratio of boys to girls is 12:16 (or 3:4 in simplest form). Part-to-whole ratios compare a part to the total: boys to all students is 12:28 (or 3:7)."},
      {"type": "heading", "content": "Equivalent Ratios", "level": 2},
      {"type": "text", "content": "Just like equivalent fractions, you can find equivalent ratios by multiplying or dividing both terms by the same number. 2:3 = 4:6 = 6:9 = 10:15. To simplify a ratio, divide both terms by their greatest common factor."},
      {"type": "callout", "content": "Ratios must be kept in order. The ratio of cats to dogs (3:5) is different from the ratio of dogs to cats (5:3).", "style": "info"},
      {"type": "heading", "content": "Indigenous Perspectives on Quantity", "level": 2},
      {"type": "text", "content": "First Nations and Metis peoples have rich traditions of representing and using quantity. Counting systems varied among nations — some used base-5 (based on fingers of one hand) and base-20 systems. Quantity was often understood in relationship to context: enough berries for winter, enough hides for a tipi, or the right proportion of ingredients in traditional medicines. This relational thinking is at the heart of ratio."},
      {"type": "callout", "content": "Many Indigenous languages have distinct counting systems that reflect different ways of organizing and thinking about quantity. Learning about these systems broadens our understanding of mathematics as a universal human activity.", "style": "info"},
      {"type": "quiz", "question": "A bag has 6 red marbles and 10 blue marbles. What is the ratio of red to blue in simplest form?", "options": ["6:10", "3:5", "5:3", "1:2"], "correct": 1, "explanation": "6:10 simplified by dividing both by 2 gives 3:5."},
      {"type": "quiz", "question": "If the ratio of teachers to students is 1:15, and there are 4 teachers, how many students are there?", "options": ["15", "30", "45", "60"], "correct": 3, "explanation": "1:15 = 4:60. Multiply both terms by 4: 4 teachers to 60 students."}
    ]'::jsonb,
    '[
      {"term": "Ratio", "definition": "A comparison of two quantities, expressed as a:b or a/b"},
      {"term": "Equivalent ratios", "definition": "Ratios that represent the same comparison (e.g., 2:3 = 4:6 = 6:9)"},
      {"term": "Part-to-part ratio", "definition": "A ratio comparing one part of a group to another part of the same group"},
      {"term": "Part-to-whole ratio", "definition": "A ratio comparing one part of a group to the entire group"},
      {"term": "Simplest form (ratio)", "definition": "A ratio where both terms share no common factor other than 1"}
    ]'::jsonb,
    'This chapter directly addresses SK curriculum outcome N6.9: researching how First Nations and Metis peoples envision, represent, and use quantity. Indigenous counting systems, proportional thinking in medicine preparation, and relational views of quantity all demonstrate sophisticated mathematical thinking that predates European contact.',
    30, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N6.8';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'N6.9';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a ratio?', 'A comparison of two quantities. It can be written as a:b, a to b, or a/b.', 'Comparing two numbers', 1, 0),
    (v_tenant, v_ch, 'What is the difference between part-to-part and part-to-whole ratios?', 'Part-to-part compares parts to each other (boys:girls = 3:5). Part-to-whole compares a part to the total (boys:all = 3:8).', 'Part vs. total', 2, 1),
    (v_tenant, v_ch, 'Simplify the ratio 15:25.', '3:5. Divide both terms by the GCF of 5.', 'Find the GCF first', 2, 2),
    (v_tenant, v_ch, 'If the ratio of flour to water is 3:2 and you use 9 cups of flour, how much water do you need?', '6 cups. 3:2 = 9:6 (multiply both terms by 3).', 'Find the multiplier', 2, 3),
    (v_tenant, v_ch, 'How did some Indigenous groups count differently from the European base-10 system?', 'Some used base-5 systems (one hand) or base-20 systems (hands and feet). Quantity was also understood relationally — in terms of what was enough for a purpose.', 'Fingers, hands, and relational thinking', 2, 4);


  -- ===================================================================
  -- UNIT 2: Patterns and Relations
  -- ===================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2,
    'Patterns and Relations',
    'Extending patterns in tables and graphs, preservation of equality, and equations with variables',
    'Algebraic thinking begins with patterns and relationships that can be expressed using tables, graphs, and equations with variables.',
    'How do patterns, tables, graphs, and equations help us represent and analyse mathematical relationships?')
  RETURNING id INTO v_unit;

  -- ---------------------------------------------------------------
  -- Chapter 9: Patterns in Tables and Graphs (P6.1)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 9,
    'Patterns in Tables and Graphs',
    'patterns-tables-graphs',
    'Extend understanding of patterns and relationships using tables of values and graphs.',
    '[
      {"type": "heading", "content": "Patterns in Tables and Graphs", "level": 1},
      {"type": "text", "content": "Patterns can be represented in multiple ways: as sequences, in tables of values, and as graphs. Each representation reveals different aspects of the relationship. In Grade 6, we connect these representations and use them to solve problems."},
      {"type": "heading", "content": "Tables of Values", "level": 2},
      {"type": "text", "content": "A table of values organizes input-output pairs. The input variable (often n) is independent — we choose it. The output variable depends on the input and the rule. When we see a pattern in the table, we can write a rule as an expression."},
      {"type": "heading", "content": "Graphing Relationships", "level": 2},
      {"type": "text", "content": "Plot points from a table of values on a coordinate grid. The input is on the horizontal axis and the output is on the vertical axis. If the points form a straight line, the relationship is linear."},
      {"type": "callout", "content": "Example: For the rule output = 2 x input + 1, the table is: (1,3), (2,5), (3,7), (4,9). These points form a straight line when graphed, showing a linear relationship.", "style": "example"},
      {"type": "heading", "content": "Using Patterns to Predict", "level": 2},
      {"type": "text", "content": "Once you identify the pattern rule, you can predict values beyond the table. If the rule is output = 3 x input − 2, and you want the output for input 100, calculate: 3 x 100 − 2 = 298. No need to extend the table 100 rows!"},
      {"type": "quiz", "question": "A table shows: input 1→5, 2→8, 3→11, 4→14. What is the pattern rule?", "options": ["Multiply by 3, add 2", "Multiply by 5", "Multiply by 4, add 1", "Add 5"], "correct": 0, "explanation": "1x3+2=5, 2x3+2=8, 3x3+2=11, 4x3+2=14. The rule is 3n + 2."},
      {"type": "quiz", "question": "Using the rule output = 2n + 3, what is the output when the input is 10?", "options": ["23", "25", "20", "13"], "correct": 0, "explanation": "2(10) + 3 = 20 + 3 = 23."}
    ]'::jsonb,
    '[
      {"term": "Table of values", "definition": "A table showing corresponding input and output values based on a pattern rule"},
      {"term": "Linear relationship", "definition": "A pattern where points form a straight line when graphed; the output changes by a constant amount for each unit change in input"},
      {"term": "Coordinate grid", "definition": "A grid with horizontal and vertical axes used to plot ordered pairs"},
      {"term": "Ordered pair", "definition": "A pair of numbers (x, y) that identifies a point on a coordinate grid"}
    ]'::jsonb,
    'Indigenous astronomical observations — tracking the position of the sun, moon, and stars over time — represent early examples of recording data in tables and recognizing linear and cyclical patterns. These observations were used for navigation, calendar-keeping, and ceremony timing.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'P6.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a linear relationship?', 'A relationship where the output changes by a constant amount for each unit change in input. The graph is a straight line.', 'Constant change = straight line', 2, 0),
    (v_tenant, v_ch, 'How do you find a pattern rule from a table?', 'Look at how the output changes as the input increases by 1. Check if the change is constant (linear) and find the relationship.', 'Compare consecutive outputs', 3, 1),
    (v_tenant, v_ch, 'What is an ordered pair?', 'Two numbers (x, y) that identify a point on a coordinate grid. The first number is the horizontal position, the second is vertical.', '(across, up)', 2, 2),
    (v_tenant, v_ch, 'Using output = 4n − 1, find the output for input 7.', '27. (4 x 7 − 1 = 28 − 1 = 27)', 'Substitute 7 for n', 2, 3);

  -- ---------------------------------------------------------------
  -- Chapter 10: Equality and Equations (P6.2, P6.3)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 10,
    'Equality, Expressions, and Equations',
    'equality-expressions-equations',
    'Understand preservation of equality and use expressions and equations with variables.',
    '[
      {"type": "heading", "content": "Equality, Expressions, and Equations", "level": 1},
      {"type": "text", "content": "Algebra is the branch of mathematics that uses letters and symbols to represent numbers and relationships. In Grade 6, we deepen our understanding of equality, work with expressions, and solve equations with variables."},
      {"type": "heading", "content": "Preservation of Equality", "level": 2},
      {"type": "text", "content": "An equation is like a balance scale. Both sides must always be equal. If you add, subtract, multiply, or divide one side, you must do the same to the other side to maintain balance. This principle is called preservation of equality."},
      {"type": "callout", "content": "If n + 5 = 12, you can subtract 5 from both sides: n + 5 − 5 = 12 − 5, giving n = 7. The equality is preserved because we did the same operation to both sides.", "style": "example"},
      {"type": "heading", "content": "Expressions vs. Equations", "level": 2},
      {"type": "text", "content": "An expression is a mathematical phrase without an equals sign (e.g., 3n + 7). An equation is a mathematical statement with an equals sign that says two expressions are equal (e.g., 3n + 7 = 22)."},
      {"type": "heading", "content": "Writing and Solving Equations", "level": 2},
      {"type": "text", "content": "Many real-world problems can be translated into equations. For example: Sarah has some stickers. She gives away 8 and has 15 left. How many did she start with? Equation: n − 8 = 15. Solution: n = 15 + 8 = 23."},
      {"type": "heading", "content": "Two-Step Problems", "level": 2},
      {"type": "text", "content": "Some problems require two steps. A taxi costs $3 plus $2 per kilometre. If the total fare is $17, how far did you travel? Equation: 2k + 3 = 17. Step 1: 2k = 14. Step 2: k = 7. You travelled 7 km."},
      {"type": "quiz", "question": "Solve: 4n − 3 = 21", "options": ["n = 4", "n = 6", "n = 5", "n = 7"], "correct": 1, "explanation": "Add 3 to both sides: 4n = 24. Divide by 4: n = 6. Check: 4(6) − 3 = 24 − 3 = 21."},
      {"type": "quiz", "question": "Which is an expression and which is an equation? A: 5x + 2  B: 5x + 2 = 17", "options": ["A is an equation, B is an expression", "A is an expression, B is an equation", "Both are equations", "Both are expressions"], "correct": 1, "explanation": "A (5x + 2) has no equals sign — it is an expression. B (5x + 2 = 17) has an equals sign — it is an equation."}
    ]'::jsonb,
    '[
      {"term": "Expression", "definition": "A mathematical phrase containing numbers, variables, and operations but no equals sign"},
      {"term": "Equation", "definition": "A mathematical statement that two expressions are equal, connected by an equals sign"},
      {"term": "Preservation of equality", "definition": "The principle that the same operation must be performed on both sides of an equation to maintain balance"},
      {"term": "Variable", "definition": "A letter representing an unknown or changing value in an expression or equation"},
      {"term": "Coefficient", "definition": "The number multiplied by a variable (in 3n, the coefficient is 3)"},
      {"term": "Constant", "definition": "A fixed number in an expression that does not change (in 3n + 5, the constant is 5)"}
    ]'::jsonb,
    'The concept of balance and reciprocity is fundamental to many Indigenous worldviews. In Cree philosophy, the idea that actions must be balanced — what you take from the land must be reciprocated — mirrors the mathematical principle that what you do to one side of an equation must be done to the other.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'P6.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;
  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'P6.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is preservation of equality?', 'The principle that you must perform the same operation on both sides of an equation to keep it balanced.', 'Like a balance scale', 2, 0),
    (v_tenant, v_ch, 'What is the difference between an expression and an equation?', 'An expression has no equals sign (3x + 2). An equation has an equals sign (3x + 2 = 14).', 'Does it have an = sign?', 1, 1),
    (v_tenant, v_ch, 'Solve: 3n + 5 = 26.', 'n = 7. (Subtract 5: 3n = 21. Divide by 3: n = 7.)', 'Two steps: undo addition, then undo multiplication', 3, 2),
    (v_tenant, v_ch, 'What is a constant in an expression?', 'A fixed number that does not change, like the 5 in 2n + 5.', 'It stays the same no matter what n is', 2, 3);


  -- ===================================================================
  -- UNIT 3: Statistics and Probability
  -- ===================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3,
    'Statistics and Probability',
    'Line graphs, discrete data graphs, sample space, experimental and theoretical probability',
    'Graphs communicate data visually, and understanding probability helps us make predictions about uncertain events.',
    'How do different types of graphs help us understand data, and how does probability help us predict outcomes?')
  RETURNING id INTO v_unit;

  -- ---------------------------------------------------------------
  -- Chapter 11: Line Graphs and Data (SP6.1)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 11,
    'Line Graphs and Data Analysis',
    'line-graphs-data',
    'Create and interpret line graphs and identify whether data is continuous or discrete.',
    '[
      {"type": "heading", "content": "Line Graphs and Data Analysis", "level": 1},
      {"type": "text", "content": "In Grade 6, we extend our graphing skills to include line graphs and learn to distinguish between continuous and discrete data. Different types of data require different types of graphs."},
      {"type": "heading", "content": "Continuous vs. Discrete Data", "level": 2},
      {"type": "text", "content": "Continuous data can take any value within a range — like temperature, height, or time. It is measured. Discrete data can only take specific values — like number of students, shoe sizes, or goals scored. It is counted."},
      {"type": "heading", "content": "Line Graphs", "level": 2},
      {"type": "text", "content": "Line graphs are used to display continuous data, often showing change over time. Points are plotted and connected with straight lines. The horizontal axis usually shows time, and the vertical axis shows the measured quantity."},
      {"type": "callout", "content": "Line graphs are perfect for showing trends. A line going up shows an increase, a line going down shows a decrease, and a flat line shows no change.", "style": "tip"},
      {"type": "heading", "content": "Interpreting Line Graphs", "level": 2},
      {"type": "text", "content": "When reading a line graph, look for the overall trend (increasing, decreasing, or staying the same), the steepness of the line (steep = fast change), and any notable peaks, valleys, or flat sections."},
      {"type": "heading", "content": "Choosing the Right Graph", "level": 2},
      {"type": "text", "content": "Bar graphs: best for comparing categories (discrete data). Line graphs: best for showing change over time (continuous data). Pictographs: good for simple comparisons. Circle graphs: best for showing parts of a whole."},
      {"type": "quiz", "question": "Which type of data would be best displayed with a line graph?", "options": ["Favourite colour of students", "Temperature throughout the day", "Number of pets per student", "Flavours of ice cream sold"], "correct": 1, "explanation": "Temperature is continuous data that changes over time — perfect for a line graph."},
      {"type": "quiz", "question": "Is the number of books read by students continuous or discrete data?", "options": ["Continuous", "Discrete"], "correct": 1, "explanation": "You count books in whole numbers (1, 2, 3...), so it is discrete data."}
    ]'::jsonb,
    '[
      {"term": "Line graph", "definition": "A graph that uses points connected by lines to show how data changes over time"},
      {"term": "Continuous data", "definition": "Data that can take any value within a range; it is measured (e.g., temperature, height)"},
      {"term": "Discrete data", "definition": "Data that can only take specific, distinct values; it is counted (e.g., number of students)"},
      {"term": "Trend", "definition": "The general direction or pattern in a graph (increasing, decreasing, or stable)"}
    ]'::jsonb,
    'Environmental monitoring on First Nations lands uses line graphs to track water levels, fish populations, and temperature changes across seasons and years. These visual tools help communities advocate for environmental protection and resource management.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SP6.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a line graph best used for?', 'Showing how continuous data changes over time. Examples: temperature over a day, plant growth over weeks.', 'Change over time', 1, 0),
    (v_tenant, v_ch, 'What is the difference between continuous and discrete data?', 'Continuous data can be any value in a range (measured). Discrete data can only be specific values (counted).', 'Measured vs. counted', 2, 1),
    (v_tenant, v_ch, 'What does a steep line on a line graph indicate?', 'A rapid rate of change — the quantity is increasing or decreasing quickly.', 'Steeper = faster change', 2, 2),
    (v_tenant, v_ch, 'When would you use a bar graph instead of a line graph?', 'When comparing categories of discrete data, such as favourite colours or number of pets.', 'Categories, not time changes', 2, 3);

  -- ---------------------------------------------------------------
  -- Chapter 12: Probability — Experimental and Theoretical (SP6.2)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 12,
    'Experimental and Theoretical Probability',
    'experimental-theoretical-probability',
    'Determine sample spaces and differentiate between experimental and theoretical probability.',
    '[
      {"type": "heading", "content": "Experimental and Theoretical Probability", "level": 1},
      {"type": "text", "content": "In Grade 6, we deepen our understanding of probability by learning to determine sample spaces and comparing what we expect to happen (theoretical probability) with what actually happens when we conduct experiments (experimental probability)."},
      {"type": "heading", "content": "Sample Space", "level": 2},
      {"type": "text", "content": "The sample space is the set of all possible outcomes of an experiment. For a coin flip, the sample space is {heads, tails}. For rolling a die, it is {1, 2, 3, 4, 5, 6}. For flipping a coin and rolling a die simultaneously, there are 2 x 6 = 12 outcomes."},
      {"type": "heading", "content": "Theoretical Probability", "level": 2},
      {"type": "text", "content": "Theoretical probability is calculated using reasoning, not experiments. P(event) = number of favourable outcomes ÷ total number of outcomes. For rolling an even number on a die: P(even) = 3/6 = 1/2."},
      {"type": "heading", "content": "Experimental Probability", "level": 2},
      {"type": "text", "content": "Experimental probability is determined by conducting an experiment and recording results. P(event) = number of times event occurred ÷ total number of trials. If you flip a coin 50 times and get 23 heads, the experimental probability of heads is 23/50."},
      {"type": "callout", "content": "The more trials you conduct, the closer the experimental probability gets to the theoretical probability. This is called the law of large numbers.", "style": "info"},
      {"type": "heading", "content": "Comparing Theoretical and Experimental", "level": 2},
      {"type": "text", "content": "Theoretical probability tells us what should happen in the long run. Experimental probability tells us what actually happened in a specific set of trials. They may differ, especially with few trials, but they should be close with many trials."},
      {"type": "quiz", "question": "A bag contains 4 red, 3 blue, and 3 green marbles. What is the theoretical probability of drawing a blue marble?", "options": ["3/4", "3/7", "3/10", "1/3"], "correct": 2, "explanation": "Total marbles = 4 + 3 + 3 = 10. Blue marbles = 3. P(blue) = 3/10."},
      {"type": "quiz", "question": "You roll a die 60 times and get a 6 exactly 8 times. What is the experimental probability of rolling a 6?", "options": ["1/6", "8/60", "6/60", "8/52"], "correct": 1, "explanation": "Experimental probability = times it happened ÷ total trials = 8/60 (which simplifies to 2/15)."}
    ]'::jsonb,
    '[
      {"term": "Sample space", "definition": "The set of all possible outcomes of a probability experiment"},
      {"term": "Theoretical probability", "definition": "The expected probability calculated using reasoning and the sample space"},
      {"term": "Experimental probability", "definition": "The probability determined by conducting experiments and recording results"},
      {"term": "Trial", "definition": "One repetition of a probability experiment"},
      {"term": "Favourable outcome", "definition": "An outcome of interest in a probability experiment"}
    ]'::jsonb,
    'Many traditional Indigenous games involve elements of chance and probability. The Cree hand game and various dice games using marked bones or sticks have been played for thousands of years. These games demonstrate an intuitive understanding of probability, fairness, and expected outcomes.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SP6.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a sample space?', 'The set of all possible outcomes. For a standard die: {1, 2, 3, 4, 5, 6}.', 'All possible results', 2, 0),
    (v_tenant, v_ch, 'How is theoretical probability calculated?', 'P = number of favourable outcomes ÷ total number of possible outcomes.', 'Favourable over total', 2, 1),
    (v_tenant, v_ch, 'How is experimental probability different from theoretical?', 'Experimental is based on actual trials; theoretical is based on reasoning. They get closer with more trials.', 'Actual vs. expected', 2, 2),
    (v_tenant, v_ch, 'If you flip two coins, how many outcomes are in the sample space?', '4 outcomes: HH, HT, TH, TT.', 'Multiply the options: 2 x 2 = 4', 2, 3);


  -- ===================================================================
  -- UNIT 4: Shape and Space
  -- ===================================================================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4,
    'Shape and Space',
    'Angles, perimeter/area/volume, polygon classification, the Cartesian plane, and transformations',
    'Geometry provides tools for measuring, classifying, and transforming shapes and for locating positions precisely on a plane.',
    'How do angles, measurement formulas, the coordinate plane, and transformations help us understand and describe the world of shapes and space?')
  RETURNING id INTO v_unit;

  -- ---------------------------------------------------------------
  -- Chapter 13: Angles (SS6.1)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 13,
    'Understanding Angles',
    'understanding-angles',
    'Identify, classify, estimate, and measure angles.',
    '[
      {"type": "heading", "content": "Understanding Angles", "level": 1},
      {"type": "text", "content": "An angle is formed when two rays share a common endpoint (called the vertex). Angles are measured in degrees (°) and describe the amount of rotation between the two rays."},
      {"type": "heading", "content": "Types of Angles", "level": 2},
      {"type": "list", "items": ["Acute angle: greater than 0° and less than 90°", "Right angle: exactly 90° (indicated by a small square)", "Obtuse angle: greater than 90° and less than 180°", "Straight angle: exactly 180° (a straight line)", "Reflex angle: greater than 180° and less than 360°"], "ordered": false},
      {"type": "heading", "content": "Measuring with a Protractor", "level": 2},
      {"type": "text", "content": "A protractor is a tool for measuring angles. Place the centre of the protractor on the vertex of the angle. Align one ray with the 0° line. Read the measurement where the other ray crosses the protractor. Most protractors have two scales — use the one that starts from 0° on your baseline ray."},
      {"type": "callout", "content": "Before measuring, estimate the angle first. Is it less than 90° (acute) or more than 90° (obtuse)? This helps you read the correct scale on the protractor.", "style": "tip"},
      {"type": "heading", "content": "Estimating Angles", "level": 2},
      {"type": "text", "content": "Use benchmarks to estimate: a right angle is 90°, a straight angle is 180°, and a full rotation is 360°. Half of a right angle is 45°. You can estimate other angles by comparing to these benchmarks."},
      {"type": "quiz", "question": "An angle measures 135°. What type of angle is it?", "options": ["Acute", "Right", "Obtuse", "Straight"], "correct": 2, "explanation": "135° is greater than 90° and less than 180°, making it an obtuse angle."},
      {"type": "quiz", "question": "What type of angle is formed by the hands of a clock at 3:00?", "options": ["Acute angle", "Right angle", "Obtuse angle", "Straight angle"], "correct": 1, "explanation": "At 3:00, the hands form a 90° angle, which is a right angle."}
    ]'::jsonb,
    '[
      {"term": "Angle", "definition": "The amount of rotation between two rays that share a common endpoint (vertex)"},
      {"term": "Vertex", "definition": "The point where two rays meet to form an angle"},
      {"term": "Degree (°)", "definition": "The unit of measurement for angles; a full rotation is 360°"},
      {"term": "Protractor", "definition": "A tool used to measure and draw angles"},
      {"term": "Acute angle", "definition": "An angle that measures less than 90°"},
      {"term": "Obtuse angle", "definition": "An angle that measures greater than 90° but less than 180°"}
    ]'::jsonb,
    'The angles of tipi poles, the slopes of snowshoe frames, and the geometry of birch bark canoes all demonstrate Indigenous engineering that relied on precise angle construction. The optimal angle of tipi poles (approximately 15-20° from vertical) was determined through generations of practical experimentation.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS6.1';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is an angle?', 'The amount of rotation between two rays that share a common endpoint (vertex), measured in degrees.', 'Two rays meeting at a point', 1, 0),
    (v_tenant, v_ch, 'What are the five types of angles?', 'Acute (< 90°), right (= 90°), obtuse (> 90° and < 180°), straight (= 180°), reflex (> 180° and < 360°).', 'Less than, equal to, or greater than 90 or 180', 2, 1),
    (v_tenant, v_ch, 'How do you use a protractor?', 'Place the centre on the vertex, align one ray with 0°, and read where the other ray crosses the scale.', 'Centre on vertex, baseline on 0', 2, 2),
    (v_tenant, v_ch, 'What is a right angle?', 'An angle that measures exactly 90°. It is marked with a small square at the vertex.', 'The corner of a book or paper', 1, 3);

  -- ---------------------------------------------------------------
  -- Chapter 14: Perimeter, Area, and Volume (SS6.2)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 14,
    'Perimeter, Area, and Volume',
    'perimeter-area-volume',
    'Apply formulas for perimeter of polygons, area of rectangles, and volume of rectangular prisms.',
    '[
      {"type": "heading", "content": "Perimeter, Area, and Volume", "level": 1},
      {"type": "text", "content": "In Grade 6, we consolidate our measurement skills by applying formulas for perimeter, area, and volume to solve problems. These three measurements are related but describe different properties of shapes and objects."},
      {"type": "heading", "content": "Perimeter of Polygons", "level": 2},
      {"type": "text", "content": "The perimeter of any polygon is the sum of all side lengths. For regular polygons (all sides equal), P = number of sides x side length. For a regular hexagon with 4 cm sides: P = 6 x 4 = 24 cm."},
      {"type": "heading", "content": "Area of Rectangles", "level": 2},
      {"type": "text", "content": "Area = length x width. This formula can be applied to solve real-world problems like calculating the amount of flooring, paint, or fabric needed. A room that is 5 m by 4 m needs 20 m² of carpet."},
      {"type": "heading", "content": "Volume of Rectangular Prisms", "level": 2},
      {"type": "text", "content": "Volume = length x width x height. Volume measures the space inside a 3-D object. A storage box that is 30 cm x 20 cm x 15 cm has a volume of 30 x 20 x 15 = 9,000 cm³."},
      {"type": "callout", "content": "Perimeter is measured in linear units (cm, m), area in square units (cm², m²), and volume in cubic units (cm³, m³). Using the correct unit is essential.", "style": "info"},
      {"type": "heading", "content": "Solving Multi-Step Problems", "level": 2},
      {"type": "text", "content": "Some problems require combining formulas. To find how much wrapping paper you need for a box, calculate the surface area (the total area of all faces). A box with dimensions 10 x 8 x 5 has a surface area of 2(10x8) + 2(10x5) + 2(8x5) = 160 + 100 + 80 = 340 cm²."},
      {"type": "quiz", "question": "What is the volume of a rectangular prism with dimensions 12 cm x 8 cm x 5 cm?", "options": ["100 cm³", "480 cm³", "384 cm³", "960 cm³"], "correct": 1, "explanation": "Volume = 12 x 8 x 5 = 480 cm³."},
      {"type": "quiz", "question": "A garden is 15 m long and 8 m wide. How much fencing is needed for the perimeter?", "options": ["23 m", "46 m", "120 m", "60 m"], "correct": 1, "explanation": "Perimeter = 2(15 + 8) = 2(23) = 46 m."}
    ]'::jsonb,
    '[
      {"term": "Perimeter", "definition": "The total distance around the outside of a polygon"},
      {"term": "Area", "definition": "The amount of surface inside a 2-D shape, measured in square units"},
      {"term": "Volume", "definition": "The amount of space inside a 3-D object, measured in cubic units"},
      {"term": "Surface area", "definition": "The total area of all the faces of a 3-D object"},
      {"term": "Rectangular prism", "definition": "A 3-D shape with six rectangular faces"}
    ]'::jsonb,
    'Building traditional structures required understanding all three measurements. The perimeter determined the ground coverage of a lodge. The area of hides determined how many were needed for walls. The volume inside determined how many people could be sheltered — all practical applications of these formulas.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS6.2';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'How are perimeter, area, and volume different?', 'Perimeter measures distance around (1-D, linear units). Area measures surface (2-D, square units). Volume measures space inside (3-D, cubic units).', '1-D, 2-D, 3-D', 2, 0),
    (v_tenant, v_ch, 'What is the volume formula for a rectangular prism?', 'V = length x width x height.', 'Three dimensions multiplied', 2, 1),
    (v_tenant, v_ch, 'Find the area of a rectangle: 9 m by 7 m.', '63 m². (9 x 7 = 63)', 'Length times width', 2, 2),
    (v_tenant, v_ch, 'What is surface area?', 'The total area of all faces of a 3-D object. For a rectangular prism: SA = 2(lw + lh + wh).', 'Add up all the face areas', 3, 3);

  -- ---------------------------------------------------------------
  -- Chapter 15: Polygons and Triangles (SS6.3)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 15,
    'Polygons and Triangles',
    'polygons-and-triangles',
    'Classify regular and irregular polygons and types of triangles.',
    '[
      {"type": "heading", "content": "Polygons and Triangles", "level": 1},
      {"type": "text", "content": "A polygon is a closed 2-D shape made of straight line segments. Polygons are named by their number of sides. In Grade 6, we classify polygons as regular or irregular and explore the different types of triangles."},
      {"type": "heading", "content": "Regular and Irregular Polygons", "level": 2},
      {"type": "text", "content": "A regular polygon has all sides equal and all angles equal (e.g., equilateral triangle, square, regular pentagon). An irregular polygon has sides and/or angles that are not all equal."},
      {"type": "heading", "content": "Classifying Triangles by Sides", "level": 2},
      {"type": "list", "items": ["Equilateral triangle: all 3 sides are equal, all angles are 60°", "Isosceles triangle: 2 sides are equal, 2 angles are equal", "Scalene triangle: no sides are equal, no angles are equal"], "ordered": false},
      {"type": "heading", "content": "Classifying Triangles by Angles", "level": 2},
      {"type": "list", "items": ["Acute triangle: all angles are less than 90°", "Right triangle: one angle is exactly 90°", "Obtuse triangle: one angle is greater than 90°"], "ordered": false},
      {"type": "callout", "content": "The angles in any triangle always add up to 180°. This is true for all triangles, whether equilateral, isosceles, or scalene.", "style": "info"},
      {"type": "quiz", "question": "A triangle has sides of 5 cm, 5 cm, and 8 cm. What type is it?", "options": ["Equilateral", "Isosceles", "Scalene", "Right"], "correct": 1, "explanation": "Two sides are equal (5 cm each), making it an isosceles triangle."},
      {"type": "quiz", "question": "A triangle has angles of 30°, 60°, and 90°. Classify it by its angles.", "options": ["Acute", "Obtuse", "Right", "Equilateral"], "correct": 2, "explanation": "It has one 90° angle, making it a right triangle."}
    ]'::jsonb,
    '[
      {"term": "Polygon", "definition": "A closed 2-D shape made of straight line segments"},
      {"term": "Regular polygon", "definition": "A polygon with all sides equal and all angles equal"},
      {"term": "Irregular polygon", "definition": "A polygon whose sides or angles are not all equal"},
      {"term": "Equilateral triangle", "definition": "A triangle with three equal sides and three 60° angles"},
      {"term": "Isosceles triangle", "definition": "A triangle with exactly two equal sides"},
      {"term": "Scalene triangle", "definition": "A triangle with no equal sides"}
    ]'::jsonb,
    'Traditional Indigenous art and architecture feature a wide variety of polygons. Hexagonal patterns appear in basketry. Triangular shapes form the foundation of tipi construction. Star blankets use complex arrangements of triangles and other polygons to create beautiful, meaningful designs.',
    20, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS6.3';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What makes a polygon regular?', 'All sides are equal and all angles are equal. Examples: equilateral triangle, square, regular hexagon.', 'Equal everything', 2, 0),
    (v_tenant, v_ch, 'Name the three types of triangles classified by sides.', 'Equilateral (3 equal sides), isosceles (2 equal sides), scalene (no equal sides).', 'How many equal sides?', 2, 1),
    (v_tenant, v_ch, 'What do the angles of any triangle add up to?', '180°. This is true for all triangles.', 'Universal triangle rule', 2, 2),
    (v_tenant, v_ch, 'What is a right triangle?', 'A triangle with one angle that measures exactly 90°.', 'It has a square corner', 1, 3);

  -- ---------------------------------------------------------------
  -- Chapter 16: The Cartesian Plane (SS6.4)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 16,
    'The Cartesian Plane',
    'cartesian-plane',
    'Understand and use the first quadrant of the Cartesian plane with whole number coordinates.',
    '[
      {"type": "heading", "content": "The Cartesian Plane", "level": 1},
      {"type": "text", "content": "The Cartesian plane (also called a coordinate grid) is a system for locating points using two numbers. It consists of a horizontal line (x-axis) and a vertical line (y-axis) that intersect at a point called the origin (0, 0)."},
      {"type": "heading", "content": "Ordered Pairs", "level": 2},
      {"type": "text", "content": "Every point on the Cartesian plane is identified by an ordered pair (x, y). The first number tells how far to move horizontally from the origin. The second number tells how far to move vertically. The point (3, 5) means move 3 units right and 5 units up."},
      {"type": "callout", "content": "Remember: x comes before y, just like in the alphabet. The x-coordinate tells horizontal position (left-right), and the y-coordinate tells vertical position (up-down).", "style": "tip"},
      {"type": "heading", "content": "The First Quadrant", "level": 2},
      {"type": "text", "content": "In Grade 6, we work in the first quadrant, where both x and y values are positive or zero. The origin is at (0, 0). Points move right (positive x) and up (positive y). In later grades, you will explore all four quadrants, including negative coordinates."},
      {"type": "heading", "content": "Plotting and Reading Points", "level": 2},
      {"type": "text", "content": "To plot (4, 7): start at the origin, move 4 units right along the x-axis, then 7 units up. Mark the point. To read a point, reverse the process: count how many units right (x) and how many units up (y)."},
      {"type": "heading", "content": "Plotting Shapes", "level": 2},
      {"type": "text", "content": "You can draw shapes by plotting their vertices and connecting them. A rectangle might have vertices at (1, 2), (6, 2), (6, 5), and (1, 5)."},
      {"type": "quiz", "question": "What is the ordered pair for a point that is 5 units to the right of the origin and 3 units up?", "options": ["(3, 5)", "(5, 3)", "(5, 5)", "(3, 3)"], "correct": 1, "explanation": "The x-coordinate (horizontal) is 5 and the y-coordinate (vertical) is 3, so the ordered pair is (5, 3)."},
      {"type": "quiz", "question": "What are the coordinates of the origin?", "options": ["(1, 1)", "(0, 1)", "(1, 0)", "(0, 0)"], "correct": 3, "explanation": "The origin is where the x-axis and y-axis intersect, at (0, 0)."}
    ]'::jsonb,
    '[
      {"term": "Cartesian plane", "definition": "A coordinate system using two perpendicular number lines (axes) to locate points"},
      {"term": "x-axis", "definition": "The horizontal number line on the Cartesian plane"},
      {"term": "y-axis", "definition": "The vertical number line on the Cartesian plane"},
      {"term": "Origin", "definition": "The point (0, 0) where the x-axis and y-axis intersect"},
      {"term": "Ordered pair", "definition": "Two numbers (x, y) that give the location of a point on the Cartesian plane"},
      {"term": "Quadrant", "definition": "One of four sections created by the x-axis and y-axis"}
    ]'::jsonb,
    'Indigenous navigation systems used a form of coordinate thinking — determining position based on landmarks and celestial observations. Knowing that a camp was a certain distance along a river and a certain distance inland uses the same two-coordinate logic as the Cartesian plane.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS6.4';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the Cartesian plane?', 'A coordinate system with two perpendicular axes (x and y) used to locate points using ordered pairs.', 'A grid with axes', 1, 0),
    (v_tenant, v_ch, 'In the ordered pair (7, 2), which number is the x-coordinate?', '7. The first number is always the x-coordinate (horizontal position).', 'First number = x', 1, 1),
    (v_tenant, v_ch, 'What are the coordinates of the origin?', '(0, 0). It is the point where the x-axis and y-axis cross.', 'The centre of the grid', 1, 2),
    (v_tenant, v_ch, 'Plot and describe the point (4, 6).', 'Start at the origin, move 4 units right along the x-axis, then 6 units up. Mark the point.', 'Right first, then up', 2, 3);

  -- ---------------------------------------------------------------
  -- Chapter 17: Transformations and Combinations (SS6.5)
  -- ---------------------------------------------------------------
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, 17,
    'Transformations and Combinations',
    'transformations-combinations',
    'Perform single and combined transformations of 2-D shapes.',
    '[
      {"type": "heading", "content": "Transformations and Combinations", "level": 1},
      {"type": "text", "content": "In Grade 5, you learned about individual transformations: translations, reflections, and rotations. In Grade 6, we combine transformations — performing two or more in sequence — and analyse the results."},
      {"type": "heading", "content": "Review of Transformations", "level": 2},
      {"type": "list", "items": ["Translation: slide a shape without turning or flipping", "Reflection: flip a shape over a line to create a mirror image", "Rotation: turn a shape around a fixed point by a specified angle"], "ordered": false},
      {"type": "heading", "content": "Combining Transformations", "level": 2},
      {"type": "text", "content": "When you combine transformations, you apply one after another. For example, you might translate a shape 3 units right, then reflect it over the x-axis. The order matters — doing the same two transformations in a different order can produce a different result."},
      {"type": "callout", "content": "Example: Start with a triangle at (1,1), (3,1), (2,3). Translate right 4 units: (5,1), (7,1), (6,3). Then reflect over the x-axis: (5,-1), (7,-1), (6,-3). If you reflected first, then translated, the final position would be different!", "style": "example"},
      {"type": "heading", "content": "Describing Transformations", "level": 2},
      {"type": "text", "content": "Given an original shape and its image, you can describe the transformation(s) that occurred. Look for clues: Did the shape slide? Did it flip? Did it turn? Could it be a combination?"},
      {"type": "heading", "content": "Using Technology", "level": 2},
      {"type": "text", "content": "Computer programs and apps make it easy to explore transformations. You can quickly test different sequences and see the results, building intuition about how transformations work."},
      {"type": "quiz", "question": "A shape is reflected over the y-axis and then translated 5 units up. How many transformations were performed?", "options": ["1", "2", "3", "4"], "correct": 1, "explanation": "Two transformations were performed: first a reflection, then a translation."},
      {"type": "quiz", "question": "If you rotate a shape 90° clockwise and then rotate it another 90° clockwise, what single transformation gives the same result?", "options": ["A 90° rotation", "A 180° rotation", "A reflection", "A translation"], "correct": 1, "explanation": "Two 90° rotations equal one 180° rotation."}
    ]'::jsonb,
    '[
      {"term": "Combined transformation", "definition": "Two or more transformations applied in sequence to a shape"},
      {"term": "Image", "definition": "The new position of a shape after a transformation has been applied"},
      {"term": "Pre-image", "definition": "The original shape before a transformation is applied"},
      {"term": "Congruent", "definition": "Having the same size and shape — transformations produce congruent images"}
    ]'::jsonb,
    'Creating the intricate patterns in Indigenous beadwork, quillwork, and weaving involves combining transformations. An artist might create a motif, then translate it along a strip, reflect it to create symmetry, and rotate it to form a radial design — all combined transformations.',
    25, true)
  RETURNING id INTO v_ch;

  SELECT id INTO v_oc FROM curriculum_outcomes WHERE province = 'SK' AND outcome_code = 'SS6.5';
  IF v_oc IS NOT NULL THEN INSERT INTO chapter_outcome_map (chapter_id, outcome_id) VALUES (v_ch, v_oc) ON CONFLICT DO NOTHING; END IF;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a combined transformation?', 'Two or more transformations applied in sequence to a shape. For example, translate then reflect.', 'Multiple steps, one after another', 2, 0),
    (v_tenant, v_ch, 'Does the order of transformations matter?', 'Yes! Performing the same transformations in a different order can produce a different result.', 'Try both orders on grid paper', 3, 1),
    (v_tenant, v_ch, 'What is the image of a shape?', 'The new position and orientation of the shape after a transformation has been applied.', 'The result after transforming', 1, 2),
    (v_tenant, v_ch, 'Two reflections over parallel lines is equivalent to what single transformation?', 'A translation. The shape slides without flipping or turning.', 'Flip twice = slide', 3, 3);

  -- Update textbook chapter count
  UPDATE textbooks SET chapter_count = 17 WHERE id = v_book;

END $$;
