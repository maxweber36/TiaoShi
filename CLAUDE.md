# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

一个基于React + TypeScript的智能餐厅推荐网页应用，帮助上班族解决"吃什么"的选择困难。集成高德地图API和硅基流动AI API提供个性化餐厅推荐服务。

## 技术栈
- **前端**: React 18 + TypeScript + Tailwind CSS
- **构建**: Vite 6
- **状态管理**: Zustand
- **路由**: React Router DOM
- **图标**: Lucide React

## 开发命令
```bash
pnpm install        # 安装依赖
pnpm run dev        # 启动开发服务器
pnpm run build      # 构建生产版本
pnpm run check      # 类型检查
pnpm run lint       # ESLint检查
```

## 环境配置
创建 `.env` 文件：
```env
VITE_AMAP_API_KEY=你的高德地图API密钥
VITE_SILICON_API_KEY=你的硅基流动API密钥
VITE_AMAP_SIG_SECRET=可选，高德地图签名密钥
```

## 项目结构
```
src/
├── components/          # 可复用UI组件
├── hooks/              # 自定义Hook
├── pages/              # 页面组件
├── services/           # API服务层
├── store/              # Zustand状态管理
├── lib/                # 工具函数
└── assets/             # 静态资源
```

## 核心架构

### 状态管理 (`src/store/index.ts`)
- 使用Zustand进行全局状态管理
- 持久化存储用户偏好设置
- 核心状态：位置、餐厅、推荐、加载状态

### API服务层
- **位置服务** (`location.ts`): Geolocation API + 高德地图地理编码
- **餐厅服务** (`restaurant.ts`): 高德地图周边搜索 + POI分类码表
- **推荐服务** (`recommendation.ts`): 硅基流动AI API + 基础算法备用
- **IP定位服务** (`ipLocation.ts`): IP定位降级方案

### POI分类系统 (`src/lib/poiTypes.ts`)
- 基于高德地图POI分类标准的完整码表
- 支持中餐、外国美食、休闲餐饮等分类
- 智能关键词到POI类型码的映射
- 支持多POI类型组合搜索

### 路由结构
- `/` - 首页（位置获取）
- `/preferences` - 用户偏好设置
- `/recommendations` - 餐厅推荐结果
- `/restaurant/:id` - 餐厅详情

## 关键代码模式

### 自定义Hook使用
```typescript
const { location, isLocating, error } = useLocation()
const {
  restaurants,
  isLoading,
  searchNearby,
  searchByPreferences,
  searchCafes,
  searchFastFood,
  searchHotPot
} = useRestaurants()
const { theme, toggleTheme } = useTheme()
```

### 状态管理使用
```typescript
const location = useLocation()
const preferences = usePreferences()
updatePreferences({
  cuisineTypes: ['川菜', '日料'],
  poiTypes: ['050101', '050201'], // POI类型码
  maxDistance: 1500
})
```

### API调用模式
```typescript
const location = await getCurrentLocation()

// 基本搜索
const restaurants = await searchNearbyRestaurants(location, keywords)

// POI类型搜索
const cafes = await searchCafesAndTea({
  latitude: location.latitude,
  longitude: location.longitude
})

// 基于偏好的智能搜索
const personalizedResults = await searchByPreferences()

const recommendations = await getAIRecommendations(restaurants, preferences)
```

## 开发注意事项

### TypeScript配置
- 宽松模式 (`strict: false`)
- 路径别名 `@/*` → `./src/*`
- 跳过库检查 (`skipLibCheck: true`)

### 错误处理
- 位置获取失败时有降级策略（GPS → IP → 粗略位置）
- API调用都有try-catch包装
- 用户友好的错误提示

### UI/UX设计
- 移动端优先的响应式设计
- 橙色渐变主题色 (#fb923c, #f97316)
- 卡片式信息展示
- 清晰的层级结构

## API集成要点

### 高德地图API
- 地理编码: `/v3/geocode/geo`
- 逆地理编码: `/v3/geocode/regeo`
- 周边搜索: `/v5/place/around`
- 详情获取: `/v5/place/detail`
- POI文本搜索: `/v5/place/text`
- 响应状态码为字符串'1'表示成功

### POI类型码使用
- `050000`: 餐饮服务（主分类）
- `050101`: 川菜、`050201`: 日本料理 等子分类
- 支持多类型码组合: `050101|050201|050301`
- 支持关键词智能类型推断

### 硅基流动API
- 模型: `Qwen/Qwen2.5-7B-Instruct`
- 端点: `https://api.siliconflow.cn/v1/chat/completions`
- 有备用算法确保服务可用性

## 扩展开发指南

### 添加新页面
1. 在 `src/pages/` 创建新页面组件
2. 在 `src/App.tsx` 添加路由
3. 更新导航逻辑

### 添加新API服务
1. 在 `src/services/` 创建服务模块
2. 定义接口类型和返回类型
3. 添加错误处理和重试逻辑

### 状态管理扩展
1. 在 `src/store/index.ts` 添加新状态字段
2. 添加对应的actions和selectors
3. 考虑是否需要持久化存储

## 调试技巧
- 使用React DevTools检查组件状态
- 在Zustand DevTools中查看状态变化
- 浏览器Network面板监控API调用
- Console面板查看详细的错误信息

## 常见问题解决
**位置获取失败**: 检查浏览器权限设置，确保使用HTTPS协议

**API调用失败**: 验证API密钥是否正确，检查网络连接

**构建错误**: 运行 `pnpm run check` 查看TypeScript错误

**样式问题**: 确认Tailwind类名是否正确，检查CSS优先级