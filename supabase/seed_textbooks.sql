-- ============================================================================
-- WolfWhale Textbook Seed Data
-- Full K-12 Textbook Library: Math, Science, ELA, Physics, Chemistry, Biology
--
-- 15 WolfWhale digital textbooks replacing 19 Maxwell-lineage legacy textbooks
-- (Nelson, McGraw-Hill Ryerson, Glencoe, Pearson)
-- All content is 100% original — ZERO copied material from existing publishers.
--
-- NOTE: tenant_id and created_by use placeholder UUIDs.
-- Replace with actual tenant/user IDs before running in production.
-- ============================================================================

-- Placeholder IDs (replace per tenant deployment)
-- tenant_id:  00000000-0000-0000-0000-000000000001
-- created_by: 00000000-0000-0000-0000-000000000001


-- ===================================================================
-- K-9 Mathematics (replaces "Math Makes Sense" series by Pearson)
-- ===================================================================

-- 1. WolfWhale Foundations of Math K
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale Foundations of Math K',
  'wolfwhale-foundations-of-math-k',
  'math',
  '0',
  'SK',
  'WNCP',
  'Kindergarten mathematics covering number sense (0-10), patterns, and shape & space. Replaces Math Makes Sense K with original, curriculum-aligned content for Saskatchewan classrooms.',
  '[{"title": "Math Makes Sense K", "publisher": "Pearson/Addison-Wesley", "estimated_price": 89, "isbn": null}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 2. WolfWhale Foundations of Math 1
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale Foundations of Math 1',
  'wolfwhale-foundations-of-math-1',
  'math',
  '1',
  'SK',
  'WNCP',
  'Grade 1 mathematics covering number sense (0-100), addition & subtraction to 20, repeating patterns, equality, measurement, and 2-D/3-D shapes. Replaces Math Makes Sense 1.',
  '[{"title": "Math Makes Sense 1", "publisher": "Pearson/Addison-Wesley", "estimated_price": 89, "isbn": null}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 3. WolfWhale Foundations of Math 2
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale Foundations of Math 2',
  'wolfwhale-foundations-of-math-2',
  'math',
  '2',
  'SK',
  'WNCP',
  'Grade 2 mathematics covering whole numbers to 100, addition & subtraction with regrouping, increasing patterns, equality & inequality, linear measurement, and 3-D/2-D geometry. Replaces Math Makes Sense 2.',
  '[{"title": "Math Makes Sense 2", "publisher": "Pearson/Addison-Wesley", "estimated_price": 89, "isbn": null}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 4. WolfWhale Foundations of Math 3
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale Foundations of Math 3',
  'wolfwhale-foundations-of-math-3',
  'math',
  '3',
  'SK',
  'WNCP',
  'Grade 3 mathematics covering whole numbers to 1000, multiplication & division concepts, fractions, patterns & equations, measurement (length, mass, perimeter), and geometry. Replaces Math Makes Sense 3.',
  '[{"title": "Math Makes Sense 3", "publisher": "Pearson/Addison-Wesley", "estimated_price": 89, "isbn": null}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 5. WolfWhale Foundations of Math 4
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale Foundations of Math 4',
  'wolfwhale-foundations-of-math-4',
  'math',
  '4',
  'SK',
  'WNCP',
  'Grade 4 mathematics covering whole numbers to 10,000, multiplication & division facts, decimals, fractions, patterns & equations, measurement (area, volume), geometry, and data analysis. Replaces Math Makes Sense 4.',
  '[{"title": "Math Makes Sense 4", "publisher": "Pearson/Addison-Wesley", "estimated_price": 89, "isbn": null}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 6. WolfWhale Foundations of Math 5
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale Foundations of Math 5',
  'wolfwhale-foundations-of-math-5',
  'math',
  '5',
  'SK',
  'WNCP',
  'Grade 5 mathematics covering whole numbers to 1,000,000, operations with decimals, fraction equivalence, patterns & variables, measurement (capacity, volume, area), transformations, and data analysis. Replaces Math Makes Sense 5.',
  '[{"title": "Math Makes Sense 5", "publisher": "Pearson/Addison-Wesley", "estimated_price": 89, "isbn": null}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 7. WolfWhale Foundations of Math 6
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale Foundations of Math 6',
  'wolfwhale-foundations-of-math-6',
  'math',
  '6',
  'SK',
  'WNCP',
  'Grade 6 mathematics covering place value to millions, operations with whole numbers & decimals, ratio & percent, order of operations, integers, angle measurement, perimeter & area, and data analysis. Replaces Math Makes Sense 6.',
  '[{"title": "Math Makes Sense 6", "publisher": "Pearson/Addison-Wesley", "estimated_price": 89, "isbn": null}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 8. WolfWhale Foundations of Math 7
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale Foundations of Math 7',
  'wolfwhale-foundations-of-math-7',
  'math',
  '7',
  'SK',
  'WNCP',
  'Grade 7 mathematics covering divisibility, operations with decimals & fractions, percent, integers, linear equations, circles, area & volume, transformations, and central tendency. Replaces Math Makes Sense 7.',
  '[{"title": "Math Makes Sense 7", "publisher": "Pearson/Addison-Wesley", "estimated_price": 89, "isbn": null}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 9. WolfWhale Foundations of Math 8
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale Foundations of Math 8',
  'wolfwhale-foundations-of-math-8',
  'math',
  '8',
  'SK',
  'WNCP',
  'Grade 8 mathematics covering square roots, rates & proportions, integer operations, linear relations & equations, Pythagorean theorem, surface area & volume, tessellations, and data analysis. Replaces Math Makes Sense 8.',
  '[{"title": "Math Makes Sense 8", "publisher": "Pearson/Addison-Wesley", "estimated_price": 89, "isbn": null}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 10. WolfWhale Foundations of Math 9
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale Foundations of Math 9',
  'wolfwhale-foundations-of-math-9',
  'math',
  '9',
  'SK',
  'WNCP',
  'Grade 9 mathematics covering rational numbers, square roots & exponents, polynomials, linear relations, circle geometry, symmetry, and probability & statistics. Replaces Math Makes Sense 9.',
  '[{"title": "Math Makes Sense 9", "publisher": "Pearson/Addison-Wesley", "estimated_price": 89, "isbn": null}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;


