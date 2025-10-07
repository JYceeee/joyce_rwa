import { ref, computed } from 'vue'

// 主题状态管理
const currentTheme = ref('dark')

// 主题配置
const themes = {
  dark: {
    name: '深色',
    cssVars: {
      '--bg': '#0A0A1A',
      '--text': '#FFFFFF',
      '--muted': '#8ca0c3',
      '--brand': '#181830',
      '--brand-600': '#23234a',
      '--brand-700': '#23234a',
      '--card': 'rgba(20, 20, 40, 0.98)',
      '--border': '#23234a',
      '--ring': '#7dc4ff',
      '--shadow': '0 8px 32px rgba(10,10,26,0.18)',
      '--radius': '18px',
      '--container': '1400px',
      '--orange': '#EAAB8D',
      '--bg-secondary': '#16213e',
      '--border-light': '#3a3a5a',
      '--hover-bg': '#30304c',
      '--text-secondary': '#a0a0a0',
      '--card-bg': '#1a1a2e',
      '--form-bg': '#16213e',
      '--section-bg': '#1a1a2e',
      '--modal-bg': '#0A0A1A',
      '--card-elevated': '#23234a',
      '--card-subtle': '#16213e',
      '--heading-font': 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
      '--heading-weight': '700',
      '--heading-color': '#FFFFFF',
      '--gradient-bg': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      '--gradient-bg-alt': 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
      '--gradient-bg-hero': 'linear-gradient(135deg, #0A0A1A 0%, #1a1a2e 100%)',
      '--wallet-text': '#FFFFFF'
    }
  },
  light: {
    name: '浅色',
    cssVars: {
      '--bg': '#FFFFFF',
      '--text': '#000000',
      '--muted': '#6b7280',
      '--brand': '#f59e0b',
      '--brand-600': '#d97706',
      '--brand-700': '#b45309',
      '--card': 'rgba(255, 255, 255, 0.95)',
      '--border': '#e5e7eb',
      '--ring': '#3b82f6',
      '--shadow': '0 8px 32px rgba(0,0,0,0.1)',
      '--radius': '18px',
      '--container': '1400px',
      '--orange': '#f59e0b',
      '--bg-secondary': '#f1f5f9',
      '--border-light': '#d1d5db',
      '--hover-bg': '#e5e7eb',
      '--text-secondary': '#6b7280',
      '--card-bg': '#ffffff',
      '--form-bg': '#f9fafb',
      '--section-bg': '#f3f4f6',
      '--modal-bg': '#ffffff',
      '--card-elevated': '#ffffff',
      '--card-subtle': '#f8fafc',
      '--heading-font': 'SimHei, "Microsoft YaHei", "PingFang SC", "Hiragino Sans GB", sans-serif',
      '--heading-weight': '900',
      '--heading-color': '#000000',
      '--gradient-bg': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      '--gradient-bg-alt': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
       '--gradient-bg-hero': 'linear-gradient(135deg, #ffffff 0%, #e6f3ff 100%)',
      '--wallet-text': '#FFFFFF'
    }
  }
}

// 获取系统主题偏好
const getSystemTheme = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

// 应用主题到文档
const applyTheme = (themeName) => {
  const theme = themes[themeName]
  if (!theme) return

  const root = document.documentElement
  Object.entries(theme.cssVars).forEach(([property, value]) => {
    root.style.setProperty(property, value)
  })
  
  // 设置 data-theme 属性用于 CSS 选择器
  root.setAttribute('data-theme', themeName)
}

// 从 localStorage 加载保存的主题
const loadSavedTheme = () => {
  const saved = localStorage.getItem('rwa-theme')
  if (saved && themes[saved]) {
    currentTheme.value = saved
  } else {
    // 如果没有保存的主题，使用系统偏好
    currentTheme.value = getSystemTheme()
  }
  applyTheme(currentTheme.value)
}

// 切换主题
const setTheme = (themeName) => {
  if (!themes[themeName]) {
    console.warn(`Theme "${themeName}" not found`)
    return
  }
  
  currentTheme.value = themeName
  applyTheme(themeName)
  localStorage.setItem('rwa-theme', themeName)
}

// 获取当前主题信息
const getCurrentTheme = computed(() => {
  return {
    name: themes[currentTheme.value].name,
    value: currentTheme.value
  }
})

// 获取所有可用主题
const getAvailableThemes = () => {
  return Object.entries(themes).map(([value, config]) => ({
    value,
    name: config.name
  }))
}

// 初始化主题
const initTheme = () => {
  loadSavedTheme()
  
  // 监听系统主题变化
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      // 如果当前主题是自动模式，跟随系统变化
      const saved = localStorage.getItem('rwa-theme')
      if (saved === 'auto') {
        const systemTheme = e.matches ? 'dark' : 'light'
        currentTheme.value = systemTheme
        applyTheme(systemTheme)
      }
    })
  }
}

export function useTheme() {
  return {
    currentTheme,
    setTheme,
    getCurrentTheme,
    getAvailableThemes,
    initTheme,
    applyTheme
  }
}
