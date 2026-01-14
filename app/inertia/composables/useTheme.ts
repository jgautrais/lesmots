import { ref, watch } from 'vue'

const STORAGE_KEY = 'theme'

const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light'

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      return parsed.state?.theme || 'light'
    } catch {
      return 'light'
    }
  }
  return 'light'
}

const theme = ref<'light' | 'dark'>(getInitialTheme())

const applyTheme = () => {
  if (typeof window === 'undefined') return
  document.documentElement.setAttribute('data-mode', theme.value)
  document.documentElement.className = theme.value
}

export function useTheme() {
  const switchTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: { theme: theme.value } }))
    applyTheme()
  }

  // Apply theme on initialization
  if (typeof window !== 'undefined') {
    applyTheme()
  }

  return {
    theme,
    switchTheme,
  }
}
