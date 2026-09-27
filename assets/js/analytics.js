let revenueChart, ordersChart, trafficChart

document.addEventListener('DOMContentLoaded', function () {
  initializeCharts()
  document.title = 'Analytics - Clothes4U Admin'
  const spacer = document.getElementById('header-spacer')
  if (spacer) spacer.style.height = '64px'
  const toggle = document.getElementById('sidebar-toggle-desktop')
  const sidebar = document.getElementById('sidebar')
  if (toggle && sidebar) {
    toggle.addEventListener('click', function () {
      const currentState = sidebar.getAttribute('data-collapsible')
      sidebar.setAttribute('data-collapsible', currentState === 'icon' ? 'offcanvas' : 'icon')
    })
  }
  window.addEventListener('themeChanged', updateChartsForTheme)
})

function initializeCharts() {
  if (document.getElementById('revenueChart')) revenueChart = createRevenueChart()
  if (document.getElementById('ordersChart')) ordersChart = createOrdersChart()
  if (document.getElementById('trafficChart')) trafficChart = createTrafficChart()
}

function createRevenueChart() {
  const ctx = document.getElementById('revenueChart').getContext('2d')
  const isDarkMode = document.documentElement.classList.contains('dark')
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [{ label: 'Revenue', data: [12000, 19000, 15000, 25000, 22000, 30000, 28000], borderColor: '#dc2626', backgroundColor: isDarkMode ? 'rgba(220, 38, 38, 0.2)' : 'rgba(220, 38, 38, 0.1)', tension: 0.4, fill: true }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#f3f4f6' }, ticks: { color: isDarkMode ? '#a0a0a0' : '#6b7280' } },
        x: { grid: { display: false }, ticks: { color: isDarkMode ? '#a0a0a0' : '#6b7280' } }
      }
    }
  })
}

function createOrdersChart() {
  const ctx = document.getElementById('ordersChart').getContext('2d')
  const isDarkMode = document.documentElement.classList.contains('dark')
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [{ label: 'Orders', data: [120, 190, 150, 250, 220, 300, 280], backgroundColor: '#3b82f6', borderRadius: 4 }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#f3f4f6' }, ticks: { color: isDarkMode ? '#a0a0a0' : '#6b7280' } },
        x: { grid: { display: false }, ticks: { color: isDarkMode ? '#a0a0a0' : '#6b7280' } }
      }
    }
  })
}

function createTrafficChart() {
  const ctx = document.getElementById('trafficChart').getContext('2d')
  return new Chart(ctx, {
    type: 'doughnut',
    data: { labels: ['Direct', 'Social Media', 'Search Engines', 'Email'], datasets: [{ data: [45, 28, 18, 9], backgroundColor: ['#dc2626', '#3b82f6', '#10b981', '#f59e0b'], borderWidth: 0 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
  })
}

function updateChartsForTheme() {
  if (revenueChart) revenueChart.destroy()
  if (ordersChart) ordersChart.destroy()
  if (trafficChart) trafficChart.destroy()
  initializeCharts()
}

console.log('📊 Clothes4U Analytics page functionality loaded successfully!')