-- ===================================================================
-- Senior Mathematics (Grades 10-30)
-- (replaces Nelson and Pearson senior math series)
-- ===================================================================

-- 11. WolfWhale Workplace & Apprenticeship Math 10
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale Workplace & Apprenticeship Math 10',
  'wolfwhale-workplace-apprenticeship-math-10',
  'math',
  '10',
  'SK',
  'WNCP',
  'Workplace and Apprenticeship Mathematics 10 covering unit pricing, currency exchange, income, measurement, geometry, and data analysis for trades and workplace contexts. Replaces Foundations and Pre-Calculus 10.',
  '[{"title": "Foundations and Pre-Calculus 10", "publisher": "Nelson", "estimated_price": 92, "isbn": null}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 12. WolfWhale Pre-Calculus Math 20
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale Pre-Calculus Math 20',
  'wolfwhale-pre-calculus-math-20',
  'math',
  '20',
  'SK',
  'WNCP',
  'Pre-Calculus Mathematics 20 covering absolute value, radicals, rational expressions, quadratic functions, systems of equations, and trigonometry. Replaces Pre-Calculus 11.',
  '[{"title": "Pre-Calculus 11", "publisher": "Nelson", "estimated_price": 92, "isbn": null}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 13. WolfWhale Pre-Calculus Math 30
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale Pre-Calculus Math 30',
  'wolfwhale-pre-calculus-math-30',
  'math',
  '30',
  'SK',
  'WNCP',
  'Pre-Calculus Mathematics 30 covering polynomial, radical & rational functions, trigonometric identities & equations, exponential & logarithmic functions, combinatorics, and the binomial theorem. Replaces Pre-Calculus 12.',
  '[{"title": "Pre-Calculus 12", "publisher": "Nelson", "estimated_price": 92, "isbn": null}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 14. WolfWhale Calculus 30
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale Calculus 30',
  'wolfwhale-calculus-30',
  'math',
  '30',
  'SK',
  'WNCP',
  'Calculus 30 covering limits & continuity, derivatives & their applications, antiderivatives, definite integrals, and the Fundamental Theorem of Calculus. Replaces Calculus: A Complete Course.',
  '[{"title": "Calculus: A Complete Course", "publisher": "Pearson/Addison-Wesley", "estimated_price": 185, "isbn": null}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 15. WolfWhale Foundations of Math 10
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale Foundations of Math 10',
  'wolfwhale-foundations-of-math-10',
  'math',
  '10',
  'SK',
  'WNCP',
  'Foundations of Mathematics 10 covering measurement & unit analysis, trigonometry, factors & products, roots & powers, linear relations, and systems of linear equations. Replaces Foundations of Mathematics 10.',
  '[{"title": "Foundations of Mathematics 10", "publisher": "Nelson", "estimated_price": 92, "isbn": null}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;


