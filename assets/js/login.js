document.getElementById('togglePassword').addEventListener('click', function () {
  const passwordField = document.getElementById('password')
  const toggleIcon = this.querySelector('i')
  if (passwordField.type === 'password') { passwordField.type = 'text'; toggleIcon.classList.remove('ph-eye'); toggleIcon.classList.add('ph-eye-slash') }
  else { passwordField.type = 'password'; toggleIcon.classList.remove('ph-eye-slash'); toggleIcon.classList.add('ph-eye') }
})

function showNotification(title, message, type = 'info') {
  const notification = document.getElementById('notification')
  const icon = document.getElementById('notificationIcon')
  const titleEl = document.getElementById('notificationTitle')
  const messageEl = document.getElementById('notificationMessage')
  titleEl.textContent = title
  messageEl.textContent = message
  const icons = { success: '<i class="ph ph-check-circle text-green-600 text-xl"></i>', error: '<i class="ph ph-warning-circle text-red-600 text-xl"></i>', info: '<i class="ph ph-info text-blue-600 text-xl"></i>', warning: '<i class="ph ph-warning text-yellow-600 text-xl"></i>' }
  icon.innerHTML = icons[type] || icons.info
  notification.classList.remove('hide')
  notification.classList.add('show')
  setTimeout(() => { hideNotification() }, 5000)
}

function hideNotification() {
  const notification = document.getElementById('notification')
  notification.classList.remove('show')
  notification.classList.add('hide')
}

document.getElementById('closeNotification').addEventListener('click', hideNotification)

document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault()
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  const loginBtn = document.getElementById('loginBtn')
  const loginBtnText = document.getElementById('loginBtnText')
  const loginLoader = document.getElementById('loginLoader')
  const errorMessage = document.getElementById('errorMessage')
  const successMessage = document.getElementById('successMessage')
  errorMessage.classList.add('hidden')
  successMessage.classList.add('hidden')
  loginBtnText.classList.add('hidden')
  loginLoader.classList.remove('hidden')
  loginBtn.disabled = true
  setTimeout(() => {
    if (email === 'admin@clothes4u.com' && password === 'admin123') {
      successMessage.classList.remove('hidden')
      loginLoader.classList.add('hidden')
      loginBtnText.innerHTML = '<i class="ph ph-check mr-2"></i>Success!'
      loginBtnText.classList.remove('hidden')
      showNotification('Login Successful', 'Welcome back! Redirecting to dashboard...', 'success')
      setTimeout(() => { window.location.href = 'index.html' }, 2000)
    } else {
      errorMessage.classList.remove('hidden')
      loginLoader.classList.add('hidden')
      loginBtnText.innerHTML = '<i class="ph ph-sign-in mr-2"></i>Sign In'
      loginBtnText.classList.remove('hidden')
      loginBtn.disabled = false
      showNotification('Login Failed', 'Please check your credentials and try again.', 'error')
    }
  }, 1500)
})

document.querySelectorAll('.input-field').forEach(input => {
  input.addEventListener('focus', function () { const icon = this.parentElement.querySelector('i'); if (icon && !icon.closest('button')) icon.style.color = '#dc2626' })
  input.addEventListener('blur', function () { const icon = this.parentElement.querySelector('i'); if (icon && !icon.closest('button') && !this.value) icon.style.color = '#9ca3af' })
})

function openModal(modalId) { const modal = document.getElementById(modalId); document.body.style.overflow = 'hidden'; modal.classList.add('show') }
function closeModal(modalId) { const modal = document.getElementById(modalId); document.body.style.overflow = ''; modal.classList.remove('show') }

document.getElementById('contactSupportBtn').addEventListener('click', function () { openModal('contactSupportModal') })
document.getElementById('userGuideBtn').addEventListener('click', function () { openModal('userGuideModal') })

document.querySelectorAll('.close-modal').forEach(button => { button.addEventListener('click', function () { const modal = this.closest('.modal'); closeModal(modal.id) }) })
document.querySelectorAll('.modal').forEach(modal => { modal.addEventListener('click', function (e) { if (e.target === this) closeModal(this.id) }) })

document.getElementById('startChatBtn').addEventListener('click', function () { showNotification('Live Chat', 'Connecting to a support agent...', 'info'); setTimeout(() => { showNotification('Live Chat', 'All agents are currently busy. Please try again later.', 'warning') }, 3000) })

document.addEventListener('keydown', function (e) {
  if (e.altKey && e.key === 'l') { e.preventDefault(); document.getElementById('email').focus() }
  if (e.key === 'Escape') {
    const openModalEl = document.querySelector('.modal.show')
    if (openModalEl) closeModal(openModalEl.id)
    else { document.getElementById('loginForm').reset(); hideNotification() }
  }
})

document.querySelector('.form-container').addEventListener('dblclick', function () {
  document.getElementById('email').value = 'admin@clothes4u.com'
  document.getElementById('password').value = 'admin123'
  showNotification('Demo Credentials', 'Demo credentials have been filled automatically.', 'info')
})

console.log('👕 Clothes4U Login Page loaded successfully!')
