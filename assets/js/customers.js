const customers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 (555) 123-4567', status: 'active', totalOrders: 12, totalSpent: 1247.5, joinDate: '2026-03-15', lastOrder: '2026-01-10', address: '123 Main St, City, State 12345', orders: [ { id: 'ORD-001', date: '2026-01-10', total: 89.99, status: 'delivered' }, { id: 'ORD-015', date: '2026-12-28', total: 156.5, status: 'delivered' }, { id: 'ORD-032', date: '2026-12-15', total: 234.75, status: 'delivered' } ] },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1 (555) 234-5678', status: 'vip', totalOrders: 28, totalSpent: 3456.75, joinDate: '2023-11-22', lastOrder: '2026-01-12', address: '456 Oak Ave, City, State 12345', orders: [ { id: 'ORD-002', date: '2026-01-12', total: 199.99, status: 'shipped' }, { id: 'ORD-018', date: '2026-01-05', total: 89.5, status: 'delivered' }, { id: 'ORD-025', date: '2026-12-20', total: 345.25, status: 'delivered' } ] },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+1 (555) 345-6789', status: 'active', totalOrders: 8, totalSpent: 892.3, joinDate: '2026-06-08', lastOrder: '2026-01-05', address: '789 Pine St, City, State 12345', orders: [ { id: 'ORD-003', date: '2026-01-05', total: 129.99, status: 'processing' }, { id: 'ORD-012', date: '2026-12-18', total: 67.5, status: 'delivered' } ] },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', phone: '+1 (555) 456-7890', status: 'inactive', totalOrders: 3, totalSpent: 234.99, joinDate: '2026-09-12', lastOrder: '2026-11-20', address: '321 Elm St, City, State 12345', orders: [ { id: 'ORD-004', date: '2026-11-20', total: 89.99, status: 'delivered' }, { id: 'ORD-008', date: '2026-10-15', total: 145.0, status: 'delivered' } ] },
  { id: 5, name: 'David Brown', email: 'david@example.com', phone: '+1 (555) 567-8901', status: 'active', totalOrders: 15, totalSpent: 1678.45, joinDate: '2026-01-30', lastOrder: '2026-01-08', address: '654 Maple Ave, City, State 12345', orders: [ { id: 'ORD-005', date: '2026-01-08', total: 178.5, status: 'shipped' }, { id: 'ORD-011', date: '2026-12-25', total: 299.99, status: 'delivered' } ] },
  { id: 6, name: 'Emily Davis', email: 'emily@example.com', phone: '+1 (555) 678-9012', status: 'vip', totalOrders: 35, totalSpent: 4523.8, joinDate: '2023-08-14', lastOrder: '2026-01-14', address: '987 Cedar Ln, City, State 12345', orders: [ { id: 'ORD-006', date: '2026-01-14', total: 456.75, status: 'processing' }, { id: 'ORD-019', date: '2026-01-02', total: 234.5, status: 'delivered' }, { id: 'ORD-028', date: '2026-12-28', total: 567.25, status: 'delivered' } ] }
]

let currentCustomer = null

