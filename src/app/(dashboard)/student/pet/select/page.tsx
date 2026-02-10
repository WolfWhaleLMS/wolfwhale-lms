'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Check,
  PenLine,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { PetDisplay } from '@/components/gamification/PetDisplay';
import {
  SPECIES_VISUALS,
  FAMILY_CONFIG,
  getAllSpecies,
} from '@/lib/pet-visuals';
import {
  QUIZ_QUESTIONS,
  getQuizRecommendations,
  savePetToStorage,
  type MockPetState,
} from '@/lib/mock-pet-data';
import type { PetSpecies } from '@/types/database.types';

/* ------------------------------------------------------------------ */
/*  Steps                                                              */
/* ------------------------------------------------------------------ */

type Step = 'quiz' | 'preview' | 'confirm';

const STEPS: { id: Step; label: string; emoji: string }[] = [
  { id: 'quiz', label: 'Discover', emoji: '🔮' },
  { id: 'preview', label: 'Choose', emoji: '👀' },
  { id: 'confirm', label: 'Name', emoji: '✏️' },
];

/* ------------------------------------------------------------------ */
/*  Animation Variants                                                 */
/* ------------------------------------------------------------------ */

const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function PetSelectPage() {
  const router = useRouter();

  // Navigation state
  const [currentStep, setCurrentStep] = useState<Step>('quiz');
  const [direction, setDirection] = useState(1);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Preview state
  const [selectedSpecies, setSelectedSpecies] = useState<PetSpecies | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [filterFamily, setFilterFamily] = useState<'all' | 'wolf' | 'whale' | 'hybrid'>('all');

  // Confirm state
  const [petName, setPetName] = useState('');
  const [nameError, setNameError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Derived
  const recommendations = useMemo(
    () => getQuizRecommendations(quizAnswers),
    [quizAnswers]
  );

  const allSpecies = useMemo(() => getAllSpecies(), []);

  const filteredSpecies = useMemo(() => {
    if (filterFamily === 'all') return allSpecies;
    return allSpecies.filter((s) => SPECIES_VISUALS[s].family === filterFamily);
  }, [allSpecies, filterFamily]);

  const stepIndex = STEPS.findIndex((s) => s.id === currentStep);

  /* ---------------------------------------------------------------- */
  /*  Navigation                                                       */
  /* ---------------------------------------------------------------- */

  const goToStep = useCallback(
    (step: Step) => {
      const newIndex = STEPS.findIndex((s) => s.id === step);
      setDirection(newIndex > stepIndex ? 1 : -1);
      setCurrentStep(step);
    },
    [stepIndex]
  );

  /* ---------------------------------------------------------------- */
  /*  Quiz Logic                                                       */
  /* ---------------------------------------------------------------- */

  const handleQuizAnswer = (questionId: string, optionId: string) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionId }));

    // Auto-advance to next question or to preview
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 400);
    } else {
      // All questions answered, move to preview after a moment
      setTimeout(() => goToStep('preview'), 600);
    }
  };

  /* ---------------------------------------------------------------- */
  /*  Confirm Logic                                                    */
  /* ---------------------------------------------------------------- */

  const validateName = (name: string): string => {
    if (name.trim().length === 0) return 'Please give your pet a name!';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    if (name.trim().length > 20) return 'Name must be 20 characters or less';
    if (!/^[a-zA-Z0-9\s]+$/.test(name.trim()))
      return 'Only letters, numbers, and spaces allowed';
    return '';
  };

  const handleConfirm = async () => {
    if (!selectedSpecies) return;

    const error = validateName(petName);
    if (error) {
      setNameError(error);
      return;
    }

    setIsSaving(true);

    // Save to localStorage
    const pet: MockPetState = {
      id: `pet-${Date.now()}`,
      name: petName.trim(),
      species: selectedSpecies,
      stage: 'hatchling',
      happiness: 80,
      energy: 100,
      knowledge: 10,
      health: 100,
      totalXP: 0,
      equippedItems: [],
      createdAt: new Date().toISOString(),
    };

    // Simulate a brief delay for feel
    await new Promise((r) => setTimeout(r, 800));
    savePetToStorage(pet);

    setIsSaving(false);
    router.push('/pet');
  };

  /* ---------------------------------------------------------------- */
  /*  Render: Step Indicator                                           */
  /* ---------------------------------------------------------------- */

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map((step, i) => {
        const isActive = step.id === currentStep;
        const isPassed = i < stepIndex;

        return (
          <React.Fragment key={step.id}>
            {i > 0 && (
              <div
                className={`h-0.5 w-8 rounded-full transition-colors ${
                  isPassed ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
            )}
            <motion.div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : isPassed
                    ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
              animate={isActive ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span>{step.emoji}</span>
              <span className="hidden sm:inline">{step.label}</span>
            </motion.div>
          </React.Fragment>
        );
      })}
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  Render: Quiz Step                                                */
  /* ---------------------------------------------------------------- */

  const renderQuiz = () => {
    const question = QUIZ_QUESTIONS[currentQuestion];
    const selectedOption = quizAnswers[question.id];

    return (
      <motion.div
        key="quiz"
        custom={direction}
        variants={pageVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-3">
          <motion.div
            className="text-6xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {question.emoji}
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {question.question}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
          </p>
        </div>

        {/* Question dots */}
        <div className="flex justify-center gap-2">
          {QUIZ_QUESTIONS.map((q, i) => (
            <div
              key={q.id}
              className={`h-2 rounded-full transition-all ${
                i === currentQuestion
                  ? 'w-8 bg-indigo-500'
                  : i < currentQuestion
                    ? 'w-2 bg-indigo-400'
                    : 'w-2 bg-slate-300 dark:bg-slate-600'
              }`}
            />
          ))}
        </div>

        {/* Options */}
        <div className="grid gap-4 max-w-lg mx-auto">
          {question.options.map((option, idx) => {
            const isSelected = selectedOption === option.id;

            return (
              <motion.button
                key={option.id}
                onClick={() => handleQuizAnswer(question.id, option.id)}
                className={`relative p-5 rounded-2xl border-2 text-left transition-all ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-lg shadow-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 hover:shadow-md'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl flex-shrink-0">{option.emoji}</span>
                  <span className="text-base font-medium text-slate-800 dark:text-slate-200">
                    {option.text}
                  </span>
                  {isSelected && (
                    <motion.div
                      className="ml-auto flex-shrink-0"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <Check className="w-5 h-5 text-indigo-600" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Skip quiz link */}
        <div className="text-center">
          <button
            onClick={() => goToStep('preview')}
            className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline underline-offset-4"
          >
            Skip quiz and browse all pets
          </button>
        </div>
      </motion.div>
    );
  };

  /* ---------------------------------------------------------------- */
  /*  Render: Preview / Carousel Step                                  */
  /* ---------------------------------------------------------------- */

  const renderPreview = () => {
    const visibleSpecies = filteredSpecies;
    const currentSpecies = visibleSpecies[previewIndex] || visibleSpecies[0];
    const currentVis = currentSpecies ? SPECIES_VISUALS[currentSpecies] : null;
    const isRecommended = recommendations.includes(currentSpecies);

    return (
      <motion.div
        key="preview"
        custom={direction}
        variants={pageVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Choose Your Pet!
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {recommendations.length > 0
              ? 'We highlighted some pets based on your quiz answers!'
              : 'Browse all 11 amazing species'}
          </p>
        </div>

        {/* Family Filter Tabs */}
        <div className="flex justify-center gap-2 flex-wrap">
          {(['all', 'wolf', 'whale', 'hybrid'] as const).map((fam) => (
            <Button
              key={fam}
              variant={filterFamily === fam ? 'default' : 'secondary'}
              size="sm"
              onClick={() => {
                setFilterFamily(fam);
                setPreviewIndex(0);
              }}
              className="capitalize"
            >
              {fam === 'all'
                ? 'All (11)'
                : `${FAMILY_CONFIG[fam].emoji} ${FAMILY_CONFIG[fam].label}s`}
            </Button>
          ))}
        </div>

        {/* Carousel */}
        {currentVis && currentSpecies && (
          <div className="relative">
            {/* Navigation Arrows */}
            <button
              onClick={() =>
                setPreviewIndex(
                  (prev) => (prev - 1 + visibleSpecies.length) % visibleSpecies.length
                )
              }
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 shadow-lg hover:bg-white dark:hover:bg-slate-700 transition-colors"
              aria-label="Previous pet"
            >
              <ChevronLeft className="w-6 h-6 text-slate-700 dark:text-slate-200" />
            </button>
            <button
              onClick={() =>
                setPreviewIndex((prev) => (prev + 1) % visibleSpecies.length)
              }
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 shadow-lg hover:bg-white dark:hover:bg-slate-700 transition-colors"
              aria-label="Next pet"
            >
              <ChevronRight className="w-6 h-6 text-slate-700 dark:text-slate-200" />
            </button>

            {/* Main Card */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentSpecies}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  variant="pet"
                  className={`mx-10 sm:mx-16 overflow-hidden ${
                    selectedSpecies === currentSpecies
                      ? 'ring-4 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900'
                      : ''
                  }`}
                >
                  <CardContent className="p-6 sm:p-8">
                    {/* Recommended badge */}
                    {isRecommended && (
                      <div className="flex justify-center mb-3">
                        <Badge variant="achievement" size="lg" className="animate-none">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Recommended for You!
                        </Badge>
                      </div>
                    )}

                    {/* Pet Preview */}
                    <div className="flex justify-center mb-5">
                      <PetDisplay
                        species={currentSpecies}
                        stage="juvenile"
                        name={currentVis.label}
                        happiness={80}
                        energy={80}
                        size="lg"
                        showName={false}
                        showStage={false}
                        interactive={true}
                      />
                    </div>

                    {/* Species Info */}
                    <div className="text-center space-y-3">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {currentVis.label}
                      </h3>

                      {/* Family tag */}
                      <div className="flex justify-center">
                        <Badge
                          className={`${FAMILY_CONFIG[currentVis.family].bgColor} ${FAMILY_CONFIG[currentVis.family].borderColor} ${FAMILY_CONFIG[currentVis.family].color} border`}
                        >
                          {FAMILY_CONFIG[currentVis.family].emoji}{' '}
                          {FAMILY_CONFIG[currentVis.family].label}
                        </Badge>
                      </div>

                      <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                        {currentVis.description}
                      </p>

                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 italic">
                        &quot;{currentVis.tagline}&quot;
                      </p>

                      {/* Traits */}
                      <div className="flex justify-center gap-2 flex-wrap">
                        {currentVis.traits.map((trait) => (
                          <span
                            key={trait}
                            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>

                      {/* Select Button */}
                      <Button
                        onClick={() => {
                          setSelectedSpecies(currentSpecies);
                        }}
                        className={`w-full max-w-xs mx-auto mt-4 h-12 rounded-2xl font-bold text-base ${
                          selectedSpecies === currentSpecies
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                        } text-white shadow-lg`}
                      >
                        {selectedSpecies === currentSpecies ? (
                          <>
                            <Check className="w-5 h-5 mr-2" /> Selected!
                          </>
                        ) : (
                          'Choose This Pet'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Carousel dots */}
            <div className="flex justify-center gap-1.5 mt-4 flex-wrap">
              {visibleSpecies.map((sp, i) => {
                const isRec = recommendations.includes(sp);
                return (
                  <button
                    key={sp}
                    onClick={() => setPreviewIndex(i)}
                    className={`h-2.5 rounded-full transition-all ${
                      i === previewIndex
                        ? 'w-7 bg-indigo-500'
                        : isRec
                          ? 'w-2.5 bg-indigo-300'
                          : 'w-2.5 bg-slate-300 dark:bg-slate-600'
                    }`}
                    aria-label={SPECIES_VISUALS[sp].label}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Continue / Back */}
        <div className="flex justify-between max-w-lg mx-auto">
          <Button variant="ghost" onClick={() => goToStep('quiz')}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Quiz
          </Button>
          <Button
            onClick={() => goToStep('confirm')}
            disabled={!selectedSpecies}
            className="bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </motion.div>
    );
  };

  /* ---------------------------------------------------------------- */
  /*  Render: Confirm & Name Step                                      */
  /* ---------------------------------------------------------------- */

  const renderConfirm = () => {
    if (!selectedSpecies) return null;
    const vis = SPECIES_VISUALS[selectedSpecies];

    return (
      <motion.div
        key="confirm"
        custom={direction}
        variants={pageVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="space-y-8 max-w-lg mx-auto"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Name Your Pet!
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Give your {vis.label} a special name
          </p>
        </div>

        {/* Pet Preview */}
        <div className="flex justify-center">
          <PetDisplay
            species={selectedSpecies}
            stage="hatchling"
            name={petName || '???'}
            happiness={100}
            energy={100}
            size="lg"
            showName={true}
            showStage={true}
            interactive={true}
          />
        </div>

        {/* Name Input */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <PenLine className="w-5 h-5 text-indigo-500" />
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Pet Name
              </h3>
            </div>

            <Input
              value={petName}
              onChange={(e) => {
                setPetName(e.target.value);
                setNameError('');
              }}
              placeholder="Type a name for your pet..."
              className="text-lg h-14 text-center font-semibold"
              maxLength={20}
              error={nameError}
            />

            <p className="text-xs text-slate-400 text-center">
              {petName.length}/20 characters
            </p>

            {/* Quick name suggestions */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Need ideas? Try one of these:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {getNameSuggestions(selectedSpecies).map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setPetName(suggestion);
                      setNameError('');
                    }}
                    className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={() => goToStep('preview')}
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Change Pet
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!petName.trim() || isSaving}
            isLoading={isSaving}
            className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-base font-bold shadow-lg shadow-indigo-500/30"
          >
            {isSaving ? 'Hatching...' : "Let's Go!"}
            {!isSaving && <Sparkles className="w-5 h-5 ml-2" />}
          </Button>
        </div>
      </motion.div>
    );
  };

  /* ---------------------------------------------------------------- */
  /*  Main Render                                                      */
  /* ---------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950 p-4 sm:p-8">
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-indigo-300/20 to-transparent rounded-full blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tl from-purple-300/20 to-transparent rounded-full blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-pink-300/10 to-cyan-300/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      <div className="relative max-w-2xl mx-auto">
        {/* Title */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
            Choose Your Pet Companion
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Your pet will grow with you as you learn!
          </p>
        </motion.div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Step Content */}
        <AnimatePresence mode="wait" custom={direction}>
          {currentStep === 'quiz' && renderQuiz()}
          {currentStep === 'preview' && renderPreview()}
          {currentStep === 'confirm' && renderConfirm()}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Name Suggestions                                                   */
/* ------------------------------------------------------------------ */

function getNameSuggestions(species: PetSpecies): string[] {
  const vis = SPECIES_VISUALS[species];

  const wolfNames = ['Luna', 'Shadow', 'Storm', 'Fang', 'Silver', 'Midnight'];
  const whaleNames = ['Splash', 'Ocean', 'Bubbles', 'Wave', 'Pearl', 'Coral'];
  const hybridNames = ['Nova', 'Phoenix', 'Aurora', 'Cosmos', 'Prism', 'Nebula'];

  switch (vis.family) {
    case 'wolf':
      return wolfNames;
    case 'whale':
      return whaleNames;
    case 'hybrid':
      return hybridNames;
    default:
      return wolfNames;
  }
}
