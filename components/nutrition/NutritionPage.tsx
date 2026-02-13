'use client'

import { useState } from 'react'
import { Apple, ChevronDown, ChevronUp, Droplets, Send, Sparkles, Users, UtensilsCrossed, Brain } from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Data — Canada's Food Guide (2019)                                  */
/* ------------------------------------------------------------------ */

interface PlateGroup {
  id: string
  emoji: string
  label: string
  proportion: string
  color: string
  colorDark: string
  borderColor: string
  fillColor: string
  foods: string[]
  tip: string
}

const PLATE_GROUPS: PlateGroup[] = [
  {
    id: 'vegetables-fruits',
    emoji: '\ud83e\udd66\ud83c\udf4e\ud83e\udd55\ud83c\udf53',
    label: 'Vegetables & Fruits',
    proportion: 'Half your plate',
    color: 'from-green-400 to-emerald-500',
    colorDark: 'dark:from-green-600 dark:to-emerald-700',
    borderColor: 'border-green-400 dark:border-green-600',
    fillColor: '#22c55e',
    foods: [
      '\ud83e\udd66 Broccoli', '\ud83e\udd55 Carrots', '\ud83c\udf4e Apples', '\ud83c\udf53 Strawberries',
      '\ud83e\udd6c Spinach', '\ud83c\udf45 Tomatoes', '\ud83c\udf47 Grapes', '\ud83c\udf4a Oranges',
      '\ud83c\udf49 Watermelon', '\ud83e\udd54 Sweet Potatoes', '\ud83e\udd6d Mangoes', '\ud83c\udf4c Bananas',
      '\ud83e\uded1 Bell Peppers', '\ud83e\udd52 Cucumbers', '\ud83c\udf51 Peaches', '\ud83e\uded0 Blueberries',
    ],
    tip: 'Vegetables and fruits should fill half your plate at every meal. Choose plenty of colourful options \u2014 fresh, frozen, or canned all count!',
  },
  {
    id: 'whole-grains',
    emoji: '\ud83c\udf5e\ud83c\udf3e\ud83c\udf5a',
    label: 'Whole Grain Foods',
    proportion: 'Quarter of your plate',
    color: 'from-amber-400 to-amber-600',
    colorDark: 'dark:from-amber-600 dark:to-amber-800',
    borderColor: 'border-amber-500 dark:border-amber-600',
    fillColor: '#d97706',
    foods: [
      '\ud83c\udf5e Whole Wheat Bread', '\ud83c\udf5a Brown Rice', '\ud83e\udd63 Oatmeal', '\ud83c\udf3e Quinoa',
      '\ud83c\udf5d Whole Wheat Pasta', '\ud83c\udf3d Corn', '\ud83e\uded3 Whole Grain Tortilla',
      '\ud83e\udd42 Whole Grain Cereal', '\ud83e\udd56 Barley', '\ud83c\udf5e Wild Rice',
    ],
    tip: 'Choose whole grain foods instead of refined grains. They have more fibre and help you feel full longer. Look for "whole grain" as the first ingredient!',
  },
  {
    id: 'protein',
    emoji: '\ud83c\udf57\ud83d\udc1f\ud83e\uded8\ud83e\udd5c',
    label: 'Protein Foods',
    proportion: 'Quarter of your plate',
    color: 'from-rose-400 to-red-500',
    colorDark: 'dark:from-rose-600 dark:to-red-700',
    borderColor: 'border-rose-400 dark:border-rose-600',
    fillColor: '#e11d48',
    foods: [
      '\ud83e\uded8 Beans & Lentils', '\ud83e\udd5c Nuts & Seeds', '\ud83c\udf2d Tofu',
      '\ud83d\udc1f Fish & Shellfish', '\ud83c\udf57 Chicken & Turkey', '\ud83e\udd5a Eggs',
      '\ud83e\udd69 Lean Beef', '\ud83e\uddc0 Lower-fat Cheese', '\ud83e\ude98 Yogurt (plain)',
      '\ud83e\udd53 Tempeh',
    ],
    tip: 'Choose protein foods that come from plants more often. Plant-based proteins provide more fibre and less saturated fat. Mix it up with both plant and animal sources!',
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
    description: 'Make water your drink of choice \u2014 it quenches thirst without added sugars or calories.',
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
    description: 'Builds muscles and repairs cells. Choose plant-based protein more often.',
    color: 'from-rose-400/20 to-pink-400/20 border-rose-400/30',
  },
  {
    emoji: '\ud83c\udf3e',
    title: 'Fibre',
    description: 'Keeps digestion healthy \u2014 whole grains, veggies, and beans are great sources.',
    color: 'from-amber-400/20 to-yellow-400/20 border-amber-400/30',
  },
  {
    emoji: '\ud83e\uddb4',
    title: 'Calcium',
    description: 'Strong bones & teeth \u2014 found in fortified plant drinks, dairy, and dark leafy greens.',
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
    { emoji: '\ud83e\udd63', name: 'Oatmeal Power Bowl', description: 'Oats + banana + almonds + cinnamon = energy boost!' },
    { emoji: '\ud83e\udd5a', name: 'Scrambled Eggs & Toast', description: 'Protein-packed start with whole wheat toast and veggies' },
    { emoji: '\ud83c\udf53', name: 'Yogurt Parfait', description: 'Layer plain yogurt, granola, and fresh fruit' },
    { emoji: '\ud83e\udd64', name: 'Fruit Smoothie', description: 'Blend spinach, banana, berries & water \u2014 can\u2019t taste the greens!' },
  ],
  Lunch: [
    { emoji: '\ud83e\udd6a', name: 'Turkey & Veggie Wrap', description: 'Whole wheat wrap with turkey, lettuce, tomato & hummus' },
    { emoji: '\ud83e\udd57', name: 'Rainbow Salad', description: 'Mixed greens with colourful veggies, chickpeas & light dressing' },
    { emoji: '\ud83c\udf5c', name: 'Veggie Noodle Soup', description: 'Warm broth with noodles, carrots, peas & chicken' },
    { emoji: '\ud83c\udf2f', name: 'Bean Burrito Bowl', description: 'Brown rice, beans, salsa, corn & avocado \u2014 no tortilla needed!' },
    { emoji: '\ud83e\uded8', name: 'Lentil Soup & Bread', description: 'Hearty lentil soup with a slice of whole grain bread' },
  ],
  Dinner: [
    { emoji: '\ud83c\udf57', name: 'Baked Chicken & Veggies', description: 'Seasoned chicken with roasted broccoli & sweet potato' },
    { emoji: '\ud83d\udc1f', name: 'Fish Tacos', description: 'Grilled fish in corn tortillas with cabbage slaw' },
    { emoji: '\ud83c\udf5d', name: 'Pasta Primavera', description: 'Whole wheat pasta loaded with colourful vegetables' },
    { emoji: '\ud83c\udf72', name: 'Hearty Veggie Stew', description: 'Potatoes, carrots, beans & herbs in a warm broth' },
    { emoji: '\ud83c\udf5b', name: 'Stir-Fry Rice Bowl', description: 'Brown rice with tofu, peppers, snap peas & soy sauce' },
  ],
}

