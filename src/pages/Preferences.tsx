/**
 * 偏好设置页面组件
 */

import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useRestaurants } from '../hooks/useRestaurants'
import PreferenceForm from '@/components/PreferenceForm'

export default function Preferences() {
  const navigate = useNavigate()
  const { updatePreferences, preferences } = useRestaurants()
  const prefs = preferences || {
    cuisineTypes: [],
    priceRange: [1, 4],
    maxDistance: 1000,
    dietaryRestrictions: [],
    preferredTime: 'lunch'
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
          <div />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <PreferenceForm
            initial={prefs}
            submitLabel="保存"
            onSubmit={(newPrefs) => {
              updatePreferences(newPrefs)
              navigate('/')
            }}
          />
        </div>
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
