-- ============================================================================
-- WOLFWHALE LMS: Atlantic Canada & Northern Territories Curriculum Outcomes
-- ============================================================================
-- Atlantic Provinces: NS (Nova Scotia), NB (New Brunswick), PE (PEI), NL (Newfoundland & Labrador)
-- Northern Territories: YT (Yukon), NT (Northwest Territories), NU (Nunavut)
--
-- Framework: APEF (Atlantic Provinces Education Foundation)
-- All 4 Atlantic provinces share IDENTICAL math outcomes under APEF/WNCP
--
-- Strategy: NS outcomes written first, then duplicated for NB, PE, NL
-- Outcome codes: ProvinceCode-GradeStrandNumber
--   e.g., NS-KN1 = Nova Scotia, Kindergarten, Number, outcome 1
--   e.g., NS-5SS3 = Nova Scotia, Grade 5, Shape and Space, outcome 3
--
-- Strands:
--   N  = Number
--   PR = Patterns and Relations
--   SS = Shape and Space (Measurement + Geometry)
--   SP = Statistics and Probability
--
-- Generated: 2025
-- ============================================================================

-- ============================================================================
-- NOVA SCOTIA (NS) — APEF Mathematics K-9
-- ============================================================================

-- --------------------------------------------------------------------------
-- KINDERGARTEN (K) — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', 'K', 'NS-KN1', 'Number', 'Say the number sequence by 1s from 1 to 20 and from 10 to 1.', ARRAY['math', 'number', 'apef', 'kindergarten']),
('NS', 'APEF', 'math', 'K', 'NS-KN2', 'Number', 'Recognize, at a glance, and name the quantity represented by familiar arrangements of 1 to 5 objects or dots.', ARRAY['math', 'number', 'apef', 'kindergarten']),
('NS', 'APEF', 'math', 'K', 'NS-KN3', 'Number', 'Relate a numeral, 1 to 10, to its respective quantity.', ARRAY['math', 'number', 'apef', 'kindergarten']),
('NS', 'APEF', 'math', 'K', 'NS-KN4', 'Number', 'Represent and partition numbers 2 to 10 in two parts, concretely and pictorially.', ARRAY['math', 'number', 'apef', 'kindergarten']),
('NS', 'APEF', 'math', 'K', 'NS-KN5', 'Number', 'Compare sets containing 1 to 10 objects, using one-to-one correspondence.', ARRAY['math', 'number', 'apef', 'kindergarten']),
('NS', 'APEF', 'math', 'K', 'NS-KN6', 'Number', 'Demonstrate an understanding of counting to 10.', ARRAY['math', 'number', 'apef', 'kindergarten'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Kindergarten — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', 'K', 'NS-KPR1', 'Patterns and Relations', 'Demonstrate an understanding of repeating patterns (two or three elements) by identifying, reproducing, extending, and creating patterns.', ARRAY['math', 'patterns', 'apef', 'kindergarten'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Kindergarten — Shape and Space (Measurement + Geometry)
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', 'K', 'NS-KSS1', 'Shape and Space', 'Use direct comparison to compare two objects based on a single attribute such as length, mass, volume, and capacity.', ARRAY['math', 'shape', 'measurement', 'apef', 'kindergarten']),
('NS', 'APEF', 'math', 'K', 'NS-KSS2', 'Shape and Space', 'Sort 3-D objects using one attribute.', ARRAY['math', 'shape', 'geometry', 'apef', 'kindergarten']),
('NS', 'APEF', 'math', 'K', 'NS-KSS3', 'Shape and Space', 'Build and describe 3-D objects.', ARRAY['math', 'shape', 'geometry', 'apef', 'kindergarten'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 1 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '1', 'NS-1N1', 'Number', 'Say the number sequence by 1s forward and backward between any two given numbers, 0 to 100; by 2s to 20 forward starting at 0; by 5s and 10s to 100 forward starting at 0.', ARRAY['math', 'number', 'apef', 'grade_1']),
('NS', 'APEF', 'math', '1', 'NS-1N2', 'Number', 'Recognize, at a glance, and name the quantity represented by familiar arrangements of 1 to 10 objects or dots.', ARRAY['math', 'number', 'apef', 'grade_1']),
('NS', 'APEF', 'math', '1', 'NS-1N3', 'Number', 'Demonstrate an understanding of counting to 20 by indicating that the last number said identifies how many.', ARRAY['math', 'number', 'apef', 'grade_1']),
('NS', 'APEF', 'math', '1', 'NS-1N4', 'Number', 'Represent and partition numbers to 20.', ARRAY['math', 'number', 'apef', 'grade_1']),
('NS', 'APEF', 'math', '1', 'NS-1N5', 'Number', 'Compare sets containing up to 20 objects to solve problems using referents and one-to-one correspondence.', ARRAY['math', 'number', 'apef', 'grade_1']),
('NS', 'APEF', 'math', '1', 'NS-1N6', 'Number', 'Estimate quantities to 20 by using referents.', ARRAY['math', 'number', 'apef', 'grade_1']),
('NS', 'APEF', 'math', '1', 'NS-1N7', 'Number', 'Demonstrate an understanding of conservation of number for up to 20 objects.', ARRAY['math', 'number', 'apef', 'grade_1']),
('NS', 'APEF', 'math', '1', 'NS-1N8', 'Number', 'Identify the number, up to 20, that is one more, two more, one less, and two less than a given number.', ARRAY['math', 'number', 'apef', 'grade_1']),
('NS', 'APEF', 'math', '1', 'NS-1N9', 'Number', 'Demonstrate an understanding of addition of two one-digit numbers and the corresponding subtraction, concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_1']),
('NS', 'APEF', 'math', '1', 'NS-1N10', 'Number', 'Use and describe strategies to determine sums and differences using manipulatives and visual aids.', ARRAY['math', 'number', 'apef', 'grade_1'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 1 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '1', 'NS-1PR1', 'Patterns and Relations', 'Demonstrate an understanding of repeating patterns (two to four elements) by identifying, describing, reproducing, extending, and creating patterns using manipulatives, diagrams, and symbols.', ARRAY['math', 'patterns', 'apef', 'grade_1']),
('NS', 'APEF', 'math', '1', 'NS-1PR2', 'Patterns and Relations', 'Translate repeating patterns from one representation to another.', ARRAY['math', 'patterns', 'apef', 'grade_1']),
('NS', 'APEF', 'math', '1', 'NS-1PR3', 'Patterns and Relations', 'Describe equality as a balance and inequality as an imbalance, concretely and pictorially (0 to 20).', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_1']),
('NS', 'APEF', 'math', '1', 'NS-1PR4', 'Patterns and Relations', 'Record equalities using the equal symbol.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_1'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 1 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '1', 'NS-1SS1', 'Shape and Space', 'Demonstrate an understanding of measurement as a process of comparing by identifying attributes that can be compared and ordering objects.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_1']),
('NS', 'APEF', 'math', '1', 'NS-1SS2', 'Shape and Space', 'Sort 3-D objects and 2-D shapes using one attribute and explain the sorting rule.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_1']),
('NS', 'APEF', 'math', '1', 'NS-1SS3', 'Shape and Space', 'Replicate composite 2-D shapes and 3-D objects.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_1']),
('NS', 'APEF', 'math', '1', 'NS-1SS4', 'Shape and Space', 'Identify 2-D shapes in 3-D objects.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_1'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 2 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '2', 'NS-2N1', 'Number', 'Say the number sequence by 1s forward and backward starting from any point to 200; by 2s forward and backward to 100; by 5s and 10s forward and backward to 100; by 10s using starting points that are multiples of 10 to 100.', ARRAY['math', 'number', 'apef', 'grade_2']),
('NS', 'APEF', 'math', '2', 'NS-2N2', 'Number', 'Demonstrate whether a number up to 100 is even or odd.', ARRAY['math', 'number', 'apef', 'grade_2']),
('NS', 'APEF', 'math', '2', 'NS-2N3', 'Number', 'Describe order or relative position using ordinal numbers up to tenth.', ARRAY['math', 'number', 'apef', 'grade_2']),
('NS', 'APEF', 'math', '2', 'NS-2N4', 'Number', 'Represent and partition numbers to 100.', ARRAY['math', 'number', 'apef', 'grade_2']),
('NS', 'APEF', 'math', '2', 'NS-2N5', 'Number', 'Compare and order numbers up to 100.', ARRAY['math', 'number', 'apef', 'grade_2']),
('NS', 'APEF', 'math', '2', 'NS-2N6', 'Number', 'Estimate quantities to 100 by using referents.', ARRAY['math', 'number', 'apef', 'grade_2']),
('NS', 'APEF', 'math', '2', 'NS-2N7', 'Number', 'Illustrate, concretely and pictorially, the meaning of place value for numerals to 100.', ARRAY['math', 'number', 'apef', 'grade_2']),
('NS', 'APEF', 'math', '2', 'NS-2N8', 'Number', 'Demonstrate and explain the effect of adding zero to or subtracting zero from any number.', ARRAY['math', 'number', 'apef', 'grade_2']),
('NS', 'APEF', 'math', '2', 'NS-2N9', 'Number', 'Demonstrate an understanding of addition and subtraction of numbers with answers to 100.', ARRAY['math', 'number', 'apef', 'grade_2']),
('NS', 'APEF', 'math', '2', 'NS-2N10', 'Number', 'Apply mental mathematics strategies to quickly recall basic addition facts to 18 and related subtraction facts.', ARRAY['math', 'number', 'apef', 'grade_2'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 2 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '2', 'NS-2PR1', 'Patterns and Relations', 'Demonstrate an understanding of repeating patterns (three to five elements) by describing, extending, comparing, and creating patterns.', ARRAY['math', 'patterns', 'apef', 'grade_2']),
('NS', 'APEF', 'math', '2', 'NS-2PR2', 'Patterns and Relations', 'Demonstrate an understanding of increasing patterns by describing, reproducing, extending, and creating patterns using manipulatives, diagrams, sounds, and actions.', ARRAY['math', 'patterns', 'apef', 'grade_2']),
('NS', 'APEF', 'math', '2', 'NS-2PR3', 'Patterns and Relations', 'Demonstrate and explain the meaning of equality and inequality concretely and pictorially (0 to 100).', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_2']),
('NS', 'APEF', 'math', '2', 'NS-2PR4', 'Patterns and Relations', 'Record equalities and inequalities symbolically using the equal and not-equal symbols.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_2'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 2 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '2', 'NS-2SS1', 'Shape and Space', 'Demonstrate an understanding of the calendar and relationships among days, weeks, months, and years.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_2']),
('NS', 'APEF', 'math', '2', 'NS-2SS2', 'Shape and Space', 'Relate the size of a unit of measure to the number of units needed to measure length and mass.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_2']),
('NS', 'APEF', 'math', '2', 'NS-2SS3', 'Shape and Space', 'Compare and order objects by length, height, distance around, and mass using non-standard units.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_2']),
('NS', 'APEF', 'math', '2', 'NS-2SS4', 'Shape and Space', 'Measure length to the nearest non-standard unit.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_2']),
('NS', 'APEF', 'math', '2', 'NS-2SS5', 'Shape and Space', 'Demonstrate that changing the position of an object does not alter its measurement attributes.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_2']),
('NS', 'APEF', 'math', '2', 'NS-2SS6', 'Shape and Space', 'Sort 2-D shapes and 3-D objects using two attributes and explain the sorting rule.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_2']),
('NS', 'APEF', 'math', '2', 'NS-2SS7', 'Shape and Space', 'Recognize, name, describe, compare, and build 3-D objects including cubes, spheres, cones, cylinders, and pyramids.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_2']),
('NS', 'APEF', 'math', '2', 'NS-2SS8', 'Shape and Space', 'Recognize, name, describe, compare, and build 2-D shapes including triangles, squares, rectangles, and circles.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_2']),
('NS', 'APEF', 'math', '2', 'NS-2SS9', 'Shape and Space', 'Identify 2-D shapes as parts of 3-D objects in the environment.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_2'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 2 — Statistics and Probability
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '2', 'NS-2SP1', 'Statistics and Probability', 'Gather and record data about self and others to answer questions.', ARRAY['math', 'statistics', 'apef', 'grade_2']),
('NS', 'APEF', 'math', '2', 'NS-2SP2', 'Statistics and Probability', 'Construct and interpret concrete graphs and pictographs to solve problems.', ARRAY['math', 'statistics', 'apef', 'grade_2'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 3 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '3', 'NS-3N1', 'Number', 'Say the number sequence forward and backward by 1s through transitions to 1000; by 2s, 5s, 10s, or 100s to 1000 forward and backward using starting points that are multiples of those numbers.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NS', 'APEF', 'math', '3', 'NS-3N2', 'Number', 'Represent and partition numbers to 1000.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NS', 'APEF', 'math', '3', 'NS-3N3', 'Number', 'Compare and order numbers to 1000.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NS', 'APEF', 'math', '3', 'NS-3N4', 'Number', 'Estimate quantities less than 1000 using referents.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NS', 'APEF', 'math', '3', 'NS-3N5', 'Number', 'Illustrate, concretely and pictorially, the meaning of place value for numerals to 1000.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NS', 'APEF', 'math', '3', 'NS-3N6', 'Number', 'Describe and apply mental mathematics strategies for adding two 2-digit numerals.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NS', 'APEF', 'math', '3', 'NS-3N7', 'Number', 'Describe and apply mental mathematics strategies for subtracting two 2-digit numerals.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NS', 'APEF', 'math', '3', 'NS-3N8', 'Number', 'Apply estimation strategies to predict sums and differences of two 2-digit numerals in a problem-solving context.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NS', 'APEF', 'math', '3', 'NS-3N9', 'Number', 'Demonstrate an understanding of addition and subtraction of numbers with answers to 1000.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NS', 'APEF', 'math', '3', 'NS-3N10', 'Number', 'Apply mental mathematics strategies and number properties to recall basic addition facts to 18 and related subtraction facts.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NS', 'APEF', 'math', '3', 'NS-3N11', 'Number', 'Demonstrate an understanding of multiplication to 5 x 5 by representing and explaining using equal grouping and arrays.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NS', 'APEF', 'math', '3', 'NS-3N12', 'Number', 'Demonstrate an understanding of division by representing and explaining using equal sharing and equal grouping.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NS', 'APEF', 'math', '3', 'NS-3N13', 'Number', 'Demonstrate an understanding of fractions by explaining that a fraction represents a part of a whole, comparing fractions with like denominators, and using concrete and pictorial representations.', ARRAY['math', 'number', 'apef', 'grade_3'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 3 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '3', 'NS-3PR1', 'Patterns and Relations', 'Demonstrate an understanding of increasing patterns by describing, extending, comparing, and creating numerical and non-numerical patterns.', ARRAY['math', 'patterns', 'apef', 'grade_3']),
('NS', 'APEF', 'math', '3', 'NS-3PR2', 'Patterns and Relations', 'Demonstrate an understanding of decreasing patterns by describing, extending, comparing, and creating numerical and non-numerical patterns.', ARRAY['math', 'patterns', 'apef', 'grade_3']),
('NS', 'APEF', 'math', '3', 'NS-3PR3', 'Patterns and Relations', 'Solve one-step addition and subtraction equations involving a symbol representing an unknown number.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_3'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 3 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '3', 'NS-3SS1', 'Shape and Space', 'Relate the passage of time to common activities using non-standard and standard units (minutes, hours, days, weeks, months, years).', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_3']),
('NS', 'APEF', 'math', '3', 'NS-3SS2', 'Shape and Space', 'Relate the number of seconds to a minute, the number of minutes to an hour, and the number of days to a month in a problem-solving context.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_3']),
('NS', 'APEF', 'math', '3', 'NS-3SS3', 'Shape and Space', 'Demonstrate an understanding of measuring length in centimetres and metres.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_3']),
('NS', 'APEF', 'math', '3', 'NS-3SS4', 'Shape and Space', 'Demonstrate an understanding of measuring mass in grams and kilograms.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_3']),
('NS', 'APEF', 'math', '3', 'NS-3SS5', 'Shape and Space', 'Demonstrate an understanding of perimeter of regular and irregular shapes.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_3']),
('NS', 'APEF', 'math', '3', 'NS-3SS6', 'Shape and Space', 'Describe 3-D objects according to the shape of the faces and the number of edges and vertices.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_3']),
('NS', 'APEF', 'math', '3', 'NS-3SS7', 'Shape and Space', 'Name, describe, compare, create, and sort regular and irregular polygons including triangles, quadrilaterals, pentagons, hexagons, and octagons.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_3'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 3 — Statistics and Probability
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '3', 'NS-3SP1', 'Statistics and Probability', 'Collect first-hand data and organize it using tally marks, line plots, charts, and lists to answer questions.', ARRAY['math', 'statistics', 'apef', 'grade_3']),
('NS', 'APEF', 'math', '3', 'NS-3SP2', 'Statistics and Probability', 'Construct, label, and interpret bar graphs to solve problems.', ARRAY['math', 'statistics', 'apef', 'grade_3'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 4 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '4', 'NS-4N1', 'Number', 'Represent and partition whole numbers to 10 000.', ARRAY['math', 'number', 'apef', 'grade_4']),
('NS', 'APEF', 'math', '4', 'NS-4N2', 'Number', 'Compare and order numbers to 10 000.', ARRAY['math', 'number', 'apef', 'grade_4']),
('NS', 'APEF', 'math', '4', 'NS-4N3', 'Number', 'Demonstrate an understanding of addition and subtraction of numbers with answers to 10 000.', ARRAY['math', 'number', 'apef', 'grade_4']),
('NS', 'APEF', 'math', '4', 'NS-4N4', 'Number', 'Apply and explain the properties of 0 and 1 for multiplication and the property of 1 for division.', ARRAY['math', 'number', 'apef', 'grade_4']),
('NS', 'APEF', 'math', '4', 'NS-4N5', 'Number', 'Describe and apply mental mathematics strategies to recall basic multiplication facts to 9 x 9 and to determine related division facts.', ARRAY['math', 'number', 'apef', 'grade_4']),
('NS', 'APEF', 'math', '4', 'NS-4N6', 'Number', 'Demonstrate an understanding of multiplication of two- or three-digit numbers by one-digit numbers using personal strategies and concrete materials.', ARRAY['math', 'number', 'apef', 'grade_4']),
('NS', 'APEF', 'math', '4', 'NS-4N7', 'Number', 'Demonstrate an understanding of division with one-digit divisors and up to two-digit dividends to solve problems using personal strategies.', ARRAY['math', 'number', 'apef', 'grade_4']),
('NS', 'APEF', 'math', '4', 'NS-4N8', 'Number', 'Demonstrate an understanding of fractions less than or equal to 1 by using concrete, pictorial, and symbolic representations to name and record fractions, compare and order fractions, and model and explain that for different wholes, two identical fractions may not represent the same quantity.', ARRAY['math', 'number', 'apef', 'grade_4']),
('NS', 'APEF', 'math', '4', 'NS-4N9', 'Number', 'Describe and represent decimals (tenths and hundredths) concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_4']),
('NS', 'APEF', 'math', '4', 'NS-4N10', 'Number', 'Relate decimals to fractions and fractions to decimals to hundredths.', ARRAY['math', 'number', 'apef', 'grade_4']),
('NS', 'APEF', 'math', '4', 'NS-4N11', 'Number', 'Demonstrate an understanding of addition and subtraction of decimals limited to hundredths.', ARRAY['math', 'number', 'apef', 'grade_4'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 4 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '4', 'NS-4PR1', 'Patterns and Relations', 'Identify and describe patterns found in tables and charts, including a multiplication chart.', ARRAY['math', 'patterns', 'apef', 'grade_4']),
('NS', 'APEF', 'math', '4', 'NS-4PR2', 'Patterns and Relations', 'Translate among different representations of a pattern such as a table, a chart, or concrete materials.', ARRAY['math', 'patterns', 'apef', 'grade_4']),
('NS', 'APEF', 'math', '4', 'NS-4PR3', 'Patterns and Relations', 'Represent, describe, and extend patterns and relationships using charts and tables to solve problems.', ARRAY['math', 'patterns', 'apef', 'grade_4']),
('NS', 'APEF', 'math', '4', 'NS-4PR4', 'Patterns and Relations', 'Identify and explain mathematical relationships using charts and diagrams to solve problems.', ARRAY['math', 'patterns', 'apef', 'grade_4']),
('NS', 'APEF', 'math', '4', 'NS-4PR5', 'Patterns and Relations', 'Express a given problem as an equation in which a symbol is used to represent an unknown number.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_4']),
('NS', 'APEF', 'math', '4', 'NS-4PR6', 'Patterns and Relations', 'Solve one-step equations involving a symbol to represent an unknown number.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_4'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 4 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '4', 'NS-4SS1', 'Shape and Space', 'Read and record time using digital and analog clocks, including 24-hour clocks.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_4']),
('NS', 'APEF', 'math', '4', 'NS-4SS2', 'Shape and Space', 'Read and record calendar dates in a variety of formats.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_4']),
('NS', 'APEF', 'math', '4', 'NS-4SS3', 'Shape and Space', 'Demonstrate an understanding of area of regular and irregular 2-D shapes by recognizing that area is measured in square units.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_4']),
('NS', 'APEF', 'math', '4', 'NS-4SS4', 'Shape and Space', 'Describe and construct rectangular and triangular prisms.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_4']),
('NS', 'APEF', 'math', '4', 'NS-4SS5', 'Shape and Space', 'Demonstrate an understanding of congruency concretely and pictorially.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_4']),
('NS', 'APEF', 'math', '4', 'NS-4SS6', 'Shape and Space', 'Demonstrate an understanding of line symmetry by identifying symmetrical 2-D shapes and creating symmetrical 2-D shapes.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_4'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 4 — Statistics and Probability
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '4', 'NS-4SP1', 'Statistics and Probability', 'Demonstrate an understanding of many-to-one correspondence.', ARRAY['math', 'statistics', 'apef', 'grade_4']),
('NS', 'APEF', 'math', '4', 'NS-4SP2', 'Statistics and Probability', 'Construct and interpret pictographs and bar graphs involving many-to-one correspondence to draw conclusions.', ARRAY['math', 'statistics', 'apef', 'grade_4'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 5 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '5', 'NS-5N1', 'Number', 'Represent and partition whole numbers to 1 000 000.', ARRAY['math', 'number', 'apef', 'grade_5']),
('NS', 'APEF', 'math', '5', 'NS-5N2', 'Number', 'Use estimation strategies including front-end rounding, front-end adjusted rounding, and compatible numbers in problem-solving contexts.', ARRAY['math', 'number', 'apef', 'grade_5']),
('NS', 'APEF', 'math', '5', 'NS-5N3', 'Number', 'Apply mental mathematics strategies and number properties to recall multiplication facts to 81 and related division facts.', ARRAY['math', 'number', 'apef', 'grade_5']),
('NS', 'APEF', 'math', '5', 'NS-5N4', 'Number', 'Apply mental mathematics strategies for multiplication such as annexing then adding zeros, halving and doubling, and using the distributive property.', ARRAY['math', 'number', 'apef', 'grade_5']),
('NS', 'APEF', 'math', '5', 'NS-5N5', 'Number', 'Demonstrate an understanding of multiplication (two-digit by two-digit) to solve problems.', ARRAY['math', 'number', 'apef', 'grade_5']),
('NS', 'APEF', 'math', '5', 'NS-5N6', 'Number', 'Demonstrate an understanding of division (three-digit by one-digit) and interpret remainders to solve problems.', ARRAY['math', 'number', 'apef', 'grade_5']),
('NS', 'APEF', 'math', '5', 'NS-5N7', 'Number', 'Demonstrate an understanding of fractions by using concrete, pictorial, and symbolic representations to create sets of equivalent fractions and compare fractions with like and unlike denominators.', ARRAY['math', 'number', 'apef', 'grade_5']),
('NS', 'APEF', 'math', '5', 'NS-5N8', 'Number', 'Describe and represent decimals (tenths, hundredths, and thousandths) concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_5']),
('NS', 'APEF', 'math', '5', 'NS-5N9', 'Number', 'Relate decimals to fractions and fractions to decimals to thousandths.', ARRAY['math', 'number', 'apef', 'grade_5']),
('NS', 'APEF', 'math', '5', 'NS-5N10', 'Number', 'Compare and order decimals to thousandths by using benchmarks, place value, and equivalent decimals.', ARRAY['math', 'number', 'apef', 'grade_5']),
('NS', 'APEF', 'math', '5', 'NS-5N11', 'Number', 'Demonstrate an understanding of addition and subtraction of decimals limited to thousandths.', ARRAY['math', 'number', 'apef', 'grade_5'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 5 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '5', 'NS-5PR1', 'Patterns and Relations', 'Determine the pattern rule to make predictions about subsequent terms for increasing and decreasing patterns.', ARRAY['math', 'patterns', 'apef', 'grade_5']),
('NS', 'APEF', 'math', '5', 'NS-5PR2', 'Patterns and Relations', 'Solve problems involving single-variable, one-step equations with whole number coefficients and whole number solutions.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_5'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 5 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '5', 'NS-5SS1', 'Shape and Space', 'Design and construct different rectangles given either a perimeter or an area, or both, and draw conclusions.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_5']),
('NS', 'APEF', 'math', '5', 'NS-5SS2', 'Shape and Space', 'Demonstrate an understanding of measuring length in millimetres and relate millimetres, centimetres, and metres.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_5']),
('NS', 'APEF', 'math', '5', 'NS-5SS3', 'Shape and Space', 'Demonstrate an understanding of volume by selecting and justifying referents, estimating, and measuring using cm cubes and m cubes.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_5']),
('NS', 'APEF', 'math', '5', 'NS-5SS4', 'Shape and Space', 'Demonstrate an understanding of capacity by describing the relationship between mL and L.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_5']),
('NS', 'APEF', 'math', '5', 'NS-5SS5', 'Shape and Space', 'Describe and provide examples of edges and faces of 3-D objects, and sides of 2-D shapes that are parallel, intersecting, perpendicular, vertical, or horizontal.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_5']),
('NS', 'APEF', 'math', '5', 'NS-5SS6', 'Shape and Space', 'Identify and sort quadrilaterals including rectangles, squares, trapezoids, parallelograms, and rhombuses according to their attributes.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_5']),
('NS', 'APEF', 'math', '5', 'NS-5SS7', 'Shape and Space', 'Perform a single transformation (translation, rotation, or reflection) of a 2-D shape and draw and describe the image.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_5']),
('NS', 'APEF', 'math', '5', 'NS-5SS8', 'Shape and Space', 'Identify and describe a single transformation including a translation, rotation, or reflection of 2-D shapes.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_5']),
('NS', 'APEF', 'math', '5', 'NS-5SS9', 'Shape and Space', 'Identify right angles in the environment.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_5'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 5 — Statistics and Probability
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '5', 'NS-5SP1', 'Statistics and Probability', 'Differentiate between first-hand and second-hand data.', ARRAY['math', 'statistics', 'apef', 'grade_5']),
('NS', 'APEF', 'math', '5', 'NS-5SP2', 'Statistics and Probability', 'Construct and interpret double bar graphs to draw conclusions.', ARRAY['math', 'statistics', 'apef', 'grade_5']),
('NS', 'APEF', 'math', '5', 'NS-5SP3', 'Statistics and Probability', 'Describe the likelihood of a single outcome occurring using words such as impossible, unlikely, equally likely, likely, and certain.', ARRAY['math', 'statistics', 'probability', 'apef', 'grade_5']),
('NS', 'APEF', 'math', '5', 'NS-5SP4', 'Statistics and Probability', 'Compare the likelihood of two possible outcomes occurring using words such as less likely, equally likely, and more likely.', ARRAY['math', 'statistics', 'probability', 'apef', 'grade_5'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 6 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '6', 'NS-6N1', 'Number', 'Demonstrate an understanding of place value for numbers greater than one million and less than one-thousandth.', ARRAY['math', 'number', 'apef', 'grade_6']),
('NS', 'APEF', 'math', '6', 'NS-6N2', 'Number', 'Solve problems involving whole numbers and decimal numbers using a variety of strategies.', ARRAY['math', 'number', 'apef', 'grade_6']),
('NS', 'APEF', 'math', '6', 'NS-6N3', 'Number', 'Demonstrate an understanding of factors and multiples by determining multiples and factors of numbers less than 100, identifying prime and composite numbers, and solving problems.', ARRAY['math', 'number', 'apef', 'grade_6']),
('NS', 'APEF', 'math', '6', 'NS-6N4', 'Number', 'Relate improper fractions to mixed numbers and mixed numbers to improper fractions.', ARRAY['math', 'number', 'apef', 'grade_6']),
('NS', 'APEF', 'math', '6', 'NS-6N5', 'Number', 'Demonstrate an understanding of ratio concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_6']),
('NS', 'APEF', 'math', '6', 'NS-6N6', 'Number', 'Demonstrate an understanding of percent (limited to whole numbers) concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_6']),
('NS', 'APEF', 'math', '6', 'NS-6N7', 'Number', 'Demonstrate an understanding of integers contextually, concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_6']),
('NS', 'APEF', 'math', '6', 'NS-6N8', 'Number', 'Demonstrate an understanding of multiplication and division of decimals involving one-digit whole number multipliers, one-digit natural number divisors, and multipliers and divisors that are multiples of 10.', ARRAY['math', 'number', 'apef', 'grade_6']),
('NS', 'APEF', 'math', '6', 'NS-6N9', 'Number', 'Explain and apply the order of operations, excluding exponents, with and without technology.', ARRAY['math', 'number', 'apef', 'grade_6'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 6 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '6', 'NS-6PR1', 'Patterns and Relations', 'Demonstrate an understanding of the relationships within tables of values to solve problems.', ARRAY['math', 'patterns', 'apef', 'grade_6']),
('NS', 'APEF', 'math', '6', 'NS-6PR2', 'Patterns and Relations', 'Represent and describe patterns and relationships using graphs and tables.', ARRAY['math', 'patterns', 'apef', 'grade_6']),
('NS', 'APEF', 'math', '6', 'NS-6PR3', 'Patterns and Relations', 'Represent generalizations arising from number relationships using equations with letter variables.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_6']),
('NS', 'APEF', 'math', '6', 'NS-6PR4', 'Patterns and Relations', 'Demonstrate an understanding of preservation of equality concretely, pictorially, and symbolically.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_6'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 6 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '6', 'NS-6SS1', 'Shape and Space', 'Demonstrate an understanding of angles by identifying, classifying, grouping, estimating, measuring, drawing, and labelling angles.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_6']),
('NS', 'APEF', 'math', '6', 'NS-6SS2', 'Shape and Space', 'Demonstrate that the sum of interior angles is 180 degrees in a triangle and 360 degrees in a quadrilateral.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_6']),
('NS', 'APEF', 'math', '6', 'NS-6SS3', 'Shape and Space', 'Develop and apply a formula for determining the perimeter of polygons, area of rectangles, and volume of right rectangular prisms.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_6']),
('NS', 'APEF', 'math', '6', 'NS-6SS4', 'Shape and Space', 'Construct and compare triangles including scalene, isosceles, equilateral, right, obtuse, and acute in different orientations.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_6']),
('NS', 'APEF', 'math', '6', 'NS-6SS5', 'Shape and Space', 'Describe and compare the sides and angles of regular and irregular polygons.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_6']),
('NS', 'APEF', 'math', '6', 'NS-6SS6', 'Shape and Space', 'Perform a combination of translations, rotations, and reflections on a single 2-D shape with and without technology.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_6']),
('NS', 'APEF', 'math', '6', 'NS-6SS7', 'Shape and Space', 'Perform a combination of successive transformations of 2-D shapes to create a design, and identify and describe the transformations.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_6']),
('NS', 'APEF', 'math', '6', 'NS-6SS8', 'Shape and Space', 'Identify and plot points in the first quadrant of a Cartesian plane using whole number ordered pairs.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_6']),
('NS', 'APEF', 'math', '6', 'NS-6SS9', 'Shape and Space', 'Perform and describe single transformations of a 2-D shape in the first quadrant of a Cartesian plane.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_6'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 6 — Statistics and Probability
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '6', 'NS-6SP1', 'Statistics and Probability', 'Create, label, and interpret line graphs to draw conclusions.', ARRAY['math', 'statistics', 'apef', 'grade_6']),
('NS', 'APEF', 'math', '6', 'NS-6SP2', 'Statistics and Probability', 'Select, justify, and use appropriate methods of collecting data including questionnaires, experiments, databases, and electronic media.', ARRAY['math', 'statistics', 'apef', 'grade_6']),
('NS', 'APEF', 'math', '6', 'NS-6SP3', 'Statistics and Probability', 'Graph collected data and analyze the graph to solve problems.', ARRAY['math', 'statistics', 'apef', 'grade_6']),
('NS', 'APEF', 'math', '6', 'NS-6SP4', 'Statistics and Probability', 'Demonstrate an understanding of probability by identifying all possible outcomes of a probability experiment, differentiating between experimental and theoretical probability, and determining the theoretical probability of outcomes.', ARRAY['math', 'statistics', 'probability', 'apef', 'grade_6'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 7 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '7', 'NS-7N1', 'Number', 'Determine and explain why a number is divisible by 2, 3, 4, 5, 6, 8, 9, or 10, and why a number cannot be divided by 0.', ARRAY['math', 'number', 'apef', 'grade_7']),
('NS', 'APEF', 'math', '7', 'NS-7N2', 'Number', 'Demonstrate an understanding of the addition, subtraction, multiplication, and division of decimals to solve problems.', ARRAY['math', 'number', 'apef', 'grade_7']),
('NS', 'APEF', 'math', '7', 'NS-7N3', 'Number', 'Solve problems involving percents from 1% to 100% (limited to whole numbers).', ARRAY['math', 'number', 'apef', 'grade_7']),
('NS', 'APEF', 'math', '7', 'NS-7N4', 'Number', 'Demonstrate an understanding of the relationship between positive repeating decimals, positive terminating decimals, and positive fractions.', ARRAY['math', 'number', 'apef', 'grade_7']),
('NS', 'APEF', 'math', '7', 'NS-7N5', 'Number', 'Demonstrate an understanding of adding and subtracting positive fractions and mixed numbers with like and unlike denominators concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_7']),
('NS', 'APEF', 'math', '7', 'NS-7N6', 'Number', 'Demonstrate an understanding of addition and subtraction of integers concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_7']),
('NS', 'APEF', 'math', '7', 'NS-7N7', 'Number', 'Compare, order, and position positive fractions, positive decimals (to thousandths), and whole numbers by using benchmarks, place value, and equivalent fractions and decimals.', ARRAY['math', 'number', 'apef', 'grade_7'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 7 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '7', 'NS-7PR1', 'Patterns and Relations', 'Demonstrate an understanding of oral and written patterns and their equivalent linear relations.', ARRAY['math', 'patterns', 'apef', 'grade_7']),
('NS', 'APEF', 'math', '7', 'NS-7PR2', 'Patterns and Relations', 'Create a table of values from a linear relation, graph the table of values, and analyze the graph to draw conclusions and solve problems.', ARRAY['math', 'patterns', 'apef', 'grade_7']),
('NS', 'APEF', 'math', '7', 'NS-7PR3', 'Patterns and Relations', 'Demonstrate an understanding of preservation of equality by modelling problems using concrete materials and pictorial representations.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_7']),
('NS', 'APEF', 'math', '7', 'NS-7PR4', 'Patterns and Relations', 'Explain the difference between an expression and an equation.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_7']),
('NS', 'APEF', 'math', '7', 'NS-7PR5', 'Patterns and Relations', 'Evaluate an expression given the value of the variable(s).', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_7']),
('NS', 'APEF', 'math', '7', 'NS-7PR6', 'Patterns and Relations', 'Model and solve problems that can be represented by one-step linear equations of the form x + a = b, concretely, pictorially, and symbolically.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_7']),
('NS', 'APEF', 'math', '7', 'NS-7PR7', 'Patterns and Relations', 'Model and solve problems that can be represented by linear equations of the form ax + b = c, ax = b, or x/a = b, concretely, pictorially, and symbolically.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_7'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 7 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '7', 'NS-7SS1', 'Shape and Space', 'Demonstrate an understanding of circles by describing the relationships among radius, diameter, and circumference and relating circumference to pi.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_7']),
('NS', 'APEF', 'math', '7', 'NS-7SS2', 'Shape and Space', 'Develop and apply a formula for determining the area of triangles, parallelograms, and circles.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_7']),
('NS', 'APEF', 'math', '7', 'NS-7SS3', 'Shape and Space', 'Perform geometric constructions including perpendicular line segments, parallel line segments, perpendicular bisectors, and angle bisectors.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_7']),
('NS', 'APEF', 'math', '7', 'NS-7SS4', 'Shape and Space', 'Identify and plot points in the four quadrants of a Cartesian plane using ordered pairs.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_7']),
('NS', 'APEF', 'math', '7', 'NS-7SS5', 'Shape and Space', 'Perform and describe transformations (translations, rotations, or reflections) of a 2-D shape in all four quadrants of a Cartesian plane.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_7'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 7 — Statistics and Probability
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '7', 'NS-7SP1', 'Statistics and Probability', 'Demonstrate an understanding of central tendency and range by determining the measures of central tendency (mean, median, mode) and range.', ARRAY['math', 'statistics', 'apef', 'grade_7']),
('NS', 'APEF', 'math', '7', 'NS-7SP2', 'Statistics and Probability', 'Determine the effect on the mean, median, and mode when an outlier is included in or removed from a data set.', ARRAY['math', 'statistics', 'apef', 'grade_7']),
('NS', 'APEF', 'math', '7', 'NS-7SP3', 'Statistics and Probability', 'Construct, label, and interpret circle graphs to solve problems.', ARRAY['math', 'statistics', 'apef', 'grade_7']),
('NS', 'APEF', 'math', '7', 'NS-7SP4', 'Statistics and Probability', 'Express probabilities as ratios, fractions, and percents.', ARRAY['math', 'statistics', 'probability', 'apef', 'grade_7']),
('NS', 'APEF', 'math', '7', 'NS-7SP5', 'Statistics and Probability', 'Identify the sample space (list of all possible outcomes) for a probability experiment involving two independent events.', ARRAY['math', 'statistics', 'probability', 'apef', 'grade_7']),
('NS', 'APEF', 'math', '7', 'NS-7SP6', 'Statistics and Probability', 'Conduct a probability experiment to compare the theoretical probability and experimental probability of two independent events.', ARRAY['math', 'statistics', 'probability', 'apef', 'grade_7'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 8 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '8', 'NS-8N1', 'Number', 'Demonstrate an understanding of perfect squares and square roots concretely, pictorially, and symbolically (limited to whole numbers).', ARRAY['math', 'number', 'apef', 'grade_8']),
('NS', 'APEF', 'math', '8', 'NS-8N2', 'Number', 'Determine the approximate square root of numbers that are not perfect squares (limited to whole numbers).', ARRAY['math', 'number', 'apef', 'grade_8']),
('NS', 'APEF', 'math', '8', 'NS-8N3', 'Number', 'Demonstrate an understanding of percents greater than or equal to 0% including problems involving combined percents and percent of a percent.', ARRAY['math', 'number', 'apef', 'grade_8']),
('NS', 'APEF', 'math', '8', 'NS-8N4', 'Number', 'Demonstrate an understanding of ratio and rate.', ARRAY['math', 'number', 'apef', 'grade_8']),
('NS', 'APEF', 'math', '8', 'NS-8N5', 'Number', 'Solve problems that involve rates, ratios, and proportional reasoning.', ARRAY['math', 'number', 'apef', 'grade_8']),
('NS', 'APEF', 'math', '8', 'NS-8N6', 'Number', 'Demonstrate an understanding of multiplying and dividing positive fractions and mixed numbers concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_8']),
('NS', 'APEF', 'math', '8', 'NS-8N7', 'Number', 'Demonstrate an understanding of multiplication and division of integers concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_8'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 8 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '8', 'NS-8PR1', 'Patterns and Relations', 'Graph and analyze two-variable linear relations.', ARRAY['math', 'patterns', 'apef', 'grade_8']),
('NS', 'APEF', 'math', '8', 'NS-8PR2', 'Patterns and Relations', 'Model and solve problems using linear equations of the form ax = b, x/a = b, ax + b = c, x/a + b = c, and a(x + b) = c where a, b, and c are integers.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_8'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 8 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '8', 'NS-8SS1', 'Shape and Space', 'Develop and apply the Pythagorean theorem to solve problems.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_8']),
('NS', 'APEF', 'math', '8', 'NS-8SS2', 'Shape and Space', 'Draw and construct nets for 3-D objects.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_8']),
('NS', 'APEF', 'math', '8', 'NS-8SS3', 'Shape and Space', 'Determine the surface area of right rectangular prisms, right triangular prisms, and right cylinders to solve problems.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_8']),
('NS', 'APEF', 'math', '8', 'NS-8SS4', 'Shape and Space', 'Develop and apply formulas for determining the volume of right rectangular prisms, right triangular prisms, and right cylinders.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_8']),
('NS', 'APEF', 'math', '8', 'NS-8SS5', 'Shape and Space', 'Draw and interpret top, front, and side views of 3-D objects composed of right rectangular prisms.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_8']),
('NS', 'APEF', 'math', '8', 'NS-8SS6', 'Shape and Space', 'Demonstrate an understanding of the congruence of polygons under a transformation.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_8'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 8 — Statistics and Probability
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '8', 'NS-8SP1', 'Statistics and Probability', 'Critique ways in which data is presented in circle graphs, line graphs, bar graphs, and pictographs.', ARRAY['math', 'statistics', 'apef', 'grade_8']),
('NS', 'APEF', 'math', '8', 'NS-8SP2', 'Statistics and Probability', 'Solve problems involving the probability of independent events.', ARRAY['math', 'statistics', 'probability', 'apef', 'grade_8'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 9 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '9', 'NS-9N1', 'Number', 'Demonstrate an understanding of powers with integral bases (excluding base 0) and whole number exponents by representing repeated multiplication using powers, using patterns to show that a power with exponent zero is equal to one, and solving problems involving powers.', ARRAY['math', 'number', 'apef', 'grade_9']),
('NS', 'APEF', 'math', '9', 'NS-9N2', 'Number', 'Demonstrate an understanding of operations on powers with integral bases and whole number exponents.', ARRAY['math', 'number', 'apef', 'grade_9']),
('NS', 'APEF', 'math', '9', 'NS-9N3', 'Number', 'Demonstrate an understanding of rational numbers by comparing and ordering rational numbers and solving problems that involve arithmetic operations on rational numbers.', ARRAY['math', 'number', 'apef', 'grade_9']),
('NS', 'APEF', 'math', '9', 'NS-9N4', 'Number', 'Explain and apply the order of operations, including exponents, with and without technology.', ARRAY['math', 'number', 'apef', 'grade_9']),
('NS', 'APEF', 'math', '9', 'NS-9N5', 'Number', 'Determine the exact square root of positive rational numbers.', ARRAY['math', 'number', 'apef', 'grade_9']),
('NS', 'APEF', 'math', '9', 'NS-9N6', 'Number', 'Determine an approximate square root of positive rational numbers that are not perfect squares.', ARRAY['math', 'number', 'apef', 'grade_9'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 9 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '9', 'NS-9PR1', 'Patterns and Relations', 'Generalize a pattern arising from a problem-solving context using a linear equation and verify by substitution.', ARRAY['math', 'patterns', 'apef', 'grade_9']),
('NS', 'APEF', 'math', '9', 'NS-9PR2', 'Patterns and Relations', 'Graph a linear relation, analyze the graph, and interpolate or extrapolate to solve problems.', ARRAY['math', 'patterns', 'apef', 'grade_9']),
('NS', 'APEF', 'math', '9', 'NS-9PR3', 'Patterns and Relations', 'Model and solve problems using linear equations of the form ax = b, x/a = b (a is not 0), ax + b = c, x/a + b = c (a is not 0), a(x + b) = c, ax + b = cx + d, a(bx + c) = d(ex + f), and a/x = b (x is not 0).', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_9']),
('NS', 'APEF', 'math', '9', 'NS-9PR4', 'Patterns and Relations', 'Explain and illustrate strategies to solve single variable linear inequalities with rational coefficients.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_9']),
('NS', 'APEF', 'math', '9', 'NS-9PR5', 'Patterns and Relations', 'Demonstrate an understanding of polynomials (limited to polynomials of degree less than or equal to 2).', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_9']),
('NS', 'APEF', 'math', '9', 'NS-9PR6', 'Patterns and Relations', 'Model, record, and explain the operations of addition and subtraction of polynomial expressions concretely, pictorially, and symbolically.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_9']),
('NS', 'APEF', 'math', '9', 'NS-9PR7', 'Patterns and Relations', 'Model, record, and explain the operations of multiplication and division of polynomial expressions (limited to polynomials) by monomials concretely, pictorially, and symbolically.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_9'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 9 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '9', 'NS-9SS1', 'Shape and Space', 'Solve problems and justify the solution strategy using circle properties involving inscribed angles, central angles, and tangent lines.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_9']),
('NS', 'APEF', 'math', '9', 'NS-9SS2', 'Shape and Space', 'Determine the surface area of composite 3-D objects to solve problems.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_9']),
('NS', 'APEF', 'math', '9', 'NS-9SS3', 'Shape and Space', 'Demonstrate an understanding of similarity of polygons.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_9']),
('NS', 'APEF', 'math', '9', 'NS-9SS4', 'Shape and Space', 'Draw and interpret scale diagrams of 2-D shapes.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_9']),
('NS', 'APEF', 'math', '9', 'NS-9SS5', 'Shape and Space', 'Demonstrate an understanding of line and rotation symmetry.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_9'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 9 — Statistics and Probability
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NS', 'APEF', 'math', '9', 'NS-9SP1', 'Statistics and Probability', 'Describe the effect of bias, use of language, ethics, cost, time and timing, privacy, and cultural sensitivity on the collection of data.', ARRAY['math', 'statistics', 'apef', 'grade_9']),
('NS', 'APEF', 'math', '9', 'NS-9SP2', 'Statistics and Probability', 'Select and defend the choice of using either a population or a sample of a population to answer a question.', ARRAY['math', 'statistics', 'apef', 'grade_9']),
('NS', 'APEF', 'math', '9', 'NS-9SP3', 'Statistics and Probability', 'Develop and implement a project plan for the collection, display, and analysis of data by formulating a question, choosing a data collection method, and selecting a population or sample.', ARRAY['math', 'statistics', 'apef', 'grade_9']),
('NS', 'APEF', 'math', '9', 'NS-9SP4', 'Statistics and Probability', 'Demonstrate an understanding of the role of probability in society.', ARRAY['math', 'statistics', 'probability', 'apef', 'grade_9'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- ============================================================================
-- NEW BRUNSWICK (NB) — APEF Mathematics K-9
-- Identical outcomes to Nova Scotia under shared APEF framework
-- ============================================================================
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', 'K', 'NB-KN1', 'Number', 'Say the number sequence by 1s from 1 to 20 and from 10 to 1.', ARRAY['math', 'number', 'apef', 'kindergarten']),
('NB', 'APEF', 'math', 'K', 'NB-KN2', 'Number', 'Recognize, at a glance, and name the quantity represented by familiar arrangements of 1 to 5 objects or dots.', ARRAY['math', 'number', 'apef', 'kindergarten']),
('NB', 'APEF', 'math', 'K', 'NB-KN3', 'Number', 'Relate a numeral, 1 to 10, to its respective quantity.', ARRAY['math', 'number', 'apef', 'kindergarten']),
('NB', 'APEF', 'math', 'K', 'NB-KN4', 'Number', 'Represent and partition numbers 2 to 10 in two parts, concretely and pictorially.', ARRAY['math', 'number', 'apef', 'kindergarten']),
('NB', 'APEF', 'math', 'K', 'NB-KN5', 'Number', 'Compare sets containing 1 to 10 objects, using one-to-one correspondence.', ARRAY['math', 'number', 'apef', 'kindergarten']),
('NB', 'APEF', 'math', 'K', 'NB-KN6', 'Number', 'Demonstrate an understanding of counting to 10.', ARRAY['math', 'number', 'apef', 'kindergarten'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Kindergarten — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', 'K', 'NB-KPR1', 'Patterns and Relations', 'Demonstrate an understanding of repeating patterns (two or three elements) by identifying, reproducing, extending, and creating patterns.', ARRAY['math', 'patterns', 'apef', 'kindergarten'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Kindergarten — Shape and Space (Measurement + Geometry)
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', 'K', 'NB-KSS1', 'Shape and Space', 'Use direct comparison to compare two objects based on a single attribute such as length, mass, volume, and capacity.', ARRAY['math', 'shape', 'measurement', 'apef', 'kindergarten']),
('NB', 'APEF', 'math', 'K', 'NB-KSS2', 'Shape and Space', 'Sort 3-D objects using one attribute.', ARRAY['math', 'shape', 'geometry', 'apef', 'kindergarten']),
('NB', 'APEF', 'math', 'K', 'NB-KSS3', 'Shape and Space', 'Build and describe 3-D objects.', ARRAY['math', 'shape', 'geometry', 'apef', 'kindergarten'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 1 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '1', 'NB-1N1', 'Number', 'Say the number sequence by 1s forward and backward between any two given numbers, 0 to 100; by 2s to 20 forward starting at 0; by 5s and 10s to 100 forward starting at 0.', ARRAY['math', 'number', 'apef', 'grade_1']),
('NB', 'APEF', 'math', '1', 'NB-1N2', 'Number', 'Recognize, at a glance, and name the quantity represented by familiar arrangements of 1 to 10 objects or dots.', ARRAY['math', 'number', 'apef', 'grade_1']),
('NB', 'APEF', 'math', '1', 'NB-1N3', 'Number', 'Demonstrate an understanding of counting to 20 by indicating that the last number said identifies how many.', ARRAY['math', 'number', 'apef', 'grade_1']),
('NB', 'APEF', 'math', '1', 'NB-1N4', 'Number', 'Represent and partition numbers to 20.', ARRAY['math', 'number', 'apef', 'grade_1']),
('NB', 'APEF', 'math', '1', 'NB-1N5', 'Number', 'Compare sets containing up to 20 objects to solve problems using referents and one-to-one correspondence.', ARRAY['math', 'number', 'apef', 'grade_1']),
('NB', 'APEF', 'math', '1', 'NB-1N6', 'Number', 'Estimate quantities to 20 by using referents.', ARRAY['math', 'number', 'apef', 'grade_1']),
('NB', 'APEF', 'math', '1', 'NB-1N7', 'Number', 'Demonstrate an understanding of conservation of number for up to 20 objects.', ARRAY['math', 'number', 'apef', 'grade_1']),
('NB', 'APEF', 'math', '1', 'NB-1N8', 'Number', 'Identify the number, up to 20, that is one more, two more, one less, and two less than a given number.', ARRAY['math', 'number', 'apef', 'grade_1']),
('NB', 'APEF', 'math', '1', 'NB-1N9', 'Number', 'Demonstrate an understanding of addition of two one-digit numbers and the corresponding subtraction, concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_1']),
('NB', 'APEF', 'math', '1', 'NB-1N10', 'Number', 'Use and describe strategies to determine sums and differences using manipulatives and visual aids.', ARRAY['math', 'number', 'apef', 'grade_1'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 1 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '1', 'NB-1PR1', 'Patterns and Relations', 'Demonstrate an understanding of repeating patterns (two to four elements) by identifying, describing, reproducing, extending, and creating patterns using manipulatives, diagrams, and symbols.', ARRAY['math', 'patterns', 'apef', 'grade_1']),
('NB', 'APEF', 'math', '1', 'NB-1PR2', 'Patterns and Relations', 'Translate repeating patterns from one representation to another.', ARRAY['math', 'patterns', 'apef', 'grade_1']),
('NB', 'APEF', 'math', '1', 'NB-1PR3', 'Patterns and Relations', 'Describe equality as a balance and inequality as an imbalance, concretely and pictorially (0 to 20).', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_1']),
('NB', 'APEF', 'math', '1', 'NB-1PR4', 'Patterns and Relations', 'Record equalities using the equal symbol.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_1'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 1 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '1', 'NB-1SS1', 'Shape and Space', 'Demonstrate an understanding of measurement as a process of comparing by identifying attributes that can be compared and ordering objects.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_1']),
('NB', 'APEF', 'math', '1', 'NB-1SS2', 'Shape and Space', 'Sort 3-D objects and 2-D shapes using one attribute and explain the sorting rule.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_1']),
('NB', 'APEF', 'math', '1', 'NB-1SS3', 'Shape and Space', 'Replicate composite 2-D shapes and 3-D objects.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_1']),
('NB', 'APEF', 'math', '1', 'NB-1SS4', 'Shape and Space', 'Identify 2-D shapes in 3-D objects.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_1'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 2 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '2', 'NB-2N1', 'Number', 'Say the number sequence by 1s forward and backward starting from any point to 200; by 2s forward and backward to 100; by 5s and 10s forward and backward to 100; by 10s using starting points that are multiples of 10 to 100.', ARRAY['math', 'number', 'apef', 'grade_2']),
('NB', 'APEF', 'math', '2', 'NB-2N2', 'Number', 'Demonstrate whether a number up to 100 is even or odd.', ARRAY['math', 'number', 'apef', 'grade_2']),
('NB', 'APEF', 'math', '2', 'NB-2N3', 'Number', 'Describe order or relative position using ordinal numbers up to tenth.', ARRAY['math', 'number', 'apef', 'grade_2']),
('NB', 'APEF', 'math', '2', 'NB-2N4', 'Number', 'Represent and partition numbers to 100.', ARRAY['math', 'number', 'apef', 'grade_2']),
('NB', 'APEF', 'math', '2', 'NB-2N5', 'Number', 'Compare and order numbers up to 100.', ARRAY['math', 'number', 'apef', 'grade_2']),
('NB', 'APEF', 'math', '2', 'NB-2N6', 'Number', 'Estimate quantities to 100 by using referents.', ARRAY['math', 'number', 'apef', 'grade_2']),
('NB', 'APEF', 'math', '2', 'NB-2N7', 'Number', 'Illustrate, concretely and pictorially, the meaning of place value for numerals to 100.', ARRAY['math', 'number', 'apef', 'grade_2']),
('NB', 'APEF', 'math', '2', 'NB-2N8', 'Number', 'Demonstrate and explain the effect of adding zero to or subtracting zero from any number.', ARRAY['math', 'number', 'apef', 'grade_2']),
('NB', 'APEF', 'math', '2', 'NB-2N9', 'Number', 'Demonstrate an understanding of addition and subtraction of numbers with answers to 100.', ARRAY['math', 'number', 'apef', 'grade_2']),
('NB', 'APEF', 'math', '2', 'NB-2N10', 'Number', 'Apply mental mathematics strategies to quickly recall basic addition facts to 18 and related subtraction facts.', ARRAY['math', 'number', 'apef', 'grade_2'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 2 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '2', 'NB-2PR1', 'Patterns and Relations', 'Demonstrate an understanding of repeating patterns (three to five elements) by describing, extending, comparing, and creating patterns.', ARRAY['math', 'patterns', 'apef', 'grade_2']),
('NB', 'APEF', 'math', '2', 'NB-2PR2', 'Patterns and Relations', 'Demonstrate an understanding of increasing patterns by describing, reproducing, extending, and creating patterns using manipulatives, diagrams, sounds, and actions.', ARRAY['math', 'patterns', 'apef', 'grade_2']),
('NB', 'APEF', 'math', '2', 'NB-2PR3', 'Patterns and Relations', 'Demonstrate and explain the meaning of equality and inequality concretely and pictorially (0 to 100).', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_2']),
('NB', 'APEF', 'math', '2', 'NB-2PR4', 'Patterns and Relations', 'Record equalities and inequalities symbolically using the equal and not-equal symbols.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_2'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 2 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '2', 'NB-2SS1', 'Shape and Space', 'Demonstrate an understanding of the calendar and relationships among days, weeks, months, and years.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_2']),
('NB', 'APEF', 'math', '2', 'NB-2SS2', 'Shape and Space', 'Relate the size of a unit of measure to the number of units needed to measure length and mass.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_2']),
('NB', 'APEF', 'math', '2', 'NB-2SS3', 'Shape and Space', 'Compare and order objects by length, height, distance around, and mass using non-standard units.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_2']),
('NB', 'APEF', 'math', '2', 'NB-2SS4', 'Shape and Space', 'Measure length to the nearest non-standard unit.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_2']),
('NB', 'APEF', 'math', '2', 'NB-2SS5', 'Shape and Space', 'Demonstrate that changing the position of an object does not alter its measurement attributes.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_2']),
('NB', 'APEF', 'math', '2', 'NB-2SS6', 'Shape and Space', 'Sort 2-D shapes and 3-D objects using two attributes and explain the sorting rule.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_2']),
('NB', 'APEF', 'math', '2', 'NB-2SS7', 'Shape and Space', 'Recognize, name, describe, compare, and build 3-D objects including cubes, spheres, cones, cylinders, and pyramids.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_2']),
('NB', 'APEF', 'math', '2', 'NB-2SS8', 'Shape and Space', 'Recognize, name, describe, compare, and build 2-D shapes including triangles, squares, rectangles, and circles.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_2']),
('NB', 'APEF', 'math', '2', 'NB-2SS9', 'Shape and Space', 'Identify 2-D shapes as parts of 3-D objects in the environment.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_2'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 2 — Statistics and Probability
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '2', 'NB-2SP1', 'Statistics and Probability', 'Gather and record data about self and others to answer questions.', ARRAY['math', 'statistics', 'apef', 'grade_2']),
('NB', 'APEF', 'math', '2', 'NB-2SP2', 'Statistics and Probability', 'Construct and interpret concrete graphs and pictographs to solve problems.', ARRAY['math', 'statistics', 'apef', 'grade_2'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 3 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '3', 'NB-3N1', 'Number', 'Say the number sequence forward and backward by 1s through transitions to 1000; by 2s, 5s, 10s, or 100s to 1000 forward and backward using starting points that are multiples of those numbers.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NB', 'APEF', 'math', '3', 'NB-3N2', 'Number', 'Represent and partition numbers to 1000.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NB', 'APEF', 'math', '3', 'NB-3N3', 'Number', 'Compare and order numbers to 1000.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NB', 'APEF', 'math', '3', 'NB-3N4', 'Number', 'Estimate quantities less than 1000 using referents.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NB', 'APEF', 'math', '3', 'NB-3N5', 'Number', 'Illustrate, concretely and pictorially, the meaning of place value for numerals to 1000.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NB', 'APEF', 'math', '3', 'NB-3N6', 'Number', 'Describe and apply mental mathematics strategies for adding two 2-digit numerals.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NB', 'APEF', 'math', '3', 'NB-3N7', 'Number', 'Describe and apply mental mathematics strategies for subtracting two 2-digit numerals.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NB', 'APEF', 'math', '3', 'NB-3N8', 'Number', 'Apply estimation strategies to predict sums and differences of two 2-digit numerals in a problem-solving context.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NB', 'APEF', 'math', '3', 'NB-3N9', 'Number', 'Demonstrate an understanding of addition and subtraction of numbers with answers to 1000.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NB', 'APEF', 'math', '3', 'NB-3N10', 'Number', 'Apply mental mathematics strategies and number properties to recall basic addition facts to 18 and related subtraction facts.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NB', 'APEF', 'math', '3', 'NB-3N11', 'Number', 'Demonstrate an understanding of multiplication to 5 x 5 by representing and explaining using equal grouping and arrays.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NB', 'APEF', 'math', '3', 'NB-3N12', 'Number', 'Demonstrate an understanding of division by representing and explaining using equal sharing and equal grouping.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NB', 'APEF', 'math', '3', 'NB-3N13', 'Number', 'Demonstrate an understanding of fractions by explaining that a fraction represents a part of a whole, comparing fractions with like denominators, and using concrete and pictorial representations.', ARRAY['math', 'number', 'apef', 'grade_3'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 3 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '3', 'NB-3PR1', 'Patterns and Relations', 'Demonstrate an understanding of increasing patterns by describing, extending, comparing, and creating numerical and non-numerical patterns.', ARRAY['math', 'patterns', 'apef', 'grade_3']),
('NB', 'APEF', 'math', '3', 'NB-3PR2', 'Patterns and Relations', 'Demonstrate an understanding of decreasing patterns by describing, extending, comparing, and creating numerical and non-numerical patterns.', ARRAY['math', 'patterns', 'apef', 'grade_3']),
('NB', 'APEF', 'math', '3', 'NB-3PR3', 'Patterns and Relations', 'Solve one-step addition and subtraction equations involving a symbol representing an unknown number.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_3'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 3 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '3', 'NB-3SS1', 'Shape and Space', 'Relate the passage of time to common activities using non-standard and standard units (minutes, hours, days, weeks, months, years).', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_3']),
('NB', 'APEF', 'math', '3', 'NB-3SS2', 'Shape and Space', 'Relate the number of seconds to a minute, the number of minutes to an hour, and the number of days to a month in a problem-solving context.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_3']),
('NB', 'APEF', 'math', '3', 'NB-3SS3', 'Shape and Space', 'Demonstrate an understanding of measuring length in centimetres and metres.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_3']),
('NB', 'APEF', 'math', '3', 'NB-3SS4', 'Shape and Space', 'Demonstrate an understanding of measuring mass in grams and kilograms.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_3']),
('NB', 'APEF', 'math', '3', 'NB-3SS5', 'Shape and Space', 'Demonstrate an understanding of perimeter of regular and irregular shapes.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_3']),
('NB', 'APEF', 'math', '3', 'NB-3SS6', 'Shape and Space', 'Describe 3-D objects according to the shape of the faces and the number of edges and vertices.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_3']),
('NB', 'APEF', 'math', '3', 'NB-3SS7', 'Shape and Space', 'Name, describe, compare, create, and sort regular and irregular polygons including triangles, quadrilaterals, pentagons, hexagons, and octagons.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_3'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 3 — Statistics and Probability
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '3', 'NB-3SP1', 'Statistics and Probability', 'Collect first-hand data and organize it using tally marks, line plots, charts, and lists to answer questions.', ARRAY['math', 'statistics', 'apef', 'grade_3']),
('NB', 'APEF', 'math', '3', 'NB-3SP2', 'Statistics and Probability', 'Construct, label, and interpret bar graphs to solve problems.', ARRAY['math', 'statistics', 'apef', 'grade_3'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 4 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '4', 'NB-4N1', 'Number', 'Represent and partition whole numbers to 10 000.', ARRAY['math', 'number', 'apef', 'grade_4']),
('NB', 'APEF', 'math', '4', 'NB-4N2', 'Number', 'Compare and order numbers to 10 000.', ARRAY['math', 'number', 'apef', 'grade_4']),
('NB', 'APEF', 'math', '4', 'NB-4N3', 'Number', 'Demonstrate an understanding of addition and subtraction of numbers with answers to 10 000.', ARRAY['math', 'number', 'apef', 'grade_4']),
('NB', 'APEF', 'math', '4', 'NB-4N4', 'Number', 'Apply and explain the properties of 0 and 1 for multiplication and the property of 1 for division.', ARRAY['math', 'number', 'apef', 'grade_4']),
('NB', 'APEF', 'math', '4', 'NB-4N5', 'Number', 'Describe and apply mental mathematics strategies to recall basic multiplication facts to 9 x 9 and to determine related division facts.', ARRAY['math', 'number', 'apef', 'grade_4']),
('NB', 'APEF', 'math', '4', 'NB-4N6', 'Number', 'Demonstrate an understanding of multiplication of two- or three-digit numbers by one-digit numbers using personal strategies and concrete materials.', ARRAY['math', 'number', 'apef', 'grade_4']),
('NB', 'APEF', 'math', '4', 'NB-4N7', 'Number', 'Demonstrate an understanding of division with one-digit divisors and up to two-digit dividends to solve problems using personal strategies.', ARRAY['math', 'number', 'apef', 'grade_4']),
('NB', 'APEF', 'math', '4', 'NB-4N8', 'Number', 'Demonstrate an understanding of fractions less than or equal to 1 by using concrete, pictorial, and symbolic representations to name and record fractions, compare and order fractions, and model and explain that for different wholes, two identical fractions may not represent the same quantity.', ARRAY['math', 'number', 'apef', 'grade_4']),
('NB', 'APEF', 'math', '4', 'NB-4N9', 'Number', 'Describe and represent decimals (tenths and hundredths) concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_4']),
('NB', 'APEF', 'math', '4', 'NB-4N10', 'Number', 'Relate decimals to fractions and fractions to decimals to hundredths.', ARRAY['math', 'number', 'apef', 'grade_4']),
('NB', 'APEF', 'math', '4', 'NB-4N11', 'Number', 'Demonstrate an understanding of addition and subtraction of decimals limited to hundredths.', ARRAY['math', 'number', 'apef', 'grade_4'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 4 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '4', 'NB-4PR1', 'Patterns and Relations', 'Identify and describe patterns found in tables and charts, including a multiplication chart.', ARRAY['math', 'patterns', 'apef', 'grade_4']),
('NB', 'APEF', 'math', '4', 'NB-4PR2', 'Patterns and Relations', 'Translate among different representations of a pattern such as a table, a chart, or concrete materials.', ARRAY['math', 'patterns', 'apef', 'grade_4']),
('NB', 'APEF', 'math', '4', 'NB-4PR3', 'Patterns and Relations', 'Represent, describe, and extend patterns and relationships using charts and tables to solve problems.', ARRAY['math', 'patterns', 'apef', 'grade_4']),
('NB', 'APEF', 'math', '4', 'NB-4PR4', 'Patterns and Relations', 'Identify and explain mathematical relationships using charts and diagrams to solve problems.', ARRAY['math', 'patterns', 'apef', 'grade_4']),
('NB', 'APEF', 'math', '4', 'NB-4PR5', 'Patterns and Relations', 'Express a given problem as an equation in which a symbol is used to represent an unknown number.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_4']),
('NB', 'APEF', 'math', '4', 'NB-4PR6', 'Patterns and Relations', 'Solve one-step equations involving a symbol to represent an unknown number.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_4'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 4 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '4', 'NB-4SS1', 'Shape and Space', 'Read and record time using digital and analog clocks, including 24-hour clocks.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_4']),
('NB', 'APEF', 'math', '4', 'NB-4SS2', 'Shape and Space', 'Read and record calendar dates in a variety of formats.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_4']),
('NB', 'APEF', 'math', '4', 'NB-4SS3', 'Shape and Space', 'Demonstrate an understanding of area of regular and irregular 2-D shapes by recognizing that area is measured in square units.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_4']),
('NB', 'APEF', 'math', '4', 'NB-4SS4', 'Shape and Space', 'Describe and construct rectangular and triangular prisms.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_4']),
('NB', 'APEF', 'math', '4', 'NB-4SS5', 'Shape and Space', 'Demonstrate an understanding of congruency concretely and pictorially.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_4']),
('NB', 'APEF', 'math', '4', 'NB-4SS6', 'Shape and Space', 'Demonstrate an understanding of line symmetry by identifying symmetrical 2-D shapes and creating symmetrical 2-D shapes.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_4'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 4 — Statistics and Probability
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '4', 'NB-4SP1', 'Statistics and Probability', 'Demonstrate an understanding of many-to-one correspondence.', ARRAY['math', 'statistics', 'apef', 'grade_4']),
('NB', 'APEF', 'math', '4', 'NB-4SP2', 'Statistics and Probability', 'Construct and interpret pictographs and bar graphs involving many-to-one correspondence to draw conclusions.', ARRAY['math', 'statistics', 'apef', 'grade_4'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 5 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '5', 'NB-5N1', 'Number', 'Represent and partition whole numbers to 1 000 000.', ARRAY['math', 'number', 'apef', 'grade_5']),
('NB', 'APEF', 'math', '5', 'NB-5N2', 'Number', 'Use estimation strategies including front-end rounding, front-end adjusted rounding, and compatible numbers in problem-solving contexts.', ARRAY['math', 'number', 'apef', 'grade_5']),
('NB', 'APEF', 'math', '5', 'NB-5N3', 'Number', 'Apply mental mathematics strategies and number properties to recall multiplication facts to 81 and related division facts.', ARRAY['math', 'number', 'apef', 'grade_5']),
('NB', 'APEF', 'math', '5', 'NB-5N4', 'Number', 'Apply mental mathematics strategies for multiplication such as annexing then adding zeros, halving and doubling, and using the distributive property.', ARRAY['math', 'number', 'apef', 'grade_5']),
('NB', 'APEF', 'math', '5', 'NB-5N5', 'Number', 'Demonstrate an understanding of multiplication (two-digit by two-digit) to solve problems.', ARRAY['math', 'number', 'apef', 'grade_5']),
('NB', 'APEF', 'math', '5', 'NB-5N6', 'Number', 'Demonstrate an understanding of division (three-digit by one-digit) and interpret remainders to solve problems.', ARRAY['math', 'number', 'apef', 'grade_5']),
('NB', 'APEF', 'math', '5', 'NB-5N7', 'Number', 'Demonstrate an understanding of fractions by using concrete, pictorial, and symbolic representations to create sets of equivalent fractions and compare fractions with like and unlike denominators.', ARRAY['math', 'number', 'apef', 'grade_5']),
('NB', 'APEF', 'math', '5', 'NB-5N8', 'Number', 'Describe and represent decimals (tenths, hundredths, and thousandths) concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_5']),
('NB', 'APEF', 'math', '5', 'NB-5N9', 'Number', 'Relate decimals to fractions and fractions to decimals to thousandths.', ARRAY['math', 'number', 'apef', 'grade_5']),
('NB', 'APEF', 'math', '5', 'NB-5N10', 'Number', 'Compare and order decimals to thousandths by using benchmarks, place value, and equivalent decimals.', ARRAY['math', 'number', 'apef', 'grade_5']),
('NB', 'APEF', 'math', '5', 'NB-5N11', 'Number', 'Demonstrate an understanding of addition and subtraction of decimals limited to thousandths.', ARRAY['math', 'number', 'apef', 'grade_5'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 5 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '5', 'NB-5PR1', 'Patterns and Relations', 'Determine the pattern rule to make predictions about subsequent terms for increasing and decreasing patterns.', ARRAY['math', 'patterns', 'apef', 'grade_5']),
('NB', 'APEF', 'math', '5', 'NB-5PR2', 'Patterns and Relations', 'Solve problems involving single-variable, one-step equations with whole number coefficients and whole number solutions.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_5'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 5 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '5', 'NB-5SS1', 'Shape and Space', 'Design and construct different rectangles given either a perimeter or an area, or both, and draw conclusions.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_5']),
('NB', 'APEF', 'math', '5', 'NB-5SS2', 'Shape and Space', 'Demonstrate an understanding of measuring length in millimetres and relate millimetres, centimetres, and metres.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_5']),
('NB', 'APEF', 'math', '5', 'NB-5SS3', 'Shape and Space', 'Demonstrate an understanding of volume by selecting and justifying referents, estimating, and measuring using cm cubes and m cubes.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_5']),
('NB', 'APEF', 'math', '5', 'NB-5SS4', 'Shape and Space', 'Demonstrate an understanding of capacity by describing the relationship between mL and L.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_5']),
('NB', 'APEF', 'math', '5', 'NB-5SS5', 'Shape and Space', 'Describe and provide examples of edges and faces of 3-D objects, and sides of 2-D shapes that are parallel, intersecting, perpendicular, vertical, or horizontal.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_5']),
('NB', 'APEF', 'math', '5', 'NB-5SS6', 'Shape and Space', 'Identify and sort quadrilaterals including rectangles, squares, trapezoids, parallelograms, and rhombuses according to their attributes.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_5']),
('NB', 'APEF', 'math', '5', 'NB-5SS7', 'Shape and Space', 'Perform a single transformation (translation, rotation, or reflection) of a 2-D shape and draw and describe the image.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_5']),
('NB', 'APEF', 'math', '5', 'NB-5SS8', 'Shape and Space', 'Identify and describe a single transformation including a translation, rotation, or reflection of 2-D shapes.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_5']),
('NB', 'APEF', 'math', '5', 'NB-5SS9', 'Shape and Space', 'Identify right angles in the environment.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_5'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 5 — Statistics and Probability
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '5', 'NB-5SP1', 'Statistics and Probability', 'Differentiate between first-hand and second-hand data.', ARRAY['math', 'statistics', 'apef', 'grade_5']),
('NB', 'APEF', 'math', '5', 'NB-5SP2', 'Statistics and Probability', 'Construct and interpret double bar graphs to draw conclusions.', ARRAY['math', 'statistics', 'apef', 'grade_5']),
('NB', 'APEF', 'math', '5', 'NB-5SP3', 'Statistics and Probability', 'Describe the likelihood of a single outcome occurring using words such as impossible, unlikely, equally likely, likely, and certain.', ARRAY['math', 'statistics', 'probability', 'apef', 'grade_5']),
('NB', 'APEF', 'math', '5', 'NB-5SP4', 'Statistics and Probability', 'Compare the likelihood of two possible outcomes occurring using words such as less likely, equally likely, and more likely.', ARRAY['math', 'statistics', 'probability', 'apef', 'grade_5'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 6 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '6', 'NB-6N1', 'Number', 'Demonstrate an understanding of place value for numbers greater than one million and less than one-thousandth.', ARRAY['math', 'number', 'apef', 'grade_6']),
('NB', 'APEF', 'math', '6', 'NB-6N2', 'Number', 'Solve problems involving whole numbers and decimal numbers using a variety of strategies.', ARRAY['math', 'number', 'apef', 'grade_6']),
('NB', 'APEF', 'math', '6', 'NB-6N3', 'Number', 'Demonstrate an understanding of factors and multiples by determining multiples and factors of numbers less than 100, identifying prime and composite numbers, and solving problems.', ARRAY['math', 'number', 'apef', 'grade_6']),
('NB', 'APEF', 'math', '6', 'NB-6N4', 'Number', 'Relate improper fractions to mixed numbers and mixed numbers to improper fractions.', ARRAY['math', 'number', 'apef', 'grade_6']),
('NB', 'APEF', 'math', '6', 'NB-6N5', 'Number', 'Demonstrate an understanding of ratio concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_6']),
('NB', 'APEF', 'math', '6', 'NB-6N6', 'Number', 'Demonstrate an understanding of percent (limited to whole numbers) concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_6']),
('NB', 'APEF', 'math', '6', 'NB-6N7', 'Number', 'Demonstrate an understanding of integers contextually, concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_6']),
('NB', 'APEF', 'math', '6', 'NB-6N8', 'Number', 'Demonstrate an understanding of multiplication and division of decimals involving one-digit whole number multipliers, one-digit natural number divisors, and multipliers and divisors that are multiples of 10.', ARRAY['math', 'number', 'apef', 'grade_6']),
('NB', 'APEF', 'math', '6', 'NB-6N9', 'Number', 'Explain and apply the order of operations, excluding exponents, with and without technology.', ARRAY['math', 'number', 'apef', 'grade_6'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 6 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '6', 'NB-6PR1', 'Patterns and Relations', 'Demonstrate an understanding of the relationships within tables of values to solve problems.', ARRAY['math', 'patterns', 'apef', 'grade_6']),
('NB', 'APEF', 'math', '6', 'NB-6PR2', 'Patterns and Relations', 'Represent and describe patterns and relationships using graphs and tables.', ARRAY['math', 'patterns', 'apef', 'grade_6']),
('NB', 'APEF', 'math', '6', 'NB-6PR3', 'Patterns and Relations', 'Represent generalizations arising from number relationships using equations with letter variables.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_6']),
('NB', 'APEF', 'math', '6', 'NB-6PR4', 'Patterns and Relations', 'Demonstrate an understanding of preservation of equality concretely, pictorially, and symbolically.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_6'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 6 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '6', 'NB-6SS1', 'Shape and Space', 'Demonstrate an understanding of angles by identifying, classifying, grouping, estimating, measuring, drawing, and labelling angles.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_6']),
('NB', 'APEF', 'math', '6', 'NB-6SS2', 'Shape and Space', 'Demonstrate that the sum of interior angles is 180 degrees in a triangle and 360 degrees in a quadrilateral.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_6']),
('NB', 'APEF', 'math', '6', 'NB-6SS3', 'Shape and Space', 'Develop and apply a formula for determining the perimeter of polygons, area of rectangles, and volume of right rectangular prisms.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_6']),
('NB', 'APEF', 'math', '6', 'NB-6SS4', 'Shape and Space', 'Construct and compare triangles including scalene, isosceles, equilateral, right, obtuse, and acute in different orientations.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_6']),
('NB', 'APEF', 'math', '6', 'NB-6SS5', 'Shape and Space', 'Describe and compare the sides and angles of regular and irregular polygons.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_6']),
('NB', 'APEF', 'math', '6', 'NB-6SS6', 'Shape and Space', 'Perform a combination of translations, rotations, and reflections on a single 2-D shape with and without technology.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_6']),
('NB', 'APEF', 'math', '6', 'NB-6SS7', 'Shape and Space', 'Perform a combination of successive transformations of 2-D shapes to create a design, and identify and describe the transformations.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_6']),
('NB', 'APEF', 'math', '6', 'NB-6SS8', 'Shape and Space', 'Identify and plot points in the first quadrant of a Cartesian plane using whole number ordered pairs.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_6']),
('NB', 'APEF', 'math', '6', 'NB-6SS9', 'Shape and Space', 'Perform and describe single transformations of a 2-D shape in the first quadrant of a Cartesian plane.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_6'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 6 — Statistics and Probability
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '6', 'NB-6SP1', 'Statistics and Probability', 'Create, label, and interpret line graphs to draw conclusions.', ARRAY['math', 'statistics', 'apef', 'grade_6']),
('NB', 'APEF', 'math', '6', 'NB-6SP2', 'Statistics and Probability', 'Select, justify, and use appropriate methods of collecting data including questionnaires, experiments, databases, and electronic media.', ARRAY['math', 'statistics', 'apef', 'grade_6']),
('NB', 'APEF', 'math', '6', 'NB-6SP3', 'Statistics and Probability', 'Graph collected data and analyze the graph to solve problems.', ARRAY['math', 'statistics', 'apef', 'grade_6']),
('NB', 'APEF', 'math', '6', 'NB-6SP4', 'Statistics and Probability', 'Demonstrate an understanding of probability by identifying all possible outcomes of a probability experiment, differentiating between experimental and theoretical probability, and determining the theoretical probability of outcomes.', ARRAY['math', 'statistics', 'probability', 'apef', 'grade_6'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 7 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '7', 'NB-7N1', 'Number', 'Determine and explain why a number is divisible by 2, 3, 4, 5, 6, 8, 9, or 10, and why a number cannot be divided by 0.', ARRAY['math', 'number', 'apef', 'grade_7']),
('NB', 'APEF', 'math', '7', 'NB-7N2', 'Number', 'Demonstrate an understanding of the addition, subtraction, multiplication, and division of decimals to solve problems.', ARRAY['math', 'number', 'apef', 'grade_7']),
('NB', 'APEF', 'math', '7', 'NB-7N3', 'Number', 'Solve problems involving percents from 1% to 100% (limited to whole numbers).', ARRAY['math', 'number', 'apef', 'grade_7']),
('NB', 'APEF', 'math', '7', 'NB-7N4', 'Number', 'Demonstrate an understanding of the relationship between positive repeating decimals, positive terminating decimals, and positive fractions.', ARRAY['math', 'number', 'apef', 'grade_7']),
('NB', 'APEF', 'math', '7', 'NB-7N5', 'Number', 'Demonstrate an understanding of adding and subtracting positive fractions and mixed numbers with like and unlike denominators concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_7']),
('NB', 'APEF', 'math', '7', 'NB-7N6', 'Number', 'Demonstrate an understanding of addition and subtraction of integers concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_7']),
('NB', 'APEF', 'math', '7', 'NB-7N7', 'Number', 'Compare, order, and position positive fractions, positive decimals (to thousandths), and whole numbers by using benchmarks, place value, and equivalent fractions and decimals.', ARRAY['math', 'number', 'apef', 'grade_7'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 7 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '7', 'NB-7PR1', 'Patterns and Relations', 'Demonstrate an understanding of oral and written patterns and their equivalent linear relations.', ARRAY['math', 'patterns', 'apef', 'grade_7']),
('NB', 'APEF', 'math', '7', 'NB-7PR2', 'Patterns and Relations', 'Create a table of values from a linear relation, graph the table of values, and analyze the graph to draw conclusions and solve problems.', ARRAY['math', 'patterns', 'apef', 'grade_7']),
('NB', 'APEF', 'math', '7', 'NB-7PR3', 'Patterns and Relations', 'Demonstrate an understanding of preservation of equality by modelling problems using concrete materials and pictorial representations.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_7']),
('NB', 'APEF', 'math', '7', 'NB-7PR4', 'Patterns and Relations', 'Explain the difference between an expression and an equation.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_7']),
('NB', 'APEF', 'math', '7', 'NB-7PR5', 'Patterns and Relations', 'Evaluate an expression given the value of the variable(s).', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_7']),
('NB', 'APEF', 'math', '7', 'NB-7PR6', 'Patterns and Relations', 'Model and solve problems that can be represented by one-step linear equations of the form x + a = b, concretely, pictorially, and symbolically.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_7']),
('NB', 'APEF', 'math', '7', 'NB-7PR7', 'Patterns and Relations', 'Model and solve problems that can be represented by linear equations of the form ax + b = c, ax = b, or x/a = b, concretely, pictorially, and symbolically.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_7'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 7 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '7', 'NB-7SS1', 'Shape and Space', 'Demonstrate an understanding of circles by describing the relationships among radius, diameter, and circumference and relating circumference to pi.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_7']),
('NB', 'APEF', 'math', '7', 'NB-7SS2', 'Shape and Space', 'Develop and apply a formula for determining the area of triangles, parallelograms, and circles.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_7']),
('NB', 'APEF', 'math', '7', 'NB-7SS3', 'Shape and Space', 'Perform geometric constructions including perpendicular line segments, parallel line segments, perpendicular bisectors, and angle bisectors.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_7']),
('NB', 'APEF', 'math', '7', 'NB-7SS4', 'Shape and Space', 'Identify and plot points in the four quadrants of a Cartesian plane using ordered pairs.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_7']),
('NB', 'APEF', 'math', '7', 'NB-7SS5', 'Shape and Space', 'Perform and describe transformations (translations, rotations, or reflections) of a 2-D shape in all four quadrants of a Cartesian plane.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_7'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 7 — Statistics and Probability
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '7', 'NB-7SP1', 'Statistics and Probability', 'Demonstrate an understanding of central tendency and range by determining the measures of central tendency (mean, median, mode) and range.', ARRAY['math', 'statistics', 'apef', 'grade_7']),
('NB', 'APEF', 'math', '7', 'NB-7SP2', 'Statistics and Probability', 'Determine the effect on the mean, median, and mode when an outlier is included in or removed from a data set.', ARRAY['math', 'statistics', 'apef', 'grade_7']),
('NB', 'APEF', 'math', '7', 'NB-7SP3', 'Statistics and Probability', 'Construct, label, and interpret circle graphs to solve problems.', ARRAY['math', 'statistics', 'apef', 'grade_7']),
('NB', 'APEF', 'math', '7', 'NB-7SP4', 'Statistics and Probability', 'Express probabilities as ratios, fractions, and percents.', ARRAY['math', 'statistics', 'probability', 'apef', 'grade_7']),
('NB', 'APEF', 'math', '7', 'NB-7SP5', 'Statistics and Probability', 'Identify the sample space (list of all possible outcomes) for a probability experiment involving two independent events.', ARRAY['math', 'statistics', 'probability', 'apef', 'grade_7']),
('NB', 'APEF', 'math', '7', 'NB-7SP6', 'Statistics and Probability', 'Conduct a probability experiment to compare the theoretical probability and experimental probability of two independent events.', ARRAY['math', 'statistics', 'probability', 'apef', 'grade_7'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 8 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '8', 'NB-8N1', 'Number', 'Demonstrate an understanding of perfect squares and square roots concretely, pictorially, and symbolically (limited to whole numbers).', ARRAY['math', 'number', 'apef', 'grade_8']),
('NB', 'APEF', 'math', '8', 'NB-8N2', 'Number', 'Determine the approximate square root of numbers that are not perfect squares (limited to whole numbers).', ARRAY['math', 'number', 'apef', 'grade_8']),
('NB', 'APEF', 'math', '8', 'NB-8N3', 'Number', 'Demonstrate an understanding of percents greater than or equal to 0% including problems involving combined percents and percent of a percent.', ARRAY['math', 'number', 'apef', 'grade_8']),
('NB', 'APEF', 'math', '8', 'NB-8N4', 'Number', 'Demonstrate an understanding of ratio and rate.', ARRAY['math', 'number', 'apef', 'grade_8']),
('NB', 'APEF', 'math', '8', 'NB-8N5', 'Number', 'Solve problems that involve rates, ratios, and proportional reasoning.', ARRAY['math', 'number', 'apef', 'grade_8']),
('NB', 'APEF', 'math', '8', 'NB-8N6', 'Number', 'Demonstrate an understanding of multiplying and dividing positive fractions and mixed numbers concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_8']),
('NB', 'APEF', 'math', '8', 'NB-8N7', 'Number', 'Demonstrate an understanding of multiplication and division of integers concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_8'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 8 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '8', 'NB-8PR1', 'Patterns and Relations', 'Graph and analyze two-variable linear relations.', ARRAY['math', 'patterns', 'apef', 'grade_8']),
('NB', 'APEF', 'math', '8', 'NB-8PR2', 'Patterns and Relations', 'Model and solve problems using linear equations of the form ax = b, x/a = b, ax + b = c, x/a + b = c, and a(x + b) = c where a, b, and c are integers.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_8'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 8 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '8', 'NB-8SS1', 'Shape and Space', 'Develop and apply the Pythagorean theorem to solve problems.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_8']),
('NB', 'APEF', 'math', '8', 'NB-8SS2', 'Shape and Space', 'Draw and construct nets for 3-D objects.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_8']),
('NB', 'APEF', 'math', '8', 'NB-8SS3', 'Shape and Space', 'Determine the surface area of right rectangular prisms, right triangular prisms, and right cylinders to solve problems.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_8']),
('NB', 'APEF', 'math', '8', 'NB-8SS4', 'Shape and Space', 'Develop and apply formulas for determining the volume of right rectangular prisms, right triangular prisms, and right cylinders.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_8']),
('NB', 'APEF', 'math', '8', 'NB-8SS5', 'Shape and Space', 'Draw and interpret top, front, and side views of 3-D objects composed of right rectangular prisms.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_8']),
('NB', 'APEF', 'math', '8', 'NB-8SS6', 'Shape and Space', 'Demonstrate an understanding of the congruence of polygons under a transformation.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_8'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 8 — Statistics and Probability
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '8', 'NB-8SP1', 'Statistics and Probability', 'Critique ways in which data is presented in circle graphs, line graphs, bar graphs, and pictographs.', ARRAY['math', 'statistics', 'apef', 'grade_8']),
('NB', 'APEF', 'math', '8', 'NB-8SP2', 'Statistics and Probability', 'Solve problems involving the probability of independent events.', ARRAY['math', 'statistics', 'probability', 'apef', 'grade_8'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 9 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '9', 'NB-9N1', 'Number', 'Demonstrate an understanding of powers with integral bases (excluding base 0) and whole number exponents by representing repeated multiplication using powers, using patterns to show that a power with exponent zero is equal to one, and solving problems involving powers.', ARRAY['math', 'number', 'apef', 'grade_9']),
('NB', 'APEF', 'math', '9', 'NB-9N2', 'Number', 'Demonstrate an understanding of operations on powers with integral bases and whole number exponents.', ARRAY['math', 'number', 'apef', 'grade_9']),
('NB', 'APEF', 'math', '9', 'NB-9N3', 'Number', 'Demonstrate an understanding of rational numbers by comparing and ordering rational numbers and solving problems that involve arithmetic operations on rational numbers.', ARRAY['math', 'number', 'apef', 'grade_9']),
('NB', 'APEF', 'math', '9', 'NB-9N4', 'Number', 'Explain and apply the order of operations, including exponents, with and without technology.', ARRAY['math', 'number', 'apef', 'grade_9']),
('NB', 'APEF', 'math', '9', 'NB-9N5', 'Number', 'Determine the exact square root of positive rational numbers.', ARRAY['math', 'number', 'apef', 'grade_9']),
('NB', 'APEF', 'math', '9', 'NB-9N6', 'Number', 'Determine an approximate square root of positive rational numbers that are not perfect squares.', ARRAY['math', 'number', 'apef', 'grade_9'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 9 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '9', 'NB-9PR1', 'Patterns and Relations', 'Generalize a pattern arising from a problem-solving context using a linear equation and verify by substitution.', ARRAY['math', 'patterns', 'apef', 'grade_9']),
('NB', 'APEF', 'math', '9', 'NB-9PR2', 'Patterns and Relations', 'Graph a linear relation, analyze the graph, and interpolate or extrapolate to solve problems.', ARRAY['math', 'patterns', 'apef', 'grade_9']),
('NB', 'APEF', 'math', '9', 'NB-9PR3', 'Patterns and Relations', 'Model and solve problems using linear equations of the form ax = b, x/a = b (a is not 0), ax + b = c, x/a + b = c (a is not 0), a(x + b) = c, ax + b = cx + d, a(bx + c) = d(ex + f), and a/x = b (x is not 0).', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_9']),
('NB', 'APEF', 'math', '9', 'NB-9PR4', 'Patterns and Relations', 'Explain and illustrate strategies to solve single variable linear inequalities with rational coefficients.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_9']),
('NB', 'APEF', 'math', '9', 'NB-9PR5', 'Patterns and Relations', 'Demonstrate an understanding of polynomials (limited to polynomials of degree less than or equal to 2).', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_9']),
('NB', 'APEF', 'math', '9', 'NB-9PR6', 'Patterns and Relations', 'Model, record, and explain the operations of addition and subtraction of polynomial expressions concretely, pictorially, and symbolically.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_9']),
('NB', 'APEF', 'math', '9', 'NB-9PR7', 'Patterns and Relations', 'Model, record, and explain the operations of multiplication and division of polynomial expressions (limited to polynomials) by monomials concretely, pictorially, and symbolically.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_9'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 9 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '9', 'NB-9SS1', 'Shape and Space', 'Solve problems and justify the solution strategy using circle properties involving inscribed angles, central angles, and tangent lines.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_9']),
('NB', 'APEF', 'math', '9', 'NB-9SS2', 'Shape and Space', 'Determine the surface area of composite 3-D objects to solve problems.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_9']),
('NB', 'APEF', 'math', '9', 'NB-9SS3', 'Shape and Space', 'Demonstrate an understanding of similarity of polygons.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_9']),
('NB', 'APEF', 'math', '9', 'NB-9SS4', 'Shape and Space', 'Draw and interpret scale diagrams of 2-D shapes.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_9']),
('NB', 'APEF', 'math', '9', 'NB-9SS5', 'Shape and Space', 'Demonstrate an understanding of line and rotation symmetry.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_9'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 9 — Statistics and Probability
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NB', 'APEF', 'math', '9', 'NB-9SP1', 'Statistics and Probability', 'Describe the effect of bias, use of language, ethics, cost, time and timing, privacy, and cultural sensitivity on the collection of data.', ARRAY['math', 'statistics', 'apef', 'grade_9']),
('NB', 'APEF', 'math', '9', 'NB-9SP2', 'Statistics and Probability', 'Select and defend the choice of using either a population or a sample of a population to answer a question.', ARRAY['math', 'statistics', 'apef', 'grade_9']),
('NB', 'APEF', 'math', '9', 'NB-9SP3', 'Statistics and Probability', 'Develop and implement a project plan for the collection, display, and analysis of data by formulating a question, choosing a data collection method, and selecting a population or sample.', ARRAY['math', 'statistics', 'apef', 'grade_9']),
('NB', 'APEF', 'math', '9', 'NB-9SP4', 'Statistics and Probability', 'Demonstrate an understanding of the role of probability in society.', ARRAY['math', 'statistics', 'probability', 'apef', 'grade_9'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- ============================================================================

-- ============================================================================
-- PRINCE EDWARD ISLAND (PE) — APEF Mathematics K-9
-- Identical outcomes to Nova Scotia under shared APEF framework
-- ============================================================================
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', 'K', 'PE-KN1', 'Number', 'Say the number sequence by 1s from 1 to 20 and from 10 to 1.', ARRAY['math', 'number', 'apef', 'kindergarten']),
('PE', 'APEF', 'math', 'K', 'PE-KN2', 'Number', 'Recognize, at a glance, and name the quantity represented by familiar arrangements of 1 to 5 objects or dots.', ARRAY['math', 'number', 'apef', 'kindergarten']),
('PE', 'APEF', 'math', 'K', 'PE-KN3', 'Number', 'Relate a numeral, 1 to 10, to its respective quantity.', ARRAY['math', 'number', 'apef', 'kindergarten']),
('PE', 'APEF', 'math', 'K', 'PE-KN4', 'Number', 'Represent and partition numbers 2 to 10 in two parts, concretely and pictorially.', ARRAY['math', 'number', 'apef', 'kindergarten']),
('PE', 'APEF', 'math', 'K', 'PE-KN5', 'Number', 'Compare sets containing 1 to 10 objects, using one-to-one correspondence.', ARRAY['math', 'number', 'apef', 'kindergarten']),
('PE', 'APEF', 'math', 'K', 'PE-KN6', 'Number', 'Demonstrate an understanding of counting to 10.', ARRAY['math', 'number', 'apef', 'kindergarten'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Kindergarten — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', 'K', 'PE-KPR1', 'Patterns and Relations', 'Demonstrate an understanding of repeating patterns (two or three elements) by identifying, reproducing, extending, and creating patterns.', ARRAY['math', 'patterns', 'apef', 'kindergarten'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Kindergarten — Shape and Space (Measurement + Geometry)
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', 'K', 'PE-KSS1', 'Shape and Space', 'Use direct comparison to compare two objects based on a single attribute such as length, mass, volume, and capacity.', ARRAY['math', 'shape', 'measurement', 'apef', 'kindergarten']),
('PE', 'APEF', 'math', 'K', 'PE-KSS2', 'Shape and Space', 'Sort 3-D objects using one attribute.', ARRAY['math', 'shape', 'geometry', 'apef', 'kindergarten']),
('PE', 'APEF', 'math', 'K', 'PE-KSS3', 'Shape and Space', 'Build and describe 3-D objects.', ARRAY['math', 'shape', 'geometry', 'apef', 'kindergarten'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 1 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '1', 'PE-1N1', 'Number', 'Say the number sequence by 1s forward and backward between any two given numbers, 0 to 100; by 2s to 20 forward starting at 0; by 5s and 10s to 100 forward starting at 0.', ARRAY['math', 'number', 'apef', 'grade_1']),
('PE', 'APEF', 'math', '1', 'PE-1N2', 'Number', 'Recognize, at a glance, and name the quantity represented by familiar arrangements of 1 to 10 objects or dots.', ARRAY['math', 'number', 'apef', 'grade_1']),
('PE', 'APEF', 'math', '1', 'PE-1N3', 'Number', 'Demonstrate an understanding of counting to 20 by indicating that the last number said identifies how many.', ARRAY['math', 'number', 'apef', 'grade_1']),
('PE', 'APEF', 'math', '1', 'PE-1N4', 'Number', 'Represent and partition numbers to 20.', ARRAY['math', 'number', 'apef', 'grade_1']),
('PE', 'APEF', 'math', '1', 'PE-1N5', 'Number', 'Compare sets containing up to 20 objects to solve problems using referents and one-to-one correspondence.', ARRAY['math', 'number', 'apef', 'grade_1']),
('PE', 'APEF', 'math', '1', 'PE-1N6', 'Number', 'Estimate quantities to 20 by using referents.', ARRAY['math', 'number', 'apef', 'grade_1']),
('PE', 'APEF', 'math', '1', 'PE-1N7', 'Number', 'Demonstrate an understanding of conservation of number for up to 20 objects.', ARRAY['math', 'number', 'apef', 'grade_1']),
('PE', 'APEF', 'math', '1', 'PE-1N8', 'Number', 'Identify the number, up to 20, that is one more, two more, one less, and two less than a given number.', ARRAY['math', 'number', 'apef', 'grade_1']),
('PE', 'APEF', 'math', '1', 'PE-1N9', 'Number', 'Demonstrate an understanding of addition of two one-digit numbers and the corresponding subtraction, concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_1']),
('PE', 'APEF', 'math', '1', 'PE-1N10', 'Number', 'Use and describe strategies to determine sums and differences using manipulatives and visual aids.', ARRAY['math', 'number', 'apef', 'grade_1'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 1 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '1', 'PE-1PR1', 'Patterns and Relations', 'Demonstrate an understanding of repeating patterns (two to four elements) by identifying, describing, reproducing, extending, and creating patterns using manipulatives, diagrams, and symbols.', ARRAY['math', 'patterns', 'apef', 'grade_1']),
('PE', 'APEF', 'math', '1', 'PE-1PR2', 'Patterns and Relations', 'Translate repeating patterns from one representation to another.', ARRAY['math', 'patterns', 'apef', 'grade_1']),
('PE', 'APEF', 'math', '1', 'PE-1PR3', 'Patterns and Relations', 'Describe equality as a balance and inequality as an imbalance, concretely and pictorially (0 to 20).', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_1']),
('PE', 'APEF', 'math', '1', 'PE-1PR4', 'Patterns and Relations', 'Record equalities using the equal symbol.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_1'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 1 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '1', 'PE-1SS1', 'Shape and Space', 'Demonstrate an understanding of measurement as a process of comparing by identifying attributes that can be compared and ordering objects.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_1']),
('PE', 'APEF', 'math', '1', 'PE-1SS2', 'Shape and Space', 'Sort 3-D objects and 2-D shapes using one attribute and explain the sorting rule.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_1']),
('PE', 'APEF', 'math', '1', 'PE-1SS3', 'Shape and Space', 'Replicate composite 2-D shapes and 3-D objects.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_1']),
('PE', 'APEF', 'math', '1', 'PE-1SS4', 'Shape and Space', 'Identify 2-D shapes in 3-D objects.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_1'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 2 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '2', 'PE-2N1', 'Number', 'Say the number sequence by 1s forward and backward starting from any point to 200; by 2s forward and backward to 100; by 5s and 10s forward and backward to 100; by 10s using starting points that are multiples of 10 to 100.', ARRAY['math', 'number', 'apef', 'grade_2']),
('PE', 'APEF', 'math', '2', 'PE-2N2', 'Number', 'Demonstrate whether a number up to 100 is even or odd.', ARRAY['math', 'number', 'apef', 'grade_2']),
('PE', 'APEF', 'math', '2', 'PE-2N3', 'Number', 'Describe order or relative position using ordinal numbers up to tenth.', ARRAY['math', 'number', 'apef', 'grade_2']),
('PE', 'APEF', 'math', '2', 'PE-2N4', 'Number', 'Represent and partition numbers to 100.', ARRAY['math', 'number', 'apef', 'grade_2']),
('PE', 'APEF', 'math', '2', 'PE-2N5', 'Number', 'Compare and order numbers up to 100.', ARRAY['math', 'number', 'apef', 'grade_2']),
('PE', 'APEF', 'math', '2', 'PE-2N6', 'Number', 'Estimate quantities to 100 by using referents.', ARRAY['math', 'number', 'apef', 'grade_2']),
('PE', 'APEF', 'math', '2', 'PE-2N7', 'Number', 'Illustrate, concretely and pictorially, the meaning of place value for numerals to 100.', ARRAY['math', 'number', 'apef', 'grade_2']),
('PE', 'APEF', 'math', '2', 'PE-2N8', 'Number', 'Demonstrate and explain the effect of adding zero to or subtracting zero from any number.', ARRAY['math', 'number', 'apef', 'grade_2']),
('PE', 'APEF', 'math', '2', 'PE-2N9', 'Number', 'Demonstrate an understanding of addition and subtraction of numbers with answers to 100.', ARRAY['math', 'number', 'apef', 'grade_2']),
('PE', 'APEF', 'math', '2', 'PE-2N10', 'Number', 'Apply mental mathematics strategies to quickly recall basic addition facts to 18 and related subtraction facts.', ARRAY['math', 'number', 'apef', 'grade_2'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 2 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '2', 'PE-2PR1', 'Patterns and Relations', 'Demonstrate an understanding of repeating patterns (three to five elements) by describing, extending, comparing, and creating patterns.', ARRAY['math', 'patterns', 'apef', 'grade_2']),
('PE', 'APEF', 'math', '2', 'PE-2PR2', 'Patterns and Relations', 'Demonstrate an understanding of increasing patterns by describing, reproducing, extending, and creating patterns using manipulatives, diagrams, sounds, and actions.', ARRAY['math', 'patterns', 'apef', 'grade_2']),
('PE', 'APEF', 'math', '2', 'PE-2PR3', 'Patterns and Relations', 'Demonstrate and explain the meaning of equality and inequality concretely and pictorially (0 to 100).', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_2']),
('PE', 'APEF', 'math', '2', 'PE-2PR4', 'Patterns and Relations', 'Record equalities and inequalities symbolically using the equal and not-equal symbols.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_2'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 2 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '2', 'PE-2SS1', 'Shape and Space', 'Demonstrate an understanding of the calendar and relationships among days, weeks, months, and years.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_2']),
('PE', 'APEF', 'math', '2', 'PE-2SS2', 'Shape and Space', 'Relate the size of a unit of measure to the number of units needed to measure length and mass.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_2']),
('PE', 'APEF', 'math', '2', 'PE-2SS3', 'Shape and Space', 'Compare and order objects by length, height, distance around, and mass using non-standard units.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_2']),
('PE', 'APEF', 'math', '2', 'PE-2SS4', 'Shape and Space', 'Measure length to the nearest non-standard unit.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_2']),
('PE', 'APEF', 'math', '2', 'PE-2SS5', 'Shape and Space', 'Demonstrate that changing the position of an object does not alter its measurement attributes.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_2']),
('PE', 'APEF', 'math', '2', 'PE-2SS6', 'Shape and Space', 'Sort 2-D shapes and 3-D objects using two attributes and explain the sorting rule.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_2']),
('PE', 'APEF', 'math', '2', 'PE-2SS7', 'Shape and Space', 'Recognize, name, describe, compare, and build 3-D objects including cubes, spheres, cones, cylinders, and pyramids.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_2']),
('PE', 'APEF', 'math', '2', 'PE-2SS8', 'Shape and Space', 'Recognize, name, describe, compare, and build 2-D shapes including triangles, squares, rectangles, and circles.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_2']),
('PE', 'APEF', 'math', '2', 'PE-2SS9', 'Shape and Space', 'Identify 2-D shapes as parts of 3-D objects in the environment.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_2'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 2 — Statistics and Probability
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '2', 'PE-2SP1', 'Statistics and Probability', 'Gather and record data about self and others to answer questions.', ARRAY['math', 'statistics', 'apef', 'grade_2']),
('PE', 'APEF', 'math', '2', 'PE-2SP2', 'Statistics and Probability', 'Construct and interpret concrete graphs and pictographs to solve problems.', ARRAY['math', 'statistics', 'apef', 'grade_2'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 3 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '3', 'PE-3N1', 'Number', 'Say the number sequence forward and backward by 1s through transitions to 1000; by 2s, 5s, 10s, or 100s to 1000 forward and backward using starting points that are multiples of those numbers.', ARRAY['math', 'number', 'apef', 'grade_3']),
('PE', 'APEF', 'math', '3', 'PE-3N2', 'Number', 'Represent and partition numbers to 1000.', ARRAY['math', 'number', 'apef', 'grade_3']),
('PE', 'APEF', 'math', '3', 'PE-3N3', 'Number', 'Compare and order numbers to 1000.', ARRAY['math', 'number', 'apef', 'grade_3']),
('PE', 'APEF', 'math', '3', 'PE-3N4', 'Number', 'Estimate quantities less than 1000 using referents.', ARRAY['math', 'number', 'apef', 'grade_3']),
('PE', 'APEF', 'math', '3', 'PE-3N5', 'Number', 'Illustrate, concretely and pictorially, the meaning of place value for numerals to 1000.', ARRAY['math', 'number', 'apef', 'grade_3']),
('PE', 'APEF', 'math', '3', 'PE-3N6', 'Number', 'Describe and apply mental mathematics strategies for adding two 2-digit numerals.', ARRAY['math', 'number', 'apef', 'grade_3']),
('PE', 'APEF', 'math', '3', 'PE-3N7', 'Number', 'Describe and apply mental mathematics strategies for subtracting two 2-digit numerals.', ARRAY['math', 'number', 'apef', 'grade_3']),
('PE', 'APEF', 'math', '3', 'PE-3N8', 'Number', 'Apply estimation strategies to predict sums and differences of two 2-digit numerals in a problem-solving context.', ARRAY['math', 'number', 'apef', 'grade_3']),
('PE', 'APEF', 'math', '3', 'PE-3N9', 'Number', 'Demonstrate an understanding of addition and subtraction of numbers with answers to 1000.', ARRAY['math', 'number', 'apef', 'grade_3']),
('PE', 'APEF', 'math', '3', 'PE-3N10', 'Number', 'Apply mental mathematics strategies and number properties to recall basic addition facts to 18 and related subtraction facts.', ARRAY['math', 'number', 'apef', 'grade_3']),
('PE', 'APEF', 'math', '3', 'PE-3N11', 'Number', 'Demonstrate an understanding of multiplication to 5 x 5 by representing and explaining using equal grouping and arrays.', ARRAY['math', 'number', 'apef', 'grade_3']),
('PE', 'APEF', 'math', '3', 'PE-3N12', 'Number', 'Demonstrate an understanding of division by representing and explaining using equal sharing and equal grouping.', ARRAY['math', 'number', 'apef', 'grade_3']),
('PE', 'APEF', 'math', '3', 'PE-3N13', 'Number', 'Demonstrate an understanding of fractions by explaining that a fraction represents a part of a whole, comparing fractions with like denominators, and using concrete and pictorial representations.', ARRAY['math', 'number', 'apef', 'grade_3'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 3 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '3', 'PE-3PR1', 'Patterns and Relations', 'Demonstrate an understanding of increasing patterns by describing, extending, comparing, and creating numerical and non-numerical patterns.', ARRAY['math', 'patterns', 'apef', 'grade_3']),
('PE', 'APEF', 'math', '3', 'PE-3PR2', 'Patterns and Relations', 'Demonstrate an understanding of decreasing patterns by describing, extending, comparing, and creating numerical and non-numerical patterns.', ARRAY['math', 'patterns', 'apef', 'grade_3']),
('PE', 'APEF', 'math', '3', 'PE-3PR3', 'Patterns and Relations', 'Solve one-step addition and subtraction equations involving a symbol representing an unknown number.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_3'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 3 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '3', 'PE-3SS1', 'Shape and Space', 'Relate the passage of time to common activities using non-standard and standard units (minutes, hours, days, weeks, months, years).', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_3']),
('PE', 'APEF', 'math', '3', 'PE-3SS2', 'Shape and Space', 'Relate the number of seconds to a minute, the number of minutes to an hour, and the number of days to a month in a problem-solving context.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_3']),
('PE', 'APEF', 'math', '3', 'PE-3SS3', 'Shape and Space', 'Demonstrate an understanding of measuring length in centimetres and metres.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_3']),
('PE', 'APEF', 'math', '3', 'PE-3SS4', 'Shape and Space', 'Demonstrate an understanding of measuring mass in grams and kilograms.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_3']),
('PE', 'APEF', 'math', '3', 'PE-3SS5', 'Shape and Space', 'Demonstrate an understanding of perimeter of regular and irregular shapes.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_3']),
('PE', 'APEF', 'math', '3', 'PE-3SS6', 'Shape and Space', 'Describe 3-D objects according to the shape of the faces and the number of edges and vertices.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_3']),
('PE', 'APEF', 'math', '3', 'PE-3SS7', 'Shape and Space', 'Name, describe, compare, create, and sort regular and irregular polygons including triangles, quadrilaterals, pentagons, hexagons, and octagons.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_3'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 3 — Statistics and Probability
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '3', 'PE-3SP1', 'Statistics and Probability', 'Collect first-hand data and organize it using tally marks, line plots, charts, and lists to answer questions.', ARRAY['math', 'statistics', 'apef', 'grade_3']),
('PE', 'APEF', 'math', '3', 'PE-3SP2', 'Statistics and Probability', 'Construct, label, and interpret bar graphs to solve problems.', ARRAY['math', 'statistics', 'apef', 'grade_3'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 4 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '4', 'PE-4N1', 'Number', 'Represent and partition whole numbers to 10 000.', ARRAY['math', 'number', 'apef', 'grade_4']),
('PE', 'APEF', 'math', '4', 'PE-4N2', 'Number', 'Compare and order numbers to 10 000.', ARRAY['math', 'number', 'apef', 'grade_4']),
('PE', 'APEF', 'math', '4', 'PE-4N3', 'Number', 'Demonstrate an understanding of addition and subtraction of numbers with answers to 10 000.', ARRAY['math', 'number', 'apef', 'grade_4']),
('PE', 'APEF', 'math', '4', 'PE-4N4', 'Number', 'Apply and explain the properties of 0 and 1 for multiplication and the property of 1 for division.', ARRAY['math', 'number', 'apef', 'grade_4']),
('PE', 'APEF', 'math', '4', 'PE-4N5', 'Number', 'Describe and apply mental mathematics strategies to recall basic multiplication facts to 9 x 9 and to determine related division facts.', ARRAY['math', 'number', 'apef', 'grade_4']),
('PE', 'APEF', 'math', '4', 'PE-4N6', 'Number', 'Demonstrate an understanding of multiplication of two- or three-digit numbers by one-digit numbers using personal strategies and concrete materials.', ARRAY['math', 'number', 'apef', 'grade_4']),
('PE', 'APEF', 'math', '4', 'PE-4N7', 'Number', 'Demonstrate an understanding of division with one-digit divisors and up to two-digit dividends to solve problems using personal strategies.', ARRAY['math', 'number', 'apef', 'grade_4']),
('PE', 'APEF', 'math', '4', 'PE-4N8', 'Number', 'Demonstrate an understanding of fractions less than or equal to 1 by using concrete, pictorial, and symbolic representations to name and record fractions, compare and order fractions, and model and explain that for different wholes, two identical fractions may not represent the same quantity.', ARRAY['math', 'number', 'apef', 'grade_4']),
('PE', 'APEF', 'math', '4', 'PE-4N9', 'Number', 'Describe and represent decimals (tenths and hundredths) concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_4']),
('PE', 'APEF', 'math', '4', 'PE-4N10', 'Number', 'Relate decimals to fractions and fractions to decimals to hundredths.', ARRAY['math', 'number', 'apef', 'grade_4']),
('PE', 'APEF', 'math', '4', 'PE-4N11', 'Number', 'Demonstrate an understanding of addition and subtraction of decimals limited to hundredths.', ARRAY['math', 'number', 'apef', 'grade_4'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 4 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '4', 'PE-4PR1', 'Patterns and Relations', 'Identify and describe patterns found in tables and charts, including a multiplication chart.', ARRAY['math', 'patterns', 'apef', 'grade_4']),
('PE', 'APEF', 'math', '4', 'PE-4PR2', 'Patterns and Relations', 'Translate among different representations of a pattern such as a table, a chart, or concrete materials.', ARRAY['math', 'patterns', 'apef', 'grade_4']),
('PE', 'APEF', 'math', '4', 'PE-4PR3', 'Patterns and Relations', 'Represent, describe, and extend patterns and relationships using charts and tables to solve problems.', ARRAY['math', 'patterns', 'apef', 'grade_4']),
('PE', 'APEF', 'math', '4', 'PE-4PR4', 'Patterns and Relations', 'Identify and explain mathematical relationships using charts and diagrams to solve problems.', ARRAY['math', 'patterns', 'apef', 'grade_4']),
('PE', 'APEF', 'math', '4', 'PE-4PR5', 'Patterns and Relations', 'Express a given problem as an equation in which a symbol is used to represent an unknown number.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_4']),
('PE', 'APEF', 'math', '4', 'PE-4PR6', 'Patterns and Relations', 'Solve one-step equations involving a symbol to represent an unknown number.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_4'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 4 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '4', 'PE-4SS1', 'Shape and Space', 'Read and record time using digital and analog clocks, including 24-hour clocks.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_4']),
('PE', 'APEF', 'math', '4', 'PE-4SS2', 'Shape and Space', 'Read and record calendar dates in a variety of formats.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_4']),
('PE', 'APEF', 'math', '4', 'PE-4SS3', 'Shape and Space', 'Demonstrate an understanding of area of regular and irregular 2-D shapes by recognizing that area is measured in square units.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_4']),
('PE', 'APEF', 'math', '4', 'PE-4SS4', 'Shape and Space', 'Describe and construct rectangular and triangular prisms.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_4']),
('PE', 'APEF', 'math', '4', 'PE-4SS5', 'Shape and Space', 'Demonstrate an understanding of congruency concretely and pictorially.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_4']),
('PE', 'APEF', 'math', '4', 'PE-4SS6', 'Shape and Space', 'Demonstrate an understanding of line symmetry by identifying symmetrical 2-D shapes and creating symmetrical 2-D shapes.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_4'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 4 — Statistics and Probability
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '4', 'PE-4SP1', 'Statistics and Probability', 'Demonstrate an understanding of many-to-one correspondence.', ARRAY['math', 'statistics', 'apef', 'grade_4']),
('PE', 'APEF', 'math', '4', 'PE-4SP2', 'Statistics and Probability', 'Construct and interpret pictographs and bar graphs involving many-to-one correspondence to draw conclusions.', ARRAY['math', 'statistics', 'apef', 'grade_4'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 5 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '5', 'PE-5N1', 'Number', 'Represent and partition whole numbers to 1 000 000.', ARRAY['math', 'number', 'apef', 'grade_5']),
('PE', 'APEF', 'math', '5', 'PE-5N2', 'Number', 'Use estimation strategies including front-end rounding, front-end adjusted rounding, and compatible numbers in problem-solving contexts.', ARRAY['math', 'number', 'apef', 'grade_5']),
('PE', 'APEF', 'math', '5', 'PE-5N3', 'Number', 'Apply mental mathematics strategies and number properties to recall multiplication facts to 81 and related division facts.', ARRAY['math', 'number', 'apef', 'grade_5']),
('PE', 'APEF', 'math', '5', 'PE-5N4', 'Number', 'Apply mental mathematics strategies for multiplication such as annexing then adding zeros, halving and doubling, and using the distributive property.', ARRAY['math', 'number', 'apef', 'grade_5']),
('PE', 'APEF', 'math', '5', 'PE-5N5', 'Number', 'Demonstrate an understanding of multiplication (two-digit by two-digit) to solve problems.', ARRAY['math', 'number', 'apef', 'grade_5']),
('PE', 'APEF', 'math', '5', 'PE-5N6', 'Number', 'Demonstrate an understanding of division (three-digit by one-digit) and interpret remainders to solve problems.', ARRAY['math', 'number', 'apef', 'grade_5']),
('PE', 'APEF', 'math', '5', 'PE-5N7', 'Number', 'Demonstrate an understanding of fractions by using concrete, pictorial, and symbolic representations to create sets of equivalent fractions and compare fractions with like and unlike denominators.', ARRAY['math', 'number', 'apef', 'grade_5']),
('PE', 'APEF', 'math', '5', 'PE-5N8', 'Number', 'Describe and represent decimals (tenths, hundredths, and thousandths) concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_5']),
('PE', 'APEF', 'math', '5', 'PE-5N9', 'Number', 'Relate decimals to fractions and fractions to decimals to thousandths.', ARRAY['math', 'number', 'apef', 'grade_5']),
('PE', 'APEF', 'math', '5', 'PE-5N10', 'Number', 'Compare and order decimals to thousandths by using benchmarks, place value, and equivalent decimals.', ARRAY['math', 'number', 'apef', 'grade_5']),
('PE', 'APEF', 'math', '5', 'PE-5N11', 'Number', 'Demonstrate an understanding of addition and subtraction of decimals limited to thousandths.', ARRAY['math', 'number', 'apef', 'grade_5'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 5 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '5', 'PE-5PR1', 'Patterns and Relations', 'Determine the pattern rule to make predictions about subsequent terms for increasing and decreasing patterns.', ARRAY['math', 'patterns', 'apef', 'grade_5']),
('PE', 'APEF', 'math', '5', 'PE-5PR2', 'Patterns and Relations', 'Solve problems involving single-variable, one-step equations with whole number coefficients and whole number solutions.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_5'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 5 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '5', 'PE-5SS1', 'Shape and Space', 'Design and construct different rectangles given either a perimeter or an area, or both, and draw conclusions.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_5']),
('PE', 'APEF', 'math', '5', 'PE-5SS2', 'Shape and Space', 'Demonstrate an understanding of measuring length in millimetres and relate millimetres, centimetres, and metres.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_5']),
('PE', 'APEF', 'math', '5', 'PE-5SS3', 'Shape and Space', 'Demonstrate an understanding of volume by selecting and justifying referents, estimating, and measuring using cm cubes and m cubes.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_5']),
('PE', 'APEF', 'math', '5', 'PE-5SS4', 'Shape and Space', 'Demonstrate an understanding of capacity by describing the relationship between mL and L.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_5']),
('PE', 'APEF', 'math', '5', 'PE-5SS5', 'Shape and Space', 'Describe and provide examples of edges and faces of 3-D objects, and sides of 2-D shapes that are parallel, intersecting, perpendicular, vertical, or horizontal.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_5']),
('PE', 'APEF', 'math', '5', 'PE-5SS6', 'Shape and Space', 'Identify and sort quadrilaterals including rectangles, squares, trapezoids, parallelograms, and rhombuses according to their attributes.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_5']),
('PE', 'APEF', 'math', '5', 'PE-5SS7', 'Shape and Space', 'Perform a single transformation (translation, rotation, or reflection) of a 2-D shape and draw and describe the image.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_5']),
('PE', 'APEF', 'math', '5', 'PE-5SS8', 'Shape and Space', 'Identify and describe a single transformation including a translation, rotation, or reflection of 2-D shapes.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_5']),
('PE', 'APEF', 'math', '5', 'PE-5SS9', 'Shape and Space', 'Identify right angles in the environment.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_5'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 5 — Statistics and Probability
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '5', 'PE-5SP1', 'Statistics and Probability', 'Differentiate between first-hand and second-hand data.', ARRAY['math', 'statistics', 'apef', 'grade_5']),
('PE', 'APEF', 'math', '5', 'PE-5SP2', 'Statistics and Probability', 'Construct and interpret double bar graphs to draw conclusions.', ARRAY['math', 'statistics', 'apef', 'grade_5']),
('PE', 'APEF', 'math', '5', 'PE-5SP3', 'Statistics and Probability', 'Describe the likelihood of a single outcome occurring using words such as impossible, unlikely, equally likely, likely, and certain.', ARRAY['math', 'statistics', 'probability', 'apef', 'grade_5']),
('PE', 'APEF', 'math', '5', 'PE-5SP4', 'Statistics and Probability', 'Compare the likelihood of two possible outcomes occurring using words such as less likely, equally likely, and more likely.', ARRAY['math', 'statistics', 'probability', 'apef', 'grade_5'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 6 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '6', 'PE-6N1', 'Number', 'Demonstrate an understanding of place value for numbers greater than one million and less than one-thousandth.', ARRAY['math', 'number', 'apef', 'grade_6']),
('PE', 'APEF', 'math', '6', 'PE-6N2', 'Number', 'Solve problems involving whole numbers and decimal numbers using a variety of strategies.', ARRAY['math', 'number', 'apef', 'grade_6']),
('PE', 'APEF', 'math', '6', 'PE-6N3', 'Number', 'Demonstrate an understanding of factors and multiples by determining multiples and factors of numbers less than 100, identifying prime and composite numbers, and solving problems.', ARRAY['math', 'number', 'apef', 'grade_6']),
('PE', 'APEF', 'math', '6', 'PE-6N4', 'Number', 'Relate improper fractions to mixed numbers and mixed numbers to improper fractions.', ARRAY['math', 'number', 'apef', 'grade_6']),
('PE', 'APEF', 'math', '6', 'PE-6N5', 'Number', 'Demonstrate an understanding of ratio concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_6']),
('PE', 'APEF', 'math', '6', 'PE-6N6', 'Number', 'Demonstrate an understanding of percent (limited to whole numbers) concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_6']),
('PE', 'APEF', 'math', '6', 'PE-6N7', 'Number', 'Demonstrate an understanding of integers contextually, concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_6']),
('PE', 'APEF', 'math', '6', 'PE-6N8', 'Number', 'Demonstrate an understanding of multiplication and division of decimals involving one-digit whole number multipliers, one-digit natural number divisors, and multipliers and divisors that are multiples of 10.', ARRAY['math', 'number', 'apef', 'grade_6']),
('PE', 'APEF', 'math', '6', 'PE-6N9', 'Number', 'Explain and apply the order of operations, excluding exponents, with and without technology.', ARRAY['math', 'number', 'apef', 'grade_6'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 6 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '6', 'PE-6PR1', 'Patterns and Relations', 'Demonstrate an understanding of the relationships within tables of values to solve problems.', ARRAY['math', 'patterns', 'apef', 'grade_6']),
('PE', 'APEF', 'math', '6', 'PE-6PR2', 'Patterns and Relations', 'Represent and describe patterns and relationships using graphs and tables.', ARRAY['math', 'patterns', 'apef', 'grade_6']),
('PE', 'APEF', 'math', '6', 'PE-6PR3', 'Patterns and Relations', 'Represent generalizations arising from number relationships using equations with letter variables.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_6']),
('PE', 'APEF', 'math', '6', 'PE-6PR4', 'Patterns and Relations', 'Demonstrate an understanding of preservation of equality concretely, pictorially, and symbolically.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_6'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 6 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '6', 'PE-6SS1', 'Shape and Space', 'Demonstrate an understanding of angles by identifying, classifying, grouping, estimating, measuring, drawing, and labelling angles.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_6']),
('PE', 'APEF', 'math', '6', 'PE-6SS2', 'Shape and Space', 'Demonstrate that the sum of interior angles is 180 degrees in a triangle and 360 degrees in a quadrilateral.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_6']),
('PE', 'APEF', 'math', '6', 'PE-6SS3', 'Shape and Space', 'Develop and apply a formula for determining the perimeter of polygons, area of rectangles, and volume of right rectangular prisms.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_6']),
('PE', 'APEF', 'math', '6', 'PE-6SS4', 'Shape and Space', 'Construct and compare triangles including scalene, isosceles, equilateral, right, obtuse, and acute in different orientations.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_6']),
('PE', 'APEF', 'math', '6', 'PE-6SS5', 'Shape and Space', 'Describe and compare the sides and angles of regular and irregular polygons.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_6']),
('PE', 'APEF', 'math', '6', 'PE-6SS6', 'Shape and Space', 'Perform a combination of translations, rotations, and reflections on a single 2-D shape with and without technology.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_6']),
('PE', 'APEF', 'math', '6', 'PE-6SS7', 'Shape and Space', 'Perform a combination of successive transformations of 2-D shapes to create a design, and identify and describe the transformations.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_6']),
('PE', 'APEF', 'math', '6', 'PE-6SS8', 'Shape and Space', 'Identify and plot points in the first quadrant of a Cartesian plane using whole number ordered pairs.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_6']),
('PE', 'APEF', 'math', '6', 'PE-6SS9', 'Shape and Space', 'Perform and describe single transformations of a 2-D shape in the first quadrant of a Cartesian plane.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_6'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 6 — Statistics and Probability
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '6', 'PE-6SP1', 'Statistics and Probability', 'Create, label, and interpret line graphs to draw conclusions.', ARRAY['math', 'statistics', 'apef', 'grade_6']),
('PE', 'APEF', 'math', '6', 'PE-6SP2', 'Statistics and Probability', 'Select, justify, and use appropriate methods of collecting data including questionnaires, experiments, databases, and electronic media.', ARRAY['math', 'statistics', 'apef', 'grade_6']),
('PE', 'APEF', 'math', '6', 'PE-6SP3', 'Statistics and Probability', 'Graph collected data and analyze the graph to solve problems.', ARRAY['math', 'statistics', 'apef', 'grade_6']),
('PE', 'APEF', 'math', '6', 'PE-6SP4', 'Statistics and Probability', 'Demonstrate an understanding of probability by identifying all possible outcomes of a probability experiment, differentiating between experimental and theoretical probability, and determining the theoretical probability of outcomes.', ARRAY['math', 'statistics', 'probability', 'apef', 'grade_6'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 7 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '7', 'PE-7N1', 'Number', 'Determine and explain why a number is divisible by 2, 3, 4, 5, 6, 8, 9, or 10, and why a number cannot be divided by 0.', ARRAY['math', 'number', 'apef', 'grade_7']),
('PE', 'APEF', 'math', '7', 'PE-7N2', 'Number', 'Demonstrate an understanding of the addition, subtraction, multiplication, and division of decimals to solve problems.', ARRAY['math', 'number', 'apef', 'grade_7']),
('PE', 'APEF', 'math', '7', 'PE-7N3', 'Number', 'Solve problems involving percents from 1% to 100% (limited to whole numbers).', ARRAY['math', 'number', 'apef', 'grade_7']),
('PE', 'APEF', 'math', '7', 'PE-7N4', 'Number', 'Demonstrate an understanding of the relationship between positive repeating decimals, positive terminating decimals, and positive fractions.', ARRAY['math', 'number', 'apef', 'grade_7']),
('PE', 'APEF', 'math', '7', 'PE-7N5', 'Number', 'Demonstrate an understanding of adding and subtracting positive fractions and mixed numbers with like and unlike denominators concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_7']),
('PE', 'APEF', 'math', '7', 'PE-7N6', 'Number', 'Demonstrate an understanding of addition and subtraction of integers concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_7']),
('PE', 'APEF', 'math', '7', 'PE-7N7', 'Number', 'Compare, order, and position positive fractions, positive decimals (to thousandths), and whole numbers by using benchmarks, place value, and equivalent fractions and decimals.', ARRAY['math', 'number', 'apef', 'grade_7'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 7 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '7', 'PE-7PR1', 'Patterns and Relations', 'Demonstrate an understanding of oral and written patterns and their equivalent linear relations.', ARRAY['math', 'patterns', 'apef', 'grade_7']),
('PE', 'APEF', 'math', '7', 'PE-7PR2', 'Patterns and Relations', 'Create a table of values from a linear relation, graph the table of values, and analyze the graph to draw conclusions and solve problems.', ARRAY['math', 'patterns', 'apef', 'grade_7']),
('PE', 'APEF', 'math', '7', 'PE-7PR3', 'Patterns and Relations', 'Demonstrate an understanding of preservation of equality by modelling problems using concrete materials and pictorial representations.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_7']),
('PE', 'APEF', 'math', '7', 'PE-7PR4', 'Patterns and Relations', 'Explain the difference between an expression and an equation.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_7']),
('PE', 'APEF', 'math', '7', 'PE-7PR5', 'Patterns and Relations', 'Evaluate an expression given the value of the variable(s).', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_7']),
('PE', 'APEF', 'math', '7', 'PE-7PR6', 'Patterns and Relations', 'Model and solve problems that can be represented by one-step linear equations of the form x + a = b, concretely, pictorially, and symbolically.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_7']),
('PE', 'APEF', 'math', '7', 'PE-7PR7', 'Patterns and Relations', 'Model and solve problems that can be represented by linear equations of the form ax + b = c, ax = b, or x/a = b, concretely, pictorially, and symbolically.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_7'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 7 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '7', 'PE-7SS1', 'Shape and Space', 'Demonstrate an understanding of circles by describing the relationships among radius, diameter, and circumference and relating circumference to pi.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_7']),
('PE', 'APEF', 'math', '7', 'PE-7SS2', 'Shape and Space', 'Develop and apply a formula for determining the area of triangles, parallelograms, and circles.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_7']),
('PE', 'APEF', 'math', '7', 'PE-7SS3', 'Shape and Space', 'Perform geometric constructions including perpendicular line segments, parallel line segments, perpendicular bisectors, and angle bisectors.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_7']),
('PE', 'APEF', 'math', '7', 'PE-7SS4', 'Shape and Space', 'Identify and plot points in the four quadrants of a Cartesian plane using ordered pairs.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_7']),
('PE', 'APEF', 'math', '7', 'PE-7SS5', 'Shape and Space', 'Perform and describe transformations (translations, rotations, or reflections) of a 2-D shape in all four quadrants of a Cartesian plane.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_7'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 7 — Statistics and Probability
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '7', 'PE-7SP1', 'Statistics and Probability', 'Demonstrate an understanding of central tendency and range by determining the measures of central tendency (mean, median, mode) and range.', ARRAY['math', 'statistics', 'apef', 'grade_7']),
('PE', 'APEF', 'math', '7', 'PE-7SP2', 'Statistics and Probability', 'Determine the effect on the mean, median, and mode when an outlier is included in or removed from a data set.', ARRAY['math', 'statistics', 'apef', 'grade_7']),
('PE', 'APEF', 'math', '7', 'PE-7SP3', 'Statistics and Probability', 'Construct, label, and interpret circle graphs to solve problems.', ARRAY['math', 'statistics', 'apef', 'grade_7']),
('PE', 'APEF', 'math', '7', 'PE-7SP4', 'Statistics and Probability', 'Express probabilities as ratios, fractions, and percents.', ARRAY['math', 'statistics', 'probability', 'apef', 'grade_7']),
('PE', 'APEF', 'math', '7', 'PE-7SP5', 'Statistics and Probability', 'Identify the sample space (list of all possible outcomes) for a probability experiment involving two independent events.', ARRAY['math', 'statistics', 'probability', 'apef', 'grade_7']),
('PE', 'APEF', 'math', '7', 'PE-7SP6', 'Statistics and Probability', 'Conduct a probability experiment to compare the theoretical probability and experimental probability of two independent events.', ARRAY['math', 'statistics', 'probability', 'apef', 'grade_7'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 8 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '8', 'PE-8N1', 'Number', 'Demonstrate an understanding of perfect squares and square roots concretely, pictorially, and symbolically (limited to whole numbers).', ARRAY['math', 'number', 'apef', 'grade_8']),
('PE', 'APEF', 'math', '8', 'PE-8N2', 'Number', 'Determine the approximate square root of numbers that are not perfect squares (limited to whole numbers).', ARRAY['math', 'number', 'apef', 'grade_8']),
('PE', 'APEF', 'math', '8', 'PE-8N3', 'Number', 'Demonstrate an understanding of percents greater than or equal to 0% including problems involving combined percents and percent of a percent.', ARRAY['math', 'number', 'apef', 'grade_8']),
('PE', 'APEF', 'math', '8', 'PE-8N4', 'Number', 'Demonstrate an understanding of ratio and rate.', ARRAY['math', 'number', 'apef', 'grade_8']),
('PE', 'APEF', 'math', '8', 'PE-8N5', 'Number', 'Solve problems that involve rates, ratios, and proportional reasoning.', ARRAY['math', 'number', 'apef', 'grade_8']),
('PE', 'APEF', 'math', '8', 'PE-8N6', 'Number', 'Demonstrate an understanding of multiplying and dividing positive fractions and mixed numbers concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_8']),
('PE', 'APEF', 'math', '8', 'PE-8N7', 'Number', 'Demonstrate an understanding of multiplication and division of integers concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_8'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 8 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '8', 'PE-8PR1', 'Patterns and Relations', 'Graph and analyze two-variable linear relations.', ARRAY['math', 'patterns', 'apef', 'grade_8']),
('PE', 'APEF', 'math', '8', 'PE-8PR2', 'Patterns and Relations', 'Model and solve problems using linear equations of the form ax = b, x/a = b, ax + b = c, x/a + b = c, and a(x + b) = c where a, b, and c are integers.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_8'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 8 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '8', 'PE-8SS1', 'Shape and Space', 'Develop and apply the Pythagorean theorem to solve problems.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_8']),
('PE', 'APEF', 'math', '8', 'PE-8SS2', 'Shape and Space', 'Draw and construct nets for 3-D objects.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_8']),
('PE', 'APEF', 'math', '8', 'PE-8SS3', 'Shape and Space', 'Determine the surface area of right rectangular prisms, right triangular prisms, and right cylinders to solve problems.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_8']),
('PE', 'APEF', 'math', '8', 'PE-8SS4', 'Shape and Space', 'Develop and apply formulas for determining the volume of right rectangular prisms, right triangular prisms, and right cylinders.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_8']),
('PE', 'APEF', 'math', '8', 'PE-8SS5', 'Shape and Space', 'Draw and interpret top, front, and side views of 3-D objects composed of right rectangular prisms.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_8']),
('PE', 'APEF', 'math', '8', 'PE-8SS6', 'Shape and Space', 'Demonstrate an understanding of the congruence of polygons under a transformation.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_8'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 8 — Statistics and Probability
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '8', 'PE-8SP1', 'Statistics and Probability', 'Critique ways in which data is presented in circle graphs, line graphs, bar graphs, and pictographs.', ARRAY['math', 'statistics', 'apef', 'grade_8']),
('PE', 'APEF', 'math', '8', 'PE-8SP2', 'Statistics and Probability', 'Solve problems involving the probability of independent events.', ARRAY['math', 'statistics', 'probability', 'apef', 'grade_8'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 9 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '9', 'PE-9N1', 'Number', 'Demonstrate an understanding of powers with integral bases (excluding base 0) and whole number exponents by representing repeated multiplication using powers, using patterns to show that a power with exponent zero is equal to one, and solving problems involving powers.', ARRAY['math', 'number', 'apef', 'grade_9']),
('PE', 'APEF', 'math', '9', 'PE-9N2', 'Number', 'Demonstrate an understanding of operations on powers with integral bases and whole number exponents.', ARRAY['math', 'number', 'apef', 'grade_9']),
('PE', 'APEF', 'math', '9', 'PE-9N3', 'Number', 'Demonstrate an understanding of rational numbers by comparing and ordering rational numbers and solving problems that involve arithmetic operations on rational numbers.', ARRAY['math', 'number', 'apef', 'grade_9']),
('PE', 'APEF', 'math', '9', 'PE-9N4', 'Number', 'Explain and apply the order of operations, including exponents, with and without technology.', ARRAY['math', 'number', 'apef', 'grade_9']),
('PE', 'APEF', 'math', '9', 'PE-9N5', 'Number', 'Determine the exact square root of positive rational numbers.', ARRAY['math', 'number', 'apef', 'grade_9']),
('PE', 'APEF', 'math', '9', 'PE-9N6', 'Number', 'Determine an approximate square root of positive rational numbers that are not perfect squares.', ARRAY['math', 'number', 'apef', 'grade_9'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 9 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '9', 'PE-9PR1', 'Patterns and Relations', 'Generalize a pattern arising from a problem-solving context using a linear equation and verify by substitution.', ARRAY['math', 'patterns', 'apef', 'grade_9']),
('PE', 'APEF', 'math', '9', 'PE-9PR2', 'Patterns and Relations', 'Graph a linear relation, analyze the graph, and interpolate or extrapolate to solve problems.', ARRAY['math', 'patterns', 'apef', 'grade_9']),
('PE', 'APEF', 'math', '9', 'PE-9PR3', 'Patterns and Relations', 'Model and solve problems using linear equations of the form ax = b, x/a = b (a is not 0), ax + b = c, x/a + b = c (a is not 0), a(x + b) = c, ax + b = cx + d, a(bx + c) = d(ex + f), and a/x = b (x is not 0).', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_9']),
('PE', 'APEF', 'math', '9', 'PE-9PR4', 'Patterns and Relations', 'Explain and illustrate strategies to solve single variable linear inequalities with rational coefficients.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_9']),
('PE', 'APEF', 'math', '9', 'PE-9PR5', 'Patterns and Relations', 'Demonstrate an understanding of polynomials (limited to polynomials of degree less than or equal to 2).', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_9']),
('PE', 'APEF', 'math', '9', 'PE-9PR6', 'Patterns and Relations', 'Model, record, and explain the operations of addition and subtraction of polynomial expressions concretely, pictorially, and symbolically.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_9']),
('PE', 'APEF', 'math', '9', 'PE-9PR7', 'Patterns and Relations', 'Model, record, and explain the operations of multiplication and division of polynomial expressions (limited to polynomials) by monomials concretely, pictorially, and symbolically.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_9'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 9 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '9', 'PE-9SS1', 'Shape and Space', 'Solve problems and justify the solution strategy using circle properties involving inscribed angles, central angles, and tangent lines.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_9']),
('PE', 'APEF', 'math', '9', 'PE-9SS2', 'Shape and Space', 'Determine the surface area of composite 3-D objects to solve problems.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_9']),
('PE', 'APEF', 'math', '9', 'PE-9SS3', 'Shape and Space', 'Demonstrate an understanding of similarity of polygons.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_9']),
('PE', 'APEF', 'math', '9', 'PE-9SS4', 'Shape and Space', 'Draw and interpret scale diagrams of 2-D shapes.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_9']),
('PE', 'APEF', 'math', '9', 'PE-9SS5', 'Shape and Space', 'Demonstrate an understanding of line and rotation symmetry.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_9'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 9 — Statistics and Probability
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('PE', 'APEF', 'math', '9', 'PE-9SP1', 'Statistics and Probability', 'Describe the effect of bias, use of language, ethics, cost, time and timing, privacy, and cultural sensitivity on the collection of data.', ARRAY['math', 'statistics', 'apef', 'grade_9']),
('PE', 'APEF', 'math', '9', 'PE-9SP2', 'Statistics and Probability', 'Select and defend the choice of using either a population or a sample of a population to answer a question.', ARRAY['math', 'statistics', 'apef', 'grade_9']),
('PE', 'APEF', 'math', '9', 'PE-9SP3', 'Statistics and Probability', 'Develop and implement a project plan for the collection, display, and analysis of data by formulating a question, choosing a data collection method, and selecting a population or sample.', ARRAY['math', 'statistics', 'apef', 'grade_9']),
('PE', 'APEF', 'math', '9', 'PE-9SP4', 'Statistics and Probability', 'Demonstrate an understanding of the role of probability in society.', ARRAY['math', 'statistics', 'probability', 'apef', 'grade_9'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- ============================================================================

-- ============================================================================
-- NEWFOUNDLAND AND LABRADOR (NL) — APEF Mathematics K-9
-- Identical outcomes to Nova Scotia under shared APEF framework
-- ============================================================================
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', 'K', 'NL-KN1', 'Number', 'Say the number sequence by 1s from 1 to 20 and from 10 to 1.', ARRAY['math', 'number', 'apef', 'kindergarten']),
('NL', 'APEF', 'math', 'K', 'NL-KN2', 'Number', 'Recognize, at a glance, and name the quantity represented by familiar arrangements of 1 to 5 objects or dots.', ARRAY['math', 'number', 'apef', 'kindergarten']),
('NL', 'APEF', 'math', 'K', 'NL-KN3', 'Number', 'Relate a numeral, 1 to 10, to its respective quantity.', ARRAY['math', 'number', 'apef', 'kindergarten']),
('NL', 'APEF', 'math', 'K', 'NL-KN4', 'Number', 'Represent and partition numbers 2 to 10 in two parts, concretely and pictorially.', ARRAY['math', 'number', 'apef', 'kindergarten']),
('NL', 'APEF', 'math', 'K', 'NL-KN5', 'Number', 'Compare sets containing 1 to 10 objects, using one-to-one correspondence.', ARRAY['math', 'number', 'apef', 'kindergarten']),
('NL', 'APEF', 'math', 'K', 'NL-KN6', 'Number', 'Demonstrate an understanding of counting to 10.', ARRAY['math', 'number', 'apef', 'kindergarten'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Kindergarten — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', 'K', 'NL-KPR1', 'Patterns and Relations', 'Demonstrate an understanding of repeating patterns (two or three elements) by identifying, reproducing, extending, and creating patterns.', ARRAY['math', 'patterns', 'apef', 'kindergarten'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Kindergarten — Shape and Space (Measurement + Geometry)
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', 'K', 'NL-KSS1', 'Shape and Space', 'Use direct comparison to compare two objects based on a single attribute such as length, mass, volume, and capacity.', ARRAY['math', 'shape', 'measurement', 'apef', 'kindergarten']),
('NL', 'APEF', 'math', 'K', 'NL-KSS2', 'Shape and Space', 'Sort 3-D objects using one attribute.', ARRAY['math', 'shape', 'geometry', 'apef', 'kindergarten']),
('NL', 'APEF', 'math', 'K', 'NL-KSS3', 'Shape and Space', 'Build and describe 3-D objects.', ARRAY['math', 'shape', 'geometry', 'apef', 'kindergarten'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 1 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '1', 'NL-1N1', 'Number', 'Say the number sequence by 1s forward and backward between any two given numbers, 0 to 100; by 2s to 20 forward starting at 0; by 5s and 10s to 100 forward starting at 0.', ARRAY['math', 'number', 'apef', 'grade_1']),
('NL', 'APEF', 'math', '1', 'NL-1N2', 'Number', 'Recognize, at a glance, and name the quantity represented by familiar arrangements of 1 to 10 objects or dots.', ARRAY['math', 'number', 'apef', 'grade_1']),
('NL', 'APEF', 'math', '1', 'NL-1N3', 'Number', 'Demonstrate an understanding of counting to 20 by indicating that the last number said identifies how many.', ARRAY['math', 'number', 'apef', 'grade_1']),
('NL', 'APEF', 'math', '1', 'NL-1N4', 'Number', 'Represent and partition numbers to 20.', ARRAY['math', 'number', 'apef', 'grade_1']),
('NL', 'APEF', 'math', '1', 'NL-1N5', 'Number', 'Compare sets containing up to 20 objects to solve problems using referents and one-to-one correspondence.', ARRAY['math', 'number', 'apef', 'grade_1']),
('NL', 'APEF', 'math', '1', 'NL-1N6', 'Number', 'Estimate quantities to 20 by using referents.', ARRAY['math', 'number', 'apef', 'grade_1']),
('NL', 'APEF', 'math', '1', 'NL-1N7', 'Number', 'Demonstrate an understanding of conservation of number for up to 20 objects.', ARRAY['math', 'number', 'apef', 'grade_1']),
('NL', 'APEF', 'math', '1', 'NL-1N8', 'Number', 'Identify the number, up to 20, that is one more, two more, one less, and two less than a given number.', ARRAY['math', 'number', 'apef', 'grade_1']),
('NL', 'APEF', 'math', '1', 'NL-1N9', 'Number', 'Demonstrate an understanding of addition of two one-digit numbers and the corresponding subtraction, concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_1']),
('NL', 'APEF', 'math', '1', 'NL-1N10', 'Number', 'Use and describe strategies to determine sums and differences using manipulatives and visual aids.', ARRAY['math', 'number', 'apef', 'grade_1'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 1 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '1', 'NL-1PR1', 'Patterns and Relations', 'Demonstrate an understanding of repeating patterns (two to four elements) by identifying, describing, reproducing, extending, and creating patterns using manipulatives, diagrams, and symbols.', ARRAY['math', 'patterns', 'apef', 'grade_1']),
('NL', 'APEF', 'math', '1', 'NL-1PR2', 'Patterns and Relations', 'Translate repeating patterns from one representation to another.', ARRAY['math', 'patterns', 'apef', 'grade_1']),
('NL', 'APEF', 'math', '1', 'NL-1PR3', 'Patterns and Relations', 'Describe equality as a balance and inequality as an imbalance, concretely and pictorially (0 to 20).', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_1']),
('NL', 'APEF', 'math', '1', 'NL-1PR4', 'Patterns and Relations', 'Record equalities using the equal symbol.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_1'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 1 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '1', 'NL-1SS1', 'Shape and Space', 'Demonstrate an understanding of measurement as a process of comparing by identifying attributes that can be compared and ordering objects.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_1']),
('NL', 'APEF', 'math', '1', 'NL-1SS2', 'Shape and Space', 'Sort 3-D objects and 2-D shapes using one attribute and explain the sorting rule.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_1']),
('NL', 'APEF', 'math', '1', 'NL-1SS3', 'Shape and Space', 'Replicate composite 2-D shapes and 3-D objects.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_1']),
('NL', 'APEF', 'math', '1', 'NL-1SS4', 'Shape and Space', 'Identify 2-D shapes in 3-D objects.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_1'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 2 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '2', 'NL-2N1', 'Number', 'Say the number sequence by 1s forward and backward starting from any point to 200; by 2s forward and backward to 100; by 5s and 10s forward and backward to 100; by 10s using starting points that are multiples of 10 to 100.', ARRAY['math', 'number', 'apef', 'grade_2']),
('NL', 'APEF', 'math', '2', 'NL-2N2', 'Number', 'Demonstrate whether a number up to 100 is even or odd.', ARRAY['math', 'number', 'apef', 'grade_2']),
('NL', 'APEF', 'math', '2', 'NL-2N3', 'Number', 'Describe order or relative position using ordinal numbers up to tenth.', ARRAY['math', 'number', 'apef', 'grade_2']),
('NL', 'APEF', 'math', '2', 'NL-2N4', 'Number', 'Represent and partition numbers to 100.', ARRAY['math', 'number', 'apef', 'grade_2']),
('NL', 'APEF', 'math', '2', 'NL-2N5', 'Number', 'Compare and order numbers up to 100.', ARRAY['math', 'number', 'apef', 'grade_2']),
('NL', 'APEF', 'math', '2', 'NL-2N6', 'Number', 'Estimate quantities to 100 by using referents.', ARRAY['math', 'number', 'apef', 'grade_2']),
('NL', 'APEF', 'math', '2', 'NL-2N7', 'Number', 'Illustrate, concretely and pictorially, the meaning of place value for numerals to 100.', ARRAY['math', 'number', 'apef', 'grade_2']),
('NL', 'APEF', 'math', '2', 'NL-2N8', 'Number', 'Demonstrate and explain the effect of adding zero to or subtracting zero from any number.', ARRAY['math', 'number', 'apef', 'grade_2']),
('NL', 'APEF', 'math', '2', 'NL-2N9', 'Number', 'Demonstrate an understanding of addition and subtraction of numbers with answers to 100.', ARRAY['math', 'number', 'apef', 'grade_2']),
('NL', 'APEF', 'math', '2', 'NL-2N10', 'Number', 'Apply mental mathematics strategies to quickly recall basic addition facts to 18 and related subtraction facts.', ARRAY['math', 'number', 'apef', 'grade_2'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 2 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '2', 'NL-2PR1', 'Patterns and Relations', 'Demonstrate an understanding of repeating patterns (three to five elements) by describing, extending, comparing, and creating patterns.', ARRAY['math', 'patterns', 'apef', 'grade_2']),
('NL', 'APEF', 'math', '2', 'NL-2PR2', 'Patterns and Relations', 'Demonstrate an understanding of increasing patterns by describing, reproducing, extending, and creating patterns using manipulatives, diagrams, sounds, and actions.', ARRAY['math', 'patterns', 'apef', 'grade_2']),
('NL', 'APEF', 'math', '2', 'NL-2PR3', 'Patterns and Relations', 'Demonstrate and explain the meaning of equality and inequality concretely and pictorially (0 to 100).', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_2']),
('NL', 'APEF', 'math', '2', 'NL-2PR4', 'Patterns and Relations', 'Record equalities and inequalities symbolically using the equal and not-equal symbols.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_2'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 2 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '2', 'NL-2SS1', 'Shape and Space', 'Demonstrate an understanding of the calendar and relationships among days, weeks, months, and years.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_2']),
('NL', 'APEF', 'math', '2', 'NL-2SS2', 'Shape and Space', 'Relate the size of a unit of measure to the number of units needed to measure length and mass.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_2']),
('NL', 'APEF', 'math', '2', 'NL-2SS3', 'Shape and Space', 'Compare and order objects by length, height, distance around, and mass using non-standard units.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_2']),
('NL', 'APEF', 'math', '2', 'NL-2SS4', 'Shape and Space', 'Measure length to the nearest non-standard unit.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_2']),
('NL', 'APEF', 'math', '2', 'NL-2SS5', 'Shape and Space', 'Demonstrate that changing the position of an object does not alter its measurement attributes.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_2']),
('NL', 'APEF', 'math', '2', 'NL-2SS6', 'Shape and Space', 'Sort 2-D shapes and 3-D objects using two attributes and explain the sorting rule.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_2']),
('NL', 'APEF', 'math', '2', 'NL-2SS7', 'Shape and Space', 'Recognize, name, describe, compare, and build 3-D objects including cubes, spheres, cones, cylinders, and pyramids.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_2']),
('NL', 'APEF', 'math', '2', 'NL-2SS8', 'Shape and Space', 'Recognize, name, describe, compare, and build 2-D shapes including triangles, squares, rectangles, and circles.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_2']),
('NL', 'APEF', 'math', '2', 'NL-2SS9', 'Shape and Space', 'Identify 2-D shapes as parts of 3-D objects in the environment.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_2'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 2 — Statistics and Probability
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '2', 'NL-2SP1', 'Statistics and Probability', 'Gather and record data about self and others to answer questions.', ARRAY['math', 'statistics', 'apef', 'grade_2']),
('NL', 'APEF', 'math', '2', 'NL-2SP2', 'Statistics and Probability', 'Construct and interpret concrete graphs and pictographs to solve problems.', ARRAY['math', 'statistics', 'apef', 'grade_2'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 3 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '3', 'NL-3N1', 'Number', 'Say the number sequence forward and backward by 1s through transitions to 1000; by 2s, 5s, 10s, or 100s to 1000 forward and backward using starting points that are multiples of those numbers.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NL', 'APEF', 'math', '3', 'NL-3N2', 'Number', 'Represent and partition numbers to 1000.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NL', 'APEF', 'math', '3', 'NL-3N3', 'Number', 'Compare and order numbers to 1000.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NL', 'APEF', 'math', '3', 'NL-3N4', 'Number', 'Estimate quantities less than 1000 using referents.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NL', 'APEF', 'math', '3', 'NL-3N5', 'Number', 'Illustrate, concretely and pictorially, the meaning of place value for numerals to 1000.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NL', 'APEF', 'math', '3', 'NL-3N6', 'Number', 'Describe and apply mental mathematics strategies for adding two 2-digit numerals.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NL', 'APEF', 'math', '3', 'NL-3N7', 'Number', 'Describe and apply mental mathematics strategies for subtracting two 2-digit numerals.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NL', 'APEF', 'math', '3', 'NL-3N8', 'Number', 'Apply estimation strategies to predict sums and differences of two 2-digit numerals in a problem-solving context.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NL', 'APEF', 'math', '3', 'NL-3N9', 'Number', 'Demonstrate an understanding of addition and subtraction of numbers with answers to 1000.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NL', 'APEF', 'math', '3', 'NL-3N10', 'Number', 'Apply mental mathematics strategies and number properties to recall basic addition facts to 18 and related subtraction facts.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NL', 'APEF', 'math', '3', 'NL-3N11', 'Number', 'Demonstrate an understanding of multiplication to 5 x 5 by representing and explaining using equal grouping and arrays.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NL', 'APEF', 'math', '3', 'NL-3N12', 'Number', 'Demonstrate an understanding of division by representing and explaining using equal sharing and equal grouping.', ARRAY['math', 'number', 'apef', 'grade_3']),
('NL', 'APEF', 'math', '3', 'NL-3N13', 'Number', 'Demonstrate an understanding of fractions by explaining that a fraction represents a part of a whole, comparing fractions with like denominators, and using concrete and pictorial representations.', ARRAY['math', 'number', 'apef', 'grade_3'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 3 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '3', 'NL-3PR1', 'Patterns and Relations', 'Demonstrate an understanding of increasing patterns by describing, extending, comparing, and creating numerical and non-numerical patterns.', ARRAY['math', 'patterns', 'apef', 'grade_3']),
('NL', 'APEF', 'math', '3', 'NL-3PR2', 'Patterns and Relations', 'Demonstrate an understanding of decreasing patterns by describing, extending, comparing, and creating numerical and non-numerical patterns.', ARRAY['math', 'patterns', 'apef', 'grade_3']),
('NL', 'APEF', 'math', '3', 'NL-3PR3', 'Patterns and Relations', 'Solve one-step addition and subtraction equations involving a symbol representing an unknown number.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_3'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 3 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '3', 'NL-3SS1', 'Shape and Space', 'Relate the passage of time to common activities using non-standard and standard units (minutes, hours, days, weeks, months, years).', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_3']),
('NL', 'APEF', 'math', '3', 'NL-3SS2', 'Shape and Space', 'Relate the number of seconds to a minute, the number of minutes to an hour, and the number of days to a month in a problem-solving context.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_3']),
('NL', 'APEF', 'math', '3', 'NL-3SS3', 'Shape and Space', 'Demonstrate an understanding of measuring length in centimetres and metres.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_3']),
('NL', 'APEF', 'math', '3', 'NL-3SS4', 'Shape and Space', 'Demonstrate an understanding of measuring mass in grams and kilograms.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_3']),
('NL', 'APEF', 'math', '3', 'NL-3SS5', 'Shape and Space', 'Demonstrate an understanding of perimeter of regular and irregular shapes.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_3']),
('NL', 'APEF', 'math', '3', 'NL-3SS6', 'Shape and Space', 'Describe 3-D objects according to the shape of the faces and the number of edges and vertices.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_3']),
('NL', 'APEF', 'math', '3', 'NL-3SS7', 'Shape and Space', 'Name, describe, compare, create, and sort regular and irregular polygons including triangles, quadrilaterals, pentagons, hexagons, and octagons.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_3'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 3 — Statistics and Probability
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '3', 'NL-3SP1', 'Statistics and Probability', 'Collect first-hand data and organize it using tally marks, line plots, charts, and lists to answer questions.', ARRAY['math', 'statistics', 'apef', 'grade_3']),
('NL', 'APEF', 'math', '3', 'NL-3SP2', 'Statistics and Probability', 'Construct, label, and interpret bar graphs to solve problems.', ARRAY['math', 'statistics', 'apef', 'grade_3'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 4 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '4', 'NL-4N1', 'Number', 'Represent and partition whole numbers to 10 000.', ARRAY['math', 'number', 'apef', 'grade_4']),
('NL', 'APEF', 'math', '4', 'NL-4N2', 'Number', 'Compare and order numbers to 10 000.', ARRAY['math', 'number', 'apef', 'grade_4']),
('NL', 'APEF', 'math', '4', 'NL-4N3', 'Number', 'Demonstrate an understanding of addition and subtraction of numbers with answers to 10 000.', ARRAY['math', 'number', 'apef', 'grade_4']),
('NL', 'APEF', 'math', '4', 'NL-4N4', 'Number', 'Apply and explain the properties of 0 and 1 for multiplication and the property of 1 for division.', ARRAY['math', 'number', 'apef', 'grade_4']),
('NL', 'APEF', 'math', '4', 'NL-4N5', 'Number', 'Describe and apply mental mathematics strategies to recall basic multiplication facts to 9 x 9 and to determine related division facts.', ARRAY['math', 'number', 'apef', 'grade_4']),
('NL', 'APEF', 'math', '4', 'NL-4N6', 'Number', 'Demonstrate an understanding of multiplication of two- or three-digit numbers by one-digit numbers using personal strategies and concrete materials.', ARRAY['math', 'number', 'apef', 'grade_4']),
('NL', 'APEF', 'math', '4', 'NL-4N7', 'Number', 'Demonstrate an understanding of division with one-digit divisors and up to two-digit dividends to solve problems using personal strategies.', ARRAY['math', 'number', 'apef', 'grade_4']),
('NL', 'APEF', 'math', '4', 'NL-4N8', 'Number', 'Demonstrate an understanding of fractions less than or equal to 1 by using concrete, pictorial, and symbolic representations to name and record fractions, compare and order fractions, and model and explain that for different wholes, two identical fractions may not represent the same quantity.', ARRAY['math', 'number', 'apef', 'grade_4']),
('NL', 'APEF', 'math', '4', 'NL-4N9', 'Number', 'Describe and represent decimals (tenths and hundredths) concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_4']),
('NL', 'APEF', 'math', '4', 'NL-4N10', 'Number', 'Relate decimals to fractions and fractions to decimals to hundredths.', ARRAY['math', 'number', 'apef', 'grade_4']),
('NL', 'APEF', 'math', '4', 'NL-4N11', 'Number', 'Demonstrate an understanding of addition and subtraction of decimals limited to hundredths.', ARRAY['math', 'number', 'apef', 'grade_4'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 4 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '4', 'NL-4PR1', 'Patterns and Relations', 'Identify and describe patterns found in tables and charts, including a multiplication chart.', ARRAY['math', 'patterns', 'apef', 'grade_4']),
('NL', 'APEF', 'math', '4', 'NL-4PR2', 'Patterns and Relations', 'Translate among different representations of a pattern such as a table, a chart, or concrete materials.', ARRAY['math', 'patterns', 'apef', 'grade_4']),
('NL', 'APEF', 'math', '4', 'NL-4PR3', 'Patterns and Relations', 'Represent, describe, and extend patterns and relationships using charts and tables to solve problems.', ARRAY['math', 'patterns', 'apef', 'grade_4']),
('NL', 'APEF', 'math', '4', 'NL-4PR4', 'Patterns and Relations', 'Identify and explain mathematical relationships using charts and diagrams to solve problems.', ARRAY['math', 'patterns', 'apef', 'grade_4']),
('NL', 'APEF', 'math', '4', 'NL-4PR5', 'Patterns and Relations', 'Express a given problem as an equation in which a symbol is used to represent an unknown number.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_4']),
('NL', 'APEF', 'math', '4', 'NL-4PR6', 'Patterns and Relations', 'Solve one-step equations involving a symbol to represent an unknown number.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_4'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 4 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '4', 'NL-4SS1', 'Shape and Space', 'Read and record time using digital and analog clocks, including 24-hour clocks.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_4']),
('NL', 'APEF', 'math', '4', 'NL-4SS2', 'Shape and Space', 'Read and record calendar dates in a variety of formats.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_4']),
('NL', 'APEF', 'math', '4', 'NL-4SS3', 'Shape and Space', 'Demonstrate an understanding of area of regular and irregular 2-D shapes by recognizing that area is measured in square units.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_4']),
('NL', 'APEF', 'math', '4', 'NL-4SS4', 'Shape and Space', 'Describe and construct rectangular and triangular prisms.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_4']),
('NL', 'APEF', 'math', '4', 'NL-4SS5', 'Shape and Space', 'Demonstrate an understanding of congruency concretely and pictorially.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_4']),
('NL', 'APEF', 'math', '4', 'NL-4SS6', 'Shape and Space', 'Demonstrate an understanding of line symmetry by identifying symmetrical 2-D shapes and creating symmetrical 2-D shapes.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_4'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 4 — Statistics and Probability
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '4', 'NL-4SP1', 'Statistics and Probability', 'Demonstrate an understanding of many-to-one correspondence.', ARRAY['math', 'statistics', 'apef', 'grade_4']),
('NL', 'APEF', 'math', '4', 'NL-4SP2', 'Statistics and Probability', 'Construct and interpret pictographs and bar graphs involving many-to-one correspondence to draw conclusions.', ARRAY['math', 'statistics', 'apef', 'grade_4'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 5 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '5', 'NL-5N1', 'Number', 'Represent and partition whole numbers to 1 000 000.', ARRAY['math', 'number', 'apef', 'grade_5']),
('NL', 'APEF', 'math', '5', 'NL-5N2', 'Number', 'Use estimation strategies including front-end rounding, front-end adjusted rounding, and compatible numbers in problem-solving contexts.', ARRAY['math', 'number', 'apef', 'grade_5']),
('NL', 'APEF', 'math', '5', 'NL-5N3', 'Number', 'Apply mental mathematics strategies and number properties to recall multiplication facts to 81 and related division facts.', ARRAY['math', 'number', 'apef', 'grade_5']),
('NL', 'APEF', 'math', '5', 'NL-5N4', 'Number', 'Apply mental mathematics strategies for multiplication such as annexing then adding zeros, halving and doubling, and using the distributive property.', ARRAY['math', 'number', 'apef', 'grade_5']),
('NL', 'APEF', 'math', '5', 'NL-5N5', 'Number', 'Demonstrate an understanding of multiplication (two-digit by two-digit) to solve problems.', ARRAY['math', 'number', 'apef', 'grade_5']),
('NL', 'APEF', 'math', '5', 'NL-5N6', 'Number', 'Demonstrate an understanding of division (three-digit by one-digit) and interpret remainders to solve problems.', ARRAY['math', 'number', 'apef', 'grade_5']),
('NL', 'APEF', 'math', '5', 'NL-5N7', 'Number', 'Demonstrate an understanding of fractions by using concrete, pictorial, and symbolic representations to create sets of equivalent fractions and compare fractions with like and unlike denominators.', ARRAY['math', 'number', 'apef', 'grade_5']),
('NL', 'APEF', 'math', '5', 'NL-5N8', 'Number', 'Describe and represent decimals (tenths, hundredths, and thousandths) concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_5']),
('NL', 'APEF', 'math', '5', 'NL-5N9', 'Number', 'Relate decimals to fractions and fractions to decimals to thousandths.', ARRAY['math', 'number', 'apef', 'grade_5']),
('NL', 'APEF', 'math', '5', 'NL-5N10', 'Number', 'Compare and order decimals to thousandths by using benchmarks, place value, and equivalent decimals.', ARRAY['math', 'number', 'apef', 'grade_5']),
('NL', 'APEF', 'math', '5', 'NL-5N11', 'Number', 'Demonstrate an understanding of addition and subtraction of decimals limited to thousandths.', ARRAY['math', 'number', 'apef', 'grade_5'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 5 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '5', 'NL-5PR1', 'Patterns and Relations', 'Determine the pattern rule to make predictions about subsequent terms for increasing and decreasing patterns.', ARRAY['math', 'patterns', 'apef', 'grade_5']),
('NL', 'APEF', 'math', '5', 'NL-5PR2', 'Patterns and Relations', 'Solve problems involving single-variable, one-step equations with whole number coefficients and whole number solutions.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_5'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 5 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '5', 'NL-5SS1', 'Shape and Space', 'Design and construct different rectangles given either a perimeter or an area, or both, and draw conclusions.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_5']),
('NL', 'APEF', 'math', '5', 'NL-5SS2', 'Shape and Space', 'Demonstrate an understanding of measuring length in millimetres and relate millimetres, centimetres, and metres.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_5']),
('NL', 'APEF', 'math', '5', 'NL-5SS3', 'Shape and Space', 'Demonstrate an understanding of volume by selecting and justifying referents, estimating, and measuring using cm cubes and m cubes.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_5']),
('NL', 'APEF', 'math', '5', 'NL-5SS4', 'Shape and Space', 'Demonstrate an understanding of capacity by describing the relationship between mL and L.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_5']),
('NL', 'APEF', 'math', '5', 'NL-5SS5', 'Shape and Space', 'Describe and provide examples of edges and faces of 3-D objects, and sides of 2-D shapes that are parallel, intersecting, perpendicular, vertical, or horizontal.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_5']),
('NL', 'APEF', 'math', '5', 'NL-5SS6', 'Shape and Space', 'Identify and sort quadrilaterals including rectangles, squares, trapezoids, parallelograms, and rhombuses according to their attributes.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_5']),
('NL', 'APEF', 'math', '5', 'NL-5SS7', 'Shape and Space', 'Perform a single transformation (translation, rotation, or reflection) of a 2-D shape and draw and describe the image.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_5']),
('NL', 'APEF', 'math', '5', 'NL-5SS8', 'Shape and Space', 'Identify and describe a single transformation including a translation, rotation, or reflection of 2-D shapes.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_5']),
('NL', 'APEF', 'math', '5', 'NL-5SS9', 'Shape and Space', 'Identify right angles in the environment.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_5'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 5 — Statistics and Probability
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '5', 'NL-5SP1', 'Statistics and Probability', 'Differentiate between first-hand and second-hand data.', ARRAY['math', 'statistics', 'apef', 'grade_5']),
('NL', 'APEF', 'math', '5', 'NL-5SP2', 'Statistics and Probability', 'Construct and interpret double bar graphs to draw conclusions.', ARRAY['math', 'statistics', 'apef', 'grade_5']),
('NL', 'APEF', 'math', '5', 'NL-5SP3', 'Statistics and Probability', 'Describe the likelihood of a single outcome occurring using words such as impossible, unlikely, equally likely, likely, and certain.', ARRAY['math', 'statistics', 'probability', 'apef', 'grade_5']),
('NL', 'APEF', 'math', '5', 'NL-5SP4', 'Statistics and Probability', 'Compare the likelihood of two possible outcomes occurring using words such as less likely, equally likely, and more likely.', ARRAY['math', 'statistics', 'probability', 'apef', 'grade_5'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 6 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '6', 'NL-6N1', 'Number', 'Demonstrate an understanding of place value for numbers greater than one million and less than one-thousandth.', ARRAY['math', 'number', 'apef', 'grade_6']),
('NL', 'APEF', 'math', '6', 'NL-6N2', 'Number', 'Solve problems involving whole numbers and decimal numbers using a variety of strategies.', ARRAY['math', 'number', 'apef', 'grade_6']),
('NL', 'APEF', 'math', '6', 'NL-6N3', 'Number', 'Demonstrate an understanding of factors and multiples by determining multiples and factors of numbers less than 100, identifying prime and composite numbers, and solving problems.', ARRAY['math', 'number', 'apef', 'grade_6']),
('NL', 'APEF', 'math', '6', 'NL-6N4', 'Number', 'Relate improper fractions to mixed numbers and mixed numbers to improper fractions.', ARRAY['math', 'number', 'apef', 'grade_6']),
('NL', 'APEF', 'math', '6', 'NL-6N5', 'Number', 'Demonstrate an understanding of ratio concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_6']),
('NL', 'APEF', 'math', '6', 'NL-6N6', 'Number', 'Demonstrate an understanding of percent (limited to whole numbers) concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_6']),
('NL', 'APEF', 'math', '6', 'NL-6N7', 'Number', 'Demonstrate an understanding of integers contextually, concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_6']),
('NL', 'APEF', 'math', '6', 'NL-6N8', 'Number', 'Demonstrate an understanding of multiplication and division of decimals involving one-digit whole number multipliers, one-digit natural number divisors, and multipliers and divisors that are multiples of 10.', ARRAY['math', 'number', 'apef', 'grade_6']),
('NL', 'APEF', 'math', '6', 'NL-6N9', 'Number', 'Explain and apply the order of operations, excluding exponents, with and without technology.', ARRAY['math', 'number', 'apef', 'grade_6'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 6 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '6', 'NL-6PR1', 'Patterns and Relations', 'Demonstrate an understanding of the relationships within tables of values to solve problems.', ARRAY['math', 'patterns', 'apef', 'grade_6']),
('NL', 'APEF', 'math', '6', 'NL-6PR2', 'Patterns and Relations', 'Represent and describe patterns and relationships using graphs and tables.', ARRAY['math', 'patterns', 'apef', 'grade_6']),
('NL', 'APEF', 'math', '6', 'NL-6PR3', 'Patterns and Relations', 'Represent generalizations arising from number relationships using equations with letter variables.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_6']),
('NL', 'APEF', 'math', '6', 'NL-6PR4', 'Patterns and Relations', 'Demonstrate an understanding of preservation of equality concretely, pictorially, and symbolically.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_6'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 6 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '6', 'NL-6SS1', 'Shape and Space', 'Demonstrate an understanding of angles by identifying, classifying, grouping, estimating, measuring, drawing, and labelling angles.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_6']),
('NL', 'APEF', 'math', '6', 'NL-6SS2', 'Shape and Space', 'Demonstrate that the sum of interior angles is 180 degrees in a triangle and 360 degrees in a quadrilateral.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_6']),
('NL', 'APEF', 'math', '6', 'NL-6SS3', 'Shape and Space', 'Develop and apply a formula for determining the perimeter of polygons, area of rectangles, and volume of right rectangular prisms.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_6']),
('NL', 'APEF', 'math', '6', 'NL-6SS4', 'Shape and Space', 'Construct and compare triangles including scalene, isosceles, equilateral, right, obtuse, and acute in different orientations.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_6']),
('NL', 'APEF', 'math', '6', 'NL-6SS5', 'Shape and Space', 'Describe and compare the sides and angles of regular and irregular polygons.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_6']),
('NL', 'APEF', 'math', '6', 'NL-6SS6', 'Shape and Space', 'Perform a combination of translations, rotations, and reflections on a single 2-D shape with and without technology.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_6']),
('NL', 'APEF', 'math', '6', 'NL-6SS7', 'Shape and Space', 'Perform a combination of successive transformations of 2-D shapes to create a design, and identify and describe the transformations.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_6']),
('NL', 'APEF', 'math', '6', 'NL-6SS8', 'Shape and Space', 'Identify and plot points in the first quadrant of a Cartesian plane using whole number ordered pairs.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_6']),
('NL', 'APEF', 'math', '6', 'NL-6SS9', 'Shape and Space', 'Perform and describe single transformations of a 2-D shape in the first quadrant of a Cartesian plane.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_6'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 6 — Statistics and Probability
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '6', 'NL-6SP1', 'Statistics and Probability', 'Create, label, and interpret line graphs to draw conclusions.', ARRAY['math', 'statistics', 'apef', 'grade_6']),
('NL', 'APEF', 'math', '6', 'NL-6SP2', 'Statistics and Probability', 'Select, justify, and use appropriate methods of collecting data including questionnaires, experiments, databases, and electronic media.', ARRAY['math', 'statistics', 'apef', 'grade_6']),
('NL', 'APEF', 'math', '6', 'NL-6SP3', 'Statistics and Probability', 'Graph collected data and analyze the graph to solve problems.', ARRAY['math', 'statistics', 'apef', 'grade_6']),
('NL', 'APEF', 'math', '6', 'NL-6SP4', 'Statistics and Probability', 'Demonstrate an understanding of probability by identifying all possible outcomes of a probability experiment, differentiating between experimental and theoretical probability, and determining the theoretical probability of outcomes.', ARRAY['math', 'statistics', 'probability', 'apef', 'grade_6'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 7 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '7', 'NL-7N1', 'Number', 'Determine and explain why a number is divisible by 2, 3, 4, 5, 6, 8, 9, or 10, and why a number cannot be divided by 0.', ARRAY['math', 'number', 'apef', 'grade_7']),
('NL', 'APEF', 'math', '7', 'NL-7N2', 'Number', 'Demonstrate an understanding of the addition, subtraction, multiplication, and division of decimals to solve problems.', ARRAY['math', 'number', 'apef', 'grade_7']),
('NL', 'APEF', 'math', '7', 'NL-7N3', 'Number', 'Solve problems involving percents from 1% to 100% (limited to whole numbers).', ARRAY['math', 'number', 'apef', 'grade_7']),
('NL', 'APEF', 'math', '7', 'NL-7N4', 'Number', 'Demonstrate an understanding of the relationship between positive repeating decimals, positive terminating decimals, and positive fractions.', ARRAY['math', 'number', 'apef', 'grade_7']),
('NL', 'APEF', 'math', '7', 'NL-7N5', 'Number', 'Demonstrate an understanding of adding and subtracting positive fractions and mixed numbers with like and unlike denominators concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_7']),
('NL', 'APEF', 'math', '7', 'NL-7N6', 'Number', 'Demonstrate an understanding of addition and subtraction of integers concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_7']),
('NL', 'APEF', 'math', '7', 'NL-7N7', 'Number', 'Compare, order, and position positive fractions, positive decimals (to thousandths), and whole numbers by using benchmarks, place value, and equivalent fractions and decimals.', ARRAY['math', 'number', 'apef', 'grade_7'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 7 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '7', 'NL-7PR1', 'Patterns and Relations', 'Demonstrate an understanding of oral and written patterns and their equivalent linear relations.', ARRAY['math', 'patterns', 'apef', 'grade_7']),
('NL', 'APEF', 'math', '7', 'NL-7PR2', 'Patterns and Relations', 'Create a table of values from a linear relation, graph the table of values, and analyze the graph to draw conclusions and solve problems.', ARRAY['math', 'patterns', 'apef', 'grade_7']),
('NL', 'APEF', 'math', '7', 'NL-7PR3', 'Patterns and Relations', 'Demonstrate an understanding of preservation of equality by modelling problems using concrete materials and pictorial representations.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_7']),
('NL', 'APEF', 'math', '7', 'NL-7PR4', 'Patterns and Relations', 'Explain the difference between an expression and an equation.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_7']),
('NL', 'APEF', 'math', '7', 'NL-7PR5', 'Patterns and Relations', 'Evaluate an expression given the value of the variable(s).', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_7']),
('NL', 'APEF', 'math', '7', 'NL-7PR6', 'Patterns and Relations', 'Model and solve problems that can be represented by one-step linear equations of the form x + a = b, concretely, pictorially, and symbolically.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_7']),
('NL', 'APEF', 'math', '7', 'NL-7PR7', 'Patterns and Relations', 'Model and solve problems that can be represented by linear equations of the form ax + b = c, ax = b, or x/a = b, concretely, pictorially, and symbolically.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_7'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 7 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '7', 'NL-7SS1', 'Shape and Space', 'Demonstrate an understanding of circles by describing the relationships among radius, diameter, and circumference and relating circumference to pi.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_7']),
('NL', 'APEF', 'math', '7', 'NL-7SS2', 'Shape and Space', 'Develop and apply a formula for determining the area of triangles, parallelograms, and circles.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_7']),
('NL', 'APEF', 'math', '7', 'NL-7SS3', 'Shape and Space', 'Perform geometric constructions including perpendicular line segments, parallel line segments, perpendicular bisectors, and angle bisectors.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_7']),
('NL', 'APEF', 'math', '7', 'NL-7SS4', 'Shape and Space', 'Identify and plot points in the four quadrants of a Cartesian plane using ordered pairs.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_7']),
('NL', 'APEF', 'math', '7', 'NL-7SS5', 'Shape and Space', 'Perform and describe transformations (translations, rotations, or reflections) of a 2-D shape in all four quadrants of a Cartesian plane.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_7'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 7 — Statistics and Probability
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '7', 'NL-7SP1', 'Statistics and Probability', 'Demonstrate an understanding of central tendency and range by determining the measures of central tendency (mean, median, mode) and range.', ARRAY['math', 'statistics', 'apef', 'grade_7']),
('NL', 'APEF', 'math', '7', 'NL-7SP2', 'Statistics and Probability', 'Determine the effect on the mean, median, and mode when an outlier is included in or removed from a data set.', ARRAY['math', 'statistics', 'apef', 'grade_7']),
('NL', 'APEF', 'math', '7', 'NL-7SP3', 'Statistics and Probability', 'Construct, label, and interpret circle graphs to solve problems.', ARRAY['math', 'statistics', 'apef', 'grade_7']),
('NL', 'APEF', 'math', '7', 'NL-7SP4', 'Statistics and Probability', 'Express probabilities as ratios, fractions, and percents.', ARRAY['math', 'statistics', 'probability', 'apef', 'grade_7']),
('NL', 'APEF', 'math', '7', 'NL-7SP5', 'Statistics and Probability', 'Identify the sample space (list of all possible outcomes) for a probability experiment involving two independent events.', ARRAY['math', 'statistics', 'probability', 'apef', 'grade_7']),
('NL', 'APEF', 'math', '7', 'NL-7SP6', 'Statistics and Probability', 'Conduct a probability experiment to compare the theoretical probability and experimental probability of two independent events.', ARRAY['math', 'statistics', 'probability', 'apef', 'grade_7'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 8 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '8', 'NL-8N1', 'Number', 'Demonstrate an understanding of perfect squares and square roots concretely, pictorially, and symbolically (limited to whole numbers).', ARRAY['math', 'number', 'apef', 'grade_8']),
('NL', 'APEF', 'math', '8', 'NL-8N2', 'Number', 'Determine the approximate square root of numbers that are not perfect squares (limited to whole numbers).', ARRAY['math', 'number', 'apef', 'grade_8']),
('NL', 'APEF', 'math', '8', 'NL-8N3', 'Number', 'Demonstrate an understanding of percents greater than or equal to 0% including problems involving combined percents and percent of a percent.', ARRAY['math', 'number', 'apef', 'grade_8']),
('NL', 'APEF', 'math', '8', 'NL-8N4', 'Number', 'Demonstrate an understanding of ratio and rate.', ARRAY['math', 'number', 'apef', 'grade_8']),
('NL', 'APEF', 'math', '8', 'NL-8N5', 'Number', 'Solve problems that involve rates, ratios, and proportional reasoning.', ARRAY['math', 'number', 'apef', 'grade_8']),
('NL', 'APEF', 'math', '8', 'NL-8N6', 'Number', 'Demonstrate an understanding of multiplying and dividing positive fractions and mixed numbers concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_8']),
('NL', 'APEF', 'math', '8', 'NL-8N7', 'Number', 'Demonstrate an understanding of multiplication and division of integers concretely, pictorially, and symbolically.', ARRAY['math', 'number', 'apef', 'grade_8'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 8 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '8', 'NL-8PR1', 'Patterns and Relations', 'Graph and analyze two-variable linear relations.', ARRAY['math', 'patterns', 'apef', 'grade_8']),
('NL', 'APEF', 'math', '8', 'NL-8PR2', 'Patterns and Relations', 'Model and solve problems using linear equations of the form ax = b, x/a = b, ax + b = c, x/a + b = c, and a(x + b) = c where a, b, and c are integers.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_8'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 8 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '8', 'NL-8SS1', 'Shape and Space', 'Develop and apply the Pythagorean theorem to solve problems.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_8']),
('NL', 'APEF', 'math', '8', 'NL-8SS2', 'Shape and Space', 'Draw and construct nets for 3-D objects.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_8']),
('NL', 'APEF', 'math', '8', 'NL-8SS3', 'Shape and Space', 'Determine the surface area of right rectangular prisms, right triangular prisms, and right cylinders to solve problems.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_8']),
('NL', 'APEF', 'math', '8', 'NL-8SS4', 'Shape and Space', 'Develop and apply formulas for determining the volume of right rectangular prisms, right triangular prisms, and right cylinders.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_8']),
('NL', 'APEF', 'math', '8', 'NL-8SS5', 'Shape and Space', 'Draw and interpret top, front, and side views of 3-D objects composed of right rectangular prisms.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_8']),
('NL', 'APEF', 'math', '8', 'NL-8SS6', 'Shape and Space', 'Demonstrate an understanding of the congruence of polygons under a transformation.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_8'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 8 — Statistics and Probability
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '8', 'NL-8SP1', 'Statistics and Probability', 'Critique ways in which data is presented in circle graphs, line graphs, bar graphs, and pictographs.', ARRAY['math', 'statistics', 'apef', 'grade_8']),
('NL', 'APEF', 'math', '8', 'NL-8SP2', 'Statistics and Probability', 'Solve problems involving the probability of independent events.', ARRAY['math', 'statistics', 'probability', 'apef', 'grade_8'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- --------------------------------------------------------------------------
-- GRADE 9 — Number
-- --------------------------------------------------------------------------
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '9', 'NL-9N1', 'Number', 'Demonstrate an understanding of powers with integral bases (excluding base 0) and whole number exponents by representing repeated multiplication using powers, using patterns to show that a power with exponent zero is equal to one, and solving problems involving powers.', ARRAY['math', 'number', 'apef', 'grade_9']),
('NL', 'APEF', 'math', '9', 'NL-9N2', 'Number', 'Demonstrate an understanding of operations on powers with integral bases and whole number exponents.', ARRAY['math', 'number', 'apef', 'grade_9']),
('NL', 'APEF', 'math', '9', 'NL-9N3', 'Number', 'Demonstrate an understanding of rational numbers by comparing and ordering rational numbers and solving problems that involve arithmetic operations on rational numbers.', ARRAY['math', 'number', 'apef', 'grade_9']),
('NL', 'APEF', 'math', '9', 'NL-9N4', 'Number', 'Explain and apply the order of operations, including exponents, with and without technology.', ARRAY['math', 'number', 'apef', 'grade_9']),
('NL', 'APEF', 'math', '9', 'NL-9N5', 'Number', 'Determine the exact square root of positive rational numbers.', ARRAY['math', 'number', 'apef', 'grade_9']),
('NL', 'APEF', 'math', '9', 'NL-9N6', 'Number', 'Determine an approximate square root of positive rational numbers that are not perfect squares.', ARRAY['math', 'number', 'apef', 'grade_9'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 9 — Patterns and Relations
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '9', 'NL-9PR1', 'Patterns and Relations', 'Generalize a pattern arising from a problem-solving context using a linear equation and verify by substitution.', ARRAY['math', 'patterns', 'apef', 'grade_9']),
('NL', 'APEF', 'math', '9', 'NL-9PR2', 'Patterns and Relations', 'Graph a linear relation, analyze the graph, and interpolate or extrapolate to solve problems.', ARRAY['math', 'patterns', 'apef', 'grade_9']),
('NL', 'APEF', 'math', '9', 'NL-9PR3', 'Patterns and Relations', 'Model and solve problems using linear equations of the form ax = b, x/a = b (a is not 0), ax + b = c, x/a + b = c (a is not 0), a(x + b) = c, ax + b = cx + d, a(bx + c) = d(ex + f), and a/x = b (x is not 0).', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_9']),
('NL', 'APEF', 'math', '9', 'NL-9PR4', 'Patterns and Relations', 'Explain and illustrate strategies to solve single variable linear inequalities with rational coefficients.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_9']),
('NL', 'APEF', 'math', '9', 'NL-9PR5', 'Patterns and Relations', 'Demonstrate an understanding of polynomials (limited to polynomials of degree less than or equal to 2).', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_9']),
('NL', 'APEF', 'math', '9', 'NL-9PR6', 'Patterns and Relations', 'Model, record, and explain the operations of addition and subtraction of polynomial expressions concretely, pictorially, and symbolically.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_9']),
('NL', 'APEF', 'math', '9', 'NL-9PR7', 'Patterns and Relations', 'Model, record, and explain the operations of multiplication and division of polynomial expressions (limited to polynomials) by monomials concretely, pictorially, and symbolically.', ARRAY['math', 'patterns', 'relations', 'apef', 'grade_9'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 9 — Shape and Space
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '9', 'NL-9SS1', 'Shape and Space', 'Solve problems and justify the solution strategy using circle properties involving inscribed angles, central angles, and tangent lines.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_9']),
('NL', 'APEF', 'math', '9', 'NL-9SS2', 'Shape and Space', 'Determine the surface area of composite 3-D objects to solve problems.', ARRAY['math', 'shape', 'measurement', 'apef', 'grade_9']),
('NL', 'APEF', 'math', '9', 'NL-9SS3', 'Shape and Space', 'Demonstrate an understanding of similarity of polygons.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_9']),
('NL', 'APEF', 'math', '9', 'NL-9SS4', 'Shape and Space', 'Draw and interpret scale diagrams of 2-D shapes.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_9']),
('NL', 'APEF', 'math', '9', 'NL-9SS5', 'Shape and Space', 'Demonstrate an understanding of line and rotation symmetry.', ARRAY['math', 'shape', 'geometry', 'apef', 'grade_9'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- Grade 9 — Statistics and Probability
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('NL', 'APEF', 'math', '9', 'NL-9SP1', 'Statistics and Probability', 'Describe the effect of bias, use of language, ethics, cost, time and timing, privacy, and cultural sensitivity on the collection of data.', ARRAY['math', 'statistics', 'apef', 'grade_9']),
('NL', 'APEF', 'math', '9', 'NL-9SP2', 'Statistics and Probability', 'Select and defend the choice of using either a population or a sample of a population to answer a question.', ARRAY['math', 'statistics', 'apef', 'grade_9']),
('NL', 'APEF', 'math', '9', 'NL-9SP3', 'Statistics and Probability', 'Develop and implement a project plan for the collection, display, and analysis of data by formulating a question, choosing a data collection method, and selecting a population or sample.', ARRAY['math', 'statistics', 'apef', 'grade_9']),
('NL', 'APEF', 'math', '9', 'NL-9SP4', 'Statistics and Probability', 'Demonstrate an understanding of the role of probability in society.', ARRAY['math', 'statistics', 'probability', 'apef', 'grade_9'])
ON CONFLICT (province, outcome_code) DO NOTHING;

-- ============================================================================

-- ============================================================================
-- NORTHERN TERRITORIES — Curriculum Mapping
-- ============================================================================
--
-- Northern Territories: YT uses BC curriculum, NT uses AB curriculum, NU uses WNCP
-- Territory outcomes are mapped via parent province curricula:
--
--   YT (Yukon)                → follows BC curriculum (see seed_curriculum_western.sql)
--   NT (Northwest Territories) → follows AB curriculum (see seed_curriculum_western.sql)
--   NU (Nunavut)              → follows WNCP framework (aligned with MB/SK)
--
-- Rather than duplicating, territory students should be mapped to the
-- corresponding provincial curriculum in the application layer:
--
--   SELECT * FROM curriculum_outcomes WHERE province = 'BC'  -- for YT students
--   SELECT * FROM curriculum_outcomes WHERE province = 'AB'  -- for NT students
--   SELECT * FROM curriculum_outcomes WHERE province = 'SK'  -- for NU students (WNCP)
--
-- If territory-specific adaptations are needed in the future, they can be
-- added here with territory-specific outcome codes (e.g., YT-1N1, NT-1N1, NU-1N1).
-- ============================================================================

-- Placeholder: Territory curriculum mapping references
INSERT INTO curriculum_outcomes (province, framework, subject, grade_level, outcome_code, strand, description, tags) VALUES
('YT', 'BC', 'math', 'K', 'YT-REF', 'Reference', 'Yukon follows the British Columbia mathematics curriculum. See BC outcomes for full K-9 math curriculum.', ARRAY['math', 'reference', 'yukon', 'bc_curriculum']),
('NT', 'AB', 'math', 'K', 'NT-REF', 'Reference', 'Northwest Territories follows the Alberta mathematics curriculum. See AB outcomes for full K-9 math curriculum.', ARRAY['math', 'reference', 'nwt', 'ab_curriculum']),
('NU', 'WNCP', 'math', 'K', 'NU-REF', 'Reference', 'Nunavut follows the WNCP mathematics curriculum framework. See SK/MB outcomes for aligned K-9 math curriculum.', ARRAY['math', 'reference', 'nunavut', 'wncp'])
ON CONFLICT (province, outcome_code) DO NOTHING;


-- ============================================================================
-- TODO: Future Subject Additions
-- ============================================================================
--
-- TODO: Add Atlantic Canada ELA (English Language Arts) outcomes K-9
--   - APEF English Language Arts framework
--   - Strands: Reading, Writing, Listening, Speaking, Viewing, Representing
--   - Same shared framework across NS, NB, PE, NL
--   - Outcome codes: e.g., NS-3R1 (Grade 3, Reading, outcome 1)
--
-- TODO: Add Atlantic Canada Science outcomes K-9
--   - APEF Science framework (Pan-Canadian Common Framework of Science)
--   - Strands: Life Science, Physical Science, Earth and Space Science
--   - Same shared framework across NS, NB, PE, NL
--   - Outcome codes: e.g., NS-5LS1 (Grade 5, Life Science, outcome 1)
--
-- TODO: Add French Immersion / Core French outcomes for NB
--   - NB has mandatory French; specific curriculum may differ from other Atlantic provinces
--
-- TODO: Add Nunavut Inuktitut language and culture outcomes
--   - Territory-specific cultural curriculum
--
-- TODO: Add territory-specific curriculum adaptations if needed
--   - YT, NT, NU may have local supplements to parent province curricula
-- ============================================================================
