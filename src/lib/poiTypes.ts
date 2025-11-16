/**
 * 高德地图POI分类码表
 * 基于高德地图官方POI分类标准，主要包含餐饮相关的分类码
 */

export interface POICategory {
  code: string
  name: string
  keywords?: string[]
  subcategories?: POICategory[]
}

/**
 * 餐饮服务相关POI分类 (050000) - 官方标准
 */
export const RESTAURANT_CATEGORIES: POICategory = {
  code: '050000',
  name: '餐饮服务',
  subcategories: [
    {
      code: '050100',
      name: '中餐厅',
      subcategories: [
        { code: '050101', name: '综合酒楼' },
        { code: '050102', name: '四川菜(川菜)', keywords: ['川菜', '麻辣', '四川'] },
        { code: '050103', name: '广东菜(粤菜)', keywords: ['粤菜', '广东', '广州'] },
        { code: '050104', name: '山东菜(鲁菜)', keywords: ['鲁菜', '山东'] },
        { code: '050105', name: '江苏菜', keywords: ['苏菜', '江苏'] },
        { code: '050106', name: '浙江菜', keywords: ['浙菜', '浙江'] },
        { code: '050107', name: '上海菜', keywords: ['沪菜', '上海'] },
        { code: '050108', name: '湖南菜(湘菜)', keywords: ['湘菜', '湖南'] },
        { code: '050109', name: '安徽菜(徽菜)', keywords: ['徽菜', '安徽'] },
        { code: '050110', name: '福建菜', keywords: ['闽菜', '福建'] },
        { code: '050111', name: '北京菜', keywords: ['京菜', '北京'] },
        { code: '050112', name: '湖北菜(鄂菜)', keywords: ['鄂菜', '湖北'] },
        { code: '050113', name: '东北菜', keywords: ['东北菜', '东北'] },
        { code: '050114', name: '云贵菜', keywords: ['云南菜', '贵州菜', '云贵'] },
        { code: '050115', name: '西北菜', keywords: ['西北菜', '陕西', '甘肃'] },
        { code: '050116', name: '老字号', keywords: ['老字号', '传统'] },
        { code: '050117', name: '火锅店', keywords: ['火锅', '涮锅'] },
        { code: '050118', name: '特色/地方风味餐厅', keywords: ['特色', '地方风味'] },
        { code: '050119', name: '海鲜酒楼', keywords: ['海鲜', '海鲜酒楼'] },
        { code: '050120', name: '中式素菜馆', keywords: ['素食', '素菜'] },
        { code: '050121', name: '清真菜馆', keywords: ['清真', '回民'] },
        { code: '050122', name: '台湾菜', keywords: ['台湾菜', '台湾'] },
        { code: '050123', name: '潮州菜', keywords: ['潮菜', '潮汕'] }
      ]
    },
    {
      code: '050200',
      name: '外国餐厅',
      subcategories: [
        { code: '050201', name: '西餐厅(综合风味)', keywords: ['西餐', '西式'] },
        { code: '050202', name: '日本料理', keywords: ['日本', '料理', '日料', '寿司'] },
        { code: '050203', name: '韩国料理', keywords: ['韩国', '料理', '韩式', '烤肉'] },
        { code: '050204', name: '法式菜品餐厅', keywords: ['法国菜', '法式'] },
        { code: '050205', name: '意式菜品餐厅', keywords: ['意大利菜', '意式'] },
        { code: '050206', name: '泰国/越南菜品餐厅', keywords: ['泰国菜', '越南菜', '泰式', '越式'] },
        { code: '050207', name: '地中海风格菜品', keywords: ['地中海菜', '地中海'] },
        { code: '050208', name: '美式风味', keywords: ['美国菜', '美式'] },
        { code: '050209', name: '印度风味', keywords: ['印度菜', '印度'] },
        { code: '050210', name: '英国式菜品餐厅', keywords: ['英国菜', '英式'] },
        { code: '050211', name: '牛扒店(扒房)', keywords: ['牛扒', '牛排', '扒房'] },
        { code: '050212', name: '俄国菜', keywords: ['俄罗斯菜', '俄式'] },
        { code: '050213', name: '葡国菜', keywords: ['葡萄牙菜', '葡式'] },
        { code: '050214', name: '德国菜', keywords: ['德国菜', '德式'] },
        { code: '050215', name: '巴西菜', keywords: ['巴西菜', '巴西'] },
        { code: '050216', name: '墨西哥菜', keywords: ['墨西哥菜', '墨西哥'] },
        { code: '050217', name: '其它亚洲菜', keywords: ['亚洲菜'] }
      ]
    },
    {
      code: '050300',
      name: '快餐厅',
      subcategories: [
        { code: '050301', name: '肯德基', keywords: ['肯德基', 'KFC'] },
        { code: '050302', name: '麦当劳', keywords: ['麦当劳', 'M记'] },
        { code: '050303', name: '必胜客', keywords: ['必胜客', 'Pizza Hut'] },
        { code: '050304', name: '永和豆浆', keywords: ['永和豆浆'] },
        { code: '050305', name: '茶餐厅', keywords: ['茶餐厅', '港式茶餐厅'] },
        { code: '050306', name: '大家乐', keywords: ['大家乐'] },
        { code: '050307', name: '大快活', keywords: ['大快活'] },
        { code: '050308', name: '美心', keywords: ['美心'] },
        { code: '050309', name: '吉野家', keywords: ['吉野家', '日式快餐'] },
        { code: '050310', name: '仙跡岩', keywords: ['仙跡岩'] },
        { code: '050311', name: '呷哺呷哺', keywords: ['呷哺呷哺', '小火锅'] }
      ]
    },
    {
      code: '050400',
      name: '休闲餐饮场所',
      subcategories: [
        // 休闲餐饮场所的子分类在官方标准中没有详细列出
      ]
    },
    {
      code: '050500',
      name: '咖啡厅',
      subcategories: [
        { code: '050501', name: '星巴克咖啡', keywords: ['星巴克', 'Starbucks'] },
        { code: '050502', name: '上岛咖啡', keywords: ['上岛咖啡'] },
        { code: '050503', name: 'Pacific Coffee Company', keywords: ['Pacific Coffee', 'PCC'] },
        { code: '050504', name: '巴黎咖啡店', keywords: ['巴黎咖啡店'] }
      ]
    },
    {
      code: '050600',
      name: '茶艺馆',
      subcategories: [
        // 茶艺馆的子分类在官方标准中没有详细列出
      ]
    },
    {
      code: '050700',
      name: '冷饮店',
      subcategories: [
        // 冷饮店的子分类在官方标准中没有详细列出
      ]
    },
    {
      code: '050800',
      name: '糕饼店',
      subcategories: [
        // 糕饼店的子分类在官方标准中没有详细列出
      ]
    },
    {
      code: '050900',
      name: '甜品店',
      subcategories: [
        // 甜品店的子分类在官方标准中没有详细列出
      ]
    }
  ]
}

