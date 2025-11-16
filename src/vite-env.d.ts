/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AMAP_API_KEY?: string
  readonly VITE_AMAP_SIG_SECRET?: string
  readonly VITE_SILICON_API_KEY?: string
  readonly VITE_SILICON_MODEL?: string
  readonly VITE_SILICON_MAX_TOKENS?: string
  readonly VITE_USE_DEMO_DATA?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
