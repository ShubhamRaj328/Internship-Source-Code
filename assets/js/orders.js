const orders = [
  { id: 'ORD-001', customer: { name: 'John Doe', email: 'john.doe@email.com' }, items: [ { name: 'Classic T-Shirt', quantity: 2, price: 29.99 }, { name: 'Denim Jeans', quantity: 1, price: 79.99 } ], total: 139.97, status: 'delivered', date: '2026-01-10T14:30:00', trackingNumber: 'TRK123456789', shipping: { address: '123 Main Street', city: 'New York', state: 'NY', zip: '10001', country: 'USA' }, notes: 'Customer requested expedited shipping' },
  { id: 'ORD-002', customer: { name: 'Jane Smith', email: 'jane.smith@email.com' }, items: [ { name: 'Summer Dress', quantity: 1, price: 89.99 } ], total: 89.99, status: 'shipped', date: '2026-01-12T09:15:00', trackingNumber: 'TRK987654321', shipping: { address: '456 Oak Avenue', city: 'Los Angeles', state: 'CA', zip: '90210', country: 'USA' }, notes: '' },
  { id: 'ORD-003', customer: { name: 'Mike Johnson', email: 'mike.johnson@email.com' }, items: [ { name: 'Winter Jacket', quantity: 1, price: 149.99 }, { name: 'Leather Belt', quantity: 1, price: 39.99 }, { name: 'Running Shoes', quantity: 1, price: 119.99 } ], total: 309.97, status: 'processing', date: '2026-01-13T16:45:00', trackingNumber: '', shipping: { address: '789 Pine Road', city: 'Chicago', state: 'IL', zip: '60601', country: 'USA' }, notes: 'Gift wrapping requested' },
  { id: 'ORD-004', customer: { name: 'Sarah Wilson', email: 'sarah.wilson@email.com' }, items: [ { name: 'Classic T-Shirt', quantity: 1, price: 29.99 } ], total: 39.99, status: 'pending', date: '2026-01-14T11:20:00', trackingNumber: '', shipping: { address: '321 Elm Street', city: 'Miami', state: 'FL', zip: '33101', country: 'USA' }, notes: '' },
  { id: 'ORD-005', customer: { name: 'David Brown', email: 'david.brown@email.com' }, items: [ { name: 'Denim Jeans', quantity: 2, price: 79.99 } ], total: 159.98, status: 'cancelled', date: '2026-01-11T13:10:00', trackingNumber: '', shipping: { address: '654 Maple Drive', city: 'Seattle', state: 'WA', zip: '98101', country: 'USA' }, notes: 'Customer requested cancellation due to size issues' }
]

let currentEditingOrder = null

