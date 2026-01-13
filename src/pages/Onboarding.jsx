import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Home, Check } from 'lucide-react'
import { useStore } from '../lib/store'
import { saveProperty } from '../lib/database'
import { quizQuestions, quizToSelections, getRecommendedPriorities } from '../data/quiz'
import { Button, ProgressBar } from '../components/ui'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { user, setOnboardingComplete, setCurrentPropertyId } = useStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [propertyAddress, setPropertyAddress] = useState('')
  const [propertyZip, setPropertyZip] = useState('')
  const [loading, setLoading] = useState(false)

  const totalSteps = quizQuestions.length + 1 // +1 for address step
  const progress = ((currentStep + 1) / totalSteps) * 100

  const handleAnswer = (questionId, answerId) => {
    const question = quizQuestions[currentStep - 1]
    
    if (question.type === 'multiple') {
      const current = answers[questionId] || []
      const updated = current.includes(answerId)
        ? current.filter(a => a !== answerId)
        : [...current, answerId]
      setAnswers({ ...answers, [questionId]: updated })
    } else {
      setAnswers({ ...answers, [questionId]: answerId })
    }
  }

  const canProceed = () => {
    if (currentStep === 0) {
      return propertyAddress.length > 5 && propertyZip.length === 5
    }
    const question = quizQuestions[currentStep - 1]
    if (question.type === 'multiple') {
      return (answers[question.id] || []).length > 0
    }
    return !!answers[question.id]
  }

  const handleNext = async () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      setLoading(true)
      
      const selections = quizToSelections(answers)
      const priorities = getRecommendedPriorities(answers)
      
      const newProperty = {
        address: propertyAddress,
        zip_code: propertyZip,
        selections,
        quiz_answers: answers,
        priorities,
        home_value: 500000,
        project_budget: 0,
        roof_age: 15,
        replacement_cost: 300000,
      }

      const { data, error } = await saveProperty(newProperty)
      
      if (!error && data) {
        setCurrentPropertyId(data.id)
        setOnboardingComplete(true)
        navigate('/dashboard')
      }
      
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="border-b-2 border-slate-800 p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
              <Home className="w-5 h-5 text-slate-900" />
            </div>
            <span className="font-bold text-slate-100">ShoreHomeScore</span>
          </div>
          <span className="text-sm text-slate-500">
            Step {currentStep + 1} of {totalSteps}
          </span>
        </div>
      </header>

      {/* Progress */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-6">
        <ProgressBar value={progress} max={100} color="emerald" />
      </div>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {currentStep === 0 ? (
              <motion.div
                key="address"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-slate-800 border-2 border-slate-700 rounded-2xl p-8"
              >
                <h1 className="text-2xl font-bold text-slate-100 mb-2">
                  Let's start with your property
                </h1>
                <p className="text-slate-400 mb-8">
                  Enter the address of the property you want to protect.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Property Address
                    </label>
                    <input
                      type="text"
                      value={propertyAddress}
                      onChange={(e) => setPropertyAddress(e.target.value)}
                      placeholder="123 Shore Drive, Beach City"
                      className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={propertyZip}
                      onChange={(e) => setPropertyZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                      placeholder="08742"
                      maxLength={5}
                      className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-slate-800 border-2 border-slate-700 rounded-2xl p-8"
              >
                <QuizQuestion
                  question={quizQuestions[currentStep - 1]}
                  answer={answers[quizQuestions[currentStep - 1].id]}
                  onAnswer={(answerId) => handleAnswer(quizQuestions[currentStep - 1].id, answerId)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              loading={loading}
              className="gap-2"
            >
              {currentStep === totalSteps - 1 ? 'Complete' : 'Continue'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

function QuizQuestion({ question, answer, onAnswer }) {
  const isMultiple = question.type === 'multiple'
  const selectedIds = isMultiple ? (answer || []) : [answer]

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-100 mb-2">
        {question.question}
      </h2>
      {isMultiple && (
        <p className="text-slate-400 mb-6">Select all that apply</p>
      )}

      <div className="grid gap-3 mt-6">
        {question.options.map((option) => {
          const isSelected = selectedIds.includes(option.id)
          
          return (
            <motion.button
              key={option.id}
              onClick={() => onAnswer(option.id)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-900/30'
                  : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">{option.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-100">{option.label}</div>
                  <div className="text-sm text-slate-400">{option.description}</div>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
