'use client'

import { useState } from 'react'
import { Apple, ChevronDown, ChevronUp, Send, Sparkles } from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface PyramidTier {
  id: string
  emoji: string
  label: string
  servings: string
  color: string
  colorDark: string
  borderColor: string
  foods: string[]
  tip: string
  widthPercent: number // visual width (bottom=100, top=40)
}

const PYRAMID_TIERS: PyramidTier[] = [
  {
    id: 'sugars',
    emoji: '\ud83c\udf6c\ud83c\udf70\ud83e\uddc2',
    label: 'Sugars & Sweets',
    servings: 'Use sparingly',
    color: 'from-red-400 to-red-500',
    colorDark: 'dark:from-red-600 dark:to-red-700',
    borderColor: 'border-red-400 dark:border-red-600',
    foods: [
      '\ud83c\udf6c Candy', '\ud83c\udf6b Chocolate', '\ud83c\udf70 Cake', '\ud83c\udf69 Doughnuts',
      '\ud83e\uddc1 Cupcakes', '\ud83c\udf6a Cookies', '\ud83e\udd64 Soda', '\ud83c\udf66 Ice Cream',
      '\ud83c\udf6f Honey (small amounts)', '\ud83e\uddc2 Salt (limit intake)',
    ],
    tip: 'These foods taste great but offer little nutrition. Enjoy as an occasional treat, not a daily habit!',
    widthPercent: 40,
  },
  {
    id: 'dairy',
    emoji: '\ud83e\uddc0\ud83e\udd5b\ud83e\uddc8',
    label: 'Dairy & Healthy Fats',
    servings: '2\u20133 servings/day',
    color: 'from-yellow-300 to-yellow-400',
    colorDark: 'dark:from-yellow-600 dark:to-yellow-700',
    borderColor: 'border-yellow-400 dark:border-yellow-600',
    foods: [
      '\ud83e\udd5b Milk', '\ud83e\uddc0 Cheese', '\ud83e\ude98 Yogurt', '\ud83e\uddc8 Butter (moderation)',
      '\ud83e\uded2 Olive Oil', '\ud83e\udd51 Avocado', '\ud83e\udd5c Peanut Butter', '\ud83c\udf65 Coconut Oil',
    ],
    tip: 'Dairy gives you calcium for strong bones and teeth. Choose low-fat options when you can!',
    widthPercent: 55,
  },
  {
    id: 'protein',
    emoji: '\ud83c\udf57\ud83d\udc1f\ud83e\udd5c\ud83e\uded8',
    label: 'Protein',
    servings: '2\u20133 servings/day',
    color: 'from-orange-400 to-orange-500',
    colorDark: 'dark:from-orange-600 dark:to-orange-700',
    borderColor: 'border-orange-400 dark:border-orange-600',
    foods: [
      '\ud83c\udf57 Chicken', '\ud83e\udd69 Steak', '\ud83d\udc1f Fish', '\ud83e\udd5a Eggs',
      '\ud83e\uded8 Beans', '\ud83e\udd5c Nuts', '\ud83c\udf2d Tofu', '\ud83e\udd90 Shrimp',
      '\ud83e\udd53 Turkey', '\ud83e\udd6b Lentils',
    ],
    tip: 'Protein builds your muscles and repairs your body. Mix it up with both animal and plant proteins!',
    widthPercent: 70,
  },
  {
    id: 'fruits-veggies',
    emoji: '\ud83e\udd66\ud83e\udd55\ud83c\udf4e\ud83c\udf4c',
    label: 'Fruits & Vegetables',
    servings: '5\u20139 servings/day',
    color: 'from-green-400 to-emerald-500',
    colorDark: 'dark:from-green-600 dark:to-emerald-700',
    borderColor: 'border-green-400 dark:border-green-600',
    foods: [
      '\ud83e\udd66 Broccoli', '\ud83e\udd55 Carrots', '\ud83c\udf4e Apples', '\ud83c\udf4c Bananas',
      '\ud83c\udf4a Oranges', '\ud83c\udf53 Strawberries', '\ud83e\udd6c Spinach', '\ud83c\udf45 Tomatoes',
      '\ud83e\udd54 Potatoes', '\ud83c\udf47 Grapes', '\ud83c\udf49 Watermelon', '\ud83e\udd6d Mangoes',
    ],
    tip: 'Eat the rainbow! Different colored fruits and veggies give you different vitamins and minerals.',
    widthPercent: 85,
  },
  {
    id: 'grains',
    emoji: '\ud83c\udf5e\ud83c\udf3e\ud83c\udf5a',
    label: 'Grains & Carbs',
    servings: '6\u20138 servings/day',
    color: 'from-amber-400 to-amber-600',
    colorDark: 'dark:from-amber-600 dark:to-amber-800',
    borderColor: 'border-amber-500 dark:border-amber-600',
    foods: [
      '\ud83c\udf5e Bread', '\ud83c\udf5a Rice', '\ud83c\udf5d Pasta', '\ud83e\udd63 Oatmeal',
      '\ud83e\udd5e Pancakes (whole grain)', '\ud83c\udf3d Corn', '\ud83e\udd56 Baguette',
      '\ud83c\udf6e Quinoa', '\ud83e\uded3 Tortilla', '\ud83e\udd42 Cereal (whole grain)',
    ],
    tip: 'Grains are your energy fuel! Choose whole grains for extra fiber and nutrients.',
    widthPercent: 100,
  },
]