-- ===================================================================
-- K-9 Science (Saskatchewan Curriculum)
-- ===================================================================

-- 16. WolfWhale Science K
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale Science K',
  'wolfwhale-science-k',
  'science',
  '0',
  'SK',
  'WNCP',
  'Kindergarten science exploring living things in the local environment, observable characteristics of familiar objects and materials, effects of physical forces and energy, and features of natural surroundings. Aligned to Saskatchewan curriculum outcomes.',
  '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 17. WolfWhale Science 1
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale Science 1',
  'wolfwhale-science-1',
  'science',
  '1',
  'SK',
  'WNCP',
  'Grade 1 science covering the five senses, needs of living things, daily and seasonal changes, and observable characteristics of objects and materials. Aligned to Saskatchewan curriculum outcomes.',
  '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 18. WolfWhale Science 2
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale Science 2',
  'wolfwhale-science-2',
  'science',
  '2',
  'SK',
  'WNCP',
  'Grade 2 science covering animal growth and development, air and water in the environment, properties of liquids and solids, and motion and position of objects. Aligned to Saskatchewan curriculum outcomes.',
  '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 19. WolfWhale Science 3
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale Science 3',
  'wolfwhale-science-3',
  'science',
  '3',
  'SK',
  'WNCP',
  'Grade 3 science covering plant growth and development, materials and structures, exploring soils, and magnetism and static electricity. Aligned to Saskatchewan curriculum outcomes.',
  '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 20. WolfWhale Science 4
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale Science 4',
  'wolfwhale-science-4',
  'science',
  '4',
  'SK',
  'WNCP',
  'Grade 4 science covering habitats and communities, light, sound, and rocks and minerals. Aligned to Saskatchewan curriculum outcomes.',
  '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 21. WolfWhale Science 5
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale Science 5',
  'wolfwhale-science-5',
  'science',
  '5',
  'SK',
  'WNCP',
  'Grade 5 science covering human body systems, properties and changes of materials, forces and simple machines, and weather. Aligned to Saskatchewan curriculum outcomes.',
  '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 22. WolfWhale Science 6
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale Science 6',
  'wolfwhale-science-6',
  'science',
  '6',
  'SK',
  'WNCP',
  'Grade 6 science covering diversity of living things, understanding electricity, principles of flight, and the solar system and space exploration. Aligned to Saskatchewan curriculum outcomes.',
  '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 23. WolfWhale Science 7
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale Science 7',
  'wolfwhale-science-7',
  'science',
  '7',
  'SK',
  'WNCP',
  'Grade 7 science covering interactions within ecosystems, mixtures and solutions, heat and temperature, and Earth''s crust. Aligned to Saskatchewan curriculum outcomes.',
  '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 24. WolfWhale Science 8
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale Science 8',
  'wolfwhale-science-8',
  'science',
  '8',
  'SK',
  'WNCP',
  'Grade 8 science covering cells and body systems, fluids and density, optics and light technologies, and water systems on Earth. Aligned to Saskatchewan curriculum outcomes.',
  '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 25. WolfWhale Science 9
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale Science 9',
  'wolfwhale-science-9',
  'science',
  '9',
  'SK',
  'WNCP',
  'Grade 9 science covering atoms and elements, characteristics of electricity, reproduction and human development, and exploring the universe. Includes First Nations perspectives and "Ask an Elder" features. Replaces Pearson Saskatchewan Science 9.',
  '[{"title": "Pearson Saskatchewan Science 9", "publisher": "Pearson", "estimated_price": 102.38, "isbn": null}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;


