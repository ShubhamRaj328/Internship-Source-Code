let selectedSizes = []
let uploadedImages = []

document.addEventListener('DOMContentLoaded', function () {
  setupProductEventListeners()
})

function setupProductEventListeners() {
  const uploadArea = document.getElementById('uploadArea')
  const imageInput = document.getElementById('imageInput')
  uploadArea.addEventListener('click', () => imageInput.click())
  uploadArea.addEventListener('dragover', handleDragOver)
  uploadArea.addEventListener('dragleave', handleDragLeave)
  uploadArea.addEventListener('drop', handleDrop)
  imageInput.addEventListener('change', handleFileSelect)
  document.querySelectorAll('.size-option').forEach(option => { option.addEventListener('click', toggleSize) })
  document.getElementById('addProductForm').addEventListener('submit', handleSubmit)
  document.getElementById('previewBtn').addEventListener('click', showPreview)
  document.getElementById('closePreview').addEventListener('click', closePreview)
}

function handleDragOver(e) { e.preventDefault(); e.currentTarget.classList.add('dragover') }
function handleDragLeave(e) { e.currentTarget.classList.remove('dragover') }
function handleDrop(e) { e.preventDefault(); e.currentTarget.classList.remove('dragover'); handleFiles(e.dataTransfer.files) }
function handleFileSelect(e) { handleFiles(e.target.files) }
function handleFiles(files) {
  Array.from(files).forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => { addImagePreview(e.target.result, file.name, file) }
      reader.readAsDataURL(file)
    }
  })
}

function addImagePreview(src, name, file) {
  uploadedImages.push(file)
  const previewDiv = document.createElement('div')
  previewDiv.className = 'relative bg-gray-100 rounded-lg overflow-hidden dark:bg-[#2a2a2a]'
  previewDiv.dataset.imageIndex = uploadedImages.length - 1
  previewDiv.innerHTML = `
    <img src="${src}" alt="${name}" class="w-full h-32 object-cover">
    <button type="button" class="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition-colors" onclick="removeImage(this)">
      <i class="ph ph-x text-xs"></i>
    </button>
  `
  document.getElementById('imagePreviews').appendChild(previewDiv)
}

function removeImage(btn) {
  const previewDiv = btn.closest('.relative')
  const imageIndex = parseInt(previewDiv.dataset.imageIndex)
  uploadedImages.splice(imageIndex, 1)
  previewDiv.remove()
  const remainingPreviews = document.querySelectorAll('#imagePreviews .relative')
  remainingPreviews.forEach((preview, index) => { preview.dataset.imageIndex = index })
  const imageInput = document.getElementById('imageInput')
  imageInput.value = ''
}

function toggleSize() {
  const size = this.dataset.size
  if (this.classList.contains('selected')) {
    this.classList.remove('selected')
    this.classList.remove('bg-primary-600', 'text-white', 'border-primary-600')
    this.classList.add('bg-gray-100', 'border-gray-300', 'dark:bg-[#2a2a2a]', 'dark:border-[#3a3a3a]', 'dark:text-gray-300')
    selectedSizes = selectedSizes.filter(s => s !== size)
  } else {
    this.classList.add('selected')
    this.classList.remove('bg-gray-100', 'border-gray-300', 'dark:bg-[#2a2a2a]', 'dark:border-[#3a3a3a]', 'dark:text-gray-300')
    this.classList.add('bg-primary-600', 'text-white', 'border-primary-600')
    selectedSizes.push(size)
  }
  document.getElementById('selectedSizes').value = selectedSizes.join(',')
}

function handleSubmit(e) {
  e.preventDefault()
  const submitBtn = document.getElementById('submitBtn')
  const submitBtnText = document.getElementById('submitBtnText')
  const submitLoader = document.getElementById('submitLoader')
  const successMessage = document.getElementById('successMessage')
  if (uploadedImages.length === 0) { Utils.showNotification('Please upload at least one product image', 'error'); return }
  if (selectedSizes.length === 0) { Utils.showNotification('Please select at least one size', 'error'); return }
  submitBtnText.textContent = 'Adding Product...'
  submitLoader.classList.remove('hidden')
  submitBtn.disabled = true
  setTimeout(() => {
    successMessage.classList.remove('hidden')
    submitBtnText.textContent = 'Product Added!'
    submitLoader.classList.add('hidden')
    Utils.showNotification('Product added successfully!', 'success')
    setTimeout(() => { resetForm() }, 3000)
  }, 2000)
}

