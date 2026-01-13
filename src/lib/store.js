import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(
  persist(
    (set, get) => ({
      // Auth state
      user: null,
      setUser: (user) => set({ user }),
      
      // Guest selections (before signup)
      guestSelections: {},
      setGuestSelections: (selections) => set({ guestSelections: selections }),
      clearGuestSelections: () => set({ guestSelections: {} }),
      
      // Current property being edited
      currentPropertyId: null,
      setCurrentPropertyId: (id) => set({ currentPropertyId: id }),
      
      // Properties list
      properties: [],
      setProperties: (properties) => set({ properties }),
      addProperty: (property) => set((state) => ({ 
        properties: [...state.properties, property] 
      })),
      updateProperty: (id, updates) => set((state) => ({
        properties: state.properties.map(p => 
          p.id === id ? { ...p, ...updates } : p
        )
      })),
      deleteProperty: (id) => set((state) => ({
        properties: state.properties.filter(p => p.id !== id),
        currentPropertyId: state.currentPropertyId === id ? null : state.currentPropertyId
      })),
      
      // Onboarding state
      onboardingComplete: false,
      setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),
      
      // Quiz answers (temporary during onboarding)
      quizAnswers: {},
      setQuizAnswer: (question, answer) => set((state) => ({
        quizAnswers: { ...state.quizAnswers, [question]: answer }
      })),
      resetQuizAnswers: () => set({ quizAnswers: {} }),
      
      // Notifications preferences
      notifications: {
        email: true,
        storms: true,
        reminders: true,
      },
      setNotifications: (notifications) => set({ notifications }),
      
      // Documents
      documents: [],
      setDocuments: (documents) => set({ documents }),
      addDocument: (document) => set((state) => ({
        documents: [...state.documents, document]
      })),
      deleteDocument: (id) => set((state) => ({
        documents: state.documents.filter(d => d.id !== id)
      })),
    }),
    {
      name: 'shorehomescore-storage',
      partialize: (state) => ({
        user: state.user,
        properties: state.properties,
        currentPropertyId: state.currentPropertyId,
        onboardingComplete: state.onboardingComplete,
        notifications: state.notifications,
        documents: state.documents,
        guestSelections: state.guestSelections,
      }),
    }
  )
)
