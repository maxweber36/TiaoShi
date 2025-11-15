/**
 * 首页组件
 * 提供位置获取和快速推荐入口
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Settings, Search, Utensils, Navigation } from 'lucide-react'
import { useLocation } from '../hooks/useLocation'
import { useRestaurants } from '../hooks/useRestaurants'

export default function Home() {
  const navigate = useNavigate()
  const { location, isLocating, locationError, fetchCurrentLocation, fetchLocationByIP } = useLocation()
  const { searchNearby, getRecommendations, isLoadingRestaurants, isGeneratingRecommendations } = useRestaurants()
  
  const [manualAddress, setManualAddress] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  /**
   * 处理自动定位
   */
  const handleAutoLocation = async () => {
    try {
      await fetchCurrentLocation()
    } catch (error) {
      console.error('自动定位失败:', error)
      // 如果GPS定位失败，可以尝试IP定位
      alert('GPS定位失败，尝试使用IP定位...')
      try {
        await fetchLocationByIP()
      } catch (ipError) {
        console.error('IP定位也失败:', ipError)
      }
    }
  }

  /**
   * 处理手动地址输入
   */
  const handleManualLocation = async () => {
    if (!manualAddress.trim()) {
      alert('请输入地址')
      return
    }

    try {
      setIsSearching(true)
      // 这里需要实现地址解析功能
      // 暂时使用模拟位置

      // 更新位置信息
      // 这里需要调用地址解析服务
      alert(`地址功能开发中，已使用模拟位置：${manualAddress}`)
    } catch (error) {
      console.error('地址解析失败:', error)
      alert('地址解析失败，请检查输入')
    } finally {
      setIsSearching(false)
    }
  }

  /**
   * 处理快速推荐
   */
  const handleQuickRecommend = async () => {
    if (!location) {
      alert('请先获取位置信息')
      return
    }

    try {
      // 搜索周边餐厅
      await searchNearby()
      
      // 获取智能推荐
      await getRecommendations()
      
      // 跳转到推荐列表页
      navigate('/recommendations')
    } catch (error) {
      console.error('获取推荐失败:', error)
      alert('获取推荐失败，请稍后重试')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Utensils className="w-8 h-8 text-orange-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">吃饭推荐</h1>
            </div>
            <button
              onClick={() => navigate('/preferences')}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">智能推荐，解决你的选择困难</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 位置获取区域 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 text-orange-500 mr-2" />
            获取你的位置
          </h2>

          {/* 自动定位 */}
          <div className="mb-6">
            <button
              onClick={handleAutoLocation}
              disabled={isLocating}
              className="w-full sm:w-auto px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <Navigation className="w-5 h-5 mr-2" />
              {isLocating ? '定位中...' : '自动获取位置'}
            </button>
            
            {locationError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{locationError}</p>
              </div>
            )}
            
            {location && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">当前位置</p>
                <p className="text-green-600 text-sm mt-1">
                  {location.address || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
                </p>
              </div>
            )}
          </div>

          {/* 手动输入地址 */}
          <div className="border-t pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              或手动输入地址
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
                placeholder="请输入你的工作地址"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                onKeyPress={(e) => e.key === 'Enter' && handleManualLocation()}
              />
              <button
                onClick={handleManualLocation}
                disabled={isSearching}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 disabled:opacity-50 transition-colors flex items-center"
              >
                <Search className="w-5 h-5 mr-2" />
                {isSearching ? '搜索中...' : '搜索'}
              </button>
            </div>
          </div>
        </div>

        {/* 快速推荐按钮 */}
        <div className="text-center">
          <button
            onClick={handleQuickRecommend}
            disabled={!location || isLoadingRestaurants || isGeneratingRecommendations}
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200"
          >
            <div className="flex items-center">
              <Utensils className="w-6 h-6 mr-3" />
              {isGeneratingRecommendations ? (
                '生成推荐中...'
              ) : isLoadingRestaurants ? (
                '搜索餐厅中...'
              ) : (
                '开始推荐'
              )}
            </div>
            
            {/* 装饰性背景 */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
          </button>
          
          <p className="text-gray-600 mt-4 text-sm">
            {!location 
              ? '请先获取位置信息再开始推荐' 
              : '基于你的位置和偏好，为你推荐最合适的餐厅'}
          </p>
        </div>

        {/* 功能介绍 */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">智能定位</h3>
            <p className="text-gray-600 text-sm">自动获取你的位置，发现周边美食</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">个性偏好</h3>
            <p className="text-gray-600 text-sm">设置口味偏好，获得精准推荐</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Utensils className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">智能推荐</h3>
            <p className="text-gray-600 text-sm">AI算法为你推荐最合适的餐厅</p>
          </div>
        </div>
      </div>
    </div>
  )
}