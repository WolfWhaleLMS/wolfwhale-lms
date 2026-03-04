-- ============================================================================
-- WolfWhale Physics Textbook Content Seed Data
-- Saskatchewan Curriculum
--
-- 2 Textbooks:
--   1. WolfWhale Physical Science 20 (10 chapters)
--   2. WolfWhale Physics 30 (10 chapters)
--
-- All content is 100% original. Zero copied material.
-- tenant_id uses placeholder UUID: 00000000-0000-0000-0000-000000000001
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book UUID;
BEGIN
  -- ============================================================================
  -- TEXTBOOK 1: WolfWhale Physical Science 20
  -- Slug: wolfwhale-physical-science-20
  -- ============================================================================
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-physical-science-20';

  -- Chapter 1: Kinematics — Describing Motion
  INSERT INTO textbook_chapters (tenant_id, textbook_id, chapter_number, title, slug, description, content, key_terms, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, 1, 'Kinematics: Describing Motion', 'kinematics-describing-motion',
    'Understand position, displacement, velocity, and acceleration as tools for describing how objects move in one dimension.',
    '[
      {"type": "heading", "content": "Kinematics: Describing Motion", "level": 1},
      {"type": "text", "content": "Physics begins with a deceptively simple question: how do we describe the way things move? Imagine standing on the shore of Last Mountain Lake in Saskatchewan and watching a boat cross the water. You might say it is moving fast, or heading north, or speeding up as it leaves the dock. Each of these statements captures a different aspect of the boat''s motion. Kinematics is the branch of physics that gives us precise, mathematical language for all of these observations — without worrying about what causes the motion."},
      {"type": "text", "content": "Every measurement of motion starts with a reference point. In physics we call this the origin, and the line extending from the origin in our chosen direction is the position axis. When we restrict ourselves to motion along a single straight line, we are studying one-dimensional kinematics. The position of an object is its location on the axis relative to the origin, measured in metres (m)."},
      {"type": "callout", "content": "Position tells you where an object is. Displacement tells you how far and in which direction it moved. Distance tells you how far it travelled in total, regardless of direction. Displacement can be negative; distance is always positive.", "style": "info"},
      {"type": "heading", "content": "Displacement vs. Distance", "level": 2},
      {"type": "text", "content": "Suppose a cross-country skier in Prince Albert National Park starts at a trailhead, skis 3.0 km east, then turns around and skis 1.0 km west. The total distance covered is 4.0 km, but the displacement — the straight-line change from start to finish — is only 2.0 km east. Mathematically, displacement equals the final position minus the initial position: delta-x = x_f - x_i. The Greek letter delta always means change in."},
      {"type": "heading", "content": "Speed and Velocity", "level": 2},
      {"type": "text", "content": "Speed and velocity both describe how quickly an object moves, but velocity includes direction. Average speed equals total distance divided by total time. Average velocity equals displacement divided by the time interval: v_avg = delta-x / delta-t. Because velocity is built from displacement, it carries a sign indicating direction along the axis."},
      {"type": "callout", "content": "Worked Example: A car travels 150 km east from Saskatoon to Humboldt in 1.5 hours, then 50 km west back toward Clavet in 0.5 hours.\n\nAverage speed = total distance / total time = (150 km + 50 km) / (1.5 h + 0.5 h) = 200 km / 2.0 h = 100 km/h.\n\nAverage velocity = displacement / total time = (150 km - 50 km) east / 2.0 h = 100 km east / 2.0 h = 50 km/h east.\n\nNotice the average speed is twice the magnitude of the average velocity because the car doubled back.", "style": "example"},
      {"type": "heading", "content": "Acceleration", "level": 2},
      {"type": "text", "content": "When an object''s velocity changes, we say it accelerates. Average acceleration is the change in velocity divided by the time interval: a_avg = delta-v / delta-t, measured in metres per second squared (m/s^2). Positive acceleration does not always mean speeding up — it means the velocity is becoming more positive. An object moving in the negative direction that slows down has a positive acceleration because its velocity is increasing toward zero."},
      {"type": "callout", "content": "Tip: A common error is to assume that negative acceleration always means slowing down. Whether an object speeds up or slows down depends on whether the acceleration and velocity point in the same direction (speeding up) or opposite directions (slowing down).", "style": "tip"},
      {"type": "quiz", "question": "A cyclist rides 8.0 km north in 20 minutes, stops for 10 minutes, then rides 3.0 km south in 10 minutes. What is her average velocity for the entire trip?", "options": ["7.5 km/h north", "16.5 km/h north", "27.5 km/h north", "5.0 km/h south"], "correct": 0, "explanation": "Displacement = 8.0 km north - 3.0 km south = 5.0 km north. Total time = 20 + 10 + 10 = 40 min = 2/3 h. Average velocity = 5.0 km / (2/3 h) = 7.5 km/h north."},
      {"type": "quiz", "question": "A vehicle changes its velocity from 12 m/s east to 4.0 m/s east over 2.0 seconds. What is its average acceleration?", "options": ["-4.0 m/s^2 (4.0 m/s^2 west)", "4.0 m/s^2 east", "8.0 m/s^2 east", "-8.0 m/s^2"], "correct": 0, "explanation": "a = delta-v / delta-t = (4.0 - 12) / 2.0 = -8.0 / 2.0 = -4.0 m/s^2. The negative sign means the acceleration is directed west — opposite to the motion — so the vehicle is slowing down."}
    ]'::jsonb,
    '[
      {"term": "Kinematics", "definition": "The branch of mechanics that describes the motion of objects without examining the forces that cause the motion."},
      {"term": "Position", "definition": "The location of an object along a chosen axis relative to a defined origin, measured in metres."},
      {"term": "Displacement", "definition": "The change in position of an object, equal to the final position minus the initial position. A vector quantity."},
      {"term": "Distance", "definition": "The total length of the path travelled by an object, regardless of direction. A scalar quantity."},
      {"term": "Velocity", "definition": "The rate of change of displacement with respect to time, measured in m/s. A vector quantity."},
      {"term": "Speed", "definition": "The rate of change of distance with respect to time, measured in m/s. A scalar quantity."},
      {"term": "Acceleration", "definition": "The rate of change of velocity with respect to time, measured in m/s squared."},
      {"term": "Scalar", "definition": "A quantity described by magnitude only, such as distance or speed."},
      {"term": "Vector", "definition": "A quantity described by both magnitude and direction, such as displacement or velocity."}
    ]'::jsonb,
    35, false)
  ON CONFLICT (textbook_id, chapter_number) DO NOTHING;

  -- Chapter 2: Kinematics — Equations of Motion
  INSERT INTO textbook_chapters (tenant_id, textbook_id, chapter_number, title, slug, description, content, key_terms, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, 2, 'Kinematics: Equations of Motion', 'kinematics-equations-of-motion',
    'Apply the kinematic equations to solve problems involving uniformly accelerated motion and free fall.',
    '[
      {"type": "heading", "content": "Kinematics: Equations of Motion", "level": 1},
      {"type": "text", "content": "In the previous chapter, we built the vocabulary of motion — position, velocity, acceleration. Now we assemble that vocabulary into powerful equations that let us predict where an object will be, how fast it will travel, and how long a journey takes. These equations apply whenever acceleration is constant, a condition called uniformly accelerated motion."},
      {"type": "text", "content": "There are five standard kinematic equations that connect five variables: initial velocity (v_i), final velocity (v_f), acceleration (a), displacement (delta-d), and time (t). Every problem gives you three of these quantities and asks for a fourth. The fifth is the variable you do not need and do not use — which tells you which equation to pick."},
      {"type": "callout", "content": "The five kinematic equations for constant acceleration:\n\n1) v_f = v_i + a*t\n2) delta-d = v_i*t + (1/2)*a*t^2\n3) delta-d = v_f*t - (1/2)*a*t^2\n4) v_f^2 = v_i^2 + 2*a*delta-d\n5) delta-d = ((v_i + v_f) / 2) * t\n\nEach equation omits one of the five variables. Choose the equation that leaves out the variable you neither know nor need.", "style": "info"},
      {"type": "heading", "content": "Problem-Solving Strategy", "level": 2},
      {"type": "text", "content": "A reliable approach to kinematics problems follows four steps. First, draw a diagram showing the direction of motion and choose a positive direction. Second, list every known quantity with its correct sign. Third, identify the unknown quantity. Fourth, select the equation that contains your three knowns and one unknown, then solve algebraically before substituting numbers."},
      {"type": "callout", "content": "Worked Example: A truck accelerates uniformly from rest at 2.5 m/s^2 along a straight stretch of Highway 11 north of Saskatoon. How far does it travel in 8.0 seconds?\n\nGiven: v_i = 0 m/s, a = 2.5 m/s^2, t = 8.0 s. Find: delta-d.\n\nChoose equation 2: delta-d = v_i*t + (1/2)*a*t^2\ndelta-d = (0)(8.0) + (1/2)(2.5)(8.0)^2\ndelta-d = 0 + (1.25)(64)\ndelta-d = 80 m\n\nThe truck travels 80 m in 8.0 seconds.", "style": "example"},
      {"type": "heading", "content": "Free Fall", "level": 2},
      {"type": "text", "content": "An important special case of uniformly accelerated motion is free fall — motion under the sole influence of gravity near the surface of the Earth. In free fall, acceleration has a magnitude of approximately 9.81 m/s^2 directed downward. We often round this to 9.8 m/s^2 or even 10 m/s^2 for estimation. Air resistance is neglected in the free-fall model."},
      {"type": "text", "content": "When solving free-fall problems, define upward as positive and downward as negative (or vice versa, as long as you are consistent). With upward as positive, acceleration due to gravity is a = -9.81 m/s^2. A ball thrown straight up has a positive initial velocity that decreases until it momentarily stops at the peak, then increases in the negative direction as it falls back down."},
      {"type": "callout", "content": "Worked Example: A geology student drops a rock from the top of a 45 m cliff along the South Saskatchewan River. How long does it take the rock to reach the water below?\n\nDefine downward as positive. Given: v_i = 0, delta-d = 45 m, a = 9.81 m/s^2. Find: t.\n\nUsing delta-d = v_i*t + (1/2)*a*t^2:\n45 = 0 + (1/2)(9.81)*t^2\n45 = 4.905*t^2\nt^2 = 45 / 4.905 = 9.17\nt = 3.03 s\n\nThe rock reaches the water in approximately 3.0 seconds.", "style": "example"},
      {"type": "quiz", "question": "A car initially travelling at 25 m/s brakes uniformly and stops in 50 m. What is the magnitude of its acceleration?", "options": ["6.25 m/s^2", "0.25 m/s^2", "12.5 m/s^2", "3.13 m/s^2"], "correct": 0, "explanation": "Using v_f^2 = v_i^2 + 2*a*delta-d: 0 = (25)^2 + 2*a*(50). Solving: 0 = 625 + 100a, so a = -6.25 m/s^2. The magnitude is 6.25 m/s^2."},
      {"type": "quiz", "question": "A ball is thrown straight upward at 15 m/s. Taking g = 9.8 m/s^2, what is its velocity at the highest point?", "options": ["0 m/s", "15 m/s downward", "9.8 m/s upward", "7.5 m/s upward"], "correct": 0, "explanation": "At the highest point of its trajectory, the ball momentarily stops before reversing direction. Its velocity is exactly 0 m/s at that instant."}
    ]'::jsonb,
    '[
      {"term": "Uniformly Accelerated Motion", "definition": "Motion in which the acceleration remains constant throughout the entire time interval."},
      {"term": "Kinematic Equations", "definition": "A set of equations relating displacement, velocity, acceleration, and time for objects in uniformly accelerated motion."},
      {"term": "Free Fall", "definition": "Motion of an object under the sole influence of gravity, with no air resistance."},
      {"term": "Acceleration Due to Gravity", "definition": "The acceleration experienced by an object in free fall near the Earth''s surface, approximately 9.81 m/s^2 downward."},
      {"term": "Initial Velocity", "definition": "The velocity of an object at the beginning of the time interval under consideration."},
      {"term": "Final Velocity", "definition": "The velocity of an object at the end of the time interval under consideration."},
      {"term": "Delta", "definition": "The Greek letter used in physics to represent a change in a quantity, such as delta-d for change in position."}
    ]'::jsonb,
    40, false)
  ON CONFLICT (textbook_id, chapter_number) DO NOTHING;

  -- Chapter 3: Dynamics — Forces and Newton''s Laws
  INSERT INTO textbook_chapters (tenant_id, textbook_id, chapter_number, title, slug, description, content, key_terms, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, 3, 'Dynamics: Forces and Newton''s Laws', 'dynamics-forces-newtons-laws',
    'Explore the types of forces in nature and understand Newton''s three laws of motion through real-world applications.',
    '[
      {"type": "heading", "content": "Dynamics: Forces and Newton''s Laws", "level": 1},
      {"type": "text", "content": "Kinematics describes motion; dynamics explains why motion occurs. The central concept in dynamics is force — a push or pull that can change an object''s velocity. Forces are vector quantities, having both magnitude and direction, and are measured in newtons (N). One newton is the force needed to accelerate a 1 kg mass at 1 m/s^2."},
      {"type": "text", "content": "Forces come in many varieties. Gravity pulls every mass toward every other mass. The normal force acts perpendicular to a surface and prevents objects from passing through it. Friction opposes sliding motion along a surface. Tension pulls along a rope or cable. Applied forces are any pushes or pulls exerted by a person or machine. Understanding which forces act on an object is the essential first step in every dynamics problem."},
      {"type": "callout", "content": "A free-body diagram (FBD) is a sketch that shows a single object isolated from its surroundings, with arrows representing every force acting on that object. The arrows start at the object and point in the direction of the force. Their lengths are drawn roughly proportional to the force magnitudes. Always draw an FBD before writing equations.", "style": "info"},
      {"type": "heading", "content": "Newton''s First Law: Inertia", "level": 2},
      {"type": "text", "content": "Newton''s first law states that an object at rest stays at rest, and an object in motion continues moving at constant velocity, unless acted upon by a net external force. This property of matter — the tendency to resist changes in motion — is called inertia. Mass is the quantitative measure of inertia: the greater the mass, the harder it is to change the object''s velocity. A curling stone sliding on ice in a Saskatchewan bonspiel gradually slows due to friction; without friction, it would glide forever at constant speed."},
      {"type": "heading", "content": "Newton''s Second Law: F = ma", "level": 2},
      {"type": "text", "content": "Newton''s second law provides the mathematical connection between force and motion: the net force on an object equals the object''s mass multiplied by its acceleration, written as F_net = m * a. The net force is the vector sum of all forces acting on the object. When the net force is zero, acceleration is zero and the object is in equilibrium — it either remains at rest or moves at constant velocity."},
      {"type": "callout", "content": "Worked Example: A 1200 kg car experiences a 3600 N engine force forward and a 600 N friction force backward. What is its acceleration?\n\nStep 1: Draw an FBD showing the engine force to the right and friction to the left.\nStep 2: Calculate the net force: F_net = 3600 N - 600 N = 3000 N forward.\nStep 3: Apply Newton''s second law: a = F_net / m = 3000 / 1200 = 2.5 m/s^2 forward.\n\nThe car accelerates at 2.5 m/s^2 in the forward direction.", "style": "example"},
      {"type": "heading", "content": "Newton''s Third Law: Action-Reaction", "level": 2},
      {"type": "text", "content": "Newton''s third law states that whenever one object exerts a force on a second object, the second object exerts a force of equal magnitude but opposite direction on the first. These are called action-reaction pairs. Critically, the two forces in an action-reaction pair act on different objects, so they never cancel each other out. When you stand on the floor, your feet push downward on the floor (action) and the floor pushes upward on your feet (reaction, called the normal force)."},
      {"type": "callout", "content": "Tip: Action-reaction pairs always act on two different objects. Forces that cancel each other act on the same object. A book sitting on a table has two forces acting on it — gravity pulling down and the normal force pushing up — but these are not an action-reaction pair. The reaction to the book''s weight is the gravitational pull the book exerts on the Earth.", "style": "tip"},
      {"type": "quiz", "question": "A 5.0 kg box rests on a level floor. The coefficient of static friction is 0.40. What is the minimum horizontal force needed to start the box sliding?", "options": ["19.6 N", "2.0 N", "49.0 N", "12.5 N"], "correct": 0, "explanation": "The normal force on a level surface equals the weight: F_N = m*g = 5.0 * 9.81 = 49.05 N. The maximum static friction force is F_f = mu_s * F_N = 0.40 * 49.05 = 19.6 N. You need to exceed this value to start sliding."},
      {"type": "quiz", "question": "A person pushes a 10 kg crate with a 50 N force across a frictionless floor. What is the acceleration of the crate?", "options": ["5.0 m/s^2", "0.5 m/s^2", "50 m/s^2", "500 m/s^2"], "correct": 0, "explanation": "On a frictionless floor, the only horizontal force is the 50 N push. By Newton''s second law: a = F/m = 50/10 = 5.0 m/s^2."}
    ]'::jsonb,
    '[
      {"term": "Force", "definition": "A push or pull on an object, measured in newtons (N). A vector quantity."},
      {"term": "Net Force", "definition": "The vector sum of all forces acting on an object."},
      {"term": "Free-Body Diagram", "definition": "A sketch showing a single isolated object with arrows for every external force acting on it."},
      {"term": "Inertia", "definition": "The tendency of an object to resist any change in its state of motion."},
      {"term": "Newton''s First Law", "definition": "An object remains at rest or in uniform motion unless acted upon by a net external force."},
      {"term": "Newton''s Second Law", "definition": "The net force on an object equals its mass times its acceleration: F_net = m*a."},
      {"term": "Newton''s Third Law", "definition": "For every action force, there is an equal and opposite reaction force acting on a different object."},
      {"term": "Normal Force", "definition": "The perpendicular contact force exerted by a surface on an object resting on or pressing against it."},
      {"term": "Tension", "definition": "The pulling force transmitted along a rope, string, cable, or similar connector."}
    ]'::jsonb,
    35, false)
  ON CONFLICT (textbook_id, chapter_number) DO NOTHING;

  -- Chapter 4: Dynamics — Applications
  INSERT INTO textbook_chapters (tenant_id, textbook_id, chapter_number, title, slug, description, content, key_terms, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, 4, 'Dynamics: Applications', 'dynamics-applications',
    'Apply Newton''s laws to friction, inclined planes, connected objects, and equilibrium situations.',
    '[
      {"type": "heading", "content": "Dynamics: Applications", "level": 1},
      {"type": "text", "content": "With Newton''s three laws established, we can tackle a wide range of practical scenarios. In this chapter we extend our force analysis to surfaces with friction, ramps and inclines, systems of connected objects, and objects in static or dynamic equilibrium. These situations arise constantly in engineering, construction, and everyday life across Saskatchewan — from highway design to grain elevator mechanics."},
      {"type": "heading", "content": "Friction in Detail", "level": 2},
      {"type": "text", "content": "Friction is a contact force that opposes the relative sliding of two surfaces. There are two types. Static friction prevents an object from starting to slide and can vary from zero up to a maximum value given by f_s(max) = mu_s * F_N, where mu_s is the coefficient of static friction and F_N is the normal force. Kinetic friction acts on an object that is already sliding: f_k = mu_k * F_N. The kinetic coefficient is typically smaller than the static coefficient for the same pair of surfaces, which is why it takes more effort to start pushing a heavy box than to keep it moving."},
      {"type": "callout", "content": "Worked Example: A 25 kg crate sits on a warehouse floor where mu_s = 0.50 and mu_k = 0.35. A worker pushes horizontally with 100 N. Does the crate move, and if so, what is its acceleration?\n\nStep 1: Normal force on level ground: F_N = m*g = 25 * 9.81 = 245.25 N.\nStep 2: Maximum static friction: f_s(max) = 0.50 * 245.25 = 122.6 N.\nStep 3: Since 100 N < 122.6 N, the applied force is insufficient to overcome static friction. The crate does not move.\n\nIf the worker instead pushes with 140 N:\nSince 140 N > 122.6 N, the crate begins to slide. Now kinetic friction applies.\nf_k = 0.35 * 245.25 = 85.8 N.\nF_net = 140 - 85.8 = 54.2 N.\na = F_net / m = 54.2 / 25 = 2.17 m/s^2.", "style": "example"},
      {"type": "heading", "content": "Inclined Planes", "level": 2},
      {"type": "text", "content": "When an object sits on a ramp tilted at angle theta from the horizontal, gravity has two components relative to the surface. The component parallel to the slope is m*g*sin(theta), pulling the object downhill. The component perpendicular to the slope is m*g*cos(theta), pressing the object into the surface. The normal force equals m*g*cos(theta) on a simple incline. Friction, if present, acts parallel to the surface in the direction opposing motion or potential motion."},
      {"type": "text", "content": "Saskatchewan potash mines use conveyor belts on steep inclines to transport ore from underground. Engineers must calculate the forces on these systems carefully: too steep an angle, and the ore slides backward; too shallow, and the conveyor becomes impractically long."},
      {"type": "callout", "content": "Tip: When working with inclines, always tilt your coordinate axes so that one axis is parallel to the slope and the other is perpendicular. This simplifies the math enormously because the normal force and friction align with your axes, and only gravity needs to be decomposed into components.", "style": "tip"},
      {"type": "heading", "content": "Connected Objects and Equilibrium", "level": 2},
      {"type": "text", "content": "When two or more objects are connected by a rope or are in contact, they share forces. A common setup is two blocks connected by a massless rope over a frictionless pulley — an Atwood machine. To solve such problems, draw a separate free-body diagram for each object, write Newton''s second law for each, and then solve the system of equations simultaneously. The objects have the same magnitude of acceleration because they are connected, though their directions may differ."},
      {"type": "text", "content": "Equilibrium occurs when the net force on an object is zero. Static equilibrium means the object is at rest; dynamic equilibrium means it moves at constant velocity. In both cases, the forces balance perfectly. A traffic light hanging from cables is in static equilibrium — the tension forces in the cables have vertical components that together support the weight."},
      {"type": "quiz", "question": "A 10 kg block sits on a ramp inclined at 30 degrees. If the coefficient of kinetic friction is 0.20, what is the acceleration of the block as it slides down?", "options": ["3.21 m/s^2", "4.91 m/s^2", "1.70 m/s^2", "6.60 m/s^2"], "correct": 0, "explanation": "Parallel component of gravity: m*g*sin(30) = 10*9.81*0.50 = 49.05 N. Normal force: m*g*cos(30) = 10*9.81*0.866 = 84.96 N. Kinetic friction: 0.20*84.96 = 16.99 N. Net force = 49.05 - 16.99 = 32.06 N. Acceleration = 32.06/10 = 3.21 m/s^2."}
    ]'::jsonb,
    '[
      {"term": "Static Friction", "definition": "The friction force that prevents an object from beginning to slide along a surface. It adjusts up to a maximum value."},
      {"term": "Kinetic Friction", "definition": "The friction force acting on an object that is already sliding along a surface."},
      {"term": "Coefficient of Friction", "definition": "A dimensionless number representing the ratio of the friction force to the normal force for a given pair of surfaces."},
      {"term": "Inclined Plane", "definition": "A flat surface tilted at an angle to the horizontal, used to analyze the components of gravitational force."},
      {"term": "Equilibrium", "definition": "The state of an object when the net force acting on it is zero, resulting in zero acceleration."},
      {"term": "Static Equilibrium", "definition": "Equilibrium in which the object is at rest and remains at rest."},
      {"term": "Dynamic Equilibrium", "definition": "Equilibrium in which the object moves at constant velocity."},
      {"term": "Atwood Machine", "definition": "A device consisting of two masses connected by a string over a pulley, used to study Newton''s second law."}
    ]'::jsonb,
    40, false)
  ON CONFLICT (textbook_id, chapter_number) DO NOTHING;

  -- Chapter 5: Work, Energy, and Power
  INSERT INTO textbook_chapters (tenant_id, textbook_id, chapter_number, title, slug, description, content, key_terms, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, 5, 'Work, Energy, and Power', 'work-energy-power',
    'Understand work, kinetic energy, potential energy, the work-energy theorem, conservation of energy, and power.',
    '[
      {"type": "heading", "content": "Work, Energy, and Power", "level": 1},
      {"type": "text", "content": "Energy is one of the most important concepts in all of physics. Every process in nature — from a grain truck accelerating on a Saskatchewan highway to the nuclear reactions inside the Sun — involves energy transfer or transformation. In this chapter we develop precise definitions of work, kinetic energy, gravitational potential energy, and power, and discover the remarkable principle that total mechanical energy is conserved when only conservative forces do work."},
      {"type": "heading", "content": "Work", "level": 2},
      {"type": "text", "content": "In physics, work has a specific meaning: work is done when a force causes a displacement. The work done by a constant force is W = F * d * cos(theta), where F is the magnitude of the force, d is the magnitude of the displacement, and theta is the angle between the force and the displacement vectors. Work is measured in joules (J), where 1 J = 1 N * 1 m. If the force is perpendicular to the displacement (theta = 90 degrees), no work is done. If the force opposes the displacement (theta between 90 and 180 degrees), the work is negative."},
      {"type": "callout", "content": "Worked Example: A farmhand pulls a 40 kg feed cart 12 m across a barn floor with a rope that makes a 25-degree angle above the horizontal. The tension in the rope is 150 N. How much work does the tension do?\n\nW = F * d * cos(theta) = 150 * 12 * cos(25 degrees)\nW = 150 * 12 * 0.9063\nW = 1631 J\n\nThe tension does approximately 1630 J of work on the cart.", "style": "example"},
      {"type": "heading", "content": "Kinetic Energy and the Work-Energy Theorem", "level": 2},
      {"type": "text", "content": "Kinetic energy is the energy an object possesses due to its motion, defined as E_k = (1/2)*m*v^2. The work-energy theorem states that the net work done on an object equals the change in its kinetic energy: W_net = delta-E_k = (1/2)*m*v_f^2 - (1/2)*m*v_i^2. This theorem connects the force-based description of motion (dynamics) with the energy-based description."},
      {"type": "heading", "content": "Gravitational Potential Energy and Conservation", "level": 2},
      {"type": "text", "content": "Gravitational potential energy is the energy stored in an object due to its height above a reference level: E_p = m*g*h. As an object falls, its potential energy decreases and its kinetic energy increases. When only gravity does work (no friction or air resistance), the total mechanical energy E_total = E_k + E_p remains constant. This is the law of conservation of mechanical energy. It allows us to solve problems that would be very difficult using forces alone."},
      {"type": "callout", "content": "Worked Example: A 60 kg skier starts from rest at the top of a 20 m high hill at Table Mountain near North Battleford. Neglecting friction, what is her speed at the bottom?\n\nConservation of energy: E_k(top) + E_p(top) = E_k(bottom) + E_p(bottom)\n0 + m*g*h = (1/2)*m*v^2 + 0\nm*g*h = (1/2)*m*v^2\nv^2 = 2*g*h = 2 * 9.81 * 20 = 392.4\nv = 19.8 m/s\n\nNotice the mass cancels — the speed at the bottom is independent of the skier''s mass.", "style": "example"},
      {"type": "heading", "content": "Power", "level": 2},
      {"type": "text", "content": "Power is the rate at which work is done or energy is transferred: P = W / t, measured in watts (W), where 1 W = 1 J/s. An equivalent formula for an object moving at constant velocity is P = F * v. A motor that does the same amount of work in less time has a higher power output. Saskatchewan''s wind turbines near Swift Current convert kinetic energy of moving air into electrical energy, with each turbine rated at several megawatts of power."},
      {"type": "callout", "content": "Tip: When an exam question asks about speed at a certain height and does not provide time information, conservation of energy is almost always faster and simpler than using kinematic equations. Save kinematics for problems that specifically ask about time.", "style": "tip"},
      {"type": "quiz", "question": "A 2.0 kg ball is dropped from a height of 10 m. Using conservation of energy, what is its speed just before hitting the ground? (g = 9.8 m/s^2)", "options": ["14 m/s", "10 m/s", "20 m/s", "196 m/s"], "correct": 0, "explanation": "m*g*h = (1/2)*m*v^2, so v = sqrt(2*g*h) = sqrt(2*9.8*10) = sqrt(196) = 14 m/s."},
      {"type": "quiz", "question": "An engine does 24 000 J of work in 8.0 seconds. What is its power output?", "options": ["3000 W", "192 000 W", "3.0 W", "300 W"], "correct": 0, "explanation": "P = W/t = 24000/8.0 = 3000 W, or 3.0 kW."}
    ]'::jsonb,
    '[
      {"term": "Work", "definition": "The product of the component of force in the direction of displacement and the magnitude of the displacement. Measured in joules."},
      {"term": "Joule", "definition": "The SI unit of energy and work, equal to one newton-metre (1 J = 1 N*m)."},
      {"term": "Kinetic Energy", "definition": "The energy of an object due to its motion, equal to (1/2)*m*v^2."},
      {"term": "Gravitational Potential Energy", "definition": "The energy stored in an object due to its height above a reference point, equal to m*g*h."},
      {"term": "Work-Energy Theorem", "definition": "The net work done on an object equals the change in its kinetic energy."},
      {"term": "Conservation of Energy", "definition": "In an isolated system, the total energy remains constant; energy can change form but cannot be created or destroyed."},
      {"term": "Mechanical Energy", "definition": "The sum of kinetic energy and potential energy in a system."},
      {"term": "Power", "definition": "The rate at which work is done or energy is transferred, measured in watts (W)."},
      {"term": "Watt", "definition": "The SI unit of power, equal to one joule per second (1 W = 1 J/s)."}
    ]'::jsonb,
    40, false)
  ON CONFLICT (textbook_id, chapter_number) DO NOTHING;

  -- Chapter 6: Thermal Energy and Heat Transfer
  INSERT INTO textbook_chapters (tenant_id, textbook_id, chapter_number, title, slug, description, content, key_terms, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, 6, 'Thermal Energy and Heat Transfer', 'thermal-energy-heat-transfer',
    'Investigate temperature, thermal energy, specific heat capacity, phase changes, and calorimetry.',
    '[
      {"type": "heading", "content": "Thermal Energy and Heat Transfer", "level": 1},
      {"type": "text", "content": "Saskatchewan experiences some of the most dramatic temperature swings on the planet — from minus 40 degrees Celsius in January to plus 35 degrees Celsius in July. Understanding thermal energy and heat transfer is essential for designing homes that stay warm in winter, choosing materials for outdoor infrastructure, and appreciating the physics behind weather patterns on the prairies."},
      {"type": "text", "content": "Temperature is a measure of the average kinetic energy of the particles in a substance. It is not the same as thermal energy. A cup of boiling water and a large lake at 20 degrees Celsius contain very different amounts of thermal energy, even though the cup is at a higher temperature. Thermal energy depends on both the average kinetic energy per particle (temperature) and the total number of particles."},
      {"type": "callout", "content": "Heat is the transfer of thermal energy from a warmer object to a cooler object. Heat flows spontaneously from high temperature to low temperature and continues until thermal equilibrium is reached — the point where both objects are at the same temperature. Heat is measured in joules (J).", "style": "info"},
      {"type": "heading", "content": "Specific Heat Capacity", "level": 2},
      {"type": "text", "content": "Different materials require different amounts of energy to raise their temperature. The specific heat capacity (c) of a substance is the amount of energy needed to raise the temperature of 1 kg of that substance by 1 degree Celsius. Water has an unusually high specific heat capacity of 4186 J/(kg*C), which is why lakes moderate the climate of nearby areas. The formula for heat transfer is Q = m * c * delta-T, where Q is the heat energy in joules, m is the mass in kilograms, c is the specific heat capacity, and delta-T is the change in temperature."},
      {"type": "callout", "content": "Worked Example: How much energy is needed to heat 2.5 kg of water from 15 degrees C to 85 degrees C for a pot of tea?\n\nQ = m * c * delta-T\nQ = 2.5 * 4186 * (85 - 15)\nQ = 2.5 * 4186 * 70\nQ = 732 550 J\nQ = 733 kJ\n\nIt takes approximately 733 kJ to heat the water.", "style": "example"},
      {"type": "heading", "content": "Phase Changes", "level": 2},
      {"type": "text", "content": "When a substance changes phase — from solid to liquid (melting), liquid to gas (vaporization), or the reverse — energy is absorbed or released without a change in temperature. The energy required to melt a substance is Q = m * L_f, where L_f is the latent heat of fusion. The energy required to vaporize it is Q = m * L_v, where L_v is the latent heat of vaporization. For water, L_f = 334 000 J/kg and L_v = 2 260 000 J/kg. The enormous latent heat of vaporization explains why steam burns are so severe — the steam releases a huge amount of energy as it condenses on skin."},
      {"type": "heading", "content": "Calorimetry", "level": 2},
      {"type": "text", "content": "Calorimetry is the experimental technique of measuring heat transfer. The principle is simple: when a hot object is placed in contact with a cold object inside an insulated container (a calorimeter), the heat lost by the hot object equals the heat gained by the cold object, assuming no heat escapes to the surroundings. This gives us the equation Q_lost = Q_gained, or m_1 * c_1 * delta-T_1 = m_2 * c_2 * delta-T_2. This method is used to determine the specific heat capacity of unknown materials."},
      {"type": "callout", "content": "Tip: In calorimetry problems, always define delta-T as a positive number by subtracting the lower temperature from the higher temperature for each object. Then set Q_lost = Q_gained. This avoids sign errors that are common when using delta-T = T_final - T_initial for both objects.", "style": "tip"},
      {"type": "quiz", "question": "A 0.50 kg block of copper (c = 386 J/(kg*C)) at 200 degrees C is dropped into 1.0 kg of water at 20 degrees C in an insulated container. Which statement is correct at thermal equilibrium?", "options": ["The final temperature will be closer to 20 degrees C than to 200 degrees C because water has a much higher specific heat capacity", "The final temperature will be 110 degrees C, exactly halfway", "The copper will cool to 20 degrees C because metal always matches the water temperature", "The water and copper will reach different final temperatures"], "correct": 0, "explanation": "Water''s specific heat (4186) is more than ten times copper''s (386), and there is twice as much mass of water. The water''s temperature will change only slightly, while the copper''s temperature drops significantly. The equilibrium temperature will be much closer to 20 degrees C."},
      {"type": "quiz", "question": "How much energy is required to completely melt 0.30 kg of ice at 0 degrees C? (L_f = 334 000 J/kg)", "options": ["100 200 J", "334 000 J", "1 002 000 J", "55 700 J"], "correct": 0, "explanation": "Q = m * L_f = 0.30 * 334 000 = 100 200 J. No temperature change occurs during the phase transition."}
    ]'::jsonb,
    '[
      {"term": "Temperature", "definition": "A measure of the average kinetic energy of the particles in a substance, measured in degrees Celsius or kelvins."},
      {"term": "Thermal Energy", "definition": "The total kinetic energy of all particles in a substance, depending on both temperature and the number of particles."},
      {"term": "Heat", "definition": "The transfer of thermal energy from a warmer object to a cooler object, measured in joules."},
      {"term": "Specific Heat Capacity", "definition": "The amount of energy required to raise the temperature of 1 kg of a substance by 1 degree Celsius."},
      {"term": "Thermal Equilibrium", "definition": "The state reached when two objects in thermal contact reach the same temperature and heat transfer stops."},
      {"term": "Latent Heat of Fusion", "definition": "The energy required to change 1 kg of a substance from solid to liquid at its melting point, without changing temperature."},
      {"term": "Latent Heat of Vaporization", "definition": "The energy required to change 1 kg of a substance from liquid to gas at its boiling point, without changing temperature."},
      {"term": "Calorimetry", "definition": "The experimental measurement of heat transfer, typically using an insulated container called a calorimeter."},
      {"term": "Phase Change", "definition": "A transition of matter from one state (solid, liquid, gas) to another, occurring at constant temperature."}
    ]'::jsonb,
    35, false)
  ON CONFLICT (textbook_id, chapter_number) DO NOTHING;

  -- Chapter 7: Waves — Properties and Behaviour
  INSERT INTO textbook_chapters (tenant_id, textbook_id, chapter_number, title, slug, description, content, key_terms, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, 7, 'Waves: Properties and Behaviour', 'waves-properties-behaviour',
    'Explore the fundamental properties of waves including frequency, wavelength, amplitude, and the universal wave equation.',
    '[
      {"type": "heading", "content": "Waves: Properties and Behaviour", "level": 1},
      {"type": "text", "content": "Drop a pebble into a still prairie slough and watch the ripples spread outward in expanding circles. Those ripples are waves — disturbances that transfer energy from one place to another without transferring matter. The water molecules bob up and down, but they do not travel outward with the ripple. Understanding waves is essential because they underpin sound, light, radio communication, medical imaging, and countless other technologies."},
      {"type": "text", "content": "Waves fall into two broad categories based on the direction of particle vibration relative to wave travel. In a transverse wave, particles vibrate perpendicular to the direction the wave moves — like shaking a rope side to side. In a longitudinal wave, particles vibrate parallel to the wave''s direction of travel — like compressing and stretching a spring. Water surface waves are actually a combination of both types."},
      {"type": "callout", "content": "Key wave measurements:\n\nAmplitude (A): The maximum displacement of a particle from its rest position. Measured in metres.\nWavelength (lambda): The distance between two consecutive identical points on a wave (e.g., crest to crest). Measured in metres.\nFrequency (f): The number of complete wave cycles passing a point per second. Measured in hertz (Hz).\nPeriod (T): The time for one complete wave cycle. T = 1/f. Measured in seconds.", "style": "info"},
      {"type": "heading", "content": "The Universal Wave Equation", "level": 2},
      {"type": "text", "content": "The speed of any wave is related to its frequency and wavelength by the universal wave equation: v = f * lambda. This equation applies to all types of waves — mechanical and electromagnetic. If you know any two of the three quantities (speed, frequency, wavelength), you can calculate the third. The speed of a wave is determined by the medium through which it travels, not by the frequency or amplitude of the wave."},
      {"type": "callout", "content": "Worked Example: A radio station in Regina broadcasts at a frequency of 620 kHz. Radio waves travel at the speed of light, 3.0 x 10^8 m/s. What is the wavelength of the broadcast?\n\nv = f * lambda, so lambda = v / f\nlambda = (3.0 x 10^8 m/s) / (620 x 10^3 Hz)\nlambda = (3.0 x 10^8) / (6.20 x 10^5)\nlambda = 484 m\n\nThe wavelength is approximately 484 metres.", "style": "example"},
      {"type": "heading", "content": "Wave Behaviours", "level": 2},
      {"type": "text", "content": "When waves encounter boundaries or obstacles, they exhibit characteristic behaviours. Reflection occurs when a wave bounces off a barrier — the angle of incidence equals the angle of reflection. Refraction is the bending of a wave as it passes from one medium to another at an angle, caused by a change in wave speed. Diffraction is the bending of waves around obstacles or through openings. Interference occurs when two waves overlap: constructive interference produces a larger amplitude where crests meet crests, and destructive interference reduces amplitude where crests meet troughs."},
      {"type": "callout", "content": "Tip: Frequency does not change when a wave passes from one medium to another. The speed changes, and the wavelength adjusts accordingly (v = f * lambda). This is why refraction occurs — the change in speed at an angle causes the wave to bend.", "style": "tip"},
      {"type": "quiz", "question": "A wave has a frequency of 50 Hz and a wavelength of 0.40 m. What is its speed?", "options": ["20 m/s", "125 m/s", "0.008 m/s", "50.4 m/s"], "correct": 0, "explanation": "v = f * lambda = 50 * 0.40 = 20 m/s."},
      {"type": "quiz", "question": "When two identical waves meet so that the crest of one aligns with the trough of the other, the result is:", "options": ["Destructive interference — the waves cancel", "Constructive interference — the amplitude doubles", "Refraction — the waves change direction", "Diffraction — the waves bend around each other"], "correct": 0, "explanation": "When a crest meets a trough of equal amplitude, they cancel each other out. This is complete destructive interference."}
    ]'::jsonb,
    '[
      {"term": "Wave", "definition": "A disturbance that transfers energy through a medium or space without transferring matter."},
      {"term": "Transverse Wave", "definition": "A wave in which the particles of the medium vibrate perpendicular to the direction of wave travel."},
      {"term": "Longitudinal Wave", "definition": "A wave in which the particles of the medium vibrate parallel to the direction of wave travel."},
      {"term": "Amplitude", "definition": "The maximum displacement of a particle from its rest (equilibrium) position in a wave."},
      {"term": "Wavelength", "definition": "The distance between two consecutive identical points on a wave, such as crest to crest, measured in metres."},
      {"term": "Frequency", "definition": "The number of complete wave cycles passing a given point per second, measured in hertz (Hz)."},
      {"term": "Period", "definition": "The time required for one complete wave cycle, equal to the reciprocal of frequency (T = 1/f)."},
      {"term": "Universal Wave Equation", "definition": "The relationship v = f * lambda, connecting wave speed, frequency, and wavelength."},
      {"term": "Interference", "definition": "The phenomenon that occurs when two or more waves overlap, resulting in constructive or destructive combination."}
    ]'::jsonb,
    35, false)
  ON CONFLICT (textbook_id, chapter_number) DO NOTHING;

  -- Chapter 8: Sound Waves
  INSERT INTO textbook_chapters (tenant_id, textbook_id, chapter_number, title, slug, description, content, key_terms, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, 8, 'Sound Waves', 'sound-waves',
    'Study sound as a longitudinal mechanical wave, including its production, propagation, resonance, and the Doppler effect.',
    '[
      {"type": "heading", "content": "Sound Waves", "level": 1},
      {"type": "text", "content": "Sound is a longitudinal mechanical wave produced by vibrating objects. When a guitar string vibrates, it alternately compresses and rarefies the surrounding air, creating pressure variations that propagate outward at the speed of sound. These pressure waves enter your ear, cause your eardrum to vibrate, and your brain interprets the vibrations as sound. Because sound is a mechanical wave, it requires a medium — it cannot travel through a vacuum."},
      {"type": "text", "content": "The speed of sound depends on the medium and its temperature. In dry air at 20 degrees Celsius, sound travels at approximately 343 m/s. Sound travels faster in warmer air because the molecules move more quickly and transmit the pressure disturbance more rapidly. A useful approximation is v = 331 + 0.6*T, where T is the air temperature in degrees Celsius. In Saskatchewan''s winter at minus 30 degrees C, the speed of sound drops to about 313 m/s."},
      {"type": "callout", "content": "Properties of sound:\n\nPitch is determined by frequency. High-frequency vibrations produce high-pitched sounds. Human hearing ranges from about 20 Hz to 20 000 Hz.\n\nLoudness is related to amplitude. Greater amplitude means louder sound. Loudness is measured in decibels (dB).\n\nTimbre (quality) depends on the combination of frequencies produced. It is why a piano and a trumpet sound different even when playing the same note.", "style": "info"},
      {"type": "heading", "content": "Resonance", "level": 2},
      {"type": "text", "content": "Every object has natural frequencies at which it tends to vibrate. When an external vibration matches an object''s natural frequency, the amplitude of vibration builds up dramatically — this is resonance. Musical instruments exploit resonance: an air column in a flute resonates at specific frequencies determined by its length and whether the ends are open or closed. Standing waves form inside the instrument when the wavelength fits the column length in just the right way."},
      {"type": "text", "content": "For a tube open at both ends, resonant wavelengths satisfy the condition L = n * lambda / 2, where n = 1, 2, 3, and so on. For a tube closed at one end, only odd harmonics are present: L = n * lambda / 4, where n = 1, 3, 5, and so on. The fundamental frequency (n = 1) produces the lowest pitch."},
      {"type": "callout", "content": "Worked Example: A closed-end organ pipe is 0.85 m long. What is the fundamental frequency of the sound it produces at 20 degrees C?\n\nFor a closed pipe, the fundamental satisfies: L = lambda / 4, so lambda = 4 * L = 4 * 0.85 = 3.40 m.\nSpeed of sound at 20 degrees C: v = 343 m/s.\nf = v / lambda = 343 / 3.40 = 100.9 Hz.\n\nThe fundamental frequency is approximately 101 Hz.", "style": "example"},
      {"type": "heading", "content": "The Doppler Effect", "level": 2},
      {"type": "text", "content": "You have likely noticed that the siren of an approaching ambulance sounds higher pitched, then drops in pitch as it passes you and moves away. This is the Doppler effect — the apparent change in frequency (and therefore pitch) caused by relative motion between the source of sound and the observer. When the source approaches, the wavefronts are compressed, increasing the observed frequency. When the source recedes, the wavefronts are stretched, decreasing the observed frequency."},
      {"type": "callout", "content": "Tip: The Doppler effect applies to all waves, not just sound. Police radar guns use the Doppler effect with radio waves to measure vehicle speeds on Saskatchewan highways. Astronomers use the Doppler shift of light to determine whether stars and galaxies are moving toward or away from Earth.", "style": "tip"},
      {"type": "quiz", "question": "At what temperature does sound travel at approximately 331 m/s in air?", "options": ["0 degrees Celsius", "20 degrees Celsius", "100 degrees Celsius", "-10 degrees Celsius"], "correct": 0, "explanation": "Using v = 331 + 0.6*T: at T = 0 degrees C, v = 331 + 0 = 331 m/s exactly."},
      {"type": "quiz", "question": "A train approaches a crossing, sounding its horn. An observer at the crossing notices that the pitch is higher than normal. This is because:", "options": ["The wavefronts are compressed ahead of the moving source, increasing the frequency", "The train horn vibrates faster when the train is moving", "Sound travels faster when the source is moving", "The observer''s ears are more sensitive to approaching sounds"], "correct": 0, "explanation": "The Doppler effect compresses wavefronts in front of a moving source, resulting in a shorter wavelength and higher observed frequency (higher pitch)."}
    ]'::jsonb,
    '[
      {"term": "Sound Wave", "definition": "A longitudinal mechanical wave consisting of compressions and rarefactions that propagates through a medium."},
      {"term": "Compression", "definition": "A region in a longitudinal wave where particles are pushed closer together, creating higher pressure."},
      {"term": "Rarefaction", "definition": "A region in a longitudinal wave where particles are spread farther apart, creating lower pressure."},
      {"term": "Pitch", "definition": "The perceived highness or lowness of a sound, determined by the frequency of the sound wave."},
      {"term": "Resonance", "definition": "The dramatic increase in amplitude that occurs when a vibration matches the natural frequency of an object or system."},
      {"term": "Standing Wave", "definition": "A wave pattern that appears to remain stationary, produced by the interference of two identical waves travelling in opposite directions."},
      {"term": "Harmonic", "definition": "A frequency that is a whole-number multiple of the fundamental frequency of a vibrating system."},
      {"term": "Doppler Effect", "definition": "The apparent change in the frequency of a wave due to relative motion between the source and the observer."},
      {"term": "Decibel", "definition": "A logarithmic unit (dB) used to measure the intensity or loudness of sound."}
    ]'::jsonb,
    35, false)
  ON CONFLICT (textbook_id, chapter_number) DO NOTHING;

  -- Chapter 9: Light and Optics
  INSERT INTO textbook_chapters (tenant_id, textbook_id, chapter_number, title, slug, description, content, key_terms, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, 9, 'Light and Optics', 'light-and-optics',
    'Study the behaviour of light including reflection, refraction, Snell''s law, total internal reflection, and image formation by mirrors and lenses.',
    '[
      {"type": "heading", "content": "Light and Optics", "level": 1},
      {"type": "text", "content": "Light is an electromagnetic wave that travels at 3.00 x 10^8 m/s in a vacuum — the fastest speed in the universe. Unlike sound, light does not require a medium and can travel through the void of space. The study of how light behaves when it reflects off surfaces, passes through materials, and forms images is called optics. Optics is the physics behind eyeglasses, cameras, telescopes, fibre-optic internet cables, and the spectacular displays of the aurora borealis visible across northern Saskatchewan."},
      {"type": "heading", "content": "Reflection", "level": 2},
      {"type": "text", "content": "When light strikes a smooth surface, it bounces off in a predictable way described by the law of reflection: the angle of incidence equals the angle of reflection, and the incident ray, reflected ray, and normal line all lie in the same plane. Both angles are measured from the normal — a line perpendicular to the surface at the point where the light strikes. Smooth surfaces produce specular (regular) reflection, giving clear images like a mirror. Rough surfaces produce diffuse reflection, scattering light in many directions."},
      {"type": "callout", "content": "Curved mirrors form images by reflection. A concave mirror (curved inward like a bowl) can produce real, inverted images or virtual, upright magnified images depending on where the object is placed. The mirror equation is 1/f = 1/d_o + 1/d_i, where f is the focal length, d_o is the object distance, and d_i is the image distance. Magnification is M = -d_i / d_o.", "style": "info"},
      {"type": "heading", "content": "Refraction and Snell''s Law", "level": 2},
      {"type": "text", "content": "When light passes from one transparent material into another at an angle, it changes speed and bends — this is refraction. Snell''s law quantifies the bending: n_1 * sin(theta_1) = n_2 * sin(theta_2), where n is the index of refraction of each material and theta is the angle measured from the normal. The index of refraction is the ratio of the speed of light in a vacuum to the speed of light in the material: n = c / v. A higher index means slower light and more bending."},
      {"type": "callout", "content": "Worked Example: A beam of light in air (n = 1.00) strikes a glass surface (n = 1.52) at an angle of incidence of 35 degrees. What is the angle of refraction?\n\nSnell''s law: n_1 * sin(theta_1) = n_2 * sin(theta_2)\n1.00 * sin(35) = 1.52 * sin(theta_2)\n0.5736 = 1.52 * sin(theta_2)\nsin(theta_2) = 0.5736 / 1.52 = 0.3774\ntheta_2 = arcsin(0.3774) = 22.2 degrees\n\nThe light bends toward the normal as it enters the denser glass.", "style": "example"},
      {"type": "heading", "content": "Total Internal Reflection and Lenses", "level": 2},
      {"type": "text", "content": "When light passes from a denser medium to a less dense medium (e.g., glass to air), it bends away from the normal. At a specific angle called the critical angle, the refracted ray travels along the surface. Beyond the critical angle, no refraction occurs — all light reflects back into the denser medium. This total internal reflection is the principle behind fibre optics and the sparkle of diamonds."},
      {"type": "text", "content": "Lenses use refraction to form images. A converging (convex) lens brings parallel rays to a focal point and can form real or virtual images. A diverging (concave) lens spreads parallel rays apart and always forms virtual, upright, reduced images. The thin lens equation is identical in form to the mirror equation: 1/f = 1/d_o + 1/d_i. Saskatchewan''s Canadian Light Source synchrotron in Saskatoon uses sophisticated optics to focus intense beams of light for scientific research."},
      {"type": "callout", "content": "Tip: Use the sign conventions consistently. For mirrors: d_o is positive (real object), d_i is positive for real images (same side as object for mirrors). For lenses: d_i is positive for real images (opposite side from the object). Focal length is positive for converging mirrors/lenses and negative for diverging ones.", "style": "tip"},
      {"type": "quiz", "question": "A light ray passes from water (n = 1.33) into air (n = 1.00) at an angle of incidence of 30 degrees. What is the angle of refraction?", "options": ["41.7 degrees", "22.1 degrees", "30 degrees", "48.6 degrees"], "correct": 0, "explanation": "Using Snell''s law: n_1*sin(theta_1) = n_2*sin(theta_2). 1.33*sin(30) = 1.00*sin(theta_2). sin(theta_2) = 1.33*0.500 = 0.665. theta_2 = arcsin(0.665) = 41.7 degrees. The light bends away from the normal as it enters the less dense air."},
      {"type": "quiz", "question": "Which of the following correctly describes total internal reflection?", "options": ["It occurs when light travels from a denser medium to a less dense medium at an angle greater than the critical angle", "It occurs whenever light hits a mirror", "It only works with laser light", "It occurs when light travels from a less dense medium to a denser medium"], "correct": 0, "explanation": "Total internal reflection requires light to travel from a denser medium (higher n) to a less dense medium (lower n) and to strike the boundary at an angle exceeding the critical angle."}
    ]'::jsonb,
    '[
      {"term": "Reflection", "definition": "The bouncing of a wave off a surface, governed by the law of reflection where the angle of incidence equals the angle of reflection."},
      {"term": "Refraction", "definition": "The bending of a wave as it passes from one medium to another, caused by a change in wave speed."},
      {"term": "Index of Refraction", "definition": "A dimensionless number (n) representing the ratio of the speed of light in a vacuum to the speed of light in a given material."},
      {"term": "Snell''s Law", "definition": "The relationship n_1*sin(theta_1) = n_2*sin(theta_2) governing the bending of light during refraction."},
      {"term": "Critical Angle", "definition": "The angle of incidence beyond which total internal reflection occurs when light travels from a denser to a less dense medium."},
      {"term": "Total Internal Reflection", "definition": "The complete reflection of light at a boundary when the angle of incidence exceeds the critical angle."},
      {"term": "Converging Lens", "definition": "A lens that is thicker in the middle and brings parallel light rays together at a focal point."},
      {"term": "Diverging Lens", "definition": "A lens that is thinner in the middle and spreads parallel light rays apart."},
      {"term": "Focal Length", "definition": "The distance from the centre of a lens or mirror to its focal point."}
    ]'::jsonb,
    40, false)
  ON CONFLICT (textbook_id, chapter_number) DO NOTHING;

  -- Chapter 10: Introduction to Modern Physics
  INSERT INTO textbook_chapters (tenant_id, textbook_id, chapter_number, title, slug, description, content, key_terms, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, 10, 'Introduction to Modern Physics', 'introduction-modern-physics',
    'Discover the revolutionary ideas of quantum physics, the photoelectric effect, wave-particle duality, and an introduction to nuclear energy.',
    '[
      {"type": "heading", "content": "Introduction to Modern Physics", "level": 1},
      {"type": "text", "content": "By the end of the 1800s, many physicists believed that the major questions of physics had been answered. Classical mechanics, thermodynamics, and electromagnetism seemed to explain everything. Then, around 1900, a series of puzzling experimental results shattered that confidence and launched the era of modern physics. The discoveries that followed — quantum mechanics, relativity, and nuclear physics — transformed our understanding of the universe at its smallest and largest scales."},
      {"type": "text", "content": "One early puzzle was blackbody radiation — the spectrum of light emitted by a hot object. Classical theory predicted that a hot object should emit infinite energy at short wavelengths, a result called the ultraviolet catastrophe. In 1900, Max Planck resolved this by proposing that energy is not continuous but comes in discrete packets called quanta. The energy of each quantum is E = h * f, where h is Planck''s constant (6.63 x 10^-34 J*s) and f is the frequency of the radiation."},
      {"type": "callout", "content": "The idea that energy is quantized was revolutionary. It meant that atoms can only absorb or emit energy in specific amounts. This concept underpins all of modern physics, chemistry, and the technology we use daily — from LED lights to computer chips to the synchrotron at the Canadian Light Source in Saskatoon.", "style": "info"},
      {"type": "heading", "content": "The Photoelectric Effect", "level": 2},
      {"type": "text", "content": "When light shines on certain metal surfaces, electrons are ejected. This is the photoelectric effect. Classical wave theory predicted that brighter light should give the electrons more energy, regardless of colour. Experiments showed otherwise: below a certain threshold frequency, no electrons were ejected no matter how bright the light. Above the threshold, electrons were ejected immediately, and their maximum kinetic energy depended on the frequency of light, not its brightness."},
      {"type": "text", "content": "Albert Einstein explained this in 1905 by proposing that light consists of particles called photons, each carrying energy E = h * f. An electron is ejected only when a single photon has enough energy to overcome the work function (W) — the minimum energy needed to free an electron from the metal surface. The maximum kinetic energy of the ejected electron is E_k(max) = h*f - W. Einstein received the Nobel Prize for this explanation in 1921."},
      {"type": "callout", "content": "Worked Example: Ultraviolet light with a frequency of 1.2 x 10^15 Hz strikes a metal surface with a work function of 4.5 x 10^-19 J. What is the maximum kinetic energy of the ejected electrons?\n\nE_photon = h * f = (6.63 x 10^-34)(1.2 x 10^15) = 7.96 x 10^-19 J\nE_k(max) = E_photon - W = 7.96 x 10^-19 - 4.5 x 10^-19 = 3.46 x 10^-19 J\n\nThe maximum kinetic energy of the ejected electrons is 3.46 x 10^-19 J, or about 2.16 eV.", "style": "example"},
      {"type": "heading", "content": "Wave-Particle Duality and Nuclear Energy", "level": 2},
      {"type": "text", "content": "Modern physics reveals that light behaves as both a wave and a particle, depending on the experiment. This wave-particle duality extends to matter as well — electrons and other particles can exhibit wave-like behaviour, such as diffraction and interference. Louis de Broglie proposed that any particle with momentum p has an associated wavelength: lambda = h / p. This idea was confirmed experimentally and is foundational to electron microscopy and quantum mechanics."},
      {"type": "text", "content": "Einstein''s famous equation E = mc^2 shows that mass and energy are interchangeable. This principle underlies nuclear energy: when heavy atomic nuclei split (fission) or light nuclei combine (fusion), a small amount of mass is converted into an enormous amount of energy. Canada''s CANDU reactors use uranium fission to generate electricity, while fusion — the process powering the Sun — remains the goal of ongoing research at facilities worldwide."},
      {"type": "callout", "content": "Tip: The transition from classical to modern physics is not about classical physics being wrong — it is about recognizing its limitations. Classical physics works beautifully for everyday objects and speeds, but breaks down at the atomic scale and at speeds near the speed of light. Modern physics extends our framework to handle these extreme conditions.", "style": "tip"},
      {"type": "quiz", "question": "A photon has a frequency of 5.0 x 10^14 Hz. What is its energy? (h = 6.63 x 10^-34 J*s)", "options": ["3.3 x 10^-19 J", "7.5 x 10^47 J", "6.63 x 10^-34 J", "5.0 x 10^14 J"], "correct": 0, "explanation": "E = h*f = (6.63 x 10^-34)(5.0 x 10^14) = 3.315 x 10^-19 J, approximately 3.3 x 10^-19 J."},
      {"type": "quiz", "question": "In the photoelectric effect, increasing the intensity of light above the threshold frequency will:", "options": ["Increase the number of ejected electrons but not their maximum kinetic energy", "Increase the maximum kinetic energy of the ejected electrons", "Decrease the threshold frequency", "Have no effect at all"], "correct": 0, "explanation": "Intensity determines the number of photons hitting the surface per second, so more electrons are ejected. However, the maximum kinetic energy of each electron depends on the frequency of the individual photons, not the intensity."}
    ]'::jsonb,
    '[
      {"term": "Quantum", "definition": "The smallest discrete amount of energy that can be absorbed or emitted, proportional to the frequency of radiation."},
      {"term": "Photon", "definition": "A particle of light carrying energy E = h*f, where h is Planck''s constant and f is frequency."},
      {"term": "Planck''s Constant", "definition": "The fundamental constant h = 6.63 x 10^-34 J*s that relates the energy of a photon to its frequency."},
      {"term": "Photoelectric Effect", "definition": "The emission of electrons from a metal surface when light of sufficient frequency strikes it."},
      {"term": "Work Function", "definition": "The minimum energy required to free an electron from the surface of a metal."},
      {"term": "Threshold Frequency", "definition": "The minimum frequency of light needed to eject electrons from a metal in the photoelectric effect."},
      {"term": "Wave-Particle Duality", "definition": "The concept that light and matter exhibit both wave-like and particle-like properties depending on the experiment."},
      {"term": "de Broglie Wavelength", "definition": "The wavelength associated with a moving particle, given by lambda = h/p, where p is the particle''s momentum."},
      {"term": "Nuclear Fission", "definition": "The splitting of a heavy atomic nucleus into lighter nuclei, releasing a large amount of energy."},
      {"term": "Nuclear Fusion", "definition": "The combining of light atomic nuclei into a heavier nucleus, releasing energy. The process that powers stars."}
    ]'::jsonb,
    40, false)
  ON CONFLICT (textbook_id, chapter_number) DO NOTHING;

