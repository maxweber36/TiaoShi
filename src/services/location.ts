/**
 * 位置服务模块
 * 提供地理位置获取和地址解析功能
 */

export interface Location {
  latitude: number
  longitude: number
  address?: string
}

function md5(s: string): string {
  function L(k: number, d: number) { return (k << d) | (k >>> (32 - d)) }
  function r(x: number) { return x & 0xffffffff }
  function C(x: number, y: number, z: number, w: number, a: number, b: number, c: number) {
    x = r(x + a + c); return r(L(x, b) + y)
  }
  function D(a: number) {
    const b = []
    for (let i = 0; i < a.length; i++) b.push(a.charCodeAt(i))
    return b
  }
  function E(a: number[]) {
    const b = []
    for (let i = 0; i < a.length * 32; i += 8) b.push((a[i >> 5] >>> (i % 32)) & 0xff)
    return b
  }
  function P(a: number[]) {
    const b = []
    for (let i = 0; i < a.length; i += 4) b.push(a[i] | (a[i + 1] << 8) | (a[i + 2] << 16) | (a[i + 3] << 24))
    return b
  }
  function Q(a: number[]) {
    const b = []
    for (let i = 0; i < a.length; i++) b.push((a[i >> 2] >>> ((i % 4) * 8)) & 0xff)
    return b
  }
  const g = D(unescape(encodeURIComponent(s)))
  const h = g.length
  const i = P(g)
  const j = Math.ceil((h + 1 + 8) / 64) * 16
  const k = new Array(j).fill(0)
  for (let x = 0; x < i.length; x++) k[x] = i[x]
  k[h >> 2] |= 0x80 << ((h % 4) * 8)
  k[j - 2] = h << 3
  let a = 1732584193
  let b = -271733879
  let c = -1732584194
  let d = 271733878
  for (let x = 0; x < k.length; x += 16) {
    const olda = a, oldb = b, oldc = c, oldd = d
    a = C(a, b, c, d, k[x + 0], 7, -680876936); d = C(d, a, b, c, k[x + 1], 12, -389564586)
    c = C(c, d, a, b, k[x + 2], 17, 606105819); b = C(b, c, d, a, k[x + 3], 22, -1044525330)
    a = C(a, b, c, d, k[x + 4], 7, -176418897); d = C(d, a, b, c, k[x + 5], 12, 1200080426)
    c = C(c, d, a, b, k[x + 6], 17, -1473231341); b = C(b, c, d, a, k[x + 7], 22, -45705983)
    a = C(a, b, c, d, k[x + 8], 7, 1770035416); d = C(d, a, b, c, k[x + 9], 12, -1958414417)
    c = C(c, d, a, b, k[x + 10], 17, -42063); b = C(b, c, d, a, k[x + 11], 22, -1990404162)
    a = C(a, b, c, d, k[x + 12], 7, 1804603682); d = C(d, a, b, c, k[x + 13], 12, -40341101)
    c = C(c, d, a, b, k[x + 14], 17, -1502002290); b = C(b, c, d, a, k[x + 15], 22, 1236535329)
    a = r(a + olda); b = r(b + oldb); c = r(c + oldc); d = r(d + oldd)
  }
  const out = Q(E([a, b, c, d]))
  const hex = '0123456789abcdef'
  let res = ''
  for (let i2 = 0; i2 < out.length; i2++) { res += hex.charAt((out[i2] >>> 4) & 0x0f) + hex.charAt(out[i2] & 0x0f) }
  return res
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
    return '位置信息获取失败'
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
      return '地址解析失败'
    }
  } catch (error) {
    console.error('获取地址信息失败:', error)
    return '地址解析失败'
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
      address: encodeURIComponent(address)
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