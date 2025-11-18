# 打工人吃饭推荐应用

[English](README.md) | 中文

一个智能的餐厅推荐网页应用，帮助上班族解决"吃什么"的选择困难。

## 项目背景

这个项目来源于一次 AI Coding 的线下活动，主要是通过 AI 工具快速构建产品 demo，因此这个产品还非常粗糙，还有很多需要细致打磨的地方。对于这个产品的想法主要来自于解决在工作日的时候，每次到了饭点，和同事、朋友不知道吃什么的实际需求。我们希望通过智能推荐的方式，让大家能够更轻松地做出用餐选择，避免"选择困难症"带来的困扰。

## 功能特性

- 🎯 **智能定位**：自动获取用户位置或手动输入地址
- 🍽️ **个性偏好**：设置口味、价格、距离等偏好
- 🤖 **AI 推荐**：集成硅基流动 API 提供智能推荐
- 🗺️ **地图集成**：使用高德地图 API 获取周边餐厅信息
- 📱 **响应式设计**：适配移动端和桌面端

## 技术栈

- **前端**：React 18 + TypeScript + Tailwind CSS
- **状态管理**：Zustand
- **路由**：React Router DOM
- **图标**：Lucide React
- **API 集成**：高德地图 API、硅基流动 API

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

创建 `.env` 文件并按需填入以下变量：

| 变量 | 说明 |
| --- | --- |
| `VITE_AMAP_API_KEY` | 高德地图 API Key，生产环境必填 |
| `VITE_AMAP_SIG_SECRET` | （可选）启用接口签名校验时使用 |
| `VITE_SILICON_API_KEY` | 硅基流动 API Key，用于 AI 推荐 |
| `VITE_SILICON_MODEL` | （可选）AI 模型名称，默认 `Qwen/Qwen2.5-7B-Instruct` |
| `VITE_SILICON_MAX_TOKENS` | （可选）AI 响应 token 上限，默认 `2048` |
| `VITE_USE_DEMO_DATA` | 设为 `true` 可使用内置演示数据，便于无密钥开发 |

```env
VITE_AMAP_API_KEY=your_amap_api_key_here
VITE_AMAP_SIG_SECRET=
VITE_SILICON_API_KEY=your_silicon_api_key_here
VITE_SILICON_MODEL=Qwen/Qwen2.5-7B-Instruct
VITE_SILICON_MAX_TOKENS=2048
VITE_USE_DEMO_DATA=false
```

> ✅ 没有任何密钥也能本地体验：将 `VITE_USE_DEMO_DATA` 设为 `true`，系统会回退到内置餐厅和推荐样例，方便贡献者快速启动。

### 3. 启动开发服务器

```bash
pnpm run dev
```

### 4. 构建生产版本

```bash
pnpm run build
```

## 项目结构

```
src/
├── components/          # 可复用组件
├── hooks/              # 自定义Hook
├── pages/              # 页面组件
├── services/           # API服务
├── store/              # 状态管理
└── utils/              # 工具函数
```

## 核心功能

### 位置获取

- 浏览器 Geolocation API 自动定位
- 高德地图 API 地址解析
- 手动地址输入

### 餐厅搜索

- 基于位置的周边餐厅搜索
- 多种筛选条件（距离、价格、菜系）
- 餐厅详细信息获取

### 智能推荐

- 集成硅基流动 AI API
- 个性化推荐算法
- 多维度评分系统

### 用户偏好

- 菜系偏好设置
- 价格区间选择
- 距离范围设置
- 饮食限制选项

## API 配置

### 高德地图 API

- 申请地址：https://lbs.amap.com/
- 需要服务：地理编码、逆地理编码、地点搜索

### 硅基流动 API

- 申请地址：https://siliconflow.cn/
- 默认模型：`Qwen/Qwen2.5-7B-Instruct`（可在 `.env` 中覆盖）
- 默认响应 `max_tokens=2048`，可按需调大或调小

## 使用说明

1. **获取位置**：允许浏览器获取位置或手动输入地址
2. **设置偏好**：点击设置按钮配置个人偏好
3. **获取推荐**：点击"开始推荐"按钮获取智能推荐
4. **查看详情**：点击餐厅卡片查看详细信息
5. **导航功能**：点击导航按钮跳转到地图导航

## 本地开发体验

- **严格类型默认开启**：`pnpm run dev`、`pnpm run build` 会使用 TypeScript 严格配置，与 CI 一致。
- **演示数据模式**：启用 `VITE_USE_DEMO_DATA=true` 后，餐厅搜索与 AI 推荐均返回内置样例，便于离线或无密钥调试。
- **提交流程**：提交代码前运行 `pnpm run validate`，确保类型检查与 ESLint 均通过。

## 开发计划

- [ ] 添加用户登录和收藏功能
- [ ] 添加餐厅评价和评分系统

## 贡献指南

在提交 Issue 或 Pull Request 之前，请先阅读 [`CONTRIBUTING.zh.md`](CONTRIBUTING.zh.md)。

## 许可证

本项目在 [MIT License](LICENSE) 下发布。