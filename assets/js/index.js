document.addEventListener('DOMContentLoaded', function () {
  initializeDashboardCharts()
  document.title = 'Dashboard - Clothes4U Admin'
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
})

window.addEventListener('themeChanged', function () {
  updateChartsForTheme()
})

function initializeDashboardCharts() {
  window.salesChart = createSalesChart()
  window.customerChart = createCustomerChart()
}

function createSalesChart() {
  const salesCtx = document.getElementById('salesChart').getContext('2d')
  const isDarkMode = document.documentElement.classList.contains('dark')
  return new Chart(salesCtx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Sales',
        data: [1200, 1900, 1500, 2500, 2200, 3000, 2800],
        borderColor: '#dc2626',
        backgroundColor: isDarkMode ? 'rgba(220, 38, 38, 0.2)' : 'rgba(220, 38, 38, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#f3f4f6' },
          ticks: { color: isDarkMode ? '#a0a0a0' : '#6b7280' }
        },
        x: {
          grid: { display: false },
          ticks: { color: isDarkMode ? '#a0a0a0' : '#6b7280' }
        }
      }
    }
  })
}

function createCustomerChart() {
  const customerCtx = document.getElementById('customerChart').getContext('2d')
  const isDarkMode = document.documentElement.classList.contains('dark')
  return new Chart(customerCtx, {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'New Customers',
        data: [12, 19, 15, 25, 22, 30, 28],
        backgroundColor: '#dc2626',
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#f3f4f6' },
          ticks: { color: isDarkMode ? '#a0a0a0' : '#6b7280' }
        },
        x: {
          grid: { display: false },
          ticks: { color: isDarkMode ? '#a0a0a0' : '#6b7280' }
        }
      }
    }
  })
}

function updateChartsForTheme() {
  if (window.salesChart) window.salesChart.destroy()
  if (window.customerChart) window.customerChart.destroy()
  window.salesChart = createSalesChart()
  window.customerChart = createCustomerChart()
}

console.log('👕 Clothes4U Admin dashboard initialized successfully!')
