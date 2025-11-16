# 贡献指南

感谢您对本项目的关注和改进！本文档概述了基本的工作流程，以便贡献能够顺利发布。

## 前置要求

- Node.js 20+
- pnpm 9+
- 用于提交 Issue/PR 的 GitHub 账户

## 开发工作流程

1. Fork 仓库并创建功能分支（`git checkout -b feature/awesome-improvement`）。
2. 使用 `pnpm install` 安装依赖。
3. 复制 `.env.example` 到 `.env`，提供 API 密钥或启用 `VITE_USE_DEMO_DATA=true` 使用模拟数据。
4. 运行 `pnpm run dev` 进行本地迭代开发。
5. 提交前运行 `pnpm run validate`（严格类型检查 + ESLint）并确保 UI 仍然正常工作。
6. 使用有意义的提交信息提交，并向 `main` 分支提交 Pull Request。

## 提交和代码风格约定

- 使用 TypeScript 严格模式，除非有 TODO 说明原因，否则避免使用 `any`。
- 优先使用描述性的变量名；保持注释简洁。
- 尽可能遵循现有的 Tailwind 工具类排序。

## Pull Request 检查清单

- [ ] 测试和检查器通过（`pnpm run validate`）。
- [ ] 新的环境变量已记录在 `.env.example` 和 README 中。
- [ ] 为 UI 更改附上截图/GIF。
- [ ] 在 PR 描述中引用相关 Issue。

如有疑问？请开启 GitHub Discussion 或创建草稿 PR 以获取早期反馈。