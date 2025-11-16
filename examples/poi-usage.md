# POI分类码表使用示例

## 基本概念

本项目集成了高德地图POI分类码表，支持更精确的餐厅搜索和推荐。

## 使用方法

### 1. 基于POI类型搜索

```typescript
import { searchSpecificVenues } from '../services/restaurant'

// 搜索川菜和日料餐厅
const results = await searchSpecificVenues({
  latitude: 39.9042,
  longitude: 116.4074,
  types: ['050101', '050201'] // 川菜 + 日本料理
})
```

### 2. 使用专用搜索函数

```typescript
import {
  searchCafesAndTea,
  searchFastFoodAndSnacks,
  searchHotPotAndBBQ
} from '../services/restaurant'

// 搜索咖啡厅和茶饮店
const cafes = await searchCafesAndTea({
  latitude: 39.9042,
  longitude: 116.4074,
  radius: 1500
})

// 搜索快餐和小吃
const fastFood = await searchFastFoodAndSnacks({
  latitude: 39.9042,
  longitude: 116.4074
})
```

### 3. 用户偏好设置

```typescript
import { useAppStore } from '../store'

const { updatePreferences } = useAppStore()

// 设置包含POI类型的偏好
updatePreferences({
  cuisineTypes: ['川菜', '火锅'],
  poiTypes: ['050101', '050118', '050301'], // 川菜 + 火锅 + 咖啡厅
  maxDistance: 2000,
  priceRange: [1, 3]
})
```

### 4. 智能搜索Hook

```typescript
import { useRestaurants } from '../hooks/useRestaurants'

const {
  searchByPreferences,
  searchCafes,
  searchFastFood,
  searchHotPot
} = useRestaurants()

// 基于用户偏好的智能搜索
const personalizedResults = await searchByPreferences()

// 快捷搜索特定类型
const coffeeShops = await searchCafes(1000) // 1公里内的咖啡厅
const bbqPlaces = await searchHotPot(2000)  // 2公里内的火锅烧烤
```

## POI类型码参考

### 主要分类

| 分类码 | 名称 | 说明 |
|--------|------|------|
| 050000 | 餐饮服务 | 主分类，包含所有餐饮场所 |
| 050100 | 中餐 | 各式中式料理 |
| 050200 | 外国美食 | 各国料理 |
| 050300 | 休闲餐饮 | 咖啡厅、甜品店等 |
| 050400 | 酒吧 | 各类酒吧 |
| 050500 | 美食城/小吃城 | 美食街、夜市等 |

### 常用子分类（官方标准）

| 分类码 | 名称 | 关键词 |
|--------|------|--------|
| 050102 | 四川菜(川菜) | 川菜、麻辣、四川 |
| 050103 | 广东菜(粤菜) | 粤菜、广东、广州 |
| 050117 | 火锅店 | 火锅、涮锅 |
| 050119 | 海鲜酒楼 | 海鲜、海鲜酒楼 |
| 050120 | 中式素菜馆 | 素食、素菜 |
| 050202 | 日本料理 | 日本、料理、日料、寿司 |
| 050203 | 韩国料理 | 韩国、料理、韩式、烤肉 |
| 050500 | 咖啡厅 | 咖啡、coffee、cafe |
| 050600 | 茶艺馆 | 茶、茶艺、奶茶 |
| 050900 | 甜品店 | 甜品、蛋糕 |
| 050300 | 快餐厅 | 快餐、汉堡、炸鸡 |
| 050301 | 肯德基 | 肯德基、KFC |
| 050302 | 麦当劳 | 麦当劳、M记 |

### 主要分类群组

| 主分类 | 包含子分类 | 说明 |
|--------|-----------|------|
| 050100 | 050101-050123 | 中餐厅（各类中式料理） |
| 050200 | 050201-050217 | 外国餐厅（各国料理） |
| 050300 | 050301-050311 | 快餐厅（连锁快餐品牌） |
| 050500 | 050501-050504 | 咖啡厅（咖啡品牌） |
| 050600 | - | 茶艺馆 |
| 050900 | - | 甜品店 |

## 关键词智能映射

系统支持根据关键词自动推断POI类型（基于官方标准）：

```typescript
import { getPOICodeByKeyword } from '../lib/poiTypes'

const code1 = getPOICodeByKeyword('火锅')     // 返回: '050117' (火锅店)
const code2 = getPOICodeByKeyword('寿司')     // 返回: '050202' (日本料理)
const code3 = getPOICodeByKeyword('咖啡')     // 返回: '050500' (咖啡厅)
const code4 = getPOICodeByKeyword('海鲜')     // 返回: '050119' (海鲜酒楼)
const code5 = getPOICodeByKeyword('川菜')     // 返回: '050102' (四川菜)
const code6 = getPOICodeByKeyword('KFC')      // 返回: '050301' (肯德基)
```

## 组合搜索示例

```typescript
// 搜索多种类型的餐厅（使用正确的官方类型码）
const diverseResults = await searchNearbyRestaurants({
  latitude: 39.9042,
  longitude: 116.4074,
  types: ['050102', '050202', '050500', '050117'], // 川菜+日料+咖啡+火锅
  keywords: '美食', // 额外关键词
  radius: 1500
})

// 搜索所有中式餐厅
const chineseFood = await searchChineseRestaurants({
  latitude: 39.9042,
  longitude: 116.4074
})

// 搜索快餐品牌
const fastFood = await searchNearbyRestaurants({
  latitude: 39.9042,
  longitude: 116.4074,
  types: ['050301', '050302', '050303'], // 肯德基+麦当劳+必胜客
  keywords: '快餐'
})
```

## 注意事项

1. **类型码格式**: 必须使用6位字符串格式的类型码
2. **多类型组合**: 使用 `|` 分隔多个类型码，或传入数组
3. **兼容性**: 新功能向后兼容，不影响现有搜索功能
4. **性能**: 精确的POI类型搜索比纯关键词搜索更高效