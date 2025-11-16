/**
 * 位置服务模块
 * 提供地理位置获取和地址解析功能
 */

import { md5 } from '../lib/md5'

export interface Location {
  latitude: number
  longitude: number
  address?: string
}

/**
 * 获取用户当前位置
 * 使用浏览器Geolocation API
 */
export async function getCurrentLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('浏览器不支持地理定位'))
      return
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      },
      (error) => {
        let errorMessage = '获取位置失败'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '用户拒绝了地理定位请求'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = '位置信息不可用'
            break
          case error.TIMEOUT:
            errorMessage = '获取位置超时'
            break
        }
        reject(new Error(errorMessage))
      },
      options
    )
  })
}

/**
 * 根据坐标获取地址信息（逆地理编码）
 * 使用高德地图API
 */
export async function getAddressFromCoordinates(latitude: number, longitude: number): Promise<string> {
  const amapKey = import.meta.env.VITE_AMAP_API_KEY
  const amapSigSecret = import.meta.env.VITE_AMAP_SIG_SECRET
  
  if (!amapKey) {
    console.warn('高德地图API密钥未配置')
    return ''
  }

  try {
    const path = '/v3/geocode/regeo'
    const params = new URLSearchParams({
      key: amapKey,
      location: `${longitude},${latitude}`,
      radius: '1000',
      extensions: 'base'
    })
    if (amapSigSecret) {
      const entries = Array.from(params.entries()).sort(([a],[b]) => a.localeCompare(b))
      const qs = entries.map(([k,v]) => `${k}=${v}`).join('&')
      const sig = md5(`${path}?${qs}${amapSigSecret}`)
      params.append('sig', sig)
    }
    const response = await fetch(
      `https://restapi.amap.com${path}?${params.toString()}`
    )
    
    const data = await response.json()
    
    if (data.status === '1' && data.regeocode) {
      return data.regeocode.formatted_address || '未知地址'
    } else {
      console.error('逆地理编码失败:', data.info)
      return ''
    }
  } catch (error) {
    console.error('获取地址信息失败:', error)
    return ''
  }
}

/**
 * 根据地址获取坐标（地理编码）
 * 使用高德地图API
 */
export async function getCoordinatesFromAddress(address: string): Promise<Location> {
  const amapKey = import.meta.env.VITE_AMAP_API_KEY
  const amapSigSecret = import.meta.env.VITE_AMAP_SIG_SECRET
  
  if (!amapKey) {
    throw new Error('高德地图API密钥未配置')
  }

  try {
    const path = '/v3/geocode/geo'
    const params = new URLSearchParams({
      key: amapKey,
      address: address
    })
    if (amapSigSecret) {
      const entries = Array.from(params.entries()).sort(([a],[b]) => a.localeCompare(b))
      const qs = entries.map(([k,v]) => `${k}=${v}`).join('&')
      const sig = md5(`${path}?${qs}${amapSigSecret}`)
      params.append('sig', sig)
    }
    const response = await fetch(
      `https://restapi.amap.com${path}?${params.toString()}`
    )
    
    const data = await response.json()
    
    if (data.status === '1' && data.geocodes && data.geocodes.length > 0) {
      const location = data.geocodes[0].location.split(',')
      return {
        latitude: parseFloat(location[1]),
        longitude: parseFloat(location[0]),
        address: data.geocodes[0].formatted_address
      }
    } else {
      throw new Error('地址解析失败')
    }
  } catch (error) {
    console.error('获取坐标信息失败:', error)
    throw error
  }
}

/**
 * 计算两点间的距离（米）
 * 使用Haversine公式
 */
export function calculateDistance(
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number {
  const R = 6371e3 // 地球半径（米）
  const φ1 = lat1 * Math.PI / 180
  const φ2 = lat2 * Math.PI / 180
  const Δφ = (lat2 - lat1) * Math.PI / 180
  const Δλ = (lng2 - lng1) * Math.PI / 180

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

  return R * c
}
