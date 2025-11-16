# Contributing Guide

Thanks for your interest in improving this project! This document outlines the basic workflow so contributions can ship smoothly.

## Prerequisites

- Node.js 20+
- pnpm 9+
- A GitHub account for issues/PRs

## Development workflow

1. Fork the repository and create a feature branch (`git checkout -b feature/awesome-improvement`).
2. Install dependencies with `pnpm install`.
3. Copy `.env.example` to `.env` and provide API keys or enable `VITE_USE_DEMO_DATA=true` for mock data.
4. Run `pnpm run dev` to iterate locally.
5. Before committing, run `pnpm run validate` (strict type-check + ESLint) and ensure the UI still works.
6. Commit using meaningful messages and submit a Pull Request against `main`.

## Commit & style conventions

- Use TypeScript strict mode and avoid `any` unless a TODO explains why.
- Prefer descriptive variable names; keep comments succinct.
- Follow the existing Tailwind utility ordering when possible.

## Pull Request checklist

- [ ] Tests and linters pass (`pnpm run validate`).
- [ ] New env vars are documented in `.env.example` and README.
- [ ] Screenshots/GIFs attached for UI changes.
- [ ] Linked issue referenced in the PR description.

Questions? Open a GitHub Discussion or start a draft PR for early feedback.
