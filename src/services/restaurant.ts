/**
 * 餐厅服务模块
 * 提供餐厅搜索和详情获取功能
 */

import { getCategoryName, getPOICodeByKeyword, checkCuisineMatch } from '../lib/poiTypes'
import { demoRestaurants } from './demoData'
import { md5 } from '../lib/md5'

export interface Restaurant {
  id: string
  name: string
  address: string
  phone?: string
  latitude: number
  longitude: number
  category: string
  rating: number
  priceLevel: number // 1-4，价格等级
  isOpen: boolean
  openingHours?: string
  photos?: string[]
  distance?: number // 距离用户的距离（米）
}

interface AmapPoi {
  id: string
  name: string
  address: string
  tel?: string
  location: string
  typecode?: string
  biz_ext?: {
    rating?: string
    cost?: string
  }
  biz_time?: string
  photos?: Array<{ url: string }>
  distance?: string
}

interface AmapResponse {
  status: string
  info: string
  pois?: AmapPoi[]
}

function mapPoiToRestaurant(poi: AmapPoi): Restaurant {
  const [longitude, latitude] = poi.location.split(',').map(Number)

  return {
    id: poi.id,
    name: poi.name,
    address: poi.address,
    phone: poi.tel,
    latitude,
    longitude,
    category: getCategoryName(poi.typecode || '050000'),
    rating: poi.biz_ext?.rating ? parseFloat(poi.biz_ext.rating) : 0,
    priceLevel: poi.biz_ext?.cost ? parseInt(poi.biz_ext.cost, 10) : 1,
    isOpen: true, // 高德API不提供实时营业状态
    openingHours: poi.biz_time,
    photos: poi.photos?.map(photo => photo.url) || [],
    distance: poi.distance ? parseInt(poi.distance, 10) : undefined
  }
}


export interface SearchParams {
  latitude: number
  longitude: number
  radius?: number // 搜索半径（米）
  keywords?: string // 搜索关键词
  category?: string // 餐厅类型
  types?: string[] // POI类型码数组
  priceLevel?: number[] // 价格等级筛选
}

/**
 * 搜索周边餐厅
 * 使用高德地图API
 */
export async function searchNearbyRestaurants(params: SearchParams): Promise<Restaurant[]> {
  const amapKey = import.meta.env.VITE_AMAP_API_KEY
  const amapSigSecret = import.meta.env.VITE_AMAP_SIG_SECRET
  const useDemoData = import.meta.env.VITE_USE_DEMO_DATA === 'true'
  const shouldUseDemoData = useDemoData || !amapKey
  const paramsWithDefaults = {
    radius: 1000,
    ...params
  }
  
  if (shouldUseDemoData) {
    console.warn('使用内置演示餐厅数据：缺少高德密钥或启用了 VITE_USE_DEMO_DATA')
    return getDemoRestaurants(paramsWithDefaults)
  }
  
  try {
    // 构建搜索参数
    let types = '050000' // 默认餐饮服务

    // 如果指定了具体的POI类型码，使用指定的类型
    if (paramsWithDefaults.types && paramsWithDefaults.types.length > 0) {
      types = paramsWithDefaults.types.join('|')
    }
    // 如果有关键词，尝试根据关键词推断POI类型
    else if (paramsWithDefaults.keywords) {
      const inferredType = getPOICodeByKeyword(paramsWithDefaults.keywords)
      if (inferredType) {
        types = inferredType
      }
    }

    const searchParams = new URLSearchParams({
      key: amapKey,
      location: `${paramsWithDefaults.longitude},${paramsWithDefaults.latitude}`,
      radius: (paramsWithDefaults.radius || 1000).toString(),
      types,
      page_size: '20',
      page_num: '1'
    })

    if (paramsWithDefaults.keywords) {
      searchParams.append('keywords', paramsWithDefaults.keywords)
    }

    const path = '/v5/place/around'
    if (amapSigSecret) {
      const entries = Array.from(searchParams.entries()).sort(([a],[b]) => a.localeCompare(b))
      const qs = entries.map(([k,v]) => `${k}=${v}`).join('&')
      const sig = md5(`${path}?${qs}${amapSigSecret}`)
      searchParams.append('sig', sig)
    }

    const response = await fetch(
      `https://restapi.amap.com${path}?${searchParams.toString()}`
    )
    
    const data = await response.json() as AmapResponse
    
    if (data.status === '1' && data.pois) {
      return data.pois.map(mapPoiToRestaurant)
    } else {
      console.error('搜索餐厅失败:', data.info)
      if (useDemoData) {
        return getDemoRestaurants(paramsWithDefaults)
      }
      return []
    }
  } catch (error) {
    console.error('搜索餐厅失败:', error)
    if (useDemoData) {
      return getDemoRestaurants(paramsWithDefaults)
    }
    return []
  }
}

