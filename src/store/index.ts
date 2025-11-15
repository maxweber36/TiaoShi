/**
 * 状态管理模块
 * 使用Zustand管理应用状态
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Location } from '../services/location'
import { UserPreferences, Recommendation } from '../services/recommendation'
import { Restaurant } from '../services/restaurant'

interface AppState {
  // 位置信息
  currentLocation: Location | null
  isLocating: boolean
  locationError: string | null
  
  // 用户偏好
  preferences: UserPreferences
  
  // 首次访问标记
  hasOnboarded: boolean
  
  // 餐厅数据
  restaurants: Restaurant[]
  isLoadingRestaurants: boolean
  
  // 推荐结果
  recommendations: Recommendation[]
  isGeneratingRecommendations: boolean
  
  // 动作方法
  setLocation: (location: Location) => void
  setLocating: (isLocating: boolean) => void
  setLocationError: (error: string | null) => void
  updatePreferences: (preferences: Partial<UserPreferences>) => void
  setRestaurants: (restaurants: Restaurant[]) => void
  setLoadingRestaurants: (isLoading: boolean) => void
  setRecommendations: (recommendations: Recommendation[]) => void
  setGeneratingRecommendations: (isGenerating: boolean) => void
  clearError: () => void
  /**
   * 设置首次访问完成标记
   * @param onboarded 是否已完成首次偏好收集
   */
  setOnboarded: (onboarded: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
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
      
      hasOnboarded: false,
      
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
      
      clearError: () => set({ locationError: null }),
      
      /**
       * 设置首次访问完成标记
       * @param onboarded 是否已完成首次偏好收集
       */
      setOnboarded: (onboarded) => set({ hasOnboarded: onboarded })
    }),
    {
      name: 'lunch-recommend-app',
      partialize: (state) => ({
        // 持久化偏好与首次访问标记
        preferences: state.preferences,
        hasOnboarded: state.hasOnboarded
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
export const useHasOnboarded = () => useAppStore((state) => state.hasOnboarded)
