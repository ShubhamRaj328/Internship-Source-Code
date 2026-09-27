document.addEventListener('DOMContentLoaded', function () {
  const markAllReadBtn = document.getElementById('mark-all-read')
  const notificationItems = document.querySelectorAll('.notification-item')
  document.title = 'Notifications - Clothes4U Admin'
  document.getElementById('header-spacer').style.height = '64px'
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
  if (markAllReadBtn) {
    markAllReadBtn.addEventListener('click', () => {
      notificationItems.forEach(item => {
        if (item.getAttribute('data-read') === 'false') {
          item.setAttribute('data-read', 'true')
          item.classList.remove('unread')
          const redDot = item.querySelector('.w-2.h-2.bg-red-500')
          if (redDot) redDot.remove()
        }
      })
      markAllReadBtn.textContent = 'All notifications read'
      markAllReadBtn.disabled = true
      markAllReadBtn.classList.add('opacity-50', 'cursor-not-allowed')
      if (typeof Utils !== 'undefined' && Utils.showNotification) {
        Utils.showNotification('All notifications marked as read', 'success')
      }
    })
  }
  notificationItems.forEach(item => {
    item.addEventListener('click', () => {
      if (item.getAttribute('data-read') === 'false') {
        item.setAttribute('data-read', 'true')
        item.classList.remove('unread')
        const redDot = item.querySelector('.w-2.h-2.bg-red-500')
        if (redDot) redDot.remove()
      }
    })
  })
  console.log('📢 Clothes4U Admin notifications page functionality loaded successfully!')
})
