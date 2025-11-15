/**
 * 智能推荐服务模块
 * 集成硅基流动API提供个性化餐厅推荐
 */

import { Restaurant } from './restaurant'

export interface UserPreferences {
  cuisineTypes: string[] // 偏好菜系
  priceRange: [number, number] // 价格区间 [min, max]
  maxDistance: number // 最大距离（米）
  dietaryRestrictions?: string[] // 饮食限制
  preferredTime?: string // 用餐时间
}

export interface RecommendationContext {
  location: {
    latitude: number
    longitude: number
  }
  preferences: UserPreferences
  weather?: string // 天气信息
  timeOfDay?: string // 时间段
  previousChoices?: string[] // 历史选择
}

export interface Recommendation {
  restaurant: Restaurant
  score: number // 推荐分数 (0-100)
  reasons: string[] // 推荐理由
  matchType: 'perfect' | 'good' | 'fair' // 匹配类型
}

/**
 * 获取智能餐厅推荐
 * 使用硅基流动API进行个性化推荐
 */
export async function getSmartRecommendations(
  context: RecommendationContext,
  restaurants: Restaurant[]
): Promise<Recommendation[]> {
  const apiKey = import.meta.env.VITE_SILICON_API_KEY
  
  if (!apiKey) {
    console.warn('硅基流动API密钥未配置，使用基础推荐算法')
    return getBasicRecommendations(context, restaurants)
  }

  try {
    // 构建推荐请求数据
    const prompt = buildRecommendationPrompt(context, restaurants)
    
    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'Qwen/Qwen2.5-7B-Instruct',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的餐厅推荐助手，能够根据用户偏好、位置信息和餐厅数据，提供个性化的餐厅推荐。请返回JSON格式的推荐结果，包含餐厅ID、推荐分数、推荐理由和匹配类型。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      })
    })

    const data = await response.json()
    
    if (data.choices && data.choices.length > 0) {
      const recommendationData = JSON.parse(data.choices[0].message.content)
      return processRecommendationResults(recommendationData, restaurants)
    } else {
      console.error('AI推荐失败:', data.error)
      return getBasicRecommendations(context, restaurants)
    }
  } catch (error) {
    console.error('智能推荐失败:', error)
    return getBasicRecommendations(context, restaurants)
  }
}

/**
 * 构建推荐提示词
 */
function buildRecommendationPrompt(context: RecommendationContext, restaurants: Restaurant[]): string {
  const restaurantList = restaurants.map(r => ({
    id: r.id,
    name: r.name,
    category: r.category,
    rating: r.rating,
    priceLevel: r.priceLevel,
    distance: r.distance,
    isOpen: r.isOpen
  }))

  return `请根据以下信息为用户推荐餐厅：

用户偏好：
- 偏好菜系：${context.preferences.cuisineTypes.join(', ')}
- 价格区间：${context.preferences.priceRange[0]}-${context.preferences.priceRange[1]}级
- 最大距离：${context.preferences.maxDistance}米
- 饮食限制：${context.preferences.dietaryRestrictions?.join(', ') || '无'}
- 用餐时间：${context.preferredTime || '未指定'}

当前环境：
- 位置：${context.location.latitude}, ${context.location.longitude}
- 时间：${context.timeOfDay || '未指定'}
- 天气：${context.weather || '未指定'}

可选餐厅：
${JSON.stringify(restaurantList, null, 2)}

请返回推荐结果，格式如下：
{
  "recommendations": [
    {
      "restaurantId": "餐厅ID",
      "score": 85,
      "reasons": ["理由1", "理由2"],
      "matchType": "perfect"
    }
  ]
}

评分标准：
- 考虑用户偏好匹配度
- 考虑距离因素
- 考虑餐厅评分
- 考虑价格匹配度
- 考虑当前时间是否适合

请返回3-5个推荐结果，按分数从高到低排序。`
}

/**
 * 处理推荐结果
 */
function processRecommendationResults(
  recommendationData: any, 
  restaurants: Restaurant[]
): Recommendation[] {
  if (!recommendationData.recommendations || !Array.isArray(recommendationData.recommendations)) {
    return []
  }

  return recommendationData.recommendations
    .map((rec: any) => {
      const restaurant = restaurants.find(r => r.id === rec.restaurantId)
      if (!restaurant) return null

      return {
        restaurant,
        score: Math.min(Math.max(rec.score || 0, 0), 100),
        reasons: Array.isArray(rec.reasons) ? rec.reasons : [String(rec.reasons || '')],
        matchType: ['perfect', 'good', 'fair'].includes(rec.matchType) ? rec.matchType : 'fair'
      }
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
}

/**
 * 基础推荐算法（备用方案）
 */
function getBasicRecommendations(
  context: RecommendationContext,
  restaurants: Restaurant[]
): Recommendation[] {
  const scoredRestaurants = restaurants.map(restaurant => {
    let score = 0
    const reasons: string[] = []

    // 距离评分 (0-30分)
    if (restaurant.distance) {
      const distanceScore = Math.max(0, 30 - (restaurant.distance / 100))
      score += distanceScore
      if (restaurant.distance < 500) {
        reasons.push('距离很近，步行可达')
      }
    }

    // 评分评分 (0-25分)
    const ratingScore = restaurant.rating * 5 // 5分满分转换为25分
    score += ratingScore
    if (restaurant.rating >= 4.0) {
      reasons.push('评分很高')
    }

    // 价格匹配 (0-20分)
    const [minPrice, maxPrice] = context.preferences.priceRange
    if (restaurant.priceLevel >= minPrice && restaurant.priceLevel <= maxPrice) {
      score += 20
      reasons.push('价格合适')
    } else {
      const priceDiff = Math.abs(restaurant.priceLevel - (minPrice + maxPrice) / 2)
      score += Math.max(0, 20 - priceDiff * 5)
    }

    // 菜系匹配 (0-15分)
    if (context.preferences.cuisineTypes.length > 0) {
      const hasMatchingCuisine = context.preferences.cuisineTypes.some(cuisine =>
        restaurant.category.toLowerCase().includes(cuisine.toLowerCase())
      )
      if (hasMatchingCuisine) {
        score += 15
        reasons.push('菜系偏好匹配')
      }
    }

    // 营业状态 (10分)
    if (restaurant.isOpen) {
      score += 10
      reasons.push('正在营业')
    }

    // 确定匹配类型
    let matchType: 'perfect' | 'good' | 'fair' = 'fair'
    if (score >= 80) {
      matchType = 'perfect'
    } else if (score >= 60) {
      matchType = 'good'
    }

    return {
      restaurant,
      score: Math.round(score),
      reasons: reasons.length > 0 ? reasons : ['基础推荐'],
      matchType
    }
  })

  return scoredRestaurants
    .sort((a, b) => b.score - a.score)
    .slice(0, 5) // 返回前5个推荐
}

/**
 * 获取推荐解释
 */
export function getRecommendationExplanation(recommendation: Recommendation): string {
  const { restaurant, reasons, matchType } = recommendation
  
  let explanation = `${restaurant.name}：`
  
  if (matchType === 'perfect') {
    explanation += '完美匹配，强烈推荐！'
  } else if (matchType === 'good') {
    explanation += '不错的选择，值得考虑。'
  } else {
    explanation += '还可以的选择。'
  }
  
  if (reasons.length > 0) {
    explanation += ` ${reasons.join('，')}。`
  }
  
  if (restaurant.distance) {
    const distanceKm = (restaurant.distance / 1000).toFixed(1)
    explanation += ` 距离${distanceKm}公里。`
  }
  
  return explanation
}