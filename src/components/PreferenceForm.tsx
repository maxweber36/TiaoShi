/**
 * 偏好设置表单组件
 * 提供菜系、价格、距离与饮食限制的设置
 * @param {UserPreferences} initial 初始偏好
 * @param {(prefs: Partial<UserPreferences>) => void} onSubmit 提交回调
 * @param {string} [submitLabel] 提交按钮文案
 */
import { useState } from 'react'
import { UserPreferences } from '../services/recommendation'
import { CUISINE_TYPES } from '../lib/poiTypes'

// 使用POI分类码表中的菜系类型
const CUISINE_OPTIONS = CUISINE_TYPES.map(cuisine => ({
  name: cuisine.name,
  code: cuisine.code,
  keywords: cuisine.keywords
}))

// 添加其他餐饮类型 - 基于官方POI标准
const OTHER_FOOD_TYPES = [
  { name: '咖啡厅', code: '050500', keywords: ['咖啡', 'coffee', 'cafe'] },
  { name: '茶艺馆', code: '050600', keywords: ['茶', '茶艺', '奶茶'] },
  { name: '甜品店', code: '050900', keywords: ['甜品', '蛋糕', 'dessert'] },
  { name: '快餐厅', code: '050300', keywords: ['快餐', '汉堡', '炸鸡'] },
  { name: '茶餐厅', code: '050305', keywords: ['茶餐厅', '港式'] },
  { name: '休闲餐饮', code: '050400', keywords: ['休闲餐饮', '简餐'] }
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

interface PreferenceFormProps {
  initial: UserPreferences
  onSubmit: (prefs: Partial<UserPreferences>) => void
  submitLabel?: string
}

export default function PreferenceForm({ initial, onSubmit, submitLabel = '保存偏好' }: PreferenceFormProps) {
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(Array.isArray(initial.cuisineTypes) ? initial.cuisineTypes : [])
  const [selectedPOITypes, setSelectedPOITypes] = useState<string[]>(Array.isArray(initial.poiTypes) ? initial.poiTypes : [])
  const [priceRange, setPriceRange] = useState<[number, number]>(Array.isArray(initial.priceRange) ? initial.priceRange as [number, number] : [1, 4])
  const [maxDistance, setMaxDistance] = useState<number>(typeof initial.maxDistance === 'number' ? initial.maxDistance : 1000)
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>(Array.isArray(initial.dietaryRestrictions) ? (initial.dietaryRestrictions as string[]) : [])

  /**
   * 切换菜系选择
   * @param {string} cuisine 菜系名称
   */
  const handleCuisineToggle = (cuisine: string) => {
    setSelectedCuisines(prev =>
      prev.includes(cuisine)
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    )
  }

  /**
   * 切换POI类型选择
   * @param {string} poiType POI类型码
   */
  const handlePOITypeToggle = (poiType: string) => {
    setSelectedPOITypes(prev =>
      prev.includes(poiType)
        ? prev.filter(t => t !== poiType)
        : [...prev, poiType]
    )
  }

  /**
   * 调整价格区间
   * @param {number} minLevel 最低价格等级
   * @param {number} maxLevel 最高价格等级
   */
  const handlePriceChange = (minLevel: number, maxLevel: number) => {
    setPriceRange([minLevel, maxLevel])
  }

  /**
   * 切换饮食限制选项
   * @param {string} restriction 饮食限制
   */
  const handleDietaryToggle = (restriction: string) => {
    setDietaryRestrictions(prev => 
      prev.includes(restriction)
        ? prev.filter(r => r !== restriction)
        : [...prev, restriction]
    )
  }

  /**
   * 提交偏好设置
   */
  const handleSubmit = () => {
    onSubmit({
      cuisineTypes: selectedCuisines,
      poiTypes: selectedPOITypes,
      priceRange,
      maxDistance,
      dietaryRestrictions
    })
  }

  return (
    <div className="space-y-6">
      {/* 菜系偏好 */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">偏好菜系</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {CUISINE_OPTIONS.map(cuisine => (
            <button
              key={cuisine.code}
              onClick={() => handleCuisineToggle(cuisine.name)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCuisines.includes(cuisine.name)
                  ? 'bg-orange-100 text-orange-700 border-2 border-orange-300'
                  : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
              }`}
            >
              {cuisine.name}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-3">选择你喜欢的菜系类型，可多选</p>
      </div>

      {/* 餐饮场所类型 */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">餐饮场所类型</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {OTHER_FOOD_TYPES.map(type => (
            <button
              key={type.code}
              onClick={() => handlePOITypeToggle(type.code)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPOITypes.includes(type.code)
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                  : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-3">选择喜欢的餐饮场所类型，可多选</p>
      </div>

      {/* 价格区间 */}
      <div>
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
                      const newMin = Math.min(priceRange[0], level)
                      const newMax = Math.max(priceRange[1], level)
                      handlePriceChange(newMin, newMax)
                    } else {
                      if (priceRange[0] === level && priceRange[1] === level) {
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
      <div>
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
      <div>
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

      <div className="pt-2">
        <button
          onClick={handleSubmit}
          className="w-full sm:w-auto px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  )
}