document.addEventListener('DOMContentLoaded', function () {
  renderCustomers()
  setupCustomerEventListeners()
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

function setupCustomerEventListeners() {
  document.getElementById('searchInput').addEventListener('input', filterCustomers)
  document.getElementById('statusFilter').addEventListener('change', filterCustomers)
  document.getElementById('sortFilter').addEventListener('change', filterCustomers)
  document.getElementById('closeCustomerModal').addEventListener('click', closeCustomerModal)
  document.getElementById('closeEmailModal').addEventListener('click', closeEmailModal)
  document.getElementById('closeOrdersModal').addEventListener('click', closeOrdersModal)
  document.getElementById('closeContactModal').addEventListener('click', closeContactModal)
  document.getElementById('cancelEmail').addEventListener('click', closeEmailModal)
  document.getElementById('closeAddCustomerModal').addEventListener('click', closeAddCustomerModal)
  document.getElementById('cancelAddCustomer').addEventListener('click', closeAddCustomerModal)
  document.getElementById('addCustomerForm').addEventListener('submit', handleAddCustomerSubmit)
  document.getElementById('customerPhone').addEventListener('input', function (e) {
    const formatted = formatPhoneNumber(e.target.value)
    if (formatted !== e.target.value) e.target.value = formatted
  })
  document.getElementById('addCustomerModal').addEventListener('click', function (e) {
    if (e.target === this) closeAddCustomerModal()
  })
}

function openAddCustomerModal() {
  const modal = document.getElementById('addCustomerModal')
  customerModalManager.openModal(modal)
  document.getElementById('addCustomerForm').reset()
  document.getElementById('customerStatus').value = 'active'
}

function closeAddCustomerModal() {
  const modal = document.getElementById('addCustomerModal')
  customerModalManager.closeModal(modal)
}

function handleAddCustomerSubmit(e) {
  e.preventDefault()
  const submitButton = document.getElementById('submitAddCustomer')
  const originalText = submitButton.innerHTML
  submitButton.innerHTML = '<i class="ph ph-spinner ph-spin mr-2"></i>Adding...'
  submitButton.disabled = true
  const formData = {
    name: document.getElementById('customerName').value.trim(),
    email: document.getElementById('customerEmail').value.trim(),
    phone: document.getElementById('customerPhone').value.trim(),
    status: document.getElementById('customerStatus').value,
    address: document.getElementById('customerAddress').value.trim(),
    notes: document.getElementById('customerNotes').value.trim()
  }
  if (!formData.name || !formData.email || !formData.phone) {
    Utils.showNotification('Please fill in all required fields.', 'error')
    submitButton.innerHTML = originalText
    submitButton.disabled = false
    return
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.email)) {
    Utils.showNotification('Please enter a valid email address.', 'error')
    submitButton.innerHTML = originalText
    submitButton.disabled = false
    return
  }
  const existingCustomer = customers.find(c => c.email.toLowerCase() === formData.email.toLowerCase())
  if (existingCustomer) {
    Utils.showNotification('A customer with this email already exists.', 'error')
    submitButton.innerHTML = originalText
    submitButton.disabled = false
    return
  }
  setTimeout(() => {
    const newCustomer = {
      id: customers.length + 1,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      status: formData.status,
      totalOrders: 0,
      totalSpent: 0.0,
      joinDate: new Date().toISOString().split('T')[0],
      lastOrder: null,
      address: formData.address || 'No address provided',
      notes: formData.notes,
      orders: []
    }
    customers.push(newCustomer)
    renderCustomers()
    Utils.showNotification(`Customer "${formData.name}" has been added successfully!`)
    closeAddCustomerModal()
    submitButton.innerHTML = originalText
    submitButton.disabled = false
    updateCustomerStats()
  }, 1500)
}

function updateCustomerStats() {
  const totalCustomers = customers.length
  const activeCustomers = customers.filter(c => c.status === 'active').length
  const vipCustomers = customers.filter(c => c.status === 'vip').length
  const avgOrderValue = customers.reduce((sum, c) => sum + c.totalSpent, 0) / totalCustomers || 0
  console.log('Updated stats:', { totalCustomers, activeCustomers, vipCustomers, avgOrderValue })
}

function formatPhoneNumber(input) {
  const cleaned = input.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) return `(${match[1]}) ${match[2]}-${match[3]}`
  return input
}

function getStatusBadge(status) {
  const badges = {
    active: 'bg-green-100 text-green-800 dark:bg-[rgba(22,163,74,0.2)] dark:text-green-400',
    inactive: 'bg-gray-100 text-gray-800 dark:bg-[rgba(75,85,99,0.2)] dark:text-gray-400',
    vip: 'bg-yellow-100 text-yellow-800 dark:bg-[rgba(202,138,4,0.2)] dark:text-yellow-400'
  }
  const icons = {
    active: 'ph ph-check-circle',
    inactive: 'ph ph-pause-circle',
    vip: 'ph ph-star'
  }
  return `<span class="px-2 py-1 text-xs font-medium rounded-full ${badges[status]} flex items-center">
    <i class="${icons[status]} mr-1"></i>
    ${status.toUpperCase()}
  </span>`
}

