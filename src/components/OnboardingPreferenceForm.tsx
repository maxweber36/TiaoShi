/**
 * 首次访问分步偏好表单
 * 以分步形式收集菜系、价格、距离与饮食限制
 * @param {UserPreferences} initial 初始偏好
 * @param {(prefs: Partial<UserPreferences>) => void} onFinish 完成回调
 * @param {() => void} onSkip 跳过回调
 */
import { useState } from 'react'
import { UserPreferences } from '../services/recommendation'

interface Props {
  initial: UserPreferences
  onFinish: (prefs: Partial<UserPreferences>) => void
  onSkip: () => void
}

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

const STEPS = ['偏好菜系', '价格区间', '距离范围', '饮食限制']

export default function OnboardingPreferenceForm({ initial, onFinish, onSkip }: Props) {
  const [step, setStep] = useState<number>(0)
  const [cuisineTypes, setCuisineTypes] = useState<string[]>(Array.isArray(initial.cuisineTypes) ? initial.cuisineTypes : [])
  const [priceRange, setPriceRange] = useState<[number, number]>(Array.isArray(initial.priceRange) ? initial.priceRange as [number, number] : [1, 4])
  const [maxDistance, setMaxDistance] = useState<number>(typeof initial.maxDistance === 'number' ? initial.maxDistance : 1000)
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>(Array.isArray(initial.dietaryRestrictions) ? (initial.dietaryRestrictions as string[]) : [])

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const prev = () => setStep((s) => Math.max(s - 1, 0))

  const finish = () => {
    onFinish({ cuisineTypes, priceRange, maxDistance, dietaryRestrictions })
  }

  return (
    <div>
      {/* 进度指示 */}
      <div className="flex items-center mb-4">
        {STEPS.map((label, idx) => (
          <div key={label} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${idx <= step ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'}`}>{idx + 1}</div>
            <span className={`ml-2 mr-4 text-sm ${idx === step ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>{label}</span>
            {idx < STEPS.length - 1 && (
              <div className={`w-10 h-px ${idx < step ? 'bg-orange-500' : 'bg-gray-300'}`} />
            )}
          </div>
        ))}
      </div>

      {/* 步骤内容 */}
      {step === 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">选择你喜欢的菜系</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {CUISINE_TYPES.map(cuisine => (
              <button
                key={cuisine}
                onClick={() => {
                  setCuisineTypes(prev => prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine])
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  cuisineTypes.includes(cuisine)
                    ? 'bg-orange-100 text-orange-700 border-2 border-orange-300'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">设置你能接受的价格范围</h2>
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
                        setPriceRange([newMin, newMax])
                      } else {
                        if (priceRange[0] === level && priceRange[1] === level) return
                        const newMin = level === priceRange[0] ? priceRange[0] + 1 : priceRange[0]
                        const newMax = level === priceRange[1] ? priceRange[1] - 1 : priceRange[1]
                        setPriceRange([newMin, newMax])
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
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">选择你能接受的最远距离</h2>
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
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">是否有饮食限制</h2>
          <div className="space-y-3">
            {['素食', '清真', '无辣', '少油', '少盐'].map(restriction => (
              <div key={restriction} className="flex items-center">
                <input
                  type="checkbox"
                  id={`dietary-${restriction}`}
                  checked={dietaryRestrictions.includes(restriction)}
                  onChange={() => {
                    setDietaryRestrictions(prev => prev.includes(restriction) ? prev.filter(r => r !== restriction) : [...prev, restriction])
                  }}
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <label htmlFor={`dietary-${restriction}`} className="ml-3 text-sm text-gray-700">
                  {restriction}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 底部操作栏 */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={onSkip}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          稍后再说
        </button>
        <div className="flex gap-3">
          <button
            onClick={prev}
            disabled={step === 0}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            上一步
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={next}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              下一步
            </button>
          ) : (
            <button
              onClick={finish}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              保存偏好并开始使用
            </button>
          )}
        </div>
      </div>
    </div>
  )
}