/**
 * 获取POI分类名称
 */
export function getCategoryName(code: string): string {
  function findCategory(category: POICategory): string | null {
    // 检查当前分类是否匹配
    if (category.code === code) {
      return category.name
    }

    // 递归搜索子分类
    if (category.subcategories) {
      for (const subcategory of category.subcategories) {
        // 检查子分类是否匹配
        if (subcategory.code === code) {
          return subcategory.name
        }

        // 递归搜索更深层的子分类
        const result = findCategory(subcategory)
        if (result) {
          return result
        }
      }
    }

    return null
  }

  return findCategory(RESTAURANT_CATEGORIES) || '餐饮服务'
}

/**
 * 获取子分类列表
 */
export function getSubcategories(parentCode: string): POICategory[] {
  function findCategory(category: POICategory): POICategory | null {
    if (category.code === parentCode) {
      return category
    }
    if (category.subcategories) {
      for (const subcategory of category.subcategories) {
        const result = findCategory(subcategory)
        if (result) return result
      }
    }
    return null
  }

  const category = findCategory(RESTAURANT_CATEGORIES)
  return category?.subcategories || []
}

/**
 * 获取所有餐饮相关的分类码
 */
export function getAllRestaurantCodes(): string[] {
  const codes: string[] = []

  function collectCodes(category: POICategory) {
    codes.push(category.code)
    if (category.subcategories) {
      category.subcategories.forEach(collectCodes)
    }
  }

  collectCodes(RESTAURANT_CATEGORIES)
  return codes
}