function getDemoRestaurants(params: SearchParams): Restaurant[] {
  const { radius, keywords, priceLevel, category } = params
  const keywordTokens = keywords?.split(/\s+/).filter(Boolean)

  return demoRestaurants
    .filter((restaurant) => {
      if (radius && restaurant.distance && restaurant.distance > radius) {
        return false
      }

      if (priceLevel && priceLevel.length > 0 && !priceLevel.includes(restaurant.priceLevel)) {
        return false
      }

      if (category && !restaurant.category.includes(category)) {
        return false
      }

      if (keywordTokens && keywordTokens.length > 0) {
        const matched = keywordTokens.some((token) => {
          const lowerToken = token.toLowerCase()
          return (
            restaurant.name.toLowerCase().includes(lowerToken) ||
            restaurant.address.toLowerCase().includes(lowerToken) ||
            checkCuisineMatch(restaurant.category, [token])
          )
        })
        if (!matched) {
          return false
        }
      }

      return true
    })
    .map((restaurant) => ({ ...restaurant }))
}

/**
 * 获取餐厅详细信息
 */
export async function getRestaurantDetail(id: string): Promise<Restaurant | null> {
  const amapKey = import.meta.env.VITE_AMAP_API_KEY
  const amapSigSecret = import.meta.env.VITE_AMAP_SIG_SECRET
  const useDemoData = import.meta.env.VITE_USE_DEMO_DATA === 'true'
  if (useDemoData || !amapKey) {
    console.warn('使用内置演示餐厅详情数据')
    return demoRestaurants.find((restaurant) => restaurant.id === id) || null
  }
  
  try {
    const path = '/v5/place/detail'
    const params = new URLSearchParams({ key: amapKey, id })
    if (amapSigSecret) {
      const entries = Array.from(params.entries()).sort(([a],[b]) => a.localeCompare(b))
      const qs = entries.map(([k,v]) => `${k}=${v}`).join('&')
      const sig = md5(`${path}?${qs}${amapSigSecret}`)
      params.append('sig', sig)
    }
    const response = await fetch(
      `https://restapi.amap.com${path}?${params.toString()}`
    )

    
    
    const data = await response.json() as AmapResponse
    
    if (data.status === '1' && data.pois && data.pois.length > 0) {
      return mapPoiToRestaurant(data.pois[0])
    } else {
      console.error('获取餐厅详情失败:', data.info)
      if (useDemoData) {
        return demoRestaurants.find((restaurant) => restaurant.id === id) || null
      }
      return null
    }
  } catch (error) {
    console.error('获取餐厅详情失败:', error)
    if (useDemoData) {
      return demoRestaurants.find((restaurant) => restaurant.id === id) || null
    }
    return null
  }
}

/**
 * 获取餐厅营业状态
 * 根据当前时间和营业时间判断
 */
