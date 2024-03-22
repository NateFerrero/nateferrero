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

async function renderNavigation() {
 await new Promise((r) => {
  const int = setInterval(function () {
   if ('MAIN' in globalThis) {
    clearInterval(int)
    r()
   }
  }, 50)
 })
 for (const section of Object.keys(
  globalThis.MAIN
 ).sort()) {
  const link = document.createElement('a')
  link.setAttribute('href', `/#/${section.toLowerCase()}`)
  link.textContent = section
  sections.appendChild(link)
 }
 route()
}

renderNavigation()
addEventListener('hashchange', route)

function route() {
 for (const link of Array.from(sections.children)) {
  if (link.tagName === 'A') {
   if (
    location.hash.length > 1 &&
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
 if (location.hash.startsWith('#/journal/entry/')) {
  const time = parseInt(location.hash.split('/').pop())
  content.appendChild(journalNetwork.viewEntry(time))
 } else if (location.hash.startsWith('#/journal/tag/')) {
  const tag = decodeURIComponent(
   location.hash.split('/').pop()
  )
  content.appendChild(journalNetwork.viewTag(tag))
 } else {
  switch (location.hash) {
   case '':
   case '#':
   case '#/':
    backToHome.classList.remove('visible')
    content.innerHTML = `
    <h3>Software engineer</h3>
    <p>Currently building Tag Me In, a social network with channels, an example channel is <a href="https://tagme.in/#/WorldChangingIdeas" target="_blank">#World Changing Ideas</a>.</p>
    <h4>Subscribe to my writing</h4>
    <details>
     <summary>Technology and software</summary>
     <iframe src="https://toolsofthetechnium.substack.com/embed" width="100%" height="480" style="border:1px solid #EEE; background:white;" frameborder="0" scrolling="no"></iframe>
    </details>
    <details>
     <summary>Spirituality and religion</summary>
    <iframe src="https://landingatzion.substack.com/embed" width="100%" height="480" style="border:1px solid #EEE; background:white;" frameborder="0" scrolling="no"></iframe>
    </details>
    <p class="info-text">Website built with assistance from with https://claude.ai and https://chat.openai.com</p>
     `
    break
   case '#/coaching':
    content.innerHTML = globalThis.MAIN.Coaching
    break
   case '#/contact':
    content.innerHTML = globalThis.MAIN.Contact
    break
   case '#/journal':
    content.appendChild(journalNetwork.view())
    break
   case '#/software':
    content.innerHTML = globalThis.MAIN.Software
    break
  }
 }
 container.scrollTo({ behavior: 'smooth', top: 0 })
}
