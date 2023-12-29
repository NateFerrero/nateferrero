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

for (const section of 'Coaching Contact Software Writing'.split(
 ' '
)) {
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
 switch (location.hash) {
  case '#/coaching':
   content.innerHTML = `<p>I offer live coaching on a variety of subjects. My coaching fee is <b>USD$80<sup>.00</sup>/hr</b>.</p>
    <p>You may also purchase blocks of 10 hours in advance for a <b>USD$600<sup>.00</sup></b> flat fee.</p>
    <p>I meet with clients virtually using Google Meet, Zoom, or Jump Chat. Sessions are scheduled Monday through Friday, 1pm to 9pm Eastern Time.</p>
    <p>For those in Michigan, United States, I also offer in-person consultations in Ann Arbor.</p>
    <p>Sessions are usually 1 or 2 hours long, and as a client, you can ask me questions by text message and expect a reply within 24 hours.</p>
    <h3>Coaching subjects</h3>
    <ul>
     <li>AI-assisted discovery of life purpose &lsquo;Ikigai&rsquo; &mdash; identify a career that will motivate and inspire you to succeed</li>
     <li>JavaScript, TypeScript, and web development fundamentals; fixing software bugs in real time; learning to code by solving coding challenges together</li>
     <li>Sensitivity and spiritual growth; ethical living</li>
     <li>Social skills and personal development</li>
     <li>Identifying and transcending life obstacles</li>
     </ul>
    <p><a href="/#/contact">Contact to schedule your first session &rarr;</p>`
   break
  case '#/contact':
   content.innerHTML = `
   <p>For questions related to <a target="_blank" href="https://tagme.in">https://tagme.in</a>, please email <a href="mailto:nate@tagme.in">nate<span>@</span>tagme.in</a></p>
   <p>For all other inquiries, email <a href="mailto:hello@nateferrero.com">hello<span>@</span>nateferrero.com</a></p>
   <p>Text or phone call at <b>+1 (323) 283-9179</b></p>
   <p>When writing, please introduce yourself and state your request in the first message</p>
    <h3>Social media</h3>
    <ul>
     <li><a target="_blank" href="https://www.codementor.io/@nateferrero">Codementor</a></li>
     <li><a target="_blank" href="https://www.facebook.com/nateferrero/">Facebook</a></li>
     <li><a target="_blank" href="https://github.com/NateFerrero">GitHub</a></li>
     <li><a target="_blank" href="https://ailaai.app/nate">Hi Town</a></li>
     <li><a target="_blank" href="https://www.instagram.com/nateferrero/">Instagram</a></li>
     <li><a target="_blank" href="https://www.linkedin.com/in/nateferrero/">LinkedIn</a></li>
     <li><a target="_blank" href="https://stackoverflow.com/users/1008429/nate-ferrero">Stack Overflow</a></li>
     <li><a target="_blank" href="https://twitter.com/NateFerrero">Twitter / X</a></li>
     <li><a target="_blank" href="https://www.youtube.com/NateFerrero">YouTube</a></li>
    </ul>
    `
   break
  case '#/software':
   content.innerHTML = `
    <h3>Mission statement</h3>
    <p>To possess deep understanding of <a target="_blank" href="https://kk.org/thetechnium/">The Technium</a>, and identify improvements to be made that cause positive impact on an individual, society, or the world.</p>
    <h3>Why is this my mission?</h3>
    <p>Because as a mammal, I have a limited lifespan. Patches of code I contribute to the Technium will outlive me.</p>
    <h3>Software projects</h3>
    <ul>
     <li><a target="_blank" href="https://civil-compute.com/">Civil Compute</a> - a software development and hosting platform</li>
     <li><a target="_blank" href="https://civil-lang.org/">Civil Language</a> - a programming language and development environment optimized for conciseness, implemented in JavaScript</li>
     <li><a target="_blank" href="https://crown-lang.org/">Crown</a> - a programming metalanguage optimized for ease of use and ability to communicate verbally, implemented in JavaScript</li>
     <li><a target="_blank" href="https://journal.network/">Journal Network</a> - a slow text-only social network</li>
     <li><a target="_blank" href="https://listmanager.dev/">List Manager</a> - an information organizer</li>
     <li><a target="_blank" href="https://tagme.in/">TagMeIn</a> - a social network for software developers</li>
     <li><a target="_blank" href="https://realisticabundance.com/">Realistic Abundance</a> - a conceptual framework for invoking global prosperity</li>
    </ul>
    <p>See <a href="https://github.com/tagmein/">TagMeIn on GitHub</a> for more projects.</p>
     `
   break
  case '#/writing':
   content.innerHTML = `
    <h3>🚧 Under construction 🚧</h3>
   `
   break
 }
 backToHome.classList[
  content.innerHTML === '' ? 'remove' : 'add'
 ]('visible')
 container.scrollTo({ behavior: 'smooth', top: 0 })
}

route()
