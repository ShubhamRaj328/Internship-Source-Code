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

document.getElementById('forgotPasswordForm').addEventListener('submit', function (e) {
  e.preventDefault()
  const email = document.getElementById('email').value
  const submitBtn = document.getElementById('submitBtn')
  const submitBtnText = document.getElementById('submitBtnText')
  const submitLoader = document.getElementById('submitLoader')
  const errorMessage = document.getElementById('errorMessage')
  const successMessage = document.getElementById('successMessage')
  errorMessage.classList.add('hidden')
  successMessage.classList.add('hidden')
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) { errorMessage.classList.remove('hidden'); return }
  submitBtnText.classList.add('hidden')
  submitLoader.classList.remove('hidden')
  submitBtn.disabled = true
  setTimeout(() => {
    successMessage.classList.remove('hidden')
    submitLoader.classList.add('hidden')
    submitBtnText.innerHTML = '<i class="ph ph-check mr-2"></i>Email Sent'
    submitBtnText.classList.remove('hidden')
    showNotification('Email Sent', 'Password reset instructions have been sent to your email.', 'success')
    document.getElementById('email').value = ''
    setTimeout(() => { submitBtnText.innerHTML = '<i class="ph ph-paper-plane-right mr-2"></i>Send Reset Link'; submitBtn.disabled = false }, 3000)
  }, 1500)
})

document.querySelectorAll('.input-field').forEach(input => {
  input.addEventListener('focus', function () { const icon = this.parentElement.querySelector('i'); if (icon && !icon.closest('button')) icon.style.color = '#dc2626' })
  input.addEventListener('blur', function () { const icon = this.parentElement.querySelector('i'); if (icon && !icon.closest('button') && !this.value) icon.style.color = '#9ca3af' })
})

document.addEventListener('keydown', function (e) {
  if (e.altKey && e.key === 'e') { e.preventDefault(); document.getElementById('email').focus() }
  if (e.key === 'Escape') { document.getElementById('forgotPasswordForm').reset(); hideNotification() }
})

console.log('👕 Clothes4U Forgot Password Page loaded successfully!')
