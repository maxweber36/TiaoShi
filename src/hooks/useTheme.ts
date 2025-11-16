import { useState, useEffect } from 'react'

type Theme = 'light' | 'dark'

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

function resolvePreferredTheme(): Theme {
  if (!isBrowser) {
    return 'light'
  }

  const saved = window.localStorage.getItem('theme') as Theme | null
  if (saved) {
    return saved
  }

  if (typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  return 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => resolvePreferredTheme())

  useEffect(() => {
    if (!isBrowser) return

    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
    window.localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  return {
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  }
}
