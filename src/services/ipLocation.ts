/**
 * IP地理位置服务
 * 提供基于IP的地理位置获取功能
 */

import { Location } from './location'

/**
 * 通过IP获取地理位置
 * 使用IP定位API服务
 */
export async function getLocationByIP(): Promise<Location> {
  try {
    // 尝试使用多个IP定位服务
    const services = [
      getLocationByIPAPI,
      getLocationByIPWhois,
      getLocationByIPInfo
    ]

    for (const service of services) {
      try {
        const location = await service()
        if (location && location.latitude && location.longitude) {
          return location
        }
      } catch (error) {
        console.warn(`IP定位服务失败: ${service.name}`, error)
        continue
      }
    }

    throw new Error('所有IP定位服务都不可用')
  } catch (error) {
    console.error('IP定位失败:', error)
    throw error
  }
}

/**
 * IP-API服务
 */
async function getLocationByIPAPI(): Promise<Location> {
  const response = await fetch('http://ip-api.com/json/?fields=status,message,lat,lon,city,country')
  const data = await response.json()
  
  if (data.status === 'success') {
    return {
      latitude: data.lat,
      longitude: data.lon,
      address: `${data.city}, ${data.country}`
    }
  } else {
    throw new Error(data.message || 'IP-API服务失败')
  }
}

/**
 * IPWhois服务
 */
async function getLocationByIPWhois(): Promise<Location> {
  const response = await fetch('https://ipwho.is/')
  const data = await response.json()
  
  if (data.success) {
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      address: `${data.city}, ${data.region}, ${data.country}`
    }
  } else {
    throw new Error(data.message || 'IPWhois服务失败')
  }
}

/**
 * IPInfo服务
 */
async function getLocationByIPInfo(): Promise<Location> {
  const response = await fetch('https://ipinfo.io/json')
  const data = await response.json()
  
  if (data.loc) {
    const [latitude, longitude] = data.loc.split(',').map(Number)
    return {
      latitude,
      longitude,
      address: `${data.city}, ${data.region}, ${data.country}`
    }
  } else {
    throw new Error('IPInfo服务无法获取位置信息')
  }
}

/**
 * 获取用户IP地址
 */
export async function getUserIP(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    return data.ip
  } catch (error) {
    console.error('获取IP地址失败:', error)
    throw error
  }
}

/**
 * 获取粗略位置（城市级别）
 * 用于隐私友好的位置估算
 */
export async function getApproximateLocation(): Promise<Location> {
  try {
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()
    
    return {
      latitude: data.latitude || 39.9042, // 默认北京
      longitude: data.longitude || 116.4074,
      address: `${data.city || '北京'}, ${data.region || '北京'}, ${data.country_name || '中国'}`
    }
  } catch (error) {
    console.error('获取粗略位置失败:', error)
    // 返回默认位置（北京）
    return {
      latitude: 39.9042,
      longitude: 116.4074,
      address: '北京市'
    }
  }
}