// Theme Service for PolySpace EPS (Dark / Light Mode)
const THEME_KEY = 'polyspace_theme'

export const themeService = {
    getTheme() {
        return localStorage.getItem(THEME_KEY) || 'dark'
    },
    setTheme(theme) {
        const selectedTheme = theme === 'light' ? 'light' : 'dark'
        localStorage.setItem(THEME_KEY, selectedTheme)
        applyTheme(selectedTheme)
        return selectedTheme
    },
    toggleTheme() {
        const current = this.getTheme()
        const next = current === 'dark' ? 'light' : 'dark'
        return this.setTheme(next)
    },
    init() {
        const theme = this.getTheme()
        applyTheme(theme)
    }
}

function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-theme')
        document.body.classList.remove('dark-theme')
    } else {
        document.body.classList.add('dark-theme')
        document.body.classList.remove('light-theme')
    }
}

// Auto-initialize on import
themeService.init()
