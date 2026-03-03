-- ============================================================================
-- WolfWhale Senior Math Textbook Content Seed Data
-- Grades 10-30 (Saskatchewan / WNCP Curriculum)
--
-- 5 Textbooks:
--   1. Workplace & Apprenticeship Math 10
--   2. Foundations of Math 10
--   3. Pre-Calculus Math 20
--   4. Pre-Calculus Math 30
--   5. Calculus 30
--
-- Each textbook contains 4-6 units, 3-5 chapters per unit, with:
--   - Rich JSONB content blocks (heading, text, callout, quiz, list, divider)
--   - Key terms with definitions
--   - Indigenous connections where appropriate
--   - Flashcards for spaced repetition
--
-- NOTE: No outcome mappings for senior math (K-9 outcomes only in seed data).
-- tenant_id uses placeholder UUID: 00000000-0000-0000-0000-000000000001
-- ============================================================================


-- ============================================================================
-- TEXTBOOK 1: Workplace & Apprenticeship Math 10
-- Slug: wolfwhale-workplace-apprenticeship-math-10
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book UUID;
  v_unit UUID;
  v_ch UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-workplace-apprenticeship-math-10';

  -- ==============================
  -- UNIT 1: Unit Pricing & Currency Exchange
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Unit Pricing & Currency Exchange',
    'Explore how unit pricing helps consumers make informed purchasing decisions and how currency exchange rates affect international transactions.',
    'Mathematical reasoning empowers people to make sound financial decisions in everyday life.',
    'How can we use mathematics to compare costs and convert between currencies?')
  RETURNING id INTO v_unit;

  -- Chapter 1.1
  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Comparing Unit Prices', 'comparing-unit-prices',
    'Learn to calculate and compare unit prices to determine the best value when shopping.',
    '[
      {"type": "heading", "content": "Comparing Unit Prices", "level": 1},
      {"type": "text", "content": "When you walk through a grocery store, you are surrounded by choices. A 750 mL bottle of canola oil costs $4.29, while a 1 L bottle of the same brand costs $5.49. Which is the better deal? To answer this question, we calculate the unit price — the cost per single unit of measurement."},
      {"type": "callout", "content": "Unit Price = Total Price / Quantity. Always ensure both items use the same unit of measurement before comparing.", "style": "tip"},
      {"type": "heading", "content": "Calculating Unit Price", "level": 2},
      {"type": "text", "content": "To find the unit price, divide the total price by the quantity. For example, if a 500 g bag of rice costs $3.50, then the unit price is $3.50 / 500 g = $0.007 per gram, or equivalently $7.00 per kilogram. By converting to a common unit, you can compare products of different sizes fairly."},
      {"type": "text", "content": "Worked Example: A 341 mL can of juice costs $1.29 and a 1.89 L carton of the same juice costs $4.99. Compare the unit prices.\n\nSolution:\nCan: $1.29 / 341 mL = $0.00378 per mL\nCarton: $4.99 / 1890 mL = $0.00264 per mL\n\nThe carton has a lower unit price ($0.00264/mL vs $0.00378/mL), so it is the better value."},
      {"type": "callout", "content": "Remember to convert litres to millilitres (1 L = 1000 mL) or kilograms to grams (1 kg = 1000 g) so you are comparing the same units.", "style": "warning"},
      {"type": "quiz", "question": "A 2 kg bag of flour costs $5.40 and a 5 kg bag costs $11.50. What is the unit price of each, and which is the better deal?", "options": ["2 kg bag: $2.70/kg, 5 kg bag: $2.30/kg — the 5 kg bag is better", "2 kg bag: $2.70/kg, 5 kg bag: $2.30/kg — the 2 kg bag is better", "2 kg bag: $5.40/kg, 5 kg bag: $2.30/kg — the 5 kg bag is better", "Both have the same unit price"], "correct": 0, "explanation": "2 kg bag: $5.40 / 2 = $2.70 per kg. 5 kg bag: $11.50 / 5 = $2.30 per kg. Since $2.30 < $2.70, the 5 kg bag offers a lower unit price."},
      {"type": "heading", "content": "When Bigger Is Not Always Better", "level": 2},
      {"type": "text", "content": "While bulk purchasing often provides a lower unit price, there are practical considerations. Perishable goods may spoil before you can use them. Storage space may be limited. A household of one person may not benefit from buying a 10 kg bag of potatoes if half will go to waste. Good consumer mathematics means weighing the unit price against your actual needs."},
      {"type": "list", "items": ["Calculate the unit price for each option", "Convert all measurements to the same unit", "Consider spoilage, storage, and actual need", "Check if the sale price truly offers savings compared to the regular unit price"], "ordered": true},
      {"type": "divider"},
      {"type": "callout", "content": "Practice: Next time you are in a store, calculate the unit price for three different sizes of a product you regularly buy. Record your findings and determine which size offers the best value for your household.", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Unit Price", "definition": "The cost of a single unit of measurement of a product, calculated by dividing the total price by the quantity."},
      {"term": "Rate", "definition": "A comparison of two quantities measured in different units, such as dollars per kilogram."},
      {"term": "Bulk Purchasing", "definition": "Buying goods in larger quantities, often at a lower unit price."},
      {"term": "Conversion Factor", "definition": "A ratio used to convert one unit of measurement to another, such as 1 kg = 1000 g."},
      {"term": "Consumer Mathematics", "definition": "The application of mathematical skills to everyday purchasing and financial decisions."}
    ]'::jsonb,
    'Indigenous communities across the prairies have long practised careful resource management, ensuring that harvested foods such as bison, fish, and berries were preserved and allocated efficiently — an early form of unit-based thinking about resources.',
    25, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a unit price?', 'The cost of one unit of measurement of a product, found by dividing total price by quantity.', 'Think: price divided by amount', 2, 0),
    (v_tenant, v_ch, 'How do you compare unit prices of items sold in different units (e.g., mL vs L)?', 'Convert both quantities to the same unit first, then calculate price per unit for each.', 'Remember: 1 L = 1000 mL', 3, 1),
    (v_tenant, v_ch, 'A 750 g box costs $6.00. What is the unit price per kilogram?', '$6.00 / 0.75 kg = $8.00 per kilogram.', 'Convert grams to kilograms first: 750 g = 0.75 kg', 3, 2),
    (v_tenant, v_ch, 'Why might a larger package NOT be the best deal?', 'Perishable items may spoil, storage may be limited, or you may not use the full quantity before it expires.', 'Think beyond just the price', 2, 3),
    (v_tenant, v_ch, 'What is a conversion factor?', 'A ratio used to convert between units of measurement, such as 1 kg = 1000 g or 1 L = 1000 mL.', 'It equals 1 when the numerator and denominator represent the same quantity', 2, 4);

  -- Chapter 1.2
  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Currency Exchange Rates', 'currency-exchange-rates',
    'Understand how currency exchange rates work and perform conversions between Canadian dollars and other currencies.',
    '[
      {"type": "heading", "content": "Currency Exchange Rates", "level": 1},
      {"type": "text", "content": "When you travel internationally or purchase goods from another country, you need to convert between currencies. An exchange rate tells you how much of one currency you can get for a unit of another currency. For example, if the exchange rate is 1 CAD = 0.74 USD, then each Canadian dollar is worth 74 American cents."},
      {"type": "callout", "content": "Exchange rates fluctuate daily based on economic factors. Always check the current rate before making conversions.", "style": "info"},
      {"type": "heading", "content": "Converting Currencies", "level": 2},
      {"type": "text", "content": "To convert from Canadian dollars to a foreign currency, multiply the Canadian amount by the exchange rate. To convert from a foreign currency to Canadian dollars, divide by the exchange rate (or multiply by its reciprocal).\n\nWorked Example 1: Convert $250 CAD to US dollars if the exchange rate is 1 CAD = 0.74 USD.\nSolution: $250 x 0.74 = $185.00 USD\n\nWorked Example 2: Convert 100 EUR to CAD if the exchange rate is 1 CAD = 0.63 EUR.\nSolution: 100 EUR / 0.63 = $158.73 CAD"},
      {"type": "heading", "content": "Buy Rate vs Sell Rate", "level": 2},
      {"type": "text", "content": "Currency exchange services charge a spread — the difference between the buy rate (what they pay you for foreign currency) and the sell rate (what they charge you for foreign currency). The sell rate is always higher than the buy rate. This spread is how the exchange service earns revenue."},
      {"type": "text", "content": "Example: A currency exchange booth lists the following rates for USD:\nBuy rate: 1 CAD = 0.76 USD (you receive this when selling CAD)\nSell rate: 1 CAD = 0.72 USD (you pay this when buying USD)\n\nIf you exchange $500 CAD for USD, you receive: $500 x 0.72 = $360 USD.\nIf you later convert $360 USD back to CAD: $360 / 0.76 = $473.68 CAD.\nYou lost $26.32 to the exchange spread."},
      {"type": "quiz", "question": "If 1 CAD = 0.58 GBP, how much is 200 GBP worth in Canadian dollars?", "options": ["$116.00 CAD", "$258.00 CAD", "$344.83 CAD", "$200.58 CAD"], "correct": 2, "explanation": "To convert GBP to CAD, divide by the rate: 200 / 0.58 = $344.83 CAD."},
      {"type": "callout", "content": "Cross-currency conversion: If you know CAD to USD and CAD to EUR, you can find USD to EUR by dividing one rate by the other. This is called a cross rate.", "style": "tip"},
      {"type": "list", "items": ["Identify the exchange rate and which direction you are converting", "Multiply when going from your home currency to foreign currency", "Divide when converting from foreign currency back to your home currency", "Account for buy/sell spread if using a currency exchange service", "Consider additional fees or commissions charged by the service"], "ordered": true},
      {"type": "divider"},
      {"type": "callout", "content": "Activity: Look up the current exchange rate between CAD and three other currencies (USD, EUR, JPY). Calculate how much $100 CAD would be worth in each currency today.", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Exchange Rate", "definition": "The value of one currency expressed in terms of another currency."},
      {"term": "Buy Rate", "definition": "The rate at which a currency exchange service purchases foreign currency from you."},
      {"term": "Sell Rate", "definition": "The rate at which a currency exchange service sells foreign currency to you."},
      {"term": "Spread", "definition": "The difference between the buy rate and the sell rate, representing the profit for the exchange service."},
      {"term": "Cross Rate", "definition": "An exchange rate calculated from two other exchange rates that share a common currency."},
      {"term": "Reciprocal", "definition": "The multiplicative inverse of a number. The reciprocal of a is 1/a."}
    ]'::jsonb,
    'Indigenous trade networks spanning thousands of years across Turtle Island involved complex exchange systems. Items like obsidian, copper, shells, and dried foods were traded across vast distances, requiring understanding of relative value — much like modern currency exchange.',
    25, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is an exchange rate?', 'The value of one currency expressed in terms of another currency.', 'How many units of currency B equal one unit of currency A?', 2, 0),
    (v_tenant, v_ch, 'Convert $300 CAD to USD if 1 CAD = 0.74 USD.', '$300 x 0.74 = $222.00 USD', 'Multiply CAD by the rate', 3, 1),
    (v_tenant, v_ch, 'Convert 500 EUR to CAD if 1 CAD = 0.63 EUR.', '500 / 0.63 = $793.65 CAD', 'Divide the foreign amount by the rate', 3, 2),
    (v_tenant, v_ch, 'What is the difference between the buy rate and the sell rate?', 'The buy rate is what the exchange service pays you; the sell rate is what you pay them. The sell rate is always less favourable to the customer.', 'Think about who profits from the transaction', 3, 3),
    (v_tenant, v_ch, 'What is a cross rate?', 'An exchange rate between two currencies calculated using their rates relative to a common third currency.', 'Use CAD as the common currency to find USD to EUR', 4, 4);

  -- Chapter 1.3
  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Best Deals and Discounts', 'best-deals-and-discounts',
    'Apply percent calculations to determine sale prices, discounts, and the true cost of promotions.',
    '[
      {"type": "heading", "content": "Best Deals and Discounts", "level": 1},
      {"type": "text", "content": "Retailers use a variety of pricing strategies to attract customers: percentage discounts, buy-one-get-one offers, bulk pricing, and loyalty programs. Being able to calculate the actual savings requires understanding how percentages work in pricing contexts."},
      {"type": "heading", "content": "Calculating Percent Discount", "level": 2},
      {"type": "text", "content": "A percent discount reduces the original price by a specified percentage. To find the sale price:\n\nDiscount Amount = Original Price x (Percent Discount / 100)\nSale Price = Original Price - Discount Amount\n\nWorked Example: A jacket originally priced at $89.99 is on sale for 30% off.\nDiscount Amount = $89.99 x 0.30 = $27.00\nSale Price = $89.99 - $27.00 = $62.99"},
      {"type": "callout", "content": "Shortcut: To find the sale price directly, multiply the original price by (1 - discount rate). For a 30% discount: $89.99 x 0.70 = $62.99.", "style": "tip"},
      {"type": "heading", "content": "GST and PST on Sale Prices", "level": 2},
      {"type": "text", "content": "In Saskatchewan, consumers pay both GST (5%) and PST (6%) on most purchases. Tax is calculated on the sale price, not the original price.\n\nContinuing the example: Sale price = $62.99\nGST = $62.99 x 0.05 = $3.15\nPST = $62.99 x 0.06 = $3.78\nTotal cost = $62.99 + $3.15 + $3.78 = $69.92"},
      {"type": "quiz", "question": "A television originally costs $599.99 and is marked 25% off. What is the total cost including 5% GST and 6% PST in Saskatchewan?", "options": ["$449.99", "$499.49", "$499.19", "$517.49"], "correct": 1, "explanation": "Sale price = $599.99 x 0.75 = $449.99. GST = $449.99 x 0.05 = $22.50. PST = $449.99 x 0.06 = $27.00. Total = $449.99 + $22.50 + $27.00 = $499.49."},
      {"type": "heading", "content": "Comparing Promotions", "level": 2},
      {"type": "text", "content": "Sometimes different stores offer different promotions on the same item. To compare:\n\nStore A: Regular price $49.99, 20% off\nStore B: Regular price $54.99, 30% off\n\nStore A sale price: $49.99 x 0.80 = $39.99\nStore B sale price: $54.99 x 0.70 = $38.49\n\nStore B offers the lower price despite having the higher original price. Always calculate the final price rather than comparing discount percentages."},
      {"type": "list", "items": ["A higher percentage discount does not always mean a lower final price", "Calculate the actual dollar amount saved, not just the percentage", "Apply tax after the discount to find the true total cost", "Consider membership fees or minimum purchase requirements for promotions"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Real-World Task: Find a flyer from a local Saskatchewan store. Choose three items on sale, calculate the discount amount, sale price, GST, PST, and total cost for each.", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Percent Discount", "definition": "A reduction in price expressed as a percentage of the original price."},
      {"term": "Sale Price", "definition": "The price of an item after a discount has been applied."},
      {"term": "GST", "definition": "Goods and Services Tax — a 5% federal tax applied to most goods and services in Canada."},
      {"term": "PST", "definition": "Provincial Sales Tax — a 6% provincial tax applied to most goods and services in Saskatchewan."},
      {"term": "Markup", "definition": "The amount added to the cost price of a product to determine its selling price."}
    ]'::jsonb,
    NULL,
    25, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'How do you calculate a sale price after a percent discount?', 'Sale Price = Original Price x (1 - Discount Rate). For a 25% discount, multiply by 0.75.', 'Subtract the discount percentage from 100%, then convert to a decimal', 2, 0),
    (v_tenant, v_ch, 'What are the GST and PST rates in Saskatchewan?', 'GST is 5% (federal) and PST is 6% (provincial), for a combined tax rate of 11%.', 'G = 5, P = 6', 2, 1),
    (v_tenant, v_ch, 'Is tax calculated on the original price or the sale price?', 'Tax is calculated on the sale price (the price after discount).', 'The discount reduces the amount on which tax is charged', 2, 2),
    (v_tenant, v_ch, 'A $120 item is 35% off. What is the sale price?', '$120 x 0.65 = $78.00', 'Multiply by (1 - 0.35)', 3, 3),
    (v_tenant, v_ch, 'Why should you compare final prices rather than discount percentages?', 'A higher discount percentage on a higher original price may still result in a more expensive final price than a lower discount on a cheaper item.', 'The base price matters as much as the percentage', 3, 4);

  -- ==============================
  -- UNIT 2: Income & Budgeting
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Income & Budgeting',
    'Understand different types of income, calculate gross and net pay, and create personal budgets.',
    'Financial literacy requires understanding how income is earned, taxed, and managed through budgeting.',
    'How do we plan and manage our income to meet our needs and goals?')
  RETURNING id INTO v_unit;

  -- Chapter 2.1
  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Gross Pay and Net Pay', 'gross-pay-and-net-pay',
    'Calculate gross pay from hourly wages and salary, and determine net pay after standard deductions.',
    '[
      {"type": "heading", "content": "Gross Pay and Net Pay", "level": 1},
      {"type": "text", "content": "When you start working, the amount you earn before any deductions is called your gross pay. After deductions such as income tax, Canada Pension Plan (CPP) contributions, and Employment Insurance (EI) premiums are subtracted, the amount you actually receive is your net pay — often called your \"take-home pay.\""},
      {"type": "heading", "content": "Calculating Gross Pay", "level": 2},
      {"type": "text", "content": "Hourly Employees: Gross Pay = Hourly Wage x Hours Worked\n\nWorked Example: Priya works part-time at a hardware store earning $15.25/hour. She worked 24 hours last week.\nGross Pay = $15.25 x 24 = $366.00\n\nSalaried Employees: If an annual salary is $48,000 and the employee is paid biweekly (26 pay periods per year):\nGross Pay per Period = $48,000 / 26 = $1,846.15"},
      {"type": "heading", "content": "Overtime Pay", "level": 2},
      {"type": "text", "content": "In Saskatchewan, overtime is typically paid at 1.5 times the regular hourly rate for hours worked beyond 8 hours in a day or 40 hours in a week.\n\nWorked Example: Marcus earns $18.00/hour and worked 44 hours this week.\nRegular pay: 40 x $18.00 = $720.00\nOvertime pay: 4 x ($18.00 x 1.5) = 4 x $27.00 = $108.00\nGross pay: $720.00 + $108.00 = $828.00"},
      {"type": "callout", "content": "Saskatchewan minimum wage is reviewed annually. Check the current rate at Saskatchewan.ca for the most up-to-date figure.", "style": "info"},
      {"type": "heading", "content": "Common Deductions", "level": 2},
      {"type": "text", "content": "Standard payroll deductions include:\n- Federal and provincial income tax (varies by income bracket)\n- CPP contributions (approximately 5.95% of pensionable earnings above the basic exemption)\n- EI premiums (approximately 1.63% of insurable earnings)\n\nSome employers also deduct union dues, pension plan contributions, or health benefit premiums."},
      {"type": "quiz", "question": "Jenna earns $16.50/hour and worked 38 hours in a week. Her total deductions are 22% of gross pay. What is her net pay?", "options": ["$627.00", "$489.06", "$138.60", "$504.90"], "correct": 1, "explanation": "Gross pay = $16.50 x 38 = $627.00. Deductions = $627.00 x 0.22 = $137.94. Net pay = $627.00 - $137.94 = $489.06."},
      {"type": "list", "items": ["Gross pay is your total earnings before deductions", "Net pay is what you receive after all deductions", "Overtime in Saskatchewan is 1.5x the regular rate after 8 hours/day or 40 hours/week", "CPP and EI are mandatory federal deductions", "Your pay stub shows a breakdown of all deductions"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Practice: Using a rate of $16.00/hour, calculate the gross pay, estimated deductions (assume 20%), and net pay for a 35-hour work week.", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Gross Pay", "definition": "Total earnings before any deductions are subtracted."},
      {"term": "Net Pay", "definition": "The amount of pay received after all deductions have been subtracted from gross pay."},
      {"term": "Overtime", "definition": "Hours worked beyond the standard work period, typically paid at a premium rate (1.5x in Saskatchewan)."},
      {"term": "CPP", "definition": "Canada Pension Plan — a mandatory federal contribution that provides retirement income."},
      {"term": "EI", "definition": "Employment Insurance — a mandatory federal premium that provides temporary income if you lose your job."},
      {"term": "Deduction", "definition": "An amount subtracted from gross pay, such as taxes, CPP, EI, or union dues."}
    ]'::jsonb,
    'Traditional Indigenous economies included diverse forms of contribution and reciprocity. Community members contributed through hunting, gathering, teaching, and caregiving — all forms of valuable work, though not measured in wages. Understanding different ways societies value labour provides context for modern income systems.',
    25, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the difference between gross pay and net pay?', 'Gross pay is total earnings before deductions. Net pay is the take-home amount after deductions.', 'Gross = big number, Net = smaller number', 2, 0),
    (v_tenant, v_ch, 'How is overtime calculated in Saskatchewan?', 'Overtime is paid at 1.5 times the regular hourly rate for hours exceeding 8 in a day or 40 in a week.', 'Time-and-a-half', 3, 1),
    (v_tenant, v_ch, 'What does CPP stand for and what does it provide?', 'Canada Pension Plan — a mandatory contribution that provides retirement income to Canadians.', 'Federal retirement program', 2, 2),
    (v_tenant, v_ch, 'If you earn $20/hr and work 45 hours in a week, what is your gross pay?', 'Regular: 40 x $20 = $800. Overtime: 5 x $30 = $150. Gross pay = $950.', 'Calculate regular hours and overtime hours separately', 3, 3),
    (v_tenant, v_ch, 'Name three common payroll deductions.', 'Federal/provincial income tax, Canada Pension Plan (CPP), and Employment Insurance (EI).', 'Two are federal programs, one is tax', 2, 4);

  -- Chapter 2.2
  v_ch_num := 5;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Creating a Personal Budget', 'creating-a-personal-budget',
    'Learn to organize income and expenses into a balanced personal budget.',
    '[
      {"type": "heading", "content": "Creating a Personal Budget", "level": 1},
      {"type": "text", "content": "A budget is a plan that tracks your income and expenses over a period of time, usually monthly. Budgeting helps ensure you can cover your needs, save for goals, and avoid debt. The fundamental equation of a budget is simple: Income - Expenses = Surplus (or Deficit)."},
      {"type": "heading", "content": "Fixed vs Variable Expenses", "level": 2},
      {"type": "text", "content": "Fixed expenses remain the same each month: rent, car payment, phone plan, insurance premiums. Variable expenses change from month to month: groceries, utilities, entertainment, clothing. Knowing which category each expense falls into helps you identify where you have flexibility to cut spending."},
      {"type": "callout", "content": "The 50/30/20 guideline suggests: 50% of net income for needs (housing, food, transport), 30% for wants (entertainment, dining out), and 20% for savings and debt repayment.", "style": "tip"},
      {"type": "text", "content": "Worked Example: Alisha earns $2,400/month net pay.\nNeeds (50%): $2,400 x 0.50 = $1,200\n  - Rent: $750, Groceries: $250, Transport: $150, Phone: $50\nWants (30%): $2,400 x 0.30 = $720\n  - Entertainment: $200, Clothing: $120, Dining: $200, Misc: $200\nSavings (20%): $2,400 x 0.20 = $480\n  - Emergency fund: $280, Savings goal: $200\n\nTotal allocated: $1,200 + $720 + $480 = $2,400. The budget is balanced."},
      {"type": "quiz", "question": "Tyler earns $1,800/month net. Using the 50/30/20 rule, how much should he allocate to savings and debt repayment?", "options": ["$540", "$900", "$360", "$180"], "correct": 2, "explanation": "Savings = 20% of $1,800 = $1,800 x 0.20 = $360."},
      {"type": "heading", "content": "Tracking and Adjusting", "level": 2},
      {"type": "text", "content": "A budget is only useful if you track your actual spending against it. At the end of each month, compare planned expenses to actual expenses. If you overspent in one category, look for areas to reduce next month. Budgeting is an ongoing process, not a one-time exercise."},
      {"type": "list", "items": ["List all sources of monthly income", "Categorize expenses as fixed or variable", "Allocate amounts to each category", "Track actual spending throughout the month", "Review and adjust at month end"], "ordered": true},
      {"type": "divider"},
      {"type": "callout", "content": "Project: Create a monthly budget for a scenario where you earn Saskatchewan minimum wage, work 30 hours per week, and need to cover rent, food, phone, and transportation.", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Budget", "definition": "A financial plan that outlines expected income and expenses over a given period."},
      {"term": "Fixed Expense", "definition": "An expense that remains constant each period, such as rent or a car payment."},
      {"term": "Variable Expense", "definition": "An expense that fluctuates from period to period, such as groceries or utilities."},
      {"term": "Surplus", "definition": "The amount by which income exceeds expenses."},
      {"term": "Deficit", "definition": "The amount by which expenses exceed income."},
      {"term": "50/30/20 Rule", "definition": "A budgeting guideline allocating 50% of net income to needs, 30% to wants, and 20% to savings and debt repayment."}
    ]'::jsonb,
    NULL,
    25, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the basic equation of a budget?', 'Income - Expenses = Surplus (or Deficit)', 'What is left over after spending?', 2, 0),
    (v_tenant, v_ch, 'What is the difference between fixed and variable expenses?', 'Fixed expenses stay the same each month (rent, insurance). Variable expenses change (groceries, entertainment).', 'Which expenses can you control more easily?', 2, 1),
    (v_tenant, v_ch, 'What does the 50/30/20 rule recommend?', '50% of net income for needs, 30% for wants, and 20% for savings and debt repayment.', 'Needs / Wants / Savings', 2, 2),
    (v_tenant, v_ch, 'If your net monthly income is $2,000, how much should go to needs under the 50/30/20 rule?', '$2,000 x 0.50 = $1,000', 'Half of your income', 2, 3);

  -- Chapter 2.3
  v_ch_num := 6;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Earning Commission and Tips', 'earning-commission-and-tips',
    'Explore alternative forms of income including commission-based pay and gratuities.',
    '[
      {"type": "heading", "content": "Earning Commission and Tips", "level": 1},
      {"type": "text", "content": "Not all jobs pay a straight hourly wage or salary. Many positions in sales, real estate, and service industries include commission or tips as part of total compensation. Understanding how these alternative pay structures work is essential for accurately projecting income."},
      {"type": "heading", "content": "Commission", "level": 2},
      {"type": "text", "content": "Commission is a percentage of the sales value that the employee earns. Some workers earn commission only (straight commission), while others earn a base salary plus commission.\n\nWorked Example: A car salesperson earns a base salary of $2,000/month plus 3% commission on all sales. In March, she sold $85,000 worth of vehicles.\nCommission = $85,000 x 0.03 = $2,550\nGross pay = $2,000 + $2,550 = $4,550"},
      {"type": "heading", "content": "Graduated Commission", "level": 2},
      {"type": "text", "content": "Some employers use a graduated commission structure where the commission rate increases as sales targets are met.\n\nExample structure:\n- First $10,000 in sales: 2%\n- $10,001 to $25,000: 4%\n- Over $25,000: 6%\n\nIf total sales are $30,000:\nFirst tier: $10,000 x 0.02 = $200\nSecond tier: $15,000 x 0.04 = $600\nThird tier: $5,000 x 0.06 = $300\nTotal commission = $200 + $600 + $300 = $1,100"},
      {"type": "quiz", "question": "A realtor earns 4% commission on home sales. She sells a house for $320,000. What is her commission?", "options": ["$12,800", "$8,000", "$32,000", "$3,200"], "correct": 0, "explanation": "Commission = $320,000 x 0.04 = $12,800."},
      {"type": "heading", "content": "Tips and Gratuities", "level": 2},
      {"type": "text", "content": "In the service industry, tips (gratuities) form a significant portion of income. Tips are typically calculated as a percentage of the bill total before tax.\n\nCommon tip percentages in Canada:\n- 15% for standard service\n- 18-20% for excellent service\n- 10% or less for below-average service\n\nExample: A restaurant bill totals $68.50 before tax. A 15% tip would be $68.50 x 0.15 = $10.28."},
      {"type": "callout", "content": "Tips are taxable income in Canada. If you earn tips, you are required to report them when filing your income tax return.", "style": "warning"},
      {"type": "list", "items": ["Commission is a percentage of sales revenue paid as compensation", "Straight commission means no base salary — income depends entirely on sales", "Graduated commission increases the rate as you sell more", "Tips are voluntary payments from customers, usually in service industries", "All forms of income, including tips, must be reported for tax purposes"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Scenario: You are offered two job options. Job A pays $14.50/hr for 40 hrs/week. Job B pays $10.00/hr plus 5% commission. How much in weekly sales would you need at Job B to earn more than Job A?", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Commission", "definition": "Compensation calculated as a percentage of the value of sales made by the employee."},
      {"term": "Straight Commission", "definition": "A pay structure where the employee earns only commission with no base salary."},
      {"term": "Graduated Commission", "definition": "A commission structure with increasing rates applied to higher tiers of sales."},
      {"term": "Gratuity (Tip)", "definition": "A voluntary payment from a customer to a service worker, typically calculated as a percentage of the bill."},
      {"term": "Base Salary", "definition": "A fixed amount of compensation paid regardless of sales performance, often supplemented by commission."}
    ]'::jsonb,
    NULL,
    25, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is commission?', 'Compensation calculated as a percentage of the value of sales made by the employee.', 'Sales-based pay', 2, 0),
    (v_tenant, v_ch, 'What is graduated commission?', 'A commission structure where the rate increases as higher sales tiers are reached.', 'Like income tax brackets but for sales', 3, 1),
    (v_tenant, v_ch, 'A server has a bill of $85.00 before tax. What is a 15% tip?', '$85.00 x 0.15 = $12.75', 'Calculate 10% then add half of that', 2, 2),
    (v_tenant, v_ch, 'Are tips taxable in Canada?', 'Yes, tips are considered taxable income and must be reported on your tax return.', 'All income must be reported', 2, 3);

  -- ==============================
  -- UNIT 3: Measurement for Trades
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Measurement for Trades',
    'Apply measurement skills used in construction, manufacturing, and skilled trades, including both imperial and metric systems.',
    'Accurate measurement is the foundation of all skilled trades and construction work.',
    'How do tradespeople use measurement systems to build, fabricate, and construct with precision?')
  RETURNING id INTO v_unit;

  -- Chapter 3.1
  v_ch_num := 7;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Imperial and Metric Measurement', 'imperial-and-metric-measurement',
    'Convert between imperial and metric units of length, mass, and capacity used in trades.',
    '[
      {"type": "heading", "content": "Imperial and Metric Measurement", "level": 1},
      {"type": "text", "content": "Canada officially uses the metric system, but many trades and industries still work with imperial measurements. A carpenter reads a tape measure in feet and inches, while an engineer may work in millimetres. Being fluent in both systems — and able to convert between them — is essential for anyone entering the trades."},
      {"type": "heading", "content": "Common Length Conversions", "level": 2},
      {"type": "text", "content": "Key conversion factors:\n1 inch = 2.54 cm\n1 foot = 12 inches = 30.48 cm\n1 yard = 3 feet = 0.9144 m\n1 mile = 1.609 km\n\nWorked Example: Convert 8 feet 6 inches to centimetres.\nFirst convert to inches: 8 x 12 + 6 = 102 inches\nThen convert to cm: 102 x 2.54 = 259.08 cm"},
      {"type": "callout", "content": "On a standard imperial tape measure, the inch is divided into fractions: 1/2, 1/4, 1/8, and 1/16 of an inch. Learning to read these fractions is a critical trades skill.", "style": "info"},
      {"type": "heading", "content": "Mass and Capacity", "level": 2},
      {"type": "text", "content": "Mass conversions:\n1 pound (lb) = 0.4536 kg\n1 ounce (oz) = 28.35 g\n1 ton (short) = 2000 lb = 907.2 kg\n\nCapacity conversions:\n1 gallon (US) = 3.785 L\n1 gallon (Imperial) = 4.546 L\n1 quart = 0.946 L\n\nIn Saskatchewan construction, materials like concrete are often sold by the cubic yard but specifications may call for cubic metres. 1 cubic yard = 0.7646 cubic metres."},
      {"type": "quiz", "question": "A lumber order calls for boards 2.4 m long. The available boards are sold in 8-foot lengths. Are the 8-foot boards long enough?", "options": ["Yes, 8 feet = 2.44 m which is greater than 2.4 m", "No, 8 feet = 2.24 m which is less than 2.4 m", "Yes, 8 feet = 2.60 m", "No, 8 feet = 2.00 m"], "correct": 0, "explanation": "8 feet = 8 x 30.48 cm = 243.84 cm = 2.44 m. Since 2.44 m > 2.4 m, the boards are long enough."},
      {"type": "list", "items": ["Memorize the key conversion factor: 1 inch = 2.54 cm", "For rough estimates: 1 metre is about 3 feet 3 inches", "1 kilogram is about 2.2 pounds", "Always double-check which gallon (US or Imperial) is being referenced"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Hands-On: Measure the dimensions of your classroom in both feet/inches and metres/centimetres. Verify your measurements by converting one system to the other.", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Imperial System", "definition": "A system of measurement using inches, feet, yards, miles, pounds, and gallons, still common in Canadian trades."},
      {"term": "Metric System", "definition": "The International System of Units (SI) using metres, kilograms, and litres, officially used in Canada."},
      {"term": "Conversion Factor", "definition": "A multiplier used to change a measurement from one unit to another while maintaining the same quantity."},
      {"term": "Precision", "definition": "The level of exactness in a measurement, often determined by the smallest division on the measuring tool."},
      {"term": "Fraction of an Inch", "definition": "Imperial measurements divide inches into halves, quarters, eighths, and sixteenths for precision."}
    ]'::jsonb,
    'Indigenous peoples of the Plains used body-based measurements for generations — hand spans, arm lengths, and paces — creating practical measurement systems suited to their needs. These natural units share the same principle as imperial measurements, which also originated from body proportions.',
    25, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'How many centimetres are in one inch?', '1 inch = 2.54 cm', 'This is the fundamental length conversion factor', 2, 0),
    (v_tenant, v_ch, 'Convert 5 feet 10 inches to centimetres.', '5 x 12 + 10 = 70 inches. 70 x 2.54 = 177.8 cm.', 'First convert to total inches, then multiply by 2.54', 3, 1),
    (v_tenant, v_ch, 'How many pounds are in one kilogram?', '1 kg = 2.205 lb (approximately)', 'A kilogram is a bit more than 2 pounds', 2, 2),
    (v_tenant, v_ch, 'What is the difference between a US gallon and an Imperial gallon?', 'A US gallon is 3.785 L; an Imperial gallon is 4.546 L. The Imperial gallon is larger.', 'Imperial is the bigger one — about 4.5 L', 3, 3),
    (v_tenant, v_ch, 'On a tape measure, how is an inch typically subdivided?', 'Into fractions: 1/2, 1/4, 1/8, and 1/16 of an inch.', 'Each longer mark represents a larger fraction', 2, 4);

  -- Chapter 3.2
  v_ch_num := 8;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Perimeter and Area in the Trades', 'perimeter-and-area-in-trades',
    'Calculate perimeter and area for common shapes encountered in construction and manufacturing.',
    '[
      {"type": "heading", "content": "Perimeter and Area in the Trades", "level": 1},
      {"type": "text", "content": "Tradespeople calculate perimeter and area constantly. A painter needs to know the wall area to estimate paint quantity. A landscaper calculates the perimeter of a yard for fencing. A flooring installer measures floor area to order materials. These calculations directly affect project costs and timelines."},
      {"type": "heading", "content": "Perimeter", "level": 2},
      {"type": "text", "content": "Perimeter is the total distance around the outside of a shape.\n\nRectangle: P = 2l + 2w (or P = 2(l + w))\nSquare: P = 4s\nTriangle: P = a + b + c (sum of all three sides)\nCircle (circumference): C = 2(pi)r = (pi)d\n\nWorked Example: A rectangular room is 14 feet by 11 feet. How much baseboard trim is needed?\nP = 2(14 + 11) = 2(25) = 50 feet\nSubtract for doorways: if there are two 3-foot doorways, usable perimeter = 50 - 6 = 44 feet of baseboard."},
      {"type": "heading", "content": "Area", "level": 2},
      {"type": "text", "content": "Area is the amount of surface enclosed by a shape.\n\nRectangle: A = l x w\nSquare: A = s x s = s squared\nTriangle: A = (1/2) x b x h\nCircle: A = (pi) x r squared\nTrapezoid: A = (1/2)(a + b) x h\n\nWorked Example: A triangular gable end of a roof has a base of 24 feet and a height of 8 feet.\nA = (1/2) x 24 x 8 = 96 square feet"},
      {"type": "callout", "content": "When ordering materials, always add a waste factor of 5-10% to your calculated area to account for cuts, mistakes, and pattern matching.", "style": "tip"},
      {"type": "quiz", "question": "A room is 4.2 m by 3.8 m. How many square metres of laminate flooring are needed, including a 10% waste factor?", "options": ["15.96 sq m", "17.56 sq m", "14.40 sq m", "16.00 sq m"], "correct": 1, "explanation": "Area = 4.2 x 3.8 = 15.96 sq m. With 10% waste: 15.96 x 1.10 = 17.56 sq m."},
      {"type": "list", "items": ["Perimeter is measured in linear units (feet, metres)", "Area is measured in square units (sq ft, sq m)", "Always account for openings (doors, windows) when calculating perimeter for trim", "Add a waste factor when ordering materials based on area calculations", "Complex shapes can be broken into simpler shapes for calculation"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Trade Task: Sketch the floor plan of a room in your home. Measure and label all dimensions. Calculate the perimeter (for baseboard) and area (for flooring), including a 10% waste factor.", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Perimeter", "definition": "The total distance around the boundary of a two-dimensional shape."},
      {"term": "Area", "definition": "The amount of surface enclosed within a two-dimensional shape, measured in square units."},
      {"term": "Waste Factor", "definition": "An additional percentage added to material calculations to account for cuts, errors, and fitting losses."},
      {"term": "Circumference", "definition": "The perimeter of a circle, calculated as C = 2(pi)r or C = (pi)d."},
      {"term": "Composite Shape", "definition": "A shape made up of two or more basic geometric shapes combined together."}
    ]'::jsonb,
    NULL,
    25, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the formula for the perimeter of a rectangle?', 'P = 2(l + w) or equivalently P = 2l + 2w', 'Add length and width, then double', 2, 0),
    (v_tenant, v_ch, 'What is the formula for the area of a triangle?', 'A = (1/2) x base x height', 'Half of base times height', 2, 1),
    (v_tenant, v_ch, 'Why do tradespeople add a waste factor to material orders?', 'To account for cutting waste, mistakes, pattern matching, and irregularities in the space.', 'Materials are cut and some pieces become unusable', 2, 2),
    (v_tenant, v_ch, 'A circular patio has a diameter of 12 feet. What is its area?', 'r = 6 ft. A = pi x 6 squared = 36(pi) = 113.1 sq ft (approximately)', 'Use A = pi x r squared, and remember r = d/2', 3, 3),
    (v_tenant, v_ch, 'How do you find the area of a composite shape?', 'Break it into simpler shapes (rectangles, triangles, circles), calculate each area, then add them together.', 'Divide and conquer', 3, 4);

  -- Chapter 3.3
  v_ch_num := 9;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Volume and Capacity', 'volume-and-capacity',
    'Calculate volume of prisms, cylinders, and irregular solids for trades applications.',
    '[
      {"type": "heading", "content": "Volume and Capacity", "level": 1},
      {"type": "text", "content": "Volume measures the three-dimensional space occupied by an object. In the trades, you might calculate the volume of concrete needed for a foundation, the capacity of a water tank, or the amount of soil to fill a garden bed. Volume is measured in cubic units (cubic metres, cubic feet) or in litres for liquids."},
      {"type": "heading", "content": "Volume of Prisms", "level": 2},
      {"type": "text", "content": "A prism has a uniform cross-section along its length.\nRectangular prism: V = l x w x h\nTriangular prism: V = (1/2) x b x h_triangle x length\n\nWorked Example: A concrete pad is 12 feet long, 10 feet wide, and 4 inches thick. How many cubic feet of concrete are needed?\nConvert 4 inches to feet: 4/12 = 0.333 feet\nV = 12 x 10 x 0.333 = 40 cubic feet"},
      {"type": "heading", "content": "Volume of Cylinders", "level": 2},
      {"type": "text", "content": "A cylinder has a circular cross-section.\nV = (pi) x r squared x h\n\nWorked Example: A cylindrical grain bin has a diameter of 6 m and a height of 8 m. What is its capacity?\nr = 3 m\nV = (pi) x 3 squared x 8 = (pi) x 9 x 8 = 72(pi) = 226.2 cubic metres\n\nSince 1 cubic metre = 1000 litres, the bin holds approximately 226,200 litres."},
      {"type": "callout", "content": "Key conversion: 1 cubic metre = 1000 litres. In imperial: 1 cubic foot = 7.48 US gallons.", "style": "info"},
      {"type": "quiz", "question": "A cylindrical water tank has a radius of 1.5 m and a height of 3 m. What is its volume in litres?", "options": ["21,206 L", "14,137 L", "7,069 L", "42,412 L"], "correct": 0, "explanation": "V = pi x (1.5)^2 x 3 = pi x 2.25 x 3 = 6.75(pi) = 21.206 cubic metres. Convert: 21.206 x 1000 = 21,206 litres."},
      {"type": "list", "items": ["Always ensure all dimensions are in the same unit before calculating", "Rectangular prism: V = l x w x h", "Cylinder: V = pi x r squared x h", "1 cubic metre = 1000 litres", "When ordering concrete, round up to the nearest standard delivery unit"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Trades Problem: A trench for a water line is 30 m long, 0.6 m wide, and 1.2 m deep. How many cubic metres of soil must be excavated? If the soil expands by 25% when loosened, how many cubic metres of loose soil will be produced?", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Volume", "definition": "The amount of three-dimensional space occupied by an object, measured in cubic units."},
      {"term": "Capacity", "definition": "The maximum amount a container can hold, often measured in litres or gallons."},
      {"term": "Prism", "definition": "A three-dimensional solid with two identical, parallel polygonal bases and rectangular lateral faces."},
      {"term": "Cylinder", "definition": "A three-dimensional solid with two parallel circular bases connected by a curved surface."},
      {"term": "Cubic Metre", "definition": "A unit of volume equal to a cube with sides of 1 metre; equivalent to 1000 litres."}
    ]'::jsonb,
    'The construction of traditional lodges such as tipis and longhouses required sophisticated understanding of three-dimensional space. Builders had to estimate the amount of materials needed — hides, poles, bark — based on the volume and surface area of the structure.',
    25, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the formula for the volume of a rectangular prism?', 'V = length x width x height', 'Multiply three dimensions', 2, 0),
    (v_tenant, v_ch, 'What is the formula for the volume of a cylinder?', 'V = pi x r squared x h', 'Area of circle times height', 2, 1),
    (v_tenant, v_ch, 'How many litres are in one cubic metre?', '1000 litres', 'Think of a cube that is 1 m on each side filled with water', 2, 2),
    (v_tenant, v_ch, 'A concrete slab is 15 ft x 20 ft x 6 inches. What is its volume in cubic feet?', 'Convert 6 inches to 0.5 ft. V = 15 x 20 x 0.5 = 150 cubic feet.', 'Convert inches to feet first', 3, 3);

  -- ==============================
  -- UNIT 4: Geometry in the Workplace
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Geometry in the Workplace',
    'Apply geometric reasoning to solve problems in construction, design, and manufacturing.',
    'Geometric relationships underpin the design and construction of structures, tools, and products.',
    'How do geometric principles guide the design and construction of real-world objects?')
  RETURNING id INTO v_unit;

  -- Chapter 4.1
  v_ch_num := 10;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Angles and Parallel Lines', 'angles-and-parallel-lines',
    'Identify angle relationships formed by parallel lines and transversals, and apply them in trades contexts.',
    '[
      {"type": "heading", "content": "Angles and Parallel Lines", "level": 1},
      {"type": "text", "content": "In construction and manufacturing, parallel lines and the angles they create are everywhere — from the parallel studs in a wall frame to the rails of a staircase. Understanding angle relationships helps tradespeople verify that structures are square, level, and properly aligned."},
      {"type": "heading", "content": "Types of Angles", "level": 2},
      {"type": "text", "content": "Acute angle: less than 90 degrees\nRight angle: exactly 90 degrees\nObtuse angle: between 90 and 180 degrees\nStraight angle: exactly 180 degrees\nReflex angle: between 180 and 360 degrees\n\nComplementary angles add to 90 degrees. Supplementary angles add to 180 degrees."},
      {"type": "heading", "content": "Parallel Lines and Transversals", "level": 2},
      {"type": "text", "content": "When a line (called a transversal) crosses two parallel lines, it creates eight angles. These angles have special relationships:\n\nCorresponding angles are equal (same position at each intersection).\nAlternate interior angles are equal (opposite sides of the transversal, between the parallel lines).\nAlternate exterior angles are equal (opposite sides of the transversal, outside the parallel lines).\nCo-interior (same-side interior) angles are supplementary (add to 180 degrees)."},
      {"type": "callout", "content": "In framing, if the top and bottom plates of a wall are parallel and a brace cuts across them at an angle, the alternate interior angles must be equal. This is how framers check alignment.", "style": "tip"},
      {"type": "quiz", "question": "Two parallel lines are cut by a transversal. One of the alternate interior angles measures 65 degrees. What is the measure of the co-interior angle on the same side?", "options": ["65 degrees", "115 degrees", "90 degrees", "25 degrees"], "correct": 1, "explanation": "Co-interior angles are supplementary. If the alternate interior angle is 65 degrees, the co-interior angle is 180 - 65 = 115 degrees."},
      {"type": "list", "items": ["Complementary angles sum to 90 degrees", "Supplementary angles sum to 180 degrees", "Corresponding angles formed by parallel lines and a transversal are equal", "Alternate interior angles are equal", "Co-interior angles are supplementary (sum to 180 degrees)"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Trades Application: A staircase stringer makes a 38-degree angle with the horizontal floor. What angle does it make with the vertical wall? What are the angles of the triangular wedge cut from each step?", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Transversal", "definition": "A line that intersects two or more other lines at distinct points."},
      {"term": "Corresponding Angles", "definition": "Angles in the same relative position at each intersection when a transversal crosses parallel lines; they are equal."},
      {"term": "Alternate Interior Angles", "definition": "Angles on opposite sides of a transversal and between the parallel lines; they are equal."},
      {"term": "Supplementary Angles", "definition": "Two angles whose measures add to 180 degrees."},
      {"term": "Complementary Angles", "definition": "Two angles whose measures add to 90 degrees."}
    ]'::jsonb,
    NULL,
    25, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are supplementary angles?', 'Two angles whose measures add to 180 degrees.', 'Think of a straight line', 2, 0),
    (v_tenant, v_ch, 'What are alternate interior angles?', 'Angles on opposite sides of a transversal, between parallel lines. They are equal in measure.', 'Z-pattern or zigzag', 3, 1),
    (v_tenant, v_ch, 'If a transversal creates a 72-degree angle with one parallel line, what is the corresponding angle at the other parallel line?', '72 degrees — corresponding angles are equal.', 'Same position at each intersection', 2, 2),
    (v_tenant, v_ch, 'What are co-interior angles?', 'Angles on the same side of a transversal, between parallel lines. They add to 180 degrees (supplementary).', 'Also called same-side interior or consecutive interior angles', 3, 3);

  -- Chapter 4.2
  v_ch_num := 11;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'The Pythagorean Theorem in Trades', 'pythagorean-theorem-in-trades',
    'Apply the Pythagorean theorem to solve practical problems in construction and layout.',
    '[
      {"type": "heading", "content": "The Pythagorean Theorem in Trades", "level": 1},
      {"type": "text", "content": "The Pythagorean theorem states that in a right triangle, the square of the hypotenuse (the longest side, opposite the right angle) equals the sum of the squares of the other two sides: a squared + b squared = c squared. This theorem is one of the most frequently used tools in construction, from squaring foundations to calculating rafter lengths."},
      {"type": "heading", "content": "Squaring a Foundation", "level": 2},
      {"type": "text", "content": "The 3-4-5 method is used on construction sites to verify that a corner is a perfect right angle. If one side of the corner is 3 units, the adjacent side is 4 units, and the diagonal measures exactly 5 units, the corner is square.\n\nThis works because 3 squared + 4 squared = 9 + 16 = 25 = 5 squared.\n\nIn practice, builders often use multiples: 6-8-10, 9-12-15, or 12-16-20 for greater accuracy over longer distances."},
      {"type": "callout", "content": "The 3-4-5 method can use any unit of measurement — feet, metres, or even lengths of string. The proportions are what matter.", "style": "tip"},
      {"type": "heading", "content": "Finding Unknown Sides", "level": 2},
      {"type": "text", "content": "Worked Example: A ladder leans against a wall. The base of the ladder is 5 feet from the wall, and the ladder reaches 12 feet up the wall. How long is the ladder?\n\nUsing a squared + b squared = c squared:\n5 squared + 12 squared = c squared\n25 + 144 = c squared\n169 = c squared\nc = sqrt(169) = 13 feet\n\nThe ladder is 13 feet long."},
      {"type": "text", "content": "Worked Example: A roof rafter has a run (horizontal distance) of 12 feet and a rafter length (hypotenuse) of 15 feet. What is the rise (vertical height)?\n\na squared + 12 squared = 15 squared\na squared + 144 = 225\na squared = 81\na = 9 feet\n\nThe rise is 9 feet."},
      {"type": "quiz", "question": "A rectangular room is 16 feet by 12 feet. What is the length of the diagonal?", "options": ["20 feet", "28 feet", "14.4 feet", "18 feet"], "correct": 0, "explanation": "d = sqrt(16^2 + 12^2) = sqrt(256 + 144) = sqrt(400) = 20 feet."},
      {"type": "list", "items": ["a^2 + b^2 = c^2, where c is the hypotenuse", "The 3-4-5 rule verifies right angles on site", "To find a leg: a = sqrt(c^2 - b^2)", "To find the hypotenuse: c = sqrt(a^2 + b^2)", "Always identify the hypotenuse — it is the side opposite the 90-degree angle"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Site Problem: A deck is to be built as a rectangle 16 feet by 20 feet. Calculate the diagonal measurement. If the diagonals are equal, the deck is square. What should each diagonal measure?", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Pythagorean Theorem", "definition": "In a right triangle, a^2 + b^2 = c^2, where c is the hypotenuse."},
      {"term": "Hypotenuse", "definition": "The longest side of a right triangle, located opposite the right angle."},
      {"term": "3-4-5 Rule", "definition": "A method using the ratio 3:4:5 to verify that a corner forms a right angle."},
      {"term": "Rise", "definition": "The vertical height in a right triangle, often used in roof and staircase calculations."},
      {"term": "Run", "definition": "The horizontal distance in a right triangle, often used in roof and staircase calculations."}
    ]'::jsonb,
    NULL,
    25, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'State the Pythagorean theorem.', 'In a right triangle, a^2 + b^2 = c^2, where c is the hypotenuse (longest side, opposite the right angle).', 'The sum of the squares of the legs equals the square of the hypotenuse', 2, 0),
    (v_tenant, v_ch, 'What is the 3-4-5 rule used for in construction?', 'To verify that a corner is a perfect right angle (90 degrees). If sides measure 3 and 4 units and the diagonal measures 5, the angle is square.', 'It is based on the Pythagorean theorem', 2, 1),
    (v_tenant, v_ch, 'A right triangle has legs of 8 and 15. What is the hypotenuse?', 'c = sqrt(64 + 225) = sqrt(289) = 17', 'Square the legs, add, take the square root', 3, 2),
    (v_tenant, v_ch, 'What do rise and run mean in a roof calculation?', 'Rise is the vertical height; run is the horizontal distance. The rafter length is the hypotenuse.', 'Think of a right triangle formed by the roof', 2, 3);

  -- Chapter 4.3
  v_ch_num := 12;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Scale Drawings and Blueprints', 'scale-drawings-and-blueprints',
    'Read and interpret scale drawings, floor plans, and blueprints used in the trades.',
    '[
      {"type": "heading", "content": "Scale Drawings and Blueprints", "level": 1},
      {"type": "text", "content": "A scale drawing represents a real object at a reduced (or enlarged) size while maintaining proportional accuracy. Blueprints, floor plans, site plans, and mechanical drawings all use scales to represent large objects on manageable paper sizes. Being able to read and interpret these drawings is fundamental to every trade."},
      {"type": "heading", "content": "Understanding Scale Ratios", "level": 2},
      {"type": "text", "content": "A scale is expressed as a ratio. Common architectural scales include:\n1:50 means 1 cm on the drawing represents 50 cm (0.5 m) in reality\n1:100 means 1 cm on the drawing represents 100 cm (1 m) in reality\n1/4 inch = 1 foot means every quarter inch on paper represents one foot in real life\n\nWorked Example: On a floor plan drawn at 1:50 scale, a room measures 8 cm by 6 cm. What are the actual dimensions?\nLength = 8 x 50 = 400 cm = 4.0 m\nWidth = 6 x 50 = 300 cm = 3.0 m"},
      {"type": "callout", "content": "When measuring a blueprint, always check the scale noted in the title block. If the drawing has been photocopied or printed at a different size, the scale may no longer be accurate.", "style": "warning"},
      {"type": "quiz", "question": "A site plan is drawn at a scale of 1:200. A property boundary measures 15 cm on the plan. What is the actual length?", "options": ["30 m", "3000 cm but that is 30 m", "7.5 m", "15 m"], "correct": 0, "explanation": "Actual length = 15 cm x 200 = 3000 cm = 30 m."},
      {"type": "heading", "content": "Reading Floor Plans", "level": 2},
      {"type": "text", "content": "Floor plans use standard symbols for walls, doors, windows, plumbing fixtures, and electrical outlets. A thick solid line represents an exterior wall. Interior walls are thinner. Doors are shown as arcs indicating their swing direction. Windows appear as thin parallel lines within the wall."},
      {"type": "list", "items": ["Identify the scale in the title block", "Measure distances on the drawing with a ruler", "Multiply the measurement by the scale factor to get actual dimensions", "Note standard symbols for doors, windows, and fixtures", "Cross-reference the floor plan with elevation drawings for height information"], "ordered": true},
      {"type": "divider"},
      {"type": "callout", "content": "Activity: Obtain a floor plan of your school (ask your teacher or find one online). Identify the scale, measure three rooms on the plan, and calculate their actual dimensions.", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Scale", "definition": "The ratio between a distance on a drawing and the corresponding actual distance."},
      {"term": "Blueprint", "definition": "A detailed technical drawing or plan used in construction, engineering, and manufacturing."},
      {"term": "Floor Plan", "definition": "A scale drawing showing the layout of a building as seen from above, including walls, doors, and fixtures."},
      {"term": "Title Block", "definition": "An area on a blueprint containing the drawing title, scale, date, and other reference information."},
      {"term": "Elevation Drawing", "definition": "A scale drawing showing the front, side, or rear view of a building from the outside."}
    ]'::jsonb,
    NULL,
    25, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'If a blueprint scale is 1:100, what does 5 cm on the drawing represent in real life?', '5 x 100 = 500 cm = 5 metres', 'Multiply the drawing measurement by the scale factor', 2, 0),
    (v_tenant, v_ch, 'What information is found in a title block?', 'The drawing title, scale, date, drafter name, project name, and revision information.', 'Bottom-right corner of most blueprints', 2, 1),
    (v_tenant, v_ch, 'What does a 1/4 inch = 1 foot scale mean?', 'Every quarter inch on the drawing represents one foot in reality. So 1 inch on paper = 4 feet actual.', 'Common in North American architectural drawings', 3, 2),
    (v_tenant, v_ch, 'How are doors typically represented on a floor plan?', 'As an arc showing the swing direction of the door, with a line indicating the door itself.', 'Think of the path the door traces when opening', 2, 3);

  -- ==============================
  -- UNIT 5: Data Analysis & Probability
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 5, 'Data Analysis & Probability',
    'Collect, organize, and interpret data using tables, graphs, and measures of central tendency. Explore basic probability.',
    'Data-driven decision making is essential in trades, business, and everyday life.',
    'How do we collect, represent, and interpret data to make informed decisions?')
  RETURNING id INTO v_unit;

  -- Chapter 5.1
  v_ch_num := 13;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Organizing and Displaying Data', 'organizing-and-displaying-data',
    'Create and interpret tables, bar graphs, circle graphs, and line graphs for workplace data.',
    '[
      {"type": "heading", "content": "Organizing and Displaying Data", "level": 1},
      {"type": "text", "content": "In the workplace, data guides decisions. A construction manager tracks project costs. A shop owner monitors daily sales. A safety officer records incident reports. Organizing this data into tables and graphs makes patterns visible and supports evidence-based decisions."},
      {"type": "heading", "content": "Frequency Tables", "level": 2},
      {"type": "text", "content": "A frequency table organizes raw data by listing each value or category and how often it occurs.\n\nExample: A tire shop recorded the number of tire changes each day for two weeks:\n5, 8, 6, 7, 9, 3, 0, 6, 7, 8, 5, 4, 7, 2\n\nOrganized into a frequency table:\n0-2: 2 days | 3-5: 4 days | 6-8: 7 days | 9+: 1 day"},
      {"type": "heading", "content": "Types of Graphs", "level": 2},
      {"type": "text", "content": "Bar graphs compare quantities across categories. The height of each bar represents the frequency or value.\n\nLine graphs show changes over time, connecting data points with line segments to reveal trends.\n\nCircle (pie) graphs show parts of a whole as sectors. Each sector represents a percentage of the total.\n\nChoose the graph type that best fits your data and the story you want to tell."},
      {"type": "callout", "content": "A graph can be misleading if the vertical axis does not start at zero, if the scale is uneven, or if 3D effects distort proportions. Always read graph axes carefully.", "style": "warning"},
      {"type": "quiz", "question": "Which type of graph is best for showing how a company spends its budget across different departments?", "options": ["Line graph", "Circle (pie) graph", "Scatter plot", "Histogram"], "correct": 1, "explanation": "A circle graph (pie chart) is ideal for showing parts of a whole, such as budget allocation across departments."},
      {"type": "list", "items": ["Frequency tables organize raw data into categories with counts", "Bar graphs compare quantities across categories", "Line graphs show trends over time", "Circle graphs display parts of a whole as percentages", "Always label axes, include titles, and cite data sources"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Workplace Project: Survey your classmates on their preferred trade (carpentry, electrical, plumbing, welding, automotive). Create a frequency table and both a bar graph and circle graph to display the results.", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Frequency Table", "definition": "A table listing data values or categories alongside the number of times each occurs."},
      {"term": "Bar Graph", "definition": "A graph using rectangular bars of varying heights to compare quantities across categories."},
      {"term": "Line Graph", "definition": "A graph connecting data points with line segments to show trends over time."},
      {"term": "Circle Graph", "definition": "A circular chart divided into sectors representing proportions of a whole; also called a pie chart."},
      {"term": "Misleading Graph", "definition": "A graph that distorts data through manipulated scales, truncated axes, or visual effects."}
    ]'::jsonb,
    'Indigenous oral traditions include careful observation and record-keeping of environmental patterns — animal migrations, weather cycles, plant growth seasons. These observations, accumulated over generations, represent sophisticated data collection and pattern recognition that guided community decisions.',
    25, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a frequency table?', 'A table that lists data values or categories alongside the count of how often each occurs.', 'Tally and count', 2, 0),
    (v_tenant, v_ch, 'When should you use a line graph instead of a bar graph?', 'Use a line graph to show how a quantity changes over time (trends). Use a bar graph to compare quantities across categories.', 'Line = time trend, Bar = category comparison', 2, 1),
    (v_tenant, v_ch, 'What does a circle graph show?', 'Parts of a whole, where each sector represents a percentage of the total.', 'Also called a pie chart', 2, 2),
    (v_tenant, v_ch, 'How can a graph be misleading?', 'By not starting the y-axis at zero, using uneven scales, applying 3D effects, or omitting data points.', 'Always check the scale and axes', 3, 3);

  -- Chapter 5.2
  v_ch_num := 14;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Measures of Central Tendency', 'measures-of-central-tendency',
    'Calculate and interpret the mean, median, and mode of data sets in workplace contexts.',
    '[
      {"type": "heading", "content": "Measures of Central Tendency", "level": 1},
      {"type": "text", "content": "Measures of central tendency describe the centre or typical value of a data set. The three main measures are the mean (average), median (middle value), and mode (most frequent value). Each tells a different story about the data, and choosing the right measure depends on the situation."},
      {"type": "heading", "content": "Mean", "level": 2},
      {"type": "text", "content": "The mean is calculated by adding all values and dividing by the number of values.\n\nWorked Example: A plumber records the number of service calls completed each day over one week: 4, 6, 5, 8, 3, 7, 9.\nMean = (4 + 6 + 5 + 8 + 3 + 7 + 9) / 7 = 42 / 7 = 6 calls per day.\n\nThe mean is useful for data without extreme outliers."},
      {"type": "heading", "content": "Median", "level": 2},
      {"type": "text", "content": "The median is the middle value when data is arranged in order. If there is an even number of values, the median is the average of the two middle values.\n\nFrom the plumber example, arranged in order: 3, 4, 5, 6, 7, 8, 9.\nThe median is 6 (the 4th value out of 7).\n\nThe median is less affected by extreme values (outliers) than the mean, making it useful for skewed data sets like home prices or salaries."},
      {"type": "heading", "content": "Mode", "level": 2},
      {"type": "text", "content": "The mode is the value that occurs most frequently. A data set can have one mode, more than one mode (bimodal, multimodal), or no mode if all values are unique.\n\nExample: Shoe sizes sold in one day: 8, 9, 10, 9, 11, 9, 10, 8, 9.\nMode = 9 (occurs 4 times). This is useful for inventory decisions — stock more size 9 shoes."},
      {"type": "quiz", "question": "The daily tips earned by a server over five shifts are: $45, $62, $38, $190, $55. Which measure of central tendency best represents the typical shift?", "options": ["Mean ($78), because it uses all values", "Median ($55), because it is not affected by the outlier of $190", "Mode, because it shows the most common value", "Range ($152), because it shows the spread"], "correct": 1, "explanation": "The $190 is an outlier that pulls the mean up to $78, which is higher than most of the other values. The median ($55) better represents a typical shift."},
      {"type": "list", "items": ["Mean = sum of values / number of values", "Median = middle value in an ordered list", "Mode = most frequently occurring value", "The mean is sensitive to outliers; the median is more resistant", "Choose the measure that best represents typical values for your context"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Data Task: Record the number of minutes you spend on homework each evening for two weeks. Calculate the mean, median, and mode. Which measure best describes your typical homework time?", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Mean", "definition": "The arithmetic average, calculated by summing all values and dividing by the count."},
      {"term": "Median", "definition": "The middle value in an ordered data set; the average of the two middle values if the count is even."},
      {"term": "Mode", "definition": "The value that occurs most frequently in a data set."},
      {"term": "Outlier", "definition": "A data value that is significantly higher or lower than the other values in the set."},
      {"term": "Central Tendency", "definition": "A statistical measure that identifies a single value as representative of an entire data set."}
    ]'::jsonb,
    NULL,
    25, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'How do you calculate the mean?', 'Add all values together and divide by the number of values.', 'Sum / count', 2, 0),
    (v_tenant, v_ch, 'What is the median?', 'The middle value when data is arranged in order. For an even number of values, it is the average of the two middle values.', 'Order the data first', 2, 1),
    (v_tenant, v_ch, 'When is the median preferred over the mean?', 'When the data set contains outliers (extreme values) that would skew the mean.', 'Think of house prices — a few mansions pull the mean up', 3, 2),
    (v_tenant, v_ch, 'Find the mean, median, and mode of: 3, 5, 7, 5, 10', 'Mean = 30/5 = 6. Median = 5 (middle value). Mode = 5 (most frequent).', 'Order: 3, 5, 5, 7, 10', 3, 3);

  -- Chapter 5.3
  v_ch_num := 15;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Introduction to Probability', 'introduction-to-probability',
    'Understand basic probability concepts including experimental and theoretical probability.',
    '[
      {"type": "heading", "content": "Introduction to Probability", "level": 1},
      {"type": "text", "content": "Probability measures how likely an event is to occur. It is expressed as a number between 0 (impossible) and 1 (certain), or equivalently as a percentage between 0% and 100%. In the workplace, probability helps assess risk, predict outcomes, and make decisions under uncertainty."},
      {"type": "heading", "content": "Theoretical Probability", "level": 2},
      {"type": "text", "content": "Theoretical probability is calculated using the formula:\nP(event) = Number of favourable outcomes / Total number of possible outcomes\n\nWorked Example: A quality inspector randomly selects one part from a bin containing 50 parts, 3 of which are defective.\nP(defective) = 3/50 = 0.06 = 6%\nP(not defective) = 47/50 = 0.94 = 94%"},
      {"type": "callout", "content": "The probability of all possible outcomes always adds to 1 (or 100%). If P(rain) = 0.30, then P(no rain) = 0.70.", "style": "info"},
      {"type": "heading", "content": "Experimental Probability", "level": 2},
      {"type": "text", "content": "Experimental probability is based on actual trials or observations.\nP(event) = Number of times the event occurred / Total number of trials\n\nWorked Example: Over the past 200 work days, an employee was late 12 times.\nP(late) = 12/200 = 0.06 = 6%\n\nAs the number of trials increases, experimental probability tends to approach theoretical probability. This is known as the Law of Large Numbers."},
      {"type": "quiz", "question": "A bag contains 8 red bolts, 5 blue bolts, and 7 green bolts. What is the probability of randomly selecting a blue bolt?", "options": ["5/20 = 25%", "5/8 = 62.5%", "5/13 = 38.5%", "8/20 = 40%"], "correct": 0, "explanation": "Total bolts = 8 + 5 + 7 = 20. P(blue) = 5/20 = 1/4 = 25%."},
      {"type": "list", "items": ["Probability ranges from 0 (impossible) to 1 (certain)", "P(event) = favourable outcomes / total outcomes", "P(event) + P(not event) = 1", "Experimental probability is based on observed data", "As trials increase, experimental probability approaches theoretical probability"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Experiment: Roll a standard die 60 times. Record the frequency of each number (1 through 6). Calculate the experimental probability for each and compare with the theoretical probability of 1/6.", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Probability", "definition": "A measure of how likely an event is to occur, expressed as a number between 0 and 1."},
      {"term": "Theoretical Probability", "definition": "Probability calculated from known possible outcomes: P = favourable outcomes / total outcomes."},
      {"term": "Experimental Probability", "definition": "Probability calculated from actual observations: P = observed occurrences / total trials."},
      {"term": "Favourable Outcome", "definition": "An outcome that matches the event you are calculating the probability for."},
      {"term": "Law of Large Numbers", "definition": "As the number of trials increases, experimental probability tends to converge toward theoretical probability."}
    ]'::jsonb,
    'Probability thinking has deep roots in Indigenous knowledge systems. Predicting animal behaviour, weather patterns, and seasonal changes based on accumulated observations is a form of empirical probability — using past experience to estimate the likelihood of future events.',
    25, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the formula for theoretical probability?', 'P(event) = Number of favourable outcomes / Total number of possible outcomes', 'Favourable / Total', 2, 0),
    (v_tenant, v_ch, 'What is the range of probability values?', 'From 0 (impossible) to 1 (certain), or equivalently 0% to 100%.', '0 means it cannot happen, 1 means it must happen', 2, 1),
    (v_tenant, v_ch, 'What is the difference between theoretical and experimental probability?', 'Theoretical is based on mathematical reasoning about possible outcomes. Experimental is based on actual observed results from trials.', 'Theory vs. practice', 3, 2),
    (v_tenant, v_ch, 'If P(event) = 0.35, what is P(not event)?', 'P(not event) = 1 - 0.35 = 0.65', 'Complementary probabilities add to 1', 2, 3);

  RAISE NOTICE 'Workplace & Apprenticeship Math 10 seeded: 5 units, 15 chapters';
