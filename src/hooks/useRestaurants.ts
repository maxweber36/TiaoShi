/**
 * 餐厅推荐Hook
 * 处理餐厅搜索和推荐逻辑
 */

import { useCallback } from 'react'
import {
  searchNearbyRestaurants,
  Restaurant,
  SearchParams,
  filterRestaurantsByPreferences,
  searchSpecificVenues,
  searchCafesAndTea,
  searchFastFoodAndSnacks,
  searchHotPotAndBBQ,
  searchChineseRestaurants,
  searchInternationalRestaurants
} from '../services/restaurant'
import {
  getSmartRecommendations,
  UserPreferences,
  RecommendationContext
} from '../services/recommendation'
import { getPOICodeByKeyword } from '../lib/poiTypes'
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
        ...params
      }

      // 如果用户有POI类型偏好，使用特定搜索
      if (params?.types && params.types.length > 0) {
        const results = await searchSpecificVenues(searchParams)
        setRestaurants(results)
        return results
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
   * 基于偏好进行智能搜索
   */
  const searchByPreferences = useCallback(async () => {
    if (!currentLocation) {
      throw new Error('请先获取位置信息')
    }

    try {
      setLoadingRestaurants(true)
      let results: Restaurant[] = []

      // 根据用户偏好选择搜索策略
      if (preferences.poiTypes && preferences.poiTypes.length > 0) {
        // 使用用户选择的POI类型进行搜索
        results = await searchSpecificVenues({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          types: preferences.poiTypes
        })
      } else if (preferences.cuisineTypes && preferences.cuisineTypes.length > 0) {
        // 将菜系类型转换为POI类型码进行精准搜索
        const poiTypes: string[] = []
        for (const cuisine of preferences.cuisineTypes) {
          const poiCode = getPOICodeByKeyword(cuisine)
          if (poiCode && poiCode !== '050000') { // 排除默认的餐饮服务
            poiTypes.push(poiCode)
          }
        }

        if (poiTypes.length > 0) {
          // 使用POI类型码列表进行精准搜索
          results = await searchSpecificVenues({
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            types: poiTypes
          })
        } else {
          // 如果没有有效的POI类型码，回退到关键词搜索
          const keywords = preferences.cuisineTypes.join(' ')
          results = await searchNearbyRestaurants({
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            keywords: keywords || undefined,
            radius: preferences.maxDistance
          })
        }
      } else {
        // 如果没有明确的偏好，进行通用搜索
        results = await searchNearbyRestaurants({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          radius: preferences.maxDistance
        })
      }

      // 应用其他偏好筛选
      const filteredResults = filterRestaurantsByPreferences(results, preferences)
      setRestaurants(filteredResults)
      return filteredResults
    } catch (error) {
      console.error('基于偏好搜索失败:', error)
      throw error
    } finally {
      setLoadingRestaurants(false)
    }
  }, [currentLocation, preferences, setRestaurants, setLoadingRestaurants])

  /**
   * 搜索咖啡厅和茶饮店
   */
  const searchCafes = useCallback(async (radius?: number) => {
    if (!currentLocation) {
      throw new Error('请先获取位置信息')
    }

    try {
      setLoadingRestaurants(true)
      const results = await searchCafesAndTea({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        radius: radius || preferences.maxDistance
      })
      setRestaurants(results)
      return results
    } catch (error) {
      console.error('搜索咖啡厅失败:', error)
      throw error
    } finally {
      setLoadingRestaurants(false)
    }
  }, [currentLocation, preferences.maxDistance, setRestaurants, setLoadingRestaurants])

  /**
   * 搜索快餐和小吃
   */
  const searchFastFood = useCallback(async (radius?: number) => {
    if (!currentLocation) {
      throw new Error('请先获取位置信息')
    }

    try {
      setLoadingRestaurants(true)
      const results = await searchFastFoodAndSnacks({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        radius: radius || preferences.maxDistance
      })
      setRestaurants(results)
      return results
    } catch (error) {
      console.error('搜索快餐失败:', error)
      throw error
    } finally {
      setLoadingRestaurants(false)
    }
  }, [currentLocation, preferences.maxDistance, setRestaurants, setLoadingRestaurants])

  /**
   * 搜索火锅和烧烤
   */
  const searchHotPot = useCallback(async (radius?: number) => {
    if (!currentLocation) {
      throw new Error('请先获取位置信息')
    }

    try {
      setLoadingRestaurants(true)
      const results = await searchHotPotAndBBQ({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        radius: radius || preferences.maxDistance
      })
      setRestaurants(results)
      return results
    } catch (error) {
      console.error('搜索火锅烧烤失败:', error)
      throw error
    } finally {
      setLoadingRestaurants(false)
    }
  }, [currentLocation, preferences.maxDistance, setRestaurants, setLoadingRestaurants])

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

  /**
   * 搜索中式餐厅
   */
  const searchChineseFood = useCallback(async (radius?: number) => {
    if (!currentLocation) {
      throw new Error('请先获取位置信息')
    }

    try {
      setLoadingRestaurants(true)
      const results = await searchChineseRestaurants({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        radius: radius || preferences.maxDistance
      })
      setRestaurants(results)
      return results
    } catch (error) {
      console.error('搜索中式餐厅失败:', error)
      throw error
    } finally {
      setLoadingRestaurants(false)
    }
  }, [currentLocation, preferences.maxDistance, setRestaurants, setLoadingRestaurants])

  /**
   * 搜索外国餐厅
   */
  const searchInternational = useCallback(async (radius?: number) => {
    if (!currentLocation) {
      throw new Error('请先获取位置信息')
    }

    try {
      setLoadingRestaurants(true)
      const results = await searchInternationalRestaurants({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        radius: radius || preferences.maxDistance
      })
      setRestaurants(results)
      return results
    } catch (error) {
      console.error('搜索外国餐厅失败:', error)
      throw error
    } finally {
      setLoadingRestaurants(false)
    }
  }, [currentLocation, preferences.maxDistance, setRestaurants, setLoadingRestaurants])

  return {
    restaurants,
    isLoadingRestaurants,
    recommendations,
    isGeneratingRecommendations,
    searchNearby,
    searchByPreferences,
    searchCafes,
    searchFastFood,
    searchHotPot,
    searchChineseFood,
    searchInternational,
    getRecommendations,
    filterByPreferences,
    updatePreferences,
    preferences
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