export function getRestaurantOpenStatus(openingHours?: string): boolean {
  if (!openingHours) return true // 如果没有营业时间信息，默认营业

  try {
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    
    // 简单的营业时间解析，实际应用中需要更复杂的解析逻辑
    const timeRanges = openingHours.match(/\d{1,2}:\d{2}-\d{1,2}:\d{2}/g)
    
    if (!timeRanges) return true
    
    for (const range of timeRanges) {
      const [start, end] = range.split('-')
      const [startHour, startMin] = start.split(':').map(Number)
      const [endHour, endMin] = end.split(':').map(Number)
      
      const startTime = startHour * 60 + startMin
      const endTime = endHour * 60 + endMin
      
      if (currentTime >= startTime && currentTime <= endTime) {
        return true
      }
    }
    
    return false
  } catch (error) {
    console.error('解析营业时间失败:', error)
    return true
  }
}

/**
 * 根据用户偏好筛选餐厅
 */
export function filterRestaurantsByPreferences(
  restaurants: Restaurant[],
  preferences: {
    cuisineTypes?: string[]
    priceRange?: [number, number]
    maxDistance?: number
  }
): Restaurant[] {
  return restaurants.filter(restaurant => {
    // 距离筛选
    if (preferences.maxDistance && restaurant.distance) {
      if (restaurant.distance > preferences.maxDistance) {
        return false
      }
    }

    // 价格筛选
    if (preferences.priceRange) {
      const [minPrice, maxPrice] = preferences.priceRange
      if (restaurant.priceLevel < minPrice || restaurant.priceLevel > maxPrice) {
        return false
      }
    }

    // 菜系筛选
    if (preferences.cuisineTypes && preferences.cuisineTypes.length > 0) {
      const hasMatchingCuisine = checkCuisineMatch(restaurant.category, preferences.cuisineTypes)
      if (!hasMatchingCuisine) {
        return false
      }
    }

    return true
  })
}

/**
 * 按特定菜系搜索餐厅
 */
export async function searchRestaurantsByCuisine(
  params: Omit<SearchParams, 'types'>,
  cuisineCode: string
): Promise<Restaurant[]> {
  return searchNearbyRestaurants({
    ...params,
    types: [cuisineCode]
  })
}

/**
 * 搜索特定类型的餐饮场所
 */
export async function searchSpecificVenues(
  params: SearchParams
): Promise<Restaurant[]> {
  return searchNearbyRestaurants(params)
}

/**
 * 搜索咖啡厅和茶饮店
 */
export async function searchCafesAndTea(
  params: Omit<SearchParams, 'types' | 'keywords'>
): Promise<Restaurant[]> {
  return searchNearbyRestaurants({
    ...params,
    types: ['050500', '050600', '050900'], // 咖啡厅、茶艺馆、甜品店
    keywords: '咖啡 茶饮 甜品'
  })
}

/**
 * 搜索快餐和小吃
 */
export async function searchFastFoodAndSnacks(
  params: Omit<SearchParams, 'types' | 'keywords'>
): Promise<Restaurant[]> {
  return searchNearbyRestaurants({
    ...params,
    types: ['050300', '050305', '050400'], // 快餐厅、茶餐厅、休闲餐饮场所
    keywords: '快餐 小吃 茶餐厅'
  })
}

/**
 * 搜索火锅和特色菜
 */
export async function searchHotPotAndBBQ(
  params: Omit<SearchParams, 'types' | 'keywords'>
): Promise<Restaurant[]> {
  return searchNearbyRestaurants({
    ...params,
    types: ['050117', '050118', '050119'], // 火锅店、特色餐厅、海鲜酒楼
    keywords: '火锅 特色菜 海鲜'
  })
}

/**
 * 搜索中式餐厅
 */
export async function searchChineseRestaurants(
  params: Omit<SearchParams, 'types' | 'keywords'>
): Promise<Restaurant[]> {
  return searchNearbyRestaurants({
    ...params,
    types: ['050100'], // 中餐厅大类
    keywords: '中餐 中式'
  })
}

/**
 * 搜索外国餐厅
 */
export async function searchInternationalRestaurants(
  params: Omit<SearchParams, 'types' | 'keywords'>
): Promise<Restaurant[]> {
  return searchNearbyRestaurants({
    ...params,
    types: ['050200'], // 外国餐厅大类
    keywords: '西餐 日料 韩料 法餐'
  })
}
