/**
 * 餐厅推荐Hook
 * 处理餐厅搜索和推荐逻辑
 */

import { useState, useCallback } from 'react'
import { 
  searchNearbyRestaurants, 
  Restaurant, 
  SearchParams,
  filterRestaurantsByPreferences 
} from '../services/restaurant'
import { 
  getSmartRecommendations, 
  UserPreferences,
  RecommendationContext,
  Recommendation 
} from '../services/recommendation'
import { useAppStore } from '../store'

export function useRestaurants() {
  const { 
    restaurants, 
    isLoadingRestaurants,
    recommendations,
    isGeneratingRecommendations,
    currentLocation,
    preferences,
    setRestaurants,
    setLoadingRestaurants,
    setRecommendations,
    setGeneratingRecommendations
  } = useAppStore()

  /**
   * 搜索周边餐厅
   */
  const searchNearby = useCallback(async (params?: Partial<SearchParams>) => {
    if (!currentLocation) {
      throw new Error('请先获取位置信息')
    }

    try {
      setLoadingRestaurants(true)

      const searchParams: SearchParams = {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        radius: 1000, // 默认1公里
        // 从地址中提取城市作为region（用于文本搜索）
        region: (() => {
          const addr = currentLocation.address || ''
          const match = addr.match(/[\u4e00-\u9fa5]+市/)
          return match ? match[0] : undefined
        })(),
        ...params
      }

      const results = await searchNearbyRestaurants(searchParams)
      setRestaurants(results)
      return results
    } catch (error) {
      console.error('搜索餐厅失败:', error)
      throw error
    } finally {
      setLoadingRestaurants(false)
    }
  }, [currentLocation, setRestaurants, setLoadingRestaurants])

  /**
   * 获取智能推荐
   */
  const getRecommendations = useCallback(async () => {
    if (!currentLocation || restaurants.length === 0) {
      throw new Error('缺少位置信息或餐厅数据')
    }

    try {
      setGeneratingRecommendations(true)

      const context: RecommendationContext = {
        location: {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude
        },
        preferences,
        timeOfDay: getCurrentTimeOfDay()
      }

      const smartRecommendations = await getSmartRecommendations(context, restaurants)
      setRecommendations(smartRecommendations)
      return smartRecommendations
    } catch (error) {
      console.error('获取推荐失败:', error)
      throw error
    } finally {
      setGeneratingRecommendations(false)
    }
  }, [currentLocation, restaurants, preferences, setRecommendations, setGeneratingRecommendations])

  /**
   * 根据偏好筛选餐厅
   */
  const filterByPreferences = useCallback((restaurantsToFilter?: Restaurant[]) => {
    const targetRestaurants = restaurantsToFilter || restaurants
    return filterRestaurantsByPreferences(targetRestaurants, preferences)
  }, [restaurants, preferences])

  /**
   * 更新用户偏好
   */
  const updatePreferences = useCallback((newPreferences: Partial<UserPreferences>) => {
    useAppStore.getState().updatePreferences(newPreferences)
  }, [])

  return {
    restaurants,
    isLoadingRestaurants,
    recommendations,
    isGeneratingRecommendations,
    searchNearby,
    getRecommendations,
    filterByPreferences,
    updatePreferences
  }
}

/**
 * 获取当前时间段
 */
function getCurrentTimeOfDay(): string {
  const hour = new Date().getHours()
  
  if (hour >= 6 && hour < 10) {
    return 'breakfast'
  } else if (hour >= 11 && hour < 14) {
    return 'lunch'
  } else if (hour >= 17 && hour < 21) {
    return 'dinner'
  } else {
    return 'snack'
  }
}