interface FoodGuideHabit {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function PlateGroupCard({ group }: { group: PlateGroup }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="flex flex-col w-full">
      <button
        onClick={() => setExpanded(!expanded)}
        className="group relative w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFFF] focus-visible:ring-offset-2 rounded-xl"
        aria-expanded={expanded}
        aria-label={`${group.label} \u2014 ${group.proportion}. Click to ${expanded ? 'collapse' : 'expand'} details.`}
      >
        <div
          className={`
            relative overflow-hidden rounded-xl border-2 ${group.borderColor}
            bg-gradient-to-r ${group.color} ${group.colorDark}
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
              <span className="text-xl sm:text-2xl flex-shrink-0" aria-hidden="true">{group.emoji}</span>
              <div className="min-w-0">
                <h3 className="font-bold text-sm sm:text-base lg:text-lg leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  {group.label}
                </h3>
                <p className="text-xs sm:text-sm opacity-90 drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
                  {group.proportion}
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
            border ${group.borderColor}
            animate-in slide-in-from-top-2 fade-in duration-300
          `}
        >
          <p className="text-sm sm:text-base text-foreground/80 mb-3 italic">
            {'\ud83d\udca1'} {group.tip}
          </p>
          <div className="flex flex-wrap gap-2">
            {group.foods.map((food) => (
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

  const FOOD_GUIDE_HABITS: FoodGuideHabit[] = [
    {
      icon: <UtensilsCrossed className="h-6 w-6 text-orange-500 dark:text-orange-400" />,
      title: 'Cook more often',
      description: 'Cooking at home lets you control what goes into your food. Try new recipes and make it fun!',
      color: 'from-orange-400/20 to-amber-400/20 border-orange-400/30',
    },
    {
      icon: <Users className="h-6 w-6 text-blue-500 dark:text-blue-400" />,
      title: 'Eat meals with others',
      description: 'Sharing meals with family or friends creates connection and helps you enjoy food more.',
      color: 'from-blue-400/20 to-sky-400/20 border-blue-400/30',
    },
    {
      icon: <Brain className="h-6 w-6 text-purple-500 dark:text-purple-400" />,
      title: 'Be mindful of your eating habits',
      description: 'Take time to eat. Notice when you are hungry and when you are full. Enjoy each bite!',
      color: 'from-purple-400/20 to-violet-400/20 border-purple-400/30',
    },
    {
      icon: <Droplets className="h-6 w-6 text-cyan-500 dark:text-cyan-400" />,
      title: 'Make water your drink of choice',
      description: 'Water is the best way to stay hydrated \u2014 no added sugar, no calories, and it keeps your body running smoothly.',
      color: 'from-cyan-400/20 to-blue-400/20 border-cyan-400/30',
    },
  ]

  function handleCheckMeal() {
    if (!mealInput.trim()) return
    setAiResponse(
      `\ud83d\ude80 Coming soon \u2014 AI Tutor will analyze "${mealInput}" and tell you exactly what nutrients you're getting! Stay tuned for our AI-powered meal analysis.`
    )
  }

  return (
    <div className="space-y-10 sm:space-y-12 pb-12 overflow-x-hidden max-w-full">
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
                {'\ud83c\udf4e'} Canada&apos;s Food Guide {'\ud83e\udd66'}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Learn about healthy eating with Canada&apos;s Food Guide \u2014 what to eat, how much, and healthy habits!
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {['\ud83e\udd66 Vegetables & Fruits', '\ud83c\udf3e Whole Grains', '\ud83c\udf57 Protein Foods', '\ud83d\udca7 Water'].map((tag) => (
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
      {/*  A. Canada's Food Guide Plate                                 */}
      {/* ============================================================ */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl sm:text-3xl" aria-hidden="true">{'\ud83c\udf7d\ufe0f'}</span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Canada&apos;s Food Guide Plate</h2>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-2xl">
          In 2019, Canada replaced the old food pyramid with the <strong>Eat Well Plate</strong>. Fill half your plate with
          <strong> vegetables and fruits</strong>, a quarter with <strong>whole grain foods</strong>, and a quarter with
          <strong> protein foods</strong>. Make <strong>water</strong> your drink of choice! Click each food group below to explore. {'\ud83d\udc47'}
        </p>

        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* SVG Plate — Canada's Food Guide proportions */}
          <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] flex-shrink-0">
            <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-xl">
              {/* Plate ring */}
              <circle cx="150" cy="150" r="148" fill="none" stroke="currentColor" strokeWidth="4" className="text-border" />
              {/* Half plate: Vegetables & Fruits (50%) */}
              <PlateSection emoji={'\ud83e\udd66\ud83c\udf4e'} label="Vegetables & Fruits" percent={50} startAngle={0} color="#22c55e" />
              {/* Quarter plate: Whole Grain Foods (25%) */}
              <PlateSection emoji={'\ud83c\udf3e'} label="Whole Grains" percent={25} startAngle={180} color="#d97706" />
              {/* Quarter plate: Protein Foods (25%) */}
              <PlateSection emoji={'\ud83c\udf57'} label="Protein Foods" percent={25} startAngle={270} color="#e11d48" />
            </svg>

            {/* Water glass icon */}
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500 border-4 border-white dark:border-gray-800 shadow-lg flex flex-col items-center justify-center">
              <Droplets className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              <span className="text-[9px] sm:text-[10px] font-bold text-white drop-shadow mt-0.5">Water</span>
            </div>
          </div>

          {/* Plate group descriptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 min-w-0">
            {[
              { emoji: '\ud83e\udd66\ud83c\udf4e', title: 'Vegetables & Fruits (50%)', tip: 'Fill half your plate! The more variety and colour, the better. Fresh, frozen, or canned all count.' },
              { emoji: '\ud83c\udf3e', title: 'Whole Grain Foods (25%)', tip: 'Choose whole grains like brown rice, oats, quinoa, and whole wheat bread for energy and fibre.' },
              { emoji: '\ud83c\udf57', title: 'Protein Foods (25%)', tip: 'Choose plant-based proteins like beans, lentils, nuts, and tofu more often. Fish, eggs, and lean meats are great too.' },
              { emoji: '\ud83d\udca7', title: 'Water (drink of choice)', tip: 'Make water your go-to drink. It has zero sugar and keeps your body hydrated and running well.' },
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
      {/*  B. Explore Food Groups                                       */}
      {/* ============================================================ */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl sm:text-3xl" aria-hidden="true">{'\ud83d\udd0d'}</span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Explore the Food Groups</h2>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-2xl">
          Click on each food group to discover the foods that belong to it and helpful tips from Canada&apos;s Food Guide.
        </p>

        <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-3xl mx-auto">
          {PLATE_GROUPS.map((group) => (
            <PlateGroupCard key={group.id} group={group} />
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  C. Healthy Eating Habits                                     */}
      {/* ============================================================ */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl sm:text-3xl" aria-hidden="true">{'\ud83c\udf1f'}</span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Healthy Eating Habits</h2>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-2xl">
          Canada&apos;s Food Guide is not just about <em>what</em> you eat \u2014 it is also about <em>how</em> you eat. These habits help you build a healthy relationship with food.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FOOD_GUIDE_HABITS.map((habit) => (
            <div
              key={habit.title}
              className={`ocean-card rounded-xl p-5 border bg-gradient-to-br ${habit.color} hover:scale-[1.02] transition-transform duration-200`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/50 dark:bg-white/10 border border-border/30">
                  {habit.icon}
                </div>
                <h3 className="font-bold text-base sm:text-lg text-foreground">{habit.title}</h3>
              </div>
              <p className="text-sm sm:text-base text-foreground/80">{habit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  D. Quick Nutrition Facts                                     */}
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
      {/*  E. Meal Ideas                                                */}
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
      {/*  F. AI Nutrition Helper                                       */}
      {/* ============================================================ */}
      <section>
        <div className="ocean-card rounded-2xl p-6 sm:p-8 border-2 border-[#33FF33]/30 dark:border-[#33FF33]/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#33FF33]/15">
              <Sparkles className="h-6 w-6 text-[#33FF33]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {'\ud83e\udd16'} Ask AI Tutor About Your Meal!
              </h2>
              <p className="text-sm text-muted-foreground">
                Type what you are about to eat and AI Tutor will check its nutritional value.
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
              {'\ud83d\udee0\ufe0f'} Coming soon \u2014 AI Tutor will analyze your meal&apos;s nutritional value with AI-powered insights!
            </p>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Fun Footer Fact                                              */}
      {/* ============================================================ */}
      <div className="text-center py-6">
        <p className="text-base sm:text-lg text-muted-foreground">
          {'\ud83c\udf1f'} <strong>Remember:</strong> Healthy eating is about what you eat <em>and</em> how you eat.
          Cook more, eat with others, enjoy your food, and make water your drink of choice! {'\ud83d\udcaa\ud83d\udca7'}
        </p>
      </div>
    </div>
  )
}