document.addEventListener('DOMContentLoaded', function () {
  renderOrders()
  setupOrdersEventListeners()
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

function setupOrdersEventListeners() {
  document.getElementById('searchInput').addEventListener('input', filterOrders)
  document.getElementById('statusFilter').addEventListener('change', filterOrders)
  document.getElementById('dateFilter').addEventListener('change', filterOrders)
  document.getElementById('editOrderForm').addEventListener('submit', handleEditSubmit)
}

function renderOrders() {
  const tbody = document.getElementById('ordersTableBody')
  tbody.innerHTML = orders.map(order => `
    <tr class="hover:bg-gray-50 dark:hover:bg-[#2a2a2a]">
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm font-medium text-gray-900 dark:text-gray-100">${order.id}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div>
          <div class="text-sm font-medium text-gray-900 dark:text-gray-100">${order.customer.name}</div>
          <div class="text-sm text-gray-500">${order.customer.email}</div>
        </div>
      </td>
      <td class="px-6 py-4">
        <div class="text-sm text-gray-900 dark:text-gray-100">
          ${order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
        </div>
        <div class="text-sm text-gray-500">${order.items.length} item${order.items.length > 1 ? 's' : ''}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm font-medium text-gray-900 dark:text-gray-100">Rs ${order.total.toFixed(2)}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        ${Utils.getStatusBadge(order.status)}
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900 dark:text-gray-100">${Utils.formatDateTime(order.date)}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button onclick="editOrder('${order.id}')" class="text-primary-600 hover:text-primary-900 mr-3" title="Edit Order">
          <i class="ph ph-pencil"></i>
        </button>
        <button onclick="viewOrder('${order.id}')" class="text-blue-600 hover:text-blue-900 mr-3" title="View Details">
          <i class="ph ph-eye"></i>
        </button>
        <button onclick="printOrder('${order.id}')" class="text-green-600 hover:text-green-900" title="Print Order">
          <i class="ph ph-printer"></i>
        </button>
      </td>
    </tr>
  `).join('')
}

function filterOrders() {
  console.log('Filtering orders...')
}

function closeEditOrderModal() {
  closeModal(document.getElementById('editOrderModal'))
  currentEditingOrder = null
}

function viewOrder(orderId) {
  const order = orders.find(o => o.id === orderId)
  if (!order) return
  document.getElementById('viewOrderId').textContent = order.id
  document.getElementById('viewOrderDate').textContent = Utils.formatDateTime(order.date)
  const statusElement = document.getElementById('viewOrderStatus')
  statusElement.innerHTML = Utils.getStatusBadge(order.status)
  document.getElementById('viewOrderTotal').textContent = `Rs ${order.total.toFixed(2)}`
  document.getElementById('viewTrackingNumber').textContent = order.trackingNumber || 'Not available'
  document.getElementById('viewCustomerName').textContent = order.customer.name
  document.getElementById('viewCustomerEmail').textContent = order.customer.email
  document.getElementById('viewShippingAddress').textContent = order.shipping.address
  document.getElementById('viewShippingCityStateZip').textContent = `${order.shipping.city}, ${order.shipping.state} ${order.shipping.zip}`
  document.getElementById('viewShippingCountry').textContent = order.shipping.country
  document.getElementById('viewOrderNotes').textContent = order.notes || 'No notes available for this order.'
  const itemsList = document.getElementById('viewOrderItemsList')
  itemsList.innerHTML = order.items.map(item => {
    const itemTotal = item.price * item.quantity
    return `
      <tr class="hover:bg-gray-50 dark:hover:bg-[#2a2a2a]">
        <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">${item.name}</td>
        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center dark:text-gray-400">${item.quantity}</td>
        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right dark:text-gray-400">Rs ${item.price.toFixed(2)}</td>
        <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right dark:text-gray-100">Rs ${itemTotal.toFixed(2)}</td>
      </tr>
    `
  }).join('')
  openModal(document.getElementById('viewOrderModal'))
}

function closeViewOrderModal() {
  closeModal(document.getElementById('viewOrderModal'))
}

function editOrder(orderId) {
  const order = orders.find(o => o.id === orderId)
  if (!order) return
  currentEditingOrder = order
  document.getElementById('editOrderId').value = order.id
  document.getElementById('editCustomerName').value = order.customer.name
  document.getElementById('editCustomerEmail').value = order.customer.email
  document.getElementById('editOrderStatus').value = order.status
  document.getElementById('editOrderDate').value = order.date
  document.getElementById('editTrackingNumber').value = order.trackingNumber || ''
  document.getElementById('editShippingAddress').value = order.shipping.address
  document.getElementById('editShippingCity').value = order.shipping.city
  document.getElementById('editShippingState').value = order.shipping.state
  document.getElementById('editShippingZip').value = order.shipping.zip
  document.getElementById('editShippingCountry').value = order.shipping.country
  document.getElementById('editOrderTotal').value = order.total
  document.getElementById('editOrderNotes').value = order.notes || ''
  populateOrderItems(order.items)
  openModal(document.getElementById('editOrderModal'))
}

function openModal(modal) {
  modal.classList.remove('hidden')
  document.body.classList.add('modal-open')
  window.modalScrollPosition = window.pageYOffset
  document.body.style.top = `-${window.modalScrollPosition}px`
  document.body.style.position = 'fixed'
  document.body.style.width = '100%'
}

function closeModal(modal) {
  modal.classList.add('hidden')
  document.body.classList.remove('modal-open')
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
  window.scrollTo(0, window.modalScrollPosition || 0)
}

function populateOrderItems(items) {
  const container = document.getElementById('editOrderItems')
  container.innerHTML = items.map(item => `
    <div class="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0 dark:border-[#3a3a3a]">
      <div>
        <div class="text-sm font-medium text-gray-900 dark:text-gray-100">${item.name}</div>
        <div class="text-xs text-gray-500">Quantity: ${item.quantity}</div>
      </div>
      <div class="text-sm font-medium text-gray-900 dark:text-gray-100">Rs ${(item.price * item.quantity).toFixed(2)}</div>
    </div>
  `).join('')
}

function handleEditSubmit(e) {
  e.preventDefault()
  if (!currentEditingOrder) return
  const formData = {
    customer: {
      name: document.getElementById('editCustomerName').value,
      email: document.getElementById('editCustomerEmail').value
    },
    status: document.getElementById('editOrderStatus').value,
    date: document.getElementById('editOrderDate').value,
    trackingNumber: document.getElementById('editTrackingNumber').value,
    shipping: {
      address: document.getElementById('editShippingAddress').value,
      city: document.getElementById('editShippingCity').value,
      state: document.getElementById('editShippingState').value,
      zip: document.getElementById('editShippingZip').value,
      country: document.getElementById('editShippingCountry').value
    },
    total: parseFloat(document.getElementById('editOrderTotal').value),
    notes: document.getElementById('editOrderNotes').value
  }
  const orderIndex = orders.findIndex(o => o.id === currentEditingOrder.id)
  if (orderIndex !== -1) {
    orders[orderIndex] = { ...orders[orderIndex], ...formData }
  }
  renderOrders()
  closeEditOrderModal()
  Utils.showNotification('Order updated successfully!', 'success')
}

function printOrder(orderId) {
  const order = orders.find(o => o.id === orderId)
  if (!order) return
  Utils.showNotification(`Printing order ${orderId}`, 'success')
}

console.log('👕 Clothes4U Orders page loaded successfully!')
