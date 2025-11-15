/**
 * 偏好设置页面组件
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Save } from 'lucide-react'
import { useRestaurants } from '../hooks/useRestaurants'

const CUISINE_TYPES = [
  '川菜', '粤菜', '湘菜', '东北菜', '鲁菜', '苏菜', '浙菜', '闽菜',
  '快餐', '简餐', '火锅', '烧烤', '日料', '韩料', '西餐', '东南亚菜',
  '素食', '清真', '小吃', '面馆', '饺子', '包子', '粥铺'
]

const PRICE_LEVELS = [
  { level: 1, label: '便宜 (人均<30元)', color: 'text-green-600' },
  { level: 2, label: '实惠 (人均30-60元)', color: 'text-blue-600' },
  { level: 3, label: '中等 (人均60-100元)', color: 'text-orange-600' },
  { level: 4, label: '高档 (人均>100元)', color: 'text-red-600' }
]

const DISTANCE_OPTIONS = [
  { value: 500, label: '500米内' },
  { value: 1000, label: '1公里内' },
  { value: 1500, label: '1.5公里内' },
  { value: 2000, label: '2公里内' },
  { value: 3000, label: '3公里内' }
]

export default function Preferences() {
  const navigate = useNavigate()
  const { updatePreferences, preferences } = useRestaurants()
  
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(preferences.cuisineTypes)
  const [priceRange, setPriceRange] = useState<[number, number]>(preferences.priceRange)
  const [maxDistance, setMaxDistance] = useState<number>(preferences.maxDistance)
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>(preferences.dietaryRestrictions || [])

  const handleCuisineToggle = (cuisine: string) => {
    setSelectedCuisines(prev => 
      prev.includes(cuisine) 
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    )
  }

  const handlePriceChange = (minLevel: number, maxLevel: number) => {
    setPriceRange([minLevel, maxLevel])
  }

  const handleDietaryToggle = (restriction: string) => {
    setDietaryRestrictions(prev => 
      prev.includes(restriction)
        ? prev.filter(r => r !== restriction)
        : [...prev, restriction]
    )
  }

  const handleSave = () => {
    updatePreferences({
      cuisineTypes: selectedCuisines,
      priceRange,
      maxDistance,
      dietaryRestrictions
    })
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            返回
          </button>
          <h1 className="text-lg font-semibold text-gray-900">偏好设置</h1>
          <button 
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            保存
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* 菜系偏好 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">偏好菜系</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {CUISINE_TYPES.map(cuisine => (
              <button
                key={cuisine}
                onClick={() => handleCuisineToggle(cuisine)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCuisines.includes(cuisine)
                    ? 'bg-orange-100 text-orange-700 border-2 border-orange-300'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-3">选择你喜欢的菜系类型，可多选</p>
        </div>

        {/* 价格区间 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">价格区间</h2>
          <div className="space-y-3">
            {PRICE_LEVELS.map(({ level, label, color }) => {
              const isSelected = priceRange[0] <= level && level <= priceRange[1]
              return (
                <div key={level} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`price-${level}`}
                    checked={isSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        // 扩展价格区间
                        const newMin = Math.min(priceRange[0], level)
                        const newMax = Math.max(priceRange[1], level)
                        handlePriceChange(newMin, newMax)
                      } else {
                        // 收缩价格区间
                        if (priceRange[0] === level && priceRange[1] === level) {
                          // 不能取消最后一个选择
                          return
                        }
                        const newMin = level === priceRange[0] ? priceRange[0] + 1 : priceRange[0]
                        const newMax = level === priceRange[1] ? priceRange[1] - 1 : priceRange[1]
                        handlePriceChange(newMin, newMax)
                      }
                    }}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor={`price-${level}`} className={`ml-3 text-sm ${color}`}>
                    {label}
                  </label>
                </div>
              )
            })}
          </div>
          <p className="text-sm text-gray-500 mt-3">选择你能接受的价格范围</p>
        </div>

        {/* 距离设置 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">距离范围</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {DISTANCE_OPTIONS.map(option => (
              <button
                key={option.value}
                onClick={() => setMaxDistance(option.value)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  maxDistance === option.value
                    ? 'bg-orange-100 text-orange-700 border-2 border-orange-300'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-3">设置你能接受的最远距离</p>
        </div>

        {/* 饮食限制 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">饮食限制</h2>
          <div className="space-y-3">
            {['素食', '清真', '无辣', '少油', '少盐'].map(restriction => (
              <div key={restriction} className="flex items-center">
                <input
                  type="checkbox"
                  id={`dietary-${restriction}`}
                  checked={dietaryRestrictions.includes(restriction)}
                  onChange={() => handleDietaryToggle(restriction)}
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <label htmlFor={`dietary-${restriction}`} className="ml-3 text-sm text-gray-700">
                  {restriction}
                </label>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-3">如有特殊饮食需求，请勾选</p>
        </div>

        {/* 提示信息 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">设置提示</h3>
              <div className="text-sm text-blue-700 mt-1">
                <p>• 设置越详细，推荐结果越精准</p>
                <p>• 可以随时修改这些设置</p>
                <p>• 系统会根据你的选择智能推荐餐厅</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}