-- ===================================================================
-- Senior Science (replaces Nelson, Glencoe, Pearson senior science)
-- ===================================================================

-- Science 10 (replaces Nelson Science 10 + Nelson Science Perspectives 10)
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale Science 10',
  'wolfwhale-science-10',
  'science',
  '10',
  'SK',
  'WNCP',
  'Grade 10 science covering climate change, chemical reactions, weather dynamics, and motion. Integrates Indigenous land-based knowledge and Treaty education throughout all units. Replaces Nelson Science 10 and Nelson Science Perspectives 10.',
  '[{"title": "Nelson Science 10", "publisher": "Nelson", "estimated_price": 85.95, "isbn": null}, {"title": "Nelson Science Perspectives 10", "publisher": "Nelson", "estimated_price": 85.95, "isbn": null}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- Physical Science 20 (replaces Nelson Physics 11 + Glencoe Physics: Principles & Problems)
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale Physical Science 20',
  'wolfwhale-physical-science-20',
  'physics',
  '20',
  'SK',
  'WNCP',
  'Physical Science 20 covering kinematics, dynamics, energy, heat, waves, and an introduction to modern physics. Replaces both Nelson Physics 11 and Glencoe Physics: Principles & Problems with original, curriculum-aligned content.',
  '[{"title": "Nelson Physics 11", "publisher": "Nelson", "estimated_price": 79.95, "isbn": null}, {"title": "Glencoe Physics: Principles & Problems", "publisher": "Glencoe/McGraw-Hill", "estimated_price": 107.95, "isbn": null}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- Physics 30 (replaces Nelson Physics 12 + Glencoe Physics)
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale Physics 30',
  'wolfwhale-physics-30',
  'physics',
  '30',
  'SK',
  'WNCP',
  'Physics 30 covering momentum, fields (gravitational, electric, magnetic), electromagnetic radiation, atomic physics, and nuclear physics. Replaces Nelson Physics 12 and Glencoe Physics with original, curriculum-aligned content.',
  '[{"title": "Nelson Physics 12", "publisher": "Nelson", "estimated_price": 82.95, "isbn": null}, {"title": "Glencoe Physics: Principles & Problems", "publisher": "Glencoe/McGraw-Hill", "estimated_price": 107.95, "isbn": null}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- Biology 30 (replaces Nelson Biology 12 + Nelson Biology 12 Uni Prep + Glencoe Biology)
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale Biology 30',
  'wolfwhale-biology-30',
  'biology',
  '30',
  'SK',
  'WNCP',
  'Biology 30 covering biochemistry, cell biology, molecular genetics, population and community ecology, and evolution. Includes Indigenous ecological knowledge and land-based science perspectives. Replaces Nelson Biology 12, Nelson Biology 12 University Preparation, and Glencoe Biology.',
  '[{"title": "Nelson Biology 12", "publisher": "Nelson", "estimated_price": 86.10, "isbn": null}, {"title": "Nelson Biology 12 University Preparation", "publisher": "Nelson", "estimated_price": 82.95, "isbn": null}, {"title": "Glencoe Biology", "publisher": "Glencoe/McGraw-Hill", "estimated_price": 107.95, "isbn": null}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- Chemistry 30 (replaces Nelson Chemistry 12 + Nelson Chemistry 12 Uni Prep)
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale Chemistry 30',
  'wolfwhale-chemistry-30',
  'chemistry',
  '30',
  'SK',
  'WNCP',
  'Chemistry 30 covering thermochemistry, electrochemistry, chemical kinetics, equilibrium, acids & bases, and organic chemistry. Replaces Nelson Chemistry 12 and Nelson Chemistry 12 University Preparation with original, curriculum-aligned content.',
  '[{"title": "Nelson Chemistry 12", "publisher": "Nelson", "estimated_price": 86.10, "isbn": null}, {"title": "Nelson Chemistry 12 University Preparation", "publisher": "Nelson", "estimated_price": 82.95, "isbn": null}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- Language & Writing 20/30 (replaces Nelson Language and Writing 11)
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale Language & Writing 20/30',
  'wolfwhale-language-writing-20-30',
  'ela',
  '20',
  'SK',
  'WNCP',
  'Language & Writing 20/30 covering academic and creative writing, rhetorical analysis, research methodology, Indigenous authors and oral storytelling traditions, Treaty education through literature, media literacy, and advanced composition. Replaces Nelson Language and Writing 11.',
  '[{"title": "Nelson Language and Writing 11", "publisher": "Nelson", "estimated_price": 72.50, "isbn": null}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;


