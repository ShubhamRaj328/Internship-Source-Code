document.addEventListener('DOMContentLoaded', function () {
  setupSettingsEventListeners()
  initializeSettingsTheme()
  setupSidebarToggle()
})

function setupSettingsEventListeners() {
  const settingsTabs = document.querySelectorAll('.settings-tab')
  const settingsContents = document.querySelectorAll('.settings-content')
  settingsTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab
      settingsTabs.forEach(t => {
        t.classList.remove('active', 'text-primary-600', 'border-primary-600')
        t.classList.add('text-gray-500', 'border-transparent')
      })
      tab.classList.add('active', 'text-primary-600', 'border-primary-600')
      tab.classList.remove('text-gray-500', 'border-transparent')
      settingsContents.forEach(content => { content.classList.add('hidden') })
      document.getElementById(`${targetTab}-tab`).classList.remove('hidden')
    })
  })
  const forms = document.querySelectorAll('form')
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      if (typeof Utils !== 'undefined' && Utils.showNotification) {
        Utils.showNotification('Settings saved successfully!', 'success')
      } else {
        alert('Settings saved successfully!')
      }
    })
  })
  const darkModeToggle = document.getElementById('dark-mode-toggle')
  if (darkModeToggle) {
    darkModeToggle.addEventListener('change', () => {
      document.documentElement.classList.toggle('dark')
      if (document.documentElement.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark')
      } else {
        localStorage.setItem('theme', 'light')
      }
      window.dispatchEvent(new CustomEvent('themeChanged'))
    })
  }
  document.getElementById('header-spacer').style.height = '64px'
}

function initializeSettingsTheme() {
  const darkModeToggle = document.getElementById('dark-mode-toggle')
  if (darkModeToggle) {
    darkModeToggle.checked = document.documentElement.classList.contains('dark')
  }
  window.addEventListener('themeChanged', () => {
    if (darkModeToggle) {
      darkModeToggle.checked = document.documentElement.classList.contains('dark')
    }
  })
}

function setupSidebarToggle() {
  const sidebarToggleDesktop = document.getElementById('sidebar-toggle-desktop')
  const sidebar = document.getElementById('sidebar')
  if (sidebarToggleDesktop && sidebar) {
    sidebarToggleDesktop.addEventListener('click', function () {
      const currentState = sidebar.getAttribute('data-collapsible')
      if (currentState === 'icon') {
        sidebar.setAttribute('data-collapsible', 'offcanvas')
      } else {
        sidebar.setAttribute('data-collapsible', 'icon')
      }
    })
  }
}

console.log('⚙️ Clothes4U Admin settings page loaded successfully!')
