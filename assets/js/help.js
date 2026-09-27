function toggleFAQ(id) {
  const answer = document.getElementById(`answer-${id}`)
  const icon = document.getElementById(`icon-${id}`)
  document.querySelectorAll('.faq-answer').forEach(item => { if (item.id !== `answer-${id}`) item.classList.remove('open') })
  document.querySelectorAll('.faq-icon').forEach(item => { if (item.id !== `icon-${id}`) item.classList.remove('rotate') })
  if (answer) answer.classList.toggle('open')
  if (icon) icon.classList.toggle('rotate')
}

console.log('👕 Clothes4U Help Center loaded successfully!')