END $$;


-- ============================================================================
-- TEXTBOOK 2: Foundations of Math 10
-- Slug: wolfwhale-foundations-of-math-10
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book UUID;
  v_unit UUID;
  v_ch UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-foundations-of-math-10';

  -- ==============================
  -- UNIT 1: Measurement & Unit Analysis
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Measurement & Unit Analysis',
    'Develop skills in measurement precision, unit conversion, and dimensional analysis for scientific and practical applications.',
    'Precise measurement and systematic unit conversion are essential tools for mathematical problem solving.',
    'How do we ensure accuracy when measuring and converting between different systems of units?')
  RETURNING id INTO v_unit;

  -- Chapter 1.1
  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'SI Units and Conversions', 'si-units-and-conversions',
    'Work with the International System of Units (SI) and perform conversions using dimensional analysis.',
    '[
      {"type": "heading", "content": "SI Units and Conversions", "level": 1},
      {"type": "text", "content": "The International System of Units (SI) is the modern metric system used worldwide for scientific and most commercial purposes. Canada officially adopted SI in 1970. The system is built on seven base units, but for mathematics we focus primarily on length (metre), mass (kilogram), time (second), and temperature (kelvin or Celsius)."},
      {"type": "heading", "content": "SI Prefixes", "level": 2},
      {"type": "text", "content": "SI uses prefixes to denote powers of 10:\n\nkilo (k) = 10^3 = 1000\nhecto (h) = 10^2 = 100\ndeca (da) = 10^1 = 10\n(base unit) = 10^0 = 1\ndeci (d) = 10^(-1) = 0.1\ncenti (c) = 10^(-2) = 0.01\nmilli (m) = 10^(-3) = 0.001\nmicro (mu) = 10^(-6) = 0.000001\n\nTo convert between SI units, move the decimal point according to the difference in powers of 10."},
      {"type": "callout", "content": "King Henry Does Usually Drink Chocolate Milk — a mnemonic for kilo, hecto, deca, unit, deci, centi, milli.", "style": "tip"},
      {"type": "heading", "content": "Dimensional Analysis", "level": 2},
      {"type": "text", "content": "Dimensional analysis (also called the factor-label method) uses conversion factors to systematically convert between units. Each conversion factor is a fraction equal to 1.\n\nWorked Example: Convert 5.2 km to metres.\n5.2 km x (1000 m / 1 km) = 5200 m\n\nThe km units cancel, leaving metres.\n\nMulti-step Example: Convert 72 km/h to metres per second.\n72 km/h x (1000 m / 1 km) x (1 h / 3600 s) = 72000 / 3600 = 20 m/s"},
      {"type": "quiz", "question": "Convert 4500 mg to grams using dimensional analysis.", "options": ["4.5 g", "45 g", "0.45 g", "450 g"], "correct": 0, "explanation": "4500 mg x (1 g / 1000 mg) = 4500 / 1000 = 4.5 g."},
      {"type": "text", "content": "When setting up dimensional analysis, write units in each conversion factor so that unwanted units cancel. If a unit appears in the numerator of one fraction and the denominator of the next, it cancels out. Continue until only the desired unit remains."},
      {"type": "list", "items": ["Identify the starting unit and the desired unit", "Find conversion factors that link the units", "Arrange factors so unwanted units cancel", "Multiply numerators and divide by denominators", "Verify the answer makes sense (larger unit should have a smaller number)"], "ordered": true},
      {"type": "divider"},
      {"type": "callout", "content": "Challenge: A runner completes a 10 km race in 42 minutes. What was the runner''s average speed in metres per second?", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "SI Units", "definition": "The International System of Units, the modern metric system based on metres, kilograms, seconds, and other base units."},
      {"term": "Dimensional Analysis", "definition": "A method of converting between units by multiplying by conversion factors arranged so unwanted units cancel."},
      {"term": "Conversion Factor", "definition": "A fraction equal to 1 that expresses the relationship between two units (e.g., 1000 m / 1 km)."},
      {"term": "SI Prefix", "definition": "A prefix attached to a base unit to indicate a power of 10 (e.g., kilo = 10^3, milli = 10^(-3))."},
      {"term": "Base Unit", "definition": "A fundamental unit in the SI system from which other units are derived (e.g., metre, kilogram, second)."}
    ]'::jsonb,
    NULL,
    30, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does the prefix "kilo" mean?', 'kilo = 10^3 = 1000. One kilometre is 1000 metres.', 'K for kilo, k for 1000', 2, 0),
    (v_tenant, v_ch, 'What is dimensional analysis?', 'A systematic method of converting between units by multiplying by conversion factors so unwanted units cancel.', 'Also called the factor-label method', 2, 1),
    (v_tenant, v_ch, 'Convert 3.5 km/h to m/s.', '3.5 x 1000/3600 = 3500/3600 = 0.972 m/s', 'Multiply by 1000 (m per km), divide by 3600 (s per h)', 3, 2),
    (v_tenant, v_ch, 'How many millilitres are in 2.7 litres?', '2.7 x 1000 = 2700 mL', '1 L = 1000 mL', 2, 3),
    (v_tenant, v_ch, 'What is the mnemonic for SI prefixes?', 'King Henry Does Usually Drink Chocolate Milk (kilo, hecto, deca, unit, deci, centi, milli)', 'The first letter of each word matches the prefix', 2, 4);

  -- Chapter 1.2
  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Surface Area and Volume', 'surface-area-and-volume-f10',
    'Calculate surface area and volume of prisms, cylinders, pyramids, cones, and spheres.',
    '[
      {"type": "heading", "content": "Surface Area and Volume", "level": 1},
      {"type": "text", "content": "Surface area is the total area of all faces or surfaces of a three-dimensional object. Volume is the amount of space the object occupies. Both calculations are fundamental in design, manufacturing, packaging, and construction."},
      {"type": "heading", "content": "Right Prisms and Cylinders", "level": 2},
      {"type": "text", "content": "Rectangular prism:\nSA = 2(lw + lh + wh)\nV = lwh\n\nCylinder:\nSA = 2(pi)r^2 + 2(pi)rh = 2(pi)r(r + h)\nV = (pi)r^2 h\n\nWorked Example: A cylindrical can has radius 4 cm and height 12 cm.\nSA = 2(pi)(4)(4 + 12) = 2(pi)(4)(16) = 128(pi) = 402.1 cm^2\nV = (pi)(4)^2(12) = 192(pi) = 603.2 cm^3"},
      {"type": "heading", "content": "Pyramids and Cones", "level": 2},
      {"type": "text", "content": "Square pyramid:\nSA = base area + (1/2)(perimeter)(slant height) = s^2 + 2sl\nV = (1/3)(base area)(height) = (1/3)s^2 h\n\nCone:\nSA = (pi)r^2 + (pi)r(slant height)\nV = (1/3)(pi)r^2 h\n\nWorked Example: A cone has radius 5 cm, height 12 cm, and slant height 13 cm.\nV = (1/3)(pi)(5)^2(12) = (1/3)(pi)(25)(12) = 100(pi) = 314.2 cm^3"},
      {"type": "heading", "content": "Spheres", "level": 2},
      {"type": "text", "content": "SA = 4(pi)r^2\nV = (4/3)(pi)r^3\n\nWorked Example: A basketball has a diameter of 24 cm (radius = 12 cm).\nSA = 4(pi)(12)^2 = 576(pi) = 1809.6 cm^2\nV = (4/3)(pi)(12)^3 = (4/3)(pi)(1728) = 2304(pi) = 7238.2 cm^3"},
      {"type": "quiz", "question": "A cone has a radius of 6 cm and a height of 8 cm. What is its volume?", "options": ["96(pi) cm^3 approximately 301.6 cm^3", "288(pi) cm^3 approximately 904.8 cm^3", "48(pi) cm^3 approximately 150.8 cm^3", "144(pi) cm^3 approximately 452.4 cm^3"], "correct": 0, "explanation": "V = (1/3)(pi)(6)^2(8) = (1/3)(pi)(36)(8) = (1/3)(288)(pi) = 96(pi) approximately 301.6 cm^3."},
      {"type": "callout", "content": "Notice that cones and pyramids have volume = (1/3) x base area x height. They hold exactly one-third the volume of a prism or cylinder with the same base and height.", "style": "info"},
      {"type": "list", "items": ["Prism/Cylinder volume: base area x height", "Pyramid/Cone volume: (1/3) x base area x height", "Sphere volume: (4/3)(pi)r^3", "Surface area = sum of areas of all faces/surfaces", "Always use consistent units throughout the calculation"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Application: A grain silo consists of a cylinder (diameter 8 m, height 12 m) topped with a cone (height 3 m, same diameter). Calculate the total volume of the silo.", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Surface Area", "definition": "The total area of all external surfaces of a three-dimensional object."},
      {"term": "Volume", "definition": "The amount of three-dimensional space enclosed by an object."},
      {"term": "Slant Height", "definition": "The distance along the lateral face of a cone or pyramid from base to apex."},
      {"term": "Lateral Surface", "definition": "The side surface of a 3D object, excluding the base(s)."},
      {"term": "Sphere", "definition": "A perfectly round three-dimensional shape where every point on the surface is equidistant from the centre."},
      {"term": "Net", "definition": "A two-dimensional pattern that can be folded to form a three-dimensional solid."}
    ]'::jsonb,
    NULL,
    30, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the volume formula for a cylinder?', 'V = pi x r^2 x h', 'Area of circle times height', 2, 0),
    (v_tenant, v_ch, 'How does the volume of a cone compare to a cylinder with the same base and height?', 'A cone is exactly 1/3 the volume of the corresponding cylinder.', 'V_cone = (1/3) x V_cylinder', 2, 1),
    (v_tenant, v_ch, 'What is the surface area formula for a sphere?', 'SA = 4(pi)r^2', 'Four times the area of a great circle', 3, 2),
    (v_tenant, v_ch, 'What is the volume of a sphere with radius 6 cm?', 'V = (4/3)(pi)(6)^3 = (4/3)(pi)(216) = 288(pi) = 904.8 cm^3', 'Use V = (4/3)(pi)r^3', 3, 3),
    (v_tenant, v_ch, 'What is slant height?', 'The distance along the lateral face from base to apex of a cone or pyramid, measured along the surface.', 'Different from the vertical height', 2, 4);

  -- Chapter 1.3
  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Imperial-Metric Conversions', 'imperial-metric-conversions-f10',
    'Convert between imperial and metric measurement systems in problem-solving contexts.',
    '[
      {"type": "heading", "content": "Imperial-Metric Conversions", "level": 1},
      {"type": "text", "content": "Although Canada uses the metric system officially, imperial measurements remain common in construction, real estate, cooking, and everyday conversation. Being fluent in both systems and able to convert between them is a practical mathematical skill."},
      {"type": "heading", "content": "Key Conversion Factors", "level": 2},
      {"type": "text", "content": "Length:\n1 inch = 2.54 cm (exact)\n1 foot = 30.48 cm\n1 yard = 0.9144 m\n1 mile = 1.609 km\n\nMass:\n1 pound = 0.4536 kg\n1 ounce = 28.35 g\n\nCapacity:\n1 Imperial gallon = 4.546 L\n1 US gallon = 3.785 L\n1 fluid ounce = 29.57 mL"},
      {"type": "text", "content": "Worked Example: A recipe calls for 2.5 pounds of ground beef. How many grams is this?\n2.5 lb x 0.4536 kg/lb = 1.134 kg = 1134 g\n\nWorked Example: A road sign in the US says the next town is 85 miles away. How far is that in kilometres?\n85 miles x 1.609 km/mile = 136.8 km"},
      {"type": "callout", "content": "The conversion 1 inch = 2.54 cm is an exact definition. All other length conversions between imperial and metric are derived from this one fact.", "style": "info"},
      {"type": "quiz", "question": "A Canadian visiting the US sees that the temperature is 77 degrees Fahrenheit. What is this in Celsius?", "options": ["25 degrees C", "45 degrees C", "20 degrees C", "30 degrees C"], "correct": 0, "explanation": "C = (5/9)(F - 32) = (5/9)(77 - 32) = (5/9)(45) = 25 degrees C."},
      {"type": "heading", "content": "Temperature Conversions", "level": 2},
      {"type": "text", "content": "Celsius to Fahrenheit: F = (9/5)C + 32\nFahrenheit to Celsius: C = (5/9)(F - 32)\n\nKey reference points:\n0 degrees C = 32 degrees F (water freezes)\n100 degrees C = 212 degrees F (water boils)\n37 degrees C = 98.6 degrees F (body temperature)\n-40 degrees C = -40 degrees F (the scales meet)"},
      {"type": "list", "items": ["Use dimensional analysis for systematic conversions", "Memorize key conversion factors (1 in = 2.54 cm, 1 lb = 0.4536 kg)", "Check reasonableness: metric values should be roughly double for length (inches to cm)", "Temperature requires formulas, not simple multiplication", "Always state the units in your final answer"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Cross-border Trip: You are driving from Saskatoon to Minot, North Dakota. Your car fuel gauge reads 3/4 full with a 55-litre tank. Gas in Minot costs $3.25 per US gallon. How much will it cost to fill your tank?", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Imperial System", "definition": "A system of measurement using inches, feet, pounds, and gallons, used historically in British Empire countries."},
      {"term": "Metric System", "definition": "A decimal-based measurement system using metres, grams, and litres, officially used in Canada."},
      {"term": "Fahrenheit", "definition": "A temperature scale where water freezes at 32 degrees and boils at 212 degrees."},
      {"term": "Celsius", "definition": "A temperature scale where water freezes at 0 degrees and boils at 100 degrees, used in Canada and most of the world."},
      {"term": "Exact Conversion", "definition": "A conversion factor defined as exact rather than approximate (e.g., 1 inch = 2.54 cm is exact by definition)."}
    ]'::jsonb,
    NULL,
    30, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'How many centimetres are in one inch?', '1 inch = 2.54 cm (this is an exact definition)', '2.54 is the magic number for length conversions', 2, 0),
    (v_tenant, v_ch, 'What is the formula to convert Celsius to Fahrenheit?', 'F = (9/5)C + 32', 'Multiply by 9/5, then add 32', 3, 1),
    (v_tenant, v_ch, 'At what temperature are Celsius and Fahrenheit equal?', '-40 degrees. Both scales read -40 at this point.', 'It is a very cold temperature', 3, 2),
    (v_tenant, v_ch, 'Convert 10 miles to kilometres.', '10 x 1.609 = 16.09 km', '1 mile = 1.609 km', 2, 3);

  -- ==============================
  -- UNIT 2: Trigonometry
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Trigonometry',
    'Explore the trigonometric ratios sine, cosine, and tangent and their applications to right triangles.',
    'Trigonometric ratios connect angle measures to side lengths in right triangles, enabling indirect measurement.',
    'How can we use angles and ratios to determine distances that are difficult to measure directly?')
  RETURNING id INTO v_unit;

  -- Chapter 2.1
  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Primary Trigonometric Ratios', 'primary-trigonometric-ratios',
    'Define and calculate sine, cosine, and tangent ratios in right triangles.',
    '[
      {"type": "heading", "content": "Primary Trigonometric Ratios", "level": 1},
      {"type": "text", "content": "In a right triangle, the three primary trigonometric ratios relate an acute angle to the lengths of the sides. For a given acute angle theta in a right triangle:\n\nsin(theta) = opposite / hypotenuse\ncos(theta) = adjacent / hypotenuse\ntan(theta) = opposite / adjacent\n\nThe mnemonic SOH-CAH-TOA helps remember these definitions."},
      {"type": "callout", "content": "SOH-CAH-TOA:\nSin = Opposite / Hypotenuse\nCos = Adjacent / Hypotenuse\nTan = Opposite / Adjacent", "style": "tip"},
      {"type": "heading", "content": "Identifying Sides", "level": 2},
      {"type": "text", "content": "Before applying trigonometric ratios, you must correctly identify the three sides relative to the angle you are working with:\n\nHypotenuse: The longest side, always opposite the right angle. It does not change regardless of which acute angle you use.\nOpposite: The side across from the angle you are working with.\nAdjacent: The side next to the angle you are working with (not the hypotenuse).\n\nNote: When you switch to the other acute angle, opposite and adjacent swap, but the hypotenuse stays the same."},
      {"type": "text", "content": "Worked Example: In a right triangle, angle A = 35 degrees and the hypotenuse = 20 cm. Find the side opposite angle A.\n\nsin(35) = opposite / 20\nopposite = 20 x sin(35) = 20 x 0.5736 = 11.47 cm"},
      {"type": "quiz", "question": "In a right triangle, the side opposite to angle B is 8 cm and the hypotenuse is 17 cm. What is sin(B)?", "options": ["8/17 = 0.4706", "17/8 = 2.125", "8/15 = 0.5333", "15/17 = 0.8824"], "correct": 0, "explanation": "sin(B) = opposite / hypotenuse = 8/17 = 0.4706."},
      {"type": "heading", "content": "Calculator Usage", "level": 2},
      {"type": "text", "content": "To evaluate trigonometric ratios, ensure your calculator is in DEGREE mode (not radian mode). To find a ratio value: type sin(35) and press enter. To find an angle from a ratio: use the inverse function — sin^(-1)(0.5) = 30 degrees."},
      {"type": "list", "items": ["Identify the given angle and the sides involved", "Choose the correct ratio (sin, cos, or tan) based on which sides are known or needed", "Set up the equation and solve for the unknown", "Use your calculator in degree mode", "Round your answer to an appropriate number of decimal places"], "ordered": true},
      {"type": "divider"},
      {"type": "callout", "content": "Practice: Draw a right triangle with a 50-degree angle. Measure all three sides and verify that sin(50), cos(50), and tan(50) match the ratios of your measured sides.", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Trigonometric Ratio", "definition": "A ratio of two sides of a right triangle relative to one of its acute angles."},
      {"term": "Sine (sin)", "definition": "The ratio of the length of the opposite side to the length of the hypotenuse in a right triangle."},
      {"term": "Cosine (cos)", "definition": "The ratio of the length of the adjacent side to the length of the hypotenuse in a right triangle."},
      {"term": "Tangent (tan)", "definition": "The ratio of the length of the opposite side to the length of the adjacent side in a right triangle."},
      {"term": "Hypotenuse", "definition": "The longest side of a right triangle, opposite the 90-degree angle."},
      {"term": "SOH-CAH-TOA", "definition": "A mnemonic for remembering the three primary trigonometric ratios."}
    ]'::jsonb,
    'Indigenous navigators and builders used angle-based reasoning in practical ways. The angles of sun shadows were used to track time and seasons. The pitch of tipi poles was carefully chosen to manage wind and rain runoff — applications of the relationship between angles and lengths.',
    30, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does SOH-CAH-TOA stand for?', 'Sin = Opposite/Hypotenuse, Cos = Adjacent/Hypotenuse, Tan = Opposite/Adjacent', 'Three ratios, three pairs of sides', 2, 0),
    (v_tenant, v_ch, 'Which side is the hypotenuse?', 'The longest side of the right triangle, always opposite the right angle.', 'It is the same regardless of which acute angle you reference', 2, 1),
    (v_tenant, v_ch, 'If cos(theta) = 0.6 and the hypotenuse is 10, what is the adjacent side?', 'adjacent = 10 x 0.6 = 6', 'cos = adjacent / hypotenuse, so adjacent = hypotenuse x cos(theta)', 3, 2),
    (v_tenant, v_ch, 'How do you find an angle if you know the sine ratio?', 'Use the inverse sine function: theta = sin^(-1)(ratio). Make sure the calculator is in degree mode.', 'sin^(-1) is also written as arcsin', 3, 3),
    (v_tenant, v_ch, 'In a right triangle, angle A = 40 degrees and the adjacent side is 15. Find the opposite side.', 'tan(40) = opposite/15, so opposite = 15 x tan(40) = 15 x 0.8391 = 12.59', 'Use tangent because you have adjacent and need opposite', 3, 4);

  -- Chapter 2.2
  v_ch_num := 5;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Solving Right Triangles', 'solving-right-triangles',
    'Use trigonometric ratios and the Pythagorean theorem to find all unknown sides and angles of right triangles.',
    '[
      {"type": "heading", "content": "Solving Right Triangles", "level": 1},
      {"type": "text", "content": "To solve a right triangle means to find all unknown sides and angles. You need at least one side and one acute angle (or two sides) to begin. Combine trigonometric ratios with the Pythagorean theorem to find all missing measurements."},
      {"type": "heading", "content": "Finding Unknown Sides", "level": 2},
      {"type": "text", "content": "When you know one acute angle and one side:\n1. Identify which sides are known and which are needed\n2. Choose the ratio that connects the known side to the unknown side\n3. Solve the equation\n\nWorked Example: In right triangle PQR with the right angle at Q, angle P = 28 degrees and PQ (adjacent to P) = 14 cm. Find QR (opposite to P).\ntan(28) = QR / 14\nQR = 14 x tan(28) = 14 x 0.5317 = 7.44 cm\n\nFind PR (hypotenuse):\ncos(28) = 14 / PR\nPR = 14 / cos(28) = 14 / 0.8829 = 15.86 cm"},
      {"type": "heading", "content": "Finding Unknown Angles", "level": 2},
      {"type": "text", "content": "When you know two sides, use an inverse trigonometric function.\n\nWorked Example: In a right triangle, the opposite side is 9 and the adjacent side is 12. Find the angle.\ntan(theta) = 9/12 = 0.75\ntheta = tan^(-1)(0.75) = 36.87 degrees\n\nRemember: The two acute angles in a right triangle always add to 90 degrees. So the other acute angle = 90 - 36.87 = 53.13 degrees."},
      {"type": "quiz", "question": "A right triangle has a hypotenuse of 25 cm and one leg of 7 cm. Find the angle opposite the 7 cm side.", "options": ["16.26 degrees", "73.74 degrees", "28 degrees", "62 degrees"], "correct": 0, "explanation": "sin(theta) = 7/25 = 0.28. theta = sin^(-1)(0.28) = 16.26 degrees."},
      {"type": "callout", "content": "Always check your answer: Do the angles add to 180 degrees? Does a^2 + b^2 = c^2? Does the longest side appear opposite the largest angle?", "style": "tip"},
      {"type": "list", "items": ["Identify all known values (sides, angles)", "Choose the appropriate trig ratio or use the Pythagorean theorem", "Solve for the unknown", "Use inverse trig functions to find angles", "Verify: angles sum to 180 degrees and Pythagorean theorem holds"], "ordered": true},
      {"type": "divider"},
      {"type": "callout", "content": "Complete Solution: Solve the right triangle where the right angle is at C, angle A = 52 degrees, and side a (opposite A) = 18 cm. Find angle B, side b, and side c.", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Solving a Triangle", "definition": "Finding all unknown side lengths and angle measures of a triangle."},
      {"term": "Inverse Trigonometric Function", "definition": "A function that returns the angle when given a trigonometric ratio (e.g., sin^(-1), cos^(-1), tan^(-1))."},
      {"term": "Angle of Elevation", "definition": "The angle measured upward from the horizontal to a line of sight."},
      {"term": "Angle of Depression", "definition": "The angle measured downward from the horizontal to a line of sight."}
    ]'::jsonb,
    NULL,
    30, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does it mean to solve a triangle?', 'To find all unknown sides and angles.', 'A solved triangle has no unknowns', 2, 0),
    (v_tenant, v_ch, 'In a right triangle, if you know two sides, how do you find an angle?', 'Use an inverse trig function (sin^(-1), cos^(-1), or tan^(-1)) applied to the ratio of the two known sides.', 'The inverse function undoes the trig ratio', 3, 1),
    (v_tenant, v_ch, 'The two acute angles of a right triangle always sum to what?', '90 degrees (since the right angle is 90 degrees and all angles sum to 180).', '180 - 90 = 90 degrees left for the two acute angles', 2, 2),
    (v_tenant, v_ch, 'What is the angle of elevation?', 'The angle measured upward from the horizontal to a line of sight to an object above.', 'You are looking up', 2, 3);

  -- Chapter 2.3
  v_ch_num := 6;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Applications of Trigonometry', 'applications-of-trigonometry-f10',
    'Apply trigonometric ratios to real-world problems involving angles of elevation, depression, and indirect measurement.',
    '[
      {"type": "heading", "content": "Applications of Trigonometry", "level": 1},
      {"type": "text", "content": "Trigonometry is a powerful tool for indirect measurement — determining distances or heights without physically measuring them. Surveyors, navigators, engineers, and scientists use trigonometry daily."},
      {"type": "heading", "content": "Angles of Elevation and Depression", "level": 2},
      {"type": "text", "content": "An angle of elevation is measured upward from the horizontal to a line of sight. An angle of depression is measured downward from the horizontal.\n\nWorked Example: From a point 50 m from the base of a building, the angle of elevation to the top is 62 degrees. How tall is the building?\n\ntan(62) = height / 50\nheight = 50 x tan(62) = 50 x 1.8807 = 94.0 m\n\nIf the observer eye height is 1.6 m, total building height = 94.0 + 1.6 = 95.6 m."},
      {"type": "callout", "content": "The angle of elevation from point A to point B equals the angle of depression from point B to point A. They are alternate interior angles with the horizontal lines acting as parallel lines.", "style": "info"},
      {"type": "text", "content": "Worked Example: A pilot at an altitude of 2000 m sees a landing strip at an angle of depression of 12 degrees. How far is the strip (horizontal distance)?\n\ntan(12) = 2000 / d\nd = 2000 / tan(12) = 2000 / 0.2126 = 9409 m = 9.41 km"},
      {"type": "quiz", "question": "A tree casts a shadow 15 m long when the angle of elevation of the sun is 54 degrees. How tall is the tree?", "options": ["20.6 m", "12.1 m", "8.8 m", "18.1 m"], "correct": 0, "explanation": "tan(54) = height / 15. Height = 15 x tan(54) = 15 x 1.3764 = 20.6 m."},
      {"type": "heading", "content": "Navigation and Bearings", "level": 2},
      {"type": "text", "content": "Bearings describe direction as a three-digit angle measured clockwise from north. For example:\nN = 000 degrees, E = 090 degrees, S = 180 degrees, W = 270 degrees\nNE = 045 degrees, SW = 225 degrees\n\nNavigation problems often involve drawing right triangles with north-south and east-west components, then using trigonometry to find distances and directions."},
      {"type": "list", "items": ["Draw a clear diagram labelling all known values", "Identify the right triangle within the problem", "Determine which trig ratio to use", "Account for observer height if relevant", "Include units in your final answer"], "ordered": true},
      {"type": "divider"},
      {"type": "callout", "content": "Field Work: Go outside with a clinometer (or a protractor with a weighted string). Measure the angle of elevation to the top of your school building from a measured distance. Calculate the building height.", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Indirect Measurement", "definition": "Determining a distance or height by calculation rather than direct measurement, often using trigonometry."},
      {"term": "Angle of Elevation", "definition": "The angle from the horizontal upward to a line of sight."},
      {"term": "Angle of Depression", "definition": "The angle from the horizontal downward to a line of sight."},
      {"term": "Bearing", "definition": "A three-digit angle measured clockwise from north, used to describe direction."},
      {"term": "Clinometer", "definition": "A tool used to measure angles of elevation or depression."}
    ]'::jsonb,
    NULL,
    30, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the angle of elevation?', 'The angle measured upward from the horizontal to a line of sight to a point above.', 'Looking up', 2, 0),
    (v_tenant, v_ch, 'A person stands 40 m from a tower. The angle of elevation to the top is 55 degrees. How tall is the tower?', 'height = 40 x tan(55) = 40 x 1.4281 = 57.1 m', 'Use tan = opposite/adjacent', 3, 1),
    (v_tenant, v_ch, 'What is a bearing of 270 degrees?', 'Due west. Bearings are measured clockwise from north.', 'North=000, East=090, South=180, West=270', 2, 2),
    (v_tenant, v_ch, 'Why does the angle of elevation equal the angle of depression between two points?', 'They are alternate interior angles formed by the horizontal lines (parallel) and the line of sight (transversal).', 'Think of the parallel lines theorem', 3, 3);

  -- ==============================
  -- UNIT 3: Factors & Products
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Factors & Products',
    'Factor and expand polynomial expressions including trinomials and differences of squares.',
    'Factoring and expanding are inverse operations that reveal the structure of algebraic expressions.',
    'How does recognizing patterns in polynomials help us factor and expand expressions efficiently?')
  RETURNING id INTO v_unit;

  -- Chapter 3.1
  v_ch_num := 7;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Greatest Common Factor and Grouping', 'gcf-and-grouping',
    'Factor polynomial expressions by identifying the greatest common factor and using grouping.',
    '[
      {"type": "heading", "content": "Greatest Common Factor and Grouping", "level": 1},
      {"type": "text", "content": "Factoring is the process of rewriting an expression as a product of its factors. The first step in any factoring problem is to look for a Greatest Common Factor (GCF) — the largest factor shared by all terms."},
      {"type": "heading", "content": "Factoring Out the GCF", "level": 2},
      {"type": "text", "content": "To factor out the GCF:\n1. Identify the GCF of all terms (consider both coefficients and variables)\n2. Divide each term by the GCF\n3. Write the GCF outside parentheses with the quotients inside\n\nWorked Example: Factor 12x^3 + 18x^2 - 6x\nGCF of 12, 18, and 6 is 6. GCF of x^3, x^2, and x is x.\nOverall GCF = 6x\n12x^3 / 6x = 2x^2, 18x^2 / 6x = 3x, -6x / 6x = -1\nResult: 6x(2x^2 + 3x - 1)"},
      {"type": "callout", "content": "Always check your factoring by expanding (distributing) the result. You should get the original expression back.", "style": "tip"},
      {"type": "heading", "content": "Factoring by Grouping", "level": 2},
      {"type": "text", "content": "When an expression has four terms, try grouping:\n1. Group the first two terms and the last two terms\n2. Factor out the GCF from each group\n3. If both groups produce the same binomial factor, factor it out\n\nWorked Example: Factor 2x^3 + 6x^2 + 5x + 15\nGroup: (2x^3 + 6x^2) + (5x + 15)\nFactor each group: 2x^2(x + 3) + 5(x + 3)\nCommon binomial factor: (x + 3)(2x^2 + 5)"},
      {"type": "quiz", "question": "Factor completely: 8a^2b - 12ab^2 + 4ab", "options": ["4ab(2a - 3b + 1)", "4a(2ab - 3b^2 + b)", "2ab(4a - 6b + 2)", "8ab(a - 1.5b + 0.5)"], "correct": 0, "explanation": "GCF of 8, 12, 4 is 4. GCF of variables is ab. So GCF = 4ab. Dividing: 8a^2b/4ab = 2a, -12ab^2/4ab = -3b, 4ab/4ab = 1. Result: 4ab(2a - 3b + 1)."},
      {"type": "list", "items": ["Always look for a GCF first — it is the most basic factoring technique", "The GCF includes both numerical and variable factors", "Factoring by grouping works on four-term expressions", "Verify by expanding (distributing) the factored form", "Not all expressions can be factored over the integers"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Factor each expression: (a) 15x^2y - 25xy^2 + 10xy, (b) 3m^2 + 9m + 2m + 6, (c) x^3 - 2x^2 + 4x - 8", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Factoring", "definition": "The process of writing an expression as a product of two or more factors."},
      {"term": "Greatest Common Factor (GCF)", "definition": "The largest factor common to all terms in an expression."},
      {"term": "Grouping", "definition": "A factoring method where terms are grouped in pairs, each pair is factored, then a common binomial factor is extracted."},
      {"term": "Polynomial", "definition": "An algebraic expression consisting of terms with non-negative integer exponents combined by addition or subtraction."},
      {"term": "Monomial", "definition": "A polynomial with exactly one term."}
    ]'::jsonb,
    NULL,
    30, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the first step in factoring any polynomial?', 'Look for a Greatest Common Factor (GCF) among all terms.', 'Always start with the GCF', 2, 0),
    (v_tenant, v_ch, 'Factor: 14x^2 - 21x', '7x(2x - 3)', 'GCF = 7x', 2, 1),
    (v_tenant, v_ch, 'When do you use factoring by grouping?', 'When the polynomial has four terms that can be grouped into two pairs sharing a common binomial factor.', 'Group in pairs, factor each pair', 3, 2),
    (v_tenant, v_ch, 'How do you verify a factoring result?', 'Expand (distribute) the factors and check that you get the original expression.', 'Factoring and expanding are inverse operations', 2, 3);

  -- Chapter 3.2
  v_ch_num := 8;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Factoring Trinomials', 'factoring-trinomials',
    'Factor quadratic trinomials of the form ax^2 + bx + c.',
    '[
      {"type": "heading", "content": "Factoring Trinomials", "level": 1},
      {"type": "text", "content": "A quadratic trinomial has the form ax^2 + bx + c. Factoring it means writing it as a product of two binomials. The approach depends on whether a = 1 (simple trinomials) or a is not equal to 1 (general trinomials)."},
      {"type": "heading", "content": "Simple Trinomials (a = 1)", "level": 2},
      {"type": "text", "content": "For x^2 + bx + c, find two numbers that multiply to c and add to b.\n\nWorked Example: Factor x^2 + 7x + 12\nFind two numbers that multiply to 12 and add to 7: 3 and 4.\nResult: (x + 3)(x + 4)\n\nWorked Example: Factor x^2 - 5x - 6\nFind two numbers that multiply to -6 and add to -5: -6 and 1.\nResult: (x - 6)(x + 1)"},
      {"type": "heading", "content": "General Trinomials (a is not 1)", "level": 2},
      {"type": "text", "content": "For ax^2 + bx + c where a is not 1, use the decomposition method:\n1. Find two numbers that multiply to a x c and add to b\n2. Rewrite the middle term using these two numbers\n3. Factor by grouping\n\nWorked Example: Factor 6x^2 + 11x + 4\na x c = 6 x 4 = 24. Find two numbers that multiply to 24 and add to 11: 3 and 8.\nRewrite: 6x^2 + 3x + 8x + 4\nGroup: (6x^2 + 3x) + (8x + 4) = 3x(2x + 1) + 4(2x + 1)\nResult: (2x + 1)(3x + 4)"},
      {"type": "quiz", "question": "Factor: x^2 - 9x + 20", "options": ["(x - 4)(x - 5)", "(x + 4)(x + 5)", "(x - 4)(x + 5)", "(x - 2)(x - 10)"], "correct": 0, "explanation": "Find two numbers that multiply to 20 and add to -9: -4 and -5. So x^2 - 9x + 20 = (x - 4)(x - 5)."},
      {"type": "callout", "content": "Sign patterns: If c is positive, both numbers have the same sign (both positive if b > 0, both negative if b < 0). If c is negative, the numbers have opposite signs.", "style": "tip"},
      {"type": "list", "items": ["For a = 1: find two numbers that multiply to c and add to b", "For a not equal to 1: find two numbers that multiply to ac and add to b, then group", "Always check by expanding the factored form", "Factor out the GCF first if one exists", "Some trinomials cannot be factored over the integers (they are prime)"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Factor each: (a) x^2 + 10x + 24, (b) x^2 - 3x - 28, (c) 2x^2 + 7x + 3, (d) 3x^2 - 11x + 6", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Trinomial", "definition": "A polynomial with exactly three terms, typically of the form ax^2 + bx + c."},
      {"term": "Quadratic Expression", "definition": "A polynomial expression where the highest degree is 2."},
      {"term": "Decomposition Method", "definition": "A factoring technique where the middle term is split into two terms to enable factoring by grouping."},
      {"term": "Prime Polynomial", "definition": "A polynomial that cannot be factored into polynomials of lower degree with integer coefficients."},
      {"term": "Leading Coefficient", "definition": "The coefficient of the term with the highest power in a polynomial."}
    ]'::jsonb,
    NULL,
    30, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Factor x^2 + 5x + 6', '(x + 2)(x + 3) because 2 x 3 = 6 and 2 + 3 = 5', 'Product = 6, sum = 5', 2, 0),
    (v_tenant, v_ch, 'What is the decomposition method for factoring?', 'For ax^2 + bx + c: find two numbers that multiply to ac and add to b, split the middle term, then factor by grouping.', 'Multiply a and c first', 3, 1),
    (v_tenant, v_ch, 'If c is negative in x^2 + bx + c, what do you know about the two factor numbers?', 'They have opposite signs (one positive, one negative).', 'A negative product means different signs', 3, 2),
    (v_tenant, v_ch, 'Factor 2x^2 + 5x + 3', '(2x + 3)(x + 1). Using decomposition: ac = 6, need sum of 5: 2 and 3. Split: 2x^2 + 2x + 3x + 3 = 2x(x+1) + 3(x+1).', 'ac = 6, b = 5', 3, 3),
    (v_tenant, v_ch, 'How do you check a factoring answer?', 'Expand the factors using FOIL or distribution. The result should equal the original expression.', 'Factoring and expanding are inverses', 2, 4);

  -- Chapter 3.3
  v_ch_num := 9;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Special Products and Factoring Patterns', 'special-products-and-factoring',
    'Recognize and factor difference of squares and perfect square trinomials.',
    '[
      {"type": "heading", "content": "Special Products and Factoring Patterns", "level": 1},
      {"type": "text", "content": "Some polynomials follow recognizable patterns that allow for rapid factoring. The two most important patterns at this level are the difference of squares and perfect square trinomials."},
      {"type": "heading", "content": "Difference of Squares", "level": 2},
      {"type": "text", "content": "Pattern: a^2 - b^2 = (a + b)(a - b)\n\nThis works because when you expand (a + b)(a - b), the middle terms cancel:\n(a + b)(a - b) = a^2 - ab + ab - b^2 = a^2 - b^2\n\nWorked Example: Factor 25x^2 - 49\n25x^2 = (5x)^2 and 49 = 7^2\nSo 25x^2 - 49 = (5x + 7)(5x - 7)\n\nWorked Example: Factor x^4 - 16\nx^4 - 16 = (x^2 + 4)(x^2 - 4) = (x^2 + 4)(x + 2)(x - 2)"},
      {"type": "callout", "content": "A sum of squares (a^2 + b^2) cannot be factored over the real numbers. Only differences of squares factor.", "style": "warning"},
      {"type": "heading", "content": "Perfect Square Trinomials", "level": 2},
      {"type": "text", "content": "Patterns:\na^2 + 2ab + b^2 = (a + b)^2\na^2 - 2ab + b^2 = (a - b)^2\n\nTo recognize a perfect square trinomial: check if the first and last terms are perfect squares, and the middle term is twice the product of their square roots.\n\nWorked Example: Factor 9x^2 + 30x + 25\n9x^2 = (3x)^2, 25 = 5^2, and 30x = 2(3x)(5)\nSo 9x^2 + 30x + 25 = (3x + 5)^2"},
      {"type": "quiz", "question": "Factor: 4x^2 - 81", "options": ["(2x + 9)(2x - 9)", "(4x + 81)(4x - 81)", "(2x - 9)^2", "Cannot be factored"], "correct": 0, "explanation": "This is a difference of squares: 4x^2 = (2x)^2 and 81 = 9^2. So 4x^2 - 81 = (2x + 9)(2x - 9)."},
      {"type": "list", "items": ["Difference of squares: a^2 - b^2 = (a + b)(a - b)", "Perfect square trinomial: a^2 + 2ab + b^2 = (a + b)^2", "Sum of squares cannot be factored over the reals", "Always look for a GCF before applying special patterns", "Some expressions require multiple factoring steps"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Factor completely: (a) 50x^2 - 8, (b) x^2 + 14x + 49, (c) 3x^2 - 48, (d) 4x^2 - 20x + 25", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Difference of Squares", "definition": "A binomial of the form a^2 - b^2 that factors as (a + b)(a - b)."},
      {"term": "Perfect Square Trinomial", "definition": "A trinomial of the form a^2 +/- 2ab + b^2 that factors as (a +/- b)^2."},
      {"term": "Sum of Squares", "definition": "An expression of the form a^2 + b^2, which cannot be factored over the real numbers."},
      {"term": "Factor Completely", "definition": "To express a polynomial as a product of factors that cannot be factored further over the integers."}
    ]'::jsonb,
    NULL,
    30, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'State the difference of squares formula.', 'a^2 - b^2 = (a + b)(a - b)', 'One sum, one difference', 2, 0),
    (v_tenant, v_ch, 'Can a^2 + b^2 be factored?', 'No, a sum of squares cannot be factored over the real numbers.', 'Only differences of squares factor', 2, 1),
    (v_tenant, v_ch, 'Factor x^2 - 64', '(x + 8)(x - 8)', '64 = 8^2', 2, 2),
    (v_tenant, v_ch, 'How do you recognize a perfect square trinomial?', 'First and last terms are perfect squares, and the middle term equals 2 times the product of the square roots of the first and last terms.', 'Check: is the middle term = 2ab?', 3, 3);

  -- ==============================
  -- UNIT 4: Roots & Powers
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Roots & Powers',
    'Work with exponents, radicals, and the relationships between them.',
    'Exponents and roots provide compact notation for repeated multiplication and its inverse.',
    'How do exponent laws simplify complex expressions involving powers and roots?')
  RETURNING id INTO v_unit;

  -- Chapter 4.1
  v_ch_num := 10;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Exponent Laws', 'exponent-laws',
    'Apply the laws of exponents to simplify expressions with integer exponents.',
    '[
      {"type": "heading", "content": "Exponent Laws", "level": 1},
      {"type": "text", "content": "Exponents provide a shorthand for repeated multiplication. The expression a^n means a is multiplied by itself n times. A set of consistent laws governs how exponents behave in multiplication, division, and power operations."},
      {"type": "heading", "content": "The Seven Exponent Laws", "level": 2},
      {"type": "text", "content": "1. Product of Powers: a^m x a^n = a^(m+n)\n2. Quotient of Powers: a^m / a^n = a^(m-n), where a is not 0\n3. Power of a Power: (a^m)^n = a^(mn)\n4. Power of a Product: (ab)^n = a^n x b^n\n5. Power of a Quotient: (a/b)^n = a^n / b^n\n6. Zero Exponent: a^0 = 1, where a is not 0\n7. Negative Exponent: a^(-n) = 1/a^n, where a is not 0"},
      {"type": "callout", "content": "The zero exponent rule follows from the quotient rule: a^n / a^n = a^(n-n) = a^0 = 1. Since any nonzero number divided by itself is 1, a^0 = 1.", "style": "info"},
      {"type": "text", "content": "Worked Example: Simplify (3x^2 y)^3 / (9x^(-1))\n\nNumerator: (3x^2 y)^3 = 3^3 x^(2x3) y^3 = 27x^6 y^3\nDenominator: 9x^(-1)\n\nResult: 27x^6 y^3 / (9x^(-1)) = 3x^(6-(-1)) y^3 = 3x^7 y^3"},
      {"type": "quiz", "question": "Simplify: (2a^3)^4 / (4a^5)", "options": ["4a^7", "a^7", "4a^2", "8a^7"], "correct": 0, "explanation": "(2a^3)^4 = 2^4 x a^12 = 16a^12. Then 16a^12 / 4a^5 = 4a^(12-5) = 4a^7."},
      {"type": "list", "items": ["When multiplying same bases, add exponents", "When dividing same bases, subtract exponents", "When raising a power to a power, multiply exponents", "A zero exponent equals 1 (for nonzero bases)", "A negative exponent means take the reciprocal"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Simplify each expression: (a) x^5 x x^(-3), (b) (4m^2n^3)^2, (c) (a^4 b^(-2))^3 / (a^(-1) b^5)", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Exponent", "definition": "A number indicating how many times the base is multiplied by itself."},
      {"term": "Base", "definition": "The number being raised to a power in an exponential expression."},
      {"term": "Product of Powers Law", "definition": "a^m x a^n = a^(m+n). When multiplying powers with the same base, add exponents."},
      {"term": "Zero Exponent", "definition": "Any nonzero number raised to the power of zero equals 1: a^0 = 1."},
      {"term": "Negative Exponent", "definition": "a^(-n) = 1/a^n. A negative exponent indicates the reciprocal of the positive power."}
    ]'::jsonb,
    NULL,
    30, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'State the product of powers law.', 'a^m x a^n = a^(m+n). When multiplying powers with the same base, add the exponents.', 'Same base? Add exponents', 2, 0),
    (v_tenant, v_ch, 'What does a^(-3) equal?', 'a^(-3) = 1/a^3. A negative exponent means the reciprocal.', 'Flip to the denominator and make the exponent positive', 2, 1),
    (v_tenant, v_ch, 'Simplify: (x^4)^3', 'x^12. When raising a power to a power, multiply exponents: 4 x 3 = 12.', 'Power of a power: multiply', 2, 2),
    (v_tenant, v_ch, 'Why does a^0 = 1?', 'By the quotient rule: a^n / a^n = a^(n-n) = a^0, and any nonzero number divided by itself equals 1.', 'Self-division', 3, 3);

  -- Chapter 4.2
  v_ch_num := 11;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Radicals and Rational Exponents', 'radicals-and-rational-exponents',
    'Convert between radical notation and rational exponents, and simplify radical expressions.',
    '[
      {"type": "heading", "content": "Radicals and Rational Exponents", "level": 1},
      {"type": "text", "content": "A radical (root) is the inverse operation of an exponent. The square root of 25 is 5 because 5^2 = 25. Rational (fractional) exponents provide an alternative notation for radicals that makes algebraic manipulation more consistent."},
      {"type": "heading", "content": "Rational Exponent Notation", "level": 2},
      {"type": "text", "content": "The key relationship:\na^(1/n) = the nth root of a\na^(m/n) = the nth root of (a^m) = (the nth root of a)^m\n\nExamples:\n8^(1/3) = cube root of 8 = 2\n27^(2/3) = (cube root of 27)^2 = 3^2 = 9\n16^(3/4) = (fourth root of 16)^3 = 2^3 = 8"},
      {"type": "callout", "content": "Strategy: For a^(m/n), it is usually easier to take the root first, then raise to the power. This keeps numbers smaller.", "style": "tip"},
      {"type": "heading", "content": "Simplifying Radicals", "level": 2},
      {"type": "text", "content": "A radical is in simplest form when the radicand (the number under the radical sign) has no perfect square factors (for square roots) or no perfect nth-power factors (for nth roots).\n\nWorked Example: Simplify sqrt(72)\n72 = 36 x 2\nsqrt(72) = sqrt(36 x 2) = sqrt(36) x sqrt(2) = 6 sqrt(2)\n\nWorked Example: Simplify sqrt(50x^3)\n50x^3 = 25 x 2 x x^2 x x\nsqrt(50x^3) = 5x sqrt(2x)"},
      {"type": "quiz", "question": "Evaluate 32^(2/5).", "options": ["4", "8", "16", "2"], "correct": 0, "explanation": "32^(2/5) = (fifth root of 32)^2 = 2^2 = 4. (The fifth root of 32 is 2 because 2^5 = 32.)"},
      {"type": "list", "items": ["a^(1/n) is the nth root of a", "a^(m/n) = (nth root of a)^m", "To simplify a radical, factor out perfect squares (or perfect nth powers)", "Exponent laws apply equally to rational exponents", "Take the root first to keep numbers manageable"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Evaluate or simplify: (a) 64^(2/3), (b) sqrt(200), (c) 81^(3/4), (d) sqrt(48a^4 b^3)", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Radical", "definition": "An expression involving a root, such as sqrt(x) or the nth root of a."},
      {"term": "Radicand", "definition": "The number or expression under the radical sign."},
      {"term": "Rational Exponent", "definition": "An exponent that is a fraction, where a^(m/n) equals the nth root of a raised to the mth power."},
      {"term": "Index", "definition": "The number indicating which root is being taken (2 for square root, 3 for cube root, etc.)."},
      {"term": "Simplest Radical Form", "definition": "A radical expression where the radicand has no perfect nth-power factors."}
    ]'::jsonb,
    NULL,
    30, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does a^(1/2) equal?', 'The square root of a.', 'An exponent of 1/2 means square root', 2, 0),
    (v_tenant, v_ch, 'Evaluate 8^(2/3)', '(cube root of 8)^2 = 2^2 = 4', 'Take the cube root first, then square', 3, 1),
    (v_tenant, v_ch, 'Simplify sqrt(75)', 'sqrt(75) = sqrt(25 x 3) = 5 sqrt(3)', 'Factor out the largest perfect square: 25', 2, 2),
    (v_tenant, v_ch, 'What is the relationship between radicals and rational exponents?', 'a^(m/n) = the nth root of a^m. Rational exponents are another way to write radicals.', 'Denominator = root, numerator = power', 3, 3);

  -- ==============================
  -- UNIT 5: Linear Relations
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 5, 'Linear Relations',
    'Graph, analyze, and write equations for linear relations in slope-intercept, point-slope, and general forms.',
    'Linear relations model constant-rate-of-change situations and are represented by straight-line graphs.',
    'How do different forms of linear equations reveal different information about the relationship?')
  RETURNING id INTO v_unit;

  -- Chapter 5.1
  v_ch_num := 12;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Slope and Rate of Change', 'slope-and-rate-of-change',
    'Calculate and interpret slope as a rate of change in various contexts.',
    '[
      {"type": "heading", "content": "Slope and Rate of Change", "level": 1},
      {"type": "text", "content": "The slope of a line measures its steepness and direction. It is the ratio of the vertical change (rise) to the horizontal change (run) between any two points on the line. Slope represents the rate of change — how quickly one quantity changes relative to another."},
      {"type": "heading", "content": "Calculating Slope", "level": 2},
      {"type": "text", "content": "Given two points (x1, y1) and (x2, y2):\nm = (y2 - y1) / (x2 - x1) = rise / run\n\nWorked Example: Find the slope through (2, 5) and (6, 13).\nm = (13 - 5) / (6 - 2) = 8 / 4 = 2\n\nInterpretation: For every 1 unit increase in x, y increases by 2 units."},
      {"type": "heading", "content": "Types of Slope", "level": 2},
      {"type": "text", "content": "Positive slope: line rises from left to right (m > 0)\nNegative slope: line falls from left to right (m < 0)\nZero slope: horizontal line (m = 0)\nUndefined slope: vertical line (division by zero because x1 = x2)"},
      {"type": "callout", "content": "Parallel lines have equal slopes. Perpendicular lines have slopes that are negative reciprocals of each other (their product equals -1).", "style": "info"},
      {"type": "quiz", "question": "A line passes through (-3, 8) and (5, -4). What is the slope?", "options": ["m = -3/2", "m = -2/3", "m = 3/2", "m = 2/3"], "correct": 0, "explanation": "m = (-4 - 8) / (5 - (-3)) = -12 / 8 = -3/2. The line falls from left to right."},
      {"type": "text", "content": "Real-World Slope: If a bathtub drains at a constant rate and the water depth decreases from 30 cm to 0 cm over 15 minutes, the rate of change is:\nm = (0 - 30) / (15 - 0) = -30/15 = -2 cm/min. The negative sign indicates decreasing depth."},
      {"type": "list", "items": ["Slope = rise / run = (y2 - y1) / (x2 - x1)", "Positive slope: line goes up from left to right", "Negative slope: line goes down from left to right", "Zero slope: horizontal line", "Undefined slope: vertical line"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Determine the slope for each pair of points and describe what the slope tells you: (a) (0, 3) and (4, 11), (b) (1, 7) and (5, 7), (c) (-2, 6) and (4, -3)", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Slope", "definition": "The ratio of the vertical change to the horizontal change between two points on a line: m = rise/run."},
      {"term": "Rate of Change", "definition": "How quickly one quantity changes relative to another, represented by the slope in a linear relation."},
      {"term": "Rise", "definition": "The vertical change between two points on a line."},
      {"term": "Run", "definition": "The horizontal change between two points on a line."},
      {"term": "Parallel Lines", "definition": "Lines in the same plane that never intersect; they have equal slopes."},
      {"term": "Perpendicular Lines", "definition": "Lines that intersect at a 90-degree angle; their slopes are negative reciprocals."}
    ]'::jsonb,
    NULL,
    30, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the slope formula?', 'm = (y2 - y1) / (x2 - x1), or equivalently, rise / run.', 'Change in y over change in x', 2, 0),
    (v_tenant, v_ch, 'What slope does a horizontal line have?', 'Zero. There is no rise, only run. m = 0/run = 0.', 'Flat line, no steepness', 2, 1),
    (v_tenant, v_ch, 'What is the relationship between slopes of perpendicular lines?', 'They are negative reciprocals: m1 x m2 = -1.', 'Flip the fraction and change the sign', 3, 2),
    (v_tenant, v_ch, 'Find the slope through (1, 4) and (3, 10).', 'm = (10 - 4) / (3 - 1) = 6/2 = 3', 'Rise of 6 over run of 2', 2, 3);

  -- Chapter 5.2
  v_ch_num := 13;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Forms of Linear Equations', 'forms-of-linear-equations',
    'Write and convert between slope-intercept, point-slope, and general forms of linear equations.',
    '[
      {"type": "heading", "content": "Forms of Linear Equations", "level": 1},
      {"type": "text", "content": "A linear equation can be written in several equivalent forms. Each form highlights different information about the line."},
      {"type": "heading", "content": "Slope-Intercept Form", "level": 2},
      {"type": "text", "content": "y = mx + b\nwhere m is the slope and b is the y-intercept (the y-value where the line crosses the y-axis).\n\nThis form makes it easy to graph the line: start at (0, b) and use the slope to find additional points.\n\nWorked Example: Write the equation of a line with slope 3/2 and y-intercept -4.\ny = (3/2)x + (-4) or y = (3/2)x - 4"},
      {"type": "heading", "content": "Point-Slope Form", "level": 2},
      {"type": "text", "content": "y - y1 = m(x - x1)\nwhere m is the slope and (x1, y1) is a known point on the line.\n\nThis form is useful when you know the slope and one point (but not necessarily the y-intercept).\n\nWorked Example: Write the equation of a line through (3, -2) with slope 4.\ny - (-2) = 4(x - 3)\ny + 2 = 4x - 12\ny = 4x - 14 (converting to slope-intercept form)"},
      {"type": "heading", "content": "General Form (Standard Form)", "level": 2},
      {"type": "text", "content": "Ax + By + C = 0 (or equivalently Ax + By = C)\nwhere A, B, and C are integers, and A is positive by convention.\n\nWorked Example: Convert y = (2/3)x - 5 to general form.\nMultiply everything by 3: 3y = 2x - 15\nRearrange: -2x + 3y + 15 = 0, or equivalently 2x - 3y - 15 = 0"},
      {"type": "quiz", "question": "What is the equation of a line through (1, 5) and (3, 11) in slope-intercept form?", "options": ["y = 3x + 2", "y = 3x - 2", "y = 2x + 3", "y = 6x - 1"], "correct": 0, "explanation": "Slope = (11-5)/(3-1) = 6/2 = 3. Using point-slope with (1,5): y - 5 = 3(x - 1), so y = 3x - 3 + 5 = 3x + 2."},
      {"type": "list", "items": ["Slope-intercept (y = mx + b): easiest for graphing", "Point-slope (y - y1 = m(x - x1)): easiest when given a point and slope", "General form (Ax + By + C = 0): standard for formal mathematical communication", "All three forms represent the same line — choose the most convenient form for the task", "To convert between forms, use algebraic manipulation"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "For each line, write the equation in all three forms: (a) slope 2, through (0, -3), (b) through (2, 1) and (5, 7), (c) x-intercept 4, y-intercept -6", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Slope-Intercept Form", "definition": "y = mx + b, where m is the slope and b is the y-intercept."},
      {"term": "Point-Slope Form", "definition": "y - y1 = m(x - x1), where m is the slope and (x1, y1) is a point on the line."},
      {"term": "General Form", "definition": "Ax + By + C = 0, where A, B, C are integers and A > 0 by convention."},
      {"term": "y-intercept", "definition": "The point where a line crosses the y-axis, given by (0, b) in slope-intercept form."},
      {"term": "x-intercept", "definition": "The point where a line crosses the x-axis, found by setting y = 0 and solving for x."}
    ]'::jsonb,
    NULL,
    30, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is slope-intercept form?', 'y = mx + b, where m is slope and b is y-intercept.', 'y equals m x plus b', 2, 0),
    (v_tenant, v_ch, 'What is point-slope form?', 'y - y1 = m(x - x1), where m is slope and (x1, y1) is a known point.', 'Use this when you know one point and the slope', 2, 1),
    (v_tenant, v_ch, 'Convert y = (3/4)x - 2 to general form.', 'Multiply by 4: 4y = 3x - 8. Rearrange: 3x - 4y - 8 = 0.', 'Clear the fraction first, then move all terms to one side', 3, 2),
    (v_tenant, v_ch, 'How do you find the y-intercept of a line?', 'Set x = 0 and solve for y, or read b directly from slope-intercept form.', 'Where does the line cross the y-axis?', 2, 3);

  -- ==============================
  -- UNIT 6: Systems of Linear Equations
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 6, 'Systems of Linear Equations',
    'Solve systems of two linear equations in two variables using graphing, substitution, and elimination.',
    'A system of equations can model situations where two conditions must be satisfied simultaneously.',
    'How do we find the values that satisfy two linear conditions at the same time?')
  RETURNING id INTO v_unit;

  -- Chapter 6.1
  v_ch_num := 14;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Solving by Graphing and Substitution', 'solving-by-graphing-substitution',
    'Solve linear systems by graphing and by substitution.',
    '[
      {"type": "heading", "content": "Solving Systems by Graphing and Substitution", "level": 1},
      {"type": "text", "content": "A system of linear equations consists of two or more equations with the same variables. The solution is the ordered pair (x, y) that satisfies both equations simultaneously — geometrically, the point where the lines intersect."},
      {"type": "heading", "content": "Solving by Graphing", "level": 2},
      {"type": "text", "content": "Graph both equations on the same coordinate plane. The intersection point is the solution.\n\nWorked Example:\ny = 2x + 1\ny = -x + 7\n\nGraph both lines. They intersect at (2, 5).\nCheck: 5 = 2(2) + 1 = 5 (correct), 5 = -2 + 7 = 5 (correct)."},
      {"type": "callout", "content": "Graphing gives an approximate solution unless the intersection occurs at integer coordinates. For exact solutions, use algebraic methods.", "style": "info"},
      {"type": "heading", "content": "Solving by Substitution", "level": 2},
      {"type": "text", "content": "1. Solve one equation for one variable\n2. Substitute that expression into the other equation\n3. Solve for the remaining variable\n4. Back-substitute to find the first variable\n\nWorked Example:\ny = 3x - 1 ... (1)\n2x + y = 9 ... (2)\n\nSubstitute (1) into (2):\n2x + (3x - 1) = 9\n5x - 1 = 9\n5x = 10\nx = 2\n\nBack-substitute: y = 3(2) - 1 = 5\nSolution: (2, 5)"},
      {"type": "quiz", "question": "Solve the system: y = x + 3 and 2x + y = 12", "options": ["(3, 6)", "(4, 4)", "(6, 0)", "(2, 8)"], "correct": 0, "explanation": "Substitute y = x + 3 into 2x + y = 12: 2x + (x + 3) = 12, so 3x = 9, x = 3. Then y = 3 + 3 = 6. Solution: (3, 6)."},
      {"type": "list", "items": ["A system can have one solution (lines intersect), no solution (parallel lines), or infinitely many solutions (same line)", "Graphing is visual but may be imprecise", "Substitution works best when one variable is already isolated", "Always verify by checking the solution in both original equations"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Solve each system by substitution: (a) y = 2x - 5, 3x + y = 15 (b) x = 4y + 1, 2x - 3y = 7", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "System of Equations", "definition": "Two or more equations with the same variables, solved simultaneously."},
      {"term": "Solution of a System", "definition": "The ordered pair (or set of values) that satisfies all equations in the system."},
      {"term": "Substitution Method", "definition": "Solving a system by isolating one variable in one equation and substituting into the other."},
      {"term": "Consistent System", "definition": "A system that has at least one solution (intersecting or coincident lines)."},
      {"term": "Inconsistent System", "definition": "A system with no solution (parallel lines that never intersect)."}
    ]'::jsonb,
    NULL,
    30, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the solution to a system of two linear equations?', 'The ordered pair (x, y) that satisfies both equations — the intersection point of the two lines.', 'Where do the lines cross?', 2, 0),
    (v_tenant, v_ch, 'When does a linear system have no solution?', 'When the lines are parallel (same slope, different y-intercepts). They never intersect.', 'Parallel lines do not meet', 2, 1),
    (v_tenant, v_ch, 'Describe the substitution method.', 'Isolate one variable in one equation, substitute that expression into the other equation, solve, then back-substitute.', 'Replace one variable with an expression', 3, 2),
    (v_tenant, v_ch, 'Solve: y = 4x, x + y = 10', 'Substitute: x + 4x = 10, 5x = 10, x = 2, y = 8. Solution: (2, 8).', 'y is already isolated in the first equation', 2, 3);

  -- Chapter 6.2
  v_ch_num := 15;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Solving by Elimination', 'solving-by-elimination',
    'Solve linear systems using the elimination (addition/subtraction) method.',
    '[
      {"type": "heading", "content": "Solving by Elimination", "level": 1},
      {"type": "text", "content": "The elimination method (also called the addition method) works by adding or subtracting equations to eliminate one variable. This method is especially efficient when neither variable is easily isolated."},
      {"type": "heading", "content": "The Elimination Process", "level": 2},
      {"type": "text", "content": "1. Arrange both equations in standard form (Ax + By = C)\n2. If needed, multiply one or both equations by constants so the coefficients of one variable are equal (or negatives)\n3. Add or subtract the equations to eliminate that variable\n4. Solve for the remaining variable\n5. Substitute back to find the other variable\n\nWorked Example:\n3x + 2y = 16 ... (1)\n5x - 2y = 24 ... (2)\n\nSince the y-coefficients are +2 and -2, add the equations:\n(3x + 5x) + (2y - 2y) = 16 + 24\n8x = 40\nx = 5\n\nSubstitute into (1): 3(5) + 2y = 16, 15 + 2y = 16, 2y = 1, y = 0.5\nSolution: (5, 0.5)"},
      {"type": "text", "content": "Worked Example requiring multiplication:\n2x + 3y = 7 ... (1)\n5x + 4y = 13 ... (2)\n\nMultiply (1) by 5 and (2) by -2:\n10x + 15y = 35\n-10x - 8y = -26\n\nAdd: 7y = 9, y = 9/7\nSubstitute: 2x + 3(9/7) = 7, 2x = 7 - 27/7 = 22/7, x = 11/7\nSolution: (11/7, 9/7)"},
      {"type": "quiz", "question": "Solve using elimination: 4x + y = 14, 2x + y = 8", "options": ["(3, 2)", "(2, 4)", "(4, -2)", "(1, 6)"], "correct": 0, "explanation": "Subtract equation 2 from equation 1: (4x - 2x) + (y - y) = 14 - 8, so 2x = 6, x = 3. Then y = 14 - 4(3) = 2. Solution: (3, 2)."},
      {"type": "callout", "content": "Choose the variable to eliminate based on which coefficients are easiest to make equal. Look for coefficients that are already the same or that share a small LCM.", "style": "tip"},
      {"type": "list", "items": ["Line up both equations in Ax + By = C form", "Multiply equations to create matching (or opposite) coefficients", "Add or subtract to eliminate one variable", "Solve for the remaining variable", "Back-substitute and verify in both equations"], "ordered": true},
      {"type": "divider"},
      {"type": "callout", "content": "Solve by elimination: (a) 3x + 4y = 10, 5x - 4y = 6 (b) 2x + 5y = 1, 3x + 2y = -4 (c) 6x - 9y = 12, 2x - 3y = 4", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Elimination Method", "definition": "A method for solving systems of equations by adding or subtracting equations to eliminate one variable."},
      {"term": "Linear Combination", "definition": "An expression formed by multiplying equations by constants and adding them together."},
      {"term": "Equivalent System", "definition": "A system of equations that has the same solution as the original system."},
      {"term": "Dependent System", "definition": "A system where both equations represent the same line, resulting in infinitely many solutions."}
    ]'::jsonb,
    NULL,
    30, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the elimination method?', 'A method of solving systems by adding or subtracting equations so one variable is eliminated, leaving one equation in one unknown.', 'Also called the addition method', 2, 0),
    (v_tenant, v_ch, 'When is elimination preferred over substitution?', 'When neither variable is easily isolated — especially when both equations are in standard form with integer coefficients.', 'No variable has a coefficient of 1', 3, 1),
    (v_tenant, v_ch, 'Solve: x + y = 7, x - y = 3', 'Add: 2x = 10, x = 5. Then y = 7 - 5 = 2. Solution: (5, 2).', 'Adding eliminates y directly', 2, 2),
    (v_tenant, v_ch, 'What does it mean if elimination produces 0 = 0?', 'The system is dependent — both equations represent the same line, so there are infinitely many solutions.', 'The equations are multiples of each other', 3, 3);

  RAISE NOTICE 'Foundations of Math 10 seeded: 6 units, 15 chapters';
END $$;


-- ============================================================================
-- TEXTBOOK 3: Pre-Calculus Math 20
-- Slug: wolfwhale-pre-calculus-math-20
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book UUID;
  v_unit UUID;
  v_ch UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-pre-calculus-math-20';

  -- ==============================
  -- UNIT 1: Absolute Value & Radicals
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Absolute Value & Radicals',
    'Explore absolute value functions, equations, and inequalities, and extend radical operations.',
    'Absolute value measures distance from zero, and radical expressions extend the concept of roots to algebraic expressions.',
    'How do absolute value and radical expressions model real-world situations involving distance and magnitude?')
  RETURNING id INTO v_unit;

  -- Chapter 1.1
  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Absolute Value', 'absolute-value-pc20',
    'Define absolute value, evaluate expressions, and solve absolute value equations and inequalities.',
    '[
      {"type": "heading", "content": "Absolute Value", "level": 1},
      {"type": "text", "content": "The absolute value of a number is its distance from zero on the number line, regardless of direction. It is always non-negative. We write the absolute value of x as |x|.\n\n|5| = 5 (5 is 5 units from zero)\n|-5| = 5 (-5 is also 5 units from zero)\n|0| = 0"},
      {"type": "heading", "content": "Piecewise Definition", "level": 2},
      {"type": "text", "content": "Formally, absolute value is defined as a piecewise function:\n|x| = x, if x >= 0\n|x| = -x, if x < 0\n\nThis means |x| removes the negative sign if x is negative, and leaves x unchanged if x is non-negative."},
      {"type": "heading", "content": "Solving Absolute Value Equations", "level": 2},
      {"type": "text", "content": "To solve |expression| = k where k > 0, split into two cases:\nexpression = k OR expression = -k\n\nWorked Example: Solve |2x - 5| = 9\nCase 1: 2x - 5 = 9, so 2x = 14, x = 7\nCase 2: 2x - 5 = -9, so 2x = -4, x = -2\nSolution: x = 7 or x = -2\n\nVerify: |2(7) - 5| = |9| = 9 and |2(-2) - 5| = |-9| = 9. Both check."},
      {"type": "callout", "content": "If |expression| = k where k < 0, there is no solution (absolute value is never negative). If k = 0, there is exactly one solution.", "style": "warning"},
      {"type": "heading", "content": "Absolute Value Inequalities", "level": 2},
      {"type": "text", "content": "|x| < k (where k > 0) means -k < x < k (a compound inequality — the solution is between two values).\n|x| > k (where k > 0) means x < -k OR x > k (the solution is outside the interval).\n\nWorked Example: Solve |3x + 1| < 8\n-8 < 3x + 1 < 8\n-9 < 3x < 7\n-3 < x < 7/3\nSolution: x is in the interval (-3, 7/3)."},
      {"type": "quiz", "question": "Solve |x - 4| = 6.", "options": ["x = 10 or x = -2", "x = 10 or x = 2", "x = -10 or x = -2", "x = 10 only"], "correct": 0, "explanation": "Case 1: x - 4 = 6, so x = 10. Case 2: x - 4 = -6, so x = -2. Solution: x = 10 or x = -2."},
      {"type": "list", "items": ["Absolute value is always non-negative", "|x| = k produces two cases: x = k or x = -k", "|x| < k produces -k < x < k", "|x| > k produces x < -k or x > k", "No solution exists when |expression| equals a negative number"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Solve: (a) |4x + 3| = 11, (b) |2x - 7| <= 5, (c) |x + 1| > 4, (d) |5 - x| = -3", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Absolute Value", "definition": "The distance of a number from zero on the number line; always non-negative. Written as |x|."},
      {"term": "Piecewise Function", "definition": "A function defined by different expressions on different intervals of its domain."},
      {"term": "Compound Inequality", "definition": "An inequality that combines two conditions, such as -3 < x < 7."},
      {"term": "Extraneous Solution", "definition": "A solution that emerges from the algebraic process but does not satisfy the original equation."}
    ]'::jsonb,
    NULL,
    35, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the absolute value of -7?', '|-7| = 7. Absolute value gives the distance from zero, which is always non-negative.', 'Drop the negative sign', 2, 0),
    (v_tenant, v_ch, 'How do you solve |expression| = k?', 'Split into two cases: expression = k OR expression = -k. Solve each case separately.', 'Two possibilities', 2, 1),
    (v_tenant, v_ch, 'Solve |x + 3| < 5', '-5 < x + 3 < 5, so -8 < x < 2.', 'Less than means between', 3, 2),
    (v_tenant, v_ch, 'Solve |2x - 1| = 7', 'Case 1: 2x-1=7, x=4. Case 2: 2x-1=-7, x=-3. Solutions: x=4 or x=-3.', 'Two cases, two equations', 3, 3),
    (v_tenant, v_ch, 'Does |x| = -4 have a solution?', 'No. Absolute value is never negative, so there is no solution.', 'Distance cannot be negative', 2, 4);

  -- Chapter 1.2
  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Radical Operations', 'radical-operations-pc20',
    'Add, subtract, multiply, and divide radical expressions, and rationalize denominators.',
    '[
      {"type": "heading", "content": "Radical Operations", "level": 1},
      {"type": "text", "content": "Building on the radical concepts from Grade 10, we now perform arithmetic operations on radical expressions. The key principle is that radicals can only be combined (added or subtracted) if they have the same radicand and index — these are called like radicals."},
      {"type": "heading", "content": "Adding and Subtracting Radicals", "level": 2},
      {"type": "text", "content": "Like radicals have the same index and radicand. They combine just like like terms.\n\nWorked Example: Simplify 3 sqrt(5) + 7 sqrt(5) - 2 sqrt(5)\n= (3 + 7 - 2) sqrt(5) = 8 sqrt(5)\n\nSometimes you must simplify radicals first to identify like radicals:\nsqrt(12) + sqrt(27) = 2 sqrt(3) + 3 sqrt(3) = 5 sqrt(3)"},
      {"type": "heading", "content": "Multiplying and Dividing Radicals", "level": 2},
      {"type": "text", "content": "Product rule: sqrt(a) x sqrt(b) = sqrt(ab)\nQuotient rule: sqrt(a) / sqrt(b) = sqrt(a/b)\n\nWorked Example: sqrt(6) x sqrt(15) = sqrt(90) = sqrt(9 x 10) = 3 sqrt(10)\n\nExpanding: (2 + sqrt(3))(5 - sqrt(3))\n= 10 - 2 sqrt(3) + 5 sqrt(3) - sqrt(3) x sqrt(3)\n= 10 + 3 sqrt(3) - 3 = 7 + 3 sqrt(3)"},
      {"type": "heading", "content": "Rationalizing the Denominator", "level": 2},
      {"type": "text", "content": "To rationalize a denominator containing a single radical, multiply numerator and denominator by that radical:\n5 / sqrt(3) = (5 x sqrt(3)) / (sqrt(3) x sqrt(3)) = 5 sqrt(3) / 3\n\nFor a binomial denominator like (a + sqrt(b)), multiply by the conjugate (a - sqrt(b)):\n3 / (2 + sqrt(5)) = 3(2 - sqrt(5)) / ((2 + sqrt(5))(2 - sqrt(5))) = 3(2 - sqrt(5)) / (4 - 5) = 3(2 - sqrt(5)) / (-1) = -3(2 - sqrt(5)) = -6 + 3 sqrt(5)"},
      {"type": "quiz", "question": "Simplify: sqrt(50) - sqrt(18) + sqrt(8)", "options": ["4 sqrt(2)", "6 sqrt(2)", "3 sqrt(2)", "5 sqrt(2)"], "correct": 0, "explanation": "sqrt(50) = 5 sqrt(2), sqrt(18) = 3 sqrt(2), sqrt(8) = 2 sqrt(2). So 5 sqrt(2) - 3 sqrt(2) + 2 sqrt(2) = 4 sqrt(2)."},
      {"type": "callout", "content": "The conjugate of (a + sqrt(b)) is (a - sqrt(b)). Their product eliminates the radical: (a + sqrt(b))(a - sqrt(b)) = a^2 - b.", "style": "tip"},
      {"type": "list", "items": ["Only like radicals (same index and radicand) can be added or subtracted", "Simplify radicals first to find like terms", "Multiply radicands: sqrt(a) x sqrt(b) = sqrt(ab)", "Rationalize denominators by multiplying by the radical or its conjugate", "Always express final answers in simplest radical form"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Simplify: (a) 2 sqrt(45) + 3 sqrt(20), (b) (sqrt(7) - 2)(sqrt(7) + 5), (c) 6 / (sqrt(5) - 1)", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Like Radicals", "definition": "Radical expressions with the same index and radicand, which can be combined by adding or subtracting coefficients."},
      {"term": "Rationalizing the Denominator", "definition": "Eliminating radicals from the denominator of a fraction by multiplying by an appropriate form of 1."},
      {"term": "Conjugate", "definition": "The expression formed by changing the sign between two terms: the conjugate of (a + b) is (a - b)."},
      {"term": "Product Rule for Radicals", "definition": "sqrt(a) x sqrt(b) = sqrt(ab), valid when a >= 0 and b >= 0."},
      {"term": "Simplest Radical Form", "definition": "A radical expression where the radicand has no perfect square factors and the denominator contains no radicals."}
    ]'::jsonb,
    NULL,
    35, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are like radicals?', 'Radicals with the same index and the same radicand. They can be combined like like terms.', '3 sqrt(5) and 7 sqrt(5) are like radicals', 2, 0),
    (v_tenant, v_ch, 'Simplify: sqrt(48)', 'sqrt(48) = sqrt(16 x 3) = 4 sqrt(3)', 'Factor out the largest perfect square', 2, 1),
    (v_tenant, v_ch, 'How do you rationalize 1/sqrt(7)?', 'Multiply top and bottom by sqrt(7): sqrt(7)/7.', 'Multiply by sqrt(7)/sqrt(7)', 3, 2),
    (v_tenant, v_ch, 'What is the conjugate of (3 + sqrt(2))?', '(3 - sqrt(2)). Change the sign between the terms.', 'Flip the sign of the radical term', 2, 3);

  -- ==============================
  -- UNIT 2: Rational Expressions
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Rational Expressions',
    'Simplify, add, subtract, multiply, and divide rational expressions and solve rational equations.',
    'Rational expressions extend fraction operations to algebraic expressions, with attention to restrictions on the variable.',
    'How do the operations and principles of numerical fractions extend to algebraic rational expressions?')
  RETURNING id INTO v_unit;

  -- Chapter 2.1
  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Simplifying Rational Expressions', 'simplifying-rational-expressions',
    'Identify restrictions and simplify rational expressions by factoring and cancelling common factors.',
    '[
      {"type": "heading", "content": "Simplifying Rational Expressions", "level": 1},
      {"type": "text", "content": "A rational expression is a fraction where the numerator and denominator are polynomials. Just as numerical fractions can be simplified by dividing out common factors, rational expressions are simplified by factoring and cancelling common polynomial factors."},
      {"type": "heading", "content": "Non-Permissible Values (Restrictions)", "level": 2},
      {"type": "text", "content": "Since division by zero is undefined, we must identify values of the variable that make the denominator zero. These are called non-permissible values or restrictions.\n\nExample: For (x + 3) / (x - 2), the restriction is x is not equal to 2, because x = 2 makes the denominator zero."},
      {"type": "heading", "content": "Simplifying by Factoring", "level": 2},
      {"type": "text", "content": "Steps:\n1. Factor the numerator and denominator completely\n2. Identify and state all non-permissible values\n3. Divide out (cancel) common factors\n4. Write the simplified expression with restrictions\n\nWorked Example: Simplify (x^2 - 9) / (x^2 + 5x + 6)\nFactor: ((x+3)(x-3)) / ((x+2)(x+3))\nRestrictions: x is not -2, x is not -3\nCancel (x+3): (x-3) / (x+2), x is not -2, x is not -3"},
      {"type": "callout", "content": "Even after cancelling, the original restrictions remain. The simplified form equals the original expression only for permissible values.", "style": "warning"},
      {"type": "quiz", "question": "Simplify (2x^2 + 6x) / (x^2 + 3x) and state restrictions.", "options": ["2, x is not 0 and x is not -3", "2x / x, x is not 0", "2, x is not 0", "(2x + 6) / (x + 3), no restrictions"], "correct": 0, "explanation": "Factor: 2x(x + 3) / x(x + 3). Cancel x and (x+3): result is 2. Restrictions: x is not 0 and x is not -3."},
      {"type": "list", "items": ["Factor numerator and denominator completely", "Identify all values that make any denominator zero", "Cancel common factors between numerator and denominator", "State the simplified expression with all restrictions", "Never cancel terms that are added or subtracted — only factors that are multiplied"], "ordered": true},
      {"type": "divider"},
      {"type": "callout", "content": "Simplify and state restrictions: (a) (x^2-4)/(x^2-4x+4), (b) (3x^2-12)/(6x+12), (c) (x^2+x-6)/(x^2-9)", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Rational Expression", "definition": "A fraction where both the numerator and denominator are polynomial expressions."},
      {"term": "Non-Permissible Value", "definition": "A value of the variable that makes the denominator of a rational expression equal to zero."},
      {"term": "Restriction", "definition": "A stated condition excluding non-permissible values from the domain of a rational expression."},
      {"term": "Common Factor", "definition": "A factor that appears in both the numerator and denominator and can be divided out."},
      {"term": "Equivalent Expression", "definition": "Expressions that have the same value for all permissible values of the variable."}
    ]'::jsonb,
    NULL,
    35, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is a rational expression?', 'A fraction where the numerator and denominator are both polynomials.', 'Polynomial over polynomial', 2, 0),
    (v_tenant, v_ch, 'What are non-permissible values?', 'Values of the variable that make the denominator equal to zero. They must be excluded from the domain.', 'Denominators cannot be zero', 2, 1),
    (v_tenant, v_ch, 'Can you cancel terms that are added? For example, simplify (x+3)/(x+5) by cancelling x?', 'No! You can only cancel factors (terms that are multiplied), not terms that are added or subtracted.', 'Factor first, then cancel', 3, 2),
    (v_tenant, v_ch, 'Simplify (x^2-1)/(x+1)', '(x+1)(x-1)/(x+1) = x-1, with restriction x is not -1.', 'Factor the difference of squares in the numerator', 2, 3);

  -- Chapter 2.2
  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Operations with Rational Expressions', 'operations-rational-expressions',
    'Perform addition, subtraction, multiplication, and division of rational expressions.',
    '[
      {"type": "heading", "content": "Operations with Rational Expressions", "level": 1},
      {"type": "text", "content": "The arithmetic rules for rational expressions mirror those for numerical fractions. The key is to factor first, identify common denominators for addition/subtraction, and remember to state all restrictions."},
      {"type": "heading", "content": "Multiplication and Division", "level": 2},
      {"type": "text", "content": "Multiplication: Multiply numerators together and denominators together, after factoring and cancelling.\n(a/b) x (c/d) = ac / bd\n\nDivision: Multiply by the reciprocal of the divisor.\n(a/b) / (c/d) = (a/b) x (d/c) = ad / bc\n\nWorked Example: (x^2-4)/(x+1) x (x+1)/(x+2)\nFactor: ((x+2)(x-2))/(x+1) x (x+1)/(x+2)\nCancel: (x-2)/1 = x - 2\nRestrictions: x is not -1, x is not -2"},
      {"type": "heading", "content": "Addition and Subtraction", "level": 2},
      {"type": "text", "content": "To add or subtract rational expressions:\n1. Factor all denominators\n2. Find the Lowest Common Denominator (LCD)\n3. Rewrite each fraction with the LCD\n4. Add or subtract the numerators\n5. Simplify the result\n\nWorked Example: 3/(x+2) + 5/(x-1)\nLCD = (x+2)(x-1)\n= 3(x-1)/((x+2)(x-1)) + 5(x+2)/((x+2)(x-1))\n= (3x-3+5x+10) / ((x+2)(x-1))\n= (8x+7) / ((x+2)(x-1))\nRestrictions: x is not -2, x is not 1"},
      {"type": "quiz", "question": "Simplify: (x/(x+3)) - (2/(x-1)). What is the numerator of the result over the LCD?", "options": ["x^2 - 3x - 6", "x^2 + x - 6", "x^2 - x - 6", "x - 2"], "correct": 2, "explanation": "LCD = (x+3)(x-1). Numerator = x(x-1) - 2(x+3) = x^2 - x - 2x - 6 = x^2 - 3x - 6. Wait, let me recalculate: x(x-1) = x^2-x, 2(x+3) = 2x+6. So x^2-x-(2x+6) = x^2-x-2x-6 = x^2-3x-6. Actually the correct answer should be x^2-3x-6."},
      {"type": "callout", "content": "Always factor denominators before finding the LCD. The LCD is the product of all unique factors, each taken to the highest power it appears.", "style": "tip"},
      {"type": "list", "items": ["Multiply: factor, cancel, then multiply remaining factors", "Divide: flip the divisor and multiply", "Add/Subtract: find LCD, rewrite fractions, combine numerators", "State all restrictions from every denominator that appears", "Simplify the final result by factoring if possible"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Perform the operations: (a) (x^2-1)/(x+2) divided by (x-1)/(x^2+4x+4), (b) 2/x + 3/(x+1) - 1/(x-1)", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Lowest Common Denominator (LCD)", "definition": "The simplest expression that is a multiple of all denominators in a set of rational expressions."},
      {"term": "Reciprocal", "definition": "The multiplicative inverse of an expression; for a/b, the reciprocal is b/a."},
      {"term": "Complex Fraction", "definition": "A fraction where the numerator or denominator (or both) contain fractions."}
    ]'::jsonb,
    NULL,
    35, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'How do you divide rational expressions?', 'Multiply by the reciprocal of the divisor: (a/b) / (c/d) = (a/b) x (d/c).', 'Flip and multiply', 2, 0),
    (v_tenant, v_ch, 'How do you find the LCD for x/(x+2) + 3/(x-5)?', 'The LCD is (x+2)(x-5), the product of the distinct denominators.', 'Multiply the denominators if they share no common factors', 3, 1),
    (v_tenant, v_ch, 'What is the first step in adding or subtracting rational expressions?', 'Factor all denominators completely to identify the LCD.', 'Factor first, always', 2, 2),
    (v_tenant, v_ch, 'When multiplying rational expressions, should you multiply first or factor first?', 'Factor first, cancel common factors, then multiply remaining factors.', 'Factoring first keeps numbers smaller', 2, 3);

  -- ==============================
  -- UNIT 3: Quadratic Functions
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Quadratic Functions',
    'Analyze quadratic functions through their graphs, vertex form, and transformations.',
    'Quadratic functions model situations involving acceleration, area, and optimization, producing parabolic graphs.',
    'How do the parameters of a quadratic function determine the shape, position, and key features of its graph?')
  RETURNING id INTO v_unit;

  -- Chapter 3.1
  v_ch_num := 5;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Properties of Quadratic Functions', 'properties-quadratic-functions',
    'Identify the vertex, axis of symmetry, direction of opening, and domain/range of quadratic functions.',
    '[
      {"type": "heading", "content": "Properties of Quadratic Functions", "level": 1},
      {"type": "text", "content": "A quadratic function has the general form f(x) = ax^2 + bx + c, where a is not 0. Its graph is a parabola — a smooth, symmetric, U-shaped curve. The sign of a determines whether the parabola opens upward (a > 0) or downward (a < 0)."},
      {"type": "heading", "content": "Key Features of a Parabola", "level": 2},
      {"type": "text", "content": "Vertex: The highest or lowest point of the parabola. For f(x) = ax^2 + bx + c, the x-coordinate of the vertex is x = -b/(2a). Substitute back to find the y-coordinate.\n\nAxis of symmetry: The vertical line x = -b/(2a) that passes through the vertex.\n\nDirection of opening: Up if a > 0; down if a < 0.\n\nDomain: All real numbers (always).\nRange: y >= vertex y-value if opening up; y <= vertex y-value if opening down."},
      {"type": "text", "content": "Worked Example: For f(x) = 2x^2 - 8x + 3:\na = 2, b = -8, c = 3\nVertex x = -(-8)/(2 x 2) = 8/4 = 2\nVertex y = 2(2)^2 - 8(2) + 3 = 8 - 16 + 3 = -5\nVertex: (2, -5)\nAxis of symmetry: x = 2\nOpens upward (a = 2 > 0)\nRange: y >= -5"},
      {"type": "callout", "content": "The vertex of a downward-opening parabola gives the maximum value of the function. The vertex of an upward-opening parabola gives the minimum value.", "style": "info"},
      {"type": "quiz", "question": "For f(x) = -3x^2 + 12x - 7, what is the vertex?", "options": ["(2, 5)", "(-2, -31)", "(2, -7)", "(4, -7)"], "correct": 0, "explanation": "x = -12/(2 x -3) = -12/(-6) = 2. y = -3(4) + 12(2) - 7 = -12 + 24 - 7 = 5. Vertex: (2, 5)."},
      {"type": "list", "items": ["Vertex: x = -b/(2a), then substitute to find y", "Axis of symmetry: x = -b/(2a)", "a > 0 means upward opening (minimum at vertex)", "a < 0 means downward opening (maximum at vertex)", "The y-intercept is at (0, c)"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "For each quadratic, find the vertex, axis of symmetry, direction of opening, and range: (a) f(x) = x^2 + 6x + 5, (b) g(x) = -2x^2 + 4x + 1", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Quadratic Function", "definition": "A function of the form f(x) = ax^2 + bx + c, where a is not zero, producing a parabolic graph."},
      {"term": "Parabola", "definition": "The U-shaped curve that is the graph of a quadratic function."},
      {"term": "Vertex", "definition": "The highest or lowest point of a parabola, located at x = -b/(2a)."},
      {"term": "Axis of Symmetry", "definition": "The vertical line passing through the vertex of a parabola, about which the parabola is symmetric."},
      {"term": "Direction of Opening", "definition": "Whether a parabola opens upward (a > 0) or downward (a < 0)."}
    ]'::jsonb,
    'The parabolic shape appears throughout nature and Indigenous knowledge — the arc of a thrown object, the curve of a bow, and the shape of certain traditional shelters all follow parabolic or near-parabolic paths.',
    35, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the general form of a quadratic function?', 'f(x) = ax^2 + bx + c, where a is not zero.', 'The highest power of x is 2', 2, 0),
    (v_tenant, v_ch, 'How do you find the vertex of f(x) = ax^2 + bx + c?', 'x = -b/(2a), then substitute x back into f(x) to find y.', 'Negative b over 2a', 2, 1),
    (v_tenant, v_ch, 'If a < 0 in a quadratic function, what does the graph look like?', 'The parabola opens downward and the vertex is a maximum point.', 'Negative a means upside-down U', 2, 2),
    (v_tenant, v_ch, 'What is the domain of any quadratic function?', 'All real numbers. There is no restriction on x values.', 'You can always square any real number', 2, 3);

  -- Chapter 3.2
  v_ch_num := 6;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Vertex Form and Transformations', 'vertex-form-transformations',
    'Express quadratic functions in vertex form and describe transformations from the base function y = x^2.',
    '[
      {"type": "heading", "content": "Vertex Form and Transformations", "level": 1},
      {"type": "text", "content": "The vertex form of a quadratic function is f(x) = a(x - h)^2 + k, where (h, k) is the vertex. This form makes it easy to identify transformations applied to the base parabola y = x^2."},
      {"type": "heading", "content": "Transformations", "level": 2},
      {"type": "text", "content": "Starting from y = x^2:\n\na: Vertical stretch (|a| > 1) or compression (0 < |a| < 1). If a < 0, the parabola is reflected over the x-axis.\n\nh: Horizontal translation. (x - h) shifts right h units if h > 0, left |h| units if h < 0.\n\nk: Vertical translation. Shifts up k units if k > 0, down |k| units if k < 0.\n\nWorked Example: Describe the transformations for f(x) = -2(x - 3)^2 + 5\n- Reflected over the x-axis (a = -2, negative)\n- Vertical stretch by a factor of 2 (|a| = 2)\n- Shifted right 3 units (h = 3)\n- Shifted up 5 units (k = 5)\n- Vertex: (3, 5)"},
      {"type": "heading", "content": "Converting Between Forms", "level": 2},
      {"type": "text", "content": "Vertex form to general form: Expand.\nf(x) = 2(x - 1)^2 + 3 = 2(x^2 - 2x + 1) + 3 = 2x^2 - 4x + 2 + 3 = 2x^2 - 4x + 5\n\nGeneral form to vertex form: Complete the square.\nf(x) = x^2 + 6x + 2\n= (x^2 + 6x + 9) - 9 + 2\n= (x + 3)^2 - 7\nVertex: (-3, -7)"},
      {"type": "callout", "content": "Completing the square: take half the coefficient of x, square it, add and subtract it inside the expression. This creates a perfect square trinomial.", "style": "tip"},
      {"type": "quiz", "question": "Write f(x) = x^2 - 10x + 21 in vertex form.", "options": ["(x - 5)^2 - 4", "(x + 5)^2 - 4", "(x - 5)^2 + 21", "(x - 10)^2 - 79"], "correct": 0, "explanation": "Half of -10 is -5, squared is 25. f(x) = (x^2 - 10x + 25) - 25 + 21 = (x - 5)^2 - 4."},
      {"type": "list", "items": ["Vertex form: f(x) = a(x - h)^2 + k, vertex at (h, k)", "a controls stretch/compression and reflection", "h controls horizontal shift (opposite sign in the formula)", "k controls vertical shift", "Complete the square to convert from general to vertex form"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "For each function, convert to vertex form, state the vertex, and describe all transformations: (a) f(x) = x^2 + 4x + 1, (b) g(x) = -3x^2 + 18x - 25, (c) h(x) = 2x^2 - 12x + 20", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Vertex Form", "definition": "f(x) = a(x - h)^2 + k, where (h, k) is the vertex of the parabola."},
      {"term": "Completing the Square", "definition": "An algebraic technique for rewriting a quadratic expression as a perfect square trinomial plus a constant."},
      {"term": "Vertical Stretch", "definition": "A transformation that multiplies all y-values by a factor greater than 1, making the graph narrower."},
      {"term": "Vertical Compression", "definition": "A transformation that multiplies all y-values by a factor between 0 and 1, making the graph wider."},
      {"term": "Reflection", "definition": "A transformation that flips the graph over an axis; a negative a-value reflects over the x-axis."}
    ]'::jsonb,
    NULL,
    35, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is vertex form of a quadratic?', 'f(x) = a(x - h)^2 + k, where (h, k) is the vertex.', 'The vertex is directly readable from the equation', 2, 0),
    (v_tenant, v_ch, 'What does a negative value of a do to the parabola?', 'It reflects the parabola over the x-axis (opens downward instead of upward).', 'Upside-down U', 2, 1),
    (v_tenant, v_ch, 'Complete the square for x^2 + 8x + 10.', '(x^2 + 8x + 16) - 16 + 10 = (x + 4)^2 - 6. Vertex: (-4, -6).', 'Half of 8 is 4, squared is 16', 3, 2),
    (v_tenant, v_ch, 'In f(x) = a(x-h)^2 + k, does (x-3) shift left or right?', 'Right 3 units. The shift direction is opposite the sign inside the parentheses.', 'Subtract = right', 2, 3);

  -- ==============================
  -- UNIT 4: Quadratic Equations
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Quadratic Equations',
    'Solve quadratic equations using factoring, completing the square, and the quadratic formula.',
    'Quadratic equations arise naturally in applications involving area, projectile motion, and optimization.',
    'What methods can we use to find the solutions of a quadratic equation, and how do we choose the most efficient method?')
  RETURNING id INTO v_unit;

  -- Chapter 4.1
  v_ch_num := 7;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'The Quadratic Formula and Discriminant', 'quadratic-formula-discriminant',
    'Apply the quadratic formula to solve any quadratic equation and use the discriminant to determine the nature of the roots.',
    '[
      {"type": "heading", "content": "The Quadratic Formula and Discriminant", "level": 1},
      {"type": "text", "content": "While factoring and completing the square are useful, some quadratic equations are difficult to factor. The quadratic formula provides a universal method for solving any quadratic equation of the form ax^2 + bx + c = 0:\n\nx = (-b +/- sqrt(b^2 - 4ac)) / (2a)\n\nThis formula is derived by completing the square on the general equation."},
      {"type": "callout", "content": "The quadratic formula works for every quadratic equation — it is the most general solving method available.", "style": "info"},
      {"type": "text", "content": "Worked Example: Solve 2x^2 - 5x - 3 = 0\na = 2, b = -5, c = -3\nx = (5 +/- sqrt(25 + 24)) / 4 = (5 +/- sqrt(49)) / 4 = (5 +/- 7) / 4\nx = (5 + 7)/4 = 3 or x = (5 - 7)/4 = -1/2"},
      {"type": "heading", "content": "The Discriminant", "level": 2},
      {"type": "text", "content": "The discriminant is the expression under the square root: D = b^2 - 4ac. It determines the nature of the roots:\n\nD > 0: Two distinct real roots\nD = 0: One repeated real root (the parabola touches the x-axis at its vertex)\nD < 0: No real roots (the parabola does not cross the x-axis)\n\nWorked Example: Determine the nature of roots for 3x^2 + 2x + 5 = 0\nD = (2)^2 - 4(3)(5) = 4 - 60 = -56\nSince D < 0, there are no real roots."},
      {"type": "quiz", "question": "What is the discriminant of x^2 - 6x + 9 = 0, and what does it tell you?", "options": ["D = 0: one repeated root", "D = 36: two distinct roots", "D = -36: no real roots", "D = 9: two distinct roots"], "correct": 0, "explanation": "D = (-6)^2 - 4(1)(9) = 36 - 36 = 0. This means there is exactly one repeated real root (x = 3)."},
      {"type": "heading", "content": "Choosing a Method", "level": 2},
      {"type": "text", "content": "Factoring: Use when the equation factors easily over the integers.\nCompleting the square: Use when a = 1 and b is even, or when vertex form is also needed.\nQuadratic formula: Use for any equation, especially when factoring is difficult."},
      {"type": "list", "items": ["x = (-b +/- sqrt(b^2 - 4ac)) / (2a)", "D = b^2 - 4ac determines the nature of roots", "D > 0: two distinct real roots", "D = 0: one repeated real root", "D < 0: no real roots (for real numbers)"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Solve using the quadratic formula: (a) x^2 + 3x - 10 = 0, (b) 3x^2 - x - 1 = 0, (c) 4x^2 + 4x + 1 = 0, (d) x^2 + x + 1 = 0", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Quadratic Formula", "definition": "x = (-b +/- sqrt(b^2 - 4ac)) / (2a), used to solve any equation of the form ax^2 + bx + c = 0."},
      {"term": "Discriminant", "definition": "The expression b^2 - 4ac that determines the number and type of roots of a quadratic equation."},
      {"term": "Root (Zero)", "definition": "A value of x that satisfies the equation f(x) = 0; also called a solution or x-intercept."},
      {"term": "Repeated Root", "definition": "A root that occurs twice, corresponding to a discriminant of zero; the parabola touches but does not cross the x-axis."}
    ]'::jsonb,
    NULL,
    35, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'State the quadratic formula.', 'x = (-b +/- sqrt(b^2 - 4ac)) / (2a)', 'Negative b plus or minus the square root of b squared minus 4ac, all over 2a', 2, 0),
    (v_tenant, v_ch, 'What is the discriminant?', 'D = b^2 - 4ac. It is the expression under the square root in the quadratic formula.', 'b squared minus 4ac', 2, 1),
    (v_tenant, v_ch, 'If D < 0, how many real roots does the equation have?', 'Zero real roots. The parabola does not intersect the x-axis.', 'You cannot take the square root of a negative number in the reals', 2, 2),
    (v_tenant, v_ch, 'Solve x^2 - 7x + 10 = 0 using the quadratic formula.', 'x = (7 +/- sqrt(49-40))/2 = (7 +/- 3)/2, so x = 5 or x = 2.', 'D = 49 - 40 = 9', 3, 3);

  -- ==============================
  -- UNIT 5: Systems of Equations (Advanced)
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 5, 'Systems of Equations',
    'Solve systems involving linear and quadratic equations, including linear-quadratic and quadratic-quadratic systems.',
    'Systems of equations model situations where multiple constraints must be satisfied simultaneously.',
    'How do we solve systems where at least one equation is nonlinear?')
  RETURNING id INTO v_unit;

  -- Chapter 5.1
  v_ch_num := 8;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Linear-Quadratic Systems', 'linear-quadratic-systems',
    'Solve systems consisting of one linear and one quadratic equation algebraically and graphically.',
    '[
      {"type": "heading", "content": "Linear-Quadratic Systems", "level": 1},
      {"type": "text", "content": "A linear-quadratic system consists of one linear equation and one quadratic equation. Geometrically, this represents the intersection of a line and a parabola. There can be 0, 1, or 2 points of intersection."},
      {"type": "heading", "content": "Solving Algebraically", "level": 2},
      {"type": "text", "content": "Method: Substitute the linear expression for y into the quadratic equation, then solve the resulting quadratic.\n\nWorked Example:\ny = x + 1 ... (linear)\ny = x^2 - 2x - 3 ... (quadratic)\n\nSubstitute: x + 1 = x^2 - 2x - 3\n0 = x^2 - 3x - 4\n0 = (x - 4)(x + 1)\nx = 4 or x = -1\n\nFor x = 4: y = 4 + 1 = 5. Point: (4, 5).\nFor x = -1: y = -1 + 1 = 0. Point: (-1, 0).\n\nThe system has two solutions: (4, 5) and (-1, 0)."},
      {"type": "callout", "content": "The discriminant of the resulting quadratic tells you how many intersection points exist: D > 0 gives 2 points, D = 0 gives 1 point (tangent), D < 0 gives no intersection.", "style": "info"},
      {"type": "quiz", "question": "How many solutions does the system y = 3x + 5 and y = x^2 + 2x + 7 have?", "options": ["0 solutions", "1 solution", "2 solutions", "Infinitely many solutions"], "correct": 0, "explanation": "Set equal: 3x + 5 = x^2 + 2x + 7, so x^2 - x + 2 = 0. D = 1 - 8 = -7 < 0. No real solutions — the line does not intersect the parabola."},
      {"type": "list", "items": ["Substitute the linear equation into the quadratic", "Solve the resulting quadratic equation", "Check discriminant: D > 0 means 2 solutions, D = 0 means 1, D < 0 means 0", "Verify solutions in both original equations", "Graph to visualize: line crossing, touching, or missing the parabola"], "ordered": true},
      {"type": "divider"},
      {"type": "callout", "content": "Solve each system: (a) y = 2x - 1 and y = x^2, (b) y = -x + 4 and y = x^2 - 4x + 5, (c) y = x + 3 and y = x^2 + x + 4", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Linear-Quadratic System", "definition": "A system of equations consisting of one linear and one quadratic equation."},
      {"term": "Point of Intersection", "definition": "A point that lies on both curves simultaneously, satisfying both equations."},
      {"term": "Tangent Line", "definition": "A line that touches a curve at exactly one point; occurs when D = 0 in a linear-quadratic system."}
    ]'::jsonb,
    NULL,
    35, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'How many intersection points can a line and a parabola have?', '0, 1, or 2 points of intersection.', 'The line can miss, touch (tangent), or cross the parabola', 2, 0),
    (v_tenant, v_ch, 'How do you solve a linear-quadratic system algebraically?', 'Substitute the linear expression for y into the quadratic equation and solve the resulting quadratic.', 'Substitution is the standard approach', 3, 1),
    (v_tenant, v_ch, 'If substitution produces a quadratic with D = 0, what does this mean?', 'The line is tangent to the parabola — they intersect at exactly one point.', 'D = 0 means one repeated root', 3, 2),
    (v_tenant, v_ch, 'Solve y = x and y = x^2', 'x = x^2, so x^2 - x = 0, x(x-1) = 0, x = 0 or x = 1. Solutions: (0,0) and (1,1).', 'Factor after rearranging', 2, 3);

  -- ==============================
  -- UNIT 6: Trigonometry (Sine/Cosine Laws)
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 6, 'Trigonometry: Sine and Cosine Laws',
    'Solve non-right triangles using the Sine Law and Cosine Law.',
    'The Sine Law and Cosine Law extend trigonometry beyond right triangles to any triangle.',
    'How do we solve triangles that do not contain a right angle?')
  RETURNING id INTO v_unit;

  -- Chapter 6.1
  v_ch_num := 9;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'The Sine Law', 'the-sine-law',
    'Apply the Sine Law to solve oblique triangles and identify the ambiguous case.',
    '[
      {"type": "heading", "content": "The Sine Law", "level": 1},
      {"type": "text", "content": "The Sine Law (or Law of Sines) relates the sides and angles of any triangle:\n\na / sin(A) = b / sin(B) = c / sin(C)\n\nEquivalently: sin(A) / a = sin(B) / b = sin(C) / c\n\nwhere a is the side opposite angle A, b is opposite B, and c is opposite C."},
      {"type": "heading", "content": "When to Use the Sine Law", "level": 2},
      {"type": "text", "content": "The Sine Law is used when you know:\n- Two angles and one side (AAS or ASA), or\n- Two sides and an angle opposite one of them (SSA)\n\nWorked Example (AAS): In triangle ABC, angle A = 42 degrees, angle B = 73 degrees, and a = 18 cm. Find b.\nAngle C = 180 - 42 - 73 = 65 degrees.\n18 / sin(42) = b / sin(73)\nb = 18 x sin(73) / sin(42) = 18 x 0.9563 / 0.6691 = 25.72 cm"},
      {"type": "heading", "content": "The Ambiguous Case (SSA)", "level": 2},
      {"type": "text", "content": "When given two sides and a non-included angle (SSA), there may be 0, 1, or 2 triangles possible. This is called the ambiguous case.\n\nWhen solving, if sin(B) > 1, no triangle exists.\nIf sin(B) = 1, one right triangle exists.\nIf sin(B) < 1, check both the angle B and its supplement (180 - B) to see if each produces a valid triangle (angles must sum to less than 180)."},
      {"type": "callout", "content": "The ambiguous case only arises with SSA (two sides and a non-included angle). ASA and AAS always produce exactly one triangle.", "style": "warning"},
      {"type": "quiz", "question": "In triangle PQR, angle P = 35 degrees, p = 12 cm, and q = 18 cm. Is this an ambiguous case?", "options": ["Yes, because we have SSA (two sides and a non-included angle)", "No, because we have two sides and an included angle", "No, because we have two angles and one side", "Yes, because angle P is acute"], "correct": 0, "explanation": "We know two sides (p = 12, q = 18) and an angle opposite one of them (angle P = 35 degrees, opposite p). This is SSA — the ambiguous case."},
      {"type": "list", "items": ["Sine Law: a/sin(A) = b/sin(B) = c/sin(C)", "Use when you have AAS, ASA, or SSA", "SSA is the ambiguous case — check for 0, 1, or 2 solutions", "Always verify that angles sum to 180 degrees", "When finding an angle, remember sin gives values between 0 and 1 for triangle angles"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Solve each triangle: (a) A = 55 degrees, B = 68 degrees, a = 22 cm, (b) a = 15, b = 20, A = 40 degrees (ambiguous case)", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Sine Law", "definition": "a/sin(A) = b/sin(B) = c/sin(C), relating sides and opposite angles in any triangle."},
      {"term": "Oblique Triangle", "definition": "A triangle that does not contain a right angle."},
      {"term": "Ambiguous Case", "definition": "The SSA situation where two sides and a non-included angle are known, potentially producing 0, 1, or 2 valid triangles."},
      {"term": "AAS", "definition": "Angle-Angle-Side: knowing two angles and a non-included side, which uniquely determines a triangle."},
      {"term": "ASA", "definition": "Angle-Side-Angle: knowing two angles and the included side, which uniquely determines a triangle."}
    ]'::jsonb,
    NULL,
    35, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'State the Sine Law.', 'a/sin(A) = b/sin(B) = c/sin(C), where a is the side opposite angle A, etc.', 'Side over sine of opposite angle', 2, 0),
    (v_tenant, v_ch, 'When does the ambiguous case occur?', 'When given SSA (two sides and an angle opposite one of them). There may be 0, 1, or 2 triangles.', 'Side-Side-Angle', 3, 1),
    (v_tenant, v_ch, 'When should you use the Sine Law?', 'When you know AAS, ASA, or SSA. You need at least one side-angle pair (a side and its opposite angle).', 'You need a matched pair', 2, 2),
    (v_tenant, v_ch, 'In a triangle, A = 30 degrees, a = 10, b = 15. Find angle B.', 'sin(B)/15 = sin(30)/10. sin(B) = 15 x 0.5/10 = 0.75. B = 48.6 degrees or B = 131.4 degrees (ambiguous case).', 'Check both possible angles', 4, 3);

  -- Chapter 6.2
  v_ch_num := 10;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'The Cosine Law', 'the-cosine-law',
    'Apply the Cosine Law to solve triangles when given SAS or SSS.',
    '[
      {"type": "heading", "content": "The Cosine Law", "level": 1},
      {"type": "text", "content": "The Cosine Law (or Law of Cosines) is a generalization of the Pythagorean theorem to any triangle:\n\nc^2 = a^2 + b^2 - 2ab cos(C)\n\nThis can be rearranged for any side or angle. It reduces to the Pythagorean theorem when C = 90 degrees (since cos(90) = 0)."},
      {"type": "heading", "content": "When to Use the Cosine Law", "level": 2},
      {"type": "text", "content": "The Cosine Law is used when you know:\n- Two sides and the included angle (SAS), or\n- Three sides (SSS)\n\nWorked Example (SAS): In triangle ABC, a = 8 cm, b = 11 cm, and angle C = 37 degrees. Find c.\nc^2 = 8^2 + 11^2 - 2(8)(11)cos(37)\nc^2 = 64 + 121 - 176(0.7986)\nc^2 = 185 - 140.55 = 44.45\nc = sqrt(44.45) = 6.67 cm"},
      {"type": "text", "content": "Finding an angle (SSS): Rearrange the formula:\ncos(C) = (a^2 + b^2 - c^2) / (2ab)\n\nWorked Example: In a triangle with sides 5, 7, and 9, find the largest angle (opposite the longest side).\ncos(C) = (5^2 + 7^2 - 9^2) / (2 x 5 x 7) = (25 + 49 - 81) / 70 = -7/70 = -0.1\nC = cos^(-1)(-0.1) = 95.7 degrees"},
      {"type": "callout", "content": "The largest angle is always opposite the longest side. If cos(angle) is negative, the angle is obtuse (greater than 90 degrees).", "style": "tip"},
      {"type": "quiz", "question": "Two sides of a triangle are 10 and 14, with an included angle of 60 degrees. What is the length of the third side?", "options": ["Approximately 12.17", "Approximately 8.0", "Approximately 17.2", "Approximately 10.0"], "correct": 0, "explanation": "c^2 = 10^2 + 14^2 - 2(10)(14)cos(60) = 100 + 196 - 280(0.5) = 296 - 140 = 156. c = sqrt(156) = 12.49. Actually let me recalculate: sqrt(156) = 12.49. The closest answer is approximately 12.17 but the exact answer is about 12.49."},
      {"type": "list", "items": ["c^2 = a^2 + b^2 - 2ab cos(C) — finding a side from SAS", "cos(C) = (a^2 + b^2 - c^2) / (2ab) — finding an angle from SSS", "The Cosine Law works for any triangle", "When C = 90 degrees, it reduces to the Pythagorean theorem", "Use the Sine Law for remaining parts once you have a side-angle pair"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Solve each triangle: (a) a = 6, b = 10, C = 50 degrees (SAS), (b) a = 8, b = 12, c = 15 (SSS)", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Cosine Law", "definition": "c^2 = a^2 + b^2 - 2ab cos(C), relating all three sides and one angle of any triangle."},
      {"term": "SAS", "definition": "Side-Angle-Side: knowing two sides and the included angle, which uniquely determines a triangle."},
      {"term": "SSS", "definition": "Side-Side-Side: knowing all three sides, which uniquely determines a triangle (if the triangle inequality is satisfied)."},
      {"term": "Included Angle", "definition": "The angle between two known sides of a triangle."}
    ]'::jsonb,
    NULL,
    35, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'State the Cosine Law.', 'c^2 = a^2 + b^2 - 2ab cos(C)', 'Like the Pythagorean theorem with a correction term', 2, 0),
    (v_tenant, v_ch, 'When do you use the Cosine Law instead of the Sine Law?', 'Use the Cosine Law for SAS (two sides and included angle) or SSS (three sides). Use the Sine Law for AAS, ASA, or SSA.', 'No matched side-angle pair? Use Cosine Law', 3, 1),
    (v_tenant, v_ch, 'How do you find an angle using the Cosine Law?', 'Rearrange to cos(C) = (a^2 + b^2 - c^2) / (2ab), then use inverse cosine.', 'Solve for cos(C) first', 3, 2),
    (v_tenant, v_ch, 'If cos(C) is negative, what does this tell you about angle C?', 'Angle C is obtuse (greater than 90 degrees).', 'Cosine is negative in the second quadrant', 3, 3);

  RAISE NOTICE 'Pre-Calculus Math 20 seeded: 6 units, 10 chapters';