/**
 * 常用菜系列表 - 基于官方POI标准
 */
export const CUISINE_TYPES = [
  // 中餐类
  { code: '050102', name: '川菜', keywords: ['川菜', '麻辣', '四川'] },
  { code: '050103', name: '粤菜', keywords: ['粤菜', '广东', '广州'] },
  { code: '050108', name: '湘菜', keywords: ['湘菜', '湖南', '湘'] },
  { code: '050104', name: '鲁菜', keywords: ['鲁菜', '山东'] },
  { code: '050105', name: '苏菜', keywords: ['苏菜', '江苏'] },
  { code: '050106', name: '浙菜', keywords: ['浙菜', '浙江'] },
  { code: '050113', name: '东北菜', keywords: ['东北菜', '东北'] },
  { code: '050114', name: '云贵菜', keywords: ['云南菜', '贵州菜', '云贵'] },

  // 火锅和特色菜
  { code: '050117', name: '火锅店', keywords: ['火锅', '涮锅'] },
  { code: '050119', name: '海鲜酒楼', keywords: ['海鲜', '海鲜酒楼'] },
  { code: '050120', name: '中式素菜馆', keywords: ['素食', '素菜'] },
  { code: '050121', name: '清真菜馆', keywords: ['清真', '回民'] },

  // 外国菜
  { code: '050202', name: '日本料理', keywords: ['日本', '料理', '日料', '寿司'] },
  { code: '050203', name: '韩国料理', keywords: ['韩国', '料理', '韩式', '烤肉'] },
  { code: '050206', name: '泰国/越南菜品', keywords: ['泰国菜', '越南菜', '泰式', '越式'] },
  { code: '050201', name: '西餐厅', keywords: ['西餐', '西式'] },
  { code: '050204', name: '法式菜品', keywords: ['法国菜', '法式'] },
  { code: '050205', name: '意式菜品', keywords: ['意大利菜', '意式'] },

  // 快餐
  { code: '050301', name: '肯德基', keywords: ['肯德基', 'KFC'] },
  { code: '050302', name: '麦当劳', keywords: ['麦当劳', 'M记'] },
  { code: '050303', name: '必胜客', keywords: ['必胜客', '披萨'] },
  { code: '050309', name: '吉野家', keywords: ['吉野家', '日式快餐'] },

  // 咖啡厅和饮品
  { code: '050501', name: '星巴克咖啡', keywords: ['星巴克', 'Starbucks'] },
  { code: '050500', name: '咖啡厅', keywords: ['咖啡', 'coffee', 'cafe'] },
  { code: '050600', name: '茶艺馆', keywords: ['茶', '茶艺', '奶茶'] },
  { code: '050900', name: '甜品店', keywords: ['甜品', '蛋糕'] },

  // 休闲餐饮
  { code: '050305', name: '茶餐厅', keywords: ['茶餐厅', '港式'] },
  { code: '050400', name: '休闲餐饮场所', keywords: ['休闲餐饮', '简餐'] }
]

/**
 * 菜系名称映射表 - 支持用户选择名称到官方分类名称的转换
 */
