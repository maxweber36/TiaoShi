/**
 * 位置获取Hook
 * 处理用户位置获取逻辑
 */

import { useCallback } from 'react'
import { 
  getCurrentLocation, 
  getAddressFromCoordinates,
  getCoordinatesFromAddress,
  Location 
} from '../services/location'
import { getLocationByIP, getApproximateLocation } from '../services/ipLocation'
import { useAppStore } from '../store'

export function useLocation() {
  const { 
    currentLocation, 
    isLocating, 
    locationError,
    setLocation, 
    setLocating, 
    setLocationError,
    clearError 
  } = useAppStore()

  /**
   * 获取当前位置（优先使用GPS，回退到IP定位）
   */
  const fetchCurrentLocation = useCallback(async () => {
    try {
      setLocating(true)
      setLocationError(null)

      let location: Location

      // 首先尝试GPS定位
      try {
        location = await getCurrentLocation()
        // 获取地址信息
        const address = await getAddressFromCoordinates(location.latitude, location.longitude)
        const locationWithAddress = { ...location, address }
        setLocation(locationWithAddress)
        return locationWithAddress
      } catch (gpsError) {
        console.warn('GPS定位失败，尝试IP定位:', gpsError)
      }

      // GPS失败，尝试IP定位
      try {
        location = await getLocationByIP()
        const locationWithAddress = { ...location }
        setLocation(locationWithAddress)
        return locationWithAddress
      } catch (ipError) {
        console.warn('IP定位失败，使用粗略位置:', ipError)
      }

      // IP定位失败，使用粗略位置
      location = await getApproximateLocation()
      const locationWithAddress = { ...location }
      setLocation(locationWithAddress)
      return locationWithAddress

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取位置失败'
      setLocationError(errorMessage)
      throw error
    } finally {
      setLocating(false)
    }
  }, [setLocation, setLocating, setLocationError])

  /**
   * 仅使用IP获取位置（隐私友好）
   */
  const fetchLocationByIP = useCallback(async () => {
    try {
      setLocating(true)
      setLocationError(null)

      const location = await getApproximateLocation()
      setLocation(location)
      return location
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'IP定位失败'
      setLocationError(errorMessage)
      throw error
    } finally {
      setLocating(false)
    }
  }, [setLocation, setLocating, setLocationError])

  /**
   * 手动设置位置
   */
  const setManualLocation = useCallback((location: Location) => {
    setLocation(location)
    clearError()
  }, [setLocation, clearError])

  /**
   * 根据地址解析经纬度并更新位置
   * @param {string} address 用户输入的地址
   * @returns {Promise<Location>} 解析后的位置信息，包含经纬度与地址
   */
  const geocodeAddress = useCallback(async (address: string) => {
    try {
      setLocating(true)
      setLocationError(null)

      const location = await getCoordinatesFromAddress(address)
      setLocation(location)
      return location
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '地址解析失败'
      setLocationError(errorMessage)
      throw error
    } finally {
      setLocating(false)
    }
  }, [setLocation, setLocating, setLocationError])

  return {
    location: currentLocation,
    isLocating,
    locationError,
    fetchCurrentLocation,
    fetchLocationByIP,
    setManualLocation,
    geocodeAddress
  }
}