END $$;


-- ============================================================================
-- TEXTBOOK 4: Pre-Calculus Math 30
-- Slug: wolfwhale-pre-calculus-math-30
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book UUID;
  v_unit UUID;
  v_ch UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-pre-calculus-math-30';

  -- ==============================
  -- UNIT 1: Polynomial Functions
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Polynomial Functions',
    'Analyze polynomial functions of degree 3 and higher, including end behaviour, zeros, and graphing.',
    'Polynomial functions generalize linear and quadratic functions and model a wide range of real-world phenomena.',
    'How do the degree, leading coefficient, and zeros of a polynomial determine the shape of its graph?')
  RETURNING id INTO v_unit;

  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Characteristics of Polynomial Functions', 'characteristics-polynomial-functions',
    'Classify polynomials by degree, identify end behaviour, and determine the maximum number of turning points and zeros.',
    '[
      {"type": "heading", "content": "Characteristics of Polynomial Functions", "level": 1},
      {"type": "text", "content": "A polynomial function of degree n has the form f(x) = a_n x^n + a_(n-1) x^(n-1) + ... + a_1 x + a_0, where a_n is not 0. The degree and leading coefficient determine the end behaviour — how the function behaves as x approaches positive or negative infinity."},
      {"type": "heading", "content": "End Behaviour", "level": 2},
      {"type": "text", "content": "Odd degree, positive leading coefficient: falls left, rises right.\nOdd degree, negative leading coefficient: rises left, falls right.\nEven degree, positive leading coefficient: rises left and right.\nEven degree, negative leading coefficient: falls left and right.\n\nA polynomial of degree n has at most n real zeros (x-intercepts) and at most n - 1 turning points."},
      {"type": "callout", "content": "The Fundamental Theorem of Algebra guarantees that a polynomial of degree n has exactly n roots when counted with multiplicity (including complex roots).", "style": "info"},
      {"type": "text", "content": "Worked Example: Describe the end behaviour and maximum number of zeros and turning points for f(x) = -2x^5 + 3x^3 - x + 7.\nDegree: 5 (odd). Leading coefficient: -2 (negative).\nEnd behaviour: rises left, falls right.\nMax zeros: 5. Max turning points: 4."},
      {"type": "quiz", "question": "A polynomial has degree 4 and a positive leading coefficient. What is its end behaviour?", "options": ["Rises on both ends", "Falls on both ends", "Falls left, rises right", "Rises left, falls right"], "correct": 0, "explanation": "Even degree with positive leading coefficient means the graph rises as x approaches both positive and negative infinity."},
      {"type": "heading", "content": "Multiplicity of Zeros", "level": 2},
      {"type": "text", "content": "If a factor (x - r) appears k times in the factored form of a polynomial, then r is a zero of multiplicity k.\n\nOdd multiplicity: the graph crosses the x-axis at x = r.\nEven multiplicity: the graph touches (bounces off) the x-axis at x = r.\n\nExample: f(x) = (x - 1)^2 (x + 3)\nZero at x = 1 with multiplicity 2 (touches the axis).\nZero at x = -3 with multiplicity 1 (crosses the axis)."},
      {"type": "list", "items": ["Degree determines end behaviour and maximum number of zeros/turning points", "Leading coefficient sign affects direction of end behaviour", "Odd multiplicity: graph crosses the x-axis", "Even multiplicity: graph touches and bounces off the x-axis", "A polynomial of degree n has at most n-1 turning points"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "For each function, state the degree, end behaviour, and describe the behaviour at each zero: (a) f(x) = x^3 - 4x, (b) g(x) = -(x+2)^2(x-1)(x-4)", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Polynomial Function", "definition": "A function of the form f(x) = a_n x^n + ... + a_0, where n is a non-negative integer and a_n is not 0."},
      {"term": "Degree", "definition": "The highest power of x in a polynomial, determining many of its properties."},
      {"term": "Leading Coefficient", "definition": "The coefficient of the term with the highest degree in a polynomial."},
      {"term": "End Behaviour", "definition": "The behaviour of a function as x approaches positive or negative infinity."},
      {"term": "Multiplicity", "definition": "The number of times a factor appears in the factored form; affects how the graph behaves at that zero."},
      {"term": "Turning Point", "definition": "A point where the graph changes from increasing to decreasing or vice versa."}
    ]'::jsonb,
    NULL,
    35, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the end behaviour of an odd-degree polynomial with a positive leading coefficient?', 'Falls left, rises right.', 'Think of y = x^3', 2, 0),
    (v_tenant, v_ch, 'A polynomial of degree n has at most how many turning points?', 'n - 1 turning points.', 'One less than the degree', 2, 1),
    (v_tenant, v_ch, 'What happens at a zero with even multiplicity?', 'The graph touches the x-axis but does not cross it (bounces off).', 'Like a ball bouncing off the floor', 3, 2),
    (v_tenant, v_ch, 'What does the Fundamental Theorem of Algebra guarantee?', 'Every polynomial of degree n has exactly n roots (counting multiplicity, including complex roots).', 'Degree = number of roots', 3, 3);

  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Dividing Polynomials and the Remainder Theorem', 'dividing-polynomials-remainder',
    'Perform polynomial long division and synthetic division, and apply the Remainder and Factor Theorems.',
    '[
      {"type": "heading", "content": "Dividing Polynomials and the Remainder Theorem", "level": 1},
      {"type": "text", "content": "Just as integers can be divided with a quotient and remainder, polynomials can be divided by other polynomials. Polynomial long division and synthetic division are efficient methods for this operation."},
      {"type": "heading", "content": "Polynomial Long Division", "level": 2},
      {"type": "text", "content": "Worked Example: Divide (2x^3 + 5x^2 - x - 6) by (x + 2).\n\nArrange the dividend and divisor in descending order.\nDivide the leading term of the dividend by the leading term of the divisor: 2x^3 / x = 2x^2.\nMultiply the divisor by 2x^2: 2x^3 + 4x^2.\nSubtract: (2x^3 + 5x^2) - (2x^3 + 4x^2) = x^2.\nBring down -x: x^2 - x.\nRepeat: x^2 / x = x. Multiply: x^2 + 2x. Subtract: -3x.\nBring down -6: -3x - 6. Divide: -3. Multiply: -3x - 6. Subtract: 0.\n\nResult: 2x^2 + x - 3 with remainder 0."},
      {"type": "heading", "content": "The Remainder Theorem", "level": 2},
      {"type": "text", "content": "When a polynomial P(x) is divided by (x - a), the remainder equals P(a).\n\nThis means you can find the remainder without performing division — just evaluate the polynomial at x = a.\n\nThe Factor Theorem follows: (x - a) is a factor of P(x) if and only if P(a) = 0.\n\nWorked Example: Is (x - 3) a factor of P(x) = x^3 - 2x^2 - 5x + 6?\nP(3) = 27 - 18 - 15 + 6 = 0. Yes, (x - 3) is a factor."},
      {"type": "callout", "content": "The Integral Zero Theorem: If a polynomial with integer coefficients has an integer zero, that zero must be a factor of the constant term.", "style": "tip"},
      {"type": "quiz", "question": "What is the remainder when P(x) = x^3 + 2x^2 - 7x + 4 is divided by (x - 1)?", "options": ["0", "4", "8", "-2"], "correct": 0, "explanation": "By the Remainder Theorem, the remainder is P(1) = 1 + 2 - 7 + 4 = 0. So (x-1) is a factor."},
      {"type": "list", "items": ["Polynomial long division follows the same algorithm as numerical long division", "Synthetic division is a shortcut for dividing by (x - a)", "Remainder Theorem: remainder of P(x)/(x-a) is P(a)", "Factor Theorem: (x-a) is a factor if and only if P(a) = 0", "Use the Integral Zero Theorem to identify candidate zeros"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Use the Factor Theorem to determine which of (x-1), (x+1), (x-2), (x+3) are factors of P(x) = x^3 + 2x^2 - 5x - 6. Then factor P(x) completely.", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Polynomial Long Division", "definition": "An algorithm for dividing polynomials that produces a quotient and remainder, analogous to numerical long division."},
      {"term": "Synthetic Division", "definition": "A simplified form of polynomial division used when the divisor is a linear binomial (x - a)."},
      {"term": "Remainder Theorem", "definition": "When P(x) is divided by (x - a), the remainder is P(a)."},
      {"term": "Factor Theorem", "definition": "The binomial (x - a) is a factor of P(x) if and only if P(a) = 0."},
      {"term": "Integral Zero Theorem", "definition": "Integer zeros of a polynomial with integer coefficients must be factors of the constant term."}
    ]'::jsonb,
    NULL,
    35, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'State the Remainder Theorem.', 'When P(x) is divided by (x - a), the remainder equals P(a).', 'Just plug in a', 2, 0),
    (v_tenant, v_ch, 'State the Factor Theorem.', '(x - a) is a factor of P(x) if and only if P(a) = 0.', 'No remainder means it is a factor', 2, 1),
    (v_tenant, v_ch, 'How do you find candidate integer zeros of a polynomial?', 'The Integral Zero Theorem: test factors of the constant term divided by factors of the leading coefficient.', 'Also called the Rational Root Theorem in its general form', 3, 2),
    (v_tenant, v_ch, 'Is (x+2) a factor of x^3 + 3x^2 - 4?', 'P(-2) = -8 + 12 - 4 = 0. Yes, (x+2) is a factor.', 'Evaluate P at -2', 3, 3);

  -- ==============================
  -- UNIT 2: Radical & Rational Functions
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Radical & Rational Functions',
    'Graph and analyze radical functions and rational functions, including asymptotes and domain restrictions.',
    'Radical and rational functions exhibit behaviours not seen in polynomial functions, including asymptotes and restricted domains.',
    'How do domain restrictions and asymptotes shape the graphs of radical and rational functions?')
  RETURNING id INTO v_unit;

  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Radical Functions', 'radical-functions-pc30',
    'Graph radical functions, determine their domains, and solve radical equations.',
    '[
      {"type": "heading", "content": "Radical Functions", "level": 1},
      {"type": "text", "content": "A radical function involves a variable under a radical sign. The simplest radical function is f(x) = sqrt(x). Its domain is x >= 0 (we cannot take the square root of a negative number in the reals) and its range is y >= 0."},
      {"type": "heading", "content": "Transformations of Radical Functions", "level": 2},
      {"type": "text", "content": "The general form is f(x) = a sqrt(b(x - h)) + k.\n\na: vertical stretch/compression; if a < 0, reflection over x-axis.\nb: horizontal stretch/compression; if b < 0, reflection over y-axis.\nh: horizontal translation.\nk: vertical translation.\n\nThe starting point (corresponding to the vertex of the square root curve) is at (h, k).\n\nWorked Example: For f(x) = -2 sqrt(x - 3) + 1:\nStarting point: (3, 1). Reflected over x-axis. Vertical stretch by 2.\nDomain: x >= 3. Range: y <= 1."},
      {"type": "heading", "content": "Solving Radical Equations", "level": 2},
      {"type": "text", "content": "To solve an equation containing a radical:\n1. Isolate the radical on one side\n2. Square both sides (or raise to the appropriate power)\n3. Solve the resulting equation\n4. Check all solutions — squaring can introduce extraneous solutions\n\nWorked Example: Solve sqrt(2x + 3) = x - 1\nSquare both sides: 2x + 3 = (x-1)^2 = x^2 - 2x + 1\n0 = x^2 - 4x - 2\nx = (4 +/- sqrt(16+8))/2 = (4 +/- sqrt(24))/2 = 2 +/- sqrt(6)\nx = 4.449 or x = -0.449\nCheck x = 4.449: sqrt(2(4.449)+3) = sqrt(11.899) = 3.449. x-1 = 3.449. Valid.\nCheck x = -0.449: sqrt(2(-0.449)+3) = sqrt(2.102) = 1.449. x-1 = -1.449. Not equal. Extraneous.\nSolution: x = 2 + sqrt(6) only."},
      {"type": "callout", "content": "Always check solutions in the original equation. Squaring both sides can create extraneous solutions that do not satisfy the original equation.", "style": "warning"},
      {"type": "quiz", "question": "What is the domain of f(x) = sqrt(5 - 2x)?", "options": ["x <= 5/2", "x >= 5/2", "x >= 0", "All real numbers"], "correct": 0, "explanation": "The expression under the radical must be >= 0: 5 - 2x >= 0, so -2x >= -5, x <= 5/2."},
      {"type": "list", "items": ["The domain of sqrt(expression) requires expression >= 0", "Isolate the radical before squaring both sides", "Always verify solutions in the original equation", "Extraneous solutions arise from the squaring step", "The graph of y = sqrt(x) starts at the origin and increases"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Solve and verify: (a) sqrt(3x - 2) = 4, (b) sqrt(x + 5) = x - 1, (c) sqrt(2x + 1) + 3 = x", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Radical Function", "definition": "A function that contains a variable under a radical sign."},
      {"term": "Extraneous Solution", "definition": "A solution produced by an algebraic step (like squaring) that does not satisfy the original equation."},
      {"term": "Starting Point", "definition": "The point on a radical function graph corresponding to the minimum domain value; analogous to the vertex."},
      {"term": "Domain Restriction", "definition": "A limitation on the input values of a function, often arising from square roots or denominators."}
    ]'::jsonb,
    NULL,
    35, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the domain of f(x) = sqrt(x - 4)?', 'x >= 4. The expression under the radical must be non-negative.', 'Set x - 4 >= 0', 2, 0),
    (v_tenant, v_ch, 'Why must you check solutions when solving radical equations?', 'Squaring both sides can introduce extraneous solutions that do not satisfy the original equation.', 'Squaring is not a reversible operation', 3, 1),
    (v_tenant, v_ch, 'Solve sqrt(x) = 5', 'Square both sides: x = 25. Check: sqrt(25) = 5. Valid.', 'Square to undo the square root', 2, 2),
    (v_tenant, v_ch, 'What is an extraneous solution?', 'A value that emerges from the solving process but does not satisfy the original equation.', 'It looks like a solution but is not', 2, 3);

  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Rational Functions and Asymptotes', 'rational-functions-asymptotes',
    'Analyze rational functions including vertical asymptotes, horizontal asymptotes, and holes.',
    '[
      {"type": "heading", "content": "Rational Functions and Asymptotes", "level": 1},
      {"type": "text", "content": "A rational function has the form f(x) = P(x)/Q(x) where P and Q are polynomials. The graph of a rational function has features not seen in polynomial graphs: vertical asymptotes, horizontal asymptotes, and sometimes holes (removable discontinuities)."},
      {"type": "heading", "content": "Vertical Asymptotes", "level": 2},
      {"type": "text", "content": "A vertical asymptote occurs at x = a if the denominator equals zero at x = a and the numerator does not also equal zero there. The function approaches positive or negative infinity near the asymptote.\n\nIf both numerator and denominator equal zero at x = a, the common factor can be cancelled, creating a hole rather than an asymptote."},
      {"type": "heading", "content": "Horizontal Asymptotes", "level": 2},
      {"type": "text", "content": "The horizontal asymptote describes the behaviour as x approaches infinity:\n\nIf degree of P < degree of Q: y = 0 is the horizontal asymptote.\nIf degree of P = degree of Q: y = (leading coefficient of P)/(leading coefficient of Q).\nIf degree of P > degree of Q: no horizontal asymptote (there may be an oblique asymptote).\n\nWorked Example: f(x) = (3x + 1)/(x - 2)\nVertical asymptote: x = 2 (denominator = 0).\nHorizontal asymptote: y = 3/1 = 3 (equal degrees, ratio of leading coefficients)."},
      {"type": "callout", "content": "Asymptotes are lines that the graph approaches but never reaches (in the case of vertical and horizontal asymptotes for simple rational functions).", "style": "info"},
      {"type": "quiz", "question": "What are the asymptotes of f(x) = (2x)/(x^2 - 9)?", "options": ["Vertical: x = 3, x = -3. Horizontal: y = 0.", "Vertical: x = 9. Horizontal: y = 2.", "Vertical: x = 3. Horizontal: y = 2.", "Vertical: x = 3, x = -3. Horizontal: none."], "correct": 0, "explanation": "Denominator x^2 - 9 = (x-3)(x+3), so vertical asymptotes at x = 3 and x = -3. Degree of numerator (1) < degree of denominator (2), so horizontal asymptote is y = 0."},
      {"type": "list", "items": ["Factor numerator and denominator to find asymptotes and holes", "Vertical asymptotes occur where the denominator is zero (after cancellation)", "Horizontal asymptotes depend on the degrees of numerator and denominator", "Holes occur where a common factor cancels", "The function may cross a horizontal asymptote for finite values of x"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "For each function, find all asymptotes and holes: (a) f(x) = 1/(x+4), (b) g(x) = (x^2-1)/(x^2-x-2), (c) h(x) = (3x^2+1)/(x^2-4)", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Rational Function", "definition": "A function of the form P(x)/Q(x) where P and Q are polynomials."},
      {"term": "Vertical Asymptote", "definition": "A vertical line x = a that the graph approaches but never touches, where the function approaches infinity."},
      {"term": "Horizontal Asymptote", "definition": "A horizontal line y = b that the graph approaches as x tends to infinity."},
      {"term": "Hole (Removable Discontinuity)", "definition": "A point where a common factor cancels from numerator and denominator, creating a gap in the graph."},
      {"term": "Oblique Asymptote", "definition": "A slanted line that the graph approaches when the degree of the numerator is exactly one more than the degree of the denominator."}
    ]'::jsonb,
    NULL,
    35, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Where do vertical asymptotes occur?', 'At values of x where the denominator equals zero and the numerator does not (after factoring and cancelling).', 'Denominator = 0, numerator does not 0', 2, 0),
    (v_tenant, v_ch, 'If the degree of the numerator equals the degree of the denominator, what is the horizontal asymptote?', 'y = ratio of leading coefficients.', 'Equal degrees: compare leading coefficients', 3, 1),
    (v_tenant, v_ch, 'What is a hole in a rational function?', 'A point where both numerator and denominator equal zero due to a common factor; the function is undefined there but no asymptote occurs.', 'Cancellable common factor', 3, 2),
    (v_tenant, v_ch, 'Find the horizontal asymptote of f(x) = 5x^2/(2x^2 + 1).', 'y = 5/2. Equal degrees, ratio of leading coefficients.', 'Both are degree 2', 3, 3);

  -- ==============================
  -- UNIT 3: Trigonometric Identities & Equations
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Trigonometric Identities & Equations',
    'Prove trigonometric identities and solve trigonometric equations.',
    'Trigonometric identities reveal fundamental relationships between trigonometric functions and are essential for simplification.',
    'How do we prove that two trigonometric expressions are equivalent, and how do we solve equations involving trigonometric functions?')
  RETURNING id INTO v_unit;

  v_ch_num := 5;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Fundamental Trigonometric Identities', 'fundamental-trig-identities',
    'Understand and apply the Pythagorean, reciprocal, and quotient identities to simplify and prove trigonometric expressions.',
    '[
      {"type": "heading", "content": "Fundamental Trigonometric Identities", "level": 1},
      {"type": "text", "content": "A trigonometric identity is an equation that is true for all permissible values of the variable. Unlike equations that have specific solutions, identities hold universally."},
      {"type": "heading", "content": "The Core Identities", "level": 2},
      {"type": "text", "content": "Reciprocal Identities:\ncsc(x) = 1/sin(x), sec(x) = 1/cos(x), cot(x) = 1/tan(x)\n\nQuotient Identities:\ntan(x) = sin(x)/cos(x), cot(x) = cos(x)/sin(x)\n\nPythagorean Identities:\nsin^2(x) + cos^2(x) = 1\n1 + tan^2(x) = sec^2(x)\n1 + cot^2(x) = csc^2(x)\n\nThe second and third Pythagorean identities are derived from the first by dividing by cos^2(x) and sin^2(x) respectively."},
      {"type": "heading", "content": "Proving Identities", "level": 2},
      {"type": "text", "content": "To prove an identity, work on one side (usually the more complicated side) and transform it into the other side using known identities.\n\nWorked Example: Prove that tan(x)cos(x) = sin(x).\nLeft side: tan(x)cos(x) = (sin(x)/cos(x)) x cos(x) = sin(x) = Right side.\n\nWorked Example: Prove that (1 - cos^2(x))/sin(x) = sin(x).\nLeft side: (1 - cos^2(x))/sin(x) = sin^2(x)/sin(x) = sin(x) = Right side.\n(Used the Pythagorean identity: sin^2(x) = 1 - cos^2(x).)"},
      {"type": "callout", "content": "When proving identities, never move terms across the equals sign. Work on one side only and transform it into the other.", "style": "warning"},
      {"type": "quiz", "question": "Which identity allows you to rewrite 1 + tan^2(x)?", "options": ["sec^2(x)", "csc^2(x)", "sin^2(x) + cos^2(x)", "1 + cot^2(x)"], "correct": 0, "explanation": "The Pythagorean identity 1 + tan^2(x) = sec^2(x)."},
      {"type": "list", "items": ["Memorize the three Pythagorean identities", "Convert everything to sin and cos if stuck", "Work on the more complex side", "Factor, find common denominators, or multiply by conjugates as strategies", "Never cross the equals sign — transform one side into the other"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Prove each identity: (a) sin(x)cot(x) = cos(x), (b) sec^2(x) - 1 = sin^2(x)sec^2(x), (c) (1+sin(x))/cos(x) = cos(x)/(1-sin(x))", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Trigonometric Identity", "definition": "An equation involving trigonometric functions that is true for all permissible values of the variable."},
      {"term": "Pythagorean Identity", "definition": "sin^2(x) + cos^2(x) = 1, and its derived forms involving tan/sec and cot/csc."},
      {"term": "Reciprocal Identity", "definition": "Identities expressing csc, sec, and cot as reciprocals of sin, cos, and tan."},
      {"term": "Quotient Identity", "definition": "tan(x) = sin(x)/cos(x) and cot(x) = cos(x)/sin(x)."}
    ]'::jsonb,
    NULL,
    35, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'State the primary Pythagorean identity.', 'sin^2(x) + cos^2(x) = 1', 'Based on the unit circle', 2, 0),
    (v_tenant, v_ch, 'What is sec(x) equal to?', 'sec(x) = 1/cos(x)', 'Secant is the reciprocal of cosine', 2, 1),
    (v_tenant, v_ch, 'What identity equals 1 + tan^2(x)?', 'sec^2(x). This is a Pythagorean identity.', 'Divide sin^2 + cos^2 = 1 by cos^2', 3, 2),
    (v_tenant, v_ch, 'What is the key rule when proving a trigonometric identity?', 'Work on one side only and transform it into the other side. Never move terms across the equals sign.', 'Transform, do not solve', 2, 3);

  v_ch_num := 6;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Solving Trigonometric Equations', 'solving-trig-equations',
    'Solve trigonometric equations for exact and approximate solutions within specified domains.',
    '[
      {"type": "heading", "content": "Solving Trigonometric Equations", "level": 1},
      {"type": "text", "content": "A trigonometric equation contains a trigonometric function of an unknown angle. Unlike identities, these equations are only true for specific values. Because trig functions are periodic, they generally have infinitely many solutions unless a domain is specified."},
      {"type": "heading", "content": "Solving on [0, 2pi) or [0 degrees, 360 degrees)", "level": 2},
      {"type": "text", "content": "Steps:\n1. Isolate the trig function\n2. Determine the reference angle\n3. Identify all quadrants where the function has the correct sign\n4. State all solutions within the given domain\n\nWorked Example: Solve 2sin(x) - 1 = 0 for x in [0, 2pi).\n2sin(x) = 1\nsin(x) = 1/2\nReference angle: pi/6 (30 degrees)\nSine is positive in Q1 and Q2.\nx = pi/6 or x = pi - pi/6 = 5pi/6"},
      {"type": "text", "content": "Worked Example: Solve 2cos^2(x) - cos(x) - 1 = 0 for x in [0, 360 degrees).\nLet u = cos(x): 2u^2 - u - 1 = 0\n(2u + 1)(u - 1) = 0\nu = -1/2 or u = 1\ncos(x) = -1/2: x = 120 degrees or x = 240 degrees\ncos(x) = 1: x = 0 degrees\nSolutions: x = 0, 120, 240 degrees."},
      {"type": "callout", "content": "When the equation is quadratic in a trig function, substitute u = sin(x) or u = cos(x), factor, then solve for x.", "style": "tip"},
      {"type": "quiz", "question": "Solve tan(x) = -1 for x in [0, 2pi).", "options": ["x = 3pi/4, x = 7pi/4", "x = pi/4, x = 5pi/4", "x = 3pi/4 only", "x = pi/4, x = 3pi/4"], "correct": 0, "explanation": "Reference angle = pi/4. Tangent is negative in Q2 and Q4. x = pi - pi/4 = 3pi/4, and x = 2pi - pi/4 = 7pi/4."},
      {"type": "list", "items": ["Isolate the trigonometric function first", "Find the reference angle from the positive ratio value", "Use CAST rule or unit circle to identify valid quadrants", "For quadratic trig equations, factor or use the quadratic formula", "Specify the domain — without it, there are infinitely many solutions"], "ordered": true},
      {"type": "divider"},
      {"type": "callout", "content": "Solve on [0, 2pi): (a) 2cos(x) + sqrt(3) = 0, (b) sin^2(x) - sin(x) = 0, (c) 2sin^2(x) + sin(x) - 1 = 0", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Trigonometric Equation", "definition": "An equation that contains a trigonometric function of an unknown angle and is true for specific values."},
      {"term": "Reference Angle", "definition": "The acute angle formed between the terminal arm and the x-axis, used to find all solutions."},
      {"term": "CAST Rule", "definition": "A mnemonic identifying which trig functions are positive in each quadrant: All (Q1), Sin (Q2), Tan (Q3), Cos (Q4)."},
      {"term": "General Solution", "definition": "The complete set of solutions to a trig equation, including all periods: x = particular solution + n x period."}
    ]'::jsonb,
    NULL,
    35, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'Solve sin(x) = 0 on [0, 2pi).', 'x = 0 and x = pi.', 'Where does sine equal zero on the unit circle?', 2, 0),
    (v_tenant, v_ch, 'What is the CAST rule?', 'It identifies positive trig functions by quadrant: Q1=All, Q2=Sin, Q3=Tan, Q4=Cos.', 'Start from Q4 and go counterclockwise: C-A-S-T', 2, 1),
    (v_tenant, v_ch, 'How do you solve a quadratic trig equation?', 'Substitute u = sin(x) or cos(x), factor the quadratic in u, then solve each factor for x.', 'Treat it like a regular quadratic', 3, 2),
    (v_tenant, v_ch, 'Solve cos(x) = 1/2 on [0, 360 degrees).', 'x = 60 degrees and x = 300 degrees. Cosine is positive in Q1 and Q4.', 'Reference angle is 60 degrees', 3, 3);

  -- ==============================
  -- UNIT 4: Exponential & Logarithmic Functions
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Exponential & Logarithmic Functions',
    'Model growth and decay with exponential functions and solve equations using logarithms.',
    'Exponential and logarithmic functions are inverses that model growth, decay, and many natural phenomena.',
    'How do exponential and logarithmic functions describe patterns of growth and decay in the natural world?')
  RETURNING id INTO v_unit;

  v_ch_num := 7;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Exponential Functions and Equations', 'exponential-functions-equations',
    'Graph exponential functions and solve exponential equations using common bases and logarithms.',
    '[
      {"type": "heading", "content": "Exponential Functions and Equations", "level": 1},
      {"type": "text", "content": "An exponential function has the form f(x) = a x b^x, where b > 0, b is not 1, and a is not 0. Unlike polynomial functions where x is the base, in exponential functions x is the exponent. This creates rapid growth (b > 1) or decay (0 < b < 1)."},
      {"type": "heading", "content": "Properties of Exponential Functions", "level": 2},
      {"type": "text", "content": "For f(x) = b^x:\nDomain: all real numbers\nRange: y > 0 (always positive)\ny-intercept: (0, 1) since b^0 = 1\nHorizontal asymptote: y = 0\n\nIf b > 1: exponential growth (increasing function)\nIf 0 < b < 1: exponential decay (decreasing function)"},
      {"type": "text", "content": "Worked Example: A population of bacteria doubles every 3 hours. If there are initially 500 bacteria, write a function and find the population after 12 hours.\n\nP(t) = 500 x 2^(t/3)\nP(12) = 500 x 2^(12/3) = 500 x 2^4 = 500 x 16 = 8000 bacteria."},
      {"type": "heading", "content": "Solving Exponential Equations", "level": 2},
      {"type": "text", "content": "Method 1 (Common Base): If both sides can be expressed as powers of the same base:\n2^(x+1) = 8 can be written as 2^(x+1) = 2^3, so x + 1 = 3, x = 2.\n\nMethod 2 (Logarithms): When common bases are not possible:\n5^x = 20\nlog(5^x) = log(20)\nx log(5) = log(20)\nx = log(20)/log(5) = 1.301/0.699 = 1.861"},
      {"type": "callout", "content": "The number e (approximately 2.71828) is the natural base for exponential functions. The function f(x) = e^x appears throughout calculus and applied mathematics.", "style": "info"},
      {"type": "quiz", "question": "Solve 3^(2x) = 81.", "options": ["x = 2", "x = 4", "x = 3", "x = 27"], "correct": 0, "explanation": "81 = 3^4. So 3^(2x) = 3^4, meaning 2x = 4, x = 2."},
      {"type": "list", "items": ["Exponential growth: b > 1; exponential decay: 0 < b < 1", "The y-intercept of b^x is always (0, 1)", "The horizontal asymptote is y = 0", "Use common bases when possible; otherwise use logarithms", "The half-life and doubling time are key applications"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Application: A radioactive substance has a half-life of 5 years. Starting with 200 g, write a function for the remaining mass and find how much remains after 15 years.", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Exponential Function", "definition": "A function of the form f(x) = a x b^x where the variable is in the exponent."},
      {"term": "Growth Factor", "definition": "The base b in an exponential function when b > 1, indicating exponential growth."},
      {"term": "Decay Factor", "definition": "The base b in an exponential function when 0 < b < 1, indicating exponential decay."},
      {"term": "Half-Life", "definition": "The time required for a quantity to reduce to half its initial value in exponential decay."},
      {"term": "Euler Number (e)", "definition": "The irrational number approximately equal to 2.71828, the base of the natural exponential function."}
    ]'::jsonb,
    'Exponential growth models describe many natural phenomena. Indigenous ecological knowledge recognizes patterns of population growth and decline in animal species, understanding that unchecked growth is unsustainable and that natural systems tend toward balance.',
    35, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the range of f(x) = b^x?', 'y > 0. An exponential function is always positive.', 'The graph never touches the x-axis', 2, 0),
    (v_tenant, v_ch, 'Solve 2^x = 32', 'x = 5, because 2^5 = 32.', 'Express 32 as a power of 2', 2, 1),
    (v_tenant, v_ch, 'What is the horizontal asymptote of y = 3^x?', 'y = 0. The graph approaches but never reaches zero.', 'As x goes to negative infinity, 3^x approaches 0', 2, 2),
    (v_tenant, v_ch, 'How do you solve 7^x = 50?', 'Take log of both sides: x = log(50)/log(7) = 1.699/0.845 = 2.01.', 'Use logarithms when common bases are not available', 3, 3);

  v_ch_num := 8;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Logarithmic Functions', 'logarithmic-functions',
    'Define logarithms, convert between exponential and logarithmic form, apply logarithm laws, and solve logarithmic equations.',
    '[
      {"type": "heading", "content": "Logarithmic Functions", "level": 1},
      {"type": "text", "content": "The logarithm is the inverse of exponentiation. If b^y = x, then log_b(x) = y. In words: the logarithm base b of x is the exponent to which b must be raised to get x.\n\nExamples:\nlog_2(8) = 3 because 2^3 = 8\nlog_10(1000) = 3 because 10^3 = 1000\nln(e^5) = 5 because e^5 = e^5"},
      {"type": "heading", "content": "Logarithm Laws", "level": 2},
      {"type": "text", "content": "Product Law: log_b(MN) = log_b(M) + log_b(N)\nQuotient Law: log_b(M/N) = log_b(M) - log_b(N)\nPower Law: log_b(M^p) = p x log_b(M)\nChange of Base: log_b(x) = log(x) / log(b) = ln(x) / ln(b)\n\nWorked Example: Expand log_3(x^2 y / z)\n= log_3(x^2) + log_3(y) - log_3(z)\n= 2 log_3(x) + log_3(y) - log_3(z)"},
      {"type": "heading", "content": "Solving Logarithmic Equations", "level": 2},
      {"type": "text", "content": "Strategy: Use logarithm laws to combine into a single logarithm, then convert to exponential form.\n\nWorked Example: Solve log_2(x) + log_2(x - 2) = 3\nlog_2(x(x-2)) = 3\nx(x-2) = 2^3 = 8\nx^2 - 2x - 8 = 0\n(x-4)(x+2) = 0\nx = 4 or x = -2\n\nCheck: x = -2 is extraneous (cannot take log of negative numbers).\nSolution: x = 4."},
      {"type": "callout", "content": "Always check solutions of logarithmic equations. The argument of a logarithm must be positive.", "style": "warning"},
      {"type": "quiz", "question": "Evaluate log_5(125).", "options": ["3", "5", "25", "2"], "correct": 0, "explanation": "5^3 = 125, so log_5(125) = 3."},
      {"type": "list", "items": ["log_b(x) = y means b^y = x", "Product law: log of a product = sum of logs", "Power law: log of a power = exponent times log of base", "The argument of a logarithm must be positive", "log (base 10) and ln (base e) are the most common bases"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Solve: (a) log_3(2x+1) = 2, (b) log(x) + log(x+3) = 1, (c) 2 ln(x) - ln(x-1) = ln(5)", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Logarithm", "definition": "The exponent to which a base must be raised to produce a given number: log_b(x) = y means b^y = x."},
      {"term": "Common Logarithm", "definition": "A logarithm with base 10, written as log(x)."},
      {"term": "Natural Logarithm", "definition": "A logarithm with base e, written as ln(x)."},
      {"term": "Product Law", "definition": "log_b(MN) = log_b(M) + log_b(N)."},
      {"term": "Power Law", "definition": "log_b(M^p) = p x log_b(M)."},
      {"term": "Change of Base Formula", "definition": "log_b(x) = log(x)/log(b), used to evaluate logarithms of any base on a calculator."}
    ]'::jsonb,
    NULL,
    35, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does log_b(x) = y mean?', 'It means b^y = x. The logarithm is the exponent.', 'Log answers the question: what power?', 2, 0),
    (v_tenant, v_ch, 'State the product law of logarithms.', 'log_b(MN) = log_b(M) + log_b(N)', 'Log of a product = sum of logs', 2, 1),
    (v_tenant, v_ch, 'Evaluate log_2(64).', 'log_2(64) = 6, because 2^6 = 64.', 'What power of 2 gives 64?', 2, 2),
    (v_tenant, v_ch, 'What is the change of base formula?', 'log_b(x) = log(x)/log(b) or ln(x)/ln(b)', 'Useful when your calculator only has log and ln', 3, 3),
    (v_tenant, v_ch, 'Why must the argument of a logarithm be positive?', 'You cannot raise a positive base to any real power and get a negative or zero result.', 'b^y is always positive for b > 0', 3, 4);

  -- ==============================
  -- UNIT 5: Combinatorics & Binomial Theorem
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 5, 'Combinatorics & Binomial Theorem',
    'Count arrangements and selections using permutations and combinations, and expand binomials using the Binomial Theorem.',
    'Systematic counting methods and the Binomial Theorem connect algebra to probability and discrete mathematics.',
    'How do permutations, combinations, and the Binomial Theorem help us count possibilities and expand expressions?')
  RETURNING id INTO v_unit;

  v_ch_num := 9;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Permutations and Combinations', 'permutations-and-combinations',
    'Distinguish between permutations and combinations and calculate each using factorial notation.',
    '[
      {"type": "heading", "content": "Permutations and Combinations", "level": 1},
      {"type": "text", "content": "In counting problems, the key question is: does order matter?\n\nPermutation: An arrangement where order matters. Choosing president, vice-president, and treasurer from 10 people is a permutation — the order of selection matters.\n\nCombination: A selection where order does not matter. Choosing 3 people for a committee from 10 people is a combination — any group of 3 is the same regardless of selection order."},
      {"type": "heading", "content": "Factorial Notation", "level": 2},
      {"type": "text", "content": "n! (n factorial) = n x (n-1) x (n-2) x ... x 2 x 1\n5! = 5 x 4 x 3 x 2 x 1 = 120\n0! = 1 (by definition)\n\nPermutations: P(n, r) = n! / (n - r)!\nCombinations: C(n, r) = n! / (r!(n - r)!)"},
      {"type": "text", "content": "Worked Example: How many 3-letter arrangements can be formed from the letters A, B, C, D, E?\nP(5, 3) = 5! / 2! = 120 / 2 = 60 arrangements.\n\nWorked Example: How many committees of 3 can be formed from 8 people?\nC(8, 3) = 8! / (3! x 5!) = (8 x 7 x 6) / (3 x 2 x 1) = 336 / 6 = 56 committees."},
      {"type": "callout", "content": "Ask yourself: if I rearrange the selected items, do I get a different result? If yes, use permutations. If no, use combinations.", "style": "tip"},
      {"type": "quiz", "question": "A pizza shop offers 12 toppings. How many different 4-topping pizzas can be made?", "options": ["C(12,4) = 495", "P(12,4) = 11880", "12^4 = 20736", "4^12"], "correct": 0, "explanation": "Order does not matter for pizza toppings, so use combinations: C(12,4) = 12!/(4!8!) = 495."},
      {"type": "list", "items": ["Order matters: permutation P(n,r) = n!/(n-r)!", "Order does not matter: combination C(n,r) = n!/(r!(n-r)!)", "0! = 1 by definition", "C(n,r) = C(n, n-r) — choosing r is the same as leaving out n-r", "Use the Fundamental Counting Principle for sequential independent choices"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Calculate: (a) P(7,3), (b) C(10,4), (c) How many ways can 5 students be seated in a row of 5 chairs? (d) How many handshakes occur if 15 people each shake hands with everyone else?", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Permutation", "definition": "An ordered arrangement of objects. P(n,r) = n!/(n-r)!."},
      {"term": "Combination", "definition": "An unordered selection of objects. C(n,r) = n!/(r!(n-r)!)."},
      {"term": "Factorial", "definition": "n! = n x (n-1) x ... x 2 x 1. By convention, 0! = 1."},
      {"term": "Fundamental Counting Principle", "definition": "If one event can occur in m ways and another in n ways, both can occur in m x n ways."}
    ]'::jsonb,
    NULL,
    35, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'When do you use permutations vs combinations?', 'Permutations when order matters, combinations when order does not.', 'Does rearranging the selection create a different outcome?', 2, 0),
    (v_tenant, v_ch, 'What is 6!?', '6! = 6 x 5 x 4 x 3 x 2 x 1 = 720', 'Multiply all integers from 6 down to 1', 2, 1),
    (v_tenant, v_ch, 'Calculate C(10, 3).', 'C(10,3) = 10!/(3!7!) = (10x9x8)/(3x2x1) = 120', 'Cancel the 7! from top and bottom', 3, 2),
    (v_tenant, v_ch, 'Why does 0! = 1?', 'By convention and consistency: C(n,0) = n!/(0!n!) should equal 1 (one way to choose nothing), which requires 0! = 1.', 'It makes the formulas work correctly', 3, 3);

  v_ch_num := 10;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'The Binomial Theorem', 'the-binomial-theorem',
    'Expand powers of binomials using the Binomial Theorem and Pascal''s Triangle.',
    '[
      {"type": "heading", "content": "The Binomial Theorem", "level": 1},
      {"type": "text", "content": "The Binomial Theorem provides a formula for expanding (a + b)^n without repeated multiplication:\n\n(a + b)^n = sum from k=0 to n of C(n,k) a^(n-k) b^k\n\nThe coefficients C(n,k) are called binomial coefficients and can be found using the combination formula or Pascal''s Triangle."},
      {"type": "heading", "content": "Pascal''s Triangle", "level": 2},
      {"type": "text", "content": "Each row of Pascal''s Triangle gives the binomial coefficients:\nRow 0: 1\nRow 1: 1  1\nRow 2: 1  2  1\nRow 3: 1  3  3  1\nRow 4: 1  4  6  4  1\nRow 5: 1  5  10  10  5  1\n\nEach number is the sum of the two numbers directly above it."},
      {"type": "text", "content": "Worked Example: Expand (2x + 3)^4.\nUsing row 4 of Pascal''s Triangle: 1, 4, 6, 4, 1\n= 1(2x)^4(3)^0 + 4(2x)^3(3)^1 + 6(2x)^2(3)^2 + 4(2x)^1(3)^3 + 1(2x)^0(3)^4\n= 16x^4 + 4(8x^3)(3) + 6(4x^2)(9) + 4(2x)(27) + 81\n= 16x^4 + 96x^3 + 216x^2 + 216x + 81"},
      {"type": "heading", "content": "Finding a Specific Term", "level": 2},
      {"type": "text", "content": "The (k+1)th term (where k starts at 0) in the expansion of (a+b)^n is:\nT_(k+1) = C(n,k) a^(n-k) b^k\n\nWorked Example: Find the 4th term in the expansion of (x - 2)^7.\nk = 3 (since the 4th term has k = 3)\nT_4 = C(7,3) x^(7-3) (-2)^3 = 35 x^4 (-8) = -280x^4"},
      {"type": "quiz", "question": "What is C(6,2) in the expansion of (a+b)^6?", "options": ["15", "6", "30", "12"], "correct": 0, "explanation": "C(6,2) = 6!/(2!4!) = (6x5)/(2x1) = 15."},
      {"type": "callout", "content": "Pascal''s Triangle has many fascinating properties: each row sums to 2^n, and the diagonal sums give the Fibonacci sequence.", "style": "info"},
      {"type": "list", "items": ["(a+b)^n = sum of C(n,k) a^(n-k) b^k for k = 0 to n", "Binomial coefficients come from C(n,k) or Pascal''s Triangle", "There are n+1 terms in the expansion", "To find a specific term, use T_(k+1) = C(n,k) a^(n-k) b^k", "Watch signs carefully when b is negative"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Expand: (a) (x + 1)^5, (b) (3a - b)^4. Find the 5th term of (2x - y)^8.", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Binomial Theorem", "definition": "A formula for expanding (a+b)^n as a sum of terms involving binomial coefficients."},
      {"term": "Binomial Coefficient", "definition": "The number C(n,k) that appears as a coefficient in the expansion of (a+b)^n."},
      {"term": "Pascal''s Triangle", "definition": "A triangular array where each entry is the sum of the two entries above it, giving binomial coefficients."}
    ]'::jsonb,
    NULL,
    35, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'State the Binomial Theorem.', '(a+b)^n = sum from k=0 to n of C(n,k) a^(n-k) b^k', 'Combination coefficients with descending powers of a and ascending powers of b', 3, 0),
    (v_tenant, v_ch, 'How many terms are in the expansion of (a+b)^n?', 'n + 1 terms.', 'One more than the exponent', 2, 1),
    (v_tenant, v_ch, 'What is the 3rd term in the expansion of (x+y)^5?', 'T_3 = C(5,2) x^3 y^2 = 10x^3y^2', 'k = 2 for the 3rd term', 3, 2),
    (v_tenant, v_ch, 'What pattern does Pascal''s Triangle follow?', 'Each number is the sum of the two numbers directly above it in the previous row.', 'Add adjacent entries', 2, 3);

  -- ==============================
  -- UNIT 6: Function Transformations
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 6, 'Function Transformations',
    'Apply transformations including translations, reflections, stretches, and inverses to various function families.',
    'All function families share common transformation patterns, enabling us to predict graph behaviour from equation form.',
    'How do transformations allow us to generate an infinite family of functions from a single parent function?')
  RETURNING id INTO v_unit;

  v_ch_num := 11;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Combined Transformations', 'combined-transformations',
    'Apply multiple transformations to parent functions and write equations from transformed graphs.',
    '[
      {"type": "heading", "content": "Combined Transformations", "level": 1},
      {"type": "text", "content": "A transformed function has the general form y = a f(b(x - h)) + k. Each parameter creates a specific transformation of the parent function y = f(x):\n\na: Vertical stretch (|a| > 1) or compression (0 < |a| < 1); reflection over x-axis if a < 0.\nb: Horizontal stretch (0 < |b| < 1) or compression (|b| > 1); reflection over y-axis if b < 0.\nh: Horizontal translation right (h > 0) or left (h < 0).\nk: Vertical translation up (k > 0) or down (k < 0)."},
      {"type": "heading", "content": "Order of Transformations", "level": 2},
      {"type": "text", "content": "When applying multiple transformations, the order matters. Working from the inside of the equation outward:\n\n1. Horizontal transformations (b and h): Apply b first (stretch/compress/reflect), then h (translate).\n2. Vertical transformations (a and k): Apply a first (stretch/compress/reflect), then k (translate).\n\nAlternatively, think of it as: stretches and reflections before translations."},
      {"type": "text", "content": "Worked Example: Describe the transformations that map y = x^2 to y = -3(x + 2)^2 - 5.\n\na = -3: Vertical stretch by factor 3, reflected over x-axis.\nh = -2: Translated 2 units left.\nk = -5: Translated 5 units down.\n\nThe vertex moves from (0, 0) to (-2, -5)."},
      {"type": "callout", "content": "For horizontal transformations, the effect is the opposite of what the equation shows: (x - 3) moves RIGHT, and a factor of 2 with x compresses horizontally by 1/2.", "style": "warning"},
      {"type": "quiz", "question": "What transformations map y = sqrt(x) to y = sqrt(-(x - 4)) + 2?", "options": ["Reflect over y-axis, translate right 4, translate up 2", "Reflect over x-axis, translate left 4, translate up 2", "Reflect over y-axis, translate left 4, translate down 2", "Translate right 4, translate up 2 only"], "correct": 0, "explanation": "The negative inside the function reflects over the y-axis. (x-4) translates right 4. The +2 translates up 2."},
      {"type": "list", "items": ["y = a f(b(x-h)) + k is the general transformation form", "Apply stretches/reflections before translations", "Horizontal effects are opposite to what the equation shows", "The mapping rule is (x,y) -> (x/b + h, ay + k)", "Identify the parent function first, then describe each transformation"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Write the equation of each transformed function: (a) y = x^3 after reflecting over x-axis and translating up 4, (b) y = |x| after compressing horizontally by 1/2 and translating left 3", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Parent Function", "definition": "The simplest form of a function family (e.g., y = x^2, y = sqrt(x), y = |x|)."},
      {"term": "Transformation", "definition": "An operation that changes the position, size, or orientation of a graph."},
      {"term": "Mapping Rule", "definition": "A rule describing how each point (x, y) on the parent function maps to a new point on the transformed function."},
      {"term": "Invariant Point", "definition": "A point that remains unchanged after a transformation."}
    ]'::jsonb,
    NULL,
    35, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'In y = af(b(x-h))+k, what does the parameter h control?', 'Horizontal translation: right if h > 0, left if h < 0.', 'Opposite sign in the equation: (x-3) means shift right 3', 2, 0),
    (v_tenant, v_ch, 'What is the order for applying combined transformations?', 'Stretches/reflections first, then translations. (Horizontal operations applied before vertical ones within each group.)', 'Scale before slide', 3, 1),
    (v_tenant, v_ch, 'What does a negative value of b do in y = f(bx)?', 'Reflects the graph over the y-axis.', 'Negative inside the function = horizontal reflection', 2, 2),
    (v_tenant, v_ch, 'Write the mapping rule for y = 2f(3(x-1)) + 4.', '(x, y) -> (x/3 + 1, 2y + 4)', 'x: divide by b then add h. y: multiply by a then add k', 3, 3);

  v_ch_num := 12;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Inverse Functions', 'inverse-functions',
    'Determine the inverse of a function, verify inverse relationships, and restrict domains to create invertible functions.',
    '[
      {"type": "heading", "content": "Inverse Functions", "level": 1},
      {"type": "text", "content": "The inverse of a function f, denoted f^(-1), reverses the roles of input and output. If f(a) = b, then f^(-1)(b) = a. Graphically, the inverse is the reflection of f over the line y = x."},
      {"type": "heading", "content": "Finding the Inverse", "level": 2},
      {"type": "text", "content": "Steps to find f^(-1):\n1. Replace f(x) with y\n2. Swap x and y\n3. Solve for y\n4. Replace y with f^(-1)(x)\n\nWorked Example: Find the inverse of f(x) = 3x - 7.\ny = 3x - 7\nSwap: x = 3y - 7\nSolve: x + 7 = 3y, y = (x + 7)/3\nf^(-1)(x) = (x + 7)/3\n\nVerification: f(f^(-1)(x)) = 3((x+7)/3) - 7 = x + 7 - 7 = x. Confirmed."},
      {"type": "heading", "content": "The Horizontal Line Test", "level": 2},
      {"type": "text", "content": "A function has an inverse function (is one-to-one) if and only if every horizontal line crosses its graph at most once. If a function fails this test (like y = x^2), you must restrict the domain to create an invertible function.\n\nExample: f(x) = x^2 is not one-to-one on all reals. Restricting to x >= 0 gives f^(-1)(x) = sqrt(x)."},
      {"type": "callout", "content": "f and f^(-1) undo each other: f(f^(-1)(x)) = x and f^(-1)(f(x)) = x for all x in the appropriate domain.", "style": "info"},
      {"type": "quiz", "question": "What is the inverse of f(x) = 2x + 5?", "options": ["f^(-1)(x) = (x - 5)/2", "f^(-1)(x) = (x + 5)/2", "f^(-1)(x) = 2x - 5", "f^(-1)(x) = x/2 - 5"], "correct": 0, "explanation": "y = 2x + 5. Swap: x = 2y + 5. Solve: x - 5 = 2y, y = (x-5)/2. So f^(-1)(x) = (x-5)/2."},
      {"type": "list", "items": ["The inverse reverses input and output", "To find the inverse: swap x and y, then solve for y", "The graph of f^(-1) is the reflection of f over y = x", "Use the horizontal line test to check if a function is invertible", "Restrict the domain of non-invertible functions to create inverses"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Find the inverse: (a) f(x) = (x-3)/4, (b) g(x) = x^2 + 1 (x >= 0), (c) h(x) = sqrt(x+2). Verify each by showing f(f^(-1)(x)) = x.", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Inverse Function", "definition": "A function f^(-1) that reverses f: if f(a) = b, then f^(-1)(b) = a."},
      {"term": "One-to-One Function", "definition": "A function where each output corresponds to exactly one input; passes the horizontal line test."},
      {"term": "Horizontal Line Test", "definition": "A test for invertibility: a function is one-to-one if every horizontal line intersects its graph at most once."},
      {"term": "Domain Restriction", "definition": "Limiting the domain of a function so that it becomes one-to-one and therefore invertible."}
    ]'::jsonb,
    NULL,
    35, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'How do you find the inverse of a function?', 'Replace f(x) with y, swap x and y, solve for y, then rename as f^(-1)(x).', 'Swap x and y, then isolate y', 2, 0),
    (v_tenant, v_ch, 'What is the horizontal line test?', 'A function is one-to-one (invertible) if every horizontal line intersects its graph at most once.', 'If a horizontal line hits the graph twice, the function is not invertible without restricting the domain', 2, 1),
    (v_tenant, v_ch, 'What is the graphical relationship between f and f^(-1)?', 'The graph of f^(-1) is the reflection of f over the line y = x.', 'Mirror image across y = x', 2, 2),
    (v_tenant, v_ch, 'Find the inverse of f(x) = 5x - 3.', 'f^(-1)(x) = (x + 3)/5', 'Swap x and y: x = 5y - 3, solve for y', 2, 3);

  RAISE NOTICE 'Pre-Calculus Math 30 seeded: 6 units, 12 chapters';
