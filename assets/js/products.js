const products = [
  { id: 1, name: 'Classic T-Shirt', category: 't-shirts', price: 29.99, originalPrice: 34.99, stock: 45, status: 'in-stock', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 2, name: 'Denim Jeans', category: 'pants', price: 79.99, stock: 23, status: 'in-stock', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80', sizes: ['28', '30', '32', '34', '36'] },
  { id: 3, name: 'Winter Jacket', category: 'jackets', price: 149.99, stock: 8, status: 'low-stock', image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { id: 4, name: 'Running Shoes', category: 'shoes', price: 119.99, stock: 0, status: 'out-of-stock', image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80', sizes: ['7', '8', '9', '10', '11', '12'] },
  { id: 5, name: 'Summer Dress', category: 'dresses', price: 89.99, originalPrice: 109.99, stock: 15, status: 'in-stock', image: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80', sizes: ['XS', 'S', 'M', 'L'] },
  { id: 6, name: 'Leather Belt', category: 'accessories', price: 39.99, stock: 32, status: 'in-stock', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80', sizes: ['S', 'M', 'L'] }
]

let currentEditingProduct = null
let currentDeletingProduct = null
let productImages = []

document.addEventListener('DOMContentLoaded', function () {
  renderProducts()
  setupProductsEventListeners()
  document.title = 'Products - Clothes4U Admin'
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

function setupProductsEventListeners() {
  document.getElementById('gridView').addEventListener('click', () => switchView('grid'))
  document.getElementById('listView').addEventListener('click', () => switchView('list'))
  document.getElementById('searchInput').addEventListener('input', filterProducts)
  document.getElementById('categoryFilter').addEventListener('change', filterProducts)
  document.getElementById('stockFilter').addEventListener('change', filterProducts)
  document.getElementById('categoryFilterDesktop').addEventListener('change', filterProducts)
  document.getElementById('stockFilterDesktop').addEventListener('change', filterProducts)
  document.getElementById('editProductForm').addEventListener('submit', handleEditSubmit)
  document.getElementById('editImageInput').addEventListener('change', handleImageChange)
  document.getElementById('addNewImageInput').addEventListener('change', handleAddNewImage)
}

function renderProducts() {
  renderGridView()
  renderListView()
}

function renderGridView() {
  const grid = document.getElementById('productsGrid')
  grid.innerHTML = products.map(product => `
    <div class="product-card bg-white rounded-xl border border-gray-200 overflow-hidden dark:border-[#2a2a2a]">
      <div class="relative">
        <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
        ${product.originalPrice ? `
          <div class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            ${Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
          </div>
        ` : ''}
        ${Utils.getStatusBadge(product.status, 'absolute top-2 right-2')}
      </div>
      <div class="p-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-2 dark:text-gray-100">${product.name}</h3>
        <p class="text-sm text-gray-500 mb-3 capitalize">${product.category.replace('-', ' ')}</p>
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-2">
            <span class="text-xl font-bold text-gray-900 dark:text-gray-100">Rs ${product.price}</span>
            ${product.originalPrice ? `<span class="text-sm text-gray-500 line-through">Rs ${product.originalPrice}</span>` : ''}
          </div>
          <span class="text-sm text-gray-600 dark:text-gray-400">${product.stock} in stock</span>
        </div>
        <div class="mb-4">
          <p class="text-xs text-gray-500 mb-1">Available sizes:</p>
          <div class="flex flex-wrap gap-1">
            ${product.sizes.map(size => `
              <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded dark:bg-[#2a2a2a] dark:text-gray-300">${size}</span>
            `).join('')}
          </div>
        </div>
        <div class="flex gap-2">
          <button onclick="editProduct(${product.id})" class="flex-1 bg-primary-600 text-white px-3 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
            <i class="ph ph-pencil mr-1"></i>
            Edit
          </button>
          <button onclick="deleteProduct(${product.id})" class="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors dark:bg-[rgba(220,38,38,0.2)] dark:hover:bg-[rgba(220,38,38,0.3)]">
            <i class="ph ph-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('')
}

function renderListView() {
  const tbody = document.getElementById('productsTableBody')
  tbody.innerHTML = products.map(product => `
    <tr class="hover:bg-gray-50 dark:hover:bg-[#2a2a2a]">
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
          <img src="${product.image}" alt="${product.name}" class="w-12 h-12 rounded-lg object-cover mr-4">
          <div>
            <div class="text-sm font-medium text-gray-900 dark:text-gray-100">${product.name}</div>
            <div class="text-sm text-gray-500">SKU: PRD-${String(product.id).padStart(3, '0')}</div>
          </div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="text-sm text-gray-900 capitalize dark:text-gray-100">${product.category.replace('-', ' ')}</span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm font-medium text-gray-900 dark:text-gray-100">Rs ${product.price}</div>
        ${product.originalPrice ? `<div class="text-sm text-gray-500 line-through">Rs ${product.originalPrice}</div>` : ''}
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900 dark:text-gray-100">${product.stock}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        ${Utils.getStatusBadge(product.status)}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button onclick="editProduct(${product.id})" class="text-primary-600 hover:text-primary-900 mr-3">
          <i class="ph ph-pencil"></i>
        </button>
        <button onclick="deleteProduct(${product.id})" class="text-red-600 hover:text-red-900">
          <i class="ph ph-trash"></i>
        </button>
      </td>
    </tr>
  `).join('')
}

function switchView(view) {
  const gridView = document.getElementById('gridView')
  const listView = document.getElementById('listView')
  const productsGrid = document.getElementById('productsGrid')
  const productsList = document.getElementById('productsList')
  if (view === 'grid') {
    gridView.classList.add('active', 'bg-white', 'text-gray-900', 'dark:bg-[#1e1e1e]', 'dark:text-gray-100')
    gridView.classList.remove('text-gray-600', 'dark:text-gray-400')
    listView.classList.remove('active', 'bg-white', 'text-gray-900', 'dark:bg-[#1e1e1e]', 'dark:text-gray-100')
    listView.classList.add('text-gray-600', 'dark:text-gray-400')
    productsGrid.classList.remove('hidden')
    productsList.classList.add('hidden')
  } else {
    listView.classList.add('active', 'bg-white', 'text-gray-900', 'dark:bg-[#1e1e1e]', 'dark:text-gray-100')
    listView.classList.remove('text-gray-600', 'dark:text-gray-400')
    gridView.classList.remove('active', 'bg-white', 'text-gray-900', 'dark:bg-[#1e1e1e]', 'dark:text-gray-100')
    gridView.classList.add('text-gray-600', 'dark:text-gray-400')
    productsList.classList.remove('hidden')
    productsGrid.classList.add('hidden')
  }
}

function filterProducts() {
  console.log('Filtering products...')
}

function editProduct(productId) {
  const product = products.find(p => p.id === productId)
  if (!product) return
  currentEditingProduct = product
  productImages = [product.image]
  document.getElementById('editProductName').value = product.name
  document.getElementById('editProductCategory').value = product.category
  document.getElementById('editProductPrice').value = product.price
  document.getElementById('editProductOriginalPrice').value = product.originalPrice || ''
  document.getElementById('editProductStock').value = product.stock
  document.getElementById('editProductStatus').value = product.status
  renderProductImages()
  populateEditSizes(product.sizes, product.category)
  openModal(document.getElementById('editModal'))
}

function closeEditModal() {
  closeModal(document.getElementById('editModal'))
  currentEditingProduct = null
  productImages = []
}

function deleteProduct(productId) {
  const product = products.find(p => p.id === productId)
  if (!product) return
  currentDeletingProduct = product
  document.getElementById('deleteProductName').textContent = product.name
  openModal(document.getElementById('deleteModal'))
}

function closeDeleteModal() {
  closeModal(document.getElementById('deleteModal'))
  currentDeletingProduct = null
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

function handleEditSubmit(e) {
  e.preventDefault()
  if (!currentEditingProduct) return
  const formData = {
    name: document.getElementById('editProductName').value,
    category: document.getElementById('editProductCategory').value,
    price: parseFloat(document.getElementById('editProductPrice').value),
    originalPrice: document.getElementById('editProductOriginalPrice').value ? parseFloat(document.getElementById('editProductOriginalPrice').value) : null,
    stock: parseInt(document.getElementById('editProductStock').value),
    status: document.getElementById('editProductStatus').value,
    sizes: Array.from(document.querySelectorAll('#editSizesContainer input:checked')).map(cb => cb.value),
    image: productImages[0],
    additionalImages: productImages.slice(1)
  }
  const productIndex = products.findIndex(p => p.id === currentEditingProduct.id)
  if (productIndex !== -1) {
    products[productIndex] = { ...products[productIndex], ...formData }
  }
  renderProducts()
  closeEditModal()
  Utils.showNotification('Product updated successfully!', 'success')
}

function handleImageChange(e) {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = function (evt) {
      productImages[0] = evt.target.result
      renderProductImages()
    }
    reader.readAsDataURL(file)
  }
}

function handleAddNewImage(e) {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = function (evt) {
      productImages.push(evt.target.result)
      renderProductImages()
      Utils.showNotification('New image added successfully!', 'success')
    }
    reader.readAsDataURL(file)
  }
}

function renderProductImages() {
  const container = document.getElementById('productImagesContainer')
  container.innerHTML = productImages.map((image, index) => `
    <div class="product-image-item relative group">
      <img src="${image}" alt="Product image ${index + 1}" class="w-20 h-20 rounded-lg object-cover border border-gray-200 dark:border-[#3a3a3a]">
      ${index > 0 ? `
        <button type="button" onclick="removeImage(${index})" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <i class="ph ph-x text-xs"></i>
        </button>
      ` : ''}
    </div>
  `).join('')
}

function removeImage(index) {
  if (index > 0 && index < productImages.length) {
    productImages.splice(index, 1)
    renderProductImages()
  }
}

function populateEditSizes(selectedSizes, category) {
  const container = document.getElementById('editSizesContainer')
  let availableSizes = []
  switch (category) {
    case 't-shirts':
    case 'jackets':
    case 'dresses':
      availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
      break
    case 'pants':
      availableSizes = ['28', '30', '32', '34', '36', '38', '40']
      break
    case 'shoes':
      availableSizes = ['6', '7', '8', '9', '10', '11', '12', '13']
      break
    case 'accessories':
      availableSizes = ['S', 'M', 'L']
      break
    default:
      availableSizes = ['S', 'M', 'L', 'XL']
  }
  container.innerHTML = availableSizes.map(size => `
    <label class="flex items-center space-x-2 cursor-pointer">
      <input type="checkbox" value="${size}" ${selectedSizes.includes(size) ? 'checked' : ''} class="red-checkbox">
      <span class="text-sm text-gray-700 dark:text-gray-300">${size}</span>
    </label>
  `).join('')
}

function confirmDelete() {
  if (!currentDeletingProduct) return
  const productIndex = products.findIndex(p => p.id === currentDeletingProduct.id)
  if (productIndex !== -1) {
    products.splice(productIndex, 1)
  }
  renderProducts()
  closeDeleteModal()
  Utils.showNotification('Product deleted successfully!', 'success')
}

console.log('👕 Clothes4U Products page loaded successfully!')