export const CUISINE_NAME_MAP: Record<string, string[]> = {
  '川菜': ['川菜', '四川菜', '麻辣'],
  '粤菜': ['粤菜', '广东菜', '广州菜'],
  '湘菜': ['湘菜', '湖南菜'],
  '鲁菜': ['鲁菜', '山东菜'],
  '苏菜': ['苏菜', '江苏菜'],
  '浙菜': ['浙菜', '浙江菜'],
  '闽菜': ['闽菜', '福建菜'],
  '徽菜': ['徽菜', '安徽菜'],
  '京菜': ['京菜', '北京菜'],
  '沪菜': ['沪菜', '上海菜'],
  '东北菜': ['东北菜'],
  '云贵菜': ['云贵菜', '云南菜', '贵州菜'],
  '西北菜': ['西北菜'],
  '日料': ['日本料理', '日料', '日式料理'],
  '韩料': ['韩国料理', '韩料', '韩式料理'],
  '西餐': ['西餐厅', '西餐', '西式料理'],
  '火锅': ['火锅店', '火锅'],
  '海鲜': ['海鲜酒楼', '海鲜'],
  '素食': ['中式素菜馆', '素食', '素菜'],
  '清真': ['清真菜馆', '清真'],
  '咖啡': ['咖啡厅', '咖啡'],
  '茶饮': ['茶艺馆', '茶饮'],
  '甜品': ['甜品店', '甜品'],
  '快餐': ['快餐厅', '快餐'],
  '茶餐厅': ['茶餐厅']
}

/**
 * 根据关键词获取POI类型码
 */
export function getPOICodeByKeyword(keyword: string): string | null {
  const lowerKeyword = keyword.toLowerCase()

  for (const cuisine of CUISINE_TYPES) {
    // 首先检查菜系名称是否匹配
    if (cuisine.name.toLowerCase() === lowerKeyword ||
        cuisine.name.toLowerCase().includes(lowerKeyword) ||
        lowerKeyword.includes(cuisine.name.toLowerCase())) {
      return cuisine.code
    }

    // 然后检查关键词
    if (cuisine.keywords.some(kw => lowerKeyword.includes(kw.toLowerCase()))) {
      return cuisine.code
    }
  }

  return '050000' // 默认返回餐饮服务
}

/**
 * 检查餐厅是否匹配用户菜系偏好
 * @param restaurantCategory 餐厅分类名称（从POI API返回）
 * @param userPreferences 用户选择的菜系名称
 * @returns 是否匹配
 */
export function checkCuisineMatch(restaurantCategory: string, userPreferences: string[]): boolean {
  if (userPreferences.length === 0) {
    return true // 用户没有偏好，认为所有都匹配
  }

  const lowerRestaurantCategory = restaurantCategory.toLowerCase()

  // 检查用户的每个偏好是否匹配餐厅分类
  for (const preference of userPreferences) {
    // 获取该偏好的所有可能匹配名称
    const possibleNames = CUISINE_NAME_MAP[preference] || [preference]

    // 检查餐厅分类是否包含任何一个匹配名称
    const hasMatch = possibleNames.some(name =>
      lowerRestaurantCategory.includes(name.toLowerCase()) ||
      name.toLowerCase().includes(lowerRestaurantCategory)
    )

    if (hasMatch) {
      return true
    }
  }

  return false
}

/**
 * 获取餐厅的匹配菜系名称
 * @param restaurantCategory 餐厅分类名称
 * @returns 匹配的菜系名称数组
 */
export function getMatchingCuisines(restaurantCategory: string): string[] {
  const lowerRestaurantCategory = restaurantCategory.toLowerCase()
  const matchingCuisines: string[] = []

  for (const [userCuisine, possibleNames] of Object.entries(CUISINE_NAME_MAP)) {
    const hasMatch = possibleNames.some(name =>
      lowerRestaurantCategory.includes(name.toLowerCase()) ||
      name.toLowerCase().includes(lowerRestaurantCategory)
    )

    if (hasMatch) {
      matchingCuisines.push(userCuisine)
    }
  }

  return matchingCuisines
}