END $$;


-- ============================================================================
-- TEXTBOOK 2: WolfWhale Physics 30
-- Slug: wolfwhale-physics-30
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book UUID;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-physics-30';

  -- Chapter 1: Momentum and Impulse
  INSERT INTO textbook_chapters (tenant_id, textbook_id, chapter_number, title, slug, description, content, key_terms, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, 1, 'Momentum and Impulse', 'momentum-and-impulse',
    'Explore linear momentum, impulse, and the conservation of momentum in one-dimensional collisions and explosions.',
    '[
      {"type": "heading", "content": "Momentum and Impulse", "level": 1},
      {"type": "text", "content": "A fully loaded grain truck barrelling down Highway 1 near Moose Jaw is far harder to stop than a compact car travelling at the same speed. Your intuition tells you that the truck has more of something — and physics gives that something a name: momentum. Linear momentum is the product of an object''s mass and velocity: p = m * v. It is a vector quantity, having the same direction as the velocity, and is measured in kilogram-metres per second (kg*m/s)."},
      {"type": "text", "content": "Momentum is important because of its relationship to force and time. Newton''s second law can be rewritten as F_net = delta-p / delta-t — the net force on an object equals the rate of change of its momentum. Rearranging gives us the impulse-momentum theorem: F_net * delta-t = delta-p. The left side, force multiplied by the time interval over which it acts, is called impulse (J). Impulse equals the change in momentum."},
      {"type": "callout", "content": "Why do airbags save lives? When a car stops suddenly in a collision, the change in momentum of the passenger is the same whether the stop happens in 0.01 s (hitting the dashboard) or 0.15 s (inflating airbag). Since impulse = F * delta-t = delta-p, increasing the time interval reduces the average force on the passenger. Airbags, seatbelts, and crumple zones all work by extending the collision time.", "style": "info"},
      {"type": "heading", "content": "Conservation of Momentum", "level": 2},
      {"type": "text", "content": "In an isolated system — one where no external net force acts — the total momentum before an interaction equals the total momentum after. This is the law of conservation of momentum: p_total(before) = p_total(after), or m_1*v_1i + m_2*v_2i = m_1*v_1f + m_2*v_2f. This law applies to all interactions: collisions, explosions, recoil, and separations. It is one of the most fundamental principles in all of physics."},
      {"type": "callout", "content": "Worked Example: A 0.50 kg hockey puck sliding east at 8.0 m/s strikes a stationary 0.50 kg puck on a frictionless rink. After the collision, the first puck is at rest. What is the velocity of the second puck?\n\nConservation of momentum:\nm_1*v_1i + m_2*v_2i = m_1*v_1f + m_2*v_2f\n(0.50)(8.0) + (0.50)(0) = (0.50)(0) + (0.50)(v_2f)\n4.0 = 0.50 * v_2f\nv_2f = 8.0 m/s east\n\nThe second puck moves east at 8.0 m/s. All the momentum was transferred.", "style": "example"},
      {"type": "heading", "content": "Types of Collisions", "level": 2},
      {"type": "text", "content": "Collisions are classified by what happens to kinetic energy. In an elastic collision, both momentum and kinetic energy are conserved. The objects bounce off each other with no permanent deformation. In an inelastic collision, momentum is conserved but kinetic energy is not — some kinetic energy is transformed into heat, sound, or deformation. A perfectly inelastic collision is one where the objects stick together after colliding, losing the maximum amount of kinetic energy while still conserving momentum."},
      {"type": "callout", "content": "Tip: In one-dimensional collision problems, assign a positive direction first and keep it consistent. Objects moving in the positive direction have positive velocities; objects moving in the opposite direction have negative velocities. After solving, a negative answer for velocity means the object moves in the negative direction.", "style": "tip"},
      {"type": "quiz", "question": "A 2.0 kg cart moving at 3.0 m/s collides with and sticks to a 4.0 kg cart initially at rest. What is the velocity of the combined carts after the collision?", "options": ["1.0 m/s", "3.0 m/s", "1.5 m/s", "6.0 m/s"], "correct": 0, "explanation": "Using conservation of momentum: (2.0)(3.0) + (4.0)(0) = (2.0 + 4.0)(v_f). 6.0 = 6.0 * v_f. v_f = 1.0 m/s. This is a perfectly inelastic collision."},
      {"type": "quiz", "question": "A cannon (mass 500 kg) fires a 5.0 kg cannonball at 100 m/s. What is the recoil velocity of the cannon?", "options": ["1.0 m/s backward", "100 m/s backward", "10 m/s backward", "0.5 m/s backward"], "correct": 0, "explanation": "Initial total momentum is zero (both at rest). By conservation: 0 = m_ball*v_ball + m_cannon*v_cannon. 0 = (5.0)(100) + (500)(v_cannon). v_cannon = -500/500 = -1.0 m/s. The cannon recoils at 1.0 m/s in the opposite direction."}
    ]'::jsonb,
    '[
      {"term": "Linear Momentum", "definition": "The product of an object''s mass and velocity (p = mv), measured in kg*m/s. A vector quantity."},
      {"term": "Impulse", "definition": "The product of the net force acting on an object and the time interval over which it acts (J = F*delta-t), equal to the change in momentum."},
      {"term": "Impulse-Momentum Theorem", "definition": "The net impulse on an object equals its change in momentum: F*delta-t = delta-p."},
      {"term": "Conservation of Momentum", "definition": "In an isolated system, the total momentum before an interaction equals the total momentum after."},
      {"term": "Elastic Collision", "definition": "A collision in which both momentum and kinetic energy are conserved."},
      {"term": "Inelastic Collision", "definition": "A collision in which momentum is conserved but kinetic energy is not."},
      {"term": "Perfectly Inelastic Collision", "definition": "A collision in which the objects stick together after impact, losing the maximum possible kinetic energy."},
      {"term": "Isolated System", "definition": "A system on which no net external force acts, meaning total momentum is conserved."},
      {"term": "Recoil", "definition": "The backward motion of one object when it propels another forward, as required by conservation of momentum."}
    ]'::jsonb,
    35, false)
  ON CONFLICT (textbook_id, chapter_number) DO NOTHING;

  -- Chapter 2: Two-Dimensional Collisions
  INSERT INTO textbook_chapters (tenant_id, textbook_id, chapter_number, title, slug, description, content, key_terms, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, 2, 'Two-Dimensional Collisions', 'two-dimensional-collisions',
    'Extend conservation of momentum to two dimensions using vector components to analyze glancing collisions.',
    '[
      {"type": "heading", "content": "Two-Dimensional Collisions", "level": 1},
      {"type": "text", "content": "In chapter one, all collisions occurred along a single line. But most real collisions — a curling stone glancing off another on a Saskatchewan rink, billiard balls scattering across a table, or two vehicles colliding at a Saskatoon intersection — involve motion in two dimensions. The law of conservation of momentum still applies, but we must now apply it independently in two perpendicular directions."},
      {"type": "text", "content": "The strategy is to resolve all velocity vectors into x- and y-components, then apply conservation of momentum separately in each direction. If we define the initial velocity of the projectile along the x-axis, then the total initial y-momentum is zero (for a stationary target). After the collision, the x-components of momentum must still add up to the original x-momentum, and the y-components must still sum to zero."},
      {"type": "callout", "content": "For 2D collisions with a stationary target:\n\nConservation of x-momentum: m_1*v_1i = m_1*v_1f*cos(theta_1) + m_2*v_2f*cos(theta_2)\nConservation of y-momentum: 0 = m_1*v_1f*sin(theta_1) - m_2*v_2f*sin(theta_2)\n\nwhere theta_1 and theta_2 are the angles of the two objects relative to the original direction of motion after the collision.", "style": "info"},
      {"type": "heading", "content": "Glancing Collisions", "level": 2},
      {"type": "text", "content": "A glancing collision is one in which the objects do not hit head-on but at an angle, causing both to move off in different directions. The classic example is billiards: the cue ball strikes the target ball off-centre, and the two balls diverge at angles that depend on where the cue ball strikes the target ball. For an elastic collision between equal masses where one is initially stationary, the two objects always move off at 90 degrees to each other."},
      {"type": "callout", "content": "Worked Example: A 0.16 kg billiard ball moving at 4.0 m/s in the x-direction strikes a stationary 0.16 kg ball. After the collision, the first ball moves at 3.0 m/s at 40 degrees above the x-axis. Find the speed and direction of the second ball.\n\nSince the masses are equal, we can divide them out.\n\nx-momentum: 4.0 = 3.0*cos(40) + v_2f*cos(theta_2)\n4.0 = 3.0*0.766 + v_2f*cos(theta_2)\n4.0 = 2.298 + v_2f*cos(theta_2)\nv_2f*cos(theta_2) = 1.702  ... (i)\n\ny-momentum: 0 = 3.0*sin(40) - v_2f*sin(theta_2)\nv_2f*sin(theta_2) = 3.0*0.643 = 1.928  ... (ii)\n\nDivide (ii) by (i): tan(theta_2) = 1.928 / 1.702 = 1.133\ntheta_2 = arctan(1.133) = 48.6 degrees below the x-axis.\n\nFrom (i): v_2f = 1.702 / cos(48.6) = 1.702 / 0.660 = 2.58 m/s.\n\nThe second ball moves at 2.6 m/s at 49 degrees below the original direction.", "style": "example"},
      {"type": "heading", "content": "Energy Analysis in 2D", "level": 2},
      {"type": "text", "content": "After solving for the velocities in a 2D collision, you can check whether the collision is elastic by comparing the total kinetic energy before and after. If E_k(before) = E_k(after), the collision is elastic. If kinetic energy is lost, the collision is inelastic. The fraction of kinetic energy lost tells you how violent or deforming the collision was. Accident investigators use these principles to reconstruct vehicle collisions at Saskatchewan intersections by examining skid marks, final positions, and vehicle damage."},
      {"type": "callout", "content": "Tip: When solving 2D collision problems, always start by choosing a coordinate system and defining which direction is positive x and positive y. Draw a clear diagram showing all velocity vectors before and after the collision. This visual step prevents sign errors and helps you set up the component equations correctly.", "style": "tip"},
      {"type": "quiz", "question": "In a 2D collision between two equal-mass objects where one is initially stationary and the collision is perfectly elastic, the angle between the two objects after the collision is always:", "options": ["90 degrees", "180 degrees", "45 degrees", "It depends on the speeds"], "correct": 0, "explanation": "This is a well-known result in physics: for an elastic collision between equal masses with one initially at rest, the two objects always move off at right angles (90 degrees) to each other in two dimensions."},
      {"type": "quiz", "question": "Why must conservation of momentum be applied separately in the x- and y-directions for a 2D collision?", "options": ["Because momentum is a vector quantity, so each component is independently conserved", "Because energy is only conserved in one direction", "Because forces only act in the x-direction", "Because the objects can only move in straight lines"], "correct": 0, "explanation": "Momentum is a vector. The x-component and y-component of the total momentum are each independently conserved, giving us two equations to work with."}
    ]'::jsonb,
    '[
      {"term": "Two-Dimensional Collision", "definition": "A collision in which the objects move in a plane (two directions) rather than along a single line."},
      {"term": "Glancing Collision", "definition": "A collision in which the objects do not strike head-on, causing them to scatter at angles."},
      {"term": "Component", "definition": "The projection of a vector along a chosen axis, such as the x- or y-component of velocity."},
      {"term": "Vector Resolution", "definition": "The process of breaking a single vector into perpendicular components using trigonometry."},
      {"term": "Elastic Collision in 2D", "definition": "A two-dimensional collision in which both total momentum (by components) and total kinetic energy are conserved."},
      {"term": "Angle of Deflection", "definition": "The angle between an object''s final velocity and its original direction of motion after a collision."}
    ]'::jsonb,
    40, false)
  ON CONFLICT (textbook_id, chapter_number) DO NOTHING;

  -- Chapter 3: Gravitational Fields
  INSERT INTO textbook_chapters (tenant_id, textbook_id, chapter_number, title, slug, description, content, key_terms, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, 3, 'Gravitational Fields', 'gravitational-fields',
    'Study Newton''s law of universal gravitation, gravitational field strength, orbital mechanics, and satellite motion.',
    '[
      {"type": "heading", "content": "Gravitational Fields", "level": 1},
      {"type": "text", "content": "Every object with mass attracts every other object with mass. This universal attraction — gravity — holds galaxies together, keeps planets in orbit around stars, and anchors you to the surface of the Earth. In this chapter, we move beyond the simple g = 9.81 m/s^2 approximation and develop a full mathematical description of gravitational interactions between any two masses anywhere in the universe."},
      {"type": "text", "content": "Newton''s law of universal gravitation states that the gravitational force between two point masses is directly proportional to the product of their masses and inversely proportional to the square of the distance between their centres: F_g = G*m_1*m_2 / r^2, where G = 6.674 x 10^-11 N*m^2/kg^2 is the universal gravitational constant. This force is always attractive and acts along the line joining the two masses."},
      {"type": "callout", "content": "The gravitational field strength at a point in space is the gravitational force per unit mass experienced by a small test mass placed at that point: g = F_g / m = G*M / r^2, where M is the mass creating the field and r is the distance from the centre of M. On Earth''s surface, this gives the familiar g = 9.81 m/s^2. At higher altitudes, g decreases because r increases.", "style": "info"},
      {"type": "heading", "content": "Orbital Mechanics", "level": 2},
      {"type": "text", "content": "A satellite in orbit is constantly falling toward the Earth but moving forward fast enough that it keeps missing. The gravitational force provides the centripetal force needed for circular motion: G*M*m / r^2 = m*v^2 / r. Simplifying: v = sqrt(G*M / r). This orbital speed depends only on the mass of the central body (M) and the orbital radius (r), not on the mass of the satellite. Closer orbits require higher speeds."},
      {"type": "text", "content": "Kepler''s third law connects the orbital period T to the orbital radius r: T^2 = (4*pi^2 / (G*M)) * r^3. This relationship allows us to determine the mass of the central body by observing the orbit of a satellite. Canada''s RADARSAT satellites, used for monitoring Arctic ice, agriculture across Saskatchewan, and environmental changes, follow orbits precisely described by these equations."},
      {"type": "callout", "content": "Worked Example: The International Space Station orbits Earth at an altitude of 408 km. What is its orbital speed? (Earth''s mass M = 5.97 x 10^24 kg, Earth''s radius R = 6.37 x 10^6 m)\n\nOrbital radius: r = R + altitude = 6.37 x 10^6 + 0.408 x 10^6 = 6.778 x 10^6 m\n\nv = sqrt(G*M / r) = sqrt((6.674 x 10^-11)(5.97 x 10^24) / (6.778 x 10^6))\nv = sqrt(3.984 x 10^14 / 6.778 x 10^6)\nv = sqrt(5.877 x 10^7)\nv = 7667 m/s = 7.67 km/s\n\nThe ISS travels at approximately 7.67 km/s, completing one orbit every 92 minutes.", "style": "example"},
      {"type": "heading", "content": "Gravitational Potential Energy in Space", "level": 2},
      {"type": "text", "content": "Near Earth''s surface, we use E_p = m*g*h. But for objects far from Earth, we need the general expression: E_p = -G*M*m / r. The negative sign means that gravitational potential energy is zero at infinite distance and becomes more negative as the object approaches the mass. To escape Earth''s gravity entirely, an object must have enough kinetic energy to bring its total energy to zero or above. The escape speed is v_esc = sqrt(2*G*M / R), approximately 11.2 km/s for Earth."},
      {"type": "callout", "content": "Tip: A common mistake is to use the altitude above Earth''s surface as r in the gravitational equations. Remember: r is always the distance from the centre of the mass creating the field. For Earth orbits, r = R_Earth + altitude.", "style": "tip"},
      {"type": "quiz", "question": "If the distance between two masses is doubled, the gravitational force between them:", "options": ["Decreases to one-quarter of the original value", "Decreases to one-half of the original value", "Doubles", "Quadruples"], "correct": 0, "explanation": "F = G*m1*m2/r^2. If r doubles, the force becomes G*m1*m2/(2r)^2 = G*m1*m2/(4r^2) = F/4. Gravity follows an inverse-square law."},
      {"type": "quiz", "question": "A satellite orbits Earth at radius r with speed v. If moved to an orbit with radius 4r, its new speed would be:", "options": ["v/2", "v/4", "2v", "4v"], "correct": 0, "explanation": "Orbital speed v = sqrt(GM/r). At radius 4r: v_new = sqrt(GM/4r) = sqrt(GM/r) * 1/2 = v/2. Moving to a higher orbit means a slower orbital speed."}
    ]'::jsonb,
    '[
      {"term": "Universal Gravitation", "definition": "Newton''s law stating that every mass attracts every other mass with a force proportional to the product of their masses and inversely proportional to the square of the distance between them."},
      {"term": "Gravitational Constant", "definition": "The fundamental constant G = 6.674 x 10^-11 N*m^2/kg^2 in Newton''s law of universal gravitation."},
      {"term": "Gravitational Field Strength", "definition": "The force per unit mass at a point in a gravitational field, equal to g = GM/r^2."},
      {"term": "Orbital Speed", "definition": "The speed needed for an object to maintain a circular orbit at a given radius: v = sqrt(GM/r)."},
      {"term": "Kepler''s Third Law", "definition": "The square of the orbital period is proportional to the cube of the orbital radius: T^2 is proportional to r^3."},
      {"term": "Escape Speed", "definition": "The minimum speed needed for an object to escape the gravitational pull of a body: v_esc = sqrt(2GM/R)."},
      {"term": "Inverse-Square Law", "definition": "A relationship in which a quantity is inversely proportional to the square of the distance from its source."},
      {"term": "Centripetal Force", "definition": "The net inward force required to keep an object moving in a circular path."}
    ]'::jsonb,
    40, false)
  ON CONFLICT (textbook_id, chapter_number) DO NOTHING;

  -- Chapter 4: Electric Fields
  INSERT INTO textbook_chapters (tenant_id, textbook_id, chapter_number, title, slug, description, content, key_terms, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, 4, 'Electric Fields', 'electric-fields',
    'Investigate Coulomb''s law, electric field strength, electric potential difference, and the parallel plate capacitor.',
    '[
      {"type": "heading", "content": "Electric Fields", "level": 1},
      {"type": "text", "content": "Just as masses create gravitational fields, electric charges create electric fields. The study of electric fields is the foundation of all electrical technology — from the wiring in your home to the circuitry of your phone to the high-voltage power lines that carry electricity from hydroelectric dams along the Saskatchewan River to communities across the province."},
      {"type": "text", "content": "Electric charge comes in two types: positive and negative. Like charges repel each other; unlike charges attract. The SI unit of charge is the coulomb (C). The elementary charge — the magnitude of charge on a single proton or electron — is e = 1.602 x 10^-19 C. Charge is quantized (it comes only in whole-number multiples of e) and conserved (the total charge in an isolated system remains constant)."},
      {"type": "callout", "content": "Coulomb''s law gives the force between two point charges: F_e = k*q_1*q_2 / r^2, where k = 8.99 x 10^9 N*m^2/C^2 is Coulomb''s constant, q_1 and q_2 are the charges, and r is the distance between them. Notice the structural similarity to Newton''s law of gravitation — both are inverse-square laws. The key difference is that electric forces can be either attractive or repulsive.", "style": "info"},
      {"type": "heading", "content": "Electric Field Strength", "level": 2},
      {"type": "text", "content": "The electric field at a point in space is defined as the force per unit positive test charge placed at that point: E = F/q, measured in newtons per coulomb (N/C). For a point charge Q, the field strength at distance r is E = k*Q/r^2. Electric field lines are drawn outward from positive charges and inward toward negative charges. The density of field lines indicates the field strength — closer lines mean a stronger field."},
      {"type": "callout", "content": "Worked Example: Two charges are separated by 0.30 m. Charge A is +4.0 x 10^-6 C and charge B is -2.0 x 10^-6 C. What is the magnitude of the electric force between them?\n\nF = k*|q_1|*|q_2| / r^2\nF = (8.99 x 10^9)(4.0 x 10^-6)(2.0 x 10^-6) / (0.30)^2\nF = (8.99 x 10^9)(8.0 x 10^-12) / 0.09\nF = 71.92 x 10^-3 / 0.09\nF = 0.799 N\n\nThe force is approximately 0.80 N, attractive (since the charges are opposite).", "style": "example"},
      {"type": "heading", "content": "Electric Potential Difference and Capacitors", "level": 2},
      {"type": "text", "content": "Electric potential difference (voltage) is the work done per unit charge to move a charge between two points: V = W/q, measured in volts (V), where 1 V = 1 J/C. In a uniform electric field between parallel plates, the relationship is E = V/d, where V is the potential difference and d is the plate separation. This uniform field is the basis of parallel plate capacitors — devices that store charge and energy in circuits."},
      {"type": "text", "content": "A parallel plate capacitor consists of two conducting plates separated by an insulator. When connected to a battery, charge accumulates on the plates, creating a uniform electric field between them. The capacitance C = Q/V gives the ratio of stored charge to potential difference, measured in farads (F). The energy stored in a capacitor is E = (1/2)*C*V^2. Capacitors are essential components in electronics, camera flashes, and even the particle accelerators at the Canadian Light Source synchrotron in Saskatoon."},
      {"type": "callout", "content": "Tip: Electric potential (voltage) is a scalar quantity — it has magnitude but no direction. Electric field is a vector quantity — it has both magnitude and direction. A charge moves from high potential to low potential, and the electric field points in the direction of decreasing potential.", "style": "tip"},
      {"type": "quiz", "question": "If the charge on each plate of a parallel plate capacitor is doubled while the plate separation remains the same, the electric field between the plates:", "options": ["Doubles", "Stays the same", "Is halved", "Quadruples"], "correct": 0, "explanation": "The electric field between parallel plates is E = sigma/epsilon_0, where sigma is the surface charge density. Doubling the charge doubles sigma, which doubles E. Equivalently, doubling Q doubles V (since C is constant), and E = V/d doubles."},
      {"type": "quiz", "question": "Two point charges of +3.0 microcoulombs each are separated by 0.10 m. What is the electric force between them?", "options": ["8.1 N, repulsive", "8.1 N, attractive", "2.7 N, repulsive", "2.7 N, attractive"], "correct": 0, "explanation": "F = k*q1*q2/r^2 = (8.99e9)(3.0e-6)(3.0e-6)/(0.10)^2 = (8.99e9)(9.0e-12)/0.01 = 80.91e-3/0.01 = 8.1 N. Both charges are positive, so the force is repulsive."}
    ]'::jsonb,
    '[
      {"term": "Electric Charge", "definition": "A fundamental property of matter that exists in two types (positive and negative) and is measured in coulombs (C)."},
      {"term": "Coulomb''s Law", "definition": "The electrostatic force between two point charges is F = k*q1*q2/r^2, attractive for unlike charges and repulsive for like charges."},
      {"term": "Coulomb''s Constant", "definition": "The proportionality constant k = 8.99 x 10^9 N*m^2/C^2 in Coulomb''s law."},
      {"term": "Electric Field", "definition": "The force per unit positive test charge at a point in space, measured in N/C."},
      {"term": "Electric Potential Difference", "definition": "The work done per unit charge to move a charge between two points, measured in volts (V)."},
      {"term": "Capacitor", "definition": "A device consisting of two conductors separated by an insulator that stores electric charge and energy."},
      {"term": "Capacitance", "definition": "The ratio of the charge stored on a capacitor to the potential difference across it: C = Q/V, measured in farads (F)."},
      {"term": "Elementary Charge", "definition": "The magnitude of charge on a single proton or electron: e = 1.602 x 10^-19 C."},
      {"term": "Field Lines", "definition": "Visual representations of an electric field showing the direction a positive test charge would move. The density indicates field strength."}
    ]'::jsonb,
    40, false)
  ON CONFLICT (textbook_id, chapter_number) DO NOTHING;

  -- Chapter 5: Magnetic Fields
  INSERT INTO textbook_chapters (tenant_id, textbook_id, chapter_number, title, slug, description, content, key_terms, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, 5, 'Magnetic Fields', 'magnetic-fields',
    'Explore the nature of magnetic fields, forces on moving charges and current-carrying conductors, and applications of electromagnetism.',
    '[
      {"type": "heading", "content": "Magnetic Fields", "level": 1},
      {"type": "text", "content": "The shimmering green curtains of the aurora borealis — the northern lights — are a spectacular display of magnetism in action. Charged particles streaming from the Sun are captured and steered by Earth''s magnetic field toward the polar regions, where they collide with atmospheric gases and produce the glow. Saskatchewan''s northern communities witness this phenomenon regularly, a beautiful reminder that magnetic fields shape our environment in profound ways."},
      {"type": "text", "content": "Magnetic fields are produced by moving charges — whether electrons flowing through a wire or charged particles spiralling through space. Unlike electric charges, there are no isolated magnetic poles. Every magnet has both a north pole and a south pole, and field lines always form closed loops running from north to south outside the magnet and south to north inside it. The SI unit of magnetic field strength is the tesla (T)."},
      {"type": "callout", "content": "Key relationships for magnetic fields:\n\nForce on a moving charge: F = q*v*B*sin(theta), where q is the charge, v is the velocity, B is the magnetic field strength, and theta is the angle between v and B.\n\nForce on a current-carrying conductor: F = I*L*B*sin(theta), where I is the current, L is the length of conductor in the field.\n\nBoth forces are perpendicular to both the velocity (or current) and the magnetic field, following the right-hand rule.", "style": "info"},
      {"type": "heading", "content": "Force on a Moving Charge", "level": 2},
      {"type": "text", "content": "When a charged particle moves through a magnetic field, it experiences a force perpendicular to both its velocity and the field. This force does no work (it never speeds up or slows down the particle) but it changes the direction of motion. If the velocity is perpendicular to the field, the charge follows a circular path. The radius of this circular motion is r = m*v / (q*B). This principle is the operating basis of the cyclotron at TRIUMF in British Columbia and the synchrotron at the Canadian Light Source in Saskatoon — both use magnetic fields to bend charged particle beams into curved paths."},
      {"type": "callout", "content": "Worked Example: An electron (m = 9.11 x 10^-31 kg, q = 1.60 x 10^-19 C) moves at 2.0 x 10^6 m/s perpendicular to a magnetic field of 0.050 T. What is the radius of its circular path?\n\nr = m*v / (q*B)\nr = (9.11 x 10^-31)(2.0 x 10^6) / ((1.60 x 10^-19)(0.050))\nr = 1.822 x 10^-24 / 8.0 x 10^-21\nr = 2.28 x 10^-4 m\nr = 0.228 mm\n\nThe electron follows a tiny circle with radius 0.23 mm.", "style": "example"},
      {"type": "heading", "content": "Applications of Electromagnetism", "level": 2},
      {"type": "text", "content": "Electromagnetism is the basis of countless technologies. Electric motors convert electrical energy to mechanical energy using the force on current-carrying conductors in magnetic fields. Speakers use the same principle to vibrate a cone and produce sound. Magnetic resonance imaging (MRI) machines use powerful magnetic fields to create detailed images of the human body without radiation. Mass spectrometers separate ions by mass-to-charge ratio using magnetic deflection, with applications in chemistry, archaeology, and forensic science."},
      {"type": "callout", "content": "Tip: Use the right-hand rule to find the direction of the magnetic force on a positive charge. Point your fingers in the direction of v (velocity), curl them toward B (magnetic field), and your thumb points in the direction of the force F. For negative charges (like electrons), the force is in the opposite direction — use your left hand, or use the right-hand rule and flip the result.", "style": "tip"},
      {"type": "quiz", "question": "A proton moves eastward through a magnetic field directed northward. The magnetic force on the proton is directed:", "options": ["Upward (out of the ground)", "Downward (into the ground)", "Westward", "Southward"], "correct": 0, "explanation": "Using the right-hand rule: point fingers east (v), curl toward north (B). The thumb points upward. Since the proton is a positive charge, the force is upward."},
      {"type": "quiz", "question": "A 0.50 m wire carrying 3.0 A of current is placed perpendicular to a 0.20 T magnetic field. What is the force on the wire?", "options": ["0.30 N", "3.0 N", "0.10 N", "30 N"], "correct": 0, "explanation": "F = I*L*B*sin(theta) = (3.0)(0.50)(0.20)*sin(90) = 0.30 N. Since the wire is perpendicular to the field, sin(90) = 1."}
    ]'::jsonb,
    '[
      {"term": "Magnetic Field", "definition": "A region of space around a magnet or moving charge where magnetic forces are exerted, measured in tesla (T)."},
      {"term": "Tesla", "definition": "The SI unit of magnetic field strength, where 1 T = 1 kg/(A*s^2)."},
      {"term": "Right-Hand Rule", "definition": "A mnemonic for finding the direction of the magnetic force: point fingers along v, curl toward B, thumb gives force direction for positive charges."},
      {"term": "Magnetic Force on a Charge", "definition": "F = q*v*B*sin(theta), a force perpendicular to both the velocity and the magnetic field."},
      {"term": "Magnetic Force on a Conductor", "definition": "F = I*L*B*sin(theta), the force on a current-carrying wire in a magnetic field."},
      {"term": "Aurora Borealis", "definition": "The northern lights, caused by charged solar particles interacting with Earth''s magnetic field and atmospheric gases."},
      {"term": "Cyclotron Radius", "definition": "The radius of the circular path followed by a charged particle in a uniform magnetic field: r = mv/(qB)."},
      {"term": "Electric Motor", "definition": "A device that converts electrical energy to mechanical energy using forces on current-carrying conductors in magnetic fields."}
    ]'::jsonb,
    35, false)
  ON CONFLICT (textbook_id, chapter_number) DO NOTHING;

  -- Chapter 6: Electromagnetic Induction
  INSERT INTO textbook_chapters (tenant_id, textbook_id, chapter_number, title, slug, description, content, key_terms, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, 6, 'Electromagnetic Induction', 'electromagnetic-induction',
    'Understand Faraday''s law, Lenz''s law, and the principles behind generators and transformers.',
    '[
      {"type": "heading", "content": "Electromagnetic Induction", "level": 1},
      {"type": "text", "content": "In 1831, Michael Faraday discovered that a changing magnetic field can produce an electric current — a phenomenon called electromagnetic induction. This discovery is arguably the most important in the history of electrical technology: it is the principle behind every electrical generator, transformer, and induction charging pad in existence. Without electromagnetic induction, modern civilization as we know it — including the hydroelectric power that Saskatchewan generates along the North Saskatchewan River — would not be possible."},
      {"type": "text", "content": "The key quantity in electromagnetic induction is magnetic flux, defined as the product of the magnetic field strength, the area of the loop through which the field passes, and the cosine of the angle between the field and the normal to the loop: Phi = B*A*cos(theta). Magnetic flux is measured in webers (Wb), where 1 Wb = 1 T*m^2."},
      {"type": "callout", "content": "Faraday''s law of electromagnetic induction states that the induced electromotive force (EMF) in a loop is equal to the negative rate of change of magnetic flux through the loop:\n\nEMF = -N * delta-Phi / delta-t\n\nwhere N is the number of loops (turns) in the coil and delta-Phi / delta-t is the rate at which the flux changes. The negative sign indicates the direction of the induced EMF, as described by Lenz''s law.", "style": "info"},
      {"type": "heading", "content": "Lenz''s Law", "level": 2},
      {"type": "text", "content": "Lenz''s law provides the direction of the induced current: the induced current flows in a direction that opposes the change in magnetic flux that caused it. If the flux through a loop is increasing, the induced current creates a magnetic field opposing the increase. If the flux is decreasing, the induced current creates a field that tries to maintain the flux. Lenz''s law is a direct consequence of conservation of energy — if the induced current aided the change in flux, it would create a runaway effect that generates energy from nothing, violating energy conservation."},
      {"type": "callout", "content": "Worked Example: A circular coil of 200 turns with an area of 0.05 m^2 is placed in a magnetic field that changes uniformly from 0.30 T to 0 T in 0.10 seconds. What is the magnitude of the induced EMF?\n\ndelta-Phi = B_f*A - B_i*A = (0)(0.05) - (0.30)(0.05) = -0.015 Wb\nEMF = -N * delta-Phi / delta-t = -(200)(-0.015) / 0.10\nEMF = 200 * 0.015 / 0.10 = 30 V\n\nThe induced EMF is 30 volts.", "style": "example"},
      {"type": "heading", "content": "Generators and Transformers", "level": 2},
      {"type": "text", "content": "An electric generator is a device that converts mechanical energy into electrical energy using electromagnetic induction. A coil of wire rotates inside a magnetic field, and the continuously changing flux through the coil induces an alternating EMF. This is how Saskatchewan''s hydroelectric, wind, and natural gas power plants produce electricity. The frequency of the alternating current produced depends on the rotation speed: in Canada, generators rotate at speeds that produce 60 Hz AC."},
      {"type": "text", "content": "A transformer changes the voltage of alternating current. It consists of two coils (primary and secondary) wound around a shared iron core. When AC flows through the primary coil, the changing magnetic field induces an EMF in the secondary coil. The voltage ratio equals the turns ratio: V_s / V_p = N_s / N_p. Step-up transformers increase voltage (more secondary turns); step-down transformers decrease it. SaskPower uses transformers to step up voltage to 230 kV for efficient long-distance transmission across the province, then step it down to 120 V for household use."},
      {"type": "callout", "content": "Tip: For an ideal transformer, the power input equals the power output: V_p * I_p = V_s * I_s. This means that when a transformer steps up the voltage, the current decreases proportionally, and vice versa. Higher voltage and lower current reduces energy losses in power lines, which is why electricity is transmitted at very high voltages.", "style": "tip"},
      {"type": "quiz", "question": "A transformer has 500 turns in its primary coil and 2000 turns in its secondary coil. If the primary voltage is 120 V, what is the secondary voltage?", "options": ["480 V", "30 V", "120 V", "960 V"], "correct": 0, "explanation": "V_s/V_p = N_s/N_p, so V_s = V_p * (N_s/N_p) = 120 * (2000/500) = 120 * 4 = 480 V. This is a step-up transformer."},
      {"type": "quiz", "question": "According to Lenz''s law, if a magnet is pushed into a coil, the induced current will:", "options": ["Create a magnetic field that repels the magnet", "Create a magnetic field that attracts the magnet", "Flow in the same direction as the magnet moves", "Produce no magnetic field"], "correct": 0, "explanation": "Lenz''s law states that the induced current opposes the change that caused it. As the magnet approaches, the flux increases, so the induced current creates a field opposing the magnet — repelling it. This is consistent with energy conservation."}
    ]'::jsonb,
    '[
      {"term": "Electromagnetic Induction", "definition": "The production of an electromotive force (EMF) in a conductor due to a changing magnetic flux."},
      {"term": "Magnetic Flux", "definition": "The product of the magnetic field strength and the perpendicular area through which the field passes: Phi = B*A*cos(theta), measured in webers."},
      {"term": "Faraday''s Law", "definition": "The induced EMF in a coil equals the negative rate of change of magnetic flux: EMF = -N*(delta-Phi/delta-t)."},
      {"term": "Lenz''s Law", "definition": "The direction of the induced current is such that it opposes the change in magnetic flux that produced it."},
      {"term": "Electromotive Force (EMF)", "definition": "The potential difference produced by electromagnetic induction or a battery, measured in volts."},
      {"term": "Generator", "definition": "A device that converts mechanical energy to electrical energy using electromagnetic induction."},
      {"term": "Transformer", "definition": "A device that changes the voltage of alternating current using two coils linked by a shared magnetic core."},
      {"term": "Turns Ratio", "definition": "The ratio of the number of turns in the secondary coil to the primary coil of a transformer: N_s/N_p."},
      {"term": "Weber", "definition": "The SI unit of magnetic flux, where 1 Wb = 1 T*m^2."}
    ]'::jsonb,
    40, false)
  ON CONFLICT (textbook_id, chapter_number) DO NOTHING;

  -- Chapter 7: Electromagnetic Radiation
  INSERT INTO textbook_chapters (tenant_id, textbook_id, chapter_number, title, slug, description, content, key_terms, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, 7, 'Electromagnetic Radiation', 'electromagnetic-radiation',
    'Study the electromagnetic spectrum, properties of light, interference, and diffraction.',
    '[
      {"type": "heading", "content": "Electromagnetic Radiation", "level": 1},
      {"type": "text", "content": "Light is only a tiny sliver of a vast family of waves called electromagnetic radiation. From the low-frequency radio waves that carry CBC broadcasts across Saskatchewan to the ultra-high-frequency gamma rays emitted by radioactive materials, all electromagnetic waves share the same fundamental nature: oscillating electric and magnetic fields propagating through space at the speed of light, c = 3.00 x 10^8 m/s."},
      {"type": "text", "content": "Unlike mechanical waves such as sound, electromagnetic waves require no medium. They travel equally well through the vacuum of space, which is how sunlight reaches Earth across 150 million kilometres of emptiness. All electromagnetic waves obey the universal wave equation: c = f * lambda. Since c is constant, higher frequency means shorter wavelength."},
      {"type": "callout", "content": "The electromagnetic spectrum, from lowest to highest frequency:\n\n1. Radio waves (f < 10^9 Hz, lambda > 0.3 m) — communication, broadcasting\n2. Microwaves (10^9 to 10^12 Hz) — cooking, satellite links, cell phones\n3. Infrared (10^12 to 4 x 10^14 Hz) — thermal imaging, remote controls\n4. Visible light (4 x 10^14 to 7.5 x 10^14 Hz) — the only EM radiation our eyes detect\n5. Ultraviolet (7.5 x 10^14 to 10^17 Hz) — causes sunburn, used for sterilization\n6. X-rays (10^17 to 10^19 Hz) — medical imaging, security scanning\n7. Gamma rays (f > 10^19 Hz) — nuclear processes, cancer treatment\n\nAll travel at c in a vacuum. The differences are in frequency, wavelength, and energy.", "style": "info"},
      {"type": "heading", "content": "Interference and Young''s Double-Slit Experiment", "level": 2},
      {"type": "text", "content": "The wave nature of light is demonstrated most convincingly by interference. In Young''s double-slit experiment, light passes through two narrow slits and creates a pattern of bright and dark bands on a screen. Bright fringes (maxima) occur where the waves from the two slits arrive in phase — their path difference is a whole number of wavelengths: d*sin(theta) = m*lambda, where d is the slit separation, theta is the angle to the fringe, m is the order number (0, 1, 2, ...), and lambda is the wavelength."},
      {"type": "text", "content": "Dark fringes (minima) occur where the waves arrive half a wavelength out of phase, cancelling each other: d*sin(theta) = (m + 1/2)*lambda. The spacing of the fringes depends on the wavelength of the light and the slit separation. This experiment provided early evidence that light behaves as a wave."},
      {"type": "callout", "content": "Worked Example: Monochromatic light passes through two slits separated by 0.10 mm. The third bright fringe (m = 3) appears at an angle of 1.05 degrees from the central maximum. What is the wavelength of the light?\n\nd*sin(theta) = m*lambda\nlambda = d*sin(theta) / m\nlambda = (0.10 x 10^-3)*sin(1.05) / 3\nlambda = (1.0 x 10^-4)(0.01833) / 3\nlambda = 1.833 x 10^-6 / 3\nlambda = 6.11 x 10^-7 m = 611 nm\n\nThe light has a wavelength of about 611 nm — orange-red visible light.", "style": "example"},
      {"type": "heading", "content": "Diffraction", "level": 2},
      {"type": "text", "content": "Diffraction is the bending of waves as they pass through an opening or around an obstacle. It is most noticeable when the size of the opening is comparable to the wavelength. Single-slit diffraction produces a central bright band flanked by progressively dimmer bands. Diffraction gratings — surfaces with thousands of closely spaced slits per centimetre — separate light into its component wavelengths with high precision, functioning like a prism. The Canadian Light Source synchrotron in Saskatoon uses diffraction gratings to select specific wavelengths of synchrotron radiation for experiments in materials science, biology, and environmental studies."},
      {"type": "callout", "content": "Tip: Interference requires two or more coherent sources. Diffraction occurs with a single opening or obstacle. In practice, double-slit experiments show both phenomena simultaneously: the broad single-slit diffraction envelope modulates the narrower double-slit interference pattern.", "style": "tip"},
      {"type": "quiz", "question": "Which type of electromagnetic radiation has the highest frequency?", "options": ["Gamma rays", "X-rays", "Ultraviolet", "Radio waves"], "correct": 0, "explanation": "Gamma rays have the highest frequency (and shortest wavelength) in the electromagnetic spectrum, with frequencies typically greater than 10^19 Hz."},
      {"type": "quiz", "question": "In Young''s double-slit experiment, if the slit separation is decreased while the wavelength remains the same, the fringe spacing on the screen will:", "options": ["Increase", "Decrease", "Stay the same", "The fringes will disappear"], "correct": 0, "explanation": "The fringe spacing is proportional to lambda/d. If d decreases, the ratio lambda/d increases, so the fringes spread farther apart."}
    ]'::jsonb,
    '[
      {"term": "Electromagnetic Radiation", "definition": "Waves consisting of oscillating electric and magnetic fields that propagate through space at the speed of light."},
      {"term": "Electromagnetic Spectrum", "definition": "The full range of electromagnetic radiation organized by frequency and wavelength, from radio waves to gamma rays."},
      {"term": "Interference", "definition": "The combination of two or more waves resulting in a new wave pattern due to constructive or destructive superposition."},
      {"term": "Constructive Interference", "definition": "Interference that occurs when waves are in phase, producing a combined wave with greater amplitude."},
      {"term": "Destructive Interference", "definition": "Interference that occurs when waves are out of phase, producing a combined wave with reduced or zero amplitude."},
      {"term": "Diffraction", "definition": "The bending and spreading of waves as they pass through an opening or around an obstacle."},
      {"term": "Diffraction Grating", "definition": "A surface with many closely spaced slits that separates light into its component wavelengths through diffraction."},
      {"term": "Path Difference", "definition": "The difference in distance travelled by two waves from their sources to a given point, determining interference conditions."},
      {"term": "Coherent Sources", "definition": "Sources that emit waves with a constant phase relationship, required for sustained interference patterns."}
    ]'::jsonb,
    40, false)
  ON CONFLICT (textbook_id, chapter_number) DO NOTHING;

  -- Chapter 8: Atomic Physics
  INSERT INTO textbook_chapters (tenant_id, textbook_id, chapter_number, title, slug, description, content, key_terms, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, 8, 'Atomic Physics', 'atomic-physics',
    'Trace the development of atomic models from Thomson to the quantum mechanical atom, including quantum numbers, electron configurations, and atomic spectra.',
    '[
      {"type": "heading", "content": "Atomic Physics", "level": 1},
      {"type": "text", "content": "For most of human history, the internal structure of the atom was a complete mystery. Over the past century, a series of groundbreaking experiments transformed our understanding — from Thomson''s discovery of the electron, to Rutherford''s nuclear model, to Bohr''s quantized orbits, and finally to the full quantum mechanical picture we use today. Each model was refined when it failed to explain new experimental evidence, illustrating how science progresses through evidence-based revision."},
      {"type": "heading", "content": "From Thomson to Rutherford to Bohr", "level": 2},
      {"type": "text", "content": "J.J. Thomson discovered the electron in 1897 and proposed the plum pudding model — electrons scattered throughout a uniform positive mass. Ernest Rutherford disproved this in 1911 with his gold foil experiment: most alpha particles passed through the foil undeflected, but a few bounced back sharply, revealing that the atom''s positive charge and most of its mass are concentrated in a tiny, dense nucleus. Niels Bohr refined this in 1913 by proposing that electrons orbit the nucleus only at specific allowed radii, each corresponding to a fixed energy level."},
      {"type": "text", "content": "In Bohr''s model, electrons can jump between energy levels by absorbing or emitting photons whose energy exactly matches the difference between levels: E_photon = E_higher - E_lower = h*f. When electrons absorb photons and jump to higher levels, they produce absorption spectra (dark lines). When they fall to lower levels and emit photons, they produce emission spectra (bright lines). Each element has a unique spectral fingerprint, used in chemistry, astronomy, and at facilities like the Canadian Light Source synchrotron for identifying unknown substances."},
      {"type": "callout", "content": "For hydrogen, the energy levels are given by: E_n = -13.6 eV / n^2, where n is the principal quantum number (1, 2, 3, ...). The ground state (n = 1) has the lowest energy at -13.6 eV. As n increases, the energy levels get closer together and approach zero (ionization energy). The energy of a photon emitted during a transition from n_i to n_f is:\n\nE_photon = 13.6 * (1/n_f^2 - 1/n_i^2) eV", "style": "info"},
      {"type": "heading", "content": "Quantum Numbers and Electron Configuration", "level": 2},
      {"type": "text", "content": "The modern quantum mechanical model replaces Bohr''s precise orbits with probability clouds called orbitals. Each electron in an atom is described by four quantum numbers. The principal quantum number (n) determines the energy level and size of the orbital. The angular momentum quantum number (l) determines the shape (s, p, d, f). The magnetic quantum number (m_l) determines the orientation. The spin quantum number (m_s) can be +1/2 or -1/2."},
      {"type": "text", "content": "The Pauli exclusion principle states that no two electrons in an atom can have the same set of four quantum numbers. Combined with the aufbau principle (fill lowest energy levels first) and Hund''s rule (fill each orbital in a sublevel with one electron before pairing), these rules determine the electron configuration of every element. Understanding electron configurations explains the periodic table''s organization and chemical bonding behaviour."},
      {"type": "callout", "content": "Worked Example: Determine the electron configuration of iron (Fe, atomic number 26).\n\nFollowing the aufbau principle, fill orbitals in order of increasing energy:\n1s^2 2s^2 2p^6 3s^2 3p^6 4s^2 3d^6\n\nTotal electrons: 2+2+6+2+6+2+6 = 26 (matches atomic number)\n\nNote: The 4s orbital fills before 3d because it has slightly lower energy, even though 3d has a lower principal quantum number. When iron forms ions, it loses the 4s electrons first.", "style": "example"},
      {"type": "callout", "content": "Tip: The order of orbital filling follows the diagonal rule: 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p, 5s, 4d, 5p, 6s, 4f, 5d, 6p, 7s, 5f, 6d, 7p. Memorize this sequence or use the diagonal-arrow diagram in which you write the subshells in rows and draw diagonal arrows.", "style": "tip"},
      {"type": "quiz", "question": "A hydrogen atom transitions from the n = 4 energy level to the n = 2 energy level. What type of radiation is emitted?", "options": ["Visible light (this is part of the Balmer series)", "Ultraviolet (Lyman series)", "Infrared (Paschen series)", "X-rays"], "correct": 0, "explanation": "Transitions ending at n = 2 belong to the Balmer series, which produces visible light. E_photon = 13.6*(1/4 - 1/16) = 13.6*(3/16) = 2.55 eV, corresponding to blue-green visible light at about 486 nm."},
      {"type": "quiz", "question": "How many electrons can occupy the n = 3 energy level in total?", "options": ["18", "8", "2", "32"], "correct": 0, "explanation": "The maximum number of electrons in energy level n is 2n^2. For n = 3: 2(3)^2 = 2(9) = 18. These fill the 3s (2), 3p (6), and 3d (10) subshells."}
    ]'::jsonb,
    '[
      {"term": "Atomic Model", "definition": "A theoretical representation of the structure of an atom, refined over time as new experimental evidence emerged."},
      {"term": "Nucleus", "definition": "The dense, positively charged core of an atom, containing protons and neutrons."},
      {"term": "Energy Level", "definition": "A specific allowed energy state for an electron in an atom, characterized by the principal quantum number n."},
      {"term": "Emission Spectrum", "definition": "The set of specific wavelengths of light emitted by atoms as electrons transition from higher to lower energy levels."},
      {"term": "Absorption Spectrum", "definition": "The set of specific wavelengths absorbed by atoms as electrons transition from lower to higher energy levels."},
      {"term": "Quantum Number", "definition": "One of four numbers (n, l, m_l, m_s) that uniquely describe the state of an electron in an atom."},
      {"term": "Orbital", "definition": "A region of space around the nucleus where there is a high probability of finding an electron."},
      {"term": "Pauli Exclusion Principle", "definition": "No two electrons in the same atom can have an identical set of four quantum numbers."},
      {"term": "Electron Configuration", "definition": "The arrangement of electrons among the energy levels and sublevels of an atom."},
      {"term": "Bohr Model", "definition": "An atomic model in which electrons orbit the nucleus at specific allowed radii with quantized energies."}
    ]'::jsonb,
    45, false)
  ON CONFLICT (textbook_id, chapter_number) DO NOTHING;

  -- Chapter 9: Nuclear Physics
  INSERT INTO textbook_chapters (tenant_id, textbook_id, chapter_number, title, slug, description, content, key_terms, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, 9, 'Nuclear Physics', 'nuclear-physics',
    'Explore the structure of the nucleus, radioactive decay, half-life, nuclear fission, and nuclear fusion.',
    '[
      {"type": "heading", "content": "Nuclear Physics", "level": 1},
      {"type": "text", "content": "The nucleus of an atom is extraordinarily small — roughly 10^-15 m across, or about 100 000 times smaller than the atom itself — yet it contains more than 99.9% of the atom''s mass. Nuclear physics explores the forces that hold the nucleus together, the processes by which unstable nuclei transform, and the immense energies released in nuclear reactions. Canada''s CANDU reactor technology, uranium mining in northern Saskatchewan (which produces roughly 15% of the world''s uranium supply), and medical isotope production all depend on the principles covered in this chapter."},
      {"type": "heading", "content": "Nuclear Structure and Stability", "level": 2},
      {"type": "text", "content": "The nucleus contains protons (positive charge) and neutrons (no charge), collectively called nucleons. The number of protons defines the element (atomic number Z); the total number of nucleons is the mass number A. Isotopes are atoms of the same element with different numbers of neutrons. The strong nuclear force — an enormously powerful but very short-range force — holds the nucleus together against the electrostatic repulsion between protons. When the balance between these forces is unfavourable, the nucleus is unstable and undergoes radioactive decay."},
      {"type": "callout", "content": "Three types of radioactive decay:\n\nAlpha decay: The nucleus emits an alpha particle (2 protons + 2 neutrons = helium-4 nucleus). The atomic number decreases by 2, and the mass number decreases by 4.\n\nBeta decay: A neutron transforms into a proton (or vice versa), emitting a beta particle (electron or positron) and a neutrino. The atomic number changes by 1, but the mass number stays the same.\n\nGamma decay: The nucleus releases excess energy as a high-energy gamma ray photon. Neither the atomic number nor the mass number changes.", "style": "info"},
      {"type": "heading", "content": "Half-Life", "level": 2},
      {"type": "text", "content": "Radioactive decay is a random process — we cannot predict when a specific nucleus will decay. However, for a large number of identical nuclei, the fraction that decays in a given time is predictable. The half-life (t_1/2) is the time required for half of a radioactive sample to decay. After one half-life, 50% remains; after two half-lives, 25%; after three, 12.5%; and so on. The amount remaining after n half-lives is N = N_0 * (1/2)^n."},
      {"type": "callout", "content": "Worked Example: A sample of iodine-131, used in thyroid treatment at Saskatchewan hospitals, has a half-life of 8.0 days. If a hospital receives 200 mg of I-131, how much remains after 24 days?\n\nNumber of half-lives: n = 24 / 8.0 = 3.0\nN = N_0 * (1/2)^n = 200 * (1/2)^3 = 200 * (1/8) = 25 mg\n\nAfter 24 days (three half-lives), 25 mg of I-131 remains. The other 175 mg has decayed into xenon-131.", "style": "example"},
      {"type": "heading", "content": "Fission and Fusion", "level": 2},
      {"type": "text", "content": "Nuclear fission is the splitting of a heavy nucleus (such as uranium-235) into two lighter nuclei, releasing neutrons and a large amount of energy. When the released neutrons trigger further fission events, a chain reaction occurs. In a nuclear reactor, this chain reaction is controlled to produce steady energy. In a nuclear weapon, it is uncontrolled. Canada''s CANDU reactors use natural (unenriched) uranium as fuel and heavy water as a moderator, a design developed at Chalk River, Ontario."},
      {"type": "text", "content": "Nuclear fusion is the combining of light nuclei (such as hydrogen isotopes) to form heavier nuclei, releasing even more energy per unit mass than fission. Fusion powers the Sun and all stars. On Earth, achieving controlled fusion is extraordinarily difficult because the nuclei must be heated to temperatures exceeding 100 million degrees to overcome their electrostatic repulsion. International research projects continue to pursue fusion as a future clean energy source."},
      {"type": "callout", "content": "Tip: Both fission and fusion release energy because of the mass defect — the products have slightly less mass than the reactants. The missing mass is converted to energy according to E = mc^2. Fission releases about 200 MeV per event; fusion of deuterium and tritium releases about 17.6 MeV per event, but gram-for-gram, fusion releases far more energy because hydrogen is so much lighter than uranium.", "style": "tip"},
      {"type": "quiz", "question": "A radioactive sample has a half-life of 5.0 years. What fraction of the original sample remains after 20 years?", "options": ["1/16", "1/4", "1/8", "1/2"], "correct": 0, "explanation": "Number of half-lives = 20/5.0 = 4. Fraction remaining = (1/2)^4 = 1/16. Only 6.25% of the original sample remains."},
      {"type": "quiz", "question": "Which process releases more energy per unit mass — fission or fusion?", "options": ["Fusion", "Fission", "They release equal energy per unit mass", "Neither releases energy"], "correct": 0, "explanation": "Fusion of light elements releases more energy per kilogram of fuel than fission of heavy elements. This is because hydrogen nuclei are much lighter, so more reactions occur per kilogram, and each reaction converts a larger fraction of mass to energy."}
    ]'::jsonb,
    '[
      {"term": "Nucleon", "definition": "A proton or neutron — the particles that make up the atomic nucleus."},
      {"term": "Isotope", "definition": "Atoms of the same element with the same atomic number but different mass numbers (different numbers of neutrons)."},
      {"term": "Radioactive Decay", "definition": "The spontaneous transformation of an unstable nucleus into a more stable configuration by emitting particles or energy."},
      {"term": "Alpha Particle", "definition": "A particle consisting of 2 protons and 2 neutrons (a helium-4 nucleus), emitted during alpha decay."},
      {"term": "Beta Particle", "definition": "A high-speed electron or positron emitted during beta decay when a neutron or proton transforms."},
      {"term": "Gamma Ray", "definition": "A high-energy photon emitted by the nucleus during gamma decay, with no change in atomic or mass number."},
      {"term": "Half-Life", "definition": "The time required for half of the radioactive nuclei in a sample to undergo decay."},
      {"term": "Nuclear Fission", "definition": "The splitting of a heavy nucleus into two lighter nuclei, releasing neutrons and energy."},
      {"term": "Nuclear Fusion", "definition": "The combining of two light nuclei to form a heavier nucleus, releasing energy."},
      {"term": "Chain Reaction", "definition": "A self-sustaining series of nuclear fission reactions in which the neutrons from each event trigger further fission."}
    ]'::jsonb,
    40, false)
  ON CONFLICT (textbook_id, chapter_number) DO NOTHING;

  -- Chapter 10: Particle Physics and Cosmology
  INSERT INTO textbook_chapters (tenant_id, textbook_id, chapter_number, title, slug, description, content, key_terms, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, 10, 'Particle Physics and Cosmology', 'particle-physics-cosmology',
    'Discover the Standard Model of particle physics, the fundamental forces of nature, and the Big Bang theory of the universe''s origin.',
    '[
      {"type": "heading", "content": "Particle Physics and Cosmology", "level": 1},
      {"type": "text", "content": "For centuries, scientists sought the ultimate building blocks of matter. We now know that protons and neutrons are not fundamental — they are composed of even smaller particles called quarks. The Standard Model of particle physics classifies all known fundamental particles and three of the four fundamental forces. This chapter takes you on a journey from the smallest known structures in the universe to the largest — from subatomic quarks to the expanding cosmos itself."},
      {"type": "heading", "content": "The Standard Model", "level": 2},
      {"type": "text", "content": "The Standard Model organizes fundamental particles into two families: fermions (the matter particles) and bosons (the force carriers). Fermions include six quarks (up, down, charm, strange, top, bottom) and six leptons (electron, muon, tau, and their associated neutrinos). Quarks combine in groups of three to form baryons (like protons and neutrons) or in quark-antiquark pairs to form mesons. Quarks are never found in isolation — a property called confinement."},
      {"type": "text", "content": "The force-carrying bosons mediate the fundamental interactions. The photon carries the electromagnetic force. The W and Z bosons carry the weak nuclear force (responsible for beta decay). Gluons carry the strong nuclear force (binding quarks together). The Higgs boson, confirmed at CERN in 2012, is associated with the Higgs field, which gives particles their mass. Gravity is described by general relativity but is not yet incorporated into the Standard Model — the search for a quantum theory of gravity remains one of the greatest challenges in modern physics."},
      {"type": "callout", "content": "The four fundamental forces of nature, from strongest to weakest:\n\n1. Strong nuclear force — binds quarks into protons and neutrons, and holds the nucleus together. Range: ~10^-15 m.\n2. Electromagnetic force — acts between charged particles. Range: infinite. Responsible for chemistry, light, and all electrical technology.\n3. Weak nuclear force — responsible for radioactive beta decay and some nuclear reactions in stars. Range: ~10^-18 m.\n4. Gravitational force — acts between all masses. Range: infinite. Weakest of the four but dominant at astronomical scales.\n\nCanadian researchers at TRIUMF in British Columbia and through collaborations at CERN contribute to experiments probing these forces.", "style": "info"},
      {"type": "heading", "content": "Antimatter", "level": 2},
      {"type": "text", "content": "Every particle has a corresponding antiparticle with the same mass but opposite charge and quantum numbers. The antiparticle of the electron is the positron (e+). When a particle meets its antiparticle, they annihilate — their combined mass is converted entirely into energy in the form of gamma-ray photons, according to E = mc^2. Positron emission tomography (PET) scanners used in Saskatchewan hospitals detect the gamma rays from electron-positron annihilation to create detailed images of metabolic activity in the body."},
      {"type": "callout", "content": "Worked Example: When an electron and a positron annihilate at rest, what total energy is released as gamma rays? (electron mass = 9.11 x 10^-31 kg)\n\nTotal mass converted: m = 2 * 9.11 x 10^-31 = 1.822 x 10^-30 kg\nE = mc^2 = (1.822 x 10^-30)(3.00 x 10^8)^2\nE = (1.822 x 10^-30)(9.00 x 10^16)\nE = 1.64 x 10^-13 J\n\nConverting to electronvolts: E = 1.64 x 10^-13 / 1.60 x 10^-19 = 1.02 x 10^6 eV = 1.02 MeV\n\nTwo gamma photons are produced, each carrying 0.511 MeV.", "style": "example"},
      {"type": "heading", "content": "The Big Bang and Cosmology", "level": 2},
      {"type": "text", "content": "Looking outward from Earth, we observe that distant galaxies are moving away from us — and the farther away they are, the faster they recede. This observation, described by Hubble''s law (v = H_0 * d), implies that the universe is expanding. Running this expansion backward in time leads to the conclusion that the universe began from an incredibly hot, dense state approximately 13.8 billion years ago — the Big Bang."},
      {"type": "text", "content": "Three key pieces of evidence support the Big Bang theory. First, the observed expansion of the universe (redshift of distant galaxies). Second, the cosmic microwave background radiation (CMB) — a faint glow of microwave radiation filling all of space, the afterglow of the early universe when it first became transparent to light about 380 000 years after the Big Bang. Third, the observed abundances of light elements (hydrogen, helium, deuterium) match the predictions of Big Bang nucleosynthesis. Standing under the vast prairie sky of Saskatchewan on a clear winter night, you are bathed in this ancient radiation from the birth of the cosmos."},
      {"type": "callout", "content": "Tip: Do not think of the Big Bang as an explosion in space. It was an expansion of space itself. Every point in the universe was at the centre of the expansion. The analogy of dots on an inflating balloon captures this: as the balloon expands, every dot moves away from every other dot, and there is no single centre on the surface of the balloon.", "style": "tip"},
      {"type": "quiz", "question": "A proton is made up of which combination of quarks?", "options": ["Two up quarks and one down quark (uud)", "Two down quarks and one up quark (udd)", "Three up quarks (uuu)", "One up quark and two strange quarks (uss)"], "correct": 0, "explanation": "A proton consists of two up quarks (each with charge +2/3 e) and one down quark (charge -1/3 e). Total charge: +2/3 + 2/3 - 1/3 = +1 e, matching the proton''s charge."},
      {"type": "quiz", "question": "Which of the following is the strongest of the four fundamental forces?", "options": ["Strong nuclear force", "Electromagnetic force", "Weak nuclear force", "Gravitational force"], "correct": 0, "explanation": "The strong nuclear force is by far the strongest of the four fundamental forces — roughly 100 times stronger than the electromagnetic force at nuclear distances. However, its extremely short range (~10^-15 m) means it only acts within atomic nuclei."}
    ]'::jsonb,
    '[
      {"term": "Standard Model", "definition": "The theoretical framework classifying all known fundamental particles and describing three of the four fundamental forces."},
      {"term": "Quark", "definition": "A fundamental particle that combines in groups to form composite particles such as protons and neutrons."},
      {"term": "Lepton", "definition": "A fundamental particle not subject to the strong force, including the electron, muon, tau, and their neutrinos."},
      {"term": "Boson", "definition": "A force-carrying particle that mediates fundamental interactions, such as the photon, gluon, or W and Z bosons."},
      {"term": "Higgs Boson", "definition": "The particle associated with the Higgs field, which gives other fundamental particles their mass. Confirmed in 2012."},
      {"term": "Antimatter", "definition": "Particles with the same mass as their matter counterparts but opposite charge and quantum numbers."},
      {"term": "Annihilation", "definition": "The process in which a particle and its antiparticle meet and convert their combined mass into energy."},
      {"term": "Big Bang", "definition": "The prevailing cosmological model describing the universe''s origin from an extremely hot, dense state approximately 13.8 billion years ago."},
      {"term": "Cosmic Microwave Background", "definition": "The faint microwave radiation permeating all of space, remnant thermal radiation from the early universe."},
      {"term": "Hubble''s Law", "definition": "The observation that the recessional velocity of a galaxy is proportional to its distance: v = H_0*d."}
    ]'::jsonb,
    45, false)
  ON CONFLICT (textbook_id, chapter_number) DO NOTHING;

END $$;