function resetForm() {
  document.getElementById('addProductForm').reset()
  document.getElementById('imagePreviews').innerHTML = ''
  uploadedImages = []
  selectedSizes = []
  document.querySelectorAll('.size-option').forEach(option => {
    option.classList.remove('selected', 'bg-primary-600', 'text-white', 'border-primary-600')
    option.classList.add('bg-gray-100', 'border-gray-300', 'dark:bg-[#2a2a2a]', 'dark:border-[#3a3a3a]', 'dark:text-gray-300')
  })
  document.getElementById('selectedSizes').value = ''
  document.getElementById('imageInput').value = ''
  document.getElementById('successMessage').classList.add('hidden')
  document.getElementById('submitBtnText').textContent = 'Add Product'
  document.getElementById('submitBtn').disabled = false
}

function showPreview() {
  const formData = new FormData(document.getElementById('addProductForm'))
  const previewContent = document.getElementById('previewContent')
  const title = formData.get('title') || 'Product Title'
  const category = formData.get('category') || 'Category'
  const price = formData.get('price') || '0.00'
  const discount = formData.get('discount') || '0'
  const description = formData.get('description') || 'Product description'
  const stock = formData.get('stock') || '0'
  const discountedPrice = discount > 0 ? (price * (1 - discount / 100)).toFixed(2) : null
  let imagePreviewsHTML = ''
  if (uploadedImages.length > 0) {
    const previewImages = document.querySelectorAll('#imagePreviews img')
    const imagesToShow = Math.min(4, previewImages.length)
    for (let i = 0; i < imagesToShow; i++) {
      imagePreviewsHTML += `
        <div class="bg-gray-200 rounded-lg overflow-hidden dark:bg-[#2a2a2a]">
          <img src="${previewImages[i].src}" alt="Product Image ${i + 1}" class="w-full h-32 object-cover">
        </div>
      `
    }
    if (uploadedImages.length > 4) {
      imagePreviewsHTML = imagePreviewsHTML.replace(
        /<div class="bg-gray-200 rounded-lg overflow-hidden dark:bg-\[#2a2a2a\]">\s*<img[^>]*>\s*<\/div>$/,
        `<div class="bg-gray-200 rounded-lg overflow-hidden relative dark:bg-[#2a2a2a]">
          <img src="${previewImages[3].src}" alt="Product Image 4" class="w-full h-32 object-cover">
          <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span class="text-white font-semibold text-lg">+${uploadedImages.length - 3}</span>
          </div>
        </div>`
      )
    }
  } else {
    imagePreviewsHTML = `
      <div class="bg-gray-200 rounded-lg h-32 flex items-center justify-center dark:bg-[#2a2a2a] col-span-2">
        <div class="text-center">
          <i class="ph ph-image text-gray-400 text-3xl mb-2"></i>
          <p class="text-gray-500 text-sm">No images uploaded</p>
        </div>
      </div>
    `
  }
  previewContent.innerHTML = `
    <div class="space-y-6">
      <div class="grid grid-cols-2 gap-4">
        ${imagePreviewsHTML}
      </div>
      <div>
        <h4 class="text-2xl font-bold text-gray-900 mb-2 dark:text-gray-100">${title}</h4>
        <p class="text-gray-600 mb-4 dark:text-gray-400">${getCategoryName(category)}</p>
        <div class="flex items-center gap-4 mb-4">
          ${discountedPrice ? `
            <span class="text-2xl font-bold text-primary-600">Rs ${discountedPrice}</span>
            <span class="text-lg text-gray-500 line-through">Rs ${price}</span>
            <span class="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-semibold dark:bg-[rgba(220,38,38,0.2)] dark:text-red-400">${discount}% OFF</span>
          ` : `
            <span class="text-2xl font-bold text-gray-900 dark:text-gray-100">Rs ${price}</span>
          `}
        </div>
        <p class="text-gray-700 mb-4 dark:text-gray-300">${description}</p>
        <div class="mb-4">
          <span class="font-semibold dark:text-gray-100">Available Sizes: </span>
          <span class="text-gray-600 dark:text-gray-400">${selectedSizes.join(', ') || 'No sizes selected'}</span>
        </div>
        <div class="mb-4">
          <span class="font-semibold dark:text-gray-100">Stock: </span>
          <span class="text-gray-600 dark:text-gray-400">${stock} items</span>
        </div>
        ${uploadedImages.length > 0 ? `
          <div class="text-sm text-gray-500 dark:text-gray-400">
            <i class="ph ph-images mr-1"></i>
            ${uploadedImages.length} image${uploadedImages.length !== 1 ? 's' : ''} uploaded
          </div>
        ` : ''}
      </div>
    </div>
  `
  openModal(document.getElementById('previewModal'))
}

function closePreview() { closeModal(document.getElementById('previewModal')) }

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

function getCategoryName(category) {
  const categories = { 't-shirts': 'T-Shirts', 'pants': 'Pants', 'jackets': 'Jackets', 'accessories': 'Accessories', 'shoes': 'Shoes', 'dresses': 'Dresses' }
  return categories[category] || category
}

console.log('🏪 Add Product page specific functionality loaded!')