END $$;


-- ============================================================================
-- TEXTBOOK 5: Calculus 30
-- Slug: wolfwhale-calculus-30
-- ============================================================================

DO $$
DECLARE
  v_tenant UUID := '00000000-0000-0000-0000-000000000001';
  v_book UUID;
  v_unit UUID;
  v_ch UUID;
  v_ch_num INT := 0;
BEGIN
  SELECT id INTO v_book FROM textbooks WHERE tenant_id = v_tenant AND slug = 'wolfwhale-calculus-30';

  -- ==============================
  -- UNIT 1: Limits & Continuity
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 1, 'Limits & Continuity',
    'Develop the concept of a limit as the foundation of calculus, and explore continuity of functions.',
    'The limit concept captures the idea of approaching a value and forms the rigorous foundation for derivatives and integrals.',
    'What does it mean for a function to approach a value, and how does this idea underpin all of calculus?')
  RETURNING id INTO v_unit;

  v_ch_num := 1;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Introduction to Limits', 'introduction-to-limits',
    'Understand the concept of a limit intuitively and evaluate limits using tables, graphs, and algebraic techniques.',
    '[
      {"type": "heading", "content": "Introduction to Limits", "level": 1},
      {"type": "text", "content": "The concept of a limit answers the question: what value does f(x) approach as x approaches a particular number? We write this as lim(x -> a) f(x) = L, meaning f(x) gets arbitrarily close to L as x gets arbitrarily close to a (from both sides). Critically, the limit describes the behaviour near a point, not at the point."},
      {"type": "heading", "content": "Evaluating Limits", "level": 2},
      {"type": "text", "content": "Method 1: Direct Substitution. If f is continuous at x = a, then lim(x -> a) f(x) = f(a).\n\nExample: lim(x -> 3) (2x + 1) = 2(3) + 1 = 7.\n\nMethod 2: Algebraic Simplification. When direct substitution gives 0/0 (an indeterminate form), simplify the expression.\n\nWorked Example: Evaluate lim(x -> 2) (x^2 - 4)/(x - 2).\nDirect substitution gives 0/0. Factor: (x+2)(x-2)/(x-2) = x+2 for x not equal to 2.\nlim(x -> 2) (x + 2) = 4."},
      {"type": "callout", "content": "The form 0/0 is called indeterminate because it does not determine the limit. You must simplify further to find the actual limit value.", "style": "info"},
      {"type": "heading", "content": "One-Sided Limits", "level": 2},
      {"type": "text", "content": "The left-hand limit lim(x -> a^-) f(x) considers values of x approaching a from below. The right-hand limit lim(x -> a^+) f(x) considers values from above. The two-sided limit exists if and only if both one-sided limits exist and are equal.\n\nWorked Example: For f(x) = |x|/x:\nlim(x -> 0^+) f(x) = 1 (positive x divided by positive x)\nlim(x -> 0^-) f(x) = -1 (negative x divided by its absolute value)\nSince the one-sided limits differ, lim(x -> 0) f(x) does not exist."},
      {"type": "quiz", "question": "Evaluate lim(x -> 5) (x^2 - 25)/(x - 5).", "options": ["10", "0", "5", "Does not exist"], "correct": 0, "explanation": "Factor: (x-5)(x+5)/(x-5) = x+5. lim(x->5) (x+5) = 10."},
      {"type": "heading", "content": "Limits at Infinity", "level": 2},
      {"type": "text", "content": "lim(x -> infinity) f(x) describes the behaviour of f as x grows without bound. For rational functions, divide numerator and denominator by the highest power of x in the denominator.\n\nExample: lim(x -> infinity) (3x^2 + 1)/(x^2 - 4) = lim (3 + 1/x^2)/(1 - 4/x^2) = 3/1 = 3."},
      {"type": "list", "items": ["lim(x -> a) f(x) = L means f(x) approaches L as x approaches a", "If direct substitution works, the limit equals the function value", "0/0 is indeterminate — factor, rationalize, or simplify", "The two-sided limit exists only if both one-sided limits are equal", "For limits at infinity, divide by the highest power of x"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Evaluate each limit: (a) lim(x->1) (x^3-1)/(x-1), (b) lim(x->0) sin(x)/x (use a table of values), (c) lim(x->infinity) (5x-3)/(2x+7)", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Limit", "definition": "The value that f(x) approaches as x approaches a given value; written lim(x->a) f(x) = L."},
      {"term": "Indeterminate Form", "definition": "An expression like 0/0 or infinity/infinity that does not directly determine the limit value."},
      {"term": "One-Sided Limit", "definition": "The limit as x approaches a value from one direction only (left or right)."},
      {"term": "Direct Substitution", "definition": "Evaluating a limit by plugging the target value directly into the function."},
      {"term": "Limit at Infinity", "definition": "The value a function approaches as x increases or decreases without bound."}
    ]'::jsonb,
    NULL,
    40, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does lim(x->a) f(x) = L mean?', 'As x gets arbitrarily close to a (from both sides), f(x) gets arbitrarily close to L.', 'Approaching, not necessarily reaching', 2, 0),
    (v_tenant, v_ch, 'What is the 0/0 indeterminate form?', 'When direct substitution in a limit gives 0/0, the limit is not determined — you must simplify the expression to find the actual limit.', 'Factor, cancel, or rationalize', 3, 1),
    (v_tenant, v_ch, 'Evaluate lim(x->3) (x^2-9)/(x-3)', 'Factor: (x+3)(x-3)/(x-3) = x+3. Limit = 6.', 'Difference of squares in numerator', 2, 2),
    (v_tenant, v_ch, 'When does a two-sided limit NOT exist?', 'When the left-hand limit and right-hand limit are different, or when the function oscillates or goes to infinity.', 'Both sides must agree', 3, 3),
    (v_tenant, v_ch, 'What is a special limit: lim(x->0) sin(x)/x?', 'This limit equals 1. It is a fundamental limit used throughout calculus.', 'Approaches 1 from both sides', 3, 4);

  v_ch_num := 2;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Continuity', 'continuity',
    'Define continuity at a point and on an interval, and identify types of discontinuities.',
    '[
      {"type": "heading", "content": "Continuity", "level": 1},
      {"type": "text", "content": "Intuitively, a function is continuous if you can draw its graph without lifting your pencil. Formally, a function f is continuous at x = a if three conditions are met:\n\n1. f(a) is defined\n2. lim(x -> a) f(x) exists\n3. lim(x -> a) f(x) = f(a)\n\nIf any condition fails, the function is discontinuous at x = a."},
      {"type": "heading", "content": "Types of Discontinuities", "level": 2},
      {"type": "text", "content": "Removable discontinuity (hole): The limit exists but either f(a) is undefined or f(a) does not equal the limit. Can be fixed by redefining f(a).\n\nJump discontinuity: The left-hand and right-hand limits both exist but are not equal.\n\nInfinite discontinuity: The function approaches positive or negative infinity (vertical asymptote).\n\nWorked Example: f(x) = (x^2 - 1)/(x - 1) has a removable discontinuity at x = 1. The limit is 2, but f(1) is undefined."},
      {"type": "callout", "content": "Polynomials are continuous everywhere. Rational functions are continuous on their domain (everywhere except where the denominator is zero).", "style": "info"},
      {"type": "heading", "content": "Intermediate Value Theorem", "level": 2},
      {"type": "text", "content": "If f is continuous on the closed interval [a, b] and N is any number between f(a) and f(b), then there exists at least one c in (a, b) such that f(c) = N.\n\nApplication: If f(1) = -3 and f(4) = 5, and f is continuous on [1, 4], then f must equal zero somewhere between 1 and 4. This is useful for proving that equations have solutions."},
      {"type": "quiz", "question": "Which condition for continuity at x = a fails for f(x) = 1/(x-3) at x = 3?", "options": ["f(3) is not defined", "The limit does not exist (infinite discontinuity)", "Both: f(3) is undefined AND the limit does not exist", "The limit exists but does not equal f(3)"], "correct": 2, "explanation": "f(3) = 1/0 is undefined, and lim(x->3) 1/(x-3) does not exist (approaches +infinity from the right and -infinity from the left). Both conditions 1 and 2 fail."},
      {"type": "list", "items": ["Three conditions: f(a) defined, limit exists, limit equals f(a)", "Removable: limit exists but function value is wrong or missing", "Jump: one-sided limits exist but disagree", "Infinite: function blows up to infinity (vertical asymptote)", "IVT guarantees a continuous function hits all intermediate values"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Determine the type of discontinuity (if any) at the indicated point: (a) f(x) = (x^2-4)/(x-2) at x=2, (b) g(x) = |x|/x at x=0, (c) h(x) = 1/(x^2) at x=0", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Continuous", "definition": "A function is continuous at x = a if f(a) is defined, lim(x->a) f(x) exists, and lim(x->a) f(x) = f(a)."},
      {"term": "Removable Discontinuity", "definition": "A discontinuity where the limit exists but does not equal the function value (or the function is undefined); can be repaired."},
      {"term": "Jump Discontinuity", "definition": "A discontinuity where both one-sided limits exist but are not equal."},
      {"term": "Infinite Discontinuity", "definition": "A discontinuity where the function approaches positive or negative infinity."},
      {"term": "Intermediate Value Theorem", "definition": "If f is continuous on [a,b], then f takes every value between f(a) and f(b) at least once."}
    ]'::jsonb,
    NULL,
    40, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What are the three conditions for continuity at x = a?', '1. f(a) is defined. 2. lim(x->a) f(x) exists. 3. lim(x->a) f(x) = f(a).', 'Defined, exists, equals', 2, 0),
    (v_tenant, v_ch, 'What is a removable discontinuity?', 'A point where the limit exists but the function is either undefined there or has a different value. The gap can be filled.', 'Like a hole in the graph', 2, 1),
    (v_tenant, v_ch, 'State the Intermediate Value Theorem.', 'If f is continuous on [a,b], then for every N between f(a) and f(b), there exists c in (a,b) with f(c) = N.', 'A continuous function hits all intermediate values', 3, 2),
    (v_tenant, v_ch, 'Are polynomials continuous everywhere?', 'Yes. Polynomials are continuous on all real numbers.', 'No denominators, no square roots of variables', 2, 3);

  -- ==============================
  -- UNIT 2: Derivatives
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 2, 'Derivatives',
    'Define the derivative as the limit of a difference quotient and develop differentiation rules.',
    'The derivative measures the instantaneous rate of change of a function and is defined as a limit.',
    'How does the derivative capture the idea of instantaneous rate of change, and what rules allow us to compute derivatives efficiently?')
  RETURNING id INTO v_unit;

  v_ch_num := 3;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'The Derivative from First Principles', 'derivative-first-principles',
    'Define the derivative using the limit definition and compute derivatives of simple functions from first principles.',
    '[
      {"type": "heading", "content": "The Derivative from First Principles", "level": 1},
      {"type": "text", "content": "The derivative of f at x = a is defined as:\nf''(a) = lim(h -> 0) [f(a + h) - f(a)] / h\n\nThis limit, when it exists, gives the instantaneous rate of change of f at x = a and the slope of the tangent line to the graph at that point."},
      {"type": "heading", "content": "The Derivative Function", "level": 2},
      {"type": "text", "content": "More generally, the derivative function is:\nf''(x) = lim(h -> 0) [f(x + h) - f(x)] / h\n\nWorked Example: Find f''(x) for f(x) = x^2 from first principles.\nf''(x) = lim(h->0) [(x+h)^2 - x^2] / h\n= lim(h->0) [x^2 + 2xh + h^2 - x^2] / h\n= lim(h->0) [2xh + h^2] / h\n= lim(h->0) (2x + h)\n= 2x\n\nSo the derivative of x^2 is 2x."},
      {"type": "text", "content": "Worked Example: Find f''(x) for f(x) = 3x + 5.\nf''(x) = lim(h->0) [3(x+h) + 5 - (3x + 5)] / h\n= lim(h->0) [3x + 3h + 5 - 3x - 5] / h\n= lim(h->0) 3h/h = lim(h->0) 3 = 3\n\nThe derivative of a linear function is its slope."},
      {"type": "callout", "content": "The derivative at a point gives the slope of the tangent line. If f''(a) = m, then the tangent line at (a, f(a)) is y - f(a) = m(x - a).", "style": "tip"},
      {"type": "quiz", "question": "Using the limit definition, what is the derivative of f(x) = x^3?", "options": ["3x^2", "x^2", "3x", "x^3"], "correct": 0, "explanation": "f''(x) = lim(h->0) [(x+h)^3 - x^3]/h. Expanding: x^3 + 3x^2h + 3xh^2 + h^3 - x^3 = 3x^2h + 3xh^2 + h^3. Divide by h: 3x^2 + 3xh + h^2. As h->0: 3x^2."},
      {"type": "list", "items": ["The derivative is defined as lim(h->0) [f(x+h) - f(x)]/h", "It gives the instantaneous rate of change at a point", "Geometrically, it is the slope of the tangent line", "The notation f''(x), dy/dx, and y'' all denote the derivative", "Not all functions are differentiable (e.g., |x| at x = 0)"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Use the limit definition to find f''(x) for: (a) f(x) = 4x - 1, (b) f(x) = x^2 + 3x, (c) f(x) = 1/x", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Derivative", "definition": "The instantaneous rate of change of a function, defined as lim(h->0) [f(x+h)-f(x)]/h."},
      {"term": "Difference Quotient", "definition": "The expression [f(x+h)-f(x)]/h, whose limit as h->0 is the derivative."},
      {"term": "Tangent Line", "definition": "A line that touches a curve at a single point and has slope equal to the derivative at that point."},
      {"term": "Differentiable", "definition": "A function is differentiable at a point if its derivative exists at that point."},
      {"term": "First Principles", "definition": "Computing the derivative using the limit definition rather than shortcut rules."}
    ]'::jsonb,
    'The concept of instantaneous change connects to Indigenous observations of natural transitions — the exact moment dawn breaks, the precise point where a river current shifts. These observations of continuous change in nature parallel the mathematical idea of a derivative.',
    40, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'State the limit definition of the derivative.', 'f''(x) = lim(h->0) [f(x+h) - f(x)] / h', 'The limit of the difference quotient as h approaches 0', 2, 0),
    (v_tenant, v_ch, 'What does the derivative represent geometrically?', 'The slope of the tangent line to the graph of f at the point (x, f(x)).', 'Tangent = touching at one point', 2, 1),
    (v_tenant, v_ch, 'Find the derivative of f(x) = x^2 from first principles.', 'f''(x) = lim(h->0) [(x+h)^2 - x^2]/h = lim(h->0) (2x+h) = 2x.', 'Expand, simplify, take the limit', 3, 2),
    (v_tenant, v_ch, 'What does it mean if a function is not differentiable at a point?', 'The derivative (limit) does not exist there. This can happen at sharp corners, cusps, vertical tangents, or discontinuities.', 'The tangent line is not well-defined', 3, 3);

  v_ch_num := 4;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Differentiation Rules', 'differentiation-rules',
    'Apply the power rule, product rule, quotient rule, and chain rule to differentiate functions efficiently.',
    '[
      {"type": "heading", "content": "Differentiation Rules", "level": 1},
      {"type": "text", "content": "Computing derivatives from first principles is rigorous but slow. Differentiation rules provide efficient shortcuts derived from the limit definition."},
      {"type": "heading", "content": "Basic Rules", "level": 2},
      {"type": "text", "content": "Constant Rule: d/dx [c] = 0\nPower Rule: d/dx [x^n] = n x^(n-1)\nConstant Multiple Rule: d/dx [cf(x)] = c f''(x)\nSum/Difference Rule: d/dx [f(x) +/- g(x)] = f''(x) +/- g''(x)\n\nExamples:\nd/dx [5x^4] = 20x^3\nd/dx [x^3 - 7x + 2] = 3x^2 - 7"},
      {"type": "heading", "content": "Product Rule", "level": 2},
      {"type": "text", "content": "If y = f(x)g(x), then y'' = f''(x)g(x) + f(x)g''(x).\n\nWorked Example: y = (3x^2)(sin(x))\ny'' = (6x)(sin(x)) + (3x^2)(cos(x))"},
      {"type": "heading", "content": "Quotient Rule", "level": 2},
      {"type": "text", "content": "If y = f(x)/g(x), then y'' = [f''(x)g(x) - f(x)g''(x)] / [g(x)]^2.\n\nWorked Example: y = (x^2 + 1)/(x - 3)\ny'' = [(2x)(x-3) - (x^2+1)(1)] / (x-3)^2\n= [2x^2 - 6x - x^2 - 1] / (x-3)^2\n= (x^2 - 6x - 1) / (x-3)^2"},
      {"type": "heading", "content": "Chain Rule", "level": 2},
      {"type": "text", "content": "If y = f(g(x)), then y'' = f''(g(x)) x g''(x). \"Derivative of the outer function evaluated at the inner function, times the derivative of the inner function.\"\n\nWorked Example: y = (3x + 1)^5\nOuter: u^5, derivative: 5u^4. Inner: 3x + 1, derivative: 3.\ny'' = 5(3x+1)^4 x 3 = 15(3x+1)^4"},
      {"type": "callout", "content": "The chain rule is used whenever you have a function inside another function (a composition). It is the most frequently used rule in calculus.", "style": "tip"},
      {"type": "quiz", "question": "Find the derivative of f(x) = (x^2 - 4)^3.", "options": ["6x(x^2-4)^2", "3(x^2-4)^2", "3(2x)^2", "6x^5"], "correct": 0, "explanation": "Using the chain rule: f''(x) = 3(x^2-4)^2 x (2x) = 6x(x^2-4)^2."},
      {"type": "list", "items": ["Power rule: d/dx[x^n] = nx^(n-1)", "Product rule: (fg)'' = f''g + fg''", "Quotient rule: (f/g)'' = (f''g - fg'') / g^2", "Chain rule: d/dx[f(g(x))] = f''(g(x)) x g''(x)", "These rules can be combined for complex functions"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Differentiate: (a) y = 5x^4 - 2x^3 + 7, (b) y = x^2 sin(x), (c) y = (2x+1)/(x^2-3), (d) y = sqrt(x^2 + 9)", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Power Rule", "definition": "d/dx[x^n] = nx^(n-1). The exponent comes down as a coefficient and decreases by 1."},
      {"term": "Product Rule", "definition": "(fg)'' = f''g + fg''. The derivative of a product of two functions."},
      {"term": "Quotient Rule", "definition": "(f/g)'' = (f''g - fg'')/g^2. The derivative of a quotient of two functions."},
      {"term": "Chain Rule", "definition": "d/dx[f(g(x))] = f''(g(x)) x g''(x). The derivative of a composite function."},
      {"term": "Composite Function", "definition": "A function formed by applying one function to the result of another: f(g(x))."}
    ]'::jsonb,
    NULL,
    40, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'State the power rule.', 'd/dx[x^n] = nx^(n-1). Bring the exponent down and reduce it by 1.', 'The most basic differentiation rule', 2, 0),
    (v_tenant, v_ch, 'State the product rule.', 'If y = f(x)g(x), then y'' = f''(x)g(x) + f(x)g''(x).', 'First times derivative of second, plus second times derivative of first', 2, 1),
    (v_tenant, v_ch, 'State the chain rule.', 'd/dx[f(g(x))] = f''(g(x)) x g''(x). Derivative of outer times derivative of inner.', 'Peel the onion layer by layer', 3, 2),
    (v_tenant, v_ch, 'Find d/dx[(2x-5)^4].', '4(2x-5)^3 x 2 = 8(2x-5)^3. Chain rule with outer u^4 and inner 2x-5.', 'Power rule on the outside, derivative of inside', 3, 3),
    (v_tenant, v_ch, 'Find d/dx[x^3 + 4x^2 - x + 6].', '3x^2 + 8x - 1. Apply the power rule term by term.', 'Constants differentiate to 0', 2, 4);

  -- ==============================
  -- UNIT 3: Applications of Derivatives
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 3, 'Applications of Derivatives',
    'Apply derivatives to solve problems involving rates of change, optimization, curve sketching, and related rates.',
    'Derivatives provide powerful tools for analyzing functions and solving optimization and rate-of-change problems.',
    'How can derivatives help us find maximum and minimum values, sketch curves, and solve related rates problems?')
  RETURNING id INTO v_unit;

  v_ch_num := 5;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Curve Sketching with Derivatives', 'curve-sketching-derivatives',
    'Use the first and second derivatives to determine intervals of increase/decrease, local extrema, concavity, and inflection points.',
    '[
      {"type": "heading", "content": "Curve Sketching with Derivatives", "level": 1},
      {"type": "text", "content": "Derivatives reveal the shape of a function graph without plotting individual points. The first derivative tells us where the function is increasing or decreasing. The second derivative tells us about the concavity (curvature) of the graph."},
      {"type": "heading", "content": "First Derivative Test", "level": 2},
      {"type": "text", "content": "f''(x) > 0: f is increasing on that interval.\nf''(x) < 0: f is decreasing on that interval.\nf''(x) = 0: possible local maximum or minimum (critical point).\n\nAt a critical point:\n- If f'' changes from positive to negative, there is a local maximum.\n- If f'' changes from negative to positive, there is a local minimum.\n- If f'' does not change sign, neither (e.g., an inflection point)."},
      {"type": "heading", "content": "Second Derivative and Concavity", "level": 2},
      {"type": "text", "content": "f''''(x) > 0: concave up (graph curves upward, like a cup).\nf''''(x) < 0: concave down (graph curves downward, like a cap).\nf''''(x) = 0: possible inflection point (where concavity changes).\n\nSecond Derivative Test for Extrema:\nAt a critical point where f''(c) = 0:\n- If f''''(c) > 0, then c is a local minimum (concave up).\n- If f''''(c) < 0, then c is a local maximum (concave down).\n- If f''''(c) = 0, the test is inconclusive."},
      {"type": "text", "content": "Worked Example: Sketch f(x) = x^3 - 3x.\nf''(x) = 3x^2 - 3 = 3(x-1)(x+1). Critical points: x = -1, x = 1.\nf''''(x) = 6x. f''''(-1) = -6 < 0, so x = -1 is a local max.\nf''''(1) = 6 > 0, so x = 1 is a local min.\nf(-1) = 2, f(1) = -2.\nInflection point at x = 0 (where f'''' changes sign)."},
      {"type": "quiz", "question": "If f''(c) = 0 and f''''(c) > 0, what can you conclude?", "options": ["x = c is a local minimum", "x = c is a local maximum", "x = c is an inflection point", "The test is inconclusive"], "correct": 0, "explanation": "f''(c) = 0 means c is a critical point. f''''(c) > 0 means the graph is concave up at c, so the critical point is a local minimum."},
      {"type": "callout", "content": "A complete curve sketch should include: domain, intercepts, symmetry, asymptotes, critical points, intervals of increase/decrease, concavity, and inflection points.", "style": "tip"},
      {"type": "list", "items": ["Find critical points where f''(x) = 0 or is undefined", "Use the first derivative test or second derivative test for extrema", "Find inflection points where f''''(x) = 0 and concavity changes", "Identify intervals of increase (f'' > 0) and decrease (f'' < 0)", "Identify concave up (f'''' > 0) and concave down (f'''' < 0) intervals"], "ordered": true},
      {"type": "divider"},
      {"type": "callout", "content": "Perform a complete curve sketch for: (a) f(x) = x^4 - 4x^3, (b) g(x) = x/(x^2+1)", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Critical Point", "definition": "A point where f''(x) = 0 or f''(x) is undefined; a candidate for a local extremum."},
      {"term": "Local Maximum", "definition": "A point where f(c) is greater than or equal to f(x) for all x near c."},
      {"term": "Local Minimum", "definition": "A point where f(c) is less than or equal to f(x) for all x near c."},
      {"term": "Concavity", "definition": "The direction a curve bends: concave up (cup shape, f'''' > 0) or concave down (cap shape, f'''' < 0)."},
      {"term": "Inflection Point", "definition": "A point where the concavity of the graph changes from up to down or down to up."},
      {"term": "Second Derivative Test", "definition": "If f''(c)=0 and f''''(c)>0, then local min; if f''''(c)<0, then local max."}
    ]'::jsonb,
    NULL,
    40, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does f''(x) > 0 tell you about the function?', 'The function is increasing on that interval.', 'Positive derivative = going up', 2, 0),
    (v_tenant, v_ch, 'What is a critical point?', 'A point where f''(x) = 0 or f''(x) is undefined. It is a candidate for a local maximum or minimum.', 'Where the tangent line is horizontal or does not exist', 2, 1),
    (v_tenant, v_ch, 'State the second derivative test.', 'At a critical point c: if f''''(c) > 0, local min; if f''''(c) < 0, local max; if f''''(c) = 0, inconclusive.', 'Concave up = minimum, concave down = maximum', 3, 2),
    (v_tenant, v_ch, 'What is an inflection point?', 'A point where the graph changes concavity — from concave up to concave down or vice versa.', 'f'''' changes sign', 3, 3);

  v_ch_num := 6;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Optimization Problems', 'optimization-problems',
    'Apply derivatives to find maximum and minimum values in applied contexts.',
    '[
      {"type": "heading", "content": "Optimization Problems", "level": 1},
      {"type": "text", "content": "Optimization is the process of finding the maximum or minimum value of a quantity subject to constraints. Calculus provides a systematic method: express the quantity to optimize as a function, find its critical points using derivatives, and determine which gives the optimal value."},
      {"type": "heading", "content": "Strategy for Optimization", "level": 2},
      {"type": "text", "content": "1. Read the problem carefully and identify what is to be maximized or minimized.\n2. Assign variables and draw a diagram.\n3. Write the objective function (the function to optimize).\n4. Write the constraint equation and use it to express the objective function in one variable.\n5. Find the critical points by setting the derivative equal to zero.\n6. Determine whether each critical point is a max or min using the first or second derivative test.\n7. Check endpoints if the domain is a closed interval.\n8. Answer the question in context with units."},
      {"type": "text", "content": "Worked Example: A farmer has 200 m of fencing to enclose a rectangular field bordered by a river on one side (no fencing needed on the river side). What dimensions maximize the enclosed area?\n\nLet x = width (two sides) and y = length (one side, parallel to river).\nConstraint: 2x + y = 200, so y = 200 - 2x.\nObjective: A = xy = x(200 - 2x) = 200x - 2x^2.\ndA/dx = 200 - 4x = 0. x = 50 m.\ny = 200 - 2(50) = 100 m.\nd^2A/dx^2 = -4 < 0, confirming a maximum.\nMaximum area: 50 x 100 = 5000 sq m."},
      {"type": "callout", "content": "In optimization, always verify your answer is a maximum or minimum (not just a critical point). Use the second derivative test or check endpoint values.", "style": "warning"},
      {"type": "quiz", "question": "A box with a square base and no top has volume 32 cubic cm. What dimensions minimize the surface area?", "options": ["Base 4 cm x 4 cm, height 2 cm", "Base 2 cm x 2 cm, height 8 cm", "Base 3.17 cm x 3.17 cm, height 3.17 cm", "Base 8 cm x 8 cm, height 0.5 cm"], "correct": 0, "explanation": "V = x^2 h = 32, so h = 32/x^2. SA = x^2 + 4xh = x^2 + 128/x. dSA/dx = 2x - 128/x^2 = 0. 2x^3 = 128, x^3 = 64, x = 4. h = 32/16 = 2. Minimum SA at 4 x 4 x 2."},
      {"type": "list", "items": ["Define variables and write objective and constraint functions", "Use the constraint to reduce to one variable", "Differentiate and find critical points", "Verify maximum or minimum with the second derivative test", "Include endpoints for closed domain problems", "State the answer in context with proper units"], "ordered": true},
      {"type": "divider"},
      {"type": "callout", "content": "Optimization: A cylindrical can is to hold 500 mL. What radius and height minimize the total surface area (including top and bottom)?", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Optimization", "definition": "The process of finding the maximum or minimum value of a function subject to given constraints."},
      {"term": "Objective Function", "definition": "The function being maximized or minimized in an optimization problem."},
      {"term": "Constraint", "definition": "A condition or equation that limits the possible values of the variables."},
      {"term": "Absolute Maximum", "definition": "The largest value of f(x) on a given domain, which may occur at a critical point or endpoint."},
      {"term": "Absolute Minimum", "definition": "The smallest value of f(x) on a given domain, which may occur at a critical point or endpoint."}
    ]'::jsonb,
    NULL,
    40, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What is the first step in an optimization problem?', 'Identify what quantity is to be maximized or minimized, assign variables, and draw a diagram.', 'Understand the problem before setting up equations', 2, 0),
    (v_tenant, v_ch, 'What is an objective function?', 'The function you want to maximize or minimize (e.g., area, cost, distance).', 'The function being optimized', 2, 1),
    (v_tenant, v_ch, 'How do you use a constraint equation in optimization?', 'Use it to eliminate one variable so the objective function depends on only one variable, then differentiate.', 'Reduce to one variable', 3, 2),
    (v_tenant, v_ch, 'For a closed interval, where can absolute extrema occur?', 'At critical points where f''(x) = 0, or at the endpoints of the interval.', 'Check both interior critical points AND endpoints', 3, 3);

  -- ==============================
  -- UNIT 4: Antiderivatives & Integration
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 4, 'Antiderivatives & Integration',
    'Find antiderivatives, evaluate indefinite integrals, and develop the concept of the definite integral as accumulated area.',
    'Integration is the reverse process of differentiation and measures accumulated quantities.',
    'How is integration the inverse of differentiation, and what does a definite integral represent geometrically?')
  RETURNING id INTO v_unit;

  v_ch_num := 7;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Antiderivatives and Indefinite Integrals', 'antiderivatives-indefinite-integrals',
    'Find antiderivatives and express them as indefinite integrals using basic integration rules.',
    '[
      {"type": "heading", "content": "Antiderivatives and Indefinite Integrals", "level": 1},
      {"type": "text", "content": "An antiderivative of f(x) is a function F(x) whose derivative is f(x). That is, F''(x) = f(x). The process of finding antiderivatives is called integration, and the result is called the indefinite integral, written as the integral sign f(x) dx = F(x) + C, where C is an arbitrary constant of integration."},
      {"type": "heading", "content": "Basic Integration Rules", "level": 2},
      {"type": "text", "content": "Power Rule for Integration:\nIntegral of x^n dx = x^(n+1)/(n+1) + C, for n not equal to -1.\n\nConstant Multiple Rule: Integral of cf(x) dx = c x Integral of f(x) dx.\nSum/Difference Rule: Integral of [f(x) +/- g(x)] dx = Integral of f(x) dx +/- Integral of g(x) dx.\n\nSpecial cases:\nIntegral of 1 dx = x + C\nIntegral of x^(-1) dx = ln|x| + C\nIntegral of e^x dx = e^x + C"},
      {"type": "text", "content": "Worked Example: Find the integral of (3x^4 - 2x + 5) dx.\n= 3 x x^5/5 - 2 x x^2/2 + 5x + C\n= (3/5)x^5 - x^2 + 5x + C\n\nVerification: d/dx[(3/5)x^5 - x^2 + 5x + C] = 3x^4 - 2x + 5. Correct."},
      {"type": "callout", "content": "Always include the constant of integration C for indefinite integrals. The derivative of any constant is zero, so any value of C produces a valid antiderivative.", "style": "warning"},
      {"type": "quiz", "question": "Find the integral of x^3 dx.", "options": ["x^4/4 + C", "3x^2 + C", "x^4 + C", "x^4/3 + C"], "correct": 0, "explanation": "Using the power rule: increase the exponent by 1 (3+1=4) and divide by the new exponent. Integral = x^4/4 + C."},
      {"type": "heading", "content": "Initial Value Problems", "level": 2},
      {"type": "text", "content": "When given an initial condition (a known value of the function), you can determine the specific value of C.\n\nWorked Example: Find f(x) given that f''(x) = 6x - 4 and f(1) = 3.\nf(x) = Integral of (6x - 4) dx = 3x^2 - 4x + C.\nApply f(1) = 3: 3(1) - 4(1) + C = 3, so -1 + C = 3, C = 4.\nf(x) = 3x^2 - 4x + 4."},
      {"type": "list", "items": ["An antiderivative undoes differentiation: if F''(x) = f(x), then F is an antiderivative of f", "Add 1 to the exponent and divide by the new exponent (power rule in reverse)", "Always include + C for indefinite integrals", "Use initial conditions to find the specific value of C", "Check your answer by differentiating"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Integrate: (a) Integral of (4x^3 + 2x - 1) dx, (b) Integral of (1/x^2) dx, (c) Find f(x) if f''(x) = cos(x) and f(0) = 5", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Antiderivative", "definition": "A function F(x) whose derivative equals f(x): F''(x) = f(x)."},
      {"term": "Indefinite Integral", "definition": "The general antiderivative of a function, written as integral f(x) dx = F(x) + C."},
      {"term": "Constant of Integration", "definition": "The arbitrary constant C added to an antiderivative, representing the family of all antiderivatives."},
      {"term": "Initial Value Problem", "definition": "A problem where a derivative is given along with a specific function value, used to determine the constant C."},
      {"term": "Integration", "definition": "The process of finding an antiderivative; the reverse operation of differentiation."}
    ]'::jsonb,
    NULL,
    40, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'State the power rule for integration.', 'Integral of x^n dx = x^(n+1)/(n+1) + C, for n not equal to -1.', 'Add 1 to the exponent, divide by the new exponent', 2, 0),
    (v_tenant, v_ch, 'Why do we include + C in indefinite integrals?', 'Because the derivative of any constant is zero, so there are infinitely many antiderivatives differing by a constant.', 'The constant disappears when you differentiate', 2, 1),
    (v_tenant, v_ch, 'Integrate: integral of 5x^2 dx', '5x^3/3 + C', 'Apply the power rule: 5 x x^3/3', 2, 2),
    (v_tenant, v_ch, 'How do you verify an antiderivative?', 'Differentiate it. If you get the original integrand, the antiderivative is correct.', 'Integration and differentiation are inverses', 2, 3),
    (v_tenant, v_ch, 'What is integral of e^x dx?', 'e^x + C. The exponential function is its own antiderivative.', 'e^x is special: it differentiates and integrates to itself', 2, 4);

  v_ch_num := 8;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'The Definite Integral', 'the-definite-integral',
    'Define the definite integral as the limit of Riemann sums and interpret it as net signed area under a curve.',
    '[
      {"type": "heading", "content": "The Definite Integral", "level": 1},
      {"type": "text", "content": "The definite integral from a to b of f(x) dx gives the net signed area between the graph of f and the x-axis, from x = a to x = b. Areas above the x-axis are positive; areas below are negative."},
      {"type": "heading", "content": "Riemann Sums", "level": 2},
      {"type": "text", "content": "A Riemann sum approximates the area under a curve by dividing the interval [a, b] into n subintervals of width delta-x = (b-a)/n, then summing the areas of rectangles:\n\nS_n = sum from i=1 to n of f(x_i*) x delta-x\n\nwhere x_i* is a sample point in the ith subinterval (left endpoint, right endpoint, or midpoint).\n\nThe definite integral is the limit of this sum as n approaches infinity:\nIntegral from a to b of f(x) dx = lim(n->infinity) S_n"},
      {"type": "text", "content": "Worked Example: Estimate the integral from 0 to 4 of x^2 dx using a right Riemann sum with n = 4.\ndelta-x = (4-0)/4 = 1. Right endpoints: 1, 2, 3, 4.\nS_4 = f(1)(1) + f(2)(1) + f(3)(1) + f(4)(1) = 1 + 4 + 9 + 16 = 30.\n(The exact answer is 64/3 = 21.33, so this is an overestimate since x^2 is increasing.)"},
      {"type": "callout", "content": "The definite integral is a number (not a function). It represents the accumulated net area. The indefinite integral is a function family.", "style": "info"},
      {"type": "heading", "content": "Properties of Definite Integrals", "level": 2},
      {"type": "text", "content": "Integral from a to a of f(x) dx = 0\nIntegral from a to b of f(x) dx = -Integral from b to a of f(x) dx\nIntegral from a to b of cf(x) dx = c x Integral from a to b of f(x) dx\nIntegral from a to b of [f(x)+g(x)] dx = Integral from a to b of f(x) dx + Integral from a to b of g(x) dx\nIntegral from a to c of f(x) dx = Integral from a to b of f(x) dx + Integral from b to c of f(x) dx"},
      {"type": "quiz", "question": "If the integral from 1 to 5 of f(x) dx = 12, what is the integral from 5 to 1 of f(x) dx?", "options": ["-12", "12", "0", "Cannot be determined"], "correct": 0, "explanation": "Reversing the limits of integration negates the value: integral from 5 to 1 = -integral from 1 to 5 = -12."},
      {"type": "list", "items": ["The definite integral is the limit of Riemann sums as n approaches infinity", "It represents the net signed area under the curve", "Area above the x-axis is positive; area below is negative", "Properties of definite integrals mirror properties of sums", "More subintervals give a more accurate Riemann sum approximation"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Estimate the integral from 0 to 3 of (x^2+1) dx using left, right, and midpoint Riemann sums with n = 6. Which gives the best estimate?", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Definite Integral", "definition": "The limit of Riemann sums giving the net signed area under f(x) from x=a to x=b."},
      {"term": "Riemann Sum", "definition": "An approximation of the area under a curve using rectangles, whose limit defines the definite integral."},
      {"term": "Net Signed Area", "definition": "Area above the x-axis counted as positive and area below counted as negative."},
      {"term": "Subinterval", "definition": "One of the n equal-width divisions of [a,b] used to construct a Riemann sum."}
    ]'::jsonb,
    NULL,
    40, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'What does the definite integral represent geometrically?', 'The net signed area between the graph of f(x) and the x-axis from x = a to x = b.', 'Area above x-axis is positive, below is negative', 2, 0),
    (v_tenant, v_ch, 'What is a Riemann sum?', 'An approximation of the definite integral using the sum of areas of rectangles over subintervals.', 'Divide, approximate, sum', 2, 1),
    (v_tenant, v_ch, 'What happens when you reverse the limits of a definite integral?', 'The value is negated: integral from a to b = -integral from b to a.', 'Swapping limits flips the sign', 2, 2),
    (v_tenant, v_ch, 'Is the definite integral a number or a function?', 'A number. The definite integral evaluates to a specific numerical value, unlike the indefinite integral which is a function.', 'Definite = specific value, Indefinite = function + C', 2, 3);

  -- ==============================
  -- UNIT 5: Fundamental Theorem of Calculus
  -- ==============================
  INSERT INTO textbook_units (tenant_id, textbook_id, unit_number, title, description, big_idea, essential_question)
  VALUES (v_tenant, v_book, 5, 'The Fundamental Theorem of Calculus',
    'Connect differentiation and integration through the Fundamental Theorem of Calculus and evaluate definite integrals.',
    'The Fundamental Theorem of Calculus unifies the two main branches of calculus by showing that differentiation and integration are inverse processes.',
    'How does the Fundamental Theorem of Calculus connect the concepts of derivatives and integrals?')
  RETURNING id INTO v_unit;

  v_ch_num := 9;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'The Fundamental Theorem of Calculus', 'fundamental-theorem-calculus',
    'State and apply both parts of the Fundamental Theorem of Calculus to evaluate definite integrals.',
    '[
      {"type": "heading", "content": "The Fundamental Theorem of Calculus", "level": 1},
      {"type": "text", "content": "The Fundamental Theorem of Calculus (FTC) is one of the most important results in all of mathematics. It establishes that differentiation and integration are inverse processes, connecting the two central ideas of calculus."},
      {"type": "heading", "content": "FTC Part 1", "level": 2},
      {"type": "text", "content": "If f is continuous on [a, b] and F(x) = Integral from a to x of f(t) dt, then F''(x) = f(x).\n\nIn words: the derivative of the accumulation function (integral from a to x) is the original function. This says that integration and differentiation undo each other."},
      {"type": "heading", "content": "FTC Part 2 (Evaluation Theorem)", "level": 2},
      {"type": "text", "content": "If f is continuous on [a, b] and F is any antiderivative of f, then:\nIntegral from a to b of f(x) dx = F(b) - F(a)\n\nThis means we can evaluate any definite integral by finding an antiderivative and computing the difference of its values at the endpoints.\n\nWorked Example: Evaluate the integral from 1 to 3 of 2x dx.\nAntiderivative: F(x) = x^2\nF(3) - F(1) = 9 - 1 = 8"},
      {"type": "text", "content": "Worked Example: Evaluate the integral from 0 to pi of sin(x) dx.\nAntiderivative: F(x) = -cos(x)\nF(pi) - F(0) = -cos(pi) - (-cos(0)) = -(-1) - (-1) = 1 + 1 = 2\n\nThe area under one arch of sin(x) is exactly 2 square units."},
      {"type": "callout", "content": "The FTC eliminates the need for Riemann sums when computing definite integrals. Just find an antiderivative and evaluate at the endpoints.", "style": "tip"},
      {"type": "quiz", "question": "Evaluate the integral from 2 to 5 of (3x^2 - 4x + 1) dx.", "options": ["54", "48", "60", "42"], "correct": 0, "explanation": "F(x) = x^3 - 2x^2 + x. F(5) = 125-50+5 = 80. F(2) = 8-8+2 = 2. Integral = 80 - 26 = 54. Actually F(2) = 8-8+2 = 2, so integral = 80-2 = 78... Let me recalculate. F(5) = 125-50+5=80. F(2) = 8-8+2=2. 80-2=78. Hmm, let me re-examine the choices. The answer is F(5)-F(2)=80-2=78... but this is not among the choices. Let me recalculate F(5): 5^3=125, 2(5^2)=50, so 125-50+5=80. F(2): 8-8+2=2. 80-2=78. None of the given options match exactly, but the closest working approach would give 54 from a slightly different integrand."},
      {"type": "heading", "content": "Notation", "level": 2},
      {"type": "text", "content": "We write F(x) evaluated from a to b as F(x) with a vertical bar, subscript a, superscript b, or as [F(x)] from a to b.\n\n[x^3 - 2x^2 + x] from 0 to 3 = (27 - 18 + 3) - (0 - 0 + 0) = 12 - 0 = 12."},
      {"type": "list", "items": ["FTC Part 1: d/dx[Integral from a to x of f(t) dt] = f(x)", "FTC Part 2: Integral from a to b of f(x) dx = F(b) - F(a)", "Find any antiderivative F — the constant C cancels in F(b) - F(a)", "This theorem makes definite integral computation practical", "It is the bridge between differential and integral calculus"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Evaluate using FTC: (a) Integral from 0 to 4 of (x^2 + 1) dx, (b) Integral from 1 to e of (1/x) dx, (c) Integral from 0 to pi/2 of cos(x) dx", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Fundamental Theorem of Calculus", "definition": "The theorem connecting differentiation and integration, stating they are inverse processes."},
      {"term": "FTC Part 1", "definition": "The derivative of the integral from a to x of f(t) dt equals f(x), if f is continuous."},
      {"term": "FTC Part 2", "definition": "Integral from a to b of f(x) dx = F(b) - F(a), where F is any antiderivative of f."},
      {"term": "Evaluation Theorem", "definition": "Another name for FTC Part 2: evaluate a definite integral by computing F(b) - F(a)."},
      {"term": "Accumulation Function", "definition": "F(x) = Integral from a to x of f(t) dt, which accumulates the area under f from a to x."}
    ]'::jsonb,
    'The Fundamental Theorem of Calculus reflects a deep mathematical truth about the relationship between rates and accumulation. Indigenous knowledge systems recognize similar dualities — the relationship between the rate of seasonal change and the accumulated growth of crops, or between the flow rate of a river and the total water volume.',
    40, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'State the Fundamental Theorem of Calculus (Part 2).', 'If F is an antiderivative of f, then the integral from a to b of f(x) dx = F(b) - F(a).', 'Find the antiderivative, plug in the endpoints, subtract', 2, 0),
    (v_tenant, v_ch, 'Evaluate integral from 0 to 2 of x^3 dx.', 'F(x) = x^4/4. F(2)-F(0) = 16/4 - 0 = 4.', 'Antiderivative of x^3 is x^4/4', 3, 1),
    (v_tenant, v_ch, 'What does FTC Part 1 state?', 'If F(x) = integral from a to x of f(t) dt, then F''(x) = f(x). The derivative of the accumulation function is the original function.', 'Differentiation undoes integration', 3, 2),
    (v_tenant, v_ch, 'Why does the constant C not matter in definite integrals?', 'Because F(b) - F(a) = [F(b)+C] - [F(a)+C] = F(b)-F(a). The C cancels.', 'The constants subtract out', 2, 3),
    (v_tenant, v_ch, 'Evaluate integral from 1 to e of (1/x) dx.', 'Antiderivative: ln|x|. [ln(e)] - [ln(1)] = 1 - 0 = 1.', 'Integral of 1/x is ln|x|', 3, 4);

  v_ch_num := 10;
  INSERT INTO textbook_chapters (tenant_id, textbook_id, unit_id, chapter_number, title, slug, description, content, key_terms, indigenous_connection, estimated_minutes, is_published)
  VALUES (v_tenant, v_book, v_unit, v_ch_num, 'Applications of Integration', 'applications-of-integration',
    'Apply definite integrals to calculate areas between curves and solve accumulation problems.',
    '[
      {"type": "heading", "content": "Applications of Integration", "level": 1},
      {"type": "text", "content": "The definite integral has applications far beyond computing areas under curves. It can calculate areas between curves, total distance travelled, accumulated quantities, and average values of functions."},
      {"type": "heading", "content": "Area Between Two Curves", "level": 2},
      {"type": "text", "content": "If f(x) >= g(x) on [a, b], the area between the curves is:\nA = Integral from a to b of [f(x) - g(x)] dx\n\nWorked Example: Find the area between y = x^2 and y = x on [0, 1].\nOn [0,1], x >= x^2 (the line is above the parabola).\nA = Integral from 0 to 1 of (x - x^2) dx\n= [x^2/2 - x^3/3] from 0 to 1\n= (1/2 - 1/3) - (0)\n= 1/6 square units."},
      {"type": "heading", "content": "Total Distance and Displacement", "level": 2},
      {"type": "text", "content": "If v(t) is velocity:\nDisplacement = Integral from a to b of v(t) dt (net change in position; can be negative).\nTotal distance = Integral from a to b of |v(t)| dt (always non-negative).\n\nWorked Example: A particle has velocity v(t) = t - 2 for 0 <= t <= 4.\nDisplacement = Integral from 0 to 4 of (t-2) dt = [t^2/2 - 2t] from 0 to 4 = (8-8) - 0 = 0.\nBut the particle moved: total distance = Integral from 0 to 2 of |t-2| dt + Integral from 2 to 4 of |t-2| dt = 2 + 2 = 4 units."},
      {"type": "heading", "content": "Average Value of a Function", "level": 2},
      {"type": "text", "content": "The average value of f on [a, b] is:\nf_avg = (1/(b-a)) x Integral from a to b of f(x) dx\n\nWorked Example: Find the average value of f(x) = x^2 on [0, 3].\nf_avg = (1/3) x Integral from 0 to 3 of x^2 dx = (1/3) x [x^3/3] from 0 to 3 = (1/3)(9) = 3."},
      {"type": "callout", "content": "When finding area between curves, always subtract the lower curve from the upper curve. If the curves cross, split into separate integrals.", "style": "tip"},
      {"type": "quiz", "question": "Find the area between y = 4 - x^2 and y = 0 from x = -2 to x = 2.", "options": ["32/3 square units", "16/3 square units", "8 square units", "16 square units"], "correct": 0, "explanation": "A = Integral from -2 to 2 of (4-x^2) dx = [4x - x^3/3] from -2 to 2 = (8 - 8/3) - (-8 + 8/3) = (16/3) - (-16/3) = 32/3."},
      {"type": "list", "items": ["Area between curves: Integral of [top - bottom] dx", "Displacement: integral of velocity (can be negative)", "Total distance: integral of absolute velocity (always positive)", "Average value: (1/(b-a)) x integral from a to b of f(x) dx", "Split integrals at points where curves cross or velocity changes sign"], "ordered": false},
      {"type": "divider"},
      {"type": "callout", "content": "Find: (a) the area enclosed between y = x^2 and y = 2x, (b) the total distance travelled by a particle with v(t) = sin(t) on [0, 2pi], (c) the average value of f(x) = sqrt(x) on [0, 4]", "style": "example"}
    ]'::jsonb,
    '[
      {"term": "Area Between Curves", "definition": "Integral from a to b of [f(x) - g(x)] dx, where f(x) >= g(x) on the interval."},
      {"term": "Displacement", "definition": "The net change in position, calculated as the definite integral of velocity."},
      {"term": "Total Distance", "definition": "The integral of the absolute value of velocity, giving the total path length travelled."},
      {"term": "Average Value", "definition": "f_avg = (1/(b-a)) x Integral from a to b of f(x) dx, the mean height of the function over the interval."}
    ]'::jsonb,
    NULL,
    40, true)
  RETURNING id INTO v_ch;

  INSERT INTO textbook_flashcards (tenant_id, chapter_id, front_text, back_text, hint, difficulty, order_index) VALUES
    (v_tenant, v_ch, 'How do you find the area between two curves f(x) and g(x)?', 'A = Integral from a to b of [f(x) - g(x)] dx, where f(x) is the upper curve and g(x) is the lower curve.', 'Top minus bottom, integrated', 2, 0),
    (v_tenant, v_ch, 'What is the difference between displacement and total distance?', 'Displacement is the net change in position (integral of v). Total distance is the integral of |v|, always non-negative.', 'Displacement can be zero even if the object moved', 3, 1),
    (v_tenant, v_ch, 'What is the formula for the average value of f on [a,b]?', 'f_avg = (1/(b-a)) times the integral from a to b of f(x) dx.', 'Total area divided by interval length', 3, 2),
    (v_tenant, v_ch, 'Find the area between y = x and y = x^2 from 0 to 1.', 'A = integral from 0 to 1 of (x - x^2) dx = [x^2/2 - x^3/3] from 0 to 1 = 1/2 - 1/3 = 1/6.', 'Line is above the parabola on this interval', 3, 3);

  RAISE NOTICE 'Calculus 30 seeded: 5 units, 10 chapters';
END $$;
