/**
 * 推荐列表页面组件
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Star, MapPin, Clock, Phone, Filter, TrendingUp } from 'lucide-react'
import { useRestaurants } from '../hooks/useRestaurants'

export default function Recommendations() {
  const navigate = useNavigate()
  const { recommendations, isGeneratingRecommendations } = useRestaurants()
  const [sortBy, setSortBy] = useState<'score' | 'distance' | 'rating'>('score')

  /**
   * 排序推荐结果
   */
  const sortedRecommendations = [...recommendations].sort((a, b) => {
    switch (sortBy) {
      case 'distance':
        return (a.restaurant.distance || 0) - (b.restaurant.distance || 0)
      case 'rating':
        return b.restaurant.rating - a.restaurant.rating
      case 'score':
      default:
        return b.score - a.score
    }
  })

  /**
   * 获取匹配类型标签样式
   */
  const getMatchTypeStyle = (matchType: string) => {
    switch (matchType) {
      case 'perfect':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'fair':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  /**
   * 格式化距离
   */
  const formatDistance = (distance?: number) => {
    if (!distance) return '距离未知'
    if (distance < 1000) {
      return `${distance}米`
    }
    return `${(distance / 1000).toFixed(1)}公里`
  }

  /**
   * 获取价格等级显示
   */
  const getPriceDisplay = (priceLevel: number) => {
    return '¥'.repeat(priceLevel)
  }

  if (isGeneratingRecommendations) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">正在为你生成智能推荐...</p>
        </div>
      </div>
    )
  }

  if (sortedRecommendations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              返回
            </button>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">暂无推荐结果</h2>
            <p className="text-gray-600 mb-6">请检查你的位置设置和偏好设置，或扩大搜索范围</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              重新获取推荐
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            返回
          </button>
          <h1 className="text-lg font-semibold text-gray-900">推荐结果</h1>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'score' | 'distance' | 'rating')}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            >
              <option value="score">智能评分</option>
              <option value="distance">距离最近</option>
              <option value="rating">评分最高</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 推荐结果列表 */}
        <div className="space-y-4">
          {sortedRecommendations.map((recommendation) => (
            <div
              key={recommendation.restaurant.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/restaurant/${recommendation.restaurant.id}`)}
            >
              <div className="p-6">
                {/* 餐厅基本信息 */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {recommendation.restaurant.name}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getMatchTypeStyle(recommendation.matchType)}`}>
                        {recommendation.matchType === 'perfect' && '完美匹配'}
                        {recommendation.matchType === 'good' && '不错选择'}
                        {recommendation.matchType === 'fair' && '还可以'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>{recommendation.restaurant.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                        <span>{formatDistance(recommendation.restaurant.distance)}</span>
                      </div>
                      <div className="text-orange-600 font-medium">
                        {getPriceDisplay(recommendation.restaurant.priceLevel)}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm">
                      {recommendation.restaurant.address}
                    </p>
                  </div>
                  
                  {/* 推荐分数 */}
                  <div className="text-center ml-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {recommendation.score}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">推荐分</p>
                  </div>
                </div>

                {/* 推荐理由 */}
                {recommendation.reasons.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">推荐理由</h4>
                    <div className="flex flex-wrap gap-2">
                      {recommendation.reasons.map((reason: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-orange-50 text-orange-700 text-xs rounded-full"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 营业状态 */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                    <span className={recommendation.restaurant.isOpen ? 'text-green-600' : 'text-red-600'}>
                      {recommendation.restaurant.isOpen ? '营业中' : '已打烊'}
                    </span>
                  </div>
                  
                  {recommendation.restaurant.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-1" />
                      <span>{recommendation.restaurant.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 底部提示 */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            基于你的位置和偏好，为你推荐了 {sortedRecommendations.length} 家餐厅
          </p>
          <button
            onClick={() => navigate('/preferences')}
            className="mt-2 text-orange-500 hover:text-orange-600 text-sm font-medium"
          >
            调整偏好设置
          </button>
        </div>
      </div>
    </div>
  )
}
