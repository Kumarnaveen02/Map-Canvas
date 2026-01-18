import { create } from 'zustand'
import { DrawnFeature } from '../types/feature'
import { ShapeType } from '../config/shapeConfig'

interface MapState {
  features: DrawnFeature[]
  activeDrawMode: ShapeType | null
  error: string | null
  success: string | null
  addFeature: (feature: DrawnFeature) => void
  removeFeature: (id: string) => void
  setActiveDrawMode: (mode: ShapeType | null) => void
  setError: (error: string | null) => void
  clearError: () => void
  setSuccess: (success: string | null) => void
  clearSuccess: () => void
  getFeaturesByType: (type: ShapeType) => DrawnFeature[]
}

export const useMapStore = create<MapState>((set, get) => ({
  features: [],
  activeDrawMode: null,
  error: null,
  success: null,

  addFeature: (feature) => {
    set((state) => ({
      features: [...state.features, feature],
    }))
  },

  removeFeature: (id) => {
    set((state) => ({
      features: state.features.filter((f) => f.id !== id),
    }))
  },

  setActiveDrawMode: (mode) => {
    set({ activeDrawMode: mode })
  },

  setError: (error) => {
    set({ error })
  },

  clearError: () => {
    set({ error: null })
  },

  setSuccess: (success) => {
    set({ success })
  },

  clearSuccess: () => {
    set({ success: null })
  },

  getFeaturesByType: (type) => {
    return get().features.filter((f) => f.type === type)
  },
}))
