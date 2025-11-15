/**
 * 餐厅服务模块
 * 提供餐厅搜索和详情获取功能
 */

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
    category: poi.typecode || '餐饮',
    rating: poi.biz_ext?.rating ? parseFloat(poi.biz_ext.rating) : 0,
    priceLevel: poi.biz_ext?.cost ? parseInt(poi.biz_ext.cost, 10) : 1,
    isOpen: true, // 高德API不提供实时营业状态
    openingHours: poi.biz_time,
    photos: poi.photos?.map(photo => photo.url) || [],
    distance: poi.distance ? parseInt(poi.distance, 10) : undefined
  }
}

function md5(s: string): string {
  function L(k: number, d: number) { return (k << d) | (k >>> (32 - d)) }
  function r(x: number) { return x & 0xffffffff }
  function C(x: number, y: number, z: number, w: number, a: number, b: number, c: number) {
    x = r(x + a + c); return r(L(x, b) + y)
  }
  function D(a: string) {
    const b = []
    for (let i = 0; i < a.length; i++) b.push(a.charCodeAt(i))
    return b
  }
  function E(a: number[]) {
    const b = []
    for (let i = 0; i < a.length * 32; i += 8) b.push((a[i >> 5] >>> (i % 32)) & 0xff)
    return b
  }
  function P(a: number[]) {
    const b = []
    for (let i = 0; i < a.length; i += 4) b.push(a[i] | (a[i + 1] << 8) | (a[i + 2] << 16) | (a[i + 3] << 24))
    return b
  }
  function Q(a: number[]) {
    const b = []
    for (let i = 0; i < a.length; i++) b.push((a[i >> 2] >>> ((i % 4) * 8)) & 0xff)
    return b
  }
  const g = D(unescape(encodeURIComponent(s)))
  const h = g.length
  const i = P(g)
  const j = Math.ceil((h + 1 + 8) / 64) * 16
  const k = new Array(j).fill(0)
  for (let x = 0; x < i.length; x++) k[x] = i[x]
  k[h >> 2] |= 0x80 << ((h % 4) * 8)
  k[j - 2] = h << 3
  let a = 1732584193
  let b = -271733879
  let c = -1732584194
  let d = 271733878
  for (let x = 0; x < k.length; x += 16) {
    const olda = a, oldb = b, oldc = c, oldd = d
    a = C(a, b, c, d, k[x + 0], 7, -680876936); d = C(d, a, b, c, k[x + 1], 12, -389564586)
    c = C(c, d, a, b, k[x + 2], 17, 606105819); b = C(b, c, d, a, k[x + 3], 22, -1044525330)
    a = C(a, b, c, d, k[x + 4], 7, -176418897); d = C(d, a, b, c, k[x + 5], 12, 1200080426)
    c = C(c, d, a, b, k[x + 6], 17, -1473231341); b = C(b, c, d, a, k[x + 7], 22, -45705983)
    a = C(a, b, c, d, k[x + 8], 7, 1770035416); d = C(d, a, b, c, k[x + 9], 12, -1958414417)
    c = C(c, d, a, b, k[x + 10], 17, -42063); b = C(b, c, d, a, k[x + 11], 22, -1990404162)
    a = C(a, b, c, d, k[x + 12], 7, 1804603682); d = C(d, a, b, c, k[x + 13], 12, -40341101)
    c = C(c, d, a, b, k[x + 14], 17, -1502002290); b = C(b, c, d, a, k[x + 15], 22, 1236535329)
    a = r(a + olda); b = r(b + oldb); c = r(c + oldc); d = r(d + oldd)
  }
  const out = Q(E([a, b, c, d]))
  const hex = '0123456789abcdef'
  let res = ''
  for (let i2 = 0; i2 < out.length; i2++) { res += hex.charAt((out[i2] >>> 4) & 0x0f) + hex.charAt(out[i2] & 0x0f) }
  return res
}

export interface SearchParams {
  latitude: number
  longitude: number
  radius?: number // 搜索半径（米）
  keywords?: string // 搜索关键词
  category?: string // 餐厅类型
  priceLevel?: number[] // 价格等级筛选
}

/**
 * 搜索周边餐厅
 * 使用高德地图API
 */
export async function searchNearbyRestaurants(params: SearchParams): Promise<Restaurant[]> {
  const amapKey = import.meta.env.VITE_AMAP_API_KEY
  const amapSigSecret = import.meta.env.VITE_AMAP_SIG_SECRET
  
  if (!amapKey) {
    console.warn('高德地图API密钥未配置')
    return []
  }

  try {
    // 构建搜索参数
    const searchParams = new URLSearchParams({
      key: amapKey,
      location: `${params.longitude},${params.latitude}`,
      radius: (params.radius || 1000).toString(),
      types: '050000',
      page_size: '20',
      page_num: '1'
    })

    if (params.keywords) {
      searchParams.append('keywords', params.keywords)
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
      return []
    }
  } catch (error) {
    console.error('搜索餐厅失败:', error)
    return []
  }
}

/**
 * 获取餐厅详细信息
 */
export async function getRestaurantDetail(id: string): Promise<Restaurant | null> {
  const amapKey = import.meta.env.VITE_AMAP_API_KEY
  const amapSigSecret = import.meta.env.VITE_AMAP_SIG_SECRET
  
  if (!amapKey) {
    console.warn('高德地图API密钥未配置')
    return null
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
      return null
    }
  } catch (error) {
    console.error('获取餐厅详情失败:', error)
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
      const hasMatchingCuisine = preferences.cuisineTypes.some(cuisine =>
        restaurant.category.toLowerCase().includes(cuisine.toLowerCase())
      )
      if (!hasMatchingCuisine) {
        return false
      }
    }

    return true
  })
}