interface NutritionFact {
  emoji: string
  title: string
  description: string
  color: string
}

const NUTRITION_FACTS: NutritionFact[] = [
  {
    emoji: '\ud83d\udca7',
    title: 'Water',
    description: '8 glasses/day \u2014 your body is 60% water!',
    color: 'from-blue-400/20 to-cyan-400/20 border-blue-400/30',
  },
  {
    emoji: '\ud83d\udd25',
    title: 'Calories',
    description: 'Kids: 1,200\u20132,000 | Teens: 1,600\u20133,000 | Adults: 1,600\u20132,400',
    color: 'from-orange-400/20 to-red-400/20 border-orange-400/30',
  },
  {
    emoji: '\ud83d\udcaa',
    title: 'Protein',
    description: 'Builds muscles and repairs cells throughout your body.',
    color: 'from-rose-400/20 to-pink-400/20 border-rose-400/30',
  },
  {
    emoji: '\ud83c\udf3e',
    title: 'Fiber',
    description: 'Keeps digestion healthy \u2014 aim for 25\u201330g per day!',
    color: 'from-amber-400/20 to-yellow-400/20 border-amber-400/30',
  },
  {
    emoji: '\ud83e\uddb4',
    title: 'Calcium',
    description: 'Strong bones & teeth \u2014 found in dairy, greens & fortified foods.',
    color: 'from-gray-300/20 to-slate-400/20 border-gray-400/30',
  },
  {
    emoji: '\u26a1',
    title: 'Vitamins',
    description: 'A, B, C, D, E, K \u2014 each has a superpower for your body!',
    color: 'from-purple-400/20 to-violet-400/20 border-purple-400/30',
  },
]

interface MealIdea {
  emoji: string
  name: string
  description: string
}

