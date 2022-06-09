const details = document.getElementsByTagName('details')
for (const detail of Array.from(details)) {
 const key = detail.innerText + '#open'
 detail.addEventListener('click', e => {
  localStorage.setItem(key, detail.open ? '0' : '1')
 })
 const current = localStorage.getItem(key)
 if (current === '1') {
  detail.open = true
 }
}

