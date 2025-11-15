/**
 * 状态管理模块
 * 使用Zustand管理应用状态
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Location } from '../services/location'
import { UserPreferences } from '../services/recommendation'
import { Restaurant } from '../services/restaurant'

interface AppState {
  // 位置信息
  currentLocation: Location | null
  isLocating: boolean
  locationError: string | null
  
  // 用户偏好
  preferences: UserPreferences
  
  // 餐厅数据
  restaurants: Restaurant[]
  isLoadingRestaurants: boolean
  
  // 推荐结果
  recommendations: any[]
  isGeneratingRecommendations: boolean
  
  // 动作方法
  setLocation: (location: Location) => void
  setLocating: (isLocating: boolean) => void
  setLocationError: (error: string | null) => void
  updatePreferences: (preferences: Partial<UserPreferences>) => void
  setRestaurants: (restaurants: Restaurant[]) => void
  setLoadingRestaurants: (isLoading: boolean) => void
  setRecommendations: (recommendations: any[]) => void
  setGeneratingRecommendations: (isGenerating: boolean) => void
  clearError: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 初始状态
      currentLocation: null,
      isLocating: false,
      locationError: null,
      
      preferences: {
        cuisineTypes: [],
        priceRange: [1, 4],
        maxDistance: 1000,
        dietaryRestrictions: [],
        preferredTime: 'lunch'
      },
      
      restaurants: [],
      isLoadingRestaurants: false,
      
      recommendations: [],
      isGeneratingRecommendations: false,
      
      // 方法定义
      setLocation: (location) => set({ currentLocation: location }),
      
      setLocating: (isLocating) => set({ isLocating }),
      
      setLocationError: (error) => set({ locationError: error }),
      
      updatePreferences: (preferences) => set((state) => ({
        preferences: { ...state.preferences, ...preferences }
      })),
      
      setRestaurants: (restaurants) => set({ restaurants }),
      
      setLoadingRestaurants: (isLoading) => set({ isLoadingRestaurants: isLoading }),
      
      setRecommendations: (recommendations) => set({ recommendations }),
      
      setGeneratingRecommendations: (isGenerating) => set({ isGeneratingRecommendations: isGenerating }),
      
      clearError: () => set({ locationError: null })
    }),
    {
      name: 'lunch-recommend-app',
      partialize: (state) => ({
        // 只持久化偏好设置
        preferences: state.preferences
      })
    }
  )
)

// 选择器函数
export const useLocation = () => useAppStore((state) => state.currentLocation)
export const useIsLocating = () => useAppStore((state) => state.isLocating)
export const useLocationError = () => useAppStore((state) => state.locationError)
export const usePreferences = () => useAppStore((state) => state.preferences)
export const useRestaurants = () => useAppStore((state) => state.restaurants)
export const useIsLoadingRestaurants = () => useAppStore((state) => state.isLoadingRestaurants)
export const useRecommendations = () => useAppStore((state) => state.recommendations)
export const useIsGeneratingRecommendations = () => useAppStore((state) => state.isGeneratingRecommendations)