-- ===================================================================
-- K-9 English Language Arts (ELA)
-- Saskatchewan WNCP Curriculum
-- ===================================================================

-- 26. WolfWhale English Language Arts K
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale English Language Arts K',
  'wolfwhale-ela-k',
  'ela',
  '0',
  'SK',
  'WNCP',
  'Kindergarten English Language Arts covering listening, viewing, emerging reading, oral language, drawing to communicate, and early letter recognition. Aligned to Saskatchewan ELA K curriculum.',
  '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 27. WolfWhale English Language Arts 1
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale English Language Arts 1',
  'wolfwhale-ela-1',
  'ela',
  '1',
  'SK',
  'WNCP',
  'Grade 1 English Language Arts covering phonics, sight words, basic reading comprehension, writing sentences, retelling stories, and oral presentations. Aligned to Saskatchewan ELA 1 curriculum.',
  '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 28. WolfWhale English Language Arts 2
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale English Language Arts 2',
  'wolfwhale-ela-2',
  'ela',
  '2',
  'SK',
  'WNCP',
  'Grade 2 English Language Arts covering reading comprehension, writing paragraphs, vocabulary building, speaking presentations, and responding to literature from various cultures. Aligned to Saskatchewan ELA 2 curriculum.',
  '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 29. WolfWhale English Language Arts 3
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale English Language Arts 3',
  'wolfwhale-ela-3',
  'ela',
  '3',
  'SK',
  'WNCP',
  'Grade 3 English Language Arts covering reading strategies, writing genres (narrative, informational), research skills, grammar foundations, and comprehension of fiction and non-fiction from First Nations and Metis cultures. Aligned to Saskatchewan ELA 3 curriculum.',
  '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 30. WolfWhale English Language Arts 4
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale English Language Arts 4',
  'wolfwhale-ela-4',
  'ela',
  '4',
  'SK',
  'WNCP',
  'Grade 4 English Language Arts covering reading fluency, the writing process, descriptive and narrative composition, presentation skills, poetry, and visual literacy. Aligned to Saskatchewan ELA 4 curriculum.',
  '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 31. WolfWhale English Language Arts 5
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale English Language Arts 5',
  'wolfwhale-ela-5',
  'ela',
  '5',
  'SK',
  'WNCP',
  'Grade 5 English Language Arts covering literary analysis, persuasive writing, research projects, grammar conventions, multimedia presentations, and critical listening. Aligned to Saskatchewan ELA 5 curriculum.',
  '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 32. WolfWhale English Language Arts 6
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale English Language Arts 6',
  'wolfwhale-ela-6',
  'ela',
  '6',
  'SK',
  'WNCP',
  'Grade 6 English Language Arts covering critical reading, essay writing, media literacy, debate, inquiry reports, and comprehension of prose fiction, poetry, and plays from diverse cultures. Aligned to Saskatchewan ELA 6 curriculum.',
  '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 33. WolfWhale English Language Arts 7
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale English Language Arts 7',
  'wolfwhale-ela-7',
  'ela',
  '7',
  'SK',
  'WNCP',
  'Grade 7 English Language Arts covering novel study, creative writing with dialogue and figurative language, oral presentations, citation skills, inquiry projects, and critical comprehension. Aligned to Saskatchewan ELA 7 curriculum.',
  '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 34. WolfWhale English Language Arts 8
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale English Language Arts 8',
  'wolfwhale-ela-8',
  'ela',
  '8',
  'SK',
  'WNCP',
  'Grade 8 English Language Arts covering literary criticism, argumentative writing, public speaking, media analysis, group inquiry projects, and comprehension of texts evaluating purpose, point of view, and craft. Aligned to Saskatchewan ELA 8 curriculum.',
  '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;