function renderCustomers() {
  const grid = document.getElementById('customersGrid')
  grid.innerHTML = customers.map(customer => `
    <div class="bg-white rounded-xl border border-gray-200 p-6 card-hover dark:border-[#2a2a2a]">
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <i class="ph ph-user text-primary-600"></i>
          </div>
          <div class="ml-3">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">${customer.name}</h3>
            <p class="text-sm text-gray-500">${customer.email}</p>
          </div>
        </div>
        ${getStatusBadge(customer.status)}
      </div>
      <div class="space-y-3">
        <div class="flex justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400">Total Orders:</span>
          <span class="font-medium text-gray-900 dark:text-gray-100">${customer.totalOrders}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400">Total Spent:</span>
          <span class="font-medium text-gray-900 dark:text-gray-100">Rs ${customer.totalSpent.toFixed(2)}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400">Last Order:</span>
          <span class="font-medium text-gray-900 dark:text-gray-100">${Utils.formatDate(customer.lastOrder)}</span>
        </div>
      </div>
      <div class="mt-6 flex gap-2">
        <button onclick="viewCustomer(${customer.id})" class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">View Details</button>
        <button onclick="contactCustomer(${customer.id})" class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium dark:bg-[#2a2a2a] dark:text-gray-300 dark:hover:bg-[#333333]">Contact</button>
      </div>
    </div>
  `).join('')
}

function filterCustomers() {
  console.log('Filtering customers...')
}

function viewCustomer(customerId) {
  const customer = customers.find(c => c.id === customerId)
  if (!customer) return
  currentCustomer = customer
  const modalContent = document.getElementById('customerModalContent')
  modalContent.innerHTML = `
    <div class="space-y-6">
      <div class="flex items-center">
        <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
          <i class="ph ph-user text-primary-600 text-xl"></i>
        </div>
        <div class="ml-4">
          <h4 class="text-xl font-semibold text-gray-900 dark:text-gray-100">${customer.name}</h4>
          <p class="text-gray-600 dark:text-gray-400">${customer.email}</p>
          ${getStatusBadge(customer.status)}
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h5 class="font-medium text-gray-900 mb-2 dark:text-gray-100">Contact Information</h5>
          <p class="text-sm text-gray-600 dark:text-gray-400">Phone: ${customer.phone}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Email: ${customer.email}</p>
        </div>
        <div>
          <h5 class="font-medium text-gray-900 mb-2 dark:text-gray-100">Order Statistics</h5>
          <p class="text-sm text-gray-600 dark:text-gray-400">Total Orders: ${customer.totalOrders}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Total Spent: Rs ${customer.totalSpent.toFixed(2)}</p>
        </div>
      </div>
      <div>
        <h5 class="font-medium text-gray-900 mb-2 dark:text-gray-100">Address</h5>
        <p class="text-sm text-gray-600 dark:text-gray-400">${customer.address}</p>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h5 class="font-medium text-gray-900 mb-2 dark:text-gray-100">Join Date</h5>
          <p class="text-sm text-gray-600 dark:text-gray-400">${Utils.formatDate(customer.joinDate)}</p>
        </div>
        <div>
          <h5 class="font-medium text-gray-900 mb-2 dark:text-gray-100">Last Order</h5>
          <p class="text-sm text-gray-600 dark:text-gray-400">${Utils.formatDate(customer.lastOrder)}</p>
        </div>
      </div>
      <div class="flex gap-3 pt-4 border-t dark:border-[#2a2a2a]">
        <button onclick="sendEmail(${customer.id})" class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"><i class="ph ph-envelope mr-2"></i>Send Email</button>
        <button onclick="viewOrders(${customer.id})" class="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"><i class="ph ph-shopping-cart mr-2"></i>View Orders</button>
        <button onclick="showContactOptions(${customer.id})" class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"><i class="ph ph-phone mr-2"></i>Contact</button>
      </div>
    </div>
  `
  const modal = document.getElementById('customerModal')
  customerModalManager.openModal(modal)
}

function sendEmail(customerId) {
  const customer = customers.find(c => c.id === customerId)
  if (!customer) return
  document.getElementById('emailTo').value = customer.email
  document.getElementById('emailSubject').value = `Hello ${customer.name}`
  document.getElementById('emailMessage').value = ''
  closeCustomerModal()
  const emailModal = document.getElementById('emailModal')
  customerModalManager.openModal(emailModal)
}

