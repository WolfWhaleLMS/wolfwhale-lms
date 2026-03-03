-- ============================================================================
-- WolfWhale Textbook Seed Data
-- 15 Saskatchewan K-12 Math Textbooks
--
-- These textbooks replace legacy publishers (Pearson/Addison-Wesley, Nelson)
-- with original, curriculum-aligned WolfWhale content.
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