const MEAL_IDEAS: Record<string, MealIdea[]> = {
  Breakfast: [
    { emoji: '\ud83e\udd5e', name: 'Whole Grain Pancakes', description: 'Top with fresh berries and a drizzle of maple syrup' },
    { emoji: '\ud83e\udd63', name: 'Oatmeal Power Bowl', description: 'Oats + banana + almonds + honey = energy boost!' },
    { emoji: '\ud83e\udd5a', name: 'Scrambled Eggs & Toast', description: 'Protein-packed start with whole wheat toast' },
    { emoji: '\ud83c\udf53', name: 'Yogurt Parfait', description: 'Layer yogurt, granola, and fresh fruit' },
    { emoji: '\ud83e\udd64', name: 'Fruit Smoothie', description: 'Blend spinach, banana, berries & milk \u2014 can\u2019t taste the greens!' },
  ],
  Lunch: [
    { emoji: '\ud83e\udd6a', name: 'Turkey & Veggie Wrap', description: 'Whole wheat wrap with turkey, lettuce, tomato & cheese' },
    { emoji: '\ud83e\udd57', name: 'Rainbow Salad', description: 'Mixed greens with colorful veggies, chicken & light dressing' },
    { emoji: '\ud83c\udf5c', name: 'Veggie Noodle Soup', description: 'Warm broth with noodles, carrots, peas & chicken' },
    { emoji: '\ud83c\udf2f', name: 'Bean Burrito Bowl', description: 'Rice, beans, salsa, corn & avocado \u2014 no tortilla needed!' },
    { emoji: '\ud83e\uddc0', name: 'Grilled Cheese & Tomato Soup', description: 'A classic combo \u2014 use whole grain bread for extra points' },
  ],
  Dinner: [
    { emoji: '\ud83c\udf57', name: 'Baked Chicken & Veggies', description: 'Seasoned chicken breast with roasted broccoli & sweet potato' },
    { emoji: '\ud83d\udc1f', name: 'Fish Tacos', description: 'Grilled fish in corn tortillas with cabbage slaw' },
    { emoji: '\ud83c\udf5d', name: 'Pasta Primavera', description: 'Whole wheat pasta loaded with colorful vegetables' },
    { emoji: '\ud83c\udf72', name: 'Hearty Veggie Stew', description: 'Potatoes, carrots, beans & herbs in a warm broth' },
    { emoji: '\ud83c\udf5b', name: 'Stir-Fry Rice Bowl', description: 'Brown rice with tofu or chicken, peppers, snap peas & soy sauce' },
  ],
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function PyramidTierRow({ tier, index }: { tier: PyramidTier; index: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="flex flex-col items-center w-full">
      <button
        onClick={() => setExpanded(!expanded)}
        className="group relative w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFFF] focus-visible:ring-offset-2 rounded-xl"
        style={{ maxWidth: `${tier.widthPercent}%` }}
        aria-expanded={expanded}
        aria-label={`${tier.label} — ${tier.servings}. Click to ${expanded ? 'collapse' : 'expand'} details.`}
      >
        <div
          className={`
            relative overflow-hidden rounded-xl border-2 ${tier.borderColor}
            bg-gradient-to-r ${tier.color} ${tier.colorDark}
            px-4 py-3 sm:px-6 sm:py-4
            transition-all duration-300
            group-hover:scale-[1.02] group-hover:shadow-lg
            cursor-pointer select-none
          `}
        >
          {/* Glass shine overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none rounded-xl" />

          <div className="relative z-10 flex items-center justify-between gap-2 text-white">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="text-xl sm:text-2xl flex-shrink-0" aria-hidden="true">{tier.emoji}</span>
              <div className="min-w-0">
                <h3 className="font-bold text-sm sm:text-base lg:text-lg leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  {tier.label}
                </h3>
                <p className="text-xs sm:text-sm opacity-90 drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
                  {tier.servings}
                </p>
              </div>
            </div>
            <div className="flex-shrink-0 text-white/80 group-hover:text-white transition-colors">
              {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
          </div>
        </div>
      </button>

      {/* Expanded Detail */}
      {expanded && (
        <div
          className={`
            mt-2 w-full ocean-card rounded-xl p-4 sm:p-6
            border ${tier.borderColor}
            animate-in slide-in-from-top-2 fade-in duration-300
          `}
          style={{ maxWidth: `${Math.min(tier.widthPercent + 10, 100)}%` }}
        >
          <p className="text-sm sm:text-base text-foreground/80 mb-3 italic">
            {'\ud83d\udca1'} {tier.tip}
          </p>
          <div className="flex flex-wrap gap-2">
            {tier.foods.map((food) => (
              <span
                key={food}
                className="inline-flex items-center rounded-lg bg-background/60 dark:bg-white/10 px-3 py-1.5 text-xs sm:text-sm font-medium border border-border/50"
              >
                {food}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function PlateSection({
  emoji,
  label,
  percent,
  startAngle,
  color,
}: {
  emoji: string
  label: string
  percent: number
  startAngle: number
  color: string
}) {
  // SVG arc path for the pie slice
  const endAngle = startAngle + (percent / 100) * 360
  const startRad = ((startAngle - 90) * Math.PI) / 180
  const endRad = ((endAngle - 90) * Math.PI) / 180
  const largeArc = percent > 50 ? 1 : 0
  const cx = 150, cy = 150, r = 140

  const x1 = cx + r * Math.cos(startRad)
  const y1 = cy + r * Math.sin(startRad)
  const x2 = cx + r * Math.cos(endRad)
  const y2 = cy + r * Math.sin(endRad)

  const midAngle = ((startAngle + endAngle) / 2 - 90) * Math.PI / 180
  const labelR = r * 0.6
  const lx = cx + labelR * Math.cos(midAngle)
  const ly = cy + labelR * Math.sin(midAngle)

  const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`

  return (
    <g className="group/slice cursor-pointer">
      <path d={path} fill={color} stroke="white" strokeWidth="3" className="transition-all duration-200 hover:opacity-90" />
      <text x={lx} y={ly - 8} textAnchor="middle" className="text-2xl pointer-events-none" fill="white">
        {emoji}
      </text>
      <text x={lx} y={ly + 14} textAnchor="middle" className="text-[11px] font-bold pointer-events-none fill-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
        {label}
      </text>
      <text x={lx} y={ly + 28} textAnchor="middle" className="text-[10px] font-medium pointer-events-none fill-white/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
        {percent}%
      </text>
    </g>
  )
}

function MealTab({ mealType, ideas }: { mealType: string; ideas: MealIdea[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {ideas.map((idea) => (
        <div
          key={idea.name}
          className="ocean-card rounded-xl p-4 hover:scale-[1.02] transition-transform duration-200"
        >
          <div className="flex items-start gap-3">
            <span className="text-3xl flex-shrink-0" aria-hidden="true">{idea.emoji}</span>
            <div>
              <h4 className="font-bold text-sm sm:text-base text-foreground">{idea.name}</h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{idea.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function NutritionPage() {
  const [activeMealTab, setActiveMealTab] = useState<string>('Breakfast')
  const [mealInput, setMealInput] = useState('')
  const [aiResponse, setAiResponse] = useState<string | null>(null)

  const mealTabs = ['Breakfast', 'Lunch', 'Dinner'] as const

  function handleCheckMeal() {
    if (!mealInput.trim()) return
    setAiResponse(
      `\ud83d\ude80 Coming soon \u2014 Wally will analyze "${mealInput}" and tell you exactly what nutrients you're getting! Stay tuned for our AI-powered meal analysis.`
    )
  }

  return (
    <div className="space-y-10 sm:space-y-12 pb-12">
      {/* ============================================================ */}
      {/*  Hero Header                                                  */}
      {/* ============================================================ */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-400/20 via-yellow-300/10 to-orange-400/15 dark:from-green-600/20 dark:via-yellow-500/10 dark:to-orange-500/15 p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 sm:gap-4 mb-3">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-green-500/15 dark:bg-green-400/15">
              <Apple className="h-6 w-6 sm:h-7 sm:w-7 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                {'\ud83c\udf4e'} Food Pyramid & Nutrition {'\ud83e\udd66'}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Learn what to eat, how much, and why it matters for your health!
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {['\ud83c\udf4e Fruits', '\ud83e\udd66 Veggies', '\ud83c\udf57 Protein', '\ud83e\udd5b Dairy', '\ud83c\udf3e Grains'].map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-white/50 dark:bg-white/10 px-3 py-1 text-xs sm:text-sm font-medium border border-white/30 dark:border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  A. Food Pyramid                                              */}
      {/* ============================================================ */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl sm:text-3xl" aria-hidden="true">{'\ud83c\udfd4\ufe0f'}</span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">The Food Pyramid</h2>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-2xl">
          The food pyramid shows you how much of each food group to eat every day.
          The <strong>bottom</strong> is what you should eat <strong>most</strong> of, and the <strong>top</strong> is what you should eat <strong>least</strong> of.
          Click any tier to learn more! {'\ud83d\udc47'}
        </p>

        <div className="flex flex-col items-center gap-2 sm:gap-3 w-full max-w-3xl mx-auto">
          {PYRAMID_TIERS.map((tier, i) => (
            <PyramidTierRow key={tier.id} tier={tier} index={i} />
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  B. Daily Plate Guide                                         */}
      {/* ============================================================ */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl sm:text-3xl" aria-hidden="true">{'\ud83c\udf7d\ufe0f'}</span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Your Daily Plate</h2>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-2xl">
          Imagine your plate divided into sections. Here is how much of each food group should fill your plate at every meal!
        </p>

        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* SVG Plate */}
          <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] flex-shrink-0">
            <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-xl">
              {/* Plate ring */}
              <circle cx="150" cy="150" r="148" fill="none" stroke="currentColor" strokeWidth="4" className="text-border" />
              <PlateSection emoji={'\ud83e\udd6c'} label="Vegetables" percent={30} startAngle={0} color="#22c55e" />
              <PlateSection emoji={'\ud83c\udf3e'} label="Grains" percent={30} startAngle={108} color="#d97706" />
              <PlateSection emoji={'\ud83c\udf57'} label="Protein" percent={20} startAngle={216} color="#ef4444" />
              <PlateSection emoji={'\ud83c\udf4e'} label="Fruits" percent={20} startAngle={288} color="#a855f7" />
            </svg>

            {/* Dairy circle */}
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-400 border-4 border-white dark:border-gray-800 shadow-lg flex flex-col items-center justify-center">
              <span className="text-lg sm:text-xl" aria-hidden="true">{'\ud83e\udd5b'}</span>
              <span className="text-[9px] sm:text-[10px] font-bold text-white drop-shadow">Dairy</span>
            </div>
          </div>

          {/* Plate tips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 min-w-0">
            {[
              { emoji: '\ud83e\udd6c', title: 'Vegetables (30%)', tip: 'Fill almost a third of your plate with veggies. The more colors, the better!' },
              { emoji: '\ud83c\udf3e', title: 'Grains (30%)', tip: 'Another third should be whole grains like brown rice, oats, or whole wheat bread.' },
              { emoji: '\ud83c\udf57', title: 'Protein (20%)', tip: 'A smaller section for lean meats, fish, beans, or tofu.' },
              { emoji: '\ud83c\udf4e', title: 'Fruits (20%)', tip: 'Round out the plate with fresh or frozen fruits.' },
              { emoji: '\ud83e\udd5b', title: 'Dairy (side)', tip: 'A glass of milk, cup of yogurt, or serving of cheese on the side.' },
            ].map((item) => (
              <div key={item.title} className="ocean-card rounded-xl p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl" aria-hidden="true">{item.emoji}</span>
                  <h4 className="font-bold text-sm sm:text-base text-foreground">{item.title}</h4>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">{item.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  C. Quick Nutrition Facts                                     */}
      {/* ============================================================ */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl sm:text-3xl" aria-hidden="true">{'\ud83d\udcca'}</span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Quick Nutrition Facts</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {NUTRITION_FACTS.map((fact) => (
            <div
              key={fact.title}
              className={`ocean-card rounded-xl p-5 border bg-gradient-to-br ${fact.color} hover:scale-[1.02] transition-transform duration-200`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl sm:text-4xl" aria-hidden="true">{fact.emoji}</span>
                <h3 className="font-bold text-base sm:text-lg text-foreground">{fact.title}</h3>
              </div>
              <p className="text-sm sm:text-base text-foreground/80">{fact.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  D. Meal Ideas                                                */}
      {/* ============================================================ */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl sm:text-3xl" aria-hidden="true">{'\ud83c\udf73'}</span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Healthy Meal Ideas</h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {mealTabs.map((tab) => {
            const tabEmoji = tab === 'Breakfast' ? '\u2600\ufe0f' : tab === 'Lunch' ? '\ud83c\udf1e' : '\ud83c\udf19'
            return (
              <button
                key={tab}
                onClick={() => setActiveMealTab(tab)}
                className={`
                  px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-all duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFFF] focus-visible:ring-offset-2
                  ${
                    activeMealTab === tab
                      ? 'btn-chrome-3d-green text-white shadow-lg'
                      : 'ocean-card hover:scale-105 text-foreground'
                  }
                `}
              >
                {tabEmoji} {tab}
              </button>
            )
          })}
        </div>

        <MealTab mealType={activeMealTab} ideas={MEAL_IDEAS[activeMealTab]} />
      </section>

      {/* ============================================================ */}
      {/*  E. AI Nutrition Helper                                       */}
      {/* ============================================================ */}
      <section>
        <div className="ocean-card rounded-2xl p-6 sm:p-8 border-2 border-[#33FF33]/30 dark:border-[#33FF33]/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#33FF33]/15">
              <Sparkles className="h-6 w-6 text-[#33FF33]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {'\ud83e\udd16'} Ask Wally About Your Meal!
              </h2>
              <p className="text-sm text-muted-foreground">
                Type what you are about to eat and Wally will check its nutritional value.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <input
              type="text"
              value={mealInput}
              onChange={(e) => setMealInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCheckMeal() }}
              placeholder='e.g. "2 eggs, toast with butter, and orange juice"'
              className="flex-1 rounded-xl border border-border bg-background py-3 px-4 text-sm sm:text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#33FF33]/50"
              aria-label="Describe your meal"
            />
            <button
              onClick={handleCheckMeal}
              className="btn-chrome-3d-green px-6 py-3 rounded-xl font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 transition-all duration-200"
            >
              <Send className="h-4 w-4" />
              Check My Meal
            </button>
          </div>

          {aiResponse && (
            <div className="mt-4 rounded-xl bg-[#33FF33]/10 dark:bg-[#33FF33]/5 border border-[#33FF33]/20 p-4">
              <p className="text-sm sm:text-base text-foreground/90">{aiResponse}</p>
            </div>
          )}

          {!aiResponse && (
            <p className="mt-4 text-xs sm:text-sm text-muted-foreground italic">
              {'\ud83d\udee0\ufe0f'} Coming soon \u2014 Wally will analyze your meal&apos;s nutritional value with AI-powered insights!
            </p>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Fun Footer Fact                                              */}
      {/* ============================================================ */}
      <div className="text-center py-6">
        <p className="text-base sm:text-lg text-muted-foreground">
          {'\ud83c\udf1f'} <strong>Remember:</strong> There are no &quot;bad&quot; foods \u2014 just eat a balanced variety!
          Your body is amazing, and it needs lots of different nutrients to thrive. {'\ud83d\udcaa\ud83c\udf08'}
        </p>
      </div>
    </div>
  )
}