function viewOrders(customerId) {
  const customer = customers.find(c => c.id === customerId)
  if (!customer) return
  const ordersContent = document.getElementById('ordersModalContent')
  ordersContent.innerHTML = `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100">${customer.name}'s Orders</h4>
        <span class="text-sm text-gray-500">${customer.orders.length} orders total</span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-[#2a2a2a]">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Order ID</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Date</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Total</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Status</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-[#2a2a2a]">
            ${customer.orders.map(order => `
              <tr>
                <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">${order.id}</td>
                <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">${Utils.formatDate(order.date)}</td>
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">Rs ${order.total.toFixed(2)}</td>
                <td class="px-4 py-3 text-sm">${Utils.getStatusBadge(order.status)}</td>
                <td class="px-4 py-3 text-sm"><button onclick="window.open('orders.html', '_blank')" class="text-primary-600 hover:text-primary-700"><i class="ph ph-arrow-square-out"></i></button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div class="flex justify-end pt-4 border-t dark:border-[#2a2a2a]">
        <button onclick="window.open('orders.html', '_blank')" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"><i class="ph ph-arrow-square-out mr-2"></i>View All Orders</button>
      </div>
    </div>
  `
  closeCustomerModal()
  const ordersModal = document.getElementById('ordersModal')
  customerModalManager.openModal(ordersModal)
}

function showContactOptions(customerId) {
  const customer = customers.find(c => c.id === customerId)
  if (!customer) return
  const contactContent = document.getElementById('contactModalContent')
  contactContent.innerHTML = `
    <div class="space-y-4">
      <div class="text-center mb-6">
        <h4 class="text-lg font-semibold text-gray-900 mb-2 dark:text-gray-100">Contact ${customer.name}</h4>
        <p class="text-sm text-gray-600 dark:text-gray-400">Choose how you'd like to contact this customer</p>
      </div>
      <div class="space-y-3">
        <button onclick="callCustomer('${customer.phone}')" class="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"><i class="ph ph-phone mr-3"></i>Call ${customer.phone}</button>
        <button onclick="sendEmail(${customer.id}); closeContactModal();" class="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"><i class="ph ph-envelope mr-3"></i>Send Email</button>
        <button onclick="sendSMS('${customer.phone}')" class="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"><i class="ph ph-chat-text mr-3"></i>Send SMS</button>
        <button onclick="copyContactInfo('${customer.name}', '${customer.email}', '${customer.phone}')" class="w-full flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"><i class="ph ph-copy mr-3"></i>Copy Contact Info</button>
      </div>
    </div>
  `
  closeCustomerModal()
  const contactModal = document.getElementById('contactModal')
  customerModalManager.openModal(contactModal)
}

function callCustomer(phone) { window.location.href = `tel:${phone}` }
function sendSMS(phone) { window.location.href = `sms:${phone}` }
function copyContactInfo(name, email, phone) {
  const contactInfo = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}`
  navigator.clipboard.writeText(contactInfo).then(() => {
    Utils.showNotification('Contact information copied to clipboard!')
    closeContactModal()
  })
}

function handleEmailSubmit(e) {
  e.preventDefault()
  const to = document.getElementById('emailTo').value
  const subject = document.getElementById('emailSubject').value
  const message = document.getElementById('emailMessage').value
  const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
  window.location.href = mailtoLink
  Utils.showNotification('Email client opened successfully!')
  closeEmailModal()
}

class CustomerModalManager {
  constructor() { this.scrollPosition = 0 }
  openModal(modal) {
    modal.classList.remove('hidden')
    document.body.classList.add('modal-open')
    this.scrollPosition = window.pageYOffset
    document.body.style.top = `-${this.scrollPosition}px`
    document.body.style.position = 'fixed'
    document.body.style.width = '100%'
  }
  closeModal(modal) {
    modal.classList.add('hidden')
    document.body.classList.remove('modal-open')
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    window.scrollTo(0, this.scrollPosition)
  }
}

const customerModalManager = new CustomerModalManager()

function closeCustomerModal() { customerModalManager.closeModal(document.getElementById('customerModal')) }
function closeEmailModal() { customerModalManager.closeModal(document.getElementById('emailModal')) }
function closeOrdersModal() { customerModalManager.closeModal(document.getElementById('ordersModal')) }
function closeContactModal() { customerModalManager.closeModal(document.getElementById('contactModal')) }

console.log('👕 Clothes4U Customers page loaded successfully!')