-- 35. WolfWhale English Language Arts 9
INSERT INTO textbooks (
  tenant_id, title, slug, subject, grade_level, province, curriculum_framework,
  description, replaces_textbooks, is_published, created_by
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'WolfWhale English Language Arts 9',
  'wolfwhale-ela-9',
  'ela',
  '9',
  'SK',
  'WNCP',
  'Grade 9 English Language Arts covering literary movements, research papers, formal presentations, advanced grammar, identity exploration, and independent comprehension of complex fiction, poetry, and information texts. Aligned to Saskatchewan ELA 9 curriculum.',
  '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb,
  false,
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (tenant_id, slug) DO NOTHING;


-- ===================================================================
-- K-9 Social Studies
-- Saskatchewan WNCP Curriculum — Treaty Education integrated throughout
-- ===================================================================

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Social Studies K', 'wolfwhale-social-studies-k', 'social_studies', '0', 'SK', 'WNCP', 'Kindergarten social studies exploring my family, my community, and special celebrations. Introduces Treaty education and First Nations perspectives on community and belonging.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Social Studies 1', 'wolfwhale-social-studies-1', 'social_studies', '1', 'SK', 'WNCP', 'Grade 1 social studies covering my community, needs and wants, and responsible citizenship. Treaty 4, 5, 6, 8, and 10 territory awareness.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Social Studies 2', 'wolfwhale-social-studies-2', 'social_studies', '2', 'SK', 'WNCP', 'Grade 2 social studies covering Saskatchewan communities, Canadian symbols, and diverse cultural groups. Explores Metis and First Nations contributions to Saskatchewan.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Social Studies 3', 'wolfwhale-social-studies-3', 'social_studies', '3', 'SK', 'WNCP', 'Grade 3 social studies covering communities of the world, cultural diversity, and global citizenship. Treaty relationships and Indigenous governance systems.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Social Studies 4', 'wolfwhale-social-studies-4', 'social_studies', '4', 'SK', 'WNCP', 'Grade 4 social studies covering Saskatchewan history, First Nations pre-contact societies, fur trade, Confederation, and the development of the province. Treaty-making process.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Social Studies 5', 'wolfwhale-social-studies-5', 'social_studies', '5', 'SK', 'WNCP', 'Grade 5 social studies covering Canadian government, democratic processes, rights and responsibilities, and the Canadian Charter of Rights and Freedoms. Treaty rights and Indigenous self-governance.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Social Studies 6', 'wolfwhale-social-studies-6', 'social_studies', '6', 'SK', 'WNCP', 'Grade 6 social studies covering Canada and its Pacific and Atlantic neighbours, trade, cultural exchange, and global interdependence. Indigenous perspectives on international relations.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Social Studies 7', 'wolfwhale-social-studies-7', 'social_studies', '7', 'SK', 'WNCP', 'Grade 7 social studies covering ancient civilizations, power and authority, and the interaction of diverse worldviews. Comparing Indigenous governance with European systems.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Social Studies 8', 'wolfwhale-social-studies-8', 'social_studies', '8', 'SK', 'WNCP', 'Grade 8 social studies covering the Renaissance to modern era, colonialism, residential schools, and the path to reconciliation. TRC Calls to Action and UNDRIP.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Social Studies 9', 'wolfwhale-social-studies-9', 'social_studies', '9', 'SK', 'WNCP', 'Grade 9 social studies covering globalization, sustainability, human rights, and the role of Canada in the world. Indigenous sovereignty and self-determination in a global context.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;


-- ===================================================================
-- K-9 Health Education
-- Saskatchewan Curriculum
-- ===================================================================

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Health Education K', 'wolfwhale-health-k', 'health', '0', 'SK', 'WNCP', 'Kindergarten health education covering personal safety, healthy eating, feelings, and positive relationships. Culturally responsive content with First Nations wellness perspectives.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Health Education 1', 'wolfwhale-health-1', 'health', '1', 'SK', 'WNCP', 'Grade 1 health covering body parts, hygiene, nutrition, emotions, and personal space. Includes Medicine Wheel teachings on holistic wellness.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Health Education 2', 'wolfwhale-health-2', 'health', '2', 'SK', 'WNCP', 'Grade 2 health covering physical growth, food groups, managing emotions, friendships, and community safety. Holistic wellness through the four dimensions.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Health Education 3', 'wolfwhale-health-3', 'health', '3', 'SK', 'WNCP', 'Grade 3 health covering body systems basics, healthy choices, conflict resolution, family diversity, and personal safety strategies. Indigenous perspectives on community health.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Health Education 4', 'wolfwhale-health-4', 'health', '4', 'SK', 'WNCP', 'Grade 4 health covering puberty awareness, nutrition and active living, bullying prevention, healthy relationships, and substance awareness. Medicine Wheel holistic wellness.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Health Education 5', 'wolfwhale-health-5', 'health', '5', 'SK', 'WNCP', 'Grade 5 health covering puberty and body changes, mental health awareness, media influence on body image, peer pressure, and community resources for wellness.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Health Education 6', 'wolfwhale-health-6', 'health', '6', 'SK', 'WNCP', 'Grade 6 health covering human development, nutrition for active lifestyles, mental wellness strategies, decision-making, and healthy digital habits. Understanding determinants of health.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Health Education 7', 'wolfwhale-health-7', 'health', '7', 'SK', 'WNCP', 'Grade 7 health covering adolescent development, mental health and resilience, healthy relationships, substance use and misuse, and sexual health foundations. Trauma-informed approaches.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Health Education 8', 'wolfwhale-health-8', 'health', '8', 'SK', 'WNCP', 'Grade 8 health covering identity and self-concept, sexual health, consent, stress management, addictions, and social justice in health. Examining health equity and determinants of health.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Health Education 9', 'wolfwhale-health-9', 'health', '9', 'SK', 'WNCP', 'Grade 9 health covering comprehensive sexual health, mental illness awareness, healthy relationships and consent, substance harm reduction, and advocacy for community wellness. Holistic Indigenous wellness models.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;


-- ===================================================================
-- K-9 Arts Education (Visual Art, Music, Drama, Dance)
-- Saskatchewan Curriculum
-- ===================================================================

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Arts Education K', 'wolfwhale-arts-k', 'arts_education', '0', 'SK', 'WNCP', 'Kindergarten arts education covering visual art (drawing, painting, sculpting), music (singing, rhythm, instruments), drama (role play, puppets), and dance (creative movement). Exploring Indigenous art forms and traditions.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Arts Education 1', 'wolfwhale-arts-1', 'arts_education', '1', 'SK', 'WNCP', 'Grade 1 arts covering elements of art (line, shape, colour), musical concepts (beat, melody), storytelling through drama, and creative dance. First Nations beadwork patterns and drum traditions.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Arts Education 2', 'wolfwhale-arts-2', 'arts_education', '2', 'SK', 'WNCP', 'Grade 2 arts covering printmaking, texture, musical notation basics, character development in drama, and folk dance. Exploring Metis jigging and First Nations visual storytelling.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Arts Education 3', 'wolfwhale-arts-3', 'arts_education', '3', 'SK', 'WNCP', 'Grade 3 arts covering perspective, sculpture, recorder and ensemble playing, readers theatre, and creative choreography. Indigenous art as storytelling and cultural expression.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Arts Education 4', 'wolfwhale-arts-4', 'arts_education', '4', 'SK', 'WNCP', 'Grade 4 arts covering elements and principles of design, musical composition, improvisation in drama, and structured dance forms. Saskatchewan artists and Indigenous cultural expression.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Arts Education 5', 'wolfwhale-arts-5', 'arts_education', '5', 'SK', 'WNCP', 'Grade 5 arts covering mixed media, music history and genres, scriptwriting and production, and cultural dance traditions. Exploring the role of arts in Indigenous ceremony and celebration.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Arts Education 6', 'wolfwhale-arts-6', 'arts_education', '6', 'SK', 'WNCP', 'Grade 6 arts covering art criticism, band and choral music, theatrical production, and contemporary dance. Comparing Western and Indigenous artistic traditions.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Arts Education 7', 'wolfwhale-arts-7', 'arts_education', '7', 'SK', 'WNCP', 'Grade 7 arts covering digital art, music technology, devised theatre, and world dance forms. Indigenous digital storytelling and contemporary Indigenous art movements.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Arts Education 8', 'wolfwhale-arts-8', 'arts_education', '8', 'SK', 'WNCP', 'Grade 8 arts covering photography and film, songwriting, directing and production design, and dance composition. Arts as social commentary and cultural identity expression.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Arts Education 9', 'wolfwhale-arts-9', 'arts_education', '9', 'SK', 'WNCP', 'Grade 9 arts covering portfolio development, music performance and theory, advanced theatrical techniques, and dance critique. Capstone projects exploring personal artistic identity and cultural connections.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;


-- ===================================================================
-- K-9 Physical Education
-- Saskatchewan Curriculum
-- ===================================================================

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Physical Education K', 'wolfwhale-phys-ed-k', 'physical_education', '0', 'SK', 'WNCP', 'Kindergarten physical education covering fundamental movement skills, body awareness, spatial awareness, and active play. Outdoor learning and Indigenous games.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Physical Education 1', 'wolfwhale-phys-ed-1', 'physical_education', '1', 'SK', 'WNCP', 'Grade 1 physical education covering running, jumping, throwing, catching, balance, low-organized games, and fitness awareness. Traditional Indigenous games and outdoor education.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Physical Education 2', 'wolfwhale-phys-ed-2', 'physical_education', '2', 'SK', 'WNCP', 'Grade 2 physical education covering refined locomotor and non-locomotor skills, cooperative games, rhythm and dance, and health-related fitness. Land-based physical activities.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Physical Education 3', 'wolfwhale-phys-ed-3', 'physical_education', '3', 'SK', 'WNCP', 'Grade 3 physical education covering sport-specific skills, lead-up games, personal fitness goals, and water safety awareness. Winter activities and cross-country movement on the prairies.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Physical Education 4', 'wolfwhale-phys-ed-4', 'physical_education', '4', 'SK', 'WNCP', 'Grade 4 physical education covering team sports introduction, fitness testing, gymnastics, outdoor pursuits, and fair play. Indigenous games like lacrosse and hand games.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Physical Education 5', 'wolfwhale-phys-ed-5', 'physical_education', '5', 'SK', 'WNCP', 'Grade 5 physical education covering team sport tactics, personal fitness planning, orienteering, and social responsibility in sport. Cross-curricular connections with health and science.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Physical Education 6', 'wolfwhale-phys-ed-6', 'physical_education', '6', 'SK', 'WNCP', 'Grade 6 physical education covering invasion and net/wall sports, fitness components, adventure activities, and sport leadership. Active transportation and community recreation in Saskatchewan.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Physical Education 7', 'wolfwhale-phys-ed-7', 'physical_education', '7', 'SK', 'WNCP', 'Grade 7 physical education covering sport strategy, training principles (FITT), body mechanics, and outdoor education including winter sports. Connecting movement to mental wellness.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Physical Education 8', 'wolfwhale-phys-ed-8', 'physical_education', '8', 'SK', 'WNCP', 'Grade 8 physical education covering advanced sport skills, personal fitness programming, injury prevention, and recreational activities. Exploring lifetime physical activities and community recreation.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;

INSERT INTO textbooks (tenant_id, title, slug, subject, grade_level, province, curriculum_framework, description, replaces_textbooks, is_published, created_by) VALUES
('00000000-0000-0000-0000-000000000001', 'WolfWhale Physical Education 9', 'wolfwhale-phys-ed-9', 'physical_education', '9', 'SK', 'WNCP', 'Grade 9 physical education covering sport officiating and coaching, advanced fitness programming, leadership through movement, and capstone outdoor education. Active for life planning and community sport engagement.', '[{"title": "No specific legacy textbook", "publisher": "Various", "estimated_price": 0}]'::jsonb, false, '00000000-0000-0000-0000-000000000001') ON CONFLICT (tenant_id, slug) DO NOTHING;
