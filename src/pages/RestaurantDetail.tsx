/**
 * 餐厅详情页面组件
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Star, MapPin, Clock, Phone, Navigation, Heart, Share2, Utensils } from 'lucide-react'
import { getRestaurantDetail, Restaurant } from '../services/restaurant'

export default function RestaurantDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (id) {
      loadRestaurantDetail(id)
    }
  }, [id])

  /**
   * 加载餐厅详情
   */
  const loadRestaurantDetail = async (restaurantId: string) => {
    try {
      setIsLoading(true)
      const detail = await getRestaurantDetail(restaurantId)
      setRestaurant(detail)
    } catch (error) {
      console.error('加载餐厅详情失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 处理导航
   */
  const handleNavigation = () => {
    if (restaurant) {
      const url = `https://uri.amap.com/navigation?to=${restaurant.longitude},${restaurant.latitude},${encodeURIComponent(restaurant.name)}&mode=walk&policy=1&src=myapp&coordinate=gaode&callnative=0`
      window.open(url, '_blank')
    }
  }

  /**
   * 处理分享
   */
  const handleShare = () => {
    if (navigator.share && restaurant) {
      navigator.share({
        title: restaurant.name,
        text: `推荐一家不错的餐厅：${restaurant.name}`,
        url: window.location.href
      })
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href)
      alert('链接已复制到剪贴板')
    }
  }

  /**
   * 切换收藏状态
   */
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    // 这里可以添加收藏逻辑
  }

  /**
   * 获取价格等级显示
   */
  const getPriceDisplay = (priceLevel: number) => {
    return '¥'.repeat(priceLevel)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">加载餐厅详情中...</p>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              返回
            </button>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">餐厅信息加载失败</h2>
            <p className="text-gray-600 mb-6">无法获取餐厅详情，请稍后重试</p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              返回重试
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
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            返回
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFavorite}
              className={`p-2 rounded-full transition-colors ${
                isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-400 bg-gray-50'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full text-gray-400 bg-gray-50 hover:text-gray-600 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 餐厅图片区域 */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <div className="h-64 bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <Utensils className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-gray-500 text-sm">餐厅图片</p>
            </div>
          </div>
        </div>

        {/* 基本信息卡片 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
              <p className="text-gray-600">{restaurant.category}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center mb-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="ml-1 text-lg font-semibold">{restaurant.rating.toFixed(1)}</span>
              </div>
              <div className="text-orange-600 font-medium">
                {getPriceDisplay(restaurant.priceLevel)}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 text-gray-400 mr-3" />
              <span>{restaurant.address}</span>
            </div>

            {restaurant.phone && (
              <div className="flex items-center text-gray-600">
                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                <span>{restaurant.phone}</span>
              </div>
            )}

            {restaurant.openingHours && (
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 text-gray-400 mr-3" />
                <span>{restaurant.openingHours}</span>
              </div>
            )}

            <div className="flex items-center">
              <Clock className="w-5 h-5 text-gray-400 mr-3" />
              <span className={restaurant.isOpen ? 'text-green-600' : 'text-red-600'}>
                {restaurant.isOpen ? '营业中' : '已打烊'}
              </span>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleNavigation}
            className="flex-1 flex items-center justify-center px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            <Navigation className="w-5 h-5 mr-2" />
            开始导航
          </button>
        </div>

        {/* 推荐信息 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">餐厅特色</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">菜系类型</h4>
              <p className="text-gray-600">{restaurant.category}</p>
            </div>
            
            {restaurant.distance && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">距离信息</h4>
                <p className="text-gray-600">距离你约 {restaurant.distance} 米</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}