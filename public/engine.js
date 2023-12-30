function markdownToHtml(text) {
 // H1
 text = text.replace(/^# (.*$)/gm, '<h2>$1</h2>')

 // H2
 text = text.replace(/^## (.*$)/gm, '<h3>$1</h3>')

 // H3
 text = text.replace(/^### (.*$)/gm, '<h4>$1</h4>')

 // H4
 text = text.replace(/^#### (.*$)/gm, '<h5>$1</h5>')

 // H5
 text = text.replace(/^##### (.*$)/gm, '<h6>$1</h6>')

 // Bold
 text = text.replace(/\*\*(\S+)\*\*/g, '<b>$1</b>')

 // Italic
 text = text.replace(/\*([^*]+)\*/g, '<i>$1</i>')

 // Links
 text = text.replace(
  /\[([^]]+)\]\(https?:\/\/\S+\)/g,
  '<a href="$2">$1</a>'
 )

 // Lists
 text = text.replace(/^-\s(.*$)/gm, '<li>$1</li>')

 return text
}

window.addEventListener('keydown', (event) => {
 if (event.key === ' ' && event.target.tagName === 'A') {
  event.preventDefault()
  window.location.href = event.target.getAttribute('href')
 }

 if (event.key === 'Escape') {
  event.preventDefault()
  window.location.href = '/#'
 }
})

const container = document.createElement('div')
container.classList.add('engine-container')
document.body.appendChild(container)

const title = document.createElement('h2')
title.textContent = 'Nathanael Ferrero'
container.appendChild(title)

const sections = document.createElement('div')
sections.classList.add('engine-sections')
container.appendChild(sections)

const backToHome = document.createElement('a')
backToHome.setAttribute('href', '/#')
backToHome.classList.add('back-to-home')
document.body.appendChild(backToHome)
backToHome.textContent = '‹'

const content = document.createElement('div')
content.classList.add('content')
container.appendChild(content)

for (const section of Object.keys(globalThis.MAIN).sort()) {
 const link = document.createElement('a')
 link.setAttribute('href', `/#/${section.toLowerCase()}`)
 link.textContent = section
 sections.appendChild(link)
}

addEventListener('hashchange', route)

function route() {
 for (const link of Array.from(sections.children)) {
  if (link.tagName === 'A') {
   if (
    `/${location.hash}`.startsWith(
     link.getAttribute('href')
    )
   ) {
    link.classList.add('current')
   } else {
    link.classList.remove('current')
   }
  }
 }
 content.innerHTML = ''
 backToHome.classList.add('visible')
 switch (location.hash) {
  case '':
  case '#':
  case '#/':
   backToHome.classList.remove('visible')
   content.innerHTML = `
     <p class="info-text">Website built with assistance from with https://claude.ai and https://chat.openai.com</p>
     `
   break
  case '#/coaching':
   content.innerHTML = globalThis.MAIN.Coaching
   break
  case '#/contact':
   content.innerHTML = globalThis.MAIN.Contact
   break
  case '#/software':
   content.innerHTML = globalThis.MAIN.Software
   break
  case '#/writing':
   content.innerHTML = globalThis.MAIN.Writing
   break
 }
 container.scrollTo({ behavior: 'smooth', top: 0 })
}

route()
